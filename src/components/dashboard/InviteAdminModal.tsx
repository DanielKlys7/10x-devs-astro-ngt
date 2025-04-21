import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateInvitationRequestDTO } from "@/types";

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  clubName: string;
}

export function InviteAdminModal({ isOpen, onClose, clubId, clubName }: InviteAdminModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Wprowadź adres email");
      return;
    }

    try {
      setIsSubmitting(true);
      const data: CreateInvitationRequestDTO = {
        email,
        targetRole: "administrator",
      };

      const response = await fetch(`/api/clubs/${clubId}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nie udało się wysłać zaproszenia");
      }

      toast.success("Zaproszenie zostało wysłane");
      onClose();
      setEmail("");
    } catch (error) {
      console.error("Błąd podczas wysyłania zaproszenia:", error);
      toast.error("Nie udało się wysłać zaproszenia. Spróbuj ponownie później.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zaproś administratora klubu</DialogTitle>
          <DialogDescription>Wyślij zaproszenie do zarządzania klubem {clubName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">
              Email administratora <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Wprowadź adres email"
              required
              aria-required="true"
              aria-describedby="email-description"
            />
            <p id="email-description" className="text-sm text-muted-foreground">
              Na ten adres zostanie wysłane zaproszenie do zarządzania klubem
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-label={`Wyślij zaproszenie do zarządzania klubem ${clubName}`}
            >
              {isSubmitting ? "Wysyłanie..." : "Wyślij zaproszenie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
