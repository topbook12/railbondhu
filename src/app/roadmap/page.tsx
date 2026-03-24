'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  MapPin,
  MessageCircle,
  Bell,
  Globe,
  Zap,
  Train,
  Users,
  Shield,
  Smartphone
} from 'lucide-react';

const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'completed',
    description: 'Building the core platform and essential features.',
    items: [
      { text: 'Train listing and search', status: 'completed' },
      { text: 'Basic train details page', status: 'completed' },
      { text: 'Location ping API', status: 'completed' },
      { text: 'Aggregated location display', status: 'completed' },
      { text: 'Basic map integration', status: 'completed' },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Real-Time Features',
    status: 'in-progress',
    description: 'Adding real-time capabilities and live updates.',
    items: [
      { text: 'WebSocket real-time updates', status: 'in-progress' },
      { text: 'Train chat rooms', status: 'in-progress' },
      { text: 'Live location broadcasting', status: 'pending' },
      { text: 'Push notifications', status: 'pending' },
      { text: 'Mobile app improvements', status: 'pending' },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Enhanced Experience',
    status: 'pending',
    description: 'Improving the user experience with advanced features.',
    items: [
      { text: 'Favorite trains', status: 'pending' },
      { text: 'Journey planning', status: 'pending' },
      { text: 'Delay predictions', status: 'pending' },
      { text: 'Station information', status: 'pending' },
      { text: 'Offline support', status: 'pending' },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Community & Scale',
    status: 'pending',
    description: 'Building community features and scaling the platform.',
    items: [
      { text: 'User profiles & reputation', status: 'pending' },
      { text: 'Achievement badges', status: 'pending' },
      { text: 'Community reports', status: 'pending' },
      { text: 'Admin dashboard', status: 'pending' },
      { text: 'Analytics & insights', status: 'pending' },
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Future Vision',
    status: 'pending',
    description: 'Long-term goals and exciting possibilities.',
    items: [
      { text: 'AI-powered predictions', status: 'pending' },
      { text: 'Ticket booking integration', status: 'pending' },
      { text: 'Multi-language support', status: 'pending' },
      { text: 'Partner API access', status: 'pending' },
      { text: 'Native mobile apps', status: 'pending' },
    ],
  },
];

const upcomingFeatures = [
  {
    icon: MessageCircle,
    title: 'Enhanced Chat',
    description: 'Rich media sharing, reactions, and threaded conversations.',
    eta: 'Q2 2025',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Custom notifications for train delays and station arrivals.',
    eta: 'Q2 2025',
  },
  {
    icon: Globe,
    title: 'Full Route Coverage',
    description: 'Complete coverage of all Bangladesh Railway routes.',
    eta: 'Q3 2025',
  },
  {
    icon: Zap,
    title: 'Performance Boost',
    description: 'Faster load times and smoother real-time updates.',
    eta: 'Q2 2025',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      return <Circle className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">In Progress</Badge>;
    default:
      return <Badge variant="secondary">Planned</Badge>;
  }
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Roadmap</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                The Future of <span className="gradient-text">RailBondhu</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We&apos;re building something special. Here&apos;s a look at what we&apos;ve accomplished 
                and where we&apos;re headed next.
              </p>
              <Link href="/waitlist">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Notified of Updates
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2" />

              {roadmapItems.map((phase, index) => (
                <div 
                  key={index} 
                  className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary transform -translate-x-1/2 mt-8" />

                  {/* Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="border-border bg-card hover:bg-card/80 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-primary font-medium">{phase.phase}</p>
                            <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                          </div>
                          {getStatusBadge(phase.status)}
                        </div>
                        <p className="text-muted-foreground mb-4">{phase.description}</p>
                        <div className="space-y-2">
                          {phase.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className={`text-sm ${
                                item.status === 'completed' 
                                  ? 'text-muted-foreground' 
                                  : 'text-foreground'
                              }`}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Coming Soon</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Features on the Horizon
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here&apos;s a sneak peek at some of the features we&apos;re actively working on.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <Card key={index} className="border-border bg-card/50 hover:bg-card transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <Badge variant="outline" className="text-xs">
                      ETA: {feature.eta}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8 md:p-12">
              <div className="text-center max-w-3xl mx-auto">
                <Train className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We envision a future where every train passenger in Bangladesh can travel 
                  with confidence, knowing exactly when their train will arrive. A future 
                  where the community helps each other navigate the railways efficiently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Community Driven</h4>
                    <p className="text-sm text-muted-foreground">Built by passengers, for passengers</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Privacy Protected</h4>
                    <p className="text-sm text-muted-foreground">Your data stays yours</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Always Accessible</h4>
                    <p className="text-sm text-muted-foreground">Works on any device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Want to Shape the Future?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join our community and help us build the best train tracking experience in Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/waitlist">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Join Waitlist
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Give Feedback
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
