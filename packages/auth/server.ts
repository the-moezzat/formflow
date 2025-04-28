import {
    account,
    invitation,
    member,
    organization as organizationSchema,
    session,
    user,
    verification,
} from "@repo/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { database, eq } from "../database";
import { openAPI } from "better-auth/plugins"


export const auth = betterAuth({
    database: drizzleAdapter(database, {
        provider: "pg",
        schema: {
            user: user,
            session: session,
            account: account,
            verification: verification,
            organization: organizationSchema,
            member: member,
            invitation: invitation,
        },
    }),

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

    emailAndPassword: {
        enabled: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }) => {
            // Implement your email sending logic here
            console.log("Verification URL:", url);
            console.log("Verification token:", token);
        },
    },
    plugins: [
        nextCookies(),
        organization(), 
        openAPI(),
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds
        },
    },
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const organization = await getActiveOrganization(
                        session.userId,
                    );
                    return {
                        data: {
                            ...session,
                            activeOrganizationId: organization
                                ? organization.id
                                : null,
                        },
                    };
                },
            },
        },
    },
});

async function getActiveOrganization(userId: string) {
    try {
        const memberRecord = await database
            .select()
            .from(member)
            .where(eq(member.userId, userId))
            .orderBy(member.createdAt)
            .limit(1);

        if (!memberRecord || memberRecord.length === 0) {
            return null;
        }

        const org = await database
            .select()
            .from(organizationSchema)
            .where(eq(organizationSchema.id, memberRecord[0].organizationId))
            .limit(1);

        return org.length > 0 ? org[0] : null;
    } catch (error) {
        console.error("[DEBUG] Error finding active organization:", error);
        // Return null rather than letting the error propagate
        // so the auth flow can continue even if this fails
        return null;
    }
}
