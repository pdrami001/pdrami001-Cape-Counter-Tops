"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#20211f]/95 text-[#f7f4ee] backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#home" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center border border-[#c6a77a] text-sm font-bold text-[#c6a77a]">S</span>
          <span className="leading-none">
            <span className="block font-serif text-lg tracking-wide">StoneCraft</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.26em] text-[#bcb8ae]">Surfaces</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-[#d7d2c8] transition hover:text-white">{item.label}</a>
          ))}
        </nav>

        <div className="hidden sm:block">
          <WhatsAppButton variant="light" className="min-h-10 px-4 text-xs">Get a quote</WhatsAppButton>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="border-t border-white/10 bg-[#20211f] px-5 pb-6 pt-3 lg:hidden" aria-label="Mobile navigation">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-4 text-sm text-[#e8e3da]">{item.label}</a>
          ))}
          <WhatsAppButton className="mt-5 w-full" variant="light">Request a quote</WhatsAppButton>
        </nav>
      )}
    </header>
  );
}
