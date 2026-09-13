import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project, ProjectImage } from "@/types/project";

function sortImages(images: ProjectImage[] = []) {
  return [...images].sort((a, b) => Number(a.display_order) - Number(b.display_order));
}

function normalizeProject(project: Project): Project {
  const images = sortImages(project.project_images ?? []);
  return {
    ...project,
    project_images: images,
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .order("featured", { ascending: false })
    .order("completed_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load projects", error.message);
    return [];
  }

  return (data ?? []).map((project) => normalizeProject(project as Project));
});

export const getFeaturedProjects = cache(async (limit = 6): Promise<Project[]> => {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.featured);
  const fallback = projects.filter((project) => !project.featured);
  const ordered = [...featured, ...fallback].slice(0, limit);
  return ordered;
});

export async function getProjectBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Unable to load project", error.message);
    return null;
  }

  if (!data) return null;

  return normalizeProject(data as Project);
}

export async function getProjectCount() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;

  const { count, error } = await supabase.from("projects").select("*", { count: "exact", head: true });
  if (error) {
    console.error("Unable to count projects", error.message);
    return 0;
  }
  return count ?? 0;
}
