'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Send,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'For general inquiries',
    value: 'hello@railbondhu.com',
    action: 'mailto:hello@railbondhu.com',
  },
  {
    icon: MessageSquare,
    title: 'Feedback',
    description: 'Share your thoughts',
    value: 'feedback@railbondhu.com',
    action: 'mailto:feedback@railbondhu.com',
  },
  {
    icon: Users,
    title: 'Partnerships',
    description: 'Business inquiries',
    value: 'partners@railbondhu.com',
    action: 'mailto:partners@railbondhu.com',
  },
];

const faqItems = [
  {
    question: 'How accurate is the train location data?',
    answer: 'Location accuracy depends on the number of contributors sharing their location. Higher contributor counts typically mean more accurate data. We display a confidence score for each train location.',
  },
  {
    question: 'Is my location shared with other users?',
    answer: 'Location sharing is completely optional and anonymous. Other users see aggregated location data, not your individual location. You can turn off sharing at any time.',
  },
  {
    question: 'How do I report an issue with the app?',
    answer: 'You can report issues through the feedback form above or email us at feedback@railbondhu.com. We appreciate all feedback!',
  },
  {
    question: 'Can I track any train in Bangladesh?',
    answer: 'Currently, we support major railway routes in Bangladesh. We are continuously adding more trains and routes. Check the app for the latest coverage.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Contact Us</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                We&apos;d Love to <span className="gradient-text">Hear From You</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question, suggestion, or just want to say hello? 
                We&apos;re here to help make your train travel experience better.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <Link key={index} href={method.action}>
                  <Card className="border-border bg-card hover:bg-card/80 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <method.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{method.title}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <p className="text-sm text-primary mt-1">{method.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                
                {isSubmitted ? (
                  <Card className="border-border bg-card">
                    <CardContent className="p-8 text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border bg-card/50">
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                              className="bg-muted/50 border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="What is this about?"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            required
                            className="bg-muted/50 border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us more..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            required
                            rows={5}
                            className="bg-muted/50 border-border"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="mr-2 w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <Card key={index} className="border-border bg-card/50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-border bg-card/50 mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Based in Dhaka, Bangladesh</p>
                        <p className="text-sm text-muted-foreground">Serving railway passengers nationwide</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="py-12 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Response Time
              </h3>
              <p className="text-muted-foreground">
                We typically respond within 24-48 hours during business days.
                For urgent matters, please mention it in your subject line.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Try RailBondhu?
              </h2>
              <p className="text-muted-foreground mb-6">
                Experience real-time train tracking today.
              </p>
              <Link href="/app">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Open the App
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
