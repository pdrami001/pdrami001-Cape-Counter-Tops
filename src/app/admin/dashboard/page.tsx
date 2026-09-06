import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getProducts, isAdminUser } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAdminUser())) redirect("/admin/login");
  const products = await getProducts();
  return <AdminDashboard initialProducts={products} />;
}
