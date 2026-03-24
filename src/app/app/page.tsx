'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Train,
  Search,
  Clock,
  MapPin,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Heart,
  Route,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  WifiOff,
  Calendar,
  Sparkles,
  CreditCard,
  Globe,
  Code,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

/*
 * DASHBOARD PAGE - Enhanced Version
 * =================================
 * 
 * Features:
 * - Quick search
 * - Quick links to all features
 * - Live train status
 * - Delay predictions
 * - Favorites preview
 * - Offline indicator
 * - Stats
 */

interface LiveTrainStatus {
  id: string;
  trainName: string;
  trainNumber: string;
  route: string;
  status: 'on-time' | 'delayed' | 'cancelled' | 'unknown';
  currentLocation?: string;
  eta?: string;
  contributors: number;
  confidence: 'high' | 'medium' | 'low';
}

interface DelayPrediction {
  trainId: string;
  trainNumber: string;
  trainName: string;
  predictedDelay: number;
  confidence: number;
  recommendation: string;
}

const mockLiveTrains: LiveTrainStatus[] = [
  {
    id: '1',
    trainName: 'Suborno Express',
    trainNumber: '701',
    route: 'Dhaka → Chittagong',
    status: 'on-time',
    currentLocation: 'Near Cumilla',
    eta: '2h 15m',
    contributors: 12,
    confidence: 'high',
  },
  {
    id: '2',
    trainName: 'Mohanagar Provati',
    trainNumber: '703',
    route: 'Dhaka → Sylhet',
    status: 'delayed',
    currentLocation: 'Near Bhairab Bazar',
    eta: '3h 45m',
    contributors: 8,
    confidence: 'medium',
  },
  {
    id: '3',
    trainName: 'Parabat Express',
    trainNumber: '707',
    route: 'Dhaka → Dinajpur',
    status: 'on-time',
    currentLocation: 'Near Tangail',
    eta: '4h 20m',
    contributors: 5,
    confidence: 'high',
  },
];

const quickLinks = [
  { name: 'All Trains', href: '/app/trains', icon: Train, description: 'Browse trains', color: 'text-primary' },
  { name: 'Favorites', href: '/app/favorites', icon: Heart, description: 'Your saved trains', color: 'text-red-500' },
  { name: 'Journey', href: '/app/journey', icon: Route, description: 'Plan trips', color: 'text-blue-500' },
  { name: 'Stations', href: '/app/stations', icon: Building2, description: 'Station info', color: 'text-green-500' },
  { name: 'Schedule', href: '/app/schedule', icon: Clock, description: 'Train schedules', color: 'text-purple-500' },
  { name: 'Live Map', href: '/app/map', icon: MapPin, description: 'Track trains', color: 'text-orange-500' },
];

