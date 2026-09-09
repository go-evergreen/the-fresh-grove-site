/* Clients desk inside First Seeds. Taylor talks to her shelf. Grove
   Leaders talk to the team gift. People land here when they open a
   cabinet, not as preview cards. */
(function () {
  "use strict";

  var KEY = "fs_cabinet_desk_v1";
  var room = "today";
  var personId = "";
  var bound = false;
  var memo = null;
  var hydrateInFlight = false;
  var hydrateAgain = false;
  var hydrateTries = 0;
  var peopleQuery = "";
  var peopleSort = "newest";
  var searchPaintRaf = 0;
  var fromRoom = "today";
  var faqPick = false;
  var faqQuery = "";
  var faqOpenGroup = "";
  var doorMode = false;
  var doorName = "";
  var doorEmail = "";
  var doorSlugs = {};
  var doorUrl = "";
  var doorBusy = false;
  var doorQuery = "";
  var doorCat = "all";
  var catalog = [];
  var snapByEmail = {};
  var linkRequests = [];
  var SALE_MARK = "__sale__";
  var weekNote = "";
  var weekSlug = "";
  var saleSlugs = {};
  var weekPercent = 0;
  var weekQuery = "";
  var saleQuery = "";
  var weekActive = false;
  var weekAuto = true;
  var weekBusy = false;
  var weekFold = false;
  var saleFold = false;
  var blastNote = "";
  var blastBusy = false;
  var blastFold = false;
  var shopWeblink = "";
  var shopBusy = false;
  var shopFold = false;
  var careBackfilled = {};
  var droppedMails = {};
  var autoBusy = false;
  var nameEdit = false;
  var rosterCloudError = false;
  var lastHydrateOk = 0;
  var waitingForFresh = true;
  var paintTimer = 0;
  var paintQueued = null;
  var SNAP_KEY = "fs_cabinet_snaps_v1";
  var threadFillInFlight = {};

  function uniqueDoorsOn() {
    return window.FS && typeof window.FS.uniqueClientDoorsOn === "function"
      ? window.FS.uniqueClientDoorsOn()
      : Date.now() >= Date.parse("2026-11-01T08:00:00-07:00");
  }

  function salesOn() {
    return window.FS && typeof window.FS.shelfSalesOn === "function"
      ? window.FS.shelfSalesOn()
      : Date.now() >= Date.parse("2026-11-01T08:00:00-07:00");
  }

  function uid() {
    return "c" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function firstName(name) {
    return String(name || "").trim().split(/\s+/)[0] || "them";
  }

  function emailHandle(email) {
    return String(email || "").trim().split("@")[0] || "";
  }

  function hasFirstLast(name) {
    return String(name || "").trim().split(/\s+/).filter(Boolean).length >= 2;
  }

  function looksLikeHandle(name, email) {
    var n = String(name || "").trim();
    if (!n) return true;
    if (hasFirstLast(n) && !/[0-9]/.test(n)) return false;
    var handle = emailHandle(email);
    if (handle && n.toLowerCase() === handle.toLowerCase()) return true;
    if (/[0-9]/.test(n)) return true;
    return /^[a-z0-9._]{8,}$/.test(n);
  }

  function nicerName(current, incoming, email) {
    var a = String(current || "").trim();
    var b = String(incoming || "").trim();
    if (!b) return a;
    if (!a) return b;
    if (hasFirstLast(b) && !hasFirstLast(a)) return b;
    if (hasFirstLast(a) && !hasFirstLast(b)) return a;
    if (looksLikeHandle(a, email) && !looksLikeHandle(b, email)) return b;
    if (!looksLikeHandle(a, email) && looksLikeHandle(b, email)) return a;
    return a;
  }

  function callName(person) {
    var full = String(person && person.name || "").trim();
    return full || firstName(person && person.name);
  }

  function adoptName(person, incoming, lock) {
    if (!person) return false;
    var next = String(incoming || "").trim();
    if (!next) return false;
    if (lock) {
      if (person.name === next && person.nameLocked) return false;
      person.name = next;
      person.nameLocked = true;
      return true;
    }
    if (person.nameLocked) return false;
    var chosen = nicerName(person.name, next, person.email);
    if (!chosen || chosen === person.name) return false;
    person.name = chosen;
    return true;
  }

  function initial(name) {
    return firstName(name).charAt(0).toUpperCase() || "·";
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function blank() {
    return { people: [], care: defaultCare(), sort: "newest" };
  }

  function defaultSequences() {
    return [
      {
        id: "welcome",
        on: true,
        trigger: "hours",
        hours: 2,
        title: "Welcome",
        hint: "Hours after they open from the Home Screen — or first open if we don’t have that yet.",
        body: "Hi {first}! I’m so glad you downloaded The Fresh Shelf! You can message me here anytime if you have any questions."
      },
      {
        id: "learn",
        on: true,
        trigger: "learn",
        days: 5,
        title: "Learn",
        hint: "Days on the shelf, only if they haven’t opened Learn.",
        body: "Hi {first} — Learn has the freshness story if you want it. No rush. I’m here if a question comes up."
      }
    ];
  }

  function defaultCare() {
    return { autoSend: false, sequences: defaultSequences() };
  }

  function mergeCare(saved) {
    var stock = defaultCare();
    var raw = saved && typeof saved === "object" ? saved : {};
    var byId = {};
    var i;
    for (i = 0; i < (raw.sequences || []).length; i++) {
      if (raw.sequences[i] && raw.sequences[i].id) byId[raw.sequences[i].id] = raw.sequences[i];
    }
    return {
      autoSend: raw.autoSend === true,
      sequences: stock.sequences.map(function (seq) {
        var extra = byId[seq.id] || {};
        return {
          id: seq.id,
          on: extra.on == null ? seq.on : !!extra.on,
          trigger: seq.trigger,
          hours: extra.hours != null ? Number(extra.hours) || seq.hours : seq.hours,
          days: extra.days != null ? Number(extra.days) || seq.days : seq.days,
          title: extra.title != null ? String(extra.title) : seq.title,
          hint: seq.hint,
          body: extra.body != null ? String(extra.body) : seq.body
        };
      })
    };
  }

  function careSettings() {
    return mergeCare(read().care);
  }

  function saveCareSettings(patch) {
    var data = read();
    var current = mergeCare(data.care);
    var next = mergeCare({
      autoSend: patch && Object.prototype.hasOwnProperty.call(patch, "autoSend") ? patch.autoSend : current.autoSend,
      sequences: (patch && patch.sequences) || current.sequences
    });
    data.care = next;
    write(data);
    return next;
  }

  function saveCareSequence(id, patch) {
    var care = careSettings();
    care.sequences = care.sequences.map(function (seq) {
      return seq.id === id ? Object.assign({}, seq, patch) : seq;
    });
    return saveCareSettings({ autoSend: care.autoSend, sequences: care.sequences });
  }

  function resetCareSuggested() {
    var keep = careSettings().autoSend;
    return saveCareSettings(Object.assign({}, defaultCare(), { autoSend: keep }));
  }

  function isPreview(person) {
    if (!person) return false;
    if (person.preview) return true;
    var email = String(person.email || "").toLowerCase();
    return /@preview\.local$/.test(email);
  }

  function dropPreview(data) {
    if (!data || !Array.isArray(data.people)) return data;
    data.people = data.people.filter(function (p) { return !isPreview(p); });
    return data;
  }

  function read() {
    if (memo) return memo;
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) {
        memo = blank();
        return memo;
      }
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") {
        memo = blank();
        return memo;
      }
      if (!Array.isArray(data.people)) data.people = [];
      data.care = mergeCare(data.care);
      if (data.sort === "az" || data.sort === "waiting" || data.sort === "newest") peopleSort = data.sort;
      dropPreview(data);
      memo = data;
      return memo;
    } catch (e) {
      memo = blank();
      return memo;
    }
  }

  function write(data) {
    memo = dropPreview(data || blank());
    try { localStorage.setItem(KEY, JSON.stringify(memo)); } catch (e) {}
  }

  function people() {
    return read().people;
  }

  function personById(id) {
    var list = people();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function persistCare(person, patch, opts) {
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.patchCabinetPerson !== "function" || !person || !person.email) return;
    Cloud.patchCabinetPerson(person.email, patch || {}).then(function (res) {
      if (opts && opts.warn && res && res.ok === false) toast("Couldn’t save that on their card.", "bad");
    }).catch(function () {
      if (opts && opts.warn) toast("Couldn’t save that on their card.", "bad");
    });
  }

  function savePerson(person) {
    var data = read();
    var found = false;
    for (var i = 0; i < data.people.length; i++) {
      if (data.people[i].id === person.id) {
        data.people[i] = person;
        found = true;
        break;
      }
    }
    if (!found) data.people.push(person);
    write(data);
  }

  function unreadCount(person) {
    var qs = (person && person.questions) || [];
    var n = 0;
    for (var i = 0; i < qs.length; i++) {
      if (qs[i].from === "them" && !qs[i].readAt) n += 1;
    }
    return n;
  }

  function lastLine(person) {
    var last = lastMessage(person);
    return last ? String(last.body || "").trim() : "";
  }

  function atMs(iso) {
    var t = new Date(iso || "").getTime();
    return isNaN(t) ? 0 : t;
  }

  function lastMessage(person) {
    var qs = (person && person.questions) || [];
    if (!qs.length) return null;
    var last = qs[0];
    var i;
    for (i = 1; i < qs.length; i++) {
      var next = atMs(qs[i].at);
      var prev = atMs(last.at);
      if (next > prev) last = qs[i];
    }
    return last;
  }

  function sortThread(list) {
    return (list || []).map(function (m, i) {
      return { m: m, i: i };
    }).sort(function (a, b) {
      var da = atMs(a.m.at);
      var db = atMs(b.m.at);
      if (da !== db) return da - db;
      return a.i - b.i;
    }).map(function (row) {
      return row.m;
    });
  }

  function latestAtMs(list, from) {
    var max = 0;
    var i;
    for (i = 0; i < (list || []).length; i++) {
      if (from && list[i].from !== from) continue;
      var t = atMs(list[i].at);
      if (t > max) max = t;
    }
    return max;
  }

  function incomingAt(raw, existing, from, isLatestMail) {
    var t = atMs(raw);
    if (isLatestMail) {
      var latest = latestAtMs(existing);
      if (!t || t < latest) return nowIso();
      return new Date(t).toISOString();
    }
    if (t) return new Date(t).toISOString();
    if (from === "them" && latestAtMs(existing, "you")) return nowIso();
    return nowIso();
  }

  function lastAt(person) {
    var last = lastMessage(person);
    return (last && last.at) || person.seenAt || person.createdAt || "";
  }

  function relativeWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var diff = Date.now() - d.getTime();
    if (diff < 45 * 1000) return "Just now";
    if (diff < 60 * 60 * 1000) {
      var mins = Math.max(1, Math.floor(diff / 60000));
      return mins === 1 ? "1 min ago" : mins + " min ago";
    }
    if (diff < 24 * 60 * 60 * 1000) {
      var hours = Math.floor(diff / 3600000);
      return hours === 1 ? "1 hour ago" : hours + " hours ago";
    }
    if (diff < 48 * 60 * 60 * 1000) return "Yesterday";
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      var days = Math.floor(diff / 86400000);
      return days + " days ago";
    }
    return niceWhen(iso);
  }

  function threadWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var now = new Date();
    var sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    if (sameDay) {
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    var yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    if (d.getFullYear() === yest.getFullYear() && d.getMonth() === yest.getMonth() && d.getDate() === yest.getDate()) {
      return "Yesterday";
    }
    if (Date.now() - d.getTime() < 6 * 24 * 60 * 60 * 1000) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function chatStamp(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    var now = new Date();
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) {
      return time;
    }
    var yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    if (d.getFullYear() === yest.getFullYear() && d.getMonth() === yest.getMonth() && d.getDate() === yest.getDate()) {
      return "Yesterday " + time;
    }
    var day = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: now.getFullYear() === d.getFullYear() ? undefined : "numeric"
    });
    return day + " " + time;
  }

  function stampGap(prev, next) {
    if (!next) return false;
    if (!prev) return true;
    var a = new Date(prev);
    var b = new Date(next);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return true;
    return Math.abs(b.getTime() - a.getTime()) > 25 * 60 * 1000;
  }

  function statusCopy(person) {
    if (isFresh(person)) return "New on your list";
    if (theyWroteLast(person)) return "Needs a reply";
    var lastChat = lastChatMessage(person);
    if (lastChat && lastChat.from === "you") return "You wrote last";
    var last = lastMessage(person);
    if (last && isMatchLine(last.body)) return "Took Fresh Match";
    if (last) return "On your list";
    return "No messages yet";
  }

  function letterOf(name) {
    var ch = String(name || "").trim().charAt(0).toUpperCase();
    return /[A-Z]/.test(ch) ? ch : "#";
  }

  function inviteBtn() {
    return '<button type="button" class="btn" data-cabinet-invite>Copy your shelf link</button>';
  }

  function linkRow() {
    var html = '<div class="cabinet-link-row">' + inviteBtn();
    if (uniqueDoorsOn()) {
      html += '<button type="button" class="btn-ghost" data-cabinet-door-open>Send a unique link</button>';
    }
    html += "</div>";
    return html;
  }

  function shortProduct(name) {
    return String(name || "").replace(/^(FRESH |CAPS |BEYOND |PACK |RINGANA )/i, "") || name;
  }

  function shelfPublicHost() {
    var host = "";
    try { host = window.FS && window.FS.cabinetShelfHost && window.FS.cabinetShelfHost(); } catch (e) {}
    host = String(host || "").replace(/\/$/, "");
    if (host) return host;
    try {
      var user = window.FS && window.FS.Cloud && window.FS.Cloud.user && window.FS.Cloud.user();
      var slug = user && user.lead_slug ? String(user.lead_slug).trim().toLowerCase() : "";
      if (slug === "taylor") return "https://shelf.taygoesfresh.com";
    } catch (e2) {}
    return "https://shelf.thefreshgrove.team";
  }

  function loadCatalog() {
    if (!deskAllowed()) return Promise.resolve(catalog);
    if (catalog.length) return Promise.resolve(catalog);
    return fetch(shelfPublicHost() + "/door-catalog.json", { cache: "force-cache" })
      .then(function (res) { return res.ok ? res.json() : []; })
      .then(function (rows) {
        catalog = Array.isArray(rows) ? rows : [];
        if (!catalog.some(function (p) { return p.slug === "ringanadea"; })) {
          catalog.push({ slug: "ringanadea", name: "RINGANA dea", category: "supplements" });
        }
        return catalog;
      })
      .catch(function () { return []; });
  }

  function loadWeek() {
    if (!deskAllowed()) return;
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.getShelfWeek !== "function") return;
    Cloud.getShelfWeek().then(function (data) {
      var week = data && data.week ? data.week : data;
      if (!week) return;
      applyWeekRow(week);
      if (!composing()) schedulePaint();
    }).catch(function () {});
  }

  function loadShop() {
    if (!deskAllowed()) return;
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.getShelfShop !== "function") return;
    Cloud.getShelfShop().then(function (data) {
      var shop = data && data.shop ? data.shop : data;
      if (!shop) return;
      shopWeblink = String(shop.weblink || "").trim();
      paintShopSettings();
      if (!composing()) schedulePaint();
    }).catch(function () {});
  }

  function loadBirthdays() {
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.listShelfBirthdays !== "function") return;
    Cloud.listShelfBirthdays().then(function (data) {
      var rows = (data && data.people) || [];
      if (!rows.length) return;
      var list = people();
      var dirty = false;
      var i;
      var j;
      for (i = 0; i < rows.length; i++) {
        var mail = String(rows[i].email || "").trim().toLowerCase();
        var day = String(rows[i].birthday || "");
        if (!mail) continue;
        for (j = 0; j < list.length; j++) {
          if (String(list[j].email || "").toLowerCase() !== mail) continue;
          var rowDirty = false;
          if (day && list[j].birthday !== day) {
            list[j].birthday = day;
            persistCare(list[j], { birthday: day });
            rowDirty = true;
          }
          if (adoptName(list[j], rows[i].name)) rowDirty = true;
          if (rowDirty) {
            savePerson(list[j]);
            dirty = true;
          }
        }
      }
      if (dirty && !composing()) schedulePaint();
    }).catch(function () {});
  }

  function loadRequests() {
    if (!deskAllowed()) return;
    if (!uniqueDoorsOn()) return;
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.listShelfDoorRequests !== "function") return;
    Cloud.listShelfDoorRequests().then(function (data) {
      linkRequests = (data && data.requests) || [];
      if (!composing()) schedulePaint();
    }).catch(function () {});
  }

  function readSnaps() {
    try {
      var raw = sessionStorage.getItem(SNAP_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== "object") return;
      var key;
      for (key in parsed) {
        if (!Object.prototype.hasOwnProperty.call(parsed, key)) continue;
        if (parsed[key] && parsed[key] !== "loading" && !parsed[key].missing) snapByEmail[key] = parsed[key];
      }
    } catch (e) {}
  }

  function writeSnaps() {
    try {
      var out = {};
      var key;
      for (key in snapByEmail) {
        if (!Object.prototype.hasOwnProperty.call(snapByEmail, key)) continue;
        var snap = snapByEmail[key];
        if (snap && snap !== "loading" && !snap.missing) out[key] = snap;
      }
      sessionStorage.setItem(SNAP_KEY, JSON.stringify(out));
    } catch (e) {}
  }

  function loadSnapshot(email) {
    var mail = String(email || "").trim().toLowerCase();
    var Cloud = window.FS && window.FS.Cloud;
    if (!mail || !Cloud || typeof Cloud.pullShelfSnapshot !== "function") return;
    if (snapByEmail[mail] && snapByEmail[mail] !== "loading") return;
    snapByEmail[mail] = "loading";
    Cloud.pullShelfSnapshot(mail).then(function (data) {
      snapByEmail[mail] = data && data.snapshot ? data.snapshot : { missing: true };
      var snap = snapByEmail[mail];
      if (snap && !snap.missing) {
        var who = people().filter(function (p) { return String(p.email || "").toLowerCase() === mail; })[0];
        if (who) {
          var snapDirty = false;
          if (snap.birthday && who.birthday !== snap.birthday) {
            who.birthday = snap.birthday;
            persistCare(who, { birthday: snap.birthday });
            snapDirty = true;
          }
          if (adoptName(who, snap.name)) snapDirty = true;
          if (snapDirty) savePerson(who);
        }
        writeSnaps();
      }
      if (!composing()) schedulePaint();
    }).catch(function () {
      snapByEmail[mail] = { missing: true };
      if (!composing()) schedulePaint();
    });
  }

  function nameForSlug(slug) {
    var i;
    for (i = 0; i < catalog.length; i++) {
      if (catalog[i].slug === slug) return catalog[i].name;
    }
    return slug;
  }

  function categoryForSlug(slug) {
    var i;
    for (i = 0; i < catalog.length; i++) {
      if (catalog[i].slug === slug) return catalog[i].category || "";
    }
    var s = String(slug || "");
    if (/^(caps-|beyond-|pack-|fresh-packs|ringana-)/i.test(s)) return "supplements";
    if (/^fresh-(body|hand|foot|deodorant|shampoo|hair|soap|tooth|light-legs)/i.test(s)) return "body";
    return "skincare";
  }

  function productImg(slug) {
    var s = String(slug || "").trim();
    var local = (window.FS && window.FS.PRODUCT_IMAGES && window.FS.PRODUCT_IMAGES[s]) || "";
    if (local) return local;
    var file = s;
    var folder = "fresh";
    if (/^caps-/.test(s)) folder = "caps";
    else if (/^pack-/.test(s) || s === "fresh-packs-abc") folder = "packs";
    else if (/^beyond-/.test(s) || /^ringana-/.test(s)) folder = "beyond";
    else if (/^ringana/.test(s)) folder = "drinks";
    if (s === "fresh-tonic-calm") file = "fresh-toner-calm";
    else if (s === "fresh-tonic-pure") file = "fresh-toner-pure";
    else if (s === "fresh-illuminating-enzyme-mask") file = "fresh-enzyme-mask";
    else if (s === "fresh-packs-abc") file = "packs-abc";
    else if (s === "fresh-volume-shampoo") file = "fresh-shampoo-volume";
    else if (s === "ringanachi") file = "drinks-chi";
    else if (s === "ringanadea") file = "drinks-dea";
    else if (s === "ringanabty") file = "drinks-bty";
    return shelfPublicHost() + "/products/" + folder + "/" + file + ".png";
  }

  function isMatchLine(line) {
    var t = String(line || "");
    return /^Took Fresh Match/i.test(t) || /Full match:/i.test(t) || /Start here:/i.test(t);
  }

  /* Shelf activity is not a question. Only a real note from them waits for a reply. */
  function isActivityLine(line) {
    var t = String(line || "").trim();
    if (!t) return true;
    if (isMatchLine(t)) return true;
    if (/^(Opened their cabinet\.?|Wrote to you\.?|Signed up\.?|Just opened their shelf\.?)$/i.test(t)) return true;
    if (/^Wishlist:/i.test(t)) return true;
    if (/added .+ to (their )?wishlist/i.test(t)) return true;
    return false;
  }

  function renderMatchFromLine(body) {
    var t = String(body || "");
    var html = '<section class="cabinet-match">';
    html += '<p class="cabinet-kicker">Fresh Match</p>';
    var skin = (t.match(/(Combination|Dry|Oily|Sensitive) skin[^.\n]{0,40}/i) || [])[0];
    html += '<p class="cabinet-match-fact' + (skin ? "" : " is-kind") + '">' + esc(skin ? skin.trim() : "They took Fresh Match.") + "</p>";
    html += "</section>";
    return html;
  }

  function snapCached(person) {
    var mail = String((person && person.email) || "").trim().toLowerCase();
    if (!mail) return null;
    var snap = snapByEmail[mail];
    if (!snap || snap === "loading" || snap.missing) return null;
    return snap;
  }

  function snapOf(person) {
    var mail = String((person && person.email) || "").trim().toLowerCase();
    if (!mail) return null;
    loadSnapshot(mail);
    return snapCached(person);
  }

  function matchKind(snap) {
    var path = String((snap && snap.matchPath) || "").toLowerCase();
    if (path === "both") return "Skincare and supplements";
    if (path === "skin") return "Skincare";
    if (path === "supp") return "Supplements";
    var slugs = ((snap && (snap.startSlugs || snap.matchSlugs)) || []);
    var skin = 0;
    var supp = 0;
    var i;
    for (i = 0; i < slugs.length; i++) {
      if (categoryForSlug(slugs[i]) === "supplements") supp += 1;
      else skin += 1;
    }
    if (skin && supp) return "Skincare and supplements";
    if (supp) return "Supplements";
    if (skin) return "Skincare";
    return "";
  }

  function matchFacts(snap) {
    if (!snap) return [];
    var ans = snap.matchAnswers || {};
    var sum = String(snap.matchSummary || "");
    var path = String(snap.matchPath || "").toLowerCase();
    var out = [];
    var kind = matchKind(snap);
    if (kind) out.push(kind);
    var skin = { dry: "Dry skin", oily: "Oily skin", combo: "Combination skin", sensitive: "Sensitive skin" }[ans.skinType];
    var concern = {
      aging: "fine lines & firmness",
      dehydration: "dehydration",
      breakouts: "breakouts",
      dullness: "dullness & tone",
      eyes: "eye care"
    }[ans.concern];
    if (!skin && /Combination skin/i.test(sum)) skin = "Combination skin";
    else if (!skin && /Dry skin/i.test(sum)) skin = "Dry skin";
    else if (!skin && /Oily skin/i.test(sum)) skin = "Oily skin";
    else if (!skin && /Sensitive skin/i.test(sum)) skin = "Sensitive skin";
    if (!concern && /fine lines/i.test(sum)) concern = "fine lines & firmness";
    var skinLine = [skin, concern].filter(Boolean).join(" · ");
    if (skinLine) out.push(skinLine);
    var inside = "";
    if (ans.approach === "both" || /foundation \+ targeted/i.test(sum)) inside = "Daily foundation + targeted capsules";
    else if (ans.approach === "overall" || /overall foundation/i.test(sum)) inside = "Daily foundation packs";
    else if (ans.approach === "targeted" || /targeted support/i.test(sum)) inside = "Targeted capsules";
    if (inside && (path === "supp" || path === "both" || /foundation|targeted|packs/i.test(sum))) out.push(inside);
    var seen = {};
    return out.filter(function (line) {
      if (!line || seen[line]) return false;
      seen[line] = true;
      return true;
    }).slice(0, 3);
  }

  function matchSlugsOf(snap) {
    if (!snap) return [];
    if (snap.startSlugs && snap.startSlugs.length) return snap.startSlugs;
    return snap.matchSlugs || [];
  }

  function renderMatchThumbs(slugs, named) {
    var list = (slugs || []).filter(Boolean).slice(0, named ? 8 : 5);
    if (!list.length) return "";
    var html = '<div class="cabinet-match-thumbs">';
    var i;
    for (i = 0; i < list.length; i++) {
      html += '<span class="cabinet-match-thumb">';
      html += '<img src="' + esc(productImg(list[i])) + '" alt="" width="40" height="40">';
      if (named) html += "<em>" + esc(shortProduct(nameForSlug(list[i]))) + "</em>";
      html += "</span>";
    }
    html += "</div>";
    return html;
  }

  function renderWishCard(snap) {
    var slugs = ((snap && snap.wishlist) || []).filter(Boolean);
    if (!slugs.length) return "";
    var html = '<section class="cabinet-match">';
    html += '<p class="cabinet-kicker">Wishlist</p>';
    html += renderMatchThumbs(slugs, true);
    html += "</section>";
    return html;
  }

  function renderMatchCard(snap, compact) {
    if (!snap) return "";
    var slugs = matchSlugsOf(snap);
    var facts = matchFacts(snap);
    if (!facts.length && !slugs.length) return "";
    var html = '<section class="cabinet-match' + (compact ? " is-compact" : "") + '">';
    if (!compact) html += '<p class="cabinet-kicker">Fresh Match</p>';
    var i;
    for (i = 0; i < facts.length; i++) {
      html += '<p class="cabinet-match-fact' + (i === 0 ? " is-kind" : "") + '">' + esc(facts[i]) + "</p>";
    }
    if (slugs.length && !compact) html += '<p class="cabinet-match-start">Start here</p>';
    html += renderMatchThumbs(slugs, !compact);
    html += "</section>";
    return html;
  }

  function nameEditBtn(person, jump) {
    return '<button type="button" class="cabinet-name-edit" data-cabinet-open="' + esc(person.id) + '" data-cabinet-jump="' + esc(jump || "people") + '" data-cabinet-name-edit>Edit</button>';
  }

  function openDoorComposer(person) {
    doorMode = true;
    doorUrl = "";
    doorQuery = "";
    doorCat = "all";
    doorSlugs = {};
    if (person) {
      doorName = person.name || "";
      doorEmail = person.email || "";
    } else {
      doorName = "";
      doorEmail = "";
    }
    loadCatalog().then(function () { paint(); });
    paint();
  }

  function selectedSlugs() {
    return Object.keys(doorSlugs).filter(function (slug) { return doorSlugs[slug]; });
  }

  function renderDoor() {
    var html = '<button type="button" class="cabinet-back" data-cabinet-door-close>← Today</button>';
    html += '<header class="cabinet-room-head"><h2>Unique client link</h2>';
    html += '<p class="sec-sub">Mark what they bought, then copy their unique link. Or skip the bottles and send the generic one.</p></header>';
    html += '<div class="cabinet-door-form">';
    html += '<label class="cabinet-compose-label" for="cabinetDoorName">Their first and last name</label>';
    html += '<input id="cabinetDoorName" value="' + esc(doorName) + '" placeholder="First and last name" autocomplete="name">';
    html += '<label class="cabinet-compose-label" for="cabinetDoorEmail">Email</label>';
    html += '<input id="cabinetDoorEmail" type="email" value="' + esc(doorEmail) + '" placeholder="the email on their Ringana order" autocomplete="off">';
    html += '<p class="cabinet-kicker">Bottles they purchased</p>';
    html += '<input id="cabinetDoorSearch" type="search" value="' + esc(doorQuery) + '" placeholder="Search the products" autocomplete="off">';
    html += '<div class="cabinet-door-cats">';
    html += '<button type="button" class="cabinet-door-cat' + (doorCat === "all" ? " on" : "") + '" data-cabinet-door-cat="all">All</button>';
    html += '<button type="button" class="cabinet-door-cat' + (doorCat === "skincare" ? " on" : "") + '" data-cabinet-door-cat="skincare">Skincare</button>';
    html += '<button type="button" class="cabinet-door-cat' + (doorCat === "body" ? " on" : "") + '" data-cabinet-door-cat="body">Everyday</button>';
    html += '<button type="button" class="cabinet-door-cat' + (doorCat === "supplements" ? " on" : "") + '" data-cabinet-door-cat="supplements">Inside</button>';
    html += "</div>";
    html += '<div class="cabinet-door-chips">';
    var q = String(doorQuery || "").trim().toLowerCase();
    var selected = [];
    var rest = [];
    var i;
    for (i = 0; i < catalog.length; i++) {
      var p = catalog[i];
      var marked = !!doorSlugs[p.slug];
      var catOk = doorCat === "all" || p.category === doorCat;
      var qOk = !q || String(p.name + " " + p.slug).toLowerCase().indexOf(q) >= 0;
      if (marked) selected.push(p);
      else if (catOk && qOk) rest.push(p);
    }
    var chips = selected.concat(rest);
    var hidden = chips.length > 80 ? chips.length - 80 : 0;
    chips = chips.slice(0, 80);
    for (i = 0; i < chips.length; i++) {
      html += '<button type="button" class="cabinet-door-chip' + (doorSlugs[chips[i].slug] ? " on" : "") + '" data-cabinet-door-slug="' + esc(chips[i].slug) + '">' + esc(shortProduct(chips[i].name)) + "</button>";
    }
    if (hidden) html += '<p class="sec-sub">Search to see the rest of the line.</p>';
    if (!catalog.length) html += '<p class="sec-sub">Product list loads from The Fresh Shelf.</p>';
    html += "</div>";
    html += '<button type="button" class="btn" data-cabinet-door-make' + (doorBusy ? " disabled" : "") + ">" + (doorBusy ? "Making the door…" : "Copy their unique link") + "</button>";
    html += '<button type="button" class="btn-ghost" data-cabinet-invite>Copy your shelf link instead</button>';
    if (doorUrl) {
      html += '<label class="cabinet-compose-label" for="cabinetDoorUrl">Their door</label>';
      html += '<input id="cabinetDoorUrl" readonly value="' + esc(doorUrl) + '">';
    }
    html += "</div>";
    return html;
  }

  function renderSnapshot(person) {
    var mail = String(person && person.email || "").trim().toLowerCase();
    if (!mail) return "";
    loadSnapshot(mail);
    var snap = snapByEmail[mail];
    var html = '<section class="cabinet-snapshot">';
    html += '<p class="cabinet-kicker">On their shelf</p>';
    if (!snap || snap === "loading") {
      html += '<p class="sec-sub">Looking at their shelf…</p></section>';
      return html;
    }
    if (snap.missing) {
      html += '<p class="sec-sub">Nothing in the cloud yet. They’ll show bottles here once they open their shelf.</p></section>';
      return html;
    }
    var rows = snap.cabinet || [];
    var wish = (snap.wishlist || []).filter(Boolean);
    var i;
    if (rows.length) {
      html += '<p class="sec-sub">' + esc((snap.opened || 0) + " opened · " + (snap.sealed || 0) + " sealed") + "</p>";
      for (i = 0; i < rows.length; i++) {
        html += '<p class="cabinet-snapshot-row"><strong>' + esc(shortProduct(nameForSlug(rows[i].slug))) + "</strong> · " + esc(dueCopy(rows[i])) + "</p>";
      }
    } else if (!wish.length) {
      html += '<p class="sec-sub">No bottles on the cabinet yet.</p>';
    }
    html += renderWishCard(snap);
    html += renderMatchCard(snap);
    var bday = snap.birthday || (person && person.birthday) || "";
    if (bday) html += '<p class="sec-sub">Birthday: ' + esc(prettyBirthday(bday)) + "</p>";
    html += "</section>";
    return html;
  }

  function dueCopy(row) {
    var state = row && row.state ? row.state : "sealed";
    var left = row && typeof row.daysLeft === "number" ? row.daysLeft : null;
    var due = "";
    if (left != null) {
      if (left < 0) due = "past its date";
      else if (left === 0) due = "due today";
      else if (left === 1) due = "due tomorrow";
      else if (left <= 7) due = "due in " + left + " days";
    }
    if (due) return state + " · " + due;
    return state;
  }

  function faqGroups() {
    return (window.FS && window.FS.CABINET_FAQ) || [];
  }

  function findCabinetFaq(id) {
    var groups = faqGroups();
    var g, i, items;
    for (g = 0; g < groups.length; g++) {
      items = groups[g].items || [];
      for (i = 0; i < items.length; i++) {
        if (items[i].id === id) return { group: groups[g], item: items[i] };
      }
    }
    return null;
  }

  function cabinetDoorUrl(token) {
    if (window.FS && typeof window.FS.cabinetDoorUrl === "function") {
      return window.FS.cabinetDoorUrl(token);
    }
    return "";
  }

  function shelfFaqUrl(id) {
    var door = window.FS && typeof window.FS.cabinetInviteUrl === "function"
      ? window.FS.cabinetInviteUrl()
      : "";
    if (!door) return "";
    return door + "#faq=" + encodeURIComponent(id || "");
  }

  function faqLetter(hit) {
    var item = hit.item;
    var title = (hit.group && hit.group.title) || "FAQ";
    return item.q + "\n\n" + item.a + "\n\nThe rest of “" + title + "” is on your shelf, Learn → FAQ:\n" + shelfFaqUrl(item.id);
  }

  function renderFaqPicker() {
    var q = String(faqQuery || "").trim().toLowerCase();
    var html = '<div class="cabinet-faq-pick">';
    html += '<div class="cabinet-faq-pick-head">';
    html += "<p class=\"cabinet-kicker\">Send an FAQ</p>";
    html += '<button type="button" class="text-link" data-cabinet-faq-close>Close</button></div>';
    html += '<input type="search" id="cabinetFaqSearch" placeholder="Search questions" value="' + esc(faqQuery) + '" autocomplete="off" aria-label="Search FAQs">';
    var groups = faqGroups();
    var g, i, items, shown, item, blob;
    var any = false;
    for (g = 0; g < groups.length; g++) {
      items = groups[g].items || [];
      shown = [];
      for (i = 0; i < items.length; i++) {
        item = items[i];
        blob = [groups[g].title, item.q, item.a].join(" ").toLowerCase();
        if (!q || blob.indexOf(q) >= 0) shown.push(item);
      }
      if (!shown.length) continue;
      any = true;
      var open = !!q || faqOpenGroup === groups[g].id;
      html += '<button type="button" class="cabinet-faq-group' + (open ? " is-open" : "") + '" data-cabinet-faq-group="' + esc(groups[g].id) + '" aria-expanded="' + (open ? "true" : "false") + '">';
      html += "<strong>" + esc(groups[g].title) + "</strong>";
      html += "<span>" + shown.length + (shown.length === 1 ? " question" : " questions") + "</span>";
      html += "</button>";
      if (!open) continue;
      for (i = 0; i < shown.length; i++) {
        html += '<button type="button" class="cabinet-faq-choice" data-cabinet-faq-send="' + esc(shown[i].id) + '">';
        html += "<strong>" + esc(shown[i].q) + "</strong></button>";
      }
    }
    if (!any) html += '<p class="sec-sub" style="margin:0">Nothing for that.</p>';
    html += "</div>";
    return html;
  }

  function lastChatMessage(person) {
    var qs = (person && person.questions) || [];
    var last = null;
    var i;
    for (i = 0; i < qs.length; i++) {
      if (isActivityLine(qs[i] && qs[i].body)) continue;
      if (!last || atMs(qs[i].at) >= atMs(last.at)) last = qs[i];
    }
    return last;
  }

  function theyWroteLast(person) {
    var last = lastChatMessage(person);
    return !!(last && last.from === "them");
  }

  function waiting() {
    return people().filter(theyWroteLast);
  }

  function isFresh(person) {
    if (!person) return false;
    if ((person.questions || []).length) return false;
    if (person.deskOpenedAt) return false;
    return true;
  }

  function isNewOnDesk(person) {
    return isFresh(person) && hoursAgo(person.createdAt) < 24;
  }

  function freshPeople() {
    var due = {};
    dueBeats().forEach(function (row) { due[row.person.id] = true; });
    return people().filter(function (p) {
      return isNewOnDesk(p) && !due[p.id];
    });
  }

  function pingCount() {
    return waiting().length + freshPeople().length + dueBeats().length;
  }

  function matchesQuery(person) {
    var q = String(peopleQuery || "").trim().toLowerCase();
    if (!q) return true;
    var blob = [person.name, person.email, person.note, lastLine(person)].join(" ").toLowerCase();
    return blob.indexOf(q) >= 0;
  }

  function setPeopleSort(next) {
    peopleSort = next === "az" || next === "waiting" ? next : "newest";
    var data = read();
    data.sort = peopleSort;
    write(data);
  }

  function sortedPeople(list, sort) {
    var rows = (list || []).slice();
    var mode = sort || peopleSort;
    if (mode === "az") {
      rows.sort(function (a, b) {
        return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
      });
    } else if (mode === "waiting") {
      rows.sort(function (a, b) {
        var du = (theyWroteLast(b) ? 1 : 0) - (theyWroteLast(a) ? 1 : 0);
        if (du) return du;
        var df = (isNewOnDesk(b) ? 1 : 0) - (isNewOnDesk(a) ? 1 : 0);
        if (df) return df;
        return String(lastAt(b)).localeCompare(String(lastAt(a)));
      });
    } else {
      rows.sort(function (a, b) {
        return String(lastAt(b)).localeCompare(String(lastAt(a)));
      });
    }
    return rows;
  }

  function daysOld(iso) {
    if (!iso) return 0;
    var d = new Date(iso);
    if (isNaN(d.getTime())) return 0;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  }

  function fillCare(body, person) {
    return String(body || "")
      .replace(/\{first\}/gi, firstName(person && person.name))
      .replace(/\{name\}/gi, firstName(person && person.name));
  }

  function hoursAgo(iso) {
    if (!iso) return 0;
    var t = new Date(iso).getTime();
    if (isNaN(t)) return 0;
    return (Date.now() - t) / 36e5;
  }

  function beatSent(person, id) {
    if (!person) return true;
    var beats = person.careBeats || {};
    if (beats[id]) return true;
    if (id === "welcome" && person.careSent) return true;
    return false;
  }

  function markBeat(person, id, skipped) {
    if (!person) return;
    person.careBeats = person.careBeats || {};
    person.careBeats[id] = nowIso();
    if (id === "welcome") {
      person.careSent = true;
      persistCare(person, skipped ? { careSkipped: true } : { careSent: true });
    }
    savePerson(person);
  }

  function welcomeAnchor(person) {
    var mail = String((person && person.email) || "").toLowerCase();
    var snap = snapByEmail[mail];
    if (snap && snap !== "loading" && !snap.missing && snap.installedAt) return snap.installedAt;
    return (person && person.createdAt) || "";
  }

  function learnState(person) {
    var mail = String((person && person.email) || "").toLowerCase();
    var snap = snapByEmail[mail];
    if (!snap || snap === "loading" || snap.missing) return "unknown";
    if (snap.learnTracked !== true && !("learnOpenedAt" in snap)) return "unknown";
    return snap.learnOpenedAt ? "yes" : "no";
  }

  function seqById(id) {
    var list = careSettings().sequences || [];
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function dueBeats() {
    var care = careSettings();
    var out = [];
    var list = people();
    var i;
    var s;
    for (i = 0; i < list.length; i++) {
      var p = list[i];
      if (p.careOff) continue;
      for (s = 0; s < (care.sequences || []).length; s++) {
        var seq = care.sequences[s];
        if (!seq.on || beatSent(p, seq.id)) continue;
        if (seq.id === "welcome") {
          if ((p.questions || []).length) continue;
          if (hoursAgo(welcomeAnchor(p)) < Number(seq.hours || 2)) continue;
          out.push({ person: p, seq: seq });
        }
        if (seq.id === "learn") {
          if (daysOld(p.createdAt) < Number(seq.days || 5)) continue;
          if (learnState(p) !== "no") continue;
          out.push({ person: p, seq: seq });
        }
      }
    }
    return out;
  }

  function beatWhy(person, seq) {
    if (seq.id === "learn") return "Hasn’t opened Learn yet";
    var days = daysOld(welcomeAnchor(person) || person.createdAt);
    if (days <= 0) return "Opened today";
    if (days === 1) return "1 day on your list";
    return days + " days on your list";
  }

  function autoGoBtn() {
    return '<button type="button" class="cabinet-auto-go" data-cabinet-room="auto" data-clients-tour="auto">Edit <span aria-hidden="true">→</span></button>';
  }

  function renderAutoSection(care) {
    var html = '<section class="cabinet-section" data-clients-tour="status">';
    html += '<div class="cabinet-auto-head">';
    html += '<p class="cabinet-kicker">Automated messages</p>';
    html += autoGoBtn();
    html += "</div>";
    if (care.length) {
      html += '<p class="cabinet-hello-lede">Welcome and Learn wait here for you to send or skip. They only go out on their own if you turn that on.</p>';
    } else {
      html += '<p class="cabinet-hello-lede">Nothing waiting right now. Welcome is a couple of hours after they open — unless they’re already writing you. Learn is day 5 if they haven’t opened that tab.</p>';
    }
    if (care.length) {
      html += '<div class="cabinet-cards cabinet-auto-cards">';
      var i;
      for (i = 0; i < care.length; i++) {
        var row = care[i];
        var p = row.person;
        var seq = row.seq;
        html += '<article class="cabinet-hello">';
        html += '<button type="button" class="cabinet-hello-main" data-cabinet-open="' + esc(p.id) + '" data-cabinet-jump="people">';
        html += '<span class="cabinet-mark" aria-hidden="true">' + esc(initial(p.name)) + "</span>";
        html += '<span class="cabinet-hello-copy"><strong>' + esc(p.name) + "</strong>";
        html += '<span class="cabinet-hello-why">' + esc(seq.title) + " · " + esc(beatWhy(p, seq)) + "</span>";
        html += '<span class="cabinet-hello-preview">' + esc(fillCare(seq.body, p)) + "</span></span></button>";
        html += '<div class="cabinet-hello-actions">';
        html += '<button type="button" class="btn" data-cabinet-care="' + esc(p.id) + '" data-cabinet-beat="' + esc(seq.id) + '">Send ' + esc(seq.title.toLowerCase()) + "</button>";
        html += '<button type="button" class="btn-ghost" data-cabinet-skip="' + esc(p.id) + '" data-cabinet-beat="' + esc(seq.id) + '">Skip</button>';
        html += "</div></article>";
      }
      html += "</div>";
    }
    html += "</section>";
    return html;
  }

  function personNeedsSnap(person) {
    if (!person || !person.email) return false;
    var mail = String(person.email || "").trim().toLowerCase();
    if (!mail) return false;
    if (snapByEmail[mail] && snapByEmail[mail] !== "loading") return false;
    if (personId && person.id === personId) return true;
    return isMatchLine(lastLine(person) || person.note || "");
  }

  function emailsNeedingSnap() {
    var seen = {};
    var out = [];
    function add(person) {
      if (!personNeedsSnap(person)) return;
      var mail = String(person.email || "").trim().toLowerCase();
      if (!mail || seen[mail]) return;
      seen[mail] = true;
      out.push(mail);
    }
    if (personId) add(personById(personId));
    var wait = waiting();
    var fresh = freshPeople();
    var care = dueBeats();
    var i;
    for (i = 0; i < wait.length; i++) add(wait[i]);
    for (i = 0; i < fresh.length; i++) add(fresh[i]);
    for (i = 0; i < care.length; i++) add(care[i].person);
    if (room === "people" || room === "mail") {
      var list = people();
      for (i = 0; i < list.length && out.length < 8; i++) add(list[i]);
    }
    return out.slice(0, 12);
  }

  function prefetchCareSnaps() {
    var mails = emailsNeedingSnap();
    var i;
    for (i = 0; i < mails.length; i++) loadSnapshot(mails[i]);
  }

  function applyCloud(rows, opts) {
    opts = opts || {};
    var data = read();
    var byEmail = {};
    var i;
    for (i = 0; i < data.people.length; i++) {
      var email = String(data.people[i].email || "").toLowerCase();
      if (email) byEmail[email] = data.people[i];
    }
    for (i = 0; i < (rows || []).length; i++) {
      var row = rows[i];
      var mail = String(row.email || "").trim().toLowerCase();
      if (!mail || droppedMails[mail]) continue;
      var existing = byEmail[mail];
      var line = String(row.last_line || "").trim();
      if (!line && row.last_event === "mail") line = String(row.note || "").trim();
      if (!existing) {
        existing = {
          id: row.id || uid(),
          email: mail,
          name: String(row.name || "").trim() || mail.split("@")[0],
          createdAt: row.joined_at || nowIso(),
          seenAt: row.seen_at || row.joined_at || nowIso(),
          note: row.note || (line ? line : "Opened their cabinet."),
          careOff: !!row.care_off,
          careSent: !!(row.care_sent_at || row.care_skipped_at),
          birthday: String(row.birthday || ""),
          questions: []
        };
        data.people.push(existing);
        byEmail[mail] = existing;
      } else {
        if (row.id && !existing.id) existing.id = row.id;
        adoptName(existing, row.name);
        if (row.note) existing.note = row.note;
        else if (line) existing.note = line;
        else if (!existing.note) existing.note = "Opened their cabinet.";
        if (row.seen_at) existing.seenAt = row.seen_at;
        if (row.joined_at && !existing.createdAt) existing.createdAt = row.joined_at;
        if (row.care_sent_at || row.care_skipped_at) existing.careSent = true;
        else if (existing.careSent && !careBackfilled[mail]) {
          careBackfilled[mail] = true;
          persistCare(existing, { careSent: true });
        }
        if (row.care_off) existing.careOff = true;
        else if (existing.careOff && !careBackfilled[mail + ":off"]) {
          careBackfilled[mail + ":off"] = true;
          persistCare(existing, { careOff: true });
        } else if ("care_off" in row) existing.careOff = false;
        if (row.birthday) existing.birthday = String(row.birthday);
      }
      existing.questions = existing.questions || [];
      var cloudThread = Array.isArray(row.thread) ? row.thread : [];
      var t;
      for (t = 0; t < cloudThread.length; t++) {
        var item = cloudThread[t] || {};
        var body = String(item.body || "").trim();
        if (!body) continue;
        var from = item.from === "you" ? "you" : "them";
        var hasCloud = false;
        var q;
        for (q = 0; q < existing.questions.length; q++) {
          if (existing.questions[q].body === body && existing.questions[q].from === from) hasCloud = true;
        }
        if (!hasCloud) {
          existing.questions.push({
            id: (row.id || uid()) + "-t" + t,
            from: from,
            body: body,
            at: incomingAt(item.at || row.seen_at, existing.questions, from, false),
            readAt: from === "you" ? (item.at || nowIso()) : ""
          });
        }
      }
      if (line && row.last_event === "mail" && !isActivityLine(line)) {
        var has = false;
        for (q = 0; q < existing.questions.length; q++) {
          if (existing.questions[q].body === line) has = true;
        }
        if (!has) {
          existing.questions.push({
            id: (row.id || uid()) + "-mail",
            from: "them",
            body: line,
            at: incomingAt(row.seen_at, existing.questions, "them", true),
            readAt: ""
          });
        }
      }
    }
    data.people = data.people.filter(function (p) {
      return !droppedMails[String(p.email || "").trim().toLowerCase()];
    });
    if (opts.replace && Array.isArray(rows) && !(composing() && !rows.length)) {
      var keep = {};
      for (i = 0; i < rows.length; i++) {
        var keepMail = String(rows[i].email || "").trim().toLowerCase();
        if (keepMail && !droppedMails[keepMail]) keep[keepMail] = true;
      }
      data.people = data.people.filter(function (p) {
        var kept = String(p.email || "").trim().toLowerCase();
        return kept && keep[kept];
      });
    }
    write(data);
  }

  var lastSent = { personId: "", body: "", at: 0 };

  function snapshotDraft() {
    var el = document.getElementById("cabinetMailDraft");
    if (!el) return null;
    return {
      personId: el.getAttribute("data-for") || "",
      value: el.value,
      start: el.selectionStart,
      end: el.selectionEnd
    };
  }

  function justSent(snap) {
    if (!snap || !lastSent.body) return false;
    if (snap.personId !== lastSent.personId) return false;
    if (String(snap.value || "").trim() !== lastSent.body) return false;
    return Date.now() - lastSent.at < 8000;
  }

  function restoreDraft(snap) {
    if (!snap || snap.personId !== personId || justSent(snap)) return;
    var el = document.getElementById("cabinetMailDraft");
    if (!el) return;
    el.value = snap.value || "";
    try {
      if (typeof snap.start === "number") el.setSelectionRange(snap.start, snap.end);
    } catch (e) {}
  }

  function sizeDraft() {
    var el = document.getElementById("cabinetMailDraft");
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(120, Math.max(40, el.scrollHeight)) + "px";
    syncComposerPad();
  }

  function lastThreadLetter() {
    var el = document.getElementById("cabinetBubbles");
    if (!el) return null;
    var letters = el.querySelectorAll(".cabinet-letter");
    return letters.length ? letters[letters.length - 1] : null;
  }

  function dockHeight() {
    var dock = document.getElementById("cabinetComposerDock");
    if (!dock || dock.hidden) return 0;
    return Math.ceil(dock.getBoundingClientRect().height) || 0;
  }

  function fitThreadToDock() {
    var chat = document.querySelector(".cabinet-chat");
    var dock = document.getElementById("cabinetComposerDock");
    if (!chat) return;
    if (!dock || dock.hidden || !document.body.classList.contains("cabinet-thread-open")) {
      chat.style.minHeight = "";
      return;
    }
    pinComposerToView();
    var bar = document.querySelector(".cabinet-chat-bar");
    var top = (bar || chat).getBoundingClientRect().top;
    var h = Math.floor(dock.getBoundingClientRect().top - top);
    chat.style.minHeight = (h > 120 ? h : 120) + "px";
  }

  function syncComposerPad() {
    var dock = document.getElementById("cabinetComposerDock");
    if (!dock || dock.hidden || !document.body.classList.contains("cabinet-thread-open")) {
      document.documentElement.style.removeProperty("--cabinet-composer-h");
      var chat = document.querySelector(".cabinet-chat");
      if (chat) chat.style.minHeight = "";
      pinComposerToView();
      return;
    }
    var h = dockHeight();
    if (h < 64) h = 72;
    document.documentElement.style.setProperty("--cabinet-composer-h", h + "px");
    pinComposerToView();
    fitThreadToDock();
  }

  function pinComposerToView() {
    var dock = document.getElementById("cabinetComposerDock");
    if (!dock) return;
    if (dock.hidden || !document.body.classList.contains("cabinet-thread-open")) {
      dock.classList.remove("is-kb-pin");
      dock.style.top = "";
      dock.style.bottom = "";
      return;
    }
    var vv = window.visualViewport;
    dock.classList.add("is-kb-pin");
    if (!vv || !vv.height) {
      dock.style.top = "";
      dock.style.bottom = "0px";
      return;
    }
    var layoutH = document.documentElement.clientHeight || window.innerHeight || vv.height;
    var visibleBottom = (vv.offsetTop || 0) + vv.height;
    var gap = Math.max(0, Math.round(layoutH - visibleBottom));
    dock.style.top = "auto";
    dock.style.bottom = gap > 0 ? gap + "px" : "0px";
  }

  function wireComposerPin() {
    if (wireComposerPin.bound) return;
    wireComposerPin.bound = true;
    var pin = function () {
      pinComposerToView();
      fitThreadToDock();
    };
    var vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", pin);
      vv.addEventListener("scroll", pin);
    }
    window.addEventListener("resize", pin);
    document.addEventListener("focusin", function (e) {
      if (!e || !e.target || e.target.id !== "cabinetMailDraft") return;
      pin();
      requestAnimationFrame(pin);
      setTimeout(pin, 80);
      setTimeout(pin, 280);
      setTimeout(pin, 500);
    });
    document.addEventListener("focusout", function (e) {
      if (!e || !e.target || e.target.id !== "cabinetMailDraft") return;
      setTimeout(pin, 0);
      setTimeout(pin, 80);
    });
  }

  function clearComposerDock() {
    var dock = document.getElementById("cabinetComposerDock");
    if (!dock) return;
    dock.innerHTML = "";
    dock.hidden = true;
    syncComposerPad();
  }

  function dockComposer() {
    var dock = document.getElementById("cabinetComposerDock");
    if (!dock) return;
    dock.innerHTML = "";
    var root = document.getElementById("cabinetDeskRoot");
    var faq = root && root.querySelector(".cabinet-faq-pick");
    var composer = root && root.querySelector(".cabinet-composer");
    if (document.body.classList.contains("cabinet-thread-open") && composer) {
      if (faq) dock.appendChild(faq);
      dock.appendChild(composer);
      dock.hidden = false;
    } else {
      dock.hidden = true;
    }
    syncComposerPad();
    pinComposerToView();
    requestAnimationFrame(pinComposerToView);
  }

  function scrollChat() {
    var el = document.getElementById("cabinetBubbles");
    if (!el) return;
    if (!document.body.classList.contains("cabinet-thread-open")) {
      el.scrollTop = el.scrollHeight;
      return;
    }
    pinComposerToView();
    fitThreadToDock();
    var last = lastThreadLetter();
    var dock = document.getElementById("cabinetComposerDock");
    var layout = document.querySelector(".layout");
    if (!last || !dock || dock.hidden || !layout) return;
    var need = last.getBoundingClientRect().bottom + 12 - dock.getBoundingClientRect().top;
    if (need > 1) layout.scrollTop += need;
  }

  function composing() {
    var id = document.activeElement && document.activeElement.id;
    if (id === "cabinetMailDraft" || id === "cabinetWeekNote" || id === "cabinetWeekSearch" || id === "cabinetSaleSearch" || id === "cabinetWeekPercent" || id === "cabinetBlast" || id === "cabinetFaqSearch" || id === "cabinetPersonName" || id === "cabinetShopWeblink" || id === "settingsCabinetShopInput") return true;
    var el = document.activeElement;
    return !!(el && el.getAttribute && (el.getAttribute("data-auto-body") || el.getAttribute("data-auto-title") || el.getAttribute("data-auto-when")));
  }

  function rosterIsFresh() {
    return !!(lastHydrateOk && Date.now() - lastHydrateOk < 60000 && !rosterCloudError);
  }

  function deskAllowed() {
    try {
      var Cloud = window.FS && window.FS.Cloud;
      if (!Cloud) return false;
      if (Cloud.bootReady && !Cloud.bootReady()) return false;
      if (Cloud.canUseCabinetDesk) return !!Cloud.canUseCabinetDesk();
      if (Cloud.packIsEvergreen && Cloud.packIsEvergreen()) return false;
    } catch (e) {}
    return false;
  }

  function renderLoad() {
    var html = '<div class="cabinet-load" role="status" aria-live="polite">';
    html += '<div class="cabinet-load-bloom" aria-hidden="true">';
    html += '<svg viewBox="0 0 48 48" width="88" height="88" overflow="visible">';
    html += '<defs><radialGradient id="cabinetLoadBloom" cx="50%" cy="42%" r="62%">';
    html += '<stop offset="0%" stop-color="#fff4c8"/>';
    html += '<stop offset="45%" stop-color="#f0d06a"/>';
    html += '<stop offset="100%" stop-color="#c9922e"/>';
    html += "</radialGradient></defs>";
    var i;
    for (i = 0; i < 5; i++) {
      html += '<g class="cabinet-load-petal" style="--i:' + i + '">';
      html += '<ellipse cx="24" cy="24" rx="5.2" ry="17" fill="url(#cabinetLoadBloom)" transform="rotate(' + (i * 72) + ' 24 24)"/>';
      html += "</g>";
    }
    html += '<g class="cabinet-load-heart">';
    html += '<circle cx="24" cy="24" r="4.4" fill="#5a4a37"/>';
    html += '<circle cx="24" cy="24" r="2.5" fill="#e8c45a" opacity=".92"/>';
    html += '<circle cx="24" cy="24" r="3.1" fill="#fff4c8" opacity=".5"/>';
    html += "</g></svg></div>";
    html += '<p class="cabinet-load-kicker">The Fresh Shelf</p>';
    html += '<p class="cabinet-load-copy">Gathering your people…</p>';
    html += "</div>";
    return html;
  }

  function finishFreshPaint() {
    waitingForFresh = false;
    document.body.classList.remove("cabinet-desk-loading");
    paint({ fresh: true });
    if (window.FS && typeof window.FS.maybeStartClientsTour === "function") {
      window.FS.maybeStartClientsTour();
    }
  }

  function enterDesk() {
    if (rosterIsFresh()) {
      waitingForFresh = false;
      paint({ fresh: true });
      return;
    }
    waitingForFresh = true;
    paint();
    if (!hydrateInFlight) hydrate({ force: true });
  }

  function schedulePaint(opts) {
    if (waitingForFresh && !(opts && opts.fresh)) return;
    if (opts && opts.now) {
      if (paintTimer) {
        window.clearTimeout(paintTimer);
        paintTimer = 0;
      }
      paintQueued = null;
      paint(opts);
      return;
    }
    paintQueued = opts || paintQueued || {};
    if (paintTimer) return;
    paintTimer = window.setTimeout(function () {
      paintTimer = 0;
      var next = paintQueued || {};
      paintQueued = null;
      if (composing() && !next.clearDraft) return;
      paint(next);
    }, 80);
  }

  function hydrate(opts) {
    opts = opts || {};
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.listCabinetPeople !== "function") {
      finishFreshPaint();
      return;
    }
    if (!deskAllowed()) return;
    if (!opts.force && rosterIsFresh()) return;
    if (hydrateInFlight) {
      hydrateAgain = true;
      return;
    }
    hydrateInFlight = true;
    Cloud.listCabinetPeople({ force: !!opts.force }).then(function (rows) {
      if (!Array.isArray(rows)) {
        rosterCloudError = true;
        if (hydrateTries < 6) {
          hydrateTries += 1;
          if (!composing()) schedulePaint();
          window.setTimeout(function () { hydrate({ force: true }); }, 500 * hydrateTries);
          return;
        }
        if (!composing()) finishFreshPaint();
        return;
      }
      rosterCloudError = false;
      /* A first empty can be a session that is not ready yet. Do not wipe
         the phone roster until empty comes back a few times, or the list
         already had nobody on it. */
      if (!rows.length && people().length && hydrateTries < 3) {
        hydrateTries += 1;
        if (!composing()) schedulePaint();
        window.setTimeout(function () { hydrate({ force: true }); }, 500 * hydrateTries);
        return;
      }
      applyCloud(rows, { replace: true });
      lastHydrateOk = Date.now();
      hydrateTries = 0;
      loadBirthdays();
      prefetchCareSnaps();
      if (composing() && !waitingForFresh) {
        return;
      }
      finishFreshPaint();
      maybeAutoSend();
    }).catch(function () {
      rosterCloudError = true;
      if (hydrateTries < 6) {
        hydrateTries += 1;
        if (!composing()) schedulePaint();
        window.setTimeout(function () { hydrate({ force: true }); }, 500 * hydrateTries);
        return;
      }
      if (!composing()) finishFreshPaint();
    }).then(function () {
      hydrateInFlight = false;
      if (hydrateAgain) {
        hydrateAgain = false;
        hydrate({ force: true });
      }
    });
  }

  function markRead(id) {
    var person = personById(id);
    if (!person) return;
    var qs = person.questions || [];
    var dirty = false;
    for (var i = 0; i < qs.length; i++) {
      if (qs[i].from === "them" && !qs[i].readAt) {
        qs[i].readAt = nowIso();
        dirty = true;
      }
    }
    if (dirty) savePerson(person);
  }

  function markOpened(id) {
    var person = personById(id);
    if (!person || person.deskOpenedAt) return;
    person.deskOpenedAt = nowIso();
    savePerson(person);
  }

  function pingShelf(person, line, eventKey) {
    if (!person || isPreview(person)) return Promise.resolve({ ok: true, skipped: true });
    var email = String(person.email || "").trim().toLowerCase();
    if (email.indexOf("@") < 0) return Promise.resolve({ ok: false });
    var Cloud = window.FS && window.FS.Cloud;
    if (!Cloud || typeof Cloud.replyCabinetPerson !== "function") {
      return Promise.resolve({ ok: false });
    }
    var send = function (tries) {
      return Cloud.replyCabinetPerson(email, line, eventKey).then(function (data) {
        if (data && data.ok === false && tries < 2) {
          return new Promise(function (resolve) {
            window.setTimeout(function () { resolve(send(tries + 1)); }, 1200);
          });
        }
        return data || { ok: true };
      }).catch(function () {
        if (tries < 2) {
          return new Promise(function (resolve) {
            window.setTimeout(function () { resolve(send(tries + 1)); }, 1200);
          });
        }
        return { ok: false };
      });
    };
    return send(0);
  }

  function writeTo(id, body) {
    var text = String(body || "").trim();
    if (!text) throw new Error("Write something first.");
    var person = personById(id);
    if (!person) throw new Error("Pick someone first.");
    var msgId = uid();
    person.questions = person.questions || [];
    person.questions.push({ id: msgId, from: "you", body: text, at: nowIso(), readAt: nowIso() });
    lastSent = { personId: id, body: text, at: Date.now() };
    savePerson(person);
    pingShelf(person, text, "reply:" + String(person.email || "").toLowerCase() + ":" + msgId)
      .then(function (data) {
        if (data && data.ok === false) {
          toast("Couldn’t reach their shelf. The line is on your desk — try Send again.", "bad");
        }
      });
  }

  function sendBeat(personId, seqId) {
    var person = personById(personId);
    var seq = seqById(seqId);
    if (!person || !seq) return false;
    var line = String(fillCare(seq.body, person) || "").trim();
    if (!line) {
      toast("Write a line in Automations first.", "bad");
      return false;
    }
    var msgId = uid();
    person.questions = person.questions || [];
    person.questions.push({
      id: msgId,
      from: "you",
      body: line,
      at: nowIso(),
      readAt: nowIso()
    });
    markBeat(person, seq.id, false);
    pingShelf(person, line, "reply:" + String(person.email || "").toLowerCase() + ":" + msgId)
      .then(function (data) {
        if (data && data.ok === false) {
          toast("Couldn’t reach their shelf. The line is on your desk — try Send again.", "bad");
        }
      });
    return true;
  }

  function skipBeat(personId, seqId) {
    var person = personById(personId);
    if (!person || !seqId) return;
    markBeat(person, seqId, true);
  }

  function maybeAutoSend() {
    if (autoBusy || !careSettings().autoSend) return;
    var due = dueBeats();
    if (!due.length) return;
    autoBusy = true;
    var i;
    var sent = 0;
    for (i = 0; i < due.length; i++) {
      if (sendBeat(due[i].person.id, due[i].seq.id)) sent += 1;
    }
    autoBusy = false;
    if (sent) toast(sent === 1 ? "Sent a note to their Messages." : "Sent " + sent + " notes.", "good");
    if (!composing()) paint();
  }

  function setCareOff(id, off) {
    var person = personById(id);
    if (!person) return;
    person.careOff = !!off;
    savePerson(person);
    persistCare(person, { careOff: !!off }, { warn: true });
  }

  function prettyBirthday(raw) {
    var parts = String(raw || "").split("-");
    if (parts.length !== 2) return String(raw || "");
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months[Number(parts[0]) - 1];
    var day = Number(parts[1]);
    if (!month || !day) return String(raw || "");
    return month + " " + day;
  }

  function daysUntilMd(md) {
    var parts = String(md || "").split("-");
    var month = Number(parts[0]);
    var day = Number(parts[1]);
    if (!month || !day) return null;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var next = month === 2 && day === 29 && now.getFullYear() % 4 !== 0
      ? new Date(now.getFullYear(), 1, 28)
      : new Date(now.getFullYear(), month - 1, day);
    if (next < today) {
      next = month === 2 && day === 29 && (now.getFullYear() + 1) % 4 !== 0
        ? new Date(now.getFullYear() + 1, 1, 28)
        : new Date(now.getFullYear() + 1, month - 1, day);
    }
    return Math.round((next.getTime() - today.getTime()) / 86400000);
  }

  function birthdaySoon() {
    var list = people();
    var out = [];
    var i;
    for (i = 0; i < list.length; i++) {
      var n = daysUntilMd(list[i].birthday);
      if (n == null || n > 14) continue;
      out.push({ person: list[i], days: n });
    }
    out.sort(function (a, b) { return a.days - b.days; });
    return out.slice(0, 8);
  }

  function birthdayWhen(days) {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return "In " + days + " days";
  }

  function renderBirthdays() {
    var soon = birthdaySoon();
    if (!soon.length) return "";
    var html = '<section class="cabinet-section"><p class="cabinet-kicker">Birthdays</p><div class="cabinet-cards">';
    var i;
    for (i = 0; i < soon.length; i++) {
      var row = soon[i];
      var p = row.person;
      html += '<button type="button" class="cabinet-person is-birthday" data-cabinet-open="' + esc(p.id) + '" data-cabinet-jump="people">';
      html += '<span class="cabinet-mark" aria-hidden="true">' + esc(initial(p.name)) + "</span>";
      html += '<span class="cabinet-chat-copy"><span class="cabinet-chat-top"><strong>' + esc(p.name) + "</strong>";
      html += '<time class="cabinet-chat-time">' + esc(birthdayWhen(row.days)) + "</time></span>";
      html += '<span class="cabinet-preview">' + esc(prettyBirthday(p.birthday)) + "</span></span></button>";
    }
    html += "</div></section>";
    return html;
  }

  function niceWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function emptyCard(title, sub, invite) {
    var html = '<div class="cabinet-empty"><p>' + esc(title) + "</p>";
    if (sub) html += '<p class="cabinet-empty-sub">' + esc(sub) + "</p>";
    if (invite) html += '<div class="cabinet-empty-go">' + linkRow() + "</div>";
    html += "</div>";
    return html;
  }

  function metaLine(person) {
    var status = statusCopy(person);
    var when = relativeWhen(lastAt(person));
    return status + (when ? " · " + when : "");
  }

  function chatPreview(person, override) {
    if (override != null) return override;
    var last = lastMessage(person);
    var line = lastLine(person) || person.note || "";
    if (isMatchLine(line)) {
      var snap = snapCached(person);
      var kind = matchKind(snap);
      return kind ? "Fresh Match · " + kind : "Took Fresh Match";
    }
    if (last && last.from === "you" && line) return "You · " + line;
    if (line) return line;
    if (isFresh(person)) return "Just opened their shelf.";
    return "No messages yet";
  }

  function personRow(person, opts) {
    opts = opts || {};
    var un = unreadCount(person);
    var fresh = isFresh(person);
    var waitingOnYou = theyWroteLast(person);
    var unread = waitingOnYou || un > 0 || fresh;
    var preview = chatPreview(person, opts.preview);
    var when = threadWhen(lastAt(person));
    var jump = opts.jump || "mail";
    var html = '<div class="cabinet-person-wrap' + (unread ? " is-unread" : "") + '">';
    html += '<button type="button" class="cabinet-person' + (unread ? " is-unread" : "") + '" data-cabinet-open="' + esc(person.id) + '" data-cabinet-jump="' + esc(jump) + '">';
    html += '<span class="cabinet-mark" aria-hidden="true">' + esc(initial(person.name)) + "</span>";
    html += '<span class="cabinet-chat-copy">';
    html += '<span class="cabinet-chat-top"><strong>' + esc(person.name) + "</strong>";
    if (when) html += '<time class="cabinet-chat-time">' + esc(when) + "</time>";
    html += "</span>";
    html += '<span class="cabinet-preview">' + esc(preview) + "</span>";
    if (isMatchLine(lastLine(person) || person.note || "")) html += renderMatchThumbs(matchSlugsOf(snapCached(person)));
    html += "</span>";
    if (unread) html += '<span class="cabinet-card-dot" aria-hidden="true"></span>';
    html += "</button>";
    if (opts.edit !== false) html += nameEditBtn(person, "people");
    html += "</div>";
    return html;
  }

  function setSegDot(btn, on) {
    var dot = btn.querySelector(".cabinet-seg-dot");
    if (!dot) return;
    if (on) dot.removeAttribute("hidden");
    else dot.setAttribute("hidden", "");
  }

  function paintCabinetNavDot() {
    var btn = document.querySelector('.bottom-nav-btn[data-tab="customers"]');
    if (!btn) return;
    btn.classList.toggle("has-cabinet-dot", pingCount() > 0);
  }

  function shownRoom() {
    if (room === "mail") return "mail";
    if (room === "people") return "people";
    if (room === "auto") return "auto";
    return "today";
  }

  function renderSeg() {
    var wrap = document.getElementById("cabinetDeskSeg");
    if (!wrap) return;
    var wait = waiting().length;
    var fresh = freshPeople().length;
    var shown = shownRoom();
    var btns = wrap.querySelectorAll("[data-cabinet-room]");
    for (var i = 0; i < btns.length; i++) {
      var id = btns[i].getAttribute("data-cabinet-room");
      var on = id === shown;
      btns[i].classList.toggle("on", on);
      btns[i].setAttribute("aria-selected", on ? "true" : "false");
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
      if (id === "today") setSegDot(btns[i], wait > 0 || fresh > 0 || dueBeats().length > 0);
      if (id === "people") setSegDot(btns[i], fresh > 0);
      if (id === "mail") setSegDot(btns[i], wait > 0);
    }
    paintCabinetNavDot();
  }

  function cancelSearchPaint() {
    if (!searchPaintRaf) return;
    cancelAnimationFrame(searchPaintRaf);
    searchPaintRaf = 0;
  }

  function scheduleSearchPaint() {
    if (searchPaintRaf) return;
    searchPaintRaf = requestAnimationFrame(function () {
      searchPaintRaf = 0;
      paint();
    });
  }

  function snapshotSearch() {
    var el = document.getElementById("cabinetPeopleSearch");
    if (!el) return null;
    return { value: el.value, start: el.selectionStart, end: el.selectionEnd };
  }

  function restoreSearch(snap) {
    var el = document.getElementById("cabinetPeopleSearch");
    if (!el) return;
    if (snap && typeof snap.value === "string") el.value = snap.value;
    else el.value = peopleQuery;
    try {
      if (snap && typeof snap.start === "number") el.setSelectionRange(snap.start, snap.end);
    } catch (e) {}
  }

  function snapshotFaqSearch() {
    var el = document.getElementById("cabinetFaqSearch");
    if (!el) return null;
    return { value: el.value, start: el.selectionStart, end: el.selectionEnd };
  }

  function restoreFaqSearch(snap) {
    var el = document.getElementById("cabinetFaqSearch");
    if (!el) return;
    if (snap && typeof snap.value === "string") el.value = snap.value;
    else el.value = faqQuery;
    try {
      if (snap && typeof snap.start === "number") el.setSelectionRange(snap.start, snap.end);
    } catch (e) {}
  }

  function renderToolbar(opts) {
    opts = opts || {};
    var html = '<div class="cabinet-toolbar">';
    html += '<input type="search" id="cabinetPeopleSearch" placeholder="Search clients" value="' + esc(peopleQuery) + '" autocomplete="off" aria-label="Search clients">';
    if (!opts.hideSort) {
      html += '<select id="cabinetPeopleSort" aria-label="Sort clients">';
      html += '<option value="newest"' + (peopleSort === "newest" ? " selected" : "") + ">Newest</option>";
      html += '<option value="az"' + (peopleSort === "az" ? " selected" : "") + ">A–Z</option>";
      html += '<option value="waiting"' + (peopleSort === "waiting" ? " selected" : "") + ">Needs a reply</option>";
      html += "</select>";
    }
    html += "</div>";
    return html;
  }

  function saleSlugList() {
    return Object.keys(saleSlugs).filter(Boolean);
  }

  function packedWeekSlugs() {
    var sale = saleSlugList();
    if (weekSlug) return [weekSlug].concat(sale);
    if (sale.length) return [SALE_MARK].concat(sale);
    return [];
  }

  function productLabel(slug) {
    var i;
    for (i = 0; i < catalog.length; i++) {
      if (catalog[i].slug === slug) return shortProduct(catalog[i].name);
    }
    return "";
  }

  function applyWeekRow(week) {
    if (!week) return;
    weekNote = String(week.note || "");
    weekActive = !!week.active;
    weekPercent = Math.min(50, Math.max(0, Number(week.percent) || 0));
    weekSlug = "";
    saleSlugs = {};
    var raw = Array.isArray(week.slugs) ? week.slugs : [];
    var marked = raw[0] === SALE_MARK;
    var real = [];
    var i;
    for (i = 0; i < raw.length; i++) {
      if (raw[i] && raw[i] !== SALE_MARK) real.push(String(raw[i]));
    }
    if (marked) {
      for (i = 0; i < real.length; i++) saleSlugs[real[i]] = true;
    } else if (real.length === 1 && weekPercent > 0) {
      weekSlug = real[0];
      saleSlugs[real[0]] = true;
    } else {
      weekSlug = real[0] || "";
      for (i = 1; i < real.length; i++) saleSlugs[real[i]] = true;
    }
    weekAuto = !weekSlug;
  }

  function renderToday() {
    var list = people();
    var wait = waiting();
    var fresh = freshPeople();
    var care = dueBeats();
    var html = "";
    if (!list.length) {
      html += renderHomeCards();
      html += emptyCard("Quiet so far.", "Copy your shelf link up top for anyone who’s curious.");
      html += renderAutoSection([]);
      return html;
    }
    html += renderHomeCards();
    html += renderBirthdays();
    if (uniqueDoorsOn() && linkRequests.length) {
      html += '<section class="cabinet-section"><p class="cabinet-kicker">Asked for a link</p><div class="cabinet-cards">';
      var r;
      for (r = 0; r < linkRequests.length && r < 8; r++) {
        var req = linkRequests[r];
        html += '<article class="cabinet-todo">';
        html += '<button type="button" class="cabinet-todo-main" data-cabinet-door-open data-door-name="' + esc(req.name || "") + '" data-door-email="' + esc(req.email || "") + '">';
        html += '<span class="cabinet-mark" aria-hidden="true">' + esc(initial(req.name)) + "</span>";
        html += '<span class="cabinet-todo-copy"><strong>' + esc(req.name || "Someone") + "</strong>";
        html += '<span class="cabinet-meta">' + esc(req.email || "") + "</span>";
        html += '<span class="cabinet-preview">Asked for their unique link. Tap to mark bottles, or copy their link now.</span></span></button>';
        html += '<span class="cabinet-todo-actions">';
        html += '<button type="button" class="btn" data-cabinet-door-mint data-door-name="' + esc(req.name || "") + '" data-door-email="' + esc(req.email || "") + '">Copy door</button>';
        html += "</span></article>";
      }
      html += "</div></section>";
    }
    var i;
    if (wait.length) {
      html += '<section class="cabinet-section"><p class="cabinet-kicker">Needs a reply</p><div class="cabinet-cards">';
      for (i = 0; i < wait.length; i++) html += personRow(wait[i]);
      html += "</div></section>";
    }
    if (fresh.length) {
      html += '<section class="cabinet-section"><p class="cabinet-kicker">New</p><div class="cabinet-cards">';
      for (i = 0; i < fresh.length; i++) {
        html += personRow(fresh[i], { preview: "Just opened their shelf.", jump: "people" });
      }
      html += "</div></section>";
    }
    html += renderAutoSection(care);
    return html;
  }

  function renderAutomations() {
    var care = careSettings();
    var html = '<button type="button" class="cabinet-back" data-cabinet-back="today">← Today</button>';
    html += '<header class="cabinet-room-head" data-clients-tour="auto">';
    html += "<h2>Automated messages</h2>";
    html += '<p class="sec-sub">Welcome and Learn. They wait on Today unless you turn on Send on their own. Type {first} for their first name. Your lines stay on this phone for now.</p></header>';
    html += '<section class="cabinet-auto-card">';
    html += '<label class="cabinet-auto-switch" for="cabinetAutoSend">';
    html += "<div><strong>Send on their own</strong>";
    html += '<p class="cabinet-fold-hint">Off, they wait on Today for you. On, they go out when they’re due — still as you.</p></div>';
    html += '<input class="switch" id="cabinetAutoSend" type="checkbox"' + (care.autoSend ? " checked" : "") + ' aria-label="Send automations on their own">';
    html += "</label></section>";
    var i;
    for (i = 0; i < care.sequences.length; i++) {
      var seq = care.sequences[i];
      var whenId = "cabinetAutoWhen-" + seq.id;
      var bodyId = "cabinetAutoBody-" + seq.id;
      html += '<section class="cabinet-auto-card" data-auto-seq="' + esc(seq.id) + '">';
      html += '<label class="cabinet-auto-switch" for="cabinetAutoOn-' + esc(seq.id) + '">';
      html += "<div><strong>" + esc(seq.title) + "</strong>";
      html += '<p class="cabinet-fold-hint">' + esc(seq.hint) + "</p></div>";
      html += '<input class="switch" id="cabinetAutoOn-' + esc(seq.id) + '" data-auto-on="' + esc(seq.id) + '" type="checkbox"' + (seq.on ? " checked" : "") + ' aria-label="Turn on ' + esc(seq.title) + '">';
      html += "</label>";
      html += '<label class="cabinet-auto-field" for="' + whenId + '">' + (seq.trigger === "hours" ? "Send after (hours)" : "Send after (days)");
      html += '<input id="' + whenId + '" data-auto-when="' + esc(seq.id) + '" type="number" min="1" max="' + (seq.trigger === "hours" ? "72" : "60") + '" value="' + esc(String(seq.trigger === "hours" ? seq.hours : seq.days)) + '"></label>';
      html += '<label class="cabinet-auto-field" for="' + bodyId + '">The line they get';
      html += '<textarea id="' + bodyId + '" data-auto-body="' + esc(seq.id) + '" rows="3" maxlength="400">' + esc(seq.body) + "</textarea></label>";
      html += "</section>";
    }
    html += '<button type="button" class="btn-ghost" data-cabinet-auto-restore>Restore suggested lines</button>';
    return html;
  }

  function clientRow(person) {
    var waitingOnYou = theyWroteLast(person);
    var fresh = isNewOnDesk(person);
    var line = waitingOnYou ? "Needs a reply" : (fresh ? "New on your list" : (person.email || ""));
    var html = '<div class="cabinet-person-wrap' + (waitingOnYou || fresh ? " is-unread" : "") + '">';
    html += '<button type="button" class="cabinet-person is-card' + (waitingOnYou || fresh ? " is-unread" : "") + '" data-cabinet-open="' + esc(person.id) + '" data-cabinet-jump="people">';
    html += '<span class="cabinet-mark" aria-hidden="true">' + esc(initial(person.name)) + "</span>";
    html += '<span class="cabinet-chat-copy">';
    html += '<span class="cabinet-chat-top"><strong>' + esc(person.name) + "</strong></span>";
    if (line) html += '<span class="cabinet-preview">' + esc(line) + "</span>";
    html += "</span>";
    if (waitingOnYou || fresh) html += '<span class="cabinet-card-dot" aria-hidden="true"></span>';
    html += "</button>";
    html += nameEditBtn(person, "people");
    html += "</div>";
    return html;
  }

  function renderPeople() {
    var list = sortedPeople(people().filter(matchesQuery), "az");
    var out = '<div data-clients-tour="list">';
    out += '<header class="cabinet-room-head"><p class="sec-sub">Everyone who opened a shelf with you.</p></header>';
    out += renderToolbar({ hideSort: true });
    if (!people().length) {
      out += emptyCard("Nobody on the list yet.", "Copy your shelf link up top. When they open a shelf, they land here.");
      out += "</div>";
      return out;
    }
    if (!list.length) {
      out += emptyCard("Nobody matches that search.");
      out += "</div>";
      return out;
    }
    out += '<div class="cabinet-list">';
    var lastLetter = "";
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var letter = letterOf(p.name);
      if (letter !== lastLetter) {
        out += '<p class="cabinet-kicker">' + esc(letter) + "</p>";
        lastLetter = letter;
      }
      out += clientRow(p);
    }
    out += "</div></div>";
    return out;
  }

  function renderPersonSheet() {
    var person = personId ? personById(personId) : null;
    if (!person) return renderPeople();
    var joined = person.createdAt ? niceWhen(person.createdAt) : "";
    var bits = [person.email || "", joined ? "In since " + joined : ""].filter(Boolean);
    var back = fromRoom === "mail" ? "mail" : (fromRoom === "today" ? "today" : "people");
    var backLabel = back === "mail" ? "Messages" : (back === "today" ? "Today" : "Clients");
    var html = '<button type="button" class="cabinet-back" data-cabinet-back="' + esc(back) + '">← ' + backLabel + "</button>";
    html += '<div class="cabinet-person-sheet">';
    html += '<header class="cabinet-letter-head">';
    html += '<div class="cabinet-name-row">';
    html += "<h2>" + esc(callName(person)) + "</h2>";
    html += '<button type="button" class="cabinet-name-edit" data-cabinet-name-edit>' + (nameEdit ? "Done" : "Edit") + "</button>";
    html += "</div>";
    html += '<p class="sec-sub">' + esc(bits.join(" · ")) + "</p></header>";
    if (nameEdit) {
      html += '<label class="cabinet-compose-label" for="cabinetPersonName">First and last name</label>';
      html += '<input id="cabinetPersonName" class="cabinet-person-name" value="' + esc(person.name || "") + '" placeholder="First and last name" autocomplete="name">';
      if (!hasFirstLast(person.name) || looksLikeHandle(person.name, person.email)) {
        html += '<p class="sec-sub">First and last name — not a username.</p>';
      }
    }
    html += renderSnapshot(person);
    if (uniqueDoorsOn()) {
      html += '<p class="cabinet-door-go"><button type="button" class="btn-ghost" data-cabinet-door-open data-door-name="' + esc(person.name || "") + '" data-door-email="' + esc(person.email || "") + '">Send them a unique link</button></p>';
    }
    html += '<div class="cabinet-person-actions">';
    html += '<button type="button" class="btn" data-cabinet-open="' + esc(person.id) + '" data-cabinet-jump="mail">Write to ' + esc(firstName(person.name)) + "</button>";
    html += '<button type="button" class="btn-ghost" data-cabinet-mute="' + esc(person.id) + '">';
    html += person.careOff ? "Automations are muted — tap to turn back on" : "Mute automations";
    html += "</button></div>";
    html += '<button type="button" class="text-link cabinet-remove" data-cabinet-remove="' + esc(person.id) + '">Remove from Clients</button>';
    html += "</div>";
    return html;
  }

  function renderMail() {
    var person = personId ? personById(personId) : null;
    if (person) {
      var thread = sortThread(person.questions || []);
      var back = fromRoom === "people" ? "people" : (fromRoom === "mail" ? "mail" : "today");
      var backLabel = back === "people" ? "Clients" : (back === "mail" ? "Messages" : "Today");
      var html = '<div class="cabinet-chat">';
      html += '<div class="cabinet-chat-bar">';
      html += '<button type="button" class="cabinet-back" data-cabinet-back="' + esc(back) + '">← ' + backLabel + "</button>";
      html += '<button type="button" class="cabinet-chat-name" data-cabinet-open="' + esc(person.id) + '" data-cabinet-jump="people">' + esc(callName(person)) + "</button>";
      html += "</div>";
      html += '<div class="cabinet-bubbles" id="cabinetBubbles">';
      if (!thread.length) {
        html += '<p class="cabinet-chat-empty">No messages yet. Say hello.</p>';
      }
      var prevAt = "";
      var prevFrom = "";
      for (var i = 0; i < thread.length; i++) {
        var m = thread[i];
        var mine = m.from === "you";
        var showStamp = stampGap(prevAt, m.at);
        if (showStamp) html += '<p class="cabinet-chat-stamp">' + esc(chatStamp(m.at)) + "</p>";
        var stack = !showStamp && prevFrom === m.from;
        if (!mine && isMatchLine(m.body)) {
          html += '<article class="cabinet-letter is-match' + (stack ? " is-stack" : "") + '">';
          html += renderMatchCard(snapOf(person)) || renderMatchFromLine(m.body);
          html += "</article>";
        } else {
          html += '<article class="cabinet-letter' + (mine ? " is-you" : "") + (stack ? " is-stack" : "") + '">';
          html += "<p>" + esc(m.body) + "</p></article>";
        }
        prevAt = m.at || prevAt;
        prevFrom = m.from;
      }
      html += '<div class="cabinet-bubbles-end" aria-hidden="true"></div>';
      html += "</div>";
      if (faqPick) html += renderFaqPicker();
      html += '<div class="cabinet-composer">';
      html += '<div class="cabinet-composer-row">';
      html += '<button type="button" class="cabinet-composer-faq" data-cabinet-faq-open' + (faqPick ? " hidden" : "") + '>FAQ</button>';
      html += '<textarea id="cabinetMailDraft" data-for="' + esc(person.id) + '" rows="1" placeholder="Message" aria-label="Message"></textarea>';
      html += '<button type="button" class="cabinet-composer-send" data-cabinet-send="' + esc(person.id) + '">Send</button>';
      html += "</div></div></div>";
      return html;
    }
    personId = "";
    var list = sortedPeople(people().filter(function (p) {
      return (p.questions || []).length && matchesQuery(p);
    }));
    var out = '<header class="cabinet-room-head"><p class="sec-sub">People who wrote you, and a note for everyone.</p></header>';
    out += renderBroadcast();
    out += renderToolbar();
    if (!people().length) {
      out += emptyCard("No threads yet.", "Copy your shelf link up top. When they write, it lands here.");
      return out;
    }
    if (!list.length) {
      out += peopleQuery
        ? emptyCard("Nobody matches that search.")
        : emptyCard("No messages yet.", "A ping still lands on your phone when someone writes.");
      return out;
    }
    out += '<div class="cabinet-list">';
    var lastLetter = "";
    for (var t = 0; t < list.length; t++) {
      var row = list[t];
      if (peopleSort === "az") {
        var letter = letterOf(row.name);
        if (letter !== lastLetter) {
          out += '<p class="cabinet-kicker">' + esc(letter) + "</p>";
          lastLetter = letter;
        }
      }
      out += personRow(row, { edit: false });
    }
    out += "</div>";
    return out;
  }

  function paint(opts) {
    opts = opts || {};
    try {
      var onDesk = document.body.classList.contains("cabinet-desk");
      document.body.classList.toggle("cabinet-desk-loading", !!(waitingForFresh && onDesk));
      var root = document.getElementById("cabinetDeskRoot");
      if (!root) return;
      if (waitingForFresh && !opts.fresh) {
        clearComposerDock();
        document.body.classList.remove("cabinet-thread-open");
        root.innerHTML = renderLoad();
        return;
      }
      var snap = opts.clearDraft ? null : snapshotDraft();
      var seek = snapshotSearch();
      var seekFaq = snapshotFaqSearch();
      var weekEl = document.getElementById("cabinetWeekNote");
      if (weekEl) weekNote = weekEl.value || "";
      var weekPct = document.getElementById("cabinetWeekPercent");
      if (weekPct) weekPercent = Math.min(50, Math.max(0, Number(weekPct.value) || 0));
      var weekSearch = document.getElementById("cabinetWeekSearch");
      var seekWeek = null;
      if (weekSearch) seekWeek = { value: weekSearch.value, start: weekSearch.selectionStart, end: weekSearch.selectionEnd };
      var saleSearch = document.getElementById("cabinetSaleSearch");
      var seekSale = null;
      if (saleSearch) seekSale = { value: saleSearch.value, start: saleSearch.selectionStart, end: saleSearch.selectionEnd };
      var blastEl = document.getElementById("cabinetBlast");
      if (blastEl) blastNote = blastEl.value || "";
      var shopEl = document.getElementById("settingsCabinetShopInput") || document.getElementById("cabinetShopWeblink");
      if (shopEl && document.activeElement !== shopEl) shopWeblink = shopEl.value || "";
      clearComposerDock();
      var seekDoor = null;
      var doorSearch = document.getElementById("cabinetDoorSearch");
      if (doorSearch) seekDoor = { value: doorSearch.value, start: doorSearch.selectionStart, end: doorSearch.selectionEnd };
      renderSeg();
      if (doorMode && !uniqueDoorsOn()) doorMode = false;
      document.body.classList.toggle("cabinet-thread-open", !doorMode && room === "mail" && !!personId && !!personById(personId));
      if (doorMode) root.innerHTML = renderDoor();
      else if (room === "people") root.innerHTML = (personId && personById(personId)) ? renderPersonSheet() : renderPeople();
      else if (room === "mail") root.innerHTML = renderMail();
      else if (room === "auto") root.innerHTML = renderAutomations();
      else {
        root.innerHTML = renderToday();
      }
      if (rosterCloudError && !doorMode) {
        var note = document.createElement("p");
        note.className = "cabinet-empty-sub";
        note.setAttribute("data-cabinet-cloud-error", "1");
        note.textContent = "Couldn’t refresh the shelf. Showing the last list on this phone.";
        root.insertBefore(note, root.firstChild);
      }
      restoreDraft(snap);
      restoreSearch(seek);
      restoreFaqSearch(seekFaq);
      dockComposer();
      if (seekWeek) {
        var weekIn = document.getElementById("cabinetWeekSearch");
        if (weekIn) {
          weekIn.value = seekWeek.value || weekQuery;
          try {
            if (typeof seekWeek.start === "number") weekIn.setSelectionRange(seekWeek.start, seekWeek.end);
          } catch (eWeek) {}
        }
      }
      if (seekSale) {
        var saleIn = document.getElementById("cabinetSaleSearch");
        if (saleIn) {
          saleIn.value = seekSale.value || saleQuery;
          try {
            if (typeof seekSale.start === "number") saleIn.setSelectionRange(seekSale.start, seekSale.end);
          } catch (eSale) {}
        }
      }
      if (seekDoor) {
        var doorIn = document.getElementById("cabinetDoorSearch");
        if (doorIn) {
          doorIn.value = seekDoor.value || doorQuery;
          try {
            if (typeof seekDoor.start === "number") doorIn.setSelectionRange(seekDoor.start, seekDoor.end);
          } catch (eDoor) {}
        }
      }
      sizeDraft();
      if (document.body.classList.contains("cabinet-thread-open") && !composing()) {
        try { window.scrollTo(0, 0); } catch (eTop) {}
        try {
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        } catch (eTop2) {}
      }
      if (!composing()) {
        scrollChat();
        requestAnimationFrame(scrollChat);
      }
      if (nameEdit) {
        var nameIn = document.getElementById("cabinetPersonName");
        if (nameIn && document.activeElement !== nameIn) {
          try { nameIn.focus(); } catch (eName) {}
        }
      }
      paintShopSettings();
    } catch (err) {
      if (typeof console !== "undefined" && console.warn) console.warn("cabinet desk", err);
    }
  }

  function eventEl(e) {
    var t = e && e.target;
    if (t && t.nodeType === 3) t = t.parentNode;
    return (t && t.nodeType === 1) ? t : null;
  }

  function chipOn(slug, selected) {
    if (typeof selected === "string") return selected === slug;
    return !!(selected && selected[slug]);
  }

  function renderChips(pickedSlugs, query, attr, selected) {
    var q = String(query || "").trim().toLowerCase();
    var picked = [];
    var rest = [];
    var seen = {};
    var i;
    var c;
    for (i = 0; i < pickedSlugs.length; i++) {
      for (c = 0; c < catalog.length; c++) {
        if (catalog[c].slug === pickedSlugs[i]) {
          picked.push(catalog[c]);
          seen[catalog[c].slug] = true;
          break;
        }
      }
    }
    for (i = 0; i < catalog.length; i++) {
      var p = catalog[i];
      if (seen[p.slug]) continue;
      if (!q || String(p.name + " " + p.slug).toLowerCase().indexOf(q) >= 0) rest.push(p);
    }
    var chips = picked.concat(rest).slice(0, 12);
    var html = '<div class="cabinet-door-chips">';
    for (i = 0; i < chips.length; i++) {
      html += '<button type="button" class="cabinet-door-chip' + (chipOn(chips[i].slug, selected) ? " on" : "") + '" data-' + attr + '="' + esc(chips[i].slug) + '">' + esc(shortProduct(chips[i].name)) + "</button>";
    }
    if (!catalog.length) html += '<p class="sec-sub">Product list loads from The Fresh Shelf.</p>';
    html += "</div>";
    return html;
  }

  function renderFold(kind, title, hint, open, body) {
    var html = '<section class="cabinet-week cabinet-fold' + (open ? " is-open" : "") + '"' + (kind === "blast" ? ' data-clients-tour="mail"' : "") + ">";
    html += '<button type="button" class="cabinet-fold-toggle" data-cabinet-fold="' + kind + '" aria-expanded="' + (open ? "true" : "false") + '">';
    html += "<div><p class=\"cabinet-kicker\">" + title + "</p>";
    html += '<p class="cabinet-fold-hint">' + esc(hint) + "</p></div>";
    html += '<span class="cabinet-fold-chevron" aria-hidden="true">' + (open ? "–" : "+") + "</span>";
    html += "</button>";
    if (open) html += '<div class="cabinet-fold-body">' + body + "</div>";
    html += "</section>";
    return html;
  }

  function weekHint() {
    if (weekAuto) return "Auto-picking a product";
    if (weekSlug) {
      var name = productLabel(weekSlug);
      return name ? name + " is on Home" : "A product is on Home";
    }
    if (String(weekNote || "").trim()) return "Your blurb is on Home";
    return "Pick a product for Home";
  }

  function saleHint() {
    var n = saleSlugList().length;
    if (weekPercent > 0 && n) return weekPercent + "% off · " + n + (n === 1 ? " bottle" : " bottles");
    return "Nothing on";
  }

  function homeBtn(updating) {
    return updating ? "Update Home" : "Put on Home";
  }

  function renderLockedSale() {
    var html = '<section class="cabinet-week cabinet-fold is-locked">';
    html += '<div class="cabinet-fold-toggle" aria-disabled="true">';
    html += "<div><p class=\"cabinet-kicker\">Sale</p>";
    html += '<p class="cabinet-fold-hint">Unlocks November 1, when products launch</p></div>';
    html += '<span class="cabinet-fold-chevron" aria-hidden="true">🔒</span>';
    html += "</div></section>";
    return html;
  }

  function renderHomeCards() {
    var weekBody = "";
    weekBody += '<label class="cabinet-week-auto" for="cabinetWeekAuto">';
    weekBody += "<div><strong>Auto-suggest a product each week</strong>";
    weekBody += '<p class="cabinet-fold-hint">Turn this off to pick one yourself.</p></div>';
    weekBody += '<input class="switch" id="cabinetWeekAuto" type="checkbox"' + (weekAuto ? " checked" : "") + ' aria-label="Auto-suggest a product each week">';
    weekBody += "</label>";
    if (!weekAuto) {
      weekBody += '<input id="cabinetWeekSearch" type="search" value="' + esc(weekQuery) + '" placeholder="Find a product" autocomplete="off">';
      weekBody += renderChips(weekSlug ? [weekSlug] : [], weekQuery, "cabinet-week-slug", weekSlug);
    }
    weekBody += '<label class="cabinet-week-note" for="cabinetWeekNote">A note on Home <span>optional</span></label>';
    weekBody += '<textarea id="cabinetWeekNote" rows="2" maxlength="180" placeholder="They’ll see this with the product.">' + esc(weekNote) + "</textarea>";
    weekBody += '<div class="cabinet-week-actions">';
    weekBody += '<button type="button" class="btn" data-cabinet-week-save' + (weekBusy ? " disabled" : "") + ">" + (weekBusy ? "Saving…" : homeBtn(weekActive && !!(weekSlug || String(weekNote || "").trim()))) + "</button>";
    if (weekActive && (weekSlug || String(weekNote || "").trim())) weekBody += '<button type="button" class="btn-ghost" data-cabinet-week-clear>Take it down</button>';
    weekBody += "</div>";

    var saleLive = weekActive && saleSlugList().length && weekPercent > 0;
    var saleBody = "";
    saleBody += '<div class="cabinet-sale-row">';
    saleBody += '<label class="cabinet-week-sale" for="cabinetWeekPercent">Percent off</label>';
    saleBody += '<div class="cabinet-sale-pct"><input id="cabinetWeekPercent" type="number" min="1" max="50" inputmode="numeric" value="' + esc(String(weekPercent || "")) + '" placeholder="20"><span>%</span></div>';
    saleBody += "</div>";
    saleBody += '<input id="cabinetSaleSearch" type="search" value="' + esc(saleQuery) + '" placeholder="Find a product" autocomplete="off">';
    saleBody += renderChips(saleSlugList(), saleQuery, "cabinet-sale-slug", saleSlugs);
    saleBody += '<div class="cabinet-week-actions">';
    saleBody += '<button type="button" class="btn" data-cabinet-sale-save' + (weekBusy ? " disabled" : "") + ">" + (weekBusy ? "Saving…" : (saleLive ? "Update sale" : "Put sale on Home")) + "</button>";
    if (saleLive) saleBody += '<button type="button" class="btn-ghost" data-cabinet-sale-clear>Take it down</button>';
    saleBody += "</div>";

    var html = '<div class="cabinet-home-pair" data-clients-tour="week">';
    html += renderFold("week", "This week", weekHint(), weekFold, weekBody);
    html += salesOn()
      ? renderFold("sale", "Sale", saleHint(), saleFold, saleBody)
      : renderLockedSale();
    html += "</div>";
    return html;
  }

  function paintShopSettings() {
    var input = document.getElementById("settingsCabinetShopInput");
    var clear = document.getElementById("settingsCabinetShopClear");
    var save = document.getElementById("settingsCabinetShopSave");
    if (input && document.activeElement !== input) input.value = shopWeblink || "";
    if (clear) clear.hidden = !shopWeblink;
    if (save) save.textContent = shopBusy ? "Saving…" : "Save shop link";
    if (save) save.disabled = !!shopBusy;
  }

  function normalizeShopWeblink(raw) {
    var value = String(raw || "").trim();
    if (!value) return "";
    try {
      if (/^https?:\/\//i.test(value)) {
        var parsed = new URL(value);
        var fromQuery = String(parsed.searchParams.get("weblink") || "").trim();
        if (fromQuery) return fromQuery;
      }
    } catch (eNorm) {}
    if (/\s/.test(value)) return "";
    return value;
  }

  function saveShop(clear) {
    var Cloud = window.FS && window.FS.Cloud;
    var el = document.getElementById("settingsCabinetShopInput") || document.getElementById("cabinetShopWeblink");
    if (el && !clear) shopWeblink = normalizeShopWeblink(el.value || "");
    if (clear) shopWeblink = "";
    if (!Cloud || typeof Cloud.setShelfShop !== "function") {
      toast("Cloud isn’t ready.", "bad");
      return;
    }
    shopBusy = true;
    paint();
    Cloud.setShelfShop(shopWeblink).then(function (data) {
      shopBusy = false;
      var shop = data && data.shop ? data.shop : { weblink: shopWeblink };
      shopWeblink = String(shop.weblink || "").trim();
      paint();
      paintShopSettings();
      toast(shopWeblink ? "Shop link is on every product button." : "Product buttons go to ringana.com.", "good");
    }).catch(function (err) {
      shopBusy = false;
      paint();
      paintShopSettings();
      toast((err && err.message) || "Couldn’t save that shop link.", "bad");
    });
  }

  function renderBroadcast() {
    var body = "";
    body += '<p class="sec-sub">A note from you. It lands in Messages for every client who opened a shelf.</p>';
    body += '<textarea id="cabinetBlast" rows="3" maxlength="800" placeholder="Write the broadcast…">' + esc(blastNote) + "</textarea>";
    body += '<div class="cabinet-week-actions">';
    body += '<button type="button" class="btn" data-cabinet-blast' + (blastBusy ? " disabled" : "") + ">";
    body += blastBusy ? "Sending…" : "Send broadcast";
    body += "</button></div>";
    body += '<p class="sec-sub cabinet-fold-foot">Lands in Messages on every shelf. Skips anyone who turned broadcasts off.</p>';
    return renderFold("blast", "Broadcasts", "A note to every shelf", blastFold, body);
  }

  function sendBlast() {
    var Cloud = window.FS && window.FS.Cloud;
    var el = document.getElementById("cabinetBlast");
    if (el) blastNote = el.value || "";
    var line = String(blastNote || "").trim();
    if (!line) {
      toast("Write something first.", "bad");
      return;
    }
    if (!window.confirm("Send this broadcast to everyone who opened a shelf? It lands in Messages and pings their phone if they allow broadcasts.")) {
      return;
    }
    if (!Cloud || typeof Cloud.broadcastCabinet !== "function") {
      toast("Cloud isn’t ready.", "bad");
      return;
    }
    blastBusy = true;
    paint();
    Cloud.broadcastCabinet(line).then(function (data) {
      blastBusy = false;
      var sent = data && typeof data.sent === "number" ? data.sent : 0;
      var skipped = data && typeof data.skipped === "number" ? data.skipped : 0;
      var failed = data && typeof data.failed === "number" ? data.failed : 0;
      if (data && data.ok === false) {
        toast((data && data.error) || "Couldn’t send that broadcast.", "bad");
        paint();
        return;
      }
      blastNote = "";
      paint();
      var bits = [sent + (sent === 1 ? " broadcast sent." : " broadcasts sent.")];
      if (skipped) bits.push(skipped + (skipped === 1 ? " was skipped." : " were skipped."));
      if (failed) bits.push(failed + (failed === 1 ? " didn’t go through." : " didn’t go through."));
      toast(bits.join(" "), sent && !failed ? "good" : "bad");
      hydrate({ force: true });
    }).catch(function (err) {
      blastBusy = false;
      paint();
      toast((err && err.message) || "Couldn’t send that broadcast.", "bad");
    });
  }

  function snapshotHomeFields() {
    var noteEl = document.getElementById("cabinetWeekNote");
    if (noteEl) weekNote = noteEl.value || "";
    var pctEl = document.getElementById("cabinetWeekPercent");
    if (pctEl) weekPercent = Math.min(50, Math.max(0, Number(pctEl.value) || 0));
    var blastEl = document.getElementById("cabinetBlast");
    if (blastEl) blastNote = blastEl.value || "";
    var shopEl = document.getElementById("settingsCabinetShopInput") || document.getElementById("cabinetShopWeblink");
    if (shopEl) shopWeblink = shopEl.value || "";
  }

  function saveWeek(kind, active) {
    var Cloud = window.FS && window.FS.Cloud;
    snapshotHomeFields();
    if (!Cloud || typeof Cloud.setShelfWeek !== "function") {
      toast("Cloud isn’t ready.", "bad");
      return;
    }
    if (kind === "week" && active === false) {
      weekSlug = "";
      weekNote = "";
      weekAuto = true;
    }
    if (kind === "sale" && active === false) {
      saleSlugs = {};
      weekPercent = 0;
    }
    if (kind === "week" && weekAuto) weekSlug = "";
    if (kind === "week" && active !== false && !weekAuto && !weekSlug) {
      toast("Pick a product first, or turn auto-suggest back on.", "bad");
      return;
    }
    if (kind === "sale" && !salesOn()) {
      toast("Sales unlock November 1.", "bad");
      return;
    }
    if (kind === "sale" && active !== false && (!saleSlugList().length || !(weekPercent > 0))) {
      toast("Pick a sale bottle and a percent.", "bad");
      return;
    }
    var slugs = packedWeekSlugs();
    var percent = saleSlugList().length ? weekPercent : 0;
    var note = weekNote;
    var live = !!(slugs.length || String(note || "").trim());
    weekBusy = true;
    paint();
    Cloud.setShelfWeek(note, percent, slugs, live, active !== false ? (kind === "sale" ? "sale" : "week") : "").then(function (data) {
      weekBusy = false;
      var week = data && data.week ? data.week : { note: note, active: live, percent: percent, slugs: slugs };
      applyWeekRow(week);
      paint();
      var ping = data && data.ping;
      var word = kind === "sale"
        ? (weekActive && percent > 0 ? "Sale is on their Home tab" : "Sale is down")
        : (weekAuto
          ? "Home will auto-suggest a product each week"
          : (weekActive && (weekSlug || note) ? "On their Home tab" : "This week is down"));
      toast(weekActive && ping && ping.sent
        ? word + " — " + ping.sent + (ping.sent === 1 ? " ping sent." : " pings sent.")
        : word + ".", "good");
    }).catch(function (err) {
      weekBusy = false;
      paint();
      toast((err && err.message) || "Couldn’t update This week.", "bad");
    });
  }

  function mintDoorNow(name, email) {
    var Cloud = window.FS && window.FS.Cloud;
    var mail = String(email || "").trim().toLowerCase();
    if (!mail || mail.indexOf("@") < 0) {
      toast("Need their order email.", "bad");
      return;
    }
    if (!hasFirstLast(name)) {
      toast("First and last name, please.", "bad");
      return;
    }
    if (!Cloud || typeof Cloud.createShelfDoor !== "function") {
      toast("Cloud isn’t ready.", "bad");
      return;
    }
    Cloud.createShelfDoor(mail, name || "", []).then(function (data) {
      var url = (data && (data.url || cabinetDoorUrl(data.token))) || "";
      if (!url) {
        toast((data && data.error) || "Couldn’t make that door.", "bad");
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(function () {});
      }
      delete snapByEmail[mail];
      toast("Unique customer link copied.", "good");
    }).catch(function (err) {
      toast((err && err.message) || "Couldn’t make that door.", "bad");
    });
  }

  function makeDoor() {
    var Cloud = window.FS && window.FS.Cloud;
    var nameEl = document.getElementById("cabinetDoorName");
    var mailEl = document.getElementById("cabinetDoorEmail");
    if (nameEl) doorName = nameEl.value || "";
    if (mailEl) doorEmail = mailEl.value || "";
    if (!doorEmail || doorEmail.indexOf("@") < 0) {
      toast("Need their order email.", "bad");
      return;
    }
    if (!hasFirstLast(doorName)) {
      toast("First and last name, please.", "bad");
      return;
    }
    if (!Cloud || typeof Cloud.createShelfDoor !== "function") {
      toast("Cloud isn’t ready.", "bad");
      return;
    }
    doorBusy = true;
    paint();
    Cloud.createShelfDoor(doorEmail, doorName, selectedSlugs()).then(function (data) {
      doorBusy = false;
      doorUrl = (data && (data.url || cabinetDoorUrl(data.token))) || "";
      paint();
      if (!doorUrl) {
        toast((data && data.error) || "Couldn’t make that door.", "bad");
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(doorUrl).catch(function () {});
      }
      delete snapByEmail[String(doorEmail || "").trim().toLowerCase()];
      toast("Unique customer link copied.", "good");
    }).catch(function (err) {
      doorBusy = false;
      paint();
      toast((err && err.message) || "Couldn’t make that door.", "bad");
    });
  }

  function goRoom(next) {
    next = next || "today";
    if (next === "messages") next = "mail";
    if (next === "care") next = "auto";
    if (next === room && !personId) return;
    room = next;
    personId = "";
    nameEdit = false;
    faqPick = false;
    doorMode = false;
    fromRoom = next === "people" ? "people" : (next === "mail" ? "mail" : (next === "auto" ? "auto" : "today"));
    paint();
    var layout = document.querySelector(".layout");
    if (layout) layout.scrollTop = 0;
  }

  function openThread(id, jump) {
    fromRoom = room === "people" ? "people" : (room === "mail" ? "mail" : "today");
    personId = id || "";
    room = jump === "people" ? "people" : (jump || "mail");
    faqPick = false;
    if (room === "mail") {
      markRead(personId);
      markOpened(personId);
    } else if (room === "people") {
      markOpened(personId);
    }
    var who = personById(personId);
    if (who && who.email) delete snapByEmail[String(who.email || "").trim().toLowerCase()];
    paint();
    fillPersonThread(who);
  }

  function fillPersonThread(person) {
    if (!person || person.threadFilled === true || isPreview(person)) return;
    var mail = String(person.email || "").trim().toLowerCase();
    var Cloud = window.FS && window.FS.Cloud;
    if (!mail || !Cloud || typeof Cloud.getCabinetPersonThread !== "function") return;
    if (threadFillInFlight[mail]) return;
    threadFillInFlight[mail] = true;
    Cloud.getCabinetPersonThread(mail).then(function (row) {
      person.threadFilled = true;
      if (!row || !Array.isArray(row.thread) || !row.thread.length) return;
      applyCloud([{
        email: mail,
        name: row.name || person.name,
        note: row.note || person.note,
        last_event: row.last_event,
        last_line: row.last_line,
        seen_at: row.seen_at,
        thread: row.thread
      }]);
      if (!composing()) paint();
    }).catch(function () {
      person.threadFilled = false;
    }).then(function () {
      delete threadFillInFlight[mail];
    });
  }

  function toast(msg, tone) {
    if (window.FS.UI && window.FS.UI.toast) window.FS.UI.toast(msg, { tone: tone || "good" });
  }

  function dropPerson(id) {
    var data = read();
    var gone = null;
    data.people = data.people.filter(function (p) {
      if (p.id === id) {
        gone = p;
        return false;
      }
      return true;
    });
    write(data);
    if (gone && gone.email) {
      var mail = String(gone.email || "").trim().toLowerCase();
      droppedMails[mail] = true;
      delete snapByEmail[mail];
    }
    if (personId === id) personId = "";
    return gone;
  }

  function removePerson(id) {
    var person = personById(id);
    if (!person) return;
    var name = person.name || "this person";
    var ask = window.FS.UI && typeof window.FS.UI.ask === "function"
      ? window.FS.UI.ask("They come off your Clients list. If they open a cabinet again later, they can land back here.", {
        title: "Remove " + name + "?",
        okText: "Remove",
        danger: true
      })
      : Promise.resolve(window.confirm("Remove " + name + " from Clients?"));
    ask.then(function (ok) {
      if (!ok) return;
      var gone = dropPerson(id);
      room = fromRoom === "today" ? "today" : "people";
      paint();
      var Cloud = window.FS && window.FS.Cloud;
      if (!gone || !gone.email || !Cloud || typeof Cloud.removeCabinetPerson !== "function") {
        toast("Removed on this device.", "good");
        return;
      }
      var send = function (tries) {
        return Cloud.removeCabinetPerson(gone.email).then(function () {
          toast("Removed.", "good");
        }).catch(function (err) {
          if (tries < 1) {
            return new Promise(function (resolve) {
              window.setTimeout(function () { resolve(send(tries + 1)); }, 800);
            });
          }
          toast((err && err.message) || "Removed here — the cloud may still have them.", "bad");
        });
      };
      send(0);
    });
  }

  function onClick(e) {
    cancelSearchPaint();
    var start = eventEl(e);
    if (!start || !start.closest) return;
    var t = start.closest("[data-cabinet-room],[data-cabinet-open],[data-cabinet-person],[data-cabinet-back],[data-cabinet-send],[data-cabinet-care],[data-cabinet-skip],[data-cabinet-mute],[data-cabinet-remove],[data-cabinet-invite],[data-cabinet-faq-open],[data-cabinet-faq-close],[data-cabinet-faq-group],[data-cabinet-faq-send],[data-cabinet-door-open],[data-cabinet-door-close],[data-cabinet-door-cat],[data-cabinet-door-slug],[data-cabinet-door-make],[data-cabinet-door-mint],[data-cabinet-week-save],[data-cabinet-week-clear],[data-cabinet-week-slug],[data-cabinet-sale-save],[data-cabinet-sale-clear],[data-cabinet-sale-slug],[data-cabinet-fold],[data-cabinet-blast],[data-cabinet-shop-save],[data-cabinet-shop-clear],[data-cabinet-auto-restore],[data-cabinet-name-edit]");
    if (!t) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (t.hasAttribute("data-cabinet-door-mint")) {
      if (!uniqueDoorsOn()) return;
      mintDoorNow(t.getAttribute("data-door-name") || "", t.getAttribute("data-door-email") || "");
      return;
    }
    if (t.hasAttribute("data-cabinet-blast")) {
      sendBlast();
      return;
    }
    if (t.hasAttribute("data-cabinet-fold")) {
      snapshotHomeFields();
      var fold = t.getAttribute("data-cabinet-fold");
      if (fold === "week") weekFold = !weekFold;
      else if (fold === "sale") {
        if (!salesOn()) return;
        saleFold = !saleFold;
      }
      else if (fold === "blast") blastFold = !blastFold;
      else if (fold === "shop") shopFold = !shopFold;
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-shop-save")) {
      saveShop(false);
      return;
    }
    if (t.hasAttribute("data-cabinet-shop-clear")) {
      saveShop(true);
      return;
    }
    if (t.hasAttribute("data-cabinet-week-save")) {
      saveWeek("week", true);
      return;
    }
    if (t.hasAttribute("data-cabinet-week-clear")) {
      saveWeek("week", false);
      return;
    }
    if (t.hasAttribute("data-cabinet-sale-save")) {
      if (!salesOn()) return;
      saveWeek("sale", true);
      return;
    }
    if (t.hasAttribute("data-cabinet-sale-clear")) {
      if (!salesOn()) return;
      saveWeek("sale", false);
      return;
    }
    if (t.hasAttribute("data-cabinet-week-slug")) {
      var nextWeek = t.getAttribute("data-cabinet-week-slug") || "";
      weekSlug = weekSlug === nextWeek ? "" : nextWeek;
      weekAuto = !weekSlug;
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-sale-slug")) {
      var nextSale = t.getAttribute("data-cabinet-sale-slug") || "";
      if (saleSlugs[nextSale]) delete saleSlugs[nextSale];
      else saleSlugs[nextSale] = true;
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-door-open")) {
      if (!uniqueDoorsOn()) return;
      var prefill = {
        name: t.getAttribute("data-door-name") || "",
        email: t.getAttribute("data-door-email") || ""
      };
      openDoorComposer(prefill.name || prefill.email ? prefill : null);
      return;
    }
    if (t.hasAttribute("data-cabinet-door-close")) {
      doorMode = false;
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-door-cat")) {
      doorCat = t.getAttribute("data-cabinet-door-cat") || "all";
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-door-slug")) {
      var slug = t.getAttribute("data-cabinet-door-slug") || "";
      if (slug) doorSlugs[slug] = !doorSlugs[slug];
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-door-make")) {
      makeDoor();
      return;
    }
    if (t.hasAttribute("data-cabinet-invite")) {
      if (window.FS && typeof window.FS.copyCabinetInvite === "function") window.FS.copyCabinetInvite(t);
      return;
    }
    if (t.hasAttribute("data-cabinet-faq-open")) {
      faqPick = true;
      faqOpenGroup = "";
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-faq-close")) {
      faqPick = false;
      faqOpenGroup = "";
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-faq-group")) {
      var gid = t.getAttribute("data-cabinet-faq-group") || "";
      faqOpenGroup = faqOpenGroup === gid ? "" : gid;
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-faq-send")) {
      var hit = findCabinetFaq(t.getAttribute("data-cabinet-faq-send"));
      if (!hit || !personId) return;
      try {
        writeTo(personId, faqLetter(hit));
        faqPick = false;
        paint({ clearDraft: true });
        toast("FAQ sent.", "good");
      } catch (err) {
        toast(err.message || "Couldn’t send that.", "bad");
      }
      return;
    }
    if (t.hasAttribute("data-cabinet-room")) {
      goRoom(t.getAttribute("data-cabinet-room") || "today");
      return;
    }
    if (t.hasAttribute("data-cabinet-person")) {
      openThread(t.getAttribute("data-cabinet-person") || "", "people");
      return;
    }
    if (t.hasAttribute("data-cabinet-name-edit") && !t.hasAttribute("data-cabinet-open")) {
      nameEdit = !nameEdit;
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-open")) {
      nameEdit = t.hasAttribute("data-cabinet-name-edit");
      openThread(t.getAttribute("data-cabinet-open") || "", t.getAttribute("data-cabinet-jump") || "mail");
      return;
    }
    if (t.hasAttribute("data-cabinet-back")) {
      personId = "";
      nameEdit = false;
      room = t.getAttribute("data-cabinet-back") || "today";
      fromRoom = room === "people" ? "people" : (room === "mail" ? "mail" : "today");
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-send")) {
      var draft = document.getElementById("cabinetMailDraft");
      try {
        writeTo(t.getAttribute("data-cabinet-send"), draft ? draft.value : "");
        paint({ clearDraft: true });
        toast("Sent.", "good");
      } catch (err) {
        toast(err.message || "Write something first.", "bad");
      }
      return;
    }
    if (t.hasAttribute("data-cabinet-auto-restore")) {
      resetCareSuggested();
      toast("Suggested lines are back.", "good");
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-care")) {
      if (sendBeat(t.getAttribute("data-cabinet-care"), t.getAttribute("data-cabinet-beat") || "welcome")) {
        toast("Sent to their Messages.", "good");
        paint();
      }
      return;
    }
    if (t.hasAttribute("data-cabinet-skip")) {
      skipBeat(t.getAttribute("data-cabinet-skip"), t.getAttribute("data-cabinet-beat") || "welcome");
      toast("Skipped.", "good");
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-mute")) {
      var who = personById(t.getAttribute("data-cabinet-mute"));
      if (who) setCareOff(who.id, !who.careOff);
      paint();
      return;
    }
    if (t.hasAttribute("data-cabinet-remove")) {
      removePerson(t.getAttribute("data-cabinet-remove") || "");
    }
  }

  function mount() {
    if (bound) return;
    document.addEventListener("pointerdown", function (e) {
      if (!searchPaintRaf) return;
      var start = eventEl(e);
      if (!start || !start.closest) return;
      if (start.closest("[data-cabinet-person],[data-cabinet-open],[data-cabinet-week-slug],[data-cabinet-sale-slug],[data-cabinet-door-slug],[data-cabinet-faq-send],[data-cabinet-faq-group]")) {
        cancelSearchPaint();
      }
    }, true);
    document.addEventListener("click", function (e) {
      var start = eventEl(e);
      if (!start || !start.closest) return;
      if (start.closest("[data-cabinet-shop-save]")) {
        e.preventDefault();
        saveShop(false);
        return;
      }
      if (start.closest("[data-cabinet-shop-clear]")) {
        e.preventDefault();
        saveShop(true);
        return;
      }
      if (!start.closest("#panel-customers, #cabinetComposerDock")) return;
      onClick(e);
    }, true);
    document.addEventListener("input", function (e) {
      var el = e && e.target;
      if (!el) return;
      if (el.id === "cabinetPeopleSearch") {
        peopleQuery = el.value || "";
        scheduleSearchPaint();
        return;
      }
      if (el.id === "cabinetFaqSearch") {
        faqQuery = el.value || "";
        scheduleSearchPaint();
        return;
      }
      if (el.id === "cabinetDoorName") {
        doorName = el.value || "";
        return;
      }
      if (el.id === "cabinetDoorEmail") {
        doorEmail = el.value || "";
        return;
      }
      if (el.id === "cabinetBlast") {
        blastNote = el.value || "";
        return;
      }
      if (el.id === "cabinetMailDraft") {
        lastSent = { personId: "", body: "", at: 0 };
        sizeDraft();
        return;
      }
      if (el.id === "cabinetPersonName") {
        var named = personId ? personById(personId) : null;
        if (named && hasFirstLast(el.value)) {
          adoptName(named, el.value, true);
          savePerson(named);
        }
        return;
      }
      if (el.id === "cabinetDoorSearch") {
        doorQuery = el.value || "";
        scheduleSearchPaint();
        return;
      }
      if (el.id === "cabinetWeekSearch") {
        weekQuery = el.value || "";
        scheduleSearchPaint();
        return;
      }
      if (el.id === "cabinetSaleSearch") {
        saleQuery = el.value || "";
        scheduleSearchPaint();
        return;
      }
      var autoBody = el.getAttribute && el.getAttribute("data-auto-body");
      if (autoBody) {
        saveCareSequence(autoBody, { body: el.value || "" });
        return;
      }
      var autoTitle = el.getAttribute && el.getAttribute("data-auto-title");
      if (autoTitle) {
        saveCareSequence(autoTitle, { title: el.value || "" });
        return;
      }
      var autoWhen = el.getAttribute && el.getAttribute("data-auto-when");
      if (autoWhen) {
        var seq = seqById(autoWhen);
        var n = Math.max(1, Number(el.value) || 1);
        if (seq && seq.trigger === "hours") saveCareSequence(autoWhen, { hours: Math.min(72, n) });
        else saveCareSequence(autoWhen, { days: Math.min(60, n) });
      }
    });
    document.addEventListener("focusout", function (e) {
      var el = e && e.target;
      if (!el || el.id !== "cabinetPersonName") return;
      if (hasFirstLast(el.value)) return;
      if (!String(el.value || "").trim()) return;
      toast("First and last name, please.", "bad");
    });
    document.addEventListener("keydown", function (e) {
      if (!e || e.key !== "Enter" || e.shiftKey) return;
      var el = e.target;
      if (!el || el.id !== "cabinetMailDraft") return;
      e.preventDefault();
      var btn = document.querySelector("#cabinetComposerDock [data-cabinet-send], #cabinetDeskRoot [data-cabinet-send]");
      if (btn) btn.click();
    });
    document.addEventListener("change", function (e) {
      var el = e && e.target;
      if (!el) return;
      if (el.id === "cabinetPeopleSort") {
        setPeopleSort(el.value);
        paint();
        return;
      }
      if (el.id === "cabinetWeekAuto") {
        weekAuto = !!el.checked;
        if (weekAuto) weekSlug = "";
        paint();
        return;
      }
      if (el.id === "cabinetAutoSend") {
        saveCareSettings({ autoSend: !!el.checked, sequences: careSettings().sequences });
        if (el.checked) maybeAutoSend();
        else paint();
        return;
      }
      var autoOn = el.getAttribute && el.getAttribute("data-auto-on");
      if (autoOn) {
        saveCareSequence(autoOn, { on: !!el.checked });
        paint();
      }
    });
    wireComposerPin();
    bound = true;
  }

  function boot() {
    mount();
    readSnaps();
    write(read());
    paint();
    if (!deskAllowed()) return;
    hydrate();
    loadCatalog();
    loadRequests();
    loadWeek();
    loadShop();
  }

  window.FS = window.FS || {};
  window.FS.CabinetDesk = {
    render: paint,
    enter: enterDesk,
    hydrate: function (opts) { hydrate(opts); },
    open: boot,
    handleClick: onClick,
    go: goRoom,
    paintDots: paintCabinetNavDot,
    paintShop: paintShopSettings
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  if (window.FS.Cloud && typeof window.FS.Cloud.onChange === "function") {
    window.FS.Cloud.onChange(function () {
      if (!deskAllowed()) return;
      hydrate();
    });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && deskAllowed()) hydrate();
  });
})();
