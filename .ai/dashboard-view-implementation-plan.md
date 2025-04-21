# Plan implementacji widoku Dashboard

## 1. Przegląd
Widok Dashboard służy do wyświetlania listy klubów, do których należy bieżący użytkownik (rola `user`) lub wszystkich klubów w systemie (rola `administrator`). Jeśli użytkownik (`user`) należy tylko do jednego klubu, zostaje automatycznie przekierowany do widoku szczegółowego tego klubu. Administrator systemu widzi tabelę wszystkich klubów wraz z możliwością utworzenia nowego klubu.

## 2. Routing widoku
- Ścieżka: `/`
- Plik strony Astro: `src/pages/index.astro`

## 3. Struktura komponentów
```
DashboardPage
├─ useUserRole (hook)
├─ useClubs (hook)
├─ RedirectIfSingleClub (logic)
├─ ClubsList                (użytkownik)
│  └─ ClubCard
│     ├─ Link do /club/:clubId
│     └─ Logo, nazwa, adres
├─ AdminClubsTable          (administrator)
│  ├─ TableHeader
│  └─ AdminClubRow
│     ├─ Nazwa, liczba członków
│     ├─ Buttony: "Przejdź", "Zaproś admina"
│     └─ Utwórz klub (przycisk) otwierający modal
└─ PaginationControls
```

## 4. Szczegóły komponentów

### DashboardPage
- Opis: Główny komponent strony `/`, ładuje dane i przekierowuje lub renderuje jedną z dwóch sekcji.
- Główne elementy:
  - Hook `useUserRole` zwracający rolę globalną `user`/`administrator`.
  - Hook `useClubs` (React Query) do pobrania listy klubów z `/api/clubs`.
  - Komponent `RedirectIfSingleClub` wywołujący przekierowanie.
  - Render warunkowy: `ClubsList` lub `AdminClubsTable`.
- Obsługiwane zdarzenia:
  - Kliknięcie przycisku w `ClubCard` lub w wierszu tabeli.
- Walidacja:
  - Warunek przekierowania, brak dubli 
- Typy:
  - `GetClubsResponseDTO` (pobrane dane)
  - `SportClub`
  - `PaginationResponse`
- Propsy: brak (komponent strony)

### ClubsList
- Opis: Lista kart klubów dla roli `user`.
- Główne elementy:
  - Pętla po `clubs: SportClub[]`
  - `ClubCard` dla każdego
- Obsługiwane zdarzenia:
  - `onClick` w `ClubCard`
- Walidacja:
  - Jeśli `clubs.length === 0` wyświetl komunikat wariantu pustego: "Nie należysz do żadnych klubów"
- Typy:
  - `SportClub[]`, `PaginationResponse`
- Propsy:
  - `clubs: SportClub[]`
  - `pagination: PaginationResponse`

### ClubCard
- Opis: Karta pojedynczego klubu.
- Główne elementy:
  - Logo (opcjonalne)
  - Nazwa (`name`)
  - Adres (`address`)
- Obsługiwane zdarzenia:
  - `onClick` – nawigacja do `/club/${id}`
- Typy:
  - `SportClub`
- Propsy:
  - `club: SportClub`

### AdminClubsTable
- Opis: Tabela wszystkich klubów dla administratora.
- Główne elementy:
  - Nagłówki: Nazwa, Członkowie, Akcje
  - `AdminClubRow` dla każdego klubu
  - Przycisk "Utwórz klub"
- Obsługiwane zdarzenia:
  - Klik `Przejdź` -> `/club/${id}`
  - Klik `Zaproś admina` -> wywołanie modalu formularza
- Walidacja:
  - `clubs.length === 0` -> komunikat "Brak klubów w systemie"
- Typy:
  - `SportClub[]`, `Membership[]` (tylko liczba)
- Propsy:
  - `clubs: SportClub[]`

### AdminClubRow
- Opis: Wiersz tabeli z danymi klubu.
- Główne elementy:
  - Nazwa
  - Liczba członków (pole z DTO `club.member_count` lub rzutowane)
  - Przycisk „Przejdź”
  - Przycisk „Zaproś admina”
