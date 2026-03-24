/**
 * NextAuth.js Configuration for RailBondhu
 * ========================================
 *
 * This file configures authentication for the application.
 *
 * Supported Providers:
 * - Credentials (guest login for demo)
 * - Google OAuth (optional - requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
 * - Facebook OAuth (optional)
 */

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      reputationScore?: number;
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Note: PrismaAdapter is not used here to keep the demo simple
  // In production, uncomment the adapter and ensure proper database setup
  // adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Guest Login',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'Enter your name' },
      },
      async authorize(credentials) {
        if (!credentials?.name) {
          return null;
        }

        try {
          // For demo purposes, create or find a user by name
          // In production, you'd use proper email/password authentication
          let user = await db.user.findFirst({
            where: { name: credentials.name },
          });

          if (!user) {
            // Create a new user for demo
            user = await db.user.create({
              data: {
                name: credentials.name,
                role: 'user',
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatarUrl,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.name} (${user.id})`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Re-export for convenience
export default authOptions;
