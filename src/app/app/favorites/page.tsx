'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Train, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Trash2,
  Search,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/*
 * FAVORITE TRAINS PAGE
 * ====================
 * 
 * Features:
 * - View all favorite trains
 * - Quick access to train details
 * - Remove from favorites
 * - Live status updates
 * - Delay predictions
 */

interface FavoriteTrain {
  id: string;
  trainId: string;
  createdAt: string;
  train: {
    id: string;
    trainName: string;
    trainNumber: string;
    routeName: string;
    sourceStation: string;
    destinationStation: string;
    status: string;
    trainType?: string;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteTrain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<Record<string, { predictedDelay: number }>>({});

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites?userId=demo-user');
      const data = await response.json();
      setFavorites(data);
      
      // Fetch delay predictions for each favorite
      for (const fav of data) {
        fetchPrediction(fav.trainId);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrediction = async (trainId: string) => {
    try {
      const response = await fetch(`/api/delay-prediction?trainId=${trainId}`);
      const data = await response.json();
      setPredictions(prev => ({
        ...prev,
        [trainId]: data,
      }));
    } catch {
      // Ignore prediction errors
    }
  };

  const removeFavorite = async (trainId: string) => {
    try {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', trainId }),
      });
      setFavorites(favorites.filter(f => f.trainId !== trainId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-green-100 text-green-700 border-green-200">On Time</Badge>;
      case 'delayed':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Delayed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getDelayIndicator = (trainId: string) => {
    const prediction = predictions[trainId];
    if (!prediction) return null;
    
    const delay = prediction.predictedDelay;
    if (delay <= 10) {
      return <span className="text-green-600 text-sm">~{delay}min delay expected</span>;
    } else if (delay <= 30) {
      return <span className="text-yellow-600 text-sm">~{delay}min delay expected</span>;
    }
    return <span className="text-red-600 text-sm">~{delay}min delay expected</span>;
  };

  const filteredFavorites = favorites.filter(fav => 
    fav.train.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.train.trainNumber.includes(searchQuery)
  );

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Favorite Trains</h1>
          </div>
          <p className="text-muted-foreground">
            Quick access to your saved trains with live updates and delay predictions.
          </p>
        </div>

        {/* Search */}
        <Card className="card-light">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary">{favorites.length}</div>
              <p className="text-sm text-muted-foreground">Total Favorites</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-600">
                {favorites.filter(f => f.train.status === 'on-time').length}
              </div>
              <p className="text-sm text-muted-foreground">On Time</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-yellow-600">
                {favorites.filter(f => f.train.status === 'delayed').length}
              </div>
              <p className="text-sm text-muted-foreground">Delayed</p>
            </CardContent>
          </Card>
          <Card className="card-light text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-accent">
                {Object.values(predictions).reduce((sum, p) => sum + p.predictedDelay, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Delay (min)</p>
            </CardContent>
          </Card>
        </div>

        {/* Favorites List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Train className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
            <p className="mt-4 text-muted-foreground">Loading favorites...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <Card className="card-light">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'No matching favorites' : 'No favorites yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Add trains to your favorites for quick access'}
              </p>
              <Link href="/app/trains">
                <Button className="btn-primary">
                  <Train className="w-4 h-4 mr-2" />
                  Browse Trains
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <Card 
                key={favorite.id} 
                className="card-light hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => router.push(`/app/train/${favorite.trainId}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg icon-primary">
                          <Train className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {favorite.train.trainName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            #{favorite.train.trainNumber}
                          </p>
                        </div>
                        {getStatusBadge(favorite.train.status)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{favorite.train.sourceStation}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span>{favorite.train.destinationStation}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {getDelayIndicator(favorite.trainId)}
                        <span className="text-xs text-muted-foreground">
                          Added {new Date(favorite.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(favorite.trainId);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
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
                  <Search className="w-5 h-5 mb-1" />
                  <span className="text-xs">Find Trains</span>
                </Button>
              </Link>
              <Link href="/app/journey">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Calendar className="w-5 h-5 mb-1" />
                  <span className="text-xs">Plan Journey</span>
                </Button>
              </Link>
              <Link href="/app/stations">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <MapPin className="w-5 h-5 mb-1" />
                  <span className="text-xs">Stations</span>
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
