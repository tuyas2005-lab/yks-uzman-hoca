const CACHE = 'yks-uzman-hoca-v5.1.2-r68-teacher-pool-expansion';
const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
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
  '/data/yks-topic-taxonomy-v1.js',
  '/app-analysis-flow.js?v=2',
  '/app-data-v5.js?v=2',
  '/app-teacher-pilot-v1.js?v=12',
  '/app-home-data.js?v=4',
  '/app-topic-ui.js?v=4',
  '/app-topic-test-entry.js?v=1',
  '/app-ui-cleanup-v1.js?v=2',
  '/app-home-links.js?v=41',
  '/app-startup-polish.js?v=2',
  '/app-personal-teacher-source-launch-v3.js?v=13'
];

async function cacheOptionalExternal(cache) {
  try {
    const res = await fetch(SUPABASE_CDN, { cache: 'reload', mode: 'cors' });
    if (res && (res.ok || res.type === 'opaque')) await cache.put(SUPABASE_CDN, res.clone());
  } catch {
    // External dependency is optional for install; app shell must remain installable offline.
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    await cacheOptionalExternal(cache);
    await self.skipWaiting();
  })());
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
    if (res && (res.ok || res.type === 'opaque')) {
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

  if (url.href.startsWith(SUPABASE_CDN)) {
    event.respondWith((async () => {
      const cached = await caches.match(SUPABASE_CDN);
      const refresh = refreshIntoCache(req, SUPABASE_CDN);
      event.waitUntil(refresh);
      if (cached) return cached;
      const fresh = await refresh;
      return fresh || new Response('', { status: 504 });
    })());
    return;
  }

  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const fresh = await refreshIntoCache(req, '/index.html');
      if (fresh) return fresh;
      const cached = await caches.match('/index.html');
      if (cached) return cached;
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
      const fresh = await refreshIntoCache(req);
      if (fresh) return fresh;
      const cached = await caches.match(req);
      if (cached) return cached;
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
