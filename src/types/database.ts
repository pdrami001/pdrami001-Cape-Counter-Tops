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
      projects: {
        Relationships: [{ foreignKeyName: "project_images_project_id_fkey"; columns: ["id"]; referencedRelation: "projects"; referencedColumns: ["id"] }];
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          project_type: string;
          material: string | null;
          colour: string | null;
          finish: string | null;
          location: string | null;
          featured: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          project_type: string;
          material?: string | null;
          colour?: string | null;
          finish?: string | null;
          location?: string | null;
          featured?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      project_images: {
        Relationships: [{ foreignKeyName: "project_images_project_id_fkey"; columns: ["project_id"]; referencedRelation: "projects"; referencedColumns: ["id"] }];
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          storage_path: string | null;
          alt_text: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          storage_path?: string | null;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_images"]["Insert"]>;
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
