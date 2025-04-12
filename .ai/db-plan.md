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
- membership_role: VARCHAR(50) NOT NULL  -- np. 'admin', 'trainer', 'member'  
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- updated_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()  
- managed_by: UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE  
- CONSTRAINT uq_membership UNIQUE (user_id, club_id)
- active_plan_pricing_plan_id: UUID NULL REFERENCES pricing_plans(id) ON DELETE SET NULL  -- UWAGA: Za pomocą wyzwalacza należy sprawdzić, że pricing plan należy do tego samego klubu
- active_plan_start_date: TIMESTAMP WITH TIME ZONE NULL 
- active_plan_expires_at: TIMESTAMP WITH TIME ZONE NULL  
- auto_renew: BOOLEAN NOT NULL DEFAULT FALSE  

**Tabela: club_invitations**  -- przechowuje zaproszenia do dołączenia do klubu

- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- club_id: UUID NOT NULL REFERENCES sport_clubs(id) ON DELETE CASCADE
- email: VARCHAR(255) NOT NULL
- target_role: VARCHAR(50) NOT NULL  -- dozwolone wartości: 'admin', 'trainer', 'member'
- token: UUID NOT NULL DEFAULT uuid_generate_v4()
- created_by: UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
- created_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
- expires_at: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
- accepted_at: TIMESTAMP WITH TIME ZONE NULL

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
- trainer_id: UUID REFERENCES auth.users(id) 
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
- **sport_clubs** → **auth.users**: relacja wiele-do-wielu poprzez tabelę **club_invitations** (zaproszenia do klubów).
- **pricing_plans**, **analytics_logs** oraz **classes** mają relację jeden-do-wielu z tabelą **sport_clubs** (każdy rekord jest przypisany do konkretnego klubu).
- **classes** → **auth.users**: relacja jeden-do-jeden poprzez kolumnę trainer_id (trener prowadzący zajęcia).

3. Indeksy

- Automatyczne indeksy na kolumnach PK (id) wszystkich tabel.
- Unikalny indeks na kolumnie `auth.users.email`.
- Unikalny indeks na parze (`user_id`, `club_id`) w tabeli **memberships**.
- Indeks na kolumnie `club_id` w tabelach **pricing_plans**, **analytics_logs**, **classes** oraz **club_invitations**.
- Indeks na kolumnie `email` i `token` w tabeli **club_invitations** dla szybszego wyszukiwania zaproszeń.
- Indeks na kolumnie `expires_at` w tabeli **club_invitations** dla efektywnego filtrowania wygasłych zaproszeń.
- Dodatkowy indeks na kolumnie `scheduled_at` w tabeli **classes** dla optymalizacji zapytań związanych z harmonogramem zajęć.
- Indeks na kolumnie `trainer_id` w tabeli **classes** dla szybszego wyszukiwania zajęć prowadzonych przez konkretnego trenera.

4. Funkcje pomocnicze i triggery

- Funkcje pomocnicze dla systemu RBAC:
  - `auth.user_role()` - zwraca rolę globalną ('administrator' lub 'user')
  - `auth.is_admin()` - sprawdza czy użytkownik jest administratorem systemu
  - `auth.user_club_role(club_id)` - zwraca rolę w kontekście klubu
  - `auth.is_club_admin(club_id)` - sprawdza uprawnienia administratora klubu
  - `auth.is_club_member(club_id)` - sprawdza członkostwo w klubie

- Funkcje do obsługi zaproszeń:
  - `accept_club_invitation(invitation_token)` - weryfikuje i akceptuje zaproszenie, dodając użytkownika do klubu

- Triggery:
  - `check_trainer_club_membership_trigger` - sprawdza czy przypisywany trener należy do klubu i ma odpowiednią rolę

5. Dodatkowe uwagi

- System ról wykorzystuje dwa poziomy: 
  1. Globalne role w `auth.users.global_role` (tylko 'administrator' i 'user')
  2. Role w kontekście klubu w `memberships.membership_role` ('admin', 'trainer', 'member')
- Tabela `club_invitations` umożliwia bezpieczne zapraszanie nowych członków do klubu z określonymi rolami
- Wszystkie operacje modyfikujące dane krytyczne wykonywane są w ramach transakcji, aby zapewnić integralność danych
- Walidacja przynależności trenera do klubu jest wymuszana przez trigger `check_trainer_club_membership_trigger`
- Bezpieczeństwo zaproszeń zapewnione przez unikalne tokeny UUID i czas wygaśnięcia