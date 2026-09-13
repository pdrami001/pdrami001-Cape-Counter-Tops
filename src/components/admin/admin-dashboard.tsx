"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, Edit3, LogOut, Package, Plus, Trash2, X, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { ProjectForm } from "@/components/admin/project-form";
import { categoryLabels } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Project } from "@/types/project";

export function AdminDashboard({ initialProducts, initialProjects }: { initialProducts: Product[]; initialProjects: Project[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Product | undefined>();
  const [projectEditing, setProjectEditing] = useState<Project | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inStock = products.filter((product) => product.in_stock).length;
  const featured = products.filter((product) => product.featured).length;
  const stats: Array<[string, number, LucideIcon]> = [["Total products", products.length, Package], ["In stock", inStock, Check], ["Out of stock", products.length - inStock, X], ["Featured", featured, Plus]];

  function saved(product: Product) {
    setProducts((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists ? current.map((item) => item.id === product.id ? product : item) : [product, ...current];
    });
    setFormOpen(false);
    setEditing(undefined);
    setMessage("Catalogue updated successfully.");
  }

  function projectSaved(project: Project) {
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id);
      return exists ? current.map((item) => item.id === project.id ? project : item) : [project, ...current];
    });
    setProjectFormOpen(false);
    setProjectEditing(undefined);
    setMessage("Previous job updated successfully.");
  }

  async function toggleStock(product: Product) {
    setError("");
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, in_stock: !product.in_stock } : item));
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.from("products").update({ in_stock: !product.in_stock }).eq("id", product.id);
    if (updateError) {
      setProducts((current) => current.map((item) => item.id === product.id ? product : item));
      setError("Could not update stock availability.");
    } else setMessage("Stock availability updated.");
  }

  async function remove(product: Product) {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);
    if (deleteError) setError("Could not delete this product.");
    else { setProducts((current) => current.filter((item) => item.id !== product.id)); setMessage("Product deleted."); }
  }

  async function removeProject(project: Project) {
    if (!window.confirm("Are you sure you want to delete this project? This will also remove its project images.")) return;
    setError("");
    const supabase = createSupabaseBrowserClient();

    if (project.project_images?.length) {
      const storagePaths = project.project_images
        .map((image) => image.storage_path)
        .filter((path): path is string => !!path);
      if (storagePaths.length) {
        await supabase.storage.from("project-images").remove(storagePaths);
      }
    }

    const { error: deleteError } = await supabase.from("projects").delete().eq("id", project.id);
    if (deleteError) {
      setError("Could not delete this project.");
      return;
    }

    setProjects((current) => current.filter((item) => item.id !== project.id));
    setMessage("Project deleted successfully.");
  }

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f3f0e9] text-[#272824]">
      <header className="border-b border-[#dcd8cf] bg-[#20211f] text-[#f7f4ee]">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div>
            <p className="font-serif text-xl">Cape Counter Tops <span className="text-[#c6a77a]">/</span> Inventory</p>
            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-[#aaa79f] sm:block">Private workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden items-center gap-1 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold sm:flex">View website <ArrowUpRight size={14} /></Link>
            <button onClick={logout} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold"><LogOut size={14} /> <span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a17e4f]">Overview</p>
            <h1 className="mt-2 font-serif text-4xl">Inventory dashboard</h1>
            <p className="mt-2 text-sm text-[#716e66]">Manage your stone catalogue, product availability and previous jobs.</p>
          </div>
          <Dialog.Root open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditing(undefined); }}>
            <Dialog.Trigger asChild>
              <button onClick={() => setEditing(undefined)} className="flex h-11 items-center justify-center gap-2 bg-[#20211f] px-5 text-sm font-semibold text-white"><Plus size={17} /> Add product</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-[#20211f]/60 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-[#f7f4ee] p-6 shadow-2xl sm:p-8">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <Dialog.Title className="font-serif text-3xl">{editing ? "Edit product" : "Add a product"}</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-[#716e66]">Keep your public catalogue current and clear.</Dialog.Description>
                  </div>
                  <Dialog.Close aria-label="Close" className="rounded-full p-2 hover:bg-[#e8e2d7]"><X size={18} /></Dialog.Close>
                </div>
                <ProductForm product={editing} onSaved={saved} onCancel={() => setFormOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {(message || error) && <p role="status" className={`mt-6 border px-4 py-3 text-sm ${error ? "border-[#d8b6ad] bg-[#f6e9e5] text-[#8a4d42]" : "border-[#bfd3c1] bg-[#e8f1e8] text-[#42634a]"}`}>{error || message}</p>}

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="border border-[#dcd8cf] bg-[#f7f4ee] p-5">
              <Icon size={18} className="text-[#a17e4f]" />
              <p className="mt-6 text-3xl font-semibold">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#716e66]">{label}</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Product catalogue</h2>
            <span className="text-xs text-[#716e66]">{products.length} {products.length === 1 ? "item" : "items"}</span>
          </div>
          <div className="overflow-hidden border border-[#dcd8cf] bg-[#f7f4ee]">
            <div className="hidden grid-cols-[1fr_150px_130px_100px_90px] gap-4 border-b border-[#dcd8cf] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b877e] md:grid">
              <span>Product</span><span>Category</span><span>Updated</span><span>Stock</span><span>Actions</span>
            </div>
            {products.length ? products.map((product) => (
              <div key={product.id} className="grid gap-4 border-b border-[#e2ddd3] px-5 py-5 last:border-0 md:grid-cols-[1fr_150px_130px_100px_90px] md:items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-1 text-xs text-[#716e66]">{product.colour || "Colour not set"}{product.featured && " · Featured"}</p>
                </div>
                <p className="text-xs text-[#716e66]">{categoryLabels[product.category]}</p>
                <p className="text-xs text-[#716e66]">{formatDate(product.updated_at)}</p>
                <button onClick={() => toggleStock(product)} className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${product.in_stock ? "bg-[#e6eee6] text-[#3f684b]" : "bg-[#eeeae3] text-[#716b60]"}`}><span className={`size-2 rounded-full ${product.in_stock ? "bg-[#4e8b5f]" : "bg-[#aaa49a]"}`} />{product.in_stock ? "In stock" : "Out"}</button>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(product); setFormOpen(true); }} aria-label={`Edit ${product.name}`} className="rounded p-2 text-[#716e66] hover:bg-[#e8e2d7] hover:text-[#20211f]"><Edit3 size={16} /></button>
                  <button onClick={() => remove(product)} aria-label={`Delete ${product.name}`} className="rounded p-2 text-[#8a4d42] hover:bg-[#f6e9e5]"><Trash2 size={16} /></button>
                </div>
              </div>
            )) : <div className="px-6 py-16 text-center"><Package size={28} className="mx-auto text-[#8b877e]" /><h3 className="mt-3 font-serif text-2xl">No products yet.</h3><p className="mt-2 text-sm text-[#716e66]">Add your first stone surface to get started.</p></div>}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a17e4f]">Previous jobs</p>
              <h2 className="mt-2 font-serif text-2xl">Recent installations</h2>
            </div>
            <Dialog.Root open={projectFormOpen} onOpenChange={(open) => { setProjectFormOpen(open); if (!open) setProjectEditing(undefined); }}>
              <Dialog.Trigger asChild>
                <button onClick={() => setProjectEditing(undefined)} className="flex h-11 items-center justify-center gap-2 bg-[#20211f] px-5 text-sm font-semibold text-white"><Plus size={17} /> Add project</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[#20211f]/60 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-[#f7f4ee] p-5 shadow-2xl sm:p-8">
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                      <Dialog.Title className="font-serif text-3xl">{projectEditing ? "Edit project" : "Add previous job"}</Dialog.Title>
                      <Dialog.Description className="mt-2 text-sm text-[#716e66]">Showcase a completed Cape Counter Tops installation.</Dialog.Description>
                    </div>
                    <Dialog.Close aria-label="Close" className="rounded-full p-2 hover:bg-[#e8e2d7]"><X size={18} /></Dialog.Close>
                  </div>
                  <ProjectForm project={projectEditing} onSaved={projectSaved} onCancel={() => setProjectFormOpen(false)} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div className="overflow-hidden border border-[#dcd8cf] bg-[#f7f4ee]">
            {projects.length ? projects.map((project) => (
              <div key={project.id} className="grid gap-4 border-b border-[#e2ddd3] p-4 last:border-0 md:grid-cols-[110px_1fr_120px_110px_110px] md:items-center md:p-5">
                <div className="relative h-20 overflow-hidden border border-[#d8d2c8] bg-[#e8e1d8] md:h-16">
                  {project.project_images?.[0]?.image_url ? (
                    <Image src={project.project_images[0].image_url} alt={project.title} fill unoptimized className="object-cover" sizes="120px" />
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold">{project.title}</p>
                  <p className="mt-1 text-xs text-[#716e66]">{project.project_type}{project.featured ? " · Featured" : ""}</p>
                </div>
                <p className="text-xs text-[#716e66]">{project.material || "—"}</p>
                <p className="text-xs text-[#716e66]">{project.project_images?.length ?? 0} images</p>
                <div className="flex gap-1 md:justify-end">
                  <button onClick={() => { setProjectEditing(project); setProjectFormOpen(true); }} aria-label={`Edit ${project.title}`} className="rounded p-2 text-[#716e66] hover:bg-[#e8e2d7] hover:text-[#20211f]"><Edit3 size={16} /></button>
                  <button onClick={() => removeProject(project)} aria-label={`Delete ${project.title}`} className="rounded p-2 text-[#8a4d42] hover:bg-[#f6e9e5]"><Trash2 size={16} /></button>
                </div>
              </div>
            )) : <div className="px-6 py-16 text-center"><Package size={28} className="mx-auto text-[#8b877e]" /><h3 className="mt-3 font-serif text-2xl">No previous jobs have been added yet.</h3><p className="mt-2 text-sm text-[#716e66]">Add your first project to begin the gallery.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
