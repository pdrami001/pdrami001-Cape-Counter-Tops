import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export function validateImageFile(file: Pick<File, "type" | "size">, limitMB = 5): string | null {
  if (!extensions[file.type]) return "Images must be JPG, PNG or WebP files.";
  if (!file.size) return "The image file is empty.";
  if (file.size > limitMB * 1024 * 1024) return `Images must be ${limitMB} MB or smaller.`;
  return null;
}
export function imageExtension(type: string) { return extensions[type]; }

export async function uploadStorageImage(client: SupabaseClient<Database>, bucket: string, path: string, file: File) {
  const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function matchesImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}
