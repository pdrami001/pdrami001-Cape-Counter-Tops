import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { defaultHomepage, homepageSchema, type HomepageSnapshot } from "@/lib/homepage-content";

export const getHomepage = cache(async (): Promise<HomepageSnapshot> => {
  const fallback = { content: defaultHomepage, revision: 0, available: false };
  try {
    const client = await createSupabaseServerClient();
    if (!client) return { ...fallback, error: "Supabase is not configured." };
    const { data, error } = await client.from("homepage_content").select("content, revision").eq("id", 1).maybeSingle();
    if (error || !data) return { ...fallback, error: "Homepage content is unavailable. Check the connection and apply the homepage migration before editing." };
    const parsed = homepageSchema.safeParse(data.content);
    if (!parsed.success) return { ...fallback, error: "Published homepage content is invalid. Ask a developer to check the content row." };
    return { content: parsed.data, revision: data.revision, available: true };
  } catch {
    return { ...fallback, error: "Unable to load homepage content. Please try again." };
  }
});
