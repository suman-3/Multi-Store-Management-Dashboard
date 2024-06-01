import { z } from "zod";

export const newStoreFromSchema = z.object({
  name: z.string().min(3, {
    message: "Store name should be minimum 3 characters",
  }),
});
