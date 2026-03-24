'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Train,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  TrendingUp,
  X,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';

/*
 * TRAINS PAGE DESIGN - LIGHT THEME
 * ================================
 * 
 * Layout:
 * 1. Page header with icon
 * 2. Search and filter card
 * 3. Train list cards with direct Chat button
 * 4. Load more button
 */

interface TrainStop {
  id: string;
  sequence: number;
  stationName: string;
  lat: number;
  lng: number;
  scheduledArrival: string;
  scheduledDeparture: string;
}

interface TrainData {
  id: string;
  trainName: string;
  trainNumber: string;
  routeName: string;
  sourceStation: string;
  destinationStation: string;
  status: 'on-time' | 'delayed' | 'cancelled' | 'unknown';
  stops: TrainStop[];
  liveLocation: {
    lat: number;
    lng: number;
    avgSpeed: number;
    confidenceLabel: string;
    contributorCount: number;
  } | null;
  pingCount: number;
}

const routes = [
  { value: 'all', label: 'All Routes' },
  { value: 'dhaka-chittagong', label: 'Dhaka - Chittagong' },
  { value: 'dhaka-sylhet', label: 'Dhaka - Sylhet' },
  { value: 'dhaka-dinajpur', label: 'Dhaka - Dinajpur' },
  { value: 'dhaka-kulaura', label: 'Dhaka - Kulaura' },
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'on-time', label: 'On Time' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'unknown', label: 'Unknown' },
];

export default function TrainsPage() {
  const router = useRouter();
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch trains from API
  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch('/api/trains');
        if (response.ok) {
          const data = await response.json();
          setTrains(data.trains || []);
        }
      } catch (error) {
        console.error('Failed to fetch trains:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrains();
  }, []);

  const filteredTrains = useMemo(() => {
    let filtered = [...trains];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (train) =>
          train.trainName.toLowerCase().includes(query) ||
          train.trainNumber.includes(query) ||
          train.sourceStation.toLowerCase().includes(query) ||
          train.destinationStation.toLowerCase().includes(query)
      );
    }

    if (selectedRoute !== 'all') {
      filtered = filtered.filter((train) =>
        train.routeName.toLowerCase().includes(selectedRoute.replace('-', ' '))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((train) => train.status === selectedStatus);
    }

    return filtered;
  }, [trains, searchQuery, selectedRoute, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRoute('all');
    setSelectedStatus('all');
  };

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

  const getConfidenceColor = (confidence?: string) => {
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

  const hasActiveFilters = searchQuery || selectedRoute !== 'all' || selectedStatus !== 'all';

  // Get first departure time from stops
  const getFirstDeparture = (train: TrainData) => {
    if (train.stops && train.stops.length > 0) {
      return train.stops[0].scheduledDeparture;
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-primary">
              <Train className="w-6 h-6" />
            </div>
            Trains
          </h1>
          <p className="text-muted-foreground">
            Browse and track all trains across Bangladesh Railway
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="card-light">
          <CardContent className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by train name, number, or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:border-primary"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger className="w-full bg-muted/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.value} value={route.value}>
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full bg-muted/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="shrink-0 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredTrains.length} trains found</span>
              {hasActiveFilters && (
                <span className="text-primary font-medium">Filters applied</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="card-light">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading trains...</p>
            </CardContent>
          </Card>
        )}

        {/* Train List */}
        {!loading && (
          <div className="space-y-4">
            {filteredTrains.length === 0 ? (
              <Card className="card-light">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl icon-primary mx-auto mb-4 flex items-center justify-center">
                    <Train className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No trains found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="border-primary/30 text-primary hover:bg-primary/5">
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredTrains.map((train) => (
                <Card 
                  key={train.id} 
                  className="card-light cursor-pointer group"
                  onClick={() => router.push(`/app/train/${train.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Train Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl icon-primary shrink-0 group-hover:scale-105 transition-transform">
                          <Train className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{train.trainName}</h3>
                            {getStatusBadge(train.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            #{train.trainNumber} • {train.routeName}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-3 h-3 text-primary" />
                              {train.sourceStation} → {train.destinationStation}
                            </span>
                            {getFirstDeparture(train) && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3 text-primary" />
                                {getFirstDeparture(train)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats & Action */}
                      <div className="flex items-center gap-4">
                        {/* Community Stats */}
                        <div className="hidden md:flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{train.liveLocation?.contributorCount || train.pingCount || 0}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Contributors</p>
                          </div>
                          <div className="text-center">
                            <div className={`flex items-center gap-1 ${getConfidenceColor(train.liveLocation?.confidenceLabel)}`}>
                              <TrendingUp className="w-3 h-3" />
                              <span className="capitalize">{train.liveLocation?.confidenceLabel || 'N/A'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Confidence</p>
                          </div>
                        </div>

                        {/* Chat Button */}
                        <Link 
                          href={`/app/train/${train.id}/chat`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Chat</span>
                        </Link>

                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
