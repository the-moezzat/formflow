import {
    type NextFetchEvent,
    type NextMiddleware,
    type NextRequest,
    NextResponse,
} from "next/server";

const FORM_ID_REGEX =
    /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\?.*)?$/i;

interface FormResponse {
    form?: {
        encodedForm: string;
        settings?: {
            disableRedirect?: boolean;
        };
    };
    error?: {
        message: string;
        code: string;
    };
}

// Check if the request should skip form processing
function shouldSkipProcessing(request: NextRequest): boolean {
    return (
        request.nextUrl.pathname.startsWith("/api/") ||
        request.nextUrl.searchParams.has("form") ||
        request.cookies.has("__preview")
    );
}

// Extract form ID from the URL, returns null if no match
function extractFormId(request: NextRequest): string | null {
    const match = request.nextUrl.pathname.match(FORM_ID_REGEX);
    return match ? match[1] : null;
}

// Fetch form data from API
async function fetchFormData(
    request: NextRequest,
    formId: string,
): Promise<FormResponse> {
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const apiUrl = new URL(`/api/get-form/${formId}`, baseUrl);

    const response = await fetch(apiUrl.toString(), {
        cache: "no-store", // Ensure we get fresh data
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Form API error:", error);
        throw { status: response.status, message: "Failed to fetch form" };
    }

    return await response.json() as FormResponse;
}

// Check if redirect should be performed
function shouldRedirect(
    request: NextRequest,
    form: FormResponse["form"],
): boolean {
    return (
        form?.encodedForm !== undefined &&
        !form?.settings?.disableRedirect &&
        !request.nextUrl.searchParams.has("noRedirect")
    );
}

export function formMiddleware(middleware: NextMiddleware): NextMiddleware {
    return async (request: NextRequest, event: NextFetchEvent) => {
        try {
            if (shouldSkipProcessing(request)) {
                return middleware(request, event);
            }

            const formId = extractFormId(request);
            if (!formId) {
                return middleware(request, event);
            }

            try {
                const { form, error: formError } = await fetchFormData(
                    request,
                    formId,
                );

                if (formError) {
                    console.error("Form data error:", formError);
                    return NextResponse.json(
                        { error: formError.message },
                        { status: 400 },
                    );
                }

                if (!form?.encodedForm) {
                    return NextResponse.json(
                        { error: "Form not found" },
                        { status: 404 },
                    );
                }

                if (!shouldRedirect(request, form)) {
                    return middleware(request, event);
                }

                const redirectUrl = request.nextUrl.clone();
                redirectUrl.searchParams.set("form", form.encodedForm);

                return NextResponse.redirect(redirectUrl, {
                    status: 307, // Temporary redirect
                });
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            } catch (apiError: any) {
                return NextResponse.json(
                    { error: apiError.message || "API Error" },
                    { status: apiError.status || 500 },
                );
            }
        } catch (error) {
            console.error("Critical error in form middleware:", error);
            // Return a generic error response to avoid exposing internal details
            return NextResponse.json(
                { error: "An unexpected error occurred" },
                { status: 500 },
            );
        }
    };
}
