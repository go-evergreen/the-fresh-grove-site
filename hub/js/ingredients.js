/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — INGREDIENT EDUCATION GUIDE
   Parsed from PRODUCT_LIB ingredient lists (INCI + common names).
   Regenerate: node scripts/build-ingredients.js
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

window.FS.INGREDIENT_ROLE_LABELS = {
  "emulsifier": "Emulsifier",
  "surfactant": "Surfactant",
  "moisturizer": "Moisturizer",
  "preservation": "Preservation",
  "antioxidant": "Antioxidant",
  "thickener": "Thickener",
  "peptide": "Peptide",
  "waters": "Water / hydrosol",
  "oils-lipids": "Oil / lipid",
  "vitamins-actives": "Vitamin / active",
  "barrier": "Barrier",
  "extracts-ferments": "Extract / ferment",
  "fragrance": "Fragrance / allergen",
  "alcohol": "Alcohol",
  "amino-nmf": "Amino / NMF",
  "hyaluronic": "Hyaluronic acid",
  "uv": "UV filter",
  "colorants": "Colorant",
  "minerals": "Mineral",
  "supplement": "Supplement",
  "other": "Other",
  "signature-nutrition": "Signature nutrition"
};

window.FS.INGREDIENT_GUIDE = {
  "version": 1,
  "disclaimer": "Partner education only — not medical or disease advice. Always check the current ingredient list and important information on ringana.com and on the product packaging.",
  "sourceNote": "Look up any ingredient to see which products use it — or browse by topic when you need the bigger picture.",
  "topics": [
    {
      "id": "upcycled",
      "aliases": [
        "upcycled",
        "upcycle",
        "upcycled ingredients",
        "second stream",
        "second-stream",
        "leftover",
        "waste",
        "fruit seeds",
        "apricot seeds",
        "apple peel",
        "sea buckthorn"
      ],
      "title": "Upcycled ingredients",
      "blurb": "Leftovers given a second life — fruit seeds, apple peel, and other second-stream actives.",
      "intro": "Some of what’s in the bottle started as leftovers from another plant process — fruit seeds after juicing, apple peel, sea buckthorn, even a plankton extract for the eye area. The plant already existed. They put it to work instead of growing something extra, or throwing it away.",
      "ringanaApproach": "Say “upcycled” when Ringana does — fruit-seed grains in the scrub, apple peel in ADDS repair, sea buckthorn and the eye-contour plankton extract. Don’t stretch every botanical into an upcycle story. Open the product if someone wants the named example.",
      "roleIds": [],
      "featuredIds": [
        "prunus-armeniaca-seed-powder",
        "rubus-idaeus-seed-powder",
        "punica-granatum-seed-powder",
        "pyrus-malus-fruit-extract",
        "hippophae-rhamnoides-extract",
        "plankton-extract"
      ],
      "featuredProductIds": [
        "fresh-scrub-face-body",
        "adds-repair",
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ],
      "ingredientIds": [
        "hippophae-rhamnoides-extract",
        "plankton-extract",
        "prunus-armeniaca-seed-powder",
        "punica-granatum-seed-powder",
        "pyrus-malus-fruit-extract",
        "rubus-idaeus-seed-powder"
      ],
      "avoidTitle": "",
      "avoidLead": "",
      "avoidInConventional": []
    },
    {
      "id": "preservatives",
      "aliases": [
        "preservative",
        "preservatives",
        "shelf life",
        "annex v",
        "freshness",
        "no preservatives",
        "synthetic preservatives",
        "rose ether",
        "phenoxyethanol"
      ],
      "title": "Preservatives & freshness",
      "blurb": "How Ringana keeps formulas safe without long-shelf synthetic preservatives.",
      "intro": "Ringana is known for freshness: small batches, shorter dating, and airless packaging — instead of loading formulas with classic synthetic preservatives so they can sit in a warehouse for years. That is not the same as “no preservation at all.” Water-based products still need a smart plan to stay safe: gentle moisturizing helpers (like pentylene glycol), ferments, alcohol in some formulas, ingredients that bind metal ions, and careful making. Clear language protects trust.",
      "ringanaApproach": "When talking about preservatives, say “no artificial preservatives” (or “no synthetic preservatives”) — never a flat “no preservatives.” When someone asks what keeps it fresh, point to batch size, dating, packaging, and the mild supporting ingredients below.",
      "roleIds": [
        "preservation",
        "alcohol"
      ],
      "featuredIds": [
        "pentylene-glycol",
        "caprylyl-glycol",
        "phenethyl-alcohol",
        "alcohol",
        "lactobacillus-ferment"
      ],
      "ingredientIds": [
        "alcohol",
        "caprylyl-glycol",
        "glucose",
        "glyceryl-caprylate",
        "lactobacillus-ferment",
        "lactobacillus-ferment-lysate",
        "pentylene-glycol",
        "phenethyl-alcohol",
        "zinc-oxide"
      ],
      "avoidTitle": "Common preservatives to avoid",
      "avoidLead": "A label-reading list for everyday skincare — education, not fear. Ringana leans on freshness instead of these long-shelf shortcuts. Always read the full ingredient list on whatever brand you’re comparing.",
      "avoidInConventional": [
        {
          "name": "Parabens",
          "examples": "Methylparaben, Ethylparaben, Propylparaben, Butylparaben, Isobutylparaben",
          "why": "Used so water-based products can sit for years. They pass through skin, and some members have hormone-like activity in lab work — the EU caps the stronger ones (propyl, butyl) and keeps them out of diaper-area products for young children. Ringana’s freshness model is built so it doesn’t rely on this family."
        },
        {
          "name": "Phenoxyethanol",
          "examples": "Phenoxyethanol, Rose ether",
          "why": "A very common synthetic preservative — including in many “clean-ish” formulas. It’s processed with ethylene oxide (same family of manufacturing as ethoxylated ingredients). The EU caps it at 1% as a preservative. If someone is comparing labels, this is one of the first words (or “rose ether”) to spot — and exactly the long-shelf shortcut Ringana chooses not to build around."
        },
        {
          "name": "Formaldehyde releasers",
          "examples": "DMDM hydantoin, Diazolidinyl urea, Imidazolidinyl urea, Quaternium-15, 2-Bromo-2-nitropropane-1,3-diol (Bronopol), Sodium hydroxymethylglycinate, Methenamine",
          "why": "Preservatives that slowly release formaldehyde to keep products sterile over long storage. A frequent “hard no” for people who read labels — formaldehyde is a known sensitizer even at low levels — and not part of Ringana’s freshness approach."
        },
        {
          "name": "Isothiazolinones",
          "examples": "Methylisothiazolinone (MIT), Methylchloroisothiazolinone (CMIT/MI), Benzisothiazolinone",
          "why": "Strong synthetic preservatives and frequent contact allergens (MIT was Allergen of the Year). The EU bars MIT from leave-on cosmetics and keeps a very low cap in rinse-off. Another long-shelf tool Ringana doesn’t use as its freshness plan."
        },
        {
          "name": "Benzalkonium chloride",
          "examples": "Benzalkonium chloride, BAK",
          "why": "A disinfectant-style preservative and known skin, eye, and airway irritant. Common in household products; a poor fit for everyday leave-on care. Not part of Ringana’s approach."
        },
        {
          "name": "Iodopropynyl butylcarbamate (IPBC)",
          "examples": "Iodopropynyl butylcarbamate, IPBC",
          "why": "A synthetic preservative and a known contact allergen, even at low levels. Another long-shelf tool — not Ringana’s freshness plan."
        },
        {
          "name": "EDTA chelators",
          "examples": "Disodium EDTA, Tetrasodium EDTA, Calcium disodium EDTA",
          "why": "Not a preservative on their own — they bind metals so a long-shelf formula stays stable. Ringana uses sodium phytate (rice bran) for that job."
        },
        {
          "name": "Triclosan / triclocarban",
          "examples": "Triclosan, Triclocarban",
          "why": "Antimicrobial agents once common in “antibacterial” washes and some personal care. Heavily scrutinized for hormone-activity questions and restricted in many markets — not aligned with a fresh, readable formula philosophy."
        },
        {
          "name": "Long undated / multi-year shelf formulas",
          "examples": "Products designed to survive years in warehouses with no clear fresh-dating story",
          "why": "Not an ingredient name — a systems clue. Very long dating usually means a heavier preservative plan. Ringana flips that: small batches, shorter dating, airless packaging, and mild supporting ingredients instead."
        },
        {
          "name": "“Preservative-free” as a blank claim",
          "examples": "Marketing language with no explanation of dating, packaging, or how the formula stays safe",
          "why": "Often fog. Water-based products need a stability plan. Ask what’s actually in the bottle, how long it’s meant to last after opening, and whether “preservative-free” means “no synthetic preservatives” or something vaguer."
        }
      ]
    },
    {
      "id": "emulsifiers",
      "aliases": [
        "emulsifier",
        "emulsifiers",
        "emulsion",
        "peg",
        "ethoxylated",
        "polysorbate",
        "polysorbates"
      ],
      "title": "Emulsifiers",
      "blurb": "What keeps oil and water blended in creams and lotions.",
      "intro": "Emulsifiers help oil and water stay together so a cream feels even from the first pump to the last. On Ringana labels they’re often called out plainly — “natural emulsifier from rapeseed oil,” “olive-derived emulsifier,” and so on.",
      "ringanaApproach": "A readable emulsifier is a teaching moment: it’s not a red flag by default — it’s how leave-on textures work. Invite people to compare the source language on the label. Ethoxylated names (PEG-, laureth / ceteareth / oleth, polysorbate) are a different conversation — see below.",
      "roleIds": [
        "emulsifier"
      ],
      "featuredIds": [
        "glyceryl-stearate-citrate",
        "cetearyl-olivate",
        "sorbitan-olivate",
        "xylose"
      ],
      "ingredientIds": [
        "cetearyl-glucoside",
        "cetearyl-olivate",
        "diisostearoyl-polyglyceryl-3-dimer-dilinoleate",
        "glyceryl-caprylate",
        "glyceryl-stearate",
        "glyceryl-stearate-citrate",
        "hydrogenated-olive-oil-stearyl-esters",
        "lecithin",
        "polyglyceryl-2-dipolyhydroxystearate",
        "polyglyceryl-3-cocoate",
        "polyglyceryl-3-diisostearate",
        "polyglyceryl-3-oleate",
        "polyglyceryl-3-palmitate",
        "polyglyceryl-3-polyricinoleate",
        "polyglyceryl-3-sorbityl-linseedate",
        "polyglyceryl-4-caprate",
        "polyglyceryl-4-diisostearate-polyhydroxystearate-sebacate",
        "polyglyceryl-4-diisostearate-polyhydroxystearate-sebacate-2",
        "polyglyceryl-4-olivate-polyricinoleate",
        "polyglyceryl-6-pentaoleate",
        "polyglyceryl-6-stearate",
        "sodium-stearoyl-glutamate",
        "sorbitan-olivate",
        "sucrose-stearate",
        "xylose"
      ],
      "avoidTitle": "Emulsifiers to watch for",
      "avoidLead": "Names you’ll see on a lot of conventional creams. Readable plant emulsifiers are a different conversation.",
      "avoidInConventional": [
        {
          "name": "Ethoxylated emulsifiers",
          "examples": "PEG-100 stearate, PEG-40 hydrogenated castor oil, Ceteareth-20, Laureth-4, Steareth-20, Polysorbate-20 / 60 / 80, Glyceryl stearate SE",
          "why": "Look for PEG- and the -eth family (laureth, ceteareth, oleth, steareth), plus polysorbates. “SE” next to glyceryl stearate often means a PEG helper is built in. Cetearyl alcohol and phenethyl alcohol (rose alcohol on some Ringana labels) are not that family — don’t flag those. Ringana leans polyglyceryl, sugar, and olive-derived emulsifiers instead."
        },
        {
          "name": "Silicone emulsifiers",
          "examples": "Cetyl PEG/PPG-10/1 dimethicone, PEG-10 dimethicone, PEG/PPG-18/18 dimethicone",
          "why": "Common in foundations and sunscreens to keep oil and water mixed. PEG in the name is the same ethoxylated tell as above. Ringana names plant emulsifiers in plain language instead."
        },
        {
          "name": "TEA / amine cream systems",
          "examples": "Triethanolamine, TEA-stearate, TEA-lauryl sulfate",
          "why": "Older cream and cleanser systems. Look for MEA, DEA, or TEA. Some can form nitrosamines depending on the rest of the formula. Ringana uses named plant emulsifiers instead."
        },
        {
          "name": "Mystery “emulsifying wax” with no source story",
          "examples": "Emulsifying wax, Emulsifying wax NF (no plant named)",
          "why": "Not automatically harmful — just a black box. Ringana tends to name the plant: rapeseed, olive, sugar, sunflower."
        }
      ]
    },
    {
      "id": "surfactants",
      "aliases": [
        "surfactant",
        "surfactants",
        "tenside",
        "tensides",
        "cleanser",
        "cleansing",
        "sulfate",
        "sulfates",
        "sls",
        "sles"
      ],
      "title": "Surfactants / tensides",
      "blurb": "The gentle cleansers that lift dirt and makeup.",
      "intro": "Surfactants (tensides) help water mix with oils and impurities so rinsing actually cleans. Ringana often uses sugar-based glucosides and similarly mild systems — especially in face and body wash.",
      "ringanaApproach": "When someone fears “sulfates” as a category, bring it back to the specific INCI. Mild sugar tensides are a different conversation than SLS — and SLES is a different conversation than SLS.",
      "roleIds": [
        "surfactant"
      ],
      "featuredIds": [
        "decyl-glucoside",
        "heptyl-glucoside",
        "coco-glucoside",
        "disodium-cocoyl-glutamate"
      ],
      "ingredientIds": [
        "arachidyl-glucoside",
        "cetearyl-glucoside",
        "coco-glucoside",
        "coco-glucoside-2",
        "decyl-glucoside",
        "disodium-cocoyl-glutamate",
        "heptyl-glucoside",
        "lauryl-glucoside"
      ],
      "avoidTitle": "Cleansers to watch for",
      "avoidLead": "Match the cleanser to the job. Read the INCI — not the “sulfate-free” claim.",
      "avoidInConventional": [
        {
          "name": "Sodium lauryl sulfate (SLS)",
          "examples": "Sodium lauryl sulfate, Sodium coco sulfate",
          "why": "A strong detergent cleanser, common in foaming washes. Face and baby care don’t need this strength. Ringana uses milder sugar tensides (glucosides)."
        },
        {
          "name": "Sodium laureth sulfate (SLES)",
          "examples": "Sodium laureth sulfate, Ammonium laureth sulfate",
          "why": "Still a strong wash. The “-eth” in laureth is the tell: it’s ethoxylated (same family as ceteareth / oleth). Not the same as cetearyl alcohol. See Emulsifiers for the leave-on version of this conversation."
        },
        {
          "name": "Strong “sulfate-free” detergents",
          "examples": "Sodium C14-16 olefin sulfonate, Sodium lauryl sulfoacetate, Sodium coco sulfate",
          "why": "Sulfate-free on the bottle can still mean a strong detergent. Read the INCI, not the claim. Ringana uses glucosides and similarly mild systems."
        },
        {
          "name": "Cocamidopropyl betaine",
          "examples": "Cocamidopropyl betaine, CAPB",
          "why": "A very common foam helper in shampoos and body wash. Often on “gentle” labels; still worth reading if someone is sensitive. Not the same as a sugar tenside."
        }
      ]
    },
    {
      "id": "moisturizers",
      "aliases": [
        "moisturizer",
        "moisturiser",
        "moisturizers",
        "moisturisers",
        "humectant",
        "humectants",
        "hydration",
        "glycerin"
      ],
      "title": "Moisturizers / humectants",
      "blurb": "Ingredients that bind and hold water in skin and formulas.",
      "intro": "Humectants attract and hold water. You’ll see glycerin, pentylene glycol, sodium lactate, hyaluronic acid forms, and related moisturizing agents across the library.",
      "ringanaApproach": "Great teaching category for dry / dehydrated skin conversations — pair with barrier lipids when someone needs both water and seal.",
      "roleIds": [
        "moisturizer",
        "hyaluronic",
        "amino-nmf"
      ],
      "featuredIds": [
        "glycerin",
        "pentylene-glycol",
        "sodium-hyaluronate",
        "hydrolysed-hyaluronic-acid",
        "sodium-lactate",
        "betaine"
      ],
      "ingredientIds": [
        "2-heptanediol",
        "2-hexanediol",
        "anhydroxylitol",
        "arachidyl-glucoside",
        "arginine",
        "arginine-moisturizing-amino-acid",
        "arginine-lysine-polypeptide",
        "betaine",
        "caprylyl-glycol",
        "capsule-casing",
        "carnosine",
        "decyl-cocoate",
        "diglycerin",
        "disodium-cocoyl-glutamate",
        "gluconolactone",
        "glucose",
        "glutamine",
        "glycerin",
        "hydrolysed-hyaluronic-acid",
        "hydrolyzed-hyaluronic-acid",
        "isosorbide-dicaprylate",
        "liquid-food-supplement-with-a-vegan-amino-acid-mixture",
        "olea-europaea-leaf-extract",
        "oligopeptide-1",
        "palmitic-acidarginine",
        "pca-glyceryl-oleate",
        "pentylene-glycol",
        "polyglycerin-3",
        "potassium-lactate",
        "propanediol",
        "prunus-persica-bud-extract",
        "saccharide-isomerate",
        "sodium-acetylated-hyaluronate",
        "sodium-hyaluronate",
        "sodium-lactate",
        "sodium-pca",
        "sodium-salt-from-hyaluronic-acid",
        "the-amino-acid-l-carnosine",
        "vegan-amino-acid-mixture",
        "vitamins-and-hyaluronic-acid-ingredients-water",
        "with-amino-acid-l-tryptophan-and-natural-vitamin-c-ingredients-water",
        "xylitol",
        "xylitylglucoside",
        "zinc-pca"
      ],
      "avoidTitle": "Humectants to watch for",
      "avoidLead": "Water-binders aren’t automatically a problem. These are the conventional shortcuts worth reading.",
      "avoidInConventional": [
        {
          "name": "PEG humectants",
          "examples": "PEG-8, PEG-32, PEG-400",
          "why": "Used to hold water — and ethoxylated (same PEG- tell as emulsifiers). Ringana uses glycerin, pentylene glycol, and hyaluronic acid forms instead. See Emulsifiers."
        }
      ]
    },
    {
      "id": "oils-lipids",
      "aliases": [
        "oil",
        "oils",
        "butter",
        "butters",
        "lipid",
        "lipids",
        "squalane",
        "almond",
        "nut",
        "sunflower",
        "helianthus",
        "canola",
        "rapeseed",
        "flax",
        "linseed",
        "grapeseed",
        "grape"
      ],
      "title": "Oils, butters & lipids",
      "blurb": "Plant oils, butters, and skin lipids that soften and seal.",
      "intro": "Emollients and lipids soften, reduce water loss, and support barrier feel — from almond and macadamia oils to squalane, shea, and ceramides.",
      "ringanaApproach": "Allergy goldmine: search almond, macadamia, or wheat-derived notes here. Always send people back to the current INCI on packaging for sensitivities.",
      "roleIds": [
        "oils-lipids",
        "barrier"
      ],
      "featuredIds": [
        "squalanes",
        "squalane",
        "prunus-amygdalus-dulcis-oil",
        "macadamia-ternifolia-seed-oil",
        "ceramide-np",
        "ceramide-ap"
      ],
      "ingredientIds": [
        "acacia-decurrens-flower-cera",
        "adansonia-digitata-pulp-extract",
        "adansonia-digitata-seed-oil",
        "arachidyl-alcohol",
        "astrocaryum-tucuma-seed-butter",
        "avena-sativa-kernel-oil",
        "backhousia-citriodora-leaf-oil",
        "behenyl-alcohol",
        "borago-officinalis-seed-oil",
        "brassica-campestris-aleurites-fordi-oil-copolymer",
        "butyrospermum-parkii-butter",
        "caprylic-capric-triglyceride",
        "carthamus-tinctorius-seed-oil",
        "castor-oil-ipdi-copolymer",
        "centella-asiatica-leaf-extract",
        "ceramide-ap",
        "ceramide-eop",
        "ceramide-np",
        "ceramide-ns",
        "cetyl-alcohol",
        "cholesterol",
        "coco-caprylate",
        "coco-caprylate-caprate-2",
        "coco-glucoside-2",
        "cocoglycerides",
        "cocos-nucifera-oil",
        "copernicia-cerifera-cera",
        "dicaprylyl-ether",
        "dilinoleic-acid-butanediol-copolymer",
        "glazing-agent-carnauba-wax",
        "glyceryl-behenate",
        "glyceryl-caprylate",
        "glyceryl-stearate-citrate",
        "glycine-soja-oil",
        "glycolipids",
        "glycosphingolipids",
        "gossypium-herbaceum-seed-oil",
        "helianthus-annuus-seed-cera",
        "helianthus-annuus-seed-oil",
        "helianthus-annuus-seed-oil-unsaponifiables",
        "heptyl-undecylenate",
        "hydrogenated-castor-oil-sebacic-acid-copolymer",
        "hydrogenated-ethylhexyl-olivate",
        "hydrogenated-olive-oil",
        "hydrogenated-olive-oil-stearyl-esters",
        "hydrogenated-olive-oil-unsaponifiables",
        "hydrogenated-rapeseed-oil",
        "isoamyl-laurate",
        "jojoba-esters",
        "lecithin",
        "lecythis-minor-seed-oil",
        "lemon-oil",
        "leptospermum-scoparium-branch-leaf-oil",
        "limnanthes-alba-seed-oil",
        "macadamia-integrifolia-tetraphylla-seed-oil",
        "macadamia-ternifolia-seed-oil",
        "mangifera-indica-seed-butter",
        "mauritia-flexuosa-fruit-oil",
        "mentha-spicata-herb-oil",
        "microencapsulated-sage-complex",
        "millet-seed-oil",
        "moringa-oleifera-seed-extract",
        "nigella-sativa-seed-oil",
        "oenothera-biennis-oil",
        "olea-europaea-oil-unsaponifiables",
        "olive-oil-decyl-esters",
        "opuntia-ficus-indica-seed-oil",
        "phytosterols",
        "phytosteryl-sunflowerseedate",
        "plukenetia-volubilis-seed-oil",
        "polyglyceryl-3-polyricinoleate",
        "polyglyceryl-3-sorbityl-linseedate",
        "polyglyceryl-6-pentaoleate",
        "potassium-cocoate",
        "potassium-olivate",
        "prunus-amygdalus-dulcis-oil",
        "punica-granatum-seed-oil",
        "resveratrol",
        "rhus-verniciflua-peel-cera",
        "ribes-nigrum-seed-oil",
        "rice-bran-oil-extract",
        "rosa-damascena-flower-cera",
        "rosa-damascena-flower-oil",
        "rose-flower-oil-extract",
        "rubus-chamaemorus-seed-oil",
        "salvia-hispanica-seed-extract",
        "sambucus-nigra-seed-oil",
        "sea-buckthorn-seed-and-berry-oil",
        "sesamum-indicum-seed-oil",
        "shea-butter-ethyl-esters",
        "simmondsia-chinensis-seed-oil",
        "sodium-cocoate",
        "sodium-olivate",
        "squalane",
        "squalanes",
        "theobroma-cacao-seed-butter",
        "theobroma-grandiflorum-seed-butter",
        "trihydroxystearin",
        "triticum-vulgare-aestivum-grain-extract",
        "vaccinium-macrocarpon-seed-oil",
        "vitamin-e-and-secondary-plant-substances-ingredients-dha-and-epa-rich-oil-from-t",
        "vitis-vinifera-seed-oil",
        "wheat-seed-lipid-extract-triticum-vulgare-gluten-free",
        "zinc-and-selenium-ingredients-lipid-complex-from-fenugreek-seed-extract"
      ],
      "avoidTitle": "Oils & coatings to watch for",
      "avoidLead": "What conventional formulas often use instead of named plant oils.",
      "avoidInConventional": [
        {
          "name": "Mineral oil / petrolatum",
          "examples": "Paraffinum liquidum, mineral oil, petrolatum, petroleum jelly",
          "why": "A petroleum-derived occlusive. Ringana uses plant oils and barrier lipids with a clearer plant story."
        },
        {
          "name": "Silicones",
          "examples": "Dimethicone, Cyclopentasiloxane, Cyclomethicone, Dimethicone copolyol",
          "why": "A synthetic slip layer, common in creams and hair care. Ringana uses plant oils and lipids instead — baby sun care says no silicones out loud."
        }
      ]
    },
    {
      "id": "waters",
      "aliases": [
        "water",
        "waters",
        "hydrosol",
        "hydrosols",
        "aqua",
        "aloe"
      ],
      "title": "Waters & hydrosols",
      "blurb": "Aqua plus fruit and flower waters that often lead the list.",
      "intro": "Many Ringana formulas open with fruit or flower waters (hydrosols) and aqua — not just “water” as filler. That’s part of why the first lines of the INCI feel readable.",
      "ringanaApproach": "Show a label: orange hydrosol, rose water, aloe juice. It’s an easy “this list makes sense” moment.",
      "roleIds": [
        "waters"
      ],
      "featuredIds": [
        "aqua",
        "citrus-aurantium-dulcis-fruit-water",
        "rosa-damascena-flower-water",
        "aloe-barbadensis-leaf-juice"
      ],
      "ingredientIds": [
        "actinidia-chinensis-fruit-water",
        "aloe-barbadensis-leaf-juice",
        "aqua",
        "centaurea-cyanus-flower-water",
        "citrus-aurantium-dulcis-fruit-water",
        "cucumis-sativus-fruit-water",
        "maris-aqua",
        "nelumbo-nucifera-root-water",
        "nepeta-cataria-water",
        "prunus-cerasus-fruit-water",
        "pyrus-malus-fruit-water",
        "rosa-damascena-flower-water",
        "santalum-spicatum-wood-water"
      ],
      "avoidTitle": "",
      "avoidLead": "",
      "avoidInConventional": []
    },
    {
      "id": "extracts",
      "aliases": [
        "extract",
        "extracts",
        "ferment",
        "ferments",
        "botanical",
        "botanicals",
        "postbiotic",
        "licorice",
        "liquorice"
      ],
      "title": "Extracts, ferments & botanicals",
      "blurb": "Plant extracts, ferments, and cultured actives.",
      "intro": "A large share of the library is botanical extracts, ferments, and cell-culture lysates — the “why is this here?” story behind calming, antioxidant, and microbiome-minded care.",
      "ringanaApproach": "Don’t overclaim every extract. Point to the hero ingredients on the product page, then let the full INCI show the supporting cast.",
      "roleIds": [
        "extracts-ferments"
      ],
      "featuredIds": [
        "lactobacillus-ferment"
      ],
      "ingredientIds": [
        "acmella-oleracea-extract",
        "adansonia-digitata-pulp-extract",
        "aesculus-hippocastanum-seed-extract",
        "ajuga-reptans-extract-from-cell-cultures",
        "algae-powder-and-algae-extract",
        "anetholea-anisata-leaf-extract",
        "apple-extract",
        "apple-fruit-extract",
        "apple-juice-concentrate",
        "aronia-juice-concentrate",
        "artichoke-leaf-and-flower-extract",
        "ashwagandha-root-extract",
        "asparagopsis-armata-extract",
        "astaxanthin",
        "astragalus-membranaceus-root-extract",
        "aureobasidium-pullulans-ferment",
        "avena-sativa",
        "avena-sativa-kernel-oil",
        "avena-sativa-seed-extract",
        "b-vitamins-and-secondary-plant-substances-ingredients-orange-peel-extract",
        "bacillus-ferment",
        "bambusa-arundinacea-leaf-extract",
        "beta-vulgaris-root-extract",
        "black-elderberry-extract",
        "blood-orange-extract",
        "blueberry-extract",
        "boswellia-serrata-gum",
        "boswellia-serrata-resin-extract",
        "calendula-officinalis-flower-extract",
        "camellia-sinensis-leaf-extract",
        "camellia-sinensis-seed-extract",
        "cardiospermum-halicacabum-flower-leaf-vine-extract",
        "centella-asiatica-leaf-extract",
        "cetraria-islandica-thallus-extract",
        "choline-and-zinc-ingredients-enzyme-complex-from-fermentation",
        "cistus-incanus-flower-leaf-stem-extract",
        "citicoline-and-b-vitamins-from-buckwheat-germ-ingredients-grape-and-blueberry-ex",
        "citrullus-lanatus-fruit-extract",
        "citrus-paradisi-fruit-extract",
        "cleome-gynandra-leaf-extract",
        "cocoa-bean-extract",
        "codium-tomentosum-extract",
        "coleus-root-extract",
        "common-wheat-extract",
        "concentrated-monk-fruit-extract",
        "cordyceps-militaris-extract",
        "coriandrum-sativum-fruit-extract",
        "cranberry-and-coleus-root-extract",
        "cranberry-extract",
        "crataegus-monogyna-flower-extract",
        "cucurbita-pepo-seed-extract",
        "cupressus-sempervirens-cone-extract",
        "curcuma-longa-root-extract",
        "damiana-leaf-extract",
        "dandelion-leaf-and-root-extract",
        "encapsulated-melon-juice-concentrate-enzymatically-fermented-guar-bean-fibre",
        "encapsulated-melon-juice-concentrate-enzymatically-fermented-guar-gum",
        "enzymatically-fermented-guar-bean-fibre",
        "enzymatically-fermented-guar-gum",
        "epilobium-fleischeri-leaf-stem-extract",
        "equisetum-arvense-extract",
        "fagus-sylvatica-bud-extract",
        "fermented-ginger-extract",
        "fibre-and-vitamins-ingredients-enzymatically-fermented-guar-bean-fibre",
        "field-horsetail-leaf-extract",
        "food-supplement-based-on-vegan-protein-with-hesperidin-from-watts-up-orange-extr",
        "food-supplement-with-fruit-powder-and-extracts",
        "frankincense-resin-extract",
        "fucoidan-extract-from-the-seaweed-undaria-pinnatifida",
        "galangal-root-extract",
        "ganoderma-lucidum-extract",
        "ginger-extract",
        "ginkgo-biloba-leaf-extract",
        "ginseng-root-extract",
        "gleditsia-triacanthos-seed-extract",
        "globularia-alypum-leaf-extract",
        "glycyrrhiza-glabra-root-extract",
        "gossypium-arboreum-leaf-cell-extract",
        "gossypium-herbaceum-callus-culture",
        "gossypium-herbaceum-leaf-cell-extract",
        "gotu-kola-extract",
        "grape-flesh-and-apple-peel-extract",
        "grape-seed-and-skin-extract",
        "green-oat-extract",
        "green-tea-extract",
        "guarana-seed-extract",
        "gynostemma-pentaphyllum-leaf-stem-extract",
        "haematococcus-pluvialis-extract",
        "hamamelis-virginiana-leaf-extract",
        "herbal-extracts",
        "hericium-erinaceum-extract",
        "hibiscus-abelmoschus-seed-extract",
        "hibiscus-flower-extract",
        "hibiscus-sabdariffa-flower-extract",
        "hippophae-rhamnoides-extract",
        "honeybush-leaf-extract",
        "hop-blossom-extract",
        "hydrolysed-walnut-extract",
        "hydrolyzed-acacia-macrostachya-seed-extract",
        "hydrolyzed-pea-extract",
        "hydrolyzed-walnut-extract",
        "hypericum-perforatum-flower-leaf-stem-extract",
        "inonotus-obliquus-extract",
        "jasminum-sambac-flower-extract",
        "lactobacillus-ferment",
        "lactobacillus-ferment-lysate",
        "lamium-album-extract",
        "lemon-balm-extract",
        "lemon-balm-leaf-extract",
        "lemon-juice-concentrate",
        "lemon-juice-powder",
        "lemon-verbena-extract",
        "lemon-verbena-leaf-and-hibiscus-flower-extract",
        "lentinus-edodes-extract",
        "leuconostoc-radish-root-ferment-filtrate",
        "lime-extract",
        "lonicera-caprifolium-flower-extract",
        "lonicera-japonica-flower-extract",
        "maclura-cochinchinensis-leaf-prenylflavonoids",
        "magnesium-oxide-from-sea-water",
        "magnolia-officinalis-bark-extract",
        "mandarin-juice-concentrate",
        "maqui-berry-extract",
        "maracuja-juice-concentrate",
        "marigold-flower-extract",
        "maritime-pine-bark-extract",
        "marrubium-vulgare-extract",
        "mate-leaf-extract",
        "melilotus-officinalis-extract",
        "melon-juice-concentrate-cucumis-melo",
        "mentha-haplocalix-extract",
        "microencapsulated-sage-complex",
        "milk-thistle-phospholipid-complex",
        "morinda-citrifolia-callus-culture-lysate",
        "moringa-oleifera-seed-extract",
        "morus-alba-leaf-extract",
        "myrothamnus-flabellifolia-leaf-stem-extract",
        "oak-extract",
        "olea-europaea-callus-culture-lysate",
        "olea-europaea-leaf-extract",
        "orange-extract",
        "orange-juice-concentrate",
        "orthosiphon-stamineus-leaf-extract",
        "oryza-sativa-bran-water",
        "panax-ginseng-root-extract",
        "papaya-extract",
        "passion-flower-extract",
        "passion-fruit-juice-powder",
        "pea-sprout-extract",
        "phaseolus-radiatus-meristem-cell-culture-extract",
        "pineapple-juice-concentrate",
        "pinus-pinaster-bark-extract",
        "plankton-extract",
        "plant-extracts",
        "plantago-psyllium-seed-extract",
        "plus-natural-vitamin-e-and-vitamin-b12-ingredients-soya-bean-extract",
        "polypodium-vulgare-rhizome-extract",
        "polyporus-umbellatus-extract",
        "populus-tremuloides-bark-extract",
        "porphyridium-cruentum-culture-conditioned-media",
        "porphyridium-cruentum-extract",
        "prickly-pear-fruit-juice-powder",
        "prunus-persica-bud-extract",
        "prunus-persica-leaf-extract",
        "psidium-guajava-leaf-extract",
        "pyrus-malus-fruit-extract",
        "quince-juice-concentrate",
        "reishi-mushroom-extract",
        "rhodiola-rosea-extract",
        "rhododendron-ferrugineum-extract",
        "rice-bran-extract",
        "rice-bran-oil-extract",
        "rooibos-leaf-extract",
        "rose-flower-oil-extract",
        "rose-hip-juice-concentrate",
        "rosemary-extract",
        "rosemary-leaf-extract",
        "rosmarinus-officinalis-leaf-extract",
        "rubus-idaeus-fruit-extract",
        "ruscus-aculeatus-extract",
        "saccharomyces-lysate-extract",
        "saccharomyces-coix-lacryma-jobi-ma-yuen-seed-ferment-filtrate",
        "saccharomyces-rice-ferment-filtrate",
        "saffron-extract-crocus-sativus",
        "salix-alba-bark-extract",
        "salvia-hispanica-seed-extract",
        "salvia-triloba-leaf-extract",
        "sambucus-nigra-fruit-extract",
        "schisandra-berry-extract",
        "sea-buckthorn-berry-extract",
        "selaginella-lepidophylla-extract",
        "shatavari-root-extract",
        "silver-ear-mushroom-extract",
        "simmondsia-chinensis-seed-extract",
        "sodium-phytate",
        "sour-cherry-juice-concentrate",
        "sphagnum-magellanicum-extract",
        "spilanthes-acmella-flower-leaf-stem-extract",
        "sweet-cherry-juice-concentrate",
        "symphytum-officinale-root-extract",
        "tasmannia-lanceolata-leaf-extract",
        "thymus-vulgaris-flower-leaf-extract",
        "tilia-tomentosa-bud-extract",
        "trametes-versicolor-extract",
        "tremella-fuciformis-sporocarp-extract",
        "triticum-vulgare-aestivum-grain-extract",
        "turmeric-root-extract",
        "vanilla-planifolia-fruit-extract",
        "vegetable-oils-and-extracts",
        "vitamin-c-and-the-minerals-zinc-and-copper-ingredients-polypodiutomom-leucas-lea",
        "vitamin-d3-cholecalciferol-from-lichen-extract",
        "vitamin-k2",
        "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-enzymatically-ferme",
        "vitis-vinifera-fruit-extract",
        "vitis-vinifera-leaf-extract",
        "wheat-seed-lipid-extract-triticum-vulgare-gluten-free",
        "winter-linden-blossom-extract",
        "yellow-gentian-root-extract",
        "zinc-and-chromium-ingredients-water",
        "zinc-and-selenium-ingredients-lipid-complex-from-fenugreek-seed-extract",
        "zingiber-officinale-root-extract"
      ],
      "avoidTitle": "",
      "avoidLead": "",
      "avoidInConventional": []
    },
    {
      "id": "peptides-actives",
      "aliases": [
        "peptide",
        "peptides",
        "active",
        "actives",
        "bakuchiol",
        "retinol"
      ],
      "title": "Peptides & targeted actives",
      "blurb": "Peptides, bakuchiol, and other targeted performance ingredients.",
      "intro": "Peptides and targeted actives are where performance conversations live — firming, expression lines, renewal. Bakuchiol shows up when people ask about retinol alternatives.",
      "ringanaApproach": "For pregnancy / breastfeeding questions: don’t play doctor — send the full current INCI and suggest they check with their clinician. Precision over guesses.",
      "roleIds": [
        "peptide"
      ],
      "featuredIds": [
        "bakuchiol",
        "acetyl-hexapeptide-8",
        "palmitoyl-tripeptide-38",
        "hexapeptide-11"
      ],
      "ingredientIds": [
        "acetyl-hexapeptide-1",
        "acetyl-hexapeptide-8",
        "acetyl-tetrapeptide-2",
        "acetyl-tetrapeptide-5",
        "arginine-lysine-polypeptide",
        "bakuchiol",
        "bis",
        "carnosine",
        "dipeptide-diaminobutyroyl-benzylamide-diacetate",
        "dipeptide-2",
        "glutathione",
        "hexapeptide-11",
        "hydrolyzed-acacia-macrostachya-seed-extract",
        "n-prolyl-palmitoyl-tripeptide-56-acetate",
        "oligopeptide-1",
        "palmitoyl-tetrapeptide-7",
        "palmitoyl-tripeptide-1",
        "palmitoyl-tripeptide-2palmitoyl-tetrapeptide-7",
        "palmitoyl-tripeptide-38"
      ],
      "avoidTitle": "",
      "avoidLead": "",
      "avoidInConventional": []
    },
    {
      "id": "vitamins",
      "aliases": [
        "vitamin",
        "vitamins",
        "antioxidant",
        "antioxidants",
        "vitamin c",
        "vitamin e",
        "niacinamide",
        "b3"
      ],
      "title": "Vitamins & antioxidants",
      "blurb": "Vitamin C forms, B3, E, and antioxidant plant compounds.",
      "intro": "Vitamins and antioxidants support brightness, defense against oxidative stress, and everyday glow language — especially meaningful when formulas are made fresh.",
      "ringanaApproach": "Freshness matters here: some vitamins are famously unstable in old warehouse stock. That’s a natural bridge to Ringana’s dating story.",
      "roleIds": [
        "vitamins-actives",
        "antioxidant",
        "hyaluronic"
      ],
      "featuredIds": [
        "niacinamide",
        "3-o-ethyl-ascorbic-acid",
        "ascorbic-acid",
        "tocopherol",
        "sodium-hyaluronate"
      ],
      "ingredientIds": [
        "2-heptanediol",
        "3-o-ethyl-ascorbic-acid",
        "acerola-cherry-powder",
        "and-vitamin-c-ingredients-highly-branched-maltodextrin",
        "ascorbic-acid",
        "ascorbyl-palmitate",
        "b-vitamins-and-secondary-plant-substances-ingredients-orange-peel-extract",
        "bakuchiol",
        "cistus-incanus-flower-leaf-stem-extract",
        "citicoline-and-b-vitamins-from-buckwheat-germ-ingredients-grape-and-blueberry-ex",
        "coriandrum-sativum-fruit-extract",
        "d-biotin-gluten-free",
        "fibre-and-vitamins-ingredients-enzymatically-fermented-guar-bean-fibre",
        "hydrolysed-hyaluronic-acid",
        "hydrolyzed-hyaluronic-acid",
        "kaolin",
        "maclura-cochinchinensis-leaf-prenylflavonoids",
        "magnolia-officinalis-bark-extract",
        "marrubium-vulgare-extract",
        "natural-vitamin-d",
        "niacin-and-vitamin-d3-ingredients-d-mannose",
        "niacinamide",
        "olea-europaea-leaf-extract",
        "oligopeptide-1",
        "plus-natural-vitamin-e-and-vitamin-b12-ingredients-soya-bean-extract",
        "psidium-guajava-leaf-extract",
        "raspberry-ketone",
        "resveratrol",
        "retinal",
        "rosmarinus-officinalis-leaf-extract",
        "sambucus-nigra-fruit-extract",
        "sodium-acetylated-hyaluronate",
        "sodium-hyaluronate",
        "sodium-phytate",
        "sodium-salt-from-hyaluronic-acid",
        "tasmannia-lanceolata-leaf-extract",
        "tocopherol",
        "ubiquinone",
        "vanilla-planifolia-fruit-extract",
        "vitamin-b12-methylcobalamin",
        "vitamin-b12-methylcobalamin-contains-negligible-amounts-of-iodine",
        "vitamin-b2",
        "vitamin-c",
        "vitamin-c-and-l-theanine-new-formulation-reduced-sugar-content-ingredients-water",
        "vitamin-c-and-minerals-ingredients-capsule-shell-hydroxypropyl-methyl-cellulose",
        "vitamin-c-and-the-minerals-zinc-and-copper-ingredients-polypodiutomom-leucas-lea",
        "vitamin-c-from-acerola",
        "vitamin-c-from-acerola-cherry-powder",
        "vitamin-d3-cholecalciferol-from-algae",
        "vitamin-d3-cholecalciferol-from-algae-gluten-free",
        "vitamin-d3-cholecalciferol-from-lichen-extract",
        "vitamin-d3-from-algae",
        "vitamin-e-and-secondary-plant-substances-ingredients-dha-and-epa-rich-oil-from-t",
        "vitamin-k",
        "vitamin-k2",
        "vitamin-k2-from-bacillus-subtilis-and-vitamin-d3-from-algae-ingredients-methylsu",
        "vitamins-and-hyaluronic-acid-ingredients-water",
        "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-calcium-citrate",
        "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-enzymatically-ferme",
        "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-raspberry-powder",
        "vitamins-and-minerals-ingredients-vegan-source-of-protein-pea-protein-isolate",
        "vitis-vinifera-fruit-extract",
        "with-amino-acid-l-tryptophan-and-natural-vitamin-c-ingredients-water"
      ],
      "avoidTitle": "Antioxidants to watch for",
      "avoidLead": "Fresh formulas don’t need the same warehouse antioxidants.",
      "avoidInConventional": [
        {
          "name": "BHA and BHT",
          "examples": "BHA (butylated hydroxyanisole), BHT (butylated hydroxytoluene)",
          "why": "Synthetic antioxidants used so oils last through long storage. Ringana uses tocopherol (vitamin E) and short dating instead."
        }
      ]
    },
    {
      "id": "signature-nutrition",
      "aliases": [
        "signature",
        "trademarked",
        "patented",
        "branded actives",
        "supplements",
        "nutrition",
        "ahcc",
        "ksm-66",
        "omegavie",
        "omegia",
        "vecollal",
        "greeniuronic",
        "peak atp",
        "watts up",
        "m-gard",
        "quatrefolic",
        "pycnogenol",
        "lutemax",
        "kaneka",
        "caps",
        "beyond"
      ],
      "title": "Signature nutrition actives",
      "blurb": "Named actives on the supplement pages — so you can say the right name and point to the right product.",
      "intro": "Supplements often highlight branded, studied raw materials (AHCC™, KSM-66®, OMEGAVIE®, Omegia™, VeCollal®, GREENIURONIC™, Peak ATP™, WATTS’UP®, M-Gard®, and more). This topic collects those Ringana Hero Ingredient blurbs so partners can say the accurate name and point to the right product — without inventing comparative “we use more than Brand X” claims.",
      "ringanaApproach": "Lead with the named active + the Ringana product that uses it. Differentiate on the system around the active (fresh dating, clear product pages, how you teach it) — not on invented dose superiority. For manufacturer background, only use the official brand site linked on the ingredient when present. Always re-check ringana.com and the pack before you teach.",
      "roleIds": [
        "signature-nutrition"
      ],
      "featuredIds": [
        "sig-ahcc",
        "sig-applephenon",
        "sig-apresflex",
        "sig-astafit",
        "sig-cacti-nea",
        "sig-cultavit",
        "sig-curcurouge",
        "sig-cyanthox",
        "sig-enotprost",
        "sig-exgrape",
        "sig-extramel",
        "sig-quatrefolic",
        "sig-greeniuronic",
        "sig-inavea",
        "sig-kaneka",
        "sig-keranat",
        "sig-ksm-66",
        "sig-liboost",
        "sig-lutemax",
        "sig-m-gard",
        "sig-maquibright",
        "sig-metabolaid",
        "sig-morosil",
        "sig-omegavie",
        "sig-omegia",
        "sig-peak-atp",
        "sig-pycnogenol",
        "sig-red-orange-complex",
        "sig-robuvit",
        "sig-safr-inside",
        "sig-serenzo",
        "sig-setria",
        "sig-sunfiber",
        "sig-sunphenon",
        "sig-vecollal",
        "sig-vitacholine",
        "sig-watts-up"
      ],
      "ingredientIds": [
        "sig-ahcc",
        "sig-applephenon",
        "sig-apresflex",
        "sig-astafit",
        "sig-cacti-nea",
        "sig-cultavit",
        "sig-curcurouge",
        "sig-cyanthox",
        "sig-enotprost",
        "sig-exgrape",
        "sig-extramel",
        "sig-quatrefolic",
        "sig-greeniuronic",
        "sig-inavea",
        "sig-kaneka",
        "sig-keranat",
        "sig-ksm-66",
        "sig-liboost",
        "sig-lutemax",
        "sig-m-gard",
        "sig-maquibright",
        "sig-metabolaid",
        "sig-morosil",
        "sig-omegavie",
        "sig-omegia",
        "sig-peak-atp",
        "sig-pycnogenol",
        "sig-red-orange-complex",
        "sig-robuvit",
        "sig-safr-inside",
        "sig-serenzo",
        "sig-setria",
        "sig-sunfiber",
        "sig-sunphenon",
        "sig-vecollal",
        "sig-vitacholine",
        "sig-watts-up"
      ],
      "avoidTitle": "",
      "avoidLead": "",
      "avoidInConventional": [
        {
          "name": "Vague “proprietary blend” with no named active",
          "examples": "Unlabeled complexes that never name the studied raw material",
          "why": "Hard to teach accurately. Ringana’s pages often name the trademarked active — use that precision."
        },
        {
          "name": "Third-party blog / review claims copied as product facts",
          "examples": "Influencer threads, Amazon reviews, random wellness blogs",
          "why": "Not a source of truth. Stick to ringana.com (and the official manufacturer page when you need brand background)."
        },
        {
          "name": "Competitive dosing brags you can’t source",
          "examples": "“We use more than other brands” without a Ringana citation",
          "why": "If ringana.com doesn’t say it, don’t. Accuracy beats one-upmanship."
        }
      ]
    },
    {
      "id": "barrier",
      "aliases": [
        "barrier",
        "ceramide",
        "ceramides",
        "sensitive"
      ],
      "title": "Barrier support",
      "blurb": "Ceramides and lipids that reinforce the skin barrier.",
      "intro": "Barrier support is ceramides, phytosterols, and related lipids that help skin hold moisture and feel comfortable — key for sensitive and dry-skin conversations.",
      "ringanaApproach": "Pair barrier language with humectants: water binders + lipids is a complete moisture story.",
      "roleIds": [
        "barrier"
      ],
      "featuredIds": [
        "ceramide-np",
        "ceramide-ap"
      ],
      "ingredientIds": [
        "centella-asiatica-leaf-extract",
        "ceramide-ap",
        "ceramide-eop",
        "ceramide-np",
        "ceramide-ns",
        "cholesterol",
        "glyceryl-behenate",
        "glycolipids",
        "glycosphingolipids",
        "phytosterols",
        "phytosteryl-sunflowerseedate",
        "triticum-vulgare-aestivum-grain-extract"
      ],
      "avoidTitle": "",
      "avoidLead": "",
      "avoidInConventional": []
    },
    {
      "id": "fragrance-allergens",
      "aliases": [
        "fragrance",
        "perfume",
        "parfum",
        "allergen",
        "allergens",
        "allergy",
        "citronellol",
        "geraniol",
        "linalool",
        "limonene"
      ],
      "title": "Fragrance & allergens",
      "blurb": "Declared fragrance allergens and scent-related ingredients.",
      "intro": "EU labeling requires certain fragrance allergens to be listed when they exceed thresholds. They’re not automatically “bad” — they’re transparency. This topic is for partners helping someone scan for personal sensitivities.",
      "ringanaApproach": "Never diagnose allergies. Teach people to search the ingredient guide (or the pack) for their triggers, then confirm on the current packaging.",
      "roleIds": [
        "fragrance"
      ],
      "featuredIds": [
        "citronellol",
        "geraniol",
        "linalool"
      ],
      "ingredientIds": [
        "citral",
        "citronellol",
        "geraniol",
        "geraniol-i",
        "linalool",
        "microencapsulated-sage-complex"
      ],
      "avoidTitle": "Scent to watch for",
      "avoidLead": "Declared allergens are transparency. A black-box parfum is a different conversation.",
      "avoidInConventional": [
        {
          "name": "Undisclosed “fragrance / parfum” as a black box",
          "examples": "Fragrance, Parfum, Aroma",
          "why": "A single word can hide many components. Declared allergens and readable scent notes are easier to evaluate."
        },
        {
          "name": "Phthalates",
          "examples": "Diethyl phthalate (DEP), Fragrance / Parfum (when undeclared)",
          "why": "Sometimes used as a fragrance fixative and not listed on their own. Several phthalates (DBP, DEHP, BBP) are banned in EU cosmetics. Named scent notes beat a black-box parfum."
        },
        {
          "name": "Assuming “fragrance-free” means hypoallergenic",
          "why": "Fragrance-free products can still irritate. Personal history beats marketing words."
        }
      ]
    },
    {
      "id": "uv-filters",
      "aliases": [
        "spf",
        "sunscreen",
        "uv",
        "zinc",
        "oxybenzone",
        "octinoxate",
        "nano",
        "titanium"
      ],
      "title": "UV filters & sun care",
      "blurb": "Mineral vs chemical sun filters — and particle size.",
      "intro": "Ringana sun care uses mineral zinc oxide (and titanium dioxide in baby SPF) as non-nano filters. That’s a different conversation than conventional chemical UV filters.",
      "ringanaApproach": "Say non-nano mineral. Don’t say “chemical-free.” Zinc oxide is still a chemical. Precision builds trust.",
      "roleIds": [
        "uv"
      ],
      "featuredIds": [
        "zinc-oxide",
        "titanium-dioxide"
      ],
      "ingredientIds": [
        "ci-77891",
        "titanium-dioxide",
        "zinc-oxide"
      ],
      "avoidTitle": "Sun filters to watch for",
      "avoidLead": "Read the UV filter, not just the SPF number.",
      "avoidInConventional": [
        {
          "name": "Chemical UV filters",
          "examples": "Oxybenzone (benzophenone-3), Octinoxate (ethylhexyl methoxycinnamate), Homosalate, Avobenzone, Octocrylene",
          "why": "Common in conventional SPF. Ringana uses non-nano mineral zinc oxide / titanium dioxide instead."
        },
        {
          "name": "Unlabeled nano mineral filters",
          "examples": "Nano zinc oxide, nano titanium dioxide (when unlabeled or unclear)",
          "why": "Particle size is a fair question. Ringana’s mineral UV filters and pigments are non-nano — precision you can say out loud."
        }
      ]
    },
    {
      "id": "watch-for",
      "aliases": [
        "avoid",
        "red flags",
        "watch for",
        "conventional",
        "mineral oil",
        "paraben",
        "label",
        "peg",
        "ethoxylated",
        "sls",
        "sulfate",
        "phthalate",
        "oxybenzone",
        "octinoxate"
      ],
      "title": "What to watch for",
      "blurb": "Simple cues when you’re comparing a drugstore label to a Ringana one.",
      "intro": "These are names that come up most when someone holds a conventional bottle next to a Ringana one. Not a scare list — a reading list. Ringana’s own ingredients live in the other topics.",
      "ringanaApproach": "Stay curious, not smug. Plenty of people use conventional products happily. Open the matching topic when you want the longer why. Skip “chemical-free” and “toxin-free” — water is a chemical. Precision builds trust.",
      "roleIds": [],
      "featuredIds": [],
      "ingredientIds": [],
      "avoidTitle": "On a conventional label",
      "avoidLead": "A starting list for comparing labels — not everything, and not a fear list.",
      "avoidInConventional": [
        {
          "name": "Sodium lauryl sulfate (SLS)",
          "examples": "Sodium lauryl sulfate, Sodium coco sulfate",
          "why": "A strong detergent cleanser, common in foaming washes. Not the same as SLES (that’s ethoxylated). Ringana uses milder sugar tensides (glucosides). See Surfactants."
        },
        {
          "name": "PEG- and -eth names",
          "examples": "PEG-100 stearate, Ceteareth-20, Polysorbate-20, Sodium laureth sulfate (SLES)",
          "why": "A label-reading tell, not a plant-source story. Cetearyl alcohol is not ceteareth. Ringana uses polyglyceryl, sugar, and olive emulsifiers, and glucoside cleansers. See Emulsifiers and Surfactants."
        },
        {
          "name": "Preservatives built for years on a shelf",
          "examples": "Parabens, phenoxyethanol (rose ether), DMDM hydantoin, MIT, benzalkonium chloride",
          "why": "Useful for warehouse dating — the opposite of a fresh-batch model. Ringana leans small batches and shorter dating instead. See Preservatives & freshness for each family — not just “it’s synthetic.”"
        },
        {
          "name": "BHA and BHT",
          "examples": "BHA (butylated hydroxyanisole), BHT (butylated hydroxytoluene)",
          "why": "Synthetic antioxidants used so oils last through long storage. Ringana uses tocopherol (vitamin E) and short dating instead. See Vitamins & antioxidants."
        },
        {
          "name": "MEA / DEA / TEA",
          "examples": "Triethanolamine, TEA-stearate, Cocamide DEA, Stearamide MEA",
          "why": "Older cream and cleanser systems. Some can form nitrosamines depending on the rest of the formula. Ringana uses named plant emulsifiers instead. See Emulsifiers."
        },
        {
          "name": "EDTA chelators",
          "examples": "Disodium EDTA, Tetrasodium EDTA, Calcium disodium EDTA",
          "why": "Not a preservative on their own — they bind metals so a long-shelf formula stays stable. Ringana uses sodium phytate (rice bran) for that job. See Preservatives & freshness."
        },
        {
          "name": "Mineral oil as the moisturizing shortcut",
          "examples": "Paraffinum liquidum, mineral oil, petrolatum",
          "why": "A petroleum-derived occlusive. Ringana uses plant oils and barrier lipids with a clearer plant story. See Oils, butters & lipids."
        },
        {
          "name": "Silicones",
          "examples": "Dimethicone, Cyclopentasiloxane, Cyclomethicone",
          "why": "A synthetic slip layer, common in creams and hair care. Ringana uses plant oils and lipids instead. See Oils, butters & lipids."
        },
        {
          "name": "Fragrance / parfum as one word",
          "examples": "Fragrance, Parfum, Aroma",
          "why": "One word can hide many components. Named scent notes and declared allergens are easier to scan if someone has sensitivities. See Fragrance & allergens."
        },
        {
          "name": "Phthalates",
          "examples": "Diethyl phthalate (DEP), Fragrance / Parfum (when undeclared)",
          "why": "Sometimes used as a fragrance fixative and not listed on their own. Several phthalates (DBP, DEHP, BBP) are banned in EU cosmetics. Named scent notes beat a black-box parfum. See Fragrance & allergens."
        },
        {
          "name": "Chemical UV filters",
          "examples": "Oxybenzone (benzophenone-3), Octinoxate (ethylhexyl methoxycinnamate), Homosalate, Avobenzone",
          "why": "Common in conventional SPF. Ringana’s sun care uses non-nano mineral zinc oxide / titanium dioxide instead. See UV filters & sun care."
        },
        {
          "name": "Unlabeled nano mineral filters",
          "examples": "Nano zinc oxide, nano titanium dioxide (when unlabeled or unclear)",
          "why": "Particle size is a fair question. Ringana’s mineral UV filters and pigments are non-nano — precision you can say out loud. See UV filters & sun care."
        }
      ]
    }
  ],
  "glossary": [
    {
      "id": "2-heptanediol",
      "inciName": "2-Heptanediol",
      "commonName": "Plant-derived moisturizing agent",
      "altNames": [],
      "roles": [
        "moisturizer",
        "antioxidant"
      ],
      "blurb": "A moisturizing support ingredient related to modern hydration / booster systems in water-based care.",
      "match": [
        "2-heptanediol",
        "plant-derived moisturizing agent"
      ],
      "productIds": [
        "adds-glow",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "2-hexanediol",
      "inciName": "2-hexanediol",
      "commonName": "Plant-derived moisturizing agent",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Plant-derived moisturizing agent. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "2-hexanediol",
        "plant-derived moisturizing agent"
      ],
      "productIds": [
        "adds-glow",
        "fresh-eye-cream"
      ]
    },
    {
      "id": "3-o-ethyl-ascorbic-acid",
      "inciName": "3-o-ethyl ascorbic acid",
      "commonName": "Vitamin C derivative",
      "altNames": [
        "Ethyl ascorbic acid"
      ],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "A more stable vitamin C derivative used for brightness and antioxidant support. Freshness matters here: vitamin C conversations pair naturally with Ringana’s short dating / small-batch story.",
      "match": [
        "3-o-ethyl ascorbic acid",
        "vitamin c derivative",
        "ethyl ascorbic acid"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "5mthf-glucosamine",
      "inciName": "5MTHF-glucosamine",
      "commonName": "5MTHF-glucosamine",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "5mthf-glucosamine"
      ],
      "productIds": [
        "caps-fem",
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "5mthf-glucosamine-gluten-free",
      "inciName": "5MTHF-glucosamine. gluten-free",
      "commonName": "5MTHF-glucosamine. gluten-free",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "5mthf-glucosamine. gluten-free"
      ],
      "productIds": [
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "acacia-decurrens-flower-cera",
      "inciName": "Acacia decurrens flower cera",
      "commonName": "Mimosa cera",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Mimosa cera. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "acacia decurrens flower cera",
        "mimosa cera"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "acacia-fibre",
      "inciName": "Acacia fibre",
      "commonName": "Acacia senegal",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Acacia senegal. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "acacia fibre",
        "acacia senegal"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "acacia-senegal-gum",
      "inciName": "Acacia senegal gum",
      "commonName": "Plant-based gelling agent",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Plant-based gelling agent. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "acacia senegal gum",
        "plant-based gelling agent"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "acerola-cherry-powder",
      "inciName": "Acerola cherry powder",
      "commonName": "Acerola cherry (natural vitamin C source)",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Acerola cherry — a natural vitamin C–rich botanical used especially in supplements / beauty-from-within formulas. Latin name on some labels: Malpighia glabra.",
      "match": [
        "acerola cherry powder",
        "acerola cherry (natural vitamin c source)"
      ],
      "productIds": [
        "caps-beauty-hair",
        "caps-fem",
        "caps-immu",
        "caps-mascu",
        "caps-move",
        "caps-protect",
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing",
        "ringanabty",
        "ringanachi",
        "sport-endurance",
        "sport-protein"
      ]
    },
    {
      "id": "acetyl-hexapeptide-1",
      "inciName": "Acetyl hexapeptide-1",
      "commonName": "Acetyl hexapeptide-1",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "acetyl hexapeptide-1"
      ],
      "productIds": [
        "adds-effect"
      ]
    },
    {
      "id": "acetyl-hexapeptide-8",
      "inciName": "Acetyl Hexapeptide-8",
      "commonName": "Expression-line peptide (Argireline-type)",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "A well-known expression-line peptide (Argireline family). On some Ringana eye formulas the on-page note mentions under-eye concerns — teach from the specific product page, not a generic peptide script.",
      "match": [
        "acetyl hexapeptide-8",
        "expression-line peptide (argireline-type)"
      ],
      "productIds": [
        "adds-effect",
        "fresh-anti-wrinkle-serum",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "acetyl-tetrapeptide-2",
      "inciName": "Acetyl tetrapeptide-2",
      "commonName": "Acetyl tetrapeptide-2",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "acetyl tetrapeptide-2"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "acetyl-tetrapeptide-5",
      "inciName": "Acetyl tetrapeptide-5",
      "commonName": "Skin-smoothing peptide",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Skin-smoothing peptide. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "acetyl tetrapeptide-5",
        "skin-smoothing peptide"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "acidity-regulator-buffered-vinegar",
      "inciName": "Acidity regulator: buffered vinegar",
      "commonName": "Acidity regulator: buffered vinegar",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "acidity regulator: buffered vinegar"
      ],
      "productIds": [
      ]
    },
    {
      "id": "acidity-regulator-lactic-acid",
      "inciName": "Acidity regulator: lactic acid",
      "commonName": "Acidity regulator: lactic acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "acidity regulator: lactic acid"
      ],
      "productIds": [
        "ringanabty",
        "ringanachi",
        "ringanadea",
      ]
    },
    {
      "id": "acmella-oleracea-extract",
      "inciName": "Acmella oleracea extract",
      "commonName": "Firming paracress extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Firming paracress extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "acmella oleracea extract",
        "firming paracress extract"
      ],
      "productIds": [
        "adds-effect"
      ]
    },
    {
      "id": "actinidia-chinensis-fruit-water",
      "inciName": "Actinidia chinensis fruit water",
      "commonName": "Kiwi water",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Kiwi water. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "actinidia chinensis fruit water",
        "kiwi water"
      ],
      "productIds": [
        "adds-repair",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "actinidia-deliciosa-fruit-powder",
      "inciName": "Actinidia deliciosa fruit powder",
      "commonName": "Actinidia deliciosa fruit powder",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "actinidia deliciosa fruit powder"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "adansonia-digitata-pulp-extract",
      "inciName": "Adansonia digitata pulp extract",
      "commonName": "Baobab oil",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Baobab oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "adansonia digitata pulp extract",
        "baobab oil"
      ],
      "productIds": [
        "fresh-eye-serum"
      ]
    },
    {
      "id": "adansonia-digitata-seed-oil",
      "inciName": "Adansonia digitata seed oil",
      "commonName": "Baobab oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Baobab oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "adansonia digitata seed oil",
        "baobab oil"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "adenosine-5-triphosphate-disodium-salt",
      "inciName": "Adenosine-5’-triphosphate disodium salt",
      "commonName": "ATP",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "ATP. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "adenosine-5’-triphosphate disodium salt",
        "atp"
      ],
      "productIds": [
        "sport-push"
      ]
    },
    {
      "id": "aesculus-hippocastanum-seed-extract",
      "inciName": "Aesculus hippocastanum seed extract",
      "commonName": "Horse chestnut extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Horse chestnut extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "aesculus hippocastanum seed extract",
        "horse chestnut extract"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "agave-syrup-powder",
      "inciName": "Agave syrup powder",
      "commonName": "Agave tequilana",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Agave tequilana. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "agave syrup powder",
        "agave tequilana"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "sport-endurance",
        "sport-protein"
      ]
    },
    {
      "id": "ajuga-reptans-extract-from-cell-cultures",
      "inciName": "Ajuga reptans extract from cell cultures",
      "commonName": "Ajuga reptans extract from cell cultures",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ajuga reptans extract from cell cultures"
      ],
      "productIds": [
        "caps-beauty-hair",
        "caps-mascu"
      ]
    },
    {
      "id": "alcohol",
      "inciName": "Alcohol",
      "commonName": "Undenatured ethanol",
      "altNames": [],
      "roles": [
        "alcohol"
      ],
      "blurb": "Undenatured ethanol — helps dissolve other ingredients and supports freshness in some water-based products. Not the same as harsh drying “alcohol denat.” in aggressive cleansers; still flag it if someone is alcohol-sensitive and check the full INCI.",
      "match": [
        "alcohol",
        "undenatured ethanol"
      ],
      "productIds": [
        "adds-effect",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-intensive-hand-cream",
        "fresh-light-legs",
        "fresh-moisturiser-for-men",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket"
      ]
    },
    {
      "id": "alfalfa-powder",
      "inciName": "Alfalfa powder",
      "commonName": "Medicago sativa",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Medicago sativa. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "alfalfa powder",
        "medicago sativa"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "algae-powder-and-algae-extract",
      "inciName": "Algae powder and algae extract",
      "commonName": "Algae powder and algae extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "algae powder and algae extract"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "aloe-barbadensis-leaf-juice",
      "inciName": "Aloe barbadensis leaf juice",
      "commonName": "Aloe vera fresh plant juice",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Fresh aloe vera leaf juice — soothing, water-rich botanical base you’ll see high on many gentle cleansers, toners, and baby formulas.",
      "match": [
        "aloe barbadensis leaf juice",
        "aloe vera fresh plant juice"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-cream-rich",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "alumina",
      "inciName": "Alumina",
      "commonName": "Firmly bonded with the mineral sun protection, coating effect",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Alumina — often used as a mineral coating/dispersing aid with mineral UV filters. Non-nano mineral helper tied to sun-protection systems.",
      "match": [
        "alumina",
        "firmly bonded with the mineral sun protection, coating effect"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "and-vitamin-c-ingredients-highly-branched-maltodextrin",
      "inciName": "And vitamin C. INGREDIENTS Highly branched maltodextrin",
      "commonName": "And vitamin C. INGREDIENTS Highly branched maltodextrin",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "supplement"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "and vitamin c. ingredients highly branched maltodextrin"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "anetholea-anisata-leaf-extract",
      "inciName": "Anetholea anisata leaf extract",
      "commonName": "Soothing extract from Australian aniseed",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Soothing extract from Australian aniseed. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "anetholea anisata leaf extract",
        "soothing extract from australian aniseed"
      ],
      "productIds": [
        "fresh-cleansing-water"
      ]
    },
    {
      "id": "anhydroxylitol",
      "inciName": "Anhydroxylitol",
      "commonName": "Moisturizing birch sugar compounds",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Moisturizing birch sugar compounds. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "anhydroxylitol",
        "moisturizing birch sugar compounds"
      ],
      "productIds": [
        "fresh-cream-light",
        "fresh-hair-treatment",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-soap-liquid",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "apple-extract",
      "inciName": "Apple extract",
      "commonName": "Malus domestica",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Malus domestica. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "apple extract",
        "malus domestica"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "apple-fibre",
      "inciName": "Apple fibre",
      "commonName": "Malus domestica",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Malus domestica. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "apple fibre",
        "malus domestica"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "apple-fruit-extract",
      "inciName": "Apple fruit extract",
      "commonName": "Malus domestica) (sulphites",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Malus domestica) (sulphites. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "apple fruit extract",
        "malus domestica) (sulphites"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "apple-fruit-powder",
      "inciName": "Apple fruit powder",
      "commonName": "Malus domestica) (freeze-dried",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Malus domestica) (freeze-dried. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "apple fruit powder",
        "malus domestica) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "sport-endurance"
      ]
    },
    {
      "id": "apple-juice-concentrate",
      "inciName": "Apple juice concentrate",
      "commonName": "Malus domestica",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Malus domestica. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "apple juice concentrate",
        "malus domestica"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "aqua",
      "inciName": "Aqua",
      "commonName": "Water",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Purified water — the base of most water-based skincare. On Ringana labels you’ll often see fruit and flower waters ranked high alongside aqua, which is part of why the first lines of the INCI feel readable.",
      "match": [
        "aqua",
        "water"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-baby-tooth-gel",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cleansing-water",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-light-legs",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-soap",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "arachidyl-alcohol",
      "inciName": "Arachidyl alcohol",
      "commonName": "Fatty alcohol from plant wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Fatty alcohol from plant wax. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "arachidyl alcohol",
        "fatty alcohol from plant wax"
      ],
      "productIds": [
        "fresh-body-milk-light"
      ]
    },
    {
      "id": "arachidyl-glucoside",
      "inciName": "Arachidyl glucoside",
      "commonName": "Natural moisturizer",
      "altNames": [],
      "roles": [
        "surfactant",
        "moisturizer"
      ],
      "blurb": "Natural moisturizer. A cleansing helper (tenside) that lets water mix with oils and impurities so rinsing actually cleans. Mild sugar-based systems are a different conversation than harsh detergent cleansers.",
      "match": [
        "arachidyl glucoside",
        "natural moisturizer"
      ],
      "productIds": [
        "fresh-body-milk-light"
      ]
    },
    {
      "id": "arginine",
      "inciName": "Arginine",
      "commonName": "Moisturizing amino acid",
      "altNames": [],
      "roles": [
        "moisturizer",
        "amino-nmf"
      ],
      "blurb": "A moisturizing amino acid. Supports comfortable, hydrated-feeling skin and often appears near other NMF-style ingredients.",
      "match": [
        "arginine",
        "moisturizing amino acid"
      ],
      "productIds": [
        "adds-effect",
        "adds-repair",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-cleanser",
        "fresh-cleansing-water",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-light-legs",
        "fresh-lip-balm-classic",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "arginine-moisturizing-amino-acid",
      "inciName": "Arginine (moisturizing amino acid",
      "commonName": "Arginine (moisturizing amino acid",
      "altNames": [],
      "roles": [
        "moisturizer",
        "amino-nmf"
      ],
      "blurb": "A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "arginine (moisturizing amino acid"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster"
      ]
    },
    {
      "id": "arginine-lysine-polypeptide",
      "inciName": "Arginine/Lysine polypeptide",
      "commonName": "Arginine/Lysine polypeptide",
      "altNames": [],
      "roles": [
        "peptide",
        "amino-nmf"
      ],
      "blurb": "A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "arginine/lysine polypeptide"
      ],
      "productIds": [
        "adds-effect"
      ]
    },
    {
      "id": "aronia-juice-concentrate",
      "inciName": "Aronia juice concentrate",
      "commonName": "Aronia melanocarpa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Aronia melanocarpa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "aronia juice concentrate",
        "aronia melanocarpa"
      ],
      "productIds": [
      ]
    },
    {
      "id": "artichoke-leaf-and-flower-extract",
      "inciName": "Artichoke leaf and flower extract",
      "commonName": "Cynara scolymus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cynara scolymus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "artichoke leaf and flower extract",
        "cynara scolymus"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "ascorbic-acid",
      "inciName": "Ascorbic acid",
      "commonName": "Vitamin C",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Classic vitamin C — antioxidant and brightening support. Unstable in old warehouse stock, which is why “made fresh” is more than a slogan when this shows up on a label.",
      "match": [
        "ascorbic acid",
        "vitamin c"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "ascorbyl-palmitate",
      "inciName": "Ascorbyl palmitate",
      "commonName": "Compound of Vitamin C and a plant fatty acid",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Compound of Vitamin C and a plant fatty acid. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "ascorbyl palmitate",
        "compound of vitamin c and a plant fatty acid"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-cream-rich",
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "ashwagandha-root-extract",
      "inciName": "Ashwagandha root extract",
      "commonName": "Withania somnifera",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Withania somnifera. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ashwagandha root extract",
        "withania somnifera"
      ],
      "productIds": [
        "caps-moodoo",
      ]
    },
    {
      "id": "asiatic-acid",
      "inciName": "Asiatic acid",
      "commonName": "Bioactive main active ingredients in Centella asiatica",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Bioactive main active ingredients in Centella asiatica. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "asiatic acid",
        "bioactive main active ingredients in centella asiatica"
      ],
      "productIds": [
        "fresh-body-milk-rich"
      ]
    },
    {
      "id": "asiaticoside",
      "inciName": "Asiaticoside",
      "commonName": "Asiaticoside",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "asiaticoside"
      ],
      "productIds": [
        "fresh-body-milk-rich"
      ]
    },
    {
      "id": "asparagopsis-armata-extract",
      "inciName": "Asparagopsis armata extract",
      "commonName": "Asparagopsis armata extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "asparagopsis armata extract"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "astaxanthin",
      "inciName": "Astaxanthin",
      "commonName": "Cell-protecting alga extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cell-protecting alga extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "astaxanthin",
        "cell-protecting alga extract"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-cream-rich",
        "fresh-repair-shampoo",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "astaxanthin-rich-oleoresin-from-haematococcus-pluvialis-algae",
      "inciName": "Astaxanthin-rich oleoresin from Haematococcus pluvialis algae",
      "commonName": "Astaxanthin-rich oleoresin from Haematococcus pluvialis algae",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "astaxanthin-rich oleoresin from haematococcus pluvialis algae"
      ],
      "productIds": [
        "beyond-omega",
        "caps-protect"
      ]
    },
    {
      "id": "astragalus-membranaceus-root-extract",
      "inciName": "Astragalus membranaceus root extract",
      "commonName": "Mongolian milkvetch extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Mongolian milkvetch extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "astragalus membranaceus root extract",
        "mongolian milkvetch extract"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "astrocaryum-tucuma-seed-butter",
      "inciName": "Astrocaryum tucuma seed butter",
      "commonName": "Silky-soft tucuma butter",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Silky-soft tucuma butter. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "astrocaryum tucuma seed butter",
        "silky-soft tucuma butter"
      ],
      "productIds": [
        "fresh-foot-balm",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-moisturiser-for-men",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "atp",
      "inciName": "ATP",
      "commonName": "ATP",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "atp"
      ],
      "productIds": [
        "sport-push"
      ]
    },
    {
      "id": "aureobasidium-pullulans-ferment",
      "inciName": "Aureobasidium pullulans ferment",
      "commonName": "Black yeast",
      "altNames": [],
      "roles": [
        "thickener",
        "extracts-ferments"
      ],
      "blurb": "Black yeast. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "aureobasidium pullulans ferment",
        "black yeast"
      ],
      "productIds": [
        "fresh-toner-pure"
      ]
    },
    {
      "id": "avena-sativa",
      "inciName": "Avena sativa",
      "commonName": "Oat) seed extract (oat extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Oat) seed extract (oat extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "avena sativa",
        "oat) seed extract (oat extract"
      ],
      "productIds": [
        "fresh-cream-light"
      ]
    },
    {
      "id": "avena-sativa-kernel-oil",
      "inciName": "Avena sativa kernel oil",
      "commonName": "Restructuring oat oil",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Restructuring oat oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "avena sativa kernel oil",
        "restructuring oat oil"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-light",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "avena-sativa-seed-extract",
      "inciName": "Avena sativa seed extract",
      "commonName": "Oat extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Oat extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "avena sativa seed extract",
        "oat extract"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "b-vitamins-and-secondary-plant-substances-ingredients-orange-peel-extract",
      "inciName": "B vitamins and secondary plant substances. INGREDIENTS Orange peel extract",
      "commonName": "Citrus sinensis",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Citrus sinensis. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "b vitamins and secondary plant substances. ingredients orange peel extract",
        "citrus sinensis"
      ],
      "productIds": [
        "caps-moodoo"
      ]
    },
    {
      "id": "bacillus-coagulans",
      "inciName": "Bacillus coagulans",
      "commonName": "Bacillus coagulans",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "bacillus coagulans"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "bacillus-ferment",
      "inciName": "Bacillus ferment",
      "commonName": "Revitalising ferment",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Revitalising ferment. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "bacillus ferment",
        "revitalising ferment"
      ],
      "productIds": [
        "adds-glow",
        "adds-repair",
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "backhousia-citriodora-leaf-oil",
      "inciName": "Backhousia citriodora leaf oil",
      "commonName": "Lemon myrtle oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Lemon myrtle oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "backhousia citriodora leaf oil",
        "lemon myrtle oil"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "bakuchiol",
      "inciName": "Bakuchiol",
      "commonName": "Plant-derived retinol alternative",
      "altNames": [
        "Babchi-derived active"
      ],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "A plant-derived alternative often compared to retinol for renewal conversations. For pregnancy / breastfeeding questions: don’t play doctor — share the current INCI and suggest they check with their clinician.",
      "match": [
        "bakuchiol",
        "plant-derived retinol alternative",
        "babchi-derived active"
      ],
      "productIds": [
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "bakuchiyl-nicotinate",
      "inciName": "Bakuchiyl nicotinate",
      "commonName": "Stimulates skin renewal",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Stimulates skin renewal. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "bakuchiyl nicotinate",
        "stimulates skin renewal"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "bambusa-arundinacea-leaf-extract",
      "inciName": "Bambusa arundinacea leaf extract",
      "commonName": "Hair-conditioning substance",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hair-conditioning substance. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "bambusa arundinacea leaf extract",
        "hair-conditioning substance"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "behenic-acid",
      "inciName": "Behenic acid",
      "commonName": "Behenic acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "behenic acid"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "behenyl-alcohol",
      "inciName": "Behenyl alcohol",
      "commonName": "Fatty alcohol from plant wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Fatty alcohol from plant wax. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "behenyl alcohol",
        "fatty alcohol from plant wax"
      ],
      "productIds": [
        "fresh-body-milk-light"
      ]
    },
    {
      "id": "beta-vulgaris-root-extract",
      "inciName": "Beta vulgaris root extract",
      "commonName": "Substance that protects cells",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Substance that protects cells. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "beta vulgaris root extract",
        "substance that protects cells"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "beta-caryophyllene-waterproof-instant-uva-uvb-protection",
      "inciName": "Beta-caryophyllene° Waterproof. Instant UVA & UVB protection",
      "commonName": "Beta-caryophyllene° Waterproof. Instant UVA & UVB protection",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "beta-caryophyllene° waterproof. instant uva & uvb protection",
        "beta-caryophyllene waterproof. instant uva & uvb protection"
      ],
      "productIds": [
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "betaine",
      "inciName": "Betaine",
      "commonName": "Sugar-beet moisturizer (NMF support)",
      "altNames": [
        "Trimethylglycine",
        "TMG"
      ],
      "roles": [
        "moisturizer",
        "amino-nmf"
      ],
      "blurb": "From sugar beet — a moisturizing osmolyte that helps skin hold water and feel comfortable, especially in cleansing and leave-on care.",
      "match": [
        "betaine",
        "sugar-beet moisturizer (nmf support)",
        "trimethylglycine",
        "tmg"
      ],
      "productIds": [
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-cream-medium",
        "fresh-hydro-serum",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-volume-shampoo",
        "sport-endurance"
      ]
    },
    {
      "id": "bifidobacterium-breve-bb077",
      "inciName": "Bifidobacterium breve BB077",
      "commonName": "Bifidobacterium breve BB077",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "bifidobacterium breve bb077"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "bifidobacterium-infantis-bi221",
      "inciName": "Bifidobacterium infantis BI221",
      "commonName": "Bifidobacterium infantis BI221",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "bifidobacterium infantis bi221"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "bifidobacterium-lactis-bl050",
      "inciName": "Bifidobacterium lactis BL050",
      "commonName": "Bifidobacterium lactis BL050",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "bifidobacterium lactis bl050"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "bifidobacterium-longum-blg240",
      "inciName": "Bifidobacterium longum BLG240",
      "commonName": "Bifidobacterium longum BLG240",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "bifidobacterium longum blg240"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "bis",
      "inciName": "Bis",
      "commonName": "Tripeptide-1) copper acetate (anti-wrinkle copper peptide",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Tripeptide-1) copper acetate (anti-wrinkle copper peptide. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "bis",
        "tripeptide-1) copper acetate (anti-wrinkle copper peptide"
      ],
      "productIds": [
        "adds-effect"
      ]
    },
    {
      "id": "bisabolol",
      "inciName": "Bisabolol",
      "commonName": "Skin-soothing substance",
      "altNames": [
        "Alpha-bisabolol"
      ],
      "roles": [
        "other"
      ],
      "blurb": "A skin-soothing substance (often associated with chamomile chemistry) used to keep formulas feeling calm and kind.",
      "match": [
        "bisabolol",
        "skin-soothing substance",
        "alpha-bisabolol"
      ],
      "productIds": [
        "adds-glow",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-rich",
        "fresh-foot-balm",
        "fresh-hydro-serum",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-scrub-face-body",
        "fresh-sunscreen-face",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "black-elderberry-extract",
      "inciName": "Black elderberry extract",
      "commonName": "Sambucus nigra",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Sambucus nigra. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "black elderberry extract",
        "sambucus nigra"
      ],
      "productIds": [
        "caps-beauty-hair",
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "blackcurrant-powder",
      "inciName": "Blackcurrant powder",
      "commonName": "Ribes nigrum) (freeze-dried",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Ribes nigrum) (freeze-dried. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "blackcurrant powder",
        "ribes nigrum) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "blood-orange-extract",
      "inciName": "Blood orange extract",
      "commonName": "Citrus sinensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus sinensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "blood orange extract",
        "citrus sinensis"
      ],
      "productIds": [
        "caps-protect",
        "ringanadea"
      ]
    },
    {
      "id": "blueberry-extract",
      "inciName": "Blueberry extract",
      "commonName": "Vaccinium myrtillus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Vaccinium myrtillus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "blueberry extract",
        "vaccinium myrtillus"
      ],
      "productIds": [
        "caps-protect"
      ]
    },
    {
      "id": "borago-officinalis-seed-oil",
      "inciName": "Borago officinalis seed oil",
      "commonName": "Borage oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Borage oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "borago officinalis seed oil",
        "borage oil"
      ],
      "productIds": [
        "fresh-cream-rich",
        "fresh-light-legs",
        "fresh-soap"
      ]
    },
    {
      "id": "boswellia-serrata-gum",
      "inciName": "Boswellia serrata gum",
      "commonName": "Skin-soothing frankincense extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-soothing frankincense extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "boswellia serrata gum",
        "skin-soothing frankincense extract"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "boswellia-serrata-resin-extract",
      "inciName": "Boswellia serrata resin extract",
      "commonName": "Skin-soothing frankincense extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-soothing frankincense extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "boswellia serrata resin extract",
        "skin-soothing frankincense extract"
      ],
      "productIds": [
        "adds-repair"
      ]
    },
    {
      "id": "brassica-alcohol",
      "inciName": "Brassica alcohol",
      "commonName": "Hair-smoothing substance",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Hair-smoothing substance. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "brassica alcohol",
        "hair-smoothing substance"
      ],
      "productIds": [
        "fresh-hair-treatment"
      ]
    },
    {
      "id": "brassica-campestris-aleurites-fordi-oil-copolymer",
      "inciName": "Brassica campestris/aleurites fordi oil copolymer",
      "commonName": "Natural compound of rapeseed and tung tree oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Natural compound of rapeseed and tung tree oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "brassica campestris/aleurites fordi oil copolymer",
        "natural compound of rapeseed and tung tree oil"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "brassicyl-valinate-esylate",
      "inciName": "Brassicyl valinate esylate",
      "commonName": "Hair-conditioning substance",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Hair-conditioning substance. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "brassicyl valinate esylate",
        "hair-conditioning substance"
      ],
      "productIds": [
        "fresh-hair-treatment"
      ]
    },
    {
      "id": "broccoli-powder",
      "inciName": "Broccoli powder",
      "commonName": "Brassica oleracea var. italica) (freeze-dried",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Brassica oleracea var. italica) (freeze-dried. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "broccoli powder",
        "brassica oleracea var. italica) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "bromelain",
      "inciName": "Bromelain",
      "commonName": "Bromelain",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "bromelain"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "buckwheat-sprout-powder",
      "inciName": "Buckwheat sprout powder",
      "commonName": "Fagopyrum esculentum",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Fagopyrum esculentum. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "buckwheat sprout powder",
        "fagopyrum esculentum"
      ],
      "productIds": [
        "caps-beauty-hair",
        "caps-hydro",
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing",
        "sport-protein"
      ]
    },
    {
      "id": "butylene-glycol",
      "inciName": "Butylene glycol",
      "commonName": "Skin-grooming substance",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin-grooming substance. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "butylene glycol",
        "skin-grooming substance"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "butyrospermum-parkii-butter",
      "inciName": "Butyrospermum parkii butter",
      "commonName": "Shea butter",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Shea butter — a rich plant butter that softens, comforts, and helps reduce the feel of moisture loss. Classic barrier-comfort language.",
      "match": [
        "butyrospermum parkii butter",
        "shea butter"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-cream",
        "fresh-foot-balm",
        "fresh-illuminating-enzyme-mask",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "c15-19-alkane",
      "inciName": "C15-19 Alkane",
      "commonName": "Natural emollient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Natural emollient. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "c15-19 alkane",
        "natural emollient"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket"
      ]
    },
    {
      "id": "c9-12-alkane",
      "inciName": "C9-12 Alkane",
      "commonName": "Natural light emollient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "A light natural emollient that improves slip and spread — the “elegant texture” helper rather than a heavy occlusive.",
      "match": [
        "c9-12 alkane",
        "natural light emollient"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-light",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "caffeine",
      "inciName": "Caffeine",
      "commonName": "Micro-circulative",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Micro-circulative. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "caffeine",
        "micro-circulative"
      ],
      "productIds": [
        "fresh-moisturiser-for-men",
        "sport-push"
      ]
    },
    {
      "id": "caffeine-from-coffee-beans",
      "inciName": "Caffeine from coffee beans",
      "commonName": "Coffea canephora",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Coffea canephora. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "caffeine from coffee beans",
        "coffea canephora"
      ],
      "productIds": [
        "ringanachi",
        "sport-push"
      ]
    },
    {
      "id": "calcium-citrate",
      "inciName": "Calcium citrate",
      "commonName": "Calcium citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "calcium citrate"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "fresh-pack-cleansing",
        "sport-endurance",
        "sport-protein"
      ]
    },
    {
      "id": "calcium-gluconate",
      "inciName": "Calcium gluconate",
      "commonName": "Calcium gluconate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "calcium gluconate"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "sport-endurance"
      ]
    },
    {
      "id": "calcium-lactate",
      "inciName": "Calcium lactate",
      "commonName": "Calcium lactate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "calcium lactate"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "calendula-officinalis-flower-extract",
      "inciName": "Calendula officinalis flower extract",
      "commonName": "Calendula extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Calendula extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "calendula officinalis flower extract",
        "calendula extract"
      ],
      "productIds": [
        "fresh-cleanser",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket"
      ]
    },
    {
      "id": "camellia-sinensis-leaf-extract",
      "inciName": "Camellia sinensis leaf extract",
      "commonName": "Green tea leaf extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Green tea leaf extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "camellia sinensis leaf extract",
        "green tea leaf extract"
      ],
      "productIds": [
        "fresh-hydro-serum",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "camellia-sinensis-seed-extract",
      "inciName": "Camellia sinensis seed extract",
      "commonName": "Gently cleansing green tea extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Gently cleansing green tea extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "camellia sinensis seed extract",
        "gently cleansing green tea extract"
      ],
      "productIds": [
        "fresh-cleanser"
      ]
    },
    {
      "id": "camphor",
      "inciName": "Camphor",
      "commonName": "Camphor",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "camphor"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "caprylic-capric-triglyceride",
      "inciName": "Caprylic/capric triglyceride",
      "commonName": "Plant fatty-acid ester oil",
      "altNames": [
        "Fractionated coconut oil (related ester oil)",
        "MCT ester oil"
      ],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "A light ester oil from plant fatty acids — silky emollience without a heavy mineral-oil feel. Helps products spread and soften.",
      "match": [
        "caprylic/capric triglyceride",
        "plant fatty-acid ester oil",
        "fractionated coconut oil (related ester oil)",
        "mct ester oil"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "caprylyl-glycol",
      "inciName": "Caprylyl glycol",
      "commonName": "Skin-hydrating / mild preserving agent",
      "altNames": [
        "1,2-Octanediol"
      ],
      "roles": [
        "moisturizer",
        "preservation"
      ],
      "blurb": "A skin-hydrating ingredient that also helps discourage germs in the bottle. Common in gentle, modern formulas; usually part of a mild freshness plan rather than a heavy long-shelf preservative system.",
      "match": [
        "caprylyl glycol",
        "skin-hydrating / mild preserving agent",
        "1,2-octanediol"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-overnight-face-treatment",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "capsule-casing",
      "inciName": "Capsule casing:",
      "commonName": "Gelling agents: hydroxypropyl starch, carrageenan; humectants: glycerin, sorbitol; water",
      "altNames": [],
      "roles": [
        "moisturizer",
        "thickener",
        "supplement"
      ],
      "blurb": "Gelling agents: hydroxypropyl starch, carrageenan; humectants: glycerin, sorbitol; water. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "capsule casing:",
        "gelling agents: hydroxypropyl starch, carrageenan; humectants: glycerin, sorbitol; water"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "capsule-casing-hydroxypropyl-methylcellulose-and-gellan",
      "inciName": "Capsule casing: hydroxypropyl methylcellulose and gellan",
      "commonName": "Capsule casing: hydroxypropyl methylcellulose and gellan",
      "altNames": [],
      "roles": [
        "supplement"
      ],
      "blurb": "Appears in supplement / capsule contexts. For ingestion products, stick to Ringana’s on-pack directions and important information — this guide is partner education, not medical advice.",
      "match": [
        "capsule casing: hydroxypropyl methylcellulose and gellan"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "capsule-shell-hydroxypropyl-methyl-cellulose",
      "inciName": "Capsule shell: hydroxypropyl methyl cellulose",
      "commonName": "Capsule shell: hydroxypropyl methyl cellulose",
      "altNames": [],
      "roles": [
        "supplement"
      ],
      "blurb": "Appears in supplement / capsule contexts. For ingestion products, stick to Ringana’s on-pack directions and important information — this guide is partner education, not medical advice.",
      "match": [
        "capsule shell: hydroxypropyl methyl cellulose"
      ],
      "productIds": [
        "beyond-spermidine",
        "caps-cerebro",
        "caps-d-gest",
        "caps-fem",
        "caps-hydro",
        "caps-immu",
        "caps-mascu",
        "caps-moodoo",
        "caps-move",
        "caps-protect",
        "sport-push"
      ]
    },
    {
      "id": "cardiospermum-halicacabum-flower-leaf-vine-extract",
      "inciName": "Cardiospermum halicacabum flower/leaf/vine extract",
      "commonName": "Balloon vine extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Balloon vine extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cardiospermum halicacabum flower/leaf/vine extract",
        "balloon vine extract"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "carnosine",
      "inciName": "Carnosine",
      "commonName": "Cell-rejuvenating amino acid complex from alanine and histidine",
      "altNames": [],
      "roles": [
        "peptide",
        "amino-nmf"
      ],
      "blurb": "Cell-rejuvenating amino acid complex from alanine and histidine. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "carnosine",
        "cell-rejuvenating amino acid complex from alanine and histidine"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-hydro-serum",
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "carrier-gum-arabic",
      "inciName": "Carrier: gum arabic",
      "commonName": "Carrier: gum arabic",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "carrier: gum arabic"
      ],
      "productIds": [
        "caps-mascu"
      ]
    },
    {
      "id": "carrot-fibre",
      "inciName": "Carrot fibre",
      "commonName": "Daucus carota",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Daucus carota. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "carrot fibre",
        "daucus carota"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "carrot-powder",
      "inciName": "Carrot powder",
      "commonName": "Daucus carota",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Daucus carota. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "carrot powder",
        "daucus carota"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "carthamus-tinctorius-seed-oil",
      "inciName": "Carthamus tinctorius seed oil",
      "commonName": "Safflower oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Safflower oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "carthamus tinctorius seed oil",
        "safflower oil"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "castor-oil-ipdi-copolymer",
      "inciName": "Castor oil/IPDI copolymer",
      "commonName": "Natural copolymer",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Natural copolymer. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "castor oil/ipdi copolymer",
        "natural copolymer"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-light",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "cellulose",
      "inciName": "Cellulose",
      "commonName": "For silky smooth skin",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "For silky smooth skin. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "cellulose",
        "for silky smooth skin"
      ],
      "productIds": [
        "fresh-cream-light",
        "fresh-eye-serum",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-moisturiser-for-men",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "centaurea-cyanus-flower-water",
      "inciName": "Centaurea cyanus flower water",
      "commonName": "Cornflower water",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Cornflower water. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "centaurea cyanus flower water",
        "cornflower water"
      ],
      "productIds": [
        "adds-effect",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "centella-asiatica-leaf-extract",
      "inciName": "Centella asiatica leaf extract",
      "commonName": "Strengthens the skin barrier",
      "altNames": [],
      "roles": [
        "barrier",
        "extracts-ferments"
      ],
      "blurb": "Strengthens the skin barrier. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "centella asiatica leaf extract",
        "strengthens the skin barrier"
      ],
      "productIds": [
        "fresh-moisturiser-for-men",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "ceramide-ap",
      "inciName": "Ceramide AP",
      "commonName": "Skin-barrier-strengthening ceramide",
      "altNames": [
        "Ceramide 6 II"
      ],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "A skin-identical ceramide that helps reinforce barrier structure. Often appears with other ceramides and lipids as a barrier-support complex.",
      "match": [
        "ceramide ap",
        "skin-barrier-strengthening ceramide",
        "ceramide 6 ii"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "ceramide-eop",
      "inciName": "Ceramide EOP",
      "commonName": "Ceramide EOP",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "ceramide eop"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "ceramide-np",
      "inciName": "Ceramide NP",
      "commonName": "Skin-barrier-strengthening ceramide",
      "altNames": [
        "Ceramide 3"
      ],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "A skin-identical lipid that helps reinforce the barrier. Useful language for dryness, sensitivity, and “my skin feels tight” conversations — pair with humectants for water + seal.",
      "match": [
        "ceramide np",
        "skin-barrier-strengthening ceramide",
        "ceramide 3"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "ceramide-ns",
      "inciName": "Ceramide NS",
      "commonName": "Ceramide NS",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "ceramide ns"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "cetearyl-alcohol",
      "inciName": "Cetearyl alcohol",
      "commonName": "Fatty alcohol (texture / emulsion support)",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "A fatty alcohol that thickens and stabilises emulsions. Despite the word “alcohol,” it’s an emollient texture helper — not drying ethanol.",
      "match": [
        "cetearyl alcohol",
        "fatty alcohol (texture / emulsion support)"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cleanser",
        "fresh-eye-cream",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-intensive-hand-cream",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "cetearyl-glucoside",
      "inciName": "Cetearyl glucoside",
      "commonName": "Laminar emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier",
        "surfactant"
      ],
      "blurb": "Laminar emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "cetearyl glucoside",
        "laminar emulsifier"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "cetearyl-olivate",
      "inciName": "Cetearyl olivate",
      "commonName": "Olive-derived emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "An olive-derived emulsifier that helps create silky cream textures. Pair language with “named plant source” versus mystery emulsifying wax on conventional labels.",
      "match": [
        "cetearyl olivate",
        "olive-derived emulsifier"
      ],
      "productIds": [
        "fresh-cream-medium"
      ]
    },
    {
      "id": "cetraria-islandica-thallus-extract",
      "inciName": "Cetraria islandica thallus extract",
      "commonName": "Iceland moss extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Iceland moss extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cetraria islandica thallus extract",
        "iceland moss extract"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-foot-balm",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "cetyl-alcohol",
      "inciName": "Cetyl alcohol",
      "commonName": "Fatty alcohol from plant wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "A plant-wax fatty alcohol for texture and emulsion support — another “alcohol” that softens rather than strips.",
      "match": [
        "cetyl alcohol",
        "fatty alcohol from plant wax"
      ],
      "productIds": [
        "fresh-cream-light",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-moisturiser-for-men",
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "cetyl-palmitate",
      "inciName": "Cetyl palmitate",
      "commonName": "Skin-friendly thickener",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Skin-friendly thickener. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "cetyl palmitate",
        "skin-friendly thickener"
      ],
      "productIds": [
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "chlorella-algae-powder",
      "inciName": "Chlorella algae powder",
      "commonName": "Chlorella vulgaris) (sulphites",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Chlorella vulgaris) (sulphites. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "chlorella algae powder",
        "chlorella vulgaris) (sulphites"
      ],
      "productIds": [
        "beyond-spermidine",
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "cholesterol",
      "inciName": "Cholesterol",
      "commonName": "Barrier-strengthening",
      "altNames": [],
      "roles": [
        "barrier"
      ],
      "blurb": "Barrier-strengthening. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "cholesterol",
        "barrier-strengthening"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "choline-and-zinc-ingredients-enzyme-complex-from-fermentation",
      "inciName": "Choline and zinc. INGREDIENTS Enzyme complex from fermentation",
      "commonName": "Amylase, lactase, protease, cellulase, lipase",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Amylase, lactase, protease, cellulase, lipase. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "choline and zinc. ingredients enzyme complex from fermentation",
        "amylase, lactase, protease, cellulase, lipase"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "choline-bitartrate",
      "inciName": "Choline bitartrate",
      "commonName": "Choline bitartrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "choline bitartrate"
      ],
      "productIds": [
        "caps-d-gest",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "chromium-enriched-yeast",
      "inciName": "Chromium-enriched yeast",
      "commonName": "Saccharomyces cerevisiae",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Saccharomyces cerevisiae. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "chromium-enriched yeast",
        "saccharomyces cerevisiae"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "ci-75810",
      "inciName": "CI 75810",
      "commonName": "Chlorophyllin-copper complex",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "Chlorophyllin-copper complex. A mineral pigment, clay, or texture mineral. Ringana uses non-nano minerals in this library’s mineral UV filters and mineral pigments — say “non-nano” when the conversation goes there, and confirm on the current pack.",
      "match": [
        "ci 75810",
        "chlorophyllin-copper complex"
      ],
      "productIds": [
        "adds-repair",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-foot-balm"
      ]
    },
    {
      "id": "ci-77007",
      "inciName": "CI 77007",
      "commonName": "CI 77007",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "A mineral pigment, clay, or texture mineral. Ringana uses non-nano minerals in this library’s mineral UV filters and mineral pigments — say “non-nano” when the conversation goes there, and confirm on the current pack.",
      "match": [
        "ci 77007"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "ci-774",
      "inciName": "CI 774",
      "commonName": "CI 774",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "A mineral pigment, clay, or texture mineral. Ringana uses non-nano minerals in this library’s mineral UV filters and mineral pigments — say “non-nano” when the conversation goes there, and confirm on the current pack.",
      "match": [
        "ci 774"
      ],
      "productIds": [
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "ci-77491",
      "inciName": "CI 77491",
      "commonName": "Iron oxide as a mineral pigment",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "Iron oxide mineral pigment (red/umber tones). Non-nano mineral colorant used for tint and coverage.",
      "match": [
        "ci 77491",
        "iron oxide as a mineral pigment"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "ci-77492",
      "inciName": "CI 77492",
      "commonName": "CI 77492",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "Iron oxide mineral pigment (yellow/ochre tones). Non-nano mineral colorant used for tint and coverage.",
      "match": [
        "ci 77492"
      ],
      "productIds": [
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "ci-77499",
      "inciName": "CI 77499",
      "commonName": "Iron oxide as mineral pigments",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "Iron oxide mineral pigment (black/brown tones). Non-nano mineral colorant used for tint and coverage.",
      "match": [
        "ci 77499",
        "iron oxide as mineral pigments"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "ci-77742",
      "inciName": "CI 77742",
      "commonName": "CI 77742",
      "altNames": [],
      "roles": [
        "colorants"
      ],
      "blurb": "A mineral pigment, clay, or texture mineral. Ringana uses non-nano minerals in this library’s mineral UV filters and mineral pigments — say “non-nano” when the conversation goes there, and confirm on the current pack.",
      "match": [
        "ci 77742"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "ci-77891",
      "inciName": "CI 77891",
      "commonName": "Titanium dioxide as a mineral pigment",
      "altNames": [],
      "roles": [
        "uv",
        "colorants"
      ],
      "blurb": "Titanium dioxide (CI 77891) as a mineral pigment / brightener. Non-nano mineral pigment in Ringana formulas — useful when someone asks about nano concerns in tinted or sun products.",
      "match": [
        "ci 77891",
        "titanium dioxide as a mineral pigment"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-eye-serum",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "cistus-incanus-flower-leaf-stem-extract",
      "inciName": "Cistus incanus flower/leaf/stem extract",
      "commonName": "Antioxidant rock rose extract",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Antioxidant rock rose extract. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "cistus incanus flower/leaf/stem extract",
        "antioxidant rock rose extract"
      ],
      "productIds": [
        "fresh-cream-rich"
      ]
    },
    {
      "id": "citicoline",
      "inciName": "Citicoline",
      "commonName": "Citicoline",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "citicoline"
      ],
      "productIds": [
        "caps-cerebro"
      ]
    },
    {
      "id": "citicoline-and-b-vitamins-from-buckwheat-germ-ingredients-grape-and-blueberry-ex",
      "inciName": "Citicoline and B vitamins from buckwheat germ. INGREDIENTS Grape and blueberry extract",
      "commonName": "Vitis vinifera and Vaccinium angustifolium",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Vitis vinifera and Vaccinium angustifolium. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "citicoline and b vitamins from buckwheat germ. ingredients grape and blueberry extract",
        "vitis vinifera and vaccinium angustifolium"
      ],
      "productIds": [
        "caps-cerebro"
      ]
    },
    {
      "id": "citral",
      "inciName": "Citral°",
      "commonName": "Fragrance allergen (declared)",
      "altNames": [],
      "roles": [
        "fragrance"
      ],
      "blurb": "Fragrance allergen (declared) — A declared fragrance-related entry for label literacy and sensitivity scans. Declared ≠ automatically unsafe; confirm on the current packaging and defer to the person’s own history.",
      "match": [
        "citral°",
        "citral",
        "fragrance allergen (declared)"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "citric-acid",
      "inciName": "Citric acid",
      "commonName": "pH adjuster from citrus",
      "altNames": [
        "Citrate (when buffered / as salts on some labels)"
      ],
      "roles": [
        "other"
      ],
      "blurb": "A citrus-derived acid used mainly to fine-tune pH so the formula stays effective and skin-compatible — not the same job as a leave-on exfoliating acid treatment.",
      "match": [
        "citric acid",
        "ph adjuster from citrus",
        "citrate (when buffered / as salts on some labels)"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cleansing-water",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-light-legs",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "citronellol",
      "inciName": "Citronellol°",
      "commonName": "Fragrance allergen (declared)",
      "altNames": [],
      "roles": [
        "fragrance"
      ],
      "blurb": "A fragrance allergen that must be declared when present above EU thresholds. Not automatically “bad” — it’s transparency. Teach partners to search triggers, then confirm on the current pack.",
      "match": [
        "citronellol°",
        "citronellol",
        "fragrance allergen (declared)"
      ],
      "productIds": [
        "adds-effect",
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-rich",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-hydro-serum",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "citrullus-lanatus-fruit-extract",
      "inciName": "Citrullus lanatus fruit extract",
      "commonName": "Exosomes from watermelon and grapefruit",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Exosomes from watermelon and grapefruit. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "citrullus lanatus fruit extract",
        "exosomes from watermelon and grapefruit"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "citrus-aurantium-dulcis-fruit-water",
      "inciName": "Citrus aurantium dulcis fruit water",
      "commonName": "Orange hydrosol",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Orange hydrosol — a fruit water that frequently appears near the top of Ringana INCI lists, contributing to that “this list makes sense” first impression.",
      "match": [
        "citrus aurantium dulcis fruit water",
        "orange hydrosol"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-cream",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-scrub-face-body",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "citrus-fibre",
      "inciName": "Citrus fibre",
      "commonName": "Citrus sinensis, Citrus limon",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Citrus sinensis, Citrus limon. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "citrus fibre",
        "citrus sinensis, citrus limon"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "citrus-paradisi-fruit-extract",
      "inciName": "Citrus paradisi fruit extract",
      "commonName": "Citrus paradisi fruit extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "citrus paradisi fruit extract"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "cleome-gynandra-leaf-extract",
      "inciName": "Cleome gynandra leaf extract",
      "commonName": "3-in-1 polyphenols from spiderwisp",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "3-in-1 polyphenols from spiderwisp. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cleome gynandra leaf extract",
        "3-in-1 polyphenols from spiderwisp"
      ],
      "productIds": [
        "fresh-cream-light"
      ]
    },
    {
      "id": "coco-caprylate-caprate",
      "inciName": "Coco caprylate/caprate",
      "commonName": "Natural emollient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Natural emollient. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "coco caprylate/caprate",
        "natural emollient"
      ],
      "productIds": [
        "fresh-body-milk-light"
      ]
    },
    {
      "id": "coco-glucoside",
      "inciName": "Coco glucoside",
      "commonName": "Gently cleansing tenside",
      "altNames": [],
      "roles": [
        "surfactant"
      ],
      "blurb": "Gently cleansing tenside. A cleansing helper (tenside) that lets water mix with oils and impurities so rinsing actually cleans. Mild sugar-based systems are a different conversation than harsh detergent cleansers.",
      "match": [
        "coco glucoside",
        "gently cleansing tenside"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-body-wash"
      ]
    },
    {
      "id": "coco-caprylate",
      "inciName": "Coco-caprylate",
      "commonName": "Natural lipid",
      "altNames": [
        "Coconut fatty-acid ester"
      ],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Natural lipid. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "coco-caprylate",
        "natural lipid",
        "coconut fatty-acid ester"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-rich",
        "fresh-eye-cream",
        "fresh-illuminating-enzyme-mask",
        "fresh-skin-perfection",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "coco-caprylate-caprate-2",
      "inciName": "Coco-caprylate/caprate",
      "commonName": "Natural light lipid",
      "altNames": [
        "Coconut fatty-acid ester"
      ],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "A light coconut-derived lipid that softens and helps products glide without a heavy oil feel.",
      "match": [
        "coco-caprylate/caprate",
        "natural light lipid",
        "coconut fatty-acid ester"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-sunscreen-spf-50",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "coco-glucoside-2",
      "inciName": "Coco-Glucoside",
      "commonName": "Coconut oil glucose",
      "altNames": [],
      "roles": [
        "surfactant",
        "oils-lipids"
      ],
      "blurb": "Coconut oil glucose. A cleansing helper (tenside) that lets water mix with oils and impurities so rinsing actually cleans. Mild sugar-based systems are a different conversation than harsh detergent cleansers.",
      "match": [
        "coco-glucoside",
        "coconut oil glucose"
      ],
      "productIds": [
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "cocoa-bean-extract",
      "inciName": "Cocoa bean extract",
      "commonName": "Theobroma cacao",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Theobroma cacao. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cocoa bean extract",
        "theobroma cacao"
      ],
      "productIds": [
        "caps-moodoo"
      ]
    },
    {
      "id": "cocoglycerides",
      "inciName": "Cocoglycerides",
      "commonName": "Plant-derived lipids",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Plant-derived lipids. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "cocoglycerides",
        "plant-derived lipids"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-eye-cream",
        "fresh-illuminating-enzyme-mask",
        "fresh-skin-perfection",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "coconut-milk-powder",
      "inciName": "Coconut milk powder",
      "commonName": "Cocos nucifera",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Cocos nucifera. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "coconut milk powder",
        "cocos nucifera"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "cocos-nucifera-oil",
      "inciName": "Cocos nucifera oil",
      "commonName": "Coconut oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Coconut oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "cocos nucifera oil",
        "coconut oil"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-cream-rich",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-illuminating-enzyme-mask",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "codium-tomentosum-extract",
      "inciName": "Codium tomentosum extract",
      "commonName": "Green alga extract that protects the skin",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Green alga extract that protects the skin. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "codium tomentosum extract",
        "green alga extract that protects the skin"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-foot-balm"
      ]
    },
    {
      "id": "coleus-root-extract",
      "inciName": "Coleus root extract",
      "commonName": "Coleus forskohlii",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Coleus forskohlii. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "coleus root extract",
        "coleus forskohlii"
      ],
      "productIds": [
        "caps-hydro"
      ]
    },
    {
      "id": "common-wheat-extract",
      "inciName": "Common wheat extract",
      "commonName": "Triticum aestivum",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Triticum aestivum. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "common wheat extract",
        "triticum aestivum"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "concentrated-monk-fruit-extract",
      "inciName": "Concentrated monk fruit extract",
      "commonName": "Siraitia grosvenorii",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Siraitia grosvenorii. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "concentrated monk fruit extract",
        "siraitia grosvenorii"
      ],
      "productIds": [
        "ringanachi",
        "ringanadea"
      ]
    },
    {
      "id": "copernicia-cerifera-cera",
      "inciName": "Copernicia cerifera cera",
      "commonName": "Carnauba wax for texturisation",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Carnauba wax for texturisation. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "copernicia cerifera cera",
        "carnauba wax for texturisation"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-illuminating-enzyme-mask",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "copper-bisglycinate",
      "inciName": "Copper bisglycinate",
      "commonName": "Copper bisglycinate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "copper bisglycinate"
      ],
      "productIds": [
        "caps-protect"
      ]
    },
    {
      "id": "copper-lysinate-prolinate",
      "inciName": "Copper lysinate/prolinate",
      "commonName": "Increases collagen and elastin production",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Increases collagen and elastin production. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "copper lysinate/prolinate",
        "increases collagen and elastin production"
      ],
      "productIds": [
        "adds-effect",
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "cordyceps-militaris-extract",
      "inciName": "Cordyceps militaris extract",
      "commonName": "Chinese caterpillar fungus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Chinese caterpillar fungus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cordyceps militaris extract",
        "chinese caterpillar fungus"
      ],
      "productIds": [
        "fresh-toner-pure"
      ]
    },
    {
      "id": "coriandrum-sativum-fruit-extract",
      "inciName": "Coriandrum sativum fruit extract",
      "commonName": "Antioxidant coriander extract",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Antioxidant coriander extract. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "coriandrum sativum fruit extract",
        "antioxidant coriander extract"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "cranberry-and-coleus-root-extract",
      "inciName": "Cranberry and coleus root extract",
      "commonName": "Cranberry and coleus root extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cranberry and coleus root extract"
      ],
      "productIds": [
        "caps-hydro"
      ]
    },
    {
      "id": "cranberry-extract",
      "inciName": "Cranberry extract",
      "commonName": "Vaccinium macrocarpon",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Vaccinium macrocarpon. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cranberry extract",
        "vaccinium macrocarpon"
      ],
      "productIds": [
        "caps-hydro"
      ]
    },
    {
      "id": "crataegus-monogyna-flower-extract",
      "inciName": "Crataegus monogyna flower extract",
      "commonName": "Hawthorn flower extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hawthorn flower extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "crataegus monogyna flower extract",
        "hawthorn flower extract"
      ],
      "productIds": [
        "fresh-eye-serum"
      ]
    },
    {
      "id": "cucumis-sativus-fruit-water",
      "inciName": "Cucumis sativus fruit water",
      "commonName": "Hydrating cucumber juice",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Hydrating cucumber juice. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "cucumis sativus fruit water",
        "hydrating cucumber juice"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow"
      ]
    },
    {
      "id": "cucurbita-pepo-seed-extract",
      "inciName": "Cucurbita pepo seed extract",
      "commonName": "Spermidine-rich pumpkin seed extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Spermidine-rich pumpkin seed extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cucurbita pepo seed extract",
        "spermidine-rich pumpkin seed extract"
      ],
      "productIds": [
        "fresh-eye-serum"
      ]
    },
    {
      "id": "cupressus-sempervirens-cone-extract",
      "inciName": "Cupressus sempervirens cone extract",
      "commonName": "Cypress extract with astringent effect",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cypress extract with astringent effect. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "cupressus sempervirens cone extract",
        "cypress extract with astringent effect"
      ],
      "productIds": [
        "fresh-cleansing-water",
        "fresh-light-legs",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "curcuma-longa-root-extract",
      "inciName": "Curcuma longa root extract",
      "commonName": "Soothing turmeric root extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Soothing turmeric root extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "curcuma longa root extract",
        "soothing turmeric root extract"
      ],
      "productIds": [
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "cyamopsis-tetragonoloba-gum",
      "inciName": "Cyamopsis tetragonoloba gum",
      "commonName": "Plant-derived film former",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived film former. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "cyamopsis tetragonoloba gum",
        "plant-derived film former"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "cyclodextrin",
      "inciName": "Cyclodextrin",
      "commonName": "Improves transport of active ingredients in the skin",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Improves transport of active ingredients in the skin. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "cyclodextrin",
        "improves transport of active ingredients in the skin"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "d-biotin-gluten-free",
      "inciName": "D-biotin. gluten-free",
      "commonName": "D-biotin. gluten-free",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "d-biotin. gluten-free"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "d-ribose",
      "inciName": "D-ribose",
      "commonName": "D-ribose",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "d-ribose"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "damiana-leaf-extract",
      "inciName": "Damiana leaf extract",
      "commonName": "Turnera diffusa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Turnera diffusa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "damiana leaf extract",
        "turnera diffusa"
      ],
      "productIds": [
        "caps-fem",
        "caps-mascu"
      ]
    },
    {
      "id": "dandelion-leaf-and-root-extract",
      "inciName": "Dandelion leaf and root extract",
      "commonName": "Taraxacum officinale",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Taraxacum officinale. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "dandelion leaf and root extract",
        "taraxacum officinale"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "decyl-cocoate",
      "inciName": "Decyl cocoate",
      "commonName": "Coconut-derived moisturizing ester",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "A coconut-derived moisturizing ester that softens and helps textures feel caring.",
      "match": [
        "decyl cocoate",
        "coconut-derived moisturizing ester"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "decyl-glucoside",
      "inciName": "Decyl glucoside",
      "commonName": "Natural glucoside",
      "altNames": [
        "Sugar tenside",
        "Alkyl polyglucoside"
      ],
      "roles": [
        "surfactant"
      ],
      "blurb": "A gently cleansing sugar tenside — helps lift makeup and impurities without the harsh detergent story people often fear when they hear “surfactant.”",
      "match": [
        "decyl glucoside",
        "natural glucoside",
        "sugar tenside",
        "alkyl polyglucoside"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-cream-rich"
      ]
    },
    {
      "id": "dextrose",
      "inciName": "Dextrose",
      "commonName": "Dextrose",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "dextrose"
      ],
      "productIds": [
        "ringanachi",
        "sport-endurance"
      ]
    },
    {
      "id": "dicaprylyl-ether",
      "inciName": "Dicaprylyl ether",
      "commonName": "Oil-soluble component",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Oil-soluble component. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "dicaprylyl ether",
        "oil-soluble component"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-cream",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "diglycerin",
      "inciName": "Diglycerin",
      "commonName": "Plant-based moisturizer",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Plant-based moisturizer. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "diglycerin",
        "plant-based moisturizer"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "diisostearoyl-polyglyceryl-3-dimer-dilinoleate",
      "inciName": "Diisostearoyl polyglyceryl-3 dimer dilinoleate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "diisostearoyl polyglyceryl-3 dimer dilinoleate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "diisostearyl-malate",
      "inciName": "Diisostearyl malate",
      "commonName": "Skin-nurturing",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin-nurturing. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "diisostearyl malate",
        "skin-nurturing"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "dilinoleic-acid-butanediol-copolymer",
      "inciName": "Dilinoleic acid/Butanediol copolymer",
      "commonName": "Nourishing lipid complex",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Nourishing lipid complex. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "dilinoleic acid/butanediol copolymer",
        "nourishing lipid complex"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-light",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "dilinoleic-acid-propanediol-copolymer",
      "inciName": "Dilinoleic acid/Propanediol copolymer",
      "commonName": "Natural polymer",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Natural polymer. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "dilinoleic acid/propanediol copolymer",
        "natural polymer"
      ],
      "productIds": [
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "dipeptide-diaminobutyroyl-benzylamide-diacetate",
      "inciName": "Dipeptide diaminobutyroyl benzylamide diacetate",
      "commonName": "Dipeptide diaminobutyroyl benzylamide diacetate",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "dipeptide diaminobutyroyl benzylamide diacetate"
      ],
      "productIds": [
        "adds-effect"
      ]
    },
    {
      "id": "dipeptide-2",
      "inciName": "Dipeptide-2",
      "commonName": "Smoothing and firming peptide complex",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Smoothing and firming peptide complex. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "dipeptide-2",
        "smoothing and firming peptide complex"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "dipotassium-glycyrrhizate",
      "inciName": "Dipotassium glycyrrhizate",
      "commonName": "Skin soothing substance from liquorice root",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin soothing substance from liquorice root. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "dipotassium glycyrrhizate",
        "skin soothing substance from liquorice root"
      ],
      "productIds": [
        "adds-glow",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-cream-light",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "disodium-cocoyl-glutamate",
      "inciName": "Disodium cocoyl glutamate",
      "commonName": "Amino acid-based, mild tenside",
      "altNames": [],
      "roles": [
        "surfactant",
        "amino-nmf"
      ],
      "blurb": "Amino acid-based, mild tenside. A cleansing helper (tenside) that lets water mix with oils and impurities so rinsing actually cleans. Mild sugar-based systems are a different conversation than harsh detergent cleansers.",
      "match": [
        "disodium cocoyl glutamate",
        "amino acid-based, mild tenside"
      ],
      "productIds": [
        "fresh-body-wash",
        "fresh-illuminating-enzyme-mask",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "dried-microalgae-tetraselmis-chuii",
      "inciName": "Dried microalgae Tetraselmis chuii",
      "commonName": "Sulphites",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Sulphites. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "dried microalgae tetraselmis chuii",
        "sulphites"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "ectoin",
      "inciName": "Ectoin",
      "commonName": "Moisture-binding stress-protectant",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "A moisture-binding stress-protectant molecule. Often discussed for helping skin cope with environmental stress while staying hydrated.",
      "match": [
        "ectoin",
        "moisture-binding stress-protectant"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-body-hair-wash",
        "fresh-body-milk-rich",
        "fresh-cream-medium",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-skin-perfection",
        "fresh-stay-fresh",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "emulsifier-mono-and-diglycerides-of-fatty-acids",
      "inciName": "Emulsifier: mono- and diglycerides of fatty acids",
      "commonName": "Emulsifier: mono- and diglycerides of fatty acids",
      "altNames": [],
      "roles": [
        "supplement"
      ],
      "blurb": "Appears in supplement / capsule contexts. For ingestion products, stick to Ringana’s on-pack directions and important information — this guide is partner education, not medical advice.",
      "match": [
        "emulsifier: mono- and diglycerides of fatty acids"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "emulsifier-sunflower-lecithin",
      "inciName": "Emulsifier: sunflower lecithin",
      "commonName": "Gluten); willowherb extract (Epilobium angustifolium",
      "altNames": [],
      "roles": [
        "supplement"
      ],
      "blurb": "Gluten); willowherb extract (Epilobium angustifolium. Appears in supplement / capsule contexts. For ingestion products, stick to Ringana’s on-pack directions and important information — this guide is partner education, not medical advice.",
      "match": [
        "emulsifier: sunflower lecithin",
        "gluten); willowherb extract (epilobium angustifolium"
      ],
      "productIds": [
        "beyond-omega",
        "caps-mascu",
        "ringanabty"
      ]
    },
    {
      "id": "encapsulated-melon-juice-concentrate-enzymatically-fermented-guar-bean-fibre",
      "inciName": "Encapsulated melon juice concentrate [enzymatically fermented guar bean fibre",
      "commonName": "Cyamopsis tetragonoloba",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cyamopsis tetragonoloba. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "encapsulated melon juice concentrate [enzymatically fermented guar bean fibre",
        "cyamopsis tetragonoloba"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "encapsulated-melon-juice-concentrate-enzymatically-fermented-guar-gum",
      "inciName": "Encapsulated melon juice concentrate [enzymatically fermented guar gum",
      "commonName": "Cyamopsis tetragonoloba",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cyamopsis tetragonoloba. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "encapsulated melon juice concentrate [enzymatically fermented guar gum",
        "cyamopsis tetragonoloba"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "enzymatically-fermented-guar-bean-fibre",
      "inciName": "Enzymatically fermented guar bean fibre",
      "commonName": "Cyamopsis tetragonoloba",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cyamopsis tetragonoloba. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "enzymatically fermented guar bean fibre",
        "cyamopsis tetragonoloba"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "enzymatically-fermented-guar-gum",
      "inciName": "Enzymatically fermented guar gum",
      "commonName": "Cyamopsis tetragonoloba",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cyamopsis tetragonoloba. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "enzymatically fermented guar gum",
        "cyamopsis tetragonoloba"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "epigallocatechin-gallatyl-glucoside",
      "inciName": "Epigallocatechin gallatyl glucoside",
      "commonName": "EGCG from green tea",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "EGCG from green tea. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "epigallocatechin gallatyl glucoside",
        "egcg from green tea"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "epilobium-fleischeri-leaf-stem-extract",
      "inciName": "Epilobium fleischeri leaf/stem extract",
      "commonName": "Senolytic active ingredient extracted from Alpine willowherb",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Senolytic active ingredient extracted from Alpine willowherb. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "epilobium fleischeri leaf/stem extract",
        "senolytic active ingredient extracted from alpine willowherb"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "equisetum-arvense-extract",
      "inciName": "Equisetum arvense extract",
      "commonName": "Soothing extract of common horsetail",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Soothing extract of common horsetail. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "equisetum arvense extract",
        "soothing extract of common horsetail"
      ],
      "productIds": [
        "fresh-cleansing-water",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "erythrulose",
      "inciName": "Erythrulose",
      "commonName": "Gently tanning substance",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Gently tanning substance. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "erythrulose",
        "gently tanning substance"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow"
      ]
    },
    {
      "id": "ethyl-oleate",
      "inciName": "Ethyl oleate",
      "commonName": "Shea ester for a silky skin-feel",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Shea ester for a silky skin-feel. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "ethyl oleate",
        "shea ester for a silky skin-feel"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "ethyl-stearate",
      "inciName": "Ethyl stearate",
      "commonName": "Shea ester for a silky skin-feel",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Shea ester for a silky skin-feel. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "ethyl stearate",
        "shea ester for a silky skin-feel"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "fagus-sylvatica-bud-extract",
      "inciName": "Fagus sylvatica bud extract",
      "commonName": "Beech tree bud extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Beech tree bud extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "fagus sylvatica bud extract",
        "beech tree bud extract"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "fennel-seed-powder",
      "inciName": "Fennel seed powder",
      "commonName": "Foeniculum vulgare",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Foeniculum vulgare. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "fennel seed powder",
        "foeniculum vulgare"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "fermented-ginger-extract",
      "inciName": "Fermented ginger extract",
      "commonName": "Zingiber officinale",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Zingiber officinale. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "fermented ginger extract",
        "zingiber officinale"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "ferulic-acid",
      "inciName": "Ferulic acid",
      "commonName": "Ferulic acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "ferulic acid"
      ],
      "productIds": [
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "fibre-and-vitamins-ingredients-enzymatically-fermented-guar-bean-fibre",
      "inciName": "Fibre and vitamins. INGREDIENTS Enzymatically fermented guar bean fibre",
      "commonName": "Cyamopsis tetragonoloba",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Cyamopsis tetragonoloba. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "fibre and vitamins. ingredients enzymatically fermented guar bean fibre",
        "cyamopsis tetragonoloba"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "fibres",
      "inciName": "Fibres",
      "commonName": "Fibres",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "fibres"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "field-horsetail-leaf-extract",
      "inciName": "Field horsetail leaf extract",
      "commonName": "Equisetum arvense",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Equisetum arvense. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "field horsetail leaf extract",
        "equisetum arvense"
      ],
      "productIds": [
        "caps-move"
      ]
    },
    {
      "id": "folic-acid-and-secondary-plant-substances-ingredients-magnesium-citrate",
      "inciName": "Folic acid and secondary plant substances. INGREDIENTS Magnesium citrate",
      "commonName": "Folic acid and secondary plant substances. INGREDIENTS Magnesium citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "folic acid and secondary plant substances. ingredients magnesium citrate"
      ],
      "productIds": [
        "caps-fem"
      ]
    },
    {
      "id": "food-supplement-based-on-vegan-protein-with-hesperidin-from-watts-up-orange-extr",
      "inciName": "Food supplement based on vegan protein with hesperidin from WATTS’UP® orange extract",
      "commonName": "Food supplement based on vegan protein with hesperidin from WATTS’UP® orange extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "food supplement based on vegan protein with hesperidin from watts’up® orange extract"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "food-supplement-in-powder-form-for-preparing-a-carbohydrate-electrolyte-solution",
      "inciName": "Food supplement in powder form for preparing a carbohydrate-electrolyte solution with plant substances",
      "commonName": "Food supplement in powder form for preparing a carbohydrate-electrolyte solution with plant substances",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "food supplement in powder form for preparing a carbohydrate-electrolyte solution with plant substances"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "food-supplement-with-fibre",
      "inciName": "Food supplement with fibre",
      "commonName": "Food supplement with fibre",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "food supplement with fibre"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "food-supplement-with-fruit-powder-and-extracts",
      "inciName": "Food supplement with fruit powder and extracts",
      "commonName": "Food supplement with fruit powder and extracts",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "food supplement with fruit powder and extracts"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "food-supplement-with-vegetable-and-algae-powder",
      "inciName": "Food supplement with vegetable and algae powder",
      "commonName": "Food supplement with vegetable and algae powder",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "food supplement with vegetable and algae powder"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "frankincense-resin-extract",
      "inciName": "Frankincense resin extract",
      "commonName": "Boswellia serrata",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Boswellia serrata. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "frankincense resin extract",
        "boswellia serrata"
      ],
      "productIds": [
        "caps-move"
      ]
    },
    {
      "id": "fructooligosaccharides",
      "inciName": "Fructooligosaccharides",
      "commonName": "Skin-grooming substance",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin-grooming substance. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "fructooligosaccharides",
        "skin-grooming substance"
      ],
      "productIds": [
        "fresh-hydro-serum",
        "ringanabty",
        "ringanadea"
      ]
    },
    {
      "id": "fructose",
      "inciName": "Fructose",
      "commonName": "Fruit sugar",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Fruit sugar. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "fructose",
        "fruit sugar"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-light-legs",
        "fresh-moisturiser-for-men",
        "fresh-repair-shampoo",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket"
      ]
    },
    {
      "id": "fruit-powder",
      "inciName": "Fruit powder",
      "commonName": "Fruit powder",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "fruit powder"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "fruit-powders",
      "inciName": "Fruit powders",
      "commonName": "Fruit powders",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "fruit powders"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "fucoidan-extract-from-the-seaweed-undaria-pinnatifida",
      "inciName": "Fucoidan extract from the seaweed Undaria pinnatifida",
      "commonName": "Fucoidan extract from the seaweed Undaria pinnatifida",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "fucoidan extract from the seaweed undaria pinnatifida"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "galangal-root-extract",
      "inciName": "Galangal root extract",
      "commonName": "Alpinia galanga",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Alpinia galanga. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "galangal root extract",
        "alpinia galanga"
      ],
      "productIds": [
        "sport-push"
      ]
    },
    {
      "id": "ganoderma-lucidum-extract",
      "inciName": "Ganoderma lucidum extract",
      "commonName": "Ganoderma lucidum extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ganoderma lucidum extract"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "gellan-gum",
      "inciName": "Gellan gum",
      "commonName": "Natural thickening agent",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Natural thickening agent. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "gellan gum",
        "natural thickening agent"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow"
      ]
    },
    {
      "id": "geraniol",
      "inciName": "Geraniol°",
      "commonName": "Fragrance allergen (declared)",
      "altNames": [],
      "roles": [
        "fragrance"
      ],
      "blurb": "A declared fragrance allergen often linked to rose-family scent notes. Helpful for sensitivity scans; never diagnose — point to the pack and the person’s own history.",
      "match": [
        "geraniol°",
        "geraniol",
        "fragrance allergen (declared)"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-rich",
        "fresh-cream-medium",
        "fresh-light-legs"
      ]
    },
    {
      "id": "geraniol-i",
      "inciName": "Geraniol° I",
      "commonName": "Geraniol° I",
      "altNames": [],
      "roles": [
        "fragrance"
      ],
      "blurb": "A declared fragrance-related entry for label literacy and sensitivity scans. Declared ≠ automatically unsafe; confirm on the current packaging and defer to the person’s own history.",
      "match": [
        "geraniol° i",
        "geraniol i"
      ],
      "productIds": [
        "fresh-cream-rich"
      ]
    },
    {
      "id": "ginger-extract",
      "inciName": "Ginger extract",
      "commonName": "Zingiber officinale",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Zingiber officinale. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ginger extract",
        "zingiber officinale"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "ginkgo-biloba-leaf-extract",
      "inciName": "Ginkgo biloba leaf extract",
      "commonName": "Ginkgo leaf extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Ginkgo leaf extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ginkgo biloba leaf extract",
        "ginkgo leaf extract"
      ],
      "productIds": [
        "fresh-cleanser"
      ]
    },
    {
      "id": "ginseng-root-extract",
      "inciName": "Ginseng root extract",
      "commonName": "Panax ginseng",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Panax ginseng. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ginseng root extract",
        "panax ginseng"
      ],
      "productIds": [
        "caps-mascu",
        "ringanabty",
        "ringanachi",
        "sport-push"
      ]
    },
    {
      "id": "glazing-agent-carnauba-wax",
      "inciName": "Glazing agent: carnauba wax",
      "commonName": "Glazing agent: carnauba wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "glazing agent: carnauba wax"
      ],
      "productIds": [
        "caps-beauty-hair",
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "gleditsia-triacanthos-seed-extract",
      "inciName": "Gleditsia triacanthos seed extract",
      "commonName": "Honey locust extract with instant firming effect",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Honey locust extract with instant firming effect. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "gleditsia triacanthos seed extract",
        "honey locust extract with instant firming effect"
      ],
      "productIds": [
        "adds-effect",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "globularia-alypum-leaf-extract",
      "inciName": "Globularia alypum leaf extract",
      "commonName": "Anti-inflammatory globularia extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Anti-inflammatory globularia extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "globularia alypum leaf extract",
        "anti-inflammatory globularia extract"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow"
      ]
    },
    {
      "id": "gluconolactone",
      "inciName": "Gluconolactone",
      "commonName": "Gentle PHA moisturizer / exfoliant support",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "A gentle PHA that can moisturize while offering mild surface renewal — softer story than classic strong AHAs when used thoughtfully.",
      "match": [
        "gluconolactone",
        "gentle pha moisturizer / exfoliant support"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-foot-balm",
        "fresh-illuminating-enzyme-mask",
        "fresh-repair-shampoo",
        "fresh-stay-fresh",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "glucose",
      "inciName": "Glucose",
      "commonName": "Sugar moisturizing support",
      "altNames": [],
      "roles": [
        "moisturizer",
        "preservation"
      ],
      "blurb": "A simple sugar used for moisturizing support and as part of skin-friendly carbohydrate complexes.",
      "match": [
        "glucose",
        "sugar moisturizing support"
      ],
      "productIds": [
        "fresh-cream-light",
        "fresh-hair-treatment",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-soap-liquid",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "glucosyl-hesperidin",
      "inciName": "Glucosyl hesperidin",
      "commonName": "Bioflavonoids from lemon peel",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Bioflavonoids from lemon peel. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "glucosyl hesperidin",
        "bioflavonoids from lemon peel"
      ],
      "productIds": [
        "adds-glow",
        "fresh-cleansing-water"
      ]
    },
    {
      "id": "glutamine",
      "inciName": "Glutamine",
      "commonName": "Skin-nourishing amino acid",
      "altNames": [],
      "roles": [
        "amino-nmf"
      ],
      "blurb": "Skin-nourishing amino acid. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "glutamine",
        "skin-nourishing amino acid"
      ],
      "productIds": [
        "fresh-cream-rich"
      ]
    },
    {
      "id": "glutathione",
      "inciName": "Glutathione",
      "commonName": "Skin-lightening peptide",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Skin-lightening peptide. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "glutathione",
        "skin-lightening peptide"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "glycerin",
      "inciName": "Glycerin",
      "commonName": "Plant-derived moisturizer",
      "altNames": [
        "Glycerine",
        "Glycerol"
      ],
      "roles": [
        "moisturizer"
      ],
      "blurb": "A classic plant-derived humectant — pulls and holds moisture so skin and formulas feel comfortable. One of the most common “why is this here?” answers on any honest label.",
      "match": [
        "glycerin",
        "plant-derived moisturizer",
        "glycerine",
        "glycerol"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-baby-tooth-gel",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-light-legs",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-skin-perfection",
        "fresh-soap",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "glyceryl-behenate",
      "inciName": "Glyceryl behenate",
      "commonName": "Skin-barrier-strengthening active ingredients",
      "altNames": [],
      "roles": [
        "barrier"
      ],
      "blurb": "Skin-barrier-strengthening active ingredients. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "glyceryl behenate",
        "skin-barrier-strengthening active ingredients"
      ],
      "productIds": [
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "glyceryl-caprylate",
      "inciName": "Glyceryl caprylate",
      "commonName": "Natural emulsifier / mild preserving support",
      "altNames": [
        "Glyceryl monocaprylate"
      ],
      "roles": [
        "emulsifier",
        "preservation",
        "oils-lipids"
      ],
      "blurb": "A gentle plant-minded ester that helps creams feel even and offers mild freshness support — another “why is this here?” answer on natural-leaning labels.",
      "match": [
        "glyceryl caprylate",
        "natural emulsifier / mild preserving support",
        "glyceryl monocaprylate"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-serum",
        "fresh-illuminating-enzyme-mask",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "glyceryl-caprylate-2",
      "inciName": "Glyceryl caprylate)",
      "commonName": "Glyceryl caprylate)",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "glyceryl caprylate)"
      ],
      "productIds": [
        "fresh-hand-balm",
        "fresh-hand-balm-pocket"
      ]
    },
    {
      "id": "glyceryl-dibehenate",
      "inciName": "Glyceryl dibehenate",
      "commonName": "Thickener",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Thickener. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "glyceryl dibehenate",
        "thickener"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "glyceryl-glucoside",
      "inciName": "Glyceryl glucoside",
      "commonName": "Polysaccharide with anti-stress properties",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Polysaccharide with anti-stress properties. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "glyceryl glucoside",
        "polysaccharide with anti-stress properties"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "glyceryl-laurate",
      "inciName": "Glyceryl laurate",
      "commonName": "For supple hair",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "For supple hair. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "glyceryl laurate",
        "for supple hair"
      ],
      "productIds": [
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "glyceryl-linoleate",
      "inciName": "Glyceryl linoleate",
      "commonName": "Glyceryl linoleate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "glyceryl linoleate"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "glyceryl-linolenate",
      "inciName": "Glyceryl linolenate",
      "commonName": "Glyceryl linolenate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "glyceryl linolenate"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "glyceryl-oleate",
      "inciName": "Glyceryl oleate",
      "commonName": "Glyceryl oleate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "glyceryl oleate"
      ],
      "productIds": [
        "fresh-baby-cream"
      ]
    },
    {
      "id": "glyceryl-stearate",
      "inciName": "Glyceryl stearate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "glyceryl stearate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-eye-cream",
        "fresh-foot-balm",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection",
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "glyceryl-stearate-citrate",
      "inciName": "Glyceryl stearate citrate",
      "commonName": "Plant-derived emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier",
        "oils-lipids"
      ],
      "blurb": "A plant-derived emulsifier (often from rapeseed on Ringana labels) that keeps oil and water blended so creams feel even from first pump to last. Readable emulsifiers are a teaching moment, not an automatic red flag.",
      "match": [
        "glyceryl stearate citrate",
        "plant-derived emulsifier"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-eye-serum",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "glycine-soja-oil",
      "inciName": "Glycine soja oil",
      "commonName": "Soybean oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Soybean oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "glycine soja oil",
        "soybean oil"
      ],
      "productIds": [
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "glycolipids",
      "inciName": "Glycolipids",
      "commonName": "Skin barrier lipids",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "Skin barrier lipids. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "glycolipids",
        "skin barrier lipids"
      ],
      "productIds": [
        "fresh-cream-medium"
      ]
    },
    {
      "id": "glycosphingolipids",
      "inciName": "Glycosphingolipids",
      "commonName": "Skin barrier lipids",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "Skin barrier lipids. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "glycosphingolipids",
        "skin barrier lipids"
      ],
      "productIds": [
        "fresh-cream-medium"
      ]
    },
    {
      "id": "glycyrrhiza-glabra-root-extract",
      "inciName": "Glycyrrhiza glabra root extract",
      "commonName": "Skin‑soothing active ingredient from licorice root",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin‑soothing active ingredient from licorice root. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "glycyrrhiza glabra root extract",
        "skin‑soothing active ingredient from licorice root"
      ],
      "productIds": [
        "adds-repair",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket"
      ]
    },
    {
      "id": "gold",
      "inciName": "Gold",
      "commonName": "Colloidal gold",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Colloidal gold. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "gold",
        "colloidal gold"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "golden-flax-powder-linum-usitatissimum",
      "inciName": "Golden flax powder (Linum usitatissimum)]",
      "commonName": "Golden flax powder (Linum usitatissimum)]",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "golden flax powder (linum usitatissimum)]"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "gossypium-arboreum-leaf-cell-extract",
      "inciName": "Gossypium arboreum leaf cell extract",
      "commonName": "Soothing cotton cell extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Soothing cotton cell extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "gossypium arboreum leaf cell extract",
        "soothing cotton cell extract"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "gossypium-herbaceum-callus-culture",
      "inciName": "Gossypium herbaceum callus culture",
      "commonName": "Soothing cotton cell extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Soothing cotton cell extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "gossypium herbaceum callus culture",
        "soothing cotton cell extract"
      ],
      "productIds": [
        "fresh-stay-fresh"
      ]
    },
    {
      "id": "gossypium-herbaceum-leaf-cell-extract",
      "inciName": "Gossypium herbaceum leaf cell extract",
      "commonName": "Soothing cotton cell extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Soothing cotton cell extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "gossypium herbaceum leaf cell extract",
        "soothing cotton cell extract"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash"
      ]
    },
    {
      "id": "gossypium-herbaceum-seed-oil",
      "inciName": "Gossypium herbaceum seed oil",
      "commonName": "Cottonseed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cottonseed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "gossypium herbaceum seed oil",
        "cottonseed oil"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "gotu-kola-extract",
      "inciName": "Gotu kola extract",
      "commonName": "Centella asiatica",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Centella asiatica. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "gotu kola extract",
        "centella asiatica"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "grape-flesh-and-apple-peel-extract",
      "inciName": "Grape flesh and apple peel extract",
      "commonName": "Sulphites) (Vitis vinifera, Malus pumila",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Sulphites) (Vitis vinifera, Malus pumila. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "grape flesh and apple peel extract",
        "sulphites) (vitis vinifera, malus pumila"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "grape-seed-and-skin-extract",
      "inciName": "Grape seed and skin extract",
      "commonName": "Vitis vinifera",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Vitis vinifera. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "grape seed and skin extract",
        "vitis vinifera"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "green-oat-extract",
      "inciName": "Green oat extract",
      "commonName": "Avena sativa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Avena sativa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "green oat extract",
        "avena sativa"
      ],
      "productIds": [
      ]
    },
    {
      "id": "green-tea-extract",
      "inciName": "Green tea extract",
      "commonName": "Camellia sinensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Camellia sinensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "green tea extract",
        "camellia sinensis"
      ],
      "productIds": [
        "caps-moodoo",
        "caps-protect"
      ]
    },
    {
      "id": "guar-hydroxypropyltrimonium-chloride",
      "inciName": "Guar hydroxypropyltrimonium chloride",
      "commonName": "Antistatic ingredient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Antistatic ingredient. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "guar hydroxypropyltrimonium chloride",
        "antistatic ingredient"
      ],
      "productIds": [
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "guarana-seed-extract",
      "inciName": "Guarana seed extract",
      "commonName": "Paullinia cupana",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Paullinia cupana. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "guarana seed extract",
        "paullinia cupana"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "gynostemma-pentaphyllum-leaf-stem-extract",
      "inciName": "Gynostemma pentaphyllum leaf/stem extract",
      "commonName": "Extract from jiaogulan – immortality plant",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Extract from jiaogulan – immortality plant. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "gynostemma pentaphyllum leaf/stem extract",
        "extract from jiaogulan – immortality plant"
      ],
      "productIds": [
        "fresh-cream-rich"
      ]
    },
    {
      "id": "haematococcus-pluvialis-extract",
      "inciName": "Haematococcus pluvialis extract",
      "commonName": "Cell-protecting alga extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cell-protecting alga extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "haematococcus pluvialis extract",
        "cell-protecting alga extract"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-cream-rich",
        "fresh-repair-shampoo",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "hamamelis-virginiana-leaf-extract",
      "inciName": "Hamamelis virginiana leaf extract",
      "commonName": "Witch hazel extract that stimulates circulation",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Witch hazel extract that stimulates circulation. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hamamelis virginiana leaf extract",
        "witch hazel extract that stimulates circulation"
      ],
      "productIds": [
        "adds-effect",
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-light-legs",
        "fresh-stay-fresh",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "hectorite",
      "inciName": "Hectorite",
      "commonName": "Mineral thickener",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Hectorite — a mineral thickener/rheology helper. Non-nano mineral texture support.",
      "match": [
        "hectorite",
        "mineral thickener"
      ],
      "productIds": [
        "fresh-eye-serum"
      ]
    },
    {
      "id": "helianthus-annuus-seed-cera",
      "inciName": "Helianthus annuus seed cera",
      "commonName": "Sunflower seed wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Sunflower seed wax. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "helianthus annuus seed cera",
        "sunflower seed wax",
        "sunflower wax"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-body-milk-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "helianthus-annuus-seed-oil",
      "inciName": "Helianthus annuus seed oil",
      "commonName": "Sunflower oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Sunflower seed oil — a lightweight plant oil rich in fatty acids that softens and supports comfortable skin feel. Very common across leave-on care.",
      "match": [
        "helianthus annuus seed oil",
        "sunflower oil"
      ],
      "productIds": [
        "adds-glow",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-illuminating-enzyme-mask",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-soap-liquid",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "helianthus-annuus-seed-oil-unsaponifiables",
      "inciName": "Helianthus annuus seed oil unsaponifiables",
      "commonName": "Skin-grooming substances from sunflower oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Skin-grooming substances from sunflower oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "helianthus annuus seed oil unsaponifiables",
        "skin-grooming substances from sunflower oil"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "heptyl-glucoside",
      "inciName": "Heptyl glucoside",
      "commonName": "Gently cleansing sugar tenside",
      "altNames": [],
      "roles": [
        "surfactant"
      ],
      "blurb": "A mild sugar-based cleanser used in gentle wash-off and micellar-style formulas. Good example of “tenside” language that still reads kind on a label.",
      "match": [
        "heptyl glucoside",
        "gently cleansing sugar tenside"
      ],
      "productIds": [
        "fresh-cleansing-water"
      ]
    },
    {
      "id": "heptyl-undecylenate",
      "inciName": "Heptyl undecylenate",
      "commonName": "Skin-nurturing agent based on castor oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Skin-nurturing agent based on castor oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "heptyl undecylenate",
        "skin-nurturing agent based on castor oil"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-skin-perfection",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "herbal-extracts",
      "inciName": "Herbal extracts",
      "commonName": "Herbal extracts",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "herbal extracts"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "hericium-erinaceum-extract",
      "inciName": "Hericium erinaceum extract",
      "commonName": "Lion’s mane mushroom",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Lion’s mane mushroom. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hericium erinaceum extract",
        "lion’s mane mushroom"
      ],
      "productIds": [
        "fresh-toner-pure"
      ]
    },
    {
      "id": "hexapeptide-11",
      "inciName": "Hexapeptide-11",
      "commonName": "Skin-firming peptide",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "A skin-firming peptide that shows up in firmness / elasticity conversations — pair with the product’s study notes when available.",
      "match": [
        "hexapeptide-11",
        "skin-firming peptide"
      ],
      "productIds": [
        "adds-glow",
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "hibiscus-abelmoschus-seed-extract",
      "inciName": "Hibiscus abelmoschus seed extract",
      "commonName": "Grooming musk extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Grooming musk extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hibiscus abelmoschus seed extract",
        "grooming musk extract"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "hibiscus-flower",
      "inciName": "Hibiscus flower",
      "commonName": "Hibiscus flower",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "hibiscus flower"
      ],
      "productIds": [
        "caps-hydro"
      ]
    },
    {
      "id": "hibiscus-flower-extract",
      "inciName": "Hibiscus flower extract",
      "commonName": "Hibiscus sabdariffa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hibiscus sabdariffa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hibiscus flower extract",
        "hibiscus sabdariffa"
      ],
      "productIds": [
        "caps-hydro",
        "ringanadea"
      ]
    },
    {
      "id": "hibiscus-sabdariffa-flower-extract",
      "inciName": "Hibiscus sabdariffa flower extract",
      "commonName": "Extract from wild hibiscus flowers",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Extract from wild hibiscus flowers. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hibiscus sabdariffa flower extract",
        "extract from wild hibiscus flowers"
      ],
      "productIds": [
        "fresh-cleansing-water",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "hickening-agent-gum-arabic-and-xanthan",
      "inciName": "Hickening agent: gum arabic and xanthan",
      "commonName": "Hickening agent: gum arabic and xanthan",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "hickening agent: gum arabic and xanthan"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "highly-branched-maltodextrin",
      "inciName": "Highly branched maltodextrin",
      "commonName": "Highly branched maltodextrin",
      "altNames": [],
      "roles": [
        "supplement"
      ],
      "blurb": "Appears in supplement / capsule contexts. For ingestion products, stick to Ringana’s on-pack directions and important information — this guide is partner education, not medical advice.",
      "match": [
        "highly branched maltodextrin"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "hippophae-rhamnoides-extract",
      "inciName": "Hippophae rhamnoides extract",
      "commonName": "Upcycled, soothing sea buckthorn extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Upcycled, soothing sea buckthorn extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hippophae rhamnoides extract",
        "upcycled, soothing sea buckthorn extract"
      ],
      "productIds": [
        "adds-repair",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "honeybush-leaf-extract",
      "inciName": "Honeybush leaf extract",
      "commonName": "Cyclopia longifolia, Cyclopia subternata",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cyclopia longifolia, Cyclopia subternata. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "honeybush leaf extract",
        "cyclopia longifolia, cyclopia subternata"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "hop-blossom-extract",
      "inciName": "Hop blossom extract",
      "commonName": "Humulus lupulus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Humulus lupulus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hop blossom extract",
        "humulus lupulus"
      ],
      "productIds": [
      ]
    },
    {
      "id": "hydrated-silica",
      "inciName": "Hydrated silica",
      "commonName": "Gentle cleansing grains",
      "altNames": [],
      "roles": [
        "minerals"
      ],
      "blurb": "Hydrated silica — often used as gentle cleansing grains or texture support. Mineral and non-nano in Ringana’s framing for mineral ingredients.",
      "match": [
        "hydrated silica",
        "gentle cleansing grains"
      ],
      "productIds": [
        "fresh-baby-tooth-gel"
      ]
    },
    {
      "id": "hydrogenated-castor-oil-sebacic-acid-copolymer",
      "inciName": "Hydrogenated castor oil/Sebacic acid copolymer",
      "commonName": "Natural polymers",
      "altNames": [],
      "roles": [
        "thickener",
        "oils-lipids"
      ],
      "blurb": "Natural polymers. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "hydrogenated castor oil/sebacic acid copolymer",
        "natural polymers"
      ],
      "productIds": [
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "hydrogenated-ethylhexyl-olivate",
      "inciName": "Hydrogenated ethylhexyl olivate",
      "commonName": "Plant-derived lipids",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Plant-derived lipids. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "hydrogenated ethylhexyl olivate",
        "plant-derived lipids"
      ],
      "productIds": [
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "hydrogenated-lecithin",
      "inciName": "Hydrogenated lecithin",
      "commonName": "Plant Membrane component",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant Membrane component. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydrogenated lecithin",
        "plant membrane component"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-medium"
      ]
    },
    {
      "id": "hydrogenated-olive-oil",
      "inciName": "Hydrogenated olive oil",
      "commonName": "Film‑forming",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Film‑forming. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "hydrogenated olive oil",
        "film‑forming"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "hydrogenated-olive-oil-stearyl-esters",
      "inciName": "Hydrogenated olive oil stearyl esters",
      "commonName": "Texturising olive oil esters",
      "altNames": [],
      "roles": [
        "emulsifier",
        "oils-lipids"
      ],
      "blurb": "Texturising olive oil esters. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "hydrogenated olive oil stearyl esters",
        "texturising olive oil esters"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "hydrogenated-olive-oil-unsaponifiables",
      "inciName": "Hydrogenated olive oil unsaponifiables",
      "commonName": "Nourishing olive oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Nourishing olive oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "hydrogenated olive oil unsaponifiables",
        "nourishing olive oil"
      ],
      "productIds": [
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "hydrogenated-palm-glycerides-citrate",
      "inciName": "Hydrogenated palm glycerides citrate",
      "commonName": "Hydrogenated palm glycerides citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "hydrogenated palm glycerides citrate"
      ],
      "productIds": [
        "fresh-baby-cream"
      ]
    },
    {
      "id": "hydrogenated-rapeseed-oil",
      "inciName": "Hydrogenated rapeseed oil",
      "commonName": "Hydrogenated rapeseed oil",
      "altNames": [],
      "roles": [
        "thickener",
        "oils-lipids"
      ],
      "blurb": "A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "hydrogenated rapeseed oil"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-cream-medium",
        "fresh-foot-balm",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "hydrogenated-vegetable-glycerides",
      "inciName": "Hydrogenated vegetable glycerides",
      "commonName": "Thickener",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Thickener. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "hydrogenated vegetable glycerides",
        "thickener"
      ],
      "productIds": [
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "hydrolysed-corn-protein",
      "inciName": "Hydrolysed corn protein",
      "commonName": "Grooming corn proteins",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Grooming corn proteins. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydrolysed corn protein",
        "grooming corn proteins"
      ],
      "productIds": [
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "hydrolysed-hyaluronic-acid",
      "inciName": "Hydrolysed hyaluronic acid",
      "commonName": "Hyaluronic acid (hydrolysed)",
      "altNames": [
        "HA"
      ],
      "roles": [
        "hyaluronic"
      ],
      "blurb": "A smaller-piece (hydrolysed) hyaluronic acid that can support hydration in the skin’s surface layers — often paired with classic sodium hyaluronate for a fuller moisture story.",
      "match": [
        "hydrolysed hyaluronic acid",
        "hyaluronic acid (hydrolysed)",
        "ha"
      ],
      "productIds": [
        "adds-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-light",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-overnight-face-treatment",
        "fresh-skin-perfection",
        "fresh-sunscreen-face",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "hydrolysed-soy-protein",
      "inciName": "Hydrolysed soy protein",
      "commonName": "Grooming soya proteins",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Grooming soya proteins. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydrolysed soy protein",
        "grooming soya proteins"
      ],
      "productIds": [
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "hydrolysed-walnut-extract",
      "inciName": "Hydrolysed walnut extract",
      "commonName": "Walnut extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Walnut extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hydrolysed walnut extract",
        "walnut extract"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "hydrolyzed-acacia-macrostachya-seed-extract",
      "inciName": "Hydrolyzed acacia macrostachya seed extract",
      "commonName": "Peptide extract from acacia",
      "altNames": [],
      "roles": [
        "peptide",
        "extracts-ferments"
      ],
      "blurb": "Peptide extract from acacia. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "hydrolyzed acacia macrostachya seed extract",
        "peptide extract from acacia"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "hydrolyzed-corn-protein",
      "inciName": "Hydrolyzed corn protein",
      "commonName": "Hydrolyzed corn protein",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "hydrolyzed corn protein"
      ],
      "productIds": [
        "fresh-hair-treatment"
      ]
    },
    {
      "id": "hydrolyzed-hyaluronic-acid",
      "inciName": "Hydrolyzed hyaluronic acid",
      "commonName": "Hyaluronic acid (hydrolysed)",
      "altNames": [
        "Hyaluronic acid (hydrolyzed)",
        "HA"
      ],
      "roles": [
        "hyaluronic"
      ],
      "blurb": "Hyaluronic acid (hydrolysed). A hyaluronic-acid family ingredient that binds water for hydrated, comfortable-feeling skin. Formulas may use more than one HA size for a fuller moisture story.",
      "match": [
        "hydrolyzed hyaluronic acid",
        "hyaluronic acid (hydrolysed)",
        "hyaluronic acid (hydrolyzed)",
        "ha"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "hydrolyzed-pea-extract",
      "inciName": "Hydrolyzed pea extract",
      "commonName": "Hydrolyzed pea extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hydrolyzed pea extract"
      ],
      "productIds": [
        "fresh-hair-treatment"
      ]
    },
    {
      "id": "hydrolyzed-soy-protein",
      "inciName": "Hydrolyzed soy protein",
      "commonName": "Hair-grooming proteins from wheat, corn and soya",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Hair-grooming proteins from wheat, corn and soya. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydrolyzed soy protein",
        "hair-grooming proteins from wheat, corn and soya"
      ],
      "productIds": [
        "fresh-hair-treatment"
      ]
    },
    {
      "id": "hydrolyzed-walnut-extract",
      "inciName": "Hydrolyzed walnut extract",
      "commonName": "Polyphenol-rich walnut extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Polyphenol-rich walnut extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hydrolyzed walnut extract",
        "polyphenol-rich walnut extract"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "hydrolyzed-wheat-protein",
      "inciName": "Hydrolyzed wheat protein",
      "commonName": "Soothing and hydrating wheat proteins",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Soothing and hydrating wheat proteins. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydrolyzed wheat protein",
        "soothing and hydrating wheat proteins"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "hydroxypropyl-cyclodextrin",
      "inciName": "Hydroxypropyl cyclodextrin",
      "commonName": "Improves transport of substances",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Improves transport of substances. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydroxypropyl cyclodextrin",
        "improves transport of substances"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow"
      ]
    },
    {
      "id": "hydroxypropyl-tetrahydropyrantiol",
      "inciName": "Hydroxypropyl tetrahydropyrantiol",
      "commonName": "Strengthens the skin matrix",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Strengthens the skin matrix. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydroxypropyl tetrahydropyrantiol",
        "strengthens the skin matrix"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "hydroxystearic-linolenic-linoleic-polyglycerides",
      "inciName": "Hydroxystearic/Linolenic/Linoleic polyglycerides",
      "commonName": "Blend of plant-derived fatty acids",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Blend of plant-derived fatty acids. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "hydroxystearic/linolenic/linoleic polyglycerides",
        "blend of plant-derived fatty acids"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-cream-rich"
      ]
    },
    {
      "id": "hypericum-perforatum-flower-leaf-stem-extract",
      "inciName": "Hypericum perforatum flower/ leaf/stem extract",
      "commonName": "Skin-nourishing St. John’s wort extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-nourishing St. John’s wort extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "hypericum perforatum flower/ leaf/stem extract",
        "skin-nourishing st. john’s wort extract"
      ],
      "productIds": [
        "fresh-cleansing-water",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "inonotus-obliquus-extract",
      "inciName": "Inonotus obliquus extract",
      "commonName": "Ringana's 3-mushroom complex",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Ringana's 3-mushroom complex. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "inonotus obliquus extract",
        "ringana's 3-mushroom complex"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "inulin",
      "inciName": "Inulin",
      "commonName": "Prebiotic sugar compound",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Prebiotic sugar compound. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "inulin",
        "prebiotic sugar compound"
      ],
      "productIds": [
        "fresh-body-wash",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "iron",
      "inciName": "Iron",
      "commonName": "Iron",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "iron"
      ],
      "productIds": [
        "caps-fem"
      ]
    },
    {
      "id": "iron-enriched-aspergillus-oryzae-powder",
      "inciName": "Iron-enriched Aspergillus oryzae powder",
      "commonName": "Iron-enriched Aspergillus oryzae powder",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "iron-enriched aspergillus oryzae powder"
      ],
      "productIds": [
        "caps-fem",
        "sport-endurance"
      ]
    },
    {
      "id": "isoamyl-laurate",
      "inciName": "Isoamyl laurate",
      "commonName": "Ester oil for silky soft hair",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Ester oil for silky soft hair. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "isoamyl laurate",
        "ester oil for silky soft hair"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-cream",
        "fresh-cream-light",
        "fresh-hair-treatment",
        "fresh-hydro-serum",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "isomaltulose",
      "inciName": "Isomaltulose",
      "commonName": "Isomaltulose",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "isomaltulose"
      ],
      "productIds": [
      ]
    },
    {
      "id": "isosorbide-dicaprylate",
      "inciName": "Isosorbide dicaprylate",
      "commonName": "Plant-derived moisturizing factor",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Plant-derived moisturizing factor. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "isosorbide dicaprylate",
        "plant-derived moisturizing factor"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-eye-serum",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "isostearic-acid",
      "inciName": "Isostearic acid",
      "commonName": "Plant-derived dispersing agent",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived dispersing agent. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "isostearic acid",
        "plant-derived dispersing agent"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "isostearyl-alcohol",
      "inciName": "Isostearyl alcohol",
      "commonName": "Skin-nurturing",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin-nurturing. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "isostearyl alcohol",
        "skin-nurturing"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "jasminum-sambac-flower-extract",
      "inciName": "Jasminum sambac flower extract",
      "commonName": "Jasmine flower extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Jasmine flower extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "jasminum sambac flower extract",
        "jasmine flower extract"
      ],
      "productIds": [
        "fresh-eye-serum"
      ]
    },
    {
      "id": "jojoba-esters",
      "inciName": "Jojoba esters",
      "commonName": "Jojoba wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Jojoba wax. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "jojoba esters",
        "jojoba wax"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "kaolin",
      "inciName": "Kaolin",
      "commonName": "Skin-firming clay",
      "altNames": [],
      "roles": [
        "antioxidant",
        "minerals"
      ],
      "blurb": "Kaolin clay — a gentle mineral clay used for purifying / skin-feel support. Non-nano mineral.",
      "match": [
        "kaolin",
        "skin-firming clay"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask",
        "fresh-scrub-face-body",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "kluyveromyces-marxianus-fragilis-b0399",
      "inciName": "Kluyveromyces marxianus fragilis B0399",
      "commonName": "Kluyveromyces marxianus fragilis B0399",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "kluyveromyces marxianus fragilis b0399"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "l-carnosine",
      "inciName": "L-carnosine",
      "commonName": "L-carnosine",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "l-carnosine"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "l-glutathione",
      "inciName": "L-glutathione",
      "commonName": "L-glutathione",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "l-glutathione"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "l-theanine-from-green-tea-camellia-sinensis",
      "inciName": "L-theanine from green tea (Camellia sinensis)",
      "commonName": "L-theanine from green tea (Camellia sinensis)",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "l-theanine from green tea (camellia sinensis)"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "l-tryptophan",
      "inciName": "L-tryptophan",
      "commonName": "L-tryptophan",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "l-tryptophan"
      ],
      "productIds": [
      ]
    },
    {
      "id": "lactic-acid",
      "inciName": "Lactic Acid",
      "commonName": "Lactic acid (pH / gentle exfoliation support)",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "A gentle AHA / lactate relative that can support pH and mild renewal. Concentration and product type matter — read it in context of the full formula, not as a peel by default.",
      "match": [
        "lactic acid",
        "lactic acid (ph / gentle exfoliation support)"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-foot-balm",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection",
        "fresh-stay-fresh",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "lacticaseibacillus-rhamnosus-lrh020",
      "inciName": "Lacticaseibacillus rhamnosus LRH020",
      "commonName": "Lacticaseibacillus rhamnosus LRH020",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "lacticaseibacillus rhamnosus lrh020"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "lactiplantibacillus-plantarum-pbs067",
      "inciName": "Lactiplantibacillus plantarum PBS067",
      "commonName": "Lactiplantibacillus plantarum PBS067",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "lactiplantibacillus plantarum pbs067"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "lactobacillus-acidophilus-la001",
      "inciName": "Lactobacillus acidophilus LA001",
      "commonName": "Lactobacillus acidophilus LA001",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "lactobacillus acidophilus la001"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "lactobacillus-ferment",
      "inciName": "Lactobacillus ferment",
      "commonName": "Postbiotic from lactic acid bacteria",
      "altNames": [
        "Postbiotic ferment",
        "Lactic acid bacteria ferment"
      ],
      "roles": [
        "preservation",
        "extracts-ferments"
      ],
      "blurb": "A skin-nurturing ferment from lactic acid bacteria (a postbiotic). Useful for microbiome-minded chats and can gently support how a formula stays stable — support, not a claim of “no preservation at all.”",
      "match": [
        "lactobacillus ferment",
        "postbiotic from lactic acid bacteria",
        "postbiotic ferment",
        "lactic acid bacteria ferment"
      ],
      "productIds": [
        "adds-effect",
        "adds-repair",
        "fresh-baby-cream",
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-eye-serum",
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "lactobacillus-ferment-lysate",
      "inciName": "Lactobacillus ferment lysate",
      "commonName": "Skin‑strengthening neurocosmetic active ingredient from lactic acid bacteria",
      "altNames": [],
      "roles": [
        "preservation",
        "extracts-ferments"
      ],
      "blurb": "Skin‑strengthening neurocosmetic active ingredient from lactic acid bacteria. Part of how some formulas stay fresh and stable. Ringana’s story is no artificial preservative shortcuts — not “zero preservation.” Pair this ingredient with batch size, dating, and packaging.",
      "match": [
        "lactobacillus ferment lysate",
        "skin‑strengthening neurocosmetic active ingredient from lactic acid bacteria"
      ],
      "productIds": [
        "fresh-body-wash",
        "fresh-cream-rich",
        "fresh-hair-treatment",
        "fresh-hydro-serum",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "lactococcus-lactis-mjc18",
      "inciName": "Lactococcus lactis MJC18",
      "commonName": "Lactococcus lactis MJC18",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "lactococcus lactis mjc18"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "lamium-album-extract",
      "inciName": "Lamium album extract",
      "commonName": "Hair revitalising extract of white dead nettle",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hair revitalising extract of white dead nettle. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lamium album extract",
        "hair revitalising extract of white dead nettle"
      ],
      "productIds": [
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "lauroyl-lysine",
      "inciName": "Lauroyl lysine",
      "commonName": "Silky feel",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Silky feel. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "lauroyl lysine",
        "silky feel"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "lauryl-glucoside",
      "inciName": "Lauryl glucoside",
      "commonName": "Mild tenside",
      "altNames": [],
      "roles": [
        "surfactant"
      ],
      "blurb": "Mild tenside. A cleansing helper (tenside) that lets water mix with oils and impurities so rinsing actually cleans. Mild sugar-based systems are a different conversation than harsh detergent cleansers.",
      "match": [
        "lauryl glucoside",
        "mild tenside"
      ],
      "productIds": [
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "lecithin",
      "inciName": "Lecithin",
      "commonName": "Natural emulsifier / lipid",
      "altNames": [],
      "roles": [
        "emulsifier",
        "oils-lipids"
      ],
      "blurb": "A natural lipid / emulsifier from plants that helps blend oil and water and supports skin-softening feel.",
      "match": [
        "lecithin",
        "natural emulsifier / lipid"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-illuminating-enzyme-mask",
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "lecythis-minor-seed-oil",
      "inciName": "Lecythis minor seed oil",
      "commonName": "Paradise nut oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Paradise nut oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "lecythis minor seed oil",
        "paradise nut oil"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "lemon-balm-extract",
      "inciName": "Lemon balm extract",
      "commonName": "Melissa officinalis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Melissa officinalis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lemon balm extract",
        "melissa officinalis"
      ],
      "productIds": [
        "caps-fem"
      ]
    },
    {
      "id": "lemon-balm-leaf-extract",
      "inciName": "Lemon balm leaf extract",
      "commonName": "Melissa officinalis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Melissa officinalis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lemon balm leaf extract",
        "melissa officinalis"
      ],
      "productIds": [
        "fresh-pack-cleansing",
        "ringanadea",
      ]
    },
    {
      "id": "lemon-juice-concentrate",
      "inciName": "Lemon juice concentrate",
      "commonName": "Citrus limon",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus limon. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lemon juice concentrate",
        "citrus limon"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "lemon-juice-powder",
      "inciName": "Lemon juice powder",
      "commonName": "Citrus limon",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus limon. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lemon juice powder",
        "citrus limon"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing",
        "ringanadea",
        "sport-endurance"
      ]
    },
    {
      "id": "lemon-oil",
      "inciName": "Lemon oil",
      "commonName": "Citrus limon",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Citrus limon. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "lemon oil",
        "citrus limon"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "lemon-verbena-extract",
      "inciName": "Lemon verbena extract",
      "commonName": "Lippia Citriodora",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Lippia Citriodora. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lemon verbena extract",
        "lippia citriodora"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "lemon-verbena-leaf-and-hibiscus-flower-extract",
      "inciName": "Lemon verbena leaf and hibiscus flower extract",
      "commonName": "Lippia citriodora, Hibiscus sabdariffa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Lippia citriodora, Hibiscus sabdariffa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lemon verbena leaf and hibiscus flower extract",
        "lippia citriodora, hibiscus sabdariffa"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "lentinus-edodes-extract",
      "inciName": "Lentinus edodes extract",
      "commonName": "Lentinus edodes extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lentinus edodes extract"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "leptospermum-scoparium-branch-leaf-oil",
      "inciName": "Leptospermum scoparium branch/leaf oil",
      "commonName": "Manuka oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Manuka oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "leptospermum scoparium branch/leaf oil",
        "manuka oil"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "leuconostoc-radish-root-ferment-filtrate",
      "inciName": "Leuconostoc/Radish root ferment filtrate",
      "commonName": "Radish root Ferment filtrate",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Radish root Ferment filtrate. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "leuconostoc/radish root ferment filtrate",
        "radish root ferment filtrate"
      ],
      "productIds": [
        "adds-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-hair-treatment",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "lime-extract",
      "inciName": "Lime extract",
      "commonName": "Citrus aurantifolia",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus aurantifolia. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lime extract",
        "citrus aurantifolia"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "limnanthes-alba-seed-oil",
      "inciName": "Limnanthes alba seed oil",
      "commonName": "Meadowfoam seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Meadowfoam seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "limnanthes alba seed oil",
        "meadowfoam seed oil"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-foot-balm",
        "fresh-overnight-face-treatment",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "limosilactobacillus-reuteri-pbs072",
      "inciName": "Limosilactobacillus reuteri PBS072",
      "commonName": "Limosilactobacillus reuteri PBS072",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "limosilactobacillus reuteri pbs072"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "linalool",
      "inciName": "Linalool°",
      "commonName": "Fragrance allergen (declared)",
      "altNames": [],
      "roles": [
        "fragrance"
      ],
      "blurb": "A declared fragrance allergen often linked to floral and herbal scent notes. Same literacy rule: declared ≠ dangerous, but it is searchable.",
      "match": [
        "linalool°",
        "linalool",
        "fragrance allergen (declared)"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask",
        "fresh-light-legs"
      ]
    },
    {
      "id": "linseed-flour",
      "inciName": "Linseed flour",
      "commonName": "Partly de-oiled) (Linum usitatissimum",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Partly de-oiled) (Linum usitatissimum. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "linseed flour",
        "partly de-oiled) (linum usitatissimum"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "liquid-food-supplement-with-a-vegan-amino-acid-mixture",
      "inciName": "Liquid food supplement with a vegan amino acid mixture",
      "commonName": "Liquid food supplement with a vegan amino acid mixture",
      "altNames": [],
      "roles": [
        "amino-nmf"
      ],
      "blurb": "A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "liquid food supplement with a vegan amino acid mixture"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "liquid-food-supplement-with-carbohydrates",
      "inciName": "Liquid food supplement with carbohydrates",
      "commonName": "Liquid food supplement with carbohydrates",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "liquid food supplement with carbohydrates"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "liquid-food-supplement-with-fibre",
      "inciName": "Liquid food supplement with fibre",
      "commonName": "Liquid food supplement with fibre",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "liquid food supplement with fibre"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "liquid-food-supplement-with-isomaltulose",
      "inciName": "Liquid food supplement with isomaltulose",
      "commonName": "Liquid food supplement with isomaltulose",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "liquid food supplement with isomaltulose"
      ],
      "productIds": [
      ]
    },
    {
      "id": "lonicera-caprifolium-flower-extract",
      "inciName": "Lonicera caprifolium flower extract",
      "commonName": "Honeysuckle flower extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Honeysuckle flower extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lonicera caprifolium flower extract",
        "honeysuckle flower extract"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "lonicera-japonica-flower-extract",
      "inciName": "Lonicera japonica flower extract",
      "commonName": "Lonicera japonica flower extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "lonicera japonica flower extract"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "macadamia-integrifolia-tetraphylla-seed-oil",
      "inciName": "Macadamia integrifolia/tetraphylla seed oil",
      "commonName": "Macadamia seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Macadamia seed oil — a rich emollient lipid. Flag for nut allergies; confirm on the current pack before recommending.",
      "match": [
        "macadamia integrifolia/tetraphylla seed oil",
        "macadamia seed oil"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-intensive-hand-cream"
      ]
    },
    {
      "id": "macadamia-ternifolia-seed-oil",
      "inciName": "Macadamia ternifolia seed oil",
      "commonName": "Macadamia seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Macadamia seed oil — a rich emollient lipid. Flag for nut allergies; confirm on the current pack before recommending.",
      "match": [
        "macadamia ternifolia seed oil",
        "macadamia seed oil"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "maclura-cochinchinensis-leaf-prenylflavonoids",
      "inciName": "Maclura cochinchinensis leaf prenylflavonoids",
      "commonName": "Highly effect extract with an effect similar to Vitamin A",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Highly effect extract with an effect similar to Vitamin A. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "maclura cochinchinensis leaf prenylflavonoids",
        "highly effect extract with an effect similar to vitamin a"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-cleansing-water"
      ]
    },
    {
      "id": "madecassic-acid",
      "inciName": "Madecassic acid",
      "commonName": "Madecassic acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "madecassic acid"
      ],
      "productIds": [
        "fresh-body-milk-rich"
      ]
    },
    {
      "id": "madecassoside",
      "inciName": "Madecassoside",
      "commonName": "Madecassoside",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "madecassoside"
      ],
      "productIds": [
        "fresh-body-milk-rich"
      ]
    },
    {
      "id": "magnesium-and-zinc-ingredients-magnesium-citrate",
      "inciName": "Magnesium and zinc. INGREDIENTS Magnesium citrate",
      "commonName": "Magnesium and zinc. INGREDIENTS Magnesium citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "magnesium and zinc. ingredients magnesium citrate"
      ],
      "productIds": [
        "sport-push"
      ]
    },
    {
      "id": "magnesium-chloride",
      "inciName": "Magnesium chloride",
      "commonName": "Magnesium salt",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Magnesium salt. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "magnesium chloride",
        "magnesium salt"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "magnesium-citrate",
      "inciName": "Magnesium citrate",
      "commonName": "Magnesium citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "magnesium citrate"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing",
        "sport-endurance",
        "sport-protein"
      ]
    },
    {
      "id": "magnesium-oxide-from-sea-water",
      "inciName": "Magnesium oxide from sea water",
      "commonName": "Magnesium oxide from sea water",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "magnesium oxide from sea water"
      ],
      "productIds": [
        "caps-moodoo"
      ]
    },
    {
      "id": "magnesium-sulphate",
      "inciName": "Magnesium sulphate",
      "commonName": "Emulsion stabiliser)Polyhydroxystearic acid (plant-derived dispersing agent",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Emulsion stabiliser)Polyhydroxystearic acid (plant-derived dispersing agent. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "magnesium sulphate",
        "emulsion stabiliser)polyhydroxystearic acid (plant-derived dispersing agent"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-cream-rich",
        "fresh-foot-balm",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "magnolia-officinalis-bark-extract",
      "inciName": "Magnolia officinalis bark extract",
      "commonName": "Magnolia bark extract",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Magnolia bark extract — used for skin-calming / purifying support in several Ringana formulas. Point to the product’s hero story rather than over-claiming every extract.",
      "match": [
        "magnolia officinalis bark extract",
        "magnolia bark extract"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-eye-cream",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-moisturiser-for-men",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "maitake-mushroom-powder",
      "inciName": "Maitake mushroom powder",
      "commonName": "Grifola frondosa",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Grifola frondosa. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "maitake mushroom powder",
        "grifola frondosa"
      ],
      "productIds": [
        "caps-immu"
      ]
    },
    {
      "id": "malic-acid",
      "inciName": "Malic acid",
      "commonName": "Apple acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Apple acid. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "malic acid",
        "apple acid"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "maltodextrin",
      "inciName": "Maltodextrin",
      "commonName": "Plant-derived polysaccharide from corn",
      "altNames": [],
      "roles": [
        "supplement"
      ],
      "blurb": "Plant-derived polysaccharide from corn. Appears in supplement / capsule contexts. For ingestion products, stick to Ringana’s on-pack directions and important information — this guide is partner education, not medical advice.",
      "match": [
        "maltodextrin",
        "plant-derived polysaccharide from corn"
      ],
      "productIds": [
        "fresh-eye-serum",
        "fresh-hydro-serum",
        "fresh-illuminating-enzyme-mask",
        "fresh-lip-balm-nude-spf-15",
        "fresh-repair-shampoo",
        "sport-endurance"
      ]
    },
    {
      "id": "mandarin-juice-concentrate",
      "inciName": "Mandarin juice concentrate",
      "commonName": "Citrus reticulata",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus reticulata. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "mandarin juice concentrate",
        "citrus reticulata"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "mangifera-indica-seed-butter",
      "inciName": "Mangifera indica seed butter",
      "commonName": "Mango butter",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Mango butter. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "mangifera indica seed butter",
        "mango butter"
      ],
      "productIds": [
        "fresh-foot-balm",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "mango-powder",
      "inciName": "Mango powder",
      "commonName": "Mangifera indica) (freeze-dried",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Mangifera indica) (freeze-dried. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "mango powder",
        "mangifera indica) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-antiox",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "maple-syrup-powder",
      "inciName": "Maple syrup powder",
      "commonName": "Acer saccharum",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Acer saccharum. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "maple syrup powder",
        "acer saccharum"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "maqui-berry-extract",
      "inciName": "Maqui berry extract",
      "commonName": "Aristotelia chilensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Aristotelia chilensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "maqui berry extract",
        "aristotelia chilensis"
      ],
      "productIds": [
        "caps-protect",
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "maracuja-juice-concentrate",
      "inciName": "Maracuja juice concentrate",
      "commonName": "Passiflora edulis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Passiflora edulis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "maracuja juice concentrate",
        "passiflora edulis"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "marigold-flower-extract",
      "inciName": "Marigold flower extract",
      "commonName": "Tagetes erecta",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Tagetes erecta. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "marigold flower extract",
        "tagetes erecta"
      ],
      "productIds": [
        "beyond-omega",
        "caps-protect"
      ]
    },
    {
      "id": "maris-aqua",
      "inciName": "Maris aqua",
      "commonName": "Seawater",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Seawater — a mineral-rich water phase used in some formulas for a marine / mineral story.",
      "match": [
        "maris aqua",
        "seawater"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-foot-balm"
      ]
    },
    {
      "id": "maris-sal",
      "inciName": "Maris sal",
      "commonName": "Sea salt",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Sea salt. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "maris sal",
        "sea salt"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "maritime-pine-bark-extract",
      "inciName": "Maritime pine bark extract",
      "commonName": "Pinus pinaster",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Pinus pinaster. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "maritime pine bark extract",
        "pinus pinaster"
      ],
      "productIds": [
        "caps-fem"
      ]
    },
    {
      "id": "marrubium-vulgare-extract",
      "inciName": "Marrubium vulgare extract",
      "commonName": "Anti-pollution substance from white horehound",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Anti-pollution substance from white horehound. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "marrubium vulgare extract",
        "anti-pollution substance from white horehound"
      ],
      "productIds": [
        "adds-glow",
        "fresh-cream-light",
        "fresh-moisturiser-for-men",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "mate-leaf-extract",
      "inciName": "Mate leaf extract",
      "commonName": "Ilex paraguariensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Ilex paraguariensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "mate leaf extract",
        "ilex paraguariensis"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "mauritia-flexuosa-fruit-oil",
      "inciName": "Mauritia flexuosa fruit oil",
      "commonName": "Regenerating buriti oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Regenerating buriti oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "mauritia flexuosa fruit oil",
        "regenerating buriti oil"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow"
      ]
    },
    {
      "id": "melilotus-officinalis-extract",
      "inciName": "Melilotus officinalis extract",
      "commonName": "Sweet clover extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Sweet clover extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "melilotus officinalis extract",
        "sweet clover extract"
      ],
      "productIds": [
        "fresh-cleanser"
      ]
    },
    {
      "id": "melon-juice-concentrate-cucumis-melo",
      "inciName": "Melon juice concentrate (Cucumis melo)]",
      "commonName": "Melon juice concentrate (Cucumis melo)]",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "melon juice concentrate (cucumis melo)]"
      ],
      "productIds": [
        "caps-beauty-hair",
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "mentha-haplocalix-extract",
      "inciName": "Mentha haplocalix extract",
      "commonName": "Mint extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Mint extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "mentha haplocalix extract",
        "mint extract"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "mentha-spicata-herb-oil",
      "inciName": "Mentha spicata herb oil",
      "commonName": "Curled mint oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Curled mint oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "mentha spicata herb oil",
        "curled mint oil"
      ],
      "productIds": [
        "fresh-baby-tooth-gel"
      ]
    },
    {
      "id": "menthol",
      "inciName": "Menthol",
      "commonName": "From Mentha arvensis",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "From Mentha arvensis. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "menthol",
        "from mentha arvensis"
      ],
      "productIds": [
        "fresh-foot-balm",
        "fresh-light-legs"
      ]
    },
    {
      "id": "menthyl-lactate",
      "inciName": "Menthyl lactate",
      "commonName": "Cooling substance from peppermint and lactic acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Cooling substance from peppermint and lactic acid. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "menthyl lactate",
        "cooling substance from peppermint and lactic acid"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "methylglucoside-phosphate",
      "inciName": "Methylglucoside Phosphate",
      "commonName": "Wrinkle-reducing active substances",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Wrinkle-reducing active substances. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "methylglucoside phosphate",
        "wrinkle-reducing active substances"
      ],
      "productIds": [
        "adds-effect",
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "mica",
      "inciName": "Mica",
      "commonName": "Mica",
      "altNames": [],
      "roles": [
        "minerals"
      ],
      "blurb": "Mica — a mineral that adds soft luminosity or slip in some formulas. Non-nano mineral; still a sensitivity conversation for some people who prefer mica-free routines.",
      "match": [
        "mica"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "microcrystalline-cellulose",
      "inciName": "Microcrystalline cellulose",
      "commonName": "Cellulose for a matte, velvety skin feel",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Cellulose for a matte, velvety skin feel. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "microcrystalline cellulose",
        "cellulose for a matte, velvety skin feel"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "microencapsulated-sage-complex",
      "inciName": "Microencapsulated sage complex",
      "commonName": "Salvia officinalis leaf extract, carrier: gum arabic, Salvia lavandulifolia essential oil",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments",
        "fragrance"
      ],
      "blurb": "Salvia officinalis leaf extract, carrier: gum arabic, Salvia lavandulifolia essential oil — A declared fragrance-related entry for label literacy and sensitivity scans. Declared ≠ automatically unsafe; confirm on the current packaging and defer to the person’s own history.",
      "match": [
        "microencapsulated sage complex",
        "salvia officinalis leaf extract, carrier: gum arabic, salvia lavandulifolia essential oil"
      ],
      "productIds": [
        "caps-cerebro"
      ]
    },
    {
      "id": "milk-thistle-phospholipid-complex",
      "inciName": "Milk thistle phospholipid complex",
      "commonName": "Milk thistle extract (Silybum marianum) and sunflower lecithin",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Milk thistle extract (Silybum marianum) and sunflower lecithin. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "milk thistle phospholipid complex",
        "milk thistle extract (silybum marianum) and sunflower lecithin"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "millet-seed-oil",
      "inciName": "Millet seed oil",
      "commonName": "Panicum miliaceum",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Panicum miliaceum. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "millet seed oil",
        "panicum miliaceum"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "minerals",
      "inciName": "Minerals",
      "commonName": "Minerals",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "minerals"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "morinda-citrifolia-callus-culture-lysate",
      "inciName": "Morinda citrifolia callus culture lysate",
      "commonName": "Extract from noni tree stem cells that regulates the microbiome",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Extract from noni tree stem cells that regulates the microbiome. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "morinda citrifolia callus culture lysate",
        "extract from noni tree stem cells that regulates the microbiome"
      ],
      "productIds": [
        "adds-glow",
        "fresh-body-wash",
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "moringa-oleifera-seed-extract",
      "inciName": "Moringa oleifera seed extract",
      "commonName": "Moringa extract from the castor oil plant",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Moringa extract from the castor oil plant. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "moringa oleifera seed extract",
        "moringa extract from the castor oil plant"
      ],
      "productIds": [
        "fresh-body-milk-light"
      ]
    },
    {
      "id": "morus-alba-leaf-extract",
      "inciName": "Morus alba leaf extract",
      "commonName": "Mulberry leaf extract that increases the skin’s resilience",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Mulberry leaf extract that increases the skin’s resilience. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "morus alba leaf extract",
        "mulberry leaf extract that increases the skin’s resilience"
      ],
      "productIds": [
        "fresh-toner-calm",
        "fresh-toner-calm-pocket"
      ]
    },
    {
      "id": "myristic-acid",
      "inciName": "Myristic acid",
      "commonName": "Skin‑caring fatty acid",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin‑caring fatty acid. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "myristic acid",
        "skin‑caring fatty acid"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "myrothamnus-flabellifolia-leaf-stem-extract",
      "inciName": "Myrothamnus flabellifolia leaf/stem extract",
      "commonName": "Relaxing extract from the resurrection plant",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Relaxing extract from the resurrection plant. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "myrothamnus flabellifolia leaf/stem extract",
        "relaxing extract from the resurrection plant"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "n-prolyl-palmitoyl-tripeptide-56-acetate",
      "inciName": "N-Prolyl palmitoyl tripeptide-56 acetate",
      "commonName": "Peptide substance that combats vertical wrinkles",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Peptide substance that combats vertical wrinkles. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "n-prolyl palmitoyl tripeptide-56 acetate",
        "peptide substance that combats vertical wrinkles"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "natural-caffeine",
      "inciName": "Natural caffeine",
      "commonName": "Natural caffeine",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "natural caffeine"
      ],
      "productIds": [
        "ringanachi",
        "ringanadea"
      ]
    },
    {
      "id": "natural-carotenoids",
      "inciName": "Natural carotenoids",
      "commonName": "Natural carotenoids",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "natural carotenoids"
      ],
      "productIds": [
        "caps-protect"
      ]
    },
    {
      "id": "natural-vitamin-d",
      "inciName": "Natural Vitamin D",
      "commonName": "Natural Vitamin D",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "natural vitamin d"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "nelumbo-nucifera-root-water",
      "inciName": "Nelumbo nucifera root water",
      "commonName": "Lotus water",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Lotus water. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "nelumbo nucifera root water",
        "lotus water"
      ],
      "productIds": [
        "adds-effect"
      ]
    },
    {
      "id": "nepeta-cataria-water",
      "inciName": "Nepeta cataria water",
      "commonName": "Lemon catnip hydrosol",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Lemon catnip hydrosol. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "nepeta cataria water",
        "lemon catnip hydrosol"
      ],
      "productIds": [
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "niacin-and-vitamin-d3-ingredients-d-mannose",
      "inciName": "Niacin and vitamin D3. INGREDIENTS D-mannose",
      "commonName": "Niacin and vitamin D3. INGREDIENTS D-mannose",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "niacin and vitamin d3. ingredients d-mannose"
      ],
      "productIds": [
        "caps-hydro"
      ]
    },
    {
      "id": "niacinamide",
      "inciName": "Niacinamide",
      "commonName": "Vitamin B3",
      "altNames": [
        "Nicotinamide"
      ],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Vitamin B3 — a versatile active for tone, barrier support, and balance. Strong teaching ingredient when someone asks about glow, uneven texture, or blemish-prone skin; point to the product heroes and the full list together.",
      "match": [
        "niacinamide",
        "vitamin b3",
        "nicotinamide"
      ],
      "productIds": [
        "adds-glow",
        "adds-repair",
        "fresh-eye-serum",
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "nigella-sativa-seed-oil",
      "inciName": "Nigella sativa seed oil",
      "commonName": "Black cumin oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Black cumin oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "nigella sativa seed oil",
        "black cumin oil"
      ],
      "productIds": [
        "fresh-soap"
      ]
    },
    {
      "id": "oak-extract",
      "inciName": "Oak extract",
      "commonName": "Quercus robur",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Quercus robur. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "oak extract",
        "quercus robur"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "oat-fibre-containing-beta-glucans",
      "inciName": "Oat fibre containing beta-glucans",
      "commonName": "Avena sativa",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Avena sativa. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "oat fibre containing beta-glucans",
        "avena sativa"
      ],
      "productIds": [
        "caps-immu",
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "octyldodecanol",
      "inciName": "Octyldodecanol",
      "commonName": "Skin-grooming emollient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Skin-grooming emollient. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "octyldodecanol",
        "skin-grooming emollient"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "octyldodecyl-myristate",
      "inciName": "Octyldodecyl Myristate",
      "commonName": "Myristic acid skin conditioner",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Myristic acid skin conditioner. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "octyldodecyl myristate",
        "myristic acid skin conditioner"
      ],
      "productIds": [
        "fresh-eye-serum"
      ]
    },
    {
      "id": "oenothera-biennis-oil",
      "inciName": "Oenothera biennis oil",
      "commonName": "Skin-regenerating oil of evening primrose",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Skin-regenerating oil of evening primrose. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "oenothera biennis oil",
        "skin-regenerating oil of evening primrose"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-moisturiser-for-men",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "olea-europaea-callus-culture-lysate",
      "inciName": "Olea europaea callus culture lysate",
      "commonName": "Olive sprout stem cell extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Olive sprout stem cell extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "olea europaea callus culture lysate",
        "olive sprout stem cell extract"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "olea-europaea-leaf-extract",
      "inciName": "Olea europaea leaf extract",
      "commonName": "Moisturizing and antioxidant substance from olive leaves",
      "altNames": [],
      "roles": [
        "moisturizer",
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Moisturizing and antioxidant substance from olive leaves. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "olea europaea leaf extract",
        "moisturizing and antioxidant substance from olive leaves"
      ],
      "productIds": [
        "fresh-light-legs",
        "fresh-moisturiser-for-men",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "olea-europaea-oil-unsaponifiables",
      "inciName": "Olea europaea oil unsaponifiables",
      "commonName": "Skin-grooming substance from olives",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Skin-grooming substance from olives. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "olea europaea oil unsaponifiables",
        "skin-grooming substance from olives"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm"
      ]
    },
    {
      "id": "oleic-acid",
      "inciName": "Oleic acid",
      "commonName": "Plant-derived fatty acids",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived fatty acids. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "oleic acid",
        "plant-derived fatty acids"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "oligopeptide-1",
      "inciName": "Oligopeptide-1",
      "commonName": "Peptide that stimulates production of hyaluronic acid",
      "altNames": [],
      "roles": [
        "peptide",
        "hyaluronic"
      ],
      "blurb": "Peptide that stimulates production of hyaluronic acid. A hyaluronic-acid family ingredient that binds water for hydrated, comfortable-feeling skin. Formulas may use more than one HA size for a fuller moisture story.",
      "match": [
        "oligopeptide-1",
        "peptide that stimulates production of hyaluronic acid"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "olive-oil-decyl-esters",
      "inciName": "Olive oil decyl esters",
      "commonName": "Silky conditioning active ingredients from olive oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Silky conditioning active ingredients from olive oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "olive oil decyl esters",
        "silky conditioning active ingredients from olive oil"
      ],
      "productIds": [
        "fresh-intensive-hand-cream"
      ]
    },
    {
      "id": "opuntia-ficus-indica-seed-oil",
      "inciName": "Opuntia ficus-indica seed oil",
      "commonName": "Nourishing prickly pear seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Nourishing prickly pear seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "opuntia ficus-indica seed oil",
        "nourishing prickly pear seed oil"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-eye-cream",
        "fresh-foot-balm",
        "fresh-hydro-serum",
        "fresh-moisturiser-for-men",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "orange-extract",
      "inciName": "Orange extract",
      "commonName": "Citrus sinensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus sinensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "orange extract",
        "citrus sinensis"
      ],
      "productIds": [
        "ringanabty",
        "sport-protein"
      ]
    },
    {
      "id": "orange-juice-concentrate",
      "inciName": "Orange juice concentrate",
      "commonName": "Citrus sinensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Citrus sinensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "orange juice concentrate",
        "citrus sinensis"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "orthosiphon-stamineus-leaf-extract",
      "inciName": "Orthosiphon stamineus leaf extract",
      "commonName": "Orthosiphon aristatus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Orthosiphon aristatus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "orthosiphon stamineus leaf extract",
        "orthosiphon aristatus"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "oryza-sativa-bran-water",
      "inciName": "Oryza sativa bran water",
      "commonName": "Rice bran water",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Rice bran water. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "oryza sativa bran water",
        "rice bran water"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "palmitic-acid",
      "inciName": "Palmitic acid",
      "commonName": "Plant-derived fatty acids",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived fatty acids. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "palmitic acid",
        "plant-derived fatty acids"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "palmitic-acidarginine",
      "inciName": "Palmitic acidArginine",
      "commonName": "Moisturizing amino acid",
      "altNames": [],
      "roles": [
        "moisturizer",
        "amino-nmf"
      ],
      "blurb": "Moisturizing amino acid. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "palmitic acidarginine",
        "moisturizing amino acid"
      ],
      "productIds": [
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "palmitoyl-tetrapeptide-7",
      "inciName": "Palmitoyl tetrapeptide-7",
      "commonName": "Peptide for a more even-looking skin",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Peptide for a more even-looking skin. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "palmitoyl tetrapeptide-7",
        "peptide for a more even-looking skin"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-eye-serum",
        "fresh-lip-balm-classic"
      ]
    },
    {
      "id": "palmitoyl-tripeptide-1",
      "inciName": "Palmitoyl tripeptide-1",
      "commonName": "Peptide for a smoother-looking skin complexion",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Peptide for a smoother-looking skin complexion. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "palmitoyl tripeptide-1",
        "peptide for a smoother-looking skin complexion"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-eye-serum",
        "fresh-lip-balm-classic"
      ]
    },
    {
      "id": "palmitoyl-tripeptide-2palmitoyl-tetrapeptide-7",
      "inciName": "Palmitoyl tripeptide-2Palmitoyl tetrapeptide-7",
      "commonName": "Wrinkle-reducing peptide",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "Wrinkle-reducing peptide. A peptide used for targeted skin-performance conversations (firmness, lines, eye area, etc.). Teach from the specific product page — don’t invent study claims.",
      "match": [
        "palmitoyl tripeptide-2palmitoyl tetrapeptide-7",
        "wrinkle-reducing peptide"
      ],
      "productIds": [
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "palmitoyl-tripeptide-38",
      "inciName": "Palmitoyl Tripeptide-38",
      "commonName": "Wrinkle-reducing peptide",
      "altNames": [],
      "roles": [
        "peptide"
      ],
      "blurb": "A wrinkle-reducing peptide used in performance-leaning face formulas. Good “targeted active” teaching moment alongside the full INCI.",
      "match": [
        "palmitoyl tripeptide-38",
        "wrinkle-reducing peptide"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow"
      ]
    },
    {
      "id": "panax-ginseng-root-extract",
      "inciName": "Panax ginseng root extract",
      "commonName": "Volume-boosting ginseng extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Volume-boosting ginseng extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "panax ginseng root extract",
        "volume-boosting ginseng extract"
      ],
      "productIds": [
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "papain",
      "inciName": "Papain",
      "commonName": "Enzyme from kiwi fruit, pineapple and papaya",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Enzyme from kiwi fruit, pineapple and papaya. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "papain",
        "enzyme from kiwi fruit, pineapple and papaya"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "papaya-extract",
      "inciName": "Papaya extract",
      "commonName": "Carica papaya",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Carica papaya. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "papaya extract",
        "carica papaya"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "papaya-fruit-powder",
      "inciName": "Papaya fruit powder",
      "commonName": "Carica papaya",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Carica papaya. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "papaya fruit powder",
        "carica papaya"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "passion-flower-extract",
      "inciName": "Passion flower extract",
      "commonName": "Passiflora incarnata",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Passiflora incarnata. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "passion flower extract",
        "passiflora incarnata"
      ],
      "productIds": [
      ]
    },
    {
      "id": "passion-fruit-juice-powder",
      "inciName": "Passion fruit juice powder",
      "commonName": "Passiflora edulis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Passiflora edulis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "passion fruit juice powder",
        "passiflora edulis"
      ],
      "productIds": [
        "fresh-pack-cleansing",
        "sport-endurance"
      ]
    },
    {
      "id": "pca-glyceryl-oleate",
      "inciName": "PCA glyceryl oleate",
      "commonName": "Reduces static in hair",
      "altNames": [],
      "roles": [
        "amino-nmf"
      ],
      "blurb": "Reduces static in hair. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "pca glyceryl oleate",
        "reduces static in hair"
      ],
      "productIds": [
        "fresh-hair-treatment"
      ]
    },
    {
      "id": "pea-sprout-extract",
      "inciName": "Pea sprout extract",
      "commonName": "Pisum sativum",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Pisum sativum. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "pea sprout extract",
        "pisum sativum"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "pentylene-glycol",
      "inciName": "Pentylene glycol",
      "commonName": "Plant-derived moisturizing agent",
      "altNames": [
        "1,2-Pentanediol"
      ],
      "roles": [
        "moisturizer"
      ],
      "blurb": "A plant-derived moisturizer that also helps keep water-based formulas fresh and stable. One of the quiet helpers behind Ringana’s short-dating model — support from the formula side, not a multi-year warehouse preservative.",
      "match": [
        "pentylene glycol",
        "plant-derived moisturizing agent",
        "1,2-pentanediol"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cleansing-water",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-light-legs",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-sunscreen-face",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-toner-pure",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "phaseolus-radiatus-meristem-cell-culture-extract",
      "inciName": "Phaseolus radiatus meristem cell culture extract",
      "commonName": "Skin-soothing mung bean extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-soothing mung bean extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "phaseolus radiatus meristem cell culture extract",
        "skin-soothing mung bean extract"
      ],
      "productIds": [
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "phenethyl-alcohol",
      "inciName": "Phenethyl alcohol",
      "commonName": "Rose alcohol (mild preserving scent note)",
      "altNames": [
        "2-Phenylethanol"
      ],
      "roles": [
        "preservation"
      ],
      "blurb": "Also called rose alcohol — linked to a soft rose scent. Used in small amounts for a light aromatic note and mild freshness support. Worth knowing for fragrance-sensitive partners; different from heavy synthetic perfume blends.",
      "match": [
        "phenethyl alcohol",
        "rose alcohol (mild preserving scent note)",
        "2-phenylethanol"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hydro-serum",
        "fresh-light-legs",
        "fresh-soap-liquid",
        "fresh-sunscreen-face",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "phenylpropanol",
      "inciName": "Phenylpropanol",
      "commonName": "Plant-derived",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "phenylpropanol",
        "plant-derived"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "phospholipids",
      "inciName": "Phospholipids",
      "commonName": "Membrane component from soy",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Membrane component from soy. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "phospholipids",
        "membrane component from soy"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "phytosterols",
      "inciName": "Phytosterols",
      "commonName": "Lipids that strengthen the skin barrier",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "Lipids that strengthen the skin barrier. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "phytosterols",
        "lipids that strengthen the skin barrier"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "phytosteryl-sunflowerseedate",
      "inciName": "Phytosteryl sunflowerseedate",
      "commonName": "Sunflower phytosterols",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier"
      ],
      "blurb": "Sunflower phytosterols. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "phytosteryl sunflowerseedate",
        "sunflower phytosterols"
      ],
      "productIds": [
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "pineapple-fruit-powder",
      "inciName": "Pineapple fruit powder",
      "commonName": "Ananas comosus) (freeze-dried",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Ananas comosus) (freeze-dried. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "pineapple fruit powder",
        "ananas comosus) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "pineapple-juice-concentrate",
      "inciName": "Pineapple juice concentrate",
      "commonName": "Ananas comosus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Ananas comosus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "pineapple juice concentrate",
        "ananas comosus"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "pinus-pinaster-bark-extract",
      "inciName": "Pinus pinaster bark extract",
      "commonName": "Extract from maritime pine",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Extract from maritime pine. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "pinus pinaster bark extract",
        "extract from maritime pine"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "plankton-extract",
      "inciName": "Plankton extract",
      "commonName": "Upcycled active ingredient for the eye contours",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Upcycled active ingredient for the eye contours. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "plankton extract",
        "upcycled active ingredient for the eye contours"
      ],
      "productIds": [
        "adds-effect",
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "plant-extracts",
      "inciName": "Plant extracts",
      "commonName": "Plant extracts",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "plant extracts"
      ],
      "productIds": [
        "caps-beauty-hair",
        "caps-d-gest",
        "ringanachi",
        "ringanadea",
      ]
    },
    {
      "id": "plantago-psyllium-seed-extract",
      "inciName": "Plantago psyllium seed extract",
      "commonName": "Plantago psyllium extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Plantago psyllium extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "plantago psyllium seed extract",
        "plantago psyllium extract"
      ],
      "productIds": [
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "plukenetia-volubilis-seed-oil",
      "inciName": "Plukenetia volubilis seed oil",
      "commonName": "Cell-regenerating sacha inchi oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cell-regenerating sacha inchi oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "plukenetia volubilis seed oil",
        "cell-regenerating sacha inchi oil"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-hair-treatment",
        "fresh-moisturiser-for-men",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "plus-natural-vitamin-e-and-vitamin-b12-ingredients-soya-bean-extract",
      "inciName": "Plus natural vitamin E and vitamin B12. INGREDIENTS Soya bean extract",
      "commonName": "Glycine max",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Glycine max. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "plus natural vitamin e and vitamin b12. ingredients soya bean extract",
        "glycine max"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "polyglycerin-3",
      "inciName": "Polyglycerin-3",
      "commonName": "Skin-nurturing",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Skin-nurturing. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "polyglycerin-3",
        "skin-nurturing"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "polyglyceryl-10-stearate",
      "inciName": "Polyglyceryl-10 stearate",
      "commonName": "Polyglyceryl-10 stearate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "polyglyceryl-10 stearate"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "polyglyceryl-2-caprate",
      "inciName": "Polyglyceryl-2 caprate",
      "commonName": "Polyglyceryl-2 caprate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "polyglyceryl-2 caprate"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "polyglyceryl-2-dipolyhydroxystearate",
      "inciName": "Polyglyceryl-2 dipolyhydroxystearate",
      "commonName": "Stearic acid-glycerin emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Stearic acid-glycerin emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-2 dipolyhydroxystearate",
        "stearic acid-glycerin emulsifier"
      ],
      "productIds": [
        "fresh-baby-cream"
      ]
    },
    {
      "id": "polyglyceryl-3-betainate-acetate",
      "inciName": "Polyglyceryl-3 betainate acetate",
      "commonName": "Polyglyceryl-3 betainate acetate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "polyglyceryl-3 betainate acetate"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "polyglyceryl-3-cocoate",
      "inciName": "Polyglyceryl-3 cocoate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-3 cocoate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "polyglyceryl-3-diisostearate",
      "inciName": "Polyglyceryl-3 diisostearate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-3 diisostearate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "polyglyceryl-3-oleate",
      "inciName": "Polyglyceryl-3 oleate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-3 oleate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "polyglyceryl-3-palmitate",
      "inciName": "Polyglyceryl-3 palmitate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-3 palmitate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "polyglyceryl-3-polyricinoleate",
      "inciName": "Polyglyceryl-3 polyricinoleate",
      "commonName": "Natural emulsifier derived from ricin oil",
      "altNames": [],
      "roles": [
        "emulsifier",
        "oils-lipids"
      ],
      "blurb": "Natural emulsifier derived from ricin oil. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-3 polyricinoleate",
        "natural emulsifier derived from ricin oil"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "polyglyceryl-3-sorbityl-linseedate",
      "inciName": "Polyglyceryl-3 sorbityl linseedate",
      "commonName": "Natural emulsifier derived from linseed oil",
      "altNames": [],
      "roles": [
        "emulsifier",
        "oils-lipids"
      ],
      "blurb": "Natural emulsifier derived from linseed oil. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-3 sorbityl linseedate",
        "natural emulsifier derived from linseed oil"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "polyglyceryl-4-caprate",
      "inciName": "Polyglyceryl-4 caprate",
      "commonName": "Natural emulsifiers",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifiers. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-4 caprate",
        "natural emulsifiers"
      ],
      "productIds": [
        "fresh-body-milk-rich"
      ]
    },
    {
      "id": "polyglyceryl-4-diisostearate-polyhydroxystearate-sebacate",
      "inciName": "Polyglyceryl-4 diisostearate / polyhydroxystearate / sebacate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-4 diisostearate / polyhydroxystearate / sebacate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "polyglyceryl-4-diisostearate-polyhydroxystearate-sebacate-2",
      "inciName": "Polyglyceryl-4 diisostearate/polyhydroxystearate/sebacate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-4 diisostearate/polyhydroxystearate/sebacate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "polyglyceryl-4-olivate-polyricinoleate",
      "inciName": "Polyglyceryl-4 olivate/polyricinoleate",
      "commonName": "Olive-derived emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Olive-derived emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-4 olivate/polyricinoleate",
        "olive-derived emulsifier"
      ],
      "productIds": [
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "polyglyceryl-6-behenate",
      "inciName": "Polyglyceryl-6 behenate",
      "commonName": "Polyglyceryl-6 behenate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "polyglyceryl-6 behenate"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection",
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "polyglyceryl-6-caprylate",
      "inciName": "Polyglyceryl-6 caprylate",
      "commonName": "Polyglyceryl-6 caprylate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "polyglyceryl-6 caprylate"
      ],
      "productIds": [
        "fresh-body-milk-rich"
      ]
    },
    {
      "id": "polyglyceryl-6-pentaoleate",
      "inciName": "Polyglyceryl-6 pentaoleate",
      "commonName": "Emulsifier derived from sesame oil",
      "altNames": [],
      "roles": [
        "emulsifier",
        "oils-lipids"
      ],
      "blurb": "Emulsifier derived from sesame oil. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-6 pentaoleate",
        "emulsifier derived from sesame oil"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "polyglyceryl-6-stearate",
      "inciName": "Polyglyceryl-6 stearate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "polyglyceryl-6 stearate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "polyhydroxystearic-acid",
      "inciName": "Polyhydroxystearic acid",
      "commonName": "Plant-derived dispersing agent",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived dispersing agent. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "polyhydroxystearic acid",
        "plant-derived dispersing agent"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "polypodium-vulgare-rhizome-extract",
      "inciName": "Polypodium vulgare rhizome extract",
      "commonName": "Polypody extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Polypody extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "polypodium vulgare rhizome extract",
        "polypody extract"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-foot-balm",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "polyporus-umbellatus-extract",
      "inciName": "Polyporus umbellatus extract",
      "commonName": "Polyporus umbellatus mushroom extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Polyporus umbellatus mushroom extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "polyporus umbellatus extract",
        "polyporus umbellatus mushroom extract"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "populus-tremuloides-bark-extract",
      "inciName": "Populus tremuloides bark extract",
      "commonName": "Antioxidative aspen bark extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Antioxidative aspen bark extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "populus tremuloides bark extract",
        "antioxidative aspen bark extract"
      ],
      "productIds": [
        "adds-effect",
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "porphyridium-cruentum-culture-conditioned-media",
      "inciName": "Porphyridium cruentum culture conditioned media",
      "commonName": "Substance from porphyridium cruentum alga",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Substance from porphyridium cruentum alga. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "porphyridium cruentum culture conditioned media",
        "substance from porphyridium cruentum alga"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "porphyridium-cruentum-extract",
      "inciName": "Porphyridium cruentum extract",
      "commonName": "Tan-activating red alga extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Tan-activating red alga extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "porphyridium cruentum extract",
        "tan-activating red alga extract"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow"
      ]
    },
    {
      "id": "potassium-citrate",
      "inciName": "Potassium citrate",
      "commonName": "Potassium citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "potassium citrate"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "potassium-cocoate",
      "inciName": "Potassium cocoate",
      "commonName": "Cocos nucifera oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cocos nucifera oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "potassium cocoate",
        "cocos nucifera oil"
      ],
      "productIds": [
        "fresh-soap"
      ]
    },
    {
      "id": "potassium-hydroxide",
      "inciName": "Potassium hydroxide",
      "commonName": "Regulates pH balance",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Regulates pH balance. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "potassium hydroxide",
        "regulates ph balance"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "potassium-lactate",
      "inciName": "Potassium lactate",
      "commonName": "Lactate moisturizing salt",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Lactate moisturizing salt. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "potassium lactate",
        "lactate moisturizing salt"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "potassium-olivate",
      "inciName": "Potassium olivate",
      "commonName": "Olea europaea oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Olea europaea oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "potassium olivate",
        "olea europaea oil"
      ],
      "productIds": [
        "fresh-soap"
      ]
    },
    {
      "id": "prickly-pear-fruit-juice-powder",
      "inciName": "Prickly pear fruit juice powder",
      "commonName": "Opuntia ficus-indica",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Opuntia ficus-indica. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "prickly pear fruit juice powder",
        "opuntia ficus-indica"
      ],
      "productIds": [
        "fresh-pack-cleansing",
        "ringanadea"
      ]
    },
    {
      "id": "propanediol",
      "inciName": "Propanediol",
      "commonName": "Plant-derived moisturizer",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "A plant-derived moisturizer and solvent that helps formulas feel hydrating and can improve how other ingredients spread and absorb.",
      "match": [
        "propanediol",
        "plant-derived moisturizer"
      ],
      "productIds": [
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-baby-tooth-gel",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "prunus-amygdalus-dulcis-oil",
      "inciName": "Prunus amygdalus dulcis oil",
      "commonName": "Sweet almond oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Sweet almond oil — a nourishing plant lipid for softness and comfort. Flag for nut allergies and always double-check the current INCI.",
      "match": [
        "prunus amygdalus dulcis oil",
        "sweet almond oil"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-cleanser",
        "fresh-cream-medium",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-soap",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "prunus-armeniaca-seed-powder",
      "inciName": "Prunus armeniaca seed powder",
      "commonName": "Upcycled exfoliating grains from raspberry, pomegranate and apricot",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Upcycled fruit-seed grains from raspberry, pomegranate and apricot — leftover seeds given a second life as the gentle exfoliant in FRESH scrub. Confirm wording on the current pack.",
      "match": [
        "prunus armeniaca seed powder",
        "exfoliating grains from raspberry, pomegranate and apricot",
        "upcycled exfoliating grains from raspberry, pomegranate and apricot"
      ],
      "productIds": [
        "fresh-scrub-face-body"
      ]
    },
    {
      "id": "prunus-cerasus-fruit-water",
      "inciName": "Prunus cerasus fruit water",
      "commonName": "Cherry water",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Cherry water. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "prunus cerasus fruit water",
        "cherry water"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-cleansing-water"
      ]
    },
    {
      "id": "prunus-persica-bud-extract",
      "inciName": "Prunus persica bud extract",
      "commonName": "Moisturizing peach tree bud extract",
      "altNames": [],
      "roles": [
        "moisturizer",
        "extracts-ferments"
      ],
      "blurb": "Moisturizing peach tree bud extract. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "prunus persica bud extract",
        "moisturizing peach tree bud extract"
      ],
      "productIds": [
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "prunus-persica-leaf-extract",
      "inciName": "Prunus persica leaf extract",
      "commonName": "Peach extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Peach extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "prunus persica leaf extract",
        "peach extract"
      ],
      "productIds": [
        "fresh-hand-balm",
        "fresh-hand-balm-pocket"
      ]
    },
    {
      "id": "psidium-guajava-leaf-extract",
      "inciName": "Psidium guajava leaf extract",
      "commonName": "Antioxidant guava extract",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Antioxidant guava extract. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "psidium guajava leaf extract",
        "antioxidant guava extract"
      ],
      "productIds": [
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "psyllium-husk-powder",
      "inciName": "Psyllium husk powder",
      "commonName": "Plantago ovata",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plantago ovata. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "psyllium husk powder",
        "plantago ovata"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "pullulan",
      "inciName": "Pullulan",
      "commonName": "Polysaccharide film-former",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "A polysaccharide film-former that can improve slip, wear, and the refined feel of serums and treatments.",
      "match": [
        "pullulan",
        "polysaccharide film-former"
      ],
      "productIds": [
        "adds-effect",
        "fresh-eye-serum"
      ]
    },
    {
      "id": "punica-granatum-seed-oil",
      "inciName": "Punica granatum seed oil",
      "commonName": "Pomegranate seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Pomegranate seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "punica granatum seed oil",
        "pomegranate seed oil"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "punica-granatum-seed-powder",
      "inciName": "Punica granatum seed powder",
      "commonName": "Upcycled pomegranate seed powder",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "One of the upcycled fruit-seed grains in FRESH scrub — leftover pomegranate seeds, used as a gentle exfoliant. Confirm wording on the current pack.",
      "match": [
        "punica granatum seed powder",
        "upcycled pomegranate seed powder"
      ],
      "productIds": [
        "fresh-scrub-face-body"
      ]
    },
    {
      "id": "pyrroloquinoline-quinone",
      "inciName": "Pyrroloquinoline quinone",
      "commonName": "Pyrroloquinoline quinone",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "pyrroloquinoline quinone"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "pyrroloquinoline-quinone-disodium-salt",
      "inciName": "Pyrroloquinoline quinone disodium salt",
      "commonName": "Pyrroloquinoline quinone disodium salt",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "pyrroloquinoline quinone disodium salt"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "pyrus-malus-fruit-extract",
      "inciName": "Pyrus malus fruit extract",
      "commonName": "Cell-protecting, skin-invigorating apple extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cell-protecting, skin-invigorating apple extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "pyrus malus fruit extract",
        "cell-protecting, skin-invigorating apple extract"
      ],
      "productIds": [
        "adds-repair",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket"
      ]
    },
    {
      "id": "pyrus-malus-fruit-water",
      "inciName": "Pyrus malus fruit water",
      "commonName": "Apple hydrosol",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Apple hydrosol. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "pyrus malus fruit water",
        "apple hydrosol"
      ],
      "productIds": [
        "adds-effect",
        "adds-repair",
        "fresh-eye-cream",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "quince-juice-concentrate",
      "inciName": "Quince juice concentrate",
      "commonName": "Cydonia oblonga",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Cydonia oblonga. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "quince juice concentrate",
        "cydonia oblonga"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "raspberry-ketone",
      "inciName": "Raspberry ketone",
      "commonName": "Raspberry-derived skin-conditioning agent",
      "altNames": [],
      "roles": [
        "antioxidant"
      ],
      "blurb": "A raspberry-derived skin-conditioning agent. Ringana parentheticals vary (antioxidant / grooming / skin-nurturing) depending on the product — stick to the product page tone.",
      "match": [
        "raspberry ketone",
        "raspberry-derived skin-conditioning agent"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-body-hair-wash",
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-rich",
        "fresh-cleansing-water",
        "fresh-eye-cream",
        "fresh-hair-treatment",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-soap-liquid",
        "fresh-sunscreen-spf-25",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "reduced-l-glutathione",
      "inciName": "Reduced L-glutathione",
      "commonName": "Reduced L-glutathione",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "reduced l-glutathione"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "reishi-mushroom-extract",
      "inciName": "Reishi mushroom extract",
      "commonName": "Ganoderma lucidum) (sulphites",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Ganoderma lucidum) (sulphites. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "reishi mushroom extract",
        "ganoderma lucidum) (sulphites"
      ],
      "productIds": [
        "caps-immu"
      ]
    },
    {
      "id": "resveratrol",
      "inciName": "Resveratrol",
      "commonName": "Antioxidant polyphenol",
      "altNames": [],
      "roles": [
        "antioxidant",
        "oils-lipids"
      ],
      "blurb": "An antioxidant polyphenol (often associated with grape / wine research conversations) used for protective antioxidant support.",
      "match": [
        "resveratrol",
        "antioxidant polyphenol"
      ],
      "productIds": [
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "retinal",
      "inciName": "Retinal",
      "commonName": "Highly effective Vitamin A derivative",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Highly effective Vitamin A derivative. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "retinal",
        "highly effective vitamin a derivative"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "rhodiola-rosea-extract",
      "inciName": "Rhodiola rosea extract",
      "commonName": "Rhodiola rosea",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Rhodiola rosea. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rhodiola rosea extract",
        "rhodiola rosea"
      ],
      "productIds": [
        "caps-cerebro"
      ]
    },
    {
      "id": "rhododendron-ferrugineum-extract",
      "inciName": "Rhododendron ferrugineum extract",
      "commonName": "Reduces signal-transmitted cell-ageing",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Reduces signal-transmitted cell-ageing. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rhododendron ferrugineum extract",
        "reduces signal-transmitted cell-ageing"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "rhus-verniciflua-peel-cera",
      "inciName": "Rhus verniciflua peel cera",
      "commonName": "Berry wax / sumac wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Berry wax / sumac wax. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "rhus verniciflua peel cera",
        "berry wax / sumac wax"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm"
      ]
    },
    {
      "id": "ribes-nigrum-seed-oil",
      "inciName": "Ribes nigrum seed oil",
      "commonName": "Currant seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Currant seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "ribes nigrum seed oil",
        "currant seed oil"
      ],
      "productIds": [
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "rice-bran-extract",
      "inciName": "Rice bran extract",
      "commonName": "Oryza sativa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Oryza sativa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rice bran extract",
        "oryza sativa"
      ],
      "productIds": [
        "beyond-spermidine",
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "rice-bran-oil-extract",
      "inciName": "Rice bran oil extract",
      "commonName": "Oryza sativa",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Oryza sativa. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "rice bran oil extract",
        "oryza sativa"
      ],
      "productIds": [
        "beyond-omega",
        "ringanabty"
      ]
    },
    {
      "id": "rice-protein-isolate",
      "inciName": "Rice protein isolate",
      "commonName": "Oryza sativa",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Oryza sativa. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "rice protein isolate",
        "oryza sativa"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "rooibos-leaf-extract",
      "inciName": "Rooibos leaf extract",
      "commonName": "Aspalathus linearis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Aspalathus linearis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rooibos leaf extract",
        "aspalathus linearis"
      ],
      "productIds": [
        "ringanadea",
      ]
    },
    {
      "id": "rosa-damascena-flower-cera",
      "inciName": "Rosa damascena flower cera",
      "commonName": "Rose inflorescence wax",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Rose inflorescence wax. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "rosa damascena flower cera",
        "rose inflorescence wax"
      ],
      "productIds": [
        "fresh-cream-rich"
      ]
    },
    {
      "id": "rosa-damascena-flower-oil",
      "inciName": "Rosa damascena flower oil",
      "commonName": "Rose oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Rose oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "rosa damascena flower oil",
        "rose oil"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-rich",
        "fresh-cleanser",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "rosa-damascena-flower-water",
      "inciName": "Rosa damascena flower water",
      "commonName": "Rose water / hydrosol",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Rose hydrosol / rose water — aromatic floral water that often leads readable INCI lists and supports a gentle, comforting face-care story.",
      "match": [
        "rosa damascena flower water",
        "rose water / hydrosol"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "adds-repair",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-eye-cream",
        "fresh-repair-shampoo",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "rose-flower-oil-extract",
      "inciName": "Rose flower oil/extract",
      "commonName": "Rose flower oil/extract",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "rose flower oil/extract"
      ],
      "productIds": [
        "adds-effect",
        "adds-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "rose-hip-juice-concentrate",
      "inciName": "Rose hip juice concentrate",
      "commonName": "Rosa canina",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Rosa canina. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rose hip juice concentrate",
        "rosa canina"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "rosemary-extract",
      "inciName": "Rosemary extract",
      "commonName": "Rosmarinus officinalis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Rosmarinus officinalis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rosemary extract",
        "rosmarinus officinalis"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "rosemary-leaf-extract",
      "inciName": "Rosemary leaf extract",
      "commonName": "Rosmarinus officinalis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Rosmarinus officinalis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rosemary leaf extract",
        "rosmarinus officinalis"
      ],
      "productIds": [
        "ringanabty",
        "ringanachi",
      ]
    },
    {
      "id": "rosmarinus-officinalis-leaf-extract",
      "inciName": "Rosmarinus officinalis leaf extract",
      "commonName": "Rosemary leaf extract (antioxidant)",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Rosemary leaf extract — antioxidant plant support often paired with oils to help protect the formula and skin story from oxidative stress.",
      "match": [
        "rosmarinus officinalis leaf extract",
        "rosemary leaf extract (antioxidant)"
      ],
      "productIds": [
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cream-medium",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-illuminating-enzyme-mask",
        "fresh-moisturiser-for-men",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "rubus-chamaemorus-seed-oil",
      "inciName": "Rubus chamaemorus seed oil",
      "commonName": "Cloudberry oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cloudberry oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "rubus chamaemorus seed oil",
        "cloudberry oil"
      ],
      "productIds": [
        "fresh-overnight-face-treatment"
      ]
    },
    {
      "id": "rubus-idaeus-fruit-extract",
      "inciName": "Rubus idaeus fruit extract",
      "commonName": "Apple and raspberry extracts",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Apple and raspberry extracts. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "rubus idaeus fruit extract",
        "apple and raspberry extracts"
      ],
      "productIds": [
        "fresh-hand-balm",
        "fresh-hand-balm-pocket"
      ]
    },
    {
      "id": "rubus-idaeus-seed-powder",
      "inciName": "Rubus idaeus seed powder",
      "commonName": "Upcycled raspberry seed powder",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "One of the upcycled fruit-seed grains in FRESH scrub — leftover raspberry seeds, used as a gentle exfoliant. Confirm wording on the current pack.",
      "match": [
        "rubus idaeus seed powder",
        "upcycled raspberry seed powder"
      ],
      "productIds": [
        "fresh-scrub-face-body"
      ]
    },
    {
      "id": "ruscus-aculeatus-extract",
      "inciName": "Ruscus aculeatus extract",
      "commonName": "Butcher’s broom extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Butcher’s broom extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "ruscus aculeatus extract",
        "butcher’s broom extract"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "saccharide-isomerate",
      "inciName": "Saccharide isomerate",
      "commonName": "Carbohydrate complex for improved moisture retention",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Carbohydrate complex for improved moisture retention. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "saccharide isomerate",
        "carbohydrate complex for improved moisture retention"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-body-hair-wash",
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "saccharomyces-lysate-extract",
      "inciName": "Saccharomyces lysate extract",
      "commonName": "Postbiotic ingredient",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Postbiotic ingredient. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "saccharomyces lysate extract",
        "postbiotic ingredient"
      ],
      "productIds": [
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "saccharomyces-coix-lacryma-jobi-ma-yuen-seed-ferment-filtrate",
      "inciName": "Saccharomyces/Coix lacryma-jobi ma-yuen seed ferment filtrate",
      "commonName": "Hydrating Job’s tears seed ferment filtrate",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hydrating Job’s tears seed ferment filtrate. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "saccharomyces/coix lacryma-jobi ma-yuen seed ferment filtrate",
        "hydrating job’s tears seed ferment filtrate"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "saccharomyces-rice-ferment-filtrate",
      "inciName": "Saccharomyces/rice ferment filtrate",
      "commonName": "Fermented rice water",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Fermented rice water. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "saccharomyces/rice ferment filtrate",
        "fermented rice water"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "saffron-extract-crocus-sativus",
      "inciName": "Saffron extract (Crocus sativus)",
      "commonName": "Saffron extract (Crocus sativus)",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "saffron extract (crocus sativus)"
      ],
      "productIds": [
        "caps-moodoo"
      ]
    },
    {
      "id": "salix-alba-bark-extract",
      "inciName": "Salix alba bark extract",
      "commonName": "Skin-regenerating willow bark extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-regenerating willow bark extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "salix alba bark extract",
        "skin-regenerating willow bark extract"
      ],
      "productIds": [
        "adds-repair",
        "fresh-cream-light",
        "fresh-foot-balm",
        "fresh-illuminating-enzyme-mask",
        "fresh-moisturiser-for-men",
        "fresh-repair-shampoo",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "salvia-hispanica-seed-extract",
      "inciName": "Salvia hispanica seed extract",
      "commonName": "Chia seed oil, rich in linoleic acid",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Chia seed oil, rich in linoleic acid. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "salvia hispanica seed extract",
        "chia seed oil, rich in linoleic acid"
      ],
      "productIds": [
        "fresh-cleanser",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "salvia-triloba-leaf-extract",
      "inciName": "Salvia triloba leaf extract",
      "commonName": "Skin-protecting sage extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-protecting sage extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "salvia triloba leaf extract",
        "skin-protecting sage extract"
      ],
      "productIds": [
        "fresh-body-wash",
        "fresh-soap-liquid",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "sambucus-nigra-fruit-extract",
      "inciName": "Sambucus nigra fruit extract",
      "commonName": "Antioxidant elderberry extract",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Antioxidant elderberry extract. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "sambucus nigra fruit extract",
        "antioxidant elderberry extract"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-cream-rich",
        "fresh-moisturiser-for-men"
      ]
    },
    {
      "id": "sambucus-nigra-seed-oil",
      "inciName": "Sambucus nigra seed oil",
      "commonName": "Elder seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Elder seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "sambucus nigra seed oil",
        "elder seed oil"
      ],
      "productIds": [
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-sunscreen-face"
      ]
    },
    {
      "id": "santalum-spicatum-wood-water",
      "inciName": "Santalum spicatum wood water",
      "commonName": "Sandalwood hydrolate",
      "altNames": [],
      "roles": [
        "waters"
      ],
      "blurb": "Sandalwood hydrolate. A water or hydrosol that often appears high on the INCI. Part of why Ringana lists can feel readable from the first line — not just “aqua” as anonymous filler.",
      "match": [
        "santalum spicatum wood water",
        "sandalwood hydrolate"
      ],
      "productIds": [
        "adds-glow",
        "fresh-moisturiser-for-men",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "schisandra-berry-extract",
      "inciName": "Schisandra berry extract",
      "commonName": "Schisandra chinensis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Schisandra chinensis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "schisandra berry extract",
        "schisandra chinensis"
      ],
      "productIds": [
        "caps-moodoo"
      ]
    },
    {
      "id": "sclerotium-gum",
      "inciName": "Sclerotium gum",
      "commonName": "Natural gelling agent",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Natural gelling agent. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "sclerotium gum",
        "natural gelling agent"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-body-wash",
        "fresh-cream-rich"
      ]
    },
    {
      "id": "sea-buckthorn-berry-extract",
      "inciName": "Sea buckthorn berry extract",
      "commonName": "Hippophae rhamnoides",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hippophae rhamnoides. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "sea buckthorn berry extract",
        "hippophae rhamnoides"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "sea-buckthorn-seed-and-berry-oil",
      "inciName": "Sea buckthorn seed and berry oil",
      "commonName": "Hippophae rhamnoides",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Hippophae rhamnoides. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "sea buckthorn seed and berry oil",
        "hippophae rhamnoides"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "sea-salt",
      "inciName": "Sea salt",
      "commonName": "Sea salt",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "sea salt"
      ],
      "productIds": [
        "fresh-pack-balancing",
        "ringanabty",
        "ringanachi",
        "sport-endurance",
        "sport-protein"
      ]
    },
    {
      "id": "sea-salt-isomaltulose-is-a-source-of-glucose-and-fructose-gluten-free",
      "inciName": "Sea salt. Isomaltulose is a source of glucose and fructose gluten-free",
      "commonName": "Sea salt. Isomaltulose is a source of glucose and fructose gluten-free",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "sea salt. isomaltulose is a source of glucose and fructose gluten-free"
      ],
      "productIds": [
      ]
    },
    {
      "id": "section-biocosmetics-dose-the-product-carefully-to-avoid-excessive-use-lbv-3-9",
      "inciName": "Section Biocosmetics\" Dose the product carefully to avoid excessive use. LBV 3.9",
      "commonName": "Section Biocosmetics\" Dose the product carefully to avoid excessive use. LBV 3.9",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "section biocosmetics\" dose the product carefully to avoid excessive use. lbv 3.9"
      ],
      "productIds": [
        "fresh-soap"
      ]
    },
    {
      "id": "selaginella-lepidophylla-extract",
      "inciName": "Selaginella lepidophylla extract",
      "commonName": "Extract from the jiaogulan plant",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Extract from the jiaogulan plant. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "selaginella lepidophylla extract",
        "extract from the jiaogulan plant"
      ],
      "productIds": [
        "fresh-body-wash"
      ]
    },
    {
      "id": "selenium-enriched-yeast",
      "inciName": "Selenium-enriched yeast",
      "commonName": "Selenium-enriched yeast",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "selenium-enriched yeast"
      ],
      "productIds": [
        "sport-endurance"
      ]
    },
    {
      "id": "selenium-enriched-yeast-saccharomyces-cerevisiae",
      "inciName": "Selenium-enriched yeast (Saccharomyces cerevisiae)",
      "commonName": "Selenium-enriched yeast (Saccharomyces cerevisiae)",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "selenium-enriched yeast (saccharomyces cerevisiae)"
      ],
      "productIds": [
        "caps-mascu"
      ]
    },
    {
      "id": "sesamum-indicum-seed-oil",
      "inciName": "Sesamum indicum seed oil",
      "commonName": "Sesame oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Sesame seed oil — a nourishing plant oil used for softness and comfort in leave-on care.",
      "match": [
        "sesamum indicum seed oil",
        "sesame oil"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-cleanser",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-illuminating-enzyme-mask",
        "fresh-scrub-face-body"
      ]
    },
    {
      "id": "shatavari-root-extract",
      "inciName": "Shatavari root extract",
      "commonName": "Asparagus racemosus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Asparagus racemosus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "shatavari root extract",
        "asparagus racemosus"
      ],
      "productIds": [
        "caps-fem"
      ]
    },
    {
      "id": "shea-butter-ethyl-esters",
      "inciName": "Shea butter ethyl esters",
      "commonName": "Light shea butter emollient",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Light shea butter emollient. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "shea butter ethyl esters",
        "light shea butter emollient"
      ],
      "productIds": [
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "shorea-robusta-resin",
      "inciName": "Shorea robusta resin",
      "commonName": "Sala tree resin",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Sala tree resin. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "shorea robusta resin",
        "sala tree resin"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-foot-balm"
      ]
    },
    {
      "id": "silica",
      "inciName": "Silica",
      "commonName": "Silica (texture / soft-focus feel)",
      "altNames": [],
      "roles": [
        "minerals"
      ],
      "blurb": "Silica — used for texture, slip, and sometimes a soft-focus feel. A non-nano mineral helper in Ringana formulas, not a “filler villain” by default.",
      "match": [
        "silica",
        "silica (texture / soft-focus feel)"
      ],
      "productIds": [
        "adds-glow",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-sunscreen-spf-50",
        "fresh-illuminating-enzyme-mask",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "silver-ear-mushroom-extract",
      "inciName": "Silver ear mushroom extract",
      "commonName": "Tremella fuciformis",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Tremella fuciformis. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "silver ear mushroom extract",
        "tremella fuciformis"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "simmondsia-chinensis-seed-extract",
      "inciName": "Simmondsia chinensis seed extract",
      "commonName": "Jojoba seed extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Jojoba seed extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "simmondsia chinensis seed extract",
        "jojoba seed extract"
      ],
      "productIds": [
        "fresh-cleanser"
      ]
    },
    {
      "id": "simmondsia-chinensis-seed-oil",
      "inciName": "Simmondsia chinensis seed oil",
      "commonName": "Jojoba oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Jojoba oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "simmondsia chinensis seed oil",
        "jojoba oil"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-cream-rich",
        "fresh-repair-shampoo",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "sodium-acetylated-hyaluronate",
      "inciName": "Sodium acetylated hyaluronate",
      "commonName": "Hyaluronic acid derivative",
      "altNames": [],
      "roles": [
        "hyaluronic"
      ],
      "blurb": "Hyaluronic acid derivative. A hyaluronic-acid family ingredient that binds water for hydrated, comfortable-feeling skin. Formulas may use more than one HA size for a fuller moisture story.",
      "match": [
        "sodium acetylated hyaluronate",
        "hyaluronic acid derivative"
      ],
      "productIds": [
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "sodium-bicarbonate",
      "inciName": "Sodium bicarbonate",
      "commonName": "Deodorising sodium bicarbonate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Deodorising sodium bicarbonate. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "sodium bicarbonate",
        "deodorising sodium bicarbonate"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "sodium-cetearyl-sulfate",
      "inciName": "Sodium cetearyl sulfate",
      "commonName": "Sodium cetearyl sulfate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "sodium cetearyl sulfate"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "sodium-citrate",
      "inciName": "Sodium citrate",
      "commonName": "Salt of citric acid (pH / chelation support)",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "A salt of citric acid used for pH control and chelation support so formulas stay stable and comfortable.",
      "match": [
        "sodium citrate",
        "salt of citric acid (ph / chelation support)"
      ],
      "productIds": [
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-body-hair-wash",
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-serum",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "sodium-cocoate",
      "inciName": "Sodium cocoate",
      "commonName": "Cocos nucifera oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cocos nucifera oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "sodium cocoate",
        "cocos nucifera oil"
      ],
      "productIds": [
        "fresh-soap"
      ]
    },
    {
      "id": "sodium-dna",
      "inciName": "Sodium DNA",
      "commonName": "Rejuvenating and skin-strengthening",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Rejuvenating and skin-strengthening. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "sodium dna",
        "rejuvenating and skin-strengthening"
      ],
      "productIds": [
        "fresh-eye-cream"
      ]
    },
    {
      "id": "sodium-fluoride",
      "inciName": "Sodium fluoride",
      "commonName": "Remineralising sodium fluoride",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Remineralising sodium fluoride. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "sodium fluoride",
        "remineralising sodium fluoride"
      ],
      "productIds": [
        "fresh-baby-tooth-gel"
      ]
    },
    {
      "id": "sodium-hyaluronate",
      "inciName": "Sodium hyaluronate",
      "commonName": "Hyaluronic acid",
      "altNames": [
        "HA"
      ],
      "roles": [
        "hyaluronic"
      ],
      "blurb": "The salt form of hyaluronic acid — binds water for a plump, hydrated feel. Different molecular sizes hydrate differently; Ringana formulas may use more than one HA-related entry.",
      "match": [
        "sodium hyaluronate",
        "hyaluronic acid",
        "ha"
      ],
      "productIds": [
        "adds-effect",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-tooth-gel",
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-cleansing-water",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-hair-treatment",
        "fresh-hydro-serum",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-repair-shampoo",
        "fresh-soap-liquid",
        "fresh-sunscreen-face",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "sodium-hydroxide",
      "inciName": "Sodium hydroxide",
      "commonName": "Sodium hydroxide",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "sodium hydroxide"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-body-wash",
        "fresh-repair-shampoo",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "sodium-lactate",
      "inciName": "Sodium lactate",
      "commonName": "Part of skin’s natural moisturizing factor",
      "altNames": [],
      "roles": [
        "moisturizer",
        "amino-nmf"
      ],
      "blurb": "Part of the skin’s own natural moisturizing factor (NMF) family — supports hydration and comfortable barrier feel.",
      "match": [
        "sodium lactate",
        "part of skin’s natural moisturizing factor"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-cleansing-water",
        "fresh-cream-rich",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream"
      ]
    },
    {
      "id": "sodium-olivate",
      "inciName": "Sodium olivate",
      "commonName": "Olea europaea oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Olea europaea oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "sodium olivate",
        "olea europaea oil"
      ],
      "productIds": [
        "fresh-soap"
      ]
    },
    {
      "id": "sodium-pca",
      "inciName": "Sodium PCA",
      "commonName": "Improves combability when wet",
      "altNames": [],
      "roles": [
        "moisturizer",
        "amino-nmf"
      ],
      "blurb": "Improves combability when wet. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "sodium pca",
        "improves combability when wet"
      ],
      "productIds": [
        "fresh-body-milk-rich",
        "fresh-cream-medium",
        "fresh-hair-treatment",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-soap-liquid"
      ]
    },
    {
      "id": "sodium-phytate",
      "inciName": "Sodium phytate",
      "commonName": "Rice bran–derived chelating agent",
      "altNames": [
        "Phytic acid salt",
        "Rice bran chelator"
      ],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "A chelating agent typically derived from rice bran (phytic acid). Helps keep formulas stable by binding metal ions — not a fragrance, despite a few mislabeled parentheticals on older scraped pages. Prefer “rice bran chelator” language.",
      "match": [
        "sodium phytate",
        "rice bran–derived chelating agent",
        "phytic acid salt",
        "rice bran chelator"
      ],
      "productIds": [
        "adds-effect",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-intensive-hand-cream",
        "fresh-moisturiser-for-men",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket"
      ]
    },
    {
      "id": "sodium-salt-from-hyaluronic-acid",
      "inciName": "Sodium salt from hyaluronic acid",
      "commonName": "Sodium salt from hyaluronic acid",
      "altNames": [],
      "roles": [
        "hyaluronic"
      ],
      "blurb": "A hyaluronic-acid family ingredient that binds water for hydrated, comfortable-feeling skin. Formulas may use more than one HA size for a fuller moisture story.",
      "match": [
        "sodium salt from hyaluronic acid"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "sodium-stearoyl-glutamate",
      "inciName": "Sodium stearoyl glutamate",
      "commonName": "Natural emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "A natural emulsifier that helps oil and water stay blended in creams and lotions — another readable “why is this here?” answer for texture.",
      "match": [
        "sodium stearoyl glutamate",
        "natural emulsifier"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum",
        "fresh-body-milk-rich",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-sunscreen-face",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "sodium-zinc-polyitaconate",
      "inciName": "Sodium zinc polyitaconate",
      "commonName": "Neutralises odours",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Neutralises odours. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "sodium zinc polyitaconate",
        "neutralises odours"
      ],
      "productIds": [
        "fresh-deodorant",
        "fresh-deodorant-pocket"
      ]
    },
    {
      "id": "sorbitan-olivate",
      "inciName": "Sorbitan olivate",
      "commonName": "Olive-derived emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Olive-based emulsifier partner — works with oils and waters in leave-on care so the texture stays elegant and stable without mineral-oil shortcuts.",
      "match": [
        "sorbitan olivate",
        "olive-derived emulsifier"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "sorbitol",
      "inciName": "Sorbitol",
      "commonName": "Maize sorbitol",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Maize sorbitol. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "sorbitol",
        "maize sorbitol"
      ],
      "productIds": [
        "adds-glow"
      ]
    },
    {
      "id": "sour-cherry-juice-concentrate",
      "inciName": "Sour cherry juice concentrate",
      "commonName": "Prunus cerasus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Prunus cerasus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "sour cherry juice concentrate",
        "prunus cerasus"
      ],
      "productIds": [
      ]
    },
    {
      "id": "sphagnum-magellanicum-extract",
      "inciName": "Sphagnum magellanicum extract",
      "commonName": "Peat moss extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Peat moss extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "sphagnum magellanicum extract",
        "peat moss extract"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-body-wash",
        "fresh-foot-balm",
        "fresh-hydro-serum"
      ]
    },
    {
      "id": "spilanthes-acmella-flower-leaf-stem-extract",
      "inciName": "Spilanthes acmella flower/leaf/stem extract",
      "commonName": "Firming paracress extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Firming paracress extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "spilanthes acmella flower/leaf/stem extract",
        "firming paracress extract"
      ],
      "productIds": [
        "fresh-anti-wrinkle-serum"
      ]
    },
    {
      "id": "spinach-powder",
      "inciName": "Spinach powder",
      "commonName": "Spinacia oleracea",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Spinacia oleracea. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "spinach powder",
        "spinacia oleracea"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "spirulina-algae-powder",
      "inciName": "Spirulina algae powder",
      "commonName": "Sulphites) (Spirulina platensis",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Sulphites) (Spirulina platensis. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "spirulina algae powder",
        "sulphites) (spirulina platensis"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "sprouted-buckwheat-powder",
      "inciName": "Sprouted buckwheat powder",
      "commonName": "Fagopyrum esculentum",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Fagopyrum esculentum. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "sprouted buckwheat powder",
        "fagopyrum esculentum"
      ],
      "productIds": [
        "caps-cerebro",
        "caps-moodoo"
      ]
    },
    {
      "id": "squalane",
      "inciName": "Squalane",
      "commonName": "Olive squalane",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "A lightweight lipid (often olive-derived here) that softens skin and supports barrier feel without a heavy, greasy finish — great bridge language between “oils” and “dry skin that still hates grease.”",
      "match": [
        "squalane",
        "olive squalane"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-body-milk-rich",
        "fresh-eye-cream",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-face",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "squalanes",
      "inciName": "Squalanes",
      "commonName": "Olive squalane",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "A lightweight lipid (often olive-derived here) that softens skin and supports barrier feel without a heavy, greasy finish — great bridge language between “oils” and “dry skin that still hates grease.”",
      "match": [
        "squalanes",
        "olive squalane"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50",
        "fresh-cleanser",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-skin-perfection",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "squalene",
      "inciName": "Squalene",
      "commonName": "Olive squalene",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Olive squalene. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "squalene",
        "olive squalene"
      ],
      "productIds": [
        "fresh-intensive-hand-cream"
      ]
    },
    {
      "id": "stabiliser-gum-arabic",
      "inciName": "Stabiliser: gum arabic",
      "commonName": "Acacia senegal",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Acacia senegal. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "stabiliser: gum arabic",
        "acacia senegal"
      ],
      "productIds": [
      ]
    },
    {
      "id": "stearic-acid",
      "inciName": "Stearic acid",
      "commonName": "Plant-derived dispersing agent",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Plant-derived dispersing agent. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "stearic acid",
        "plant-derived dispersing agent"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "strawberry-powder",
      "inciName": "Strawberry powder",
      "commonName": "Fragaria ananassa) (freeze-dried",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Fragaria ananassa) (freeze-dried. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "strawberry powder",
        "fragaria ananassa) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "succinoglycan",
      "inciName": "Succinoglycan",
      "commonName": "Natural thickener",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Natural thickener. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "succinoglycan",
        "natural thickener"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-body-wash",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body"
      ]
    },
    {
      "id": "sucrose-stearate",
      "inciName": "Sucrose stearate",
      "commonName": "Natural sugar emulsifier",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "Natural sugar emulsifier. Helps oil and water stay blended so creams and lotions feel even and stable. On Ringana labels, emulsifiers are often named with a plant source — a useful teaching contrast to mystery “emulsifying wax.”",
      "match": [
        "sucrose stearate",
        "natural sugar emulsifier"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-baby-sunscreen-spf-50",
        "fresh-eye-serum",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "sweet-cherry-juice-concentrate",
      "inciName": "Sweet cherry juice concentrate",
      "commonName": "Prunus avium",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Prunus avium. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "sweet cherry juice concentrate",
        "prunus avium"
      ],
      "productIds": [
      ]
    },
    {
      "id": "symphytum-officinale-root-extract",
      "inciName": "Symphytum officinale root extract",
      "commonName": "Comfrey root extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Comfrey root extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "symphytum officinale root extract",
        "comfrey root extract"
      ],
      "productIds": [
        "fresh-foot-balm"
      ]
    },
    {
      "id": "tapioca-starch",
      "inciName": "Tapioca starch",
      "commonName": "Moisture-absorbing tapioca starch",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Moisture-absorbing tapioca starch. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "tapioca starch",
        "moisture-absorbing tapioca starch"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-illuminating-enzyme-mask"
      ]
    },
    {
      "id": "tasmannia-lanceolata-leaf-extract",
      "inciName": "Tasmannia lanceolata leaf extract",
      "commonName": "Tasmanian pepper with antioxidant properties",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Tasmanian pepper with antioxidant properties. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "tasmannia lanceolata leaf extract",
        "tasmanian pepper with antioxidant properties"
      ],
      "productIds": [
        "fresh-cleansing-water"
      ]
    },
    {
      "id": "the-amino-acid-l-carnosine",
      "inciName": "The amino acid L-carnosine",
      "commonName": "The amino acid L-carnosine",
      "altNames": [],
      "roles": [
        "amino-nmf"
      ],
      "blurb": "A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "the amino acid l-carnosine"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "theobroma-cacao-seed-butter",
      "inciName": "Theobroma cacao seed butter",
      "commonName": "Cacao butter",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cacao butter. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "theobroma cacao seed butter",
        "cacao butter"
      ],
      "productIds": [
        "fresh-lip-balm-nude-spf-15"
      ]
    },
    {
      "id": "theobroma-grandiflorum-seed-butter",
      "inciName": "Theobroma grandiflorum seed butter",
      "commonName": "Skin‑conditioning cupuaçu butter",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Skin‑conditioning cupuaçu butter. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "theobroma grandiflorum seed butter",
        "skin‑conditioning cupuaçu butter"
      ],
      "productIds": [
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-eye-cream",
        "fresh-foot-balm",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "thickening-agent-gum-arabic-and-xanthan",
      "inciName": "Thickening agent: gum arabic and xanthan",
      "commonName": "Thickening agent: gum arabic and xanthan",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "thickening agent: gum arabic and xanthan"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "thymus-vulgaris-flower-leaf-extract",
      "inciName": "Thymus vulgaris flower/leaf extract",
      "commonName": "Skin-strengthening thyme extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Skin-strengthening thyme extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "thymus vulgaris flower/leaf extract",
        "skin-strengthening thyme extract"
      ],
      "productIds": [
        "fresh-cleansing-water",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "tilia-tomentosa-bud-extract",
      "inciName": "Tilia tomentosa bud extract",
      "commonName": "Silver linden extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Silver linden extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "tilia tomentosa bud extract",
        "silver linden extract"
      ],
      "productIds": [
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "titanium-dioxide",
      "inciName": "Titanium dioxide",
      "commonName": "Mineral sun protection",
      "altNames": [],
      "roles": [
        "uv"
      ],
      "blurb": "Mineral titanium dioxide — used as a mineral UV filter and/or mineral pigment. Ringana’s mineral filters/pigments are non-nano; confirm on the current pack for the specific SKU.",
      "match": [
        "titanium dioxide",
        "mineral sun protection"
      ],
      "productIds": [
        "fresh-baby-sunscreen-spf-50"
      ]
    },
    {
      "id": "tocopherol",
      "inciName": "Tocopherol",
      "commonName": "Vitamin E",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Vitamin E — antioxidant support that helps protect oils and skin from oxidative stress. Often sits near plant oils and butters as part of the formula’s defense system.",
      "match": [
        "tocopherol",
        "vitamin e"
      ],
      "productIds": [
        "adds-glow",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-baby-bum-cream",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-foot-balm",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-illuminating-enzyme-mask",
        "fresh-intensive-hand-cream",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-repair-shampoo",
        "fresh-scrub-face-body",
        "fresh-skin-perfection",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-balm-lip-cheek-rosewood",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "tomato-powder",
      "inciName": "Tomato powder",
      "commonName": "Lycopersicon esculentum",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Lycopersicon esculentum. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "tomato powder",
        "lycopersicon esculentum"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "trametes-versicolor-extract",
      "inciName": "Trametes versicolor extract",
      "commonName": "Heat and colour protection complex from bamboo and turkey tail fungus",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Heat and colour protection complex from bamboo and turkey tail fungus. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "trametes versicolor extract",
        "heat and colour protection complex from bamboo and turkey tail fungus"
      ],
      "productIds": [
        "fresh-hair-treatment",
        "fresh-repair-shampoo"
      ]
    },
    {
      "id": "tremella-fuciformis-sporocarp-extract",
      "inciName": "Tremella fuciformis sporocarp extract",
      "commonName": "Hydrating snow mushroom extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Hydrating snow mushroom extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "tremella fuciformis sporocarp extract",
        "hydrating snow mushroom extract"
      ],
      "productIds": [
        "fresh-body-milk-light",
        "fresh-hair-treatment",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "tridecane",
      "inciName": "Tridecane",
      "commonName": "Light emollient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Light emollient. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "tridecane",
        "light emollient"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "triethyl-citrate",
      "inciName": "Triethyl citrate",
      "commonName": "Triethyl citrate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "triethyl citrate"
      ],
      "productIds": [
        "fresh-eye-cream",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "trihydroxystearin",
      "inciName": "Trihydroxystearin",
      "commonName": "Thickener derived from ricin oil",
      "altNames": [],
      "roles": [
        "thickener",
        "oils-lipids"
      ],
      "blurb": "Thickener derived from ricin oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "trihydroxystearin",
        "thickener derived from ricin oil"
      ],
      "productIds": [
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "triticum-vulgare-aestivum-grain-extract",
      "inciName": "Triticum vulgare/aestivum grain extract",
      "commonName": "Wheat ceramides",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "barrier",
        "extracts-ferments"
      ],
      "blurb": "Wheat ceramides. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "triticum vulgare/aestivum grain extract",
        "wheat ceramides"
      ],
      "productIds": [
        "fresh-cream-medium"
      ]
    },
    {
      "id": "turmeric-root-extract",
      "inciName": "Turmeric root extract",
      "commonName": "Curcuma longa",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Curcuma longa. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "turmeric root extract",
        "curcuma longa"
      ],
      "productIds": [
        "caps-move"
      ]
    },
    {
      "id": "ubiquinol",
      "inciName": "Ubiquinol",
      "commonName": "Ubiquinol",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "ubiquinol"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "ubiquinone",
      "inciName": "Ubiquinone",
      "commonName": "Highly antioxidant coenzyme Q10",
      "altNames": [],
      "roles": [
        "antioxidant"
      ],
      "blurb": "Highly antioxidant coenzyme Q10. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "ubiquinone",
        "highly antioxidant coenzyme q10"
      ],
      "productIds": [
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-cream-medium",
        "fresh-cream-rich",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-skin-perfection"
      ]
    },
    {
      "id": "undecane",
      "inciName": "Undecane",
      "commonName": "Light emollient",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Light emollient. Listed on Ringana product INCIs in this library — open Products that contain it to see where it shows up, and confirm wording on the current pack.",
      "match": [
        "undecane",
        "light emollient"
      ],
      "productIds": [
        "fresh-tinted-balm-lip-cheek-rosewood"
      ]
    },
    {
      "id": "urea",
      "inciName": "Urea",
      "commonName": "Urea",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "urea"
      ],
      "productIds": [
        "fresh-foot-balm",
        "fresh-intensive-hand-cream"
      ]
    },
    {
      "id": "vaccinium-macrocarpon-seed-oil",
      "inciName": "Vaccinium macrocarpon seed oil",
      "commonName": "Cranberry seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Cranberry seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "vaccinium macrocarpon seed oil",
        "cranberry seed oil"
      ],
      "productIds": [
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "vanilla-planifolia-fruit-extract",
      "inciName": "Vanilla planifolia fruit extract",
      "commonName": "Antioxidant vanilla extract",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Antioxidant vanilla extract. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vanilla planifolia fruit extract",
        "antioxidant vanilla extract"
      ],
      "productIds": [
        "fresh-baby-body-hair-wash",
        "fresh-baby-cream",
        "fresh-baby-oil",
        "fresh-baby-sunscreen-spf-50",
        "fresh-stay-fresh"
      ]
    },
    {
      "id": "vegan-amino-acid-mixture",
      "inciName": "Vegan amino acid mixture",
      "commonName": "Glycine, L-proline, L-alanine, L-aspartic acid, L-glutamic acid, L-arginine, L-serine, L-leucine, L-valine, L-threonine, L-glutamine, L-lysine, L-isoleucine, L-phenylalanine, L-tyrosine, L-methionine, L-histidine, L-cysteine, L-tryptophan",
      "altNames": [],
      "roles": [
        "amino-nmf"
      ],
      "blurb": "Glycine, L-proline, L-alanine, L-aspartic acid, L-glutamic acid, L-arginine, L-serine, L-leucine, L-valine, L-threonine, L-glutamine, L-lysine, L-isoleucine, L-phenylalanine, L-tyrosine, L-methionine, L-histidine, L-cysteine, L-tryptophan. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "vegan amino acid mixture",
        "glycine, l-proline, l-alanine, l-aspartic acid, l-glutamic acid, l-arginine, l-serine, l-leucine, l-valine, l-threonine, l-glutamine, l-lysine, l-isoleucine, l-phenylalanine, l-tyrosine, l-methionine, l-histidine, l-cysteine, l-tryptophan"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "vegetable-oils-and-extracts",
      "inciName": "Vegetable oils and extracts",
      "commonName": "Vegetable oils and extracts",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "vegetable oils and extracts"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "vinegar",
      "inciName": "Vinegar",
      "commonName": "Vinegar",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "vinegar"
      ],
      "productIds": [
        "ringanabty",
        "ringanachi",
        "ringanadea"
      ]
    },
    {
      "id": "vitamin-b12-methylcobalamin",
      "inciName": "Vitamin B12 (methylcobalamin)",
      "commonName": "Vitamin B12 (methylcobalamin)",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin b12 (methylcobalamin)"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "vitamin-b12-methylcobalamin-contains-negligible-amounts-of-iodine",
      "inciName": "Vitamin B12 (methylcobalamin). contains negligible amounts of iodine",
      "commonName": "Vitamin B12 (methylcobalamin). contains negligible amounts of iodine",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin b12 (methylcobalamin). contains negligible amounts of iodine"
      ],
      "productIds": [
        "beyond-spermidine"
      ]
    },
    {
      "id": "vitamin-b2",
      "inciName": "Vitamin B2",
      "commonName": "Riboflavin",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Riboflavin. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin b2",
        "riboflavin"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "vitamin-c",
      "inciName": "Vitamin C",
      "commonName": "L-ascorbic acid",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "L-ascorbic acid. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin c",
        "l-ascorbic acid"
      ],
      "productIds": [
        "caps-fem",
        "ringanabty",
        "ringanadea"
      ]
    },
    {
      "id": "vitamin-c-and-l-theanine-new-formulation-reduced-sugar-content-ingredients-water",
      "inciName": "Vitamin C and L-theanine. New formulation: reduced sugar content! INGREDIENTS Water",
      "commonName": "Vitamin C and L-theanine. New formulation: reduced sugar content! INGREDIENTS Water",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin c and l-theanine. new formulation: reduced sugar content! ingredients water"
      ],
      "productIds": [
        "ringanachi"
      ]
    },
    {
      "id": "vitamin-c-and-minerals-ingredients-capsule-shell-hydroxypropyl-methyl-cellulose",
      "inciName": "Vitamin C and minerals. INGREDIENTS Capsule shell: hydroxypropyl methyl cellulose",
      "commonName": "Vitamin C and minerals. INGREDIENTS Capsule shell: hydroxypropyl methyl cellulose",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "supplement"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin c and minerals. ingredients capsule shell: hydroxypropyl methyl cellulose"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "vitamin-c-and-the-minerals-zinc-and-copper-ingredients-polypodiutomom-leucas-lea",
      "inciName": "Vitamin C and the minerals zinc and copper. INGREDIENTS Polypodiutomom leucas leaf extract",
      "commonName": "Vitamin C and the minerals zinc and copper. INGREDIENTS Polypodiutomom leucas leaf extract",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin c and the minerals zinc and copper. ingredients polypodiutomom leucas leaf extract"
      ],
      "productIds": [
        "caps-protect"
      ]
    },
    {
      "id": "vitamin-c-from-acerola",
      "inciName": "Vitamin C from acerola",
      "commonName": "Vitamin C from acerola",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin c from acerola"
      ],
      "productIds": [
        "caps-mascu"
      ]
    },
    {
      "id": "vitamin-c-from-acerola-cherry-powder",
      "inciName": "Vitamin C from acerola cherry powder",
      "commonName": "Vitamin C from acerola cherry powder",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin c from acerola cherry powder"
      ],
      "productIds": [
        "caps-move"
      ]
    },
    {
      "id": "vitamin-d3-cholecalciferol-from-algae",
      "inciName": "Vitamin D3 (cholecalciferol) from algae",
      "commonName": "Vitamin D3 (cholecalciferol) from algae",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin d3 (cholecalciferol) from algae"
      ],
      "productIds": [
        "caps-hydro",
        "caps-move",
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing",
        "sport-protein"
      ]
    },
    {
      "id": "vitamin-d3-cholecalciferol-from-algae-gluten-free",
      "inciName": "Vitamin D3 (cholecalciferol) from algae. gluten-free",
      "commonName": "Vitamin D3 (cholecalciferol) from algae. gluten-free",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin d3 (cholecalciferol) from algae. gluten-free"
      ],
      "productIds": [
        "caps-immu"
      ]
    },
    {
      "id": "vitamin-d3-cholecalciferol-from-lichen-extract",
      "inciName": "Vitamin D3 (cholecalciferol) from lichen extract",
      "commonName": "Vitamin D3 (cholecalciferol) from lichen extract",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin d3 (cholecalciferol) from lichen extract"
      ],
      "productIds": [
        "beyond-biotic"
      ]
    },
    {
      "id": "vitamin-d3-from-algae",
      "inciName": "Vitamin D3 from algae",
      "commonName": "Vitamin D3 from algae",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin d3 from algae"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "vitamin-e-and-secondary-plant-substances-ingredients-dha-and-epa-rich-oil-from-t",
      "inciName": "Vitamin E and secondary plant substances. INGREDIENTS DHA- and EPA-rich oil from the microalgae Schizochytrium sp",
      "commonName": "Vitamin E and secondary plant substances. INGREDIENTS DHA- and EPA-rich oil from the microalgae Schizochytrium sp",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "vitamins-actives",
        "supplement"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin e and secondary plant substances. ingredients dha- and epa-rich oil from the microalgae schizochytrium sp"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "vitamin-k",
      "inciName": "Vitamin K",
      "commonName": "Vitamin K",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin k"
      ],
      "productIds": [
        "beyond-omega"
      ]
    },
    {
      "id": "vitamin-k2",
      "inciName": "Vitamin K2",
      "commonName": "Menaquinone-7 from Bacillus subtilis natto ferment",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Menaquinone-7 from Bacillus subtilis natto ferment. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin k2",
        "menaquinone-7 from bacillus subtilis natto ferment"
      ],
      "productIds": [
        "beyond-omega",
        "caps-move",
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "vitamin-k2-from-bacillus-subtilis-and-vitamin-d3-from-algae-ingredients-methylsu",
      "inciName": "Vitamin K2 from Bacillus subtilis and vitamin D3 from algae. INGREDIENTS Methylsulfonylmethane",
      "commonName": "Vitamin K2 from Bacillus subtilis and vitamin D3 from algae. INGREDIENTS Methylsulfonylmethane",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamin k2 from bacillus subtilis and vitamin d3 from algae. ingredients methylsulfonylmethane"
      ],
      "productIds": [
        "caps-move"
      ]
    },
    {
      "id": "vitamins-and-hyaluronic-acid-ingredients-water",
      "inciName": "Vitamins and hyaluronic acid. INGREDIENTS Water",
      "commonName": "Vitamins and hyaluronic acid. INGREDIENTS Water",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "hyaluronic"
      ],
      "blurb": "A hyaluronic-acid family ingredient that binds water for hydrated, comfortable-feeling skin. Formulas may use more than one HA size for a fuller moisture story.",
      "match": [
        "vitamins and hyaluronic acid. ingredients water"
      ],
      "productIds": [
        "ringanabty"
      ]
    },
    {
      "id": "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-calcium-citrate",
      "inciName": "Vitamins and minerals. A powder for making shakes. INGREDIENTS Calcium citrate",
      "commonName": "Vitamins and minerals. A powder for making shakes. INGREDIENTS Calcium citrate",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamins and minerals. a powder for making shakes. ingredients calcium citrate"
      ],
      "productIds": [
        "fresh-pack-balancing"
      ]
    },
    {
      "id": "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-enzymatically-ferme",
      "inciName": "Vitamins and minerals. A powder for making shakes. INGREDIENTS Enzymatically fermented guar bean fibre",
      "commonName": "Cyamopsis tetragonoloba",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "extracts-ferments"
      ],
      "blurb": "Cyamopsis tetragonoloba. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamins and minerals. a powder for making shakes. ingredients enzymatically fermented guar bean fibre",
        "cyamopsis tetragonoloba"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ]
    },
    {
      "id": "vitamins-and-minerals-a-powder-for-making-shakes-ingredients-raspberry-powder",
      "inciName": "Vitamins and minerals. A powder for making shakes. INGREDIENTS Raspberry powder",
      "commonName": "Rubus idaeus) (freeze-dried",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Rubus idaeus) (freeze-dried. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamins and minerals. a powder for making shakes. ingredients raspberry powder",
        "rubus idaeus) (freeze-dried"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ]
    },
    {
      "id": "vitamins-and-minerals-ingredients-vegan-source-of-protein-pea-protein-isolate",
      "inciName": "Vitamins and minerals. INGREDIENTS Vegan source of protein [pea protein isolate",
      "commonName": "Pisum sativum",
      "altNames": [],
      "roles": [
        "vitamins-actives"
      ],
      "blurb": "Pisum sativum. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitamins and minerals. ingredients vegan source of protein [pea protein isolate",
        "pisum sativum"
      ],
      "productIds": [
        "sport-protein"
      ]
    },
    {
      "id": "vitis-vinifera-fruit-extract",
      "inciName": "Vitis vinifera fruit extract",
      "commonName": "Antioxidant red wine polyphenols",
      "altNames": [],
      "roles": [
        "antioxidant",
        "extracts-ferments"
      ],
      "blurb": "Antioxidant red wine polyphenols. An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "vitis vinifera fruit extract",
        "antioxidant red wine polyphenols"
      ],
      "productIds": [
        "adds-repair",
        "fresh-light-legs"
      ]
    },
    {
      "id": "vitis-vinifera-leaf-extract",
      "inciName": "Vitis vinifera leaf extract",
      "commonName": "Extract from vine leaves that stimulates microcirculation",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Extract from vine leaves that stimulates microcirculation. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "vitis vinifera leaf extract",
        "extract from vine leaves that stimulates microcirculation"
      ],
      "productIds": [
        "fresh-light-legs"
      ]
    },
    {
      "id": "vitis-vinifera-seed-oil",
      "inciName": "Vitis vinifera seed oil",
      "commonName": "Grape seed oil",
      "altNames": [],
      "roles": [
        "oils-lipids"
      ],
      "blurb": "Grape seed oil. A plant oil, butter, or lipid that softens skin and helps reduce the feel of moisture loss.",
      "match": [
        "vitis vinifera seed oil",
        "grape seed oil"
      ],
      "productIds": [
        "fresh-cleanser",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "waxy-maize-starch",
      "inciName": "Waxy maize starch",
      "commonName": "Waxy maize starch",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "waxy maize starch"
      ],
      "productIds": [
        "ringanachi",
        "sport-endurance"
      ]
    },
    {
      "id": "wheat-seed-lipid-extract-triticum-vulgare-gluten-free",
      "inciName": "Wheat seed lipid extract (Triticum vulgare). gluten-free",
      "commonName": "Wheat seed lipid extract (Triticum vulgare). gluten-free",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "wheat seed lipid extract (triticum vulgare). gluten-free"
      ],
      "productIds": [
        "caps-beauty-hair"
      ]
    },
    {
      "id": "winter-linden-blossom-extract",
      "inciName": "Winter linden blossom extract",
      "commonName": "Tilia cordata",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Tilia cordata. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "winter linden blossom extract",
        "tilia cordata"
      ],
      "productIds": [
      ]
    },
    {
      "id": "with-amino-acid-l-tryptophan-and-natural-vitamin-c-ingredients-water",
      "inciName": "With amino acid l-tryptophan and natural vitamin C. INGREDIENTS Water",
      "commonName": "With amino acid l-tryptophan and natural vitamin C. INGREDIENTS Water",
      "altNames": [],
      "roles": [
        "vitamins-actives",
        "amino-nmf"
      ],
      "blurb": "An active / antioxidant support ingredient. Freshness matters for many of these — a natural bridge to Ringana’s small-batch and dating story.",
      "match": [
        "with amino acid l-tryptophan and natural vitamin c. ingredients water"
      ],
      "productIds": [
      ]
    },
    {
      "id": "xanthan-gum",
      "inciName": "Xanthan gum",
      "commonName": "Natural thickener",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "A natural polysaccharide thickener that gives gels and emulsions their body so textures feel intentional instead of watery.",
      "match": [
        "xanthan gum",
        "natural thickener"
      ],
      "productIds": [
        "adds-glow",
        "adds-repair",
        "fresh-after-sun-tan-booster",
        "fresh-after-sun-tan-booster-golden-glow",
        "fresh-anti-wrinkle-serum",
        "fresh-baby-body-hair-wash",
        "fresh-baby-tooth-gel",
        "fresh-body-milk-light",
        "fresh-body-milk-rich",
        "fresh-body-wash",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-cream-medium",
        "fresh-eye-cream",
        "fresh-eye-serum",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-hydro-serum",
        "fresh-intensive-hand-cream",
        "fresh-light-legs",
        "fresh-moisturiser-for-men",
        "fresh-skin-perfection",
        "fresh-soap-liquid",
        "fresh-stay-fresh",
        "fresh-sunscreen-face",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4",
        "fresh-tinted-moisturiser-tan",
        "fresh-toner-calm",
        "fresh-toner-calm-pocket"
      ]
    },
    {
      "id": "xylitol",
      "inciName": "Xylitol",
      "commonName": "Birch sugar (moisturizing)",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Birch sugar — a moisturizing sugar alcohol that can support hydration and comfortable skin feel, sometimes as part of a birch-sugar complex.",
      "match": [
        "xylitol",
        "birch sugar (moisturizing)"
      ],
      "productIds": [
        "fresh-baby-tooth-gel",
        "fresh-cleanser",
        "fresh-cream-light",
        "fresh-hair-treatment",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body",
        "fresh-soap-liquid",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "xylitylglucoside",
      "inciName": "Xylitylglucoside",
      "commonName": "Restructuring birch sugar complex",
      "altNames": [],
      "roles": [
        "moisturizer"
      ],
      "blurb": "Restructuring birch sugar complex. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "xylitylglucoside",
        "restructuring birch sugar complex"
      ],
      "productIds": [
        "fresh-cream-light",
        "fresh-hair-treatment",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-moisturiser-for-men",
        "fresh-soap-liquid",
        "fresh-tinted-moisturiser",
        "fresh-tinted-moisturiser-tan"
      ]
    },
    {
      "id": "xylose",
      "inciName": "Xylose",
      "commonName": "Natural emulsifier derived from wheat",
      "altNames": [],
      "roles": [
        "emulsifier"
      ],
      "blurb": "A sugar-derived emulsifier. On some Ringana labels it’s noted as wheat-derived — important for wheat/gluten-sensitivity conversations (cosmetics ≠ food allergy rules, but partners should still send people to the current INCI).",
      "match": [
        "xylose",
        "natural emulsifier derived from wheat"
      ],
      "productIds": [
        "fresh-cleanser",
        "fresh-hand-balm",
        "fresh-hand-balm-pocket",
        "fresh-overnight-face-treatment",
        "fresh-scrub-face-body"
      ]
    },
    {
      "id": "yeast-saccharomyces-cerevisiae-beta-glucans",
      "inciName": "Yeast (Saccharomyces cerevisiae) beta-glucans",
      "commonName": "Yeast (Saccharomyces cerevisiae) beta-glucans",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "yeast (saccharomyces cerevisiae) beta-glucans"
      ],
      "productIds": [
        "caps-immu"
      ]
    },
    {
      "id": "yellow-gentian-root-extract",
      "inciName": "Yellow gentian root extract",
      "commonName": "Gentiana lutea",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Gentiana lutea. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "yellow gentian root extract",
        "gentiana lutea"
      ],
      "productIds": [
        "caps-d-gest"
      ]
    },
    {
      "id": "zinc-and-chromium-ingredients-water",
      "inciName": "Zinc and chromium. INGREDIENTS Water",
      "commonName": "Zinc and chromium. INGREDIENTS Water",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "zinc and chromium. ingredients water"
      ],
      "productIds": [
        "ringanadea"
      ]
    },
    {
      "id": "zinc-and-selenium-ingredients-lipid-complex-from-fenugreek-seed-extract",
      "inciName": "Zinc and selenium. INGREDIENTS Lipid complex from fenugreek seed extract",
      "commonName": "Trigonella foenum-graecum",
      "altNames": [],
      "roles": [
        "oils-lipids",
        "extracts-ferments"
      ],
      "blurb": "Trigonella foenum-graecum. Supports barrier comfort and softness — the “seal” side of moisture. Pair with humectants when someone needs both water-binding and lipid support.",
      "match": [
        "zinc and selenium. ingredients lipid complex from fenugreek seed extract",
        "trigonella foenum-graecum"
      ],
      "productIds": [
        "caps-mascu"
      ]
    },
    {
      "id": "zinc-bisglycinate",
      "inciName": "Zinc bisglycinate",
      "commonName": "Zinc bisglycinate",
      "altNames": [],
      "roles": [
        "other"
      ],
      "blurb": "Listed on Ringana product INCIs in this library. Open Products that contain it to see where it shows up, and confirm the current packaging / ringana.com for the latest wording.",
      "match": [
        "zinc bisglycinate"
      ],
      "productIds": [
        "caps-d-gest",
        "caps-mascu",
        "caps-protect",
        "ringanadea",
        "sport-push"
      ]
    },
    {
      "id": "zinc-oxide",
      "inciName": "Zinc oxide",
      "commonName": "Mineral sun protection",
      "altNames": [],
      "roles": [
        "preservation",
        "uv"
      ],
      "blurb": "Mineral zinc oxide — used for broad-spectrum UVA/UVB protection (and sometimes mild antimicrobial support in leave-ons like deodorant). Ringana specifies non-nano mineral zinc oxide — say that clearly when nanoparticle questions come up.",
      "match": [
        "zinc oxide",
        "mineral sun protection"
      ],
      "productIds": [
        "fresh-baby-bum-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-deodorant",
        "fresh-deodorant-pocket",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-face",
        "fresh-sunscreen-spf-25",
        "fresh-tinted-moisturiser-spf-30-n1",
        "fresh-tinted-moisturiser-spf-30-n2",
        "fresh-tinted-moisturiser-spf-30-n3",
        "fresh-tinted-moisturiser-spf-30-n4"
      ]
    },
    {
      "id": "zinc-pca",
      "inciName": "Zinc PCA",
      "commonName": "Natural moisture retention factor",
      "altNames": [],
      "roles": [
        "amino-nmf"
      ],
      "blurb": "Natural moisture retention factor. A moisturizing / humectant-style ingredient that helps bind or hold water so skin and formulas feel comfortable.",
      "match": [
        "zinc pca",
        "natural moisture retention factor"
      ],
      "productIds": [
        "adds-repair",
        "fresh-baby-cream",
        "fresh-moisturiser-for-men",
        "fresh-toner-pure"
      ]
    },
    {
      "id": "zinc-stearate",
      "inciName": "Zinc stearate",
      "commonName": "Zinc-fatty acid compound",
      "altNames": [],
      "roles": [
        "thickener"
      ],
      "blurb": "Zinc-fatty acid compound. A texture helper that gives gels and emulsions their body so the product feels intentional to spread and wear.",
      "match": [
        "zinc stearate",
        "zinc-fatty acid compound"
      ],
      "productIds": [
        "fresh-baby-cream",
        "fresh-baby-sunscreen-spf-50",
        "fresh-foot-balm",
        "fresh-lip-balm-classic",
        "fresh-lip-balm-nude-spf-15",
        "fresh-sunscreen-spf-25"
      ]
    },
    {
      "id": "zingiber-officinale-root-extract",
      "inciName": "Zingiber officinale root extract",
      "commonName": "Ginger extract",
      "altNames": [],
      "roles": [
        "extracts-ferments"
      ],
      "blurb": "Ginger extract. A botanical extract, ferment, or cultured active in the supporting cast. Don’t overclaim every extract — point to product heroes first, then the full INCI.",
      "match": [
        "zingiber officinale root extract",
        "ginger extract"
      ],
      "productIds": [
        "adds-repair",
        "fresh-body-wash",
        "fresh-hydro-serum",
        "fresh-light-legs",
        "fresh-moisturiser-for-men",
        "fresh-soap-liquid",
        "fresh-volume-shampoo"
      ]
    },
    {
      "id": "sig-ahcc",
      "inciName": "AHCC™ Alpha-glucan-containing Shiitake concentrate",
      "commonName": "AHCC Alpha-glucan-containing Shiitake concentrate",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "Rich in alpha-glucans. Shiitake is valued in traditional Chinese medicine and is considered the “elixir of life.” (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "ahcc™ alpha-glucan-containing shiitake concentrate",
        "ahcc alpha-glucan-containing shiitake concentrate",
        "ahcc"
      ],
      "productIds": [
        "caps-immu"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-immu/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.ahcc.net/",
      "manufacturerLabel": "AHCC® official site"
    },
    {
      "id": "sig-applephenon",
      "inciName": "ApplePhenon® apple fruit extract",
      "commonName": "ApplePhenon apple fruit extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is a patented, highly concentrated apple extract obtained from specially selected unripe green apples. Due to the early harvest time, this extract contains a high proportion of polyphenols, including proanthocyanidins and proanthocyanidin B2. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "applephenon® apple fruit extract",
        "applephenon apple fruit extract",
        "applephenon"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-antiox/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-apresflex",
      "inciName": "AprèsFlex® frankincense extract",
      "commonName": "AprèsFlex frankincense extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "also supports the well-being of our joints. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "aprèsflex® frankincense extract",
        "aprèsflex frankincense extract",
        "apresflex"
      ],
      "productIds": [
        "caps-move"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-move/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.apresflex.com/",
      "manufacturerLabel": "AprèsFlex®"
    },
    {
      "id": "sig-astafit",
      "inciName": "ASTAFIT® blood rain algae extract",
      "commonName": "ASTAFIT blood rain algae extract",
      "altNames": [
        "ASTAFIT® Haematococcus pluvialis alga"
      ],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains the antioxidant carotenoid astaxanthin. Carotenoids have antioxidant properties and are known for their role in preserving eye health. Vitamin D3 from algae extract contributes to normal immune system function. The sun vitamin plays a key role in countless processes in the human body. Vitamin K2 contributes to the preservation of healthy bones. Vitamin E (tocopherols and tocotrienols) helps protect your cells from oxidative stress. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "astafit® blood rain algae extract",
        "astafit blood rain algae extract",
        "astafit",
        "astafit® haematococcus pluvialis alga"
      ],
      "productIds": [
        "beyond-omega",
        "caps-protect"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/beyond-omega/?lang=en",
        "https://www.ringana.com/produkt/caps-protect/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.bdi-biolifescience.com/de/",
      "manufacturerLabel": "BDI BioLife Science (ASTAFIT®)"
    },
    {
      "id": "sig-cacti-nea",
      "inciName": "Cacti-Nea™ prickly pear fruit juice powder",
      "commonName": "Cacti-Nea prickly pear fruit juice powder",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains antioxidant betalains. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "cacti-nea™ prickly pear fruit juice powder",
        "cacti-nea prickly pear fruit juice powder",
        "cacti nea",
        "cacti-nea"
      ],
      "productIds": [
        "ringanadea"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanadea/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-cultavit",
      "inciName": "CULTAVIT®",
      "commonName": "CULTAVIT",
      "altNames": [
        "CULTAVIT™ buckwheat germ powder",
        "Cultavit® buckwheat germ powder"
      ],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains a spectrum of B vitamins as well as zinc, copper and selenium in their natural form. Zinc supports carbohydrate and fatty acid metabolism. Copper contributes to normal energy metabolism. Riboflavin, niacin and biotin play a role in maintaining mucous membranes. Vitamin B6 contributes to protein metabolism. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "cultavit®",
        "cultavit",
        "cultavit™ buckwheat germ powder",
        "cultavit® buckwheat germ powder"
      ],
      "productIds": [
        "caps-moodoo",
        "fresh-pack-antiox",
        "fresh-pack-balancing",
        "fresh-pack-cleansing",
        "sport-protein"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-moodoo/?lang=en",
        "https://www.ringana.com/produkt/pack-antiox/?lang=en",
        "https://www.ringana.com/produkt/pack-balancing/?lang=en",
        "https://www.ringana.com/produkt/pack-cleansing/?lang=en",
        "https://www.ringana.com/produkt/sport-protein/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-curcurouge",
      "inciName": "CurcuRouge®",
      "commonName": "CurcuRouge",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "curcuma root extract is associated with positive effects on joint and bone health. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "curcurouge®",
        "curcurouge"
      ],
      "productIds": [
        "caps-move"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-move/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-cyanthox",
      "inciName": "CyanthOx™ sea buckthorn fruit extract",
      "commonName": "CyanthOx sea buckthorn fruit extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains proanthocyanidins (PAC). These flavonoids are part of the antioxidant group. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "cyanthox™ sea buckthorn fruit extract",
        "cyanthox sea buckthorn fruit extract",
        "cyanthox"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-antiox/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-enotprost",
      "inciName": "ENOTprost® willowherb extract",
      "commonName": "ENOTprost willowherb extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "with a standardized content* of oenothein B. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "enotprost® willowherb extract",
        "enotprost willowherb extract",
        "enotprost"
      ],
      "productIds": [
        "caps-mascu"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-mascu/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-exgrape",
      "inciName": "exGrape® grape seed and grape skin extract",
      "commonName": "exGrape grape seed and grape skin extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains the secondary plant compounds oligomeric proanthocyanidins (OPC) and resveratrol. These polyphenols belong to the group of antioxidants. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "exgrape® grape seed and grape skin extract",
        "exgrape grape seed and grape skin extract",
        "exgrape"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-antiox/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-extramel",
      "inciName": "EXTRAMEL® encapsulated melon juice concentrate",
      "commonName": "EXTRAMEL encapsulated melon juice concentrate",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is gently obtained from organic Cantaloupe melons and standardized to superoxide dismutase (SOD). This means it contains a particularly high natural level of this antioxidant enzyme. A patented encapsulation technology protects the melon juice concentrate from degradation by gastric acid in order to preserve its bioactivity. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "extramel® encapsulated melon juice concentrate",
        "extramel encapsulated melon juice concentrate",
        "extramel"
      ],
      "productIds": [
        "fresh-pack-antiox"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-antiox/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.extramel.com/",
      "manufacturerLabel": "EXTRAMEL®"
    },
    {
      "id": "sig-quatrefolic",
      "inciName": "Folate from Quatrefolic® 5MHTF-Glucosmain",
      "commonName": "Folate from Quatrefolic 5MHTF-Glucosmain",
      "altNames": [
        "Folic acid from Quatrefolic® 5MTHF glucosamine"
      ],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is the biologically active form of naturally occurring folate, which contributes to normal homocysteine metabolism. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "folate from quatrefolic® 5mhtf-glucosmain",
        "folate from quatrefolic 5mhtf-glucosmain",
        "quatrefolic",
        "folic acid from quatrefolic® 5mthf glucosamine"
      ],
      "productIds": [
        "caps-fem",
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-fem/?lang=en",
        "https://www.ringana.com/produkt/pack-balancing/?lang=en",
        "https://www.ringana.com/produkt/pack-cleansing/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-greeniuronic",
      "inciName": "GREENIURONIC™ snow fungus extract",
      "commonName": "GREENIURONIC snow fungus extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is a patented vegan hyaluronic acid. Hyaluronic acid is an important component of skin. It promotes a youthful look, and attracts water and stores it, ensuring plump skin. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "greeniuronic™ snow fungus extract",
        "greeniuronic snow fungus extract",
        "greeniuronic"
      ],
      "productIds": [
        "ringanabty"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanabty/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.greeniuronic.com/",
      "manufacturerLabel": "GREENIURONIC™"
    },
    {
      "id": "sig-inavea",
      "inciName": "Inavea Original™ acacia fibre",
      "commonName": "Inavea Original acacia fibre",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains soluble fibres as well as the minerals magnesium and calcium. Magnesium contributes to energy metabolism. Calcium supports the function of digestive enzymes. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "inavea original™ acacia fibre",
        "inavea original acacia fibre",
        "inavea"
      ],
      "productIds": [
        "fresh-pack-balancing",
        "fresh-pack-cleansing"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-balancing/?lang=en",
        "https://www.ringana.com/produkt/pack-cleansing/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.nexira.com/ingredient/inavea/",
      "manufacturerLabel": "Nexira inavea™"
    },
    {
      "id": "sig-kaneka",
      "inciName": "KANEKA UBIQUINOL™",
      "commonName": "KANEKA UBIQUINOL",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "ensures a better supply of energy to the cells while also protecting against oxidative stress. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "kaneka ubiquinol™",
        "kaneka ubiquinol",
        "kaneka"
      ],
      "productIds": [
        "beyond-omega"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/beyond-omega/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.kaneka-ubiquinol.com/",
      "manufacturerLabel": "Kaneka Ubiquinol™"
    },
    {
      "id": "sig-keranat",
      "inciName": "Keranat® millet seed oil and wheat seed extract",
      "commonName": "Keranat millet seed oil and wheat seed extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "has been researched in studies with regard to its positive impact on hair growth and hair loss. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "keranat® millet seed oil and wheat seed extract",
        "keranat millet seed oil and wheat seed extract",
        "keranat"
      ],
      "productIds": [
        "ringanabty"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanabty/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.keranat.com/",
      "manufacturerLabel": "Keranat®"
    },
    {
      "id": "sig-ksm-66",
      "inciName": "KSM-66 Ashwagandha® root extract",
      "commonName": "KSM-66 Ashwagandha root extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains a high level of withanolides. In Ayurveda, ashwagandha is valued as a plant-based support during periods of stress and inner restlessness. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "ksm-66 ashwagandha® root extract",
        "ksm-66 ashwagandha root extract",
        "ksm 66",
        "ksm-66"
      ],
      "productIds": [
        "caps-moodoo",
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-moodoo/?lang=en",
      ],
      "manufacturerSourceUrl": "https://ksm66ashwagandhaa.com/",
      "manufacturerLabel": "KSM-66® Ashwagandha"
    },
    {
      "id": "sig-liboost",
      "inciName": "Liboost® Damiana leaf extract",
      "commonName": "Liboost Damiana leaf extract",
      "altNames": [
        "Liboost® damiana leaf extract"
      ],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains a precisely defined content of flavonoids. The shrub Damiana was already used by the Mayas and Aztecs in matters related to vitality and sexual energy. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "liboost® damiana leaf extract",
        "liboost damiana leaf extract",
        "liboost"
      ],
      "productIds": [
        "caps-fem",
        "caps-mascu"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-fem/?lang=en",
        "https://www.ringana.com/produkt/caps-mascu/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.liboost.com/",
      "manufacturerLabel": "Liboost®"
    },
    {
      "id": "sig-lutemax",
      "inciName": "Lutemax®2020 tagetes flower extract",
      "commonName": "Lutemax2020 tagetes flower extract",
      "altNames": [
        "Lutemax® 2020 marigold flower extract"
      ],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains lutein and zeaxanthin. Both carotenoids are highly concentrated in the macula. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "lutemax®2020 tagetes flower extract",
        "lutemax2020 tagetes flower extract",
        "lutemax",
        "lutemax® 2020 marigold flower extract"
      ],
      "productIds": [
        "beyond-omega",
        "caps-protect"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/beyond-omega/?lang=en",
        "https://www.ringana.com/produkt/caps-protect/?lang=en"
      ],
      "manufacturerSourceUrl": "https://lutemax.com/",
      "manufacturerLabel": "Lutemax®"
    },
    {
      "id": "sig-m-gard",
      "inciName": "M-Gard® 1,3/1,6 beta-glucans from yeast",
      "commonName": "M-Gard 1,3/1,6 beta-glucans from yeast",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "A highly concentrated, natural beta-1,3/1,6-glucan derived from baker’s yeast cell walls. Beta-glucans are bioactive polysaccharides and among the oldest natural substances known to humankind. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "m-gard® 1,3/1,6 beta-glucans from yeast",
        "m-gard 1,3/1,6 beta-glucans from yeast",
        "m gard",
        "m-gard"
      ],
      "productIds": [
        "caps-immu"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-immu/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.mgard.com/",
      "manufacturerLabel": "M-Gard®"
    },
    {
      "id": "sig-maquibright",
      "inciName": "MaquiBright® maqui berry extract",
      "commonName": "MaquiBright maqui berry extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "with a standardized content of anthocyanins such as delphinidin, known for its antioxidant properties. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "maquibright® maqui berry extract",
        "maquibright maqui berry extract",
        "maquibright"
      ],
      "productIds": [
        "caps-protect"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-protect/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-metabolaid",
      "inciName": "metabolaid® complex from lemon verbena leaf and hibiscus flower extract",
      "commonName": "metabolaid complex from lemon verbena leaf and hibiscus flower extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains verbascosides and anthocyanins and stands out due to its broad base of studies. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "metabolaid® complex from lemon verbena leaf and hibiscus flower extract",
        "metabolaid complex from lemon verbena leaf and hibiscus flower extract",
        "metabolaid"
      ],
      "productIds": [
        "ringanadea"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanadea/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.metabolaid.com/",
      "manufacturerLabel": "metabolaid®"
    },
    {
      "id": "sig-morosil",
      "inciName": "Morosil™ blood orange fruit extract",
      "commonName": "Morosil blood orange fruit extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains flavanones, anthocyanins and hydroxycinnamic acids. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "morosil™ blood orange fruit extract",
        "morosil blood orange fruit extract",
        "morosil"
      ],
      "productIds": [
        "ringanadea"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanadea/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.bionap.com/products/morosil/",
      "manufacturerLabel": "Bionap Morosil™"
    },
    {
      "id": "sig-omegavie",
      "inciName": "OMEGAVIE® microalga oil",
      "commonName": "OMEGAVIE microalga oil",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is rich in Omega-3 fatty acids and is one of the essential nutrients for the body. High-dose DHA (Omega-3 fatty acid) from microalga contributes to normal heart function and helps to preserve normal brain function and vision.* (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "omegavie® microalga oil",
        "omegavie microalga oil",
        "omegavie"
      ],
      "productIds": [
        "beyond-omega"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/beyond-omega/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.polaris.fr/en/",
      "manufacturerLabel": "Polaris (OMEGAVIE®)"
    },
    {
      "id": "sig-omegia",
      "inciName": "Omegia™ sea buckthorn seed and berry oil",
      "commonName": "Omegia sea buckthorn seed and berry oil",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is rich in unsaturated fatty acids such as Omega 3, 6, 7, 9. Omega 7 is the focus of scientific studies on the skin barrier. Omega fatty acids support important body functions. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "omegia™ sea buckthorn seed and berry oil",
        "omegia sea buckthorn seed and berry oil",
        "omegia"
      ],
      "productIds": [
        "ringanabty"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanabty/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-peak-atp",
      "inciName": "Peak ATP™",
      "commonName": "Peak ATP",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is a patented raw material. It demonstrates significant effects on mental performance, including reaction time and concentration. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "peak atp™",
        "peak atp",
        "peak-atp"
      ],
      "productIds": [
        "sport-push"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/sport-push/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.peakatp.com/",
      "manufacturerLabel": "Peak ATP™"
    },
    {
      "id": "sig-pycnogenol",
      "inciName": "Pycnogenol® pine bark extract",
      "commonName": "Pycnogenol pine bark extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is extracted from ground pine bark and contains a precisely defined content of procyanidins (OPC). (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "pycnogenol® pine bark extract",
        "pycnogenol pine bark extract",
        "pycnogenol"
      ],
      "productIds": [
        "caps-fem"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-fem/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.pycnogenol.com/",
      "manufacturerLabel": "Pycnogenol®"
    },
    {
      "id": "sig-red-orange-complex",
      "inciName": "Red Orange Complex™ blood orange extract",
      "commonName": "Red Orange Complex blood orange extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "contains a high proportion of flavanones, anthocyanins and hydroxycinnamic acids, which may support the body’s own antioxidant defense system. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "red orange complex™ blood orange extract",
        "red orange complex blood orange extract",
        "red orange complex",
        "red-orange-complex"
      ],
      "productIds": [
        "caps-protect"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-protect/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-robuvit",
      "inciName": "Robuvit® oak extract",
      "commonName": "Robuvit oak extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "a clinically studied ingredient with 40% polyphenols. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "robuvit® oak extract",
        "robuvit oak extract",
        "robuvit"
      ],
      "productIds": [
        "ringanachi"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanachi/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.robuvit.com/",
      "manufacturerLabel": "Robuvit®"
    },
    {
      "id": "sig-safr-inside",
      "inciName": "Safr‘Inside™ saffron extract",
      "commonName": "Safr‘Inside saffron extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is standardized and provides a high concentration of safranals, crocins and Saframotivines®. For centuries, saffron has held an important place in traditional herbal practices across many cultures and is used to support mental and physical well-being. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "safr‘inside™ saffron extract",
        "safr‘inside saffron extract",
        "safr inside",
        "safr-inside"
      ],
      "productIds": [
        "caps-moodoo"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-moodoo/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.safrinside.com/",
      "manufacturerLabel": "Safr’Inside™"
    },
    {
      "id": "sig-serenzo",
      "inciName": "Serenzo™ orange peel extract",
      "commonName": "Serenzo orange peel extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is standardized to the secondary plant compound limonene, which is used as a fragrance and aromatic substance in aromatherapy to promote a positive mood. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "serenzo™ orange peel extract",
        "serenzo orange peel extract",
        "serenzo"
      ],
      "productIds": [
        "caps-moodoo"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-moodoo/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-setria",
      "inciName": "Setria™ and SOD from the microalga Tetraselmis chuii",
      "commonName": "Setria and SOD from the microalga Tetraselmis chuii",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "can influence cell function and the formation of new mitochondria. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "setria™ and sod from the microalga tetraselmis chuii",
        "setria and sod from the microalga tetraselmis chuii",
        "setria"
      ],
      "productIds": [
        "beyond-spermidine"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/beyond-spermidine/?lang=en"
      ],
      "manufacturerSourceUrl": "https://setriaglutathione.com/en",
      "manufacturerLabel": "Setria® Glutathione"
    },
    {
      "id": "sig-sunfiber",
      "inciName": "SunFiber® enzymatically fermented guar bean fibre",
      "commonName": "SunFiber enzymatically fermented guar bean fibre",
      "altNames": [
        "Sunfiber® enzymatically fermented guar bean fibre"
      ],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "combined with FOS ensures a high fibre content. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "sunfiber® enzymatically fermented guar bean fibre",
        "sunfiber enzymatically fermented guar bean fibre",
        "sunfiber"
      ],
      "productIds": [
        "fresh-pack-cleansing",
        "ringanadea"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-cleansing/?lang=en",
        "https://www.ringana.com/produkt/ringanadea/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-sunphenon",
      "inciName": "Sunphenon® green tea extract",
      "commonName": "Sunphenon green tea extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "has a high content of polyphenols such as catechins and EGCG. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "sunphenon® green tea extract",
        "sunphenon green tea extract",
        "sunphenon"
      ],
      "productIds": [
        "caps-protect"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/caps-protect/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-vecollal",
      "inciName": "VeCollal®",
      "commonName": "VeCollal",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is a combination of plant-derived ingredients that specifically mimics Type 1 collagen. With bioactive amino acids and Vitamin C. Vitamin C contributes to normal collagen production for normal skin function. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "vecollal®",
        "vecollal"
      ],
      "productIds": [
        "ringanabty"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/ringanabty/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-vitacholine",
      "inciName": "VitaCholine™ choline bitartrate",
      "commonName": "VitaCholine choline bitartrate",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "is a salt form of choline that supports fat metabolism and liver function. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "vitacholine™ choline bitartrate",
        "vitacholine choline bitartrate",
        "vitacholine"
      ],
      "productIds": [
        "fresh-pack-cleansing"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/pack-cleansing/?lang=en"
      ],
      "manufacturerSourceUrl": "",
      "manufacturerLabel": ""
    },
    {
      "id": "sig-watts-up",
      "inciName": "WATTS’UP® orange extract",
      "commonName": "WATTS’UP orange extract",
      "altNames": [],
      "roles": [
        "signature-nutrition",
        "supplement"
      ],
      "blurb": "which studies show helps to boost performance and delivers extra power in a natural way. (From Ringana’s published Hero Ingredients on the product page — always re-check the live page and pack.)",
      "match": [
        "watts’up® orange extract",
        "watts’up orange extract",
        "watts up",
        "watts-up"
      ],
      "productIds": [
        "sport-protein"
      ],
      "sourceUrls": [
        "https://www.ringana.com/produkt/sport-protein/?lang=en"
      ],
      "manufacturerSourceUrl": "https://www.wattsup.eu/",
      "manufacturerLabel": "WATTS’UP®"
    }
  ]
};
