import { z } from "zod";


export const CuisinesFormSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})