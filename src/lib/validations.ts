import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required").max(100),
  category: z.enum(["granite", "quartz", "sintered_stone"]),
  description: z.string().trim().min(10, "Add a short product description").max(500),
  colour: z.string().trim().max(60),
  finish: z.string().trim().max(60),
  in_stock: z.boolean(),
  featured: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
