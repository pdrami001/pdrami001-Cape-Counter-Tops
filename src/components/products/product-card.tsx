import { ArrowUpRight } from "lucide-react";
import { categoryLabels } from "@/lib/constants";
import { productWhatsAppMessage } from "@/lib/whatsapp";
import type { Product } from "@/types/product";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { StockBadge } from "@/components/products/stock-badge";

const textureStyles = {
  granite: "bg-[radial-gradient(circle_at_20%_20%,#b3aea2_0_1px,transparent_1px),radial-gradient(circle_at_70%_70%,#847e74_0_1px,transparent_1px)] bg-[length:14px_14px] bg-[#4e514d]",
  quartz: "bg-[linear-gradient(125deg,transparent_0_47%,#e1ddd3_48%_49%,transparent_50%_100%)] bg-[#c7c3b9] bg-[length:28px_28px]",
  sintered_stone: "bg-[linear-gradient(145deg,transparent_0_45%,#ada79c_46%_47%,transparent_48%_100%)] bg-[#ded8ce] bg-[length:44px_44px]",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2px] border border-[#dcd8cf] bg-[#fbfaf7] transition duration-300 hover:-translate-y-1 hover:border-[#bdb4a4] hover:shadow-xl hover:shadow-[#302d2812]">
      <div className={`relative aspect-[4/3] overflow-hidden ${textureStyles[product.category]}`} style={product.image_url ? { backgroundImage: `linear-gradient(180deg, transparent 55%, rgba(20, 22, 20, .35)), url(${product.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} role="img" aria-label={`${product.name} surface sample`}>
        {product.featured && <span className="absolute left-4 top-4 rounded-full bg-[#f7f4ee]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4e514d]">Featured</span>}
        <div className="absolute bottom-4 left-4"><StockBadge inStock={product.in_stock} /></div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a17e4f]">{categoryLabels[product.category]}</p><ArrowUpRight size={17} className="text-[#a7a197] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></div>
        <h3 className="font-serif text-2xl leading-tight text-[#272824]">{product.name}</h3>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[#716e66]">{product.description}</p>
        {(product.colour || product.finish) && <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#716e66]">{product.colour && <span className="border-r border-[#d6d1c7] pr-2">{product.colour}</span>}{product.finish && <span>{product.finish} finish</span>}</div>}
        <WhatsAppButton message={productWhatsAppMessage(product.name)} variant="outline" className="mt-6 min-h-10 w-full px-3 text-xs">Enquire about this surface</WhatsAppButton>
      </div>
    </article>
  );
}
