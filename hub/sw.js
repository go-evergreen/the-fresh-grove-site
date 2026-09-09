/* First Seeds — freshness-first service worker
   Strategy: the page itself is network-first so PWAs pick up deploys quickly.
   Everything it pulls in is versioned (?v=) and the whole cache is dropped
   whenever CACHE_VERSION moves, so a cache hit on those can never be stale —
   they are served straight from cache instead of re-fetched on every open.
   Offline: fall back to last good cache.
*/
const CACHE_VERSION = "fs-v721";
const CACHE_NAME = "first-seeds-" + CACHE_VERSION;
const JOIN_CACHE = "fs-pending-join";
const JOIN_REQ = "./__pending_join";
const JOIN_HUB_REQ = "./__pending_join_hub";

const PRECACHE = [
  "./",
  "./index.html",
  "./404.html",
  "./join.html",
  "./grove-join.html",
  "./lead.html",
  "./manifest.webmanifest",
  "./icons/favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./fonts/DMSans-normal.woff2",
  "./fonts/DMSans-italic.woff2",
  "./fonts/Fraunces-normal.woff2",
  "./fonts/Fraunces-italic.woff2",
  "./js/supabase-config.js",
  "./js/cloud.js",
  "./js/cabinet-desk.js",
  "./js/leads-public.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      /* add() per URL so one 404 (e.g. source paths on the minified dist)
         doesn't throw away fonts, icons, and the shell. */
      return Promise.all(PRECACHE.map(function (url) {
        return cache.add(url).catch(function () { return null; });
      }));
    }).then(function () {
      /* Claim as soon as this build is installed. pwa.js still decides
         whether the visible tab reloads; without this, a force-close leaves
         the old worker in charge and the teammate never sees the fix. */
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          /* Drop every prior First Seeds cache so teammates don't stay on old JS/CSS. */
          if (key.indexOf("first-seeds-") === 0 && key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      return self.clients.matchAll({ type: "window" }).then(function (clients) {
        clients.forEach(function (client) {
          try { client.postMessage({ type: "FS_SW_ACTIVATED", version: CACHE_VERSION }); } catch (e) {}
        });
      });
    })
  );
});

function isAppAsset(url) {
  try {
    var u = new URL(url);
    if (u.origin !== self.location.origin) return false;
    var path = u.pathname;
    if (/\.(?:js|css|html|webmanifest|svg|png|ico|webp|jpg|jpeg|woff2?|ttf|otf|pdf)(\?|$)/i.test(path)) return true;
    if (path.endsWith("/") || /\/first-seeds\/?$/i.test(path)) return true;
    return false;
  } catch (e) {
    return false;
  }
}

/* Versioned URLs (?v=348) change whenever their contents change, and every
   cache entry is thrown away when CACHE_VERSION moves — so a hit is always the
   right bytes. Re-fetching these was costing ~2MB of network on every open. */
function isVersioned(url) {
  try {
    return !!new URL(url).searchParams.get("v");
  } catch (e) {
    return false;
  }
}

function joinFromPathname(path) {
  path = String(path || "");
  var m = path.match(/\/j\/([a-z0-9][a-z0-9-]{2,62})\/?$/i);
  return m ? decodeURIComponent(m[1]).toLowerCase() : "";
}

function pickJoinCode(query, hash, path) {
  var parts = [query, hash, path];
  var i;
  var c;
  for (i = 0; i < parts.length; i++) {
    c = String(parts[i] || "").trim().toLowerCase();
    if (c && c !== "evergreen" && c.indexOf("evl-") !== 0 && c !== "evergreen-leaders") return c;
  }
  for (i = 0; i < parts.length; i++) {
    c = String(parts[i] || "").trim().toLowerCase();
    if (c && (c.indexOf("evl-") === 0 || c === "evergreen-leaders")) return c;
  }
  for (i = 0; i < parts.length; i++) {
    c = String(parts[i] || "").trim().toLowerCase();
    if (c) return c;
  }
  return "";
}

