/* First Seeds — public personal lead page */
(function () {
  "use strict";

  var Cloud = window.FS.Cloud;
  var params = new URLSearchParams(window.location.search);
  var slug = (params.get("p") || params.get("with") || "").trim().toLowerCase();
  if (!slug) {
    try {
      var slugHash = String(window.location.hash || "").match(/(?:^|[?#&])(?:p|with)=([^&]+)/i);
      if (slugHash) slug = decodeURIComponent(slugHash[1] || "").trim().toLowerCase();
    } catch (eSlugHash) {}
  }
  var joinCode = (params.get("join") || "").trim().toLowerCase();
  if (!joinCode || joinCode === "evergreen") {
    try {
      var hm = String(window.location.hash || "").match(/(?:^|[?#&])(?:fs)?join=([^&]+)/i);
      if (hm) joinCode = decodeURIComponent(hm[1] || "").trim().toLowerCase();
    } catch (eHash) {}
  }
  if (joinCode && joinCode !== "evergreen" && !slug) {
    try {
      var host = "";
      try { host = String(window.location.hostname || "").toLowerCase(); } catch (eH) {}
      var groveDoor = host === "thefreshgrove.team" || host === "www.thefreshgrove.team" ||
        host === "app.thefreshgrove.team";
      var hub = (params.get("hub") || "").trim().toLowerCase();
      var looksGrove = groveDoor || hub === "grove" || hub === "fresh-grove";
      /* Stay on the hub. join.html / grove-join.html are extra hops —
         in-app browsers drop ?join= on the second jump. */
      var next = "index.html?join=" + encodeURIComponent(joinCode);
      var person = joinCode.indexOf("evl-") !== 0 && joinCode !== "evergreen-leaders";
      if ((hub === "evergreen" || hub === "evergreen-co") && !person) next += "&hub=evergreen";
      else if (looksGrove) next += "&hub=grove";
      next += "#join=" + encodeURIComponent(joinCode);
      window.location.replace(next);
    } catch (eJoin) {}
    return;
  }
  var fromApp = params.get("from") === "app";
  var back = document.getElementById("leadBack");
  if (back) {
    back.hidden = !fromApp;
    if (fromApp) {
      back.addEventListener("click", function (e) {
        e.preventDefault();
        try {
          if (window.opener && !window.opener.closed) window.opener.focus();
        } catch (err) {}
        try { window.close(); } catch (err2) {}
        setTimeout(function () {
          try {
            var host = String(location.hostname || "").toLowerCase();
            if (host === "thefreshgrove.team" || host === "www.thefreshgrove.team") {
              location.href = "https://app.thefreshgrove.team/index.html?go=leads";
              return;
            }
          } catch (eHost) {}
          location.href = "index.html?go=leads";
        }, 80);
      });
    }
  }

  var loading = document.getElementById("leadLoading");
  var missing = document.getElementById("leadMissing");
  var loadError = document.getElementById("leadLoadError");
  var page = document.getElementById("leadPage");
  var thanks = document.getElementById("leadThanks");
  var form = document.getElementById("leadForm");
  var msg = document.getElementById("leadFormMsg");
  var interestInput = document.getElementById("leadInterest");
  var partnerName = "";
  var thanksMessage = "";

  /* Per-slug page variants. Only these slugs change — everyone else stays default. */
  var LEAD_PAGE_VARIANTS = {
    "karen-serrano": {
      hideBusiness: true,
      hideInterest: true,
      hideBlurb: true,
      defaultInterest: "products",
      cardSub: "Leave your name and how to reach you. You’ll get launch timing and honest product notes — no spam list.",
      launchNote: {
        title: "Just landing in America",
        body: "Ringana is opening its first U.S. chapter this fall. Products arrive November 1 — the same fresh-made, toxin-free line that’s been made in Austria for thirty years. I’m keeping a small list of people who want first access and honest notes as it unfolds. That’s it for now."
      }
    }
  };

  function leadPageVariant(pageSlug) {
    var key = String(pageSlug || slug || "").trim().toLowerCase();
    return (key && LEAD_PAGE_VARIANTS[key]) || null;
  }

  function applyLeadVariant(variant) {
    if (!variant) return;
    if (variant.hideInterest) {
      var interestField = document.getElementById("leadInterestField");
      if (interestField) interestField.hidden = true;
      if (interestInput) {
        interestInput.removeAttribute("required");
        interestInput.value = variant.defaultInterest || "products";
      }
      setInterest(variant.defaultInterest || "products");
    }
    if (variant.hideBusiness) {
      var biz = document.getElementById("leadBusinessStory");
      if (biz) biz.hidden = true;
      var productStory = document.getElementById("leadProductStory");
      if (productStory) productStory.open = true;
    }
    if (variant.hideBlurb) {
      var blurbBox = document.getElementById("leadBlurb");
      if (blurbBox) {
        blurbBox.textContent = "";
        blurbBox.hidden = true;
      }
    }
    if (variant.cardSub) {
      var sub = document.getElementById("leadCardSub");
      if (sub) sub.textContent = variant.cardSub;
    }
    if (variant.launchNote) {
      var note = document.getElementById("leadLaunchNote");
      var title = document.getElementById("leadLaunchTitle");
      var body = document.getElementById("leadLaunchBody");
      if (title) title.textContent = variant.launchNote.title || "";
      if (body) body.textContent = variant.launchNote.body || "";
      if (note) note.hidden = false;
    }
  }

  /* Visitor-safe, shortened versions of Learn’s product + business story.
     Kept here (not full content.js) so the public page stays light and claim-careful. */
  var LEAD_PRODUCT_BUBBLES = [
    {
      title: "Made fresh — on purpose",
      body: "Most products are built to sit on a shelf for years. These are made in small batches — about twice a week on average — with shorter shelf lives so what’s in the bottle is still worth using when it reaches you."
    },
    {
      title: "One campus, start to finish",
      body: "Almost everything happens under one roof in Austria: formula, fill, finish. Fewer handoffs. More eyes on quality. And they’re investing $85M in a new American campus — set to be ready in 2027 — so that same start-to-finish care can live here too."
    },
    {
      title: "Formulas that actually make sense",
      body: "If you read labels, you’ll notice it. Ingredients earn their place — botanicals alongside researched vitamins, minerals, and more — chosen for how they work together, not for a trend list."
    }
  ];

  var LEAD_BUSINESS_BUBBLES = [
    {
      title: "Day one in America. Decades everywhere else.",
      body: "Ringana’s already established across Europe — decades of systems, products people reorder, and a Fresh Factory shipping from Austria. The U.S. chapter opens with free partner signup on October 1 and products for customers on November 1. If you’re ready to start sharing now, we have exclusive team resources to support you before the door even opens."
    },
    {
      title: "Built to be shared person to person",
      body: "These products weren’t designed to fight for space on a shelf. They’re made fresh, meant to be experienced, and passed along through real conversations — the kind where someone tries something, feels the difference, and tells a friend."
    },
    {
      title: "A hybrid affiliate model — your way",
      body: "Grow a team, sell products, or both. It’s a hybrid affiliate structure, not a monthly-order machine: no monthly order requirement to stay active. U.S. launch in November comes with double commissions and double bonuses for founding partners — current guidance for that opening window."
    }
  ];

  function esc(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBubbles(el, items) {
    if (!el) return;
    el.innerHTML = (items || []).map(function (item) {
      return '<article class="lead-bubble"><strong>' + esc(item.title) +
        "</strong><p>" + esc(item.body) + "</p></article>";
    }).join("");
  }

  function defaultThanks() {
    return (Cloud && Cloud.DEFAULT_LEAD_THANKS) ||
      "Thanks for adding your info! I’ll be in touch with some exciting Ringana details soon!";
  }

  function show(el) {
    [loading, missing, loadError, page, thanks].forEach(function (n) {
      if (n) n.hidden = n !== el;
    });
  }

  function firstName(full) {
    return (full || "").trim().split(/\s+/)[0] || "your friend";
  }

  function setInterest(value) {
    interestInput.value = value || "";
    var chips = document.querySelectorAll(".lead-chip");
    for (var i = 0; i < chips.length; i++) {
      var on = chips[i].getAttribute("data-interest") === value;
      chips[i].classList.toggle("on", on);
      chips[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  var interestRow = document.querySelector(".lead-interest-row");
  if (interestRow) {
    interestRow.addEventListener("click", function (e) {
      var t = e.target.closest("[data-interest]");
      if (!t) return;
      setInterest(t.getAttribute("data-interest"));
      if (msg) msg.textContent = "";
    });
  }

  function publicLeadError(err) {
    var code = String((err && err.code) || "");
    var raw = String((err && err.message) || "").trim();
    if (code === "P0001" && raw) return raw;
    return "Something went wrong. Try again.";
  }

  if (form) {
    var submitting = false;
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitting) return;
      if (msg) msg.textContent = "";
      var btn = document.getElementById("leadSubmit");
      var payload = {
        name: (document.getElementById("leadName").value || "").trim(),
        email: (document.getElementById("leadEmail").value || "").trim(),
        phone: (document.getElementById("leadPhone").value || "").trim(),
        ig: ((document.getElementById("leadSocial") && document.getElementById("leadSocial").value) || "").trim(),
        interest: (interestInput.value || "").trim(),
        hp: ((document.getElementById("leadCompany") && document.getElementById("leadCompany").value) || "").trim()
      };
      if (payload.name.length < 2) {
        if (msg) msg.textContent = "Please enter your name.";
        return;
      }
      if (!payload.email && !payload.phone) {
        if (msg) msg.textContent = "Add an email or a phone number.";
        return;
      }
      if (payload.email && payload.email.indexOf("@") < 1) {
        if (msg) msg.textContent = "That email doesn’t look right.";
        return;
      }
      var variant = leadPageVariant(slug);
      if (variant && variant.hideInterest) {
        payload.interest = variant.defaultInterest || "products";
        if (interestInput) interestInput.value = payload.interest;
      }
      if (["products", "business", "both"].indexOf(payload.interest) < 0) {
        if (msg) msg.textContent = "Pick what you’re interested in.";
        return;
      }
      submitting = true;
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      try {
        await Cloud.submitLead(slug, payload);
        var thanksBody = document.getElementById("leadThanksBody");
        if (thanksBody) thanksBody.textContent = thanksMessage || defaultThanks();
        show(thanks);
      } catch (err) {
        submitting = false;
        if (msg) msg.textContent = publicLeadError(err);
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Get first access →";
        }
      }
    });
  }

  async function boot() {
    if (!slug) {
      show(missing);
      return;
    }
    try {
      await Cloud.init();
      var info = await Cloud.getLeadPage(slug);
      if (!info) {
        show(missing);
        return;
      }
      partnerName = info.display_name || "your friend";
      var first = firstName(partnerName);
      document.title = partnerName + " — Ringana · first access";
      var brand = document.getElementById("leadBrandName");
      if (brand) brand.textContent = first;
      var variant = leadPageVariant(info.slug || slug);
      applyLeadVariant(variant);
      if (!(variant && variant.hideBlurb)) {
        var blurbEl = document.getElementById("leadBlurb");
        var blurb = (info.blurb || "").trim();
        var fallbackBlurb = (variant && variant.defaultBlurb) ||
          "I’m gathering a small founding circle before launch — leave your info and I’ll follow up personally.";
        if (blurbEl) {
          blurbEl.textContent = blurb || fallbackBlurb;
        }
      }
      thanksMessage = ((info.thanks || "") + "").trim() || defaultThanks();
      var thanksBody = document.getElementById("leadThanksBody");
      if (thanksBody) thanksBody.textContent = thanksMessage;
      renderBubbles(document.getElementById("leadProductBubbles"), LEAD_PRODUCT_BUBBLES);
      renderBubbles(document.getElementById("leadBusinessBubbles"), LEAD_BUSINESS_BUBBLES);
      show(page);
    } catch (err) {
      show(loadError || missing);
    }
  }

  var retry = document.getElementById("leadRetry");
  if (retry) {
    retry.addEventListener("click", function () {
      show(loading);
      boot();
    });
  }

  boot();
})();
