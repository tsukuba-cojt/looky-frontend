export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      t_body: {
        Row: {
          created_at: string;
          id: number;
          object_key: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          object_key?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          object_key?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "t_body_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "t_user";
            referencedColumns: ["id"];
          },
        ];
      };
      t_clothes: {
        Row: {
          category: string | null;
          color: string | null;
          created_at: string;
          gender: Database["public"]["Enums"]["gender"] | null;
          id: number;
          invalid: boolean | null;
          name: string | null;
          object_key: string | null;
          part: Database["public"]["Enums"]["part"] | null;
          subcategory: string | null;
        };
        Insert: {
          category?: string | null;
          color?: string | null;
          created_at?: string;
          gender?: Database["public"]["Enums"]["gender"] | null;
          id?: number;
          invalid?: boolean | null;
          name?: string | null;
          object_key?: string | null;
          part?: Database["public"]["Enums"]["part"] | null;
          subcategory?: string | null;
        };
        Update: {
          category?: string | null;
          color?: string | null;
          created_at?: string;
          gender?: Database["public"]["Enums"]["gender"] | null;
          id?: number;
          invalid?: boolean | null;
          name?: string | null;
          object_key?: string | null;
          part?: Database["public"]["Enums"]["part"] | null;
          subcategory?: string | null;
        };
        Relationships: [];
      };
      t_task: {
        Row: {
          created_at: string;
          id: number;
          status: Database["public"]["Enums"]["status"] | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "t_task_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "t_user";
            referencedColumns: ["id"];
          },
        ];
      };
      t_user: {
        Row: {
          avatar_url: string | null;
          body_url: string | null;
          created_at: string;
          gender: string | null;
          height: number | null;
          id: string;
          name: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          body_url?: string | null;
          created_at?: string;
          gender?: string | null;
          height?: number | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          body_url?: string | null;
          created_at?: string;
          gender?: string | null;
          height?: number | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      t_user_vton: {
        Row: {
          created_at: string;
          feedback: Database["public"]["Enums"]["feedback"] | null;
          id: number;
          user_id: string | null;
          vton_id: number | null;
        };
        Insert: {
          created_at?: string;
          feedback?: Database["public"]["Enums"]["feedback"] | null;
          id?: number;
          user_id?: string | null;
          vton_id?: number | null;
        };
        Update: {
          created_at?: string;
          feedback?: Database["public"]["Enums"]["feedback"] | null;
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
          object_key: string;
          tops_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          object_key: string;
          tops_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          object_key?: string;
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
      feedback: "love" | "like" | "hate" | "nope";
      gender: "man" | "woman" | "unisex";
      part: "Upper-body" | "Lower-body" | "Dressed";
      status: "success" | "error" | "pending";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      feedback: ["love", "like", "hate", "nope"],
      gender: ["man", "woman", "unisex"],
      part: ["Upper-body", "Lower-body", "Dressed"],
      status: ["success", "error", "pending"],
    },
  },
} as const;
