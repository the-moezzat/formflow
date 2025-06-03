import type { InferSelectModel } from "@repo/database";
import type { form } from "@repo/database/schema";
import type z from "zod";
import type { formFieldSchema, formSchema } from "../schema";

export type FormField = z.infer<typeof formFieldSchema>;
export type GeneratedForm = z.infer<typeof formSchema>;
export type FormStyle = "card" | "multiple";

export type FormModel = InferSelectModel<typeof form>;
