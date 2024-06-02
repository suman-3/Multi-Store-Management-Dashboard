import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, "Price is required"),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  category: z.string().min(1),
  size: z.string().min(1),
  kitchen: z.string().min(1),
  cuisine: z.string().min(1),
  qty: z.coerce.number().optional(),
});
