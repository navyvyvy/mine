const CACHE_NAME = 'endless-mine-static-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg'
];
const CACHEABLE_EXTENSIONS = ['.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.ico', '.json', '.txt'];

function isCacheableRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (request.method !== 'GET') return false;
  if (url.search) return false;
  if (STATIC_ASSETS.includes(url.pathname)) return true;
  if (url.pathname.startsWith('/assets/')) return true;
  return CACHEABLE_EXTENSIONS.some((extension) => url.pathname.endsWith(extension));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!isCacheableRequest(request)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
  );
});
