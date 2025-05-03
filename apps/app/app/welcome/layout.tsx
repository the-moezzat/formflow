import { env } from '@/env';
import Image from 'next/image';
import Link from 'next/link';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-between p-4">
      <Image src="/logo-full.png" alt="logo" width={100} height={24} />
      <div className="relative p-6">
        <div className="pointer-events-none absolute inset-0">
          {/* Left vertical line */}
          <div
            className="absolute inset-y-0 my-[-5rem] w-px"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent, white 5rem, white calc(100% - 5rem), transparent)',
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <title>Vertical dashed line</title>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          {/* Right vertical line */}
          <div
            className="absolute inset-y-0 right-0 my-[-5rem] w-px"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent, white 5rem, white calc(100% - 5rem), transparent)',
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <title>Vertical dashed line</title>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          {/* Top horizontal line */}
          <div
            className="absolute inset-x-0 top-0 mx-[-5rem] h-px"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, white 5rem, white calc(100% - 5rem), transparent)',
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <title>Horizontal dashed line</title>
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          {/* Bottom horizontal line */}
          <div
            className="absolute inset-x-0 bottom-0 mx-[-5rem] h-px"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, white 5rem, white calc(100% - 5rem), transparent)',
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <title>Horizontal dashed line</title>
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
        </div>
        {children}
      </div>
      <footer className="text-gray-600 text-sm">
        © 2025 Formflow |{' '}
        <Link
          href={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{' '}
        |{' '}
        <Link
          href={new URL('/legal/privacy', env.NEXT_PUBLIC_WEB_URL).toString()}
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}

export default Layout;
