/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — BRIDGE UI
   Auth gate, leader dashboard, calendar, cheers, invite link.
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

window.FS.YouTube = (function () {
  "use strict";

  function esc(t) {
    return (t + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function parseTime(raw) {
    if (!raw) return 0;
    var s = String(raw).trim();
    if (/^\d+$/.test(s)) return parseInt(s, 10) || 0;
    var h = 0, m = 0, sec = 0;
    var hm = s.match(/(\d+)h/i);
    var mm = s.match(/(\d+)m/i);
    var sm = s.match(/(\d+)s/i);
    if (hm) h = parseInt(hm[1], 10);
    if (mm) m = parseInt(mm[1], 10);
    if (sm) sec = parseInt(sm[1], 10);
    if (!hm && !mm && !sm) return 0;
    return h * 3600 + m * 60 + sec;
  }

  function parse(url) {
    if (!url) return null;
    var id = "";
    var start = 0;
    try {
      var u = new URL(String(url).trim());
      var host = (u.hostname || "").replace(/^www\./i, "").toLowerCase();
      if (host === "youtu.be") {
        id = (u.pathname.split("/").filter(Boolean)[0] || "").split("&")[0];
      } else if (
        host === "youtube.com" ||
        host === "m.youtube.com" ||
        host === "music.youtube.com" ||
        host === "youtube-nocookie.com"
      ) {
        id = u.searchParams.get("v") || "";
        if (!id) {
          var parts = u.pathname.split("/").filter(Boolean);
          var i;
          for (i = 0; i < parts.length; i++) {
            if (parts[i] === "embed" || parts[i] === "shorts" || parts[i] === "live" || parts[i] === "v") {
              id = parts[i + 1] || "";
              break;
            }
          }
        }
      } else {
        return null;
      }
      var t = u.searchParams.get("t") || u.searchParams.get("start") || "";
      if (!t && u.hash) {
        var hm = u.hash.match(/[?&]?t=([^&]+)/);
        if (hm) t = decodeURIComponent(hm[1]);
      }
      start = parseTime(t);
    } catch (e) {
      return null;
    }
    id = String(id || "").replace(/[^a-zA-Z0-9_-]/g, "");
    if (id.length !== 11) return null;
    return { id: id, start: start };
  }

  function posterUrl(id) {
    return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  }

  function watchUrl(parsed) {
    if (!parsed || !parsed.id) return "";
    var url = "https://www.youtube.com/watch?v=" + parsed.id;
    if (parsed.start) url += "&t=" + parsed.start;
    return url;
  }

  function pageOrigin() {
    try {
      if (typeof location !== "undefined" && location.origin && location.origin !== "null") {
        return location.origin;
      }
    } catch (e) {}
    return "";
  }

  function embedUrl(parsed, opts) {
    opts = opts || {};
    if (!parsed || !parsed.id) return "";
    /* youtube.com/embed (not nocookie) — unlisted call replays often show
       "Video unavailable" on the privacy-enhanced host for anyone who isn't
       signed in as the uploader. */
    var q = ["playsinline=1", "rel=0"];
    if (parsed.start) q.push("start=" + parsed.start);
    if (opts.autoplay) q.push("autoplay=1");
    var origin = pageOrigin();
    if (origin) q.push("origin=" + encodeURIComponent(origin));
    return "https://www.youtube.com/embed/" + parsed.id + "?" + q.join("&");
  }

  function iframeHtml(parsed, title, opts) {
    var src = embedUrl(parsed, opts);
    if (!src) return "";
    return (
      '<iframe class="yt-embed-frame" src="' + esc(src) +
      '" title="' + esc(title || "YouTube replay") +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"' +
      ' referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    );
  }

  function posterHtml(url, title) {
    var parsed = parse(url);
    if (!parsed) return "";
    var t = title || "Replay";
    return (
      '<div class="yt-embed" data-yt-player>' +
        '<button type="button" class="yt-embed-poster" data-yt-play data-yt-id="' + esc(parsed.id) +
        '" data-yt-start="' + (parsed.start || 0) + '" data-yt-title="' + esc(t) + '">' +
          '<img src="' + esc(posterUrl(parsed.id)) + '" alt="" decoding="async">' +
          '<span class="yt-embed-play" aria-hidden="true">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19.5 12 8 5.14Z"/></svg>' +
          "</span>" +
          '<span class="sr-only">Play replay</span>' +
        "</button>" +
      "</div>"
    );
  }

  return {
    parse: parse,
    posterUrl: posterUrl,
    watchUrl: watchUrl,
    embedUrl: embedUrl,
    iframeHtml: iframeHtml,
    posterHtml: posterHtml
  };
})();

(function () {
  "use strict";

  var Cloud = window.FS.Cloud;
  var unlockFailCount = 0;
  var unlockLockedUntil = 0;
  var Cal = window.FS.Calendar;
  var getState = null;
  var setStateFromCloud = null;
  var persist = null;
  var gotoPanel = null;
  var bindProgressAccount = null;
  var syncChain = Promise.resolve();
  var lastMergeAt = 0;
  var syncBase = null;
  var syncBaseForKey = "";
  var lastAuthIntent = "signin";
  var wired = false;
  var supportProfileByPartner = {};
  /* Same ticket scheme as leadsRun — renderLeader() fans out to several cloud
     reads, so a slow earlier pass must not repaint over a fresher team. */
  var leaderRun = 0;
  var lastLeaderSnap = null;

  function esc(t) {
    return (t + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function $(id) { return document.getElementById(id); }

  function armSheetDismiss() {
    if (window.FS.armDismissGuard) window.FS.armDismissGuard();
  }

  function closeEvResInviteSheet() {
    var sheet = $("evResInviteSheet");
    if (sheet) sheet.hidden = true;
  }

  function closeAllSheets(except) {
    except = except || "";
    if (except !== "howTheyGrow") closeHowTheyGrowSheet();
    if (except !== "cheer") closeCheerSheet();
    if (except !== "note") closeNoteSheet();
    if (except !== "broadcast") closeBroadcastSheet();
    if (except !== "teamPerson") closeTeamPersonSheet();
    if (except !== "teamMove") closeTeamMoveSheet();
    if (except !== "cal") closeCalSheet();
    if (except !== "lightbox") closeCuriosityLightbox();
    if (except !== "evResInvite") closeEvResInviteSheet();
  }

  function packEvergreen() {
    return !!(window.FS.Pack && window.FS.Pack.isEvergreen && window.FS.Pack.isEvergreen());
  }

  function canEditCalendar() {
    return !!(Cloud.canEditCalendar && Cloud.canEditCalendar());
  }

  function canCreateDownlineZoom() {
    return !!(Cloud.canCreateDownlineZoom && Cloud.canCreateDownlineZoom());
  }

  function canPeekLeaderTeamZooms() {
    return !!(packEvergreen() && Cloud.isSignedIn && Cloud.isSignedIn() &&
      Cloud.isSuperAdmin && Cloud.isSuperAdmin());
  }

  function leaderTeamZoomsOn() {
    var st = getState && getState();
    return !!(canPeekLeaderTeamZooms() && st && st.data && st.data.showLeaderTeamZooms);
  }

  function paintLeaderTeamZoomsToggle() {
    var wrap = $("calLeaderZooms");
    var btn = $("calLeaderZoomsBtn");
    if (!wrap || !btn) return;
    if (!canPeekLeaderTeamZooms()) {
      wrap.hidden = true;
      return;
    }
    var on = leaderTeamZoomsOn();
    wrap.hidden = false;
    wrap.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Hide leader team zooms" : "Show leader team zooms";
  }

  function canCreatePersonalEvent() {
    return !!(Cloud.isSignedIn && Cloud.isSignedIn() && Cloud.canCreatePersonalEvent && Cloud.canCreatePersonalEvent());
  }

  function canManageOrgEvent(ev) {
    return !!(Cloud.canManageOrgEvent && Cloud.canManageOrgEvent(ev));
  }

  function orgEventAudience(ev) {
    return (ev && ev.audience) || "org";
  }

  function canSeeEvergreenRoster() {
    return !!(Cloud.isSignedIn() && packEvergreen() &&
      ((Cloud.isSuperAdmin && Cloud.isSuperAdmin()) || (Cloud.isHubAdmin && Cloud.isHubAdmin())));
  }

  function canSeeEvergreenLeaderTree() {
    return !!(Cloud.isSignedIn() && packEvergreen() && Cloud.isOrgAdmin && Cloud.isOrgAdmin());
  }

  function isEvergreenLeaderOnly() {
    return !!(canSeeEvergreenLeaderTree() && !canSeeEvergreenRoster());
  }

  function orgEventCopy() {
    if (packEvergreen()) {
      return {
        gathering: "Team Zoom",
        gatheringShort: "Zoom",
        infoZoom: "Info Zoom",
        placeholder: "e.g. Thursday team zoom",
        hint: "Times show in each person’s local timezone. Team zooms and Info Zooms need a meeting link. Add the replay later anytime.",
        icsOrg: "Evergreen",
        icsFrom: "From First Seeds · Evergreen Co",
        icsProd: "-//First Seeds//Evergreen Co//EN",
        fileSafe: "team-event"
      };
    }
    return {
      gathering: "Grove Gathering",
      gatheringShort: "Grove",
      infoZoom: "Info Zoom",
      placeholder: "e.g. Thursday Grove Gathering",
      hint: "Times show in each person’s local timezone. Grove Gatherings and Info Zooms need a meeting link. Add the replay later anytime.",
      icsOrg: "The Fresh Grove",
      icsFrom: "From First Seeds · The Fresh Grove",
      icsProd: "-//First Seeds//Grove//EN",
      fileSafe: "grove-event"
    };
  }

  function daysBetween(a, b) {
    return Math.floor((b - a) / 864e5);
  }

  /* Whole local calendar days between two dates (0 = same day). */
  function calendarDaysBetween(a, b) {
    var a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((b0 - a0) / 864e5);
  }

  function progressCtx(row, cfg) {
    var done = (row.progress && row.progress.done) || {};
    var data = (row.progress && row.progress.data) || {};
    var cal = (row.progress && row.progress.calendar) || {};
    var sections = (window.FS.SECTIONS || []).filter(function (s) {
      var mode = row.profile.hub_mode || "full";
      return !s.modes || s.modes.indexOf(mode) > -1;
    });
    var sectionsDone = 0;
    sections.forEach(function (s) { if (done[s.id]) sectionsDone++; });
    var last = row.profile.last_active_at ? new Date(row.profile.last_active_at) : new Date(0);
    var joined = row.profile.created_at ? new Date(row.profile.created_at) : last;
    var now = new Date();
    var plan = Cal.plan(cfg, cal, data);
    var slice = Cal.weekSlice(plan, now, 0, weekStartPref(getState && getState()));
    var stats = Cal.weekStats(slice.days || []);
    var pre = new Date(now.getFullYear(), cfg.preRegDate.month - 1, cfg.preRegDate.day);
    if (pre < now) pre = new Date(now.getFullYear() + 1, cfg.preRegDate.month - 1, cfg.preRegDate.day);
    return {
      done: done,
      data: data,
      sectionsDone: sectionsDone,
      sectionTotal: sections.length || 4,
      daysSinceActive: Math.max(0, calendarDaysBetween(last, now)),
      daysSinceJoined: Math.max(0, calendarDaysBetween(joined, now)),
      weekPosted: stats.posted,
      daysToPreReg: Math.max(0, Math.ceil((pre - now) / 864e5)),
      active: (row.progress && row.progress.active) || "welcome",
      name: Cloud.personFirstName ? Cloud.personFirstName(row.profile) : (row.profile.display_name || "friend").split(/\s+/)[0]
    };
  }

  function pickFromList(list, ctx, fallback) {
    for (var i = 0; i < (list || []).length; i++) {
      try {
        if (list[i].match(ctx)) {
          return {
            id: list[i].id,
            when: list[i].when,
            body: list[i].body.replace(/\{name\}/g, ctx.name),
            tone: list[i].tone || "support"
          };
        }
      } catch (e) {}
    }
    return fallback;
  }

  /* Supportive by default. Real "nudge" copy only when they're in the nudge bucket. */
  function pickMentorMessage(ctx, bucket) {
    var cfg = window.FS.CONFIG || {};
    if (bucket === "nudge") {
      return pickFromList(cfg.nudges, ctx, {
        id: "default_nudge",
        when: "Gentle check-in",
        body: "Thinking of you, " + ctx.name + ". First Seeds will be right where you left it — one tiny step is enough. Here if you want company.",
        tone: "nudge"
      });
    }
    if (bucket === "ready") {
      return pickFromList(cfg.supports, ctx, {
        id: "ready_cheer",
        when: "Ready / blooming",
        body: "Look at you, " + ctx.name + ". You've done the quiet prep most people skip. Proud of you 🌳",
        tone: "support"
      });
    }
    return pickFromList(cfg.supports, ctx, {
      id: "default_support",
      when: "Supportive check-in",
      body: "Hey " + ctx.name + " — glad you're here. No rush. I'm around if you want a hand with anything in First Seeds 🌱",
      tone: "support"
    });
  }

  function bucketFor(ctx) {
    if (ctx.sectionsDone >= ctx.sectionTotal) return "ready";
    /* Only "needs a nudge" when truly quiet — not day-one or a few hours offline */
    if (ctx.daysSinceActive >= 7) return "nudge";
    if (ctx.sectionsDone === 0 && ctx.daysSinceJoined >= 5 && ctx.daysSinceActive >= 3) return "nudge";
    return "motion";
  }

  function renderAuthChrome() {
    var user = Cloud.user();
    var chip = $("accountChip");
    var syncLabel = $("syncLabel");
    if (chip) {
      if (user) {
        chip.hidden = false;
        chip.textContent = user.display_name || user.email || "Account";
      } else {
        chip.hidden = true;
      }
    }
    if (syncLabel) {
      if (typeof window.FS.paintSyncChrome === "function") {
        window.FS.paintSyncChrome();
      } else {
        syncLabel.textContent = user
          ? (Cloud.mode() === "supabase" ? "You're signed in — progress syncs." : "Signed in · local demo mode (this browser).")
          : "Answers save on this device. Sign in anytime to sync.";
      }
    }
    var youBlurb = $("settingsYouBlurb");
    var youAuth = $("settingsYouAuth");
    if (user) {
      if (youBlurb) youBlurb.textContent = user.email || "Signed in";
      if (youAuth) youAuth.textContent = "Sign out";
    } else {
      if (youBlurb) youBlurb.textContent = packEvergreen() ? "Name and account" : "Name, pace, and account";
      if (youAuth) youAuth.textContent = "Sign in →";
    }
    var inviteCue = document.querySelector(".team-invite-wrap");
    if (inviteCue) inviteCue.hidden = !user || packEvergreen();
    var inviteWrap = $("inviteBlock");
    if (inviteWrap) {
      inviteWrap.hidden = !user || packEvergreen();
      if (user) {
        var url = Cloud.joinUrl(user.invite_code);
        if (Cloud.hardenShareUrl) url = Cloud.hardenShareUrl(url) || url;
        ["railInviteInput", "authInviteInput"].forEach(function (id) {
          var input = $(id);
          if (input) input.value = url;
        });
      }
    }
    paintGroveBoardHeadActions();
  }

  function openAuth(forceAccount) {
    if (typeof window.FS.closeHubMenu === "function") {
      try { window.FS.closeHubMenu(); } catch (e) {}
    }
    var overlay = $("authOverlay");
    if (!overlay) return;
    var user = Cloud.user();
    var signPane = $("authSignPane");
    var acctPane = $("authAccountPane");
    var showAccount = !!(user && forceAccount);
    if (showAccount) {
      if (signPane) signPane.hidden = true;
      if (acctPane) acctPane.hidden = false;
      var nameEl = $("authDisplayName");
      if (nameEl) nameEl.textContent = user.display_name || "";
      var emailEl = $("authEmailLine");
      if (emailEl) emailEl.textContent = user.email || "";
      var modeEl = $("authModeLine");
      if (modeEl) {
        if (Cloud.mode() === "local") {
          modeEl.hidden = false;
          modeEl.textContent = "Local demo mode (this device only)";
        } else {
          modeEl.textContent = "";
          modeEl.hidden = true;
        }
      }
      var inv = $("authInviteInput");
      if (inv) {
        var authJoin = Cloud.joinUrl(user.invite_code);
        if (Cloud.hardenShareUrl) authJoin = Cloud.hardenShareUrl(authJoin) || authJoin;
        inv.value = authJoin;
      }
    } else {
      if (signPane) signPane.hidden = false;
      if (acctPane) acctPane.hidden = true;
      var msg = $("authMsg");
      if (msg) msg.textContent = "";
      var authName = $("authName");
      if (authName && getState) {
        var st = getState();
        if (st && st.settings && st.settings.partnerName && !authName.value) {
          authName.value = st.settings.partnerName;
        }
      }
      var authLast = $("authLastName");
      var authLastField = $("authLastNameField");
      if (authLast && getState) {
        var st2 = getState();
        if (st2 && st2.settings && st2.settings.partnerLastName && !authLast.value) {
          authLast.value = st2.settings.partnerLastName;
        }
      }
      /* Last name is for Create account — hide on plain Sign in */
      if (authLastField) authLastField.hidden = true;
      var authEmail = $("authEmail");
      if (authEmail && !authEmail.value && Cloud.lastEmail) {
        authEmail.value = Cloud.lastEmail() || "";
      }
      if (window.FS._authReset) window.FS._authReset.paint();
    }
    overlay.classList.add("open");
    document.body.classList.add("overlay-open");
    armSheetDismiss();
  }

  function closeAuth() {
    var overlay = $("authOverlay");
    if (overlay) overlay.classList.remove("open");
    if (typeof window.FS.syncOverlayBodyLock === "function") {
      window.FS.syncOverlayBodyLock();
    } else {
      if (!$("onboarding") || !$("onboarding").classList.contains("open")) {
        if (!$("tour") || !$("tour").classList.contains("open")) {
          document.body.classList.remove("overlay-open");
        }
      }
    }
  }

  async function renderCheers() {
    var banner = $("cheerBanner");
    if (!banner || !Cloud.isSignedIn() || packEvergreen()) {
      if (banner) banner.hidden = true;
      return;
    }
    var cheers = await Cloud.unreadCheers();
    if (!cheers.length) {
      banner.hidden = true;
      return;
    }
    var c = cheers[0];
    var more = cheers.length > 1 ? ' <span class="cheer-more">+' + (cheers.length - 1) + " more</span>" : "";
    banner.hidden = false;
    banner.innerHTML = '<div class="cheer-copy"><div class="cheer-tag">CHEER FROM YOUR LEADER' + more +
      '</div><div class="cheer-body">' + esc(c.body || "") +
      '</div></div><button type="button" class="cheer-dismiss" id="cheerDismiss">Got it</button>';
  }

  async function renderSupportBanner() {
    var notes = document.querySelectorAll("[data-support-note]");
    if (!notes.length) return;
    var hideNotes = function () {
      for (var h = 0; h < notes.length; h++) notes[h].hidden = true;
    };
    if (!Cloud.isSignedIn()) {
      hideNotes();
      return;
    }
    if (packEvergreen()) {
      hideNotes();
      return;
    }
    var me = Cloud.user && Cloud.user();
    if (me && personIsEvergreenOrg(me)) {
      hideNotes();
      return;
    }
    var ctx = null;
    try {
      ctx = await Cloud.mySupportContext();
    } catch (e) {
      var lineErr = "Couldn’t load who invited you. Check your connection and try again in a moment.";
      for (var he = 0; he < notes.length; he++) {
        notes[he].hidden = false;
        notes[he].innerHTML = '<p class="support-note-line">' + lineErr + "</p>";
      }
      return;
    }
    if (!ctx || (!ctx.invited_by_name && !ctx.sponsor_name)) {
      /* Top-of-tree leaders (org / super admin) intentionally have no sponsor. */
      if (Cloud.isOrgAdmin && Cloud.isOrgAdmin()) {
        hideNotes();
        return;
      }
      if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
        hideNotes();
        return;
      }
      /* Signed in but no sponsor — usually means they skipped the join link
         (or lost it on the Safari → Home Screen hop). */
      var pending = Cloud.pendingJoinCode && Cloud.pendingJoinCode();
      var lineMissing = pending
        ? "Almost linked — finish signing in so your leader can see you on their team."
        : "You’re in First Seeds, but not on a leader’s team yet. Open <strong>their join link</strong> (while signed in with this same account) so you show up on their tree.";
      for (var m = 0; m < notes.length; m++) {
        notes[m].hidden = false;
        notes[m].innerHTML = '<p class="support-note-line">' + lineMissing + "</p>";
      }
      return;
    }
    var inviter = (ctx.invited_by_name || "").trim();
    var sponsor = (ctx.sponsor_name || "").trim();
    var line = "";
    if (inviter && sponsor && ctx.invited_by_id && ctx.sponsor_id && ctx.invited_by_id === ctx.sponsor_id) {
      line = "<strong>" + esc(inviter) + "</strong> invited you to First Seeds — they’re here to help support you.";
    } else if (inviter && sponsor) {
      line = "<strong>" + esc(inviter) + "</strong> invited you to First Seeds. <strong>" +
        esc(sponsor) + "</strong> is here to help support you.";
    } else if (sponsor) {
      line = "<strong>" + esc(sponsor) + "</strong> is here to help support you.";
    } else {
      line = "<strong>" + esc(inviter) + "</strong> invited you to First Seeds.";
    }
    for (var n = 0; n < notes.length; n++) {
      notes[n].hidden = false;
      notes[n].innerHTML = '<p class="support-note-line">' + line + "</p>";
    }
  }

  function formatOutreachWhen(iso) {
    if (!iso) return "";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      var days = daysBetween(d, new Date());
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      if (days < 7) return days + "d ago";
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  }

  function outreachKindLabel(kind) {
    if (kind === "note") return "Note";
    if (kind === "nudge") return "Nudge";
    return "Cheer";
  }

  function mergeOutreachLists(remoteList, localList) {
    var out = [];
    var seen = {};
    function add(item) {
      if (!item || !(item.body || "").trim()) return;
      var key = (item.kind || "cheer") + "|" + String(item.body || "").trim() + "|" + String(item.at || "").slice(0, 16);
      if (seen[key]) return;
      seen[key] = true;
      out.push({
        kind: item.kind || "cheer",
        body: item.body || "",
        at: item.at || ""
      });
    }
    (localList || []).forEach(add);
    (remoteList || []).forEach(add);
    out.sort(function (a, b) {
      return String(b.at || "").localeCompare(String(a.at || ""));
    });
    return out.slice(0, 20);
  }

  function appendOutreachLog(partnerId, kind, body) {
    if (!getState || !partnerId || !(body || "").trim()) return;
    var st = getState();
    if (!st.data.outreachLog) st.data.outreachLog = {};
    if (!st.data.outreachLog[partnerId]) st.data.outreachLog[partnerId] = [];
    st.data.outreachLog[partnerId].unshift({
      kind: kind,
      body: body,
      at: new Date().toISOString()
    });
    st.data.outreachLog[partnerId] = st.data.outreachLog[partnerId].slice(0, 30);
    if (!st.data.leaderLogOpen) st.data.leaderLogOpen = {};
    st.data.leaderLogOpen[partnerId] = true;
    persist();
  }

  function outreachLogHtml(partnerId, items) {
    if (!(items || []).length) return "";
    var st = getState ? getState() : null;
    var open = !!(st && st.data.leaderLogOpen && st.data.leaderLogOpen[partnerId]);
    var latest = items[0];
    var summary = outreachKindLabel(latest.kind).toLowerCase() +
      (latest.at ? " · " + formatOutreachWhen(latest.at) : "");
    var html = '<div class="leader-log">';
    html += '<button type="button" class="leader-log-toggle" data-leader-log="' + esc(partnerId) + '" aria-expanded="' + (open ? "true" : "false") + '">';
    html += '<span class="leader-log-toggle-main">Messages sent <span class="leader-log-count">' + items.length + "</span></span>";
    html += '<span class="leader-log-toggle-sub">Last ' + esc(summary) + "</span>";
    html += '<span class="leader-log-chev" aria-hidden="true">' + (open ? "▴" : "▾") + "</span>";
    html += "</button>";
    html += '<div class="leader-log-panel"' + (open ? "" : " hidden") + '>';
    items.forEach(function (it) {
      html += '<div class="leader-log-item is-' + esc(it.kind || "cheer") + '">';
      html += '<div class="leader-log-meta"><span class="leader-log-kind">' + esc(outreachKindLabel(it.kind)) +
        '</span><span class="leader-log-when">' + esc(formatOutreachWhen(it.at)) + "</span></div>";
      html += '<p class="leader-log-body">' + esc(it.body) + "</p>";
      html += "</div>";
    });
    html += "</div></div>";
    return html;
  }

  function supportSnapshotChips(answers) {
    var a = answers || {};
    var chips = [];
    function push(value) {
      if (!value || chips.indexOf(value) >= 0) return;
      chips.push(value);
    }
    push(a.learning_style);
    push(a.question_style);
    push(a.accountability);
    push(a.support_frequency);
    if (Array.isArray(a.contact_channels) && a.contact_channels.length) push(a.contact_channels[0]);
    if (Array.isArray(a.encouragement) && a.encouragement.length) push(a.encouragement[0]);
    else push(a.encouragement);
    return chips.slice(0, 6);
  }

  function supportSnapshotHtml(partnerId, support) {
    if (!support || !support.completed_at) {
      return '<div class="how-grow-snapshot is-empty">' +
        '<div><strong>How they grow</strong><span>Not filled out yet</span></div>' +
        "</div>";
    }
    var chips = supportSnapshotChips(support.answers);
    var html = '<div class="how-grow-snapshot">';
    html += '<button type="button" class="how-grow-snapshot-btn" data-how-they-grow="' + esc(partnerId) + '">See how they grow →</button>';
    if (chips.length) {
      html += '<p class="how-grow-snapshot-label">Support snapshot:</p>';
      html += '<div class="how-grow-snapshot-chips">';
      chips.forEach(function (chip) { html += "<span>" + esc(chip) + "</span>"; });
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  function supportAnswerRankLabel(index) {
    var n = index + 1;
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return n + "th";
  }

  function formatSupportAnswerValue(value, ranked) {
    if (typeof value === "string" && value) value = [value];
    if (!value || (Array.isArray(value) && !value.length)) return "";
    if (!Array.isArray(value)) return String(value);
    if (ranked && value.length > 1) {
      return value.map(function (item, i) {
        return supportAnswerRankLabel(i) + " " + item;
      }).join(" · ");
    }
    return value.join(" · ");
  }

  function supportAnswerRow(label, value, ranked) {
    var shown = formatSupportAnswerValue(value, ranked);
    if (!shown) return "";
    return '<div class="how-they-grow-row"><dt>' + esc(label) + "</dt><dd>" + esc(shown) + "</dd></div>";
  }

  function formatHowGrowContact(a) {
    a = a || {};
    var bits = [];
    var channels = Array.isArray(a.contact_channels) ? a.contact_channels.filter(Boolean) : [];
    if (channels.length) bits.push(channels.join(" · "));
    if (a.contact_phone) bits.push(String(a.contact_phone).trim());
    if (a.contact_email) bits.push(String(a.contact_email).trim());
    var ig = String(a.contact_instagram || "").replace(/^@+/, "").trim();
    if (ig) bits.push("@" + ig);
    if (a.contact_social_other) bits.push(String(a.contact_social_other).trim());
    return bits.join(" · ");
  }

  async function hydrateHowIGrowForIds(ids) {
    ids = (ids || []).filter(Boolean);
    if (!ids.length || !Cloud.listHowIGrowForPartners) return;
    var rows = [];
    try {
      rows = await Cloud.listHowIGrowForPartners(ids);
    } catch (e) {
      return;
    }
    var byId = {};
    (rows || []).forEach(function (row) {
      if (row && row.partner_id) byId[row.partner_id] = row;
    });
    ids.forEach(function (id) {
      var row = byId[id];
      if (!row || !row.allowed) return;
      var person = teamPersonCache[id] || {};
      supportProfileByPartner[id] = {
        name: personLabel(person),
        support: row.support || null,
        allowed: true
      };
    });
  }

  function rememberHowIGrowFromDownline(rows) {
    (rows || []).forEach(function (item) {
      var p = item && item.profile;
      if (!p || !p.id) return;
      supportProfileByPartner[p.id] = {
        name: personLabel(p),
        support: item.support_preferences || null,
        allowed: true
      };
    });
  }

  function openHowTheyGrowSheet(partnerId) {
    var record = supportProfileByPartner[partnerId];
    if (!record || !record.support || !record.support.completed_at) return;
    var a = record.support.answers || {};
    var sheet = $("howTheyGrowSheet");
    var name = $("howTheyGrowName");
    var body = $("howTheyGrowBody");
    if (!sheet || !name || !body) return;
    closeAllSheets("howTheyGrow");
    fillPhotoSlot($("howTheyGrowPhoto"), teamPersonCache[partnerId] || { display_name: record.name }, "lg");
    name.textContent = record.name || "Partner";
    var recognitionAliases = {
      "Public celebration": "I love being celebrated publicly",
      "Small group recognition": "A small group is perfect",
      "Private recognition": "A private message means more",
      "No spotlight": "Please don’t put me in the spotlight"
    };
    var recognition = a.recognition;
    if (typeof recognition === "string" && recognition) recognition = [recognition];
    if (Array.isArray(recognition)) {
      recognition = recognition.map(function (item) { return recognitionAliases[item] || item; });
    }
    var surprises = a.surprises;
    if (typeof surprises === "string" && surprises) surprises = [surprises];
    if (!Array.isArray(surprises)) surprises = [];
    var surpriseOther = (a.surprise_other || "").trim();
    var surpriseShown = formatSupportAnswerValue(surprises, true);
    if (surpriseOther) {
      surpriseShown = surpriseShown
        ? surpriseShown + " · Also: " + surpriseOther
        : surpriseOther;
    }
    var html = '<div class="how-they-grow-summary"><dl>';
    html += supportAnswerRow("How they prefer to hear from you", formatHowGrowContact(a));
    html += supportAnswerRow("When you’re learning something new, you prefer…", a.learning_style);
    html += supportAnswerRow("If you have a question, you’re most likely to…", a.question_style);
    html += supportAnswerRow("When you’re struggling, what’s the most helpful thing a leader can do?", a.struggling_support);
    html += supportAnswerRow("What kind of accountability helps you most?", a.accountability);
    html += supportAnswerRow("How often would you like support?", a.support_frequency);
    html += supportAnswerRow("What kind of encouragement lands?", a.encouragement, true);
    html += supportAnswerRow("How do you feel about recognition?", recognition, true);
    if (surpriseShown) {
      html += '<div class="how-they-grow-row"><dt>' + esc("If we surprised you one day, what would make your heart happiest?") +
        "</dt><dd>" + esc(surpriseShown) + "</dd></div>";
    }
    html += supportAnswerRow("One year from now, what would make you say, “I’m so glad I did this”?", a.one_year_vision);
    html += supportAnswerRow("What’s one thing we should know that would help us be better leaders for you?", a.leader_note);
    html += "</dl></div>";
    var joys = a.little_joys || {};
    var joyRows = [
      ["Favorite snack", joys.snack], ["Favorite drink", joys.drink], ["Birthday", joys.birthday],
      ["Favorite color", joys.color], ["Favorite hobby", joys.hobby], ["Favorite place traveled", joys.travel],
      ["Dogs, cats… or chickens?", joys.pets], ["Anything else we should know?", joys.anything_else]
    ];
    var joysHtml = "";
    joyRows.forEach(function (row) { joysHtml += supportAnswerRow(row[0], row[1]); });
    if (joysHtml) {
      html += '<details class="how-they-grow-joys"><summary>Little joys <span>open when you need a thoughtful idea</span></summary><dl>' + joysHtml + "</dl></details>";
    }
    body.innerHTML = html;
    sheet.hidden = false;
    armSheetDismiss();
  }

  function closeHowTheyGrowSheet() {
    var sheet = $("howTheyGrowSheet");
    if (sheet) sheet.hidden = true;
  }

  async function renderLeader() {
    var run = ++leaderRun;
    var root = $("leaderLists");
    var overview = $("leaderOverview");
    var dream = $("dreamTreeCard");
    if (dream) dream.hidden = false;
    try {
      if (window.FS && window.FS.tree && window.FS.tree.render && getState) {
        window.FS.tree.render(getState());
      }
    } catch (e) {}
    if (!root) return;
    if (teamTreeGrowDemoOn()) {
      showTeamTreeGrowDemo();
      return;
    }
    if (!Cloud.isSignedIn()) {
      endTeamPageGrowing($("liveTeamGraph"));
      root.innerHTML = '<p class="body-p">Sign in to see people who joined with your link — and their real First Seeds progress.</p>';
      if (overview) overview.hidden = true;
      paintTeamBadge(0);
      hideGroveLeadersRoster();
      hideGroveUpline();
      hideTeamPoll();
      return;
    }
    beginTeamPageGrowing(true);
    await renderGroveUpline();
    if (run !== leaderRun) return;
    var treeEl = $("liveTeamGraph");
    if (treeEl && !teamTreeHasPaintedTree(treeEl)) paintTeamTreeGrowing(treeEl, true);
    var cfg = window.FS.CONFIG;
    var rows = [];
    var graph = { roots: [], depth: 6 };
    var downlineOk = false;
    var graphOk = false;
    var grovePack = await Promise.all([
      Cloud.listDownline().then(function (r) { downlineOk = true; return r; }).catch(function () {
        return (lastLeaderSnap && lastLeaderSnap.rows) || [];
      }),
      Cloud.listTeamGraph().then(function (g) { graphOk = true; return g; }).catch(function () {
        return (lastLeaderSnap && lastLeaderSnap.graph) || { roots: [], depth: 6 };
      })
    ]);
    if (run !== leaderRun) return;
    rows = grovePack[0] || [];
    graph = grovePack[1] || { roots: [], depth: 6 };
    if (run !== leaderRun) return;
    if (downlineOk || graphOk) {
      lastLeaderSnap = {
        rows: downlineOk ? rows : ((lastLeaderSnap && lastLeaderSnap.rows) || rows),
        graph: graphOk ? graph : ((lastLeaderSnap && lastLeaderSnap.graph) || graph)
      };
    }
    if (!downlineOk && !graphOk) {
      if (window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast(lastLeaderSnap
          ? "Couldn’t refresh the team — showing what we had."
          : "Couldn’t load the team just now. Try again in a moment.", { tone: "bad" });
      }
      if (!lastLeaderSnap) {
        endTeamPageGrowing(treeEl);
        root.innerHTML = '<p class="body-p">Couldn’t load the team just now. Check your connection and try again.</p>';
        if (overview) overview.hidden = true;
        paintTeamBadge(0);
        hideGroveLeadersRoster();
        hideTeamPoll();
        return;
      }
    }
    /* Safety: L1 downline always appears on the tree, even if team_graph lags/fails */
    graph = ensureGraphIncludesDownline(graph, rows);
    var underById = {};
    suggestedNotesByPartner = {};
    supportProfileByPartner = {};
    function countDesc(nodes) {
      var n = 0;
      (nodes || []).forEach(function (p) {
        n += 1 + countDesc(p.children);
      });
      return n;
    }
    (graph.roots || []).forEach(function (p) {
      underById[p.id] = countDesc(p.children);
    });
    if (!rows.length && !(graph.roots || []).length) {
      root.innerHTML = '<p class="body-p">Nobody\'s linked yet. Share your join link — when they sign in, they show up here with live progress.</p>';
      var emptyFlat = flattenTeamGraph(graph.roots);
      var emptyPlace = buildTeamPlacementMap(graph.roots);
      renderLeaderOverview([], unseenTeamJoinRows(emptyFlat), [], emptyPlace);
      await renderLiveTeamGraph(graph, rows);
      if (run !== leaderRun) return;
      await renderTeamPolls();
      if (run !== leaderRun) return;
      await renderGroveLeadersRoster();
      if (run !== leaderRun) return;
      queueTeamNewsAck(emptyFlat, rows);
      paintTeamBadge(0);
      return;
    }
    var treeFlat = flattenTeamGraph(graph.roots);
    var placementMap = buildTeamPlacementMap(graph.roots);
    var newJoinRows = unseenTeamJoinRows(treeFlat);
    var newSupportRows = unseenSupportRows(rows);
    var partnerIds = rows.map(function (r) { return r.profile.id; });
    var remoteOutreach = {};
    try {
      remoteOutreach = await Cloud.listOutreachMap(partnerIds);
    } catch (e) {
      remoteOutreach = {};
    }
    if (run !== leaderRun) return;
    var localLog = (getState && getState().data && getState().data.outreachLog) || {};
    var outreachById = {};
    partnerIds.forEach(function (id) {
      outreachById[id] = mergeOutreachLists(remoteOutreach[id] || [], localLog[id] || []);
    });
    var now = new Date();
    var buckets = { nudge: [], motion: [], ready: [] };
    var mentorMarked = false;
    rows.forEach(function (row) {
      var ctx = progressCtx(row, cfg);
      var under = underById[row.profile.id] || 0;
      var b = bucketFor(ctx);
        supportProfileByPartner[row.profile.id] = {
          name: personLabel(row.profile),
          support: row.support_preferences || null
        };
      buckets[b].push({ row: row, ctx: ctx, nudge: pickMentorMessage(ctx, b), under: under, bucket: b });
    });
    renderLeaderOverview(rows, newJoinRows, newSupportRows, placementMap);
    function sortByUnder(a, b) {
      if (b.under !== a.under) return b.under - a.under;
      return String(b.row.profile.last_active_at || "").localeCompare(String(a.row.profile.last_active_at || ""));
    }
    buckets.nudge.sort(sortByUnder);
    buckets.motion.sort(sortByUnder);
    buckets.ready.sort(sortByUnder);

    function col(kind, title, items) {
      if (!items.length) return "";
      var stCol = getState ? getState() : null;
      if (stCol && !stCol.data.leaderColOpen) stCol.data.leaderColOpen = {};
      if (stCol && !stCol.data.leaderCardOpen) stCol.data.leaderCardOpen = {};
      /* Sections default open; remember if user collapses one */
      var colOpen = !(stCol && stCol.data.leaderColOpen[kind] === false);
      var html = '<details class="leader-col is-' + kind + '"' + (colOpen ? " open" : "") + ' data-leader-col="' + kind + '">';
      html += '<summary class="leader-col-title">';
      html += '<span class="leader-col-title-main">' + esc(title) + '</span>';
      html += '<span class="leader-col-count">' + items.length + "</span>";
      html += '<span class="leader-col-chev" aria-hidden="true"></span>';
      html += "</summary>";
      html += '<div class="leader-col-body">';
      items.forEach(function (item) {
        var p = item.row.profile;
        var ctx = item.ctx;
        var modeLabel = hubModeLabel(p.hub_mode);
        var pct = Math.round((ctx.sectionsDone / Math.max(1, ctx.sectionTotal)) * 100);
        var isMentorDemo = !mentorMarked;
        mentorMarked = true;
        var cardPref = stCol && stCol.data.leaderCardOpen ? stCol.data.leaderCardOpen[p.id] : undefined;
        /* First card defaults open for tour; honor explicit close/open after that */
        var cardOpen = cardPref === true || (cardPref == null && isMentorDemo);
        html += '<details class="leader-card" data-partner="' + esc(p.id) + '" data-leader-card="' + esc(p.id) + '"' +
          (cardOpen ? " open" : "") + ">";
        html += '<summary class="leader-card-sum">';
        html += '<div class="leader-card-head">';
        html += '<div class="leader-card-name">' + esc(personLabel(p)) + '</div>';
        if (item.under > 0) {
          html += '<span class="leader-under-chip">' + item.under + " under</span>";
        }
        html += '<span class="leader-card-chev" aria-hidden="true"></span>';
        html += "</div>";
        html += '<div class="leader-card-meta">' +
          (p.hub_mode === "starter" ? esc(modeLabel) + " · " : "") +
          "last active " +
          (ctx.daysSinceActive === 0 ? "today" : ctx.daysSinceActive + "d ago") + "</div>";
        html += '<div class="leader-progress-row"><div class="leader-progress" aria-hidden="true"><span style="width:' +
          pct + '%"></span></div><span class="leader-progress-label">' + ctx.sectionsDone + '/' + ctx.sectionTotal + '</span></div>';
        html += "</summary>";
        html += '<div class="leader-card-body">';
        var msg = item.nudge || {};
        suggestedNotesByPartner[p.id] = {
          body: msg.body || "",
          name: personLabel(p),
          when: msg.when || "Check-in"
        };
        if (item.row.progress && item.row.progress.notified_at) {
          var pingAge = daysBetween(new Date(item.row.progress.notified_at), now);
          if (pingAge <= 3) {
            html += '<div class="leader-ping">Pinged you ' + (pingAge === 0 ? "today" : pingAge + "d ago") + '</div>';
          }
        }
        html += supportSnapshotHtml(p.id, item.row.support_preferences);
        html += outreachLogHtml(p.id, outreachById[p.id] || []);
        if (canSendCheerNote()) {
          html += '<div class="leader-card-actions"' + (isMentorDemo ? ' data-team-tour="mentor"' : "") + '>';
          html += '<button type="button" class="btn-ghost leader-action-btn" data-cheer="' + esc(p.id) + '"' +
            (isMentorDemo ? ' data-team-tour="cheer"' : "") + '>Send cheer</button>';
          html += '<button type="button" class="btn-ghost leader-action-btn" data-note="' + esc(p.id) + '"' +
            (isMentorDemo ? ' data-team-tour="note"' : "") + '>Leave note</button>';
          html += '</div>';
        }
        html += '</div></details>';
      });
      html += "</div></details>";
      return html;
    }
    var colsHtml =
      col("nudge", "Needs a nudge", buckets.nudge) +
      col("motion", "In motion", buckets.motion) +
      col("ready", "Ready / blooming", buckets.ready);
    var colCount = (buckets.nudge.length ? 1 : 0) + (buckets.motion.length ? 1 : 0) + (buckets.ready.length ? 1 : 0);
    root.className = "leader-board cols-" + Math.max(1, colCount);
    root.innerHTML = '<div class="leader-board-kicker">MENTORING</div>' + (colsHtml || '<p class="leader-empty">Everyone\'s settled for now.</p>');
    await renderLiveTeamGraph(graph, rows);
    if (run !== leaderRun) return;
    await renderTeamPolls();
    if (run !== leaderRun) return;
    await renderGroveLeadersRoster();
    if (run !== leaderRun) return;
    queueTeamNewsAck(treeFlat, rows);
    paintTeamBadge(0);
    if (typeof window.FS.maybeStartTeamTour === "function") {
      window.FS.maybeStartTeamTour(rows.length);
    }
  }

  function countTreeDesc(nodes) {
    var n = 0;
    (nodes || []).forEach(function (p) { n += 1 + countTreeDesc(p.children); });
    return n;
  }

  /* Annotate each node with._under (descendant count) in one pass — used for sort + chips. */
  function annotateTeamUnder(nodes) {
    var total = 0;
    (nodes || []).forEach(function (p) {
      var childTotal = annotateTeamUnder(p.children);
      p._under = childTotal;
      total += 1 + childTotal;
    });
    return total;
  }

  function maxTeamDepth(nodes) {
    var max = 0;
    function walk(list, depth) {
      (list || []).forEach(function (p) {
        if (depth > max) max = depth;
        walk(p.children, depth + 1);
      });
    }
    walk(nodes, 1);
    return max;
  }

  function teamSortMode() {
    var st = getState ? getState() : null;
    var mode = st && st.data && st.data.teamSort;
    return mode === "newest" ? "newest" : "legs";
  }

  function setTeamSortMode(mode) {
    if (!getState) return;
    var st = getState();
    if (!st.data) st.data = {};
    st.data.teamSort = mode === "newest" ? "newest" : "legs";
    persist();
  }

  function sortTeamNodes(nodes, mode) {
    mode = mode || teamSortMode();
    annotateTeamUnder(nodes);
    function sortLevel(list) {
      (list || []).forEach(function (p) {
        if (p.children && p.children.length) sortLevel(p.children);
      });
      (list || []).sort(function (a, b) {
        if (mode === "newest") {
          return String(b.created_at || "").localeCompare(String(a.created_at || ""));
        }
        /* Most legs first; among equals, older joins stay above brand-new ones */
        var ub = b._under || 0;
        var ua = a._under || 0;
        if (ub !== ua) return ub - ua;
        return String(a.created_at || "").localeCompare(String(b.created_at || ""));
      });
    }
    sortLevel(nodes);
    return nodes;
  }

  /* Keep old name for any callers */
  function sortNodesByUnder(nodes) {
    return sortTeamNodes(nodes, "legs");
  }

  function hubModeLabel(hubMode) {
    var modes = (window.FS.CONFIG && window.FS.CONFIG.modes) || {};
    if (hubMode === "starter") return (modes.starter && modes.starter.label) || "Soft start";
    if (hubMode === "full") return (modes.full && modes.full.label) || "All in";
    return "—";
  }

  function hubModeChipHtml(hubMode) {
    /* Only flag Soft start — All in is the assumed default */
    if (hubMode === "starter") {
      return '<span class="team-mode-chip is-starter">' + esc(hubModeLabel("starter")) + "</span>";
    }
    return "";
  }

  function formatJoinedOn(iso) {
    if (!iso) return "—";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return "—";
    }
  }

  function ensureTeamSeenMap() {
    if (!getState) return {};
    var st = getState();
    if (!st.data) st.data = {};
    if (!st.data.teamSeenIds || typeof st.data.teamSeenIds !== "object") {
      st.data.teamSeenIds = {};
    }
    return st.data.teamSeenIds;
  }

  var TEAM_NEW_MS = 14 * 24 * 60 * 60 * 1000;
  var teamNewThisVisit = {};

  function personIsTeamNew(p) {
    if (!p || !p.id) return false;
    if (teamNewThisVisit[p.id]) return true;
    var st = getState ? getState() : null;
    if (!(st && st.data && st.data.teamSeenSeeded)) return false;
    return !ensureTeamSeenMap()[p.id];
  }

  function rememberNewForThisVisit(rows) {
    (rows || []).forEach(function (row) {
      var p = row && row.profile ? row.profile : row;
      if (!p || !p.id) return;
      if (!ensureTeamSeenMap()[p.id]) teamNewThisVisit[p.id] = true;
    });
  }

  /* Flat list of everyone on the live tree (all depths), shaped like downline rows. */
  function flattenTeamGraph(roots) {
    var out = [];
    function walk(nodes) {
      (nodes || []).forEach(function (p) {
        if (!p || !p.id) return;
        out.push({ profile: p });
        walk(p.children);
      });
    }
    walk(roots);
    return out;
  }

  /* parentId + L1 leg for each person — used for “under X / in Y’s leg under Z”. */
  function buildTeamPlacementMap(roots) {
    var map = {};
    function walk(nodes, parentId, legId) {
      (nodes || []).forEach(function (p) {
        if (!p || !p.id) return;
        var thisLeg = legId || p.id;
        map[p.id] = { profile: p, parentId: parentId || null, legId: thisLeg };
        walk(p.children, p.id, thisLeg);
      });
    }
    walk(roots, null, null);
    return map;
  }

  function joinPlacementBlurb(placementMap, personId) {
    var map = placementMap || {};
    var m = map[personId];
    if (!m || !m.parentId) return "joined under you";
    var parent = map[m.parentId];
    var parentName = parent ? personLabel(parent.profile) : "someone";
    if (m.legId === m.parentId) return "under " + parentName;
    var leg = map[m.legId];
    var legName = leg ? personLabel(leg.profile) : "someone";
    return "in " + legName + "’s leg · under " + parentName;
  }

  /* If listDownline has someone team_graph missed, plant them as Level 1 so they aren't invisible. */
  function ensureGraphIncludesDownline(graph, rows) {
    var g = graph || { roots: [], depth: 6 };
    if (!g.roots) g.roots = [];
    var inGraph = {};
    function walk(nodes) {
      (nodes || []).forEach(function (p) {
        if (!p || !p.id) return;
        inGraph[p.id] = true;
        walk(p.children);
      });
    }
    walk(g.roots);
    (rows || []).forEach(function (row) {
      var p = row && row.profile;
      if (!p || !p.id || inGraph[p.id]) return;
      g.roots.push({
        id: p.id,
        display_name: p.display_name,
        last_name: p.last_name || "",
        email: p.email,
        hub_mode: p.hub_mode,
        last_active_at: p.last_active_at,
        created_at: p.created_at,
        is_org_admin: !!p.is_org_admin,
        org_id: p.org_id || null,
        sponsor_id: p.sponsor_id || (Cloud.user() && Cloud.user().id) || null,
        children: []
      });
      inGraph[p.id] = true;
    });
    return g;
  }

  /* One-time: older L1-only seen map → full tree. Keep recent unseen joins. */
  function migrateTeamSeenToFullTree(rows) {
    if (!getState) return;
    var st = getState();
    if (!st.data) st.data = {};
    if (st.data.teamSeenTreeVer >= 2) return;
    var seen = ensureTeamSeenMap();
    var cutoff = Date.now() - TEAM_NEW_MS;
    (rows || []).forEach(function (row) {
      var p = row && row.profile;
      if (!p || !p.id || seen[p.id]) return;
      var t = p.created_at ? Date.parse(p.created_at) : 0;
      if (!t || t < cutoff) seen[p.id] = true;
    });
    st.data.teamSeenTreeVer = 2;
    if (persist) persist({ immediate: true });
  }

  function unseenTeamJoinRows(rows) {
    migrateTeamSeenToFullTree(rows);
    var seen = ensureTeamSeenMap();
    var st = getState ? getState() : null;
    if (!(st && st.data.teamSeenSeeded)) return [];
    return (rows || []).filter(function (row) {
      var p = row && row.profile;
      return p && p.id && !seen[p.id];
    });
  }

  function countUnseenTeamJoins(rows) {
    migrateTeamSeenToFullTree(rows);
    var seen = ensureTeamSeenMap();
    var st = getState ? getState() : null;
    var seeded = !!(st && st.data.teamSeenSeeded);
    if (!seeded) {
      (rows || []).forEach(function (row) {
        if (row && row.profile && row.profile.id) seen[row.profile.id] = true;
      });
      if (st) {
        st.data.teamSeenSeeded = true;
        st.data.teamSeenTreeVer = 2;
        persist({ immediate: true });
      }
      return 0;
    }
    return unseenTeamJoinRows(rows).length;
  }

  function markTeamJoinsSeen(rows) {
    var seen = ensureTeamSeenMap();
    (rows || []).forEach(function (row) {
      if (row && row.profile && row.profile.id) seen[row.profile.id] = true;
    });
    if (getState) {
      getState().data.teamSeenSeeded = true;
      persist({ immediate: true });
    }
  }

  function personLabel(person) {
    return (Cloud.formatPersonName && Cloud.formatPersonName(person)) ||
      (person && (person.display_name || person.email)) ||
      "Partner";
  }

  function grovePhotosOn() {
    return !packEvergreen();
  }

  function personInitial(person) {
    var name = (Cloud.personFirstName && Cloud.personFirstName(person)) ||
      (person && person.display_name) || "";
    var ch = String(name).trim().charAt(0);
    return ch ? ch.toUpperCase() : "•";
  }

  function copyPhotoFields(from, onto) {
    if (!from || !onto) return;
    if (from.photo_at) onto.photo_at = from.photo_at;
    if (from.photo_ext) onto.photo_ext = from.photo_ext;
  }

  function personPhotoHtml(person, size) {
    if (!grovePhotosOn() || !person) return "";
    var sizeClass = size === "lg" ? " is-lg" : (size === "sm" ? " is-sm" : "");
    var url = Cloud.grovePhotoUrl ? Cloud.grovePhotoUrl(person, size === "lg" ? "full" : "thumb") : "";
    if (url) {
      return '<span class="person-photo' + sizeClass + '"><img src="' + esc(url) +
        '" alt="" width="64" height="64" decoding="async"></span>';
    }
    return '<span class="person-photo is-letter' + sizeClass + '" aria-hidden="true">' +
      esc(personInitial(person)) + "</span>";
  }

  function fillPhotoSlot(el, person, size) {
    if (!el) return;
    if (!grovePhotosOn() || !person) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    el.hidden = false;
    el.innerHTML = personPhotoHtml(person, size || "lg");
  }

  function groveOrgId() {
    return (window.FS.PACK_IDS && window.FS.PACK_IDS["fresh-grove"]) ||
      "a0000000-0000-4000-8000-000000000002";
  }

  function evergreenOrgId() {
    return (window.FS.PACK_IDS && window.FS.PACK_IDS["evergreen-co"]) ||
      "a0000000-0000-4000-8000-000000000001";
  }

  function personOrgId(p) {
    if (!p) return "";
    if (p.org_id) return p.org_id;
    var cached = teamPersonCache[p.id];
    if (cached && cached.org_id) return cached.org_id;
    var found = "";
    (adminProfileCache || []).forEach(function (row) {
      if (row && row.id === p.id && row.org_id) found = row.org_id;
    });
    return found;
  }

  function personIsEvergreenOrg(p) {
    var org = personOrgId(p);
    if (org) return org === evergreenOrgId();
    return !!(p && (p.org_slug === "evergreen-co"));
  }

  function personIsFreshGroveOrg(p) {
    if (personIsEvergreenOrg(p)) return false;
    var org = personOrgId(p);
    if (org) return org === groveOrgId();
    if (p && p.org_slug) return p.org_slug === "fresh-grove";
    return true;
  }

  function groveLeaderStarHtml(label) {
    var name = esc(label || "Grove Leader");
    return '<span class="live-team-leader-star" title="' + name + '" aria-label="' + name + '">' +
      '<svg viewBox="0 0 12 12" aria-hidden="true"><path fill="currentColor" d="M6 .7l1.46 3.28 3.54.36-2.68 2.4.8 3.46L6 8.5 2.88 10.2l.8-3.46L1 4.34l3.54-.36z"/></svg>' +
      "</span>";
  }

  function groveLeaderIdMap() {
    var map = {};
    (adminProfileCache || []).forEach(function (p) {
      if (p && p.id && p.is_org_admin && personIsFreshGroveOrg(p)) map[p.id] = true;
    });
    return map;
  }

  function personIsGroveLeader(p, map) {
    if (!p) return false;
    if (personIsEvergreenOrg(p)) return false;
    if (map && p.id && map[p.id]) return true;
    if (p.is_org_admin && personIsFreshGroveOrg(p)) return true;
    return false;
  }

  async function ensureAdminProfiles(opts) {
    opts = opts || {};
    if (!Array.isArray(adminProfileCache)) adminProfileCache = [];
    if (!(Cloud.canLoadAdminRoster && Cloud.canLoadAdminRoster())) return;
    if (adminProfileCache.length && !opts.force) return;
    try {
      adminProfileCache = await Cloud.adminListProfiles();
    } catch (e) {
      adminProfileCache = adminProfileCache || [];
    }
    if (!Array.isArray(adminProfileCache)) adminProfileCache = [];
  }

  function evergreenHubAdminId() {
    var id = "";
    (adminProfileCache || []).forEach(function (p) {
      if (id) return;
      if (p && p.id && p.is_hub_admin && !p.is_super_admin && personIsEvergreenOrg(p)) id = p.id;
    });
    return id;
  }

  function evergreenAdminPeople() {
    var list = [];
    var seen = {};
    (adminProfileCache || []).forEach(function (p) {
      if (!p || !p.id || seen[p.id]) return;
      var hub = !!p.is_hub_admin && personIsEvergreenOrg(p);
      var superA = !!p.is_super_admin;
      if (!hub && !superA) return;
      seen[p.id] = true;
      list.push(p);
    });
    list.sort(function (a, b) {
      var aRank = a.is_hub_admin ? 0 : 1;
      var bRank = b.is_hub_admin ? 0 : 1;
      if (aRank !== bRank) return aRank - bRank;
      return personLabel(a).localeCompare(personLabel(b), undefined, { sensitivity: "base" });
    });
    return list;
  }

  function evergreenAdminsRowHtml() {
    var me = Cloud.user() || {};
    var people = evergreenAdminPeople();
    if (!people.length) return "";
    var html = '<div class="ev-team-admins">';
    html += '<div class="ev-team-admins-label">Evergreen admins</div>';
    html += '<div class="ev-team-admins-chips">';
    people.forEach(function (p) {
      cacheRosterPerson(p, true);
      var you = p.id === me.id;
      html += '<button type="button" class="ev-team-admin-chip' + (you ? " is-you" : "") +
        '" data-team-person="' + esc(p.id) + '">';
      html += '<span class="ev-team-admin-chip-name">' + esc(personLabel(p)) +
        (you ? " (you)" : "") + "</span>";
      html += "</button>";
    });
    html += "</div></div>";
    return html;
  }

  function hideLeadersRoster(kind) {
    var ids = leadersRosterIds(kind);
    var el = $(ids.root);
    if (!el) return;
    el.hidden = true;
    var body = $(ids.body);
    if (body) body.innerHTML = "";
    var tease = $(ids.tease);
    if (tease) tease.textContent = ids.teaseIdle;
  }

  function hideGroveUpline() {
    var el = $("groveUpline");
    var body = $("groveUplineBody");
    if (el) el.hidden = true;
    if (body) body.innerHTML = "";
  }

  async function renderGroveUpline() {
    var el = $("groveUpline");
    var body = $("groveUplineBody");
    if (!el || !body) return;
    if (typeof packEvergreen === "function" && packEvergreen()) {
      hideGroveUpline();
      return;
    }
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      hideGroveUpline();
      return;
    }
    var rows = [];
    try {
      rows = await Cloud.myUpline();
    } catch (err) {
      rows = [];
    }
    if (!rows || !rows.length) {
      hideGroveUpline();
      return;
    }
    var html = '<ol class="grove-upline-list">';
    rows.forEach(function (p) {
      var name = Cloud.formatPersonName ? Cloud.formatPersonName(p) : (p.display_name || "Partner");
      var cap = p.cap === "evergreen"
        ? "Evergreen Co. Team"
        : p.cap === "grove"
          ? "The Fresh Grove Team"
          : "";
      var role = !cap && p.is_org_admin ? "Grove Leader" : "";
      html += '<li class="grove-upline-row">';
      html += '<span class="grove-upline-name">' + esc(name) + "</span>";
      if (cap) html += '<span class="grove-upline-cap">' + esc(cap) + "</span>";
      else if (role) html += '<span class="grove-upline-role">' + esc(role) + "</span>";
      html += "</li>";
    });
    html += "</ol>";
    body.innerHTML = html;
    el.hidden = false;
  }

  function hideGroveLeadersRoster() {
    hideLeadersRoster("grove");
    hideUnattachedRoster("grove");
  }
  function hideEvergreenLeadersRoster() {
    hideLeadersRoster("evergreen");
    hideUnattachedRoster("evergreen");
  }

  function leadersRosterIds(kind) {
    if (kind === "evergreen") {
      return {
        root: "evergreenLeadersRoster",
        body: "evergreenLeadersRosterBody",
        tease: "evergreenLeadersRosterTease",
        teaseIdle: "Tap to see who has access",
        empty: "Nobody else is an Evergreen Leader yet. Share the leaders link from the gold flower on this page.",
        lead: "Everyone with Evergreen Leader access. How far they are on the path sits under their name.",
        named: "Nobody named yet"
      };
    }
    return {
      root: "groveLeadersRoster",
      body: "groveLeadersRosterBody",
      tease: "groveLeadersRosterTease",
      teaseIdle: "Tap to see who you’ve named",
      empty: "Nobody else is a Grove Leader yet. Tap a name on the tree to make someone one.",
      lead: "Everyone you’ve named a Grove Leader. Tap a name to open their card.",
      named: "Nobody named yet"
    };
  }

  function evergreenPathSteps() {
    var EV = window.FS.EVERGREEN || {};
    return EV.path || [];
  }

  function evProgressFromDone(done) {
    done = done || {};
    var steps = evergreenPathSteps();
    var total = steps.length || 7;
    var n = 0;
    var nextLabel = "";
    for (var i = 0; i < steps.length; i++) {
      if (done[steps[i].id]) n++;
      else if (!nextLabel) nextLabel = steps[i].label;
    }
    var complete = n >= total && total > 0;
    return {
      done: n,
      total: total,
      complete: complete,
      label: complete
        ? (n + "/" + total + " · Path complete")
        : (n + "/" + total + " · " + (nextLabel || "Not started"))
    };
  }

  function evProgressFor(id) {
    if (!id) return null;
    if (Object.prototype.hasOwnProperty.call(evProgressCache, id)) {
      return evProgressFromDone(evProgressCache[id] && evProgressCache[id].done);
    }
    if (!evProgressLoaded) return null;
    return evProgressFromDone(null);
  }

  function evProgressNameHtml(p, isEv) {
    var name = esc(personLabel(p));
    var prog = isEv ? evProgressFor(p.id) : null;
    if (!prog) return '<span class="grove-leaders-roster-name">' + name + "</span>";
    return '<span class="grove-leaders-roster-name">' + name +
      '<span class="grove-leaders-roster-prog">' + esc(prog.label) + "</span></span>";
  }

  async function loadEvergreenProgress() {
    evProgressCache = {};
    evProgressLoaded = false;
    if (!packEvergreen() || !canSeeEvergreenRoster()) return;
    if (!Cloud.listProgressByIds) return;
    await ensureAdminProfiles();
    var ids = [];
    (adminProfileCache || []).forEach(function (p) {
      if (p && p.id && personIsEvergreenOrg(p)) ids.push(p.id);
    });
    if (!ids.length) {
      evProgressLoaded = true;
      return;
    }
    try {
      evProgressCache = await Cloud.listProgressByIds(ids) || {};
      evProgressLoaded = true;
    } catch (e) {
      evProgressCache = {};
      evProgressLoaded = false;
    }
  }

  async function fillLeadersRoster(kind) {
    var isEv = kind === "evergreen";
    var ids = leadersRosterIds(kind);
    var el = $(ids.root);
    var body = $(ids.body);
    if (!el || !body) return;
    var show = Cloud.isSignedIn() && (isEv
      ? canSeeEvergreenRoster()
      : (!packEvergreen() && Cloud.isSuperAdmin()));
    if (!show) {
      hideLeadersRoster(kind);
      return;
    }
    await ensureAdminProfiles();
    var me = Cloud.user() || {};
    var people = (adminProfileCache || []).filter(function (p) {
      if (!p || !p.id || !p.is_org_admin || p.id === me.id || p.is_super_admin) return false;
      if (isEv && p.is_hub_admin) return false;
      return isEv ? personIsEvergreenOrg(p) : personIsFreshGroveOrg(p);
    });
    people.sort(function (a, b) {
      return personLabel(a).localeCompare(personLabel(b), undefined, { sensitivity: "base" });
    });
    var tease = $(ids.tease);
    if (tease) {
      tease.textContent = people.length
        ? (people.length === 1 ? "1 person" : people.length + " people")
        : ids.named;
    }
    var html = '<p class="grove-leaders-roster-lead">' + esc(ids.lead) + "</p>";
    if (!people.length) {
      html += '<p class="grove-leaders-roster-empty">' + esc(ids.empty) + "</p>";
    } else {
      html += '<div class="grove-leaders-roster-list">';
      people.forEach(function (p) {
        cacheRosterPerson(p, isEv);
        html += '<button type="button" class="grove-leaders-roster-row' + (isEv ? "" : " has-photo") + '" data-team-person="' + esc(p.id) + '">';
        html += groveLeaderStarHtml(isEv ? "Evergreen Leader" : "Grove Leader");
        html += isEv ? "" : personPhotoHtml(p, "sm");
        html += evProgressNameHtml(p, isEv);
        html += "</button>";
      });
      html += "</div>";
    }
    body.innerHTML = html;
    el.hidden = false;
  }

  function cacheRosterPerson(p, isEv) {
    if (!p || !p.id) return;
    if (!teamPersonCache[p.id]) {
      teamPersonCache[p.id] = {
        id: p.id,
        display_name: p.display_name,
        last_name: p.last_name || "",
        email: (!isEv && Cloud.isSuperAdmin && Cloud.isSuperAdmin()) ? (p.email || "") : "",
        hub_mode: p.hub_mode,
        created_at: p.created_at || "",
        is_org_admin: !!p.is_org_admin,
        is_hub_admin: !!p.is_hub_admin,
        is_super_admin: !!p.is_super_admin,
        org_id: p.org_id || (isEv ? evergreenOrgId() : groveOrgId()),
        sponsor_id: p.sponsor_id || null,
        isDirect: false,
        under: 0,
        photo_at: p.photo_at || null,
        photo_ext: p.photo_ext || "webp"
      };
    } else {
      teamPersonCache[p.id].is_org_admin = !!p.is_org_admin;
      teamPersonCache[p.id].is_hub_admin = !!p.is_hub_admin;
      teamPersonCache[p.id].is_super_admin = !!p.is_super_admin;
      if (p.org_id) teamPersonCache[p.id].org_id = p.org_id;
      teamPersonCache[p.id].sponsor_id = p.sponsor_id || null;
      copyPhotoFields(p, teamPersonCache[p.id]);
      if (p.last_name && !teamPersonCache[p.id].last_name) {
        teamPersonCache[p.id].last_name = p.last_name;
      }
      if (!isEv && Cloud.isSuperAdmin && Cloud.isSuperAdmin() && p.email && !teamPersonCache[p.id].email) {
        teamPersonCache[p.id].email = p.email;
      }
      if (p.created_at && !teamPersonCache[p.id].created_at) {
        teamPersonCache[p.id].created_at = p.created_at;
      }
    }
    if (isEv) {
      var prog = evProgressFor(p.id);
      if (prog) teamPersonCache[p.id].evProgress = prog;
    }
  }

  async function renderGroveLeadersRoster() {
    hideEvergreenLeadersRoster();
    await fillLeadersRoster("grove");
    hideUnattachedRoster("grove");
  }

  async function renderEvergreenLeadersRoster(opts) {
    opts = opts || {};
    hideGroveLeadersRoster();
    if (teamTreeGrowDemoOn()) {
      showTeamTreeGrowDemo();
      return;
    }
    if (!opts.light) beginTeamPageGrowing(false);
    try {
      if (canSeeEvergreenRoster()) {
        if (!opts.light) {
          await ensureAdminProfiles({ force: true });
          await loadEvergreenProgress();
        } else {
          await ensureAdminProfiles();
        }
        await fillLeadersRoster("evergreen");
      } else {
        hideLeadersRoster("evergreen");
      }
    } catch (eRoster) {
      hideLeadersRoster("evergreen");
    }
    await renderEvergreenTeamGraph({ light: !!opts.light });
    await fillUnattachedRoster("evergreen");
  }

  function unattachedRosterIds(kind) {
    if (kind === "grove") {
      return {
        root: "groveUnattachedPeopleRoster",
        body: "groveUnattachedPeopleRosterBody",
        tease: "groveUnattachedPeopleRosterTease"
      };
    }
    return {
      root: "unattachedPeopleRoster",
      body: "unattachedPeopleRosterBody",
      tease: "unattachedPeopleRosterTease"
    };
  }

  function hideUnattachedRoster(kind) {
    var ids = unattachedRosterIds(kind);
    var el = $(ids.root);
    if (el) el.hidden = true;
    var body = $(ids.body);
    if (body) body.innerHTML = "";
    var tease = $(ids.tease);
    if (tease) tease.textContent = "Tap to see who";
  }

  async function fillUnattachedRoster(kind) {
    var ids = unattachedRosterIds(kind);
    var el = $(ids.root);
    var body = $(ids.body);
    if (!el || !body) return;
    if (!(Cloud.isSuperAdmin && Cloud.isSuperAdmin())) {
      hideUnattachedRoster(kind);
      return;
    }
    await ensureAdminProfiles();
    var people = (adminProfileCache || []).filter(function (p) {
      return p && p.id && !p.org_id && !p.is_super_admin;
    });
    people.sort(function (a, b) {
      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });
    var tease = $(ids.tease);
    if (!people.length) {
      hideUnattachedRoster(kind);
      return;
    }
    if (tease) tease.textContent = people.length === 1 ? "1 person" : people.length + " people";
    var html = '<p class="grove-leaders-roster-lead">They made an account with no join link, so they are not on Evergreen or Fresh Grove. Tap a name to place them once you know who they sit under.</p>';
    html += '<div class="grove-leaders-roster-list">';
    people.forEach(function (p) {
      cacheRosterPerson(p, false);
      html += '<button type="button" class="grove-leaders-roster-row" data-team-person="' + esc(p.id) + '">';
      html += evProgressNameHtml(p, false);
      html += "</button>";
    });
    html += "</div>";
    body.innerHTML = html;
    el.hidden = false;
  }

  function ensureSupportSeenMap() {
    if (!getState) return {};
    var st = getState();
    if (!st.data) st.data = {};
    if (!st.data.supportSeenCompletions || typeof st.data.supportSeenCompletions !== "object") {
      st.data.supportSeenCompletions = {};
    }
    return st.data.supportSeenCompletions;
  }

  function unseenSupportRows(rows) {
    var seen = ensureSupportSeenMap();
    return (rows || []).filter(function (row) {
      var support = row && row.support_preferences;
      var id = row && row.profile && row.profile.id;
      return !!(id && support && support.completed_at && seen[id] !== support.completed_at);
    });
  }

  function markSupportCompletionsSeen(rows) {
    var seen = ensureSupportSeenMap();
    var changed = false;
    (rows || []).forEach(function (row) {
      var support = row && row.support_preferences;
      var id = row && row.profile && row.profile.id;
      if (id && support && support.completed_at && seen[id] !== support.completed_at) {
        seen[id] = support.completed_at;
        changed = true;
      }
    });
    if (changed && persist) persist({ immediate: true });
  }

  function partnerName(row) {
    return (row && row.profile && personLabel(row.profile)) || "A partner";
  }

  function renderLeaderOverview(rows, newJoins, newSupports, placementMap) {
    var el = $("leaderOverview");
    if (!el) return;
    rows = rows || [];
    newJoins = newJoins || [];
    newSupports = newSupports || [];
    placementMap = placementMap || {};
    var updateCount = newJoins.length + newSupports.length;
    if (!Cloud.isSignedIn() || !updateCount) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    var html = '<div class="leader-overview-head"><div>' +
      '<div class="leader-overview-kicker">WHAT’S NEW</div>' +
      "</div>" +
      '<div class="leader-overview-head-actions">' +
      '<span class="leader-overview-new">' + updateCount + " new</span>" +
      '<button type="button" class="leader-overview-dismiss" data-dismiss-team-news aria-label="Dismiss what’s new">Dismiss</button>' +
      "</div></div>" +
      '<div class="leader-overview-updates">';
    newJoins.forEach(function (row) {
      var pid = row && row.profile && row.profile.id;
      var place = joinPlacementBlurb(placementMap, pid);
      html += '<div class="leader-overview-update is-join"><span aria-hidden="true">✨</span><span><strong>' +
        esc(partnerName(row)) + '</strong><span class="leader-overview-place">' + esc(place) +
        "</span></span></div>";
    });
    newSupports.forEach(function (row) {
      html += '<button type="button" class="leader-overview-update is-support" data-how-they-grow="' +
        esc(row.profile.id) + '"><span aria-hidden="true">🌱</span><span><strong>' +
        esc(partnerName(row)) + '</strong><span class="leader-overview-place">shared How I Grow</span></span><b aria-hidden="true">→</b></button>';
    });
    html += "</div>";
    el.innerHTML = html;
    el.hidden = false;
  }

  function paintNavBadge(tab, count) {
    var btn = document.querySelector('.bottom-nav-btn[data-tab="' + tab + '"]');
    if (!btn) return;
    /* Older cached HTML put a flex-child .bottom-nav-badge under the label — remove it. */
    var leftovers = btn.querySelectorAll(".bottom-nav-badge, .bottom-nav-ico-wrap");
    for (var i = 0; i < leftovers.length; i++) {
      var node = leftovers[i];
      if (node.classList.contains("bottom-nav-ico-wrap")) {
        var ico = node.querySelector(".bottom-nav-ico");
        if (ico) node.parentNode.insertBefore(ico, node);
        node.parentNode.removeChild(node);
      } else {
        node.parentNode.removeChild(node);
      }
    }
    var n = count | 0;
    if (n < 1) {
      btn.removeAttribute("data-nav-badge");
      return;
    }
    btn.setAttribute("data-nav-badge", n > 9 ? "9+" : String(n));
  }

  function paintTeamBadge(count) {
    paintNavBadge("team", count);
  }

  async function refreshTeamBadge() {
    if (!Cloud.isSignedIn()) {
      paintTeamBadge(0);
      return;
    }
    try {
      var rows = await Cloud.listDownline();
      var graph = { roots: [] };
      try { graph = await Cloud.listTeamGraph(); } catch (e) { graph = { roots: [] }; }
      var flat = flattenTeamGraph(graph.roots || []);
      paintTeamBadge(countUnseenTeamJoins(flat) + unseenSupportRows(rows).length);
    } catch (e) {
      paintTeamBadge(0);
    }
  }

  var pendingTeamSeenFlat = null;
  var pendingSupportSeenRows = null;

  function clearLeaderOverview() {
    var el = $("leaderOverview");
    if (!el) return;
    el.hidden = true;
    el.innerHTML = "";
  }

  /* Don’t mark “New” as seen on first paint — a boot re-render (~1–2s) would wipe
     it mid-view. Clear when they tap Dismiss, or when they leave Grove. */
  function queueTeamNewsAck(flat, rows) {
    pendingTeamSeenFlat = flat || null;
    pendingSupportSeenRows = rows || null;
  }

  function acknowledgeTeamNews(opts) {
    var flat = pendingTeamSeenFlat;
    var rows = pendingSupportSeenRows;
    if (!flat || !rows) {
      var graph = lastLeaderSnap && lastLeaderSnap.graph;
      var snapRows = lastLeaderSnap && lastLeaderSnap.rows;
      if (!flat) flat = flattenTeamGraph((graph && graph.roots) || []);
      if (!rows) rows = snapRows || [];
    }
    if (flat && flat.length) markTeamJoinsSeen(flat);
    if (rows && rows.length) markSupportCompletionsSeen(rows);
    pendingTeamSeenFlat = null;
    pendingSupportSeenRows = null;
    if (opts && opts.hideOverview) {
      clearLeaderOverview();
      paintTeamBadge(0);
    }
  }

  function onPanelChange(activeId) {
    if (activeId !== "leader" && activeId !== "ev-team") {
      teamNewThisVisit = {};
      acknowledgeTeamNews();
    }
    if (activeId === "leader") beginTeamPageGrowing(true);
    if (activeId === "ev-team") beginTeamPageGrowing(false);
  }

  var teamPersonCache = {};
  /* Remember which tree branches the user opened. Nested <details> also
     toggle ancestors in Safari/Chrome, so inner rows are class-based folds
     and this map survives a team-graph rerender. */
  var teamFoldOpen = {};

  function teamFoldIsOpen(id, defaultOpen) {
    if (id && Object.prototype.hasOwnProperty.call(teamFoldOpen, id)) return !!teamFoldOpen[id];
    return !!defaultOpen;
  }

  function setTeamBranchOpen(branch, open) {
    if (!branch || !branch.classList.contains("has-kids")) return;
    open = !!open;
    branch.classList.toggle("is-open", open);
    if (branch.tagName === "DETAILS") branch.open = open;
    var id = branch.getAttribute("data-team-branch");
    if (id) teamFoldOpen[id] = open;
    var btn = branch.querySelector(":scope > .live-l1-sum .live-l1-expand, :scope > .live-team-sum .live-team-expand");
    if (btn) {
      var under = btn.getAttribute("data-under") || "";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (under) btn.setAttribute("aria-label", (open ? "Hide " : "Show ") + under + " under");
    }
  }

  var suggestedNotesByPartner = {};
  var teamMovePartnerId = null;
  var adminProfileCache = [];
  var evProgressCache = {};
  var evProgressLoaded = false;
  var teamTreeFindQ = "";
  var teamTreeFindTimer = 0;
  var lastTeamGraphPaint = null;
  var broadcastAudience = "team";
  var broadcastKind = "note";
  var pollChoiceMode = "multiple";
  var pollSlotDrafts = ["", "", ""];
  var pollVoteDraft = {};

  function canRearrangeCurrentTeam() {
    return !!(Cloud.canRearrangeTeam && Cloud.canRearrangeTeam());
  }

  function teamRearrangeOn() {
    var st = getState ? getState() : null;
    return !!(st && st.data && st.data.teamRearrangeMode && canRearrangeCurrentTeam());
  }

  function setTeamRearrangeOn(on) {
    if (!getState) return;
    var st = getState();
    if (!st.data) st.data = {};
    st.data.teamRearrangeMode = !!on && canRearrangeCurrentTeam();
    persist();
  }

  function closeTeamPersonSheet() {
    var sheet = $("teamPersonSheet");
    if (sheet) sheet.hidden = true;
  }

  function closeTeamMoveSheet() {
    teamMovePartnerId = null;
    var sheet = $("teamMoveSheet");
    if (sheet) sheet.hidden = true;
  }

  function applyLocalSponsorMove(partnerId, newSponsorId) {
    var next = newSponsorId || null;
    (adminProfileCache || []).forEach(function (p) {
      if (p && p.id === partnerId) p.sponsor_id = next;
    });
    if (teamPersonCache[partnerId]) teamPersonCache[partnerId].sponsor_id = next;
  }

  function movePickHay(p) {
    return [
      p && p.display_name,
      p && p.last_name,
      p && p.email,
      personLabel(p)
    ].join(" ").toLowerCase();
  }

  function teamNodeSelfMatch(p, q) {
    if (!p || !q) return false;
    return movePickHay(p).indexOf(q) >= 0;
  }

  function teamNodeMatchesFind(p, q) {
    if (!q) return true;
    if (teamNodeSelfMatch(p, q)) return true;
    var kids = (p && p.children) || [];
    for (var i = 0; i < kids.length; i++) {
      if (teamNodeMatchesFind(kids[i], q)) return true;
    }
    return false;
  }

  function descendantIdSet(profiles, rootId) {
    var bySponsor = {};
    (profiles || []).forEach(function (p) {
      if (!p || !p.sponsor_id) return;
      if (!bySponsor[p.sponsor_id]) bySponsor[p.sponsor_id] = [];
      bySponsor[p.sponsor_id].push(p.id);
    });
    var out = {};
    var stack = [rootId];
    while (stack.length) {
      var id = stack.pop();
      var kids = bySponsor[id] || [];
      for (var i = 0; i < kids.length; i++) {
        if (out[kids[i]]) continue;
        out[kids[i]] = true;
        stack.push(kids[i]);
      }
    }
    return out;
  }

  async function openTeamPersonSheet(partnerId) {
    if (Cloud.canLoadAdminRoster && Cloud.canLoadAdminRoster() && !adminProfileCache.length) {
      try {
        adminProfileCache = await Cloud.adminListProfiles();
        (adminProfileCache || []).forEach(function (p) {
          if (!teamPersonCache[p.id]) return;
          teamPersonCache[p.id].is_org_admin = !!p.is_org_admin;
          teamPersonCache[p.id].is_hub_admin = !!p.is_hub_admin;
          teamPersonCache[p.id].is_super_admin = !!p.is_super_admin;
          if (p.org_id) teamPersonCache[p.id].org_id = p.org_id;
          if (p.created_at && !teamPersonCache[p.id].created_at) {
            teamPersonCache[p.id].created_at = p.created_at;
          }
          if (!packEvergreen() && Cloud.isSuperAdmin && Cloud.isSuperAdmin() && p.email) {
            teamPersonCache[p.id].email = p.email;
          }
        });
      } catch (e) {}
    } else if (adminProfileCache.length) {
      (adminProfileCache || []).forEach(function (p) {
        if (p.id !== partnerId || !teamPersonCache[p.id]) return;
        teamPersonCache[p.id].is_org_admin = !!p.is_org_admin;
        teamPersonCache[p.id].is_hub_admin = !!p.is_hub_admin;
        teamPersonCache[p.id].is_super_admin = !!p.is_super_admin;
        if (p.org_id) teamPersonCache[p.id].org_id = p.org_id;
        if (!packEvergreen() && Cloud.isSuperAdmin && Cloud.isSuperAdmin() && p.email) {
          teamPersonCache[p.id].email = p.email;
        }
      });
    }
    var person = teamPersonCache[partnerId];
    if (!person) return;
    if (packEvergreen() && personIsEvergreenOrg(person)) {
      if (!evProgressLoaded) {
        try { await loadEvergreenProgress(); } catch (e) {}
      }
      var sheetProg = evProgressFor(partnerId);
      if (sheetProg) person.evProgress = sheetProg;
    }
    var sheet = $("teamPersonSheet");
    var nameEl = $("teamPersonName");
    var chips = $("teamPersonChips");
    var facts = $("teamPersonFacts");
    var actions = $("teamPersonActions");
    if (!sheet || !nameEl || !chips || !facts || !actions) return;
    closeAllSheets("teamPerson");
    fillPhotoSlot($("teamPersonPhoto"), person, "lg");
    nameEl.textContent = personLabel(person);
    chips.innerHTML = (packEvergreen() ? "" : hubModeChipHtml(person.hub_mode)) +
      (person.under ? '<span class="live-l1-under on">' + person.under + " under</span>" : "") +
      (packEvergreen() && personIsFreshGroveOrg(person) ? '<span class="team-mode-chip is-grove">The Fresh Grove</span>' : "") +
      (!packEvergreen() && personIsGroveLeader(person, groveLeaderIdMap()) ? '<span class="team-mode-chip is-full">Grove Leader</span>' : "") +
      (person.is_hub_admin && personIsEvergreenOrg(person) ? '<span class="team-mode-chip is-full">Evergreen Admin</span>' : "") +
      (person.is_org_admin && !person.is_hub_admin && personIsEvergreenOrg(person) ? '<span class="team-mode-chip is-full">Evergreen Leader</span>' : "") +
      (person.is_super_admin ? '<span class="team-mode-chip is-full">Super admin</span>' : "");
    var factRows = [
      ["Joined", formatJoinedOn(person.created_at)],
      ["Last active", person.daysSinceActive == null ? "—" :
        (person.daysSinceActive === 0 ? "Today" : person.daysSinceActive + "d ago")]
    ];
    if (person.evProgress) {
      factRows.push(["Progress", person.evProgress.label]);
    } else if (person.sectionsDone != null) {
      factRows.push(["Progress", person.sectionsDone + "/" + person.sectionTotal + " sections"]);
    }
    if (person.email) factRows.push(["Email", person.email, "mail"]);
    facts.innerHTML = factRows.map(function (pair) {
      if (pair[2] === "mail") {
        return "<div><dt>" + esc(pair[0]) + "</dt><dd><a href=\"mailto:" + esc(pair[1]) + "\">" + esc(pair[1]) + "</a></dd></div>";
      }
      return "<div><dt>" + esc(pair[0]) + "</dt><dd>" + esc(pair[1]) + "</dd></div>";
    }).join("");
    var html = "";
    if (canSendCheerNote() && person.isDirect) {
      html += '<button type="button" class="btn" data-cheer="' + esc(partnerId) + '">Send cheer</button>';
      html += '<button type="button" class="btn-ghost" data-note="' + esc(partnerId) + '">Leave note</button>';
    } else if (!packEvergreen() && !Cloud.isOrgAdmin()) {
      html += '<p class="team-person-hint">Cheer and notes are for your Level 1 — this person is deeper on the tree.</p>';
    }
    if (packEvergreen() && personIsEvergreenOrg(person)) {
      var supportRec = supportProfileByPartner[partnerId];
      if (!supportRec || !supportRec.allowed) {
        try {
          await hydrateHowIGrowForIds([partnerId]);
        } catch (eGrow) {}
        supportRec = supportProfileByPartner[partnerId];
      }
      if (supportRec && supportRec.allowed) {
        html += supportSnapshotHtml(partnerId, supportRec.support);
      }
    }
    if (canRearrangeCurrentTeam() && teamRearrangeOn()) {
      var skipMove = packEvergreen() && (
        person.is_hub_admin || person.is_super_admin ||
        !personIsEvergreenOrg(person) || person.grove_graft
      );
      if (!skipMove) html += '<button type="button" class="btn" data-team-move="' + esc(partnerId) + '">Move under…</button>';
    }
    if (Cloud.isSuperAdmin() && !packEvergreen() && partnerId !== (Cloud.user() && Cloud.user().id) && !person.is_super_admin && personIsFreshGroveOrg(person)) {
      if (personIsGroveLeader(person, groveLeaderIdMap())) {
        html += '<button type="button" class="btn-ghost" data-team-admin="' + esc(partnerId) + '" data-admin-on="0">Remove Grove Leader</button>';
      } else {
        html += '<button type="button" class="btn-ghost" data-team-admin="' + esc(partnerId) + '" data-admin-on="1">Make Grove Leader</button>';
      }
    }
    if (Cloud.canNameEvergreenLeader && Cloud.canNameEvergreenLeader() && partnerId !== (Cloud.user() && Cloud.user().id) && !person.is_super_admin && !person.is_hub_admin && personIsEvergreenOrg(person)) {
      if (person.is_org_admin) {
        html += '<button type="button" class="btn-ghost" data-team-admin="' + esc(partnerId) + '" data-admin-on="0">Remove Evergreen Leader</button>';
      } else {
        html += '<button type="button" class="btn-ghost" data-team-admin="' + esc(partnerId) + '" data-admin-on="1">Make Evergreen Leader</button>';
      }
    }
    if (Cloud.canRemoveTeamPerson && Cloud.canRemoveTeamPerson(person)) {
      html += '<button type="button" class="btn-ghost danger-ghost" data-team-remove="' + esc(partnerId) + '">Remove from app</button>';
    }
    actions.innerHTML = html;
    sheet.hidden = false;
    armSheetDismiss();
  }

  function renderTeamMoveList(query) {
    var list = $("teamMoveList");
    if (!list || !teamMovePartnerId) return;
    var q = String(query || "").trim().toLowerCase();
    var blocked = descendantIdSet(adminProfileCache, teamMovePartnerId);
    blocked[teamMovePartnerId] = true;
    var person = teamPersonCache[teamMovePartnerId] || {};
    var html = "";
    var hubId = packEvergreen() ? evergreenHubAdminId() : "";
    var meId = (Cloud.user() && Cloud.user().id) || "";
    var leaderTree = isEvergreenLeaderOnly();
    var alreadyTop = packEvergreen()
      ? (leaderTree ? person.sponsor_id === meId : (!person.sponsor_id || person.sponsor_id === hubId))
      : !person.sponsor_id;
    if (!alreadyTop) {
      html += '<button type="button" class="team-move-option" data-team-move-root>';
      html += '<span class="team-move-option-name">' +
        (leaderTree ? "Top of my team" : "Top of the team") + "</span>";
      html += '<span class="team-move-option-meta">' +
        (leaderTree
          ? "Level 1 under you"
          : (packEvergreen() ? "Level 1 under Evergreen Co" : "No one above them")) + "</span>";
      html += "</button>";
    }
    var picks = (adminProfileCache || []).filter(function (p) {
      if (!p || !p.id || blocked[p.id]) return false;
      if (packEvergreen()) {
        if (!personIsEvergreenOrg(p) || p.is_hub_admin || p.is_super_admin) return false;
      } else if (personIsEvergreenOrg(p) || !personIsFreshGroveOrg(p)) {
        return false;
      }
      if (q && movePickHay(p).indexOf(q) < 0) return false;
      return true;
    });
    picks.sort(function (a, b) {
      var aLead = !!(a.is_org_admin || a.is_hub_admin);
      var bLead = !!(b.is_org_admin || b.is_hub_admin);
      if (aLead !== bLead) return aLead ? -1 : 1;
      return personLabel(a).localeCompare(personLabel(b), undefined, { sensitivity: "base" });
    });
    picks.forEach(function (p) {
      var label = personLabel(p);
      var meta = "";
      if (packEvergreen() && p.is_org_admin) meta = "Evergreen Leader";
      else if (!packEvergreen() && p.is_org_admin) meta = "Grove Leader";
      else if (p.last_name && label.toLowerCase().indexOf(String(p.last_name).toLowerCase()) < 0) {
        meta = p.last_name;
      }
      html += '<button type="button" class="team-move-option" data-team-move-to="' + esc(p.id) + '">';
      html += '<span class="team-move-option-name">' + esc(label) + "</span>";
      if (meta) html += '<span class="team-move-option-meta">' + esc(meta) + "</span>";
      html += "</button>";
    });
    if (!html) {
      html = '<p class="team-person-hint">' +
        (q
          ? "No one matches that name. Try a last name, or pick someone who isn’t under " +
            esc(personLabel(person)) + "."
          : "No valid people to move under. Pick someone who isn’t under " +
            esc(personLabel(person)) + ".") +
        "</p>";
    } else if (!q && picks.length > 12) {
      html += '<p class="team-person-hint">Leaders are first. Type a name to jump — every person is in this list.</p>';
    }
    list.innerHTML = html;
  }

  async function openTeamMoveSheet(partnerId) {
    if (!canRearrangeCurrentTeam() || !teamRearrangeOn()) return;
    var person = teamPersonCache[partnerId];
    if (!person) return;
    if (packEvergreen() ? !personIsEvergreenOrg(person) : personIsEvergreenOrg(person)) return;
    if (packEvergreen() && (person.is_hub_admin || person.is_super_admin)) return;
    closeAllSheets("teamMove");
    teamMovePartnerId = partnerId;
    var sheet = $("teamMoveSheet");
    var title = $("teamMoveTitle");
    var lead = $("teamMoveLead");
    var search = $("teamMoveSearch");
    if (!sheet) return;
    if (title) title.textContent = "Move " + (person.display_name || person.email || "partner");
    if (lead) {
      lead.textContent = packEvergreen()
        ? (isEvergreenLeaderOnly()
          ? "Type a name. Top of my team puts them under you."
          : "Type a name — leaders are listed first. Who invited them stays the same.")
        : "Choose who they’ll sit under. Mentoring (cheers, notes, progress) moves with the new Level 1. Who invited them stays the same.";
    }
    try {
      if (isEvergreenLeaderOnly()) {
        var graph = { roots: [] };
        try { graph = await Cloud.listTeamGraph(); } catch (eG) { graph = { roots: [] }; }
        var me = Cloud.user() || {};
        adminProfileCache = [];
        function walkMove(nodes, parentId) {
          (nodes || []).forEach(function (p) {
            if (!p || !p.id) return;
            adminProfileCache.push({
              id: p.id,
              display_name: p.display_name,
              last_name: p.last_name || "",
              email: p.email,
              hub_mode: p.hub_mode,
              created_at: p.created_at || "",
              is_org_admin: !!p.is_org_admin,
              is_hub_admin: !!p.is_hub_admin,
              is_super_admin: false,
              org_id: p.org_id || evergreenOrgId(),
              sponsor_id: p.sponsor_id || parentId || me.id || null
            });
            walkMove(p.children, p.id);
          });
        }
        walkMove(graph.roots, me.id);
      } else if (!adminProfileCache.length) {
        adminProfileCache = await Cloud.adminListProfiles();
      }
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not load people.", { tone: "bad" });
      return;
    }
    /* Enrich cache with admin flags for person sheet later */
    (adminProfileCache || []).forEach(function (p) {
      if (!teamPersonCache[p.id]) {
        teamPersonCache[p.id] = {
          id: p.id,
          display_name: p.display_name,
          last_name: p.last_name || "",
          email: p.email,
          hub_mode: p.hub_mode,
          created_at: p.created_at || "",
          is_org_admin: !!p.is_org_admin,
          is_hub_admin: !!p.is_hub_admin,
          is_super_admin: !!p.is_super_admin,
          org_id: p.org_id || "",
          sponsor_id: p.sponsor_id || null,
          isDirect: false,
          under: 0
        };
      } else {
        teamPersonCache[p.id].is_org_admin = !!p.is_org_admin;
        teamPersonCache[p.id].is_hub_admin = !!p.is_hub_admin;
        teamPersonCache[p.id].is_super_admin = !!p.is_super_admin;
        if (p.org_id) teamPersonCache[p.id].org_id = p.org_id;
        teamPersonCache[p.id].sponsor_id = p.sponsor_id || null;
      }
    });
    if (search) search.value = "";
    renderTeamMoveList("");
    sheet.hidden = false;
    armSheetDismiss();
    if (search) setTimeout(function () { search.focus(); }, 50);
  }

  async function confirmTeamMove(newSponsorId, asRoot) {
    if (!teamMovePartnerId) return;
    if (!asRoot && !newSponsorId) return;
    var person = teamPersonCache[teamMovePartnerId] || {};
    var fromName = personLabel(person);
    var sponsor = null;
    var ok;
    if (asRoot) {
      ok = await FS.UI.ask(
        packEvergreen()
          ? (isEvergreenLeaderOnly()
            ? "They’ll sit at Level 1 under you — top of your growing team."
            : "They’ll sit at Level 1 under Evergreen Co — same place as anyone Lily hasn’t placed under someone else.")
          : "They won’t sit under anyone — they’ll be a top branch.",
        { title: "Move " + fromName + " to the top of the team?", okText: "Move them" }
      );
    } else {
      (adminProfileCache || []).forEach(function (p) {
        if (p.id === newSponsorId) sponsor = p;
      });
      var toName = (sponsor && personLabel(sponsor)) || "the selected person";
      ok = await FS.UI.ask(
        packEvergreen()
          ? "They’ll sit under " + toName + " on the Evergreen tree. Who invited them stays the same."
          : "Mentoring moves to " + toName + ". Invited-by stays the same.",
        { title: "Move " + fromName + " under " + toName + "?", okText: "Move them" }
      );
    }
    if (!ok) return;
    try {
      var rootSponsor = null;
      if (asRoot && packEvergreen()) {
        rootSponsor = isEvergreenLeaderOnly()
          ? ((Cloud.user() && Cloud.user().id) || null)
          : (evergreenHubAdminId() || null);
      }
      var placedUnder = asRoot ? rootSponsor : newSponsorId;
      await Cloud.reparentPartner(teamMovePartnerId, placedUnder);
      applyLocalSponsorMove(teamMovePartnerId, placedUnder);
      closeTeamMoveSheet();
      closeTeamPersonSheet();
      if (packEvergreen()) await renderEvergreenLeadersRoster({ light: true });
      else await renderLeader();
      var underName = asRoot
        ? (isEvergreenLeaderOnly() ? "you" : "the top of Evergreen")
        : ((sponsor && personLabel(sponsor)) || "their new upline");
      if (window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast("Moved " + fromName + " under " + underName + ".", { tone: "good" });
      }
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not move this person.", { tone: "bad" });
    }
  }

  async function toggleHubAdmin(partnerId, enabled) {
    if (!Cloud.isSuperAdmin()) return;
    var person = teamPersonCache[partnerId] || {};
    var name = person.display_name || person.email || "this partner";
    var ok = await FS.UI.ask(
      enabled
        ? "They’ll be able to post and edit Evergreen zooms, rearrange the Evergreen tree, see the full team, and see Evergreen Leaders. They stay an Evergreen Leader too. Only you can grant or remove this."
        : "They’ll stay an Evergreen Leader, but they won’t post org-wide zooms or rearrange the full tree.",
      enabled
        ? { title: "Make " + name + " an Evergreen Admin?", okText: "Make them admin" }
        : { title: "Remove Evergreen Admin from " + name + "?", okText: "Remove access", danger: true }
    );
    if (!ok) return;
    try {
      await Cloud.setHubAdmin(partnerId, enabled);
      adminProfileCache = [];
      if (teamPersonCache[partnerId]) {
        teamPersonCache[partnerId].is_hub_admin = !!enabled;
        if (enabled) teamPersonCache[partnerId].is_org_admin = true;
      }
      await renderEvergreenLeadersRoster();
      await openTeamPersonSheet(partnerId);
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not update admin access.", { tone: "bad" });
    }
  }

  async function toggleOrgAdmin(partnerId, enabled) {
    var evergreen = packEvergreen();
    if (evergreen) {
      if (!(Cloud.canNameEvergreenLeader && Cloud.canNameEvergreenLeader())) return;
    } else if (!Cloud.isSuperAdmin()) {
      return;
    }
    var person = teamPersonCache[partnerId] || {};
    var name = person.display_name || person.email || "this partner";
    var ok = await FS.UI.ask(
      evergreen
        ? (enabled
          ? "They’ll see their own growing team, share a unique join link, and post zooms for people under them. They won’t see the full org tree or name other Leaders — that’s for Evergreen Admin."
          : "They’ll stay on Evergreen but won’t see their leader tree or unique link.")
        : (enabled
          ? "They’ll be able to rearrange the team, send a grove-wide message, and open Grove Leaders in Learn. Only you can grant or remove this."
          : "They’ll keep their place on the tree but can no longer rearrange, message the grove, or see Grove Leaders in Learn."),
      evergreen
        ? (enabled
          ? { title: "Make " + name + " an Evergreen Leader?", okText: "Make them a leader" }
          : { title: "Remove Evergreen Leader from " + name + "?", okText: "Remove access", danger: true })
        : (enabled
          ? { title: "Make " + name + " a Grove Leader?", okText: "Make them a leader" }
          : { title: "Remove Grove Leader from " + name + "?", okText: "Remove access", danger: true })
    );
    if (!ok) return;
    try {
      await Cloud.setOrgAdmin(partnerId, enabled);
      adminProfileCache = [];
      if (teamPersonCache[partnerId]) teamPersonCache[partnerId].is_org_admin = !!enabled;
      if (evergreen) await renderEvergreenLeadersRoster();
      else await renderLeader();
      await openTeamPersonSheet(partnerId);
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not update leader access.", { tone: "bad" });
    }
  }

  async function removeTeamPersonFromSheet(partnerId) {
    var person = teamPersonCache[partnerId] || {};
    if (!(Cloud.canRemoveTeamPerson && Cloud.canRemoveTeamPerson(person))) return;
    var name = personLabel(person);
    var answer = await FS.UI.ask(
      "They lose access right away. Anyone sitting under them stays on the tree under their upline.",
      {
        title: "Remove " + name + " from the app?",
        okText: "Remove them",
        danger: true,
        check: {
          label: "Block this email from making a new account",
          hint: "Check this if they joined another team. Leave it off if they might come back later."
        }
      }
    );
    if (!answer) return;
    var blockEmail = !!(answer && answer.checked);
    try {
      await Cloud.removeTeamPerson(partnerId, { blockEmail: blockEmail });
      delete teamPersonCache[partnerId];
      adminProfileCache = [];
      closeTeamPersonSheet();
      if (packEvergreen()) await renderEvergreenLeadersRoster();
      else await renderLeader();
      if (window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast(
          blockEmail
            ? name + " is off the app. This email can’t come back."
            : name + " is off the app. They can join again later with the same email.",
          { tone: "good" }
        );
      }
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not remove this person.", { tone: "bad" });
    }
  }

  function hideEvergreenTeamGraph() {
    var el = $("evergreenTeamGraph");
    if (el) {
      el.hidden = true;
      el.innerHTML = "";
    }
    endTeamPageGrowing(el);
  }

  function buildOrgForest(orgId) {
    var me = Cloud.user() || {};
    var people = (adminProfileCache || []).filter(function (p) {
      if (!p || !p.id || p.is_super_admin || p.is_hub_admin) return false;
      if (me.is_hub_admin && p.id === me.id) return false;
      if (orgId && String(orgId) === String(evergreenOrgId())) return personIsEvergreenOrg(p);
      return String(p.org_id || "") === String(orgId);
    });
    var byId = {};
    people.forEach(function (p) {
      byId[p.id] = {
        id: p.id,
        display_name: p.display_name,
        last_name: p.last_name || "",
        email: p.email,
        hub_mode: p.hub_mode,
        created_at: p.created_at || "",
        is_org_admin: !!p.is_org_admin,
        is_hub_admin: !!p.is_hub_admin,
        is_super_admin: !!p.is_super_admin,
        org_id: p.org_id,
        sponsor_id: p.sponsor_id || null,
        children: []
      };
    });
    var roots = [];
    people.forEach(function (p) {
      var node = byId[p.id];
      var sid = p.sponsor_id;
      if (sid && byId[sid] && sid !== p.id) byId[sid].children.push(node);
      else roots.push(node);
    });
    return roots;
  }

  function markGroveGraftNodes(node, isRoot) {
    if (!node || !node.id) return null;
    var next = Object.assign({}, node);
    next.org_id = next.org_id || groveOrgId();
    next.grove_graft = true;
    next.grove_graft_root = !!isRoot;
    next.children = (node.children || []).map(function (kid) {
      return markGroveGraftNodes(kid, false);
    }).filter(Boolean);
    return next;
  }

  function forestHasPerson(nodes, id) {
    var found = false;
    function walk(list) {
      (list || []).forEach(function (p) {
        if (!p || found) return;
        if (String(p.id) === String(id)) found = true;
        else walk(p.children);
      });
    }
    walk(nodes);
    return found;
  }

  async function attachEvergreenGroveGraft(roots) {
    var now = Date.now();
    var graft = groveGraftCache.root;
    if (!graft || now - groveGraftCache.at > 20000) {
      try {
        graft = Cloud.listGroveGraft ? await Cloud.listGroveGraft() : null;
      } catch (err) {
        graft = groveGraftCache.root;
      }
      groveGraftCache = { at: now, root: graft || null };
    }
    if (!graft || !graft.id) return roots || [];
    var marked = markGroveGraftNodes(graft, true);
    if (!marked) return roots || [];
    var next = (roots || []).slice();
    if (forestHasPerson(next, marked.id)) return next;
    next.push(marked);
    return next;
  }

  function teamTreeGrowDemoOn() {
    try {
      return /(?:^|[?&])demo=tree-grow(?:&|$)/.test(String(location.search || ""));
    } catch (e) {
      return false;
    }
  }

  function teamTreeGrowDemoGrove() {
    try {
      var hub = String(new URLSearchParams(location.search).get("hub") || "").trim().toLowerCase();
      return hub === "grove" || hub === "fresh-grove";
    } catch (e) {
      return false;
    }
  }

  function teamTreeGrowingCopy() {
    if (teamTreeGrowDemoOn()) {
      return teamTreeGrowDemoGrove() ? "Growing your grove…" : "Growing your tree…";
    }
    return packEvergreen() ? "Growing your tree…" : "Growing your grove…";
  }

  function teamTreeGrowingHtml(loop) {
    function sprout(n) {
      return '<svg class="team-tree-sprout is-' + n + '" viewBox="0 0 56 88" aria-hidden="true">' +
        '<ellipse class="soil" cx="28" cy="78" rx="20" ry="5.5"/>' +
        '<ellipse class="seed" cx="28" cy="74" rx="5.2" ry="3.6"/>' +
        '<path class="stem" d="M28 74 C27.4 62, 27.2 50, 28 40"/>' +
        '<path class="leaf leaf-l" d="M28 52 C20 50, 15 44, 16 38 C22 40, 26 45, 28 50Z"/>' +
        '<path class="leaf leaf-r" d="M28 48 C36 46, 42 40, 41 34 C35 36, 30 42, 28 47Z"/>' +
        "</svg>";
    }
    return '<div class="team-tree-growing' + (loop ? " is-loop" : "") + '" role="status" aria-live="polite">' +
      '<div class="team-tree-growing-row">' + sprout(1) + sprout(2) + sprout(3) + "</div>" +
      '<p class="team-tree-growing-copy">' + teamTreeGrowingCopy() + "</p>" +
      "</div>";
  }

  function teamTreeHasPaintedTree(el) {
    return !!(el && el.querySelector && el.querySelector(".live-team, .live-l1-list"));
  }

  function teamTreeIsGrowing(el) {
    return !!(el && el.querySelector && el.querySelector(".team-tree-growing"));
  }

  function teamPageForGraph(el) {
    if (el && el.id === "evergreenTeamGraph") return $("panel-ev-team");
    return $("panel-leader");
  }

  function paintTeamTreeGrowing(el, loop) {
    if (!el) return;
    el.hidden = false;
    if (!teamTreeIsGrowing(el)) el.innerHTML = teamTreeGrowingHtml(loop !== false);
    var panel = teamPageForGraph(el);
    if (panel) panel.classList.add("is-team-growing");
  }

  function endTeamPageGrowing(el) {
    var panel = teamPageForGraph(el);
    if (panel) panel.classList.remove("is-team-growing");
  }

  function beginTeamPageGrowing(grove) {
    if (teamTreeGrowDemoOn()) {
      showTeamTreeGrowDemo();
      return;
    }
    var el = grove ? $("liveTeamGraph") : $("evergreenTeamGraph");
    if (!el || teamTreeHasPaintedTree(el)) return;
    paintTeamTreeGrowing(el, true);
  }

  function showTeamTreeGrowDemo() {
    var grove = teamTreeGrowDemoGrove();
    document.body.classList.toggle("pack-evergreen", !grove);
    document.body.classList.toggle("pack-grove", grove);
    try {
      var gate = document.getElementById("onboarding");
      if (gate) gate.classList.remove("open");
      var tour = document.getElementById("tour");
      if (tour) tour.classList.remove("open");
      document.body.classList.remove("overlay-open");
    } catch (eGate) {}
    try {
      if (window.FS.applyPackChrome) window.FS.applyPackChrome();
    } catch (eChrome) {}
    var dest = grove ? "leader" : "ev-team";
    var panelId = grove ? "panel-leader" : "panel-ev-team";
    var graphId = grove ? "liveTeamGraph" : "evergreenTeamGraph";
    try {
      var st = getState && getState();
      if (st) st.active = dest;
    } catch (eState) {}
    var panels = document.querySelectorAll(".panel");
    for (var i = 0; i < panels.length; i++) {
      var on = panels[i].id === panelId;
      panels[i].classList.toggle("active", on);
      if (on) panels[i].removeAttribute("hidden");
    }
    paintTeamTreeGrowing($(graphId), true);
  }

  async function renderEvergreenTeamGraph(opts) {
    opts = opts || {};
    var el = $("evergreenTeamGraph");
    if (!el) return;
    if (teamTreeGrowDemoOn()) {
      showTeamTreeGrowDemo();
      return;
    }
    if (!canSeeEvergreenRoster() && !canSeeEvergreenLeaderTree()) {
      hideEvergreenTeamGraph();
      return;
    }
    if (!opts.light && !teamTreeHasPaintedTree(el)) paintTeamTreeGrowing(el, true);
    var downP = (opts.light && lastTeamGraphPaint && lastTeamGraphPaint.downline)
      ? Promise.resolve(lastTeamGraphPaint.downline)
      : Cloud.listDownline().catch(function () { return []; });
    var packed = [];
    if (canSeeEvergreenRoster()) {
      packed = await Promise.all([downP, ensureAdminProfiles()]);
      var downline = packed[0] || [];
      (downline || []).forEach(function (row) {
        if (!row || !row.profile || !row.profile.id) return;
        supportProfileByPartner[row.profile.id] = {
          name: personLabel(row.profile),
          support: row.support_preferences || null,
          allowed: true
        };
      });
      var roots = await attachEvergreenGroveGraft(buildOrgForest(evergreenOrgId()));
      await renderLiveTeamGraph({ roots: roots, depth: 8 }, downline, {
        el: el,
        evergreen: true,
        keepFindFocus: !!opts.keepFindFocus
      });
      return;
    }
    packed = await Promise.all([
      downP,
      Cloud.listTeamGraph().catch(function () { return { roots: [], depth: 6 }; })
    ]);
    var rows = packed[0] || [];
    var graph = packed[1] || { roots: [], depth: 6 };
    (rows || []).forEach(function (row) {
      if (!row || !row.profile || !row.profile.id) return;
      supportProfileByPartner[row.profile.id] = {
        name: personLabel(row.profile),
        support: row.support_preferences || null,
        allowed: true
      };
    });
    if (!opts.light) {
      evProgressCache = {};
      evProgressLoaded = false;
      (rows || []).forEach(function (row) {
        if (!row || !row.profile || !row.profile.id) return;
        evProgressCache[row.profile.id] = row.progress || { done: {} };
      });
    }
    graph = ensureGraphIncludesDownline(graph, rows);
    await renderLiveTeamGraph(graph, rows, {
      el: el,
      evergreen: true,
      subtree: true,
      keepFindFocus: !!opts.keepFindFocus
    });
  }

  async function renderLiveTeamGraph(graphPrefetch, downlineRows, opts) {
    opts = opts || {};
    var evergreen = !!opts.evergreen;
    var subtree = !!opts.subtree;
    var el = opts.el || $("liveTeamGraph");
    if (!el) return;
    if (!Cloud.isSignedIn()) {
      el.hidden = true;
      endTeamPageGrowing(el);
      return;
    }
    if (!subtree) await ensureAdminProfiles();
    var leaderIds = groveLeaderIdMap();
    var graph = graphPrefetch;
    if (!graph) {
      try {
        graph = await Cloud.listTeamGraph();
      } catch (e) {
        graph = { roots: [], depth: 6 };
      }
    }
    var progressById = {};
    var downlineById = {};
    (downlineRows || []).forEach(function (row) {
      progressById[row.profile.id] = progressCtx(row, window.FS.CONFIG);
      downlineById[row.profile.id] = row;
    });
    var roots = (graph.roots || []).slice();
    if (!evergreen) {
      /* Prefer downline as source of truth for who should appear at L1 */
      var patched = ensureGraphIncludesDownline({ roots: roots, depth: graph.depth || 6 }, downlineRows || []);
      roots = (patched.roots || []).slice();
      /* Fill join dates from downline if a node is missing created_at */
      roots.forEach(function (p) {
        var down = downlineById[p.id] && downlineById[p.id].profile;
        if (!down) return;
        if (!p.created_at && down.created_at) p.created_at = down.created_at;
        if (down.is_org_admin) p.is_org_admin = true;
        if (down.org_id) p.org_id = down.org_id;
      });
      function pruneEvergreenNodes(nodes) {
        var out = [];
        (nodes || []).forEach(function (p) {
          var kids = pruneEvergreenNodes(p.children);
          if (personIsEvergreenOrg(p)) {
            for (var i = 0; i < kids.length; i++) out.push(kids[i]);
          } else {
            p.children = kids;
            out.push(p);
          }
        });
        return out;
      }
      roots = pruneEvergreenNodes(roots);
    }
    var sortMode = teamSortMode();
    sortTeamNodes(roots, sortMode);
    lastTeamGraphPaint = {
      graph: { roots: roots, depth: graph.depth || 6 },
      downline: downlineRows || [],
      opts: { el: el, evergreen: evergreen, subtree: subtree }
    };
    var findQ = String(teamTreeFindQ || "").trim().toLowerCase();
    var findId = evergreen ? "evergreenTeamFind" : "groveTeamFind";
    if (findQ) {
      roots = roots.filter(function (p) { return teamNodeMatchesFind(p, findQ); });
    }
    if (!roots.length && !evergreen && !findQ) {
      el.hidden = true;
      el.innerHTML = "";
      endTeamPageGrowing(el);
      return;
    }

    if (evergreen) {
      var evFlat = flattenTeamGraph(roots).filter(function (row) {
        return row && row.profile && !row.profile.grove_graft;
      });
      countUnseenTeamJoins(evFlat);
      rememberNewForThisVisit(evFlat);
      markTeamJoinsSeen(evFlat);
    }

    teamPersonCache = {};
    var adminById = {};
    (adminProfileCache || []).forEach(function (row) {
      if (row && row.id) adminById[row.id] = row;
    });
    if (evergreen && !subtree) {
      (adminProfileCache || []).forEach(function (p) {
        if (!p || !p.id) return;
        if (personIsEvergreenOrg(p)) cacheRosterPerson(p, true);
      });
    }

    function cachePerson(p, under, ctx, isDirect) {
      var admin = adminById[p.id] || null;
      var down = downlineById[p.id] && downlineById[p.id].profile;
      var orgId = p.org_id || (admin && admin.org_id) || (down && down.org_id) || "";
      if (orgId) p.org_id = orgId;
      if (admin && typeof admin.is_org_admin === "boolean") p.is_org_admin = !!admin.is_org_admin;
      else if (down && down.is_org_admin) p.is_org_admin = true;
      var isLeader = evergreen
        ? personIsEvergreenOrg(p) && !!(p.is_org_admin || p.is_hub_admin || (admin && (admin.is_org_admin || admin.is_hub_admin)))
        : personIsGroveLeader(p, leaderIds);
      if (!evergreen && Cloud.isSuperAdmin && Cloud.isSuperAdmin() && admin && admin.email && !p.email) {
        p.email = admin.email;
      }
      teamPersonCache[p.id] = {
        id: p.id,
        display_name: p.display_name,
        last_name: p.last_name || "",
        email: String((p.email ||
          (!evergreen && Cloud.isSuperAdmin && Cloud.isSuperAdmin() && admin && admin.email) ||
          (down && down.email) || "")).trim(),
        hub_mode: p.hub_mode,
        created_at: p.created_at || (down && down.created_at) || "",
        last_active_at: p.last_active_at,
        daysSinceActive: ctx ? ctx.daysSinceActive : (p.last_active_at ? Math.max(0, calendarDaysBetween(new Date(p.last_active_at), new Date())) : null),
        sectionsDone: ctx ? ctx.sectionsDone : null,
        sectionTotal: ctx ? ctx.sectionTotal : null,
        under: under,
        isDirect: !!isDirect,
        is_org_admin: !!p.is_org_admin,
        is_hub_admin: !!(p.is_hub_admin || (admin && admin.is_hub_admin)),
        is_super_admin: !!(admin && admin.is_super_admin),
        org_id: orgId,
        grove_graft: !!p.grove_graft,
        grove_graft_root: !!p.grove_graft_root,
        sponsor_id: p.sponsor_id || (admin && admin.sponsor_id) || null,
        photo_at: p.photo_at || (down && down.photo_at) || null,
        photo_ext: p.photo_ext || (down && down.photo_ext) || "webp"
      };
      if (isLeader) teamPersonCache[p.id].is_org_admin = true;
      if (evergreen) {
        var evp = evProgressFor(p.id);
        if (evp) teamPersonCache[p.id].evProgress = evp;
      }
    }

    function renderKids(nodes, depth) {
      if (!nodes || !nodes.length) return "";
      var COLLAPSE_AT = 5; /* big branches start closed — tap + to open */
      var html = '<ul class="live-team-kids depth-' + Math.min(depth, 6) + '">';
      nodes.forEach(function (p) {
        var under = typeof p._under === "number" ? p._under : countTreeDesc(p.children);
        var kids = p.children || [];
        var hasKids = kids.length > 0;
        cachePerson(p, under, null, false);
        var defaultOpen = hasKids && under <= COLLAPSE_AT;
        var startOpen = hasKids && (teamFoldIsOpen(p.id, defaultOpen) ||
          (!!findQ && teamNodeMatchesFind(p, findQ)));
        var isNew = personIsTeamNew(p);
        var nameHit = !!findQ && teamNodeSelfMatch(p, findQ);
        html += '<li class="live-team-node">';
        html += '<div class="live-team-branch' + (hasKids ? " has-kids" : "") + (isNew ? " is-new" : "") +
          (hasKids && startOpen ? " is-open" : "") + '" data-team-branch="' + esc(p.id) + '">';
        html += '<div class="live-team-sum' + (hasKids ? "" : " is-static") + '">';
        html += evergreen
          ? '<span class="live-team-sprout" aria-hidden="true">🌱</span>'
          : personPhotoHtml(p, "sm");
        html += '<span class="live-team-main">';
        html += '<button type="button" class="live-team-name' + (nameHit ? " is-find" : "") +
          '" data-team-person="' + esc(p.id) + '">' +
          esc(personLabel(p)) +
          (evergreen
            ? (personIsEvergreenOrg(p) && (p.is_org_admin || p.is_hub_admin) ? groveLeaderStarHtml(p.is_hub_admin ? "Evergreen Admin" : "Evergreen Leader") : "")
            : (personIsGroveLeader(p, leaderIds) ? groveLeaderStarHtml("Grove Leader") : "")) +
          "</button>";
        if (evergreen && p.grove_graft_root) {
          html += '<span class="team-mode-chip is-grove">The Fresh Grove</span>';
        }
        html += evergreen ? "" : hubModeChipHtml(p.hub_mode);
        if (isNew) html += '<span class="team-new-chip">New</span>';
        if (hasKids) {
          html += '<span class="live-team-under-n">' + under + " under</span>";
        }
        html += "</span>";
        if (hasKids) {
          html += '<button type="button" class="live-team-expand" data-team-fold="' + esc(p.id) +
            '" data-under="' + under + '" aria-expanded="' + (startOpen ? "true" : "false") +
            '" aria-label="' + (startOpen ? "Hide " : "Show ") + under + ' under"></button>';
        }
        html += "</div>";
        if (hasKids) html += renderKids(kids, depth + 1);
        html += "</div></li>";
      });
      html += "</ul>";
      return html;
    }

    var total = countTreeDesc(roots);
    var l1 = roots.length;
    var deep = maxTeamDepth(roots);
    var rearrangeOn = teamRearrangeOn();
    el.hidden = false;
    var html = '<div class="live-team-head">';
    html += '<div class="live-tag">' +
      (evergreen && !subtree ? "THE TEAM TREE" : "YOUR GROWING TEAM") + "</div>";
    html += '<div class="live-team-tools">';
    html += '<label class="live-team-find-wrap"><span class="sr-only">Find someone on the tree</span>';
    html += '<input type="search" class="live-team-find" id="' + findId +
      '" placeholder="Find a name" value="' + esc(teamTreeFindQ) + '" autocomplete="off"></label>';
    html += '<div class="live-team-sort" role="group" aria-label="Sort team tree">';
    html += '<button type="button" class="live-team-sort-btn' + (sortMode === "legs" ? " on" : "") + '" data-team-sort="legs">Most legs</button>';
    html += '<button type="button" class="live-team-sort-btn' + (sortMode === "newest" ? " on" : "") + '" data-team-sort="newest">Newest</button>';
    html += "</div></div></div>";
    if (canRearrangeCurrentTeam() && rearrangeOn) {
      html += '<p class="team-admin-hint">' + (evergreen
        ? (subtree
          ? "Tap a person → Move under… Place them under you or anyone on your tree. Top of my team puts them under you."
          : "Tap a person → Move under… Place them under a leader or anyone else on Evergreen.")
        : "Tap a person → Move under… Mentoring follows the new Level 1. Invited-by stays the same.") + "</p>";
    }
    html += '<p class="live-team-lead">Tap a name for their details. A <strong>+</strong> means they have people under them. A ★ means they’re ' +
      (evergreen ? "an Evergreen Leader" : "a Grove Leader") + ".</p>";
    html += '<div class="live-team-stats is-compact">';
    html += '<div class="live-stat"><strong>' + l1 + '</strong><span>Level 1</span></div>';
    html += '<div class="live-stat"><strong>' + total + '</strong><span>on tree</span></div>';
    html += '<div class="live-stat"><strong>' + deep + '</strong><span>deep</span></div>';
    html += "</div>";
    if (evergreen && !subtree) html += evergreenAdminsRowHtml();
    html += '<div class="live-team">';
    html += '<div class="live-team-you-row">';
    html += '<div class="live-team-you">';
    if (evergreen) {
      html += '<span class="live-team-you-mark" aria-hidden="true">🌿</span> ' +
        (subtree ? "You" : "Evergreen Co");
    } else {
      html += personPhotoHtml(Cloud.user() || {}, "sm") + " You";
    }
    html += "</div>";
    if (canRearrangeCurrentTeam()) {
      html += '<div class="live-team-you-actions">';
      html += '<button type="button" class="team-rearrange-btn' + (rearrangeOn ? " on" : "") +
        '" id="' + (evergreen ? "evergreenRearrangeToggle" : "teamRearrangeToggle") +
        '" aria-pressed="' + (rearrangeOn ? "true" : "false") + '">' +
        (rearrangeOn ? "Done" : "Rearrange") + "</button>";
      html += "</div>";
    }
    html += "</div>";
    html += '<div class="live-l1-list">';
    if (evergreen && !roots.length) {
      html += '<p class="live-l1-empty" style="padding:4px 0 8px">' +
        (findQ
          ? "No one on the tree matches that name."
          : "Nobody on the tree yet. Share your join link from Resources or Settings.") +
        "</p>";
    }
    roots.forEach(function (p, idx) {
      var under = typeof p._under === "number" ? p._under : countTreeDesc(p.children);
      var ctx = progressById[p.id];
      if (!p.created_at && downlineById[p.id]) {
        p.created_at = downlineById[p.id].profile.created_at;
      }
      cachePerson(p, under, ctx, evergreen ? !!downlineById[p.id] : true);
      if (downlineById[p.id] && downlineById[p.id].profile) {
        copyPhotoFields(downlineById[p.id].profile, p);
      }
      var isNew = personIsTeamNew(p);
      var hasKids = !!(under && p.children && p.children.length);
      var l1Open = hasKids && (teamFoldIsOpen(p.id, false) || (!!findQ && teamNodeMatchesFind(p, findQ)));
      var l1Hit = !!findQ && teamNodeSelfMatch(p, findQ);
      html += '<div class="live-l1' + (hasKids ? " has-kids" : "") + (isNew ? " is-new" : "") +
        (l1Open ? " is-open" : "") + '" data-team-branch="' + esc(p.id) + '">';
      html += '<div class="live-l1-sum' + (hasKids ? "" : " is-static") + '">';
      html += '<span class="live-l1-rank">' + (idx + 1) + "</span>";
      html += evergreen ? "" : personPhotoHtml(p);
      html += '<span class="live-l1-main">';
      html += '<span class="live-l1-name-row">';
      html += '<button type="button" class="live-l1-name' + (l1Hit ? " is-find" : "") +
        '" data-team-person="' + esc(p.id) + '">' +
        esc(personLabel(p)) +
        (evergreen
          ? (personIsEvergreenOrg(p) && (p.is_org_admin || p.is_hub_admin) ? groveLeaderStarHtml(p.is_hub_admin ? "Evergreen Admin" : "Evergreen Leader") : "")
          : (personIsGroveLeader(p, leaderIds) ? groveLeaderStarHtml("Grove Leader") : "")) +
        "</button>";
      if (evergreen && (p.grove_graft_root || personIsFreshGroveOrg(p))) {
        html += '<span class="team-mode-chip is-grove">The Fresh Grove</span>';
      }
      html += evergreen ? "" : hubModeChipHtml(p.hub_mode);
      if (isNew) html += '<span class="team-new-chip">New</span>';
      html += "</span>";
      if (evergreen) {
        var evp = evProgressFor(p.id);
        html += '<span class="live-l1-meta">' +
          (evp ? esc(evp.label) : "On the team") +
          (p.created_at ? " · joined " + formatJoinedOn(p.created_at) : "") + "</span>";
      } else if (ctx) {
        html += '<span class="live-l1-meta">' + ctx.sectionsDone + "/" + ctx.sectionTotal + " sections · " +
          (ctx.daysSinceActive === 0 ? "active today" : ctx.daysSinceActive + "d ago") +
          (p.created_at ? " · joined " + formatJoinedOn(p.created_at) : "") + "</span>";
      } else {
        html += '<span class="live-l1-meta">Joined your link' +
          (p.created_at ? " · " + formatJoinedOn(p.created_at) : "") + "</span>";
      }
      html += "</span>";
      if (hasKids) {
        html += '<button type="button" class="live-l1-expand" data-team-fold="' + esc(p.id) +
          '" data-under="' + under + '" aria-expanded="' + (l1Open ? "true" : "false") +
          '" aria-label="' + (l1Open ? "Hide " : "Show ") + under + ' under"></button>';
      }
      html += "</div>";
      if (hasKids) html += renderKids(p.children, 2);
      html += "</div>";
    });
    html += "</div></div>";
    el.innerHTML = html;
    endTeamPageGrowing(el);
    var findEl = $(findId);
    if (findEl && (opts.keepFindFocus || (document.activeElement && document.activeElement.id === findId))) {
      try {
        findEl.focus();
        var caret = String(teamTreeFindQ || "").length;
        findEl.setSelectionRange(caret, caret);
      } catch (eFocus) {}
    }
  }

  async function renderLeaderNoteBanner() {
    var el = $("leaderNoteBanner");
    if (!el) return;
    if (!Cloud.isSignedIn()) {
      el.hidden = true;
      return;
    }
    var notes = await Cloud.myLeaderNotes();
    var active = getState ? getState().active : "welcome";
    var note = null;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].section_id === active || notes[i].section_id === "welcome") {
        note = notes[i];
        if (notes[i].section_id === active) break;
      }
    }
    if (!note || !note.body) {
      el.hidden = true;
      return;
    }
    var dismissed = (getState && getState().data && getState().data.dismissedLeaderNotes) || {};
    var noteKey = String(note.section_id || "welcome") + "|" + String(note.created_at || note.body || "");
    if (dismissed[noteKey]) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML = '<div class="cheer-copy"><div class="live-tag">NOTE FROM YOUR LEADER</div><p class="body-p" style="margin:0">' +
      esc(note.body) + '</p></div><button type="button" class="cheer-dismiss" id="leaderNoteDismiss">Got it</button>';
  }

  var lastIncomingAt = 0;
  var lastProfileOrgAt = 0;
  var orgEventJoinTick = 0;
  var gatheringBannerLinkOpenKey = "";
  var groveGraftCache = { at: 0, root: null };
  function refreshIncomingMessages(opts) {
    if (!Cloud.isSignedIn()) return;
    opts = opts || {};
    var now = Date.now();
    if (!opts.force && lastIncomingAt && now - lastIncomingAt < 10000) return;
    lastIncomingAt = now;
    if (Cloud.touchActive) Cloud.touchActive().catch(function () {});
    renderCheers().catch(function () {});
    renderLeaderNoteBanner().catch(function () {});
    refreshGroveBoardPip().catch(function () {});
    refreshOrgEvents().then(function () {
      renderGatheringBanner();
    }).catch(function () {
      renderGatheringBanner();
    });
  }

  function openCalSheet() {
    var sheet = $("calSheet");
    if (!sheet) return;
    closeAllSheets("cal");
    sheet.hidden = false;
    document.body.classList.add("cal-sheet-open");
    armSheetDismiss();
  }

  function closeCalSheet() {
    flushTodoEditor();
    var sheet = $("calSheet");
    if (!sheet) return;
    sheet.hidden = true;
    document.body.classList.remove("cal-sheet-open");
    var st = getState();
    var dirty = false;
    if (st && st.data) {
      if (st.data.calendarEditing) { st.data.calendarEditing = null; dirty = true; }
      if (st.data.libraryEditing) { st.data.libraryEditing = null; dirty = true; }
      if (st.data.orgEventEditing) { st.data.orgEventEditing = null; dirty = true; }
    }
    if (dirty && persist) persist();
    setCalSheetOrgMode(false);
  }

  function setSheetKicker(text) {
    var kicker = document.querySelector("#calSheet .cal-sheet-kicker");
    if (kicker) kicker.textContent = text || "Card";
  }

  function selectedDayLabel(st) {
    var selectedKey = (st && st.data.calendarSelected) || Cal.ymd(new Date());
    try {
      var dt = Cal.parseYmd(selectedKey);
      return Cal.DOW[dt.getDay()] + " · " + Cal.MON[dt.getMonth()] + " " + dt.getDate();
    } catch (e) {
      return selectedKey;
    }
  }

  function cadenceEnabled(st) {
    return st.data.calendarCadence === true;
  }

  function weekStartPref(st) {
    return st && st.settings && st.settings.weekStartsOn === "monday" ? 1 : 0;
  }

  function calendarBoardIsOpen(st) {
    /* Evergreen hides the +/− chevron, so a collapsed board looks like
       “my calendar is gone” with no way back. Keep it open there. */
    if (packEvergreen()) return true;
    return !st || !st.data || st.data.calendarBoardOpen !== false;
  }

  function calendarDetailIsOpen(st) {
    return !!(st && st.data && st.data.calendarDetailOpen);
  }

  function syncCalendarBoardChrome(st) {
    var board = $("calendarBoard");
    var toggle = $("calendarBoardToggle");
    var evergreen = packEvergreen();
    if (evergreen && st && st.data && st.data.calendarBoardOpen === false) {
      st.data.calendarBoardOpen = true;
    }
    var open = calendarBoardIsOpen(st);
    if (board) board.classList.toggle("is-collapsed", !open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (evergreen) {
        toggle.setAttribute("aria-disabled", "true");
        toggle.setAttribute("tabindex", "-1");
      } else {
        toggle.removeAttribute("aria-disabled");
        toggle.removeAttribute("tabindex");
      }
    }
  }

  function renderTypeChips(selected) {
    var types = Cal.EDITOR_TYPES || [];
    var group = Cal.editorTypeId ? Cal.editorTypeId(selected) : selected;
    return '<div class="cal-type-picks" role="group" aria-label="Card type">' +
      types.map(function (t) {
        return '<button type="button" class="cal-type-pick' + (t.id === group ? " on" : "") +
          '" data-cal-type="' + t.id + '">' + esc(t.label) + "</button>";
      }).join("") +
      "</div>";
  }

  function vaultMeta() {
    return window.FS.CONTENT_VAULT || { formats: [], promoting: [], contentTypes: [], posts: [], stories: [], hookBank: [], weekPlan: [] };
  }

  var vaultFileSnapshot = null;
  var vaultEditsCache = [];
  var vaultEditsLoadedAt = 0;

  function snapshotVaultFile() {
    if (vaultFileSnapshot) return vaultFileSnapshot;
    var V = window.FS.CONTENT_VAULT;
    if (!V) return { posts: [], stories: [] };
    var posts = V.posts || [];
    var stories = V.stories || [];
    if (!posts.length && !stories.length) return { posts: [], stories: [] };
    vaultFileSnapshot = {
      posts: JSON.parse(JSON.stringify(posts)),
      stories: JSON.parse(JSON.stringify(stories))
    };
    return vaultFileSnapshot;
  }

  function originalVaultPost(id) {
    var snap = snapshotVaultFile();
    var i;
    for (i = 0; i < snap.posts.length; i++) if (snap.posts[i].id === id) return snap.posts[i];
    for (i = 0; i < snap.stories.length; i++) if (snap.stories[i].id === id) return snap.stories[i];
    return null;
  }

  function vaultPreviewFrom(post) {
    var hook = (post && post.hook) || "";
    var cap = (post && post.caption) || "";
    if (!cap) return hook;
    return hook + " — " + String(cap).replace(/\s+/g, " ").trim().slice(0, 92);
  }

  function applyVaultPatch(post, patch) {
    if (!post || !patch || typeof patch !== "object") return;
    ["title", "hook", "caption", "format", "promoting", "contentType", "whyFrame1"].forEach(function (k) {
      if (typeof patch[k] === "string") post[k] = patch[k];
    });
    ["altHooks", "slides", "onScreen", "frames", "keywords"].forEach(function (k) {
      if (Array.isArray(patch[k])) post[k] = patch[k].slice();
    });
    post.body = post.caption || post.body || "";
    post.preview = vaultPreviewFrom(post);
    post._liveEdit = true;
  }

  function applyVaultEdits(rows) {
    var snap = snapshotVaultFile();
    var live = window.FS.CONTENT_VAULT;
    if (!live) return;
    live.posts = JSON.parse(JSON.stringify(snap.posts));
    live.stories = JSON.parse(JSON.stringify(snap.stories));
    vaultEditsCache = Array.isArray(rows) ? rows : [];
    vaultEditsCache.forEach(function (row) {
      var id = row && row.vault_id;
      var patch = row && row.patch;
      if (!id || !patch) return;
      if (typeof patch === "string") {
        try { patch = JSON.parse(patch); } catch (eParse) { return; }
      }
      if (!patch || typeof patch !== "object") return;
      var post = null;
      var i;
      for (i = 0; i < live.posts.length; i++) if (live.posts[i].id === id) post = live.posts[i];
      if (!post) {
        for (i = 0; i < live.stories.length; i++) if (live.stories[i].id === id) post = live.stories[i];
      }
      if (post) applyVaultPatch(post, patch);
    });
  }

  function refreshVaultSurfaces() {
    var st = getState && getState();
    if (!st) return;
    if (st.active === "content-vault") renderContentVault();
    if (st.active === "content-week") renderContentWeek();
    if (document.body.classList.contains("cal-sheet-open") && st.data && st.data.libraryEditing && st.data.libraryEditing.vaultId) {
      renderVaultEditor();
    }
  }

  async function loadVaultEdits(force) {
    snapshotVaultFile();
    if (!Cloud.listVaultEdits) return;
    if (!force && vaultEditsLoadedAt && Date.now() - vaultEditsLoadedAt < 20000) return;
    try {
      var rows = await Cloud.listVaultEdits();
      vaultEditsLoadedAt = Date.now();
      applyVaultEdits(rows);
      refreshVaultSurfaces();
    } catch (err) {
      console.warn("[First Seeds] vault edits:", err);
    }
  }
  snapshotVaultFile();

  function renderFormatOptions(selected) {
    var opts = vaultMeta().formats || [];
    var html = '<option value="">—</option>';
    opts.forEach(function (f) {
      html += '<option value="' + esc(f.id) + '"' + (f.id === selected ? " selected" : "") + ">" + esc(f.label) + "</option>";
    });
    return html;
  }

  function renderPromotingOptions(selected) {
    var opts = vaultMeta().promoting || [];
    var html = '<option value="">—</option>';
    opts.forEach(function (f) {
      html += '<option value="' + esc(f.id) + '"' + (f.id === selected ? " selected" : "") + ">" + esc(f.label) + "</option>";
    });
    return html;
  }

  function promotingLabel(id) {
    var opts = vaultMeta().promoting || [];
    for (var i = 0; i < opts.length; i++) if (opts[i].id === id) return opts[i].label;
    return id || "";
  }

  function formatLabel(id) {
    var opts = vaultMeta().formats || [];
    for (var i = 0; i < opts.length; i++) if (opts[i].id === id) return opts[i].label;
    return id || "";
  }

  function contentTypeLabel(id) {
    var opts = vaultMeta().contentTypes || [];
    for (var i = 0; i < opts.length; i++) if (opts[i].id === id) return opts[i].label;
    return id || "";
  }

  function contentTypeToCalType(ct) {
    if (ct === "soft_invite") return "soft_door";
    if (ct === "review") return "product_curious";
    if (ct === "personal") return "values_flag";
    if (ct === "myth_bust") return "curtain";
    if (ct === "engagement") return "open_loop";
    return "honest_note";
  }

  function calTypeToContentType(type) {
    if (type === "soft_door") return "soft_invite";
    if (type === "product_curious") return "review";
    if (type === "values_flag") return "personal";
    if (type === "curtain") return "myth_bust";
    if (type === "open_loop") return "engagement";
    return "education";
  }

  var calItemLocalFiles = {};
  var FRAME_MAX = 8;

  function persistedFrames(item) {
    var list = (item && item.frames) || [];
    if (!Array.isArray(list) || !list.length) {
      if (Cal.parseFrames) list = Cal.parseFrames(item || {});
      else list = [];
    }
    return list.filter(function (f) {
      return f && (f.imageId || (f.src && String(f.src).indexOf("blob:") !== 0));
    }).slice(0, FRAME_MAX);
  }

  function localFilesForItem(itemId) {
    if (!itemId) return [];
    if (!calItemLocalFiles[itemId]) calItemLocalFiles[itemId] = [];
    return calItemLocalFiles[itemId];
  }

  function resolveFrameSrc(frame) {
    if (!frame) return "";
    if (frame.imageId && Cal.resolveCuriosityImage) {
      var r = Cal.resolveCuriosityImage(frame.imageId);
      if (r) return r.thumb || r.src;
    }
    return frame.src || "";
  }

  function framesForItem(item) {
    var frames = persistedFrames(item).map(function (f) {
      return { src: resolveFrameSrc(f) || f.src || "", imageId: f.imageId || "", local: false };
    });
    var extras = item && item.id ? localFilesForItem(item.id) : [];
    extras.forEach(function (file, i) {
      if (frames.length >= FRAME_MAX) return;
      var url = "";
      try { url = URL.createObjectURL(file); } catch (e) {}
      frames.push({ src: url, imageId: "", local: true, localIndex: i });
    });
    return frames;
  }

  function syncItemCover(item) {
    if (!item) return;
    item.frames = persistedFrames(item);
    var first = item.frames[0];
    if (first) {
      item.imageId = first.imageId || "";
      item.image = first.src || item.image || "";
    } else if (!localFilesForItem(item.id).length) {
      item.imageId = "";
      item.image = "";
    }
  }

  function addLibraryFrame(item, imageId) {
    if (!item || !imageId) return false;
    var frames = persistedFrames(item);
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].imageId === imageId) return false;
    }
    if (frames.length + localFilesForItem(item.id).length >= FRAME_MAX) return false;
    var resolved = Cal.resolveCuriosityImage ? Cal.resolveCuriosityImage(imageId) : null;
    frames.push({ src: resolved ? resolved.src : "", imageId: imageId });
    item.frames = frames;
    syncItemCover(item);
    return true;
  }

  function removePersistedFrame(item, index) {
    if (!item) return;
    var frames = persistedFrames(item);
    if (index < 0 || index >= frames.length) return;
    frames.splice(index, 1);
    item.frames = frames;
    syncItemCover(item);
  }

  function photoPickState() {
    var st = getState && getState();
    if (!st || !st.data) return null;
    return st.data.photoPick || null;
  }

  function setPhotoPick(pick) {
    var st = getState && getState();
    if (!st || !st.data) return;
    st.data.photoPick = pick || null;
    if (persist) persist();
  }

  function frameCountForPick() {
    var pick = photoPickState();
    if (!pick) return 0;
    if (pick.kind === "shelf") return groveShelfFiles.length;
    var st = getState();
    if (!st || !pick.date || !pick.itemId) return 0;
    var day = st.data.calendar && st.data.calendar[pick.date];
    var item = null;
    if (day && day.items) {
      for (var i = 0; i < day.items.length; i++) {
        if (day.items[i].id === pick.itemId) item = day.items[i];
      }
    }
    return item ? framesForItem(item).length : 0;
  }

  async function srcToFile(src, name) {
    var res = await fetch(src);
    if (!res.ok) throw new Error("Couldn’t read that photo.");
    var blob = await res.blob();
    var type = blob.type || "image/jpeg";
    var ext = type.indexOf("png") > -1 ? "png" : (type.indexOf("webp") > -1 ? "webp" : "jpg");
    return new File([blob], (name || "frame") + "." + ext, { type: type });
  }

  async function filesFromCard(item) {
    var files = [];
    var seen = {};
    function remember(file) {
      if (!file) return;
      files.push(file);
    }
    var locals = item && item.id ? localFilesForItem(item.id).slice() : [];
    locals.forEach(remember);
    var frames = persistedFrames(item);
    for (var i = 0; i < frames.length && files.length < FRAME_MAX; i++) {
      var f = frames[i];
      var src = "";
      if (f.imageId && Cal.resolveCuriosityImage) {
        var r = Cal.resolveCuriosityImage(f.imageId);
        src = r ? r.src : "";
      } else {
        src = f.src || "";
      }
      if (!src || src.indexOf("blob:") === 0) continue;
      if (seen[src]) continue;
      seen[src] = true;
      try {
        remember(await srcToFile(src, "frame-" + (files.length + 1)));
      } catch (e) {}
    }
    if (!frames.length && item && (item.imageId || item.image) && files.length < FRAME_MAX) {
      var cover = "";
      if (item.imageId && Cal.resolveCuriosityImage) {
        var cr = Cal.resolveCuriosityImage(item.imageId);
        cover = cr ? cr.src : "";
      }
      if (!cover) cover = item.image || "";
      if (cover && cover.indexOf("blob:") !== 0) {
        try { remember(await srcToFile(cover, "frame-1")); } catch (e2) {}
      }
    }
    return files.slice(0, FRAME_MAX);
  }

  function shelfOfferHtml(item) {
    if (packEvergreen() || !Cloud.isSignedIn || !Cloud.isSignedIn()) return "";
    if (!item) return "";
    if (item.vaultId) return "";
    if (item.groveShareId) {
      return '<p class="cal-lib-hint" style="margin-top:12px">On the team shelf — waiting for a look, or already live.</p>';
    }
    return '<div class="shelf-offer" id="shelfOffer">' +
      '<button type="button" class="btn-ghost" data-cal-to-shelf>Add to the team library</button>' +
      "</div>";
  }

  function calFramesHtml(item) {
    var frames = framesForItem(item);
    var html = '<div class="field cal-frames" id="calFrames">';
    html += '<span class="field-label">Photos / sequence</span>';
    html += '<div class="shelf-file-row" id="calFrameRow">';
    frames.forEach(function (f, i) {
      html += '<div class="shelf-file-thumb">';
      if (f.src) html += '<img src="' + esc(f.src) + '" alt="">';
      html += '<button type="button" data-cal-remove-frame="' + (f.local ? "local:" + f.localIndex : "keep:" + i) +
        '" aria-label="Remove">×</button></div>';
    });
    html += "</div>";
    if (frames.length < FRAME_MAX) {
      html += '<div class="cal-sheet-actions" style="margin-top:8px">';
      html += '<button type="button" class="btn-ghost" data-cal-add-files>From camera roll</button>';
      html += '<button type="button" class="btn-ghost" data-cal-browse-photos>From the photo library</button>';
      html += "</div>";
      html += '<input type="file" id="calFrameFiles" accept="image/*" multiple hidden>';
    }
    html += '<span class="cal-lib-sheet-hint">Up to 8 frames.</span>';
    html += "</div>";
    return html;
  }

  function wireCalFrameFiles(itemId) {
    var input = $("calFrameFiles");
    if (!input || input.dataset.bound) return;
    input.dataset.bound = "1";
    input.addEventListener("change", function () {
      var picked = input.files || [];
      var bucket = localFilesForItem(itemId);
      var st = getState();
      var ed = st && st.data && st.data.calendarEditing;
      var item = null;
      if (ed) {
        var day = Cal.ensureDay(st.data.calendar, ed.date);
        for (var i = 0; i < day.items.length; i++) {
          if (day.items[i].id === itemId) item = day.items[i];
        }
      }
      var used = item ? framesForItem(item).length : bucket.length;
      for (var p = 0; p < picked.length && used < FRAME_MAX; p++) {
        bucket.push(picked[p]);
        used++;
      }
      input.value = "";
      persist();
      renderCalEditor();
    });
  }

  function buildVaultDraft(post) {
    if (!post) return "";
    var parts = [];
    if (post.hook) parts.push("HOOK\n" + post.hook);
    if (post.altHooks && post.altHooks.length) {
      parts.push("ALT HOOKS\n" + post.altHooks.map(function (h) { return "• " + h; }).join("\n"));
    }
    if (post.slides && post.slides.length) {
      parts.push("SLIDES\n" + post.slides.map(function (s, i) { return (i + 1) + ". " + s; }).join("\n"));
    }
    if (post.onScreen && post.onScreen.length) {
      parts.push("ON-SCREEN\n" + post.onScreen.join("\n"));
    }
    if (post.frames && post.frames.length) {
      parts.push("FRAMES\n" + post.frames.map(function (s, i) { return (i + 1) + ". " + s; }).join("\n"));
    }
    if (post.caption) parts.push("CAPTION\n" + post.caption);
    if (post.keywords && post.keywords.length) parts.push("KEYWORDS · " + post.keywords.join(", "));
    if (post.whyFrame1) parts.push("WHY FRAME 1 WORKS\n" + post.whyFrame1);
    return parts.join("\n\n") || post.body || post.preview || "";
  }

  function cheerTemplates() {
    return (window.FS.CONFIG && window.FS.CONFIG.cheerTemplates) || ["Proud of you — keep going."];
  }

  function cheerIndex() {
    var st = getState();
    if (!st || !st.data) return 0;
    var n = typeof st.data.cheerIdx === "number" ? st.data.cheerIdx : 0;
    var len = cheerTemplates().length || 1;
    return ((n % len) + len) % len;
  }

  function setCheerIndex(n) {
    var st = getState();
    if (!st || !st.data) return;
    st.data.cheerIdx = n;
    persist();
  }

  function advanceCheerTemplate() {
    var len = cheerTemplates().length || 1;
    setCheerIndex((cheerIndex() + 1) % len);
  }

  var cheerPendingPartnerId = null;

  function openCheerSheetForTour() {
    var btn = document.querySelector("#leaderLists [data-cheer]");
    var pid = btn && btn.getAttribute("data-cheer");
    if (!pid) {
      var keys = Object.keys(suggestedNotesByPartner || {});
      pid = keys.length ? keys[0] : null;
    }
    if (!pid) return;
    openCheerSheet(pid);
  }

  function canSendCheerNote() {
    if (packEvergreen()) {
      return !!(Cloud.canSendCheerOrNote && Cloud.canSendCheerOrNote());
    }
    return !!(Cloud.isSignedIn && Cloud.isSignedIn());
  }

  function openCheerSheet(partnerId) {
    if (!canSendCheerNote()) return;
    closeAllSheets("cheer");
    cheerPendingPartnerId = partnerId;
    var sheet = $("cheerSheet");
    if (sheet) sheet.hidden = false;
    armSheetDismiss();
    renderCheerSheetPreview();
  }

  function closeCheerSheet() {
    cheerPendingPartnerId = null;
    var sheet = $("cheerSheet");
    if (sheet) sheet.hidden = true;
  }

  function renderCheerSheetPreview() {
    var templates = cheerTemplates();
    var idx = cheerIndex();
    var body = templates[idx] || templates[0] || "";
    var meta = $("cheerSheetMeta");
    var preview = $("cheerSheetBody");
    if (meta) meta.textContent = "Cheer " + (idx + 1) + " of " + templates.length;
    if (preview) preview.textContent = '"' + body + '"';
  }

  async function confirmSendCheer() {
    if (!cheerPendingPartnerId) return;
    var templates = cheerTemplates();
    var idx = cheerIndex();
    var body = templates[idx] || templates[0] || "Proud of you — keep going.";
    var btn = $("cheerConfirmSend");
    if (btn && btn.disabled) return;
    var idle = btn ? btn.textContent : "";
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      var result = await Cloud.sendEvent(cheerPendingPartnerId, "cheer", body);
      appendOutreachLog(cheerPendingPartnerId, "cheer", body);
      advanceCheerTemplate();
      closeCheerSheet();
      await renderLeader();
      if (result && result.push && result.push.ok !== false && result.push.skipped !== "duplicate" && result.push.sent === 0) {
        FS.UI.toast("Sent — they’ll see this cheer in First Seeds. A phone banner only appears if they’ve turned on notifications in their Settings.", { tone: "good" });
      }
    } catch (err) {
      FS.UI.toast(err.message || "Could not send cheer", { tone: "bad" });
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = idle || "Send this →";
      }
    }
  }

  var notePendingPartnerId = null;

  function noteDraftFor(partnerId) {
    var cached = suggestedNotesByPartner[partnerId];
    if (cached) return cached;
    var person = teamPersonCache[partnerId];
    var name = (person && (person.display_name || person.email)) || "Partner";
    return { body: "", name: name, when: "Check-in" };
  }

  function openNoteSheet(partnerId) {
    if (!canSendCheerNote()) return;
    closeAllSheets("note");
    notePendingPartnerId = partnerId;
    var draft = noteDraftFor(partnerId);
    var sheet = $("noteSheet");
    var meta = $("noteSheetMeta");
    var input = $("noteSheetBody");
    var label = document.querySelector("#noteSheet .field-label");
    var copyBtn = $("noteSheetCopy");
    var sendBtn = $("noteConfirmSend");
    if (meta) {
      meta.textContent = draft.when
        ? ("For " + (draft.name || "Partner") + " · " + draft.when)
        : ("For " + (draft.name || "Partner"));
    }
    if (label) label.textContent = draft.body ? "Suggested note (edit freely)" : "Your note";
    if (input) {
      input.value = draft.body || "";
      setTimeout(function () {
        try {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        } catch (err) {}
      }, 40);
    }
    if (copyBtn) copyBtn.textContent = "Copy";
    if (sendBtn) sendBtn.textContent = "Send note →";
    if (sheet) sheet.hidden = false;
    armSheetDismiss();
  }

  function openNoteSheetForTour() {
    var btn = document.querySelector("#leaderLists [data-note]");
    var pid = btn && btn.getAttribute("data-note");
    if (!pid) {
      var keys = Object.keys(suggestedNotesByPartner || {});
      pid = keys.length ? keys[0] : null;
    }
    if (!pid) return;
    openNoteSheet(pid);
  }

  function closeNoteSheet() {
    notePendingPartnerId = null;
    var sheet = $("noteSheet");
    if (sheet) sheet.hidden = true;
  }

  function copyNoteSheetBody() {
    var input = $("noteSheetBody");
    var btn = $("noteSheetCopy");
    var text = input ? String(input.value || "").trim() : "";
    if (!text) {
      if (btn) {
        btn.textContent = "Write something first";
        setTimeout(function () { btn.textContent = "Copy"; }, 1400);
      }
      return;
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      FS.UI.toast("Copy isn’t available here — select the note and copy manually.", { tone: "bad" });
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      if (btn) {
        btn.textContent = "Copied ✓";
        setTimeout(function () { btn.textContent = "Copy"; }, 1400);
      }
    }).catch(function () {
      FS.UI.toast("Couldn’t copy — try selecting the note manually.", { tone: "bad" });
    });
  }

  async function confirmSendNote() {
    if (!notePendingPartnerId) return;
    var input = $("noteSheetBody");
    var btn = $("noteConfirmSend");
    var noteBody = input ? String(input.value || "").trim() : "";
    if (!noteBody) {
      if (btn) {
        btn.textContent = "Write a note first";
        setTimeout(function () { if (btn) btn.textContent = "Send note →"; }, 1400);
      }
      if (input) input.focus();
      return;
    }
    if (btn && btn.disabled) return;
    var idle = btn ? btn.textContent : "";
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      var sectionId = "welcome";
      var partnerRow = (await Cloud.listDownline()).filter(function (r) {
        return r.profile.id === notePendingPartnerId;
      })[0];
      if (partnerRow && partnerRow.progress && partnerRow.progress.active) {
        sectionId = partnerRow.progress.active;
      }
      await Cloud.saveLeaderNote(notePendingPartnerId, sectionId, noteBody);
      appendOutreachLog(notePendingPartnerId, "note", noteBody);
      if (btn) btn.textContent = "Sent ✓";
      await new Promise(function (r) { setTimeout(r, 700); });
      closeNoteSheet();
      await renderLeader();
    } catch (err) {
      FS.UI.toast(err.message || "Could not save note", { tone: "bad" });
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = idle || "Send note →";
      }
    }
  }

  function paintBroadcastCount() {
    var input = $("broadcastSheetBody");
    var count = $("broadcastSheetCount");
    var n = input ? String(input.value || "").length : 0;
    if (count) count.textContent = n + " / 280";
  }

  function setBroadcastMsg(text) {
    var el = $("broadcastSheetMsg");
    if (el) el.textContent = text || "";
  }

  function broadcastSendLabel() {
    if (broadcastKind === "poll") return "Send poll →";
    if (broadcastAudience === "leaders") return "Send to Grove Leaders →";
    if (broadcastAudience === "level1") return "Send to Level 1 →";
    return "Send to the team →";
  }

  function paintBroadcastSheetCopy() {
    var ev = packEvergreen();
    var pick = Cloud.isSuperAdmin() && !ev;
    var wrap = $("broadcastAudience");
    var title = $("broadcastSheetTitle");
    var hint = $("broadcastSheetHint");
    var btn = $("broadcastConfirmSend");
    var kindWrap = $("broadcastKind");
    var pollFields = $("broadcastPollFields");
    var bodyLabel = $("broadcastSheetBodyLabel");
    var input = $("broadcastSheetBody");
    if (kindWrap) kindWrap.hidden = true;
    if (!canOpenHubPoll() && broadcastKind === "poll") broadcastKind = "note";
    if (wrap) wrap.hidden = !pick;
    if (title) {
      title.textContent = broadcastKind === "poll"
        ? "POLL"
        : (pick ? "MESSAGE" : "MESSAGE THE TEAM");
    }
    if (pollFields) pollFields.hidden = broadcastKind !== "poll";
    if (bodyLabel) bodyLabel.textContent = broadcastKind === "poll" ? "Your question" : "Your note";
    if (input) {
      input.placeholder = broadcastKind === "poll"
        ? "Which of these times work? Who’s in for Saturday?"
        : "Keep it short…";
      input.rows = broadcastKind === "poll" ? 3 : 4;
    }
    if (hint) {
      if (broadcastKind === "poll") {
        hint.textContent = ev
          ? (pollChoiceMode === "single"
            ? "Everyone on Evergreen gets a ping. They pick one. You’ll see a bar for each, and who tapped it."
            : "Everyone on Evergreen gets a ping. They can pick every choice that fits. You’ll see a bar for each, and who tapped it.")
          : (pollChoiceMode === "single"
          ? "They pick one. Add dates, times, yes/no — whatever you’re asking. You’ll see a bar for each, and who tapped it."
          : "They can pick every choice that fits. Dates, times, yes/no — whatever you’re asking. You’ll see a bar for each, and who tapped it.");
      } else if (pick && broadcastAudience === "leaders") {
        hint.textContent = "This pings Grove Leaders who turned on team messages — and it stays in Messages.";
      } else if (pick && broadcastAudience === "level1") {
        hint.textContent = "This pings your Level 1s who turned on team messages — and it stays in Messages.";
      } else {
        hint.textContent = "This pings everyone who turned on team messages — and it stays in Messages for them to reopen.";
      }
    }
    if (btn && !btn.disabled) btn.textContent = broadcastSendLabel();
    var chips = document.querySelectorAll("[data-broadcast-audience]");
    for (var i = 0; i < chips.length; i++) {
      var on = chips[i].getAttribute("data-broadcast-audience") === broadcastAudience;
      chips[i].classList.toggle("on", on);
    }
    var kinds = document.querySelectorAll("[data-broadcast-kind]");
    for (var k = 0; k < kinds.length; k++) {
      kinds[k].classList.toggle("on", kinds[k].getAttribute("data-broadcast-kind") === broadcastKind);
    }
    var choices = document.querySelectorAll("[data-broadcast-poll-choice]");
    for (var c = 0; c < choices.length; c++) {
      choices[c].classList.toggle("on", choices[c].getAttribute("data-broadcast-poll-choice") === pollChoiceMode);
    }
  }

  function setBroadcastAudience(next) {
    if (next === "leaders" && Cloud.isSuperAdmin()) broadcastAudience = "leaders";
    else if (next === "level1" && Cloud.isSuperAdmin()) broadcastAudience = "level1";
    else broadcastAudience = "team";
    paintBroadcastSheetCopy();
  }

  function canOpenHubPoll() {
    if (packEvergreen()) return !!(Cloud.canComposeEvergreenBoard && Cloud.canComposeEvergreenBoard());
    return !!Cloud.isSuperAdmin();
  }

  function setBroadcastKind(next) {
    if (next === "poll" && !canOpenHubPoll()) next = "note";
    broadcastKind = next === "poll" ? "poll" : "note";
    if (broadcastKind === "poll") paintPollSlots();
    paintBroadcastSheetCopy();
    setBroadcastMsg("");
  }

  function setBroadcastPollChoice(next) {
    pollChoiceMode = next === "single" ? "single" : "multiple";
    paintBroadcastSheetCopy();
    setBroadcastMsg("");
  }

  function openBroadcastSheet(kind) {
    if (kind === "poll") {
      if (!canOpenHubPoll()) return;
    } else if (!Cloud.canBroadcast()) return;
    closeAllSheets("broadcast");
    broadcastAudience = "team";
    broadcastKind = kind === "poll" && canOpenHubPoll() ? "poll" : "note";
    pollChoiceMode = "multiple";
    pollSlotDrafts = ["", "", ""];
    var sheet = $("broadcastSheet");
    var input = $("broadcastSheetBody");
    var btn = $("broadcastConfirmSend");
    setBroadcastMsg("");
    if (input) input.value = "";
    if (btn) {
      btn.disabled = false;
      btn.textContent = broadcastSendLabel();
    }
    paintPollSlots();
    paintBroadcastSheetCopy();
    paintBroadcastCount();
    if (sheet) sheet.hidden = false;
    armSheetDismiss();
    setTimeout(function () {
      try { if (input) input.focus(); } catch (e) {}
    }, 40);
  }

  function closeBroadcastSheet() {
    var sheet = $("broadcastSheet");
    if (sheet) sheet.hidden = true;
    setBroadcastMsg("");
  }

  async function confirmSendBroadcast() {
    var input = $("broadcastSheetBody");
    var btn = $("broadcastConfirmSend");
    var body = input ? String(input.value || "").trim() : "";
    if (broadcastKind === "poll") {
      if (!canOpenHubPoll()) {
        setBroadcastMsg(packEvergreen() ? "Evergreen Admin only." : "Super admin only.");
        return;
      }
      await confirmSendPoll();
      return;
    }
    if (!body) {
      setBroadcastMsg("Write a short message first.");
      if (input) input.focus();
      return;
    }
    try {
      if (btn) btn.disabled = true;
      if (btn) btn.textContent = "Sending…";
      setBroadcastMsg("");
      await Cloud.sendTeamBroadcast(body, broadcastAudience);
      setBroadcastMsg(
        broadcastAudience === "leaders"
          ? "Sent to Grove Leaders."
          : broadcastAudience === "level1"
            ? "Sent to Level 1."
            : "Sent to the team."
      );
      if (btn) btn.textContent = "Sent ✓";
      await new Promise(function (r) { setTimeout(r, 800); });
      closeBroadcastSheet();
      await refreshGroveBoardAfterSend("messages");
    } catch (err) {
      setBroadcastMsg(err.message || "Could not send that note.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = broadcastSendLabel();
      }
    }
  }

  function hideTeamPoll() {
    var el = $("liveTeamPoll");
    if (el) {
      el.hidden = true;
      el.innerHTML = "";
    }
  }

  function paintPollSlots() {
    var wrap = $("pollSheetSlots");
    if (!wrap) return;
    if (pollSlotDrafts.length < 2) pollSlotDrafts = ["", ""];
    var html = "";
    pollSlotDrafts.forEach(function (val, i) {
      html += '<div class="poll-slot-row">';
      html += '<input class="cal-input" type="text" maxlength="80" data-poll-slot="' + i +
        '" placeholder="' + (i === 0 ? "Tue 7pm PT" : i === 1 ? "Yes" : "Another choice") +
        '" value="' + esc(val) + '">';
      if (pollSlotDrafts.length > 2) {
        html += '<button type="button" class="poll-slot-remove" data-poll-slot-remove="' + i +
          '" aria-label="Remove choice">×</button>';
      }
      html += "</div>";
    });
    wrap.innerHTML = html;
  }

  function collectPollSlots() {
    var wrap = $("pollSheetSlots");
    if (!wrap) return pollSlotDrafts.slice();
    var inputs = wrap.querySelectorAll("[data-poll-slot]");
    var out = [];
    for (var i = 0; i < inputs.length; i++) out.push(String(inputs[i].value || "").trim());
    pollSlotDrafts = out.length ? out : ["", ""];
    return pollSlotDrafts;
  }

  async function confirmSendPoll() {
    if (!canOpenHubPoll()) {
      setBroadcastMsg(packEvergreen() ? "Evergreen Admin only." : "Super admin only.");
      return;
    }
    var input = $("broadcastSheetBody");
    var btn = $("broadcastConfirmSend");
    var body = input ? String(input.value || "").trim() : "";
    var labels = collectPollSlots().filter(Boolean);
    if (!body) {
      setBroadcastMsg("Write a question first.");
      if (input) input.focus();
      return;
    }
    if (labels.length < 2) {
      setBroadcastMsg("Add at least two choices.");
      return;
    }
    try {
      if (btn) btn.disabled = true;
      if (btn) btn.textContent = "Sending…";
      setBroadcastMsg("");
      await Cloud.createTeamPoll(body, labels, broadcastAudience, pollChoiceMode);
      setBroadcastMsg(packEvergreen()
        ? "Sent — they can vote in From the hub."
        : "Sent — they can vote in Announcements.");
      if (btn) btn.textContent = "Sent ✓";
      await new Promise(function (r) { setTimeout(r, 800); });
      closeBroadcastSheet();
      if (packEvergreen()) {
        evBoardCache = { at: 0, data: null };
        await renderEvergreenBoard();
      } else {
        await refreshGroveBoardAfterSend("announcements");
      }
    } catch (err) {
      setBroadcastMsg(err.message || "Could not send that poll.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = broadcastSendLabel();
      }
    }
  }

  function pollMaxVotes(poll) {
    var max = 0;
    (poll.options || []).forEach(function (o) {
      if ((o.votes || 0) > max) max = o.votes;
    });
    return max;
  }

  function pollIsCreator(poll) {
    if (poll && poll.is_creator) return true;
    var me = Cloud.user && Cloud.user();
    return !!(me && poll && poll.created_by && me.id === poll.created_by);
  }

  function pollCanSeeNames(poll) {
    if (pollIsCreator(poll)) return true;
    return !!(Cloud.isSuperAdmin && Cloud.isSuperAdmin());
  }

  function pollOptionsForView(poll) {
    var opts = ((poll && poll.options) || []).slice();
    var hasVoted = !!((poll && poll.my_option_ids) || []).length;
    var ranked = pollIsCreator(poll) || hasVoted || (poll && poll.status !== "open");
    opts.sort(function (a, b) {
      if (ranked) {
        var dv = (b.votes || 0) - (a.votes || 0);
        if (dv) return dv;
      }
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
    return opts;
  }

  function renderPollCardHtml(poll) {
    var open = poll.status === "open";
    var creator = pollIsCreator(poll);
    var canVote = open && !creator;
    var mine = {};
    (pollVoteDraft[poll.id] || poll.my_option_ids || []).forEach(function (id) {
      mine[id] = true;
    });
    if (canVote && !pollVoteDraft[poll.id]) pollVoteDraft[poll.id] = (poll.my_option_ids || []).slice();
    var max = pollMaxVotes(poll) || 1;
    var single = poll.choice_mode === "single";
    var showNames = pollCanSeeNames(poll);
    var html = '<div class="live-team-head"><div class="live-tag">' +
      (open ? "POLL" : "POLL · CLOSED") + "</div></div>";
    html += '<h3 class="poll-card-title">' + esc(poll.title || "Team poll") + "</h3>";
    if (poll.body && poll.body !== poll.title) html += '<p class="poll-card-body">' + esc(poll.body) + "</p>";
    html += '<p class="poll-card-meta">' + (poll.voter_count || 0) +
      ((poll.voter_count === 1) ? " person has answered" : " people have answered");
    if (canVote) html += single ? " · pick one" : " · pick any that fit";
    if (poll.created_by_name) html += " · from " + esc(poll.created_by_name);
    html += "</p>";
    html += '<div class="poll-options">';
    pollOptionsForView(poll).forEach(function (opt) {
      var votes = opt.votes || 0;
      var pct = Math.round((votes / max) * 100);
      html += '<label class="poll-option' + (mine[opt.id] ? " on" : "") + (canVote ? "" : " is-locked") + '">';
      if (canVote) {
        html += '<input type="' + (single ? "radio" : "checkbox") + '" name="poll-' + esc(poll.id) +
          '" data-poll-opt="' + esc(poll.id) + '" data-poll-choice="' + (single ? "single" : "multiple") +
          '" value="' + esc(opt.id) + '"' + (mine[opt.id] ? " checked" : "") + ">";
      }
      html += '<span class="poll-option-copy">';
      html += '<span class="poll-option-label">' + esc(opt.label) + "</span>";
      html += '<span class="poll-option-count">' + votes + "</span>";
      html += '<span class="poll-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></span>';
      if (showNames && opt.names && opt.names.length) {
        html += '<span class="poll-option-names">' + esc(opt.names.join(" · ")) + "</span>";
      }
      html += "</span></label>";
    });
    html += "</div>";
    html += '<div class="poll-card-actions">';
    if (canVote) {
      html += '<button type="button" class="btn" data-poll-save="' + esc(poll.id) + '">Save my answer →</button>';
    }
    if (open && poll.can_manage) {
      html += '<button type="button" class="btn-ghost" data-poll-close="' + esc(poll.id) + '">Close poll</button>';
    }
    html += "</div>";
    html += '<p class="cheer-sheet-hint poll-card-msg" data-poll-msg="' + esc(poll.id) + '" role="status"></p>';
    return html;
  }

  async function renderTeamPolls() {
    hideTeamPoll();
  }

  async function refreshPollsUi() {
    hideTeamPoll();
    if (packEvergreen()) {
      var evPanel = $("panel-ev-board");
      if (evPanel && evPanel.classList.contains("active")) await renderEvergreenBoard();
      return;
    }
    if (groveBoardPanelOpen()) await renderGroveBoard();
  }

  async function savePollVote(pollId) {
    var msg = document.querySelector('[data-poll-msg="' + pollId + '"]');
    var btn = document.querySelector('[data-poll-save="' + pollId + '"]');
    var ids = pollVoteDraft[pollId] || [];
    if (btn && btn.disabled) return;
    var idle = btn ? btn.textContent : "";
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Saving…";
      }
      await Cloud.voteTeamPoll(pollId, ids);
      delete pollVoteDraft[pollId];
      if (msg) msg.textContent = ids.length ? "Saved ✓" : "Saved — nothing marked.";
      await refreshPollsUi();
    } catch (err) {
      if (msg) msg.textContent = (err && err.message) || "Could not save.";
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = idle || "Save my answer →";
      }
    }
  }

  var GROVE_BOARD_SEEN = "fsGroveBoardSeen";
  var EV_BOARD_SEEN = "fsEvBoardSeen";
  var GROVE_BOARD_MAX = 2000;
  var groveHubCache = { at: 0, data: null };
  var evBoardCache = { at: 0, data: null };
  var howGrowBoardCache = { at: 0, rows: null };
  var howGrowBoardOpen = false;
  var groveBoardTab = "announcements";
  var groveBoardDraft = "";
  var groveBoardCompose = "";
  var groveBoardRun = 0;

  function groveBoardSeenAt() {
    try { return localStorage.getItem(GROVE_BOARD_SEEN) || ""; } catch (e) { return ""; }
  }

  function evBoardSeenAt() {
    try { return localStorage.getItem(EV_BOARD_SEEN) || ""; } catch (e) { return ""; }
  }

  function markEvBoardSeen(iso) {
    try { localStorage.setItem(EV_BOARD_SEEN, iso || new Date().toISOString()); } catch (e) {}
    if (packEvergreen()) paintGroveBoardPip(false);
  }

  async function loadEvergreenBoardData(force) {
    if (!force && evBoardCache.data && (Date.now() - evBoardCache.at) < 20000) return evBoardCache.data;
    var data = await Cloud.listEvergreenBoard();
    evBoardCache = { at: Date.now(), data: data || { posts: [] } };
    return evBoardCache.data;
  }

  function paintGroveBoardPip(hasNew) {
    var btn = $("groveBoardNavBtn");
    if (!btn) return;
    if (hasNew) btn.setAttribute("data-board-new", "1");
    else btn.removeAttribute("data-board-new");
  }

  function markGroveBoardSeen(iso) {
    try { localStorage.setItem(GROVE_BOARD_SEEN, iso || new Date().toISOString()); } catch (e) {}
    if (!packEvergreen()) {
      paintGroveBoardPip(groveBoardUnreadBulletins().length > 0);
    }
  }

  function groveHubWhen(iso) {
    var t = Date.parse(iso || "");
    if (!t) return "";
    var d = (Date.now() - t) / 1000;
    if (d < 45) return "just now";
    if (d < 3600) return Math.max(1, Math.floor(d / 60)) + "m ago";
    if (d < 86400) return Math.floor(d / 3600) + "h ago";
    if (d < 604800) return Math.floor(d / 86400) + "d ago";
    try { return new Date(t).toLocaleDateString(); } catch (e) { return ""; }
  }

  async function loadGroveHub(force) {
    if (!force && groveHubCache.data && (Date.now() - groveHubCache.at) < 20000) return groveHubCache.data;
    var data = await Cloud.listGroveHub();
    groveHubCache = { at: Date.now(), data: data || { posts: [], inbox: [], latest_at: null } };
    return groveHubCache.data;
  }

  async function refreshGroveBoardPip() {
    var unread = 0;
    if (!packEvergreen()) {
      try {
        await loadAppBulletins(false);
        unread = groveBoardUnreadBulletins().length;
      } catch (eB) {}
    }
    if (packEvergreen()) {
      if (!Cloud.isSignedIn()) {
        paintGroveBoardPip(false);
        return;
      }
      try {
        var board = await loadEvergreenBoardData(false);
        var latest = board && board.posts && board.posts[0] && board.posts[0].created_at;
        var seen = evBoardSeenAt();
        paintGroveBoardPip(!!(latest && (!seen || String(latest) > seen)));
      } catch (eEv) {}
      return;
    }
    if (!Cloud.isSignedIn()) {
      paintGroveBoardPip(unread > 0);
      return;
    }
    try {
      var hub = await loadGroveHub(false);
      var latestHub = hub && hub.latest_at;
      var seenHub = groveBoardSeenAt();
      var hubNew = !!(latestHub && (!seenHub || String(latestHub) > seenHub));
      paintGroveBoardPip(hubNew || unread > 0);
    } catch (e) {
      paintGroveBoardPip(unread > 0);
    }
  }

  function inboxKindLabel(kind) {
    if (kind === "cheer") return "Cheer";
    if (kind === "note") return "Note";
    if (kind === "poll") return "Poll";
    return "Message";
  }

  function paintGroveBoardCount() {
    var input = $("groveBoardBody");
    var count = $("groveBoardCount");
    var n = input ? String(input.value || "").length : 0;
    if (count) count.textContent = n + " / " + GROVE_BOARD_MAX;
  }

  function setGroveBoardMsg(text) {
    var el = $("groveBoardMsg");
    if (el) el.textContent = text || "";
  }

  function setGroveBoardTab(tab) {
    groveBoardTab = tab === "announcements" ? "announcements" : "messages";
  }

  function groveBoardPanelOpen() {
    var p = $("panel-grove-board");
    return !!(p && p.classList.contains("active"));
  }

  async function refreshGroveBoardAfterSend(tab) {
    groveHubCache = { at: 0, data: null };
    if (tab) setGroveBoardTab(tab);
    if (groveBoardPanelOpen()) await renderGroveBoard();
  }

  var BULLETIN_MAX = 400;
  var LEGACY_BULLETIN_IDS = [
    "a1111111-0000-4000-8000-000000000001",
    "a1111111-0000-4000-8000-000000000002",
    "a1111111-0000-4000-8000-000000000003",
    "a1111111-0000-4000-8000-000000000004"
  ];
  var bulletinCache = { at: 0, rows: null, live: false };
  var bulletinDraft = "";
  var bulletinGoDraft = "";

  function normalizeBulletin(row) {
    if (!row) return null;
    var id = String(row.id || "").trim();
    var text = String(row.body || row.text || "").trim();
    if (!id || !text) return null;
    var go = String(row.go || "").trim();
    return {
      id: id,
      text: text,
      go: go,
      focus: String(row.focus || "").trim(),
      cta: String(row.cta || "").trim() || (go ? "Open →" : ""),
      created_at: row.created_at || ""
    };
  }

  function configBulletinFallback() {
    var raw = window.FS.CONFIG && window.FS.CONFIG.appUpdates;
    var list = raw && raw.items;
    if (!list || !list.length) return [];
    var out = [];
    list.forEach(function (item, i) {
      var row = typeof item === "string"
        ? { id: "cfg-" + i, text: item }
        : item;
      if (row && !row.id) row.id = "cfg-" + i;
      var n = normalizeBulletin(row);
      if (n) out.push(n);
    });
    return out;
  }

  function allAppBulletins() {
    if (bulletinCache.rows) return bulletinCache.rows;
    return configBulletinFallback();
  }

  async function loadAppBulletins(force) {
    if (packEvergreen()) return [];
    if (!force && bulletinCache.rows && Date.now() - bulletinCache.at < 20000) {
      return bulletinCache.rows;
    }
    if (!Cloud.listAppBulletins) {
      bulletinCache = { at: Date.now(), rows: configBulletinFallback(), live: false };
      return bulletinCache.rows;
    }
    try {
      var raw = await Cloud.listAppBulletins("grove");
      if (raw == null) {
        bulletinCache = { at: Date.now(), rows: configBulletinFallback(), live: false };
        return bulletinCache.rows;
      }
      var rows = [];
      (raw || []).forEach(function (row) {
        var n = normalizeBulletin(row);
        if (n) rows.push(n);
      });
      bulletinCache = { at: Date.now(), rows: rows, live: true };
      return rows;
    } catch (err) {
      console.warn("[First Seeds] bulletins:", err);
      if (!bulletinCache.rows) {
        bulletinCache = { at: Date.now(), rows: configBulletinFallback(), live: false };
      }
      return bulletinCache.rows || [];
    }
  }

  function migrateAppBulletinSeen() {
    if (!getState) return;
    var st = getState();
    if (!st.data) st.data = {};
    if (!st.data.appBulletinSeen || typeof st.data.appBulletinSeen !== "object" || Array.isArray(st.data.appBulletinSeen)) {
      st.data.appBulletinSeen = {};
    }
    if (!st.data.appUpdatesSeen) return;
    var changed = false;
    LEGACY_BULLETIN_IDS.forEach(function (id) {
      if (!st.data.appBulletinSeen[id]) {
        st.data.appBulletinSeen[id] = true;
        changed = true;
      }
    });
    if (changed && persist) persist();
  }

  function appBulletinSeenMap() {
    migrateAppBulletinSeen();
    var st = getState && getState();
    return (st && st.data && st.data.appBulletinSeen) || {};
  }

  function groveBoardUnreadBulletins() {
    var seen = appBulletinSeenMap();
    return allAppBulletins().filter(function (it) { return !seen[it.id]; });
  }

  function dismissGroveBoardAppUpdates() {
    if (!getState) return;
    var st = getState();
    if (!st.data) st.data = {};
    migrateAppBulletinSeen();
    var seen = st.data.appBulletinSeen;
    groveBoardUnreadBulletins().forEach(function (it) { seen[it.id] = true; });
    st.data.appBulletinSeen = seen;
    if (persist) persist({ immediate: true });
    var wrap = document.querySelector(".grove-board-updates-wrap");
    if (wrap) wrap.remove();
    refreshGroveBoardPip();
  }

  function groveBoardAppUpdatesWhen(iso) {
    var t = Date.parse(iso || "");
    if (!t) return "";
    try {
      return new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  }

  function bulletinItemHtml(item, opts) {
    opts = opts || {};
    var html = "<li>" + esc(item.text);
    if (item.go) {
      html += ' <button type="button" class="grove-board-updates-go" data-goto="' + esc(item.go) + '"';
      if (item.focus) html += ' data-goto-focus="' + esc(item.focus) + '"';
      html += ">" + esc(item.cta || "Open →") + "</button>";
    }
    if (opts.remove && item.id) {
      html += ' <button type="button" class="grove-board-updates-remove" data-bulletin-remove="' +
        esc(item.id) + '">Remove</button>';
    }
    return html + "</li>";
  }

  function groveBoardAppUpdatesHtml() {
    var unread = groveBoardUnreadBulletins();
    if (!unread.length) return "";
    var when = groveBoardAppUpdatesWhen(unread[0] && unread[0].created_at);
    var html = '<div class="grove-board-list grove-board-updates-wrap"><article class="grove-board-card is-app-updates">';
    html += '<div class="grove-board-card-top"><p class="grove-board-kind">In the app</p>';
    html += '<div class="grove-board-card-top-actions">';
    if (when) html += '<p class="grove-board-when">' + esc(when) + "</p>";
    html += '<button type="button" class="leader-overview-dismiss" data-dismiss-app-updates>Dismiss</button>';
    html += "</div></div><ul class=\"grove-board-updates\">";
    unread.forEach(function (item) { html += bulletinItemHtml(item); });
    return html + "</ul></article></div>";
  }

  function groveBoardBulletinManageHtml() {
    if (!(Cloud.isSuperAdmin && Cloud.isSuperAdmin()) || packEvergreen()) return "";
    var all = allAppBulletins();
    var html = '<div class="grove-board-compose is-bulletin"><span class="field-label">In the app bulletin</span>';
    html += '<textarea class="note-sheet-input" id="bulletinBody" rows="4" maxlength="' + BULLETIN_MAX +
      '" placeholder="One short point they haven’t seen yet…">' + esc(bulletinDraft) + "</textarea>";
    html += '<div class="bulletin-compose-row"><label class="sr-only" for="bulletinGo">Optional link</label>';
    html += '<select id="bulletinGo" class="cal-select">';
    [
      { id: "", label: "No link" },
      { id: "welcome", label: "Sprout" },
      { id: "tend", label: "Calendar" },
      { id: "grove-shelf", label: "Team library" },
      { id: "content-vault", label: "Post vault" },
      { id: "plant", label: "Post Studio" },
      { id: "know", label: "Learn" },
      { id: "leads", label: "Leads" },
      { id: "leader", label: "Grove" }
    ].forEach(function (opt) {
      html += '<option value="' + esc(opt.id) + '"' + (bulletinGoDraft === opt.id ? " selected" : "") + ">" +
        esc(opt.label) + "</option>";
    });
    html += "</select>";
    html += '<p class="grove-board-count" id="bulletinCount">' + String(bulletinDraft || "").length +
      " / " + BULLETIN_MAX + "</p></div>";
    html += '<p class="grove-board-compose-hint">Each point shows until they dismiss it. People who haven’t seen older points still see those. No phone ping — just the 💬 dot.</p>';
    html += '<div class="grove-board-compose-actions"><span></span>';
    html += '<button type="button" class="btn" id="bulletinPost">Add point →</button></div>';
    html += '<p class="grove-board-msg" id="bulletinMsg" role="status"></p>';
    if (all.length) {
      html += '<p class="grove-board-compose-hint" style="margin-top:14px">Live points — remove one and it’s gone for everyone, including people who hadn’t opened What’s new yet.</p>';
      html += '<ul class="grove-board-updates">';
      all.forEach(function (item) { html += bulletinItemHtml(item, { remove: true }); });
      html += "</ul>";
    }
    html += "</div>";
    return html;
  }

  function groveBoardPostComposeHtml() {
    var html = '<div class="grove-board-compose"><span class="field-label">Post to the grove</span>';
    html += '<textarea class="note-sheet-input" id="groveBoardBody" rows="6" maxlength="' + GROVE_BOARD_MAX +
      '" placeholder="What’s coming, a gathering reminder, a longer note they can come back to…">' +
      esc(groveBoardDraft) + "</textarea>";
    html += '<p class="grove-board-compose-hint">They get a short ping. The full note stays here.</p>';
    html += '<div class="grove-board-compose-actions"><p class="grove-board-count" id="groveBoardCount">0 / ' +
      GROVE_BOARD_MAX + '</p>';
    html += '<button type="button" class="btn" id="groveBoardPost">Post →</button></div>';
    html += '<p class="grove-board-msg" id="groveBoardMsg" role="status"></p>';
    html += '<button type="button" class="grove-board-card-go" id="groveBoardComposePoll">Or start a poll →</button></div>';
    return html;
  }

  function canComposeGroveBoardTools() {
    return !packEvergreen() && !!(Cloud.isSignedIn && Cloud.isSignedIn() && Cloud.isSuperAdmin && Cloud.isSuperAdmin());
  }

  function canShowGroveBoardHeadActions() {
    if (packEvergreen() || !(Cloud.isSignedIn && Cloud.isSignedIn())) return false;
    return canComposeGroveBoardTools() || !!(Cloud.canBroadcast && Cloud.canBroadcast());
  }

  function paintGroveBoardHeadActions() {
    var wrap = $("groveBoardHeadActions");
    if (!wrap) return;
    if (!canShowGroveBoardHeadActions()) {
      wrap.hidden = true;
      wrap.innerHTML = "";
      return;
    }
    wrap.hidden = false;
    var html = "";
    var postOn = groveBoardCompose === "post";
    var bullOn = groveBoardCompose === "bulletin";
    if (canComposeGroveBoardTools()) {
      html +=
        '<button type="button" class="grove-board-head-btn' + (postOn ? " on" : "") +
        '" data-grove-board-compose="post" aria-pressed="' + (postOn ? "true" : "false") +
        '" aria-label="Post to the grove">Post</button>' +
        '<button type="button" class="grove-board-head-btn' + (bullOn ? " on" : "") +
        '" data-grove-board-compose="bulletin" aria-pressed="' + (bullOn ? "true" : "false") +
        '" aria-label="In the app bulletin">Bulletin</button>';
    }
    if (Cloud.canBroadcast && Cloud.canBroadcast()) {
      html += '<button type="button" class="grove-board-head-btn" id="groveBoardComposeMsg" aria-label="Compose a message">Message</button>';
    }
    wrap.innerHTML = html;
  }

  function paintGroveBoardComposeMount() {
    var mount = $("groveBoardComposeMount");
    if (!mount) return;
    if (!canComposeGroveBoardTools() || !groveBoardCompose) {
      mount.innerHTML = "";
      return;
    }
    if (groveBoardCompose === "post") mount.innerHTML = groveBoardPostComposeHtml();
    else if (groveBoardCompose === "bulletin") mount.innerHTML = groveBoardBulletinManageHtml();
    else mount.innerHTML = "";
  }

  function captureGroveBoardComposeDrafts() {
    var liveBoard = $("groveBoardBody");
    var liveBulletin = $("bulletinBody");
    var liveBulletinGo = $("bulletinGo");
    if (liveBoard) groveBoardDraft = liveBoard.value || "";
    if (liveBulletin) bulletinDraft = liveBulletin.value || "";
    if (liveBulletinGo) bulletinGoDraft = liveBulletinGo.value || "";
    return {
      board: liveBoard,
      bulletin: liveBulletin,
      bulletinGo: liveBulletinGo
    };
  }

  function groveBoardComposeFieldFocused() {
    var live = captureGroveBoardComposeDrafts();
    var ae = document.activeElement;
    return !!(ae && (ae === live.board || ae === live.bulletin || ae === live.bulletinGo));
  }

  async function setGroveBoardCompose(mode) {
    if (!canComposeGroveBoardTools()) return;
    captureGroveBoardComposeDrafts();
    groveBoardCompose = groveBoardCompose === mode ? "" : String(mode || "");
    if (groveBoardCompose) setGroveBoardTab("announcements");
    await renderGroveBoard();
    var focusEl = groveBoardCompose === "post"
      ? $("groveBoardBody")
      : groveBoardCompose === "bulletin" ? $("bulletinBody") : null;
    if (focusEl) {
      try { focusEl.focus(); } catch (e) {}
    }
  }

  function paintBulletinCount() {
    var input = $("bulletinBody");
    var count = $("bulletinCount");
    var n = input ? String(input.value || "").length : 0;
    if (count) count.textContent = n + " / " + BULLETIN_MAX;
  }

  function setBulletinMsg(text) {
    var el = $("bulletinMsg");
    if (el) el.textContent = text || "";
  }

  async function confirmBulletinPost() {
    if (!Cloud.isSuperAdmin || !Cloud.isSuperAdmin()) return;
    var input = $("bulletinBody");
    var goEl = $("bulletinGo");
    var btn = $("bulletinPost");
    var body = input ? String(input.value || "").trim() : "";
    var go = goEl ? String(goEl.value || "").trim() : "";
    if (!body) {
      setBulletinMsg("Write one short point first.");
      if (input) input.focus();
      return;
    }
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Posting…";
      }
      setBulletinMsg("");
      var nid = await Cloud.createAppBulletin({ body: body, go: go, pack: "grove" });
      if (nid && getState) {
        migrateAppBulletinSeen();
        var st = getState();
        st.data.appBulletinSeen[String(nid)] = true;
        if (persist) persist({ immediate: true });
      }
      bulletinDraft = "";
      bulletinGoDraft = "";
      bulletinCache.at = 0;
      await loadAppBulletins(true);
      await renderGroveBoard();
      refreshGroveBoardPip();
      if (FS.UI && FS.UI.toast) FS.UI.toast("On the bulletin.", { tone: "good" });
    } catch (err) {
      setBulletinMsg((err && err.message) || "Couldn’t post that.");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Add point →";
      }
    }
  }

  async function removeAppBulletin(id) {
    if (!id || !Cloud.isSuperAdmin || !Cloud.isSuperAdmin()) return;
    var ok = await FS.UI.ask("Remove this point from the bulletin? Anyone who hasn’t seen it yet won’t see it either.", {
      title: "Remove this point?",
      okText: "Remove",
      cancelText: "Keep it",
      danger: true
    });
    if (!ok) return;
    try {
      await Cloud.deleteAppBulletin(id);
      bulletinCache.at = 0;
      await loadAppBulletins(true);
      await renderGroveBoard();
      refreshGroveBoardPip();
      if (FS.UI && FS.UI.toast) FS.UI.toast("Removed.", { tone: "good" });
    } catch (err) {
      if (FS.UI && FS.UI.toast) FS.UI.toast((err && err.message) || "Couldn’t remove that.", { tone: "bad" });
    }
  }

  function groveBoardAppUpdateItems() {
    return groveBoardUnreadBulletins();
  }

  function groveBoardAppUpdatesVisible() {
    return groveBoardUnreadBulletins().length > 0;
  }

  function groveBoardTabsHtml() {
    var tab = groveBoardTab === "announcements" ? "announcements" : "messages";
    return '<div class="grove-board-tabs live-team-sort" role="tablist">' +
      '<button type="button" class="live-team-sort-btn' + (tab === "announcements" ? " on" : "") +
      '" data-grove-board-tab="announcements" role="tab" aria-selected="' +
      (tab === "announcements" ? "true" : "false") + '">Announcements</button>' +
      '<button type="button" class="live-team-sort-btn' + (tab === "messages" ? " on" : "") +
      '" data-grove-board-tab="messages" role="tab" aria-selected="' +
      (tab === "messages" ? "true" : "false") + '">Messages</button></div>';
  }

  function groveBoardInboxHtml(inbox) {
    var html = '<div class="grove-board-list">';
    if (!(inbox || []).length) {
      html += '<p class="grove-board-empty">No messages yet — notes, cheers, and team messages will land here.</p>';
    } else {
      inbox.forEach(function (item) {
        var kind = item.kind || "message";
        var extra = kind === "cheer" ? " is-cheer" : kind === "note" ? " is-note" : kind === "poll" ? " is-poll" : "";
        html += '<article class="grove-board-card' + extra + '">';
        html += '<div class="grove-board-card-top"><p class="grove-board-kind">' + esc(inboxKindLabel(kind)) +
          '</p><p class="grove-board-when">' + esc(groveHubWhen(item.at)) + "</p></div>";
        html += '<p class="grove-board-body">' + esc(item.body || "") + "</p>";
        html += groveBoardFromHtml(item);
        if (item.go && item.go !== "grove-board" && item.go !== "welcome") {
          html += '<button type="button" class="grove-board-card-go" data-goto="' + esc(item.go) + '">Open →</button>';
        }
        html += "</article>";
      });
    }
    return html + "</div>";
  }

  async function loadHowGrowBoardPeople(force) {
    if (!Cloud.isSignedIn() || !Cloud.listDownline) return [];
    if (!force && howGrowBoardCache.rows && (Date.now() - howGrowBoardCache.at) < 20000) {
      rememberHowIGrowFromDownline(howGrowBoardCache.rows);
      return howGrowBoardCache.rows;
    }
    var rows = [];
    try {
      var me = Cloud.user && Cloud.user();
      var hubBoard = !!(Cloud.canLoadAdminRoster && Cloud.canLoadAdminRoster() &&
        Cloud.packIsEvergreen && Cloud.packIsEvergreen() &&
        Cloud.adminListProfiles && Cloud.listHowIGrowForPartners);
      if (hubBoard) {
        var roster = await Cloud.adminListProfiles();
        var ids = (roster || []).map(function (p) { return p && p.id; }).filter(function (id) {
          return id && (!me || id !== me.id);
        });
        var grow = [];
        try { grow = await Cloud.listHowIGrowForPartners(ids); } catch (eGrow) { grow = []; }
        var supportById = {};
        (grow || []).forEach(function (r) {
          if (r && r.partner_id) supportById[r.partner_id] = r.support || null;
        });
        rows = (roster || []).filter(function (p) {
          return p && p.id && (!me || p.id !== me.id);
        }).map(function (p) {
          return { profile: p, progress: null, support_preferences: supportById[p.id] || null };
        });
      } else {
        rows = await Cloud.listDownline();
      }
    } catch (e) {
      rows = howGrowBoardCache.rows || [];
      rememberHowIGrowFromDownline(rows);
      return rows;
    }
    howGrowBoardCache = { at: Date.now(), rows: rows || [] };
    rememberHowIGrowFromDownline(howGrowBoardCache.rows);
    return howGrowBoardCache.rows;
  }

  function howGrowBoardHtml(rows) {
    rows = rows || [];
    if (!rows.length) return "";
    var done = [];
    var waiting = 0;
    rows.forEach(function (item) {
      var p = item && item.profile;
      if (!p || !p.id) return;
      if (item.support_preferences && item.support_preferences.completed_at) done.push(item);
      else waiting += 1;
    });
    done.sort(function (a, b) {
      var at = Date.parse((a.support_preferences && a.support_preferences.completed_at) || "") || 0;
      var bt = Date.parse((b.support_preferences && b.support_preferences.completed_at) || "") || 0;
      return bt - at;
    });
    var open = !!howGrowBoardOpen;
    var html = '<section class="how-grow-board' + (open ? " is-open" : "") + '">';
    html += '<button type="button" class="how-grow-board-sum" data-how-grow-fold aria-expanded="' +
      (open ? "true" : "false") + '">';
    html += '<span class="how-grow-board-title">How they grow</span>';
    if (done.length) html += '<span class="how-grow-board-count">' + done.length + "</span>";
    html += "</button>";
    html += '<div class="how-grow-board-body"' + (open ? "" : " hidden") + ">";
    if (done.length) {
      done.forEach(function (item) {
        var p = item.profile;
        var support = item.support_preferences;
        html += '<button type="button" class="how-grow-board-row" data-how-they-grow="' + esc(p.id) + '">';
        html += personPhotoHtml(p, "sm");
        html += '<span class="how-grow-board-name">' + esc(personLabel(p)) + "</span>";
        html += '<span class="how-grow-board-when">' + esc(groveHubWhen(support.completed_at)) + "</span>";
        html += "</button>";
      });
    } else {
      html += '<p class="how-grow-board-empty">None yet — it’ll show here when they fill it out.</p>';
    }
    if (waiting) {
      html += '<p class="how-grow-board-waiting">' +
        (waiting === 1 ? "1 still waiting" : waiting + " still waiting") + "</p>";
    }
    html += "</div></section>";
    return html;
  }

  function boardAuthorPerson(item) {
    var me = Cloud.user() || {};
    var name = (item && (item.created_by_name || item.from_name)) || "";
    var person = {
      id: (item && (item.created_by || item.from_id)) || "",
      display_name: name,
      photo_at: (item && item.photo_at) || null,
      photo_ext: (item && item.photo_ext) || "webp"
    };
    if (me.id && person.id && me.id === person.id) {
      if (me.photo_at) {
        person.photo_at = me.photo_at;
        person.photo_ext = me.photo_ext || person.photo_ext;
      }
    } else if (me.id && !person.id && me.display_name && person.display_name &&
        String(me.display_name).trim() === String(person.display_name).trim()) {
      person.id = me.id;
      person.photo_at = me.photo_at || person.photo_at;
      person.photo_ext = me.photo_ext || person.photo_ext;
    }
    return person;
  }

  function groveBoardFromHtml(item) {
    var name = (item && (item.created_by_name || item.from_name)) || "";
    if (!name) return "";
    return '<div class="grove-board-from-row">' +
      personPhotoHtml(boardAuthorPerson(item), "sm") +
      '<p class="grove-board-from">from ' + esc(name) + "</p></div>";
  }

  function groveBoardPostsHtml(posts) {
    var html = '<div class="grove-board-list">';
    if (!(posts || []).length) {
      html += '<p class="grove-board-empty">Nothing on the board yet — this is where grove notes will live.</p>';
    } else {
      posts.forEach(function (post, i) {
        html += '<article class="grove-board-card is-post' + (i === 0 ? " is-latest" : "") + '">';
        html += '<div class="grove-board-card-top"><p class="grove-board-kind">' +
          (i === 0 ? "Latest" : "Board") + '</p><p class="grove-board-when">' +
          esc(groveHubWhen(post.created_at)) + "</p></div>";
        html += '<p class="grove-board-body">' + esc(post.body || "") + "</p>";
        html += groveBoardFromHtml(post);
        if (post.can_manage) {
          html += '<button type="button" class="grove-board-card-go" data-board-delete="' + esc(post.id) + '">Remove</button>';
        }
        html += "</article>";
      });
    }
    return html + "</div>";
  }

  function groveBoardPollsHtml(polls) {
    if (!(polls || []).length) return "";
    var html = '<div class="grove-board-list">';
    polls.forEach(function (poll) {
      html += '<article class="grove-board-card is-poll grove-board-poll">' + renderPollCardHtml(poll) + "</article>";
    });
    return html + "</div>";
  }

  async function renderGroveBoard() {
    var run = ++groveBoardRun;
    var root = $("groveBoardRoot");
    if (!root) return;
    if (packEvergreen()) {
      root.innerHTML = "";
      paintGroveBoardComposeMount();
      paintGroveBoardHeadActions();
      return;
    }
    await loadAppBulletins(false);
    if (!Cloud.isSignedIn()) {
      groveBoardCompose = "";
      paintGroveBoardComposeMount();
      paintGroveBoardHeadActions();
      root.innerHTML = groveBoardAppUpdatesHtml() +
        '<div class="live-card grove-board-gate"><p class="grove-board-empty">Sign in to see notes for the grove, and everything sent to you.</p>' +
        '<button type="button" class="btn" id="groveBoardSignIn" style="margin-top:12px">Sign in →</button></div>';
      return;
    }
    if (!groveHubCache.data && run === groveBoardRun) {
      root.innerHTML = groveBoardAppUpdatesHtml() + groveBoardTabsHtml() + '<p class="grove-board-empty">Loading…</p>';
    }
    var tab = groveBoardTab === "announcements" ? "announcements" : "messages";
    var hub = { posts: [], inbox: [], latest_at: null };
    var hubOk = false;
    var growPeople = [];
    var growP = tab === "messages"
      ? loadHowGrowBoardPeople(false).catch(function () { return howGrowBoardCache.rows || []; })
      : Promise.resolve([]);
    try {
      var raw = await loadGroveHub(false);
      hub = {
        posts: (raw.posts || []).slice(),
        inbox: (raw.inbox || []).slice(),
        latest_at: raw.latest_at || null
      };
      hubOk = true;
    } catch (e) {
      var cached = groveHubCache.data;
      if (cached) {
        hub = {
          posts: (cached.posts || []).slice(),
          inbox: (cached.inbox || []).slice(),
          latest_at: cached.latest_at || null
        };
      }
    }
    try {
      growPeople = await growP;
    } catch (eGrow) {
      growPeople = howGrowBoardCache.rows || [];
    }
    if (hubOk) {
      if (hub.latest_at) markGroveBoardSeen(hub.latest_at);
      else markGroveBoardSeen(new Date().toISOString());
    }
    var polls = [];
    if (tab === "announcements") {
      try {
        polls = await Cloud.listTeamPolls();
      } catch (e2) {
        polls = [];
      }
      polls = (polls || []).filter(Boolean);
    }
    if (run !== groveBoardRun) return;
    var growHtml = tab === "messages" ? howGrowBoardHtml(growPeople) : "";
    var html = groveBoardAppUpdatesHtml() + groveBoardTabsHtml();
    if (!hubOk && !(hub.posts || []).length && !(hub.inbox || []).length && !growHtml) {
      html += '<p class="grove-board-empty">Couldn’t load notes just now. Try again in a moment.</p>';
      if (groveBoardComposeFieldFocused()) {
        paintGroveBoardCount();
        paintBulletinCount();
        paintGroveBoardHeadActions();
        return;
      }
      paintGroveBoardComposeMount();
      paintGroveBoardHeadActions();
      root.innerHTML = html;
      paintGroveBoardCount();
      paintBulletinCount();
      return;
    }
    if (tab === "announcements") {
      html += groveBoardPollsHtml(polls);
      if ((hub.posts || []).length || !polls.length) html += groveBoardPostsHtml(hub.posts);
    } else {
      html += growHtml;
      html += groveBoardInboxHtml(hub.inbox);
    }
    if (run !== groveBoardRun) return;
    if (groveBoardComposeFieldFocused()) {
      paintGroveBoardCount();
      paintBulletinCount();
      paintGroveBoardHeadActions();
      return;
    }
    paintGroveBoardComposeMount();
    paintGroveBoardHeadActions();
    root.innerHTML = html;
    paintGroveBoardCount();
    paintBulletinCount();
  }

  async function confirmGroveBoardPost() {
    if (!Cloud.isSuperAdmin()) return;
    var input = $("groveBoardBody");
    var btn = $("groveBoardPost");
    var body = input ? String(input.value || "").trim() : "";
    if (!body) {
      setGroveBoardMsg("Write a short update first.");
      if (input) input.focus();
      return;
    }
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Posting…";
      }
      setGroveBoardMsg("");
      await Cloud.createGroveBoardPost(body);
      groveBoardDraft = "";
      groveBoardCompose = "";
      groveHubCache = { at: 0, data: null };
      setGroveBoardTab("announcements");
      await renderGroveBoard();
    } catch (err) {
      setGroveBoardMsg((err && err.message) || "Could not post.");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Post →";
      }
    }
  }

  var EV_BOARD_MAX = 2000;
  var evBoardDraft = "";
  var evBoardRun = 0;

  function evBoardCanCompose() {
    return !!(Cloud.canComposeEvergreenBoard && Cloud.canComposeEvergreenBoard());
  }

  function evBoardComposeHtml() {
    if (!evBoardCanCompose()) return "";
    var html = '<div class="grove-board-compose"><span class="field-label">A note for Evergreen</span>';
    html += '<textarea class="note-sheet-input" id="evBoardBody" rows="4" maxlength="' + EV_BOARD_MAX +
      '" placeholder="What’s coming, a zoom reminder, a note they can come back to…">' +
      esc(evBoardDraft) + "</textarea>";
    html += '<p class="grove-board-compose-hint">They get a short ping. The full note stays here.</p>';
    html += '<div class="grove-board-compose-actions"><p class="grove-board-count" id="evBoardCount">' +
      String(evBoardDraft || "").length + " / " + EV_BOARD_MAX + "</p>";
    html += '<button type="button" class="btn" id="evBoardPost">Post →</button></div>';
    html += '<p class="grove-board-msg" id="evBoardMsg" role="status"></p>';
    html += '<button type="button" class="grove-board-card-go" id="evBoardComposePoll">Or start a poll →</button></div>';
    return html;
  }

  function evBoardPostsHtml(posts) {
    var html = '<div class="grove-board-list">';
    if (!(posts || []).length) {
      html += evBoardCanCompose()
        ? '<p class="grove-board-empty">Nothing on the board yet.</p>'
        : '<p class="grove-board-empty">What’s posted for the team will show up here.</p>';
    } else {
      posts.forEach(function (post, i) {
        html += '<article class="grove-board-card is-post' + (i === 0 ? " is-latest" : "") + '">';
        html += '<div class="grove-board-card-top"><p class="grove-board-kind">' +
          (i === 0 ? "Latest" : "Board") + '</p><p class="grove-board-when">' +
          esc(groveHubWhen(post.created_at)) + "</p></div>";
        html += '<p class="grove-board-body">' + esc(post.body || "") + "</p>";
        if (post.created_by_name) html += '<p class="grove-board-from">from ' + esc(post.created_by_name) + "</p>";
        if (post.can_manage) {
          html += '<button type="button" class="grove-board-card-go" data-ev-board-delete="' + esc(post.id) + '">Remove</button>';
        }
        html += "</article>";
      });
    }
    return html + "</div>";
  }

  async function renderEvergreenBoard() {
    var run = ++evBoardRun;
    var root = $("evBoardRoot");
    if (!root) return;
    if (!packEvergreen()) {
      root.innerHTML = "";
      return;
    }
    if (!Cloud.isSignedIn()) {
      root.innerHTML =
        '<div class="live-card grove-board-gate"><p class="grove-board-empty">Sign in to see notes from the hub.</p>' +
        '<button type="button" class="btn" id="groveBoardSignIn" style="margin-top:12px">Sign in →</button></div>';
      return;
    }
    var liveDraft = $("evBoardBody");
    if (liveDraft) evBoardDraft = liveDraft.value || "";
    var cached = evBoardCache.data;
    var cachedPosts = (cached && cached.posts) || [];
    var cachedGrow = howGrowBoardCache.rows || [];
    if (cached) {
      root.innerHTML = evBoardComposeHtml() + howGrowBoardHtml(cachedGrow) + evBoardPostsHtml(cachedPosts);
    } else {
      root.innerHTML = evBoardComposeHtml() + '<p class="grove-board-empty">Loading…</p>';
    }
    var data = { posts: cachedPosts };
    var polls = [];
    var growPeople = cachedGrow;
    var dataOk = false;
    try {
      var loaded = await Promise.all([
        loadEvergreenBoardData(false),
        Cloud.listTeamPolls().catch(function () { return []; }),
        loadHowGrowBoardPeople(false).catch(function () { return howGrowBoardCache.rows || []; })
      ]);
      data = loaded[0] || { posts: [] };
      polls = (loaded[1] || []).filter(Boolean);
      growPeople = loaded[2] || [];
      dataOk = true;
    } catch (e) {
      data = evBoardCache.data || { posts: [] };
      growPeople = howGrowBoardCache.rows || [];
      try {
        polls = await Cloud.listTeamPolls();
      } catch (e2) {
        polls = [];
      }
      polls = (polls || []).filter(Boolean);
    }
    if (run !== evBoardRun) return;
    var stillDraft = $("evBoardBody");
    if (stillDraft) evBoardDraft = stillDraft.value || "";
    if (stillDraft && document.activeElement === stillDraft) return;
    var posts = (data && data.posts) || [];
    if (dataOk) {
      if (posts[0] && posts[0].created_at) markEvBoardSeen(posts[0].created_at);
      else markEvBoardSeen(new Date().toISOString());
    }
    var growHtml = howGrowBoardHtml(growPeople);
    var html = evBoardComposeHtml() + growHtml;
    if (!dataOk && !posts.length && !polls.length && !growHtml) {
      html += '<p class="grove-board-empty">Couldn’t load notes just now. Try again in a moment.</p>';
      root.innerHTML = html;
      return;
    }
    html += groveBoardPollsHtml(polls);
    if ((posts || []).length || !polls.length) html += evBoardPostsHtml(posts);
    root.innerHTML = html;
  }

  async function confirmEvergreenBoardPost() {
    if (!(Cloud.canComposeEvergreenBoard && Cloud.canComposeEvergreenBoard())) return;
    var input = $("evBoardBody");
    var btn = $("evBoardPost");
    var msgEl = $("evBoardMsg");
    var body = input ? String(input.value || "").trim() : "";
    if (!body) {
      if (msgEl) msgEl.textContent = "Write a short update first.";
      if (input) input.focus();
      return;
    }
    try {
      if (btn) btn.disabled = true;
      await Cloud.createEvergreenBoardPost(body);
      evBoardDraft = "";
      evBoardCache = { at: 0, data: null };
      await renderEvergreenBoard();
    } catch (err) {
      if (msgEl) msgEl.textContent = (err && err.message) || "Could not post.";
      if (btn) btn.disabled = false;
    }
  }

  function chipClass(it) {
    var st = it.status || "todo";
    if (isReachItem(it) || isReminderItem(it)) {
      var reachCat = it.category || (isReminderItem(it) ? "personal" : "outreach");
      return "cal-chip cat-" + reachCat + (st !== "todo" ? " is-" + st : "");
    }
    var fmt = (it.format || "").toLowerCase();
    if (fmt === "reel" || fmt === "carousel" || fmt === "story" || fmt === "single" || fmt === "facebook") {
      return "cal-chip fmt-" + fmt + (st !== "todo" ? " is-" + st : "");
    }
    var cat = it.category || "content";
    return "cal-chip cat-" + cat + (st !== "todo" ? " is-" + st : "");
  }

  /* Shape from type/kind first — format alone must never turn a reach/reminder into a post dot. */
  function isReachItem(it) {
    if (!it) return false;
    if (it.kind === "rest" || it.type === "reactive") return false;
    if (it.type === "reach_out" || it.type === "follow_up") return true;
    if (it.kind === "outreach") return true;
    return false;
  }

  function isReminderItem(it) {
    if (!it) return false;
    if (it.kind === "rest" || it.type === "reactive") return false;
    if (isReachItem(it)) return false;
    if (it.type === "personal") return true;
    if (it.type && it.type !== "personal") return false;
    if (it.kind === "personal" || it.category === "personal") return true;
    return false;
  }

  function isUntypedItem(it) {
    return !!(it && !it.type);
  }

  function isPostOrContentItem(it) {
    if (!it) return false;
    if (it.kind === "rest" || it.type === "reactive") return false;
    if (isReachItem(it) || isReminderItem(it)) return false;
    if (it.type === "post") return true;
    if (it.category === "content" || it.kind === "content") return true;
    var fmt = (it.format || "").toLowerCase();
    if (fmt === "reel" || fmt === "carousel" || fmt === "story" || fmt === "single" || fmt === "facebook") {
      return true;
    }
    return false;
  }

  function itemMarkerClass(it) {
    if (isReachItem(it) || isReminderItem(it)) {
      return "cat-" + (it.category || (isReminderItem(it) ? "personal" : "outreach"));
    }
    var fmt = (it.format || "").toLowerCase();
    if (fmt === "reel" || fmt === "carousel" || fmt === "story" || fmt === "single" || fmt === "facebook") {
      return "fmt-" + fmt;
    }
    return "cat-" + (it.category || "content");
  }

  function itemStatusClass(it) {
    if (!it) return "";
    if (it.status === "posted") return " is-posted";
    if (it.status === "skipped") return " is-skipped";
    if (it.status === "ready") return " is-ready";
    if (it.status === "drafted") return " is-drafted";
    return "";
  }

  function itemGridLabel(it) {
    if (isReminderItem(it) && Cal && Cal.todoChipText) return Cal.todoChipText(it);
    return (it && (it.person || it.title || it.label)) || "Item";
  }

  function isCompactGridItem(it) {
    return isPostOrContentItem(it) || isReachItem(it) || isReminderItem(it) || isUntypedItem(it);
  }

  function compactMarkerButton(day, it) {
    var label = itemGridLabel(it);
    var shape = "cal-dot-btn";
    if (isReachItem(it)) shape = "cal-mark-btn is-reach";
    else if (isReminderItem(it)) shape = "cal-mark-btn is-remind";
    return '<button type="button" class="' + shape + " " + esc(itemMarkerClass(it)) +
      itemStatusClass(it) + '" data-cal-edit="' + day.date + '" data-cal-item="' + it.id +
      '" title="' + esc(label) + '" aria-label="' + esc(label) + '"></button>';
  }

  function compactMarkerSpan(it) {
    var shape = "cal-dot";
    if (isReachItem(it)) shape = "cal-mark is-reach";
    else if (isReminderItem(it)) shape = "cal-mark is-remind";
    return '<span class="' + shape + " " + esc(itemMarkerClass(it)) + itemStatusClass(it) + '"></span>';
  }

  /* ── Shared team calendar (org_events) ───────────────── */
  var orgEventsCache = [];
  var orgEventsLoadedAt = 0;
  var leadFollowCache = [];
  var leadFollowLoadedAt = 0;
  var shelfPeopleCache = [];
  var shelfPeopleLoadedAt = 0;
  var leadInfoNotesCache = [];
  var leadInfoNotesLoaded = false;
  var infoGuestPicker = { open: false, q: "", eventId: "", occursOn: "" };

  function isMissingFollowUpColumn(err) {
    var m = String((err && err.message) || err || "").toLowerCase();
    return m.indexOf("follow_up") >= 0;
  }

  function isMissingHotColumn(err) {
    var m = String((err && err.message) || err || "").toLowerCase();
    return /\bhot\b/.test(m) && (m.indexOf("column") >= 0 || m.indexOf("schema") >= 0);
  }

  function isMissingQuizColumn(err) {
    var m = String((err && err.message) || err || "").toLowerCase();
    return (m.indexOf("fresh_match") >= 0 || m.indexOf("fresh match") >= 0) &&
      (m.indexOf("column") >= 0 || m.indexOf("schema") >= 0);
  }

  var leadHighlightId = "";
  var leadHighlightTimer = 0;

  function leadFollowQuietDays(st) {
    var n = Number(st && st.data && st.data.leadFollowQuietDays);
    if (n === 2 || n === 3 || n === 5 || n === 7) return n;
    return 3;
  }

  function leadFollowMaxPerDay(st) {
    var n = Number(st && st.data && st.data.leadFollowMax);
    if (n === 1 || n === 2 || n === 3) return n;
    return 2;
  }

  function leadFollowIncludeNew(st) {
    return !(st && st.data && st.data.leadFollowIncludeNew === false);
  }

  function ymdAddDays(ymd, days) {
    var d = ymdToLocalDate(ymd);
    if (!d || !Cal || !Cal.ymd) return ymd;
    d.setDate(d.getDate() + days);
    return Cal.ymd(d);
  }

  function socialLabel(raw) {
    var s = String(raw || "").trim();
    if (!s) return "";
    s = s.replace(/^https?:\/\/(www\.)?/i, "");
    if (s.charAt(0) === "@") return s;
    if (/^[A-Za-z0-9._]+$/.test(s)) return "@" + s;
    return s;
  }

  function leadFollowOn(lead, st) {
    if (!lead) return false;
    /* Settings switch is the master — per-lead opt-in cannot keep names on
       the calendar after Calendar reminders is turned off. */
    if (!st || !st.data || st.data.calendarLeadFollowUps !== true) return false;
    if (lead.follow_up === true) return true;
    if (lead.follow_up === false) return false;
    var map = (st.data.leadFollowById) || {};
    if (map[lead.id] === true) return true;
    if (map[lead.id] === false) return false;
    return true;
  }

  function rememberLocalLeadFollow(st, leadId, on) {
    if (!st || !st.data) return;
    if (!st.data.leadFollowById) st.data.leadFollowById = {};
    st.data.leadFollowById[leadId] = !!on;
  }

  function pinLeadFollowQuietFrom(st, leadId, activityAt, ignoreUntil) {
    if (!st || !st.data || !leadId || !activityAt) return;
    if (!st.data.leadFollowQuietFrom) st.data.leadFollowQuietFrom = {};
    st.data.leadFollowQuietFrom[leadId] = {
      activity: activityAt,
      ignoreUntil: ignoreUntil || new Date().toISOString()
    };
  }

  function clearLeadFollowQuietFrom(st, leadId) {
    if (!st || !st.data || !st.data.leadFollowQuietFrom || !leadId) return;
    delete st.data.leadFollowQuietFrom[leadId];
  }

  /* Follow-up toggle writes updated_at, which must not restart the quiet wait. */
  function leadFollowTouchedAt(lead, st) {
    var live = (lead && (lead.updated_at || lead.created_at)) || "";
    var pin = st && st.data && st.data.leadFollowQuietFrom && lead && st.data.leadFollowQuietFrom[lead.id];
    if (!pin || !pin.activity) return live;
    var liveT = live ? new Date(live).getTime() : 0;
    var ignoreT = pin.ignoreUntil ? new Date(pin.ignoreUntil).getTime() : 0;
    if (liveT && ignoreT && liveT <= ignoreT + 2500) return pin.activity;
    return live;
  }

  function leadHotOn(lead, st) {
    if (!lead) return false;
    var map = (st && st.data && st.data.leadHotById) || {};
    if (map[lead.id] === true) return true;
    if (map[lead.id] === false) return false;
    return lead.hot === true;
  }

  function rememberLocalLeadHot(st, leadId, on) {
    if (!st || !st.data) return;
    if (!st.data.leadHotById) st.data.leadHotById = {};
    st.data.leadHotById[leadId] = !!on;
  }

  function leadQuizOn(lead, st) {
    if (!lead) return false;
    var map = (st && st.data && st.data.leadQuizById) || {};
    if (map[lead.id] === true) return true;
    if (map[lead.id] === false) return false;
    return lead.fresh_match === true;
  }

  function rememberLocalLeadQuiz(st, leadId, on) {
    if (!st || !st.data) return;
    if (!st.data.leadQuizById) st.data.leadQuizById = {};
    st.data.leadQuizById[leadId] = !!on;
  }

  function orgEventKindMeta(kind) {
    var copy = orgEventCopy();
    if (kind === "info_zoom") return { label: copy.infoZoom, chip: "cal-chip cat-team is-infozoom", bar: "cat-team is-infozoom", ico: "◉", short: "Info" };
    if (kind === "milestone") return { label: "Milestone", chip: "cal-chip cat-team is-milestone", bar: "cat-team is-milestone", ico: "✦", short: "Mile" };
    if (kind === "in_person") return { label: "In person", chip: "cal-chip cat-team is-inperson", bar: "cat-team is-inperson", ico: "📍", short: "Live" };
    if (kind === "personal") return { label: "For me", chip: "cal-chip cat-team is-personal", bar: "cat-team is-personal", ico: "·", short: "Me" };
    return { label: copy.gathering, chip: "cal-chip cat-team is-gathering", bar: "cat-team is-gathering", ico: "◎", short: copy.gatheringShort };
  }

  /* Events created before Info Zoom was its own kind often used title "Info Zoom". */
  function effectiveOrgKind(ev) {
    if (!ev) return "gathering";
    if (ev.kind === "info_zoom" || ev.kind === "milestone" || ev.kind === "in_person" || ev.kind === "personal") return ev.kind;
    var title = String(ev.title || "");
    if (/info\s*zoom/i.test(title)) return "info_zoom";
    return ev.kind === "gathering" ? "gathering" : (ev.kind || "gathering");
  }

  function isJoinableOrgKind(kind) {
    return kind === "gathering" || kind === "info_zoom";
  }

  function orgEventJoinCloseAt(ev) {
    if (!ev) return NaN;
    var starts = new Date(ev.starts_at).getTime();
    if (isNaN(starts)) return NaN;
    var kind = effectiveOrgKind(ev);
    var hold = (kind === "gathering" || kind === "info_zoom") ? 60 * 60 * 1000 : 90 * 60 * 1000;
    var closeAt = starts + hold;
    if (ev.ends_at) {
      var ends = new Date(ev.ends_at).getTime();
      if (!isNaN(ends)) closeAt = Math.max(closeAt, ends + 30 * 60 * 1000);
    }
    return closeAt;
  }

  /* Live window: 15 minutes before start through a little after the call. */
  function orgEventJoinLive(ev) {
    if (!ev || !isJoinableOrgKind(effectiveOrgKind(ev))) return false;
    if (!orgEventJoinUrl(ev)) return false;
    var starts = new Date(ev.starts_at).getTime();
    if (isNaN(starts)) return false;
    var closeAt = orgEventJoinCloseAt(ev);
    if (isNaN(closeAt)) return false;
    var now = Date.now();
    return now >= starts - 15 * 60 * 1000 && now <= closeAt;
  }

  /* Team zooms / Grove Gatherings: link stays visible until the call is over.
     Info Zooms still hold the Join button until 15 minutes before start
     (invitation copy already includes the link for guests). */
  function orgEventJoinOpen(ev) {
    if (!ev || !isJoinableOrgKind(effectiveOrgKind(ev))) return false;
    if (!orgEventJoinUrl(ev)) return false;
    var closeAt = orgEventJoinCloseAt(ev);
    if (isNaN(closeAt) || Date.now() > closeAt) return false;
    if (effectiveOrgKind(ev) === "gathering") return true;
    return orgEventJoinLive(ev);
  }

  function orgEventJoinCta(ev) {
    var live = orgEventJoinLive(ev);
    return {
      live: live,
      label: live ? "Join now" : "Tap for the link"
    };
  }

  function orgEventIsPast(ev) {
    var closeAt = orgEventJoinCloseAt(ev);
    if (isNaN(closeAt)) return false;
    return Date.now() > closeAt;
  }

  function orgEventStartPassed(ev) {
    if (!ev) return false;
    var starts = new Date(ev.starts_at).getTime();
    if (isNaN(starts)) return false;
    return Date.now() > starts;
  }

  function orgEventJoinUrl(ev) {
    var href = window.FS.normalizeMeetingHref || window.FS.safeHref;
    return (href && href((ev && ev.meeting_url) || "", 2000)) || "";
  }

  function meetingHref(raw) {
    var norm = window.FS && (window.FS.normalizeMeetingHref || window.FS.safeHref);
    return (norm && norm(raw, 2000)) || "";
  }

  function meetingShellNeedsEscape() {
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
      if (window.navigator.standalone === true) return true;
    } catch (e) {}
    var ua = navigator.userAgent || "";
    return /Instagram|IGL\/|FBAN|FBAV|FB_IAB|FB4A|FBIOS|Messenger|Line\/|TikTok|musical_ly|BytedanceWebview|Snapchat|WhatsApp|; wv\)/i.test(ua);
  }

  function isIosDevice() {
    var ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    try {
      if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
    } catch (e) {}
    return false;
  }

  function safariOpenExternalHref(href) {
    try {
      var u = new URL(href, location.href);
      if (u.protocol === "https:") return "x-safari-https://" + u.host + u.pathname + u.search + u.hash;
      if (u.protocol === "http:") return "x-safari-http://" + u.host + u.pathname + u.search + u.hash;
    } catch (e) {}
    return "";
  }

  function androidIntentHref(href, pkg) {
    try {
      var u = new URL(href, location.href);
      if (u.protocol !== "https:" && u.protocol !== "http:") return "";
      var scheme = u.protocol === "https:" ? "https" : "http";
      return "intent://" + u.host + u.pathname + u.search + "#Intent;scheme=" + scheme +
        ";package=" + pkg + ";S.browser_fallback_url=" + encodeURIComponent(u.href) + ";end";
    } catch (e) {
      return "";
    }
  }

  function isZoomHref(href) {
    return /(?:^|[/.])zoom(?:gov)?\.(?:us|com)\b/i.test(String(href || ""));
  }

  /* Zoom’s web client spins forever inside the home-screen app / in-app
     browsers. Hop out to Safari, the Zoom app, or Chrome first. */
  function openMeetingLink(raw, e) {
    var href = meetingHref(raw);
    if (!href) {
      if (e) e.preventDefault();
      return false;
    }
    if (e) e.preventDefault();
    var ios = isIosDevice();
    var android = /Android/i.test(navigator.userAgent || "");
    var escape = meetingShellNeedsEscape();
    if (ios && escape) {
      var safari = safariOpenExternalHref(href);
      if (safari) {
        window.location.href = safari;
        return true;
      }
    }
    if (android && escape) {
      var jump = (isZoomHref(href) && androidIntentHref(href, "us.zoom.videomeetings")) ||
        androidIntentHref(href, "com.android.chrome");
      if (jump) {
        window.location.href = jump;
        return true;
      }
    }
    var w = null;
    try { w = window.open(href, "_blank", "noopener,noreferrer"); } catch (err) {}
    if (w) {
      try { w.opener = null; } catch (e2) {}
      return true;
    }
    window.location.href = href;
    return true;
  }

  window.FS.openMeetingLink = openMeetingLink;

  function orgEventReplayMap(ev) {
    var src = ev && ev.replay_by_date;
    if (!src || typeof src !== "object" || Array.isArray(src)) return {};
    return src;
  }

  function orgEventReplayUrl(ev, ymd) {
    var href = window.FS.normalizeMeetingHref || window.FS.safeHref;
    if (!ev || !href) return "";
    var on = ymd || localYmdFromIso(ev.starts_at);
    var dated = on && orgEventReplayMap(ev)[on];
    if (dated) return href(dated, 2000) || "";
    var seriesStart = localYmdFromIso(ev.series_starts_at || ev.starts_at);
    if (orgEventRepeat(ev) === "none" || !on || on === seriesStart) {
      return href(ev.replay_url || "", 2000) || "";
    }
    return "";
  }

  function formatReplayDayLabel(ymd) {
    var d = ymdToLocalDate(ymd);
    if (!d) return "";
    try {
      return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    } catch (e) {
      return ymd;
    }
  }

  function escapeIcsText(s) {
    return String(s == null ? "" : s)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function icsUtcStamp(d) {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function orgEventCalWindow(ev) {
    if (!ev || !ev.starts_at) return null;
    var start = new Date(ev.starts_at);
    if (isNaN(start.getTime())) return null;
    var end = ev.ends_at ? new Date(ev.ends_at) : new Date(start.getTime() + 60 * 60 * 1000);
    if (isNaN(end.getTime())) end = new Date(start.getTime() + 60 * 60 * 1000);
    return { start: start, end: end };
  }

  function orgEventCalTitleDesc(ev) {
    var copy = orgEventCopy();
    var title = ev.title || orgEventKindMeta(effectiveOrgKind(ev)).label;
    var orgLabel = copy.icsOrg || "";
    if (orgLabel && String(title).toLowerCase().indexOf(orgLabel.toLowerCase()) < 0) {
      title = title + " · " + orgLabel;
    }
    var descParts = [];
    if (ev.blurb) descParts.push(String(ev.blurb).trim());
    if (orgEventJoinUrl(ev)) {
      descParts.push("Join link: " + orgEventJoinUrl(ev));
    }
    descParts.push(copy.icsFrom);
    return { title: title, desc: descParts.join("\n\n") };
  }

  function buildOrgEventIcs(ev) {
    var win = orgEventCalWindow(ev);
    if (!win) return "";
    var start = win.start;
    var end = win.end;
    var copy = orgEventCopy();
    var meta = orgEventCalTitleDesc(ev);
    var title = meta.title;
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:" + copy.icsProd,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + String(ev.id || ("fs-" + start.getTime())) + "@first-seeds",
      "DTSTAMP:" + icsUtcStamp(new Date()),
      "DTSTART:" + icsUtcStamp(start),
      "DTEND:" + icsUtcStamp(end),
      (ev.repeat === "weekly" ? "RRULE:FREQ=WEEKLY" : ""),
      (ev.repeat === "monthly" ? "RRULE:FREQ=MONTHLY" : ""),
      "SUMMARY:" + escapeIcsText(title),
      "DESCRIPTION:" + escapeIcsText(meta.desc),
      "LOCATION:" + escapeIcsText(ev.location || ""),
      "END:VEVENT",
      "END:VCALENDAR"
    ].filter(Boolean);
    return lines.join("\r\n");
  }

  function buildGoogleCalUrl(ev) {
    var win = orgEventCalWindow(ev);
    if (!win) return "";
    var meta = orgEventCalTitleDesc(ev);
    var loc = String((ev && ev.location) || "").trim();
    var details = meta.desc.length > 1400 ? meta.desc.slice(0, 1390) + "…" : meta.desc;
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(meta.title) +
      "&dates=" + icsUtcStamp(win.start) + "/" + icsUtcStamp(win.end) +
      "&details=" + encodeURIComponent(details) +
      (loc ? "&location=" + encodeURIComponent(loc) : "");
  }

  function orgEventForCalendar(eventId, onYmd) {
    var ev = findOrgEvent(eventId);
    if (!ev) return null;
    var on = onYmd || "";
    if (!on) {
      var ed = getState && getState() && getState().data && getState().data.orgEventEditing;
      if (ed && String(ed.id) === String(ev.id) && ed.on) on = ed.on;
    }
    if (on) ev = orgEventAt(ev, on);
    return ev;
  }

  function openGoogleCal(ev) {
    if (!ev) return;
    var url = buildGoogleCalUrl(ev);
    if (!url) {
      if (window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast("This event doesn’t have a start time yet.", { tone: "bad" });
      }
      return;
    }
    if (url.length > 1800) {
      url = buildGoogleCalUrl(Object.assign({}, ev, { blurb: String(ev.blurb || "").slice(0, 280) }));
    }
    var a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function orgEventCalButtonsHtml(ev, opts) {
    opts = opts || {};
    if (!orgEventCalWindow(ev)) return "";
    var id = esc(ev.id);
    var on = "";
    if (ev && ev.starts_at && typeof localYmdFromIso === "function") {
      var ymd = localYmdFromIso(ev.starts_at);
      var raw = typeof findOrgEvent === "function" ? findOrgEvent(ev.id) : null;
      if (ymd && raw && ymd !== localYmdFromIso(raw.starts_at)) on = ymd;
    }
    var onAttr = on ? ' data-org-cal-on="' + esc(on) + '"' : "";
    if (opts.banner) {
      return '<button type="button" class="gathering-banner-cal" data-org-add-cal="' + id + '"' + onAttr + '>Add to phone calendar</button>' +
        '<button type="button" class="gathering-banner-cal" data-org-add-gcal="' + id + '"' + onAttr + '>Add to Google Calendar</button>';
    }
    return '<button type="button" class="btn org-event-cal-btn" data-org-add-cal="' + id + '"' + onAttr + '>Add to phone calendar</button>' +
      '<button type="button" class="btn-ghost org-event-cal-btn" data-org-add-gcal="' + id + '"' + onAttr + '>Add to Google Calendar</button>';
  }

  function downloadOrgEventIcs(ev) {
    if (!ev) return;
    var src = ev;
    if (!orgEventCalWindow(src)) {
      if (window.FS.UI && window.FS.UI.toast) {
        window.FS.UI.toast("This event doesn’t have a start time yet.", { tone: "bad" });
      }
      return;
    }
    try {
      var ics = buildOrgEventIcs(src);
      if (!ics) {
        FS.UI.toast("Couldn’t create a calendar file — try again in a moment.", { tone: "bad" });
        return;
      }
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var safe = String(src.title || orgEventCopy().fileSafe).replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || orgEventCopy().fileSafe;
      a.href = url;
      a.download = safe.slice(0, 48) + ".ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1500);
    } catch (err) {
      FS.UI.toast("Couldn’t create a calendar file — try again in a moment.", { tone: "bad" });
    }
  }

  /* Outbound invite text for Info Zooms — partners paste this to prospects. */
  function buildInfoZoomInviteText(ev) {
    var title = (ev && ev.title) || "Info Zoom";
    var when = formatLocalWhen(ev && ev.starts_at);
    var join = orgEventJoinUrl(ev);
    var lines = [
      "Hey! You’re invited to an Info Zoom about Ringana 🌿",
      "",
      title,
      when ? ("When: " + when) : "",
      (ev && ev.location) ? ("Where: " + String(ev.location).trim()) : "",
      (ev && ev.blurb) ? String(ev.blurb).trim() : "",
      join ? ("Join here: " + join) : "",
      "",
      "Would love to have you — no pressure, just a clear look at what’s coming."
    ];
    return lines.filter(function (line, i, arr) {
      if (line) return true;
      /* keep a single blank between blocks, drop trailing empties later */
      return i > 0 && i < arr.length - 1 && arr[i - 1] && arr[i + 1];
    }).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  /* Outbound replay text — same job as the invite, after the live call. */
  function buildInfoZoomReplayText(ev) {
    var replay = orgEventReplayUrl(ev, localYmdFromIso(ev && ev.starts_at));
    return [
      "Hey! If you missed the zoom on Ringana, here’s the replay 🌿",
      replay || "",
      "",
      "No pressure of course, I just want you to have a clear look at what’s coming!"
    ].join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  async function copyTextWithFallback(text, btn, doneLabel) {
    doneLabel = doneLabel || "Copied ✓";
    var prev = btn ? btn.textContent : "";
    function mark() {
      if (!btn) return;
      btn.textContent = doneLabel;
      setTimeout(function () { btn.textContent = prev; }, 1600);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        mark();
        return;
      }
      throw new Error("no clipboard");
    } catch (err) {
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
        if (ok) mark();
        else FS.UI.toast("Couldn’t copy — long-press and copy the text instead.", { tone: "bad" });
      } catch (err2) {
        FS.UI.toast("Couldn’t copy — long-press and copy the text instead.", { tone: "bad" });
      }
    }
  }

  function setCalSheetOrgMode(on) {
    var panel = document.querySelector("#calSheet .cal-sheet-panel");
    if (panel) panel.classList.toggle("is-org-event", !!on);
  }

  function localYmdFromIso(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return Cal.ymd(d);
    } catch (e) {
      return "";
    }
  }

  function localTzName(d) {
    try {
      var parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(d);
      var i;
      for (i = 0; i < parts.length; i++) {
        if (parts[i].type === "timeZoneName") return String(parts[i].value || "").trim();
      }
    } catch (e) {}
    return "";
  }

  function formatLocalTime(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      var t = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      var tz = localTzName(d);
      return tz ? (t + " " + tz) : t;
    } catch (e) {
      return "";
    }
  }

  function formatLocalWhen(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      var when = d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
      var tz = localTzName(d);
      return tz ? (when + " " + tz) : when;
    } catch (e) {
      return "";
    }
  }

  function paintOrgEventTzHint() {
    var hint = $("orgEventTzHint");
    if (!hint) return;
    var startsEl = $("orgEventStarts");
    var iso = localInputToIso(startsEl && startsEl.value);
    if (!iso) {
      hint.textContent = "This phone uses your timezone. The same moment shows in each person’s zone — Eastern 7pm is Pacific 4pm.";
      return;
    }
    hint.textContent = formatLocalWhen(iso) + " on this phone. Everyone else sees that same moment in their timezone.";
  }

  function isoToLocalInputValue(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
        "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
    } catch (e) {
      return "";
    }
  }

  function localInputToIso(val) {
    if (!val) return "";
    /* datetime-local is "YYYY-MM-DDTHH:mm" with no zone. Safari has treated
       that as UTC; build a local Date from the parts so team events stay on
       the day and time they picked. */
    var m = String(val).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
    if (m) {
      var local = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
      if (!isNaN(local.getTime())) return local.toISOString();
    }
    var d = new Date(val);
    if (isNaN(d.getTime())) return "";
    return d.toISOString();
  }

  function ymdToLocalDate(ymd) {
    var p = String(ymd || "").split("-");
    if (p.length < 3) return null;
    var y = +p[0], m = +p[1], d = +p[2];
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 12, 0, 0);
  }

  function orgEventRepeat(ev) {
    var r = ev && ev.repeat;
    return r === "weekly" || r === "monthly" ? r : "none";
  }

  function addMonthsKeepDay(start, n) {
    var y = start.getFullYear();
    var m = start.getMonth() + n;
    var ny = y + Math.floor(m / 12);
    var nm = ((m % 12) + 12) % 12;
    var day = start.getDate();
    var last = new Date(ny, nm + 1, 0).getDate();
    var out = new Date(start.getTime());
    out.setFullYear(ny, nm, Math.min(day, last));
    return out;
  }

  function orgEventRepeatsOn(ev, ymd) {
    if (!ev || !ymd) return false;
    var startYmd = localYmdFromIso(ev.starts_at);
    if (!startYmd) return false;
    if (ymd < startYmd) return false;
    var r = orgEventRepeat(ev);
    if (r === "none") return ymd === startYmd;
    var start = ymdToLocalDate(startYmd);
    var on = ymdToLocalDate(ymd);
    if (!start || !on) return false;
    if (r === "weekly") {
      var diff = Math.round((on.getTime() - start.getTime()) / 864e5);
      return diff % 7 === 0;
    }
    var last = new Date(on.getFullYear(), on.getMonth() + 1, 0).getDate();
    return on.getDate() === Math.min(start.getDate(), last);
  }

  function occurrenceIso(ev, ymd) {
    var local = isoToLocalInputValue(ev && ev.starts_at);
    if (!ev || !ymd || !local) return ev && ev.starts_at;
    var time = local.slice(11) || "19:00";
    return localInputToIso(ymd + "T" + time);
  }

  function orgEventAt(ev, ymd) {
    if (!ev) return ev;
    var on = ymd || localYmdFromIso(ev.starts_at);
    var startYmd = localYmdFromIso(ev.series_starts_at || ev.starts_at);
    if (!on || on === startYmd) return ev;
    var next = Object.assign({}, ev);
    if (!next.series_starts_at) next.series_starts_at = ev.starts_at;
    next.starts_at = occurrenceIso(ev, on);
    next.replay_url = orgEventReplayUrl(ev, on);
    if (ev.ends_at) {
      var delta = new Date(ev.ends_at).getTime() - new Date(ev.starts_at).getTime();
      if (!isNaN(delta) && delta > 0) {
        next.ends_at = new Date(new Date(next.starts_at).getTime() + delta).toISOString();
      }
    }
    return next;
  }

  function nextOccurrenceIso(ev, fromMs) {
    fromMs = fromMs == null ? Date.now() : fromMs;
    var start = new Date(ev && ev.starts_at);
    if (!ev || isNaN(start.getTime())) return null;
    var r = orgEventRepeat(ev);
    var horizon = fromMs + 420 * 864e5;
    function stillCurrent(iso) {
      var closeAt = orgEventJoinCloseAt(Object.assign({}, ev, { starts_at: iso }));
      return !isNaN(closeAt) && closeAt >= fromMs;
    }
    if (r === "none") return stillCurrent(ev.starts_at) ? ev.starts_at : null;
    var n = 0;
    while (n < 80) {
      var cur = r === "weekly"
        ? (function () { var d = new Date(start.getTime()); d.setDate(d.getDate() + 7 * n); return d; })()
        : addMonthsKeepDay(start, n);
      if (cur.getTime() > horizon) return null;
      var iso = cur.toISOString();
      if (stillCurrent(iso)) return iso;
      n += 1;
    }
    return null;
  }

  var orgEventsRefreshInflight = null;

  function orgEventsStoreKey() {
    var u = Cloud.user && Cloud.user();
    return u && u.id ? "firstSeeds_orgEvents:" + u.id : "";
  }

  function readStoredOrgEvents() {
    try {
      var key = orgEventsStoreKey();
      if (!key) return null;
      var raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      var parsed = JSON.parse(raw || "null");
      if (!parsed || !Array.isArray(parsed.events) || !parsed.events.length) return null;
      if (Date.now() - Number(parsed.at || 0) > 36 * 60 * 60 * 1000) return null;
      return parsed.events;
    } catch (e) {
      return null;
    }
  }

  function writeStoredOrgEvents(events) {
    try {
      var key = orgEventsStoreKey();
      if (!key) return;
      var payload = JSON.stringify({ at: Date.now(), events: events || [] });
      try { localStorage.setItem(key, payload); } catch (eLocal) {}
      sessionStorage.setItem(key, payload);
    } catch (e) {}
  }

  function hydrateOrgEventsFromStore() {
    if (orgEventsCache.length) return;
    var stored = readStoredOrgEvents();
    if (!stored) return;
    orgEventsCache = stored;
    try { renderGatheringBanner(); } catch (eBan) {}
    if (window.FS.onOrgEventsReady) {
      try { window.FS.onOrgEventsReady(); } catch (eReady) {}
    }
  }

  function orgEventsForDay(ymd) {
    return orgEventsCache.filter(function (ev) {
      return orgEventRepeatsOn(ev, ymd);
    });
  }

  function findOrgEvent(id) {
    for (var i = 0; i < orgEventsCache.length; i++) {
      if (orgEventsCache[i] && orgEventsCache[i].id === id) return orgEventsCache[i];
    }
    return null;
  }

  async function refreshOrgEvents(force) {
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      orgEventsCache = [];
      orgEventsLoadedAt = 0;
      return [];
    }
    if (Cloud.eventsScopeReady && !Cloud.eventsScopeReady()) {
      orgEventsCache = [];
      orgEventsLoadedAt = 0;
      return [];
    }
    hydrateOrgEventsFromStore();
    var now = Date.now();
    if (!force && orgEventsLoadedAt && now - orgEventsLoadedAt < 90000) {
      return orgEventsCache;
    }
    if (force && Cloud.invalidateOrgEventsNet) Cloud.invalidateOrgEventsNet();
    if (orgEventsRefreshInflight && !force) return orgEventsRefreshInflight;
    orgEventsRefreshInflight = (async function () {
      try {
        var rows = await Cloud.listOrgEvents({
          includeLeaderTeamZooms: leaderTeamZoomsOn()
        });
        orgEventsCache = rows || [];
        orgEventsLoadedAt = Date.now();
        writeStoredOrgEvents(orgEventsCache);
        if (window.FS.onOrgEventsReady) {
          try { window.FS.onOrgEventsReady(); } catch (eReady) {}
        }
      } catch (err) {
        console.warn("[First Seeds] org events:", err);
        if (!orgEventsCache.length) orgEventsLoadedAt = 0;
        if (!orgEventsCache.length && window.FS.UI && window.FS.UI.toast) {
          window.FS.UI.toast("Couldn’t refresh team dates just now.", { tone: "bad" });
        }
      }
      orgEventsRefreshInflight = null;
      return orgEventsCache;
    })();
    return orgEventsRefreshInflight;
  }

  function todayYmd() {
    try {
      if (Cal && Cal.ymd) return Cal.ymd(new Date());
    } catch (e) {}
    return localYmdFromIso(new Date().toISOString());
  }

  function shiftYmd(ymd, days) {
    var d = ymdToLocalDate(ymd);
    if (!d) return "";
    d.setDate(d.getDate() + days);
    try {
      if (Cal && Cal.ymd) return Cal.ymd(d);
    } catch (e) {}
    return localYmdFromIso(d.toISOString());
  }

  function normalizeOccursOn(raw) {
    if (raw instanceof Date && !isNaN(raw.getTime())) {
      if (raw.getUTCHours() === 0 && raw.getUTCMinutes() === 0 && raw.getUTCSeconds() === 0) {
        return raw.toISOString().slice(0, 10);
      }
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      return raw.getFullYear() + "-" + pad(raw.getMonth() + 1) + "-" + pad(raw.getDate());
    }
    var s = String(raw || "").trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return localYmdFromIso(s) || "";
  }

  function normalizeInfoNote(row) {
    if (!row) return row;
    var next = Object.assign({}, row);
    next.occurs_on = normalizeOccursOn(next.occurs_on);
    next.status = next.status === "attended" ? "attended" : (next.status === "invited" ? "invited" : "");
    return next;
  }

  function focusInfoZoom() {
    var now = Date.now();
    var today = todayYmd();
    var yesterday = today ? shiftYmd(today, -1) : "";
    var best = null;
    var bestRank = Infinity;
    (orgEventsCache || []).forEach(function (raw) {
      if (!raw || effectiveOrgKind(raw) !== "info_zoom") return;
      var occ = null;
      if (yesterday && orgEventRepeatsOn(raw, yesterday)) {
        var yestOcc = orgEventAt(raw, yesterday);
        if (orgEventJoinOpen(yestOcc)) occ = yestOcc;
      }
      if (!occ && today && orgEventRepeatsOn(raw, today)) {
        var todayOcc = orgEventAt(raw, today);
        if (todayOcc && !orgEventIsPast(todayOcc)) occ = todayOcc;
      }
      if (!occ) {
        var iso = nextOccurrenceIso(raw, now);
        if (iso) occ = orgEventAt(raw, localYmdFromIso(iso));
      }
      if (!occ || !occ.starts_at) return;
      var occYmd = localYmdFromIso(occ.starts_at);
      if (!occYmd) return;
      if (occYmd < today && !orgEventJoinOpen(occ)) return;
      var t = new Date(occ.starts_at).getTime();
      if (isNaN(t)) return;
      var rank = t;
      if (orgEventJoinOpen(occ)) rank -= 2e15;
      else if (occYmd === today) rank -= 1e15;
      if (rank < bestRank) {
        bestRank = rank;
        best = occ;
      }
    });
    return best;
  }

  function infoNoteStatus(leadId, eventId, occursOn) {
    var id = String(leadId || "");
    var eid = String(eventId || "");
    var on = normalizeOccursOn(occursOn);
    var i;
    for (i = 0; i < leadInfoNotesCache.length; i++) {
      var row = leadInfoNotesCache[i];
      if (row && String(row.lead_id) === id && String(row.event_id) === eid &&
        normalizeOccursOn(row.occurs_on) === on) {
        return row.status === "attended" ? "attended" : (row.status === "invited" ? "invited" : "");
      }
    }
    return "";
  }

  function infoNotesForOccurrence(eventId, occursOn) {
    var eid = String(eventId || "");
    var on = normalizeOccursOn(occursOn);
    return leadInfoNotesCache.filter(function (row) {
      return row && String(row.event_id) === eid && normalizeOccursOn(row.occurs_on) === on;
    });
  }

  function patchInfoNoteCache(leadId, eventId, occursOn, status, saved) {
    var id = String(leadId || "");
    var eid = String(eventId || "");
    var on = normalizeOccursOn(occursOn);
    var next = [];
    var i;
    for (i = 0; i < leadInfoNotesCache.length; i++) {
      var row = leadInfoNotesCache[i];
      if (row && String(row.lead_id) === id && String(row.event_id) === eid &&
        normalizeOccursOn(row.occurs_on) === on) continue;
      next.push(row);
    }
    if (status === "invited" || status === "attended") {
      var savedNote = normalizeInfoNote(saved || {});
      next.unshift({
        id: savedNote.id,
        lead_id: id,
        event_id: eid,
        occurs_on: on,
        status: status,
        partner_id: savedNote.partner_id || (Cloud.user() && Cloud.user().id)
      });
    }
    leadInfoNotesCache = next;
  }

  async function refreshLeadInfoNotes() {
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      leadInfoNotesCache = [];
      leadInfoNotesLoaded = true;
      return [];
    }
    try {
      leadInfoNotesCache = (await Cloud.listLeadEventNotes()).map(normalizeInfoNote);
    } catch (err) {
      if (window.FS && typeof window.FS.reportError === "function") {
        window.FS.reportError("lead event notes", err);
      } else {
        console.warn("[First Seeds] lead event notes:", err);
      }
      /* Keep last-good cache on a transient fail so the inbox doesn't blank. */
    }
    leadInfoNotesLoaded = true;
    return leadInfoNotesCache;
  }

  var infoNoteSaves = {};

  async function persistLeadInfoNote(leadId, eventId, occursOn) {
    var want = infoNoteStatus(leadId, eventId, occursOn);
    try {
      var saved = await Cloud.upsertLeadEventNote(leadId, eventId, occursOn, want);
      if (infoNoteStatus(leadId, eventId, occursOn) === want) {
        patchInfoNoteCache(leadId, eventId, occursOn, want, saved);
      }
      return saved;
    } catch (err) {
      try { await refreshLeadInfoNotes(); } catch (e2) {}
      throw err;
    }
  }

  function setLeadInfoStatus(leadId, eventId, occursOn, status) {
    status = status === "attended" ? "attended" : (status === "invited" ? "invited" : "");
    occursOn = normalizeOccursOn(occursOn);
    var cur = infoNoteStatus(leadId, eventId, occursOn);
    if (cur === status) return Promise.resolve(null);
    patchInfoNoteCache(leadId, eventId, occursOn, status, null);
    var key = String(leadId || "") + "|" + String(eventId || "") + "|" + occursOn;
    var prev = infoNoteSaves[key] || Promise.resolve();
    var run = prev.then(function () {
      return persistLeadInfoNote(leadId, eventId, occursOn);
    }, function () {
      return persistLeadInfoNote(leadId, eventId, occursOn);
    });
    infoNoteSaves[key] = run;
    return run;
  }

  function infoZoomInviteLabel(ev) {
    if (!ev || !ev.starts_at) return "Invited to this Info Zoom";
    var occYmd = localYmdFromIso(ev.starts_at);
    var today = todayYmd();
    if (occYmd && occYmd === today) return "Invited to today’s Info Zoom";
    try {
      var d = new Date(ev.starts_at);
      if (!isNaN(d.getTime())) {
        var weekday = d.toLocaleDateString(undefined, { weekday: "long" });
        if (weekday) {
          var todayWeekday = new Date().toLocaleDateString(undefined, { weekday: "long" });
          if (occYmd && today && occYmd > today && weekday === todayWeekday) {
            return "Invited to next " + weekday + "’s Info Zoom";
          }
          return "Invited to " + weekday + "’s Info Zoom";
        }
      }
    } catch (e) {}
    return "Invited to this Info Zoom";
  }

  function leadInfoInviteRowHtml(leadId, focus) {
    if (!focus || !focus.id) return "";
    var onYmd = localYmdFromIso(focus.starts_at);
    if (!onYmd) return "";
    var st = infoNoteStatus(leadId, focus.id, onYmd);
    var pressed = st === "invited" || st === "attended";
    return (
      '<button type="button" class="leads-info-invite is-side' + (pressed ? " is-on" : "") +
      '" data-lead-info-invite="' + esc(leadId) + '" aria-pressed="' + (pressed ? "true" : "false") + '">' +
      '<span class="leads-info-invite-mark" aria-hidden="true"></span>' +
      '<span>' + esc(infoZoomInviteLabel(focus)) + "</span></button>"
    );
  }

  async function ensureLeadsForGuests() {
    if (leadsCache.length) return leadsCache;
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) return [];
    try {
      var user = Cloud.user();
      var rows = await Cloud.listMyLeads();
      leadsCache = (rows || []).filter(function (r) {
        return !r.partner_id || !user || r.partner_id === user.id;
      });
    } catch (err) {
      console.warn("[First Seeds] listMyLeads for guests:", err);
    }
    return leadsCache;
  }

  function infoGuestPickerKey(eventId, occursOn) {
    return String(eventId || "") + ":" + String(occursOn || "");
  }

  function infoGuestsHtml(ev) {
    if (!ev || !ev.id) return "";
    var onYmd = localYmdFromIso(ev.starts_at);
    if (!onYmd) return "";
    if (!leadInfoNotesLoaded) {
      return '<div class="org-event-guests" data-info-guests="' + esc(ev.id) + '" data-info-on="' + esc(onYmd) + '">' +
        '<p class="org-event-guests-label">Your guests</p>' +
        '<p class="org-event-guests-empty">Loading your guests…</p></div>';
    }
    var notes = infoNotesForOccurrence(ev.id, onYmd);
    var invitedN = 0;
    var attendedN = 0;
    var rows = [];
    var leadsReady = (leadsCache || []).length > 0;
    notes.forEach(function (n) {
      if (!n) return;
      var lead = findLeadInCache(n.lead_id);
      if (!lead && leadsReady) return;
      if (n.status === "attended") attendedN++;
      else invitedN++;
      rows.push({
        leadId: n.lead_id,
        name: (lead && lead.name) || "Lead",
        status: n.status === "attended" ? "attended" : "invited"
      });
    });
    rows.sort(function (a, b) {
      if (a.status !== b.status) return a.status === "invited" ? -1 : 1;
      return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
    });
    var key = infoGuestPickerKey(ev.id, onYmd);
    if (infoGuestPicker.eventId !== String(ev.id) || infoGuestPicker.occursOn !== onYmd) {
      infoGuestPicker = { open: false, q: "", eventId: String(ev.id), occursOn: onYmd };
    }
    var html = '<div class="org-event-guests" data-info-guests="' + esc(ev.id) + '" data-info-on="' + esc(onYmd) + '">';
    html += '<p class="org-event-guests-label">Your guests</p>';
    if (!rows.length) {
      html += '<p class="org-event-guests-empty">Nobody marked yet — add from your inbox.</p>';
    } else {
      html += '<p class="org-event-guests-count">' + invitedN + " invited · " + attendedN + " on the call</p>";
      html += '<ul class="org-event-guest-list">';
      rows.forEach(function (row) {
        html += '<li class="org-event-guest">';
        html += '<div class="org-event-guest-name">' + esc(row.name) + "</div>";
        html += '<div class="org-event-guest-actions">';
        html += '<button type="button" class="org-event-guest-chip' + (row.status === "invited" ? " on" : "") +
          '" data-info-guest-status="invited" data-lead-id="' + esc(row.leadId) + '">Invited</button>';
        html += '<button type="button" class="org-event-guest-chip' + (row.status === "attended" ? " on is-call" : "") +
          '" data-info-guest-status="attended" data-lead-id="' + esc(row.leadId) + '">On the call</button>';
        html += '<button type="button" class="org-event-guest-clear" data-info-guest-clear="' + esc(row.leadId) +
          '" aria-label="Remove ' + esc(row.name) + '">Remove</button>';
        html += "</div></li>";
      });
      html += "</ul>";
    }
    html += '<details class="org-event-guest-add"' + (infoGuestPicker.open ? " open" : "") +
      ' data-info-guest-picker="' + esc(key) + '">';
    html += '<summary class="org-event-guest-add-sum">Add from inbox</summary>';
    html += '<div class="org-event-guest-add-body">';
    html += '<label class="sr-only" for="infoGuestSearch">Search your inbox</label>';
    html += '<input type="search" id="infoGuestSearch" class="org-event-guest-search" data-info-guest-q placeholder="Search your inbox…" value="' +
      esc(infoGuestPicker.q || "") + '" autocomplete="off">';
    html += '<div class="org-event-guest-results" data-info-guest-results>';
    html += infoGuestResultsHtml(ev.id, onYmd, infoGuestPicker.q);
    html += "</div></div></details></div>";
    return html;
  }

  function leadIsClosed(r) {
    var s = r && r.status;
    return s === "archived" || s === "joined";
  }

  function leadIsOpen(r) {
    var s = r && r.status;
    return s === "new" || s === "reached" || s === "talking" || s === "fb" || s === "done";
  }

  function infoGuestResultsHtml(eventId, occursOn, q) {
    q = String(q || "").trim().toLowerCase();
    var taken = {};
    infoNotesForOccurrence(eventId, occursOn).forEach(function (n) {
      if (n && n.lead_id) taken[String(n.lead_id)] = true;
    });
    var rows = (leadsCache || []).filter(function (r) {
      if (!r || !r.id || taken[String(r.id)]) return false;
      if (leadIsClosed(r)) return false;
      if (!q) return true;
      var blob = [r.name, r.email, r.phone].join(" ").toLowerCase();
      return blob.indexOf(q) >= 0;
    });
    rows.sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
    });
    if (!q) rows = rows.slice(0, 12);
    if (!rows.length) {
      return '<p class="org-event-guests-empty">' +
        (q ? "No inbox match for that name." : "Your open inbox is already on this list — or add a lead first.") +
        "</p>";
    }
    var html = "";
    rows.forEach(function (r) {
      html += '<button type="button" class="org-event-guest-pick" data-info-guest-add="' + esc(r.id) + '">' +
        '<span>' + esc(r.name) + "</span>" +
        (r.interest ? '<span class="org-event-guest-pick-meta">' + esc(interestLabel(r.interest)) + "</span>" : "") +
        "</button>";
    });
    return html;
  }

  function paintInfoGuests(ev) {
    var wrap = document.querySelector("[data-info-guests]");
    if (!wrap || !ev) return;
    var hold = document.activeElement && document.activeElement.getAttribute &&
      document.activeElement.getAttribute("data-info-guest-q") != null;
    var qVal = infoGuestPicker.q || "";
    wrap.outerHTML = infoGuestsHtml(ev);
    if (hold) {
      var search = document.querySelector("[data-info-guest-q]");
      if (search) {
        search.value = qVal;
        try {
          search.focus();
          search.setSelectionRange(qVal.length, qVal.length);
        } catch (e) {}
      }
    }
  }

  function viewingInfoZoom() {
    var st = getState && getState();
    var ed = st && st.data && st.data.orgEventEditing;
    if (!ed || ed.mode !== "view" || !ed.id) return null;
    var ev = findOrgEvent(ed.id);
    if (!ev) return null;
    ev = orgEventAt(ev, ed.on);
    if (effectiveOrgKind(ev) !== "info_zoom") return null;
    return ev;
  }

  function nextUpcomingGathering() {
    var now = Date.now();
    var best = null;
    var bestT = Infinity;
    orgEventsCache.forEach(function (ev) {
      if (!ev || !isJoinableOrgKind(effectiveOrgKind(ev))) return;
      var iso = nextOccurrenceIso(ev, now);
      if (!iso) return;
      var t = new Date(iso).getTime();
      if (isNaN(t) || t >= bestT) return;
      bestT = t;
      best = orgEventAt(ev, localYmdFromIso(iso));
    });
    return best;
  }

  function shouldShowGatheringBanner(ev) {
    if (!ev) return false;
    var st = getState && getState();
    if (!st || !st.data) return false;
    if (st.data.gatheringBannerDismissedId) {
      var onYmd = localYmdFromIso(ev.starts_at);
      var occKey = String(ev.id) + ":" + onYmd;
      if (st.data.gatheringBannerDismissedId === occKey) return false;
      if (orgEventRepeat(ev) === "none" && String(st.data.gatheringBannerDismissedId) === String(ev.id)) {
        return false;
      }
    }
    var starts = new Date(ev.starts_at).getTime();
    if (isNaN(starts)) return false;
    var now = Date.now();
    var closeAt = orgEventJoinCloseAt(ev);
    if (!isNaN(closeAt) && starts <= now && now <= closeAt) return true;
    if (!isNaN(closeAt) && now > closeAt) return false;
    if (starts < now) return false;
    if (packEvergreen()) {
      return starts - now <= 7 * 864e5;
    }
    var isStarter = st.settings && st.settings.hubMode === "starter";
    if (isStarter) {
      /* Soft start has no Calendar tab — show Gatherings within 14 days. */
      return starts - now <= 14 * 864e5;
    }
    /* All in: only within 24h before start */
    return starts - now <= 864e5;
  }

  function renderGatheringBanner() {
    var el = $("gatheringBanner");
    if (!el) return;
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    var ev = nextUpcomingGathering();
    if (!shouldShowGatheringBanner(ev)) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    var meta = orgEventKindMeta(effectiveOrgKind(ev));
    var when = formatLocalWhen(ev.starts_at);
    var joinReady = orgEventJoinOpen(ev);
    var join = orgEventJoinUrl(ev);
    var joinCta = orgEventJoinCta(ev);
    var onYmd = localYmdFromIso(ev.starts_at);
    var revealKey = String(ev.id) + ":" + onYmd;
    var revealed = !!(join && joinReady && !joinCta.live && gatheringBannerLinkOpenKey === revealKey);
    var actionsHtml;
    if (joinReady && join && joinCta.live) {
      actionsHtml = '<a class="gathering-banner-join" href="' + esc(join) +
        '" target="_blank" rel="noopener noreferrer" data-meeting-open>Join now</a>';
    } else if (joinReady && join && !revealed) {
      actionsHtml = '<button type="button" class="gathering-banner-join is-early" data-gathering-reveal="' +
        esc(ev.id) + '" data-gathering-on="' + esc(onYmd) + '">Tap for the link</button>';
    } else if (!(joinReady && join)) {
      actionsHtml = orgEventCalButtonsHtml(ev, { banner: true });
    } else {
      actionsHtml = "";
    }
    el.hidden = false;
    el.innerHTML =
      '<button type="button" class="gathering-banner-dismiss" data-gathering-dismiss="' + esc(ev.id) +
        '" data-gathering-on="' + esc(onYmd) + '">Dismiss</button>' +
      '<div class="gathering-banner-copy">' +
        '<p class="gathering-banner-tag">' + esc(ev.leader_only ? "Leader exclusive" : meta.label) + "</p>" +
        '<div class="gathering-banner-main">' +
          '<div class="gathering-banner-text">' +
            '<p class="gathering-banner-title">' + esc(ev.title || meta.label) + "</p>" +
            (when ? '<p class="gathering-banner-when">' + esc(when) + "</p>" : "") +
          "</div>" +
          (actionsHtml ? '<div class="gathering-banner-actions">' + actionsHtml + "</div>" : "") +
        "</div>" +
        (revealed
          ? '<div class="gathering-banner-linkbox">' +
            '<p class="gathering-banner-url">' + esc(join) + "</p>" +
            '<a class="gathering-banner-join" href="' + esc(join) +
              '" target="_blank" rel="noopener noreferrer" data-meeting-open>Open Zoom</a>' +
            '<button type="button" class="gathering-banner-join" data-org-copy-link="' +
              esc(ev.id) + '">Copy the link</button>' +
            "</div>"
          : "") +
      "</div>";
    ensureOrgEventJoinTick();
  }

  function refreshOrgEventJoinLabels() {
    var st = getState && getState();
    var ed = st && st.data && st.data.orgEventEditing;
    if (ed && ed.id && ed.mode !== "edit") {
      var ev = findOrgEvent(ed.id);
      if (ev) {
        ev = orgEventAt(ev, ed.on);
        var joinEl = document.querySelector(".org-event-actions a.org-event-join:not(.is-replay)");
        if (joinEl && orgEventJoinUrl(ev) && orgEventJoinOpen(ev)) {
          var cta = orgEventJoinCta(ev);
          var copyEl = document.querySelector(".org-event-actions [data-org-copy-link]");
          if (joinEl.textContent !== cta.label) {
            joinEl.textContent = cta.label;
            joinEl.classList.toggle("is-early", !cta.live);
          }
          if (cta.live && !copyEl) {
            var copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "btn-ghost";
            copyBtn.setAttribute("data-org-copy-link", ev.id);
            copyBtn.textContent = "Copy meeting link";
            joinEl.insertAdjacentElement("afterend", copyBtn);
          } else if (!cta.live && copyEl) {
            copyEl.parentNode.removeChild(copyEl);
          }
        }
      }
    }
    renderGatheringBanner();
  }
  function ensureOrgEventJoinTick() {
    if (orgEventJoinTick) return;
    orgEventJoinTick = setInterval(refreshOrgEventJoinLabels, 20000);
  }

  function dismissGatheringBanner(eventId, onYmd) {
    var st = getState && getState();
    if (!st || !st.data) return;
    st.data.gatheringBannerDismissedId = onYmd ? String(eventId) + ":" + onYmd : eventId;
    if (persist) persist();
    renderGatheringBanner();
  }

  function openOrgEventViewer(eventId, onYmd) {
    var ev = findOrgEvent(eventId);
    if (!ev) return;
    var st = getState();
    if (!st) return;
    st.data.calendarEditing = null;
    st.data.libraryEditing = null;
    st.data.orgEventEditing = { id: ev.id, mode: "view", on: onYmd || "" };
    if (persist) persist();
    renderOrgEventSheet();
    openCalSheet();
    if (effectiveOrgKind(ev) === "info_zoom" && !packEvergreen()) {
      Promise.resolve()
        .then(function () { return refreshOrgEvents(); })
        .then(function () { return ensureLeadsForGuests(); })
        .then(function () { return refreshLeadInfoNotes(); })
        .then(function () {
          var cur = getState();
          if (!cur || !cur.data || !cur.data.orgEventEditing) return;
          if (String(cur.data.orgEventEditing.id) !== String(eventId)) return;
          if (cur.data.orgEventEditing.mode !== "view") return;
          var live = findOrgEvent(eventId);
          if (!live) return;
          live = orgEventAt(live, cur.data.orgEventEditing.on);
          paintInfoGuests(live);
        })
        .catch(function (err) {
          console.warn("[First Seeds] info guests:", err);
        });
    }
  }

  function openOrgEventEditor(eventId, defaultYmd, opts) {
    opts = opts || {};
    var ev = eventId ? findOrgEvent(eventId) : null;
    var audience = opts.audience || (ev && orgEventAudience(ev)) || "org";
    if (ev) {
      if (!canManageOrgEvent(ev)) return;
    } else if (audience === "org") {
      if (!canEditCalendar()) return;
    } else if (audience === "downline") {
      if (!canCreateDownlineZoom()) return;
    } else if (audience === "self") {
      if (!canCreatePersonalEvent()) return;
    } else {
      return;
    }
    var st = getState();
    if (!st) return;
    st.data.calendarEditing = null;
    st.data.libraryEditing = null;
    st.data.orgEventEditing = {
      id: eventId || null,
      mode: "edit",
      audience: audience,
      defaultYmd: defaultYmd || Cal.ymd(new Date()),
      on: opts.on || ""
    };
    if (persist) persist();
    renderOrgEventSheet();
    openCalSheet();
  }

  function syncOrgEventLeaderKind(on) {
    var kindEl = $("orgEventKind");
    if (!kindEl) return;
    var leaderVal = "leader_exclusive";
    var leaderOpt = kindEl.querySelector('option[value="' + leaderVal + '"]');
    if (on) {
      var current = kindEl.value;
      if (current !== leaderVal && !kindEl.getAttribute("data-kind-before")) {
        kindEl.setAttribute("data-kind-before", current || "gathering");
      }
      if (!leaderOpt) {
        leaderOpt = document.createElement("option");
        leaderOpt.value = leaderVal;
        leaderOpt.textContent = "Leader exclusive";
        kindEl.insertBefore(leaderOpt, kindEl.firstChild);
      }
      kindEl.value = leaderVal;
      kindEl.disabled = true;
    } else {
      var prev = kindEl.getAttribute("data-kind-before") || "gathering";
      if (prev === leaderVal) prev = "gathering";
      kindEl.removeAttribute("data-kind-before");
      if (leaderOpt && leaderOpt.parentNode) leaderOpt.parentNode.removeChild(leaderOpt);
      kindEl.disabled = false;
      kindEl.value = prev;
    }
  }

  function renderOrgEventSheet() {
    var detail = $("calendarDetail");
    var titleEl = $("calSheetTitle");
    var st = getState();
    if (!detail || !st || !st.data.orgEventEditing) return;
    var ed = st.data.orgEventEditing;
    var ev = ed.id ? findOrgEvent(ed.id) : null;
    var audience = ed.audience || orgEventAudience(ev);
    var canManage = ev ? canManageOrgEvent(ev) : (
      audience === "org" ? canEditCalendar()
        : audience === "downline" ? canCreateDownlineZoom()
        : canCreatePersonalEvent()
    );
    var isEdit = ed.mode === "edit" && canManage;
    var viewKind = effectiveOrgKind(ev) || (audience === "self" ? "personal" : "gathering");
    var kind = isEdit ? ((ev && ev.kind) || (audience === "self" ? "personal" : "gathering")) : viewKind;
    var meta = orgEventKindMeta(isEdit ? kind : viewKind);
    var leaderView = !!(ev && ev.leader_only);
    var mineDownline = !!(ev && Cloud.user && Cloud.user() && ev.created_by === Cloud.user().id);
    var kicker = audience === "self"
      ? "Just for you"
      : (audience === "downline"
        ? (mineDownline ? "Your team" : "A leader's team")
        : (isEdit ? (leaderView ? "Leader exclusive" : meta.label) : (leaderView ? "Leaders" : "Team moment")));
    setSheetKicker(kicker);
    setCalSheetOrgMode(!isEdit);
    if (titleEl) {
      titleEl.textContent = isEdit
        ? (ev
          ? (audience === "self" ? "Edit my date" : "Edit team event")
          : (audience === "self" ? "New date for me" : (audience === "downline" ? "New zoom for my team" : "New team event")))
        : ((ev && ev.title) || (leaderView ? "Leader exclusive" : meta.label));
    }

    if (!isEdit) {
      if (!ev) { closeCalSheet(); return; }
      ev = orgEventAt(ev, ed.on);
      var join = orgEventJoinUrl(ev);
      var joinReady = orgEventJoinOpen(ev);
      var isPast = orgEventIsPast(ev);
      var replay = orgEventReplayUrl(ev, ed.on);
      var when = formatLocalWhen(ev.starts_at);
      var html = "";
      html += '<div class="org-event-hero kind-' + esc(viewKind) + (replay ? " has-replay" : "") + (ev.leader_only ? " is-leader" : "") + '">';
      html += '<p class="org-event-hero-kicker">';
      if (ev.leader_only) {
        html += '<span class="org-event-leader-pill">★ Leader exclusive</span>';
      } else {
        html += esc(meta.label);
      }
      if (replay) html += '<span class="org-event-replay-pill">Replay ready</span>';
      html += "</p>";
      html += '<h3 class="org-event-hero-title">' + esc(ev.title || meta.label) + "</h3>";
      if (when) {
        html += '<p class="org-event-hero-when"><span class="org-event-hero-when-label">When</span>' +
          esc(when) + '<span class="org-event-hero-tz">your timezone</span></p>';
      }
      if (orgEventRepeat(ev) === "weekly") {
        html += '<p class="org-event-repeat">Repeats weekly</p>';
      } else if (orgEventRepeat(ev) === "monthly") {
        html += '<p class="org-event-repeat">Repeats monthly</p>';
      }
      if (ev.location) {
        html += '<p class="org-event-hero-place"><span class="org-event-hero-when-label">Where</span>' +
          esc(ev.location) + "</p>";
      }
      html += "</div>";
      if (ev.blurb) {
        html += '<div class="org-event-note"><p>' + esc(ev.blurb) + "</p></div>";
      }
      var ytReplay = replay && window.FS.YouTube ? window.FS.YouTube.parse(replay) : null;
      if (ytReplay) {
        html += window.FS.YouTube.posterHtml(replay, ev.title || "Replay");
      }
      html += '<div class="org-event-actions">';
      if (replay && ytReplay) {
        html += '<a class="btn-ghost" href="' + esc(replay) +
          '" target="_blank" rel="noopener noreferrer" data-meeting-open>Open on YouTube</a>';
        if (viewKind !== "info_zoom") {
          html += '<button type="button" class="btn-ghost" data-org-copy-replay="' + esc(ev.id) + '">Copy replay link</button>';
        }
      } else if (replay) {
        html += '<a class="btn org-event-join is-replay" href="' + esc(replay) +
          '" target="_blank" rel="noopener noreferrer" data-meeting-open>Watch replay</a>';
        if (viewKind !== "info_zoom") {
          html += '<button type="button" class="btn-ghost" data-org-copy-replay="' + esc(ev.id) + '">Copy replay link</button>';
        }
      }
      if (!isPast && !replay) {
        html += orgEventCalButtonsHtml(ev);
      }
      if (viewKind === "info_zoom" && replay) {
        html += '<button type="button" class="btn-ghost org-event-invite-btn" data-org-copy-replay="' + esc(ev.id) + '">Copy the replay</button>';
      } else if (viewKind === "info_zoom" && !isPast && !replay) {
        html += '<button type="button" class="btn-ghost org-event-invite-btn" data-org-copy-invite="' + esc(ev.id) + '">Copy invitation info</button>';
        html += '<p class="org-event-invite-hint">Paste this to invite someone — includes the time and Zoom link.</p>';
      }
      /* Link stays available until replay/past. Copy flips to Join now in the live window. */
      if (joinReady && join && !replay) {
        var joinCta = orgEventJoinCta(ev);
        html += '<a class="btn org-event-join' + (joinCta.live ? "" : " is-early") +
          '" href="' + esc(join) + '" target="_blank" rel="noopener noreferrer" data-meeting-open>' +
          esc(joinCta.label) + "</a>";
        if (joinCta.live) {
          html += '<button type="button" class="btn-ghost" data-org-copy-link="' + esc(ev.id) + '">Copy meeting link</button>';
        }
      } else if (!isPast && !replay && join && viewKind !== "info_zoom") {
        html += '<p class="org-event-join-wait">Meeting link unlocks 15 minutes before start.</p>';
      } else if (!isPast && !replay && join && viewKind === "info_zoom" && !joinReady) {
        html += '<p class="org-event-join-wait">Your Join button unlocks 15 minutes before start — the invitation copy already has the link for guests.</p>';
      } else if ((isPast || (!joinReady && orgEventStartPassed(ev))) && !replay && isJoinableOrgKind(viewKind)) {
        html += '<p class="org-event-join-wait">This one already happened' +
          (canManageOrgEvent(ev)
            ? " — Edit to add a replay link when it’s ready."
            : ". A replay will show up here once it’s posted.") +
          "</p>";
      }
      html += "</div>";
      if (viewKind === "info_zoom" && !isPast && !packEvergreen()) {
        html += '<div class="org-event-kit">';
        html += '<p class="org-event-kit-label">Invite kit</p>';
        html += '<p class="org-event-kit-blurb">DM scripts and ready Facebook invite posts — open these before you start inviting.</p>';
        html += '<button type="button" class="btn-ghost org-event-kit-btn" data-org-resource="talk-invite">Talking Fresh · invite scripts →</button>';
        html += '<button type="button" class="btn-ghost org-event-kit-btn" data-org-resource="vault-invite">Post vault · invite posts →</button>';
        html += "</div>";
      }
      if (viewKind === "info_zoom" && !packEvergreen()) {
        html += infoGuestsHtml(ev);
      }
      if (canManageOrgEvent(ev)) {
        html += '<div class="org-event-admin-row">';
        html += '<button type="button" class="btn-ghost" data-org-edit="' + esc(ev.id) +
          '" data-org-on="' + esc(ed.on || localYmdFromIso(ev.starts_at) || "") + '">Edit</button>';
        html += '<button type="button" class="btn-ghost danger-ghost" data-org-delete="' + esc(ev.id) + '">Delete</button>';
        html += "</div>";
      }
      html += '<button type="button" class="btn-ghost org-event-done" data-cal-save>Close</button>';
      detail.innerHTML = html;
      ensureOrgEventJoinTick();
      return;
    }

    setCalSheetOrgMode(false);

    var startsLocal = ev ? isoToLocalInputValue(ev.starts_at) : "";
    if (!startsLocal && ed.defaultYmd) startsLocal = ed.defaultYmd + "T19:00";
    var copy = orgEventCopy();
    var leaderOn = audience === "org" && !!(ev && ev.leader_only);
    var form = "";
    if (audience === "self") {
      form += '<label class="field"><span class="field-label">Kind</span>' +
        '<select id="orgEventKind" class="cal-select">' +
        '<option value="personal"' + (kind !== "in_person" ? " selected" : "") + ">Follow-up / reminder</option>" +
        '<option value="in_person"' + (kind === "in_person" ? " selected" : "") + ">In person</option>" +
        "</select></label>";
    } else {
      form += '<label class="field"><span class="field-label">Kind</span>' +
        '<select id="orgEventKind" class="cal-select"' +
        (leaderOn ? ' disabled data-kind-before="' + esc(kind) + '"' : "") + ">" +
        (leaderOn ? '<option value="leader_exclusive" selected>Leader exclusive</option>' : "") +
        '<option value="gathering"' + (!leaderOn && kind === "gathering" ? " selected" : "") + ">" + esc(copy.gathering) + "</option>" +
        '<option value="info_zoom"' + (!leaderOn && kind === "info_zoom" ? " selected" : "") + ">" + esc(copy.infoZoom) + "</option>" +
        (audience === "org" ? '<option value="milestone"' + (!leaderOn && kind === "milestone" ? " selected" : "") + ">Milestone</option>" : "") +
        '<option value="in_person"' + (!leaderOn && kind === "in_person" ? " selected" : "") + ">In person</option>" +
        "</select></label>";
    }
    form += '<div class="field"><span class="field-label">Title</span>' +
      '<input type="text" id="orgEventTitle" class="cal-input" maxlength="120" placeholder="' +
      esc(audience === "self" ? "e.g. Coffee with Sam" : copy.placeholder) + '" value="' +
      esc((ev && ev.title) || "") + '"></div>';
    form += '<div class="field"><span class="field-label">Date &amp; time (your timezone)</span>' +
      '<input type="datetime-local" id="orgEventStarts" class="cal-input" value="' + esc(startsLocal) + '">' +
      '<p class="field-hint" id="orgEventTzHint"></p></div>';
    form += '<label class="field"><span class="field-label">Repeat</span>' +
      '<select id="orgEventRepeat" class="cal-select">' +
      '<option value="none"' + (orgEventRepeat(ev) === "none" ? " selected" : "") + ">Doesn’t repeat</option>" +
      '<option value="weekly"' + (orgEventRepeat(ev) === "weekly" ? " selected" : "") + ">Weekly</option>" +
      '<option value="monthly"' + (orgEventRepeat(ev) === "monthly" ? " selected" : "") + ">Monthly</option>" +
      "</select></label>";
    if (audience === "org") {
      form += '<div class="org-event-star-row">' +
        '<button type="button" class="org-event-star-btn' + (leaderOn ? " is-on" : "") +
        '" id="orgEventLeaderOnly" data-org-leader-star aria-pressed="' + (leaderOn ? "true" : "false") +
        '" title="Leader exclusive">★</button>' +
        '<div><p class="org-event-star-label">Leader exclusive</p>' +
        '<p class="field-hint">Tap the star. Only leaders see this on the calendar.</p></div></div>';
    }
    if (audience !== "self") {
      form += '<div class="field"><span class="field-label">Zoom / meeting link</span>' +
        '<input type="text" inputmode="url" autocomplete="url" id="orgEventUrl" class="cal-input" placeholder="https://zoom.us/j/…" value="' +
        esc((ev && ev.meeting_url) || "") + '"></div>';
      var replayOn = ed.on || localYmdFromIso(ev && ev.starts_at) || ed.defaultYmd || "";
      var replayVal = orgEventReplayUrl(ev, replayOn);
      form += '<div class="field"><span class="field-label">Replay link <span class="field-optional">(after the call)</span></span>' +
        '<input type="text" inputmode="url" autocomplete="url" id="orgEventReplay" class="cal-input" placeholder="https://… recording or replay" value="' +
        esc(replayVal) + '"></div>';
      if (orgEventRepeat(ev) !== "none" && replayOn) {
        form += '<p class="field-hint">This replay is only for ' + esc(formatReplayDayLabel(replayOn) || replayOn) +
          ". Other weeks keep their own links.</p>";
      }
    }
    form += '<div class="field"><span class="field-label">Location (optional)</span>' +
      '<input type="text" id="orgEventLocation" class="cal-input" placeholder="Miami · or leave blank" value="' +
      esc((ev && ev.location) || "") + '"></div>';
    form += '<div class="field"><span class="field-label">Note</span>' +
      '<textarea id="orgEventBlurb" class="cal-input" rows="3" maxlength="2000" placeholder="' +
      esc(audience === "self" ? "Optional note, just for you…" : "Optional blurb for the team…") + '">' +
      esc((ev && ev.blurb) || "") + "</textarea></div>";
    if (audience === "self") {
      form += packEvergreen()
        ? '<p class="org-event-hint">Only you see this. It doesn’t ping anyone.</p>'
        : '<p class="org-event-hint">Only you see this — a date on the clock, not a post card. It doesn’t ping anyone.</p>';
    } else if (audience === "downline") {
      form += '<p class="org-event-hint">People on your tree see this. They get a reminder 15 minutes before it starts. It stays on Evergreen.</p>';
    } else {
      form += '<p class="org-event-hint">' + esc(copy.hint) + "</p>";
    }
    if (audience === "org" && Cloud.isSuperAdmin && Cloud.isSuperAdmin() && packEvergreen()) {
      if (ev && ev.twin_id) {
        form += '<p class="org-event-twin-note">Synced with Fresh Grove — edits (including replay) update both calendars.</p>';
      } else if (ev && ev.id) {
        form += '<button type="button" class="btn-ghost" data-org-copy-grove="' + esc(ev.id) + '">Copy to Fresh Grove</button>';
        form += '<p class="field-hint">Creates a linked copy on the Grove calendar. Replay and edits stay in sync.</p>';
      } else {
        form += '<label class="org-event-copy-grove"><input type="checkbox" id="orgEventCopyGrove"> Also copy to Fresh Grove</label>';
        form += '<p class="field-hint">A linked Grove copy — replay and later edits stay in sync.</p>';
      }
    }
    form += '<button type="button" class="btn" data-org-save="' + esc((ev && ev.id) || "") + '">' +
      (audience === "self" ? "Save for me" : (audience === "downline" ? "Save for my team" : "Save for everyone")) +
      "</button>";
    if (ev && ev.id) {
      form += '<button type="button" class="btn-ghost danger-ghost" data-org-delete="' + esc(ev.id) + '">Delete</button>';
    }
    form += '<button type="button" class="btn-ghost" data-cal-save>Cancel</button>';
    detail.innerHTML = form;
    paintOrgEventTzHint();
  }

  async function saveOrgEventFromSheet(existingId) {
    var btn = document.querySelector("[data-org-save]");
    if (btn && btn.disabled) return;
    var idle = btn ? btn.textContent : "";
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Saving…";
      }
      var kindEl = $("orgEventKind");
      var titleEl = $("orgEventTitle");
      var startsEl = $("orgEventStarts");
      var urlEl = $("orgEventUrl");
      var replayEl = $("orgEventReplay");
      var locEl = $("orgEventLocation");
      var blurbEl = $("orgEventBlurb");
      var repeatEl = $("orgEventRepeat");
      var starEl = $("orgEventLeaderOnly");
      var copyEl = $("orgEventCopyGrove");
      var startsAt = localInputToIso(startsEl && startsEl.value);
      var meetHref = window.FS.normalizeMeetingHref || window.FS.safeHref;
      if (urlEl && meetHref) {
        var cleanedMeet = meetHref(urlEl.value || "", 2000);
        if (cleanedMeet) urlEl.value = cleanedMeet;
      }
      if (replayEl && meetHref) {
        var cleanedReplay = meetHref(replayEl.value || "", 2000);
        if (cleanedReplay) replayEl.value = cleanedReplay;
      }
      var kind = kindEl ? kindEl.value : "gathering";
      if (kind === "leader_exclusive") {
        kind = (kindEl && kindEl.getAttribute("data-kind-before")) || "gathering";
        if (kind === "leader_exclusive") kind = "gathering";
      }
      var stSave = getState();
      var edSave = stSave && stSave.data && stSave.data.orgEventEditing;
      var saved = await Cloud.upsertOrgEvent({
        id: existingId || null,
        kind: kind,
        title: titleEl ? titleEl.value : "",
        starts_at: startsAt,
        meeting_url: urlEl ? urlEl.value : "",
        replay_url: replayEl ? replayEl.value : "",
        location: locEl ? locEl.value : "",
        blurb: blurbEl ? blurbEl.value : "",
        repeat: repeatEl ? repeatEl.value : "none",
        leader_only: !!(starEl && (starEl.getAttribute("aria-pressed") === "true" || starEl.classList.contains("is-on"))),
        audience: (edSave && edSave.audience) || "org",
        occurs_on: (edSave && edSave.on) || localYmdFromIso(startsAt) || ""
      });
      if (copyEl && copyEl.checked && saved && saved.id && Cloud.copyOrgEventToGrove) {
        try { saved = await Cloud.copyOrgEventToGrove(saved.id) || saved; }
        catch (copyErr) {
          FS.UI.toast((copyErr && copyErr.message) || "Saved here, but couldn’t copy to Fresh Grove.", { tone: "bad" });
        }
      }
      await refreshOrgEvents(true);
      renderGatheringBanner();
      closeCalSheet();
      renderCalendar();
      if (saved && saved.id) openOrgEventViewer(saved.id, edSave && edSave.on);
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not save team event.", { tone: "bad" });
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = idle;
      }
    }
  }

  async function copyOrgEventToGroveById(eventId) {
    if (!eventId || !Cloud.copyOrgEventToGrove) return;
    try {
      await Cloud.copyOrgEventToGrove(eventId);
      await refreshOrgEvents(true);
      renderGatheringBanner();
      renderOrgEventSheet();
      renderCalendar();
      FS.UI.toast("Copied to Fresh Grove — the two stay in sync.", { tone: "ok" });
    } catch (err) {
      FS.UI.toast((err && err.message) || "Couldn’t copy to Fresh Grove.", { tone: "bad" });
    }
  }

  async function deleteOrgEventById(eventId) {
    if (!eventId) return;
    var ev = findOrgEvent(eventId);
    var linked = !!(ev && ev.twin_id);
    var ok = await FS.UI.ask(
      linked
        ? "This also deletes the linked copy on the other calendar."
        : "Everyone on the team will stop seeing it on their calendar.",
      {
        title: linked ? "Delete on both calendars?" : "Delete this team event?",
        okText: "Delete",
        danger: true
      }
    );
    if (!ok) return;
    try {
      await Cloud.deleteOrgEvent(eventId);
      await refreshOrgEvents(true);
      renderGatheringBanner();
      closeCalSheet();
      renderCalendar();
    } catch (err) {
      FS.UI.toast((err && err.message) || "Could not delete.", { tone: "bad" });
    }
  }

  function leadFollowSuggestionsForDay(ymd, st) {
    if (!leadFollowCache.length) return [];
    var today = Cal.ymd(new Date());
    if (ymd !== today) return [];
    var quietMs = leadFollowQuietDays(st) * 864e5;
    var max = leadFollowMaxPerDay(st);
    var includeNew = leadFollowIncludeNew(st);
    var snooze = (st && st.data && st.data.leadFollowSnooze) || {};
    var now = Date.now();
    var rows = leadFollowCache.slice().sort(function (a, b) {
      var ta = new Date(leadFollowTouchedAt(a, st) || 0).getTime() || 0;
      var tb = new Date(leadFollowTouchedAt(b, st) || 0).getTime() || 0;
      return ta - tb;
    });
    var out = [];
    rows.forEach(function (lead) {
      if (out.length >= max) return;
      if (!lead || !leadFollowOn(lead, st)) return;
      if (leadIsClosed(lead)) return;
      var statusOk = lead.status === "reached" || lead.status === "talking" || lead.status === "fb" ||
        lead.status === "done" || (includeNew && lead.status === "new");
      if (!statusOk) return;
      var until = snooze[lead.id];
      if (until && String(until) > ymd) return;
      var touched = leadFollowTouchedAt(lead, st);
      var t = touched ? new Date(touched).getTime() : 0;
      if (!t || now - t < quietMs) return;
      out.push(lead);
    });
    return out;
  }

  function snoozeLeadFollow(leadId) {
    var st = getState && getState();
    if (!st || !st.data || !leadId) return;
    if (!st.data.leadFollowSnooze) st.data.leadFollowSnooze = {};
    var today = Cal.ymd(new Date());
    st.data.leadFollowSnooze[leadId] = ymdAddDays(today, leadFollowQuietDays(st));
    if (persist) persist();
    if (typeof renderCalendar === "function") renderCalendar();
  }

  async function refreshLeadFollowCache(force) {
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      leadFollowCache = [];
      leadFollowLoadedAt = 0;
      return;
    }
    if (!force && leadFollowLoadedAt && Date.now() - leadFollowLoadedAt < 90000) return;
    try {
      leadFollowCache = await Cloud.listMyLeads();
    } catch (e) {
      leadFollowCache = [];
    }
    leadFollowLoadedAt = Date.now();
  }

  function canSeeShelfPeople() {
    return !!(document.body && document.body.classList.contains("shelf-customers"));
  }

  function shelfEmailKey(email) {
    return String(email || "").trim().toLowerCase();
  }

  function shelfPersonForEmail(email) {
    var key = shelfEmailKey(email);
    if (!key) return null;
    var i;
    for (i = 0; i < shelfPeopleCache.length; i++) {
      if (shelfEmailKey(shelfPeopleCache[i].email) === key) return shelfPeopleCache[i];
    }
    return null;
  }

  function birthdayOnDay(ymd, birthday) {
    var day = String(ymd || "");
    var md = String(birthday || "");
    if (day.length < 10 || md.length < 5) return false;
    if (day.slice(5, 10) === md) return true;
    if (md === "02-29" && day.slice(5, 10) === "02-28" && Number(day.slice(0, 4)) % 4 !== 0) return true;
    return false;
  }

  function birthdayPeopleForDay(ymd) {
    if (!canSeeShelfPeople() || !ymd) return [];
    return shelfPeopleCache.filter(function (row) {
      return row && birthdayOnDay(ymd, row.birthday);
    });
  }

  async function refreshShelfPeopleCache(force) {
    var Cloud = window.FS && window.FS.Cloud;
    if (!canSeeShelfPeople() || !Cloud || !Cloud.isSignedIn || !Cloud.isSignedIn()) {
      shelfPeopleCache = [];
      shelfPeopleLoadedAt = 0;
      return;
    }
    if (!force && shelfPeopleLoadedAt && Date.now() - shelfPeopleLoadedAt < 90000) return;
    var rows = [];
    try {
      if (typeof Cloud.listCabinetPeople === "function") {
        rows = await Cloud.listCabinetPeople();
      }
    } catch (e) {
      rows = [];
    }
    var byEmail = {};
    (rows || []).forEach(function (row) {
      var mail = shelfEmailKey(row && row.email);
      if (!mail) return;
      byEmail[mail] = {
        email: mail,
        name: row.name || mail.split("@")[0],
        birthday: String(row.birthday || "")
      };
    });
    try {
      if (typeof Cloud.listShelfBirthdays === "function") {
        var extra = await Cloud.listShelfBirthdays();
        ((extra && extra.people) || []).forEach(function (row) {
          var mail = shelfEmailKey(row && row.email);
          if (!mail) return;
          var cur = byEmail[mail] || { email: mail, name: row.name || mail.split("@")[0], birthday: "" };
          if (row.name) cur.name = row.name;
          if (row.birthday) cur.birthday = String(row.birthday);
          byEmail[mail] = cur;
        });
      }
    } catch (e2) {}
    shelfPeopleCache = Object.keys(byEmail).map(function (k) { return byEmail[k]; });
    shelfPeopleLoadedAt = Date.now();
  }

  function renderDayBars(day) {
    var stBars = getState && getState();
    var marks = "";
    var markCount = 0;
    var overflow = 0;
    (day.items || []).forEach(function (it) {
      if (packEvergreen()) return;
      if (it.kind === "rest" || it.type === "reactive") return;
      if (markCount >= 6) {
        overflow++;
        return;
      }
      if (isCompactGridItem(it)) {
        marks += compactMarkerSpan(it);
      } else {
        marks += '<span class="cal-mark is-other ' + esc(itemMarkerClass(it)) + itemStatusClass(it) + '"></span>';
      }
      markCount++;
    });
    if (!packEvergreen()) {
    leadFollowSuggestionsForDay(day.date, stBars).forEach(function () {
      if (markCount >= 6) {
        overflow++;
        return;
      }
      marks += '<span class="cal-mark is-lead-follow" title="Lead follow-up"></span>';
      markCount++;
    });
    birthdayPeopleForDay(day.date).forEach(function () {
      if (markCount >= 6) {
        overflow++;
        return;
      }
      marks += '<span class="cal-mark is-birthday" title="Birthday"></span>';
      markCount++;
    });
    }
    if (overflow) marks += '<span class="cal-dot-more">+' + overflow + "</span>";

    var top = marks
      ? '<div class="cal-cell-dots cal-cell-dots-top" aria-hidden="true">' + marks + "</div>"
      : "";

    var bars = "";
    var barCount = 0;
    orgEventsForDay(day.date).forEach(function (ev) {
      if (barCount >= 3) return;
      var meta = orgEventKindMeta(effectiveOrgKind(ev));
      var hasReplay = !!orgEventReplayUrl(ev, day.date);
      if (ev.leader_only) {
        bars += '<span class="cal-bar-row">' +
          '<span class="cal-bar-star" aria-hidden="true">★</span>' +
          '<span class="cal-bar ' + esc(meta.bar) + (hasReplay ? " has-replay" : "") + '"></span>' +
          "</span>";
      } else {
        bars += '<span class="cal-bar ' + esc(meta.bar) + (hasReplay ? " has-replay" : "") + '"></span>';
      }
      barCount++;
    });
    if (!barCount && !markCount && !((day.items || []).length) && !orgEventsForDay(day.date).length && day.suggested && !packEvergreen()) {
      bars += '<span class="cal-bar ghost"></span>';
      barCount++;
    }
    if (!packEvergreen() && !barCount && !markCount && (day.items || []).some(function (it) { return it.kind === "rest" || it.type === "reactive"; })) {
      bars += '<span class="cal-bar cat-rest"></span>';
    }
    var bottom = bars
      ? '<div class="cal-cell-bars" aria-hidden="true">' + bars + "</div>"
      : '<div class="cal-cell-bars" aria-hidden="true"></div>';

    return top + bottom;
  }

  function renderDayChips(day, st, opts) {
    st = st || (getState && getState());
    opts = opts || {};
    var useDots = !!opts.dotsForContent;
    var teamHtml = "";
    var otherHtml = "";
    var compactMarks = "";

    orgEventsForDay(day.date).forEach(function (ev) {
      var meta = orgEventKindMeta(effectiveOrgKind(ev));
      var occ = orgEventAt(ev, day.date);
      var time = formatLocalTime(occ.starts_at);
      var hasReplay = !!orgEventReplayUrl(ev, day.date);
      teamHtml += '<button type="button" class="' + meta.chip + (hasReplay ? " has-replay" : "") +
        (ev.leader_only ? " is-leader" : "") +
        '" data-org-view="' + esc(ev.id) + '" data-org-on="' + esc(day.date) + '">';
      if (ev.leader_only) teamHtml += '<span class="cal-chip-star" aria-hidden="true">★</span>';
      teamHtml += '<span class="cal-chip-fmt">' + esc(hasReplay ? "Replay" : meta.short) + "</span>";
      teamHtml += '<span class="cal-chip-txt">' +
        (time ? esc(time) + " · " : "") + esc(ev.title || meta.label) + "</span>";
      teamHtml += "</button>";
    });

    (day.items || []).forEach(function (it) {
      if (packEvergreen()) return;
      if (useDots && isCompactGridItem(it)) {
        compactMarks += compactMarkerButton(day, it);
        return;
      }
      otherHtml += '<button type="button" class="' + chipClass(it) + '" data-cal-edit="' + day.date + '" data-cal-item="' + it.id + '">';
      if (it.format && isPostOrContentItem(it)) {
        otherHtml += '<span class="cal-chip-fmt">' + esc(formatLabel(it.format) || it.format) + "</span>";
      } else {
        otherHtml += '<span class="cal-chip-ico">' + (it.icon || "·") + "</span>";
      }
      otherHtml += '<span class="cal-chip-txt">' + esc(isReminderItem(it)
        ? ((Cal && Cal.todoChipText) ? Cal.todoChipText(it) : (it.title || it.label || "To-do"))
        : (it.person ? it.person : (it.title || it.label))) + "</span>";
      otherHtml += "</button>";
    });

    var html = "";
    if (useDots) {
      /* Marks under the day number; team chips sit at the bottom. */
      if (compactMarks) {
        html += '<div class="cal-cell-dots is-interactive cal-cell-dots-top">' + compactMarks + "</div>";
      }
      html += otherHtml;
      if (teamHtml) html += '<div class="cal-cell-team-chips">' + teamHtml + "</div>";
    } else {
      html += teamHtml + otherHtml;
      if (compactMarks) {
        html += '<div class="cal-cell-dots is-interactive">' + compactMarks + "</div>";
      }
    }

    if (!packEvergreen()) {
    leadFollowSuggestionsForDay(day.date, st).forEach(function (lead) {
      html += '<button type="button" class="cal-chip ghost is-lead-follow" data-cal-lead-follow="' + esc(lead.id) + '">';
      html += '<span class="cal-chip-ico">↩</span>';
      html += '<span class="cal-chip-txt">Follow up · ' + esc(lead.name || "lead") + "</span>";
      html += "</button>";
    });
    birthdayPeopleForDay(day.date).forEach(function (person) {
      html += '<button type="button" class="cal-chip ghost is-birthday" data-goto-bridge="customers">';
      html += '<span class="cal-chip-ico">🎂</span>';
      html += '<span class="cal-chip-txt">Birthday · ' + esc(person.name || "client") + "</span>";
      html += "</button>";
    });
    }
    if (!packEvergreen() && !(day.items || []).length && !orgEventsForDay(day.date).length && day.suggested) {
      html += '<button type="button" class="cal-chip ghost" data-cal-accept="' + day.date + '">';
      html += '<span class="cal-chip-ico">' + day.suggested.icon + "</span>";
      html += '<span class="cal-chip-txt">' + esc(day.suggested.label) + "</span>";
      html += "</button>";
    }
    return html;
  }

  function paintCalendarEmptyHint(days, view) {
    var el = $("calendarEmptyHint");
    if (!el) return;
    if (!packEvergreen()) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    if (!orgEventsLoadedAt) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    var has = false;
    (days || []).forEach(function (d) {
      if (orgEventsForDay(d.date).length) has = true;
    });
    if (has) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = view === "week"
      ? "No team dates in this week. Try Month if you’re looking for a later zoom."
      : "No team dates in this month yet.";
  }

  function countDated(days) {
    var n = 0;
    (days || []).forEach(function (d) {
      var has = orgEventsForDay(d.date).length > 0;
      if (!has && !packEvergreen()) {
        has = (d.items || []).some(function (it) {
          return !(it.kind === "rest" || it.type === "reactive");
        });
      }
      if (!has && !packEvergreen() && d.suggested) has = true;
      if (!has && !packEvergreen() && birthdayPeopleForDay(d.date).length) has = true;
      if (has) n++;
    });
    return n;
  }

  function calendarWeekAdds(ymd) {
    var html = "";
    if (!packEvergreen()) {
      html += '<button type="button" class="cal-cell-add" data-cal-new="' + ymd + '" aria-label="Add a card" title="Add a card">＋</button>';
    } else if (canCreatePersonalEvent()) {
      html += '<button type="button" class="cal-cell-add is-mine" data-org-personal="' + ymd + '" aria-label="Add a date for me" title="For me">Me</button>';
    }
    if (canCreateDownlineZoom()) {
      html += '<button type="button" class="cal-cell-add is-team" data-org-downline="' + ymd + '" aria-label="Add a zoom for my team" title="My team">My team</button>';
    }
    if (canEditCalendar()) {
      html += '<button type="button" class="cal-cell-add is-team" data-org-new="' + ymd + '" aria-label="Add team event" title="Add team event">Team</button>';
    }
    return html;
  }

  function renderDayDetail(day) {
    var el = $("calendarDayDetail");
    if (!el) return;
    if (!day) {
      el.innerHTML = "";
      el.hidden = true;
      return;
    }
    el.hidden = false;
    var st = getState();
    var dt = Cal.parseYmd(day.date);
    var label = Cal.DOW[dt.getDay()] + " · " + Cal.MON[dt.getMonth()] + " " + dt.getDate();
    var chips = renderDayChips(day, st);
    var addRow = packEvergreen()
      ? ""
      : '<button type="button" class="cal-day-detail-add" data-cal-new="' + day.date + '">＋ Add</button>';
    if (packEvergreen() && canCreatePersonalEvent()) {
      addRow += '<button type="button" class="cal-day-detail-add is-mine" data-org-personal="' + day.date + '">＋ For me</button>';
    }
    if (canCreateDownlineZoom()) {
      addRow += '<button type="button" class="cal-day-detail-add is-team" data-org-downline="' + day.date + '">＋ My team</button>';
    }
    if (canEditCalendar()) {
      addRow += '<button type="button" class="cal-day-detail-add is-team" data-org-new="' + day.date + '">＋ Team</button>';
    }
    el.innerHTML =
      '<div class="cal-day-detail-head">' +
        '<div class="cal-day-detail-when"><span class="cal-day-detail-kicker">Selected day</span>' +
        '<strong class="cal-day-detail-title">' + esc(label) + "</strong></div>" +
        (addRow ? '<div class="cal-day-detail-adds">' + addRow + "</div>" : "") +
      "</div>" +
      (chips
        ? '<div class="cal-day-detail-chips">' + chips + "</div>"
        : '<p class="cal-day-detail-empty">' +
          (packEvergreen() ? "Nothing on this day yet." : "Nothing on this day yet — add a card to post.") +
          "</p>");
  }

  /* Last plan from a full calendar paint — day taps reuse it so we don't
     remount the grid (or re-plan) under the finger. */
  var lastCalPlan = null;

  function persistAfterPaint(opts) {
    requestAnimationFrame(function () {
      if (persist) persist(opts || { skipCloud: true });
    });
  }

  function calendarDayFromPlan(dateKey) {
    var day = lastCalPlan ? Cal.findDay(lastCalPlan, dateKey) : null;
    if (day) return day;
    var state = getState();
    if (state && state.data) {
      lastCalPlan = Cal.plan(window.FS.CONFIG, state.data.calendar, state.data, {
        cadence: cadenceEnabled(state),
        weekStart: weekStartPref(state)
      });
      day = Cal.findDay(lastCalPlan, dateKey);
      if (day) return day;
    }
    try {
      var dt = Cal.parseYmd(dateKey);
      return { date: dateKey, dayNum: dt.getDate(), items: [], suggested: null };
    } catch (e) {
      return { date: dateKey, items: [] };
    }
  }

  function paintCalendarDaySelection(selectedKey, detailOpen) {
    var grid = $("calendarGrid");
    if (!grid) return;
    var isMonth = grid.classList.contains("cal-grid-month");
    var cells = grid.querySelectorAll("[data-cal-select]");
    for (var i = 0; i < cells.length; i++) {
      var on = cells[i].getAttribute("data-cal-select") === selectedKey && (!isMonth || detailOpen);
      cells[i].classList.toggle("on", on);
      if (isMonth) cells[i].setAttribute("aria-expanded", on ? "true" : "false");
    }
    if (!isMonth) return;
    if (!detailOpen) {
      var el = $("calendarDayDetail");
      if (el) { el.innerHTML = ""; el.hidden = true; }
      return;
    }
    renderDayDetail(calendarDayFromPlan(selectedKey));
  }

  function selectCalendarDay(nextDay) {
    var stSel = getState();
    if (!stSel || !stSel.data || !nextDay) return;
    var isMonthSel = (stSel.data.calendarView || "month") === "month";
    if (isMonthSel && calendarDetailIsOpen(stSel) && stSel.data.calendarSelected === nextDay) {
      stSel.data.calendarDetailOpen = false;
    } else {
      stSel.data.calendarSelected = nextDay;
      if (isMonthSel) stSel.data.calendarDetailOpen = true;
    }
    paintCalendarDaySelection(stSel.data.calendarSelected, isMonthSel && calendarDetailIsOpen(stSel));
    persistAfterPaint();
  }

  function renderCalendar() {
    var grid = $("calendarGrid");
    var navEl = $("calendarWeekNav");
    var toggleEl = $("calendarViewToggle");
    var datedEl = $("calendarDated");
    if (!grid || !getState) return;
    var state = getState();
    if (!state || !state.data) return;
    if (!state.data.calendar) state.data.calendar = {};
    if (typeof state.data.calendarWeekOffset !== "number") state.data.calendarWeekOffset = 0;
    if (typeof state.data.calendarMonthOffset !== "number") state.data.calendarMonthOffset = 0;
    if (!state.data.calendarView) state.data.calendarView = "month";
    if (!state.data.libraryTab) state.data.libraryTab = "hooks";
    /* Blank by default — no setup chrome; fill cadence only if they already opted in. */
    if (state.data.calendarCadence !== true && state.data.calendarCadence !== false) {
      state.data.calendarCadence = false;
    }

    var view = state.data.calendarView === "week" ? "week" : "month";
    var boardTitle = $("calendarBoardTitle");
    if (boardTitle) {
      boardTitle.textContent = packEvergreen()
        ? (view === "week" ? "This week" : "This month")
        : (view === "week" ? "Your week" : "Your month");
    }
    paintLeaderTeamZoomsToggle();
    var useCadence = cadenceEnabled(state);
    var weekStart = weekStartPref(state);
    var plan = Cal.plan(window.FS.CONFIG, state.data.calendar, state.data, {
      cadence: useCadence,
      weekStart: weekStart
    });
    lastCalPlan = plan;

    var todayKey = Cal.ymd(new Date());
    var slice = view === "month"
      ? Cal.monthSlice(plan, new Date(), state.data.calendarMonthOffset, weekStart)
      : Cal.weekSlice(plan, new Date(), state.data.calendarWeekOffset, weekStart);
    var visibleDays = view === "month" ? (slice.cells || []) : (slice.days || []);

    if (!state.data.calendarSelected) state.data.calendarSelected = todayKey;
    var selectedKey = state.data.calendarSelected;
    var detailOpen = view === "month" && calendarDetailIsOpen(state);
    syncCalendarBoardChrome(state);

    var monthDatedSource = view === "month"
      ? visibleDays.filter(function (d) { return d.inMonth; })
      : visibleDays;
    var datedCount = countDated(monthDatedSource);

    if (toggleEl) {
      var btns = toggleEl.querySelectorAll("[data-cal-view]");
      for (var ti = 0; ti < btns.length; ti++) {
        var on = btns[ti].getAttribute("data-cal-view") === view;
        btns[ti].classList.toggle("on", on);
        btns[ti].setAttribute("aria-selected", on ? "true" : "false");
      }
    }

    if (datedEl) datedEl.textContent = datedCount + " dated";
    if (datedEl) datedEl.hidden = packEvergreen();

    if (navEl) {
      var off = view === "month" ? state.data.calendarMonthOffset : state.data.calendarWeekOffset;
      navEl.innerHTML =
        '<button type="button" class="cal-nav-btn" data-cal-nav="-1" aria-label="Previous">‹</button>' +
        '<span class="cal-nav-label">' + esc(slice.label || "") + "</span>" +
        '<button type="button" class="cal-nav-btn" data-cal-nav="1" aria-label="Next">›</button>' +
        (off ? '<button type="button" class="cal-nav-today" data-cal-nav="0">Today</button>' : "");
    }

    grid.className = "cal-grid " + (view === "month" ? "cal-grid-month" : "cal-grid-week");
    var html = "";
    if (view === "month") {
      html += '<div class="cal-month-dows">' + Cal.dowLabels(weekStart).map(function (d) {
        return "<span>" + d.slice(0, 3) + "</span>";
      }).join("") + "</div>";
      html += '<div class="cal-month-cells">';
      visibleDays.forEach(function (d) {
        html += '<button type="button" class="cal-cell' +
          (detailOpen && d.date === selectedKey ? " on" : "") +
          (d.date === todayKey ? " today" : "") +
          (d.inMonth ? "" : " out") + '" data-cal-select="' + d.date + '" aria-label="' + esc(d.date) + '"' +
          (detailOpen && d.date === selectedKey ? ' aria-expanded="true"' : ' aria-expanded="false"') + '>';
        html += '<span class="cal-cell-num">' + d.dayNum + "</span>";
        html += renderDayBars(d);
        html += "</button>";
      });
      html += "</div>";
    } else {
      visibleDays.forEach(function (d) {
        var dt = Cal.parseYmd(d.date);
        html += '<div class="cal-cell week' +
          (d.date === selectedKey ? " on" : "") +
          (d.date === todayKey ? " today" : "") + '" data-cal-select="' + d.date + '" role="button" tabindex="0" aria-label="' + esc(d.date) + '">';
        html += '<div class="cal-cell-top">';
        html += '<div><span class="cal-dow">' + Cal.DOW[dt.getDay()] + '</span>';
        html += '<span class="cal-cell-num">' + dt.getDate() + "</span></div>";
        html += '<div class="cal-cell-adds">';
        html += calendarWeekAdds(d.date);
        html += "</div></div>";
        html += '<div class="cal-cell-chips">' + renderDayChips(d, state, { dotsForContent: true }) + "</div>";
        html += "</div>";
      });
    }
    grid.innerHTML = html;
    paintCalendarEmptyHint(monthDatedSource, view);

    var selectedDay = Cal.findDay(plan, selectedKey);
    if (!selectedDay) {
      for (var si = 0; si < visibleDays.length; si++) {
        if (visibleDays[si].date === selectedKey) { selectedDay = visibleDays[si]; break; }
      }
    }
    if (view === "month" && detailOpen) renderDayDetail(selectedDay);
    else {
      var detailEl = $("calendarDayDetail");
      if (detailEl) { detailEl.innerHTML = ""; detailEl.hidden = true; }
    }

    renderLibrary();
    paintContentWeekCta();
    paintGroveShelfCta();
    /* Do not rebuild the open card editor here — re-rendering destroys text
       selection and scrolls the sheet back to the top (auth refresh, grid nav). */

    /* Soft-refresh shared team events + optional lead nudges after paint. */
    Promise.all([refreshOrgEvents(false), refreshLeadFollowCache(), refreshShelfPeopleCache()]).then(function () {
      renderGatheringBanner();
      var again = getState();
      if (!again || document.body.classList.contains("cal-sheet-open")) return;
      if (again.active !== "tend" && again.active !== "calendar") return;
      if (again.data._orgPaintedAt === orgEventsLoadedAt &&
          again.data._leadPaintedAt === leadFollowLoadedAt &&
          again.data._shelfPaintedAt === shelfPeopleLoadedAt) return;
      again.data._orgPaintedAt = orgEventsLoadedAt;
      again.data._leadPaintedAt = leadFollowLoadedAt;
      again.data._shelfPaintedAt = shelfPeopleLoadedAt;
      renderCalendarPaintOnly();
    }).catch(function () {
      renderGatheringBanner();
    });
  }

  /* Second-pass paint after org/lead cache loads — skips re-fetch. */
  function renderCalendarPaintOnly() {
    var grid = $("calendarGrid");
    if (!grid || !getState) return;
    var state = getState();
    if (!state || !state.data) return;
    var view = state.data.calendarView === "week" ? "week" : "month";
    var weekStart = weekStartPref(state);
    var plan = Cal.plan(window.FS.CONFIG, state.data.calendar, state.data, {
      cadence: cadenceEnabled(state),
      weekStart: weekStart
    });
    lastCalPlan = plan;
    var todayKey = Cal.ymd(new Date());
    var slice = view === "month"
      ? Cal.monthSlice(plan, new Date(), state.data.calendarMonthOffset, weekStart)
      : Cal.weekSlice(plan, new Date(), state.data.calendarWeekOffset, weekStart);
    var visibleDays = view === "month" ? (slice.cells || []) : (slice.days || []);
    var selectedKey = state.data.calendarSelected || todayKey;
    var detailOpen = view === "month" && calendarDetailIsOpen(state);
    syncCalendarBoardChrome(state);
    paintLeaderTeamZoomsToggle();
    var datedEl = $("calendarDated");
    if (datedEl) {
      var src = view === "month" ? visibleDays.filter(function (d) { return d.inMonth; }) : visibleDays;
      datedEl.textContent = countDated(src) + " dated";
      datedEl.hidden = packEvergreen();
    }
    if (view === "month") {
      var html = '<div class="cal-month-dows">' + Cal.dowLabels(weekStart).map(function (d) {
        return "<span>" + d.slice(0, 3) + "</span>";
      }).join("") + "</div>";
      html += '<div class="cal-month-cells">';
      visibleDays.forEach(function (d) {
        html += '<button type="button" class="cal-cell' +
          (detailOpen && d.date === selectedKey ? " on" : "") +
          (d.date === todayKey ? " today" : "") +
          (d.inMonth ? "" : " out") + '" data-cal-select="' + d.date + '" aria-label="' + esc(d.date) + '"' +
          (detailOpen && d.date === selectedKey ? ' aria-expanded="true"' : ' aria-expanded="false"') + '>';
        html += '<span class="cal-cell-num">' + d.dayNum + "</span>";
        html += renderDayBars(d);
        html += "</button>";
      });
      html += "</div>";
      grid.innerHTML = html;
      var selectedDay = Cal.findDay(plan, selectedKey);
      if (!selectedDay) {
        for (var si = 0; si < visibleDays.length; si++) {
          if (visibleDays[si].date === selectedKey) { selectedDay = visibleDays[si]; break; }
        }
      }
      if (detailOpen) renderDayDetail(selectedDay);
      else {
        var detailPaint = $("calendarDayDetail");
        if (detailPaint) { detailPaint.innerHTML = ""; detailPaint.hidden = true; }
      }
    } else {
      var whtml = "";
      visibleDays.forEach(function (d) {
        var dt = Cal.parseYmd(d.date);
        whtml += '<div class="cal-cell week' +
          (d.date === selectedKey ? " on" : "") +
          (d.date === todayKey ? " today" : "") + '" data-cal-select="' + d.date + '" role="button" tabindex="0" aria-label="' + esc(d.date) + '">';
        whtml += '<div class="cal-cell-top">';
        whtml += '<div><span class="cal-dow">' + Cal.DOW[dt.getDay()] + '</span>';
        whtml += '<span class="cal-cell-num">' + dt.getDate() + "</span></div>";
        whtml += '<div class="cal-cell-adds">';
        whtml += calendarWeekAdds(d.date);
        whtml += "</div></div>";
        whtml += '<div class="cal-cell-chips">' + renderDayChips(d, state, { dotsForContent: true }) + "</div>";
        whtml += "</div>";
      });
      grid.innerHTML = whtml;
    }
    var hintDays = view === "month" ? visibleDays.filter(function (d) { return d.inMonth; }) : visibleDays;
    paintCalendarEmptyHint(hintDays, view);
  }

  function renderLibrary() {
    var tabs = $("libraryTabs");
    var list = $("libraryList");
    if (!tabs || !list) return; /* Post ideas library replaced by Content vault CTAs */
    var target = $("libraryTarget");
    if (!getState) return;
    var st = getState();
    var buckets = Cal.libraryBuckets();
    var active = st.data.libraryTab || "hooks";
    if (!buckets.some(function (b) { return b.id === active; }) && buckets[0]) active = buckets[0].id;
    st.data.libraryTab = active;

    var dayLabel = selectedDayLabel(st);
    if (target) {
      target.hidden = false;
      target.textContent = "Adding to " + dayLabel + " · tap another day above to change";
    }

    tabs.innerHTML = buckets.map(function (b) {
      return '<button type="button" class="cal-lib-tab' + (b.id === active ? " on" : "") + '" data-lib-tab="' + b.id + '">' + esc(b.title) + "</button>";
    }).join("");

    var bucket = buckets.filter(function (b) { return b.id === active; })[0] || buckets[0];
    if (!bucket) { list.innerHTML = ""; return; }
    var html = "";
    if (bucket.hint) html += '<p class="cal-lib-hint">' + esc(bucket.hint) + "</p>";
    if (!bucket.items || !bucket.items.length) {
      html += '<p class="cal-lib-hint">Nothing in this shelf yet.</p>';
    } else {
      bucket.items.forEach(function (it) {
        var meta = Cal.typeMeta ? Cal.typeMeta(it.type) : null;
        html += '<button type="button" class="cal-lib-card" data-lib-open="' + esc(bucket.id) + '" data-lib-id="' + esc(it.id) + '">';
        html += '<div class="cal-lib-card-main">';
        html += '<div class="cal-lib-card-top"><div>';
        if (meta && meta.label) html += '<span class="cal-lib-card-type">' + esc(meta.label) + "</span>";
        html += '<span class="cal-lib-card-title">' + esc((it.icon ? it.icon + " " : "") + it.title) + "</span></div>";
        html += '<span class="cal-lib-open-hint">Open</span></div>';
        html += '<p class="cal-lib-body">' + esc(it.body || "") + "</p>";
        html += "</div></button>";
      });
    }
    list.innerHTML = html;
  }

  function ensureCuriosityBrowse() {
    var st = getState ? getState() : null;
    if (!st) return { q: "", cat: "" };
    if (!st.data) st.data = {};
    if (!st.data.curiosityBrowse) st.data.curiosityBrowse = { q: "", cat: "" };
    if (typeof st.data.curiosityBrowse.q !== "string") st.data.curiosityBrowse.q = "";
    if (typeof st.data.curiosityBrowse.cat !== "string") st.data.curiosityBrowse.cat = "";
    return st.data.curiosityBrowse;
  }

  function curiosityPhotoHaystack(it) {
    var cat = Cal.curiosityCategoryById ? Cal.curiosityCategoryById(it.category) : null;
    return [
      it.id,
      it.title,
      it.alt,
      it.pairsWith,
      it.body,
      (it.tags || []).join(" "),
      it.category,
      cat && cat.label,
      cat && cat.hint
    ].join(" ").toLowerCase();
  }

  function curiosityPhotoMatches(it, browse) {
    if (browse.cat && it.category !== browse.cat) return false;
    var q = (browse.q || "").trim().toLowerCase();
    if (!q) return true;
    var hay = curiosityPhotoHaystack(it);
    var tokens = q.split(/\s+/).filter(function (t) { return t.length > 0; });
    for (var i = 0; i < tokens.length; i++) {
      if (hay.indexOf(tokens[i]) < 0) return false;
    }
    return true;
  }

  function filteredCuriosityImages(browse) {
    var list = (window.FS.CONTENT && window.FS.CONTENT.curiosityImages) || [];
    var out = [];
    for (var i = 0; i < list.length; i++) {
      if (!Cal.resolveCuriosityImage || !Cal.resolveCuriosityImage(list[i].id)) continue;
      if (curiosityPhotoMatches(list[i], browse)) out.push(list[i]);
    }
    return out;
  }

  function curiosityPhotoMetaText(browse, shown, total) {
    var q = (browse.q || "").trim();
    var cat = Cal.curiosityCategoryById ? Cal.curiosityCategoryById(browse.cat) : null;
    var n = shown + " photo" + (shown === 1 ? "" : "s");
    if (cat && q) return n + " in " + cat.label + " matching “" + q + "”";
    if (cat) return n + " in " + cat.label;
    if (q) return n + " matching “" + q + "”";
    return total + " photo" + (total === 1 ? "" : "s") + " · browse by type or search";
  }

  function curiosityCircleHtml(it) {
    var resolved = Cal.resolveCuriosityImage ? Cal.resolveCuriosityImage(it.id) : null;
    if (!resolved) return "";
    return (
      '<button type="button" class="curio-photo-circle" role="listitem" data-curio-open="' + esc(it.id) + '" aria-label="Open ' + esc(it.title) + '">' +
        '<span class="curio-photo-circle-img-wrap">' +
          '<img src="' + esc(resolved.thumb) + '" alt="" loading="lazy" decoding="async" width="120" height="120">' +
        "</span>" +
        '<span class="curio-photo-circle-label">' + esc(it.title) + "</span>" +
      "</button>"
    );
  }

  function curiosityPhotoResultsHtml(browse) {
    var cats = (Cal.curiosityCategories && Cal.curiosityCategories()) || [];
    var shown = filteredCuriosityImages(browse);
    if (!shown.length) {
      var q = (browse.q || "").trim();
      if (q) return '<p class="cal-lib-hint">Nothing matches “' + esc(q) + '”. Try dea, serum, bathroom, move, or clear search.</p>';
      if (browse.cat) return '<p class="cal-lib-hint">No photos in this type yet.</p>';
      return '<p class="cal-lib-hint">No photos yet — check back soon.</p>';
    }
    if (browse.cat) {
      var html = '<div class="curio-photo-circles" role="list">';
      shown.forEach(function (it) { html += curiosityCircleHtml(it); });
      html += "</div>";
      return html;
    }
    var byCat = {};
    var extra = [];
    shown.forEach(function (it) {
      if (it.category && cats.some(function (c) { return c.id === it.category; })) {
        if (!byCat[it.category]) byCat[it.category] = [];
        byCat[it.category].push(it);
      } else {
        extra.push(it);
      }
    });
    var out = "";
    cats.forEach(function (cat) {
      var items = byCat[cat.id];
      if (!items || !items.length) return;
      out += '<section class="curio-photo-section">';
      out += '<div class="curio-photo-section-head">';
      out += '<h2 class="curio-photo-section-title">' + esc(cat.label) + "</h2>";
      out += '<span class="curio-photo-section-count">' + items.length + "</span>";
      out += "</div>";
      if (cat.hint) out += '<p class="curio-photo-section-hint">' + esc(cat.hint) + "</p>";
      out += '<div class="curio-photo-circles" role="list">';
      items.forEach(function (it) { out += curiosityCircleHtml(it); });
      out += "</div></section>";
    });
    if (extra.length) {
      out += '<section class="curio-photo-section">';
      out += '<div class="curio-photo-section-head">';
      out += '<h2 class="curio-photo-section-title">More</h2>';
      out += '<span class="curio-photo-section-count">' + extra.length + "</span>";
      out += "</div>";
      out += '<div class="curio-photo-circles" role="list">';
      extra.forEach(function (it) { out += curiosityCircleHtml(it); });
      out += "</div></section>";
    }
    return out;
  }

  function curiosityPhotoChipCounts() {
    var browse = ensureCuriosityBrowse();
    var qOnly = { q: browse.q, cat: "" };
    var list = filteredCuriosityImages(qOnly);
    var counts = { "": list.length };
    var cats = (Cal.curiosityCategories && Cal.curiosityCategories()) || [];
    cats.forEach(function (c) { counts[c.id] = 0; });
    list.forEach(function (it) {
      if (it.category && Object.prototype.hasOwnProperty.call(counts, it.category)) {
        counts[it.category]++;
      }
    });
    return counts;
  }

  function curiosityPhotoChipsHtml(browse) {
    var cats = (Cal.curiosityCategories && Cal.curiosityCategories()) || [];
    var counts = curiosityPhotoChipCounts();
    var html = '<div class="curio-photo-chips" role="tablist" aria-label="Photo type">';
    [{ id: "", label: "All" }].concat(cats).forEach(function (c) {
      var on = (browse.cat || "") === (c.id || "");
      var n = counts[c.id] || 0;
      if (c.id && !n && !on) return;
      html += '<button type="button" class="vault-filter-chip' + (on ? " on" : "") + '" data-curio-cat="' + esc(c.id || "") + '" role="tab" aria-selected="' + (on ? "true" : "false") + '">' +
        esc(c.label) + (typeof n === "number" ? " · " + n : "") +
      "</button>";
    });
    html += "</div>";
    return html;
  }

  var curiositySearchTimer = null;

  function wireCuriosityPhotoSearch() {
    var search = $("curiosityPhotoSearch");
    if (!search || search.dataset.bound) return;
    search.dataset.bound = "1";
    search.setAttribute("spellcheck", "false");
    search.setAttribute("enterkeyhint", "search");
    search.addEventListener("input", function () {
      var browse = ensureCuriosityBrowse();
      browse.q = search.value || "";
      if (curiositySearchTimer) clearTimeout(curiositySearchTimer);
      curiositySearchTimer = setTimeout(function () {
        curiositySearchTimer = null;
        if (persist) persist();
        updateCuriosityPhotoResults();
      }, 120);
    });
  }

  function updateCuriosityPhotoResults() {
    var browse = ensureCuriosityBrowse();
    var all = (window.FS.CONTENT && window.FS.CONTENT.curiosityImages) || [];
    var shown = filteredCuriosityImages(browse);
    var meta = $("curiosityPhotoMeta");
    if (meta) meta.textContent = curiosityPhotoMetaText(browse, shown.length, all.length);
    var chips = document.querySelector("#curiosityPhotosRoot .curio-photo-chips");
    if (chips) chips.outerHTML = curiosityPhotoChipsHtml(browse);
    var results = $("curiosityPhotoResults");
    if (results) results.innerHTML = curiosityPhotoResultsHtml(browse);
  }

  function renderCuriosityPhotos() {
    var root = $("curiosityPhotosRoot");
    if (!root) return;
    var ae = document.activeElement;
    if (ae && root.contains(ae) && (ae.id === "curiosityPhotoSearch" || ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) {
      updateCuriosityPhotoResults();
      return;
    }
    var browse = ensureCuriosityBrowse();
    var all = (window.FS.CONTENT && window.FS.CONTENT.curiosityImages) || [];
    var shown = filteredCuriosityImages(browse);
    var html =
      '<div class="curio-photos-tools">' +
        '<div class="curio-photos-nav">' +
          '<button type="button" class="prod-pill on" ' +
          (photoPickState() ? 'data-curio-pick-done' : 'data-goto="tend"') +
          '>' + (photoPickState() ? "← Back to the card" : "← Back to Calendar") + "</button>" +
        "</div>";
    if (photoPickState()) {
      html += '<div class="shelf-pick-banner"><p>Tap photos to add them to this card — up to 8, in order.</p>' +
        '<button type="button" class="btn" data-curio-pick-done>Done · ' + frameCountForPick() + " of " + FRAME_MAX + "</button></div>";
    }
    html +=
        '<label class="sr-only" for="curiosityPhotoSearch">Search photos</label>' +
        '<input type="search" id="curiosityPhotoSearch" class="prod-search" placeholder="Search dea, serum, bathroom, move, chi…" value="' + esc(browse.q || "") + '" autocomplete="off">' +
        '<div class="curio-photo-chip-scroller">' + curiosityPhotoChipsHtml(browse) + "</div>" +
      "</div>" +
      '<p class="prod-search-meta" id="curiosityPhotoMeta">' + esc(curiosityPhotoMetaText(browse, shown.length, all.length)) + "</p>" +
      '<p class="eyebrow">FOR YOUR CURIOSITY POSTS</p>' +
      '<h1 class="curio-photos-title">Curiosity photos</h1>' +
      '<p class="curio-photos-intro">' + (photoPickState()
        ? "Tap a circle to add it. Tap Done when the sequence looks right."
        : "Tap a circle to open the full photo. Press and hold the image to save it to your camera roll — then pair it with a post from the vault.") + "</p>" +
      '<div id="curiosityPhotoResults">' + curiosityPhotoResultsHtml(browse) + "</div>";
    root.innerHTML = html;
    wireCuriosityPhotoSearch();
  }

  function applyPhotoPick(imageId) {
    var pick = photoPickState();
    if (!pick || !imageId) return;
    if (frameCountForPick() >= FRAME_MAX) {
      if (FS.UI && FS.UI.toast) FS.UI.toast("That’s 8 frames — tap Done, or remove one first.", { tone: "ok" });
      return;
    }
    if (pick.kind === "shelf") {
      var resolvedShelf = Cal.resolveCuriosityImage ? Cal.resolveCuriosityImage(imageId) : null;
      if (!resolvedShelf || !resolvedShelf.src) {
        if (FS.UI && FS.UI.toast) FS.UI.toast("Couldn’t add that photo.", { tone: "warn" });
        return;
      }
      srcToFile(resolvedShelf.src, imageId).then(function (file) {
        groveShelfFiles.push(file);
        if (FS.UI && FS.UI.toast) {
          FS.UI.toast("Added (" + groveShelfFiles.length + " of " + FRAME_MAX + "). Tap more, or Done.", { tone: "good" });
        }
      }).catch(function () {
        if (FS.UI && FS.UI.toast) FS.UI.toast("Couldn’t add that photo.", { tone: "warn" });
      });
      return;
    }
    var st = getState();
    if (pick.kind === "vault-ed" && st.data.libraryEditing) {
      addLibraryFrame(st.data.libraryEditing, imageId);
      persist();
    } else if (pick.date && pick.itemId) {
      var day = Cal.ensureDay(st.data.calendar, pick.date);
      for (var i = 0; i < day.items.length; i++) {
        if (day.items[i].id === pick.itemId) addLibraryFrame(day.items[i], imageId);
      }
      persist();
    }
    if (FS.UI && FS.UI.toast) {
      FS.UI.toast("Added (" + frameCountForPick() + " of " + FRAME_MAX + "). Tap more, or Done.", { tone: "good" });
    }
  }

  function finishPhotoPick() {
    var pick = photoPickState();
    setPhotoPick(null);
    if (pick && pick.kind === "shelf") {
      if (gotoPanel) gotoPanel("grove-shelf");
      else renderGroveShelf();
      return;
    }
    if (gotoPanel) gotoPanel("tend");
    if (pick && pick.kind === "vault-ed") {
      renderVaultEditor();
      openCalSheet();
      return;
    }
    if (pick && pick.date && pick.itemId) {
      openEditor(pick.date, pick.itemId);
    }
  }

  function openCuriosityLightbox(imageId) {
    var resolved = Cal.resolveCuriosityImage ? Cal.resolveCuriosityImage(imageId) : null;
    var box = $("curiosityLightbox");
    var img = $("curiosityLightboxImg");
    var title = $("curiosityLightboxTitle");
    var pairs = $("curiosityLightboxPairs");
    var catEl = $("curiosityLightboxCat");
    if (!resolved || !box || !img) return;
    closeAllSheets(document.body.classList.contains("cal-sheet-open") ? "cal" : "lightbox");
    if (title) title.textContent = resolved.title || "Photo";
    img.src = resolved.src;
    img.alt = resolved.alt || resolved.title || "";
    if (catEl) {
      if (resolved.categoryLabel) {
        catEl.hidden = false;
        catEl.textContent = resolved.categoryLabel;
      } else {
        catEl.hidden = true;
        catEl.textContent = "";
      }
    }
    if (pairs) {
      if (resolved.pairsWith) {
        pairs.hidden = false;
        pairs.textContent = "Pairs well with: " + resolved.pairsWith;
      } else {
        pairs.hidden = true;
        pairs.textContent = "";
      }
    }
    box.hidden = false;
    document.body.classList.add("curio-lightbox-open");
    armSheetDismiss();
  }

  function closeCuriosityLightbox() {
    var box = $("curiosityLightbox");
    var img = $("curiosityLightboxImg");
    if (box) box.hidden = true;
    if (img) {
      img.removeAttribute("src");
      img.alt = "";
    }
    document.body.classList.remove("curio-lightbox-open");
  }

  function libraryItem(bucketId, itemId) {
    var buckets = Cal.libraryBuckets();
    for (var i = 0; i < buckets.length; i++) {
      if (buckets[i].id !== bucketId) continue;
      for (var j = 0; j < buckets[i].items.length; j++) {
        if (buckets[i].items[j].id === itemId) return buckets[i].items[j];
      }
    }
    return null;
  }

  function openLibraryIdea(bucketId, itemId) {
    if (bucketId === "vault" || findVaultPost(itemId)) {
      openVaultIdea(itemId);
      return;
    }
    var st = getState();
    var lib = libraryItem(bucketId, itemId);
    if (!st || !lib) return;
    st.data.calendarEditing = null;
    st.data.orgEventEditing = null;
    st.data.libraryEditing = {
      bucketId: bucketId,
      itemId: itemId,
      type: lib.type || "open_loop",
      title: lib.title || "",
      body: lib.body || "",
      icon: lib.icon || "",
      imageId: lib.imageId || "",
      image: lib.image || "",
      alt: lib.alt || "",
      pairsWith: lib.pairsWith || "",
      format: lib.format || "",
      promoting: lib.promoting || ""
    };
    persist();
    renderVaultEditor();
    openCalSheet();
  }

  function renderLibraryEditor() {
    renderVaultEditor();
  }

  function commitLibraryIdea() {
    var st = getState();
    if (!st || !st.data.libraryEditing) return;
    var ed = st.data.libraryEditing;
    var draftIn = $("libDraft");
    if (draftIn) ed.body = draftIn.value;
    var dateAdd = st.data.calendarSelected || Cal.ymd(new Date());
    var image = ed.image || "";
    if (!image && ed.imageId && Cal.resolveCuriosityImage) {
      var r = Cal.resolveCuriosityImage(ed.imageId);
      if (r) image = r.src;
    }
    st.data.libraryEditing = null;
    createCard(dateAdd, {
      type: ed.type || "open_loop",
      title: ed.title || "",
      draft: ed.body || "",
      image: image,
      imageId: ed.imageId || "",
      frames: ed.frames || (ed.imageId ? [{ src: image, imageId: ed.imageId }] : []),
      format: ed.format || "",
      promoting: ed.promoting || "",
      vaultId: ed.vaultId || ""
    }, { quiet: true });
    closeCalSheet();
    if (typeof window.FS.BridgeUI.renderContentWeek === "function" && st.active === "content-week") {
      renderContentWeek();
    }
    if (FS.UI && FS.UI.toast) {
      FS.UI.toast("On your calendar — rewrite it in your voice before you post.", { tone: "good" });
    }
  }

  function openEditor(date, itemId) {
    var st = getState();
    st.data.libraryEditing = null;
    st.data.orgEventEditing = null;
    st.data.calendarSelected = date;
    st.data.calendarEditing = { date: date, itemId: itemId || null };
    persist();
    renderCalEditor();
    openCalSheet();
  }

  function createCard(date, partial, opts) {
    var st = getState();
    var day = Cal.ensureDay(st.data.calendar, date);
    var item = Cal.newItem(partial || {}, st.data, date);
    day.items.push(item);
    st.data.calendarSelected = date;
    persist();
    renderCalendar();
    if (!(opts && opts.quiet)) openEditor(date, item.id);
    if (typeof window.FS.onCalendarChange === "function") window.FS.onCalendarChange();
  }

  function acceptSuggestion(date) {
    var st = getState();
    var plan = Cal.plan(window.FS.CONFIG, st.data.calendar, st.data, { cadence: true });
    var day = Cal.findDay(plan, date);
    if (!day || !day.suggested) {
      createCard(date);
      return;
    }
    createCard(date, {
      type: day.suggested.type,
      draft: day.suggested.draft,
      title: ""
    });
  }

  function calStatusFieldHtml(item, opts) {
    opts = opts || {};
    var isTodo = !!opts.isTodo;
    var html = '<div class="field cal-status-field">';
    html += '<span class="field-label">Where this is</span>';
    html += '<div class="cal-status-row" role="group" aria-label="Where this is">';
    html += Cal.STATUSES.filter(function (s) {
      if (isTodo && (s.id === "drafted" || s.id === "ready")) return false;
      return true;
    }).map(function (s) {
      var label = (isTodo && s.id === "posted") ? "Done" : s.label;
      return '<button type="button" class="cal-status-btn' + (item.status === s.id ? " on" : "") +
        '" data-cal-status="' + s.id + '">' + esc(label) + "</button>";
    }).join("");
    html += "</div></div>";
    return html;
  }

  function calEditorFooterHtml(opts) {
    opts = opts || {};
    var html = '<div class="cal-sheet-actions cal-sheet-footer">';
    if (opts.swap) html += '<button type="button" class="btn-ghost" data-cal-swap>Try another</button>';
    html += '<button type="button" class="btn" data-cal-save>Close</button>';
    html += '<button type="button" class="btn-ghost danger-ghost" data-cal-delete>Delete</button>';
    html += "</div>";
    return html;
  }

  function renderCalEditor() {
    var detail = $("calendarDetail");
    var titleEl = $("calSheetTitle");
    var st = getState();
    if (!detail || !st || !st.data.calendarEditing) return;
    var ae = document.activeElement;
    if (ae && detail.contains(ae) && (ae.tagName === "TEXTAREA" || ae.tagName === "INPUT") &&
        ae.type !== "checkbox" && ae.type !== "radio" && ae.type !== "hidden") return;
    var date = st.data.calendarEditing.date;
    var itemId = st.data.calendarEditing.itemId;
    var dayRow = (st.data.calendar && st.data.calendar[date]) || null;
    var item = null;
    if (dayRow && dayRow.items) {
      for (var i = 0; i < dayRow.items.length; i++) {
        if (dayRow.items[i].id === itemId) item = dayRow.items[i];
      }
    }
    if (!item) {
      closeCalSheet();
      return;
    }
    if (item.vaultId && findVaultPost(item.vaultId)) {
      renderVaultEditor();
      return;
    }
    setSheetKicker("Card");
    if (titleEl) titleEl.textContent = Cal.prettyDate(Cal.parseYmd(date));
    var typeGroup = Cal.editorTypeId ? Cal.editorTypeId(item.type) : item.type;
    var isOutreach = typeGroup === "reach_out";
    var isTodo = typeGroup === "personal";
    var isPost = typeGroup === "post";
    var isRest = item.type === "reactive" || item.kind === "rest";
    var hasType = !!typeGroup;
    if (isTodo && !(item.title || "").trim() && (item.person || "").trim()) {
      item.title = String(item.person).trim();
      item.person = "";
      persist();
    }

    var html = calStatusFieldHtml(item, { isTodo: isTodo });
    if (isPost) html += calFramesHtml(item);
    /* Use <div class="field"> for text inputs — nesting textarea/input in
       <label> makes iOS clear selection after one word and jump the sheet. */
    html += '<div class="field"><span class="field-label">Type</span>' +
      renderTypeChips(item.type) + "</div>";
    if (isPost) {
      html +=
        '<div class="vault-field-row">' +
          '<label class="field"><span class="field-label">Promoting</span>' +
            '<select id="calPromoting" class="cal-select">' + renderPromotingOptions(item.promoting || "") + "</select></label>" +
          '<label class="field"><span class="field-label">Format</span>' +
            '<select id="calFormat" class="cal-select">' + renderFormatOptions(item.format || "") + "</select></label>" +
        "</div>";
    }
    if (isOutreach || item.person) {
      html += '<div class="field"><span class="field-label">Who</span>' +
        '<input type="text" id="calPerson" class="cal-input" placeholder="Name…" value="' + esc(item.person || "") + '"></div>';
    } else {
      html += '<input type="hidden" id="calPerson" value="' + esc(item.person || "") + '">';
    }
    if (hasType || isRest) {
      html += '<div class="field"><span class="field-label">Title</span>' +
        '<input type="text" id="calTitle" class="cal-input" placeholder="' +
        (isTodo ? "Optional — shows on the calendar" : "Optional short label") +
        '" value="' + esc(item.title || "") + '"></div>';
    } else {
      html += '<input type="hidden" id="calTitle" value="' + esc(item.title || "") + '">';
    }
    if (isTodo) {
      var tasks = (Cal.parseTasks && Cal.parseTasks(item)) || [];
      html += '<div class="field cal-todo" id="calTodo">';
      html += '<span class="field-label">To-do list</span>';
      html += '<p class="cal-todo-hint">One line per thing. Not a post, not a follow-up.</p>';
      html += '<div class="cal-todo-rows" id="calTodoRows">' + todoRowsHtml(tasks) + "</div>";
      html += '<input type="text" class="cal-input" id="calTodoAdd" placeholder="Add a line…" enterkeyhint="enter" autocomplete="off">';
      html += "</div>";
    } else if (hasType || isRest) {
      html += '<div class="field"><span class="field-label">' + (isOutreach ? "Message" : "Draft") + "</span>" +
        '<textarea id="calDraft" rows="8" placeholder="Write it in your voice…">' + esc(item.draft || "") + "</textarea>" +
        '<span class="claim-check" id="calClaim"></span></div>';
    }
    html += calEditorFooterHtml({
      swap: isPost && item.type !== "post" && item.type !== "reactive"
    });
    if (isPost) html += shelfOfferHtml(item);
    detail.innerHTML = html;

    wireEditorFields(date, item.id);
    if (isPost) wireCalFrameFiles(item.id);
  }

  function todoRowsHtml(tasks) {
    return (tasks || []).map(function (t) {
      return '<div class="cal-todo-row' + (t.done ? " is-done" : "") + '">' +
        '<input type="checkbox" data-cal-todo-done' + (t.done ? " checked" : "") + ">" +
        '<input type="text" class="cal-input" data-cal-todo-text value="' + esc(t.text || "") + '" placeholder="A thing to do">' +
        '<button type="button" class="cal-todo-x" data-cal-todo-remove aria-label="Remove">×</button>' +
        "</div>";
    }).join("");
  }

  function readTodoTasksFromDom() {
    var rows = document.querySelectorAll("#calTodoRows .cal-todo-row");
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var textEl = rows[i].querySelector("[data-cal-todo-text]");
      var cb = rows[i].querySelector("[data-cal-todo-done]");
      var text = textEl ? String(textEl.value || "").trim() : "";
      if (!text) continue;
      out.push({ text: text, done: !!(cb && cb.checked) });
    }
    return out;
  }

  function applyTodoTasks(it, tasks) {
    if (!it) return;
    it.tasks = tasks || [];
    if (Cal.tasksDraft) it.draft = Cal.tasksDraft(it.tasks);
  }

  function flushTodoEditor() {
    var st = getState && getState();
    var ed = st && st.data && st.data.calendarEditing;
    if (!ed || !$("calTodoRows")) return;
    var day = Cal.ensureDay(st.data.calendar, ed.date);
    for (var i = 0; i < day.items.length; i++) {
      if (day.items[i].id !== ed.itemId) continue;
      var tasks = readTodoTasksFromDom();
      var addEl = $("calTodoAdd");
      if (addEl && String(addEl.value || "").trim()) {
        tasks.push({ text: String(addEl.value).trim(), done: false });
        addEl.value = "";
      }
      applyTodoTasks(day.items[i], tasks);
      return;
    }
  }

  function applyCalendarItemType(it, next, st, date) {
    var prev = it.type;
    flushTodoEditor();
    if (!next) {
      it.type = "";
      it.category = "";
      it.kind = "";
      it.icon = "";
      return;
    }
    var meta = Cal.typeMeta(next);
    it.type = next;
    it.category = meta.category;
    it.kind = meta.kind;
    it.icon = meta.icon;
    if (next === "personal") {
      it.format = "";
      it.promoting = "";
      if (it.status === "drafted" || it.status === "ready") it.status = "";
      delete it.tasks;
      it.tasks = Cal.parseTasks ? Cal.parseTasks(it) : [];
      if (Cal.tasksDraft) it.draft = Cal.tasksDraft(it.tasks);
    } else if (prev === "personal") {
      it.tasks = [];
      if (next === "reach_out" && !(it.draft || "").trim() && Cal.draftFor) {
        it.draft = Cal.draftFor(next, st.data, date);
      }
    } else if (next === "reach_out" && !(it.draft || "").trim() && Cal.draftFor) {
      it.draft = Cal.draftFor(next, st.data, date);
    }
  }

  function wireEditorFields(date, itemId) {
    var st = getState();
    function itemRow() {
      var day = Cal.ensureDay(st.data.calendar, date);
      for (var i = 0; i < day.items.length; i++) if (day.items[i].id === itemId) return day.items[i];
      return null;
    }
    function touch(rerender) {
      persist();
      if (rerender) {
        renderCalendar();
        renderCalEditor();
      }
      if (typeof window.FS.onCalendarChange === "function") window.FS.onCalendarChange();
    }

    var fmtEl = $("calFormat");
    if (fmtEl) fmtEl.addEventListener("change", function () {
      var it = itemRow(); if (!it) return;
      it.format = fmtEl.value;
      touch(false);
    });
    var promEl = $("calPromoting");
    if (promEl) promEl.addEventListener("change", function () {
      var it = itemRow(); if (!it) return;
      it.promoting = promEl.value;
      touch(false);
    });
    ["calPerson", "calTitle"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", function () {
        var it = itemRow(); if (!it) return;
        if (id === "calPerson") it.person = el.value;
        if (id === "calTitle") it.title = el.value;
        touch(false);
      });
    });
    var ta = $("calDraft");
    if (ta) {
      ta.addEventListener("input", function () {
        var it = itemRow(); if (!it) return;
        it.draft = ta.value;
        runCalClaim(ta.value);
        touch(false);
      });
      runCalClaim(ta.value);
    }
    var todoBox = $("calTodo");
    if (todoBox) {
      function saveTodos() {
        var it = itemRow(); if (!it) return;
        applyTodoTasks(it, readTodoTasksFromDom());
        persist();
        renderCalendar();
      }
      todoBox.addEventListener("change", function (e) {
        var t = e.target;
        if (!t || !t.hasAttribute("data-cal-todo-done")) return;
        var row = t.closest(".cal-todo-row");
        if (row) row.classList.toggle("is-done", !!t.checked);
        saveTodos();
      });
      todoBox.addEventListener("input", function (e) {
        var t = e.target;
        if (!t || !t.hasAttribute("data-cal-todo-text")) return;
        var it = itemRow(); if (!it) return;
        applyTodoTasks(it, readTodoTasksFromDom());
        persist();
      });
      todoBox.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest("[data-cal-todo-remove]");
        if (!btn) return;
        var row = btn.closest(".cal-todo-row");
        if (row) row.remove();
        saveTodos();
      });
      var addEl = $("calTodoAdd");
      if (addEl) {
        function commitAddLine() {
          var text = String(addEl.value || "").trim();
          if (!text) return;
          var it = itemRow(); if (!it) return;
          var rows = $("calTodoRows");
          var tasks = rows ? readTodoTasksFromDom() : ((it.tasks && it.tasks.slice()) || []);
          var last = tasks[tasks.length - 1];
          if (last && last.text === text && !last.done) {
            addEl.value = "";
            return;
          }
          tasks.push({ text: text, done: false });
          applyTodoTasks(it, tasks);
          addEl.value = "";
          /* Append — do not rebuild the list. Replacing innerHTML drops the tap
             that dismissed this field (checkbox / Done) and can wipe tasks if
             blur runs after the sheet has already closed. */
          if (rows) rows.insertAdjacentHTML("beforeend", todoRowsHtml([{ text: text, done: false }]));
          persist();
          renderCalendar();
        }
        addEl.addEventListener("keydown", function (e) {
          if (e.key !== "Enter") return;
          e.preventDefault();
          commitAddLine();
        });
        addEl.addEventListener("blur", commitAddLine);
      }
    }
  }

  function runCalClaim(text) {
    var el = $("calClaim");
    if (!el) return;
    var RISKY = window.FS.RISKY || [];
    var trimmed = (text || "").trim();
    if (!trimmed) { el.innerHTML = ""; return; }
    var hits = [];
    for (var i = 0; i < RISKY.length; i++) if (RISKY[i].re.test(text)) hits.push(RISKY[i]);
    if (hits.length) {
      el.innerHTML = '<span class="claim-flag">⚠ ' + esc(hits[0].word) + '</span><span class="claim-note">' + esc(hits[0].tip) + '</span>';
      return;
    }
    if (trimmed.length < 12) { el.innerHTML = ""; return; }
    el.innerHTML = "";
  }

  var leadsFilter = "all";
  var leadsCache = [];
  var leadsFetchError = "";
  /* renderLeads() is called from auth, tab focus and panel nav, so two can be in
     flight at once. Each run takes a ticket; a run that finds a newer ticket
     drops its result instead of painting an older inbox over a newer one. */
  var leadsRun = 0;
  var leadOpenerIndex = {};
  var leadNoteRuns = {}; /* lead id -> latest save ticket */
  var leadsSearchQ = "";
  var leadsSearchTimer = 0;
  var LEADS_PAGE = 40;
  var leadsListLimit = LEADS_PAGE;
  var groveDoorElig = null;
  var leadFoldOpen = {}; /* id -> { more: bool, move: bool, notes: bool } */
  var leadFoldIgnoreToggle = 0;

  function leadMoreOn(id) {
    return !!(leadFoldOpen[id] && leadFoldOpen[id].more);
  }

  function setLeadMore(id, on) {
    if (!id) return;
    if (!leadFoldOpen[id]) leadFoldOpen[id] = {};
    leadFoldOpen[id].more = !!on;
  }
  var leadNameEditingId = "";
  var leadNameDraft = "";
  var leadMenusOpen = {};
  var leadMenuTouchGuardUntil = 0;

  function rememberOpenLeadMenus() {
    leadMenusOpen = {};
    var nodes = document.querySelectorAll(".leads-status-dd.is-open");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-lead-menu");
      if (key) leadMenusOpen[key] = true;
    }
  }

  function closeLeadMenu(el) {
    if (!el) return;
    el.classList.remove("is-open");
    var btn = el.querySelector("[data-lead-menu-toggle]");
    if (btn) btn.setAttribute("aria-expanded", "false");
    var key = el.getAttribute("data-lead-menu");
    if (key) delete leadMenusOpen[key];
  }

  function openLeadMenu(el) {
    if (!el) return;
    var open = document.querySelectorAll(".leads-status-dd.is-open");
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== el) closeLeadMenu(open[i]);
    }
    el.classList.add("is-open");
    var btn = el.querySelector("[data-lead-menu-toggle]");
    if (btn) btn.setAttribute("aria-expanded", "true");
    var key = el.getAttribute("data-lead-menu");
    if (key) leadMenusOpen[key] = true;
    leadMenuTouchGuardUntil = Date.now() + 300;
  }

  function toggleLeadMenu(el) {
    if (!el) return;
    if (el.classList.contains("is-open")) closeLeadMenu(el);
    else openLeadMenu(el);
  }

  function leadMenuOpenClass(key) {
    return leadMenusOpen[key] ? " is-open" : "";
  }

  function leadMenuExpanded(key) {
    return leadMenusOpen[key] ? "true" : "false";
  }

  function interestLabel(v) {
    if (v === "products") return "Products";
    if (v === "business") return "Business";
    if (v === "both") return "Both";
    return "";
  }

  function interestIsSet(v) {
    return v === "products" || v === "business" || v === "both";
  }

  function statusLabel(v) {
    if (v === "all") return "All";
    if (v === "new") return "New";
    if (v === "reached") return "Reached out";
    if (v === "talking") return "Talking";
    if (v === "fb") return "FB group";
    if (v === "hot") return "Hot";
    if (v === "quiz") return "Took Fresh Match";
    if (v === "info") return "Info";
    if (v === "done") return "Until launch";
    if (v === "joined") return "Joined the grove";
    if (v === "grove") return "Fresh Grove";
    if (v === "site") return "Your site";
    if (v === "archived") return "Archived";
    if (v === "products") return "Products";
    if (v === "business") return "Business";
    if (v === "both") return "Both";
    return v || "—";
  }

  function paintLeadsFilterTease() {
    var tease = $("leadsFilterTease");
    if (!tease) return;
    tease.textContent = (!leadsFilter || leadsFilter === "all") ? "" : statusLabel(leadsFilter);
  }

  function leadHotBtnHtml(r) {
    var on = leadHotOn(r, getState ? getState() : null);
    return '<button type="button" class="leads-hot-btn' + (on ? " on" : "") +
      '" data-lead-hot="' + esc(r.id) + '" aria-pressed="' + (on ? "true" : "false") +
      '" title="' + (on ? "Hot lead — tap to unmark" : "Mark as hot") +
      '" aria-label="' + (on ? "Hot lead, tap to unmark" : "Mark as hot lead") +
      '"><span aria-hidden="true">🔥</span></button>';
  }

  function leadInterestDropdownHtml(r) {
    var lanes = [
      { id: "products", label: "Products" },
      { id: "business", label: "Business" },
      { id: "both", label: "Both" }
    ];
    var key = "interest:" + r.id;
    var unset = !interestIsSet(r.interest);
    var html = '<div class="leads-status-dd leads-interest-dd' + leadMenuOpenClass(key) + '" data-lead-menu="' + esc(key) + '">';
    html += '<button type="button" class="leads-status-sum is-interest' + (unset ? " is-empty" : "") +
      '" data-lead-menu-toggle="1" aria-expanded="' +
      leadMenuExpanded(key) + '" aria-haspopup="listbox" aria-label="' +
      (unset ? "Set interest" : esc(interestLabel(r.interest))) + '">' +
      esc(interestLabel(r.interest)) + "</button>";
    html += '<div class="leads-status-menu" role="listbox" aria-label="Interest for ' + esc(r.name) + '">';
    lanes.forEach(function (s) {
      html += '<button type="button" class="leads-status-opt' + (r.interest === s.id ? " on" : "") +
        '" data-lead-interest="' + esc(r.id) + '" data-interest="' + s.id + '"' +
        (r.interest === s.id ? ' aria-current="true"' : "") + ">" + esc(s.label) + "</button>";
    });
    html += "</div></div>";
    return html;
  }

  function leadStatusDropdownHtml(r, tourCard) {
    var statuses = [
      { id: "new", label: "New" },
      { id: "reached", label: "Reached out" },
      { id: "talking", label: "Talking" },
      { id: "fb", label: "Invited to FB group" },
      { id: "done", label: "Keeping updated until launch" },
      { id: "joined", label: "Joined the grove" },
      { id: "archived", label: "Archived" }
    ];
    var key = "status:" + r.id;
    var html = '<div class="leads-status-dd' + leadMenuOpenClass(key) + '" data-lead-menu="' + esc(key) + '"' +
      (tourCard ? ' data-leads-tour="actions"' : "") + ">";
    html += '<button type="button" class="leads-status-sum' +
      (r.status === "joined" ? " is-joined" : "") +
      (r.status === "fb" ? " is-fb" : "") +
      '" data-lead-menu-toggle="1" aria-expanded="' +
      leadMenuExpanded(key) + '" aria-haspopup="listbox">' + esc(statusLabel(r.status)) + "</button>";
    html += '<div class="leads-status-menu" role="listbox" aria-label="Status for ' + esc(r.name) + '">';
    statuses.forEach(function (s) {
      html += '<button type="button" class="leads-status-opt' + (r.status === s.id ? " on" : "") +
        '" data-lead-status="' + esc(r.id) + '" data-status="' + s.id + '"' +
        (r.status === s.id ? ' aria-current="true"' : "") + ">" + esc(s.label) + "</button>";
    });
    html += "</div></div>";
    return html;
  }

  function leadQuizDropdownHtml(r) {
    var on = leadQuizOn(r, getState ? getState() : null);
    var key = "quiz:" + r.id;
    var html = '<div class="leads-status-dd leads-quiz-dd' + leadMenuOpenClass(key) + '" data-lead-menu="' + esc(key) + '">';
    html += '<button type="button" class="leads-status-sum' + (on ? " is-quiz" : "") + '" data-lead-menu-toggle="1" aria-expanded="' +
      leadMenuExpanded(key) + '" aria-haspopup="listbox">' + (on ? "Took quiz" : "Quiz") + "</button>";
    html += '<div class="leads-status-menu" role="listbox" aria-label="Fresh Match for ' + esc(r.name) + '">';
    [
      { on: false, label: "Not yet" },
      { on: true, label: "Took Fresh Match quiz" }
    ].forEach(function (s) {
      html += '<button type="button" class="leads-status-opt' + ((!!s.on) === on ? " on" : "") +
        '" data-lead-quiz="' + esc(r.id) + '" data-quiz="' + (s.on ? "1" : "0") + '"' +
        ((!!s.on) === on ? ' aria-current="true"' : "") + ">" + esc(s.label) + "</button>";
    });
    html += "</div></div>";
    return html;
  }

  function leadFirstName(full) {
    var n = String(full || "").trim().split(/\s+/)[0] || "friend";
    return n.charAt(0).toUpperCase() + n.slice(1);
  }

  /* Starter texts for a new lead — short, human, easy to rewrite. */
  function leadOpenerBank(interest, row) {
    if (row && row.source === "grove") {
      if (interest === "business") {
        return [
          "Hey {name}! So glad you found me on The Fresh Grove — would love to chat about partnering whenever you’re free.",
          "Hi {name}! You found me on The Fresh Grove. Want me to walk you through how the partnership side works?",
          "Hey {name} — saw you found me on The Fresh Grove. Got a few minutes this week to talk founding / partnership?"
        ];
      }
      if (interest === "both") {
        return [
          "Hey {name}! So glad you found me on The Fresh Grove — products, partnership, or a little of both, I’m here for it.",
          "Hi {name}! You found me on The Fresh Grove. Want to start with the products, or the partner side?",
          "Hey {name}! Thanks for checking both on The Fresh Grove. Happy to share whichever you want first."
        ];
      }
      return [
        "Hey {name}! So glad you found me on The Fresh Grove — would love to share more about the products with you.",
        "Hi {name}! You found me on The Fresh Grove. Want me to send over a favorite product to peek at?",
        "Hey {name} — saw you found me on The Fresh Grove. Happy to answer anything about the products."
      ];
    }
    if (interest === "business") {
      return [
        "Hey {name}! Thanks for leaving your info — would love to chat about partnering whenever you’re free.",
        "Hi {name}! You left your info on my Ringana page. Want me to walk you through how the partnership side works?",
        "Hey {name} — got your note. Got a few minutes this week to talk founding / partnership?"
      ];
    }
    if (interest === "both") {
      return [
        "Hey {name}! Thanks for leaving your info — products, partnership, or a little of both, I’m here for it.",
        "Hi {name}! You left your info on my Ringana page. Want to start with the products, or the partner side?",
        "Hey {name}! Thanks for checking both. Happy to share whichever you want first."
      ];
    }
    if (!interestIsSet(interest)) {
      return [
        "Hey {name}! Thanks for leaving your info — would love to connect whenever you’re free.",
        "Hi {name}! Thanks for leaving your info. Want to start with the products, or the partner side?",
        "Hey {name}! Glad you’re here. Happy to share whichever you want first."
      ];
    }
    return [
      "Hey {name}! Thanks for leaving your info — would love to share more about the products with you.",
      "Hi {name}! You left your info on my Ringana page. Want me to send over a favorite product to peek at?",
      "Hey {name} — got your note. Happy to answer anything about the products."
    ];
  }

  function leadOpenerFor(row) {
    var bank = leadOpenerBank(row && row.interest, row);
    var id = row && row.id ? String(row.id) : "";
    var idx = leadOpenerIndex[id] || 0;
    if (idx < 0 || idx >= bank.length) idx = 0;
    return bank[idx].replace(/\{name\}/g, leadFirstName(row && row.name));
  }

  function leadSmsHref(phone, body) {
    var raw = String(phone || "").trim();
    if (!raw) return "";
    var digits = raw.replace(/[^\d+]/g, "");
    if (!digits) return "";
    /* iOS Messages wants &body=; Android prefers ?body=. */
    var ios = false;
    try {
      ios = /iPad|iPhone|iPod/i.test(navigator.userAgent || "") ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    } catch (e) {}
    return "sms:" + digits + (ios ? "&body=" : "?body=") + encodeURIComponent(body);
  }

  function leadMailSubject(interest, name) {
    var first = leadFirstName(name);
    if (interest === "business") {
      return first + " — those fresh products (+ a quick founding note)";
    }
    if (interest === "both") {
      return first + " — the fresh products you asked about";
    }
    return first + " — those fresh products you asked about";
  }

  function leadMailHref(email, body, name, interest) {
    var em = String(email || "").trim();
    if (em.indexOf("@") < 1 || /[\s<>]/.test(em)) return "";
    var subject = leadMailSubject(interest, name);
    /* Keep @ literal — encodeURIComponent turns it into %40 and some mail apps fail. */
    var addr = encodeURIComponent(em).replace(/%40/g, "@");
    return "mailto:" + addr +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function findLeadInCache(id) {
    for (var i = 0; i < leadsCache.length; i++) {
      if (leadsCache[i] && leadsCache[i].id === id) return leadsCache[i];
    }
    return null;
  }

  function patchLeadInCache(updated) {
    if (!updated || !updated.id) return;
    for (var i = 0; i < leadsCache.length; i++) {
      if (leadsCache[i] && leadsCache[i].id === updated.id) {
        leadsCache[i] = Object.assign({}, leadsCache[i], updated);
        break;
      }
    }
    for (var f = 0; f < leadFollowCache.length; f++) {
      if (leadFollowCache[f] && leadFollowCache[f].id === updated.id) {
        leadFollowCache[f] = Object.assign({}, leadFollowCache[f], updated);
        break;
      }
    }
  }

  function dropLeadFromCache(id) {
    leadsCache = leadsCache.filter(function (r) { return r && r.id !== id; });
    if (leadNameEditingId === id) {
      leadNameEditingId = "";
      leadNameDraft = "";
    }
    if (leadFoldOpen[id]) delete leadFoldOpen[id];
    var st = getState ? getState() : null;
    if (st && st.data && st.data.leadFollowById) delete st.data.leadFollowById[id];
    if (st && st.data && st.data.leadHotById) delete st.data.leadHotById[id];
    if (st && st.data && st.data.leadQuizById) delete st.data.leadQuizById[id];
    clearLeadFollowQuietFrom(st, id);
  }

  function paintLeadsNewBadge() {
    var nNew = 0;
    leadsCache.forEach(function (r) { if (r && r.status === "new") nNew++; });
    paintNavBadge("leads", nNew);
  }

  async function setLeadFollowUp(leadId, on) {
    var st = getState && getState();
    if (!st || !st.data) throw new Error("Could not save follow-up.");
    on = !!on;
    var before = findLeadInCache(leadId);
    var prevTouched = before && (before.updated_at || before.created_at);
    try {
      var updated = await Cloud.updateLeadFollowUp(leadId, on);
      patchLeadInCache(updated || { id: leadId, follow_up: on });
      if (st.data.leadFollowById) delete st.data.leadFollowById[leadId];
      if (on && prevTouched) {
        pinLeadFollowQuietFrom(st, leadId, prevTouched, (updated && updated.updated_at) || new Date().toISOString());
      } else if (!on) {
        clearLeadFollowQuietFrom(st, leadId);
      }
    } catch (err) {
      rememberLocalLeadFollow(st, leadId, on);
      patchLeadInCache({ id: leadId, follow_up: on });
      if (on && prevTouched) pinLeadFollowQuietFrom(st, leadId, prevTouched, new Date().toISOString());
      else if (!on) clearLeadFollowQuietFrom(st, leadId);
      var msg = String((err && err.message) || "");
      if (/not found/i.test(msg) && !isMissingFollowUpColumn(err)) throw err;
    }
    if (persist) persist();
    leadFollowCache = leadsCache.slice();
    if (typeof renderCalendar === "function") renderCalendar();
    if (on && FS.UI && FS.UI.toast) {
      var quietN = leadFollowQuietDays(st);
      var today = Cal && Cal.ymd ? Cal.ymd(new Date()) : "";
      var showing = today && leadFollowSuggestionsForDay(today, st).some(function (lead) {
        return lead && lead.id === leadId;
      });
      FS.UI.toast(
        showing
          ? "Look on Calendar → Today. You’ll see a dashed Follow up with their name — not a new event."
          : "Nothing on the calendar yet. After " + quietN + " days without an update, their name shows on today.",
        { tone: "good" }
      );
    }
  }

  async function setLeadHot(leadId, on) {
    var st = getState && getState();
    if (!st || !st.data) throw new Error("Could not save.");
    on = !!on;
    try {
      var updated = await Cloud.updateLeadHot(leadId, on);
      patchLeadInCache(updated || { id: leadId, hot: on });
      if (st.data.leadHotById) delete st.data.leadHotById[leadId];
    } catch (err) {
      rememberLocalLeadHot(st, leadId, on);
      patchLeadInCache({ id: leadId, hot: on });
      var msg = String((err && err.message) || "");
      if (/not found/i.test(msg) && !isMissingHotColumn(err)) throw err;
    }
    if (persist) persist();
  }

  async function setLeadQuiz(leadId, on) {
    var st = getState && getState();
    if (!st || !st.data) throw new Error("Could not save.");
    on = !!on;
    try {
      var updated = await Cloud.updateLeadFreshMatch(leadId, on);
      patchLeadInCache(updated || { id: leadId, fresh_match: on });
      if (st.data.leadQuizById) delete st.data.leadQuizById[leadId];
    } catch (err) {
      rememberLocalLeadQuiz(st, leadId, on);
      patchLeadInCache({ id: leadId, fresh_match: on });
      var msg = String((err && err.message) || "");
      if (/not found/i.test(msg) && !isMissingQuizColumn(err)) throw err;
    }
    if (persist) persist();
  }

  async function setAllLeadFollowUps(on) {
    var st = getState && getState();
    if (!st || !st.data) return;
    on = !!on;
    st.data.calendarLeadFollowUps = on;
    var prevById = {};
    leadsCache.forEach(function (row) {
      if (row && row.id) prevById[row.id] = row.updated_at || row.created_at;
    });
    function stampAll(rows) {
      (rows || []).forEach(function (row) {
        if (!row || !row.id) return;
        row.follow_up = on;
        rememberLocalLeadFollow(st, row.id, on);
        patchLeadInCache(row);
      });
    }
    function stampQuietPins(rows) {
      if (!on) {
        (rows || []).forEach(function (row) {
          if (row && row.id) clearLeadFollowQuietFrom(st, row.id);
        });
        return;
      }
      (rows || []).forEach(function (row) {
        if (!row || !row.id || !prevById[row.id]) return;
        pinLeadFollowQuietFrom(st, row.id, prevById[row.id], row.updated_at || new Date().toISOString());
      });
    }
    try {
      if (Cloud.isSignedIn && Cloud.isSignedIn()) {
        var rows = await Cloud.updateAllLeadFollowUps(on);
        if (rows && rows.length) {
          leadsCache = rows;
          if (st.data.leadFollowById) {
            rows.forEach(function (row) {
              if (row && row.id) delete st.data.leadFollowById[row.id];
            });
          }
        } else {
          if (!leadsCache.length) leadsCache = await Cloud.listMyLeads();
          stampAll(leadsCache);
        }
      } else if (leadsCache.length) {
        stampAll(leadsCache);
      }
    } catch (err) {
      if (!leadsCache.length && Cloud.isSignedIn && Cloud.isSignedIn()) {
        try { leadsCache = await Cloud.listMyLeads(); } catch (e2) {}
      }
      stampAll(leadsCache);
      if (!isMissingFollowUpColumn(err) && leadsCache.length === 0) throw err;
    }
    stampQuietPins(leadsCache);
    if (persist) persist();
    leadFollowCache = leadsCache.slice();
    renderLeadsList();
    if (typeof renderCalendar === "function") renderCalendar();
  }

  /* Keep in-progress note drafts across list re-renders (search / shuffle / status). */
  function syncLeadNotesFromDom() {
    var areas = document.querySelectorAll("[data-lead-notes]");
    for (var i = 0; i < areas.length; i++) {
      var el = areas[i];
      var id = el.getAttribute("data-lead-notes");
      if (!id) continue;
      var row = findLeadInCache(id);
      if (row) row.notes = el.value || "";
    }
  }

  function syncLeadsShareUI(slug) {
    var share = $("leadsShareInput");
    var preview = $("leadsPreviewLink");
    var slugInput = $("leadsSlugInput");
    if (slugInput && document.activeElement !== slugInput) slugInput.value = slug || "";
    var url = "";
    if (!packEvergreen()) {
      if (typeof window.FS.leadsPageInviteUrl === "function") url = window.FS.leadsPageInviteUrl() || "";
      if (!url && slug) url = Cloud.leadUrl(slug);
      if (url && Cloud.hardenShareUrl) url = Cloud.hardenShareUrl(url) || url;
    }
    if (share) share.value = url;
    if (preview) {
      var previewHref = (typeof window.FS.leadsPreviewHref === "function")
        ? window.FS.leadsPreviewHref(slug)
        : (slug ? ("lead.html?p=" + encodeURIComponent(slug) + "&from=app") : "lead.html");
      preview.href = previewHref || "lead.html";
      preview.hidden = !slug && !(previewHref && previewHref.indexOf("http") === 0);
      preview.target = "_blank";
      preview.rel = (previewHref && previewHref.indexOf("http") === 0 && previewHref.indexOf("lead.html") < 0)
        ? "noopener noreferrer"
        : "opener";
      if (preview.dataset.openBound !== "1") {
        preview.dataset.openBound = "1";
        preview.addEventListener("click", function (e) {
          var href = preview.getAttribute("href");
          if (!href || preview.hidden) return;
          var w = null;
          try { w = window.open(href, "_blank"); } catch (err) {}
          if (w) e.preventDefault();
        });
      }
    }
    var groveShare = $("leadsGroveShareInput");
    var grovePreview = $("leadsGrovePreviewLink");
    var groveUrl = (!packEvergreen() && slug && Cloud.groveWithUrl) ? Cloud.groveWithUrl(slug) : "";
    if (groveUrl && Cloud.hardenShareUrl) groveUrl = Cloud.hardenShareUrl(groveUrl) || groveUrl;
    if (groveShare) groveShare.value = groveUrl;
    if (grovePreview) {
      if (groveUrl) grovePreview.href = groveUrl;
      else grovePreview.removeAttribute("href");
      grovePreview.hidden = !groveUrl;
      grovePreview.target = "_blank";
      grovePreview.rel = "noopener";
    }
    restoreLeadsPagesFold();
    if (typeof window.FS.updateLeadPageSettingUI === "function") {
      window.FS.updateLeadPageSettingUI();
    }
    if (typeof window.FS.paintLeadsShareButton === "function") {
      window.FS.paintLeadsShareButton();
    }
    if (typeof window.FS.paintGrovePageShareButton === "function") {
      window.FS.paintGrovePageShareButton();
    }
    refreshGroveDoorPanel();
  }

  var leadPreviewPrefetch = {};

  function prefetchLeadPreviews() {
    var urls = [];
    var preview = $("leadsPreviewLink");
    var grove = $("leadsGrovePreviewLink");
    if (preview && preview.href && !preview.hidden) urls.push(preview.href);
    if (grove && grove.href && !grove.hidden) urls.push(grove.href);
    urls.forEach(function (href) {
      if (!href || leadPreviewPrefetch[href]) return;
      leadPreviewPrefetch[href] = 1;
      try {
        var l = document.createElement("link");
        l.rel = "prefetch";
        l.href = href;
        document.head.appendChild(l);
      } catch (e) {}
      try { fetch(href, { mode: "no-cors", credentials: "omit" }); } catch (e2) {}
    });
  }

  function syncLeadsPagesGo(fold) {
    fold = fold || $("leadsPagesFold");
    if (!fold) return;
    var go = fold.querySelector(".leads-pages-go");
    if (go) go.textContent = fold.open ? "Close" : "Open →";
    if (fold.open) prefetchLeadPreviews();
  }

  function restoreLeadsPagesFold() {
    var fold = $("leadsPagesFold");
    if (!fold) return;
    if (fold.dataset.bound !== "1") {
      fold.dataset.bound = "1";
      try {
        if (localStorage.getItem("fs_leads_pages_open") === "1") fold.open = true;
      } catch (e) {}
      fold.addEventListener("toggle", function () {
        try { localStorage.setItem("fs_leads_pages_open", fold.open ? "1" : "0"); } catch (e2) {}
        syncLeadsPagesGo(fold);
      });
    }
    syncLeadsPagesGo(fold);
  }

  function groveListHint(elig) {
    elig = elig || {};
    if (elig.visible && !elig.has_ig) {
      return "You’re on the list — add your Instagram so it can sit next to your first name.";
    }
    if (elig.visible) return "You’re on the public list. Turn this off anytime.";
    if (elig.founding_pair) {
      if (!elig.has_ig) return "Add your Instagram username so it can sit next to your first name on the list.";
      if (!elig.has_slug) return "Your share link isn’t ready yet — try again in a moment.";
      return "You’re ready. Turn this on to appear on the list.";
    }
    if (!elig.sprout_done && !elig.has_teammate) {
      return "This turns on after you finish Sprout and someone joins your team with your join link (Settings → Sharing).";
    }
    if (!elig.sprout_done) return "Finish Sprout first — then this can turn on.";
    if (!elig.has_teammate) return "Once someone joins your team with your join link (Settings → Sharing), you can turn this on.";
    if (!elig.has_ig) return "Add your Instagram username so it can sit next to your first name on the list.";
    if (!elig.has_slug) return "Your share link isn’t ready yet — try again in a moment.";
    return "You’re ready. Turn this on to appear on the list.";
  }

  function paintGroveListToggle(btn, hint, elig) {
    elig = elig || {};
    var on = !!elig.visible;
    var canOn = !!elig.can_on;
    if (btn) {
      btn.disabled = on ? false : !canOn;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("on", on);
      btn.textContent = on ? "On the list" : "Off the list";
    }
    if (hint) hint.textContent = groveListHint(elig);
  }

  async function refreshGroveDoorPanel() {
    var btn = $("leadsGroveListToggle");
    var hint = $("leadsGroveListHint");
    var settingsBtn = $("settingsGroveListToggle");
    var settingsHint = $("settingsGroveListHint");
    var ig = $("leadsGroveIgInput");
    var user = Cloud.user && Cloud.user();
    if (!user) {
      if (btn) btn.disabled = true;
      if (settingsBtn) settingsBtn.disabled = true;
      return;
    }
    if (ig && document.activeElement !== ig) {
      ig.value = String((groveDoorElig && groveDoorElig.instagram) || user.instagram || "").replace(/^@/, "");
    }
    try {
      groveDoorElig = await Cloud.groveDoorEligibility();
    } catch (err) {
      groveDoorElig = groveDoorElig || {};
      var fail = (err && err.message) || "Could not check the public list yet.";
      if (hint) hint.textContent = fail;
      if (settingsHint) settingsHint.textContent = fail;
      if (btn) btn.disabled = false;
      if (settingsBtn) settingsBtn.disabled = false;
      return;
    }
    if (ig && document.activeElement !== ig) {
      ig.value = String(groveDoorElig.instagram || "").replace(/^@/, "");
    }
    paintGroveListToggle(btn, hint, groveDoorElig);
    paintGroveListToggle(settingsBtn, settingsHint, groveDoorElig);
  }

  var idealAddLane = "customers";

  function idealLeadsApi() {
    return window.FS && window.FS.idealLeads ? window.FS.idealLeads : null;
  }

  function copyLeadPageLink(btn) {
    var share = $("leadsShareInput");
    var url = share && share.value ? share.value.trim() : "";
    if (!url) {
      FS.UI.say("Save your lead page link first (above), then copy it for people on your Ideal Lead List.");
      return;
    }
    copyTextWithFallback(url, btn, "Copied ✓");
  }

  function renderIdealLeadsList() {
    rememberOpenLeadMenus();
    var list = $("idealLeadsList");
    if (!list) return;
    var api = idealLeadsApi();
    if (!api) {
      list.innerHTML = '<p class="leads-empty">Loading your Ideal Lead List…</p>';
      return;
    }
    var rows = (api.list() || []).slice().sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
    });
    var inboxSet = api.inboxNameSet(leadsCache);
    if (!rows.length) {
      list.innerHTML = '<p class="leads-empty">No names yet — add people you’d love to reach, or finish Map Your Grove on Sprout.</p>';
      return;
    }
    var html = "";
    rows.forEach(function (row) {
      var inInbox = !!(row.name && inboxSet[String(row.name).trim().toLowerCase()]);
      var status = row.status === "reached" || row.status === "link_sent" ? row.status : "new";
      html += '<article class="ideal-lead-row' + (inInbox ? " is-inbox" : "") + '">';
      html += '<div class="ideal-lead-main">';
      html += '<div class="ideal-lead-name">' + esc(row.name) + "</div>";
      html += '<div class="ideal-lead-meta">';
      var laneKey = "ideal-lane:" + row.id;
      html += '<div class="leads-status-dd ideal-lead-lane-dd' + leadMenuOpenClass(laneKey) + '" data-lead-menu="' + esc(laneKey) + '">';
      html += '<button type="button" class="ideal-lead-lane-sum" data-lead-menu-toggle="1" aria-expanded="' +
        leadMenuExpanded(laneKey) + '" aria-haspopup="listbox">' + (row.lane === "warm" ? "Partner" : "Customer") + "</button>";
      html += '<div class="leads-status-menu" role="listbox" aria-label="List type for ' + esc(row.name) + '">';
      [
        { id: "customers", label: "Customer" },
        { id: "warm", label: "Partner" }
      ].forEach(function (s) {
        html += '<button type="button" class="leads-status-opt' + (row.lane === s.id ? " on" : "") +
          '" data-ideal-set-lane="' + esc(row.id) + '" data-lane="' + s.id + '"' +
          (row.lane === s.id ? ' aria-current="true"' : "") + ">" + esc(s.label) + "</button>";
      });
      html += "</div></div>";
      if (inInbox) html += '<span class="ideal-lead-inbox">In inbox</span>';
      html += "</div></div>";
      html += '<div class="ideal-lead-statuses" role="group" aria-label="Status for ' + esc(row.name) + '">';
      [
        { id: "new", label: "New" },
        { id: "reached", label: "Reached out" },
        { id: "link_sent", label: "Link sent" }
      ].forEach(function (s) {
        html += '<button type="button" class="ideal-lead-status' + (status === s.id ? " on" : "") +
          '" data-ideal-status="' + esc(row.id) + '" data-status="' + s.id + '">' + esc(s.label) + "</button>";
      });
      html += "</div>";
      html += '<div class="ideal-lead-actions">';
      html += '<button type="button" class="leads-action is-primary" data-ideal-copy-link="' + esc(row.id) + '">Copy lead link</button>';
      html += '<button type="button" class="leads-action is-quiet" data-ideal-remove="' + esc(row.id) + '">Remove</button>';
      html += "</div></article>";
    });
    list.innerHTML = html;
  }

  function csvCell(v) {
    var s = String(v == null ? "" : v);
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function exportLeadsInbox() {
    syncLeadNotesFromDom();
    var who = Cloud.user();
    var rows = (leadsCache || []).slice();
    if (!rows.length) {
      FS.UI.toast("No leads to download on this account.");
      return;
    }
    var headers = [
      "name", "email", "phone", "ig", "interest", "status", "source",
      "notes", "visitor_notes", "created_at", "owner_email", "source_slug"
    ];
    var lines = [headers.join(",")];
    rows.forEach(function (r) {
      lines.push(headers.map(function (k) { return csvCell(r[k]); }).join(","));
    });
    var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    var stamp = new Date().toISOString().slice(0, 10);
    var whoBit = (who && who.email) ? who.email.replace(/[^a-z0-9]+/gi, "-") : "inbox";
    a.download = "first-seeds-leads-" + whoBit + "-" + stamp + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 300);
  }

  function leadNameKey(name) {
    return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function leadPhoneDigits(phone) {
    return String(phone || "").replace(/\D/g, "");
  }

  function leadStatusRank(status) {
    return { new: 1, reached: 2, talking: 3, fb: 4, done: 5, joined: 6 }[status] || 0;
  }

  function pickLeadKeep(rows) {
    var best = rows[0];
    (rows || []).forEach(function (r) {
      if (!r) return;
      if (!best) { best = r; return; }
      var br = leadStatusRank(best.status);
      var rr = leadStatusRank(r.status);
      if (rr > br) { best = r; return; }
      if (rr < br) return;
      var bQuiz = leadQuizOn(best, getState ? getState() : null) ? 1 : 0;
      var rQuiz = leadQuizOn(r, getState ? getState() : null) ? 1 : 0;
      if (rQuiz > bQuiz) { best = r; return; }
      if (rQuiz < bQuiz) return;
      var bNotes = String(best.notes || "").trim() ? 1 : 0;
      var rNotes = String(r.notes || "").trim() ? 1 : 0;
      if (rNotes > bNotes) { best = r; return; }
      if (rNotes < bNotes) return;
      var bt = best.created_at ? new Date(best.created_at).getTime() : 0;
      var rt = r.created_at ? new Date(r.created_at).getTime() : 0;
      if (rt && (!bt || rt < bt)) best = r;
    });
    return best;
  }

  function findLeadDupGroups(rows) {
    var open = (rows || []).filter(function (r) { return r && r.id && !leadIsClosed(r); });
    var parent = {};
    function find(id) {
      if (parent[id] !== id) parent[id] = find(parent[id]);
      return parent[id];
    }
    function unite(a, b) {
      a = find(a);
      b = find(b);
      if (a !== b) parent[b] = a;
    }
    function contactKeys(r) {
      var keys = [];
      var em = String(r.email || "").trim().toLowerCase();
      var ph = leadPhoneDigits(r.phone);
      if (em) keys.push("e:" + em);
      if (ph.length >= 7) keys.push("p:" + ph);
      return keys;
    }
    var byKey = {};
    open.forEach(function (r) {
      parent[r.id] = r.id;
      var keys = contactKeys(r);
      var name = leadNameKey(r.name);
      if (name) keys.push("n:" + name);
      keys.forEach(function (key) {
        if (byKey[key]) unite(byKey[key], r.id);
        else byKey[key] = r.id;
      });
    });
    var buckets = {};
    open.forEach(function (r) {
      var root = find(r.id);
      if (!buckets[root]) buckets[root] = [];
      buckets[root].push(r);
    });
    return Object.keys(buckets).map(function (k) { return buckets[k]; }).filter(function (pack) {
      return pack.length > 1;
    });
  }

  function leadDupDismissKey() {
    var u = Cloud.user && Cloud.user();
    return "fs_leads_dup_dismiss:" + ((u && u.id) || "anon");
  }

  function readDupDismiss() {
    try { return JSON.parse(localStorage.getItem(leadDupDismissKey()) || "[]"); } catch (e) { return []; }
  }

  function dupGroupKey(rows) {
    return (rows || []).map(function (r) { return String(r.id); }).sort().join("|");
  }

  function dismissDupGroup(rows) {
    var keys = readDupDismiss();
    var key = dupGroupKey(rows);
    if (keys.indexOf(key) < 0) keys.push(key);
    try { localStorage.setItem(leadDupDismissKey(), JSON.stringify(keys)); } catch (e) {}
  }

  function sourceBannerKey() {
    var u = Cloud.user && Cloud.user();
    return "fs_leads_src_banner:" + ((u && u.id) || "anon");
  }

  function readSourceBannerDismiss() {
    try { return JSON.parse(localStorage.getItem(sourceBannerKey()) || "{}"); } catch (e) { return {}; }
  }

  function dismissSourceBanner(kind, iso) {
    var map = readSourceBannerDismiss();
    map[kind] = iso || new Date().toISOString();
    try { localStorage.setItem(sourceBannerKey(), JSON.stringify(map)); } catch (e) {}
  }

  function newestIso(rows) {
    var latest = "";
    (rows || []).forEach(function (r) {
      var iso = r && r.created_at ? String(r.created_at) : "";
      if (iso && iso > latest) latest = iso;
    });
    return latest;
  }

  function sourceBannerHtml(kind, rows, one, many) {
    var n = (rows || []).length;
    if (!n) return "";
    var dismissed = readSourceBannerDismiss()[kind] || "";
    var newest = newestIso(rows);
    if (dismissed && newest && newest <= dismissed) return "";
    return '<div class="leads-grove-banner">' +
      '<p>' + n + (n === 1 ? one : many) + " Filter <strong>" +
      (kind === "grove" ? "Fresh Grove" : "Your site") +
      "</strong> to see just them.</p>" +
      '<button type="button" class="leads-banner-x" data-leads-src-dismiss="' + esc(kind) +
      '" data-leads-src-at="' + esc(newest) + '" aria-label="Dismiss">×</button></div>';
  }

  function absorbLeadFlags(keepId, dropIds) {
    var st = getState ? getState() : null;
    if (!st || !st.data) return;
    (dropIds || []).forEach(function (id) {
      var row = findLeadInCache(id) || { id: id };
      if (leadQuizOn(row, st)) rememberLocalLeadQuiz(st, keepId, true);
      if (leadHotOn(row, st)) rememberLocalLeadHot(st, keepId, true);
      if (st.data.leadQuizById) delete st.data.leadQuizById[id];
      if (st.data.leadHotById) delete st.data.leadHotById[id];
    });
    if (persist) persist();
  }

  function renderLeadsList(opts) {
    opts = opts || {};
    var list = $("leadsList");
    if (!list) return;
    var keepY = 0;
    if (!opts.force && window.FS.pageScrollY) keepY = window.FS.pageScrollY();
    var fieldFocus = document.activeElement;
    var editingLead = fieldFocus && fieldFocus.hasAttribute && list.contains(fieldFocus) &&
      (fieldFocus.hasAttribute("data-lead-notes") || fieldFocus.hasAttribute("data-lead-name-input"));
    if (editingLead && !opts.force) return;
    if (editingLead && opts.force) {
      try { fieldFocus.blur(); } catch (eBlur) {}
    }
    rememberOpenLeadMenus();
    syncLeadNotesFromDom();
    paintLeadsFilterTease();
    if (canSeeShelfPeople() && !shelfPeopleLoadedAt) {
      refreshShelfPeopleCache().then(function () { renderLeadsList({ force: true }); });
    }
    var q = (leadsSearchQ || "").trim().toLowerCase();
    var stLeads = getState ? getState() : null;
    var focusSearch = focusInfoZoom();
    var focusSearchOn = focusSearch ? localYmdFromIso(focusSearch.starts_at) : "";
    var rows = leadsCache.filter(function (r) {
      if (leadsFilter === "hot") {
        if (leadIsClosed(r)) return false;
        if (!leadHotOn(r, stLeads)) return false;
      } else if (leadsFilter === "grove") {
        if (leadIsClosed(r)) return false;
        if (r.source !== "grove") return false;
      } else if (leadsFilter === "site") {
        if (leadIsClosed(r)) return false;
        if (r.source !== "site") return false;
      } else if (leadsFilter === "quiz") {
        if (leadIsClosed(r)) return false;
        if (!leadQuizOn(r, stLeads)) return false;
      } else if (leadsFilter === "info") {
        if (leadIsClosed(r)) return false;
        var focusFilter = focusInfoZoom();
        var focusOn = focusFilter ? localYmdFromIso(focusFilter.starts_at) : "";
        if (!focusFilter || !focusOn || !infoNoteStatus(r.id, focusFilter.id, focusOn)) return false;
      } else if (leadsFilter === "products" || leadsFilter === "business" || leadsFilter === "both") {
        if (leadIsClosed(r)) return false;
        if (r.interest !== leadsFilter) return false;
      } else if (leadsFilter === "all") {
        if (leadIsClosed(r)) return false;
      } else if (r.status !== leadsFilter) {
        return false;
      }
      if (!q) return true;
      var blob = [
        r.name, r.email, r.phone, r.notes, r.interest, r.ig, r.visitor_notes,
        r.source === "grove" ? "fresh grove" : "",
        r.source === "site" ? "your site custom page landing" : "",
        interestLabel(r.interest), statusLabel(r.status),
        leadHotOn(r, stLeads) ? "hot" : "",
        leadQuizOn(r, stLeads) ? "quiz fresh match" : "",
        (function () {
          var st = focusSearch && focusSearchOn ? infoNoteStatus(r.id, focusSearch.id, focusSearchOn) : "";
          if (st === "attended") return "info zoom on the call attended";
          if (st === "invited") return "info zoom invited";
          return "";
        })()
      ].join(" ").toLowerCase();
      return blob.indexOf(q) >= 0;
    });
    rows.sort(function (a, b) {
      var aNew = a && a.status === "new" ? 1 : 0;
      var bNew = b && b.status === "new" ? 1 : 0;
      if (bNew !== aNew) return bNew - aNew;
      var at = a && a.created_at ? new Date(a.created_at).getTime() : 0;
      var bt = b && b.created_at ? new Date(b.created_at).getTime() : 0;
      if (isNaN(at)) at = 0;
      if (isNaN(bt)) bt = 0;
      return bt - at;
    });
    if (!rows.length) {
      var who = Cloud.user();
      if (q) {
        list.innerHTML = '<p class="leads-empty">No leads match “' + esc(leadsSearchQ.trim()) + '”. Try another name or clear search.</p>';
        return;
      }
      var total = leadsCache.length;
      var archivedN = 0;
      var joinedN = 0;
      for (var ai = 0; ai < leadsCache.length; ai++) {
        if (leadsCache[ai].status === "archived") archivedN++;
        if (leadsCache[ai].status === "joined") joinedN++;
      }
      if (!total) {
        if (leadsFetchError) {
          list.innerHTML = '<p class="leads-empty">' + esc(leadsFetchError) + "</p>";
          return;
        }
        var locked = who && who.email
          ? " Locked to <strong>" + esc(who.email) + "</strong>."
          : "";
        list.innerHTML = '<p class="leads-empty">No leads yet for this account.' + locked +
          ' Share your link, or tap <strong>Add a lead</strong> if you already have their info.</p>' +
          '<p class="leads-empty">If you had leads before, sign out and use the original email — a second account cannot see the first inbox.</p>';
        return;
      }
      if (leadsFilter === "hot") {
        list.innerHTML = '<p class="leads-empty">No hot leads right now. Tap the fire on a card to light one up.</p>';
        return;
      }
      if (leadsFilter === "grove") {
        list.innerHTML = '<p class="leads-empty">Nobody from The Fresh Grove yet. Share your business-info link from Your pages to share above.</p>';
        return;
      }
      if (leadsFilter === "site") {
        list.innerHTML = '<p class="leads-empty">Nobody from your custom landing page yet. When someone joins the list there, they’ll show up here too.</p>';
        return;
      }
      if (leadsFilter === "quiz") {
        list.innerHTML = '<p class="leads-empty">Nobody marked as took The Fresh Match yet. Use the Quiz dropdown on a card.</p>';
        return;
      }
      if (leadsFilter === "info") {
        list.innerHTML = '<p class="leads-empty">Nobody marked for this Info Zoom yet. Invite from a lead card, or from the Info Zoom card.</p>';
        return;
      }
      if (leadsFilter === "products") {
        list.innerHTML = '<p class="leads-empty">Nobody tagged for products right now. Use the Products / Business / Both tag on a card.</p>';
        return;
      }
      if (leadsFilter === "business") {
        list.innerHTML = '<p class="leads-empty">Nobody tagged for business right now. Use the Products / Business / Both tag on a card.</p>';
        return;
      }
      if (leadsFilter === "both") {
        list.innerHTML = '<p class="leads-empty">Nobody tagged for both products and business right now. Use the tag on a card.</p>';
        return;
      }
      if (leadsFilter === "fb") {
        list.innerHTML = '<p class="leads-empty">Nobody marked as invited to the FB group yet. Tap <strong>Invited to FB group</strong> on their card when they’re in.</p>';
        return;
      }
      if (leadsFilter === "joined") {
        list.innerHTML = '<p class="leads-empty">Nobody marked as joined the grove yet. When they plug into First Seeds, tap <strong>Joined the grove</strong> on their card.</p>';
        return;
      }
      if (leadsFilter === "all" && (archivedN || joinedN)) {
        var closedBits = [];
        if (joinedN) closedBits.push("<strong>Joined</strong> for people in the grove");
        if (archivedN) closedBits.push("<strong>Archived</strong> for the ones you put away");
        list.innerHTML = '<p class="leads-empty">No open leads — check ' + closedBits.join(", and ") + ".</p>";
        return;
      }
      list.innerHTML = '<p class="leads-empty">No leads in <strong>' + esc(statusLabel(leadsFilter)) + '</strong> right now. Try All, or another tab.</p>';
      return;
    }
    var html = "";
    if (leadsFilter === "all" && !q) {
      var groveNew = [];
      var siteNew = [];
      leadsCache.forEach(function (row) {
        if (!row || leadIsClosed(row) || row.status !== "new") return;
        if (row.source === "grove") groveNew.push(row);
        if (row.source === "site") siteNew.push(row);
      });
      html += sourceBannerHtml(
        "grove", groveNew,
        " new person found you on The Fresh Grove.",
        " new people found you on The Fresh Grove."
      );
      html += sourceBannerHtml(
        "site", siteNew,
        " new person joined from your custom page.",
        " new people joined from your custom page."
      );
      var dupGone = readDupDismiss();
      findLeadDupGroups(leadsCache).forEach(function (pack) {
        if (dupGone.indexOf(dupGroupKey(pack)) >= 0) return;
        var keep = pickLeadKeep(pack);
        var dropIds = pack.filter(function (r) { return r.id !== keep.id; }).map(function (r) { return r.id; });
        html += '<div class="leads-dup-banner">';
        html += "<p><strong>" + esc(keep.name) + "</strong> is listed " + pack.length +
          " times. Combine into one card — notes, Both, and how far you’ve gotten stay.</p>";
        html += '<div class="leads-dup-actions">';
        html += '<button type="button" class="btn leads-dup-combine" data-leads-merge="' +
          esc(keep.id) + '" data-leads-merge-drop="' + esc(dropIds.join(",")) + '">Combine</button>';
        html += '<button type="button" class="btn-ghost" data-leads-dup-dismiss="' +
          esc(dupGroupKey(pack)) + '">Not the same person</button>';
        html += "</div></div>";
      });
    }
    var allMatched = rows;
    if (leadsListLimit < rows.length) {
      rows = rows.slice(0, leadsListLimit);
    }
    var tourLeadId = "";
    for (var ti = 0; ti < rows.length; ti++) {
      if (rows[ti].status === "new") {
        tourLeadId = rows[ti].id;
        break;
      }
    }
    if (!tourLeadId) {
      for (var tj = 0; tj < rows.length; tj++) {
        if (rows[tj].status === "reached" || rows[tj].status === "talking" || rows[tj].status === "fb") {
          tourLeadId = rows[tj].id;
          break;
        }
      }
    }
    if (!tourLeadId && rows[0]) tourLeadId = rows[0].id;

    rows.forEach(function (r) {
      var when = "";
      try {
        var d = new Date(r.created_at);
        when = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      } catch (e) {}
      var contactLines = [];
      if (r.email) contactLines.push(esc(r.email));
      if (r.phone) contactLines.push(esc(r.phone));
      var opener = leadOpenerFor(r);
      var sms = leadSmsHref(r.phone, opener);
      var mail = leadMailHref(r.email, opener, r.name, r.interest);
      var notes = r.notes || "";
      var folds = leadFoldOpen[r.id] || {};
      var moveOpen = !!folds.move;
      var notesOpen = !!folds.notes;
      var moreOpen = !!folds.more || leadHighlightId === r.id;
      var hasNote = !!(notes && String(notes).trim());
      var tourCard = r.id === tourLeadId;

      html += '<article class="leads-card' +
        (r.status === "new" ? " is-new" : "") +
        (r.status === "joined" ? " is-joined" : "") +
        (r.status === "fb" ? " is-fb" : "") +
        (leadHotOn(r, stLeads) ? " is-hot" : "") +
        (leadHighlightId === r.id ? " is-focus" : "") +
        (moreOpen ? " is-open" : "") +
        '" data-lead-card="' + esc(r.id) + '"' +
        (tourCard ? ' data-leads-tour="card"' : "") + ">";
      html += '<div class="leads-card-head">';
      html += '<div class="leads-card-head-main">';
      html += '<div class="leads-card-name-row">';
      html += leadHotBtnHtml(r);
      if (leadNameEditingId === r.id) {
        html += '<div class="leads-name-edit">';
        html += '<label class="sr-only" for="lead-name-' + esc(r.id) + '">Lead name</label>';
        html += '<input type="text" class="leads-name-input" id="lead-name-' + esc(r.id) + '" data-lead-name-input="' +
          esc(r.id) + '" maxlength="120" value="' + esc(leadNameDraft || r.name || "") +
          '" autocomplete="name" spellcheck="false">';
        html += '<div class="leads-name-edit-actions">';
        html += '<button type="button" class="leads-action is-primary" data-lead-save-name="' + esc(r.id) + '">Save name</button>';
        html += '<button type="button" class="leads-action is-quiet" data-lead-cancel-name="' + esc(r.id) + '">Cancel</button>';
        html += '<button type="button" class="leads-action is-quiet is-delete" data-lead-delete="' + esc(r.id) + '">Delete</button>';
        html += "</div></div>";
      } else {
        html += '<div class="leads-card-name-wrap">';
        html += '<div class="leads-card-name">' + esc(r.name) + "</div>";
        html += '<button type="button" class="leads-name-edit-btn" data-lead-edit-name="' + esc(r.id) +
          '" title="Edit name" aria-label="Edit name for ' + esc(r.name) + '">Edit</button>';
        html += '<button type="button" class="leads-name-edit-btn is-delete" data-lead-delete="' + esc(r.id) +
          '" title="Delete lead" aria-label="Delete ' + esc(r.name) + '">Delete</button>';
        html += "</div>";
      }
      html += "</div>";
      html += '<div class="leads-card-tags leads-card-tags-below">' + leadInterestDropdownHtml(r);
      if (r.source === "grove") html += '<span class="leads-pill is-grove">Fresh Grove</span>';
      if (r.source === "site") html += '<span class="leads-pill is-site">Your site</span>';
      html += leadStatusDropdownHtml(r, leadNameEditingId !== r.id && tourCard);
      html += leadQuizDropdownHtml(r);
      if (canSeeShelfPeople() && r.email && shelfPersonForEmail(r.email)) {
        html += '<span class="leads-pill is-shelf">On their shelf</span>';
      }
      html += "</div></div>";
      html += '<button type="button" class="leads-card-more-btn' + (moreOpen ? " is-open" : "") +
        '" data-lead-more="' + esc(r.id) + '" aria-expanded="' + (moreOpen ? "true" : "false") +
        '" aria-controls="lead-more-' + esc(r.id) + '" aria-label="' +
        (moreOpen ? "Hide details for " : "Show details for ") + esc(r.name) + '">';
      html += '<span class="leads-expand-mark" aria-hidden="true"></span></button></div>';
      if (!(moreOpen || tourCard)) {
        html += "</article>";
        return;
      }
      html += '<div class="leads-card-rest" id="lead-more-' + esc(r.id) + '"' + (moreOpen ? "" : " hidden") + ">";
      var focusEv = focusInfoZoom();
      var focusOn = focusEv ? localYmdFromIso(focusEv.starts_at) : "";
      var infoSt = (focusEv && focusOn) ? infoNoteStatus(r.id, focusEv.id, focusOn) : "";
      var inviteHtml = leadIsOpen(r) ? leadInfoInviteRowHtml(r.id, focusEv) : "";
      if (contactLines.length || inviteHtml || when || infoSt || r.ig || r.source === "grove" || r.source === "site") {
        html += '<div class="leads-card-mid' + (inviteHtml && !contactLines.length && !when && !infoSt && !r.ig && r.source !== "grove" && r.source !== "site" ? " is-invite-only" : "") + '">';
        if (contactLines.length || when || infoSt || r.ig || r.source === "grove" || r.source === "site") {
          html += '<div class="leads-card-contact">';
          contactLines.forEach(function (line) {
            html += '<div class="leads-card-meta-line">' + line + "</div>";
          });
          if (r.source === "grove" || r.source === "site" || r.ig) {
            html += '<div class="leads-card-ig">';
            html += r.source === "grove" ? "Found you on The Fresh Grove" : (r.source === "site" ? "Came from your custom page" : "");
            if (r.ig) {
              html += (r.source === "grove" || r.source === "site" ? " · " : "") + esc(socialLabel(r.ig));
            }
            html += "</div>";
          }
          if (r.visitor_notes) {
            html += '<p class="leads-visitor-note">' + esc(r.visitor_notes) + "</p>";
          }
          if (when || infoSt) {
            html += '<div class="leads-card-when">';
            if (when) html += esc(when);
            if (infoSt) {
              if (when) html += " · ";
              html += '<button type="button" class="leads-info-chip is-' + esc(infoSt) +
                '" data-lead-info-cycle="' + esc(r.id) + '" title="' +
                (infoSt === "attended" ? "On the call — tap to set back to invited" : "Invited — tap to mark on the call") + '">' +
                (infoSt === "attended" ? "On the call" : "Invited") + "</button>";
            }
            html += "</div>";
          }
          html += "</div>";
        }
        if (inviteHtml) html += '<div class="leads-card-invite">' + inviteHtml + "</div>";
        html += "</div>";
      }

      if (leadIsOpen(r)) {
        html += '<details class="leads-fold"' + (moveOpen ? " open" : "") + ' data-lead-fold="move" data-lead-fold-id="' + esc(r.id) + '"' +
          (tourCard ? ' data-leads-tour="send"' : "") + ">";
        html += '<summary class="leads-fold-sum">';
        html += '<span class="leads-fold-sum-row">';
        html += '<span class="leads-fold-title">Send a message</span>';
        html += '<span class="leads-expand-mark" aria-hidden="true"></span>';
        html += "</span></summary>";
        html += '<div class="leads-fold-body">';
        html += '<div class="leads-coach">';
        html += '<p class="leads-opener">' + esc(opener) + "</p>";
        html += '<div class="leads-reach"' + (tourCard ? ' data-leads-tour="reach"' : "") + ">";
        if (sms) {
          html += '<a class="leads-reach-btn is-primary" data-lead-reach="' + esc(r.id) + '" href="' + esc(sms) + '">Text</a>';
        }
        if (mail) {
          html += '<a class="leads-reach-btn' + (sms ? "" : " is-primary") + '" data-lead-reach="' + esc(r.id) + '" href="' + esc(mail) + '">Email</a>';
        }
        html += '<button type="button" class="leads-reach-btn" data-lead-copy="' + esc(r.id) + '">Copy</button>';
        if (canSeeShelfPeople() && r.email && window.FS.uniqueClientDoorsOn && window.FS.uniqueClientDoorsOn()) {
          html += '<button type="button" class="leads-reach-btn" data-lead-shelf-door="' + esc(r.id) + '">Unique door</button>';
        }
        html += '<button type="button" class="leads-reach-btn is-quiet" data-lead-shuffle="' + esc(r.id) + '"' +
          (tourCard ? ' data-leads-tour="shuffle"' : "") + ">Another</button>";
        html += "</div>";
        html += '<div class="leads-deeper">';
        if (r.interest === "business" || r.interest === "both" || !interestIsSet(r.interest)) {
          html += '<button type="button" class="leads-deep-link" data-goto="talk">Talking fresh →</button>';
        }
        if (r.interest === "products" || r.interest === "both" || !interestIsSet(r.interest)) {
          html += '<button type="button" class="leads-deep-link" data-goto="products">Find a product to share →</button>';
        }
        html += "</div></div>";
        html += "</div></details>";
      }

      html += '<details class="leads-fold"' + (notesOpen ? " open" : "") + ' data-lead-fold="notes" data-lead-fold-id="' + esc(r.id) + '"' +
        (tourCard ? ' data-leads-tour="notes"' : "") + ">";
      html += '<summary class="leads-fold-sum">';
      html += '<span class="leads-fold-sum-row">';
      html += '<span class="leads-fold-title">' + (hasNote ? "Notes" : "Tap to add a note") + "</span>";
      html += '<span class="leads-expand-mark" aria-hidden="true"></span>';
      html += "</span></summary>";
      html += '<div class="leads-fold-body">';
      html += '<div class="leads-notes">';
      html += '<label class="sr-only" for="lead-note-' + esc(r.id) + '">Notes</label>';
      html += '<textarea class="leads-notes-input" id="lead-note-' + esc(r.id) + '" data-lead-notes="' + esc(r.id) +
        '" rows="2" maxlength="2000" placeholder="What they said, what you sent, anything to remember…">' +
        esc(notes) + "</textarea>";
      html += '<p class="leads-notes-status" data-lead-notes-status="' + esc(r.id) + '" hidden></p>';
      html += "</div></div></details>";

      if (leadIsOpen(r)) {
        var followSt = getState ? getState() : null;
        var followOn = leadFollowOn(r, followSt);
        var quietN = leadFollowQuietDays(followSt);
        html += '<label class="leads-follow-row">';
        html += '<span class="s-txt"><strong>Calendar reminder</strong><span>After ' + quietN +
          " days without an update, their name shows on today in Calendar. Not a notification, and not an event you add.</span></span>";
        html += '<input type="checkbox" class="switch" data-lead-follow="' + esc(r.id) + '"' + (followOn ? " checked" : "") + ">";
        html += "</label>";
      }

      html += "</div></article>";
    });
    if (allMatched.length > rows.length) {
      html += '<button type="button" class="btn-ghost leads-more-btn" data-leads-more="' +
        Math.min(allMatched.length, leadsListLimit + LEADS_PAGE) +
        '">Show more · ' + (allMatched.length - rows.length) + " left</button>";
    }
    list.innerHTML = html;
    leadFoldIgnoreToggle = Date.now() + 400;
    list.querySelectorAll("details.leads-fold").forEach(function (el) {
      var id = el.getAttribute("data-lead-fold-id");
      var key = el.getAttribute("data-lead-fold");
      el.open = !!(leadFoldOpen[id] && leadFoldOpen[id][key]);
    });
    if (leadHighlightId) {
      var focusCard = list.querySelector('[data-lead-card="' + leadHighlightId + '"]');
      if (focusCard && focusCard.scrollIntoView) {
        setTimeout(function () {
          try { focusCard.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (eSc) {}
        }, 80);
      }
      if (leadHighlightTimer) clearTimeout(leadHighlightTimer);
      leadHighlightTimer = setTimeout(function () {
        leadHighlightId = "";
        leadHighlightTimer = 0;
        var stale = document.querySelector("#leadsList .leads-card.is-focus");
        if (stale) stale.classList.remove("is-focus");
      }, 4000);
    } else if (keepY > 0 && window.FS.setPageScrollY) {
      window.FS.setPageScrollY(keepY);
    }
  }

  function prepareLeadsTourTarget(tip) {
    if (!tip) return;
    if (tip.openLeadsFilters) {
      var filterFold = $("leadsFilterFold");
      if (filterFold) filterFold.open = true;
    }
    var card = document.querySelector('#leadsList [data-leads-tour="card"]');
    if (!card) return;
    var send = card.querySelector('[data-leads-tour="send"]');
    var notes = card.querySelector('[data-leads-tour="notes"]');
    var rest = card.querySelector(".leads-card-rest");
    var moreBtn = card.querySelector("[data-lead-more]");
    function openFold(el, key) {
      if (!el) return;
      el.open = true;
      var id = el.getAttribute("data-lead-fold-id");
      if (!id) return;
      if (!leadFoldOpen[id]) leadFoldOpen[id] = {};
      leadFoldOpen[id][key] = true;
    }
    if (tip.openLeadSend || tip.openLeadNotes) {
      var moreId = card.getAttribute("data-lead-card");
      setLeadMore(moreId, true);
      card.classList.add("is-open");
      if (rest) rest.hidden = false;
      if (moreBtn) {
        moreBtn.classList.add("is-open");
        moreBtn.setAttribute("aria-expanded", "true");
      }
    }
    if (tip.openLeadSend) openFold(send, "move");
    if (tip.openLeadNotes) openFold(notes, "notes");
  }

  async function renderLeads() {
    var gate = $("leadsGate");
    var studio = $("leadsStudio");
    if (!gate || !studio) return;
    var run = ++leadsRun;
    renderIdealLeadsList();
    var user = Cloud.user();
    if (!user) {
      gate.hidden = false;
      studio.hidden = true;
      leadsCache = [];
      renderLeadsList();
      renderIdealLeadsList();
      paintNavBadge("leads", 0);
      return;
    }
    gate.hidden = true;
    studio.hidden = false;
    applyPendingLeadsFocus();
    var modeNote = $("leadsModeNote");
    if (modeNote) {
      if (Cloud.mode() === "local") {
        modeNote.hidden = false;
        modeNote.textContent = "Local demo mode: leads stay in this browser only. Connect Supabase (and run supabase/leads.sql + leads-harden-ownership.sql) so each partner’s page works for real visitors.";
      } else {
        modeNote.hidden = true;
        modeNote.textContent = "";
      }
    }
    var st = getState ? getState() : null;
    var preferred = (st && st.settings && st.settings.partnerName) || user.display_name || "";
    var msg = $("leadsSlugMsg");
    if (msg) msg.textContent = "";

    /* Inbox must load even if slug claim hiccups — otherwise a sign-in
       glitch looks like “all my leads disappeared.” Always scoped to auth.uid. */
    try {
      var keepNotes = {};
      var noteEls = document.querySelectorAll("[data-lead-notes]");
      for (var ni = 0; ni < noteEls.length; ni++) {
        var nid = noteEls[ni].getAttribute("data-lead-notes");
        if (nid) keepNotes[nid] = noteEls[ni].value || "";
      }
      var rows = await Cloud.listMyLeads();
      if (run !== leadsRun) return;
      /* Defense: never show another partner’s rows if a bad client somehow returns them */
      leadsCache = rows.filter(function (r) {
        return !r.partner_id || r.partner_id === user.id;
      });
      leadsCache.forEach(function (r) {
        if (r && keepNotes.hasOwnProperty(r.id)) r.notes = keepNotes[r.id];
      });
      leadsFetchError = "";
      try { await refreshOrgEvents(); } catch (eEv) {}
      try { await refreshLeadInfoNotes(); } catch (eNotes) {}
      if (run !== leadsRun) return;
      renderLeadsList();
      renderIdealLeadsList();
      var nNew = 0;
      leadsCache.forEach(function (r) { if (r.status === "new") nNew++; });
      paintNavBadge("leads", nNew);
      if (typeof window.FS.maybeStartLeadsTour === "function") {
        window.FS.maybeStartLeadsTour(leadsCache.length);
      }
    } catch (err) {
      if (run !== leadsRun) return;
      console.warn("[First Seeds] listMyLeads:", err);
      leadsFetchError = (err && err.message) ||
        ("Could not load the inbox for " + (user.email || "this account") + ". Sign out and back in with the email that owns your leads.");
      renderLeadsList();
      renderIdealLeadsList();
      if (msg) {
        msg.textContent = leadsFetchError;
      }
      paintNavBadge("leads", 0);
    }

    try {
      var slug = await Cloud.ensureLeadSlug(preferred);
      if (run !== leadsRun) return;
      syncLeadsShareUI(slug);
      var blurb = $("leadsBlurbInput");
      if (blurb && document.activeElement !== blurb) {
        var st2 = getState ? getState() : null;
        var story = st2 && st2.data ? (st2.data.page_story || "").trim() : "";
        blurb.value = user.lead_blurb || story || "";
      }
      var thanks = $("leadsThanksInput");
      if (thanks && document.activeElement !== thanks) {
        thanks.value = user.lead_thanks || Cloud.DEFAULT_LEAD_THANKS || "";
      }
    } catch (err) {
      if (run !== leadsRun) return;
      console.warn("[First Seeds] ensureLeadSlug:", err);
      syncLeadsShareUI(user.lead_slug || "");
      if (msg && !msg.textContent) {
        msg.textContent = (err && err.message) || "Could not set up your share link — try Save link again.";
      }
    }
    applyPendingLeadsFocus();
  }

  function applyPendingLeadsFocus() {
    var id = window.FS && window.FS.pendingLeadsFocus;
    if (!id) return;
    var fold = $("leadsPagesFold");
    if (fold) {
      fold.open = true;
      try { localStorage.setItem("fs_leads_pages_open", "1"); } catch (e) {}
      syncLeadsPagesGo(fold);
    }
    if (id === "leadsBlurbInput" || id === "leadsPageSettings" || id === "leadsThanksInput") {
      var settings = $("leadsPageSettings");
      var gear = $("leadsPageSettingsBtn");
      if (settings) settings.hidden = false;
      if (gear) {
        gear.classList.add("on");
        gear.setAttribute("aria-expanded", "true");
      }
    }
    var el = $(id);
    if (!el) return;
    el.classList.add("is-goto-focus");
    setTimeout(function () {
      el.classList.remove("is-goto-focus");
    }, 2200);
    setTimeout(function () {
      if (window.FS && window.FS.pendingLeadsFocus === id) window.FS.pendingLeadsFocus = "";
      try {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      } catch (e2) {
        try { el.scrollIntoView(true); } catch (e3) {}
      }
      if (id === "leadsBlurbInput") {
        try { el.focus(); } catch (e4) {}
      }
    }, 160);
  }

  function wipePrivateCaches() {
    leadsCache = [];
    leadFollowCache = [];
    leadInfoNotesCache = [];
    leadInfoNotesLoaded = false;
    lastLeaderSnap = null;
    teamPersonCache = {};
    adminProfileCache = [];
    evProgressCache = {};
    supportProfileByPartner = {};
    groveHubCache = { at: 0, data: null };
    evBoardCache = { at: 0, data: null };
    howGrowBoardCache = { at: 0, rows: null };
    howGrowBoardOpen = false;
    orgEventsCache = [];
    orgEventsLoadedAt = 0;
    groveShareCache = [];
    groveShareLoadedAt = 0;
    groveShelfFiles = [];
    if (Cloud.invalidateOrgEventsNet) Cloud.invalidateOrgEventsNet();
  }

  var afterAuthInflight = null;

  async function afterAuth() {
    if (afterAuthInflight) return afterAuthInflight;
    afterAuthInflight = afterAuthCore().then(function () {
      afterAuthInflight = null;
    }, function (err) {
      afterAuthInflight = null;
      throw err;
    });
    return afterAuthInflight;
  }

  async function afterAuthCore() {
    renderAuthChrome();
    if (typeof window.FS.applyPackChrome === "function") {
      try { window.FS.applyPackChrome(); } catch (e) {}
    }
    if (!Cloud.isSignedIn()) {
      wipePrivateCaches();
      /* Only Log out should swap to the empty guest bucket. A session
         blip used to paint blank answers over last night's work. */
      if (bindProgressAccount && Cloud.choseSignOut && Cloud.choseSignOut()) {
        try { bindProgressAccount(""); } catch (e) {}
      }
      paintNavBadge("leads", 0);
      paintNavBadge("team", 0);
      refreshGroveBoardPip();
      await renderCheers();
      await renderSupportBanner();
      await renderLeaderNoteBanner();
      var signedOutActive = getState && getState().active;
      if (signedOutActive === "leader") await renderLeader();
      if (signedOutActive === "ev-team") await renderEvergreenTeamGraph();
      if (signedOutActive === "leads") await renderLeads();
      if (signedOutActive === "calendar" || signedOutActive === "tend") {
        if (!document.body.classList.contains("cal-sheet-open")) renderCalendar();
      }
      if (groveBoardPanelOpen()) await renderGroveBoard();
      if (typeof window.FS.onAuthReady === "function") {
        try { window.FS.onAuthReady(null); } catch (e) {}
      }
      return;
    }
    if (bindProgressAccount && Cloud.user()) {
      try { bindProgressAccount(Cloud.user().id); } catch (e) {}
    }
    try {
      hydrateOrgEventsFromStore();
      renderGatheringBanner();
    } catch (eCache) {}
    if (typeof window.FS.onAuthReady === "function") {
      try { window.FS.onAuthReady(Cloud.user()); } catch (e) {}
    }
    try {
      await refreshOrgEvents(false);
      renderGatheringBanner();
    } catch (eDates) {}
    finishAfterAuthBackground();
    try {
      var skipped = sessionStorage.getItem("fs_join_skipped");
      if (skipped === "already" || skipped === "other") {
        sessionStorage.removeItem("fs_join_skipped");
        var skipName = "";
        try { skipName = sessionStorage.getItem("fs_join_skipped_name") || ""; } catch (eName) {}
        try { sessionStorage.removeItem("fs_join_skipped_name"); } catch (eName2) {}
        var skipEl = $("lockToast");
        if (skipEl) {
          var skipMsg = skipName
            ? "You’re already on " + esc(skipName) + "’s team, so this other join link wasn’t used."
            : "You’re already on a team, so this other join link wasn’t used.";
          skipEl.hidden = false;
          skipEl.innerHTML =
            '<div class="lock-toast-inner">' +
            "<p>" + skipMsg + "</p>" +
            '<div class="lock-toast-actions">' +
            '<button type="button" class="lock-toast-x" id="lockToastClose" aria-label="Dismiss">×</button>' +
            "</div></div>";
        }
      }
    } catch (e) {}
  }

  function finishAfterAuthBackground() {
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) return;
    if (Cloud.ensureLeadSlug && !packEvergreen()) {
      try {
        var slugUser = Cloud.user() || {};
        if (!slugUser.lead_slug) {
          var slugPreferred = slugUser.display_name || "";
          if (getState) {
            var slugSt = getState();
            slugPreferred = (slugSt && slugSt.settings && slugSt.settings.partnerName) || slugPreferred;
          }
          var groveLeader = !!(Cloud.isOrgAdmin && Cloud.isOrgAdmin());
          var taylor = !!(Cloud.isSuperAdmin && Cloud.isSuperAdmin());
          if (groveLeader || taylor) {
            Cloud.ensureLeadSlug(slugPreferred).catch(function () {});
          }
        }
      } catch (eSlug) {
        console.warn("[First Seeds] ensureLeadSlug:", eSlug);
      }
    }
    if (Cloud.touchActive) Cloud.touchActive().catch(function () {});
    renderCheers().catch(function () {});
    renderSupportBanner().catch(function () {});
    renderLeaderNoteBanner().catch(function () {});
    var st = getState ? getState() : null;
    var active = st && st.active;
    if (active === "leader") {
      renderLeader().catch(function () {});
    }
    if (active === "calendar" || active === "tend") {
      if (!document.body.classList.contains("cal-sheet-open")) {
        try { renderCalendar(); } catch (eCal) {}
      }
    }
    if (active === "leads") {
      renderLeads().catch(function () {});
    } else if (!packEvergreen()) {
      Cloud.countNewLeads().then(function (n) {
        paintNavBadge("leads", n);
      }).catch(function () {});
    }
    if (active === "leader" || active === "ev-team") {
      refreshTeamBadge().catch(function () {});
    } else {
      setTimeout(function () {
        if (Cloud.isSignedIn && Cloud.isSignedIn()) refreshTeamBadge().catch(function () {});
      }, 12000);
    }
  }

  function wireAuthPasswordReset() {
    if (!Cloud.bindPasswordResetUi || window.FS._authReset) return;
    window.FS._authReset = Cloud.bindPasswordResetUi({
      hideIds: ["authSignFields", "authSignHint", "authForgotBtn"],
      paneId: "authResetPane",
      emailId: "authResetEmail",
      codeId: "authResetCode",
      passId: "authResetPass",
      pass2Id: "authResetPass2",
      emailWrapId: "authResetEmailWrap",
      codeWrapId: "authResetCodeWrap",
      passWrapId: "authResetPassWrap",
      pass2WrapId: "authResetPass2Wrap",
      sendBtnId: "authResetSendBtn",
      verifyBtnId: "authResetVerifyBtn",
      saveBtnId: "authResetSaveBtn",
      resendBtnId: "authResetResendBtn",
      backBtnId: "authResetBackBtn",
      forgotBtnId: "authForgotBtn",
      signInEmailId: "authEmail",
      msgId: "authMsg",
      titleId: "authTitle",
      eyebrowId: "authEyebrow",
      bodyId: "authLead",
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
      onClose: function () {
        var title = $("authTitle");
        var eyebrow = $("authEyebrow");
        var lead = $("authLead");
        if (eyebrow) eyebrow.textContent = "First Seeds";
        if (title) title.textContent = "Save your progress";
        if (lead) lead.textContent = "Sign in with email + password so your story and calendar stay with you — and so your leader can see how you're doing (progress only, no chat).";
      },
      onDone: async function () {
        await mergeCloudProgressQueued();
        closeAuth();
        await afterAuth();
      }
    });
  }

  function wire() {
    if (wired) return;
    wired = true;
    wireAuthPasswordReset();
    var authOverlay = $("authOverlay");
    if (authOverlay) {
      authOverlay.addEventListener("click", function (e) {
        if (e.target !== authOverlay) return;
        if (window.FS.dismissGuarded && window.FS.dismissGuarded()) return;
        closeAuth();
      });
    }
    var idealForm = $("idealLeadsAddForm");
    if (idealForm) {
      idealForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var api = idealLeadsApi();
        var input = $("idealLeadName");
        if (!api || !input) return;
        var name = (input.value || "").trim();
        if (!name) return;
        api.add(name, idealAddLane);
        input.value = "";
        persist();
        renderIdealLeadsList();
      });
    }
    var manualForm = $("leadsManualForm");
    var manualInFlight = false;
    if (manualForm) {
      manualForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (manualInFlight) return;
        var msg = $("leadsManualMsg");
        var nameEl = $("leadsManualName");
        var phoneEl = $("leadsManualPhone");
        var emailEl = $("leadsManualEmail");
        var socialEl = $("leadsManualSocial");
        var saveBtn = manualForm.querySelector(".leads-manual-save");
        var interestBtn = manualForm.querySelector("[data-manual-interest].on");
        var name = nameEl ? (nameEl.value || "").trim() : "";
        var phone = phoneEl ? (phoneEl.value || "").trim() : "";
        var email = emailEl ? (emailEl.value || "").trim() : "";
        var social = socialEl ? (socialEl.value || "").trim() : "";
        var interest = interestBtn ? interestBtn.getAttribute("data-manual-interest") : "products";
        if (msg) msg.textContent = "";
        if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
          openAuth(true);
          return;
        }
        if (email && email.indexOf("@") < 1) {
          if (msg) msg.textContent = "That email doesn’t look right.";
          return;
        }
        manualInFlight = true;
        try {
          if (saveBtn) saveBtn.disabled = true;
          var row = await Cloud.addOwnLead({
            name: name,
            phone: phone,
            email: email,
            ig: social,
            interest: interest,
            status: "talking"
          });
          if (row) {
            leadsCache = [row].concat(leadsCache.filter(function (r) { return r.id !== row.id; }));
          } else {
            leadsCache = await Cloud.listMyLeads();
          }
          if (nameEl) nameEl.value = "";
          if (phoneEl) phoneEl.value = "";
          if (emailEl) emailEl.value = "";
          if (socialEl) socialEl.value = "";
          if (msg) {
            var addedAt = row && row.created_at ? new Date(row.created_at).getTime() : 0;
            var already = addedAt && (Date.now() - addedAt > 8000);
            msg.textContent = already
              ? "Already in your inbox — we updated that card instead of adding another."
              : "Added to inbox.";
          }
          leadsFilter = "all";
          leadsListLimit = LEADS_PAGE;
          var filterBtns = document.querySelectorAll("[data-leads-filter]");
          for (var fi = 0; fi < filterBtns.length; fi++) {
            filterBtns[fi].classList.toggle("on", filterBtns[fi].getAttribute("data-leads-filter") === "all");
          }
          renderLeadsList();
          var nNew = 0;
          leadsCache.forEach(function (r) { if (r.status === "new") nNew++; });
          paintNavBadge("leads", nNew);
        } catch (err) {
          if (msg) msg.textContent = (err && err.message) || "Could not add this lead.";
        } finally {
          manualInFlight = false;
          if (saveBtn) saveBtn.disabled = false;
        }
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var moveSheet = $("teamMoveSheet");
        if (moveSheet && !moveSheet.hidden) {
          closeTeamMoveSheet();
          return;
        }
        var personSheet = $("teamPersonSheet");
        if (personSheet && !personSheet.hidden) {
          closeTeamPersonSheet();
          return;
        }
        var growSheet = $("howTheyGrowSheet");
        if (growSheet && !growSheet.hidden) {
          closeHowTheyGrowSheet();
          return;
        }
        var cheer = $("cheerSheet");
        if (cheer && !cheer.hidden) {
          closeCheerSheet();
          return;
        }
        var note = $("noteSheet");
        if (note && !note.hidden) {
          closeNoteSheet();
          return;
        }
        var broadcast = $("broadcastSheet");
        if (broadcast && !broadcast.hidden) {
          closeBroadcastSheet();
          return;
        }
        var box = $("curiosityLightbox");
        if (box && !box.hidden) {
          closeCuriosityLightbox();
          return;
        }
        var calSheet = $("calSheet");
        if (calSheet && !calSheet.hidden) {
          closeCalSheet();
          return;
        }
      }
      if (e.key === "Enter" || e.key === " ") {
        var calSel = e.target && e.target.closest ? e.target.closest("[data-cal-select]") : null;
        if (calSel && calSel.getAttribute("role") === "button" && e.target === calSel) {
          e.preventDefault();
          calSel.click();
          return;
        }
      }
      if (e.key !== "Enter") return;
      var overlay = $("authOverlay");
      if (!overlay || !overlay.classList.contains("open")) return;
      if (document.activeElement && (document.activeElement.id === "authPassword" || document.activeElement.id === "authEmail")) {
        e.preventDefault();
        var sb = lastAuthIntent === "create" ? $("authCreateBtn") : $("authSubmitBtn");
        if (sb) sb.click();
      }
    });
    document.addEventListener("toggle", function (e) {
      var t = e.target;
      if (!t || t.tagName !== "DETAILS" || !getState) return;
      var st = getState();
      if (!st) return;
      if (!st.data) st.data = {};
      if (t.hasAttribute("data-leader-col")) {
        if (!st.data.leaderColOpen) st.data.leaderColOpen = {};
        st.data.leaderColOpen[t.getAttribute("data-leader-col")] = !!t.open;
        persist();
        return;
      }
      if (t.hasAttribute("data-leader-card")) {
        if (!st.data.leaderCardOpen) st.data.leaderCardOpen = {};
        st.data.leaderCardOpen[t.getAttribute("data-leader-card")] = !!t.open;
        persist();
        return;
      }
      if (t.hasAttribute("data-lead-fold") && t.hasAttribute("data-lead-fold-id")) {
        if (Date.now() < leadFoldIgnoreToggle) return;
        var foldId = t.getAttribute("data-lead-fold-id");
        var foldKey = t.getAttribute("data-lead-fold");
        if (!leadFoldOpen[foldId]) leadFoldOpen[foldId] = {};
        /* iOS can toggle <details> shut when the keyboard opens on the notes field. */
        if (foldKey === "notes" && !t.open) {
          var notesEl = document.getElementById("lead-note-" + foldId);
          if (notesEl && document.activeElement === notesEl) {
            t.open = true;
            leadFoldOpen[foldId][foldKey] = true;
            return;
          }
        }
        leadFoldOpen[foldId][foldKey] = !!t.open;
      }
      if (t.hasAttribute("data-info-guest-picker")) {
        infoGuestPicker.open = !!t.open;
      }
    }, true);

    document.addEventListener("change", function (e) {
      var t = e.target;
      if (t && t.id === "bulletinGo") {
        bulletinGoDraft = t.value || "";
        return;
      }
      if (!t || !t.hasAttribute("data-poll-opt")) return;
      var pollId = t.getAttribute("data-poll-opt");
      var id = t.value;
      var single = t.getAttribute("data-poll-choice") === "single" || t.type === "radio";
      var cur = (pollVoteDraft[pollId] || []).slice();
      if (single) {
        cur = t.checked ? [id] : [];
      } else {
        var idx = cur.indexOf(id);
        if (t.checked && idx < 0) cur.push(id);
        if (!t.checked && idx >= 0) cur.splice(idx, 1);
      }
      pollVoteDraft[pollId] = cur;
      var wrap = t.closest(".poll-options");
      if (wrap) {
        var labs = wrap.querySelectorAll(".poll-option");
        for (var i = 0; i < labs.length; i++) {
          var inp = labs[i].querySelector("input");
          labs[i].classList.toggle("on", !!(inp && inp.checked));
        }
      }
    });

    document.addEventListener("input", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.id === "teamMoveSearch") {
        renderTeamMoveList(t.value);
      }
      if (t.id === "evergreenTeamFind" || t.id === "groveTeamFind") {
        teamTreeFindQ = t.value || "";
        try { clearTimeout(teamTreeFindTimer); } catch (eT) {}
        teamTreeFindTimer = setTimeout(function () {
          if (lastTeamGraphPaint) {
            renderLiveTeamGraph(
              lastTeamGraphPaint.graph,
              lastTeamGraphPaint.downline,
              {
                el: lastTeamGraphPaint.opts.el,
                evergreen: lastTeamGraphPaint.opts.evergreen,
                subtree: lastTeamGraphPaint.opts.subtree,
                keepFindFocus: true
              }
            );
          } else if (packEvergreen()) {
            renderEvergreenTeamGraph({ light: true, keepFindFocus: true });
          }
        }, 80);
      }
      if (t.id === "leadsSearch") {
        leadsSearchQ = t.value || "";
        if (leadsSearchTimer) clearTimeout(leadsSearchTimer);
        leadsSearchTimer = setTimeout(function () {
          leadsListLimit = LEADS_PAGE;
          renderLeadsList();
        }, 160);
      }
      if (t.id === "broadcastSheetBody") {
        paintBroadcastCount();
        setBroadcastMsg("");
      }
      if (t.id === "orgEventStarts") paintOrgEventTzHint();
      if (t.id === "groveBoardBody") {
        groveBoardDraft = t.value || "";
        paintGroveBoardCount();
        setGroveBoardMsg("");
      }
      if (t.id === "bulletinBody") {
        bulletinDraft = t.value || "";
        paintBulletinCount();
        setBulletinMsg("");
      }
      if (t.id === "evBoardBody") {
        evBoardDraft = t.value || "";
        var evCount = $("evBoardCount");
        if (evCount) evCount.textContent = String(t.value || "").length + " / " + EV_BOARD_MAX;
        var evMsg = $("evBoardMsg");
        if (evMsg) evMsg.textContent = "";
      }
      if (t.hasAttribute("data-poll-slot")) {
        collectPollSlots();
        setBroadcastMsg("");
      }
      if (t.hasAttribute("data-lead-name-input")) {
        leadNameDraft = t.value || "";
      }
      if (t.hasAttribute("data-info-guest-q")) {
        infoGuestPicker.q = t.value || "";
        infoGuestPicker.open = true;
        var results = document.querySelector("[data-info-guest-results]");
        var guests = document.querySelector("[data-info-guests]");
        if (results && guests) {
          results.innerHTML = infoGuestResultsHtml(
            guests.getAttribute("data-info-guests"),
            guests.getAttribute("data-info-on"),
            infoGuestPicker.q
          );
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (!t || !t.hasAttribute("data-lead-name-input")) return;
      if (e.key === "Enter") {
        e.preventDefault();
        var saveBtn = document.querySelector('[data-lead-save-name="' + t.getAttribute("data-lead-name-input") + '"]');
        if (saveBtn) saveBtn.click();
      } else if (e.key === "Escape") {
        e.preventDefault();
        var cancelBtn = document.querySelector('[data-lead-cancel-name="' + t.getAttribute("data-lead-name-input") + '"]');
        if (cancelBtn) cancelBtn.click();
      }
    });

    document.addEventListener("focusin", function (e) {
      var t = e.target;
      if (!t || !t.hasAttribute || !t.hasAttribute("data-lead-notes")) return;
      var fold = t.closest("details.leads-fold");
      if (fold) {
        fold.open = true;
        var id = fold.getAttribute("data-lead-fold-id");
        if (id) {
          if (!leadFoldOpen[id]) leadFoldOpen[id] = {};
          leadFoldOpen[id].notes = true;
        }
      }
    });

    document.addEventListener("focusout", async function (e) {
      var t = e.target;
      if (t && (t.id === "orgEventUrl" || t.id === "orgEventReplay")) {
        var cleaned = (window.FS.normalizeMeetingHref && window.FS.normalizeMeetingHref(t.value || "", 2000)) || "";
        if (cleaned) t.value = cleaned;
        return;
      }
      if (t && t.id === "leadsGroveIgInput" && Cloud.setGroveInstagram) {
        try {
          var savedIg = await Cloud.setGroveInstagram(t.value || "");
          t.value = savedIg || "";
          await refreshGroveDoorPanel();
        } catch (eIg) {}
        return;
      }
      if (!t || !t.hasAttribute("data-lead-notes")) return;
      var noteId = t.getAttribute("data-lead-notes");
      var nextNotes = t.value || "";
      var row = findLeadInCache(noteId);
      if (row && String(row.notes || "") === nextNotes) return;
      var statusEl = document.querySelector('[data-lead-notes-status="' + noteId + '"]');
      /* Two saves for the same note can overlap. Whoever writes last wins the
         ticket; an older save that lands afterwards must not put its text back. */
      var saveRun = (leadNoteRuns[noteId] = (leadNoteRuns[noteId] || 0) + 1);
      try {
        var updated = await Cloud.updateLeadNotes(noteId, nextNotes);
        if (saveRun !== leadNoteRuns[noteId]) return;
        patchLeadInCache(updated || { id: noteId, notes: nextNotes });
        var noteFoldTitle = document.querySelector(
          '[data-lead-fold="notes"][data-lead-fold-id="' + noteId + '"] .leads-fold-title'
        );
        if (noteFoldTitle) {
          noteFoldTitle.textContent = String(nextNotes || "").trim() ? "Notes" : "Tap to add a note";
        }
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = "Saved";
          setTimeout(function () {
            if (statusEl.textContent === "Saved") statusEl.hidden = true;
          }, 1400);
        }
      } catch (err) {
        if (saveRun !== leadNoteRuns[noteId]) return;
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = (err && err.message) || "Couldn’t save note.";
        }
      }
    });

    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.hasAttribute("data-lead-follow")) {
        var followId = t.getAttribute("data-lead-follow");
        var followOn = !!t.checked;
        t.disabled = true;
        Promise.resolve(setLeadFollowUp(followId, followOn)).then(function () {
          t.disabled = false;
        }).catch(function (err) {
          t.checked = !followOn;
          t.disabled = false;
          FS.UI.toast((err && err.message) || "Could not update follow-up.", { tone: "bad" });
        });
        return;
      }
      if (t.hasAttribute("data-vault-format") || t.hasAttribute("data-vault-promoting")) {
        var id = t.getAttribute("data-vault-format") || t.getAttribute("data-vault-promoting");
        var st = getState();
        if (!st.data.vaultOverrides) st.data.vaultOverrides = {};
        var cur = st.data.vaultOverrides[id] || {};
        if (t.hasAttribute("data-vault-format")) cur.format = t.value;
        if (t.hasAttribute("data-vault-promoting")) cur.promoting = t.value;
        st.data.vaultOverrides[id] = cur;
        persist();
        paintVaultBubble(t);
        var card = t.closest(".vault-card");
        if (card && cur.format) {
          card.className = "vault-card fmt-" + (cur.format || "single");
        }
        if (card) {
          var chips = card.querySelector(".vault-card-chips");
          if (chips) {
            var fmtSel = card.querySelector("[data-vault-format]");
            var promoSel = card.querySelector("[data-vault-promoting]");
            chips.innerHTML = formatChipHtml(fmtSel ? fmtSel.value : cur.format) +
              promotingChipHtml(promoSel ? promoSel.value : cur.promoting);
          }
        }
      }
    });

    document.addEventListener("toggle", function (e) {
      var t = e.target;
      if (!t || !t.classList) return;
      if (t.classList.contains("live-l1") && t.hasAttribute("data-team-branch")) {
        teamFoldOpen[t.getAttribute("data-team-branch")] = !!t.open;
      }
    }, true);

    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      var toggle = e.target.closest("[data-lead-menu-toggle]");
      if (!toggle) return;
      e.preventDefault();
      e.stopPropagation();
      var dd = toggle.closest(".leads-status-dd");
      if (dd && dd.classList.contains("is-open") && Date.now() < leadMenuTouchGuardUntil) return;
      toggleLeadMenu(dd);
    }, true);

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented) return;
      if (e.button != null && e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var meeting = a.hasAttribute("data-meeting-open") ||
        /(?:^|[/.])zoom(?:gov)?\.(?:us|com)\b/i.test(href);
      if (!meeting) return;
      openMeetingLink(href, e);
    });

    document.addEventListener("pointerdown", function (e) {
      if (!e.target || !e.target.closest) return;
      if (e.target.closest(".leads-status-dd")) return;
      if (e.pointerType === "mouse" && Date.now() < leadMenuTouchGuardUntil) return;
      var openStatus = document.querySelectorAll(".leads-status-dd.is-open");
      for (var oi = 0; oi < openStatus.length; oi++) closeLeadMenu(openStatus[oi]);
    });

    var layoutEl = document.querySelector(".layout");
    if (layoutEl && !layoutEl.dataset.leadMenuScroll) {
      layoutEl.dataset.leadMenuScroll = "1";
      layoutEl.addEventListener("scroll", function () {
        var openScroll = document.querySelectorAll(".leads-status-dd.is-open");
        for (var si = 0; si < openScroll.length; si++) closeLeadMenu(openScroll[si]);
      }, { passive: true });
    }

    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      var leaderSum = e.target.closest(".leader-card-sum");
      if (leaderSum) {
        var card = leaderSum.closest("details.leader-card");
        if (card) {
          /* Nested <details> also toggle the column. Stop the bubble;
             let this card toggle natively — preventDefault + manual open
             snaps shut on Safari. */
          e.stopPropagation();
          return;
        }
      }
      if (e.target.closest("[data-team-person]")) {
        e.preventDefault();
        return;
      }
      var l1sum = e.target.closest(".live-l1-sum:not(.is-static)");
      if (l1sum) {
        var l1 = l1sum.closest(".live-l1.has-kids");
        if (l1) {
          e.preventDefault();
          e.stopPropagation();
          setTeamBranchOpen(l1, !l1.classList.contains("is-open"));
          return;
        }
      }
      var sum = e.target.closest(".live-team-sum:not(.is-static)");
      if (!sum) return;
      var branch = sum.closest(".live-team-branch.has-kids");
      if (!branch) return;
      e.preventDefault();
      e.stopPropagation();
      setTeamBranchOpen(branch, !branch.classList.contains("is-open"));
    }, true);

    document.addEventListener("keydown", function (e) {
      if (e.target && e.target.id === "unlockCodeInput" && e.key === "Enter") {
        e.preventDefault();
        var ub = $("unlockCodeBtn");
        if (ub && !ub.disabled) ub.click();
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      if (!e.target || !e.target.closest) return;
      var leaderSum = e.target.closest(".leader-card-sum");
      if (!leaderSum) return;
      var card = leaderSum.closest("details.leader-card");
      if (!card) return;
      e.preventDefault();
      e.stopPropagation();
      card.open = !card.open;
    }, true);

    document.addEventListener("click", async function (e) {
      var authBtn = e.target && e.target.closest ? e.target.closest("#settingsYouAuth") : null;
      if (!authBtn) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (Cloud.user()) {
        if (window.FS.prepareSignOut) try { window.FS.prepareSignOut(); } catch (ePre) {}
        await Cloud.signOut();
        closeAuth();
        await afterAuth();
      } else {
        openAuth(true);
      }
    }, true);

    document.addEventListener("click", async function (e) {
      var t = e.target.closest(
        "#authCloseBtn,#authSubmitBtn,#authCreateBtn,#authSignOutBtn,#railCopyInvite,#leaderCopyInvite,#authCopyInvite,#createUnlockBtn,#createUnlockCopy,#unlockCodeBtn," +
        "#teamInviteOpen,#teamInviteClose,#teamInviteX,#importLiveTreeBtn,#cheerDismiss,#leaderNoteDismiss,#notifySponsorBtn,[data-goto-bridge],[data-copy-nudge],[data-cheer],[data-note],[data-leader-log]," +
        "#cheerSheetClose,#cheerSheetCancel,#cheerChooseAnother,#cheerConfirmSend," +
        "#noteSheetClose,#noteSheetCancel,#noteSheetCopy,#noteConfirmSend," +
        "#broadcastSheetClose,#broadcastSheetCancel,#broadcastConfirmSend,[data-broadcast-audience],[data-broadcast-kind],[data-broadcast-poll-choice]," +
        "#pollSheetAddSlot,[data-poll-slot-remove],[data-poll-save],[data-poll-close],#groveBoardPost,#groveBoardComposeMsg,#groveBoardComposePoll,#groveBoardSignIn,[data-grove-board-tab],[data-grove-board-compose],[data-board-delete],#evBoardPost,#evBoardComposePoll,[data-ev-board-delete],#bulletinPost,[data-bulletin-remove]," +
        "#teamPersonClose,#teamPersonX,#teamPersonCancel,#howTheyGrowClose,#howTheyGrowX,#howTheyGrowCancel,[data-how-they-grow],[data-how-grow-fold],[data-dismiss-team-news],[data-dismiss-app-updates],[data-team-sort],[data-team-person]," +
        "#teamRearrangeToggle,#evergreenRearrangeToggle,#teamMoveClose,#teamMoveX,#teamMoveCancel,#evResInviteClose,#evResInviteX,#evResInviteCancel,[data-team-move],[data-team-move-to],[data-team-move-root],[data-team-admin],[data-team-hub-admin],[data-team-remove]," +
        "[data-cal-day],[data-cal-select],[data-cal-status],[data-cal-type],[data-cal-swap],[data-cal-week],[data-cal-nav],[data-cal-view],[data-cal-add],[data-cal-clear],[data-cal-board-toggle],[data-cal-leader-zooms]," +
        "[data-cal-new],[data-cal-edit],[data-cal-item],[data-cal-accept],[data-cal-cadence],[data-cal-setup-toggle],[data-cal-save],[data-cal-delete],[data-cal-lead-follow]," +
        "[data-org-new],[data-org-downline],[data-org-personal],[data-org-view],[data-org-edit],[data-org-save],[data-org-delete],[data-org-copy-link],[data-org-copy-invite],[data-org-copy-replay],[data-org-copy-grove],[data-org-leader-star],[data-org-add-cal],[data-org-add-gcal],[data-org-resource],[data-gathering-dismiss],[data-gathering-reveal],[data-yt-play]," +
        "[data-info-guest-add],[data-info-guest-status],[data-info-guest-clear],[data-lead-info-invite],[data-lead-info-cycle]," +
        "[data-lib-tab],[data-lib-open],[data-lib-commit],[data-lib-add],[data-curio-open],[data-curio-cat]," +
        "[data-vault-open],[data-vault-save-everyone],[data-vault-revert],[data-vault-lane],[data-vault-week],[data-vault-format-tab],[data-vault-promoting-tab],[data-vault-apply-week],[data-vault-intensity],[data-vault-pick-date],[data-vault-pick-photo],[data-vault-more-photos]," +
        "[data-shelf-open],[data-shelf-view],[data-shelf-mine],[data-shelf-format-tab],[data-shelf-compose],[data-shelf-submit],[data-shelf-hide],[data-shelf-edit],[data-shelf-copy],[data-shelf-add-cal],[data-shelf-frame],[data-shelf-remove-file],[data-shelf-approve],[data-shelf-content-type],[data-shelf-add-files],[data-cal-to-shelf],[data-shelf-from-cal],[data-cal-add-files],[data-cal-browse-photos],[data-cal-remove-frame],[data-shelf-browse-photos],[data-curio-pick-done]," +
        "#curiosityLightboxClose,#curiosityLightboxX,#calSheetClose,#calSheetX," +
        "#leadsSignInBtn,#leadsCopyLink,#leadsGroveCopyLink,#customersCopyLink,#leadsPageSettingsBtn,#leadsPageSettingsSave,#leadsExportBtn,#leadsGroveListBtn,#leadsGroveListToggle,#settingsGroveListToggle,#leadsManualToggle,[data-lead-share-source],[data-leads-filter],[data-lead-status],[data-lead-interest],[data-lead-quiz],[data-lead-hot],[data-lead-more],[data-lead-copy],[data-lead-shuffle],[data-lead-shelf-door],[data-lead-reach],[data-lead-edit-name],[data-lead-save-name],[data-lead-cancel-name],[data-lead-delete],[data-manual-interest],[data-leads-merge],[data-leads-dup-dismiss],[data-leads-src-dismiss],[data-leads-more]," +
        "[data-cabinet-room],[data-cabinet-seed],[data-cabinet-open],[data-cabinet-person],[data-cabinet-back],[data-cabinet-send],[data-cabinet-care],[data-cabinet-skip],[data-cabinet-mute]," +
        "[data-ideal-lane],[data-ideal-set-lane],[data-ideal-status],[data-ideal-copy-link],[data-ideal-remove]"
      );
      if (!t) return;
      if ((t.id === "teamInviteClose" || t.id === "cheerSheetClose" || t.id === "noteSheetClose" ||
          t.id === "broadcastSheetClose" || t.id === "teamPersonClose" || t.id === "howTheyGrowClose" ||
          t.id === "teamMoveClose" || t.id === "evResInviteClose" || t.id === "calSheetClose" || t.id === "curiosityLightboxClose") &&
          window.FS.dismissGuarded && window.FS.dismissGuarded()) {
        return;
      }

      if (t.hasAttribute("data-vault-open")) {
        openVaultIdea(t.getAttribute("data-vault-open"), t.getAttribute("data-vault-date"));
        return;
      }
      if (t.hasAttribute("data-vault-save-everyone")) {
        saveVaultForEveryone();
        return;
      }
      if (t.hasAttribute("data-vault-revert")) {
        revertVaultForEveryone();
        return;
      }
      if (t.hasAttribute("data-shelf-open")) {
        openGroveShare(t.getAttribute("data-shelf-open"));
        return;
      }
      if (t.hasAttribute("data-shelf-view")) {
        var browseView = ensureGroveShelf();
        browseView.view = t.getAttribute("data-shelf-view") || "browse";
        if (browseView.view !== "detail" && browseView.view !== "compose") browseView.view = "browse";
        if (browseView.view === "browse") {
          browseView.id = "";
          groveShelfFiles = [];
        }
        if (persist) persist();
        renderGroveShelf();
        return;
      }
      if (t.hasAttribute("data-shelf-compose")) {
        var stClear = getState();
        if (stClear && stClear.data) {
          stClear.data.groveShelfDraft = null;
          stClear.data.groveShelfFromCal = null;
        }
        var browseAdd = ensureGroveShelf();
        browseAdd.view = "compose";
        browseAdd.id = "";
        groveShelfFiles = [];
        if (persist) persist();
        renderGroveShelf();
        return;
      }
      if (t.hasAttribute("data-shelf-mine")) {
        var browseMine = ensureGroveShelf();
        browseMine.mine = !browseMine.mine;
        if (persist) persist();
        renderGroveShelf();
        return;
      }
      if (t.hasAttribute("data-shelf-format-tab")) {
        var browseFmt = ensureGroveShelf();
        browseFmt.format = t.getAttribute("data-shelf-format-tab") || "";
        if (persist) persist();
        renderGroveShelf();
        return;
      }
      if (t.hasAttribute("data-shelf-content-type")) {
        var typePick = t.getAttribute("data-shelf-content-type") || "";
        var typeHidden = $("shelfContentType");
        if (typeHidden) typeHidden.value = typePick;
        var typeBtns = document.querySelectorAll("[data-shelf-content-type]");
        for (var ti = 0; ti < typeBtns.length; ti++) {
          typeBtns[ti].classList.toggle("on", typeBtns[ti].getAttribute("data-shelf-content-type") === typePick);
        }
        return;
      }
      if (t.hasAttribute("data-shelf-add-files")) {
        var shelfFileIn = $("shelfFiles");
        if (shelfFileIn) shelfFileIn.click();
        return;
      }
      if (t.hasAttribute("data-shelf-submit")) {
        groveShelfSubmit();
        return;
      }
      if (t.hasAttribute("data-shelf-copy")) {
        var copyShare = findGroveShare(ensureGroveShelf().id);
        if (copyShare) groveShelfCopy(copyShare);
        return;
      }
      if (t.hasAttribute("data-shelf-add-cal")) {
        var addShare = findGroveShare(ensureGroveShelf().id);
        if (addShare) groveShelfAddToCal(addShare);
        return;
      }
      if (t.hasAttribute("data-shelf-frame")) {
        var step = parseInt(t.getAttribute("data-shelf-frame"), 10) || 0;
        var framed = findGroveShare(ensureGroveShelf().id);
        var max = framed ? (Number(framed.frame_count) || 1) : 1;
        groveShelfFrameIdx += step;
        if (groveShelfFrameIdx < 1) groveShelfFrameIdx = max;
        if (groveShelfFrameIdx > max) groveShelfFrameIdx = 1;
        renderGroveShelf();
        return;
      }
      if (t.hasAttribute("data-shelf-remove-file")) {
        var rm = parseInt(t.getAttribute("data-shelf-remove-file"), 10);
        if (!isNaN(rm)) groveShelfFiles.splice(rm, 1);
        paintShelfFileRow();
        return;
      }
      if (t.hasAttribute("data-shelf-hide")) {
        var hideShare = findGroveShare(ensureGroveShelf().id);
        if (!hideShare || !Cloud.hideGroveShare) return;
        Cloud.hideGroveShare(hideShare.id, !hideShare.hidden).then(function () {
          groveShareLoadedAt = 0;
          renderGroveShelf();
          if (FS.UI && FS.UI.toast) FS.UI.toast(hideShare.hidden ? "Visible again." : "Hidden from the shelf.", { tone: "ok" });
        }).catch(function (err) {
          if (FS.UI && FS.UI.toast) FS.UI.toast((err && err.message) || "Couldn’t hide that.", { tone: "warn" });
        });
        return;
      }
      if (t.hasAttribute("data-shelf-edit")) {
        var browseEdit = ensureGroveShelf();
        browseEdit.view = "compose";
        if (persist) persist();
        renderGroveShelf();
        return;
      }
      if (t.hasAttribute("data-shelf-approve")) {
        var apShare = findGroveShare(ensureGroveShelf().id);
        if (!apShare || !Cloud.approveGroveShare) return;
        Cloud.approveGroveShare(apShare.id).then(function () {
          apShare.approved_at = new Date().toISOString();
          apShare.hidden = false;
          groveShareLoadedAt = 0;
          return loadGroveShares(true);
        }).then(function () {
          renderGroveShelf();
          paintGroveShelfCta();
          if (FS.UI && FS.UI.toast) FS.UI.toast("On the shelf — the grove can see it now.", { tone: "good" });
        }).catch(function (err) {
          if (FS.UI && FS.UI.toast) FS.UI.toast((err && err.message) || "Couldn’t approve that.", { tone: "warn" });
        });
        return;
      }
      if (t.hasAttribute("data-cal-to-shelf")) {
        var offer = $("shelfOffer");
        if (offer) {
          offer.innerHTML =
            '<p>Share this as a starting point? People will put their own spin on it. You can add frames first. Tay looks at each one before the team sees it.</p>' +
            '<div class="cal-sheet-actions">' +
              '<button type="button" class="btn" data-shelf-from-cal="now">Share as-is</button>' +
              '<button type="button" class="btn-ghost" data-shelf-from-cal="details">Add photos or details</button>' +
            "</div>";
        }
        return;
      }
      if (t.hasAttribute("data-shelf-from-cal")) {
        shareCalendarItemToShelf(t.getAttribute("data-shelf-from-cal") === "details");
        return;
      }
      if (t.hasAttribute("data-vault-apply-week")) {
        applyWeekPlanToCalendar();
        return;
      }
      if (t.hasAttribute("data-vault-intensity")) {
        vaultPlanState().intensity = t.getAttribute("data-vault-intensity") === "light" ? "light" : "full";
        persist();
        renderContentWeek();
        return;
      }
      if (t.hasAttribute("data-vault-pick-date")) {
        var stDate = getState();
        stDate.data.calendarSelected = t.getAttribute("data-vault-pick-date");
        persist();
        var strip = t.closest(".vault-date-strip");
        if (strip) {
          var btns = strip.querySelectorAll("[data-vault-pick-date]");
          for (var di = 0; di < btns.length; di++) {
            var onD = btns[di].getAttribute("data-vault-pick-date") === stDate.data.calendarSelected;
            btns[di].classList.toggle("on", onD);
            btns[di].setAttribute("aria-selected", onD ? "true" : "false");
          }
        }
        var commitBtn = document.querySelector("[data-lib-commit]");
        if (commitBtn) commitBtn.textContent = "Add to " + selectedDayLabel(stDate);
        return;
      }
      if (t.hasAttribute("data-vault-pick-photo")) {
        var photoId = t.getAttribute("data-vault-pick-photo");
        var stPh = getState();
        var resolvedPh = Cal.resolveCuriosityImage ? Cal.resolveCuriosityImage(photoId) : null;
        var srcPh = resolvedPh ? resolvedPh.src : "";
        var targetPh = (stPh.data.libraryEditing && stPh.data.libraryEditing.vaultId)
          ? stPh.data.libraryEditing
          : (scheduledVaultItem() && scheduledVaultItem().item);
        if (targetPh) {
          var framesPh = persistedFrames(targetPh);
          var foundPh = -1;
          for (var pi = 0; pi < framesPh.length; pi++) {
            if (framesPh[pi].imageId === photoId) foundPh = pi;
          }
          if (foundPh > -1) framesPh.splice(foundPh, 1);
          else if (framesPh.length + localFilesForItem(targetPh.id).length < FRAME_MAX) {
            framesPh.push({ src: srcPh, imageId: photoId });
          }
          targetPh.frames = framesPh;
          syncItemCover(targetPh);
        }
        persist();
        if (stPh.data.libraryEditing && stPh.data.libraryEditing.vaultId) renderVaultEditor();
        else renderCalEditor();
        return;
      }
      if (t.hasAttribute("data-vault-more-photos") || t.hasAttribute("data-cal-browse-photos")) {
        var stPick = getState();
        var edPick = stPick && stPick.data && stPick.data.calendarEditing;
        if (edPick) {
          setPhotoPick({ kind: "card", date: edPick.date, itemId: edPick.itemId });
        } else if (stPick && stPick.data && stPick.data.libraryEditing) {
          setPhotoPick({ kind: "vault-ed" });
        } else if (ensureGroveShelf().view === "compose") {
          setPhotoPick({ kind: "shelf" });
        }
        closeCalSheet();
        if (gotoPanel) gotoPanel("curiosity-photos");
        return;
      }
      if (t.hasAttribute("data-cal-add-files")) {
        var fileIn = $("calFrameFiles");
        if (fileIn) fileIn.click();
        return;
      }
      if (t.hasAttribute("data-cal-remove-frame")) {
        var rmKey = t.getAttribute("data-cal-remove-frame") || "";
        var stRm = getState();
        var edRm = stRm && stRm.data && stRm.data.calendarEditing;
        var itemRm = null;
        if (edRm) {
          var dayRm = Cal.ensureDay(stRm.data.calendar, edRm.date);
          for (var ri = 0; ri < dayRm.items.length; ri++) {
            if (dayRm.items[ri].id === edRm.itemId) itemRm = dayRm.items[ri];
          }
        }
        if (itemRm) {
          if (rmKey.indexOf("local:") === 0) {
            var li = parseInt(rmKey.slice(6), 10);
            var bucket = localFilesForItem(itemRm.id);
            if (!isNaN(li) && li >= 0 && li < bucket.length) bucket.splice(li, 1);
          } else if (rmKey.indexOf("keep:") === 0) {
            removePersistedFrame(itemRm, parseInt(rmKey.slice(5), 10));
          }
          persist();
          renderCalEditor();
        }
        return;
      }
      if (t.hasAttribute("data-curio-pick-done")) {
        finishPhotoPick();
        return;
      }
      if (t.hasAttribute("data-shelf-browse-photos")) {
        var liveShelf = readShelfForm();
        var stShelf = getState();
        if (stShelf && stShelf.data) stShelf.data.groveShelfDraft = liveShelf;
        if (persist) persist();
        setPhotoPick({ kind: "shelf" });
        if (gotoPanel) gotoPanel("curiosity-photos");
        return;
      }
      if (t.hasAttribute("data-vault-format-tab")) {
        var vbFmt = ensureVaultBrowse("vault");
        vbFmt.format = t.getAttribute("data-vault-format-tab") || "";
        persist();
        var vaultRootFmt = $("contentVaultRoot");
        if (vaultRootFmt) {
          var fmtChips = vaultRootFmt.querySelectorAll("[data-vault-format-tab]");
          for (var fi = 0; fi < fmtChips.length; fi++) {
            var onFmt = (fmtChips[fi].getAttribute("data-vault-format-tab") || "") === (vbFmt.format || "");
            fmtChips[fi].classList.toggle("on", onFmt);
            fmtChips[fi].setAttribute("aria-selected", onFmt ? "true" : "false");
          }
          updateVaultSearchResults();
        } else {
          renderContentVault();
        }
        return;
      }
      if (t.hasAttribute("data-vault-promoting-tab")) {
        var vbPromo = ensureVaultBrowse("vault");
        vbPromo.promoting = t.getAttribute("data-vault-promoting-tab") || "";
        vbPromo.lane = "all";
        persist();
        var vaultRootPromo = $("contentVaultRoot");
        if (vaultRootPromo) {
          var promoChips = vaultRootPromo.querySelectorAll("[data-vault-promoting-tab]");
          for (var pi = 0; pi < promoChips.length; pi++) {
            var onPromo = (promoChips[pi].getAttribute("data-vault-promoting-tab") || "") === (vbPromo.promoting || "");
            promoChips[pi].classList.toggle("on", onPromo);
            promoChips[pi].setAttribute("aria-selected", onPromo ? "true" : "false");
          }
          var laneChips = vaultRootPromo.querySelectorAll("[data-vault-lane]");
          for (var li = 0; li < laneChips.length; li++) {
            var onLane = (laneChips[li].getAttribute("data-vault-lane") || "all") === "all";
            laneChips[li].classList.toggle("on", onLane);
            laneChips[li].setAttribute("aria-selected", onLane ? "true" : "false");
          }
          updateVaultSearchResults();
        } else {
          renderContentVault();
        }
        return;
      }
      if (t.hasAttribute("data-vault-lane")) {
        var vb = ensureVaultBrowse("vault");
        vb.lane = t.getAttribute("data-vault-lane") || "all";
        persist();
        var vaultRootLane = $("contentVaultRoot");
        if (vaultRootLane) {
          var laneBtns = vaultRootLane.querySelectorAll("[data-vault-lane]");
          for (var lbi = 0; lbi < laneBtns.length; lbi++) {
            var onL = (laneBtns[lbi].getAttribute("data-vault-lane") || "all") === (vb.lane || "all");
            laneBtns[lbi].classList.toggle("on", onL);
            laneBtns[lbi].setAttribute("aria-selected", onL ? "true" : "false");
          }
          updateVaultSearchResults();
        } else {
          renderContentVault();
        }
        return;
      }
      if (t.hasAttribute("data-vault-week")) {
        var stW = getState();
        var nextW = parseInt(t.getAttribute("data-vault-week"), 10) || 1;
        stW.data.vaultWeekIndex = nextW;
        stW.data.vaultWeekFollow = nextW === liveWeekIndex();
        persist();
        renderContentWeek();
        return;
      }
      if (t.id === "leadsSignInBtn") { openAuth(true); return; }
      if (t.hasAttribute("data-ideal-lane")) {
        idealAddLane = t.getAttribute("data-ideal-lane") === "warm" ? "warm" : "customers";
        var laneBtns = document.querySelectorAll("[data-ideal-lane]");
        for (var li = 0; li < laneBtns.length; li++) {
          var on = laneBtns[li].getAttribute("data-ideal-lane") === idealAddLane;
          laneBtns[li].classList.toggle("on", on);
          laneBtns[li].setAttribute("aria-pressed", on ? "true" : "false");
        }
        return;
      }
      if (t.hasAttribute("data-ideal-set-lane")) {
        var apiLane = idealLeadsApi();
        if (!apiLane) return;
        var nextLane = t.getAttribute("data-lane") === "warm" ? "warm" : "customers";
        closeLeadMenu(t.closest(".leads-status-dd"));
        apiLane.setLane(t.getAttribute("data-ideal-set-lane"), nextLane);
        persist();
        renderIdealLeadsList();
        return;
      }
      if (t.hasAttribute("data-ideal-status")) {
        var apiStatus = idealLeadsApi();
        if (!apiStatus) return;
        apiStatus.setStatus(t.getAttribute("data-ideal-status"), t.getAttribute("data-status"));
        persist();
        renderIdealLeadsList();
        return;
      }
      if (t.hasAttribute("data-ideal-copy-link")) {
        copyLeadPageLink(t);
        return;
      }
      if (t.hasAttribute("data-ideal-remove")) {
        var apiRm = idealLeadsApi();
        if (!apiRm) return;
        var rmId = t.getAttribute("data-ideal-remove");
        var rmRow = null;
        (apiRm.list() || []).forEach(function (r) { if (r.id === rmId) rmRow = r; });
        var doRemove = function () {
          apiRm.remove(rmId);
          persist();
          renderIdealLeadsList();
        };
        if (!rmRow) { doRemove(); return; }
        FS.UI.ask("They come off your Ideal Lead List. You can add them again any time.", {
          title: "Remove " + (rmRow.name || "this person") + "?",
          okText: "Remove",
          danger: true
        }).then(function (ok) { if (ok) doRemove(); });
        return;
      }
      if (t.id === "leadsCopyLink") {
        if (typeof window.FS.copyLeadsPageInvite === "function") {
          window.FS.copyLeadsPageInvite(t);
        }
        return;
      }
      if (t.id === "customersCopyLink") {
        if (typeof window.FS.copyCabinetInvite === "function") {
          window.FS.copyCabinetInvite(t);
        }
        return;
      }
      if (t.hasAttribute("data-cabinet-room") || t.hasAttribute("data-cabinet-seed") ||
          t.hasAttribute("data-cabinet-open") || t.hasAttribute("data-cabinet-person") ||
          t.hasAttribute("data-cabinet-back") || t.hasAttribute("data-cabinet-send") ||
          t.hasAttribute("data-cabinet-care") || t.hasAttribute("data-cabinet-skip") ||
          t.hasAttribute("data-cabinet-mute") || t.hasAttribute("data-cabinet-remove")) {
        if (e.defaultPrevented) return;
        if (window.FS.CabinetDesk && typeof window.FS.CabinetDesk.handleClick === "function") {
          window.FS.CabinetDesk.handleClick(e);
        }
        return;
      }
      if (t.id === "leadsGroveCopyLink") {
        if (typeof window.FS.copyGrovePageInvite === "function") {
          window.FS.copyGrovePageInvite(t);
        }
        return;
      }
      if (t.id === "leadsGroveListBtn") {
        var listPanel = $("leadsGroveListPanel");
        if (!listPanel) return;
        var listOpen = listPanel.hidden;
        listPanel.hidden = !listOpen;
        t.setAttribute("aria-expanded", listOpen ? "true" : "false");
        if (listOpen) refreshGroveDoorPanel();
        return;
      }
      if (t.id === "leadsGroveListToggle" || t.id === "settingsGroveListToggle") {
        var wantOn = t.getAttribute("aria-pressed") !== "true";
        var igEl = t.id === "settingsGroveListToggle"
          ? ($("settingsInstagram") || $("leadsGroveIgInput"))
          : ($("leadsGroveIgInput") || $("settingsInstagram"));
        t.disabled = true;
        try {
          if (igEl && Cloud.setGroveInstagram) {
            await Cloud.setGroveInstagram(igEl.value || "");
          }
          groveDoorElig = await Cloud.setGroveDoorVisible(wantOn);
          await refreshGroveDoorPanel();
        } catch (errOn) {
          var listHint = t.id === "settingsGroveListToggle" ? $("settingsGroveListHint") : $("leadsGroveListHint");
          if (listHint) listHint.textContent = (errOn && errOn.message) || "Could not update the list.";
          t.disabled = false;
        }
        return;
      }
      if (t.hasAttribute("data-lead-share-source")) {
        var shareSrc = t.getAttribute("data-lead-share-source");
        if (typeof window.FS.setLeadShareSource === "function") {
          window.FS.setLeadShareSource(shareSrc);
        }
        return;
      }
      if (t.id === "leadsPageSettingsBtn") {
        var panel = $("leadsPageSettings");
        if (!panel) return;
        var open = panel.hidden;
        panel.hidden = !open;
        t.classList.toggle("on", open);
        t.setAttribute("aria-expanded", open ? "true" : "false");
        return;
      }
      if (t.id === "leadsExportBtn") {
        exportLeadsInbox();
        return;
      }
      if (t.id === "leadsPageSettingsSave") {
        var settingsMsg = $("leadsSlugMsg");
        var desired = (($("leadsSlugInput") || {}).value || "").trim();
        var currentSlug = ((Cloud.user() && Cloud.user().lead_slug) || "").trim().toLowerCase();
        var nextSlug = Cloud.slugifyName ? Cloud.slugifyName(desired) : desired.toLowerCase();
        try {
          t.disabled = true;
          if (currentSlug && desired && nextSlug && nextSlug !== currentSlug) {
            var okChange = await FS.UI.ask(
              "Your old link (…" + currentSlug + ") will still come to you. Nobody else can take it. New shares should use the new link.",
              { title: "Change your public link?", okText: "Change it", cancelText: "Keep this one" }
            );
            if (!okChange) return;
          }
          var claimed = await Cloud.claimLeadSlug(desired);
          syncLeadsShareUI(claimed);
          await Cloud.setLeadPageCopy(
            (($("leadsBlurbInput") || {}).value || ""),
            (($("leadsThanksInput") || {}).value || "")
          );
          var savedBlurb = (($("leadsBlurbInput") || {}).value || "").trim().slice(0, 280);
          var stSave = getState ? getState() : null;
          if (stSave && stSave.data) {
            stSave.data.ground_line_locked = true;
            if (savedBlurb) stSave.data.page_story = savedBlurb;
            stSave.data._synced_page_story = savedBlurb;
          }
          if (persist) persist();
          if (window.FS && window.FS.renderMiniPage) window.FS.renderMiniPage();
          if (settingsMsg) settingsMsg.textContent = "Page settings saved.";
        } catch (err) {
          if (settingsMsg) settingsMsg.textContent = (err && err.message) || "Could not save page settings.";
        } finally {
          t.disabled = false;
        }
        return;
      }
      if (t.hasAttribute("data-leads-more")) {
        leadsListLimit = parseInt(t.getAttribute("data-leads-more"), 10) || (leadsListLimit + LEADS_PAGE);
        renderLeadsList({ force: true });
        return;
      }
      if (t.hasAttribute("data-leads-src-dismiss")) {
        dismissSourceBanner(t.getAttribute("data-leads-src-dismiss"), t.getAttribute("data-leads-src-at") || "");
        renderLeadsList();
        return;
      }
      if (t.hasAttribute("data-leads-dup-dismiss")) {
        var gone = readDupDismiss();
        var dupKey = t.getAttribute("data-leads-dup-dismiss") || "";
        if (dupKey && gone.indexOf(dupKey) < 0) gone.push(dupKey);
        try { localStorage.setItem(leadDupDismissKey(), JSON.stringify(gone)); } catch (eDup) {}
        renderLeadsList();
        return;
      }
      if (t.hasAttribute("data-leads-merge")) {
        var mergeKeep = t.getAttribute("data-leads-merge");
        var mergeDrop = (t.getAttribute("data-leads-merge-drop") || "").split(",").map(function (id) {
          return String(id || "").trim();
        }).filter(Boolean);
        var mergeLead = findLeadInCache(mergeKeep);
        var mergeName = (mergeLead && mergeLead.name) || "this person";
        var okMerge = await FS.UI.ask(
          "One card stays. Notes, Both, quiz, and how far you’ve gotten are kept. The extra cards go away.",
          { title: "Combine " + mergeName + "?", okText: "Combine" }
        );
        if (!okMerge) return;
        try {
          absorbLeadFlags(mergeKeep, mergeDrop);
          var merged = await Cloud.mergeOwnLeads(mergeKeep, mergeDrop);
          if (merged) patchLeadInCache(merged);
          mergeDrop.forEach(function (id) { dropLeadFromCache(id); });
          leadFollowCache = leadsCache.slice();
          if (persist) persist();
          renderLeadsList({ force: true });
          renderIdealLeadsList();
          paintLeadsNewBadge();
          if (typeof renderCalendar === "function") renderCalendar();
          FS.UI.toast(mergeName + " is one card now.", { tone: "good" });
        } catch (errMerge) {
          FS.UI.toast((errMerge && errMerge.message) || "Could not combine those cards.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-leads-filter")) {
        leadsFilter = t.getAttribute("data-leads-filter") || "all";
        leadsListLimit = LEADS_PAGE;
        var filters = document.querySelectorAll("[data-leads-filter]");
        for (var fi = 0; fi < filters.length; fi++) {
          filters[fi].classList.toggle("on", filters[fi].getAttribute("data-leads-filter") === leadsFilter);
        }
        renderLeadsList({ force: true });
        return;
      }
      if (t.hasAttribute("data-lead-info-invite") || t.hasAttribute("data-lead-info-cycle")) {
        var infoLeadId = t.getAttribute("data-lead-info-invite") || t.getAttribute("data-lead-info-cycle");
        var focus = focusInfoZoom();
        if (!focus) {
          FS.UI.toast("No Info Zoom on the calendar to mark yet.", { tone: "bad" });
          return;
        }
        var focusOn = localYmdFromIso(focus.starts_at);
        var curInfo = infoNoteStatus(infoLeadId, focus.id, focusOn);
        var nextInfo = "";
        if (t.hasAttribute("data-lead-info-invite")) {
          nextInfo = curInfo ? "" : "invited";
        } else {
          nextInfo = curInfo === "invited" ? "attended" : "invited";
        }
        try {
          var infoPending = setLeadInfoStatus(infoLeadId, focus.id, focusOn, nextInfo);
          renderLeadsList();
          await infoPending;
          renderLeadsList();
        } catch (infoErr) {
          renderLeadsList();
          FS.UI.toast((infoErr && infoErr.message) || "Couldn’t save that.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-info-guest-add") || t.hasAttribute("data-info-guest-status") || t.hasAttribute("data-info-guest-clear")) {
        var guestEv = viewingInfoZoom();
        if (!guestEv) return;
        var guestOn = localYmdFromIso(guestEv.starts_at);
        if (!guestOn) return;
        var guestLead = t.getAttribute("data-info-guest-add") ||
          t.getAttribute("data-lead-id") ||
          t.getAttribute("data-info-guest-clear");
        if (!guestLead) return;
        var guestStatus = "";
        if (t.hasAttribute("data-info-guest-add")) guestStatus = "invited";
        else if (t.hasAttribute("data-info-guest-status")) guestStatus = t.getAttribute("data-info-guest-status") || "invited";
        else guestStatus = "";
        try {
          var guestPending = setLeadInfoStatus(guestLead, guestEv.id, guestOn, guestStatus);
          if (t.hasAttribute("data-info-guest-add")) infoGuestPicker.open = true;
          paintInfoGuests(guestEv);
          renderLeadsList();
          await guestPending;
          paintInfoGuests(guestEv);
          renderLeadsList();
        } catch (guestErr) {
          paintInfoGuests(guestEv);
          renderLeadsList();
          FS.UI.toast((guestErr && guestErr.message) || "Couldn’t save that.", { tone: "bad" });
        }
        return;
      }
      if (t.id === "leadsManualToggle") {
        var form = $("leadsManualForm");
        if (!form) return;
        var show = form.hidden;
        form.hidden = !show;
        t.setAttribute("aria-expanded", show ? "true" : "false");
        t.classList.toggle("on", show);
        if (show) {
          var nameFocus = $("leadsManualName");
          if (nameFocus) {
            try { nameFocus.focus(); } catch (eF) {}
          }
        }
        return;
      }
      if (t.hasAttribute("data-manual-interest")) {
        var lane = t.getAttribute("data-manual-interest");
        var lanes = document.querySelectorAll("[data-manual-interest]");
        for (var li = 0; li < lanes.length; li++) {
          var on = lanes[li].getAttribute("data-manual-interest") === lane;
          lanes[li].classList.toggle("on", on);
          lanes[li].setAttribute("aria-pressed", on ? "true" : "false");
        }
        return;
      }
      if (t.hasAttribute("data-lead-shuffle")) {
        var shuffleId = t.getAttribute("data-lead-shuffle");
        var shuffleRow = findLeadInCache(shuffleId);
        if (!shuffleRow) return;
        var bankLen = leadOpenerBank(shuffleRow.interest).length;
        leadOpenerIndex[shuffleId] = ((leadOpenerIndex[shuffleId] || 0) + 1) % bankLen;
        renderLeadsList();
        return;
      }
      if (t.hasAttribute("data-lead-shelf-door")) {
        var doorLead = findLeadInCache(t.getAttribute("data-lead-shelf-door"));
        var CloudDoor = window.FS && window.FS.Cloud;
        if (!doorLead || !doorLead.email || !CloudDoor || typeof CloudDoor.createShelfDoor !== "function") return;
        t.disabled = true;
        try {
          var door = await CloudDoor.createShelfDoor(doorLead.email, doorLead.name || "", []);
          var doorUrl = (door && (door.url || (window.FS && window.FS.cabinetDoorUrl && window.FS.cabinetDoorUrl(door.token)))) || "";
          if (!doorUrl) throw new Error((door && door.error) || "Couldn’t make that door.");
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(doorUrl);
            }
          } catch (eCopy) {}
          t.textContent = "Copied ✓";
          FS.UI.toast("Unique customer link copied.", { tone: "good" });
          setTimeout(function () { t.textContent = "Unique door"; t.disabled = false; }, 1800);
        } catch (errDoor) {
          t.disabled = false;
          FS.UI.toast((errDoor && errDoor.message) || "Couldn’t make that door.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-lead-copy")) {
        var copyId = t.getAttribute("data-lead-copy");
        var copyRow = findLeadInCache(copyId);
        if (!copyRow) return;
        var copyText = leadOpenerFor(copyRow);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(copyText);
          } else {
            throw new Error("no clipboard");
          }
          t.textContent = "Copied ✓";
          setTimeout(function () { t.textContent = "Copy"; }, 1600);
        } catch (err) {
          try {
            var ta = document.createElement("textarea");
            ta.value = copyText;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand("copy");
            document.body.removeChild(ta);
            if (ok) {
              t.textContent = "Copied ✓";
              setTimeout(function () { t.textContent = "Copy"; }, 1600);
            } else {
              FS.UI.toast("Couldn’t copy — long-press the opener text instead.", { tone: "bad" });
            }
          } catch (err2) {
            FS.UI.toast("Couldn’t copy — long-press the opener text instead.", { tone: "bad" });
          }
        }
        return;
      }
      if (t.hasAttribute("data-lead-more")) {
        var moreId = t.getAttribute("data-lead-more");
        var nextMore = !leadMoreOn(moreId);
        setLeadMore(moreId, nextMore);
        renderLeadsList();
        return;
      }
      if (t.hasAttribute("data-lead-edit-name")) {
        var editId = t.getAttribute("data-lead-edit-name");
        var editLead = findLeadInCache(editId);
        leadNameEditingId = editId || "";
        leadNameDraft = (editLead && editLead.name) || "";
        renderLeadsList();
        var nameIn = $("lead-name-" + editId);
        if (nameIn) {
          try {
            nameIn.focus();
            nameIn.select();
          } catch (eFocus) {}
        }
        return;
      }
      if (t.hasAttribute("data-lead-cancel-name")) {
        leadNameEditingId = "";
        leadNameDraft = "";
        renderLeadsList();
        return;
      }
      if (t.hasAttribute("data-lead-save-name")) {
        var saveId = t.getAttribute("data-lead-save-name");
        var nameEl = document.querySelector('[data-lead-name-input="' + saveId + '"]');
        var nextName = nameEl ? nameEl.value : leadNameDraft;
        try {
          var savedLead = await Cloud.updateLeadName(saveId, nextName);
          patchLeadInCache(savedLead);
          leadNameEditingId = "";
          leadNameDraft = "";
          renderLeadsList();
        } catch (errName) {
          FS.UI.toast((errName && errName.message) || "Could not update name.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-lead-delete")) {
        var delId = t.getAttribute("data-lead-delete");
        var delLead = findLeadInCache(delId);
        var delName = (delLead && delLead.name) || "this lead";
        var okDel = await FS.UI.ask(
          "This takes them out of your inbox for good. Use Archive if you only want them off the main list.",
          { title: "Delete " + delName + "?", okText: "Delete", danger: true }
        );
        if (!okDel) return;
        try {
          await Cloud.deleteLead(delId);
          dropLeadFromCache(delId);
          leadFollowCache = leadsCache.slice();
          if (persist) persist();
          renderLeadsList({ force: true });
          renderIdealLeadsList();
          paintLeadsNewBadge();
          if (typeof renderCalendar === "function") renderCalendar();
        } catch (errDel) {
          FS.UI.toast((errDel && errDel.message) || "Could not delete lead.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-lead-reach")) {
        /* Native sms:/mailto: follows the href — status stays until they mark it. */
        return;
      }
      if (t.hasAttribute("data-lead-hot")) {
        var hotId = t.getAttribute("data-lead-hot");
        var nextHot = t.getAttribute("aria-pressed") !== "true";
        try {
          await setLeadHot(hotId, nextHot);
          renderLeadsList();
        } catch (errHot) {
          FS.UI.toast((errHot && errHot.message) || "Could not update lead.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-lead-quiz")) {
        var quizId = t.getAttribute("data-lead-quiz");
        var nextQuiz = t.getAttribute("data-quiz") === "1";
        var curQuizLead = findLeadInCache(quizId);
        closeLeadMenu(t.closest(".leads-status-dd"));
        if (curQuizLead && leadQuizOn(curQuizLead, getState ? getState() : null) === nextQuiz) {
          return;
        }
        try {
          await setLeadQuiz(quizId, nextQuiz);
          renderLeadsList();
        } catch (errQuiz) {
          FS.UI.toast((errQuiz && errQuiz.message) || "Could not update lead.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-lead-interest")) {
        var interestId = t.getAttribute("data-lead-interest");
        var nextInterest = t.getAttribute("data-interest");
        var curInterestLead = findLeadInCache(interestId);
        closeLeadMenu(t.closest(".leads-status-dd"));
        if (curInterestLead && curInterestLead.interest === nextInterest) {
          return;
        }
        try {
          var updatedInterest = await Cloud.updateLeadInterest(interestId, nextInterest);
          patchLeadInCache(updatedInterest || { id: interestId, interest: nextInterest });
          renderLeadsList();
        } catch (errInterest) {
          FS.UI.toast((errInterest && errInterest.message) || "Could not update lead.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-lead-status")) {
        var leadId = t.getAttribute("data-lead-status");
        var nextStatus = t.getAttribute("data-status");
        var curLead = findLeadInCache(leadId);
        closeLeadMenu(t.closest(".leads-status-dd"));
        if (curLead && curLead.status === nextStatus) {
          return;
        }
        try {
          var updatedLead = await Cloud.updateLeadStatus(leadId, nextStatus);
          patchLeadInCache(updatedLead || { id: leadId, status: nextStatus });
          renderLeadsList();
          if (nextStatus === "joined" && typeof window.FS.celebrateLeadJoin === "function") {
            window.FS.celebrateLeadJoin((updatedLead && updatedLead.name) || (curLead && curLead.name) || "");
          }
        } catch (err) {
          FS.UI.toast((err && err.message) || "Could not update lead.", { tone: "bad" });
        }
        return;
      }
      if (t.id === "authCloseBtn") { closeAuth(); return; }
      if (t.id === "authSubmitBtn" || t.id === "authCreateBtn") {
        var email = ($("authEmail") || {}).value;
        var name = ($("authName") || {}).value;
        var lastName = (($("authLastName") || {}).value || "").trim();
        var password = ($("authPassword") || {}).value;
        var msg = $("authMsg");
        var creating = t.id === "authCreateBtn";
        lastAuthIntent = creating ? "create" : "signin";
        var passEl = $("authPassword");
        if (passEl) passEl.setAttribute("autocomplete", creating ? "new-password" : "current-password");
        var lastField = $("authLastNameField");
        if (creating && lastField) lastField.hidden = false;
        try {
          t.disabled = true;
          if (!(String(email || "").trim()) || !password) {
            var emailEl = $("authEmail");
            if (!(String(email || "").trim()) && emailEl) {
              if (msg) msg.textContent = creating
                ? "Enter your email and a password (at least 8 characters)."
                : "Enter your email and password.";
              emailEl.focus();
              return;
            }
            if (passEl) {
              passEl.focus();
              return;
            }
          }
          if (creating) {
            if (!(name || "").trim()) {
              if (msg) msg.textContent = "Add your first name.";
              return;
            }
            if (!lastName) {
              if (msg) msg.textContent = "Add your last name too — it helps leaders tell people apart.";
              if (lastField) lastField.hidden = false;
              var lastIn = $("authLastName");
              if (lastIn) lastIn.focus();
              return;
            }
          }
          if (creating && getState) {
            var st = getState();
            if (!st.settings) st.settings = {};
            if (name) st.settings.partnerName = String(name).trim();
            if (lastName) st.settings.partnerLastName = lastName;
            persist();
          }
          if (creating && String(password || "").length < 8) {
            if (msg) msg.textContent = "Password needs at least 8 characters.";
            return;
          }
          var res = creating
            ? await Cloud.signUp(email, name, password, lastName)
            : await Cloud.signIn(email, name, password);
          if (msg) msg.textContent = res.message;
          if (res.kind === "local" || res.kind === "signed_in") {
            await mergeCloudProgressQueued();
            closeAuth();
            await afterAuth();
            if (typeof window.FS.maybeOfferLastName === "function") {
              setTimeout(window.FS.maybeOfferLastName, 400);
            }
          }
        } catch (err) {
          var friendly = Cloud.friendlyAuthError
            ? Cloud.friendlyAuthError(err, creating)
            : ((err && err.message) || "");
          if (msg) msg.textContent = friendly || (creating ? "Could not create account." : "Could not sign in.");
        } finally {
          t.disabled = false;
        }
        return;
      }
      if (t.id === "authSignOutBtn") {
        if (window.FS.prepareSignOut) try { window.FS.prepareSignOut(); } catch (ePre) {}
        await Cloud.signOut();
        closeAuth();
        await afterAuth();
        return;
      }
      if (t.id === "teamInviteOpen") {
        if (typeof window.FS.openGroveTeamInvite === "function") {
          window.FS.openGroveTeamInvite();
        }
        return;
      }
      if (t.id === "railCopyInvite" || t.id === "authCopyInvite") {
        var input = t.id === "authCopyInvite" ? $("authInviteInput") : $("railInviteInput");
        var url = input ? String(input.value || "").trim() : "";
        try {
          var liveUser = Cloud.user && Cloud.user();
          var liveCode = liveUser && liveUser.invite_code;
          if (liveCode && Cloud.joinUrl) url = Cloud.joinUrl(liveCode) || url;
          if (Cloud.hardenShareUrl) url = Cloud.hardenShareUrl(url) || url;
          if (input && url) input.value = url;
        } catch (eHardJoin) {}
        if (!url) {
          if (FS.UI && FS.UI.toast) {
            FS.UI.toast("Couldn’t load that invite link yet. Try again in a moment.", { tone: "bad" });
          }
          return;
        }
        var prevCopy = t.textContent;
        var copiedOk = false;
        function markCopied() {
          if (copiedOk) return;
          copiedOk = true;
          t.textContent = "Copied ✓";
          setTimeout(function () { t.textContent = prevCopy; }, 1400);
        }
        try {
          var ta = document.createElement("textarea");
          ta.value = url;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          if (document.execCommand("copy")) markCopied();
          document.body.removeChild(ta);
        } catch (eCopy) {}
        if (!copiedOk && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(markCopied).catch(function () {
            if (FS.UI && FS.UI.toast) {
              FS.UI.toast("Couldn’t copy. Long-press the link to copy it.", { tone: "bad" });
            }
          });
        }
        return;
      }
      if (t.id === "createUnlockBtn" || t.id === "createUnlockCopy") {
        e.preventDefault();
        var msgEl = $("createUnlockMsg");
        var result = $("createUnlockResult");
        var out = $("createUnlockInput");
        function copyUnlock(code, btn) {
          if (!code || !navigator.clipboard) return Promise.resolve();
          return navigator.clipboard.writeText(code).then(function () {
            var prev = btn.textContent;
            btn.textContent = "Copied ✓";
            setTimeout(function () { btn.textContent = prev; }, 1400);
          }).catch(function () {});
        }
        if (t.id === "createUnlockCopy") {
          if (out && out.value) copyUnlock(out.value, t);
          return;
        }
        t.disabled = true;
        if (msgEl) {
          msgEl.textContent = "";
          msgEl.classList.remove("is-error");
        }
        Cloud.mintUnlockCode().then(function (code) {
          t.disabled = false;
          if (out) out.value = code;
          if (result) result.hidden = false;
          if (msgEl) msgEl.textContent = "Send this to that person. One use. Expires in 7 days.";
          copyUnlock(code, t);
        }).catch(function (err) {
          t.disabled = false;
          if (msgEl) {
            msgEl.textContent = (err && err.message) || "Could not make a code. Try again.";
            msgEl.classList.add("is-error");
          }
        });
        return;
      }
      if (t.id === "unlockCodeBtn") {
        e.preventDefault();
        var uIn = $("unlockCodeInput");
        var uMsg = $("unlockCodeMsg");
        var wait = unlockLockedUntil - Date.now();
        if (wait > 0) {
          if (uMsg) {
            uMsg.textContent = "That code didn’t match.";
            uMsg.classList.add("is-error");
          }
          return;
        }
        function redeemUnlock(typed) {
          typed = String(typed || "").trim();
          if (uIn && typed) uIn.value = typed;
          if (!typed) {
            t.disabled = false;
            if (uIn) uIn.focus();
            if (uMsg) {
              uMsg.textContent = "Paste the code, then tap again.";
              uMsg.classList.remove("is-error");
            }
            return;
          }
          if (uMsg) {
            uMsg.textContent = "";
            uMsg.classList.remove("is-error");
          }
          Cloud.redeemUnlockCode(typed).then(function (res) {
            t.disabled = false;
            if (res && res.ok) {
              if (window.FS.Pack && window.FS.Pack.setViewAs) window.FS.Pack.setViewAs("");
              if (Cloud._refreshProfileOrg) {
                Cloud._refreshProfileOrg().then(function () {
                  window.location.reload();
                }).catch(function () {
                  window.location.reload();
                });
              } else {
                window.location.reload();
              }
              return;
            }
            unlockFailCount += 1;
            if (unlockFailCount >= 6) unlockLockedUntil = Date.now() + 20000;
            else if (unlockFailCount >= 3) unlockLockedUntil = Date.now() + 8000;
            if (uMsg) {
              uMsg.textContent = "That code didn’t match.";
              uMsg.classList.add("is-error");
            }
          }).catch(function () {
            t.disabled = false;
            if (uMsg) {
              uMsg.textContent = "That code didn’t match.";
              uMsg.classList.add("is-error");
            }
          });
        }
        t.disabled = true;
        var already = uIn ? String(uIn.value || "").trim() : "";
        if (already) {
          redeemUnlock(already);
          return;
        }
        var clip = (navigator.clipboard && navigator.clipboard.readText)
          ? navigator.clipboard.readText()
          : Promise.reject();
        clip.then(function (text) {
          redeemUnlock(text);
        }).catch(function () {
          t.disabled = false;
          if (uIn) uIn.focus();
          if (uMsg) {
            uMsg.textContent = "Paste the code in the box, then tap again.";
            uMsg.classList.remove("is-error");
          }
        });
        return;
      }
      if (t.id === "notifySponsorBtn") {
        if (!Cloud.isSignedIn()) {
          openAuth(true);
          return;
        }
        var user = Cloud.user();
        if (!user.sponsor_id) {
          FS.UI.say("No leader linked yet — open a join link from your leader, then sign in.");
          return;
        }
        try {
          await Cloud.notifySponsor({
            active: getState().active,
            data: getState().data,
            done: getState().done,
            calendar: getState().data.calendar || {},
            cheers: getState().cheers || [],
            settings: getState().settings,
            tourDone: getState().tourDone
          });
          t.textContent = "Leader notified ✓";
          setTimeout(function () { t.textContent = "Notify my leader"; }, 2000);
        } catch (err) {
          FS.UI.toast(err.message || "Could not notify", { tone: "bad" });
        }
        return;
      }
      if (t.id === "importLiveTreeBtn") {
        if (!Cloud.isSignedIn()) {
          openAuth(true);
          return;
        }
        try {
          var graph = await Cloud.listTeamGraph();
          var roots = graph.roots || [];
          if (!roots.length) {
            FS.UI.say("Nobody on your team yet — share your join link with someone first.");
            return;
          }
          if (!getState || !window.FS.tree) return;
          var result = window.FS.tree.mergeLiveTeam(getState(), roots);
          if (window.FS.idealLeads && window.FS.idealLeads.afterLiveTeamMerge) {
            window.FS.idealLeads.afterLiveTeamMerge();
          }
          if (persist) persist();
          window.FS.tree.render(getState());
          t.textContent = (result.added || result.updated)
            ? ("Marked " + ((result.added || 0) + (result.updated || 0)) + " as said yes ✓")
            : "Already up to date ✓";
          setTimeout(function () { t.textContent = "Mark people who already joined"; }, 2200);
        } catch (err) {
          FS.UI.toast(err.message || "Could not update your dream tree", { tone: "bad" });
        }
        return;
      }
      if (t.id === "cheerDismiss") {
        await Cloud.clearCheers();
        await renderCheers();
        return;
      }
      if (t.id === "leaderNoteDismiss") {
        var stNote = getState && getState();
        var banner = $("leaderNoteBanner");
        var bodyEl = banner && banner.querySelector(".body-p");
        var notesNow = await Cloud.myLeaderNotes();
        var activeNow = stNote ? stNote.active : "welcome";
        var hit = null;
        for (var ni = 0; ni < notesNow.length; ni++) {
          if (notesNow[ni].section_id === activeNow || notesNow[ni].section_id === "welcome") {
            hit = notesNow[ni];
            if (notesNow[ni].section_id === activeNow) break;
          }
        }
        if (stNote && stNote.data) {
          if (!stNote.data.dismissedLeaderNotes) stNote.data.dismissedLeaderNotes = {};
          if (hit) {
            stNote.data.dismissedLeaderNotes[String(hit.section_id || "welcome") + "|" + String(hit.created_at || hit.body || "")] = true;
          } else if (bodyEl) {
            stNote.data.dismissedLeaderNotes["welcome|" + String(bodyEl.textContent || "")] = true;
          }
          if (persist) persist();
        }
        await renderLeaderNoteBanner();
        return;
      }
      if (t.hasAttribute("data-goto-bridge")) {
        if (gotoPanel) gotoPanel(t.getAttribute("data-goto-bridge"));
        return;
      }
      if (t.hasAttribute("data-copy-nudge")) {
        var id = t.getAttribute("data-copy-nudge");
        var src = $("nudge_" + id);
        if (src && navigator.clipboard) {
          navigator.clipboard.writeText(src.textContent).then(function () {
            var label = t.getAttribute("data-copy-label") || "Copy message";
            t.textContent = "Copied ✓";
            setTimeout(function () { t.textContent = label; }, 1400);
          });
        }
        return;
      }
      if (t.id === "teamPersonClose" || t.id === "teamPersonX" || t.id === "teamPersonCancel") {
        closeTeamPersonSheet();
        return;
      }
      if (t.id === "howTheyGrowClose" || t.id === "howTheyGrowX" || t.id === "howTheyGrowCancel") {
        closeHowTheyGrowSheet();
        return;
      }
      if (t.hasAttribute("data-how-grow-fold")) {
        howGrowBoardOpen = !howGrowBoardOpen;
        var fold = t.closest(".how-grow-board");
        if (fold) {
          fold.classList.toggle("is-open", howGrowBoardOpen);
          t.setAttribute("aria-expanded", howGrowBoardOpen ? "true" : "false");
          var body = fold.querySelector(".how-grow-board-body");
          if (body) body.hidden = !howGrowBoardOpen;
        }
        return;
      }
      if (t.hasAttribute("data-how-they-grow")) {
        openHowTheyGrowSheet(t.getAttribute("data-how-they-grow"));
        return;
      }
      if (t.hasAttribute("data-dismiss-team-news")) {
        acknowledgeTeamNews({ hideOverview: true });
        return;
      }
      if (t.hasAttribute("data-dismiss-app-updates")) {
        dismissGroveBoardAppUpdates();
        return;
      }
      if (t.id === "teamMoveClose" || t.id === "teamMoveX" || t.id === "teamMoveCancel") {
        closeTeamMoveSheet();
        return;
      }
      if (t.id === "evResInviteClose" || t.id === "evResInviteX" || t.id === "evResInviteCancel") {
        closeEvResInviteSheet();
        return;
      }
      if (t.id === "groveBoardComposeMsg") {
        openBroadcastSheet();
        return;
      }
      if (t.id === "groveBoardComposePoll" || t.id === "evBoardComposePoll") {
        openBroadcastSheet("poll");
        return;
      }
      if (t.hasAttribute("data-grove-board-compose")) {
        await setGroveBoardCompose(t.getAttribute("data-grove-board-compose"));
        return;
      }
      if (t.hasAttribute("data-grove-board-tab")) {
        var nextTab = t.getAttribute("data-grove-board-tab");
        var bodyEl = $("groveBoardBody");
        if (bodyEl) groveBoardDraft = bodyEl.value || "";
        var bulletinEl = $("bulletinBody");
        if (bulletinEl) bulletinDraft = bulletinEl.value || "";
        var bulletinGoEl = $("bulletinGo");
        if (bulletinGoEl) bulletinGoDraft = bulletinGoEl.value || "";
        setGroveBoardTab(nextTab);
        await renderGroveBoard();
        return;
      }
      if (t.id === "groveBoardSignIn") {
        openAuth();
        return;
      }
      if (t.id === "groveBoardPost") {
        await confirmGroveBoardPost();
        return;
      }
      if (t.id === "bulletinPost") {
        await confirmBulletinPost();
        return;
      }
      if (t.hasAttribute("data-bulletin-remove")) {
        await removeAppBulletin(t.getAttribute("data-bulletin-remove"));
        return;
      }
      if (t.id === "evBoardPost") {
        await confirmEvergreenBoardPost();
        return;
      }
      if (t.hasAttribute("data-ev-board-delete")) {
        var evDelId = t.getAttribute("data-ev-board-delete");
        var evOk = await FS.UI.ask("Remove this note from the Evergreen board?", {
          title: "Remove this note?",
          okText: "Remove",
          danger: true
        });
        if (!evOk) return;
        try {
          await Cloud.deleteEvergreenBoardPost(evDelId);
          evBoardCache = { at: 0, data: null };
          await renderEvergreenBoard();
        } catch (errDel) {
          FS.UI.toast((errDel && errDel.message) || "Could not remove this note.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-board-delete")) {
        try {
          await Cloud.deleteGroveBoardPost(t.getAttribute("data-board-delete"));
          groveHubCache = { at: 0, data: null };
          await renderGroveBoard();
        } catch (err) {
          setGroveBoardMsg((err && err.message) || "Could not remove that.");
        }
        return;
      }
      if (t.hasAttribute("data-broadcast-kind")) {
        setBroadcastKind(t.getAttribute("data-broadcast-kind"));
        return;
      }
      if (t.hasAttribute("data-broadcast-poll-choice")) {
        setBroadcastPollChoice(t.getAttribute("data-broadcast-poll-choice"));
        return;
      }
      if (t.id === "pollSheetAddSlot") {
        collectPollSlots();
        if (pollSlotDrafts.length >= 8) {
          setBroadcastMsg("Eight choices is the max.");
          return;
        }
        pollSlotDrafts.push("");
        paintPollSlots();
        return;
      }
      if (t.hasAttribute("data-poll-slot-remove")) {
        collectPollSlots();
        var rm = parseInt(t.getAttribute("data-poll-slot-remove"), 10);
        if (!isNaN(rm) && pollSlotDrafts.length > 2) pollSlotDrafts.splice(rm, 1);
        paintPollSlots();
        return;
      }
      if (t.hasAttribute("data-poll-save")) {
        await savePollVote(t.getAttribute("data-poll-save"));
        return;
      }
      if (t.hasAttribute("data-poll-close")) {
        try {
          await Cloud.closeTeamPoll(t.getAttribute("data-poll-close"));
          pollVoteDraft = {};
          await refreshPollsUi();
        } catch (err) {
          FS.UI.toast((err && err.message) || "Could not close that poll.", { tone: "bad" });
        }
        return;
      }
      if (t.hasAttribute("data-broadcast-audience")) {
        setBroadcastAudience(t.getAttribute("data-broadcast-audience"));
        return;
      }
      if (t.id === "broadcastSheetClose" || t.id === "broadcastSheetCancel") {
        closeBroadcastSheet();
        return;
      }
      if (t.id === "broadcastConfirmSend") {
        await confirmSendBroadcast();
        return;
      }
      if (t.id === "teamRearrangeToggle" || t.id === "evergreenRearrangeToggle") {
        closeTeamPersonSheet();
        closeTeamMoveSheet();
        setTeamRearrangeOn(!teamRearrangeOn());
        try {
          if (packEvergreen()) {
            await renderEvergreenTeamGraph();
          } else {
            var rearrangeRows = await Cloud.listDownline();
            var rearrangeGraph = await Cloud.listTeamGraph();
            await renderLiveTeamGraph(rearrangeGraph, rearrangeRows);
          }
        } catch (err) {}
        return;
      }
      if (t.hasAttribute("data-team-move")) {
        openTeamMoveSheet(t.getAttribute("data-team-move"));
        return;
      }
      if (t.hasAttribute("data-team-move-to")) {
        await confirmTeamMove(t.getAttribute("data-team-move-to"));
        return;
      }
      if (t.hasAttribute("data-team-move-root")) {
        await confirmTeamMove(null, true);
        return;
      }
      if (t.hasAttribute("data-team-admin")) {
        var adminOn = t.getAttribute("data-admin-on") === "1";
        await toggleOrgAdmin(t.getAttribute("data-team-admin"), adminOn);
        return;
      }
      if (t.hasAttribute("data-team-hub-admin")) {
        var hubOn = t.getAttribute("data-hub-on") === "1";
        await toggleHubAdmin(t.getAttribute("data-team-hub-admin"), hubOn);
        return;
      }
      if (t.hasAttribute("data-team-remove")) {
        await removeTeamPersonFromSheet(t.getAttribute("data-team-remove"));
        return;
      }
      if (t.hasAttribute("data-team-sort")) {
        setTeamSortMode(t.getAttribute("data-team-sort"));
        try {
          if (packEvergreen()) {
            await renderEvergreenTeamGraph();
          } else {
            var sortRows = await Cloud.listDownline();
            var sortGraph = await Cloud.listTeamGraph();
            await renderLiveTeamGraph(sortGraph, sortRows);
          }
        } catch (err) {}
        return;
      }
      if (t.hasAttribute("data-team-person")) {
        e.preventDefault();
        e.stopPropagation();
        await openTeamPersonSheet(t.getAttribute("data-team-person"));
        return;
      }
      if (t.hasAttribute("data-cheer")) {
        openCheerSheet(t.getAttribute("data-cheer"));
        return;
      }
      if (t.hasAttribute("data-leader-log")) {
        var logPid = t.getAttribute("data-leader-log");
        var stLog = getState();
        if (!stLog.data.leaderLogOpen) stLog.data.leaderLogOpen = {};
        stLog.data.leaderLogOpen[logPid] = !stLog.data.leaderLogOpen[logPid];
        persist();
        var wrap = t.closest(".leader-log");
        var panel = wrap && wrap.querySelector(".leader-log-panel");
        var chev = t.querySelector(".leader-log-chev");
        var open = !!stLog.data.leaderLogOpen[logPid];
        t.setAttribute("aria-expanded", open ? "true" : "false");
        if (panel) panel.hidden = !open;
        if (chev) chev.textContent = open ? "▴" : "▾";
        return;
      }
      if (t.id === "cheerSheetClose" || t.id === "cheerSheetCancel") {
        closeCheerSheet();
        return;
      }
      if (t.id === "cheerChooseAnother") {
        advanceCheerTemplate();
        renderCheerSheetPreview();
        return;
      }
      if (t.id === "cheerConfirmSend") {
        await confirmSendCheer();
        return;
      }
      if (t.id === "noteSheetClose" || t.id === "noteSheetCancel") {
        closeNoteSheet();
        return;
      }
      if (t.id === "noteSheetCopy") {
        copyNoteSheetBody();
        return;
      }
      if (t.id === "noteConfirmSend") {
        await confirmSendNote();
        return;
      }
      if (t.hasAttribute("data-note")) {
        openNoteSheet(t.getAttribute("data-note"));
        return;
      }
      if (t.id === "calSheetClose" || t.id === "calSheetX") {
        closeCalSheet();
        return;
      }
      if (t.hasAttribute("data-cal-save")) {
        var stSave = getState();
        var edSave = stSave && stSave.data && stSave.data.calendarEditing;
        if (edSave && $("calTodoRows")) {
          var daySave = Cal.ensureDay(stSave.data.calendar, edSave.date);
          for (var svi = 0; svi < daySave.items.length; svi++) {
            if (daySave.items[svi].id !== edSave.itemId) continue;
            var tasksSave = readTodoTasksFromDom();
            var addSave = $("calTodoAdd");
            if (addSave && String(addSave.value || "").trim()) {
              tasksSave.push({ text: String(addSave.value).trim(), done: false });
              addSave.value = "";
            }
            applyTodoTasks(daySave.items[svi], tasksSave);
          }
          persist();
        }
        closeCalSheet();
        renderCalendar();
        return;
      }
      if (t.id === "curiosityLightboxClose" || t.id === "curiosityLightboxX") {
        closeCuriosityLightbox();
        return;
      }
      if (t.hasAttribute("data-curio-open")) {
        var curioId = t.getAttribute("data-curio-open");
        if (photoPickState()) {
          applyPhotoPick(curioId);
          return;
        }
        openCuriosityLightbox(curioId);
        return;
      }
      if (t.hasAttribute("data-curio-cat")) {
        var browseCat = ensureCuriosityBrowse();
        browseCat.cat = t.getAttribute("data-curio-cat") || "";
        if (persist) persist();
        updateCuriosityPhotoResults();
        return;
      }
      if (t.hasAttribute("data-cal-leader-zooms")) {
        if (!canPeekLeaderTeamZooms()) return;
        var stPeek = getState();
        if (!stPeek || !stPeek.data) return;
        stPeek.data.showLeaderTeamZooms = !stPeek.data.showLeaderTeamZooms;
        persist();
        paintLeaderTeamZoomsToggle();
        refreshOrgEvents(true).then(function () {
          renderGatheringBanner();
          renderCalendar();
        }).catch(function () {
          renderCalendar();
        });
        return;
      }
      if (t.hasAttribute("data-cal-view")) {
        var stV = getState();
        stV.data.calendarView = t.getAttribute("data-cal-view") === "month" ? "month" : "week";
        persist();
        renderCalendar();
        return;
      }
      if (t.hasAttribute("data-cal-board-toggle")) {
        if (packEvergreen()) return;
        var stBoard = getState();
        stBoard.data.calendarBoardOpen = calendarBoardIsOpen(stBoard) ? false : true;
        persist();
        renderCalendar();
        return;
      }
      if (t.hasAttribute("data-cal-nav") || t.hasAttribute("data-cal-week")) {
        var stW = getState();
        var delta = t.getAttribute("data-cal-nav") || t.getAttribute("data-cal-week");
        var isMonth = stW.data.calendarView === "month";
        if (delta === "0") {
          if (isMonth) stW.data.calendarMonthOffset = 0;
          else stW.data.calendarWeekOffset = 0;
        } else {
          var n = parseInt(delta, 10) || 0;
          if (isMonth) stW.data.calendarMonthOffset = (stW.data.calendarMonthOffset || 0) + n;
          else stW.data.calendarWeekOffset = (stW.data.calendarWeekOffset || 0) + n;
        }
        persist();
        renderCalendar();
        return;
      }
      if (t.hasAttribute("data-cal-select")) {
        var nextDay = t.getAttribute("data-cal-select");
        if (!nextDay) return;
        selectCalendarDay(nextDay);
        return;
      }
      if (t.hasAttribute("data-cal-setup-toggle")) {
        var stSetup = getState();
        stSetup.data.calendarSetupOpen = !stSetup.data.calendarSetupOpen;
        persist();
        renderCalendar();
        return;
      }
      if (t.hasAttribute("data-cal-cadence")) {
        var stCad = getState();
        var mode = t.getAttribute("data-cal-cadence");
        if (mode === "fill") {
          stCad.data.calendarCadence = true;
          Cal.applyCadenceFill(stCad.data.calendar, stCad.data, window.FS.CONFIG);
        } else {
          stCad.data.calendarCadence = false;
          Cal.clearCadenceSuggestions(stCad.data.calendar);
        }
        stCad.data.calendarSetupOpen = false;
        persist();
        renderCalendar();
        if (typeof window.FS.onCalendarChange === "function") window.FS.onCalendarChange();
        return;
      }
      if (t.hasAttribute("data-cal-new")) {
        createCard(t.getAttribute("data-cal-new"));
        return;
      }
      if (t.hasAttribute("data-org-new")) {
        openOrgEventEditor(null, t.getAttribute("data-org-new"), { audience: "org" });
        return;
      }
      if (t.hasAttribute("data-org-downline")) {
        openOrgEventEditor(null, t.getAttribute("data-org-downline"), { audience: "downline" });
        return;
      }
      if (t.hasAttribute("data-org-personal")) {
        openOrgEventEditor(null, t.getAttribute("data-org-personal"), { audience: "self" });
        return;
      }
      if (t.hasAttribute("data-org-view")) {
        openOrgEventViewer(t.getAttribute("data-org-view"), t.getAttribute("data-org-on") || "");
        return;
      }
      if (t.hasAttribute("data-org-leader-star")) {
        var on = t.getAttribute("aria-pressed") !== "true";
        t.setAttribute("aria-pressed", on ? "true" : "false");
        t.classList.toggle("is-on", on);
        syncOrgEventLeaderKind(on);
        return;
      }
      if (t.hasAttribute("data-org-copy-grove")) {
        await copyOrgEventToGroveById(t.getAttribute("data-org-copy-grove"));
        return;
      }
      if (t.hasAttribute("data-org-edit")) {
        openOrgEventEditor(t.getAttribute("data-org-edit"), null, {
          on: t.getAttribute("data-org-on") || ""
        });
        return;
      }
      if (t.hasAttribute("data-org-save")) {
        await saveOrgEventFromSheet(t.getAttribute("data-org-save") || null);
        return;
      }
      if (t.hasAttribute("data-org-delete")) {
        await deleteOrgEventById(t.getAttribute("data-org-delete"));
        return;
      }
      if (t.hasAttribute("data-org-add-cal")) {
        var calEv = orgEventForCalendar(t.getAttribute("data-org-add-cal"), t.getAttribute("data-org-cal-on"));
        if (calEv) downloadOrgEventIcs(calEv);
        return;
      }
      if (t.hasAttribute("data-org-add-gcal")) {
        var gcalEv = orgEventForCalendar(t.getAttribute("data-org-add-gcal"), t.getAttribute("data-org-cal-on"));
        if (gcalEv) openGoogleCal(gcalEv);
        return;
      }
      if (t.hasAttribute("data-org-copy-invite")) {
        var inviteEv = findOrgEvent(t.getAttribute("data-org-copy-invite"));
        if (!inviteEv || effectiveOrgKind(inviteEv) !== "info_zoom") return;
        var edInvite = getState() && getState().data && getState().data.orgEventEditing;
        inviteEv = orgEventAt(inviteEv, edInvite && edInvite.on);
        await copyTextWithFallback(buildInfoZoomInviteText(inviteEv), t, "Copied ✓");
        return;
      }
      if (t.hasAttribute("data-org-copy-link")) {
        var copyEv = findOrgEvent(t.getAttribute("data-org-copy-link"));
        var link = orgEventJoinUrl(copyEv);
        if (!link) return;
        await copyTextWithFallback(link, t, "Copied ✓");
        return;
      }
      if (t.hasAttribute("data-yt-play")) {
        var wrap = t.closest("[data-yt-player]");
        var YT = window.FS.YouTube;
        if (!wrap || !YT) return;
        var parsed = {
          id: t.getAttribute("data-yt-id") || "",
          start: parseInt(t.getAttribute("data-yt-start"), 10) || 0
        };
        if (!parsed.id) return;
        wrap.classList.add("is-playing");
        wrap.innerHTML = YT.iframeHtml(parsed, t.getAttribute("data-yt-title") || "Replay", { autoplay: true });
        return;
      }
      if (t.hasAttribute("data-org-copy-replay")) {
        var replayEv = findOrgEvent(t.getAttribute("data-org-copy-replay"));
        var edReplay = getState() && getState().data && getState().data.orgEventEditing;
        replayEv = orgEventAt(replayEv, edReplay && edReplay.on);
        var replayLink = orgEventReplayUrl(replayEv, edReplay && edReplay.on);
        if (!replayLink) return;
        var replayText = (effectiveOrgKind(replayEv) === "info_zoom")
          ? buildInfoZoomReplayText(replayEv)
          : replayLink;
        await copyTextWithFallback(replayText, t, "Copied ✓");
        return;
      }
      if (t.hasAttribute("data-org-resource")) {
        if (packEvergreen()) return;
        var resource = t.getAttribute("data-org-resource") || "";
        var stRes = getState && getState();
        if (!stRes) return;
        if (!stRes.data) stRes.data = {};
        closeCalSheet();
        if (resource === "talk-invite") {
          stRes.data.openTalk = "talk_invite-info-zoom";
          stRes.data.talkFocusPending = true;
          if (persist) persist();
          if (gotoPanel) gotoPanel("talk");
        } else if (resource === "vault-invite") {
          if (!stRes.data.vaultBrowse) stRes.data.vaultBrowse = {};
          if (!stRes.data.vaultBrowse.vault) {
            stRes.data.vaultBrowse.vault = { q: "", format: "", promoting: "", lane: "all" };
          }
          stRes.data.vaultBrowse.vault.q = "info zoom";
          stRes.data.vaultBrowse.vault.format = "facebook";
          stRes.data.vaultBrowse.vault.promoting = "";
          stRes.data.vaultBrowse.vault.lane = "all";
          if (persist) persist();
          if (gotoPanel) gotoPanel("content-vault");
        }
        return;
      }
      if (t.hasAttribute("data-gathering-reveal")) {
        gatheringBannerLinkOpenKey = String(t.getAttribute("data-gathering-reveal") || "") +
          ":" + String(t.getAttribute("data-gathering-on") || "");
        renderGatheringBanner();
        return;
      }
      if (t.hasAttribute("data-gathering-dismiss")) {
        dismissGatheringBanner(t.getAttribute("data-gathering-dismiss"), t.getAttribute("data-gathering-on") || "");
        return;
      }
      if (t.hasAttribute("data-cal-lead-follow")) {
        var followLeadId = t.getAttribute("data-cal-lead-follow");
        snoozeLeadFollow(followLeadId);
        leadHighlightId = followLeadId;
        setLeadMore(followLeadId, true);
        if (gotoPanel) gotoPanel("leads");
        renderLeadsList();
        return;
      }
      if (t.hasAttribute("data-cal-accept")) {
        acceptSuggestion(t.getAttribute("data-cal-accept"));
        return;
      }
      if (t.hasAttribute("data-cal-edit")) {
        openEditor(t.getAttribute("data-cal-edit"), t.getAttribute("data-cal-item"));
        return;
      }
      if (t.hasAttribute("data-lib-tab")) {
        var stLib = getState();
        stLib.data.libraryTab = t.getAttribute("data-lib-tab");
        persist();
        renderLibrary();
        return;
      }
      if (t.hasAttribute("data-lib-open")) {
        openLibraryIdea(t.getAttribute("data-lib-open"), t.getAttribute("data-lib-id"));
        return;
      }
      if (t.hasAttribute("data-lib-commit")) {
        commitLibraryIdea();
        return;
      }
      if (t.hasAttribute("data-lib-add")) {
        var lib = libraryItem(t.getAttribute("data-lib-add"), t.getAttribute("data-lib-id"));
        if (!lib) return;
        var stAdd = getState();
        var dateAdd = stAdd.data.calendarSelected || Cal.ymd(new Date());
        createCard(dateAdd, {
          type: lib.type || "open_loop",
          title: lib.title || "",
          draft: lib.body || "",
          image: lib.image || "",
          imageId: lib.imageId || ""
        });
        return;
      }
      if (t.hasAttribute("data-cal-type")) {
        var stType = getState();
        var edType = stType.data.calendarEditing;
        if (!edType) return;
        var nextType = t.getAttribute("data-cal-type");
        var dayType = Cal.ensureDay(stType.data.calendar, edType.date);
        for (var ti = 0; ti < dayType.items.length; ti++) {
          if (dayType.items[ti].id === edType.itemId) {
            var curGroup = Cal.editorTypeId ? Cal.editorTypeId(dayType.items[ti].type) : dayType.items[ti].type;
            if (curGroup === nextType) applyCalendarItemType(dayType.items[ti], "", stType, edType.date);
            else applyCalendarItemType(dayType.items[ti], nextType, stType, edType.date);
          }
        }
        persist();
        renderCalendar();
        renderCalEditor();
        if (typeof window.FS.onCalendarChange === "function") window.FS.onCalendarChange();
        return;
      }
      if (t.hasAttribute("data-cal-status")) {
        var st2 = getState();
        var ed = st2.data.calendarEditing;
        if (!ed) return;
        var day2 = Cal.ensureDay(st2.data.calendar, ed.date);
        for (var si = 0; si < day2.items.length; si++) {
          if (day2.items[si].id === ed.itemId) {
            var draftEl = $("calDraft");
            var personEl2 = $("calPerson");
            var titleEl2 = $("calTitle");
            if (draftEl) day2.items[si].draft = draftEl.value;
            if (personEl2) day2.items[si].person = personEl2.value;
            if (titleEl2) day2.items[si].title = titleEl2.value;
            if ($("calTodoRows")) {
              var tasksSt = readTodoTasksFromDom();
              var addSt = $("calTodoAdd");
              if (addSt && String(addSt.value || "").trim()) {
                tasksSt.push({ text: String(addSt.value).trim(), done: false });
                addSt.value = "";
              }
              applyTodoTasks(day2.items[si], tasksSt);
            }
            var nextStSet = t.getAttribute("data-cal-status");
            day2.items[si].status = day2.items[si].status === nextStSet ? "" : nextStSet;
          }
        }
        persist();
        var statusRow = t.closest(".cal-status-row");
        if (statusRow) {
          var btns = statusRow.querySelectorAll("[data-cal-status]");
          var onSt = "";
          var edItem = null;
          for (var si2 = 0; si2 < day2.items.length; si2++) {
            if (day2.items[si2].id === ed.itemId) edItem = day2.items[si2];
          }
          onSt = (edItem && edItem.status) || "";
          for (var sb = 0; sb < btns.length; sb++) {
            btns[sb].classList.toggle("on", !!onSt && btns[sb].getAttribute("data-cal-status") === onSt);
          }
        }
        renderCalendar();
        if (typeof window.FS.onCalendarChange === "function") window.FS.onCalendarChange();
        return;
      }
      if (t.hasAttribute("data-cal-delete")) {
        var stDel = getState();
        var edDel = stDel.data.calendarEditing;
        if (!edDel) return;
        var dayDel = Cal.ensureDay(stDel.data.calendar, edDel.date);
        dayDel.items = dayDel.items.filter(function (it) { return it.id !== edDel.itemId; });
        if (!dayDel.items.length) delete stDel.data.calendar[edDel.date];
        persist();
        closeCalSheet();
        renderCalendar();
        if (typeof window.FS.onCalendarChange === "function") window.FS.onCalendarChange();
        return;
      }
      if (t.hasAttribute("data-cal-swap")) {
        var st3 = getState();
        var ed3 = st3.data.calendarEditing;
        if (!ed3) return;
        var day3 = Cal.ensureDay(st3.data.calendar, ed3.date);
        var item3 = null;
        for (var di = 0; di < day3.items.length; di++) {
          if (day3.items[di].id === ed3.itemId) item3 = day3.items[di];
        }
        if (!item3) return;
        var alts = (window.FS.ContentPick && window.FS.ContentPick.alternativesForType)
          ? window.FS.ContentPick.alternativesForType(item3.type)
          : [];
        if (!alts.length) return;
        var idx = (item3.altIndex || 0) + 1;
        if (idx >= alts.length) idx = 0;
        item3.altIndex = idx;
        item3.draft = alts[idx].body;
        persist();
        renderCalEditor();
        return;
      }
    });
  }

  function parseIsoMs(s) {
    if (!s) return 0;
    var t = Date.parse(s);
    return isFinite(t) ? t : 0;
  }

  function fieldHasContent(v) {
    if (v == null) return false;
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "string") return !!String(v).trim();
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return true;
  }

  function contentScore(data, done, settings) {
    data = data || {};
    done = done || {};
    settings = settings || {};
    var score = 0;
    if (String(settings.partnerName || "").trim()) score += 30;
    if (String(settings.partnerLastName || "").trim()) score += 10;
    if (String(settings.hubMode || "").trim()) score += 40;
    var skip = {
      calendar: 1, panelScroll: 1, installPlatform: 1, onboardCircleAck: 1,
      teamSeenIds: 1, supportSeenCompletions: 1, appBulletinSeen: 1, teamSeenSeeded: 1
    };
    Object.keys(data).forEach(function (k) {
      if (skip[k]) return;
      var v = data[k];
      if (typeof v === "string") score += Math.min(200, String(v).trim().length);
      else if (fieldHasContent(v)) score += 15;
    });
    Object.keys(done).forEach(function (k) {
      if (done[k]) score += 20;
    });
    if (data.calendar && typeof data.calendar === "object") {
      Object.keys(data.calendar).forEach(function (date) {
        var items = (data.calendar[date] && data.calendar[date].items) || [];
        score += items.length * 25;
      });
    }
    if (data.tree && Array.isArray(data.tree)) score += data.tree.length * 15;
    return score;
  }

  function workScore(data, done, calendar) {
    return contentScore(Object.assign({}, data || {}, { calendar: calendar || (data && data.calendar) || {} }), done || {}, {});
  }

  function looksLikeWipe(richScore, poorScore) {
    return richScore >= 20 && poorScore * 3 < richScore;
  }

  function enqueueSync(fn) {
    var next = syncChain.then(function () { return fn(); }, function () { return fn(); });
    syncChain = next.then(function () { return null; }, function () { return null; });
    return next;
  }

  function cloneJson(v) {
    if (v == null) return v;
    try { return JSON.parse(JSON.stringify(v)); } catch (e) { return v; }
  }

  function valuesEqual(a, b) {
    if (a === b) return true;
    if (a == null && b == null) return true;
    try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; }
  }

  function progressWriteSame(remote, next) {
    if (!remote || !next) return false;
    var remoteData = cloneJson(remote.data || {}) || {};
    var nextData = cloneJson(next.data || {}) || {};
    delete remoteData.calendar;
    delete nextData.calendar;
    return valuesEqual(remote.active || "", next.active || "") &&
      valuesEqual(remoteData, nextData) &&
      valuesEqual(remote.done || {}, next.done || {}) &&
      valuesEqual(remote.calendar || {}, next.calendar || {});
  }

  function syncBaseKey() {
    var root = (window.FS.CONFIG && window.FS.CONFIG.storeKey) || "firstSeeds_v6";
    var user = Cloud.user && Cloud.user();
    var id = user && user.id ? String(user.id) : "";
    return root + "_syncbase_" + id;
  }

  function readSyncBase() {
    var key = syncBaseKey();
    if (syncBase && syncBaseForKey === key) return syncBase;
    try {
      var raw = localStorage.getItem(key);
      if (!raw) {
        syncBase = null;
        syncBaseForKey = key;
        return null;
      }
      syncBase = JSON.parse(raw);
      syncBaseForKey = key;
      return syncBase;
    } catch (e) {
      syncBase = null;
      syncBaseForKey = "";
      return null;
    }
  }

  function writeSyncBase(state, updatedAt) {
    if (!state) return;
    var data = cloneJson(state.data || {}) || {};
    var cal = cloneJson(data.calendar || {}) || {};
    delete data.calendar;
    var key = syncBaseKey();
    syncBase = {
      updated_at: updatedAt || state.savedAt || new Date().toISOString(),
      data: data,
      done: cloneJson(state.done || {}) || {},
      calendar: cal
    };
    syncBaseForKey = key;
    try { localStorage.setItem(key, JSON.stringify(syncBase)); } catch (e) {}
  }

  function threeWayPick(localVal, remoteVal, baseVal, localNewer) {
    var locCh = !valuesEqual(localVal, baseVal);
    var remCh = !valuesEqual(remoteVal, baseVal);
    if (locCh && !remCh) return cloneJson(localVal);
    if (remCh && !locCh) return cloneJson(remoteVal);
    if (!locCh && !remCh) return cloneJson(remoteVal !== undefined ? remoteVal : localVal);
    return cloneJson(localNewer ? localVal : remoteVal);
  }

  function collectKeys(a, b, c) {
    var keys = {};
    [a || {}, b || {}, c || {}].forEach(function (obj) {
      Object.keys(obj).forEach(function (k) { keys[k] = true; });
    });
    return Object.keys(keys);
  }

  function mergeMapsThreeWay(remoteMap, localMap, baseMap, localNewer) {
    remoteMap = remoteMap || {};
    localMap = localMap || {};
    baseMap = baseMap || {};
    var out = {};
    collectKeys(remoteMap, localMap, baseMap).forEach(function (k) {
      var picked = threeWayPick(localMap[k], remoteMap[k], baseMap[k], localNewer);
      if (picked !== undefined) out[k] = picked;
    });
    return out;
  }

  function itemsByKey(items) {
    var map = {};
    (items || []).forEach(function (it) {
      var k = itemMergeKey(it);
      if (k) map[k] = it;
    });
    return map;
  }

  function itemMergeKey(it) {
    if (!it) return "";
    if (it.id) return "id:" + it.id;
    return "f:" + [it.type || "", it.title || "", it.person || "", (it.notes || "").slice(0, 48)].join("|");
  }

  function mergeDayItems(remItems, locItems, localNewer, baseItems) {
    remItems = remItems || [];
    locItems = locItems || [];
    if (!baseItems) {
      var map = {};
      var order = [];
      function take(it, overwrite) {
        var k = itemMergeKey(it) || ("anon:" + order.length);
        if (!Object.prototype.hasOwnProperty.call(map, k)) {
          order.push(k);
          map[k] = it;
        } else if (overwrite) {
          map[k] = it;
        }
      }
      if (localNewer) {
        remItems.forEach(function (it) { take(it, false); });
        locItems.forEach(function (it) { take(it, true); });
      } else {
        locItems.forEach(function (it) { take(it, false); });
        remItems.forEach(function (it) { take(it, true); });
      }
      return order.map(function (k) { return map[k]; });
    }
    var remMap = itemsByKey(remItems);
    var locMap = itemsByKey(locItems);
    var baseMap = itemsByKey(baseItems);
    var out = [];
    var seen = {};
    function pushPicked(k) {
      if (!k || seen[k]) return;
      var rem = remMap[k];
      var loc = locMap[k];
      var base = baseMap[k];
      var locGone = !!base && !loc;
      var remGone = !!base && !rem;
      var locCh = !valuesEqual(loc, base);
      var remCh = !valuesEqual(rem, base);
      seen[k] = true;
      if (locGone && remGone) return;
      if (locGone && !remCh) return;
      if (remGone && !locCh) return;
      if (locGone && remCh) { out.push(cloneJson(rem)); return; }
      if (remGone && locCh) { out.push(cloneJson(loc)); return; }
      var picked = threeWayPick(loc, rem, base, localNewer);
      if (picked) out.push(picked);
    }
    remItems.concat(locItems).concat(baseItems || []).forEach(function (it) {
      pushPicked(itemMergeKey(it));
    });
    return out;
  }

  function mergeCalendars(remoteCal, localCal, localNewer, baseCal) {
    remoteCal = remoteCal || {};
    localCal = localCal || {};
    if (!baseCal) {
      /* No baseline yet — union days so neither device drops the other's dates. */
      var outOld = {};
      collectKeys(remoteCal, localCal, {}).forEach(function (date) {
        var rem = remoteCal[date];
        var loc = localCal[date];
        if (loc && rem) {
          var day = {};
          var src = localNewer ? loc : rem;
          Object.keys(src || {}).forEach(function (k) {
            if (k !== "items") day[k] = cloneJson(src[k]);
          });
          day.items = mergeDayItems(rem.items, loc.items, localNewer, null);
          outOld[date] = day;
        } else {
          var picked = localNewer ? (loc || rem) : (rem || loc);
          if (picked) outOld[date] = cloneJson(picked);
        }
      });
      return outOld;
    }
    var out = {};
    collectKeys(remoteCal, localCal, baseCal).forEach(function (date) {
      var rem = remoteCal[date];
      var loc = localCal[date];
      var base = baseCal[date];
      var locGone = !!base && !loc;
      var remGone = !!base && !rem;
      var locCh = !valuesEqual(loc, base);
      var remCh = !valuesEqual(rem, base);
      if (locGone && remGone) return;
      if (locGone && !remCh) return;
      if (remGone && !locCh) return;
      if (locGone && remCh) { out[date] = cloneJson(rem); return; }
      if (remGone && locCh) { out[date] = cloneJson(loc); return; }
      if (loc && rem) {
        var day = {};
        var src = localNewer ? loc : rem;
        Object.keys(src || {}).forEach(function (k) {
          if (k !== "items") day[k] = cloneJson(src[k]);
        });
        day.items = mergeDayItems(rem.items, loc.items, localNewer, (base && base.items) || []);
        out[date] = day;
        return;
      }
      var picked = threeWayPick(loc, rem, base, localNewer);
      if (picked) out[date] = picked;
    });
    return out;
  }

  function mergeFieldMaps(remoteData, localData, localNewer, baseData) {
    remoteData = remoteData || {};
    localData = localData || {};
    if (baseData) return mergeMapsThreeWay(remoteData, localData, baseData, localNewer);
    /* First sync on a device has no baseline. A fresh empty phone must not
       overwrite the computer just because it stamped savedAt a second later. */
    var out = {};
    collectKeys(remoteData, localData, {}).forEach(function (k) {
      var loc = localData[k];
      var rem = remoteData[k];
      var locHas = fieldHasContent(loc);
      var remHas = fieldHasContent(rem);
      if (locHas && !remHas) out[k] = cloneJson(loc);
      else if (remHas && !locHas) out[k] = cloneJson(rem);
      else if (locHas && remHas) out[k] = cloneJson(localNewer ? loc : rem);
      else if (localNewer && loc !== undefined) out[k] = cloneJson(loc);
      else if (rem !== undefined) out[k] = cloneJson(rem);
    });
    return out;
  }

  async function mergeCloudProgress() {
    if (!Cloud.isSignedIn() || !setStateFromCloud) return;
    var user = Cloud.user();
    if (bindProgressAccount && user && user.id) {
      try { bindProgressAccount(user.id); } catch (e) {
        console.warn("[First Seeds] bind account:", e);
      }
    }
    var local = getState();
    if (local && local.settings && local.settings.boundUserId && user && local.settings.boundUserId !== user.id) {
      console.warn("[First Seeds] refusing sync — local bucket belongs to another account");
      if (window.FS.markCloudSyncError) {
        window.FS.markCloudSyncError({
          message: "This device’s saved progress belongs to a different account — cloud sync is paused so we don’t overwrite either one."
        });
      }
      return;
    }
    var remote = await Cloud.pullProgress();
    local = getState();
    if (!remote) {
      await Cloud.pushProgress({
        active: local.active,
        data: local.data,
        done: local.done,
        calendar: local.data.calendar || {},
        cheers: [],
        settings: local.settings,
        tourDone: local.tourDone
      });
      /* Still paint local state so deep-links / bind-account aren't stuck. */
      setStateFromCloud({
        active: local.active,
        data: local.data,
        done: local.done,
        settings: local.settings,
        tourDone: local.tourDone,
        cheers: local.cheers || []
      });
      writeSyncBase(getState(), new Date().toISOString());
      lastMergeAt = Date.now();
      return;
    }
    /* 3-way merge when we have a last-synced baseline so two devices can
       edit different fields without the newer snapshot wiping the other. */
    var localMs = parseIsoMs(local.savedAt);
    var remoteMs = parseIsoMs(remote.updated_at);
    var localNewer = localMs >= remoteMs;
    var base = readSyncBase();
    var remoteData = remote.data || {};
    var localData = local.data || {};
    var remoteDone = remote.done || {};
    var localDone = local.done || {};
    var remoteCal = remote.calendar || {};
    var locSet = local.settings || {};
    /* Names/mode live on the profile too — don't let them hide a runway wipe. */
    var localScore = workScore(localData, localDone, (local.data && local.data.calendar) || {});
    var remoteScore = workScore(remoteData, remoteDone, remoteCal);
    var treatAsFirstSync = !base;
    if (!base) {
      if (looksLikeWipe(remoteScore, localScore)) localNewer = false;
      else if (looksLikeWipe(localScore, remoteScore)) localNewer = true;
    } else {
      var baseScore = workScore(base.data, base.done, base.calendar);
      /* A new phone that already pushed a blank row looks like a remote wipe.
         Don’t let that erase the computer on the next open. */
      if (looksLikeWipe(baseScore, remoteScore) && localScore * 2 >= baseScore) {
        remoteData = cloneJson(base.data) || {};
        remoteDone = cloneJson(base.done) || {};
        remoteCal = cloneJson(base.calendar) || {};
        remoteScore = baseScore;
        localNewer = true;
        treatAsFirstSync = true;
      } else if (looksLikeWipe(baseScore, localScore) && remoteScore * 2 >= baseScore) {
        localNewer = false;
        treatAsFirstSync = true;
      }
    }
    /* After a wipe, three-way would treat empty fields as “I cleared this.”
       Fall back to content-wins so the rich side is kept. */
    var baseData = (base && !treatAsFirstSync && base.data) || null;
    var baseDone = (base && !treatAsFirstSync && base.done) || null;
    var baseCal = (base && !treatAsFirstSync && base.calendar) || null;
    var mergedData = mergeFieldMaps(remoteData, localData, localNewer, baseData);
    mergedData.teamSeenIds = Object.assign({}, remoteData.teamSeenIds || {}, localData.teamSeenIds || {});
    mergedData.supportSeenCompletions = Object.assign({}, remoteData.supportSeenCompletions || {}, localData.supportSeenCompletions || {});
    mergedData.appBulletinSeen = Object.assign({}, remoteData.appBulletinSeen || {}, localData.appBulletinSeen || {});
    if (remoteData.teamSeenSeeded || localData.teamSeenSeeded) mergedData.teamSeenSeeded = true;
    var mergedDone = baseDone
      ? mergeMapsThreeWay(remoteDone, localDone, baseDone, localNewer)
      : (function () {
        var out = {};
        Object.keys(remoteDone).concat(Object.keys(localDone)).forEach(function (k) {
          out[k] = !!(remoteDone[k] || localDone[k]);
        });
        return out;
      })();
    var mergedCal = mergeCalendars(remoteCal, (local.data && local.data.calendar) || {}, localNewer, baseCal);
    var cloudUser = Cloud.user() || {};
    setStateFromCloud({
      data: Object.assign(mergedData, { calendar: mergedCal }),
      done: mergedDone,
      active: localNewer
        ? (local.active && local.active !== "welcome" ? local.active : (remote.active || local.active))
        : (remote.active && remote.active !== "welcome" ? remote.active : (local.active || remote.active)),
      settings: {
        hubMode: localNewer
          ? (locSet.hubMode || cloudUser.hub_mode || "")
          : (cloudUser.hub_mode || locSet.hubMode || ""),
        partnerName: localNewer
          ? (locSet.partnerName || cloudUser.display_name || "")
          : (cloudUser.display_name || locSet.partnerName || ""),
        partnerLastName: localNewer
          ? (locSet.partnerLastName || cloudUser.last_name || "")
          : (cloudUser.last_name || locSet.partnerLastName || ""),
        growthMoment: typeof locSet.growthMoment === "boolean" ? locSet.growthMoment : true,
        growthToast: typeof locSet.growthToast === "boolean" ? locSet.growthToast : true,
        weekStartsOn: locSet.weekStartsOn === "monday" ? "monday" : "sunday",
        boundUserId: (user && user.id) || locSet.boundUserId || "",
        wasOrgLeader: !!locSet.wasOrgLeader,
        groveLeaderWelcomeAcked: !!locSet.groveLeaderWelcomeAcked,
        clientsArrivalAcked: !!locSet.clientsArrivalAcked
      },
      tourDone: localNewer ? !!local.tourDone : !!(cloudUser.tour_done || local.tourDone),
      cheers: remote.cheers || [],
      savedAt: localNewer ? (local.savedAt || remote.updated_at || "") : (remote.updated_at || local.savedAt || "")
    });
    var next = getState();
    if (!progressWriteSame(remote, {
      active: next.active,
      data: next.data,
      done: next.done,
      calendar: (next.data && next.data.calendar) || {}
    })) {
      await Cloud.pushProgress({
        active: next.active,
        data: next.data,
        done: next.done,
        calendar: (next.data && next.data.calendar) || {},
        cheers: remote.cheers || [],
        settings: next.settings,
        tourDone: next.tourDone
      });
    }
    writeSyncBase(getState(), new Date().toISOString());
    lastMergeAt = Date.now();
  }

  function mergeCloudProgressQueued() {
    return enqueueSync(function () { return mergeCloudProgress(); });
  }

  async function pushProgressNow() {
    if (!Cloud.isSignedIn()) return;
    var s = getState();
    var u = Cloud.user();
    if (s && s.settings && s.settings.boundUserId && u && s.settings.boundUserId !== u.id) {
      throw new Error("Signed-in account doesn’t match this device’s saved progress.");
    }
    var base = readSyncBase();
    var remote = null;
    try { remote = await Cloud.pullProgress(); } catch (ePull) { remote = null; }
    var remoteMs = remote ? parseIsoMs(remote.updated_at) : 0;
    var baseMs = base ? parseIsoMs(base.updated_at) : 0;
    var localScore = workScore(s.data, s.done, (s.data && s.data.calendar) || {});
    var remoteScore = remote ? workScore(remote.data, remote.done, remote.calendar) : 0;
    if (remote && (looksLikeWipe(remoteScore, localScore) || !base || remoteMs > baseMs + 2000)) {
      return mergeCloudProgress();
    }
    await Cloud.pushProgress({
      active: s.active,
      data: s.data,
      done: s.done,
      calendar: s.data.calendar || {},
      cheers: s.cheers || [],
      settings: s.settings,
      tourDone: s.tourDone
    });
    writeSyncBase(s, new Date().toISOString());
  }

  function vaultPlanState() {
    var st = getState();
    if (!st.data.vaultPlan || typeof st.data.vaultPlan !== "object") {
      st.data.vaultPlan = { startedOn: "", startWeek: 1, intensity: "full" };
    }
    if (st.data.vaultPlan.intensity !== "light") st.data.vaultPlan.intensity = "full";
    if (!(st.data.vaultPlan.startWeek >= 1 && st.data.vaultPlan.startWeek <= 8)) {
      st.data.vaultPlan.startWeek = 1;
    }
    return st.data.vaultPlan;
  }

  function mondayOf(d) {
    return Cal.startOfWeek(d || new Date(), 1);
  }

  function liveWeekIndex() {
    var plan = vaultPlanState();
    if (!plan.startedOn) return 1;
    var startMon = mondayOf(Cal.parseYmd(plan.startedOn));
    var thisMon = mondayOf(new Date());
    var weeks = Math.round((thisMon.getTime() - startMon.getTime()) / (7 * 24 * 60 * 60 * 1000));
    if (weeks < 0) weeks = 0;
    var startW = plan.startWeek >= 1 && plan.startWeek <= 8 ? plan.startWeek : 1;
    return ((startW - 1 + weeks) % 8) + 1;
  }

  function displayedWeekIndex() {
    var st = getState();
    if (st.data.vaultWeekFollow === false) {
      var saved = st.data.vaultWeekIndex;
      if (saved >= 1 && saved <= 8) return saved;
    }
    if (vaultPlanState().startedOn) {
      var live = liveWeekIndex();
      st.data.vaultWeekIndex = live;
      return live;
    }
    return 1;
  }

  function planWeekDates(weekIdx) {
    var thisMon = mondayOf(new Date());
    var delta = 0;
    if (vaultPlanState().startedOn) {
      delta = (weekIdx - liveWeekIndex() + 8) % 8;
    }
    var mon = Cal.addDays(thisMon, delta * 7);
    var names = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    var map = {};
    for (var i = 0; i < 7; i++) map[names[i]] = Cal.ymd(Cal.addDays(mon, i));
    return map;
  }

  function weekOffsetForDate(dateKey) {
    var weekStart = weekStartPref(getState());
    var todayStart = Cal.startOfWeek(new Date(), weekStart);
    var targetStart = Cal.startOfWeek(Cal.parseYmd(dateKey), weekStart);
    return Math.round((targetStart.getTime() - todayStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  }

  function dateHasVaultId(dateKey, vaultId) {
    var st = getState();
    var day = st.data.calendar && st.data.calendar[dateKey];
    var items = (day && day.items) || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].vaultId === vaultId) return true;
    }
    return false;
  }

  function weekPlanByIndex(idx) {
    var list = (vaultMeta().weekPlan || []);
    for (var i = 0; i < list.length; i++) if (list[i].week === idx) return list[i];
    return null;
  }

  function daysForIntensity(planDays, intensity) {
    var posting = [];
    (planDays || []).forEach(function (d) {
      var parsed = parseWeekDayNote(d.note);
      if (parsed.isRest || !parsed.vaultId || !findVaultPost(parsed.vaultId)) return;
      posting.push(d);
    });
    if (intensity !== "light") return posting;
    var rank = { MON: 0, WED: 1, FRI: 2, THU: 3, SAT: 4, TUE: 5, SUN: 6 };
    var feed = posting.filter(function (d) {
      var post = findVaultPost(parseWeekDayNote(d.note).vaultId);
      return post && post.format !== "story" && post.kind !== "story";
    });
    var pool = feed.length >= 3 ? feed : posting;
    return pool.slice().sort(function (a, b) {
      return (rank[a.dow] || 9) - (rank[b.dow] || 9);
    }).slice(0, 3);
  }

  function weekPlanApplied(weekIdx) {
    var plan = weekPlanByIndex(weekIdx);
    if (!plan) return false;
    var dates = planWeekDates(weekIdx);
    var days = daysForIntensity(plan.days || [], vaultPlanState().intensity);
    if (!days.length) return false;
    for (var i = 0; i < days.length; i++) {
      var parsed = parseWeekDayNote(days[i].note);
      var dateKey = dates[days[i].dow];
      if (!parsed.vaultId || !dateKey || !dateHasVaultId(dateKey, parsed.vaultId)) return false;
    }
    return true;
  }

  function applyWeekPlanToCalendar() {
    var st = getState();
    var planState = vaultPlanState();
    var weekIdx = displayedWeekIndex();
    var plan = weekPlanByIndex(weekIdx);
    if (!plan) return;
    if (!planState.startedOn) {
      planState.startedOn = Cal.ymd(mondayOf(new Date()));
      planState.startWeek = weekIdx;
      st.data.vaultWeekFollow = true;
      st.data.vaultWeekIndex = weekIdx;
    }
    var dates = planWeekDates(weekIdx);
    var days = daysForIntensity(plan.days || [], planState.intensity);
    var added = 0;
    days.forEach(function (d) {
      var parsed = parseWeekDayNote(d.note);
      var post = parsed.vaultId ? findVaultPost(parsed.vaultId) : null;
      var dateKey = dates[d.dow];
      if (!post || !dateKey || dateHasVaultId(dateKey, post.id)) return;
      var ov = vaultOverride(post);
      var day = Cal.ensureDay(st.data.calendar, dateKey);
      day.items.push(Cal.newItem({
        type: contentTypeToCalType(post.contentType),
        title: post.title || "",
        draft: buildVaultDraft(post),
        format: ov.format,
        promoting: ov.promoting,
        vaultId: post.id,
        status: "todo"
      }, st.data, dateKey));
      added++;
    });
    st.data.calendarView = "week";
    st.data.calendarBoardOpen = true;
    var firstDate = dates.MON || Cal.ymd(new Date());
    st.data.calendarWeekOffset = weekOffsetForDate(firstDate);
    st.data.calendarSelected = firstDate;
    persist();
    renderCalendar();
    if (added && gotoPanel) gotoPanel("tend");
    else renderContentWeek();
    if (FS.UI && FS.UI.toast) {
      FS.UI.toast(added ? ("Week " + weekIdx + " is on your calendar.") : "Already on your calendar.", { tone: added ? "good" : "ok" });
    }
  }

  function paintContentWeekCta() {
    if (packEvergreen && packEvergreen()) return;
    var eye = $("contentWeekCtaEyebrow");
    var sub = $("contentWeekCtaSub");
    var go = $("contentWeekCtaGo");
    if (!eye && !sub && !go) return;
    var weekIdx = vaultPlanState().startedOn ? liveWeekIndex() : (displayedWeekIndex() || 1);
    var plan = weekPlanByIndex(weekIdx);
    if (eye) eye.textContent = "Week " + weekIdx + " of 8";
    if (sub) sub.textContent = plan && plan.theme
      ? plan.theme
      : "A calm rotation — drop it onto your calendar, then tap a day to post.";
    if (go) go.textContent = weekPlanApplied(weekIdx) ? "On your calendar →" : "See this week →";
  }

  var groveShareCache = [];
  var groveShareLoadedAt = 0;
  var groveShelfFiles = [];
  var groveShelfBusy = false;
  var groveShelfFrameIdx = 1;
  var groveShelfSearchTimer = null;

  function ensureGroveShelf() {
    var st = getState && getState();
    if (!st || !st.data) return { view: "browse", id: "", q: "", format: "", promoting: "", mine: false };
    if (!st.data.groveShelf || typeof st.data.groveShelf !== "object") {
      st.data.groveShelf = { view: "browse", id: "", q: "", format: "", promoting: "", mine: false };
    }
    var s = st.data.groveShelf;
    if (!s.view) s.view = "browse";
    return s;
  }

  function findGroveShare(id) {
    for (var i = 0; i < groveShareCache.length; i++) {
      if (groveShareCache[i].id === id) return groveShareCache[i];
    }
    return null;
  }

  function markGroveShelfSeen() {
    var st = getState && getState();
    if (!st || !st.data) return;
    st.data.groveShelfSeenAt = new Date().toISOString();
    if (persist) persist();
    paintGroveShelfCta();
  }

  function groveShelfHasNew() {
    var st = getState && getState();
    if (!groveShareCache.length) return false;
    var latest = groveShareCache[0] && groveShareCache[0].created_at;
    if (!latest) return false;
    var seen = st && st.data && st.data.groveShelfSeenAt;
    if (!seen) return true;
    return new Date(latest).getTime() > new Date(seen).getTime();
  }

  function paintGroveShelfCta() {
    if (packEvergreen && packEvergreen()) return;
    var eye = $("groveShelfCtaEyebrow");
    var go = $("groveShelfCtaGo");
    var live = groveShareCache.filter(function (s) { return s.approved_at && !s.hidden; }).length;
    var pending = groveShareCache.filter(function (s) { return !s.approved_at; }).length;
    var superLook = !!(Cloud.isSuperAdmin && Cloud.isSuperAdmin() && pending);
    if (eye) {
      if (superLook) {
        eye.textContent = pending === 1 ? "1 to look at" : pending + " to look at";
        eye.classList.add("is-new");
      } else {
        eye.textContent = groveShelfHasNew() ? "New" : "From the grove";
        eye.classList.toggle("is-new", groveShelfHasNew());
      }
    }
    if (go) go.textContent = live ? (live + " post" + (live === 1 ? "" : "s") + " →") : "Browse posts →";
    if (!groveShareLoadedAt && Cloud.listGroveShares && Cloud.isSignedIn && Cloud.isSignedIn()) {
      loadGroveShares(false).then(function () {
        paintGroveShelfCta();
      });
    }
  }

  function loadGroveShares(force) {
    if (packEvergreen && packEvergreen()) return Promise.resolve([]);
    if (!Cloud.listGroveShares) return Promise.resolve([]);
    if (!force && groveShareLoadedAt && Date.now() - groveShareLoadedAt < 8000) {
      return Promise.resolve(groveShareCache);
    }
    return Cloud.listGroveShares().then(function (rows) {
      groveShareCache = rows || [];
      groveShareLoadedAt = Date.now();
      paintGroveShelfCta();
      return groveShareCache;
    }).catch(function () {
      return groveShareCache;
    });
  }

  function filteredGroveShares() {
    var browse = ensureGroveShelf();
    var me = Cloud.user && Cloud.user();
    var superA = !!(Cloud.isSuperAdmin && Cloud.isSuperAdmin());
    var approvalOn = groveShareCache.some(function (row) { return row.approved_at !== undefined; });
    var q = (browse.q || "").trim().toLowerCase();
    var list = groveShareCache.filter(function (s) {
      if (approvalOn && !superA && !s.approved_at && (!me || s.created_by !== me.id)) return false;
      if (browse.mine && me && s.created_by !== me.id) return false;
      if (browse.format && s.format !== browse.format) return false;
      if (browse.promoting && s.promoting !== browse.promoting) return false;
      if (!q) return true;
      var blob = [s.title, s.caption, s.hook, s.format, s.promoting, s.content_type, s.created_by_name].join(" ").toLowerCase();
      return blob.indexOf(q) > -1;
    });
    if (superA) {
      list.sort(function (a, b) {
        var ap = a.approved_at ? 1 : 0;
        var bp = b.approved_at ? 1 : 0;
        return ap - bp;
      });
    }
    return list;
  }

  function shelfStackHtml(share) {
    var n = Number(share.frame_count) || 0;
    if (!n) return '<div class="shelf-card-empty">Caption</div>';
    var html = '<div class="shelf-stack">';
    var show = Math.min(n, 3);
    for (var i = 0; i < show; i++) {
      var url = Cloud.groveShareFrameUrl ? Cloud.groveShareFrameUrl(share, i + 1, "thumb") : "";
      html += '<span class="shelf-stack-frame" style="--i:' + i + '">';
      if (url) html += '<img src="' + esc(url) + '" alt="" loading="lazy" decoding="async">';
      html += "</span>";
    }
    html += "</div>";
    return html;
  }

  function groveShelfDraft() {
    var st = getState && getState();
    return (st && st.data && st.data.groveShelfDraft) || null;
  }

  function fieldsFromCalItem(item) {
    var title = String((item && item.title) || "").trim();
    var caption = String((item && item.draft) || "").trim();
    if (!title) title = caption.replace(/\s+/g, " ").slice(0, 80);
    if (!title) {
      var meta = Cal.typeMeta ? Cal.typeMeta(item && item.type) : null;
      title = (meta && meta.label) || "Post";
    }
    if (title.length > 80) title = title.slice(0, 80);
    return {
      title: title,
      caption: caption.slice(0, 4000),
      hook: "",
      format: (item && item.format) || "",
      promoting: (item && item.promoting) || "",
      content_type: calTypeToContentType(item && item.type)
    };
  }

  function flushCalEditorToItem() {
    var st = getState();
    var scheduled = scheduledVaultItem();
    if (scheduled && scheduled.item) {
      var vaultDraft = $("libDraft");
      if (vaultDraft) scheduled.item.draft = vaultDraft.value;
      persist();
      return scheduled.item;
    }
    var ed = st && st.data && st.data.calendarEditing;
    if (!ed) return null;
    var day = Cal.ensureDay(st.data.calendar, ed.date);
    var item = null;
    for (var i = 0; i < day.items.length; i++) {
      if (day.items[i].id === ed.itemId) item = day.items[i];
    }
    if (!item) return null;
    var titleEl = $("calTitle");
    var draftEl = $("calDraft");
    var fmtEl = $("calFormat");
    var promoEl = $("calPromoting");
    if (titleEl) item.title = titleEl.value;
    if (draftEl) item.draft = draftEl.value;
    if (fmtEl) item.format = fmtEl.value;
    if (promoEl) item.promoting = promoEl.value;
    persist();
    return item;
  }

  function markCalItemShared(shareId) {
    var st = getState();
    if (!st || !shareId) return;
    var ref = st.data.groveShelfFromCal;
    var date = ref && ref.date;
    var itemId = ref && ref.itemId;
    if (!date && st.data.calendarEditing) {
      date = st.data.calendarEditing.date;
      itemId = st.data.calendarEditing.itemId;
    }
    if (date && itemId) {
      var day = (st.data.calendar && st.data.calendar[date]) || null;
      if (day && day.items) {
        for (var i = 0; i < day.items.length; i++) {
          if (day.items[i].id === itemId) day.items[i].groveShareId = shareId;
        }
      }
    }
    st.data.groveShelfFromCal = null;
    st.data.groveShelfDraft = null;
    persist();
  }

  async function openShelfComposeFromCal(item) {
    var st = getState();
    if (!st || !item) return;
    st.data.groveShelfDraft = fieldsFromCalItem(item);
    if (st.data.calendarEditing) {
      st.data.groveShelfFromCal = {
        date: st.data.calendarEditing.date,
        itemId: item.id
      };
    }
    var browse = ensureGroveShelf();
    browse.view = "compose";
    browse.id = "";
    groveShelfFiles = [];
    try {
      groveShelfFiles = await filesFromCard(item);
    } catch (eFiles) {
      groveShelfFiles = localFilesForItem(item.id).slice();
    }
    persist();
    closeCalSheet();
    if (gotoPanel) gotoPanel("grove-shelf");
    else renderGroveShelf();
  }

  async function shareCalendarItemToShelf(wantDetails) {
    if (groveShelfBusy) return;
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      if (FS.UI && FS.UI.toast) FS.UI.toast("Sign in to share with the grove.", { tone: "ok" });
      return;
    }
    var item = flushCalEditorToItem();
    if (!item) return;
    var fields = fieldsFromCalItem(item);
    if (wantDetails || !fields.format || !fields.promoting) {
      if (!wantDetails && (!fields.format || !fields.promoting) && FS.UI && FS.UI.toast) {
        FS.UI.toast("Add a format and what it’s about — then share.", { tone: "ok" });
      }
      await openShelfComposeFromCal(item);
      return;
    }
    if (!Cloud.createGroveShare) return;
    groveShelfBusy = true;
    var offer = $("shelfOffer");
    if (offer) {
      var offerBtns = offer.querySelectorAll("button");
      for (var ob = 0; ob < offerBtns.length; ob++) offerBtns[ob].disabled = true;
    }
    try {
      var files = await filesFromCard(item);
      var id = await Cloud.createGroveShare(fields, files);
      if (Cloud.isSuperAdmin && Cloud.isSuperAdmin() && Cloud.approveGroveShare) {
        try { await Cloud.approveGroveShare(id); } catch (eAp) {}
      }
      markCalItemShared(id);
      if (item && item.id) calItemLocalFiles[item.id] = [];
      groveShareLoadedAt = 0;
      if (FS.UI && FS.UI.toast) {
        FS.UI.toast(
          Cloud.isSuperAdmin && Cloud.isSuperAdmin()
            ? "On the shelf."
            : "Sent — waiting for a look before the grove sees it.",
          { tone: "good" }
        );
      }
      renderCalEditor();
      paintGroveShelfCta();
    } catch (err) {
      if (FS.UI && FS.UI.toast) FS.UI.toast((err && err.message) || "Couldn’t share that.", { tone: "warn" });
    }
    groveShelfBusy = false;
    if (offer) {
      var enableBtns = offer.querySelectorAll("button");
      for (var eb = 0; eb < enableBtns.length; eb++) enableBtns[eb].disabled = false;
    }
  }

  function groveShareCardHtml(share) {
    var name = share.created_by_name || "A partner";
    var person = {
      id: share.created_by,
      display_name: name,
      photo_at: share.photo_at,
      photo_ext: share.photo_ext
    };
    var n = Number(share.frame_count) || 0;
    var html = '<button type="button" class="shelf-card fmt-' + esc(share.format || "single") +
      (share.hidden ? " is-hidden" : "") + '" data-shelf-open="' + esc(share.id) + '">';
    html += '<div class="shelf-card-media">' + shelfStackHtml(share) + "</div>";
    html += '<div class="shelf-card-body">';
    html += '<div class="shelf-card-chips">' + formatChipHtml(share.format) + promotingChipHtml(share.promoting);
    if (n > 1) html += '<span class="promo-chip">' + n + " frames</span>";
    if (!share.approved_at) html += '<span class="shelf-pending-chip">Waiting</span>';
    if (share.hidden) html += '<span class="shelf-hidden-chip">Hidden</span>';
    html += "</div>";
    html += '<h3 class="shelf-card-title">' + esc(share.title || "") + "</h3>";
    html += '<div class="shelf-card-meta">' + personPhotoHtml(person, "sm") + "<span>" + esc(name) + "</span></div>";
    html += "</div></button>";
    return html;
  }

  function renderContentTypeChips(selected) {
    return '<div class="cal-type-picks" role="group" aria-label="Type">' +
      (vaultMeta().contentTypes || []).map(function (c) {
        return '<button type="button" class="cal-type-pick' + (c.id === selected ? " on" : "") +
          '" data-shelf-content-type="' + esc(c.id) + '">' + esc(c.label) + "</button>";
      }).join("") +
      "</div>";
  }

  function shelfFormHtml(share) {
    var draft = share || groveShelfDraft() || {};
    var title = draft.title || "";
    var caption = draft.caption || "";
    var hook = draft.hook || "";
    var format = draft.format || "";
    var promoting = draft.promoting || "";
    var ctype = draft.content_type || "";
    var html = '<div class="shelf-form">';
    if (!share) {
      html += '<div class="field cal-frames">';
      html += '<span class="field-label">Photos / sequence</span>';
      html += '<div class="shelf-file-row" id="shelfFileRow"></div>';
      html += '<div class="cal-sheet-actions" id="shelfPhotoActions" style="margin-top:8px">';
      html += '<button type="button" class="btn-ghost" data-shelf-add-files>From camera roll</button>';
      html += '<button type="button" class="btn-ghost" data-shelf-browse-photos>From the photo library</button>';
      html += "</div>";
      html += '<input type="file" id="shelfFiles" accept="image/*" multiple hidden>';
      html += '<span class="cal-lib-sheet-hint">Up to 8 frames.</span>';
      html += "</div>";
    }
    html += '<div class="field"><span class="field-label">Type</span>' +
      renderContentTypeChips(ctype) +
      '<input type="hidden" id="shelfContentType" value="' + esc(ctype) + '"></div>';
    html +=
      '<div class="vault-field-row">' +
        '<label class="field"><span class="field-label">About</span>' +
          '<select id="shelfPromoting" class="cal-select">' + renderPromotingOptions(promoting) + "</select></label>" +
        '<label class="field"><span class="field-label">Format</span>' +
          '<select id="shelfFormat" class="cal-select">' + renderFormatOptions(format) + "</select></label>" +
      "</div>";
    html += '<div class="field"><span class="field-label">Title</span>' +
      '<input type="text" id="shelfTitle" class="cal-input" maxlength="80" value="' + esc(title) +
      '" placeholder="Short name for the shelf"></div>';
    html += '<div class="field"><span class="field-label">Hook <span class="dim">(optional)</span></span>' +
      '<input type="text" id="shelfHook" class="cal-input" maxlength="280" value="' + esc(hook) +
      '" placeholder="First line"></div>';
    html += '<div class="field"><span class="field-label">Caption <span class="dim">(optional)</span></span>' +
      '<textarea id="shelfCaption" rows="8" maxlength="4000" placeholder="Write it in your voice…">' +
      esc(caption) + "</textarea></div>";
    html += '<p class="cal-lib-hint" id="shelfFormHint">Title, format, about, and type are required. Share the idea, not a script.</p>';
    html += '<div class="cal-sheet-actions">';
    html += '<button type="button" class="btn" data-shelf-submit>' + (share ? "Save changes" : "Share to the grove") + "</button>";
    html += '<button type="button" class="btn-ghost" data-shelf-view="browse">Cancel</button>';
    html += "</div></div>";
    return html;
  }

  function paintShelfFileRow() {
    var row = $("shelfFileRow");
    if (!row) return;
    var html = "";
    groveShelfFiles.forEach(function (file, i) {
      var url = "";
      try { url = URL.createObjectURL(file); } catch (e) {}
      html += '<div class="shelf-file-thumb">';
      if (url) html += '<img src="' + esc(url) + '" alt="">';
      html += '<button type="button" data-shelf-remove-file="' + i + '" aria-label="Remove">×</button></div>';
    });
    row.innerHTML = html;
    var actions = $("shelfPhotoActions");
    if (actions) actions.hidden = groveShelfFiles.length >= FRAME_MAX;
  }

  function wireShelfCompose() {
    var files = $("shelfFiles");
    if (files && !files.dataset.bound) {
      files.dataset.bound = "1";
      files.addEventListener("change", function () {
        var picked = files.files || [];
        for (var i = 0; i < picked.length && groveShelfFiles.length < 8; i++) {
          groveShelfFiles.push(picked[i]);
        }
        files.value = "";
        paintShelfFileRow();
      });
    }
  }

  function readShelfForm() {
    var titleEl = $("shelfTitle");
    var fmt = $("shelfFormat");
    var promo = $("shelfPromoting");
    var typeEl = $("shelfContentType");
    var hookEl = $("shelfHook");
    var capEl = $("shelfCaption");
    return {
      title: titleEl ? titleEl.value.trim() : "",
      format: fmt ? fmt.value : "",
      promoting: promo ? promo.value : "",
      content_type: typeEl ? typeEl.value : "",
      hook: hookEl ? hookEl.value.trim() : "",
      caption: capEl ? capEl.value.trim() : ""
    };
  }

  function renderGroveShelfBrowse() {
    var browse = ensureGroveShelf();
    var list = filteredGroveShares();
    var html =
      '<div class="vault-tools">' +
      '<div class="talk-guide-nav">' +
        '<button type="button" class="prod-pill on" data-goto="tend">← Back to Calendar</button>' +
        (Cloud.isSignedIn && Cloud.isSignedIn()
          ? '<button type="button" class="prod-pill" data-shelf-compose>Add yours</button>'
          : "") +
      "</div>" +
      '<div class="vault-filters">' +
        '<div class="vault-filter"><span class="sr-only">Search</span>' +
        '<input type="search" class="prod-search" id="shelfSearch" placeholder="Search titles, captions, names…" value="' +
          esc(browse.q || "") + '" autocomplete="off"></div>' +
        renderInlineTypeAboutFilters("shelfFormatSelect", "shelfPromotingSelect", browse.format, browse.promoting);
    html += '<div class="vault-filter-group"><button type="button" class="vault-filter-chip' +
      (browse.mine ? " on" : "") + '" data-shelf-mine>Mine</button></div>';
    html += "</div></div>";
    html += '<p class="eyebrow">FROM THE GROVE</p>';
    html += '<h1 class="prod-head-title">Posts from the team</h1>';
    html += '<p class="prod-head-sub">A growing library of posts people on team created. Steal the structure, rewrite it in your voice — and add yours when something worked.</p>';
    html += '<p class="vault-count">' + list.length + " share" + (list.length === 1 ? "" : "s") + "</p>";
    html += '<div class="shelf-grid">';
    list.forEach(function (s) { html += groveShareCardHtml(s); });
    html += "</div>";
    if (!Cloud.isSignedIn || !Cloud.isSignedIn()) {
      html += '<p class="cal-lib-hint">Sign in to see and add team shares.</p>';
    } else if (!list.length) {
      html += '<p class="cal-lib-hint">Nothing here yet — add the first one, or loosen the filters.</p>';
    }
    return html;
  }

  function renderGroveShelfDetail(share) {
    if (!share) return renderGroveShelfBrowse();
    var n = Number(share.frame_count) || 0;
    if (groveShelfFrameIdx < 1) groveShelfFrameIdx = 1;
    if (n && groveShelfFrameIdx > n) groveShelfFrameIdx = n;
    var name = share.created_by_name || "A partner";
    var person = {
      id: share.created_by,
      display_name: name,
      photo_at: share.photo_at,
      photo_ext: share.photo_ext
    };
    var html =
      '<div class="talk-guide-nav"><button type="button" class="prod-pill on" data-shelf-view="browse">← Shelf</button></div>' +
      '<p class="eyebrow">FROM THE GROVE</p>' +
      '<h1 class="prod-head-title">' + esc(share.title || "") + "</h1>" +
      '<div class="shelf-card-chips" style="margin:0 0 12px">' + formatChipHtml(share.format) +
        promotingChipHtml(share.promoting) +
        (share.content_type ? '<span class="promo-chip">' + esc(contentTypeLabel(share.content_type)) + "</span>" : "") +
        (n > 1 ? '<span class="promo-chip">' + n + " frames</span>" : "") +
        (!share.approved_at ? '<span class="shelf-pending-chip">Waiting</span>' : "") +
        (share.hidden ? '<span class="shelf-hidden-chip">Hidden</span>' : "") +
      "</div>" +
      '<div class="shelf-who">' + personPhotoHtml(person, "sm") + "<span>from " + esc(name) + "</span></div>";
    if (n) {
      var src = Cloud.groveShareFrameUrl ? Cloud.groveShareFrameUrl(share, groveShelfFrameIdx, "full") : "";
      html += '<div class="shelf-detail-frames">';
      if (src) html += '<img src="' + esc(src) + '" alt="" decoding="async">';
      if (n > 1) {
        html += '<div class="shelf-frame-nav">';
        html += '<button type="button" data-shelf-frame="-1" aria-label="Previous">←</button>';
        html += '<span class="shelf-frame-count">' + groveShelfFrameIdx + " of " + n + "</span>";
        html += '<button type="button" data-shelf-frame="1" aria-label="Next">→</button>';
        html += "</div>";
      }
      html += "</div>";
      html += '<p class="cal-lib-hint">Press and hold a frame to save it.</p>';
    }
    if (share.hook) html += '<p class="vault-week-hook">' + esc(share.hook) + "</p>";
    if (share.caption) html += '<p class="shelf-caption">' + esc(share.caption) + "</p>";
    html += '<div class="cal-sheet-actions">';
    html += '<button type="button" class="btn" data-shelf-copy>Copy caption</button>';
    html += '<button type="button" class="btn" data-shelf-add-cal>Add to my calendar</button>';
    html += "</div>";
    html += '<p class="cal-lib-hint">Starting point — rewrite it in your voice before you post.</p>';
    if (Cloud.isSuperAdmin && Cloud.isSuperAdmin()) {
      html += '<div class="cal-sheet-actions" style="margin-top:8px">';
      if (!share.approved_at) {
        html += '<button type="button" class="btn" data-shelf-approve>Put on the shelf</button>';
      }
      html += '<button type="button" class="btn-ghost" data-shelf-edit>Edit</button>';
      html += '<button type="button" class="btn-ghost danger-ghost" data-shelf-hide>' +
        (share.hidden ? "Unhide" : "Hide") + "</button>";
      html += "</div>";
    }
    return html;
  }

  function renderGroveShelfCompose() {
    var browse = ensureGroveShelf();
    var share = browse.id ? findGroveShare(browse.id) : null;
    var html =
      '<div class="talk-guide-nav"><button type="button" class="prod-pill on" data-shelf-view="browse">← Shelf</button></div>' +
      '<p class="eyebrow">FROM THE GROVE</p>' +
      '<h1 class="prod-head-title">' + (share ? "Edit this share" : "Add yours") + "</h1>" +
      '<p class="prod-head-sub">' + (share
        ? "Super admin can tidy copy and tags. Frames stay as they are."
        : "Share what worked as a starting point — people will put their own spin on it. Tay looks at each one before the team sees it. You can’t edit after you share.") + "</p>" +
      shelfFormHtml(share);
    return html;
  }

  function wireGroveShelf() {
    var browse = ensureGroveShelf();
    var search = $("shelfSearch");
    if (search && !search.dataset.bound) {
      search.dataset.bound = "1";
      search.setAttribute("spellcheck", "false");
      search.setAttribute("enterkeyhint", "search");
      search.addEventListener("input", function () {
        browse.q = search.value;
        if (groveShelfSearchTimer) clearTimeout(groveShelfSearchTimer);
        groveShelfSearchTimer = setTimeout(function () {
          groveShelfSearchTimer = null;
          if (persist) persist();
          renderGroveShelf();
        }, 120);
      });
    }
    var promo = $("shelfPromotingSelect");
    if (promo && !promo.dataset.bound) {
      promo.dataset.bound = "1";
      promo.addEventListener("change", function () {
        browse.promoting = promo.value || "";
        paintVaultBubble(promo);
        if (persist) persist();
        renderGroveShelf();
      });
    }
    var fmt = $("shelfFormatSelect");
    if (fmt && !fmt.dataset.bound) {
      fmt.dataset.bound = "1";
      fmt.addEventListener("change", function () {
        browse.format = fmt.value || "";
        paintVaultBubble(fmt);
        if (persist) persist();
        renderGroveShelf();
      });
    }
    paintVaultBubble(promo);
    paintVaultBubble(fmt);
    if (browse.view === "compose") wireShelfCompose();
  }

  function paintGroveShelfRoot() {
    var root = $("groveShelfRoot");
    if (!root) return;
    var browse = ensureGroveShelf();
    if (browse.view === "compose") root.innerHTML = renderGroveShelfCompose();
    else if (browse.view === "detail") root.innerHTML = renderGroveShelfDetail(findGroveShare(browse.id));
    else root.innerHTML = renderGroveShelfBrowse();
    wireGroveShelf();
    if (browse.view === "compose") paintShelfFileRow();
  }

  function renderGroveShelf() {
    var root = $("groveShelfRoot");
    if (!root) return;
    if (packEvergreen && packEvergreen()) return;
    var browse = ensureGroveShelf();
    markGroveShelfSeen();
    var ae = document.activeElement;
    if (browse.view === "compose" && root.querySelector(".shelf-form") && ae && root.contains(ae)) {
      return;
    }
    if (browse.view === "browse" && ae && ae.id === "shelfSearch" && root.querySelector(".shelf-grid")) {
      loadGroveShares(false).then(function () {
        var list = filteredGroveShares();
        var count = root.querySelector(".vault-count");
        var grid = root.querySelector(".shelf-grid");
        if (count) count.textContent = list.length + " share" + (list.length === 1 ? "" : "s");
        if (grid) {
          var html = "";
          list.forEach(function (s) { html += groveShareCardHtml(s); });
          grid.innerHTML = html;
        }
      });
      return;
    }
    if (browse.view === "compose") {
      paintGroveShelfRoot();
      return;
    }
    loadGroveShares(true).then(function () {
      paintGroveShelfRoot();
    });
  }

  function openGroveShare(id) {
    var browse = ensureGroveShelf();
    browse.view = "detail";
    browse.id = id || "";
    groveShelfFrameIdx = 1;
    if (persist) persist();
    renderGroveShelf();
  }

  function groveShelfCopy(share) {
    var text = [share.hook, share.caption].filter(Boolean).join("\n\n");
    if (!text) {
      if (FS.UI && FS.UI.toast) FS.UI.toast("No caption to copy.", { tone: "ok" });
      return;
    }
    function ok() {
      if (FS.UI && FS.UI.toast) FS.UI.toast("Copied — now make it sound like you.", { tone: "good" });
    }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      } catch (e) {}
      ok();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fallback);
    } else fallback();
  }

  function groveShelfAddToCal(share) {
    var st = getState();
    if (!st || !share) return;
    var dateAdd = st.data.calendarSelected || Cal.ymd(new Date());
    var draft = [share.hook ? "HOOK\n" + share.hook : "", share.caption ? "CAPTION\n" + share.caption : ""]
      .filter(Boolean).join("\n\n");
    var n = Number(share.frame_count) || 0;
    var frames = [];
    for (var i = 1; i <= n; i++) {
      var url = Cloud.groveShareFrameUrl ? Cloud.groveShareFrameUrl(share, i, "full") : "";
      if (url) frames.push({ src: url, imageId: "" });
    }
    var image = (frames[0] && frames[0].src) || "";
    createCard(dateAdd, {
      type: contentTypeToCalType(share.content_type),
      title: share.title || "",
      draft: draft,
      image: image,
      frames: frames,
      format: share.format || "",
      promoting: share.promoting || "",
      groveShareId: share.id || ""
    }, { quiet: true });
    if (FS.UI && FS.UI.toast) {
      FS.UI.toast("On your calendar — rewrite it in your voice before you post.", { tone: "good" });
    }
  }

  async function groveShelfSubmit() {
    if (groveShelfBusy) return;
    var fields = readShelfForm();
    var hint = $("shelfFormHint");
    if (!fields.title || !fields.format || !fields.promoting || !fields.content_type) {
      if (hint) hint.textContent = "Title, format, about, and type are required.";
      return;
    }
    var browse = ensureGroveShelf();
    groveShelfBusy = true;
    var btn = document.querySelector("[data-shelf-submit]");
    if (btn) btn.textContent = browse.id ? "Saving…" : "Sharing…";
    try {
      if (browse.id) {
        await Cloud.updateGroveShare(browse.id, fields);
        groveShareLoadedAt = 0;
        browse.view = "detail";
        if (persist) persist();
        if (FS.UI && FS.UI.toast) FS.UI.toast("Saved.", { tone: "good" });
      } else {
        var id = await Cloud.createGroveShare(fields, groveShelfFiles);
        groveShelfFiles = [];
        if (Cloud.isSuperAdmin && Cloud.isSuperAdmin() && Cloud.approveGroveShare) {
          try { await Cloud.approveGroveShare(id); } catch (eAp) {}
        }
        markCalItemShared(id);
        groveShareLoadedAt = 0;
        browse.view = "detail";
        browse.id = id;
        if (persist) persist();
        if (FS.UI && FS.UI.toast) {
          FS.UI.toast(
            Cloud.isSuperAdmin && Cloud.isSuperAdmin()
              ? "On the shelf."
              : "Sent — waiting for a look before the grove sees it.",
            { tone: "good" }
          );
        }
      }
      renderGroveShelf();
    } catch (err) {
      var msg = (err && (err.message || err.error_description)) || "Couldn’t share that.";
      if (hint) hint.textContent = msg;
      if (btn) btn.textContent = browse.id ? "Save changes" : "Share to the grove";
    }
    groveShelfBusy = false;
  }

  function vaultPostBlob(post) {
    if (!post) return "";
    return [post.title, post.hook, post.caption, post.topic, post.body, (post.keywords || []).join(" ")].join(" ").toLowerCase();
  }

  function favoriteProductIds() {
    var st = getState && getState();
    var ids = (st && st.data && st.data.productFavorites) || [];
    return Array.isArray(ids) ? ids : [];
  }

  function productCatalog() {
    return (window.FS.PRODUCT_LIB && window.FS.PRODUCT_LIB.products) || [];
  }

  function productsMentionedInPost(post) {
    var blob = " " + vaultPostBlob(post) + " ";
    var products = productCatalog();
    var hits = [];
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var name = String(p.name || "").toLowerCase();
      if (!name) continue;
      var short = name.replace(/^fresh\s+/, "");
      if (short.length < 5) continue;
      if (blob.indexOf(short) > -1 || blob.indexOf(name) > -1) hits.push(p);
    }
    return hits;
  }

  function vaultPostMatchesFavs(post) {
    var favs = favoriteProductIds();
    if (!favs.length) return false;
    var mentioned = productsMentionedInPost(post);
    for (var i = 0; i < mentioned.length; i++) {
      if (favs.indexOf(mentioned[i].id) > -1) return true;
    }
    return false;
  }

  function photosForVaultPost(post) {
    var seen = {};
    var out = [];
    function add(meta) {
      if (!meta || !meta.id || seen[meta.id]) return;
      if (!Cal.resolveCuriosityImage || !Cal.resolveCuriosityImage(meta.id)) return;
      seen[meta.id] = true;
      out.push(meta);
    }
    productsMentionedInPost(post).forEach(function (p) {
      (Cal.curiosityImagesForProduct(p.id) || []).forEach(add);
    });
    if (out.length < 4) {
      var keys = (post.keywords || []).map(function (k) { return String(k || "").toLowerCase(); }).filter(Boolean);
      var list = (window.FS.CONTENT && window.FS.CONTENT.curiosityImages) || [];
      for (var i = 0; i < list.length && out.length < 6; i++) {
        var hay = ((list[i].title || "") + " " + (list[i].tags || []).join(" ") + " " + (list[i].pairsWith || "")).toLowerCase();
        for (var k = 0; k < keys.length; k++) {
          if (keys[k].length >= 4 && hay.indexOf(keys[k]) > -1) {
            add(list[i]);
            break;
          }
        }
      }
    }
    return out.slice(0, 6);
  }

  function vaultDateStripHtml(selectedKey) {
    var sel = selectedKey ? Cal.parseYmd(selectedKey) : new Date();
    var mon = mondayOf(sel);
    var todayKey = Cal.ymd(new Date());
    var html = '<div class="vault-date-strip" role="listbox" aria-label="Which day">';
    for (var i = 0; i < 7; i++) {
      var d = Cal.addDays(mon, i);
      var key = Cal.ymd(d);
      html += '<button type="button" class="vault-date-btn' + (key === selectedKey ? " on" : "") +
        (key === todayKey ? " is-today" : "") + '" data-vault-pick-date="' + key + '" aria-selected="' +
        (key === selectedKey ? "true" : "false") + '"><span>' + esc(Cal.DOW[d.getDay()].slice(0, 2)) +
        "</span><strong>" + d.getDate() + "</strong></button>";
    }
    html += "</div>";
    return html;
  }

  function vaultVerifyHtml(post) {
    var rows = (post && post.verify) || [];
    if (!rows.length) return "";
    var html = '<div class="vault-verify-box">';
    rows.forEach(function (v) {
      var ok = v.status === "verified";
      html += '<p class="vault-verify-row' + (ok ? " is-ok" : "") + '">';
      html += ok ? "Verified · " : "Check this · ";
      html += esc(v.claim || "");
      if (v.sourceNote) html += " <em>" + esc(v.sourceNote) + "</em>";
      html += "</p>";
    });
    html += "</div>";
    return html;
  }

  function vaultPhotosHtml(post, usedIds) {
    usedIds = usedIds || [];
    var used = {};
    usedIds.forEach(function (id) { if (id) used[id] = true; });
    var photos = photosForVaultPost(post);
    var html = '<div class="vault-post-block"><div class="vault-post-label"><span>Photos</span></div>';
    if (photos.length) {
      html += '<div class="vault-photos">';
      photos.forEach(function (p) {
        var resolved = Cal.resolveCuriosityImage(p.id);
        if (!resolved) return;
        var on = !!used[p.id];
        html += '<div class="vault-photo' + (on ? " on" : "") + '">' +
          '<button type="button" class="vault-photo-img" data-curio-open="' + esc(p.id) + '" aria-label="View ' + esc(p.title || "photo") + '">' +
          '<img src="' + esc(resolved.thumb || resolved.src) + '" alt="' + esc(resolved.alt || p.title || "") + '" loading="lazy"></button>' +
          '<button type="button" class="vault-photo-use" data-vault-pick-photo="' + esc(p.id) + '" aria-pressed="' +
          (on ? "true" : "false") + '">' + (on ? "Using" : "Use") + "</button></div>";
      });
      html += "</div>";
    }
    html += '<p class="vault-photo-more"><button type="button" class="inline-link" data-vault-more-photos>Browse all photos →</button></p></div>';
    return html;
  }

  function vaultCopyBtn(id, label) {
    return '<button type="button" class="copy-btn small" data-copy="' + id + '">' + esc(label) + "</button>";
  }

  function vaultPostBodyHtml(post) {
    var html = "";
    if (post.hook) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>Hook</span>' +
        vaultCopyBtn("vaultCopyHook", "Copy hook") + "</div>" +
        '<p class="vault-hook" id="vaultCopyHook">' + esc(post.hook) + "</p></div>";
    }
    if (post.altHooks && post.altHooks.length) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>Alt hooks</span></div><ul class="vault-alt-hooks">';
      post.altHooks.forEach(function (h) { html += "<li>" + esc(h) + "</li>"; });
      html += "</ul></div>";
    }
    if (post.slides && post.slides.length) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>Slides</span>' +
        vaultCopyBtn("vaultCopySlides", "Copy slides") + "</div>" +
        '<ol class="vault-slides" id="vaultCopySlides">';
      post.slides.forEach(function (s) { html += "<li>" + esc(s) + "</li>"; });
      html += "</ol></div>";
    }
    if (post.onScreen && post.onScreen.length) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>On-screen</span>' +
        vaultCopyBtn("vaultCopyShots", "Copy shot list") + "</div>" +
        '<ol class="vault-shots" id="vaultCopyShots">';
      post.onScreen.forEach(function (s) { html += "<li>" + esc(s) + "</li>"; });
      html += "</ol></div>";
    }
    if (post.frames && post.frames.length) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>Frames</span>' +
        vaultCopyBtn("vaultCopyFrames", "Copy frames") + "</div>" +
        '<ol class="vault-shots" id="vaultCopyFrames">';
      post.frames.forEach(function (s) { html += "<li>" + esc(s) + "</li>"; });
      html += "</ol></div>";
    }
    if (post.caption) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>Caption</span>' +
        vaultCopyBtn("vaultCopyCaption", "Copy caption") + "</div>" +
        '<p class="vault-caption" id="vaultCopyCaption">' + esc(post.caption) + "</p></div>";
    }
    if (post.keywords && post.keywords.length) {
      html += '<div class="vault-post-block"><div class="vault-post-label"><span>Keywords</span></div>' +
        '<p class="vault-keywords">' + esc(post.keywords.join(" · ")) + "</p></div>";
    }
    html += vaultVerifyHtml(post);
    return html;
  }

  function ensureVaultBrowse(kind) {
    var st = getState();
    if (!st.data.vaultBrowse) st.data.vaultBrowse = {};
    if (!st.data.vaultBrowse[kind]) {
      st.data.vaultBrowse[kind] = { q: "", format: "", promoting: "", lane: "all" };
    }
    return st.data.vaultBrowse[kind];
  }

  function findVaultPost(id) {
    var V = vaultMeta();
    var i;
    for (i = 0; i < (V.posts || []).length; i++) if (V.posts[i].id === id) return V.posts[i];
    for (i = 0; i < (V.stories || []).length; i++) if (V.stories[i].id === id) return V.stories[i];
    return null;
  }

  function allVaultItems() {
    var V = vaultMeta();
    return (V.posts || []).concat(V.stories || []);
  }

  function formatChipHtml(formatId) {
    var id = (formatId || "").toLowerCase() || "single";
    var label = formatLabel(id) || id;
    return '<span class="fmt-chip fmt-' + esc(id) + '">' + esc(label) + "</span>";
  }

  function promotingChipHtml(promotingId) {
    if (!promotingId) return "";
    var label = promotingLabel(promotingId) || promotingId;
    return '<span class="promo-chip promo-' + esc(promotingId) + '">' + esc(label) + "</span>";
  }

  function formatSelectClass(formatId) {
    var id = (formatId || "").toLowerCase();
    return "cal-select vault-inline-select vault-bubble" + (id ? " fmt-" + id + " is-set" : "");
  }

  function promotingSelectClass(promotingId) {
    var id = (promotingId || "").toLowerCase();
    return "cal-select vault-inline-select vault-bubble promo-bubble" + (id ? " promo-" + id + " is-set" : "");
  }

  function paintVaultBubble(el) {
    if (!el) return;
    var id = el.id || "";
    var isFmt = el.hasAttribute("data-vault-format") ||
      id === "libFormat" || id === "vaultFormatSelect" || id === "shelfFormatSelect" || id === "shelfFormat";
    var isPromo = el.hasAttribute("data-vault-promoting") ||
      id === "libPromoting" || id === "vaultPromotingSelect" || id === "shelfPromotingSelect" || id === "shelfPromoting";
    if (!isFmt && !isPromo) return;
    var val = (el.value || "").toLowerCase();
    el.className = isFmt ? formatSelectClass(val) : promotingSelectClass(val);
    if (el.id === "libFormat" || el.id === "libPromoting") {
      el.className = el.className.replace("vault-inline-select", "vault-sheet-select");
    }
  }

  function vaultOverride(post) {
    var st = getState && getState();
    var ov = (st && st.data && st.data.vaultOverrides && post && st.data.vaultOverrides[post.id]) || {};
    return {
      format: ov.format || (post && post.format) || "",
      promoting: ov.promoting || (post && post.promoting) || ""
    };
  }

  function vaultCalendarMarks() {
    var posted = {};
    var onCal = {};
    var st = getState && getState();
    var cal = st && st.data && st.data.calendar;
    if (!cal) return { posted: posted, onCal: onCal };
    Object.keys(cal).forEach(function (date) {
      var raw = cal[date];
      var items = (raw && raw.items) || [];
      for (var i = 0; i < items.length; i++) {
        var id = items[i] && items[i].vaultId;
        if (!id) continue;
        onCal[id] = true;
        if (items[i].status === "posted") posted[id] = true;
      }
    });
    return { posted: posted, onCal: onCal };
  }

  function vaultCardHtml(post, source, marks) {
    var ov = vaultOverride(post);
    var format = ov.format || "";
    var promoting = ov.promoting || "";
    var needs = (post.verify || []).some(function (v) { return v.status === "needs_check"; });
    var focus = vaultPostMatchesFavs(post);
    var fmtClass = "fmt-" + (format || "single");
    var html = '<article class="vault-card ' + fmtClass + '">';
    html += '<button type="button" class="vault-card-main" data-vault-open="' + esc(post.id) + '" data-vault-source="' + esc(source) + '">';
    html += '<div class="vault-card-top">';
    html += '<div class="vault-card-chips">' + formatChipHtml(format) + promotingChipHtml(promoting);
    if (focus) html += '<span class="vault-focus-chip">Your focus</span>';
    if (post._liveEdit) html += '<span class="vault-live-chip">Updated</span>';
    if (marks && marks.posted && marks.posted[post.id]) html += '<span class="vault-card-posted">Posted</span>';
    else if (marks && marks.onCal && marks.onCal[post.id]) html += '<span class="vault-card-oncal">On calendar</span>';
    html += "</div>";
    if (needs) html += '<span class="vault-verify-chip">Check facts</span>';
    html += "</div>";
    html += '<h3 class="vault-card-title">' + esc(post.title) + "</h3>";
    html += '<p class="vault-card-hook">' + esc(post.hook || post.preview || "") + "</p>";
    html += '<span class="vault-card-open">Open →</span>';
    html += "</button></article>";
    return html;
  }

  function filterVaultList(list, browse) {
    var q = (browse.q || "").trim().toLowerCase();
    var matched = (list || []).filter(function (p) {
      var ov = vaultOverride(p);
      if (browse.format && ov.format !== browse.format) return false;
      if (browse.promoting && ov.promoting !== browse.promoting) return false;
      if (browse.lane && browse.lane !== "all") {
        if (browse.lane === "stories") {
          if (ov.format !== "story" && p.kind !== "story" && p.lane !== "stories") return false;
        } else if (p.lane !== browse.lane) {
          return false;
        }
      }
      if (!q) return true;
      var blob = [p.id, p.title, p.hook, p.preview, p.caption, p.topic, (p.keywords || []).join(" ")].join(" ").toLowerCase();
      return blob.indexOf(q) > -1;
    });
    if (!favoriteProductIds().length) return matched;
    var fav = [];
    var rest = [];
    matched.forEach(function (p) {
      if (vaultPostMatchesFavs(p)) fav.push(p);
      else rest.push(p);
    });
    return fav.concat(rest);
  }

  function formatFilterChoices() {
    return [
      { id: "", label: "All types" },
      { id: "reel", label: "Reels" },
      { id: "carousel", label: "Carousels" },
      { id: "story", label: "Stories" },
      { id: "single", label: "Singles" },
      { id: "facebook", label: "Facebook" }
    ];
  }

  function renderFormatFilterSelect(selectId, selected) {
    var html = '<select id="' + selectId + '" class="' + formatSelectClass(selected || "") + '" aria-label="Content type">';
    formatFilterChoices().forEach(function (f) {
      html += '<option value="' + esc(f.id) + '"' + ((selected || "") === f.id ? " selected" : "") + ">" +
        esc(f.label) + "</option>";
    });
    html += "</select>";
    return html;
  }

  function renderInlineTypeAboutFilters(formatId, promoId, formatVal, promoVal) {
    var html = '<div class="vault-filter-inline">';
    html += '<div class="vault-filter-group"><label class="vault-filter-label" for="' + formatId + '">Content type</label>';
    html += renderFormatFilterSelect(formatId, formatVal || "");
    html += "</div>";
    html += '<div class="vault-filter-group"><label class="vault-filter-label" for="' + promoId + '">About</label>';
    html += '<select id="' + promoId + '" class="' + promotingSelectClass(promoVal || "") + ' vault-about-select" aria-label="About">';
    html += '<option value="">All pillars</option>';
    (vaultMeta().promoting || []).forEach(function (p) {
      html += '<option value="' + esc(p.id) + '"' + ((promoVal || "") === p.id ? " selected" : "") + ">" +
        esc(p.label) + "</option>";
    });
    html += "</select></div></div>";
    return html;
  }

  function renderVaultFilters(browse) {
    var html = '<div class="vault-filters">';
    html += '<div class="vault-filter"><span class="sr-only">Search</span><input type="search" class="prod-search" id="vaultSearch" placeholder="Search hooks, products, topics…" value="' + esc(browse.q || "") + '" autocomplete="off"></div>';
    html += renderInlineTypeAboutFilters("vaultFormatSelect", "vaultPromotingSelect", browse.format, browse.promoting);
    html += "</div>";
    return html;
  }

  var vaultSearchTimer = null;

  function wireVaultFilters(kind, rerender) {
    var browse = ensureVaultBrowse(kind);
    var search = $("vaultSearch");
    if (search && !search.dataset.bound) {
      search.dataset.bound = "1";
      search.setAttribute("spellcheck", "false");
      search.setAttribute("enterkeyhint", "search");
      search.addEventListener("input", function () {
        browse.q = search.value;
        if (kind === "vault") {
          if (vaultSearchTimer) clearTimeout(vaultSearchTimer);
          vaultSearchTimer = setTimeout(function () {
            vaultSearchTimer = null;
            persist();
            updateVaultSearchResults();
          }, 120);
          return;
        }
        persist();
        rerender();
      });
    }
    var promo = $("vaultPromotingSelect");
    if (promo && !promo.dataset.bound) {
      promo.dataset.bound = "1";
      promo.addEventListener("change", function () {
        browse.promoting = promo.value || "";
        paintVaultBubble(promo);
        persist();
        if (kind === "vault") updateVaultSearchResults();
        else rerender();
      });
    }
    var fmt = $("vaultFormatSelect");
    if (fmt && !fmt.dataset.bound) {
      fmt.dataset.bound = "1";
      fmt.addEventListener("change", function () {
        browse.format = fmt.value || "";
        paintVaultBubble(fmt);
        persist();
        if (kind === "vault") updateVaultSearchResults();
        else rerender();
      });
    }
    paintVaultBubble(promo);
    paintVaultBubble(fmt);
  }

  function updateVaultSearchResults() {
    var browse = ensureVaultBrowse("vault");
    var list = filterVaultList(allVaultItems(), browse);
    var count = document.querySelector("#contentVaultRoot .vault-count");
    var cards = document.querySelector("#contentVaultRoot .vault-card-list");
    if (count) {
      var focusN = list.filter(vaultPostMatchesFavs).length;
      count.textContent = list.length + " idea" + (list.length === 1 ? "" : "s") +
        (focusN ? " · your focus first" : "");
      count.classList.toggle("is-focus", !!focusN);
    }
    if (!cards) return;
    var html = "";
    var marks = vaultCalendarMarks();
    list.forEach(function (p) { html += vaultCardHtml(p, "vault", marks); });
    if (!list.length) html += '<p class="cal-lib-hint">Nothing matches those filters.</p>';
    cards.innerHTML = html;
  }

  function renderContentVault() {
    var root = $("contentVaultRoot");
    if (!root || !getState) return;
    var ae = document.activeElement;
    if (ae && root.contains(ae) && (ae.id === "vaultSearch" || ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) {
      updateVaultSearchResults();
      return;
    }
    var browse = ensureVaultBrowse("vault");
    var list = filterVaultList(allVaultItems(), browse);
    var focusN = list.filter(vaultPostMatchesFavs).length;
    var html =
      '<div class="vault-tools">' +
      '<div class="talk-guide-nav"><button type="button" class="prod-pill on" data-goto="tend">← Back to Calendar</button></div>' +
      renderVaultFilters(browse) +
      "</div>" +
      '<p class="eyebrow">POST VAULT</p>' +
      '<h1 class="prod-head-title">Posts, Reels &amp; Stories</h1>' +
      '<p class="prod-head-sub">Browse, copy a caption, pick a day. Steal the structure — rewrite until it sounds like you.</p>' +
      '<p class="vault-count' + (focusN ? " is-focus" : "") + '">' + list.length + " idea" + (list.length === 1 ? "" : "s") +
        (focusN ? " · your focus first" : "") + "</p>" +
      '<div class="vault-card-list">';
    var marks = vaultCalendarMarks();
    list.forEach(function (p) { html += vaultCardHtml(p, "vault", marks); });
    if (!list.length) html += '<p class="cal-lib-hint">Nothing matches those filters.</p>';
    html += "</div>";
    root.innerHTML = html;
    wireVaultFilters("vault", renderContentVault);
  }

  function renderContentStories() {
    /* Stories live in the Post vault now — keep for old deep-links. */
    var st = getState();
    if (st && st.data) {
      var browse = ensureVaultBrowse("vault");
      browse.format = "story";
      persist();
    }
    if (gotoPanel) gotoPanel("content-vault");
    else renderContentVault();
  }

  function currentWeekIndex() {
    return displayedWeekIndex();
  }

  function parseWeekDayNote(note) {
    var text = note || "";
    var idMatch = text.match(/\b((?:ST|IZ|[PMBLSC])\d+[a-z]?)\b/i);
    var goal = "";
    var parts = text.split("·");
    if (parts.length > 1) goal = parts[parts.length - 1].trim().replace(/\[.*?\]/g, "").trim();
    return { vaultId: idMatch ? idMatch[1].toUpperCase() : null, goal: goal, isRest: /^\s*rest\b/i.test(text) };
  }

  function weekDayCardHtml(d, dates) {
    var parsed = parseWeekDayNote(d.note);
    var post = parsed.vaultId ? findVaultPost(parsed.vaultId) : null;
    var dateKey = dates && dates[d.dow];
    var dateLabel = "";
    if (dateKey) {
      try {
        var dt = Cal.parseYmd(dateKey);
        dateLabel = '<span class="vault-week-date">' + dt.getDate() + "</span>";
      } catch (e) {}
    }
    if (parsed.isRest && !post) {
      return '<div class="vault-week-day is-rest">' +
        '<div class="vault-week-dow">' + esc(d.dow) + dateLabel + "</div>" +
        '<div class="vault-week-body"><span class="fmt-chip fmt-rest">Rest</span>' +
        '<p class="vault-week-title">Soft day</p>' +
        '<p class="vault-week-goal">' + esc((d.note || "").replace(/^\s*rest\s*\/?\s*/i, "") || "Repost what worked, or skip.") + "</p></div></div>";
    }
    if (post) {
      var ov = vaultOverride(post);
      var goal = parsed.goal || "";
      var onCal = dateKey && dateHasVaultId(dateKey, post.id);
      var posted = false;
      if (dateKey) {
        var dayRow = getState() && getState().data && getState().data.calendar && getState().data.calendar[dateKey];
        var dayItems = (dayRow && dayRow.items) || [];
        for (var pi = 0; pi < dayItems.length; pi++) {
          if (dayItems[pi].vaultId === post.id && dayItems[pi].status === "posted") posted = true;
        }
      }
      return '<button type="button" class="vault-week-day is-openable fmt-' + esc(ov.format || "single") +
        '" data-vault-open="' + esc(post.id) + '"' + (dateKey ? ' data-vault-date="' + dateKey + '"' : "") + ">" +
        '<div class="vault-week-dow">' + esc(d.dow) + dateLabel + "</div>" +
        '<div class="vault-week-body">' +
        '<div class="vault-card-chips">' + formatChipHtml(ov.format) +
          (post._liveEdit ? '<span class="vault-live-chip">Updated</span>' : "") +
          (goal ? '<span class="vault-week-goal-chip">' + esc(goal) + "</span>" : "") +
          (posted ? '<span class="vault-card-posted">Posted</span>' : (onCal ? '<span class="vault-card-oncal">On calendar</span>' : "")) +
        "</div>" +
        '<p class="vault-week-title">' + esc(post.title) + "</p>" +
        '<p class="vault-week-hook">' + esc(post.hook || "") + "</p>" +
        '<span class="vault-card-open">Open →</span></div></button>';
    }
    return '<div class="vault-week-day">' +
      '<div class="vault-week-dow">' + esc(d.dow) + dateLabel + "</div>" +
      '<div class="vault-week-body"><p class="vault-week-title">' + esc(d.note || "") + "</p></div></div>";
  }

  function renderContentWeek() {
    var root = $("contentWeekRoot");
    if (!root || !getState) return;
    var weekIdx = displayedWeekIndex();
    var live = liveWeekIndex();
    var plan = weekPlanByIndex(weekIdx);
    var dates = planWeekDates(weekIdx);
    var intensity = vaultPlanState().intensity;
    var applied = plan ? weekPlanApplied(weekIdx) : false;
    var html =
      '<div class="talk-guide-nav"><button type="button" class="prod-pill on" data-goto="tend">← Back to Calendar</button></div>' +
      '<div class="vault-week-hero">' +
        '<p class="vault-week-kicker">Week ' + weekIdx + " of 8" + (vaultPlanState().startedOn && weekIdx === live ? " · this week" : "") + "</p>" +
        '<h1 class="prod-head-title">This week\'s plan</h1>' +
        '<p class="prod-head-sub">Drop the rotation onto your calendar, then tap a day to copy and post. Not a cage — skip or swap anytime.</p>' +
      "</div>";
    html += '<div class="vault-intensity" role="group" aria-label="How much this week">';
    html += '<button type="button" class="vault-filter-chip' + (intensity === "light" ? " on" : "") + '" data-vault-intensity="light">Light · 3 posts</button>';
    html += '<button type="button" class="vault-filter-chip' + (intensity === "full" ? " on" : "") + '" data-vault-intensity="full">Full · 6 days</button>';
    html += "</div>";
    html += '<div class="vault-week-actions">';
    if (applied) {
      html += '<p class="vault-week-applied">On your calendar ✓</p>';
      html += '<button type="button" class="btn" data-goto="tend">Open calendar →</button>';
    } else {
      html += '<button type="button" class="btn" data-vault-apply-week>Use this week</button>';
    }
    html += "</div>";
    html += '<details class="vault-week-more"><summary>Other weeks</summary><div class="vault-week-nav">';
    for (var w = 1; w <= 8; w++) {
      html += '<button type="button" class="vault-lane' + (w === weekIdx ? " on" : "") + (w === live && vaultPlanState().startedOn ? " vault-week-live" : "") +
        '" data-vault-week="' + w + '">W' + w + "</button>";
    }
    html += "</div></details>";
    if (!plan) {
      html += '<p class="cal-lib-hint">Week plan missing.</p>';
      root.innerHTML = html;
      paintContentWeekCta();
      return;
    }
    html += '<div class="vault-week-theme"><div class="fact-label">Week ' + weekIdx + "</div><p>" + esc(plan.theme) + "</p></div>";
    html += '<div class="vault-week-days">';
    (plan.days || []).forEach(function (d) { html += weekDayCardHtml(d, dates); });
    html += "</div>";
    root.innerHTML = html;
    paintContentWeekCta();
  }

  function openVaultIdea(postId, dateKey) {
    var st = getState();
    var post = findVaultPost(postId);
    if (!st || !post) return;
    var overrides = (st.data.vaultOverrides && st.data.vaultOverrides[postId]) || {};
    var format = overrides.format || post.format || "";
    var promoting = overrides.promoting || post.promoting || "";
    if (dateKey) st.data.calendarSelected = dateKey;
    st.data.calendarEditing = null;
    st.data.orgEventEditing = null;
    st.data.libraryEditing = {
      bucketId: "vault",
      itemId: post.id,
      vaultId: post.id,
      type: contentTypeToCalType(post.contentType),
      title: post.title || "",
      body: buildVaultDraft(post),
      format: format,
      promoting: promoting,
      icon: "",
      imageId: "",
      image: "",
      alt: "",
      pairsWith: "",
      verify: post.verify || []
    };
    persist();
    renderVaultEditor();
    openCalSheet();
  }

  function scheduledVaultItem() {
    var st = getState();
    if (!st || !st.data.calendarEditing) return null;
    var date = st.data.calendarEditing.date;
    var itemId = st.data.calendarEditing.itemId;
    var dayRow = (st.data.calendar && st.data.calendar[date]) || null;
    if (!dayRow || !dayRow.items) return null;
    for (var i = 0; i < dayRow.items.length; i++) {
      if (dayRow.items[i].id === itemId) return { item: dayRow.items[i], date: date };
    }
    return null;
  }

  function vaultClip(s, max) {
    return String(s == null ? "" : s).replace(/\r\n/g, "\n").trim().slice(0, max);
  }

  function vaultLines(s, maxItems, maxLen) {
    return String(s || "").replace(/\r\n/g, "\n").split("\n").map(function (l) {
      return l.trim();
    }).filter(Boolean).slice(0, maxItems).map(function (l) {
      return l.slice(0, maxLen);
    });
  }

  function vaultHadArray(orig, live, key) {
    if (live && Array.isArray(live[key]) && live[key].length) return true;
    if (orig && Array.isArray(orig[key]) && orig[key].length) return true;
    return false;
  }

  function vaultAdminEditorHtml(post) {
    var orig = originalVaultPost(post.id);
    var html = '<details class="vault-admin-edit" open><summary>Edit for everyone</summary>';
    html += '<p class="cal-lib-sheet-hint">Tweaks go live in the vault for the whole team. Cards they already put on a calendar keep their own rewrite.</p>';
    html += '<div class="field"><label for="vaultAdminTitle">Title</label>';
    html += '<input type="text" id="vaultAdminTitle" data-vault-admin maxlength="120" value="' + esc(post.title || "") + '"></div>';
    html += '<div class="field"><label for="vaultAdminHook">Hook</label>';
    html += '<textarea id="vaultAdminHook" data-vault-admin rows="3">' + esc(post.hook || "") + "</textarea></div>";
    html += '<div class="field"><label for="vaultAdminAlt">Alt hooks <span class="cal-lib-sheet-hint">(one per line)</span></label>';
    html += '<textarea id="vaultAdminAlt" data-vault-admin rows="3">' + esc((post.altHooks || []).join("\n")) + "</textarea></div>";
    if (vaultHadArray(orig, post, "slides")) {
      html += '<div class="field"><label for="vaultAdminSlides">Slides (one per line)</label>';
      html += '<textarea id="vaultAdminSlides" data-vault-admin rows="8">' + esc((post.slides || []).join("\n")) + "</textarea></div>";
    }
    if (vaultHadArray(orig, post, "onScreen")) {
      html += '<div class="field"><label for="vaultAdminOnScreen">On-screen (one per line)</label>';
      html += '<textarea id="vaultAdminOnScreen" data-vault-admin rows="6">' + esc((post.onScreen || []).join("\n")) + "</textarea></div>";
    }
    if (vaultHadArray(orig, post, "frames")) {
      html += '<div class="field"><label for="vaultAdminFrames">Frames (one per line)</label>';
      html += '<textarea id="vaultAdminFrames" data-vault-admin rows="6">' + esc((post.frames || []).join("\n")) + "</textarea></div>";
    }
    html += '<div class="field"><label for="vaultAdminCaption">Caption</label>';
    html += '<textarea id="vaultAdminCaption" data-vault-admin rows="8">' + esc(post.caption || "") + "</textarea></div>";
    html += '<div class="field"><label for="vaultAdminFormat">Type</label>';
    html += '<select id="vaultAdminFormat" data-vault-admin class="' + formatSelectClass(post.format || "") + '">' +
      renderFormatOptions(post.format || "") + "</select></div>";
    html += '<div class="field"><label for="vaultAdminPromoting">About</label>';
    html += '<select id="vaultAdminPromoting" data-vault-admin class="' + promotingSelectClass(post.promoting || "") + '">' +
      renderPromotingOptions(post.promoting || "") + "</select></div>";
    html += '<div class="vault-admin-actions">';
    html += '<button type="button" class="btn" data-vault-save-everyone>Save for everyone</button>';
    if (post._liveEdit) html += '<button type="button" class="btn-ghost" data-vault-revert>Revert to original</button>';
    html += "</div></details>";
    return html;
  }

  function collectVaultAdminPatch() {
    var patch = {
      title: vaultClip(($("vaultAdminTitle") || {}).value, 120),
      hook: vaultClip(($("vaultAdminHook") || {}).value, 400),
      caption: vaultClip(($("vaultAdminCaption") || {}).value, 4000),
      format: vaultClip(($("vaultAdminFormat") || {}).value, 40),
      promoting: vaultClip(($("vaultAdminPromoting") || {}).value, 40),
      altHooks: vaultLines(($("vaultAdminAlt") || {}).value, 12, 400)
    };
    if ($("vaultAdminSlides")) patch.slides = vaultLines($("vaultAdminSlides").value, 20, 400);
    if ($("vaultAdminOnScreen")) patch.onScreen = vaultLines($("vaultAdminOnScreen").value, 20, 400);
    if ($("vaultAdminFrames")) patch.frames = vaultLines($("vaultAdminFrames").value, 20, 400);
    return patch;
  }

  async function saveVaultForEveryone() {
    var st = getState();
    var ed = st && st.data && st.data.libraryEditing;
    if (!ed || !ed.vaultId) return;
    if (!Cloud.isSuperAdmin || !Cloud.isSuperAdmin()) return;
    var patch = collectVaultAdminPatch();
    if (!patch.title) {
      if (FS.UI && FS.UI.toast) FS.UI.toast("Give it a title first.", { tone: "bad" });
      return;
    }
    try {
      await Cloud.saveVaultEdit(ed.vaultId, patch);
      ed.title = patch.title;
      ed.format = patch.format;
      ed.promoting = patch.promoting;
      if (st.data.vaultOverrides) {
        delete st.data.vaultOverrides[ed.vaultId];
        persist();
      }
      await loadVaultEdits(true);
      if (FS.UI && FS.UI.toast) FS.UI.toast("Saved for everyone.", { tone: "good" });
    } catch (err) {
      if (FS.UI && FS.UI.toast) FS.UI.toast((err && err.message) || "Couldn’t save that.", { tone: "bad" });
    }
  }

  async function revertVaultForEveryone() {
    var st = getState();
    var ed = st && st.data && st.data.libraryEditing;
    if (!ed || !ed.vaultId) return;
    if (!Cloud.isSuperAdmin || !Cloud.isSuperAdmin()) return;
    var ok = await FS.UI.ask("Put this post back to the original vault copy? Everyone will see the file version again.", {
      okText: "Revert",
      cancelText: "Keep edits"
    });
    if (!ok) return;
    try {
      await Cloud.clearVaultEdit(ed.vaultId);
      var orig = originalVaultPost(ed.vaultId);
      if (orig) {
        ed.title = orig.title || "";
        ed.format = orig.format || "";
        ed.promoting = orig.promoting || "";
      }
      if (st.data.vaultOverrides) {
        delete st.data.vaultOverrides[ed.vaultId];
        persist();
      }
      await loadVaultEdits(true);
      if (FS.UI && FS.UI.toast) FS.UI.toast("Reverted to the original.", { tone: "good" });
    } catch (err) {
      if (FS.UI && FS.UI.toast) FS.UI.toast((err && err.message) || "Couldn’t revert that.", { tone: "bad" });
    }
  }

  function renderVaultEditor() {
    var detail = $("calendarDetail");
    var titleEl = $("calSheetTitle");
    var st = getState();
    if (!detail || !st) return;
    var ae = document.activeElement;
    if (ae && detail.contains(ae) && (
      ae.id === "libDraft" ||
      ae.tagName === "TEXTAREA" ||
      ae.tagName === "INPUT" ||
      ae.tagName === "SELECT" ||
      (ae.getAttribute && ae.getAttribute("data-vault-admin"))
    )) return;
    var scheduled = null;
    var post = null;
    var ed = st.data.libraryEditing;
    var format = "";
    var promoting = "";
    var title = "";
    var body = "";
    var imageId = "";
    var dateKey = (st.data.calendarSelected || Cal.ymd(new Date()));

    if (ed && ed.vaultId) {
      post = findVaultPost(ed.vaultId);
      format = ed.format || (post && post.format) || "";
      promoting = ed.promoting || (post && post.promoting) || "";
      title = ed.title || (post && post.title) || "";
      body = ed.body || "";
      imageId = ed.imageId || "";
    } else {
      scheduled = scheduledVaultItem();
      if (!scheduled || !scheduled.item || !scheduled.item.vaultId) return;
      post = findVaultPost(scheduled.item.vaultId);
      format = scheduled.item.format || (post && post.format) || "";
      promoting = scheduled.item.promoting || (post && post.promoting) || "";
      title = scheduled.item.title || (post && post.title) || "";
      body = scheduled.item.draft || "";
      imageId = scheduled.item.imageId || "";
      dateKey = scheduled.date;
    }
    if (!post) return;

    setSheetKicker((format ? formatLabel(format) : "Vault") + (promoting ? " · " + promotingLabel(promoting) : ""));
    if (titleEl) titleEl.textContent = title || "Post idea";

    var html = "";
    if (scheduled) {
      html += calStatusFieldHtml(scheduled.item, {});
      html += '<p class="vault-on-day">On <strong>' + esc(selectedDayLabel({ data: { calendarSelected: dateKey } })) + "</strong></p>";
    } else {
      html += '<p class="vault-post-label"><span>Add to</span></p>' + vaultDateStripHtml(dateKey);
    }
    var adminSheet = !scheduled && Cloud.isSuperAdmin && Cloud.isSuperAdmin();
    if (adminSheet) {
      html += vaultAdminEditorHtml(post);
      html += vaultVerifyHtml(post);
    } else {
      html += vaultPostBodyHtml(post);
    }
    var photoTarget = scheduled ? scheduled.item : ed;
    var usedIds = persistedFrames(photoTarget).map(function (f) { return f.imageId; }).filter(Boolean);
    if (!usedIds.length && imageId) usedIds = [imageId];
    html += vaultPhotosHtml(post, usedIds);
    if (scheduled) html += calFramesHtml(scheduled.item);
    html += '<details class="vault-rewrite"><summary>Rewrite in your voice</summary>' +
      '<div class="field"><textarea id="libDraft" rows="8" placeholder="Steal the structure — rewrite until it sounds like you…">' +
      esc(body) + "</textarea>" +
      '<span class="cal-lib-sheet-hint">Copy is a starting point — rewrite until it sounds like you. Edits stay with this card.</span></div></details>';

    if (scheduled) {
      html += calEditorFooterHtml({});
    } else {
      html += '<div class="cal-sheet-actions">' +
        '<button type="button" class="btn" data-lib-commit>Add to ' + esc(selectedDayLabel(st)) + "</button>" +
        '<button type="button" class="btn-ghost" data-cal-save>Close</button>' +
      "</div>";
    }
    detail.innerHTML = html;
    if (scheduled) wireCalFrameFiles(scheduled.item.id);
    paintVaultBubble($("vaultAdminFormat"));
    paintVaultBubble($("vaultAdminPromoting"));

    function syncEd() {
      var cur = getState();
      var draftIn = $("libDraft");
      if (!draftIn) return;
      if (cur.data.libraryEditing && cur.data.libraryEditing.vaultId) {
        cur.data.libraryEditing.body = draftIn.value;
      } else {
        var row = scheduledVaultItem();
        if (row && row.item) row.item.draft = draftIn.value;
      }
      persist();
    }
    var draftIn = $("libDraft");
    if (draftIn) draftIn.addEventListener("input", syncEd);
  }

  window.FS.BridgeUI = {
    invalidateOrgEvents: function () {
      orgEventsCache = [];
      orgEventsLoadedAt = 0;
      leadInfoNotesCache = [];
      leadInfoNotesLoaded = false;
      if (Cloud.invalidateOrgEventsNet) Cloud.invalidateOrgEventsNet();
    },
    cachedOrgEvents: function () {
      return orgEventsCache.slice();
    },
    init: async function (hooks) {
      getState = hooks.getState;
      setStateFromCloud = hooks.setStateFromCloud;
      persist = hooks.persist;
      gotoPanel = hooks.gotoPanel;
      bindProgressAccount = hooks.bindProgressAccount || null;
      wire();
      try {
        await Cloud.init();
      } catch (err) {
        console.warn("[First Seeds] cloud init:", err);
      }
      try {
        if (Cloud.isSignedIn() && bindProgressAccount && Cloud.user()) {
          bindProgressAccount(Cloud.user().id);
        } else if (!Cloud.isSignedIn() && bindProgressAccount && Cloud.choseSignOut && Cloud.choseSignOut()) {
          /* Keep guest bucket if already guest; only switch when they tapped Log out. */
          var st0 = getState && getState();
          if (st0 && st0.settings && st0.settings.boundUserId) bindProgressAccount("");
        }
      } catch (err) {
        console.warn("[First Seeds] bind account:", err);
      }
      try {
        if (Cloud.isSignedIn()) await mergeCloudProgressQueued();
        if (window.FS.markCloudSyncOk) window.FS.markCloudSyncOk();
      } catch (err) {
        if (window.FS.reportError) window.FS.reportError("progress merge", err);
        if (window.FS.markCloudSyncError) window.FS.markCloudSyncError(err);
      }
      try {
        await afterAuth();
      } catch (err) {
        console.warn("[First Seeds] after auth:", err);
        renderAuthChrome();
      }
      if (teamTreeGrowDemoOn()) {
        showTeamTreeGrowDemo();
        setTimeout(showTeamTreeGrowDemo, 400);
        setTimeout(showTeamTreeGrowDemo, 1200);
        setTimeout(showTeamTreeGrowDemo, 2500);
      }
      try {
        await loadVaultEdits(true);
      } catch (err) {
        console.warn("[First Seeds] vault edits:", err);
      }
      try {
        await loadAppBulletins(true);
        refreshGroveBoardPip();
      } catch (err) {
        console.warn("[First Seeds] bulletins:", err);
      }
      Cloud.onChange(function () {
        afterAuth().catch(function (err) {
          console.warn("[First Seeds] auth refresh:", err);
          renderAuthChrome();
        });
      });
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
          if (Cloud.isSignedIn()) {
            setTimeout(function () {
              if (document.visibilityState !== "visible") return;
              if (Date.now() - lastMergeAt < 20000) return;
              var ae = document.activeElement;
              var tag = ae && ae.tagName;
              if (tag === "TEXTAREA" || (tag === "INPUT" && !/^(button|submit|checkbox|radio|hidden)$/i.test(ae.type || "text"))) {
                return;
              }
              mergeCloudProgressQueued().then(function () {
                if (window.FS.markCloudSyncOk) window.FS.markCloudSyncOk();
              }).catch(function (err) {
                if (window.FS.reportError) window.FS.reportError("progress merge", err);
                if (window.FS.markCloudSyncError) window.FS.markCloudSyncError(err);
              });
            }, 700);
          }
          refreshIncomingMessages();
          loadVaultEdits(false);
          loadAppBulletins(false).then(function () { refreshGroveBoardPip(); }).catch(function () {});
          var vis = getState && getState();
          if (Cloud.isSignedIn() && Cloud.listGroveShares && !(packEvergreen && packEvergreen())) {
            loadGroveShares(false).then(function () {
              paintGroveShelfCta();
              if (vis && vis.active === "grove-shelf") renderGroveShelf();
            });
          }
          if (Cloud.isSignedIn() && Cloud.tryAttachPendingSponsor) {
            Cloud.tryAttachPendingSponsor().then(function (ok) {
              if (ok) renderSupportBanner().catch(function () {});
            }).catch(function () {});
          }
          if (Cloud.isSignedIn() && Cloud._refreshProfileOrg) {
            if (!lastProfileOrgAt || Date.now() - lastProfileOrgAt > 60000) {
              lastProfileOrgAt = Date.now();
              var wasAdmin = Cloud.isOrgAdmin();
              Cloud._refreshProfileOrg().then(function () {
                if (typeof window.FS.applyPackChrome === "function") {
                  try { window.FS.applyPackChrome(); } catch (e) {}
                }
                if (!wasAdmin && Cloud.isOrgAdmin() && typeof window.FS.maybeShowGroveLeaderWelcome === "function") {
                  window.FS.maybeShowGroveLeaderWelcome();
                }
              }).catch(function () {});
            }
          }
        }
      });
      window.addEventListener("focus", function () {
        refreshIncomingMessages();
        if (Cloud.isSignedIn() && Cloud.tryAttachPendingSponsor) {
          Cloud.tryAttachPendingSponsor().catch(function () {});
        }
      });
    },
    mergeProgress: mergeCloudProgressQueued,
    clearSyncBase: function () {
      syncBase = null;
      syncBaseForKey = "";
      try { localStorage.removeItem(syncBaseKey()); } catch (e) {}
    },
    syncNow: async function (opts) {
      opts = opts || {};
      return enqueueSync(function () {
        if (opts.merge) return mergeCloudProgress();
        return pushProgressNow();
      });
    },
    renderLeader: renderLeader,
    renderGroveBoard: renderGroveBoard,
    renderEvergreenBoard: renderEvergreenBoard,
    setGroveBoardTab: setGroveBoardTab,
    renderEvergreenLeadersRoster: renderEvergreenLeadersRoster,
    onPanelChange: onPanelChange,
    renderCalendar: renderCalendar,
    renderCuriosityPhotos: renderCuriosityPhotos,
    closeCuriosityLightbox: closeCuriosityLightbox,
    closeCalSheet: closeCalSheet,
    closeAllSheets: closeAllSheets,
    renderContentVault: renderContentVault,
    renderContentStories: renderContentStories,
    renderContentWeek: renderContentWeek,
    renderGroveShelf: renderGroveShelf,
    renderCheers: renderCheers,
    renderLeaderNoteBanner: renderLeaderNoteBanner,
    renderSupportBanner: renderSupportBanner,
    refreshTeamBadge: refreshTeamBadge,
    refreshIncomingMessages: refreshIncomingMessages,
    renderGatheringBanner: renderGatheringBanner,
    renderLeads: renderLeads,
    renderLeadsList: renderLeadsList,
    refreshGroveDoorPanel: refreshGroveDoorPanel,
    syncLeadsShareUI: syncLeadsShareUI,
    setAllLeadFollowUps: setAllLeadFollowUps,
    prepareLeadsTourTarget: prepareLeadsTourTarget,
    openAuth: openAuth,
    openCheerSheetForTour: openCheerSheetForTour,
    closeCheerSheet: closeCheerSheet,
    openNoteSheetForTour: openNoteSheetForTour,
    closeNoteSheet: closeNoteSheet
  };
  window.FS.refreshGroveDoorPanel = refreshGroveDoorPanel;
})();
