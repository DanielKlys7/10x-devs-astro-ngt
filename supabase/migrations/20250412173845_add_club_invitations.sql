-- Migracja: Dodanie systemu zaproszeń do klubów i usprawnienie RBAC
-- Opis: Tworzy tabelę club_invitations oraz funkcje pomocnicze dla systemu ról
-- Data: 2025-04-12

-- 0. Aktualizacja ograniczenia dla global_role w tabeli auth.users

-- Najpierw usuwamy istniejące ograniczenie
alter table auth.users drop constraint if exists auth_users_global_role_check;

-- Dodajemy nowe ograniczenie z tylko dwoma rolami
alter table auth.users add constraint auth_users_global_role_check 
    check (global_role in ('administrator', 'user'));

-- Aktualizujemy istniejące rekordy, by były zgodne z nowym ograniczeniem
update auth.users set global_role = 'user' 
    where global_role in ('sportsClubAdmin', 'trainer') 
    or global_role is null;

-- 1. Utworzenie funkcji pomocniczych dla RBAC

-- Funkcja sprawdzająca globalną rolę użytkownika
create or replace function auth.user_role()
returns text as $$
begin
    return coalesce(
        (select global_role from auth.users where id = auth.uid()),
        'user'
    );
end;
$$ language plpgsql security definer;

-- Funkcja sprawdzająca czy użytkownik jest administratorem systemu
create or replace function auth.is_admin()
returns boolean as $$
begin
    return (select auth.user_role()) = 'administrator';
end;
$$ language plpgsql security definer;

-- Funkcja sprawdzająca rolę użytkownika w konkretnym klubie
create or replace function auth.user_club_role(club_id uuid)
returns text as $$
begin
    return (
        select membership_role
        from memberships 
        where user_id = auth.uid() 
        and memberships.club_id = $1
        limit 1
    );
end;
$$ language plpgsql security definer;

-- Funkcja sprawdzająca czy użytkownik jest administratorem klubu
create or replace function auth.is_club_admin(club_id uuid)
returns boolean as $$
begin
    return exists (
        select 1
        from memberships 
        where user_id = auth.uid() 
        and memberships.club_id = $1
        and membership_role = 'admin'
    );
end;
$$ language plpgsql security definer;

-- Funkcja sprawdzająca czy użytkownik jest członkiem klubu
create or replace function auth.is_club_member(club_id uuid)
returns boolean as $$
begin
    return exists (
        select 1
        from memberships 
        where user_id = auth.uid() 
        and memberships.club_id = $1
    );
end;
$$ language plpgsql security definer;

-- 2. Utworzenie tabeli zaproszeń do klubów

create table club_invitations (
    id uuid primary key default uuid_generate_v4(),
    club_id uuid not null references sport_clubs(id) on delete cascade,
    email varchar(255) not null,
    target_role varchar(50) not null,
    token uuid not null default uuid_generate_v4(),
    created_by uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null default (now() + interval '7 days'),
    accepted_at timestamptz,
    constraint valid_target_role check (target_role in ('admin', 'trainer', 'member'))
);

comment on table club_invitations is 'Przechowuje zaproszenia do klubów sportowych wraz z tokenami i docelowymi rolami';
comment on column club_invitations.id is 'Unikalny identyfikator zaproszenia';
comment on column club_invitations.club_id is 'Identyfikator klubu, do którego zaproszenie jest kierowane';
comment on column club_invitations.email is 'Adres email zaproszonej osoby';
comment on column club_invitations.target_role is 'Rola, którą otrzyma użytkownik po akceptacji zaproszenia (admin, trainer, member)';
comment on column club_invitations.token is 'Unikalny token używany do walidacji zaproszenia';
comment on column club_invitations.created_by is 'Identyfikator użytkownika, który utworzył zaproszenie';
comment on column club_invitations.created_at is 'Data utworzenia zaproszenia';
comment on column club_invitations.expires_at is 'Data wygaśnięcia zaproszenia (domyślnie 7 dni od utworzenia)';
comment on column club_invitations.accepted_at is 'Data akceptacji zaproszenia (null jeśli nie zaakceptowano)';

