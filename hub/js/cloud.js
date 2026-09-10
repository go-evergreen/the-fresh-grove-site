/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — CLOUD BRIDGE
   Auth, invite links, progress sync, team queries, cheers.
   Uses Supabase when configured; otherwise local bridge mode.
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

/* http(s) only — blocks javascript:/data: in <a href> and stored meeting links. */
window.FS.safeHref = function (raw, maxLen) {
  var s = String(raw == null ? "" : raw).trim();
  if (!s) return "";
  var cap = typeof maxLen === "number" ? maxLen : 2000;
  if (s.length > cap) s = s.slice(0, cap);
  try {
    var base = "";
    try { base = String(window.location.href || ""); } catch (e0) {}
    var u = base ? new URL(s, base) : new URL(s);
    var proto = String(u.protocol || "").toLowerCase();
    if (proto !== "https:" && proto !== "http:") return "";
    if (!u.hostname) return "";
    return u.href;
  } catch (e) {
    return "";
  }
};

/* Zoom / Meet / Teams pastes often include “Join Zoom Meeting” plus a
   protocol-less host. Pull the real http(s) URL. Never resolve a bare
   zoom.us path against this hub (that made Join open first-seeds). */
window.FS.normalizeMeetingHref = function (raw, maxLen) {
  var s = String(raw == null ? "" : raw).trim();
  if (!s) return "";
  var cap = typeof maxLen === "number" ? maxLen : 2000;
  var found = s.match(/https?:\/\/[^\s<>"'\\]+/i);
  if (found) {
    s = found[0].replace(/[.,);]+$/g, "");
  } else {
    var host = s.match(/(?:[\w-]+\.)?(?:zoom\.us|zoomgov\.com)\/[^\s<>"'\\]+/i);
    if (host) s = "https://" + host[0].replace(/[.,);]+$/g, "");
    else if (/^[\w.-]+\.[a-z]{2,}[:/?#]/i.test(s)) s = "https://" + s;
    else return "";
  }
  return window.FS.safeHref(s, cap);
};

(function () {
  "use strict";

  var LOCAL_KEY = "firstSeeds_bridge_v1";
  var JOIN_KEY = "firstSeeds_pending_join";
  var JOIN_HUB_KEY = "firstSeeds_pending_join_hub";
  var SHARE_HOST_KEY = "firstSeeds_share_host";
  var JOIN_COOKIE = "fs_pending_join";
  var APPLIED_JOIN_KEY = "firstSeeds_applied_join";
  var SKIPPED_JOIN_KEY = "firstSeeds_skipped_join";
  var LAST_EMAIL_KEY = "firstSeeds_last_email";
  var RESET_KEY = "firstSeeds_password_reset";
  var passwordResetPending = false;
  var client = null;
  var sessionUser = null;
  var orgEventsNet = { user: "", orgId: "", at: 0, raw: null, inflight: null };
  var teamGraphNet = { user: "", pack: "", at: 0, raw: null, inflight: null };
  var downlineNet = { user: "", pack: "", at: 0, raw: null, inflight: null };

  function teamNetPack() {
    return (Cloud.packIsEvergreen && Cloud.packIsEvergreen()) ? "ev" : "grove";
  }

  function clearTeamNet() {
    teamGraphNet = { user: "", pack: "", at: 0, raw: null, inflight: null };
    downlineNet = { user: "", pack: "", at: 0, raw: null, inflight: null };
  }
  var cabinetLiteOk = null;
  var cabinetRosterNet = { user: "", at: 0, raw: null, inflight: null };

  function clearCabinetRosterNet() {
    cabinetRosterNet = { user: "", at: 0, raw: null, inflight: null };
  }
  var userSignedOut = false;
  var recoveringSession = false;
  var orgsCache = [];
  var bootReady = false;
  var listeners = [];
  var leaderClaimNotice = "";
  var cachedLeaderCode = "";
  var cachedPrivateLinks = {};
  var leaderPdfBuf = null;

  function orgBySlug(slug) {
    var i;
    for (i = 0; i < orgsCache.length; i++) {
      if (orgsCache[i] && orgsCache[i].slug === slug) return orgsCache[i];
    }
    return null;
  }

  function orgById(id) {
    var i;
    for (i = 0; i < orgsCache.length; i++) {
      if (orgsCache[i] && orgsCache[i].id === id) return orgsCache[i];
    }
    return null;
  }

  function looksLikeLeaderJoin(code) {
    code = String(code || "").trim().toLowerCase();
    return code.indexOf("evl-") === 0 || code === "evergreen-leaders";
  }

  function evergreenLeaderCode() {
    if (cachedLeaderCode) return cachedLeaderCode;
    var live = orgBySlug("evergreen-co");
    if (live && live.leader_code) return String(live.leader_code).trim().toLowerCase();
    return "";
  }

  async function refreshAdminSecrets() {
    if (!sessionUser) {
      cachedLeaderCode = "";
      cachedPrivateLinks = {};
      return;
    }
    var amAdmin = !!(sessionUser.is_org_admin || sessionUser.is_hub_admin || sessionUser.is_super_admin);
    if (!amAdmin) {
      cachedLeaderCode = "";
      cachedPrivateLinks = {};
      return;
    }
    if (configured() && client) {
      try {
        var codeRes = await client.rpc("my_org_leader_code");
        if (!codeRes.error && codeRes.data) {
          cachedLeaderCode = String(codeRes.data).trim().toLowerCase();
        }
      } catch (eCode) {}
      try {
        var linkRes = await client.rpc("leader_private_links");
        if (!linkRes.error && linkRes.data && typeof linkRes.data === "object") {
          cachedPrivateLinks = linkRes.data;
        }
      } catch (eLinks) {}
    }
  }

  function sameId(a, b) {
    return !!a && !!b && String(a) === String(b);
  }

  function slugFromOrgId(id) {
    if (!id) return "";
    var known = window.FS.PACK_IDS || {};
    if (sameId(id, known["evergreen-co"])) return "evergreen-co";
    if (sameId(id, known["fresh-grove"])) return "fresh-grove";
    var live = orgById(id);
    return (live && live.slug) || "";
  }

  function pendingIsEvergreenLeader(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code) return false;
    if (looksLikeLeaderJoin(code)) return true;
    var live = evergreenLeaderCode();
    return !!live && code === live;
  }

  function pendingIsEvergreenJoin(code) {
    code = String(code || "").trim().toLowerCase();
    return code === "evergreen" || pendingIsEvergreenLeader(code);
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

  function joinFromLocation() {
    try {
      var query = String(new URLSearchParams(window.location.search).get("join") || "").trim().toLowerCase();
      var hash = "";
      var hm = String(window.location.hash || "").match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
      if (hm) hash = decodeURIComponent(hm[1] || "").trim().toLowerCase();
      return pickJoinCode(query, hash, joinFromPathname(window.location.pathname));
    } catch (e) {}
    return "";
  }

  function pendingIsPersonInvite(code) {
    code = String(code || "").trim().toLowerCase();
    return !!code && !pendingIsEvergreenJoin(code);
  }

  function isStickyJoin(code) {
    code = String(code || "").trim().toLowerCase();
    return !!code && code !== "evergreen";
  }

  /* URL unique/leader wins. Else keep whatever unique/leader we already have.
     The generic door never replaces a person code. */
  function pickStickyJoin(urlCode, storedCode) {
    urlCode = String(urlCode || "").trim().toLowerCase();
    storedCode = String(storedCode || "").trim().toLowerCase();
    if (urlCode === "evergreen") urlCode = "";
    if (storedCode === "evergreen") storedCode = "";
    if (isStickyJoin(urlCode)) return urlCode;
    if (isStickyJoin(storedCode)) return storedCode;
    return "";
  }


  function sessionIsEvergreen() {
    if (!sessionUser) return false;
    if (sessionUser.org_slug === "evergreen-co") return true;
    var ids = window.FS.PACK_IDS || {};
    return sameId(sessionUser.org_id, ids["evergreen-co"]);
  }

  function sessionIsGrove() {
    if (!sessionUser || sessionIsEvergreen()) return false;
    if (sessionUser.org_slug === "fresh-grove") return true;
    var ids = window.FS.PACK_IDS || {};
    return sameId(sessionUser.org_id, ids["fresh-grove"]);
  }

  function noteLeaderClaim(kind) {
    if (kind) leaderClaimNotice = kind;
  }

  function rememberShareHost() {
    try {
      var host = "";
      if (sessionIsEvergreen()) host = "evergreen";
      else if (sessionIsGrove()) host = "grove";
      if (!host) return;
      localStorage.setItem(SHARE_HOST_KEY, host);
      sessionStorage.setItem(SHARE_HOST_KEY, host);
    } catch (e) {}
  }

  function clearShareHost() {
    try { localStorage.removeItem(SHARE_HOST_KEY); } catch (e) {}
    try { sessionStorage.removeItem(SHARE_HOST_KEY); } catch (e2) {}
  }

  function rememberedShareHost() {
    try {
      var h = String(localStorage.getItem(SHARE_HOST_KEY) || "").trim().toLowerCase();
      if (h === "grove" || h === "evergreen") return h;
    } catch (e) {}
    try {
      var h2 = String(sessionStorage.getItem(SHARE_HOST_KEY) || "").trim().toLowerCase();
      if (h2 === "grove" || h2 === "evergreen") return h2;
    } catch (e2) {}
    return "";
  }

  function emit(evt, payload) {
    if (evt === "auth") {
      if (sessionUser) rememberShareHost();
      else clearShareHost();
    }
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](evt, payload); } catch (e) {}
    }
  }

  function onChange(fn) { listeners.push(fn); }

  function configured() {
    return typeof window.FS.supabaseConfigured === "function" && window.FS.supabaseConfigured();
  }

  function errText(err) {
    if (!err) return "";
    if (typeof err === "string") return err;
    return String(err.message || err.error_description || err.details || "");
  }

  function isNetworkCloudError(err) {
    var m = errText(err).toLowerCase();
    var name = String((err && err.name) || "");
    return name === "TypeError" ||
      /load failed|failed to fetch|networkerror|network request failed|fetch failed|aborterror|the internet connection appears to be offline/i.test(m);
  }

  function normalizeAuthEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function rememberLastEmail(email) {
    email = normalizeAuthEmail(email);
    if (!email || email.indexOf("@") < 1) return;
    try { localStorage.setItem(LAST_EMAIL_KEY, email); } catch (e) {}
  }

  function lastRememberedEmail() {
    try { return normalizeAuthEmail(localStorage.getItem(LAST_EMAIL_KEY) || ""); } catch (e) { return ""; }
  }

  function readPasswordReset() {
    try {
      var raw = localStorage.getItem(RESET_KEY) || sessionStorage.getItem(RESET_KEY) || "";
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.step) return null;
      if (o.step !== "email" && !o.email) return null;
      var at = Number(o.at) || 0;
      if (at && (Date.now() - at) > 60 * 60 * 1000) {
        clearPasswordReset();
        return null;
      }
      return o;
    } catch (e) {
      return null;
    }
  }

  function writePasswordReset(patch) {
    var prev = readPasswordReset() || {};
    var next = {
      email: normalizeAuthEmail(patch.email || prev.email),
      step: String(patch.step || prev.step || "email"),
      at: Date.now()
    };
    try { localStorage.setItem(RESET_KEY, JSON.stringify(next)); } catch (e) {}
    try { sessionStorage.setItem(RESET_KEY, JSON.stringify(next)); } catch (e2) {}
    passwordResetPending = next.step === "password";
    return next;
  }

  function clearPasswordReset() {
    passwordResetPending = false;
    try { localStorage.removeItem(RESET_KEY); } catch (e) {}
    try { sessionStorage.removeItem(RESET_KEY); } catch (e2) {}
  }

  function throwCloud(err, fallback) {
    var msg = isNetworkCloudError(err)
      ? (fallback || "Couldn’t reach the hub just now — try again in a moment.")
      : (errText(err) || fallback || "Something went wrong.");
    var e = new Error(msg);
    e.cause = err;
    throw e;
  }

  function likelyStoredSession() {
    try {
      if (localStorage.getItem("fsSigned") === "1") return true;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (k.indexOf("auth-token") === -1) continue;
        var v = localStorage.getItem(k) || "";
        if (v.indexOf("access_token") !== -1 || v.indexOf("refresh_token") !== -1) return true;
      }
    } catch (eLikely) {}
    return false;
  }

  function markSignedInFlag() {
    try { localStorage.setItem("fsSigned", "1"); } catch (e) {}
    try { localStorage.removeItem("fsUserSignedOut"); } catch (e) {}
  }

  function choseSignOut() {
    if (userSignedOut) return true;
    try { return localStorage.getItem("fsUserSignedOut") === "1"; } catch (e) { return false; }
  }

  async function adoptSessionUser(user) {
    if (!user) return null;
    userSignedOut = false;
    var prev = sessionUser;
    try {
      sessionUser = await Cloud._hydrateSupabaseUser(user);
    } catch (err) {
      try {
        sessionUser = await Cloud._hydrateSupabaseUser(user);
      } catch (err2) {
        if (prev && prev.id === user.id && (prev.is_org_admin || prev.lead_slug || prev.org_id)) {
          sessionUser = prev;
          try { if (window.FS.reportError) window.FS.reportError("profile-hydrate", err2); } catch (eRep) {}
        } else {
          /* First paint with auth basics only. Same-user retry above keeps
             a Grove Leader from losing Clients on a blip. */
          sessionUser = Cloud._publicUser({
            id: user.id,
            email: user.email,
            display_name: (user.user_metadata && user.user_metadata.display_name) ||
              (user.email || "friend").split("@")[0],
            invite_code: "",
            sponsor_id: null,
            invited_by_id: null,
            is_org_admin: false,
            is_hub_admin: false,
            is_super_admin: false,
            hub_mode: "",
            tour_done: false,
            lead_slug: "",
            lead_blurb: "",
            lead_thanks: ""
          });
        }
      }
    }
    try { await maybeClaimGroveLeaderSlug(); } catch (eSlug) {}
    markSignedInFlag();
    return sessionUser;
  }

  async function maybeClaimGroveLeaderSlug() {
    if (!sessionUser || sessionUser.is_super_admin) return;
    if (!sessionIsGrove() || sessionIsEvergreen()) return;
    if (!sessionUser.is_org_admin) return;
    var slug = String(sessionUser.lead_slug || "").trim().toLowerCase();
    if (slug && slug !== "tay" && slug !== "join" && slug !== "taylor") return;
    if (!Cloud.ensureLeadSlug) return;
    await Cloud.ensureLeadSlug();
  }

  async function recoverStoredSession() {
    if (!client || userSignedOut || recoveringSession) return null;
    recoveringSession = true;
    try {
      try {
        var again = await client.auth.getSession();
        if (again.data && again.data.session && again.data.session.user) {
          return await adoptSessionUser(again.data.session.user);
        }
      } catch (eGet) {}
      try {
        var refreshed = await client.auth.refreshSession();
        if (refreshed.data && refreshed.data.session && refreshed.data.session.user) {
          return await adoptSessionUser(refreshed.data.session.user);
        }
      } catch (eRef) {}
      return null;
    } finally {
      recoveringSession = false;
    }
  }

  async function resumePersistedSession() {
    if (!client || userSignedOut) return;
    if (sessionUser) {
      await wakeSession();
      return;
    }
    if (!likelyStoredSession()) return;
    var recovered = await recoverStoredSession();
    if (!recovered) return;
    if (ejectEvergreenFromGroveHost()) return;
    emit("auth", sessionUser);
  }

  async function wakeSession() {
    if (!client) return;
    try {
      var ses = await client.auth.getSession();
      var session = ses && ses.data && ses.data.session;
      if (!session) {
        if (!userSignedOut && likelyStoredSession()) await recoverStoredSession();
        return;
      }
      var exp = session.expires_at ? Number(session.expires_at) * 1000 : 0;
      if (exp && exp - Date.now() < 90 * 1000) {
        await client.auth.refreshSession();
      }
    } catch (e) {}
  }

  async function rpcWrite(name, args, fallback) {
    if (!configured() || !client) throw new Error(fallback || "Needs a signed-in cloud account.");
    await wakeSession();
    async function once() {
      var res = await client.rpc(name, args || {});
      if (res.error) throw res.error;
      return res.data;
    }
    try {
      return await once();
    } catch (err) {
      if (!isNetworkCloudError(err)) throwCloud(err, fallback);
      await new Promise(function (r) { setTimeout(r, 450); });
      try {
        await wakeSession();
        return await once();
      } catch (err2) {
        throwCloud(err2, fallback);
      }
    }
  }

  async function recentBoardPostExists(listRpc, msg) {
    try {
      var res = await client.rpc(listRpc);
      if (res.error || !res.data) return false;
      var row = res.data;
      if (typeof row === "string") {
        try { row = JSON.parse(row); } catch (e) { return false; }
      }
      var posts = (row && row.posts) || [];
      var want = String(msg || "").trim();
      var now = Date.now();
      for (var i = 0; i < posts.length; i++) {
        if (String((posts[i] && posts[i].body) || "").trim() !== want) continue;
        var at = Date.parse((posts[i] && posts[i].created_at) || "");
        if (!isNaN(at) && now - at < 3 * 60 * 1000) return true;
      }
    } catch (e) {}
    return false;
  }

  function normalizeGroveIg(raw) {
    var t = String(raw || "").trim();
    t = t.replace(/^@+/, "");
    t = t.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "");
    t = t.replace(/[/?#].*$/, "");
    t = t.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30);
    if (/^(www\.)?instagram\.com$/i.test(t)) return "";
    return t;
  }

  var PHOTO_MAX_BYTES = 12 * 1024 * 1024;
  var PHOTO_THUMB = 256;
  var PHOTO_FULL = 640;

  function photoExtOf(person) {
    var ext = person && person.photo_ext;
    if (ext === "jpg" || ext === "jpeg") return "jpg";
    return "webp";
  }

  function loadPhotoBitmap(file) {
    if (typeof createImageBitmap === "function") {
      return createImageBitmap(file, { imageOrientation: "from-image" }).catch(function () {
        return createImageBitmap(file);
      });
    }
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("Couldn’t read that photo."));
      };
      img.src = url;
    });
  }

  function squareCanvasFrom(src, edge, crop) {
    var w = src.width || src.naturalWidth || 0;
    var h = src.height || src.naturalHeight || 0;
    if (!w || !h) throw new Error("Couldn’t read that photo.");
    var side = Math.min(w, h);
    var sx = Math.round((w - side) / 2);
    var sy = Math.round((h - side) / 2);
    if (crop && crop.side > 0) {
      side = Math.min(Number(crop.side) || side, w, h);
      sx = Math.max(0, Math.min(w - side, Number(crop.sx) || 0));
      sy = Math.max(0, Math.min(h - side, Number(crop.sy) || 0));
    }
    var canvas = document.createElement("canvas");
    canvas.width = edge;
    canvas.height = edge;
    var ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn’t prepare that photo.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, sx, sy, side, side, 0, 0, edge, edge);
    return canvas;
  }

  function fitCanvasFrom(src, maxEdge) {
    var w = src.width || src.naturalWidth || 0;
    var h = src.height || src.naturalHeight || 0;
    if (!w || !h) throw new Error("Couldn’t read that photo.");
    var scale = Math.min(1, maxEdge / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * scale));
    var ch = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    var ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn’t prepare that photo.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, w, h, 0, 0, cw, ch);
    return canvas;
  }

  function canvasToPhotoBlob(canvas, quality) {
    var qWebp = typeof quality === "number" ? quality : 0.84;
    var qJpeg = Math.max(0.76, qWebp - 0.04);
    return new Promise(function (resolve, reject) {
      function asJpeg() {
        canvas.toBlob(function (blob) {
          if (!blob || !blob.size) reject(new Error("Couldn’t save that photo."));
          else resolve({ blob: blob, ext: "jpg" });
        }, "image/jpeg", qJpeg);
      }
      try {
        canvas.toBlob(function (blob) {
          if (blob && blob.size && (blob.type === "image/webp" || blob.type === "")) {
            resolve({ blob: blob, ext: "webp" });
          } else asJpeg();
        }, "image/webp", qWebp);
      } catch (e) {
        asJpeg();
      }
    });
  }

  async function compressGrovePhoto(file, crop) {
    if (!file) throw new Error("Pick a photo first.");
    if (file.size > PHOTO_MAX_BYTES) throw new Error("That photo is too large — try another.");
    var bmp = await loadPhotoBitmap(file);
    try {
      var thumbCanvas = squareCanvasFrom(bmp, PHOTO_THUMB, crop);
      var fullCanvas = squareCanvasFrom(bmp, PHOTO_FULL, crop);
      var thumb = await canvasToPhotoBlob(thumbCanvas);
      var full = await canvasToPhotoBlob(fullCanvas);
      var ext = (thumb.ext === "webp" && full.ext === "webp") ? "webp" : "jpg";
      if (ext === "jpg" && thumb.ext !== "jpg") {
        thumb = await new Promise(function (resolve, reject) {
          thumbCanvas.toBlob(function (blob) {
            if (!blob) reject(new Error("Couldn’t save that photo."));
            else resolve({ blob: blob, ext: "jpg" });
          }, "image/jpeg", 0.82);
        });
      }
      if (ext === "jpg" && full.ext !== "jpg") {
        full = await new Promise(function (resolve, reject) {
          fullCanvas.toBlob(function (blob) {
            if (!blob) reject(new Error("Couldn’t save that photo."));
            else resolve({ blob: blob, ext: "jpg" });
          }, "image/jpeg", 0.82);
        });
      }
      return { thumb: thumb.blob, full: full.blob, ext: ext };
    } finally {
      if (bmp && typeof bmp.close === "function") try { bmp.close(); } catch (eClose) {}
    }
  }

  var FRAME_THUMB = 420;
  var FRAME_FULL = 1080;

  function padFrame(n) {
    n = Number(n) || 0;
    return n < 10 ? "0" + n : String(n);
  }

  async function compressGroveFrame(file) {
    if (!file) throw new Error("Pick a photo first.");
    if (file.size > PHOTO_MAX_BYTES) throw new Error("That photo is too large — try another.");
    var bmp = await loadPhotoBitmap(file);
    try {
      var thumbCanvas = fitCanvasFrom(bmp, FRAME_THUMB);
      var fullCanvas = fitCanvasFrom(bmp, FRAME_FULL);
      var thumb = await canvasToPhotoBlob(thumbCanvas, 0.80);
      var full = await canvasToPhotoBlob(fullCanvas, 0.86);
      var ext = (thumb.ext === "webp" && full.ext === "webp") ? "webp" : "jpg";
      if (ext === "jpg" && thumb.ext !== "jpg") {
        thumb = await new Promise(function (resolve, reject) {
          thumbCanvas.toBlob(function (blob) {
            if (!blob) reject(new Error("Couldn’t save that photo."));
            else resolve({ blob: blob, ext: "jpg" });
          }, "image/jpeg", 0.80);
        });
      }
      if (ext === "jpg" && full.ext !== "jpg") {
        full = await new Promise(function (resolve, reject) {
          fullCanvas.toBlob(function (blob) {
            if (!blob) reject(new Error("Couldn’t save that photo."));
            else resolve({ blob: blob, ext: "jpg" });
          }, "image/jpeg", 0.84);
        });
      }
      return { thumb: thumb.blob, full: full.blob, ext: ext };
    } finally {
      if (bmp && typeof bmp.close === "function") try { bmp.close(); } catch (eClose) {}
    }
  }

  /* Cookie + localStorage are a backup. iOS Home Screen apps (16.4+) often
     do NOT share Safari storage, so the invite also has to live in the URL /
     manifest start_url or it is lost at Add to Home Screen. */
  function readJoinCookie() {
    try {
      var parts = String(document.cookie || "").split(";");
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i].trim();
        if (p.indexOf(JOIN_COOKIE + "=") === 0) {
          return decodeURIComponent(p.slice(JOIN_COOKIE.length + 1)).trim().toLowerCase();
        }
      }
    } catch (e) {}
    return "";
  }

  function writeJoinCookie(code) {
    try {
      var secure = window.location.protocol === "https:" ? "; Secure" : "";
      var scoped = joinBasePath() || "/";
      var paths = [scoped];
      if (scoped !== "/") paths.push("/");
      var domains = [""];
      try {
        if (onGroveHost(String(window.location.hostname || ""))) {
          domains.push("; Domain=.thefreshgrove.team");
        } else if (onEvergreenPublicHost(String(window.location.hostname || ""))) {
          domains.push("; Domain=.evergreenco.team");
        }
      } catch (eD) {}
      var i;
      var d;
      for (i = 0; i < paths.length; i++) {
        for (d = 0; d < domains.length; d++) {
          if (code) {
            document.cookie = JOIN_COOKIE + "=" + encodeURIComponent(code) +
              "; path=" + paths[i] + "; max-age=2592000; SameSite=Lax" + secure + domains[d];
          } else {
            document.cookie = JOIN_COOKIE + "=; path=" + paths[i] + "; max-age=0; SameSite=Lax" + secure + domains[d];
          }
        }
      }
    } catch (e) {}
  }

  function tellServiceWorkerJoin(code) {
    try {
      if (!navigator.serviceWorker) return;
      code = String(code || "").trim().toLowerCase();
      if (code === "evergreen") code = "";
      if (!code) {
        var live = readStoredJoinRaw();
        if (isStickyJoin(live) && !joinWasApplied(live)) code = live;
      }
      /* Never wipe a recalled unique just because this visit is the hub root. */
      if (!code && onGenericEvergreenDoor()) return;
      function send() {
        try {
          if (!navigator.serviceWorker.controller) return;
          navigator.serviceWorker.controller.postMessage({
            type: code ? "FS_STORE_JOIN" : "FS_CLEAR_JOIN",
            code: code || "",
            hub: code ? joinHubParam(code) : ""
          });
        } catch (eSend) {}
      }
      if (navigator.serviceWorker.controller) send();
      else {
        if (navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(send);
        try {
          navigator.serviceWorker.addEventListener("controllerchange", send, { once: true });
        } catch (eOnce) {}
      }
    } catch (e) {}
  }

  function recallJoinFromWorker() {
    return new Promise(function (resolve) {
      try {
        if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
          resolve("");
          return;
        }
        var ch = new MessageChannel();
        var done = false;
        function finish(code) {
          if (done) return;
          done = true;
          resolve(String(code || "").trim().toLowerCase());
        }
        ch.port1.onmessage = function (ev) {
          finish(ev && ev.data && ev.data.code);
        };
        setTimeout(function () { finish(""); }, 500);
        navigator.serviceWorker.controller.postMessage({ type: "FS_GET_JOIN" }, [ch.port2]);
      } catch (e) {
        resolve("");
      }
    });
  }

  /* Directory of the hub. `/first-seeds` (no slash, no file) used to be
     treated as a filename and stripped to `/`, so Copy my link to join
     became go-evergreen.github.io/index.html?join=… — a dead share. */
  function joinBasePath() {
    var path = "";
    var host = "";
    try { path = String(window.location.pathname || "/"); } catch (e) { path = "/"; }
    try { host = String(window.location.hostname || ""); } catch (e2) {}
    if (path === "/hub" || path.indexOf("/hub/") === 0) return "/hub/";
    if (onGroveHost(host)) {
      var groveLast = path.split("/").pop() || "";
      if (/\.[a-z0-9]+$/i.test(groveLast)) path = path.replace(/\/[^/]*$/, "/");
      else if (path && path.charAt(path.length - 1) !== "/") path += "/";
      return path || "/";
    }
    if (host === "go-evergreen.github.io" &&
        (path === "/" || path === "/index.html" || path.indexOf("/first-seeds") === 0)) {
      return "/first-seeds/";
    }
    var last = path.split("/").pop() || "";
    if (/\.[a-z0-9]+$/i.test(last)) path = path.replace(/\/[^/]*$/, "/");
    else if (path && path.charAt(path.length - 1) !== "/") path += "/";
    return path || "/";
  }

  function onGroveHost(host) {
    host = String(host || "").toLowerCase();
    return host === "thefreshgrove.team" || host === "www.thefreshgrove.team" ||
      host === "app.thefreshgrove.team";
  }

  function onEvergreenPublicHost(host) {
    host = String(host || "").toLowerCase();
    if (!host) {
      try { host = String(window.location.hostname || "").toLowerCase(); } catch (e) { return false; }
    }
    return host === "app.evergreenco.team" || host === "go-evergreen.github.io";
  }

  function readStoredJoinRaw() {
    var session = "";
    var local = "";
    try { session = String(sessionStorage.getItem(JOIN_KEY) || "").trim().toLowerCase(); } catch (e) {}
    try { local = String(localStorage.getItem(JOIN_KEY) || "").trim().toLowerCase(); } catch (e2) {}
    var cookie = readJoinCookie();
    /* This-tab session wins over leftover localStorage from an earlier visit. */
    if (isStickyJoin(session)) return session;
    if (isStickyJoin(local)) return local;
    if (isStickyJoin(cookie)) return cookie;
    return "";
  }

  /* Generic Evergreen door: no person/leader unique in this request, and not
     the Grove host. Leftover stored uniques must not be promoted here. */
  function onGenericEvergreenDoor() {
    try {
      if (onGroveHost(String(window.location.hostname || ""))) return false;
    } catch (e) {}
    try {
      var hub = String(new URLSearchParams(window.location.search).get("hub") || "").trim().toLowerCase();
      if (hub === "grove" || hub === "fresh-grove") return false;
    } catch (e2) {}
    var fromUrl = joinFromLocation();
    if (pendingIsPersonInvite(fromUrl) || pendingIsEvergreenLeader(fromUrl)) return false;
    return true;
  }

  function clearServiceWorkerJoin() {
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "FS_CLEAR_JOIN", code: "", hub: "" });
      }
    } catch (e) {}
  }

  /* Generic Evergreen door: ignore leftover person uniques for THIS visit,
     but never delete them. Wiping here is how people lost a real invite
     and landed under Lily after a later bare-hub open. */
  function dropStalePersonJoinOnEvergreenDoor() {
    try {
      if (String(localStorage.getItem(JOIN_KEY) || "").trim().toLowerCase() === "evergreen") {
        localStorage.removeItem(JOIN_KEY);
      }
    } catch (e3) {}
    try {
      if (String(sessionStorage.getItem(JOIN_KEY) || "").trim().toLowerCase() === "evergreen") {
        sessionStorage.removeItem(JOIN_KEY);
      }
    } catch (e4) {}
    if (readJoinCookie() === "evergreen") writeJoinCookie("");
  }

  /* Signup / attach: URL unique always wins. A stored person unique stays
     on the account even if this visit is the bare hub — that is how
     iMessage / a later Home Screen open used to seat people under Lily. */
  function pendingJoinForSignup() {
    return pickStickyJoin(joinFromLocation(), readStoredJoinRaw());
  }

  function persistJoinQuiet(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code || code === "evergreen") return;
    try { localStorage.setItem(JOIN_KEY, code); } catch (e) {}
    try { sessionStorage.setItem(JOIN_KEY, code); } catch (e2) {}
    rememberJoinHub(code);
    writeJoinCookie(code);
    pinJoinToManifest(code);
    tellServiceWorkerJoin(code);
  }

  function evergreenPublicHubBase() {
    try {
      var raw = String((window.FS.CONFIG && window.FS.CONFIG.evergreenSiteUrl) ||
        "https://app.evergreenco.team/").trim();
      if (raw && raw.charAt(raw.length - 1) !== "/") raw += "/";
      return raw || "https://app.evergreenco.team/";
    } catch (e) {
      return "https://app.evergreenco.team/";
    }
  }

  function evergreenJoinShareUrl(code) {
    code = String(code || "").trim().toLowerCase();
    var base = evergreenPublicHubBase();
    if (!code) return base;
    /* join.html is a real 200. /j/CODE is a GitHub 404 — iMessage and
       in-app browsers drop it and people land under Lily. Old /j/ links
       still persist via 404.html. */
    if (code === "evergreen") {
      return base + "index.html?join=evergreen#join=evergreen";
    }
    return base + "index.html?join=" + encodeURIComponent(code) +
      "&hub=evergreen#join=" + encodeURIComponent(code);
  }

  function grovePersonJoinShareUrl(code) {
    code = String(code || "").trim().toLowerCase();
    var base = grovePublicJoinBase();
    if (!code) return base;
    /* Pretty thefreshgrove.team/join.html door — Grove card for iMessage,
       then one hop onto app.thefreshgrove.team with query + hash. */
    var glue = base.indexOf("?") >= 0 ? "&" : "?";
    return base + glue + "join=" + encodeURIComponent(code) +
      "&hub=grove#join=" + encodeURIComponent(code);
  }

  function grovePublicJoinBase() {
    var cfg = window.FS.CONFIG || {};
    return String(cfg.groveJoinUrl || "https://thefreshgrove.team/join.html").trim();
  }

  function grovePublicHubBase() {
    try {
      var u = new URL(grovePublicJoinBase());
      return u.origin + "/";
    } catch (e) {
      return "https://thefreshgrove.team/";
    }
  }

  function grovePublicLeadBase() {
    var cfg = window.FS.CONFIG || {};
    return String(cfg.groveLeadUrl || "https://thefreshgrove.team/lead.html").trim();
  }

  function liveHubParam() {
    try {
      return String(new URLSearchParams(window.location.search).get("hub") || "").trim().toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function storedShareHub() {
    try {
      var h = String(localStorage.getItem(JOIN_HUB_KEY) || "").trim().toLowerCase();
      if (h === "grove" || h === "evergreen") return h;
    } catch (e) {}
    try {
      var h2 = String(sessionStorage.getItem(JOIN_HUB_KEY) || "").trim().toLowerCase();
      if (h2 === "grove" || h2 === "evergreen") return h2;
    } catch (e2) {}
    return "";
  }

  /* After the pretty hop, hostname is github.io. A live hub=grove (or a
     stored Grove door) still means this visit is Grove. */
  function groveShareDoor() {
    try {
      if (onGroveHost(String(window.location.hostname || ""))) return true;
    } catch (e) {}
    var hub = liveHubParam();
    if (hub === "grove" || hub === "fresh-grove") return true;
    if (hub === "evergreen" || hub === "evergreen-co") return false;
    return storedShareHub() === "grove";
  }

  /* Grove share URLs only for a real Fresh Grove account.
     Preview / last-opened pack / leftover join=evergreen in the URL
     must not change what a Grove person copies. After the hop they
     sit on github.io — that host must not steal the pretty door. */
  function groveCopiesPrettyLinks() {
    try {
      if (sessionIsEvergreen()) return false;
    } catch (e1) {}
    try {
      if (sessionIsGrove()) return true;
    } catch (e2) {}
    try {
      if (sessionUser && sessionUser.org_slug === "fresh-grove") return true;
    } catch (e3) {}
    try {
      var ids = window.FS.PACK_IDS || {};
      if (sessionUser && sameId(sessionUser.org_id, ids["fresh-grove"])) return true;
    } catch (e4) {}
    var hub = liveHubParam();
    if (hub === "evergreen" || hub === "evergreen-co") return false;
    var remembered = rememberedShareHost();
    if (remembered === "evergreen") return false;
    if (groveShareDoor()) return true;
    if (remembered === "grove") return true;
    try {
      if (pendingIsEvergreenJoin(joinFromLocation())) return false;
    } catch (e0) {}
    return false;
  }

  function joinCodeFromShareUrl(url) {
    try {
      var u = new URL(String(url || ""), "https://thefreshgrove.team/");
      var query = String(u.searchParams.get("join") || "").trim().toLowerCase();
      var hash = "";
      var hm = String(u.hash || "").match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
      if (hm) hash = decodeURIComponent(hm[1] || "").trim().toLowerCase();
      return pickJoinCode(query, hash, joinFromPathname(u.pathname));
    } catch (e) {
      return "";
    }
  }

  function leadSlugFromShareUrl(url) {
    try {
      var u = new URL(String(url || ""), "https://thefreshgrove.team/");
      var slug = String(u.searchParams.get("p") || u.searchParams.get("with") || "").trim().toLowerCase();
      if (slug) return slug;
      var hm = String(u.hash || "").match(/(?:^|[?#&])(?:p|with)=([^&]+)/i);
      if (hm) return decodeURIComponent(hm[1] || "").trim().toLowerCase();
    } catch (e) {}
    return "";
  }

  var PRETTY_CUSTOM_LEAD_PATHS = {
    "ringana-with-brittany": true,
    "ringana-with-the-smallwoods": true,
    "ringana-with-meghan": true,
    "ringana-with-tania": true,
    "ringana-with-kim": true,
    "ringana-with-kelly": true,
    "ringana-with-kassidy": true
  };

  function prettyCustomLeadShareUrl(url) {
    var raw = String(url || "").trim();
    if (/tayrourke\.github\.io\/tay-goes-fresh/i.test(raw) || /^https:\/\/taygoesfresh\.com\/?$/i.test(raw)) {
      return "https://taygoesfresh.com/";
    }
    if (/ringana-with-kimberly/i.test(raw)) {
      return "https://evergreenco.team/ringana-with-kimberly/";
    }
    var m = raw.match(/\/(ringana-with-[a-z0-9-]+)\/?/i);
    if (m) {
      var path = m[1].toLowerCase();
      if (path === "ringana-with-the-smallwoods") path = "ringana-with-meghan";
      if (PRETTY_CUSTOM_LEAD_PATHS[path]) {
        return "https://thefreshgrove.team/" + path + "/";
      }
    }
    return raw;
  }

  function isCustomLeadPageUrl(url) {
    url = String(url || "").trim();
    if (!url) return false;
    if (/thefreshgrove\.team\/ringana-with-/i.test(url)) return true;
    if (/evergreenco\.team\/ringana-with-/i.test(url)) return true;
    if (/go-evergreen\.github\.io\/ringana-with-/i.test(url)) return true;
    if (/tayrourke\.github\.io/i.test(url)) return true;
    if (/^https:\/\/taygoesfresh\.com\/?$/i.test(url)) return true;
    var map = (window.FS.CONFIG && window.FS.CONFIG.customLeadPages) || {};
    var want = url.replace(/\/$/, "").toLowerCase();
    var k;
    for (k in map) {
      if (!Object.prototype.hasOwnProperty.call(map, k)) continue;
      if (String(map[k] || "").replace(/\/$/, "").toLowerCase() === want) return true;
    }
    return false;
  }

  function isGithubIoHubUrl(url) {
    return /^https:\/\/go-evergreen\.github\.io\/first-seeds(?:\/|$)/i.test(String(url || "").trim());
  }

  function isEvergreenAppUrl(url) {
    return /^https:\/\/app\.evergreenco\.team(?:\/|$)/i.test(String(url || "").trim());
  }

  function isGroveAppUrl(url) {
    return /^https:\/\/app\.thefreshgrove\.team(?:\/|$)/i.test(String(url || "").trim());
  }

  /* Lock the host to the account. After the pretty hop, window.location
     is github.io — never let that leak into a Grove copy. */
  function hardenShareUrl(url) {
    url = String(url || "").trim();
    if (!url) return "";
    if (isCustomLeadPageUrl(url)) return prettyCustomLeadShareUrl(url) || url;
    if (/^https:\/\/(quiz\.thefreshgrove\.team|shelf\.thefreshgrove\.team|shelf\.taygoesfresh\.com)\b/i.test(url)) {
      return url;
    }
    if (/^https:\/\/thefreshgrove\.team\/thefreshcatalog\/?$/i.test(url)) return url;
    try {
      if (sessionIsEvergreen()) {
        var evCode = joinCodeFromShareUrl(url);
        if (evCode && evCode !== "evergreen") return evergreenJoinShareUrl(evCode);
        if (isGroveAppUrl(url) || isGithubIoHubUrl(url) || /thefreshgrove\.team/i.test(url)) {
          return evergreenPublicHubBase();
        }
        return url;
      }
    } catch (eEv) {}
    if (!(groveCopiesPrettyLinks() || sessionIsGrove() || groveShareDoor())) return url;
    if (/thefreshcatalog|fresh-catalog\.pdf/i.test(url)) {
      return String((window.FS.CONFIG && window.FS.CONFIG.groveCatalogUrl) ||
        "https://thefreshgrove.team/thefreshcatalog").trim();
    }
    var slug = leadSlugFromShareUrl(url);
    if (slug && /(?:lead\.html|[?&#](?:p|with)=)/i.test(url) && !/[?&#]join=/i.test(url)) {
      var leadBase = grovePublicLeadBase();
      var leadGlue = leadBase.indexOf("?") >= 0 ? "&" : "?";
      return leadBase + leadGlue + "p=" + encodeURIComponent(slug) + "#p=" + encodeURIComponent(slug);
    }
    if (slug && /thefreshgrove\.team/i.test(url) && /[?&#]with=/i.test(url)) {
      var site = grovePublicHubBase();
      return site + "?with=" + encodeURIComponent(slug) + "#with=" + encodeURIComponent(slug);
    }
    var code = joinCodeFromShareUrl(url);
    if (code && code !== "evergreen") return grovePersonJoinShareUrl(code);
    if (isGithubIoHubUrl(url) || isEvergreenAppUrl(url) || isGroveAppUrl(url)) {
      return grovePublicJoinBase();
    }
    return url;
  }

  function ejectEvergreenFromGroveHost() {
    /* The two sites stay put. A Grove URL never sends someone to Evergreen,
       and an Evergreen URL never sends someone to Grove. */
    return false;
  }

  function joinHubParam(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code || pendingIsEvergreenJoin(code)) return "";
    try {
      if (sessionIsEvergreen()) return "evergreen";
    } catch (e0) {}
    var groveHost = false;
    try { groveHost = onGroveHost(String(window.location.hostname || "")); } catch (eG) {}
    try {
      var h = String(new URLSearchParams(window.location.search).get("hub") || "").trim().toLowerCase();
      if (h === "grove" || h === "fresh-grove") return "grove";
      /* Live hub=evergreen on github.io is an Evergreen copy. On the Grove
         host, leftover hub=evergreen must not steal a Grove unique. */
      if (h === "evergreen" || h === "evergreen-co") {
        if (groveHost && pendingIsPersonInvite(code)) return "grove";
        return "evergreen";
      }
    } catch (e2) {}
    if (groveHost) return "grove";
    try {
      if (sessionIsGrove()) return "grove";
    } catch (e4) {}
    /* A live unique in this URL already picked the door. Leftover stored
       hub from a previous invite must not rewrite this one. */
    var live = "";
    try { live = joinFromLocation(); } catch (eLive) {}
    if (pendingIsPersonInvite(live) && live === code) {
      try {
        if (onEvergreenPublicHost()) return "evergreen";
      } catch (eEv) {}
      return "";
    }
    try {
      var storedHub = String(localStorage.getItem(JOIN_HUB_KEY) || "").trim().toLowerCase();
      if (!storedHub) storedHub = String(sessionStorage.getItem(JOIN_HUB_KEY) || "").trim().toLowerCase();
      if (storedHub === "evergreen" || storedHub === "grove") return storedHub;
    } catch (e5) {}
    return "";
  }

  function joinStartUrl(code) {
    code = String(code || "").trim().toLowerCase();
    var path = joinBasePath();
    if (!code) return path + "index.html";
    var url = path + "index.html?join=" + encodeURIComponent(code);
    var hub = joinHubParam(code);
    if (hub) url += "&hub=" + encodeURIComponent(hub);
    return url + "#join=" + encodeURIComponent(code);
  }

  function pinJoinToManifest(code) {
    code = String(code || "").trim().toLowerCase();
    try {
      var link = document.getElementById("fsManifest") ||
        document.querySelector('link[rel="manifest"]');
      if (!link) return;
      if (!code) {
        link.setAttribute("href", "manifest.webmanifest");
        return;
      }
      /* Same-origin URL only. A blob: manifest is ignored on iOS, and Home
         Screen then launches the static start_url with no invite. */
      var href = "manifest.webmanifest?join=" + encodeURIComponent(code);
      var hub = joinHubParam(code);
      if (hub) href += "&hub=" + encodeURIComponent(hub);
      try {
        var keepSignin = /[?&]signin=1(?:&|$)/.test(String(link.getAttribute("href") || ""));
        if (!keepSignin) {
          keepSignin = String(new URLSearchParams(window.location.search).get("signin") || "") === "1";
        }
        if (keepSignin) href += "&signin=1";
      } catch (eSign) {}
      link.setAttribute("href", href);
    } catch (e) {}
  }

  function ensureJoinInUrl(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code) return;
    try {
      var path = String(window.location.pathname || "");
      if (/lead\.html$/i.test(path)) return;
      var params = new URLSearchParams(window.location.search);
      var queryHas = String(params.get("join") || "").trim().toLowerCase() === code;
      var hash = String(window.location.hash || "");
      var hashCode = "";
      try {
        var hm = hash.match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
        if (hm) hashCode = decodeURIComponent(hm[1] || "").trim().toLowerCase();
      } catch (eHash) {}
      if (queryHas && hashCode === code) {
        var wantHub = joinHubParam(code);
        var haveHub = String(params.get("hub") || "").trim().toLowerCase();
        var hubOk = wantHub === "evergreen"
          ? (haveHub === "evergreen" || haveHub === "evergreen-co")
          : wantHub === "grove"
            ? (haveHub === "grove" || haveHub === "fresh-grove")
            : (haveHub !== "evergreen" && haveHub !== "evergreen-co");
        if (hubOk) return;
      }
      params.set("join", code);
      var hub = joinHubParam(code);
      if (hub) params.set("hub", hub);
      else params.delete("hub");
      if (hashCode !== code) {
        hash = "#join=" + encodeURIComponent(code);
      }
      var qs = params.toString();
      window.history.replaceState({}, "", path + (qs ? "?" + qs : "") + hash);
    } catch (e) {}
  }

  function rememberAppliedJoin(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code || pendingIsEvergreenJoin(code)) return;
    try { localStorage.setItem(APPLIED_JOIN_KEY, code); } catch (e) {}
  }

  function readAppliedJoin() {
    try { return String(localStorage.getItem(APPLIED_JOIN_KEY) || "").trim().toLowerCase(); }
    catch (e) { return ""; }
  }

  function readSkippedJoins() {
    try {
      var raw = String(localStorage.getItem(SKIPPED_JOIN_KEY) || "").trim();
      if (!raw) return [];
      if (raw.charAt(0) === "[") {
        var arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        return arr.map(function (c) { return String(c || "").trim().toLowerCase(); }).filter(Boolean);
      }
      return [raw.toLowerCase()];
    } catch (e) {
      return [];
    }
  }

  function rememberSkippedJoin(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code || pendingIsEvergreenJoin(code)) return;
    var list = readSkippedJoins();
    if (list.indexOf(code) >= 0) return;
    list.push(code);
    if (list.length > 12) list = list.slice(-12);
    try { localStorage.setItem(SKIPPED_JOIN_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function joinWasSkipped(code) {
    code = String(code || "").trim().toLowerCase();
    return !!code && readSkippedJoins().indexOf(code) >= 0;
  }

  function pendingIsCurrentOrgJoin(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code || !sessionUser) return false;
    if (pendingIsEvergreenJoin(code) && sessionIsEvergreen() && !pendingIsEvergreenLeader(code)) return true;
    var i;
    for (i = 0; i < orgsCache.length; i++) {
      var o = orgsCache[i];
      if (!o) continue;
      var jc = String(o.join_code || "").trim().toLowerCase();
      if (jc && jc === code && sessionUser.org_id && o.id === sessionUser.org_id) return true;
    }
    return false;
  }

  function pendingIsOwnInvite(code) {
    code = String(code || "").trim().toLowerCase();
    return !!code && String((sessionUser && sessionUser.invite_code) || "").trim().toLowerCase() === code;
  }

  /* Leftover same-leader / home-screen start URL: silent.
     Only treat as "someone else" when this device already remembered a
     different person invite as the one that linked them. */
  function pendingIsOtherPersonJoin(code) {
    code = String(code || "").trim().toLowerCase();
    if (!pendingIsPersonInvite(code) || pendingIsOwnInvite(code) || pendingIsCurrentOrgJoin(code)) return false;
    var applied = readAppliedJoin();
    if (applied && applied === code) return false;
    if (applied && applied !== code) return true;
    /* Fully seated on this account — a new unique is someone else, even
       if this device never wrote firstSeeds_applied_join. First attach
       (no invited_by yet) still goes through. */
    if (sessionUser && sessionUser.invited_by_id && sessionUser.sponsor_id) return true;
    return false;
  }

  async function noteOtherJoinSkipped() {
    var pending = pendingJoinForSignup();
    var already = joinWasSkipped(pending);
    rememberSkippedJoin(pending);
    if (already) return;
    var name = "";
    try {
      if (Cloud.mySupportContext) {
        var ctx = await Cloud.mySupportContext();
        if (ctx && ctx.sponsor_name) {
          name = Cloud.personFirstName({ display_name: ctx.sponsor_name });
        }
      }
    } catch (e) {}
    try {
      sessionStorage.setItem("fs_join_skipped", "other");
      if (name && name !== "friend") sessionStorage.setItem("fs_join_skipped_name", name);
      else sessionStorage.removeItem("fs_join_skipped_name");
    } catch (e2) {}
  }

  function joinWasApplied(code) {
    code = String(code || "").trim().toLowerCase();
    if (!isStickyJoin(code)) return true;
    if (pendingIsOwnInvite(code)) return true;
    if (readAppliedJoin() === code) return true;
    if (joinWasSkipped(code)) return true;
    if (pendingIsEvergreenLeader(code) && sessionUser && sessionUser.is_org_admin && !sessionIsGrove()) {
      return true;
    }
    return false;
  }

  function personInviteStillOpen() {
    var pending = pendingJoinForSignup();
    if (!pendingIsPersonInvite(pending) || pendingIsOwnInvite(pending)) return false;
    if (joinWasApplied(pending)) return false;
    return true;
  }

  function leaderClaimStillOpen() {
    var pending = pendingJoinForSignup() || joinFromLocation();
    if (!pendingIsEvergreenLeader(pending)) return false;
    if (sessionUser && sessionIsGrove()) return false;
    if (sessionUser && sessionUser.is_org_admin) return false;
    return true;
  }

  function joinShouldStayInUrl() {
    return personInviteStillOpen() || leaderClaimStillOpen();
  }

  function rememberJoinHub(code) {
    var hub = "";
    try {
      if (pendingIsEvergreenJoin(code) || joinHubParam(code) === "evergreen") {
        hub = "evergreen";
      } else if (joinHubParam(code) === "grove" ||
          onGroveHost(String(window.location.hostname || ""))) {
        hub = "grove";
      }
    } catch (e) {}
    try {
      if (hub) {
        localStorage.setItem(JOIN_HUB_KEY, hub);
        sessionStorage.setItem(JOIN_HUB_KEY, hub);
      }
    } catch (e2) {}
  }

  function setPendingJoin(code) {
    code = String(code || "").trim().toLowerCase();
    if (!code || code === "evergreen") return;
    try { localStorage.setItem(JOIN_KEY, code); } catch (e) {}
    try { sessionStorage.setItem(JOIN_KEY, code); } catch (e) {}
    rememberJoinHub(code);
    writeJoinCookie(code);
    pinJoinToManifest(code);
    ensureJoinInUrl(code);
    tellServiceWorkerJoin(code);
  }

  function clearPendingJoinStorage(force) {
    var live = pickStickyJoin(joinFromLocation(), readStoredJoinRaw());
    if (isStickyJoin(live) && !joinWasApplied(live)) {
      setPendingJoin(live);
      return;
    }
    if (!force && joinShouldStayInUrl()) {
      ensureJoinInUrl(pendingJoinForSignup() || joinFromLocation());
      return;
    }
    try { localStorage.removeItem(JOIN_KEY); } catch (e) {}
    try { sessionStorage.removeItem(JOIN_KEY); } catch (e) {}
    try { localStorage.removeItem(JOIN_HUB_KEY); } catch (eHub) {}
    try { sessionStorage.removeItem(JOIN_HUB_KEY); } catch (eHub2) {}
    writeJoinCookie("");
    pinJoinToManifest("");
    tellServiceWorkerJoin("");
  }

  /* One rule: URL unique/leader wins, else the stored unique/leader.
     The generic door must not hide a person code. */
  function readPendingJoin() {
    var code = pendingJoinForSignup();
    if (code) persistJoinQuiet(code);
    return code;
  }

  /* Same local calendar day? Used so "active today" isn't a rolling 24h window. */
  function sameLocalCalendarDay(aIso, bDate) {
    if (!aIso) return false;
    var a = new Date(aIso);
    if (isNaN(a.getTime())) return false;
    var b = bDate || new Date();
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  /* Mark presence at most once per local calendar day (open / sync), not on every auth refresh. */
  async function touchLastActive(force) {
    if (!sessionUser) return false;
    var now = new Date();
    if (!force && sameLocalCalendarDay(sessionUser.last_active_at, now)) return false;
    var iso = now.toISOString();
    if (configured() && client) {
      try {
        await client.from("profiles").update({ last_active_at: iso }).eq("id", sessionUser.id);
      } catch (e) {
        return false;
      }
    } else {
      var store = localStore();
      var u = store.users[sessionUser.id];
      if (!u) return false;
      u.last_active_at = iso;
      store.users[sessionUser.id] = u;
      localSave(store);
    }
    sessionUser.last_active_at = iso;
    return true;
  }

  /* ── local bridge store (demo / offline) ─────────────── */
  function localStore() {
    try {
      var raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (!parsed.slugAliases) parsed.slugAliases = {};
        return parsed;
      }
    } catch (e) {}
    return { users: {}, currentId: null, slugAliases: {} };
  }

  function localSave(store) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(store)); } catch (e) {}
  }

  async function fetchPaged(makeQuery, pageSize) {
    pageSize = pageSize || 200;
    var all = [];
    var from = 0;
    while (from < 4000) {
      var res = await makeQuery(from, from + pageSize - 1);
      if (res && res.error) throw res.error;
      var rows = (res && res.data) || [];
      all = all.concat(rows);
      if (rows.length < pageSize) break;
      from += pageSize;
    }
    return all;
  }

  function noteOccursOn(raw) {
    return String(raw || "").trim().slice(0, 10);
  }

  function orgEventOccursOn(raw) {
    var s = String(raw || "").trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
  }

  function orgEventLocalYmd(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function cleanReplayByDate(src) {
    var href = window.FS.normalizeMeetingHref || window.FS.safeHref;
    var out = {};
    if (!src || typeof src !== "object" || Array.isArray(src)) return out;
    Object.keys(src).forEach(function (k) {
      if (!orgEventOccursOn(k)) return;
      var url = (href && href(src[k] || "", 2000)) || "";
      if (url) out[k] = url;
    });
    return out;
  }

  function normalizeLeadEventNote(row) {
    if (!row) return row;
    var next = Object.assign({}, row);
    next.occurs_on = noteOccursOn(next.occurs_on);
    return next;
  }

  function isMissingLeadEventNotes(error) {
    var msg = String((error && error.message) || "").toLowerCase();
    var code = String((error && (error.code || error.details)) || "");
    return msg.indexOf("lead_event_notes") >= 0 ||
      msg.indexOf("schema cache") >= 0 ||
      code === "PGRST205" ||
      code === "42P01";
  }

  function makeCode(len) {
    len = len || 12;
    var alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    var out = "";
    try {
      if (window.crypto && window.crypto.getRandomValues) {
        var buf = new Uint8Array(len);
        window.crypto.getRandomValues(buf);
        var i;
        for (i = 0; i < len; i++) out += alphabet.charAt(buf[i] % 36);
        return out;
      }
    } catch (e) {}
    while (out.length < len) out += Math.random().toString(36).slice(2);
    return out.slice(0, len);
  }

  var UNLOCK_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  var GROVE_ORG = "a0000000-0000-4000-8000-000000000002";
  var EVERGREEN_ORG = "a0000000-0000-4000-8000-000000000001";

  function groveOrgId() {
    return (window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"]) || GROVE_ORG;
  }
  function evergreenOrgId() {
    return (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || EVERGREEN_ORG;
  }

  /* Regular partners always read their home team. Host / last-pack must not
     hide Fresh Grove dates for someone whose landing page lives on Evergreen.
     No org_id means no team calendar — never park them on Fresh Grove. */
  function eventsScopeOrgId() {
    if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
      return Cloud.activeOrgId && Cloud.activeOrgId();
    }
    if (sessionUser && sessionUser.org_id) return sessionUser.org_id;
    if (sessionUser && sessionUser.org_slug === "evergreen-co") return evergreenOrgId();
    if (sessionUser && sessionUser.org_slug === "fresh-grove") return groveOrgId();
    return null;
  }

  function normalizeUnlockCode(raw) {
    return String(raw || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  }

  function formatUnlockCode(raw) {
    var n = normalizeUnlockCode(raw);
    if (n.length < 8) return n;
    return n.slice(0, 4) + "-" + n.slice(4, 8);
  }

  function makeUnlockToken() {
    var out = "";
    var i;
    for (i = 0; i < 8; i++) {
      out += UNLOCK_ALPHABET.charAt(Math.floor(Math.random() * UNLOCK_ALPHABET.length));
    }
    return formatUnlockCode(out);
  }

  function canMintUnlockNow() {
    if (!sessionUser) return false;
    if (Cloud.packIsEvergreen()) return false;
    if (sessionUser.is_super_admin) return true;
    if (!(sessionUser.is_org_admin || sessionUser.is_hub_admin)) return false;
    return sessionIsGrove() || sessionUser.org_slug === "fresh-grove";
  }

  function blankProgress() {
    return {
      active: "welcome",
      data: {},
      done: {},
      calendar: {},
      cheers: [],
      updated_at: new Date().toISOString()
    };
  }

  function localUserFromId(id) {
    var s = localStore();
    return s.users[id] || null;
  }

  var prefCols = {
    calendar_day: true,
    cabinet_joins: true,
    customer_mail: true,
    team_zoom_new: true,
    team_zoom_replay: true
  };

  function markMissingPrefCols(err) {
    var msg = errText(err);
    var names = ["calendar_day", "cabinet_joins", "customer_mail", "team_zoom_new", "team_zoom_replay"];
    var changed = false;
    var i;
    for (i = 0; i < names.length; i++) {
      if (prefCols[names[i]] && new RegExp(names[i], "i").test(msg)) {
        prefCols[names[i]] = false;
        changed = true;
      }
    }
    return changed;
  }

  function optionalPrefColList() {
    var extra = [];
    var names = ["team_zoom_new", "team_zoom_replay", "calendar_day", "cabinet_joins", "customer_mail"];
    var i;
    for (i = 0; i < names.length; i++) {
      if (prefCols[names[i]]) extra.push(names[i]);
    }
    return extra;
  }

  function notificationPrefSelect() {
    var core = "grove_joins, cheers, how_i_grow, leads, notes, team_broadcasts, team_zooms";
    var extra = optionalPrefColList();
    return extra.length ? core + ", " + extra.join(", ") : core;
  }

  /* ── public API ──────────────────────────────────────── */
  var Cloud = {
    mode: function () { return configured() && client ? "supabase" : "local"; },
    onChange: onChange,
    user: function () { return sessionUser; },
    isSignedIn: function () { return !!sessionUser; },
    touchActive: function () { return touchLastActive(false); },

    captureJoinFromUrl: function () {
      try {
        dropStalePersonJoinOnEvergreenDoor();
        var code = pickStickyJoin(joinFromLocation(), readStoredJoinRaw());
        if (!code) return;
        /* Bare hub: keep the unique in storage / cookie / Home Screen.
           Do not put it in the address bar — that would look like a fresh
           invite on a shared phone. Signup still reads the stored unique. */
        if (onGenericEvergreenDoor()) persistJoinQuiet(code);
        else setPendingJoin(code);
      } catch (e) {}
    },

    stripJoinFromUrl: function () {
      if (joinShouldStayInUrl()) {
        ensureJoinInUrl(pendingJoinForSignup() || joinFromLocation());
        return;
      }
      try {
        var params = new URLSearchParams(window.location.search);
        var dirty = false;
        if (params.has("join")) {
          params.delete("join");
          dirty = true;
        }
        var hash = String(window.location.hash || "");
        if (/(?:^|[?#&])(?:fs)?join=/i.test(hash)) {
          hash = hash
            .replace(/([?#&])(?:fs)?join=[^&]*/ig, "$1")
            .replace(/[?#&]+$/, "")
            .replace(/^[#?]&/, "#");
          if (hash === "#" || hash === "?") hash = "";
          dirty = true;
        }
        if (!dirty) return;
        var clean = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + hash;
        window.history.replaceState({}, "", clean);
      } catch (e) {}
    },

    pendingJoinCode: function () {
      return pendingJoinForSignup();
    },

    clearPendingJoin: function () {
      clearPendingJoinStorage();
      Cloud.stripJoinFromUrl();
    },

    /* Attach pending invite when signed in; inherit that person's branch.
       Generic org codes (e.g. evergreen) set org only. Keep a Grove unique
       link pending until sponsor lands — never demote it to Evergreen. */
    tryAttachPendingSponsor: async function () {
      if (!sessionUser) return false;
      var pending = pendingJoinForSignup();
      var claimedLeader = false;

      function finishJoin() {
        if (isStickyJoin(pending) && !joinWasApplied(pending)) {
          setPendingJoin(pending);
          return;
        }
        if (leaderClaimStillOpen() || personInviteStillOpen()) {
          setPendingJoin(pending);
          return;
        }
        clearPendingJoinStorage(true);
        Cloud.stripJoinFromUrl();
      }

      async function tryAttachPerson() {
        if (!pending || !pendingIsPersonInvite(pending) || pendingIsOwnInvite(pending)) return false;
        if (pendingIsOtherPersonJoin(pending)) return false;
        if (!configured() || !client) return false;
        var beforeInvited = sessionUser && sessionUser.invited_by_id;
        var beforeSponsor = sessionUser && sessionUser.sponsor_id;
        var attempt = 0;
        while (attempt < 3) {
          attempt += 1;
          try {
            var attached = await client.rpc("attach_sponsor", { code: pending });
            if (attached && attached.error) {
              var aMsg = String((attached.error && attached.error.message) || "");
              if (/too many tries/i.test(aMsg)) return false;
              console.warn("[First Seeds] attach_sponsor:", attached.error);
            }
          } catch (ePerson) {
            var pMsg = String((ePerson && ePerson.message) || "");
            if (/too many tries/i.test(pMsg)) return false;
            console.warn("[First Seeds] attach_sponsor:", ePerson);
          }
          await Cloud._refreshProfileOrg();
          /* Only burn the unique if this attach actually seated them.
             Already-under-Lily + a real unique used to look like success
             (invited_by was set) and the unique was cleared. */
          if (sessionUser && sessionUser.invited_by_id &&
              sessionUser.invited_by_id !== beforeInvited) {
            rememberAppliedJoin(pending);
            return true;
          }
          if (sessionUser && sessionIsGrove() && sessionUser.sponsor_id &&
              sessionUser.sponsor_id !== beforeSponsor) {
            rememberAppliedJoin(pending);
            return true;
          }
          if (attempt < 3) {
            await new Promise(function (resolve) { setTimeout(resolve, 200 * attempt); });
            if (!sessionUser) return false;
          }
        }
        return false;
      }

      async function tryClaimLeader() {
        if (!pending || !pendingIsEvergreenLeader(pending) || !configured() || !client) return false;
        var attempt = 0;
        while (attempt < 3) {
          attempt += 1;
          try {
            var claimed = await client.rpc("claim_org_leader", { code: pending });
            if (claimed && claimed.error) {
              var msg = String((claimed.error && claimed.error.message) || "");
              if (/different team/i.test(msg)) {
                noteLeaderClaim("wrong-team");
                return false;
              }
              if (/too many tries/i.test(msg)) return false;
            } else {
              await Cloud._refreshProfileOrg();
              if (sessionUser && sessionUser.is_org_admin) {
                noteLeaderClaim("ok");
                return true;
              }
            }
          } catch (err) {
            var m = String((err && err.message) || "");
            if (/different team/i.test(m)) {
              noteLeaderClaim("wrong-team");
              return false;
            }
            if (/too many tries/i.test(m)) return false;
          }
          if (attempt < 3) {
            await new Promise(function (resolve) { setTimeout(resolve, 200 * attempt); });
            if (!sessionUser) return false;
          }
        }
        return !!(sessionUser && sessionUser.is_org_admin);
      }

      function claimLocalLeader(user) {
        if (!pending || !pendingIsEvergreenLeader(pending)) return false;
        if (user.org_slug === "fresh-grove") {
          noteLeaderClaim("wrong-team");
          return false;
        }
        user.org_id = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || user.org_id;
        user.org_slug = "evergreen-co";
        user.is_org_admin = true;
        noteLeaderClaim("ok");
        return true;
      }

      if (sessionUser.sponsor_id && pending) {
        var skippedOther = false;
        if (pendingIsEvergreenLeader(pending)) {
          claimedLeader = await tryClaimLeader();
        } else if (pendingIsPersonInvite(pending)) {
          if (pendingIsOtherPersonJoin(pending)) {
            skippedOther = true;
            await noteOtherJoinSkipped();
          } else await tryAttachPerson();
        }
        finishJoin();
        if (claimedLeader) {
          await Cloud._refreshProfileOrg();
          emit("auth", sessionUser);
        } else if (leaderClaimNotice === "wrong-team") {
          emit("auth", sessionUser);
        } else if (!skippedOther && sessionUser && sessionUser.invited_by_id) {
          emit("auth", sessionUser);
        }
        if (sessionUser.org_id && !joinShouldStayInUrl()) return true;
      }
      if (configured() && client) {
        try {
          if (sessionIsEvergreen()) {
            if (pendingIsEvergreenLeader(pending)) {
              claimedLeader = await tryClaimLeader();
              await Cloud._refreshProfileOrg();
            }
            if (pendingIsPersonInvite(pending)) {
              await tryAttachPerson();
              finishJoin();
              emit("auth", sessionUser);
              return true;
            }
            finishJoin();
            if (claimedLeader) emit("auth", sessionUser);
            return true;
          }
          if (sessionIsGrove()) {
            if (pendingIsEvergreenJoin(pending)) {
              finishJoin();
              return !!sessionUser.org_id;
            }
            if (pending) {
              await tryAttachPerson();
              finishJoin();
              if (sessionUser.sponsor_id && !personInviteStillOpen()) {
                emit("auth", sessionUser);
                return true;
              }
            }
            return !!sessionUser.org_id;
          }
          if (pending) {
            if (!pendingIsEvergreenJoin(pending)) {
              await tryAttachPerson();
            }
            if (pendingIsEvergreenLeader(pending)) {
              claimedLeader = await tryClaimLeader();
              if (!(sessionUser && sessionUser.is_org_admin)) {
                claimedLeader = await tryClaimLeader();
              }
              await Cloud._refreshProfileOrg();
            }
          }
          await Cloud._refreshProfileOrg();
          if (sessionUser.sponsor_id || (pending && sessionUser.org_id) || claimedLeader) {
            finishJoin();
            emit("auth", sessionUser);
            return true;
          }
          if (!pending && sessionUser.org_id) {
            Cloud.stripJoinFromUrl();
            return true;
          }
        } catch (e) {
          console.warn("[First Seeds] attach:", e);
        }
        return !!(sessionUser.sponsor_id || sessionUser.org_id);
      }
      /* Local bridge mode */
      var store = localStore();
      var user = store.users[sessionUser.id];
      if (!user) return false;
      if (pending) {
        var attached = false;
        Object.keys(store.users).forEach(function (id2) {
          var u2 = store.users[id2];
          if (u2.invite_code === pending && u2.id !== user.id) {
            if (user.org_slug === "fresh-grove" && u2.org_slug === "evergreen-co") return;
            var crossToGrove = user.org_slug === "evergreen-co" && u2.org_slug !== "evergreen-co";
            if (crossToGrove && user.invited_by_id) {
              noteLeaderClaim("wrong-team");
              return;
            }
            if (!user.invited_by_id) {
              user.sponsor_id = u2.id;
              user.invited_by_id = u2.id;
            } else {
              user.sponsor_id = user.sponsor_id || u2.id;
            }
            if (crossToGrove || !user.org_id) {
              user.org_id = u2.org_id || (window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"]);
              user.org_slug = u2.org_slug || "fresh-grove";
            } else {
              user.org_id = user.org_id || u2.org_id || (window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"]);
              user.org_slug = user.org_slug || u2.org_slug || "fresh-grove";
            }
            attached = true;
          }
        });
        if (!attached && (pending === "evergreen" || pendingIsEvergreenLeader(pending))) {
          if (pendingIsEvergreenLeader(pending)) attached = claimLocalLeader(user);
          else {
            user.org_id = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || user.org_id;
            user.org_slug = "evergreen-co";
            attached = true;
          }
        } else if (attached && pendingIsEvergreenLeader(pending)) {
          claimLocalLeader(user);
        } else if (!attached) {
          attached = claimLocalLeader(user);
        }
        if (attached || leaderClaimNotice) {
          store.users[user.id] = user;
          localSave(store);
          sessionUser = Cloud._publicUser(user);
          if (user.sponsor_id) rememberAppliedJoin(pending);
          finishJoin();
          emit("auth", sessionUser);
        }
        return attached || !!leaderClaimNotice;
      }
      return !!(user.org_id || user.sponsor_id);
    },

    _refreshProfileOrg: async function () {
      if (!sessionUser || !configured() || !client) return sessionUser;
      var keepAcked = !!(sessionUser && sessionUser._leaderWelcomeAcked);
      var refreshed = await client.from("profiles").select("*").eq("id", sessionUser.id).maybeSingle();
      if (refreshed.data) {
        sessionUser = Cloud._publicUser(refreshed.data);
        if (keepAcked) {
          sessionUser.leader_welcome_pending = false;
          sessionUser._leaderWelcomeAcked = true;
        }
        await Cloud._hydrateOrg(sessionUser.org_id);
        try { await refreshAdminSecrets(); } catch (eSec) {}
      }
      return sessionUser;
    },

    _hydrateOrg: async function (orgId) {
      if (!configured() || !client) return;
      try {
        if (sessionUser && sessionUser.is_super_admin) {
          var preview = await client.rpc("list_orgs_preview");
          if (!preview.error && preview.data) orgsCache = preview.data;
        } else if (orgId) {
          var one = await client.from("orgs")
            .select("id, slug, name, tier, join_code, features, branding, resources, parent_org_id")
            .eq("id", orgId)
            .maybeSingle();
          if (one.data) {
            var replaced = false;
            orgsCache = orgsCache.map(function (o) {
              if (o.id === one.data.id) { replaced = true; return one.data; }
              return o;
            });
            if (!replaced) orgsCache.push(one.data);
          }
        }
      } catch (e) {}
      var org = orgId ? orgById(orgId) : null;
      if (org && sessionUser) {
        sessionUser.org_slug = org.slug;
        sessionUser.org_tier = org.tier;
        sessionUser.org_name = org.name;
      }
    },

    orgForSlug: function (slug) {
      return orgBySlug(slug);
    },

    eventsScopeReady: function () {
      if (!sessionUser) return false;
      if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) return true;
      return !!eventsScopeOrgId();
    },

    activeOrgId: function () {
      var Pack = window.FS.Pack;
      var slug = Pack && Pack.active ? Pack.active() : "fresh-grove";
      var org = orgBySlug(slug);
      if (org) return org.id;
      if (sessionUser && sessionUser.org_slug === slug && sessionUser.org_id) return sessionUser.org_id;
      var ids = window.FS.PACK_IDS || {};
      return ids[slug] || ids["fresh-grove"] || null;
    },

    joinUrl: function (code) {
      code = String(code || "").trim().toLowerCase();
      if (!code || code === "evergreen") return "";
      /* Account first. Preview / github.io-after-hop must not flip a Grove
         person onto the Evergreen host, or an Evergreen person onto Grove. */
      if (sessionIsEvergreen()) return evergreenJoinShareUrl(code);
      if (pendingIsEvergreenLeader(code) && !sessionIsGrove()) {
        return evergreenJoinShareUrl(code);
      }
      if (groveCopiesPrettyLinks() || sessionIsGrove() || groveShareDoor()) {
        return grovePersonJoinShareUrl(code);
      }
      return evergreenJoinShareUrl(code);
    },

    groveCopiesPrettyLinks: groveCopiesPrettyLinks,
    hardenShareUrl: hardenShareUrl,

    hubRootUrl: function () {
      if (sessionIsEvergreen()) return evergreenPublicHubBase();
      if (groveCopiesPrettyLinks() || sessionIsGrove() || groveShareDoor()) {
        return grovePublicHubBase();
      }
      try {
        if (window.FS.Pack && window.FS.Pack.isEvergreen && window.FS.Pack.isEvergreen()) {
          return evergreenPublicHubBase();
        }
      } catch (ePack) {}
      try { return window.location.origin + joinBasePath(); }
      catch (e) { return evergreenPublicHubBase(); }
    },

    init: async function () {
      Cloud.captureJoinFromUrl();
      try {
        window.addEventListener("pageshow", function () {
          Cloud.captureJoinFromUrl();
          resumePersistedSession().catch(function () {});
        });
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") {
            Cloud.captureJoinFromUrl();
            resumePersistedSession().catch(function () {});
          }
        });
      } catch (eVis) {}
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then(function () {
            var code = pendingJoinForSignup();
            if (code) persistJoinQuiet(code);
          });
        }
      } catch (eSw) {}
      if (configured() && window.supabase) {
        var cfg = window.FS.SUPABASE;
        client = window.supabase.createClient(cfg.url, cfg.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            storage: window.localStorage
          }
        });
        var pendingSession = null;
        var pendingResolve = null;
        function takePending(session) {
          pendingSession = session || null;
          if (pendingResolve) {
            var r = pendingResolve;
            pendingResolve = null;
            r(pendingSession);
          }
        }
        /* Listen first — iOS PWAs often hand the session to INITIAL_SESSION
           after getSession() has already returned empty. */
        client.auth.onAuthStateChange(function (event, session) {
          if (!bootReady && session && session.user) takePending(session);
          /* NEVER await Supabase queries directly inside onAuthStateChange —
             it deadlocks the auth lock and can leave the app stuck signed-out. */
          setTimeout(function () {
            Cloud._handleAuthEvent(event, session).catch(function (err) {
              console.warn("[First Seeds] auth event:", err);
            });
          }, 0);
        });
        try {
          var res = await client.auth.getSession();
          if (res.data && res.data.session && res.data.session.user) {
            await adoptSessionUser(res.data.session.user);
          }
        } catch (err) {
          /* Keep going — session may still restore via auth events */
          console.warn("[First Seeds] session restore:", err);
        }
        if (!sessionUser && likelyStoredSession()) {
          var fromEvent = pendingSession;
          if (!fromEvent) {
            fromEvent = await new Promise(function (resolve) {
              pendingResolve = resolve;
              setTimeout(function () {
                if (pendingResolve === resolve) {
                  pendingResolve = null;
                  resolve(pendingSession);
                }
              }, 1800);
            });
          }
          if (!sessionUser && fromEvent && fromEvent.user) {
            try {
              await adoptSessionUser(fromEvent.user);
            } catch (eHyd) {}
          }
          if (!sessionUser) {
            try {
              await recoverStoredSession();
            } catch (eAgain) {}
          }
        }
      } else {
        var store = localStore();
        if (store.currentId && store.users[store.currentId]) {
          sessionUser = Cloud._publicUser(store.users[store.currentId]);
        }
      }
      try {
        var recalled = await recallJoinFromWorker();
        var have = pickStickyJoin(joinFromLocation(), readStoredJoinRaw());
        if (isStickyJoin(recalled) && !isStickyJoin(have)) {
          if (onGenericEvergreenDoor()) persistJoinQuiet(recalled);
          else setPendingJoin(recalled);
        }
      } catch (eRecall) {}
      if (sessionUser) {
        try {
          await Cloud.tryAttachPendingSponsor();
        } catch (e) {
          console.warn("[First Seeds] attach on boot:", e);
        }
        try { await refreshAdminSecrets(); } catch (eSec) {}
      }
      if (sessionUser) {
        try { localStorage.setItem("fsSigned", "1"); } catch (eFs) {}
        if (sessionUser.email) rememberLastEmail(sessionUser.email);
      }
      var pendingReset = readPasswordReset();
      if (pendingReset && pendingReset.step === "password" && !sessionUser) {
        /* Code matched earlier, but this device no longer has the session —
           they still need to type the code (or send a new one). */
        writePasswordReset({ email: pendingReset.email, step: "code" });
        pendingReset = readPasswordReset();
      }
      passwordResetPending = !!(sessionUser && pendingReset && pendingReset.step === "password");
      if (ejectEvergreenFromGroveHost()) return sessionUser;
      bootReady = true;
      emit("auth", sessionUser);
      return sessionUser;
    },

    bootReady: function () { return bootReady; },
    choseSignOut: choseSignOut,

    _handleAuthEvent: async function (event, session) {
      if (session && session.user) {
        await adoptSessionUser(session.user);
      } else if (event === "SIGNED_OUT") {
        if (recoveringSession) return;
        /* Only Log out should clear them. A failed refresh or empty
           INITIAL_SESSION used to wipe a live phone session. */
        if (!userSignedOut && likelyStoredSession()) {
          var recovered = await recoverStoredSession();
          if (recovered) {
            if (ejectEvergreenFromGroveHost()) return;
            emit("auth", sessionUser);
            return;
          }
        }
        sessionUser = null;
        cachedLeaderCode = "";
        cachedPrivateLinks = {};
      } else {
        return;
      }
      if (ejectEvergreenFromGroveHost()) return;
      emit("auth", sessionUser);
    },

    _publicUser: function (u) {
      if (!u) {
        return {
          id: "",
          email: "",
          display_name: "",
          last_name: "",
          hub_mode: "",
          tour_done: false,
          invite_code: "",
          sponsor_id: null,
          invited_by_id: null,
          is_org_admin: false,
          is_hub_admin: false,
          is_super_admin: false,
          leader_welcome_pending: false,
          last_active_at: null,
          lead_slug: "",
          lead_blurb: "",
          lead_thanks: "",
          instagram: "",
          show_on_grove_door: false,
          photo_at: null,
          photo_ext: "webp",
          org_id: null,
          org_slug: "",
          org_tier: "",
          org_name: ""
        };
      }
      return {
        id: u.id,
        email: u.email,
        display_name: u.display_name,
        last_name: u.last_name || "",
        hub_mode: u.hub_mode || "",
        tour_done: !!u.tour_done,
        invite_code: u.invite_code,
        sponsor_id: u.sponsor_id || null,
        invited_by_id: u.invited_by_id || null,
        is_org_admin: !!u.is_org_admin,
        is_hub_admin: !!u.is_hub_admin,
        is_super_admin: !!u.is_super_admin,
        leader_welcome_pending: !!u.leader_welcome_pending,
        last_active_at: u.last_active_at,
        lead_slug: u.lead_slug || "",
        lead_blurb: u.lead_blurb || "",
        lead_thanks: u.lead_thanks || "",
        instagram: u.instagram || "",
        show_on_grove_door: !!u.show_on_grove_door,
        photo_at: u.photo_at || null,
        photo_ext: u.photo_ext === "jpg" || u.photo_ext === "jpeg" ? "jpg" : "webp",
        org_id: u.org_id || null,
        org_slug: u.org_slug || slugFromOrgId(u.org_id) || "",
        org_tier: u.org_tier || "",
        org_name: u.org_name || ""
      };
    },

    isOrgAdmin: function () {
      return !!(sessionUser && sessionUser.is_org_admin);
    },

    ackLeaderWelcome: async function () {
      if (!sessionUser) return;
      sessionUser.leader_welcome_pending = false;
      sessionUser._leaderWelcomeAcked = true;
      if (configured() && client) {
        try { await client.rpc("ack_leader_welcome"); } catch (e) {}
      } else {
        var store = localStore();
        var u = store.users[sessionUser.id];
        if (u) {
          u.leader_welcome_pending = false;
          store.users[sessionUser.id] = u;
          localSave(store);
        }
      }
    },

    consumeLeaderClaimNotice: function () {
      var note = leaderClaimNotice;
      leaderClaimNotice = "";
      return note;
    },

    evergreenLeaderCode: evergreenLeaderCode,
    refreshAdminSecrets: refreshAdminSecrets,
    leaderPrivateLinks: function () { return cachedPrivateLinks || {}; },
    fetchLeaderPdf: async function () {
      if (leaderPdfBuf && leaderPdfBuf.byteLength) return leaderPdfBuf;
      if (!configured() || !client) return null;
      var cfg = window.FS.SUPABASE || {};
      if (!cfg.url) return null;
      var token = "";
      try {
        var ses = await client.auth.getSession();
        token = (ses.data && ses.data.session && ses.data.session.access_token) || "";
      } catch (eTok) {}
      if (!token) return null;
      var res = await fetch(String(cfg.url).replace(/\/$/, "") + "/functions/v1/leader-pdf", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          apikey: cfg.anonKey || "",
        }
      });
      if (!res.ok) return null;
      leaderPdfBuf = await res.arrayBuffer();
      return leaderPdfBuf;
    },

    packIsEvergreen: function () {
      try {
        return !!(window.FS.Pack && window.FS.Pack.isEvergreen && window.FS.Pack.isEvergreen());
      } catch (e) {
        return false;
      }
    },

    canBroadcast: function () {
      if (!sessionUser) return false;
      if (Cloud.packIsEvergreen()) return false;
      /* Pushes key off the real profile org, not view-as. An Evergreen-homed
         account previewing Grove must not blast Evergreen as if it were Grove. */
      if (sessionIsEvergreen()) return false;
      if (sessionUser.is_super_admin) return true;
      return !!sessionUser.is_org_admin;
    },

    isHubAdmin: function () {
      return !!(sessionUser && sessionUser.is_hub_admin);
    },

    canEditCalendar: function () {
      if (!sessionUser) return false;
      if (sessionUser.is_super_admin) return true;
      if (!sessionUser.is_hub_admin) return false;
      var home = sessionUser.org_id;
      var visible = Cloud.activeOrgId && Cloud.activeOrgId();
      if (home && visible) return String(home) === String(visible);
      return Cloud.packIsEvergreen();
    },

    canCreateDownlineZoom: function () {
      if (!sessionUser) return false;
      if (!Cloud.packIsEvergreen()) return false;
      if (Cloud.canEditCalendar()) return false;
      return !!sessionUser.is_org_admin;
    },

    canCreatePersonalEvent: function () {
      return !!sessionUser;
    },

    canManageOrgEvent: function (ev) {
      if (!sessionUser || !ev) return false;
      var aud = ev.audience || "org";
      if (aud === "org") return Cloud.canEditCalendar();
      return ev.created_by === sessionUser.id;
    },

    canLoadAdminRoster: function () {
      if (!sessionUser) return false;
      if (sessionUser.is_super_admin) return true;
      if (sessionUser.is_hub_admin) return true;
      if (Cloud.packIsEvergreen()) return false;
      return !!sessionUser.is_org_admin;
    },

    canRearrangeTeam: function () {
      if (!sessionUser) return false;
      if (sessionUser.is_super_admin) return true;
      /* Evergreen: Lily (hub) only. Grove Leaders still rearrange Grove. */
      if (Cloud.packIsEvergreen()) return !!sessionUser.is_hub_admin;
      return !!sessionUser.is_org_admin;
    },

    canNameEvergreenLeader: function () {
      if (!sessionUser) return false;
      if (!Cloud.packIsEvergreen()) return false;
      return !!(sessionUser.is_super_admin || sessionUser.is_hub_admin);
    },

    canRemoveTeamPerson: function (person) {
      if (!sessionUser) return false;
      if (!(sessionUser.is_super_admin || sessionUser.is_hub_admin)) return false;
      if (!person) return true;
      if (person.id === sessionUser.id) return false;
      if (person.is_super_admin || person.is_hub_admin) return false;
      return true;
    },

    listProgressByIds: async function (ids) {
      var out = {};
      ids = (ids || []).filter(Boolean);
      if (!ids.length) return out;
      if (!Cloud.canLoadAdminRoster || !Cloud.canLoadAdminRoster()) return out;
      if (configured() && client) {
        var { data, error } = await client.from("runway_progress")
          .select("partner_id, active, done, updated_at")
          .in("partner_id", ids);
        if (error) throw error;
        (data || []).forEach(function (row) {
          if (row && row.partner_id) out[row.partner_id] = row;
        });
        return out;
      }
      var store = localStore();
      ids.forEach(function (id) {
        var u = store.users[id];
        if (u && u.progress) out[id] = { partner_id: id, done: u.progress.done || {}, active: u.progress.active || "" };
      });
      return out;
    },

    isSuperAdmin: function () {
      return !!(sessionUser && sessionUser.is_super_admin);
    },

    DEFAULT_LEAD_THANKS:
      "Thanks for adding your info! I’ll be in touch with some exciting Ringana details soon!",

    _hydrateSupabaseUser: async function (authUser) {
      if (!authUser || !authUser.id) throw new Error("Missing auth user.");
      var { data: profile, error: profileErr } = await client.from("profiles").select("*").eq("id", authUser.id).maybeSingle();
      if (profileErr) throw profileErr;
      if (!profile) {
        /* trigger may lag — upsert */
        var code = makeCode();
        var meta = authUser.user_metadata || {};
        var up = await client.from("profiles").upsert({
          id: authUser.id,
          email: authUser.email,
          display_name: meta.display_name || (authUser.email || "friend").split("@")[0],
          last_name: meta.last_name || "",
          invite_code: code
        });
        if (up.error) throw up.error;
        await client.from("runway_progress").upsert({ partner_id: authUser.id });
        var again = await client.from("profiles").select("*").eq("id", authUser.id).maybeSingle();
        profile = again.data;
      }
      if (!profile) throw new Error("Could not load profile.");
      sessionUser = Cloud._publicUser(profile);
      try {
        var meta = (authUser && authUser.user_metadata) || {};
        var metaJoin = String(meta.pending_join || "").trim().toLowerCase();
        var haveJoin = pendingJoinForSignup();
        if (isStickyJoin(metaJoin) && !isStickyJoin(haveJoin)) {
          if (onGenericEvergreenDoor()) persistJoinQuiet(metaJoin);
          else setPendingJoin(metaJoin);
        }
      } catch (eMeta) {}
      try { await Cloud.tryAttachPendingSponsor(); } catch (e) {}
      try {
        if (sessionUser && !sessionUser.org_id && !sessionUser.sponsor_id) {
          var leftover = pendingJoinForSignup();
          var signupHost = "";
          try {
            var metaJoin2 = String((authUser.user_metadata && authUser.user_metadata.pending_join) || "").trim().toLowerCase();
            if (!leftover && metaJoin2 !== "evergreen") leftover = metaJoin2;
            signupHost = String((authUser.user_metadata && authUser.user_metadata.signup_host) || "").toLowerCase();
          } catch (eM2) {}
          /* New-account backup only (24h). Unique invite wins.
             Generic Evergreen door → Lily. Generic Grove door → Taylor. */
          var wantEvergreen = false;
          var wantGrove = false;
          var hereHost = "";
          try { hereHost = String(window.location.hostname || "").toLowerCase(); } catch (eH) {}
          if (pendingIsPersonInvite(leftover)) {
            wantEvergreen = false;
            wantGrove = false;
          } else if (!leftover) {
            /* Missing unique: do not invent Lily or Taylor. */
            wantEvergreen = false;
            wantGrove = false;
          } else if (pendingIsEvergreenLeader(leftover)) {
            wantEvergreen = true;
          } else if (onGroveHost(signupHost) || onGroveHost(hereHost)) {
            wantGrove = true;
          } else if (onEvergreenPublicHost(signupHost) || onEvergreenPublicHost(hereHost)) {
            wantEvergreen = true;
          }
          var created = profile.created_at ? new Date(profile.created_at).getTime() : 0;
          if ((wantEvergreen || wantGrove) && created && (Date.now() - created) < 24 * 60 * 60 * 1000) {
            if (!personInviteStillOpen() && !leaderClaimStillOpen()) {
              await client.rpc("assign_org_by_slug", {
                org_slug: wantGrove ? "fresh-grove" : "evergreen-co"
              });
              await Cloud._refreshProfileOrg();
            }
          }
        }
      } catch (e4) {}
      if (sessionUser && sessionUser.org_id) {
        try { await Cloud._hydrateOrg(sessionUser.org_id); } catch (e5) {}
      } else {
        try { await Cloud._hydrateOrg(null); } catch (e6) {}
      }
      try { await refreshAdminSecrets(); } catch (eSec) {}
      /* tryAttach may have refreshed sessionUser */
      return sessionUser;
    },

    _assertEmailPassword: function (email, password, forCreate) {
      email = (email || "").trim().toLowerCase();
      password = String(password || "");
      if (!email || email.indexOf("@") < 1) throw new Error("Enter a valid email.");
      if (forCreate && password.length < 8) throw new Error("Password needs at least 8 characters.");
      if (!forCreate && password.length < 6) throw new Error("Password needs at least 6 characters.");
      return { email: email, password: password };
    },

    friendlyAuthError: function (err, creating) {
      var raw = errText(err);
      var low = raw.toLowerCase();
      var code = String((err && (err.code || err.error_code)) || "").toLowerCase();
      if (isNetworkCloudError(err) || /failed to fetch|networkerror|load failed|the internet connection appears to be offline/i.test(low)) {
        return "Couldn’t reach First Seeds just now. Check your signal and try again.";
      }
      if (code === "over_request_rate_limit" || /rate limit|too many requests|too many tries/i.test(low)) {
        return "Too many tries — wait a minute, then sign in again.";
      }
      if (code === "email_not_confirmed" || /email not confirmed|confirm your email|confirm email/i.test(low)) {
        return "Account created — try Sign in with that same email and password.";
      }
      if (
        low.indexOf("already registered") >= 0 ||
        low.indexOf("already been registered") >= 0 ||
        low.indexOf("user already exists") >= 0
      ) {
        return "That email already has an account — tap Sign in instead.";
      }
      if (creating && /cannot create an account|email is blocked/i.test(low)) {
        return "This email can’t be used to create an account. Ask your leader if you think that’s a mistake.";
      }
      if (code === "invalid_credentials" || low.indexOf("invalid login") >= 0 || low.indexOf("invalid credentials") >= 0) {
        return creating
          ? "That email already has an account, or the password didn’t match. Tap Sign in with the password you used before."
          : "Email or password didn’t match. Try Sign in again, or Forgot your password.";
      }
      if (code === "otp_expired" || ((/expired/i.test(low)) && /otp|token|code/i.test(low))) {
        return "That code expired. Send a new one.";
      }
      if (code === "otp_disabled") {
        return "Couldn’t send a code just now. Wait a minute and try again.";
      }
      if (/invalid.*(token|otp|code)|token is invalid|otp is invalid/i.test(low)) {
        return "That code didn’t match. Check the number and try again.";
      }
      return raw || (creating ? "Could not create account." : "Could not sign in.");
    },

    lastEmail: lastRememberedEmail,
    passwordResetPending: function () { return !!passwordResetPending; },
    readPasswordReset: readPasswordReset,
    clearPasswordReset: clearPasswordReset,

    requestSignInCode: async function (email) {
      email = normalizeAuthEmail(email);
      if (!email || email.indexOf("@") < 1) throw new Error("Enter the email you used the first time.");
      if (!configured() || !client) throw new Error("Password reset needs a connection.");
      rememberLastEmail(email);
      var { error } = await client.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: false }
      });
      if (error) {
        var low = errText(error).toLowerCase();
        var code = String((error && (error.code || error.error_code)) || "").toLowerCase();
        if (
          code === "user_not_found" ||
          /signups? not allowed|user not found/i.test(low)
        ) {
          writePasswordReset({ email: email, step: "code" });
          return {
            kind: "code_sent",
            message: "If that inbox is on an account, a code is on the way. Come back here and type it — don’t tap a link if one shows up."
          };
        }
        throw error;
      }
      writePasswordReset({ email: email, step: "code" });
      return {
        kind: "code_sent",
        message: "If that inbox is on an account, a code is on the way. Come back here and type it — don’t tap a link if one shows up."
      };
    },

    verifySignInCode: async function (email, token) {
      email = normalizeAuthEmail(email);
      token = String(token || "").replace(/\s+/g, "");
      if (!email || email.indexOf("@") < 1) throw new Error("Enter the email you used the first time.");
      if (!/^\d{6,8}$/.test(token)) throw new Error("Type the 6-digit code from the email.");
      if (!configured() || !client) throw new Error("Password reset needs a connection.");
      passwordResetPending = true;
      var { data, error } = await client.auth.verifyOtp({
        email: email,
        token: token,
        type: "email"
      });
      if (error) {
        passwordResetPending = false;
        throw error;
      }
      if (data && data.user) {
        await adoptSessionUser(data.user);
      }
      rememberLastEmail(email);
      writePasswordReset({ email: email, step: "password" });
      passwordResetPending = true;
      return { kind: "code_ok", message: "Code matched. Pick a new password (8+ characters)." };
    },

    setNewPassword: async function (password) {
      password = String(password || "");
      if (password.length < 8) throw new Error("Password needs at least 8 characters.");
      if (!configured() || !client) throw new Error("Password reset needs a connection.");
      if (!sessionUser) throw new Error("Check the code first.");
      var { error } = await client.auth.updateUser({ password: password });
      if (error) throw error;
      clearPasswordReset();
      emit("auth", sessionUser);
      return { kind: "signed_in", message: "Password saved — you’re signed in." };
    },

    _finishLocalSignIn: function (email, displayName) {
      var store = localStore();
      var existingId = null;
      Object.keys(store.users).forEach(function (id) {
        if (store.users[id].email === email) existingId = id;
      });
      var user;
      if (existingId) {
        user = store.users[existingId];
        if (displayName) user.display_name = displayName;
      } else {
        var id = "local_" + makeCode();
        user = {
          id: id,
          email: email,
          display_name: displayName,
          hub_mode: "",
          tour_done: false,
          invite_code: makeCode(),
          sponsor_id: null,
          invited_by_id: null,
          is_org_admin: false,
          is_hub_admin: false,
          is_super_admin: false,
          last_active_at: new Date().toISOString(),
          org_id: null,
          org_slug: "",
          progress: blankProgress()
        };
        store.users[id] = user;
      }
      var pending = Cloud.pendingJoinCode();
      var hadInvited = !!user.invited_by_id;
      if (pending && !user.invited_by_id) {
        Object.keys(store.users).forEach(function (id2) {
          var u2 = store.users[id2];
          if (u2.invite_code === pending && u2.id !== user.id) {
            user.sponsor_id = u2.id;
            user.invited_by_id = u2.id;
            user.org_id = u2.org_id || user.org_id || (window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"]);
            user.org_slug = u2.org_slug || user.org_slug || "fresh-grove";
          }
        });
        if (pendingIsEvergreenLeader(pending) && user.org_slug !== "fresh-grove") {
          user.org_id = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || "";
          user.org_slug = "evergreen-co";
          user.is_org_admin = true;
          noteLeaderClaim("ok");
        } else if (pending === "evergreen" && !user.org_slug) {
          user.org_id = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || "";
          user.org_slug = "evergreen-co";
        }
      } else if (!existingId && !user.org_slug) {
        user.org_id = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || "";
        user.org_slug = "evergreen-co";
      }
      if (user.invited_by_id && pending && !hadInvited) {
        rememberAppliedJoin(pending);
        Cloud.clearPendingJoin();
      }
      user.last_active_at = new Date().toISOString();
      store.currentId = user.id;
      store.users[user.id] = user;
      localSave(store);
      sessionUser = Cloud._publicUser(user);
      emit("auth", sessionUser);
      return { kind: "local", message: "Signed in (local bridge mode)." };
    },

    /* Email + password — stays inside the PWA (no Safari redirect). */
    signIn: async function (email, displayName, password) {
      var creds = Cloud._assertEmailPassword(email, password, false);
      displayName = String(displayName || "").trim();
      if (Cloud.isPlaceholderName(displayName)) displayName = "";

      if (configured() && client) {
        var { data, error } = await client.auth.signInWithPassword({
          email: creds.email,
          password: creds.password
        });
        if (error && isNetworkCloudError(error)) {
          await new Promise(function (resolve) { setTimeout(resolve, 450); });
          var retry = await client.auth.signInWithPassword({
            email: creds.email,
            password: creds.password
          });
          data = retry.data;
          error = retry.error;
        }
        if (error) throw error;
        if (data && data.user) {
          await adoptSessionUser(data.user);
          rememberLastEmail(creds.email);
          emit("auth", sessionUser);
        }
        return { kind: "signed_in", message: "You’re signed in." };
      }

      return Cloud._finishLocalSignIn(creds.email, displayName);
    },

    signUp: async function (email, displayName, password, lastName) {
      var creds = Cloud._assertEmailPassword(email, password, true);
      displayName = String(displayName || "").trim();
      if (Cloud.isPlaceholderName(displayName)) displayName = "";
      displayName = (displayName || creds.email.split("@")[0]).trim();
      lastName = String(lastName || "").trim();

      if (configured() && client) {
        var pendingAtSignup = pendingJoinForSignup();
        var meta = { display_name: displayName, last_name: lastName };
        try {
          var signupHost = String(window.location.hostname || "");
          var signupHub = "";
          try { signupHub = joinHubParam(pendingAtSignup); } catch (eHubP) {}
          if (!signupHub) {
            try {
              var sh = String(new URLSearchParams(window.location.search).get("hub") || "").trim().toLowerCase();
              if (sh === "grove" || sh === "fresh-grove") signupHub = "grove";
              else if (sh === "evergreen" || sh === "evergreen-co") signupHub = "evergreen";
            } catch (eHubQ) {}
          }
          /* After the pretty hop, hostname is github.io. Empty pending + that
             host used to park Grove invitees on Evergreen (Lily). */
          if (signupHub === "grove" && /github\.io$/i.test(signupHost)) {
            signupHost = "thefreshgrove.team";
          }
          meta.signup_host = signupHost;
          if (signupHub) meta.signup_hub = signupHub;
        } catch (eHost) {}
        try { meta.signup_path = String(window.location.pathname || ""); } catch (ePath) {}
        try { meta.signup_search = String(window.location.search || ""); } catch (eSearch) {}
        try { meta.signup_hash = String(window.location.hash || ""); } catch (eHash) {}
        meta.pending_join = pendingAtSignup || "";
        var { data, error } = await client.auth.signUp({
          email: creds.email,
          password: creds.password,
          options: { data: meta }
        });
        if (error) {
          var low = String((error && error.message) || "").toLowerCase();
          /* Same email again → sign them into the existing account instead of a twin profile */
          if (low.indexOf("already") >= 0 || low.indexOf("registered") >= 0) {
            try {
              var existing = await Cloud.signIn(creds.email, displayName, creds.password);
              existing.message = "Welcome back — that email already had an account, so you’re signed in.";
              return existing;
            } catch (signInErr) {
              throw new Error("That email already has an account — tap Sign in with the same password.");
            }
          }
          throw error;
        }
        /* No session: email confirm may be on, or Supabase hid an existing user.
           Prefer signing in over leaving people to Create account a second time. */
        if (!data.session) {
          try {
            var signed = await Cloud.signIn(creds.email, displayName, creds.password);
            signed.message = signed.message || "You’re signed in.";
            return signed;
          } catch (e) {
            throw new Error(
              "Account created — try Sign in with that same email and password. (If that fails, ask your leader: email confirmation may still be on.)"
            );
          }
        }
        if (data.user) {
          await adoptSessionUser(data.user);
          if (displayName || lastName) {
            try {
              await Cloud.updateProfile({
                display_name: displayName,
                last_name: lastName
              });
            } catch (e) {}
          }
          rememberLastEmail(creds.email);
          emit("auth", sessionUser);
        }
        return { kind: "signed_in", message: "Account created — you’re signed in." };
      }

      var localStoreNow = localStore();
      var blockedLocal = (localStoreNow.blockedEmails || []).some(function (e) {
        return String(e || "").toLowerCase() === creds.email;
      });
      if (blockedLocal) throw new Error("This email can’t be used to create an account.");
      var localRes = Cloud._finishLocalSignIn(creds.email, displayName);
      if (lastName) {
        try { await Cloud.updateProfile({ last_name: lastName }); } catch (e) {}
      }
      return localRes;
    },

    signOut: async function () {
      clearPasswordReset();
      userSignedOut = true;
      try { localStorage.setItem("fsSigned", "0"); } catch (eFs) {}
      try { localStorage.setItem("fsUserSignedOut", "1"); } catch (eFs2) {}
      try {
        var pending = pendingJoinForSignup();
        var keepInvite = (personInviteStillOpen() && pending && !pendingIsOtherPersonJoin(pending)) ||
          leaderClaimStillOpen();
        if (!keepInvite) {
          clearPendingJoinStorage(true);
          Cloud.stripJoinFromUrl();
        }
      } catch (eJoin) {}
      if (configured() && client) {
        await client.auth.signOut();
      }
      var store = localStore();
      store.currentId = null;
      localSave(store);
      sessionUser = null;
      leaderPdfBuf = null;
      clearTeamNet();
      clearCabinetRosterNet();
      emit("auth", null);
    },

    updateProfile: async function (patch) {
      if (!sessionUser) return;
      patch = Object.assign({}, patch || {});
      var allowed = {
        display_name: true,
        last_name: true,
        hub_mode: true,
        tour_done: true,
        last_active_at: true,
        lead_blurb: true,
        lead_thanks: true,
        instagram: true
      };
      Object.keys(patch).forEach(function (key) {
        if (!allowed[key]) delete patch[key];
      });
      if (!Object.keys(patch).length) return sessionUser;
      if (configured() && client) {
        var { data, error } = await client.from("profiles").update(patch).eq("id", sessionUser.id).select().single();
        if (error) throw error;
        sessionUser = Cloud._publicUser(data);
      } else {
        var store = localStore();
        var u = store.users[sessionUser.id];
        Object.keys(patch).forEach(function (k) { u[k] = patch[k]; });
        store.users[sessionUser.id] = u;
        localSave(store);
        sessionUser = Cloud._publicUser(u);
      }
      emit("auth", sessionUser);
      return sessionUser;
    },

    /* Copy fallback, not a real given name. Saved into profiles when someone
       created an account without the name step (welcome → Sign in → Create). */
    isPlaceholderName: function (name) {
      return /^friend$/i.test(String(name || "").trim());
    },

    /* First + last for leader-facing lists; falls back gracefully.
       Avoids "Jessica Smith Smith" when display_name already included the surname. */
    formatPersonName: function (person) {
      if (!person) return "Partner";
      var first = String(person.display_name || "").trim();
      var last = String(person.last_name || "").trim();
      if (first) {
        var bits = first.split(/\s+/).filter(Boolean);
        if (bits.length && Cloud.isPlaceholderName(bits[0])) bits.shift();
        first = bits.join(" ");
      }
      if (first && last) {
        var fl = first.toLowerCase();
        var ll = last.toLowerCase();
        if (fl === ll || fl.endsWith(" " + ll)) return first;
        return first + " " + last;
      }
      return first || last || person.email || "Partner";
    },

    personFirstName: function (person) {
      if (!person) return "friend";
      var first = String(person.display_name || "").trim();
      if (first) {
        var bits = first.split(/\s+/).filter(Boolean);
        if (bits.length && Cloud.isPlaceholderName(bits[0])) bits.shift();
        if (bits[0]) return bits[0];
      }
      var last = String(person.last_name || "").trim().split(/\s+/)[0];
      if (last) return last;
      return (person.email || "").split("@")[0] || "friend";
    },

    pullProgress: async function () {
      if (!sessionUser) return null;
      if (configured() && client) {
        var { data, error } = await client.from("runway_progress").select("*").eq("partner_id", sessionUser.id).maybeSingle();
        if (error) throw error;
        if (!data) return null;
        return {
          active: data.active,
          data: data.data || {},
          done: data.done || {},
          calendar: data.calendar || {},
          cheers: data.cheers || [],
          updated_at: data.updated_at
        };
      }
      var u = localUserFromId(sessionUser.id);
      return u ? (u.progress || blankProgress()) : null;
    },

    pushProgress: async function (stateSlice) {
      if (!sessionUser) return;
      var payload = {
        partner_id: sessionUser.id,
        active: stateSlice.active || "welcome",
        data: Object.assign({}, stateSlice.data || {}),
        done: stateSlice.done || {},
        calendar: stateSlice.calendar || {},
        cheers: stateSlice.cheers || [],
        updated_at: new Date().toISOString()
      };
      delete payload.data.calendar;
      if (configured() && client) {
        var saved = await client.rpc("save_runway_progress", {
          p_active: payload.active,
          p_data: payload.data,
          p_done: payload.done,
          p_calendar: payload.calendar,
          p_cheers: payload.cheers
        });
        if (saved && saved.error) {
          var up = await client.from("runway_progress").upsert(payload);
          if (up && up.error) throw up.error;
        }
        var profilePatch = {
          hub_mode: (stateSlice.settings && stateSlice.settings.hubMode) || sessionUser.hub_mode || "",
          display_name: (stateSlice.settings && stateSlice.settings.partnerName) || sessionUser.display_name,
          last_name: (stateSlice.settings && stateSlice.settings.partnerLastName) || sessionUser.last_name || "",
          tour_done: !!stateSlice.tourDone
        };
        /* Presence: at most once per local day, so background syncs don't fake "active today" */
        if (!sameLocalCalendarDay(sessionUser.last_active_at, new Date())) {
          profilePatch.last_active_at = new Date().toISOString();
        }
        var prof = await client.from("profiles").update(profilePatch).eq("id", sessionUser.id);
        if (prof && prof.error) throw prof.error;
        if (profilePatch.display_name != null) sessionUser.display_name = profilePatch.display_name;
        if (profilePatch.last_name != null) sessionUser.last_name = profilePatch.last_name;
        if (profilePatch.hub_mode != null) sessionUser.hub_mode = profilePatch.hub_mode;
        if (profilePatch.tour_done != null) sessionUser.tour_done = !!profilePatch.tour_done;
        if (profilePatch.last_active_at) sessionUser.last_active_at = profilePatch.last_active_at;
      } else {
        var store = localStore();
        var u = store.users[sessionUser.id];
        if (!u) return;
        u.progress = payload;
        if (stateSlice.settings) {
          if (stateSlice.settings.hubMode) u.hub_mode = stateSlice.settings.hubMode;
          if (stateSlice.settings.partnerName) u.display_name = stateSlice.settings.partnerName;
          if (stateSlice.settings.partnerLastName != null) u.last_name = stateSlice.settings.partnerLastName;
        }
        u.tour_done = !!stateSlice.tourDone;
        if (!sameLocalCalendarDay(u.last_active_at, new Date())) {
          u.last_active_at = new Date().toISOString();
        }
        store.users[sessionUser.id] = u;
        localSave(store);
        sessionUser = Cloud._publicUser(u);
      }
    },

    listHowIGrowForPartners: async function (ids) {
      ids = (ids || []).filter(Boolean);
      if (!sessionUser || !ids.length) return [];
      if (configured() && client) {
        var { data, error } = await client.rpc("list_how_i_grow_for_partners", { p_ids: ids });
        if (error) throw error;
        var rows = data;
        if (typeof rows === "string") {
          try { rows = JSON.parse(rows); } catch (e) { rows = []; }
        }
        return Array.isArray(rows) ? rows : [];
      }
      var store = localStore();
      var me = sessionUser.id;
      return ids.map(function (id) {
        var u = store.users[id];
        if (!u) return null;
        if (id !== me && u.sponsor_id !== me) {
          var amSuper = Cloud.isSuperAdmin && Cloud.isSuperAdmin();
          var amHub = Cloud.isHubAdmin && Cloud.isHubAdmin();
          if (!amSuper && !amHub) return null;
          if (!amSuper && String(u.org_id || "") !== String(sessionUser.org_id || "")) return null;
        }
        return {
          partner_id: id,
          allowed: true,
          support: u.support_preferences || null
        };
      }).filter(Boolean);
    },

    loadSupportPreferences: async function () {
      if (!sessionUser) return null;
      if (configured() && client) {
        var { data, error } = await client.from("support_preferences")
          .select("partner_id, answers, completed_at, updated_at")
          .eq("partner_id", sessionUser.id)
          .maybeSingle();
        if (error) throw error;
        return data || null;
      }
      var u = localUserFromId(sessionUser.id);
      return u && u.support_preferences ? u.support_preferences : null;
    },

    saveSupportPreferences: async function (answers, complete) {
      if (!sessionUser) throw new Error("Sign in first.");
      var now = new Date().toISOString();
      var existing = await Cloud.loadSupportPreferences();
      var payload = {
        partner_id: sessionUser.id,
        answers: answers || {},
        completed_at: complete ? ((existing && existing.completed_at) || now) : ((existing && existing.completed_at) || null),
        updated_at: now
      };
      if (configured() && client) {
        var { data, error } = await client.from("support_preferences")
          .upsert(payload)
          .select("partner_id, answers, completed_at, updated_at")
          .single();
        if (error) throw error;
        return data;
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      if (!u) throw new Error("Account not found.");
      u.support_preferences = payload;
      store.users[sessionUser.id] = u;
      localSave(store);
      return payload;
    },

    myInviteCode: function () {
      return sessionUser ? sessionUser.invite_code : "";
    },

    /* Direct downline for leader dashboard */
    listDownline: async function () {
      if (!sessionUser) return [];
      var netUser = sessionUser.id;
      var netPack = teamNetPack();
      if (downlineNet.inflight && downlineNet.user === netUser && downlineNet.pack === netPack) {
        return downlineNet.inflight;
      }
      if (downlineNet.raw && downlineNet.user === netUser && downlineNet.pack === netPack &&
          Date.now() - downlineNet.at < 90000) {
        return downlineNet.raw;
      }
      var work = Cloud._listDownlineNow();
      downlineNet.user = netUser;
      downlineNet.pack = netPack;
      downlineNet.inflight = work;
      try {
        var rows = await work;
        downlineNet.raw = rows;
        downlineNet.at = Date.now();
        return rows;
      } finally {
        if (downlineNet.inflight === work) downlineNet.inflight = null;
      }
    },

    _listDownlineNow: async function () {
      if (!sessionUser) return [];
      if (configured() && client) {
        var people;
        try {
          people = await fetchPaged(function (from, to) {
            return client.from("profiles")
              .select("id, display_name, last_name, email, hub_mode, last_active_at, created_at, is_org_admin, org_id, sponsor_id, photo_at, photo_ext")
              .eq("sponsor_id", sessionUser.id)
              .order("last_active_at", { ascending: false })
              .range(from, to);
          }, 200);
        } catch (ePhoto) {
          people = await fetchPaged(function (from, to) {
            return client.from("profiles")
              .select("id, display_name, last_name, email, hub_mode, last_active_at, created_at, is_org_admin, org_id, sponsor_id")
              .eq("sponsor_id", sessionUser.id)
              .order("last_active_at", { ascending: false })
              .range(from, to);
          }, 200);
        }
        if (!people || !people.length) return [];
        var evOrg = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || "";
        people = people.filter(function (p) {
          if (!p) return false;
          if (Cloud.packIsEvergreen()) return !!(evOrg && p.org_id === evOrg);
          if (evOrg && p.org_id === evOrg) return false;
          return true;
        });
        if (!people.length) return [];
        var ids = people.map(function (p) { return p.id; });
        var progressRows = [];
        var supportRows = [];
        var CHUNK = 120;
        for (var i = 0; i < ids.length; i += CHUNK) {
          var slice = ids.slice(i, i + CHUNK);
          var progRes = await client.from("runway_progress")
            .select("partner_id, active, data, done, calendar, updated_at")
            .in("partner_id", slice);
          if (progRes.error) throw progRes.error;
          progressRows = progressRows.concat(progRes.data || []);
          try {
            var supportRes = await client.from("support_preferences")
              .select("partner_id, answers, completed_at, updated_at")
              .in("partner_id", slice);
            if (!supportRes.error) supportRows = supportRows.concat(supportRes.data || []);
          } catch (e) {}
        }
        var byId = {};
        (progressRows || []).forEach(function (r) { byId[r.partner_id] = r; });
        var supportById = {};
        supportRows.forEach(function (r) { supportById[r.partner_id] = r; });
        return people.map(function (p) {
          var prog = byId[p.id] || null;
          if (prog && prog.data && prog.data._notified_at) {
            prog = Object.assign({}, prog, { notified_at: prog.data._notified_at });
          }
          return { profile: p, progress: prog, support_preferences: supportById[p.id] || null };
        });
      }
      var store = localStore();
      var out = [];
      Object.keys(store.users).forEach(function (id) {
        var u = store.users[id];
        if (u.sponsor_id === sessionUser.id) {
          var evId = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || "";
          var isEv = u.org_slug === "evergreen-co" || !!(evId && u.org_id === evId);
          if (Cloud.packIsEvergreen()) {
            if (!isEv) return;
          } else if (isEv) {
            return;
          }
          out.push({
            profile: {
              id: u.id,
              display_name: u.display_name,
              last_name: u.last_name || "",
              email: u.email,
              hub_mode: u.hub_mode,
              last_active_at: u.last_active_at,
              created_at: u.created_at || u.last_active_at,
              is_org_admin: !!u.is_org_admin,
              org_id: u.org_id || null,
              sponsor_id: u.sponsor_id || sessionUser.id,
              photo_at: u.photo_at || null,
              photo_ext: u.photo_ext === "jpg" ? "jpg" : "webp"
            },
            progress: u.progress || blankProgress(),
            support_preferences: u.support_preferences || null
          });
        }
      });
      out.sort(function (a, b) {
        return String(b.profile.last_active_at).localeCompare(String(a.profile.last_active_at));
      });
      return out;
    },

    /* You → up to 6 levels under you (names / structure). Coaching stays front-line only. */
    listTeamGraph: async function () {
      var MAX = 6;
      if (!sessionUser) return { roots: [], depth: MAX };
      var netUser = sessionUser.id;
      var netPack = teamNetPack();
      if (teamGraphNet.inflight && teamGraphNet.user === netUser && teamGraphNet.pack === netPack) {
        return teamGraphNet.inflight;
      }
      if (teamGraphNet.raw && teamGraphNet.user === netUser && teamGraphNet.pack === netPack &&
          Date.now() - teamGraphNet.at < 90000) {
        return teamGraphNet.raw;
      }
      var work = Cloud._listTeamGraphNow();
      teamGraphNet.user = netUser;
      teamGraphNet.pack = netPack;
      teamGraphNet.inflight = work;
      try {
        var graph = await work;
        teamGraphNet.raw = graph;
        teamGraphNet.at = Date.now();
        return graph;
      } finally {
        if (teamGraphNet.inflight === work) teamGraphNet.inflight = null;
      }
    },

    _listTeamGraphNow: async function () {
      var MAX = 6;
      if (!sessionUser) return { roots: [], depth: MAX };
      function pruneGraphOrgs(nodes) {
        var ids = window.FS.PACK_IDS || {};
        var evId = ids["evergreen-co"] || "";
        var wantEv = Cloud.packIsEvergreen();
        var out = [];
        (nodes || []).forEach(function (p) {
          if (!p) return;
          var isEv = !!(evId && p.org_id && String(p.org_id) === String(evId));
          var kids = pruneGraphOrgs(p.children);
          if (wantEv ? !isEv : isEv) {
            for (var i = 0; i < kids.length; i++) out.push(kids[i]);
            return;
          }
          p.children = kids;
          out.push(p);
        });
        return out;
      }
      function asGraph(raw) {
        var rows = raw;
        if (typeof rows === "string") {
          try { rows = JSON.parse(rows); } catch (eParse) { rows = []; }
        }
        if (rows && !Array.isArray(rows) && Array.isArray(rows.roots)) rows = rows.roots;
        if (!Array.isArray(rows)) rows = [];
        return { roots: pruneGraphOrgs(rows), depth: MAX };
      }
      if (configured() && client) {
        var { data, error } = await client.rpc("team_graph", { max_depth: MAX });
        if (error) throw error;
        return asGraph(data);
      }
      var store = localStore();
      function kidsOf(sponsorId, remaining) {
        if (remaining <= 0) return [];
        var out = [];
        Object.keys(store.users).forEach(function (id) {
          var u = store.users[id];
          if (u.sponsor_id !== sponsorId) return;
          var ids = window.FS.PACK_IDS || {};
          var isEv = u.org_slug === "evergreen-co" || !!(u.org_id && u.org_id === ids["evergreen-co"]);
          if (Cloud.packIsEvergreen()) {
            if (!isEv) return;
          } else if (isEv) {
            return;
          }
          out.push({
            id: u.id,
            display_name: u.display_name,
            last_name: u.last_name || "",
            email: remaining === MAX ? (u.email || "") : "",
            hub_mode: u.hub_mode,
            last_active_at: u.last_active_at,
            created_at: u.created_at || u.last_active_at,
            is_org_admin: !!u.is_org_admin,
            is_hub_admin: !!u.is_hub_admin,
            org_id: u.org_id || null,
            sponsor_id: u.sponsor_id || sponsorId,
            children: kidsOf(u.id, remaining - 1)
          });
        });
        out.sort(function (a, b) {
          return String(a.created_at || "").localeCompare(String(b.created_at || ""));
        });
        return out;
      }
      return { roots: kidsOf(sessionUser.id, MAX), depth: MAX };
    },

    /* Live Fresh Grove subtree for the Evergreen tree. Does not move anyone. */
    listGroveGraft: async function () {
      function parseRoot(raw) {
        var row = raw;
        if (typeof row === "string") {
          try { row = JSON.parse(row); } catch (eParse) { row = null; }
        }
        if (!row || !row.id) return null;
        return row;
      }
      if (!sessionUser) return null;
      if (!(Cloud.packIsEvergreen() && (Cloud.isSuperAdmin() || Cloud.isHubAdmin()))) return null;
      if (configured() && client) {
        var { data, error } = await client.rpc("evergreen_grove_graft");
        if (error) throw error;
        return parseRoot(data);
      }
      var store = localStore();
      var groveId = (window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"]) || "";
      var root = null;
      Object.keys(store.users).forEach(function (id) {
        var u = store.users[id];
        if (!u || root) return;
        if (String(u.lead_slug || "").toLowerCase() !== "taylor") return;
        if (groveId && u.org_id && String(u.org_id) !== String(groveId)) return;
        if (!u.is_super_admin) return;
        root = u;
      });
      if (!root) return null;
      function kidsOf(sponsorId, remaining) {
        if (remaining < 1) return [];
        var out = [];
        Object.keys(store.users).forEach(function (id) {
          var u = store.users[id];
          if (!u || u.sponsor_id !== sponsorId) return;
          if (u.is_super_admin) return;
          if (groveId && u.org_id && String(u.org_id) !== String(groveId)) return;
          out.push({
            id: u.id,
            display_name: u.display_name,
            last_name: u.last_name || "",
            email: "",
            hub_mode: u.hub_mode,
            created_at: u.created_at || u.last_active_at || "",
            is_org_admin: !!u.is_org_admin,
            org_id: u.org_id || groveId || null,
            sponsor_id: u.sponsor_id || sponsorId,
            children: kidsOf(u.id, remaining - 1)
          });
        });
        out.sort(function (a, b) {
          return String(a.created_at || "").localeCompare(String(b.created_at || ""));
        });
        return out;
      }
      return {
        id: root.id,
        display_name: root.display_name,
        last_name: root.last_name || "",
        email: "",
        hub_mode: root.hub_mode,
        created_at: root.created_at || root.last_active_at || "",
        is_org_admin: !!root.is_org_admin,
        is_super_admin: true,
        org_id: root.org_id || groveId || null,
        sponsor_id: root.sponsor_id || null,
        grove_graft_root: true,
        children: kidsOf(root.id, 8)
      };
    },

    myUpline: async function () {
      if (!sessionUser) return [];
      if (configured() && client) {
        var { data, error } = await client.rpc("my_upline");
        if (error) throw error;
        if (typeof data === "string") {
          try { data = JSON.parse(data); } catch (eParse) { data = []; }
        }
        return Array.isArray(data) ? data : [];
      }
      var store = localStore();
      var me = store.users[sessionUser.id];
      if (!me) return [];
      var ids = window.FS.PACK_IDS || {};
      var groveId = ids["fresh-grove"] || "";
      var evId = ids["evergreen-co"] || "";
      function findCap(pred) {
        var keys = Object.keys(store.users);
        for (var i = 0; i < keys.length; i++) {
          var u = store.users[keys[i]];
          if (pred(u)) return u;
        }
        return null;
      }
      var evCap = findCap(function (u) {
        return !!u.is_hub_admin && String(u.org_id || "") === String(evId);
      }) || findCap(function (u) { return !!u.is_hub_admin; });
      var groveCap = findCap(function (u) {
        return !!u.is_super_admin && String(u.org_id || "") === String(groveId);
      }) || findCap(function (u) { return !!u.is_super_admin; });
      if (evCap && evCap.id === sessionUser.id) return [];
      var seen = {};
      var out = [];
      var walk = me.sponsor_id ? store.users[me.sponsor_id] : null;
      var guard = 0;
      function rowOf(u, cap) {
        return {
          id: u.id,
          display_name: u.display_name,
          last_name: u.last_name || "",
          is_org_admin: !!u.is_org_admin,
          is_hub_admin: !!u.is_hub_admin,
          is_super_admin: !!u.is_super_admin,
          org_id: u.org_id || null,
          cap: cap || null
        };
      }
      function capFor(u) {
        if (evCap && u.id === evCap.id) return "evergreen";
        if (u.is_hub_admin && String(u.org_id || "") === String(evId)) return "evergreen";
        if (groveCap && u.id === groveCap.id) return "grove";
        if (u.is_super_admin) return "grove";
        return null;
      }
      while (walk && walk.id && !seen[walk.id] && guard < 12) {
        seen[walk.id] = true;
        guard += 1;
        var cap = capFor(walk);
        out.push(rowOf(walk, cap));
        if (cap === "evergreen") break;
        walk = walk.sponsor_id ? store.users[walk.sponsor_id] : null;
      }
      if (groveCap && groveCap.id !== sessionUser.id && !seen[groveCap.id]) {
        seen[groveCap.id] = true;
        var groveRow = rowOf(groveCap, "grove");
        if (out.length && out[out.length - 1].cap === "evergreen") {
          out.splice(out.length - 1, 0, groveRow);
        } else {
          out.push(groveRow);
        }
      }
      if (evCap && evCap.id !== sessionUser.id && !seen[evCap.id]) {
        out.push(rowOf(evCap, "evergreen"));
      }
      return out;
    },

    mySupportContext: async function () {
      if (!sessionUser) return null;
      if (configured() && client) {
        var { data, error } = await client.rpc("my_support_context");
        if (error) throw error;
        return data || null;
      }
      var store = localStore();
      var me = store.users[sessionUser.id];
      if (!me) return null;
      var inv = me.invited_by_id ? store.users[me.invited_by_id] : null;
      var sp = me.sponsor_id ? store.users[me.sponsor_id] : null;
      return {
        invited_by_id: me.invited_by_id || null,
        invited_by_name: inv ? Cloud.formatPersonName(inv) : null,
        sponsor_id: me.sponsor_id || null,
        sponsor_name: sp ? Cloud.formatPersonName(sp) : null
      };
    },

    adminListProfiles: async function () {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.canLoadAdminRoster()) throw new Error("Leaders only.");
      if (configured() && client) {
        var { data, error } = await client.rpc("admin_list_profiles");
        if (error) throw error;
        var rows = data || [];
        if (typeof rows === "string") {
          try { rows = JSON.parse(rows); } catch (eParse) { rows = []; }
        }
        return Array.isArray(rows) ? rows : [];
      }
      var store = localStore();
      var myOrg = sessionUser.org_id || null;
      var amSuper = Cloud.isSuperAdmin();
      return Object.keys(store.users).map(function (id) {
        var u = store.users[id];
        return {
          id: u.id,
          display_name: u.display_name,
          last_name: u.last_name || "",
          email: u.email,
          sponsor_id: u.sponsor_id || null,
          invited_by_id: u.invited_by_id || null,
          is_org_admin: !!u.is_org_admin,
          is_hub_admin: !!u.is_hub_admin,
          is_super_admin: !!u.is_super_admin,
          hub_mode: u.hub_mode || "",
          created_at: u.created_at || u.last_active_at || "",
          org_id: u.org_id || null
        };
      }).filter(function (p) {
        if (amSuper) return true;
        if (p.is_super_admin) return true;
        return String(p.org_id || "") === String(myOrg || "");
      }).sort(function (a, b) {
        return String(a.display_name || a.email || "").localeCompare(String(b.display_name || b.email || ""), undefined, { sensitivity: "base" });
      });
    },

    reparentPartner: async function (partnerId, newSponsorId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.canRearrangeTeam()) throw new Error("Leaders only.");
      var sponsorId = newSponsorId || null;
      if (configured() && client) {
        var { data, error } = await client.rpc("reparent_partner", {
          partner: partnerId,
          new_sponsor: sponsorId
        });
        if (error) throw error;
        clearTeamNet();
        return data;
      }
      var store = localStore();
      var partner = store.users[partnerId];
      if (!partner) throw new Error("Partner not found.");
      if (sponsorId) {
        var sponsor = store.users[sponsorId];
        if (!sponsor) throw new Error("Partner or new sponsor not found.");
        if (partnerId === sponsorId) throw new Error("Someone cannot be under themselves.");
        var walk = sponsorId;
        var hops = 0;
        while (walk && hops < 64) {
          if (walk === partnerId) throw new Error("That move would create a loop in the tree.");
          walk = store.users[walk] && store.users[walk].sponsor_id;
          hops++;
        }
      }
      partner.sponsor_id = sponsorId;
      store.users[partnerId] = partner;
      localSave(store);
      return { partner_id: partnerId, sponsor_id: sponsorId };
    },

    setOrgAdmin: async function (partnerId, enabled) {
      if (!sessionUser) throw new Error("Sign in first.");
      var evergreenLeader = !!(Cloud.canNameEvergreenLeader && Cloud.canNameEvergreenLeader());
      if (!Cloud.isSuperAdmin() && !evergreenLeader) throw new Error("Not allowed.");
      if (partnerId === sessionUser.id && !enabled) {
        throw new Error("You cannot remove your own access here.");
      }
      if (configured() && client) {
        var { data, error } = await client.rpc("set_org_admin", {
          partner: partnerId,
          enabled: !!enabled
        });
        if (error) throw error;
        return data;
      }
      var store = localStore();
      var partner = store.users[partnerId];
      if (!partner) throw new Error("Partner not found.");
      if (partner.is_super_admin) throw new Error("Cannot change org-admin flag on a super admin.");
      partner.is_org_admin = !!enabled;
      partner.leader_welcome_pending = !!enabled;
      store.users[partnerId] = partner;
      localSave(store);
      return { partner_id: partnerId, is_org_admin: !!enabled };
    },

    removeTeamPerson: async function (partnerId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.canRemoveTeamPerson()) throw new Error("Not allowed.");
      if (partnerId === sessionUser.id) throw new Error("You cannot remove yourself.");
      if (configured() && client) {
        return rpcWrite("remove_team_person", { partner: partnerId }, "Could not remove this person.");
      }
      var store = localStore();
      var partner = store.users[partnerId];
      if (!partner) throw new Error("Partner not found.");
      if (partner.is_super_admin || partner.is_hub_admin) {
        throw new Error("Cannot remove an admin this way.");
      }
      var nextSponsor = partner.sponsor_id || null;
      Object.keys(store.users).forEach(function (id) {
        var u = store.users[id];
        if (!u) return;
        if (u.sponsor_id === partnerId) u.sponsor_id = nextSponsor;
        if (u.invited_by_id === partnerId) u.invited_by_id = null;
      });
      if (!store.blockedEmails) store.blockedEmails = [];
      var email = String(partner.email || "").trim().toLowerCase();
      if (email && store.blockedEmails.indexOf(email) < 0) store.blockedEmails.push(email);
      delete store.users[partnerId];
      localSave(store);
      return { ok: true, partner_id: partnerId, email: email };
    },

    setHubAdmin: async function (partnerId, enabled) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (partnerId === sessionUser.id) {
        throw new Error("You already have super admin access.");
      }
      if (configured() && client) {
        var { data, error } = await client.rpc("set_hub_admin", {
          partner: partnerId,
          enabled: !!enabled
        });
        if (error) throw error;
        return data;
      }
      var store = localStore();
      var partner = store.users[partnerId];
      if (!partner) throw new Error("Partner not found.");
      if (partner.is_super_admin) throw new Error("Cannot change hub-admin flag on a super admin.");
      partner.is_hub_admin = !!enabled;
      if (enabled) partner.is_org_admin = true;
      store.users[partnerId] = partner;
      localSave(store);
      return { partner_id: partnerId, is_hub_admin: !!enabled };
    },

    sendEvent: async function (partnerId, kind, body) {
      if (!sessionUser) throw new Error("Sign in first.");
      if ((kind === "cheer" || kind === "nudge") && !Cloud.canSendCheerOrNote()) {
        throw new Error(Cloud.packIsEvergreen() ? "Evergreen Admin only." : "Not allowed.");
      }
      if (configured() && client) {
        var { data, error } = await client.from("team_events").insert({
          sponsor_id: sessionUser.id,
          partner_id: partnerId,
          kind: kind,
          body: body || ""
        }).select("id").maybeSingle();
        if (error) throw error;
        /* Push fires from the team_events trigger — never from the browser. */
        return { id: data && data.id };
      }
      var store = localStore();
      var partner = store.users[partnerId];
      if (!partner) throw new Error("Partner not found.");
      if (!partner.progress) partner.progress = blankProgress();
      if (!partner.progress.cheers) partner.progress.cheers = [];
      if (kind === "cheer" || kind === "nudge" || kind === "notify") {
        partner.progress.cheers.unshift({
          from: sessionUser.display_name,
          body: body,
          kind: kind,
          at: new Date().toISOString(),
          read: false
        });
        partner.progress.cheers = partner.progress.cheers.slice(0, 20);
      }
      store.users[partnerId] = partner;
      localSave(store);
    },

    /* Partner → sponsor: sync progress + leave a ping on their card */
    notifySponsor: async function (stateSlice) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!sessionUser.sponsor_id) throw new Error("No leader linked.");
      await Cloud.pushProgress(stateSlice || {});
      var at = new Date().toISOString();
      if (configured() && client) {
        await client.from("team_events").insert({
          sponsor_id: sessionUser.sponsor_id,
          partner_id: sessionUser.id,
          kind: "notify",
          body: "Shared progress from First Seeds"
        });
        var prog = await Cloud.pullProgress();
        var data = (prog && prog.data) || {};
        data._notified_at = at;
        await client.from("runway_progress").update({
          data: Object.assign({}, (prog && prog.data) || {}, { _notified_at: at })
        }).eq("partner_id", sessionUser.id);
      } else {
        var store = localStore();
        var u = store.users[sessionUser.id];
        if (!u.progress) u.progress = blankProgress();
        u.progress.notified_at = at;
        u.last_active_at = at;
        store.users[sessionUser.id] = u;
        localSave(store);
      }
    },

    saveLeaderNote: async function (partnerId, sectionId, body) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.canSendCheerOrNote()) {
        throw new Error(Cloud.packIsEvergreen() ? "Evergreen Admin only." : "Not allowed.");
      }
      sectionId = sectionId || "welcome";
      body = (body || "").trim();
      if (!body) throw new Error("Note is empty.");
      if (configured() && client) {
        var { error } = await client.from("leader_notes").upsert({
          sponsor_id: sessionUser.id,
          partner_id: partnerId,
          section_id: sectionId,
          body: body
        }, { onConflict: "sponsor_id,partner_id,section_id" });
        if (error) throw error;
        return { ok: true };
      }
      var store = localStore();
      var partner = store.users[partnerId];
      if (!partner) throw new Error("Partner not found.");
      if (!partner.leader_notes) partner.leader_notes = [];
      var found = false;
      partner.leader_notes.forEach(function (n) {
        if (n.section_id === sectionId && n.sponsor_id === sessionUser.id) {
          n.body = body;
          n.updated_at = new Date().toISOString();
          found = true;
        }
      });
      if (!found) {
        partner.leader_notes.push({
          sponsor_id: sessionUser.id,
          partner_id: partnerId,
          section_id: sectionId,
          body: body,
          updated_at: new Date().toISOString()
        });
      }
      store.users[partnerId] = partner;
      localSave(store);
      return { ok: true };
    },

    myLeaderNotes: async function () {
      if (!sessionUser) return [];
      if (configured() && client) {
        var { data } = await client.from("leader_notes")
          .select("section_id, body, created_at")
          .eq("partner_id", sessionUser.id)
          .order("created_at", { ascending: false });
        return data || [];
      }
      var u = localUserFromId(sessionUser.id);
      return (u && u.leader_notes) || [];
    },

    unreadCheers: async function () {
      if (!sessionUser) return [];
      if (configured() && client) {
        var { data, error } = await client.from("team_events")
          .select("id, body, created_at")
          .eq("partner_id", sessionUser.id)
          .eq("kind", "cheer")
          .is("read_at", null)
          .order("created_at", { ascending: false })
          .limit(10);
        if (error) throw error;
        return (data || []).map(function (row) {
          return {
            id: row.id,
            body: row.body || "",
            at: row.created_at,
            from: "your leader"
          };
        });
      }
      var prog = await Cloud.pullProgress();
      return ((prog && prog.cheers) || []).filter(function (c) {
        return c && c.kind !== "notify" && !c.read;
      });
    },

    /* Cheers (and notes when available) you've sent to partners — for mentor history UI */
    listOutreachMap: async function (partnerIds) {
      var map = {};
      (partnerIds || []).forEach(function (id) { map[id] = []; });
      if (!sessionUser || !(partnerIds || []).length) return map;

      function pushItem(partnerId, item) {
        if (!map[partnerId]) map[partnerId] = [];
        map[partnerId].push(item);
      }

      if (configured() && client) {
        var { data: events } = await client.from("team_events")
          .select("partner_id, kind, body, created_at")
          .eq("sponsor_id", sessionUser.id)
          .in("partner_id", partnerIds)
          .in("kind", ["cheer", "nudge"])
          .order("created_at", { ascending: false })
          .limit(200);
        (events || []).forEach(function (ev) {
          pushItem(ev.partner_id, {
            kind: ev.kind === "nudge" ? "nudge" : "cheer",
            body: ev.body || "",
            at: ev.created_at
          });
        });
        var { data: notes } = await client.from("leader_notes")
          .select("partner_id, body, created_at")
          .eq("sponsor_id", sessionUser.id)
          .in("partner_id", partnerIds);
        (notes || []).forEach(function (n) {
          if (!(n.body || "").trim()) return;
          pushItem(n.partner_id, {
            kind: "note",
            body: n.body || "",
            at: n.created_at
          });
        });
      } else {
        var store = localStore();
        partnerIds.forEach(function (id) {
          var u = store.users[id];
          if (!u) return;
          ((u.progress && u.progress.cheers) || []).forEach(function (c) {
            if (c.kind === "notify") return;
            pushItem(id, {
              kind: c.kind === "nudge" ? "nudge" : "cheer",
              body: c.body || "",
              at: c.at || ""
            });
          });
          (u.leader_notes || []).forEach(function (n) {
            if (n.sponsor_id && n.sponsor_id !== sessionUser.id) return;
            if (!(n.body || "").trim()) return;
            pushItem(id, {
              kind: "note",
              body: n.body || "",
              at: n.updated_at || n.created_at || ""
            });
          });
        });
      }

      Object.keys(map).forEach(function (id) {
        map[id].sort(function (a, b) {
          return String(b.at || "").localeCompare(String(a.at || ""));
        });
        map[id] = map[id].slice(0, 20);
      });
      return map;
    },

    clearCheers: async function () {
      if (!sessionUser) return;
      if (configured() && client) {
        await client.from("team_events")
          .update({ read_at: new Date().toISOString() })
          .eq("partner_id", sessionUser.id)
          .eq("kind", "cheer")
          .is("read_at", null);
        return;
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      if (u && u.progress && u.progress.cheers) {
        u.progress.cheers = (u.progress.cheers || []).map(function (c) {
          return Object.assign({}, c, { read: true });
        });
        store.users[sessionUser.id] = u;
        localSave(store);
      }
    },

    exportBundle: async function () {
      /* Evergreen handoff JSON */
      var me = sessionUser;
      var progress = await Cloud.pullProgress();
      var downline = await Cloud.listDownline();
      return {
        version: 1,
        exported_at: new Date().toISOString(),
        product: "first-seeds-bridge",
        profile: me,
        runway_progress: progress,
        sponsorships: downline.map(function (row) {
          return {
            partner: row.profile,
            progress: row.progress
          };
        })
      };
    },

    /* ── personal lead pages ───────────────────────────── */
    slugifyName: function (name) {
      var raw = (name || "").toLowerCase();
      try { raw = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) {}
      var s = raw
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 30);
      return s || "friend";
    },

    leadUrl: function (slug) {
      if (sessionIsEvergreen()) return "";
      if (!(groveCopiesPrettyLinks() || sessionIsGrove() || groveShareDoor())) return "";
      var key = encodeURIComponent(slug || "");
      if (!key) return "";
      /* Lead pages are Grove-only. After the hop, hostname is github.io —
         never build a share from the current origin. */
      var leadBase = grovePublicLeadBase();
      var glue = leadBase.indexOf("?") >= 0 ? "&" : "?";
      return leadBase + glue + "p=" + key + "#p=" + key;
    },

    groveSiteUrl: function () {
      if (sessionIsEvergreen()) return "";
      if (!(groveCopiesPrettyLinks() || sessionIsGrove() || groveShareDoor())) return "";
      var base = (window.FS.CONFIG && window.FS.CONFIG.groveSiteUrl) ||
        "https://thefreshgrove.team/";
      if (base.charAt(base.length - 1) !== "/") base += "/";
      return base;
    },

    groveWithUrl: function (slug) {
      var base = Cloud.groveSiteUrl();
      if (!base) return "";
      var key = encodeURIComponent(slug || "");
      return base + "?with=" + key + "#with=" + key;
    },

    groveDoorEligibility: async function () {
      if (!sessionUser) throw new Error("Sign in first.");
      if (configured() && client) {
        var { data, error } = await client.rpc("grove_door_eligibility");
        if (error) throw error;
        return data || {};
      }
      return {
        visible: !!sessionUser.show_on_grove_door,
        can_on: false,
        sprout_done: false,
        has_teammate: false,
        has_ig: !!(sessionUser.instagram && String(sessionUser.instagram).trim()),
        has_slug: !!(sessionUser.lead_slug && String(sessionUser.lead_slug).trim()),
        founding_pair: false,
        instagram: sessionUser.instagram || ""
      };
    },

    setGroveInstagram: async function (handle) {
      if (!sessionUser) throw new Error("Sign in first.");
      handle = normalizeGroveIg(handle);
      if (configured() && client) {
        var { data, error } = await client.rpc("set_grove_instagram", { p_ig: handle });
        if (error) throw error;
        sessionUser.instagram = data || "";
        emit("auth", sessionUser);
        return sessionUser.instagram;
      }
      sessionUser.instagram = handle;
      return sessionUser.instagram;
    },

    grovePhotoUrl: function (person, kind) {
      if (!person || !person.id || !person.photo_at) return "";
      var cfg = window.FS.SUPABASE || {};
      if (!cfg.url) return "";
      var file = (kind === "full" ? "full." : "thumb.") + photoExtOf(person);
      var stamp = encodeURIComponent(String(person.photo_at));
      return String(cfg.url).replace(/\/$/, "") +
        "/storage/v1/object/public/grove-avatars/" + person.id + "/" + file + "?v=" + stamp;
    },

    uploadGrovePhoto: async function (file, crop) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!sessionIsGrove()) throw new Error("Photos are for The Fresh Grove.");
      if (!configured() || !client) throw new Error("Sign in on the live hub to add a photo.");
      var prepared = await compressGrovePhoto(file, crop);
      var prefix = sessionUser.id + "/";
      var opts = { upsert: true, cacheControl: "3600" };
      var thumbRes = await client.storage.from("grove-avatars").upload(
        prefix + "thumb." + prepared.ext,
        prepared.thumb,
        Object.assign({}, opts, { contentType: prepared.thumb.type || (prepared.ext === "jpg" ? "image/jpeg" : "image/webp") })
      );
      if (thumbRes.error) throw thumbRes.error;
      var fullRes = await client.storage.from("grove-avatars").upload(
        prefix + "full." + prepared.ext,
        prepared.full,
        Object.assign({}, opts, { contentType: prepared.full.type || (prepared.ext === "jpg" ? "image/jpeg" : "image/webp") })
      );
      if (fullRes.error) throw fullRes.error;
      var { data, error } = await client.rpc("set_grove_photo", { p_ext: prepared.ext });
      if (error) throw error;
      sessionUser.photo_at = data || new Date().toISOString();
      sessionUser.photo_ext = prepared.ext;
      return { user: sessionUser, preview: prepared.full };
    },

    clearGrovePhoto: async function () {
      if (!sessionUser) throw new Error("Sign in first.");
      if (configured() && client) {
        try {
          await client.storage.from("grove-avatars").remove([
            sessionUser.id + "/thumb.webp",
            sessionUser.id + "/full.webp",
            sessionUser.id + "/thumb.jpg",
            sessionUser.id + "/full.jpg"
          ]);
        } catch (eRm) {}
        var { error } = await client.rpc("clear_grove_photo");
        if (error) throw error;
      }
      sessionUser.photo_at = null;
      sessionUser.photo_ext = "webp";
      return sessionUser;
    },

    groveShareFrameUrl: function (share, index, kind) {
      if (!share || !share.id || !share.created_by || !share.frame_count) return "";
      var n = Number(index) || 1;
      if (n < 1 || n > Number(share.frame_count || 0)) return "";
      var cfg = window.FS.SUPABASE || {};
      if (!cfg.url) return "";
      var ext = share.frame_ext === "jpg" ? "jpg" : "webp";
      var file = padFrame(n) + "-" + (kind === "full" ? "full" : "thumb") + "." + ext;
      var stamp = encodeURIComponent(String(share.created_at || ""));
      return String(cfg.url).replace(/\/$/, "") +
        "/storage/v1/object/public/grove-content/" + share.created_by + "/" + share.id + "/" + file +
        (stamp ? "?v=" + stamp : "");
    },

    listGroveShares: async function () {
      if (!sessionUser || !sessionIsGrove()) return [];
      if (!configured() || !client) return [];
      var { data, error } = await client.rpc("list_grove_shares");
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },

    createGroveShare: async function (fields, files) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!sessionIsGrove()) throw new Error("Sharing is for The Fresh Grove.");
      if (!configured() || !client) throw new Error("Sign in on the live hub to share.");
      var title = String((fields && fields.title) || "").trim();
      var caption = String((fields && fields.caption) || "").trim();
      var hook = String((fields && fields.hook) || "").trim();
      var format = String((fields && fields.format) || "").trim();
      var promoting = String((fields && fields.promoting) || "").trim();
      var contentType = String((fields && fields.content_type) || "").trim();
      var { data: shareId, error } = await client.rpc("create_grove_share", {
        p_title: title,
        p_caption: caption,
        p_hook: hook,
        p_format: format,
        p_promoting: promoting,
        p_content_type: contentType
      });
      if (error) throw error;
      var id = "";
      if (typeof shareId === "string") id = shareId;
      else if (shareId && typeof shareId === "object") {
        id = String(shareId.id || shareId.create_grove_share || "");
      } else if (shareId) id = String(shareId);
      if (!id) throw new Error("Couldn’t create that share.");
      var list = (files || []).slice(0, 8);
      var ext = "webp";
      var count = 0;
      for (var i = 0; i < list.length; i++) {
        var prepared = await compressGroveFrame(list[i]);
        if (i === 0) ext = prepared.ext;
        var prefix = sessionUser.id + "/" + id + "/";
        var n = padFrame(i + 1);
        var opts = { upsert: true, cacheControl: "3600" };
        var thumbRes = await client.storage.from("grove-content").upload(
          prefix + n + "-thumb." + ext,
          prepared.thumb,
          Object.assign({}, opts, { contentType: prepared.thumb.type || (ext === "jpg" ? "image/jpeg" : "image/webp") })
        );
        if (thumbRes.error) throw thumbRes.error;
        var fullRes = await client.storage.from("grove-content").upload(
          prefix + n + "-full." + ext,
          prepared.full,
          Object.assign({}, opts, { contentType: prepared.full.type || (ext === "jpg" ? "image/jpeg" : "image/webp") })
        );
        if (fullRes.error) throw fullRes.error;
        count++;
      }
      if (count) {
        var framed = await client.rpc("set_grove_share_frames", {
          p_share: id,
          p_count: count,
          p_ext: ext
        });
        if (framed.error) throw framed.error;
      }
      return id;
    },

    hideGroveShare: async function (shareId, hidden) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!configured() || !client) throw new Error("Sign in on the live hub.");
      var { error } = await client.rpc("hide_grove_share", {
        p_share: shareId,
        p_hidden: !!hidden
      });
      if (error) throw error;
      return true;
    },

    approveGroveShare: async function (shareId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!configured() || !client) throw new Error("Sign in on the live hub.");
      var { error } = await client.rpc("approve_grove_share", { p_share: shareId });
      if (error) throw error;
      return true;
    },

    updateGroveShare: async function (shareId, fields) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!configured() || !client) throw new Error("Sign in on the live hub.");
      var { error } = await client.rpc("update_grove_share", {
        p_share: shareId,
        p_title: String((fields && fields.title) || "").trim(),
        p_caption: String((fields && fields.caption) || "").trim(),
        p_hook: String((fields && fields.hook) || "").trim(),
        p_format: String((fields && fields.format) || "").trim(),
        p_promoting: String((fields && fields.promoting) || "").trim(),
        p_content_type: String((fields && fields.content_type) || "").trim()
      });
      if (error) throw error;
      return true;
    },

    listAppBulletins: async function (pack) {
      if (!configured() || !client) return null;
      var { data, error } = await client.rpc("list_app_bulletins", {
        p_pack: pack === "evergreen" ? "evergreen" : "grove"
      });
      if (error) throw error;
      var rows = data;
      if (typeof rows === "string") {
        try { rows = JSON.parse(rows); } catch (eParse) { rows = []; }
      }
      return Array.isArray(rows) ? rows : [];
    },

    createAppBulletin: async function (fields) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (!configured() || !client) throw new Error("Sign in on the live hub to post a bulletin.");
      var { data, error } = await client.rpc("create_app_bulletin", {
        p_body: String((fields && fields.body) || "").trim(),
        p_go: String((fields && fields.go) || "").trim(),
        p_cta: String((fields && fields.cta) || "").trim(),
        p_focus: String((fields && fields.focus) || "").trim(),
        p_pack: String((fields && fields.pack) || "grove")
      });
      if (error) throw error;
      if (typeof data === "string") return data;
      if (data && typeof data === "object") {
        return String(data.id || data.create_app_bulletin || "") || null;
      }
      return data ? String(data) : null;
    },

    deleteAppBulletin: async function (id) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (!configured() || !client) throw new Error("Sign in on the live hub.");
      var { error } = await client.rpc("delete_app_bulletin", { p_id: id });
      if (error) throw error;
      return true;
    },

    listVaultEdits: async function () {
      if (!configured() || !client) return [];
      var { data, error } = await client.rpc("list_vault_edits");
      if (error) throw error;
      var rows = data;
      if (typeof rows === "string") {
        try { rows = JSON.parse(rows); } catch (eParse) { rows = []; }
      }
      return Array.isArray(rows) ? rows : [];
    },

    saveVaultEdit: async function (vaultId, patch) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (!configured() || !client) throw new Error("Sign in on the live hub to save vault edits.");
      var { error } = await client.rpc("save_vault_edit", {
        p_vault_id: String(vaultId || "").trim(),
        p_patch: patch || {}
      });
      if (error) throw error;
      return true;
    },

    clearVaultEdit: async function (vaultId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (!configured() || !client) throw new Error("Sign in on the live hub.");
      var { error } = await client.rpc("clear_vault_edit", {
        p_vault_id: String(vaultId || "").trim()
      });
      if (error) throw error;
      return true;
    },

    setGroveDoorVisible: async function (on) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (configured() && client) {
        var { data, error } = await client.rpc("set_grove_door_visible", { p_on: !!on });
        if (error) throw error;
        if (data && data.visible != null) sessionUser.show_on_grove_door = !!data.visible;
        if (data && data.instagram != null) sessionUser.instagram = data.instagram;
        emit("auth", sessionUser);
        return data || {};
      }
      sessionUser.show_on_grove_door = !!on;
      return Cloud.groveDoorEligibility();
    },

    ensureLeadSlug: async function (preferredName) {
      if (!sessionUser) throw new Error("Sign in to get your lead page.");
      /* Re-read profile so a stale session never invents a second slug over the real one */
      if (configured() && client) {
        try {
          var { data: fresh } = await client
            .from("profiles")
            .select("lead_slug, lead_blurb, lead_thanks, email, display_name, last_name, instagram, show_on_grove_door")
            .eq("id", sessionUser.id)
            .single();
          if (fresh) {
            if (fresh.lead_slug) sessionUser.lead_slug = fresh.lead_slug;
            if (fresh.lead_blurb != null) sessionUser.lead_blurb = fresh.lead_blurb;
            if (fresh.lead_thanks != null) sessionUser.lead_thanks = fresh.lead_thanks;
            if (fresh.email) sessionUser.email = fresh.email;
            if (fresh.display_name) sessionUser.display_name = fresh.display_name;
            if (fresh.last_name != null) sessionUser.last_name = fresh.last_name;
            if (fresh.instagram != null) sessionUser.instagram = fresh.instagram;
            if (fresh.show_on_grove_door != null) sessionUser.show_on_grove_door = !!fresh.show_on_grove_door;
          }
        } catch (e) {}
      }
      if (sessionUser.lead_slug) return sessionUser.lead_slug;
      var firstRaw = String(preferredName || sessionUser.display_name || "friend").trim().split(/\s+/)[0] || "friend";
      var first = Cloud.slugifyName(firstRaw);
      var last = Cloud.slugifyName(sessionUser.last_name || "");
      try {
        return await Cloud.claimLeadSlug(first, { allowSuffix: false });
      } catch (eFirst) {
        if (last && last !== first) {
          var combo = Cloud.slugifyName(first + "-" + last);
          try {
            return await Cloud.claimLeadSlug(combo, { allowSuffix: false });
          } catch (eLast) {
            return await Cloud.claimLeadSlug(combo, { allowSuffix: true });
          }
        }
        return await Cloud.claimLeadSlug(first, { allowSuffix: true });
      }
    },

    claimLeadSlug: async function (desired, opts) {
      if (!sessionUser) throw new Error("Sign in first.");
      desired = Cloud.slugifyName(desired);
      var allowSuffix = !!(opts && opts.allowSuffix);
      if (configured() && client) {
        var { data, error } = await client.rpc("claim_lead_slug", {
          desired: desired,
          allow_suffix: allowSuffix
        });
        if (error) throw error;
        sessionUser.lead_slug = data;
        emit("auth", sessionUser);
        return data;
      }
      var store = localStore();
      if (!store.slugAliases) store.slugAliases = {};
      var me = store.users[sessionUser.id];
      var current = (me && me.lead_slug) || "";
      if ((!desired || desired === "friend") && current && current.length >= 2) {
        sessionUser = Cloud._publicUser(me);
        return current;
      }
      var base = desired;
      var candidate = base;
      var n = 2;
      function taken(slug) {
        var aliasOwner = store.slugAliases[slug];
        if (aliasOwner && aliasOwner !== sessionUser.id) return true;
        return Object.keys(store.users).some(function (id) {
          var u = store.users[id];
          return u && u.id !== sessionUser.id && (u.lead_slug || "").toLowerCase() === slug;
        });
      }
      if (allowSuffix) {
        while (taken(candidate)) {
          candidate = base + "-" + n;
          n++;
          if (n > 99) {
            candidate = base + "-" + makeCode().slice(0, 4);
            break;
          }
        }
      } else if (taken(candidate)) {
        throw new Error("That link is already in use — try another.");
      }
      if (current && current.length >= 2 && current !== candidate) {
        store.slugAliases[current] = sessionUser.id;
      }
      store.slugAliases[candidate] = sessionUser.id;
      me.lead_slug = candidate;
      store.users[sessionUser.id] = me;
      localSave(store);
      sessionUser = Cloud._publicUser(me);
      emit("auth", sessionUser);
      return candidate;
    },

    setLeadBlurb: async function (blurb) {
      if (!sessionUser) throw new Error("Sign in first.");
      blurb = ((blurb || "") + "").trim().slice(0, 280);
      return Cloud.updateProfile({ lead_blurb: blurb });
    },

    setLeadPageCopy: async function (blurb, thanks) {
      if (!sessionUser) throw new Error("Sign in first.");
      blurb = ((blurb || "") + "").trim().slice(0, 280);
      thanks = ((thanks || "") + "").trim().slice(0, 280);
      return Cloud.updateProfile({ lead_blurb: blurb, lead_thanks: thanks });
    },

    getLeadPage: async function (slug) {
      slug = (slug || "").trim().toLowerCase();
      if (!slug) return null;
      if (configured() && client) {
        var { data, error } = await client.rpc("get_lead_page", { p_slug: slug });
        if (error) throw error;
        return data || null;
      }
      var store = localStore();
      var found = null;
      var ownerId = null;
      Object.keys(store.users).forEach(function (id) {
        var u = store.users[id];
        if (u && (u.lead_slug || "").toLowerCase() === slug) ownerId = id;
      });
      if (!ownerId && store.slugAliases && store.slugAliases[slug]) {
        ownerId = store.slugAliases[slug];
      }
      if (ownerId && store.users[ownerId]) {
        var u = store.users[ownerId];
        found = {
          slug: u.lead_slug || slug,
          display_name: u.display_name,
          blurb: u.lead_blurb || "",
          thanks: u.lead_thanks || ""
        };
      }
      return found;
    },

    submitLead: async function (slug, payload) {
      slug = (slug || "").trim().toLowerCase();
      var name = ((payload && payload.name) || "").trim();
      var email = ((payload && payload.email) || "").trim().toLowerCase();
      var phone = ((payload && payload.phone) || "").trim();
      var ig = String((payload && payload.ig) || "").trim().replace(/^@+/, "");
      if (ig.length > 80) ig = ig.slice(0, 80);
      var interest = ((payload && payload.interest) || "").trim().toLowerCase();
      if (!slug) throw new Error("Page not found.");
      if (name.length < 2) throw new Error("Please enter your name.");
      if (["products", "business", "both"].indexOf(interest) < 0) {
        throw new Error("Pick what you’re interested in.");
      }
      if (!email && !phone) throw new Error("Add an email or a phone number.");
      if (email && email.indexOf("@") < 1) throw new Error("That email doesn’t look right.");

      if (configured() && client) {
        var args = {
          p_slug: slug,
          p_name: name,
          p_email: email,
          p_phone: phone,
          p_interest: interest,
          p_hp: ((payload && payload.hp) || "") + "",
          p_source: ((payload && payload.source) || "page") + "",
          p_ig: ig
        };
        var rpc = await client.rpc("submit_lead", args);
        if (rpc.error && ig) {
          delete args.p_ig;
          rpc = await client.rpc("submit_lead", args);
        }
        if (rpc.error) throw rpc.error;
        return { id: rpc.data };
      }

      var store = localStore();
      var ownerId = null;
      Object.keys(store.users).forEach(function (id) {
        if ((store.users[id].lead_slug || "").toLowerCase() === slug) ownerId = id;
      });
      if (!ownerId && store.slugAliases && store.slugAliases[slug]) {
        ownerId = store.slugAliases[slug];
      }
      if (!ownerId) throw new Error("Page not found.");
      if (!store.leads) store.leads = {};
      if (!store.leads[ownerId]) store.leads[ownerId] = [];
      var id = "lead_" + makeCode();
      store.leads[ownerId].unshift({
        id: id,
        partner_id: ownerId,
        owner_email: (store.users[ownerId] && store.users[ownerId].email) || "",
        name: name,
        email: email,
        phone: phone,
        ig: ig,
        interest: interest,
        notes: "",
        follow_up: null,
        hot: false,
        fresh_match: false,
        status: "new",
        source_slug: slug,
        source: ((payload && payload.source) || "page"),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localSave(store);
      return { id: id };
    },

    listMyLeads: async function () {
      if (!sessionUser || !sessionUser.id) return [];
      var myId = sessionUser.id;
      if (configured() && client) {
        var data = await fetchPaged(function (from, to) {
          return client
            .from("leads")
            .select("*")
            .eq("partner_id", myId)
            .order("created_at", { ascending: false })
            .range(from, to);
        }, 200);
        return (data || []).filter(function (row) {
          return row && row.partner_id === myId;
        });
      }
      var store = localStore();
      return ((store.leads && store.leads[myId]) || []).filter(function (row) {
        return !row.partner_id || row.partner_id === myId;
      }).slice();
    },

    updateLeadStatus: async function (leadId, status) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (["new", "reached", "talking", "fb", "done", "joined", "archived"].indexOf(status) < 0) {
        throw new Error("Unknown status.");
      }
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ status: status })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var store = localStore();
      var list = (store.leads && store.leads[sessionUser.id]) || [];
      var found = null;
      list.forEach(function (row) {
        if (row.id === leadId) {
          row.status = status;
          row.updated_at = new Date().toISOString();
          found = row;
        }
      });
      if (!found) throw new Error("Lead not found.");
      store.leads[sessionUser.id] = list;
      localSave(store);
      return found;
    },

    updateLeadInterest: async function (leadId, interest) {
      if (!sessionUser) throw new Error("Sign in first.");
      interest = String(interest || "").trim().toLowerCase();
      if (["products", "business", "both"].indexOf(interest) < 0) {
        throw new Error("Pick products, business, or both.");
      }
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ interest: interest })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var storeI = localStore();
      var listI = (storeI.leads && storeI.leads[sessionUser.id]) || [];
      var foundI = null;
      listI.forEach(function (row) {
        if (row.id === leadId) {
          row.interest = interest;
          row.updated_at = new Date().toISOString();
          foundI = row;
        }
      });
      if (!foundI) throw new Error("Lead not found.");
      storeI.leads[sessionUser.id] = listI;
      localSave(storeI);
      return foundI;
    },

    updateLeadNotes: async function (leadId, notes) {
      if (!sessionUser) throw new Error("Sign in first.");
      notes = String(notes == null ? "" : notes).slice(0, 2000);
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ notes: notes })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var store = localStore();
      var list = (store.leads && store.leads[sessionUser.id]) || [];
      var found = null;
      list.forEach(function (row) {
        if (row.id === leadId) {
          row.notes = notes;
          row.updated_at = new Date().toISOString();
          found = row;
        }
      });
      if (!found) throw new Error("Lead not found.");
      store.leads[sessionUser.id] = list;
      localSave(store);
      return found;
    },

    updateLeadName: async function (leadId, name) {
      if (!sessionUser) throw new Error("Sign in first.");
      name = String(name == null ? "" : name).trim().replace(/\s+/g, " ").slice(0, 120);
      if (!name) throw new Error("Add a name.");
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ name: name })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var store2 = localStore();
      var list2 = (store2.leads && store2.leads[sessionUser.id]) || [];
      var found2 = null;
      list2.forEach(function (row) {
        if (row.id === leadId) {
          row.name = name;
          row.updated_at = new Date().toISOString();
          found2 = row;
        }
      });
      if (!found2) throw new Error("Lead not found.");
      store2.leads[sessionUser.id] = list2;
      localSave(store2);
      return found2;
    },

    deleteLead: async function (leadId) {
      if (!sessionUser) throw new Error("Sign in first.");
      leadId = String(leadId || "").trim();
      if (!leadId) throw new Error("Lead not found.");
      if (configured() && client) {
        var { error } = await client.rpc("delete_own_lead", { p_id: leadId });
        if (error) throw error;
        return { id: leadId };
      }
      var storeDel = localStore();
      var listDel = (storeDel.leads && storeDel.leads[sessionUser.id]) || [];
      var nextDel = listDel.filter(function (row) { return row && row.id !== leadId; });
      if (nextDel.length === listDel.length) throw new Error("Lead not found.");
      storeDel.leads[sessionUser.id] = nextDel;
      localSave(storeDel);
      return { id: leadId };
    },

    patchOwnLead: async function (leadId, fields) {
      if (!sessionUser) throw new Error("Sign in first.");
      leadId = String(leadId || "").trim();
      if (!leadId) throw new Error("Lead not found.");
      var allowed = [
        "name", "email", "phone", "ig", "interest", "status", "notes",
        "visitor_notes", "hot", "fresh_match", "follow_up"
      ];
      var patch = {};
      allowed.forEach(function (key) {
        if (fields && Object.prototype.hasOwnProperty.call(fields, key)) patch[key] = fields[key];
      });
      if (!Object.keys(patch).length) throw new Error("Nothing to update.");
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update(patch)
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var storeP = localStore();
      var listP = (storeP.leads && storeP.leads[sessionUser.id]) || [];
      var foundP = null;
      listP.forEach(function (row) {
        if (row && row.id === leadId) {
          Object.assign(row, patch, { updated_at: new Date().toISOString() });
          foundP = row;
        }
      });
      if (!foundP) throw new Error("Lead not found.");
      storeP.leads[sessionUser.id] = listP;
      localSave(storeP);
      return foundP;
    },

    mergeOwnLeads: async function (keepId, dropIds) {
      if (!sessionUser) throw new Error("Sign in first.");
      keepId = String(keepId || "").trim();
      dropIds = (dropIds || []).map(function (id) { return String(id || "").trim(); }).filter(Boolean);
      if (!keepId || !dropIds.length) throw new Error("Nothing to combine.");
      if (dropIds.indexOf(keepId) >= 0) throw new Error("Cannot combine a card into itself.");

      function interestMerge(a, b) {
        a = String(a || "").toLowerCase();
        b = String(b || "").toLowerCase();
        if (a === "both" || b === "both") return "both";
        if ((a === "products" && b === "business") || (a === "business" && b === "products")) return "both";
        if (b && !a) return b;
        return a || b;
      }
      function statusRank(s) {
        return { new: 1, reached: 2, talking: 3, fb: 4, done: 5, joined: 6 }[s] || 0;
      }
      function joinUnique(a, b, max) {
        a = String(a || "").trim();
        b = String(b || "").trim();
        if (!b) return a;
        if (!a) return b.slice(0, max);
        if (a.indexOf(b) >= 0) return a.slice(0, max);
        return (a + "\n" + b).slice(0, max);
      }

      if (configured() && client) {
        var rpc = await client.rpc("merge_own_leads", { p_keep: keepId, p_drop: dropIds });
        if (!rpc.error && rpc.data) {
          var row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
          if (row) return row;
        }
        var missing = String((rpc.error && rpc.error.message) || "").toLowerCase();
        if (rpc.error && missing.indexOf("merge_own_leads") < 0 && missing.indexOf("schema cache") < 0 && missing.indexOf("could not find") < 0) {
          throw rpc.error;
        }
      }

      var mine = await Cloud.listMyLeads();
      var keep = null;
      var drops = [];
      mine.forEach(function (row) {
        if (!row) return;
        if (String(row.id) === keepId) keep = row;
        else if (dropIds.indexOf(String(row.id)) >= 0) drops.push(row);
      });
      if (!keep) throw new Error("Lead not found.");
      if (drops.length !== dropIds.length) throw new Error("Lead not found.");

      var next = {
        name: keep.name,
        email: keep.email || "",
        phone: keep.phone || "",
        ig: keep.ig || "",
        interest: keep.interest || "",
        status: keep.status || "new",
        notes: keep.notes || "",
        visitor_notes: keep.visitor_notes || "",
        hot: !!keep.hot,
        fresh_match: !!keep.fresh_match,
        follow_up: !!keep.follow_up
      };
      drops.forEach(function (row) {
        next.interest = interestMerge(next.interest, row.interest);
        if (statusRank(row.status) > statusRank(next.status)) next.status = row.status;
        if (String(row.name || "").trim().length > String(next.name || "").trim().length) next.name = row.name;
        if (!String(next.email || "").trim() && row.email) next.email = row.email;
        if (!String(next.phone || "").trim() && row.phone) next.phone = row.phone;
        if (!String(next.ig || "").trim() && row.ig) next.ig = row.ig;
        if (row.hot) next.hot = true;
        if (row.fresh_match) next.fresh_match = true;
        if (row.follow_up) next.follow_up = true;
        next.notes = joinUnique(next.notes, row.notes, 2000);
        next.visitor_notes = joinUnique(next.visitor_notes, row.visitor_notes, 400);
      });

      if (configured() && client) {
        try {
          var notes = await Cloud.listLeadEventNotes();
          for (var ni = 0; ni < notes.length; ni++) {
            var note = notes[ni];
            if (!note || dropIds.indexOf(String(note.lead_id)) < 0) continue;
            var keepNote = notes.filter(function (n) {
              return n && String(n.lead_id) === keepId &&
                String(n.event_id) === String(note.event_id) &&
                String(n.occurs_on) === String(note.occurs_on);
            })[0];
            var useStatus = note.status;
            if (keepNote && keepNote.status === "attended") useStatus = "attended";
            else if (keepNote && keepNote.status === "invited" && note.status !== "attended") useStatus = "invited";
            await Cloud.upsertLeadEventNote(keepId, note.event_id, note.occurs_on, useStatus || "invited");
          }
        } catch (eNotes) {}
      }

      var saved = await Cloud.patchOwnLead(keepId, next);
      for (var di = 0; di < dropIds.length; di++) {
        await Cloud.deleteLead(dropIds[di]);
      }
      return saved || Object.assign({}, keep, next, { id: keepId });
    },

    updateLeadFollowUp: async function (leadId, on) {
      if (!sessionUser) throw new Error("Sign in first.");
      on = !!on;
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ follow_up: on })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var store3 = localStore();
      var list3 = (store3.leads && store3.leads[sessionUser.id]) || [];
      var found3 = null;
      list3.forEach(function (row) {
        if (row.id === leadId) {
          row.follow_up = on;
          row.updated_at = new Date().toISOString();
          found3 = row;
        }
      });
      if (!found3) throw new Error("Lead not found.");
      store3.leads[sessionUser.id] = list3;
      localSave(store3);
      return found3;
    },

    updateLeadHot: async function (leadId, on) {
      if (!sessionUser) throw new Error("Sign in first.");
      on = !!on;
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ hot: on })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var storeH = localStore();
      var listH = (storeH.leads && storeH.leads[sessionUser.id]) || [];
      var foundH = null;
      listH.forEach(function (row) {
        if (row.id === leadId) {
          row.hot = on;
          row.updated_at = new Date().toISOString();
          foundH = row;
        }
      });
      if (!foundH) throw new Error("Lead not found.");
      storeH.leads[sessionUser.id] = listH;
      localSave(storeH);
      return foundH;
    },

    updateLeadFreshMatch: async function (leadId, on) {
      if (!sessionUser) throw new Error("Sign in first.");
      on = !!on;
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ fresh_match: on })
          .eq("id", leadId)
          .eq("partner_id", sessionUser.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      var storeQ = localStore();
      var listQ = (storeQ.leads && storeQ.leads[sessionUser.id]) || [];
      var foundQ = null;
      listQ.forEach(function (row) {
        if (row.id === leadId) {
          row.fresh_match = on;
          row.updated_at = new Date().toISOString();
          foundQ = row;
        }
      });
      if (!foundQ) throw new Error("Lead not found.");
      storeQ.leads[sessionUser.id] = listQ;
      localSave(storeQ);
      return foundQ;
    },

    addOwnLead: async function (payload) {
      if (!sessionUser) throw new Error("Sign in first.");
      var name = String((payload && payload.name) || "").trim().replace(/\s+/g, " ");
      var email = String((payload && payload.email) || "").trim().toLowerCase();
      var phone = String((payload && payload.phone) || "").trim();
      var ig = String((payload && payload.ig) || "").trim().replace(/^@+/, "");
      if (ig.length > 80) ig = ig.slice(0, 80);
      var interest = String((payload && payload.interest) || "").trim().toLowerCase();
      var status = String((payload && payload.status) || "talking").trim().toLowerCase();
      if (name.length < 2) throw new Error("Add their name.");
      if (["products", "business", "both"].indexOf(interest) < 0) {
        throw new Error("Pick products, business, or both.");
      }
      if (email && email.indexOf("@") < 1) throw new Error("That email doesn’t look right.");
      if (["new", "reached", "talking", "fb", "done", "joined", "archived"].indexOf(status) < 0) status = "talking";

      if (configured() && client) {
        var args = {
          p_name: name,
          p_email: email,
          p_phone: phone,
          p_interest: interest,
          p_status: status,
          p_ig: ig
        };
        var rpc = await client.rpc("add_own_lead", args);
        if (rpc.error) {
          delete args.p_ig;
          rpc = await client.rpc("add_own_lead", args);
        }
        if (!rpc.error && rpc.data) {
          var row = await client.from("leads").select("*").eq("id", rpc.data).eq("partner_id", sessionUser.id).maybeSingle();
          var saved = (!row.error && row.data) ? row.data : {
            id: rpc.data, name: name, email: email, phone: phone, ig: ig,
            interest: interest, status: status, source_slug: "manual"
          };
          if (ig && !saved.ig) {
            try {
              await client.from("leads").update({ ig: ig }).eq("id", saved.id).eq("partner_id", sessionUser.id);
              saved.ig = ig;
            } catch (eIg) {}
          }
          return saved;
        }
        var ins = await client.from("leads").insert({
          partner_id: sessionUser.id,
          name: name,
          email: email,
          phone: phone,
          ig: ig,
          interest: interest,
          status: status,
          source_slug: "manual",
          owner_email: sessionUser.email || "",
          notes: "",
          hot: false,
          source: "manual"
        }).select().single();
        if (!ins.error && ins.data) return ins.data;
        var slug = String(sessionUser.lead_slug || "").trim().toLowerCase();
        if (slug && (email || phone)) {
          var viaPage = await Cloud.submitLead(slug, {
            name: name,
            email: email,
            phone: phone,
            interest: interest
          });
          if (viaPage && viaPage.id) {
            try { return await Cloud.updateLeadStatus(viaPage.id, status); } catch (e2) {}
            return { id: viaPage.id, name: name, email: email, phone: phone, ig: ig, interest: interest, status: status, source_slug: slug };
          }
        }
        throw (rpc.error || ins.error || new Error("Could not add this lead."));
      }

      var storeM = localStore();
      if (!storeM.leads) storeM.leads = {};
      if (!storeM.leads[sessionUser.id]) storeM.leads[sessionUser.id] = [];
      var localId = "lead_" + makeCode();
      var localRow = {
        id: localId,
        partner_id: sessionUser.id,
        owner_email: sessionUser.email || "",
        name: name,
        email: email,
        phone: phone,
        ig: ig,
        interest: interest,
        notes: "",
        follow_up: null,
        hot: false,
        fresh_match: false,
        status: status,
        source_slug: "manual",
        source: "manual",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      storeM.leads[sessionUser.id].unshift(localRow);
      localSave(storeM);
      return localRow;
    },

    updateAllLeadFollowUps: async function (on) {
      if (!sessionUser) throw new Error("Sign in first.");
      on = !!on;
      if (configured() && client) {
        var { data, error } = await client
          .from("leads")
          .update({ follow_up: on })
          .eq("partner_id", sessionUser.id)
          .select();
        if (error) throw error;
        return data || [];
      }
      var store4 = localStore();
      var list4 = (store4.leads && store4.leads[sessionUser.id]) || [];
      list4.forEach(function (row) {
        row.follow_up = on;
        row.updated_at = new Date().toISOString();
      });
      store4.leads[sessionUser.id] = list4;
      localSave(store4);
      return list4.slice();
    },

    countNewLeads: async function () {
      var rows = await Cloud.listMyLeads();
      var n = 0;
      rows.forEach(function (r) { if (r.status === "new") n++; });
      return n;
    },

    /* ── Info Zoom guests (personal, per occurrence) ── */
    listLeadEventNotes: async function () {
      if (!sessionUser || !sessionUser.id) return [];
      var myId = sessionUser.id;
      if (configured() && client) {
        var { data, error } = await client
          .from("lead_event_notes")
          .select("*")
          .eq("partner_id", myId)
          .order("updated_at", { ascending: false });
        if (error) {
          if (isMissingLeadEventNotes(error)) return [];
          throw error;
        }
        return (data || []).filter(function (row) {
          return row && row.partner_id === myId;
        }).map(normalizeLeadEventNote);
      }
      var storeN = localStore();
      return ((storeN.leadEventNotes || []).filter(function (row) {
        return row && row.partner_id === myId;
      })).map(normalizeLeadEventNote);
    },

    upsertLeadEventNote: async function (leadId, eventId, occursOn, status) {
      if (!sessionUser) throw new Error("Sign in first.");
      leadId = String(leadId || "").trim();
      eventId = String(eventId || "").trim();
      occursOn = String(occursOn || "").trim().slice(0, 10);
      status = String(status || "").trim().toLowerCase();
      if (!leadId || !eventId || !/^\d{4}-\d{2}-\d{2}$/.test(occursOn)) {
        throw new Error("Could not save that Info Zoom note.");
      }
      if (status && status !== "invited" && status !== "attended") {
        throw new Error("Could not save that Info Zoom note.");
      }
      var myId = sessionUser.id;
      if (!status) {
        if (configured() && client) {
          var del = await client
            .from("lead_event_notes")
            .delete()
            .eq("partner_id", myId)
            .eq("lead_id", leadId)
            .eq("event_id", eventId)
            .eq("occurs_on", occursOn);
          if (del.error) {
            if (isMissingLeadEventNotes(del.error)) {
              throw new Error("Run supabase/leads-info-zoom.sql in the SQL editor to save Info Zoom guests.");
            }
            throw del.error;
          }
          return null;
        }
        var storeDel = localStore();
        storeDel.leadEventNotes = (storeDel.leadEventNotes || []).filter(function (row) {
          return !(row && row.partner_id === myId && String(row.lead_id) === leadId &&
            String(row.event_id) === eventId && noteOccursOn(row.occurs_on) === occursOn);
        });
        localSave(storeDel);
        return null;
      }
      var row = {
        partner_id: myId,
        lead_id: leadId,
        event_id: eventId,
        occurs_on: occursOn,
        status: status,
        updated_at: new Date().toISOString()
      };
      if (configured() && client) {
        var up = await client
          .from("lead_event_notes")
          .upsert(row, { onConflict: "lead_id,event_id,occurs_on" })
          .select()
          .single();
        if (up.error) {
          if (isMissingLeadEventNotes(up.error)) {
            throw new Error("Run supabase/leads-info-zoom.sql in the SQL editor to save Info Zoom guests.");
          }
          throw up.error;
        }
        return normalizeLeadEventNote(up.data);
      }
      var storeUp = localStore();
      if (!storeUp.leadEventNotes) storeUp.leadEventNotes = [];
      var found = null;
      storeUp.leadEventNotes.forEach(function (n, i) {
        if (n && n.partner_id === myId && String(n.lead_id) === leadId &&
          String(n.event_id) === eventId && noteOccursOn(n.occurs_on) === occursOn) {
          storeUp.leadEventNotes[i] = Object.assign({}, n, row);
          found = storeUp.leadEventNotes[i];
        }
      });
      if (!found) {
        row.id = "note_" + makeCode();
        row.created_at = row.updated_at;
        storeUp.leadEventNotes.unshift(row);
        found = row;
      }
      localSave(storeUp);
      return found;
    },

    /* ── Shared team calendar (Grove Gatherings + milestones) ── */
    invalidateOrgEventsNet: function () {
      orgEventsNet = { user: "", orgId: "", at: 0, raw: null, inflight: null };
    },

    invalidateTeamNet: function () {
      clearTeamNet();
    },

    canUseCabinetDesk: function () {
      if (!sessionUser) return false;
      if (Cloud.packIsEvergreen && Cloud.packIsEvergreen()) return false;
      if (sessionIsEvergreen()) return false;
      if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
        var slug = String(sessionUser.lead_slug || "").toLowerCase();
        return !slug || slug === "taylor";
      }
      if (!(Cloud.isOrgAdmin && Cloud.isOrgAdmin())) return false;
      if (sessionUser.org_slug === "fresh-grove") return true;
      return sameId(sessionUser.org_id, groveOrgId());
    },

    listOrgEvents: async function (opts) {
      function isLocalDownlineOf(viewerId, creatorId) {
        if (!viewerId || !creatorId || viewerId === creatorId) return false;
        var store = localStore();
        var walk = viewerId;
        var hop = 0;
        while (walk && hop < 32) {
          hop += 1;
          var u = store.users[walk];
          if (!u) return false;
          if (u.sponsor_id === creatorId) return true;
          walk = u.sponsor_id || "";
        }
        return false;
      }
      function visibleOrgEvents(list) {
        var me = sessionUser && sessionUser.id;
        var peekLeaderTeams = !!(opts && opts.includeLeaderTeamZooms && Cloud.isSuperAdmin());
        return (list || []).filter(function (ev) {
          if (!ev) return false;
          var aud = ev.audience || "org";
          if (aud === "self") return ev.created_by === me;
          if (aud === "downline") {
            if (ev.created_by === me) return true;
            /* Super admin can peek, but the main calendar stays on org-wide dates. */
            if (Cloud.isSuperAdmin() && !peekLeaderTeams) return false;
            if (configured() && client) return true;
            return isLocalDownlineOf(me, ev.created_by);
          }
          if (!ev.leader_only) return true;
          return !!(Cloud.isSuperAdmin() || Cloud.isHubAdmin() || Cloud.isOrgAdmin());
        });
      }
      async function loadRaw(orgId) {
        var user = (sessionUser && sessionUser.id) || "";
        var scope = String(orgId || "");
        if (orgEventsNet.inflight && orgEventsNet.user === user && orgEventsNet.orgId === scope) {
          return orgEventsNet.inflight;
        }
        if (orgEventsNet.raw && orgEventsNet.user === user && orgEventsNet.orgId === scope &&
            Date.now() - orgEventsNet.at < 90000) {
          return orgEventsNet.raw;
        }
        var work = (async function () {
          var q = client.from("org_events").select("*").order("starts_at", { ascending: true });
          if (orgId) q = q.eq("org_id", orgId);
          var { data, error } = await q;
          if (error) throw error;
          orgEventsNet.raw = data || [];
          orgEventsNet.at = Date.now();
          orgEventsNet.user = user;
          orgEventsNet.orgId = scope;
          orgEventsNet.inflight = null;
          return orgEventsNet.raw;
        })();
        orgEventsNet.user = user;
        orgEventsNet.orgId = scope;
        orgEventsNet.inflight = work;
        try {
          return await work;
        } catch (err) {
          if (orgEventsNet.inflight === work) orgEventsNet.inflight = null;
          throw err;
        }
      }
      var orgId = eventsScopeOrgId();
      if (!orgId && !(Cloud.isSuperAdmin && Cloud.isSuperAdmin())) {
        return visibleOrgEvents([]);
      }
      if (configured() && client) {
        return visibleOrgEvents(await loadRaw(orgId));
      }
      var store = localStore();
      var list = (store.orgEvents || []).slice();
      if (orgId) {
        list = list.filter(function (ev) {
          return ev && String(ev.org_id || "") === String(orgId);
        });
      }
      list.sort(function (a, b) {
        return String(a.starts_at || "").localeCompare(String(b.starts_at || ""));
      });
      return visibleOrgEvents(list);
    },

    upsertOrgEvent: async function (payload) {
      if (!sessionUser) throw new Error("Sign in first.");
      var existing = null;
      var audience = payload && payload.audience === "downline" ? "downline"
        : payload && payload.audience === "self" ? "self"
        : "org";
      if (payload && payload.id) {
        try {
          var listed = await Cloud.listOrgEvents();
          (listed || []).forEach(function (row) {
            if (row && row.id === payload.id) existing = row;
          });
        } catch (eExist) {}
        if (existing) {
          audience = existing.audience || audience;
          if (!Cloud.canManageOrgEvent(existing)) {
            throw new Error("Only people who run this calendar can edit it.");
          }
        } else if (audience === "org" && !Cloud.canEditCalendar()) {
          throw new Error("Only people who run this calendar can edit it.");
        } else if (audience === "downline" && !Cloud.canCreateDownlineZoom()) {
          throw new Error("Leaders only.");
        } else if (audience === "self" && !Cloud.canCreatePersonalEvent()) {
          throw new Error("Sign in first.");
        }
      } else if (audience === "org") {
        if (!Cloud.canEditCalendar()) throw new Error("Only people who run this calendar can edit it.");
      } else if (audience === "downline") {
        if (!Cloud.canCreateDownlineZoom()) throw new Error("Leaders only.");
      } else if (!Cloud.canCreatePersonalEvent()) {
        throw new Error("Sign in first.");
      }
      var kind = payload && payload.kind === "milestone" ? "milestone"
        : payload && payload.kind === "in_person" ? "in_person"
        : payload && payload.kind === "info_zoom" ? "info_zoom"
        : payload && payload.kind === "personal" ? "personal"
        : "gathering";
      if (audience === "self" && kind !== "in_person") kind = "personal";
      var repeat = payload && payload.repeat === "weekly" ? "weekly"
        : payload && payload.repeat === "monthly" ? "monthly"
        : "none";
      var groveId = window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"];
      var meetHref = window.FS.normalizeMeetingHref || window.FS.safeHref;
      var replayVal = (meetHref && meetHref((payload && payload.replay_url) || "", 2000)) || "";
      var row = {
        kind: kind,
        title: String((payload && payload.title) || "").trim().slice(0, 120),
        blurb: String((payload && payload.blurb) || "").trim().slice(0, 2000),
        starts_at: payload && payload.starts_at,
        ends_at: (payload && payload.ends_at) || null,
        location: String((payload && payload.location) || "").trim().slice(0, 200),
        meeting_url: (meetHref && meetHref((payload && payload.meeting_url) || "", 2000)) || "",
        replay_url: replayVal,
        org_id: (payload && payload.org_id) || Cloud.activeOrgId() || groveId,
        leader_only: audience === "org" && !!(payload && payload.leader_only),
        repeat: repeat,
        audience: audience
      };
      var startYmd = orgEventLocalYmd(row.starts_at);
      var occursOn = orgEventOccursOn(payload && payload.occurs_on) || startYmd;
      if (repeat !== "none" && payload && payload.id && configured() && client && !(existing && existing.replay_by_date)) {
        try {
          var oneReplay = await client.from("org_events").select("replay_url,replay_by_date").eq("id", payload.id).maybeSingle();
          if (!oneReplay.error && oneReplay.data) {
            existing = Object.assign({}, existing || {}, oneReplay.data);
          }
        } catch (eReplay) {}
      }
      if (repeat !== "none") {
        var nextMap = cleanReplayByDate(
          (payload && payload.replay_by_date) || (existing && existing.replay_by_date)
        );
        if (!(payload && payload.replay_by_date && payload.occurs_on == null)) {
          if (replayVal) nextMap[occursOn] = replayVal;
          else if (occursOn) delete nextMap[occursOn];
        }
        row.replay_by_date = nextMap;
        if (occursOn && startYmd && occursOn !== startYmd) {
          row.replay_url = (existing && existing.replay_url) || "";
        }
      }
      if (payload && payload.twin_id && audience === "org") row.twin_id = payload.twin_id;
      if (!Cloud.isSuperAdmin()) {
        row.org_id = sessionUser.org_id || row.org_id;
        delete row.twin_id;
      }
      if (!row.title) throw new Error("Add a title.");
      if (!row.starts_at) throw new Error("Add a date and time.");
      if ((kind === "gathering" || kind === "info_zoom") && !row.meeting_url) {
        var evPack = window.FS.Pack && window.FS.Pack.isEvergreen && window.FS.Pack.isEvergreen();
        var rawMeet = String((payload && payload.meeting_url) || "").trim();
        throw new Error(rawMeet
          ? "Use an http:// or https:// Zoom (or meeting) link."
          : (evPack
            ? "Team zooms and Info Zooms need a Zoom (or meeting) link."
            : "Grove Gatherings and Info Zooms need a Zoom (or meeting) link."));
      }
      function stripNewCols(src) {
        var out = Object.assign({}, src);
        delete out.leader_only;
        delete out.repeat;
        delete out.twin_id;
        delete out.audience;
        delete out.replay_by_date;
        return out;
      }
      async function writeRow(body, id) {
        if (id) {
          var up = await client.from("org_events").update(body).eq("id", id).select().single();
          if (up.error) throw up.error;
          return up.data;
        }
        body.created_by = sessionUser.id;
        var ins = await client.from("org_events").insert(body).select().single();
        if (ins.error) throw ins.error;
        return ins.data;
      }
      if (configured() && client) {
        var saved;
        try {
          saved = await writeRow(row, payload && payload.id);
        } catch (err) {
          var msg = String((err && err.message) || "");
          if (!/leader_only|repeat|twin_id|audience|kind|replay_by_date/i.test(msg)) throw err;
          if (/replay_by_date/i.test(msg) && repeat !== "none" && occursOn && startYmd && occursOn !== startYmd && replayVal) {
            throw new Error("Run supabase/org-events-replay-by-date.sql in the SQL editor to save a replay for this week.");
          }
          saved = await writeRow(stripNewCols(row), payload && payload.id);
        }
        if (saved && (saved.audience || audience) === "org") {
          try { await Cloud.syncOrgEventTwin(saved); } catch (e2) {}
        }
        return saved;
      }
      var store2 = localStore();
      if (!store2.orgEvents) store2.orgEvents = [];
      if (payload && payload.id) {
        var found = null;
        store2.orgEvents.forEach(function (ev, i) {
          if (ev.id === payload.id) {
            store2.orgEvents[i] = Object.assign({}, ev, row, {
              id: payload.id,
              updated_at: new Date().toISOString()
            });
            found = store2.orgEvents[i];
          }
        });
        if (!found) throw new Error("Event not found.");
        localSave(store2);
        if ((found.audience || audience) === "org") {
          try { await Cloud.syncOrgEventTwin(found); } catch (e3) {}
        }
        return found;
      }
      var created = Object.assign({}, row, {
        id: "local-org-" + Date.now().toString(36),
        created_by: sessionUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      store2.orgEvents.push(created);
      localSave(store2);
      return created;
    },

    syncOrgEventTwin: async function (ev) {
      if (!ev || !ev.twin_id || !Cloud.isSuperAdmin()) return null;
      var patch = {
        kind: ev.kind,
        title: ev.title,
        blurb: ev.blurb || "",
        starts_at: ev.starts_at,
        ends_at: ev.ends_at || null,
        location: ev.location || "",
        meeting_url: ev.meeting_url || "",
        replay_url: ev.replay_url || "",
        replay_by_date: cleanReplayByDate(ev.replay_by_date),
        leader_only: !!ev.leader_only,
        repeat: ev.repeat === "weekly" || ev.repeat === "monthly" ? ev.repeat : "none"
      };
      if (configured() && client) {
        var up = await client.from("org_events").update(patch).eq("id", ev.twin_id).select().single();
        if (up.error && /replay_by_date/i.test(String((up.error && up.error.message) || ""))) {
          delete patch.replay_by_date;
          up = await client.from("org_events").update(patch).eq("id", ev.twin_id).select().single();
        }
        if (up.error) throw up.error;
        return up.data;
      }
      var store = localStore();
      (store.orgEvents || []).forEach(function (row, i) {
        if (row.id === ev.twin_id) {
          store.orgEvents[i] = Object.assign({}, row, patch, { updated_at: new Date().toISOString() });
        }
      });
      localSave(store);
      return ev;
    },

    copyOrgEventToGrove: async function (eventId) {
      if (!Cloud.isSuperAdmin()) throw new Error("Only you can copy events to Fresh Grove.");
      if (!eventId) throw new Error("Save the event first.");
      var list = await Cloud.listOrgEvents();
      var ev = null;
      (list || []).forEach(function (row) { if (row && row.id === eventId) ev = row; });
      if (!ev && configured() && client) {
        var one = await client.from("org_events").select("*").eq("id", eventId).maybeSingle();
        if (one.error) throw one.error;
        ev = one.data;
      }
      if (!ev) throw new Error("Event not found.");
      if ((ev.audience || "org") !== "org") {
        throw new Error("Only org-wide events can copy to Fresh Grove.");
      }
      if (ev.twin_id) return ev;
      var groveId = window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"];
      if (!groveId) throw new Error("Fresh Grove isn’t set up.");
      if (String(ev.org_id || "") === String(groveId)) {
        throw new Error("This event already lives on Fresh Grove.");
      }
      var copy = await Cloud.upsertOrgEvent({
        kind: ev.kind,
        title: ev.title,
        blurb: ev.blurb,
        starts_at: ev.starts_at,
        ends_at: ev.ends_at,
        location: ev.location,
        meeting_url: ev.meeting_url,
        replay_url: ev.replay_url,
        replay_by_date: ev.replay_by_date,
        leader_only: !!ev.leader_only,
        repeat: ev.repeat,
        audience: "org",
        org_id: groveId,
        twin_id: ev.id
      });
      var linked = await Cloud.upsertOrgEvent(Object.assign({}, ev, {
        id: ev.id,
        twin_id: copy.id
      }));
      return linked;
    },

    deleteOrgEvent: async function (eventId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!eventId) throw new Error("Missing event.");
      var twinId = null;
      var row = null;
      if (configured() && client) {
        var one = await client.from("org_events").select("id,twin_id,audience,created_by").eq("id", eventId).maybeSingle();
        if (!one.error) row = one.data;
        if (row && row.twin_id) twinId = row.twin_id;
        if (row && !Cloud.canManageOrgEvent(row)) {
          throw new Error("Only people who run this calendar can edit it.");
        }
        if (!row && !Cloud.canEditCalendar()) {
          throw new Error("Only people who run this calendar can edit it.");
        }
        var { error } = await client.from("org_events").delete().eq("id", eventId);
        if (error) throw error;
        if (twinId && Cloud.isSuperAdmin()) {
          await client.from("org_events").delete().eq("id", twinId);
        }
        return true;
      }
      var store3 = localStore();
      var localEv = null;
      (store3.orgEvents || []).forEach(function (ev) {
        if (ev && ev.id === eventId) {
          localEv = ev;
          if (ev.twin_id) twinId = ev.twin_id;
        }
      });
      if (localEv && !Cloud.canManageOrgEvent(localEv)) {
        throw new Error("Only people who run this calendar can edit it.");
      }
      if (!localEv && !Cloud.canEditCalendar()) {
        throw new Error("Only people who run this calendar can edit it.");
      }
      store3.orgEvents = (store3.orgEvents || []).filter(function (ev) {
        if (ev.id === eventId) return false;
        if (twinId && Cloud.isSuperAdmin() && ev.id === twinId) return false;
        return true;
      });
      localSave(store3);
      return true;
    },

    defaultNotificationPrefs: function () {
      return {
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
    },

    notificationPrefSupport: function () {
      return {
        cabinet: !!(prefCols.cabinet_joins && prefCols.customer_mail),
        calendarDay: !!prefCols.calendar_day,
        zoomExtra: !!(prefCols.team_zoom_new && prefCols.team_zoom_replay)
      };
    },

    loadNotificationPrefs: async function () {
      var defaults = Cloud.defaultNotificationPrefs();
      if (!sessionUser) return defaults;
      if (configured() && client) {
        var { data, error } = await client.from("notification_prefs")
          .select(notificationPrefSelect())
          .eq("partner_id", sessionUser.id)
          .maybeSingle();
        if (error && markMissingPrefCols(error)) {
          var retry = await client.from("notification_prefs")
            .select(notificationPrefSelect())
            .eq("partner_id", sessionUser.id)
            .maybeSingle();
          data = retry.data;
          error = retry.error;
        }
        if (error) throw error;
        if (!data) return defaults;
        return {
          grove_joins: data.grove_joins || "level1",
          cheers: data.cheers !== false,
          how_i_grow: data.how_i_grow !== false,
          leads: data.leads !== false,
          notes: data.notes !== false,
          team_broadcasts: data.team_broadcasts !== false,
          team_zooms: data.team_zooms !== false,
          team_zoom_new: prefCols.team_zoom_new ? data.team_zoom_new !== false : defaults.team_zoom_new,
          team_zoom_replay: prefCols.team_zoom_replay ? data.team_zoom_replay !== false : defaults.team_zoom_replay,
          calendar_day: prefCols.calendar_day ? data.calendar_day !== false : defaults.calendar_day,
          cabinet_joins: prefCols.cabinet_joins ? data.cabinet_joins !== false : defaults.cabinet_joins,
          customer_mail: prefCols.customer_mail ? data.customer_mail !== false : defaults.customer_mail
        };
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      return (u && u.notification_prefs) ? Object.assign({}, defaults, u.notification_prefs) : defaults;
    },

    saveNotificationPrefs: async function (patch) {
      if (!sessionUser) throw new Error("Sign in first.");
      var current = await Cloud.loadNotificationPrefs();
      var next = {
        grove_joins: patch.grove_joins || current.grove_joins || "level1",
        cheers: patch.cheers != null ? !!patch.cheers : current.cheers !== false,
        how_i_grow: patch.how_i_grow != null ? !!patch.how_i_grow : current.how_i_grow !== false,
        leads: patch.leads != null ? !!patch.leads : current.leads !== false,
        notes: patch.notes != null ? !!patch.notes : current.notes !== false,
        team_broadcasts: patch.team_broadcasts != null ? !!patch.team_broadcasts : current.team_broadcasts !== false,
        team_zooms: patch.team_zooms != null ? !!patch.team_zooms : current.team_zooms !== false,
        team_zoom_new: patch.team_zoom_new != null ? !!patch.team_zoom_new : current.team_zoom_new !== false,
        team_zoom_replay: patch.team_zoom_replay != null ? !!patch.team_zoom_replay : current.team_zoom_replay !== false,
        calendar_day: patch.calendar_day != null ? !!patch.calendar_day : current.calendar_day !== false,
        cabinet_joins: patch.cabinet_joins != null ? !!patch.cabinet_joins : current.cabinet_joins !== false,
        customer_mail: patch.customer_mail != null ? !!patch.customer_mail : current.customer_mail !== false
      };
      if (["off", "level1", "tree"].indexOf(next.grove_joins) < 0) next.grove_joins = "level1";
      if (configured() && client) {
        var row = {
          partner_id: sessionUser.id,
          grove_joins: next.grove_joins,
          cheers: next.cheers,
          how_i_grow: next.how_i_grow,
          leads: next.leads,
          notes: next.notes,
          team_broadcasts: next.team_broadcasts,
          team_zooms: next.team_zooms
        };
        if (prefCols.team_zoom_new) row.team_zoom_new = next.team_zoom_new;
        if (prefCols.team_zoom_replay) row.team_zoom_replay = next.team_zoom_replay;
        if (prefCols.calendar_day) row.calendar_day = next.calendar_day;
        if (prefCols.cabinet_joins) row.cabinet_joins = next.cabinet_joins;
        if (prefCols.customer_mail) row.customer_mail = next.customer_mail;
        var { error } = await client.from("notification_prefs").upsert(row);
        if (error && markMissingPrefCols(error)) {
          delete row.calendar_day;
          delete row.cabinet_joins;
          delete row.customer_mail;
          delete row.team_zoom_new;
          delete row.team_zoom_replay;
          if (prefCols.team_zoom_new) row.team_zoom_new = next.team_zoom_new;
          if (prefCols.team_zoom_replay) row.team_zoom_replay = next.team_zoom_replay;
          if (prefCols.calendar_day) row.calendar_day = next.calendar_day;
          if (prefCols.cabinet_joins) row.cabinet_joins = next.cabinet_joins;
          if (prefCols.customer_mail) row.customer_mail = next.customer_mail;
          var retrySave = await client.from("notification_prefs").upsert(row);
          error = retrySave.error;
        }
        if (error) throw error;
        return next;
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      if (!u) throw new Error("Account not found.");
      u.notification_prefs = next;
      store.users[sessionUser.id] = u;
      localSave(store);
      return next;
    },

    savePushSubscription: async function (sub) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!sub || !sub.endpoint) throw new Error("Missing subscription.");
      var keys = sub.keys || {};
      if (!keys.p256dh || !keys.auth || String(keys.p256dh).length < 8 || String(keys.auth).length < 8) {
        throw new Error("This phone didn’t share its notification keys. Close the app, open it from the Home Screen icon, then tap Turn on again.");
      }
      if (configured() && client) {
        var row = {
          partner_id: sessionUser.id,
          endpoint: sub.endpoint,
          p256dh: String(keys.p256dh),
          auth: String(keys.auth),
          user_agent: (navigator.userAgent || "").slice(0, 240)
        };
        var up = await client.from("push_subscriptions").upsert(row, { onConflict: "endpoint" }).select("id").maybeSingle();
        if (!up.error && up.data) return;
        var rpc = await client.rpc("save_push_subscription", {
          p_endpoint: row.endpoint,
          p_p256dh: row.p256dh,
          p_auth: row.auth,
          p_user_agent: row.user_agent
        });
        if (rpc.error) throw (up.error || rpc.error);
        var check = await client.from("push_subscriptions").select("id").eq("endpoint", row.endpoint).maybeSingle();
        if (check.error || !check.data) {
          throw new Error("Could not save this phone for pings. Try Turn on again.");
        }
        return;
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      if (!u) throw new Error("Account not found.");
      u.push_endpoint = sub.endpoint;
      store.users[sessionUser.id] = u;
      localSave(store);
    },

    pushEndpointKnown: async function (endpoint) {
      if (!sessionUser || !endpoint) return false;
      if (configured() && client) {
        var { data, error } = await client.from("push_subscriptions")
          .select("id")
          .eq("endpoint", endpoint)
          .maybeSingle();
        return !!(!error && data);
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      return !!(u && u.push_endpoint === endpoint);
    },

    hasAnyPushSubscription: async function () {
      if (!sessionUser) return false;
      if (configured() && client) {
        var { data, error } = await client.from("push_subscriptions")
          .select("id")
          .eq("partner_id", sessionUser.id)
          .limit(1);
        return !!(!error && data && data.length);
      }
      var store2 = localStore();
      var u2 = store2.users[sessionUser.id];
      return !!(u2 && u2.push_endpoint);
    },

    deletePushSubscription: async function (endpoint) {
      if (!sessionUser) return;
      if (configured() && client && endpoint) {
        await client.rpc("delete_push_subscription", { p_endpoint: endpoint });
        return;
      }
      var store = localStore();
      var u = store.users[sessionUser.id];
      if (u) {
        u.push_endpoint = "";
        store.users[sessionUser.id] = u;
        localSave(store);
      }
    },

    dispatchPush: async function () {
      /* Pushes are database triggers + send-push secret. The browser must not call the function. */
      return { ok: false, sent: 0 };
    },

    sendTeamBroadcast: async function (body, audience) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.canBroadcast()) throw new Error("Leaders only.");
      var msg = String(body || "").trim();
      var rawAud = String(audience || "team");
      var aud = rawAud === "leaders" || rawAud === "level1" ? rawAud : "team";
      if ((aud === "leaders" || aud === "level1") && !Cloud.isSuperAdmin()) {
        throw new Error("Super admin only.");
      }
      if (!msg) throw new Error("Write a short message first.");
      if (msg.length > 280) throw new Error("Keep it under 280 characters.");
      if (configured() && client) {
        var args = { p_body: msg };
        if (aud !== "team") args.p_audience = aud;
        return await rpcWrite("send_team_broadcast", args,
          "Couldn’t send that just now — try again in a moment.");
      }
      throw new Error("Team messages need a signed-in cloud account.");
    },

    createTeamPoll: async function (body, labels, audience, choice) {
      if (!sessionUser) throw new Error("Sign in first.");
      var ev = Cloud.packIsEvergreen();
      if (ev) {
        if (!Cloud.canComposeEvergreenBoard()) throw new Error("Evergreen Admin only.");
      } else {
        if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      }
      var msg = String(body || "").trim();
      var rawAud = String(audience || "team");
      var aud = ev ? "team" : (rawAud === "leaders" || rawAud === "level1" ? rawAud : "team");
      var mode = choice === "single" ? "single" : "multiple";
      if ((aud === "leaders" || aud === "level1") && !Cloud.isSuperAdmin()) {
        throw new Error("Super admin only.");
      }
      if (!msg) throw new Error("Write a question first.");
      if (msg.length > 280) throw new Error("Keep the question under 280 characters.");
      var slots = [];
      (labels || []).forEach(function (lab) {
        var t = String(lab || "").trim();
        if (t) slots.push(t);
      });
      if (slots.length < 2) throw new Error("Add at least two choices.");
      if (slots.length > 8) throw new Error("Eight choices is the max.");
      if (configured() && client) {
        var args = {
          p_body: msg,
          p_labels: slots,
          p_audience: aud,
          p_choice: mode
        };
        if (ev) args.p_pack = "evergreen";
        return await rpcWrite("create_team_poll", args,
          "Couldn’t send that poll just now — try again in a moment.");
      }
      throw new Error("Team polls need a signed-in cloud account.");
    },

    listTeamPolls: async function () {
      if (!sessionUser) return [];
      if (configured() && client) {
        var args = { p_pack: Cloud.packIsEvergreen() ? "evergreen" : "grove" };
        var { data, error } = await client.rpc("list_team_polls", args);
        if (error) throw error;
        var rows = data;
        if (typeof rows === "string") {
          try { rows = JSON.parse(rows); } catch (e) { rows = []; }
        }
        return Array.isArray(rows) ? rows : [];
      }
      return [];
    },

    voteTeamPoll: async function (pollId, optionIds) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (configured() && client) {
        var ids = (optionIds || []).filter(Boolean);
        var { error } = await client.rpc("vote_team_poll", {
          p_poll: pollId,
          p_option_ids: ids
        });
        if (error) throw error;
        return true;
      }
      throw new Error("Team polls need a signed-in cloud account.");
    },

    closeTeamPoll: async function (pollId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (Cloud.packIsEvergreen()) {
        if (!Cloud.canComposeEvergreenBoard()) throw new Error("Evergreen Admin only.");
      } else if (!Cloud.isSuperAdmin()) {
        throw new Error("Super admin only.");
      }
      if (configured() && client) {
        var { error } = await client.rpc("close_team_poll", { p_poll: pollId });
        if (error) throw error;
        return true;
      }
      throw new Error("Team polls need a signed-in cloud account.");
    },

    listGroveHub: async function () {
      if (!sessionUser || Cloud.packIsEvergreen()) {
        return { posts: [], inbox: [], latest_at: null };
      }
      if (configured() && client) {
        var { data, error } = await client.rpc("list_grove_hub");
        if (error) throw error;
        var row = data;
        if (typeof row === "string") {
          try { row = JSON.parse(row); } catch (e) { row = null; }
        }
        if (!row || typeof row !== "object") return { posts: [], inbox: [], latest_at: null };
        return {
          posts: Array.isArray(row.posts) ? row.posts : [],
          inbox: Array.isArray(row.inbox) ? row.inbox : [],
          latest_at: row.latest_at || null
        };
      }
      return { posts: [], inbox: [], latest_at: null };
    },

    createGroveBoardPost: async function (body) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (Cloud.packIsEvergreen()) throw new Error("Fresh Grove only.");
      var msg = String(body || "").trim();
      if (!msg) throw new Error("Write a short update first.");
      if (msg.length > 2000) throw new Error("Keep it under 2000 characters.");
      if (configured() && client) {
        try {
          return await rpcWrite("create_grove_board_post", { p_body: msg },
            "Couldn’t post that just now — try again in a moment.");
        } catch (err) {
          if (await recentBoardPostExists("list_grove_hub", msg)) return true;
          throw err;
        }
      }
      throw new Error("The board needs a signed-in cloud account.");
    },

    deleteGroveBoardPost: async function (postId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.isSuperAdmin()) throw new Error("Super admin only.");
      if (configured() && client) {
        var { error } = await client.rpc("delete_grove_board_post", { p_post: postId });
        if (error) throw error;
        return true;
      }
      throw new Error("The board needs a signed-in cloud account.");
    },

    canSendCheerOrNote: function () {
      if (!sessionUser) return false;
      if (Cloud.packIsEvergreen()) {
        return !!(sessionUser.is_super_admin || sessionUser.is_hub_admin);
      }
      return true;
    },

    canComposeEvergreenBoard: function () {
      if (!sessionUser) return false;
      if (!Cloud.packIsEvergreen()) return false;
      return !!(sessionUser.is_super_admin || sessionUser.is_hub_admin);
    },

    listEvergreenBoard: async function () {
      if (!sessionUser) return { posts: [] };
      if (configured() && client) {
        var { data, error } = await client.rpc("list_evergreen_board");
        if (error) throw error;
        var row = data;
        if (typeof row === "string") {
          try { row = JSON.parse(row); } catch (e) { row = null; }
        }
        if (!row || typeof row !== "object") return { posts: [] };
        return { posts: Array.isArray(row.posts) ? row.posts : [] };
      }
      var store = localStore();
      return { posts: (store.evergreenBoardPosts || []).slice() };
    },

    createEvergreenBoardPost: async function (body) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!Cloud.canComposeEvergreenBoard()) throw new Error("Evergreen Admin only.");
      var msg = String(body || "").trim();
      if (!msg) throw new Error("Write a short update first.");
      if (msg.length > 2000) throw new Error("Keep it under 2000 characters.");
      if (configured() && client) {
        try {
          return await rpcWrite("create_evergreen_board_post", { p_body: msg },
            "Couldn’t post that just now — try again in a moment.");
        } catch (err) {
          if (await recentBoardPostExists("list_evergreen_board", msg)) return true;
          throw err;
        }
      }
      var storeB = localStore();
      if (!storeB.evergreenBoardPosts) storeB.evergreenBoardPosts = [];
      var post = {
        id: "local-evb-" + Date.now().toString(36),
        body: msg,
        created_at: new Date().toISOString(),
        created_by_name: sessionUser.display_name || "Evergreen",
        can_manage: true
      };
      storeB.evergreenBoardPosts.unshift(post);
      localSave(storeB);
      return post.id;
    },

    deleteEvergreenBoardPost: async function (postId) {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!(sessionUser.is_super_admin || sessionUser.is_hub_admin)) throw new Error("Evergreen Admin only.");
      if (configured() && client) {
        var { error } = await client.rpc("delete_evergreen_board_post", { p_post: postId });
        if (error) throw error;
        return true;
      }
      var storeD = localStore();
      storeD.evergreenBoardPosts = (storeD.evergreenBoardPosts || []).filter(function (p) {
        return !p || p.id !== postId;
      });
      localSave(storeD);
      return true;
    },

    canMintUnlockCode: function () {
      return canMintUnlockNow();
    },

    mintUnlockCode: async function () {
      if (!sessionUser) throw new Error("Sign in first.");
      if (!canMintUnlockNow()) throw new Error("Leaders only.");
      if (configured() && client) {
        var { data, error } = await client.rpc("mint_unlock_code");
        if (error) throw error;
        var row = data;
        if (typeof row === "string") {
          try { row = JSON.parse(row); } catch (e) { row = null; }
        }
        if (!row || !row.ok || !row.code) throw new Error("Could not make a code. Try again.");
        return formatUnlockCode(row.code);
      }
      var store = localStore();
      if (!store.unlock_codes) store.unlock_codes = [];
      var unused = 0;
      var now = Date.now();
      store.unlock_codes.forEach(function (c) {
        if (c.minted_by === sessionUser.id && !c.used_at && new Date(c.expires_at).getTime() > now) unused++;
      });
      if (unused >= 25) throw new Error("Too many unused codes. Wait until some are used or expire.");
      var token = makeUnlockToken();
      store.unlock_codes.push({
        code: token,
        dest_org_id: groveOrgId(),
        minted_by: sessionUser.id,
        used_by: null,
        used_at: null,
        expires_at: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      localSave(store);
      return token;
    },

    redeemUnlockCode: async function (raw) {
      if (!sessionUser) return { ok: false };
      if (sessionIsGrove()) return { ok: false };
      var code = formatUnlockCode(raw);
      if (configured() && client) {
        var { data, error } = await client.rpc("redeem_unlock_code", { p_code: code });
        if (error) return { ok: false };
        var row = data;
        if (typeof row === "string") {
          try { row = JSON.parse(row); } catch (e2) { row = null; }
        }
        return { ok: !!(row && row.ok) };
      }
      var store = localStore();
      var fails = store.unlock_fails || {};
      var mine = (fails[sessionUser.id] || []).filter(function (t) {
        return Date.now() - t < 15 * 60 * 1000;
      });
      var norm = normalizeUnlockCode(code);
      var list = store.unlock_codes || [];
      var found = null;
      var i;
      var nowMs = Date.now();
      var evId = evergreenOrgId();
      var onEv = sessionUser.org_id === evId || sessionUser.org_slug === "evergreen-co";
      if (!onEv || norm.length < 8) {
        mine.push(Date.now());
        fails[sessionUser.id] = mine;
        store.unlock_fails = fails;
        localSave(store);
        return { ok: false };
      }
      for (i = 0; i < list.length; i++) {
        if (normalizeUnlockCode(list[i].code) === norm && !list[i].used_at && new Date(list[i].expires_at).getTime() > nowMs) {
          found = list[i];
          break;
        }
      }
      if (!found) {
        mine.push(Date.now());
        fails[sessionUser.id] = mine;
        store.unlock_fails = fails;
        localSave(store);
        return { ok: false };
      }
      found.used_by = sessionUser.id;
      found.used_at = new Date().toISOString();
      sessionUser.org_id = groveOrgId();
      sessionUser.org_slug = "fresh-grove";
      sessionUser.sponsor_id = found.minted_by;
      if (!sessionUser.invited_by_id) sessionUser.invited_by_id = found.minted_by;
      store.users[sessionUser.id] = Object.assign({}, store.users[sessionUser.id], {
        org_id: sessionUser.org_id,
        org_slug: sessionUser.org_slug,
        sponsor_id: sessionUser.sponsor_id,
        invited_by_id: sessionUser.invited_by_id
      });
      localSave(store);
      return { ok: true };
    },

    dispatchZoomReminders: async function () {
      /* Cron-only. Signed-in clients cannot invoke the dispatcher. */
      return;
    },

    forgetCabinetPeople: function () {
      clearCabinetRosterNet();
    },

    listCabinetPeople: async function (opts) {
      if (!configured() || !client) return null;
      await wakeSession();
      if (!sessionUser) return null;
      if (Cloud.canUseCabinetDesk && !Cloud.canUseCabinetDesk()) return [];
      opts = opts || {};
      var netUser = sessionUser.id;
      if (!opts.force && cabinetRosterNet.inflight && cabinetRosterNet.user === netUser) {
        return cabinetRosterNet.inflight;
      }
      if (!opts.force && cabinetRosterNet.raw && cabinetRosterNet.user === netUser &&
          Date.now() - cabinetRosterNet.at < 60000) {
        return cabinetRosterNet.raw;
      }
      var work = (async function () {
        var lite = "id, email, name, note, last_event, last_line, joined_at, seen_at, care_off, care_sent_at, care_skipped_at, birthday";
        var table = await client.from("cabinet_people")
          .select(lite)
          .order("seen_at", { ascending: false });
        if (!table.error && table.data && table.data.length) return table.data;
        if (cabinetLiteOk !== false) {
          var liteRpc = await client.rpc("list_my_cabinet_people_lite");
          if (!liteRpc.error && Array.isArray(liteRpc.data)) {
            cabinetLiteOk = true;
            return liteRpc.data;
          }
          if (liteRpc.error) cabinetLiteOk = false;
        }
        /* Never pull list_my_cabinet_people — that ships every thread blob. */
        if (!table.error) return table.data || [];
        var fallback = await client.from("cabinet_people")
          .select("id, email, name, note, last_event, last_line, joined_at, seen_at")
          .order("seen_at", { ascending: false });
        if (!fallback.error) return fallback.data || [];
        console.warn("cabinet_people", table.error.message || table.error);
        return null;
      })();
      cabinetRosterNet.user = netUser;
      cabinetRosterNet.inflight = work;
      try {
        var rows = await work;
        if (Array.isArray(rows)) {
          cabinetRosterNet.raw = rows;
          cabinetRosterNet.at = Date.now();
        }
        return rows;
      } finally {
        if (cabinetRosterNet.inflight === work) cabinetRosterNet.inflight = null;
      }
    },

    getCabinetPersonThread: async function (email) {
      if (!configured() || !client) return null;
      await wakeSession();
      if (!sessionUser) return null;
      var mail = String(email || "").trim().toLowerCase();
      if (!mail) return null;
      var row = await client.from("cabinet_people")
        .select("email, name, note, last_event, last_line, seen_at, thread")
        .eq("email", mail)
        .limit(1)
        .maybeSingle();
      if (!row.error) return row.data || null;
      return null;
    },

    removeCabinetPerson: async function (email) {
      var out = await this.shelfDesk("remove_person", { email: email });
      clearCabinetRosterNet();
      return out;
    },

    patchCabinetPerson: async function (email, patch) {
      patch = patch || {};
      try {
        var out = await rpcWrite("patch_cabinet_person", {
          p_email: String(email || "").trim().toLowerCase(),
          p_care_off: patch.careOff == null ? null : !!patch.careOff,
          p_care_sent: patch.careSent ? true : null,
          p_care_skipped: patch.careSkipped ? true : null,
          p_birthday: patch.birthday == null ? null : String(patch.birthday || "")
        }, "Couldn’t save that on the roster.");
        clearCabinetRosterNet();
        return out;
      } catch (err) {
        return { ok: false, error: err && err.message };
      }
    },

    listShelfBirthdays: async function () {
      return await this.shelfDesk("list_birthdays", {});
    },

    broadcastCabinet: async function (line) {
      var out = await this.shelfDesk("broadcast", { line: line, note: line });
      clearCabinetRosterNet();
      return out;
    },

    replyCabinetPerson: async function (email, line, eventKey) {
      var viaDesk = await this.shelfDesk("reply", {
        email: email,
        line: String(line || "").trim(),
        eventKey: String(eventKey || "").trim()
      }).catch(function () { return null; });
      if (viaDesk && viaDesk.ok !== false) {
        clearCabinetRosterNet();
        return viaDesk;
      }
      if (sessionIsEvergreen()) {
        if (viaDesk && viaDesk.error) throw new Error(viaDesk.error);
        throw new Error("Couldn’t send that letter to their shelf.");
      }
      try {
        var rpcOut = await rpcWrite("reply_cabinet_person", {
          p_email: String(email || "").trim().toLowerCase(),
          p_line: String(line || "").trim(),
          p_event_key: String(eventKey || "").trim()
        }, "Couldn’t send that letter to their shelf.");
        clearCabinetRosterNet();
        return rpcOut;
      } catch (rpcErr) {
        if (viaDesk && viaDesk.error) throw new Error(viaDesk.error);
        throw rpcErr;
      }
    },

    shelfDesk: async function (action, extra) {
      if (sessionIsEvergreen()) throw new Error("Cabinet doors are not for Evergreen.");
      if (Cloud.canUseCabinetDesk && !Cloud.canUseCabinetDesk()) {
        throw new Error("Cabinet doors are not for this account.");
      }
      if (!configured() || !client) throw new Error("Needs a signed-in cloud account.");
      await wakeSession();
      extra = extra || {};
      var res = await client.functions.invoke("shelf-desk", {
        body: {
          action: String(action || "").trim(),
          email: String(extra.email || "").trim().toLowerCase(),
          name: String(extra.name || "").trim(),
          slugs: extra.slugs || [],
          line: String(extra.line || extra.note || "").trim(),
          event_key: String(extra.eventKey || extra.event_key || "").trim(),
          note: extra.note != null ? String(extra.note) : "",
          percent: extra.percent,
          active: extra.active,
          emails: extra.emails || [],
          weblink: extra.weblink != null ? String(extra.weblink) : "",
          pingKind: extra.pingKind != null ? String(extra.pingKind) : ""
        }
      });
      if (res.error) throw res.error;
      var act = String(action || "").trim();
      if (act === "remove_person" || act === "reply" || act === "broadcast" || act === "create_token") {
        clearCabinetRosterNet();
      }
      return res.data || {};
    },

    createShelfDoor: async function (email, name, slugs) {
      return await this.shelfDesk("create_token", { email: email, name: name, slugs: slugs || [] });
    },

    pullShelfSnapshot: async function (email) {
      return await this.shelfDesk("snapshot", { email: email });
    },

    listShelfDoorRequests: async function () {
      return await this.shelfDesk("list_requests", {});
    },

    getShelfWeek: async function () {
      return await this.shelfDesk("get_week", {});
    },

    setShelfWeek: async function (note, percent, slugs, active, pingKind) {
      return await this.shelfDesk("set_week", {
        note: note || "",
        percent: percent,
        slugs: slugs || [],
        active: active,
        pingKind: pingKind || ""
      });
    },

    getShelfShop: async function () {
      return await this.shelfDesk("get_shop", {});
    },

    setShelfShop: async function (weblink) {
      return await this.shelfDesk("set_shop", { weblink: weblink || "" });
    }
  };

  Cloud.bindPasswordResetUi = function (cfg) {
    cfg = cfg || {};
    function el(id) { return id ? document.getElementById(id) : null; }
    function setHidden(node, hide) {
      if (!node) return;
      node.hidden = !!hide;
    }
    function hideList(ids, hide) {
      (ids || []).forEach(function (id) { setHidden(el(id), hide); });
    }
    function stepOf() {
      var stored = readPasswordReset();
      if (stored && stored.step) return stored.step;
      return "";
    }
    function setMsg(text) {
      var msg = el(cfg.msgId);
      if (msg) msg.textContent = text || "";
    }
    function paintCopy(step) {
      var title = el(cfg.titleId);
      var eyebrow = el(cfg.eyebrowId);
      var body = el(cfg.bodyId);
      var copy = (cfg.copy && cfg.copy[step]) || null;
      if (!copy) return;
      if (eyebrow && copy.eyebrow) eyebrow.textContent = copy.eyebrow;
      if (title && copy.title) title.textContent = copy.title;
      if (body && copy.body) body.textContent = copy.body;
    }
    function paint() {
      var step = stepOf();
      var open = !!step;
      hideList(cfg.hideIds, open);
      setHidden(el(cfg.paneId), !open);
      if (!open) return;
      setHidden(el(cfg.emailWrapId), step !== "email");
      setHidden(el(cfg.codeWrapId), step !== "code");
      setHidden(el(cfg.passWrapId), step !== "password");
      setHidden(el(cfg.pass2WrapId), step !== "password");
      setHidden(el(cfg.sendBtnId), step !== "email");
      setHidden(el(cfg.verifyBtnId), step !== "code");
      setHidden(el(cfg.saveBtnId), step !== "password");
      setHidden(el(cfg.resendBtnId), step !== "code");
      var emailIn = el(cfg.emailId);
      var stored = readPasswordReset();
      if (emailIn && stored && stored.email && !emailIn.value) emailIn.value = stored.email;
      paintCopy(step);
    }
    function openReset(email) {
      email = normalizeAuthEmail(email || (el(cfg.emailId) && el(cfg.emailId).value) || lastRememberedEmail());
      writePasswordReset({ email: email, step: "email" });
      var emailIn = el(cfg.emailId);
      if (emailIn && email) emailIn.value = email;
      setMsg("");
      paint();
      if (emailIn) setTimeout(function () { emailIn.focus(); }, 40);
    }
    function closeReset() {
      clearPasswordReset();
      setMsg("");
      paint();
      if (typeof cfg.onClose === "function") cfg.onClose();
    }
    async function run(kind, btnId) {
      var btn = el(btnId);
      try {
        if (btn) btn.disabled = true;
        var email = normalizeAuthEmail((el(cfg.emailId) && el(cfg.emailId).value) || (readPasswordReset() && readPasswordReset().email) || "");
        var res;
        if (kind === "send") {
          res = await Cloud.requestSignInCode(email);
        } else if (kind === "verify") {
          res = await Cloud.verifySignInCode(email, el(cfg.codeId) && el(cfg.codeId).value);
        } else {
          var p1 = el(cfg.passId) ? el(cfg.passId).value : "";
          var p2 = el(cfg.pass2Id) ? el(cfg.pass2Id).value : "";
          if (p1 !== p2) throw new Error("Those passwords didn’t match. Type the same one twice.");
          res = await Cloud.setNewPassword(p1);
        }
        setMsg((res && res.message) || "");
        paint();
        if (res && res.kind === "signed_in" && typeof cfg.onDone === "function") {
          await cfg.onDone(res);
        }
      } catch (err) {
        setMsg(Cloud.friendlyAuthError ? Cloud.friendlyAuthError(err, false) : ((err && err.message) || "Could not reset password."));
      } finally {
        if (btn) btn.disabled = false;
      }
    }
    var forgot = el(cfg.forgotBtnId);
    if (forgot && !forgot.dataset.resetWired) {
      forgot.dataset.resetWired = "1";
      forgot.addEventListener("click", function () {
        var fromSignIn = cfg.signInEmailId ? el(cfg.signInEmailId) : null;
        openReset(fromSignIn && fromSignIn.value);
      });
    }
    var sendBtn = el(cfg.sendBtnId);
    if (sendBtn && !sendBtn.dataset.resetWired) {
      sendBtn.dataset.resetWired = "1";
      sendBtn.addEventListener("click", function () { run("send", cfg.sendBtnId); });
    }
    var verifyBtn = el(cfg.verifyBtnId);
    if (verifyBtn && !verifyBtn.dataset.resetWired) {
      verifyBtn.dataset.resetWired = "1";
      verifyBtn.addEventListener("click", function () { run("verify", cfg.verifyBtnId); });
    }
    var saveBtn = el(cfg.saveBtnId);
    if (saveBtn && !saveBtn.dataset.resetWired) {
      saveBtn.dataset.resetWired = "1";
      saveBtn.addEventListener("click", function () { run("save", cfg.saveBtnId); });
    }
    var resendBtn = el(cfg.resendBtnId);
    if (resendBtn && !resendBtn.dataset.resetWired) {
      resendBtn.dataset.resetWired = "1";
      resendBtn.addEventListener("click", function () { run("send", cfg.resendBtnId); });
    }
    var backBtn = el(cfg.backBtnId);
    if (backBtn && !backBtn.dataset.resetWired) {
      backBtn.dataset.resetWired = "1";
      backBtn.addEventListener("click", closeReset);
    }
    [["emailId", "send"], ["codeId", "verify"], ["pass2Id", "save"]].forEach(function (pair) {
      var input = el(cfg[pair[0]]);
      if (!input || input.dataset.resetWired) return;
      input.dataset.resetWired = "1";
      input.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (pair[1] === "send") run("send", cfg.sendBtnId);
        else if (pair[1] === "verify") run("verify", cfg.verifyBtnId);
        else run("save", cfg.saveBtnId);
      });
    });
    return { paint: paint, open: openReset, close: closeReset };
  };

  window.FS.Cloud = Cloud;
  try { Cloud.captureJoinFromUrl(); } catch (eJoin) {}
})();
