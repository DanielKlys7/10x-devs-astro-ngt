# API Endpoint Implementation Plan: GET /api/clubs

## 1. Przegląd punktu końcowego

Punkt końcowy służy do pobierania listy klubów sportowych z obsługą paginacji i opcjonalnym filtrowaniem po nazwie.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- URL: `/api/clubs`
- Query parameters:
  - `page?` (number) – numer strony, domyślnie 1
  - `limit?` (number) – liczba elementów na stronę, domyślnie 10, maks. 100
  - `search?` (string) – fraza do filtrowania nazw klubów
- Walidacja i Request DTO (Zod + TypeScript):

```ts
export const getClubsRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
});
export type GetClubsRequestDTO = z.infer<typeof getClubsRequestSchema>;
```

## 3. Szczegóły odpowiedzi

- Status: 200 OK
- Body:s

```json
{
  "clubs": SportClub[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number
  }
}
```

- Response DTO (TypeScript):

```ts
export type SportClub = {
  id: string;
  name: string;
  address?: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
};

export type PaginationResponse = {
  page: number;
  limit: number;
  total: number;
};

export type GetClubsResponseDTO = {
  clubs: SportClub[];
  pagination: PaginationResponse;
};
```

## 4. Przepływ danych

1. Handler (`src/pages/api/clubs/index.ts`):
   - Pobiera `supabase` z `context.locals`.
   - Parsuje i waliduje query params za pomocą `getClubsRequestSchema`.
2. Service (`src/lib/services/club.service.ts`):
   - Metoda `getClubs(dto: GetClubsRequestDTO): Promise<GetClubsResponseDTO>`.
   - Buduje zapytanie do Supabase:
     - `.from('sport_clubs')`
     - `.select('id, name, address, contact_email, contact_phone, created_at, updated_at')`
     - `.is('deleted_at', null)`
     - Jeśli `search`: `.ilike('name',`%${search}%`)
     - Ustawia paginację `.range((page-1)*limit, page*limit - 1)`
   - Zwraca tablicę `clubs` i obiekt `pagination` (odczytanie `count` z Supabase lub osobne zapytanie COUNT).
3. Response: Handler formatuje i zwraca JSON z `GetClubsResponseDTO`.

## 5. Względy bezpieczeństwa

- Autoryzacja: Jeżeli endpoint ma być chroniony, zastosować middleware JWT (Astro middleware) i zwracać 401 w razie braku/nieprawidłowego tokenu.
- RLS: Polityki Row Level Security w Supabase dopuszczające tylko rekordy z `deleted_at IS NULL`.
- Ograniczenia: Maksymalna wartość `limit` = 100, maksymalna długość `search` = np. 100 znaków, aby zapobiec nadmiernym kosztom zapytań.

## 6. Obsługa błędów

| Sytuacja                              | Kod   | Opis                                           |
|---------------------------------------|-------|------------------------------------------------|
| Błąd walidacji Zod                    | 400   | Szczegóły błędów walidacji w body odpowiedzi   |
| Brak/nieprawidłowy token (jeśli chron.)| 401   | { "error": "Unauthorized" }                |
| Błąd Supabase / niespodziewany wyjątek| 500   | Log do Sentry/`analytics_logs` + generyczny komunikat |

## 7. Rozważania dotyczące wydajności

- Użycie pagination via `.range()` zamiast FETCH ALL.
- Indeks na kolumnie `name` (GIN lub B-tree z `ilike`) dla szybkiego filtrowania.
- Limit max 100.
- Opcjonalne cache'owanie odpowiedzi (CDN / edge caching) dla stron rzadko zmieniających się.

## 8. Kroki implementacji

1. W `src/types.ts` lub `src/types/api.ts` zdefiniować Zod schema oraz DTO.
2. Utworzyć plik `src/lib/services/club.service.ts` z klasą `ClubService` i metodą `getClubs`.
3. Napisać handler w `src/pages/api/clubs/index.ts`:
   - Importować `getClubsRequestSchema`, `ClubService`.
   - Walidować query, wywołać service i zwrócić odpowiedź.
4. Dodać (jeśli potrzebne) middleware JWT w `src/middleware/index.ts`.
5. Napisać testy jednostkowe dla `ClubService` (mock Supabase) i integracyjne dla endpointu.
6. Zaktualizować dokumentację API (OpenAPI/README).
7. Przeprowadzić code review i zdeployować zmianę do środowiska testowego.
8. Monitorować logi błędów i metryki wydajności po wdrożeniu.
