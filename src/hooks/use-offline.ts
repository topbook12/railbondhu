/**
 * Offline Support Hook
 * ====================
 * 
 * Provides offline detection and data caching for the app.
 * 
 * Features:
 * - Online/offline status detection
 * - Cache management
 * - Sync pending data when online
 * - Offline data storage
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  key: string;
  data: unknown;
  timestamp: number;
  type: 'location' | 'message' | 'favorite' | 'journey';
}

interface UseOfflineReturn {
  isOnline: boolean;
  isOffline: boolean;
  pendingSync: OfflineData[];
  saveOffline: (key: string, data: unknown, type: OfflineData['type']) => Promise<void>;
  getOfflineData: (key: string) => Promise<unknown | null>;
  clearOfflineData: (key: string) => Promise<void>;
  syncPendingData: () => Promise<void>;
  cacheForOffline: (url: string) => Promise<void>;
}

const OFFLINE_STORAGE_KEY = 'railbondhu-offline-data';
const PENDING_SYNC_KEY = 'railbondhu-pending-sync';

export function useOffline(): UseOfflineReturn {
  // Initialize with current online status
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);

  // Load pending sync data from localStorage - defined before useEffect
  const loadPendingSync = async () => {
    try {
      const stored = localStorage.getItem(PENDING_SYNC_KEY);
      if (stored) {
        setPendingSync(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load pending sync:', error);
    }
  };

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending sync data on mount
    void (async () => {
      try {
        const stored = localStorage.getItem(PENDING_SYNC_KEY);
        if (stored) {
          setPendingSync(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load pending sync:', error);
      }
    })();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save pending sync data to localStorage
  const savePendingSync = async (data: OfflineData[]) => {
    try {
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(data));
      setPendingSync(data);
    } catch (error) {
      console.error('Failed to save pending sync:', error);
    }
  };

  // Save data for offline access
  const saveOffline = useCallback(async (key: string, data: unknown, type: OfflineData['type']) => {
    try {
      const offlineData: OfflineData = {
        key,
        data,
        timestamp: Date.now(),
        type,
      };

      // Save to localStorage
      const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
      const offlineStorage: Record<string, OfflineData> = stored ? JSON.parse(stored) : {};
      offlineStorage[key] = offlineData;
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineStorage));

      // If offline, add to pending sync
      if (!navigator.onLine) {
        const newPending = [...pendingSync, offlineData];
        await savePendingSync(newPending);
      }

      // Also try to cache in service worker
      if ('caches' in window) {
        const cache = await caches.open('railbondhu-data-v1');
        await cache.put(
          key,
          new Response(JSON.stringify(offlineData), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }, [pendingSync]);

  // Get offline data
  const getOfflineData = useCallback(async (key: string): Promise<unknown | null> => {
    try {
      // Try localStorage first
      const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (stored) {
        const offlineStorage: Record<string, OfflineData> = JSON.parse(stored);
        if (offlineStorage[key]) {
          return offlineStorage[key].data;
        }
      }

      // Try cache
      if ('caches' in window) {
        const cache = await caches.open('railbondhu-data-v1');
        const response = await cache.match(key);
        if (response) {
          const data = await response.json();
          return data.data;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }, []);

  // Clear offline data
  const clearOfflineData = useCallback(async (key: string) => {
    try {
      // Clear from localStorage
      const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (stored) {
        const offlineStorage: Record<string, OfflineData> = JSON.parse(stored);
        delete offlineStorage[key];
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineStorage));
      }

      // Clear from cache
      if ('caches' in window) {
        const cache = await caches.open('railbondhu-data-v1');
        await cache.delete(key);
      }

      // Remove from pending sync
      const newPending = pendingSync.filter(p => p.key !== key);
      await savePendingSync(newPending);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, [pendingSync]);

  // Sync pending data when online
  const syncPendingData = useCallback(async () => {
    if (!navigator.onLine || pendingSync.length === 0) return;

    const synced: string[] = [];

    for (const item of pendingSync) {
      try {
        // Determine the API endpoint based on type
        let endpoint = '';
        let method = 'POST';

        switch (item.type) {
          case 'location':
            endpoint = '/api/location/ping';
            break;
          case 'message':
            endpoint = '/api/trains/temp/chat';
            break;
          case 'favorite':
            endpoint = '/api/favorites';
            break;
          case 'journey':
            endpoint = '/api/journey';
            break;
        }

        if (endpoint) {
          const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          });

          if (response.ok) {
            synced.push(item.key);
          }
        }
      } catch (error) {
        console.error('Failed to sync item:', item.key, error);
      }
    }

    // Remove synced items from pending
    if (synced.length > 0) {
      const newPending = pendingSync.filter(p => !synced.includes(p.key));
      await savePendingSync(newPending);

      // Clear synced data from offline storage
      for (const key of synced) {
        await clearOfflineData(key);
      }
    }
  }, [pendingSync, clearOfflineData]);

  // Cache a URL for offline access
  const cacheForOffline = useCallback(async (url: string) => {
    try {
      if ('caches' in window) {
        const cache = await caches.open('railbondhu-pages-v1');
        await cache.add(url);
      }
    } catch (error) {
      console.error('Failed to cache URL:', error);
    }
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    pendingSync,
    saveOffline,
    getOfflineData,
    clearOfflineData,
    syncPendingData,
    cacheForOffline,
  };
}

export default useOffline;
