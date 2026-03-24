'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  Train,
  MapPin,
  Search,
  Calendar,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  trainName: string;
  trainNumber: string;
  routeName: string;
  sourceStation: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  status: 'on-time' | 'delayed' | 'cancelled';
  platform?: string;
}

const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    trainName: 'Suborno Express',
    trainNumber: '701',
    routeName: 'Dhaka - Chittagong',
    sourceStation: 'Dhaka',
    destinationStation: 'Chittagong',
    departureTime: '06:00',
    arrivalTime: '11:30',
    status: 'on-time',
    platform: '3',
  },
  {
    id: '2',
    trainName: 'Mohanagar Provati',
    trainNumber: '703',
    routeName: 'Dhaka - Sylhet',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    departureTime: '07:30',
    arrivalTime: '14:45',
    status: 'delayed',
    platform: '1',
  },
  {
    id: '3',
    trainName: 'Parabat Express',
    trainNumber: '707',
    routeName: 'Dhaka - Dinajpur',
    sourceStation: 'Dhaka',
    destinationStation: 'Dinajpur',
    departureTime: '08:15',
    arrivalTime: '15:30',
    status: 'on-time',
    platform: '2',
  },
  {
    id: '4',
    trainName: 'Turna Express',
    trainNumber: '711',
    routeName: 'Dhaka - Chittagong',
    sourceStation: 'Dhaka',
    destinationStation: 'Chittagong',
    departureTime: '09:00',
    arrivalTime: '14:30',
    status: 'on-time',
    platform: '4',
  },
  {
    id: '5',
    trainName: 'Upaban Express',
    trainNumber: '715',
    routeName: 'Dhaka - Sylhet',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    departureTime: '14:00',
    arrivalTime: '21:15',
    status: 'on-time',
    platform: '2',
  },
  {
    id: '6',
    trainName: 'Jayantika Express',
    trainNumber: '717',
    routeName: 'Dhaka - Sylhet',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    departureTime: '15:30',
    arrivalTime: '22:45',
    status: 'delayed',
    platform: '1',
  },
  {
    id: '7',
    trainName: 'Mahanagar Godhuli',
    trainNumber: '705',
    routeName: 'Dhaka - Sylhet',
    sourceStation: 'Dhaka',
    destinationStation: 'Sylhet',
    departureTime: '16:30',
    arrivalTime: '23:45',
    status: 'cancelled',
    platform: '3',
  },
  {
    id: '8',
    trainName: 'Kalni Express',
    trainNumber: '713',
    routeName: 'Dhaka - Kulaura',
    sourceStation: 'Dhaka',
    destinationStation: 'Kulaura',
    departureTime: '10:00',
    arrivalTime: '17:30',
    status: 'on-time',
    platform: '2',
  },
];

const stations = [
  { value: 'all', label: 'All Stations' },
  { value: 'dhaka', label: 'Dhaka' },
  { value: 'chittagong', label: 'Chittagong' },
  { value: 'sylhet', label: 'Sylhet' },
  { value: 'dinajpur', label: 'Dinajpur' },
  { value: 'rajshahi', label: 'Rajshahi' },
];

const routes = [
  { value: 'all', label: 'All Routes' },
  { value: 'dhaka-chittagong', label: 'Dhaka - Chittagong' },
  { value: 'dhaka-sylhet', label: 'Dhaka - Sylhet' },
  { value: 'dhaka-dinajpur', label: 'Dhaka - Dinajpur' },
];

