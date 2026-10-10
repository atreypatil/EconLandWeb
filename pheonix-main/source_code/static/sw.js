const CACHE_NAME = 'econland-pwa-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/app',
  '/download',
  '/manifest.json',
  '/static/style.css',
  '/static/backg.jpg',
  '/icons/icon192.png',
  '/icons/icon512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) =>
            cacheName.startsWith('econland-pwa-cache-') ||
            cacheName === 'flask-pwa-cache-v1'
          )
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const response = await fetch(event.request);
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        await cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        if (event.request.mode === 'navigate') {
          const offlinePage = await cache.match('/');
          if (offlinePage) {
            return offlinePage;
          }
        }

        throw error;
      }
    })
  );
});
