const CACHE = 'we-together-v1';
const ASSETS = [
  './',
  'index.html',
  'favicon.svg',
  'manifest.webmanifest',
  'fonts/fonts.css',
  'fonts/cormorant-300-cyrillic.woff2',
  'fonts/cormorant-300-latin.woff2',
  'fonts/cormorant-400-cyrillic.woff2',
  'fonts/cormorant-400-latin.woff2',
  'fonts/cormorant-400-italic-cyrillic.woff2',
  'fonts/cormorant-400-italic-latin.woff2',
  'fonts/jost-200-cyrillic.woff2',
  'fonts/jost-200-latin.woff2',
  'fonts/jost-300-cyrillic.woff2',
  'fonts/jost-300-latin.woff2',
  'fonts/jost-400-cyrillic.woff2',
  'fonts/jost-400-latin.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// сеть в приоритете, кэш — офлайн-запас
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
