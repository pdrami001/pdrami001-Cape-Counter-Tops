import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminClient() {
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  const { data: admin, error: adminError } = await client.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  return admin && !adminError ? client : null;
}
