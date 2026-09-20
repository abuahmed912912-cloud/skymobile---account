/* Service Worker — سكاي موبايل */
const CACHE = 'sky-mobile-v11';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(ASSETS.map(u => c.add(u).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.hostname.includes('supabase.co') || u.pathname.includes('/auth/')) return;
  if (u.hostname === 'wa.me' || u.hostname === 'api.whatsapp.com') return;
  e.respondWith(
    caches.match(r).then(c => c || fetch(r).then(res => {
      if (res && res.ok && res.type === 'basic') {
        const cl = res.clone();
        caches.open(CACHE).then(x => x.put(r, cl));
      }
      return res;
    }).catch(() => c))
  );
});