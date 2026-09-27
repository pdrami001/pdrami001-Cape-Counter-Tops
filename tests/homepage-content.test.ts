import { describe, expect, it, vi } from "vitest";
import { defaultHomepage, getHomepageFallbacks, homepageSchema, materialKeys, resolveHomepageImage } from "@/lib/homepage-content";
import { matchesImageSignature, validateImageFile } from "@/lib/images";

describe("homepage content and fallbacks", () => {
  it("preserves defaults, category identity and featured-project fallback", () => {
    expect(homepageSchema.parse(defaultHomepage)).toEqual(defaultHomepage);
    const fallback = getHomepageFallbacks([{ category: "granite", name: "Sample", image_url: "/granite.jpg" }], { title: "Kitchen", project_images: [{ image_url: "/project.jpg", alt_text: "Kitchen island" }] });
    expect(resolveHomepageImage(defaultHomepage.hero.image, fallback.hero)).toEqual({ url: "/project.jpg", alt: "Kitchen island" });
    expect(fallback.granite.url).toBe("/granite.jpg");
    expect(fallback.quartz.url).toBeNull();
    expect(getHomepageFallbacks([]).hero.url).toBeNull();
  });
  it("custom images override fallbacks without changing products", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    const source = resolveHomepageImage({ path: "homepage/00000000-0000-0000-0000-000000000001.jpg", alt: "Custom", x: 20, y: 80 }, { url: "/project.jpg", alt: "Project" });
    expect(source.url).toContain("/product-images/homepage/");
    expect(source.alt).toBe("Custom");
    vi.unstubAllEnvs();
  });
  it("uses fallback alt text after a custom homepage image is removed", () => {
    expect(resolveHomepageImage({ path: null, alt: "Old custom image description", x: 20, y: 80 }, { url: "/project.jpg", alt: "Fallback project" })).toEqual({ url: "/project.jpg", alt: "Fallback project" });
  });
  it("rejects external URLs, missing cards, invalid positions and empty custom alt text", () => {
    for (const key of materialKeys) {
      const draft = structuredClone(defaultHomepage);
      draft.materials[key].image.path = "https://evil.example/file.jpg";
      expect(homepageSchema.safeParse(draft).success).toBe(false);
    }
    const draft = structuredClone(defaultHomepage);
    draft.hero.image.x = 101;
    expect(homepageSchema.safeParse(draft).success).toBe(false);
    draft.hero.image.x = 50;
    draft.hero.image.path = "homepage/00000000-0000-0000-0000-000000000001.jpg";
    expect(homepageSchema.safeParse(draft).success).toBe(false);
    expect(homepageSchema.safeParse({ ...defaultHomepage, materials: {} }).success).toBe(false);
  });
  it("validates image type, size, empty files and signatures", () => {
    expect(validateImageFile({ type: "image/jpeg", size: 100 }, 4)).toBeNull();
    expect(validateImageFile({ type: "image/svg+xml", size: 100 }, 4)).toBeTruthy();
    expect(validateImageFile({ type: "image/png", size: 4 * 1024 * 1024 + 1 }, 4)).toBeTruthy();
    expect(validateImageFile({ type: "image/webp", size: 0 }, 4)).toBeTruthy();
    expect(matchesImageSignature(new Uint8Array([255, 216, 255]), "image/jpeg")).toBe(true);
    expect(matchesImageSignature(new Uint8Array([1, 2, 3]), "image/jpeg")).toBe(false);
  });
});
