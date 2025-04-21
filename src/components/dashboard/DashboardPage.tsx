import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserRole } from "@/components/hooks/useUserRole";
import { ClubsList } from "./ClubsList";
import { AdminClubsTable } from "./AdminClubsTable";
import { CreateClubModal } from "./CreateClubModal";
import { InviteAdminModal } from "./InviteAdminModal";
import type { CreateClubRequestDTO, GetClubsResponseDTO, SportClub } from "@/types";
import { getMockClubsResponse } from "./__mocks__/mockData";
import queryClient from "@/queryClient";

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

// Ustaw na true, aby używać mocków zamiast prawdziwego API
const USE_MOCKS = true;

export function DashboardPage() {
  const { role, isLoading: isRoleLoading } = useUserRole();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<SportClub | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset do pierwszej strony przy wyszukiwaniu
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: clubsData,
    isLoading: isClubsLoading,
    error: clubsError,
    refetch: refetchClubs,
  } = useQuery<GetClubsResponseDTO>(
    {
      queryKey: ["clubs", currentPage, debouncedSearchQuery],
      queryFn: async () => {
        if (USE_MOCKS) {
          return getMockClubsResponse(currentPage, ITEMS_PER_PAGE, debouncedSearchQuery);
        }

        const searchParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });

        if (debouncedSearchQuery) {
          searchParams.append("search", debouncedSearchQuery);
        }

        const response = await fetch(`/api/clubs?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error("Nie udało się pobrać listy klubów");
        }
        return response.json();
      },
    },
    queryClient
  );

  useEffect(() => {
    if (clubsError) {
      toast.error("Nie udało się pobrać listy klubów. Spróbuj ponownie później.");
    }
  }, [clubsError]);

  useEffect(() => {
    if (clubsData?.clubs && role === "user" && clubsData.clubs.length === 1) {
      const singleClub = clubsData.clubs[0];
      window.location.href = `/club/${singleClub.id}`;
    }
  }, [clubsData, role]);

  const handleCreateClub = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateClubSubmit = async (data: CreateClubRequestDTO) => {
    try {
      if (USE_MOCKS) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Symulacja opóźnienia
        await refetchClubs();
        toast.success("Klub został utworzony pomyślnie");
        return;
      }

      const response = await fetch("/api/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nie udało się utworzyć klubu");
      }

      await refetchClubs();
      toast.success("Klub został utworzony pomyślnie");
    } catch (error) {
      console.error("Błąd podczas tworzenia klubu:", error);
      throw error;
    }
  };

  const handleInviteAdmin = (clubId: string) => {
    const club = clubs.find((c) => c.id === clubId);
    if (club) {
      setSelectedClub(club);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isRoleLoading || isClubsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-label="Ładowanie">
        <span className="text-muted-foreground">Ładowanie...</span>
      </div>
    );
  }

  const clubs = clubsData?.clubs ?? [];
  const pagination = clubsData?.pagination ?? {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    total: 0,
  };

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{role === "administrator" ? "Zarządzanie klubami" : "Twoje kluby"}</h1>

      {clubs.length === 0 && !debouncedSearchQuery && (
        <p className="text-muted-foreground text-center py-8">
          {role === "administrator" ? "Brak klubów w systemie" : "Nie należysz do żadnych klubów"}
        </p>
      )}

      {(clubs.length > 0 || debouncedSearchQuery) &&
        (role === "administrator" ? (
          <AdminClubsTable
            clubs={clubs}
            pagination={pagination}
            onCreateClub={handleCreateClub}
            onInviteAdmin={handleInviteAdmin}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
          />
        ) : (
          <ClubsList clubs={clubs} />
        ))}

      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClubSubmit}
      />

      {selectedClub && (
        <InviteAdminModal
          isOpen={!!selectedClub}
          onClose={() => setSelectedClub(null)}
          clubId={selectedClub.id}
          clubName={selectedClub.name}
        />
      )}
    </main>
  );
}
