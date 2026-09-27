"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { saveHomepage } from "@/app/admin/homepage/actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { HomepageImageEditor } from "@/components/admin/homepage-image-editor";
import { HeroSection, MaterialCards } from "@/components/homepage/sections";
import { defaultHomepage, homepageSchema, homepageSlots, type HomepageCardContent, type HomepageFallbacks, type HomepageSlot, type HomepageSnapshot } from "@/lib/homepage-content";

const draftKey = "cape-counter-tops:homepage-draft:v1";

export function HomepageEditor({ initial, fallbacks }: { initial: HomepageSnapshot; fallbacks: HomepageFallbacks }) {
  const [published, setPublished] = useState(initial);
  const [content, setContent] = useState(initial.content);
  const [revision, setRevision] = useState(initial.revision);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const restored = useRef(false);
  const dirty = JSON.stringify(content) !== JSON.stringify(published.content);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const saved = sessionStorage.getItem(draftKey);
      if (!saved) return;
      const draft = JSON.parse(saved);
      const parsed = homepageSchema.safeParse(draft.content);
      if (parsed.success && Number.isInteger(draft.revision) && window.confirm("Restore your unsaved homepage changes from this tab?")) {
        // Restore a browser draft after hydration; it is not published content.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContent(parsed.data);
        setRevision(draft.revision);
        setStatus("Unsaved draft restored. Review it before saving.");
      } else sessionStorage.removeItem(draftKey);
    } catch { /* Storage can be unavailable in private browsing. */ }
  }, []);

  useEffect(() => {
    if (dirty) {
      try { sessionStorage.setItem(draftKey, JSON.stringify({ content, revision })); } catch { /* The unload warning still protects the draft. */ }
    }
  }, [content, revision, dirty]);

  useEffect(() => {
    if (!dirty && !busy && !saving) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target === "_blank" || event.ctrlKey || event.metaKey) return;
      if (!window.confirm("You have unsaved homepage changes. Leave this page?")) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", click, true); };
  }, [dirty, busy, saving]);

  function update(slot: HomepageSlot, patch: Partial<HomepageCardContent> & { label?: string }) {
    setStatus("");
    setContent((current) => slot === "hero" ? { ...current, hero: { ...current.hero, ...patch } } : { ...current, materials: { ...current.materials, [slot]: { ...current.materials[slot], ...patch } } });
  }

  function discard() {
    if (!window.confirm("Discard all unsaved homepage changes?")) return;
    setContent(published.content); setRevision(published.revision); setError(""); setStatus("Changes discarded. Showing the published content.");
    try { sessionStorage.removeItem(draftKey); } catch {}
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || saving || !initial.available) return;
    const parsed = homepageSchema.safeParse(content);
    if (!parsed.success) { setError(`${parsed.error.issues[0].path.join(" → ")}: ${parsed.error.issues[0].message}`); return; }
    setSaving(true); setError(""); setStatus("");
    try {
      const result = await saveHomepage({ content: parsed.data, revision });
      if (result.error || !result.content || result.revision === undefined) { setError(result.error || "Unable to save changes."); return; }
      setPublished({ content: result.content, revision: result.revision, available: true });
      setContent(result.content); setRevision(result.revision);
      try { sessionStorage.removeItem(draftKey); } catch {}
      setStatus("Changes saved. Your homepage is now published.");
    } catch { setError("Unable to confirm the save. Your edits are still here. Please try again."); }
    finally { setSaving(false); }
  }

  return <main className="min-h-screen bg-navy text-ivory">
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8 lg:px-10">
        <p className="font-serif text-xl">Cape Counter Tops <span className="text-gold">/</span> Admin</p>
        <Link href="/" target="_blank" rel="noopener noreferrer" className="button-secondary">View published website</Link>
      </div>
      <AdminNavigation active="homepage" />
    </header>
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Website content</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Homepage Editor</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">Edit the hero and three material cards. Preview your changes, then save to publish them together. Catalogue products and project records stay separate.</p>
      {!initial.available && <p role="alert" className="mt-6 border border-danger bg-danger-surface p-4 text-danger">{initial.error} The public homepage continues to use its existing defaults. Saving and uploads are disabled.</p>}
      <form onSubmit={submit} className="mt-8">
        <div className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border border-line bg-navy p-4">
          <button type="submit" disabled={!dirty || busy || saving || !initial.available} className="button-primary disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
          <button type="button" onClick={discard} disabled={!dirty || busy || saving} className="button-secondary disabled:cursor-not-allowed disabled:opacity-50">Discard Changes</button>
          <button type="button" onClick={() => setShowPreview((value) => !value)} aria-expanded={showPreview} aria-controls="homepage-preview" className="button-secondary">{showPreview ? "Hide Preview" : "Preview Changes"}</button>
          <span role="status" className="text-xs text-muted">{busy ? "Image upload in progress" : dirty ? "Unsaved changes" : "Published content"}</span>
        </div>
        {error && <p role="alert" className="mt-4 border border-danger bg-danger-surface p-4 text-danger">{error}</p>}
        {status && <p role="status" className="mt-4 border border-success bg-success-surface p-4 text-success">{status}</p>}
        {showPreview && <section id="homepage-preview" aria-label="Homepage preview" className="mt-8 overflow-hidden border border-line">
          <h2 className="bg-surface p-5 font-serif text-2xl">Unsaved homepage preview</h2>
          <div inert><HeroSection content={content.hero} fallback={fallbacks.hero} preview /><div className="p-5 sm:p-8"><MaterialCards content={content.materials} fallbacks={fallbacks} /></div></div>
        </section>}
        <fieldset disabled={busy || saving || !initial.available} className="mt-8 min-w-0 space-y-8 disabled:opacity-70">
          {homepageSlots.map((slot) => {
            const card = slot === "hero" ? content.hero : content.materials[slot];
            const name = slot === "hero" ? "Hero" : defaultHomepage.materials[slot].title;
            return <section key={slot} className="rounded-2xl border border-line bg-surface p-5 sm:p-8" aria-label={`${name} editor`}>
              <h2 className="font-serif text-3xl">{name}</h2>
              <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-2">
                <div className="min-w-0 space-y-5">
                  <label className="block text-sm font-semibold">{name} eyebrow<input value={card.eyebrow} maxLength={100} onChange={(event) => update(slot, { eyebrow: event.target.value })} className="editor-input" /></label>
                  <label className="block text-sm font-semibold">{name === "Hero" ? "Hero heading" : `${name} title`}<input required value={card.title} maxLength={140} onChange={(event) => update(slot, { title: event.target.value })} className="editor-input" /></label>
                  <label className="block text-sm font-semibold">{name} description<textarea value={card.description} maxLength={600} rows={5} onChange={(event) => update(slot, { description: event.target.value })} className="editor-input resize-y" /></label>
                  {slot === "hero" && <label className="block text-sm font-semibold">Hero fabrication label<input value={content.hero.label} maxLength={80} onChange={(event) => update("hero", { label: event.target.value })} className="editor-input" /><span className="mt-2 block text-xs font-normal text-muted">Leave blank to hide this label.</span></label>}
                </div>
                <HomepageImageEditor name={name} image={card.image} fallback={fallbacks[slot]} onChange={(image) => update(slot, { image })} onBusy={setBusy} />
              </div>
            </section>;
          })}
        </fieldset>
      </form>
    </div>
  </main>;
}
