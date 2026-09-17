#!/usr/bin/env python3
"""Write real 200 pages for /with/slug and /lead/slug so Instagram
does not treat a GitHub 404 hop as a dead or homepage link."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

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
    "sarah-2", "sarah-cook", "shannon", "susan-kobik", "tania", "tanya", "tara",
    "taylor", "taylor-shelf", "tessa", "tori", "traci", "tracy", "tracy-2",
    "tyler", "vanessa", "ynes",
    "amanda-givens", "aubrie", "holistically-balanced-grace-co",
]

WITH_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Fresh Grove</title>
<meta name="robots" content="noindex">
<meta name="description" content="The Fresh Grove is a founding U.S. Ringana team. Frequent zooms, real support, and a private hub.">
<link rel="canonical" href="https://thefreshgrove.team/with/{slug}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://thefreshgrove.team/with/{slug}">
<meta property="og:title" content="The Fresh Grove">
<meta property="og:description" content="You’re not joining a company. You’re joining a grove.">
<meta property="og:image" content="https://thefreshgrove.team/assets/og-image.jpg?v=2">
<script>location.replace("/index.html?with={slug}#with={slug}");</script>
</head>
<body>
<p><a href="/index.html?with={slug}#with={slug}">Continue to The Fresh Grove</a></p>
</body>
</html>
"""

LEAD_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stay in the loop — The Fresh Grove</title>
<meta name="robots" content="noindex">
<meta name="description" content="Fresh-made, toxin-free wellness from Austria is coming to America.">
<link rel="canonical" href="https://thefreshgrove.team/lead/{slug}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://thefreshgrove.team/lead/{slug}">
<meta property="og:title" content="The Fresh Grove">
<meta property="og:description" content="Leave your info to hear first.">
<meta property="og:image" content="https://thefreshgrove.team/assets/og-image.jpg?v=2">
<script>location.replace("/lead.html?p={slug}#p={slug}");</script>
</head>
<body>
<p><a href="/lead.html?p={slug}#p={slug}">Continue to the lead page</a></p>
</body>
</html>
"""


def write_door(kind, slug, body):
    folder = ROOT / kind / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "index.html").write_text(body.format(slug=slug), encoding="utf-8")


def main():
    slugs = sorted({s.strip().lower() for s in SLUGS if s.strip()})
    for slug in slugs:
        write_door("with", slug, WITH_PAGE)
        write_door("lead", slug, LEAD_PAGE)
    print("wrote", len(slugs), "with doors and", len(slugs), "lead doors")


if __name__ == "__main__":
    main()
