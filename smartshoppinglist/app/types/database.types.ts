export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shopping_items: {
        Row: {
          id: string
          user_id: string
          shopping_list_id: string | null
          name: string
          category: string
          is_in_cart: boolean
          is_purchased: boolean
          added_at: string
          purchased_at: string | null
          expiry_date: string | null
          purchase_location: string | null
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          shopping_list_id?: string | null
          name: string
          category: string
          is_in_cart?: boolean
          is_purchased?: boolean
          added_at?: string
          purchased_at?: string | null
          expiry_date?: string | null
          purchase_location?: string | null
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          shopping_list_id?: string | null
          name?: string
          category?: string
          is_in_cart?: boolean
          is_purchased?: boolean
          added_at?: string
          purchased_at?: string | null
          expiry_date?: string | null
          purchase_location?: string | null
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          name_hebrew: string
          emoji: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_hebrew: string
          emoji?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_hebrew?: string
          emoji?: string | null
          created_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
