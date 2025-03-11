import { env } from "@/env";
import { createRouteMatcher } from "@repo/auth/server";
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from "@repo/security/middleware";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { authMiddleware } from "@repo/auth/middleware";

export const isProtectedRoute = createRouteMatcher(["(.*)/dashboard(.*)"]);

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

export function baseMiddleware(middleware: NextMiddleware): NextMiddleware {
  return (request: NextRequest, event: NextFetchEvent) => {
    return authMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
      securityHeaders();

      return await middleware(request, event);
    })(request as NextRequest, event);
  };
}
