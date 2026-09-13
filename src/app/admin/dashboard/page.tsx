import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getProjects } from "@/lib/projects";
import { getProducts, isAdminUser } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAdminUser())) redirect("/admin/login");
  const products = await getProducts();
  const projects = await getProjects();
  return <AdminDashboard initialProducts={products} initialProjects={projects} />;
}
