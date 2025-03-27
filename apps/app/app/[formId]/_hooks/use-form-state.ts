import { decodeJsonData, encodeJsonData } from "@/utils/formEncoder";
import { useToast } from "@repo/design-system/hooks/use-toast";
import type {
    FormField,
    FormModel,
    GeneratedForm,
} from "@repo/schema-types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getForm } from "../_actions/get-form";
import { saveChange } from "../_actions/save-changes";

export default function useFormState() {
    const formId = useParams().formId as string;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isDirty, setIsDirty] = useState(false);
    const [localForm, setLocalForm] = useState<GeneratedForm | null>(null);
    const originalFormRef = useRef<GeneratedForm | null>(null);

    // Track if component is mounted to prevent state updates after unmount
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Fetch form data with better error handling
    const { data: form, isLoading, error: queryError, ...queryInfo } = useQuery(
        {
            queryKey: ["form", formId],
            queryFn: async () => {
                try {
                    const { data, error } = await getForm({ formId });

                    if (error) {
                        toast({
                            title: "Error loading form",
                            description: error.message ||
                                "Failed to load form data",
                            variant: "destructive",
                        });
                        throw error;
                    }

                    return data;
                } catch (error) {
                    // Log error for debugging
                    console.error("Form fetch error:", error);
                    throw error;
                }
            },
            staleTime: Number.POSITIVE_INFINITY,
            retry: 1,
        },
    );

    // Set up local form state when form data is loaded
    useEffect(() => {
        if (form?.encodedForm) {
            try {
                const decodedForm = decodeJsonData(
                    form.encodedForm,
                ) as GeneratedForm;

                // Use structuredClone for more efficient deep cloning
                setLocalForm(decodedForm);
                originalFormRef.current = structuredClone(decodedForm);
            } catch (error) {
                console.error("Error decoding form data:", error);
                toast({
                    title: "Error processing form",
                    description: "The form data appears to be corrupted",
                    variant: "destructive",
                });
            }
        }
    }, [form?.encodedForm, toast]);

    // Warn user about unsaved changes when navigating away
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue =
                    "You have unsaved changes. Are you sure you want to leave?";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    // Save form mutation with enhanced error handling
    const { mutate: saveForm, isPending: isSaving } = useMutation({
        mutationFn: async (formData: GeneratedForm) => {
            const encodedForm = encodeJsonData(formData);
            if (!form) throw new Error("Form not found");

            const updatedForm = await saveChange({
                formId,
                newEncodedForm: encodedForm,
            });

            return updatedForm;
        },
        onSuccess: (response) => {
            if (!isMounted.current) return;

            queryClient.invalidateQueries({ queryKey: ["form", formId] });

            if (localForm) {
                originalFormRef.current = structuredClone(localForm);
            }

            setIsDirty(false);

            toast({
                title: "Form saved",
                description: "Your form has been saved successfully",
                variant: "default",
            });
        },
        onError: (error: Error) => {
            if (!isMounted.current) return;

            toast({
                title: "Error saving form",
                description: error.message || "Failed to save form",
                variant: "destructive",
            });
        },
    });

    // Update form in cache and set local state with better error handling
    const handleUpdateForm = useCallback((newForm: GeneratedForm) => {
        try {
            setLocalForm(newForm);
            setIsDirty(true);

            const encodedNewForm = encodeJsonData(newForm);
            const oldForm = queryClient.getQueryData<FormModel>([
                "form",
                formId,
            ]);

            if (!oldForm) {
                console.warn(
                    "Cannot update form cache - no existing form found",
                );
                return;
            }

            queryClient.setQueryData<FormModel>(["form", formId], {
                ...oldForm,
                encodedForm: encodedNewForm,
            });
        } catch (error) {
            console.error("Error updating form:", error);
            toast({
                title: "Error updating form",
                description: "Failed to update the form. Please try again.",
                variant: "destructive",
            });
        }
    }, [formId, queryClient, toast]);

    // Auto-save with debounce
    const debouncedSave = useCallback(
        debounce((formData: GeneratedForm) => {
            if (isMounted.current) {
                saveForm(formData);
            }
        }, 2000),
        [], // Empty deps since we want to maintain the same debounced instance
    );

    // Helper functions for manipulating form fields
    const addField = useCallback((field: FormField) => {
        if (!localForm) {
            toast({
                title: "Cannot add field",
                description: "Form data is not loaded yet",
                variant: "destructive",
            });
            return;
        }

        const newForm = {
            ...localForm,
            fields: [...localForm.fields, field],
        };

        handleUpdateForm(newForm);
    }, [localForm, handleUpdateForm, toast]);

    const updateField = useCallback(
        (fieldId: string, updates: Partial<FormField>) => {
            if (!localForm) {
                toast({
                    title: "Cannot update field",
                    description: "Form data is not loaded yet",
                    variant: "destructive",
                });
                return;
            }

            const fieldExists = localForm.fields.some((field) =>
                field.id === fieldId
            );
            if (!fieldExists) {
                toast({
                    title: "Field not found",
                    description: `Cannot update field with ID ${fieldId}`,
                    variant: "destructive",
                });
                return;
            }

            const newForm = {
                ...localForm,
                fields: localForm.fields.map((field) =>
                    field.id === fieldId ? { ...field, ...updates } : field
                ),
            };

            handleUpdateForm(newForm);
        },
        [localForm, handleUpdateForm, toast],
    );

    const removeField = useCallback((fieldId: string) => {
        if (!localForm) {
            toast({
                title: "Cannot remove field",
                description: "Form data is not loaded yet",
                variant: "destructive",
            });
            return;
        }

        const newForm = {
            ...localForm,
            fields: localForm.fields.filter((field) => field.id !== fieldId),
        };

        handleUpdateForm(newForm);
    }, [localForm, handleUpdateForm, toast]);

    const moveField = useCallback(
        (fieldId: string, direction: "up" | "down") => {
            if (!localForm) {
                toast({
                    title: "Cannot move field",
                    description: "Form data is not loaded yet",
                    variant: "destructive",
                });
                return;
            }

            const fieldIndex = localForm.fields.findIndex((f) =>
                f.id === fieldId
            );
            if (fieldIndex === -1) {
                toast({
                    title: "Field not found",
                    description: `Cannot move field with ID ${fieldId}`,
                    variant: "destructive",
                });
                return;
            }

            const newFields = [...localForm.fields];

            if (direction === "up" && fieldIndex > 0) {
                [newFields[fieldIndex - 1], newFields[fieldIndex]] = [
                    newFields[fieldIndex],
                    newFields[fieldIndex - 1],
                ];
            } else if (
                direction === "down" && fieldIndex < newFields.length - 1
            ) {
                [newFields[fieldIndex], newFields[fieldIndex + 1]] = [
                    newFields[fieldIndex + 1],
                    newFields[fieldIndex],
                ];
            } else {
                return; // Can't move further
            }

            handleUpdateForm({
                ...localForm,
                fields: newFields,
            });
        },
        [localForm, handleUpdateForm, toast],
    );

    // New function: Duplicate a field
    const duplicateField = useCallback((fieldId: string) => {
        if (!localForm) {
            toast({
                title: "Cannot duplicate field",
                description: "Form data is not loaded yet",
                variant: "destructive",
            });
            return;
        }

        const fieldToDuplicate = localForm.fields.find((f) => f.id === fieldId);
        if (!fieldToDuplicate) {
            toast({
                title: "Field not found",
                description: `Cannot duplicate field with ID ${fieldId}`,
                variant: "destructive",
            });
            return;
        }

        // Create duplicate with new ID
        const duplicatedField = {
            ...structuredClone(fieldToDuplicate),
            id: `${fieldToDuplicate.id}_copy_${Date.now()}`,
            label: `${fieldToDuplicate.label} (Copy)`,
        };

        // Find index of the original field
        const fieldIndex = localForm.fields.findIndex((f) => f.id === fieldId);

        // Insert duplicate after the original
        const newFields = [...localForm.fields];
        newFields.splice(fieldIndex + 1, 0, duplicatedField);

        handleUpdateForm({
            ...localForm,
            fields: newFields,
        });
    }, [localForm, handleUpdateForm, toast]);

    // Reset form to last saved state
    const resetForm = useCallback(() => {
        if (originalFormRef.current) {
            setLocalForm(structuredClone(originalFormRef.current));
            handleUpdateForm(structuredClone(originalFormRef.current));
            setIsDirty(false);

            toast({
                title: "Form reset",
                description: "Form has been reset to the last saved state",
                variant: "default",
            });
        } else {
            toast({
                title: "Cannot reset form",
                description: "No saved state available",
                variant: "destructive",
            });
        }
    }, [handleUpdateForm, toast]);

    // Save the current form state
    const saveCurrentForm = useCallback(() => {
        if (localForm && isDirty) {
            saveForm(localForm);
        } else if (!localForm) {
            toast({
                title: "Cannot save form",
                description: "No form data to save",
                variant: "destructive",
            });
        } else if (!isDirty) {
            toast({
                title: "No changes to save",
                description: "The form has not been modified",
                variant: "default",
            });
        }
    }, [localForm, isDirty, saveForm, toast]);

    // Enable auto-save
    const enableAutoSave = useCallback(() => {
        if (localForm && isDirty) {
            debouncedSave(localForm);
        }
    }, [localForm, isDirty, debouncedSave]);

    // Check if there are unsaved changes
    const hasUnsavedChanges = useCallback(() => {
        return isDirty;
    }, [isDirty]);

    // Navigate away safely (checking for unsaved changes)
    const navigateAway = useCallback((path: string) => {
        if (isDirty) {
            const confirmLeave = window.confirm(
                "You have unsaved changes. Are you sure you want to leave?",
            );
            if (!confirmLeave) return;
        }
        router.push(path);
    }, [isDirty, router]);

    return {
        form: localForm,
        originalForm: form,
        isDirty,
        isSaving,
        isLoading,
        queryError,
        ...queryInfo,
        handleUpdateForm,
        saveForm: saveCurrentForm,
        resetForm,
        addField,
        updateField,
        removeField,
        moveField,
        duplicateField, // New function
        enableAutoSave,
        hasUnsavedChanges,
        navigateAway, // New function
    };
}
