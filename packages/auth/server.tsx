import {
  account,
  invitation,
  member,
  organization as organizationSchema,
  session,
  team,
  user,
  verification,
} from '../database/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { anonymous, captcha, organization } from 'better-auth/plugins';
import { database, eq } from '../database';
import { openAPI } from 'better-auth/plugins';
import { resend } from '@repo/email';
import ResetPasswordEmail from '@repo/email/templates/reset-password';
import VerifyEmail from '@repo/email/templates/verify-email';
import InviteUserEmail from '@repo/email/templates/invite-user';
import { keys } from './keys';
import { teamIconPlugin } from './plugins/team-icon-plugin';

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: 'pg',
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
      organization: organizationSchema,
      member: member,
      invitation: invitation,
      team: team,
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
    allowResetPassword: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Formflow Support <support@formflowai.me>',
        to: user.email,
        subject: 'Reset Password',
        react: (
          <ResetPasswordEmail
            userFirstname={user.name}
            resetPasswordLink={url}
          />
        ),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      await resend.emails.send({
        from: 'Formflow Support <support@formflowai.me>',
        to: user.email,
        subject: 'Verify Email',
        react: <VerifyEmail userFirstname={user.name} verificationLink={url} />,
      });
      // Implement your email sending logic here
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  plugins: [
    nextCookies(),
    organization({
      sendInvitationEmail: async (data) => {
        await resend.emails.send({
          from: 'Formflow <support@formflowai.me>',
          to: data.email,
          subject: `Join ${data.organization.name} on Formflow`,
          react: (
            <InviteUserEmail
              invitedByUsername={data.inviter.user.name}
              invitedByEmail={data.inviter.user.email}
              teamName={data.organization.name}
              inviteLink={`${process.env.NEXT_PUBLIC_APP_URL}/welcome/invite/${data.id}`}
            />
          ),
        });
      },
      teams: {
        enabled: true,
        allowRemovingAllTeams: false, // Optional: prevent removing the last team
      },
    }),
    anonymous(),
    openAPI(),
    teamIconPlugin(),
    captcha({
      provider: 'cloudflare-turnstile', // or google-recaptcha, hcaptcha
      secretKey: keys().TURNSTILE_SECRET_KEY,
    }),
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
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization ? organization.id : null,
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
    console.error('[DEBUG] Error finding active organization:', error);
    // Return null rather than letting the error propagate
    // so the auth flow can continue even if this fails
    return null;
  }
}
