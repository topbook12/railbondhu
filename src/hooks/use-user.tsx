/**
 * User Context and Hook for RailBondhu
 * =====================================
 * 
 * Provides user authentication state and user data throughout the app.
 */

'use client';

import { createContext, useContext, useMemo, ReactNode, useCallback } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  reputationScore: number;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Demo user for development (used when not authenticated)
const DEMO_USER: User = {
  id: 'demo-user',
  name: 'John',
  email: null,
  image: null,
  role: 'user',
  reputationScore: 850,
};

export function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession();
  
  // Derive loading state from session status
  const isLoading = status === 'loading';

  // Derive user from session or use demo user
  const user = useMemo(() => {
    if (status === 'authenticated' && session?.user) {
      return {
        id: session.user.id || 'demo-user',
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as { role?: string }).role || 'user',
        reputationScore: (session.user as { reputationScore?: number }).reputationScore || 0,
      };
    }
    // For demo purposes, return a mock user when not authenticated
    // In production, this would return null
    return DEMO_USER;
  }, [session, status]);

  const signIn = useCallback(async (name?: string) => {
    try {
      await nextAuthSignIn('credentials', {
        name: name || 'Guest User',
        redirect: false,
      });
    } catch {
      // Sign in will update the session, which updates the user
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await nextAuthSignOut({ redirect: false });
    } catch {
      // Ignore errors
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user && user.id !== 'demo-user',
    signIn,
    signOut,
  }), [user, isLoading, signIn, signOut]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default useUser;
