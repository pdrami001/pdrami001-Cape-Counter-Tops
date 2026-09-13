export type ProjectType =
  | "Kitchen"
  | "Bathroom"
  | "Vanity"
  | "Kitchen Island"
  | "Fireplace"
  | "Feature Wall"
  | "Reception Counter"
  | "Commercial"
  | "Other";

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  display_order: number;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  project_type: ProjectType;
  material: string | null;
  colour: string | null;
  finish: string | null;
  location: string | null;
  featured: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  project_images?: ProjectImage[];
};
