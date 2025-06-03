import { z } from "zod";

export const createBlankFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    style: z.enum(["card", "multiple"], {
        message: "Please select a form style",
    }),
});
