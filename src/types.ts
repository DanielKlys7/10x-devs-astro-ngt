/**
 * Definicje typów DTO i Command Modeli na podstawie planu API oraz modeli bazy danych.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/* =================
   UŻYTKOWNIK / AUTH
   ================= */

export interface UserDTO {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}

export interface RegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  inviteToken?: string;
}

export type RegisterResponseDTO = UserDTO;

/* ============================
   PAGINOWANE ODPOWIEDZI
   ============================ */

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

/* ============================
   KLUBY SPORTOWE (Club)
   ============================ */

export interface ClubDTO {
  id: string;
  name: string;
  address?: string | null;
  contact_email: string;
  contact_phone?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Komenda do tworzenia klubu – pola pochodzą bezpośrednio z definicji klubu
export type CreateClubCommand = Omit<ClubDTO, "id" | "created_at" | "updated_at" | "deleted_at">;

// Komenda do aktualizacji klubu – wszystkie pola opcjonalne
export type UpdateClubCommand = Partial<CreateClubCommand>;

/* ============================
   CZŁONKOSTWA (Membership)
   ============================ */

export interface MembershipDTO {
  id: string;
  club_id: string;
  managed_by: string;
  membership_role: string;
  active_plan_expires_at?: string | null;
  active_plan_pricing_plan_id?: string | null;
  active_plan_start_date?: string | null;
  auto_renew: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Komenda do tworzenia członkostwa – pól wymaganych do stworzenia rekordu
export type CreateMembershipCommand = Pick<MembershipDTO, "club_id" | "user_id" | "membership_role" | "managed_by">;

// Komenda do aktualizacji członkostwa – aktualizujemy rolę, przypisanie planu oraz auto_renew
export type UpdateMembershipCommand = Partial<
  Pick<MembershipDTO, "membership_role" | "active_plan_pricing_plan_id" | "auto_renew">
>;

/* ============================
   CENNIKI (Pricing Plans)
   ============================ */

export interface PricingPlanDTO {
  id: string;
  club_id: string;
  name: string;
  description?: string | null;
  price: number;
  number_of_entries: number;
  duration_in_days: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Komenda do tworzenia planu cenowego – pola niezbędne do stworzenia rekordu
export type CreatePricingPlanCommand = Pick<
  PricingPlanDTO,
  "club_id" | "name" | "description" | "price" | "number_of_entries" | "duration_in_days" | "status"
>;

// Komenda do aktualizacji planu cenowego – wszystkie pola poza identyfikatorami i metadanymi aktualizowane częściowo
export type UpdatePricingPlanCommand = Partial<
  Omit<PricingPlanDTO, "id" | "club_id" | "created_at" | "updated_at" | "deleted_at">
>;

/* ============================
   ZAJĘCIA (Classes)
   ============================ */

export interface ClassDTO {
  id: string;
  club_id: string;
  name: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number | null;
  max_seats: number;
  created_at: string;
  updated_at: string;
}

// Komenda do tworzenia zajęć – pola wymagane przy utworzeniu zajęć
export type CreateClassCommand = Pick<
  ClassDTO,
  "club_id" | "name" | "description" | "scheduled_at" | "duration_minutes" | "max_seats"
>;

// Komenda do aktualizacji zajęć – aktualizujemy częściowo pola niezbędne
export type UpdateClassCommand = Partial<Omit<ClassDTO, "id" | "club_id" | "created_at" | "updated_at">>;

/* ============================
   REJESTRACJE NA ZAJĘCIA (Class Registrations)
   ============================ */

export interface RegistrationDTO {
  id: string;
  class_id: string;
  user_id: string;
  registration_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Komenda do rejestracji – pola wymagane do stworzenia rekordu rejestracji
export type CreateRegistrationCommand = Pick<RegistrationDTO, "class_id" | "user_id">;

// Komenda do aktualizacji rejestracji – np. zmiana statusu (potwierdzenie, anulowanie)
export type UpdateRegistrationCommand = Partial<Pick<RegistrationDTO, "status">>;

/* ============================
   LOGI ANALITYCZNE (Analytics Logs)
   ============================ */

export interface AnalyticsLogDTO {
  id: string;
  club_id: string;
  event_type: string;
  event_data: Json;
  user_id?: string | null;
  created_at: string;
}

// Komenda do tworzenia logu analitycznego – zbieramy niezbędne dane zdarzenia
export type CreateAnalyticsCommand = Pick<AnalyticsLogDTO, "club_id" | "event_type" | "event_data" | "user_id">;