function joinFromUrl(url) {
  try {
    var u = new URL(url);
    var query = String(u.searchParams.get("join") || "").trim().toLowerCase();
    var hash = "";
    var hm = String(u.hash || "").match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
    if (hm) hash = decodeURIComponent(hm[1] || "").trim().toLowerCase();
    return pickJoinCode(query, hash, joinFromPathname(u.pathname));
  } catch (e) {
    return "";
  }
}

function hubFromUrl(url) {
  try {
    var h = String(new URL(url).searchParams.get("hub") || "").trim().toLowerCase();
    if (h === "evergreen" || h === "evergreen-co") return "evergreen";
    if (h === "grove" || h === "fresh-grove") return "grove";
    return "";
  } catch (e) {
    return "";
  }
}

function isManifest(url) {
  try {
    return /manifest\.webmanifest$/i.test(new URL(url).pathname || "");
  } catch (e) {
    return false;
  }
}

function manifestWithJoin(event) {
  var reqJoin = joinFromUrl(event.request.url);
  var reqHub = hubFromUrl(event.request.url);
  if (looksGenericOrgJoin(reqJoin)) reqJoin = "";
  return Promise.all([recalledJoin(), recalledHub()]).then(function (pair) {
    var join = reqJoin;
    var hub = reqHub;
    /* Always pin a stored unique into start_url. A bare-hub Add to Home
       Screen used to write a start_url with no join, and the icon dropped
       the person. */
    if (!join) join = pair[0];
    if (!hub) hub = pair[1];
    function rewrite(text) {
      try {
        var man = JSON.parse(text);
        var wantSignin = false;
        try { wantSignin = new URL(event.request.url).searchParams.get("signin") === "1"; } catch (eSign) {}
        if ((join && !looksGenericOrgJoin(join)) || wantSignin) {
          /* Hub itself — not join.html. That extra hop is how in-app
             browsers drop ?join= after Add to Home Screen. */
          var start = new URL("./index.html", self.registration.scope);
          if (join && !looksGenericOrgJoin(join)) start.searchParams.set("join", join);
          if (hub) start.searchParams.set("hub", hub);
          if (wantSignin) start.searchParams.set("signin", "1");
          man.start_url = start.pathname + start.search;
        }
        return new Response(JSON.stringify(man), {
          headers: { "Content-Type": "application/manifest+json", "Cache-Control": "no-store" }
        });
      } catch (e) {
        return new Response(text, { headers: { "Content-Type": "application/manifest+json" } });
      }
    }
    return fetch("./manifest.webmanifest", { cache: "no-store" }).then(function (res) {
      if (res && res.ok) return res.text().then(rewrite);
      return caches.match("./manifest.webmanifest").then(function (hit) {
        if (!hit) return res;
        return hit.text().then(rewrite);
      });
    }).catch(function () {
      return caches.match("./manifest.webmanifest").then(function (hit) {
        if (!hit) return Response.error();
        return hit.text().then(rewrite);
      });
    });
  });
}

function isCatalogSharePath(path) {
  return /\/thefreshcatalog(?:\.html|\/index\.html)?\/?$/i.test(String(path || ""));
}

function isHubNavigate(url) {
  try {
    var path = new URL(url).pathname || "";
    if (isCatalogSharePath(path)) return false;
    if (/lead\.html$/i.test(path)) return false;
    if (/join\.html$/i.test(path)) return true;
    if (/\/j\/[a-z0-9][a-z0-9-]{2,62}\/?$/i.test(path)) return true;
    return /(?:^|\/)(?:index\.html)?$/.test(path) || /\/first-seeds\/?$/.test(path);
  } catch (e) {
    return false;
  }
}

function looksGenericOrgJoin(code) {
  return code === "evergreen";
}

function onGroveHostName(host) {
  host = String(host || "").toLowerCase();
  return host === "thefreshgrove.team" || host === "www.thefreshgrove.team" ||
    host === "app.thefreshgrove.team";
}