const futureLinks = [
  { name: 'AI Features', href: '/app/ai', icon: Sparkles, description: 'Smart predictions', color: 'text-violet-500' },
  { name: 'Book Tickets', href: '/app/booking', icon: CreditCard, description: 'Online booking', color: 'text-emerald-500' },
  { name: 'Community', href: '/app/community', icon: Users, description: 'Reports & chat', color: 'text-pink-500' },
  { name: 'Partners', href: '/app/partners', icon: Code, description: 'API access', color: 'text-cyan-500' },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveTrains] = useState<LiveTrainStatus[]>(mockLiveTrains);
  const [predictions, setPredictions] = useState<DelayPrediction[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch predictions - defined before useEffect
  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/delay-prediction');
      const data = await response.json();
      setPredictions(data.slice(0, 3));
    } catch {
      // Use mock data
      setPredictions([
        {
          trainId: '1',
          trainNumber: '701',
          trainName: 'Suborno Express',
          predictedDelay: 8,
          confidence: 0.85,
          recommendation: 'Train likely on time',
        },
        {
          trainId: '2',
          trainNumber: '703',
          trainName: 'Mohanagar Provati',
          predictedDelay: 25,
          confidence: 0.72,
          recommendation: 'Expect moderate delays',
        },
        {
          trainId: '3',
          trainNumber: '707',
          trainName: 'Parabat Express',
          predictedDelay: 5,
          confidence: 0.91,
          recommendation: 'Train likely on time',
        },
      ]);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch delay predictions on mount
    void (async () => {
      try {
        const response = await fetch('/api/delay-prediction');
        const data = await response.json();
        setPredictions(data.slice(0, 3));
      } catch {
        // Use mock data
        setPredictions([
          {
            trainId: '1',
            trainNumber: '701',
            trainName: 'Suborno Express',
            predictedDelay: 8,
            confidence: 0.85,
            recommendation: 'Train likely on time',
          },
          {
            trainId: '2',
            trainNumber: '703',
            trainName: 'Mohanagar Provati',
            predictedDelay: 25,
            confidence: 0.72,
            recommendation: 'Expect moderate delays',
          },
          {
            trainId: '3',
            trainNumber: '707',
            trainName: 'Parabat Express',
            predictedDelay: 5,
            confidence: 0.91,
            recommendation: 'Train likely on time',
          },
        ]);
      }
    })();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">On Time</Badge>;
      case 'delayed':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Delayed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay <= 10) return 'text-green-600';
    if (delay <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Offline Banner */}
        {!isOnline && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">You&apos;re offline</p>
                <p className="text-sm text-yellow-600">Some features may be limited. Data will sync when you&apos;re back online.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, <span className="gradient-text">John</span>
          </h1>
          <p className="text-muted-foreground">
            Track trains in real-time with community-powered location sharing.
          </p>
        </div>

        {/* Quick Search */}
        <Card className="card-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Quick Search
            </CardTitle>
            <CardDescription>
              Search for trains, stations, or routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trains, stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:border-primary"
              />
            </div>
            {searchQuery && (
              <div className="mt-4 flex justify-end">
                <Link href={`/app/trains?q=${encodeURIComponent(searchQuery)}`}>
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/5">
                    View all results
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links - Enhanced Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Card className="card-light hover:border-primary/30 cursor-pointer h-full group transition-all hover:shadow-md">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center bg-muted group-hover:scale-105 transition-transform`}>
                    <link.icon className={`w-6 h-6 ${link.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{link.name}</h3>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Future Vision Links */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            New Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {futureLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Card className="card-light hover:border-primary/30 cursor-pointer h-full group transition-all hover:shadow-md border-dashed">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center bg-muted group-hover:scale-105 transition-transform`}>
                      <link.icon className={`w-6 h-6 ${link.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{link.name}</h3>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Train Status */}
          <Card className="card-light">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Train Status
                  </CardTitle>
                  <CardDescription>
                    Real-time updates from contributors
                  </CardDescription>
                </div>
                <Link href="/app/trains">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                    View all
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveTrains.slice(0, 3).map((train) => (
                  <Link key={train.id} href={`/app/train/${train.id}`}>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{train.trainName}</h4>
                          <p className="text-xs text-muted-foreground">
                            #{train.trainNumber} • {train.route}
                          </p>
                        </div>
                        {getStatusBadge(train.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {train.currentLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {train.eta}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delay Predictions */}
          <Card className="card-light">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Delay Predictions
                  </CardTitle>
                  <CardDescription>
                    AI-powered delay forecasts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictions.map((prediction) => (
                  <Link key={prediction.trainId} href={`/app/train/${prediction.trainId}`}>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{prediction.trainName}</h4>
                          <p className="text-xs text-muted-foreground">#{prediction.trainNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getDelayColor(prediction.predictedDelay)}`}>
                            ~{prediction.predictedDelay}min
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(prediction.confidence * 100)}% confidence
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {prediction.predictedDelay <= 10 ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        )}
                        <span className="text-muted-foreground">{prediction.recommendation}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary">24</div>
              <p className="text-sm text-muted-foreground">Trains Tracked</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-accent">156</div>
              <p className="text-sm text-muted-foreground">Contributions</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-red-500">5</div>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-600">850</div>
              <p className="text-sm text-muted-foreground">Reputation</p>
            </CardContent>
          </Card>
        </div>

        {/* Offline Support Notice */}
        <Card className="card-light border-dashed">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-primary" />
              ) : (
                <WifiOff className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Offline Support</h3>
              <p className="text-sm text-muted-foreground">
                RailBondhu works offline! Your data syncs automatically when you&apos;re back online.
              </p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              PWA Ready
            </Badge>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
