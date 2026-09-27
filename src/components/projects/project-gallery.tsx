"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectImage } from "@/types/project";

export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, isOpen]);

  const activeImage = images[activeIndex] ?? images[0];

  const grid = useMemo(() => {
    if (images.length === 1) return "grid-cols-1";
    if (images.length === 2) return "grid-cols-1 sm:grid-cols-2";
    if (images.length === 3) return "grid-cols-1 sm:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }, [images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className={`grid gap-4 ${grid}`}>
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActiveIndex(index);
              setIsOpen(true);
            }}
            className="group relative aspect-[1.1] overflow-hidden border border-line bg-surface text-left"
            aria-label={`Open image ${index + 1}`}
          >
            <Image
              src={image.image_url}
              alt={image.alt_text ?? `Project image ${index + 1}`}
              fill
              unoptimized
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {isOpen && activeImage && (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-navy/95" />
          <Dialog.Content aria-describedby={undefined} onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }} className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-3 sm:p-6">
            <Dialog.Title className="sr-only">Project image viewer</Dialog.Title>
            <div className="relative w-full max-w-5xl pt-14">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close project gallery"
                className="absolute right-0 top-0 z-10 flex size-11 items-center justify-center rounded-full border border-line bg-navy/80 text-ivory"
              >
                <X size={20} />
              </button>

              <div className="relative overflow-hidden border border-line bg-navy">
                <div className="relative h-[65dvh] w-full">
                  <Image
                    src={activeImage.image_url}
                    alt={activeImage.alt_text ?? "Project gallery image"}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-sm text-ivory">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                    className="flex size-11 items-center justify-center rounded-full border border-line bg-navy/80"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
                    aria-label="Next image"
                    className="flex size-11 items-center justify-center rounded-full border border-line bg-navy/80"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {activeIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
