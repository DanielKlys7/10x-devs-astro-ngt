-- Migracja: Dodanie trenera do zajęć
-- Opis: Dodaje kolumnę trainer_id do tabeli classes wraz z walidacją przynależności do klubu
-- Data: 2025-04-12

-- 1. Dodanie kolumny trainer_id do tabeli classes
alter table classes add column trainer_id uuid references auth.users(id);

-- 2. Utworzenie funkcji sprawdzającej czy trener należy do klubu
create or replace function check_trainer_club_membership()
returns trigger as $$
begin
    -- Sprawdź czy trener należy do klubu i ma rolę 'trainer'
    if not exists (
        select 1 
        from memberships m
        join classes c on c.club_id = m.club_id
        where m.user_id = NEW.trainer_id
        and m.club_id = NEW.club_id
        and m.membership_role = 'trainer'
    ) then
        raise exception 'Trener musi być członkiem klubu z rolą trainer';
    end if;
    return NEW;
end;
$$ language plpgsql;

-- 3. Utworzenie triggera sprawdzającego przynależność trenera do klubu
create trigger check_trainer_club_membership_trigger
    before insert or update of trainer_id on classes
    for each row
    execute function check_trainer_club_membership();

-- 4. Dodanie komentarza do kolumny
comment on column classes.trainer_id is 'Identyfikator trenera prowadzącego zajęcia. Trener musi być członkiem klubu z rolą trainer.'; 