'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin,
  Building2,
  Phone,
  Clock,
  Train,
  Search,
  ArrowRight,
  Users,
  Calendar,
  Wifi,
  Coffee,
  Car,
  Accessibility,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/*
 * STATIONS PAGE
 * =============
 * 
 * Features:
 * - Browse all stations
 * - Search stations
 * - View station details
 * - See facilities
 * - Check train schedules
 */

interface Station {
  id: string;
  stationName: string;
  stationCode?: string;
  city?: string;
  division?: string;
  lat: number;
  lng: number;
  platformCount?: number;
  facilities?: string[];
  openingTime?: string;
  closingTime?: string;
  contactNumber?: string;
  address?: string;
  trainCount: number;
}

const FACILITY_ICONS: Record<string, { icon: typeof Coffee; label: string }> = {
  'waiting-room': { icon: Coffee, label: 'Waiting Room' },
  'ticket-counter': { icon: Ticket, label: 'Ticket Counter' },
  'wifi': { icon: Wifi, label: 'Free WiFi' },
  'parking': { icon: Car, label: 'Parking' },
  'food': { icon: Coffee, label: 'Food Court' },
  'accessible': { icon: Accessibility, label: 'Accessible' },
};

const DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Khulna',
  'Rajshahi',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export default function StationsPage() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    filterStations();
  }, [searchQuery, selectedDivision, stations]);

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/stations');
      const data = await response.json();
      setStations(data);
      setFilteredStations(data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStations = () => {
    let filtered = stations;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.stationCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by division
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(s => s.division === selectedDivision);
    }
    
    setFilteredStations(filtered);
  };

  // Generate mock facilities for demo
  const getMockFacilities = (station: Station): string[] => {
    const facilities = ['waiting-room', 'ticket-counter'];
    if (station.trainCount > 20) facilities.push('wifi');
    if (station.trainCount > 30) facilities.push('food');
    if (station.platformCount && station.platformCount > 3) facilities.push('parking');
    facilities.push('accessible');
    return facilities;
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Stations</h1>
          </div>
          <p className="text-muted-foreground">
            Browse railway stations across Bangladesh with facilities and information.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="card-light">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stations by name, code, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                variant={selectedDivision === 'all' ? 'default' : 'outline'}
                size="sm"
                className={selectedDivision === 'all' ? 'btn-primary' : ''}
                onClick={() => setSelectedDivision('all')}
              >
                All
              </Button>
              {DIVISIONS.map(division => (
                <Button
                  key={division}
                  variant={selectedDivision === division ? 'default' : 'outline'}
                  size="sm"
                  className={selectedDivision === division ? 'btn-primary' : ''}
                  onClick={() => setSelectedDivision(division)}
                >
                  {division}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary">{stations.length}</div>
              <p className="text-sm text-muted-foreground">Total Stations</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-accent">
                {stations.filter(s => s.trainCount > 20).length}
              </div>
              <p className="text-sm text-muted-foreground">Major Stations</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-600">{DIVISIONS.length}</div>
              <p className="text-sm text-muted-foreground">Divisions</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary">
                {stations.reduce((sum, s) => sum + (s.platformCount || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Platforms</p>
            </CardContent>
          </Card>
        </div>

        {/* Station List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Train className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
            <p className="mt-4 text-muted-foreground">Loading stations...</p>
          </div>
        ) : filteredStations.length === 0 ? (
          <Card className="card-light">
            <CardContent className="p-12 text-center">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No stations found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedDivision('all'); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStations.map(station => (
              <Card 
                key={station.id} 
                className="card-light hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => setSelectedStation(selectedStation?.id === station.id ? null : station)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg icon-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{station.stationName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {station.stationCode && (
                            <Badge variant="outline" className="text-xs">
                              {station.stationCode}
                            </Badge>
                          )}
                          {station.city && <span>{station.city}</span>}
                        </div>
                      </div>
                    </div>
                    {station.division && (
                      <Badge className="bg-primary/10 text-primary text-xs">
                        {station.division}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <div className="font-medium text-foreground">{station.trainCount}</div>
                      <div className="text-xs text-muted-foreground">Trains</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <div className="font-medium text-foreground">{station.platformCount || '-'}</div>
                      <div className="text-xs text-muted-foreground">Platforms</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <div className="font-medium text-foreground">
                        {getMockFacilities(station).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Facilities</div>
                    </div>
                  </div>
                  
                  {/* Facilities */}
                  <div className="flex flex-wrap gap-2">
                    {getMockFacilities(station).slice(0, 4).map(facility => {
                      const facilityInfo = FACILITY_ICONS[facility];
                      if (!facilityInfo) return null;
                      const Icon = facilityInfo.icon;
                      return (
                        <div 
                          key={facility}
                          className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded"
                        >
                          <Icon className="w-3 h-3" />
                          <span>{facilityInfo.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedStation?.id === station.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-3">
                        {station.address && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">{station.address}</span>
                          </div>
                        )}
                        {station.contactNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{station.contactNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {station.openingTime || '6:00 AM'} - {station.closingTime || '10:00 PM'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Link href={`/app/trains?station=${station.id}`} className="flex-1">
                            <Button size="sm" className="w-full btn-primary">
                              <Train className="w-4 h-4 mr-2" />
                              View Trains
                            </Button>
                          </Link>
                          <Link href={`/app/schedule?station=${station.id}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full">
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="card-light">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/app/trains">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Train className="w-5 h-5 mb-1" />
                  <span className="text-xs">Find Trains</span>
                </Button>
              </Link>
              <Link href="/app/journey">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <MapPin className="w-5 h-5 mb-1" />
                  <span className="text-xs">Plan Journey</span>
                </Button>
              </Link>
              <Link href="/app/favorites">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Search className="w-5 h-5 mb-1" />
                  <span className="text-xs">Favorites</span>
                </Button>
              </Link>
              <Link href="/app/schedule">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Clock className="w-5 h-5 mb-1" />
                  <span className="text-xs">Schedule</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
