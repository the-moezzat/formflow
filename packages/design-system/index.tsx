'use client';
import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import type { ThemeProviderProps } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import ReactQueryProvider from './providers/react-query';

type DesignSystemProviderProperties = ThemeProviderProps;
export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ReactQueryProvider>
    <NuqsAdapter>
      <ThemeProvider {...properties}>
        <AuthProvider>
          <AnalyticsProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </AnalyticsProvider>
        </AuthProvider>
      </ThemeProvider>
    </NuqsAdapter>
  </ReactQueryProvider>
);
