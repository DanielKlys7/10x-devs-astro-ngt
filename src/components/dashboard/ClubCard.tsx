import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { SportClub } from "@/types";

interface ClubCardProps {
  club: SportClub;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card
      className="hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => (window.location.href = `/club/${club.id}`)}
      role="article"
      aria-labelledby={`club-name-${club.id}`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-primary" aria-hidden="true">
            🏢
          </span>
          <h3 id={`club-name-${club.id}`} className="text-lg font-semibold">
            {club.name}
          </h3>
        </div>
      </CardHeader>

      {club.address && (
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden="true">📍</span>
            <span>{club.address}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
