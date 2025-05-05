import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { anonymousClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    plugins: [organizationClient(), anonymousClient()],
    fetchOptions: {
        onError: (context) => {
            const { response } = context;
            console.log('response', response);
            if (response.status === 429) {
                const retryAfter = response.headers.get("X-Retry-After");
                console.log(
                    `Rate limit exceeded. Retry after ${retryAfter} seconds`,
                );
            }
        },
    },
});
export const { signIn, signOut, signUp, useSession } = authClient;
