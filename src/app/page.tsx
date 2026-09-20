import { ArrowDownRight, ArrowUpRight, Building2, Check, Gem, Hammer, Layers3, Mail, MapPin, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { FloatingWhatsApp, WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedProjects } from "@/lib/projects";
import { getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/constants";

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

const materials = [
  {
    name: "Granite",
    eyebrow: "Natural character",
    copy: "Distinctive movement, strength and depth for kitchens, bathrooms and statement surfaces.",
    texture: "bg-[radial-gradient(circle_at_20%_25%,#c3beae_0_1px,transparent_1px),radial-gradient(circle_at_70%_68%,#67645d_0_1px,transparent_1px)] bg-[length:18px_18px] bg-[#5d5d56]",
  },
  {
    name: "Quartz",
    eyebrow: "Clean performance",
    copy: "Consistent, low-maintenance surfaces chosen for practical, modern living and working spaces.",
    texture: "bg-[linear-gradient(130deg,transparent_0_48%,#f3efe7_49%_50%,transparent_51%_100%)] bg-[#d7d0c5] bg-[length:40px_40px]",
  },
  {
    name: "Sintered Stone",
    eyebrow: "Refined surfaces",
    copy: "Engineered stone with a sleek architectural finish for demanding, high-use environments.",
    texture: "bg-[linear-gradient(145deg,transparent_0_46%,#a49b8f_47%_48%,transparent_49%_100%)] bg-[#e3ddd1] bg-[length:54px_36px]",
  },
];

export default async function Home() {
  const products = await getProducts();
  const featuredProjects = await getFeaturedProjects(6);
  const heroProject = featuredProjects[0];
  const heroImage = heroProject?.project_images?.[0]?.image_url;

  return (
    <>
      <Header />
      <main id="home">
        <section className="relative overflow-hidden bg-[#20211f] pt-[72px] text-[#f7f4ee] sm:pt-[76px] lg:pt-[82px]">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_28%,#b9b0a0_29%,transparent_30%),linear-gradient(20deg,transparent_52%,#77756d_53%,transparent_54%)] [background-size:440px_290px,620px_420px]" />
          <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-end gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-10 lg:pb-24 lg:pt-20">
            <div className="max-w-3xl">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#c6a77a]">{siteConfig.name}</p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.96] text-white sm:text-6xl lg:text-[5.7rem]">
                Granite • Quartz • <span className="text-[#c6a77a]">Sintered Stone</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#c9c4ba] sm:text-lg">
                Stone surfaces for kitchens, bathrooms and commercial spaces in Cape Town and surrounding areas.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton variant="light">
                  Request a quote <ArrowUpRight size={16} />
                </WhatsAppButton>
                <Link
                  href="/#products"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-[#f7f4ee] transition hover:border-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]"
                >
                  Explore surfaces <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#d6d1c7]">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-[#c6a77a]" aria-hidden="true" /> {siteConfig.serviceArea}
                </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a77a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20211f]"
                >
                  <Mail size={15} className="text-[#c6a77a]" aria-hidden="true" /> {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="mt-3 w-full max-w-[540px] justify-self-center pb-5 lg:mt-0 lg:justify-self-end">
              <div className="relative aspect-[4/5] w-full border border-white/15 bg-[#2a2b28] p-3 shadow-[0_36px_80px_rgba(0,0,0,0.25)] sm:p-4">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={heroProject?.project_images?.[0]?.alt_text ?? heroProject?.title ?? "Cape Counter Tops completed project"}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1023px) 100vw, 42vw"
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_22%_18%,#d5d0c6_0_1px,transparent_1px),radial-gradient(circle_at_72%_62%,#6f7167_0_1px,transparent_1px)] bg-[length:22px_22px] bg-[#555952]" aria-label="Project photography currently unavailable" />
                )}
                <div className="absolute -bottom-5 left-5 bg-[#c6a77a] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#20211f] sm:left-6 sm:px-5 sm:text-xs">
                  Custom fabrication
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#dcd8cf] bg-[#f7f4ee]">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-10">
            <div>
              <p className="font-serif text-xl text-[#272824]">01 / Material selection</p>
              <p className="mt-2 text-sm leading-6 text-[#5f5a52]">A considered range of granite, quartz and sintered stone surfaces.</p>
            </div>
            <div>
              <p className="font-serif text-xl text-[#272824]">02 / Fabrication</p>
              <p className="mt-2 text-sm leading-6 text-[#5f5a52]">Measured, cut and finished with a sharp eye for detail.</p>
            </div>
            <div>
              <p className="font-serif text-xl text-[#272824]">03 / Installation</p>
              <p className="mt-2 text-sm leading-6 text-[#5f5a52]">Clean, careful completion from the first cut to final handover.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#f3efe9] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
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
                    className="group block overflow-hidden border border-[#d8d2c8] bg-[#f7f4ee] transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]"
                  >
                    <div className="relative aspect-[1.15] overflow-hidden bg-[#d9d1c5]">
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
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[#716e66]">
                          Project
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a17e4f]">{project.project_type}</p>
                      <h3 className="font-serif text-2xl leading-tight text-[#272824]">{project.title}</h3>
                      <div className="text-sm text-[#5f5a52]">
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#22211f] px-5 text-sm font-semibold text-[#20211f] transition hover:bg-[#20211f] hover:text-[#f7f4ee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]"
              >
                View all projects <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section id="materials" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <SectionHeading
            eyebrow="The material library"
            title="A surface for every design."
            description="From natural stone character to sleek engineered finishes, we help you choose a surface that suits the space and daily use."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {materials.map((material) => (
              <div key={material.name} className="group">
                <div className={`aspect-[0.82] overflow-hidden ${material.texture}`} aria-hidden="true" />
                <div className="border-b border-[#d7d2c8] py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a17e4f]">{material.eyebrow}</p>
                  <h3 className="mt-2 font-serif text-3xl text-[#272824]">{material.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#716e66]">{material.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="bg-[#ebe7df] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
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
            <div className="grid grid-cols-1 border-t border-[#d7d2c8] sm:grid-cols-2">
              {services.map(([name, Icon]) => (
                <div key={name} className="flex items-center gap-4 border-b border-[#d7d2c8] py-5">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#e8e2d7] text-[#a17e4f]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-[#272824]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#d8d1c4] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="border border-[#aaa194] bg-[#f7f4ee] p-4 shadow-sm">
              <div className="flex min-h-[330px] items-end bg-[#bfb5a2] p-7 sm:min-h-[420px]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4f4a44]">Our focus</p>
                  <p className="mt-3 max-w-sm font-serif text-4xl leading-tight text-[#272824]">
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
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 text-sm text-[#575247]">
                {[
                  "Residential & commercial expertise",
                  "Tailored material guidance",
                  "Clean, careful installation",
                  "Reliable communication",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-[#afa79a] pb-3">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#20211f] text-[10px] font-bold text-[#f7f4ee]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#f7f4ee] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 rounded-[32px] border border-[#d8d2c8] bg-[#f1ece4] p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a17e4f]">Contact</p>
                <h2 className="mt-4 font-serif text-4xl text-[#20211f] sm:text-5xl">Let’s talk about your next surface.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#575247]">
                  Share your plans, material preferences or project requirements and we’ll get back to you with the next steps.
                </p>
              </div>

              <div className="grid gap-4 rounded-[24px] border border-[#d1cabd] bg-white p-5 shadow-sm">
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 rounded-2xl border border-[#e4dfd4] p-4 transition hover:border-[#c6a77a] hover:bg-[#f7f4ee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#efe8dc] text-[#20211f]">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a7067]">Email</span>
                    <span className="mt-1 block text-sm font-semibold text-[#20211f]">{siteConfig.email}</span>
                  </span>
                </a>

                <a href="#" className="flex items-center gap-3 rounded-2xl border border-[#e4dfd4] p-4 transition hover:border-[#c6a77a] hover:bg-[#f7f4ee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a77a]">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#efe8dc] text-[#20211f]">
                    <MapPin size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a7067]">Service area</span>
                    <span className="mt-1 block text-sm font-semibold text-[#20211f]">{siteConfig.serviceArea}</span>
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