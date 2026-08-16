/* Marketing-page motion — not the hub demo. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function daysUntil(y, m, d) {
    return Math.max(0, Math.ceil((Date.UTC(y, m, d) - Date.now()) / 86400000));
  }

  function countUp(el, target) {
    if (!el) return;
    if (reduce) {
      el.textContent = String(target);
      return;
    }
    var t0 = performance.now();
    var dur = 1100;
    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  function setHeroCountdown() {
    countUp(document.getElementById("heroPre"), daysUntil(2026, 9, 1));
    countUp(document.getElementById("heroLaunch"), daysUntil(2026, 10, 1));
  }

  function paintHeroPlant() {
    var box = document.getElementById("heroPlant");
    var fn = window.FS && window.FS.plantSVG;
    if (!box || !fn) return;
    box.innerHTML = fn(6, 3, 3, "heroBloom", true);
  }

  function bindParallax() {
    if (reduce) return;
    var hero = document.getElementById("top");
    if (!hero) return;
    var orbs = hero.querySelectorAll("[data-drift]");
    if (!orbs.length) return;
    var mx = 0, my = 0, tx = 0, ty = 0, ticking = false;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(tick);
      }
    }, { passive: true });
    function tick() {
      tx += (mx - tx) * 0.08;
      ty += (my - ty) * 0.08;
      orbs.forEach(function (el, i) {
        var d = (i + 1) * 8;
        el.style.setProperty("--dx", (tx * d) + "px");
        el.style.setProperty("--dy", (ty * d) + "px");
      });
      if (Math.abs(mx - tx) > 0.002 || Math.abs(my - ty) > 0.002) {
        window.requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    }
  }

  function bindPhoneDock() {
    var dock = document.getElementById("phoneDock");
    if (!dock) return;
    function open() {
      dock.classList.add("is-in");
      dock.setAttribute("aria-label", "First Seeds hub");
    }
    function close() {
      dock.classList.remove("is-in");
      dock.setAttribute("aria-label", "Explore the First Seeds hub");
    }
    if (reduce) {
      open();
      return;
    }
    dock.addEventListener("click", function (e) {
      if (dock.classList.contains("is-in")) return;
      e.preventDefault();
      e.stopPropagation();
      open();
    }, true);
    dock.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (dock.classList.contains("is-in")) return;
      e.preventDefault();
      open();
    });
    dock.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "mouse") close();
    });
    var hub = document.getElementById("hub");
    if (hub && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) close();
        });
      }, { threshold: 0.12 });
      io.observe(hub);
    }
  }

  setHeroCountdown();
  paintHeroPlant();
  bindParallax();
  bindPhoneDock();
})();
