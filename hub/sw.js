/* This copy of First Seeds is retired. Send every open to the live app.
   The saved screen here still has two Leads links. A redirect is a real
   navigation iPhone will follow. */
self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim().then(function () {
    return self.clients.matchAll({ type: "window", includeUncontrolled: true });
  }).then(function (list) {
    return Promise.all(list.map(function (client) {
      if (!client.navigate || !client.url) return null;
      try {
        var u = new URL(client.url);
        if (u.searchParams.get("fsbust")) return null;
        u.searchParams.set("fsbust", String(Date.now()));
        var nav = client.navigate(u.href);
        return nav && nav.catch ? nav.catch(function () {}) : null;
      } catch (eNav) {
        return null;
      }
    }));
  }).catch(function () {}));
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode !== "navigate") return;
  var dest = new URL("https://app.thefreshgrove.team/index.html");
  try {
    var here = new URL(event.request.url);
    here.searchParams.forEach(function (value, key) {
      if (key === "fsbust") return;
      dest.searchParams.append(key, value);
    });
    if (here.hash) dest.hash = here.hash;
  } catch (eUrl) {}
  event.respondWith(Response.redirect(dest.toString(), 302));
});
