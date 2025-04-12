-- Migracja: Usunięcie tabeli users i integracja z Supabase Auth
-- Opis: Usuwa własną tabelę users i dostosowuje system do korzystania z auth.users
-- Data: 2024-03-27

-- 1. Najpierw tworzymy nową kolumnę global_role w auth.users
alter table auth.users
    add column if not exists global_role varchar(50) check (global_role in ('administrator', 'sportsClubAdmin', 'user', 'trainer'));

-- 2. Aktualizujemy referencje w istniejących tabelach

-- Aktualizacja referencji w memberships
alter table memberships
    drop constraint memberships_user_id_fkey,
    drop constraint memberships_managed_by_fkey,
    add constraint memberships_user_id_fkey
        foreign key (user_id)
        references auth.users(id)
        on delete cascade,
    add constraint memberships_managed_by_fkey
        foreign key (managed_by)
        references auth.users(id)
        on delete cascade;

-- Aktualizacja referencji w class_registrations
alter table class_registrations
    drop constraint class_registrations_user_id_fkey,
    add constraint class_registrations_user_id_fkey
        foreign key (user_id)
        references auth.users(id)
        on delete cascade;

-- Aktualizacja referencji w analytics_logs
alter table analytics_logs
    drop constraint analytics_logs_user_id_fkey,
    add constraint analytics_logs_user_id_fkey
        foreign key (user_id)
        references auth.users(id)
        on delete set null;

-- 3. Aktualizujemy polityki RLS, aby korzystały z auth.users

-- Aktualizacja polityk dla sport_clubs
drop policy if exists "Tylko administratorzy mogą tworzyć kluby" on sport_clubs;
create policy "Tylko administratorzy mogą tworzyć kluby" 
    on sport_clubs for insert 
    with check (
        (select global_role from auth.users where id = auth.uid()) = 'administrator'
    );

-- 4. Usuwamy starą tabelę users
drop table if exists users cascade; 