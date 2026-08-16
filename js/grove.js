/* The Fresh Grove — public site */
(function () {
  "use strict";

  var G = window.GROVE || {};
  var roster = G.ROSTER || [];
  var fallback = G.FALLBACK || { slug: "taylor", name: "Taylor" };
  var site = G.SITE || {};
  var cookieName = site.cookieName || "grove_with";
  var cookieDays = site.cookieDays || 90;
  var client = null;
  var selected = null;

  function $(id) { return document.getElementById(id); }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function firstName(full) {
    return String(full || "").trim().split(/\s+/)[0] || fallback.name;
  }

  function handleOf(person) {
    return String((person && person.ig) || "").trim().replace(/^@/, "");
  }

  function personSub(person) {
    var ig = handleOf(person);
    if (ig) return "@" + ig;
    return String((person && person.note) || "").trim();
  }

  function personLabel(person) {
    var sub = personSub(person);
    return person.name + (sub ? " · " + sub : "");
  }

  function bySlug(slug) {
    slug = String(slug || "").trim().toLowerCase();
    if (!slug) return null;
    for (var i = 0; i < roster.length; i++) {
      if (roster[i].slug === slug) return roster[i];
    }
    if (fallback.slug === slug) return fallback;
    return { slug: slug, name: slug, note: "", ig: "" };
  }

  function setCookie(slug) {
    var max = cookieDays * 24 * 60 * 60;
    document.cookie = cookieName + "=" + encodeURIComponent(slug) +
      ";max-age=" + max + ";path=/;SameSite=Lax";
  }

  function getCookie() {
    var parts = (document.cookie || "").split(";");
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (p.indexOf(cookieName + "=") === 0) {
        return decodeURIComponent(p.slice(cookieName.length + 1));
      }
    }
    return "";
  }

  function setUnknownPanel(on) {
    var extra = $("landedExtra");
    if (extra) extra.hidden = !on;
    if (on) return;
    qsa("[data-local]").forEach(function (b) {
      b.classList.remove("on");
      b.setAttribute("aria-pressed", "false");
    });
    var wrap = $("localAreaWrap");
    if (wrap) wrap.hidden = true;
    var area = $("localArea");
    if (area) area.value = "";
    var want = $("leaderWant");
    if (want) want.value = "";
  }

  function setSelected(person, silent) {
    if (!person || !person.slug) return;
    selected = person;
    setCookie(person.slug);
    var input = $("whoInput");
    if (input) {
      input.value = person.unknown ? "I landed here on my own" : personLabel(person);
    }
    var hidden = $("whoSlug");
    if (hidden) hidden.value = person.slug;
    var assigned = $("assignedTo");
    if (assigned) {
      assigned.textContent = person.unknown
        ? "We’ll place you with someone on the team. Two quiet questions below help."
        : "This note goes to " + firstName(person.name) + ".";
    }
    setUnknownPanel(!!person.unknown);
    if (!silent) closeCombo();
  }

  function readAttribution() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = (params.get("with") || params.get("p") || "").trim().toLowerCase();
    if (fromUrl) {
      setSelected(bySlug(fromUrl), true);
      return;
    }
    var fromCookie = getCookie();
    if (fromCookie) setSelected(bySlug(fromCookie), true);
  }

  function filteredRoster(q) {
    q = String(q || "").trim().toLowerCase();
    var list = roster.slice();
    var hasFallback = list.some(function (p) { return p.slug === fallback.slug; });
    if (!hasFallback) list.push(fallback);
    if (!q) return list;
    return list.filter(function (p) {
      var ig = handleOf(p).toLowerCase();
      return (p.name || "").toLowerCase().indexOf(q) !== -1 ||
        (p.note || "").toLowerCase().indexOf(q) !== -1 ||
        (p.slug || "").toLowerCase().indexOf(q) !== -1 ||
        ig.indexOf(q.replace(/^@/, "")) !== -1;
    });
  }

  function renderCombo(q) {
    var list = $("whoList");
    if (!list) return;
    var items = filteredRoster(q);
    var html = items.map(function (p, i) {
      var sub = personSub(p);
      return '<button type="button" class="combo-opt' + (i === 0 ? " active" : "") +
        '" data-slug="' + esc(p.slug) + '">' + esc(p.name) +
        (sub ? "<small>" + esc(sub) + "</small>" : "") +
        "</button>";
    }).join("");
    html += '<button type="button" class="combo-opt" data-slug="' + esc(fallback.slug) +
      '" data-unknown="1">I landed here on my own<small>We’ll place you — two quiet questions next</small></button>';
    list.innerHTML = html;
    list.classList.add("open");
  }

  function closeCombo() {
    var list = $("whoList");
    if (list) list.classList.remove("open");
  }

  function bindCombo() {
    var wrap = $("whoCombo");
    var input = $("whoInput");
    var list = $("whoList");
    if (!wrap || !input || !list) return;

    input.addEventListener("focus", function () { renderCombo(input.value); });
    input.addEventListener("input", function () {
      selected = null;
      $("whoSlug").value = "";
      setUnknownPanel(false);
      var assigned = $("assignedTo");
      if (assigned) assigned.textContent = "If someone sent you, start typing. If you just found us, say so.";
      renderCombo(input.value);
    });
    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-slug]");
      if (!btn) return;
      var person = btn.getAttribute("data-unknown")
        ? Object.assign({}, fallback, { unknown: true })
        : bySlug(btn.getAttribute("data-slug"));
      setSelected(person);
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) closeCombo();
    });
  }

  function bindInterest() {
    var hidden = $("interest");
    var pace = $("pace");
    qsa("[data-interest]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        qsa("[data-interest]").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        if (hidden) hidden.value = btn.getAttribute("data-interest");
        if (pace) pace.value = btn.getAttribute("data-pace") || "";
        var msg = $("formMsg");
        if (msg) msg.textContent = "";
      });
    });
  }

  function bindLocal() {
    qsa("[data-local]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        qsa("[data-local]").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        var wrap = $("localAreaWrap");
        var nearby = btn.getAttribute("data-local") === "nearby";
        if (wrap) wrap.hidden = !nearby;
        if (nearby) {
          var area = $("localArea");
          if (area) area.focus();
        }
      });
    });
  }

  /* First Seeds submit_lead has no notes arg yet (name max 80).
     Pack IG + where-they-are + placement notes into the name. */
  function packLeadName(name, ig, pace, local, looking) {
    function join(parts) {
      return parts.filter(Boolean).join(" · ");
    }
    var full = join([name, local, looking, ig ? "@" + ig : "", pace]);
    if (full.length <= 80) return full;
    var noPace = join([name, local, looking, ig ? "@" + ig : ""]);
    if (noPace.length <= 80) return noPace;
    var noIg = join([name, local, looking]);
    if (noIg.length <= 80) return noIg;
    var room = 80 - (name.length + (local ? local.length + 3 : 0));
    if (looking && room > 8) {
      return join([name, local, looking.slice(0, room)]);
    }
    return join([name, local]).slice(0, 80);
  }

  function ensureClient() {
    if (client) return client;
    var cfg = G.SUPABASE || {};
    if (!cfg.url || !cfg.anonKey || !window.supabase) {
      throw new Error("Couldn’t reach the team inbox. Try again in a moment.");
    }
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
    return client;
  }

  function normalizeIg(raw) {
    var t = String(raw || "").trim();
    t = t.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
    t = t.replace(/\/.*$/, "").replace(/^@/, "");
    t = t.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30);
    return t;
  }

  function bindForm() {
    var form = $("connectForm");
    if (!form) return;
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var msg = $("formMsg");
      var btn = $("connectSubmit");
      if (msg) { msg.textContent = ""; msg.classList.remove("ok"); }

      var slug = ($("whoSlug").value || (selected && selected.slug) || "").trim().toLowerCase();
      if (!slug) {
        if (msg) msg.textContent = "Pick who sent you — or choose “I landed here on my own.”";
        $("whoInput") && $("whoInput").focus();
        return;
      }
      var name = ($("leadName").value || "").trim();
      var email = ($("leadEmail").value || "").trim();
      var phone = ($("leadPhone").value || "").trim();
      var interest = ($("interest").value || "").trim();
      var pace = ($("pace") && $("pace").value || "").trim();
      var ig = normalizeIg($("leadIg") && $("leadIg").value);
      var unknown = !!(selected && selected.unknown);
      var localChip = qs("[data-local].on");
      var localKind = localChip ? localChip.getAttribute("data-local") : "";
      var area = ($("localArea") && $("localArea").value || "").trim();
      var looking = ($("leaderWant") && $("leaderWant").value || "").trim().replace(/\s+/g, " ");
      var localNote = "";
      if (unknown && localKind === "nearby") localNote = area || "local";
      else if (unknown && localKind === "any") localNote = "anyplace";
      if (!unknown) {
        localNote = "";
        looking = "";
      }
      if (name.length < 2) {
        if (msg) msg.textContent = "Please enter your name.";
        return;
      }
      if (!email && !phone) {
        if (msg) msg.textContent = "Add an email or a phone number.";
        return;
      }
      if (["products", "business", "both"].indexOf(interest) < 0) {
        if (msg) msg.textContent = "Tell us where to meet you — even a rough sense helps.";
        return;
      }

      try {
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
        var sb = ensureClient();
        var submitName = packLeadName(name, ig, pace, localNote, looking);
        var { error } = await sb.rpc("submit_lead", {
          p_slug: slug,
          p_name: submitName,
          p_email: email,
          p_phone: phone,
          p_interest: interest
        });
        if (error) throw error;
        var thanks = $("connectThanks");
        var letter = $("connectLetter");
        var body = $("thanksBody");
        if (body) {
          body.textContent = unknown
            ? "We’ll put you with the right person — launch notes, and a next step that matches where you actually are."
            : firstName((selected && selected.name) || bySlug(slug).name) +
              " will be in touch — launch notes, and a next step that matches where you actually are.";
        }
        if (letter) letter.hidden = true;
        if (thanks) thanks.classList.add("on");
      } catch (err) {
        var raw = (err && (err.message || err.error_description)) || "";
        if (msg) {
          msg.textContent = /page not found/i.test(raw)
            ? "That teammate link isn’t live yet — try “I landed here on my own.”"
            : (raw || "Something went wrong. Try again.");
        }
        if (btn) { btn.disabled = false; btn.textContent = "Send this note →"; }
      }
    });
  }

  function bindHeader() {
    var header = $("siteHeader");
    var modalOpen = false;

    function setConnectOpen(open) {
      var modal = $("connectModal");
      if (!modal) return;
      modalOpen = !!open;
      modal.classList.toggle("open", modalOpen);
      modal.setAttribute("aria-hidden", modalOpen ? "false" : "true");
      document.body.classList.toggle("connect-open", modalOpen);
      updateSticky();
      if (modalOpen) {
        var letter = $("connectLetter");
        if (letter && !letter.hidden) {
          window.setTimeout(function () {
            var input = $("whoInput");
            if (input) input.focus();
          }, 80);
        }
      }
    }

    function updateSticky() {
      var sticky = $("stickyCta");
      if (!sticky) return;
      if (modalOpen) {
        sticky.classList.remove("on");
        return;
      }
      sticky.classList.toggle("on", window.scrollY > window.innerHeight * 0.7);
    }

    var onScroll = function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
      updateSticky();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.addEventListener("click", function (e) {
      var openBtn = e.target.closest("[data-open-connect], a[href='#connect']");
      if (openBtn) {
        e.preventDefault();
        setConnectOpen(true);
        return;
      }
      if (e.target.closest("[data-close-connect]")) {
        setConnectOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalOpen) setConnectOpen(false);
    });
    if (location.hash === "#connect") setConnectOpen(true);
  }

  function bindSwitchers() {
    var buttons = qsa("[data-faq-cat]");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-faq-cat");
        var already = btn.classList.contains("on");
        buttons.forEach(function (b) {
          var on = !already && b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-expanded", on ? "true" : "false");
        });
        qsa(".faq-group").forEach(function (p) {
          var show = !already && p.getAttribute("data-faq-group") === id;
          p.classList.toggle("on", show);
          if (show) p.removeAttribute("hidden");
          else p.setAttribute("hidden", "");
          qsa("details", p).forEach(function (d) { d.open = false; });
        });
      });
    });
  }

  function bindFaq() {
    qsa(".faq-group").forEach(function (group) {
      qsa("details", group).forEach(function (d) {
        d.addEventListener("toggle", function () {
          if (!d.open) return;
          qsa("details", group).forEach(function (other) {
            if (other !== d) other.open = false;
          });
        });
      });
    });
  }

  function bindCarousels() {
    qsa("[data-carousel]").forEach(function (root) {
      var track = root.querySelector(".carousel-track");
      var slides = root.querySelectorAll(".carousel-slide");
      var dotsWrap = root.querySelector(".carousel-dots");
      var label = root.querySelector("[data-carousel-label]");
      var prev = root.querySelector("[data-carousel-prev]");
      var next = root.querySelector("[data-carousel-next]");
      if (!track || slides.length < 2) return;
      var n = slides.length;
      var i = 0;
      var startX = 0;
      var dragging = false;

      function pad(num) {
        return (num < 10 ? "0" : "") + num;
      }

      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        for (var d = 0; d < n; d++) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel-dot" + (d === 0 ? " on" : "");
          dot.setAttribute("aria-label", "Slide " + (d + 1));
          dot.setAttribute("data-i", String(d));
          dotsWrap.appendChild(dot);
        }
      }

      function go(to) {
        i = (to + n) % n;
        track.style.transform = "translateX(" + (-i * 100) + "%)";
        slides.forEach(function (s, idx) {
          s.classList.toggle("is-active", idx === i);
        });
        if (dotsWrap) {
          qsa(".carousel-dot", dotsWrap).forEach(function (dot, idx) {
            dot.classList.toggle("on", idx === i);
          });
        }
        if (label) label.textContent = pad(i + 1) + " / " + pad(n);
      }

      if (prev) prev.addEventListener("click", function () { go(i - 1); });
      if (next) next.addEventListener("click", function () { go(i + 1); });
      if (dotsWrap) {
        dotsWrap.addEventListener("click", function (e) {
          var dot = e.target.closest("[data-i]");
          if (dot) go(parseInt(dot.getAttribute("data-i"), 10));
        });
      }

      var viewport = root.querySelector(".carousel-viewport");
      if (viewport) {
        viewport.addEventListener("pointerdown", function (e) {
          if (e.target.closest("button, a")) {
            dragging = false;
            return;
          }
          dragging = true;
          startX = e.clientX;
        });
        viewport.addEventListener("pointerup", function (e) {
          if (!dragging) return;
          dragging = false;
          var dx = e.clientX - startX;
          if (dx > 40) go(i - 1);
          else if (dx < -40) go(i + 1);
        });
        viewport.addEventListener("pointerleave", function () { dragging = false; });
      }

      go(0);
    });
  }

  function bindReveal() {
    var nodes = qsa(".reveal");
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (n) { n.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  readAttribution();
  bindCombo();
  bindInterest();
  bindLocal();
  bindForm();
  bindHeader();
  bindSwitchers();
  bindFaq();
  bindCarousels();
  bindReveal();
})();

