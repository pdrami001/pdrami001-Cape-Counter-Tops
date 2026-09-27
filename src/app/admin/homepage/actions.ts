"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminClient } from "@/lib/admin";
import { homepageBucket, homepageSchema, homepageSlots } from "@/lib/homepage-content";

export async function saveHomepage(input: unknown) {
  try {
    const client = await getAdminClient();
    if (!client) return { error: "Your session has expired or you are not authorised. Sign in as an administrator." };
    const parsed = z.object({ content: homepageSchema, revision: z.number().int().nonnegative() }).strict().safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the content." };
    // Only publish references to completed uploads. Never accept arbitrary external URLs.
    const paths = new Set(homepageSlots.map((slot) => slot === "hero" ? parsed.data.content.hero.image.path : parsed.data.content.materials[slot].image.path).filter((path): path is string => !!path));
    for (const path of paths) {
      const { data, error } = await client.storage.from(homepageBucket).list("homepage", { search: path.slice("homepage/".length), limit: 2 });
      if (error || !data?.some((object) => `homepage/${object.name}` === path)) return { error: "An image upload is missing. Upload it again before saving." };
    }
    const { data, error } = await client.from("homepage_content")
      .update({ content: parsed.data.content }).eq("id", 1).eq("revision", parsed.data.revision)
      .select("content, revision").maybeSingle();
    if (error) return { error: "Unable to save. Check your connection and that the homepage migration has been applied. Your edits are still here." };
    if (!data) return { error: "The published homepage changed since you opened it. Reload the page to review the latest version before saving." };
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return { content: data.content, revision: data.revision };
  } catch {
    return { error: "Unable to confirm the save. Your edits are still here. Check your connection and retry." };
  }
}
