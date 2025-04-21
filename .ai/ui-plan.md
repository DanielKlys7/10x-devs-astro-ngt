# Architektura UI dla Panel Zarządzania Klubami Sportowymi (MVP)

## 1. Przegląd struktury UI

Interfejs użytkownika zostanie zaprojektowany jako modułowy system, który integruje główne funkcjonalności opisane w PRD. Całość opiera się na standardowych komponentach z Shadcn/ui, stylizowanych przy użyciu Tailwind CSS, z uwzględnieniem dostępności (WCAG AA) i responsywności na urządzeniach mobilnych, tabletach i desktopach. Zarządzanie stanem będzie realizowane przy użyciu React Query oraz Context, a interakcje użytkownika komunikowane będą przez system powiadomień (inline dla krytycznych błędów oraz toasty dla error, warning i success). Autoryzacja będzie oparta na JWT, a dodatkowym elementem użytkowym będzie możliwość przełączania między trybem jasnym a ciemnym.

## 2. Lista widoków

1. **Dashboard (Dla użytkownika i administratora)**
    * **Ścieżka widoku:** `/`
    * **Główny cel:**
        * **Użytkownik:** Wyświetlenie listy klubów, do których należy użytkownik. Automatyczne przekierowanie do widoku klubu, jeśli użytkownik należy tylko do jednego klubu.
        * **Administrator:** Wyświetlenie listy wszystkich klubów w systemie z możliwością zarządzania nimi oraz tworzenia nowych klubów.
    * **Kluczowe informacje:**
        * **Użytkownik:** Lista kart klubów z podstawowymi informacjami, przyciski nawigacyjne do widoku klubu.
        * **Administrator:** Tabela/lista wszystkich klubów z liczbą członków, akcjami (przejdź do widoku klubu, zaproś administratora klubu), przycisk "Utwórz klub".
    * **Kluczowe komponenty widoku:** Karty klubów (dla użytkownika), tabela/lista klubów (dla administratora), przyciski nawigacyjne, przycisk tworzenia klubu (dla administratora).
    * **UX, dostępność i bezpieczeństwo:** Dynamiczne wyświetlanie zawartości w zależności od roli (użytkownik/administrator). Automatyczne przekierowanie dla użytkownika z jednym klubem. Pełna dostępność (nawigacja klawiaturowa, wsparcie czytników ekranu). Widoczność elementów i akcji zgodna z autoryzacją JWT.

2. **Widok klubu (Dla użytkownika, właściciela klubu i administratora)**
    * **Ścieżka widoku:** `/club/:clubId`
    * **Główny cel:**
        * **Użytkownik (member/trainer):** Przeglądanie harmonogramu zajęć i zapisywanie się na nie.
        * **Użytkownik (clubOwner):** Zarządzanie harmonogramem zajęć (tworzenie, edycja, usuwanie), zarządzanie członkami klubu (przeglądanie listy, zapraszanie nowych użytkowników z rolami member/trainer).
        * **Administrator:** Pełne zarządzanie klubem jak clubOwner, z dodatkową możliwością zapraszania nowych użytkowników z rolą administratora klubu.
    * **Kluczowe informacje:**
        * **Wszyscy:** Harmonogram zajęć (kalendarz/lista), szczegóły zajęć w modalu.
        * **ClubOwner/Admin:** Lista członków klubu (w tym zaproszonych), formularze tworzenia/edycji zajęć, formularz zapraszania użytkowników.
    * **Kluczowe komponenty widoku:** Kalendarz/lista zajęć, modal ze szczegółami zajęć (z przyciskiem "zapisz się" dla member/trainer), tabele/listy członków, formularze (edycja zajęć, zaproszenia), przyciski akcji (edytuj, usuń, dodaj, zaproś).
    * **UX, dostępność i bezpieczeństwo:** Łatwa nawigacja po harmonogramie. Dostępny modal. Intuicyjna edycja i zarządzanie dla clubOwner/Admina z walidacją inline i powiadomieniami. Filtrowanie/sortowanie listy członków. Pełna zgodność z WCAG AA. Mechanizmy ochrony danych i autoryzacji JWT dostosowane do roli użytkownika w klubie i globalnej.

## 3. Mapa podróży użytkownika

1. **Logowanie/Rejestracja:** Użytkownik loguje się lub rejestruje poprzez dedykowane formularze.
2. **Dashboard:**
    * **Użytkownik:** Jeśli należy do wielu klubów, widzi ich listę i wybiera jeden. Jeśli należy do jednego, jest automatycznie przekierowany do widoku tego klubu.
    * **Administrator:** Widzi listę wszystkich klubów, może przejść do widoku wybranego klubu lub utworzyć nowy.
3. **Widok Klubu:**
    * **Użytkownik (member/trainer):** Przegląda harmonogram, klika w zajęcia, otwiera modal, zapisuje się.
    * **Użytkownik (clubOwner):** Zarządza harmonogramem, przegląda listę członków, zaprasza nowych użytkowników (member/trainer).
    * **Administrator:** Wykonuje akcje jak clubOwner, dodatkowo może zapraszać administratorów klubu.
4. **Zarządzanie/Interakcja:** Użytkownicy wykonują akcje zgodnie ze swoimi uprawnieniami (zapis na zajęcia, edycja harmonogramu, zarządzanie członkami).

## 4. Układ i struktura nawigacji

* **Desktop:** Główna nawigacja w postaci paska bocznego.
  * **Wszyscy:** Odnośnik do Dashboardu (`/`).
  * **Administrator:** Dodatkowy odnośnik do tworzenia klubu (dostępny z poziomu Dashboardu).
  * Nawigacja wewnątrz widoku klubu (np. zakładki Harmonogram/Członkowie) dostosowana do roli (clubOwner/Admin widzą więcej opcji).
* **Mobile:** Nawigacja realizowana przez menu hamburger lub dolny pasek nawigacyjny, zapewniające dostęp do Dashboardu i ewentualnie specyficznych akcji w widoku klubu.
* Elementy nawigacyjne i dostępne akcje są dynamicznie dostosowywane do globalnej roli użytkownika (admin/user) oraz jego roli w kontekście konkretnego klubu (member/trainer/clubOwner).

## 5. Kluczowe komponenty

* **Pasek boczny / Menu hamburger:** Podstawowy element nawigacji.
* **Karty klubów / Tabela klubów:** Komponenty wyświetlające listy klubów na Dashboardzie.
* **Kalendarz / Lista zajęć:** Dynamiczny komponent prezentujący harmonogram zajęć klubu.
* **Modal ze szczegółami zajęć:** Okno dialogowe z informacjami o zajęciach i przyciskiem akcji (np. "zapisz się").
* **Formularze:** Komponenty do logowania, rejestracji, tworzenia klubu (admin), zaproszeń, tworzenia/edycji zajęć, wyposażone w walidację i komunikaty o błędach.
* **Tabele/Listy członków:** Używane do prezentacji listy członków klubu z funkcjami sortowania, filtrowania i zarządzania.
* **System powiadomień:** Mechanizm wyświetlania komunikatów inline oraz toastów.
* **Przełącznik trybu jasny/ciemny:** Umożliwiający dostosowanie interfejsu.
