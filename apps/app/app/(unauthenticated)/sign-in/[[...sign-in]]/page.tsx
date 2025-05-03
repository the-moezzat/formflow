import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SocialLogin from '../../_components/social-login';

const title = 'Login to your account';
const description = 'Enter your email below to login to your account.';
const SignIn = dynamic(() =>
  import('../../_components/sign-in').then((mod) => mod.SignIn)
);

export const metadata: Metadata = createMetadata({ title, description });

const SignInPage = () => (
  <>
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="font-bold text-2xl">{title}</h1>

      <p className="max-w-md text-muted-foreground text-sm">{description} </p>
    </div>

    <div className="w-full space-y-6 text-center">
      <SocialLogin />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>

    <SignIn />

    <div className="text-muted-foreground text-sm">
      Don&apos;t have an account?{' '}
      <Link
        href="/sign-up"
        className="text-primary underline-offset-2 hover:underline"
      >
        Sign up
      </Link>
    </div>
  </>
);

export default SignInPage;
