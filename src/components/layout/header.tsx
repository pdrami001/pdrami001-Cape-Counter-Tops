
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

      if (open || reduceMotion()) {
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
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
      className="marble-bg fixed inset-x-0 top-0 z-50 border-b border-line text-ivory shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      style={{
        transform: hidden ? "translateY(-105%)" : "translateY(0)",
        transition: "transform 220ms ease, opacity 220ms ease",
        willChange: "transform",
      }}
    >
      <div className="mx-auto flex h-[90px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[100px] sm:px-6 lg:h-[112px] lg:px-8">
        {/* Large CCT logo */}
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center"
          onClick={() => setOpen(false)}
          aria-label="Cape Counter Tops home"
        >
          <Image
            src="/images/cape-counter-tops-logo-transparent.png"
            alt="Cape Counter Tops"
            width={2171}
            height={724}
            priority
            className="h-[75px] w-auto max-w-[225px] object-contain sm:h-[90px] sm:max-w-[270px] lg:h-[105px] lg:max-w-[315px]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-4 lg:flex xl:gap-6"
          aria-label="Primary navigation"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link whitespace-nowrap text-sm font-medium text-muted transition hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Quote button */}
        <div className="hidden shrink-0 items-center sm:flex">
          <WhatsAppButton
            variant="light"
            className="min-h-10 px-4 text-xs"
          >
            Get a quote
          </WhatsAppButton>
        </div>

        {/* Mobile menu button */}
        <button
          ref={menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ivory transition hover:border-gold hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <nav
          id="mobile-navigation"
          className="marble-bg max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-t border-line px-4 pb-6 pt-3 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center border-b border-line pb-4 pt-1">
            <Image
              src="/images/cape-counter-tops-logo-transparent.png"
              alt="Cape Counter Tops"
              width={2171}
              height={724}
              className="h-[85px] w-auto max-w-full object-contain"
            />
          </div>

          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-4 text-sm font-medium text-muted transition hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
            >
              {item.label}
            </Link>
          ))}

          <WhatsAppButton className="mt-5 w-full" variant="light">
            Request a quote
          </WhatsAppButton>
        </nav>
      )}
    </header>
  );
}
