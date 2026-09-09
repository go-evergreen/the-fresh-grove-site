/* Register freshness-first service worker for PWA installs */
(function () {
  if (!("serviceWorker" in navigator)) return;

  var reloading = false;
  var takeParkedUpdate = false;
  var hadController = !!navigator.serviceWorker.controller;
  var justTookBuild = false;
  try { justTookBuild = sessionStorage.getItem("fsTookBuild") === "1"; } catch (eTook) {}
  if (justTookBuild) {
    try { sessionStorage.removeItem("fsTookBuild"); } catch (eClr) {}
  }
  /* A full document load is a complete close (or a refresh). App-switch does
     not re-run this file, so a cold open can take a parked deploy without
     reloading people who only left for a second. */
  var coldOpenCheck = !justTookBuild;
  /* Bust browser HTTP cache of sw.js itself — critical for team PWAs. */
  var SW_URL = "./sw.js?v=717";
  /* How often to look for a deploy while the app sits open. The real check is
     the one on return-to-foreground; this is just a backstop for a session
     that stays open all day. */
  var POLL_MS = 15 * 60 * 1000;
  /* Don’t swap workers after a quick app-switch — iOS was reloading the hub
     after ~a minute away. Only take the waiting update if we’ve been in the
     background long enough that a cold return is likely anyway. */
  var HIDDEN_UPDATE_MS = 4 * 60 * 1000;
  /* Hold the plant this long for a cold-open update. Offline / slow net
     should not leave someone on the cover. */
  var COLD_UPDATE_MS = 8000;
  var waitingWorker = null;
  var hiddenTimer = null;
  var freshFinished = false;

  function hidden() {
    return document.visibilityState === "hidden";
  }

  function finishFreshBuild() {
    if (freshFinished) return;
    freshFinished = true;
    try { window.FS = window.FS || {}; } catch (eFs) {}
    if (window.FS) window.FS.freshBuildPending = false;
  }

  function markTookBuild() {
    try { sessionStorage.setItem("fsTookBuild", "1"); } catch (e) {}
  }

  function reloadNow() {
    if (reloading) return;
    reloading = true;
    markTookBuild();
    window.location.reload();
  }

  /* A deploy used to install, claim and reload the page the moment it landed —
     including while you were reading, which threw away your place and your
     scroll. Mid-session, nothing is applied until the app is in the background.
     A complete close-and-reopen is a new page load — that path takes the
     update under the boot cover. */
  function applyWaitingUpdate() {
    if (!waitingWorker || !hidden()) return;
    var worker = waitingWorker;
    waitingWorker = null;
    try { worker.postMessage({ type: "SKIP_WAITING" }); } catch (e) {}
  }

  function cancelWaitingUpdate() {
    if (hiddenTimer) {
      clearTimeout(hiddenTimer);
      hiddenTimer = null;
    }
  }

  function scheduleWaitingUpdate() {
    cancelWaitingUpdate();
    if (!waitingWorker || !hidden()) return;
    hiddenTimer = setTimeout(function () {
      hiddenTimer = null;
      applyWaitingUpdate();
    }, HIDDEN_UPDATE_MS);
  }

  function activateWaiting(worker) {
    if (!worker) return;
    takeParkedUpdate = true;
    try { worker.postMessage({ type: "SKIP_WAITING" }); } catch (e) {}
  }

  function pullLatestOnColdOpen(reg) {
    if (!coldOpenCheck) {
      finishFreshBuild();
      return;
    }
    if (!hadController) {
      /* First visit — let the worker claim without a reload loop. */
      finishFreshBuild();
      return;
    }

    var settled = false;
    function done() {
      if (settled) return;
      settled = true;
      finishFreshBuild();
    }

    var timer = setTimeout(done, COLD_UPDATE_MS);

    function take(worker) {
      if (settled || reloading) return;
      if (!worker) {
        clearTimeout(timer);
        done();
        return;
      }
      clearTimeout(timer);
      /* Stay on the plant through the reload. */
      try { window.FS = window.FS || {}; } catch (eHold) {}
      if (window.FS) {
        window.FS.freshBuildPending = true;
        window.FS.applyingFreshBuild = true;
      }
      activateWaiting(worker);
      setTimeout(reloadNow, 400);
    }

    if (reg.waiting) {
      take(reg.waiting);
      return;
    }

    var updateP = Promise.resolve(reg);
    try { updateP = reg.update(); } catch (eUp) {}
    Promise.resolve(updateP).then(function () {
      if (settled || reloading) return;
      if (reg.waiting) {
        take(reg.waiting);
        return;
      }
      if (reg.installing) {
        var worker = reg.installing;
        worker.addEventListener("statechange", function onChange() {
          if (worker.state === "installed") {
            worker.removeEventListener("statechange", onChange);
            take(worker);
          } else if (worker.state === "redundant") {
            worker.removeEventListener("statechange", onChange);
            clearTimeout(timer);
            done();
          }
        });
        return;
      }
      clearTimeout(timer);
      done();
    }).catch(function () {
      clearTimeout(timer);
      done();
    });
  }

  function register() {
    navigator.serviceWorker
      .register(SW_URL, { updateViaCache: "none" })
      .then(function (reg) {
        /* First visit has no controller yet. Activate now so Add to Home
           Screen reads a rewritten start_url with index.html?join=. */
        function takeFirstInstall(worker) {
          if (!worker || navigator.serviceWorker.controller) return;
          function kick() {
            if (worker.state === "installed" && !navigator.serviceWorker.controller) {
              try { worker.postMessage({ type: "SKIP_WAITING" }); } catch (e) {}
            }
          }
          worker.addEventListener("statechange", kick);
          kick();
        }
        takeFirstInstall(reg.installing);
        takeFirstInstall(reg.waiting);
        function ping() {
          try { reg.update(); } catch (e) {}
        }
        function track(worker) {
          if (!worker) return;
          worker.addEventListener("statechange", function () {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              waitingWorker = worker;
              if (coldOpenCheck && !freshFinished) return;
              scheduleWaitingUpdate();
            }
          });
        }
        if (window.FS.Push && window.FS.Push.syncThisDevice) {
          window.FS.Push.syncThisDevice().catch(function (err) {
            if (window.FS.reportError) window.FS.reportError("push device", err);
          });
        }
        if (reg.waiting && navigator.serviceWorker.controller && !coldOpenCheck) {
          waitingWorker = reg.waiting;
        }
        pullLatestOnColdOpen(reg);
        document.addEventListener("visibilitychange", function () {
          if (hidden()) scheduleWaitingUpdate();
          else {
            cancelWaitingUpdate();
            ping();
          }
        });
        window.addEventListener("pagehide", scheduleWaitingUpdate);
        window.addEventListener("pageshow", cancelWaitingUpdate);
        window.addEventListener("focus", ping);
        setInterval(ping, POLL_MS);

        reg.addEventListener("updatefound", function () {
          track(reg.installing);
        });
      })
      .catch(function (err) {
        finishFreshBuild();
        if (window.FS && typeof window.FS.reportError === "function") {
          window.FS.reportError("service worker", err);
        }
      });
  }

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    /* First visit: worker just claimed this tab. Store the invite now —
       we do not reload while they are looking, so this was getting skipped. */
    try {
      if (window.FS && window.FS.Cloud && window.FS.Cloud.captureJoinFromUrl) {
        window.FS.Cloud.captureJoinFromUrl();
      }
    } catch (eCap) {}
    if (reloading) return;
    if (!hadController) {
      finishFreshBuild();
      return;
    }
    if (!hidden() && !takeParkedUpdate && !coldOpenCheck) return;
    reloadNow();
  });

  if (!coldOpenCheck) finishFreshBuild();
  register();
})();
