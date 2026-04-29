/* Manifest version: ySnyyrz7 */
// Offline cache for published version
const cacheName = 'agendabeauty-cache-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return fetch('service-worker-assets.js')
                .then(response => response.text())
                .then(text => {
                    // Parse the assets manifest
                    const fn = new Function(text.replace('self.assetsManifest =', 'return'));
                    const manifest = fn();
                    const assets = manifest.assets.map(a => a.url);
                    return cache.addAll(assets);
                });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request).then(response => {
                const clone = response.clone();
                caches.open(cacheName).then(cache => cache.put(event.request, clone));
                return response;
            }))
            .catch(() => caches.match('index.html'))
    );
});
