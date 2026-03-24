/**
 * LOCATION SERVICE - Live Location Broadcasting
 * ==============================================
 * 
 * A robust, battery-efficient location tracking service for train tracking.
 * 
 * Features:
 * - High-accuracy GPS tracking
 * - Battery optimization with adaptive update intervals
 * - Background tracking support (when possible)
 * - Proper permission handling
 * - Error recovery and retry logic
 * - Speed and heading detection
 * - Accuracy-based confidence scoring
 * - Memory-efficient location history
 */

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  timestamp: Date;
  confidence: 'high' | 'medium' | 'low';
}

export interface LocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED' | 'UNKNOWN';
  message: string;
}

export interface LocationServiceConfig {
  // How often to update location (ms)
  updateInterval: number;
  // Minimum distance change to trigger update (meters)
  minDistance: number;
  // Enable high accuracy mode (uses more battery)
  highAccuracy: boolean;
  // Maximum age of cached position (ms)
  maxCacheAge: number;
  // Timeout for getting position (ms)
  timeout: number;
  // Enable background tracking
  backgroundMode: boolean;
  // Callback when location updates
  onLocationUpdate: (location: LocationData) => void;
  // Callback when error occurs
  onError: (error: LocationError) => void;
  // Callback when permission status changes
  onPermissionChange: (status: PermissionState) => void;
}

export type LocationStatus = 'idle' | 'requesting' | 'tracking' | 'paused' | 'error';

class LocationService {
  private watchId: number | null = null;
  private config: LocationServiceConfig;
  private status: LocationStatus = 'idle';
  private lastLocation: LocationData | null = null;
  private locationHistory: LocationData[] = [];
  private permissionStatus: PermissionState = 'prompt';
  private visibilityHandler: (() => void) | null = null;
  private retryCount = 0;
  private maxRetries = 3;
  private updateTimer: NodeJS.Timeout | null = null;
  private isPageVisible = true;

  // Default config with battery-optimized settings
  private defaultConfig: Partial<LocationServiceConfig> = {
    updateInterval: 5000, // 5 seconds
    minDistance: 10, // 10 meters
    highAccuracy: true,
    maxCacheAge: 10000, // 10 seconds
    timeout: 10000, // 10 seconds
    backgroundMode: false, // Disabled by default for battery
  };

  constructor(config: LocationServiceConfig) {
    this.config = { ...this.defaultConfig, ...config } as LocationServiceConfig;
  }

  /**
   * Check if geolocation is supported
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator;
  }

  /**
   * Check current permission status
   */
  async checkPermission(): Promise<PermissionState> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      this.permissionStatus = permission.state;
      
      // Listen for permission changes
      permission.addEventListener('change', () => {
        this.permissionStatus = permission.state;
        this.config.onPermissionChange(permission.state);
        
        if (permission.state === 'denied') {
          this.stop();
          this.config.onError({
            code: 'PERMISSION_DENIED',
            message: 'Location permission denied. Please enable it in your browser settings.'
          });
        }
      });

