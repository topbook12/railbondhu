/**
 * App Providers - Root Provider Wrapper
 * ======================================
 */

'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { UserProvider } from '@/hooks/use-user';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </UserProvider>
    </SessionProvider>
  );
}
