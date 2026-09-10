/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — APP
   State, modes, onboarding, tour, navigation, live widgets,
   claim checker, export. Loads last.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  if (window.FS && window.FS.bootProgress) window.FS.bootProgress("app");

  var CFG = window.FS.CONFIG;
  var SECTIONS = window.FS.SECTIONS;
  var RISKY = window.FS.RISKY;
  var RHYTHMS = CFG.rhythms;
  var DAY_NAMES = window.FS.DAY_NAMES;
  var Tree = window.FS.tree;
  var OB = CFG.onboarding || {};
  var MODES = CFG.modes || {};

  function packEvergreen() {
    return !!(window.FS.Pack && window.FS.Pack.isEvergreen && window.FS.Pack.isEvergreen());
  }
  function teamTreeGrowDemoOn() {
    try {
      return /(?:^|[?&])demo=tree-grow(?:&|$)/.test(String(location.search || ""));
    } catch (e) {
      return false;
    }
  }
  function teamTreeGrowDemoPanel() {
    if (!teamTreeGrowDemoOn()) return "";
    try {
      var hub = String(new URLSearchParams(location.search).get("hub") || "").trim().toLowerCase();
      if (hub === "grove" || hub === "fresh-grove") return "leader";
    } catch (e) {}
    return packEvergreen() ? "ev-team" : "leader";
  }
  function packGrove() { return !packEvergreen(); }
  function safeHref(raw) {
    try {
      if (window.FS && typeof window.FS.safeHref === "function") return window.FS.safeHref(raw) || "";
    } catch (e) {}
    return "";
  }
  function canSeeEvergreenTeamPage() {
    if (!packEvergreen()) return false;
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return false;
    return !!(Cloud.isSuperAdmin && Cloud.isSuperAdmin()) ||
      !!(Cloud.isHubAdmin && Cloud.isHubAdmin()) ||
      !!(Cloud.isOrgAdmin && Cloud.isOrgAdmin());
  }
  function canSeeEvergreenHubTeam() {
    if (!packEvergreen()) return false;
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return false;
    return !!(Cloud.isSuperAdmin && Cloud.isSuperAdmin()) || !!(Cloud.isHubAdmin && Cloud.isHubAdmin());
  }
  /* Grove Leaders + Taylor. Evergreen stays locked unless she
     explicitly says otherwise — host, org, links, and desk. */
  var GROVE_ORG_ID = "a0000000-0000-4000-8000-000000000002";
  var EVERGREEN_ORG_ID = "a0000000-0000-4000-8000-000000000001";
  function cabinetLeadSlug() {
    var user = window.FS && window.FS.Cloud && window.FS.Cloud.user && window.FS.Cloud.user();
    return user && user.lead_slug ? String(user.lead_slug).trim().toLowerCase() : "";
  }
  function cabinetSlugOk(slug) {
    return !!(slug && /^[a-z0-9][a-z0-9-]{1,39}$/.test(slug) && slug !== "tay" && slug !== "join" && slug !== "taylor");
  }
  function cabinetUserIsEvergreen() {
    if (packEvergreen()) return true;
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user && Cloud.user();
    if (!user) return false;
    if (String(user.org_slug || "") === "evergreen-co") return true;
    var evId = (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) || EVERGREEN_ORG_ID;
    return String(user.org_id || "") === String(evId);
  }
  function cabinetIsGroveLeader() {
    if (cabinetUserIsEvergreen()) return false;
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isOrgAdmin || !Cloud.isOrgAdmin()) return false;
    if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) return false;
    var user = Cloud.user && Cloud.user();
    if (!user) return false;
    return String(user.org_slug || "") === "fresh-grove"
      || String(user.org_id || "") === GROVE_ORG_ID;
  }
  function shelfCustomersGate() {
    if (cabinetUserIsEvergreen()) return "no";
    var Cloud = window.FS.Cloud;
    if (!Cloud || (Cloud.bootReady && !Cloud.bootReady())) return "wait";
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) return "no";
    var slug = cabinetLeadSlug();
    if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
      return (!slug || slug === "taylor") ? "yes" : "no";
    }
    if (cabinetIsGroveLeader()) return "yes";
    return "no";
  }
  function canSeeShelfCustomers() {
    return shelfCustomersGate() === "yes";
  }
  function canSeeGroveHeaderTree() {
    return canSeeShelfCustomers() && (isFull() || !modeChosen());
  }
  function cabinetInviteUrl() {
    if (cabinetUserIsEvergreen() || !canSeeShelfCustomers()) return "";
    var slug = cabinetLeadSlug();
    if (slug === "taylor") return "https://shelf.taygoesfresh.com/?with=tay";
    if (cabinetSlugOk(slug)) {
      return "https://shelf.thefreshgrove.team/?with=" + encodeURIComponent(slug) + "#with=" + encodeURIComponent(slug);
    }
    return "";
  }
  function cabinetShelfHost() {
    if (cabinetUserIsEvergreen() || !canSeeShelfCustomers()) return "";
    return cabinetLeadSlug() === "taylor"
      ? "https://shelf.taygoesfresh.com"
      : "https://shelf.thefreshgrove.team";
  }
  function cabinetDoorUrl(token) {
    if (cabinetUserIsEvergreen() || !canSeeShelfCustomers()) return "";
    var key = String(token || "").trim();
    var host = cabinetShelfHost();
    if (!key || !host) return "";
    var slug = cabinetLeadSlug();
    var door = host + "/?open=" + encodeURIComponent(key);
    if (slug === "taylor") return door + "&with=tay";
    if (cabinetSlugOk(slug)) {
      return door + "&with=" + encodeURIComponent(slug) + "#with=" + encodeURIComponent(slug);
    }
    return "";
  }
  window.FS.cabinetInviteUrl = cabinetInviteUrl;
  window.FS.cabinetShelfHost = cabinetShelfHost;
  window.FS.cabinetDoorUrl = cabinetDoorUrl;
  function paintEvTeamPageCopy() {
    var title = document.querySelector("#panel-ev-team h1");
    var sub = document.querySelector("#panel-ev-team > .sec-sub");
    var card = document.getElementById("evTeamLeadersJoinCard");
    var hub = canSeeEvergreenHubTeam();
    if (card) {
      card.hidden = !hub;
      if (hub) paintEvTeamLeadersShare();
    }
    if (title) title.textContent = "Your team";
    if (sub) {
      sub.textContent = "Who’s on your tree. Tap a name, or + to open a branch.";
    }
  }
  function paintEvTeamNavBtn() {
    var teamBtn = document.getElementById("evTeamNavBtn");
    if (!teamBtn) return;
    if (clientsArrivalPlaying) return;
    var canTeam = canSeeEvergreenTeamPage();
    var canGrove = canSeeGroveHeaderTree();
    var show = canTeam || canGrove;
    var dest = canTeam ? "ev-team" : "leader";
    var onTeam = show && normalizePanelId(state.active) === dest;
    teamBtn.hidden = !show;
    teamBtn.classList.toggle("on", onTeam);
    var openLabel = canTeam ? "Your team" : "Grow Your Grove";
    var closeLabel = canTeam ? "Close your team" : "Close Grow Your Grove";
    if (onTeam) {
      teamBtn.setAttribute("aria-current", "page");
      teamBtn.setAttribute("aria-label", closeLabel);
      teamBtn.setAttribute("title", closeLabel);
    } else {
      teamBtn.removeAttribute("aria-current");
      teamBtn.setAttribute("aria-label", openLabel);
      teamBtn.setAttribute("title", openLabel);
      if (document.activeElement === teamBtn) {
        try { teamBtn.blur(); } catch (e) {}
      }
    }
  }

  function boardPageId() {
    return packEvergreen() ? "ev-board" : "grove-board";
  }

  function paintGroveBoardNavBtn() {
    var btn = document.getElementById("groveBoardNavBtn");
    if (!btn) return;
    var dest = boardPageId();
    var on = state.active === dest;
    var openLabel = packEvergreen() ? "From the hub" : "Messages";
    var closeLabel = packEvergreen() ? "Close from the hub" : "Close messages";
    btn.classList.toggle("on", on);
    if (on) {
      btn.setAttribute("aria-current", "page");
      btn.setAttribute("aria-label", closeLabel);
      btn.setAttribute("title", closeLabel);
    } else {
      btn.removeAttribute("aria-current");
      btn.setAttribute("aria-label", openLabel);
      btn.setAttribute("title", openLabel);
    }
    if (document.activeElement === btn) {
      try { btn.blur(); } catch (e2) {}
    }
  }

  var groveBoardReturnPanel = "";

  var evTeamReturnPanel = "";
  var groveTeamReturnPanel = "";

  function toggleEvergreenTeamPage() {
    if (!canSeeEvergreenTeamPage()) return;
    setRoadmapOpen(false);
    closeHubMenu();
    hideLockToast();
    var cur = normalizePanelId(state.active);
    if (cur === "ev-team") {
      var back = evTeamReturnPanel || (state.data && state.data.evTeamReturnTo) || "ev-home";
      evTeamReturnPanel = "";
      if (state.data) state.data.evTeamReturnTo = "";
      back = packSafeGoto(back);
      if (!back || normalizePanelId(back) === "ev-team") back = "ev-home";
      rememberPanelScroll("ev-team");
      state.active = back;
      persistActiveAndPaint({ restoreScroll: true });
      return;
    }
    evTeamReturnPanel = cur;
    if (!state.data) state.data = {};
    state.data.evTeamReturnTo = cur;
    rememberPanelScroll(cur);
    state.active = "ev-team";
    persistActiveAndPaint({});
  }

  function toggleGroveTeamPage() {
    if (!canSeeGroveHeaderTree()) return;
    setRoadmapOpen(false);
    closeHubMenu();
    hideLockToast();
    var cur = normalizePanelId(state.active);
    if (cur === "leader") {
      var back = groveTeamReturnPanel || (state.data && state.data.groveTeamReturnTo) || "welcome";
      groveTeamReturnPanel = "";
      if (state.data) state.data.groveTeamReturnTo = "";
      back = packSafeGoto(back);
      if (!back || normalizePanelId(back) === "leader") back = "welcome";
      rememberPanelScroll("leader");
      state.active = back;
      persistActiveAndPaint({ restoreScroll: true });
      return;
    }
    groveTeamReturnPanel = cur;
    if (!state.data) state.data = {};
    state.data.groveTeamReturnTo = cur;
    rememberPanelScroll(cur);
    state.active = "leader";
    persistActiveAndPaint({});
  }

  function wireEvTeamNavBtn() {
    var btn = document.getElementById("evTeamNavBtn");
    if (!btn || btn.dataset.boundTeam === "1") return;
    btn.dataset.boundTeam = "1";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      try { btn.blur(); } catch (eBlur) {}
      if (packEvergreen()) toggleEvergreenTeamPage();
      else toggleGroveTeamPage();
    });
  }

  function toggleGroveBoardPage() {
    setRoadmapOpen(false);
    closeHubMenu();
    hideLockToast();
    var dest = boardPageId();
    var home = packEvergreen() ? "ev-home" : "welcome";
    var cur = normalizePanelId(state.active);
    if (cur === dest) {
      var back = groveBoardReturnPanel || (state.data && state.data.groveBoardReturnTo) || home;
      groveBoardReturnPanel = "";
      if (state.data) state.data.groveBoardReturnTo = "";
      back = packSafeGoto(back);
      if (!back || normalizePanelId(back) === dest) back = home;
      rememberPanelScroll(dest);
      state.active = back;
      persistActiveAndPaint({ restoreScroll: true });
      return;
    }
    groveBoardReturnPanel = cur;
    if (!state.data) state.data = {};
    state.data.groveBoardReturnTo = cur;
    rememberPanelScroll(cur);
    state.active = dest;
    persistActiveAndPaint({});
  }

  function wireGroveBoardNavBtn() {
    var btn = document.getElementById("groveBoardNavBtn");
    if (!btn || btn.dataset.boundBoard === "1") return;
    btn.dataset.boundBoard = "1";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      try { btn.blur(); } catch (eBlur) {}
      toggleGroveBoardPage();
    });
  }
  /* Until Cloud has hydrated org_slug, Pack pretends we're Grove. Remapping
     the last page in that window is how Resources/Calendar came back as Learn. */
  function packSettled() {
    try {
      if (window.FS.Pack && window.FS.Pack.viewAs && window.FS.Pack.viewAs()) return true;
    } catch (e) {}
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.bootReady) return true;
    if (Cloud.bootReady()) return true;
    try {
      var u = Cloud.user && Cloud.user();
      if (u && (u.org_slug || u.org_id)) return true;
    } catch (e2) {}
    return false;
  }
  function packHas(feature) {
    if (!(window.FS.Pack && window.FS.Pack.has)) return false;
    return !!window.FS.Pack.has(feature);
  }
  function isOrgLeader() {
    var Cloud = window.FS.Cloud;
    return !!(Cloud && (
      (Cloud.isOrgAdmin && Cloud.isOrgAdmin()) ||
      (Cloud.isHubAdmin && Cloud.isHubAdmin()) ||
      (Cloud.isSuperAdmin && Cloud.isSuperAdmin())
    ));
  }
  /* Same boot-safe answer as the leaders room: until Cloud has actually
     replied, trust the last confirmed leader flag so Leader FAQs don't pop
     in a beat later (or vanish for a real leader on first paint). */
  function canSeeLeaderFaqs() {
    if (isOrgLeader()) return true;
    return !leaderCheckSettled() && !!(state && state.settings && state.settings.wasOrgLeader);
  }
  function leaderRoleNamePlural() {
    return packEvergreen() ? "Evergreen Leaders" : "Grove Leaders";
  }
  function leadersCopy() {
    if (packEvergreen()) return (window.FS.EVERGREEN && window.FS.EVERGREEN.leaders) || {};
    return (CFG && CFG.groveLeaders) || {};
  }
  function leadersCompCopy() {
    if (packEvergreen()) return (window.FS.EVERGREEN && window.FS.EVERGREEN.leadersComp) || {};
    return (CFG && CFG.groveLeadersComp) || {};
  }
  function isLeadersSurface(id) {
    return id === "leaders" || id === "leaders-comp" || id === "leaders-understand";
  }
  /* Cloud restores the session asynchronously, so for the first moments of a boot
     a real leader reads as a non-leader. Acting on that answer parks them out of
     the leaders room AND saves it, which is how someone reopens the app on Learn.
     Until Cloud has actually replied, trust the last confirmed answer instead. */
  function leaderCheckSettled() {
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.bootReady) return true;
    if (Cloud.bootReady()) return true;
    return !(state && state.settings && state.settings.wasOrgLeader);
  }
  function rememberLeaderStatus() {
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.bootReady || !Cloud.bootReady()) return;
    if (!state || !state.settings) return;
    var lead = isOrgLeader();
    if (lead && groveLeaderWelcomeShouldHold()) return;
    if (!!state.settings.wasOrgLeader === lead) return;
    state.settings.wasOrgLeader = lead;
    try { save(); } catch (e) {}
  }
  function packOnboarding() {
    var base = CFG.onboarding || {};
    if (!packEvergreen()) return base;
    var ev = (window.FS.EVERGREEN && window.FS.EVERGREEN.onboarding) || {};
    var out = {};
    var k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    for (k in ev) if (Object.prototype.hasOwnProperty.call(ev, k)) out[k] = ev[k];
    return out;
  }

  function packSafeGoto(goto) {
    if (!goto) return goto;
    if (isLeadersSurface(goto) && leaderCheckSettled() && !isOrgLeader()) {
      return packEvergreen() ? "ev-resources" : "know";
    }
    if (!packEvergreen()) {
      if (goto === "ev-board") return "grove-board";
      if (goto === "ev-team") return "leader";
      if (goto === "ev-learn") return "know";
      if (goto === "ev-dates") return "tend";
      if (goto === "ev-links") return "welcome";
      if (goto === "ev-home" || goto === "ev-heart" || goto === "ev-leads" || goto === "ev-dream" || goto === "ev-resources") return "welcome";
      if (goto === "tree") return "grove";
      if (goto === "customers" && shelfCustomersGate() === "no") return "welcome";
      return goto;
    }
    if (goto === "grove-board") return "ev-board";
    if (goto === "ev-team") return (canSeeEvergreenTeamPage() || teamTreeGrowDemoOn()) ? "ev-team" : "ev-home";
    if (goto === "welcome") return "ev-home";
    if (goto === "know") return "products";
    if (goto === "ev-dates") return "tend";
    if (goto === "ev-links") return "ev-resources";
    if (goto === "leaders") return "leaders";
    if (goto === "leaders-comp") return "leaders-comp";
    if (goto === "leaders-understand") return "leaders-understand";
    if (goto === "talk" || goto === "quiz" || goto === "why") return "products";
    if (goto === "content-vault" || goto === "content-week" || goto === "content-stories" || goto === "curiosity-photos" || goto === "grove-shelf") return "tend";
    if (goto === "leader" || goto === "leads" || goto === "customers" || goto === "share" || goto === "ground" ||
        goto === "grove" || goto === "tree" || goto === "plant" || goto === "done") {
      return "ev-home";
    }
    return goto;
  }

  /* Cloud / View-as can leave the other pack’s home in `state.active`
     (welcome vs ev-home). Nav still highlights Sprout, but the visible
     panel is `display:none` for this pack — so the plant looks gone.
     Remap before every paint, and don’t write a preview home to cloud. */
  function ensurePackActive() {
    if (!packSettled()) return false;
    var parked = packSafeGoto(state.active);
    if (!parked || parked === state.active) return false;
    state.active = parked;
    try {
      var preview = window.FS.Pack && window.FS.Pack.viewAs && window.FS.Pack.viewAs();
      save(preview ? { skipCloud: true } : {});
    } catch (e) {}
    return true;
  }

  /* ── state ───────────────────────────────────────────── */
  function blankState() {
    return {
      data: {},
      done: {},
      active: "welcome",
      settings: { hubMode: "", partnerName: "", partnerLastName: "", growthMoment: true, growthToast: true, weekStartsOn: "sunday", boundUserId: "" },
      tourDone: false,
      cheers: [],
      savedAt: ""
    };
  }

  var state = blankState();
  var syncFail = null; /* { message, at } when cloud push fails */
  var bootPreferActive = ""; /* deep-link panel to keep across cloud merge */
  var keepPushSurface = ""; /* Soft start: keep Grove/Calendar open after a push tap */

  function ensureSettings() {
    if (!state.settings) state.settings = {};
    if (!state.settings.hubMode) state.settings.hubMode = "";
    if (!state.settings.partnerName) state.settings.partnerName = "";
    if (!state.settings.partnerLastName) state.settings.partnerLastName = "";
    if (typeof state.settings.boundUserId !== "string") state.settings.boundUserId = "";
    if (typeof state.settings.growthMoment !== "boolean") state.settings.growthMoment = true;
    if (typeof state.settings.growthToast !== "boolean") state.settings.growthToast = true;
    if (typeof state.settings.wasOrgLeader !== "boolean") state.settings.wasOrgLeader = false;
    if (typeof state.settings.groveLeaderWelcomeAcked !== "boolean") {
      state.settings.groveLeaderWelcomeAcked = false;
    }
    if (typeof state.settings.clientsArrivalAcked !== "boolean") {
      state.settings.clientsArrivalAcked = false;
    }
    if (state.settings.weekStartsOn !== "monday" && state.settings.weekStartsOn !== "sunday") {
      state.settings.weekStartsOn = "sunday";
    }
  }

  function calendarWeekStart() {
    return state.settings.weekStartsOn === "monday" ? 1 : 0;
  }

  function boundUserId() {
    return ((state.settings && state.settings.boundUserId) || "").trim();
  }

  function progressKeyFor(userId) {
    var id = (userId || "").trim();
    return id ? (CFG.storeKey + "__u_" + id) : CFG.storeKey;
  }

  function activeAccountKey() {
    return CFG.storeKey + "_active";
  }

  function snapshotFromState() {
    return {
      data: state.data,
      done: state.done,
      active: state.active,
      settings: state.settings,
      tourDone: state.tourDone,
      cheers: state.cheers || [],
      savedAt: state.savedAt || new Date().toISOString()
    };
  }

  function applyStateSnapshot(p) {
    p = p || {};
    state.data = p.data || {};
    state.done = p.done || {};
    state.active = p.active || "welcome";
    state.settings = p.settings || { hubMode: "", partnerName: "", partnerLastName: "", boundUserId: "" };
    state.tourDone = !!p.tourDone;
    state.cheers = p.cheers || [];
    state.savedAt = p.savedAt || "";
    if (!state.data.calendar) state.data.calendar = {};
    if (state.active === "calendar") state.active = "tend";
    ensureSettings();
    migrateGrovePicks();
    migrateDreamTree();
    if (state.active === "tree") state.active = packEvergreen() ? "ev-home" : "grove";
  }

  function readSnapshot(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function writeSnapshot(key, snap) {
    try { localStorage.setItem(key, JSON.stringify(snap)); } catch (e) {}
  }

  function userChoseSignOut() {
    try { return localStorage.getItem("fsUserSignedOut") === "1"; } catch (e) { return false; }
  }

  function richestStoredAccountId() {
    var prefix = CFG.storeKey + "__u_";
    var bestId = "";
    var bestScore = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (k.indexOf(prefix) !== 0) continue;
        var id = k.slice(prefix.length);
        if (!id) continue;
        var score = snapshotProgressScore(readSnapshot(k));
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      }
    } catch (eRich) {}
    return bestScore > 0 ? bestId : "";
  }

  function loadState() {
    try {
      var active = "";
      try { active = localStorage.getItem(activeAccountKey()) || ""; } catch (e) {}
      try {
        /* Shared phone after Log out: don't paint the last account’s answers.
           A session blip used to stamp fsSigned=0 without that flag, which
           hid last night's work behind an empty guest bucket. */
        if (localStorage.getItem("fsSigned") === "0" && userChoseSignOut()) {
          active = "";
        } else if (!active || localStorage.getItem("fsSigned") === "0") {
          var guestScore = snapshotProgressScore(readSnapshot(progressKeyFor(null)));
          var richId = richestStoredAccountId();
          var richScore = richId ? snapshotProgressScore(readSnapshot(progressKeyFor(richId))) : 0;
          if (richId && richScore > guestScore && richScore > 40) active = richId;
        }
      } catch (eSigned) {}
      var key = progressKeyFor(active);
      var snap = readSnapshot(key);
      if (!snap && !active) {
        snap = readSnapshot(CFG.storeKey);
        if (!snap && CFG.legacyStoreKey) {
          var legacy = readSnapshot(CFG.legacyStoreKey);
          if (legacy) {
            applyStateSnapshot(legacy);
            ensureSettings();
            state.settings.boundUserId = "";
            writeSnapshot(progressKeyFor(null), snapshotFromState());
            return;
          }
        }
      }
      if (snap) applyStateSnapshot(snap);
      else {
        ensureSettings();
        migrateGrovePicks();
      }
      if (active && !boundUserId()) state.settings.boundUserId = active;
    } catch (e) {
      ensureSettings();
      migrateGrovePicks();
    }
  }

  function parseNameLines(text) {
    return ((text || "") + "").split("\n")
      .map(function (l) { return l.replace(/^\d+[\.\)]\s*/, "").trim(); })
      .filter(function (l) { return l.length > 0; });
  }

  function migrateGrovePicks() {
    if (!state.data) state.data = {};
    if (!Array.isArray(state.data.customer_first)) {
      state.data.customer_first = parseNameLines(state.data.customer_pick).slice(0, 5);
    }
    if (!Array.isArray(state.data.warm_first)) {
      state.data.warm_first = parseNameLines(state.data.warm_pick).slice(0, 5);
    }
    migrateIdealLeads();
  }

  function idealLeadId() {
    return "il_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function normalizeIdealLeadStatus(s) {
    if (s === "reached" || s === "link_sent") return s;
    return "new";
  }

  function migrateIdealLeads() {
    if (!state.data) state.data = {};
    if (Array.isArray(state.data.idealLeads)) {
      state.data.idealLeads = state.data.idealLeads.map(function (row) {
        if (!row || typeof row !== "object") return null;
        var name = String(row.name || "").trim();
        if (!name) return null;
        return {
          id: row.id || idealLeadId(),
          name: name,
          lane: row.lane === "warm" ? "warm" : "customers",
          status: normalizeIdealLeadStatus(row.status)
        };
      }).filter(Boolean);
      /* Pull any brain-dump names that aren't on the list yet (keep statuses). */
      var byKey = {};
      state.data.idealLeads.forEach(function (row) {
        byKey[row.name.toLowerCase()] = row;
      });
      function absorb(name, lane) {
        name = String(name || "").trim();
        if (!name) return;
        var k = name.toLowerCase();
        if (byKey[k]) return;
        byKey[k] = { id: idealLeadId(), name: name, lane: lane === "warm" ? "warm" : "customers", status: "new" };
      }
      parseNameLines(state.data.customers || "").forEach(function (n) { absorb(n, "customers"); });
      parseNameLines(state.data.warm || "").forEach(function (n) { absorb(n, "warm"); });
      state.data.idealLeads = dropLiveTeamIdealLeads(Object.keys(byKey).map(function (k) { return byKey[k]; }));
      return state.data.idealLeads;
    }
    var byKey = {};
    function add(name, lane) {
      name = String(name || "").trim();
      if (!name) return;
      var k = name.toLowerCase();
      if (byKey[k]) return;
      byKey[k] = {
        id: idealLeadId(),
        name: name,
        lane: lane === "warm" ? "warm" : "customers",
        status: "new"
      };
    }
    parseNameLines(state.data.customers || "").forEach(function (n) { add(n, "customers"); });
    parseNameLines(state.data.warm || "").forEach(function (n) { add(n, "warm"); });
    state.data.idealLeads = dropLiveTeamIdealLeads(Object.keys(byKey).map(function (k) { return byKey[k]; }));
    return state.data.idealLeads;
  }

  function ensureIdealLeads() {
    return migrateIdealLeads();
  }

  function idealLeadsForLane(lane) {
    var want = lane === "warm" ? "warm" : "customers";
    return ensureIdealLeads().filter(function (row) { return row.lane === want; });
  }

  function syncIdealLeadsFromNameField(lane) {
    var want = lane === "warm" ? "warm" : "customers";
    var key = want === "warm" ? "warm" : "customers";
    var lines = parseNameLines(state.data[key] || "");
    var existing = ensureIdealLeads();
    var keepOther = existing.filter(function (row) { return row.lane !== want; });
    var byName = {};
    existing.forEach(function (row) {
      if (row.lane === want) byName[row.name.toLowerCase()] = row;
    });
    var nextLane = [];
    var seen = {};
    lines.forEach(function (name) {
      var k = name.toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      if (byName[k]) {
        byName[k].name = name;
        nextLane.push(byName[k]);
      } else {
        nextLane.push({ id: idealLeadId(), name: name, lane: want, status: "new" });
      }
    });
    state.data.idealLeads = keepOther.concat(nextLane);
  }

  function syncNameFieldsFromIdealLeads() {
    var customers = idealLeadsForLane("customers").map(function (r) { return r.name; });
    var warm = idealLeadsForLane("warm").map(function (r) { return r.name; });
    state.data.customers = customers.join("\n");
    state.data.warm = warm.join("\n");
    var custEl = document.querySelector('[data-key="customers"]');
    var warmEl = document.querySelector('[data-key="warm"]');
    if (custEl && document.activeElement !== custEl) custEl.value = state.data.customers;
    if (warmEl && document.activeElement !== warmEl) warmEl.value = state.data.warm;
  }

  function findIdealLead(id) {
    var list = ensureIdealLeads();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function addIdealLead(name, lane) {
    name = String(name || "").trim();
    if (!name) return null;
    var want = lane === "warm" ? "warm" : "customers";
    var list = ensureIdealLeads();
    for (var i = 0; i < list.length; i++) {
      if (list[i].name.toLowerCase() === name.toLowerCase()) {
        list[i].name = name;
        list[i].lane = want;
        syncNameFieldsFromIdealLeads();
        return list[i];
      }
    }
    var row = { id: idealLeadId(), name: name, lane: want, status: "new" };
    list.push(row);
    syncNameFieldsFromIdealLeads();
    return row;
  }

  function setIdealLeadStatus(id, status) {
    var row = findIdealLead(id);
    if (!row) return null;
    row.status = normalizeIdealLeadStatus(status);
    return row;
  }

  function setIdealLeadLane(id, lane) {
    var row = findIdealLead(id);
    if (!row) return null;
    row.lane = lane === "warm" ? "warm" : "customers";
    syncNameFieldsFromIdealLeads();
    pruneGrovePicks("customers");
    pruneGrovePicks("warm");
    return row;
  }

  function removeIdealLead(id) {
    state.data.idealLeads = ensureIdealLeads().filter(function (row) { return row.id !== id; });
    syncNameFieldsFromIdealLeads();
    pruneGrovePicks("customers");
    pruneGrovePicks("warm");
  }

  function renameIdealLead(id, name) {
    name = String(name || "").trim();
    var row = findIdealLead(id);
    if (!row || !name) return null;
    row.name = name;
    syncNameFieldsFromIdealLeads();
    pruneGrovePicks("customers");
    pruneGrovePicks("warm");
    return row;
  }

  function idealLeadInboxNameSet(inboxRows) {
    var set = {};
    (inboxRows || []).forEach(function (r) {
      var n = String((r && (r.name || r.full_name || "")) || "").trim().toLowerCase();
      if (n) set[n] = true;
    });
    return set;
  }

  function paintSyncChrome() {
    var banner = document.getElementById("syncBanner");
    var text = document.getElementById("syncBannerText");
    var syncLabel = document.getElementById("syncLabel");
    var Cloud = window.FS.Cloud;
    var signedIn = !!(Cloud && Cloud.isSignedIn && Cloud.isSignedIn());
    if (banner) {
      if (syncFail && signedIn) {
        banner.hidden = false;
        if (text) text.textContent = syncFail.message || "Couldn’t sync your progress to the cloud.";
      } else {
        banner.hidden = true;
      }
    }
    if (syncLabel) {
      if (syncFail && signedIn) {
        syncLabel.textContent = "Sync issue — open Settings or tap Retry below.";
        syncLabel.classList.add("is-error");
      } else {
        syncLabel.classList.remove("is-error");
        if (signedIn) {
          syncLabel.textContent = Cloud.mode && Cloud.mode() === "supabase"
            ? "You're signed in — progress syncs."
            : "Signed in · local demo mode (this browser).";
        } else {
          syncLabel.textContent = "Answers save on this device. Sign in anytime to sync.";
        }
      }
    }
  }

  function markCloudSyncOk() {
    syncFail = null;
    paintSyncChrome();
  }

  function markCloudSyncError(err) {
    var msg = (err && err.message) ? String(err.message) : "Couldn’t sync your progress to the cloud.";
    if (/Failed to fetch|NetworkError|network/i.test(msg)) {
      msg = "You’re offline or the network hiccuped — progress is saved on this device.";
    }
    syncFail = { message: msg, at: Date.now() };
    if (window.FS.reportError) window.FS.reportError("cloud sync", err);
    paintSyncChrome();
  }

  var cloudSyncTimer;
  function captureLiveFields() {
    try {
      var ae = document.activeElement;
      if (!ae || !ae.getAttribute) return;
      var liveKey = ae.getAttribute("data-key");
      if (liveKey != null) state.data[liveKey] = ae.value;
      var liveTree = ae.getAttribute("data-tname");
      if (liveTree && Tree && Tree.setName) Tree.setName(state, liveTree, ae.value);
    } catch (e) {}
  }

  /* Device first — iOS can kill the app before a 500ms debounce fires. */
  function persistLocal() {
    captureLiveFields();
    ensureSettings();
    var uid = boundUserId();
    state.savedAt = new Date().toISOString();
    writeSnapshot(progressKeyFor(uid || null), snapshotFromState());
    try { localStorage.setItem(activeAccountKey(), uid || ""); } catch (e) {}
    return uid;
  }

  function save(opts) {
    opts = opts || {};
    ensureSettings();
    var uid = boundUserId();
    var skipCloud = false;
    try {
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.isSignedIn && Cloud.isSignedIn() && Cloud.user && Cloud.user()) {
        var cloudId = Cloud.user().id;
        if (!uid) {
          /* Guest → signed in: adopt this account bucket. Never write an
             empty guest screen over a richer account snapshot. */
          var existingAcc = readSnapshot(progressKeyFor(cloudId));
          if (existingAcc && snapshotProgressScore(existingAcc) > snapshotProgressScore(snapshotFromState())) {
            applyStateSnapshot(existingAcc);
            ensureSettings();
          }
          uid = cloudId;
          state.settings.boundUserId = cloudId;
        } else if (uid !== cloudId) {
          /* Never rewrite another account’s cloud row with this memory. */
          skipCloud = true;
          markCloudSyncError({
            message: "This device’s saved progress belongs to a different account — cloud sync is paused so we don’t overwrite either one. Sign out, or keep using this device as-is."
          });
        }
      }
    } catch (e) {}
    persistLocal();
    if (opts.skipCloud || skipCloud) return;
    clearTimeout(cloudSyncTimer);
    var push = function () {
      if (!window.FS.BridgeUI || !window.FS.BridgeUI.syncNow) return;
      Promise.resolve(window.FS.BridgeUI.syncNow()).then(function () {
        markCloudSyncOk();
      }).catch(function (err) {
        console.warn("[First Seeds] cloud sync:", err);
        markCloudSyncError(err);
      });
    };
    if (opts.immediate) push();
    else {
      cloudSyncTimer = setTimeout(push, 800);
    }
  }

  function flushSave() {
    save({ immediate: true });
  }

  function rehydrateDomFromState() {
    var ae = document.activeElement;
    var fs = document.querySelectorAll("[data-key]");
    for (var j = 0; j < fs.length; j++) {
      if (fs[j] === ae) continue;
      var k = fs[j].getAttribute("data-key");
      fs[j].value = state.data[k] != null ? state.data[k] : "";
    }
    try { updateModeUI(); } catch (e) {}
    try { renderNav(); } catch (e) {}
    try { renderPanels(); } catch (e) {}
    try { renderChoices(); } catch (e) {}
    try { renderRhythms(); } catch (e) {}
    try { renderSeedTypes(); } catch (e) {}
    try {
      if (Tree && Tree.render && !(ae && ae.getAttribute && ae.getAttribute("data-tname") != null)) {
        Tree.render(state);
      }
    } catch (e) {}
    try { liveRefresh({ silent: true }); } catch (e) {}
    try { renderGreetings(); } catch (e) {}
    paintSyncChrome();
  }

  /* Rough “how much runway work is in this snapshot?” — used when guest signs into
     an account that already has a local bucket on this device. */
  function snapshotProgressScore(snap) {
    if (!snap) return 0;
    var d = snap.data || {};
    var s = snap.settings || {};
    var score = 0;
    if ((s.partnerName || "").trim()) score += 30;
    if ((s.partnerLastName || "").trim()) score += 10;
    if ((s.hubMode || "").trim()) score += 40;
    ["why", "moment", "said_yes", "page_story", "customers", "warm"].forEach(function (k) {
      score += Math.min(200, ((d[k] || "") + "").trim().length);
    });
    if (d.calendar && typeof d.calendar === "object") {
      Object.keys(d.calendar).forEach(function (date) {
        var items = (d.calendar[date] && d.calendar[date].items) || [];
        score += items.length * 25;
      });
    }
    if (d.tree && Array.isArray(d.tree)) score += d.tree.length * 15;
    var done = snap.done || {};
    Object.keys(done).forEach(function (k) {
      if (done[k]) score += 20;
    });
    return score;
  }

  function howGrowDraftScore(answers) {
    var a = answers || {};
    var n = 0;
    function add(v) {
      if (v == null) return;
      if (typeof v === "string") {
        if (String(v).trim()) n += 1;
        return;
      }
      if (Array.isArray(v)) {
        if (v.length) n += 1;
        return;
      }
      if (typeof v === "object") Object.keys(v).forEach(function (k) { add(v[k]); });
    }
    Object.keys(a).forEach(function (k) { add(a[k]); });
    return n;
  }

  /* Switch local runway bucket when the signed-in account changes.
     Always keep the richer snapshot — never paint blank over last night's work. */
  function bindProgressAccount(userId) {
    userId = (userId || "").trim();
    ensureSettings();
    var prev = boundUserId();
    if (prev === userId) {
      if (userId) {
        state.settings.boundUserId = userId;
        try { localStorage.setItem(activeAccountKey(), userId); } catch (e) {}
      }
      return { switched: false };
    }
    writeSnapshot(progressKeyFor(prev || null), snapshotFromState());
    if (userId) {
      var existing = readSnapshot(progressKeyFor(userId));
      var currentScore = snapshotProgressScore(snapshotFromState());
      var existingScore = snapshotProgressScore(existing);
      /* Never paint a poorer/empty bucket over answers still on screen —
         first sign-in, a second email, or a stale blank account key. */
      if (existing && existingScore >= currentScore) {
        applyStateSnapshot(existing);
      }
      state.settings.boundUserId = userId;
    } else {
      var guest = readSnapshot(progressKeyFor(null));
      var currentScore = snapshotProgressScore(snapshotFromState());
      var guestScore = snapshotProgressScore(guest);
      if (guest && guestScore >= currentScore && guestScore > 0) {
        applyStateSnapshot(guest);
        state.settings.boundUserId = "";
      } else if (currentScore > 0) {
        /* Keep last night's answers on screen; don't paint a blank guest. */
        state.settings.boundUserId = "";
      } else if (guest) {
        applyStateSnapshot(guest);
        state.settings.boundUserId = "";
      } else {
        applyStateSnapshot(blankState());
        state.settings.boundUserId = "";
      }
    }
    try { localStorage.setItem(activeAccountKey(), userId || ""); } catch (e) {}
    writeSnapshot(progressKeyFor(userId || null), snapshotFromState());
    try {
      var nextHowGrow = normalizeHowGrowAnswers(readHowGrowDraft());
      var nextHowGrowScore = howGrowDraftScore(nextHowGrow);
      var curHowGrowScore = howGrowDraftScore(howGrowAnswers);
      if (nextHowGrowScore >= curHowGrowScore) howGrowAnswers = nextHowGrow;
      else writeHowGrowDraft();
    } catch (e) {
      howGrowAnswers = {};
    }
    rehydrateDomFromState();
    /* Mid-onboarding auth must refresh name/auth panes for the new bucket. */
    try {
      var gate = document.getElementById("onboarding");
      if (gate && gate.classList.contains("open")) renderOnboardingStep();
    } catch (e) {}
    return { switched: true };
  }

  /* Don’t lose the last Roots keystrokes if the tab/app closes mid-debounce. */
  function stampWarmVisit() {
    try {
      var now = String(Date.now());
      localStorage.setItem("fsWarm", now);
      sessionStorage.setItem("fsWarm", now);
      var Cloud = window.FS.Cloud;
      /* Don't write "0" until Cloud has finished restoring — an early stamp
         here used to wipe yesterday's "1" and flash the account gate. */
      if (!Cloud || !Cloud.bootReady || !Cloud.bootReady()) return;
      var signed = !!(Cloud.isSignedIn && Cloud.isSignedIn());
      /* Never write "0" here — only Log out does that. A background
         refresh blip used to stamp 0 and lock them out next open. */
      if (signed) localStorage.setItem("fsSigned", "1");
    } catch (e) {}
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      flushSave();
      stampWarmVisit();
    }
    if (document.visibilityState === "visible") resumeNotifyPrompt();
  });
  window.addEventListener("pagehide", function () {
    flushSave();
    stampWarmVisit();
  });
  document.addEventListener("freeze", function () {
    persistLocal();
  });
  var sessionStartsAtTop = true;

  window.addEventListener("pageshow", function (e) {
    resumeNotifyPrompt();
    if (!e.persisted && sessionStartsAtTop) pinOpenToTop();
  });
  window.addEventListener("focus", function () {
    resumeNotifyPrompt();
  });

  loadState();
  try {
    if (history && "scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (eScrollRest) {}
  if (state.data) state.data.panelScroll = {};
  stampWarmVisit();

  window.addEventListener("storage", function (e) {
    if (!e || !e.key) return;
    if (e.key !== progressKeyFor(boundUserId() || null)) return;
    var snap = readSnapshot(e.key);
    if (!snap) return;
    try {
      var ae = document.activeElement;
      var liveKey = "";
      var liveVal = "";
      var liveTreePath = "";
      var liveTreeName = "";
      if (ae && ae.getAttribute) {
        if (ae.getAttribute("data-key") != null) {
          liveKey = ae.getAttribute("data-key");
          liveVal = ae.value;
        }
        if (ae.getAttribute("data-tname") != null) {
          liveTreePath = ae.getAttribute("data-tname");
          liveTreeName = ae.value;
        }
      }
      var keepActive = "";
      try {
        if (document.hasFocus() && state.active) keepActive = state.active;
      } catch (eFocus) {}
      applyStateSnapshot(snap);
      if (keepActive) state.active = keepActive;
      if (liveKey && state.data) state.data[liveKey] = liveVal;
      if (liveTreePath && Tree && Tree.setName) Tree.setName(state, liveTreePath, liveTreeName);
      rehydrateDomFromState();
    } catch (err) {
      if (window.FS.reportError) window.FS.reportError("tab sync", err);
    }
  });

  /* ── mode helpers ────────────────────────────────────── */
  function expectSignedIn() {
    try {
      if (localStorage.getItem("fsSigned") === "1") return true;
    } catch (e) {}
    return !!(state && state.settings && state.settings.boundUserId);
  }
  function authStillRestoring() {
    if (!expectSignedIn() || cloudSignedIn()) return false;
    var Cloud = window.FS.Cloud;
    if (Cloud && Cloud.bootReady && Cloud.bootReady()) return false;
    return true;
  }
  function isStarter() { return state.settings.hubMode === "starter"; }
  function isFull() { return state.settings.hubMode === "full"; }
  function usesCustomLanding() { return false; }
  function usesBuiltInLeadPage() { return true; }
  function leadPageReady() {
    var Cloud = window.FS.Cloud;
    var u = Cloud && Cloud.user ? Cloud.user() : null;
    return !!(u && u.lead_slug);
  }
  function leadSignedIn() {
    var Cloud = window.FS.Cloud;
    return !!(Cloud && Cloud.isSignedIn && Cloud.isSignedIn());
  }
  function leadPreviewSeen() {
    return !!state.data.lead_preview_seen;
  }
  function modeChosen() { return isStarter() || isFull(); }

  function visibleSections() {
    var mode = state.settings.hubMode || "full";
    return SECTIONS.filter(function (s) {
      return !s.modes || s.modes.indexOf(mode) > -1;
    });
  }

  function sectionVisible(id) {
    var secs = visibleSections();
    for (var i = 0; i < secs.length; i++) if (secs[i].id === id) return true;
    return false;
  }

  /* Soft start: roots → share → ground → grove → done
     Full path:    roots → share → ground → grove → plant → tend → done */
  function nextAfter(id) {
    if (packEvergreen()) {
      var pathN = evPath();
      for (var n = 0; n < pathN.length; n++) {
        if (pathN[n].id === id) {
          if (n + 1 >= pathN.length) return "ev-home";
          return pathN[n + 1].goto || pathN[n + 1].id;
        }
      }
      return "ev-home";
    }
    if (id === "tree") return isStarter() ? "done" : "plant";
    if (isStarter()) {
      return { roots: "share", share: "ground", ground: "grove", grove: "done" }[id];
    }
    return { roots: "share", share: "ground", ground: "grove", grove: "plant", plant: "tend", tend: "done" }[id];
  }

  function priorSectionId(id) {
    if (packEvergreen()) {
      var pathP = evPath();
      for (var p = 0; p < pathP.length; p++) {
        if (pathP[p].id === id) return p === 0 ? null : pathP[p - 1].id;
      }
      return null;
    }
    var secs = visibleSections();
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].id === id) return i === 0 ? null : secs[i - 1].id;
    }
    return null;
  }

  function sectionLabel(id) {
    if (packEvergreen()) {
      var pathL = evPath();
      for (var l = 0; l < pathL.length; l++) {
        if (pathL[l].id === id) return pathL[l].label;
      }
    }
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) return SECTIONS[i].label;
    return id;
  }

  function softUnlocked(id) {
    return !!(state.data.softUnlock && state.data.softUnlock[id]);
  }

  /* Prior modules must be truly finished — soft-unlock peek doesn't count as a chain link. */
  function sectionChainComplete(id) {
    if (!id) return true;
    if (id === "roots") return rootCount() >= ROOT_MAX;
    if (!state.done[id]) return false;
    return sectionChainComplete(priorSectionId(id));
  }

  function isContentSurface(id) {
    return id === "tend" || id === "calendar" || id === "curiosity-photos" ||
      id === "content-vault" || id === "content-stories" || id === "content-week" ||
      id === "grove-shelf";
  }

  function isTeamCalendarSurface(id) {
    return id === "tend" || id === "calendar";
  }

  function keepPushSurfaceActive() {
    return !!(keepPushSurface && state.active === keepPushSurface);
  }

  function shouldParkStarterSurface() {
    if (packEvergreen()) return false;
    if (keepPushSurfaceActive()) return false;
    /* Team dates stay open on Soft start — same as Evergreen. */
    if (isTeamCalendarSurface(state.active)) return false;
    return isStarter() && (state.active === "leader" || isContentSurface(state.active));
  }

  function shouldParkLockedModule() {
    if (keepPushSurfaceActive()) return false;
    var id = normalizePanelId(state.active);
    return !!(id && !isModuleUnlocked(id));
  }

  function isChromeGoto(goto) {
    return goto === "welcome" || goto === "done" || goto === "calendar" || goto === "leader" ||
      goto === "grove-board" || goto === "ev-board" || goto === "know" || goto === "tend" ||
      goto === "products" || goto === "talk" || goto === "quiz" || goto === "why" ||
      goto === "leaders" || goto === "curiosity-photos" || goto === "content-vault" ||
      goto === "content-stories" || goto === "content-week" || goto === "grove-shelf" ||
      goto === "leads" || goto === "customers" || goto === "ev-home" || goto === "ev-resources" ||
      goto === "ev-team" || goto === "ev-learn" || goto === "ev-heart" || goto === "ev-leads" ||
      goto === "ev-dream" || goto === "ev-dates" || goto === "ev-links" || goto === "roots";
  }

  function isModuleUnlocked(id) {
    if (id === "tree") id = "grove";
    if (packEvergreen()) {
      if (id === "ev-home" || id === "ev-resources" || id === "ev-team" || id === "ev-board" || id === "know" || id === "tend" ||
        id === "calendar" || id === "products" || id === "welcome" || isLeadersSurface(id)) return true;
      if (evStep(id)) return evStepUnlocked(id);
      return false;
    }
    if (isTeamCalendarSurface(id)) return true;
    if (isContentSurface(id) && isStarter()) return false;
    if (!id || isChromeGoto(id) || isLeadersSurface(id)) return true;
    if (!sectionVisible(id)) return false;
    if (softUnlocked(id)) return true;
    if (state.done[id]) return true;
    var prior = priorSectionId(id);
    if (!prior) return true;
    return sectionChainComplete(prior);
  }

  function ensureSoftUnlockMap() {
    if (!state.data.softUnlock) state.data.softUnlock = {};
  }

  function partnerName() {
    return ((state.settings.partnerName || "") + "").trim();
  }

  function partnerLastName() {
    return ((state.settings.partnerLastName || "") + "").trim();
  }

  /* If someone typed "First Last" into the first-name field before we asked for last name, split it. */
  function splitFullNameIfNeeded() {
    var first = partnerName();
    var last = partnerLastName();
    if (last || !first) return false;
    var parts = first.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return false;
    state.settings.partnerName = parts[0];
    state.settings.partnerLastName = parts.slice(1).join(" ");
    return true;
  }

  function firstName() {
    var Cloud = window.FS && window.FS.Cloud;
    var n = partnerName();
    if (!n && Cloud && Cloud.user) {
      var u = Cloud.user();
      if (u && Cloud.personFirstName) n = Cloud.personFirstName(u);
      else n = ((u && (u.display_name || u.first_name)) || "") + "";
    }
    var first = n ? n.split(/\s+/)[0] : "";
    if (Cloud && Cloud.isPlaceholderName && Cloud.isPlaceholderName(first)) return "";
    return first;
  }

  /* ── growth math ────────────────────────────────────────
     Roots  = the 3 Roots answers (underground) — shown as Roots x/3
     Checks = checklist items outside Roots — shown as Checks x/y
     Bar    = overall progress including Roots (Growth %)
     ───────────────────────────────────────────────────── */
  var ROOT_FIELDS = ["why", "moment", "said_yes"];
  var ROOT_MAX = 3;
  var lastSprout = -1;

  function filledText(k) { return ((state.data[k] || "") + "").trim().length > 0; }
  function giveDraftFilled() {
    return filledText("seed_curtain") || filledText("seed_honest") || filledText("seed_values") || filledText("seed_value");
  }
  function anySeedDraft() {
    return filledText("seed_open") || giveDraftFilled() || filledText("seed_invite");
  }
  /* Old saves used one shared seed_value — park it under Behind the Scenes */
  if (filledText("seed_value") && !filledText("seed_curtain") && !filledText("seed_honest") && !filledText("seed_values")) {
    state.data.seed_curtain = state.data.seed_value;
  }

  function rootCount() {
    var n = 0;
    for (var i = 0; i < ROOT_FIELDS.length; i++) if (filledText(ROOT_FIELDS[i])) n++;
    return n;
  }

  function doneCount() {
    var secs = visibleSections();
    var n = 0;
    for (var i = 0; i < secs.length; i++) if (state.done[secs[i].id]) n++;
    return n;
  }

  function sectionTotal() {
    return visibleSections().length;
  }

  function checklistProgress() {
    /* Count every visible required checklist item — not only the unlocked
       slice — so Growth % and plant stage never false-bloom mid-module. */
    var secs = visibleSections();
    var done = 0, total = 0, sproutDone = 0, sproutTotal = 0;
    for (var i = 0; i < secs.length; i++) {
      var items = checklistItems(secs[i].id);
      for (var j = 0; j < items.length; j++) {
        if (items[j].optional) continue;
        total++;
        if (items[j].done) done++;
        if (secs[i].id !== "roots") {
          sproutTotal++;
          if (items[j].done) sproutDone++;
        }
      }
    }
    return { done: done, total: total, sproutDone: sproutDone, sproutTotal: sproutTotal };
  }

  /* Drop sticky done flags when the work is no longer complete. */
  function reconcileDoneFlags() {
    var secs = visibleSections();
    var changed = false;
    for (var i = 0; i < secs.length; i++) {
      var id = secs[i].id;
      if (state.done[id] && !canComplete(id)) {
        state.done[id] = false;
        changed = true;
      }
    }
    return changed;
  }

  /* Calendar and Patch of Ground finish themselves when the work is done —
     no extra Continue tap buried under the checklist. */
  function autoClaimReadySteps() {
    if (packEvergreen()) return false;
    var claimed = false;
    if (canComplete("ground") && !state.done.ground) {
      state.done.ground = true;
      claimed = true;
    }
    if (canComplete("tend") && !state.done.tend) {
      state.done.tend = true;
      claimed = true;
    }
    if (claimed) save();
    return claimed;
  }

  var DEFAULT_LEAD_BLURB = "I’m gathering a small founding circle before launch — leave your info and I’ll follow up personally.";

  function groundLineLocked() {
    return !!(state.data && state.data.ground_line_locked);
  }

  function liveOpeningLine() {
    var local = ((state.data.page_story || "") + "").trim();
    if (!groundLineLocked()) return local;
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    var blurb = user && ((user.lead_blurb || "") + "").trim();
    return blurb || local;
  }

  function maybeLockGroundLine() {
    if (packEvergreen() || groundLineLocked()) return false;
    if (!filledText("page_story")) return false;
    if (normalizePanelId(state.active) === "ground") return false;
    /* Don’t hand off until the page is actually theirs (or the step is done). */
    if (!state.done.ground && !leadPageReady()) return false;
    if (!state.data) state.data = {};
    syncPageStoryToLeadBlurb(true);
    state.data.ground_line_locked = true;
    save();
    renderMiniPage();
    return true;
  }

  function flushOpeningLineIfNeeded() {
    if (!groundLineLocked() || !usesBuiltInLeadPage()) return;
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn() || !Cloud.setLeadBlurb) return;
    var user = Cloud.user() || {};
    if (((user.lead_blurb || "") + "").trim()) return;
    var story = ((state.data.page_story || "") + "").trim().slice(0, 280);
    if (!story) return;
    Cloud.setLeadBlurb(story).catch(function (err) {
      console.warn("[First Seeds] setLeadBlurb:", err);
    });
  }

  /* ── DOM refs ────────────────────────────────────────── */
  var nav = document.getElementById("nav");
  var homePlant = document.getElementById("homePlant");
  var finishPlant = document.getElementById("finishPlant");
  var caption = document.getElementById("plantCaption");
  var progressFill = document.getElementById("progressFill");

  function esc(t) { return (t + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function renderDmStarters() {
    var host = document.getElementById("dmStarters");
    if (!host) return;
    var list = CFG.dmStarters || [];
    if (!list.length && CFG.dmStarter) {
      list = [{ label: "Warm opener", text: CFG.dmStarter }];
    }
    var html = "";
    for (var i = 0; i < list.length; i++) {
      var id = "dmStarter_" + i;
      var label = list[i].label || ("Option " + (i + 1));
      html += '<div class="dm-option copy-card">';
      html += '<button type="button" class="dm-option-head copy-card-head" data-copy-toggle="' + id + '">';
      html += '<span class="dm-option-label">' + esc(label) + "</span>";
      html += '<span class="copy-card-chev">+</span></button>';
      html += '<div class="dm-option-body copy-card-body" id="' + id + '_body" hidden>';
      html += '<div class="starter-text" id="' + id + '">' + esc(list[i].text) + "</div>";
      html += '<button type="button" class="copy-btn small" data-copy="' + id + '">Copy it</button>';
      html += "</div></div>";
    }
    host.innerHTML = html;
  }

  function setOverlayOpen(open) {
    document.body.classList.toggle("overlay-open", !!open);
  }

  function anyBlockingOverlayOpen() {
    var ids = ["authOverlay", "howGrowOverlay", "lastNameOverlay", "groveLeaderWelcomeOverlay", "clientsArrivalOverlay", "onboarding", "tour"];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.classList.contains("open")) return true;
    }
    return false;
  }

  function syncOverlayBodyLock() {
    setOverlayOpen(anyBlockingOverlayOpen());
  }
  window.FS.syncOverlayBodyLock = syncOverlayBodyLock;

  function brandEyebrowTextWidth(eb) {
    try {
      if (eb.firstChild) {
        var range = document.createRange();
        range.selectNodeContents(eb);
        var w = range.getBoundingClientRect().width;
        if (range.detach) range.detach();
        if (w) return w;
      }
    } catch (e) {}
    return eb.scrollWidth;
  }

  function fitBrandEyebrow() {
    var eb = document.getElementById("brandEyebrow");
    var title = document.getElementById("brandTitle");
    if (!eb || !title) return;
    eb.style.letterSpacing = "0px";
    eb.style.fontSize = "";
    eb.style.width = "";
    eb.style.minWidth = "";
    eb.style.maxWidth = "";
    var target = title.getBoundingClientRect().width;
    if (target < 8) return;
    eb.style.width = target + "px";
    eb.style.minWidth = target + "px";
    eb.style.maxWidth = target + "px";
    var w = brandEyebrowTextWidth(eb);
    if (!w) return;
    if (w > target + 0.5) {
      var fs = parseFloat(window.getComputedStyle(eb).fontSize) || 12;
      eb.style.fontSize = Math.max(9, fs * (target / w)) + "px";
      w = brandEyebrowTextWidth(eb);
    }
    if (w >= target - 0.5) return;
    var lo = 0;
    var hi = 16;
    var best = 0;
    for (var i = 0; i < 14; i++) {
      var mid = (lo + hi) / 2;
      eb.style.letterSpacing = mid + "px";
      if (brandEyebrowTextWidth(eb) <= target + 0.25) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    eb.style.letterSpacing = best + "px";
  }

  function scheduleFitBrandEyebrow() {
    fitBrandEyebrow();
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(function () {
        fitBrandEyebrow();
        requestAnimationFrame(fitBrandEyebrow);
      });
    }
  }

  function applyPackChrome() {
    var ev = packEvergreen();
    document.body.classList.toggle("pack-evergreen", ev);
    document.body.classList.toggle("pack-grove", !ev);
    document.body.classList.toggle("is-org-leader", isOrgLeader());
    var EV = window.FS.EVERGREEN || {};
    var brand = (window.FS.Pack && window.FS.Pack.meta && window.FS.Pack.meta().branding) || {};
    var evBrand = EV.branding || {};
    var eyebrow = document.getElementById("brandEyebrow");
    var title = document.getElementById("brandTitle");
    var tagline = document.getElementById("brandTagline");
    var menuEyebrow = document.getElementById("hubMenuEyebrow");
    if (ev) {
      if (eyebrow) eyebrow.textContent = brand.eyebrow || evBrand.eyebrow || "EVERGREEN CO";
      if (title) title.textContent = "First Seeds";
      if (tagline) tagline.textContent = evBrand.tagline || brand.tagline || "";
      if (menuEyebrow) menuEyebrow.textContent = "Evergreen Co";
      document.title = "First Seeds";
      var evDesc = document.querySelector('meta[name="description"]');
      if (evDesc) evDesc.setAttribute("content", "First Seeds for Evergreen Co — your story, your products, your team.");
    } else {
      if (eyebrow) eyebrow.textContent = CFG.teamName;
      if (title) title.textContent = "First Seeds";
      if (tagline) tagline.textContent = CFG.tagline;
      if (menuEyebrow) menuEyebrow.textContent = "First Seeds";
      document.title = "First Seeds — Your Runway to Launch";
      var groveDesc = document.querySelector('meta[name="description"]');
      if (groveDesc) groveDesc.setAttribute("content", "A self-paced guide for founding Ringana partners — from I'm in to seeds planted, before pre-registration opens October 1.");
    }
    var home = EV.home || {};
    if (ev) {
      setText("evHomeEyebrow", home.eyebrow);
      var evTitle = document.getElementById("evHomeTitle");
      if (evTitle) {
        var homeName = firstName();
        evTitle.innerHTML = homeName
          ? ("Hey " + esc(homeName) + ".<br>Watch it grow.")
          : (home.title || "Watch it grow.");
      }
      setText("evHomeBody", home.body);
      setText("evHomePathTag", home.pathTag);
      var rootsCopy = EV.roots || {};
      if (rootsCopy.title) setText("rootsHeadline", rootsCopy.title);
      var rootsSub = document.querySelector("#panel-roots .sec-sub");
      if (rootsCopy.sub && rootsSub) rootsSub.textContent = rootsCopy.sub;
      var rootsBody = document.querySelector("#panel-roots > .body-p");
      if (rootsCopy.body && rootsBody) rootsBody.textContent = rootsCopy.body;
      var rootsBtn = document.querySelector('[data-complete="roots"]');
      if (rootsBtn) {
        var ready = rootsCopy.completeReady || "Story’s in → Pick your first few";
        var wait = rootsCopy.completeWait || "Fill in all three above to continue";
        rootsBtn.setAttribute("data-ready", ready);
        rootsBtn.setAttribute("data-wait", wait);
        if (rootsBtn.classList.contains("waiting")) rootsBtn.textContent = wait;
      }
      var name = firstName();
      setText("rootsHeadline", name ? (name + " — plant your roots") : (rootsCopy.title || "Plant Your Roots"));
      setText("evHomeNextLabel", home.nextLabel);
      var learn = EV.learn || {};
      setText("knowEyebrow", learn.eyebrow);
      setText("knowTitle", learn.title);
      if (learn.body) setText("knowIntro", learn.body);
      var rememberBody = document.getElementById("knowRememberBody");
      if (rememberBody) {
        rememberBody.innerHTML = "We're building something new in the U.S. Some details may shift as we get closer to launch. When they do, Evergreen Co will share updates. What's below is <strong>current guidance</strong> — not a guarantee.";
      }
      var cal = EV.calendar || {};
      setText("calEyebrow", cal.eyebrow);
      setText("calTitle", cal.title);
      setText("calSub", cal.sub);
      var res = EV.resources || {};
      setText("evResEyebrow", res.eyebrow);
      setText("evResTitle", res.title);
      if (res.sub) setText("evResSub", res.sub);
      renderEvergreenResources();
    } else {
      setText("knowEyebrow", "CLARITY · NOT HYPE");
      setText("knowTitle", "Learn");
      setText("calEyebrow", "PLAN · POST YOURSELF");
      setText("calTitle", "Calendar");
      setText("calSub", "Team dates — plus the vault, photos, and this week's plan.");
      var groveRemember = document.getElementById("knowRememberBody");
      if (groveRemember) {
        groveRemember.innerHTML = "We're building something new in the U.S. Some details may shift as we get closer to launch. When they do, The Fresh Grove will share updates. What's below is <strong>current guidance</strong> — not a guarantee.";
      }
      var groveRootsBtn = document.querySelector('[data-complete="roots"]');
      if (groveRootsBtn) {
        groveRootsBtn.setAttribute("data-ready", "Roots are down → Pick your first few");
        groveRootsBtn.setAttribute("data-wait", "Fill in all three above to continue");
      }
      var groveSub = document.querySelector("#panel-roots .sec-sub");
      if (groveSub) groveSub.textContent = "Before you share a single thing, get clear on your own story.";
      var groveBody = document.querySelector("#panel-roots > .body-p");
      if (groveBody) groveBody.textContent = "Everything you'll share later grows from this. Not a brand script — your words. Why this, why now, why you. These three answers grow roots underground as you write. After Roots, each checklist item you finish sprouts the plant above ground.";
    }
    var preview = document.getElementById("packPreviewSection");
    var Cloud = window.FS.Cloud;
    if (preview) {
      preview.hidden = !(Cloud && Cloud.isSuperAdmin && Cloud.isSuperAdmin());
    }
    paintEvTeamNavBtn();
    paintGroveBoardNavBtn();
    var groveBtn = document.getElementById("viewAsGrove");
    var evBtn = document.getElementById("viewAsEvergreen");
    var hint = document.getElementById("viewAsHint");
    var slug = window.FS.Pack && window.FS.Pack.active ? window.FS.Pack.active() : "fresh-grove";
    if (groveBtn) groveBtn.classList.toggle("on", slug === "fresh-grove");
    if (evBtn) evBtn.classList.toggle("on", slug === "evergreen-co");
    if (hint) {
      var realEv = false;
      try {
        var realUser = Cloud && Cloud.user && Cloud.user();
        var packIds = window.FS.PACK_IDS || {};
        realEv = !!(realUser && (
          realUser.org_slug === "evergreen-co" ||
          (packIds["evergreen-co"] && String(realUser.org_id || "") === String(packIds["evergreen-co"]))
        ));
      } catch (eHint) {}
      if (ev && !realEv) {
        hint.textContent = "You’re previewing Evergreen Co. Your real account is still Fresh Grove.";
      } else if (!ev && realEv) {
        hint.textContent = "You’re previewing Fresh Grove. Your real account is still Evergreen Co.";
      } else if (ev) {
        hint.textContent = "You’re looking at Evergreen Co (your team).";
      } else {
        hint.textContent = "You’re looking at Fresh Grove (your team).";
      }
    }
    try {
      var CloudReady = window.FS.Cloud;
      if (CloudReady && CloudReady.bootReady && CloudReady.bootReady() && window.FS.Pack && window.FS.Pack.remember) {
        window.FS.Pack.remember();
      }
    } catch (ePack) {}
    var joinInput = document.getElementById("evergreenJoinInput");
    var settingsInvite = evergreenPersonInviteUrl();
    if (joinInput) joinInput.value = settingsInvite || "";
    var shareNote = document.querySelector("#evergreenInviteSection .hub-menu-note");
    if (shareNote && ev) {
      var personLinkNote = evergreenPersonInviteUrl();
      if (personLinkNote && evergreenLeaderInviteUrl()) {
        shareNote.textContent = "This is your join link. When someone joins the app with it, they show on your tree.";
      } else if (personLinkNote && evergreenHasSponsor()) {
        shareNote.textContent = "This is your join link. People who use it sit under you — and on your leader’s tree.";
      } else if (personLinkNote) {
        shareNote.textContent = "This is your join link. People who use it sit under you on the team.";
      } else {
        shareNote.textContent = (Cloud && Cloud.isSignedIn && Cloud.isSignedIn())
          ? "Getting your join link…"
          : "Sign in to get your join link. People who use it sit under you on the team.";
      }
    }
    var evCopyBtn = document.getElementById("evergreenCopyJoin");
    if (evCopyBtn && ev) {
      evCopyBtn.textContent = evergreenPersonInviteUrl() ? "Copy my link to join" : "Copy invite link";
    }
    fillEvergreenLeadersJoinInputs();
    paintGroveTeamInvite();
    paintLeadsShareButton();
    paintDeviceSignInLink();
    paintQuizShareButton();
    var copy = leadersCopy();
    setText("leadersCtaTitle", copy.ctaLabel || ("Exclusively for " + leaderRoleNamePlural()));
    setText("leadersResCtaTitle", copy.ctaLabel || ("Exclusively for " + leaderRoleNamePlural()));
    setText("leadersTitle", copy.title || leaderRoleNamePlural());
    paintLeadersSub();
    var broadcastsHint = document.getElementById("optPushBroadcastsHint");
    if (broadcastsHint) {
      broadcastsHint.textContent = ev
        ? "When a note or poll goes out From the hub."
        : "When a Grove Leader sends a note, or a poll goes out.";
    }
    var howGrowPushHint = document.getElementById("optPushHowIGrowHint");
    if (howGrowPushHint) {
      howGrowPushHint.textContent = "When someone who sits under you fills out their support map.";
    }
    var howGrowPushRow = document.getElementById("optPushHowIGrowRow");
    if (howGrowPushRow) howGrowPushRow.hidden = false;
    var broadcastsRow = document.getElementById("optPushBroadcastsRow");
    if (broadcastsRow) broadcastsRow.hidden = false;
    var notifySubEv = document.querySelector('[data-set="notify"] .hub-set-sub.evergreen-only');
    if (notifySubEv) {
      notifySubEv.textContent = "Joins, cheers, zooms, and replays";
    }
    var lastLead = document.getElementById("lastNameLead");
    if (lastLead) {
      lastLead.textContent = ev
        ? "We need last names so your leaders can tell people apart when first names match."
        : "As our Fresh Grove grows so quickly, we’ve already realized we need last names in here — so leaders can tell everyone apart when first names match.";
    }
    var createCard = document.getElementById("createUnlockCard");
    var unlockCard = document.getElementById("unlockExtrasCard");
    var signedIn = !!(Cloud && Cloud.isSignedIn && Cloud.isSignedIn());
    var canMint = !!(signedIn && Cloud && Cloud.canMintUnlockCode && Cloud.canMintUnlockCode());
    if (createCard) createCard.hidden = !canMint;
    if (unlockCard) unlockCard.hidden = !(signedIn && ev);
    if (canMint && unlockCard) unlockCard.hidden = true;
    var broadcastHint = document.getElementById("broadcastSheetHint");
    var broadcastSheet = document.getElementById("broadcastSheet");
    var audiencePick = document.getElementById("broadcastAudience");
    if (broadcastHint && (!broadcastSheet || broadcastSheet.hidden || !audiencePick || audiencePick.hidden)) {
      broadcastHint.textContent = ev
        ? "This pings everyone on this team who turned on team messages — a zoom reminder, a last-minute change, a quick hello."
        : "This pings everyone who turned on team messages — a Grove Gathering reminder, a last-minute Zoom change, a quick hello.";
    }
    rememberLeaderStatus();
    ensurePackActive();
    if (ev) {
      var calBoard = document.getElementById("calendarBoard");
      if (calBoard && calBoard.classList.contains("is-collapsed") &&
          window.FS.BridgeUI && window.FS.BridgeUI.renderCalendar) {
        window.FS.BridgeUI.renderCalendar();
      }
    }
    if (Cloud && Cloud.consumeLeaderClaimNotice) {
      var notice = Cloud.consumeLeaderClaimNotice();
      if (notice === "ok") {
        showGrowthToast("You’re an Evergreen Leader — Resources has a private room just for you.");
      } else if (notice === "wrong-team") {
        showGrowthToast(packEvergreen()
          ? "That link is for a different team — you’re still in Evergreen Co."
          : "That link is for a different team — you’re still in The Fresh Grove.");
      }
    }
    scheduleFitBrandEyebrow();
  }

  var lastEvSprout = -1;
  var lastEvLeadsCount = 0;
  var lastEvDreamCount = 0;
  var evZoomCache = { at: 0, zoom: null, inflight: false };

  function evPath() {
    var EV = window.FS.EVERGREEN || {};
    if (EV.path && EV.path.length) return EV.path;
    return [
      { id: "roots", goto: "roots", label: "Plant Your Roots", sub: "your story" },
      { id: "ev-learn", goto: "ev-learn", label: "Pick Your First Few", sub: "products you love" },
      { id: "ev-heart", goto: "ev-heart", label: "From the Heart", sub: "a post from your story" },
      { id: "ev-leads", goto: "ev-leads", label: "Who You Tell", sub: "people who love the products" },
      { id: "ev-dream", goto: "ev-dream", label: "Who Grows With You", sub: "people who grow beside you" },
      { id: "ev-dates", goto: "tend", label: "Know Your Dates", sub: "team calendar" },
      { id: "ev-links", goto: "ev-resources", label: "Resources", sub: "links outside this app" }
    ];
  }

  function evStep(id) {
    var path = evPath();
    for (var i = 0; i < path.length; i++) {
      if (path[i].id === id || path[i].goto === id) return path[i];
    }
    return null;
  }

  function evStepUnlocked(id) {
    if (softUnlocked(id) || state.done[id]) return true;
    var path = evPath();
    for (var i = 0; i < path.length; i++) {
      if (path[i].id === id) {
        if (i === 0) return true;
        return !!state.done[path[i - 1].id];
      }
    }
    return false;
  }

  function markLearnWalkthroughProgress(kind) {
    if (!state.data) state.data = {};
    var changed = false;
    if (!state.data.evLearnOpened) {
      state.data.evLearnOpened = true;
      changed = true;
    }
    if ((kind === "product" || kind === "favorite") && !state.data.evProductOpened) {
      state.data.evProductOpened = true;
      changed = true;
    }
    return changed;
  }

  function evLearnChecks() {
    var favN = favoriteCount();
    /* Hearts from another pack must not mark Learn or a product as opened. */
    return [
      { done: !!state.data.evLearnOpened, label: "Open the Learn tab" },
      { done: !!state.data.evProductOpened, label: "Open one product and look around" },
      { done: favN >= 2, label: "Heart 2–3 products (" + favN + "/2)" }
    ];
  }
  function evLearnReady() {
    var items = evLearnChecks();
    for (var i = 0; i < items.length; i++) if (!items[i].done) return false;
    return true;
  }

  function evSproutItems() {
    var out = [];
    var path = evPath();
    for (var i = 0; i < path.length; i++) {
      if (path[i].id === "roots") continue;
      var items = checklistItems(path[i].id);
      for (var j = 0; j < items.length; j++) {
        if (items[j].optional) continue;
        out.push(items[j]);
      }
    }
    return out;
  }

  function evProgress() {
    var roots = rootCount();
    var items = evSproutItems();
    var sproutDone = 0;
    for (var i = 0; i < items.length; i++) if (items[i].done) sproutDone++;
    return {
      roots: roots,
      sproutDone: sproutDone,
      sproutTotal: items.length,
      done: roots + sproutDone,
      total: ROOT_MAX + items.length
    };
  }

  function evPlantCaption(prog) {
    if (prog.sproutDone <= 0) {
      if (prog.roots === 0) return "Seed on the dirt. Answer the three story questions to grow underground.";
      if (prog.roots < ROOT_MAX) return "Roots growing · " + prog.roots + " of " + ROOT_MAX + ". Finish your story, then the plant sprouts above ground.";
      return "Roots are in. Heart a few products in Learn to grow your sprout.";
    }
    if (prog.sproutDone >= prog.sproutTotal) return "Full bloom — your Evergreen path is done.";
    return prog.sproutDone + " of " + prog.sproutTotal + " checks done — each one grows your sprout.";
  }

  function pulseEvPlant() {
    var el = document.getElementById("evHomePlant");
    if (!el) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("roots-pulse", "sprout-pulse");
    void el.offsetWidth;
    el.classList.add("sprout-pulse");
    setTimeout(function () {
      el.classList.remove("roots-pulse", "sprout-pulse");
    }, 1000);
  }

  function noteEvergreenVisit(id) {
    if (!packEvergreen()) return false;
    var changed = false;
    if (id === "tend" || id === "calendar") {
      if (!state.data.evCalOpened) { state.data.evCalOpened = true; changed = true; }
    }
    if (id === "ev-resources") {
      if (!state.data.evResOpened) { state.data.evResOpened = true; changed = true; }
    }
    if (id === "products" || id === "know") {
      if (markLearnWalkthroughProgress("learn")) changed = true;
    }
    /* Visit-only steps (no Continue button). Roots / First Few / Heart /
       Who You Tell / Who Grows With You wait for the Continue tap. */
    var auto = { "ev-dates": 1, "ev-links": 1 };
    var path = evPath();
    for (var i = 0; i < path.length; i++) {
      var sid = path[i].id;
      if (!auto[sid]) continue;
      if (canComplete(sid) && evStepUnlocked(sid) && !state.done[sid]) {
        state.done[sid] = true;
        changed = true;
      }
    }
    return changed;
  }

  function paintEvergreenToday(zoom) {
    var title = document.getElementById("evTodayTitle");
    var body = document.getElementById("evTodayBody");
    var why = document.getElementById("evTodayWhy");
    var actions = document.getElementById("evTodayActions");
    if (!title || !body || !actions) return;
    var EV = window.FS.EVERGREEN || {};
    var home = EV.home || {};
    var path = evPath();
    var next = null;
    for (var i = 0; i < path.length; i++) {
      if (!state.done[path[i].id] && evStepUnlocked(path[i].id)) {
        next = path[i];
        break;
      }
    }
    var zoomSoon = !!(zoom && zoom.title && zoom.ms && zoom.ms <= Date.now() + 864e5);
    if (next && !zoomSoon) {
      var started = (next.id === "roots" && rootCount() > 0) ||
        (next.id === "ev-learn" && favoriteCount() > 0) ||
        (next.id === "ev-heart" && filledText("ev_heart")) ||
        (next.id === "ev-leads" && listNames("ev_leads").length > 0) ||
        (next.id === "ev-dream" && listNames("ev_dream").length > 0);
      title.textContent = next.nextTitle || next.label;
      body.textContent = next.nextBody || next.sub;
      if (why) why.textContent = next.nextWhy || "";
      var cta = started ? (next.nextCtaMore || next.nextCta) : (next.nextCta || "Let's go →");
      actions.innerHTML = '<button type="button" class="btn" data-goto="' + esc(next.goto || next.id) + '">' +
        esc(cta) + "</button>";
      return;
    }
    if (zoom && zoom.title) {
      title.textContent = zoom.title;
      body.textContent = zoom.when || "";
      if (why) why.textContent = home.zoomWhy || "A team date — come when you can.";
      actions.innerHTML = '<button type="button" class="btn" data-goto="tend">' +
        esc(home.ctaCalendar || "Open calendar →") + "</button>";
      return;
    }
    title.textContent = "You’re caught up.";
    body.textContent = home.caughtUp || "Your path is done. When a team zoom is posted, it shows up here.";
    if (why) why.textContent = "";
    actions.innerHTML = '<button type="button" class="btn-ghost" data-goto="tend">' +
      esc(home.ctaCalendar || "Open calendar →") + "</button>";
  }

  function fetchEvergreenZoom(cb) {
    var now = Date.now();
    if (evZoomCache.at && now - evZoomCache.at < 30000) {
      cb(evZoomCache.zoom);
      return;
    }
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.listOrgEvents) {
      evZoomCache = { at: now, zoom: null, inflight: false };
      cb(null);
      return;
    }
    if (evZoomCache.inflight) {
      cb(evZoomCache.zoom);
      return;
    }
    evZoomCache.inflight = true;
    var cached = window.FS.BridgeUI && window.FS.BridgeUI.cachedOrgEvents
      ? window.FS.BridgeUI.cachedOrgEvents()
      : null;
    var load = (cached && cached.length)
      ? Promise.resolve(cached)
      : Cloud.listOrgEvents();
    load.then(function (rows) {
      var next = null;
      var nextT = Infinity;
      var tnow = Date.now();
      function nextMs(ev) {
        var start = ev && ev.starts_at ? new Date(ev.starts_at) : null;
        if (!start || isNaN(start.getTime())) return 0;
        var hold = 4 * 60 * 60 * 1000;
        var r = ev.repeat === "weekly" || ev.repeat === "monthly" ? ev.repeat : "none";
        if (r === "none") return start.getTime() + hold >= tnow ? start.getTime() : 0;
        var n = 0;
        while (n < 80) {
          var cur = new Date(start.getTime());
          if (r === "weekly") cur.setDate(cur.getDate() + 7 * n);
          else cur.setMonth(cur.getMonth() + n);
          if (cur.getTime() + hold >= tnow) return cur.getTime();
          n += 1;
        }
        return 0;
      }
      (rows || []).forEach(function (ev) {
        if (!ev) return;
        var aud = ev.audience || "org";
        if (aud === "self" || ev.kind === "personal") return;
        if (aud === "downline" && Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
          var me = Cloud.user && Cloud.user();
          if (!me || ev.created_by !== me.id) return;
        }
        var t = nextMs(ev);
        if (!t) return;
        if (t < nextT) {
          nextT = t;
          next = Object.assign({}, ev, { starts_at: new Date(t).toISOString() });
        }
      });
      var zoom = null;
      if (next) {
        var when = "";
        try {
          when = new Date(next.starts_at).toLocaleString(undefined, {
            weekday: "short", month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit", timeZoneName: "short"
          });
        } catch (e) {}
        zoom = { title: String(next.title || "Team zoom"), when: when, ms: nextT };
      }
      evZoomCache = { at: Date.now(), zoom: zoom, inflight: false };
      cb(zoom);
    }).catch(function () {
      evZoomCache = { at: Date.now(), zoom: null, inflight: false };
      cb(null);
    });
  }

  function renderEvergreenLearnFavs() {
    var n = favoriteCount();
    var hint = n < 2
      ? "Heart at least one more — 2–3 is the sweet spot."
      : n > 3
        ? "Nice shortlist. You can trim anytime in Learn → Favorites."
        : "Solid shortlist. That’s enough to talk from.";
    renderFocusShortlist({
      listId: "evLearnFavList",
      empty: "Heart a few products in Learn — they’ll show up here.",
      emptyGoto: "products",
      emptyCta: "Open products →",
      hint: hint,
      tapOpen: true,
      returnPanel: "ev-learn",
      returnLabel: "Pick Your First Few"
    });
  }

  function renderEvergreenHeartStory() {
    var el = document.getElementById("evHeartStory");
    if (!el) return;
    var why = (state.data.why || "").trim();
    var moment = (state.data.moment || "").trim();
    var yes = (state.data.said_yes || "").trim();
    if (!why && !moment && !yes) {
      el.innerHTML = '<span class="dim">Your story will land here after Roots.</span>';
      return;
    }
    var parts = [];
    if (why) parts.push(esc(why));
    if (moment) parts.push(esc(moment));
    if (yes) parts.push(esc(yes));
    el.innerHTML = parts.join(" ");
  }

  function renderEvergreenPathChecks() {
    var ids = ["ev-learn", "ev-leads", "ev-dream"];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var panel = document.getElementById("panel-" + id);
      if (!panel) continue;
      var box = panel.querySelector("[data-module-check]");
      if (!box) {
        box = document.createElement("div");
        box.className = "module-check";
        box.setAttribute("data-module-check", id);
        if (id === "ev-leads" || id === "ev-dream") {
          var btnRow = panel.querySelector(".btn-row");
          if (btnRow) btnRow.insertAdjacentElement("beforebegin", box);
          else panel.appendChild(box);
        } else {
          var after = panel.querySelector(".share-actions") || panel.querySelector(".body-p") || panel.querySelector(".sec-sub") || panel.querySelector("h1");
          if (after) after.insertAdjacentElement("afterend", box);
          else panel.insertBefore(box, panel.firstChild);
        }
      }
      var items = checklistItems(id);
      if (!items.length) { box.hidden = true; continue; }
      var doneN = 0;
      for (var j = 0; j < items.length; j++) if (items[j].done && !items[j].optional) doneN++;
      var need = 0;
      for (var r = 0; r < items.length; r++) if (!items[r].optional) need++;
      var all = need > 0 && doneN === need;
      if (state.done[id]) { box.hidden = true; continue; }
      box.hidden = false;
      var html = '<div class="module-check-head">' +
        '<span class="module-check-tag">' + (id === "ev-learn" ? "LEARN WALKTHROUGH" : "THIS STEP") + "</span>" +
        '<span class="module-check-count' + (all ? " on" : "") + '">' + doneN + " of " + need + " done</span>" +
        "</div><ul class=\"module-check-list\">";
      for (var k = 0; k < items.length; k++) {
        html += '<li class="' + (items[k].done ? "is-done" : "") + '">' +
          '<span class="module-check-mark" aria-hidden="true">' + (items[k].done ? "✓" : "○") + "</span>" +
          esc(items[k].label) + "</li>";
      }
      html += "</ul>";
      box.innerHTML = html;
    }
  }

  function renderEvergreenLists() {
    renderNameLane({
      names: listNames("ev_leads"),
      countId: "evLeadsCount",
      treesId: "evLeadsTrees",
      hintId: "evLeadsHint",
      empty: "Empty list — who would you actually tell about these products?",
      unit: "names",
      suffix: " who might love the products",
      goal: 5,
      hints: {
        low: "Keep going — 5 names is a real start.",
        mid: "Nice. That’s enough to continue — add more anytime.",
        full: "Solid list — quality chats beat a long one.",
        over: "Plenty — pick the warmest handful when you reach out."
      },
      hues: ["#d9a93f", "#e8c86a", "#c9a04a", "#f0d06a"],
      flash: true,
      getPrev: function () { return lastEvLeadsCount; },
      setPrev: function (n) { lastEvLeadsCount = n; }
    });
    renderNameLane({
      names: listNames("ev_dream"),
      countId: "evDreamCount",
      treesId: "evDreamTrees",
      hintId: "evDreamHint",
      empty: "Empty sketch — who grows beside you?",
      unit: "names",
      suffix: " who grow with you",
      goal: 3,
      hints: {
        low: "Keep going — 3 people is enough to continue.",
        mid: "Nice sketch. Add more anytime — hopeful is fine.",
        full: "That’s a real picture of who grows with you.",
        over: "Plenty — the warmest few matter most."
      },
      hues: ["#abb09a", "#c5c9b8", "#9aa08a", "#b8bca8"],
      flash: true,
      getPrev: function () { return lastEvDreamCount; },
      setPrev: function (n) { lastEvDreamCount = n; }
    });
  }

  function renderEvergreenSprout(opts) {
    opts = opts || {};
    noteEvergreenVisit(state.active);
    var prog = evProgress();
    var visual = plantVisualStage(prog.sproutDone, prog.sproutTotal);
    var plant = document.getElementById("evHomePlant");
    var plantKey = visual + ":" + prog.roots + ":" + prog.sproutDone;
    if (plant && window.FS.plantSVG && plant.dataset.plantKey !== plantKey) {
      plant.dataset.plantKey = plantKey;
      plant.innerHTML = window.FS.plantSVG(visual, prog.roots, ROOT_MAX, "evh_");
    }
    var grew = !opts.silent && lastEvSprout >= 0 && prog.sproutDone > lastEvSprout;
    if (grew) {
      var prevSnap = {
        roots: prog.roots,
        sprout: Math.max(0, lastEvSprout),
        sproutTotal: prog.sproutTotal
      };
      var nextSnap = { roots: prog.roots, sprout: prog.sproutDone, sproutTotal: prog.sproutTotal };
      var sproutMsg = growthMessage("sprout", prog.roots, prog.sproutDone, prog.sproutTotal);
      if (opts.deferCelebrate) {
        queueGrowthCelebration("sprout", sproutMsg, prevSnap, nextSnap);
      } else {
        clearPendingGrowth();
        pulseEvPlant();
        celebrateGrowth("sprout", sproutMsg, prevSnap, nextSnap);
      }
    }
    lastEvSprout = prog.sproutDone;

    var pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0;
    var fill = document.getElementById("evProgressFill");
    if (fill) fill.style.width = pct + "%";
    var track = document.getElementById("evProgressTrack");
    if (track) track.setAttribute("aria-valuenow", String(pct));
    var label = document.getElementById("evProgressLabel");
    if (label) label.textContent = "Growth " + pct + "%";
    var homePct = document.getElementById("evHomePctLabel");
    if (homePct) homePct.textContent = pct + "%";
    var statRoots = document.getElementById("evStatRoots");
    var statStops = document.getElementById("evStatStops");
    if (statRoots) statRoots.innerHTML = "<em>Roots</em> " + prog.roots + "/" + ROOT_MAX;
    if (statStops) statStops.innerHTML = "<em>Checks</em> " + prog.sproutDone + "/" + prog.sproutTotal;
    var cap = document.getElementById("evPlantCaption");
    if (cap) cap.textContent = evPlantCaption(prog);

    var wrap = document.getElementById("evHomeRunway");
    if (wrap) {
      var path = evPath();
      var html = "";
      var nextOpen = null;
      for (var n = 0; n < path.length; n++) {
        if (!state.done[path[n].id] && evStepUnlocked(path[n].id)) {
          nextOpen = path[n].id;
          break;
        }
      }
      for (var i = 0; i < path.length; i++) {
        var s = path[i];
        var peekable = s.id === "ev-dates" || s.id === "ev-links";
        var locked = !evStepUnlocked(s.id) && !peekable;
        var done = !!state.done[s.id];
        var isNext = !done && !locked && s.id === nextOpen;
        var cls = "home-step" +
          (done ? " done" : "") +
          (locked ? " locked" : "") +
          (isNext ? " next" : "");
        var status = done ? "Done" : (locked ? "Locked · finish the step above first" :
          (!evStepUnlocked(s.id) && peekable ? "Peek anytime" : (isNext ? "Up next" : "Ready when you are")));
        var sub = s.sub;
        if (!done && (s.id === "ev-learn" || s.id === "ev-leads" || s.id === "ev-dream")) {
          var checks = checklistItems(s.id);
          var nDone = 0;
          for (var c = 0; c < checks.length; c++) if (checks[c].done && !checks[c].optional) nDone++;
          var nNeed = 0;
          for (var r = 0; r < checks.length; r++) if (!checks[r].optional) nNeed++;
          if (nNeed) sub = nDone + " of " + nNeed + " · " + s.sub;
        }
        html += '<button type="button" class="' + cls + '" data-goto="' + esc(s.goto || s.id) + '"' +
          (locked ? ' aria-disabled="true"' : "") + ">" +
          '<span class="home-step-num" aria-hidden="true">' + (done ? "✓" : String(i + 1)) + "</span>" +
          '<span class="home-step-main">' +
          '<span class="home-step-label">' + esc(s.label) + "</span>" +
          '<span class="home-step-sub">' + esc(sub) + "</span>" +
          '<span class="home-step-status">' + esc(status) + "</span>" +
          "</span></button>";
      }
      wrap.innerHTML = html;
    }

    paintEvergreenToday(evZoomCache.zoom);
    fetchEvergreenZoom(function (zoom) {
      if (!packEvergreen() || state.active !== "ev-home") return;
      paintEvergreenToday(zoom);
    });
  }

  function evergreenJoinUrl() {
    return "";
  }

  function evergreenLeadersJoinUrl() {
    var Cloud = window.FS.Cloud;
    if (!(Cloud && Cloud.joinUrl)) return "";
    var code = Cloud.evergreenLeaderCode && Cloud.evergreenLeaderCode();
    if (!code) return "";
    return Cloud.joinUrl(code);
  }

  function fillEvergreenLeadersJoinInputs() {
    if (!canSeeEvergreenHubTeam()) return;
    var Cloud = window.FS.Cloud;
    if (Cloud && Cloud.refreshAdminSecrets) {
      Cloud.refreshAdminSecrets().catch(function () {});
    }
  }

  function hardenCopiedUrl(url) {
    try {
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.hardenShareUrl) {
        var next = Cloud.hardenShareUrl(url);
        if (next) return next;
      }
    } catch (e) {}
    return String(url || "").trim();
  }

  function hubSignInUrl() {
    try {
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.isSignedIn && Cloud.isSignedIn() && Cloud.myInviteCode && Cloud.joinUrl) {
        var mine = Cloud.myInviteCode();
        if (mine) return hardenCopiedUrl(Cloud.joinUrl(mine));
      }
      if (Cloud && Cloud.hubRootUrl) return hardenCopiedUrl(Cloud.hubRootUrl());
      var path = String(window.location.pathname || "/");
      var last = path.split("/").pop() || "";
      if (/\.[a-z0-9]+$/i.test(last)) path = path.replace(/\/[^/]*$/, "/");
      else if (path && path.charAt(path.length - 1) !== "/") path += "/";
      return hardenCopiedUrl(window.location.origin + (path || "/"));
    } catch (e) {
      return "https://app.evergreenco.team/";
    }
  }

  function paintDeviceSignInLink() {
    var ready = document.getElementById("deviceSignInReady");
    var hint = document.getElementById("deviceSignInHint");
    var input = document.getElementById("deviceSignInInput");
    var signedIn = false;
    try {
      var Cloud = window.FS.Cloud;
      signedIn = !!(Cloud && Cloud.isSignedIn && Cloud.isSignedIn());
    } catch (e) {}
    if (input) input.value = hubSignInUrl();
    if (ready) ready.hidden = !signedIn;
    if (hint) hint.hidden = signedIn;
  }

  function evergreenPersonInviteUrl() {
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return "";
    var code = Cloud.myInviteCode && Cloud.myInviteCode();
    if (!code || !Cloud.joinUrl) return "";
    var url = Cloud.joinUrl(code);
    try {
      if (Cloud.groveCopiesPrettyLinks && Cloud.groveCopiesPrettyLinks()) {
        return hardenCopiedUrl(url);
      }
    } catch (eGrove) {}
    if (url && /thefreshgrove\.team/i.test(url)) {
      return "https://app.evergreenco.team/index.html?join=" +
        encodeURIComponent(code) + "&hub=evergreen#join=" + encodeURIComponent(code);
    }
    return url;
  }

  function evergreenLeaderInviteUrl() {
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return "";
    if (!(Cloud.isOrgAdmin && Cloud.isOrgAdmin())) return "";
    return evergreenPersonInviteUrl();
  }

  function evergreenHasSponsor() {
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user && Cloud.user();
    return !!(user && user.sponsor_id);
  }

  function evergreenResourcesInviteUrl() {
    return evergreenPersonInviteUrl();
  }

  function evergreenResourcesInviteCopy() {
    var personUrl = evergreenPersonInviteUrl();
    var packInvite = ((window.FS.EVERGREEN || {}).resources || {}).invite || {};
    if (!personUrl) {
      return {
        label: "Copy invite",
        tag: "APP INVITE",
        hint: String(packInvite.blurb || "When someone is ready to join our team.").trim()
      };
    }
    if (evergreenHasSponsor()) {
      return {
        label: "Copy my link to join",
        tag: "YOUR JOIN LINK",
        hint: "People who join with this sit under you — and on your leader’s tree."
      };
    }
    return {
      label: "Copy my link to join",
      tag: "YOUR JOIN LINK",
      hint: "People who join with this sit under you on the team."
    };
  }

  function evergreenLeadersInviteCopy() {
    return {
      label: "Copy the leaders link",
      tag: "EVERGREEN LEADERS",
      hint: "Only you two see this. Send it to someone you’re naming an Evergreen Leader — they join the hub with Leader access."
    };
  }

  function groveTeamInviteCopy() {
    return {
      label: "Copy my link to join",
      tag: "YOUR TEAM LINK",
      hint: "When they sign in with this link, they’re linked to your team. This is your team join link — not your lead page (that’s under Leads)."
    };
  }

  function groveTeamInviteUrl() {
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return "";
    var code = Cloud.myInviteCode && Cloud.myInviteCode();
    if (!code || !Cloud.joinUrl) return "";
    return hardenCopiedUrl(Cloud.joinUrl(code));
  }

  function leadsPageInviteCopy() {
    var custom = leadShareSource() === "site";
    return {
      label: "Copy my lead page",
      tag: "LEAD PAGE",
      hint: custom
        ? "This is your custom landing page. People who opt in there also land in this inbox. Not your team join link (that’s under Grove)."
        : "Curious people leave their name and how to reach them. Not your team join link (that’s under Grove)."
    };
  }

  function customLeadPageUrl() {
    var map = (window.FS.CONFIG && window.FS.CONFIG.customLeadPages) || {};
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    var slug = user && user.lead_slug ? String(user.lead_slug).trim().toLowerCase() : "";
    var url = slug && map[slug] ? String(map[slug]).trim() : "";
    return hardenCopiedUrl(url);
  }

  function leadShareSource() {
    if (!customLeadPageUrl()) return "app";
    return state.data.leadShareSource === "app" ? "app" : "site";
  }

  function paintLeadShareSource() {
    var wrap = document.getElementById("leadsShareSource");
    var appFields = document.getElementById("leadsAppPageSettings");
    var panel = document.getElementById("leadsPageSettings");
    var custom = customLeadPageUrl();
    var src = leadShareSource();
    if (wrap) wrap.hidden = !custom;
    if (appFields) appFields.hidden = !!(custom && src === "site");
    if (panel) panel.classList.toggle("is-custom-share", !!(custom && src === "site"));
    var btns = document.querySelectorAll("[data-lead-share-source]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("on", btns[i].getAttribute("data-lead-share-source") === src);
    }
  }

  function setLeadShareSource(src) {
    if (src !== "site" && src !== "app") return;
    if (src === "site" && !customLeadPageUrl()) return;
    state.data.leadShareSource = src;
    save();
    paintLeadShareSource();
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    var slug = user && user.lead_slug ? String(user.lead_slug).trim() : "";
    if (window.FS.BridgeUI && typeof window.FS.BridgeUI.syncLeadsShareUI === "function") {
      window.FS.BridgeUI.syncLeadsShareUI(slug);
    } else {
      updateLeadPageSettingUI();
      paintLeadsShareButton();
    }
  }

  function leadsPageInviteUrl() {
    if (leadShareSource() === "site") return customLeadPageUrl();
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    var slug = user && user.lead_slug ? String(user.lead_slug).trim() : "";
    if (slug && Cloud && Cloud.leadUrl) return hardenCopiedUrl(Cloud.leadUrl(slug));
    var el = document.getElementById("leadsShareInput");
    return hardenCopiedUrl((el && el.value ? String(el.value).trim() : "") || "");
  }

  function leadsPreviewHref(slug) {
    if (leadShareSource() === "site") return hardenCopiedUrl(customLeadPageUrl()) || "lead.html";
    var Cloud = window.FS.Cloud;
    if (slug && Cloud && Cloud.leadUrl) return hardenCopiedUrl(Cloud.leadUrl(slug));
    return slug
      ? ("lead.html?p=" + encodeURIComponent(slug) + "&from=app#p=" + encodeURIComponent(slug))
      : "lead.html";
  }

  function grovePageInviteCopy() {
    return {
      label: "Copy my business-info link",
      tag: "BUSINESS-INFO LINK",
      hint: "Share this when someone is curious about joining the Grove. Your name is already locked in — not your team join link."
    };
  }

  function grovePageInviteUrl() {
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    var slug = user && user.lead_slug ? String(user.lead_slug).trim() : "";
    if (slug && Cloud && Cloud.groveWithUrl) return hardenCopiedUrl(Cloud.groveWithUrl(slug));
    var el = document.getElementById("leadsGroveShareInput");
    return hardenCopiedUrl((el && el.value ? String(el.value).trim() : "") || "");
  }

  function quizMatchInviteCopy() {
    return {
      label: "Copy The Fresh Match",
      tag: "THE FRESH MATCH",
      hint: "Send this one-to-one or to your list. You’re giving them a way to figure out where they’d start — not asking them to buy something that isn’t here yet."
    };
  }

  function quizMatchInviteUrl() {
    var cfg = (window.FS.CONFIG && window.FS.CONFIG.groveQuizUrl) || "";
    var fromCfg = String(cfg || "").trim();
    if (fromCfg) return fromCfg;
    var el = document.getElementById("quizShareInput");
    return (el && el.value ? String(el.value).trim() : "") || "https://quiz.thefreshgrove.team/";
  }

  function paintQuizShareButton() {
    var wrap = document.getElementById("quizShareInvite");
    if (!wrap) return;
    var url = quizMatchInviteUrl();
    var input = document.getElementById("quizShareInput");
    var take = document.getElementById("quizTakeBtn");
    if (input) input.value = url;
    if (take) take.href = url;
    var copy = quizMatchInviteCopy();
    if (!wrap.dataset.painted) {
      wrap.dataset.painted = "1";
      wrap.innerHTML = evResShareButtonHtml("quizCopyLink", copy, "quizShareBloomGrad");
    } else {
      var label = wrap.querySelector(".ev-res-share-label");
      if (label) label.textContent = copy.label;
    }
  }

  function paintLeadsShareButton() {
    var wrap = document.getElementById("leadsShareInvite");
    if (!wrap) return;
    var copy = leadsPageInviteCopy();
    if (!wrap.dataset.painted) {
      wrap.dataset.painted = "1";
      wrap.innerHTML = evResShareButtonHtml("leadsCopyLink", copy, "leadsShareBloomGrad", false);
    } else {
      var label = wrap.querySelector(".ev-res-share-label");
      if (label) label.textContent = copy.label;
    }
  }

  function paintGrovePageShareButton() {
    var wrap = document.getElementById("leadsGroveShareInvite");
    if (!wrap) return;
    var copy = grovePageInviteCopy();
    if (!wrap.dataset.painted) {
      wrap.dataset.painted = "1";
      wrap.innerHTML = evResShareButtonHtml("leadsGroveCopyLink", copy, "leadsGroveBloomGrad", false);
    } else {
      var label = wrap.querySelector(".ev-res-share-label");
      if (label) label.textContent = copy.label;
    }
  }

  function paintGroveTeamInvite() {
    var wrap = document.getElementById("groveTeamInvite");
    if (!wrap || packEvergreen()) return;
    var copy = groveTeamInviteCopy();
    if (!wrap.dataset.painted) {
      wrap.dataset.painted = "1";
      wrap.innerHTML = evResShareButtonHtml("teamInviteOpen", copy, "groveTeamBloomGrad");
      var btn = document.getElementById("teamInviteOpen");
      if (btn) btn.setAttribute("data-team-tour", "invite");
    } else {
      var label = wrap.querySelector(".ev-res-share-label");
      if (label) label.textContent = copy.label;
    }
  }

  function evResShareBloomHtml(gradId) {
    var gid = String(gradId || "evResBloomGrad");
    return (
      '<span class="ev-res-share-bloom" aria-hidden="true">' +
        '<svg viewBox="0 0 48 48" width="56" height="56" overflow="visible">' +
          '<defs><radialGradient id="' + gid + '" cx="50%" cy="42%" r="62%">' +
            '<stop offset="0%" stop-color="#fff4c8"/>' +
            '<stop offset="45%" stop-color="#f0d06a"/>' +
            '<stop offset="100%" stop-color="#c9922e"/>' +
          "</radialGradient></defs>" +
          '<ellipse cx="24" cy="24" rx="5.2" ry="17" fill="url(#' + gid + ')" transform="rotate(0 24 24)" opacity=".96"/>' +
          '<ellipse cx="24" cy="24" rx="5.2" ry="17" fill="url(#' + gid + ')" transform="rotate(72 24 24)" opacity=".96"/>' +
          '<ellipse cx="24" cy="24" rx="5.2" ry="17" fill="url(#' + gid + ')" transform="rotate(144 24 24)" opacity=".96"/>' +
          '<ellipse cx="24" cy="24" rx="5.2" ry="17" fill="url(#' + gid + ')" transform="rotate(216 24 24)" opacity=".96"/>' +
          '<ellipse cx="24" cy="24" rx="5.2" ry="17" fill="url(#' + gid + ')" transform="rotate(288 24 24)" opacity=".96"/>' +
          '<circle cx="24" cy="24" r="4.4" fill="#5a4a37"/>' +
          '<circle cx="24" cy="24" r="2.5" fill="#e8c45a" opacity=".92"/>' +
          '<circle cx="24" cy="24" r="3.1" fill="#fff4c8" opacity=".5"/>' +
        "</svg>" +
      "</span>"
    );
  }

  function evResShareButtonHtml(id, copy, gradId, opensSheet) {
    var label = String((copy && copy.label) || "Copy invite").trim();
    var hint = String((copy && copy.hint) || "").trim();
    var popup = opensSheet === false ? "" : ' aria-haspopup="dialog"';
    return (
      '<button type="button" class="ev-res-share" id="' + esc(id) + '"' + popup + ' aria-label="' +
        esc(label + (hint ? ". " + hint : "")) + '">' +
        evResShareBloomHtml(gradId) +
        '<span class="ev-res-share-label">' + esc(label) + "</span>" +
      "</button>"
    );
  }

  function paintEvTeamLeadersShare() {
    var card = document.getElementById("evTeamLeadersJoinCard");
    if (!card || !canSeeEvergreenHubTeam()) return;
    if (!card.dataset.painted) {
      card.dataset.painted = "1";
      card.innerHTML = evResShareButtonHtml("evTeamCopyLeadersJoin", evergreenLeadersInviteCopy(), "evTeamBloomGrad");
      var btn = document.getElementById("evTeamCopyLeadersJoin");
      if (btn) {
        btn.addEventListener("click", function () {
          openEvResInviteSheet("leaders");
        });
      }
    }
  }

  function copyEvergreenJoin(labelEl, idleLabel, urlOverride, opts) {
    var url = urlOverride || "";
    try {
      var Cloud = window.FS.Cloud;
      var mine = Cloud && Cloud.myInviteCode && Cloud.myInviteCode();
      var generic = /(?:[?&#]join=evergreen(?:&|#|$)|\/first-seeds\/?(?:index\.html)?$)/i.test(url) &&
        !/\/j\/(?!evergreen(?:[/?#]|$))/i.test(url);
      if (generic && mine && Cloud.joinUrl && idleLabel && /join/i.test(idleLabel) && !/sign-in/i.test(idleLabel)) {
        url = Cloud.joinUrl(mine);
      }
      if (url && /[?&#]join=evergreen(?:&|#|$)/i.test(url) && idleLabel && /join/i.test(idleLabel) && !/sign-in/i.test(idleLabel)) {
        url = mine && Cloud.joinUrl ? Cloud.joinUrl(mine) : "";
      }
    } catch (eSwap) {}
    url = hardenCopiedUrl(url);
    if (!url) {
      if (window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast("Couldn’t load that invite link yet. Try again in a moment.", { tone: "bad" });
      }
      return;
    }
    var idle = idleLabel || "Copy invite link";
    var done = false;
    function copied() {
      if (done) return;
      done = true;
      if (labelEl) {
        labelEl.textContent = "Copied ✓";
        setTimeout(function () {
          if (labelEl) labelEl.textContent = idle;
        }, 1400);
      }
      var flash = opts && opts.toast;
      if (flash && window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast(flash, { tone: "good", ms: 2000 });
      }
    }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) copied();
      } catch (e) {}
    }
    /* Prefer the sync copy while we still have the tap gesture — Safari’s
       clipboard promise can sit there with no UI until permission settles. */
    fallback();
    if (!done && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(copied).catch(function () {});
    }
  }

  function closeEvResInviteSheet() {
    var sheet = document.getElementById("evResInviteSheet");
    if (sheet) sheet.hidden = true;
  }

  function inviteSheetPayload(kind) {
    if (kind === "leaders") {
      return { copy: evergreenLeadersInviteCopy(), url: evergreenLeadersJoinUrl() };
    }
    if (kind === "grove") {
      return { copy: groveTeamInviteCopy(), url: groveTeamInviteUrl() };
    }
    if (kind === "leads") {
      return { copy: leadsPageInviteCopy(), url: leadsPageInviteUrl() };
    }
    if (kind === "grove-page") {
      return { copy: grovePageInviteCopy(), url: grovePageInviteUrl() };
    }
    if (kind === "cabinet") {
      return { copy: cabinetInviteCopy(), url: cabinetInviteUrl() };
    }
    if (kind === "quiz") {
      return { copy: quizMatchInviteCopy(), url: quizMatchInviteUrl() };
    }
    return { copy: evergreenResourcesInviteCopy(), url: evergreenResourcesInviteUrl() };
  }

  var inviteSheetOpen = 0;

  function shareButtonLabelEl(btn) {
    if (!btn) return null;
    return (btn.querySelector && btn.querySelector(".ev-res-share-label")) || btn;
  }

  function copyInviteLinkNow(kind, btn) {
    var payload = inviteSheetPayload(kind);
    var labelEl = shareButtonLabelEl(btn);
    var idle = payload.copy && payload.copy.label;
    function finish(url) {
      if (!url) {
        inviteMissingToast(kind);
        return;
      }
      copyEvergreenJoin(labelEl, idle, url, { toast: "Copied to clipboard." });
    }
    if (payload.url) {
      finish(payload.url);
      return;
    }
    resolveInviteUrl(kind).then(finish);
  }

  function inviteMissingToast(kind) {
    if (!(window.FS.UI && window.FS.UI.toast)) return;
    var msg = "Couldn’t load that invite link yet. Try again in a moment.";
    if (kind === "leads") msg = "Your lead page link isn’t ready yet — try again in a moment.";
    if (kind === "grove-page") msg = "Your business-info link isn’t ready yet — try again in a moment.";
    if (kind === "cabinet") msg = "Your shelf link isn’t ready yet — try again in a moment.";
    if (kind === "grove") msg = "Sign in to get your team join link.";
    window.FS.UI.toast(msg, { tone: "bad" });
  }

  function resolveInviteUrl(kind) {
    var have = inviteSheetPayload(kind).url;
    if (have) return Promise.resolve(have);
    var Cloud = window.FS.Cloud;
    if ((kind === "leads" || kind === "grove-page" || kind === "cabinet") && Cloud && Cloud.ensureLeadSlug) {
      var preferred = "";
      try {
        var user = Cloud.user && Cloud.user();
        preferred = (user && user.display_name) || "";
      } catch (ePref) {}
      return Cloud.ensureLeadSlug(preferred).then(function (slug) {
        if (kind === "cabinet") {
          try { paintCabinetShareUI(); } catch (ePaint) {}
          return cabinetInviteUrl();
        }
        if (kind === "grove-page") {
          var groveNext = hardenCopiedUrl((Cloud.groveWithUrl && Cloud.groveWithUrl(slug)) || "");
          var groveShare = document.getElementById("leadsGroveShareInput");
          if (groveShare && groveNext) groveShare.value = groveNext;
          return groveNext;
        }
        var next = hardenCopiedUrl((Cloud.leadUrl && Cloud.leadUrl(slug)) || "");
        var share = document.getElementById("leadsShareInput");
        if (share && next) share.value = next;
        return next;
      }).catch(function () { return ""; });
    }
    if (kind === "leaders" && Cloud && Cloud.refreshAdminSecrets) {
      return Cloud.refreshAdminSecrets().then(function () {
        return evergreenLeadersJoinUrl();
      }).catch(function () { return evergreenLeadersJoinUrl(); });
    }
    return Promise.resolve(inviteSheetPayload(kind).url || "");
  }

  function fillInviteSheetUrl(urlEl, copyBtn, url) {
    if (urlEl) {
      urlEl.value = url || "";
      urlEl.placeholder = url ? "" : "Getting your link…";
    }
    if (copyBtn) copyBtn.disabled = !url;
  }

  function openEvResInviteSheet(kind) {
    wireEvResInviteSheet();
    var sheet = document.getElementById("evResInviteSheet");
    var title = document.getElementById("evResInviteTitle");
    var lead = document.getElementById("evResInviteLead");
    var urlEl = document.getElementById("evResInviteUrl");
    var copyBtn = document.getElementById("evResInviteCopy");
    var tag = document.getElementById("evResInviteTag");
    if (!sheet) return;
    if (kind === "leaders" && !canSeeEvergreenHubTeam()) return;
    var payload = inviteSheetPayload(kind);
    var copy = payload.copy;
    var url = payload.url;
    var ticket = ++inviteSheetOpen;
    sheet.dataset.kind = kind || "person";
    if (tag) tag.textContent = copy.tag;
    if (title) title.textContent = copy.label;
    if (lead) lead.textContent = copy.hint;
    if (copyBtn) copyBtn.textContent = copy.label;
    fillInviteSheetUrl(urlEl, copyBtn, url);
    sheet.hidden = false;
    if (window.FS.armDismissGuard) window.FS.armDismissGuard();
    if (window.FS.BridgeUI && window.FS.BridgeUI.closeAllSheets) {
      try { window.FS.BridgeUI.closeAllSheets("evResInvite"); } catch (eClose) {}
    }
    if (!url) {
      resolveInviteUrl(kind).then(function (next) {
        if (ticket !== inviteSheetOpen || sheet.hidden) return;
        fillInviteSheetUrl(urlEl, copyBtn, next);
        if (!next) inviteMissingToast(kind);
      });
    }
    var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (urlEl && url && !coarse) {
      requestAnimationFrame(function () {
        if (ticket !== inviteSheetOpen || sheet.hidden) return;
        try {
          urlEl.focus();
          urlEl.select();
        } catch (eSel) {}
      });
    }
  }

  function wireEvResInviteSheet() {
    var copyBtn = document.getElementById("evResInviteCopy");
    var urlEl = document.getElementById("evResInviteUrl");
    if (copyBtn && !copyBtn.dataset.bound) {
      copyBtn.dataset.bound = "1";
      copyBtn.addEventListener("click", function () {
        var sheet = document.getElementById("evResInviteSheet");
        var kind = (sheet && sheet.dataset.kind) || "person";
        var payload = inviteSheetPayload(kind);
        copyEvergreenJoin(copyBtn, payload.copy.label, (urlEl && urlEl.value) || payload.url || inviteSheetPayload(kind).url);
      });
    }
    if (urlEl && !urlEl.dataset.bound) {
      urlEl.dataset.bound = "1";
      urlEl.addEventListener("focus", function () {
        try { urlEl.select(); } catch (e) {}
      });
    }
    ["evResInviteClose", "evResInviteX", "evResInviteCancel"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.dataset.bound) return;
      el.dataset.bound = "1";
      el.addEventListener("click", function () { closeEvResInviteSheet(); });
    });
  }

  var evResRinganaOpen = false;

  function renderEvergreenResources() {
    var inviteRoot = document.getElementById("evResInvite");
    var root = document.getElementById("evResList");
    if (!root) return;
    var EV = window.FS.EVERGREEN || {};
    var res = EV.resources || {};
    var packLinks = res.links || [];
    var live = window.FS.Pack && window.FS.Pack.meta ? window.FS.Pack.meta().resources : null;
    var seen = {};
    var links = [];
    function addLinks(list) {
      (list || []).forEach(function (item) {
        if (!item) return;
        var url = String(item.url || "").trim();
        var soon = !!item.comingSoon;
        if (!url && !soon) return;
        var key = url || ("soon:" + String(item.title || "").trim().toLowerCase());
        if (seen[key]) return;
        seen[key] = true;
        links.push(item);
      });
    }
    addLinks((packLinks || []).filter(function (item) { return item && !item.comingSoon; }));
    if (CFG && CFG.freshCatalog) addLinks([CFG.freshCatalog]);
    addLinks((CFG && CFG.companyReports) || []);
    addLinks(live);
    addLinks((packLinks || []).filter(function (item) { return item && item.comingSoon; }));
    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    }
    var inviteCopy = evergreenResourcesInviteCopy();
    if (inviteRoot) {
      inviteRoot.innerHTML = evResShareButtonHtml("evResCopyInvite", inviteCopy, "evResBloomGrad");
    }
    function isRinganaSite(item) {
      return /^https?:\/\/(www\.)?ringana\.com\/?$/i.test(String((item && item.url) || "").trim());
    }
    function isRinganaReport(item) {
      var url = String((item && item.url) || "").trim();
      if (!/\.pdf(\?|#|$)/i.test(url)) return false;
      return /ringana/i.test(url) || /\/company\//i.test(url);
    }
    function isFreshCatalog(item) {
      var url = String((item && item.url) || "");
      var title = String((item && item.title) || "");
      return /fresh-catalog|ringana-fresh-book/i.test(url) || /fresh catalog/i.test(title);
    }
    function isRinganaGrouped(item) {
      if (isFreshCatalog(item)) return false;
      return isRinganaSite(item) || isRinganaReport(item);
    }
    function evResBubbleEmoji(item) {
      if (isRinganaSite(item)) return "🌿";
      var title = String((item && item.title) || "").toLowerCase();
      if (/impact/.test(title)) return "🌍";
      if (/transparency/.test(title)) return "🔎";
      if (/\.pdf(\?|#|$)/i.test(String((item && item.url) || ""))) return "📄";
      return "🔗";
    }
    function evResBubbleHtml(item) {
      var url = safeHref(item.url);
      var title = String(item.title || "Link").trim();
      var inner =
        '<span class="ev-res-bubble-emo" aria-hidden="true">' + evResBubbleEmoji(item) + "</span>" +
        '<span class="ev-res-bubble-title">' + esc(title) + "</span>";
      if (/\.pdf(\?|#|$)/i.test(url)) {
        return '<button type="button" class="ev-res-bubble" data-open-pdf="' + esc(url) + '" data-open-pdf-title="' + esc(title) + '">' + inner + "</button>";
      }
      return (
        '<a class="ev-res-bubble" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
          inner +
        "</a>"
      );
    }
    function evResCardHtml(item) {
      var url = safeHref(item.url);
      var soon = !!item.comingSoon || !url;
      var title = String(item.title || "Link").trim();
      var blurb = String(item.blurb || "").trim();
      var eyebrow = String(item.eyebrow || (soon ? "Coming soon" : (/\.pdf(\?|#|$)/i.test(url) ? "From Ringana" : "Open outside this app"))).trim();
      var cta = String(item.cta || (soon ? "Coming soon" : (/\.pdf(\?|#|$)/i.test(url) ? "Open report →" : "Open →"))).trim();
      var inner =
        '<span class="ev-res-card-eyebrow">' + esc(eyebrow) + "</span>" +
        '<span class="ev-res-card-title">' + esc(title) + "</span>" +
        (blurb ? '<span class="ev-res-card-sub">' + esc(blurb) + "</span>" : "") +
        '<span class="ev-res-card-go' + (soon ? " is-soon" : "") + '">' + esc(cta) + "</span>";
      if (soon) {
        return '<div class="ev-res-card is-soon" aria-disabled="true">' + inner + "</div>";
      }
      if (isFreshCatalog(item) && url) {
        return '<div class="ev-res-card ev-res-catalog">' +
          '<span class="ev-res-card-eyebrow">' + esc(eyebrow) + "</span>" +
          '<span class="ev-res-card-title">' + esc(title) + "</span>" +
          (blurb ? '<span class="ev-res-card-sub">' + esc(blurb) + "</span>" : "") +
          '<span class="ev-res-card-actions">' +
            '<button type="button" class="ev-res-card-go" data-open-pdf="' + esc(url) + '" data-open-pdf-title="' + esc(title) + '">' + esc(cta) + "</button>" +
            '<button type="button" class="ev-res-card-go ev-res-catalog-share" data-copy-catalog-link>Copy link to share</button>' +
          "</span>" +
        "</div>";
      }
      if (/\.pdf(\?|#|$)/i.test(url)) {
        return '<button type="button" class="ev-res-card" data-open-pdf="' + esc(url) + '" data-open-pdf-title="' + esc(title) + '">' + inner + "</button>";
      }
      return (
        '<a class="ev-res-card" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
          inner +
        "</a>"
      );
    }
    var ringanaItems = [];
    var restLinks = [];
    links.forEach(function (item) {
      if (isRinganaGrouped(item)) ringanaItems.push(item);
      else restLinks.push(item);
    });
    var ringanaSite = [];
    var ringanaReports = [];
    ringanaItems.forEach(function (item) {
      if (isRinganaSite(item)) ringanaSite.push(item);
      else ringanaReports.push(item);
    });
    ringanaItems = ringanaSite.concat(ringanaReports);
    var html = "";
    var group = res.ringanaGroup || {};
    var readyLinks = restLinks.filter(function (item) { return item && !item.comingSoon; });
    var soonLinks = restLinks.filter(function (item) { return item && item.comingSoon; });
    html += readyLinks.map(evResCardHtml).join("");
    if (ringanaItems.length) {
      html += '<div class="ev-res-fold' + (evResRinganaOpen ? " is-open" : "") + '">';
      html += '<button type="button" class="ev-res-card ev-res-fold-sum" aria-expanded="' +
        (evResRinganaOpen ? "true" : "false") + '">';
      html += '<span class="ev-res-card-eyebrow">' + esc(String(group.eyebrow || "Official").trim()) + "</span>";
      html += '<span class="ev-res-card-title">' + esc(String(group.title || "Ringana resources").trim()) + "</span>";
      html += '<span class="ev-res-card-sub">' + esc(String(group.blurb || "The official site, plus their published reports.").trim()) + "</span>";
      html += '<span class="ev-res-card-go ev-res-fold-open">' + esc(String(group.cta || "Open →").trim()) + "</span>";
      html += '<span class="ev-res-card-go ev-res-fold-close">Close</span>';
      html += "</button>";
      html += '<div class="ev-res-fold-body"' + (evResRinganaOpen ? "" : " hidden") + ">" +
        ringanaItems.map(evResBubbleHtml).join("") + "</div>";
      html += "</div>";
    }
    html += soonLinks.map(evResCardHtml).join("");
    root.innerHTML = html;
    if (!root.dataset.foldBound) {
      root.dataset.foldBound = "1";
      root.addEventListener("click", function (e) {
        var btn = e.target.closest(".ev-res-fold-sum");
        if (!btn || !root.contains(btn)) return;
        var fold = btn.closest(".ev-res-fold");
        if (!fold) return;
        var now = Date.now();
        if (fold._fsToggleAt && now - fold._fsToggleAt < 400) return;
        fold._fsToggleAt = now;
        evResRinganaOpen = !fold.classList.contains("is-open");
        fold.classList.toggle("is-open", evResRinganaOpen);
        btn.setAttribute("aria-expanded", evResRinganaOpen ? "true" : "false");
        var body = fold.querySelector(".ev-res-fold-body");
        if (body) body.hidden = !evResRinganaOpen;
      });
    }
    renderFaqList();
    wireFaqSearch();
    wireEvResInviteSheet();
    var copyBtn = document.getElementById("evResCopyInvite");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        openEvResInviteSheet();
      });
    }
    if (window.FS.BridgeUI && window.FS.BridgeUI.renderEvergreenLeadersRoster) {
      window.FS.BridgeUI.renderEvergreenLeadersRoster().catch(function () {});
    }
  }

  function paintCompanyReports() {
    var items = (CFG && CFG.companyReports) || [];
    var html = items.map(leaderCtaHtml).join("");
    var why = document.getElementById("whyReports");
    if (why) why.innerHTML = html;
  }

  function withLeaderPrivateLinks(copy) {
    copy = copy || {};
    var links = {};
    try {
      var Cloud = window.FS.Cloud;
      if (Cloud && Cloud.leaderPrivateLinks) links = Cloud.leaderPrivateLinks() || {};
    } catch (e) {}
    var wa = String(links.whatsapp || "").trim();
    var cards = (copy.cards || []).map(function (c) {
      if (!c) return c;
      var next = Object.assign({}, c);
      if (next.linkKey === "whatsapp") {
        next.url = wa;
        if (!wa) next.comingSoon = true;
      } else if (next.linkKey === "comp_pdf") {
        next.url = "leader-pdf";
      }
      return next;
    });
    return Object.assign({}, copy, { cards: cards });
  }

  function leaderCtaHtml(item) {
    if (!item) return "";
    var title = String(item.title || "").trim();
    if (!title) return "";
    var eyebrow = String(item.eyebrow || "").trim();
    var sub = String(item.sub || item.blurb || "").trim();
    var url = String(item.url || "").trim();
    var goto = String(item.goto || "").trim();
    if (url && url !== "leader-pdf" && !/^mailto:/i.test(url)) url = safeHref(url);
    else if (/^mailto:/i.test(url) && url.slice(7).split("?")[0].indexOf("@") < 1) url = "";
    var soon = !!item.comingSoon || (!url && !goto);
    var cta = String(item.cta || (soon ? "Coming soon" : "Open →")).trim();
    var inner =
      (eyebrow ? '<span class="prod-know-cta-eyebrow">' + esc(eyebrow) + "</span>" : "") +
      '<span class="prod-know-cta-title">' + esc(title) + "</span>" +
      (sub ? '<span class="prod-know-cta-sub">' + esc(sub) + "</span>" : "") +
      '<span class="prod-know-cta-go">' + esc(soon ? "Coming soon" : cta) + "</span>";
    if (soon) return '<div class="prod-know-cta" aria-disabled="true">' + inner + "</div>";
    if (goto) return '<button type="button" class="prod-know-cta" data-goto="' + esc(goto) + '">' + inner + "</button>";
    if (/^mailto:/i.test(url)) {
      return '<a class="prod-know-cta" href="' + esc(url) + '">' + inner + "</a>";
    }
    if (url === "leader-pdf" || /\.pdf(\?|#|$)/i.test(url)) {
      return '<button type="button" class="prod-know-cta" data-open-pdf="' + esc(url) + '" data-open-pdf-title="' + esc(title) + '">' + inner + "</button>";
    }
    return '<a class="prod-know-cta" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>";
  }

  function paintLeadersSub() {
    var el = document.getElementById("leadersSub");
    if (!el) return;
    var copy = leadersCopy();
    var lead = String(copy.sub || "").trim();
    var warn = String(copy.subWarn || "").trim();
    var html = "";
    if (lead) html += esc(lead);
    if (warn) html += (html ? " " : "") + '<strong class="leaders-sub-warn">' + esc(warn) + "</strong>";
    el.innerHTML = html;
    el.hidden = !html;
  }

  function leaderMailHref(email, subject, body) {
    var em = String(email || "").trim();
    if (!em) return "";
    var addr = encodeURIComponent(em).replace(/%40/g, "@");
    var href = "mailto:" + addr;
    var q = [];
    if (subject) q.push("subject=" + encodeURIComponent(String(subject)));
    if (body) q.push("body=" + encodeURIComponent(String(body)));
    if (q.length) href += "?" + q.join("&");
    return href;
  }

  function paintLeadersFeedback(copy) {
    var el = document.getElementById("leadersFeedback");
    if (!el) return;
    var fb = (copy && copy.feedback) || {};
    var signedIn = "";
    try {
      var u = window.FS.Cloud && window.FS.Cloud.user && window.FS.Cloud.user();
      signedIn = String((u && u.email) || "").trim();
    } catch (eMail) {}
    var body = String(fb.body || "").trim();
    if (signedIn) {
      body = (body ? body + "\n\n" : "") + "Signed in as " + signedIn;
    }
    var href = leaderMailHref(
      fb.email,
      fb.subject,
      body
    );
    if (!href) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    el.hidden = false;
    el.innerHTML = leaderCtaHtml({
      eyebrow: fb.eyebrow || "Feedback",
      title: fb.title || "Notice a glitch?",
      sub: fb.blurb || fb.sub || "",
      cta: fb.cta || "Send in feedback →",
      url: href
    });
  }

  var leaderLinksRefresh = 0;
  function refreshLeaderPrivateThen(fn) {
    var Cloud = window.FS.Cloud;
    if (!(Cloud && Cloud.refreshAdminSecrets)) return;
    var ticket = ++leaderLinksRefresh;
    var before = JSON.stringify(Cloud.leaderPrivateLinks && Cloud.leaderPrivateLinks());
    Cloud.refreshAdminSecrets().then(function () {
      if (ticket !== leaderLinksRefresh) return;
      var after = JSON.stringify(Cloud.leaderPrivateLinks && Cloud.leaderPrivateLinks());
      if (after !== before) fn();
    }).catch(function () {});
  }

  function leaderLinksMissing(copy) {
    var cards = (copy && copy.cards) || [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i] && cards[i].linkKey && !String(cards[i].url || "").trim()) return true;
    }
    return false;
  }

  function renderLeadersPanel() {
    var copy = withLeaderPrivateLinks(leadersCopy());
    var title = copy.title || leaderRoleNamePlural();
    setText("leadersTitle", title);
    paintLeadersSub();
    var intro = document.getElementById("leadersIntro");
    if (intro) {
      intro.hidden = true;
      intro.textContent = "";
    }
    var secRoot = document.getElementById("leadersSections");
    if (secRoot) {
      if (!state.data.leadersSecOpen || typeof state.data.leadersSecOpen !== "object") {
        state.data.leadersSecOpen = {};
      }
      var openMap = state.data.leadersSecOpen;
      var html = (copy.cards || []).map(leaderCtaHtml).join("");
      var sections = copy.sections || [];
      html += sections.map(function (sec, i) {
        var heading = String((sec && sec.title) || "").trim();
        var body = String((sec && sec.body) || "").trim();
        if (!heading && !body) return "";
        var key = heading || ("sec-" + i);
        var open = Object.prototype.hasOwnProperty.call(openMap, key) ? !!openMap[key] : i === 0;
        return (
          '<details class="know-acc" data-leaders-sec="' + esc(key) + '"' + (open ? " open" : "") + ">" +
            '<summary class="know-acc-sum">' + esc(heading) +
              ' <span class="know-acc-chev" aria-hidden="true"></span></summary>' +
            '<div class="know-acc-body"><p class="body-p">' + esc(body) + "</p></div>" +
          "</details>"
        );
      }).join("");
      secRoot.innerHTML = html;
      if (secRoot.dataset.boundSec !== "1") {
        secRoot.dataset.boundSec = "1";
        secRoot.addEventListener("toggle", function (e) {
          var t = e.target;
          if (!t || !t.hasAttribute || !t.hasAttribute("data-leaders-sec")) return;
          if (!state.data.leadersSecOpen || typeof state.data.leadersSecOpen !== "object") {
            state.data.leadersSecOpen = {};
          }
          state.data.leadersSecOpen[t.getAttribute("data-leaders-sec")] = !!t.open;
          save();
        }, true);
      }
    }
    var linkRoot = document.getElementById("leadersLinks");
    if (linkRoot) {
      var links = copy.links || [];
      linkRoot.innerHTML = links.map(function (item) {
        if (!item) return "";
        var url = safeHref(item.url);
        var soon = !!item.comingSoon || !url;
        var itemTitle = String(item.title || "Link").trim();
        var blurb = String(item.blurb || "").trim();
        var eyebrow = String(item.eyebrow || (soon ? "Coming soon" : "Open outside this app")).trim();
        var cta = String(item.cta || (soon ? "Coming soon" : "Open →")).trim();
        var inner =
          '<span class="ev-res-card-eyebrow">' + esc(eyebrow) + "</span>" +
          '<span class="ev-res-card-title">' + esc(itemTitle) + "</span>" +
          (blurb ? '<span class="ev-res-card-sub">' + esc(blurb) + "</span>" : "") +
          '<span class="ev-res-card-go' + (soon ? " is-soon" : "") + '">' + esc(cta) + "</span>";
        if (soon) return '<div class="ev-res-card is-soon" aria-disabled="true">' + inner + "</div>";
        return '<a class="ev-res-card" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>";
      }).join("");
    }
    paintLeadersFeedback(copy);
    renderFaqList(document.getElementById("panel-leaders"));
    if (leaderLinksMissing(copy)) refreshLeaderPrivateThen(renderLeadersPanel);
    warmLeaderPdf();
  }

  function renderLeadersCompPanel() {
    var copy = withLeaderPrivateLinks(leadersCompCopy());
    setText("leadersCompTitle", copy.title || "Compensation plan");
    setText("leadersCompSub", copy.sub || "");
    var root = document.getElementById("leadersCompCards");
    if (root) root.innerHTML = (copy.cards || []).map(leaderCtaHtml).join("");
    if (leaderLinksMissing(copy)) refreshLeaderPrivateThen(renderLeadersCompPanel);
    warmLeaderPdf();
  }

  function renderLeadersUnderstandPanel() {
    var copy = leadersCompCopy();
    setText("leadersUnderstandTitle", copy.understandTitle || "Understanding the compensation plan");
    var understandSub = document.getElementById("leadersUnderstandSub");
    if (understandSub) {
      var uSub = String(copy.understandSub || "").trim();
      understandSub.textContent = uSub;
      understandSub.hidden = !uSub;
    }
    var root = document.getElementById("leadersUnderstandRoot");
    if (root && window.FS.CompPlan && window.FS.CompPlan.render) {
      window.FS.CompPlan.render(root, { packLeaders: leaderRoleNamePlural() });
    }
  }

  var leaderPdfDoc = null;
  var leaderPdfGen = 0;
  var leaderPdfBytes = null;
  var leaderPdfSaveName = "document.pdf";
  var leaderPdfUrl = "";

  function pdfFileName(title, url) {
    var base = String(title || "").trim();
    if (!base) {
      try {
        var path = String(url || "").split("?")[0];
        base = decodeURIComponent(path.split("/").pop() || "");
      } catch (e) {}
    }
    base = base.replace(/\.pdf$/i, "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
    if (!base || /^leader-pdf$/i.test(base)) base = "Document";
    return base + ".pdf";
  }

  function setPdfSaveReady(ready) {
    var btn = document.getElementById("leaderPdfSave");
    if (!btn) return;
    btn.hidden = !ready;
    btn.disabled = !ready;
  }

  function holdPdfBytes(buf, title, url) {
    leaderPdfBytes = buf && buf.byteLength ? (buf.slice ? buf.slice(0) : buf) : null;
    leaderPdfSaveName = pdfFileName(title, url);
    setPdfSaveReady(!!leaderPdfBytes);
  }

  function fetchPdfBytes(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (res) {
      if (!res.ok) throw new Error("pdf fetch");
      return res.arrayBuffer();
    });
  }

  function saveLeaderPdf() {
    function toast(msg) {
      if (window.FS && FS.UI && FS.UI.toast) FS.UI.toast(msg);
    }
    function emit(buf) {
      var name = leaderPdfSaveName || "document.pdf";
      var blob = new Blob([buf], { type: "application/pdf" });
      function download() {
        var href = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = href;
        a.download = name;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
      }
      try {
        var file = new File([blob], name, { type: "application/pdf" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: name }).catch(function (err) {
            if (err && err.name === "AbortError") return;
            download();
          });
          return;
        }
      } catch (eShare) {}
      download();
    }
    if (leaderPdfBytes && leaderPdfBytes.byteLength) {
      emit(leaderPdfBytes);
      return;
    }
    if (leaderPdfUrl && leaderPdfUrl !== "leader-pdf") {
      fetchPdfBytes(leaderPdfUrl).then(function (buf) {
        holdPdfBytes(buf, leaderPdfSaveName.replace(/\.pdf$/i, ""), leaderPdfUrl);
        emit(buf);
      }).catch(function () {
        toast("Couldn’t save this. Try again in a moment.");
      });
      return;
    }
    toast("Still opening — try Save again in a moment.");
  }

  function wireLeaderPdfChrome() {
    if (wireLeaderPdfChrome.bound) return;
    wireLeaderPdfChrome.bound = true;
    var back = document.getElementById("leaderPdfBack");
    var save = document.getElementById("leaderPdfSave");
    var share = document.getElementById("leaderPdfShare");
    if (back) {
      back.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeLeaderPdf();
      });
    }
    if (save) {
      save.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        saveLeaderPdf();
      });
    }
    if (share) {
      share.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        copyFreshCatalogShareLink(share);
      });
    }
  }

  function closeLeaderPdf() {
    leaderPdfGen++;
    var overlay = document.getElementById("leaderPdfOverlay");
    if (overlay) {
      overlay.hidden = true;
      overlay.classList.remove("open");
    }
    document.body.classList.remove("leader-pdf-open");
    var pages = document.getElementById("leaderPdfPages");
    if (pages) pages.innerHTML = "";
    leaderPdfBytes = null;
    leaderPdfUrl = "";
    setPdfSaveReady(false);
    var shareBtn = document.getElementById("leaderPdfShare");
    if (shareBtn) shareBtn.hidden = true;
    if (leaderPdfDoc) {
      try { leaderPdfDoc.destroy(); } catch (e) {}
      leaderPdfDoc = null;
    }
  }

  function openLeaderPdf(url, title) {
    url = String(url || "").trim();
    if (!url) return;
    if (url !== "leader-pdf") {
      var safe = safeHref(url);
      if (!safe) return;
      url = safe;
    }
    var overlay = document.getElementById("leaderPdfOverlay");
    var pages = document.getElementById("leaderPdfPages");
    var titleEl = document.getElementById("leaderPdfTitle");
    if (!overlay || !pages) return;
    if (titleEl) titleEl.textContent = title || "Document";
    overlay.hidden = false;
    overlay.classList.add("open");
    document.body.classList.add("leader-pdf-open");
    pages.scrollTop = 0;
    pages.innerHTML = '<p class="leader-pdf-status">Opening…</p>';
    leaderPdfUrl = url;
    leaderPdfBytes = null;
    leaderPdfSaveName = pdfFileName(title, url);
    setPdfSaveReady(false);
    var shareBtn = document.getElementById("leaderPdfShare");
    if (shareBtn) shareBtn.hidden = !isFreshCatalogAsset(url);
    var isLeaderDoc = /assets\/leaders\//i.test(url) || url === "leader-pdf";
    var localHost = false;
    try {
      localHost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
    } catch (eHost) {}
    var Cloud = window.FS.Cloud;
    function stillOpen() {
      return document.body.classList.contains("leader-pdf-open");
    }
    function show(src) {
      if (!stillOpen()) return;
      renderLeaderPdf(src, pages);
    }
    if (url === "leader-pdf" && !(Cloud && Cloud.fetchLeaderPdf)) {
      pages.innerHTML = '<p class="leader-pdf-status">The compensation plan is not available yet. Ask the hub if you still need it.</p>';
      return;
    }
    if (isLeaderDoc && Cloud && Cloud.fetchLeaderPdf) {
      /* PDF bytes + renderer at the same time — waiting on one then the other
         is why the first open felt stuck on “Opening…” */
      Promise.all([loadPdfLib(), Cloud.fetchLeaderPdf()]).then(function (parts) {
        if (!stillOpen()) return;
        var buf = parts[1];
        if (buf && buf.byteLength) {
          holdPdfBytes(buf, title, url);
          show({ data: buf });
          return;
        }
        if (localHost && /assets\/leaders\//i.test(url)) {
          show(url);
          return;
        }
        pages.innerHTML = '<p class="leader-pdf-status">The compensation plan is not available yet. Ask the hub if you still need it.</p>';
      }).catch(function () {
        if (!stillOpen()) return;
        if (localHost && /assets\/leaders\//i.test(url)) {
          show(url);
          return;
        }
        pages.innerHTML = '<p class="leader-pdf-status">Couldn’t open the compensation plan. Try again in a moment.</p>';
      });
      return;
    }
    loadPdfLib().then(function () {
      if (!stillOpen()) return;
      show(url);
    }).catch(function () {
      if (stillOpen()) pages.innerHTML = '<p class="leader-pdf-status">Couldn’t open this here. Close and try again.</p>';
    });
    fetchPdfBytes(url).then(function (buf) {
      if (!stillOpen()) return;
      if (buf && buf.byteLength) holdPdfBytes(buf, title, url);
    }).catch(function () {});
  }

  /* 320KB of PDF renderer that only the plan viewer ever needs — fetched on the
     tap that opens it, not on every launch of the app. */
  var PDF_LIB_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  var PDF_WORKER_SRC = PDF_LIB_SRC.replace("pdf.min.js", "pdf.worker.min.js");
  var pdfLibLoad = null;

  function prefetchPdfWorker() {
    if (document.getElementById("pdfjsWorkerPrefetch")) return;
    try {
      var link = document.createElement("link");
      link.id = "pdfjsWorkerPrefetch";
      link.rel = "prefetch";
      link.as = "script";
      link.href = PDF_WORKER_SRC;
      document.head.appendChild(link);
    } catch (e) {}
  }

  function loadPdfLib() {
    prefetchPdfWorker();
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfLibLoad) return pdfLibLoad;
    pdfLibLoad = new Promise(function (resolve, reject) {
      var tag = document.createElement("script");
      tag.src = PDF_LIB_SRC;
      tag.async = true;
      tag.onload = function () {
        if (window.pdfjsLib) resolve(window.pdfjsLib);
        else reject(new Error("pdfjs missing"));
      };
      tag.onerror = function () {
        pdfLibLoad = null;
        reject(new Error("pdfjs failed"));
      };
      document.head.appendChild(tag);
    });
    return pdfLibLoad;
  }

  function warmLeaderPdf() {
    loadPdfLib().catch(function () {});
    var Cloud = window.FS.Cloud;
    if (Cloud && Cloud.fetchLeaderPdf) {
      Cloud.fetchLeaderPdf().catch(function () {});
    }
  }

  function renderLeaderPdf(src, host) {
    var gen = ++leaderPdfGen;
    function fail() {
      if (gen !== leaderPdfGen) return;
      host.innerHTML = '<p class="leader-pdf-status">Couldn’t open this here. Close and try again.</p>';
    }
    loadPdfLib().then(function () {
      if (gen !== leaderPdfGen) return;
      drawLeaderPdf(src, host, gen, fail);
    }).catch(fail);
  }

  function leaderPdfPageWidth(host) {
    var padX = 0;
    try {
      var style = window.getComputedStyle(host);
      padX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    } catch (e) {}
    return Math.max(280, Math.floor((host.clientWidth || 0) - padX) || 320);
  }

  function drawLeaderPdf(src, host, gen, fail) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
    var spec;
    if (typeof src === "string") {
      spec = {
        url: src,
        withCredentials: true,
        disableStream: false,
        disableRange: false
      };
    }
    else {
      var raw = src && src.data;
      spec = { data: raw && raw.slice ? raw.slice(0) : raw };
    }
    pdfjsLib.getDocument(spec).promise.then(function (pdf) {
      if (gen !== leaderPdfGen) {
        try { pdf.destroy(); } catch (e) {}
        return;
      }
      if (leaderPdfDoc) {
        try { leaderPdfDoc.destroy(); } catch (e2) {}
      }
      leaderPdfDoc = pdf;
      host.innerHTML = "";
      var pageNo = 1;
      var maxW = leaderPdfPageWidth(host);
      var dpr = window.devicePixelRatio || 1;
      if (dpr > 3) dpr = 3;
      function drawNext() {
        if (gen !== leaderPdfGen) return;
        if (pageNo > pdf.numPages) return;
        pdf.getPage(pageNo).then(function (page) {
          if (gen !== leaderPdfGen) return;
          var base = page.getViewport({ scale: 1 });
          var viewport = page.getViewport({ scale: maxW / base.width });
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d", { alpha: false });
          var cssW = Math.floor(viewport.width);
          var cssH = Math.floor(viewport.height);
          canvas.width = Math.floor(cssW * dpr);
          canvas.height = Math.floor(cssH * dpr);
          canvas.style.width = cssW + "px";
          canvas.style.height = cssH + "px";
          host.appendChild(canvas);
          pageNo += 1;
          page.render({
            canvasContext: ctx,
            viewport: viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null
          }).promise.then(function () {
            if (pageNo === 2) requestAnimationFrame(drawNext);
            else drawNext();
          }).catch(drawNext);
        }).catch(fail);
      }
      drawNext();
    }).catch(fail);
  }

  window.FS.applyPackChrome = function () {
    var before = document.body.classList.contains("pack-evergreen");
    var beforeLeader = document.body.classList.contains("is-org-leader");
    var beforeActive = state.active;
    applyPackChrome();
    var after = document.body.classList.contains("pack-evergreen");
    var afterLeader = document.body.classList.contains("is-org-leader");
    try { renderBottomNav(); } catch (e) {}
    /* Auth ticks used to remount every panel — that's the laggy bottom nav.
       Still repaint when the home id remapped (welcome ↔ ev-home) or the
       plant stays hidden on the other pack’s panel. */
    if (before !== after || beforeLeader !== afterLeader || beforeActive !== state.active) {
      try {
        rememberPanelScroll(state.active);
        renderPanels({ restoreScroll: true });
      } catch (e) {}
    }
    if (before !== after) {
      try { renderBrand(); } catch (eBrand) {}
      try {
        var gate = document.getElementById("onboarding");
        if (gate && gate.classList.contains("open")) renderOnboardingStep();
      } catch (eOb) {}
    }
    if (!beforeLeader && afterLeader) {
      try { maybeShowGroveLeaderWelcome(); } catch (e) {}
    }
  };

  /* ── brand / config into DOM ─────────────────────────── */
  function renderBrand() {
    applyPackChrome();
    var eb = document.getElementById("brandEyebrow");
    var tg = document.getElementById("brandTagline");
    if (!packEvergreen()) {
      if (eb) eb.textContent = CFG.teamName;
      if (tg) tg.textContent = CFG.tagline;
    }
    scheduleFitBrandEyebrow();
    var so = document.getElementById("signoff");
    if (so) so.textContent = CFG.signoff;
    renderDmStarters();
    var coldTag = document.getElementById("coldOutreachTag");
    var coldBody = document.getElementById("coldOutreachBody");
    if (CFG.coldOutreach) {
      if (coldTag) coldTag.textContent = CFG.coldOutreach.tag;
      if (coldBody) coldBody.innerHTML = CFG.coldOutreach.body;
    }
    var pc = CFG.pageOptions;
    var ct = document.getElementById("customTitle"), cd = document.getElementById("customDesc");
    var gt = document.getElementById("genericTitle"), gd = document.getElementById("genericDesc");
    if (ct) ct.textContent = pc.custom.title;
    if (cd) cd.textContent = pc.custom.desc;
    if (gt) gt.textContent = pc.generic.title;
    if (gd) gd.textContent = pc.generic.desc;

    /* onboarding static copy */
    var team = CFG.teamDisplayName || "The Fresh Grove";
    var ob = packOnboarding();
    function obCopy(text) {
      return (text || "").replace(/The Fresh Grove/g, team);
    }
    setText("obWelcomeEyebrow", ob.welcomeEyebrow);
    setText("obWelcomeBody", obCopy(ob.welcomeBody));
    setText("onboardTitle", ob.welcomeTitle);
    setText("onboardingNext", ob.welcomeCta || "Let's go");
    setText("obCircleEyebrow", ob.circleEyebrow);
    setText("obCircleTitle", ob.circleTitle);
    setText("obCircleBody", obCopy(ob.circleBody));
    setText("obCircleNote", obCopy(ob.circleNote));
    var circleBadge = document.getElementById("obCircleBadge");
    if (circleBadge) circleBadge.textContent = packEvergreen() ? "Evergreen Co" : "Founding circle";
    setText("onboardingCircleNext", ob.circleCta || "I'm in");
    setText("obNameEyebrow", ob.nameEyebrow);
    setText("obNameTitle", ob.nameTitle);
    setText("obNameHint", ob.nameHint);
    setText("obHypeLine", ob.hypeLine);
    setText("obAuthEyebrow", ob.authEyebrow);
    setText("obAuthTitle", ob.authTitle);
    setText("obAuthBody", obCopy(ob.authBody));
    setText("obAuthHint", obCopy(ob.authHint));
    var authCta = document.getElementById("onboardingSignInBtn");
    if (authCta && ob.authCta) authCta.textContent = ob.authCta;
    var authCreate = document.getElementById("onboardingCreateBtn");
    if (authCreate && ob.authCreate) authCreate.textContent = ob.authCreate;
    setText("obInstallEyebrow", ob.installEyebrow);
    setText("obInstallTitle", ob.installTitle);
    setText("obInstallLead", ob.installLead);
    setText("obInstallLeave", ob.installLeave);
    var installNext = document.getElementById("onboardingInstallNext");
    if (installNext && ob.installCta) installNext.textContent = ob.installCta;
    var installSkip = document.getElementById("onboardingInstallSkip");
    if (installSkip && ob.installSkip) installSkip.textContent = ob.installSkip;
    var installConfirmLabel = document.querySelector("#onboardInstallConfirmWrap span");
    if (installConfirmLabel && ob.installConfirm) installConfirmLabel.textContent = ob.installConfirm;
    setText("obModeEyebrow", ob.modeEyebrow);
    setText("obModeTitle", ob.modeTitle);
    setText("obModeLead", ob.modeLead);
    setText("onboardingNameNext", ob.nameCta || "Continue");
    setText("obNotifyEyebrow", ob.notifyEyebrow);
    setText("obNotifyTitle", ob.notifyTitle);
    setText("obNotifyBody", ob.notifyBody);
    setText("obNotifyNote", ob.notifyNote);

    var nameInput = document.getElementById("partnerNameInput");
    if (nameInput && ob.namePlaceholder) nameInput.placeholder = ob.namePlaceholder;
    var lastInput = document.getElementById("partnerLastNameInput");
    if (lastInput && ob.lastNamePlaceholder) lastInput.placeholder = ob.lastNamePlaceholder;

    if (MODES.starter) {
      setText("modePickStarterTag", MODES.starter.tag || "Essentials");
      setText("modePickStarterLabel", MODES.starter.label);
      setText("modePickStarterDesc", MODES.starter.desc);
    }
    if (MODES.full) {
      setText("modePickFullTag", MODES.full.tag || "Everything");
      setText("modePickFullLabel", MODES.full.label);
      setText("modePickFullDesc", MODES.full.desc);
    }

    renderTermLibrary();
  }

  function renderTermLibrary() {
    var list = document.getElementById("hubTermList");
    if (!list) return;
    var evTerms = ((window.FS.EVERGREEN || {}).terms) || [];
    var terms = (packEvergreen() && evTerms.length) ? evTerms : (CFG.terms || []);
    var html = "";
    for (var i = 0; i < terms.length; i++) {
      html += '<div class="term-item">' +
        '<span class="term-name">' + esc(terms[i].term) + "</span>" +
        '<span class="term-def">' + esc(terms[i].def) + "</span>" +
        "</div>";
    }
    list.innerHTML = html;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  /* ── greetings / personalized copy ───────────────────── */
  function renderGreetings() {
    var name = firstName();

    var wh = document.getElementById("welcomeHeadline");
    if (wh) {
      wh.innerHTML = name
        ? ("Hey " + esc(name) + ".<br>Watch it grow.")
        : "Watch it grow.";
    }

    var rh = document.getElementById("rootsHeadline");
    if (rh && !packEvergreen()) rh.textContent = name ? (name + " — plant your roots") : "Plant Your Roots";

    /* section numbers follow Soft start / All in path (Content uses a word eyebrow, not a step number) */
    var shareNum = document.getElementById("shareNum");
    var groundNum = document.getElementById("groundNum");
    var groveNum = document.getElementById("groveNum");
    var plantNum = document.getElementById("plantNum");
    if (shareNum) shareNum.textContent = "02";
    if (groundNum) groundNum.textContent = "03";
    if (groveNum) groveNum.textContent = "04";
    if (plantNum) plantNum.textContent = "05";

    renderFinishCopy();
    renderTodayCard();
  }

  /* ── "What should I do today?" — one next move, no overwhelm ─ */
  function sectionStarted(id) {
    if (id === "roots") return filledText("why") || filledText("moment") || filledText("said_yes");
    if (id === "share") return favoriteCount() > 0 || talkOpened();
    if (id === "grove") {
      return customerNames().length > 0 || groveNames().length > 0
        || grovePicks("customer_first").length > 0 || grovePicks("warm_first").length > 0
        || Tree.counts(Tree.ensure(state)).total > 0;
    }
    if (id === "ground") return filledText("page_story");
    if (id === "plant") return anySeedDraft();
    if (id === "tend") {
      var marked = window.FS.Calendar && window.FS.Calendar.countMarked
        ? window.FS.Calendar.countMarked(state.data.calendar || {})
        : 0;
      return marked > 0;
    }
    return false;
  }

  function calendarWeekPulse() {
    if (!window.FS.Calendar) return { posted: 0, drafted: 0, total: 0, restToday: false };
    var cal = state.data.calendar || {};
    var plan = window.FS.Calendar.plan(CFG, cal, state.data, {
      cadence: state.data.calendarCadence === true,
      weekStart: calendarWeekStart()
    });
    var slice = window.FS.Calendar.weekSlice(plan, new Date(), state.data.calendarWeekOffset || 0, calendarWeekStart());
    var week = slice.days || [];
    var stats = window.FS.Calendar.weekStats(week);
    var today = window.FS.Calendar.ymd(new Date());
    var todaySlot = null;
    for (var i = 0; i < week.length; i++) if (week[i].date === today) todaySlot = week[i];
    var restToday = !!(todaySlot && todaySlot.suggested && todaySlot.suggested.reactive && !(todaySlot.items || []).length);
    return {
      posted: stats.posted,
      drafted: stats.drafted,
      total: stats.total,
      restToday: restToday,
      todayStatus: "todo"
    };
  }

  function pickTodayMove() {
    var name = firstName();
    var hey = name ? name : "friend";
    var secs = visibleSections();
    var tips = {
      roots: {
        title: "Plant one root.",
        body: "Ten quiet minutes. Answer the three Roots questions in your own words — messy is fine.",
        cta: sectionStarted("roots") ? "Finish your Roots →" : "Start with Roots →",
        why: "Everything you share later grows from this."
      },
      share: {
        title: "Pick your first few.",
        body: "Heart 2–3 products you’re looking forward to, then open Talking fresh once — so your story has real product knowledge behind it.",
        cta: sectionStarted("share") ? "Keep picking →" : "Open Pick Your First Few →",
        why: "A shortlist + one conversation guide beats a catalog quiz."
      },
      ground: {
        title: "Claim a patch of ground.",
        body: leadPageReady()
          ? "Draft one warm opening line, then preview the page you’ll share."
          : "Sign in and we’ll make your share link — then draft one warm opening line.",
        cta: sectionStarted("ground") ? "Finish your page steps →" : "Claim your ground →",
        why: "Curious people need one place to land."
      },
      grove: {
        title: "Map a few names.",
        body: isFull()
          ? "List people who'd love the products, then tap up to 5 first chats — they land on your Calendar. Sketch a dream tree if you're building — tap 🌱 / 🌳 when they join."
          : "List people who'd love the products, then tap up to 5 first chats so you know who to reach out to first. Sketch a dream tree if you're building.",
        cta: sectionStarted("grove") ? "Keep mapping your grove →" : "Open your grove →",
        why: "Affiliate-style or builder — customers first either way."
      },
      plant: {
        title: "Draft in Post Studio.",
        body: "Open a post type, learn it, and draft inside it — a curiosity post, a helpful share, and a soft invite. No posting required yet.",
        cta: sectionStarted("plant") ? "Keep drafting →" : "Open Post Studio →",
        why: "Launch feels calmer when the words are already yours."
      },
      tend: {
        title: "Tend your content.",
        body: "Open week or month view. Edit a draft, grab a photo, or mark three days done. Nothing auto-posts.",
        cta: sectionStarted("tend") ? "Keep your calendar warm →" : "Open Calendar →",
        why: "A garden grows from showing up, not one big planting day."
      }
    };

    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      if (state.done[s.id] && canComplete(s.id)) continue;
      if (!isModuleUnlocked(s.id)) continue;
      var tip = tips[s.id] || {
        title: "Keep going.",
        body: "Your next module is waiting — one small step.",
        cta: "Continue →",
        why: ""
      };
      return {
        title: tip.title,
        body: tip.body,
        why: tip.why,
        primary: { label: tip.cta, goto: s.id },
        secondary: state.done.roots
          ? (isFull()
            ? { label: "Or peek at Calendar", goto: "calendar" }
            : { label: "Or open Learn", goto: "know" })
          : null
      };
    }

    if (!sproutPathComplete()) {
      var nextOpen = currentRunwayPanel();
      var fallback = tips[nextOpen] || {
        title: "Keep going.",
        body: "Your next Sprout step is still open — one small thing.",
        cta: "Continue →",
        why: ""
      };
      return {
        title: fallback.title,
        body: fallback.body,
        why: fallback.why,
        primary: { label: fallback.cta, goto: nextOpen },
        secondary: { label: "Or peek at Calendar", goto: "calendar" }
      };
    }

    /* Soft start runway complete — celebrate, then point into the rest of the app */
    if (isStarter()) {
      return {
        title: "Solid foundation.",
        body: "Amazing job growing a real base for your business. Soft start is done — lean on Learn, Leads, and Calendar for team dates. Unlock All in anytime for Post Studio and Grow Your Grove.",
        why: "Calm prep beats a scramble, " + hey + ".",
        primary: { label: "Unlock All in →", action: "fullMode" },
        secondary: { label: "Open Learn →", goto: "know" }
      };
    }

    var pulse = calendarWeekPulse();
    if (pulse.restToday && pulse.todayStatus === "todo") {
      return {
        title: "Rest counts.",
        body: "Today's a real-life / reply day on your calendar. Answer a comment, text one grove person, or just live your life.",
        why: "Consistency includes rest, " + hey + ".",
        primary: { label: "See today's calendar →", goto: "calendar" },
        secondary: { label: "Back to Sprout", goto: "welcome" }
      };
    }
    if (pulse.posted < 3 && pulse.total > 0) {
      return {
        title: "Share one true thing.",
        body: pulse.posted === 0
          ? "Your Sprout path is done — nice. Grab one gentle idea from Calendar and mark it Done when you share (or Skipped if today isn't the day)."
          : ("You've marked " + pulse.posted + " done this week. One more true post keeps the habit warm."),
        why: "No auto-post. Just a nudge so you don't go silent.",
        primary: { label: "Open Calendar →", goto: "calendar" },
        secondary: { label: "Notify my leader", goto: "done" }
      };
    }

    var Cloud = window.FS.Cloud;
    if (Cloud && Cloud.isSignedIn && Cloud.isSignedIn()) {
      return {
        title: "Solid foundation.",
        body: "Amazing job. Your runway is complete — keep Calendar warm with your favorite products, check Grow Your Grove, and lean on Learn when someone asks.",
        why: "Showing up is the whole game, " + hey + ".",
        primary: { label: "Open Calendar →", goto: "calendar" },
        secondary: { label: "Grove →", goto: "leader" }
      };
    }

    return {
      title: "Solid foundation.",
      body: "Amazing job growing a real base for your business. Keep Calendar warm, lean on Learn, and sign in so your progress travels with you.",
      why: "October will feel different because of this.",
      primary: { label: "Open Calendar →", goto: "calendar" },
      secondary: { label: "Sign in / Account", action: "auth" }
    };
  }

  function renderTodayCard() {
    var card = document.getElementById("todayCard");
    if (!card) return;
    var move = pickTodayMove();
    var title = document.getElementById("todayTitle");
    var body = document.getElementById("todayBody");
    var why = document.getElementById("todayWhy");
    var actions = document.getElementById("todayActions");
    if (title) title.textContent = move.title;
    if (body) body.textContent = move.body;
    if (why) why.textContent = move.why || "";
    if (!actions) return;
    var html = "";
    if (move.primary) {
      if (move.primary.action === "auth") {
        html += '<button type="button" class="btn" id="todayAuthBtn">' + esc(move.primary.label) + "</button>";
      } else if (move.primary.action === "fullMode") {
        html += '<button type="button" class="btn" id="todayUnlockFull">' + esc(move.primary.label) + "</button>";
      } else {
        html += '<button type="button" class="btn" data-goto="' + esc(move.primary.goto) + '" id="todayPrimaryBtn">' +
          esc(move.primary.label) + "</button>";
      }
    }
    if (move.secondary) {
      if (move.secondary.action === "auth") {
        html += '<button type="button" class="btn-ghost" id="todayAuthBtn">' + esc(move.secondary.label) + "</button>";
      } else if (move.secondary.action === "fullMode") {
        html += '<button type="button" class="btn-ghost" id="todayUnlockFull">' + esc(move.secondary.label) + "</button>";
      } else {
        html += '<button type="button" class="btn-ghost" data-goto="' + esc(move.secondary.goto) + '">' +
          esc(move.secondary.label) + "</button>";
      }
    }
    actions.innerHTML = html;
  }

  function renderFinishCopy() {
    var name = firstName();
    var eyebrow = document.getElementById("finishEyebrow");
    var headline = document.getElementById("finishHeadline");
    var body = document.getElementById("finishBody");
    var levelUp = document.getElementById("levelUpBtn");
    var learnBtn = document.getElementById("finishLearnBtn");
    var contentBtn = document.getElementById("finishContentBtn");
    var nextCard = document.getElementById("finishNext");
    var nextBody = document.getElementById("finishNextBody");

    if (eyebrow) eyebrow.textContent = "SOLID FOUNDATION";
    if (headline) {
      headline.textContent = name
        ? ("You grew a solid foundation, " + name + ".")
        : "You grew a solid foundation.";
    }

    if (isStarter()) {
      if (body) {
        body.innerHTML = "Amazing job. Soft start is complete — your story, favorite products, a page to share, and people to talk to. That’s a real base for your business. Now lean on the other resources in First Seeds.";
      }
      if (nextBody) {
        nextBody.textContent = "Open Learn for clear facts and Talking fresh. Use Leads for your Ideal Lead List and share link. Team dates stay on Calendar. Unlock All in anytime for Post Studio and Grow Your Grove.";
      }
      if (levelUp) levelUp.hidden = false;
      if (contentBtn) contentBtn.hidden = true;
    } else {
      if (body) {
        body.innerHTML = "Amazing job. Your full Sprout path is complete — story, favorite products, page, grove, dream team sketch, Post Studio drafts, and a Calendar habit. That’s a real base for your business. Now lean on the rest of First Seeds and keep showing up.";
      }
      if (nextBody) {
        nextBody.textContent = "Keep Calendar warm — Your story and favorite products live there. Check Grove for your live team and Dream tree. Use Leads for your Ideal Lead List and share link. Lean on Learn whenever someone asks a hard question.";
      }
      if (levelUp) levelUp.hidden = true;
      if (contentBtn) contentBtn.hidden = false;
    }
    if (nextCard) nextCard.hidden = false;
    if (learnBtn) learnBtn.hidden = false;
    renderFinishShortlist();
  }

  /* ── mode UI ─────────────────────────────────────────── */
  function applyModeClass() {
    document.body.classList.toggle("mode-starter", isStarter());
    /* Empty hubMode is treated as All in everywhere else — CSS must match or
       Calendar / Grove stay hidden behind body:not(.mode-full) .full-only. */
    document.body.classList.toggle("mode-full", isFull() || !modeChosen());
  }

  function updateModeUI() {
    applyModeClass();
    var starterBtn = document.getElementById("modeStarter");
    var fullBtn = document.getElementById("modeFull");
    if (starterBtn) {
      starterBtn.textContent = (MODES.starter && MODES.starter.label) || "Soft start";
      starterBtn.classList.toggle("on", isStarter());
    }
    if (fullBtn) {
      fullBtn.textContent = (MODES.full && MODES.full.label) || "All in";
      fullBtn.classList.toggle("on", isFull());
    }
    var hint = document.getElementById("hubModeHint");
    if (hint) {
      if (isStarter()) {
        hint.textContent = canSeeShelfCustomers()
          ? "Soft start keeps the path light: story, products that feel like you, page, grove, finish. Your join link is in Sharing below. Team dates stay on Calendar. Grow Your Grove (the tree next to Messages) unlocks on All in. Clients is already on the bottom nav."
          : "Soft start keeps the path light: story, products that feel like you, page, grove, finish. Your join link is in Sharing below. Team dates stay on Calendar. Grove (your live team) unlocks on All in.";
      } else if (isFull()) {
        hint.textContent = canSeeShelfCustomers()
          ? "Every runway section unlocked, plus Calendar and Clients in the bottom nav. Grow Your Grove is the tree next to Messages. Switch to Soft start for a simpler view — your progress stays."
          : "Every runway section unlocked, plus Calendar and Grove in the bottom nav. Switch to Soft start for a simpler view — your progress stays.";
      } else hint.textContent = "";
    }
    var prefsSub = document.getElementById("settingsPrefsSub");
    if (prefsSub && !packEvergreen()) {
      prefsSub.textContent = isStarter() ? "Plant growth" : "Calendar, nudges, and plant growth";
    }
    var notifySub = document.getElementById("settingsNotifySub");
    if (notifySub && !packEvergreen()) {
      notifySub.textContent = canSeeShelfCustomers()
        ? (isStarter() ? "Joins, cheers, leads, clients, and gatherings" : "Joins, cheers, leads, clients, and more")
        : (isStarter() ? "Joins, cheers, leads, and gatherings" : "Joins, cheers, leads, and more");
    }
    updateLeadPageSettingUI();
    renderGreetings();
  }

  function settingsLeadShareUrl() {
    return leadsPageInviteUrl();
  }

  function updateLeadPageSettingUI() {
    paintLeadShareSource();
    var shareSub = document.getElementById("settingsShareSub");
    if (shareSub) {
      shareSub.textContent = canSeeShelfCustomers()
        ? "Join link, lead pages, shelf link, and shop link"
        : "Join link and lead pages";
    }
    var wrap = document.getElementById("settingsLeadShareWrap");
    var input = document.getElementById("settingsLeadShareInput");
    var hint = document.getElementById("settingsLeadShareHint");
    if (packEvergreen()) {
      if (input) input.value = "";
      if (wrap) wrap.hidden = true;
      if (hint) {
        hint.hidden = true;
        hint.textContent = "";
      }
      var evGroveWrap = document.getElementById("settingsGroveShareWrap");
      var evGroveIn = document.getElementById("settingsGroveShareInput");
      if (evGroveIn) evGroveIn.value = "";
      if (evGroveWrap) evGroveWrap.hidden = true;
      paintCabinetShareUI();
      return;
    }
    var url = settingsLeadShareUrl();
    if (input && url) input.value = url;
    if (wrap) wrap.hidden = !url;
    if (hint) {
      if (url) {
        hint.hidden = true;
        hint.textContent = "";
      } else if (!leadSignedIn()) {
        hint.hidden = false;
        hint.textContent = "Sign in on Leads to get the share link for your page.";
      } else {
        hint.hidden = false;
        hint.textContent = "Open Leads to claim your share link, then it will show up here.";
      }
    }
    var groveWrap = document.getElementById("settingsGroveShareWrap");
    var groveIn = document.getElementById("settingsGroveShareInput");
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    var slug = user && user.lead_slug ? String(user.lead_slug).trim() : "";
    var groveUrl = (slug && Cloud && Cloud.groveWithUrl) ? hardenCopiedUrl(Cloud.groveWithUrl(slug)) : "";
    if (groveIn && groveUrl) groveIn.value = groveUrl;
    if (groveWrap) groveWrap.hidden = !groveUrl;
    var igIn = document.getElementById("settingsInstagram");
    if (igIn && document.activeElement !== igIn) {
      igIn.value = (user && user.instagram) ? String(user.instagram).replace(/^@/, "") : "";
    }
    paintCabinetShareUI();
  }

  function cabinetInviteCopy() {
    return {
      label: "Copy your shelf link",
      tag: "SHELF LINK",
      hint: "One link. They open it and land on their shelf with you."
    };
  }

  function paintCabinetShareUI() {
    var allow = canSeeShelfCustomers();
    var url = cabinetInviteUrl();
    var block = document.getElementById("settingsCabinetShareBlock");
    if (block) block.hidden = !allow;
    var shopBlock = document.getElementById("settingsCabinetShopBlock");
    if (shopBlock) shopBlock.hidden = !allow;
    var settingsIn = document.getElementById("settingsCabinetShareInput");
    if (settingsIn) settingsIn.value = allow ? url : "";
    if (allow && window.FS.CabinetDesk && typeof window.FS.CabinetDesk.paintShop === "function") {
      window.FS.CabinetDesk.paintShop();
    }
    var wrap = document.getElementById("customersCabinetInvite");
    if (wrap) {
      wrap.hidden = !allow;
      if (allow && !wrap.dataset.painted) {
        wrap.dataset.painted = "1";
        wrap.innerHTML = evResShareButtonHtml("customersCopyLink", cabinetInviteCopy(), "cabinetBloomGrad", false);
      } else if (allow) {
        var label = wrap.querySelector(".ev-res-share-label");
        if (label) label.textContent = cabinetInviteCopy().label;
      }
      var uniqueOn = allow && window.FS.uniqueClientDoorsOn && window.FS.uniqueClientDoorsOn();
      var uniqueBtns = wrap.querySelectorAll("[data-cabinet-door-open], .cabinet-unique-link");
      var u;
      if (!uniqueOn) {
        for (u = 0; u < uniqueBtns.length; u++) uniqueBtns[u].remove();
      } else if (!uniqueBtns.length) {
        wrap.insertAdjacentHTML("beforeend", '<button type="button" class="cabinet-unique-link" data-cabinet-door-open>Send a unique link</button>');
      }
    }
    var shareSub = document.getElementById("settingsShareSub");
    if (shareSub && !packEvergreen()) {
      shareSub.textContent = allow
        ? "Join link, lead pages, shelf link, and shop link"
        : "Join link and lead pages";
    }
    wireCabinetCopyBtn("settingsCopyCabinetShare", "Copy your shelf link");
  }

  function wireCabinetCopyBtn(id, idle) {
    var btn = document.getElementById(id);
    if (!btn || btn.dataset.boundCabinet === "1") return;
    btn.dataset.boundCabinet = "1";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!canSeeShelfCustomers()) return;
      copyInviteLinkNow("cabinet", btn);
    });
  }

  function setPageChoice(value, opts) {
    opts = opts || {};
    if (value !== "generic" && value !== "custom") return;
    state.data.page_choice = value;
    if (value === "custom" && state.active === "leads") state.active = "ground";
    if (value === "generic" && opts.openLeads) state.active = "leads";
    if (value === "generic") syncPageStoryToLeadBlurb();
    save();
    updateLeadPageSettingUI();
    renderChoices();
    liveRefresh({ silent: true });
    renderNav();
    renderBottomNav();
    renderPanels();
  }

  function setHubMode(mode, opts) {
    opts = opts || {};
    if (mode !== "starter" && mode !== "full") return;
    var prev = state.settings.hubMode;
    state.settings.hubMode = mode;
    /* if currently on a section hidden in new mode, bounce to welcome */
    if (state.active === "leader" && mode === "starter") {
      state.active = "welcome";
    } else if (mode === "starter" && isContentSurface(state.active)) {
      state.active = "welcome";
    } else if (state.active === "done" && !sproutPathComplete()) {
      state.active = "welcome";
    } else if (state.active !== "welcome" && state.active !== "done" && !sectionVisible(state.active)) {
      state.active = "welcome";
    }
    save();
    updateModeUI();
    renderNav();
    renderPanels();
    /* Mode change expands/shrinks the checklist — force a clean plant redraw */
    renderPlant({ silent: true, force: true });
    refreshButtons();
    liveRefresh({ silent: true });
    if (opts.silent || prev === mode) return;
  }

  /* ── post studio ─────────────────────────────────────── */
  function bindSeedDraftFields(root) {
    if (!root) return;
    var fields = root.querySelectorAll("[data-key]");
    for (var i = 0; i < fields.length; i++) {
      (function (f) {
        var k = f.getAttribute("data-key");
        if (state.data[k]) f.value = state.data[k];
        runClaimCheck(k);
        f.addEventListener("input", function () {
          state.data[k] = f.value;
          persistLocal();
          runClaimCheck(k);
          var beforeSprout = lastSprout;
          liveRefresh({ silent: true });
          if (checklistProgress().sproutDone > beforeSprout) {
            lastSprout = beforeSprout;
            renderPlant({ deferCelebrate: true });
          } else if (pendingGrowth) {
            clearTimeout(growthIdleTimer);
            growthIdleTimer = null;
          }
          clearTimeout(flashTimers._seedDraft);
          flashTimers._seedDraft = setTimeout(function () {
            save();
            flash("plant");
            if (!typingInField()) {
              renderModuleChecklists();
              refreshButtons();
            }
          }, 500);
        });
        f.addEventListener("blur", function () {
          clearTimeout(flashTimers._seedDraft);
          flushSave();
          if (pendingGrowth) scheduleGrowthFlush();
        });
      })(fields[i]);
    }
  }

  function renderSeedTypes() {
    var wrap = document.getElementById("seedTypes");
    if (!wrap) return;
    /* Don't rebuild while they're typing/selecting in a draft — wipes selection. */
    var ae = document.activeElement;
    if (ae && wrap.contains(ae) && (ae.tagName === "TEXTAREA" || ae.tagName === "INPUT")) return;
    var open = state.data.seedTypeOpen || "";
    var html = "";
    var types = window.FS.SEED_TYPES;
    for (var i = 0; i < types.length; i++) {
      var st = types[i];
      var isOpen = open === st.id;
      var draftKey = st.draftKey;
      var hasDraft = draftKey && filledText(draftKey);
      html += '<div class="seed-card' + (isOpen ? " open" : "") + (hasDraft ? " drafted" : "") + '">';
      html += '<button type="button" class="seed-head" data-seedtype="' + st.id + '">';
      html += '<span class="seed-icon">' + st.icon + '</span>';
      html += '<span class="seed-titles"><span class="seed-name">' + esc(st.name) + '</span><span class="seed-tag">' + esc(st.tagline) + '</span></span>';
      html += '<span class="seed-chev">' + (isOpen ? "−" : "+") + '</span>';
      html += '</button>';
      if (isOpen) {
        html += '<div class="seed-body">';
        if (st.works_today) {
          html += '<div class="seed-block today"><div class="seed-label">WHY IT WORKS ON SOCIAL NOW</div><p>' + esc(st.works_today) + '</p></div>';
        }
        html += '<div class="seed-block"><div class="seed-label">WHY PEOPLE RESPOND</div><p>' + esc(st.psychology) + '</p></div>';
        html += '<div class="seed-block"><div class="seed-label">THE TEMPLATE</div><p>' + esc(st.template) + '</p></div>';
        html += '<div class="seed-block example"><div class="seed-label">WORKED EXAMPLE</div><p class="seed-example" id="seedEx_' + st.id + '">' + esc(st.example) + '</p><button type="button" class="copy-btn small" data-copy="seedEx_' + st.id + '">Copy it</button></div>';
        html += '<div class="seed-block rule"><div class="seed-label">THE CLASSY RULE</div><p>' + esc(st.classy_rule) + '</p></div>';
        if (draftKey) {
          html += '<div class="seed-block draft field" data-field="' + draftKey + '">';
          html += '<div class="seed-label">YOUR DRAFT</div>';
          html += '<p class="seed-draft-hint">' + esc(st.draftHint || "Write yours — pull from Roots when you can.") + '</p>';
          html += '<textarea data-key="' + draftKey + '" rows="3" placeholder="' + esc(st.draftPlaceholder || "") + '"></textarea>';
          html += '<span class="claim-check" data-check="' + draftKey + '"></span>';
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    wrap.innerHTML = html;
    bindSeedDraftFields(wrap);
  }

  function renderHooks() {
    var wrap = document.getElementById("hookList");
    if (!wrap) return;
    var hooks = (CFG.hookBank && CFG.hookBank.length)
      ? CFG.hookBank
      : ((window.FS.CONTENT && window.FS.CONTENT.openLoops) || []);
    var html = "";
    for (var i = 0; i < hooks.length; i++) {
      var h = hooks[i];
      var text = typeof h === "string" ? h : (h && h.body) || "";
      if (!text) continue;
      html += '<div class="hook-row"><span class="hook-text" id="hook_' + i + '">' + esc(text) + '</span><button class="copy-btn small" data-copy="hook_' + i + '">Copy</button></div>';
    }
    wrap.innerHTML = html;
  }

  function renderCopyShelf(wrapId, items, prefix) {
    var wrap = document.getElementById(wrapId);
    if (!wrap || !items) return;
    var html = "";
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var id = prefix + "_" + (it.id || i);
      var title = it.title || it.icon || ("Option " + (i + 1));
      if (it.icon && it.title) title = it.icon + " " + it.title;
      html += '<div class="copy-card' + (it.open ? " open" : "") + '">';
      html += '<button type="button" class="copy-card-head" data-copy-toggle="' + id + '">';
      html += '<span class="copy-card-title">' + esc(title) + '</span>';
      html += '<span class="copy-card-chev">+</span></button>';
      html += '<div class="copy-card-body" id="' + id + '_body" hidden>';
      html += '<p class="copy-card-text" id="' + id + '">' + esc(it.body || "") + '</p>';
      html += '<button type="button" class="copy-btn small" data-copy="' + id + '">Copy</button>';
      html += '</div></div>';
    }
    wrap.innerHTML = html;
  }

  function renderContentBanks() {
    var C = window.FS.CONTENT;
    if (!C) return;
    renderCopyShelf("curiosityList", C.curiosity, "cur");
    renderCopyShelf("calendarCuriosityList", C.curiosity, "calcur");
    var intro = document.getElementById("productStoryIntro");
    if (intro && C.productStory) intro.textContent = C.productStory.intro;
    renderCopyShelf("productStoryList", C.productStory && C.productStory.posts, "prod");
    renderCopyShelf("businessStoryList", C.businessStory, "biz");
  }

  function renderKnowPanel(force) {
    var C = window.FS.CONTENT;
    if (!C) return;
    var knowRoot = document.getElementById("panel-know");
    var knowKey = (packEvergreen() ? "e" : "g") + "|" + (canSeeLeaderFaqs() ? "L" : "n") + "|facts3";
    if (!force && knowRoot && knowRoot.getAttribute("data-know-stamp") === knowKey) return;
    if (knowRoot) knowRoot.setAttribute("data-know-stamp", knowKey);
    var pi = document.getElementById("pillarsIntro");
    if (pi) pi.textContent = C.pillarsIntro || "";
    var pillarsWrap = document.getElementById("pillarsList");
    if (pillarsWrap && C.pillars) {
      pillarsWrap.innerHTML = C.pillars.map(function (p) {
        return '<div class="fact-card pillar-card"><div class="fact-label">' + esc(p.icon + " " + p.title) +
          '</div><p>' + esc(p.body) + '</p></div>';
      }).join("");
    }
    var factsWrap = document.getElementById("funFactsList");
    if (factsWrap && C.funFacts) {
      factsWrap.innerHTML = C.funFacts.map(function (f) {
        return heartableFactCardHtml({
          id: "fun:" + f.id,
          title: f.title,
          body: f.body
        });
      }).join("");
    }
    var prodKnow = document.getElementById("productKnowList");
    if (prodKnow && C.productStory && C.productStory.posts) {
      prodKnow.innerHTML = C.productStory.posts.map(function (p) {
        return '<div class="fact-card"><div class="fact-label">' + esc(p.icon + " " + p.title) +
          '</div><p>' + esc(factStoryBody(p.body)) + '</p></div>';
      }).join("");
    }
    var bizKnow = document.getElementById("businessKnowList");
    if (bizKnow && C.businessStory) {
      bizKnow.innerHTML = C.businessStory.map(function (p) {
        return '<div class="fact-card"><div class="fact-label">' + esc(p.icon + " " + p.title) +
          '</div><p>' + esc(factStoryBody(p.body)) + '</p></div>';
      }).join("");
    }
    renderFaqList(document.getElementById("panel-know"));
  }

  function faqEvergreenPrefix(prefix) {
    return prefix === "evfaq_" || prefix === "evlfq_";
  }

  function faqVisibleGroups(groups, scope) {
    var lead = canSeeLeaderFaqs();
    var out = [];
    (groups || []).forEach(function (g) {
      if (!g) return;
      if (g.leaderOnly && !lead) return;
      if (scope === "leaders" && !g.leaderOnly) return;
      var items = (g.items || []).filter(function (f) {
        if (!f) return false;
        if (f.leaderOnly && !lead) return false;
        return true;
      });
      if (!items.length) return;
      out.push({
        id: g.id,
        title: g.title,
        blurb: g.blurb,
        leaderOnly: !!g.leaderOnly,
        groveOnly: !!g.groveOnly,
        items: items
      });
    });
    if (scope !== "leaders") {
      out.sort(function (a, b) {
        if (!!a.leaderOnly === !!b.leaderOnly) return 0;
        return a.leaderOnly ? -1 : 1;
      });
    }
    return out;
  }

  function faqGroupList(prefix, scope) {
    var C = window.FS.CONTENT || {};
    var groups = [];
    if (C.faqGroups && C.faqGroups.length) groups = C.faqGroups;
    else if (C.faqs && C.faqs.length) {
      groups = [{ id: "all", title: "FAQs", blurb: "", items: C.faqs }];
    }
    if (!faqEvergreenPrefix(prefix)) return faqVisibleGroups(groups, scope);
    var extra = (window.FS.EVERGREEN && window.FS.EVERGREEN.faqGroups) || [];
    var extraById = {};
    extra.forEach(function (g) {
      if (g && g.id) extraById[g.id] = g;
    });
    var out = [];
    var seen = {};
    extra.forEach(function (g) {
      if (!g || !g.id) return;
      var shared = null;
      for (var i = 0; i < groups.length; i++) {
        if (groups[i] && groups[i].id === g.id) { shared = groups[i]; break; }
      }
      if (shared && !shared.groveOnly) return;
      out.push(g);
      seen[g.id] = true;
    });
    groups.forEach(function (g) {
      if (!g || seen[g.id]) return;
      if (g.groveOnly) {
        if (extraById[g.id]) {
          out.push(extraById[g.id]);
          seen[g.id] = true;
        }
        return;
      }
      var overlay = extraById[g.id];
      var items = (overlay && overlay.items && overlay.items.length)
        ? overlay.items.filter(Boolean)
        : (g.items || []).filter(function (f) { return f && !f.groveOnly; });
      if (!items.length) return;
      out.push({
        id: g.id,
        title: (overlay && overlay.title) || g.title,
        blurb: (overlay && overlay.blurb) || g.blurb,
        leaderOnly: !!(g.leaderOnly || (overlay && overlay.leaderOnly)),
        groveOnly: false,
        items: items
      });
      seen[g.id] = true;
    });
    return faqVisibleGroups(out, scope);
  }

  function flattenFaqs() {
    var out = [];
    faqGroupList().forEach(function (g) {
      (g.items || []).forEach(function (f, i) {
        out.push({
          id: "faq_" + (f.id || (g.id + "_" + i)),
          q: f.q || "",
          a: f.a || "",
          cat: g.id,
          catTitle: g.title || ""
        });
      });
    });
    return out;
  }

  function ensureFaqCatOpen() {
    if (!state.data.faqCatOpen || typeof state.data.faqCatOpen !== "object") {
      state.data.faqCatOpen = {};
    }
    return state.data.faqCatOpen;
  }

  function faqQueryForPrefix(prefix) {
    if (prefix === "lfq_" || prefix === "evlfq_") return "";
    if (prefix === "evfaq_") return String(state.data.faqQueryEv || "").trim().toLowerCase();
    return String(state.data.faqQuery || "").trim().toLowerCase();
  }

  function faqApplyTeam(text, prefix) {
    var s = String(text || "");
    var ev = prefix ? faqEvergreenPrefix(prefix) : packEvergreen();
    if (!ev) return s;
    return s
      .replace(/a Fresh Grove/g, "an Evergreen Co")
      .replace(/The Fresh Grove/g, "Evergreen Co")
      .replace(/Fresh Grove/g, "Evergreen Co")
      .replace(/Grove Leaders/g, "Evergreen Leaders")
      .replace(/founding gathering/gi, "gathering")
      .replace(/founding-era /gi, "")
      .replace(/founding partner/gi, "partner");
  }

  function faqNorm(s) {
    return String(s || "").toLowerCase()
      .replace(/\bcosmo\b/g, "cosmos")
      .replace(/[-'’]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function faqItemMatches(f, q, prefix) {
    if (!q) return true;
    var raw = (f.q || "") + " " + (f.a || "") + " " + (f.catTitle || "");
    var nq = faqNorm(q);
    if (faqNorm(raw).indexOf(nq) > -1) return true;
    var swapped = faqApplyTeam(raw, prefix);
    return swapped !== raw && faqNorm(swapped).indexOf(nq) > -1;
  }

  function renderFaqList(scopeEl) {
    var searchRoot = scopeEl && scopeEl.querySelectorAll ? scopeEl : document;
    var wraps = searchRoot.querySelectorAll(".faq-list[data-faq-prefix]");
    if (scopeEl && scopeEl.matches && scopeEl.matches(".faq-list[data-faq-prefix]")) {
      wraps = [scopeEl];
    }
    if (!wraps.length) return;
    var openFaq = state.data.openFaq || "";
    var catOpen = ensureFaqCatOpen();

    for (var w = 0; w < wraps.length; w++) {
      var faqWrap = wraps[w];
      var prefix = faqWrap.getAttribute("data-faq-prefix") || "faq_";
      var scope = faqWrap.getAttribute("data-faq-scope") || "";
      var groups = faqGroupList(prefix, scope);
      var q = faqQueryForPrefix(prefix);
      var shown = 0;
      var html = "";
      var leadersFlat = scope === "leaders";
      groups.forEach(function (g) {
        var items = (g.items || []).filter(function (f) {
          return faqItemMatches({
            q: f.q,
            a: f.a,
            catTitle: g.title
          }, q, prefix);
        });
        if (q && !items.length) return;
        var gid = g.id;
        var isOpen = q ? true : !!catOpen[gid];
        var count = items.length;
        shown += count;
        if (!leadersFlat) {
          html += '<div class="faq-cat' + (isOpen ? " is-open" : "") + (g.leaderOnly ? " is-leaders" : "") + '" data-faq-fold="' + esc(gid) + '">';
          html += '<button type="button" class="faq-cat-head" data-faq-cat="' + esc(gid) + '" aria-expanded="' + (isOpen ? "true" : "false") + '">';
          html += '<span class="faq-cat-copy">';
          html += '<span class="faq-cat-title">' + esc(g.title || "FAQs") + "</span>";
          if (g.blurb) html += '<span class="faq-cat-blurb">' + esc(faqApplyTeam(g.blurb, prefix)) + "</span>";
          html += '<span class="faq-cat-count">' + count + (count === 1 ? " question" : " questions") + "</span>";
          html += "</span>";
          html += '<span class="faq-cat-chev" aria-hidden="true">' + (isOpen ? "−" : "+") + "</span>";
          html += "</button>";
          html += '<div class="faq-cat-body">';
        }
        items.forEach(function (f, i) {
          var id = prefix + (f.id || (gid + "_" + i));
          var itemOpen = openFaq === id;
          html += '<div class="faq-item' + (itemOpen ? " open" : "") + '" data-faq-item="' + id + '">';
          html += '<button type="button" class="faq-q" data-faq="' + id + '" aria-expanded="' + (itemOpen ? "true" : "false") + '">' +
            esc(faqApplyTeam(f.q, prefix)) +
            '<span class="faq-chev">' + (itemOpen ? "−" : "+") + "</span></button>";
          html += '<div class="faq-a"><p id="' + id + '">' + esc(faqApplyTeam(f.a, prefix)) + "</p>" +
            '<button type="button" class="copy-btn small" data-copy="' + id + '">Copy answer</button></div>';
          html += "</div>";
        });
        if (!leadersFlat) html += "</div></div>";
      });
      faqWrap.innerHTML = html;
      var host = faqWrap.closest(".know-acc-body") || faqWrap.parentNode;
      var empty = host ? host.querySelector(".faq-search-empty") : null;
      if (empty) empty.hidden = shown > 0 || !q;
      var search = host ? host.querySelector(".faq-search") : null;
      if (search && document.activeElement !== search) {
        search.value = (prefix === "evfaq_" ? state.data.faqQueryEv : state.data.faqQuery) || "";
      }
    }
    var leadersFaqBlock = document.getElementById("leadersFaqBlock");
    if (leadersFaqBlock) {
      leadersFaqBlock.hidden = !leadersFaqBlock.querySelector(".faq-item");
    }
  }

  function talkPlayCopy(m) {
    if (m.openers && m.openers.length) {
      return m.openers.join("\n\n———\n\n");
    }
    return (m.lines || []).map(function (ln) {
      return ln.who + ": " + ln.text;
    }).join("\n");
  }

  function renderTalkGuide(G) {
    var root = document.getElementById("talkGuideRoot");
    if (!root || !G) return;
    if (!state.data.talkFocusPending && root.getAttribute("data-talk-stamp") === "1" && root.firstChild) return;
    root.setAttribute("data-talk-stamp", "1");
    var openTalk = state.data.openTalk || "";
    var openPrinciple = state.data.openPrinciple || "";
    if (!state.data.talkSectionOpen || typeof state.data.talkSectionOpen !== "object") {
      state.data.talkSectionOpen = {};
    }
    var secOpen = state.data.talkSectionOpen;
    var catMeta = {
      Warm: { emoji: "💬", label: "Warm moments", blurb: "Someone already lit up — keep the human feeling warm." },
      "Cold-ish": { emoji: "👋", label: "Cold-ish reach", blurb: "No prior chat yet — warm recognition first, then a curiosity opener that sounds like you." },
      Objection: { emoji: "🧭", label: "Objections", blurb: "A pushback is still a conversation. Decode what’s underneath." },
      Business: { emoji: "🤝", label: "Business curiosity", blurb: "Diagnose before you pitch the partner path." },
      Invite: { emoji: "📨", label: "Info Zoom invites", blurb: "Ask people to the call like you’re telling a story — not running a campaign." },
      Fade: { emoji: "🌙", label: "When it goes quiet", blurb: "One useful deposit — then let silence mean no." }
    };
    var catOrder = ["Warm", "Cold-ish", "Objection", "Business", "Invite", "Fade"];
    var principleEmoji = ["🌅", "🔍", "🌿", "✨", "🎯", "🕊️"];

    function sectionHead(key, title, blurb, countLabel) {
      var open = !!secOpen[key];
      return '<section class="talk-cat-block talk-sec-fold' + (open ? " is-open" : "") + '" data-talk-fold="' + esc(key) + '">' +
        '<button type="button" class="talk-cat-head" data-talk-section="' + esc(key) + '" aria-expanded="' + (open ? "true" : "false") + '">' +
        '<span class="talk-cat-head-copy">' +
        '<span class="talk-cat-title">' + esc(title) + "</span>" +
        (blurb ? '<span class="talk-cat-blurb">' + esc(blurb) + "</span>" : "") +
        (countLabel ? '<span class="talk-cat-count">' + esc(countLabel) + "</span>" : "") +
        "</span>" +
        '<span class="talk-cat-chev" aria-hidden="true">' + (open ? "−" : "+") + "</span>" +
        "</button>";
    }

    var html = "";
    html += '<p class="body-p">' + esc(G.lede || "") + "</p>";

    /* Why / posture / arc sit above the moment bank */
    if (G.thesis) {
      html += sectionHead("why", "Why this works", "The judgment behind the moments — tap when you want the fuller picture.", null);
      html += '<div class="talk-sec-fold-body">';
      html += '<div class="talk-stats">';
      (G.thesis.stats || []).forEach(function (s) {
        html += '<div class="talk-stat"><div class="talk-stat-num">' + esc(s.num) +
          '</div><div class="talk-stat-lbl">' + esc(s.lbl) + "</div></div>";
      });
      html += "</div>";
      (G.thesis.paras || []).forEach(function (p) {
        html += '<p class="body-p">' + esc(p) + "</p>";
      });
      if (G.thesis.pull) {
        html += '<p class="talk-pull">' + esc(G.thesis.pull) + "</p>";
      }
      html += "</div>";
      html += "</section>";
    }

    if (G.principles && G.principles.length) {
      html += sectionHead(
        "posture",
        "The posture",
        "Six instincts for how to show up — tap each one.",
        G.principles.length + " principles"
      );
      html += '<div class="talk-sec-fold-body faq-list talk-principles-list">';
      G.principles.forEach(function (p, i) {
        var pid = "principle_" + i;
        var isOpen = openPrinciple === pid;
        var em = principleEmoji[i] || "•";
        html += '<div class="faq-item talk-principle-item' + (isOpen ? " open" : "") + '" data-principle-item="' + pid + '">';
        html += '<button type="button" class="faq-q" data-talk-principle="' + pid + '" aria-expanded="' + (isOpen ? "true" : "false") + '">' +
          '<span class="talk-emoji-bubble talk-emoji-bubble-sm" aria-hidden="true">' + em + "</span>" +
          '<span class="talk-q-wrap">' + esc(p.title) + "</span>" +
          '<span class="faq-chev">' + (isOpen ? "−" : "+") + "</span></button>";
        html += '<div class="faq-a"><p>' + esc(p.body) + "</p></div>";
        html += "</div>";
      });
      html += "</div>";
      html += "</section>";
    }

    if (G.arc && G.arc.length) {
      var arcN = G.arc.length;
      html += sectionHead("arc", "The full arc", "Recognition → conversation → honest fit → their decision.",
        arcN === 1 ? "1 stage" : arcN + " stages");
      html += '<div class="talk-sec-fold-body"><div class="talk-arc">';
      G.arc.forEach(function (s) {
        html += '<div class="talk-stage"><div class="talk-stage-n" aria-hidden="true">' + esc(s.n) +
          '</div><div class="talk-stage-body"><div class="fact-label">' + esc(s.title) +
          '</div><div class="talk-stage-goal">' + esc(s.goal) + "</div><p>" + esc(s.body) +
          "</p></div></div>";
      });
      html += "</div></div>";
      html += "</section>";
    }

    if (G.moments && G.moments.length) {
      html += '<p class="talk-sec-label">In the moment</p>';
      html += '<p class="body-p">' + esc(G.momentsIntro || "") + "</p>";

      var byCat = {};
      G.moments.forEach(function (m) {
        var cat = m.cat || "Warm";
        if (!byCat[cat]) byCat[cat] = [];
        byCat[cat].push(m);
      });
      var ordered = catOrder.slice();
      Object.keys(byCat).forEach(function (c) {
        if (ordered.indexOf(c) < 0) ordered.push(c);
      });
      if (!state.data.talkCatOpen || typeof state.data.talkCatOpen !== "object") {
        state.data.talkCatOpen = {};
      }
      var talkCatOpen = state.data.talkCatOpen;

      function momentBodyHtml(m, id) {
        var body = '<div class="faq-a talk-moment-body">';
        body += '<div class="talk-why"><div class="talk-why-label">The mechanism</div><p>' +
          esc(m.mechanism) + "</p></div>";
        if (m.note) body += "<p>" + esc(m.note) + "</p>";
        if (m.crossLink && m.crossLink.goto && m.crossLink.label) {
          body += '<p class="talk-cross-link"><button type="button" class="inline-link" data-goto="' +
            esc(m.crossLink.goto) + '">' + esc(m.crossLink.label) + "</button></p>";
        }
        body += '<div class="talk-play"><div class="talk-play-label">' + esc(m.playLabel || "The play") + "</div>";
        if (m.openers && m.openers.length) {
          body += '<div class="talk-opener-bank">';
          m.openers.forEach(function (text, oi) {
            var copyId = id + "_opener_" + oi;
            body += '<div class="talk-opener-card">';
            body += '<div class="talk-exchange"><div class="talk-line you"><span class="talk-who">You</span><span>' +
              esc(text) + "</span></div></div>";
            body += '<p class="talk-play-copy" id="' + copyId + '" hidden>' + esc(text) + "</p>";
            body += '<button type="button" class="copy-btn small" data-copy="' + copyId + '">Copy this opener</button>';
            body += "</div>";
          });
          body += "</div>";
        } else {
          body += '<div class="talk-exchange">';
          (m.lines || []).forEach(function (ln) {
            var cls = ln.who === "You" ? "you" : "them";
            body += '<div class="talk-line ' + cls + '"><span class="talk-who">' + esc(ln.who) +
              "</span><span>" + esc(ln.text) + "</span></div>";
          });
          body += "</div>";
          var copyId = id + "_play";
          body += '<p class="talk-play-copy" id="' + copyId + '" hidden>' + esc(talkPlayCopy(m)) + "</p>";
          body += '<button type="button" class="copy-btn small" data-copy="' + copyId + '">Copy the play</button>';
        }
        body += "</div>";
        if (m.trap) {
          body += '<div class="talk-trap"><strong>The trap:</strong> ' + esc(m.trap) + "</div>";
        }
        body += "</div>";
        return body;
      }

      ordered.forEach(function (cat) {
        var list = byCat[cat];
        if (!list || !list.length) return;
        var meta = catMeta[cat] || { emoji: "💬", label: cat, blurb: "" };

        /* One moment in the category → one tap opens it (no nested accordion). */
        if (list.length === 1) {
          var solo = list[0];
          var soloId = "talk_" + solo.id;
          var soloOpen = openTalk === soloId;
          html += '<section class="talk-cat-block talk-cat-solo' + (soloOpen ? " is-open" : "") + '" id="' + esc(soloId) + '">';
          html += '<button type="button" class="talk-cat-head" data-talk="' + soloId + '" aria-expanded="' + (soloOpen ? "true" : "false") + '">' +
            '<span class="talk-emoji-bubble talk-emoji-bubble-lg" aria-hidden="true">' + meta.emoji + "</span>" +
            '<span class="talk-cat-head-copy">' +
            '<span class="talk-cat-title">' + esc(meta.label) + "</span>" +
            '<span class="talk-cat-blurb">' + esc(solo.q) + "</span>" +
            "</span>" +
            '<span class="talk-cat-chev" aria-hidden="true">' + (soloOpen ? "−" : "+") + "</span>" +
            "</button>";
          html += momentBodyHtml(solo, soloId);
          html += "</section>";
          return;
        }

        var catOpen = !!talkCatOpen[cat];
        var countLabel = list.length + " moments";
        html += '<section class="talk-cat-block' + (catOpen ? " is-open" : "") + '" data-talk-cat-block="' + esc(cat) + '">';
        html += '<button type="button" class="talk-cat-head" data-talk-cat="' + esc(cat) + '" aria-expanded="' + (catOpen ? "true" : "false") + '">' +
          '<span class="talk-emoji-bubble talk-emoji-bubble-lg" aria-hidden="true">' + meta.emoji + "</span>" +
          '<span class="talk-cat-head-copy">' +
          '<span class="talk-cat-title">' + esc(meta.label) + "</span>" +
          (meta.blurb ? '<span class="talk-cat-blurb">' + esc(meta.blurb) + "</span>" : "") +
          '<span class="talk-cat-count">' + esc(countLabel) + "</span>" +
          "</span>" +
          '<span class="talk-cat-chev" aria-hidden="true">' + (catOpen ? "−" : "+") + "</span>" +
          "</button>";
        html += '<div class="faq-list talk-moments">';
        list.forEach(function (m) {
          var id = "talk_" + m.id;
          var isOpen = openTalk === id;
          html += '<div class="faq-item talk-moment-card' + (isOpen ? " open" : "") + '" id="' + esc(id) + '">';
          html += '<button type="button" class="faq-q" data-talk="' + id + '" aria-expanded="' + (isOpen ? "true" : "false") + '">' +
            '<span class="talk-emoji-bubble talk-emoji-bubble-sm" aria-hidden="true">' + meta.emoji + "</span>" +
            '<span class="talk-q-wrap">' + esc(m.q) + "</span>" +
            '<span class="faq-chev">' + (isOpen ? "−" : "+") + "</span></button>";
          html += momentBodyHtml(m, id);
          html += "</div>";
        });
        html += "</div>";
        html += "</section>";
      });
    }

    if (G.redlines && G.redlines.length) {
      html += '<div class="callout compliance talk-redlines">';
      html += '<div class="callout-tag">Bright lines · non-negotiable</div>';
      html += '<div class="callout-body"><ul class="talk-rl-list">';
      G.redlines.forEach(function (r) {
        html += "<li><strong>" + esc(r.title) + "</strong> " + esc(r.body) + "</li>";
      });
      html += "</ul></div></div>";
    }
    if (G.closing) {
      html += '<p class="talk-closing">' + esc(G.closing) + "</p>";
    }
    root.innerHTML = html;
  }

  /* ── Product learning library ─────────────────────────── */
  function ensureProductBrowse() {
    if (!state.productBrowse) {
      state.productBrowse = {
        mode: "products",
        category: null,
        subcategory: null,
        productId: null,
        topicId: null,
        ingredientId: null,
        q: "",
        scope: "all"
      };
    }
    if (state.productBrowse.mode !== "ingredients") state.productBrowse.mode = state.productBrowse.mode || "products";
    if (state.productBrowse.scope !== "favorites") state.productBrowse.scope = state.productBrowse.scope || "all";
    if (typeof state.productBrowse.topicId === "undefined") state.productBrowse.topicId = null;
    if (typeof state.productBrowse.ingredientId === "undefined") state.productBrowse.ingredientId = null;
    return state.productBrowse;
  }

  function ingredientGuide() {
    return window.FS.INGREDIENT_GUIDE || { topics: [], glossary: [], disclaimer: "", sourceNote: "" };
  }

  function ingredientRoleLabel(roleId) {
    var map = window.FS.INGREDIENT_ROLE_LABELS || {};
    return map[roleId] || roleId || "";
  }

  function ingredientById(id) {
    if (!id) return null;
    var list = ingredientGuide().glossary || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function joinAndList(parts) {
    if (!parts || !parts.length) return "";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts[0] + " and " + parts[1];
    return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];
  }

  function upcycledBitsForProduct(p) {
    if (!p) return [];
    var blob = [p.summary, p.heroIngredients, p.ingredientsNote].join(" ").toLowerCase();
    if (blob.indexOf("upcycled") < 0) return [];
    var topic = ingredientTopicById("upcycled");
    var ids = (topic && topic.ingredientIds) || [];
    var seen = {};
    var bits = [];
    function add(key, label) {
      if (seen[key]) return;
      seen[key] = true;
      bits.push(label);
    }
    for (var i = 0; i < ids.length; i++) {
      var ing = ingredientById(ids[i]);
      if (!ing) continue;
      if (ingredientVisibleProductIds(ing).indexOf(p.id) < 0) continue;
      if (ing.id === "prunus-armeniaca-seed-powder" ||
          ing.id === "rubus-idaeus-seed-powder" ||
          ing.id === "punica-granatum-seed-powder") {
        add("seeds", "fruit-seed grains");
      } else if (ing.id === "pyrus-malus-fruit-extract") {
        add("apple", "apple peel");
      } else if (ing.id === "hippophae-rhamnoides-extract") {
        add("buckthorn", "sea buckthorn");
      } else if (ing.id === "plankton-extract") {
        add("plankton", "plankton for the eye area");
      } else {
        add(ing.id, ing.commonName || ing.inciName || "");
      }
    }
    return bits.filter(Boolean);
  }

  function productBrowseReturnFrom(active) {
    if (active === "ev-learn") return { panel: "ev-learn", label: "Pick Your First Few" };
    if (active === "ev-resources") return { panel: "ev-resources", label: "Resources" };
    if (active === "know") return { panel: "know", label: "Learn" };
    if (active === "why") return { panel: "why", label: "Why Ringana" };
    return null;
  }

  function ingredientTopicById(id) {
    if (!id) return null;
    var list = ingredientGuide().topics || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function ingredientVisibleProductIds(ing) {
    if (!ing || !ing.productIds) return [];
    var out = [];
    for (var i = 0; i < ing.productIds.length; i++) {
      if (productById(ing.productIds[i])) out.push(ing.productIds[i]);
    }
    return out;
  }

  function ingredientSearchHaystack(ing) {
    if (!ing) return "";
    var hay = [
      ing.inciName,
      ing.commonName,
      (ing.altNames || []).join(" "),
      ing.blurb,
      (ing.roles || []).map(ingredientRoleLabel).join(" "),
      (ing.match || []).join(" ")
    ].join(" ").toLowerCase();
    /* “gluten-free” on a supplement is not gluten in the bottle. */
    hay = hay.replace(/gluten-free/g, " ");
    return hay;
  }

  function ingredientSearchScore(ing, q) {
    var raw = normalizeProductSearchText(q);
    if (!raw || !ing) return 0;
    var inci = normalizeProductSearchText(ing.inciName);
    var common = normalizeProductSearchText(ing.commonName);
    var alts = (ing.altNames || []).map(normalizeProductSearchText).filter(Boolean);
    var hay = ingredientSearchHaystack(ing);
    var score = 0;
    if (inci === raw || common === raw) score += 1000;
    for (var ai = 0; ai < alts.length; ai++) {
      if (alts[ai] === raw) score += 980;
      if (alts[ai].indexOf(raw) === 0) score += 480;
      if (alts[ai].indexOf(raw) >= 0) score += 260;
    }
    if (inci.indexOf(raw) === 0 || common.indexOf(raw) === 0) score += 500;
    if (inci.indexOf(raw) >= 0) score += 300;
    if (common.indexOf(raw) >= 0) score += 280;
    if (hay.indexOf(raw) >= 0) score += 40;
    var tokens = raw.split(" ").filter(function (t) { return t.length > 1; });
    if (tokens.length > 1) {
      var hit = 0;
      for (var i = 0; i < tokens.length; i++) {
        if (hay.indexOf(tokens[i]) >= 0) hit++;
      }
      /* Require every token — same bar as product search */
      if (hit === tokens.length) score += 120 + hit * 20;
    }
    /* Only boost popular ingredients when they already matched the query */
    if (score > 0) score += Math.min(ingredientVisibleProductIds(ing).length, 20);
    return score;
  }

  function ingredientMatchesQuery(ing, q) {
    var raw = ((q || "") + "").trim().toLowerCase();
    if (!raw || !ing) return false;
    var hay = ingredientSearchHaystack(ing);
    var expanded = expandProductSearchTerms(raw);
    for (var i = 0; i < expanded.length; i++) {
      if (hayHasTerm(hay, expanded[i])) return true;
    }
    var tokens = raw.split(/\s+/).filter(function (t) { return t.length > 1; });
    if (tokens.length > 1) {
      return tokens.every(function (tok) {
        if (hayHasTerm(hay, tok)) return true;
        return expandProductSearchTerms(tok).some(function (t) {
          return hayHasTerm(hay, t);
        });
      });
    }
    return false;
  }

  function ingredientsMatchingQuery(q, limit) {
    var raw = ((q || "") + "").trim().toLowerCase();
    if (!raw) return [];
    var list = ingredientGuide().glossary || [];
    var hits = list.filter(function (ing) {
      if (/\bingredients\b/i.test(ing && ing.inciName)) return false;
      if (ingredientVisibleProductIds(ing).length < 1) return false;
      return ingredientMatchesQuery(ing, raw);
    });
    hits.sort(function (a, b) {
      var diff = ingredientSearchScore(b, raw) - ingredientSearchScore(a, raw);
      if (diff) return diff;
      return String(a.inciName || "").localeCompare(String(b.inciName || ""));
    });
    if (limit && hits.length > limit) return hits.slice(0, limit);
    return hits;
  }

  function conventionalWatchItems() {
    var topics = ingredientGuide().topics || [];
    var out = [];
    for (var i = 0; i < topics.length; i++) {
      var t = topics[i];
      if (!t || t.id === "watch-for") continue;
      var list = t.avoidInConventional || [];
      if (!list.length) continue;
      for (var j = 0; j < list.length; j++) {
        var a = list[j];
        if (!a || !a.name) continue;
        out.push({
          name: a.name,
          examples: a.examples || "",
          why: a.why || "",
          topicId: t.id,
          topicTitle: t.title || "",
          avoidTitle: t.avoidTitle || t.title || ""
        });
      }
    }
    return out;
  }

  function avoidTopicSearchBlob(t) {
    var parts = [t.id, t.title, t.blurb, (t.aliases || []).join(" ")];
    var list = t.id === "watch-for" ? conventionalWatchItems() : (t.avoidInConventional || []);
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (!a) continue;
      parts.push(a.name || "", a.examples || "", a.why || "", a.avoidTitle || "", a.topicTitle || "");
    }
    return parts.join(" ").toLowerCase();
  }

  function topicsMatchingQuery(q) {
    var raw = ((q || "") + "").trim().toLowerCase();
    if (!raw) return [];
    return (ingredientGuide().topics || []).filter(function (t) {
      if (avoidTopicSearchBlob(t).indexOf(raw) >= 0) return true;
      var aliases = t.aliases || [];
      for (var i = 0; i < aliases.length; i++) {
        if (raw.indexOf(aliases[i]) >= 0 || aliases[i].indexOf(raw) === 0) return true;
      }
      return false;
    });
  }

  function ingredientsForTopic(topic) {
    if (!topic) return [];
    var ids = topic.ingredientIds || [];
    var out = [];
    for (var i = 0; i < ids.length; i++) {
      var ing = ingredientById(ids[i]);
      if (!ing) continue;
      if (ingredientVisibleProductIds(ing).length < 1 && topic.id !== "watch-for") continue;
      out.push(ing);
    }
    out.sort(function (a, b) {
      return String(a.inciName || "").localeCompare(String(b.inciName || ""));
    });
    return out;
  }

  function catalogProductById(id) {
    var list = (productLib().products || []);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function ensureProductFavorites() {
    if (!state.data) state.data = {};
    if (!Array.isArray(state.data.productFavorites)) state.data.productFavorites = [];
    var favs = state.data.productFavorites;
    var glowIx = favs.indexOf("fresh-after-sun-tan-booster-golden-glow");
    if (glowIx > -1) {
      favs.splice(glowIx, 1);
      if (favs.indexOf("fresh-after-sun-tan-booster") < 0) favs.push("fresh-after-sun-tan-booster");
    }
    var tanIx = favs.indexOf("fresh-tinted-moisturiser-tan");
    if (tanIx > -1) {
      favs.splice(tanIx, 1);
      if (favs.indexOf("fresh-tinted-moisturiser") < 0) favs.push("fresh-tinted-moisturiser");
    }
    var catalog = productLib().products || [];
    /* If the catalog hasn't loaded yet, keep the shortlist — wiping here used
       to erase hearts and leave Pick Your First Few stuck at 0. */
    if (!catalog.length) return favs;
    /* Drop favorites we know are hidden (SPF, pocket, tooth gel, etc.).
       Unknown ids stay so a renamed SKU doesn't delete the rest. */
    for (var i = favs.length - 1; i >= 0; i--) {
      var rec = catalogProductById(favs[i]);
      if (rec && isHiddenLibraryProduct(rec)) favs.splice(i, 1);
    }
    return favs;
  }

  function isProductFavorite(id) {
    return ensureProductFavorites().indexOf(id) > -1;
  }

  function favoriteCount() {
    var favs = ensureProductFavorites();
    var n = 0;
    for (var i = 0; i < favs.length; i++) {
      if (productById(favs[i])) n++;
    }
    return n;
  }

  function talkOpened() {
    return !!state.data.talk_opened;
  }

  function markTalkOpened() {
    if (state.data.talk_opened) return false;
    state.data.talk_opened = true;
    return true;
  }

  function toggleProductFavorite(id) {
    if (!id) return;
    var favs = ensureProductFavorites();
    var ix = favs.indexOf(id);
    if (ix > -1) favs.splice(ix, 1);
    else {
      favs.push(id);
      markLearnWalkthroughProgress("favorite");
    }
  }

  function favHeartSvg(on) {
    /* Tight viewBox on the path bounds so the heart sits in the middle of the circle. */
    var path = "M12 20.35l-1.45-1.32C5.4 14.36 2 11.28 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.78-3.4 6.86-8.55 11.54L12 20.35z";
    if (on) {
      return '<svg class="prod-fav-ico" viewBox="2 2 20 18.4" width="18" height="17" aria-hidden="true" focusable="false"><path fill="currentColor" d="' + path + '"/></svg>';
    }
    return '<svg class="prod-fav-ico" viewBox="2 2 20 18.4" width="18" height="17" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round" d="' + path + '"/></svg>';
  }

  function syncFavHeartButtons(id) {
    if (!id) return;
    var on = isProductFavorite(id);
    var buttons = document.querySelectorAll('[data-prod-fav="' + id + '"]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
      btn.innerHTML = favHeartSvg(on);
    }
    var scopeFav = document.querySelector('#productLibRoot [data-prod-scope="favorites"]');
    if (scopeFav) {
      var n = favoriteCount();
      scopeFav.textContent = "Favorites" + (n ? " · " + n : "");
    }
  }

  function favHeartBtn(id, extraClass) {
    var on = isProductFavorite(id);
    return '<button type="button" class="prod-fav-btn' + (on ? " on" : "") + (extraClass ? " " + extraClass : "") +
      '" data-prod-fav="' + esc(id) + '" aria-pressed="' + (on ? "true" : "false") +
      '" aria-label="' + (on ? "Remove from favorites" : "Add to favorites") + '">' +
      favHeartSvg(on) + "</button>";
  }

  function factStoryBody(body) {
    return String(body || "").replace(/^[^\n]+\n\n/, "");
  }

  function heartableFactCatalog() {
    var C = window.FS.CONTENT || {};
    var out = [];
    (C.funFacts || []).forEach(function (f) {
      if (!f || !f.id) return;
      out.push({
        id: "fun:" + f.id,
        title: f.title || "",
        body: f.body || "",
        goto: "why",
        section: "know-facts"
      });
    });
    return out;
  }

  function heartableFactById(id) {
    var list = heartableFactCatalog();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function factCardDomId(id) {
    return "factcard-" + String(id || "").replace(/:/g, "-");
  }

  function ensureFactFavorites() {
    if (!state.data) state.data = {};
    if (!Array.isArray(state.data.factFavorites)) state.data.factFavorites = [];
    var favs = state.data.factFavorites;
    var catalog = heartableFactCatalog();
    if (!catalog.length) return favs;
    var ok = {};
    for (var c = 0; c < catalog.length; c++) ok[catalog[c].id] = true;
    for (var i = favs.length - 1; i >= 0; i--) {
      if (!ok[favs[i]]) favs.splice(i, 1);
    }
    return favs;
  }

  function isFactFavorite(id) {
    return ensureFactFavorites().indexOf(id) > -1;
  }

  function toggleFactFavorite(id) {
    if (!id) return;
    var favs = ensureFactFavorites();
    var ix = favs.indexOf(id);
    if (ix > -1) favs.splice(ix, 1);
    else favs.push(id);
  }

  function favoriteFacts() {
    var favs = ensureFactFavorites();
    var out = [];
    for (var i = 0; i < favs.length; i++) {
      var item = heartableFactById(favs[i]);
      if (item) out.push(item);
    }
    return out;
  }

  function factHeartBtn(id) {
    var on = isFactFavorite(id);
    return '<button type="button" class="prod-fav-btn' + (on ? " on" : "") +
      '" data-fact-fav="' + esc(id) + '" aria-pressed="' + (on ? "true" : "false") +
      '" aria-label="' + (on ? "Remove from facts you love" : "Heart this fact") + '">' +
      favHeartSvg(on) + "</button>";
  }

  function heartableFactCardHtml(item) {
    if (!item) return "";
    var label = ((item.icon ? item.icon + " " : "") + (item.title || "")).trim();
    return '<div class="fact-card' + (item.extraClass ? " " + item.extraClass : "") +
      '" id="' + esc(factCardDomId(item.id)) + '">' +
      '<div class="fact-card-head">' +
      '<div class="fact-label">' + esc(label) + "</div>" +
      factHeartBtn(item.id) +
      "</div><p>" + esc(item.body || "") + "</p></div>";
  }

  function syncFactHeartButtons(id) {
    if (!id) return;
    var on = isFactFavorite(id);
    var buttons = document.querySelectorAll('[data-fact-fav="' + id + '"]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Remove from facts you love" : "Heart this fact");
      btn.innerHTML = favHeartSvg(on);
    }
  }

  function renderContentFactShortlist() {
    var list = document.getElementById("contentFactList");
    if (!list) return;
    var facts = favoriteFacts();
    if (!facts.length) {
      list.innerHTML = '<span class="dim">Heart a few Company facts in Why Ringana — they’ll show up here when you plan posts.</span>' +
        '<p class="share-fav-hint"><button type="button" class="focus-shortlist-cta" data-goto="why" data-open-know="know-facts">Open Company facts →</button></p>';
      return;
    }
    var items = facts.map(function (f) {
      return '<li><button type="button" class="focus-shortlist-item" data-fact-open="' +
        esc(f.id) + '">' + esc(f.title) + "</button></li>";
    }).join("");
    list.innerHTML = '<ul class="focus-shortlist-ul">' + items + "</ul>" +
      '<p class="share-fav-hint">Lean on these when you talk or post — tap a title to reopen it. <button type="button" class="focus-shortlist-cta" data-goto="why" data-open-know="know-facts">See all Company facts →</button></p>';
  }

  function openHeartedFact(id) {
    var item = heartableFactById(id);
    if (!item) return;
    if (!state.data) state.data = {};
    state.data.focusFactId = id;
    hideLockToast();
    closeHubMenu();
    state.active = item.goto;
    persistActiveAndPaint();
  }

  function revealFocusFact() {
    var id = state.data && state.data.focusFactId;
    var secId = (state.data && state.data.openKnowSec) || "";
    if (id) {
      state.data.focusFactId = "";
      var item = heartableFactById(id);
      if (item) secId = item.section;
    }
    if (state.data) state.data.openKnowSec = "";
    if (!secId) return;
    var sec = document.getElementById(secId);
    if (sec) sec.open = true;
    var el = id ? document.getElementById(factCardDomId(id)) : sec;
    if (!el || !el.scrollIntoView) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    });
  }

  function productLib() {
    return window.FS.PRODUCT_LIB || { categories: [], products: [], disclaimer: "", sourceNote: "" };
  }

  function isSpfProduct(p) {
    if (!p) return true;
    var name = ((p.name || "") + " " + (p.id || "")).toLowerCase();
    /* After-sun stays — only hide true SPF / sunscreen SKUs (not related-product badge noise). */
    if (/after[\s-]*sun/.test(name)) return false;
    var sub = ((p.subcategory || "") + "").toLowerCase();
    if (sub === "sunscreen") return true;
    if (/\bspf\b|sunscreen/.test(name)) return true;
    if (sub === "sun" && !/after[\s-]*sun|tan booster/.test(name)) return true;
    return false;
  }

  /* Pocket sizes duplicate full-size formulas — keep one listing. */
  function isPocketSizeProduct(p) {
    if (!p) return true;
    var id = ((p.id || "") + "").toLowerCase();
    var name = ((p.name || "") + "").toLowerCase();
    return /(^|-)pocket($|-)/.test(id) || /\bpocket\b/.test(name);
  }

  function parentIdForPocket(p) {
    if (!p || !p.id) return "";
    var id = p.id;
    /* fresh-sunscreen-pocket-spf-25 → fresh-sunscreen-spf-25 (if present) or drop */
    if (/^(.+)-pocket(-spf-\d+)?$/i.test(id)) {
      return id.replace(/-pocket/i, "");
    }
    if (/^(.+)-pocket$/i.test(id)) return id.replace(/-pocket$/i, "");
    return "";
  }

  var pocketParentCache = null;
  function productsWithPocketSize() {
    if (pocketParentCache) return pocketParentCache;
    var map = {};
    var all = productLib().products || [];
    for (var i = 0; i < all.length; i++) {
      var p = all[i];
      if (!isPocketSizeProduct(p)) continue;
      var parent = parentIdForPocket(p);
      if (parent) map[parent] = true;
      /* Also mark known full-size ids when SPF suffix differs */
      if (p.id === "fresh-toner-calm-pocket") map["fresh-toner-calm"] = true;
      if (p.id === "fresh-deodorant-pocket") map["fresh-deodorant"] = true;
      if (p.id === "fresh-hand-balm-pocket") map["fresh-hand-balm"] = true;
    }
    pocketParentCache = map;
    return map;
  }

  function hasPocketSize(productOrId) {
    var id = typeof productOrId === "string" ? productOrId : (productOrId && productOrId.id);
    return !!(id && productsWithPocketSize()[id]);
  }

  function isHiddenLibraryProduct(p) {
    if (!p) return true;
    if (isSpfProduct(p)) return true;
    if (isPocketSizeProduct(p)) return true;
    /* Tooth gel stays out. Tooth oil can show if it lands in the library. */
    var toothBlob = ((p.id || "") + " " + (p.name || "") + " " + (p.subcategory || "")).toLowerCase();
    if (p.id === "fresh-baby-tooth-gel") return true;
    if ((p.subcategory || "").toLowerCase() === "tooth" && !/tooth[\s-]*oil/.test(toothBlob)) return true;
    /* Golden glow shares packaging art with regular after sun — one card + note. */
    if (p.id === "fresh-after-sun-tan-booster-golden-glow") return true;
    /* Tan shade shares the tinted moisturizer story — one card + note. */
    if (p.id === "fresh-tinted-moisturiser-tan") return true;
    /* Retired — do not surface even if a refresh script brings the SKU back. */
    if (p.id === "ringanaisi") return true;
    return false;
  }

  function hasGoldenGlowOption(productOrId) {
    var id = typeof productOrId === "string" ? productOrId : (productOrId && productOrId.id);
    return id === "fresh-after-sun-tan-booster";
  }

  function hasTanTintOption(productOrId) {
    var id = typeof productOrId === "string" ? productOrId : (productOrId && productOrId.id);
    return id === "fresh-tinted-moisturiser";
  }

  function visibleProducts() {
    return (productLib().products || []).filter(function (p) { return !isHiddenLibraryProduct(p); });
  }

  function isHiddenSunSub(subId) {
    var id = ((subId || "") + "").toLowerCase();
    /* No SPF line in the US library yet — hide empty sun-care browse chips. */
    return id === "sunscreen" || id === "tooth";
  }

  /* Concern / ingredient aliases so “acne” also finds impure / blemish copy. */
  var PRODUCT_SEARCH_GROUPS = [
    {
      keys: ["acne", "blemish", "blemishes", "impure", "impurities", "pimple", "pimples", "comedone", "comedones", "blackhead", "whitehead"],
      terms: ["acne", "impure", "impurities", "blemish", "blemishes", "blemished", "pimple", "comedone", "comedones", "blackhead"]
    },
    {
      keys: ["wrinkle", "wrinkles", "aging", "ageing", "antiaging", "anti-aging", "anti-ageing", "fine lines"],
      terms: ["wrinkle", "wrinkles", "anti-wrinkle", "ageing", "aging", "fine lines"]
    },
    {
      keys: ["redness", "reddened"],
      terms: ["redness", "reddened"]
    },
    {
      keys: ["sensitive"],
      terms: ["sensitive skin", "reddened"],
      excludeKey: true
    },
    {
      keys: ["irritat", "irritated", "irritation"],
      terms: ["irritated", "irritation"]
    },
    {
      keys: ["calm"],
      terms: ["calm"]
    },
    {
      keys: ["soothe", "soothing"],
      terms: ["soothe", "soothing"]
    },
    {
      keys: ["dry", "dryness"],
      terms: ["dry skin", "dryness"],
      excludeKey: true
    },
    {
      keys: ["dehydrated", "dehydration", "hydration", "hydrating"],
      terms: ["dehydrated", "dehydration", "hydrat"]
    },
    {
      keys: ["oily", "oiliness", "sebum"],
      terms: ["oily", "oiliness"]
    },
    {
      keys: ["pores", "pore"],
      terms: ["pore", "pores"]
    },
    {
      keys: ["gut", "digestive", "digestion", "bloating"],
      terms: ["gut", "digestion", "digestive", "bloating", "d-gest"]
    },
    {
      keys: ["energy", "sport", "workout"],
      terms: ["energy booster", "energy routine", "your energy", "sport", "training", "workout"],
      excludeKey: true
    },
    {
      keys: ["focus", "memory", "concentration", "unfocused"],
      terms: ["unfocused", "memory", "mental fitness", "clear head", "concentration"],
      excludeKey: true
    },
    {
      keys: ["joint", "joints", "mobility"],
      terms: ["joint", "joints", "freedom of movement"]
    },
    {
      keys: ["hair", "scalp"],
      terms: ["hair", "scalp", "beauty & hair"]
    },
    {
      keys: ["baby", "diaper", "bum"],
      terms: ["baby", "diaper", "bum", "little ones"]
    },
    {
      keys: ["vitamin c", "vit c", "ascorbic"],
      terms: ["vitamin c", "ascorb", "ascorbic"]
    },
    {
      keys: ["hyaluronic", "ha", "hyaluron"],
      terms: ["hyaluronic", "hyaluron", "sodium hyaluronate"]
    },
    {
      keys: ["niacinamide", "vitamin b3", "b3"],
      terms: ["niacinamide", "vitamin b3"]
    },
    {
      keys: ["retinol", "bakuchiol", "retinal"],
      terms: ["retinol", "bakuchiol", "retinal", "retinaldehyde", "vitamin a"]
    },
    {
      keys: ["peptide", "peptides"],
      terms: [
        "peptide", "peptides", "hexapeptide", "tetrapeptide", "tripeptide",
        "dipeptide", "oligopeptide", "polypeptide", "carnosine", "copper peptide"
      ]
    },
    {
      keys: ["ceramide", "ceramides"],
      terms: ["ceramide", "ceramides"]
    },
    {
      keys: ["antioxidant", "antioxidants"],
      terms: ["antioxidant", "antioxidants"]
    },
    {
      keys: ["probiotic", "probiotics", "prebiotic", "prebiotics", "postbiotic", "postbiotics"],
      terms: ["probiotic", "probiotics", "prebiotic", "prebiotics", "postbiotic", "postbiotics"]
    },
    {
      keys: ["bha", "salicylic"],
      terms: ["bha", "salicylic"]
    },
    {
      keys: ["q10", "coenzyme q10", "ubiquinone"],
      terms: ["q10", "coenzyme q10", "ubiquinone"]
    },
    {
      keys: ["vitamin e", "vit e", "tocopherol"],
      terms: ["vitamin e", "tocopherol"]
    },
    {
      keys: ["sunflower", "helianthus"],
      terms: ["sunflower", "helianthus"]
    },
    {
      keys: ["almond", "amygdalus"],
      terms: ["almond", "amygdalus"]
    },
    {
      keys: ["soy", "soya", "soybean"],
      terms: ["soy", "soya", "soybean", "glycine soja"]
    },
    {
      keys: ["coconut", "cocos"],
      terms: ["coconut", "cocos"]
    },
    {
      keys: ["shea", "butyrospermum"],
      terms: ["shea", "butyrospermum"]
    },
    {
      keys: ["olive", "olea", "olivate"],
      terms: ["olive", "olea", "olivate"]
    },
    {
      keys: ["sesame", "sesamum"],
      terms: ["sesame", "sesamum"]
    },
    {
      keys: ["wheat", "triticum"],
      terms: ["wheat", "triticum"]
    },
    {
      keys: ["oat", "avena"],
      terms: ["oat", "avena"]
    },
    {
      keys: ["mint", "mentha"],
      terms: ["mint", "mentha"]
    },
    {
      keys: ["cacao", "cocoa", "theobroma"],
      terms: ["cacao", "cocoa", "theobroma"]
    },
    {
      keys: ["apricot", "armeniaca"],
      terms: ["apricot", "armeniaca"]
    },
    {
      keys: ["kiwi", "actinidia"],
      terms: ["kiwi", "actinidia"]
    },
    {
      keys: ["castor", "ricinus"],
      terms: ["castor", "ricinus"]
    },
    {
      keys: ["canola", "rapeseed"],
      terms: ["canola", "rapeseed"]
    },
    {
      keys: ["licorice", "liquorice", "glycyrrhiza", "glycyrrhizate"],
      terms: ["licorice", "liquorice", "glycyrrhiza", "glycyrrhizate"]
    },
    {
      keys: ["flax", "linseed", "linum"],
      terms: ["flax", "linseed", "linum"]
    },
    {
      keys: ["grapeseed", "grape seed", "grape", "vitis"],
      terms: ["grape", "grapeseed", "vitis"]
    },
    {
      keys: ["parfum", "perfume"],
      terms: ["parfum", "perfume", "fragrance allergen"]
    },
    {
      keys: ["tree nut", "tree nuts"],
      terms: ["nut", "almond", "macadamia", "walnut"]
    },
    {
      keys: ["red wine"],
      terms: ["red wine", "vitis", "grape"]
    },
    {
      keys: ["chamomile", "camomile"],
      terms: ["chamomile", "camomile", "bisabolol", "matricaria"]
    }
  ];

  var productHaystackCache = null;
  var productSearchTimer = null;
  var productResultKey = "";
  var productLibSearchWired = false;

  function productSearchHaystack(p) {
    if (!p || !p.id) return "";
    if (!productHaystackCache) productHaystackCache = {};
    if (productHaystackCache[p.id]) return productHaystackCache[p.id];
    var badges = (p.badges || []).filter(function (b) {
      return !/\bspf\b|sunscreen/i.test(b || "");
    });
    var hay = [
      p.name, p.tagline, p.summary, p.heroIngredients, p.ingredientsNote,
      p.application, (p.claims || []).join(" "), (p.forWho || []).join(" "),
      p.step, p.subcategory, p.category, badges.join(" ")
    ].join(" ").toLowerCase();
    /* Oat extract “stimulates peptide formation” is not a peptide in the bottle. */
    hay = hay.replace(/peptide formation/g, " ");
    /* Application warnings, not a sensitive-skin claim. */
    hay = hay.replace(/sensitive to the sun/g, " ");
    hay = hay.replace(/sensitive places/g, " ");
    hay = hay.replace(/sensitive ingredients/g, " ");
    hay = hay.replace(/in the event of irritation,? redness[^.]*\./g, " ");
    hay = hay.replace(/if skin starts to flake or become irritated[^.]*\./g, " ");
    /* Clinical wrinkle “volume” is not hair volume. */
    hay = hay.replace(/dryness lines/g, " ");
    hay = hay.replace(/wrinkles? in volume/g, " ");
    hay = hay.replace(/wrinkle volume/g, " ");
    hay = hay.replace(/reduction in volume/g, " ");
    /* EFSA / INCI leftover words — not the job the partner typed. */
    hay = hay.replace(/energy metaboli[sz]ation/g, " ");
    hay = hay.replace(/energy metabolism/g, " ");
    hay = hay.replace(/beauty sleep/g, " ");
    hay = hay.replace(/lack of sleep/g, " ");
    hay = hay.replace(/scientifically studied concentration/g, " ");
    hay = hay.replace(/high concentration/g, " ");
    hay = hay.replace(/the concentration used/g, " ");
    hay = hay.replace(/this concentration/g, " ");
    hay = hay.replace(/actual concentration/g, " ");
    hay = hay.replace(/standardized concentration/g, " ");
    hay = hay.replace(/concentration of/g, " ");
    hay = hay.replace(/gluten-free/g, " ");
    productHaystackCache[p.id] = hay;
    return hay;
  }

  /* Stems that should match the words they start (hydrat → hydration). */
  var PRODUCT_SEARCH_STEMS = {
    irritat: 1,
    hydrat: 1,
    moisturis: 1,
    moisturiz: 1,
    ascorb: 1,
    hyaluron: 1,
    sunflower: 1,
    helianthus: 1,
    almond: 1,
    soy: 1,
    coconut: 1,
    shea: 1,
    olive: 1,
    sesame: 1,
    wheat: 1,
    mint: 1,
    cacao: 1,
    cocoa: 1,
    apricot: 1,
    kiwi: 1,
    canola: 1,
    rapeseed: 1,
    flax: 1,
    linseed: 1,
    grapeseed: 1,
    glycyrrhiz: 1
  };

  function hayHasTerm(hay, term) {
    term = String(term || "").toLowerCase();
    if (!term || !hay) return false;
    if (term.indexOf(" ") >= 0 || term.indexOf("-") >= 0) return hay.indexOf(term) >= 0;
    var esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (PRODUCT_SEARCH_STEMS[term]) {
      return new RegExp("(^|[^a-z0-9])" + esc, "i").test(hay);
    }
    /* Whole word, plus simple endings — not a substring of tiredness / packaging. */
    return new RegExp("(^|[^a-z0-9])" + esc + "(s|es|ed|ing)?(?![a-z0-9])", "i").test(hay);
  }

  function expandProductSearchTerms(q) {
    var raw = ((q || "") + "").trim().toLowerCase();
    if (!raw) return [];
    var out = [raw];
    var dropRaw = false;
    var seen = {};
    seen[raw] = true;
    function add(t) {
      t = (t || "").toLowerCase();
      if (!t || seen[t]) return;
      seen[t] = true;
      out.push(t);
    }
    function hitsKey(key) {
      if (!key) return false;
      if (raw === key) return true;
      /* Short aliases (ha, b3) — exact query only, avoid “shampoo” → hyaluronic. */
      if (key.length <= 2) return false;
      if (key.indexOf(" ") >= 0) return raw.indexOf(key) >= 0;
      if (key.length >= 4 && hayHasTerm(raw, key)) return true;
      if (key.indexOf(raw) === 0 && raw.length >= 4) return true;
      return false;
    }
    PRODUCT_SEARCH_GROUPS.forEach(function (g) {
      var hit = false;
      for (var i = 0; i < g.keys.length; i++) {
        if (hitsKey(g.keys[i])) { hit = true; break; }
      }
      if (!hit) return;
      /* Drop the typed key only when it is not also a real term
         (so “energy” stays tight, but “sport” / “memory” still match). */
      if (g.excludeKey && (g.keys || []).indexOf(raw) >= 0 && (g.terms || []).indexOf(raw) < 0) {
        dropRaw = true;
      }
      (g.terms || []).forEach(add);
    });
    if (dropRaw) {
      out = out.filter(function (t) { return t !== raw; });
      if (!out.length) out.push(raw);
    }
    return out;
  }

  function productMatchesQuery(p, q) {
    var raw = ((q || "") + "").trim().toLowerCase();
    if (!raw) return true;
    var hay = productSearchHaystack(p);
    var expanded = expandProductSearchTerms(raw);
    for (var i = 0; i < expanded.length; i++) {
      if (hayHasTerm(hay, expanded[i])) return true;
    }
    /* Multi-word: every token must match (literal or via aliases). */
    var tokens = raw.split(/\s+/).filter(function (t) { return t.length > 1; });
    if (tokens.length > 1) {
      return tokens.every(function (tok) {
        if (hayHasTerm(hay, tok)) return true;
        return expandProductSearchTerms(tok).some(function (t) {
          return hayHasTerm(hay, t);
        });
      });
    }
    return false;
  }

  function normalizeProductSearchText(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Name matches beat “mentioned in application copy” — so “hydro serum”
     ranks FRESH hydro serum above ADDS boosters that only mix with it. */
  function productSearchScore(p, q) {
    var raw = normalizeProductSearchText(q);
    if (!raw || !p) return 0;
    var name = normalizeProductSearchText(p.name);
    var nameCompact = name.replace(/\s/g, "");
    var rawCompact = raw.replace(/\s/g, "");
    var score = 0;
    if (name === raw || nameCompact === rawCompact) score += 1000;
    if (name.indexOf(raw) >= 0) score += 500;
    else if (rawCompact.length >= 4 && nameCompact.indexOf(rawCompact) >= 0) score += 420;
    if (name.length >= raw.length && name.slice(-raw.length) === raw) score += 180;
    var tokens = raw.split(" ").filter(function (t) { return t.length > 1; });
    if (tokens.length) {
      var inName = 0;
      for (var i = 0; i < tokens.length; i++) {
        if (name.indexOf(tokens[i]) >= 0) inName++;
      }
      if (inName === tokens.length) score += 280;
      score += inName * 35;
    }
    var tagline = normalizeProductSearchText(p.tagline);
    var heroes = normalizeProductSearchText(p.heroIngredients);
    if (tagline.indexOf(raw) >= 0 || (rawCompact.length >= 4 && tagline.replace(/\s/g, "").indexOf(rawCompact) >= 0)) {
      score += 70;
    }
    if (heroes.indexOf(raw) >= 0 || (rawCompact.length >= 4 && heroes.replace(/\s/g, "").indexOf(rawCompact) >= 0)) {
      score += 55;
    }
    var hay = productSearchHaystack(p);
    if (hayHasTerm(hay, raw)) score += 8;
    else {
      var expanded = expandProductSearchTerms(raw);
      for (var e = 0; e < expanded.length; e++) {
        if (hayHasTerm(hay, expanded[e])) { score += 4; break; }
      }
    }
    return score;
  }

  function productsMatchingQuery(q, limit) {
    var raw = ((q || "") + "").trim();
    if (!raw) return [];
    var hits = visibleProducts().filter(function (p) {
      return productMatchesQuery(p, raw);
    });
    hits.sort(function (a, b) {
      var diff = productSearchScore(b, raw) - productSearchScore(a, raw);
      if (diff) return diff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    if (limit && hits.length > limit) return hits.slice(0, limit);
    return hits;
  }

  function productRecordById(id) {
    if (!id) return null;
    var list = productLib().products || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function productById(id) {
    var rec = productRecordById(id);
    if (!rec || isHiddenLibraryProduct(rec)) return null;
    return rec;
  }

  function categoryById(id) {
    var cats = productLib().categories || [];
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i];
    return null;
  }

  function productAlsoIn(p) {
    return (p && Array.isArray(p.alsoIn)) ? p.alsoIn : [];
  }

  function productInCategory(p, catId) {
    if (!p || !catId) return false;
    if (p.category === catId) return true;
    return productAlsoIn(p).some(function (a) { return a && a.category === catId; });
  }

  function productInSubcategory(p, catId, subId) {
    if (!subId) return productInCategory(p, catId);
    if (p.category === catId && p.subcategory === subId) return true;
    return productAlsoIn(p).some(function (a) { return a && a.category === catId && a.subcategory === subId; });
  }

  function categorySubs(cat) {
    if (!cat || !cat.subs) return [];
    var products = visibleProducts();
    return cat.subs.filter(function (s) {
      if (isHiddenSunSub(s.id)) return false;
      for (var i = 0; i < products.length; i++) {
        if (productInSubcategory(products[i], cat.id, s.id)) return true;
      }
      return false;
    });
  }

  function cleanProdSquares(text) {
    return String(text || "")
      .replace(/[\u25A0\u25A1\u25AA\u25AB\u25FC\u25FB\u25FE\u25FD\u25A0]/g, "")
      .replace(/■/g, "")
      .replace(/(\d)[\s\u00a0\u202f\u2009\u200a]+%/g, "$1%")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/ {2,}/g, " ")
      .trim();
  }

  function cleanForWhoList(list) {
    return (list || []).map(function (s) {
      return cleanProdSquares(s);
    }).filter(function (t) {
      if (!t) return false;
      /* Drop invented / inferred audience tags — keep Ringana site categories only */
      if (/per product story|per product copy/i.test(t)) return false;
      return true;
    }).map(function (t) {
      return t
        .replace(/\s*\((site category|site tag)\)\s*/gi, "")
        .replace(/sensitive\s*\/\s*reddened\s*skin/gi, "Sensitive skin")
        .replace(/sensitive,?\s*reddened\s*skin/gi, "Sensitive skin")
        .trim();
    }).filter(Boolean);
  }

  function forWhoDisplayList(list) {
    var out = [];
    var seen = {};
    cleanForWhoList(list).forEach(function (c) {
      if (/pregnancy|breastfeed/i.test(c)) return;
      var label = shortenForWhoChip(c) || c;
      if (!label || /pregnancy|breastfeed/i.test(label)) return;
      var key = label.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push(label);
    });
    return out;
  }

  /* Short, useful chips under the product blurb — never pregnancy/breastfeeding. */
  function shortenForWhoChip(raw) {
    var t = (raw || "").trim();
    if (!t) return "";
    if (/pregnancy|breastfeed/i.test(t)) return "";
    var map = [
      [/food supplement\s*[—\-].*adults.*/i, "Adults · food supplement"],
      [/beauty-from-within.*/i, "Beauty from within"],
      [/gut\s*\/\s*digestive.*/i, "Gut wellness"],
      [/omega-3.*/i, "Omega-3 support"],
      [/mood\s*\/\s*mental.*/i, "Mood & focus"],
      [/immune-season.*/i, "Immune support"],
      [/sport\s*\/\s*energy.*/i, "Sport & energy"],
      [/training\s*\/\s*performance.*/i, "Training & performance"],
      [/hands needing.*/i, "Hands"],
      [/feet or legs.*/i, "Feet & legs"],
      [/body skin needing.*/i, "Body moisture"],
      [/fresh baby line.*/i, "Baby care"],
      [/developed with baby.*/i, "For little ones"],
      [/fresh hair care.*/i, "Hair care"],
      [/damaged, dyed, or dry hair/i, "Damaged / dry hair"],
      [/fine hair looking for volume/i, "Fine hair · volume"],
      [/intensive hair treatment.*/i, "Hair treatment"],
      [/sensitive\s*\/\s*reddened.*/i, "Sensitive skin"],
      [/sensitive,?\s*reddened.*/i, "Sensitive skin"],
      [/impure skin/i, "Blemish-prone"],
      [/combination skin/i, "Combination"],
      [/oily skin/i, "Oily"],
      [/dry skin/i, "Dry"],
      [/mature skin/i, "Mature"],
      [/normal skin/i, "Normal"],
      [/all skin types/i, "All skin types"],
      [/men.?s face care/i, "Men’s face care"],
      [/daily underarm care/i, "Daily deodorant"],
      [/diaper-area care/i, "Diaper area"],
      [/sun\s*\/\s*environmental.*/i, "Environmental support"],
      [/beauty &\s*hair from within/i, "Beauty & hair within"],
      [/\s+interest$/i, ""]
    ];
    for (var i = 0; i < map.length; i++) {
      if (map[i][0].test(t)) {
        if (map[i][1] === "") return t.replace(map[i][0], "").trim();
        return map[i][1];
      }
    }
    return t.replace(/\s+interest$/i, "").trim();
  }

  function productHeroChips(p) {
    var out = [];
    var seen = {};
    function add(label) {
      label = (label || "").trim();
      if (!label || /pregnancy|breastfeed/i.test(label)) return;
      var key = label.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push(label);
    }
    cleanForWhoList(p && p.forWho).forEach(function (c) {
      add(shortenForWhoChip(c));
    });
    /* Fill gaps with clear product-type chips from the catalog */
    if (out.length < 3 && p.step) add(p.step);
    if (out.length < 3) {
      var sub = ((p.subcategory || "") + "").toLowerCase();
      var subLabel = {
        cleansers: "Cleansing",
        toners: "Toning",
        serums: "Serums",
        creams: "Creams",
        "eye-care": "Eye care",
        "masks-exfoliants": "Masks & exfoliants",
        boosters: "ADDS boosters",
        treatments: "Treatments",
        "lip-care": "Lip care",
        "body-milk": "Body milk",
        deodorant: "Deodorant",
        scrubs: "Scrubs",
        sun: "After-sun",
        wash: "Body wash",
        hands: "Hand care",
        "feet-legs": "Feet & legs",
        soap: "Soap",
        oil: "Body oil",
        caps: "CAPS",
        drinks: "Drinks",
        packs: "PACKS",
        sport: "SPORT",
        beyond: "BEYOND"
      };
      if (subLabel[sub]) add(subLabel[sub]);
    }
    if (out.length < 2) {
      var catLabel = {
        skincare: "Face care",
        body: "Body care",
        hair: "Hair care",
        baby: "Baby care",
        supplements: "Supplements"
      };
      if (catLabel[p.category]) add(catLabel[p.category]);
    }
    if (hasPocketSize(p)) add("Pocket size");
    if (hasGoldenGlowOption(p)) add("Golden glow option");
    if (hasTanTintOption(p)) add("Tan option");
    return out.slice(0, 5);
  }

  function productOriginInfo(p) {
    var note = String((p && p.ingredientsNote) || "");
    var badges = ((p && p.badges) || []).join(" ");
    var blob = (badges + " " + note).toLowerCase();
    var seal = "";
    if (/\bcosmos organic\b/.test(blob)) seal = "organic";
    else if (/\bcosmos natural\b/.test(blob)) seal = "natural";
    var orgM = note.match(/(\d+(?:[.,]\d+)?)\s*%\s+of the total ingredients are from organic farming/i);
    var natM = note.match(/(\d+(?:[.,]\d+)?)\s*%\s+natural origin of total/i) ||
      note.match(/(\d+(?:[.,]\d+)?)\s*%\s+of the total ingredients are from natural origin/i);
    return {
      seal: seal,
      organicPct: orgM ? String(orgM[1]).replace(",", ".") : "",
      naturalPct: natM ? String(natM[1]).replace(",", ".") : "",
      hasOrganicFarming: /\*\s*Ingredients from organic farming/i.test(note) || !!orgM
    };
  }

  function originShareLine(info) {
    var bits = [];
    if (info && info.organicPct) bits.push(info.organicPct + "% of the ingredients are from organic farming");
    if (info && info.naturalPct) bits.push(info.naturalPct + "% natural origin of the total");
    if (!bits.length) return "";
    return "This label lists " + bits.join(", and ") + ".";
  }

  function originExplainCopy(kind, info) {
    var share = originShareLine(info);
    if (kind === "organic") {
      return {
        title: "COSMOS Organic",
        body: "This product is certified COSMOS Organic. That’s a European cosmetics seal on the whole formula — not a few plants on the ingredient list.\n\nIt looks at organic share, natural origin, how it’s processed, and what can’t go in. Ecocert is the certifier on Ringana labels.\n\nDon’t mix it up with COSMOS Natural (also a real seal, different bar) or with “organic ingredients.” A formula can use plants from organic farming without this badge.\n\nIf someone asks “is it USDA Organic?” The USDA Organic seal is meant for food and farms — it wasn’t created for personal care products. This one is certified COSMOS Organic, the European cosmetics standard."
      };
    }
    if (kind === "natural") {
      return {
        title: "COSMOS Natural",
        body: "This product is certified COSMOS Natural. That’s a European cosmetics seal on the whole formula — certified natural, not organic.\n\nSame COSMOS system as the organic seal, different bar. It still looks at the whole recipe: natural origin, how it’s processed, and what can’t go in.\n\nDon’t mix it up with COSMOS Organic, or with “organic / natural ingredients” that never got a seal.\n\nIf someone asks “is it USDA Organic?” The USDA Organic seal is meant for food and farms — it wasn’t created for personal care products. This one is certified COSMOS Natural, the European cosmetics standard."
      };
    }
    return {
      title: "Organic ingredients",
      body: "Some of the ingredients in this formula come from organic farming — that’s the * next to a plant on the ingredient list.\n\nCOSMOS Organic and COSMOS Natural are different. Those are seals on the whole finished product, not a star on a few plants. This formula uses organic ingredients; it isn’t carrying that badge.\n\nIf someone asks, say it uses organic ingredients. Don’t say it’s COSMOS certified. Open the ingredient list if they want the details." +
        (share ? "\n\n" + share : "")
    };
  }

  function openProductOriginInfo(kind) {
    var browse = ensureProductBrowse();
    var p = productById(browse && browse.productId);
    var copy = originExplainCopy(kind, productOriginInfo(p));
    if (window.FS.UI && window.FS.UI.say) {
      window.FS.UI.say(copy.body, { title: copy.title, okText: "Got it" });
    }
  }

  function realNotForList(list) {
    return (list || []).map(function (s) { return cleanProdSquares(s); }).filter(function (t) {
      if (!t) return false;
      if (/no discrete|not listed on the public|check full INCI|who it.?s not for.? section/i.test(t)) return false;
      return true;
    });
  }

  function splitIngredientsDump(raw) {
    var t = cleanProdSquares(raw);
    var out = { ingredients: "", usageExtra: "", important: "", nutrition: "" };
    if (!t) return out;

    var impParts = t.split(/\bIMPORTANT INFORMATION\b/i);
    if (impParts.length > 1) {
      out.important = impParts.slice(1).join(" ").replace(/^[:\s]+/, "").trim();
      t = impParts[0].trim();
    }

    var recParts = t.split(/\bRECOMMENDED CONSUMPTION\b/i);
    if (recParts.length > 1) {
      out.usageExtra = recParts.slice(1).join(" ").replace(/^[:\s]+/, "").trim();
      t = recParts[0].trim();
    }

    var nutrParts = t.split(/\bNUTRITIONAL INFORMATION\b/i);
    if (nutrParts.length > 1) {
      out.nutrition = nutrParts.slice(1).join("\n").replace(/^[:\s]+/, "").trim();
      t = nutrParts[0].trim();
    }

    var ingIdx = t.search(/\bINGREDIENTS\b\s*:?/i);
    if (ingIdx >= 0) {
      t = t.slice(ingIdx).replace(/^INGREDIENTS\b\s*:?\s*/i, "").trim();
    } else {
      t = t.replace(/^INGREDIENTS\b\s*:?\s*/i, "").trim();
    }

    /* Drop packaging disclaimer that often trails the INCI list */
    t = t.replace(/\n?\s*A product[\u2019']s ingredients may change[\s\S]*$/i, "").trim();

    out.ingredients = t;
    return out;
  }

  function nutritionCellLines(html) {
    return String(html || "")
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&thinsp;|&#8201;|&ensp;|&emsp;/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split(/\n/)
      .map(function (s) { return tidyNutritionText(s); })
      .filter(Boolean);
  }

  function tidyNutritionText(s) {
    s = String(s || "").replace(/[\u00a0\u2000-\u200b\u202f\u205f\u3000]/g, " ").replace(/\s+/g, " ").trim();
    s = s.replace(/\bVitamine\b/g, "Vitamins");
    s = s.replace(/\bof which saturate\b/i, "of which saturates");
    s = s.replace(/\bL-Theanin aus Grüntee\b/g, "L-theanine from green tea");
    s = s.replace(/\bper per\b/gi, "per");
    s = s.replace(/\bpro 100 g\b/gi, "per 100 g");
    s = s.replace(/\bsprouted buckwheatpowder\b/g, "sprouted buckwheat powder");
    s = s.replace(/\bTocopherole and Tocotrienole\b/g, "tocopherols and tocotrienols");
    s = s.replace(/\bflavanoids\b/g, "flavonoids");
    s = s.replace(/(\d),(\d{1,2})(?=\s*(?:mg|µg|μg|g|kcal|kJ|ml|bn)\b)/g, "$1.$2");
    s = s.replace(/(\d)(mg|µg|μg|kJ|kcal)\b/g, "$1 $2");
    return s;
  }

  function nutritionIsDash(s) {
    return !s || /^[-–—]$/.test(s);
  }

  function nutritionIsSection(name) {
    return /^(vitamins?|minerals?|vitamins and minerals|other ingredients?|amino acid profile)$/i.test(String(name || "").replace(/:$/, ""));
  }

  function nutritionIsSub(name) {
    return /^(of which\b|contains\b|containing\b|from\b)/i.test(String(name || "").replace(/^[^A-Za-z]+/, ""));
  }

  function nutritionHeaderKind(text) {
    var t = String(text || "").replace(/\s+/g, " ").trim();
    if (!t) return "empty";
    if (/%/.test(t) && /nrv/i.test(t)) return /2\s*sachet/i.test(t) ? "nrv2" : "nrv";
    if (/per\s*100|pro\s*100/i.test(t)) return "per100";
    if (/2\s*sachet/i.test(t)) return "two";
    if (/1\s*sachet|per\s*sachet|per\s*50\s*g|per\s*rda|per\s*nrv|30\s*ml/i.test(t)) return "amount";
    if (/^rda\b/i.test(t) && /recommended/i.test(t)) return "label";
    return "other";
  }

  function nutritionAmountLabel(text) {
    var t = String(text || "").replace(/\s+/g, " ");
    if (/1\s*sachet|per\s*50\s*g|per\s*sachet/i.test(t)) return "1 sachet";
    if (/30\s*ml/i.test(t)) return "30 ml";
    return "Per serving";
  }

  function classifyNutritionCols(cells) {
    var kinds = cells.map(function (c) { return nutritionHeaderKind(nutritionCellLines(c).join(" ")); });
    var amount = -1;
    var nrv = -1;
    var nrvForTwo = false;
    kinds.forEach(function (k, i) {
      if (i === 0) return;
      if (k === "amount" && amount < 0) amount = i;
      if (k === "nrv" || k === "nrv2") {
        nrv = i;
        nrvForTwo = k === "nrv2";
      }
    });
    if (amount < 0) {
      for (var i = 1; i < kinds.length; i++) {
        if (kinds[i] !== "nrv" && kinds[i] !== "nrv2" && kinds[i] !== "per100" && kinds[i] !== "two" && kinds[i] !== "empty") {
          amount = i;
          break;
        }
      }
    }
    if (amount < 0 && cells.length > 1) amount = 1;
    return { amount: amount, nrv: nrv, nrvForTwo: nrvForTwo, label: nutritionAmountLabel(cells[amount] || "") };
  }

  function formatNutritionEnergy(amountLines) {
    var bits = (amountLines || []).filter(function (s) { return s && !nutritionIsDash(s); });
    if (bits.length === 2 && /kJ/i.test(bits[0]) && /kcal/i.test(bits[1])) return bits[1] + " · " + bits[0];
    return bits.join(" · ");
  }

  function halfNutritionNrv(val) {
    if (nutritionIsDash(val)) return "";
    var n = parseFloat(String(val).replace(",", "."));
    if (!isFinite(n)) return val;
    return String(Math.round((n / 2) * 10) / 10).replace(/\.0$/, "");
  }

  function parseNutritionRows(html) {
    var rows = [];
    var re = /<tr[\s\S]*?<\/tr>/gi;
    var m;
    while ((m = re.exec(html))) {
      var cells = [];
      var cre = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
      var c;
      while ((c = cre.exec(m[0]))) cells.push(c[1]);
      if (cells.length) rows.push(cells);
    }
    return rows;
  }

  function canZipNutrition(names, amounts, nrvs) {
    if (names.length < 2) return false;
    if (amounts.length === names.length || nrvs.length === names.length) return true;
    if (amounts.length === names.length - 1 && nutritionIsSub(names[names.length - 1])) return true;
    if (nrvs.length === names.length - 1 && nutritionIsSub(names[names.length - 1])) return true;
    return false;
  }

  function simplifyNutritionHtml(html) {
    var tables = String(html || "").match(/<table\b[\s\S]*?<\/table>/gi) || [];
    if (!tables.length) return { html: "", label: "Per serving" };
    var out = [];
    var label = "Per serving";
    tables.forEach(function (table) {
      var rows = parseNutritionRows(table);
      if (!rows.length) return;
      var cols = classifyNutritionCols(rows[0]);
      if (cols.label) label = cols.label;
      var body = [];
      rows.forEach(function (cells, ri) {
        var kinds = cells.map(function (c) { return nutritionHeaderKind(nutritionCellLines(c).join(" ")); });
        var looksHeader = ri === 0 || kinds.slice(1).some(function (k) {
          return k === "amount" || k === "nrv" || k === "nrv2" || k === "per100" || k === "two";
        });
        if (looksHeader && cells.length > 1) {
          var next = classifyNutritionCols(cells);
          if (next.amount >= 0) {
            cols = next;
            if (next.label) label = next.label;
          }
          var title = nutritionCellLines(cells[0]).join(" ");
          if (title && nutritionIsSection(title)) body.push({ section: title });
          return;
        }

        var nameLines = nutritionCellLines(cells[0]);
        var amountIdx = cols.amount;
        var nrvIdx = cols.nrv;
        if (amountIdx >= 0 && nutritionIsDash(nutritionCellLines(cells[amountIdx] || "").join("")) && cells[amountIdx + 1]) {
          var alt = nutritionCellLines(cells[amountIdx + 1]);
          if (alt.some(function (s) { return s && !nutritionIsDash(s); })) amountIdx += 1;
        }
        var amountLines = amountIdx >= 0 ? nutritionCellLines(cells[amountIdx] || "") : [];
        var nrvLines = nrvIdx >= 0 ? nutritionCellLines(cells[nrvIdx] || "") : [];
        var name0 = nameLines[0] || "";
        if (/^rda\s*=/i.test(name0) || /^nutritional information$/i.test(name0)) {
          if (nameLines.length <= 1) return;
        }
        if (nameLines.length <= 1 && nutritionIsSection(name0) && amountLines.every(nutritionIsDash) && nrvLines.every(nutritionIsDash)) {
          body.push({ section: name0 });
          return;
        }
        if (nameLines.length === 1 && /^energy$/i.test(name0)) {
          body.push({ name: name0, amount: formatNutritionEnergy(amountLines), nrv: "", sub: false });
          return;
        }

        function pushRow(name, amount, nrv, sub) {
          if (!name) return;
          body.push({
            name: name,
            amount: amount || "",
            nrv: nrv || "",
            sub: !!sub,
            nrvForTwo: cols.nrvForTwo
          });
        }

        if (canZipNutrition(nameLines, amountLines, nrvLines)) {
          for (var zi = 0; zi < nameLines.length; zi++) {
            pushRow(nameLines[zi], amountLines[zi] || "", nrvLines[zi] || "", nutritionIsSub(nameLines[zi]));
          }
          return;
        }

        var parent = [];
        var subs = [];
        nameLines.forEach(function (n) {
          if (!n) return;
          if (nutritionIsSub(n) && parent.length) { subs.push(n); return; }
          if (subs.length && /^[a-z(]/.test(n)) { subs[subs.length - 1] += " " + n; return; }
          if (parent.length && /^[a-z(]/.test(n)) { parent[parent.length - 1] += " " + n; return; }
          parent.push(n);
        });
        var parentName = parent.join(" ").replace(/,\s*,/g, ",").replace(/,\s+$/g, "");
        var parentAmount = amountLines.filter(function (s) { return s && !nutritionIsDash(s); }).join(" · ");
        var parentNrv = "";
        if (nrvLines.length === 1 && !nutritionIsDash(nrvLines[0])) parentNrv = nrvLines[0];
        pushRow(parentName, parentAmount, parentNrv, false);
        subs.forEach(function (n) { pushRow(n, "", "", true); });
      });

      var htmlOut = "<table><thead><tr><th>Nutrient</th><th>" + esc(cols.label || label) + "</th><th>% NRV</th></tr></thead><tbody>";
      body.forEach(function (row) {
        if (row.section) {
          htmlOut += '<tr class="prod-nutrition-sec"><td colspan="3">' + esc(row.section) + "</td></tr>";
          return;
        }
        if (!row.name) return;
        var nrv = row.nrv;
        if (row.nrvForTwo) nrv = halfNutritionNrv(nrv);
        if (nutritionIsDash(nrv)) nrv = "";
        var amount = row.amount;
        if (nutritionIsDash(amount)) amount = "";
        htmlOut += "<tr" + (row.sub ? ' class="prod-nutrition-sub"' : "") + "><td>" +
          esc(row.name) + "</td><td>" + esc(amount) + "</td><td>" + esc(nrv) + "</td></tr>";
      });
      htmlOut += "</tbody></table>";
      out.push(htmlOut);
    });
    return { html: out.join(""), label: label };
  }

  function nutritionCaption(p, label) {
    if (p && p.id === "sport-endurance") return "One sachet is one drink. Daily allowance is up to 2 sachets.";
    if (label === "1 sachet") return "Per 1 sachet.";
    if (label === "30 ml") return "Per 30 ml bottle.";
    return "Per recommended daily serving.";
  }

  function nutritionTableHtml(p) {
    var html = String((p && p.nutritionHtml) || "").trim();
    if (!html) return "";
    if (!/^<table[\s>]/i.test(html) || /<script|<iframe|javascript:/i.test(html)) return "";
    var cleaned = simplifyNutritionHtml(html);
    if (!cleaned.html) return "";
    var notes = String((p && p.nutritionNotes) || "").replace(/\bper per\b/gi, "per").trim();
    return '<div class="prod-nutrition-wrap">' +
      '<p class="prod-nutrition-caption">' + esc(nutritionCaption(p, cleaned.label)) + "</p>" +
      cleaned.html + "</div>" +
      (notes ? '<p class="prod-nutrition-notes">' + esc(notes) + "</p>" : "");
  }

  function nutritionFallbackHtml(text) {
    var t = String(text || "").trim();
    if (!t) return "";
    return "<p>" + esc(t) + "</p>";
  }

  function prodAcc(title, bodyHtml, open) {
    if (!bodyHtml) return "";
    return '<details class="prod-acc"' + (open ? " open" : "") + ">" +
      "<summary>" + esc(title) + "</summary>" +
      '<div class="prod-acc-body">' + bodyHtml + "</div></details>";
  }

  function productPhotoCirclesHtml(images) {
    var Cal = window.FS.Calendar;
    if (!Cal || !Cal.resolveCuriosityImage) return "";
    var html = '<div class="curio-photo-circles prod-photo-circles" role="list">';
    (images || []).forEach(function (it) {
      var resolved = Cal.resolveCuriosityImage(it.id);
      if (!resolved) return;
      html += '<button type="button" class="curio-photo-circle" role="listitem" data-curio-open="' + esc(it.id) + '" aria-label="Open ' + esc(it.title || "photo") + '">';
      html += '<span class="curio-photo-circle-img-wrap">';
      html += '<img src="' + esc(resolved.thumb) + '" alt="" loading="lazy" decoding="async" width="120" height="120">';
      html += "</span>";
      html += '<span class="curio-photo-circle-label">' + esc(it.title || "") + "</span>";
      html += "</button>";
    });
    html += "</div>";
    return html;
  }

  function productsInScope(browse) {
    var list = visibleProducts();
    var q = ((browse && browse.q) || "").trim().toLowerCase();
    var favOnly = browse && browse.scope === "favorites";
    var filtered = list.filter(function (p) {
      if (favOnly && !isProductFavorite(p.id)) return false;
      if (!favOnly) {
        if (browse.category && !productInCategory(p, browse.category)) return false;
        if (browse.subcategory && !productInSubcategory(p, browse.category, browse.subcategory)) return false;
        if (browse.subcategory && isHiddenSunSub(browse.subcategory)) return false;
      }
      if (!q) return true;
      return productMatchesQuery(p, q);
    });
    if (!q) return filtered;
    return filtered.slice().sort(function (a, b) {
      var diff = productSearchScore(b, q) - productSearchScore(a, q);
      if (diff) return diff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  var PRODUCT_IMAGE_ALIASES = {
    "fresh-lip-balm-nude-spf-15": "fresh-lip-balm-classic",
    "fresh-tinted-moisturiser-spf-30-n1": "fresh-tinted-moisturiser",
    "fresh-tinted-moisturiser-spf-30-n2": "fresh-tinted-moisturiser",
    "fresh-tinted-moisturiser-spf-30-n3": "fresh-tinted-moisturiser",
    "fresh-tinted-moisturiser-spf-30-n4": "fresh-tinted-moisturiser",
    "fresh-tinted-moisturiser-tan": "fresh-tinted-moisturiser",
    "fresh-toner-calm-pocket": "fresh-toner-calm",
    "fresh-after-sun-tan-booster-golden-glow": "fresh-after-sun-tan-booster",
    "fresh-deodorant-pocket": "fresh-deodorant",
    "fresh-hand-balm-pocket": "fresh-hand-balm"
  };

  function productImageUrl(id) {
    var map = window.FS.PRODUCT_IMAGES || {};
    if (map[id]) return map[id];
    var alias = PRODUCT_IMAGE_ALIASES[id];
    return (alias && map[alias]) || "";
  }

  function productThumbHtml(id, cls) {
    var src = productImageUrl(id);
    if (!src) return '<span class="prod-thumb prod-thumb-empty' + (cls ? " " + cls : "") + '" aria-hidden="true"></span>';
    return '<img class="prod-thumb' + (cls ? " " + cls : "") + '" src="' + esc(src) + '" alt="" width="56" height="56" loading="lazy" decoding="async">';
  }

  function parseHeroIngredients(raw) {
    var text = cleanProdSquares(raw || "").trim();
    if (!text) return [];
    // Source pages often wrap a joining "and" onto its own line. Collapse that
    // so "almond oil / and / sesame oil" stays one hero, not three bullets.
    text = text.replace(/[ \t]*\nand[ \t]*\n\s*\n+/g, " and ");
    text = text.replace(/[ \t]+and[ \t]*\n\s*\n+/g, " and ");
    var blocks = text.split(/\n\s*\n+/);
    var items = [];
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i].trim();
      if (!block || block === ".") continue;
      var nl = block.indexOf("\n");
      if (nl > 0 && nl < 100) {
        var name = block.slice(0, nl).trim();
        var blurb = block.slice(nl + 1).trim();
        if (!name && !blurb) continue;
        if (name === ".") continue;
        items.push({ name: name, blurb: blurb });
      } else {
        items.push({ name: "", blurb: block });
      }
    }
    return items;
  }

  function heroIngredientsHtml(raw) {
    var items = parseHeroIngredients(raw);
    if (!items.length) return "";
    var html = '<ul class="prod-hero-list">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      html += "<li>";
      if (it.name) html += "<strong>" + esc(it.name) + "</strong>";
      if (it.blurb) html += (it.name ? " " : "") + "<span>" + esc(it.blurb) + "</span>";
      html += "</li>";
    }
    html += "</ul>";
    return html;
  }

  function productCardHero(p) {
    var items = parseHeroIngredients(p.heroIngredients || "");
    if (!items.length) return "";
    var names = [];
    for (var i = 0; i < items.length && names.length < 3; i++) {
      if (items[i].name) names.push(items[i].name);
      else if (items[i].blurb) {
        var short = items[i].blurb;
        if (short.length > 70) short = short.slice(0, 67).replace(/\s+\S*$/, "") + "…";
        names.push(short);
      }
    }
    if (!names.length) return "";
    var line = names.join(" · ");
    if (line.length > 110) line = line.slice(0, 107).replace(/\s+\S*$/, "") + "…";
    return line;
  }

  function renderProductListRows(items) {
    if (!items.length) {
      var browse = ensureProductBrowse();
      if (browse.scope === "favorites" && !browse.q && favoriteCount() < 1) {
        return '<p class="prod-empty">No favorites yet. Browse All and tap the heart on products you’re looking forward to.</p>';
      }
      if (browse.q) {
        return '<p class="prod-empty">No products match that search in this view. Try another word, or clear search.</p>';
      }
      if (browse.scope === "favorites") {
        return '<p class="prod-empty">No favorites match that search. Clear search or heart a few more in All.</p>';
      }
      return '<p class="prod-empty">No products match that search in this view. Try another word, or clear search.</p>';
    }
    return '<div class="prod-list">' + items.map(function (p) {
      var hero = productCardHero(p);
      var pocket = hasPocketSize(p);
      var glow = hasGoldenGlowOption(p);
      var tan = hasTanTintOption(p);
      return '<div class="prod-row">' +
        productThumbHtml(p.id, "prod-thumb-row") +
        '<button type="button" class="prod-row-open" data-prod-open="' + esc(p.id) + '">' +
        '<span class="prod-row-name">' + esc(p.name) + "</span>" +
        (pocket ? '<span class="prod-row-pocket">Pocket size available</span>' : "") +
        (glow ? '<span class="prod-row-pocket">Golden glow option</span>' : "") +
        (tan ? '<span class="prod-row-pocket">Tan option</span>' : "") +
        (hero ? '<span class="prod-row-hero"><em>Heroes</em> ' + esc(hero) + "</span>" : "") +
        "</button>" +
        favHeartBtn(p.id, "prod-fav-row") +
        "</div>";
    }).join("") + "</div>";
  }

  function renderProductDetail(p) {
    var cat = categoryById(p.category);
    var forWho = forWhoDisplayList(p.forWho);
    var notFor = realNotForList(p.notFor);
    var ing = splitIngredientsDump(p.ingredientsNote);
    var howTo = cleanProdSquares(p.application || "");
    if (ing.usageExtra) {
      howTo = howTo ? (howTo + "\n\n" + ing.usageExtra) : ing.usageExtra;
    }
    var claims = (p.claims || []).map(function (c) { return cleanProdSquares(c); }).filter(Boolean);
    var topClaim = claims.length ? claims[0] : "";
    var img = productImageUrl(p.id);
    var pocket = hasPocketSize(p);
    var glow = hasGoldenGlowOption(p);
    var tan = hasTanTintOption(p);

    var browse = ensureProductBrowse();
    var fromFavorites = browse.scope === "favorites";
    var returnTo = browse.returnTo && browse.returnTo.panel ? browse.returnTo : null;
    /* Ingredient back-nav only when still in the ingredient flow — not when Learn/shortlist set returnTo */
    var fromIngredient = !returnTo && browse.mode === "ingredients" && !!browse.ingredientId;
    var backCatId = (browse.category && productInCategory(p, browse.category)) ? browse.category : p.category;
    var backCat = categoryById(backCatId) || cat;
    var kickerStep = p.step;
    if (browse.category && browse.category !== p.category) {
      var alsoHere = productAlsoIn(p).filter(function (a) { return a && a.category === browse.category; })[0];
      if (alsoHere && alsoHere.subcategory) {
        var homeCat = categoryById(alsoHere.category);
        var homeSubs = (homeCat && homeCat.subs) || [];
        for (var si = 0; si < homeSubs.length; si++) {
          if (homeSubs[si].id === alsoHere.subcategory) {
            kickerStep = homeSubs[si].label;
            break;
          }
        }
      }
    }
    var html = "";
    html += '<div class="prod-nav-bar">';
    if (fromIngredient) {
      var backIng = ingredientById(browse.ingredientId);
      html += '<button type="button" class="prod-pill on" data-ing-nav="ingredient" data-ing-open="' + esc(browse.ingredientId) + '">← ' +
        esc(backIng ? backIng.inciName : "Ingredient") + "</button>";
      html += '<button type="button" class="prod-pill" data-prod-mode="ingredients">Ingredient guide</button>';
    } else if (returnTo) {
      html += '<button type="button" class="prod-pill on" data-prod-nav="return">← ' + esc(returnTo.label || "Back") + "</button>";
      html += '<button type="button" class="prod-pill" data-prod-nav="hub">All products</button>';
    } else if (fromFavorites) {
      html += '<button type="button" class="prod-pill on" data-prod-nav="favorites">← Favorites</button>';
      html += '<button type="button" class="prod-pill" data-prod-nav="hub">All products</button>';
    } else {
      html += (backCat
        ? '<button type="button" class="prod-pill on" data-prod-nav="cat" data-prod-cat="' + esc(backCatId) + '">← ' + esc(backCat.label) + "</button>"
        : "") +
        '<button type="button" class="prod-pill" data-prod-nav="hub">All products</button>';
    }
    html += favHeartBtn(p.id, "prod-fav-detail") + "</div>";

    html += '<article class="prod-detail-hero">';
    html += '<div class="prod-detail-top">';
    if (img) {
      html += '<img class="prod-thumb prod-thumb-detail" src="' + esc(img) + '" alt="" width="112" height="112" loading="eager" decoding="async">';
    } else {
      html += '<span class="prod-thumb prod-thumb-empty prod-thumb-detail" aria-hidden="true"></span>';
    }
    html += '<div class="prod-detail-top-copy">';
    html += '<div class="prod-detail-kicker">' + esc((backCat ? backCat.label : "") + (kickerStep ? " · " + kickerStep : "")) + "</div>";
    html += '<h1 class="prod-detail-title">' + esc(p.name) + "</h1>";
    if (p.tagline) html += '<p class="prod-detail-tagline">' + esc(p.tagline) + "</p>";
    var origin = productOriginInfo(p);
    if (origin.seal === "organic") {
      html += '<button type="button" class="prod-detail-pocket prod-detail-seal" data-origin-info="organic" aria-haspopup="dialog">COSMOS Organic</button>';
    } else if (origin.seal === "natural") {
      html += '<button type="button" class="prod-detail-pocket prod-detail-seal" data-origin-info="natural" aria-haspopup="dialog">COSMOS Natural</button>';
    }
    if (pocket) {
      html += '<span class="prod-detail-pocket">Pocket size available</span>';
    }
    if (glow) {
      html += '<span class="prod-detail-pocket">Golden glow option</span>';
    }
    if (tan) {
      html += '<span class="prod-detail-pocket">Tan option</span>';
    }
    html += "</div></div>";
    if (glow) {
      html += '<p class="prod-detail-variant-note">Same after-sun care with a <strong>Golden glow</strong> option — erythrulose plus red algae for a subtle self-tan, with a soft golden shimmer from mineral pearl pigments. Packaging looks the same; pick golden glow when you want that extra glow.</p>';
    }
    if (tan) {
      html += '<p class="prod-detail-variant-note">Same tinted care in a deeper <strong>Tan</strong> shade — mix the two for a custom match as your skin tone shifts with the seasons. Packaging looks the same; pick tan when you want more depth.</p>';
    }
    if (p.summary) html += '<p class="prod-detail-summary">' + esc(cleanProdSquares(p.summary)) + "</p>";
    var upcycledBits = upcycledBitsForProduct(p);
    if (upcycledBits.length) {
      html += '<button type="button" class="prod-origin-note" data-ing-nav="topic" data-ing-topic="upcycled">';
      html += '<span class="prod-origin-note-kicker">Upcycled</span>';
      html += "Uses upcycled " + esc(joinAndList(upcycledBits)) +
        " — leftovers given a second life, not grown extra. Tap for the short list.";
      html += "</button>";
    }
    if (!origin.seal && origin.hasOrganicFarming) {
      html += '<button type="button" class="prod-origin-note" data-origin-info="ingredients" aria-haspopup="dialog">';
      html += '<span class="prod-origin-note-kicker">Organic ingredients</span>';
      html += "Some of the plants in this formula are from organic farming. That’s different from a COSMOS badge on the whole product — tap to learn more.";
      html += "</button>";
    }
    var heroChips = productHeroChips(p);
    if (heroChips.length) {
      html += '<div class="prod-detail-chips" aria-label="Good for">';
      heroChips.forEach(function (c) {
        html += '<span class="prod-detail-chip">' + esc(c) + "</span>";
      });
      html += "</div>";
    }
    if (topClaim) {
      html += '<blockquote class="prod-detail-claim">' +
        '<span class="prod-detail-claim-label">From the studies</span>' +
        '<p>' + esc(topClaim) + "</p>" +
        "</blockquote>";
    }
    html += "</article>";

    html += '<div class="prod-acc-stack">';
    var productPhotos = (window.FS.Calendar && window.FS.Calendar.curiosityImagesForProduct)
      ? window.FS.Calendar.curiosityImagesForProduct(p.id)
      : [];
    if (productPhotos.length) {
      html += prodAcc(
        "More pictures · " + productPhotos.length,
        '<p class="prod-acc-note">Tap a photo to open it. Press and hold to save it to your camera roll.</p>' +
          productPhotoCirclesHtml(productPhotos)
      );
    }
    if (p.heroIngredients) {
      html += prodAcc("Hero ingredients", heroIngredientsHtml(p.heroIngredients), true);
    }
    if (claims.length) {
      html += prodAcc(
        "Study / performance notes",
        "<ul>" + claims.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") +
          '</ul><p class="prod-acc-note">As published on the ringana.com product page. Not a guarantee of individual results.</p>',
        !topClaim
      );
    }
    if (forWho.length) {
      html += prodAcc("Who it’s for", "<ul>" + forWho.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>");
    }
    if (notFor.length) {
      html += prodAcc(
        "Who it’s not for / cautions",
        "<ul>" + notFor.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>"
      );
    }
    if (howTo) {
      html += prodAcc("How to use", "<p>" + esc(howTo) + "</p>");
    }
    var nutritionBody = nutritionTableHtml(p) || nutritionFallbackHtml(ing.nutrition);
    if (nutritionBody) {
      html += prodAcc("Nutritional information", nutritionBody);
    }
    if (ing.ingredients) {
      html += prodAcc("Ingredients", "<p>" + esc(ing.ingredients) + "</p>");
    }
    if (ing.important) {
      html += prodAcc("Important information", "<p>" + esc(ing.important) + "</p>");
    }
    html += "</div>";

    var sourceUrl = safeHref(p.sourceUrl);
    if (sourceUrl) {
      html += '<p class="prod-source">Source: <a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer">View on ringana.com</a></p>';
    }
    return html;
  }

  function productSearchMetaText(browse, scoped) {
    var favScope = browse && browse.scope === "favorites";
    var q = (browse && browse.q) || "";
    var catalogHit = !favScope && freshCatalogMatchesQuery(q);
    var n = scoped.length;
    if (q) {
      if (catalogHit && n) return "Catalog + " + n + " product" + (n === 1 ? "" : "s") + " matching “" + q + "”";
      if (catalogHit) return "Catalog matching “" + q + "”";
      return n + " product" + (n === 1 ? "" : "s") + " matching “" + q + "”";
    }
    return n + " product" + (n === 1 ? "" : "s") + (favScope ? " favorited" : " to explore");
  }

  function freshCatalogCopy() {
    return (CFG && CFG.freshCatalog) || {
      eyebrow: "From Ringana",
      title: "The Fresh Catalog",
      blurb: "The current fresh book — skincare, body, baby, supplements, the whole range in one flip-through.",
      cta: "Open catalog →",
      url: "assets/company/fresh-catalog.pdf?v=3"
    };
  }

  /* Public file only — never join codes, hub, query, or a page in the app. */
  var FRESH_CATALOG_SHARE_HOST = "https://app.evergreenco.team/";
  var FRESH_CATALOG_SHARE_FILE = "assets/company/fresh-catalog.pdf";
  var GROVE_CATALOG_SHARE_URL = "https://thefreshgrove.team/thefreshcatalog";

  function isFreshCatalogAsset(url) {
    var path = String(url || "").split("?")[0].split("#")[0];
    return /(?:^|\/)fresh-catalog\.pdf$/i.test(path) ||
      /thefreshcatalog/i.test(path) ||
      /ringana-fresh-book/i.test(path);
  }

  function freshCatalogShareUrl() {
    var groveAccount = false;
    try {
      var CloudCat = window.FS.Cloud;
      groveAccount = !!(CloudCat && CloudCat.groveCopiesPrettyLinks && CloudCat.groveCopiesPrettyLinks());
    } catch (eAcc) {}
    if (groveAccount) {
      var grove = "";
      try { grove = String((CFG && CFG.groveCatalogUrl) || "").trim(); } catch (eG) {}
      if (grove === GROVE_CATALOG_SHARE_URL) return grove;
      return GROVE_CATALOG_SHARE_URL;
    }
    var rel = FRESH_CATALOG_SHARE_FILE;
    try {
      var raw = String((freshCatalogCopy() && freshCatalogCopy().url) || "").trim();
      raw = raw.split("?")[0].split("#")[0].replace(/^\.\//, "").replace(/^\/+/, "");
      if (/^assets\/company\/[A-Za-z0-9._-]+\.pdf$/.test(raw)) rel = raw;
    } catch (e) {}
    return FRESH_CATALOG_SHARE_HOST + rel;
  }

  function isAllowedCatalogShareUrl(url) {
    var clean = String(url || "").split("?")[0].split("#")[0].replace(/\/$/, "");
    if (clean === GROVE_CATALOG_SHARE_URL) return true;
    return /^https:\/\/(?:app\.evergreenco\.team|thefreshgrove\.team\/hub|go-evergreen\.github\.io\/first-seeds)\/assets\/company\/[A-Za-z0-9._-]+\.pdf$/.test(clean);
  }

  function copyFreshCatalogShareLink(btn) {
    var url = hardenCopiedUrl(freshCatalogShareUrl());
    if (!isAllowedCatalogShareUrl(url)) {
      if (window.FS && FS.UI && FS.UI.toast) FS.UI.toast("Couldn’t copy that link.", { tone: "bad" });
      return;
    }
    var idle = "Copy link to share";
    if (btn) {
      if (!btn.getAttribute("data-copy-idle")) btn.setAttribute("data-copy-idle", String(btn.textContent || idle).trim() || idle);
      idle = btn.getAttribute("data-copy-idle") || idle;
    }
    function copied() {
      if (btn) btn.textContent = "Copied ✓";
      if (window.FS && FS.UI && FS.UI.toast) FS.UI.toast("Copied ✓");
      setTimeout(function () {
        if (btn) btn.textContent = btn.getAttribute("data-copy-idle") || idle;
      }, 2200);
    }
    var done = false;
    try {
      var ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      if (document.execCommand("copy")) {
        done = true;
        copied();
      }
      document.body.removeChild(ta);
    } catch (e) {}
    if (!done && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(copied).catch(function () {
        if (window.FS && FS.UI && FS.UI.toast) FS.UI.toast("Couldn’t copy. Long-press to copy it.", { tone: "bad" });
      });
    }
  }

  function freshCatalogMatchesQuery(q) {
    var raw = String(q || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    if (!raw || raw.length < 3) return false;
    var phrases = [
      "catalog", "catalogue", "fresh book", "freshbook", "lookbook",
      "official catalog", "official catalogue"
    ];
    var prefixKeys = ["catalog", "catalogue", "freshbook", "lookbook"];
    var i;
    for (i = 0; i < phrases.length; i++) {
      if (raw.indexOf(phrases[i]) >= 0) return true;
    }
    for (i = 0; i < prefixKeys.length; i++) {
      if (prefixKeys[i].indexOf(raw) === 0 && raw.length >= 4) return true;
    }
    return false;
  }

  function officialFreshCatalogFoldHtml() {
    var cat = freshCatalogCopy();
    var title = String(cat.title || "The Fresh Catalog").trim();
    var url = String(cat.url || "").trim();
    var cta = String(cat.cta || "Open catalog →").trim();
    return '<div class="prod-catalog-card">' +
      '<button type="button" class="leads-pages-fold prod-catalog-fold" data-open-pdf="' +
      esc(url) + '" data-open-pdf-title="' + esc(title) + '">' +
      '<span class="leads-pages-title">' + esc(title) + "</span>" +
      '<span class="leads-pages-go">' + esc(cta) + "</span>" +
      "</button>" +
      '<button type="button" class="prod-catalog-share" data-copy-catalog-link>Copy link to share</button>' +
    "</div>";
  }

  function productBrowseBodyHtml(browse, scoped) {
    var lib = productLib();
    var favScope = browse.scope === "favorites";
    var html = "";
    var catalogHit = !favScope && freshCatalogMatchesQuery(browse.q);
    if (favScope) {
      html += renderProductListRows(scoped);
    } else if (!browse.category && !browse.q) {
      html += '<div class="prod-cat-grid">';
      (lib.categories || []).forEach(function (c) {
        var n = visibleProducts().filter(function (p) { return productInCategory(p, c.id); }).length;
        if (!n) return;
        html += '<button type="button" class="prod-cat-card" data-prod-nav="cat" data-prod-cat="' + esc(c.id) + '">' +
          '<span class="prod-cat-card-count">' + n + "</span>" +
          '<span class="prod-cat-card-label">' + esc(c.label) + "</span>" +
          '<span class="prod-cat-card-blurb">' + esc(c.blurb) + "</span></button>";
      });
      html += "</div>";
      html += officialFreshCatalogFoldHtml();
    } else if (!browse.category && browse.q) {
      if (catalogHit) html += officialFreshCatalogFoldHtml();
      if (scoped.length || !catalogHit) html += renderProductListRows(scoped);
    } else {
      var catObj = categoryById(browse.category);
      var subs = categorySubs(catObj);
      if (subs.length && !browse.q) {
        html += '<div class="prod-sub-row" id="prodSubRow">';
        html += '<button type="button" class="prod-pill' + (!browse.subcategory ? " on" : "") + '" data-prod-nav="cat" data-prod-cat="' + esc(browse.category) + '" data-prod-sub="">All</button>';
        subs.forEach(function (s) {
          html += '<button type="button" class="prod-pill' + (browse.subcategory === s.id ? " on" : "") +
            '" data-prod-nav="cat" data-prod-cat="' + esc(browse.category) + '" data-prod-sub="' + esc(s.id) + '">' +
            esc(s.label) + "</button>";
        });
        html += "</div>";
      }
      if (browse.category === "supplements" && !browse.q && ingredientTopicById("signature-nutrition")) {
        html += '<button type="button" class="prod-lib-cta" data-prod-mode="ingredients" data-ing-topic="signature-nutrition">' +
          '<span class="prod-lib-cta-eyebrow">Ingredient guide</span>' +
          '<span class="prod-lib-cta-title">Signature nutrition actives</span>' +
          '<span class="prod-lib-cta-sub">Named actives on these pages — open one to see which products use it.</span>' +
          '<span class="prod-lib-cta-go">Browse actives →</span>' +
          "</button>";
      }
      if (catalogHit) html += officialFreshCatalogFoldHtml();
      if (scoped.length || !catalogHit) html += renderProductListRows(scoped);
    }
    if (lib.disclaimer) {
      html += '<p class="prod-disclaimer">' + esc(lib.disclaimer) + "</p>";
    }
    return html;
  }

  function ingredientRowHtml(ing, opts) {
    opts = opts || {};
    var n = ingredientVisibleProductIds(ing).length;
    var roles = (ing.roles || []).slice(0, 2).map(ingredientRoleLabel).filter(Boolean);
    var common = ing.commonName && ing.commonName.toLowerCase() !== String(ing.inciName || "").toLowerCase()
      ? ing.commonName
      : "";
    var alts = (ing.altNames || []).filter(function (a) {
      var t = String(a || "").trim();
      if (!t) return false;
      var low = t.toLowerCase();
      var inci = String(ing.inciName || "").toLowerCase();
      var commonLow = String(ing.commonName || "").toLowerCase();
      if (low === inci || low === commonLow) return false;
      if (commonLow && (commonLow.indexOf(low) >= 0 || low.indexOf(commonLow) >= 0)) return false;
      return true;
    });
    return '<button type="button" class="ing-row' + (opts.featured ? " ing-row-featured" : "") + '" data-ing-open="' + esc(ing.id) + '">' +
      '<span class="ing-row-inci">' + esc(ing.inciName) + "</span>" +
      (common ? '<span class="ing-row-common">' + esc(common) + "</span>" : "") +
      (alts.length ? '<span class="ing-row-alts">Also: ' + esc(alts.join(", ")) + "</span>" : "") +
      '<span class="ing-row-meta">' +
        (roles.length ? '<span class="ing-row-roles">' + esc(roles.join(" · ")) + "</span>" : "") +
        '<span class="ing-row-count">' + n + " product" + (n === 1 ? "" : "s") + "</span>" +
      "</span></button>";
  }

  function renderIngredientListRows(items, featuredIds) {
    featuredIds = featuredIds || [];
    var featured = {};
    featuredIds.forEach(function (id) { featured[id] = true; });
    if (!items.length) {
      return '<p class="prod-empty">No ingredients match that search. Try an INCI name, a common name, or a topic like “emulsifiers.”</p>';
    }
    return '<div class="ing-list">' + items.map(function (ing) {
      return ingredientRowHtml(ing, { featured: !!featured[ing.id] });
    }).join("") + "</div>";
  }

  function renderIngredientProducts(ing) {
    var ids = ingredientVisibleProductIds(ing);
    if (!ids.length) {
      return '<p class="prod-empty">No products in this library currently list this ingredient. Confirm on the current pack / ringana.com.</p>';
    }
    return renderProductListRows(ids.map(productById).filter(Boolean));
  }

  function renderIngredientDetail(ing) {
    var guide = ingredientGuide();
    var n = ingredientVisibleProductIds(ing).length;
    var common = ing.commonName && ing.commonName.toLowerCase() !== String(ing.inciName || "").toLowerCase()
      ? ing.commonName
      : "";
    var alts = (ing.altNames || []).filter(function (a) {
      var t = String(a || "").trim();
      if (!t) return false;
      var low = t.toLowerCase();
      var inci = String(ing.inciName || "").toLowerCase();
      var commonLow = String(ing.commonName || "").toLowerCase();
      if (low === inci || low === commonLow) return false;
      if (commonLow && (commonLow.indexOf(low) >= 0 || low.indexOf(commonLow) >= 0)) return false;
      return true;
    });
    var roles = (ing.roles || []).map(ingredientRoleLabel).filter(Boolean);
    var browse = ensureProductBrowse();
    var topic = browse.topicId ? ingredientTopicById(browse.topicId) : null;
    var html = "";
    html += '<div class="prod-nav-bar">';
    if (topic) {
      html += '<button type="button" class="prod-pill on" data-ing-nav="topic" data-ing-topic="' + esc(topic.id) + '">← ' +
        esc(topic.title) + "</button>";
      html += '<button type="button" class="prod-pill" data-ing-nav="hub">Ingredients</button>';
    } else {
      html += '<button type="button" class="prod-pill on" data-ing-nav="hub">← Ingredients</button>';
    }
    html += "</div>";

    html += '<article class="ing-detail-hero">';
    html += '<div class="prod-detail-kicker">Ingredient</div>';
    html += '<h1 class="prod-detail-title">' + esc(ing.inciName) + "</h1>";
    if (common) html += '<p class="ing-detail-common">' + esc(common) + "</p>";
    if (alts.length) {
      html += '<p class="ing-detail-alts"><span>Also on labels as</span> ' + esc(alts.join(", ")) + "</p>";
    }
    if (roles.length) {
      html += '<div class="prod-detail-chips" aria-label="Roles">';
      roles.forEach(function (r) {
        html += '<span class="prod-detail-chip">' + esc(r) + "</span>";
      });
      html += "</div>";
    }
    if (ing.blurb) html += '<p class="prod-detail-summary">' + esc(ing.blurb) + "</p>";
    html += '<p class="ing-detail-count">' + n + " product" + (n === 1 ? "" : "s") + " in this library</p>";
    if ((ing.sourceUrls && ing.sourceUrls.length) || ing.manufacturerSourceUrl) {
      html += '<p class="prod-source">Sources: ';
      var sourceBits = [];
      (ing.sourceUrls || []).forEach(function (u, i) {
        var href = safeHref(u);
        if (!href) return;
        sourceBits.push('<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">ringana.com' +
          ((ing.sourceUrls || []).length > 1 ? " " + (i + 1) : "") + "</a>");
      });
      if (ing.manufacturerSourceUrl) {
        var mfr = safeHref(ing.manufacturerSourceUrl);
        if (mfr) {
          sourceBits.push('<a href="' + esc(mfr) + '" target="_blank" rel="noopener noreferrer">' +
            esc(ing.manufacturerLabel || "Official manufacturer") + "</a>");
        }
      }
      html += sourceBits.join(" · ") + "</p>";
    }
    html += "</article>";

    html += '<div class="prod-block">';
    html += "<h3>Products that contain it</h3>";
    html += '<p class="ing-block-lead">For allergies and seek-outs — always double-check the current pack / ringana.com.</p>';
    html += renderIngredientProducts(ing);
    html += "</div>";

    if (guide.disclaimer) {
      html += '<p class="prod-disclaimer">' + esc(guide.disclaimer) + "</p>";
    }
    return html;
  }

  function renderIngredientTopicDetail(topic) {
    var guide = ingredientGuide();
    var items = ingredientsForTopic(topic);
    var browse = ensureProductBrowse();
    var returnTo = browse.returnTo && browse.returnTo.panel ? browse.returnTo : null;

    var html = "";
    html += '<div class="prod-nav-bar">';
    if (returnTo) {
      html += '<button type="button" class="prod-pill on" data-prod-nav="return">← ' +
        esc(returnTo.label || "Back") + "</button>";
      html += '<button type="button" class="prod-pill" data-ing-nav="hub">Ingredients</button>';
    } else {
      html += '<button type="button" class="prod-pill on" data-ing-nav="hub">← Ingredients</button>';
    }
    html += "</div>";

    html += '<label class="sr-only" for="productSearch">Search ingredients</label>';
    html += '<input type="search" id="productSearch" class="prod-search" placeholder="Search preservatives, emulsifiers, sunflower, almond…" value="' +
      esc(browse.q || "") + '" autocomplete="off" enterkeyhint="search" spellcheck="false">';

    html += '<article class="ing-detail-hero">';
    html += '<div class="prod-detail-kicker">Ingredient topic</div>';
    html += '<h1 class="prod-detail-title">' + esc(topic.title) + "</h1>";
    if (topic.id === "watch-for") {
      html += '<p class="prod-detail-tagline">Ingredients to look for on labels when comparing to Ringana.</p>';
    } else {
      if (topic.blurb) html += '<p class="prod-detail-tagline">' + esc(topic.blurb) + "</p>";
      if (topic.intro) html += '<p class="prod-detail-summary">' + esc(topic.intro) + "</p>";
      if (topic.ringanaApproach) {
        html += '<blockquote class="prod-detail-claim">' +
          '<span class="prod-detail-claim-label">How to talk about it</span>' +
          "<p>" + esc(topic.ringanaApproach) + "</p></blockquote>";
      }
    }
    html += "</article>";

    var featuredProds = (topic.featuredProductIds || []).map(productById).filter(Boolean);
    if (featuredProds.length) {
      html += '<div class="prod-block">';
      html += "<h3>See them in</h3>";
      html += '<p class="ing-block-lead">Open a product for the hero line and the full list.</p>';
      html += renderProductListRows(featuredProds);
      html += "</div>";
    }

    if (items.length) {
      html += '<div class="prod-block">';
      html += "<h3>Ingredients · " + items.length + "</h3>";
      html += '<p class="ing-block-lead">A–Z by name. Open one to see which products use it.</p>';
      html += renderIngredientListRows(items, []);
      html += "</div>";
    } else if (topic.id !== "watch-for") {
      html += '<p class="prod-empty">No ingredients mapped to this topic yet.</p>';
    }

    if (topic.id === "watch-for") {
      html += renderWatchForAvoidBlock();
    } else if (topic.avoidInConventional && topic.avoidInConventional.length) {
      html += '<div class="prod-block notfor ing-avoid-block">';
      html += "<h3>" + esc(topic.avoidTitle || "Often watch for in conventional skincare") + "</h3>";
      html += '<p class="ing-block-lead">' +
        esc(topic.avoidLead || "Education — not a fear list. Use for label literacy conversations.") +
        "</p>";
      html += '<div class="ing-avoid-list">';
      topic.avoidInConventional.forEach(function (a) {
        html += renderIngAvoidCard(a);
      });
      html += "</div></div>";
    }

    if (guide.disclaimer) {
      html += '<p class="prod-disclaimer">' + esc(guide.disclaimer) + "</p>";
    }
    return html;
  }

  function renderIngAvoidCard(a) {
    if (!a || !a.name) return "";
    var blob = [a.name, a.examples || "", a.why || "", a.topicTitle || "", a.avoidTitle || ""].join(" ");
    var html = '<article class="ing-avoid-card" data-watch-q="' + esc(blob) + '">';
    html += '<h4 class="ing-avoid-name">' + esc(a.name) + "</h4>";
    if (a.examples) {
      html += '<p class="ing-avoid-examples"><span>On labels</span> ' + esc(a.examples) + "</p>";
    }
    if (a.why) html += '<p class="ing-avoid-why">' + esc(a.why) + "</p>";
    html += "</article>";
    return html;
  }

  function renderWatchForAvoidBlock() {
    var items = conventionalWatchItems();
    var groups = [];
    var byId = {};
    for (var i = 0; i < items.length; i++) {
      var a = items[i];
      if (!byId[a.topicId]) {
        byId[a.topicId] = {
          topicId: a.topicId,
          topicTitle: a.topicTitle,
          avoidTitle: a.avoidTitle,
          items: []
        };
        groups.push(byId[a.topicId]);
      }
      byId[a.topicId].items.push(a);
    }
    var html = '<div class="prod-block notfor ing-avoid-block" id="ingWatchBlock">';
    html += '<div class="ing-watch-search-wrap">';
    html += '<span class="ing-watch-search-ico" aria-hidden="true">🔍</span>';
    html += '<label class="sr-only" for="ingWatchSearch">Search names to watch for</label>';
    html += '<input type="search" id="ingWatchSearch" class="ing-watch-search" placeholder="Search paraben, PEG, silicone, SLS…" autocomplete="off" enterkeyhint="search" spellcheck="false">';
    html += "</div>";
    html += '<p class="ing-watch-meta" id="ingWatchMeta" hidden></p>';
    html += '<p class="prod-empty" id="ingWatchEmpty" hidden>No watch-list names match that — try paraben, PEG, silicone, or SLS.</p>';
    html += '<div id="ingWatchGlossaryHits" hidden></div>';
    html += '<div id="ingWatchList">';
    groups.forEach(function (g) {
      html += '<div class="ing-avoid-group">';
      html += '<div class="ing-avoid-group-head">';
      html += '<p class="ing-section-label">' + esc(g.avoidTitle || g.topicTitle) + "</p>";
      html += '<button type="button" class="ing-avoid-group-go" data-ing-nav="topic" data-ing-topic="' +
        esc(g.topicId) + '">Open topic →</button>';
      html += "</div>";
      html += '<div class="ing-avoid-list">';
      g.items.forEach(function (item) {
        html += renderIngAvoidCard(item);
      });
      html += "</div></div>";
    });
    html += "</div></div>";
    return html;
  }

  function filterIngWatchList(q) {
    var raw = ((q || "") + "").trim().toLowerCase();
    var groups = document.querySelectorAll("#ingWatchList .ing-avoid-group");
    var empty = document.getElementById("ingWatchEmpty");
    var meta = document.getElementById("ingWatchMeta");
    var shown = 0;
    var total = 0;
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      var cards = group.querySelectorAll(".ing-avoid-card");
      var groupShown = 0;
      for (var j = 0; j < cards.length; j++) {
        var card = cards[j];
        total++;
        var blob = (card.getAttribute("data-watch-q") || "").toLowerCase();
        var match = !raw || blob.indexOf(raw) >= 0;
        card.hidden = !match;
        if (match) groupShown++;
      }
      group.hidden = groupShown === 0;
      shown += groupShown;
    }
    var extra = document.getElementById("ingWatchGlossaryHits");
    var libHits = 0;
    if (extra) {
      if (raw) {
        var hits = ingredientsMatchingQuery(q);
        libHits = hits.length;
        if (libHits) {
          extra.hidden = false;
          extra.innerHTML = '<p class="ing-section-label">In the Ringana library</p>' +
            '<p class="ing-block-lead">' +
            (shown
              ? "Ringana ingredients that match — not just names to watch for."
              : "Not on the watch list — these are ingredients Ringana uses.") +
            "</p>" +
            renderIngredientListRows(hits, []);
        } else {
          extra.hidden = true;
          extra.innerHTML = "";
        }
      } else {
        extra.hidden = true;
        extra.innerHTML = "";
      }
    }
    if (empty) empty.hidden = shown > 0 || libHits > 0;
    if (meta) {
      if (!raw) {
        meta.hidden = true;
        meta.textContent = "";
      } else if (shown > 0 && libHits > 0) {
        meta.hidden = false;
        meta.textContent = shown + " watch-list · " + libHits +
          " library ingredient" + (libHits === 1 ? "" : "s") +
          " matching “" + ((q || "").trim()) + "”";
      } else if (shown > 0) {
        meta.hidden = false;
        meta.textContent = shown + " of " + total + " names matching “" + ((q || "").trim()) + "”";
      } else if (libHits > 0) {
        meta.hidden = false;
        meta.textContent = "Not on the watch list · " + libHits +
          " library ingredient" + (libHits === 1 ? "" : "s") + " matching “" + ((q || "").trim()) + "”";
      } else {
        meta.hidden = false;
        meta.textContent = "0 of " + total + " names matching “" + ((q || "").trim()) + "”";
      }
    }
  }

  function ingredientBrowseBodyHtml(browse) {
    var guide = ingredientGuide();
    var html = "";
    var q = ((browse && browse.q) || "").trim();

    if (q) {
      var topicHits = topicsMatchingQuery(q).filter(function (t) {
        return t.id === "watch-for" || ingredientsForTopic(t).length > 0;
      });
      var ingHits = ingredientsMatchingQuery(q);
      if (topicHits.length) {
        html += '<div class="ing-topic-hits">';
        html += '<p class="ing-section-label">Topics</p>';
        html += '<div class="ing-topic-chip-row">';
        topicHits.forEach(function (t) {
          html += '<button type="button" class="prod-pill" data-ing-nav="topic" data-ing-topic="' + esc(t.id) + '">' + esc(t.title) + "</button>";
        });
        html += "</div></div>";
      }
      html += '<p class="ing-section-label">Ingredients</p>';
      html += renderIngredientListRows(ingHits, []);
    } else {
      html += '<button type="button" class="ing-watch-chip" data-ing-nav="topic" data-ing-topic="upcycled">';
      html += '<span class="ing-watch-chip-ico" aria-hidden="true">♻️</span>';
      html += '<span class="ing-watch-chip-title">Upcycled ingredients</span>';
      html += "</button>";
      html += '<button type="button" class="ing-watch-chip" data-ing-nav="topic" data-ing-topic="watch-for">';
      html += '<span class="ing-watch-chip-ico" aria-hidden="true">🔍</span>';
      html += '<span class="ing-watch-chip-title">What to watch for</span>';
      html += "</button>";
      html += '<div class="ing-topic-grid">';
      (guide.topics || []).forEach(function (t) {
        if (t.id === "watch-for" || t.id === "upcycled") return;
        var count = ingredientsForTopic(t).length;
        if (!count) return;
        html += '<button type="button" class="ing-topic-card" data-ing-nav="topic" data-ing-topic="' + esc(t.id) + '">' +
          (count ? '<span class="prod-cat-card-count">' + count + "</span>" : "") +
          '<span class="prod-cat-card-label">' + esc(t.title) + "</span>" +
          '<span class="prod-cat-card-blurb">' + esc(t.blurb || "") + "</span></button>";
      });
      html += "</div>";
      html += '<p class="ing-hub-hint">Or search any INCI or everyday name — almond, niacinamide, citronellol…</p>';
    }

    if (guide.disclaimer) {
      html += '<p class="prod-disclaimer">' + esc(guide.disclaimer) + "</p>";
    }
    return html;
  }

  function ingredientSearchMetaText(browse) {
    var q = ((browse && browse.q) || "").trim();
    if (!q) {
      var n = (ingredientGuide().glossary || []).length;
      return n + " ingredients · browse topics or search";
    }
    var topics = topicsMatchingQuery(q).length;
    var ings = ingredientsMatchingQuery(q).length;
    return ings + " ingredient" + (ings === 1 ? "" : "s") +
      (topics ? " · " + topics + " topic" + (topics === 1 ? "" : "s") : "") +
      " matching “" + q + "”";
  }

  function productResultsSignature(browse, scoped) {
    var ids = [];
    for (var i = 0; i < scoped.length; i++) ids.push(scoped[i].id);
    return [
      browse.mode || "products",
      browse.scope || "all",
      browse.category || "",
      browse.subcategory || "",
      browse.topicId || "",
      browse.ingredientId || "",
      browse.q || "",
      ids.join(",")
    ].join("|");
  }

  function ingredientResultsSignature(browse) {
    return [
      "ingredients",
      browse.topicId || "",
      browse.ingredientId || "",
      browse.q || ""
    ].join("|");
  }

  function updateProductBrowseResults() {
    var meta = document.getElementById("prodSearchMeta");
    var body = document.getElementById("prodBrowseBody");
    if (!meta && !body) return;
    var browse = ensureProductBrowse();
    if (browse.mode === "ingredients") {
      if (browse.ingredientId || browse.topicId) return;
      if (meta) meta.textContent = ingredientSearchMetaText(browse);
      var ikey = ingredientResultsSignature(browse);
      if (body && ikey !== productResultKey) {
        productResultKey = ikey;
        body.innerHTML = ingredientBrowseBodyHtml(browse);
      }
      return;
    }
    var scoped = productsInScope(browse);
    if (meta) meta.textContent = productSearchMetaText(browse, scoped);
    var key = productResultsSignature(browse, scoped);
    if (body && key !== productResultKey) {
      productResultKey = key;
      body.innerHTML = productBrowseBodyHtml(browse, scoped);
    }
  }

  function wireProductLibrarySearch() {
    if (productLibSearchWired) return;
    var root = document.getElementById("productLibRoot");
    if (!root) return;
    productLibSearchWired = true;
    root.addEventListener("input", function (e) {
      var t = e.target;
      if (t && t.id === "ingWatchSearch") {
        filterIngWatchList(t.value);
        return;
      }
      if (!t || t.id !== "productSearch") return;
      var browse = ensureProductBrowse();
      browse.q = t.value || "";
      var leaveIngDeep = false;
      if (browse.mode === "ingredients") {
        leaveIngDeep = !!(browse.topicId || browse.ingredientId);
        browse.topicId = null;
        browse.ingredientId = null;
      }
      if (productSearchTimer) clearTimeout(productSearchTimer);
      productSearchTimer = setTimeout(function () {
        productSearchTimer = null;
        if (leaveIngDeep || !document.getElementById("prodBrowseBody")) {
          renderProductLibrary();
          return;
        }
        updateProductBrowseResults();
      }, 120);
    });
  }

  function libraryModeRowHtml(browse) {
    var ingMode = browse.mode === "ingredients";
    return '<div class="prod-lib-switch" role="tablist" aria-label="Library mode">' +
      '<button type="button" class="prod-lib-switch-btn' + (!ingMode ? " on" : "") + '" data-prod-mode="products" role="tab" aria-selected="' + (!ingMode ? "true" : "false") + '">Products</button>' +
      '<button type="button" class="prod-lib-switch-btn' + (ingMode ? " on" : "") + '" data-prod-mode="ingredients" role="tab" aria-selected="' + (ingMode ? "true" : "false") + '">Ingredients</button>' +
      "</div>";
  }

  function libraryScopeLinksHtml(browse, favN) {
    var favScope = browse.scope === "favorites";
    return '<div class="prod-scope-links" role="tablist" aria-label="Product library view">' +
      '<button type="button" class="prod-scope-link' + (!favScope ? " on" : "") + '" data-prod-scope="all" role="tab" aria-selected="' + (!favScope ? "true" : "false") + '">All</button>' +
      '<button type="button" class="prod-scope-link' + (favScope ? " on" : "") + '" data-prod-scope="favorites" role="tab" aria-selected="' + (favScope ? "true" : "false") + '">Favorites' +
      (favN ? " · " + favN : "") + "</button>" +
      "</div>";
  }

  function paintProductScopeLinks() {
    var mount = document.getElementById("prodScopeMount");
    if (!mount) return false;
    var n = favoriteCount();
    var browse = ensureProductBrowse();
    if (n < 1) {
      mount.innerHTML = "";
      return browse.scope === "favorites";
    }
    mount.innerHTML = libraryScopeLinksHtml(browse, n);
    return false;
  }

  function renderProductLibrary() {
    var root = document.getElementById("productLibRoot");
    if (!root) return;
    var ae = document.activeElement;
    if (ae && root.contains(ae) && (ae.id === "productSearch" || ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) {
      updateProductBrowseResults();
      return;
    }
    wireProductLibrarySearch();
    var lib = productLib();
    var guide = ingredientGuide();
    var browse = ensureProductBrowse();
    if (browse.subcategory && isHiddenSunSub(browse.subcategory)) browse.subcategory = null;
    if (browse.category && browse.subcategory) {
      var earlySubs = categorySubs(categoryById(browse.category));
      var subOk = false;
      for (var esi = 0; esi < earlySubs.length; esi++) {
        if (earlySubs[esi].id === browse.subcategory) { subOk = true; break; }
      }
      if (!subOk) browse.subcategory = null;
    }
    var html = "";
    var favN = favoriteCount();
    var favScope = browse.scope === "favorites";
    var ingMode = browse.mode === "ingredients";
    var inProductCategory = !ingMode && !favScope && !!browse.category;

    if (browse.productId && !productById(browse.productId)) browse.productId = null;
    if (ingMode && browse.ingredientId && !ingredientById(browse.ingredientId)) browse.ingredientId = null;
    if (ingMode && browse.topicId && !ingredientTopicById(browse.topicId)) browse.topicId = null;

    var prodStamp = [
      browse.mode || "",
      browse.scope || "",
      browse.category || "",
      browse.subcategory || "",
      browse.productId || "",
      browse.topicId || "",
      browse.ingredientId || "",
      browse.q || "",
      String(favN)
    ].join("|");
    if (root.getAttribute("data-prod-stamp") === prodStamp && root.firstChild) return;
    root.setAttribute("data-prod-stamp", prodStamp);

    if (browse.productId) {
      var detail = productById(browse.productId);
      if (detail) {
        root.innerHTML = renderProductDetail(detail);
        return;
      }
      browse.productId = null;
    }

    if (ingMode && browse.ingredientId) {
      var ingDetail = ingredientById(browse.ingredientId);
      if (ingDetail) {
        root.innerHTML = renderIngredientDetail(ingDetail);
        return;
      }
      browse.ingredientId = null;
    }

    if (ingMode && browse.topicId && !((browse.q || "").trim())) {
      var topicDetail = ingredientTopicById(browse.topicId);
      if (topicDetail) {
        root.innerHTML = renderIngredientTopicDetail(topicDetail);
        return;
      }
      browse.topicId = null;
    }

    var returnToHub = browse.returnTo && browse.returnTo.panel ? browse.returnTo : null;
    var showBack = inProductCategory || !packEvergreen() || returnToHub;
    if (showBack) {
      html += '<div class="prod-lib-top">';
      if (inProductCategory) {
        html += '<button type="button" class="prod-pill on prod-lib-back" data-prod-nav="hub">← All products</button>';
      } else if (returnToHub) {
        html += '<button type="button" class="prod-pill on prod-lib-back" data-prod-nav="return">← ' +
          esc(returnToHub.label || "Back") + "</button>";
      } else {
        html += '<button type="button" class="prod-pill on prod-lib-back" data-goto="know">← Back to Learn</button>';
      }
      html += "</div>";
    }

    if (!ingMode) {
      if (favScope) {
        html += '<h1 class="prod-head-title">Your favorites</h1>';
        html += '<p class="prod-head-sub">Products you’re looking forward to — heart a few more anytime from All.</p>';
      } else if (!browse.category) {
        html += '<h1 class="prod-head-title">Learn the products</h1>';
        html += '<p class="prod-head-sub">' + esc(lib.sourceNote || "Browse by category — searchable and ready to learn.") + "</p>";
      } else {
        var cat = categoryById(browse.category);
        html += '<h1 class="prod-head-title">' + esc(cat ? cat.label : browse.category) + "</h1>";
        html += '<p class="prod-head-sub">' + esc(cat ? cat.blurb : "") + "</p>";
      }
    } else {
      html += '<h1 class="prod-head-title">Ingredient guide</h1>';
      html += '<p class="prod-head-sub">' + esc(guide.sourceNote || "Search any ingredient — or browse by topic.") + "</p>";
    }

    if (!inProductCategory) html += libraryModeRowHtml(browse);

    if (!ingMode) {
      html += '<div id="prodScopeMount">';
      if (favN > 0) html += libraryScopeLinksHtml(browse, favN);
      html += "</div>";
      html += '<label class="sr-only" for="productSearch">Search products</label>';
      html += '<input type="search" id="productSearch" class="prod-search" placeholder="Search names, ingredients, concerns…" value="' + esc(browse.q || "") + '" autocomplete="off" enterkeyhint="search" spellcheck="false">';
      var scoped = productsInScope(browse);
      productResultKey = productResultsSignature(browse, scoped);
      html += '<p class="prod-search-meta" id="prodSearchMeta">' + esc(productSearchMetaText(browse, scoped)) + "</p>";
      html += '<div id="prodBrowseBody">' + productBrowseBodyHtml(browse, scoped) + "</div>";
    } else {
      html += '<label class="sr-only" for="productSearch">Search ingredients</label>';
      html += '<input type="search" id="productSearch" class="prod-search" placeholder="Search preservatives, emulsifiers, sunflower, almond…" value="' + esc(browse.q || "") + '" autocomplete="off" enterkeyhint="search" spellcheck="false">';
      productResultKey = ingredientResultsSignature(browse);
      html += '<p class="prod-search-meta" id="prodSearchMeta">' + esc(ingredientSearchMetaText(browse)) + "</p>";
      html += '<div id="prodBrowseBody">' + ingredientBrowseBodyHtml(browse) + "</div>";
    }

    root.innerHTML = html;
  }

  function favoriteProducts() {
    var favs = ensureProductFavorites();
    var out = [];
    for (var i = 0; i < favs.length; i++) {
      var p = productById(favs[i]);
      if (p) out.push(p);
    }
    return out;
  }

  /* Shared shortlist for Pick Your First Few, finish, and Content. */
  function renderFocusShortlist(opts) {
    opts = opts || {};
    var list = document.getElementById(opts.listId);
    if (!list) return;
    var products = favoriteProducts();
    if (!products.length) {
      var empty = opts.empty || "Heart a few products in Learn — they’ll show up here.";
      var html = '<span class="dim">' + esc(empty) + "</span>";
      if (opts.emptyCta && opts.emptyGoto) {
        html += '<p class="share-fav-hint"><button type="button" class="focus-shortlist-cta" data-goto="' +
          esc(opts.emptyGoto) + '">' + esc(opts.emptyCta) + "</button></p>";
      }
      list.innerHTML = html;
      return;
    }
    var items;
    if (opts.tapOpen) {
      items = products.map(function (p) {
        return '<li><button type="button" class="focus-shortlist-item" data-prod-open="' +
          esc(p.id) + '"' +
          (opts.returnPanel
            ? ' data-prod-return="' + esc(opts.returnPanel) + '" data-prod-return-label="' + esc(opts.returnLabel || "Back") + '"'
            : "") +
          ">" + esc(p.name) + "</button></li>";
      }).join("");
    } else {
      items = products.map(function (p) {
        return "<li>" + esc(p.name) + "</li>";
      }).join("");
    }
    list.innerHTML = '<ul class="focus-shortlist-ul">' + items + "</ul>" +
      (opts.hint ? '<p class="share-fav-hint">' + esc(opts.hint) + "</p>" : "");
  }

  function renderShareFavPreview() {
    var n = favoriteCount();
    var hint = n < 2
      ? "Heart at least one more — 2–3 is the sweet spot."
      : n > 3
        ? "Nice shortlist. You can trim anytime in Learn → Favorites."
        : "Solid shortlist. Open Talking fresh when you’re ready.";
    renderFocusShortlist({
      listId: "shareFavList",
      empty: "Heart a few products in Learn — they’ll show up here.",
      emptyGoto: "products",
      emptyCta: "Open products →",
      hint: hint,
      tapOpen: true,
      returnPanel: "share",
      returnLabel: "Pick Your First Few"
    });
  }

  function renderContentShortlist() {
    renderFocusShortlist({
      listId: "contentFavList",
      empty: "Heart a few products in Learn — they’ll show up here when you plan posts.",
      emptyGoto: "products",
      emptyCta: "Open products · heart favorites →",
      hint: "Focus here when you plan posts — tap a name to reopen it in Learn.",
      tapOpen: true,
      returnPanel: "tend",
      returnLabel: "Calendar"
    });
  }

  function renderFinishShortlist() {
    renderFocusShortlist({
      listId: "finishFavList",
      empty: "Heart a few products in Learn — your focus shortlist will land here.",
      emptyGoto: "products",
      emptyCta: "Open products →",
      hint: "These are yours to lean on when you talk or create.",
      tapOpen: true,
      returnPanel: "done",
      returnLabel: "Finish"
    });
  }

  function refreshAllShortlists() {
    renderShareFavPreview();
    renderContentShortlist();
    renderContentFactShortlist();
    renderFinishShortlist();
    if (packEvergreen()) renderEvergreenLearnFavs();
  }

  function renderNav() {
    var secs = visibleSections();
    var html = "";
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      var locked = !isModuleUnlocked(s.id);
      var cls = "nav-item" +
        (state.active === s.id ? " active" : "") +
        (state.done[s.id] ? " done" : "") +
        (locked ? " locked" : "");
      var dot = state.done[s.id] ? "✓" : (locked ? "🔒" : String(i + 1));
      var sub = locked ? "Locked · finish previous first" : s.sub;
      html += '<button type="button" class="' + cls + '" data-goto="' + s.id + '"' +
        (locked ? ' aria-disabled="true"' : "") +
        '><span class="nav-dot">' + dot + '</span><span><span class="nav-label">' +
        s.label + '</span><span class="nav-sub">' + esc(sub) + "</span></span></button>";
    }
    nav.innerHTML = html;
  }

  function hideLockToast() {
    var el = document.getElementById("lockToast");
    if (el) el.hidden = true;
  }

  function showLockToast(targetId) {
    var el = document.getElementById("lockToast");
    if (!el) return;
    var prior = priorSectionId(targetId);
    var priorName = prior ? sectionLabel(prior) : "the previous module";
    el.hidden = false;
    el.innerHTML =
      '<div class="lock-toast-inner">' +
      "<p>That module unlocks after you finish <strong>" + esc(priorName) + "</strong>.</p>" +
      '<div class="lock-toast-actions">' +
      '<button type="button" class="btn" data-goto="' + esc(prior || "roots") + '">Go finish it →</button>' +
      '<button type="button" class="btn-ghost" data-soft-unlock="' + esc(targetId) + '">Open anyway</button>' +
      '<button type="button" class="lock-toast-x" id="lockToastClose" aria-label="Dismiss">×</button>' +
      "</div></div>";
  }

  function checklistItems(id) {
    if (id === "roots") {
      return [
        { done: filledText("why"), label: "Your why" },
        { done: filledText("moment"), label: "Your moment" },
        { done: filledText("said_yes"), label: "Why you said yes" }
      ];
    }
    if (id === "ev-learn") return evLearnChecks();
    if (id === "ev-heart") {
      return [{ done: filledText("ev_heart"), label: "Draft one post from your story" }];
    }
    if (id === "ev-leads") {
      var leadsN = listNames("ev_leads").length;
      return [{ done: leadsN >= 5, label: "List at least 5 people (" + leadsN + "/5)" }];
    }
    if (id === "ev-dream") {
      var dreamN = listNames("ev_dream").length;
      return [{ done: dreamN >= 3, label: "List at least 3 people who grow with you (" + dreamN + "/3)" }];
    }
    if (id === "ev-dates") {
      return [{ done: !!state.data.evCalOpened, label: "Open Calendar once" }];
    }
    if (id === "ev-links") {
      return [{ done: !!state.data.evResOpened, label: "Open Resources once" }];
    }
    if (id === "share") {
      var favs = favoriteCount();
      return [
        { done: favs >= 2, label: "Favorite 2–3 products (" + favs + " saved)" },
        { done: talkOpened(), label: "Open Talking fresh once" }
      ];
    }
    if (id === "grove") {
      var cNames = customerNames();
      var c = cNames.length;
      var pickSet = {};
      cNames.forEach(function (n) { pickSet[n.toLowerCase()] = true; });
      var cp = grovePicks("customer_first").filter(function (n) {
        return pickSet[(n || "").toLowerCase()];
      }).length;
      var need = Math.min(5, Math.max(c, 0));
      var named = treeNamedCount();
      return [
        { done: c >= 5, label: "At least 5 customer names (" + c + "/5)" },
        { done: c >= 5 && cp >= need && need > 0, label: "Tap first customer chats (" + cp + "/" + (need || 5) + ")" },
        { done: named >= 1, label: "Sketch your dream tree (optional) · " + named, optional: true }
      ];
    }
    if (id === "tree") return [];
    if (id === "ground") {
      var items = [
        { done: true, label: "Using your First Seeds lead page" },
        { done: filledText("page_story"), label: "Draft your opening line" },
        { done: leadSignedIn(), label: "Sign in for your lead page" },
        { done: leadPageReady(), label: "Your share link is ready" }
      ];
      items.push({ done: leadPreviewSeen(), label: "Preview your lead page", optional: true });
      return items;
    }
    if (id === "plant") {
      return [
        { done: filledText("seed_open"), label: "Curiosity post draft" },
        { done: giveDraftFilled(), label: "Helpful share (behind the scenes, honest note, or values)" },
        { done: filledText("seed_invite"), label: "Soft invite draft" }
      ];
    }
    if (id === "tend") {
      if (packEvergreen()) return [];
      var Cal = window.FS.Calendar;
      var posted = Cal && Cal.countPosted ? Cal.countPosted(state.data.calendar || {}) : 0;
      var drafted = Cal && Cal.countDrafted ? Cal.countDrafted(state.data.calendar || {}) : 0;
      var started = Cal && Cal.countStarted
        ? Cal.countStarted(state.data.calendar || {})
        : (drafted + posted);
      return [
        {
          done: started >= 1,
          label: "Start one calendar card — add from the vault or ＋ Add, then save a draft"
        },
        {
          done: posted >= 3,
          label: "Mark 3 cards as Posted after you post them (" + posted + "/3)"
        }
      ];
    }
    return [];
  }

  function renderModuleChecklists(onlyId) {
    if (packEvergreen()) {
      var leftover = document.querySelectorAll("[data-module-check]");
      for (var h = 0; h < leftover.length; h++) {
        if (leftover[h].getAttribute("data-module-check") === "ev-learn") continue;
        if (leftover[h].getAttribute("data-module-check") === "ev-leads") continue;
        if (leftover[h].getAttribute("data-module-check") === "ev-dream") continue;
        leftover[h].hidden = true;
      }
      renderEvergreenPathChecks();
      return;
    }
    var secs = visibleSections();
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      if (onlyId && s.id !== onlyId) continue;
      var panel = document.getElementById("panel-" + s.id);
      if (!panel) continue;
      var box = panel.querySelector("[data-module-check]");
      if (!box) {
        box = document.createElement("div");
        box.className = "module-check";
        box.setAttribute("data-module-check", s.id);
        var after = panel.querySelector(".sec-sub") || panel.querySelector("h1") || panel.querySelector(".sec-num");
        if (after) after.insertAdjacentElement("afterend", box);
        else panel.insertBefore(box, panel.firstChild);
      }
      var items = checklistItems(s.id);
      if (!items.length) {
        box.hidden = true;
        continue;
      }
      var required = [];
      for (var r = 0; r < items.length; r++) if (!items[r].optional) required.push(items[r]);
      var doneN = 0;
      for (var j = 0; j < required.length; j++) if (required[j].done) doneN++;
      var all = required.length > 0 && doneN === required.length;
      if (state.done[s.id]) {
        box.hidden = true;
        continue;
      }
      box.hidden = false;
      var html = '<div class="module-check-head">' +
        '<span class="module-check-tag">MODULE CHECKLIST</span>' +
        '<span class="module-check-count' + (all ? " on" : "") + '">' + doneN + " of " + required.length + " done</span>" +
        "</div><ul class=\"module-check-list\">";
      for (var k = 0; k < items.length; k++) {
        html += '<li class="' + (items[k].done ? "is-done" : "") + (items[k].optional ? " is-optional" : "") + '">' +
          '<span class="module-check-mark" aria-hidden="true">' + (items[k].done ? "✓" : "○") + "</span>" +
          esc(items[k].label) + "</li>";
      }
      html += "</ul>";
      if (!isModuleUnlocked(s.id)) {
        html += '<p class="module-check-lock">Locked until you finish ' +
          esc(sectionLabel(priorSectionId(s.id) || "roots")) +
          ". Tap <strong>Open anyway</strong> on the lock message if you need a peek.</p>";
      }
      box.innerHTML = html;
    }
  }

  function collapseHubSettings() {
    var sets = document.querySelectorAll("#hubMenu details.hub-set");
    for (var i = 0; i < sets.length; i++) sets[i].open = false;
    var panel = document.querySelector("#hubMenu .hub-menu-scroll");
    if (panel) panel.scrollTop = 0;
  }

  function wireHubSettingsAccordion() {
    var sets = document.querySelectorAll("#hubMenu details.hub-set");
    for (var i = 0; i < sets.length; i++) {
      if (sets[i].dataset.boundAcc === "1") continue;
      sets[i].dataset.boundAcc = "1";
      sets[i].addEventListener("toggle", onHubSetToggle);
    }
  }

  function onHubSetToggle() {
    if (!this.open) return;
    var self = this;
    var sets = document.querySelectorAll("#hubMenu details.hub-set");
    for (var i = 0; i < sets.length; i++) {
      if (sets[i] !== self) sets[i].open = false;
    }
    var panel = document.querySelector("#hubMenu .hub-menu-scroll");
    if (!panel) return;
    requestAnimationFrame(function () {
      var panelRect = panel.getBoundingClientRect();
      var elRect = self.getBoundingClientRect();
      var next = panel.scrollTop + (elRect.top - panelRect.top) - 8;
      if (next < 0) next = 0;
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce && typeof panel.scrollTo === "function") panel.scrollTo({ top: next, behavior: "smooth" });
      else panel.scrollTop = next;
    });
  }

  function openHubMenu() {
    var menu = document.getElementById("hubMenu");
    if (!menu) return;
    syncGrowthSettingsUI();
    syncWeekStartSettingsUI();
    syncSettingsNameUI();
    updateLeadPageSettingUI();
    if (window.FS.refreshGroveDoorPanel) {
      window.FS.refreshGroveDoorPanel().catch(function () {});
    }
    if (window.FS.Push && window.FS.Push.refreshSettingsUI) {
      window.FS.Push.refreshSettingsUI().catch(function () {});
    }
    menu.hidden = false;
    document.body.classList.add("hub-menu-open");
    if (window.FS.armDismissGuard) window.FS.armDismissGuard();
    renderBottomNav();
  }

  function closeHubMenu() {
    var menu = document.getElementById("hubMenu");
    if (!menu) return;
    menu.hidden = true;
    document.body.classList.remove("hub-menu-open");
    collapseHubSettings();
    renderBottomNav();
  }

  function renderBottomNav() {
    var bar = document.getElementById("bottomNav");
    if (!bar) return;
    if (clientsArrivalPlaying) return;
    var ev = packEvergreen();
    var hideLeads = false;
    var leadsBtn = bar.querySelector('[data-tab="leads"]');
    if (leadsBtn) leadsBtn.hidden = ev || hideLeads;
    if (!ev && hideLeads && state.active === "leads") {
      state.active = "ground";
      save();
    }
    var teamBtn = bar.querySelector('[data-tab="team"]');
    if (teamBtn) teamBtn.hidden = ev || canSeeShelfCustomers();
    var customersBtn = bar.querySelector('[data-tab="customers"]');
    if (customersBtn) customersBtn.hidden = ev || !canSeeShelfCustomers();
    var resBtn = bar.querySelector('[data-tab="resources"]');
    if (resBtn) resBtn.hidden = !ev;
    document.body.classList.toggle("shelf-customers", !ev && canSeeShelfCustomers());
    var homeLab = bar.querySelector('[data-tab="home"] .bottom-nav-label');
    if (homeLab) homeLab.textContent = firstName() || "Sprout";
    var tab = "";
    if (state.active === "tend" || state.active === "calendar" || state.active === "curiosity-photos" || state.active === "content-vault" || state.active === "content-stories" || state.active === "content-week" || state.active === "grove-shelf") tab = "content";
    else if (state.active === "know" || state.active === "products" || state.active === "talk" || state.active === "quiz" || state.active === "why" || (!ev && isLeadersSurface(state.active))) tab = "know";
    else if (state.active === "leader") tab = canSeeShelfCustomers() ? "" : "team";
    else if (state.active === "customers") tab = "customers";
    else if (state.active === "leads") tab = "leads";
    else if (state.active === "ev-resources" || (ev && isLeadersSurface(state.active))) tab = "resources";
    else if (state.active === "ev-home" || state.active === "welcome" || state.active === "done") tab = "home";
    var tourWrap = document.getElementById("tour");
    var tourOpen = !!(tourWrap && tourWrap.classList.contains("open"));
    var btns = bar.querySelectorAll(".bottom-nav-btn");
    for (var i = 0; i < btns.length; i++) {
      var t = btns[i].getAttribute("data-tab");
      var isOn = !!tab && t === tab;
      btns[i].classList.toggle("on", isOn);
      /* Drop leftover coachmark / sticky focus so only one tab looks selected */
      if (!tourOpen) btns[i].classList.remove("tour-target-on");
      if (!isOn && document.activeElement === btns[i]) btns[i].blur();
    }
    var settingsBtn = document.getElementById("settingsNavBtn");
    if (settingsBtn) settingsBtn.classList.toggle("on", document.body.classList.contains("hub-menu-open"));
    paintEvTeamNavBtn();
    paintGroveBoardNavBtn();
    paintCabinetShareUI();
  }

  function renderGroundLeadSetup() {
    var setup = document.getElementById("groundLeadSetup");
    if (setup) setup.hidden = false;
    var signed = leadSignedIn();
    var ready = leadPageReady();
    var previewed = leadPreviewSeen();
    var steps = {
      signin: signed,
      link: ready,
      preview: previewed
    };
    Object.keys(steps).forEach(function (key) {
      var el = document.querySelector('[data-lead-step="' + key + '"]');
      if (el) el.classList.toggle("is-done", !!steps[key]);
    });
    var cta = document.getElementById("groundLeadCta");
    if (cta) {
      if (!signed) cta.textContent = "Sign in & open Leads →";
      else if (!ready) cta.textContent = "Open Leads — your link is on the way →";
      else cta.textContent = "Open Leads · preview again →";
    }
  }

  var knowSearchTimer = null;
  var faqSearchTimer = null;
  var knowSearchSnapshot = null;

  var KNOW_SEARCH_STOP = { the: 1, a: 1, an: 1, of: 1, to: 1, for: 1, and: 1, or: 1, in: 1, on: 1 };
  var KNOW_SEARCH_ALIASES = {
    quiz: ["quiz", "quizzes", "fresh match"],
    quizzes: ["quiz", "quizzes", "fresh match"],
    match: ["fresh match", "quiz"],
    faq: ["faq", "faqs", "questions"],
    faqs: ["faq", "faqs", "questions"],
    facts: ["company facts", "facts"],
    leader: ["leaders", "exclusively for leaders"],
    leaders: ["leaders", "exclusively for leaders"],
    upcycled: ["upcycled", "upcycled ingredients", "fruit seeds", "apple peel"],
    peptide: ["peptide", "peptides"],
    peptides: ["peptide", "peptides"],
    ceramide: ["ceramide", "ceramides"],
    ceramides: ["ceramide", "ceramides"]
  };

  function knowNorm(s) {
    return String(s || "").toLowerCase().replace(/[-'’]/g, " ").replace(/\s+/g, " ").trim();
  }

  function knowQueryTokens(q) {
    var tokens = knowNorm(q).split(" ").filter(function (t) {
      return t.length >= 2 && !KNOW_SEARCH_STOP[t];
    });
    if (!tokens.length) tokens = knowNorm(q).split(" ").filter(Boolean);
    return tokens;
  }

  function knowQueryMatches(hay, q) {
    hay = knowNorm(hay);
    if (!hay) return false;
    var tokens = knowQueryTokens(q);
    if (!tokens.length) return false;
    return tokens.every(function (t) {
      if (hay.indexOf(t) >= 0) return true;
      var aliases = KNOW_SEARCH_ALIASES[t];
      if (!aliases) return false;
      for (var i = 0; i < aliases.length; i++) {
        if (hay.indexOf(aliases[i]) >= 0) return true;
      }
      return false;
    });
  }

  function knowPanelCtas() {
    return document.querySelectorAll("#panel-know .prod-know-cta, #panel-know .know-leader-btn");
  }

  function knowCtaSearchBlob(cta) {
    var parts = [cta.getAttribute("data-know-q") || "", cta.textContent || ""];
    var goto = cta.getAttribute("data-goto") || "";
    if (goto === "why") {
      var Cwhy = window.FS.CONTENT || {};
      parts.push("why ringana company facts sustainability pillars");
      if (Cwhy.pillars) {
        Cwhy.pillars.forEach(function (p) {
          parts.push(p.title || "", p.body || "");
        });
      }
      if (Cwhy.productStory && Cwhy.productStory.posts) {
        Cwhy.productStory.posts.forEach(function (p) {
          parts.push(p.title || "", p.body || "");
        });
      }
      if (Cwhy.businessStory) {
        Cwhy.businessStory.forEach(function (p) {
          parts.push(p.title || "", p.body || "");
        });
      }
      if (Cwhy.funFacts) {
        Cwhy.funFacts.forEach(function (f) {
          parts.push(f.title || "", f.body || "");
        });
      }
    } else if (goto === "leaders") {
      var Lcopy = leadersCopy();
      parts.push(Lcopy.title || "", Lcopy.sub || "", Lcopy.intro || "");
      (Lcopy.cards || []).forEach(function (item) {
        parts.push((item && item.title) || "", (item && item.sub) || "", (item && item.blurb) || "");
      });
      (Lcopy.sections || []).forEach(function (sec) {
        parts.push((sec && sec.title) || "", (sec && sec.body) || "");
      });
      var Ccomp = (CFG && CFG.groveLeadersComp) || {};
      parts.push(Ccomp.title || "", Ccomp.sub || "");
      (Ccomp.cards || []).forEach(function (item) {
        parts.push((item && item.title) || "", (item && item.sub) || "");
      });
      (Lcopy.links || []).forEach(function (item) {
        parts.push((item && item.title) || "", (item && item.blurb) || "");
      });
    } else if (goto && goto !== "products") {
      var panel = document.getElementById("panel-" + goto);
      if (panel) parts.push(panel.textContent || "");
    }
    return parts.join(" ");
  }

  function knowSectionSearchBlob(sec) {
    var parts = [sec.getAttribute("data-know-q") || "", sec.textContent || ""];
    var C = window.FS.CONTENT || {};
    if (sec.id === "know-faqs") {
      flattenFaqs().forEach(function (f) {
        parts.push(f.q || "");
        parts.push(f.a || "");
        parts.push(f.catTitle || "");
      });
    }
    if (sec.id === "know-pillars" && C.pillars) {
      C.pillars.forEach(function (p) {
        parts.push(p.title || "");
        parts.push(p.body || "");
      });
    }
    if (sec.id === "know-facts" && C.funFacts) {
      C.funFacts.forEach(function (f) {
        parts.push(f.title || "");
        parts.push(f.body || "");
      });
    }
    if (sec.id === "know-product" && C.productStory && C.productStory.posts) {
      C.productStory.posts.forEach(function (p) {
        parts.push(p.title || "");
        parts.push(p.body || "");
      });
    }
    if (sec.id === "know-business" && C.businessStory) {
      C.businessStory.forEach(function (p) {
        parts.push(p.title || "");
        parts.push(p.body || "");
      });
    }
    return parts.join(" ").toLowerCase();
  }

  function firstMatchingFaqId(q) {
    if (!q) return "";
    var list = flattenFaqs();
    for (var i = 0; i < list.length; i++) {
      if (faqItemMatches(list[i], q, "faq_")) return list[i].id;
    }
    return "";
  }

  function faqCatForId(faqId) {
    var list = flattenFaqs();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === faqId) return list[i].cat;
    }
    return "";
  }

  function paintKnowRememberCallout() {
    var el = document.getElementById("knowRememberCallout");
    if (!el) return;
    el.hidden = !!(state.data && state.data.knowRememberDismissed);
  }

  function paintKnowSearchCtas(q) {
    var ctas = knowPanelCtas();
    var shown = 0;
    for (var i = 0; i < ctas.length; i++) {
      var cta = ctas[i];
      if (cta.classList.contains("leader-only") && !isOrgLeader()) {
        cta.hidden = true;
        continue;
      }
      var match = !q || knowQueryMatches(knowCtaSearchBlob(cta), q);
      cta.hidden = !match;
      if (match) shown++;
    }
    return shown;
  }

  function filterKnowSearch() {
    var input = document.getElementById("knowSearch");
    var empty = document.getElementById("knowSearchEmpty");
    var prodWrap = document.getElementById("knowSearchProducts");
    if (!input) return;
    var q = (input.value || "").trim().toLowerCase();
    var secs = document.querySelectorAll("#panel-know .know-acc");
    var shown = 0;
    var prodHits = [];

    if (q && !knowSearchSnapshot) {
      knowSearchSnapshot = { open: {}, openFaq: state.data.openFaq || "" };
      for (var s0 = 0; s0 < secs.length; s0++) {
        knowSearchSnapshot.open[secs[s0].id] = !!secs[s0].open;
      }
    }

    if (!q) {
      if (knowSearchSnapshot) {
        for (var s1 = 0; s1 < secs.length; s1++) {
          var secRestore = secs[s1];
          if (knowSearchSnapshot.open[secRestore.id] !== undefined) {
            secRestore.open = knowSearchSnapshot.open[secRestore.id];
          }
          secRestore.hidden = false;
        }
        if ((state.data.openFaq || "") !== knowSearchSnapshot.openFaq) {
          state.data.openFaq = knowSearchSnapshot.openFaq;
          renderKnowPanel(true);
        }
        knowSearchSnapshot = null;
      } else {
        for (var s2 = 0; s2 < secs.length; s2++) secs[s2].hidden = false;
      }
      paintKnowSearchCtas("");
      if (prodWrap) {
        prodWrap.hidden = true;
        prodWrap.innerHTML = "";
      }
      if (empty) empty.hidden = true;
      paintKnowRememberCallout();
      return;
    }

    shown += paintKnowSearchCtas(q);

    prodHits = productsMatchingQuery(q, 12);
    if (prodWrap) {
      if (prodHits.length) {
        prodWrap.hidden = false;
        prodWrap.innerHTML =
          '<div class="know-search-products-label">Products · ' + prodHits.length +
          (prodHits.length === 12 ? "+" : "") + " match" + (prodHits.length === 1 ? "" : "es") + "</div>" +
          renderProductListRows(prodHits);
      } else {
        prodWrap.hidden = true;
        prodWrap.innerHTML = "";
      }
    }

    var faqHit = firstMatchingFaqId(q);
    for (var i = 0; i < secs.length; i++) {
      var sec = secs[i];
      var match = knowQueryMatches(knowSectionSearchBlob(sec), q);
      if (sec.id === "know-faqs" && faqHit) match = true;
      sec.hidden = !match;
      if (match) {
        shown++;
        sec.open = true;
      }
    }
    if (faqHit && state.data.openFaq !== faqHit) {
      state.data.openFaq = faqHit;
      var hitCat = faqCatForId(faqHit);
      if (hitCat) ensureFaqCatOpen()[hitCat] = true;
      renderKnowPanel(true);
      /* Re-hide non-matching sections after FAQ re-render */
      var secs2 = document.querySelectorAll("#panel-know .know-acc");
      shown = paintKnowSearchCtas(q);
      for (var j = 0; j < secs2.length; j++) {
        var sec2 = secs2[j];
        var match2 = knowQueryMatches(knowSectionSearchBlob(sec2), q);
        if (sec2.id === "know-faqs" && faqHit) match2 = true;
        sec2.hidden = !match2;
        if (match2) {
          sec2.open = true;
          shown++;
        }
      }
    }
    if (empty) empty.hidden = shown > 0 || prodHits.length > 0;
  }

  function wireKnowSearch() {
    var input = document.getElementById("knowSearch");
    if (input && !input.dataset.bound) {
      input.dataset.bound = "1";
      input.setAttribute("spellcheck", "false");
      input.setAttribute("enterkeyhint", "search");
      input.addEventListener("input", function () {
        if (knowSearchTimer) clearTimeout(knowSearchTimer);
        knowSearchTimer = setTimeout(function () {
          knowSearchTimer = null;
          filterKnowSearch();
        }, 120);
      });
    }
    var dismiss = document.getElementById("knowRememberDismiss");
    if (dismiss && !dismiss.dataset.bound) {
      dismiss.dataset.bound = "1";
      dismiss.addEventListener("click", function () {
        if (!state.data) state.data = {};
        state.data.knowRememberDismissed = true;
        save();
        paintKnowRememberCallout();
      });
    }
    paintKnowRememberCallout();
    wireFaqSearch();
  }

  function wireFaqSearch() {
    var inputs = document.querySelectorAll(".faq-search");
    for (var i = 0; i < inputs.length; i++) {
      (function (input) {
        if (input.dataset.bound) return;
        input.dataset.bound = "1";
        input.value = (input.id === "evFaqSearch" ? state.data.faqQueryEv : state.data.faqQuery) || "";
        input.addEventListener("input", function () {
          if (input.id === "evFaqSearch") state.data.faqQueryEv = input.value || "";
          else state.data.faqQuery = input.value || "";
          if (faqSearchTimer) clearTimeout(faqSearchTimer);
          faqSearchTimer = setTimeout(function () {
            faqSearchTimer = null;
            renderFaqList();
          }, 80);
        });
      })(inputs[i]);
    }
  }

  function renderHomeRunway() {
    var wrap = document.getElementById("homeRunway");
    if (!wrap) return;
    var secs = visibleSections();
    var html = "";
    var nextOpen = null;
    for (var n = 0; n < secs.length; n++) {
      if (!state.done[secs[n].id] && isModuleUnlocked(secs[n].id)) {
        nextOpen = secs[n].id;
        break;
      }
    }
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      var locked = !isModuleUnlocked(s.id);
      var done = !!state.done[s.id];
      var isNext = !done && !locked && s.id === nextOpen;
      var cls = "home-step" +
        (done ? " done" : "") +
        (locked ? " locked" : "") +
        (isNext ? " next" : "");
      var status = done ? "Done" : (locked ? "Locked · finish the step above first" : (isNext ? "Up next" : "Ready when you are"));
      html += '<button type="button" class="' + cls + '" data-goto="' + s.id + '"' +
        (locked ? ' aria-disabled="true"' : "") + ">" +
        '<span class="home-step-num" aria-hidden="true">' + (done ? "✓" : String(i + 1)) + "</span>" +
        '<span class="home-step-main">' +
        '<span class="home-step-label">' + esc(s.label) + "</span>" +
        '<span class="home-step-sub">' + esc(s.sub) + "</span>" +
        '<span class="home-step-status">' + esc(status) + "</span>" +
        "</span></button>";
    }
    wrap.innerHTML = html;
  }

  var lastRoots = -1;
  var lastSecs = -1;
  var captionTimer;

  function pulsePlant(kind) {
    if (!homePlant) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    homePlant.classList.remove("roots-pulse", "sprout-pulse");
    void homePlant.offsetWidth;
    homePlant.classList.add(kind === "sprout" ? "sprout-pulse" : "roots-pulse");
    setTimeout(function () {
      homePlant.classList.remove("roots-pulse", "sprout-pulse");
    }, 1000);
  }

  var growthMomentTimer = null;
  var growthJoinTimer = null;
  var growthToastTimer = null;

  function showGrowthToast(msg) {
    var el = document.getElementById("growthToast");
    if (!el || !msg) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(growthToastTimer);
    growthToastTimer = setTimeout(function () { el.hidden = true; }, 2400);
  }

  function closeGrowthMoment() {
    var wrap = document.getElementById("growthMoment");
    if (!wrap) return;
    wrap.classList.remove("open", "is-join");
    wrap.hidden = true;
    var slot = document.getElementById("growthMomentPlant");
    if (slot) slot.classList.remove("roots-pulse", "sprout-pulse");
    clearTimeout(growthMomentTimer);
    clearTimeout(growthJoinTimer);
    growthMomentTimer = null;
    growthJoinTimer = null;
  }

  function openGrowthMoment(msg, kind, prev, next, opts) {
    var wrap = document.getElementById("growthMoment");
    var slot = document.getElementById("growthMomentPlant");
    var lab = document.getElementById("growthMomentMsg");
    var tip = document.getElementById("growthMomentTip");
    if (!wrap || !slot || !lab) return;
    opts = opts || {};
    var prevStage = plantVisualStage(prev.sprout, prev.sproutTotal);
    var nextStage = plantVisualStage(next.sprout, next.sproutTotal);
    slot.classList.remove("roots-pulse", "sprout-pulse");
    slot.innerHTML = window.FS.plantSVG(prevStage, prev.roots, ROOT_MAX, "m0_");
    lab.textContent = msg;
    wrap.classList.toggle("is-join", !!opts.join);
    var firstTip = !opts.hideTip && !state.data.growthMomentTipSeen;
    if (tip) {
      tip.hidden = !firstTip;
      if (firstTip) {
        state.data.growthMomentTipSeen = true;
        save();
      }
    }
    wrap.hidden = false;
    wrap.classList.add("open");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        slot.innerHTML = window.FS.plantSVG(nextStage, next.roots, ROOT_MAX, "m1_");
        if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
          slot.classList.add(kind === "sprout" ? "sprout-pulse" : "roots-pulse");
        }
      });
    });
    clearTimeout(growthMomentTimer);
    growthMomentTimer = setTimeout(closeGrowthMoment, opts.holdMs || (firstTip ? 3200 : 2400));
  }

  function celebrateGrowth(kind, msg, prev, next) {
    if (state.settings.growthMoment !== false) {
      openGrowthMoment(msg, kind, prev, next);
    } else if (state.settings.growthToast !== false) {
      showGrowthToast(msg);
    }
  }

  function celebrateLeadJoin(name) {
    var first = String(name || "").trim().split(/\s+/)[0] || "";
    if (first) first = first.charAt(0).toUpperCase() + first.slice(1);
    var msg = first
      ? "Congrats on nurturing " + first + " into the grove."
      : "Congrats on nurturing them into the grove.";
    var wrap = document.getElementById("growthMoment");
    var slot = document.getElementById("growthMomentPlant");
    var lab = document.getElementById("growthMomentMsg");
    var tip = document.getElementById("growthMomentTip");
    if (!wrap || !slot || !lab || typeof window.FS.plantJoinSVG !== "function") {
      showGrowthToast(msg);
      return;
    }
    var roots = typeof rootCount === "function" ? rootCount() : 0;
    var progress = typeof checklistProgress === "function" ? checklistProgress() : { sproutDone: 0, sproutTotal: 0 };
    var stage = plantVisualStage(progress.sproutDone || 0, progress.sproutTotal || 0);
    slot.classList.remove("roots-pulse", "sprout-pulse");
    slot.innerHTML = window.FS.plantJoinSVG(stage, roots, ROOT_MAX, "j0_", false);
    lab.textContent = msg;
    if (tip) tip.hidden = true;
    wrap.classList.add("is-join");
    wrap.hidden = false;
    wrap.classList.add("open");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    clearTimeout(growthJoinTimer);
    clearTimeout(growthMomentTimer);
    function showBaby() {
      if (!wrap.classList.contains("open")) return;
      slot.innerHTML = window.FS.plantJoinSVG(stage, roots, ROOT_MAX, "j1_", true);
      if (!reduce) slot.classList.add("sprout-pulse");
    }
    if (reduce) {
      showBaby();
    } else {
      growthJoinTimer = setTimeout(showBaby, 560);
    }
    growthMomentTimer = setTimeout(closeGrowthMoment, 3600);
  }

  var pendingGrowth = null;
  var growthIdleTimer = null;
  var growthBlurTimer = null;
  var GROWTH_IDLE_MS = 1600;
  var lastSproutTotal = -1;

  function growthMessage(kind, roots, sproutDone, sproutTotal) {
    if (kind === "roots") {
      return roots >= ROOT_MAX
        ? "Root " + ROOT_MAX + " in — next checklist items sprout above ground."
        : "Root " + roots + " of " + ROOT_MAX + " grew underground.";
    }
    return sproutTotal > 0 && sproutDone >= sproutTotal
      ? "Full bloom — you finished the growth checklist."
      : "Checklist item done — your sprout grew (" + sproutDone + "/" + sproutTotal + ").";
  }

  function clearPendingGrowth() {
    clearTimeout(growthIdleTimer);
    growthIdleTimer = null;
    clearTimeout(growthBlurTimer);
    growthBlurTimer = null;
    pendingGrowth = null;
  }

  function flushPendingGrowth() {
    if (!pendingGrowth) {
      clearTimeout(growthIdleTimer);
      growthIdleTimer = null;
      return;
    }
    if (typingInField() || keyboardInset() > 72) {
      scheduleGrowthFlush();
      return;
    }
    var p = pendingGrowth;
    clearPendingGrowth();
    var roots;
    var progress;
    if (packEvergreen()) {
      progress = evProgress();
      roots = progress.roots;
    } else {
      roots = rootCount();
      progress = checklistProgress();
    }
    var next = { roots: roots, sprout: progress.sproutDone, sproutTotal: progress.sproutTotal };
    var kind = next.sprout > p.prev.sprout ? "sprout" : "roots";
    var msg = growthMessage(kind, next.roots, next.sprout, next.sproutTotal);
    if (packEvergreen()) pulseEvPlant();
    else pulsePlant(kind);
    highlightCaption(msg);
    celebrateGrowth(kind, msg, p.prev, next);
  }

  function scheduleGrowthFlush() {
    clearTimeout(growthBlurTimer);
    growthBlurTimer = setTimeout(function () {
      growthBlurTimer = null;
      if (pendingGrowth && !typingInField() && keyboardInset() <= 72) flushPendingGrowth();
      else if (pendingGrowth) scheduleGrowthFlush();
    }, 480);
  }

  function typingInField() {
    var ae = document.activeElement;
    if (!ae || !ae.tagName) return false;
    var tag = ae.tagName;
    if (tag === "TEXTAREA") return true;
    if (tag === "INPUT") {
      var typ = (ae.type || "text").toLowerCase();
      return typ !== "button" && typ !== "submit" && typ !== "checkbox" && typ !== "radio" && typ !== "hidden";
    }
    return false;
  }

  function queueGrowthCelebration(kind, msg, prev, next) {
    if (!pendingGrowth) {
      pendingGrowth = { kind: kind, msg: msg, prev: prev, next: next };
    } else {
      pendingGrowth.kind = kind;
      pendingGrowth.msg = msg;
      pendingGrowth.next = next;
    }
    clearTimeout(growthIdleTimer);
    growthIdleTimer = null;
    /* Don't pop the overlay while the keyboard is still covering the page. */
    if (typingInField()) return;
    growthIdleTimer = setTimeout(flushPendingGrowth, GROWTH_IDLE_MS);
  }

  function syncGrowthSettingsUI() {
    var moment = document.getElementById("optGrowthMoment");
    var toast = document.getElementById("optGrowthToast");
    if (moment) moment.checked = state.settings.growthMoment !== false;
    if (toast) toast.checked = state.settings.growthToast !== false;
  }

  function syncWeekStartSettingsUI() {
    var sun = document.getElementById("weekStartSun");
    var mon = document.getElementById("weekStartMon");
    var isMon = state.settings.weekStartsOn === "monday";
    if (sun) sun.classList.toggle("on", !isMon);
    if (mon) mon.classList.toggle("on", isMon);
    var leadOpt = document.getElementById("optCalLeadFollowUps");
    if (leadOpt) leadOpt.checked = state.data.calendarLeadFollowUps === true;
    var quiet = Number(state.data.leadFollowQuietDays) || 3;
    if (quiet !== 2 && quiet !== 3 && quiet !== 5 && quiet !== 7) quiet = 3;
    var quietBtns = document.querySelectorAll("[data-follow-quiet]");
    for (var qi = 0; qi < quietBtns.length; qi++) {
      quietBtns[qi].classList.toggle("on", Number(quietBtns[qi].getAttribute("data-follow-quiet")) === quiet);
    }
    var maxN = Number(state.data.leadFollowMax) || 2;
    if (maxN !== 1 && maxN !== 2 && maxN !== 3) maxN = 2;
    var maxBtns = document.querySelectorAll("[data-follow-max]");
    for (var mi = 0; mi < maxBtns.length; mi++) {
      maxBtns[mi].classList.toggle("on", Number(maxBtns[mi].getAttribute("data-follow-max")) === maxN);
    }
    var includeNew = document.getElementById("optLeadFollowIncludeNew");
    if (includeNew) includeNew.checked = state.data.leadFollowIncludeNew !== false;
  }

  function setWeekStartsOn(value) {
    var next = value === "monday" ? "monday" : "sunday";
    if (state.settings.weekStartsOn === next) return;
    state.settings.weekStartsOn = next;
    save();
    syncWeekStartSettingsUI();
    renderPanels();
  }

  function wireWeekStartSettings() {
    var sun = document.getElementById("weekStartSun");
    var mon = document.getElementById("weekStartMon");
    if (sun && !sun.dataset.bound) {
      sun.dataset.bound = "1";
      sun.addEventListener("click", function () { setWeekStartsOn("sunday"); });
    }
    if (mon && !mon.dataset.bound) {
      mon.dataset.bound = "1";
      mon.addEventListener("click", function () { setWeekStartsOn("monday"); });
    }
    var viewGrove = document.getElementById("viewAsGrove");
    var viewEv = document.getElementById("viewAsEvergreen");
    var viewAsIgnoreUntil = 0;
    function applyViewAs(slug) {
      if (Date.now() < viewAsIgnoreUntil) return;
      var Cloud = window.FS.Cloud;
      if (!(Cloud && Cloud.isSuperAdmin && Cloud.isSuperAdmin())) return;
      if (window.FS.Pack && window.FS.Pack.active && window.FS.Pack.active() === slug) return;
      /* Switching packs remounts Settings under the finger. The leftover
         click used to land on Fresh Grove and snap the preview back. */
      viewAsIgnoreUntil = Date.now() + 500;
      if (window.FS.armDismissGuard) window.FS.armDismissGuard(500);
      if (window.FS.Pack && window.FS.Pack.setViewAs) window.FS.Pack.setViewAs(slug);
      if (window.FS.BridgeUI && window.FS.BridgeUI.invalidateOrgEvents) {
        window.FS.BridgeUI.invalidateOrgEvents();
      }
      evZoomCache = { at: 0, zoom: null, inflight: false };
      applyPackChrome();
      renderBrand();
      renderNav();
      renderPanels();
      try { liveRefresh({ silent: true }); } catch (e) {}
    }
    function bindViewAsBtn(btn, slug) {
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = "1";
      function go(e) {
        if (e.button && e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        applyViewAs(slug);
      }
      btn.addEventListener("pointerdown", go);
      btn.addEventListener("click", go);
    }
    bindViewAsBtn(viewGrove, "fresh-grove");
    bindViewAsBtn(viewEv, "evergreen-co");
    var evCopy = document.getElementById("evergreenCopyJoin");
    if (evCopy && !evCopy.dataset.bound) {
      evCopy.dataset.bound = "1";
      evCopy.addEventListener("click", function () {
        var unique = evergreenPersonInviteUrl();
        var idle = unique ? "Copy my link to join" : "Copy invite link";
        copyEvergreenJoin(evCopy, idle, unique);
      });
    }
    var leadOpt = document.getElementById("optCalLeadFollowUps");
    if (leadOpt && !leadOpt.dataset.bound) {
      leadOpt.dataset.bound = "1";
      leadOpt.addEventListener("change", function () {
        state.data.calendarLeadFollowUps = !!leadOpt.checked;
        save();
        if (window.FS.BridgeUI && window.FS.BridgeUI.renderCalendar) {
          window.FS.BridgeUI.renderCalendar();
        }
        if (window.FS.BridgeUI && window.FS.BridgeUI.renderLeadsList) {
          window.FS.BridgeUI.renderLeadsList();
        }
      });
    }
    function refreshLeadFollowViews() {
      save();
      syncWeekStartSettingsUI();
      if (window.FS.BridgeUI && window.FS.BridgeUI.renderCalendar) {
        window.FS.BridgeUI.renderCalendar();
      }
      if (window.FS.BridgeUI && window.FS.BridgeUI.renderLeadsList) {
        window.FS.BridgeUI.renderLeadsList();
      }
    }
    var quietLane = document.getElementById("leadFollowQuietLane");
    if (quietLane && !quietLane.dataset.bound) {
      quietLane.dataset.bound = "1";
      quietLane.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-follow-quiet]");
        if (!btn) return;
        var n = Number(btn.getAttribute("data-follow-quiet"));
        if (n !== 2 && n !== 3 && n !== 5 && n !== 7) return;
        state.data.leadFollowQuietDays = n;
        refreshLeadFollowViews();
      });
    }
    var maxLane = document.getElementById("leadFollowMaxLane");
    if (maxLane && !maxLane.dataset.bound) {
      maxLane.dataset.bound = "1";
      maxLane.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-follow-max]");
        if (!btn) return;
        var n = Number(btn.getAttribute("data-follow-max"));
        if (n !== 1 && n !== 2 && n !== 3) return;
        state.data.leadFollowMax = n;
        refreshLeadFollowViews();
      });
    }
    var includeNew = document.getElementById("optLeadFollowIncludeNew");
    if (includeNew && !includeNew.dataset.bound) {
      includeNew.dataset.bound = "1";
      includeNew.addEventListener("change", function () {
        state.data.leadFollowIncludeNew = !!includeNew.checked;
        refreshLeadFollowViews();
      });
    }
    var allOn = document.getElementById("leadFollowAllOn");
    var allOff = document.getElementById("leadFollowAllOff");
    function applyAllFollowUps(on) {
      if (window.FS.BridgeUI && window.FS.BridgeUI.setAllLeadFollowUps) {
        Promise.resolve(window.FS.BridgeUI.setAllLeadFollowUps(on)).then(function () {
          syncWeekStartSettingsUI();
        }).catch(function (err) {
          FS.UI.toast((err && err.message) || "Could not update follow-ups.", { tone: "bad" });
        });
        return;
      }
      state.data.calendarLeadFollowUps = !!on;
      save();
      syncWeekStartSettingsUI();
    }
    if (allOn && !allOn.dataset.bound) {
      allOn.dataset.bound = "1";
      allOn.addEventListener("click", function () { applyAllFollowUps(true); });
    }
    if (allOff && !allOff.dataset.bound) {
      allOff.dataset.bound = "1";
      allOff.addEventListener("click", function () { applyAllFollowUps(false); });
    }
  }

  function wireGrowthSettings() {
    var moment = document.getElementById("optGrowthMoment");
    var toast = document.getElementById("optGrowthToast");
    if (moment && !moment.dataset.bound) {
      moment.dataset.bound = "1";
      moment.addEventListener("change", function () {
        state.settings.growthMoment = !!moment.checked;
        save();
      });
    }
    if (toast && !toast.dataset.bound) {
      toast.dataset.bound = "1";
      toast.addEventListener("change", function () {
        state.settings.growthToast = !!toast.checked;
        save();
      });
    }
    var hit = document.getElementById("growthMomentHit");
    var card = document.querySelector(".growth-moment-card");
    if (hit && !hit.dataset.bound) {
      hit.dataset.bound = "1";
      hit.addEventListener("click", closeGrowthMoment);
    }
    if (card && !card.dataset.bound) {
      card.dataset.bound = "1";
      card.addEventListener("click", closeGrowthMoment);
    }
  }

  function syncSettingsNameUI() {
    var first = document.getElementById("settingsFirstName");
    var last = document.getElementById("settingsLastName");
    if (first) {
      var storedFirst = partnerName();
      if (isPlaceholderFirst(storedFirst)) first.value = "";
      else first.value = storedFirst;
    }
    if (last) last.value = partnerLastName();
    var msg = document.getElementById("settingsNameMsg");
    if (msg) msg.textContent = "";
    syncSettingsPhotoUI();
  }

  function settingsPhotoPerson() {
    var Cloud = window.FS.Cloud;
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    return {
      id: user && user.id,
      display_name: (user && user.display_name) || firstName() || "You",
      photo_at: user && user.photo_at,
      photo_ext: user && user.photo_ext
    };
  }

  var grovePhotoPreviewUrl = "";
  var pendingGrovePhoto = null;
  var photoCropSession = null;

  function setGrovePhotoPreview(blob) {
    if (grovePhotoPreviewUrl) {
      try { URL.revokeObjectURL(grovePhotoPreviewUrl); } catch (e) {}
    }
    grovePhotoPreviewUrl = blob ? URL.createObjectURL(blob) : "";
  }

  function paintPhotoFace(el, letter) {
    if (!el) return;
    var Cloud = window.FS.Cloud;
    var url = grovePhotoPreviewUrl || (Cloud && Cloud.grovePhotoUrl ? Cloud.grovePhotoUrl(settingsPhotoPerson(), "full") : "");
    if (url) {
      el.className = "person-photo is-lg";
      el.innerHTML = '<img src="' + String(url).replace(/"/g, "") + '" alt="" width="88" height="88">';
      var img = el.querySelector("img");
      if (img && !grovePhotoPreviewUrl) {
        img.onerror = function () {
          el.className = "person-photo is-lg is-letter";
          el.textContent = letter;
        };
      }
    } else {
      el.className = "person-photo is-lg is-letter";
      el.textContent = letter;
    }
  }

  function syncSettingsPhotoUI() {
    var person = settingsPhotoPerson();
    var letter = String(person.display_name || "Y").trim().charAt(0).toUpperCase() || "•";
    paintPhotoFace(document.getElementById("settingsPhotoFace"), letter);
    paintPhotoFace(document.getElementById("onboardPhotoFace"), letter);
    var url = grovePhotoPreviewUrl || (window.FS.Cloud && window.FS.Cloud.grovePhotoUrl && window.FS.Cloud.grovePhotoUrl(person, "full"));
    var remove = document.getElementById("settingsPhotoRemove");
    var add = document.getElementById("settingsPhotoAdd");
    var label = document.getElementById("onboardPhotoLabel");
    if (remove) remove.hidden = !url;
    if (add) add.textContent = url ? "Change photo" : "Add a photo";
    if (label) {
      label.innerHTML = url
        ? "Looking good <span>(tap to move)</span>"
        : "Add a photo <span>(optional)</span>";
    }
  }

  function syncOnboardPhotoWrap() {
    var wrap = document.getElementById("onboardPhotoWrap");
    if (!wrap) return;
    var show = !packEvergreen();
    wrap.hidden = !show;
    if (show) syncSettingsPhotoUI();
  }

  function afterGrovePhotoChange() {
    syncSettingsPhotoUI();
  }

  function loadCropBitmap(file) {
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

  function clampCrop() {
    var s = photoCropSession;
    if (!s) return;
    var minZ = s.stage / Math.min(s.srcW, s.srcH);
    var maxZ = minZ * 4;
    if (s.z < minZ) s.z = minZ;
    if (s.z > maxZ) s.z = maxZ;
    var dw = s.srcW * s.z;
    var dh = s.srcH * s.z;
    if (s.x > 0) s.x = 0;
    if (s.y > 0) s.y = 0;
    if (s.x < s.stage - dw) s.x = s.stage - dw;
    if (s.y < s.stage - dh) s.y = s.stage - dh;
  }

  function paintPhotoCrop() {
    var s = photoCropSession;
    if (!s || !s.canvas) return;
    s.canvas.style.width = (s.srcW * s.z) + "px";
    s.canvas.style.height = (s.srcH * s.z) + "px";
    s.canvas.style.transform = "translate(" + s.x + "px," + s.y + "px)";
  }

  function cropRectFromSession() {
    var s = photoCropSession;
    if (!s) return null;
    var side = s.stage / s.z;
    return {
      sx: Math.round(-s.x / s.z),
      sy: Math.round(-s.y / s.z),
      side: side
    };
  }

  function closePhotoCrop(result) {
    var overlay = document.getElementById("photoCropOverlay");
    var s = photoCropSession;
    photoCropSession = null;
    document.body.classList.remove("photo-crop-open");
    if (overlay) overlay.hidden = true;
    if (s && s.bmp && typeof s.bmp.close === "function") {
      try { s.bmp.close(); } catch (e) {}
    }
    if (s && s.done) s.done(result || null);
  }

  async function openPhotoCrop(file) {
    closePhotoCrop(null);
    var overlay = document.getElementById("photoCropOverlay");
    var stage = document.getElementById("photoCropStage");
    var canvas = document.getElementById("photoCropCanvas");
    var msg = document.getElementById("photoCropMsg");
    if (!overlay || !stage || !canvas) return null;
    if (msg) msg.textContent = "";
    var bmp = await loadCropBitmap(file);
    var srcW = bmp.width || bmp.naturalWidth || 0;
    var srcH = bmp.height || bmp.naturalHeight || 0;
    if (!srcW || !srcH) throw new Error("Couldn’t read that photo.");
    var maxEdge = 1024;
    var drawScale = Math.min(1, maxEdge / Math.max(srcW, srcH));
    canvas.width = Math.max(1, Math.round(srcW * drawScale));
    canvas.height = Math.max(1, Math.round(srcH * drawScale));
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    overlay.hidden = false;
    document.body.classList.add("photo-crop-open");
    var stageSize = Math.round(stage.getBoundingClientRect().width) || 280;
    photoCropSession = {
      file: file,
      bmp: bmp,
      canvas: canvas,
      srcW: srcW,
      srcH: srcH,
      stage: stageSize,
      z: stageSize / Math.min(srcW, srcH),
      x: 0,
      y: 0,
      done: null
    };
    clampCrop();
    photoCropSession.x = (stageSize - srcW * photoCropSession.z) / 2;
    photoCropSession.y = (stageSize - srcH * photoCropSession.z) / 2;
    clampCrop();
    paintPhotoCrop();
    return new Promise(function (resolve) {
      photoCropSession.done = resolve;
    });
  }

  function wirePhotoCrop() {
    var stage = document.getElementById("photoCropStage");
    var useBtn = document.getElementById("photoCropUse");
    var cancel = document.getElementById("photoCropCancel");
    if (stage && !stage.dataset.bound) {
      stage.dataset.bound = "1";
      var pointers = {};
      var lastPinch = 0;
      function pointCount() { return Object.keys(pointers).length; }
      stage.addEventListener("pointerdown", function (e) {
        if (!photoCropSession) return;
        stage.setPointerCapture(e.pointerId);
        pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
        stage.classList.add("is-drag");
        if (pointCount() === 2) {
          var ids = Object.keys(pointers);
          var a = pointers[ids[0]];
          var b = pointers[ids[1]];
          lastPinch = Math.hypot(a.x - b.x, a.y - b.y);
        }
      });
      stage.addEventListener("pointermove", function (e) {
        if (!photoCropSession || !pointers[e.pointerId]) return;
        var prev = pointers[e.pointerId];
        pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
        if (pointCount() >= 2) {
          var ids = Object.keys(pointers);
          var a = pointers[ids[0]];
          var b = pointers[ids[1]];
          var dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (lastPinch) {
            var midX = photoCropSession.stage / 2;
            var midY = photoCropSession.stage / 2;
            var srcX = (midX - photoCropSession.x) / photoCropSession.z;
            var srcY = (midY - photoCropSession.y) / photoCropSession.z;
            photoCropSession.z *= dist / lastPinch;
            clampCrop();
            photoCropSession.x = midX - srcX * photoCropSession.z;
            photoCropSession.y = midY - srcY * photoCropSession.z;
            clampCrop();
            paintPhotoCrop();
          }
          lastPinch = dist;
          return;
        }
        photoCropSession.x += e.clientX - prev.x;
        photoCropSession.y += e.clientY - prev.y;
        clampCrop();
        paintPhotoCrop();
      });
      function endPointer(e) {
        delete pointers[e.pointerId];
        if (!pointCount()) {
          stage.classList.remove("is-drag");
          lastPinch = 0;
        }
      }
      stage.addEventListener("pointerup", endPointer);
      stage.addEventListener("pointercancel", endPointer);
      stage.addEventListener("wheel", function (e) {
        if (!photoCropSession) return;
        e.preventDefault();
        var midX = photoCropSession.stage / 2;
        var midY = photoCropSession.stage / 2;
        var srcX = (midX - photoCropSession.x) / photoCropSession.z;
        var srcY = (midY - photoCropSession.y) / photoCropSession.z;
        photoCropSession.z *= e.deltaY < 0 ? 1.08 : 0.92;
        clampCrop();
        photoCropSession.x = midX - srcX * photoCropSession.z;
        photoCropSession.y = midY - srcY * photoCropSession.z;
        clampCrop();
        paintPhotoCrop();
      }, { passive: false });
    }
    if (useBtn && !useBtn.dataset.bound) {
      useBtn.dataset.bound = "1";
      useBtn.addEventListener("click", function () {
        var s = photoCropSession;
        if (!s) return;
        closePhotoCrop({ file: s.file, crop: cropRectFromSession() });
      });
    }
    if (cancel && !cancel.dataset.bound) {
      cancel.dataset.bound = "1";
      cancel.addEventListener("click", function () { closePhotoCrop(null); });
    }
  }

  async function pickGrovePhoto(file, crop) {
    var msg = document.getElementById("settingsPhotoMsg");
    var add = document.getElementById("settingsPhotoAdd");
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) {
      pendingGrovePhoto = { file: file, crop: crop };
      setGrovePhotoPreview(file);
      syncSettingsPhotoUI();
      if (msg) msg.textContent = "";
      return;
    }
    if (msg) msg.textContent = "Saving…";
    if (add) add.disabled = true;
    try {
      var result = await Cloud.uploadGrovePhoto(file, crop);
      if (result && result.preview) setGrovePhotoPreview(result.preview);
      pendingGrovePhoto = null;
      if (msg) msg.textContent = "";
      afterGrovePhotoChange();
    } catch (err) {
      if (msg) msg.textContent = (err && err.message) || "Couldn’t save that photo.";
    } finally {
      if (add) add.disabled = false;
    }
  }

  function flushPendingGrovePhoto() {
    if (!pendingGrovePhoto) return;
    if (packEvergreen()) {
      pendingGrovePhoto = null;
      return;
    }
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn() || !Cloud.uploadGrovePhoto) return;
    var job = pendingGrovePhoto;
    Cloud.uploadGrovePhoto(job.file, job.crop).then(function (result) {
      if (pendingGrovePhoto === job) pendingGrovePhoto = null;
      if (result && result.preview) setGrovePhotoPreview(result.preview);
      afterGrovePhotoChange();
    }).catch(function (err) {
      var msg = document.getElementById("settingsPhotoMsg");
      if (msg) msg.textContent = (err && err.message) || "Couldn’t save that photo. Try again.";
    });
  }

  function openGrovePhotoPicker() {
    if (packEvergreen()) return;
    var Cloud = window.FS.Cloud;
    var fromHub = document.body.classList.contains("hub-menu-open");
    if (fromHub && Cloud && Cloud.isSignedIn && !Cloud.isSignedIn()) {
      var msg = document.getElementById("settingsPhotoMsg");
      if (msg) msg.textContent = "Sign in to add a photo.";
      return;
    }
    var input = document.getElementById("settingsPhotoInput");
    if (input) input.click();
  }

  function wireSettingsPhoto() {
    var input = document.getElementById("settingsPhotoInput");
    var add = document.getElementById("settingsPhotoAdd");
    var btn = document.getElementById("settingsPhotoBtn");
    var remove = document.getElementById("settingsPhotoRemove");
    var onboardBtn = document.getElementById("onboardPhotoBtn");
    wirePhotoCrop();
    if (input && !input.dataset.bound) {
      input.dataset.bound = "1";
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        input.value = "";
        if (!file) return;
        openPhotoCrop(file).then(function (picked) {
          if (picked && picked.file) pickGrovePhoto(picked.file, picked.crop);
        }).catch(function (err) {
          var msg = document.getElementById("settingsPhotoMsg");
          if (msg) msg.textContent = (err && err.message) || "Couldn’t read that photo.";
        });
      });
    }
    if (add && !add.dataset.bound) {
      add.dataset.bound = "1";
      add.addEventListener("click", openGrovePhotoPicker);
    }
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", openGrovePhotoPicker);
    }
    if (onboardBtn && !onboardBtn.dataset.bound) {
      onboardBtn.dataset.bound = "1";
      onboardBtn.addEventListener("click", openGrovePhotoPicker);
    }
    if (remove && !remove.dataset.bound) {
      remove.dataset.bound = "1";
      remove.addEventListener("click", async function () {
        var msg = document.getElementById("settingsPhotoMsg");
        var Cloud = window.FS.Cloud;
        if (!Cloud || !Cloud.clearGrovePhoto) return;
        remove.disabled = true;
        try {
          await Cloud.clearGrovePhoto();
          setGrovePhotoPreview(null);
          pendingGrovePhoto = null;
          if (msg) msg.textContent = "";
          afterGrovePhotoChange();
        } catch (err) {
          if (msg) msg.textContent = (err && err.message) || "Couldn’t remove that photo.";
        } finally {
          remove.disabled = false;
        }
      });
    }
  }

  function wireSettingsInstagram() {
    var btn = document.getElementById("settingsInstagramSave");
    if (!btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", async function () {
      var input = document.getElementById("settingsInstagram");
      var msg = document.getElementById("settingsInstagramMsg");
      var Cloud = window.FS.Cloud;
      if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) {
        if (msg) msg.textContent = "Sign in to save your Instagram.";
        return;
      }
      btn.disabled = true;
      var idle = btn.textContent;
      btn.textContent = "Saving…";
      try {
        var saved = await Cloud.setGroveInstagram(input ? input.value : "");
        if (input) input.value = saved || "";
        if (msg) msg.textContent = saved ? "Saved @" + saved + "." : "Cleared.";
        if (typeof window.FS.refreshGroveDoorPanel === "function") {
          window.FS.refreshGroveDoorPanel();
        }
      } catch (err) {
        if (msg) msg.textContent = (err && err.message) || "Could not save Instagram.";
      } finally {
        btn.disabled = false;
        btn.textContent = idle;
      }
    });
  }

  function wireSettingsName() {
    var btn = document.getElementById("settingsNameSave");
    if (!btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", async function () {
      var firstEl = document.getElementById("settingsFirstName");
      var lastEl = document.getElementById("settingsLastName");
      var msg = document.getElementById("settingsNameMsg");
      var first = firstEl ? firstEl.value.trim() : "";
      var last = lastEl ? lastEl.value.trim() : "";
      if (!first) {
        if (msg) msg.textContent = "Add your first name.";
        return;
      }
      if (window.FS.Cloud && window.FS.Cloud.isPlaceholderName && window.FS.Cloud.isPlaceholderName(first.split(/\s+/)[0])) {
        if (msg) msg.textContent = "Use the first name you actually go by.";
        return;
      }
      if (!last) {
        if (msg) msg.textContent = "Add your last name too — it helps on the team tree.";
        return;
      }
      btn.disabled = true;
      var idle = btn.textContent;
      btn.textContent = "Saving…";
      state.settings.partnerName = first;
      state.settings.partnerLastName = last;
      /* Avoid "Jessica Smith" + last "Smith" staying doubled in first name */
      var fl = first.toLowerCase();
      var ll = last.toLowerCase();
      if (fl.endsWith(" " + ll)) {
        state.settings.partnerName = first.slice(0, first.length - last.length).trim();
      }
      save({ immediate: true });
      renderGreetings();
      syncSettingsNameUI();
      try {
        var Cloud = howGrowCloud();
        if (Cloud && Cloud.isSignedIn()) {
          await Cloud.updateProfile({ display_name: partnerName(), last_name: last });
          await Cloud.pushProgress({
            active: state.active,
            data: state.data,
            done: state.done,
            calendar: state.data.calendar || {},
            cheers: state.cheers || [],
            settings: state.settings,
            tourDone: state.tourDone
          });
        }
        if (msg) msg.textContent = "Saved.";
      } catch (e) {
        if (msg) msg.textContent = "Saved on this device. Cloud update can retry next sync.";
      } finally {
        btn.disabled = false;
        btn.textContent = idle || "Save name";
      }
    });
  }

  function highlightCaption(msg) {
    if (!caption) return;
    caption.textContent = msg;
    caption.classList.add("highlight");
    clearTimeout(captionTimer);
    captionTimer = setTimeout(function () { caption.classList.remove("highlight"); }, 1600);
  }

  function plantCaptionFor(roots, sproutDone, sproutTotal) {
    if (sproutDone === 0) {
      if (roots === 0) return "Seed on the dirt. Answer the three Roots blurbs to grow underground.";
      if (roots < ROOT_MAX) return "Roots growing · " + roots + " of " + ROOT_MAX + ". Each checklist item after Roots sprouts the plant.";
      return "Roots are in. Finish a check above ground to grow your sprout.";
    }
    if (sproutTotal > 0 && sproutDone >= sproutTotal) return "Full bloom — every check is done.";
    return sproutDone + " of " + sproutTotal + " checks done — each one grows your sprout.";
  }

  function plantVisualStage(sproutDone, sproutTotal) {
    if (sproutDone <= 0) return 0;
    if (sproutTotal > 0 && sproutDone >= sproutTotal) return 6;
    if (sproutTotal <= 1) return Math.min(5, Math.max(1, sproutDone));
    /* Stages 1–5 map across the full runway checklist (not a partial slice) */
    var stage = Math.ceil((sproutDone / sproutTotal) * 5);
    return Math.max(1, Math.min(5, stage));
  }

  function renderPlant(opts) {
    opts = opts || {};
    var roots = rootCount();
    var progress = checklistProgress();
    var sproutDone = progress.sproutDone;
    var sproutTotal = progress.sproutTotal;
    var visualSecs = plantVisualStage(sproutDone, sproutTotal);
    var plantKey = visualSecs + ":" + roots + ":" + sproutDone + ":" + sproutTotal;

    var grewRoots = !opts.silent && lastRoots >= 0 && roots > lastRoots;
    var grewSprout = !opts.silent && lastSprout >= 0 && sproutDone > lastSprout;
    var prevSnap = {
      roots: Math.max(0, lastRoots),
      sprout: Math.max(0, lastSprout),
      sproutTotal: lastSproutTotal >= 0 ? lastSproutTotal : sproutTotal
    };
    var nextSnap = { roots: roots, sprout: sproutDone, sproutTotal: sproutTotal };

    if (homePlant) {
      if (opts.force || homePlant.dataset.plantKey !== plantKey) {
        homePlant.dataset.plantKey = plantKey;
        homePlant.innerHTML = window.FS.plantSVG(visualSecs, roots, ROOT_MAX, "h_");
      }
    }
    if (finishPlant) finishPlant.innerHTML = window.FS.plantSVG(6, ROOT_MAX, ROOT_MAX, "f_");

    var pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    var track = document.getElementById("progressTrack");
    if (track) track.setAttribute("aria-valuenow", String(pct));
    var label = document.getElementById("progressLabel");
    if (label) label.textContent = "Growth " + pct + "%";
    var homePct = document.getElementById("homePctLabel");
    if (homePct) homePct.textContent = pct + "%";

    var statRoots = document.getElementById("statRoots");
    var statMods = document.getElementById("statModules");
    if (statRoots) statRoots.innerHTML = "<em>Roots</em> " + roots + "/" + ROOT_MAX;
    if (statMods) statMods.innerHTML = "<em>Checks</em> " + sproutDone + "/" + sproutTotal;

    if (grewRoots) {
      var rootMsg = growthMessage("roots", roots, sproutDone, sproutTotal);
      if (opts.deferCelebrate) {
        if (caption) caption.textContent = plantCaptionFor(roots, sproutDone, sproutTotal);
        queueGrowthCelebration("roots", rootMsg, prevSnap, nextSnap);
      } else {
        clearPendingGrowth();
        pulsePlant("roots");
        highlightCaption(rootMsg);
        celebrateGrowth("roots", rootMsg, prevSnap, nextSnap);
      }
    } else if (grewSprout) {
      var sproutMsg = growthMessage("sprout", roots, sproutDone, sproutTotal);
      if (opts.deferCelebrate) {
        if (caption) caption.textContent = plantCaptionFor(roots, sproutDone, sproutTotal);
        queueGrowthCelebration("sprout", sproutMsg, prevSnap, nextSnap);
      } else {
        clearPendingGrowth();
        pulsePlant("sprout");
        highlightCaption(sproutMsg);
        celebrateGrowth("sprout", sproutMsg, prevSnap, nextSnap);
      }
    } else if (caption && !caption.classList.contains("highlight")) {
      caption.textContent = plantCaptionFor(roots, sproutDone, sproutTotal);
    }
    lastRoots = roots;
    lastSprout = sproutDone;
    lastSproutTotal = sproutTotal;
    lastSecs = typeof doneCount === "function" ? doneCount() : visualSecs;
  }

  function normalizePanelId(id) {
    if (id === "calendar" || id === "ev-dates") return "tend";
    if (id === "tree") return "grove";
    if (id === "ev-links") return "ev-resources";
    return id;
  }

  function isLearnSurface(id) {
    id = normalizePanelId(id);
    if (isLeadersSurface(id)) return !packEvergreen();
    return id === "know" || id === "talk" || id === "products" || id === "quiz" || id === "why";
  }

  function isContentTabSurface(id) {
    id = normalizePanelId(id);
    return id === "tend" || id === "curiosity-photos" || id === "content-vault" ||
      id === "content-stories" || id === "content-week" || id === "grove-shelf";
  }

  function pageScroller() {
    var layout = document.querySelector(".layout");
    if (!layout) return null;
    try {
      if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) return layout;
    } catch (e) {}
    var oy = "";
    try { oy = window.getComputedStyle(layout).overflowY; } catch (e2) {}
    if (oy === "auto" || oy === "scroll") return layout;
    return null;
  }

  function pageScrollY() {
    var el = pageScroller();
    if (el) return el.scrollTop || 0;
    return window.scrollY || window.pageYOffset || 0;
  }

  function setPageScrollY(y) {
    y = Math.max(0, Number(y) || 0);
    var el = pageScroller();
    if (el) {
      el.scrollTop = y;
      return;
    }
    window.scrollTo(0, y);
  }

  function pageScrollBy(dy) {
    setPageScrollY(pageScrollY() + (Number(dy) || 0));
  }

  window.FS.pageScrollY = pageScrollY;
  window.FS.setPageScrollY = setPageScrollY;

  function rememberPanelScroll(panelId) {
    panelId = normalizePanelId(panelId);
    if (!panelId) return;
    if (!state.data.panelScroll || typeof state.data.panelScroll !== "object") {
      state.data.panelScroll = {};
    }
    state.data.panelScroll[panelId] = pageScrollY();
  }

  function restorePanelScroll(panelId) {
    panelId = normalizePanelId(panelId);
    var y = (state.data && state.data.panelScroll && panelId && state.data.panelScroll[panelId]) || 0;
    if (y > 0) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setPageScrollY(y);
        });
      });
      return;
    }
    settleViewTop();
  }

  function rememberTabSurface(panelId) {
    panelId = normalizePanelId(panelId);
    /* Only remember deep surfaces — hubs must not wipe talk/products/vault. */
    if (isLearnSurface(panelId) && panelId !== "know") state.data.lastKnowSurface = panelId;
    if (panelId === "curiosity-photos" || panelId === "content-vault" || panelId === "content-week" || panelId === "grove-shelf") {
      state.data.lastContentSurface = panelId;
    }
  }

  function setFoldChevron(el, open) {
    if (!el) return;
    var chev = el.querySelector(".talk-cat-chev, .faq-cat-chev, .faq-chev");
    if (chev) chev.textContent = open ? "−" : "+";
    el.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setTalkBlockOpen(block, open) {
    if (!block) return;
    block.classList.toggle("is-open", !!open);
    var head = block.querySelector(".talk-cat-head");
    setFoldChevron(head, open);
  }

  function setFaqLikeOpen(item, open) {
    if (!item) return;
    item.classList.toggle("open", !!open);
    var btn = item.querySelector(".faq-q");
    setFoldChevron(btn, open);
  }

  function focusCalendarToday() {
    var Cal = window.FS.Calendar;
    if (!Cal || !state.data) return;
    state.data.calendarSelected = Cal.ymd(new Date());
    state.data.calendarMonthOffset = 0;
    state.data.calendarWeekOffset = 0;
  }

  function resolveBottomNavGoto(goto, fromEl) {
    if (!fromEl || !fromEl.closest || !fromEl.closest("#bottomNav")) return packSafeGoto(goto);
    if (packEvergreen() && goto === "welcome") return "ev-home";
    if (goto === "know") {
      if (packEvergreen()) return "products";
      return "know";
    }
    /* Calendar tab opens the calendar board — don't reset to today on every re-tap. */
    if (goto === "tend" || goto === "calendar") {
      state.data.lastContentSurface = "tend";
      return "tend";
    }
    return packSafeGoto(goto);
  }

  function focusTalkMoment(talkId, cat) {
    if (!talkId) return;
    if (!state.data.talkCatOpen || typeof state.data.talkCatOpen !== "object") {
      state.data.talkCatOpen = {};
    }
    if (cat) state.data.talkCatOpen[cat] = true;
    state.data.openTalk = talkId;
    state.data.talkFocusPending = true;
  }

  var cloudOpenedAtTop = false;

  function settleViewTop() {
    /* Never steal focus while typing or while a sheet/overlay is open —
       blur/scroll kills iOS text selection mid-copy. */
    if (
      document.body.classList.contains("cal-sheet-open") ||
      document.body.classList.contains("overlay-open") ||
      document.body.classList.contains("hub-menu-open") ||
      document.body.classList.contains("curio-lightbox-open")
    ) return;
    if (document.querySelector(".cheer-sheet:not([hidden])")) return;
    if (document.querySelector("#growthMoment.open")) return;
    var ae = document.activeElement;
    if (ae) {
      var tag = (ae.tagName || "").toLowerCase();
      if (tag === "textarea" || tag === "input" || ae.isContentEditable) return;
    }
    try {
      if (ae && ae.blur) ae.blur();
    } catch (e) {}
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setPageScrollY(0);
  }

  function pinOpenToTop() {
    if (!sessionStartsAtTop) return;
    settleViewTop();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setPageScrollY(0);
    var delays = [0, 80, 280];
    for (var i = 0; i < delays.length; i++) {
      setTimeout(function () {
        if (!sessionStartsAtTop) return;
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setPageScrollY(0);
      }, delays[i]);
    }
  }

  function endFreshOpenPin() {
    sessionStartsAtTop = false;
  }

  function scrollTalkFocusIntoView(talkId) {
    if (!talkId) return;
    var el = document.getElementById(talkId);
    if (!el) {
      var btn = document.querySelector('#panel-talk [data-talk="' + talkId.replace(/"/g, "") + '"]');
      if (btn && btn.closest) {
        el = btn.closest(".talk-moment-card") || btn.closest(".talk-cat-solo") || btn;
      } else {
        el = btn;
      }
    }
    if (!el) return;
    var nav = document.querySelector("#panel-talk .talk-guide-nav");
    var offset = (nav && nav.offsetHeight) || 0;
    var y = pageScrollY() + el.getBoundingClientRect().top - offset - 10;
    /* Instant — deep-link already jumped panels; smooth fight with settleViewTop. */
    setPageScrollY(Math.max(0, y));
  }

  function closeOpenContentSheets() {
    if (window.FS.BridgeUI && window.FS.BridgeUI.closeAllSheets) {
      try { window.FS.BridgeUI.closeAllSheets(); } catch (e) {}
      return;
    }
    if (window.FS.BridgeUI && window.FS.BridgeUI.closeCalSheet) {
      try { window.FS.BridgeUI.closeCalSheet(); } catch (e) {}
    }
    if (window.FS.BridgeUI && window.FS.BridgeUI.closeCuriosityLightbox) {
      try { window.FS.BridgeUI.closeCuriosityLightbox(); } catch (e) {}
    }
  }

  function syncTopbarStickyOffset() {
    var rail = document.querySelector(".rail");
    var topbar = document.querySelector(".topbar");
    var mobile = false;
    try { mobile = window.matchMedia("(max-width: 900px)").matches; } catch (e) {}
    var railH = 0;
    var topH = 0;
    if (mobile && rail) {
      railH = Math.floor(rail.getBoundingClientRect().height || rail.offsetHeight || 0);
    }
    if (topbar && !topbar.hidden && getComputedStyle(topbar).display !== "none") {
      topH = Math.ceil(topbar.getBoundingClientRect().height || topbar.offsetHeight || 0);
    }
    var railNext = railH + "px";
    var chromeNext = (railH + topH) + "px";
    var root = document.documentElement.style;
    if (root.getPropertyValue("--fs-rail-offset") === railNext &&
        root.getPropertyValue("--fs-topbar-offset") === chromeNext) return;
    root.setProperty("--fs-rail-offset", railNext);
    root.setProperty("--fs-topbar-offset", chromeNext);
  }

  function isMobileLayout() {
    try { return !!(window.matchMedia && window.matchMedia("(max-width: 900px)").matches); } catch (e) { return false; }
  }

  function isTextEntry(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (el.isContentEditable) return true;
    var tag = (el.tagName || "").toUpperCase();
    if (tag === "TEXTAREA" || tag === "SELECT") return true;
    if (tag !== "INPUT") return false;
    var type = (el.type || "text").toLowerCase();
    return type !== "button" && type !== "submit" && type !== "reset" &&
      type !== "checkbox" && type !== "radio" && type !== "range" &&
      type !== "file" && type !== "hidden" && type !== "image" && type !== "color";
  }

  var vvRestHeight = 0;
  var lastVvHeight = 0;
  var vvRestoring = false;
  var vvRestorePass = 0;

  function resetVisualViewportPan() {
    /* window.scrollTo while a field is focused can dismiss the iOS keyboard.
       Only reset the document pan when nothing is being typed. */
    if (isTextEntry(document.activeElement)) return;
    try { window.scrollTo(0, 0); } catch (e) {}
    try {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch (e2) {}
  }

  function sampleRestingViewport() {
    var vv = window.visualViewport;
    var h = Math.round((vv && vv.height) || window.innerHeight || 0);
    var offset = Math.round((vv && vv.offsetTop) || 0);
    if (offset > 6) return;
    if (h > vvRestHeight) vvRestHeight = h;
  }

  function keyboardInset() {
    var vv = window.visualViewport;
    if (!vv) return 0;
    var vh = Math.round(vv.height);
    var offset = Math.round(vv.offsetTop || 0);
    var rest = vvRestHeight || Math.round(window.innerHeight || vh);
    var inset = Math.max(0, rest - vh);
    if (offset > 6) inset = Math.max(inset, offset);
    return inset;
  }

  function keyboardIsOpen() {
    return isTextEntry(document.activeElement) && keyboardInset() > 72;
  }

  function isAuthEntry(el) {
    if (!el || !el.closest) return false;
    return !!(
      el.closest("#onboardingAuthForm") ||
      el.closest("#onboardingResetPane") ||
      el.closest("#authSignFields") ||
      el.closest("#authResetPane")
    );
  }

  function syncAuthTyping(el) {
    document.documentElement.classList.toggle("fs-auth-typing", !!(el && isAuthEntry(el)));
  }

  function liftKeyboardPin() {
    var root = document.documentElement;
    root.classList.remove("fs-kb-open");
    root.classList.remove("fs-auth-typing");
    root.style.removeProperty("--fs-kb-inset");
    root.style.removeProperty("--fs-vv-height");
    root.style.removeProperty("--fs-vv-offset");
    resetVisualViewportPan();
  }

  function forceViewportRestore(opts) {
    opts = opts || {};
    var keepFocus = !!(opts.keepFocus && isTextEntry(document.activeElement));
    if (vvRestoring) return;
    vvRestoring = true;
    var html = document.documentElement;
    var body = document.body;
    var layout = document.querySelector(".layout");
    var y = layout ? layout.scrollTop : 0;
    if (!keepFocus) {
      resetVisualViewportPan();
      var htmlOverflow = html.style.overflow;
      var bodyOverflow = body.style.overflow;
      html.style.overflow = "auto";
      body.style.overflow = "auto";
      try { window.scrollTo(0, 1); } catch (e1) {}
      try { window.scrollTo(0, 0); } catch (e2) {}
      try { html.scrollTop = 0; } catch (e3) {}
      try { body.scrollTop = 0; } catch (e4) {}
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
      html.style.height = "100.1lvh";
      try { void html.offsetHeight; } catch (e5) {}
      html.style.height = "";
    }
    if (layout) layout.scrollTop = y;
    if (!keepFocus) resetVisualViewportPan();
    sampleRestingViewport();
    requestAnimationFrame(function () { vvRestoring = false; });
  }

  function restoreAfterKeyboard() {
    var keepFocus = isTextEntry(document.activeElement);
    liftKeyboardPin();
    forceViewportRestore({ keepFocus: keepFocus });
    syncTopbarStickyOffset();
    vvRestorePass += 1;
    var pass = vvRestorePass;
    var delays = [80, 250, 500, 1000];
    for (var i = 0; i < delays.length; i++) {
      (function (ms) {
        setTimeout(function () {
          if (pass !== vvRestorePass) return;
          if (keyboardInset() > 72 && isTextEntry(document.activeElement)) {
            syncKeyboardPin();
            return;
          }
          liftKeyboardPin();
          forceViewportRestore({ keepFocus: isTextEntry(document.activeElement) });
          syncTopbarStickyOffset();
        }, ms);
      })(delays[i]);
    }
  }

  function nearestScroller(el) {
    var node = el && el.parentElement;
    while (node && node !== document.body && node !== document.documentElement) {
      try {
        var oy = window.getComputedStyle(node).overflowY;
        if (oy === "auto" || oy === "scroll") return node;
      } catch (eOy) {}
      node = node.parentElement;
    }
    return pageScroller();
  }

  function scrollFieldIntoVisible(el) {
    if (!el || document.activeElement !== el || !isMobileLayout()) return;
    if (el.id === "cabinetMailDraft" && document.body.classList.contains("cabinet-thread-open")) return;
    var scroller = nearestScroller(el);
    if (!scroller) return;
    var rect = el.getBoundingClientRect();
    var vv = window.visualViewport;
    var viewH = vv ? vv.height : window.innerHeight;
    var viewTop = vv ? vv.offsetTop : 0;
    var viewBottom = viewTop + viewH;
    var chrome = 0;
    try {
      chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-topbar-offset")) || 0;
    } catch (eCh) {}
    var pad = 16;
    var navH = 0;
    if (!el.closest(".cheer-sheet, .cal-sheet, #hubMenu, .overlay, .cal-sheet-panel")) {
      var nav = document.getElementById("bottomNav");
      if (nav) navH = nav.getBoundingClientRect().height || 0;
    }
    /* Keep How I Grow Next in the visible slice — a button-row, not a void. */
    var growCard = el.closest(".how-grow-card");
    var growActions = growCard && growCard.querySelector(".how-grow-pane.on .how-grow-actions");
    if (growActions) {
      navH += Math.min(68, Math.ceil(growActions.getBoundingClientRect().height) + 10);
    }
    var onboardPane = el.closest("#onboarding .onboarding-pane.on");
    if (onboardPane) {
      var onboardActions = onboardPane.querySelector(".onboard-auth-actions");
      if (onboardActions && !onboardActions.hidden) {
        navH += Math.min(160, Math.ceil(onboardActions.getBoundingClientRect().height) + 12);
      }
    }
    var topLimit = viewTop + chrome + pad;
    var bottomLimit = viewBottom - pad - navH;
    if (rect.top >= topLimit && rect.bottom <= bottomLimit) return;
    var dy = 0;
    if (rect.bottom > bottomLimit) dy = rect.bottom - bottomLimit;
    else if (rect.top < topLimit) dy = rect.top - topLimit;
    if (!dy) return;
    scroller.scrollTop = Math.max(0, scroller.scrollTop + dy);
  }

  function syncKeyboardPin() {
    if (!isMobileLayout()) {
      liftKeyboardPin();
      sampleRestingViewport();
      return;
    }
    var vv = window.visualViewport;
    var vh = Math.round((vv && vv.height) || window.innerHeight || 0);
    var offset = Math.round((vv && vv.offsetTop) || 0);
    var focused = isTextEntry(document.activeElement);
    lastVvHeight = vh;

    if (focused) {
      var inset = keyboardInset();
      /* Never restore/pan the viewport while a field is focused — that fight
         with iOS is what yanks the typing bubble off-screen. */
      if (inset > 72) {
        document.documentElement.style.setProperty("--fs-kb-inset", inset + "px");
        document.documentElement.style.setProperty("--fs-vv-height", vh + "px");
        document.documentElement.style.setProperty("--fs-vv-offset", offset + "px");
        document.documentElement.classList.add("fs-kb-open");
      } else {
        document.documentElement.classList.remove("fs-kb-open");
        document.documentElement.style.removeProperty("--fs-kb-inset");
        document.documentElement.style.removeProperty("--fs-vv-height");
      }
      return;
    }

    sampleRestingViewport();
    if (document.documentElement.classList.contains("fs-kb-open") || keyboardInset() > 72 || offset > 6) {
      restoreAfterKeyboard();
    }
  }

  function wireVisualViewport() {
    if (wireVisualViewport.bound) return;
    wireVisualViewport.bound = true;
    try {
      if (navigator.virtualKeyboard && "overlaysContent" in navigator.virtualKeyboard) {
        navigator.virtualKeyboard.overlaysContent = true;
      }
    } catch (eVk) {}
    sampleRestingViewport();
    var vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", syncKeyboardPin);
      vv.addEventListener("scroll", function () {
        if (vvRestoring || keyboardIsOpen()) return;
        resetVisualViewportPan();
      });
    }
    window.addEventListener("resize", syncKeyboardPin);
    window.addEventListener("orientationchange", function () {
      vvRestHeight = 0;
      setTimeout(function () { restoreAfterKeyboard(); }, 80);
      setTimeout(function () { restoreAfterKeyboard(); }, 400);
    });
    var kbRestoreTimer = 0;
    function cancelKeyboardRestore() {
      if (kbRestoreTimer) {
        clearTimeout(kbRestoreTimer);
        kbRestoreTimer = 0;
      }
    }
    function scheduleKeyboardRestore() {
      cancelKeyboardRestore();
      /* iOS password fields (and Keychain) take longer than 50ms to take
         focus. Restoring that fast dismisses the keyboard and dumps people
         back on Sign in before they can type a password. */
      kbRestoreTimer = setTimeout(function () {
        kbRestoreTimer = 0;
        if (isTextEntry(document.activeElement)) return;
        restoreAfterKeyboard();
      }, 480);
    }
    document.addEventListener("focusin", function (e) {
      if (!isTextEntry(e.target)) return;
      cancelKeyboardRestore();
      var el = e.target;
      syncAuthTyping(el);
      syncKeyboardPin();
      setTimeout(function () {
        if (document.activeElement !== el) return;
        syncAuthTyping(el);
        syncKeyboardPin();
        scrollFieldIntoVisible(el);
      }, 400);
    });
    document.addEventListener("focusout", function (e) {
      if (!isTextEntry(e.target)) return;
      if (isTextEntry(e.relatedTarget)) {
        syncAuthTyping(e.relatedTarget);
        return;
      }
      scheduleKeyboardRestore();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && !isTextEntry(document.activeElement)) restoreAfterKeyboard();
    });
    try {
      if (navigator.virtualKeyboard && navigator.virtualKeyboard.addEventListener) {
        navigator.virtualKeyboard.addEventListener("geometrychange", function () {
          var rect = navigator.virtualKeyboard.boundingRect;
          if (!rect || rect.height < 24) restoreAfterKeyboard();
          else syncKeyboardPin();
        });
      }
    } catch (eGeom) {}
    syncKeyboardPin();
  }

  function wireTopbarStickyOffset() {
    if (wireTopbarStickyOffset.bound) return;
    wireTopbarStickyOffset.bound = true;
    window.addEventListener("resize", function () {
      syncTopbarStickyOffset();
      fitBrandEyebrow();
    });
    var rail = document.querySelector(".rail");
    if (window.ResizeObserver && rail) {
      try {
        var ro = new ResizeObserver(function () { syncTopbarStickyOffset(); });
        ro.observe(rail);
      } catch (e) {}
    }
  }

  function persistActiveAndPaint(opts) {
    if (!packEvergreen()) renderNav();
    renderPanels(opts || {});
    /* Disk write after the first paint so the tab isn't waiting on localStorage. */
    requestAnimationFrame(function () {
      if (packEvergreen()) save({ skipCloud: true });
      else save();
    });
  }

  function renderPanels(opts) {
    opts = opts || {};
    ensurePackActive();
    var ev = packEvergreen();
    if (teamTreeGrowDemoOn()) state.active = teamTreeGrowDemoPanel();
    syncTopbarStickyOffset();
    if (packSettled() && isLeadersSurface(state.active) && leaderCheckSettled() && !isOrgLeader()) {
      state.active = ev ? "ev-resources" : "know";
      save();
    }
    if (teamTreeGrowDemoOn()) state.active = teamTreeGrowDemoPanel();
    var panels = document.querySelectorAll(".panel");
    /* Soft-start / custom-landing / aliases — normalize before any panel paint. */
    if (!ev) {
      if (usesCustomLanding() && state.active === "leads") {
        state.active = "ground";
        save();
      }
      if (shouldParkStarterSurface()) {
        state.active = "welcome";
        save();
      }
      if (state.active === "done" && !sproutPathComplete()) {
        state.active = "welcome";
        save();
      }
      /* calendar is an alias of tend — never activate the empty stub panel */
      if (state.active === "content-stories") {
        if (!state.data.vaultBrowse) state.data.vaultBrowse = {};
        if (!state.data.vaultBrowse.vault) state.data.vaultBrowse.vault = { q: "", format: "", promoting: "", lane: "all" };
        state.data.vaultBrowse.vault.format = "story";
        state.active = "content-vault";
        save();
      }
    }
    var activeId = normalizePanelId(state.active);
    rememberTabSurface(activeId);
    if (window.FS.BridgeUI && window.FS.BridgeUI.onPanelChange) {
      try { window.FS.BridgeUI.onPanelChange(activeId); } catch (e) {}
    }
    var panelChanged = false;
    for (var i = 0; i < panels.length; i++) {
      var wantActive = panels[i].id === "panel-" + activeId;
      panels[i].classList.remove("panel-enter");
      if (wantActive) panels[i].removeAttribute("hidden");
      if (wantActive !== panels[i].classList.contains("active")) panelChanged = true;
      panels[i].classList.toggle("active", wantActive);
    }
    var mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.classList.toggle("content-wide", activeId === "tend" || state.active === "calendar");
    }
    document.body.classList.toggle("cabinet-desk", !ev && activeId === "customers");
    if (!ev && activeId === "customers") {
      try {
        paintCabinetShareUI();
        if (panelChanged && window.FS.CabinetDesk && typeof window.FS.CabinetDesk.enter === "function") {
          window.FS.CabinetDesk.enter();
        } else if (window.FS.CabinetDesk && typeof window.FS.CabinetDesk.render === "function" && !document.body.classList.contains("cabinet-desk-loading")) {
          window.FS.CabinetDesk.render({ fresh: true });
        }
      } catch (eDesk) {}
    }
    if (panelChanged) closeOpenContentSheets();
    var restoreY = 0;
    var deferTalkFocus = !ev && state.active === "talk" && !!state.data.talkFocusPending;
    var holdForFocus = !ev && !!window.FS.pendingLeadsFocus;
    if (opts.restoreScroll && !holdForFocus) {
      var map = state.data.panelScroll || {};
      restoreY = map[activeId] || 0;
    } else if (!deferTalkFocus && !holdForFocus) {
      settleViewTop();
    }
    renderBottomNav();
    if (activeId === "why" || activeId === "leaders") paintCompanyReports();
    if (ev) {
      if (noteEvergreenVisit(activeId)) save();
      if (activeId === "ev-home") {
        renderEvergreenSprout();
        refreshHowGrowReminder();
      }
      if (activeId === "ev-board" && window.FS.BridgeUI && window.FS.BridgeUI.renderEvergreenBoard) {
        window.FS.BridgeUI.renderEvergreenBoard().catch(function () {});
      }
      if (activeId === "ev-resources") renderEvergreenResources();
      if (activeId === "ev-team" && window.FS.BridgeUI && window.FS.BridgeUI.renderEvergreenLeadersRoster) {
        paintEvTeamPageCopy();
        fillEvergreenLeadersJoinInputs();
        window.FS.BridgeUI.renderEvergreenLeadersRoster().catch(function () {});
      }
      if (activeId === "ev-learn") {
        renderEvergreenLearnFavs();
        renderEvergreenPathChecks();
        refreshButtons();
      }
      if (activeId === "ev-heart") {
        renderEvergreenHeartStory();
        renderEvergreenPathChecks();
        refreshButtons();
      }
      if (activeId === "ev-leads" || activeId === "ev-dream") {
        renderEvergreenLists();
        renderEvergreenPathChecks();
        refreshButtons();
      }
      if (activeId === "roots") {
        renderStory();
        renderEvergreenPathChecks();
        refreshButtons();
        markFilledStates();
      }
      if (activeId === "know") {
        renderKnowPanel();
        wireKnowSearch();
        filterKnowSearch();
      }
      if (activeId === "leaders") renderLeadersPanel();
      if (activeId === "leaders-comp") renderLeadersCompPanel();
      if (activeId === "leaders-understand") renderLeadersUnderstandPanel();
      if (activeId === "products") {
        renderProductLibrary();
      }
      if (window.FS.BridgeUI && (activeId === "tend" || state.active === "calendar")) {
        if (!document.body.classList.contains("cal-sheet-open")) {
          window.FS.BridgeUI.renderCalendar();
        }
      }
    } else {
      autoClaimReadySteps();
      maybeLockGroundLine();
      renderMiniPage();
      if (activeId === "leader") paintGroveTeamInvite();
      if (activeId === "customers") {
        maybeStartClientsTour();
      }
      if (activeId === "leads" || activeId === "ground") paintLeadsShareButton();
      if (activeId === "quiz") paintQuizShareButton();
      if (activeId === "welcome" || activeId === "done") renderHomeRunway();
      renderModuleChecklists(activeId);
      if (activeId === "grove" || activeId === "leader") {
        var treeFocus = document.activeElement;
        if (!(treeFocus && treeFocus.getAttribute && treeFocus.getAttribute("data-tname") != null)) {
          Tree.render(state);
        }
      }
      if (activeId === "welcome" || activeId === "done") {
        renderPlant({ silent: true });
        renderTodayCard();
      }
      if (state.active === "know" || state.active === "why") {
        renderKnowPanel();
        if (state.active === "know") {
          wireKnowSearch();
          filterKnowSearch();
        }
        revealFocusFact();
      }
      if (state.active === "leaders") renderLeadersPanel();
      if (state.active === "leaders-comp") renderLeadersCompPanel();
      if (state.active === "leaders-understand") renderLeadersUnderstandPanel();
      if (state.active === "talk") {
        if (markTalkOpened()) {
          save();
          liveRefresh({ silent: true });
        }
        renderTalkGuide((window.FS.CONTENT || {}).talkGuide);
        if (state.data.talkFocusPending && state.data.openTalk) {
          var focusTalkId = state.data.openTalk;
          state.data.talkFocusPending = false;
          save();
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              scrollTalkFocusIntoView(focusTalkId);
            });
          });
        }
      }
      if (state.active === "products") {
        renderProductLibrary();
      }
      if (state.active === "share") {
        renderShareFavPreview();
      }
      if (state.active === "done") {
        renderFinishCopy();
      }
      if (state.active === "curiosity-photos" && window.FS.BridgeUI && window.FS.BridgeUI.renderCuriosityPhotos) {
        window.FS.BridgeUI.renderCuriosityPhotos();
      }
      if (state.active === "content-vault" && window.FS.BridgeUI && window.FS.BridgeUI.renderContentVault) {
        window.FS.BridgeUI.renderContentVault();
      }
      if (state.active === "content-week" && window.FS.BridgeUI && window.FS.BridgeUI.renderContentWeek) {
        window.FS.BridgeUI.renderContentWeek();
      }
      if (state.active === "grove-shelf" && window.FS.BridgeUI && window.FS.BridgeUI.renderGroveShelf) {
        window.FS.BridgeUI.renderGroveShelf();
      }
      if (state.active !== "curiosity-photos" && window.FS.BridgeUI && window.FS.BridgeUI.closeCuriosityLightbox) {
        window.FS.BridgeUI.closeCuriosityLightbox();
      }
      if (state.active === "plant") {
        renderSeedTypes();
      }
      if (state.active === "tend") {
        renderHooks();
        renderContentBanks();
        renderContentShortlist();
        renderContentFactShortlist();
        renderYourStory();
        wireCalFocus();
      }
      if (window.FS.BridgeUI) {
        if (state.active === "calendar" || state.active === "tend") {
          if (!document.body.classList.contains("cal-sheet-open")) {
            window.FS.BridgeUI.renderCalendar();
          }
        }
        if (state.active === "leader") window.FS.BridgeUI.renderLeader();
        if (state.active === "grove-board" && window.FS.BridgeUI.renderGroveBoard) window.FS.BridgeUI.renderGroveBoard();
        if (state.active === "ev-board" && window.FS.BridgeUI.renderEvergreenBoard) {
          window.FS.BridgeUI.renderEvergreenBoard().catch(function () {});
        }
        if (state.active === "leads" && window.FS.BridgeUI.renderLeads) window.FS.BridgeUI.renderLeads();
        if (window.FS.Push && window.FS.Push.ackGroveBadge) {
          if (state.active === "leads" || state.active === "ev-leads") window.FS.Push.ackGroveBadge("leads");
          if (state.active === "leader") window.FS.Push.ackGroveBadge("joins");
          if (state.active === "grove-board") window.FS.Push.ackGroveBadge("messages");
          if (state.active === "customers") window.FS.Push.ackGroveBadge("customers");
        }
        if (window.FS.BridgeUI.refreshIncomingMessages) {
          var mailSurface = activeId === "leader" || activeId === "leads" || activeId === "grove-board" || activeId === "welcome";
          window.FS.BridgeUI.refreshIncomingMessages({ force: mailSurface });
        }
        else if (window.FS.BridgeUI.renderLeaderNoteBanner) window.FS.BridgeUI.renderLeaderNoteBanner();
      }
    }
    if (opts.restoreScroll && restoreY > 0) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setPageScrollY(restoreY);
        });
      });
    } else if (opts.restoreScroll) {
      settleViewTop();
    }
  }

  /* ── countdowns ──────────────────────────────────────── */
  function nextDate(m, d) {
    var now = new Date();
    var t = new Date(now.getFullYear(), m - 1, d);
    if (t < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      t = new Date(now.getFullYear() + 1, m - 1, d);
    }
    return t;
  }

  function daysUntilPre() {
    var now = new Date();
    var pre = nextDate(CFG.preRegDate.month, CFG.preRegDate.day);
    return Math.max(0, Math.ceil((pre - now) / 864e5));
  }

  function renderCountdowns() {
    var now = new Date();
    var pre = nextDate(CFG.preRegDate.month, CFG.preRegDate.day);
    var launch = nextDate(CFG.launchDate.month, CFG.launchDate.day);
    var d1 = Math.max(0, Math.ceil((pre - now) / 864e5));
    var d2 = Math.max(0, Math.ceil((launch - now) / 864e5));
    var el1 = document.getElementById("cdPre"), el2 = document.getElementById("cdLaunch");
    var l1 = document.getElementById("cdPreLabel"), l2 = document.getElementById("cdLaunchLabel");
    if (el1) el1.textContent = d1 === 0 ? "🎉" : d1;
    if (el2) el2.textContent = d2 === 0 ? "🎉" : d2;
    if (l1) l1.textContent = CFG.preRegDate.label;
    if (l2) l2.textContent = CFG.launchDate.label;
    var hypeDays = document.getElementById("obHypeDays");
    if (hypeDays) hypeDays.textContent = d1 === 0 ? "🎉" : String(d1);
  }

  function setRoadmapOpen(open) {
    var wrap = document.getElementById("cdRoadmap");
    var hit = document.getElementById("cdRoadmapHit");
    if (!wrap || !hit) return;
    wrap.classList.toggle("is-open", !!open);
    hit.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && window.FS.armDismissGuard) window.FS.armDismissGuard();
    if (!open && document.activeElement && wrap.contains(document.activeElement)) {
      try { document.activeElement.blur(); } catch (e) {}
    }
  }

  function wireRoadmapHover() {
    var wrap = document.getElementById("cdRoadmap");
    var hit = document.getElementById("cdRoadmapHit");
    var panel = document.getElementById("cdRoadmapPanel");
    if (!wrap || !hit || hit.dataset.bound) return;
    hit.dataset.bound = "1";
    hit.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      setRoadmapOpen(!wrap.classList.contains("is-open"));
    });
    /* pointerdown + dismiss guard: a leftover click after open used to snap it shut. */
    document.addEventListener("pointerdown", function (e) {
      if (!wrap.classList.contains("is-open")) return;
      if (window.FS.dismissGuarded && window.FS.dismissGuarded()) return;
      if (hit.contains(e.target)) return;
      if (panel && panel.contains(e.target)) return;
      setRoadmapOpen(false);
    });
  }

  /* ── completion rules ────────────────────────────────── */
  function listNames(key) {
    return parseNameLines(state.data[key] || "");
  }

  function groveNames() { return listNames("warm"); }
  function customerNames() { return listNames("customers"); }

  function treeNamedCount() {
    var named = 0;
    (function walk(arr) {
      for (var i = 0; i < arr.length; i++) {
        if ((arr[i].name || "").trim()) named++;
        walk(arr[i].children || []);
      }
    })(Tree.ensure(state));
    return named;
  }

  function treeNameList(opts) {
    opts = opts || {};
    var skipLive = !!opts.skipLiveTeam;
    var names = [];
    (function walk(arr) {
      for (var i = 0; i < arr.length; i++) {
        var n = (arr[i].name || "").trim();
        if (n && !(skipLive && arr[i].liveId)) names.push(n);
        walk(arr[i].children || []);
      }
    })(Tree.ensure(state));
    return names;
  }

  function liveTeamNameSet() {
    var set = {};
    (function walk(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].liveId) {
          var n = String(arr[i].name || "").trim().toLowerCase();
          if (n) set[n] = true;
        }
        walk(arr[i].children || []);
      }
    })(Tree.ensure(state));
    return set;
  }

  function dropLiveTeamIdealLeads(list) {
    var live = liveTeamNameSet();
    if (!Object.keys(live).length) return list || [];
    return (list || []).filter(function (row) {
      return !live[String((row && row.name) || "").trim().toLowerCase()];
    });
  }

  function syncWarmFromTree() {
    var names = treeNameList({ skipLiveTeam: true });
    var seen = {};
    var uniq = [];
    function add(n) {
      n = String(n || "").trim();
      if (!n) return;
      var k = n.toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      uniq.push(n);
    }
    parseNameLines(state.data.warm || "").forEach(add);
    names.forEach(add);
    state.data.warm = uniq.join("\n");
    pruneGrovePicks("warm");
    syncIdealLeadsFromNameField("warm");
  }

  function seedTreeFromPartnerNames() {
    var tree = Tree.ensure(state);
    var names = listNames("warm");
    if (!names.length) return false;
    var have = {};
    (function walk(arr) {
      for (var i = 0; i < arr.length; i++) {
        var n = (arr[i].name || "").trim().toLowerCase();
        if (n) have[n] = true;
        walk(arr[i].children || []);
      }
    })(tree);
    var added = false;
    for (var i = 0; i < names.length; i++) {
      if (have[names[i].toLowerCase()]) continue;
      tree.push({ name: names[i], status: "hopeful", children: [] });
      added = true;
    }
    return added;
  }

  function migrateDreamTree() {
    var seeded = seedTreeFromPartnerNames();
    if (treeNamedCount() > 0) syncWarmFromTree();
    return seeded;
  }

  function grovePicks(key) {
    if (!Array.isArray(state.data[key])) state.data[key] = [];
    return state.data[key];
  }

  function pruneGrovePicks(lane) {
    var names = lane === "warm" ? groveNames() : customerNames();
    var key = lane === "warm" ? "warm_first" : "customer_first";
    var set = {};
    names.forEach(function (n) { set[n.toLowerCase()] = n; });
    var next = grovePicks(key).filter(function (n) { return set[(n || "").toLowerCase()]; })
      .map(function (n) { return set[(n || "").toLowerCase()]; });
    /* de-dupe */
    var seen = {}, out = [];
    next.forEach(function (n) {
      var k = n.toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      out.push(n);
    });
    state.data[key] = out.slice(0, 5);
    return state.data[key];
  }

  function toggleGrovePick(lane, name) {
    name = (name || "").trim();
    if (!name) return;
    var key = lane === "warm" ? "warm_first" : "customer_first";
    var list = grovePicks(key).slice();
    var ix = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].toLowerCase() === name.toLowerCase()) { ix = i; break; }
    }
    if (ix > -1) list.splice(ix, 1);
    else if (list.length < 5) list.push(name);
    state.data[key] = list;
    syncGroveCalendar();
  }

  function syncGroveCalendar() {
    if (!window.FS.Calendar || !window.FS.Calendar.syncGroveOutreach) return;
    if (!state.data.calendar) state.data.calendar = {};
    var people = [];
    grovePicks("customer_first").forEach(function (n) {
      people.push({ name: n, lane: "customers" });
    });
    grovePicks("warm_first").forEach(function (n) {
      people.push({ name: n, lane: "warm" });
    });
    window.FS.Calendar.syncGroveOutreach(state.data.calendar, people, state.data);
    if (
      window.FS.BridgeUI &&
      (state.active === "calendar" || state.active === "tend") &&
      !document.body.classList.contains("cal-sheet-open")
    ) {
      window.FS.BridgeUI.renderCalendar();
    }
  }

  function canComplete(id) {
    if (id === "roots") return filledText("why") && filledText("moment") && filledText("said_yes");
    if (id === "ev-learn") return evLearnReady();
    if (id === "ev-heart") return filledText("ev_heart");
    if (id === "ev-leads") return listNames("ev_leads").length >= 5;
    if (id === "ev-dream") return listNames("ev_dream").length >= 3;
    if (id === "ev-dates") return !!state.data.evCalOpened;
    if (id === "ev-links") return !!state.data.evResOpened;
    if (id === "share") return favoriteCount() >= 2 && talkOpened();
    if (id === "grove") {
      var c = customerNames();
      var picks = grovePicks("customer_first");
      var set = {};
      c.forEach(function (n) { set[n.toLowerCase()] = true; });
      var valid = picks.filter(function (n) { return set[(n || "").toLowerCase()]; });
      var need = Math.min(5, c.length);
      return c.length >= 5 && valid.length >= need && need > 0;
    }
    if (id === "tree") return true;
    if (id === "ground") {
      if (!filledText("page_story")) return false;
      if (!leadPageReady()) return false;
      return true;
    }
    if (id === "plant") return filledText("seed_open") && giveDraftFilled() && filledText("seed_invite");
    if (id === "tend") {
      var Cal = window.FS.Calendar;
      var posted = Cal && Cal.countPosted ? Cal.countPosted(state.data.calendar || {}) : 0;
      return posted >= 3;
    }
    return false;
  }

  function sproutPathComplete() {
    if (packEvergreen()) {
      var path = evPath();
      if (!path.length) return false;
      for (var e = 0; e < path.length; e++) {
        if (!state.done[path[e].id] || !canComplete(path[e].id)) return false;
      }
      return true;
    }
    var secs = visibleSections();
    if (!secs.length) return false;
    for (var i = 0; i < secs.length; i++) {
      if (!state.done[secs[i].id] || !canComplete(secs[i].id)) return false;
    }
    return true;
  }

  function readyLabel(btn, id) {
    if (isStarter() && btn.getAttribute("data-ready-starter")) return btn.getAttribute("data-ready-starter");
    if (isFull() && btn.getAttribute("data-ready-full")) return btn.getAttribute("data-ready-full");
    return btn.getAttribute("data-ready");
  }

  function refreshButtons() {
    var btns = document.querySelectorAll("[data-complete]");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i], id = b.getAttribute("data-complete"), ok = canComplete(id);
      var finished = !!state.done[id];
      var row = b.closest(".btn-row");
      /* Calendar and Patch of Ground complete themselves — don't leave a
         grey Continue parked under the tab people use every day. */
      if (id === "tend" || id === "ground") {
        b.hidden = true;
        if (row) row.hidden = true;
        continue;
      }
      b.hidden = finished;
      if (row) row.hidden = finished;
      if (finished) continue;
      b.classList.toggle("waiting", !ok);
      b.disabled = !ok;
      b.setAttribute("aria-disabled", ok ? "false" : "true");
      if (ok) {
        b.textContent = readyLabel(b, id);
      } else if (id === "ground") {
        if (!filledText("page_story")) b.textContent = "Draft your opening line";
        else if (!leadSignedIn()) b.textContent = "Sign in to set up your lead page";
        else if (!leadPageReady()) b.textContent = "Your share link is still getting ready";
        else b.textContent = b.getAttribute("data-wait");
      } else if (id === "share") {
        if (favoriteCount() < 2) b.textContent = "Heart at least 2 products in Learn";
        else if (!talkOpened()) b.textContent = "Open Talking fresh once";
        else b.textContent = b.getAttribute("data-wait");
      } else if (id === "tend") {
        var CalWait = window.FS.Calendar;
        var postedWait = CalWait && CalWait.countPosted ? CalWait.countPosted(state.data.calendar || {}) : 0;
        if (postedWait < 3) b.textContent = "Mark 3 cards as Posted after you post (" + postedWait + "/3)";
        else b.textContent = b.getAttribute("data-wait");
      } else {
        b.textContent = b.getAttribute("data-wait");
      }
    }
  }

  /* ── live widgets ────────────────────────────────────── */
  function storyBlurbHtml() {
    var w = (state.data.why || "").trim();
    var m = (state.data.moment || "").trim();
    var y = (state.data.said_yes || "").trim();
    if (!w && !m && !y) return "";
    var parts = [];
    parts.push(w ? esc(w) : '<span class="dim">[your why…]</span>');
    parts.push(m ? esc(m) : '<span class="dim">[your Ringana moment…]</span>');
    parts.push(y ? esc(y) : '<span class="dim">[why you said yes…]</span>');
    return '"' + parts.join(" ") + '"';
  }

  function storyComplete() {
    return filledText("why") && filledText("moment") && filledText("said_yes");
  }

  function currentRunwayPanel() {
    if (packEvergreen()) {
      var path = evPath();
      for (var e = 0; e < path.length; e++) {
        if (state.done[path[e].id] && canComplete(path[e].id)) continue;
        if (evStepUnlocked(path[e].id)) return path[e].goto || path[e].id;
      }
      return "ev-home";
    }
    var secs = visibleSections();
    for (var i = 0; i < secs.length; i++) {
      if (state.done[secs[i].id] && canComplete(secs[i].id)) continue;
      if (isModuleUnlocked(secs[i].id)) return secs[i].id;
    }
    for (var j = 0; j < secs.length; j++) {
      if (!state.done[secs[j].id] || !canComplete(secs[j].id)) return secs[j].id;
    }
    return "roots";
  }

  function renderStory() {
    var el = document.getElementById("storyPreview");
    if (!el) return;
    var html = storyBlurbHtml();
    if (!html) {
      el.innerHTML = '<span class="dim">Your story will assemble here as you write — three answers, one narrative.</span>';
      return;
    }
    el.innerHTML = html;
  }

  function toggleCalFocus(id) {
    var row = document.getElementById("calFocus");
    if (!row) return;
    var next = row.getAttribute("data-open") === id ? "" : (id || "");
    row.setAttribute("data-open", next);
    var tabs = row.querySelectorAll("[data-cal-focus]");
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute("data-cal-focus") === next;
      tabs[i].classList.toggle("on", on);
      tabs[i].setAttribute("aria-expanded", on ? "true" : "false");
    }
    var panels = row.querySelectorAll(".cal-focus-panel");
    for (var j = 0; j < panels.length; j++) {
      panels[j].hidden = panels[j].id !== next;
    }
  }

  function wireCalFocus() {
    var row = document.getElementById("calFocus");
    if (!row || row.dataset.bound) return;
    row.dataset.bound = "1";
    row.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-cal-focus]");
      if (!tab || !row.contains(tab)) return;
      e.preventDefault();
      toggleCalFocus(tab.getAttribute("data-cal-focus"));
    });
  }

  function renderYourStory() {
    var preview = document.getElementById("yourStoryPreview");
    var hint = document.getElementById("yourStoryHint");
    var cta = document.getElementById("yourStoryCta");
    var complete = storyComplete();
    var blurb = storyBlurbHtml();

    if (preview) {
      if (blurb) preview.innerHTML = blurb;
      else preview.innerHTML = '<span class="dim">Your Roots story will assemble here — craft your story on Sprout.</span>';
    }

    if (hint) {
      if (complete) {
        hint.hidden = false;
        hint.textContent = "Crafted on Sprout → " + sectionLabel("roots") + ". Edit there anytime.";
      } else if (isModuleUnlocked("roots")) {
        hint.hidden = true;
        hint.textContent = "";
      } else {
        var prior = priorSectionId("roots");
        var priorName = prior ? sectionLabel(prior) : "the previous step";
        hint.hidden = false;
        hint.textContent = "You’re not at " + sectionLabel("roots") + " yet — finish " + priorName + " first, then craft your story.";
      }
    }

    if (cta) {
      if (complete) {
        cta.textContent = "Edit this";
        cta.setAttribute("data-goto", "roots");
        cta.removeAttribute("data-your-story-gate");
      } else if (isModuleUnlocked("roots")) {
        cta.textContent = "Grow your sprout and craft your story";
        cta.setAttribute("data-goto", "roots");
        cta.removeAttribute("data-your-story-gate");
      } else {
        var nowAt = currentRunwayPanel();
        cta.textContent = "Continue your sprout first";
        cta.setAttribute("data-goto", nowAt);
        cta.setAttribute("data-your-story-gate", "1");
      }
    }
  }

  function renderHomeFindBlurbs() {
    var roots = document.getElementById("rootsHomeBlurb");
    var grove = document.getElementById("groveHomeBlurb");
    if (roots) {
      roots.hidden = !state.done.roots;
      roots.innerHTML = isFull()
        ? "Your story stays here on Sprout — revisit the assembled version anytime under <strong>Calendar → Your story</strong>."
        : "Your story stays here on Sprout — come back anytime to reread or tweak it.";
    }
    if (grove) {
      grove.hidden = !state.done.grove;
      grove.innerHTML = "Your Ideal Lead List now lives under <strong>Leads</strong>. Keep adding names and send your page when they’re ready. Your dream tree also lives under <strong>Grove</strong>.";
    }
  }

  var lastGroveCount = 0;
  var lastCustomerCount = 0;
  var groveFlashTimers = {};

  function flashGroveTrees(wrapId, forceAll) {
    var wrap = document.getElementById(wrapId || "groveTrees");
    if (!wrap) return;
    var visual = wrap.closest(".grove-visual");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var nodes = wrap.querySelectorAll(".gtree");
    if (!nodes.length) return;
    if (visual) {
      visual.classList.add("flashing");
      clearTimeout(groveFlashTimers[wrapId]);
      groveFlashTimers[wrapId] = setTimeout(function () { visual.classList.remove("flashing"); }, 450);
    }
    for (var i = 0; i < nodes.length; i++) {
      (function (node, delay) {
        setTimeout(function () {
          node.classList.remove("flash");
          void node.offsetWidth;
          node.classList.add("flash");
        }, forceAll ? delay : 0);
      })(nodes[i], forceAll ? (i % 8) * 40 : 0);
    }
  }

  function renderNameLane(opts) {
    opts = opts || {};
    var names = opts.names || [];
    var count = document.getElementById(opts.countId);
    var trees = document.getElementById(opts.treesId);
    var hint = document.getElementById(opts.hintId);
    if (!count) return;
    var n = names.length;
    var empty = opts.empty || "Empty soil — add your first name.";
    var unit = opts.unit || "names";
    count.innerHTML = n === 0 ? empty
      : "<strong>" + n + "</strong> " + (n === 1 ? unit.replace(/s$/, "") : unit) + (opts.suffix || "");
    if (hint) {
      var hints = opts.hints || {};
      hint.textContent = n === 0 ? "" :
        n < (opts.goal || 5) ? (hints.low || "Keep going — even 5 names is a real start.") :
        n < 15 ? (hints.mid || "Nice. Aim for 15–25 when you can.") :
        n <= 25 ? (hints.full || "That's a full list. Quality over quantity from here.") :
        (hints.over || "That's a forest! Focus on the warmest 25.");
    }

    var prev = opts.getPrev ? opts.getPrev() : 0;
    if (trees) {
      var key = String(n);
      if (trees.dataset.groveKey !== key) {
        trees.dataset.groveKey = key;
        var hues = opts.hues || ["#abb09a", "#c5c9b8", "#9aa08a", "#b8bca8"];
        var html = "";
        var sproutFn = window.FS.miniSproutSVG || window.FS.miniTreeSVG;
        for (var i = 0; i < Math.min(n, 30); i++) {
          html += '<span class="gtree" title="' + esc(names[i]) + '">' + sproutFn(hues[i % hues.length]) + "</span>";
        }
        trees.innerHTML = html;
        if (opts.flash && n > prev && n > 0) {
          requestAnimationFrame(function () { flashGroveTrees(opts.treesId, true); });
        }
      }
    }
    if (opts.setPrev) opts.setPrev(n);
  }

  function renderPickList(lane) {
    var names = lane === "warm" ? groveNames() : customerNames();
    var picks = pruneGrovePicks(lane);
    var wrap = document.getElementById(lane === "warm" ? "warmPicksWrap" : "customerPicksWrap");
    var list = document.getElementById(lane === "warm" ? "warmPickList" : "customerPickList");
    var meta = document.getElementById(lane === "warm" ? "warmPickMeta" : "customerPickMeta");
    if (!wrap || !list) return;
    if (!names.length) {
      wrap.hidden = true;
      list.innerHTML = "";
      if (meta) meta.textContent = "";
      return;
    }
    wrap.hidden = false;
    var selected = {};
    picks.forEach(function (n) { selected[n.toLowerCase()] = true; });
    var atMax = picks.length >= 5;
    var buttons = list.querySelectorAll("[data-grove-pick]");
    var canPatch = buttons.length === names.length;
    if (canPatch) {
      for (var bi = 0; bi < buttons.length; bi++) {
        if (buttons[bi].getAttribute("data-grove-idx") !== String(bi)) { canPatch = false; break; }
        if (buttons[bi].textContent !== names[bi]) { canPatch = false; break; }
      }
    }
    if (canPatch) {
      names.forEach(function (name, idx) {
        var on = !!selected[name.toLowerCase()];
        var disabled = !on && atMax;
        buttons[idx].classList.toggle("on", on);
        buttons[idx].setAttribute("aria-pressed", on ? "true" : "false");
        buttons[idx].disabled = disabled;
      });
    } else {
      var html = "";
      names.forEach(function (name, idx) {
        var on = !!selected[name.toLowerCase()];
        var disabled = !on && atMax;
        html += '<button type="button" class="grove-chip' + (on ? " on" : "") + '"'
          + ' data-grove-pick="' + lane + '" data-grove-idx="' + idx + '"'
          + (on ? ' aria-pressed="true"' : ' aria-pressed="false"')
          + (disabled ? " disabled" : "")
          + ">" + esc(name) + "</button>";
      });
      list.innerHTML = html;
    }
    if (meta) {
      if (lane === "customers") {
        if (picks.length) {
          meta.textContent = isFull()
            ? picks.length + " of 5 first chats selected · landing on your Calendar"
            : picks.length + " of 5 first chats selected · your first outreach list";
        } else {
          meta.textContent = "Tap the easiest people to share a product story with first.";
        }
      } else {
        if (picks.length) {
          meta.textContent = isFull()
            ? picks.length + " partner chats selected · also on your Calendar"
            : picks.length + " partner chats selected · optional outreach list";
        } else {
          meta.textContent = "Optional — tap anyone you'd start a mission chat with.";
        }
      }
    }
  }

  function renderGrove(opts) {
    opts = opts || {};
    pruneGrovePicks("warm");
    pruneGrovePicks("customers");
    renderNameLane({
      names: customerNames(),
      countId: "customerCount",
      treesId: "customerTrees",
      hintId: "customerHint",
      empty: "Customer soil is empty — who would love the products?",
      unit: "customer names",
      suffix: " who'd love the products",
      hints: {
        low: "Keep going — even 5 product-curious names is a real start.",
        mid: "Nice. Who else asks about what you use, drink, or put on your skin?",
        full: "Solid customer map — tap your first chats below.",
        over: "Plenty of leads — quality chats beat a long list."
      },
      hues: ["#d9a93f", "#e8c86a", "#c9a04a", "#f0d06a"],
      flash: !!opts.customerFlash,
      getPrev: function () { return lastCustomerCount; },
      setPrev: function (n) { lastCustomerCount = n; }
    });
    renderPickList("customers");
  }

  var syncLeadBlurbTimer = null;

  function syncPageStoryToLeadBlurb(immediate) {
    if (!usesBuiltInLeadPage()) return;
    if (groundLineLocked()) return;
    var story = ((state.data.page_story || "") + "").trim().slice(0, 280);
    var input = document.getElementById("leadsBlurbInput");
    if (input && document.activeElement !== input) input.value = story;

    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) {
      state.data._synced_page_story = story;
      return;
    }
    var user = Cloud.user() || {};
    var current = ((user.lead_blurb || "") + "").trim();
    var prevSynced = ((state.data._synced_page_story || "") + "").trim();
    /* Keep auto-fill going until they customize the intro to something else in Leads settings */
    if (current && current !== prevSynced && current !== story) return;
    state.data._synced_page_story = story;
    clearTimeout(syncLeadBlurbTimer);
    function send() {
      if (!usesBuiltInLeadPage()) return;
      Cloud.setLeadBlurb(story).then(function () {
        var liveInput = document.getElementById("leadsBlurbInput");
        if (liveInput && document.activeElement !== liveInput && !groundLineLocked()) {
          liveInput.value = story;
        }
      }).catch(function (err) {
        console.warn("[First Seeds] setLeadBlurb:", err);
        markCloudSyncError(err && err.message
          ? err
          : { message: "Couldn’t save your lead-page intro to the cloud." });
      });
    }
    if (immediate) send();
    else syncLeadBlurbTimer = setTimeout(send, 700);
  }

  function renderMiniPage() {
    var locked = groundLineLocked();
    var editor = document.getElementById("groundLineEditor");
    var live = document.getElementById("groundLineLive");
    var liveText = document.getElementById("groundLineLiveText");
    var lede = document.getElementById("groundPageLede");
    var line = liveOpeningLine();
    if (editor) editor.hidden = locked;
    if (live) live.hidden = !locked;
    if (liveText) liveText.textContent = line || "—";
    if (lede) {
      lede.textContent = locked
        ? "Your page is live. The opening line below is what visitors read first — change it under Leads."
        : "You already have a page. Draft the opening line — the first personal thing a visitor reads — then the link is yours under Leads.";
    }
    var el = document.getElementById("miniHeadline");
    if (el) el.textContent = line || DEFAULT_LEAD_BLURB;
    var brand = document.getElementById("miniBrandName");
    if (brand) brand.textContent = firstName() || "you";
    var hint = document.getElementById("pageStoryHint");
    if (hint) {
      hint.textContent = "Pull straight from your Roots. This is the first personal thing a visitor reads. After you leave this step, you’ll change it under Leads.";
    }
    var liveLink = document.getElementById("groundLivePageLink");
    if (liveLink) {
      var Cloud = window.FS.Cloud;
      var user = Cloud && Cloud.user ? Cloud.user() : null;
      var slug = user && user.lead_slug ? String(user.lead_slug).trim() : "";
      if (slug) {
        liveLink.href = leadsPreviewHref(slug);
        liveLink.hidden = false;
      } else {
        liveLink.hidden = true;
      }
      if (!liveLink.dataset.boundPreview) {
        liveLink.dataset.boundPreview = "1";
        liveLink.addEventListener("click", function () {
          if (state.data.lead_preview_seen) return;
          state.data.lead_preview_seen = true;
          save();
          renderGroundLeadSetup();
          renderModuleChecklists();
        });
      }
    }
  }

  function runClaimCheck(key) {
    var el = document.querySelector('[data-check="' + key + '"]');
    if (!el) return;
    var text = (state.data[key] || "");
    var trimmed = text.trim();
    if (!trimmed) { el.innerHTML = ""; return; }
    var hits = [];
    for (var i = 0; i < RISKY.length; i++) if (RISKY[i].re.test(text)) hits.push(RISKY[i]);
    if (hits.length) {
      var html = "";
      for (var j = 0; j < hits.length; j++) html += '<span class="claim-flag">⚠ ' + esc(hits[j].word) + "</span>";
      html += '<span class="claim-note">' + esc(hits[0].tip) + (hits.length > 1 ? " (and " + (hits.length - 1) + " more to double-check)" : "") + "</span>";
      el.innerHTML = html;
      return;
    }
    /* Don't celebrate “clean” — only warn when risky claim words show up */
    if (trimmed.length < 12) { el.innerHTML = ""; return; }
    el.innerHTML = "";
  }

  function renderWeek() {
    var strip = document.getElementById("weekStrip");
    if (!strip) return;
    var sel = state.data.rhythm || [];
    var byDay = {};
    for (var i = 0; i < RHYTHMS.length; i++) {
      if (sel.indexOf(RHYTHMS[i].label) > -1 && RHYTHMS[i].day >= 0) byDay[RHYTHMS[i].day] = RHYTHMS[i];
    }
    var html = "";
    for (var d = 0; d < 7; d++) {
      var r = byDay[d];
      html += '<div class="day' + (r ? " lit" : "") + '"><div class="day-name">' + DAY_NAMES[d] + '</div><div class="day-icon">' + (r ? r.icon : "") + '</div><div class="day-what">' + (r ? r.short : "") + "</div></div>";
    }
    strip.innerHTML = html;
  }

  function markFilledStates() {
    var fields = document.querySelectorAll(".field[data-field]");
    for (var i = 0; i < fields.length; i++) {
      var k = fields[i].getAttribute("data-field");
      var len = ((state.data[k] || "") + "").trim().length;
      fields[i].classList.toggle("filled", len >= 24);
    }
  }

  function liveRefresh(opts) {
    opts = opts || {};
    var typing = typingInField();
    if (packEvergreen()) {
      if (noteEvergreenVisit(state.active)) save();
      renderBottomNav();
      if (state.active === "ev-home") renderEvergreenSprout({ silent: !!opts.silent });
      if (state.active === "ev-learn") renderEvergreenLearnFavs();
      if (state.active === "ev-heart") renderEvergreenHeartStory();
      if ((state.active === "ev-leads" || state.active === "ev-dream") && !typing) renderEvergreenLists();
      if (state.active === "roots") renderStory();
      if (!typing) {
        renderEvergreenPathChecks();
        refreshButtons();
      }
      return;
    }
    if (reconcileDoneFlags()) save();
    autoClaimReadySteps();
    maybeLockGroundLine();
    if (typing) {
      markFilledStates();
      renderMiniPage();
      return;
    }
    renderStory();
    renderYourStory();
    renderHomeFindBlurbs();
    renderGrove({ flash: !!opts.groveFlash, customerFlash: !!opts.customerFlash });
    renderMiniPage();
    renderWeek();
    markFilledStates();
    renderPlant(opts);
    refreshButtons();
    renderModuleChecklists();
    renderTodayCard();
    renderHomeRunway();
    renderGroundLeadSetup();
    renderBottomNav();
    refreshAllShortlists();
  }

  /* ── leaf burst ──────────────────────────────────────── */
  function leafBurst(x, y) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var colors = ["#abb09a", "#c5c9b8", "#f0d06a", "#d9a93f"];
    for (var i = 0; i < 10; i++) {
      var el = document.createElement("div");
      el.className = "leaf-p";
      var ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 70;
      el.style.setProperty("--dx", (Math.cos(ang) * dist) + "px");
      el.style.setProperty("--dy", (Math.sin(ang) * dist - 40) + "px");
      el.style.setProperty("--rot", (Math.random() * 540 - 270) + "deg");
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.innerHTML = '<svg viewBox="0 0 14 14" width="14" height="14"><path d="M7 1 C12 3 13 9 7 13 C1 9 2 3 7 1 Z" fill="' + colors[i % 4] + '"/></svg>';
      document.body.appendChild(el);
      setTimeout((function (n) { return function () { n.remove(); }; })(el), 1200);
    }
  }

  /* ── field wiring ────────────────────────────────────── */
  var flashTimers = {};
  function flash(section) {
    var el = document.querySelector('[data-flash="' + section + '"]');
    if (!el) return;
    el.classList.add("show");
    clearTimeout(flashTimers[section]);
    flashTimers[section] = setTimeout(function () { el.classList.remove("show"); }, 1400);
  }
  function sectionOf(el) {
    var p = el.closest(".panel");
    return p ? p.id.replace("panel-", "") : null;
  }

  var fields = document.querySelectorAll("[data-key]");
  for (var fi = 0; fi < fields.length; fi++) {
    (function (f) {
      var k = f.getAttribute("data-key");
      if (state.data[k]) f.value = state.data[k];
      var t;
      var isLongWrite = f.tagName === "TEXTAREA";
      f.addEventListener("input", function () {
        state.data[k] = f.value;
        persistLocal();
        runClaimCheck(k);
        var beforeRoots = lastRoots;
        var beforeSprout = lastSprout;
        var beforeEv = lastEvSprout;
        var groveFlash = false;
        var customerFlash = false;
        if (k === "warm") {
          groveFlash = groveNames().length !== lastGroveCount;
        }
        if (k === "customers") {
          customerFlash = customerNames().length !== lastCustomerCount;
        }
        if (k === "warm" || k === "customers") {
          syncIdealLeadsFromNameField(k === "warm" ? "warm" : "customers");
          pruneGrovePicks(k === "warm" ? "warm" : "customers");
        }
        liveRefresh({ groveFlash: groveFlash, customerFlash: customerFlash, silent: true });
        if (k === "page_story") syncPageStoryToLeadBlurb();
        /* Pulse when roots or sprout checklist progress actually advances */
        if (!packEvergreen() && (rootCount() > beforeRoots || checklistProgress().sproutDone > beforeSprout)) {
          lastRoots = beforeRoots;
          lastSprout = beforeSprout;
          renderPlant({ deferCelebrate: isLongWrite });
        } else if (packEvergreen() && evProgress().sproutDone > beforeEv && beforeEv >= 0) {
          lastEvSprout = beforeEv;
          renderEvergreenSprout({ deferCelebrate: isLongWrite });
        } else if (isLongWrite && pendingGrowth) {
          /* keep the overlay parked until they leave the field */
          clearTimeout(growthIdleTimer);
          growthIdleTimer = null;
        }
        clearTimeout(t);
        t = setTimeout(function () {
          if (k === "warm" || k === "customers") syncGroveCalendar();
          save();
          flash(sectionOf(f));
        }, 500);
      });
      f.addEventListener("blur", function () {
        state.data[k] = f.value;
        clearTimeout(t);
        if (k === "warm" || k === "customers") syncGroveCalendar();
        flushSave();
        if (packEvergreen()) {
          renderEvergreenLists();
          renderEvergreenPathChecks();
        } else {
          autoClaimReadySteps();
          maybeLockGroundLine();
          renderGrove();
          renderMiniPage();
          renderModuleChecklists();
        }
        refreshButtons();
        scheduleGrowthFlush();
      });
    })(fields[fi]);
  }

  function renderChoices() {
    var cards = document.querySelectorAll("[data-choice]");
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], key = c.getAttribute("data-choice"), val = c.getAttribute("data-value");
      var sel = state.data[key] === val;
      c.classList.toggle("selected", sel);
      c.querySelector(".choice-radio").textContent = sel ? "✓" : "";
    }
    renderGroundLeadSetup();
    renderBottomNav();
  }

  function renderRhythms() {
    var rhythmWrap = document.getElementById("rhythmList");
    if (!rhythmWrap) return;
    var sel = state.data.rhythm || [];
    var html = "";
    for (var i = 0; i < RHYTHMS.length; i++) {
      var on = sel.indexOf(RHYTHMS[i].label) > -1;
      html += '<button class="check' + (on ? " on" : "") + '" data-rhythm="' + i + '"><span class="check-box">' + (on ? "✓" : "") + '</span><span>' + RHYTHMS[i].icon + " " + esc(RHYTHMS[i].label) + "</span></button>";
    }
    rhythmWrap.innerHTML = html;
  }

  /* ── tree input handling ─────────────────────────────── */
  function refreshTreeChrome() {
    var c = Tree.counts(Tree.ensure(state));
    var statsHtml = c.total
      ? ("<strong>" + c.total + "</strong> · 🌱 " + c.hopeful + " · 🌳 " + c.committed)
      : "";
    var stats = document.getElementById("treeStats");
    var dreamStats = document.getElementById("dreamTreeStats");
    if (stats) stats.innerHTML = statsHtml;
    if (dreamStats) dreamStats.innerHTML = statsHtml;
  }

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute("data-tname")) {
      Tree.setName(state, t.getAttribute("data-tname"), t.value);
      persistLocal();
      refreshTreeChrome();
      var beforeSprout = lastSprout;
      if (!packEvergreen() && checklistProgress().sproutDone > beforeSprout) {
        lastSprout = beforeSprout;
        renderPlant({ deferCelebrate: true });
      }
      clearTimeout(flashTimers._tree);
      flashTimers._tree = setTimeout(function () {
        save();
        flash("tree");
      }, 500);
    }
  });
  document.addEventListener("blur", function (e) {
    var t = e.target;
    if (!(t && t.hasAttribute && t.hasAttribute("data-tname"))) return;
    clearTimeout(flashTimers._tree);
    flushSave();
    syncWarmFromTree();
    if (isFull()) syncGroveCalendar();
    renderModuleChecklists("grove");
    refreshButtons();
    scheduleGrowthFlush();
  }, true);

  /* ── onboarding ──────────────────────────────────────── */
  var onboardingStep = 0;
  var ONBOARD_STEPS = 7;
  var ONBOARD_THEMES = [
    "onboarding-welcome",
    "onboarding-circle",
    "onboarding-install",
    "onboarding-name",
    "onboarding-auth",
    "onboarding-mode",
    "onboarding-notify"
  ];
  var pendingOnboardMode = "";
  var onboardingNotifyOnly = false;
  var onboardingNotifyKind = ""; /* reconnect | extra-phone | first */
  var installPlatform = "";
  var deferredInstallPrompt = null;
  var lastOnboardAuthIntent = "create";
  var AUTH_INTENT_KEY = "firstSeeds_onboard_auth";

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  function cloudSignedIn() {
    return !!(window.FS.Cloud && window.FS.Cloud.isSignedIn && window.FS.Cloud.isSignedIn());
  }

  function isRunningAsInstalledApp() {
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
      if (window.navigator.standalone === true) return true;
    } catch (e) {}
    return false;
  }

  function guessInstallPlatform() {
    var ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return "android";
    if (window.FS && window.FS.Push && typeof window.FS.Push.isIos === "function" && window.FS.Push.isIos()) {
      return "ios";
    }
    if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
    try {
      if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return "ios";
    } catch (e) {}
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }

  function browserContext() {
    if (isRunningAsInstalledApp()) return { kind: "standalone", name: "" };
    var ua = navigator.userAgent || "";
    if (/Instagram|IGL\//i.test(ua)) return { kind: "in-app", name: "Instagram" };
    if (/FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua)) return { kind: "in-app", name: "Facebook" };
    if (/Messenger/i.test(ua)) return { kind: "in-app", name: "Messenger" };
    if (/Line\//i.test(ua)) return { kind: "in-app", name: "LINE" };
    if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) return { kind: "in-app", name: "TikTok" };
    if (/Snapchat/i.test(ua)) return { kind: "in-app", name: "Snapchat" };
    if (/WhatsApp/i.test(ua)) return { kind: "in-app", name: "WhatsApp" };
    if (/Twitter|X\/|LinkedInApp/i.test(ua)) return { kind: "in-app", name: "another app" };
    if (/GSA\//i.test(ua)) return { kind: "google-app", name: "the Google app" };
    if (/; wv\)/i.test(ua) || /\bwv\b/i.test(ua)) return { kind: "in-app", name: "this app" };
    var ios = guessInstallPlatform() === "ios";
    if (ios) {
      if (/CriOS/i.test(ua)) return { kind: "chrome-ios", name: "Chrome" };
      if (/FxiOS/i.test(ua)) return { kind: "chrome-ios", name: "Firefox" };
      if (/EdgiOS/i.test(ua)) return { kind: "chrome-ios", name: "Edge" };
      if (/OPiOS|OPT\//i.test(ua)) return { kind: "chrome-ios", name: "Opera" };
      /* Real Safari has Version/ + Safari/. Gmail, Mail, and many in-app
         browsers are WKWebView with WebKit + Mobile and no Safari token. */
      var realSafari = /Version\/[\d.]+/i.test(ua) && /Safari\//i.test(ua);
      if (!realSafari) return { kind: "in-app", name: "another app" };
      return { kind: "safari", name: "Safari" };
    }
    if (/Android/i.test(ua)) return { kind: "android-chrome", name: "Chrome" };
    return { kind: "desktop", name: "" };
  }

  function installIsBlocked() {
    var kind = browserContext().kind;
    return kind === "in-app" || kind === "chrome-ios" || kind === "google-app";
  }

  function wantsSignIn() {
    if (lastOnboardAuthIntent === "signin") return true;
    try {
      if (String(new URLSearchParams(location.search).get("signin") || "") === "1") return true;
    } catch (eQ) {}
    try {
      if (sessionStorage.getItem(AUTH_INTENT_KEY) === "signin") return true;
    } catch (eS) {}
    try {
      if (localStorage.getItem(AUTH_INTENT_KEY) === "signin") return true;
    } catch (eL) {}
    return false;
  }

  function rememberSignInIntent() {
    lastOnboardAuthIntent = "signin";
    try { sessionStorage.setItem(AUTH_INTENT_KEY, "signin"); } catch (eS) {}
    try { localStorage.setItem(AUTH_INTENT_KEY, "signin"); } catch (eL) {}
    pinSignInOnManifest();
  }

  function clearSignInIntent() {
    lastOnboardAuthIntent = "create";
    try { sessionStorage.removeItem(AUTH_INTENT_KEY); } catch (eS) {}
    try { localStorage.removeItem(AUTH_INTENT_KEY); } catch (eL) {}
  }

  function pinSignInOnManifest() {
    try {
      var link = document.getElementById("fsManifest") ||
        document.querySelector('link[rel="manifest"]');
      if (!link) return;
      var href = String(link.getAttribute("href") || "manifest.webmanifest");
      if (/[?&]signin=1(?:&|$)/.test(href)) return;
      href += (href.indexOf("?") >= 0 ? "&" : "?") + "signin=1";
      link.setAttribute("href", href);
    } catch (e) {}
  }

  function currentAppUrl() {
    try { return String(location.href || ""); } catch (e) { return ""; }
  }

  function safariOpenHref() {
    try {
      var u = new URL(location.href);
      if (u.protocol === "https:") return "x-safari-https://" + u.host + u.pathname + u.search + u.hash;
      if (u.protocol === "http:") return "x-safari-http://" + u.host + u.pathname + u.search + u.hash;
    } catch (e) {}
    return "";
  }

  function copyCurrentAppLink(btn) {
    var url = currentAppUrl();
    if (!url) return;
    function done() {
      if (btn) btn.textContent = "Link copied ✓";
    }
    try {
      var ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch (e) {}
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () {});
    }
  }

  /* Step map: 0 welcome · 1 circle · 2 install · 3 name · 4 auth · 5 mode */
  function advanceToNameStep() {
    onboardingStep = 3;
    renderOnboardingStep();
  }

  function advanceToAuthStep() {
    onboardingStep = 4;
    renderOnboardingStep();
  }

  function advanceToModeStep() {
    if (packEvergreen()) {
      onboardingStep = 6;
      renderOnboardingStep();
      return;
    }
    onboardingStep = 5;
    renderOnboardingStep();
  }

  function installTrapHtml() {
    var ctx = browserContext();
    var name = ctx.name || "this app";
    var ios = guessInstallPlatform() === "ios";
    var title = "";
    var body = "";
    if (ctx.kind === "in-app") {
      title = "You’re inside " + name;
      body = ios
        ? "Home Screen only works from Safari. Tap the <strong>•••</strong> menu, then <strong>Open in Safari</strong>. Come back to these steps there — not from " + name + "."
        : "Home Screen only works from Chrome. Tap the <strong>•••</strong> menu, then <strong>Open in Chrome</strong> or <strong>Open in browser</strong>.";
    } else if (ctx.kind === "chrome-ios") {
      title = name + " on iPhone can’t add this as an app";
      body = "Copy the link, then open the <strong>Safari</strong> app (the compass) and paste it there. Add to Home Screen only works in Safari — not in " + name + ".";
    } else if (ctx.kind === "google-app") {
      title = "This is the Google app, not Chrome";
      body = "Copy the link, open the <strong>Chrome</strong> app (the colorful circle), and paste it in the address bar — not in Search. Search turns this into a 404.";
    } else {
      return "";
    }
    var actions = '<div class="onboard-install-switch-actions">' +
      '<button type="button" class="btn overlay-btn" id="onboardInstallCopyLink">Copy this link</button>';
    var safari = ios ? safariOpenHref() : "";
    if (safari && /^x-safari-https?:\/\//i.test(safari)) {
      actions += '<a class="btn-ghost overlay-btn" id="onboardInstallOpenSafari" href="' + safari.replace(/"/g, "") + '">Try Open in Safari →</a>';
    }
    actions += '<button type="button" class="btn-ghost overlay-btn" id="onboardInstallSignInAnyway">I already have an account — sign in here →</button>';
    actions += "</div>";
    return '<div class="onboard-install-switch" role="status"><strong>' + title + "</strong><p style=\"margin:8px 0 0\">" + body + "</p>" + actions + "</div>";
  }

  function goToSignInFromInstallTrap() {
    rememberSignInIntent();
    onboardingStep = 4;
    renderOnboardingStep();
  }

  function bindInstallGuideActions() {
    var copyBtn = document.getElementById("onboardInstallCopyLink");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () { copyCurrentAppLink(copyBtn); });
    }
    var signInAnyway = document.getElementById("onboardInstallSignInAnyway");
    if (signInAnyway) {
      signInAnyway.addEventListener("click", goToSignInFromInstallTrap);
    }
  }

  function installGuideHtml(platform) {
    var pendingJoin = "";
    try {
      if (window.FS.Cloud && window.FS.Cloud.pendingJoinCode) {
        pendingJoin = String(window.FS.Cloud.pendingJoinCode() || "").trim();
      }
    } catch (e) {}
    var trap = installTrapHtml();
    if (trap) return trap;
    var signIn = wantsSignIn();
    var afterOpen = signIn
      ? "That’s where you’ll sign in. This browser page and the Home Screen icon don’t share a login."
      : "That’s where you’ll type your name.";
    var here = platform === "ios" ? "Safari" : "Chrome";
    var head = '<p class="onboard-install-do">Do these steps here in ' + here + "</p>";
    var joinSaved = "";
    if (pendingJoin) {
      var swReady = false;
      try { swReady = !!(navigator.serviceWorker && navigator.serviceWorker.controller); } catch (eSw) {}
      joinSaved = swReady
        ? '<p class="onboard-join-saved" role="status">✓ Your invite is attached to this ' +
          (platform === "ios" ? "Safari window" : (platform === "android" ? "Chrome window" : "browser window")) +
          ". Add the Home Screen icon from here — not from a different First Seeds tab.</p>"
        : '<p class="onboard-join-saved" role="status">Saving your invite on this page — wait a moment before you tap Share or Install.</p>';
    }
    if (platform === "ios") {
      return head +
        '<ol class="onboard-install-steps">' +
        "<li>Stay in <strong>Safari</strong> (not Chrome, and not inside Instagram or Texts).</li>" +
        "<li>Tap the <strong>Share</strong> button " +
        '<span class="onboard-install-glyph" aria-hidden="true">□↑</span> ' +
        "at the bottom of Safari (or top on iPad).</li>" +
        '<li class="onboard-install-key">Scroll and tap <strong>Add to Home Screen</strong>.</li>' +
        "<li>Tap <strong>Add</strong> in the top right — you should see a First Seeds icon on your Home Screen.</li>" +
        '<li class="onboard-install-key">Then close this Safari page and open First Seeds from that new icon. ' + afterOpen + "</li>" +
        "</ol>" +
        joinSaved +
        '<p class="onboard-install-note">If you don’t see “Add to Home Screen,” scroll the share sheet all the way down. Still missing? Tap <strong>Edit Actions</strong> and turn it on.</p>';
    }
    if (platform === "android") {
      var installBtn = deferredInstallPrompt
        ? '<button type="button" class="btn overlay-btn" id="onboardInstallPromptBtn" style="margin-bottom:12px">Install First Seeds →</button>'
        : "";
      return head + installBtn +
        '<ol class="onboard-install-steps">' +
        '<li class="onboard-install-key">Stay in <strong>Chrome</strong> — the browser with the colorful circle. Not the Google app, and don’t paste this link into Google Search (that’s a 404).</li>' +
        "<li>Tap the <strong>⋮</strong> menu (top right).</li>" +
        '<li class="onboard-install-key">Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>' +
        "<li>Confirm — then look for the First Seeds icon on your Home Screen.</li>" +
        '<li class="onboard-install-key">Then close this Chrome page and open First Seeds from that icon. ' + afterOpen + "</li>" +
        "</ol>" +
        joinSaved +
        '<p class="onboard-install-note">On some Androids it says “Install” in the address bar instead of the menu.</p>';
    }
    return "";
  }

  function isDesktopBrowser() {
    return guessInstallPlatform() === "desktop" && !isRunningAsInstalledApp();
  }

  function paintOnboardAuthIntent(intent) {
    var createBtn = document.getElementById("onboardingCreateBtn");
    var signInBtn = document.getElementById("onboardingSignInBtn");
    var passIn = document.getElementById("onboardingPassword");
    var isSignIn = intent === "signin";
    lastOnboardAuthIntent = isSignIn ? "signin" : "create";
    if (passIn) passIn.setAttribute("autocomplete", isSignIn ? "current-password" : "new-password");
    if (signInBtn) {
      signInBtn.className = isSignIn ? "btn overlay-btn" : "btn-ghost overlay-btn";
      signInBtn.style.marginTop = isSignIn ? "0" : "8px";
    }
    if (createBtn) {
      createBtn.className = isSignIn ? "btn-ghost overlay-btn" : "btn overlay-btn";
      createBtn.style.marginTop = isSignIn ? "8px" : "0";
    }
    if (signInBtn && createBtn && signInBtn.parentNode === createBtn.parentNode) {
      if (isSignIn && createBtn.compareDocumentPosition(signInBtn) & Node.DOCUMENT_POSITION_FOLLOWING) {
        createBtn.parentNode.insertBefore(signInBtn, createBtn);
      } else if (!isSignIn && signInBtn.compareDocumentPosition(createBtn) & Node.DOCUMENT_POSITION_FOLLOWING) {
        signInBtn.parentNode.insertBefore(createBtn, signInBtn);
      }
    }
  }

  function phoneInstallStay() {
    return installPlatform === "ios" || installPlatform === "android";
  }

  function syncInstallLeaveUi() {
    var next = document.getElementById("onboardingInstallNext");
    var skip = document.getElementById("onboardingInstallSkip");
    var leave = document.getElementById("onboardInstallLeave");
    var confirm = document.getElementById("onboardInstallConfirm");
    var confirmWrap = document.getElementById("onboardInstallConfirmWrap");
    var standalone = isRunningAsInstalledApp() || installPlatform === "standalone";
    var blocked = installIsBlocked();
    var confirmed = !!(confirm && confirm.checked && installPlatform && !blocked);
    if (blocked) {
      if (leave) leave.hidden = true;
      if (confirmWrap) confirmWrap.hidden = true;
      if (next) next.hidden = true;
      if (skip) skip.hidden = true;
      return;
    }
    if (standalone) {
      if (leave) leave.hidden = true;
      if (confirmWrap) confirmWrap.hidden = true;
      if (next) {
        next.hidden = false;
        next.disabled = false;
        next.textContent = (packOnboarding().installCta) || "Continue →";
      }
      if (skip) skip.hidden = true;
      return;
    }
    if (leave) {
      leave.hidden = !confirmed;
      var leaveP = document.getElementById("obInstallLeave");
      if (leaveP && confirmed && wantsSignIn()) {
        leaveP.textContent = "Nice. Close this page now, then open First Seeds from your new Home Screen icon. That’s where you’ll sign in.";
      }
    }
    if (next) next.hidden = true;
    if (skip) skip.hidden = phoneInstallStay();
  }

  function syncInstallNextEnabled() {
    syncInstallLeaveUi();
  }

  function selectInstallPlatform(platform) {
    installPlatform = platform || "";
    state.data.installPlatform = installPlatform;
    save();
    var choices = document.querySelectorAll("#onboardInstallChoices [data-install-platform]");
    for (var i = 0; i < choices.length; i++) {
      choices[i].classList.toggle("on", choices[i].getAttribute("data-install-platform") === installPlatform);
    }
    var guide = document.getElementById("onboardInstallGuide");
    var confirmWrap = document.getElementById("onboardInstallConfirmWrap");
    var confirm = document.getElementById("onboardInstallConfirm");
    if (guide) {
      var html = installPlatform ? installGuideHtml(installPlatform) : (installIsBlocked() ? installTrapHtml() : "");
      guide.hidden = !html;
      guide.innerHTML = html;
      bindInstallGuideActions();
      var promptBtn = document.getElementById("onboardInstallPromptBtn");
      if (promptBtn) {
        promptBtn.addEventListener("click", async function () {
          if (!deferredInstallPrompt) return;
          try {
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
          } catch (e) {}
          deferredInstallPrompt = null;
          promptBtn.hidden = true;
          if (confirm) {
            confirm.checked = true;
            syncInstallNextEnabled();
          }
        });
      }
    }
    if (confirmWrap) confirmWrap.hidden = !installPlatform || installIsBlocked();
    if (confirm && (!installPlatform || installIsBlocked())) confirm.checked = false;
    var installMsg = document.getElementById("onboardingInstallMsg");
    if (installMsg) installMsg.textContent = "";
    syncInstallLeaveUi();
  }

  function renderOnboardingStep() {
    if (onboardingStep === 2 && isDesktopBrowser()) {
      state.data.installSkipped = true;
      onboardingStep = 3;
    }
    var card = document.getElementById("onboardingCard");
    var dots = document.getElementById("onboardingDots");
    if (card) {
      for (var t = 0; t < ONBOARD_THEMES.length; t++) {
        card.classList.toggle(ONBOARD_THEMES[t], t === onboardingStep);
      }
    }
    var panes = document.querySelectorAll("#onboarding .onboarding-pane");
    for (var i = 0; i < panes.length; i++) {
      panes[i].classList.toggle("on", parseInt(panes[i].getAttribute("data-onboard-step"), 10) === onboardingStep);
    }
    if (dots) {
      if (onboardingNotifyOnly) {
        dots.innerHTML = "";
        dots.hidden = true;
      } else {
        dots.hidden = false;
        dots.innerHTML = "";
        var totalDots = packEvergreen() ? 6 : ONBOARD_STEPS;
        var visualStep = onboardingStep;
        if (packEvergreen() && onboardingStep >= 6) visualStep = 5;
        for (var d = 0; d < totalDots; d++) {
          var iEl = document.createElement("i");
          if (d === visualStep) iEl.className = "on";
          else if (d < visualStep) iEl.className = "done";
          dots.appendChild(iEl);
        }
      }
    }
    if (onboardingStep === 2) {
      if (isRunningAsInstalledApp()) {
        var guide = document.getElementById("onboardInstallGuide");
        var lead = document.getElementById("obInstallLead");
        var next = document.getElementById("onboardingInstallNext");
        var choices = document.getElementById("onboardInstallChoices");
        var confirmWrap = document.getElementById("onboardInstallConfirmWrap");
        var leave = document.getElementById("onboardInstallLeave");
        var skip = document.getElementById("onboardingInstallSkip");
        if (lead) lead.textContent = "Nice — you’re already using First Seeds as an app on this device.";
        if (choices) choices.hidden = true;
        if (confirmWrap) confirmWrap.hidden = true;
        if (leave) leave.hidden = true;
        if (skip) skip.hidden = true;
        if (guide) {
          guide.hidden = false;
          guide.innerHTML = '<p class="onboard-install-note" style="margin:0">You’re set. Continue and tell us your name.</p>';
        }
        if (next) {
          next.hidden = false;
          next.disabled = false;
          next.textContent = (packOnboarding().installCta) || "Continue →";
        }
        installPlatform = "standalone";
        return;
      }
      var choiceWrap = document.getElementById("onboardInstallChoices");
      var blocked = installIsBlocked();
      if (choiceWrap) choiceWrap.hidden = blocked;
      var installLead = document.getElementById("obInstallLead");
      if (installLead && blocked) {
        installLead.textContent = wantsSignIn()
          ? "This window can’t keep you signed in. Open the same link in Safari (iPhone) or Chrome (Android), or sign in here for now with the same email as the first time."
          : "This window can’t add First Seeds to your Home Screen. Open the same link in Safari (iPhone) or Chrome (Android) first.";
      } else if (installLead && wantsSignIn()) {
        installLead.textContent = "Add the Home Screen icon from this window, then close this page and open First Seeds from that new icon. That’s where you’ll sign in — this browser page and the icon don’t share a login.";
      }
      /* Phone UA wins over a leftover or synced iPhone/Android choice. */
      var live = guessInstallPlatform();
      var guessed = live === "desktop" ? (state.data.installPlatform || "") : live;
      if (guessed === "desktop") guessed = "";
      selectInstallPlatform(guessed);
    }
    if (onboardingStep === 3) {
      var input = document.getElementById("partnerNameInput");
      var lastInput = document.getElementById("partnerLastNameInput");
      if (input) input.value = partnerName();
      if (lastInput) lastInput.value = partnerLastName();
      syncOnboardPhotoWrap();
      syncNameNext();
      setTimeout(function () {
        syncNameNext();
        if (input) input.focus();
      }, 50);
      /* Autofill can fill after paint without firing input */
      setTimeout(syncNameNext, 400);
    }
    if (onboardingStep === 4) {
      var emailIn = document.getElementById("onboardingEmail");
      var passIn = document.getElementById("onboardingPassword");
      var msg = document.getElementById("onboardingAuthMsg");
      var title = document.getElementById("obAuthTitle");
      var eyebrow = document.getElementById("obAuthEyebrow");
      var body = document.getElementById("obAuthBody");
      var hint = document.getElementById("obAuthHint");
      if (msg) msg.textContent = "";
      if (cloudSignedIn() && !(window.FS.Cloud && window.FS.Cloud.passwordResetPending && window.FS.Cloud.passwordResetPending())) {
        if (modeChosen() && !onboardingReplay) {
          dismissOnboardingIfModeChosen();
          return;
        }
        advanceToModeStep();
        return;
      }
      var returning = wantsSignIn() || hasLocalRootsProgress() || modeChosen();
      if (returning) {
        lastOnboardAuthIntent = "signin";
        if (eyebrow) eyebrow.textContent = "Welcome back";
        if (title) title.textContent = "Sign in to keep going";
        if (body) {
          if (installIsBlocked()) {
            var where = (browserContext().name || "this app");
            body.textContent = "Use the same email and password as the first time. " + where +
              " will forget you when you leave — after you sign in, copy the link, open it in Safari (iPhone) or Chrome (Android), and add the Home Screen icon.";
          } else {
            body.textContent = hasLocalRootsProgress() || modeChosen()
              ? "Your answers are on this device — sign in with the same email (or create an account) to sync them and continue."
              : "Use the same email and password as before. A second account won’t show your old progress.";
          }
        }
      }
      if (hint) hint.hidden = true;
      paintOnboardAuthIntent(returning ? "signin" : "create");
      if (emailIn && !emailIn.value && window.FS.Cloud && window.FS.Cloud.lastEmail) {
        emailIn.value = window.FS.Cloud.lastEmail() || "";
      }
      if (window.FS._onboardReset) window.FS._onboardReset.paint();
      /* Autofocus opens the iOS keyboard and covers Sign in / Create / Forgot.
         Let them tap a field when they’re ready. */
      if (emailIn && !isMobileLayout() && !(window.FS.Cloud && window.FS.Cloud.readPasswordReset && window.FS.Cloud.readPasswordReset())) {
        setTimeout(function () { emailIn.focus(); }, 50);
      }
    }
    if (onboardingStep === 6) {
      paintOnboardNotifyPane();
    } else {
      var closeBtn = document.getElementById("onboardingNotifyClose");
      if (closeBtn) closeBtn.hidden = true;
    }
  }

  function paintOnboardNotifyPane() {
    var enable = document.getElementById("onboardingNotifyEnable");
    var skip = document.getElementById("onboardingNotifySkip");
    var closeBtn = document.getElementById("onboardingNotifyClose");
    var msg = document.getElementById("obNotifyMsg");
    var body = document.getElementById("obNotifyBody");
    var note = document.getElementById("obNotifyNote");
    var title = document.getElementById("obNotifyTitle");
    var eyebrow = document.getElementById("obNotifyEyebrow");
    if (msg) msg.textContent = "";
    if (closeBtn) closeBtn.hidden = false;
    var iosTab = !!(window.FS.Push && window.FS.Push.isIos && window.FS.Push.isIos() && window.FS.Push.isStandalone && !window.FS.Push.isStandalone());
    if (onboardingNotifyOnly && onboardingNotifyKind === "reconnect") {
      if (eyebrow) eyebrow.textContent = "Quick check";
      if (title) title.textContent = "Your phone stopped getting pings";
      if (iosTab) {
        if (body) body.textContent = "Open First Seeds from your Home Screen icon — not this Safari tab — then tap Turn on. That’s the only way iPhone can receive them again.";
        if (note) note.textContent = "If you already have the icon, close Safari and tap that.";
        if (enable) enable.hidden = true;
        if (skip) skip.textContent = "Got it";
      } else {
        if (body) body.textContent = "This phone’s notification link expired, so cheers, joins, and zooms couldn’t reach you. One tap puts you back on — your Settings choices stay the same.";
        if (note) note.textContent = "Takes a second. You can still change what pings you in Settings.";
        if (enable) {
          enable.hidden = false;
          enable.disabled = false;
          enable.textContent = "Turn pings back on →";
        }
        if (skip) skip.textContent = "Not now";
      }
    } else if (onboardingNotifyOnly && onboardingNotifyKind === "extra-phone") {
      var extraNotify = packOnboarding();
      if (eyebrow) eyebrow.textContent = "This phone";
      if (title) title.textContent = "Want to turn on notifications?";
      if (iosTab) {
        if (body) body.textContent = "Open First Seeds from your Home Screen icon first. Safari tabs can’t receive pings.";
        if (note) note.textContent = "Then you can turn them on in the app.";
        if (enable) enable.hidden = true;
        if (skip) skip.textContent = "Got it";
      } else {
        if (body) body.textContent = extraNotify.notifyBody || (packEvergreen()
          ? "We’ll ping you for notes from the hub, team zooms, when someone joins with your link, and when they fill out How I Grow. You can pick which ones in Settings."
          : "We’ll ping you for grove joins, cheers, notes, How I Grow, leads, grove messages, Grove Gatherings, and what’s on your calendar today. You can pick which ones in Settings.");
        if (note) note.textContent = extraNotify.notifyNote || (packEvergreen()
          ? "You can turn these on or off later in Settings."
          : "You can turn any of these on or off later in Settings — including Level 1 joins vs anyone in your tree.");
        if (enable) {
          enable.hidden = false;
          enable.disabled = false;
          enable.textContent = "Turn on notifications →";
        }
        if (skip) skip.textContent = "Not now";
      }
    } else {
      if (eyebrow) eyebrow.textContent = onboardingNotifyOnly ? "A new thing in First Seeds" : "Stay in the loop";
      if (title) title.textContent = "Want a ping when something happens?";
      if (iosTab) {
        if (body) body.textContent = "On iPhone or iPad, open First Seeds from your Home Screen icon first — then you can turn pings on. Safari tabs can’t receive them.";
        if (note) note.textContent = "After you’re in the app, this also lives in Settings if you want to customize what pings you — or skip it for now.";
        if (enable) enable.hidden = true;
        if (skip) skip.textContent = "Got it";
      } else {
        var obNotify = packOnboarding();
        if (body) body.textContent = obNotify.notifyBody || (packEvergreen()
          ? "We’ll ping you for team messages and team zooms. You can pick which ones in Settings."
          : "We’ll ping you for grove joins, cheers, notes, How I Grow, leads, grove messages, Grove Gatherings, and what’s on your calendar today. You can pick which ones in Settings.");
        if (note) note.textContent = obNotify.notifyNote || (packEvergreen()
          ? "You can turn these on or off later in Settings."
          : "You can turn any of these on or off later in Settings — including Level 1 joins vs anyone in your tree.");
        if (eyebrow && !onboardingNotifyOnly) eyebrow.textContent = obNotify.notifyEyebrow || "Stay in the loop";
        if (title && obNotify.notifyTitle) title.textContent = obNotify.notifyTitle;
        if (enable) {
          enable.hidden = false;
          enable.disabled = false;
          enable.textContent = "Turn on notifications →";
        }
        if (skip) skip.textContent = "Not now";
      }
    }
  }

  function syncNameNext() {
    var input = document.getElementById("partnerNameInput");
    var last = document.getElementById("partnerLastNameInput");
    var btn = document.getElementById("onboardingNameNext");
    if (!btn) return;
    var ok = !!(input && String(input.value || "").trim() && last && String(last.value || "").trim());
    btn.disabled = !ok;
  }

  var onboardingReplay = false;

  function hasLocalRootsProgress() {
    return !!(
      filledText("why") ||
      filledText("moment") ||
      filledText("said_yes") ||
      partnerName()
    );
  }

  function accountRequiredReady() {
    if (packEvergreen()) {
      /* No Soft start / All in — the gate lifts after the welcome flow (tourDone) or the notify step. */
      return cloudSignedIn() && !!partnerName() && !!(state.tourDone || state.data.pushPromptSeen);
    }
    return modeChosen() && cloudSignedIn();
  }

  function passwordResetOpen() {
    try {
      /* New-password step can happen while already signed in (code just matched). */
      if (window.FS.Cloud && window.FS.Cloud.passwordResetPending && window.FS.Cloud.passwordResetPending()) return true;
      /* Email / code steps are only for people who are still locked out. */
      if (cloudSignedIn()) return false;
      if (window.FS.Cloud && window.FS.Cloud.readPasswordReset && window.FS.Cloud.readPasswordReset()) return true;
    } catch (e) {}
    return false;
  }

  function dismissOnboardingIfModeChosen() {
    if (onboardingReplay) return false;
    if (notifyPromptActive()) return false;
    if (passwordResetOpen()) return false;
    if (!accountRequiredReady()) return false;
    var wrap = document.getElementById("onboarding");
    if (wrap && wrap.classList.contains("open")) {
      wrap.classList.remove("open");
      syncOverlayBodyLock();
    }
    return true;
  }

  function startOnboarding(opts) {
    opts = opts || {};
    var wrap = document.getElementById("onboarding");
    if (!wrap) return;
    if (teamTreeGrowDemoOn()) return;
    /* Gate stays up until path + account; Settings replay bypasses that.
       A password reset mid-flight still needs the sign-in step, even if they
       already have a session from the code. */
    if (!opts.replay && accountRequiredReady() && !passwordResetOpen()) return;
    /* Boot/auth re-entry must not reset someone mid-flow (welcome → install). */
    if (!opts.replay && !opts.force && wrap.classList.contains("open")) return;
    finishingNotify = false;
    onboardingReplay = !!opts.replay;
    if (!opts.replay && !modeChosen() && state.active !== "welcome") {
      state.active = "welcome";
      renderNav();
      renderPanels();
    }
    if (opts.replay) {
      onboardingStep = 0;
      var conf = document.getElementById("onboardInstallConfirm");
      if (conf) conf.checked = false;
      var confirmWrap = document.getElementById("onboardInstallConfirmWrap");
      if (confirmWrap) confirmWrap.hidden = true;
    } else if (passwordResetOpen()) {
      onboardingStep = 4;
    } else if (partnerName() && cloudSignedIn()) {
      onboardingStep = packEvergreen() ? 6 : 5; /* notify · mode */
    } else if (partnerName() || modeChosen()) {
      onboardingStep = 4; /* account required before the app */
    } else if (isRunningAsInstalledApp() && wantsSignIn()) {
      /* They tapped Sign in — don’t send them through install again. */
      onboardingStep = 4;
    } else if (hasLocalRootsProgress()) {
      onboardingStep = 3; /* name */
    } else if (isRunningAsInstalledApp() && state.data.onboardCircleAck) {
      /* Saw welcome/circle already (usually in Safari) — skip to name in the app.
         First open of the icon is often before they have an account. */
      onboardingStep = 3;
    } else {
      onboardingStep = 0;
    }
    renderOnboardingStep();
    wrap.classList.add("open");
    setOverlayOpen(true);
  }

  function completeOnboarding(mode) {
    if (!cloudSignedIn()) {
      advanceToAuthStep();
      var msg = document.getElementById("onboardingAuthMsg");
      if (msg) msg.textContent = "Create an account or sign in to continue.";
      return;
    }
    var wrap = document.getElementById("onboarding");
    if (wrap) wrap.classList.remove("open");
    if (!packEvergreen()) setHubMode(mode, { silent: true });
    state.active = packEvergreen() ? "ev-home" : "welcome";
    save();
    applyPackChrome();
    renderNav();
    renderPanels();
    var wasReplay = onboardingReplay;
    onboardingReplay = false;
    onboardingNotifyOnly = false;
    onboardingNotifyKind = "";
    pendingOnboardMode = "";
    offerHowGrowAfterOnboarding = !wasReplay;
    var shouldTour = wasReplay || !state.tourDone;
    if (packEvergreen()) {
      /* Lift the welcome gate so an auth tick can't reopen onboarding over the tour. */
      state.tourDone = true;
      save();
    }
    if (shouldTour) startTour();
    else {
      syncOverlayBodyLock();
      setTimeout(maybeOfferHowIGrow, 250);
    }
  }

  var finishingNotify = false;

  function notifyPromptActive() {
    var wrap = document.getElementById("onboarding");
    return !!(wrap && wrap.classList.contains("open") && onboardingStep === 6);
  }

  function currentPushPermission() {
    if (window.FS.Push && typeof window.FS.Push.permission === "function") {
      return window.FS.Push.permission();
    }
    try { return Notification.permission; } catch (e) { return "default"; }
  }

  function resetNotifyEnableBtn() {
    var enable = document.getElementById("onboardingNotifyEnable");
    if (!enable || enable.hidden) return;
    enable.disabled = false;
    enable.textContent = "Turn on notifications →";
  }

  function finishOnboardNotify(opts) {
    if (finishingNotify) return;
    finishingNotify = true;
    opts = opts || {};
    state.data.pushPromptSeen = true;
    if (onboardingNotifyOnly && !opts.ok) {
      state.data.pushReconnectAt = Date.now();
    }
    save();
    if (window.FS.Push && window.FS.Push.refreshSettingsUI) {
      window.FS.Push.refreshSettingsUI().catch(function () {});
    }
    if (onboardingNotifyOnly) {
      onboardingNotifyOnly = false;
      onboardingNotifyKind = "";
      var wrap = document.getElementById("onboarding");
      if (wrap) wrap.classList.remove("open");
      var closeBtn = document.getElementById("onboardingNotifyClose");
      if (closeBtn) closeBtn.hidden = true;
      resetNotifyEnableBtn();
      syncOverlayBodyLock();
      refreshHowGrowReminder();
      finishingNotify = false;
      setTimeout(maybeOfferLastName, 400);
      return;
    }
    completeOnboarding(pendingOnboardMode || state.settings.hubMode || "starter");
    finishingNotify = false;
  }

  async function resumeNotifyPrompt() {
    if (!notifyPromptActive() || finishingNotify) return;
    var perm = currentPushPermission();
    if (perm === "granted") {
      try {
        var sub = null;
        if (window.FS.Push && window.FS.Push.enableThisDevice) {
          sub = await window.FS.Push.enableThisDevice();
        }
        if (sub) {
          finishOnboardNotify({ ok: true });
          return;
        }
      } catch (e) {}
      resetNotifyEnableBtn();
      var msg = document.getElementById("obNotifyMsg");
      if (msg) msg.textContent = "Allowed — tap Turn on once more to finish setting up pings.";
      return;
    }
    if (perm === "denied") {
      finishOnboardNotify();
      return;
    }
    resetNotifyEnableBtn();
  }

  async function maybeOfferPushPrompt() {
    if (onboardingReplay) return false;
    if (!cloudSignedIn()) return false;
    if (window.FS.Push && window.FS.Push.optedOutOnThisPhone && window.FS.Push.optedOutOnThisPhone()) return false;
    if (notifyPromptActive()) return true;
    var wrap = document.getElementById("onboarding");
    if (wrap && wrap.classList.contains("open") && onboardingStep !== 6) return false;
    var howGrow = document.getElementById("howGrowOverlay");
    if (howGrow && !howGrow.hidden) return false;
    var tourEl = document.getElementById("tour");
    if (tourEl && tourEl.classList.contains("open")) return false;
    var perm = currentPushPermission();
    if (perm === "denied") {
      state.data.pushPromptSeen = true;
      save();
      return false;
    }
    if (window.FS.Push && window.FS.Push.isEnabledOnThisDevice) {
      try {
        if (await window.FS.Push.isEnabledOnThisDevice()) {
          state.data.pushPromptSeen = true;
          save();
          return false;
        }
      } catch (e) {}
    }
    var kind = "first";
    if (perm === "granted") kind = "reconnect";
    else {
      try {
        var Cloud = window.FS.Cloud;
        if (Cloud && Cloud.hasAnyPushSubscription && await Cloud.hasAnyPushSubscription()) {
          kind = "extra-phone";
        }
      } catch (eHas) {}
    }
    var dismissedAt = Number(state.data.pushReconnectAt || 0);
    var cooldown = 7 * 24 * 60 * 60 * 1000;
    if (state.data.pushPromptSeen && dismissedAt && (Date.now() - dismissedAt) < cooldown) {
      return false;
    }
    finishingNotify = false;
    onboardingNotifyOnly = true;
    onboardingNotifyKind = kind;
    onboardingStep = 6;
    renderOnboardingStep();
    if (wrap) {
      wrap.classList.add("open");
      setOverlayOpen(true);
    }
    return true;
  }

  function afterExistingUserGate() {
    maybeOfferPushPrompt().then(function (opened) {
      if (opened) return;
      refreshHowGrowReminder();
      setTimeout(maybeOfferLastName, 600);
    }).catch(function () {
      refreshHowGrowReminder();
      setTimeout(maybeOfferLastName, 600);
    });
  }

  function replayOnboardingFromSettings() {
    closeHubMenu();
    startOnboarding({ replay: true });
  }

  /* ── How I Grow support profile ─────────────────────── */
  var HOW_GROW_DRAFT_PREFIX = "firstSeeds_how_i_grow_draft_v1";
  var HOW_GROW_STEP_PREFIX = "firstSeeds_how_i_grow_step_v1";
  var HOW_GROW_TOTAL = 12;
  var howGrowStep = 0;
  var howGrowAnswers = {};
  var howGrowAdvanceTimer = null;
  var offerHowGrowAfterOnboarding = false;

  function howGrowCloud() {
    return window.FS && window.FS.Cloud;
  }

  function howGrowScopeId() {
    var id = boundUserId();
    if (!id) {
      try {
        var Cloud = howGrowCloud();
        var u = Cloud && Cloud.user && Cloud.user();
        if (u && u.id) id = u.id;
      } catch (e) {}
    }
    return id || "guest";
  }

  function howGrowDraftKey() {
    return HOW_GROW_DRAFT_PREFIX + "__" + howGrowScopeId();
  }

  function howGrowStepKey() {
    return HOW_GROW_STEP_PREFIX + "__" + howGrowScopeId();
  }

  function migrateLegacyHowGrowKeys() {
    var scopedDraft = howGrowDraftKey();
    var scopedStep = howGrowStepKey();
    try {
      if (!localStorage.getItem(scopedDraft)) {
        var legacy = localStorage.getItem(HOW_GROW_DRAFT_PREFIX);
        if (legacy && howGrowScopeId() !== "guest") {
          localStorage.setItem(scopedDraft, legacy);
          localStorage.removeItem(HOW_GROW_DRAFT_PREFIX);
        }
      }
      if (!localStorage.getItem(scopedStep)) {
        var legacyStep = localStorage.getItem(HOW_GROW_STEP_PREFIX);
        if (legacyStep && howGrowScopeId() !== "guest") {
          localStorage.setItem(scopedStep, legacyStep);
          localStorage.removeItem(HOW_GROW_STEP_PREFIX);
        }
      }
    } catch (e) {}
  }

  function readHowGrowDraft() {
    migrateLegacyHowGrowKeys();
    try { return JSON.parse(localStorage.getItem(howGrowDraftKey()) || "{}") || {}; }
    catch (e) { return {}; }
  }

  function writeHowGrowDraft() {
    try { localStorage.setItem(howGrowDraftKey(), JSON.stringify(howGrowAnswers)); } catch (e) {}
  }

  function persistHowGrowResumeStep(step) {
    var n = Math.max(0, Math.min(HOW_GROW_TOTAL, step | 0));
    try { localStorage.setItem(howGrowStepKey(), String(n)); } catch (e) {}
    if (state.data) state.data.howGrowResumeStep = n;
  }

  function inferHowGrowResumeStep() {
    var s;
    for (s = 1; s <= HOW_GROW_TOTAL; s++) {
      if (!validateHowGrowStep(s)) return s;
    }
    if (!(howGrowAnswers.surprises && howGrowAnswers.surprises.length) && !howGrowAnswers.surprise_other) return 9;
    if (!howGrowAnswers.one_year_vision) return 10;
    if (!howGrowAnswers.leader_note) return 11;
    return HOW_GROW_TOTAL;
  }

  function readHowGrowResumeStep() {
    var fromState = state.data && parseInt(state.data.howGrowResumeStep, 10);
    if (fromState >= 1 && fromState <= HOW_GROW_TOTAL) return fromState;
    try {
      var stored = parseInt(localStorage.getItem(howGrowStepKey()) || "0", 10);
      if (stored >= 1 && stored <= HOW_GROW_TOTAL) return stored;
    } catch (e) {}
    return inferHowGrowResumeStep();
  }

  function howGrowInput(id) {
    var el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
  }

  function collectHowGrowText() {
    howGrowAnswers.struggling_support = howGrowInput("howGrowStruggling");
    howGrowAnswers.surprise_other = howGrowInput("howGrowSurpriseOther");
    howGrowAnswers.one_year_vision = howGrowInput("howGrowOneYear");
    howGrowAnswers.leader_note = howGrowInput("howGrowLeaderNote");
    howGrowAnswers.contact_phone = howGrowInput("howGrowContactPhone");
    howGrowAnswers.contact_email = howGrowInput("howGrowContactEmail");
    howGrowAnswers.contact_instagram = howGrowInput("howGrowContactIg").replace(/^@+/, "");
    howGrowAnswers.contact_social_other = howGrowInput("howGrowContactSocialOther");
    howGrowAnswers.little_joys = {
      snack: howGrowInput("howGrowSnack"),
      drink: howGrowInput("howGrowDrink"),
      birthday: howGrowInput("howGrowBirthday"),
      color: howGrowInput("howGrowColor"),
      hobby: howGrowInput("howGrowHobby"),
      travel: howGrowInput("howGrowTravel"),
      pets: howGrowInput("howGrowPets"),
      anything_else: howGrowInput("howGrowAnything")
    };
    writeHowGrowDraft();
  }

  function normalizeHowGrowAnswers(answers) {
    var a = answers || {};
    var recognitionAliases = {
      "Public celebration": "I love being celebrated publicly",
      "Small group recognition": "A small group is perfect",
      "Private recognition": "A private message means more",
      "No spotlight": "Please don’t put me in the spotlight"
    };
    ["encouragement", "recognition", "surprises", "contact_channels"].forEach(function (key) {
      if (typeof a[key] === "string" && a[key]) a[key] = [a[key]];
    });
    if (Array.isArray(a.recognition)) {
      a.recognition = a.recognition.map(function (item) {
        return recognitionAliases[item] || item;
      });
    }
    return a;
  }

  function paintHowGrowForm() {
    howGrowAnswers = normalizeHowGrowAnswers(howGrowAnswers);
    var singleGroups = document.querySelectorAll("[data-how-grow-group]");
    for (var i = 0; i < singleGroups.length; i++) {
      var key = singleGroups[i].getAttribute("data-how-grow-group");
      var buttons = singleGroups[i].querySelectorAll("[data-how-grow-value]");
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].classList.toggle("on", howGrowAnswers[key] === buttons[b].getAttribute("data-how-grow-value"));
      }
    }
    var multiGroups = document.querySelectorAll("[data-how-grow-multi]");
    for (var m = 0; m < multiGroups.length; m++) {
      var multiKey = multiGroups[m].getAttribute("data-how-grow-multi");
      var selected = Array.isArray(howGrowAnswers[multiKey]) ? howGrowAnswers[multiKey] : [];
      var multiButtons = multiGroups[m].querySelectorAll("[data-how-grow-value]");
      for (var mb = 0; mb < multiButtons.length; mb++) {
        var value = multiButtons[mb].getAttribute("data-how-grow-value");
        var rank = selected.indexOf(value);
        multiButtons[mb].classList.toggle("on", rank >= 0);
        if (rank >= 0) multiButtons[mb].setAttribute("data-rank", String(rank + 1));
        else multiButtons[mb].removeAttribute("data-rank");
      }
    }
    var fields = {
      howGrowStruggling: howGrowAnswers.struggling_support,
      howGrowSurpriseOther: howGrowAnswers.surprise_other,
      howGrowOneYear: howGrowAnswers.one_year_vision,
      howGrowLeaderNote: howGrowAnswers.leader_note,
      howGrowContactPhone: howGrowAnswers.contact_phone,
      howGrowContactEmail: howGrowAnswers.contact_email,
      howGrowContactIg: howGrowAnswers.contact_instagram,
      howGrowContactSocialOther: howGrowAnswers.contact_social_other,
      howGrowSnack: howGrowAnswers.little_joys && howGrowAnswers.little_joys.snack,
      howGrowDrink: howGrowAnswers.little_joys && howGrowAnswers.little_joys.drink,
      howGrowBirthday: howGrowAnswers.little_joys && howGrowAnswers.little_joys.birthday,
      howGrowColor: howGrowAnswers.little_joys && howGrowAnswers.little_joys.color,
      howGrowHobby: howGrowAnswers.little_joys && howGrowAnswers.little_joys.hobby,
      howGrowTravel: howGrowAnswers.little_joys && howGrowAnswers.little_joys.travel,
      howGrowPets: howGrowAnswers.little_joys && howGrowAnswers.little_joys.pets,
      howGrowAnything: howGrowAnswers.little_joys && howGrowAnswers.little_joys.anything_else
    };
    Object.keys(fields).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      /* Don't wipe mid-edit text when a choice chip re-paints the form. */
      if (document.activeElement === el) return;
      el.value = fields[id] || "";
    });
    var hint = document.getElementById("howGrowEncouragementHint");
    if (hint) {
      var picked = Array.isArray(howGrowAnswers.encouragement) ? howGrowAnswers.encouragement.length : 0;
      hint.textContent = picked >= 2
        ? "That’s your 1st and 2nd — tap one to remove it, then hit Next."
        : picked === 1
          ? "Nice — tap a 2nd if you want, then hit Next."
          : "Tap your 1st pick, then your 2nd if you have one.";
    }
    paintHowGrowContactFields();
  }

  function howGrowContactChannels() {
    return Array.isArray(howGrowAnswers.contact_channels) ? howGrowAnswers.contact_channels : [];
  }

  function paintHowGrowContactFields() {
    var ch = howGrowContactChannels();
    var wantPhone = ch.indexOf("Text") >= 0 || ch.indexOf("Phone") >= 0;
    var wantEmail = ch.indexOf("Email") >= 0;
    var wantSocial = ch.indexOf("Social") >= 0;
    if (wantEmail || wantSocial) prefillHowGrowContact(wantEmail, wantSocial);
    var wrap = document.getElementById("howGrowContactFields");
    var phoneWrap = document.getElementById("howGrowContactPhoneWrap");
    var emailWrap = document.getElementById("howGrowContactEmailWrap");
    var socialWrap = document.getElementById("howGrowContactSocialWrap");
    if (wrap) wrap.hidden = !(wantPhone || wantEmail || wantSocial);
    if (phoneWrap) phoneWrap.hidden = !wantPhone;
    if (emailWrap) emailWrap.hidden = !wantEmail;
    if (socialWrap) socialWrap.hidden = !wantSocial;
  }

  function prefillHowGrowContact(wantEmail, wantSocial) {
    var Cloud = howGrowCloud();
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    if (!user) return;
    if (wantEmail && howGrowAnswers.contact_email == null && user.email) {
      howGrowAnswers.contact_email = String(user.email || "").trim();
      var emailEl = document.getElementById("howGrowContactEmail");
      if (emailEl && document.activeElement !== emailEl) emailEl.value = howGrowAnswers.contact_email;
    }
    if (wantSocial && howGrowAnswers.contact_instagram == null && user.instagram) {
      howGrowAnswers.contact_instagram = String(user.instagram || "").replace(/^@+/, "").trim();
      var igEl = document.getElementById("howGrowContactIg");
      if (igEl && document.activeElement !== igEl) igEl.value = howGrowAnswers.contact_instagram;
    }
  }

  function clearHowGrowAdvance() {
    if (howGrowAdvanceTimer) {
      clearTimeout(howGrowAdvanceTimer);
      howGrowAdvanceTimer = null;
    }
  }

  function showHowGrowStep(step) {
    clearHowGrowAdvance();
    howGrowStep = Math.max(0, Math.min(HOW_GROW_TOTAL, step));
    if (howGrowStep > 0) persistHowGrowResumeStep(howGrowStep);
    var panes = document.querySelectorAll("#howGrowOverlay [data-how-grow-step]");
    for (var i = 0; i < panes.length; i++) {
      panes[i].classList.toggle("on", parseInt(panes[i].getAttribute("data-how-grow-step"), 10) === howGrowStep);
    }
    var progress = document.getElementById("howGrowProgress");
    var label = document.getElementById("howGrowStepLabel");
    var fill = document.getElementById("howGrowProgressFill");
    if (progress) {
      progress.hidden = howGrowStep === 0;
      if (label) label.textContent = howGrowStep + " of " + HOW_GROW_TOTAL;
      if (fill) fill.style.width = Math.round((howGrowStep / HOW_GROW_TOTAL) * 100) + "%";
    }
    var card = document.querySelector("#howGrowOverlay .how-grow-card");
    if (card) card.scrollTop = 0;
  }

  async function openHowIGrow(skipIntro) {
    var Cloud = howGrowCloud();
    if (!Cloud || !Cloud.isSignedIn()) {
      if (window.FS.BridgeUI && window.FS.BridgeUI.openAuth) window.FS.BridgeUI.openAuth(true);
      return;
    }
    howGrowAnswers = normalizeHowGrowAnswers(readHowGrowDraft());
    var completed = false;
    try {
      var saved = await Cloud.loadSupportPreferences();
      if (saved && saved.completed_at && saved.answers) {
        var cloudHowGrow = normalizeHowGrowAnswers(saved.answers);
        /* Completed cloud wins when it has as much (or more) as the draft.
           An empty completed row must not erase last night’s local answers. */
        if (howGrowDraftScore(cloudHowGrow) >= howGrowDraftScore(howGrowAnswers)) {
          howGrowAnswers = cloudHowGrow;
        }
      } else if (saved && saved.answers) {
        howGrowAnswers = normalizeHowGrowAnswers(Object.assign({}, howGrowAnswers, saved.answers));
      }
      completed = !!(saved && saved.completed_at);
    } catch (e) {}
    var ctx = null;
    try { ctx = await Cloud.mySupportContext(); } catch (e) {}
    var intro = document.getElementById("howGrowIntro");
    var privacy = document.getElementById("howGrowPrivacy");
    var leaderName = ctx && (ctx.sponsor_name || ctx.invited_by_name);
    if (intro) {
      intro.textContent = leaderName
        ? leaderName + " would love to know how to best support you on this journey."
        : "The person you sit under would love to know how to best support you on this journey.";
    }
    if (privacy) {
      privacy.textContent = "Your answers are only seen by the person you sit under — your direct upline. You can change them anytime.";
    }
    var laterHint = document.getElementById("howGrowLaterHint");
    if (laterHint) {
      laterHint.textContent = packEvergreen()
        ? "No rush — you’ll find this anytime on Sprout, or in Settings → Your answers."
        : "No rush — you’ll find this anytime at the top of Grove, or in Settings → Your answers.";
    }
    var submit = document.getElementById("howGrowSubmit");
    if (submit) {
      submit.textContent = leaderName ? ("Share with " + leaderName + " →") : "Share with my upline →";
    }
    paintHowGrowForm();
    var resume = readHowGrowResumeStep();
    if (!completed && resume >= 1) {
      showHowGrowStep(resume);
    } else {
      showHowGrowStep(skipIntro ? 1 : 0);
    }
    var overlay = document.getElementById("howGrowOverlay");
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("open");
      setOverlayOpen(true);
    }
  }

  function closeHowIGrow(opts) {
    clearHowGrowAdvance();
    if (!opts || !opts.skipDraftSave) {
      collectHowGrowText();
      if (howGrowStep > 0) {
        persistHowGrowResumeStep(howGrowStep);
        save();
      }
    }
    var overlay = document.getElementById("howGrowOverlay");
    if (overlay) {
      overlay.classList.remove("open");
      overlay.hidden = true;
    }
    syncOverlayBodyLock();
    setTimeout(maybeOfferLastName, 350);
  }

  function validateHowGrowStep(step) {
    var required = {
      1: "learning_style",
      2: "question_style",
      4: "accountability",
      5: "support_frequency",
      7: "encouragement",
      8: "recognition"
    };
    var key = required[step];
    if (!key) return true;
    var value = howGrowAnswers[key];
    if (!value || (Array.isArray(value) && !value.length)) return false;
    return true;
  }

  function validateHowGrowRequired() {
    return [1, 2, 4, 5, 7, 8].every(validateHowGrowStep);
  }

  async function refreshHowGrowReminder() {
    var reminders = document.querySelectorAll("[data-how-grow-reminder]");
    var Cloud = howGrowCloud();
    if (!reminders.length) return;
    if (!Cloud || !Cloud.isSignedIn()) {
      for (var h = 0; h < reminders.length; h++) reminders[h].hidden = true;
      return;
    }
    var saved = null;
    try { saved = await Cloud.loadSupportPreferences(); } catch (e) {}
    var complete = !!(saved && saved.completed_at);
    for (var i = 0; i < reminders.length; i++) {
      reminders[i].hidden = complete;
      if (!complete) {
        reminders[i].innerHTML =
          '<div><strong>🌱 How I Grow</strong><span>' +
          (packEvergreen()
            ? "Help the person you sit under support you in a way that feels like you."
            : "Help your leader support you in a way that feels like you.") +
          "</span></div>" +
          '<button type="button" class="btn-ghost" data-open-how-grow>Fill out my support map →</button>';
      }
    }
    var edit = document.getElementById("editHowIGrowBtn");
    if (edit) edit.textContent = complete ? "Edit How I Grow" : "Start How I Grow";
  }

  async function maybeOfferHowIGrow() {
    if (!offerHowGrowAfterOnboarding) return;
    offerHowGrowAfterOnboarding = false;
    var Cloud = howGrowCloud();
    if (!Cloud || !Cloud.isSignedIn()) return;
    try {
      var saved = await Cloud.loadSupportPreferences();
      if (saved && saved.completed_at) return;
      var ctx = await Cloud.mySupportContext();
      if (!ctx || !(ctx.invited_by_id || ctx.sponsor_id)) return;
      openHowIGrow(false);
    } catch (e) {}
  }

  function isPlaceholderFirst(name) {
    var tok = String(name || "").trim().split(/\s+/)[0] || "";
    if (!tok) return true;
    var Cloud = window.FS && window.FS.Cloud;
    return !!(Cloud && Cloud.isPlaceholderName && Cloud.isPlaceholderName(tok));
  }

  function lastNameMissing() {
    if (partnerLastName()) return false;
    var Cloud = howGrowCloud();
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    if (user && String(user.last_name || "").trim()) return false;
    return true;
  }

  function firstNameMissing() {
    if (!isPlaceholderFirst(partnerName())) return false;
    var Cloud = howGrowCloud();
    var user = Cloud && Cloud.user ? Cloud.user() : null;
    if (user && !isPlaceholderFirst(user.display_name)) return false;
    return true;
  }

  function namePromptNeeded() {
    return firstNameMissing() || lastNameMissing();
  }

  function closeLastNamePrompt() {
    var overlay = document.getElementById("lastNameOverlay");
    if (overlay) {
      overlay.classList.remove("open");
      overlay.hidden = true;
    }
    syncOverlayBodyLock();
    setTimeout(maybeShowGroveLeaderWelcome, 250);
  }

  function openLastNamePrompt() {
    var overlay = document.getElementById("lastNameOverlay");
    var firstField = document.getElementById("firstNamePromptField");
    var lastField = document.getElementById("lastNamePromptField");
    var firstInput = document.getElementById("firstNamePromptInput");
    var input = document.getElementById("lastNamePromptInput");
    var saveBtn = document.getElementById("lastNameSave");
    var msg = document.getElementById("lastNameMsg");
    var title = document.getElementById("lastNameTitle");
    var lead = document.getElementById("lastNameLead");
    if (!overlay) return;
    splitFullNameIfNeeded();
    if (partnerLastName()) save();
    var needFirst = firstNameMissing();
    var needLast = lastNameMissing();
    if (!needFirst && !needLast) return;
    if (firstField) firstField.hidden = !needFirst;
    if (lastField) lastField.hidden = !needLast;
    if (title && lead) {
      if (needFirst && needLast) {
        title.textContent = "What should we call you?";
        lead.textContent = "First + last name — so your leaders can tell people apart on the tree.";
      } else if (needFirst) {
        title.textContent = "What’s your first name?";
        lead.textContent = "The tree is showing you as Friend plus your last name. Add the name you actually go by.";
      } else {
        title.textContent = "What’s your last name?";
        lead.textContent = "We need last names so leaders can tell people apart when first names match.";
      }
    }
    if (msg) msg.textContent = "";
    if (firstInput) firstInput.value = needFirst ? "" : partnerName();
    if (input) input.value = partnerLastName();
    if (saveBtn) {
      var firstOk = !needFirst || (firstInput && firstInput.value.trim() && !isPlaceholderFirst(firstInput.value));
      var lastOk = !needLast || (input && input.value.trim());
      saveBtn.disabled = !(firstOk && lastOk);
    }
    overlay.hidden = false;
    overlay.classList.add("open");
    setOverlayOpen(true);
    if (window.FS.armDismissGuard) window.FS.armDismissGuard();
    setTimeout(function () {
      var focusEl = needFirst ? firstInput : input;
      if (focusEl) focusEl.focus();
      if (saveBtn && firstInput && input) {
        var firstOk2 = !needFirst || (firstInput.value.trim() && !isPlaceholderFirst(firstInput.value));
        var lastOk2 = !needLast || input.value.trim();
        saveBtn.disabled = !(firstOk2 && lastOk2);
      }
    }, 50);
  }

  var lastNamePromptSkipped = false;

  function groveLeaderWelcomeAcked() {
    return !!(state && state.settings && state.settings.groveLeaderWelcomeAcked);
  }

  function groveLeaderWelcomeShouldHold() {
    if (packEvergreen()) return false;
    if (groveLeaderWelcomeAcked()) return false;
    var Cloud = window.FS.Cloud;
    if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return false;
    if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) return false;
    if (!(Cloud.isOrgAdmin && Cloud.isOrgAdmin())) return false;
    var u = Cloud.user && Cloud.user();
    if (u && u.leader_welcome_pending) return true;
    if (!leaderWelcomePrimed) return false;
    return !(state && state.settings && state.settings.wasOrgLeader);
  }

  var leaderWelcomePrimed = false;

  function closeGroveLeaderWelcome() {
    var overlay = document.getElementById("groveLeaderWelcomeOverlay");
    if (overlay) {
      overlay.classList.remove("open");
      overlay.hidden = true;
    }
    syncOverlayBodyLock();
  }

  function ackGroveLeaderWelcome() {
    if (state && state.settings) {
      state.settings.wasOrgLeader = true;
      state.settings.groveLeaderWelcomeAcked = true;
      try { save(); } catch (e) {}
    }
    try {
      var Cloud = howGrowCloud();
      if (Cloud && Cloud.ackLeaderWelcome) Cloud.ackLeaderWelcome().catch(function () {});
      if (Cloud && Cloud.user && Cloud.user()) Cloud.user().leader_welcome_pending = false;
    } catch (e) {}
  }

  function openGroveLeaderWelcome() {
    var overlay = document.getElementById("groveLeaderWelcomeOverlay");
    if (!overlay) return;
    overlay.hidden = false;
    overlay.classList.add("open");
    setOverlayOpen(true);
  }

  function goToGroveLeadersRoom() {
    try { hideLockToast(); } catch (e) {}
    try { closeHubMenu(); } catch (e) {}
    rememberPanelScroll(state.active);
    state.active = packSafeGoto("leaders");
    persistActiveAndPaint();
  }

  function maybeShowGroveLeaderWelcome() {
    try {
      if (packEvergreen()) return;
      var Cloud = howGrowCloud();
      if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return;
      if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
        leaderWelcomePrimed = true;
        rememberLeaderStatus();
        maybePlayClientsArrival();
        return;
      }
      var howGrow = document.getElementById("howGrowOverlay");
      if (howGrow && howGrow.classList.contains("open")) return;
      var tourEl = document.getElementById("tour");
      if (tourEl && tourEl.classList.contains("open")) return;
      var onboard = document.getElementById("onboarding");
      if (onboard && onboard.classList.contains("open")) return;
      var auth = document.getElementById("authOverlay");
      if (auth && auth.classList.contains("open")) return;
      var lastName = document.getElementById("lastNameOverlay");
      if (lastName && lastName.classList.contains("open")) return;
      var overlay = document.getElementById("groveLeaderWelcomeOverlay");
      if (overlay && overlay.classList.contains("open")) return;
      var clientsArrival = document.getElementById("clientsArrivalOverlay");
      if (clientsArrival && clientsArrival.classList.contains("open")) return;
      if (clientsArrivalPlaying) return;

      var isAdmin = !!(Cloud.isOrgAdmin && Cloud.isOrgAdmin());
      var u = Cloud.user && Cloud.user();
      var pending = !!(u && u.leader_welcome_pending);
      if (isAdmin && state.settings && state.settings.wasOrgLeader && !groveLeaderWelcomeAcked()) {
        state.settings.groveLeaderWelcomeAcked = true;
        try { save(); } catch (eAck) {}
      }

      if (groveLeaderWelcomeAcked()) {
        leaderWelcomePrimed = true;
        if (pending) ackGroveLeaderWelcome();
        rememberLeaderStatus();
        maybePlayClientsArrival();
        return;
      }

      if (!leaderWelcomePrimed) {
        leaderWelcomePrimed = true;
        if (pending && isAdmin) {
          openGroveLeaderWelcome();
          return;
        }
        rememberLeaderStatus();
        return;
      }
      if (!isAdmin) {
        rememberLeaderStatus();
        return;
      }
      if (!(state.settings && state.settings.wasOrgLeader)) {
        openGroveLeaderWelcome();
        return;
      }
      rememberLeaderStatus();
      maybePlayClientsArrival();
    } catch (e) {}
  }
  window.FS.maybeShowGroveLeaderWelcome = maybeShowGroveLeaderWelcome;

  function wireGroveLeaderWelcome() {
    var overlay = document.getElementById("groveLeaderWelcomeOverlay");
    if (!overlay || overlay.dataset.wired === "1") return;
    overlay.dataset.wired = "1";
    var openBtn = document.getElementById("groveLeaderWelcomeOpen");
    var gotIt = document.getElementById("groveLeaderWelcomeGotIt");
    function dismiss(goLeaders) {
      ackGroveLeaderWelcome();
      closeGroveLeaderWelcome();
      if (goLeaders) goToGroveLeadersRoom();
      window.setTimeout(maybePlayClientsArrival, 400);
    }
    if (openBtn) openBtn.addEventListener("click", function () { dismiss(true); });
    if (gotIt) gotIt.addEventListener("click", function () { dismiss(false); });
  }

  var clientsArrivalPlaying = false;
  var clientsArrivalIsPreview = false;

  function clientsArrivalAckStoreKey() {
    var uid = "";
    try {
      uid = boundUserId() || "";
      if (!uid) {
        var Cloud = window.FS && window.FS.Cloud;
        var u = Cloud && Cloud.user && Cloud.user();
        if (u && u.id) uid = String(u.id);
      }
    } catch (e) {}
    return "firstSeeds_clients_arrival_acked_v1" + (uid ? "_" + uid : "");
  }
  function clientsArrivalAcked() {
    if (state && state.settings && state.settings.clientsArrivalAcked) return true;
    try {
      if (localStorage.getItem(clientsArrivalAckStoreKey()) === "1") return true;
    } catch (e) {}
    /* They already used Clients — don't introduce the tab again. */
    if (state && state.data && state.data.clientsTourDone) return true;
    return false;
  }
  function ackClientsArrival() {
    if (!state || !state.settings) return;
    var already = !!state.settings.clientsArrivalAcked;
    state.settings.clientsArrivalAcked = true;
    try { localStorage.setItem(clientsArrivalAckStoreKey(), "1"); } catch (e) {}
    if (already) return;
    try { save(); } catch (e) {}
  }
  function maybePlayClientsArrival() {
    try {
      if (packEvergreen()) return;
      if (clientsArrivalPlaying) return;
      if (clientsArrivalAcked()) {
        if (state && state.settings && !state.settings.clientsArrivalAcked) ackClientsArrival();
        return;
      }
      var Cloud = window.FS.Cloud;
      if (!Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) return;
      if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
        ackClientsArrival();
        return;
      }
      if (!canSeeShelfCustomers()) return;
      if (groveLeaderWelcomeShouldHold()) return;
      var howGrow = document.getElementById("howGrowOverlay");
      if (howGrow && howGrow.classList.contains("open")) return;
      var tourEl = document.getElementById("tour");
      if (tourEl && tourEl.classList.contains("open")) return;
      var onboard = document.getElementById("onboarding");
      if (onboard && onboard.classList.contains("open")) return;
      var auth = document.getElementById("authOverlay");
      if (auth && auth.classList.contains("open")) return;
      var lastName = document.getElementById("lastNameOverlay");
      if (lastName && lastName.classList.contains("open")) return;
      var welcome = document.getElementById("groveLeaderWelcomeOverlay");
      if (welcome && welcome.classList.contains("open")) return;
      playClientsArrival();
    } catch (e) {}
  }

  function prefersLessMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  }

  function closeClientsArrival() {
    var overlay = document.getElementById("clientsArrivalOverlay");
    if (overlay) {
      overlay.classList.remove("open");
      overlay.hidden = true;
    }
    document.body.classList.remove("clients-arrive-play", "clients-arrive-tree-up", "clients-arrive-clients-in");
    var fly = document.querySelector(".clients-arrive-fly");
    if (fly && fly.parentNode) fly.parentNode.removeChild(fly);
    var petals = document.getElementById("clientsArrivalPetals");
    if (petals && petals.parentNode) petals.parentNode.removeChild(petals);
    var clientsBtn = document.querySelector('#bottomNav [data-tab="customers"]');
    if (clientsBtn) clientsBtn.classList.remove("clients-arrive-pop");
    var teamBtn = document.querySelector('#bottomNav [data-tab="team"]');
    if (teamBtn) teamBtn.style.opacity = "";
    var headerTree = document.getElementById("evTeamNavBtn");
    if (headerTree) {
      headerTree.classList.remove("clients-arrive-land");
      headerTree.style.visibility = "";
    }
    if (!clientsArrivalIsPreview) ackClientsArrival();
    clientsArrivalIsPreview = false;
    clientsArrivalPlaying = false;
    syncOverlayBodyLock();
    renderBottomNav();
    paintEvTeamNavBtn();
  }

  function openClientsArrivalCard() {
    var overlay = document.getElementById("clientsArrivalOverlay");
    if (!overlay) return;
    overlay.hidden = false;
    overlay.classList.add("open");
    setOverlayOpen(true);
    if (!clientsArrivalIsPreview) ackClientsArrival();
  }

  function spawnClientsPetals() {
    if (prefersLessMotion()) return;
    var old = document.getElementById("clientsArrivalPetals");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var wrap = document.createElement("div");
    wrap.id = "clientsArrivalPetals";
    wrap.setAttribute("aria-hidden", "true");
    var colors = ["#6b8f6b", "#c49a4a", "#8a9a7a", "#d4b06a", "#5f7a63"];
    var i;
    var count = 24;
    for (i = 0; i < count; i++) {
      var isSparkle = i % 3 === 0;
      var bit = document.createElement("span");
      bit.className = isSparkle ? "clients-arrive-sparkle" : "clients-arrive-petal";
      if (isSparkle) bit.textContent = "✨";
      else bit.style.background = colors[i % colors.length];
      bit.style.left = (3 + (i % 12) * (94 / 11) + (Math.random() * 3 - 1.5)) + "vw";
      bit.style.animationDelay = (Math.random() * 1600) + "ms";
      bit.style.setProperty("--petal-top", (-18 - Math.random() * 80) + "px");
      bit.style.setProperty("--petal-dx", (Math.random() * 32 - 16) + "vw");
      bit.style.setProperty("--petal-ms", (3.6 + Math.random() * 2.2) + "s");
      bit.style.setProperty("--petal-rot", (Math.random() * 80 - 40) + "deg");
      if (isSparkle) bit.style.setProperty("--sparkle-size", (16 + Math.random() * 10) + "px");
      wrap.appendChild(bit);
    }
    document.body.appendChild(wrap);
    window.setTimeout(function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }, 8200);
  }

  function flyGroveToHeader(fromBtn, toBtn, done) {
    var fromIco = fromBtn && fromBtn.querySelector(".bottom-nav-ico");
    if (!fromIco || !toBtn || prefersLessMotion()) {
      if (done) done();
      return;
    }
    toBtn.hidden = false;
    toBtn.style.visibility = "hidden";
    var endIco = toBtn.querySelector(".rail-team-ico") || toBtn;
    var flyMs = 2200;

    function finishFly(ghost) {
      if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
      toBtn.style.visibility = "";
      if (done) done();
    }

    function tryFly(attempt) {
      var start = fromIco.getBoundingClientRect();
      var end = endIco.getBoundingClientRect();
      if ((!start.width || !end.width) && attempt < 10) {
        window.requestAnimationFrame(function () { tryFly(attempt + 1); });
        return;
      }
      if (!start.width || !end.width) {
        finishFly(null);
        return;
      }
      var ghost = document.createElement("div");
      ghost.className = "clients-arrive-fly";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = "🌳";
      ghost.style.left = start.left + "px";
      ghost.style.top = start.top + "px";
      ghost.style.width = Math.max(start.width, 28) + "px";
      ghost.style.height = Math.max(start.height, 28) + "px";
      document.body.appendChild(ghost);
      var dx = end.left + end.width / 2 - (start.left + start.width / 2);
      var dy = end.top + end.height / 2 - (start.top + start.height / 2);
      if (fromBtn) fromBtn.style.opacity = "0";
      if (ghost.animate) {
        var anim = ghost.animate(
          [
            { transform: "translate(0px, 0px)" },
            { transform: "translate(" + dx + "px," + dy + "px)" }
          ],
          { duration: flyMs, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
        );
        anim.onfinish = function () { finishFly(ghost); };
        return;
      }
      ghost.style.transition = "transform " + (flyMs / 1000) + "s cubic-bezier(.22,1,.36,1)";
      void ghost.offsetWidth;
      ghost.style.transform = "translate(" + dx + "px," + dy + "px)";
      window.setTimeout(function () { finishFly(ghost); }, flyMs);
    }

    window.requestAnimationFrame(function () { tryFly(0); });
  }

  function playClientsArrival(opts) {
    if (clientsArrivalPlaying) return;
    if (packEvergreen()) return;
    clientsArrivalIsPreview = !!(opts && opts.preview);
    clientsArrivalPlaying = true;
    try { closeHubMenu(); } catch (eClose) {}
    try { hideLockToast(); } catch (eToast) {}
    var teamBtn = document.querySelector('#bottomNav [data-tab="team"]');
    var clientsBtn = document.querySelector('#bottomNav [data-tab="customers"]');
    var headerTree = document.getElementById("evTeamNavBtn");
    document.body.classList.remove("clients-arrive-tree-up", "clients-arrive-clients-in");
    document.body.classList.add("clients-arrive-play");
    document.body.classList.remove("shelf-customers");
    if (teamBtn) {
      teamBtn.hidden = false;
      teamBtn.style.opacity = "";
    }
    if (clientsBtn) {
      clientsBtn.hidden = true;
      clientsBtn.classList.remove("clients-arrive-pop");
    }
    if (headerTree) {
      headerTree.hidden = true;
      headerTree.classList.remove("clients-arrive-land");
      headerTree.style.visibility = "";
    }
    window.setTimeout(function () {
      flyGroveToHeader(teamBtn, headerTree, function () {
        if (teamBtn) teamBtn.hidden = true;
        document.body.classList.add("clients-arrive-tree-up");
        if (headerTree) {
          headerTree.hidden = false;
          headerTree.style.visibility = "";
          headerTree.classList.add("clients-arrive-land");
        }
        window.setTimeout(function () {
          spawnClientsPetals();
          document.body.classList.add("clients-arrive-clients-in");
          if (!packEvergreen() && canSeeShelfCustomers()) {
            document.body.classList.add("shelf-customers");
          }
          if (clientsBtn) {
            clientsBtn.hidden = false;
            clientsBtn.classList.add("clients-arrive-pop");
          }
          window.setTimeout(function () {
            openClientsArrivalCard();
          }, prefersLessMotion() ? 80 : 1400);
        }, prefersLessMotion() ? 40 : 1100);
      });
    }, prefersLessMotion() ? 80 : 2000);
  }

  function wireClientsArrival() {
    var overlay = document.getElementById("clientsArrivalOverlay");
    if (overlay && overlay.dataset.wired !== "1") {
      overlay.dataset.wired = "1";
      var openBtn = document.getElementById("clientsArrivalOpen");
      if (openBtn) {
        openBtn.addEventListener("click", function () {
          closeClientsArrival();
          rememberPanelScroll(state.active);
          state.active = "customers";
          persistActiveAndPaint();
        });
      }
    }
    var preview = document.getElementById("previewClientsArrival");
    if (preview && preview.dataset.bound !== "1") {
      preview.dataset.bound = "1";
      preview.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        playClientsArrival({ preview: true });
      });
    }
  }

  async function maybeOfferLastName() {
    try {
      var Cloud = howGrowCloud();
      if (!Cloud || !Cloud.isSignedIn()) return;
      splitFullNameIfNeeded();
      if (!namePromptNeeded() || lastNamePromptSkipped) {
        maybeShowGroveLeaderWelcome();
        return;
      }
      var howGrow = document.getElementById("howGrowOverlay");
      if (howGrow && howGrow.classList.contains("open")) return;
      var tourEl = document.getElementById("tour");
      if (tourEl && tourEl.classList.contains("open")) return;
      var onboard = document.getElementById("onboarding");
      if (onboard && onboard.classList.contains("open")) return;
      var auth = document.getElementById("authOverlay");
      if (auth && auth.classList.contains("open")) return;
      var groveWelcome = document.getElementById("groveLeaderWelcomeOverlay");
      if (groveWelcome && groveWelcome.classList.contains("open")) return;
      var clientsArrival = document.getElementById("clientsArrivalOverlay");
      if (clientsArrival && clientsArrival.classList.contains("open")) return;
      var already = document.getElementById("lastNameOverlay");
      if (already && already.classList.contains("open")) return;
      openLastNamePrompt();
    } catch (e) {}
  }
  window.FS.maybeOfferLastName = maybeOfferLastName;

  function wireLastNamePrompt() {
    var overlay = document.getElementById("lastNameOverlay");
    if (!overlay || overlay.dataset.wired === "1") return;
    overlay.dataset.wired = "1";
    var firstField = document.getElementById("firstNamePromptField");
    var lastField = document.getElementById("lastNamePromptField");
    var firstInput = document.getElementById("firstNamePromptInput");
    var input = document.getElementById("lastNamePromptInput");
    var saveBtn = document.getElementById("lastNameSave");
    var later = document.getElementById("lastNameLater");
    var closeBtn = document.getElementById("lastNameClose");
    var msg = document.getElementById("lastNameMsg");
    function askingFirst() { return !!(firstField && !firstField.hidden); }
    function askingLast() { return !!(lastField && !lastField.hidden); }
    function syncSave() {
      if (!saveBtn) return;
      var firstVal = firstInput ? firstInput.value.trim() : "";
      var lastVal = input ? input.value.trim() : "";
      var firstOk = !askingFirst() || (firstVal && !isPlaceholderFirst(firstVal));
      var lastOk = !askingLast() || !!lastVal;
      saveBtn.disabled = !(firstOk && lastOk);
    }
    function bindSync(el) {
      if (!el) return;
      ["input", "change", "blur", "keyup"].forEach(function (ev) {
        el.addEventListener(ev, syncSave);
      });
      el.addEventListener("animationstart", function (e) {
        if (e.animationName === "onAutoFillStart" || e.animationName === "autofill") syncSave();
      });
    }
    bindSync(firstInput);
    bindSync(input);
    if (firstInput) {
      firstInput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" || !firstInput.value.trim()) return;
        e.preventDefault();
        if (askingLast() && input) input.focus();
        else if (saveBtn && !saveBtn.disabled) saveBtn.click();
      });
    }
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && input.value.trim() && saveBtn && !saveBtn.disabled) {
          e.preventDefault();
          saveBtn.click();
        }
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener("click", async function () {
        syncSave();
        var first = askingFirst() ? (firstInput ? firstInput.value.trim() : "") : partnerName();
        var last = askingLast() ? (input ? input.value.trim() : "") : partnerLastName();
        if (askingFirst() && (!first || isPlaceholderFirst(first))) {
          if (msg) msg.textContent = "Use the first name you actually go by.";
          return;
        }
        if (askingLast() && !last) return;
        if (saveBtn.disabled) return;
        saveBtn.disabled = true;
        if (msg) msg.textContent = "";
        if (first) {
          var fl = first.toLowerCase();
          var ll = last.toLowerCase();
          if (ll && fl.endsWith(" " + ll)) {
            first = first.slice(0, first.length - last.length).trim();
          }
        }
        if (askingFirst()) state.settings.partnerName = first;
        if (askingLast()) state.settings.partnerLastName = last;
        save({ immediate: true });
        renderGreetings();
        try {
          var Cloud = howGrowCloud();
          if (Cloud && Cloud.isSignedIn()) {
            var patch = {};
            if (askingFirst()) patch.display_name = partnerName();
            if (askingLast()) patch.last_name = last;
            var pn = partnerName();
            if (pn && !isPlaceholderFirst(pn)) patch.display_name = pn;
            await Cloud.updateProfile(patch);
            await Cloud.pushProgress({
              active: state.active,
              data: state.data,
              done: state.done,
              calendar: state.data.calendar || {},
              cheers: state.cheers || [],
              settings: state.settings,
              tourDone: state.tourDone
            });
          }
          lastNamePromptSkipped = false;
          closeLastNamePrompt();
        } catch (e) {
          if (msg) {
            msg.textContent = "Saved on this device. Cloud sync can retry next time you’re online.";
          }
          closeLastNamePrompt();
        } finally {
          syncSave();
        }
      });
    }
    function skipForNow() {
      lastNamePromptSkipped = true;
      closeLastNamePrompt();
    }
    if (later) later.addEventListener("click", skipForNow);
    if (closeBtn) closeBtn.addEventListener("click", skipForNow);
    overlay.addEventListener("click", function (e) {
      if (e.target !== overlay) return;
      if (window.FS.dismissGuarded && window.FS.dismissGuarded()) return;
      skipForNow();
    });
  }

  function wireHowIGrow() {
    var overlay = document.getElementById("howGrowOverlay");
    if (!overlay || overlay.dataset.wired === "1") return;
    overlay.dataset.wired = "1";
    overlay.addEventListener("click", async function (e) {
      var t = e.target.closest("[data-how-grow-value],[data-how-grow-next],[data-how-grow-back],#howGrowStart,#howGrowLater,#howGrowClose,#howGrowSubmit");
      if (!t) return;
      if (t.hasAttribute("data-how-grow-value")) {
        var group = t.closest("[data-how-grow-group],[data-how-grow-multi]");
        if (!group) return;
        var value = t.getAttribute("data-how-grow-value");
        var isSingle = group.hasAttribute("data-how-grow-group");
        if (isSingle) {
          howGrowAnswers[group.getAttribute("data-how-grow-group")] = value;
        } else {
          var key = group.getAttribute("data-how-grow-multi");
          var list = Array.isArray(howGrowAnswers[key]) ? howGrowAnswers[key].slice() : [];
          var found = list.indexOf(value);
          if (found >= 0) list.splice(found, 1);
          else {
            var max = parseInt(group.getAttribute("data-max"), 10) || 99;
            if (list.length >= max) {
              var hint = document.getElementById("howGrowEncouragementHint");
              if (hint) hint.textContent = "You’ve ranked two — tap one to remove it first.";
              return;
            }
            list.push(value);
          }
          howGrowAnswers[key] = list;
        }
        collectHowGrowText();
        writeHowGrowDraft();
        paintHowGrowForm();
        if (isSingle && howGrowStep > 0 && howGrowStep < HOW_GROW_TOTAL) {
          clearHowGrowAdvance();
          howGrowAdvanceTimer = setTimeout(function () {
            howGrowAdvanceTimer = null;
            showHowGrowStep(howGrowStep + 1);
          }, 280);
        }
        return;
      }
      if (t.id === "howGrowStart") { showHowGrowStep(1); return; }
      if (t.id === "howGrowLater" || t.id === "howGrowClose") {
        state.data.howGrowDeferred = true;
        save();
        closeHowIGrow();
        refreshHowGrowReminder();
        return;
      }
      if (t.hasAttribute("data-how-grow-back")) {
        collectHowGrowText();
        showHowGrowStep(howGrowStep - 1);
        return;
      }
      if (t.hasAttribute("data-how-grow-next")) {
        collectHowGrowText();
        if (!validateHowGrowStep(howGrowStep)) {
          FS.UI.toast(howGrowStep === 7
            ? "Pick at least one kind of encouragement before continuing."
            : howGrowStep === 8
              ? "Pick at least one recognition preference before continuing."
              : "Choose an answer before continuing.", { tone: "bad" });
          return;
        }
        showHowGrowStep(howGrowStep + 1);
        return;
      }
      if (t.id === "howGrowSubmit") {
        collectHowGrowText();
        if (!validateHowGrowRequired()) {
          FS.UI.toast("A few choice questions are still unanswered.", { tone: "bad" });
          return;
        }
        var msg = document.getElementById("howGrowMsg");
        try {
          t.disabled = true;
          if (msg) msg.textContent = "Sharing your support map…";
          await howGrowCloud().saveSupportPreferences(howGrowAnswers, true);
          state.data.howGrowDeferred = false;
          persistHowGrowResumeStep(0);
          save();
          if (msg) msg.textContent = "Shared! Your leader can now see how to best support you.";
          setTimeout(function () {
            closeHowIGrow({ skipDraftSave: true });
            try { localStorage.removeItem(howGrowDraftKey()); } catch (e) {}
            try { localStorage.removeItem(howGrowStepKey()); } catch (e) {}
            try { localStorage.removeItem(HOW_GROW_DRAFT_PREFIX); } catch (e) {}
            try { localStorage.removeItem(HOW_GROW_STEP_PREFIX); } catch (e) {}
            refreshHowGrowReminder();
          }, 900);
        } catch (err) {
          if (msg) msg.textContent = (err && err.message) || "Could not save your answers.";
        } finally {
          t.disabled = false;
        }
      }
    });
    overlay.addEventListener("input", function () {
      collectHowGrowText();
      persistLocal();
    });
    document.addEventListener("click", function (e) {
      var open = e.target.closest("[data-open-how-grow],#editHowIGrowBtn");
      if (!open) return;
      if (open.id === "editHowIGrowBtn") closeHubMenu();
      openHowIGrow(true);
    });
  }

  function wireOnboarding() {
    var wrap = document.getElementById("onboarding");
    if (!wrap || wrap.dataset.wired === "1") return;
    wrap.dataset.wired = "1";

    var nextBtn = document.getElementById("onboardingNext");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        onboardingStep = 1;
        renderOnboardingStep();
      });
    }
    var welcomeSignIn = document.getElementById("onboardingWelcomeSignIn");
    if (welcomeSignIn) {
      welcomeSignIn.addEventListener("click", function () {
        rememberSignInIntent();
        /* Facebook / Instagram / Chrome-on-iPhone cannot install — sending
           returning people there used to dead-end them with no Sign in. */
        if (installIsBlocked() || isRunningAsInstalledApp() || isDesktopBrowser()) {
          onboardingStep = 4;
          renderOnboardingStep();
          return;
        }
        onboardingStep = 2;
        renderOnboardingStep();
      });
    }

    var circleNext = document.getElementById("onboardingCircleNext");
    if (circleNext) {
      circleNext.addEventListener("click", function () {
        state.data.onboardCircleAck = true;
        save();
        if (isDesktopBrowser()) {
          state.data.installSkipped = true;
          save();
          advanceToNameStep();
          return;
        }
        onboardingStep = 2;
        renderOnboardingStep();
      });
    }

    var nameInput = document.getElementById("partnerNameInput");
    var lastNameInput = document.getElementById("partnerLastNameInput");
    var nameNext = document.getElementById("onboardingNameNext");
    function bindNameSync(el) {
      if (!el) return;
      ["input", "change", "blur", "keyup"].forEach(function (ev) {
        el.addEventListener(ev, syncNameNext);
      });
      el.addEventListener("input", function () {
        if (nameInput) state.settings.partnerName = nameInput.value.trim();
        if (lastNameInput) state.settings.partnerLastName = lastNameInput.value.trim();
        persistLocal();
      });
    }
    bindNameSync(nameInput);
    bindNameSync(lastNameInput);
    if (nameInput) {
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && nameInput.value.trim()) {
          e.preventDefault();
          if (lastNameInput) lastNameInput.focus();
        }
      });
    }
    if (lastNameInput) {
      lastNameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && nameInput && nameInput.value.trim() && lastNameInput.value.trim()) {
          e.preventDefault();
          if (nameNext) nameNext.click();
        }
      });
    }
    if (nameNext) {
      nameNext.addEventListener("click", function () {
        syncNameNext();
        if (!nameInput || !nameInput.value.trim()) return;
        if (!lastNameInput || !lastNameInput.value.trim()) return;
        state.settings.partnerName = nameInput.value.trim();
        state.settings.partnerLastName = lastNameInput.value.trim();
        save();
        advanceToAuthStep();
      });
    }

    var signInBtn = document.getElementById("onboardingSignInBtn");
    var createBtn = document.getElementById("onboardingCreateBtn");
    var emailInput = document.getElementById("onboardingEmail");
    var passwordInput = document.getElementById("onboardingPassword");

    function onboardAuthMsg(text) {
      var msg = document.getElementById("onboardingAuthMsg");
      if (msg) msg.textContent = text || "";
    }

    function friendlyAuthError(err, creating) {
      if (window.FS.Cloud && typeof window.FS.Cloud.friendlyAuthError === "function") {
        return window.FS.Cloud.friendlyAuthError(err, creating);
      }
      return ((err && err.message) || "") || (creating ? "Could not create account." : "Could not sign in.");
    }

    async function runOnboardAuth(creating) {
      var email = emailInput ? emailInput.value.trim() : "";
      var password = passwordInput ? passwordInput.value : "";
      var name = partnerName();
      var last = partnerLastName();
      if (window.FS.Cloud && window.FS.Cloud.isPlaceholderName && window.FS.Cloud.isPlaceholderName(name)) {
        name = "";
      }
      if (!window.FS.Cloud) {
        onboardAuthMsg("Sign-in isn’t available right now — check your connection and try again.");
        return;
      }
      if (creating && (!name || !last)) {
        onboardAuthMsg("Add your first and last name first — that’s how you show up on the tree.");
        advanceToNameStep();
        return;
      }
      if (!email || !password) {
        if (!email && emailInput) {
          onboardAuthMsg(creating
            ? "Enter your email and a password (at least 8 characters)."
            : "Enter your email and password.");
          emailInput.focus();
          return;
        }
        if (passwordInput) {
          passwordInput.focus();
          return;
        }
        onboardAuthMsg(creating
          ? "Enter your email and a password (at least 8 characters)."
          : "Enter your email and password.");
        return;
      }
      if (creating && password.length < 8) {
        onboardAuthMsg("Password needs at least 8 characters.");
        return;
      }
      if (!creating && password.length < 6) {
        onboardAuthMsg("Password needs at least 6 characters.");
        return;
      }
      if (passwordInput) {
        passwordInput.setAttribute("autocomplete", creating ? "new-password" : "current-password");
      }
      var btn = creating ? createBtn : signInBtn;
      try {
        if (btn) btn.disabled = true;
        var res = creating
          ? await window.FS.Cloud.signUp(email, name, password, last)
          : await window.FS.Cloud.signIn(email, name, password);
        onboardAuthMsg(res.message || "You’re signed in.");
        if (res.kind === "local" || res.kind === "signed_in") {
          clearSignInIntent();
          /* Keep the name on this phone, but don't push an empty runway over
             the computer's copy before the first merge. */
          save({ skipCloud: true });
          if (creating && last) {
            try {
              await window.FS.Cloud.updateProfile({
                display_name: name,
                last_name: last
              });
            } catch (e) {}
          }
          if (window.FS.BridgeUI && window.FS.BridgeUI.mergeProgress) {
            /* Don't hold onboarding on a sync hiccup, but don't let it pass for
               success either — the banner says so and offers a retry. */
            try { await window.FS.BridgeUI.mergeProgress(); }
            catch (e) {
              console.warn("[First Seeds] mergeProgress:", e);
              markCloudSyncError(e);
            }
          }
          flushPendingGrovePhoto();
          if (dismissOnboardingIfModeChosen()) return;
          advanceToModeStep();
        }
      } catch (err) {
        onboardAuthMsg(friendlyAuthError(err, creating));
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    if (emailInput) {
      emailInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (passwordInput) passwordInput.focus();
        }
      });
    }
    function setOnboardPasswordAutocomplete(creating) {
      paintOnboardAuthIntent(creating ? "create" : "signin");
    }
    var authForm = document.getElementById("onboardingAuthForm");
    if (authForm) {
      authForm.addEventListener("submit", function (e) {
        e.preventDefault();
        runOnboardAuth(lastOnboardAuthIntent !== "signin");
      });
    }
    if (passwordInput) {
      passwordInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (lastOnboardAuthIntent === "signin") {
            if (signInBtn) signInBtn.click();
          } else if (createBtn) createBtn.click();
        }
      });
    }
    if (signInBtn) {
      signInBtn.addEventListener("click", function () {
        lastOnboardAuthIntent = "signin";
        setOnboardPasswordAutocomplete(false);
        runOnboardAuth(false);
      });
    }
    if (createBtn) {
      createBtn.addEventListener("click", function () {
        lastOnboardAuthIntent = "create";
        setOnboardPasswordAutocomplete(true);
        runOnboardAuth(true);
      });
    }
    if (window.FS.Cloud && window.FS.Cloud.bindPasswordResetUi) {
      window.FS._onboardReset = window.FS.Cloud.bindPasswordResetUi({
        hideIds: ["onboardingAuthForm", "onboardingForgotBtn", "obAuthHint"],
        paneId: "onboardingResetPane",
        emailId: "onboardingResetEmail",
        codeId: "onboardingResetCode",
        passId: "onboardingResetPass",
        pass2Id: "onboardingResetPass2",
        emailWrapId: "onboardingResetEmailWrap",
        codeWrapId: "onboardingResetCodeWrap",
        passWrapId: "onboardingResetPassWrap",
        pass2WrapId: "onboardingResetPass2Wrap",
        sendBtnId: "onboardingResetSendBtn",
        verifyBtnId: "onboardingResetVerifyBtn",
        saveBtnId: "onboardingResetSaveBtn",
        resendBtnId: "onboardingResetResendBtn",
        backBtnId: "onboardingResetBackBtn",
        forgotBtnId: "onboardingForgotBtn",
        signInEmailId: "onboardingEmail",
        msgId: "onboardingAuthMsg",
        titleId: "obAuthTitle",
        eyebrowId: "obAuthEyebrow",
        bodyId: "obAuthBody",
        copy: {
          email: {
            eyebrow: "Welcome back",
            title: "Reset your password",
            body: "Use the same email as the first time. We’ll send a short code there — come back here and type it. Don’t tap a link if one shows up."
          },
          code: {
            eyebrow: "Welcome back",
            title: "Type the code",
            body: "Open that inbox, then come back here. The code is a number — if the email has a button, ignore it."
          },
          password: {
            eyebrow: "Welcome back",
            title: "Pick a new password",
            body: "At least 8 characters. You’ll use this the next time you sign in."
          }
        },
        onClose: function () { renderOnboardingStep(); },
        onDone: async function () {
          clearSignInIntent();
          save({ skipCloud: true });
          if (window.FS.BridgeUI && window.FS.BridgeUI.mergeProgress) {
            try { await window.FS.BridgeUI.mergeProgress(); }
            catch (e) {
              console.warn("[First Seeds] mergeProgress:", e);
              markCloudSyncError(e);
            }
          }
          flushPendingGrovePhoto();
          if (dismissOnboardingIfModeChosen()) return;
          advanceToModeStep();
        }
      });
    }

    var installChoices = wrap.querySelectorAll("[data-install-platform]");
    for (var ic = 0; ic < installChoices.length; ic++) {
      installChoices[ic].addEventListener("click", function (ev) {
        selectInstallPlatform(ev.currentTarget.getAttribute("data-install-platform"));
      });
    }
    var installConfirm = document.getElementById("onboardInstallConfirm");
    if (installConfirm && !installConfirm.dataset.bound) {
      installConfirm.dataset.bound = "1";
      installConfirm.addEventListener("change", syncInstallNextEnabled);
    }
    var installNext = document.getElementById("onboardingInstallNext");
    if (installNext) {
      installNext.addEventListener("click", function () {
        if (!isRunningAsInstalledApp() && installPlatform !== "standalone") return;
        advanceToNameStep();
      });
    }
    var installSkip = document.getElementById("onboardingInstallSkip");
    if (installSkip) {
      installSkip.addEventListener("click", function () {
        if (phoneInstallStay() && !isRunningAsInstalledApp()) {
          var leave = document.getElementById("onboardInstallLeave");
          var confirm = document.getElementById("onboardInstallConfirm");
          if (confirm) confirm.checked = true;
          if (leave) leave.hidden = false;
          return;
        }
        state.data.installSkipped = true;
        save();
        advanceToNameStep();
      });
    }

    var picks = wrap.querySelectorAll("[data-hub-mode]");
    for (var i = 0; i < picks.length; i++) {
      picks[i].addEventListener("click", function (ev) {
        var btn = ev.currentTarget;
        pendingOnboardMode = btn.getAttribute("data-hub-mode") || "starter";
        onboardingStep = 6;
        renderOnboardingStep();
      });
    }

    var notifyEnable = document.getElementById("onboardingNotifyEnable");
    if (notifyEnable && !notifyEnable.dataset.bound) {
      notifyEnable.dataset.bound = "1";
      notifyEnable.addEventListener("click", async function () {
        var msg = document.getElementById("obNotifyMsg");
        notifyEnable.disabled = true;
        notifyEnable.textContent = "Waiting for your phone…";
        if (msg) msg.textContent = "Your phone will ask next. This screen will close when you’re done.";
        try {
          if (!window.FS.Push || !window.FS.Push.enableThisDevice) {
            throw new Error("Notifications aren’t ready on this phone yet.");
          }
          var sub = await window.FS.Push.enableThisDevice({
            forceFresh: onboardingNotifyKind === "reconnect"
          });
          var perm = currentPushPermission();
          if (perm === "denied") {
            finishOnboardNotify();
            return;
          }
          if (perm === "granted" && sub) {
            finishOnboardNotify({ ok: true });
            return;
          }
          if (msg) msg.textContent = "Allowed — tap Turn on once more to finish setting up pings.";
          resetNotifyEnableBtn();
        } catch (e) {
          var after = currentPushPermission();
          if (after === "denied") {
            finishOnboardNotify();
            return;
          }
          if (msg) msg.textContent = (e && e.message) || "Could not turn on notifications.";
          resetNotifyEnableBtn();
        }
      });
    }
    var notifySkip = document.getElementById("onboardingNotifySkip");
    if (notifySkip && !notifySkip.dataset.bound) {
      notifySkip.dataset.bound = "1";
      notifySkip.addEventListener("click", function () {
        finishOnboardNotify();
      });
    }
    var notifyClose = document.getElementById("onboardingNotifyClose");
    if (notifyClose && !notifyClose.dataset.bound) {
      notifyClose.dataset.bound = "1";
      notifyClose.addEventListener("click", function () {
        finishOnboardNotify();
      });
    }
  }

  /* ── mini tour (coachmarks near the real UI) ─────────── */
  var tourIdx = 0;
  var tourPlaceTimer = null;
  var tourTargetEl = null;
  var tourKind = "main"; /* main | team | leads | clients */
  var tourTipsActive = null;

  function tipSelectorList(tip) {
    var list = [];
    if (!tip) return list;
    if (Array.isArray(tip.target)) list = list.concat(tip.target);
    else if (tip.target) list.push(tip.target);
    if (Array.isArray(tip.fallbackTarget)) list = list.concat(tip.fallbackTarget);
    else if (tip.fallbackTarget) list.push(tip.fallbackTarget);
    return list;
  }

  function isTourTargetVisible(el) {
    if (!el || el.hidden) return false;
    if (el.closest && el.closest("[hidden]")) return false;
    var r = el.getBoundingClientRect();
    return r.width >= 2 && r.height >= 2;
  }

  function resolveTourTarget(tip) {
    var sels = tipSelectorList(tip);
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (isTourTargetVisible(el)) return { el: el, selector: sels[i] };
    }
    return null;
  }

  function tipHasVisibleTarget(tip) {
    return !!resolveTourTarget(tip);
  }

  function buildOptionalTourTips(tips) {
    var out = [];
    for (var i = 0; i < (tips || []).length; i++) {
      var tip = tips[i];
      if (tip && tip.optional && !tipHasVisibleTarget(tip)) continue;
      out.push(tip);
    }
    return out;
  }

  function buildTeamTourTips() {
    return buildOptionalTourTips(CFG.teamTour || []);
  }

  function buildLeadsTourTips() {
    return buildOptionalTourTips(CFG.leadsTour || []);
  }

  function buildClientsTourTips() {
    return buildOptionalTourTips(CFG.clientsTour || []);
  }

  function cloneTourTip(tip) {
    var next = {};
    if (!tip) return next;
    for (var k in tip) {
      if (Object.prototype.hasOwnProperty.call(tip, k)) next[k] = tip[k];
    }
    return next;
  }

  function remapGroveTourTip(tip) {
    if (!tip || !canSeeShelfCustomers()) return tip;
    var target = String(tip.target || "");
    var groveNav = target.indexOf('data-tab="team"') >= 0 || !!tip.revealGroveTab;
    if (groveNav) {
      var next = cloneTourTip(tip);
      next.title = "Grove lives up top";
      next.target = "#evTeamNavBtn";
      next.placement = "below";
      next.revealGroveTab = false;
      next.body = "The tree next to Messages opens Grow Your Grove — your live team. Copy my link to join is the flower there — when they sign in with it, they’re on your tree. You’ll see who’s moving, How I Grow, and you can cheer them on.";
      return next;
    }
    if (tip.starterOnly) {
      var starter = cloneTourTip(tip);
      starter.body = "Sprout is where you’ll build a solid foundation for your business — and it’s the best place to begin. It walks you through the app in a specific order so nothing important gets skipped.\n\nFeel free to explore before you finish every Sprout step, though. A few spots you might peek at: the product guide in Learn, the Leads tab, Clients, and Messages (💬) up top. Your join link is already in Settings → Sharing. Calendar and Grow Your Grove (the tree next to Messages) unlock on All in anytime in Settings.";
      return starter;
    }
    if (tip.fullOnly && target.indexOf('data-tab="home"') >= 0) {
      var full = cloneTourTip(tip);
      full.body = "Sprout is where you’ll build a solid foundation for your business — and it’s the best place to begin. It walks you through the app in a specific order so nothing important gets skipped.\n\nFeel free to explore before you finish every Sprout step, though. Calendar, Learn, Leads, Clients, and Messages (💬) up top are one tap away when you want them. Grow Your Grove is the tree next to Messages.";
      return full;
    }
    return tip;
  }

  function tourTipFitsHub(tip) {
    if (!tip) return false;
    if (packEvergreen()) {
      if (tip.leadersOnly && !canSeeEvergreenTeamPage()) return false;
      return true;
    }
    if (tip.fullOnly && isStarter()) return false;
    if (tip.starterOnly && !isStarter()) return false;
    if (tip.shelfCustomersOnly && !canSeeShelfCustomers()) return false;
    return true;
  }

  function filterTourTips(tips) {
    var out = [];
    for (var i = 0; i < (tips || []).length; i++) {
      if (!tourTipFitsHub(tips[i])) continue;
      out.push(remapGroveTourTip(tips[i]));
    }
    return out;
  }

  function currentTourTips() {
    if (tourTipsActive) return tourTipsActive;
    if (tourKind === "team") return CFG.teamTour || [];
    if (tourKind === "leads") return CFG.leadsTour || [];
    if (tourKind === "clients") return CFG.clientsTour || [];
    return filterTourTips(CFG.tour || []);
  }

  function clearTourHighlight(opts) {
    opts = opts || {};
    if (tourTargetEl) {
      tourTargetEl.classList.remove("tour-target-on");
      tourTargetEl = null;
    }
    var leftovers = document.querySelectorAll(".tour-target-on");
    for (var i = 0; i < leftovers.length; i++) leftovers[i].classList.remove("tour-target-on");
    if (opts.hideSpot) {
      var spot = document.getElementById("tourSpotlight");
      if (spot) {
        spot.hidden = true;
        spot.style.cssText = "";
      }
      document.body.classList.remove("tour-reveal-grove");
    }
  }

  function centerTourCard(opts) {
    opts = opts || {};
    var card = document.getElementById("tourCard");
    var spot = document.getElementById("tourSpotlight");
    if (spot && opts.hideSpot) spot.hidden = true;
    if (!card) return;
    card.style.top = "50%";
    card.style.left = "50%";
    card.style.right = "auto";
    card.style.bottom = "auto";
    card.style.transform = "translate(-50%, -50%)";
  }

  /* Open collapsed details only when this tip needs mentoring / leads targets */
  function prepareTourTarget(tip) {
    if (tourKind === "team") {
      var sels = tipSelectorList(tip);
      if (!sels.length && !(tip && (tip.openCheerSheet || tip.openNoteSheet))) return;
      var Bridge = window.FS.BridgeUI;
      if (tip.openCheerSheet && Bridge && typeof Bridge.openCheerSheetForTour === "function") {
        if (Bridge.closeNoteSheet) Bridge.closeNoteSheet();
        Bridge.openCheerSheetForTour();
      } else if (tip.openNoteSheet && Bridge && typeof Bridge.openNoteSheetForTour === "function") {
        if (Bridge.closeCheerSheet) Bridge.closeCheerSheet();
        Bridge.openNoteSheetForTour();
      } else {
        if (Bridge && typeof Bridge.closeCheerSheet === "function") Bridge.closeCheerSheet();
        if (Bridge && typeof Bridge.closeNoteSheet === "function") Bridge.closeNoteSheet();
      }
      var joined = sels.join(" ");
      var needsMentorOpen = /nudge|cheer|note|mentor|leader-col|leaderLists|how-grow-snapshot/.test(joined);
      if (needsMentorOpen || tip.openCheerSheet || tip.openNoteSheet) {
        var cols = document.querySelectorAll("#leaderLists details.leader-col");
        for (var i = 0; i < cols.length; i++) cols[i].open = true;
        var firstCard = document.querySelector("#leaderLists details.leader-card");
        if (firstCard) firstCard.open = true;
      }
    } else if (tourKind === "leads") {
      var BridgeL = window.FS.BridgeUI;
      if (BridgeL && typeof BridgeL.prepareLeadsTourTarget === "function") {
        BridgeL.prepareLeadsTourTarget(tip);
      }
    } else if (tourKind === "clients") {
      var Desk = window.FS.CabinetDesk;
      if (tip && tip.clientsRoom && Desk && typeof Desk.go === "function") {
        Desk.go(tip.clientsRoom);
      }
    } else {
      return;
    }
    var resolved = resolveTourTarget(tip);
    var el = resolved && resolved.el;
    if (!el) return;
    var node = el;
    while (node && node !== document.body) {
      if (node.tagName === "DETAILS") node.open = true;
      if (node.classList && node.classList.contains("live-l1") && node.classList.contains("has-kids")) {
        node.classList.add("is-open");
      }
      node = node.parentElement;
    }
  }

  function placeTourChrome(targetEl, tipOrPlacement) {
    var card = document.getElementById("tourCard");
    var spot = document.getElementById("tourSpotlight");
    if (!card || !targetEl) {
      centerTourCard({ keepSpot: true });
      return;
    }

    var tip = (tipOrPlacement && typeof tipOrPlacement === "object") ? tipOrPlacement : null;
    var placement = tip ? (tip.placement || "auto") : (tipOrPlacement || "auto");
    var fullSpot = !!(tip && tip.fullSpot);
    var isNav = !!(targetEl.closest && targetEl.closest(".bottom-nav"));

    var pad = isNav ? 6 : 8;
    var gap = 12;
    /* Leave room above bottom nav for tips — but let the spotlight cover nav buttons fully */
    var navSafe = isNav ? 6 : Math.max(78, (tip && tip.clearanceBottom) || 78);
    var rect = targetEl.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    if (rect.width < 2 && rect.height < 2) {
      centerTourCard({ keepSpot: true });
      return;
    }

    var maxSpotH = fullSpot
      ? Math.max(160, Math.min(rect.height + pad * 2, vh - navSafe - 200))
      : isNav
        ? Math.max(rect.height + pad * 2, 56)
        : Math.max(64, Math.floor(vh * 0.28));
    var spotH = Math.min(rect.height + pad * 2, maxSpotH);
    var spotTop = Math.max(6, rect.top - pad);
    var spotLeft = Math.max(6, rect.left - pad);
    var spotRight = Math.min(vw - 6, rect.right + pad);
    var spotBottom = Math.min(vh - navSafe, spotTop + spotH);
    if (isNav) {
      /* Wrap the real tab — don't clamp away from the bottom edge */
      spotTop = Math.max(6, rect.top - pad);
      spotBottom = Math.min(vh - 4, rect.bottom + pad);
      spotH = spotBottom - spotTop;
    } else if (spotBottom > vh - navSafe) {
      spotBottom = vh - navSafe;
      spotTop = Math.max(6, spotBottom - spotH);
    }

    if (spot) {
      spot.hidden = false;
      spot.style.top = spotTop + "px";
      spot.style.left = spotLeft + "px";
      spot.style.width = Math.max(24, spotRight - spotLeft) + "px";
      spot.style.height = Math.max(24, spotBottom - spotTop) + "px";
      spot.style.borderRadius = isNav || targetEl.closest(".bottom-nav-btn") ? "16px" : "14px";
    }

    card.style.transform = "none";
    var cardW = Math.min(360, vw - 24);
    card.style.width = cardW + "px";
    card.style.maxWidth = cardW + "px";
    var cardH = card.offsetHeight || 200;

    var spaceBelow = vh - spotBottom - gap - (isNav ? 8 : 72);
    var spaceAbove = spotTop - gap;
    var place = placement || "auto";
    var tall = fullSpot || rect.height > vh * 0.36;

    if (isNav) place = "above";
    else if (place === "auto" || (tall && place !== "above" && place !== "below")) {
      place = spaceAbove >= cardH + 8 ? "above" : (spaceBelow >= cardH + 8 ? "below" : "center");
    }
    if (!isNav) {
      if (place === "below" && spaceBelow < Math.min(cardH, 130) && spaceAbove > spaceBelow) place = "above";
      if (place === "above" && spaceAbove < Math.min(cardH, 130) && spaceBelow > spaceAbove) place = "below";
      if (spotBottom > vh * 0.62 && spaceAbove >= Math.min(cardH, 140)) place = "above";
      if (fullSpot && spaceAbove >= Math.min(cardH, 120)) place = "above";
    }

    if (place === "center") {
      centerTourCard({ keepSpot: true });
      return;
    }

    var top;
    if (place === "above") top = spotTop - gap - cardH;
    else top = spotBottom + gap;

    var left = spotLeft + ((spotRight - spotLeft) / 2) - (cardW / 2);
    left = Math.min(Math.max(12, left), vw - cardW - 12);
    top = Math.min(Math.max(12, top), vh - cardH - (isNav ? 12 : 78));

    card.style.top = top + "px";
    card.style.left = left + "px";
    card.style.right = "auto";
    card.style.bottom = "auto";
  }

  function scrollTourTargetIntoView(el, tip) {
    if (!el) return;
    if (el.closest && el.closest(".bottom-nav")) return; /* fixed chrome — never scroll the page for it */
    if (tourKind === "clients") {
      if (el.closest && el.closest("#cabinetDeskSeg")) return;
      try {
        var layout = document.querySelector(".layout");
        var chrome = 0;
        try {
          chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-topbar-offset")) || 0;
        } catch (eChrome) {}
        var roomRect = el.getBoundingClientRect();
        var roomH = window.innerHeight;
        var topLimit = chrome + 12;
        if (roomRect.top < topLimit || roomRect.bottom > roomH - 100) {
          if (layout) layout.scrollTop += roomRect.top - topLimit;
          else el.scrollIntoView({ block: "nearest", behavior: "auto" });
        }
      } catch (errClients) {}
      return;
    }
    var node = el;
    while (node && node !== document.body) {
      if (node.tagName === "DETAILS") node.open = true;
      if (node.classList && node.classList.contains("live-l1") && node.classList.contains("has-kids")) {
        node.classList.add("is-open");
      }
      node = node.parentElement;
    }
    var locked = document.body.classList.contains("overlay-open");
    if (locked) document.body.classList.remove("overlay-open");
    try {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var fullSpot = !!(tip && tip.fullSpot);
      var tipRoom = 200;
      var bottomClear = (tip && tip.clearanceBottom) || 88;
      var needsScroll = fullSpot
        ? (rect.top < tipRoom - 24 || rect.top > vh - 176)
        : (rect.top < 64 || rect.bottom > vh - bottomClear);
      if (needsScroll) {
        if (fullSpot) pageScrollBy(rect.top - tipRoom);
        else if (rect.top < 64) pageScrollBy(rect.top - 80);
        else pageScrollBy(rect.bottom - (vh - bottomClear - 24));
      }
    } catch (err) {
      try { el.scrollIntoView({ block: "nearest", behavior: "auto" }); } catch (err2) { /* ignore */ }
    }
    if (locked) document.body.classList.add("overlay-open");
  }

  function mainTourNeedsGroveReveal() {
    if (packEvergreen() || canSeeShelfCustomers()) return false;
    var tips = CFG.tour || [];
    for (var i = 0; i < tips.length; i++) {
      if (tips[i] && tips[i].revealGroveTab) return true;
    }
    return false;
  }

  function scheduleTourPlacement(tip) {
    clearTimeout(tourPlaceTimer);
    clearTourHighlight(); /* keep spotlight visible between steps */

    /* Soft start: keep Grove visible for the whole main tour so Learn→Grove doesn't reflow mid-step */
    if (tourKind === "main" && mainTourNeedsGroveReveal()) {
      document.body.classList.add("tour-reveal-grove");
    } else {
      document.body.classList.toggle("tour-reveal-grove", !!(tip && tip.revealGroveTab));
    }

    var attempts = 0;
    var isSheet = !!(tip && (tip.openCheerSheet || tip.openNoteSheet));
    var isNav = !!(tip && tip.target && String(tip.target).indexOf("bottomNav") >= 0);
    var isClients = tourKind === "clients";
    var settleMs = isClients ? 24 : (isSheet ? 160 : (tip && tip.fullSpot) ? 140 : (isNav ? 100 : 70));
    var retryMs = isClients ? 28 : 70;
    var maxAttempts = isClients ? 4 : 14;

    var tryPlace = function () {
      prepareTourTarget(tip);
      var resolved = resolveTourTarget(tip);
      var el = resolved && resolved.el;
      if (!el && attempts < maxAttempts) {
        attempts++;
        tourPlaceTimer = setTimeout(tryPlace, retryMs);
        return;
      }
      if (!el) {
        centerTourCard({ keepSpot: true });
        return;
      }
      tourTargetEl = el;
      el.classList.add("tour-target-on");
      scrollTourTargetIntoView(el, tip);
      tourPlaceTimer = setTimeout(function () {
        if (!tourTargetEl) return;
        /* Re-query after reveal/layout — Soft start Grove tab can shift nav buttons */
        var freshResolved = resolveTourTarget(tip);
        var fresh = freshResolved && freshResolved.el;
        if (fresh && fresh !== tourTargetEl) {
          tourTargetEl.classList.remove("tour-target-on");
          tourTargetEl = fresh;
          tourTargetEl.classList.add("tour-target-on");
        }
        placeTourChrome(tourTargetEl, tip);
      }, settleMs);
    };

    if (isClients) {
      if (tip && tip.clientsRoom) {
        requestAnimationFrame(tryPlace);
        return;
      }
      tryPlace();
      return;
    }
    /* Let CSS reveal (Grove tab) paint before first measure */
    requestAnimationFrame(function () {
      requestAnimationFrame(tryPlace);
    });
  }

  function startTour() {
    if (document.body.classList.contains("is-booting")) {
      revealBootCover(startTour);
      return;
    }
    var wrap = document.getElementById("tour");
    if (wrap && wrap.classList.contains("open")) return;
    tourKind = "main";
    tourTipsActive = filterTourTips(packEvergreen()
      ? ((window.FS.EVERGREEN && window.FS.EVERGREEN.tour) || [])
      : (CFG.tour || []));
    var tips = currentTourTips();
    if (!wrap || !tips.length) {
      tourTipsActive = null;
      state.tourDone = true;
      save();
      syncOverlayBodyLock();
      return;
    }
    tourIdx = 0;
    /* Reveal Grove for Soft start before step 1 so Learn/Grove highlights don't reflow */
    if (mainTourNeedsGroveReveal()) document.body.classList.add("tour-reveal-grove");
    wrap.classList.add("open");
    setOverlayOpen(true);
    centerTourCard();
    /* Brief beat so bottom nav can settle with Grove visible */
    setTimeout(function () { renderTourStep(); }, mainTourNeedsGroveReveal() ? 80 : 0);
  }

  function startTeamTour(opts) {
    opts = opts || {};
    var wrap = document.getElementById("tour");
    if (!wrap) return;
    if (wrap.classList.contains("open")) return;
    if (!opts.replay && state.data.teamTourDone) return;
    tourKind = "team";
    tourTipsActive = buildTeamTourTips();
    var tips = currentTourTips();
    if (!tips.length) {
      tourTipsActive = null;
      if (!opts.replay) {
        state.data.teamTourDone = true;
        save();
      }
      return;
    }
    tourIdx = 0;
    state.active = "leader";
    save();
    renderNav();
    renderPanels();
    wrap.classList.add("open");
    setOverlayOpen(true);
    centerTourCard();
    /* Wait until Team UI (tree / mentoring) has painted — renderLeader is async */
    var tries = 0;
    var waitReady = function () {
      var ready = document.querySelector("#liveTeamGraph:not([hidden]) .live-team-head, #leaderLists .leader-card, #leaderLists .leader-empty");
      if (ready || tries >= 20) {
        prepareTourTarget(tips[0]);
        renderTourStep();
        return;
      }
      tries++;
      setTimeout(waitReady, 100);
    };
    setTimeout(waitReady, 200);
  }

  function maybeStartTeamTour(count) {
    /* Auto-show once: first time someone is on their live team — never again unless Settings → Replay Grove tour.
       Do NOT reset on teamTourVersion bumps (that was re-showing the tour for everyone). */
    if (!count || count < 1) return;
    if (state.data.teamTourDone) return;
    if (!state.tourDone) return; /* finish home tour first */
    var wrap = document.getElementById("tour");
    if (wrap && wrap.classList.contains("open")) return;
    if (state.active !== "leader") return;
    startTeamTour();
  }
  window.FS.maybeStartTeamTour = maybeStartTeamTour;

  function replayTeamTourFromSettings() {
    closeHubMenu();
    startTeamTour({ replay: true });
  }

  function startLeadsTour(opts) {
    opts = opts || {};
    var wrap = document.getElementById("tour");
    if (!wrap) return;
    if (wrap.classList.contains("open")) return;
    var tourVer = CFG.leadsTourVersion || 1;
    var seenCurrent = !!(state.data.leadsTourDone && (state.data.leadsTourVer || 0) >= tourVer);
    if (!opts.replay && seenCurrent) return;
    tourKind = "leads";
    tourTipsActive = null;
    tourIdx = 0;
    state.active = "leads";
    save();
    renderNav();
    renderPanels();
    wrap.classList.add("open");
    setOverlayOpen(true);
    centerTourCard();
    var tries = 0;
    var waitReady = function () {
      var ready = document.querySelector('#leadsList [data-leads-tour="card"]');
      if (ready || tries >= 20) {
        /* Build tips only after inbox DOM exists so optional Send/Text steps aren't dropped. */
        tourTipsActive = buildLeadsTourTips();
        var tips = currentTourTips();
        if (!tips.length) {
          tourTipsActive = null;
          if (!opts.replay) {
            state.data.leadsTourDone = true;
            state.data.leadsTourVer = tourVer;
            save();
          }
          wrap.classList.remove("open");
          setOverlayOpen(false);
          tourKind = "main";
          return;
        }
        prepareTourTarget(tips[0]);
        renderTourStep();
        return;
      }
      tries++;
      setTimeout(waitReady, 100);
    };
    setTimeout(waitReady, 180);
  }

  function maybeStartLeadsTour(count) {
    if (!count || count < 1) return;
    var tourVer = CFG.leadsTourVersion || 1;
    var seenCurrent = !!(state.data.leadsTourDone && (state.data.leadsTourVer || 0) >= tourVer);
    if (seenCurrent) return;
    if (!state.tourDone) return;
    var wrap = document.getElementById("tour");
    if (wrap && wrap.classList.contains("open")) return;
    if (state.active !== "leads") return;
    startLeadsTour();
  }
  window.FS.maybeStartLeadsTour = maybeStartLeadsTour;

  function replayLeadsTourFromSettings() {
    closeHubMenu();
    startLeadsTour({ replay: true });
  }

  var clientsTourBooting = false;

  function startClientsTour(opts) {
    opts = opts || {};
    if (!canSeeShelfCustomers()) return;
    var wrap = document.getElementById("tour");
    if (!wrap) return;
    if (wrap.classList.contains("open") || clientsTourBooting) return;
    var tourVer = CFG.clientsTourVersion || 1;
    var seenCurrent = !!(state.data.clientsTourDone && (state.data.clientsTourVer || 0) >= tourVer);
    if (!opts.replay && seenCurrent) return;
    clientsTourBooting = true;
    tourKind = "clients";
    tourTipsActive = null;
    tourIdx = 0;
    state.active = "customers";
    save();
    renderNav();
    renderPanels();
    if (window.FS.CabinetDesk && typeof window.FS.CabinetDesk.go === "function") {
      window.FS.CabinetDesk.go("today");
    }
    paintCabinetShareUI();
    wrap.classList.add("open");
    setOverlayOpen(true);
    centerTourCard();
    var tries = 0;
    var waitReady = function () {
      var ready = document.querySelector('#panel-customers [data-clients-tour="head"], #customersCabinetInvite, #cabinetDeskRoot');
      if (ready || tries >= 20) {
        tourTipsActive = buildClientsTourTips();
        var tips = currentTourTips();
        if (!tips.length) {
          tourTipsActive = null;
          clientsTourBooting = false;
          if (!opts.replay) {
            state.data.clientsTourDone = true;
            state.data.clientsTourVer = tourVer;
            save();
          }
          wrap.classList.remove("open");
          setOverlayOpen(false);
          tourKind = "main";
          return;
        }
        renderTourStep();
        return;
      }
      tries++;
      setTimeout(waitReady, 50);
    };
    setTimeout(waitReady, 60);
  }

  function maybeStartClientsTour() {
    if (clientsTourBooting) return;
    if (!canSeeShelfCustomers()) return;
    var tourVer = CFG.clientsTourVersion || 1;
    var seenCurrent = !!(state.data.clientsTourDone && (state.data.clientsTourVer || 0) >= tourVer);
    if (seenCurrent) return;
    if (!state.tourDone) return;
    var wrap = document.getElementById("tour");
    if (wrap && wrap.classList.contains("open")) return;
    if (state.active !== "customers") return;
    if (document.body.classList.contains("cabinet-desk-loading")) return;
    startClientsTour();
  }
  window.FS.maybeStartClientsTour = maybeStartClientsTour;

  function replayClientsTourFromSettings() {
    if (!canSeeShelfCustomers()) return;
    closeHubMenu();
    startClientsTour({ replay: true });
  }

  function renderTourStep() {
    var tips = currentTourTips();
    var tip = tips[tourIdx];
    if (!tip) return;
    setText("tourTitle", tip.title);
    setText("tourBody", tip.body);
    var next = document.getElementById("tourNext");
    if (next) {
      if (tourKind === "team") {
        next.textContent = tourIdx >= tips.length - 1 ? "Got it — let's mentor →" : "Next";
      } else if (tourKind === "leads") {
        next.textContent = tourIdx >= tips.length - 1 ? "Got it — let's reply →" : "Next";
      } else if (tourKind === "clients") {
        next.textContent = tourIdx >= tips.length - 1 ? "Got it — let's start →" : "Next";
      } else {
        next.textContent = tourIdx >= tips.length - 1 ? "Let's start on Sprout →" : "Next";
      }
    }
    var dots = document.getElementById("tourDots");
    if (dots) {
      dots.innerHTML = "";
      for (var i = 0; i < tips.length; i++) {
        var iEl = document.createElement("i");
        if (i === tourIdx) iEl.className = "on";
        dots.appendChild(iEl);
      }
    }

    if (tip.panel && state.active !== tip.panel) {
      state.active = packSafeGoto(tip.panel);
      save();
      renderNav();
      renderPanels();
    }

    scheduleTourPlacement(tip);
  }

  function hideTourChrome() {
    clearTimeout(tourPlaceTimer);
    clearTourHighlight({ hideSpot: true });
    if (window.FS.BridgeUI) {
      if (typeof window.FS.BridgeUI.closeCheerSheet === "function") window.FS.BridgeUI.closeCheerSheet();
      if (typeof window.FS.BridgeUI.closeNoteSheet === "function") window.FS.BridgeUI.closeNoteSheet();
    }
    var wrap = document.getElementById("tour");
    if (wrap) wrap.classList.remove("open");
    var card = document.getElementById("tourCard");
    if (card) {
      card.style.cssText = "";
    }
    tourKind = "main";
    tourTipsActive = null;
    clientsTourBooting = false;
    syncOverlayBodyLock();
  }

  function dismissTour() {
    hideTourChrome();
  }

  function finishTour() {
    if (tourKind === "team") {
      state.data.teamTourDone = true;
      state.data.teamTourVer = CFG.teamTourVersion || 1;
    } else if (tourKind === "leads") {
      state.data.leadsTourDone = true;
      state.data.leadsTourVer = CFG.leadsTourVersion || 1;
    } else if (tourKind === "clients") {
      state.data.clientsTourDone = true;
      state.data.clientsTourVer = CFG.clientsTourVersion || 1;
    } else {
      state.tourDone = true;
    }
    hideTourChrome();
    save();
    renderGreetings();
    setTimeout(maybeOfferHowIGrow, 250);
    setTimeout(maybeOfferLastName, 700);
  }

  function wireTour() {
    var next = document.getElementById("tourNext");
    if (!next || next.dataset.wired === "1") return;
    next.dataset.wired = "1";
    next.addEventListener("click", function () {
      var tips = currentTourTips();
      if (tourIdx >= tips.length - 1) return finishTour();
      tourIdx++;
      renderTourStep();
    });
    window.addEventListener("resize", function () {
      syncTopbarStickyOffset();
      var wrap = document.getElementById("tour");
      if (!wrap || !wrap.classList.contains("open")) return;
      var tips = currentTourTips();
      var tip = tips[tourIdx];
      if (tip && tourTargetEl) placeTourChrome(tourTargetEl, tip);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var pdfOverlay = document.getElementById("leaderPdfOverlay");
      if (pdfOverlay && !pdfOverlay.hidden) {
        closeLeaderPdf();
        return;
      }
      var tourWrap = document.getElementById("tour");
      if (tourWrap && tourWrap.classList.contains("open")) {
        dismissTour();
        return;
      }
      var groveWelcome = document.getElementById("groveLeaderWelcomeOverlay");
      if (groveWelcome && groveWelcome.classList.contains("open")) {
        ackGroveLeaderWelcome();
        closeGroveLeaderWelcome();
        return;
      }
      closeHubMenu();
      setRoadmapOpen(false);
      closeGrowthMoment();
    }
  });

  /* ── clicks ──────────────────────────────────────────── */
  /* Touch listener so iOS paints :active on press (otherwise taps feel dead). */
  document.addEventListener("pointerdown", function () {}, { passive: true });
  wireLeaderPdfChrome();

  document.addEventListener("click", function (e) {
    var start = e && e.target;
    if (start && start.nodeType === 3) start = start.parentElement || start.parentNode;
    if (!start || start.nodeType !== 1 || !start.closest) return;
    var catalogShareHit = start.closest("[data-copy-catalog-link], #leaderPdfShare");
    if (catalogShareHit) {
      e.preventDefault();
      e.stopPropagation();
      copyFreshCatalogShareLink(catalogShareHit);
      return;
    }
    var pdfHit = start.closest("[data-open-pdf], #leaderPdfBack, #leaderPdfSave");
    if (pdfHit) {
      e.preventDefault();
      if (pdfHit.id === "leaderPdfBack") {
        closeLeaderPdf();
        return;
      }
      if (pdfHit.id === "leaderPdfSave") {
        saveLeaderPdf();
        return;
      }
      openLeaderPdf(pdfHit.getAttribute("data-open-pdf"), pdfHit.getAttribute("data-open-pdf-title"));
      return;
    }
    var t = start.closest("[data-goto],[data-complete],[data-grove-pick],[data-prod-nav],[data-prod-open],[data-prod-fav],[data-fact-fav],[data-fact-open],[data-prod-scope],[data-prod-mode],[data-ing-nav],[data-ing-open],[data-origin-info],[data-choice],[data-rhythm],[data-copy],[data-tadd],[data-tstatus],[data-tdel],[data-seedtype],[data-menu-goto],[data-soft-unlock],[data-faq],[data-faq-cat],[data-talk],[data-talk-cat],[data-talk-section],[data-talk-principle],[data-copy-toggle],#exportBtn,#exportBtn2,#resetBtn,#replayOnboardingBtn,#replayTeamTourBtn,#replayLeadsTourBtn,#replayClientsTourBtn,#modeStarter,#modeFull,#lockToastUnlockFull,#todayUnlockFull,#settingsCopyLeadShare,#settingsCopyGroveShare,#settingsCopySignIn,#levelUpBtn,#settingsNavBtn,#menuCloseBtn,#menuCloseBackdrop,#todayAuthBtn,#lockToastClose,#quizCopyLink");
    if (!t) return;

    if (t.hasAttribute("data-origin-info")) {
      e.preventDefault();
      openProductOriginInfo(t.getAttribute("data-origin-info"));
      return;
    }

    if (t.hasAttribute("data-fact-fav")) {
      e.preventDefault();
      e.stopPropagation();
      var factId = t.getAttribute("data-fact-fav");
      toggleFactFavorite(factId);
      save();
      syncFactHeartButtons(factId);
      renderContentFactShortlist();
      return;
    }
    if (t.hasAttribute("data-fact-open")) {
      e.preventDefault();
      openHeartedFact(t.getAttribute("data-fact-open"));
      return;
    }

    if (t.hasAttribute("data-prod-fav")) {
      e.preventDefault();
      e.stopPropagation();
      var beforeSproutFav = lastSprout;
      var favId = t.getAttribute("data-prod-fav");
      toggleProductFavorite(favId);
      save();
      syncFavHeartButtons(favId);
      var browseFav = ensureProductBrowse();
      var emptiedFavorites = paintProductScopeLinks();
      if (emptiedFavorites && !browseFav.productId) {
        browseFav.scope = "all";
        renderProductLibrary();
      } else if (browseFav.scope === "favorites" && !browseFav.productId) {
        updateProductBrowseResults();
      }
      requestAnimationFrame(function () {
        refreshAllShortlists();
        refreshButtons();
        renderModuleChecklists();
        renderTodayCard();
        if (packEvergreen()) {
          renderEvergreenPathChecks();
          if (noteEvergreenVisit(state.active)) save();
        }
        if (checklistProgress().sproutDone > beforeSproutFav) {
          lastSprout = beforeSproutFav;
          renderPlant({});
        }
      });
      return;
    }
    if (t.hasAttribute("data-prod-scope")) {
      var browseScope = ensureProductBrowse();
      browseScope.mode = "products";
      browseScope.scope = t.getAttribute("data-prod-scope") === "favorites" ? "favorites" : "all";
      browseScope.productId = null;
      browseScope.topicId = null;
      browseScope.ingredientId = null;
      if (browseScope.scope === "favorites") {
        browseScope.category = null;
        browseScope.subcategory = null;
      }
      save();
      renderProductLibrary();
      return;
    }
    if (t.hasAttribute("data-prod-mode")) {
      var browseMode = ensureProductBrowse();
      var nextMode = t.getAttribute("data-prod-mode") === "ingredients" ? "ingredients" : "products";
      browseMode.mode = nextMode;
      browseMode.productId = null;
      browseMode.ingredientId = null;
      browseMode.q = "";
      if (nextMode === "ingredients") {
        browseMode.category = null;
        browseMode.subcategory = null;
        browseMode.scope = "all";
        browseMode.topicId = t.getAttribute("data-ing-topic") || null;
      } else {
        browseMode.topicId = null;
      }
      save();
      renderProductLibrary();
      setPageScrollY(0);
      return;
    }
    if (t.hasAttribute("data-ing-open") || t.hasAttribute("data-ing-nav")) {
      var browseIng = ensureProductBrowse();
      browseIng.mode = "ingredients";
      browseIng.productId = null;
      browseIng.scope = "all";
      if (t.hasAttribute("data-ing-open") && t.getAttribute("data-ing-nav") !== "topic") {
        /* Opening an ingredient — keep topic if present for back nav */
        browseIng.ingredientId = t.getAttribute("data-ing-open");
        if (t.getAttribute("data-ing-nav") === "ingredient") {
          /* returning from product detail */
        }
      } else {
        browseIng.ingredientId = null;
      }
      var ingNav = t.getAttribute("data-ing-nav");
      if (ingNav === "hub") {
        browseIng.topicId = null;
        browseIng.ingredientId = null;
        browseIng.q = "";
      } else if (ingNav === "topic") {
        browseIng.topicId = t.getAttribute("data-ing-topic") || null;
        browseIng.ingredientId = null;
        browseIng.q = "";
      } else if (t.hasAttribute("data-ing-open")) {
        browseIng.ingredientId = t.getAttribute("data-ing-open");
      }
      state.active = "products";
      save();
      if (state.active === "products" && document.getElementById("panel-products") &&
          document.getElementById("panel-products").classList.contains("active")) {
        renderProductLibrary();
        setPageScrollY(0);
      } else {
        renderNav();
        renderPanels();
      }
      return;
    }
    if (t.hasAttribute("data-talk-cat")) {
      var talkCat = t.getAttribute("data-talk-cat");
      if (!state.data.talkCatOpen || typeof state.data.talkCatOpen !== "object") {
        state.data.talkCatOpen = {};
      }
      var catWillOpen = !state.data.talkCatOpen[talkCat];
      state.data.talkCatOpen[talkCat] = catWillOpen;
      save();
      var catBlock = t.closest(".talk-cat-block") ||
        document.querySelector('[data-talk-cat-block="' + talkCat.replace(/"/g, "") + '"]');
      setTalkBlockOpen(catBlock, catWillOpen);
      return;
    }
    if (t.hasAttribute("data-talk-section")) {
      var secKey = t.getAttribute("data-talk-section");
      if (!state.data.talkSectionOpen || typeof state.data.talkSectionOpen !== "object") {
        state.data.talkSectionOpen = {};
      }
      var secWillOpen = !state.data.talkSectionOpen[secKey];
      state.data.talkSectionOpen[secKey] = secWillOpen;
      save();
      var secBlock = t.closest(".talk-cat-block") ||
        document.querySelector('[data-talk-fold="' + secKey.replace(/"/g, "") + '"]');
      setTalkBlockOpen(secBlock, secWillOpen);
      return;
    }
    if (t.hasAttribute("data-talk-principle")) {
      var prinId = t.getAttribute("data-talk-principle");
      var prinWillOpen = state.data.openPrinciple !== prinId;
      state.data.openPrinciple = prinWillOpen ? prinId : "";
      save();
      var prinRoot = document.getElementById("talkGuideRoot");
      if (prinRoot) {
        var prinItems = prinRoot.querySelectorAll(".talk-principle-item");
        for (var pi = 0; pi < prinItems.length; pi++) {
          var pItem = prinItems[pi];
          var pId = pItem.getAttribute("data-principle-item") || "";
          setFaqLikeOpen(pItem, prinWillOpen && pId === prinId);
        }
      }
      return;
    }
    if (t.hasAttribute("data-talk")) {
      var talkId = t.getAttribute("data-talk");
      var talkWillOpen = state.data.openTalk !== talkId;
      state.data.openTalk = talkWillOpen ? talkId : "";
      save();
      var talkRoot = document.getElementById("talkGuideRoot");
      if (talkRoot) {
        var soloBlocks = talkRoot.querySelectorAll(".talk-cat-solo");
        for (var si = 0; si < soloBlocks.length; si++) {
          setTalkBlockOpen(soloBlocks[si], talkWillOpen && soloBlocks[si].id === talkId);
        }
        var momentCards = talkRoot.querySelectorAll(".talk-moment-card");
        for (var mi = 0; mi < momentCards.length; mi++) {
          setFaqLikeOpen(momentCards[mi], talkWillOpen && momentCards[mi].id === talkId);
        }
      }
      return;
    }
    if (t.hasAttribute("data-faq-cat")) {
      var faqCat = t.getAttribute("data-faq-cat");
      var faqCats = ensureFaqCatOpen();
      var faqCatWillOpen = !faqCats[faqCat];
      faqCats[faqCat] = faqCatWillOpen;
      save();
      var faqFold = t.closest(".faq-cat");
      if (!faqFold) {
        var faqHost = t.closest(".faq-list");
        var foldSel = '[data-faq-fold="' + String(faqCat).replace(/"/g, "") + '"]';
        faqFold = faqHost ? faqHost.querySelector(foldSel) : document.querySelector(foldSel);
      }
      if (faqFold) {
        faqFold.classList.toggle("is-open", faqCatWillOpen);
        setFoldChevron(t, faqCatWillOpen);
      }
      return;
    }
    if (t.hasAttribute("data-faq")) {
      var faqId = t.getAttribute("data-faq");
      var faqWillOpen = state.data.openFaq !== faqId;
      state.data.openFaq = faqWillOpen ? faqId : "";
      save();
      var faqList = t.closest(".faq-list");
      if (faqList) {
        var faqItems = faqList.querySelectorAll(".faq-item");
        for (var fi = 0; fi < faqItems.length; fi++) {
          var fItem = faqItems[fi];
          var fId = fItem.getAttribute("data-faq-item") || "";
          setFaqLikeOpen(fItem, faqWillOpen && fId === faqId);
        }
      }
      return;
    }
    if (t.hasAttribute("data-copy-toggle")) {
      var body = document.getElementById(t.getAttribute("data-copy-toggle") + "_body");
      var card = t.closest(".copy-card");
      if (body) {
        var willOpen = body.hidden;
        body.hidden = !willOpen;
        if (card) card.classList.toggle("open", willOpen);
        var chev = t.querySelector(".copy-card-chev");
        if (chev) chev.textContent = willOpen ? "−" : "+";
      }
      return;
    }

    if (t.id === "todayAuthBtn") {
      if (window.FS.BridgeUI && window.FS.BridgeUI.openAuth) window.FS.BridgeUI.openAuth(true);
      return;
    }
    if (t.id === "settingsNavBtn") { openHubMenu(); return; }
    if (t.id === "menuCloseBtn") { closeHubMenu(); return; }
    if (t.id === "menuCloseBackdrop") {
      if (window.FS.dismissGuarded && window.FS.dismissGuarded()) return;
      closeHubMenu();
      return;
    }
    if (t.id === "lockToastClose") { hideLockToast(); return; }
    if (t.id === "quizCopyLink") {
      openEvResInviteSheet("quiz");
      return;
    }
    if (t.hasAttribute("data-soft-unlock")) {
      var unlockId = t.getAttribute("data-soft-unlock");
      ensureSoftUnlockMap();
      state.data.softUnlock[unlockId] = true;
      var unlockStep = packEvergreen() ? evStep(unlockId) : null;
      state.active = (unlockStep && unlockStep.goto) ? unlockStep.goto : unlockId;
      save();
      hideLockToast();
      if (!packEvergreen()) renderNav();
      renderPanels();
      if (packEvergreen()) {
        renderEvergreenPathChecks();
        refreshButtons();
      } else {
        renderModuleChecklists();
      }
      return;
    }
    if (t.hasAttribute("data-menu-goto")) {
      var dest = t.getAttribute("data-menu-goto");
      if (dest === "calendar") dest = "tend";
      closeHubMenu();
      hideLockToast();
      if (dest === "tend" || dest === "calendar") {
        dest = "tend";
        focusCalendarToday();
      }
      state.active = packSafeGoto(dest);
      save();
      renderNav();
      renderPanels();
      return;
    }

    if (t.id === "modeStarter") {
      setHubMode("starter");
      return;
    }
    if (t.id === "modeFull" || t.id === "lockToastUnlockFull" || t.id === "todayUnlockFull" || t.id === "levelUpBtn") {
      setHubMode("full");
      if (t.id === "levelUpBtn" || t.id === "todayUnlockFull") {
        closeHubMenu();
        state.active = packSafeGoto("welcome");
        save();
        renderNav();
        renderPanels();
        renderTodayCard();
        renderFinishCopy();
      }
      return;
    }
    if (t.id === "settingsCopySignIn") {
      var signInInput = document.getElementById("deviceSignInInput");
      var signInUrl = (signInInput && signInInput.value ? signInInput.value.trim() : "") || hubSignInUrl();
      if (!signInUrl) return;
      copyEvergreenJoin(t, "Copy sign-in link", signInUrl);
      return;
    }
    if (t.id === "settingsCopyLeadShare") {
      var shareInput = document.getElementById("settingsLeadShareInput");
      var shareUrl = hardenCopiedUrl((shareInput && shareInput.value ? shareInput.value.trim() : "") || settingsLeadShareUrl());
      if (!shareUrl) return;
      function markLeadShareCopied() {
        t.textContent = "Copied ✓";
        setTimeout(function () { t.textContent = "Copy lead page"; }, 1400);
      }
      function leadShareFallback() {
        try {
          var ta = document.createElement("textarea");
          ta.value = shareUrl;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          markLeadShareCopied();
        } catch (errCopy) {}
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(markLeadShareCopied).catch(leadShareFallback);
      } else {
        leadShareFallback();
      }
      return;
    }
    if (t.id === "settingsCopyGroveShare") {
      var groveShareInput = document.getElementById("settingsGroveShareInput");
      var groveShareUrl = hardenCopiedUrl((groveShareInput && groveShareInput.value ? groveShareInput.value.trim() : "") || grovePageInviteUrl());
      if (!groveShareUrl) return;
      function markGroveShareCopied() {
        t.textContent = "Copied ✓";
        setTimeout(function () { t.textContent = "Copy my business-info link"; }, 1400);
      }
      function groveShareFallback() {
        try {
          var taG = document.createElement("textarea");
          taG.value = groveShareUrl;
          taG.setAttribute("readonly", "");
          taG.style.position = "fixed";
          taG.style.left = "-9999px";
          document.body.appendChild(taG);
          taG.select();
          document.execCommand("copy");
          taG.remove();
          markGroveShareCopied();
        } catch (errG) {}
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(groveShareUrl).then(markGroveShareCopied).catch(groveShareFallback);
      } else {
        groveShareFallback();
      }
      return;
    }
    if (t.hasAttribute("data-seedtype")) {
      var sid = t.getAttribute("data-seedtype");
      state.data.seedTypeOpen = (state.data.seedTypeOpen === sid) ? "" : sid;
      save(); renderSeedTypes();
      return;
    }

    if (t.hasAttribute("data-goto")) {
      var goto = t.getAttribute("data-goto");
      if (goto === "calendar") goto = "tend";
      var fromBottomNav = !!(t.closest && t.closest("#bottomNav"));
      goto = resolveBottomNavGoto(goto, t);
      if (packEvergreen()) {
        var evTap = evStep(goto);
        if (evTap && goto === evTap.id) {
          if (!evStepUnlocked(evTap.id)) {
            showLockToast(evTap.id);
            return;
          }
          goto = evTap.goto || evTap.id;
        }
      }
      if (t.hasAttribute("data-your-story-gate")) {
        var priorGate = priorSectionId("roots");
        var priorGateName = priorGate ? sectionLabel(priorGate) : "the previous step";
        showGrowthToast("You’re not at " + sectionLabel("roots") + " yet — finish " + priorGateName + " first, then craft your story.");
      }
      function goPanel(next, paintOpts) {
        next = packSafeGoto(next);
        var prev = normalizePanelId(state.active);
        var nextNorm = normalizePanelId(next);
        rememberPanelScroll(state.active);
        endFreshOpenPin();
        if (fromBottomNav && nextNorm === prev) {
          /* Same tab re-tap — stay put (no remount / fade / today-reset). */
          return;
        }
        if ((next === "tend" || next === "calendar") && prev !== "tend") {
          next = "tend";
          /* Coming back from vault / photos / this week should keep the day
             you were on — only jump to today when arriving from another tab. */
          if (!isContentSurface(prev)) focusCalendarToday();
        }
        state.active = next;
        if (keepPushSurface && next !== keepPushSurface) keepPushSurface = "";
        rememberTabSurface(next);
        setRoadmapOpen(false);
        try { renderBottomNav(); } catch (eNav) {}
        persistActiveAndPaint(paintOpts || { restoreScroll: true });
      }
      if (goto === "ev-team") {
        toggleEvergreenTeamPage();
        return;
      }
      if (goto === "grove-board" || goto === "ev-board") {
        toggleGroveBoardPage();
        return;
      }
      if (goto === "leader" && isStarter() && !packEvergreen()) {
        showGrowthToast("Grove unlocks on All in — switch your pace in Settings anytime.");
        return;
      }
      if (isContentSurface(goto) && isStarter() && !packEvergreen()) {
        var lockEl = document.getElementById("lockToast");
        if (lockEl) {
          lockEl.hidden = false;
          lockEl.innerHTML =
            '<div class="lock-toast-inner">' +
            "<p><strong>Calendar</strong> unlocks on All in — team moments, your posts, vault, and photos.</p>" +
            '<div class="lock-toast-actions">' +
            '<button type="button" class="btn" id="lockToastUnlockFull">Unlock All in →</button>' +
            '<button type="button" class="lock-toast-x" id="lockToastClose" aria-label="Dismiss">×</button>' +
            "</div></div>";
        }
        return;
      }
      if (goto === "products") {
        ensureProductBrowse();
        var openMode = t.getAttribute("data-prod-mode") === "ingredients" ? "ingredients" : "products";
        state.productBrowse.mode = openMode;
        var openCat = t.getAttribute("data-prod-cat") || null;
        state.productBrowse.category = openMode === "products" ? (openCat || null) : null;
        state.productBrowse.subcategory = null;
        state.productBrowse.productId = null;
        state.productBrowse.topicId = openMode === "ingredients" ? (t.getAttribute("data-ing-topic") || null) : null;
        state.productBrowse.ingredientId = null;
        state.productBrowse.scope = "all";
        state.productBrowse.q = "";
        state.productBrowse.returnTo = productBrowseReturnFrom(state.active);
        hideLockToast();
        closeHubMenu();
        goPanel("products");
        return;
      }
      if (goto === "curiosity-photos") {
        hideLockToast();
        closeHubMenu();
        goPanel("curiosity-photos");
        return;
      }
      if (goto === "content-stories") {
        hideLockToast();
        closeHubMenu();
        if (!state.data.vaultBrowse) state.data.vaultBrowse = {};
        if (!state.data.vaultBrowse.vault) state.data.vaultBrowse.vault = { q: "", format: "", promoting: "", lane: "all" };
        state.data.vaultBrowse.vault.format = "story";
        goPanel("content-vault");
        return;
      }
      if (goto === "grove-shelf") {
        hideLockToast();
        closeHubMenu();
        if (!state.data.groveShelf) state.data.groveShelf = {};
        state.data.groveShelf.view = "browse";
        state.data.groveShelf.id = "";
        goPanel(goto);
        return;
      }
      if (goto === "content-vault" || goto === "content-week") {
        hideLockToast();
        closeHubMenu();
        if (goto === "content-vault") {
          if (!state.data.vaultBrowse) state.data.vaultBrowse = {};
          state.data.vaultBrowse.vault = { q: "", format: "", promoting: "", lane: "all" };
          save();
        }
        goPanel(goto);
        return;
      }
      if (goto === "talk") {
        hideLockToast();
        closeHubMenu();
        var beforeTalk = lastSprout;
        markTalkOpened();
        var openTalkId = t.getAttribute("data-open-talk");
        if (openTalkId) focusTalkMoment(openTalkId, "Warm");
        goPanel("talk");
        if (checklistProgress().sproutDone > beforeTalk) {
          lastSprout = beforeTalk;
          renderPlant({});
        }
        return;
      }
      if (goto === "quiz") {
        hideLockToast();
        closeHubMenu();
        goPanel("quiz");
        return;
      }
      if (goto === "why") {
        hideLockToast();
        closeHubMenu();
        goPanel("why");
        return;
      }
      if (goto === "leaders") {
        hideLockToast();
        closeHubMenu();
        goPanel("leaders");
        return;
      }
      if (goto === "leaders-comp") {
        hideLockToast();
        closeHubMenu();
        goPanel("leaders-comp");
        return;
      }
      if (goto === "leaders-understand") {
        hideLockToast();
        closeHubMenu();
        goPanel("leaders-understand");
        return;
      }
      if (goto === "leads" && usesCustomLanding()) {
        showGrowthToast("Leads is off while you use a custom-built page — switch to In-app lead page in Settings.");
        return;
      }
      if (!isChromeGoto(goto) && !sectionVisible(goto)) return;
      if (!isChromeGoto(goto) && !isModuleUnlocked(goto)) {
        showLockToast(goto);
        return;
      }
      hideLockToast();
      closeHubMenu();
      var openKnow = t.getAttribute("data-open-know");
      if (openKnow) {
        if (!state.data) state.data = {};
        state.data.openKnowSec = openKnow;
      }
      var focusId = t.getAttribute("data-goto-focus");
      if (focusId) window.FS.pendingLeadsFocus = focusId;
      goPanel(goto, focusId ? { restoreScroll: false } : undefined);
      return;
    }
    if (t.hasAttribute("data-prod-nav") || t.hasAttribute("data-prod-open")) {
      var browseNav = ensureProductBrowse();
      var wasOnProducts = state.active === "products";
      var openingDetail = t.hasAttribute("data-prod-open");
      var keepScroll = false;
      if (openingDetail) {
        rememberPanelScroll(state.active);
        browseNav.productId = t.getAttribute("data-prod-open");
        if (markLearnWalkthroughProgress("product")) save();
        if (packEvergreen() && noteEvergreenVisit("products")) save();
        var retPanel = t.getAttribute("data-prod-return");
        var fromIngFlow = browseNav.mode === "ingredients" && state.active === "products";
        if (retPanel) {
          browseNav.returnTo = {
            panel: retPanel,
            label: t.getAttribute("data-prod-return-label") || "Back"
          };
          browseNav.mode = "products";
          browseNav.ingredientId = null;
          browseNav.topicId = null;
        } else if (state.active === "know" || state.active === "why" || state.active === "ev-resources") {
          browseNav.returnTo = productBrowseReturnFrom(state.active) ||
            { panel: "know", label: "Back to Learn" };
          browseNav.mode = "products";
          browseNav.ingredientId = null;
          browseNav.topicId = null;
        } else if (fromIngFlow) {
          /* Keep Learn / Resources returnTo if this topic was opened from those doors. */
        } else {
          browseNav.returnTo = null;
          if (browseNav.mode === "ingredients") {
            browseNav.mode = "products";
            browseNav.ingredientId = null;
            browseNav.topicId = null;
          }
        }
      } else {
        var navMode = t.getAttribute("data-prod-nav");
        browseNav.productId = null;
        if (navMode === "return") {
          var retTo = browseNav.returnTo;
          browseNav.returnTo = null;
          if (retTo && retTo.panel) {
            rememberPanelScroll("products");
            state.active = packSafeGoto(retTo.panel);
            save();
            persistActiveAndPaint({ restoreScroll: true });
            return;
          }
          browseNav.scope = "favorites";
          browseNav.category = null;
          browseNav.subcategory = null;
        } else if (navMode === "hub") {
          browseNav.category = null;
          browseNav.subcategory = null;
          browseNav.scope = "all";
          browseNav.returnTo = null;
          browseNav.mode = "products";
          browseNav.topicId = null;
          browseNav.ingredientId = null;
        } else if (navMode === "favorites") {
          browseNav.scope = "favorites";
          browseNav.category = null;
          browseNav.subcategory = null;
          browseNav.q = "";
          browseNav.returnTo = null;
        } else if (navMode === "cat") {
          browseNav.scope = "all";
          browseNav.returnTo = null;
          var nextCat = t.getAttribute("data-prod-cat") || null;
          /* Subcategory chips — stay put instead of jumping to the top */
          keepScroll = wasOnProducts && t.hasAttribute("data-prod-sub") && browseNav.category === nextCat;
          browseNav.category = nextCat;
          if (t.hasAttribute("data-prod-sub")) {
            browseNav.subcategory = t.getAttribute("data-prod-sub") || null;
          } else {
            browseNav.subcategory = null;
          }
        }
      }
      state.active = "products";
      save();
      if (keepScroll) {
        var y = pageScrollY();
        renderProductLibrary();
        requestAnimationFrame(function () {
          setPageScrollY(y);
        });
      } else if (openingDetail) {
        if (wasOnProducts) {
          renderProductLibrary();
          setPageScrollY(0);
        } else {
          renderNav();
          renderPanels();
        }
      } else if (wasOnProducts) {
        renderProductLibrary();
        restorePanelScroll("products");
      } else {
        renderNav();
        persistActiveAndPaint({ restoreScroll: true });
      }
      if (openingDetail) {
        refreshButtons();
        if (packEvergreen()) renderEvergreenPathChecks();
      }
      return;
    }
    if (t.hasAttribute("data-complete")) {
      var id = t.getAttribute("data-complete");
      if (!canComplete(id)) return;
      if (pendingGrowth) flushPendingGrowth();
      var wasNew = !state.done[id];
      state.done[id] = true;
      if (id === "grove") syncGroveCalendar();
      var nxt = nextAfter(id) || (packEvergreen() ? "ev-home" : "done");
      /* If next is locked somehow, still allow — completing prior unlocks it */
      state.active = nxt;
      save();
      if (!packEvergreen()) renderNav();
      if (!packEvergreen()) renderPlant();
      else renderEvergreenSprout({ silent: true });
      renderPanels();
      refreshButtons();
      if (!packEvergreen()) {
        renderFinishCopy();
        renderModuleChecklists();
        renderTodayCard();
      }
      hideLockToast();
      if (wasNew) {
        var r = t.getBoundingClientRect();
        leafBurst(r.left + r.width / 2, r.top);
      }
      return;
    }
    if (t.hasAttribute("data-grove-pick")) {
      var beforeGroveSprout = lastSprout;
      var lane = t.getAttribute("data-grove-pick");
      var idx = parseInt(t.getAttribute("data-grove-idx"), 10);
      var pool = lane === "warm" ? groveNames() : customerNames();
      var pickName = pool[idx] || "";
      toggleGrovePick(lane, pickName);
      save();
      renderPickList(lane === "warm" ? "warm" : "customers");
      refreshButtons();
      renderModuleChecklists();
      renderTodayCard();
      if (checklistProgress().sproutDone > beforeGroveSprout) {
        lastSprout = beforeGroveSprout;
        renderPlant({});
      }
      flash("grove");
      return;
    }
    if (t.hasAttribute("data-choice")) {
      var beforeSprout = lastSprout;
      var choiceKey = t.getAttribute("data-choice");
      var choiceVal = t.getAttribute("data-value");
      if (choiceKey === "page_choice") {
        setPageChoice(choiceVal);
        if (checklistProgress().sproutDone > beforeSprout) {
          lastSprout = beforeSprout;
          renderPlant({});
        }
        flash(sectionOf(t));
        return;
      }
      state.data[choiceKey] = choiceVal;
      save();
      renderChoices();
      refreshButtons();
      renderModuleChecklists();
      renderTodayCard();
      if (checklistProgress().sproutDone > beforeSprout) {
        lastSprout = beforeSprout;
        renderPlant({});
      }
      flash(sectionOf(t));
      return;
    }
    if (t.hasAttribute("data-rhythm")) {
      var r2 = RHYTHMS[parseInt(t.getAttribute("data-rhythm"), 10)].label;
      var sel = state.data.rhythm || [];
      var ix = sel.indexOf(r2);
      if (ix > -1) sel.splice(ix, 1); else sel.push(r2);
      state.data.rhythm = sel;
      save();
      renderRhythms();
      refreshButtons();
      renderModuleChecklists();
      flash("tend");
      return;
    }
    if (t.hasAttribute("data-tadd")) {
      if (Tree.add(state, t.getAttribute("data-tadd"))) {
        syncWarmFromTree();
        save(); Tree.render(state); renderModuleChecklists("grove"); refreshButtons(); flash("tree");
        var inputs = document.querySelectorAll(".tnode-name");
        for (var n = inputs.length - 1; n >= 0; n--) {
          if (!inputs[n].value) { inputs[n].focus(); break; }
        }
      }
      return;
    }
    if (t.hasAttribute("data-tstatus")) {
      if (Tree.toggleStatus(state, t.getAttribute("data-tstatus"))) {
        save(); Tree.render(state); renderModuleChecklists("grove"); refreshButtons(); flash("tree");
      }
      return;
    }
    if (t.hasAttribute("data-tdel")) {
      var delPath = t.getAttribute("data-tdel");
      var finishDel = function () {
        if (Tree.remove(state, delPath)) {
          syncWarmFromTree();
          save(); Tree.render(state); renderModuleChecklists("grove"); refreshButtons(); flash("tree");
        }
      };
      var delKids = Tree.countUnder(state, delPath);
      if (!delKids) { finishDel(); return; }
      FS.UI.ask(delKids === 1
        ? "The one person under them comes off the tree too."
        : "The " + delKids + " people under them come off the tree too.", {
        title: "Remove " + (Tree.nameAt(state, delPath) || "this person") + "?",
        okText: "Remove",
        danger: true
      }).then(function (ok) { if (ok) finishDel(); });
      return;
    }
    if (t.hasAttribute("data-copy")) {
      var src = document.getElementById(t.getAttribute("data-copy"));
      if (!src) return;
      var prevLabel = t.textContent;
      var text = (src.textContent || "").trim();
      var markCopied = function () {
        t.textContent = "Copied ✓";
        t.classList.add("copied");
        setTimeout(function () { t.textContent = prevLabel; t.classList.remove("copied"); }, 1600);
      };
      var fallbackCopy = function () {
        try {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (ok) markCopied();
          else FS.UI.toast("Couldn’t copy — long-press the text instead.", { tone: "bad" });
        } catch (err) {
          FS.UI.toast("Couldn’t copy — long-press the text instead.", { tone: "bad" });
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      return;
    }
    if (t.id === "exportBtn" || t.id === "exportBtn2") { exportAnswers(); return; }
    if (t.id === "replayOnboardingBtn") { replayOnboardingFromSettings(); return; }
    if (t.id === "replayTeamTourBtn") { replayTeamTourFromSettings(); return; }
    if (t.id === "replayLeadsTourBtn") { replayLeadsTourFromSettings(); return; }
    if (t.id === "replayClientsTourBtn") { replayClientsTourFromSettings(); return; }
    if (t.id === "resetBtn") {
      FS.UI.ask("This erases Roots, your tree, and calendar on this device and in the cloud. Your leads inbox, lead-page link, and account stay. If you sign in again, use the same email.", {
        title: "Erase Growth answers?",
        okText: "Erase answers",
        danger: true
      }).then(function (okReset) {
        if (!okReset) return;
        var uid = boundUserId();
        try { localStorage.removeItem(progressKeyFor(uid || null)); } catch (err) {}
        try { localStorage.removeItem(CFG.storeKey); } catch (err) {}
        try { localStorage.removeItem(howGrowDraftKey()); } catch (err) {}
        try { localStorage.removeItem(howGrowStepKey()); } catch (err) {}
        try {
          var root = CFG.storeKey || "firstSeeds_v6";
          if (uid) localStorage.removeItem(root + "_syncbase_" + uid);
        } catch (errSb) {}
        if (window.FS.BridgeUI && window.FS.BridgeUI.clearSyncBase) {
          try { window.FS.BridgeUI.clearSyncBase(); } catch (eClr) {}
        }
        state = blankState();
        if (uid) state.settings.boundUserId = uid;
        ensureSettings();
        var fs = document.querySelectorAll("[data-key]");
        for (var j = 0; j < fs.length; j++) fs[j].value = "";
        var checks = document.querySelectorAll(".claim-check");
        for (var c2 = 0; c2 < checks.length; c2++) checks[c2].innerHTML = "";
        updateModeUI();
        renderNav(); renderPanels(); renderChoices(); renderRhythms(); renderSeedTypes(); Tree.render(state); liveRefresh();
        startOnboarding({ force: true });
        /* If signed in, push the blank slate so cloud can't resurrect old Growth. */
        if (window.FS.BridgeUI && window.FS.BridgeUI.syncNow) {
          window.FS.BridgeUI.syncNow().then(markCloudSyncOk).catch(function (err) {
            markCloudSyncError(err);
          });
        }
      });
      return;
    }
  });

  /* ── export ──────────────────────────────────────────── */
  function exportAnswers() {
    var d = state.data;
    var treeC = Tree.counts(Tree.ensure(state));
    var name = partnerName();
    var modeLabel = isStarter() ? "Soft start" : isFull() ? "All in" : "—";
    if (MODES.starter && isStarter()) modeLabel = MODES.starter.label || modeLabel;
    if (MODES.full && isFull()) modeLabel = MODES.full.label || modeLabel;
    var lines = ["FIRST SEEDS — my launch runway"];
    if (name) lines.push("Partner: " + name);
    lines = lines.concat([
      "Mode: " + modeLabel,
      "saved " + new Date().toLocaleDateString(), "",
      "═══ 01 · MY ROOTS ═══",
      "My why:", d.why || "—", "",
      "My Ringana moment:", d.moment || "—", "",
      "Why I said yes:", d.said_yes || "—", "",
      "═══ MY GROVE · CUSTOMERS (" + customerNames().length + " names) ═══",
      d.customers || "—", "",
      "First customer chats:", (grovePicks("customer_first").join(", ") || "—"), "",
      "═══ MY GROVE · PARTNERS · optional (" + groveNames().length + " names) ═══",
      d.warm || "—", "",
      "First partner chats:", (grovePicks("warm_first").join(", ") || "—"), ""
    ]);

    if (isFull() || (d.tree && d.tree.length)) {
      lines = lines.concat([
        "═══ 03 · MY TREE (" + treeC.total + " people · " + treeC.hopeful + " hopeful · " + treeC.committed + " committed) ═══"
      ]).concat(Tree.exportLines(state)).concat([""]);
    }

    lines = lines.concat([
      "═══ MY GROUND ═══",
      "Page choice: " + (d.page_choice === "custom" ? "Custom page" : d.page_choice === "generic" ? "Team template" : "—"), "",
      "My opening line:", d.page_story || "—", ""
    ]);

    if (isFull() || anySeedDraft()) {
      lines = lines.concat([
        "═══ MY STARTER TRIO (Post Studio) ═══",
        "My curiosity post ✨:", d.seed_open || "—", "",
        "Behind the scenes 🎬:", d.seed_curtain || "—", "",
        "Honest note 📝:", d.seed_honest || "—", "",
        "Values post 🚩:", d.seed_values || d.seed_value || "—", "",
        "My soft invite 🚪:", d.seed_invite || "—", "",
        "(Cadence: share value a few times, then one soft invite)", ""
      ]);
    }

    lines = lines.concat(["═══ MY RHYTHM ═══"])
      .concat((d.rhythm && d.rhythm.length ? d.rhythm.map(function (r) { return "• " + r; }) : ["—"]))
      .concat(["", "Pre-registration: October 1 · Launch: November 1", "You've got this. 🌱"]);

    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my-first-seeds.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 300);
  }

  /* ── init ────────────────────────────────────────────── */
  window.FS.onCalendarChange = function () {
    if (packEvergreen()) {
      liveRefresh({ silent: true });
      return;
    }
    var beforeSprout = lastSprout;
    autoClaimReadySteps();
    refreshButtons();
    renderModuleChecklists();
    renderTodayCard();
    liveRefresh({ silent: true });
    if (checklistProgress().sproutDone > beforeSprout) {
      lastSprout = beforeSprout;
      renderPlant({});
    }
  };

  renderBrand();
  wireOnboarding();
  wireHowIGrow();
  wireLastNamePrompt();
  wireGroveLeaderWelcome();
  wireClientsArrival();
  wireGrowthSettings();
  wireSettingsName();
  wireSettingsInstagram();
  wireSettingsPhoto();
  wireWeekStartSettings();
  wireHubSettingsAccordion();
  if (window.FS.Push && window.FS.Push.wireSettings) window.FS.Push.wireSettings();
  syncGrowthSettingsUI();
  syncWeekStartSettingsUI();
  wireTour();
  updateModeUI();

  var pendingCustomersDeepLink = false;

  function applyDeepLink(go, opts) {
    opts = opts || {};
    go = String(go || "").trim();
    if (!go) return false;
    if (go === "home" || go === "sprout" || go === "welcome") {
      state.active = packSafeGoto("welcome");
      keepPushSurface = "";
      if (opts.boot) bootPreferActive = state.active;
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    if (go === "leads") {
      state.data.lead_preview_seen = true;
      keepPushSurface = "";
      if (packEvergreen()) {
        save();
        return true;
      }
      if (!usesCustomLanding()) {
        state.active = "leads";
        if (opts.boot) bootPreferActive = "leads";
      }
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    if (go === "customers") {
      keepPushSurface = "";
      if (packEvergreen() || shelfCustomersGate() === "no") {
        pendingCustomersDeepLink = false;
        save();
        return true;
      }
      if (shelfCustomersGate() === "wait") {
        pendingCustomersDeepLink = true;
        save();
        return true;
      }
      pendingCustomersDeepLink = false;
      state.active = "customers";
      if (opts.boot) bootPreferActive = "customers";
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    if (go === "leader" || go === "grove" || go === "team") {
      state.active = packEvergreen()
        ? (canSeeEvergreenTeamPage() ? "ev-team" : "ev-home")
        : "leader";
      keepPushSurface = packEvergreen() ? "" : "leader";
      if (opts.boot) bootPreferActive = state.active;
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    if (go === "board" || go === "grove-board" || go === "ev-board" || go === "messages" || go === "poll") {
      if (window.FS.BridgeUI && window.FS.BridgeUI.setGroveBoardTab) {
        window.FS.BridgeUI.setGroveBoardTab(go === "messages" ? "messages" : "announcements");
      }
      state.active = packEvergreen() ? "ev-board" : "grove-board";
      keepPushSurface = state.active;
      if (opts.boot) bootPreferActive = state.active;
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    if (go === "grove-shelf") {
      state.active = packEvergreen() ? "tend" : "grove-shelf";
      if (!state.data.groveShelf) state.data.groveShelf = {};
      state.data.groveShelf.view = "browse";
      state.data.lastContentSurface = packEvergreen() ? "tend" : "grove-shelf";
      keepPushSurface = "";
      if (opts.boot) bootPreferActive = state.active;
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    if (go === "tend" || go === "calendar") {
      /* Soft start has no Calendar tab — land on Sprout where the gathering banner lives. */
      if (isStarter()) {
        state.active = packSafeGoto("welcome");
        keepPushSurface = "";
        if (opts.boot) bootPreferActive = state.active;
      } else {
        state.active = "tend";
        state.data.lastContentSurface = "tend";
        keepPushSurface = "";
        if (opts.boot) bootPreferActive = "tend";
      }
      save();
      if (!opts.boot) {
        renderNav();
        renderPanels();
      }
      return true;
    }
    return false;
  }

  window.FS.openPushUrl = function (url) {
    try {
      var parsed = new URL(url, window.location.href);
      applyDeepLink(parsed.searchParams.get("go") || "");
    } catch (e) {}
  };

  try {
    var bootParams = new URLSearchParams(window.location.search);
    var go = (bootParams.get("go") || "").trim();
    if (applyDeepLink(go, { boot: true }) && window.history && window.history.replaceState) {
      bootParams.delete("go");
      var kept = bootParams.toString();
      window.history.replaceState({}, "", window.location.pathname + (kept ? "?" + kept : "") + window.location.hash);
    }
  } catch (e) {}
  if (state.active === "calendar") state.active = "tend";
  if (state.active && state.active === "leads" && usesCustomLanding()) {
    state.active = "ground";
    save();
  }
  /* Until Cloud answers, Pack can still look like Grove on the Evergreen
     host. Remapping here is how Resources came back as Sprout. */
  if (packSettled()) {
    state.active = packSafeGoto(state.active) || state.active;
    if (shouldParkStarterSurface()) {
      state.active = "welcome";
      save();
    }
    if (shouldParkLockedModule()) {
      state.active = "welcome";
      save();
    }
  }

  renderNav();
  renderPanels();
  renderChoices();
  renderRhythms();
  renderSeedTypes();
  renderHooks();
  renderContentBanks();
  renderKnowPanel();
  if (migrateDreamTree()) {
    try { save(); } catch (eSeed) {}
  }
  Tree.render(state);
  renderCountdowns();
  wireTopbarStickyOffset();
  wireVisualViewport();
  syncTopbarStickyOffset();
  requestAnimationFrame(function () { syncTopbarStickyOffset(); });
  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(function () {
      syncTopbarStickyOffset();
      fitBrandEyebrow();
    }).catch(function () {});
  }
  wireRoadmapHover();
  wireEvTeamNavBtn();
  wireGroveBoardNavBtn();
  var keys = ["why", "moment", "said_yes", "page_story", "seed_open", "seed_value", "seed_curtain", "seed_honest", "seed_values", "seed_invite"];
  for (var ki = 0; ki < keys.length; ki++) runClaimCheck(keys[ki]);
  liveRefresh({ silent: true });
  /* This repaints countdowns and measures the topbar, so landing it mid-scroll
     costs a frame — and there's nothing to repaint for someone who isn't
     looking. Skip while hidden and catch up the moment they come back. */
  function tickMinute() {
    if (document.visibilityState === "hidden") return;
    renderCountdowns();
    syncTopbarStickyOffset();
    if (window.FS.Cloud && window.FS.Cloud.dispatchZoomReminders) {
      window.FS.Cloud.dispatchZoomReminders().catch(function () {});
    }
  }
  setInterval(tickMinute, 60000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") tickMinute();
  });

  window.FS.onOrgEventsReady = function () {
    evZoomCache = { at: 0, zoom: null, inflight: false };
    if (!packEvergreen() || state.active !== "ev-home") return;
    fetchEvergreenZoom(function (zoom) {
      if (!packEvergreen() || state.active !== "ev-home") return;
      paintEvergreenToday(zoom);
    });
  };

  window.FS.onAuthReady = function () {
    rememberLeaderStatus();
    if (!partnerName()) {
      var cloudUser = window.FS && window.FS.Cloud && window.FS.Cloud.user && window.FS.Cloud.user();
      var fromCloud = cloudUser && (cloudUser.display_name || cloudUser.first_name);
      var seed = fromCloud ? String(fromCloud).trim().split(/\s+/)[0] : "";
      if (seed && !(window.FS.Cloud.isPlaceholderName && window.FS.Cloud.isPlaceholderName(seed))) {
        state.settings.partnerName = seed;
        save();
      }
    }
    liveRefresh({ silent: true });
    renderBottomNav();
    try { renderGreetings(); } catch (eGreet) {}
    try {
      var slugCloud = window.FS.Cloud;
      if (slugCloud && slugCloud.ensureLeadSlug && cabinetIsGroveLeader() && !cabinetLeadSlug()) {
        slugCloud.ensureLeadSlug().then(function () {
          renderBottomNav();
          renderPanels({ restoreScroll: true });
          maybePlayClientsArrival();
        }).catch(function () {});
      }
    } catch (eSlugReady) {}
    if (pendingCustomersDeepLink && shelfCustomersGate() === "yes") {
      pendingCustomersDeepLink = false;
      state.active = "customers";
      save();
      renderNav();
      renderPanels({ restoreScroll: true });
    } else if (state.active === "customers" && shelfCustomersGate() === "no") {
      state.active = packSafeGoto("welcome");
      save();
      renderPanels({ restoreScroll: true });
    }
    flushPendingGrovePhoto();
    if (window.FS.Push && window.FS.Push.syncThisDevice) {
      window.FS.Push.syncThisDevice().catch(function () {});
    }
    if (window.FS.Push && window.FS.Push.refreshSettingsUI) {
      window.FS.Push.refreshSettingsUI().catch(function () {});
    }
    if (window.FS.Cloud && window.FS.Cloud.dispatchZoomReminders) {
      window.FS.Cloud.dispatchZoomReminders().catch(function () {});
    }
    syncPageStoryToLeadBlurb();
    flushOpeningLineIfNeeded();
    var split = splitFullNameIfNeeded();
    if (cloudSignedIn() && !partnerLastName()) {
      var u = howGrowCloud() && howGrowCloud().user ? howGrowCloud().user() : null;
      if (u && u.last_name) {
        state.settings.partnerLastName = String(u.last_name).trim();
        split = true;
      }
    }
    if (split) {
      save();
      try {
        var Cloud = howGrowCloud();
        if (Cloud && Cloud.isSignedIn() && partnerLastName()) {
          Cloud.updateProfile({
            display_name: partnerName(),
            last_name: partnerLastName()
          }).catch(function () {});
        }
      } catch (e) {}
    }
    if (notifyPromptActive()) {
      resumeNotifyPrompt();
      return;
    }
    if (dismissOnboardingIfModeChosen()) {
      revealBootCover(function () {
        if (!state.tourDone) startTour();
        else afterExistingUserGate();
      });
      return;
    }
    if (!cloudSignedIn()) {
      if (authStillRestoring()) return;
      var gateAuth = document.getElementById("onboarding");
      if (!gateAuth || !gateAuth.classList.contains("open")) startOnboarding({ force: true });
      else if (passwordResetOpen() || partnerName() || modeChosen()) {
        onboardingStep = 4;
        renderOnboardingStep();
      }
      return;
    }
    var wrap = document.getElementById("onboarding");
    if (passwordResetOpen()) {
      var authOverlay = document.getElementById("authOverlay");
      if (authOverlay && authOverlay.classList.contains("open") && window.FS._authReset) {
        window.FS._authReset.paint();
        return;
      }
      if (!wrap || !wrap.classList.contains("open")) startOnboarding({ force: true });
      else {
        onboardingStep = 4;
        renderOnboardingStep();
      }
      return;
    }
    if (!wrap || !wrap.classList.contains("open")) {
      revealBootCover(afterExistingUserGate);
      return;
    }
    if (partnerName() && cloudSignedIn()) {
      onboardingStep = packEvergreen() ? 6 : 5;
      renderOnboardingStep();
    } else if (partnerName()) {
      onboardingStep = 4;
      renderOnboardingStep();
    } else if (hasLocalRootsProgress()) {
      onboardingStep = 3;
      renderOnboardingStep();
    } else if (isRunningAsInstalledApp() && state.data.onboardCircleAck) {
      onboardingStep = 3;
      renderOnboardingStep();
    }
  };

  var bootRevealStarted = false;
  var bootRevealThen = [];
  var bootLifted = false;
  function revealBootCover(then) {
    if (typeof then === "function") bootRevealThen.push(then);
    function flush() {
      var after = bootRevealThen.slice();
      bootRevealThen = [];
      for (var i = 0; i < after.length; i++) {
        try { after[i](); } catch (e) {}
      }
    }
    function lift() {
      if (bootLifted) return;
      bootLifted = true;
      document.body.classList.remove("is-booting");
      document.body.removeAttribute("aria-busy");
      pinOpenToTop();
      setTimeout(endFreshOpenPin, 400);
      flush();
      var cover = document.getElementById("bootCover");
      if (!cover) return;
      var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(function () {
        if (cover.parentNode && !document.body.classList.contains("is-booting")) {
          cover.setAttribute("hidden", "");
        }
      }, reduced ? 0 : 450);
    }
    if (bootRevealStarted) {
      if (!document.body.classList.contains("is-booting")) flush();
      return;
    }
    if (!document.body.classList.contains("is-booting")) {
      flush();
      return;
    }
    bootRevealStarted = true;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bloomHoldDone = false;
    function waitingForFreshBuild() {
      return !!(window.FS && window.FS.freshBuildPending);
    }
    function canLiftCover() {
      if (waitingForFreshBuild()) return false;
      var Cloud = window.FS && window.FS.Cloud;
      if (Cloud && Cloud.bootReady && !Cloud.bootReady()) return false;
      /* Restore finished (signed in or not) — don't hold the plant for 6s. */
      return true;
    }
    function markAppReady() {
      if (waitingForFreshBuild()) return;
      if (window.FS && window.FS.bootProgress) window.FS.bootProgress("ready");
    }
    function tryLift() {
      markAppReady();
      if (!bloomHoldDone) return;
      if (!canLiftCover()) return;
      lift();
    }
    var poll = setInterval(function () {
      tryLift();
      if (bootLifted) clearInterval(poll);
    }, 50);
    if (window.FS && window.FS.whenBootBloomed) {
      window.FS.whenBootBloomed(function () {
        window.setTimeout(function () {
          bloomHoldDone = true;
          tryLift();
        }, reduced ? 0 : 360);
      });
    } else {
      window.setTimeout(function () {
        bloomHoldDone = true;
        tryLift();
      }, reduced ? 0 : 340);
    }
    markAppReady();
    /* Soft cap — keep the plant up if a new build is still arriving. */
    window.setTimeout(function () {
      if (waitingForFreshBuild()) return;
      lift();
    }, 6000);
    /* Absolute cap so a stuck update check cannot leave the cover on. */
    window.setTimeout(function () {
      if (window.FS && window.FS.applyingFreshBuild) return;
      if (window.FS) window.FS.freshBuildPending = false;
      lift();
    }, 14000);
  }

  function finishBootGate() {
    if (bootPreferActive) {
      if (!(bootPreferActive === "leads" && usesCustomLanding())) {
        state.active = packSafeGoto(bootPreferActive);
      }
      bootPreferActive = "";
      save();
    }
    if (usesCustomLanding() && state.active === "leads") {
      state.active = "ground";
      save();
    }
    state.active = packSafeGoto(state.active);
    if (shouldParkStarterSurface()) {
      state.active = packSafeGoto("welcome");
      save();
    }
    if (shouldParkLockedModule()) {
      state.active = packSafeGoto("welcome");
      save();
    }
    if (teamTreeGrowDemoOn()) state.active = teamTreeGrowDemoPanel();
    try {
      renderNav();
      renderPanels();
    } catch (e) {}
    if (dismissOnboardingIfModeChosen()) {
      revealBootCover(function () {
        if (!state.tourDone) startTour();
        else afterExistingUserGate();
      });
      return;
    }
    if (!modeChosen() || !cloudSignedIn()) {
      if (!authStillRestoring()) {
        var gate = document.getElementById("onboarding");
        if (!gate || !gate.classList.contains("open")) startOnboarding({ force: true });
      }
    }
    refreshHowGrowReminder();
    revealBootCover();
  }

  if (window.FS.BridgeUI) {
    /* Open the gate from local state right away; cloud merge may dismiss it.
       Skip while a stored session is still coming back — keep the plant up. */
    if (!modeChosen() && !expectSignedIn()) startOnboarding();
    window.FS.BridgeUI.init({
      getState: function () { return state; },
      setStateFromCloud: function (next) {
        var incomingScore = snapshotProgressScore({
          data: next && next.data,
          done: next && next.done,
          settings: next && next.settings
        });
        var currentScore = snapshotProgressScore(snapshotFromState());
        if (currentScore >= 20 && incomingScore * 3 < currentScore) {
          console.warn("[First Seeds] refused a cloud paint that would wipe local answers");
          return;
        }
        rememberPanelScroll(state.active);
        var keepPanelScroll = (state.data && state.data.panelScroll) || {};
        var firstCloudOpen = !cloudOpenedAtTop;
        cloudOpenedAtTop = true;
        /* Keep what they’re still typing — merge uses savedAt, which lags the
           500ms debounce, so remote can otherwise overwrite live field text. */
        var liveFields = document.querySelectorAll("[data-key], [data-tname]");
        if (next.data) {
          for (var li = 0; li < liveFields.length; li++) {
            if (document.activeElement !== liveFields[li]) continue;
            var liveKey = liveFields[li].getAttribute("data-key");
            if (liveKey) next.data[liveKey] = liveFields[li].value;
            var liveTree = liveFields[li].getAttribute("data-tname");
            if (liveTree && Tree && Tree.setName) {
              Tree.setName({ data: next.data }, liveTree, liveFields[li].value);
            }
          }
        }
        state.data = next.data || state.data;
        if (firstCloudOpen) {
          /* Drop last visit's saved positions. Keep this session's current Y
             so a late hydrate doesn't yank the page. */
          state.data.panelScroll = keepPanelScroll;
        } else {
          if (!state.data.panelScroll || typeof state.data.panelScroll !== "object") {
            state.data.panelScroll = {};
          }
          state.data.panelScroll = Object.assign({}, state.data.panelScroll, keepPanelScroll);
        }
        state.done = next.done || state.done;
        state.active = next.active || state.active;
        if (bootPreferActive) state.active = bootPreferActive;
        if (state.active === "calendar") state.active = "tend";
        if (usesCustomLanding() && state.active === "leads") state.active = "ground";
        state.active = packSafeGoto(state.active);
        if (shouldParkStarterSurface()) {
          state.active = packSafeGoto("welcome");
        }
        if (shouldParkLockedModule()) state.active = packSafeGoto("welcome");
        if (teamTreeGrowDemoOn()) state.active = teamTreeGrowDemoPanel();
        var keepLeaderAck = !!(state.settings && state.settings.groveLeaderWelcomeAcked);
        var keepWasLeader = !!(state.settings && state.settings.wasOrgLeader);
        var keepClientsAck = !!(state.settings && state.settings.clientsArrivalAcked);
        try {
          if (localStorage.getItem(clientsArrivalAckStoreKey()) === "1") keepClientsAck = true;
        } catch (eAck) {}
        if (state.data && state.data.clientsTourDone) keepClientsAck = true;
        state.settings = next.settings || state.settings;
        ensureSettings();
        if (keepLeaderAck) state.settings.groveLeaderWelcomeAcked = true;
        if (keepWasLeader || keepLeaderAck) state.settings.wasOrgLeader = true;
        if (keepClientsAck || (next.settings && next.settings.clientsArrivalAcked)) {
          state.settings.clientsArrivalAcked = true;
        }
        if (cloudSignedIn()) {
          var u = howGrowCloud() && howGrowCloud().user ? howGrowCloud().user() : null;
          if (u && u.id) state.settings.boundUserId = u.id;
        }
        state.tourDone = !!next.tourDone;
        state.cheers = next.cheers || [];
        if (next.savedAt) state.savedAt = next.savedAt;
        if (!state.data.calendar) state.data.calendar = {};
        migrateGrovePicks();
        var treeFocus = document.activeElement;
        var typingTree = !!(treeFocus && treeFocus.getAttribute && treeFocus.getAttribute("data-tname") != null);
        if (!typingTree) migrateDreamTree();
        /* hydrate fields — don't clobber a focused input mid-edit */
        var fs = document.querySelectorAll("[data-key]");
        for (var j = 0; j < fs.length; j++) {
          if (document.activeElement === fs[j]) continue;
          var k = fs[j].getAttribute("data-key");
          if (state.data[k] != null) fs[j].value = state.data[k];
        }
        save({ skipCloud: true });
        updateModeUI();
        renderNav();
        renderPanels({ restoreScroll: true });
        renderChoices();
        renderRhythms();
        renderSeedTypes();
        treeFocus = document.activeElement;
        if (!(treeFocus && treeFocus.getAttribute && treeFocus.getAttribute("data-tname") != null)) {
          Tree.render(state);
        }
        liveRefresh({ silent: true });
        renderGreetings();
        /* Cloud may restore hubMode after onboarding already opened — drop the gate. */
        dismissOnboardingIfModeChosen();
      },
      persist: function (opts) { save(opts || {}); },
      bindProgressAccount: bindProgressAccount,
      gotoPanel: function (id) {
        if (id === "calendar") id = "tend";
        if (id === "content-stories") {
          if (!state.data.vaultBrowse) state.data.vaultBrowse = {};
          if (!state.data.vaultBrowse.vault) state.data.vaultBrowse.vault = { q: "", format: "", promoting: "", lane: "all" };
          state.data.vaultBrowse.vault.format = "story";
          id = "content-vault";
        }
        id = packSafeGoto(id);
        if (id === "leads" && usesCustomLanding()) {
          showGrowthToast("Leads is off while you use a custom-built page — switch to In-app lead page in Settings.");
          return;
        }
        if (id === "tend" && normalizePanelId(state.active) !== "tend") {
          focusCalendarToday();
        }
        if (id === "curiosity-photos" || id === "products" || id === "talk" || id === "quiz" || id === "why" || id === "leaders" || id === "leaders-comp" || id === "leaders-understand" || id === "tend" || id === "know" || id === "content-vault" || id === "content-week" || id === "grove-shelf") {
          hideLockToast();
          state.active = id;
          persistActiveAndPaint();
          return;
        }
        if (id !== "welcome" && id !== "done" && id !== "calendar" && id !== "leader" && id !== "grove-board" && id !== "ev-board" && id !== "know" && id !== "talk" && id !== "quiz" && id !== "why" && id !== "leaders" && id !== "leaders-comp" && id !== "leaders-understand" && id !== "products" && id !== "leads" && id !== "ev-home" && id !== "ev-resources" && id !== "ev-team" && id !== "ev-learn" && id !== "ev-heart" && id !== "ev-leads" && id !== "ev-dream" && id !== "roots" && !isModuleUnlocked(id)) {
          showLockToast(id);
          return;
        }
        hideLockToast();
        state.active = id;
        persistActiveAndPaint();
      }
    }).then(finishBootGate).catch(finishBootGate);
  } else {
    finishBootGate();
  }
  window.setTimeout(revealBootCover, 4500);

  window.FS.closeHubMenu = closeHubMenu;
  window.FS.paintSyncChrome = paintSyncChrome;
  window.FS.markCloudSyncOk = markCloudSyncOk;
  window.FS.markCloudSyncError = markCloudSyncError;
  window.FS.openGroveTeamInvite = function () { openEvResInviteSheet("grove"); };
  window.FS.openLeadsPageInvite = function (btn) { copyInviteLinkNow("leads", btn); };
  window.FS.openGrovePageInvite = function (btn) { copyInviteLinkNow("grove-page", btn); };
  window.FS.copyLeadsPageInvite = function (btn) { copyInviteLinkNow("leads", btn); };
  window.FS.copyGrovePageInvite = function (btn) { copyInviteLinkNow("grove-page", btn); };
  window.FS.copyCabinetInvite = function (btn) { copyInviteLinkNow("cabinet", btn); };
  window.FS.openQuizInvite = function () { openEvResInviteSheet("quiz"); };
  window.FS.paintLeadsShareButton = paintLeadsShareButton;
  window.FS.renderMiniPage = renderMiniPage;
  window.FS.paintGrovePageShareButton = paintGrovePageShareButton;
  window.FS.paintQuizShareButton = paintQuizShareButton;
  window.FS.flushSave = flushSave;
  window.FS.flushPendingGrovePhoto = flushPendingGrovePhoto;
  window.FS.prepareSignOut = function () {
    try { flushSave(); } catch (e) {}
    try { flushPendingGrovePhoto(); } catch (e2) {}
  };
  window.FS.bindProgressAccount = bindProgressAccount;
  window.FS.updateLeadPageSettingUI = updateLeadPageSettingUI;
  window.FS.setLeadShareSource = setLeadShareSource;
  window.FS.leadsPageInviteUrl = leadsPageInviteUrl;
  window.FS.leadsPreviewHref = leadsPreviewHref;
  window.FS.celebrateLeadJoin = celebrateLeadJoin;
  window.FS.idealLeads = {
    list: ensureIdealLeads,
    add: function (name, lane) {
      var row = addIdealLead(name, lane);
      pruneGrovePicks("customers");
      pruneGrovePicks("warm");
      return row;
    },
    setStatus: setIdealLeadStatus,
    setLane: setIdealLeadLane,
    remove: removeIdealLead,
    rename: renameIdealLead,
    inboxNameSet: idealLeadInboxNameSet,
    afterLiveTeamMerge: function () {
      migrateDreamTree();
      migrateIdealLeads();
      syncNameFieldsFromIdealLeads();
    },
    syncFromFields: function () {
      syncIdealLeadsFromNameField("customers");
      syncIdealLeadsFromNameField("warm");
    },
    syncFields: syncNameFieldsFromIdealLeads
  };

  (function wireSyncBanner() {
    var retry = document.getElementById("syncBannerRetry");
    var dismiss = document.getElementById("syncBannerDismiss");
    if (retry && !retry.dataset.bound) {
      retry.dataset.bound = "1";
      retry.addEventListener("click", function () {
        if (!window.FS.BridgeUI || !window.FS.BridgeUI.syncNow) return;
        retry.disabled = true;
        Promise.resolve(window.FS.BridgeUI.syncNow({ merge: true })).then(function () {
          markCloudSyncOk();
        }).catch(function (err) {
          markCloudSyncError(err);
        }).then(function () {
          retry.disabled = false;
        });
      });
    }
    if (dismiss && !dismiss.dataset.bound) {
      dismiss.dataset.bound = "1";
      dismiss.addEventListener("click", function () {
        syncFail = null;
        var banner = document.getElementById("syncBanner");
        if (banner) banner.hidden = true;
        paintSyncChrome();
      });
    }
    paintSyncChrome();
  })();
})();
