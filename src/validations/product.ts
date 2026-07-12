import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  unitPrice: z.number().nonnegative(),
  pairPrice: z.number().nonnegative().optional(),
  promotionalPrice: z.number().nonnegative().optional(),
  sku: z.string().min(3),
  stockQuantity: z.number().int().nonnegative(),
  trackStock: z.boolean(),
  dimensions: z.string().min(3),
  weight: z.number().nonnegative(),
  materials: z.string().min(3),
  warranty: z.string().min(3),
  productionTime: z.string().min(3),
  featured: z.boolean(),
  active: z.boolean(),
  displayOrder: z.number().int().nonnegative(),
  metaTitle: z.string().min(3),
  metaDescription: z.string().min(3)
});
