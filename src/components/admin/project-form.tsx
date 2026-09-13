"use client";

import { LoaderCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { projectTypeOptions } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Project, ProjectImage } from "@/types/project";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 8 * 1024 * 1024;

type ProjectFormValues = {
  title: string;
  slug: string;
  description: string;
  project_type: Project["project_type"];
  material: string;
  colour: string;
  finish: string;
  location: string;
  featured: boolean;
  completed_at: string;
};

function getDefaultValues(project?: Project): ProjectFormValues {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    project_type: project?.project_type ?? "Kitchen",
    material: project?.material ?? "",
    colour: project?.colour ?? "",
    finish: project?.finish ?? "",
    location: project?.location ?? "",
    featured: project?.featured ?? false,
    completed_at: project?.completed_at ?? "",
  };
}

export function ProjectForm({ project, onSaved, onCancel }: { project?: Project; onSaved: (project: Project) => void; onCancel: () => void }) {
  const [values, setValues] = useState<ProjectFormValues>(getDefaultValues(project));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>(project?.project_images ?? []);

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    if (!nextFiles.length) return;

    const validFiles: File[] = [];
    for (const file of nextFiles) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!allowedTypes.includes(file.type) && !["jpg", "jpeg", "png", "webp"].includes(extension)) {
        setError("Please upload JPG, PNG or WebP images only.");
        return;
      }
      if (file.size > maxSize) {
        setError("Each image must be smaller than 8 MB.");
        return;
      }
      validFiles.push(file);
    }

    setQueuedFiles((current) => [...current, ...validFiles]);
    setError("");
    event.target.value = "";
  }

  async function removeExistingImage(image: ProjectImage) {
    const supabase = createSupabaseBrowserClient();
    const path = image.storage_path;
    if (path) {
      await supabase.storage.from("project-images").remove([path]);
    }
    const { error: removeError } = await supabase.from("project_images").delete().eq("id", image.id);
    if (removeError) {
      setError("Could not remove the selected project image.");
      return;
    }
    setExistingImages((current) => current.filter((item) => item.id !== image.id));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    const title = values.title.trim();
    const description = values.description.trim();
    if (!title) {
      setError("Project title is required.");
      return;
    }
    if (!values.project_type) {
      setError("Project type is required.");
      return;
    }
    if (!queuedFiles.length && !existingImages.length && !project) {
      setError("Add at least one project photo before saving.");
      return;
    }

    setPending(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const slugValue = (values.slug || title).trim();
      const nextSlug = slugify(slugValue) || `${Date.now().toString(36)}`;
      const projectPayload = {
        title,
        slug: nextSlug,
        description: description || null,
        project_type: values.project_type,
        material: values.material.trim() || null,
        colour: values.colour.trim() || null,
        finish: values.finish.trim() || null,
        location: values.location.trim() || null,
        featured: values.featured,
        completed_at: values.completed_at || null,
      };

      const { data: projectData, error: projectError } = project
        ? await supabase.from("projects").update(projectPayload).eq("id", project.id).select().single()
        : await supabase.from("projects").insert(projectPayload).select().single();

      if (projectError || !projectData) {
        throw new Error(projectError?.message ?? "Unable to save the project.");
      }

      const baseOrder = existingImages.length;
      for (const [index, file] of queuedFiles.entries()) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const storagePath = `projects/${projectData.id}/${crypto.randomUUID()}.${extension}`;
        const upload = await supabase.storage.from("project-images").upload(storagePath, file, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

        if (upload.error) {
          throw new Error(`Image upload failed: ${upload.error.message}`);
        }

        const publicUrl = supabase.storage.from("project-images").getPublicUrl(storagePath).data.publicUrl;
        const { error: imageError } = await supabase.from("project_images").insert({
          project_id: projectData.id,
          image_url: publicUrl,
          storage_path: storagePath,
          alt_text: title,
          display_order: baseOrder + index,
        });

        if (imageError) {
          throw new Error(imageError.message || "Unable to save the project image.");
        }
      }

      const { data: refreshedProject, error: refreshError } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .eq("id", projectData.id)
        .single();

      if (refreshError || !refreshedProject) {
        throw new Error(refreshError?.message ?? "Project saved but could not reload details.");
      }

      onSaved(refreshedProject as Project);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the project.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold sm:col-span-2">
          Project title*
          <input
            required
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold">
          Project type*
          <select
            value={values.project_type}
            onChange={(event) => update("project_type", event.target.value as Project["project_type"])}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          >
            {projectTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold">
          Project slug
          <input
            value={values.slug}
            onChange={(event) => update("slug", event.target.value)}
            placeholder={slugify(values.title) || "modern-kitchen"}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold">
          Material
          <input
            value={values.material}
            onChange={(event) => update("material", event.target.value)}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold">
          Colour
          <input
            value={values.colour}
            onChange={(event) => update("colour", event.target.value)}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold">
          Finish
          <input
            value={values.finish}
            onChange={(event) => update("finish", event.target.value)}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold sm:col-span-2">
          Location
          <input
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold sm:col-span-2">
          Description
          <textarea
            rows={5}
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            className="mt-2 w-full resize-y border border-[#d0cbc1] bg-white px-3 py-2 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="block text-sm font-semibold">
          Completed date
          <input
            type="date"
            value={values.completed_at}
            onChange={(event) => update("completed_at", event.target.value)}
            className="mt-2 h-11 w-full border border-[#d0cbc1] bg-white px-3 font-normal outline-none focus:border-[#9d784a]"
          />
        </label>

        <label className="flex items-center gap-3 pt-8 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="h-4 w-4 accent-[#20211f]"
          />
          Featured project
        </label>
      </div>

      <div className="rounded border border-dashed border-[#c3bdb2] bg-white p-4">
        <p className="text-sm font-semibold">Project photos*</p>
        <label className="mt-3 flex min-h-20 cursor-pointer items-center justify-center gap-2 border border-dashed border-[#c3bdb2] bg-[#f8f5f1] px-4 py-5 text-sm text-[#716e66] hover:border-[#9d784a]">
          <Upload size={17} />
          <span>Select multiple images</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFileInput} className="hidden" />
        </label>

        {(existingImages.length || queuedFiles.length) > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {existingImages.map((image) => (
              <div key={image.id} className="relative overflow-hidden border border-[#d8d2c8] bg-[#f1eee9]">
                <div className="relative aspect-[1.1]">
                  <Image src={image.image_url} alt={image.alt_text ?? "Project image"} fill unoptimized className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(image)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#20211f]/80 text-white"
                  aria-label="Remove existing project image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {queuedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative overflow-hidden border border-[#d8d2c8] bg-[#f1eee9]">
                <div className="relative aspect-[1.1]">
                  <Image src={URL.createObjectURL(file)} alt={file.name} fill unoptimized className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
                <button
                  type="button"
                  onClick={() => setQueuedFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#20211f]/80 text-white"
                  aria-label="Remove selected project image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="border border-[#d8b6ad] bg-[#f6e9e5] px-4 py-3 text-sm text-[#8a4d42]">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="h-11 px-5 text-sm font-semibold text-[#20211f]">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="flex h-11 items-center justify-center gap-2 bg-[#20211f] px-5 text-sm font-semibold text-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-70">
          {pending ? <><LoaderCircle size={16} className="animate-spin" /> Saving...</> : project ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
