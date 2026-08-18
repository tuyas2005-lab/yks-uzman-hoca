const CACHE = 'yks-uzman-hoca-v4.8.16-shell';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/app-a.css',
  '/app-b.css',
  '/app-core.js',
  '/app-cloud.js',
  '/app-counselor.js',
  '/app-analysis-flow.js',
  '/app-mini-tests.js',
  '/app-favorites-page.js',
  '/app-personal-teacher.js',
  '/app-yks-coach.js',
  '/app-yks-coach-fix.js',
  '/app-home-data.js',
  '/app-home-links.js',
  '/app-field-track.js',
  '/app-low-cost.js',
  '/app-low-cost-fix.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k.startsWith('yks-uzman-hoca-')).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('/index.html', copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
