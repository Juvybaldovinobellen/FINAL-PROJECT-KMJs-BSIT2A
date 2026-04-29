const CACHE_NAME = 'bu-transakto-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/config.js',
  '/js/utils.js',
  '/js/api.js',
  '/js/auth.js',
  '/js/student-dashboard.js',
  '/js/staff-dashboard.js',
  '/img/transakto1.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignore non-http requests (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) {
    return; // Let browser handle
  }
  
  // Skip caching for API calls and non-GET requests
  if (url.pathname.startsWith('/api/') || event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For static assets: cache first, then network, fallback to index.html
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => caches.match('/index.html'));
    })
  );
});