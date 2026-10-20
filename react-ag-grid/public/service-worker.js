// Retire the service worker installed by the previous Create React App build.
// This replacement serves requests normally instead of keeping an old cached app.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        await self.clients.claim();
        await self.registration.unregister();
    })());
});
