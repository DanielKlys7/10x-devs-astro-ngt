# Dokument wymagań produktu (PRD) - Panel Zarządzania Klubem NGT (MVP)

## 1. Przegląd produktu
Panel Zarządzania Klubem NGT (MVP) to dedykowane narzędzie umożliwiające:
- Bezpieczne logowanie dla administratorów i członków (w tym użycie biblioteki bcrypt do hashowania haseł).
- Zarządzanie użytkownikami, zajęciami, planami cenowymi oraz karnetami.
- Rejestrację oraz przeglądanie grafiku zajęć przez członków.
- Gromadzenie danych analitycznych (historia zajęć, czas treningu, anulowane zapisy) do przyszłego modułu raportowania.
- Komunikację między frontendem (Astro + React Islands + Tailwind CSS) a backendem (Fastify/Node.js) oraz bazą danych (PostgreSQL + Prisma).

## 2. Problem użytkownika
Obecne systemy do zarządzania klubem sztuk walki są nieelastyczne i kosztowne, co utrudnia:
- Efektywne zarządzanie grafikiem zajęć.
- Wygodne zapisywanie się na zajęcia.
- Dostosowanie funkcjonalności do specyficznych potrzeb klubu NGT.

## 3. Wymagania funkcjonalne.
1. Logowanie i rejestracja:
   - Administratorzy i członkowie logują się przy użyciu email/hasło.
   - Użycie bcrypt do bezpiecznego przechowywania haseł.
2. Zarządzanie użytkownikami:
   - Wyświetlanie listy użytkowników, przypisywanie ról (Admin/Członek).
3. Zarządzanie zajęciami:
   - Tworzenie, przeglądanie oraz edycja typów zajęć (nazwa, czas trwania, pojemność, trener, termin).
4. Zarządzanie planami cenowymi oraz karnetami:
   - Tworzenie i przeglądanie różnych typów karnetów/członkostw.
   - Ręczne przypisywanie planu cenowego do użytkownika.
5. Funkcjonalność zapisu:
   - Członek może zapisać się na zajęcia po weryfikacji aktywnego karnetu i dostępności miejsc.
6. Panel użytkownika:
   - Członek widzi listę swoich nadchodzących zapisów.
7. Backend API:
   - Obsługa logiki biznesowej i komunikacja z bazą danych.
8. Gromadzenie danych:
   - Rejestrowanie historii odwiedzonych zajęć, czasu spędzonego na zajęciach oraz liczby anulowanych zapisów (na potrzeby przyszłej analityki).
9. Przechowywanie danych uzytkownika zgodnie z RODO.

## 4. Granice produktu
W ramach MVP nie są przewidziane:
- Publiczna strona marketingowa (ngt.pl).
- Integracja z bramkami płatności oraz samodzielny zakup karnetów.
- Logowanie OAuth (np. Google, Facebook).
- Automatyczne powiadomienia email (weryfikacja, reset hasła, przypomnienia o zajęciach).
- Anulowanie zapisu na zajęcia przez użytkownika.
- Zaawansowane zarządzanie profilem użytkownika (edycja danych, zmiana hasła).
- Rozbudowane raportowanie i statystyki.
- Testy obciążeniowe.

## 5. Historyjki użytkowników

### US-001: Logowanie administratora
- Tytuł: Bezpieczne logowanie administratora
- Opis: Administrator loguje się używając emaila i hasła, przy czym hasło jest sprawdzane z wykorzystaniem bcrypt.
- Kryteria akceptacji:
  - System weryfikuje poprawność danych logowania.
  - W przypadku poprawnych danych administrator otrzymuje dostęp do panelu zarządzania.
  - Nieudana próba logowania wyświetla komunikat o błędzie.

### US-002: Logowanie członka
- Tytuł: Bezpieczne logowanie członka klubu
- Opis: Członek klubu loguje się używając emaila i hasła, gdzie dane autoryzacyjne są chronione.
- Kryteria akceptacji:
  - System weryfikuje dane logowania.
  - Poprawne logowanie przekierowuje do panelu użytkownika.
  - W przypadku błędu pojawia się odpowiedni komunikat.

### US-003: Zarządzanie użytkownikami przez administratora
- Tytuł: Przegląd i modyfikacja listy użytkowników
- Opis: Administrator przegląda listę użytkowników i przypisuje im role (Admin/Członek).
- Kryteria akceptacji:
  - Lista użytkowników jest widoczna dla administratora.
  - Administrator może edytować rolę wybranych użytkowników.
  - Zmiany są zapisywane w bazie danych.

