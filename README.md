# The Fresh Grove — public site

A recruiting / answers page for [the.fresh.grove](https://instagram.com/the.fresh.grove). Standalone on purpose: **First Seeds is not modified.**

## Preview

```bash
cd "/Users/tayrourke/Desktop/the-fresh-grove-site"
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765).

## Who sent you?

Edit the curated list in [`js/config.js`](js/config.js):

```js
window.GROVE.ROSTER = [
  { slug: "taylor", name: "Taylor", note: "team founder" },
  { slug: "their-lead-slug", name: "First name", note: "" }
];
```

`slug` must match their First Seeds lead page (`lead.html?p=THAT`).

- Team IG bio → this site → picker
- Personal share link → `index.html?with=their-slug` (skips the picker)
- “I found the IG” → Taylor (`GROVE.FALLBACK`)

The form uses the existing public `submit_lead` function. Leads land in that partner’s Fresh Grove inbox.

## What’s here

Team page + a **tappable dummy hub** (Sprout, Learn, Calendar, Leads, Grove). Dummy names only. Not a clone of Taylor’s landing or personal lead pages. First Seeds is untouched.

## Later (not this repo)

After this page feels right: place it beside First Seeds, add a roster toggle in the hub, and a “copy team-site link” button. Until then, First Seeds stays frozen.
