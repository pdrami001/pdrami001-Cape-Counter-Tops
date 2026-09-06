import type { ProductCategory } from "@/lib/constants";

export type Database = {
  public: {
    Tables: {
      products: {
        Relationships: [];
        Row: {
          id: string;
          name: string;
          slug: string;
          category: ProductCategory;
          description: string;
          image_url: string | null;
          colour: string | null;
          finish: string | null;
          in_stock: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: ProductCategory;
          description: string;
          image_url?: string | null;
          colour?: string | null;
          finish?: string | null;
          in_stock?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      admin_users: {
        Relationships: [];
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
