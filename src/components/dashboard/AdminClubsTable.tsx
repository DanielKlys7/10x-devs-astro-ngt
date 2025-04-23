import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminClubRow } from "./AdminClubRow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { SportClub, PaginationResponse } from "@/types";
import { Plus } from "lucide-react";

interface AdminClubsTableProps {
  clubs: SportClub[];
  pagination: PaginationResponse;
  onCreateClub: () => void;
  onInviteAdmin: (clubId: string) => void;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}

export function AdminClubsTable({
  clubs,
  pagination,
  onCreateClub,
  onInviteAdmin,
  onPageChange,
  onSearch,
}: AdminClubsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const clubsWithMemberCount = clubs.map((club) => ({
    ...club,
    memberCount: 0,
  }));

  const { page, total, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji formularza
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Input
            type="search"
            placeholder="Wyszukaj po nazwie lub adresie..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
            aria-label="Wyszukaj kluby"
          />
        </form>
        <Button onClick={onCreateClub}>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj klub
        </Button>
      </div>

      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm" role="table" aria-label="Lista klubów">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Nazwa</th>
              <th className="h-12 px-4 text-center align-middle font-medium">Członkowie</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {clubsWithMemberCount.map((club) => (
              <AdminClubRow key={club.id} club={club} onInviteAdmin={onInviteAdmin} />
            ))}
            {clubsWithMemberCount.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-muted-foreground">
                  {searchQuery
                    ? "Nie znaleziono klubów spełniających kryteria wyszukiwania"
                    : "Brak klubów do wyświetlenia"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => canGoPrevious && onPageChange(page - 1)}
                  aria-disabled={!canGoPrevious}
                  className={!canGoPrevious ? "pointer-events-none opacity-50" : ""}
                  aria-label="Poprzednia strona"
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2" aria-label={`Strona ${page} z ${totalPages}`}>
                  {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => canGoNext && onPageChange(page + 1)}
                  aria-disabled={!canGoNext}
                  className={!canGoNext ? "pointer-events-none opacity-50" : ""}
                  aria-label="Następna strona"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
