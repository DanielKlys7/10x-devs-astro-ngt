import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { CreateClubCommand, SportClub } from "../../types";

export class ClubService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createClub(command: CreateClubCommand): Promise<SportClub> {
    // Sprawdzenie czy klub o takiej nazwie już istnieje
    const { data: existingClub } = await this.supabase.from("sport_clubs").select().eq("name", command.name).single();

    if (existingClub) {
      throw new Error("Klub o takiej nazwie już istnieje");
    }

    // Utworzenie nowego klubu
    const { data: newClub, error } = await this.supabase
      .from("sport_clubs")
      .insert([
        {
          name: command.name,
          contact_email: command.contact_email,
          address: command.address,
          contact_phone: command.contact_phone,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas tworzenia klubu: ${error.message}`);
    }

    if (!newClub) {
      throw new Error("Nie udało się utworzyć klubu");
    }

    return newClub;
  }
}