### US-004: Zarządzanie zajęciami przez administratora
- Tytuł: Tworzenie i edycja zajęć
- Opis: Administrator może dodawać i edytować zajęcia (nazwa, czas trwania, pojemność, trener, termin).
- Kryteria akceptacji:
  - Formularz umożliwia wprowadzenie wymaganych danych.
  - Zajęcia po zapisaniu są widoczne w systemie.
  - Edycja zajęć aktualizuje dane w bazie.

### US-005: Zarządzanie planami cenowymi i karnetami
- Tytuł: Dodawanie i przeglądanie planów cenowych
- Opis: Administrator tworzy i przegląda różne plany cenowe, które reprezentują rodzaje karnetów/członkostw.
- Kryteria akceptacji:
  - Nowy plan może być utworzony przez formularz.
  - Plany są widoczne na liście.
  - Możliwość edycji i usunięcia planu.

### US-006: Przypisanie karnetu do użytkownika
- Tytuł: Ręczne przypisanie karnetu członkowi
- Opis: Administrator przypisuje członkowi odpowiedni plan cenowy (karnet), aktywujący możliwość zapisu na zajęcia.
- Kryteria akceptacji:
  - Funkcjonalność umożliwia wyszukiwanie użytkownika.
  - Karnet jest poprawnie przypisany i zapisywany w bazie danych.
  - Użytkownik widzi powiadomienie o aktywnym karnecie podczas logowania.

### US-007: Rejestracja członka klubu
- Tytuł: Rejestracja nowego członka
- Opis: Nowy użytkownik dokonuje rejestracji przez formularz (imię, nazwisko, email, hasło).
- Kryteria akceptacji:
  - Formularz rejestracyjny akceptuje wymagane dane.
  - Podanie prawidłowych danych tworzy nowe konto.
  - Użytkownik otrzymuje potwierdzenie rejestracji.

### US-008: Przeglądanie grafiku zajęć przez członka
- Tytuł: Interaktywny kalendarz zajęć
- Opis: Członek po zalogowaniu przegląda grafik zajęć w interaktywnym kalendarzu, widząc dostępne terminy oraz pojemność zajęć.
- Kryteria akceptacji:
  - Kalendarz wyświetla wszystkie zaplanowane zajęcia.
  - Informacje o dostępnych miejscach są na bieżąco aktualizowane.
  - Użytkownik może filtrować zajęcia według daty.

### US-009: Zapisy na zajęcia
- Tytuł: Rejestracja na wybrane zajęcia
- Opis: Członek klubu zapisuje się na wybrane zajęcia, pod warunkiem posiadania aktywnego karnetu i dostępności miejsc.
- Kryteria akceptacji:
  - System weryfikuje aktywność karnetu.
  - Sprawdzana jest dostępność miejsc zanim zapis zostanie potwierdzony.
  - Użytkownik otrzymuje potwierdzenie zapisu, a liczba wolnych miejsc zostaje zmniejszona.

### US-010: Przeglądanie zapisów przez członka
- Tytuł: Widok Moich Zapisów
- Opis: Członek ma dostęp do panelu, w którym widzi listę wszystkich nadchodzących zajęć, na które się zapisał.
- Kryteria akceptacji:
  - Lista zapisów jest czytelna i zawiera szczegóły zajęć.
  - Użytkownik może odświeżać widok, by zobaczyć aktualizacje.

### US-011: Gromadzenie danych analitycznych
- Tytuł: Rejestracja danych analitycznych
- Opis: System rejestruje dane dotyczące historii zajęć, czasu spędzonego na treningu oraz liczby anulowanych zapisów, z myślą o przyszłych analizach.
- Kryteria akceptacji:
  - Dane są zapisywane przy każdej interakcji użytkownika (np. zapis na zajęcia, anulowanie).
  - Informacje te nie są wyświetlane w interfejsie, lecz dostępne w bazie dla modułu raportowania.

## 6. Metryki sukcesu
- Poprawne i bezpieczne logowanie zarówno administratorów, jak i członków.
- Sprawne przeprowadzenie rejestracji użytkownika oraz efektywne zarządzanie kontami.
- Pełna funkcjonalność zapisu na zajęcia z aktualizacją dostępności miejsc.
- Zapis danych analitycznych dla przyszłych analiz bez wpływu na wydajność MVP.
- Przetestowanie każdej historyjki użytkownika (jednostkowe i integracyjne testy) zapewniających zgodność z kryteriami akceptacji.
