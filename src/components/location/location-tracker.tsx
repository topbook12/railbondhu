'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MapPin,
  Navigation,
  Battery,
  Wifi,
  WifiOff,
  Play,
  Square,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useLocationTracking, LocationData } from '@/hooks/use-location-tracking';

/**
 * LOCATION TRACKER COMPONENT
 * ==========================
 * 
 * A comprehensive UI component for live location broadcasting.
 * 
 * Features:
 * - Visual permission handling
 * - Real-time status display
 * - Battery optimization indicators
 * - Accuracy visualization
 * - One-click start/stop
 * - Privacy indicators
 */

interface LocationTrackerProps {
  trainId: string;
  onLocationUpdate?: (location: LocationData) => void;
  isSocketConnected?: boolean;
}

export function LocationTracker({
  trainId,
  onLocationUpdate,
  isSocketConnected = false,
}: LocationTrackerProps) {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [batteryOptimized, setBatteryOptimized] = useState(true);
  const [highAccuracyMode, setHighAccuracyMode] = useState(true);

  const {
    location,
    status,
    permission,
    error,
    isTracking,
    isSupported,
    start,
    stop,
    requestPermission,
    getSpeedKmh,
    getAccuracy,
    getConfidence,
  } = useLocationTracking({
    trainId,
    highAccuracy: highAccuracyMode,
    updateInterval: batteryOptimized ? 10000 : 5000,
    minDistance: batteryOptimized ? 20 : 10,
    backgroundMode: false,
    onLocationUpdate,
  });

  // Handle permission request
  const handleRequestPermission = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionDialog(false);
      start();
    }
  }, [requestPermission, start]);

  // Handle start/stop toggle
  const handleToggleTracking = useCallback(async () => {
    if (isTracking) {
      stop();
    } else {
      if (permission === 'granted') {
        start();
      } else {
        setShowPermissionDialog(true);
      }
    }
  }, [isTracking, permission, start, stop]);

  // Status badge
  const getStatusBadge = () => {
    switch (status) {
      case 'tracking':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5" />
            Tracking Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case 'requesting':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1 animate-spin" />
            Requesting...
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Square className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
    }
  };

  // Confidence indicator
  const getConfidenceIndicator = () => {
    const confidence = getConfidence();
    switch (confidence) {
      case 'high':
        return (
          <div className="flex items-center gap-1.5 text-green-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">High Accuracy</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1.5 text-yellow-600">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Medium Accuracy</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1.5 text-red-600">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-sm font-medium">Low Accuracy</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Permission status
  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return (
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Permission granted</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center gap-1.5 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Permission denied</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Info className="w-4 h-4" />
            <span className="text-sm">Permission required</span>
          </div>
        );
    }
  };

  // Accuracy progress bar
  const getAccuracyProgress = () => {
    const accuracy = getAccuracy();
    if (!accuracy) return null;

    // Invert: lower accuracy value = better (higher progress)
    const progressValue = Math.max(0, Math.min(100, 100 - accuracy));
    const progressColor =
      accuracy <= 20 ? 'bg-green-500' : accuracy <= 100 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>GPS Accuracy</span>
          <span>±{Math.round(accuracy)}m</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
    );
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>
          Your browser doesn&apos;t support geolocation. Please use a modern browser to enable location tracking.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card className={`card-light ${isTracking ? 'border-green-200 bg-green-50/30' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Live Location Sharing
            </CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>
            Share your location to help other passengers track this train
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Current Location Info */}
          {location && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Current Speed
                </p>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">
                    {getSpeedKmh() ? `${Math.round(getSpeedKmh()!)} km/h` : '-- km/h'}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  GPS Accuracy
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">
                    {getAccuracy() ? `±${Math.round(getAccuracy()!)}m` : '--'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Accuracy Progress */}
          {isTracking && getAccuracyProgress()}

          {/* Status Indicators */}
          <div className="flex items-center justify-between">
            {getPermissionStatus()}
            {getConfidenceIndicator()}
          </div>

          {/* Socket Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSocketConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Connected to server</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-500" />
                <span>Connecting to server...</span>
              </>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="battery-mode" className="text-sm">
                  Battery Saver Mode
                </Label>
              </div>
              <Switch
                id="battery-mode"
                checked={batteryOptimized}
                onCheckedChange={setBatteryOptimized}
                disabled={isTracking}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="high-accuracy" className="text-sm">
                  High Accuracy GPS
                </Label>
              </div>
              <Switch
                id="high-accuracy"
                checked={highAccuracyMode}
                onCheckedChange={setHighAccuracyMode}
                disabled={isTracking}
              />
            </div>
          </div>

          {/* Battery Warning */}
          {batteryOptimized && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 text-blue-700 text-sm">
              <Battery className="w-4 h-4" />
              <span>Battery saver: Updates every 10s, min 20m change</span>
            </div>
          )}

          {/* Action Button */}
          <Button
            className={`w-full ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'}`}
            onClick={handleToggleTracking}
            disabled={status === 'requesting'}
          >
            {isTracking ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop Sharing Location
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Sharing Location
              </>
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Your location is shared anonymously with other passengers
          </p>
        </CardContent>
      </Card>

      {/* Permission Request Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location Permission Required
            </DialogTitle>
            <DialogDescription>
              To share your location with other passengers, we need your permission to access your device&apos;s GPS.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Your Privacy is Protected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your location is shared anonymously. Other passengers will see the train&apos;s position, not your personal details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Battery className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Battery Optimized</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We use smart tracking to minimize battery usage while maintaining accurate updates.
                </p>
              </div>
            </div>

            {permission === 'denied' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Permission Previously Denied</AlertTitle>
                <AlertDescription>
                  You&apos;ve previously denied location access. Please enable it in your browser settings and refresh the page.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestPermission} className="btn-primary">
              <MapPin className="w-4 h-4 mr-2" />
              Grant Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LocationTracker;
