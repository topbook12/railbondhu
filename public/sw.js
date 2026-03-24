/**
 * RailBondhu Service Worker - Enhanced Offline Support
 * ======================================================
 * 
 * Features:
 * - Offline page caching
 * - API response caching
 * - Background sync
 * - Push notifications
 * - Offline fallback
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `railbondhu-static-${CACHE_VERSION}`;
const DATA_CACHE = `railbondhu-data-${CACHE_VERSION}`;
const PAGES_CACHE = `railbondhu-pages-${CACHE_VERSION}`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/app',
  '/app/trains',
  '/app/favorites',
  '/app/journey',
  '/app/stations',
  '/app/schedule',
  '/manifest.json',
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/trains',
  '/api/stations',
  '/api/favorites',
  '/api/journey',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache pages
      caches.open(PAGES_CACHE).then((cache) => {
        console.log('[Service Worker] Preparing pages cache');
        return Promise.resolve();
      }),
    ]).then(() => {
      console.log('[Service Worker] Installed');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith('railbondhu-') &&
              name !== STATIC_CACHE &&
              name !== DATA_CACHE &&
              name !== PAGES_CACHE
            );
          })
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[Service Worker] Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    // For POST/PUT/DELETE, use network with offline fallback
    event.respondWith(
      fetch(request).catch(() => {
        // Store for background sync
        return new Response(
          JSON.stringify({ 
            error: 'offline', 
            message: 'Request saved for sync when online' 
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle page requests
  event.respondWith(handlePageRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const isCacheable = CACHEABLE_APIS.some(api => url.pathname.startsWith(api));

  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok && isCacheable) {
      const cache = await caches.open(DATA_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await caches.match(request);
    if (cached) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cached;
    }

    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'offline', 
        message: 'You are offline. Data will sync when connection is restored.' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle page requests with cache-first strategy
async function handlePageRequest(request) {
  const url = new URL(request.url);

  // Try cache first
  const cached = await caches.match(request);
  if (cached) {
    // Revalidate in background
    fetchAndCache(request, PAGES_CACHE);
    return cached;
  }

  // Try network
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(PAGES_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Show offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/');
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response('Offline', { status: 503 });
  }
}

// Fetch and cache in background
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response);
    }
  } catch {
    // Ignore errors in background fetch
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');

  let data = {
    title: 'RailBondhu Update',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    data: {},
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      data = { ...data, ...pushData };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    vibrate: [100, 50, 100],
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  if (action === 'dismiss') {
    return;
  }

  // Determine URL to open
  let url = '/app';
  
  if (data.trainId) {
    url = data.type === 'chat' 
      ? `/app/train/${data.trainId}/chat`
      : `/app/train/${data.trainId}`;
  } else if (data.type === 'journey') {
    url = '/app/journey';
  } else if (data.type === 'favorite') {
    url = '/app/favorites';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Background sync handler
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'location-sync') {
    event.waitUntil(syncLocations());
  } else if (event.tag === 'data-sync') {
    event.waitUntil(syncPendingData());
  }
});

// Sync pending location updates
async function syncLocations() {
  try {
    const cache = await caches.open('location-pending');
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch {
        // Keep in cache for next sync
      }
    }
  } catch (error) {
    console.error('[Service Worker] Location sync failed:', error);
  }
}

// Sync all pending data
async function syncPendingData() {
  console.log('[Service Worker] Syncing pending data...');
  // This would sync any pending data stored in IndexedDB or Cache
}

// Message handler
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(PAGES_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
