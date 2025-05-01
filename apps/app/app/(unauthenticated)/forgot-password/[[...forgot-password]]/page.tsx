import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const title = 'Forgot your password?';
const description = "Don't worry, just enter your email and we'll assist you.";
const SendResetEmail = dynamic(() =>
  import('./_components/send-reset-email').then((mod) => mod.SendResetEmail)
);

const ResetPasswordForm = dynamic(() =>
  import('./_components/reset-form').then((mod) => mod.ResetPasswordForm)
);

export const metadata: Metadata = createMetadata({ title, description });

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">{title}</h1>

        <p className="max-w-md text-muted-foreground text-sm">{description} </p>
      </div>

      {token ? <ResetPasswordForm /> : <SendResetEmail />}

      <p className="text-muted-foreground text-sm">
        Already part of the family?{' '}
        <Link
          href="/sign-in"
          className="text-primary underline-offset-2 hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </>
  );
}
