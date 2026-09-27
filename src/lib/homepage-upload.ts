import { homepageImageLimitMB } from "@/lib/homepage-content";
import { validateImageFile } from "@/lib/images";

export function uploadHomepageImage(file: File, progress: (percent: number) => void): Promise<string> {
  const error = validateImageFile(file, homepageImageLimitMB);
  if (error) return Promise.reject(new Error(error));
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/homepage/images");
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = 120_000;
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) progress(Math.round(event.loaded / event.total * 100)); };
    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status !== 201 || typeof result.path !== "string") throw new Error(result.error || "Image upload failed.");
        resolve(result.path);
      } catch (caught) { reject(caught instanceof Error ? caught : new Error("Image upload failed.")); }
    };
    xhr.onerror = () => reject(new Error("Connection lost. Your published image has not changed. Try again."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Please try again."));
    xhr.send(file);
  });
}
