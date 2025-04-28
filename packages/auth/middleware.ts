import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import type { Session } from "better-auth";
import { betterFetch } from "@better-fetch/fetch";

const isProtectedRoute = (request: NextRequest) => {
    return request.url.startsWith("/dashboard"); // change this to your protected route
};

export async function authMiddleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
            },
        },
    );

    if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isProtectedRoute(request) && !session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}
