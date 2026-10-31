/* Old team pages used ?with= or ?p=. Those queries get stripped in
   Instagram bios and the person disappears. The real link is the path. */
(function () {
  try {
    var q = new URLSearchParams(location.search);
    var withSlug = String(q.get("with") || "").trim();
    var leadSlug = String(q.get("p") || "").trim();
    if (!withSlug && !leadSlug && location.hash) {
      var hm = String(location.hash).match(/(?:^|[?#&])(p|with)=([^&]+)/i);
      if (hm) {
        if (String(hm[1]).toLowerCase() === "with") withSlug = decodeURIComponent(hm[2] || "");
        else leadSlug = decodeURIComponent(hm[2] || "");
      }
    }
    function ok(s) {
      return /^[a-z0-9][a-z0-9-]{1,38}$/i.test(String(s || "").trim());
    }
    if (ok(withSlug)) {
      location.replace("/with/" + encodeURIComponent(withSlug.trim().toLowerCase()));
      return;
    }
    if (ok(leadSlug)) {
      location.replace("/lead/" + encodeURIComponent(leadSlug.trim().toLowerCase()));
    }
  } catch (e) {}
})();