-- 3. Utworzenie indeksów dla tabeli zaproszeń

create index idx_club_invitations_club_id on club_invitations(club_id);
create index idx_club_invitations_email on club_invitations(email);
create index idx_club_invitations_token on club_invitations(token);
create index idx_club_invitations_expires_at on club_invitations(expires_at);

-- 4. Włączenie Row Level Security dla tabeli zaproszeń

alter table club_invitations enable row level security;

-- 5. Utworzenie polityk RLS dla tabeli zaproszeń

-- Administratorzy systemu mogą widzieć wszystkie zaproszenia
create policy "Administratorzy mogą widzieć wszystkie zaproszenia" 
    on club_invitations for select 
    using (auth.is_admin());

-- Administratorzy klubu mogą widzieć zaproszenia do swojego klubu
create policy "Administratorzy klubu mogą widzieć zaproszenia do swojego klubu" 
    on club_invitations for select 
    using (
        exists (
            select 1 from memberships 
            where club_id = club_invitations.club_id 
            and user_id = auth.uid() 
            and membership_role = 'admin'
        )
    );

-- Administratorzy systemu mogą tworzyć zaproszenia dla dowolnego klubu
create policy "Administratorzy systemu mogą tworzyć zaproszenia" 
    on club_invitations for insert 
    with check (auth.is_admin());

-- Administratorzy klubu mogą tworzyć zaproszenia tylko dla swojego klubu
create policy "Administratorzy klubu mogą tworzyć zaproszenia dla swojego klubu" 
    on club_invitations for insert 
    with check (
        exists (
            select 1 from memberships 
            where club_id = club_invitations.club_id 
            and user_id = auth.uid() 
            and membership_role = 'admin'
        )
    );

-- 6. Utworzenie funkcji do weryfikacji i akceptacji zaproszenia

create or replace function accept_club_invitation(invitation_token uuid)
returns jsonb as $$
declare
    v_invitation record;
    v_membership_id uuid;
    result jsonb;
begin
    -- Pobierz dane zaproszenia
    select * into v_invitation 
    from club_invitations 
    where token = invitation_token
    and accepted_at is null
    and expires_at > now();
    
    -- Sprawdź czy zaproszenie istnieje i jest ważne
    if v_invitation.id is null then
        return jsonb_build_object(
            'success', false,
            'message', 'Zaproszenie jest nieważne lub wygasło'
        );
    end if;
    
    -- Sprawdź czy email zaproszenia zgadza się z emailem zalogowanego użytkownika
    if v_invitation.email != (select email from auth.users where id = auth.uid()) then
        return jsonb_build_object(
            'success', false,
            'message', 'Zaproszenie zostało wysłane na inny adres email'
        );
    end if;
    
    -- Sprawdź czy użytkownik nie jest już członkiem tego klubu
    if exists (
        select 1 from memberships
        where user_id = auth.uid()
        and club_id = v_invitation.club_id
    ) then
        return jsonb_build_object(
            'success', false,
            'message', 'Jesteś już członkiem tego klubu'
        );
    end if;
    
    -- Dodaj użytkownika do klubu z odpowiednią rolą
    insert into memberships (
        user_id,
        club_id,
        membership_role,
        managed_by
    ) values (
        auth.uid(),
        v_invitation.club_id,
        v_invitation.target_role,
        v_invitation.created_by
    )
    returning id into v_membership_id;
    
    -- Oznacz zaproszenie jako zaakceptowane
    update club_invitations
    set accepted_at = now()
    where id = v_invitation.id;
    
    return jsonb_build_object(
        'success', true,
        'message', 'Zaproszenie zostało zaakceptowane',
        'membership_id', v_membership_id,
        'club_id', v_invitation.club_id,
        'role', v_invitation.target_role
    );
end;
$$ language plpgsql security definer; 