#!/usr/bin/env python3
"""Write a real 200 page for every Fresh Grove partner link.

Instagram treats a 404 as a dead link and drops ?p= / ?with= on the way.
Crawlers do not run JavaScript, so the person's name has to be in this
file or the preview cannot say who it is.
"""

import html
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SUPABASE = "https://pqznpgqnfmnsvdgcwxiy.supabase.co"
ANON = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem5wZ3FuZm1uc3ZkZ2N3eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgyOTgsImV4cCI6MjEwMTI3NDI5OH0."
    "prNKV7vbSNVNY0sqft4EjAdNeM10bg-seOUth3pIsQA"
)
SLUG_OK = re.compile(r"^[a-z0-9][a-z0-9-]{1,38}$")

# Kept so a door is never removed if the name list is briefly unreachable.
SLUGS = [
    "abby", "alainnah", "allie", "allison-2", "allison-erickson", "amanda",
    "amanda-2", "amanda-cox", "amanda-slusarski", "amberlee", "amy", "anita",
    "annabelle", "anne", "april", "ariann", "bailee", "blake", "brennen",
    "brianna", "brittany", "brittany-2", "brittany-franklin", "brittany-tegethoff",
    "candy", "cara", "caroline-2", "cecile", "chantelle", "chrissy",
    "christina-frank", "christine", "dawn", "dayna", "deanna", "deb", "donna",
    "edina", "elise", "elizabeth", "emily", "emily-2", "emily-lucchino", "erika",
    "erin", "faith", "felicia", "freshbygrace", "geni", "hannah", "heather",
    "heather-crouch", "hollie", "ilean", "iulia", "jamie", "janis", "jayna",
    "jeanine", "jessica", "jessica-2", "jessica-3", "joan", "josie", "kaishla",
    "karen-serrano", "kasia", "kassidy", "kathleen", "kayla", "kelly",
    "kelly-amorose", "kelly-hart", "kelsey", "kim", "kimberly", "krista",
    "kristin", "laura", "lindsay", "lindsay-davis", "liz", "lori", "marcie",
    "marcy", "margaret", "mariah", "mariah-halling", "marjon", "marleen",
    "marsha", "mary", "mary-2", "megan", "meghan", "melissa", "melissa-denish",
    "melissa-ferry", "melissa-vanderburgh", "michelle", "michelle-connors",
    "monica", "morgan", "morgan-2", "nichole", "nicole", "nicole-2", "nikki",
    "patti", "rachel", "rachel-2", "rachel-johnson", "rachel-wolfe", "rainier",
    "robert", "robin", "roselyne", "sammy", "sandra", "sara", "sarah",
    "sarah-2", "sarah-angelini", "sarah-cook", "shannon", "susan-kobik", "tania", "tanya", "tara",
    "taylor", "taylor-shelf", "tessa", "tori", "traci", "tracy", "tracy-2",
    "tyler", "vanessa", "verycrunchymama", "ynes",
    "amanda-givens", "aubrie", "holistically-balanced-grace-co",
]

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="robots" content="noindex">
<meta name="description" content="{title}">
<link rel="canonical" href="https://thefreshgrove.team/{kind}/{slug}">
<link rel="icon" href="https://thefreshgrove.team/icons/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="https://thefreshgrove.team/icons/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:url" content="https://thefreshgrove.team/{kind}/{slug}">
<meta property="og:site_name" content="The Fresh Grove">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{title}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{title}">
<script>
/* Stay on /{kind}/slug. The page is painted here so the shared link
   does not hop to an address Instagram can strip the person off of. */
(function () {{
  fetch("/lead.html", {{ credentials: "same-origin", cache: "no-store" }}).then(function (res) {{
    if (!res.ok) throw new Error("missing");
    return res.text();
  }}).then(function (html) {{
    document.open();
    document.write(html);
    document.close();
  }}).catch(function () {{}});
}})();
</script>
</head>
<body>
<p><a href="/{kind}/{slug}">{title}</a></p>
</body>
</html>
"""


def rpc(name, payload):
    req = urllib.request.Request(
        SUPABASE + "/rest/v1/rpc/" + name,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "apikey": ANON,
            "Authorization": "Bearer " + ANON,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read().decode("utf-8") or "null")


def first_name(display, slug):
    raw = str(display or "").strip()
    bit = raw.split()[0] if raw else ""
    bit = re.sub(r"[^A-Za-zÀ-ÖØ-öø-ÿ'’\-]", "", bit)
    if len(bit) >= 2 and "@" not in raw:
        return bit
    piece = re.sub(r"[^a-z]", "", str(slug or "").split("-")[0])
    if not piece:
        return ""
    return piece[:1].upper() + piece[1:]


def title_for(name):
    if name:
        return "Learn and shop Ringana with " + name
    return "Learn and shop Ringana"


def existing_slugs():
    found = set()
    for kind in ("with", "lead"):
        base = ROOT / kind
        if not base.is_dir():
            continue
        for folder in base.iterdir():
            if folder.is_dir() and SLUG_OK.match(folder.name):
                found.add(folder.name)
    return found


def cards_from_directory():
    try:
        rows = rpc("lead_share_cards", {})
    except Exception as err:
        print("lead_share_cards unavailable:", err)
        return {}
    out = {}
    if not isinstance(rows, list):
        return out
    for row in rows:
        if not isinstance(row, dict):
            continue
        slug = str(row.get("slug") or "").strip().lower()
        if not SLUG_OK.match(slug):
            continue
        out[slug] = first_name(row.get("name") or "", slug)
    return out


def card_from_page(slug):
    try:
        info = rpc("get_lead_page", {"p_slug": slug})
    except Exception:
        return ""
    if not isinstance(info, dict):
        return ""
    return first_name(info.get("display_name") or "", slug)


def write_door(kind, slug, title):
    folder = ROOT / kind / slug
    folder.mkdir(parents=True, exist_ok=True)
    body = PAGE.format(
        kind=kind,
        slug=html.escape(slug, quote=True),
        title=html.escape(title, quote=True),
    )
    path = folder / "index.html"
    if path.is_file() and path.read_text(encoding="utf-8") == body:
        return False
    path.write_text(body, encoding="utf-8")
    return True


def main():
    names = {slug: "" for slug in SLUGS}
    names.update({slug: "" for slug in existing_slugs()})
    directory = cards_from_directory()
    names.update(directory)
    missing = [slug for slug, name in names.items() if not name]
    if missing:
        with ThreadPoolExecutor(max_workers=12) as pool:
            for slug, name in zip(missing, pool.map(card_from_page, missing)):
                if name:
                    names[slug] = name
    changed = 0
    for slug in sorted(names):
        title = title_for(names[slug])
        if write_door("with", slug, title):
            changed += 1
        if write_door("lead", slug, title):
            changed += 1
    named = sum(1 for name in names.values() if name)
    print("doors", len(names), "named", named, "files changed", changed)


if __name__ == "__main__":
    main()
