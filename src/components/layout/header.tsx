"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/constants";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = () => media.matches;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const threshold = 18;

      if (open) {
        setHidden(false);
        lastScrollY.current = currentScroll;
        return;
      }

      if (reduceMotion()) {
        setHidden(false);
        lastScrollY.current = currentScroll;
        return;
      }

      if (currentScroll <= 8) {
        setHidden(false);
      } else if (currentScroll > lastScrollY.current + threshold) {
        setHidden(true);
      } else if (currentScroll < lastScrollY.current - threshold) {
        setHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) { setOpen(false); menuButton.current?.focus(); }
      }}
      className="marble-bg fixed inset-x-0 top-0 z-50 border-b border-line text-ivory shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      style={{
        transform: hidden ? "translateY(-105%)" : "translateY(0)",
        transition: "transform 220ms ease, opacity 220ms ease",
        willChange: "transform",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:h-[82px] lg:px-10">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)} aria-label="Cape Counter Tops home">
          <Image
            src="/icon.svg"
            alt="CCT"
            width={52}
            height={52}
            priority
            className="size-10 shrink-0 sm:size-12"
          />
          <span className="min-w-0 leading-tight">
            <span className="block whitespace-nowrap font-serif text-[11px] text-ivory sm:text-sm lg:text-base">CAPE COUNTER TOPS</span>
            <span className="mt-1 hidden whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.13em] text-gold sm:block">Timeless beauty · lasting quality</span>
            <span className="mt-1 hidden whitespace-nowrap text-[7px] font-medium uppercase tracking-[0.12em] text-muted lg:block">Granite | Quartz | Sintered Stone</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-sm font-medium text-muted transition hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center sm:flex">
          <WhatsAppButton variant="light" className="min-h-10 px-4 text-xs">Get a quote</WhatsAppButton>
        </div>

        <button
          ref={menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 items-center justify-center rounded-full border border-line text-ivory transition hover:border-gold hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="marble-bg max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-t border-line px-4 pb-6 pt-3 lg:hidden" aria-label="Mobile navigation">
          <div className="flex items-center gap-3 border-b border-line pb-4 pt-1">
            <Image src="/icon.svg" alt="CCT" width={44} height={44} className="size-11 shrink-0" />
            <span className="leading-tight">
              <span className="block font-serif text-sm text-ivory">CAPE COUNTER TOPS</span>
              <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.13em] text-gold">Timeless beauty · lasting quality</span>
              <span className="mt-1 block text-[7px] font-medium uppercase tracking-[0.12em] text-muted">Granite | Quartz | Sintered Stone</span>
            </span>
          </div>
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-line py-4 text-sm font-medium text-muted transition hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset">
              {item.label}
            </Link>
          ))}
          <WhatsAppButton className="mt-5 w-full" variant="light">Request a quote</WhatsAppButton>
        </nav>
      )}
    </header>
  );
}
