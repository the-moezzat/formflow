import '@repo/design-system/styles/globals.css';
import { env } from '@/env';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { showBetaFeature } from '@repo/feature-flags';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import { secure } from '@repo/security';
import type { ReactNode } from 'react';
import { PostHogIdentifier } from './components/posthog-identifier';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = async ({ children }: RootLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const betaFeature = await showBetaFeature();
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Formflow" />
      </head>
      <body>
        <DesignSystemProvider>
          {/* <SidebarProvider> */}
          {/* <GlobalSidebar> */}
          {betaFeature && (
            <div className="m-4 rounded-full bg-success p-1.5 text-center text-sm text-success-foreground">
              Beta feature now available
            </div>
          )}
          {children}
          {/* </GlobalSidebar> */}
          <PostHogIdentifier />
          {/* </SidebarProvider> */}
        </DesignSystemProvider>
        <Toolbar />
      </body>
    </html>
  );
};

export default RootLayout;
