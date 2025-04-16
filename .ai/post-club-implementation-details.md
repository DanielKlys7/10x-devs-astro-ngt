
# API Endpoint Implementation Plan: POST /api/clubs

## 1. Przegląd punktu końcowego
- Cel: Utworzenie nowego klubu sportowego przez użytkownika z uprawnieniami administratora.
- Endpoint: `POST /api/clubs`
- Funkcjonalność: Endpoint przyjmuje dane wejściowe dotyczące klubu, waliduje je, a następnie tworzy nowy rekord w tabeli `sport_clubs` w bazie danych. Po udanym utworzeniu zwraca dane stworzonego klubu, w tym wygenerowany UUID oraz informacje o czasie utworzenia i modyfikacji.

## 2. Szczegóły żądania
- Metoda HTTP: `POST`
- Struktura URL: `/api/clubs`
- Nagłówki:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (wymagany token autoryzacyjny)
- Parametry żądania (w ciele requestu):
  - Wymagane:
    - `name` (string) – nazwa klubu
    - `contact_email` (string) – email kontaktowy
  - Opcjonalne:
    - `address` (string) – adres klubu
    - `contact_phone` (string) – numer telefonu kontaktowego

## 3. Wykorzystywane typy
- DTO:
  - `CreateClubRequestDTO` – wykorzystywany do walidacji i mapowania danych wejściowych.
  - `CreateClubResponseDTO` – struktura odpowiedzi, zawierająca szczegóły nowo utworzonego klubu.
- Command Model:
  - `CreateClubCommand` – model przekazywany do warstwy serwisowej, który abstrahuje logikę tworzenia klubu.

## 4. Szczegóły odpowiedzi
- Statusy HTTP:
  - `201 Created` – klub został poprawnie utworzony.
  - `400 Bad Request` – dane wejściowe są nieprawidłowe lub brakuje wymaganych pól.
  - `401 Unauthorized` – brak autoryzacji lub niewłaściwy token.
  - `500 Internal Server Error` – nieoczekiwany błąd po stronie serwera.
- Struktura odpowiedzi:
  - Sukces: JSON zawierający dane utworzonego klubu, m.in. wygenerowany `UUID`, `created_at`, `updated_at` oraz podane dane.
  - Błąd: JSON zawierający informacje o błędzie zgodnie z modelem `ApiErrorResponse`.

## 5. Przepływ danych
- Żądanie jest najpierw przechwytywane przez middleware w celu weryfikacji tokenu JWT i sprawdzenia uprawnień administratora.
- Po pozytywnej autoryzacji, dane wejściowe są walidowane przy użyciu Zod (odpowiadającego strukturze `CreateClubRequestDTO`).
- Następnie dane są mapowane do obiektu `CreateClubCommand` i przekazywane do odpowiedniego serwisu.
- Warstwa serwisowa wykonuje operację insercji danych do tabeli `sport_clubs` w bazie danych.
- Po ukończeniu insercji serwis zwraca dane utworzonego rekordu, które są mapowane do `CreateClubResponseDTO` i przesyłane w odpowiedzi HTTP.

## 6. Względy bezpieczeństwa
- Uwierzytelnienie i autoryzacja: Sprawdzanie tokenu JWT i weryfikacja, czy użytkownik posiada uprawnienia administratora.
- Walidacja danych: Stosowanie Zod w celu walidacji wejściowych danych, zapobiegając atakom typu injection.
- Ograniczenie dostępu: Endpoint dostępny tylko dla użytkowników z uprawnieniami admin.
- Audyt i logowanie: Rejestrowanie operacji oraz błędów w systemie logowania dla celów audytu.

## 7. Obsługa błędów
- Możliwe scenariusze błędów:
  - 400 Bad Request: Wystąpi, gdy dane wejściowe są niepoprawne lub brakuje wymaganych pól.
  - 401 Unauthorized: Wystąpi, gdy token autoryzacyjny jest nieobecny lub nieważny.
  - 500 Internal Server Error: Wystąpi przy problemach wewnętrznych, takich jak niepowodzenie injekcji danych do bazy danych.
- Mechanizm obsługi błędów:
  - Wyłapywanie wyjątków na poziomie serwisu i endpointu.
  - Logowanie szczegółów błędów (np. do systemu monitoringu lub pliku logów).
  - Użycie wczesnych zwrotów (guard clauses) w przypadku błędów walidacji.

## 8. Rozważania dotyczące wydajności
- Użycie asynchronicznych operacji do komunikacji z bazą danych zmniejsza blokowanie zasobów.
- Minimalizacja operacji przetwarzających tylko niezbędne dane.
- Skalowalność: Zapewnienie, że logika serwisowa jest modularna i łatwa do rozszerzenia w miarę wzrostu liczby żądań.
- Testy obciążeniowe: Przeprowadzenie testów integracyjnych i obciążeniowych, aby upewnić się, że endpoint działa sprawnie przy dużym natężeniu ruchu.

## 9. Etapy wdrożenia
1. Przygotowanie walidacji:
   - Stworzenie schematu walidacji Zod dla `CreateClubRequestDTO`.
   - Mapowanie danych wejściowych do `CreateClubCommand`.
2. Implementacja middleware:
   - Dodanie logiki weryfikacji tokenu JWT oraz sprawdzenie, czy użytkownik posiada uprawnienia administratora.
3. Implementacja warstwy serwisowej:
   - Utworzenie (lub rozszerzenie istniejącej) logiki w katalogu `src/lib/services` do obsługi tworzenia klubu.
   - Implementacja operacji insercji do tabeli `sport_clubs` w bazie danych.
4. Implementacja endpointu API:
   - Utworzenie pliku (np. `src/pages/api/clubs.ts`) obsługującego żądanie POST.
   - Integracja warstwy walidacji, middleware i serwisu.
5. Mapowanie odpowiedzi:
   - Konwersja danych z warstwy serwisowej do obiektu typu `CreateClubResponseDTO`.
   - Odesłanie odpowiedzi HTTP z kodem 201, w przypadku powodzenia.
6. Testowanie:
   - Przeprowadzenie testów jednostkowych walidacji i logiki serwisowej.
   - Testy integracyjne endpointu API (np. przy użyciu narzędzi takich jak Postman lub testów automatycznych).
7. Dokumentacja i deployment:
   - Aktualizacja dokumentacji API (np. Swagger).
   - Deployment na środowisko testowe, weryfikacja poprawności działania, a następnie wdrożenie na środowisko produkcyjne.

