import { z } from "zod";


export const KitchenFormSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})