/* Generic Evergreen door: no person/leader unique in this request, and not
   the Grove host. Leftover stored uniques must not be 302-injected here —
   A2HS that was pinned correctly already has ?join= on start_url. */
function isGenericEvergreenDoor(url) {
  try {
    var u = new URL(url);
    if (onGroveHostName(u.hostname)) return false;
    var hub = String(u.searchParams.get("hub") || "").trim().toLowerCase();
    if (hub === "grove" || hub === "fresh-grove") return false;
    var join = joinFromUrl(url);
    if (join && !looksGenericOrgJoin(join)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

function normalizeHub(hub) {
  hub = String(hub || "").trim().toLowerCase();
  if (hub === "evergreen" || hub === "evergreen-co") return "evergreen";
  if (hub === "grove" || hub === "fresh-grove") return "grove";
  return "";
}

function storeJoin(code, hub) {
  code = String(code || "").trim().toLowerCase();
  hub = normalizeHub(hub);
  if (!code || looksGenericOrgJoin(code)) return Promise.resolve();
  return recalledJoin().then(function (stored) {
    stored = String(stored || "").trim().toLowerCase();
    if (looksGenericOrgJoin(code)) return;
    /* A unique person / leader invite must not be overwritten by a later
       generic Evergreen landing (Home Screen / start_url without ?join=). */
    if (stored && !looksGenericOrgJoin(stored) && looksGenericOrgJoin(code)) {
      return;
    }
    return caches.open(JOIN_CACHE).then(function (cache) {
      var puts = [cache.put(JOIN_REQ, new Response(code, { headers: { "Content-Type": "text/plain" } }))];
      /* Keep a stored hub when this write has no hub. Wiping here is how
         a later join=CODE visit (no hub=) lost grove and painted Evergreen. */
      if (hub) {
        puts.push(cache.put(JOIN_HUB_REQ, new Response(hub, { headers: { "Content-Type": "text/plain" } })));
      }
      return Promise.all(puts);
    });
  }).catch(function () {});
}

function clearStoredJoin() {
  return caches.open(JOIN_CACHE).then(function (cache) {
    return Promise.all([cache.delete(JOIN_REQ), cache.delete(JOIN_HUB_REQ)]);
  }).catch(function () {});
}

function recalledJoin() {
  return caches.open(JOIN_CACHE).then(function (cache) {
    return cache.match(JOIN_REQ);
  }).then(function (hit) {
    return hit ? hit.text() : "";
  }).then(function (text) {
    return String(text || "").trim().toLowerCase();
  }).catch(function () {
    return "";
  });
}

function recalledHub() {
  return caches.open(JOIN_CACHE).then(function (cache) {
    return cache.match(JOIN_HUB_REQ);
  }).then(function (hit) {
    return hit ? hit.text() : "";
  }).then(function (text) {
    return normalizeHub(text);
  }).catch(function () {
    return "";
  });
}

function handleNavigate(event) {
  var url = event.request.url;
  var join = isHubNavigate(url) ? joinFromUrl(url) : "";
  var hub = isHubNavigate(url) ? hubFromUrl(url) : "";
  if (looksGenericOrgJoin(join)) join = "";
  if (join) {
    return storeJoin(join, hub).then(function () {
      try {
        var here = new URL(url);
        if (joinFromPathname(here.pathname) && !/join\.html$/i.test(here.pathname)) {
          var dest = new URL("./index.html", self.registration.scope);
          dest.searchParams.set("join", join);
          if (hub && !dest.searchParams.get("hub")) dest.searchParams.set("hub", hub);
          dest.hash = "join=" + encodeURIComponent(join);
          return Response.redirect(dest.toString(), 302);
        }
      } catch (ePath) {}
      return navigate(event);
    });
  }
  if (!isHubNavigate(url)) return navigate(event);
  /* Never 302-inject a leftover unique. The fetch URL has no hash, so a
     hash-only invite (#join=NEW) looked like a bare door and a stored
     leftover replaced it. Page JS + SW recall + the pinned start_url
     restore A2HS without overwriting this visit’s unique. */
  return navigate(event);
}

const NAV_TIMEOUT_MS = 2500;

/* Don't let a slow phone connection hold the app closed — after this long we
   paint from the last good copy and let the network catch up in the background. */

/* Hold the event open until the copy is written, or the worker can be shut down
   mid-put and leave a half-populated cache behind. */
function keep(event, req, res) {
  if (!res || !res.ok) return res;
  var copy = res.clone();
  var put = caches.open(CACHE_NAME).then(function (cache) {
    return cache.put(req, copy);
  }).catch(function () {});
  try { event.waitUntil(put); } catch (e) {}
  return res;
}

function navigate(event) {
  var req = event.request;
  /* Store the page under its path only — a deep link like ?go=leaders is the
     same document, and lead.html must not land on top of index.html. */
  var shell = "./index.html";
  try { shell = new URL(req.url).pathname; } catch (e) {}

  function lastGood() {
    return caches.match(shell).then(function (hit) {
      return hit || caches.match("./index.html");
    });
  }

  var net = fetch(req, { cache: "no-store" }).then(function (res) {
    return keep(event, shell, res);
  });
  net.catch(function () {});

  return new Promise(function (resolve) {
    var settled = false;
    function done(res) {
      if (settled || !res) return;
      settled = true;
      resolve(res);
    }
    var timer = setTimeout(function () {
      lastGood().then(done);
    }, NAV_TIMEOUT_MS);
    net.then(function (res) {
      clearTimeout(timer);
      done(res);
    }).catch(function () {
      clearTimeout(timer);
      lastGood().then(function (cached) {
        done(cached || Response.error());
      });
    });
  });
}

function cacheFirst(event, req) {
  return caches.match(req).then(function (cached) {
    if (cached) return cached;
    return fetch(req).then(function (res) {
      return keep(event, req, res);
    }).catch(function () {
      return Response.error();
    });
  });
}

function staleWhileRevalidate(event, req) {
  var net = fetch(req).then(function (res) {
    return keep(event, req, res);
  });
  net.catch(function () {});
  return caches.match(req).then(function (cached) {
    if (cached) return cached;
    return net.catch(function () {
      return Response.error();
    });
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = req.url;
  /* Never cache API / auth / video-embed traffic */
  if (/supabase\.co/i.test(url) || /googleapis|gstatic/i.test(url)) return;
  if (/youtube(?:-nocookie)?\.com|youtu\.be|googlevideo\.com|ytimg\.com|\.zoom\.us|zoom\.us/i.test(url)) return;

  if (req.mode === "navigate") {
    var navPath = "";
    try { navPath = new URL(url).pathname; } catch (eNav) { navPath = ""; }
    if (isCatalogSharePath(navPath)) {
      event.respondWith(Response.redirect(
        new URL("./assets/company/fresh-catalog.pdf", self.registration.scope).toString(),
        302
      ));
      return;
    }
    /* A shared catalog PDF is a real file. Do not paint the app shell
       if the 7MB download is slower than the navigate timeout. */
    if (/\.(?:pdf|png|jpe?g|webp|svg|ico|gif)(\?|$)/i.test(navPath)) {
      event.respondWith(fetch(req).catch(function () {
        return caches.match(req).then(function (hit) { return hit || Response.error(); });
      }));
      return;
    }
    event.respondWith(handleNavigate(event));
    return;
  }
  if (isManifest(url)) {
    event.respondWith(manifestWithJoin(event));
    return;
  }
  if (!isAppAsset(url)) return;

  if (isVersioned(url)) event.respondWith(cacheFirst(event, req));
  else event.respondWith(staleWhileRevalidate(event, req));
});

self.addEventListener("message", function (event) {
  var data = event.data || {};
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (data.type === "FS_STORE_JOIN") {
    event.waitUntil(storeJoin(data.code, data.hub));
    return;
  }
  if (data.type === "FS_GET_JOIN") {
    var port = event.ports && event.ports[0];
    event.waitUntil(Promise.all([recalledJoin(), recalledHub()]).then(function (pair) {
      if (port) port.postMessage({ code: pair[0] || "", hub: pair[1] || "" });
    }));
    return;
  }
  if (data.type === "FS_CLEAR_JOIN") {
    event.waitUntil(clearStoredJoin());
    return;
  }
  if (data.type === "FS_ACK_GROVE_BADGE") {
    event.waitUntil(ackGroveBadge(data.kind));
    return;
  }
  if (data.type === "FS_CLEAR_GROVE_BADGE") {
    event.waitUntil(clearAllGroveBadge());
    return;
  }
  if (data.type === "FS_PAINT_GROVE_BADGE") {
    event.waitUntil(applyGroveBadge());
  }
});

const VAPID_PUBLIC =
  "BFPRXGfEBWxAh0yhDEo62AW_Psg6wGYjC9H4r74B2tXNHMdBDRtTbW_jPEsiC0l4y-0LQWgk51mgDqBO3c9oaXU";
const PUSH_ROTATE_CACHE = "fs-push-rotate";
const PUSH_ROTATE_REQ = "./__pending_push_sub";

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  var raw = atob(base64);
  var output = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

function encodePushKey(buf) {
  if (!buf) return "";
  var bytes = new Uint8Array(buf);
  var binary = "";
  for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function subscriptionPayload(sub) {
  if (!sub) return null;
  var raw = {};
  try {
    raw = typeof sub.toJSON === "function" ? (sub.toJSON() || {}) : {};
  } catch (e) {
    raw = {};
  }
  var keys = raw.keys && typeof raw.keys === "object" ? raw.keys : {};
  var p256dh = keys.p256dh || "";
  var auth = keys.auth || "";
  if ((!p256dh || !auth) && typeof sub.getKey === "function") {
    try {
      p256dh = p256dh || encodePushKey(sub.getKey("p256dh"));
      auth = auth || encodePushKey(sub.getKey("auth"));
    } catch (e) {}
  }
  var endpoint = raw.endpoint || sub.endpoint || "";
  if (!endpoint || !p256dh || !auth) return null;
  return { endpoint: endpoint, keys: { p256dh: p256dh, auth: auth } };
}

async function storePendingPush(payload) {
  var cache = await caches.open(PUSH_ROTATE_CACHE);
  await cache.put(PUSH_ROTATE_REQ, new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" }
  }));
}

self.addEventListener("pushsubscriptionchange", function (event) {
  event.waitUntil((async function () {
    try {
      if (event.oldSubscription) {
        try { await event.oldSubscription.unsubscribe(); } catch (e) {}
      }
      var sub = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC)
      });
      var payload = subscriptionPayload(sub);
      if (payload) await storePendingPush(payload);
      var clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      clients.forEach(function (client) {
        try { client.postMessage({ type: "FS_PUSH_ROTATED" }); } catch (e) {}
      });
    } catch (err) {
      console.log("pushsubscriptionchange", err && err.message);
    }
  })());
});

