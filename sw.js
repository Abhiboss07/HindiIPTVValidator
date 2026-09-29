const CACHE_NAME = 't2l-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/hls.min.js',
  '/assets/app.js',
  '/data/channels.json',
  '/data/movies_catalog.json',
  '/data/countries.json',
  '/manifest.json',
  '/assets/icons/icon-192.svg',
  '/assets/icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Do NOT cache live streaming media files (m3u8, ts, aac, fmp4, audio)
  if (url.pathname.endsWith('.m3u8') || url.pathname.endsWith('.ts') || url.pathname.includes('/live/') || event.request.destination === 'video' || event.request.destination === 'audio') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.status === 200 && event.request.method === 'GET' && !url.protocol.startsWith('chrome-extension')) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return response;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
