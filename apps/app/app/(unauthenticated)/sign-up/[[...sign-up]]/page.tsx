import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import SocialLogin from '../../_components/social-login';
import Link from 'next/link';

const title = 'Create an account';
const description = 'Enter your details to get started.';
const SignUp = dynamic(() =>
  import('../../_components/sign-up-form').then((mod) => mod.SignupForm)
);

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
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

    <SignUp />
    <p className="text-muted-foreground text-sm">
      Already have an account?{' '}
      <Link
        href="/sign-in"
        className="text-primary underline-offset-2 hover:underline"
      >
        Sign in
      </Link>
    </p>
  </>
);

export default SignUpPage;
