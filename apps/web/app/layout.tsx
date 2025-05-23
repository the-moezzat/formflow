import '@repo/design-system/styles/globals.css';
import './styles/web.css';
import { legal } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Toolbar as CMSToolbar } from '@repo/cms/components/toolbar';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(
      fonts,
      'scroll-smooth bg-gray-50 antialiased selection:bg-orange-100 selection:text-orange-600'
    )}
    suppressHydrationWarning
  >
    <head>
      <meta name="apple-mobile-web-app-title" content="Formflow" />
    </head>
    <body>
      <DesignSystemProvider>
        <Header />
        {children}
        <Feed queries={[legal.postsQuery]}>
          {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
          {async ([data]) => {
            'use server';
            return <Footer legalPostsMeta={data.legalPages.items} />;
          }}
        </Feed>
      </DesignSystemProvider>
      <Toolbar />
      <CMSToolbar />
    </body>
  </html>
);

export default RootLayout;
