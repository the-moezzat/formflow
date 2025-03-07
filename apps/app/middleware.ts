import { authMiddleware } from '@repo/auth/middleware';
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from '@repo/security/middleware';
import { env } from './env';
import { chain } from './utils/chain';
import type { NextMiddleware, NextRequest, NextFetchEvent } from 'next/server';
import { isProtectedRoute } from './middleware/auth';

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

export default chain([
  baseMiddleware,
  //  formMiddleware
]);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/:formId*',
  ],
};

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

// export function formMiddleware(middleware: NextMiddleware): NextMiddleware {
//   return async (request: NextRequest, event: NextFetchEvent) => {
//     const formRegex =
//       /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\?.*)?$/i;
//     const match = request.nextUrl.pathname.match(formRegex);

//     // Skip API routes
//     if (request.nextUrl.pathname.startsWith('/api/')) {
//       return middleware(request, event);
//     }

//     if (match && !request.nextUrl.searchParams.has('form')) {
//       const formId = match[1];

//       try {
//         // Use internal fetch to your own API
//         const apiUrl = new URL(`/api/get-form/${formId}`, request.url);
//         const response = await fetch(apiUrl);

//         if (response.ok) {
//           const data = await response.json();

//           if (data.encodedForm) {
//             const url = request.nextUrl.clone();
//             url.searchParams.set('form', data.encodedForm);
//             return NextResponse.rewrite(url);
//           }
//         }
//       } catch (error) {
//         console.error('Error in form middleware:', error);
//       }
//     }

//     return middleware(request, event);
//   };
// }
