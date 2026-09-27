import { Check, X } from "lucide-react";

export function StockBadge({ inStock }: { inStock: boolean }) {
  return inStock ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-surface px-3 py-1 text-[11px] font-semibold text-success"><Check size={13} /> In stock</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-muted"><X size={13} /> Out of stock</span>
  );
}
