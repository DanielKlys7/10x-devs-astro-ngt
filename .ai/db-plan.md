1. Lista tabel z ich kolumnami, typami danych i ograniczeniami

**Tabela: sport_clubs**

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()  
- name: VARCHAR(255) NOT NULL  
- address: TEXT 
- contact_email: VARCHAR(255) NOT NULL  
- contact_phone: VARCHAR(50)  
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- deleted_at: TIMESTAMP WITH TIME ZONE NULL  -- soft deletion; placeholder dla RLS

**Tabela: memberships**  -- przechowuje relację wiele-do-wielu między użytkownikami a klubami z dodatkowymi atrybutami członkostwa

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()  
- user_id: UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE  
- club_id: UUID NOT NULL REFERENCES sport_clubs(id) ON DELETE CASCADE  
- membership_role: VARCHAR(50) NOT NULL  -- np. 'trener', 'czlonek'  
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- managed_by: UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE  
- CONSTRAINT uq_membership UNIQUE (user_id, club_id)
- active_plan_pricing_plan_id: UUID NULL REFERENCES pricing_plans(id) ON DELETE SET NULL  -- UWAGA: Za pomocą wyzwalacza należy sprawdzić, że pricing plan należy do tego samego klubu
- active_plan_start_date: TIMESTAMP WITH TIME ZONE NULL 
- active_plan_expires_at: TIMESTAMP WITH TIME ZONE NULL  
- auto_renew: BOOLEAN NOT NULL DEFAULT FALSE  

**Tabela: pricing_plans**

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()  
- club_id: UUID NOT NULL REFERENCES sport_clubs(id) ON DELETE CASCADE  
- name: VARCHAR(255) NOT NULL  
- description: TEXT  
- price: NUMERIC(10,2) NOT NULL  
- number_of_entries: INTEGER NOT NULL
- duration_in_days: INTEGER NOT NULL  
- status: VARCHAR(20) NOT NULL DEFAULT 'active'  -- dozwolone wartości: 'active', 'inactive', 'archived' (archived oznacza soft delete)
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- deleted_at: TIMESTAMP WITH TIME ZONE NULL  -- soft deletion

**Tabela: analytics_logs**

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()  
- club_id: UUID NOT NULL REFERENCES sport_clubs(id) ON DELETE CASCADE  
- event_type: VARCHAR(100) NOT NULL  
- event_data: JSONB  
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- user_id: UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL  -- powiązanie zdarzenia z użytkownikiem

**Tabela: classes**  -- encja "Zajęcia" ściśle przypisana do konkretnego klubu; zawiera osadzone informacje o rejestracjach

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()  
- club_id: UUID NOT NULL REFERENCES sport_clubs(id) ON DELETE CASCADE  
- name: VARCHAR(255) NOT NULL  
- description: TEXT  
- scheduled_at: TIMESTAMP WITH TIME ZONE NOT NULL  
- duration_minutes: INTEGER  
- max_seats: INTEGER NOT NULL  
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()

**Tabela: class_registrations**  -- rejestracja użytkowników na zajęcia

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- class_id: UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE
- user_id: UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
- registration_date: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- status: VARCHAR(50) NOT NULL DEFAULT 'pending'  -- np. 'pending', 'confirmed', 'cancelled'
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- CONSTRAINT uq_class_registration UNIQUE (class_id, user_id)

2. Relacje między tabelami

- **sport_clubs** → **auth.users**: relacja wiele-do-wielu poprzez tabelę **memberships** (użytkownicy są zarządzani przez supabase-auth).
- **pricing_plans**, **analytics_logs** oraz **classes** mają relację jeden-do-wielu z tabelą **sport_clubs** (każdy rekord jest przypisany do konkretnego klubu).

3. Indeksy

- Automatyczne indeksy na kolumnach PK (id) wszystkich tabel.
- Unikalny indeks na kolumnie `auth.users.email`.
- Unikalny indeks na parze (`user_id`, `club_id`) w tabeli **memberships**.
- Indeks na kolumnie `club_id` w tabelach **pricing_plans**, **analytics_logs** oraz **classes**.
- Dodatkowy indeks na kolumnie `scheduled_at` w tabeli **classes** dla optymalizacji zapytań związanych z harmonogramem zajęć.

4. Zasady PostgreSQL (RLS)

- Wdrożenie polityk RLS na tabelach krytycznych (np. **sport_clubs**, **classes**, **analytics_logs**) w celu ograniczenia dostępu do danych.  
  Przykładowe zasady RLS mogą wykorzystywać kolumny `club_id`, `user_id` oraz `global_role` (w tabeli **auth.users**) w celu zapewnienia, że użytkownicy mają dostęp jedynie do danych związanych z ich klubem oraz odpowiednimi uprawnieniami.

5. Dodatkowe uwagi

- Wszystkie tabele posiadają pola metadanych (`created_at`, `updated_at`), co ułatwia audyt i śledzenie zmian.  
- Wszystkie operacje modyfikujące dane krytyczne, takie jak rejestracja na zajęcia i aktualizacja liczby dostępnych miejsc, powinny być wykonywane w ramach transakcji, aby zapewnić integralność danych.  
- Klucze główne w formie UUID zwiększają skalowalność i bezpieczeństwo – do generowania UUID można wykorzystać funkcje takie jak `uuid_generate_v4()` lub `gen_random_uuid()`.