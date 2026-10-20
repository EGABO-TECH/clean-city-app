/* ============================================================
   UGANDA NATIONAL WASTE MANAGEMENT - SERVICE WORKER
   Enables PWA functionality: offline support, caching, and
   install-to-homescreen capability.
   ============================================================ */

const CACHE_NAME = 'unwm-v3';
const OFFLINE_URL = '/index.html';

// Core assets to pre-cache for offline support
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/chatbot.js',
  '/assets/logo.svg',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600;1,700;1,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
];

// HTML pages to cache on first visit (network-first strategy)
const HTML_PAGES = [
  '/html/services.html',
  '/html/districts.html',
  '/html/booking.html',
  '/html/learn.html',
  '/html/track.html',
  '/html/feedback.html',
  '/html/contact.html',
  '/html/login.html',
  '/html/register.html',
  '/html/profile.html',
  '/html/admin.html',
  '/html/worker-dashboard.html'
];

// ─── INSTALL ───────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).catch((err) => {
      console.warn('[SW] Pre-cache failed for some assets:', err);
    })
  );
  // Activate immediately without waiting for existing tabs to close
  self.skipWaiting();
});

// ─── ACTIVATE ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

// ─── FETCH ─────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Strategy: Network-first for HTML pages, Cache-first for assets
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    // Network-first for HTML - always try fresh content
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline: serve from cache, fall back to offline page
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
  } else {
    // Cache-first for CSS, JS, images, fonts
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            // Don't cache opaque responses (cross-origin without CORS)
            if (!response || response.status !== 200) {
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Return nothing if both cache and network fail for assets
            return new Response('', { status: 408, statusText: 'Offline' });
          });
      })
    );
  }
});

// ─── BACKGROUND SYNC (future enhancement) ─────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    console.log('[SW] Syncing pending bookings...');
    // Future: sync offline booking requests
  }
});

// ─── PUSH NOTIFICATIONS (future enhancement) ──────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'UNWM Update';
  const options = {
    body: data.body || 'You have a new update from Uganda National Waste Management.',
    icon: '/assets/logo-192x192.png',
    badge: '/assets/logo-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.openWindow(url)
  );
});
