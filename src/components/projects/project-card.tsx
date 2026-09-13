import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  const coverImage = project.project_images?.[0]?.image_url ?? null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden border border-[#d8d2c8] bg-[#f7f4ee] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
    >
      <div className="relative aspect-[1.1] overflow-hidden bg-[#d8d1c4]">
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
          <div className="flex h-full items-center justify-center bg-[#ebe7df] text-xs font-semibold uppercase tracking-[0.2em] text-[#716e66]">
            Project
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a17e4f]">{project.project_type}</p>
        <h3 className="font-serif text-2xl leading-tight text-[#272824]">{project.title}</h3>
        <div className="text-sm text-[#5f5a52]">
          {project.material && <p>{project.material}</p>}
          {project.location && <p>{project.location}</p>}
        </div>
      </div>
    </Link>
  );
}
