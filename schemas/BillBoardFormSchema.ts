import { z } from "zod";


export const BillBoardFormSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})