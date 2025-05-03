import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
      PROJECT_ID: z.string(),
      REGION: z.string(),
    },
    runtimeEnv: {
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
      PROJECT_ID: process.env.PROJECT_ID,
      REGION: process.env.REGION,
    },
  });
