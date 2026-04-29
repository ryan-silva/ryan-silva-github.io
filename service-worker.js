/* Manifest version: fJwO2fKn */
// In development, always fetch from network
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { });
