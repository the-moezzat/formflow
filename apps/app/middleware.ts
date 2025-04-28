// import { chain } from "./utils/chain";
// import { baseMiddleware } from "./middleware/base-middleware";
// // import { formMiddleware } from "./middleware/form-redirect-middleware";

// // The formMiddleware is currently commented out and not included in the chain.
// export default chain([baseMiddleware]);

import { type NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from '@repo/auth';
import type { Session } from '@repo/auth';
import { betterFetch } from '@better-fetch/fetch';
import type { Organization } from 'better-auth/plugins/organization';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '', // Forward the cookies from the request
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const { data: organization } = await betterFetch<Organization[]>(
    '/api/auth/organization/list',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '', // Forward the cookies from the request
      },
    }
  );

    console.log(organization);


  if (request.nextUrl.pathname !== '/welcome' && organization?.length === 0) {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // '/(api|trpc)(.*)',
    // "/:formId*",
    '/',
    '/welcome',
  ],
};
