"use server";

import { updateForm } from "@repo/database/services/form";
import { revalidatePath } from "next/cache";

export async function saveChange(
    { formId, newEncodedForm }: { formId: string; newEncodedForm: string },
) {
    const newForm = await updateForm({
        formId: formId,
        newEncodedForm: newEncodedForm,
    });

    revalidatePath(`/${formId}`);

    console.log(`Form updated successfully: ${formId}`);

    return newForm;
}
