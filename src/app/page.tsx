'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MarketingHeader, 
  MarketingHero 
} from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Train,
  MapPin,
  MessageCircle,
  Clock,
  Shield,
  Users,
  Smartphone,
  Navigation,
  Star,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

/*
 * LANDING PAGE DESIGN - LIGHT THEME
 * =================================
 * 
 * COLOR PALETTE:
 * - Primary (Teal #0d9488): Trust, technology, rivers of Bangladesh
 * - Accent (Orange #ea580c): Energy, action, CTAs
 * - Background (#fafbfc): Soft white, reduces eye strain
 * - Card (#ffffff): Pure white for contrast
 * - Text: Dark slate for excellent readability
 * 
 * TYPOGRAPHY:
 * - Geist Sans: Clean, modern, excellent readability
 * - Headings: Bold, tight tracking
 * - Body: Normal weight, comfortable line height
 * 
 * SPACING:
 * - Sections: py-24 (96px vertical)
 * - Cards: p-6 (24px)
 * - Elements: gap-6 (24px)
 * 
 * VISUAL HIERARCHY:
 * 1. Hero (gradient text, CTAs)
 * 2. Stats (social proof)
 * 3. Features (grid of cards)
 * 4. How It Works (steps)
 * 5. Popular Routes (interactive cards)
 * 6. Testimonials (social proof)
 * 7. CTA (final conversion)
 */

const features = [
  {
    icon: MapPin,
    title: 'Live Train Tracking',
    description: 'See real-time train locations powered by passengers sharing their GPS. Know exactly where your train is.',
  },
  {
    icon: MessageCircle,
    title: 'Train Chat Rooms',
    description: 'Connect with fellow passengers on your train. Share updates, ask questions, and help each other.',
  },
  {
    icon: Clock,
    title: 'Accurate Schedules',
    description: 'Get accurate departure and arrival times for all Bangladesh Railway routes.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your location is shared anonymously. Turn off sharing anytime. No personal data exposed.',
  },
  {
    icon: Users,
    title: 'Crowdsourced Data',
    description: 'Data from multiple passengers is aggregated to give accurate, reliable train positions.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Designed for on-the-go use. Works great on any device, anywhere in Bangladesh.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Find Your Train',
    description: 'Search for your train by name, number, or route.',
    icon: Train,
  },
  {
    step: 2,
    title: 'Track Live Location',
    description: 'See where your train is right now on the map.',
    icon: Navigation,
  },
  {
    step: 3,
    title: 'Share Your Location',
    description: 'Optionally share your GPS to help others. Anonymous.',
    icon: MapPin,
  },
  {
    step: 4,
    title: 'Chat & Connect',
    description: 'Join the train chat and connect with travelers.',
    icon: MessageCircle,
  },
];

const popularRoutes = [
  { from: 'Dhaka', to: 'Chattogram', trains: 12, time: '5h 30m' },
  { from: 'Dhaka', to: 'Sylhet', trains: 8, time: '7h 15m' },
  { from: 'Dhaka', to: 'Rajshahi', trains: 6, time: '6h 45m' },
  { from: 'Dhaka', to: 'Khulna', trains: 5, time: '7h 30m' },
];

const stats = [
  { value: '50+', label: 'Trains Tracked', icon: Train },
  { value: '100+', label: 'Stations', icon: MapPin },
  { value: '10K+', label: 'Users', icon: Users },
  { value: '99%', label: 'Uptime', icon: TrendingUp },
];

const testimonials = [
  {
    name: 'Rahim Ahmed',
    role: 'Business Traveler',
    content: 'RailBondhu has changed how I travel. I can now plan my station arrival perfectly knowing exactly where the train is.',
    avatar: 'RA',
  },
  {
    name: 'Fatima Begum',
    role: 'Student',
    content: 'The chat feature is amazing! I connected with other passengers and got helpful updates about my journey.',
    avatar: 'FB',
  },
  {
    name: 'Karim Khan',
    role: 'Daily Commuter',
    content: 'Finally, a reliable way to track trains in Bangladesh. The crowdsourced location is surprisingly accurate!',
    avatar: 'KK',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <MarketingHero />

        {/* Stats Section */}
        <section className="py-16 border-y border-border/50 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl icon-primary mb-4">
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything You Need for Train Travel
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                RailBondhu combines live tracking, community features, and accurate schedules 
                to make your train journey smoother.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="card-light group cursor-pointer">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl icon-primary mb-4 group-hover:scale-105 transition-transform">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">How It Works</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Simple & Easy to Use
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in seconds. No complicated setup, just search and go.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-border" />
                  )}
                  
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl icon-primary mb-4">
                      <item.icon className="w-8 h-8" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-accent text-white text-sm font-bold flex items-center justify-center shadow-md">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">Popular Routes</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Most Tracked Routes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See the most popular train routes tracked by our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularRoutes.map((route, index) => (
                <Link key={index} href="/app/trains">
                  <Card className="card-light group cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{route.from}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span className="font-medium text-foreground">{route.to}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{route.trains} trains</span>
                        <span>{route.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">Testimonials</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Loved by Travelers
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our users have to say about RailBondhu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="card-light">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">&quot;{testimonial.content}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold shadow-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl p-8 md:p-12 text-center overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 section-featured rounded-3xl" />
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Ready to Track Your Train?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Join thousands of travelers who trust RailBondhu for their train journeys.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/app">
                    <Button size="lg" className="btn-accent text-white px-8">
                      <MapPin className="mr-2 w-5 h-5" />
                      Start Tracking Now
                    </Button>
                  </Link>
                  <Link href="/waitlist">
                    <Button variant="outline" size="lg" className="border-border hover:bg-muted px-8">
                      Join Waitlist
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
