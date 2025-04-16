import type { Database } from "./db/database.types";

// Typy bazowe z bazy danych Supabase
type DbTables = Database["public"]["Tables"];
export type SportClub = DbTables["sport_clubs"]["Row"];
export type Membership = DbTables["memberships"]["Row"];
export type PricingPlan = DbTables["pricing_plans"]["Row"];
export type Class = DbTables["classes"]["Row"];
export type ClassRegistration = DbTables["class_registrations"]["Row"];
export type AnalyticsLog = DbTables["analytics_logs"]["Row"];
export type ClubInvitation = DbTables["club_invitations"]["Row"];

// Typy pomocnicze
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Wspólne typy i interfejsy
 */
export interface PaginationRequest {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
}

export interface ApiSuccessResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

/**
 * Authentication & Registration DTOs
 */
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id: string;
  email: string;
  role: string;
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
  inviteToken: string;
}

export interface RegisterResponseDTO {
  user: UserDTO;
}

/**
 * Sport Clubs DTOs
 */
export interface CreateClubRequestDTO {
  name: string;
  address?: string;
  contact_email: string;
  contact_phone?: string;
}

export type CreateClubResponseDTO = SportClub;

export interface GetClubsRequestDTO extends PaginationRequest {
  search?: string;
}

export interface GetClubsResponseDTO {
  clubs: SportClub[];
  pagination: PaginationResponse;
}

export type GetClubResponseDTO = SportClub;

export interface UpdateClubRequestDTO {
  name?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
}

export type UpdateClubResponseDTO = SportClub;

/**
 * Memberships DTOs
 */
export interface AddMemberRequestDTO {
  user_id: string;
  membership_role: string;
  managed_by: string;
}

export type AddMemberResponseDTO = Membership;

export interface GetMembersRequestDTO extends PaginationRequest {
  role?: string;
}

export interface GetMembersResponseDTO {
  members: Membership[];
  pagination: PaginationResponse;
}

export interface UpdateMembershipRequestDTO {
  membership_role?: string;
  active_plan_pricing_plan_id?: string | null;
  active_plan_start_date?: string | null;
  active_plan_expires_at?: string | null;
  auto_renew?: boolean;
}

export type UpdateMembershipResponseDTO = Membership;

/**
 * Pricing Plans DTOs
 */
export interface CreatePricingPlanRequestDTO {
  name: string;
  description?: string;
  price: number;
  number_of_entries: number;
  duration_in_days: number;
  status?: string;
}

export type CreatePricingPlanResponseDTO = PricingPlan;

export type GetPricingPlansRequestDTO = PaginationRequest;

export interface GetPricingPlansResponseDTO {
  pricing_plans: PricingPlan[];
  pagination: PaginationResponse;
}

export type GetPricingPlanResponseDTO = PricingPlan;

export interface UpdatePricingPlanRequestDTO {
  name?: string;
  description?: string;
  price?: number;
  number_of_entries?: number;
  duration_in_days?: number;
  status?: string;
}

export type UpdatePricingPlanResponseDTO = PricingPlan;

/**
 * Classes DTOs
 */
export interface CreateClassRequestDTO {
  name: string;
  description?: string;
  scheduled_at: string;
  duration_minutes?: number;
  max_seats: number;
  trainer_id?: string;
}

export type CreateClassResponseDTO = Class;

export interface GetClassesRequestDTO extends PaginationRequest {
  date?: string;
  date_from?: string;
  date_to?: string;
  trainer_id?: string;
}

export interface GetClassesResponseDTO {
  classes: Class[];
  pagination: PaginationResponse;
}

export type GetClassResponseDTO = Class;

export interface UpdateClassRequestDTO {
  name?: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  max_seats?: number;
  trainer_id?: string | null;
}

export type UpdateClassResponseDTO = Class;

/**
 * Class Registrations DTOs
 */
export interface CreateRegistrationRequestDTO {
  user_id: string;
}

export type CreateRegistrationResponseDTO = ClassRegistration;

export interface GetRegistrationsRequestDTO extends PaginationRequest {
  status?: string;
}

export interface GetRegistrationsResponseDTO {
  registrations: ClassRegistration[];
  pagination: PaginationResponse;
}

export interface UpdateRegistrationRequestDTO {
  status: string;
}

export type UpdateRegistrationResponseDTO = ClassRegistration;

/**
 * Analytics Logs DTOs
 */
export interface CreateAnalyticsLogRequestDTO {
  club_id: string;
  event_type: string;
  event_data?: Json;
  user_id?: string;
}

export type CreateAnalyticsLogResponseDTO = AnalyticsLog;

export interface GetAnalyticsLogsRequestDTO {
  clubId?: string;
  startDate?: string;
  endDate?: string;
  event_type?: string;
}

export interface GetAnalyticsLogsResponseDTO {
  logs: AnalyticsLog[];
}

/**
 * Club Invitations DTOs
 */
export interface CreateInvitationRequestDTO {
  email: string;
  targetRole: string;
}

export type CreateInvitationResponseDTO = ClubInvitation;

export interface GetInvitationsRequestDTO extends PaginationRequest {
  status?: "pending" | "accepted" | "expired";
}

export interface GetInvitationsResponseDTO {
  invitations: ClubInvitation[];
  pagination: PaginationResponse;
}

export interface GetInvitationResponseDTO extends ClubInvitation {
  club_name: string;
}

export interface AcceptInvitationResponseDTO extends ApiSuccessResponse {
  membership_id: string;
  club_id: string;
  role: string;
}

/**
 * Command Models
 */

export interface CreateClubCommand {
  name: string;
  address?: string;
  contact_email: string;
  contact_phone?: string;
}

export interface UpdateClubCommand {
  id: string;
  name?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface AddMemberCommand {
  club_id: string;
  user_id: string;
  membership_role: string;
  managed_by: string;
}

export interface UpdateMembershipCommand {
  id: string;
  membership_role?: string;
  active_plan_pricing_plan_id?: string | null;
  active_plan_start_date?: string | null;
  active_plan_expires_at?: string | null;
  auto_renew?: boolean;
}

export interface CreatePricingPlanCommand {
  club_id: string;
  name: string;
  description?: string;
  price: number;
  number_of_entries: number;
  duration_in_days: number;
  status?: string;
}

export interface UpdatePricingPlanCommand {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  number_of_entries?: number;
  duration_in_days?: number;
  status?: string;
}

export interface CreateClassCommand {
  club_id: string;
  name: string;
  description?: string;
  scheduled_at: string;
  duration_minutes?: number;
  max_seats: number;
  trainer_id?: string;
}

export interface UpdateClassCommand {
  id: string;
  name?: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  max_seats?: number;
  trainer_id?: string | null;
}

export interface CreateRegistrationCommand {
  class_id: string;
  user_id: string;
}

export interface UpdateRegistrationCommand {
  id: string;
  status: string;
}

export interface CreateAnalyticsLogCommand {
  club_id: string;
  event_type: string;
  event_data?: Json;
  user_id?: string;
}

export interface CreateInvitationCommand {
  club_id: string;
  email: string;
  targetRole: string;
}

export interface AcceptInvitationCommand {
  token: string;
}
