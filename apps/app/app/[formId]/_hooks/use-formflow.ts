import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getForm } from "../_actions/get-form";
import type { FormModel, GeneratedForm } from "@repo/schema-types/types";
import { decodeJsonData } from "@/utils/formEncoder";
import { useEffect, useRef, useState } from "react";

export function useFormflow() {
    const formId = useParams().formId as string;
    const queryClient = useQueryClient();
    const originalFormRef = useRef<string | null>(null);
    const [isChanged, setIsChanged] = useState(false);

    const { data, ...queryState } = useQuery({
        queryKey: ["form", formId],
        queryFn: async () => {
            const { data, error } = await getForm({ formId });

            if (error) {
                throw error;
            }

            return data;
        },
        staleTime: Number.POSITIVE_INFINITY,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (originalFormRef.current === null && data?.encodedForm) {
            originalFormRef.current = data.encodedForm;
        }

        if (
            !queryState.isLoading &&
            originalFormRef.current !== data?.encodedForm
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [data?.encodedForm, originalFormRef.current]);

    const updateForm = (newEncodedform: string) => {
        const form = queryClient.getQueryData<FormModel>(["form", formId]);
        queryClient.setQueryData(["form", formId], {
            ...form,
            encodedForm: newEncodedform,
        });
    };

    const resetChangeState = () => {
        // Update originalFormRef to current form data
        if (data?.encodedForm) {
            originalFormRef.current = data.encodedForm;
        }
        // Reset change state
        setIsChanged(false);
    };

    const decodedFormData: GeneratedForm | null = queryState.isLoading
        ? null
        : decodeJsonData<GeneratedForm>(data?.encodedForm || "");

    return {
        formData: data,
        encodedFormData: data?.encodedForm,
        queryState,
        updateForm,
        decodedFormData,
        isChanged,
        resetChangeState, // Add the new function to the return object
    };
}
