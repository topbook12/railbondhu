'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Train,
  MapPin,
  Clock,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Loader2,
  ArrowRight,
  Wifi,
  Utensils,
  Wind
} from 'lucide-react';

interface Train {
  id: string;
  trainName: string;
  trainNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: Array<{ name: string; price: number; available: number }>;
  amenities: string[];
}

export default function BookingPage() {
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'search' | 'select' | 'confirm'>('search');

  const searchTrains = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchForm.from) params.append('from', searchForm.from);
      if (searchForm.to) params.append('to', searchForm.to);
      params.append('date', searchForm.date);

      const response = await fetch(`/api/booking?${params}`);
      const data = await response.json();
      setTrains(data.trains || []);
      setStep('select');
    } catch (error) {
      console.error('Error searching trains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedTrain || !selectedClass) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainId: selectedTrain.id,
          trainName: selectedTrain.trainName,
          trainNumber: selectedTrain.trainNumber,
          from: selectedTrain.from,
          to: selectedTrain.to,
          date: searchForm.date,
          travelClass: selectedClass,
          passengers,
          seats: [`${Math.floor(Math.random() * 10) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`],
          totalPrice: (selectedTrain.classes.find(c => c.name === selectedClass)?.price || 0) * passengers,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setStep('confirm');
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'ac': return <Wind className="w-4 h-4" />;
      case 'food service': return <Utensils className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Book Tickets</h1>
          <p className="text-muted-foreground">Search and book train tickets online</p>
        </div>

        {step === 'search' && (
          <Card>
            <CardHeader>
              <CardTitle>Search Trains</CardTitle>
              <CardDescription>Find trains for your journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Dhaka"
                      value={searchForm.from}
                      onChange={(e) => setSearchForm({ ...searchForm, from: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Chittagong"
                      value={searchForm.to}
                      onChange={(e) => setSearchForm({ ...searchForm, to: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={searchForm.date}
                      onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" onClick={searchTrains} disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'select' && (
          <>
            <Button variant="ghost" onClick={() => setStep('search')} className="mb-4">
              ← Back to Search
            </Button>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {trains.length} trains found for {searchForm.from || 'Dhaka'} → {searchForm.to || 'Chittagong'}
              </h2>
              
              {trains.map((train) => (
                <Card 
                  key={train.id} 
                  className={`transition-all cursor-pointer ${selectedTrain?.id === train.id ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/30'}`}
                  onClick={() => {
                    setSelectedTrain(train);
                    setSelectedClass(train.classes[0]?.name || '');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Train className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{train.trainName}</h3>
                          <p className="text-sm text-muted-foreground">#{train.trainNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-xl font-bold">{train.departureTime}</p>
                          <p className="text-sm text-muted-foreground">{train.from}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-xs text-muted-foreground">{train.duration}</p>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{train.arrivalTime}</p>
                          <p className="text-sm text-muted-foreground">{train.to}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {train.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedTrain?.id === train.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="font-medium mb-3">Select Class & Passengers</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm mb-2 block">Travel Class</label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {train.classes.map((c) => (
                                  <SelectItem key={c.name} value={c.name}>
                                    {c.name} - ৳{c.price} ({c.available} seats)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm mb-2 block">Passengers</label>
                            <Select value={passengers.toString()} onValueChange={(v) => setPassengers(parseInt(v))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>
                                    {n} passenger{n > 1 ? 's' : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p className="text-2xl font-bold text-primary">
                              ৳{(train.classes.find(c => c.name === selectedClass)?.price || 0) * passengers}
                            </p>
                          </div>
                          <Button onClick={handleBooking} disabled={loading || !selectedClass}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Book Now'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {step === 'confirm' && (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Your ticket has been booked successfully. You will receive a confirmation email shortly.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 text-left mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-medium">BK{Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Train</span>
                    <span className="font-medium">{selectedTrain?.trainName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-medium">{selectedClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passengers</span>
                    <span className="font-medium">{passengers}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setStep('search');
                  setSelectedTrain(null);
                  setSelectedClass('');
                }}>
                  Book Another
                </Button>
                <Button className="flex-1">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
