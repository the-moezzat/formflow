import { env } from '@/env';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Image from 'next/image';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div>
    <div className="grid min-h-svh lg:grid-cols-[2fr,3fr]">
      <div className="relative flex flex-col justify-between gap-4 p-6 md:p-10">
        <div className="flex justify-between gap-2 ">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <Image src="/logo-full.png" alt="Formflow" width={72} height={48} />
          </Link>

          <div className=" top-4 right-4">
            <ModeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-4/6 flex-col items-center gap-6">
            {children}
          </div>
        </div>

        <p className="px-8 text-center text-muted-foreground text-sm">
          By continuing, you agree to our{' '}
          <Link
            href={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href={new URL('/legal/privacy', env.NEXT_PUBLIC_WEB_URL).toString()}
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/img.jpg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
);

export default AuthLayout;
