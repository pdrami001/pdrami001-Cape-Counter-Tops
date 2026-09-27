import Link from "next/link";

export function AdminNavigation({ active }: { active: "inventory" | "homepage" }) {
  return <nav aria-label="Admin navigation" className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-4 sm:px-8 lg:px-10">
    <Link href="/admin/dashboard" aria-current={active === "inventory" ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === "inventory" ? "bg-gold text-navy" : "text-muted hover:text-ivory"}`}>Inventory &amp; Projects</Link>
    <Link href="/admin/homepage" aria-current={active === "homepage" ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === "homepage" ? "bg-gold text-navy" : "text-muted hover:text-ivory"}`}>Homepage Editor</Link>
  </nav>;
}
