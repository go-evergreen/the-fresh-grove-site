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

var lastSwCheck = 0;
function pullNewestWorker() {
  var now = Date.now();
  if (now - lastSwCheck < 15000) return Promise.resolve();
  lastSwCheck = now;
  try {
    return Promise.resolve(self.registration.update()).catch(function () {});
  } catch (eUp) {
    return Promise.resolve();
  }
}

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

var hubOpened = {};

function hubNeedsSwap(client) {
  if (!client || !client.url) return false;
  try {
    return new URL(client.url).searchParams.get("fsplain") !== "1";
  } catch (eNeed) {
    return false;
  }
}

function swapHubClient(client) {
  if (!hubNeedsSwap(client)) return Promise.resolve();
  if (typeof client.navigate === "function") {
    try {
      var u = new URL(client.url);
      u.searchParams.set("fsplain", "1");
      u.searchParams.set("fsbust", String(Date.now()));
      var nav = client.navigate(u.href);
      return Promise.resolve(nav).catch(function () {});
    } catch (eNav) {
      return Promise.resolve();
    }
  }
  if (hubOpened[client.id] || !self.clients.openWindow) return Promise.resolve();
  hubOpened[client.id] = true;
  var opened;
  try { opened = self.clients.openWindow(APP); }
  catch (eOpen) {
    hubOpened[client.id] = false;
    return Promise.resolve();
  }
  return Promise.resolve(opened).then(function (win) {
    if (!win) hubOpened[client.id] = false;
    else { try { win.focus(); } catch (eFocus) {} }
  }, function () {
    hubOpened[client.id] = false;
  });
}

function sendOpenClients() {
  return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    return Promise.all(list.map(function (client) {
      return swapHubClient(client).then(function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            self.clients.get(client.id).then(function (again) {
              Promise.resolve(swapHubClient(again)).then(resolve, resolve);
            }, resolve);
          }, 1500);
        });
      });
    }));
  });
}

self.addEventListener("activate", function (event) {
  /* Stay awake until the open screen is sent to the live app. A timer
     outside this promise never ran, and the two-link screen stayed up. */
  event.waitUntil(pullNewestWorker());
  event.waitUntil(self.clients.claim().catch(function () {}).then(function () {
    return new Promise(function (resolve) {
      setTimeout(function () {
        Promise.resolve(sendOpenClients()).then(resolve, resolve);
      }, 500);
    });
  }).catch(function () {}));
});

self.addEventListener("fetch", function (event) {
  var path = "";
  try { path = new URL(event.request.url).pathname || ""; } catch (ePath) {}
  if (/\/sw\.js$/i.test(path)) {
    event.respondWith(fetch(event.request.url, { cache: "no-store", credentials: "same-origin" }));
    return;
  }
  try { event.waitUntil(pullNewestWorker()); } catch (ePull) {}
  if (event.clientId) {
    event.waitUntil(self.clients.get(event.clientId).then(function (client) {
      return swapHubClient(client);
    }).catch(function () {}));
  }
  if (event.request.mode !== "navigate") return;
  event.respondWith(Promise.resolve(doorPage(appHref(event.request.url))));
});
