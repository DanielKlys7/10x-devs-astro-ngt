-- Migracja: Wyłączenie wszystkich polityk RLS
-- Opis: Wyłącza Row Level Security dla wszystkich tabel w schemacie public
-- Data: 2025-04-12

-- 1. Wyłączenie RLS dla tabeli sport_clubs
alter table sport_clubs disable row level security;
drop policy if exists "Administratorzy mogą wszystko" on sport_clubs;
drop policy if exists "Użytkownicy mogą widzieć kluby" on sport_clubs;

-- 2. Wyłączenie RLS dla tabeli memberships
alter table memberships disable row level security;
drop policy if exists "Administratorzy mogą zarządzać członkostwami" on memberships;
drop policy if exists "Użytkownicy mogą widzieć swoje członkostwa" on memberships;
drop policy if exists "Administratorzy klubów mogą zarządzać członkostwami" on memberships;

-- 3. Wyłączenie RLS dla tabeli pricing_plans
alter table pricing_plans disable row level security;
drop policy if exists "Administratorzy mogą zarządzać planami" on pricing_plans;
drop policy if exists "Użytkownicy mogą widzieć aktywne plany" on pricing_plans;
drop policy if exists "Administratorzy klubów mogą zarządzać planami" on pricing_plans;

-- 4. Wyłączenie RLS dla tabeli classes
alter table classes disable row level security;
drop policy if exists "Administratorzy mogą zarządzać zajęciami" on classes;
drop policy if exists "Użytkownicy mogą widzieć zajęcia" on classes;
drop policy if exists "Administratorzy klubów mogą zarządzać zajęciami" on classes;

-- 5. Wyłączenie RLS dla tabeli class_registrations
alter table class_registrations disable row level security;
drop policy if exists "Administratorzy mogą zarządzać rejestracjami" on class_registrations;
drop policy if exists "Użytkownicy mogą widzieć swoje rejestracje" on class_registrations;
drop policy if exists "Administratorzy klubów mogą zarządzać rejestracjami" on class_registrations;

-- 6. Wyłączenie RLS dla tabeli analytics_logs
alter table analytics_logs disable row level security;
drop policy if exists "Administratorzy mogą zarządzać logami" on analytics_logs;
drop policy if exists "Administratorzy klubów mogą widzieć swoje logi" on analytics_logs;

-- 7. Wyłączenie RLS dla tabeli club_invitations
alter table club_invitations disable row level security;
drop policy if exists "Administratorzy mogą widzieć wszystkie zaproszenia" on club_invitations;
drop policy if exists "Administratorzy klubu mogą widzieć zaproszenia do swojego klubu" on club_invitations;
drop policy if exists "Administratorzy systemu mogą tworzyć zaproszenia" on club_invitations;
drop policy if exists "Administratorzy klubu mogą tworzyć zaproszenia dla swojego klubu" on club_invitations; 