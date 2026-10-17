(function () {
  /* Sponsor search strings. Only names we actually have. */
  var SPONSORS = {};

  function slug() {
    try {
      var q = new URLSearchParams(location.search).get("with") || "";
      if (q) return q.trim().toLowerCase();
    } catch (e) {}
    return "";
  }

  function propagate(s) {
    if (!s) return;
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (/^(https?:|mailto:|#)/.test(href)) return;
      if (href.indexOf("with=") >= 0) return;
      if (!/\.html(\?|#|$)/.test(href) && href.slice(-5) !== ".html") return;
      var hash = "";
      var cut = href.indexOf("#");
      if (cut >= 0) {
        hash = href.slice(cut);
        href = href.slice(0, cut);
      }
      a.setAttribute("href", href + (href.indexOf("?") >= 0 ? "&" : "?") + "with=" + encodeURIComponent(s) + hash);
    });
  }

  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var drop = document.querySelector(".nav-drop");
  if (drop) {
    var planBtn = drop.querySelector(".nav-plan");
    function setOpen(open) {
      drop.classList.toggle("is-open", open);
      if (planBtn) planBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (planBtn) {
      planBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!drop.classList.contains("is-open"));
      });
    }
    document.addEventListener("click", function (e) {
      if (!drop.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  var s = slug();
  propagate(s);

  var field = document.getElementById("sponsorField");
  if (field) {
    var who = s;
    var name = SPONSORS[who];
    var note = document.getElementById("sponsorNote");
    var label = who.replace(/-/g, " ").replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }).split(" ")[0];
    if (name) {
      field.textContent = name;
      field.classList.add("is-set");
    } else {
      field.textContent = "Sponsor name not on file yet";
      field.classList.add("is-empty");
      if (note) {
        note.hidden = false;
        note.textContent = label + "’s RINGANA sponsor string isn’t in this preview yet, so the box stays blank. It will not guess.";
      }
    }
  }

  var slides = document.querySelectorAll(".slide");
  if (slides.length) {
    var i = 0;
    var label = document.getElementById("deckCount");
    var prev = document.getElementById("deckPrev");
    var next = document.getElementById("deckNext");
    function show(n) {
      i = Math.max(0, Math.min(slides.length - 1, n));
      slides.forEach(function (el, idx) { el.classList.toggle("on", idx === i); });
      if (label) label.textContent = (i + 1) + " / " + slides.length;
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
    }
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); show(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
    });
    show(0);
  }

  var track = document.getElementById("filmTrack");
  var filmPrev = document.getElementById("filmPrev");
  if (track && filmPrev) {
    var frames = Array.prototype.slice.call(track.children);
    var filmCount = document.getElementById("filmCount");
    var filmNext = document.getElementById("filmNext");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function filmIndex() {
      var origin = frames[0].offsetLeft;
      var x = track.scrollLeft + origin;
      var best = 0;
      var bestDist = Infinity;
      frames.forEach(function (frame, i) {
        var dist = Math.abs(frame.offsetLeft - x);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }
    function paintFilm() {
      var n = filmIndex();
      if (filmCount) filmCount.textContent = (n + 1) + " / " + frames.length;
      if (filmPrev) filmPrev.disabled = n === 0;
      if (filmNext) filmNext.disabled = n === frames.length - 1;
    }
    function goFilm(n) {
      n = Math.max(0, Math.min(frames.length - 1, n));
      track.scrollTo({
        left: frames[n].offsetLeft - frames[0].offsetLeft,
        behavior: reduce ? "auto" : "smooth"
      });
    }
    if (filmPrev) filmPrev.addEventListener("click", function () { goFilm(filmIndex() - 1); });
    if (filmNext) filmNext.addEventListener("click", function () { goFilm(filmIndex() + 1); });
    track.addEventListener("scroll", paintFilm, { passive: true });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goFilm(filmIndex() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goFilm(filmIndex() - 1); }
    });
    paintFilm();
  }

  document.querySelectorAll(".flip").forEach(function (card) {
    var face = card.querySelector(".flip-face");
    var back = card.querySelector(".flip-back");
    card.addEventListener("click", function () {
      var on = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", on ? "true" : "false");
      if (face) face.setAttribute("aria-hidden", on ? "true" : "false");
      if (back) back.setAttribute("aria-hidden", on ? "false" : "true");
    });
  });
})();
