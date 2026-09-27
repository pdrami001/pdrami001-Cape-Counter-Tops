// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";
import { defaultHomepage, getHomepageFallbacks, homepageSlots, type HomepageContent } from "@/lib/homepage-content";

const mocks = vi.hoisted(() => ({ save: vi.fn(), upload: vi.fn() }));
vi.mock("@/app/admin/homepage/actions", () => ({ saveHomepage: mocks.save }));
vi.mock("@/lib/homepage-upload", () => ({ uploadHomepageImage: mocks.upload }));
vi.mock("next/image", () => ({ default: (props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; unoptimized?: boolean }) => {
  const { fill, unoptimized, ...rest } = props;
  void fill; void unoptimized;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...rest} />;
} }));
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { HomepagePhoto } from "@/components/homepage/photo";

const fallbacks = getHomepageFallbacks([], { title: "Original project", project_images: [{ image_url: "/fallback.jpg", alt_text: "Original project" }] });
const renderEditor = (content = structuredClone(defaultHomepage)) => render(<HomepageEditor initial={{ content, revision: 0, available: true }} fallbacks={fallbacks} />);
beforeEach(() => {
  vi.clearAllMocks(); sessionStorage.clear();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
  URL.createObjectURL = vi.fn().mockReturnValue("blob:preview"); URL.revokeObjectURL = vi.fn();
  window.Image.prototype.decode = vi.fn().mockResolvedValue(undefined);
  mocks.upload.mockImplementation(async (_file, progress) => { progress(100); return "homepage/00000000-0000-0000-0000-000000000001.jpg"; });
  mocks.save.mockImplementation(async ({ content }: { content: HomepageContent }) => ({ content, revision: 1 }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("homepage editor interactions", () => {
  it.each(homepageSlots)("uploads, replaces, positions and removes the %s image independently", async (slot) => {
    const user = userEvent.setup(); renderEditor();
    const name = slot === "hero" ? "Hero" : defaultHomepage.materials[slot].title;
    await user.upload(screen.getByLabelText(`Upload ${name} image`), new File(["image"], "photo.jpg", { type: "image/jpeg" }));
    await screen.findByLabelText(`Replace ${name} image`);
    await user.upload(screen.getByLabelText(`Replace ${name} image`), new File(["replacement"], "next.png", { type: "image/png" }));
    await waitFor(() => expect(mocks.upload).toHaveBeenCalledTimes(2));
    await waitFor(() => expect((screen.getByRole("button", { name: "Save Changes" }) as HTMLButtonElement).disabled).toBe(false));
    await user.clear(screen.getByLabelText(`${name} image alt text`));
    await user.type(screen.getByLabelText(`${name} image alt text`), `${name} replacement photo`);
    fireEvent.change(screen.getByLabelText(new RegExp(`${name} horizontal position`)), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(new RegExp(`${name} vertical position`)), { target: { value: "75" } });
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    await screen.findByText("Changes saved. Your homepage is now published.");
    const saved = mocks.save.mock.calls[0][0].content as HomepageContent;
    const card = slot === "hero" ? saved.hero : saved.materials[slot];
    expect(card.image).toMatchObject({ x: 25, y: 75, alt: `${name} replacement photo`, path: expect.stringContaining("homepage/") });
    for (const other of homepageSlots.filter((key) => key !== slot)) expect(other === "hero" ? saved.hero : saved.materials[other]).toEqual(other === "hero" ? defaultHomepage.hero : defaultHomepage.materials[other]);
    await user.click(screen.getByRole("button", { name: `Remove ${name} image` }));
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(2));
    const removed = mocks.save.mock.calls[1][0].content as HomepageContent;
    expect((slot === "hero" ? removed.hero : removed.materials[slot]).image.path).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
  it("previews text, saves the snapshot and reloads published content", async () => {
    const user = userEvent.setup(); const view = renderEditor();
    await user.clear(screen.getByLabelText("Hero heading")); await user.type(screen.getByLabelText("Hero heading"), "A new stone story");
    await user.clear(screen.getByLabelText("Quartz title")); await user.type(screen.getByLabelText("Quartz title"), "Quartz collection");
    await user.click(screen.getByRole("button", { name: "Preview Changes" }));
    expect(screen.getByRole("heading", { name: "A new stone story" })).toBeTruthy();
    expect(mocks.save).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    await screen.findByText("Changes saved. Your homepage is now published.");
    const saved = mocks.save.mock.calls[0][0].content;
    view.unmount(); renderEditor(saved);
    expect((screen.getByLabelText("Hero heading") as HTMLInputElement).value).toBe("A new stone story");
    expect((screen.getByRole("button", { name: "Save Changes" }) as HTMLButtonElement).disabled).toBe(true);
  });
  it.each(homepageSlots)("edits the heading and description for %s independently", async (slot) => {
    const user = userEvent.setup(); renderEditor();
    const name = slot === "hero" ? "Hero" : defaultHomepage.materials[slot].title;
    const titleLabel = slot === "hero" ? "Hero heading" : `${name} title`;
    await user.clear(screen.getByLabelText(titleLabel));
    await user.type(screen.getByLabelText(titleLabel), `${name} updated`);
    await user.clear(screen.getByLabelText(`${name} description`));
    await user.type(screen.getByLabelText(`${name} description`), `${name} description updated`);
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    await screen.findByText("Changes saved. Your homepage is now published.");
    const saved = mocks.save.mock.calls[0][0].content as HomepageContent;
    const card = slot === "hero" ? saved.hero : saved.materials[slot];
    expect(card.title).toBe(`${name} updated`);
    expect(card.description).toBe(`${name} description updated`);
    for (const other of homepageSlots.filter((key) => key !== slot)) {
      expect(other === "hero" ? saved.hero : saved.materials[other]).toEqual(other === "hero" ? defaultHomepage.hero : defaultHomepage.materials[other]);
    }
  });
  it("discards changes, warns on navigation and retains edits after a failed save", async () => {
    const user = userEvent.setup(); renderEditor();
    await user.type(screen.getByLabelText("Hero heading"), " edited");
    vi.mocked(window.confirm).mockReturnValue(false);
    fireEvent.click(screen.getByRole("link", { name: "Inventory & Projects" }));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("unsaved"));
    mocks.save.mockResolvedValue({ error: "Connection unavailable" });
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    await screen.findByRole("alert");
    expect((screen.getByLabelText("Hero heading") as HTMLInputElement).value).toContain("edited");
    vi.mocked(window.confirm).mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: "Discard Changes" }));
    expect((screen.getByLabelText("Hero heading") as HTMLInputElement).value).toBe(defaultHomepage.hero.title);
    expect(sessionStorage.getItem("cape-counter-tops:homepage-draft:v1")).toBeNull();
  });
  it("recovers a draft after remount and validates oversized images", async () => {
    const user = userEvent.setup(); const view = renderEditor();
    await user.type(screen.getByLabelText("Granite eyebrow"), " updated");
    view.unmount(); renderEditor();
    expect(window.confirm).toHaveBeenCalledWith("Restore your unsaved homepage changes from this tab?");
    expect((screen.getByLabelText("Granite eyebrow") as HTMLInputElement).value).toContain("updated");
    const file = new File(["small"], "large.jpg", { type: "image/jpeg" }); Object.defineProperty(file, "size", { value: 5 * 1024 * 1024 });
    await user.upload(screen.getByLabelText("Upload Hero image"), file);
    expect(await screen.findByText("Images must be 4 MB or smaller.")).toBeTruthy();
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("warns before unloading with unsaved edits", async () => {
    const user = userEvent.setup(); renderEditor();
    await user.type(screen.getByLabelText("Hero heading"), " edited");
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
  it("retains edits when a revision conflict is returned", async () => {
    const user = userEvent.setup(); renderEditor();
    await user.type(screen.getByLabelText("Hero heading"), " revised");
    mocks.save.mockResolvedValue({ error: "The published homepage changed since you opened it. Reload the page to review the latest version before saving." });
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect((await screen.findByRole("alert")).textContent).toContain("changed since you opened it");
    expect((screen.getByLabelText("Hero heading") as HTMLInputElement).value).toContain("revised");
    expect((screen.getByRole("button", { name: "Save Changes" }) as HTMLButtonElement).disabled).toBe(false);
  });
  it("falls back when custom or fallback image URLs fail", () => {
    render(<HomepagePhoto image={{ path: "homepage/00000000-0000-0000-0000-000000000001.jpg", alt: "Custom", x: 20, y: 80 }} fallback={fallbacks.hero} texture="stone-granite" sizes="100vw" />);
    const image = screen.getByAltText("Custom");
    expect(image.style.objectPosition).toBe("20% 80%");
    fireEvent.error(image);
    const fallback = screen.getByAltText("Original project"); expect(fallback.getAttribute("src")).toBe("/fallback.jpg");
    fireEvent.error(fallback);
    expect(screen.queryByRole("img")).toBeNull();
  });
});
