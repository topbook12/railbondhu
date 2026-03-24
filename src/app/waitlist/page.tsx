'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Bell,
  CheckCircle2,
  Users,
  Train,
  MapPin,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';

const benefits = [
  {
    icon: Bell,
    title: 'Early Access',
    description: 'Be the first to try new features and updates.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join a growing community of railway travelers.',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get faster responses to your questions.',
  },
];

const stats = [
  { value: '1,247+', label: 'Waitlist Signups' },
  { value: '50+', label: 'Trains Ready' },
  { value: '100+', label: 'Stations' },
  { value: 'Q2 2025', label: 'Public Launch' },
];

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', city: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <Badge variant="outline" className="mb-4">Waitlist</Badge>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                  Be the First to <span className="gradient-text">Experience</span> RailBondhu
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Join our waitlist to get early access to RailBondhu. We&apos;re rolling out 
                  gradually to ensure the best experience for all users.
                </p>

                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <div>
                {isSubmitted ? (
                  <Card className="border-border bg-card">
                    <CardContent className="p-8 text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        You&apos;re on the List!
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Thank you for joining the RailBondhu waitlist. 
                        We&apos;ll notify you when it&apos;s your turn.
                      </p>
                      <div className="p-4 bg-muted/30 rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">
                          Position: <span className="font-bold text-foreground">#1,248</span>
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Check your email for confirmation.
                      </p>
                      <Link href="/app">
                        <Button className="mt-4 bg-primary hover:bg-primary/90">
                          Try the Demo
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border bg-card/50">
                    <CardHeader>
                      <CardTitle>Join the Waitlist</CardTitle>
                      <CardDescription>
                        Sign up to get early access to RailBondhu
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="bg-muted/50 border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            className="bg-muted/50 border-border"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone (optional)</Label>
                            <Input
                              id="phone"
                              placeholder="+880 1XXX-XXXXXX"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="bg-muted/50 border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="Your city"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              className="bg-muted/50 border-border"
                            />
                          </div>
                        </div>

                        {error && (
                          <p className="text-sm text-destructive">{error}</p>
                        )}

                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="mr-2 w-4 h-4 animate-spin" />
                              Joining...
                            </>
                          ) : (
                            <>
                              Join Waitlist
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          By signing up, you agree to our{' '}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What You&apos;ll Get
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                RailBondhu is packed with features to make your train travel easier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border bg-card/50">
                <CardContent className="p-6 text-center">
                  <Train className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Live Train Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    See where your train is in real-time with crowdsourced location data.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Anonymous Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Help others by sharing your location. Completely private and optional.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Community Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with fellow passengers on your train in real-time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Already on Waitlist */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground mb-4">
              Already have access or want to explore?
            </p>
            <Link href="/app">
              <Button variant="outline" size="lg">
                Try the Demo App
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
