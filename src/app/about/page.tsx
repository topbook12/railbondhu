'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Train,
  MapPin,
  Users,
  Heart,
  Target,
  Lightbulb,
  Globe,
  Shield,
  Clock,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your location data is anonymous and secure. We never expose personal information.',
  },
  {
    icon: Users,
    title: 'Community Powered',
    description: 'Built by the community, for the community. Every contribution helps fellow travelers.',
  },
  {
    icon: Target,
    title: 'Accuracy Matters',
    description: 'We aggregate multiple data points to provide reliable, confidence-scored locations.',
  },
  {
    icon: Globe,
    title: 'Open & Accessible',
    description: 'Free to use and available to all Bangladesh Railway passengers.',
  },
];

const team = [
  {
    name: 'Ahmed Rahman',
    role: 'Founder & CEO',
    bio: 'Former railway enthusiast turned tech entrepreneur.',
    initials: 'AR',
  },
  {
    name: 'Fatima Khan',
    role: 'Lead Developer',
    bio: 'Full-stack engineer passionate about civic tech.',
    initials: 'FK',
  },
  {
    name: 'Rafiq Islam',
    role: 'Product Designer',
    bio: 'Creating intuitive experiences for everyday users.',
    initials: 'RI',
  },
  {
    name: 'Nadia Chowdhury',
    role: 'Operations Lead',
    bio: 'Ensuring smooth journeys for all RailBondhu users.',
    initials: 'NC',
  },
];

const milestones = [
  { year: '2024', event: 'RailBondhu concept born from personal train delay frustration' },
  { year: '2024', event: 'First prototype built with basic location sharing' },
  { year: '2025', event: 'Beta launch with 1,000 early adopters' },
  { year: '2025', event: 'Public launch covering all major railway routes' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">About Us</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Making Train Travel <span className="gradient-text">Better Together</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                RailBondhu was born from a simple idea: what if passengers could help each other 
                track trains in real-time? We&apos;re building the future of railway travel in Bangladesh, 
                one location ping at a time.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/app">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Try the App
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/waitlist">
                  <Button variant="outline" size="lg">
                    Join Our Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Our Mission</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Empowering Railway Passengers
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every day, millions of Bangladeshis rely on trains for work, family visits, 
                  and daily commutes. Yet, knowing when a train will actually arrive remains 
                  a challenge.
                </p>
                <p className="text-muted-foreground mb-6">
                  RailBondhu transforms this experience by leveraging the collective power of 
                  passengers. When you share your location anonymously, you help thousands of 
                  others plan their journeys better.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    <span className="text-sm text-muted-foreground">Community First</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Privacy Protected</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="glass rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">50+</div>
                      <p className="text-sm text-muted-foreground">Trains Tracked</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-3xl font-bold text-accent mb-2">10K+</div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">100+</div>
                      <p className="text-sm text-muted-foreground">Stations</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-3xl font-bold text-accent mb-2">99%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Our Values</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our values guide every decision we make and every feature we build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-border bg-card/50 hover:bg-card transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Our Journey</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The RailBondhu Story
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                {milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-12 pb-8 last:pb-0">
                    <div className="absolute left-2 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-primary font-medium mb-1">
                        {milestone.year}
                      </div>
                      <p className="text-foreground">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Our Team</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Meet the People Behind RailBondhu
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A small but passionate team dedicated to improving train travel in Bangladesh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="border-border bg-card/50 hover:bg-card transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">
                        {member.initials}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8 md:p-12 text-center">
              <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Want to Join Our Journey?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                We&apos;re always looking for passionate people to help us improve train travel in Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Mail className="mr-2 w-5 h-5" />
                    Contact Us
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
