'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar,
  MapPin, 
  ArrowRight,
  Plus,
  Trash2,
  Clock,
  Train,
  Route,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/*
 * JOURNEY PLANNING PAGE
 * =====================
 * 
 * Features:
 * - Plan multi-leg journeys
 * - Add departure/arrival stations
 * - Select trains for each leg
 * - Save journey plans
 * - View saved journeys
 */

interface Journey {
  id: string;
  fromStationId: string;
  toStationId: string;
  departureDate: string;
  preferredClass: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface Station {
  id: string;
  stationName: string;
  stationCode?: string;
  city?: string;
}

export default function JourneyPage() {
  const router = useRouter();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  // New journey form state
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [preferredClass, setPreferredClass] = useState('Shovan');
  const [notes, setNotes] = useState('');
  const [stationSearch, setStationSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchJourneys();
    fetchStations();
  }, []);

  const fetchJourneys = async () => {
    try {
      const response = await fetch('/api/journey?userId=demo-user');
      const data = await response.json();
      setJourneys(data);
    } catch (error) {
      console.error('Failed to fetch journeys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/stations');
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const createJourney = async () => {
    if (!fromStation || !toStation || !departureDate) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          fromStationId: fromStation,
          toStationId: toStation,
          departureDate,
          preferredClass,
          notes,
        }),
      });
      
      if (response.ok) {
        const newJourney = await response.json();
        setJourneys([newJourney, ...journeys]);
        setShowCreate(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create journey:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteJourney = async (journeyId: string) => {
    try {
      await fetch('/api/journey', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId }),
      });
      setJourneys(journeys.filter(j => j.id !== journeyId));
    } catch (error) {
      console.error('Failed to delete journey:', error);
    }
  };

  const resetForm = () => {
    setFromStation('');
    setToStation('');
    setDepartureDate('');
    setPreferredClass('Shovan');
    setNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-700">Planned</Badge>;
      case 'in-progress':
        return <Badge className="bg-green-100 text-green-700">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredStations = stations.filter(s => 
    s.stationName.toLowerCase().includes(stationSearch.toLowerCase()) ||
    s.stationCode?.toLowerCase().includes(stationSearch.toLowerCase()) ||
    s.city?.toLowerCase().includes(stationSearch.toLowerCase())
  );

  const getStationName = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    return station?.stationName || 'Unknown Station';
  };

  const upcomingJourneys = journeys.filter(j => 
    new Date(j.departureDate) >= new Date() && j.status !== 'completed'
  );
  const pastJourneys = journeys.filter(j => 
    new Date(j.departureDate) < new Date() || j.status === 'completed'
  );

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Route className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Journey Planner</h1>
            </div>
            <p className="text-muted-foreground">
              Plan your train journeys and track your trips.
            </p>
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? (
              <>Cancel</>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Plan Journey
              </>
            )}
          </Button>
        </div>

        {/* Create Journey Form */}
        {showCreate && (
          <Card className="card-light border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Plan New Journey
              </CardTitle>
              <CardDescription>
                Enter your journey details to create a plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From Station</Label>
                  <select
                    id="from"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select departure station</option>
                    {filteredStations.map(station => (
                      <option key={station.id} value={station.id}>
                        {station.stationName} {station.stationCode && `(${station.stationCode})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To Station</Label>
                  <select
                    id="to"
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select arrival station</option>
                    {filteredStations.map(station => (
                      <option key={station.id} value={station.id}>
                        {station.stationName} {station.stationCode && `(${station.stationCode})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Departure Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Preferred Class</Label>
                  <select
                    id="class"
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value)}
                    className="w-full p-2 rounded-lg border border-input bg-background"
                  >
                    <option value="Shovan">Shovan</option>
                    <option value="Snigdha">Snigdha</option>
                    <option value="AC">AC</option>
                    <option value="First Class">First Class</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add any notes for this journey..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  className="btn-primary"
                  onClick={createJourney}
                  disabled={!fromStation || !toStation || !departureDate || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Save Journey
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary">{upcomingJourneys.length}</div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-600">{pastJourneys.length}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-accent">{journeys.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Journeys */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Journeys
          </h2>
          
          {upcomingJourneys.length === 0 ? (
            <Card className="card-light">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No upcoming journeys</p>
                <Button 
                  variant="link" 
                  className="text-primary"
                  onClick={() => setShowCreate(true)}
                >
                  Plan your first journey
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingJourneys.map(journey => (
                <Card key={journey.id} className="card-light">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(journey.status)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(journey.departureDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium">{getStationName(journey.fromStationId)}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{getStationName(journey.toStationId)}</span>
                        </div>
                        {journey.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{journey.notes}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span>Class: {journey.preferredClass}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteJourney(journey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Journeys */}
        {pastJourneys.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Past Journeys
            </h2>
            <div className="space-y-3">
              {pastJourneys.slice(0, 5).map(journey => (
                <Card key={journey.id} className="card-light opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(journey.status)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(journey.departureDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{getStationName(journey.fromStationId)}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{getStationName(journey.toStationId)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteJourney(journey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
