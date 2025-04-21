import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateClubRequestDTO } from "@/types";

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClubRequestDTO) => Promise<void>;
}

export function CreateClubModal({ isOpen, onClose, onSubmit }: CreateClubModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateClubRequestDTO>({
    name: "",
    contact_email: "",
    address: "",
    contact_phone: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.contact_email) {
      toast.error("Wypełnij wymagane pola");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
      setFormData({
        name: "",
        contact_email: "",
        address: "",
        contact_phone: "",
      });
    } catch (error) {
      console.error("Błąd podczas tworzenia klubu:", error);
      toast.error("Nie udało się utworzyć klubu. Spróbuj ponownie później.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "club-name"
        ? "name"
        : id === "contact-email"
          ? "contact_email"
          : id === "contact-phone"
            ? "contact_phone"
            : "address"]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz nowy klub</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="club-name">
              Nazwa klubu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="club-name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Wprowadź nazwę klubu"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">
              Email kontaktowy <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={formData.contact_email}
              onChange={handleInputChange}
              placeholder="Wprowadź email kontaktowy"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Wprowadź adres klubu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Telefon kontaktowy</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={formData.contact_phone}
              onChange={handleInputChange}
              placeholder="Wprowadź telefon kontaktowy"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Tworzenie..." : "Utwórz klub"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
