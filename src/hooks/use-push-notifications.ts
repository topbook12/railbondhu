'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  pushNotificationService,
  NotificationPreferences,
  NotificationPayload,
} from '@/lib/push-notification-service';

/**
 * USE PUSH NOTIFICATIONS HOOK
 * ============================
 * 
 * React hook for managing web push notifications.
 * 
 * Features:
 * - Permission handling
 * - Subscription management
 * - Train-specific notifications
 * - Preference management
 * - Local notifications
 */

export interface UsePushNotificationsOptions {
  userId?: string;
  autoSubscribe?: boolean;
}

export interface UsePushNotificationsReturn {
  // Permission state
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  // Preferences
  preferences: NotificationPreferences;
  // Actions
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  showNotification: (payload: NotificationPayload) => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  subscribeToTrain: (trainId: string) => Promise<void>;
  unsubscribeFromTrain: (trainId: string) => Promise<void>;
}

export function usePushNotifications(
  options: UsePushNotificationsOptions = {}
): UsePushNotificationsReturn {
  const { userId, autoSubscribe = false } = options;

  // State
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    pushNotificationService.getPreferences()
  );

  // Check support
  const isSupported = pushNotificationService.isSupported();

  // Initialize
  useEffect(() => {
    if (!isSupported) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        // Check permission
        const perm = pushNotificationService.getPermissionStatus();
        setPermission(perm);

        // Check if already subscribed
        if (perm === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        }

        // Load preferences
        setPreferences(pushNotificationService.getPreferences());

        // Auto-subscribe if enabled and permitted
        if (autoSubscribe && perm === 'granted' && userId) {
          await pushNotificationService.subscribe(userId);
          setIsSubscribed(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [isSupported, autoSubscribe, userId]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }

    setIsLoading(true);
    setError(null);

    try {
      const perm = await pushNotificationService.requestPermission();
      setPermission(perm);
      return perm;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request permission';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Subscribe
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications are not supported');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (permission !== 'granted') {
        const perm = await requestPermission();
        if (perm !== 'granted') {
          setError('Permission denied');
          return false;
        }
      }

      await pushNotificationService.subscribe(userId);
      setIsSubscribed(true);
      
      // Update preferences
      pushNotificationService.setPreferences({ enabled: true });
      setPreferences(pushNotificationService.getPreferences());
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, userId, requestPermission]);

  // Unsubscribe
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await pushNotificationService.unsubscribe(userId);
      setIsSubscribed(false);
      
      // Update preferences
      pushNotificationService.setPreferences({ enabled: false });
      setPreferences(pushNotificationService.getPreferences());
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Show local notification
  const showNotification = useCallback(async (payload: NotificationPayload): Promise<void> => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }

    await pushNotificationService.showNotification(payload);
  }, [isSupported]);

  // Update preferences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    pushNotificationService.setPreferences(prefs);
    setPreferences(pushNotificationService.getPreferences());
  }, []);

  // Subscribe to train notifications
  const subscribeToTrain = useCallback(async (trainId: string): Promise<void> => {
    if (!userId) {
      setError('User ID required for train notifications');
      return;
    }

    try {
      await pushNotificationService.subscribeToTrain(trainId, userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe to train';
      setError(message);
    }
  }, [userId]);

  // Unsubscribe from train notifications
  const unsubscribeFromTrain = useCallback(async (trainId: string): Promise<void> => {
    if (!userId) return;

    try {
      await pushNotificationService.unsubscribeFromTrain(trainId, userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe from train';
      setError(message);
    }
  }, [userId]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    preferences,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    updatePreferences,
    subscribeToTrain,
    unsubscribeFromTrain,
  };
}

export default usePushNotifications;
