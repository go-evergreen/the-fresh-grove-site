/* First Seeds — Web Push subscribe + Settings UI */
(function () {
  "use strict";

  var DEFAULTS = {
    grove_joins: "level1",
    cheers: true,
    how_i_grow: true,
    leads: true,
    notes: true,
    team_broadcasts: true,
    team_zooms: true,
    team_zoom_new: true,
    team_zoom_replay: true,
    calendar_day: true,
    cabinet_joins: true,
    customer_mail: true
  };
  var prefsCache = null;
  var busy = false;

  function Cloud() { return window.FS && window.FS.Cloud; }

  function $(id) { return document.getElementById(id); }

  function vapidKey() {
    var cfg = (window.FS && window.FS.SUPABASE) || {};
    return cfg.vapidPublicKey || "";
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(base64);
    var output = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
    return output;
  }

  function isStandalone() {
    try {
      if (window.navigator.standalone === true) return true;
      if (window.matchMedia) {
        if (window.matchMedia("(display-mode: standalone)").matches) return true;
        if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
        if (window.matchMedia("(display-mode: minimal-ui)").matches) return true;
      }
    } catch (e) {}
    return false;
  }

  function isIos() {
    var ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return false;
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    try {
      return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    } catch (e) {
      return false;
    }
  }

  function pushSupported() {
    return !!(
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }

  function permission() {
    try { return Notification.permission; } catch (e) { return "denied"; }
  }

  function setMsg(text, kind) {
    var el = $("pushSettingsMsg");
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("is-error", kind === "error");
  }

  function setBusy(on) {
    busy = !!on;
    var btn = $("pushEnableBtn");
    if (btn) btn.disabled = busy;
  }

  /* iOS keeps Notification.permission "granted" after unsubscribe. */
  var PUSH_OFF_KEY = "fs_push_off_this_phone";

  function pushOptedOut() {
    try { return localStorage.getItem(PUSH_OFF_KEY) === "1"; } catch (e) { return false; }
  }

  function setPushOptedOut(on) {
    try {
      if (on) localStorage.setItem(PUSH_OFF_KEY, "1");
      else localStorage.removeItem(PUSH_OFF_KEY);
    } catch (e) {}
  }

  function paintMasterOff() {
    var status = $("pushSettingsStatus");
    var enable = $("pushEnableBtn");
    if (status) {
      status.textContent = "Off on this phone.";
      status.className = "push-status off";
    }
    if (enable) {
      enable.hidden = false;
      enable.textContent = "Turn on notifications";
      enable.setAttribute("data-push-action", "on");
    }
  }

  async function waitForPushManager() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
    try {
      if (!navigator.serviceWorker.controller) {
        try {
          await navigator.serviceWorker.register("./sw.js?v=717", { updateViaCache: "none" });
        } catch (e) {}
      }
      var reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise(function (_, reject) {
          setTimeout(function () { reject(new Error("timeout")); }, 15000);
        })
      ]);
      return reg && reg.pushManager ? reg : null;
    } catch (e) {
      return null;
    }
  }

  function payloadFromSub(sub) {
    var payload = subscriptionJson(sub);
    if (!payload || !payload.endpoint) return null;
    var keys = payload.keys || {};
    if (!keys.p256dh || !keys.auth || keys.p256dh.length < 8 || keys.auth.length < 8) return null;
    return payload;
  }

  async function flushRotatedSubscription() {
    var c = Cloud();
    if (!c || !c.isSignedIn() || !c.savePushSubscription) return false;
    if (typeof caches === "undefined") return false;
    try {
      var cache = await caches.open("fs-push-rotate");
      var res = await cache.match("./__pending_push_sub");
      if (!res) return false;
      var pending = await res.json();
      if (!pending || !pending.endpoint || !pending.keys) return false;
      await saveWithRetry(pending);
      await cache.delete("./__pending_push_sub");
      return true;
    } catch (e) {
      return false;
    }
  }

  async function saveWithRetry(payload) {
    var c = Cloud();
    var last = null;
    for (var i = 0; i < 3; i++) {
      try {
        await c.savePushSubscription(payload);
        return true;
      } catch (e) {
        last = e;
        await new Promise(function (resolve) { setTimeout(resolve, 400 * (i + 1)); });
      }
    }
    throw last || new Error("Could not save this phone for pings.");
  }

  async function currentSubscription() {
    if (!pushSupported()) return null;
    try {
      var reg = await waitForPushManager();
      if (!reg) return null;
      return await reg.pushManager.getSubscription();
    } catch (e) {
      return null;
    }
  }

  function encodeKey(buf) {
    if (!buf) return "";
    var bytes = new Uint8Array(buf);
    var binary = "";
    for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function subscriptionJson(sub) {
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
        p256dh = p256dh || encodeKey(sub.getKey("p256dh"));
        auth = auth || encodeKey(sub.getKey("auth"));
      } catch (e) {}
    }
    return {
      endpoint: raw.endpoint || sub.endpoint || "",
      keys: { p256dh: p256dh, auth: auth }
    };
  }

  async function loadPrefs() {
    var c = Cloud();
    if (!c || !c.isSignedIn()) {
      prefsCache = Object.assign({}, DEFAULTS);
      return prefsCache;
    }
    try {
      prefsCache = await c.loadNotificationPrefs();
    } catch (e) {
      prefsCache = Object.assign({}, DEFAULTS);
    }
    return prefsCache;
  }

  function hidePrefRow(id, hide) {
    var el = $(id);
    if (!el) return;
    var row = el.closest ? el.closest(".setting-row") : el.parentNode;
    if (row) row.hidden = !!hide;
  }

  function paintPrefSupport() {
    var support = { cabinet: true, calendarDay: true, zoomExtra: true };
    try {
      var c = Cloud();
      if (c && c.notificationPrefSupport) support = c.notificationPrefSupport();
    } catch (e) {}
    hidePrefRow("optPushCabinetJoins", !support.cabinet);
    hidePrefRow("optPushCustomerMail", !support.cabinet);
    hidePrefRow("optPushCalendarDay", !support.calendarDay);
    hidePrefRow("optPushZoomNew", !support.zoomExtra);
    hidePrefRow("optPushZoomReplay", !support.zoomExtra);
  }

  function paintPrefs() {
    var p = prefsCache || DEFAULTS;
    var joins = p.grove_joins || "level1";
    var btns = document.querySelectorAll("[data-grove-joins]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("on", btns[i].getAttribute("data-grove-joins") === joins);
    }
    var cheer = $("optPushCheers");
    var notes = $("optPushNotes");
    var grow = $("optPushHowIGrow");
    var leads = $("optPushLeads");
    var broadcasts = $("optPushBroadcasts");
    var zooms = $("optPushZooms");
    var zoomNew = $("optPushZoomNew");
    var zoomReplay = $("optPushZoomReplay");
    var calendarDay = $("optPushCalendarDay");
    var cabinetJoins = $("optPushCabinetJoins");
    var customerMail = $("optPushCustomerMail");
    if (cheer) cheer.checked = p.cheers !== false;
    if (notes) notes.checked = p.notes !== false;
    if (grow) grow.checked = p.how_i_grow !== false;
    if (leads) leads.checked = p.leads !== false;
    if (broadcasts) broadcasts.checked = p.team_broadcasts !== false;
    if (zooms) zooms.checked = p.team_zooms !== false;
    if (zoomNew) zoomNew.checked = p.team_zoom_new !== false;
    if (zoomReplay) zoomReplay.checked = p.team_zoom_replay !== false;
    if (calendarDay) calendarDay.checked = p.calendar_day !== false;
    if (cabinetJoins) cabinetJoins.checked = p.cabinet_joins !== false;
    if (customerMail) customerMail.checked = p.customer_mail !== false;
    paintPrefSupport();
  }

  function setPrefsEnabled(on) {
    var btns = document.querySelectorAll("[data-grove-joins]");
    for (var i = 0; i < btns.length; i++) btns[i].disabled = !on;
    ["optPushCheers", "optPushNotes", "optPushHowIGrow", "optPushLeads", "optPushBroadcasts", "optPushZooms", "optPushZoomNew", "optPushZoomReplay", "optPushCalendarDay", "optPushCabinetJoins", "optPushCustomerMail"].forEach(function (id) {
      var el = $(id);
      if (el) el.disabled = !on;
    });
  }

  async function paintStatus() {
    var status = $("pushSettingsStatus");
    var enable = $("pushEnableBtn");
    var note = $("pushInstallNote");
    var signed = Cloud() && Cloud().isSignedIn();
    var cloud = Cloud() && Cloud().mode && Cloud().mode() === "supabase";
    var section = $("pushSettingsSection");
    if (section) section.hidden = false;

    if (!signed) {
      setPrefsEnabled(false);
      if (status) {
        status.textContent = "Sign in to turn on notifications on this phone.";
        status.className = "push-status off";
      }
      if (enable) {
        enable.hidden = true;
        enable.textContent = "Turn on notifications";
      }
      if (note) note.hidden = true;
      return;
    }

    if (!cloud) {
      setPrefsEnabled(false);
      if (status) {
        status.textContent = "Phone pings need a signed-in cloud account — local demo mode stays on this device only.";
        status.className = "push-status off";
      }
      if (enable) enable.hidden = true;
      if (note) note.hidden = true;
      return;
    }

    setPrefsEnabled(true);

    if (!pushSupported()) {
      if (status) {
        status.textContent = "This browser can’t receive push notifications.";
        status.className = "push-status off";
      }
      if (enable) enable.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent = isIos()
          ? "On iPhone or iPad, add First Seeds to your Home Screen (Safari → Share → Add to Home Screen), open it from that icon, then come back here."
          : "Try the Chrome browser (colorful circle — not the Google app) or Edge, or install First Seeds to your Home Screen.";
      }
      return;
    }

    if (isIos() && !isStandalone()) {
      if (status) {
        status.textContent = "Off on this device — iPhone and iPad only allow pings from the Home Screen app.";
        status.className = "push-status off";
      }
      if (enable) enable.hidden = true;
      if (note) {
        note.hidden = false;
        note.innerHTML = "Open <strong>Safari</strong> → Share → <strong>Add to Home Screen</strong>. Then open First Seeds from that icon and turn notifications on here.";
      }
      return;
    }

    if (note) note.hidden = true;
    var perm = permission();

    if (perm === "denied") {
      if (status) {
        status.textContent = "Blocked for this app. Turn notifications on in your phone’s Settings, then return here.";
        status.className = "push-status off";
      }
      if (enable) enable.hidden = true;
      if (note) {
        note.hidden = false;
        note.textContent = isIos()
          ? "iPhone or iPad Settings → First Seeds → Notifications."
          : "Site settings in your browser → Notifications → Allow.";
      }
      return;
    }

    if (perm === "granted") {
      if (pushOptedOut()) {
        paintMasterOff();
        return;
      }
      var registered = null;
      try { registered = await registerThisDevice({ interactive: false }); } catch (e) {}
      if (registered) {
        if (status) {
          status.textContent = "On · this phone will ping for the events you choose below.";
          status.className = "push-status";
        }
        if (enable) {
          enable.hidden = false;
          enable.textContent = "Turn off on this phone";
          enable.setAttribute("data-push-action", "off");
        }
        return;
      }
      if (status) {
        status.textContent = "Almost — tap Turn on to finish saving this phone.";
        status.className = "push-status off";
      }
      if (enable) {
        enable.hidden = false;
        enable.textContent = "Turn on notifications";
        enable.setAttribute("data-push-action", "on");
      }
      return;
    }

    if (status) {
      status.textContent = "Off on this phone.";
      status.className = "push-status off";
    }
    if (enable) {
      enable.hidden = false;
      enable.textContent = "Turn on notifications";
      enable.setAttribute("data-push-action", "on");
    }
  }

  async function refreshSettingsUI() {
    await loadPrefs();
    paintPrefs();
    await paintStatus();
  }

  async function isEnabledOnThisDevice() {
    if (pushOptedOut()) return false;
    if (!pushSupported() || permission() !== "granted") return false;
    if (isIos() && !isStandalone()) return false;
    try {
      return !!(await registerThisDevice({ interactive: false }));
    } catch (e) {
      return false;
    }
  }

  async function registerThisDevice(opts) {
    opts = opts || {};
    var interactive = !!opts.interactive;
    if (interactive) setPushOptedOut(false);
    else if (pushOptedOut()) return null;
    var c = Cloud();
    if (!c || !c.isSignedIn()) {
      if (interactive) throw new Error("Sign in first.");
      return null;
    }
    if (c.mode && c.mode() !== "supabase") {
      if (interactive) throw new Error("Phone pings need a signed-in cloud account.");
      return null;
    }
    if (!pushSupported()) {
      if (interactive) throw new Error("This browser can’t receive notifications.");
      return null;
    }
    var key = vapidKey();
    if (!key) {
      if (interactive) throw new Error("Push is not configured yet.");
      return null;
    }
    var perm = permission();
    if (perm !== "granted") {
      if (isIos() && !isStandalone()) {
        if (interactive) throw new Error("On iPhone or iPad, open First Seeds from your Home Screen icon first.");
        return null;
      }
      if (!interactive) return null;
      try {
        perm = await Notification.requestPermission();
      } catch (e) {
        perm = permission();
      }
    }
    if (perm !== "granted") {
      if (interactive) throw new Error("Notifications weren’t allowed.");
      return null;
    }
    var reg = await waitForPushManager();
    if (!reg) {
      if (interactive) throw new Error("This app isn’t ready for pings yet. Close it, open it from the Home Screen icon, then tap Turn on again.");
      return null;
    }
    var sub = null;
    try {
      sub = await reg.pushManager.getSubscription();
    } catch (e) {
      sub = null;
    }
    var payload = payloadFromSub(sub);
    var forceFresh = !!opts.forceFresh;
    if (payload && !forceFresh && c.pushEndpointKnown) {
      try {
        if (!(await c.pushEndpointKnown(payload.endpoint))) {
          /* Apple dropped this endpoint (410). Do not save it back. */
          if (!interactive) return null;
          forceFresh = true;
        }
      } catch (eKnown) {}
    }
    if (payload && forceFresh) {
      try { await sub.unsubscribe(); } catch (eUn) {}
      try { await c.deletePushSubscription(payload.endpoint); } catch (eDel) {}
      sub = null;
      payload = null;
    }
    if (!payload) {
      if (sub) {
        try { await sub.unsubscribe(); } catch (e) {}
      }
      try {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key)
        });
      } catch (e) {
        if (interactive) throw new Error((e && e.message) || "Couldn’t finish setting up pings. Try Turn on again.");
        return null;
      }
      payload = payloadFromSub(sub);
    }
    if (!payload) {
      if (interactive) throw new Error("Couldn’t finish setting up pings. Try Turn on again.");
      return null;
    }
    try {
      await saveWithRetry(payload);
    } catch (e) {
      if (interactive) throw e;
      return null;
    }
    return sub;
  }

  async function subscribeThisDevice(opts) {
    opts = opts || {};
    return registerThisDevice({
      interactive: true,
      forceFresh: !!opts.forceFresh
    });
  }

  async function unsubscribeThisDevice() {
    setPushOptedOut(true);
    var c = Cloud();
    var sub = await currentSubscription();
    var endpoint = sub && sub.endpoint;
    if (sub) {
      try { await sub.unsubscribe(); } catch (e) {}
    }
    if (c && c.isSignedIn() && endpoint) {
      try { await c.deletePushSubscription(endpoint); } catch (e) {}
    }
  }

  async function syncThisDevice() {
    if (pushOptedOut()) {
      var leftover = null;
      try { leftover = await currentSubscription(); } catch (e) {}
      if (leftover) {
        try { await unsubscribeThisDevice(); } catch (e) {}
      }
      return null;
    }
    try { await flushRotatedSubscription(); } catch (eFlush) {}
    return registerThisDevice({ interactive: false });
  }

  async function savePref(patch) {
    var c = Cloud();
    if (!c || !c.isSignedIn()) return;
    try {
      prefsCache = await c.saveNotificationPrefs(patch);
      paintPrefs();
      setMsg("Saved.");
    } catch (e) {
      setMsg((e && e.message) || "Could not save.", "error");
    }
  }

  function wireSettings() {
    var enable = $("pushEnableBtn");
    if (enable && !enable.dataset.bound) {
      enable.dataset.bound = "1";
      enable.addEventListener("click", async function () {
        if (busy) return;
        setMsg("");
        var turningOff = enable.getAttribute("data-push-action") === "off";
        if (turningOff) {
          setPushOptedOut(true);
          paintMasterOff();
        }
        setBusy(true);
        try {
          if (turningOff) {
            await unsubscribeThisDevice();
            setMsg("Notifications off on this phone.");
          } else {
            await subscribeThisDevice();
            setMsg("This phone will ping you.");
          }
          await paintStatus();
        } catch (e) {
          setMsg((e && e.message) || "Could not update notifications.", "error");
          await paintStatus();
        } finally {
          setBusy(false);
        }
      });
    }

    var joinBtns = document.querySelectorAll("[data-grove-joins]");
    for (var i = 0; i < joinBtns.length; i++) {
      if (joinBtns[i].dataset.bound === "1") continue;
      joinBtns[i].dataset.bound = "1";
      joinBtns[i].addEventListener("click", function () {
        var v = this.getAttribute("data-grove-joins");
        savePref({ grove_joins: v });
      });
    }

    function bindSwitch(id, key) {
      var el = $(id);
      if (!el || el.dataset.bound === "1") return;
      el.dataset.bound = "1";
      el.addEventListener("change", function () {
        var patch = {};
        patch[key] = !!el.checked;
        savePref(patch);
      });
    }
    bindSwitch("optPushCheers", "cheers");
    bindSwitch("optPushNotes", "notes");
    bindSwitch("optPushHowIGrow", "how_i_grow");
    bindSwitch("optPushLeads", "leads");
    bindSwitch("optPushBroadcasts", "team_broadcasts");
    bindSwitch("optPushZooms", "team_zooms");
    bindSwitch("optPushZoomNew", "team_zoom_new");
    bindSwitch("optPushZoomReplay", "team_zoom_replay");
    bindSwitch("optPushCalendarDay", "calendar_day");
    bindSwitch("optPushCabinetJoins", "cabinet_joins");
    bindSwitch("optPushCustomerMail", "customer_mail");
  }

  function setAppUnread(count) {
    var n = Math.max(0, Number(count) || 0);
    try {
      if (!navigator.setAppBadge) return;
      if (n > 0) navigator.setAppBadge(n);
      else if (navigator.clearAppBadge) navigator.clearAppBadge();
      else navigator.setAppBadge(0);
    } catch (e) {}
  }

  function tellWorker(type, extra) {
    if (!navigator.serviceWorker) return;
    var msg = Object.assign({ type: type }, extra || {});
    function send(worker) {
      if (!worker) return;
      try { worker.postMessage(msg); } catch (e) {}
    }
    try { send(navigator.serviceWorker.controller); } catch (e0) {}
    navigator.serviceWorker.ready.then(function (reg) {
      send(reg.active);
      send(reg.waiting);
      send(reg.installing);
    }).catch(function () {});
  }

  function zeroGroveBadgeCache() {
    if (!window.caches || !caches.open) return Promise.resolve();
    var body = JSON.stringify({ leads: 0, joins: 0, messages: 0, customers: 0 });
    var reqs = ["./__grove_badge"];
    try { reqs.push(new URL("./__grove_badge", window.location.origin + "/").href); } catch (e) {}
    return caches.open("fs-grove-badge").then(function (cache) {
      return Promise.all(reqs.map(function (req) {
        return cache.put(req, new Response(body, {
          headers: { "Content-Type": "application/json" }
        }));
      }));
    }).catch(function () {});
  }

  function dismissShownNotifications() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.ready.then(function (reg) {
      if (!reg.getNotifications) return;
      return reg.getNotifications().then(function (list) {
        for (var i = 0; i < (list || []).length; i++) {
          try { list[i].close(); } catch (e) {}
        }
      });
    }).catch(function () {});
  }

  function ackGroveBadge(kind) {
    if (kind !== "leads" && kind !== "joins" && kind !== "messages" && kind !== "customers") return;
    tellWorker("FS_ACK_GROVE_BADGE", { kind: kind });
  }

  function paintGroveBadge() {
    tellWorker("FS_PAINT_GROVE_BADGE");
  }

  /* Home-screen "1" is a leftover ping. Opening the app should clear it —
     iOS will not, and we used to re-paint the stored count on every open. */
  function clearGroveBadge() {
    setAppUnread(0);
    dismissShownNotifications();
    zeroGroveBadgeCache();
    tellWorker("FS_CLEAR_GROVE_BADGE");
  }

  function groveKindFromUrl(url) {
    var href = String(url || "");
    if (/[?&]go=leads\b/.test(href)) return "leads";
    if (/[?&]go=leader\b/.test(href)) return "joins";
    if (/[?&]go=customers\b/.test(href)) return "customers";
    if (/[?&]go=(board|messages|poll)\b/.test(href)) return "messages";
    return "";
  }

  function handlePushOpen(url) {
    var kind = groveKindFromUrl(url);
    if (kind) ackGroveBadge(kind);
    if (!url || !window.FS || typeof window.FS.openPushUrl !== "function") return;
    window.FS.openPushUrl(url);
  }

  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", function (event) {
      if (event.data && event.data.type === "FS_PUSH_OPEN") {
        handlePushOpen(event.data.url);
      }
      if (event.data && event.data.type === "FS_GROVE_BADGE") {
        var c = event.data.counts || {};
        setAppUnread((c.leads || 0) + (c.joins || 0) + (c.messages || 0) + (c.customers || 0));
      }
      if (event.data && event.data.type === "FS_PUSH_ROTATED") {
        flushRotatedSubscription().then(function () {
          return registerThisDevice({ interactive: false });
        }).catch(function () {});
      }
    });
  }

  var syncTimer = null;
  function scheduleSync() {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      syncThisDevice().then(function (sub) {
        if (sub) refreshSettingsUI().catch(function () {});
      }).catch(function () {});
    }, 500);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      clearGroveBadge();
      scheduleSync();
    }
  });
  window.addEventListener("pageshow", function () {
    clearGroveBadge();
    scheduleSync();
  });
  window.addEventListener("focus", scheduleSync);

  window.FS.Push = {
    refreshSettingsUI: refreshSettingsUI,
    wireSettings: wireSettings,
    syncThisDevice: syncThisDevice,
    enableThisDevice: subscribeThisDevice,
    isEnabledOnThisDevice: isEnabledOnThisDevice,
    optedOutOnThisPhone: pushOptedOut,
    isStandalone: isStandalone,
    isIos: isIos,
    permission: permission,
    isSupported: pushSupported,
    ackGroveBadge: ackGroveBadge,
    paintGroveBadge: paintGroveBadge,
    clearGroveBadge: clearGroveBadge
  };

  clearGroveBadge();
})();
