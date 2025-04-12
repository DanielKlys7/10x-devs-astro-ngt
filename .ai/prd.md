# Dokument wymagań produktu (PRD) - Panel Zarządzania Klubami Sportowymi (MVP)

## 1. Przegląd produktu

Panel Zarządzania Klubami Sportowymi (MVP) to dedykowana platforma multi-tenant umożliwiająca:

- Centralne zarządzanie wieloma niezależnymi klubami sportowymi przez administratorów systemu.
- Bezpieczne logowanie dla różnych typów użytkowników z dobrze zdefiniowanym systemem kontroli dostępu opartym na rolach (RBAC).
- Zarządzanie użytkownikami, zajęciami, planami cenowymi oraz karnetami w kontekście konkretnego klubu.
- System zaproszeń umożliwiający administratorom zapraszanie nowych osób do klubu z określoną rolą.
- Rejestrację oraz przeglądanie grafiku zajęć przez członków klubu.
- Przypisywanie trenerów do zajęć z walidacją ich przynależności do klubu.
- Gromadzenie danych analitycznych (historia zajęć, czas treningu, anulowane zapisy) do przyszłego modułu raportowania.
- Komunikację między frontendem (Astro + React Islands + Tailwind CSS) a backendem (Supabase).

System definiuje następujące role użytkowników:

**Role globalne** (poziom aplikacji):

- **administrator** - zarządza całym systemem, tworzy i zarządza klubami, ma wgląd we wszystkie dane
- **user** - rola bazowa dla wszystkich użytkowników niebędących administratorami

**Role klubowe** (poziom klubu, przechowywane w tabeli memberships):

- **admin** - zarządza konkretnym klubem, użytkownikami, zajęciami i karnetami
- **trainer** - prowadzi zajęcia w klubie, ma dostęp do informacji o swoich zajęciach
- **member** - zwykły członek klubu korzystający z usług (zapisy na zajęcia, przeglądanie grafiku)

## 2. Problem użytkownika

Obecne systemy do zarządzania klubami sportowymi są nieelastyczne i kosztowne, co utrudnia:

- Efektywne zarządzanie grafikiem zajęć.
- Wygodne zapisywanie się na zajęcia.
- Dostosowanie funkcjonalności do specyficznych potrzeb różnych klubów.
- Zarządzanie wieloma lokalizacjami/oddziałami klubu w ramach jednego systemu.

## 3. Wymagania funkcjonalne

1. **Logowanie i rejestracja:**
   - Centralny portal logowania dla wszystkich typów użytkowników.
   - Administrator systemu może utworzyć nowy klub (nazwa, dane kontaktowe, e-mail, numer telefonu).
   - System wysyła e-mail z linkiem rejestracyjnym dla sportsClubAdmin na wskazany adres.
   - Użycie Supabase Auth do bezpiecznego uwierzytelniania.

2. **System Kontroli Dostępu Oparty na Rolach (RBAC):**
   - Dwupoziomowy system ról: globalne (poziom aplikacji) i klubowe (kontekst klubu).
   - Globalne role ('administrator', 'user') przechowywane w tabeli auth.users.
   - Role klubowe ('admin', 'trainer', 'member') przechowywane w tabeli memberships.
   - Uprawnienia egzekwowane przez polityki Row Level Security (RLS) w bazie danych.
   - Funkcje pomocnicze dla usprawnienia weryfikacji uprawnień (`auth.is_admin()`, `auth.is_club_admin()` itp.).

3. **System Zaproszeń do Klubu:**
   - Administratorzy systemu i klubu mogą wysyłać zaproszenia e-mail do potencjalnych członków lub administratorów danego klubu.
   - Zaproszenia zawierają unikalny, bezpieczny token z określonym czasem ważności (domyślnie 7 dni).
   - Podczas wysyłania zaproszenia określana jest docelowa rola zapraszanej osoby w klubie.
   - Zaproszenia mogą być akceptowane zarówno przez nowych, jak i istniejących użytkowników.
   - Po akceptacji zaproszenia użytkownik zostaje dodany do klubu z określoną rolą.

