import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

/*
 * FONT SELECTION EXPLANATION
 * ==========================
 * 
 * Geist Sans:
 * - Modern, clean sans-serif designed by Vercel
 * - Excellent readability on both light and dark backgrounds
 * - Optimized for UI with balanced letter spacing
 * - Variable font allows smooth weight transitions
 * 
 * Geist Mono:
 * - Monospace variant for technical data
 * - Perfect for train numbers, timestamps, codes
 * - Consistent width for data alignment
 * - Used sparingly for emphasis on technical info
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
 * METADATA CONFIGURATION
 * ======================
 * 
 * SEO-optimized metadata for better discoverability
 * Includes Open Graph and Twitter card support
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "RailBondhu - Track Bangladesh Trains in Real-Time",
  description: "RailBondhu helps you find trains, see live locations shared by passengers, and chat with fellow travelers. Never miss your train again.",
  keywords: ["Bangladesh Railway", "Train Tracking", "Live Train Location", "Bangladesh Trains", "RailBondhu"],
  authors: [{ name: "RailBondhu Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "RailBondhu - Real-Time Train Tracking",
    description: "Track Bangladesh trains in real-time with crowdsourced location data",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RailBondhu - Real-Time Train Tracking",
    description: "Track Bangladesh trains in real-time with crowdsourced location data",
  },
  formatDetection: {
    telephone: false,
  },
};

/*
 * ROOT LAYOUT
 * ===========
 * 
 * Theme Configuration:
 * - defaultTheme: "light" - Light theme is the primary experience
 * - enableSystem: true - Respects user's system preference
 * - attribute: "class" - Uses class-based theming
 * - disableTransitionOnChange: false - Smooth theme transitions
 * 
 * Why Light Theme as Default?
 * - Better for outdoor/daytime use (common for train travelers)
 * - Lower battery consumption on some screens
 * - Professional and clean appearance
 * - Easier to read in bright environments
 * - More accessible for users with certain visual impairments
 * 
 * suppressHydrationWarning:
 * - Prevents hydration mismatch warnings
 * - Required for next-themes to work properly
 * - Browser extensions may add attributes to html/body
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