self.addEventListener("push", function (event) {
  var data = {};
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    try { data = { body: event.data.text() }; } catch (e2) {}
  }
  var title = data.title || "First Seeds";
  var body = data.body || "You have an update.";
  var url = data.url || "./index.html";
  var tag = data.tag || "first-seeds";
  event.waitUntil((async function () {
    await self.registration.showNotification(title, {
      body: body,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      tag: tag,
      renotify: true,
      data: { url: url }
    });
    await bumpGroveBadge(groveKindFromPush(data));
  })());
});

const GROVE_BADGE_CACHE = "fs-grove-badge";
const GROVE_BADGE_REQ = "./__grove_badge";

function emptyGroveBadge() {
  return { leads: 0, joins: 0, messages: 0, customers: 0 };
}

function groveKindFromPush(data) {
  data = data || {};
  var kind = String(data.groveBadge || "");
  if (kind === "leads" || kind === "joins" || kind === "messages" || kind === "customers") return kind;
  var url = String(data.url || "");
  if (/[?&]go=leads\b/.test(url)) return "leads";
  if (/[?&]go=leader\b/.test(url)) return "joins";
  if (/[?&]go=customers\b/.test(url)) return "customers";
  if (/[?&]go=(board|messages|poll)\b/.test(url)) {
    if (/Evergreen/i.test(String(data.title || ""))) return "";
    return "messages";
  }
  return "";
}

