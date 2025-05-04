import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const title = 'Reset your password';
const description = 'Please enter your new password below.';

const ResetPasswordForm = dynamic(() =>
  import('@repo/auth/components/reset-password-form').then(
    (mod) => mod.ResetPasswordForm
  )
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

      {token ? <ResetPasswordForm /> : <div>No token provided</div>}
    </>
  );
}
