import type { FormField } from "@repo/schema-types/types";
import { encodeJsonData } from "@/utils/formEncoder";
import { useFormflow } from "./use-formflow";

export function useFieldAction({ field }: { field: FormField }) {
    const { decodedFormData: form, updateForm: setEncondedForm } =
        useFormflow();

    function removeField() {
        const newForm = {
            ...form,
            fields: form?.fields.filter((f) => f.id !== field.id),
        };

        const encodeNewForm = encodeJsonData(newForm);
        setEncondedForm(encodeNewForm);

        return newForm;
    }

    function dublicateField() {
        if (!form) {
            return;
        }
        const newField = {
            ...field,
            id: `${field.id}-${Math.random()}`,
            name: `${field.name} Copy`,
        };

        const newForm = {
            ...form,
            fields: [...form.fields, newField],
        };

        const encodeNewForm = encodeJsonData(newForm);
        setEncondedForm(encodeNewForm);

        return newForm;
    }

    return {
        removeField,
        dublicateField,
    };
}
