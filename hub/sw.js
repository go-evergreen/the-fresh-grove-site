/* This copy of First Seeds is retired. Send every open to the live app.
   The saved screen here still has two Leads links. iPhone throws away a
   redirect and keeps that screen, so this answers with a real page whose
   only job is to open the live app. */
var APP = "https://app.thefreshgrove.team/index.html";

function appHref(requestUrl) {
  var dest = new URL(APP);
  try {
    var here = new URL(requestUrl);
    here.searchParams.forEach(function (value, key) {
      if (key === "fsbust") return;
      dest.searchParams.append(key, value);
    });
    if (here.hash) dest.hash = here.hash;
  } catch (eUrl) {}
  return dest.toString();
}

function doorPage(href) {
  var safe = String(href).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  var html = "<!DOCTYPE html><html><head><meta charset=\"utf-8\">"
    + "<meta http-equiv=\"refresh\" content=\"0;url=" + safe + "\">"
    + "<title>First Seeds</title></head><body>"
    + "<p><a href=\"" + safe + "\">Open First Seeds</a></p>"
    + "<script>location.replace(" + JSON.stringify(href) + ")</script>"
    + "</body></html>";
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

function sendOpenClients() {
  return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    return Promise.all(list.map(function (client) {
      if (!client.navigate || !client.url) return null;
      try {
        var u = new URL(client.url);
        if (u.searchParams.get("fsplain") === "1") return null;
        u.searchParams.set("fsplain", "1");
        u.searchParams.set("fsbust", String(Date.now()));
        var nav = client.navigate(u.href);
        return nav && nav.catch ? nav.catch(function () {}) : null;
      } catch (eNav) {
        return null;
      }
    }));
  });
}

self.addEventListener("activate", function (event) {
  /* Stay awake until the open screen is sent to the live app. A timer
     outside this promise never ran, and the two-link screen stayed up. */
  event.waitUntil(self.clients.claim().catch(function () {}).then(function () {
    return new Promise(function (resolve) {
      setTimeout(function () {
        Promise.resolve(sendOpenClients()).then(resolve, resolve);
      }, 500);
    });
  }).catch(function () {}));
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode !== "navigate") return;
  event.respondWith(Promise.resolve(doorPage(appHref(event.request.url))));
});
