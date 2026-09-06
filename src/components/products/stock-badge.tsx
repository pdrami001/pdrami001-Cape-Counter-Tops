import { Check, X } from "lucide-react";

export function StockBadge({ inStock }: { inStock: boolean }) {
  return inStock ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eee6] px-3 py-1 text-[11px] font-semibold text-[#3f684b]"><Check size={13} /> In stock</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eeeae3] px-3 py-1 text-[11px] font-semibold text-[#716b60]"><X size={13} /> Out of stock</span>
  );
}
