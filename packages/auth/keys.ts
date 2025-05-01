import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      // CLERK_SECRET_KEY: z.string().min(1).startsWith("sk_"),
      // CLERK_WEBHOOK_SECRET: z.string().min(1).startsWith("whsec_").optional(),
      GITHUB_CLIENT_ID: z.string(),
      GITHUB_CLIENT_SECRET: z.string(),
      GOOGLE_CLIENT_ID: z.string(),
      GOOGLE_CLIENT_SECRET: z.string(),
      BETTER_AUTH_SECRET: z.string(),
      TURNSTILE_SECRET_KEY: z.string(),
    },
    client: {
      // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).startsWith("pk_"),
      // NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).startsWith("/"),
      // NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).startsWith("/"),
      // NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1).startsWith("/"),
      // NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1).startsWith("/"),
    },
    runtimeEnv: {
      // CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      // CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
      // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      //   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      // NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
      // NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
      // NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      //   process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
      // NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      //   process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    },
  });
