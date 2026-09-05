export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean | null
          key_name: string
          key_value: string
          last_used: string | null
          priority: number | null
          provider: Database["public"]["Enums"]["api_provider"]
          remaining_limit: number | null
          status: Database["public"]["Enums"]["api_key_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          key_name: string
          key_value: string
          last_used?: string | null
          priority?: number | null
          provider: Database["public"]["Enums"]["api_provider"]
          remaining_limit?: number | null
          status?: Database["public"]["Enums"]["api_key_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          key_name?: string
          key_value?: string
          last_used?: string | null
          priority?: number | null
          provider?: Database["public"]["Enums"]["api_provider"]
          remaining_limit?: number | null
          status?: Database["public"]["Enums"]["api_key_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      characteristics: {
        Row: {
          attribute_name: string
          attribute_value: string
          created_at: string
          id: string
          type: Database["public"]["Enums"]["characteristic_type"]
          user_id: string
        }
        Insert: {
          attribute_name: string
          attribute_value: string
          created_at?: string
          id?: string
          type: Database["public"]["Enums"]["characteristic_type"]
          user_id: string
        }
        Update: {
          attribute_name?: string
          attribute_value?: string
          created_at?: string
          id?: string
          type?: Database["public"]["Enums"]["characteristic_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "characteristics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          additional_attributes: Json | null
          age: string | null
          clothing: string | null
          created_at: string
          face_features: string | null
          gender: string | null
          id: string
          mood: string | null
          name: string
          style: string | null
          user_id: string
        }
        Insert: {
          additional_attributes?: Json | null
          age?: string | null
          clothing?: string | null
          created_at?: string
          face_features?: string | null
          gender?: string | null
          id?: string
          mood?: string | null
          name: string
          style?: string | null
          user_id: string
        }
        Update: {
          additional_attributes?: Json | null
          age?: string | null
          clothing?: string | null
          created_at?: string
          face_features?: string | null
          gender?: string | null
          id?: string
          mood?: string | null
          name?: string
          style?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_presets: {
        Row: {
          attributes: Json | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          attributes?: Json | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          attributes?: Json | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      photo_studio_settings: {
        Row: {
          attributes: Json | null
          created_at: string
          id: string
          is_default: boolean | null
          set_name: string
          user_id: string
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          set_name: string
          user_id: string
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          set_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_studio_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prewedding_presets: {
        Row: {
          attributes: Json | null
          created_at: string
          description: string | null
          id: string
          location_id: string | null
          name: string
          props: Json | null
          style_id: string | null
          user_id: string
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          location_id?: string | null
          name: string
          props?: Json | null
          style_id?: string | null
          user_id: string
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          location_id?: string | null
          name?: string
          props?: Json | null
          style_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prewedding_presets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prewedding_presets_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "style_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prewedding_presets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompt_history: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean | null
          json_content: Json | null
          text_content: string | null
          title: string
          type: Database["public"]["Enums"]["prompt_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          json_content?: Json | null
          text_content?: string | null
          title: string
          type?: Database["public"]["Enums"]["prompt_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          json_content?: Json | null
          text_content?: string | null
          title?: string
          type?: Database["public"]["Enums"]["prompt_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category"]
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          json_content: Json | null
          name: string
          preview_image_url: string | null
          text_content: string | null
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["template_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          json_content?: Json | null
          name: string
          preview_image_url?: string | null
          text_content?: string | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["template_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          json_content?: Json | null
          name?: string
          preview_image_url?: string | null
          text_content?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      props_presets: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      style_presets: {
        Row: {
          attributes: Json | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          attributes?: Json | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          attributes?: Json | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      api_key_status: "active" | "inactive" | "limit" | "error"
      api_provider: "groq" | "gemini"
      characteristic_type: "foto" | "video"
      prompt_type: "gambar" | "video"
      template_category:
        | "cinematic"
        | "anime"
        | "advertisement"
        | "horror"
        | "documentary"
        | "fantasy"
        | "scifi"
        | "prewedding"
        | "portrait"
        | "landscape"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      api_key_status: ["active", "inactive", "limit", "error"],
      api_provider: ["groq", "gemini"],
      characteristic_type: ["foto", "video"],
      prompt_type: ["gambar", "video"],
      template_category: [
        "cinematic",
        "anime",
        "advertisement",
        "horror",
        "documentary",
        "fantasy",
        "scifi",
        "prewedding",
        "portrait",
        "landscape",
      ],
    },
  },
} as const
