import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("featured", { ascending: false })
    .order("in_stock", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load products", error.message);
    return [];
  }

  return data;
});

export async function getProductBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function isAdminUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  return Boolean(admin);
}
