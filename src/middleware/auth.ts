import type { MiddlewareHandler } from "astro";
import { supabaseClient } from "../db/supabase.client";

export const authMiddleware: MiddlewareHandler = async ({ locals }) => {
  // TODO: Implementacja autoryzacji zostanie dodana później
  locals.supabase = supabaseClient;

  return new Response(null, { status: 200 });
};
