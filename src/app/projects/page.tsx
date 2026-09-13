import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProjectGrid } from "@/components/projects/project-grid";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore previous Cape Counter Tops installations and transformed spaces.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main className="bg-[#f7f4ee] pt-[76px] text-[#272824]">
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a17e4f]">Our Work</p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">Spaces we&apos;ve transformed.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5f5a52]">
            Explore spaces transformed by Cape Counter Tops, from seamless kitchens to striking bathroom vanities and commercial stone installations.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          {projects.length ? (
            <ProjectGrid projects={projects} />
          ) : (
            <div className="border border-dashed border-[#cfc9bf] bg-[#f5f1ea] px-6 py-16 text-center">
              <h2 className="font-serif text-3xl">Our project gallery is being updated.</h2>
              <p className="mt-4 text-sm text-[#716e66]">
                Contact us on WhatsApp to see our latest work and request a quote.
              </p>
              <a
                href="https://wa.me/27816092933"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#20211f] px-5 text-sm font-semibold text-[#f7f4ee]"
              >
                Chat on WhatsApp <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
