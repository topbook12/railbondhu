'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LocationTracker } from '@/components/location/location-tracker';
import { useSocket, LocationUpdate } from '@/hooks/use-socket';
import { 
  Train, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Navigation, 
  Users, 
  ArrowLeft,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ChevronRight,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';

/*
 * TRAIN DETAIL PAGE - REAL-TIME TRACKING
 * ======================================
 * 
 * This page shows real-time train location tracking:
 * 
 * Features:
 * - Live location updates via WebSocket
 * - Location sharing toggle (anonymous)
 * - Confidence indicator based on contributors
 * - Route timeline with stations
 * - Real-time stats (speed, contributors, last update)
 * 
 * Real-time Updates:
 * - Location coordinates
 * - Speed and heading
 * - Contributor count
 * - Confidence score
 */

interface TrainData {
  id: string;
  trainName: string;
  trainNumber: string;
  routeName: string;
  sourceStation: string;
  destinationStation: string;
  status: string;
  routeStops: Array<{
    id: string;
    sequence: number;
    scheduledArrival: string | null;
    scheduledDeparture: string | null;
    station: {
      id: string;
      stationName: string;
      lat: number;
      lng: number;
    };
  }>;
  aggregatedLocations: Array<{
    lat: number;
    lng: number;
    confidenceLabel: string;
    contributorCount: number;
    updatedAt: string;
  }>;
}

interface LiveLocation {
  trainId: string;
  lat: number | null;
  lng: number | null;
  avgSpeed: number | null;
  confidenceScore: number;
  confidenceLabel: string;
  contributorCount: number;
  updatedAt: string | null;
}

interface RouteStop {
  id: string;
  sequence: number;
  stationName: string;
  lat: number;
  lng: number;
  scheduledArrival: string | null;
  scheduledDeparture: string | null;
}

export default function TrainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trainId = params.id as string;

  // Socket hook for real-time updates
  const {
    isConnected,
    connectionError,
    latestLocation,
    onlineUsers,
    joinTrainChat,
    leaveTrainChat,
    shareLocation
  } = useSocket();

  // Local state
  const [train, setTrain] = useState<TrainData | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayName] = useState(() => `Traveler_${Math.floor(Math.random() * 1000)}`);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);

  // Fetch train data
  const fetchTrain = useCallback(async () => {
    try {
      const response = await fetch(`/api/trains/${trainId}`);
      if (!response.ok) {
        throw new Error('Train not found');
      }
      const data = await response.json();
      setTrain(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load train');
    }
  }, [trainId]);

  // Fetch live location from API
  const fetchLiveLocation = useCallback(async () => {
    try {
      const response = await fetch(`/api/trains/${trainId}/live-location`);
      const data = await response.json();
      setLiveLocation(data);
    } catch (err) {
      console.error('Failed to fetch live location:', err);
    }
  }, [trainId]);

  // Fetch route stops
  const fetchRouteStops = useCallback(async () => {
    try {
      const response = await fetch(`/api/trains/${trainId}/route-info`);
      const data = await response.json();
      setRouteStops(data.stops || []);
    } catch (err) {
      console.error('Failed to fetch route stops:', err);
    }
  }, [trainId]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTrain(), fetchLiveLocation(), fetchRouteStops()]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchTrain, fetchLiveLocation, fetchRouteStops]);

  // Join train chat for location updates
  useEffect(() => {
    if (isConnected && trainId && !loading) {
      joinTrainChat(trainId, userId, displayName);
    }

    return () => {
      leaveTrainChat();
    };
  }, [isConnected, trainId, loading, joinTrainChat, leaveTrainChat, userId, displayName]);

  // Poll for live location updates (fallback)
  useEffect(() => {
    const interval = setInterval(fetchLiveLocation, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveLocation]);

  // Update live location from WebSocket
  useEffect(() => {
    if (latestLocation) {
      setLiveLocation(prev => ({
        ...prev,
        trainId: latestLocation.trainId,
        lat: latestLocation.lat,
        lng: latestLocation.lng,
        avgSpeed: latestLocation.speed || prev?.avgSpeed || null,
        contributorCount: (prev?.contributorCount || 0) + 1,
        updatedAt: latestLocation.timestamp
      }));
    }
  }, [latestLocation]);

  // Handle location updates from LocationTracker
  const handleLocationUpdate = useCallback((location: { lat: number; lng: number; speed: number | null; heading: number | null }) => {
    // Share via WebSocket
    shareLocation(
      location.lat,
      location.lng,
      location.speed || undefined,
      location.heading || undefined
    );
  }, [shareLocation]);

  // Send location ping to API for persistence
  const sendLocationPing = useCallback(async (location: { lat: number; lng: number; accuracy: number; speed: number | null; heading: number | null }) => {
    try {
      await fetch('/api/location/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          trainId,
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy,
          speed: location.speed,
          heading: location.heading
        })
      });
    } catch (err) {
      console.error('Failed to send location ping:', err);
    }
  }, [trainId, userId]);

  const getConfidenceIcon = (label: string) => {
    switch (label) {
      case 'high':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <Circle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getConfidenceColor = (label: string) => {
    switch (label) {
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

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    return time;
  };

  const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (error || !train) {
    return (
      <AppLayout>
        <div className="p-4">
          <Card className="border-destructive/50">
            <CardContent className="p-6 text-center">
              <p className="text-destructive">{error || 'Train not found'}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => router.push('/app/trains')}
              >
                Back to Trains
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="shrink-0 hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {train.trainName}
                  </h1>
                  <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary">
                    #{train.trainNumber}
                  </Badge>
                  {/* Connection status */}
                  {isConnected ? (
                    <Badge variant="outline" className="border-green-300 text-green-600 bg-green-50">
                      <Wifi className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-yellow-300 text-yellow-600 bg-yellow-50">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{train.routeName}</p>
              </div>
            </div>

            {/* Route summary */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground font-medium">{train.sourceStation}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="text-foreground font-medium">{train.destinationStation}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Live Map */}
          <Card className="card-light overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64 bg-gradient-to-br from-muted to-muted/50">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-30">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Train Position Marker */}
                {(liveLocation?.lat || latestLocation?.lat) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Pulse effect */}
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 w-20 h-20" />
                      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 w-24 h-24" />
                      <div className="relative gradient-primary rounded-full p-4 shadow-lg">
                        <Train className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* No Location Message */}
                {!(liveLocation?.lat || latestLocation?.lat) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl icon-primary mx-auto mb-3 flex items-center justify-center opacity-50">
                        <Radio className="w-8 h-8" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        No live location available
                      </p>
                      <p className="text-muted-foreground/70 text-xs mt-1">
                        Be the first to share your location!
                      </p>
                    </div>
                  </div>
                )}

                {/* Map attribution */}
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50 bg-card/80 px-2 py-1 rounded">
                  {isConnected ? '🔴 Live Position' : '📍 Last Known Position'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Location Status */}
          <Card className="card-light">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Location Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {/* Confidence */}
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Confidence
                  </p>
                  <div className="flex items-center gap-2">
                    {getConfidenceIcon(liveLocation?.confidenceLabel || 'unknown')}
                    <span className={`font-medium capitalize ${getConfidenceColor(liveLocation?.confidenceLabel || 'unknown')}`}>
                      {liveLocation?.confidenceLabel || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Contributors */}
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Contributors
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {onlineUsers.length || liveLocation?.contributorCount || 0}
                    </span>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Last Updated
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {getTimeAgo(liveLocation?.updatedAt || latestLocation?.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Average Speed */}
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Avg Speed
                  </p>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {liveLocation?.avgSpeed 
                        ? `${Math.round(liveLocation.avgSpeed * 3.6)} km/h`
                        : latestLocation?.speed
                          ? `${Math.round(latestLocation.speed * 3.6)} km/h`
                          : '-- km/h'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Location Broadcasting */}
          <LocationTracker
            trainId={trainId}
            onLocationUpdate={handleLocationUpdate}
            isSocketConnected={isConnected}
          />

          {/* Route Timeline */}
          <Card className="card-light">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Route Timeline
              </CardTitle>
              <CardDescription>
                {routeStops.length} stations on this route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  {/* Stations */}
                  <div className="space-y-0">
                    {routeStops.map((stop, index) => {
                      const isFirst = index === 0;
                      const isLast = index === routeStops.length - 1;

                      return (
                        <div key={stop.id} className="relative pl-10 py-4">
                          {/* Station marker */}
                          <div className={`absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isFirst || isLast
                              ? 'bg-primary border-primary'
                              : 'bg-card border-border'
                          }`}>
                            {(isFirst || isLast) && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>

                          {/* Station info */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">
                                {stop.stationName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isFirst ? 'Source' : isLast ? 'Destination' : `Stop ${stop.sequence}`}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <p className="text-muted-foreground">
                                {formatTime(stop.scheduledArrival)}
                              </p>
                              {stop.scheduledDeparture && stop.scheduledDeparture !== stop.scheduledArrival && (
                                <p className="text-xs text-muted-foreground/70">
                                  Dep: {formatTime(stop.scheduledDeparture)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Link - Prominent Card */}
          <Link href={`/app/train/${trainId}/chat`} className="block">
            <Card className="card-light cursor-pointer group border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">Train Chat Room</p>
                      <p className="text-sm text-muted-foreground">
                        {onlineUsers.length > 0 ? (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {onlineUsers.length} users online • Join the conversation!
                          </span>
                        ) : (
                          'Be the first to chat with fellow passengers'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-0">
                      Live Chat
                    </Badge>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Floating Chat Button */}
        <Link 
          href={`/app/train/${trainId}/chat`}
          className="fixed bottom-24 md:bottom-8 right-4 z-40"
        >
          <Button 
            size="lg" 
            className="h-14 px-6 rounded-full shadow-lg gradient-primary hover:opacity-90 transition-opacity gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">Chat Room</span>
            {onlineUsers.length > 0 && (
              <Badge className="ml-1 bg-white/20 text-white border-0 px-2">
                {onlineUsers.length}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