4. **Zarządzanie klubami i użytkownikami:**
   - Administrator systemu może przeglądać, edytować i usuwać kluby.
   - Administrator systemu może dołączyć do wybranego klubu jako user.
   - Administrator systemu ma wgląd we wszystkie dane wszystkich klubów.
   - Admin klubu zarządza użytkownikami swojego klubu poprzez system zaproszeń.

5. **Zarządzanie zajęciami:**
   - SportsClubAdmin tworzy, przegląda oraz edytuje typy zajęć (nazwa, czas trwania, pojemność, trener, termin) w ramach swojego klubu.

6. **Zarządzanie planami cenowymi oraz karnetami:**
   - SportsClubAdmin tworzy i przegląda różne typy karnetów/członkostw dla swojego klubu.
   - SportsClubAdmin ręcznie przypisuje plan cenowy do użytkownika w ramach swojego klubu.

7. **Funkcjonalność zapisu:**
   - User może zapisać się na zajęcia w klubie, do którego należy, po weryfikacji aktywnego karnetu i dostępności miejsc.

8. **Panel użytkownika:**
   - User widzi listę swoich nadchodzących zapisów w ramach swojego klubu.

9. **Backend API:**
   - Obsługa logiki biznesowej i komunikacja z bazą danych, z uwzględnieniem izolacji danych między klubami.

10. **Gromadzenie danych:**
    - Rejestrowanie historii odwiedzonych zajęć, czasu spędzonego na zajęciach oraz liczby anulowanych zapisów (na potrzeby przyszłej analityki) w kontekście konkretnego klubu.

11. **Przechowywanie danych użytkownika zgodnie z RODO:**
    - Odpowiednie zabezpieczenie i izolacja danych osobowych między klubami.
    - Rozważenie implementacji Row Level Security w bazie danych dla zapewnienia izolacji danych między klubami.

## 4. Granice produktu

W ramach MVP nie są przewidziane:

- Publiczne strony marketingowe dla poszczególnych klubów.
- Dedykowane punkty dostępu (subdomeny/URL) dla poszczególnych klubów.
- Integracja z bramkami płatności oraz samodzielny zakup karnetów.
- Logowanie OAuth (np. Google, Facebook).
- Automatyczne powiadomienia email (weryfikacja, reset hasła, przypomnienia o zajęciach).
- Anulowanie zapisu na zajęcia przez użytkownika.
- Zaawansowane zarządzanie profilem użytkownika (edycja danych, zmiana hasła).
- Rozbudowane raportowanie i statystyki.
- Dedykowane funkcje dla roli trainer.
- Testy obciążeniowe.

## 5. Historyjki użytkowników

### US-001: Logowanie administratora systemu

- Tytuł: Bezpieczne logowanie administratora systemu
- Opis: Administrator systemu loguje się używając emaila i hasła, przy czym hasło jest sprawdzane z wykorzystaniem bcrypt.
- Kryteria akceptacji:
  - System weryfikuje poprawność danych logowania.
  - W przypadku poprawnych danych administrator otrzymuje dostęp do panelu zarządzania systemem.
  - Nieudana próba logowania wyświetla komunikat o błędzie.

### US-002: Logowanie sportsClubAdmin

- Tytuł: Bezpieczne logowanie administratora klubu
- Opis: Administrator klubu (sportsClubAdmin) loguje się używając emaila i hasła, które są weryfikowane przez system.
- Kryteria akceptacji:
  - System weryfikuje dane logowania.
  - Poprawne logowanie przekierowuje do panelu zarządzania klubem.
  - W przypadku błędu pojawia się odpowiedni komunikat.

### US-003: Logowanie członka klubu

- Tytuł: Bezpieczne logowanie członka klubu
- Opis: Członek klubu (user) loguje się używając emaila i hasła, gdzie dane autoryzacyjne są chronione.
- Kryteria akceptacji:
  - System weryfikuje dane logowania.
  - Poprawne logowanie przekierowuje do panelu użytkownika klubu.
  - W przypadku błędu pojawia się odpowiedni komunikat.

