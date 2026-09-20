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
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#08131f]/95 text-[#f7f4ee] backdrop-blur-md"
      style={{
        transform: hidden ? "translateY(-105%)" : "translateY(0)",
        transition: "transform 220ms ease, opacity 220ms ease",
        willChange: "transform",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:h-[82px] lg:px-10">
        <Link href="/" className="group flex items-center" onClick={() => setOpen(false)} aria-label="Cape Counter Tops home">
          <Image
            src="/cape-counter-tops-logo-new.png"
            alt="Cape Counter Tops"
            width={1983}
            height={793}
            priority
            className="h-auto w-[150px] shrink-0 object-contain sm:w-[170px] lg:w-[190px]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#d7d2c8] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08131f]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center sm:flex">
          <WhatsAppButton variant="light" className="min-h-10 px-4 text-xs">Get a quote</WhatsAppButton>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 items-center justify-center rounded-full border border-white/20 text-[#f7f4ee] transition hover:border-[#d9c29a] hover:text-[#f2e8d7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a] lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="border-t border-white/10 bg-[#08131f] px-4 pb-6 pt-3 lg:hidden" aria-label="Mobile navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-4 text-sm font-medium text-[#f0ece5] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-inset">
              {item.label}
            </Link>
          ))}
          <WhatsAppButton className="mt-5 w-full" variant="light">Request a quote</WhatsAppButton>
        </nav>
      )}
    </header>
  );
}
