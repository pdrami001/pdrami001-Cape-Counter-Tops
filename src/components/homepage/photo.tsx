"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveHomepageImage, type HomepageImage, type ImageSource } from "@/lib/homepage-content";

export function HomepagePhoto({ image, fallback, texture, sizes, eager = false }: { image: HomepageImage; fallback: ImageSource; texture: string; sizes: string; eager?: boolean }) {
  const [failed, setFailed] = useState<string[]>([]);
  const primary = resolveHomepageImage(image, fallback);
  const source = primary.url && !failed.includes(primary.url) ? primary : fallback;
  if (!source.url || failed.includes(source.url)) return <div className={`absolute inset-0 ${texture}`} aria-hidden="true" />;
  return <Image src={source.url} alt={source.alt} fill unoptimized loading={eager ? "eager" : "lazy"} className="object-cover" style={{ objectPosition: `${image.x}% ${image.y}%` }} sizes={sizes} onError={() => setFailed((current) => [...current, source.url!])} />;
}
