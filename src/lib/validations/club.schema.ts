import { z } from "zod";

export const createClubSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nazwa klubu jest wymagana" })
    .max(100, { message: "Nazwa klubu nie może przekraczać 100 znaków" }),
  contact_email: z.string().email({ message: "Nieprawidłowy format adresu email" }),
  address: z.string().max(200, { message: "Adres nie może przekraczać 200 znaków" }).optional(),
  contact_phone: z
    .string()
    .regex(/^\+?[\d\s-()]{9,}$/, { message: "Nieprawidłowy format numeru telefonu" })
    .optional(),
});

export type CreateClubSchema = typeof createClubSchema;
