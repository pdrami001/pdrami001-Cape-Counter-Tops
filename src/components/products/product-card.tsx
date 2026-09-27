import { ArrowUpRight } from "lucide-react";
import { categoryLabels } from "@/lib/constants";
import { productWhatsAppMessage } from "@/lib/whatsapp";
import type { Product } from "@/types/product";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { StockBadge } from "@/components/products/stock-badge";

const textureStyles = {
  granite: "stone-granite",
  quartz: "stone-quartz",
  sintered_stone: "stone-sintered",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2px] border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-line hover:shadow-xl hover:shadow-navy">
      <div className={`relative aspect-[4/3] overflow-hidden ${textureStyles[product.category]}`} style={product.image_url ? { backgroundImage: `url(${product.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} role="img" aria-label={`${product.name} surface sample`}>
        {product.featured && <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory">Featured</span>}
        <div className="absolute bottom-4 left-4"><StockBadge inStock={product.in_stock} /></div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{categoryLabels[product.category]}</p><ArrowUpRight size={17} className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></div>
        <h3 className="font-serif text-2xl leading-tight text-ivory">{product.name}</h3>
        <p className="mt-3 min-h-12 text-sm leading-6 text-muted">{product.description}</p>
        {(product.colour || product.finish) && <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">{product.colour && <span className="border-r border-line pr-2">{product.colour}</span>}{product.finish && <span>{product.finish} finish</span>}</div>}
        <WhatsAppButton message={productWhatsAppMessage(product.name)} variant="outline" className="mt-6 min-h-10 w-full px-3 text-xs">Enquire about this surface</WhatsAppButton>
      </div>
    </article>
  );
}
