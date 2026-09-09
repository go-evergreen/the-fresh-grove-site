/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — Understanding the compensation plan
   For leaders, first. Source: Ringana Commission Guidelines
   USA-EN, RCG 1.0 (10/2026), preview.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var POINTS_FACTOR = 1.6;
  var VOUCHER_THRESHOLD = 50;
  var DT_RATE = { 1: 0.19, 2: 0.29, 3: 0.39, 4: 0.39, 5: 0.39, 6: 0.39, 7: 0.39, 8: 0.39, 9: 0.39, 10: 0.39 };
  var GEN_TABLE = {
    1:  [0.08, 0.02],
    2:  [0.08, 0.04, 0.03],
    3:  [0.08, 0.09, 0.04, 0.02],
    4:  [0.09, 0.14, 0.05, 0.03, 0.02],
    5:  [0.09, 0.14, 0.06, 0.04, 0.02, 0.01],
    6:  [0.09, 0.14, 0.06, 0.04, 0.02, 0.02, 0.01, 0.01, 0.01],
    7:  [0.09, 0.14, 0.06, 0.04, 0.02, 0.02, 0.01, 0.01, 0.01],
    8:  [0.09, 0.14, 0.06, 0.04, 0.02, 0.02, 0.01, 0.01, 0.01],
    9:  [0.09, 0.14, 0.06, 0.04, 0.02, 0.02, 0.01, 0.01, 0.01],
    10: [0.09, 0.14, 0.06, 0.04, 0.02, 0.02, 0.01, 0.01, 0.01]
  };
  var LEVELS = [
    { tl: 1,  basis: "DT", req: "DT 110",               alt: null,     growth: null, cap: 500,  capTag: "plan" },
    { tl: 2,  basis: "DT", req: "DT 220 + TT 1,000",    alt: "DT 385", growth: null, cap: 1000, capTag: "plan" },
    { tl: 3,  basis: "DT", req: "DT 330 + TT-1 1,600",  alt: "DT 825", growth: null, cap: 1500, capTag: "plan" },
    { tl: 4,  basis: "CT", req: "CT 330 + TT-1 3,200",  alt: null,     growth: null, cap: 2000, capTag: "plan" },
    { tl: 5,  basis: "CT", req: "CT 330 + TT-2 4,000",  alt: null,     growth: null, cap: 3000, capTag: "plan" },
    { tl: 6,  basis: "CT", req: "CT 330 + TT-2 8,000",  alt: null,     growth: "2%",   npv: "NPV-2 (3Gen) 3,500", cap: 4500, capTag: "plan" },
    { tl: 7,  basis: "CT", req: "CT 330 + TT-2 15,000", alt: null,     growth: "3%",   npv: "NPV-2 (3Gen) 3,500", cap: 7000, capTag: "plan" },
    { tl: 8,  basis: "CT", req: "CT 330 + TT-3 20,000", alt: null,     growth: "4%",   npv: "NPV-3 (3Gen) 3,500", cap: null, capTag: "plan" },
    { tl: 9,  basis: "CT", req: "CT 330 + TT-3 40,000", alt: null,     growth: "4.5%", npv: "NPV-3 (3Gen) 3,500", cap: null, capTag: "plan" },
    { tl: 10, basis: "CT", req: "CT 330 + TT-3 60,000", alt: null,     growth: "5%",   npv: "NPV-3 (3Gen) 3,500", cap: null, capTag: "plan" }
  ];
  var VOCAB = [
    {
      short: "PT", name: "Personal Turnover",
      plain: "Points from what you buy yourself.",
      note: "Your own orders. They still earn commission the whole way. They stop counting for qualification at Target 4."
    },
    {
      short: "CT", name: "Customer Turnover",
      plain: "Points from what your customers buy. Your own orders are not included.",
      note: "From Target 4 up, this is the one that has to be there. Real customer sales."
    },
    {
      short: "DT", name: "Direct Turnover",
      plain: "CT plus PT. Everything you personally generate.",
      note: "Lovely early on. From Target 4 they want the customer half of this, not just your own shopping."
    },
    {
      short: "TT", name: "Team Turnover",
      plain: "Your DT plus the DT of everyone below you, all generations. Volume is not capped.",
      note: "The big number. Usually not the one they use to see if you qualified. Your strongest team still sits in TT. Through Target 7, what can be capped is what that one team pays after the percentages. Target 8 and up have no cap."
    }
  ];
  var LEGS = [
    { label: "Team B", value: 1800, hint: "B 900 · D 600 · E 300" },
    { label: "Team A", value: 1700, hint: "A 700 · C 1,000" },
    { label: "Team C", value: 900,  hint: "another first-gen team" },
    { label: "Team D", value: 400,  hint: "another first-gen team" }
  ];
  var OWN_DT = 1000;
  var STRIP_COPY = {
    0: "Everything counts — 5,800. A and B are Ringana’s two-team picture (those plus your 1,000 were 4,500). C and D are here so TT-2 and TT-3 have something to take out.",
    1: "Strongest team out (B, 1,800). What’s left is 4,000. Targets 3 and 4 use TT-1.",
    2: "Two strongest out (B and A). What’s left is 2,300. Targets 5–7 use TT-2.",
    3: "Three strongest out (B, A, and C). What’s left is 1,400. Targets 8–10 use TT-3."
  };
  var START_MONTHS = [
    { m: 1, tl: 1, partners: 0, bonus: null, tag: "plan",      note: "Hit Target 1. That keeps you in. There’s no cash on this row of the bonus table — month 1 is the on-ramp." },
    { m: 2, tl: 2, partners: 0, bonus: 110,  tag: "plan",      note: "Target 2, and no personal active partners required yet. If you want someone to count in month 3, enroll them this month." },
    { m: 3, tl: 3, partners: 1, bonus: 220,  tag: "plan",      note: "Target 3 and one direct, active partner. For Start Bonus, that partner needs to have been enrolled in month 2 — first-timers can’t count in the month you sign them." },
    { m: 4, tl: 4, partners: 2, bonus: 2200, tag: "plan",      note: "Target 4 and two direct, active partners. Both need to be enrolled by month 3 so they’re billed in month 4. Miss either bar and the program ends." },
    { m: 5, tl: 5, partners: 3, bonus: 3300, tag: "extension", note: "Target 5 and three active partners." },
    { m: 6, tl: 6, partners: 4, bonus: 5500, tag: "extension", note: "Target 6 and four active partners. Growth Bonus also becomes available at this level." },
    { m: 7, tl: 7, partners: 5, bonus: 8250, tag: "extension", note: "Target 7 and five active partners." },
    { m: 8, tl: 8, partners: 6, bonus: 11000, tag: "extension", note: "Target 8 and six active partners." }
  ];
  /* Growth Bonus. The rate is your Target Level's, and it's gated on new-partner
     volume: TT-2 targets read NPV-2 (3Gen), TT-3 targets read NPV-3 (3Gen). Miss
     NPV-3 at Target 8+ but clear NPV-2 and the plan pays the Target 7 rate. */
  var GROWTH_RATE = { 6: 0.02, 7: 0.03, 8: 0.04, 9: 0.045, 10: 0.05 };
  var GROWTH_STRIP = { 6: 2, 7: 2, 8: 3, 9: 3, 10: 3 };
  var GROWTH_NPV_MIN = 3500;
  var GROWTH_SLOTS = 3;
  var COACHING = [
    { q: "Okay but how many dollars is a point?",
      a: "Two different points. A commission point pays $1.60 — that’s in the plan. A product point is just how much product moved, and we don’t have US values in writing yet. Easy to mash them together. Don’t." },
    { q: "Why does Target 4 feel like a different sport than 3?",
      a: "Because it is. Targets 1–3 count Direct Turnover, which includes what you buy. Target 4 wants Customer Turnover — real customer sales — and the strongest team is already subtracted. What you buy still earns commission. It just doesn’t help you qualify anymore." },
    { q: "Should I just enroll more people on my first line?",
      a: "Usually that’s not where the plan lights up. First generation only moves 8% to 9%. Second generation goes 2% to 14%. Helping your people enroll people is the part that grows. Try it in the calculator — same 2,000 points in gen 1 vs gen 2." },
    { q: "My team volume is huge. Why wouldn’t I qualify?",
      a: "From Target 3 up they subtract the strongest team (then two, then three) before they look. One giant team can leave you with almost nothing on the qualification number." },
    { q: "I enrolled someone this month. Do they count?",
      a: "Not for Start Bonus partner-count, if they’re brand new. They’re billed after their first full statement month, and activity is only measured then. So they count next month, not this one. Returning partners are billed the month they rejoin." },
    { q: "What does active even mean?",
      a: "Target 1 — 110 DT points that statement month. That’s also what lets someone earn commission. For Start Bonus, a first-timer also has to have hit that first billing. Signing up with no order isn’t active." },
    { q: "Do I get paid on what’s left after the person below me?",
      a: "No. Team turnover is generational, not differential. You get a set percentage based on which generation that person is from you. The person above you gets their generation’s rate on the same volume — not the remainder after you." },
    { q: "Does the cap mean my biggest team only counts as 1,500 volume?",
      a: "No — that’s two rules sitting on top of each other. Qualification can subtract a strongest team’s volume. The pay cap doesn’t shrink volume at all. It limits the commission points Ringana will pay on that one team after the percentages. At Target 6 the ceiling is 4,500 commission points, not 1,500. 1,500 is Target 3. Your own DT and the other teams aren’t under it. From Target 8 the cap is gone. Growth Bonus is a separate line." },
    { q: "Why a voucher instead of a deposit?",
      a: "Under $50, commission and Interim Payments come as a product voucher on ringana.us. Over $50, it transfers." }
  ];

  /* Qualification bars, as structured data so the playground checks the same
     rules the grid prints. strip is how many strongest teams step aside:
     0 = TT, 1 = TT-1, 2 = TT-2, 3 = TT-3. solo is the alternate direct-only route. */
  var NEED = {
    1:  { basis: "DT", direct: 110, strip: null, team: null,  solo: null },
    2:  { basis: "DT", direct: 220, strip: 0,    team: 1000,  solo: 385 },
    3:  { basis: "DT", direct: 330, strip: 1,    team: 1600,  solo: 825 },
    4:  { basis: "CT", direct: 330, strip: 1,    team: 3200,  solo: null },
    5:  { basis: "CT", direct: 330, strip: 2,    team: 4000,  solo: null },
    6:  { basis: "CT", direct: 330, strip: 2,    team: 8000,  solo: null },
    7:  { basis: "CT", direct: 330, strip: 2,    team: 15000, solo: null },
    8:  { basis: "CT", direct: 330, strip: 3,    team: 20000, solo: null },
    9:  { basis: "CT", direct: 330, strip: 3,    team: 40000, solo: null },
    10: { basis: "CT", direct: 330, strip: 3,    team: 60000, solo: null }
  };
  var TEAM_LETTERS = ["A", "B", "C", "D"];
  /* The dials and the jump-to-target solve have to agree on these, or the shape
     it plugs in won't sit on a notch the sliders can actually hold. */
  var PLAY_OWN_MAX = 5000;
  var PLAY_OWN_STEP = 10;
  var PLAY_TEAM_MAX = 60000;
  var PLAY_TEAM_STEP = 100;
  /* A team is a list of point volumes by generation: index 0 is the first-generation
     partner's own DT, index 1 the people they enrolled, and so on down. Depth is the
     second axis the old two-tool split was missing — the pay cap lands on one team
     after generation percentages, so you can't apply it without knowing both. */
  var PLAY_GEN_MAX = 9;
  /* Conservative default mix for a team you haven’t opened yet: half is people
     you enrolled (gen 1), then the people they enrolled (gen 2 — the richest
     row from Target 3), then one more step down. Dumping everything in gen 2
     is the optimistic read; this one isn’t. */
  var PLAY_DEFAULT_MIX = [0.5, 0.3, 0.2];
  var PLAY_PRESETS = {
    giant: {
      label: "One giant team",
      own: 1000,
      teams: [[25000, 15000, 10000], [5000, 3000, 2000], [4000, 2400, 1600], [2500, 1500, 1000]]
    },
    spread: {
      label: "Same volume, spread out",
      own: 1000,
      teams: [[10000, 6000, 4000], [9500, 5700, 3800], [9000, 5400, 3600], [8000, 4800, 3200]]
    },
    ringana: {
      label: "Ringana’s example",
      own: 1000,
      teams: [[700, 1000], [900, 900], [0, 0], [0, 0]]
    }
  };

  var ui = {
    openVocab: null,
    strip: 0,
    activeTL: 4,
    openCoach: null,
    packLeaders: "leaders",
    openSecs: null,
    play: clonePreset("giant"),
    playPreset: "giant",
    playJumped: null,
    playWay: null,
    playDepth: false,
    playBonus: false,
    playHelp: null,
    playWork: false,
    startMonth: 0,
    startPartners: 0,
    npv2: 0,
    npv3: 0,
    gbPartners: [{ tl: 7, tt: 0 }, { tl: 6, tt: 0 }, { tl: 6, tt: 0 }]
  };

  function clonePreset(key) {
    var p = PLAY_PRESETS[key];
    var teams = [];
    for (var i = 0; i < p.teams.length; i++) teams.push({ gens: p.teams[i].slice() });
    return { own: p.own, teams: teams };
  }

  function splitByMix(vol, mix) {
    vol = Math.max(0, Math.round(Number(vol) || 0));
    mix = mix || PLAY_DEFAULT_MIX;
    var next = [];
    var i;
    if (!vol) {
      for (i = 0; i < mix.length; i++) next.push(0);
      return next;
    }
    var run = 0;
    var big = 0;
    for (i = 0; i < mix.length; i++) {
      var v = Math.max(0, Math.round(vol * mix[i]));
      next.push(v);
      run += v;
      if (v >= next[big]) big = i;
    }
    next[big] = Math.max(0, next[big] + (vol - run));
    return next;
  }

  function genSum(gens) {
    var s = 0;
    for (var i = 0; i < gens.length; i++) s += gens[i] || 0;
    return s;
  }

  /* Dragging a team's slider scales it and keeps its shape, so the depth you set
     up survives being resized. Only a team with nothing in it needs a shape
     invented, and it gets the same lead split the presets use. */
  function setTeamVol(team, vol) {
    vol = Math.max(0, Math.round(vol));
    var cur = genSum(team.gens);
    if (!cur) {
      team.gens = splitByMix(vol);
      return;
    }
    var k = vol / cur;
    var next = [];
    var run = 0;
    var big = 0;
    for (var i = 0; i < team.gens.length; i++) {
      var v = Math.max(0, Math.round((team.gens[i] || 0) * k));
      next.push(v);
      run += v;
      if (v > next[big]) big = i;
    }
    next[big] = Math.max(0, next[big] + (vol - run));
    team.gens = next;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function usd(n, digits) {
    var d = digits == null ? 2 : digits;
    return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d, minimumFractionDigits: d });
  }
  function num(n) {
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: 1 });
  }
  function pts(n) {
    return num(n) + " pts";
  }
  function capLabel(lv) {
    if (!lv || lv.cap == null) return "none";
    return num(lv.cap);
  }
  function tag(kind) {
    var labels = { plan: "In the plan", confirmed: "Confirmed", extension: "Projected", estimate: "Estimate" };
    var label = labels[kind];
    if (!label) return "";
    return '<span class="cp-tag' + (kind === "plan" ? " on" : "") + '">' + esc(label) + "</span>";
  }
  function pct(rate) {
    var n = Math.round(rate * 1000) / 10;
    return String(n).replace(/\.0$/, "") + "%";
  }
  function cell(text, on, blank, tl) {
    return '<td class="' + (on ? "on" : "") + (blank ? " cp-blank" : "") + '" data-cp="tl" data-cp-v="' + tl + '">' + text + "</td>";
  }
  function teamCheck(tl) {
    if (tl <= 1) return "—";
    if (tl === 2) return "TT";
    if (tl <= 4) return "TT-1";
    if (tl <= 7) return "TT-2";
    return "TT-3";
  }
  function teamCheckCopy(tl) {
    var k = teamCheck(tl);
    if (k === "—") return "None. Just your own Direct Turnover.";
    if (k === "TT") return "TT — full team volume. Your strongest team is still in.";
    if (k === "TT-1") return "TT-1 — strongest first-generation team steps aside.";
    if (k === "TT-2") return "TT-2 — two strongest teams step aside.";
    return "TT-3 — three strongest teams step aside.";
  }
  function htmlTlPicks(active, kind) {
    var html = '<div class="cp-tl-grid">';
    for (var i = 0; i < LEVELS.length; i++) {
      var l = LEVELS[i];
      html += '<button type="button" class="cp-tl' + (active === l.tl ? " on" : "") + (l.tl === 4 && active !== 4 ? " is-turn" : "") +
        '" data-cp="' + kind + '" data-cp-v="' + l.tl + '">' + l.tl + "</button>";
    }
    html += "</div>";
    return html;
  }
  function levelBy(tl) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].tl === tl) return LEVELS[i];
    return LEVELS[0];
  }
  function round2(n) {
    return Math.round(n * 100) / 100;
  }
  function money(n) {
    return usd(n, Math.round(n * 100) % 100 === 0 ? 0 : 2);
  }
  function joinList(arr) {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + " and " + arr[1];
    return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
  }
  function outPhrase(letters) {
    if (!letters.length) return "";
    /* Careful here: the strip takes a team out of the number that decides your
       target. It does not take them out of the check — they still pay. */
    if (letters.length === 1) return "Team " + letters[0] + " steps aside to qualify";
    return "Teams " + joinList(letters) + " step aside to qualify";
  }
  function stripName(n) {
    return n === 0 ? "TT" : "TT-" + n;
  }
  function leftoverPhrase(m) {
    var live = 0;
    for (var i = 0; i < m.teams.length; i++) if (m.teams[i].vol > 0) live++;
    var left = Math.max(0, live - m.block.strip);
    if (!left) return "your own DT and nothing else";
    var words = ["", "one", "two", "three"];
    return "your own DT and " + (words[left] || left) + " team" + (left > 1 ? "s" : "");
  }

  /* One month, modelled on the printed tables. Each team is one first-generation
     partner plus the people under them, split by generation so the % can land. */
  function playModel() {
    var own = Math.max(0, ui.play.own);
    var teams = [];
    var teamTotal = 0;
    var i, t;
    for (i = 0; i < ui.play.teams.length; i++) {
      var gens = ui.play.teams[i].gens;
      var vol = genSum(gens);
      teams.push({ i: i, letter: TEAM_LETTERS[i], label: "Team " + TEAM_LETTERS[i], gens: gens, vol: vol });
      teamTotal += vol;
    }
    var sorted = teams.slice().sort(function (a, b) { return b.vol - a.vol; });
    var tt = own + teamTotal;
    var strip = [tt];
    var removed = [[]];
    var running = tt;
    var out = [];
    for (i = 1; i <= 3; i++) {
      if (sorted[i - 1] && sorted[i - 1].vol > 0) {
        running -= sorted[i - 1].vol;
        out = out.concat([sorted[i - 1].letter]);
      }
      strip[i] = running;
      /* Which teams got taken is what matters, not the order they were taken in.
         Alphabetical reads as a list; volume order reads as "Teams B and A". */
      removed[i] = out.slice().sort();
    }

    var m = { own: own, ownCT: own, teams: teams, tt: tt, strip: strip, removed: removed };
    m.tl = 0;
    for (t = 10; t >= 1; t--) {
      if (levelPasses(t, m)) { m.tl = t; break; }
    }
    m.next = m.tl < 10 ? m.tl + 1 : 0;
    m.block = m.next ? blockDetail(m.next, m) : null;

    var rates = m.tl ? GEN_TABLE[m.tl] : null;
    m.g1 = rates ? rates[0] : 0;
    m.g2 = rates ? rates[1] : 0;
    m.cap = m.tl ? levelBy(m.tl).cap : null;
    m.ownPts = m.tl ? own * DT_RATE[m.tl] : 0;
    m.strongest = sorted[0] && sorted[0].vol > 0 ? sorted[0] : null;

    var totalPts = m.ownPts;
    m.paidGens = rates ? rates.length : 0;
    m.deepVol = 0;
    for (i = 0; i < teams.length; i++) {
      var team = teams[i];
      var earned = 0;
      team.deep = 0;
      for (var g = 0; g < team.gens.length; g++) {
        var gv = team.gens[g] || 0;
        /* Volume below the last paid generation still counts in TT — it just
           doesn't earn. That's the plan, and it's easy to miss. */
        if (rates && g < rates.length) earned += gv * rates[g];
        else team.deep += gv;
      }
      m.deepVol += team.deep;
      team.earned = m.tl ? round2(earned) : 0;
      team.isStrongest = !!(m.strongest && m.strongest.i === team.i);
      team.capped = team.isStrongest && m.tl > 0 && m.cap != null && team.earned > m.cap;
      team.paid = team.capped ? m.cap : team.earned;
      totalPts += team.paid;
    }
    m.totalPts = round2(totalPts);
    m.dollars = round2(m.totalPts * POINTS_FACTOR);
    m.strongTeam = m.strongest ? teams[m.strongest.i] : null;
    m.capWall = !!(m.strongTeam && m.strongTeam.capped);
    m.qualWall = !!(m.block && m.block.kind === "team" && m.block.strip >= 1 && m.strongTeam);
    m.share = m.tt > 0 && m.strongTeam ? m.strongTeam.vol / m.tt : 0;
    m.dominant = m.share >= 0.5;
    return m;
  }

  /* Growth Bonus is a differential, not a flat percentage. Anyone under you who
     is already Target 6 or higher earns their own on their turnover, so their TT
     leaves your base and you take the gap between your rate and theirs instead. */
  function growthModel(m) {
    var g = { on: false, rate: 0, base: 0, lines: [], points: 0, dollars: 0, claimed: 0 };
    if (!m.tl || m.tl < 6) { g.reason = "level"; return g; }
    var strip = GROWTH_STRIP[m.tl];
    var have = strip === 3 ? ui.npv3 : ui.npv2;
    g.strip = strip;
    g.need = GROWTH_NPV_MIN;
    if (have >= GROWTH_NPV_MIN) {
      g.rate = GROWTH_RATE[m.tl];
      g.source = "full";
    } else if (strip === 3 && ui.npv2 >= GROWTH_NPV_MIN) {
      g.rate = GROWTH_RATE[7];
      g.source = "fallback";
    } else {
      g.reason = "npv";
      return g;
    }

    var pts = 0;
    for (var i = 0; i < ui.gbPartners.length; i++) {
      var p = ui.gbPartners[i];
      var tt = Math.max(0, p.tt || 0);
      if (!tt) continue;
      g.claimed += tt;
      /* A downline above your own level can't hand you a negative line. */
      var diff = Math.max(0, g.rate - (GROWTH_RATE[p.tl] || 0));
      var linePts = round2(tt * diff);
      g.lines.push({ tl: p.tl, tt: tt, diff: diff, points: linePts });
      pts += linePts;
    }
    g.base = Math.max(0, m.tt - g.claimed);
    g.basePoints = round2(g.base * g.rate);
    g.points = round2(g.basePoints + pts);
    g.dollars = round2(g.points * POINTS_FACTOR);
    g.on = true;
    return g;
  }

  /* Start Bonus has two jobs that people run together. The statement month sets
     the bars you must clear to stay in the program at all; what you get paid is a
     separate lookup on what you actually reached, so overshooting pays more. */
  function startModel(m) {
    var s = { on: false, month: ui.startMonth, amount: 0 };
    if (!ui.startMonth) return s;
    var row = START_MONTHS[ui.startMonth - 1];
    if (!row) return s;
    s.row = row;
    s.tl = m.tl || 0;
    s.partners = Math.max(0, ui.startPartners || 0);
    s.passTL = s.tl >= row.tl;
    s.passPartners = s.partners >= row.partners;
    s.eligible = s.passTL && s.passPartners;
    s.projected = row.tag === "extension";
    if (!s.eligible) return s;
    for (var i = 0; i < START_MONTHS.length; i++) {
      var r = START_MONTHS[i];
      if (!r.bonus) continue;
      /* The extra four months aren't in the PDF, so their rows only come into
         play once you're actually in them. */
      if (r.tag === "extension" && ui.startMonth < 5) continue;
      if (s.tl >= r.tl && s.partners >= r.partners && r.bonus > s.amount) {
        s.amount = r.bonus;
        s.paidRow = r;
      }
    }
    s.on = s.amount > 0;
    return s;
  }

  /* playModel run backwards: given a target, the least volume that reaches it.
     Equal teams really is the cheapest shape — the strip removes your biggest
     ones, so whatever survives it can't be smaller than what was taken. Make one
     team lighter and it becomes the one left holding the number. */
  function playJumpShape(tl) {
    var need = NEED[tl];
    var per = 0;
    if (need.team != null) {
      var kept = TEAM_LETTERS.length - (need.strip || 0);
      per = Math.max(0, Math.ceil((need.team - need.direct) / kept));
      per = Math.ceil(per / PLAY_TEAM_STEP) * PLAY_TEAM_STEP;
    }
    var teams = [];
    for (var i = 0; i < TEAM_LETTERS.length; i++) teams.push({ gens: splitByMix(per) });
    return { own: need.direct, teams: teams };
  }

  /* The same target built three ways. Scaling each preset's shape until it clears
     the bar is the argument this whole board exists to make: the volume it takes
     depends enormously on how it's spread, and lopsided can miss at any size. */
  function playShapeCost(key, tl) {
    var need = NEED[tl];
    var p = PLAY_PRESETS[key];
    var out = { key: key, label: p.label, own: need.direct, teams: [], total: need.direct, fits: true, possible: true, live: 0 };
    var i;
    var vols = [];
    for (i = 0; i < p.teams.length; i++) {
      vols.push(genSum(p.teams[i]));
      if (vols[i] > 0) out.live++;
    }
    if (need.team == null) {
      for (i = 0; i < p.teams.length; i++) out.teams.push(0);
      return out;
    }
    var n = need.strip || 0;
    var ordered = vols.slice();
    ordered.sort(function (a, b) { return b - a; });
    var keptSum = 0;
    for (i = n; i < ordered.length; i++) keptSum += ordered[i];
    /* Every team that would survive the strip is empty, so no amount of growth in
       the ones being subtracted moves the number this target reads. */
    if (keptSum <= 0) { out.possible = false; return out; }
    var k = (need.team - need.direct) / keptSum;
    for (i = 0; i < p.teams.length; i++) {
      var v = Math.ceil((vols[i] * k) / PLAY_TEAM_STEP) * PLAY_TEAM_STEP;
      if (v > PLAY_TEAM_MAX) out.fits = false;
      out.teams.push(v);
      out.total += v;
    }
    return out;
  }

  function playShapeLoad(key, tl) {
    var cost = playShapeCost(key, tl);
    if (!cost.possible || !cost.fits) return null;
    var teams = [];
    for (var i = 0; i < cost.teams.length; i++) {
      /* Scale the preset's own generation split up to the volume this target
         needs, so loading a shape keeps its depth as well as its spread. */
      var team = { gens: PLAY_PRESETS[key].teams[i].slice() };
      setTeamVol(team, cost.teams[i]);
      teams.push(team);
    }
    return { own: cost.own, teams: teams };
  }

  function htmlPlayWays(tl) {
    var need = NEED[tl];
    if (need.team == null) {
      return '<p class="cpp-jump-note">' + esc(playJumpNote(tl)) + "</p>";
    }
    var floor = playJumpShape(tl);
    var floorTotal = floor.own;
    for (var f = 0; f < floor.teams.length; f++) floorTotal += genSum(floor.teams[f].gens);

    var rows = [];
    var impossible = null;
    for (var key in PLAY_PRESETS) {
      if (!Object.prototype.hasOwnProperty.call(PLAY_PRESETS, key)) continue;
      var c = playShapeCost(key, tl);
      if (!c.possible && !impossible) impossible = c;
      rows.push(c);
    }
    /* Cheapest first. The multiple between the top row and the bottom one is the
       entire point, and it only lands if they're stacked in order. */
    rows.sort(function (a, b) {
      if (a.possible !== b.possible) return a.possible ? -1 : 1;
      return a.total - b.total;
    });

    var html = '<div class="cpp-ways">' +
      '<span class="cpp-ways-k">Target ' + tl + ", four ways · TT in points</span>" +
      '<button type="button" class="cpp-way' + (ui.playWay ? "" : " on") + '" data-cp="way" data-cp-v="">' +
        '<span class="cpp-way-l">Even, four teams</span>' +
        '<span class="cpp-way-v">' + pts(floorTotal) + "</span>" +
      "</button>";

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var dead = !row.possible || !row.fits;
      html += "<button type=\"button\" class=\"cpp-way" + (ui.playWay === row.key ? " on" : "") + (dead ? " is-dead" : "") +
        '" data-cp="way" data-cp-v="' + row.key + '"' + (dead ? " disabled" : "") + ">" +
        '<span class="cpp-way-l">' + esc(row.label) +
          (!row.possible ? '<em class="cpp-way-tag">at any size</em>' : !row.fits ? '<em class="cpp-way-tag">past the dial</em>' : "") +
        "</span>" +
        '<span class="cpp-way-v">' + (row.possible ? pts(row.total) : "never") + "</span>" +
      "</button>";
    }

    html += '<p class="cpp-way-note">' + esc(playJumpNote(tl));
    if (impossible) {
      var words = ["", "one", "two", "three", "four"];
      html += " " + esc(impossible.label + " never gets there at any size — it’s " + (words[impossible.live] || impossible.live) +
        " team" + (impossible.live === 1 ? "" : "s") + " and " + stripName(need.strip) + " subtracts " +
        (words[need.strip] || need.strip) + ", so there’s nothing left to count. More volume in them just gets subtracted too.");
    }
    html += "</p></div>";
    return html;
  }

  function playJumpNote(tl) {
    var need = NEED[tl];
    var solo = need.solo
      ? " There’s also a solo route: " + need.basis + " " + num(need.solo) + " with no team at all."
      : "";
    if (need.team == null) {
      return "Target " + tl + " asks for nothing but your own " + num(need.direct) +
        " points. No team at all — this is the one that just means active.";
    }
    var n = need.strip || 0;
    if (!n) {
      return "Target " + tl + " counts your whole TT with nothing subtracted, so it doesn’t matter where the volume sits." + solo;
    }
    var words = ["", "one", "two", "three"];
    var kept = TEAM_LETTERS.length - n;
    return "Even four teams is the cheapest team shape. " + stripName(n) + " takes your " + words[n] +
      " strongest off the top, so what’s left — " + (kept === 1 ? "one team" : words[kept] + " teams") +
      " plus your own DT — has to clear " + pts(need.team) + " alone. The totals above are TT in points, not dollars." + solo;
  }

  function levelPasses(tl, m) {
    var need = NEED[tl];
    var direct = need.basis === "CT" ? m.ownCT : m.own;
    if (need.solo && direct >= need.solo) return true;
    if (direct < need.direct) return false;
    if (need.team == null) return true;
    return m.strip[need.strip] >= need.team;
  }

  function blockDetail(tl, m) {
    var need = NEED[tl];
    var direct = need.basis === "CT" ? m.ownCT : m.own;
    if (direct < need.direct) {
      return { kind: "direct", basis: need.basis, want: need.direct, have: direct,
        line: "Target " + tl + " wants " + need.basis + " " + num(need.direct) + ". Yours is " + num(direct) + "." };
    }
    if (need.team != null && m.strip[need.strip] < need.team) {
      var phrase = outPhrase(m.removed[need.strip]);
      return { kind: "team", strip: need.strip, want: need.team, have: m.strip[need.strip],
        line: "Target " + tl + " wants " + stripName(need.strip) + " of " + num(need.team) + ". Yours is " + num(m.strip[need.strip]) +
          (phrase ? " — " + phrase + "." : ".") };
    }
    return null;
  }

  function snapshotFolds(root) {
    if (!root) return;
    var open = {};
    var nodes = root.querySelectorAll("details[data-cp-sec]");
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].getAttribute("data-cp-sec");
      if (id) open[id] = !!nodes[i].open;
    }
    ui.openSecs = open;
  }
  function isOpen(id, fallback) {
    if (ui.openSecs && Object.prototype.hasOwnProperty.call(ui.openSecs, id)) {
      return !!ui.openSecs[id];
    }
    return !!fallback;
  }
  function htmlQuiet() {
    var open = isOpen("note", false);
    return (
      '<details class="cp-quiet"' + (open ? " open" : "") + ' data-cp-sec="note">' +
        "<summary>" +
          '<span class="cp-quiet-tag">Keep this here</span>' +
          '<span class="cp-quiet-line">Notes for us, not for the feed. Please don’t post it or send it to a prospect.</span>' +
        "</summary>" +
        "<p>From the US guidelines, RCG 1.0 (10/2026), marked preview. Tags show what came from the PDF.</p>" +
      "</details>"
    );
  }

  function htmlPlay() {
    var open = isOpen("play", false);
    var html =
      '<details class="cpp-fold"' + (open ? " open" : "") + ' data-cp-sec="play">' +
        '<summary class="cpp-cta">' +
          '<span class="cpp-cta-eyebrow">The plan, live</span>' +
          '<span class="cpp-cta-title">Play with the numbers</span>' +
          '<span class="cpp-cta-sub">Drag the sliders, or pick a target to fill in the volume it takes. Generation mix sits under each team — gen 2 pays the most, so we don’t dump everything there. Then it works out the target you’d hit, subtracts what the plan subtracts, applies the ceiling, and shows the check — at $1.60 a commission point.</span>' +
          '<span class="cpp-cta-go" aria-hidden="true"></span>' +
        "</summary>" +
        '<div class="cpp">' +
          '<div class="cpp-presets">';
    for (var key in PLAY_PRESETS) {
      if (!Object.prototype.hasOwnProperty.call(PLAY_PRESETS, key)) continue;
      html += '<button type="button" class="cpp-preset' + (ui.playPreset === key ? " on" : "") +
        '" data-cp="preset" data-cp-v="' + key + '">' + esc(PLAY_PRESETS[key].label) + "</button>";
    }
    html += "</div>" +
          '<div id="cppMeters">' + htmlPlayMeters() + "</div>" +
          '<div id="cppRows">' + htmlPlayRows() + "</div>" +
          '<div id="cppWall">' + htmlPlayWall(playModel()) + "</div>" +
          '<div id="cppBonusHost">' + htmlPlayBonus(playModel()) + "</div>" +
          '<div id="cppWork">' + htmlPlayWork() + "</div>" +
        "</div>" +
      "</details>";
    return html;
  }

  function htmlPlayMeters() {
    var m = playModel();
    var jumped = !!(ui.playJumped && ui.playJumped === m.tl);
    var qualN = m.tl ? "Target " + m.tl : "Not active";
    var qualSub;
    if (!m.tl) {
      qualSub = "Target 1 is 110 points of your own direct turnover. Nothing pays until you’re there.";
    } else if (jumped) {
      qualSub = "This month is filled to Target " + m.tl + " — the volume it takes. Pay is for this month. Drag a slider to go live.";
    } else if (!m.next) {
      qualSub = "Top of the ladder, from the sliders as they sit. After Target 10 is its own chapter.";
    } else {
      qualSub = "From the sliders as they sit. Pick a target to fill in the volume it takes.";
    }

    /* The headline beside the target is the whole month, not one team. A single
       team's subtotal only ever mattered because the ceiling sits on it, and the
       ceiling now reads out down in the strip note where it has room to explain. */
    var g = growthModel(m);
    var s = startModel(m);
    var extras = (g.on ? g.dollars : 0) + (s.on ? s.amount : 0);
    var grand = round2(m.dollars + extras);
    var payK = "What the month pays";
    var payN = money(m.tl ? grand : 0);
    var paySub;
    if (!m.tl) {
      paySub = "Nothing pays below Target 1.";
    } else if (grand > 0 && grand < VOUCHER_THRESHOLD) {
      paySub = "Under " + usd(VOUCHER_THRESHOLD, 0) + ", so it arrives as a product voucher, not a transfer.";
    } else if (extras) {
      paySub = "Commission and bonuses together, at $1.60 a commission point — the breakdown’s just below.";
    } else if (m.capWall) {
      paySub = "Your DT and all four teams, after the ceiling clipped " + m.strongTeam.label + ". $1.60 a commission point.";
    } else {
      paySub = "Your own DT and all four teams, at $1.60 a commission point.";
    }

    var opts = m.tl ? "" : '<option value="0" selected>Not active</option>';
    for (var t = 1; t <= 10; t++) {
      opts += '<option value="' + t + '"' + (m.tl === t ? " selected" : "") + ">Target " + t + "</option>";
    }
    var jumpNote = jumped ? htmlPlayWays(m.tl) : "";

    var html =
      '<div class="cpp-meters">' +
        '<div class="cpp-meter">' +
          '<span class="cpp-meter-k">Where you’d qualify</span>' +
          '<span class="cpp-jump">' +
            '<select class="cpp-jump-sel" data-cp-play-tl aria-label="' + esc(qualN) +
              ". Pick a target to fill in the volume it takes. Pay is then for that month." + '">' + opts + "</select>" +
            '<span class="cpp-jump-arrow" aria-hidden="true"></span>' +
          "</span>" +
          '<span class="cpp-meter-s">' + esc(qualSub) + "</span>" +
        "</div>" +
        '<div class="cpp-meter is-ink">' +
          '<span class="cpp-meter-k">' + esc(payK) + "</span>" +
          '<span class="cpp-meter-n' + (payN.length > 8 ? " is-long" : "") + '">' + payN + "</span>" +
          '<span class="cpp-meter-s">' + esc(paySub) + "</span>" +
        "</div>" +
      "</div>" +
      jumpNote +
      htmlPlayTotal(m);
    return html;
  }

  function htmlPlayTotal(m) {
    var g = growthModel(m);
    var s = startModel(m);
    var extras = (g.on ? g.dollars : 0) + (s.on ? s.amount : 0);
    var grand = round2(m.dollars + extras);

    /* Only point at the bonuses while they're still shut. Once they're open the
       panel says why Growth Bonus isn't paying, and repeating it here reads as
       though the app hasn't noticed you already did the thing it's asking for. */
    var nudge = !g.on && !ui.playBonus && m.tl && m.tl >= 6
      ? '<span class="cpp-total-note">Growth Bonus is a separate line from Target 6 up — open the bonuses to put it in.</span>'
      : "";
    /* With no bonuses running there's nothing to break down — the meter above is
       already the whole answer, and repeating it here just says it twice. */
    if (!extras) return nudge ? '<p class="cpp-total">' + nudge + "</p>" : "";

    var html = '<p class="cpp-total">Commission, your DT and all four teams — <strong>' + money(m.dollars) + "</strong>";
    if (g.on) html += '<span class="cpp-total-line">Growth Bonus — <strong>' + money(g.dollars) + "</strong></span>";
    if (s.on) html += '<span class="cpp-total-line">Start Bonus' + (s.projected ? ", projected" : "") + " — <strong>" + money(s.amount) + "</strong></span>";
    return html + nudge + "</p>";
  }

  function htmlPlayWall(m) {
    if (!m.tl) return "";
    var jumped = !!(ui.playJumped && ui.playJumped === m.tl);
    if (!m.capWall && !m.qualWall) {
      /* This is where the ceiling lives now, so say where you stand against it
         rather than only speaking up once it's already clipped something. */
      var head;
      if (m.cap == null) {
        head = "Target " + m.tl + " is leader status — no strongest-team ceiling. Nothing’s capped. ";
      } else if (m.strongTeam) {
        head = m.strongTeam.label + " is your biggest, at " + num(m.strongTeam.earned) + " commission points of the " +
          num(m.cap) + " ceiling. Nothing’s stuck and nothing’s capped. ";
      } else {
        head = "Nothing’s stuck and nothing’s capped. ";
      }
      return '<p class="cpp-nudge">' + esc(head) + "Try <em>One giant team</em>, or drag one team way up.</p>";
    }
    var kicker = m.capWall && m.qualWall
      ? (m.next ? "Ceiling on this month · Target " + m.next + " is next" : "Two walls, one team")
      : m.capWall ? "That’s the ceiling"
      : (m.next ? "Target " + m.next + " is next" : "That’s the strip");
    var html = '<div class="cpp-wall"><span class="cpp-wall-k">' + esc(kicker) + "</span>";
    if (m.qualWall) {
      var tail = num(m.tt) + " in the org, " + num(m.block.have) + " on the number that decides " +
        (m.next ? "Target " + m.next : "your target") + ".";
      html += "<p>" + esc(m.dominant
        ? m.strongTeam.label + " is " + Math.round(m.share * 100) + "% of everything you’ve got, and it’s the first thing subtracted. " + tail
        : "No one team is carrying this — your biggest is " + Math.round(m.share * 100) + "%. But " + stripName(m.block.strip) +
          " still leaves " + leftoverPhrase(m) + ": " + tail) + "</p>";
    }
    if (m.capWall) {
      html += "<p>" + esc(m.strongTeam.label + "’s " + num(m.strongTeam.vol) + " didn’t shrink — all of it still sits in TT. What stopped is the commission points on that one team: " +
        num(m.strongTeam.earned) + " earned, " + num(m.cap) + " paid at Target " + m.tl + ". Your own DT and the other teams aren’t under it.") + "</p>";
    }
    return html + "</div>";
  }

  function htmlPlayRows() {
    var m = playModel();
    var stripN = playStripN(m);
    var outLetters = m.removed[stripN] || [];
    var rates = m.tl ? GEN_TABLE[m.tl] : [];
    var html = '<div class="cpp-dials">' +
      '<div class="cpp-dial is-own' + (m.tl >= 4 ? " is-ct" : "") + '">' +
        '<span class="cpp-dial-top"><span class="cpp-dial-l">Your own DT' +
          '<span class="cpp-dial-chip cpp-chip-ct">counted as customers</span></span>' +
        '<span class="cpp-dial-v" data-cpp-val="own">' + num(m.own) + "</span></span>" +
        '<input class="cpp-range" type="range" min="0" max="' + PLAY_OWN_MAX + '" step="' + PLAY_OWN_STEP + '" value="' + m.own + '" data-cp-play-own aria-label="Your own direct turnover">' +
      "</div>";
    for (var i = 0; i < m.teams.length; i++) {
      var team = m.teams[i];
      var isOut = outLetters.indexOf(team.letter) > -1;
      html +=
        '<div class="cpp-dial' + (isOut ? " is-out" : "") + (team.capped ? " is-capped" : "") + '">' +
          '<span class="cpp-dial-top"><span class="cpp-dial-l">' + esc(team.label) +
            '<span class="cpp-dial-chip cpp-chip-out">not counted to qualify</span>' +
            '<span class="cpp-dial-chip cpp-chip-cap">capped</span></span>' +
          '<span class="cpp-dial-v" data-cpp-val="' + i + '">' + num(team.vol) + "</span></span>" +
          '<input class="cpp-range" type="range" min="0" max="' + PLAY_TEAM_MAX + '" step="' + PLAY_TEAM_STEP + '" value="' + team.vol + '" data-cp-play-team="' + i + '" aria-label="' + esc(team.label) + ' volume">' +
          htmlTeamGens(team, rates) +
        "</div>";
    }
    html += "</div>" + '<p class="cpp-dial-foot">' + esc(playFootText(m, stripN, outLetters)) + "</p>";
    html += '<p class="cpp-dial-hint">People you enrolled are gen 1. They enroll gen 2 — that’s the best-paid row from Target 3. Gen 3 pays less. Edit a team to match the actual leg.</p>';
    html += htmlPlayDepth(m);
    return html;
  }

  function genRateLabel(g, rates) {
    var rate = rates && g < rates.length ? rates[g] : null;
    return "Gen " + (g + 1) + (rate == null ? "" : " · " + pct(rate));
  }

  function htmlTeamGens(team, rates) {
    var html = '<div class="cpp-gens">';
    for (var g = 0; g < 3; g++) {
      var rate = rates && g < rates.length ? rates[g] : null;
      html += '<label class="cpp-gen' + (rate == null ? " is-unpaid" : "") + '">' +
        '<span class="cpp-gen-k" data-cpp-rate="' + g + '">' + esc(genRateLabel(g, rates)) + "</span>" +
        '<input class="cpp-gen-in" type="number" min="0" inputmode="numeric" value="' + (team.gens[g] || 0) +
        '" data-cp-play-gen="' + team.i + "," + g + '" data-cp-focus="gen' + team.i + "-" + g +
        '" aria-label="Team ' + team.letter + ", generation " + (g + 1) + '"></label>';
    }
    return html + "</div>";
  }

  /* How many generation rows to show in the deeper table: everything this
     target pays past gen 3, plus anything you've typed below that. */
  function playDepthRows(m) {
    var rows = Math.max(4, m.paidGens);
    for (var i = 0; i < m.teams.length; i++) {
      for (var g = 0; g < m.teams[i].gens.length; g++) {
        if ((m.teams[i].gens[g] || 0) > 0 && g + 1 > rows) rows = g + 1;
      }
    }
    return Math.min(rows, PLAY_GEN_MAX);
  }

  function htmlPlayDepth(m) {
    var open = ui.playDepth;
    var html = '<button type="button" class="cpp-work-btn' + (open ? " on" : "") + '" data-cp="playdepth">' +
      '<span class="cpp-plus">' + (open ? "−" : "+") + "</span>" +
      (open ? "Hide generations 4–9" : "Deeper generations (4–9)") + "</button>";
    if (!open) return html;
    return html + '<div class="cpp-work" id="cppDepth">' + htmlPlayDepthBody(m) + "</div>";
  }

  /* Split out so a moving target can repaint the rates and the note without
     rebuilding the fields underneath whoever is typing in them. */
  function htmlPlayDepthBody(m) {
    var rates = m.tl ? GEN_TABLE[m.tl] : [];
    var rows = playDepthRows(m);
    var html = "";
    var g, i;
    html += '<p class="cpp-work-p">Gens 1–3 are under each team. This is the rest — still in TT, paid only if this target reaches that far.</p>';
    html += '<div class="cpp-depth-scroll"><table class="cpp-depth"><thead><tr><th>Gen</th>';
    for (i = 0; i < m.teams.length; i++) html += "<th>" + esc(m.teams[i].letter) + "</th>";
    html += "<th>Rate</th></tr></thead><tbody>";
    for (g = 3; g < rows; g++) {
      var rate = g < rates.length ? rates[g] : null;
      html += '<tr' + (rate == null ? ' class="is-unpaid"' : "") + "><th>" + (g + 1) + "</th>";
      for (i = 0; i < m.teams.length; i++) {
        html += '<td><input class="cpp-depth-in" type="number" min="0" inputmode="numeric" value="' +
          (m.teams[i].gens[g] || 0) +           '" data-cp-play-gen="' + i + "," + g + '" data-cp-focus="gen' + i + "-" + g +
          '" aria-label="Team ' + m.teams[i].letter + ", generation " + (g + 1) + '"></td>';
      }
      html += "<td>" + (rate == null ? "—" : pct(rate)) + "</td></tr>";
    }
    html += "</tbody></table></div>";
    html += '<p class="cpp-work-p">' + esc(depthNote(m)) + "</p>";
    return html;
  }

  /* Repaint a panel the user might be typing in. Without putting the caret back
     the field resets to the end on every keystroke, which makes it unusable. */
  function repaintKeepFocus(id, html) {
    var host = document.getElementById(id);
    if (!host) return;
    var active = document.activeElement;
    var key = active && active.getAttribute && host.contains(active) ? active.getAttribute("data-cp-focus") : null;
    var caret = null;
    if (key) { try { caret = active.selectionStart; } catch (e) {} }
    host.innerHTML = html;
    if (!key) return;
    var back = host.querySelector('[data-cp-focus="' + key + '"]');
    if (!back) return;
    back.focus();
    if (caret != null) { try { back.setSelectionRange(caret, caret); } catch (e) {} }
  }

  function syncPlayDepth(m) {
    if (ui.playDepth) repaintKeepFocus("cppDepth", htmlPlayDepthBody(m));
    if (ui.playBonus) repaintKeepFocus("cppBonus", htmlPlayBonusBody(m));
  }

  function htmlPlayBonus(m) {
    var open = ui.playBonus;
    var html = '<button type="button" class="cpp-work-btn' + (open ? " on" : "") + '" data-cp="playbonus">' +
      '<span class="cpp-plus">' + (open ? "−" : "+") + "</span>" +
      (open ? "Hide the bonuses" : "Add the bonuses") + "</button>";
    if (!open) return html;
    return html + '<div class="cpp-work" id="cppBonus">' + htmlPlayBonusBody(m) + "</div>";
  }

  function htmlPlayBonusBody(m) {
    return htmlStartBonus(m) + htmlGrowthBonus(m);
  }

  var BONUS_HELP = {
    start: [
      "First-time partners only, on the Business Booster starter set, for the first four statement months. Returning partners can’t qualify at all. A Founder Pack isn’t required for the track — buying one in October doubles Start Bonus for the whole four months.",
      "<strong>Two bars every month.</strong> Your Target Level, and how many personal, direct, active partners you have. Miss either one and the program ends — you don’t pick it back up the following month.",
      "<strong>What you’re paid isn’t the month’s bar.</strong> It’s a lookup on what you actually reached, so overshooting pays the higher row. Two Targets in one month doesn’t mean two bonuses — you get the highest. Hit that same Target again later and it pays again. Ringana’s own example hits Target 3 in month 2 when month 2 only asked for Target 2, and gets $220 instead of $110.",
      "<strong>Active means Target 1</strong> — 110 points of their own direct turnover that month.",
      "<strong>The timing catches people.</strong> A first-timer is billed after their first fully completed statement month, so they count the month <em>after</em> you enroll them. Need someone to count in month 3? Enroll them in month 2. Returning partners are billed the month they rejoin.",
      "<strong>USA launch.</strong> October is pre-sales — volume moves into November. The first commission period is November and December together, and Start Bonus on that period is doubled. Everyone in that first period is a New Partner.",
      "Months 5–8 aren’t Start Bonus. They’re a private high-performer agreement if you hit Target 5 or above — separate contract, max eight months total. Dollar figures for those months are our projection from the pattern."
    ],
    growth: [
      "From Target 6 up, a separate top-up on your commission. It sits outside the strongest-team ceiling, so the cap can’t touch it.",
      "<strong>The rate is your Target Level’s</strong> — 2% at Target 6, 3% at 7, 4% at 8, 4.5% at 9, 5% at 10.",
      "<strong>It’s gated on new-partner volume.</strong> Targets 6–7 read NPV-2 (3Gen), Targets 8–10 read NPV-3 (3Gen), and either way it needs 3,500. Miss NPV-3 at Target 8 or higher but clear NPV-2 and it still pays, calculated at the Target 7 rate of 3%.",
      "<strong>It’s a difference, not a flat percentage.</strong> Anyone under you already at Target 6 or higher earns their own on their turnover, so their team volume leaves your base and you take the gap between your rate and theirs. Someone who didn’t qualify for their own still comes out of your base at their Target Level rate. If they hit Target 8–10 but were paid Growth Bonus at the Target 7 rate (missed NPV-3), you still use their actual Target Level for the difference — not 3%.",
      "The dials above don’t model new-partner volume, which is why that figure and each Target 6+ partner have to be typed in rather than worked out for you."
    ]
  };

  function bonusHelpBtn(key) {
    var on = ui.playHelp === key;
    return '<button type="button" class="cpp-q' + (on ? " on" : "") + '" data-cp="bonushelp" data-cp-v="' + key +
      '" aria-expanded="' + (on ? "true" : "false") + '" aria-label="' + (on ? "Hide" : "Show") + " what the " +
      (key === "start" ? "Start" : "Growth") + ' Bonus is">' + (on ? "×" : "?") + "</button>";
  }

  function htmlBonusHelp(key) {
    if (ui.playHelp !== key) return "";
    var rows = BONUS_HELP[key] || [];
    var html = '<div class="cpp-help">';
    for (var i = 0; i < rows.length; i++) html += "<p>" + rows[i] + "</p>";
    return html + "</div>";
  }

  function htmlStartBonus(m) {
    var s = startModel(m);
    var i, r;
    var opts = '<option value="0"' + (ui.startMonth ? "" : " selected") + ">Not in the program</option>";
    for (i = 0; i < START_MONTHS.length; i++) {
      r = START_MONTHS[i];
      opts += '<option value="' + r.m + '"' + (ui.startMonth === r.m ? " selected" : "") + ">Month " + r.m +
        (r.tag === "extension" ? " · projected" : "") + "</option>";
    }
    var html = '<p class="cpp-work-k">Start Bonus' + bonusHelpBtn("start") + "</p>" +
      htmlBonusHelp("start") +
      '<div class="cpp-bfields">' +
        '<label class="cpp-bf"><span>Statement month</span>' +
          '<select class="cpp-bin" data-cp-start-month data-cp-focus="startmonth">' + opts + "</select></label>" +
        '<label class="cpp-bf"><span>Direct active partners</span>' +
          '<input class="cpp-bin" type="number" min="0" inputmode="numeric" value="' + (ui.startPartners || 0) +
          '" data-cp-start-partners data-cp-focus="startpartners"></label>' +
      "</div>";

    if (!s.month) {
      return html + '<p class="cpp-work-p">First-time partners on the Business Booster set, first four statement months. Pick the month you’re in and it checks both bars against the target above.</p>';
    }

    html += workLine("Target Level, needs " + s.row.tl, s.tl ? "Target " + s.tl : "nothing yet", false, !s.passTL);
    html += workLine("Direct active partners, needs " + s.row.partners, num(s.partners), false, !s.passPartners);

    if (!s.eligible) {
      var missed = !s.passTL && !s.passPartners ? "Both bars are short"
        : !s.passTL ? "The Target Level bar is short"
        : "The partner bar is short";
      return html + '<p class="cpp-work-p">' + esc(missed + " for month " + s.month +
        ", so nothing pays and the program ends here — you don’t pick it back up next month.") + "</p>";
    }
    if (!s.amount) {
      return html + '<p class="cpp-work-p">Both bars clear, so you stay in. Month 1 has no cash row — it’s the on-ramp.</p>';
    }
    html += workLine("Start Bonus" + (s.projected ? ", projected" : ""), money(s.amount), true);
    var over = s.paidRow.tl > s.row.tl || s.paidRow.partners > s.row.partners;
    html += '<p class="cpp-work-p">' + esc("Paid on what you actually reached — Target " + s.paidRow.tl + " with " +
      s.paidRow.partners + " active partner" + (s.paidRow.partners === 1 ? "" : "s") + ", not on the month you’re in." +
      (over ? " You overshot month " + s.month + "’s bars, so it pays the higher row." : "")) +
      (s.projected ? " Months 5–8 are the high-performer agreement — this figure is our projection from the pattern." : "") + "</p>";
    return html;
  }

  function htmlGrowthBonus(m) {
    var html = '<p class="cpp-work-k">Growth Bonus' + bonusHelpBtn("growth") + "</p>" + htmlBonusHelp("growth");
    if (!m.tl || m.tl < 6) {
      return html + '<p class="cpp-work-p">' + esc("Growth Bonus starts at Target 6. " +
        (m.tl ? "You’re at Target " + m.tl + "." : "Nothing qualifies yet.")) + "</p>";
    }
    var g = growthModel(m);
    var strip = GROWTH_STRIP[m.tl];
    var i;

    html += '<div class="cpp-bfields">' +
      '<label class="cpp-bf"><span>NPV-' + strip + " (3Gen)</span>" +
        '<input class="cpp-bin" type="number" min="0" inputmode="numeric" value="' + (strip === 3 ? ui.npv3 : ui.npv2) +
        '" data-cp-npv="' + strip + '" data-cp-focus="npv' + strip + '"></label>';
    if (strip === 3) {
      html += '<label class="cpp-bf"><span>NPV-2 (3Gen), fallback</span>' +
        '<input class="cpp-bin" type="number" min="0" inputmode="numeric" value="' + ui.npv2 +
        '" data-cp-npv="2" data-cp-focus="npv2"></label>';
    }
    html += "</div>";
    html += '<p class="cpp-work-p">New-partner volume isn’t something the dials above can work out, so this one you type in. It needs ' +
      num(GROWTH_NPV_MIN) + (strip === 3 ? ", and missing NPV-3 while clearing NPV-2 pays at the Target 7 rate instead." : ".") + "</p>";

    html += '<p class="cpp-work-sub">Anyone under you already at Target 6 or higher</p>';
    for (i = 0; i < GROWTH_SLOTS; i++) {
      var p = ui.gbPartners[i] || { tl: 6, tt: 0 };
      var sel = "";
      for (var t = 6; t <= 10; t++) sel += '<option value="' + t + '"' + (p.tl === t ? " selected" : "") + ">Target " + t + "</option>";
      html += '<div class="cpp-brow">' +
        '<select class="cpp-bin" data-cp-gb-tl="' + i + '" data-cp-focus="gbtl' + i + '" aria-label="Partner ' + (i + 1) + ' target level">' + sel + "</select>" +
        '<input class="cpp-bin" type="number" min="0" inputmode="numeric" value="' + (p.tt || 0) +
          '" data-cp-gb-tt="' + i + '" data-cp-focus="gbtt' + i + '" aria-label="Partner ' + (i + 1) + ' team turnover">' +
      "</div>";
    }

    if (!g.on) {
      return html + '<p class="cpp-work-p">' + esc("NPV-" + strip + " (3Gen) is under " + num(GROWTH_NPV_MIN) +
        ", so there’s no Growth Bonus this month. Everything else still pays.") + "</p>";
    }

    html += workLine(num(g.base) + " × " + pct(g.rate) + " — TT not under a Target 6+ partner", num(g.basePoints) + " pts");
    for (i = 0; i < g.lines.length; i++) {
      var l = g.lines[i];
      html += workLine(num(l.tt) + " × " + pct(l.diff) + " — Target " + l.tl + " partner (" +
        pct(g.rate) + " − " + pct(GROWTH_RATE[l.tl]) + ")", num(l.points) + " pts");
    }
    html += workLine("Growth Bonus", num(g.points) + " pts · " + money(g.dollars), true);
    if (g.source === "fallback") {
      html += '<p class="cpp-work-p">NPV-3 (3Gen) is short but NPV-2 (3Gen) clears, so this is calculated at the Target 7 rate of 3%.</p>';
    }
    if (g.lines.length) {
      html += '<p class="cpp-work-p">Their turnover leaves your base because they earn their own Growth Bonus on it. You take the gap between your rate and theirs. A partner who didn’t qualify for their own still comes out of your base at their Target Level rate.</p>';
    }
    return html;
  }

  function depthNote(m) {
    if (!m.tl) return "Nothing pays until Target 1, so no generation earns yet.";
    var rates = GEN_TABLE[m.tl] || [];
    /* Generation 2 overtakes generation 1 at Target 3 and stays ahead, but it
       isn't the best row at Targets 1 and 2 — so read it off the table. */
    var best = 0;
    for (var i = 1; i < rates.length; i++) if (rates[i] > rates[best]) best = i;
    var line = "Target " + m.tl + " pays through generation " + m.paidGens + ".";
    if (m.deepVol > 0) {
      line += " " + num(m.deepVol) + " sits below that — still in TT, still counts for qualifying, earns nothing.";
    }
    return line + " Generation " + (best + 1) + " is the best-paid row here at " + pct(rates[best]) +
      ", so the same volume is worth more or less depending on where it sits.";
  }

  function playFootText(m, stripN, outLetters) {
    if (!m.tl && !m.block) return "Nothing qualifies yet — your own DT is under 110.";
    var tl = playFocusTL(m);
    var need = NEED[tl];
    /* Say out loud whether this is the target you're on or the one you're
       reaching for. After a jump the month is built to the target you picked,
       so the chips and this line stay on that target — not the next one. */
    if (need && need.team == null) {
      return (tl === m.tl || !m.block ? "Target " + tl + " " : "Target " + tl + " is next up. It ") +
        "only reads your own DT — " + num(need.direct) + " is active.";
    }
    var lead = (tl !== m.tl && m.block) ? "Target " + tl + " is next up, and it reads " : "Target " + tl + " reads ";
    if (!outLetters.length) return lead + stripName(stripN) + " — nothing gets subtracted." + nextStripHint(m, stripN);
    var many = outLetters.length > 1;
    return lead + stripName(stripN) + ", so " +
      (many ? "Teams " : "Team ") + joinList(outLetters) + (many ? " step" : " steps") +
      " aside before anyone looks. They still get paid." + nextStripHint(m, stripN);
  }

  function nextStripHint(m, stripN) {
    if (!m.tl || !m.next || !NEED[m.next]) return "";
    var nextN = NEED[m.next].strip || 0;
    if (nextN <= stripN) return "";
    var words = ["", "one team", "two teams", "three teams"];
    return " Target " + m.next + " would set " + (words[nextN] || (nextN + " teams")) + " aside.";
  }

  /* Chips and the foot line describe the target on the dropdown — where you’d
     qualify now. The wall can still talk about the next one. Previewing the
     next strip here made Target 4 look like it set two teams aside. */
  function playFocusTL(m) {
    if (ui.playJumped && m.tl === ui.playJumped) return m.tl;
    if (m.tl) return m.tl;
    return m.next || 0;
  }
  function playStripN(m) {
    var tl = playFocusTL(m);
    return tl && NEED[tl].strip ? NEED[tl].strip : 0;
  }

  function repaintPlay(withRows) {
    paintPlayOut();
    if (withRows) {
      var rows = document.getElementById("cppRows");
      if (rows) rows.innerHTML = htmlPlayRows();
    }
    syncPresetButtons();
  }

  function paintPlayOut() {
    var meters = document.getElementById("cppMeters");
    var wall = document.getElementById("cppWall");
    var work = document.getElementById("cppWork");
    if (meters) meters.innerHTML = htmlPlayMeters();
    if (wall) wall.innerHTML = htmlPlayWall(playModel());
    if (work) work.innerHTML = htmlPlayWork();
    /* The Growth Bonus rate is read off the target, so a preset or a jump that
       moves the target has to move this panel with it. */
    if (ui.playBonus) repaintKeepFocus("cppBonus", htmlPlayBonusBody(playModel()));
  }

  function syncPresetButtons() {
    var btns = document.querySelectorAll(".cpp-preset");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("on", btns[i].getAttribute("data-cp-v") === ui.playPreset);
    }
  }

  /* Live update while a slider is being dragged: never rebuild the row markup,
     or the drag drops out from under your thumb. */
  function syncPlayLive(withSliders) {
    var m = playModel();
    var stripN = playStripN(m);
    var outLetters = m.removed[stripN] || [];
    var rates = m.tl ? GEN_TABLE[m.tl] : [];
    var active = document.activeElement;
    var ownVal = document.querySelector('[data-cpp-val="own"]');
    if (ownVal) ownVal.textContent = num(m.own);
    var ownDial = document.querySelector("#cppRows .cpp-dial.is-own");
    if (ownDial) ownDial.classList.toggle("is-ct", m.tl >= 4);
    var ownRange = document.querySelector("[data-cp-play-own]");
    if (withSliders && ownRange && active !== ownRange) ownRange.value = m.own;
    var dials = document.querySelectorAll("#cppRows .cpp-dial");
    var g, rateLabel;
    for (g = 0; g < 3; g++) {
      rateLabel = genRateLabel(g, rates);
      var rateEls = document.querySelectorAll('[data-cpp-rate="' + g + '"]');
      for (var r = 0; r < rateEls.length; r++) {
        rateEls[r].textContent = rateLabel;
        var wrap = rateEls[r].closest(".cpp-gen");
        if (wrap) wrap.classList.toggle("is-unpaid", !(rates && g < rates.length));
      }
    }
    for (var i = 0; i < m.teams.length; i++) {
      var label = document.querySelector('[data-cpp-val="' + i + '"]');
      if (label) label.textContent = num(m.teams[i].vol);
      /* Typing a generation moves the team total, so the slider has to follow —
         but never the other way, or the field you're typing in gets rewritten. */
      var range = document.querySelector('[data-cp-play-team="' + i + '"]');
      if (withSliders && range && active !== range) range.value = m.teams[i].vol;
      for (g = 0; g < 3; g++) {
        var gin = document.querySelector('[data-cp-play-gen="' + i + "," + g + '"]');
        if (gin && active !== gin) gin.value = m.teams[i].gens[g] || 0;
      }
      var dial = dials[i + 1];
      if (dial) {
        dial.classList.toggle("is-out", outLetters.indexOf(m.teams[i].letter) > -1);
        dial.classList.toggle("is-capped", !!m.teams[i].capped);
      }
    }
    var foot = document.querySelector(".cpp-dial-foot");
    if (foot) foot.textContent = playFootText(m, stripN, outLetters);
    syncPlayDepth(m);
    paintPlayOut();
    syncPresetButtons();
  }

  function htmlPlayWork() {
    var m = playModel();
    var open = ui.playWork;
    var html = '<button type="button" class="cpp-work-btn' + (open ? " on" : "") + '" data-cp="playwork">' +
      '<span class="cpp-plus">' + (open ? "−" : "+") + "</span>" + (open ? "Hide the working" : "Show the working") + "</button>";
    if (!open) return html;

    var i, team, line;
    html += '<div class="cpp-work">';

    html += '<p class="cpp-work-k">Team turnover</p>';
    html += workLine("Your own DT", num(m.own));
    for (i = 0; i < m.teams.length; i++) html += workLine(m.teams[i].label, num(m.teams[i].vol));
    html += workLine("TT", num(m.tt), true);

    html += '<p class="cpp-work-k">The strip</p>';
    var focusStrip = playStripN(m);
    for (i = 0; i <= 3; i++) {
      var who = m.removed[i].length ? " · " + joinList(m.removed[i]) + " out" : "";
      html += workLine(stripName(i) + who, num(m.strip[i]), m.tl && focusStrip === i);
    }

    html += '<p class="cpp-work-k">' + (m.tl ? "Why Target " + m.tl : "Why nothing yet") + "</p>";
    if (ui.playJumped && ui.playJumped === m.tl) {
      html += '<p class="cpp-work-p">This month was filled to Target ' + m.tl +
        " — the smallest even four-team shape that qualifies. Pay below is for this month.</p>";
    }
    if (m.tl) {
      var need = NEED[m.tl];
      html += '<p class="cpp-work-p">Target ' + m.tl + " wants " + need.basis + " " + num(need.direct) +
        (need.basis === "CT" ? " (your own DT is counted as customer sales here — that’s the habit)" : "") +
        (need.team != null ? " and " + stripName(need.strip) + " " + num(need.team) : "") + ". You have " +
        need.basis + " " + num(need.basis === "CT" ? m.ownCT : m.own) +
        (need.team != null ? " and " + stripName(need.strip) + " " + num(m.strip[need.strip]) : "") + ".</p>";
    }
    if (m.block) html += '<p class="cpp-work-p">' + esc(m.block.line) + "</p>";

    if (m.tl) {
      html += '<p class="cpp-work-k">What gets paid at Target ' + m.tl + "</p>";
      html += workLine("Your DT · " + num(m.own) + " × " + pct(DT_RATE[m.tl]), num(m.ownPts) + " pts");
      var rates = GEN_TABLE[m.tl] || [];
      for (i = 0; i < m.teams.length; i++) {
        team = m.teams[i];
        if (!team.vol) continue;
        var bits = [];
        for (var g = 0; g < team.gens.length && g < rates.length; g++) {
          if (team.gens[g] > 0) bits.push(num(team.gens[g]) + " × " + pct(rates[g]));
        }
        line = team.label + (bits.length ? " · " + bits.join(" + ") : " · nothing in a paid generation");
        html += workLine(line, num(team.earned) + " pts");
        if (team.deep > 0) html += workLine("— " + num(team.deep) + " below generation " + rates.length, "0 pts", false, true);
        if (team.capped) html += workLine("— ceiling on " + team.label, num(team.paid) + " pts", false, true);
      }
      html += workLine("Total commission points", num(m.totalPts) + " pts", true);
      html += workLine("× " + POINTS_FACTOR, money(m.dollars), true);
    }

    html += '<p class="cpp-work-k">What we’re assuming</p>' +
      '<ul class="cpp-work-list">' +
        "<li>Picking a target fills the smallest even month that qualifies. It does not keep your old sliders and pretend you already hit that rank. Drag a slider and it goes live again.</li>" +
        "<li>A team is one first-generation partner plus everyone under them. The default mix is conservative: half gen 1 (people you enrolled), then gen 2, then gen 3. Gen 2 is the best-paid row from Target 3 up — parking everything there overstates the check. " + tag("plan") + "</li>" +
        "<li>Your own DT is treated as customer sales — that’s the habit to build. A little personal shopping is fine; from Target 4 it just doesn’t help you qualify. " + tag("estimate") + "</li>" +
        "<li>The ceiling is on your strongest team, after the generation percentages, from Target 1 through 7. Target 8 and up have no cap. Your own DT and the other teams aren’t under it. Volume in that team still sits in TT. " + tag("plan") + "</li>" +
        "<li>Growth Bonus isn’t in this number unless you add the bonuses. It’s a separate line from Target 6 up, outside the strongest-team ceiling. Start Bonus is cash on top, not commission points. " + tag("plan") + "</li>" +
      "</ul>";

    return html + "</div>";
  }

  function workLine(label, value, strong, dim) {
    return '<div class="cpp-line' + (strong ? " is-strong" : "") + (dim ? " is-dim" : "") + '">' +
      "<span>" + esc(label) + "</span><span>" + esc(value) + "</span></div>";
  }
  function htmlVocab() {
    var html = "";
    for (var i = 0; i < VOCAB.length; i++) {
      var v = VOCAB[i];
      var open = ui.openVocab === i;
      html +=
        '<button type="button" class="cp-acc' + (open ? " open" : "") + '" data-cp="vocab" data-cp-v="' + i + '">' +
          '<span class="cp-acc-row">' +
            '<span class="cp-letter">' + esc(v.short) + "</span>" +
            '<span class="cp-acc-main">' +
              '<span class="cp-acc-title">' + esc(v.name) + "</span>" +
              '<span class="cp-acc-plain">' + esc(v.plain) + "</span>" +
            "</span>" +
          "</span>" +
          (open && v.note ? '<p class="cp-acc-a" style="margin-left:58px">' + esc(v.note) + "</p>" : "") +
        "</button>";
    }
    return html;
  }

  function htmlGenChart() {
    var t, g, lv, rates, check;
    var html = '<div class="cp-scroll"><table class="cp-chart"><thead><tr><th class="cp-chart-stub">Target</th>';
    for (t = 1; t <= 10; t++) {
      html += '<th class="' + (ui.activeTL === t ? "on" : "") + '" data-cp="tl" data-cp-v="' + t + '">' +
        '<button type="button" class="cp-chart-tl" data-cp="tl" data-cp-v="' + t + '">T' + t + "</button></th>";
    }
    html += "</tr></thead><tbody>";
    html += '<tr><th class="cp-chart-row">DT</th>';
    for (t = 1; t <= 10; t++) html += cell(pct(DT_RATE[t]), ui.activeTL === t, false, t);
    html += "</tr>";
    for (g = 0; g < 9; g++) {
      html += '<tr><th class="cp-chart-row">Gen ' + (g + 1) + "</th>";
      for (t = 1; t <= 10; t++) {
        rates = GEN_TABLE[t];
        if (g < rates.length) html += cell(pct(rates[g]), ui.activeTL === t, false, t);
        else html += cell("—", ui.activeTL === t, true, t);
      }
      html += "</tr>";
    }
    html += '<tr><th class="cp-chart-row">Growth</th>';
    for (t = 1; t <= 10; t++) {
      lv = levelBy(t);
      html += cell(lv.growth || "—", ui.activeTL === t, !lv.growth, t);
    }
    html += "</tr>";
    html += '<tr><th class="cp-chart-row">Pay cap</th>';
    for (t = 1; t <= 10; t++) {
      lv = levelBy(t);
      html += cell(lv.cap == null ? "—" : num(lv.cap), ui.activeTL === t, lv.cap == null, t);
    }
    html += "</tr>";
    html += '<tr><th class="cp-chart-row">Team check</th>';
    for (t = 1; t <= 10; t++) {
      check = teamCheck(t);
      html += cell(check, ui.activeTL === t, check === "—", t);
    }
    html += "</tr></tbody></table></div>";
    html += '<p class="cp-chart-foot">Tap a column — the numbers, or the big targets above. Swipe sideways for 8–10. Empty generation cells are empty in the plan. Pay cap runs Target 1 through 7. Target 8 and up have none.</p>';
    return html;
  }

  function htmlLadder() {
    var level = levelBy(ui.activeTL);
    var gens = (GEN_TABLE[level.tl] || []).length;
    var html = htmlTlPicks(ui.activeTL, "tl") + htmlGenChart();
    html +=
      '<div class="live-card">' +
        '<div class="cp-ladder-head">' +
          '<span class="prod-head-title" style="font-size:28px;margin:0">Target ' + level.tl + "</span>" +
          '<span class="live-tag" style="margin:0">' + (level.basis === "DT" ? "Direct basis" : "Customer basis") + "</span>" +
        "</div>" +
        '<p class="cp-dl-label">Qualifies with</p>' +
        '<p class="body-p" style="margin:0 0 12px">' + esc(level.req) +
          (level.alt ? '<span class="cp-alt"> or ' + esc(level.alt) + " on its own</span>" : "") +
        "</p>" +
        '<p class="cp-dl-label">Team check to qualify</p>' +
        '<p class="body-p" style="margin:0 0 12px">' + esc(teamCheckCopy(level.tl)) + "</p>" +
        '<p class="cp-dl-label">Paid through</p>' +
        '<p class="body-p" style="margin:0 0 12px">Generation ' + gens + "</p>";
    if (level.growth) {
      html += '<p class="cp-dl-label">Growth bonus</p>' +
        '<p class="body-p" style="margin:0 0 12px">' + esc(level.growth) + " of qualifying team turnover, requires " + esc(level.npv) +
        (level.tl >= 8 ? " If NPV-3 is missed but NPV-2 (3Gen) 3,500 is hit, Growth Bonus is calculated at the Target 7 rate (3%)." : "") +
        "</p>";
    }
    html +=
        '<p class="cp-dl-label">Strongest-team pay cap</p>' +
        '<p class="body-p" style="margin:0">' +
          (level.cap == null
            ? "None. Target 8 and up is leader status — the strongest-team ceiling doesn’t apply."
            : num(level.cap) + " commission points after generation %" +
              (level.tl === 7 ? " — that’s the last Target with a cap. From Target 8 it lifts." : "")) +
        "</p>" +
      "</div>";
    if (ui.activeTL === 4) {
      html +=
        '<div class="cp-ink">' +
          '<div class="live-tag" style="color:rgba(245,246,242,.7)">Target 4</div>' +
          "<p>This is a good turning point. Targets 1–3 count Direct Turnover, which includes what you buy. From Target 4, qualification wants Customer Turnover — 330 points of real customer sales — plus team volume with the strongest team already subtracted. No solo route from here, and that’s the point: you’ve got customers, not just a stocked shelf.</p>" +
          "<p>Commission on what you buy still uses DT.</p>" +
        "</div>";
    } else {
      html += '<p class="body-p">Watch second generation as you move across. It goes from 2% at Target 1 to 14% from Target 4 on. First generation only ever moves 8% to 9%. Helping your people enroll people is where this plan opens up.</p>';
    }
    return html;
  }

  function htmlStrip() {
    var sorted = LEGS.slice().sort(function (a, b) { return b.value - a.value; });
    var removed = {};
    var r;
    for (r = 0; r < ui.strip; r++) removed[sorted[r].label] = true;
    var stripTotal = OWN_DT;
    var fullTT = OWN_DT;
    var html = '<div class="cp-strip-tabs">';
    for (var n = 0; n < 4; n++) {
      html += '<button type="button" class="cp-strip-tab' + (ui.strip === n ? " on" : "") + '" data-cp="strip" data-cp-v="' + n + '">' +
        (n === 0 ? "TT" : "TT-" + n) + "</button>";
    }
    html += "</div>";
    html += '<div class="cp-leg on"><span>Your own DT</span><strong>' + OWN_DT.toLocaleString() + "</strong></div>";
    for (var i = 0; i < LEGS.length; i++) {
      var leg = LEGS[i];
      var out = !!removed[leg.label];
      fullTT += leg.value;
      if (!out) stripTotal += leg.value;
      html += '<div class="cp-leg' + (out ? "" : " on") + '"><span>' + esc(leg.label) +
        (leg.hint ? '<em>' + esc(leg.hint) + "</em>" : "") +
        (out ? ' <em>not counted</em>' : "") + "</span><strong" + (out ? ' class="is-out"' : "") + ">" +
        leg.value.toLocaleString() + "</strong></div>";
    }
    html +=
      '<div class="cp-ink">' +
        '<div class="live-tag" style="color:rgba(245,246,242,.7)">' + (ui.strip === 0 ? "Team turnover" : "Team turnover −" + ui.strip) + "</div>" +
        '<div class="cp-big">' + stripTotal.toLocaleString() + "</div>" +
        '<p class="cp-from">' + (ui.strip > 0 ? "down from " + fullTT.toLocaleString() : "&nbsp;") + "</p>" +
        "<p>" + esc(STRIP_COPY[ui.strip]) + "</p>" +
      "</div>" +
      '<p class="body-p">This only changes whether you qualify. That team is still in TT, and this is not the pay cap. Targets 3–4 use TT-1, 5–7 use TT-2, 8–10 use TT-3.</p>';
    return html;
  }

  function htmlPayCap() {
    var html =
      '<p class="body-p">Your strongest team can matter in two different ways in the same month. For qualification, its volume can come out of TT-1, TT-2, or TT-3. For pay, that volume still counts. What can be capped is the commission points Ringana will pay on that one team <em>after</em> the generation percentages.</p>' +
      '<p class="body-p">A team here is one first-generation partner plus everyone under them. Your own DT isn’t a team. The other teams aren’t under this ceiling. Customer Volume isn’t either.</p>' +
      '<div class="live-card"><p class="cp-dl-label">Targets 1–7 have a ceiling. Target 8 and up don’t.</p><div class="cp-chips">';
    var i;
    for (i = 0; i < LEVELS.length; i++) {
      html += '<span class="cp-chip' + (LEVELS[i].tl === 8 ? " on" : "") + '">T' + LEVELS[i].tl + " · " + capLabel(LEVELS[i]) + "</span>";
    }
    html += "</div>" +
      '<p class="body-p" style="margin:12px 0 0">7,000 is the Target 7 ceiling. From Target 8 — leader status — the cap is gone. It doesn’t carry.</p></div>' +
      '<div class="cp-ink">' +
        '<div class="live-tag" style="color:rgba(245,246,242,.7)">Target 6, worked</div>' +
        "<p>Four teams: A 50,000, B 10,000, C 8,000, D 5,000, plus your own DT. Team A does not shrink to 4,500 volume. All 50,000 still sit in TT.</p>" +
        "<p>Ringana first runs the generation percentages on the people inside Team A. Suppose that produces 6,000 commission points. The Target 6 ceiling is 4,500 commission points.</p>" +
        row("Without the cap — 6,000 × 1.6", usd(6000 * POINTS_FACTOR)) +
        row("Paid on Team A — 4,500 × 1.6", usd(4500 * POINTS_FACTOR), true) +
        "<p>B, C, and D still pay in full. 2,400 points from Team A would also pay in full at Target 6 — that’s under the ceiling. 1,500 is the Target 3 cap, not Target 6.</p>" +
      "</div>" +
      '<div class="live-card"><p class="body-p" style="margin:0 0 8px"><strong>Growth Bonus is a different line.</strong></p><p class="body-p" style="margin:0">The settlement is DT commission + TT commission + Growth Bonus + Beyond Target 10, then × ' + usd(POINTS_FACTOR) + ". This cap lives in the TT commission section. Growth Bonus is a separate top-up from Target 6. If you’re Target 8–10 and miss NPV-3 (3Gen) 3,500 but hit NPV-2 (3Gen) 3,500, Growth Bonus is calculated at the Target 7 rate (3%).</p></div>";
    return html;
  }

  function row(label, pts, bold) {
    return '<div class="cp-row' + (bold ? " bold" : "") + '"><span>' + esc(label) + '</span><span class="cp-pts">' + esc(pts) + "</span></div>";
  }

  function htmlShapes() {
    var floor = usd(110 * 0.19 * POINTS_FACTOR);
    return (
      '<div class="live-card">' +
        '<h3 class="cp-h3">Just getting going</h3>' +
        '<p class="body-p">Target 1, 110 points of direct turnover, no team. This is what “active” actually pays — a qualification, not a payday. At this size it arrives as a voucher. Math on the published rate, not a printed example.</p>' +
        row("110 × 19%", "20.9 pts") +
        row("× " + POINTS_FACTOR, floor, true) +
      "</div>" +
      '<div class="live-card">' +
        '<h3 class="cp-h3">Strong customers, no team yet</h3>' +
        '<p class="body-p">1,000 points of direct turnover. That’s Target 3 on the solo route (you need 825). Ringana’s own example. The jump from 19% to 39% by Target 3 is the biggest step-up on your own volume.</p>' +
        row("1,000 × 39%", "390 pts") +
        row("× " + POINTS_FACTOR, usd(624), true) +
      "</div>" +
      '<div class="live-card">' +
        '<h3 class="cp-h3">Same person, now with a team</h3>' +
        '<p class="body-p">Same 1,000 of your own. Two first-generation partners (A 700, B 900) and three in the second (C 1,000 under A; D 600 and E 300 under B). Straight from the guidelines. The second generation — people you didn’t enroll — paid more than the first.</p>' +
        row("Your DT — 1,000 × 39%", "390 pts") +
        row("Gen 1 — 700 × 8% + 900 × 8%", "128 pts") +
        row("Gen 2 — 1,000 × 9% + 600 × 9% + 300 × 9%", "171 pts") +
        row("Total", "689 pts", true) +
        row("× " + POINTS_FACTOR, usd(1102.4), true) +
      "</div>" +
      '<div class="live-card">' +
        '<h3 class="cp-h3">Growth Bonus, Target 8</h3>' +
        '<p class="body-p">Also Ringana’s example. You’re Target 8, TT 120,000, NPV-3 (3Gen) 3,800 — so Growth Bonus is 4%. Two people under you are already Target 6 or higher, so their TT comes out of the 4% base and you take the difference instead. Growth Bonus is its own line — not inside the strongest-team cap. The Target 6 partner didn’t even qualify for their own Growth Bonus; you still get the difference against their Target Level rate.</p>' +
        row("70,000 × 4% — remaining TT", "2,800 pts") +
        row("30,000 × 1% — Target 7 partner (4 − 3)", "300 pts") +
        row("20,000 × 2% — Target 6 partner (4 − 2)", "400 pts") +
        row("Total", "3,500 pts", true) +
        row("× " + POINTS_FACTOR, usd(5600), true) +
      "</div>"
    );
  }

  function htmlBeyond() {
    return (
      '<p class="body-p">Target 10 isn’t the end of the story. Three paths — Team Focus, Driving Growth, Master — each with its own TT-5 and NPV-5 (3Gen) bars. You’re paid for one path, even if you clear two.</p>' +
      '<div class="cp-scroll"><table class="cp-chart cp-chart-sm"><thead><tr>' +
        '<th class="cp-chart-stub"></th><th>Team Focus</th><th>Driving Growth</th><th>Master</th>' +
      "</tr></thead><tbody>" +
        '<tr><th class="cp-chart-row">TT-5 at least</th><td>100,000</td><td>25,000</td><td>200,000</td></tr>' +
        '<tr><th class="cp-chart-row">NPV-5 (3Gen) at least</th><td>10,000</td><td>25,000</td><td>50,000</td></tr>' +
      "</tbody></table></div>" +
      '<p class="cp-chart-foot">Driving Growth is the lower TT-5 bar with a higher new-partner bar. Team Focus is the other way around. Two bonus formulas are printed: 2% of TT-5 + 20% of NPV-5 (Driving Growth uses this in the example), and 4% of TT-5 + 40% of NPV-5 under Master. They don’t print a third formula for Team Focus. ' + tag("plan") + "</p>" +
      '<div class="live-card">' +
        '<h3 class="cp-h3">Driving Growth, worked</h3>' +
        '<p class="body-p">Target 10, TT-5 of 71,000 and NPV-5 (3Gen) of 25,100. Ringana’s own example.</p>' +
        row("71,000 × 2%", "1,420 pts") +
        row("25,100 × 20%", "5,020 pts") +
        row("Total", "6,440 pts", true) +
        row("× " + POINTS_FACTOR, usd(10304), true) +
      "</div>" +
      '<p class="body-p">TT-5 and NPV-5 subtract the five strongest teams. Different strip than TT-1 / TT-2 / TT-3.</p>'
    );
  }

  function htmlStart() {
    var html =
      '<p class="cp-kicker">Qualification · first four statement months</p>' +
      '<div class="cp-scroll"><table class="cp-chart cp-chart-sm"><thead><tr>' +
        '<th class="cp-chart-stub"></th><th>Month 1</th><th>Month 2</th><th>Month 3</th><th>Month 4</th>' +
      "</tr></thead><tbody>" +
        '<tr><th class="cp-chart-row">Target Level</th><td>1</td><td>2</td><td>3</td><td>4</td></tr>' +
        '<tr><th class="cp-chart-row">Personal, active partners</th><td>0</td><td>0</td><td>1</td><td>2</td></tr>' +
      "</tbody></table></div>" +
      '<p class="cp-chart-foot">Both bars, every month. Miss either and you’re out. Month 1 has no cash row — hitting Target 1 keeps you in.</p>' +
      '<p class="cp-kicker">Bonus lookup · what those bars pay</p>' +
      '<div class="cp-scroll"><table class="cp-chart cp-chart-sm"><thead><tr>' +
        "<th>Target Level</th><th>Personal, active partners</th><th>US Dollars</th>" +
      "</tr></thead><tbody>" +
        "<tr><td>2</td><td>+ 0</td><td>$110</td></tr>" +
        "<tr><td>3</td><td>+ 1</td><td>$220</td></tr>" +
        "<tr><td>4</td><td>+ 2</td><td>$2,200</td></tr>" +
      "</tbody></table></div>" +
      '<p class="cp-chart-foot">The dollars follow what you actually hit, not the calendar month. Beat both bars and you get the highest row — two Targets in one month doesn’t mean two bonuses. Hit that same Target again later and it pays again.</p>' +
      '<p class="cp-kicker">Ringana’s own example</p>' +
      '<div class="cp-scroll"><table class="cp-chart cp-chart-sm"><thead><tr>' +
        '<th class="cp-chart-stub"></th><th>Month 1</th><th>Month 2</th><th>Month 3</th><th>Month 4</th>' +
      "</tr></thead><tbody>" +
        '<tr><th class="cp-chart-row">Target Level reached</th><td>1 / 1</td><td>3 / 2</td><td>3 / 3</td><td>4 / 4</td></tr>' +
        '<tr><th class="cp-chart-row">Personal, active partners</th><td>0 / 0</td><td>1 / 0</td><td>1 / 1</td><td>1 / 2</td></tr>' +
        '<tr><th class="cp-chart-row">Top-up bonus</th><td>—</td><td>$220</td><td>$220</td><td>$0 · out</td></tr>' +
      "</tbody></table></div>" +
      '<p class="cp-chart-foot">Month 2 they overshot — Target 3 and one partner — so the lookup pays $220, not $110. Month 4 they have Target 4 but only one partner, so they miss the partner bar and they’re out.</p>' +
      '<p class="cp-kicker">When a first-time partner can count</p>';
    var i, s;
    for (i = 0; i < START_MONTHS.length; i++) {
      s = START_MONTHS[i];
      if (s.tag !== "plan") continue;
      html += monthCard(s, false);
    }
    html +=
      '<div class="cp-ext">' +
        '<div class="cp-ink" style="border-radius:16px 16px 0 0">' +
          '<div class="live-tag" style="color:rgba(245,246,242,.7)">Not in the plan document</div>' +
          '<h3 class="prod-head-title" style="font-size:26px;margin:0 0 10px;color:#fff">Four more months — a private agreement</h3>' +
          "<p>The published Start Bonus ends at month four. From Target 5, the USA honors the rest as a private high-performer agreement — a separate legal contract, not the Start Bonus line. Maximum eight months in total: four Start Bonus plus four extra. You don’t opt in. You earn it by not missing a month.</p>" +
        "</div>" +
        '<div class="cp-ext-body">';
    for (i = 0; i < START_MONTHS.length; i++) {
      s = START_MONTHS[i];
      if (s.tag === "extension") html += monthCard(s, true);
    }
    html += "</div></div>";
    return html;
  }

  function monthCard(s, projected) {
    var partners = s.partners === 0 ? "no personal active partners" : (s.partners + " personal, active partner" + (s.partners > 1 ? "s" : ""));
    return (
      '<div class="cp-month' + (projected ? " is-proj" : "") + '">' +
        '<div class="cp-month-top">' +
          '<span class="cp-month-n">' + String(s.m).padStart(2, "0") + "</span>" +
          '<span class="cp-month-title">Target ' + s.tl + " · " + partners + "</span>" +
          (projected ? '<span class="cp-month-amt">' + usd(s.bonus, 0) + "</span>" : "") +
        "</div>" +
        '<p class="cp-month-note">' + esc(s.note) + (projected ? " " + tag("extension") : "") + "</p>" +
      "</div>"
    );
  }

  function htmlCoach() {
    var html = "";
    for (var i = 0; i < COACHING.length; i++) {
      var open = ui.openCoach === i;
      html +=
        '<button type="button" class="cp-acc' + (open ? " open" : "") + '" data-cp="coach" data-cp-v="' + i + '">' +
          '<span class="cp-acc-q"><span class="cp-plus">' + (open ? "−" : "+") + "</span>" + esc(COACHING[i].q) + "</span>" +
          (open ? '<p class="cp-acc-a">' + esc(COACHING[i].a) + "</p>" : "") +
        "</button>";
    }
    return html;
  }

  function section(id, eyebrow, title, tease, body, openDefault) {
    var open = isOpen(id, openDefault);
    return (
      '<details class="know-acc cp-fold"' + (open ? " open" : "") + ' data-cp-sec="' + esc(id) + '">' +
        '<summary class="know-acc-sum">' +
          '<span class="cp-fold-copy">' +
            '<span class="cp-fold-kicker">' + esc(eyebrow) + "</span>" +
            '<span class="cp-fold-title">' + esc(title) + "</span>" +
            (tease ? '<span class="cp-fold-tease">' + esc(tease) + "</span>" : "") +
          "</span>" +
          '<span class="know-acc-chev" aria-hidden="true"></span>' +
        "</summary>" +
        '<div class="know-acc-body cp-fold-body">' + body + "</div>" +
      "</details>"
    );
  }

  function paint(root) {
    snapshotFolds(root);
    var pack = ui.packLeaders;
    var g1 = usd(2000 * 0.09 * POINTS_FACTOR);
    var g2 = usd(2000 * 0.14 * POINTS_FACTOR);
    var html = "";
    html += '<p class="prod-head-sub" style="margin:0 0 14px">The US plan, in our words. Every number here is the formula run on made-up volume — arithmetic, not a picture of anyone’s real month. Take it slow; none of this has to land in one sitting.</p>';
    html += htmlQuiet();

    /* Vocabulary first — the playground talks in DT and TT-2, so those two
       chapters have to come before it or the dials are just noise. */
    html += section("points", "The $1.60", "Two different kinds of points",
      "They both say points. They’re not the same number.",
      '<p class="body-p">This is the one that gets everyone. Same word, two jobs.</p>' +
      '<div class="live-card">' +
        '<div class="cp-card-head"><div><div class="live-tag">Product points</div><h3 class="cp-h3">How much product moved</h3></div>' + tag("estimate") + "</div>" +
        '<p class="body-p">Every product has its own point value, in the US partner shop once pricing is live. We’ve heard one product point may be roughly $2 in sales — so 110 points might be around $220 of volume.</p>' +
        '<p class="cp-note"><strong>Not in the PDF yet.</strong> The US points chart lands in September. Until then, Europe is a close read — points will be almost the same. We’ve heard one product point may be roughly $2 in sales — so 110 points might be around $220 of volume. Fine for a ballpark. Not a promise.</p>' +
      "</div>" +
      '<div class="cp-ink">' +
        '<div class="cp-card-head"><div><div class="live-tag" style="color:rgba(245,246,242,.7)">Commission points</div><h3 class="cp-h3" style="color:#fff">What you actually get paid</h3></div>' + tag("plan") + "</div>" +
        "<p>One commission point equals " + usd(POINTS_FACTOR) + ". That conversion happens <em>after</em> your percentage — last step, not first.</p>" +
        '<p class="cp-formula">1,000 DT points × 39% = 390 commission points × ' + usd(POINTS_FACTOR) + " = " + usd(624) + "</p>" +
      "</div>" +
      '<div class="live-card"><p class="body-p" style="margin:0">Roughly $2 is “how much product.” ' + usd(POINTS_FACTOR) + " is “what an earned commission point pays.” Two conversions. Only the second one is confirmed.</p></div>"
    );

    html += section("vocab", "The four letters", "PT, CT, DT, TT",
      "Get these and the rest of the plan starts making sense.",
      '<p class="body-p">Tap one if you want the extra beat.</p>' +
      htmlVocab()
    );

    html += htmlPlay();

    html += section("ladder", "The ten targets", "Here’s the whole plan on one grid",
      "Tap a column. Target 4 is where customers start counting.",
      htmlLadder()
    );

    html += section("strip", "How a team is measured", "The plan wants more than one strong team",
      "Ringana’s picture is two teams: TT 4,500 · TT-1 2,700. C and D let you tap TT-3.",
      '<p class="body-p">From Target 3 up, they don’t qualify you on full team volume. The strongest first-generation team — then two, then three — steps aside first. That’s the plan checking that more than one person is building with you. A and B are the example in the PDF. C and D are extra so TT-2 and TT-3 actually change the number.</p>' +
      htmlStrip()
    );

    html += section("start", "The Start Bonus", "A boost for your first four months",
      "Enroll them the month before you need them to count.",
      '<p class="body-p">First-time partners on the Business Booster starter set. First four statement months. Returning partners can’t qualify. Two bars every month — Target Level, and how many personal, direct, active partners you have. Hit both and you get the bonus for what you actually reached. Miss either and you’re out.</p>' +
      '<div class="live-card"><p class="body-p" style="margin:0 0 8px"><strong>USA launch · the first commission period.</strong></p><p class="body-p" style="margin:0">October is pre-sales. Volume from October moves into November. The first commission period is November and December together — October + November + December volume all count. Everyone in that period is a New Partner, and Start Bonus on that period is doubled. A Founder Pack isn’t required for the track; buying one in October doubles Start Bonus for the whole four months.</p></div>' +
      htmlStart() +
      '<div class="live-card"><p class="body-p" style="margin:0">Months 1–4 — levels, partner counts, and amounts — are in the US plan. Months 5–8 are a private high-performer agreement if you hit Target 5 or above — confirmed by corporate, not in the PDF. The dollar figures for those months are our projection from the pattern. Not official, not final.</p></div>' +
      '<div class="cp-ink">' +
        '<div class="live-tag" style="color:rgba(245,246,242,.7)">When they can count</div>' +
        "<p>This is only about counting as a <em>direct active partner for Start Bonus</em> — not a ban on being active. New partners are billed after their first fully completed statement month. Activity (Target 1, 110 DT) is measured at that billing.</p>" +
        "<p>So a first-timer counts the month after you enroll them, not the month you do. Need them in month 3? Enroll them in month 2. Returning partners are billed the month they rejoin.</p>" +
      "</div>"
    );

    html += section("shapes", "In dollars", "What this looks like when you run it",
      "Ringana’s own examples, worked through.",
      htmlShapes() +
      '<p class="body-p" style="margin-top:22px">Want to run your own numbers? <strong>Play with the numbers</strong> up the page does the whole settlement — it works out your target, applies the strip and the ceiling, and lets you put volume at any generation.</p>' +
      '<p class="body-p">Try this in it: give one team 2,000 all in generation 1, then move that same 2,000 to generation 2. Same volume, ' + g1 + " vs " + g2 + ". Generation 2 is the best-paid row in the plan.</p>"
    );

    html += section("cap", "One team’s ceiling", "A pay cap, not a volume cap",
      "The 50,000 still counts in TT. What can be capped is what that one team pays.",
      htmlPayCap()
    );

    html += section("beyond", "After Target 10", "The plan keeps going",
      "Three paths. Ringana works Driving Growth.",
      htmlBeyond()
    );

    html += section("coach", "Wait, what?", "The questions this raises",
      "The bits that usually snag.",
      htmlCoach()
    );

    html += section("house", "The practical bits", "When the month closes, vouchers, paperwork",
      "CET, W-9, the $50 voucher — the stuff that quietly matters.",
      "<ul class=\"cp-list\">" +
        "<li><strong>The month closes on Central European Time.</strong> A statement month is a calendar month, 23:59 CET on the last day. Only paid orders count — payment received by Ringana. Bank transfers by 16:00 CET on the last working day, with the right reference.</li>" +
        "<li><strong>USA launch is its own first period.</strong> October is pre-sales — volume moves to November. The first commission period is November and December together. After that, the ordinary calendar applies.</li>" +
        "<li><strong>A new partner’s first settlement is after the first full month.</strong> Register in January, first final commission is the February statement, paid by mid-March (no later than the 14th). Returning partners are billed the month they rejoin. New partners can still get Interim Payments in that first calendar month; US billing addresses get those from January 2027.</li>" +
        "<li><strong>Interim payments are DT only, from January 2027 for US addresses.</strong> Cut-off is the 15th (or the last day of the first calendar month for a new partner’s first interim). Team turnover and bonuses aren’t in the interim. Under $5, it isn’t paid — it carries. Until January 2027, plan around one final settlement a month.</li>" +
        "<li><strong>Below " + usd(VOUCHER_THRESHOLD, 0) + " arrives as a voucher.</strong> Over that, it transfers to the bank on file. Under it, a product voucher on ringana.us.</li>" +
        "<li><strong>Paperwork before they try to pay you.</strong> ACH form under My Account › My Data on ringana.us. Form W-9 once annual commissions hit the IRS reporting threshold — they recommend sending it early.</li>" +
        "<li><strong>Active status is required for commission.</strong> Target 1 — 110 DT points that statement month. Twelve months without commission and Ringana may end the partner contract, especially if there’s no customer turnover.</li>" +
      "</ul>"
    );

    html += section("confirm", "What we don’t know yet", "One blank left in the PDF",
      "Whether the high-performer window has a joker month.",
      '<div class="live-card"><p class="body-p" style="margin:0 0 8px"><strong>Whether months 5–8 have a joker month.</strong></p><p class="body-p" style="margin:0">Other markets let you miss a month later in the window without losing the program. Whether the US high-performer agreement does is unknown.</p></div>'
    );

    html += section("fine", "Fine print", "Source, projections, not an earnings claim",
      "The line we keep.",
      '<p class="cp-foot" style="margin-top:0">This explains how the plan calculates. The figures are the published formula with example volumes. They are not earnings claims, averages, or typical results. Income depends on individual effort and results vary. Nothing here is guaranteed.</p>' +
      '<p class="cp-foot">Statement months 5–8 amounts are projected, not published. Those months are a private high-performer agreement, not the Start Bonus line. Not official.</p>' +
      '<p class="cp-foot">Internal notes for ' + esc(pack) + ". Not for posting, social, or prospects.</p>" +
      '<p class="cp-foot">From the US commission guidelines, RCG 1.0 (10/2026), preview. Points factor valid from October 2026 until further notice. Check the current guidelines in the Online Office before relying on any figure.</p>'
    );

    root.innerHTML = html;
  }

  function onClick(e) {
    var t = e.target.closest("[data-cp]");
    if (!t) return;
    var kind = t.getAttribute("data-cp");
    var v = t.getAttribute("data-cp-v");
    if (kind === "playdepth") {
      ui.playDepth = !ui.playDepth;
      var rowsHost = document.getElementById("cppRows");
      if (rowsHost) rowsHost.innerHTML = htmlPlayRows();
      return;
    }
    if (kind === "bonushelp") {
      ui.playHelp = ui.playHelp === v ? null : v;
      repaintKeepFocus("cppBonus", htmlPlayBonusBody(playModel()));
      return;
    }
    if (kind === "playbonus") {
      ui.playBonus = !ui.playBonus;
      var bonusHost = document.getElementById("cppBonusHost");
      if (bonusHost) bonusHost.innerHTML = htmlPlayBonus(playModel());
      return;
    }
    if (kind === "preset" || kind === "playwork" || kind === "way") {
      if (kind === "preset") {
        ui.play = clonePreset(v);
        ui.playPreset = v;
        ui.playJumped = null;
        ui.playWay = null;
      } else if (kind === "way") {
        if (!ui.playJumped) return;
        var shaped = v ? playShapeLoad(v, ui.playJumped) : playJumpShape(ui.playJumped);
        if (!shaped) return;
        ui.play = shaped;
        ui.playPreset = null;
        ui.playWay = v || null;
      } else {
        ui.playWork = !ui.playWork;
      }
      repaintPlay(kind !== "playwork");
      return;
    }
    if (kind === "vocab") ui.openVocab = ui.openVocab === Number(v) ? null : Number(v);
    else if (kind === "tl") ui.activeTL = Number(v);
    else if (kind === "strip") ui.strip = Number(v);
    else if (kind === "coach") ui.openCoach = ui.openCoach === Number(v) ? null : Number(v);
    else return;
    var root = boundRoot || t.closest("#leadersUnderstandRoot") || t.closest(".cp-root");
    if (!root) return;
    var y = (window.FS.pageScrollY && window.FS.pageScrollY()) || window.scrollY || window.pageYOffset || 0;
    paint(root);
    if (window.FS.setPageScrollY) window.FS.setPageScrollY(y);
    else window.scrollTo(0, y);
    if (kind === "tl") {
      var col = root.querySelector(".cp-chart th.on");
      if (col && col.scrollIntoView) col.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
  }

  function onInput(e) {
    var el = e.target;
    if (el.hasAttribute("data-cp-play-tl")) {
      var jump = Number(el.value) || 0;
      /* select fires input and change; the second one would repaint for nothing. */
      if (!jump || ui.playJumped === jump) return;
      ui.play = playJumpShape(jump);
      ui.playPreset = null;
      ui.playJumped = jump;
      ui.playWay = null;
      repaintPlay(true);
      return;
    }
    if (el.hasAttribute("data-cp-play-own")) {
      ui.play.own = Math.max(0, Number(el.value) || 0);
      ui.playPreset = null;
      ui.playJumped = null;
      ui.playWay = null;
      syncPlayLive();
      return;
    }
    if (el.hasAttribute("data-cp-play-team")) {
      var ti = Number(el.getAttribute("data-cp-play-team"));
      if (ui.play.teams[ti]) setTeamVol(ui.play.teams[ti], Number(el.value) || 0);
      ui.playPreset = null;
      ui.playJumped = null;
      ui.playWay = null;
      syncPlayLive();
      return;
    }
    if (el.hasAttribute("data-cp-play-gen")) {
      var at = el.getAttribute("data-cp-play-gen").split(",");
      var gt = ui.play.teams[Number(at[0])];
      var gi = Number(at[1]);
      if (gt) {
        while (gt.gens.length <= gi) gt.gens.push(0);
        gt.gens[gi] = Math.max(0, Number(el.value) || 0);
      }
      ui.playPreset = null;
      ui.playJumped = null;
      ui.playWay = null;
      syncPlayLive(true);
      return;
    }
    /* The bonus inputs don't touch the dials, so they only need the readouts
       repainted — never the sliders. */
    if (el.hasAttribute("data-cp-start-month")) {
      ui.startMonth = Math.max(0, Number(el.value) || 0);
    } else if (el.hasAttribute("data-cp-start-partners")) {
      ui.startPartners = Math.max(0, Number(el.value) || 0);
    } else if (el.hasAttribute("data-cp-npv")) {
      if (el.getAttribute("data-cp-npv") === "3") ui.npv3 = Math.max(0, Number(el.value) || 0);
      else ui.npv2 = Math.max(0, Number(el.value) || 0);
    } else if (el.hasAttribute("data-cp-gb-tl")) {
      var gi = Number(el.getAttribute("data-cp-gb-tl"));
      if (ui.gbPartners[gi]) ui.gbPartners[gi].tl = Number(el.value) || 6;
    } else if (el.hasAttribute("data-cp-gb-tt")) {
      var gj = Number(el.getAttribute("data-cp-gb-tt"));
      if (ui.gbPartners[gj]) ui.gbPartners[gj].tt = Math.max(0, Number(el.value) || 0);
    } else {
      return;
    }
    var pm = playModel();
    repaintKeepFocus("cppBonus", htmlPlayBonusBody(pm));
    var meters = document.getElementById("cppMeters");
    if (meters) meters.innerHTML = htmlPlayMeters();
  }

  var boundRoot = null;

  function render(root, opts) {
    if (!root) return;
    opts = opts || {};
    var pack = opts.packLeaders || ui.packLeaders;
    var first = root.dataset.wired !== "1";
    if (first) {
      root.dataset.wired = "1";
      boundRoot = root;
      root.addEventListener("click", onClick);
      root.addEventListener("input", onInput);
      /* Safari didn't fire input on select for a long time. */
      root.addEventListener("change", onInput);
    }
    if (first || pack !== ui.packLeaders || !root.innerHTML) {
      ui.packLeaders = pack;
      paint(root);
    } else {
      ui.packLeaders = pack;
    }
  }

  window.FS = window.FS || {};
  window.FS.CompPlan = { render: render };
})();
