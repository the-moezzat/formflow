import { generateReactHelpers } from "@repo/storage/client";

import type { router } from '@repo/design-system/lib/uploadthing';

export const { useUploadThing } = generateReactHelpers<typeof router>();
