import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { CreateClubCommand, SportClub, GetClubsRequestDTO, GetClubsResponseDTO } from "../../types";

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

  async getClubs(dto: GetClubsRequestDTO): Promise<GetClubsResponseDTO> {
    const { page = 1, limit = 10, search } = dto;

    // Budowanie zapytania bazowego
    let query = this.supabase
      .from("sport_clubs")
      .select("id, name, address, contact_email, contact_phone, created_at, updated_at", { count: "exact" })
      .is("deleted_at", null);

    // Dodanie filtrowania po nazwie, jeśli search jest zdefiniowany
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Dodanie paginacji
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    query = query.range(from, to);

    // Wykonanie zapytania
    const { data: clubs, count, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch clubs: ${error.message}`);
    }

    return {
      clubs: clubs as SportClub[],
      pagination: {
        page,
        limit,
        total: count ?? 0,
      },
    };
  }
}
