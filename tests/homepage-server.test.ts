import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultHomepage } from "@/lib/homepage-content";

const mock = vi.hoisted(() => ({ client: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mock.client }));
vi.mock("next/cache", () => ({ revalidatePath: mock.revalidate }));
import { getAdminClient } from "@/lib/admin";
import { saveHomepage } from "@/app/admin/homepage/actions";
import { POST } from "@/app/api/admin/homepage/images/route";
import { getHomepage } from "@/lib/homepage";

function client(admin = true) {
  const row = { content: structuredClone(defaultHomepage), revision: 1 };
  const query = { select: vi.fn(), eq: vi.fn(), update: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: row, error: null }) };
  query.select.mockReturnValue(query); query.eq.mockReturnValue(query); query.update.mockReturnValue(query);
  const access = { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: admin ? { user_id: "admin" } : null, error: null }) };
  access.select.mockReturnValue(access); access.eq.mockReturnValue(access);
  const bucket = { list: vi.fn().mockResolvedValue({ data: [], error: null }), upload: vi.fn().mockResolvedValue({ error: null }), getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "/image.jpg" } }) };
  const value = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin" } }, error: null }) }, from: vi.fn((table: string) => table === "admin_users" ? access : query), storage: { from: vi.fn().mockReturnValue(bucket) } };
  mock.client.mockResolvedValue(value);
  return { value, query, bucket };
}
beforeEach(() => { vi.clearAllMocks(); });
const request = (bytes = new Uint8Array([255, 216, 255, 0]), type = "image/jpeg", origin = "http://localhost:3000") => new Request("http://localhost:3000/api/admin/homepage/images", { method: "POST", headers: { origin, "content-type": type }, body: new Blob([bytes]) });

describe("server authorisation and publication", () => {
  it("denies missing sessions and authenticated non-admins", async () => {
    mock.client.mockResolvedValue(null);
    expect(await getAdminClient()).toBeNull();
    expect((await saveHomepage({})).error).toMatch(/authorised/);
    client(false);
    expect(await getAdminClient()).toBeNull();
    expect((await POST(request())).status).toBe(403);
  });
  it("fails closed when Auth reports an error", async () => {
    const { value } = client();
    value.auth.getUser.mockResolvedValue({ data: { user: { id: "admin" } }, error: new Error("invalid token") });
    expect(await getAdminClient()).toBeNull();
  });
  it("validates, publishes a single content snapshot and invalidates the homepage", async () => {
    const { query } = client();
    const result = await saveHomepage({ content: defaultHomepage, revision: 0 });
    expect(result.revision).toBe(1);
    expect(query.eq).toHaveBeenCalledWith("revision", 0);
    expect(query.update).toHaveBeenCalledWith({ content: defaultHomepage });
    expect(mock.revalidate).toHaveBeenCalledWith("/");
    expect((await saveHomepage({ content: {}, revision: 1 })).error).toBeTruthy();
  });
  it("keeps publication unchanged on stale revisions, database errors and missing uploads", async () => {
    const { query } = client();
    query.maybeSingle.mockResolvedValue({ data: null, error: null });
    expect((await saveHomepage({ content: defaultHomepage, revision: 0 })).error).toMatch(/changed/);
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: "offline" } });
    expect((await saveHomepage({ content: defaultHomepage, revision: 0 })).error).toMatch(/Unable to save/);
    const content = structuredClone(defaultHomepage);
    content.hero.image = { path: "homepage/00000000-0000-0000-0000-000000000001.jpg", alt: "Kitchen", x: 50, y: 50 };
    expect((await saveHomepage({ content, revision: 0 })).error).toMatch(/missing/);
  });
  it("returns defaults if the migration or content is missing", async () => {
    const { query } = client();
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: "table missing" } });
    expect(await getHomepage()).toMatchObject({ available: false, content: defaultHomepage });
  });
});

describe("image upload endpoint", () => {
  it("checks origin, size, MIME and bytes before uploading", async () => {
    const { bucket } = client();
    expect((await POST(request(undefined, undefined, "https://other.example"))).status).toBe(403);
    expect((await POST(request(undefined, "image/svg+xml"))).status).toBe(400);
    expect((await POST(request(new Uint8Array([1, 2, 3])))).status).toBe(400);
    expect((await POST(request(new Uint8Array(4 * 1024 * 1024 + 1)))).status).toBe(413);
    expect(bucket.upload).not.toHaveBeenCalled();
  });
  it("uploads immutable unique paths in the existing bucket and handles failures", async () => {
    const { value, bucket } = client();
    const response = await POST(request());
    expect(response.status).toBe(201);
    expect((await response.json()).path).toMatch(/^homepage\/.+\.jpg$/);
    expect(value.storage.from).toHaveBeenCalledWith("product-images");
    expect(bucket.upload).toHaveBeenCalledWith(expect.stringMatching(/^homepage\//), expect.any(File), { contentType: "image/jpeg", upsert: false });
    bucket.upload.mockResolvedValue({ error: { message: "failed" } });
    expect((await POST(request())).status).toBe(500);
  });
});
