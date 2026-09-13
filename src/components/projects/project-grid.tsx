"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { projectTypeOptions } from "@/lib/constants";
import type { Project } from "@/types/project";
import { ProjectCard } from "@/components/projects/project-card";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [type, setType] = useState<"All" | Project["project_type"]>("All");

  const filtered = useMemo(() => {
    if (type === "All") return projects;
    return projects.filter((project) => project.project_type === type);
  }, [projects, type]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-y border-[#dcd8cf] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#7e796f]">
          <SlidersHorizontal size={15} />
          Filter projects
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "All", label: "All" },
            ...projectTypeOptions,
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value as "All" | Project["project_type"])}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition ${
                type === option.value ? "bg-[#20211f] text-white" : "border border-[#d0cbc1] text-[#716e66] hover:text-[#20211f]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[#cfc9bf] px-6 py-16 text-center">
          <h3 className="font-serif text-2xl text-[#272824]">No projects found.</h3>
          <p className="mt-2 text-sm text-[#716e66]">
            Our project gallery is being updated. Contact us on WhatsApp to see our latest work.
          </p>
        </div>
      )}
    </div>
  );
}
