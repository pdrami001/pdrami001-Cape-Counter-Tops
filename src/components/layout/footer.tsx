import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LockKeyhole, MapPin, Mail } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { siteConfig } from "@/lib/constants";
import { createWhatsAppUrl } from "@/lib/whatsapp";
export function Footer() {
  return (
    <footer className="bg-[#08131f] text-[#f7f4ee]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:px-10 lg:py-18">
        <div>
          <Link href="/" className="mb-5 inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]">
            <Image src="/cape-counter-tops-logo-new.png" alt="Cape Counter Tops" width={1983} height={793} className="h-auto w-[190px] object-contain" />
          </Link>
          <p className="max-w-sm text-sm leading-7 text-[#c4beb0]">Granite, quartz and sintered stone surfaces for refined residential and commercial spaces.</p>
          <div className="mt-5 flex items-center gap-2 text-xs text-[#d7d2c8]">
            <MapPin size={14} aria-hidden="true" />
            {siteConfig.serviceArea}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c6a77a]">Explore</h2>
          <div className="grid gap-3 text-sm text-[#d7d2c8]">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08131f]">
                {item.label}
              </Link>
            ))}
            <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-white">Website Terms</Link>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c6a77a]">Contact</h2>
          <div className="space-y-3 text-sm text-[#d7d2c8]">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20211f]">
              <Mail size={14} aria-hidden="true" />
              {siteConfig.email}
            </a>
            <a href={createWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20211f]">
              <ArrowUpRight size={14} aria-hidden="true" />
              WhatsApp enquiry
            </a>
            <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20211f]">
              <FaFacebookF size={14} aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-5 text-center text-xs text-[#8d8c84] sm:flex-row sm:px-8 sm:text-left">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="inline-flex items-center gap-1.5 transition hover:text-[#d5c299]">Privacy Policy</Link>
          <Link href="/terms" className="inline-flex items-center gap-1.5 transition hover:text-[#d5c299]">Website Terms</Link>
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-[#77766f] transition hover:text-[#c6a77a]"><LockKeyhole size={12} aria-hidden="true" /> Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
