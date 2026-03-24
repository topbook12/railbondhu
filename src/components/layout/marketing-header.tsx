'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { 
  Train, 
  Menu, 
  X, 
  MapPin, 
  MessageCircle,
  ChevronRight,
  Navigation,
  Shield,
  Sun,
  Moon
} from 'lucide-react';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'About', href: '/about' },
  { name: 'Roadmap', href: '/roadmap' },
];

/*
 * MARKETING HEADER DESIGN - LIGHT THEME
 * =====================================
 * 
 * Visual Design:
 * - Clean white background with subtle shadow
 * - Glassmorphism effect on scroll
 * - Teal brand color for logo and accents
 * - Orange accent for primary CTA
 * 
 * Typography:
 * - Logo: Bold, 20px with teal accent on "Bondhu"
 * - Nav links: Medium weight, 14px, muted color
 * - Buttons: Medium weight with rounded corners
 * 
 * Layout:
 * - Fixed position for easy navigation
 * - Logo left, navigation center, CTAs right
 * - Mobile: Hamburger menu with slide-in panel
 * 
 * Color Psychology:
 * - White/Light background: Clean, trustworthy
 * - Teal: Technology, reliability, water/rivers
 * - Orange CTA: Energy, action, draws attention
 * 
 * Accessibility:
 * - High contrast text (dark on light)
 * - Clear focus states
 * - Keyboard navigable
 */

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch by only rendering theme toggle after mount
  // This is a standard pattern for next-themes
  useEffect(() => {
    // Using requestAnimationFrame to defer setState outside of effect sync execution
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-light">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Logo Icon - Teal gradient with subtle shadow */}
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                <Train className="w-5 h-5 text-white" />
              </div>
              {/* Logo Text - Bold with teal accent on "Bondhu" */}
              <span className="text-xl font-bold text-foreground">
                Rail<span className="text-primary">Bondhu</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            
            <Link href="/waitlist">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                Join Waitlist
              </Button>
            </Link>
            <Link href="/app">
              <Button size="sm" className="btn-primary text-white">
                Open App
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:items-center md:gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/waitlist" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Join Waitlist
                </Button>
              </Link>
              <Link href="/app" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full btn-primary text-white">
                  Open App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/*
 * HERO SECTION DESIGN - LIGHT THEME
 * =================================
 * 
 * Visual Hierarchy:
 * 1. Badge - Small label above heading (teal border)
 * 2. Main heading - Gradient text (teal to orange)
 * 3. Subheading - Muted color for secondary importance
 * 4. CTA buttons - Primary (orange) + Secondary (outline)
 * 5. Feature cards - Glass morphism with teal accents
 * 
 * Background:
 * - Subtle gradient from top (teal tint) to bottom
 * - Dot pattern for texture
 * - Creates depth without distraction
 * 
 * Color Choices:
 * - Gradient heading: Teal → Orange (brand colors)
 * - Primary CTA: Orange (draws eye, creates urgency)
 * - Secondary CTA: Outline (lower visual weight)
 * - Card backgrounds: White with subtle shadow
 * - Icon backgrounds: Teal at 10% opacity
 * 
 * Typography:
 * - Heading: Bold, tight tracking, responsive sizing
 * - Subheading: Medium weight, comfortable line height
 * - Feature titles: Semibold, dark color
 * - Feature descriptions: Regular, muted color
 */

export function MarketingHero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Background gradient - subtle teal tint from top */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      
      {/* Decorative dot pattern */}
      <div className="absolute inset-0 bg-dots-light pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge - small label above heading */}
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/5">
            Bangladesh Railway Tracking
          </Badge>
          
          {/* Main heading - gradient text */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Track Bangladesh</span>
            <br />
            <span className="gradient-text">Trains in Real-Time</span>
          </h1>
          
          {/* Subheading - value proposition */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            RailBondhu helps you find trains, see live locations shared by passengers, 
            and chat with fellow travelers. Never miss your train again.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="btn-accent text-white px-8">
                <MapPin className="mr-2 w-5 h-5" />
                Track a Train
              </Button>
            </Link>
            <Link href="/waitlist">
              <Button variant="outline" size="lg" className="border-border hover:bg-muted px-8">
                Join Waitlist
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards - quick overview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Navigation}
            title="Live Tracking"
            description="Real-time train location powered by crowdsourced GPS data"
          />
          <FeatureCard
            icon={MessageCircle}
            title="Train Chat"
            description="Connect with fellow passengers on your train"
          />
          <FeatureCard
            icon={Shield}
            title="Privacy First"
            description="Anonymous location sharing you control"
          />
        </div>
      </div>
    </section>
  );
}

// Feature Card Component
function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="card-light p-6 group cursor-pointer">
      <div className="w-14 h-14 rounded-xl icon-primary mb-4 group-hover:scale-105 transition-transform">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
