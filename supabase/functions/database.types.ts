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
          id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
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
          category: Database["public"]["Enums"]["category"] | null;
          color: Database["public"]["Enums"]["color"] | null;
          created_at: string;
          description: string | null;
          gender: Database["public"]["Enums"]["gender"] | null;
          id: string;
          invalid: boolean | null;
          part: Database["public"]["Enums"]["part"] | null;
          subcategory: Database["public"]["Enums"]["subcategory"] | null;
          title: string | null;
        };
        Insert: {
          category?: Database["public"]["Enums"]["category"] | null;
          color?: Database["public"]["Enums"]["color"] | null;
          created_at?: string;
          description?: string | null;
          gender?: Database["public"]["Enums"]["gender"] | null;
          id: string;
          invalid?: boolean | null;
          part?: Database["public"]["Enums"]["part"] | null;
          subcategory?: Database["public"]["Enums"]["subcategory"] | null;
          title?: string | null;
        };
        Update: {
          category?: Database["public"]["Enums"]["category"] | null;
          color?: Database["public"]["Enums"]["color"] | null;
          created_at?: string;
          description?: string | null;
          gender?: Database["public"]["Enums"]["gender"] | null;
          id?: string;
          invalid?: boolean | null;
          part?: Database["public"]["Enums"]["part"] | null;
          subcategory?: Database["public"]["Enums"]["subcategory"] | null;
          title?: string | null;
        };
        Relationships: [];
      };
      t_like: {
        Row: {
          clothes_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          clothes_id: string;
          created_at?: string;
          id: string;
          user_id: string;
        };
        Update: {
          clothes_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "t_like_clothes_id_fkey";
            columns: ["clothes_id"];
            isOneToOne: false;
            referencedRelation: "t_clothes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "t_like_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "t_user";
            referencedColumns: ["id"];
          },
        ];
      };
      t_task: {
        Row: {
          created_at: string;
          id: string;
          part: Database["public"]["Enums"]["part"];
          status: Database["public"]["Enums"]["status"] | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          part?: Database["public"]["Enums"]["part"];
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          part?: Database["public"]["Enums"]["part"];
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
          body_id: string | null;
          created_at: string;
          gender: string | null;
          height: number | null;
          id: string;
          name: string | null;
        };
        Insert: {
          body_id?: string | null;
          created_at?: string;
          gender?: string | null;
          height?: number | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          body_id?: string | null;
          created_at?: string;
          gender?: string | null;
          height?: number | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "t_user_body_id_fkey";
            columns: ["body_id"];
            isOneToOne: false;
            referencedRelation: "t_body";
            referencedColumns: ["id"];
          },
        ];
      };
      t_user_vton: {
        Row: {
          created_at: string;
          feedback: Database["public"]["Enums"]["feedback"] | null;
          id: string;
          user_id: string | null;
          vton_id: string;
        };
        Insert: {
          created_at?: string;
          feedback?: Database["public"]["Enums"]["feedback"] | null;
          id: string;
          user_id?: string | null;
          vton_id: string;
        };
        Update: {
          created_at?: string;
          feedback?: Database["public"]["Enums"]["feedback"] | null;
          id?: string;
          user_id?: string | null;
          vton_id?: string;
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
          bottoms_id: string | null;
          created_at: string;
          dresses_id: string | null;
          id: string;
          tops_id: string | null;
        };
        Insert: {
          bottoms_id?: string | null;
          created_at?: string;
          dresses_id?: string | null;
          id: string;
          tops_id?: string | null;
        };
        Update: {
          bottoms_id?: string | null;
          created_at?: string;
          dresses_id?: string | null;
          id?: string;
          tops_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "t_vton_bottoms_id_fkey";
            columns: ["bottoms_id"];
            isOneToOne: false;
            referencedRelation: "t_clothes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "t_vton_dresses_id_fkey";
            columns: ["dresses_id"];
            isOneToOne: false;
            referencedRelation: "t_clothes";
            referencedColumns: ["id"];
          },
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
      get_distinct_pending_tasks: {
        Args: Record<PropertyKey, never>;
        Returns: {
          created_at: string;
          id: string;
          part: Database["public"]["Enums"]["part"];
          status: Database["public"]["Enums"]["status"] | null;
          updated_at: string;
          user_id: string;
        }[];
      };
    };
    Enums: {
      category: "tops" | "bottoms" | "dresses";
      color:
        | "red"
        | "pink"
        | "purple"
        | "indigo"
        | "blue"
        | "cyan"
        | "teal"
        | "green"
        | "lime"
        | "yellow"
        | "amber"
        | "orange"
        | "brown"
        | "gray"
        | "black"
        | "white";
      feedback: "love" | "like" | "hate" | "nope";
      gender: "man" | "woman" | "unisex";
      part: "Upper-body" | "Lower-body" | "Dressed";
      status: "success" | "error" | "pending";
      subcategory:
        | "t_shirts"
        | "blouses"
        | "tank_tops"
        | "polos"
        | "tunics"
        | "hoodies"
        | "jeans"
        | "pants"
        | "shorts"
        | "leggings"
        | "skirts"
        | "capris"
        | "casual"
        | "evening"
        | "cocktail"
        | "summer"
        | "maxi"
        | "shirt";
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
      category: ["tops", "bottoms", "dresses"],
      color: [
        "red",
        "pink",
        "purple",
        "indigo",
        "blue",
        "cyan",
        "teal",
        "green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "brown",
        "gray",
        "black",
        "white",
      ],
      feedback: ["love", "like", "hate", "nope"],
      gender: ["man", "woman", "unisex"],
      part: ["Upper-body", "Lower-body", "Dressed"],
      status: ["success", "error", "pending"],
      subcategory: [
        "t_shirts",
        "blouses",
        "tank_tops",
        "polos",
        "tunics",
        "hoodies",
        "jeans",
        "pants",
        "shorts",
        "leggings",
        "skirts",
        "capris",
        "casual",
        "evening",
        "cocktail",
        "summer",
        "maxi",
        "shirt",
      ],
    },
  },
} as const;