- Obsługiwane zdarzenia: jak wyżej.
- Typy:
  - `SportClub` z dodatkowym polem `memberCount: number`
- Propsy:
  - `club: SportClub & { memberCount: number }`

### PaginationControls
- Opis: Sterowanie paginacją.
- Elementy:
  - Przycisk „Poprzednia”/„Następna”
  - Wskaźnik strony
- Obsługiwane zdarzenia:
  - Zmiana strony -> `fetchNextPage`/`fetchPreviousPage`
- Typy:
  - `PaginationResponse`
- Propsy:
  - `pagination: PaginationResponse`
  - `onPageChange: (newPage: number) => void`

## 5. Typy
**Nowe lub używane typy:**
- GetClubsResponseDTO:
  - `clubs: SportClub[]`
  - `pagination: { page: number; limit: number; total: number }`
- SportClub:
  - `id: string`
  - `name: string`
  - `address?: string`
  - `contact_email: string`
  - `contact_phone?: string`
  - `logo_url?: string`
- ClubCardViewModel (opcjonalny):
  - `id`, `name`, `address`, `logoUrl`

## 6. Zarządzanie stanem
- Użycie React Query (`useClubs`) do pobierania i cache’owania danych.
- Local state w `DashboardPage` do paginacji: `const [page, setPage] = useState(1);`
- Hook `useUserRole` do pobrania roli z kontekstu uwierzytelnienia.
- `useEffect` w `DashboardPage` do przekierowania przy pojedynczym klubie.

## 7. Integracja API
- Endpoint GET `/api/clubs?page=<page>&limit=<limit>&search=`
- Zapytanie:
  ```ts
  type GetClubsRequestDTO = { page?: number; limit?: number; search?: string };
  ```
- Odpowiedź:
  ```ts
  interface GetClubsResponseDTO { clubs: SportClub[]; pagination: PaginationResponse; }
  ```
- Użycie w React Query:
  ```ts
  useQuery<GetClubsResponseDTO>(["clubs", page], () => fetch(`/api/clubs?page=${page}&limit=10`).then(res => res.json()));
  ```

## 8. Interakcje użytkownika
- Po zalogowaniu wczytanie `/` automatycznie uruchamia fetch.
- `user`:
  - Jeśli 1 klub -> przekierowanie do `/club/:id`.
  - Jeśli >1 -> wyświetlenie `ClubCard`.
  - Klik na kartę -> nawigacja.
- `administrator`:
  - Tabela klubów.
  - Klik `Utwórz klub` -> otwarcie formularza.
  - Klik `Przejdź` -> nawigacja.
  - Klik `Zaproś admina` -> otwarcie modalu.

## 9. Warunki i walidacja
- `clubs.length === 0` -> komunikat.
- Weryfikacja uprawnień (hook `useUserRole`).
- Paginacja: `page <= totalPages`.

## 10. Obsługa błędów
- `isLoading` -> spinner.
- `isError` -> toast z komunikatem i opcja retry.
- Pusty stan -> komunikat informacyjny.

## 11. Kroki implementacji
1. Utworzyć plik `src/pages/index.astro` oraz komponent React `DashboardPage`.
2. Zaimplementować hook `useUserRole`.
3. Zaimplementować hook `useClubs` (React Query).
4. Dodać mechanizm przekierowania `RedirectIfSingleClub`.
5. Stworzyć komponent `ClubCard`.
6. Stworzyć komponent `ClubsList`.
7. Stworzyć komponent `AdminClubsTable` i `AdminClubRow`.
8. Dodać `PaginationControls`.
9. Zastosować warunki renderowania dla ról.
10. Dodać obsługę ładowania, błędów i pustych danych.
11. Przetestować scenariusze: 0,1,>1 klubów; role `user`/`administrator`.
12. Zintegrować style Tailwind i Shadcn/ui (np. `Card`, `Table`).