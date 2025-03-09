import type { FormField } from "@repo/schema-types/types";
import { useFormData } from "./use-form-data";
import { useQueryState } from "nuqs";
import { encodeJsonData } from "@/utils/formEncoder";

export function useFieldAction({ field }: { field: FormField }) {
    const form = useFormData();
    const [_, setEncondedForm] = useQueryState("form");

    function removeField() {
        const newForm = {
            ...form,
            fields: form.fields.filter((f) => f.id !== field.id),
        };

        const encodeNewForm = encodeJsonData(newForm);
        setEncondedForm(encodeNewForm);

        return newForm;
    }

    function dublicateField() {
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
