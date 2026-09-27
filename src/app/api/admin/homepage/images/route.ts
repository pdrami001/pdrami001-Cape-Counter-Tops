import { getAdminClient } from "@/lib/admin";
import { homepageBucket, homepageImageLimitMB } from "@/lib/homepage-content";
import { imageExtension, matchesImageSignature, uploadStorageImage, validateImageFile } from "@/lib/images";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Cookie-authenticated uploads must originate from this site.
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid upload origin." }, { status: 403 });
  try {
    const client = await getAdminClient();
    if (!client) return Response.json({ error: "Sign in as an authorised administrator to upload images." }, { status: 403 });
    const type = request.headers.get("content-type") ?? "";
    const limit = homepageImageLimitMB * 1024 * 1024;
    if (!imageExtension(type)) return Response.json({ error: "Images must be JPG, PNG or WebP files." }, { status: 400 });
    if (Number(request.headers.get("content-length")) > limit) return Response.json({ error: `Images must be ${homepageImageLimitMB} MB or smaller.` }, { status: 413 });
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Choose an image." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) { await reader.cancel(); return Response.json({ error: `Images must be ${homepageImageLimitMB} MB or smaller.` }, { status: 413 }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const validation = validateImageFile({ size, type }, homepageImageLimitMB);
    if (validation || !matchesImageSignature(bytes, type)) return Response.json({ error: validation ?? "The image contents do not match its file type." }, { status: 400 });
    const path = `homepage/${crypto.randomUUID()}.${imageExtension(type)}`;
    await uploadStorageImage(client, homepageBucket, path, new File([bytes], path, { type }));
    return Response.json({ path }, { status: 201 });
  } catch {
    return Response.json({ error: "Image upload failed. Check your connection and Storage permissions, then try again." }, { status: 500 });
  }
}
