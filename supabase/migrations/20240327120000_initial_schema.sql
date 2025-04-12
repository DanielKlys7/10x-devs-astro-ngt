-- Migracja: Utworzenie podstawowego schematu bazy danych
-- Opis: Tworzy podstawowe tabele systemu: users, sport_clubs, memberships, pricing_plans, analytics_logs, classes i class_registrations
-- Data: 2024-03-27

-- Włączenie rozszerzenia uuid-ossp
create extension if not exists "uuid-ossp";

-- 1. Najpierw tworzymy wszystkie tabele

-- Tabela: sport_clubs
create table sport_clubs (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    address text,
    contact_email varchar(255) not null,
    contact_phone varchar(50),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- Tabela: users
create table users (
    id uuid primary key default uuid_generate_v4(),
    email varchar(255) not null unique,
    name varchar(255) not null,
    global_role varchar(50) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    constraint valid_global_role check (global_role in ('administrator', 'sportsClubAdmin', 'user', 'trainer'))
);

-- Tabela: memberships
create table memberships (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete cascade,
    club_id uuid not null references sport_clubs(id) on delete cascade,
    membership_role varchar(50) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    managed_by uuid not null references users(id) on delete cascade,
    active_plan_pricing_plan_id uuid,  -- Referencja zostanie dodana później
    active_plan_start_date timestamptz,
    active_plan_expires_at timestamptz,
    auto_renew boolean not null default false,
    constraint uq_membership unique (user_id, club_id),
    constraint valid_membership_role check (membership_role in ('admin', 'trainer', 'member'))
);

-- Tabela: pricing_plans
create table pricing_plans (
    id uuid primary key default uuid_generate_v4(),
    club_id uuid not null references sport_clubs(id) on delete cascade,
    name varchar(255) not null,
    description text,
    price numeric(10,2) not null,
    number_of_entries integer not null,
    duration_in_days integer not null,
    status varchar(20) not null default 'active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    constraint valid_status check (status in ('active', 'inactive', 'archived'))
);

-- Dodanie referencji do pricing_plans w tabeli memberships
alter table memberships 
    add constraint fk_active_plan_pricing_plan 
    foreign key (active_plan_pricing_plan_id) 
    references pricing_plans(id) 
    on delete set null;

-- Tabela: classes
create table classes (
    id uuid primary key default uuid_generate_v4(),
    club_id uuid not null references sport_clubs(id) on delete cascade,
    name varchar(255) not null,
    description text,
    scheduled_at timestamptz not null,
    duration_minutes integer,
    max_seats integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Tabela: class_registrations
create table class_registrations (
    id uuid primary key default uuid_generate_v4(),
    class_id uuid not null references classes(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    registration_date timestamptz not null default now(),
    status varchar(50) not null default 'pending',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_class_registration unique (class_id, user_id),
    constraint valid_registration_status check (status in ('pending', 'confirmed', 'cancelled'))
);

-- Tabela: analytics_logs
create table analytics_logs (
    id uuid primary key default uuid_generate_v4(),
    club_id uuid not null references sport_clubs(id) on delete cascade,
    event_type varchar(100) not null,
    event_data jsonb,
    created_at timestamptz not null default now(),
    user_id uuid references users(id) on delete set null
);

-- 2. Następnie tworzymy wszystkie indeksy

create index idx_sport_clubs_deleted_at on sport_clubs(deleted_at);
create index idx_users_deleted_at on users(deleted_at);
create index idx_pricing_plans_club_id on pricing_plans(club_id);
create index idx_pricing_plans_status on pricing_plans(status);
create index idx_memberships_club_id on memberships(club_id);
create index idx_memberships_user_id on memberships(user_id);
create index idx_classes_club_id on classes(club_id);
create index idx_classes_scheduled_at on classes(scheduled_at);
create index idx_class_registrations_class_id on class_registrations(class_id);
create index idx_class_registrations_user_id on class_registrations(user_id);
create index idx_analytics_logs_club_id on analytics_logs(club_id);
create index idx_analytics_logs_created_at on analytics_logs(created_at);

-- 3. Tworzymy funkcję do automatycznej aktualizacji updated_at

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 4. Dodajemy triggery

create trigger update_sport_clubs_updated_at
    before update on sport_clubs
    for each row
    execute function update_updated_at_column();

create trigger update_users_updated_at
    before update on users
    for each row
    execute function update_updated_at_column();

create trigger update_memberships_updated_at
    before update on memberships
    for each row
    execute function update_updated_at_column();

create trigger update_pricing_plans_updated_at
    before update on pricing_plans
    for each row
    execute function update_updated_at_column();

create trigger update_classes_updated_at
    before update on classes
    for each row
    execute function update_updated_at_column();

create trigger update_class_registrations_updated_at
    before update on class_registrations
    for each row
    execute function update_updated_at_column();

-- 5. Na końcu włączamy RLS i dodajemy polityki

-- RLS dla sport_clubs
alter table sport_clubs enable row level security;

create policy "Publiczny dostęp do odczytu klubów sportowych" 
    on sport_clubs for select 
    using (deleted_at is null);

create policy "Tylko administratorzy mogą tworzyć kluby" 
    on sport_clubs for insert 
    with check (
        auth.jwt()->>'global_role' = 'administrator'
    );

create policy "Tylko administratorzy klubu mogą aktualizować dane" 
    on sport_clubs for update 
    using (
        exists (
            select 1 from memberships 
            where club_id = sport_clubs.id 
            and user_id = auth.uid() 
            and membership_role = 'admin'
        )
    );

-- RLS dla users
alter table users enable row level security;

create policy "Użytkownicy mogą widzieć podstawowe informacje o innych użytkownikach"
    on users for select
    using (deleted_at is null);

create policy "Użytkownicy mogą aktualizować własne dane"
    on users for update
    using (auth.uid() = id);

-- RLS dla pricing_plans
alter table pricing_plans enable row level security;

create policy "Publiczny dostęp do odczytu planów cenowych"
    on pricing_plans for select
    using (deleted_at is null and status != 'archived');

create policy "Tylko administratorzy klubu mogą zarządzać planami"
    on pricing_plans for all
    using (
        exists (
            select 1 from memberships 
            where club_id = pricing_plans.club_id 
            and user_id = auth.uid() 
            and membership_role = 'admin'
        )
    );

-- RLS dla memberships
alter table memberships enable row level security;

create policy "Użytkownicy mogą widzieć członkostwa w swoich klubach"
    on memberships for select
    using (
        user_id = auth.uid() or
        exists (
            select 1 from memberships m2
            where m2.club_id = memberships.club_id
            and m2.user_id = auth.uid()
            and m2.membership_role in ('admin', 'trainer')
        )
    );

-- RLS dla classes
alter table classes enable row level security;

create policy "Członkowie klubu mogą widzieć zajęcia"
    on classes for select
    using (
        exists (
            select 1 from memberships
            where club_id = classes.club_id
            and user_id = auth.uid()
        )
    );

-- RLS dla class_registrations
alter table class_registrations enable row level security;

create policy "Użytkownicy mogą widzieć swoje rejestracje"
    on class_registrations for select
    using (user_id = auth.uid());

create policy "Użytkownicy mogą rejestrować się na zajęcia"
    on class_registrations for insert
    with check (user_id = auth.uid());

-- RLS dla analytics_logs
alter table analytics_logs enable row level security;

create policy "Tylko administratorzy klubu mogą widzieć logi analityczne"
    on analytics_logs for select
    using (
        exists (
            select 1 from memberships
            where club_id = analytics_logs.club_id
            and user_id = auth.uid()
            and membership_role = 'admin'
        )
    ); 