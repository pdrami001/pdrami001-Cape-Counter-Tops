"use client";

import Image from "next/image";
import { useState } from "react";
import { HomepagePhoto } from "@/components/homepage/photo";
import { homepageImageLimitMB, type HomepageImage, type ImageSource } from "@/lib/homepage-content";
import { validateImageFile } from "@/lib/images";
import { uploadHomepageImage } from "@/lib/homepage-upload";

export function HomepageImageEditor({ name, image, fallback, onChange, onBusy }: {
  name: string; image: HomepageImage; fallback: ImageSource;
  onChange: (image: HomepageImage) => void; onBusy: (busy: boolean) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function choose(file: File | undefined) {
    if (!file) return;
    const invalid = validateImageFile(file, homepageImageLimitMB);
    if (invalid) { setError(invalid); return; }
    onBusy(true); setError(""); setProgress(0);
    const url = URL.createObjectURL(file);
    setPreview(url);
    try {
      const probe = new window.Image();
      probe.src = url;
      await probe.decode();
      const path = await uploadHomepageImage(file, setProgress);
      onChange({ ...image, path, alt: image.alt || `${name} photograph` });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to read or upload this image.");
    } finally {
      URL.revokeObjectURL(url); setPreview(null); setProgress(null); onBusy(false);
    }
  }

  return <div className="space-y-4">
    <div className={`relative mx-auto w-full max-w-sm overflow-hidden border border-line bg-navy ${name === "Hero" ? "aspect-[16/10]" : "aspect-[1.9]"}`}>
      {preview ? <Image src={preview} alt={`New ${name} image preview`} fill unoptimized className="object-cover" style={{ objectPosition: `${image.x}% ${image.y}%` }} sizes="400px" /> : <HomepagePhoto image={image} fallback={fallback} texture="stone-granite" sizes="400px" />}
    </div>
    <p className="text-xs leading-6 text-muted">{image.path ? "Custom homepage image. It becomes public when you save." : "Using the existing photograph fallback, or a decorative surface when no photograph is available."}</p>
    <label className="block text-sm font-semibold">
      {image.path ? `Replace ${name} image` : `Upload ${name} image`}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void choose(file); }} className="mt-2 block w-full min-w-0 text-xs text-muted file:mr-3 file:rounded-full file:border file:border-line file:bg-navy file:px-3 file:py-2 file:text-ivory" />
    </label>
    <p className="text-xs text-muted">JPEG, PNG or WebP. Maximum {homepageImageLimitMB} MB.</p>
    {progress !== null && <div role="status" className="text-sm text-gold"><progress aria-label={`${name} upload progress`} max={100} value={progress} className="w-full" /><p>{progress < 100 ? `Uploading ${progress}%` : "Upload received. Finishing storage…"}</p></div>}
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    <button type="button" disabled={!image.path} onClick={() => { setError(""); onChange({ ...image, path: null }); }} className="button-secondary disabled:cursor-not-allowed disabled:opacity-50">Remove {name} image</button>
    <p className="text-xs leading-6 text-muted">Removing restores the fallback after saving. Original files are retained safely.</p>
    <label className="block text-sm font-semibold">{name} image alt text<input value={image.alt} maxLength={250} onChange={(event) => onChange({ ...image, alt: event.target.value })} className="editor-input" /></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm">{name} horizontal position: {image.x}%<input type="range" min={0} max={100} value={image.x} onChange={(event) => onChange({ ...image, x: Number(event.target.value) })} className="mt-3 w-full" /></label>
      <label className="block text-sm">{name} vertical position: {image.y}%<input type="range" min={0} max={100} value={image.y} onChange={(event) => onChange({ ...image, y: Number(event.target.value) })} className="mt-3 w-full" /></label>
    </div>
  </div>;
}