export default function SchedulePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('all');

  const filteredSchedule = useMemo(() => {
    let filtered = [...mockSchedule];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.trainName.toLowerCase().includes(query) ||
          item.trainNumber.includes(query) ||
          item.sourceStation.toLowerCase().includes(query) ||
          item.destinationStation.toLowerCase().includes(query)
      );
    }

    // Station filter
    if (selectedStation !== 'all') {
      filtered = filtered.filter(
        (item) =>
          item.sourceStation.toLowerCase() === selectedStation ||
          item.destinationStation.toLowerCase() === selectedStation
      );
    }

    // Route filter
    if (selectedRoute !== 'all') {
      filtered = filtered.filter((item) =>
        item.routeName.toLowerCase().includes(selectedRoute.replace('-', ' '))
      );
    }

    // Tab filter
    if (activeTab === 'departing') {
      filtered = filtered.filter((item) => item.sourceStation === 'Dhaka');
    } else if (activeTab === 'arriving') {
      filtered = filtered.filter((item) => item.destinationStation === 'Dhaka');
    }

    return filtered;
  }, [searchQuery, selectedStation, selectedRoute, activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">On Time</Badge>;
      case 'delayed':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">Delayed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600/20 text-red-400 border-red-600/30">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Group schedule by time periods
  const groupedSchedule = {
    morning: filteredSchedule.filter(item => parseInt(item.departureTime.split(':')[0]) < 12),
    afternoon: filteredSchedule.filter(item => {
      const hour = parseInt(item.departureTime.split(':')[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: filteredSchedule.filter(item => parseInt(item.departureTime.split(':')[0]) >= 17),
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            Train Schedule
          </h1>
          <p className="text-muted-foreground">
            View departure and arrival times for all trains
          </p>
        </div>

        {/* Date Selector & Filters */}
        <Card className="glass">
          <CardContent className="p-4 space-y-4">
            {/* Date Row */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-muted/50 border border-border rounded-md px-3 py-2 text-foreground"
                />
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trains, stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-border">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.value} value={station.value}>
                      {station.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-border">
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
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Trains</TabsTrigger>
            <TabsTrigger value="departing">Departing</TabsTrigger>
            <TabsTrigger value="arriving">Arriving</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {/* Morning */}
            {groupedSchedule.morning.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Morning (Before 12 PM)
                </h3>
                {groupedSchedule.morning.map((item) => (
                  <ScheduleCard key={item.id} item={item} formatTime={formatTime} getStatusBadge={getStatusBadge} />
                ))}
              </div>
            )}

            {/* Afternoon */}
            {groupedSchedule.afternoon.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Afternoon (12 PM - 5 PM)
                </h3>
                {groupedSchedule.afternoon.map((item) => (
                  <ScheduleCard key={item.id} item={item} formatTime={formatTime} getStatusBadge={getStatusBadge} />
                ))}
              </div>
            )}

            {/* Evening */}
            {groupedSchedule.evening.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Evening (After 5 PM)
                </h3>
                {groupedSchedule.evening.map((item) => (
                  <ScheduleCard key={item.id} item={item} formatTime={formatTime} getStatusBadge={getStatusBadge} />
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredSchedule.length === 0 && (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <Train className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No trains found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{filteredSchedule.length}</div>
              <p className="text-xs text-muted-foreground">Total Trains</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {filteredSchedule.filter(s => s.status === 'on-time').length}
              </div>
              <p className="text-xs text-muted-foreground">On Time</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {filteredSchedule.filter(s => s.status === 'delayed').length}
              </div>
              <p className="text-xs text-muted-foreground">Delayed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

// Schedule Card Component
function ScheduleCard({ 
  item, 
  formatTime, 
  getStatusBadge 
}: { 
  item: ScheduleItem; 
  formatTime: (time: string) => string; 
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  return (
    <Link href={`/app/trains/${item.id}`}>
      <Card className="glass hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Train className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{item.trainName}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-muted-foreground">#{item.trainNumber}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatTime(item.departureTime)}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.sourceStation}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-8 h-0.5 bg-border" />
                <ArrowRight className="w-4 h-4" />
                <div className="w-8 h-0.5 bg-border" />
              </div>

              {/* Arrival */}
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatTime(item.arrivalTime)}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.destinationStation}
                </p>
              </div>
            </div>

            {item.platform && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="font-bold text-foreground">{item.platform}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
