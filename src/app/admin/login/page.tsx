import { isAdminUser } from "@/lib/products";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminUser()) redirect("/admin/dashboard");
  return <main className="flex min-h-screen items-center justify-center bg-[#20211f] px-5 py-12"><div className="grid w-full max-w-4xl overflow-hidden bg-[#f7f4ee] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"><div className="hidden min-h-[560px] flex-col justify-between bg-[#4e514d] p-10 text-[#f7f4ee] lg:flex"><div><Image src="/cape-counter-tops-logo.jpeg" alt="Cape Counter Tops" width={190} height={52} className="h-auto w-[190px] object-contain" /><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c6a77a]">Private workspace</p></div><div><p className="font-serif text-4xl leading-tight">The right details make the whole room.</p><p className="mt-5 max-w-xs text-sm leading-6 text-[#d6d1c7]">Manage your Cape Counter Tops stone catalogue from one considered workspace.</p></div></div><AdminLoginForm /></div></main>;
}
