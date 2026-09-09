/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — IN-APP MESSAGES
   Replaces window.alert / window.confirm so a failed save or a
   "remove this person?" question looks like the rest of the app
   instead of an OS dialog sitting on top of it.

   FS.UI.toast(msg, opts)   transient, non-blocking
   FS.UI.say(msg, opts)     modal with one button      -> Promise<void>
   FS.UI.ask(msg, opts)     modal with confirm/cancel  -> Promise<bool>
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

/* Swallow leftover clicks after a menu/sheet/dialog opens so a ghost tap
   on the new backdrop cannot slam it shut (same race as the lead dropdown). */
window.FS.armDismissGuard = function (ms) {
  window.FS._dismissUntil = Date.now() + (ms || 450);
};
window.FS.dismissGuarded = function () {
  return Date.now() < (window.FS._dismissUntil || 0);
};

(function () {
  "use strict";

  var TOAST_MS = 4200;
  var toastHost = null;
  var openModal = null;
  var modalQueue = [];

  function esc(t) {
    return (t + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function relock() {
    if (window.FS.syncOverlayBodyLock) {
      try { window.FS.syncOverlayBodyLock(); } catch (e) {}
    }
  }

  /* ── transient ── */

  function toast(msg, opts) {
    opts = opts || {};
    if (!msg) return;
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "fs-toasts";
      toastHost.setAttribute("role", "status");
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }
    var el = document.createElement("div");
    el.className = "fs-toast" + (opts.tone === "bad" ? " is-bad" : opts.tone === "good" ? " is-good" : "");
    el.innerHTML = '<span class="fs-toast-msg">' + esc(msg) + "</span>" +
      '<button type="button" class="fs-toast-x" aria-label="Dismiss">&times;</button>';
    toastHost.appendChild(el);
    var gone = false;
    function drop() {
      if (gone) return;
      gone = true;
      el.classList.add("is-going");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 220);
    }
    el.querySelector(".fs-toast-x").addEventListener("click", drop);
    setTimeout(drop, opts.ms || TOAST_MS);
    return drop;
  }

  /* ── modal ── */

  function buildModal(msg, opts) {
    opts = opts || {};
    var wrap = document.createElement("div");
    wrap.className = "overlay fs-dialog open";
    var buttons = opts.ask
      ? '<button type="button" class="btn-ghost fs-dialog-no">' + esc(opts.cancelText || "Cancel") + "</button>" +
        '<button type="button" class="btn fs-dialog-yes' + (opts.danger ? " is-danger" : "") + '">' + esc(opts.okText || "Yes") + "</button>"
      : '<button type="button" class="btn fs-dialog-yes">' + esc(opts.okText || "OK") + "</button>";
    wrap.innerHTML =
      '<div class="overlay-card fs-dialog-card" role="dialog" aria-modal="true"' +
      (opts.title
        ? ' aria-labelledby="fsDialogTitle"'
        : ' aria-label="' + esc(String(msg || "Message").slice(0, 120)) + '"') +
      ">" +
      (opts.title ? '<h2 class="fs-dialog-title" id="fsDialogTitle">' + esc(opts.title) + "</h2>" : "") +
      '<p class="fs-dialog-msg">' + esc(msg) + "</p>" +
      '<div class="fs-dialog-row">' + buttons + "</div>" +
      "</div>";
    return wrap;
  }

  function present(msg, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      /* One question at a time. A second ask used to cancel the first as
         false — delete + error would quietly drop the delete. */
      modalQueue.push({ msg: msg, opts: opts, resolve: resolve });
      if (!openModal) flushModalQueue();
    });
  }

  function flushModalQueue() {
    if (openModal) return;
    var next = modalQueue.shift();
    if (!next) return;
    showModal(next.msg, next.opts, next.resolve);
  }

  function showModal(msg, opts, resolve) {
    opts = opts || {};
    var wrap = buildModal(msg, opts);
    var lastFocus = document.activeElement;
    var settled = false;

    function settle(answer) {
      if (settled) return;
      settled = true;
      document.removeEventListener("keydown", onKey, true);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (openModal && openModal.wrap === wrap) openModal = null;
      relock();
      try {
        if (!opts.danger && lastFocus && lastFocus.focus && document.contains(lastFocus)) {
          lastFocus.focus();
        }
      } catch (e) {}
      /* Start the next queued dialog before resolving, so a follow-up
         ask() in the first promise cannot jump the line. */
      flushModalQueue();
      resolve(answer);
    }

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); settle(false); return; }
      if (e.key !== "Tab") return;
      var card = wrap.querySelector('[role="dialog"]') || wrap;
      var nodes = Array.prototype.slice.call(card.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    wrap.querySelector(".fs-dialog-yes").addEventListener("click", function () { settle(true); });
    var no = wrap.querySelector(".fs-dialog-no");
    if (no) no.addEventListener("click", function () { settle(false); });
    /* Tapping the backdrop is a cancel, same as Escape. */
    wrap.addEventListener("click", function (e) {
      if (e.target !== wrap) return;
      if (window.FS.dismissGuarded && window.FS.dismissGuarded()) return;
      settle(false);
    });
    document.addEventListener("keydown", onKey, true);

    document.body.appendChild(wrap);
    if (window.FS.armDismissGuard) window.FS.armDismissGuard();
    document.body.classList.add("overlay-open");
    openModal = { wrap: wrap, settle: settle };
    var focusFirst = wrap.querySelector(opts.ask ? ".fs-dialog-no" : ".fs-dialog-yes");
    if (focusFirst) focusFirst.focus();
  }

  window.FS.UI = {
    toast: toast,
    say: function (msg, opts) { return present(msg, opts || {}); },
    ask: function (msg, opts) {
      opts = opts || {};
      opts.ask = true;
      return present(msg, opts);
    }
  };
})();
