'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Bell,
  Cookie,
  Gavel,
  MapPin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const privacySections = [
  {
    icon: MapPin,
    title: 'Location Data',
    content: [
      'Location sharing is completely optional and opt-in',
      'Location data is anonymous - we never link it to your identity',
      'Data is aggregated and individual pings are not stored long-term',
      'You can disable location sharing at any time',
      'Location accuracy is determined by your device GPS',
    ],
  },
  {
    icon: Database,
    title: 'Data Collection',
    content: [
      'We collect minimal data necessary for the service to function',
      'Email addresses are only collected if you join the waitlist or register',
      'Chat messages are stored temporarily and may be reviewed for safety',
      'We do not sell or share your data with third parties',
      'Analytics data is anonymized and used to improve the service',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'All data is encrypted in transit using TLS/SSL',
      'Databases are encrypted at rest',
      'Access to personal data is restricted to authorized personnel only',
      'We regularly review our security practices',
      'In case of a data breach, we will notify affected users promptly',
    ],
  },
  {
    icon: Users,
    title: 'User Rights',
    content: [
      'You have the right to access your personal data',
      'You can request deletion of your data at any time',
      'You can export your data in a portable format',
      'You can opt out of marketing communications',
      'You can disable location sharing without losing access to the app',
    ],
  },
];

const cookieTypes = [
  { name: 'Essential Cookies', purpose: 'Required for the app to function properly', duration: 'Session' },
  { name: 'Preference Cookies', purpose: 'Remember your settings and preferences', duration: '1 year' },
  { name: 'Analytics Cookies', purpose: 'Help us understand how the app is used', duration: '2 years' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Privacy Policy</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Your Privacy <span className="gradient-text">Matters</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Last updated: March 2025
              </p>
              <p className="text-muted-foreground">
                At RailBondhu, we take your privacy seriously. This policy explains how we 
                collect, use, and protect your information when you use our service.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-12 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Quick Summary</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Location sharing is always optional and anonymous</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">We never sell your personal data to third parties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">You can delete your data at any time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">All data is encrypted and secured</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {privacySections.map((section, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <Card className="border-border bg-card/50">
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cookies Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Cookies</h2>
            </div>
            <p className="text-muted-foreground mb-8">
              We use cookies and similar technologies to provide, secure, and improve our service. 
              Here&apos;s a breakdown of the cookies we use:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cookie Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Purpose</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTypes.map((cookie, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">{cookie.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{cookie.purpose}</td>
                      <td className="py-3 px-4 text-muted-foreground">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Third-Party Services</h2>
            </div>
            <Card className="border-border bg-card/50">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  We may use third-party services that collect information about you:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Map Services:</strong> For displaying train locations and routes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Analytics:</strong> To understand how our service is used
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Authentication:</strong> For secure login and account management
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions or concerns about our privacy practices, 
                please don&apos;t hesitate to contact us.
              </p>
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90">
                  Contact Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                This privacy policy applies to the RailBondhu service and all related products.
              </p>
              <p>
                By using RailBondhu, you agree to this privacy policy. 
                We may update this policy from time to time, and we will notify users of any significant changes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
