"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { categoryOptions } from "@/lib/constants";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<"all" | Product["category"]>("all");
  const [query, setQuery] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery && (!stockOnly || product.in_stock);
  }), [category, products, query, stockOnly]);
  const filterOptions: Array<{ value: "all" | Product["category"]; label: string }> = [{ value: "all", label: "All" }, ...categoryOptions];

  return <div>
    <div className="mb-8 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted"><SlidersHorizontal size={15} /> Filter surfaces</div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative"><span className="sr-only">Search surfaces</span><Search size={15} className="absolute left-3 top-3.5 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search surfaces" className="h-11 w-full rounded-full border border-line bg-transparent pl-9 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-gold sm:w-52" /></label>
        <div className="flex gap-1 overflow-x-auto rounded-full border border-line p-1">{filterOptions.map((option) => <button type="button" key={option.value} aria-pressed={category === option.value} onClick={() => setCategory(option.value)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition ${category === option.value ? "bg-gold text-navy" : "text-muted hover:text-ivory"}`}>{option.label}</button>)}</div>
        <label className="flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line px-4 text-xs font-semibold text-muted"><input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} className="accent-gold" /> In stock only</label>
      </div>
    </div>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="border border-dashed border-line px-6 py-16 text-center"><h3 className="font-serif text-2xl text-ivory">No products found.</h3><p className="mt-2 text-sm text-muted">Please contact us on WhatsApp for our latest range.</p></div>}
  </div>;
}