async function readGroveBadge() {
  try {
    var cache = await caches.open(GROVE_BADGE_CACHE);
    var hit = await cache.match(GROVE_BADGE_REQ);
    if (!hit) return emptyGroveBadge();
    var raw = await hit.json();
    return {
      leads: Math.max(0, Number(raw && raw.leads) || 0),
      joins: Math.max(0, Number(raw && raw.joins) || 0),
      messages: Math.max(0, Number(raw && raw.messages) || 0),
      customers: Math.max(0, Number(raw && raw.customers) || 0)
    };
  } catch (e) {
    return emptyGroveBadge();
  }
}

async function writeGroveBadge(counts) {
  var cache = await caches.open(GROVE_BADGE_CACHE);
  await cache.put(GROVE_BADGE_REQ, new Response(JSON.stringify(counts), {
    headers: { "Content-Type": "application/json" }
  }));
}

function groveBadgeTotal(counts) {
  return (counts.leads || 0) + (counts.joins || 0) + (counts.messages || 0) + (counts.customers || 0);
}

async function applyGroveBadge(counts) {
  counts = counts || await readGroveBadge();
  try {
    if (self.navigator && self.navigator.setAppBadge) {
      var n = groveBadgeTotal(counts);
      if (n > 0) await self.navigator.setAppBadge(n);
      else if (self.navigator.clearAppBadge) await self.navigator.clearAppBadge();
      else await self.navigator.setAppBadge(0);
    }
  } catch (e) {}
  var clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clients.forEach(function (client) {
    try { client.postMessage({ type: "FS_GROVE_BADGE", counts: counts }); } catch (e2) {}
  });
}

