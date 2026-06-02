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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          body_en: string | null
          body_ro: string | null
          created_at: string
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          title_en: string
          title_ro: string
          updated_at: string
        }
        Insert: {
          body_en?: string | null
          body_ro?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title_en: string
          title_ro: string
          updated_at?: string
        }
        Update: {
          body_en?: string | null
          body_ro?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title_en?: string
          title_ro?: string
          updated_at?: string
        }
        Relationships: []
      }
      exhibition_gallery_images: {
        Row: {
          caption_en: string
          caption_ro: string
          created_at: string
          exhibition_id: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          caption_en?: string
          caption_ro?: string
          created_at?: string
          exhibition_id: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          caption_en?: string
          caption_ro?: string
          created_at?: string
          exhibition_id?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_gallery_images_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibition_press_links: {
        Row: {
          created_at: string
          exhibition_id: string
          id: string
          sort_order: number
          title_en: string
          title_ro: string
          url: string
        }
        Insert: {
          created_at?: string
          exhibition_id: string
          id?: string
          sort_order?: number
          title_en: string
          title_ro: string
          url: string
        }
        Update: {
          created_at?: string
          exhibition_id?: string
          id?: string
          sort_order?: number
          title_en?: string
          title_ro?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_press_links_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibition_projects: {
        Row: {
          exhibition_id: string
          project_id: string
          sort_order: number
        }
        Insert: {
          exhibition_id: string
          project_id: string
          sort_order?: number
        }
        Update: {
          exhibition_id?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_projects_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exhibition_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibition_venues: {
        Row: {
          created_at: string
          exhibition_id: string
          external_url: string
          id: string
          image_url: string
          sort_order: number
          title_en: string
          title_ro: string
        }
        Insert: {
          created_at?: string
          exhibition_id: string
          external_url?: string
          id?: string
          image_url?: string
          sort_order?: number
          title_en: string
          title_ro: string
        }
        Update: {
          created_at?: string
          exhibition_id?: string
          external_url?: string
          id?: string
          image_url?: string
          sort_order?: number
          title_en?: string
          title_ro?: string
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_venues_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibitions: {
        Row: {
          artist_name: string
          book_pdf_url: string
          created_at: string
          curator_bio_en: string
          curator_bio_ro: string
          curator_name_en: string
          curator_name_ro: string
          end_date: string | null
          id: string
          overview_en: string
          overview_ro: string
          poster_url: string
          published: boolean
          slug: string
          sort_order: number
          start_date: string | null
          subtitle_en: string
          subtitle_ro: string
          title_en: string
          title_ro: string
          updated_at: string
          venue_en: string
          venue_ro: string
        }
        Insert: {
          artist_name?: string
          book_pdf_url?: string
          created_at?: string
          curator_bio_en?: string
          curator_bio_ro?: string
          curator_name_en?: string
          curator_name_ro?: string
          end_date?: string | null
          id?: string
          overview_en?: string
          overview_ro?: string
          poster_url?: string
          published?: boolean
          slug: string
          sort_order?: number
          start_date?: string | null
          subtitle_en?: string
          subtitle_ro?: string
          title_en: string
          title_ro: string
          updated_at?: string
          venue_en?: string
          venue_ro?: string
        }
        Update: {
          artist_name?: string
          book_pdf_url?: string
          created_at?: string
          curator_bio_en?: string
          curator_bio_ro?: string
          curator_name_en?: string
          curator_name_ro?: string
          end_date?: string | null
          id?: string
          overview_en?: string
          overview_ro?: string
          poster_url?: string
          published?: boolean
          slug?: string
          sort_order?: number
          start_date?: string | null
          subtitle_en?: string
          subtitle_ro?: string
          title_en?: string
          title_ro?: string
          updated_at?: string
          venue_en?: string
          venue_ro?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description_en: string | null
          description_ro: string | null
          id: string
          image_url: string | null
          museum: string | null
          sort_order: number
          title_en: string
          title_ro: string
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_ro?: string | null
          id?: string
          image_url?: string | null
          museum?: string | null
          sort_order?: number
          title_en: string
          title_ro: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_ro?: string | null
          id?: string
          image_url?: string | null
          museum?: string | null
          sort_order?: number
          title_en?: string
          title_ro?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          available: boolean
          created_at: string
          currency: string
          description_en: string | null
          description_ro: string | null
          id: string
          image_url: string | null
          price: number
          purchase_url: string | null
          title_en: string
          title_ro: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          currency?: string
          description_en?: string | null
          description_ro?: string | null
          id?: string
          image_url?: string | null
          price?: number
          purchase_url?: string | null
          title_en: string
          title_ro: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          created_at?: string
          currency?: string
          description_en?: string | null
          description_ro?: string | null
          id?: string
          image_url?: string | null
          price?: number
          purchase_url?: string | null
          title_en?: string
          title_ro?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
