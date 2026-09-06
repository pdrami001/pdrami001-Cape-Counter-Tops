import type { ProductCategory } from "@/lib/constants";

export type Product = {
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

export type ProductInput = Omit<
  Product,
  "id" | "slug" | "created_at" | "updated_at" | "image_url"
> & { image_url?: string | null };
