export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      t_clothes: {
        Row: {
          category: string | null;
          created_at: string;
          gender_flag: number | null;
          id: number;
          image_url: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          gender_flag?: number | null;
          id?: number;
          image_url?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          gender_flag?: number | null;
          id?: number;
          image_url?: string | null;
        };
        Relationships: [];
      };
      t_user: {
        Row: {
          avatar_url: string | null;
          body_url: string | null;
          created_at: string;
          gender: string | null;
          id: string;
          name: string;
        };
        Insert: {
          avatar_url?: string | null;
          body_url?: string | null;
          created_at?: string;
          gender?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          avatar_url?: string | null;
          body_url?: string | null;
          created_at?: string;
          gender?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      t_user_vton: {
        Row: {
          created_at: string;
          feedback_flag: number | null;
          id: number;
          user_id: string | null;
          vton_id: number | null;
        };
        Insert: {
          created_at?: string;
          feedback_flag?: number | null;
          id?: number;
          user_id?: string | null;
          vton_id?: number | null;
        };
        Update: {
          created_at?: string;
          feedback_flag?: number | null;
          id?: number;
          user_id?: string | null;
          vton_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "t_user_vton_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "t_user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "t_user_vton_vton_id_fkey";
            columns: ["vton_id"];
            isOneToOne: false;
            referencedRelation: "t_vton";
            referencedColumns: ["id"];
          },
        ];
      };
      t_vton: {
        Row: {
          created_at: string;
          id: number;
          image_url: string;
          tops_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          image_url: string;
          tops_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          image_url?: string;
          tops_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "t_vton_tops_id_fkey";
            columns: ["tops_id"];
            isOneToOne: false;
            referencedRelation: "t_clothes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
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
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
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
  public: {
    Enums: {},
  },
} as const;
