# Curiosity photos

Ready-to-use images for curiosity posts (**Grab a photo** under Content).

| File | Role |
|------|------|
| `full/*.webp` | Full post image (~1080px long edge, WebP ~q86) |
| `thumbs/*.webp` | Circle previews (~420px → cropped in UI) |
| `_source/` | Originals — local only, not shipped |

Add a new photo:

1. Drop the original into `_source/` (any filename)
2. Run `python3 scripts/export-curiosity-photos.py` (or tell Cursor)
3. Register it in `js/content.js` → `curiosityImages` with `category` and `tags`

Categories live in `curiosityImageCategories` in the same file. Search matches title, alt, tags, pairing hint, and category.
