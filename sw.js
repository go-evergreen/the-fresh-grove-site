/* Leftover First Seeds SW on this port was serving a stale page. This one
   takes over, clears caches, then unregisters itself. */
self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }).then(function () {
      return self.registration.unregister();
    }).then(function () {
      return self.clients.matchAll({ type: "window" });
    }).then(function (clients) {
      clients.forEach(function (c) {
        if (c.url) c.navigate(c.url);
      });
    })
  );
});
