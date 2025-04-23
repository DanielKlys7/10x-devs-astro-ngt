import type { APIRoute } from "astro";
import { z } from "zod";
import { createClubSchema } from "../../lib/validations/club.schema";
import type { CreateClubRequestDTO, CreateClubResponseDTO, ApiErrorResponse } from "../../types";
import { ClubService } from "../../lib/services/club.service";

// Schema walidacji parametrów zapytania dla GET
export const getClubsRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
});

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    // Parsowanie i walidacja parametrów zapytania
    const searchParams = Object.fromEntries(url.searchParams);
    const validatedParams = getClubsRequestSchema.safeParse(searchParams);

    if (!validatedParams.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message:
          "Nieprawidłowe parametry zapytania: " + validatedParams.error.issues.map((issue) => issue.message).join(", "),
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Inicjalizacja serwisu i pobranie danych
    const clubService = new ClubService(locals.supabase);
    const response = await clubService.getClubs(validatedParams.data);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);

    const errorResponse: ApiErrorResponse = {
      success: false,
      message: "Nieoczekiwany błąd podczas pobierania klubów",
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

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
