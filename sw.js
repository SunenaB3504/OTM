/**
 * Math Fun - Service Worker
 * Provides offline capabilities and caching for the Math Fun PWA
 */

const CACHE_NAME = 'math-fun-v1';
const DYNAMIC_CACHE = 'math-fun-dynamic-v1';

// List of assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/lessons.html',
  '/games.html',
  '/progress.html',
  '/settings.html',
  '/offline.html',
  '/css/styles.css',
  '/css/games.css',
  '/css/lesson.css',
  '/css/settings.css',
  '/js/main.js',
  '/js/pwa.js',
  '/js/game-utils.js',
  '/js/quiz-game.js',
  '/js/matching-game.js',
  '/js/bingo-game.js',
  '/js/progress-tracker.js',
  '/js/progress-page.js',
  '/js/settings-page.js',
  '/images/math-fun-logo.png',
  '/images/hero-bg.jpg',
  '/images/icons/icon-192x192.png',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and content files');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete!');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients...');
        return self.clients.claim();
      })
  );
});

// Helper function to determine caching strategy based on request URL
function shouldUseNetworkFirst(url) {
  const networkedAPIs = [
    '/api/', // For future API endpoints
    'googleapis.com',
    'gstatic.com'
  ];
  
  // Use network-first for API calls and external resources
  return networkedAPIs.some(api => url.includes(api));
}

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // For same-origin requests only
  if (url.origin === self.location.origin) {
    // Different caching strategies based on file type

    // For HTML pages - Network first, then cache
    if (event.request.headers.get('accept').includes('text/html')) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            return caches.match(event.request)
              .then(response => {
                if (response) {
                  return response;
                }
                // If no cached HTML, show offline page
                return caches.match('/offline.html');
              });
          })
      );
      return; // Skip the rest of the function
    }
  }
  
  // For other requests - Cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        // Clone the request to avoid using it twice
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to store in cache
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                // Store the fetched response in the dynamic cache
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch failed:', error);
            
            // If the request is for an image, return a fallback image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/images/offline-image-placeholder.png');
            }
            
            // If the request is for a font, ignore the error
            if (event.request.url.match(/\.(woff|woff2|ttf|eot)$/)) {
              return;
            }
          });
      })
  );
});

// Background sync for future enhancements
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background Syncing', event);
  
  if (event.tag === 'sync-progress') {
    // Future implementation: sync user progress data when online
    console.log('[Service Worker] Syncing progress data');
  }
});

// Push notifications for future enhancements
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received', event);
  
  let notification = {
    title: 'New notification',
    content: 'Something new happened!',
    openUrl: '/'
  };
  
  if (event.data) {
    notification = JSON.parse(event.data.text());
  }
  
  const options = {
    body: notification.content,
    icon: '/images/icons/icon-96x96.png',
    badge: '/images/icons/icon-72x72.png',
    data: {
      url: notification.openUrl
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(notification.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked', event);
  
  const notification = event.notification;
  const action = event.action;
  const url = notification.data.url;
  
  notification.close();
  
  event.waitUntil(
    clients.matchAll()
      .then(allClients => {
        // Look for open window to reuse
        const client = allClients.find(c => c.visibilityState === 'visible');
        
        if (client) {
          client.navigate(url);
          client.focus();
        } else {
          clients.openWindow(url);
        }
      })
  );
});
