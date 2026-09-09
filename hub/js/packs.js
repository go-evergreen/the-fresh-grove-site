/* ═══════════════════════════════════════════════════════════
   PACKS — Grove | Evergreen | shared
   Missing flags fail closed toward Grove (current First Seeds).
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

window.FS.PACK_SLUGS = {
  GROVE: "fresh-grove",
  EVERGREEN: "evergreen-co"
};

window.FS.PACK_IDS = {
  "evergreen-co": "a0000000-0000-4000-8000-000000000001",
  "fresh-grove": "a0000000-0000-4000-8000-000000000002"
};

window.FS.PACK_CATALOG = {
  "fresh-grove": {
    slug: "fresh-grove",
    tier: "grove",
    name: "The Fresh Grove",
    joinCode: null,
    leaderCode: null,
    features: {
      runway: true,
      leads: true,
      grove: true,
      calendarFull: true,
      resources: false,
      talkingFresh: true,
      quiz: true,
      learnDeep: true
    }
  },
  "evergreen-co": {
    slug: "evergreen-co",
    tier: "basic",
    name: "Evergreen Co",
    joinCode: "evergreen",
    leaderCode: null,
    features: {
      runway: false,
      leads: false,
      grove: false,
      calendarFull: false,
      resources: true,
      talkingFresh: false,
      quiz: false,
      learnDeep: false
    }
  }
};

window.FS.Pack = (function () {
  var VIEW_KEY = "firstSeeds_viewAs";
  var LAST_KEY = "firstSeeds_lastPack";

  function catalog(slug) {
    return window.FS.PACK_CATALOG[slug] || window.FS.PACK_CATALOG["fresh-grove"];
  }

  function pendingCode() {
    try {
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.pendingJoinCode) return String(Cloud.pendingJoinCode() || "").trim().toLowerCase();
    } catch (e) {}
    return "";
  }

  function viewAsSlug() {
    try {
      var stored = String(localStorage.getItem(VIEW_KEY) || "").trim();
      if (!stored || !window.FS.PACK_CATALOG[stored]) return "";
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.isSuperAdmin && Cloud.isSuperAdmin()) return stored;
      return "";
    } catch (e) {
      return "";
    }
  }

  function orgFromUser() {
    try {
      var Cloud = window.FS.Cloud;
      var u = Cloud && Cloud.user && Cloud.user();
      if (u && u.org_slug) return String(u.org_slug);
      if (u && u.org_id) {
        var ids = window.FS.PACK_IDS || {};
        if (String(u.org_id) === String(ids["evergreen-co"] || "")) return "evergreen-co";
        if (String(u.org_id) === String(ids["fresh-grove"] || "")) return "fresh-grove";
      }
    } catch (e) {}
    return "";
  }

  function lastPackSlug() {
    try {
      return String(localStorage.getItem(LAST_KEY) || "").trim();
    } catch (e) {
      return "";
    }
  }

  function rememberLastPack(slug) {
    slug = String(slug || "").trim();
    if (!slug || !catalog(slug)) return;
    try { localStorage.setItem(LAST_KEY, slug); } catch (e) {}
  }

  function cloudBootReady() {
    try {
      var Cloud = window.FS.Cloud;
      if (!Cloud || !Cloud.bootReady) return true;
      return !!Cloud.bootReady();
    } catch (e) {
      return true;
    }
  }

  function hubFromLocation() {
    try {
      return String(new URLSearchParams(window.location.search).get("hub") || "").trim().toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function onGroveHost() {
    try {
      var host = String(window.location.hostname || "").toLowerCase();
      return host === "thefreshgrove.team" || host === "www.thefreshgrove.team" ||
        host === "app.thefreshgrove.team";
    } catch (e) {
      return false;
    }
  }

  function onEvergreenHost() {
    try {
      var host = String(window.location.hostname || "").toLowerCase();
      return host === "evergreenco.team" || host === "www.evergreenco.team" ||
        host === "go-evergreen.github.io";
    } catch (e) {
      return false;
    }
  }

  function joinInUrl() {
    try {
      var query = String(new URLSearchParams(window.location.search).get("join") || "").trim().toLowerCase();
      var hash = "";
      var hm = String(window.location.hash || "").match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
      if (hm) hash = decodeURIComponent(hm[1] || "").trim().toLowerCase();
      var path = "";
      var pm = String(window.location.pathname || "").match(/\/j\/([a-z0-9][a-z0-9-]{2,62})\/?$/i);
      if (pm) path = decodeURIComponent(pm[1]).toLowerCase();
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
    } catch (e) {}
    return "";
  }

  function storedJoinHub() {
    try {
      var h = String(localStorage.getItem("firstSeeds_pending_join_hub") || "").trim().toLowerCase();
      if (h === "evergreen" || h === "grove") return h;
    } catch (e) {}
    try {
      var h2 = String(sessionStorage.getItem("firstSeeds_pending_join_hub") || "").trim().toLowerCase();
      if (h2 === "evergreen" || h2 === "grove") return h2;
    } catch (e2) {}
    return "";
  }

  /* Signed-in org wins. A person unique is not Grove by itself — Evergreen
     partners have the same random codes. Host / live hub pick the pack.
     A leftover stored join must not flip Evergreen’s door into Grove. */
  function activeSlug() {
    var preview = viewAsSlug();
    if (preview && catalog(preview)) return preview;
    var fromUser = orgFromUser();
    if (fromUser) return fromUser;
    var pending = pendingCode();
    var evCat = catalog("evergreen-co");
    var evCode = String((evCat && evCat.joinCode) || "evergreen").toLowerCase();
    var looksLeader = pending.indexOf("evl-") === 0 || pending === "evergreen-leaders";
    var hub = hubFromLocation();
    var hubEvergreen = hub === "evergreen" || hub === "evergreen-co";
    var hubGrove = hub === "grove" || hub === "fresh-grove";
    var urlJoin = joinInUrl();
    var livePerson = !!(urlJoin && urlJoin !== "evergreen" && urlJoin.indexOf("evl-") !== 0 &&
      urlJoin !== "evergreen-leaders");
    if (onGroveHost()) return window.FS.PACK_SLUGS.GROVE;
    if (hubGrove) return window.FS.PACK_SLUGS.GROVE;
    if (hubEvergreen) return window.FS.PACK_SLUGS.EVERGREEN;
    if (pending && (pending === evCode || looksLeader)) return window.FS.PACK_SLUGS.EVERGREEN;
    var storedHub = storedJoinHub();
    /* Live unique + stripped hub: host decides. Leftover stored hub from a
       previous invite must not rewrite this visit. */
    if (livePerson) {
      if (onEvergreenHost()) return window.FS.PACK_SLUGS.EVERGREEN;
      if (storedHub === "grove") return window.FS.PACK_SLUGS.GROVE;
      if (storedHub === "evergreen") return window.FS.PACK_SLUGS.EVERGREEN;
    }
    if (pending && !livePerson) {
      if (storedHub === "grove") return window.FS.PACK_SLUGS.GROVE;
      if (storedHub === "evergreen") return window.FS.PACK_SLUGS.EVERGREEN;
      if (onGroveHost() || !onEvergreenHost()) return window.FS.PACK_SLUGS.GROVE;
    }
    var last = lastPackSlug();
    if (!cloudBootReady() && last && catalog(last)) {
      if (onEvergreenHost() && last === window.FS.PACK_SLUGS.GROVE && !urlJoin) {
        return window.FS.PACK_SLUGS.EVERGREEN;
      }
      return last;
    }
    if (last && catalog(last)) {
      if (onEvergreenHost() && last === window.FS.PACK_SLUGS.GROVE && !fromUser && !urlJoin) {
        return window.FS.PACK_SLUGS.EVERGREEN;
      }
      return last;
    }
    if (onGroveHost()) return window.FS.PACK_SLUGS.GROVE;
    return window.FS.PACK_SLUGS.EVERGREEN;
  }

  function meta() {
    var slug = activeSlug();
    var base = catalog(slug);
    var live = null;
    try {
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.orgForSlug) live = Cloud.orgForSlug(slug);
    } catch (e) {}
    var features = (live && live.features) || base.features || {};
    return {
      slug: slug,
      tier: (live && live.tier) || base.tier,
      name: (live && live.name) || base.name,
      joinCode: (live && live.join_code) || base.joinCode,
      leaderCode: (live && live.leader_code) || base.leaderCode || null,
      features: features,
      branding: (live && live.branding) || {},
      resources: (live && live.resources) || null
    };
  }

  function has(feature) {
    var m = meta();
    var feats = m.features || {};
    if (Object.prototype.hasOwnProperty.call(feats, feature)) return !!feats[feature];
    return false;
  }

  return {
    active: activeSlug,
    meta: meta,
    has: has,
    isGrove: function () { return activeSlug() === window.FS.PACK_SLUGS.GROVE; },
    isEvergreen: function () { return activeSlug() === window.FS.PACK_SLUGS.EVERGREEN; },
    viewAs: viewAsSlug,
    setViewAs: function (slug) {
      try {
        var Cloud = window.FS.Cloud;
        if (!Cloud || !Cloud.isSuperAdmin || !Cloud.isSuperAdmin()) return;
        if (!slug) localStorage.removeItem(VIEW_KEY);
        else localStorage.setItem(VIEW_KEY, slug);
      } catch (e) {}
    },
    remember: function () { rememberLastPack(activeSlug()); },
    catalog: catalog
  };
})();

