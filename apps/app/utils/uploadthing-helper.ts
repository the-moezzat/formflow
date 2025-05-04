import { generateReactHelpers } from "@repo/storage/client";

import type { router } from "@/utils/upload";

export const { useUploadThing } = generateReactHelpers<typeof router>();
