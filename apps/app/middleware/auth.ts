import { clerkMiddleware, createRouteMatcher } from '@repo/auth/server';
import type { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

export const isProtectedRoute = createRouteMatcher(['(.*)/dashboard(.*)']);

export default function authMiddleware(
  middleware: NextMiddleware
): NextMiddleware {
  return (request: NextRequest, event: NextFetchEvent) => {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }

      // If user is signed in but has no organization, redirect to org creation

      // If user has an organization, allow them to proceed
      return await middleware(request, event);
    })(request as NextRequest, event);
  };
}
