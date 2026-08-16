/* ═══════════════════════════════════════════════════════════
   THE FRESH GROVE — public site config
   Edit the roster here. First Seeds is not touched.
   ═══════════════════════════════════════════════════════════ */

window.GROVE = window.GROVE || {};

window.GROVE.SUPABASE = {
  url: "https://pqznpgqnfmnsvdgcwxiy.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem5wZ3FuZm1uc3ZkZ2N3eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgyOTgsImV4cCI6MjEwMTI3NDI5OH0.prNKV7vbSNVNY0sqft4EjAdNeM10bg-seOUth3pIsQA"
};

window.GROVE.SITE = {
  name: "The Fresh Grove",
  instagram: "https://instagram.com/the.fresh.grove",
  quiz: "https://go-evergreen.github.io/the-fresh-match/",
  cookieDays: 90,
  cookieName: "grove_with"
};

/* Fallback when nobody sent them. Must match a First Seeds lead_slug. */
window.GROVE.FALLBACK = {
  slug: "taylor",
  name: "Taylor",
  ig: "tay.goes.fresh"
};

/* Curated “who sent you?” list. slug = First Seeds lead page (lead.html?p=THIS). */
window.GROVE.ROSTER = [
  { slug: "taylor", name: "Taylor", ig: "tay.goes.fresh" },
  { slug: "meghan", name: "Meghan", ig: "meg.made.fresh", note: "Smallwood" }
];
