"use server";

import { decodeJsonData } from "@/utils/formEncoder";
import { database, eq } from "@repo/database";
import { form } from "@repo/database/schema";
import type { GeneratedForm } from "@repo/schema-types/types";

export async function loadVersions({ formId }: { formId: string }) {
    const [{ formHistory, currentForm }] = await database
        .select({
            formHistory: form.formHistory,
            currentForm: form.encodedForm,
        })
        .from(form)
        .where(eq(form.id, formId));

    const formVersions = [...(formHistory || []), currentForm].filter(Boolean);
    const uniqueFormVersions = [...new Set(formVersions)];

    return uniqueFormVersions
        .map((formVersion, idx) =>
            getFormMetadata({
                encodedForm: formVersion,
                idx,
                currentForm,
            })
        )
        .sort((a, b) => {
            if (!a.updatedAt || !b.updatedAt) {
                return 0;
            }
            return new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime();
        });
}

// export async function restoreVerstion(
//     { formId, versionIndex }: { formId: string; versionIndex: number },
// ) {
//     const versions = await loadVersions({ formId });

//     return form;
// }

function getFormMetadata({
    encodedForm,
    idx,
    currentForm,
}: { encodedForm: string; idx: number; currentForm: string }) {
    const form = decodeJsonData<GeneratedForm>(encodedForm);

    return {
        encodedForm,
        updatedAt: form.metadata?.updatedAt ?? "",
        versionIndex: idx,
        current: encodedForm === currentForm,
    };
}
