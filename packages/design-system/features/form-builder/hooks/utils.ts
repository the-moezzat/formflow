import { createFormHookContexts } from "@tanstack/react-form";

import { Input } from "@repo/design-system/components/ui/input";
import { createFormHook } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext, useFormContext } =
    createFormHookContexts();

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
    fieldComponents: {
        Input,
    },
    formComponents: {},
    fieldContext,
    formContext,
});

export {
    fieldContext,
    formContext,
    useAppForm,
    useFieldContext,
    useFormContext,
};
