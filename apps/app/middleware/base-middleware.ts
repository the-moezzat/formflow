import { env } from "@/env";
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from "@repo/security/middleware";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { authMiddleware } from "@repo/auth/middleware";

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

export function baseMiddleware(middleware: NextMiddleware): NextMiddleware {
  return (request: NextRequest, event: NextFetchEvent) => {
    securityHeaders();

    return authMiddleware(request);
  };
}
