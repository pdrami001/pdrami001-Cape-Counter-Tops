"use client";

import { validateImageFile, uploadStorageImage } from "@/lib/images";
import { LoaderCircle, Upload, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { categoryOptions } from "@/lib/constants";
import { productSchema, type ProductFormValues } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

export function ProductForm({ product, onSaved, onCancel }: { product?: Product; onSaved: (product: Product) => void; onCancel: () => void }) {
  const [values, setValues] = useState<ProductFormValues>({ name: product?.name ?? "", category: product?.category ?? "granite", description: product?.description ?? "", colour: product?.colour ?? "", finish: product?.finish ?? "", in_stock: product?.in_stock ?? true, featured: product?.featured ?? false });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image_url ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  function change<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) { setValues((current) => ({ ...current, [key]: value })); }
  function chooseFile(nextFile: File | null) { if (!nextFile) return; const validation = validateImageFile(nextFile); if (validation) { setError(validation); return; } setError(""); setFile(nextFile); setPreview(URL.createObjectURL(nextFile)); }

  async function submit(event: FormEvent) { event.preventDefault(); const result = productSchema.safeParse(values); if (!result.success) { setError(result.error.issues[0]?.message ?? "Please check the form."); return; } setPending(true); setError("");
    try { const supabase = createSupabaseBrowserClient(); let imageUrl = product?.image_url ?? null;
      if (file) { const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg"; const path = `${crypto.randomUUID()}.${extension}`; imageUrl = await uploadStorageImage(supabase, "product-images", path, file); }
      const payload = { ...result.data, image_url: imageUrl, slug: product?.slug ?? `${slugify(result.data.name)}-${Date.now().toString(36)}` };
      const response = product ? await supabase.from("products").update(payload).eq("id", product.id).select().single() : await supabase.from("products").insert(payload).select().single(); if (response.error || !response.data) throw new Error(response.error?.message ?? "Unable to save product."); onSaved(response.data); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to save product."); setPending(false); }
  }

  return <form onSubmit={submit} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold sm:col-span-2">Product name<input required value={values.name} onChange={(event) => change("name", event.target.value)} className="mt-2 h-11 w-full border border-line bg-surface px-3 font-normal outline-none focus:border-gold" /></label><label className="block text-sm font-semibold">Category<select value={values.category} onChange={(event) => change("category", event.target.value as Product["category"])} className="mt-2 h-11 w-full border border-line bg-surface px-3 font-normal outline-none focus:border-gold">{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="block text-sm font-semibold">Colour<input value={values.colour} onChange={(event) => change("colour", event.target.value)} className="mt-2 h-11 w-full border border-line bg-surface px-3 font-normal outline-none focus:border-gold" /></label><label className="block text-sm font-semibold">Finish<input value={values.finish} onChange={(event) => change("finish", event.target.value)} className="mt-2 h-11 w-full border border-line bg-surface px-3 font-normal outline-none focus:border-gold" placeholder="Honed, polished..." /></label><label className="block text-sm font-semibold sm:col-span-2">Description<textarea required rows={4} value={values.description} onChange={(event) => change("description", event.target.value)} className="mt-2 w-full resize-y border border-line bg-surface px-3 py-2 font-normal outline-none focus:border-gold" /></label></div><div><p className="text-sm font-semibold">Product image</p><label className="mt-2 flex min-h-24 cursor-pointer items-center justify-center gap-2 border border-dashed border-line bg-surface text-sm text-muted hover:border-gold"><Upload size={17} /><span>{file ? file.name : "Choose JPG, PNG or WebP (max 5 MB)"}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} className="sr-only" /></label>{preview && <div className="mt-3 flex items-center gap-3"><div role="img" aria-label="Product preview" className="size-16 bg-cover bg-center" style={{ backgroundImage: `url(${preview})` }} /><button type="button" onClick={() => { setFile(null); setPreview(""); }} className="flex items-center gap-1 text-xs text-danger"><X size={14} /> Remove image</button></div>}</div><div className="flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={values.in_stock} onChange={(event) => change("in_stock", event.target.checked)} className="size-4 accent-gold" /> In stock</label><label className="flex items-center gap-2"><input type="checkbox" checked={values.featured} onChange={(event) => change("featured", event.target.checked)} className="size-4 accent-gold" /> Featured product</label></div>{error && <p role="alert" className="border border-danger bg-danger-surface px-4 py-3 text-sm text-danger">{error}</p>}<div className="flex justify-end gap-3 border-t border-line pt-5"><button type="button" onClick={onCancel} className="h-11 px-4 text-sm font-semibold text-muted">Cancel</button><button disabled={pending} className="flex h-11 items-center gap-2 button-primary px-5 text-sm font-semibold disabled:opacity-60">{pending && <LoaderCircle size={16} className="animate-spin" />}{pending ? "Saving..." : product ? "Save changes" : "Add product"}</button></div></form>;
}
