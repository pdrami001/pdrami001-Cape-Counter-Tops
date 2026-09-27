import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { HomepagePhoto } from "@/components/homepage/photo";
import { materialKeys, type HomepageContent, type HomepageFallbacks, type ImageSource } from "@/lib/homepage-content";

export function HeroSection({ content, fallback, preview = false }: { content: HomepageContent["hero"]; fallback: ImageSource; preview?: boolean }) {
  const headingParts = content.title.split(" · ");
  const headingLead = headingParts.length > 1 ? headingParts.slice(0, -1).join(" · ") : content.title;
  const headingAccent = headingParts.length > 1 ? headingParts.at(-1) : "";
  return (
    <section className={`marble-bg relative isolate overflow-hidden text-ivory ${preview ? "" : "pt-[var(--header-height)]"}`}>
      <div className="absolute inset-0">
        <HomepagePhoto image={content.image} fallback={fallback} texture="stone-granite" sizes="100vw" eager />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,15,0.97)_0%,rgba(16,16,15,0.84)_37%,rgba(16,16,15,0.28)_75%,rgba(16,16,15,0.16)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,16,15,0.45),transparent_38%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-5 py-16 sm:min-h-[600px] sm:px-8 lg:min-h-[620px] lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{content.eyebrow}</p>
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] text-ivory sm:text-6xl lg:text-7xl">
            <span className="block">{headingLead}{headingAccent ? " ·" : ""}</span>
            {headingAccent && <span className="block text-gold">{headingAccent}</span>}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">{content.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton variant="light">Get a Quote</WhatsAppButton>
            <Link href="/projects" className="button-secondary">Explore Our Work <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MaterialCards({ content, fallbacks }: { content: HomepageContent["materials"]; fallbacks: HomepageFallbacks }) {
  const textures = { granite: "stone-granite", quartz: "stone-quartz", sintered_stone: "stone-sintered" };
  return <div className="grid gap-4 md:grid-cols-3">
    {materialKeys.map((key) => {
      const card = content[key];
      return <Link key={key} href="/#products" aria-label={`Explore ${card.title} products`} className="group min-w-0 overflow-hidden border border-line bg-elevated transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
        <div className={`relative aspect-[1.9] overflow-hidden ${textures[key]}`}>
          <HomepagePhoto image={card.image} fallback={fallbacks[key]} texture={textures[key]} sizes="(max-width: 767px) 100vw, 33vw" />
        </div>
        <div className="relative min-h-[150px] p-5 pr-16 sm:p-6 sm:pr-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{card.eyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ivory">{card.title}</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{card.description}</p>
          <span className="absolute right-5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold text-gold transition group-hover:bg-gold group-hover:text-background sm:right-6">
            <ArrowRight size={17} aria-hidden="true" />
          </span>
        </div>
      </Link>;
    })}
  </div>;
}
