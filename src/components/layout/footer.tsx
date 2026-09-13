import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LockKeyhole, MapPin } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { siteConfig } from "@/lib/constants";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export function Footer() {
  return (
    <footer className="bg-[#20211f] text-[#f7f4ee]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:px-10 lg:py-20">
        <div>
          <div className="mb-6"><Image src="/cape-counter-tops-logo.png" alt="Cape Counter Tops" width={190} height={52} className="h-auto w-[170px] object-contain" /></div>
          <p className="max-w-sm text-sm leading-7 text-[#bcb8ae]">Premium stone surfaces, carefully fabricated and installed for spaces made to last.</p>
          <div className="mt-6 flex items-center gap-2 text-xs text-[#bcb8ae]"><MapPin size={14} aria-hidden="true" /> Cape Town and surrounding areas</div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a77a]">Explore</h2>
          <div className="grid gap-3 text-sm text-[#d7d2c8]">{siteConfig.navigation.slice(0, 4).map((item) => <a key={item.href} href={item.href} className="transition hover:text-white">{item.label}</a>)}</div>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a77a]">Start a project</h2>
          <p className="mb-5 text-sm leading-6 text-[#bcb8ae]">Tell us what you are imagining. We will help you find the right surface.</p>
          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppButton variant="light" className="w-full sm:w-auto">Chat on WhatsApp <ArrowUpRight size={15} /></WhatsAppButton>
            <a href="https://www.facebook.com/share/1Jf6gXG8SH/" target="_blank" rel="noopener noreferrer" aria-label="Cape Counter Tops on Facebook" className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-[#d7d2c8] transition duration-300 hover:-translate-y-0.5 hover:border-[#c6a77a] hover:text-[#c6a77a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]">
              <FaFacebookF size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-5 text-center text-xs text-[#8d8c84] sm:flex-row sm:px-8 sm:text-left"><span>© {new Date().getFullYear()} {siteConfig.name}. Brand details are ready to be customised.</span><Link href="/admin/login" className="inline-flex items-center gap-1.5 text-[#77766f] transition hover:text-[#c6a77a]"><LockKeyhole size={12} aria-hidden="true" /> Admin Login</Link></div>
    </footer>
  );
}