### US-004: Logowanie trenera

- Tytuł: Bezpieczne logowanie trenera
- Opis: Trener (trainer) loguje się używając emaila i hasła, gdzie dane autoryzacyjne są chronione.
- Kryteria akceptacji:
  - System weryfikuje dane logowania.
  - Poprawne logowanie przekierowuje do podstawowego panelu użytkownika.
  - W przypadku błędu pojawia się odpowiedni komunikat.

### US-005: Tworzenie klubu sportowego

- Tytuł: Zakładanie nowego klubu sportowego
- Opis: Administrator systemu tworzy nowy klub sportowy podając jego nazwę, dane kontaktowe i adres email administratora klubu.
- Kryteria akceptacji:
  - Formularz umożliwia wprowadzenie wszystkich wymaganych danych klubu.
  - System wysyła email z linkiem rejestracyjnym do przyszłego administratora klubu.
  - Nowy klub jest widoczny na liście klubów.

### US-006: Rejestracja administratora klubu

- Tytuł: Rejestracja administratora klubu przez link
- Opis: Przyszły administrator klubu otrzymuje email z linkiem rejestracyjnym, po kliknięciu którego może utworzyć konto.
- Kryteria akceptacji:
  - Link prowadzi do formularza rejestracyjnego.
  - Po poprawnym wypełnieniu formularza, użytkownik staje się automatycznie administratorem klubu.
  - Administrator klubu ma dostęp do panelu zarządzania swoim klubem.

### US-007: Zarządzanie klubami przez administratora systemu

- Tytuł: Przegląd i modyfikacja listy klubów
- Opis: Administrator systemu przegląda listę klubów i może edytować ich dane lub usuwać kluby.
- Kryteria akceptacji:
  - Lista klubów jest widoczna dla administratora systemu.
  - Administrator może edytować dane wybranych klubów.
  - Administrator może usuwać kluby.
  - Zmiany są zapisywane w bazie danych.

### US-008: Dołączanie administratora systemu do klubu jako członek

- Tytuł: Administrator systemu dołącza do klubu
- Opis: Administrator systemu może dołączyć do wybranego klubu jako zwykły użytkownik (user).
- Kryteria akceptacji:
  - Administrator systemu widzi listę klubów, do których może dołączyć.
  - Po dołączeniu administrator ma dostęp do funkcjonalności użytkownika klubu (grafik, zapisy).
  - Administrator nadal zachowuje swoje uprawnienia systemowe.

### US-009: Zarządzanie użytkownikami klubu przez sportsClubAdmin

- Tytuł: Przegląd i modyfikacja listy użytkowników klubu
- Opis: Administrator klubu (sportsClubAdmin) przegląda listę użytkowników i przypisuje im role (sportsClubAdmin/user/trainer).
- Kryteria akceptacji:
  - Lista użytkowników klubu jest widoczna dla administratora klubu.
  - Administrator klubu może edytować rolę wybranych użytkowników.
  - Administrator klubu może zapraszać nowych użytkowników.
  - Zmiany są zapisywane w bazie danych.

### US-010: Zarządzanie zajęciami przez administratora klubu

- Tytuł: Tworzenie i edycja zajęć w klubie
- Opis: Administrator klubu może dodawać i edytować zajęcia (nazwa, czas trwania, pojemność, trener, termin).
- Kryteria akceptacji:
  - Formularz umożliwia wprowadzenie wymaganych danych.
  - Można wybrać trenera z listy dostępnych trenerów klubu.
  - System weryfikuje czy wybrany trener należy do klubu i ma rolę 'trainer'.
  - Zajęcia po zapisaniu są widoczne w systemie.
  - Edycja zajęć aktualizuje dane w bazie.

### US-011: Zarządzanie planami cenowymi i karnetami klubu

