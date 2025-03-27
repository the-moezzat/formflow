"use server";

import { type Result, tryCatch } from "@/utils/trycatch";
import { database, eq } from "@repo/database";
import { form } from "@repo/database/schema";
import type { FormModel } from "@repo/schema-types/types";

export async function getForm({
    formId,
}: { formId: string }): Promise<Result<FormModel>> {
    if (!formId) {
        return { data: null, error: new Error("Missing form ID") };
    }

    const result = await tryCatch(
        database.select().from(form).where(eq(form.id, formId)),
    );

    if (result.error) {
        return { data: null, error: result.error };
    }

    const formData = result.data?.[0];
    if (!formData) {
        return { data: null, error: new Error("Form not found") };
    }

    return { data: formData, error: null };
}
