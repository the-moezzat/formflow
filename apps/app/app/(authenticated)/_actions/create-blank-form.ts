// action.ts
"use server";

import { auth } from "@repo/auth/server";
import { actionClient } from "@repo/design-system/lib/safe-action";
import { log } from "@repo/observability/log";
import { headers } from "next/headers";
import { createBlankFormSchema } from "../types/create-blank-form-schema";
import { createBlankForm } from "@repo/database/services/form";
import { revalidatePath } from "next/cache";

export const createBlankFormAction = actionClient
    .schema(createBlankFormSchema)
    .action(async ({ parsedInput }) => {
        // Check authentication for protected routes
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return {
                success: false,
                error: "Unauthorized",
                data: {},
            };
        }

        const { title, style } = parsedInput;

        try {
            const [form] = await createBlankForm({
                title,
                style,
                userId: session.user.id,
            });

            log.info("Form created successfully", {
                title,
                style,
                userId: session.user.id,
                formId: form.id,
            });

            // redirect(`/${form.id}`);

            // Revalidate paths if needed
            revalidatePath("/");

            // Return consistent response structure
            return {
                success: true,
                data: {
                    title,
                    style,
                    id: form.id,
                },
            };
        } catch (error) {
            log.error("Error creating blank form", {
                error: error instanceof Error ? error.message : "Unknown error",
                title,
                style,
                userId: session.user.id,
            });

            return {
                success: false,
                error: "Failed to create form",
                data: {},
            };
        }
    });