- Tytuł: Dodawanie i przeglądanie planów cenowych klubu
- Opis: Administrator klubu tworzy i przegląda różne plany cenowe, które reprezentują rodzaje karnetów/członkostw w danym klubie.
- Kryteria akceptacji:
  - Nowy plan może być utworzony przez formularz.
  - Plany są widoczne na liście.
  - Możliwość edycji i usunięcia planu.

### US-012: Przypisanie karnetu do użytkownika klubu

- Tytuł: Ręczne przypisanie karnetu członkowi klubu
- Opis: Administrator klubu przypisuje członkowi odpowiedni plan cenowy (karnet), aktywujący możliwość zapisu na zajęcia.
- Kryteria akceptacji:
  - Funkcjonalność umożliwia wyszukiwanie użytkownika klubu.
  - Karnet jest poprawnie przypisany i zapisywany w bazie danych.
  - Użytkownik klubu widzi powiadomienie o aktywnym karnecie podczas logowania.

### US-013: Zaproszenie i rejestracja członka klubu

- Tytuł: Zaproszenie nowego członka klubu
- Opis: Administrator klubu wysyła zaproszenie do nowego członka, a ten dokonuje rejestracji poprzez otrzymany link.
- Kryteria akceptacji:
  - Administrator klubu może wysłać zaproszenie email z linkiem rejestracyjnym.
  - Nowy użytkownik może zarejestrować się przez formularz (imię, nazwisko, email, hasło).
  - Podanie prawidłowych danych tworzy nowe konto z rolą user w odpowiednim klubie.
  - Użytkownik otrzymuje potwierdzenie rejestracji.

### US-014: Przeglądanie grafiku zajęć przez członka klubu

- Tytuł: Interaktywny kalendarz zajęć klubu
- Opis: Członek po zalogowaniu przegląda grafik zajęć swojego klubu w interaktywnym kalendarzu, widząc dostępne terminy oraz pojemność zajęć.
- Kryteria akceptacji:
  - Kalendarz wyświetla wszystkie zaplanowane zajęcia w klubie użytkownika.
  - Informacje o dostępnych miejscach są na bieżąco aktualizowane.
  - Użytkownik może filtrować zajęcia według daty.

### US-015: Zapisy na zajęcia klubu

- Tytuł: Rejestracja na wybrane zajęcia klubu
- Opis: Członek klubu zapisuje się na wybrane zajęcia, pod warunkiem posiadania aktywnego karnetu i dostępności miejsc.
- Kryteria akceptacji:
  - System weryfikuje aktywność karnetu.
  - Sprawdzana jest dostępność miejsc zanim zapis zostanie potwierdzony.
  - Użytkownik otrzymuje potwierdzenie zapisu, a liczba wolnych miejsc zostaje zmniejszona.

### US-016: Przeglądanie zapisów przez członka klubu

- Tytuł: Widok Moich Zapisów
- Opis: Członek ma dostęp do panelu, w którym widzi listę wszystkich nadchodzących zajęć klubu, na które się zapisał.
- Kryteria akceptacji:
  - Lista zapisów jest czytelna i zawiera szczegóły zajęć.
  - Użytkownik może odświeżać widok, by zobaczyć aktualizacje.

### US-017: Gromadzenie danych analitycznych klubu

- Tytuł: Rejestracja danych analitycznych klubu
- Opis: System rejestruje dane dotyczące historii zajęć, czasu spędzonego na treningu oraz liczby anulowanych zapisów w ramach każdego klubu, z myślą o przyszłych analizach.
- Kryteria akceptacji:
  - Dane są zapisywane przy każdej interakcji użytkownika (np. zapis na zajęcia, anulowanie) z oznaczeniem przynależności do klubu.
  - Informacje te nie są wyświetlane w interfejsie, lecz dostępne w bazie dla modułu raportowania.

### US-018: Zaproszenie nowego użytkownika z określoną rolą

