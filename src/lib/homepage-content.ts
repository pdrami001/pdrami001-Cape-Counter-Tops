import { z } from "zod";

export const materialKeys = ["granite", "quartz", "sintered_stone"] as const;
export const homepageSlots = ["hero", ...materialKeys] as const;
export type MaterialKey = (typeof materialKeys)[number];
export type HomepageSlot = (typeof homepageSlots)[number];
export const homepageBucket = "product-images";
export const homepageImageLimitMB = 4;

const imageSchema = z.object({
  path: z.string().regex(/^homepage\/[0-9a-f-]{36}\.(jpg|png|webp)$/).nullable(),
  alt: z.string().trim().max(250),
  x: z.number().int().min(0).max(100),
  y: z.number().int().min(0).max(100),
}).strict();
const cardSchema = z.object({
  eyebrow: z.string().trim().max(100),
  title: z.string().trim().min(1, "A title is required.").max(140),
  description: z.string().trim().max(600),
  image: imageSchema,
}).strict();
export const homepageSchema = z.object({
  hero: cardSchema.extend({ label: z.string().trim().max(80) }),
  materials: z.object({ granite: cardSchema, quartz: cardSchema, sintered_stone: cardSchema }).strict(),
}).strict().superRefine((content, ctx) => {
  for (const slot of homepageSlots) {
    const card = slot === "hero" ? content.hero : content.materials[slot];
    if (card.image.path && !card.image.alt) ctx.addIssue({ code: "custom", path: slot === "hero" ? ["hero", "image", "alt"] : ["materials", slot, "image", "alt"], message: "Describe each custom image for screen readers." });
  }
});
export type HomepageContent = z.infer<typeof homepageSchema>;
export type HomepageCardContent = z.infer<typeof cardSchema>;
export type HomepageImage = HomepageCardContent["image"];
export type ImageSource = { url: string | null; alt: string };
export type HomepageFallbacks = Record<HomepageSlot, ImageSource>;
export type HomepageSnapshot = { content: HomepageContent; revision: number; available: boolean; error?: string };
const defaultImage: HomepageImage = { path: null, alt: "", x: 50, y: 50 };

export const defaultHomepage: HomepageContent = {
  hero: {
    eyebrow: "Custom Fabrication", title: "Granite · Quartz · Sintered Stone",
    description: "Stone surfaces for kitchens, bathrooms and commercial spaces in Cape Town and surrounding areas.",
    label: "Custom fabrication", image: { ...defaultImage },
  },
  materials: {
    granite: { eyebrow: "Natural character", title: "Granite", description: "Distinctive movement, strength and depth for kitchens, bathrooms and statement surfaces.", image: { ...defaultImage } },
    quartz: { eyebrow: "Clean performance", title: "Quartz", description: "Consistent, low-maintenance surfaces chosen for practical, modern living and working spaces.", image: { ...defaultImage } },
    sintered_stone: { eyebrow: "Refined surfaces", title: "Sintered Stone", description: "Engineered stone with a sleek architectural finish for demanding, high-use environments.", image: { ...defaultImage } },
  },
};

export function homepageImageUrl(path: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return path && base ? `${base}/storage/v1/object/public/${homepageBucket}/${path}` : null;
}

export function resolveHomepageImage(image: HomepageImage, fallback: ImageSource): ImageSource {
  return { url: homepageImageUrl(image.path) ?? fallback.url, alt: image.path ? image.alt || fallback.alt : fallback.alt };
}

// A category image is a separate reference. Products and projects are read only fallbacks.
export function getHomepageFallbacks(
  products: { category: string; name: string; image_url: string | null }[],
  project?: { title: string; project_images?: { image_url: string; alt_text: string | null }[] },
): HomepageFallbacks {
  const result = { hero: { url: project?.project_images?.[0]?.image_url ?? null, alt: project?.project_images?.[0]?.alt_text || project?.title || "Cape Counter Tops completed project" } } as HomepageFallbacks;
  for (const key of materialKeys) {
    const sample = products.find((product) => product.category === key && product.image_url);
    result[key] = { url: sample?.image_url ?? null, alt: sample ? `${defaultHomepage.materials[key].title}: ${sample.name}` : defaultHomepage.materials[key].title };
  }
  return result;
}
