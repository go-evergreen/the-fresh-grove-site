/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — SUPABASE CONFIG
   Paste your project URL + anon key from Supabase → Settings → API.
   Leave blank to use local bridge mode (same-browser demo / offline).
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

window.FS.SUPABASE = {
  /* e.g. "https://xxxx.supabase.co" */
  url: "https://pqznpgqnfmnsvdgcwxiy.supabase.co",
  /* anon / public key only — never the service role key */
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem5wZ3FuZm1uc3ZkZ2N3eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgyOTgsImV4cCI6MjEwMTI3NDI5OH0.prNKV7vbSNVNY0sqft4EjAdNeM10bg-seOUth3pIsQA",
  /* Web Push — public VAPID only. Private key is a Supabase Edge Function secret. */
  vapidPublicKey: "BFPRXGfEBWxAh0yhDEo62AW_Psg6wGYjC9H4r74B2tXNHMdBDRtTbW_jPEsiC0l4y-0LQWgk51mgDqBO3c9oaXU"
};

window.FS.supabaseConfigured = function () {
  var c = window.FS.SUPABASE || {};
  return !!(c.url && c.anonKey && c.url.indexOf("http") === 0);
};
