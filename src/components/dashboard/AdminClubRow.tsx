import { Button } from "@/components/ui/button";
import type { SportClub } from "@/types";

interface AdminClubRowProps {
  club: SportClub & { memberCount: number };
  onInviteAdmin: (clubId: string) => void;
}

export function AdminClubRow({ club, onInviteAdmin }: AdminClubRowProps) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4">
        <div className="font-medium">{club.name}</div>
        {club.address && <div className="text-sm text-muted-foreground">{club.address}</div>}
      </td>
      <td className="p-4 text-center">
        <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-0.5 rounded-full text-sm bg-muted">
          {club.memberCount}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => (window.location.href = `/club/${club.id}`)}>
            Przejdź
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onInviteAdmin(club.id)}>
            Zaproś admina
          </Button>
        </div>
      </td>
    </tr>
  );
}
