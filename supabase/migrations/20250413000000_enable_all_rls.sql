-- Migracja: Włączenie wszystkich polityk RLS
-- Opis: Włącza Row Level Security dla wszystkich tabel w schemacie public
-- Data: 2025-04-13

-- 0. Funkcje pomocnicze (jeśli nie istnieją)

-- Sprawdzenie czy funkcja auth.user_role() istnieje, jeśli nie - utworzenie
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS text AS $$
BEGIN
    RETURN COALESCE(
        (SELECT global_role FROM auth.users WHERE id = auth.uid()),
        'user'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sprawdzenie czy funkcja auth.is_admin() istnieje, jeśli nie - utworzenie
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN (SELECT auth.user_role()) = 'administrator';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sprawdzenie czy funkcja auth.user_club_role() istnieje, jeśli nie - utworzenie
CREATE OR REPLACE FUNCTION auth.user_club_role(club_id uuid)
RETURNS text AS $$
BEGIN
    RETURN (
        SELECT membership_role
        FROM memberships 
        WHERE user_id = auth.uid() 
        AND memberships.club_id = $1
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sprawdzenie czy funkcja auth.is_club_admin() istnieje, jeśli nie - utworzenie
CREATE OR REPLACE FUNCTION auth.is_club_admin(club_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM memberships 
        WHERE user_id = auth.uid() 
        AND memberships.club_id = $1
        AND membership_role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sprawdzenie czy funkcja auth.is_club_member() istnieje, jeśli nie - utworzenie
CREATE OR REPLACE FUNCTION auth.is_club_member(club_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM memberships 
        WHERE user_id = auth.uid() 
        AND memberships.club_id = $1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Włączenie RLS dla tabeli sport_clubs
ALTER TABLE sport_clubs ENABLE ROW LEVEL SECURITY;

-- Polityki dla sport_clubs
DROP POLICY IF EXISTS "Publiczny dostęp do odczytu klubów sportowych" ON sport_clubs;
CREATE POLICY "Publiczny dostęp do odczytu klubów sportowych" 
    ON sport_clubs FOR SELECT 
    USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Tylko administratorzy mogą tworzyć kluby" ON sport_clubs;
CREATE POLICY "Tylko administratorzy mogą tworzyć kluby" 
    ON sport_clubs FOR INSERT 
    WITH CHECK (auth.is_admin());

DROP POLICY IF EXISTS "Tylko administratorzy klubu mogą aktualizować dane" ON sport_clubs;
CREATE POLICY "Tylko administratorzy klubu mogą aktualizować dane" 
    ON sport_clubs FOR UPDATE 
    USING (auth.is_club_admin(id));

-- 2. Włączenie RLS dla tabeli memberships
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Polityki dla memberships
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć członkostwa w swoich klubach" ON memberships;
CREATE POLICY "Użytkownicy mogą widzieć członkostwa w swoich klubach"
    ON memberships FOR SELECT
    USING (
        user_id = auth.uid() OR
        auth.is_club_admin(club_id) OR
        (
            auth.user_club_role(club_id) = 'trainer'
        )
    );

DROP POLICY IF EXISTS "Administratorzy klubu mogą dodawać nowych członków" ON memberships;
CREATE POLICY "Administratorzy klubu mogą dodawać nowych członków"
    ON memberships FOR INSERT
    WITH CHECK (
        auth.is_club_admin(club_id)
    );

DROP POLICY IF EXISTS "Administratorzy klubu mogą aktualizować członkostwa" ON memberships;
CREATE POLICY "Administratorzy klubu mogą aktualizować członkostwa"
    ON memberships FOR UPDATE
    USING (
        auth.is_club_admin(club_id)
    );

DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do członkostw" ON memberships;
CREATE POLICY "Administratorzy systemu mają pełny dostęp do członkostw"
    ON memberships FOR ALL
    USING (auth.is_admin());

-- 3. Włączenie RLS dla tabeli pricing_plans
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Polityki dla pricing_plans
DROP POLICY IF EXISTS "Publiczny dostęp do odczytu planów cenowych" ON pricing_plans;
CREATE POLICY "Publiczny dostęp do odczytu planów cenowych"
    ON pricing_plans FOR SELECT
    USING (deleted_at IS NULL AND status != 'archived');

DROP POLICY IF EXISTS "Tylko administratorzy klubu mogą zarządzać planami" ON pricing_plans;
CREATE POLICY "Tylko administratorzy klubu mogą zarządzać planami"
    ON pricing_plans FOR ALL
    USING (
        auth.is_club_admin(club_id)
    );

DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do planów cenowych" ON pricing_plans;
CREATE POLICY "Administratorzy systemu mają pełny dostęp do planów cenowych"
    ON pricing_plans FOR ALL
    USING (auth.is_admin());

-- 4. Włączenie RLS dla tabeli classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Polityki dla classes
DROP POLICY IF EXISTS "Członkowie klubu mogą widzieć zajęcia" ON classes;
CREATE POLICY "Członkowie klubu mogą widzieć zajęcia"
    ON classes FOR SELECT
    USING (
        auth.is_club_member(club_id)
    );

DROP POLICY IF EXISTS "Trenerzy i administratorzy klubu mogą tworzyć zajęcia" ON classes;
CREATE POLICY "Trenerzy i administratorzy klubu mogą tworzyć zajęcia"
    ON classes FOR INSERT
    WITH CHECK (
        auth.is_club_admin(club_id) OR
        auth.user_club_role(club_id) = 'trainer'
    );

DROP POLICY IF EXISTS "Trenerzy i administratorzy klubu mogą aktualizować zajęcia" ON classes;
CREATE POLICY "Trenerzy i administratorzy klubu mogą aktualizować zajęcia"
    ON classes FOR UPDATE
    USING (
        auth.is_club_admin(club_id) OR
        (
            auth.user_club_role(club_id) = 'trainer' AND
            (trainer_id IS NULL OR trainer_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do zajęć" ON classes;
CREATE POLICY "Administratorzy systemu mają pełny dostęp do zajęć"
    ON classes FOR ALL
    USING (auth.is_admin());

-- 5. Włączenie RLS dla tabeli class_registrations
ALTER TABLE class_registrations ENABLE ROW LEVEL SECURITY;

-- Polityki dla class_registrations
DROP POLICY IF EXISTS "Użytkownicy mogą widzieć swoje rejestracje" ON class_registrations;
CREATE POLICY "Użytkownicy mogą widzieć swoje rejestracje"
    ON class_registrations FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM classes c
            WHERE c.id = class_id AND (
                auth.is_club_admin(c.club_id) OR
                auth.user_club_role(c.club_id) = 'trainer'
            )
        )
    );

DROP POLICY IF EXISTS "Użytkownicy mogą rejestrować się na zajęcia" ON class_registrations;
CREATE POLICY "Użytkownicy mogą rejestrować się na zajęcia"
    ON class_registrations FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM classes c
            JOIN memberships m ON m.club_id = c.club_id
            WHERE c.id = class_id AND m.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Użytkownicy mogą aktualizować swoje rejestracje" ON class_registrations;
CREATE POLICY "Użytkownicy mogą aktualizować swoje rejestracje"
    ON class_registrations FOR UPDATE
    USING (
        user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Administratorzy i trenerzy klubu mogą zarządzać rejestracjami" ON class_registrations;
CREATE POLICY "Administratorzy i trenerzy klubu mogą zarządzać rejestracjami"
    ON class_registrations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM classes c
            WHERE c.id = class_id AND (
                auth.is_club_admin(c.club_id) OR
                (auth.user_club_role(c.club_id) = 'trainer' AND c.trainer_id = auth.uid())
            )
        )
    );

DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do rejestracji" ON class_registrations;
CREATE POLICY "Administratorzy systemu mają pełny dostęp do rejestracji"
    ON class_registrations FOR ALL
    USING (auth.is_admin());

-- 6. Włączenie RLS dla tabeli analytics_logs
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;

-- Polityki dla analytics_logs
DROP POLICY IF EXISTS "Administratorzy klubu mogą widzieć logi analityczne swojego klubu" ON analytics_logs;
CREATE POLICY "Administratorzy klubu mogą widzieć logi analityczne swojego klubu"
    ON analytics_logs FOR SELECT
    USING (
        auth.is_club_admin(club_id)
    );

DROP POLICY IF EXISTS "Administratorzy systemu mają pełny dostęp do logów" ON analytics_logs;
CREATE POLICY "Administratorzy systemu mają pełny dostęp do logów"
    ON analytics_logs FOR ALL
    USING (auth.is_admin());

-- 7. Włączenie RLS dla tabeli club_invitations
ALTER TABLE club_invitations ENABLE ROW LEVEL SECURITY;

-- Polityki dla club_invitations
DROP POLICY IF EXISTS "Administratorzy mogą widzieć wszystkie zaproszenia" ON club_invitations;
CREATE POLICY "Administratorzy mogą widzieć wszystkie zaproszenia"
    ON club_invitations FOR SELECT
    USING (auth.is_admin());

DROP POLICY IF EXISTS "Administratorzy klubu mogą widzieć zaproszenia do swojego klubu" ON club_invitations;
CREATE POLICY "Administratorzy klubu mogą widzieć zaproszenia do swojego klubu"
    ON club_invitations FOR SELECT
    USING (
        auth.is_club_admin(club_id)
    );

DROP POLICY IF EXISTS "Użytkownicy mogą widzieć zaproszenia na swój email" ON club_invitations;
CREATE POLICY "Użytkownicy mogą widzieć zaproszenia na swój email"
    ON club_invitations FOR SELECT
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Administratorzy systemu mogą tworzyć zaproszenia" ON club_invitations;
CREATE POLICY "Administratorzy systemu mogą tworzyć zaproszenia"
    ON club_invitations FOR INSERT
    WITH CHECK (auth.is_admin());

DROP POLICY IF EXISTS "Administratorzy klubu mogą tworzyć zaproszenia dla swojego klubu" ON club_invitations;
CREATE POLICY "Administratorzy klubu mogą tworzyć zaproszenia dla swojego klubu"
    ON club_invitations FOR INSERT
    WITH CHECK (
        auth.is_club_admin(club_id)
    ); 