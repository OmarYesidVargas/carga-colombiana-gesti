export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          additional_info: Json | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          operation: Database["public"]["Enums"]["audit_operation"]
          record_id: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          additional_info?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation: Database["public"]["Enums"]["audit_operation"]
          record_id?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          additional_info?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation?: Database["public"]["Enums"]["audit_operation"]
          record_id?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          date: string
          description: string | null
          id: string
          receipt_url: string | null
          trip_id: string
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          trip_id: string
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          trip_id?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_expenses_trip_id"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_expenses_vehicle_id"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          city: string | null
          created_at: string
          department: string | null
          document_number: string | null
          document_type: string | null
          email: string
          gender: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          department?: string | null
          document_number?: string | null
          document_type?: string | null
          email: string
          gender?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          department?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string
          gender?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      toll_records: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          payment_method: string
          price: number
          receipt: string | null
          toll_id: string
          trip_id: string
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          payment_method: string
          price: number
          receipt?: string | null
          toll_id: string
          trip_id: string
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          payment_method?: string
          price?: number
          receipt?: string | null
          toll_id?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_toll_records_toll_id"
            columns: ["toll_id"]
            isOneToOne: false
            referencedRelation: "tolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_toll_records_trip_id"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_toll_records_vehicle_id"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_records_toll_id_fkey"
            columns: ["toll_id"]
            isOneToOne: false
            referencedRelation: "tolls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_records_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tolls: {
        Row: {
          category: string
          coordinates: string | null
          created_at: string
          description: string | null
          id: string
          location: string
          name: string
          price: number
          route: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          coordinates?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location: string
          name: string
          price: number
          route: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          coordinates?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          name?: string
          price?: number
          route?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string
          destination: string
          distance: number
          end_date: string
          id: string
          notes: string | null
          origin: string
          start_date: string
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          destination: string
          distance: number
          end_date: string
          id?: string
          notes?: string | null
          origin: string
          start_date: string
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          destination?: string
          distance?: number
          end_date?: string
          id?: string
          notes?: string | null
          origin?: string
          start_date?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_trips_vehicle_id"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_notifications: {
        Row: {
          created_at: string
          document_type: string
          expiry_date: string
          id: string
          is_sent: boolean | null
          notification_date: string
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          expiry_date: string
          id?: string
          is_sent?: boolean | null
          notification_date: string
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          expiry_date?: string
          id?: string
          is_sent?: boolean | null
          notification_date?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          capacity: string | null
          color: string | null
          created_at: string
          fuel_type: string | null
          id: string
          image_url: string | null
          model: string
          plate: string
          soat_document_url: string | null
          soat_expiry_date: string | null
          soat_insurance_company: string | null
          techno_center: string | null
          techno_document_url: string | null
          techno_expiry_date: string | null
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          brand: string
          capacity?: string | null
          color?: string | null
          created_at?: string
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          model: string
          plate: string
          soat_document_url?: string | null
          soat_expiry_date?: string | null
          soat_insurance_company?: string | null
          techno_center?: string | null
          techno_document_url?: string | null
          techno_expiry_date?: string | null
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          brand?: string
          capacity?: string | null
          color?: string | null
          created_at?: string
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          model?: string
          plate?: string
          soat_document_url?: string | null
          soat_expiry_date?: string | null
          soat_insurance_company?: string | null
          techno_center?: string | null
          techno_document_url?: string | null
          techno_expiry_date?: string | null
          updated_at?: string
          user_id?: string
          year?: number
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
      audit_operation: "CREATE" | "READ" | "UPDATE" | "DELETE"
      expense_category:
        | "fuel"
        | "toll"
        | "maintenance"
        | "lodging"
        | "food"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      audit_operation: ["CREATE", "READ", "UPDATE", "DELETE"],
      expense_category: [
        "fuel",
        "toll",
        "maintenance",
        "lodging",
        "food",
        "other",
      ],
    },
  },
} as const
