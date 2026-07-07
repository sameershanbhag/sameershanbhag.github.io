// Kill switch for the old CRA service worker: the previous build of this site
// registered a precaching worker, so returning visitors would otherwise keep
// seeing the cached old site. This replacement clears all caches, unregisters
// itself, and reloads open tabs onto the fresh site.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