- Tytuł: Zaproszenie użytkownika z określoną rolą
- Opis: Administrator klubu lub administrator systemu wysyła zaproszenie na adres email, określając rolę docelową w klubie (admin, trainer, member).
- Kryteria akceptacji:
  - Formularz umożliwia wprowadzenie adresu email i wybór roli.
  - System generuje unikalny token z ograniczonym czasem ważności.
  - Zaproszenie jest wysyłane emailem i zawiera link z tokenem.
  - Zaproszenie jest zapisywane w systemie z informacją o klubie, emailu, roli i tokenie.

### US-019: Akceptacja zaproszenia do klubu

- Tytuł: Akceptacja zaproszenia do klubu
- Opis: Użytkownik otrzymuje email z zaproszeniem do klubu, klika link i zostaje poprawnie dołączony do klubu z odpowiednią rolą.
- Kryteria akceptacji:
  - Kliknięcie linku otwiera stronę do akceptacji zaproszenia.
  - Jeśli użytkownik nie jest zalogowany, zostaje przekierowany do logowania/rejestracji.
  - System weryfikuje, czy email użytkownika zgadza się z emailem zaproszenia.
  - Po akceptacji, użytkownik zostaje dodany do klubu z określoną rolą.
  - Zaproszenie zostaje oznaczone jako zaakceptowane.

### US-020: Zarządzanie zaproszeniami

- Tytuł: Zarządzanie listą zaproszeń
- Opis: Administrator klubu może przeglądać, filtrować i anulować wysłane zaproszenia.
- Kryteria akceptacji:
  - Lista zaproszeń jest dostępna w panelu administracyjnym klubu.
  - Administrator może filtrować zaproszenia według statusu (oczekujące, zaakceptowane, wygasłe).
  - Administrator może anulować oczekujące zaproszenia.
  - System pokazuje datę wygaśnięcia zaproszenia.

### US-021: Weryfikacja uprawnień według roli

- Tytuł: System kontroli dostępu oparty na rolach
- Opis: System prawidłowo ogranicza dostęp do funkcji i danych w zależności od globalnej roli użytkownika oraz jego roli w klubie.
- Kryteria akceptacji:
  - Administrator systemu ma dostęp do wszystkich klubów i funkcji.
  - Użytkownik z rolą admin w konkretnym klubie ma dostęp tylko do danych tego klubu.
  - Zwykły członek klubu (member) widzi tylko podstawowe informacje i swoje dane.
  - Użytkownik nie może wykonywać działań poza swoimi uprawnieniami.

### US-022: Przypisanie trenera do zajęć

- Tytuł: Przypisanie trenera do zajęć klubowych
- Opis: Administrator klubu przypisuje trenera do konkretnych zajęć, przy czym system weryfikuje czy trener należy do klubu.
- Kryteria akceptacji:
  - Administrator może wybrać trenera tylko spośród osób z rolą 'trainer' w danym klubie.
  - System automatycznie weryfikuje przynależność trenera do klubu.
  - Próba przypisania osoby niebędącej trenerem w klubie kończy się błędem.
  - Trener może zobaczyć listę przypisanych do niego zajęć.
  - Informacja o trenerze jest widoczna w szczegółach zajęć.

## 6. Metryki sukcesu

- Poprawne i bezpieczne logowanie dla wszystkich ról użytkowników.
- Skuteczne tworzenie i zarządzanie klubami przez administratora systemu.
- Sprawne zarządzanie użytkownikami w ramach klubu przez administratora klubu.
- Efektywny system zaproszeń z poprawnymi przypisaniami ról.
- Dwupoziomowy system RBAC prawidłowo ograniczający dostęp do zasobów.
- Pełna funkcjonalność zapisu na zajęcia z aktualizacją dostępności miejsc w kontekście konkretnego klubu.
- Właściwa izolacja danych między klubami na poziomie UI i logiki biznesowej.
- Zapis danych analitycznych dla przyszłych analiz z odpowiednim kontekstem klubu.
- Przetestowanie każdej historyjki użytkownika (jednostkowe i integracyjne testy) zapewniających zgodność z kryteriami akceptacji.
