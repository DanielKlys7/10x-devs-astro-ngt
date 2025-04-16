export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      analytics_logs: {
        Row: {
          club_id: string;
          created_at: string;
          event_data: Json | null;
          event_type: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          event_data?: Json | null;
          event_type: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          event_data?: Json | null;
          event_type?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "sport_clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      class_registrations: {
        Row: {
          class_id: string;
          created_at: string;
          id: string;
          registration_date: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          class_id: string;
          created_at?: string;
          id?: string;
          registration_date?: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          class_id?: string;
          created_at?: string;
          id?: string;
          registration_date?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "class_registrations_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: {
          club_id: string;
          created_at: string;
          description: string | null;
          duration_minutes: number | null;
          id: string;
          max_seats: number;
          name: string;
          scheduled_at: string;
          trainer_id: string | null;
          updated_at: string;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          max_seats: number;
          name: string;
          scheduled_at: string;
          trainer_id?: string | null;
          updated_at?: string;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          max_seats?: number;
          name?: string;
          scheduled_at?: string;
          trainer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classes_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "sport_clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_invitations: {
        Row: {
          accepted_at: string | null;
          club_id: string;
          created_at: string;
          created_by: string;
          email: string;
          expires_at: string;
          id: string;
          target_role: string;
          token: string;
        };
        Insert: {
          accepted_at?: string | null;
          club_id: string;
          created_at?: string;
          created_by: string;
          email: string;
          expires_at?: string;
          id?: string;
          target_role: string;
          token?: string;
        };
        Update: {
          accepted_at?: string | null;
          club_id?: string;
          created_at?: string;
          created_by?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          target_role?: string;
          token?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_invitations_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "sport_clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      memberships: {
        Row: {
          active_plan_expires_at: string | null;
          active_plan_pricing_plan_id: string | null;
          active_plan_start_date: string | null;
          auto_renew: boolean;
          club_id: string;
          created_at: string;
          id: string;
          managed_by: string;
          membership_role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active_plan_expires_at?: string | null;
          active_plan_pricing_plan_id?: string | null;
          active_plan_start_date?: string | null;
          auto_renew?: boolean;
          club_id: string;
          created_at?: string;
          id?: string;
          managed_by: string;
          membership_role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active_plan_expires_at?: string | null;
          active_plan_pricing_plan_id?: string | null;
          active_plan_start_date?: string | null;
          auto_renew?: boolean;
          club_id?: string;
          created_at?: string;
          id?: string;
          managed_by?: string;
          membership_role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_active_plan_pricing_plan";
            columns: ["active_plan_pricing_plan_id"];
            isOneToOne: false;
            referencedRelation: "pricing_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "sport_clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      pricing_plans: {
        Row: {
          club_id: string;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          duration_in_days: number;
          id: string;
          name: string;
          number_of_entries: number;
          price: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          duration_in_days: number;
          id?: string;
          name: string;
          number_of_entries: number;
          price: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          duration_in_days?: number;
          id?: string;
          name?: string;
          number_of_entries?: number;
          price?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pricing_plans_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "sport_clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      sport_clubs: {
        Row: {
          address: string | null;
          contact_email: string;
          contact_phone: string | null;
          created_at: string;
          deleted_at: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          contact_email: string;
          contact_phone?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          contact_email?: string;
          contact_phone?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      accept_club_invitation: {
        Args: { invitation_token: string };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