async function hubIsOpen() {
  var clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (var i = 0; i < clients.length; i++) {
    try {
      if (clients[i].visibilityState === "visible") return true;
    } catch (e) {}
  }
  return false;
}

async function bumpGroveBadge(kind) {
  if (kind !== "leads" && kind !== "joins" && kind !== "messages" && kind !== "customers") return;
  if (await hubIsOpen()) return;
  var counts = await readGroveBadge();
  counts[kind] = (counts[kind] || 0) + 1;
  await writeGroveBadge(counts);
  await applyGroveBadge(counts);
}

async function ackGroveBadge(kind) {
  if (kind !== "leads" && kind !== "joins" && kind !== "messages" && kind !== "customers") return;
  var counts = await readGroveBadge();
  if (!counts[kind]) return;
  counts[kind] = 0;
  await writeGroveBadge(counts);
  await applyGroveBadge(counts);
}

async function clearAllGroveBadge() {
  var counts = emptyGroveBadge();
  await writeGroveBadge(counts);
  await applyGroveBadge(counts);
}

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var fallback = "./index.html";
  try { fallback = new URL("./index.html", self.registration.scope).href; } catch (e0) {}
  var url = (event.notification.data && event.notification.data.url) || fallback;
  try {
    var parsed = new URL(String(url), self.registration.scope);
    var origin = new URL(self.registration.scope).origin;
    if (parsed.origin !== origin || (parsed.protocol !== "https:" && parsed.protocol !== "http:")) {
      url = fallback;
    } else {
      url = parsed.href;
    }
  } catch (e) {
    url = fallback;
  }
  event.waitUntil((async function () {
    await clearAllGroveBadge();
    var clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    function isHub(client) {
      try {
        var path = new URL(client.url).pathname || "";
        return !/lead\.html$/i.test(path);
      } catch (e) {
        return false;
      }
    }
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (!isHub(client) || !("focus" in client)) continue;
      try { client.postMessage({ type: "FS_PUSH_OPEN", url: url }); } catch (e) {}
      return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })());
});
