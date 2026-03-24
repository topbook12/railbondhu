/**
 * PUSH NOTIFICATION SERVICE
 * =========================
 * 
 * Service for managing web push notifications in the browser.
 * 
 * Features:
 * - Request notification permission
 * - Subscribe to push notifications
 * - Store push subscription in backend
 * - Handle incoming push messages
 * - Display notifications
 * - Handle notification clicks
 */

// VAPID public key (should be generated and stored securely)
// For development, we'll use a placeholder - in production this should be an environment variable
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface NotificationPreferences {
  enabled: boolean;
  trainUpdates: boolean;
  delayAlerts: boolean;
  locationUpdates: boolean;
  chatMessages: boolean;
  nearbyStations: boolean;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private preferences: NotificationPreferences = {
    enabled: false,
    trainUpdates: true,
    delayAlerts: true,
    locationUpdates: false,
    chatMessages: true,
    nearbyStations: true,
  };

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!this.isSupported()) {
      throw new Error('Service workers are not supported');
    }

    this.registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    return this.registration;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(userId?: string): Promise<PushSubscriptionData | null> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported');
    }

    // Check permission
    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
    }

    // Register service worker if not already registered
    if (!this.registration) {
      await this.registerServiceWorker();
    }

    // Get existing subscription or create new one
    let subscription = await this.registration!.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      try {
        subscription = await this.registration!.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        throw new Error('Failed to subscribe to push notifications');
      }
    }

    this.subscription = subscription;

    // Convert to serializable format
    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
      },
    };

    // Store subscription in backend
    if (userId) {
      await this.saveSubscriptionToBackend(subscriptionData, userId);
    }

    return subscriptionData;
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(userId?: string): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    const success = await this.subscription.unsubscribe();
    this.subscription = null;

    // Remove from backend
    if (userId && success) {
      await this.removeSubscriptionFromBackend(userId);
    }

    return success;
  }

  /**
   * Save subscription to backend
   */
  private async saveSubscriptionToBackend(
    subscription: PushSubscriptionData,
    userId: string
  ): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, userId }),
      });
    } catch (error) {
      console.error('Failed to save push subscription:', error);
    }
  }

  /**
   * Remove subscription from backend
   */
  private async removeSubscriptionFromBackend(userId: string): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Failed to remove push subscription:', error);
    }
  }

  /**
   * Show a local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.registration) {
      await this.registerServiceWorker();
    }

    await this.registration!.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
      tag: payload.tag,
      data: payload.data,
      actions: payload.actions,
    });
  }

  /**
   * Get stored preferences
   */
  getPreferences(): NotificationPreferences {
    if (typeof window === 'undefined') return this.preferences;
    
    const stored = localStorage.getItem('notification-preferences');
    if (stored) {
      try {
        this.preferences = JSON.parse(stored);
      } catch {
        // Use defaults
      }
    }
    return this.preferences;
  }

  /**
   * Update preferences
   */
  setPreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification-preferences', JSON.stringify(this.preferences));
    }
  }

  /**
   * Subscribe to a specific train's notifications
   */
  async subscribeToTrain(trainId: string, userId: string): Promise<void> {
    try {
      await fetch('/api/notifications/trains/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainId, userId }),
      });
    } catch (error) {
      console.error('Failed to subscribe to train notifications:', error);
    }
  }

  /**
   * Unsubscribe from a specific train's notifications
   */
  async unsubscribeFromTrain(trainId: string, userId: string): Promise<void> {
    try {
      await fetch('/api/notifications/trains/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainId, userId }),
      });
    } catch (error) {
      console.error('Failed to unsubscribe from train notifications:', error);
    }
  }

  /**
   * Convert base64 string to Uint8Array for VAPID key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Export singleton
export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
