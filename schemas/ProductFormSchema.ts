import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, "Price is required"),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  category: z.string().min(1, "Category is required"),
  size: z.string().optional(),
  kitchen: z.string().optional(),
  cuisine: z.string().optional(),
  qty: z.coerce.number().optional(),
});