      return permission.state;
    } catch {
      // Fallback for browsers that don't support permissions API
      return 'prompt';
    }
  }

  /**
   * Request location permission and get initial position
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      this.config.onError({
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by your browser.'
      });
      return false;
    }

    this.status = 'requesting';

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.permissionStatus = 'granted';
          this.config.onPermissionChange('granted');
          this.handlePosition(position);
          resolve(true);
        },
        (error) => {
          this.handleGeolocationError(error);
          resolve(false);
        },
        {
          enableHighAccuracy: this.config.highAccuracy,
          timeout: this.config.timeout,
          maximumAge: this.config.maxCacheAge,
        }
      );
    });
  }

  /**
   * Start continuous location tracking
   */
  async start(): Promise<boolean> {
    if (!this.isSupported()) {
      this.config.onError({
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by your browser.'
      });
      return false;
    }

    // Check permission first
    const permission = await this.checkPermission();
    
    if (permission === 'denied') {
      this.config.onError({
        code: 'PERMISSION_DENIED',
        message: 'Location permission denied. Please enable it in your browser settings.'
      });
      return false;
    }

    // If permission is prompt, request it
    if (permission === 'prompt') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    // Set up visibility change handler for background mode
    this.setupVisibilityHandler();

    // Start watching position
    this.status = 'tracking';
    this.retryCount = 0;

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handlePosition(position),
        (error) => this.handleTrackingError(error),
        {
          enableHighAccuracy: this.config.highAccuracy,
          timeout: this.config.timeout,
          maximumAge: this.config.maxCacheAge,
        }
      );

      // Also set up periodic updates for reliability
      this.startPeriodicUpdates();

      return true;
    } catch (error) {
      this.config.onError({
        code: 'UNKNOWN',
        message: 'Failed to start location tracking.'
      });
      return false;
    }
  }

  /**
   * Stop location tracking
   */
  stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }

    this.removeVisibilityHandler();
    this.status = 'idle';
  }

  /**
   * Pause tracking (for battery saving)
   */
  pause(): void {
    if (this.watchId !== null && this.status === 'tracking') {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.status = 'paused';
    }
  }

  /**
   * Resume tracking after pause
   */
  resume(): void {
    if (this.status === 'paused') {
      this.start();
    }
  }

  /**
   * Get current status
   */
  getStatus(): LocationStatus {
    return this.status;
  }

  /**
   * Get last known location
   */
  getLastLocation(): LocationData | null {
    return this.lastLocation;
  }

  /**
   * Get location history
   */
  getHistory(limit = 10): LocationData[] {
    return this.locationHistory.slice(-limit);
  }

  /**
   * Get permission status
   */
  getPermissionStatus(): PermissionState {
    return this.permissionStatus;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LocationServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart tracking with new config if currently tracking
    if (this.status === 'tracking') {
      this.stop();
      this.start();
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Private methods

  private handlePosition(position: GeolocationPosition): void {
    const location: LocationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
      altitude: position.coords.altitude,
      timestamp: new Date(position.timestamp),
      confidence: this.calculateConfidence(position.coords.accuracy),
    };

    // Check if location changed enough (minDistance filter)
    if (this.lastLocation && this.config.minDistance > 0) {
      const distance = this.calculateDistance(
        this.lastLocation.lat,
        this.lastLocation.lng,
        location.lat,
        location.lng
      );

      if (distance < this.config.minDistance) {
        return; // Skip update, not enough change
      }
    }

    this.lastLocation = location;
    this.addToHistory(location);
    this.retryCount = 0; // Reset retry count on successful update

    this.config.onLocationUpdate(location);
  }

  private calculateConfidence(accuracy: number): 'high' | 'medium' | 'low' {
    if (accuracy <= 20) return 'high';
    if (accuracy <= 100) return 'medium';
    return 'low';
  }

  private addToHistory(location: LocationData): void {
    this.locationHistory.push(location);
    // Keep only last 50 locations
    if (this.locationHistory.length > 50) {
      this.locationHistory.shift();
    }
  }

  private handleGeolocationError(error: GeolocationPositionError): void {
    let locationError: LocationError;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        locationError = {
          code: 'PERMISSION_DENIED',
          message: 'Location permission denied. Please enable it in your browser settings.',
        };
        this.permissionStatus = 'denied';
        this.config.onPermissionChange('denied');
        break;
      case error.POSITION_UNAVAILABLE:
        locationError = {
          code: 'POSITION_UNAVAILABLE',
          message: 'Location information is unavailable. Please check your GPS settings.',
        };
        break;
      case error.TIMEOUT:
        locationError = {
          code: 'TIMEOUT',
          message: 'Location request timed out. Please try again.',
        };
        break;
      default:
        locationError = {
          code: 'UNKNOWN',
          message: 'An unknown error occurred while getting location.',
        };
    }

    this.status = 'error';
    this.config.onError(locationError);
  }

  private handleTrackingError(error: GeolocationPositionError): void {
    this.retryCount++;

    if (this.retryCount >= this.maxRetries) {
      this.handleGeolocationError(error);
      this.stop();
    } else {
      // Try to recover
      console.warn(`Location tracking error (attempt ${this.retryCount}/${this.maxRetries}):`, error.message);
    }
  }

  private setupVisibilityHandler(): void {
    this.visibilityHandler = () => {
      this.isPageVisible = !document.hidden;

      if (this.config.backgroundMode) {
        // If background mode is enabled, continue tracking
        return;
      }

      // Otherwise, pause/resume based on visibility
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private removeVisibilityHandler(): void {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
  }

  private startPeriodicUpdates(): void {
    // Clear existing timer
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }

    // Set up periodic getCurrentPosition for reliability
    this.updateTimer = setInterval(() => {
      if (this.status === 'tracking' && this.isPageVisible) {
        navigator.geolocation.getCurrentPosition(
          (position) => this.handlePosition(position),
          (error) => console.warn('Periodic location update failed:', error.message),
          {
            enableHighAccuracy: this.config.highAccuracy,
            timeout: this.config.timeout,
            maximumAge: 0, // Always get fresh position
          }
        );
      }
    }, this.config.updateInterval * 2); // Double interval for periodic updates
  }
}

// Export singleton factory
export function createLocationService(config: LocationServiceConfig): LocationService {
  return new LocationService(config);
}

export default LocationService;
