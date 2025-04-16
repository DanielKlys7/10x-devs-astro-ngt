import type { APIRoute } from "astro";
import { createClubSchema } from "../../lib/validations/club.schema";
import type { CreateClubRequestDTO, CreateClubResponseDTO, ApiErrorResponse } from "../../types";
import { ClubService } from "../../lib/services/club.service";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = (await request.json()) as CreateClubRequestDTO;
    const validationResult = createClubSchema.safeParse(data);
    if (!validationResult.success) {
      const zodError = validationResult.error;
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: "Nieprawidłowe dane wejściowe: " + zodError.issues.map((issue) => issue.message).join(", "),
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clubService = new ClubService(locals.supabase);

    try {
      const newClub = await clubService.createClub({
        name: data.name,
        contact_email: data.contact_email,
        address: data.address,
        contact_phone: data.contact_phone,
      });

      return new Response(JSON.stringify(newClub as CreateClubResponseDTO), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message.includes("już istnieje")) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: serviceError.message,
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw serviceError;
    }
  } catch (err: unknown) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: `Nieoczekiwany błąd podczas przetwarzania żądania: ${err}`,
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
