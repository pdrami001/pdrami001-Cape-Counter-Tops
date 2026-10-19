import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";

const siteUrl = "https://www.capecountertops.co.za";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const projects = await getProjects();
  const projectPages = projects
    .filter((project) => project.slug.trim().length > 0)
    .map((project) => ({
      url: `${siteUrl}/projects/${encodeURIComponent(project.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...new Map([...pages, ...projectPages].map((page) => [page.url, page])).values()];
}
