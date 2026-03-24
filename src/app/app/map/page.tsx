'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Train,
  Search,
  MapPin,
  Clock,
  Users,
  RefreshCw,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  Navigation,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for map component (SSR disabled)
const TrainMap = dynamic(
  () => import('@/components/map/train-map').then(mod => mod.TrainMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }
);

// Mock train data
const mockTrains = [
  {
    id: '1',
    trainName: 'Suborno Express',
    trainNumber: '701',
    route: 'Dhaka → Chittagong',
    status: 'on-time' as const,
    lastUpdate: '2 min ago',
    contributors: 12,
    speed: 65,
  },
  {
    id: '2',
    trainName: 'Mohanagar Provati',
    trainNumber: '703',
    route: 'Dhaka → Sylhet',
    status: 'delayed' as const,
    lastUpdate: '5 min ago',
    contributors: 8,
    speed: 45,
  },
  {
    id: '3',
    trainName: 'Parabat Express',
    trainNumber: '707',
    route: 'Dhaka → Dinajpur',
    status: 'on-time' as const,
    lastUpdate: '3 min ago',
    contributors: 5,
    speed: 70,
  },
  {
    id: '4',
    trainName: 'Turna Express',
    trainNumber: '711',
    route: 'Dhaka → Chittagong',
    status: 'on-time' as const,
    lastUpdate: '1 min ago',
    contributors: 15,
    speed: 55,
  },
  {
    id: '5',
    trainName: 'Silk City Express',
    trainNumber: '751',
    route: 'Dhaka → Rajshahi',
    status: 'delayed' as const,
    lastUpdate: '8 min ago',
    contributors: 6,
    speed: 60,
  },
];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const stats = {
    totalTrains: mockTrains.length,
    onTime: mockTrains.filter(t => t.status === 'on-time').length,
    delayed: mockTrains.filter(t => t.status === 'delayed').length,
    totalContributors: mockTrains.reduce((acc, t) => acc + t.contributors, 0),
  };

  const selectedTrainData = mockTrains.find(t => t.id === selectedTrain);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-7 h-7 text-primary" />
              Live Train Map
            </h1>
            <p className="text-muted-foreground">
              Real-time train positions across Bangladesh
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <Train className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{stats.totalTrains} Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">{stats.onTime} On Time</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{stats.delayed} Delayed</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{stats.totalContributors} Contributors</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="card-light overflow-hidden">
              <div className="h-[500px] lg:h-[600px] relative">
                <TrainMap 
                  selectedTrainId={selectedTrain || undefined}
                  onTrainSelect={setSelectedTrain}
                />
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
                    <Maximize className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-3">
                  <p className="text-xs font-semibold text-foreground mb-2">Legend</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
                      <span className="text-xs text-muted-foreground">On Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow" />
                      <span className="text-xs text-muted-foreground">Delayed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" />
                      <span className="text-xs text-muted-foreground">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow" />
                      <span className="text-xs text-muted-foreground">Station</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Search */}
            <Card className="card-light">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Find Train</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Train List */}
            <Card className="card-light">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Active Trains</CardTitle>
                <CardDescription>
                  Tap a train to see on map
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto">
                  {mockTrains
                    .filter(train => 
                      train.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      train.trainNumber.includes(searchQuery)
                    )
                    .map((train) => (
                    <div 
                      key={train.id}
                      className={`p-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                        selectedTrain === train.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                      }`}
                      onClick={() => setSelectedTrain(train.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-foreground">{train.trainName}</h4>
                        {train.status === 'on-time' ? (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                            On Time
                          </Badge>
                        ) : train.status === 'delayed' ? (
                          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                            Delayed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                            Cancelled
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>#{train.trainNumber}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {train.contributors}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {train.lastUpdate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Train Details */}
            {selectedTrainData && (
              <Card className="card-light border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    Selected Train
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-foreground">{selectedTrainData.trainName}</h3>
                      <p className="text-sm text-muted-foreground">#{selectedTrainData.trainNumber}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-muted-foreground">Route</p>
                        <p className="font-medium text-foreground">{selectedTrainData.route}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-muted-foreground">Speed</p>
                        <p className="font-medium text-foreground">{selectedTrainData.speed || '--'} km/h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <Card className="card-light border-dashed">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Crowdsourced Location Data</h3>
              <p className="text-sm text-muted-foreground">
                Train positions are contributed by passengers like you. Share your GPS while traveling to help others track their trains!
              </p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary shrink-0">
              Community Powered
            </Badge>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
