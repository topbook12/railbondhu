'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Gavel,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Ban,
  Scale,
  ArrowRight
} from 'lucide-react';

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using RailBondhu ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Service. These terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: '2. Description of Service',
    content: `RailBondhu is a crowdsourced train tracking platform that allows users to:
    
• View train schedules and routes
• See real-time train locations shared by other passengers
• Participate in train chat rooms
• Optionally share their location to help others track trains

The Service is provided "as is" and we make no guarantees about the accuracy or reliability of location data.`,
  },
  {
    title: '3. User Accounts',
    content: `You may need to create an account to access certain features of the Service. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use

We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: '4. Acceptable Use',
    content: `When using RailBondhu, you agree NOT to:

• Share false or misleading location information
• Use the Service for any illegal purpose
• Harass, abuse, or harm other users
• Post inappropriate content in chat rooms
• Attempt to interfere with or disrupt the Service
• Use automated systems to access the Service without permission
• Impersonate other users or misrepresent your identity

We reserve the right to remove content and ban users who violate these guidelines.`,
  },
  {
    title: '5. Privacy and Location Sharing',
    content: `Location sharing on RailBondhu is:

• Completely voluntary and opt-in
• Anonymous - your identity is not linked to location data
• Can be disabled at any time

By sharing your location, you consent to its anonymous aggregation and display to other users. Please review our Privacy Policy for more details.`,
  },
  {
    title: '6. Intellectual Property',
    content: `The Service and its original content, features, and functionality are owned by RailBondhu and are protected by international copyright, trademark, and other intellectual property laws.

Our trademarks and trade dress may not be used without our prior written consent. User-generated content remains the property of the respective users, but you grant us a license to use, display, and distribute such content on the Service.`,
  },
  {
    title: '7. Disclaimers',
    content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

We do not guarantee that:
• The Service will be uninterrupted or error-free
• Location data will be accurate or reliable
• The Service will meet your specific requirements

Train location data is crowdsourced and may be inaccurate. Always verify information with official sources before making travel decisions.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `IN NO EVENT SHALL RAILBONDHU, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.

Our total liability shall not exceed the amount you paid us (if any) in the past 12 months.`,
  },
  {
    title: '9. Changes to Terms',
    content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.

Your continued use of the Service after any changes constitutes acceptance of the new Terms.`,
  },
  {
    title: '10. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.

Any disputes arising from these Terms or the Service shall be resolved in the courts of Dhaka, Bangladesh.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Terms of Service</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Terms of <span className="gradient-text">Service</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Last updated: March 2025
              </p>
              <p className="text-muted-foreground">
                Please read these terms carefully before using RailBondhu. By using our service, 
                you agree to these terms.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Points */}
        <section className="py-12 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <Shield className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Use Responsibly</h3>
                  <p className="text-sm text-muted-foreground">
                    Help keep RailBondhu useful by sharing accurate information and being respectful.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Guarantees</h3>
                  <p className="text-sm text-muted-foreground">
                    Location data is crowdsourced and may not be accurate. Verify with official sources.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <Scale className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Fair Use</h3>
                  <p className="text-sm text-muted-foreground">
                    We reserve the right to ban users who violate these terms or abuse the service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {termsSections.map((section, index) => (
                <Card key={index} className="border-border bg-card/50">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90">
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline">
                    <FileText className="mr-2 w-4 h-4" />
                    View Privacy Policy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                By using RailBondhu, you acknowledge that you have read and understood these Terms of Service 
                and agree to be bound by them.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
