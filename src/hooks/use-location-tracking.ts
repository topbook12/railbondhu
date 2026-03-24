'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LocationService,
  LocationData,
  LocationError,
  LocationStatus,
  createLocationService,
} from '@/lib/location-service';

/**
 * USE LOCATION TRACKING HOOK
 * ==========================
 * 
 * React hook for live location broadcasting in train tracking.
 * 
 * Features:
 * - Automatic service lifecycle management
 * - Real-time location updates via WebSocket
 * - Battery-efficient tracking modes
 * - Permission handling
 * - Error recovery
 * - Train-specific location broadcasting
 */

export interface UseLocationTrackingOptions {
  // Train ID to broadcast location to
  trainId?: string;
  // Enable high accuracy (uses more battery)
  highAccuracy?: boolean;
  // Update interval in ms (default: 5000)
  updateInterval?: number;
  // Minimum distance change to trigger update (meters)
  minDistance?: number;
  // Enable background tracking
  backgroundMode?: boolean;
  // Auto-start tracking on mount
  autoStart?: boolean;
  // Callback for location updates
  onLocationUpdate?: (location: LocationData) => void;
  // Callback for errors
  onError?: (error: LocationError) => void;
  // Callback for status changes
  onStatusChange?: (status: LocationStatus) => void;
}

export interface UseLocationTrackingReturn {
  // Current location
  location: LocationData | null;
  // Location history
  history: LocationData[];
  // Current status
  status: LocationStatus;
  // Permission status
  permission: PermissionState;
  // Last error
  error: LocationError | null;
  // Is currently tracking
  isTracking: boolean;
  // Is location supported
  isSupported: boolean;
  // Start tracking
  start: () => Promise<boolean>;
  // Stop tracking
  stop: () => void;
  // Pause tracking
  pause: () => void;
  // Resume tracking
  resume: () => void;
  // Request permission
  requestPermission: () => Promise<boolean>;
  // Get distance to a point
  getDistanceTo: (lat: number, lng: number) => number | null;
  // Get speed in km/h
  getSpeedKmh: () => number | null;
  // Get heading in degrees
  getHeading: () => number | null;
  // Get accuracy in meters
  getAccuracy: () => number | null;
  // Get confidence level
  getConfidence: () => 'high' | 'medium' | 'low' | null;
}

export function useLocationTracking(
  options: UseLocationTrackingOptions = {}
): UseLocationTrackingReturn {
  const {
    trainId,
    highAccuracy = true,
    updateInterval = 5000,
    minDistance = 10,
    backgroundMode = false,
    autoStart = false,
    onLocationUpdate,
    onError,
    onStatusChange,
  } = options;

  // State
  const [location, setLocation] = useState<LocationData | null>(null);
  const [history, setHistory] = useState<LocationData[]>([]);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [error, setError] = useState<LocationError | null>(null);
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof navigator === 'undefined') return false;
    return 'geolocation' in navigator;
  });

  // Refs
  const serviceRef = useRef<LocationService | null>(null);
  const socketRef = useRef<{
    emit: (event: string, data: unknown) => void;
    connected: boolean;
  } | null>(null);

  // Handle location update
  const handleLocationUpdate = useCallback(
    (loc: LocationData) => {
      setLocation(loc);
      setHistory((prev) => [...prev.slice(-49), loc]);
      setError(null);

      // Broadcast to socket if available
      if (trainId && socketRef.current?.connected) {
        socketRef.current.emit('location-update', {
          trainId,
          lat: loc.lat,
          lng: loc.lng,
          speed: loc.speed,
          heading: loc.heading,
          accuracy: loc.accuracy,
          confidence: loc.confidence,
          timestamp: loc.timestamp.toISOString(),
        });
      }

      // Call external callback
      onLocationUpdate?.(loc);
    },
    [trainId, onLocationUpdate]
  );

  // Handle error
  const handleError = useCallback(
    (err: LocationError) => {
      setError(err);
      onError?.(err);
    },
    [onError]
  );

  // Handle permission change
  const handlePermissionChange = useCallback((perm: PermissionState) => {
    setPermission(perm);
  }, []);

  // Initialize service
  useEffect(() => {
    serviceRef.current = createLocationService({
      updateInterval,
      minDistance,
      highAccuracy,
      backgroundMode,
      maxCacheAge: 10000,
      timeout: 10000,
      onLocationUpdate: handleLocationUpdate,
      onError: handleError,
      onPermissionChange: handlePermissionChange,
    });

    // Check initial permission
    serviceRef.current.checkPermission().then(setPermission);

    return () => {
      serviceRef.current?.stop();
    };
  }, [updateInterval, minDistance, highAccuracy, backgroundMode, handleLocationUpdate, handleError, handlePermissionChange]);

  // Update status when it changes
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && serviceRef.current && permission === 'granted') {
      serviceRef.current.start().then((started) => {
        if (started) {
          setStatus('tracking');
        }
      });
    }
  }, [autoStart, permission]);

  // Start tracking
  const start = useCallback(async (): Promise<boolean> => {
    if (!serviceRef.current) return false;

    const started = await serviceRef.current.start();
    if (started) {
      setStatus('tracking');
      setError(null);
    }
    return started;
  }, []);

  // Stop tracking
  const stop = useCallback(() => {
    serviceRef.current?.stop();
    setStatus('idle');
  }, []);

  // Pause tracking
  const pause = useCallback(() => {
    serviceRef.current?.pause();
    setStatus('paused');
  }, []);

  // Resume tracking
  const resume = useCallback(() => {
    serviceRef.current?.resume();
    setStatus('tracking');
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!serviceRef.current) return false;
    return serviceRef.current.requestPermission();
  }, []);

  // Get distance to a point
  const getDistanceTo = useCallback((lat: number, lng: number): number | null => {
    if (!location || !serviceRef.current) return null;
    return serviceRef.current.calculateDistance(location.lat, location.lng, lat, lng);
  }, [location]);

  // Get speed in km/h
  const getSpeedKmh = useCallback((): number | null => {
    if (!location?.speed) return null;
    return location.speed * 3.6; // m/s to km/h
  }, [location]);

  // Get heading
  const getHeading = useCallback((): number | null => {
    return location?.heading ?? null;
  }, [location]);

  // Get accuracy
  const getAccuracy = useCallback((): number | null => {
    return location?.accuracy ?? null;
  }, [location]);

  // Get confidence
  const getConfidence = useCallback((): 'high' | 'medium' | 'low' | null => {
    return location?.confidence ?? null;
  }, [location]);

  // Set socket reference for broadcasting
  const setSocket = useCallback(
    (socket: { emit: (event: string, data: unknown) => void; connected: boolean }) => {
      socketRef.current = socket;
    },
    []
  );

  return {
    location,
    history,
    status,
    permission,
    error,
    isTracking: status === 'tracking',
    isSupported,
    start,
    stop,
    pause,
    resume,
    requestPermission,
    getDistanceTo,
    getSpeedKmh,
    getHeading,
    getAccuracy,
    getConfidence,
  };
}

export default useLocationTracking;