(function applyPackDoorEarly() {
  try {
    if (!document.body) return;
    function pickDoor(query, hash, path) {
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
      return "";
    }
    var joinQ = "";
    try { joinQ = (new URLSearchParams(location.search).get("join") || "").trim().toLowerCase(); } catch (e1) {}
    var joinH = "";
    if (location.hash) {
      var hm = String(location.hash).match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
      if (hm) joinH = decodeURIComponent(hm[1] || "").trim().toLowerCase();
    }
    var joinP = "";
    var pm = String(location.pathname || "").match(/\/j\/([a-z0-9][a-z0-9-]{2,62})\/?$/i);
    if (pm) joinP = decodeURIComponent(pm[1]).toLowerCase();
    var join = pickDoor(joinQ, joinH, joinP);
    var hub = "";
    try { hub = (new URLSearchParams(location.search).get("hub") || "").trim().toLowerCase(); } catch (e2) {}
    var host = "";
    try { host = String(location.hostname || "").toLowerCase(); } catch (eH) {}
    var groveDoor = host === "thefreshgrove.team" || host === "www.thefreshgrove.team" || host === "app.thefreshgrove.team";
    if ((!join || join === "evergreen") && (groveDoor || hub === "grove" || hub === "fresh-grove")) {
      try { join = String(localStorage.getItem("firstSeeds_pending_join") || "").trim().toLowerCase(); } catch (eSt) {}
      if (!join || join === "evergreen") {
        try { join = String(sessionStorage.getItem("firstSeeds_pending_join") || "").trim().toLowerCase(); } catch (eSsR) {}
      }
      if (!join || join === "evergreen") {
        try {
          var cm = document.cookie.match(/(?:^|; )fs_pending_join=([^;]*)/);
          if (cm) join = decodeURIComponent(cm[1] || "").trim().toLowerCase();
        } catch (eCkR) {}
      }
    }
    if (join === "evergreen") join = "";
    var personDoor = !!(join && join.indexOf("evl-") !== 0 && join !== "evergreen-leaders");
    /* Grove host + leftover hub=evergreen must not paint Evergreen. Live
       hub=evergreen on github.io is an Evergreen person copy — keep it. */
    if (personDoor && groveDoor && (hub === "evergreen" || hub === "evergreen-co")) {
      hub = "";
    }
    if (!hub && !personDoor) {
      try {
        hub = String(localStorage.getItem("firstSeeds_pending_join_hub") || "").trim().toLowerCase();
      } catch (eHubS) {}
    }
    var looksEv = join === "evergreen" || join.indexOf("evl-") === 0 || join === "evergreen-leaders" ||
      (!join && (hub === "evergreen" || hub === "evergreen-co"));
    /* A person unique is not Grove by itself — Evergreen partners have
       the same random codes. Only hub / host / stored hub pick the pack. */
    var looksGrove = groveDoor || hub === "grove" || hub === "fresh-grove";
    if (groveDoor && looksEv) {
      var evDest = "https://evergreenco.team/";
      if (join && join !== "evergreen") {
        var evQs = new URLSearchParams(location.search || "");
        evQs.set("join", join);
        evQs.set("hub", "evergreen");
        evDest += "index.html?" + evQs.toString() +
          ((location.hash && /join=/i.test(location.hash)) ? location.hash : "#join=" + encodeURIComponent(join));
      } else {
        evDest += "index.html" + String(location.search || "") + String(location.hash || "");
      }
      location.replace(evDest);
      return;
    }
    var ev = looksEv ? true : (groveDoor ? false : ((hub === "grove" || hub === "fresh-grove") ? false : !looksGrove));
    document.body.classList.toggle("pack-evergreen", ev);
    document.body.classList.toggle("pack-grove", !ev);
  } catch (e) {}
})();
