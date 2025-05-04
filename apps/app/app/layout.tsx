import '@repo/design-system/styles/globals.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { extractRouterConfig } from '@repo/storage';
import { StorageSSRPlugin } from '@repo/storage/ssr';
import { router } from '@/utils/upload';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <head>
      <meta name="apple-mobile-web-app-title" content="Formflow" />
    </head>
    <body>
      <StorageSSRPlugin routerConfig={extractRouterConfig(router)} />

      <DesignSystemProvider>{children}</DesignSystemProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
