import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      POSTGRES_PRISMA_URL: z.string().min(1).url(),
      POSTGRES_URL_NON_POOLING: z.string().min(1).url(),
    },
    runtimeEnv: {
      POSTGRES_PRISMA_URL: process.env.DATABASE_URL,
      POSTGRES_URL_NON_POOLING: process.env.DIRECT_URL,
    },
  });
