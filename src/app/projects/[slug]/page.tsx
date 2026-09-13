import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarRange, MapPin } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { getProjectBySlug } from "@/lib/projects";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.title} | Cape Counter Tops`,
    description: project.description ?? `View this completed ${project.project_type.toLowerCase()} installation by Cape Counter Tops.`,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const heroImage = project.project_images?.[0]?.image_url ?? null;
  const gallery = project.project_images ?? [];

  return (
    <>
      <Header />
      <main className="bg-[#f7f4ee] pt-[76px] text-[#272824]">
        <article className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-20">
          <div className="mb-10 flex items-center justify-between gap-4">
            <Link href="/projects" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f685f] hover:text-[#20211f]">
              ← Back to projects
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              {heroImage ? (
                <div className="relative aspect-[1.25] overflow-hidden border border-[#d8d2c8] bg-[#ebe5dd]">
                  <Image
                    src={heroImage}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                </div>
              ) : null}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a17e4f]">{project.project_type}</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{project.title}</h1>

              <div className="mt-6 space-y-3 text-sm text-[#5f5a52]">
                {project.material && <p><span className="font-semibold text-[#272824]">Material:</span> {project.material}</p>}
                {project.colour && <p><span className="font-semibold text-[#272824]">Colour:</span> {project.colour}</p>}
                {project.finish && <p><span className="font-semibold text-[#272824]">Finish:</span> {project.finish}</p>}
                {project.location && <p className="flex items-center gap-2"><MapPin size={14} className="text-[#a17e4f]" /> {project.location}</p>}
                {project.completed_at && <p className="flex items-center gap-2"><CalendarRange size={14} className="text-[#a17e4f]" /> Completed {formatDate(project.completed_at)}</p>}
              </div>

              {project.description && (
                <div className="mt-8 max-w-xl border-t border-[#d8d2c8] pt-6">
                  <p className="text-base leading-7 text-[#4c4942]">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          {gallery.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 font-serif text-3xl">Project gallery</h2>
              <ProjectGallery images={gallery} />
            </section>
          )}

          <section className="mt-16 border-t border-[#d8d2c8] pt-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a17e4f]">Like this project?</h2>
            <p className="mt-3 max-w-xl font-serif text-3xl leading-tight">Let us create something similar for your space.</p>
            <a
              href={createWhatsAppUrl(`Hi Cape Counter Tops, I saw your ${project.title} project on your website and would like a quote for something similar.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#20211f] px-5 text-sm font-semibold text-[#f7f4ee]"
            >
              Get a quote on WhatsApp <ArrowUpRight size={16} />
            </a>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
