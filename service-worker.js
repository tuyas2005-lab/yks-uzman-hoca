const CACHE = 'yks-uzman-hoca-v5.1.2-r2-fast-shell';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/app-a.css',
  '/app-b.css',
  '/app-core.js',
  '/app-cloud.js',
  '/app-counselor.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE && k.startsWith('yks-uzman-hoca-'))
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

async function refreshIntoCache(req, cacheKey = req) {
  try {
    const res = await fetch(req, { cache: 'no-store' });
    if (res && res.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(cacheKey, res.clone());
    }
    return res;
  } catch {
    return null;
  }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cached = await caches.match('/index.html');
      const refresh = refreshIntoCache(req, '/index.html');
      event.waitUntil(refresh);
      if (cached) return cached;
      const fresh = await refresh;
      if (fresh) return fresh;
      return new Response('Uygulama şu anda açılamıyor.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })());
    return;
  }

  const isCode = /\.(?:js|css|mjs)$/.test(url.pathname);
  if (isCode) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      const refresh = refreshIntoCache(req);
      event.waitUntil(refresh);
      if (cached) return cached;
      const fresh = await refresh;
      if (fresh) return fresh;
      return new Response('', { status: 504 });
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    const fresh = await refreshIntoCache(req);
    return fresh || new Response('', { status: 504 });
  })());
});
