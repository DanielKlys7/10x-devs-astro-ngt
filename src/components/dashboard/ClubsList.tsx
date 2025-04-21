import { ClubCard } from "./ClubCard";
import type { SportClub } from "@/types";

interface ClubsListProps {
  clubs: SportClub[];
}

export function ClubsList({ clubs }: ClubsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="region" aria-label="Lista klubów">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}
