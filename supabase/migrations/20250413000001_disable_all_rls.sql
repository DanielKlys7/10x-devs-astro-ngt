-- Migracja: Wyłączenie wszystkich polityk RLS
-- Opis: Wyłącza Row Level Security dla wszystkich tabel w schemacie public
-- Data: 2025-04-13

-- 1. Wyłączenie RLS dla tabeli sport_clubs
ALTER TABLE sport_clubs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Publiczny dostęp do odczytu klubów sportowych" ON sport_clubs;
DROP POLICY IF EXISTS "Tylko administratorzy mogą tworzyć kluby" ON sport_clubs;
DROP POLICY IF EXISTS "Tylko administratorzy klubu mogą aktualizować dane" ON sport_clubs;

-- 2. Wyłączenie RLS dla tabeli memberships
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć członkostwa w swoich klubach" ON memberships;
DROP POLICY IF EXISTS "Administratorzy klubu mogą dodawać nowych członków" ON memberships;
DROP POLICY IF EXISTS "Administratorzy klubu mogą aktualizować członkostwa" ON memberships;
DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do członkostw" ON memberships;

-- 3. Wyłączenie RLS dla tabeli pricing_plans
ALTER TABLE pricing_plans DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Publiczny dostęp do odczytu planów cenowych" ON pricing_plans;
DROP POLICY IF EXISTS "Tylko administratorzy klubu mogą zarządzać planami" ON pricing_plans;
DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do planów cenowych" ON pricing_plans;

-- 4. Wyłączenie RLS dla tabeli classes
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Członkowie klubu mogą widzieć zajęcia" ON classes;
DROP POLICY IF EXISTS "Trenerzy i administratorzy klubu mogą tworzyć zajęcia" ON classes;
DROP POLICY IF EXISTS "Trenerzy i administratorzy klubu mogą aktualizować zajęcia" ON classes;
DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do zajęć" ON classes;

-- 5. Wyłączenie RLS dla tabeli class_registrations
ALTER TABLE class_registrations DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć swoje rejestracje" ON class_registrations;
DROP POLICY IF EXISTS "Użytkownicy mogą rejestrować się na zajęcia" ON class_registrations;
DROP POLICY IF EXISTS "Użytkownicy mogą aktualizować swoje rejestracje" ON class_registrations;
DROP POLICY IF EXISTS "Administratorzy i trenerzy klubu mogą zarządzać rejestracjami" ON class_registrations;
DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do rejestracji" ON class_registrations;

-- 6. Wyłączenie RLS dla tabeli analytics_logs
ALTER TABLE analytics_logs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Administratorzy klubu mogą widzieć logi analityczne swojego klubu" ON analytics_logs;
DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do logów" ON analytics_logs;

-- 7. Wyłączenie RLS dla tabeli club_invitations
ALTER TABLE club_invitations DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Administratorzy mogą widzieć wszystkie zaproszenia" ON club_invitations;
DROP POLICY IF EXISTS "Administratorzy klubu mogą widzieć zaproszenia do swojego klubu" ON club_invitations;
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć zaproszenia na swój email" ON club_invitations;
DROP POLICY IF EXISTS "Administratorzy systemu mogą tworzyć zaproszenia" ON club_invitations;
DROP POLICY IF EXISTS "Administratorzy klubu mogą tworzyć zaproszenia dla swojego klubu" ON club_invitations;

-- 8. Uwaga: nie usuwamy funkcji pomocniczych, ponieważ mogą być używane w kodzie aplikacji 