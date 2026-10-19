import { ArrowUpRight, Building2, Check, Gem, Hammer, Layers3, Mail, MapPin, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { FloatingWhatsApp, WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedProjects } from "@/lib/projects";
import { getProducts } from "@/lib/products";
import { getHomepage } from "@/lib/homepage";
import { getHomepageFallbacks } from "@/lib/homepage-content";
import { HeroSection, MaterialCards } from "@/components/homepage/sections";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const services = [
  ["Kitchen Countertops", Ruler],
  ["Bathroom Vanities", Gem],
  ["Vanity Units", Layers3],
  ["Fireplace Cladding", Sparkles],
  ["Reception Counters", Building2],
  ["Commercial Installations", ShieldCheck],
  ["Custom Fabrication", Hammer],
  ["Professional Installation", Check],
] as const;

export default async function Home() {
  const [products, featuredProjects, homepage] = await Promise.all([getProducts(), getFeaturedProjects(6), getHomepage()]);
  const fallbacks = getHomepageFallbacks(products, featuredProjects[0]);
  const heroProject = featuredProjects[0];
  const heroImage = heroProject?.project_images?.[0]?.image_url;

  return (
    <>
      <Header />
      <main id="home">
        <HeroSection content={homepage.content.hero} fallback={fallbacks.hero} />

        <section id="materials" className="marble-bg border-y border-line px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Our Materials"
              title="Exceptional Stone. Endless Possibilities."
              description="Discover premium materials designed for beauty, durability and everyday living."
            />
            <div className="mt-8"><MaterialCards content={homepage.content.materials} fallbacks={fallbacks} /></div>
          </div>
        </section>

        <section className="border-b border-line bg-navy">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-10">
            <div>
              <p className="font-serif text-xl text-ivory">01 / Material selection</p>
              <p className="mt-2 text-sm leading-6 text-muted">A considered range of granite, quartz and sintered stone surfaces.</p>
            </div>
            <div>
              <p className="font-serif text-xl text-ivory">02 / Fabrication</p>
              <p className="mt-2 text-sm leading-6 text-muted">Measured, cut and finished with a sharp eye for detail.</p>
            </div>
            <div>
              <p className="font-serif text-xl text-ivory">03 / Installation</p>
              <p className="mt-2 text-sm leading-6 text-muted">Clean, careful completion from the first cut to final handover.</p>
            </div>
          </div>
        </section>

        <section className="bg-surface px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Our Work"
              title="Spaces we’ve transformed."
              description="A selection of recent Cape Counter Tops installations across kitchens, bathrooms and commercial interiors."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => {
                const coverImage = project.project_images?.[0]?.image_url;
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group block overflow-hidden border border-line bg-navy transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    <div className="relative aspect-[1.15] overflow-hidden bg-surface">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted">
                          Project
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{project.project_type}</p>
                      <h3 className="font-serif text-2xl leading-tight text-ivory">{project.title}</h3>
                      <div className="text-sm text-muted">
                        {project.material ? <p>{project.material}</p> : null}
                        {project.location ? <p>{project.location}</p> : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/projects"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ivory transition hover:bg-navy hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                View all projects <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="products" className="bg-surface px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Available now"
              title="Current stone collection."
              description="Browse the current catalogue and enquire about the surfaces that fit your project."
            />
            <div className="mt-12">
              <ProductGrid products={products} />
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <SectionHeading
              eyebrow="From slab to space"
              title="Stone surfaces with a practical eye."
              description="We support residential and commercial projects with custom fabrication, supply and installation guidance."
            />
            <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
              {services.map(([name, Icon]) => (
                <div key={name} className="flex items-center gap-4 border-b border-line py-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-gold">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-ivory">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-surface px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="border border-line bg-navy p-4 shadow-sm">
              <div className="relative flex min-h-[330px] items-end overflow-hidden bg-navy p-7 sm:min-h-[420px]">
                {heroImage && <Image src={heroImage} alt="" fill unoptimized className="object-cover" sizes="(max-width: 1023px) 100vw, 50vw" />}
                <div className="absolute inset-0 bg-navy/85" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Our focus</p>
                  <p className="mt-3 max-w-sm font-serif text-4xl leading-tight text-ivory">
                    Stone that works beautifully in daily life.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="Why Cape Counter Tops"
                title="Practical expertise, considered detail."
                description="We work with homeowners, designers and businesses to select and install stone surfaces that suit the space, the lifestyle and the brief."
              />
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 text-sm text-muted">
                {[
                  "Residential & commercial expertise",
                  "Tailored material guidance",
                  "Clean, careful installation",
                  "Reliable communication",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-line pb-3">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-ivory">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-navy px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 rounded-[32px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Contact</p>
                <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">Let’s talk about your next surface.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                  Share your plans, material preferences or project requirements and we’ll get back to you with the next steps.
                </p>
              </div>

              <div className="min-w-0 grid gap-4 border-line sm:rounded-[24px] sm:border sm:p-5">
                <a href={`mailto:${siteConfig.email}`} className="flex flex-col items-start gap-3 rounded-2xl border border-line p-4 sm:flex-row sm:items-center transition hover:border-gold hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ivory">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Email</span>
                    <span className="mt-1 block text-sm font-semibold text-ivory">{siteConfig.email}</span>
                  </span>
                </a>

                <a href="#" className="flex flex-col items-start gap-3 rounded-2xl border border-line p-4 sm:flex-row sm:items-center transition hover:border-gold hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ivory">
                    <MapPin size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Service area</span>
                    <span className="mt-1 block text-sm font-semibold text-ivory">{siteConfig.serviceArea}</span>
                  </span>
                </a>

                <WhatsAppButton className="w-full justify-center" variant="dark">
                  Enquire on WhatsApp <ArrowUpRight size={16} />
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}