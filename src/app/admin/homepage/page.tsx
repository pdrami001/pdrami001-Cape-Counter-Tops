import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminUser, getProducts } from "@/lib/products";
import { getFeaturedProjects } from "@/lib/projects";
import { getHomepage } from "@/lib/homepage";
import { getHomepageFallbacks } from "@/lib/homepage-content";
import { HomepageEditor } from "@/components/admin/homepage-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Homepage Editor", robots: { index: false, follow: false } };

export default async function HomepageEditorPage() {
  if (!(await isAdminUser())) redirect("/admin/login");
  const [initial, products, projects] = await Promise.all([getHomepage(), getProducts(), getFeaturedProjects(1)]);
  return <HomepageEditor initial={initial} fallbacks={getHomepageFallbacks(products, projects[0])} />;
}
