const CACHE = 'yks-uzman-hoca-v5.1.2-r13-fresh-code';
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
  '/app-solve-payload-guard.js',
  '/app-personal-teacher-source-launch-v3.js'
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
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k !== CACHE && k.startsWith('yks-uzman-hoca-'))
        .map(k => caches.delete(k))
    );
    await self.clients.claim();

    // Move already-open app windows onto the newly activated shell once.
    // This navigation does not clear localStorage or IndexedDB.
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map(async client => {
      try {
        const url = new URL(client.url);
        if (url.origin === self.location.origin) await client.navigate(client.url);
      } catch {
        // Client may disappear during activation.
      }
    }));
  })());
});

async function fetchAndCache(req, cacheKey = req) {
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

async function networkFirst(req, cacheKey = req) {
  const fresh = await fetchAndCache(req, cacheKey);
  if (fresh) return fresh;
  const cached = await caches.match(cacheKey);
  return cached || new Response('', { status: 504 });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.href.startsWith(SUPABASE_CDN)) {
    event.respondWith((async () => {
      const cached = await caches.match(SUPABASE_CDN);
      if (cached) {
        event.waitUntil(fetchAndCache(req, SUPABASE_CDN));
        return cached;
      }
      return networkFirst(req, SUPABASE_CDN);
    })());
    return;
  }

  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Correctness first: when online, always use the current HTML and app code.
  // Cache is only the offline fallback, so a previous deployment cannot pin the UI.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const fresh = await fetchAndCache(req, '/index.html');
      if (fresh) return fresh;
      const cached = await caches.match('/index.html');
      return cached || new Response('Uygulama şu anda açılamıyor.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })());
    return;
  }

  const isCode = /\.(?:js|css|mjs)$/.test(url.pathname);
  if (isCode) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Static images/manifests remain cache-first for fast startup.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    return networkFirst(req);
  })());
});
