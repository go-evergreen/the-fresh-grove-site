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

  var HP = [
    ["Target 5", "3 partners", "5th month", "$3,300", "$6,600"],
    ["Target 6", "4 partners", "6th month", "$5,500", "$11,000"],
    ["Target 7", "5 partners", "7th month", "$8,250", "$16,500"],
    ["Target 8", "6 partners", "8th month", "$11,000", "$22,000"],
    ["Target 9", "7 partners", "9th month", "$22,000", "$44,000"],
    ["Target 10", "8 partners", "10th month", "$33,000", "$66,000"]
  ];

  function hpHtml() {
    var rows = HP.map(function (r) {
      return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td><td class=\"num\">" + r[3] + "</td><td class=\"num\">" + r[4] + "</td></tr>";
    }).join("");
    return (
      "<p class=\"lib-kicker\">High performance bonus</p>" +
      "<h2 class=\"section-title\">October enrollment doubles every level.</h2>" +
      "<p class=\"lede\">These rows are not on the public pages. The Start Bonus through Target 4 is. This is the rest of the card.</p>" +
      "<div class=\"lib-table-wrap\"><table class=\"lib-table\"><thead><tr>" +
      "<th>Level</th><th>Active partners</th><th>Time</th><th>Standard</th><th>October start</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
      "<div class=\"lib-note\"><p>Join in October and grab a founder set to be eligible for the double bonuses.</p></div>" +
      "<p>If you hit Target 10 in your 4th month, you earn the double bonus that month and every month you maintain the rank after that, until the bonus window ends.</p>" +
      "<p class=\"lib-disclaimer\">These are the amounts the program pays at each level, not a projection of earnings. Reaching a level requires the sales and active partners shown. Not company material, and not a promise of income.</p>"
    );
  }

  var gate = document.getElementById("hpGate");
  var sheet = document.getElementById("hpSheet");
  if (gate && sheet) {
    function openSheet() {
      gate.hidden = true;
      sheet.hidden = false;
      sheet.innerHTML = hpHtml();
    }
    try {
      if (sessionStorage.getItem("grove-lib-hp") === "1") openSheet();
    } catch (e) {}
    var form = gate;
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("hpPass");
        var err = document.getElementById("hpErr");
        var val = (input && input.value || "").trim().toLowerCase();
        if (val === "groveleader") {
          try { sessionStorage.setItem("grove-lib-hp", "1"); } catch (errSet) {}
          openSheet();
        } else if (err) {
          err.hidden = false;
        }
      });
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
})();
