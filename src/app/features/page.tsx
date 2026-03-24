'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  MapPin,
  MessageCircle,
  Clock,
  Shield,
  Users,
  Smartphone,
  Bell,
  Navigation,
  Wifi,
  Eye,
  Lock,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const coreFeatures = [
  {
    icon: MapPin,
    title: 'Live Train Tracking',
    description: 'See real-time train locations powered by passengers sharing their GPS. Know exactly where your train is at any moment.',
    highlights: ['Real-time updates', 'Map visualization', 'Route progress'],
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: MessageCircle,
    title: 'Train Chat Rooms',
    description: 'Connect with fellow passengers on your train. Share updates, ask questions, and help each other.',
    highlights: ['Real-time messaging', 'Anonymous participation', 'Station alerts'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Clock,
    title: 'Accurate Schedules',
    description: 'Get accurate departure and arrival times for all Bangladesh Railway routes.',
    highlights: ['All train schedules', 'Station timetables', 'Delay alerts'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Shield,
    title: 'Privacy First Design',
    description: 'Your location is shared anonymously. Turn off sharing anytime. No personal data exposed.',
    highlights: ['Anonymous sharing', 'Opt-in only', 'No tracking'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

const additionalFeatures = [
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
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get alerts when your train is approaching, delayed, or when there are updates.',
  },
  {
    icon: Navigation,
    title: 'GPS Accuracy',
    description: 'High accuracy location data with confidence scores so you know how reliable the information is.',
  },
  {
    icon: Wifi,
    title: 'Works Offline',
    description: 'Basic functionality works even with poor connectivity. Syncs when back online.',
  },
  {
    icon: Eye,
    title: 'Live Map View',
    description: 'See all trains on a single map with real-time position updates.',
  },
];

const confidenceLevels = [
  {
    level: 'High',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    contributors: '5+ contributors',
    description: 'Strong consistency from multiple passengers',
  },
  {
    level: 'Medium',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    contributors: '2-4 contributors',
    description: 'Acceptable consistency with moderate data',
  },
  {
    level: 'Low',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    contributors: '1 contributor',
    description: 'Weak data from single source',
  },
];

const privacyFeatures = [
  { icon: Lock, text: 'End-to-end encrypted location data' },
  { icon: Eye, text: 'Anonymous location sharing' },
  { icon: CheckCircle2, text: 'No personal data stored' },
  { icon: Zap, text: 'Instant opt-out anytime' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Everything You Need for <span className="gradient-text">Train Travel</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                RailBondhu combines live tracking, community features, and accurate schedules 
                to make your train journey smoother and more predictable.
              </p>
              <Link href="/app">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore Features
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Core Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The Heart of RailBondhu
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our main features designed to solve the biggest pain points of train travel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="border-border bg-card hover:bg-card/80 transition-colors">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight, i) => (
                        <Badge key={i} variant="secondary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Confidence System */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Confidence System</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Know How Reliable the Data Is
                </h2>
                <p className="text-muted-foreground mb-6">
                  Not all location data is created equal. Our confidence system tells you 
                  how reliable the current train position is, based on contributor count 
                  and data consistency.
                </p>
                <p className="text-muted-foreground mb-6">
                  This helps you make better decisions about when to head to the station 
                  or if you should wait for more data.
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Confidence score updates in real-time
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {confidenceLevels.map((level, index) => (
                  <Card key={index} className="border-border bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${level.bgColor} flex items-center justify-center`}>
                            <CheckCircle2 className={`w-6 h-6 ${level.color}`} />
                          </div>
                          <div>
                            <div className={`font-semibold ${level.color}`}>{level.level} Confidence</div>
                            <div className="text-sm text-muted-foreground">{level.contributors}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground max-w-[200px]">
                            {level.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">More Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                And That&apos;s Not All
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Additional features to make your experience even better.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <Card key={index} className="border-border bg-card/50 hover:bg-card transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="outline" className="mb-4">Privacy</Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                    Your Privacy is Non-Negotiable
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    We built RailBondhu with privacy as a core principle, not an afterthought. 
                    Your location data is anonymous, encrypted, and completely under your control.
                  </p>
                  <Link href="/privacy">
                    <Button variant="outline">
                      Read Our Privacy Policy
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {privacyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <feature.icon className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Experience These Features?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of travelers who are already using RailBondhu.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/app">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <MapPin className="mr-2 w-5 h-5" />
                    Start Tracking Now
                  </Button>
                </Link>
                <Link href="/waitlist">
                  <Button variant="outline" size="lg">
                    Join Waitlist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
