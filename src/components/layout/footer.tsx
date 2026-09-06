import { ArrowUpRight, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export function Footer() {
  return (
    <footer className="bg-[#20211f] text-[#f7f4ee]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:px-10 lg:py-20">
        <div>
          <div className="mb-6 flex items-center gap-3"><span className="flex size-9 items-center justify-center border border-[#c6a77a] text-sm font-bold text-[#c6a77a]">S</span><span className="font-serif text-xl">{siteConfig.name}</span></div>
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
          <WhatsAppButton variant="light" className="w-full sm:w-auto">Chat on WhatsApp <ArrowUpRight size={15} /></WhatsAppButton>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#8d8c84] sm:px-8">© {new Date().getFullYear()} {siteConfig.name}. Brand details are ready to be customised.</div>
    </footer>
  );
}
