/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — SHAREABLE CONTENT + KNOW Ringana REFERENCE
   Soft invites → calendar / Post Studio
   Curiosity posts + product sparks → calendar / Post Studio
   Product & business story posts → calendar / Post Studio
   Pillars · company facts · FAQs → Learn
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

window.FS.CONTENT = {

  /* ── Soft invites (low-pressure asks) ── */
  curiosity: [
    {
      id: "hinting",
      title: "They've noticed the hints",
      body: "I wasn't planning on saying anything yet… but enough people have noticed I've been hinting at something. So here's the deal — I've been researching a wellness company that has genuinely impressed me. Not because someone told me to be excited. Because the deeper I looked, the more questions they answered.\n\nIf you'd like to follow along as I share what I've been learning over the next couple of months, drop a 🌱 below. I'd love to bring you along."
    },
    {
      id: "quieter",
      title: "A little quieter than usual",
      body: "Some of you have noticed I've been a little quieter than usual… Truthfully, I've been spending my time researching something that's had me genuinely excited to learn again.\n\nIf you know me, you know I don't make recommendations quickly. I ask a lot of questions, read a lot of labels, and usually take my sweet time before I ever talk publicly about something. That's exactly what I've been doing these last several weeks.\n\nI'm still keeping a few details under wraps for now, but if you'd enjoy following along as I share what I've been learning before everything officially launches this fall, I'd love to include you. Just comment \"curious\" below, and I'll reach out personally. 🌿"
    },
    {
      id: "quietly_following",
      title: "Quietly following → U.S. this fall",
      body: "There's a company I've been quietly following that officially opens its doors in the U.S. this fall… I've had the chance to learn a lot behind the scenes, and honestly — it's been refreshing.\n\nIf you'd like to follow along before everything officially launches, let me know and I'll make sure you don't miss the updates."
    },
    {
      id: "before_household",
      title: "Before it's a household name",
      body: "I have a feeling the next few months are going to be really interesting. Not because of hype — because I genuinely think we're about to watch something unique unfold in the U.S.\n\nIf you're someone who enjoys discovering companies before they're household names, I'd love to share why I've been so intrigued. Just leave a 🌱 if you'd like the details."
    },
    {
      id: "rabbit_hole",
      title: "Curiosity list (no buy / no join)",
      body: "I'm looking for a handful of naturally curious people… Not to buy anything. Not to join anything. Just people who enjoy learning about companies doing things differently.\n\nOver the next couple of months I'll be sharing what I've discovered — from fresh production and formulation philosophy to sustainability and some fascinating business decisions.\n\nIf that sounds like your kind of rabbit hole, I'll add you to my little curiosity list."
    },
    {
      id: "painfully_slow",
      title: "I move painfully slow",
      body: "If you've followed me for any length of time, you know I'm not someone who jumps from one \"favorite\" thing to the next. If anything… I move painfully slow.\n\nSo when I tell you I've spent weeks genuinely excited about what I'm learning, that's probably saying something. I'm putting together a small list of people who want the inside scoop as everything unfolds over the next couple of months.\n\nIf you'd like to be on it, just drop any emoji below. No pressure — just info."
    },
    {
      id: "almost_never",
      title: "I almost never get excited about companies",
      body: "I don't get excited about companies very often. Actually… almost never. But every once in a while, something comes along that makes me stop and say… \"Wait — why isn't everyone talking about this?\"\n\nI've spent the last several weeks asking questions, reading, comparing, and honestly just enjoying the process of learning. If you're naturally curious like I am and want a little behind-the-scenes look at what I've been diving into, leave a 👀 below and I'll send it your way."
    },
    {
      id: "status_quo",
      title: "Challenging the status quo",
      body: "Over the last month, I've been learning about a company that has genuinely challenged the way I think about wellness products. Not because it's trendy. Not because it's new. Because they do a lot of things… very differently.\n\nI'm not quite ready to share all the details publicly yet, but if you're someone who geeks out over ingredient quality, sustainability, and companies willing to challenge the status quo, I think you're going to find it as fascinating as I have. Drop a 🌿 below if you want me to send you what I've been learning."
    }
  ],

  /* ── Curiosity posts — short unfinished stories / scroll-stoppers ── */
  /* ── Curiosity photos (Grab a photo CTA on Content) ──
     full/ + thumbs/ under assets/curiosity/. Lazy-loaded; not precached. */
  curiosityImageCategories: [
    { id: "packaging", label: "Packaging", hint: "Cotton wraps, glass, tags" },
    { id: "products", label: "Product shots", hint: "Heroes, textures, close-ups" },
    { id: "bathroom", label: "Bathroom", hint: "Tubs, sinks, morning counters" },
    { id: "lineups", label: "Lineups", hint: "Hauls and full spreads" },
    { id: "drinks", label: "Drinks", hint: "dea, chi, bty, pours" },
    { id: "supplements", label: "Caps & packs", hint: "Tins, capsules, fresh packs" },
    { id: "samples", label: "Samples & travel", hint: "Pouches, minis, on the go" },
    { id: "lifestyle", label: "Lifestyle", hint: "Bedrooms, outdoors, still life" },
    { id: "results", label: "Results", hint: "Before & after — keep it honest" }
  ],
  curiosityImages: [
    {
      id: "cotton-towels",
      title: "Organic cotton towels",
      alt: "Skincare bottles wrapped in organic cotton towels on marble",
      category: "packaging",
      tags: ["cotton", "towels", "glass", "wrap", "marble", "skincare"],
      pairsWith: "Freshness · packaging · glass return",
      body: "No caption dump needed — let the lineup do the stopping. Pair with a short open loop about freshness or packaging."
    },
    {
      id: "ingredient-bottle",
      title: "What's in the bottle",
      alt: "White pump bottle listing peptides, hyaluronic acid, and ceramides",
      category: "packaging",
      tags: ["ingredients", "label", "peptides", "hyaluronic", "ceramides", "bottle"],
      pairsWith: "Ingredients · clean labels · skin questions",
      body: "Show the label, ask the question. Pair with a curiosity line about what's actually in the bottle — not a hard sell."
    },
    {
      id: "product-haul-towel",
      title: "The full lineup",
      alt: "Ringana products and branded towel arranged on a wooden table",
      category: "lineups",
      tags: ["haul", "towel", "table", "products", "spread"],
      pairsWith: "Freshness · in-house · founding season",
      body: "A quiet haul shot — let people wonder what you've been researching."
    },
    {
      id: "bathroom-counter",
      title: "Morning counter",
      alt: "Travel-sized fresh products and tooth oil on a bathroom counter",
      category: "bathroom",
      tags: ["counter", "routine", "tooth oil", "travel", "vanity", "morning"],
      pairsWith: "Everyday use · tooth oil · routines",
      body: "Real-life counter energy. Pair with a noticing post — not a product dump."
    },
    {
      id: "cotton-wraps-close",
      title: "Wrapped on purpose",
      alt: "Close-up of products wrapped in organic cotton fabric sleeves",
      category: "packaging",
      tags: ["cotton", "wrap", "sleeves", "sustainability", "glass", "close-up"],
      pairsWith: "Packaging · sustainability · glass",
      body: "The wrap is the hook. Ask what packaging says about a brand."
    },
    {
      id: "cotton-wraps-haul",
      title: "Cotton-wrapped haul",
      alt: "Dense cluster of cotton-wrapped Ringana bottles on wood",
      category: "packaging",
      tags: ["cotton", "wrap", "haul", "bottles", "wood", "texture"],
      pairsWith: "Packaging · freshness · no plastic dump",
      body: "Texture does the stopping. Keep the caption unfinished."
    },
    {
      id: "cotton-wraps-glow",
      title: "Glowing glass",
      alt: "Cotton-wrapped bottles on backlit marble",
      category: "packaging",
      tags: ["cotton", "wrap", "glass", "marble", "light", "eye serum"],
      pairsWith: "Glass · packaging · eye serum",
      body: "Soft light, soft ask. Pair with a freshness or glass open loop."
    },
    {
      id: "sunny-table-haul",
      title: "Sun on the table",
      alt: "White bottles and tubes scattered in sunlight on a wooden table",
      category: "lineups",
      tags: ["haul", "sunlight", "table", "baby", "body", "tubes"],
      pairsWith: "Everyday products · baby · body care",
      body: "Lived-in light. Good for a midweek noticing post."
    },
    {
      id: "fresh-pour",
      title: "Pouring fresh",
      alt: "Dark red fresh concentrate being poured into iced strawberry water",
      category: "drinks",
      tags: ["pour", "fresh", "supplement", "drink", "ice", "strawberry"],
      pairsWith: "Supplements · fresh · taste ritual",
      body: "Motion stops the scroll. Pair with a curious line about what you're drinking."
    },
    {
      id: "fresh-drink",
      title: "After the pour",
      alt: "Iced red drink in a ribbed glass beside an empty amber bottle",
      category: "drinks",
      tags: ["drink", "glass", "ice", "supplement", "ritual", "fresh"],
      pairsWith: "Supplements · everyday ritual",
      body: "The finished glass. Short caption. No hard sell."
    },
    {
      id: "fresh-water",
      title: "Before the mix",
      alt: "Glass of iced water beside a small dark fresh bottle",
      category: "drinks",
      tags: ["water", "ice", "glass", "supplement", "setup", "fresh"],
      pairsWith: "Supplements · simple ritual",
      body: "Quiet setup shot — invite the question, don't answer it yet."
    },
    {
      id: "fresh-sample-pouches",
      title: "Fresh sample pouches",
      alt: "Ringana sample pouches — FRESH cleanser, cream MEDIUM, tonic pure, and hydro serum",
      category: "samples",
      productIds: ["fresh-cleanser", "fresh-cream-medium", "fresh-toner-pure", "fresh-hydro-serum"],
      tags: ["samples", "pouches", "cleanser", "cream", "tonic", "hydro serum"],
      pairsWith: "Freshness · try-before · everyday staples",
      body: "Samples stop the scroll. Pair with a soft invite to try — not a full routine dump."
    },
    {
      id: "fresh-bathroom-lineup",
      title: "Bathroom lineup",
      alt: "FRESH bottles on a bathroom counter including hydro serum and anti wrinkle serum",
      category: "bathroom",
      productIds: ["fresh-hydro-serum", "fresh-anti-wrinkle-serum"],
      tags: ["bathroom", "vanity", "serums", "hydro", "anti wrinkle", "counter"],
      pairsWith: "Everyday routine · serums · real-life counters",
      body: "Lived-in vanity energy. Good for a noticing post about what stays on the counter."
    },
    {
      id: "hydro-serum-bowl",
      title: "Hydro serum pouch",
      alt: "FRESH hydro serum sample pouch in a small ceramic bowl",
      category: "samples",
      productIds: ["fresh-hydro-serum"],
      tags: ["hydro serum", "pouch", "sample", "bowl", "ceramic"],
      pairsWith: "Samples · hydro serum · soft product shot",
      body: "One product, quiet frame. Pair with a short curiosity line — not a full routine."
    },
    {
      id: "travel-bag-spill",
      title: "Travel bag spill",
      alt: "Clear travel bag spilling white sample pouches and mini bottles onto a white surface",
      category: "samples",
      tags: ["travel", "bag", "samples", "pouches", "minis", "spill"],
      pairsWith: "Travel · samples · on the go",
      body: "The spill does the stopping. Ask what they're packing — don't list every product."
    },
    {
      id: "ringana-towel-tag",
      title: "Towel tag detail",
      alt: "Ringana logo on an organic cotton towel tag beside a white bottle",
      category: "lifestyle",
      tags: ["towel", "tag", "logo", "cotton", "detail", "brand"],
      pairsWith: "Packaging · cotton wrap · brand detail",
      body: "Detail shot energy. Let the tag and glass do the work."
    },
    {
      id: "so-free-notebook",
      title: "So free notebook",
      alt: "Phone stacked on notebooks including a Ringana So free notebook on dark marble",
      category: "lifestyle",
      tags: ["notebook", "desk", "phone", "so free", "marble", "lifestyle"],
      pairsWith: "Lifestyle · founding season · soft brand cue",
      body: "Aspirational desk moment. Keep the caption unfinished — invite the question."
    },
    {
      id: "ls-0001",
      title: "dea set with decanter",
      alt: "Blue dea box, small dea bottle, and a glass decanter of dark red liquid",
      category: "drinks",
      productIds: ["ringanadea"],
      tags: ["dea", "ringanadea", "decanter", "box", "shot", "red"],
      pairsWith: "Supplements · ritual · freshness",
      body: "The set does the stopping. Pair with a curious line about what you're drinking — not a full ingredient lecture."
    },
    {
      id: "ls-0005",
      title: "Bedroom corner",
      alt: "White bed and floating wooden nightstand with a small bottle in a quiet bedroom",
      category: "lifestyle",
      tags: ["bedroom", "nightstand", "bed", "morning", "lifestyle"],
      pairsWith: "Lifestyle · quiet routine",
      body: "A room, not a product dump. Pair with a noticing post."
    },
    {
      id: "ls-9916",
      title: "Two FRESH pumps",
      alt: "Two white FRESH pump bottles on a white ledge against a beige wall",
      category: "products",
      tags: ["fresh", "pump", "bottles", "skincare", "minimal"],
      pairsWith: "Everyday routine · freshness",
      body: "Simple lineup. Let the bottles ask the question."
    },
    {
      id: "ls-9917",
      title: "Fresh scrub and pomegranate",
      alt: "White FRESH scrub bottle beside a halved ripe pomegranate",
      category: "products",
      productIds: ["fresh-scrub-face-body"],
      tags: ["fresh scrub", "pomegranate", "face", "body", "ingredients", "fruit"],
      pairsWith: "Ingredients · texture · freshness",
      body: "The fruit does the stopping. Pair with a curiosity line about what's actually in the scrub."
    },
    {
      id: "ls-9920",
      title: "Sunlight on FRESH",
      alt: "Small FRESH bottle in hard sunlight with sharp geometric shadows",
      category: "products",
      tags: ["fresh", "sunlight", "shadow", "glass", "minimal"],
      pairsWith: "Freshness · light · everyday",
      body: "Light and shadow. Short caption. No hard sell."
    },
    {
      id: "ls-9921",
      title: "FRESH on the sink ledge",
      alt: "White FRESH bottle on a bathroom ledge beside a small soap dish",
      category: "bathroom",
      tags: ["fresh", "bathroom", "sink", "ledge", "soap"],
      pairsWith: "Everyday routine · bathroom",
      body: "Real bathroom energy. Pair with a noticing post about what stays by the sink."
    },
    {
      id: "ls-9922",
      title: "Skin perfection and cream",
      alt: "FRESH skin perfection bottle beside a ceramic dish of white cream",
      category: "products",
      productIds: ["fresh-skin-perfection"],
      tags: ["skin perfection", "cream", "texture", "swatch", "fresh"],
      pairsWith: "Texture · results · honest note",
      body: "Show the texture, leave the claim. Pair with what you actually noticed."
    },
    {
      id: "ls-9923",
      title: "Cream in the dish",
      alt: "FRESH pump bottle and a small dish of cream on a beige surface",
      category: "products",
      tags: ["fresh", "cream", "texture", "dish", "swatch"],
      pairsWith: "Texture · everyday cream",
      body: "Quiet texture shot. Keep the caption unfinished."
    },
    {
      id: "ls-9924",
      title: "Three serums, three smears",
      alt: "Three frosted FRESH serum bottles with matching product smears above them",
      category: "products",
      productIds: ["fresh-hydro-serum", "fresh-anti-wrinkle-serum"],
      tags: ["serum", "hydro", "anti wrinkle", "smear", "texture", "fresh"],
      pairsWith: "Serums · texture · routine",
      body: "The smears stop the scroll. Don't list every product — pick one question."
    },
    {
      id: "ls-9925",
      title: "Serum smears overhead",
      alt: "Overhead of three FRESH serum bottles with white, peach, and orange smears",
      category: "products",
      productIds: ["fresh-hydro-serum", "fresh-anti-wrinkle-serum"],
      tags: ["serum", "smear", "texture", "overhead", "fresh"],
      pairsWith: "Serums · texture · curiosity",
      body: "Color does the work. Pair with a short open loop."
    },
    {
      id: "ls-9926",
      title: "ADDS glow and effect",
      alt: "Three small ADDS bottles including glow and effect on a pale surface",
      category: "products",
      productIds: ["adds-glow", "adds-effect"],
      tags: ["adds", "glow", "effect", "booster", "concentrate"],
      pairsWith: "Boosters · mix-in · results",
      body: "Tiny bottles, big curiosity. Ask what a booster is before you explain it."
    },
    {
      id: "ls-9927",
      title: "ADDS repair stacked",
      alt: "Three ADDS repair bottles stacked with bright green droplets beside them",
      category: "products",
      productIds: ["adds-repair"],
      tags: ["adds", "repair", "stacked", "green", "booster"],
      pairsWith: "Boosters · repair · texture",
      body: "The stack and the droplets. Keep it unfinished."
    },
    {
      id: "ls-9928",
      title: "Before and after skin",
      alt: "Split photo of skin labeled BEFORE and AFTER over a four-week test note",
      category: "results",
      productIds: ["adds-glow"],
      tags: ["before", "after", "skin", "results", "study", "adds glow"],
      pairsWith: "Results · honest caveat · don't overclaim",
      body: "If you share results, keep the study note visible and add your own caveat. This is not a miracle post."
    },
    {
      id: "ls-9929",
      title: "Wrinkle volume after 10 minutes",
      alt: "Before and after skin circles noting wrinkle volume and depth after 10 minutes",
      category: "results",
      productIds: ["adds-effect"],
      tags: ["before", "after", "wrinkles", "adds effect", "study", "10 minutes"],
      pairsWith: "Results · peptides · honest caveat",
      body: "A study graphic, not a personal review. Pair with 'here's what they measured' — not a promise."
    },
    {
      id: "ls-9930",
      title: "ADDS effect bottle",
      alt: "Single FRESH ADDS effect bottle centered on a white textured surface",
      category: "products",
      productIds: ["adds-effect"],
      tags: ["adds effect", "booster", "fresh", "hero"],
      pairsWith: "Boosters · wrinkles · mix-in",
      body: "One bottle. One question. Don't dump the peptide list."
    },
    {
      id: "ls-9931",
      title: "Eye serum in hard light",
      alt: "Small eye serum bottle in harsh sunlight with a long shadow on beige",
      category: "products",
      productIds: ["fresh-eye-serum"],
      tags: ["eye serum", "sunlight", "shadow", "fresh", "eyes"],
      pairsWith: "Eyes · serum · light",
      body: "Shadow does the stopping. Soft ask, not a hard sell."
    },
    {
      id: "ls-9932",
      title: "Eye cream on its side",
      alt: "FRESH eye cream bottle lying on its side on a cream surface",
      category: "products",
      productIds: ["fresh-eye-cream"],
      tags: ["eye cream", "fresh", "lying", "cream"],
      pairsWith: "Eyes · cream · everyday",
      body: "Quiet hero. Pair with a noticing line about the eye area — no miracle talk."
    },
    {
      id: "ls-9933",
      title: "Hydro and anti-wrinkle, uncapped",
      alt: "FRESH hydro serum and anti wrinkle serum standing uncapped on grey stone",
      category: "products",
      productIds: ["fresh-hydro-serum", "fresh-anti-wrinkle-serum"],
      tags: ["hydro serum", "anti wrinkle", "serum", "uncapped", "stone"],
      pairsWith: "Serums · routine · pair",
      body: "Two serums, no speech. Ask which one people reach for first."
    },
    {
      id: "ls-9934",
      title: "Two serums in the bathroom",
      alt: "Hydro serum and anti wrinkle serum in a minimal bathroom against a textured wall",
      category: "bathroom",
      productIds: ["fresh-hydro-serum", "fresh-anti-wrinkle-serum"],
      tags: ["hydro serum", "anti wrinkle", "bathroom", "fresh", "vanity"],
      pairsWith: "Everyday routine · serums",
      body: "Bathroom context. Lived-in, not catalog."
    },
    {
      id: "ls-9935",
      title: "Hydro serum on stone",
      alt: "FRESH hydro serum standing on a textured stone coaster against a beige wall",
      category: "products",
      productIds: ["fresh-hydro-serum"],
      tags: ["hydro serum", "stone", "coaster", "fresh", "hero"],
      pairsWith: "Serum · hydration · freshness",
      body: "One product, quiet frame."
    },
    {
      id: "ls-9936",
      title: "Anti-wrinkle on stone",
      alt: "FRESH anti wrinkle serum standing beside its cap on a stone coaster",
      category: "products",
      productIds: ["fresh-anti-wrinkle-serum"],
      tags: ["anti wrinkle", "serum", "stone", "cap", "fresh"],
      pairsWith: "Serum · wrinkles · honest note",
      body: "Cap off. Short caption. Leave room for a caveat."
    },
    {
      id: "ls-9937",
      title: "FRESH on a stone coaster",
      alt: "Small white FRESH bottle on a textured stone coaster against a beige wall",
      category: "products",
      tags: ["fresh", "stone", "coaster", "minimal", "hero"],
      pairsWith: "Everyday · freshness · still life",
      body: "Simple still life. Let people ask what it is."
    },
    {
      id: "ls-9938",
      title: "Two lip balms",
      alt: "Pink tinted lip balm tube beside a white lip balm tube on beige",
      category: "products",
      productIds: ["fresh-lip-balm-classic", "fresh-tinted-balm-lip-cheek-rosewood"],
      tags: ["lip balm", "tinted", "lips", "tube", "fresh"],
      pairsWith: "Lips · tinted · everyday",
      body: "Two tubes. Ask tinted or classic — don't over-explain."
    },
    {
      id: "ls-9939",
      title: "Lip balm box on wood",
      alt: "White lip balm box on a round wooden tray beside a piece of natural wood",
      category: "lifestyle",
      productIds: ["fresh-lip-balm-classic"],
      tags: ["lip balm", "box", "wood", "tray", "still life"],
      pairsWith: "Lifestyle · lips · packaging",
      body: "Wood and box. Soft brand cue."
    },
    {
      id: "ls-9940",
      title: "Bottles on bathroom shelves",
      alt: "White FRESH bottles lined on light wooden floating shelves",
      category: "bathroom",
      tags: ["shelves", "bathroom", "fresh", "lineup", "wood"],
      pairsWith: "Bathroom · lineup · everyday",
      body: "Shelfie energy. Not a product dump — pick one noticing line."
    },
    {
      id: "ls-9941",
      title: "Row on the sink",
      alt: "Small green and white bottles lined on a white sink beside black faucets",
      category: "bathroom",
      tags: ["sink", "faucet", "bathroom", "row", "fresh"],
      pairsWith: "Bathroom · sink · routine",
      body: "Black fixtures, quiet products. Pair with a morning-counter post."
    },
    {
      id: "ls-9942",
      title: "Stone-surface cluster",
      alt: "Mix of white and clear skincare bottles clustered on grey stone",
      category: "lineups",
      tags: ["cluster", "stone", "bottles", "oils", "fresh", "haul"],
      pairsWith: "Lineup · freshness · still life",
      body: "A cluster, not a catalog. Let people wonder what the set is."
    },
    {
      id: "ls-9943",
      title: "Bottles and pink flowers",
      alt: "Overhead of several bottles beside small pink flowers on a speckled surface",
      category: "lifestyle",
      tags: ["flowers", "bottles", "overhead", "pink", "still life"],
      pairsWith: "Lifestyle · floral · soft product",
      body: "Flowers do the stopping. Keep the caption unfinished."
    },
    {
      id: "ls-9944",
      title: "Products on the tub rim",
      alt: "Modern white bathtub with small bottles along the rim and a black fixture",
      category: "bathroom",
      tags: ["bathtub", "rim", "bathroom", "fresh", "black fixture"],
      pairsWith: "Bathroom · bath ritual · body",
      body: "Tub-side still life. Pair with a body-care noticing post."
    },
    {
      id: "ls-9945",
      title: "Three stacked on the sink",
      alt: "Three white bottles stacked on the edge of a white sink",
      category: "bathroom",
      tags: ["stacked", "sink", "bathroom", "fresh", "bottles"],
      pairsWith: "Bathroom · stack · everyday",
      body: "The stack is the hook."
    },
    {
      id: "ls-9946",
      title: "Sink-ledge mix",
      alt: "Varied small skincare bottles grouped on a sink ledge",
      category: "bathroom",
      tags: ["sink", "mix", "bathroom", "bottles", "fresh"],
      pairsWith: "Bathroom · everyday mix",
      body: "Real ledge energy. Don't name every bottle."
    },
    {
      id: "ls-9947",
      title: "Tub, towel, laundry bag",
      alt: "White tub with a RINGANA striped towel and a canvas laundry bag",
      category: "bathroom",
      tags: ["bathtub", "towel", "ringana", "laundry", "bathroom"],
      pairsWith: "Bathroom · brand detail · ritual",
      body: "The towel and the bag. Lifestyle first, product second."
    },
    {
      id: "ls-9948",
      title: "Tub and laundry bag",
      alt: "White bathtub, black faucet, and a canvas laundry bag in a beige bathroom",
      category: "bathroom",
      tags: ["bathtub", "laundry", "bathroom", "minimal", "beige"],
      pairsWith: "Bathroom · quiet luxury · ritual",
      body: "A bathroom, not an ad. Pair with a noticing post."
    },
    {
      id: "ls-9949",
      title: "Tub corner with soap",
      alt: "Bathtub corner with two pump bottles and a bar of soap on a small towel",
      category: "bathroom",
      tags: ["soap", "bathtub", "pumps", "towel", "bathroom"],
      pairsWith: "Bathroom · soap · body",
      body: "Soap on the towel. Simple and lived-in."
    },
    {
      id: "ls-9950",
      title: "Body milk rich",
      alt: "Tall white pump bottle labeled body milk rich on a plain white background",
      category: "products",
      productIds: ["fresh-body-milk-rich"],
      tags: ["body milk", "rich", "body", "pump", "fresh"],
      pairsWith: "Body · moisture · everyday",
      body: "One bottle, clean frame. Ask rich vs light — don't pitch both."
    },
    {
      id: "ls-9951",
      title: "Amber bottle on the tub",
      alt: "Translucent bottle of amber liquid sitting on a white cloth on the tub edge",
      category: "bathroom",
      tags: ["amber", "oil", "bathtub", "cloth", "body"],
      pairsWith: "Body · oil · bath ritual",
      body: "The amber liquid is the hook."
    },
    {
      id: "ls-9952",
      title: "Wood-slat bathroom",
      alt: "Bathroom with a wooden slat wall, black fixtures, and two products by the tub",
      category: "bathroom",
      tags: ["wood", "slat", "bathroom", "fixtures", "tub"],
      pairsWith: "Bathroom · architecture · ritual",
      body: "The room does the stopping. Products are guests."
    },
    {
      id: "ls-9953",
      title: "Translucent pump on cloth",
      alt: "Translucent pump bottle on a folded white cloth on the tub edge",
      category: "bathroom",
      tags: ["pump", "cloth", "bathtub", "translucent", "body"],
      pairsWith: "Body · bath · everyday",
      body: "Cloth and glass. Quiet."
    },
    {
      id: "ls-9954",
      title: "After sun on the rocks",
      alt: "Tan after sun tube on coastal rocks with blue ocean behind it",
      category: "lifestyle",
      productIds: ["fresh-after-sun-tan-booster"],
      tags: ["after sun", "beach", "ocean", "rocks", "sun", "body"],
      pairsWith: "Sun · body · outdoor",
      body: "Ocean does the stopping. Pair with a summer noticing post — not a SPF lecture unless that's the point."
    },
    {
      id: "ls-9955",
      title: "Bottles by the shower",
      alt: "Two translucent bottles beside a modern black handheld shower",
      category: "bathroom",
      tags: ["shower", "shampoo", "bathroom", "black fixture", "hair"],
      pairsWith: "Hair · shower · body",
      body: "Shower fixture + bottles. Ask what they actually use in the stall."
    },
    {
      id: "ls-9956",
      title: "Two bottles on the tub",
      alt: "Two translucent bottles on the tub edge against a plain beige wall",
      category: "bathroom",
      tags: ["bathtub", "bottles", "beige", "bathroom", "hair"],
      pairsWith: "Bathroom · hair · body",
      body: "Beige wall, two bottles. Keep it simple."
    },
    {
      id: "ls-9957",
      title: "Shower fixture close",
      alt: "Black shower fixture with two small bottles on the tub edge",
      category: "bathroom",
      tags: ["shower", "fixture", "bathtub", "bathroom", "hair"],
      pairsWith: "Shower · fixtures · ritual",
      body: "The fixture is the frame. Products sit quietly."
    },
    {
      id: "ls-9958",
      title: "Three bottles at the shower",
      alt: "Three bottles including two translucent and one white pump by the shower",
      category: "bathroom",
      tags: ["shower", "three", "shampoo", "bathroom", "hair"],
      pairsWith: "Hair · shower lineup",
      body: "A small shower lineup. Don't name all three."
    },
    {
      id: "ls-9959",
      title: "Two shampoos and a pump",
      alt: "Two translucent shampoo bottles and one white pump bottle in a row",
      category: "products",
      productIds: ["fresh-repair-shampoo", "fresh-volume-shampoo"],
      tags: ["shampoo", "hair", "pump", "lineup", "fresh"],
      pairsWith: "Hair · shampoo · routine",
      body: "Hair care, clean row. Pair with a 'what's in your shower' question."
    },
    {
      id: "ls-9960",
      title: "Orange bottle on the tub",
      alt: "Wide tub shot with an orange-tinted bottle lying on the rim by a black shower",
      category: "bathroom",
      tags: ["bathtub", "orange", "horizontal", "shower", "bathroom"],
      pairsWith: "Bathroom · body · color",
      body: "The lying bottle is the stop."
    },
    {
      id: "ls-9961",
      title: "Light legs on jute",
      alt: "Two brown pump bottles labeled light legs on a woven jute surface",
      category: "products",
      productIds: ["fresh-light-legs"],
      tags: ["light legs", "body", "jute", "brown", "fresh"],
      pairsWith: "Body · legs · everyday",
      body: "Texture under the bottles. Ask what 'light legs' even means."
    },
    {
      id: "ls-9962",
      title: "Light legs in water",
      alt: "Brown light legs pump bottle splashing in clear water",
      category: "products",
      productIds: ["fresh-light-legs"],
      tags: ["light legs", "water", "splash", "body", "fresh"],
      pairsWith: "Body · water · motion",
      body: "Motion stops the scroll. Short caption."
    },
    {
      id: "ls-9963",
      title: "Cream drops beside the pump",
      alt: "Small white pump bottle with drops of white cream on a beige surface",
      category: "products",
      tags: ["cream", "drops", "texture", "pump", "fresh"],
      pairsWith: "Texture · cream · close-up",
      body: "The drops are the hook."
    },
    {
      id: "ls-9964",
      title: "Hand balm and foot balm",
      alt: "Two beige pumps labeled FRESH hand balm and FRESH foot balm side by side",
      category: "products",
      productIds: ["fresh-hand-balm", "fresh-foot-balm"],
      tags: ["hand balm", "foot balm", "hands", "feet", "fresh"],
      pairsWith: "Hands · feet · everyday",
      body: "A pair. Ask which one people forget they need."
    },
    {
      id: "ls-9965",
      title: "Packs and tins together",
      alt: "Pack A, B, and C boxes behind tins including spermidine, immu, fem, and moodoo",
      category: "supplements",
      productIds: ["fresh-pack-antiox", "fresh-pack-balancing", "fresh-pack-cleansing", "fresh-packs-abc", "beyond-spermidine", "caps-immu", "caps-fem", "caps-moodoo"],
      tags: ["pack a", "pack b", "pack c", "tins", "caps", "lineup"],
      pairsWith: "Supplements · packs · lineup",
      body: "The color-block lineup. Don't explain every tin — pick one door."
    },
    {
      id: "ls-9966",
      title: "Protect capsules on marble",
      alt: "Yellow protect tins, a wooden spoon, and dark capsules on marble",
      category: "supplements",
      productIds: ["caps-protect"],
      tags: ["protect", "caps", "spoon", "marble", "yellow"],
      pairsWith: "Supplements · protect · everyday",
      body: "Spoon and capsules. Pair with a curious line, not a protocol."
    },
    {
      id: "ls-9967",
      title: "Protect in the spoon",
      alt: "Close-up of protect capsules in a wooden spoon beside an open tin",
      category: "supplements",
      productIds: ["caps-protect"],
      tags: ["protect", "caps", "spoon", "tin", "close-up"],
      pairsWith: "Supplements · texture · ritual",
      body: "Close enough to count. Keep the caption unfinished."
    },
    {
      id: "ls-9968",
      title: "Move tins and orange caps",
      alt: "Teal move tins and boxes with orange capsules scattered on white",
      category: "supplements",
      productIds: ["caps-move"],
      tags: ["move", "caps", "orange", "teal", "joints"],
      pairsWith: "Supplements · move · body",
      body: "The orange caps are the stop. Ask what 'move' is for without diagnosing."
    },
    {
      id: "ls-9969",
      title: "Stacked move tins",
      alt: "Stack of light blue move tins and boxes with orange capsules in front",
      category: "supplements",
      productIds: ["caps-move"],
      tags: ["move", "stacked", "tins", "orange", "caps"],
      pairsWith: "Supplements · move · stack",
      body: "A tidy stack. Short caption."
    },
    {
      id: "ls-9970",
      title: "Open move tin",
      alt: "Open move tin filled with orange capsules on wood",
      category: "supplements",
      productIds: ["caps-move"],
      tags: ["move", "open", "tin", "orange", "caps", "wood"],
      pairsWith: "Supplements · move · ritual",
      body: "Lid off. Lived-in."
    },
    {
      id: "ls-9971",
      title: "Moodoo capsules",
      alt: "Light green moodoo tin lid and tan capsules on a textured surface",
      category: "supplements",
      productIds: ["caps-moodoo"],
      tags: ["moodoo", "caps", "mood", "green", "tin"],
      pairsWith: "Supplements · mood · curiosity",
      body: "The name is the hook. Don't overclaim mood — stay curious."
    },
    {
      id: "ls-9972",
      title: "Open moodoo tin",
      alt: "Open moodoo tin on wood with tan capsules scattered inside and around",
      category: "supplements",
      productIds: ["caps-moodoo"],
      tags: ["moodoo", "open", "tin", "caps", "wood"],
      pairsWith: "Supplements · mood · ritual",
      body: "Open tin energy. Pair with a soft noticing line."
    },
    {
      id: "ls-9973",
      title: "Mascu tin",
      alt: "Round mascu tin stacked on its lid on a reflective surface",
      category: "supplements",
      productIds: ["caps-mascu"],
      tags: ["mascu", "tin", "caps", "orange", "men"],
      pairsWith: "Supplements · mascu · curiosity",
      body: "One tin. Let people ask what it is."
    },
    {
      id: "ls-9974",
      title: "Immu on a clay plate",
      alt: "Orange immu tin beside a clay plate of brown capsules",
      category: "supplements",
      productIds: ["caps-immu"],
      tags: ["immu", "immune", "caps", "clay", "orange"],
      pairsWith: "Supplements · immu · everyday",
      body: "Clay plate, orange tin. No immune-system lecture."
    },
    {
      id: "ls-9975",
      title: "Immu tin against the wall",
      alt: "Orange immu tin and capsules against a neutral wall",
      category: "supplements",
      productIds: ["caps-immu"],
      tags: ["immu", "tin", "caps", "orange", "studio"],
      pairsWith: "Supplements · immu · still life",
      body: "Quiet studio shot."
    },
    {
      id: "ls-9976",
      title: "Hydro tin and box",
      alt: "Light blue hydro tin and square box with capsules on wood",
      category: "supplements",
      productIds: ["caps-hydro"],
      tags: ["hydro", "caps", "hydration", "blue", "box"],
      pairsWith: "Supplements · hydro · hydration",
      body: "Blue packaging. Pair with a water/hydration open loop — not a hard sell."
    },
    {
      id: "ls-9977",
      title: "Hand holding hydro",
      alt: "Hand with gold rings holding a light blue hydro tin against white",
      category: "lifestyle",
      productIds: ["caps-hydro"],
      tags: ["hydro", "hand", "rings", "tin", "lifestyle"],
      pairsWith: "Lifestyle · hydro · in-hand",
      body: "A hand, not a catalog. Keep it human."
    },
    {
      id: "ls-9978",
      title: "Fem on a beige plate",
      alt: "Pink fem tin on a beige plate with capsules",
      category: "supplements",
      productIds: ["caps-fem"],
      tags: ["fem", "pink", "caps", "plate", "women"],
      pairsWith: "Supplements · fem · curiosity",
      body: "Pink tin. Stay curious, never clinical."
    },
    {
      id: "ls-9979",
      title: "Stacked fem boxes",
      alt: "Two pink fem boxes stacked vertically",
      category: "supplements",
      productIds: ["caps-fem"],
      tags: ["fem", "boxes", "pink", "stacked", "packaging"],
      pairsWith: "Supplements · fem · packaging",
      body: "The stack is the stop."
    },
    {
      id: "ls-9980",
      title: "Open fem tin",
      alt: "Open pink fem tin and lid on wood showing capsules inside",
      category: "supplements",
      productIds: ["caps-fem"],
      tags: ["fem", "open", "tin", "caps", "wood", "pink"],
      pairsWith: "Supplements · fem · ritual",
      body: "Lid beside the tin. Lived-in."
    },
    {
      id: "ls-9981",
      title: "Cerebro in water ripples",
      alt: "Purple cerebro tin centered in concentric water ripples",
      category: "supplements",
      productIds: ["caps-cerebro"],
      tags: ["cerebro", "water", "ripples", "purple", "focus"],
      pairsWith: "Supplements · cerebro · motion",
      body: "Ripples do the stopping. Don't overclaim the brain."
    },
    {
      id: "ls-9982",
      title: "Beauty & hair on clay",
      alt: "Two lavender beauty & hair tins on organic clay plates with capsules",
      category: "supplements",
      productIds: ["caps-beauty-hair"],
      tags: ["beauty hair", "caps", "lavender", "clay", "hair"],
      pairsWith: "Supplements · hair · beauty",
      body: "Clay plates. Pair with a hair question, not a guarantee."
    },
    {
      id: "ls-9983",
      title: "Beauty & hair close",
      alt: "Close side view of a lavender beauty & hair tin and capsules",
      category: "supplements",
      productIds: ["caps-beauty-hair"],
      tags: ["beauty hair", "tin", "caps", "lavender", "close-up"],
      pairsWith: "Supplements · hair · close-up",
      body: "Close enough to read. Short caption."
    },
    {
      id: "ls-9984",
      title: "Beyond spermidine on stone",
      alt: "Dark blue BEYOND spermidine tin and open tin of capsules on stone",
      category: "supplements",
      productIds: ["beyond-spermidine"],
      tags: ["beyond", "spermidine", "stone", "caps", "blue"],
      pairsWith: "Supplements · beyond · curiosity",
      body: "The word spermidine is the open loop. Don't rush to explain it all."
    },
    {
      id: "ls-9985",
      title: "Spermidine scatter",
      alt: "BEYOND spermidine tin with beige capsules scattered on grey",
      category: "supplements",
      productIds: ["beyond-spermidine"],
      tags: ["beyond", "spermidine", "scatter", "caps", "grey"],
      pairsWith: "Supplements · beyond · texture",
      body: "Scatter shot. Keep it unfinished."
    },
    {
      id: "ls-9986",
      title: "Hands on Beyond omega",
      alt: "Hands holding an open BEYOND omega tin of dark red softgels",
      category: "supplements",
      productIds: ["beyond-omega"],
      tags: ["beyond", "omega", "softgels", "hands", "red"],
      pairsWith: "Supplements · omega · in-hand",
      body: "Hands and red gel caps. Human, not clinical."
    },
    {
      id: "ls-9987",
      title: "Beyond biotic with powder",
      alt: "BEYOND biotic tin beside a ceramic plate of capsules and white powder",
      category: "supplements",
      productIds: ["beyond-biotic"],
      tags: ["beyond", "biotic", "powder", "caps", "gut"],
      pairsWith: "Supplements · biotic · curiosity",
      body: "Powder and caps. Pair with a gut-curious line — no protocol dump."
    },
    {
      id: "ls-9988",
      title: "Beyond biotic overhead",
      alt: "Overhead of BEYOND biotic tins on a white plate with a few capsules",
      category: "supplements",
      productIds: ["beyond-biotic"],
      tags: ["beyond", "biotic", "overhead", "plate", "caps"],
      pairsWith: "Supplements · biotic · still life",
      body: "Overhead still life. Quiet."
    },
    {
      id: "ls-9989",
      title: "Pack A, B, and C sachets",
      alt: "Stacked sachets: pack A orange, pack B green, pack C cleansing yellow",
      category: "supplements",
      productIds: ["fresh-pack-antiox", "fresh-pack-balancing", "fresh-pack-cleansing", "fresh-packs-abc"],
      tags: ["pack a", "pack b", "pack c", "sachets", "antiox", "balancing", "cleansing"],
      pairsWith: "Packs · freshness · try-before",
      body: "Three colors. Ask which pack people would try first."
    },
    {
      id: "ls-9990",
      title: "Pack boxes stacked",
      alt: "Diagonal stack of pack boxes in orange, green, and yellow",
      category: "supplements",
      productIds: ["fresh-pack-antiox", "fresh-pack-balancing", "fresh-pack-cleansing", "fresh-packs-abc"],
      tags: ["pack", "boxes", "antiox", "balancing", "cleansing", "stack"],
      pairsWith: "Packs · color · lineup",
      body: "Color-block boxes. Don't explain all three in one caption."
    },
    {
      id: "ls-9992",
      title: "bty beside the glass",
      alt: "Small brown bty bottle next to a tall fluted glass of orange drink",
      category: "drinks",
      productIds: ["ringanabty"],
      tags: ["bty", "ringanabty", "drink", "glass", "orange", "shot"],
      pairsWith: "Drinks · bty · ritual",
      body: "Bottle and glass. Pair with a taste/ritual open loop."
    },
    {
      id: "ls-9993",
      title: "chi bottle and box",
      alt: "Small chi bottle beside its tall white-and-orange box on a solid orange background",
      category: "drinks",
      productIds: ["ringanachi"],
      tags: ["chi", "ringanachi", "box", "orange", "shot"],
      pairsWith: "Drinks · chi · packaging",
      body: "The orange field is the stop."
    },
    {
      id: "ls-9994",
      title: "chi with orange juice",
      alt: "chi bottle next to a glass of orange juice on a tan background",
      category: "drinks",
      productIds: ["ringanachi"],
      tags: ["chi", "ringanachi", "juice", "glass", "orange", "drink"],
      pairsWith: "Drinks · chi · taste ritual",
      body: "Juice and bottle. Ask what they're mixing."
    },
    {
      id: "ls-9995",
      title: "chi vials in a pattern",
      alt: "Several small chi vials arranged in a geometric pattern on stone",
      category: "drinks",
      productIds: ["ringanachi"],
      tags: ["chi", "vials", "pattern", "flat lay", "shots"],
      pairsWith: "Drinks · chi · lineup",
      body: "The pattern does the stopping."
    },
    {
      id: "ls-9996",
      title: "chi vials scattered",
      alt: "Multiple small chi vials with white caps scattered on white",
      category: "drinks",
      productIds: ["ringanachi"],
      tags: ["chi", "vials", "scatter", "white caps", "shots"],
      pairsWith: "Drinks · chi · freshness",
      body: "A scatter of little bottles. Keep the caption unfinished."
    },
    {
      id: "ls-9997",
      title: "dea bottle and blue box",
      alt: "Dark dea bottle beside a tall light-blue dea box",
      category: "drinks",
      productIds: ["ringanadea"],
      tags: ["dea", "ringanadea", "box", "blue", "shot"],
      pairsWith: "Drinks · dea · packaging",
      body: "Blue box, dark bottle. Simple hero."
    },
    {
      id: "ls-9998",
      title: "dea and iced red drink",
      alt: "Small dea bottle beside a tall glass of deep-red liquid with ice",
      category: "drinks",
      productIds: ["ringanadea"],
      tags: ["dea", "ringanadea", "ice", "red", "drink", "glass"],
      pairsWith: "Drinks · dea · ritual",
      body: "The red glass stops the scroll. Short caption. No hard sell."
    },
    {
      id: "ls-9999",
      title: "dea flat lay on marble",
      alt: "Overhead of a dea bottle, cap, and glass of red liquid on white marble with long shadows",
      category: "drinks",
      productIds: ["ringanadea"],
      tags: ["dea", "marble", "flat lay", "shadows", "red", "drink"],
      pairsWith: "Drinks · dea · light",
      body: "Shadows on marble. Pair with a quiet ritual line."
    }
  ],

  openLoops: [
    {
      title: "How long did it sit?",
      body: "The average person has no idea how long a product sat before they bought it… Neither did I. Now I can't stop thinking about it."
    },
    {
      title: "Already a year old?",
      body: "I wonder how many products we've all used that were already a year old before we ever opened them… oof. Now THAT'S a weird thing to think about."
    },
    {
      title: "Paused on the word fresh",
      body: "I've been reading ingredient labels more carefully. One brand from Austria made me pause on the word fresh…"
    },
    {
      title: "Expiry is the point",
      body: "Okay so I'm learning about cosmetics made without synthetic preservatives as the shortcut — and the expiry date is kind of the point."
    },
    {
      title: "Clean… but who made it?",
      body: "Tiny thing I noticed: a lot of \"clean\" labels still don't tell me who made it or why each ingredient is there."
    },
    {
      title: "Not selling — just learning",
      body: "Not selling anything today — just sharing what I'm learning about freshness, glass packaging, and in-house production."
    },
    {
      title: "Store aisle question",
      body: "If you've ever stood in a store aisle wondering what's actually in the bottle… same."
    },
    {
      title: "Would I put this on my kid?",
      body: "Honest question I've been asking: would I put this on my own skin if I knew how it was made?"
    },
    {
      title: "Family-owned for 30 years",
      body: "I've been quietly researching a wellness company that's still family-owned after 30 years… and one detail about how they make things stopped me mid-scroll."
    },
    {
      title: "No investors. Still.",
      body: "Random thing that made me look twice: a 30-year company with no outside investors, still making products the \"hard\" way. Still sitting with that."
    },
    {
      title: "Glass you can send back",
      body: "Heard about a brand that pays you to ship empty glass bottles back so they can sanitize them into new ones… and now I can't stop noticing every plastic pump in my bathroom."
    },
    {
      title: "Made like food",
      body: "What if skincare had an expiration date more like food than like a warehouse product? One brand I've been learning about treats it that way — and I keep turning it over in my head."
    }
  ],

  /* ── Product sparks — curious, conversational noticing ── */
  productSparks: [
    {
      id: "foam_wash_wipes",
      icon: "🫧",
      title: "Foam wash → wet wipe",
      body: "I'm so curious if you've ever used a product like this because I have never.\n\nIt basically turns toilet paper into a wet wipe. For feminine hygiene. For babies. For camping.\n\n(It's a fresh foam wash — so simple I keep thinking about how many plastic wipe packs this could replace.)"
    },
    {
      id: "cleanser_no_foam",
      icon: "🧴",
      title: "Cleanser that isn't foamy",
      body: "Okay weird question — do you actually need a cleanser to foam to feel clean?\n\nI've been trying one that feels more like a milk than a bubble bath… and my skin doesn't feel tight after. Still figuring out if I miss the foam or if that was just a habit."
    },
    {
      id: "glass_bottle",
      icon: "🫙",
      title: "Glass on purpose",
      body: "Tiny thing that made me pause: a brand that puts body care in glass on purpose — and will actually pay you to ship the empties back so they can sanitize them into new bottles.\n\nHave you ever used something with a real return loop like that? Or is that just me geeking out?"
    },
    {
      id: "short_shelf",
      icon: "⏳",
      title: "Short shelf life = feature?",
      body: "Unpopular-ish thought: what if a shorter expiry date was a good sign?\n\nI've been looking at fresh-made products that aren't built to sit in a warehouse for a year… and now I can't unsee the dates on everything else in my bathroom."
    },
    {
      id: "one_roof",
      icon: "🏡",
      title: "Made under one roof",
      body: "Random curiosity: how many brands actually make their own stuff under one roof vs. shipping ingredients and packaging all over the place?\n\nI learned about one that does almost everything in-house — and now I'm weirdly obsessed with asking that question."
    },
    {
      id: "camping_kit",
      icon: "🏕️",
      title: "Camping / travel hack",
      body: "Camping people — what's your wipe situation?\n\nI just learned about a foam wash that turns regular toilet paper into a wet wipe. Feminine hygiene, babies, trail bathrooms… I'm curious if anyone's already doing something like this or if I'm late to the party."
    },
    {
      id: "serum_fresh",
      icon: "💧",
      title: "When was this made?",
      body: "Honest question for anyone into serums or supplements: do you ever check when something was made — not just when it expires?\n\nI've started asking that, and it's changing how I look at everything on my shelf."
    },
    {
      id: "kids_bath",
      icon: "🛁",
      title: "Kid bath products",
      body: "Parents — how picky are you about what goes in the bath?\n\nI've been looking at a baby/kids line made fresh without the usual preservative shortcuts… curious what your non-negotiables are."
    },
    {
      id: "supplement_smell",
      icon: "🍋",
      title: "If it smells like nothing…",
      body: "Weird thought: if a \"plant-based\" supplement smells like absolutely nothing… what does that tell you?\n\nI've been learning about fresh-made formulas where you can actually tell the botanicals are in there. Still figuring out how to explain it without sounding dramatic."
    }
  ],

  /* ── Product story sequence (gives / in-depth posts) ── */
  productStory: {
    intro: "If you've been around wellness for a while, you've probably noticed something… Most companies compete by adding another trendy ingredient. But I stumbled upon a brand that was far more interested in asking a different question: \"What if the entire way products are made could be improved?\" These are a few of the things that made me stop in my tracks…",
    posts: [
      {
        id: "freshness",
        icon: "🌱",
        title: "Freshness actually matters",
        body: "🌱 Freshness actually matters\n\nMost supplements and skincare are designed to survive warehouses, shipping containers, and store shelves. That means stability often comes before freshness.\n\nThese products are made in small batches — on average about twice a week — and have intentionally shorter shelf lives so they spend less time sitting around before they reach you. It's a completely different philosophy — surprisingly rare — with patented processes behind it."
      },
      {
        id: "in_house",
        icon: "🏡",
        title: "They make (almost) everything themselves",
        body: "🏡 They make (almost) everything themselves\n\nMost wellness companies source packaging from one place… ship it somewhere else to get stamped with their logo… formulate somewhere else… manufacture somewhere else… package somewhere else… then ship to you from somewhere else.\n\nThis brand? Nearly everything happens under one roof. And it's not an assembly line of people hand-stirring a recipe card — they've patented scalable manufacturing processes with high safety and testing standards. Tighter quality control, faster innovation, and oversight from beginning to end."
      },
      {
        id: "labels",
        icon: "🧪",
        title: "The ingredient list makes sense",
        body: "🧪 The ingredient list actually makes sense\n\nI'm a label reader — and I have been for as long as I can remember. I've never looked at so many formulas and thought, \"Yep… this all makes beautiful sense.\"\n\nIngredients aren't there just because they're trendy. They're there because they serve a purpose — from the first on the label to the last."
      },
      {
        id: "nature_science",
        icon: "🌿",
        title: "Plants… backed by science",
        body: "🌿 Plants… but backed by science\n\nThis isn't \"sprinkle in some kale powder and call it wellness.\" The formulas combine botanicals with clinically researched vitamins, minerals, amino acids, probiotics, and other nutrients chosen for how they work together.\n\nNature and science don't have to compete."
      },
      {
        id: "sustainability",
        icon: "♻️",
        title: "Sustainability isn't an afterthought",
        body: "♻️ Sustainability isn't an afterthought\n\nIt's woven into almost every decision.\n\nPackaging — a glass bottle re-use program where the company pays you to ship glass back so it can be sanitized back into production.\nProduction — organic cotton cloths hand-wrapped around glass instead of a basic carton.\nShipping — post-consumer recycled materials and biodegradable packing filler.\nIngredient sourcing — including upcycled ingredients (like ground apricot seeds in a body exfoliator) so there's as little waste as possible.\n\nAnd that's just the start…"
      }
    ]
  },

  /* ── Business story posts (use carefully — education, not hype) ── */
  businessStory: [
    {
      id: "products_first",
      icon: "🤝",
      title: "Products come first",
      body: "🤝 Products come first\n\nNo business lasts without products people actually want to reorder. This company upholds a company-wide ~70% retention rate with a ~0.2% return rate.\n\nThe strongest businesses are built on genuine customers. Everything else grows from there."
    },
    {
      id: "timing",
      icon: "🌎",
      title: "Incredible timing",
      body: "🌎 Incredible timing\n\nThe company has spent years building proven systems overseas. The U.S. is just getting started. That's a rare combination.\n\nYou're not betting on an untested idea — you're stepping into a model that's already working elsewhere."
    },
    {
      id: "be_yourself",
      icon: "🌱",
      title: "Growth without reinventing yourself",
      body: "🌱 Growth without reinventing yourself\n\nOne of the things I love most… I don't have to become someone I'm not. I still get to teach. Read labels. Share honestly. Answer questions.\n\nThe business grows because of education — not pressure."
    },
    {
      id: "not_alone",
      icon: "🏠",
      title: "You're not building alone",
      body: "🏠 You're not building alone\n\nThis community isn't about competition. It's about sharing resources, celebrating wins, asking questions, and making the learning curve a whole lot shorter.\n\nIf one person figures something out, everyone benefits. And you'll be growing alongside experienced team leaders — including leaders who've done nearly $100 million in combined team sales volume within the last 9 years (as shared by leadership)."
    },
    {
      id: "integrity",
      icon: "🎯",
      title: "Integrity isn't optional",
      body: "🎯 Integrity isn't optional\n\nYou'll probably notice something different here… No pressure. No exaggerated promises. No pretending every product is magic. No pretending this business is effortless.\n\nTrust takes a long time to build. We'd rather protect it than chase a quick sale."
    }
  ],

  /* ── Pillars (Learn + values posts) ── */
  pillars: [
    {
      id: "fresh",
      icon: "🌱",
      title: "Fresh",
      body: "Most companies ask… \"How long can we make this last?\" This one asks… \"How fresh can we make it?\" That mindset changes everything. Fresh ingredients. Small production batches. Products designed to be used — not chill in a warehouse. A philosophy I didn't know existed until I learned about their manufacturing systems."
    },
    {
      id: "trendsetting",
      icon: "✨",
      title: "Trendsetting",
      body: "I love companies that don't wait for everyone else to do something first. They're constantly researching new ingredients, improving formulas, questioning \"normal\" ways of doing things — not because it's trendy, but because innovation never really stops."
    },
    {
      id: "excellence",
      icon: "🏆",
      title: "Excellence",
      body: "Excellence isn't about having the biggest product line. It's about asking… \"Can we make this even better?\" Again and again. That mindset shows up everywhere as they've evolved over nearly 30 years."
    }
  ],

  pillarsIntro: "This company doesn't just have a mission statement. They've built everything around three simple words: Fresh. Trendsetting. Excellence. Every product, every decision, every innovation seems to come back to those three ideas — deeply enshrined in their DNA, according to the company.",

  /* ── Company facts (Learn + calendar drafts) ── */
  funFacts: [
    {
      id: "family",
      title: "Family-founded, still family-run",
      body: "Ringana started in Austria in 1996 because two parents wanted better for their son. Nearly thirty years later, the family is still the founder — no outside investors and no debt."
    },
    {
      id: "virginia",
      title: "An old J&J plant in Virginia",
      body: "They’re putting about $85 million into turning a former Johnson & Johnson plant into the U.S.’s first Fresh Factory. Virginia won on water-quality testing and being a swing state. The expansion is expected to bring about 425 jobs."
    },
    {
      id: "37_markets",
      title: "37 markets before the U.S.",
      body: "This isn’t a brand-new idea looking for a first customer. Ringana already ships from Austria into 37 markets. The U.S. is a new chapter for a company that’s been doing this the long way."
    },
    {
      id: "made_in_house",
      title: "Made in-house, about twice a week",
      body: "They manufacture the vast majority of products themselves — not a third-party kitchen following a recipe card. Patented machinery runs small batches about every two days, which is how freshness and quality stay in their hands."
    },
    {
      id: "single_channel",
      title: "No store shelf on purpose",
      body: "Ringana doesn’t sell through traditional retail. Direct-to-consumer is the model, because made-to-order products aren’t built to sit in a warehouse hoping someone picks them up. They’re a single-channel company and mean to stay that way."
    },
    {
      id: "short_dating",
      title: "An expiration date like food",
      body: "Products have a real expiry — that’s the point. They aren’t loaded with long-shelf synthetic preservatives so they can live in a warehouse for years. Short dating is the proof of how they’re made."
    },
    {
      id: "glass",
      title: "Glass that’s meant to come back",
      body: "Skincare goes in glass with an airless pump, wrapped in organic cotton instead of a throwaway carton. Empty bottles can be returned, cleaned, and filled again. Reuse, not “recyclable if someone happens to recycle it.”"
    },
    {
      id: "retention",
      title: "About 70% come back",
      body: "Company-wide customer retention is about 70%. People don’t reorder because the box is pretty — they reorder because they actually want to use the products again."
    },
    {
      id: "returns",
      title: "About 0.2% come back as returns",
      body: "The company-wide return rate is about 0.2%. People keep what they order. That’s a quiet signal the product earned a second use, not a refund."
    },
    {
      id: "transparency",
      title: "They publish the numbers",
      body: "Ringana puts out yearly Transparency Reports and a FRESH IMPACT sustainability report — climate, packaging, water, people — not a one-page “we care” PDF. The reports live in Why Ringana if you want to read them."
    },
    {
      id: "optional_team",
      title: "Building a team is optional",
      body: "You don’t have to build a team to earn. Compensation starts with recommending products people actually want. Team building is optional — not the price of admission."
    }
  ],

  /* ── Talking Fresh · Conversation guide (Learn) ── */
  talkGuide: {
    lede: "Ringana handed us something rare: a story that's actually true. The partners who win aren't the ones with the slickest script — they're the ones who stay human when it counts.",
    thesis: {
      stats: [
        { num: "81%", lbl: "trust rate for wellness micro-creators who share honest, long-term use — highest of any category" },
        { num: "+44%", lbl: "more credibility for creators who share real failures than positive-only posters" },
        { num: "1st", lbl: "objection is almost never the real one — the first \"no\" is often a stand-in for the true concern" }
      ],
      paras: [
        "A person who pushes back is still in the conversation. Silence is the rejection that should worry you — an objection is someone telling you what they need. Your job isn't to \"overcome\" them. It's to hear what's underneath and answer that.",
        "The stuff that feels like good selling — polish, a copy-paste opener, relentless positivity — is often what makes people put their guard up. Every move here is meant to lower that pressure, not raise it.",
        "Ringana makes this easier than most brands. A family in Austria has been doing this the hard way since 1996 — fresh, made to order, with an expiration date like real food. That's not a tagline. It's a fact you get to tell like a human."
      ],
      pull: "Your edge isn't a script. It's that you actually use these products, you understand why they're built this way, and you're willing to say what doesn't work too."
    },
    principles: [
      {
        title: "Frame the moment",
        body: "We're helping an established brand open in America — launch partners, not a brand-new hype machine. Hybrid affiliate: buy, share, or build. Say that once, calmly, then get back to the product and the person."
      },
      {
        title: "Decode, don't defend",
        body: "When someone pushes back, don't rush to answer the words. Ask what's underneath first — \"what's making you hesitate?\" The first objection is usually a placeholder. The second one is the truth."
      },
      {
        title: "Let freshness do the talking",
        body: "No artificial preservatives. Small batches. Actives at full strength. An expiration date as proof. Say it plainly — the right people lean in."
      },
      {
        title: "Admit what didn't work",
        body: "\"That one wasn't for me\" isn't a leak. It proves you're not performing — so the good stuff you do say actually lands."
      },
      {
        title: "Be specific",
        body: "\"Still soft twelve hours later\" beats \"life-changing\" every time. Detail from a product you actually used is hard to fake."
      },
      {
        title: "Lower the pressure",
        body: "\"No rush — it's not even launched\" is a gift. Pressure makes people freeze. Calm makes space for a real yes."
      }
    ],
    momentsIntro: "Tap a moment for the why, the words, and the trap. Steal the structure — say it in your voice.",
    moments: [
      {
        id: "warm-why-ringana",
        cat: "Warm",
        q: "\"Why Ringana?\" / \"What makes this different?\"",
        mechanism: "They're asking for a reason to care — not a catalog dump. Lead with what made you stop: how the products are made. Only go into the business if they ask for that too.",
        note: "These lines pull from Learn → Why Ringana. Pick 2–3 you actually believe. Don't recite all of them.",
        playLabel: "Points you can say out loud",
        openers: [
          "They're made fresh in small batches — about twice a week — so they aren't engineered to sit in a warehouse for years.",
          "Almost everything happens under one roof — formulate, make, package — with real quality control from start to finish.",
          "I'm a label reader, and these formulas actually make sense. Ingredients are there for a reason, not just because they're trendy.",
          "It's plants backed by science — botanicals with researched vitamins, minerals, probiotics — not kale dust and a vibe.",
          "Sustainability isn't a sticker. Glass reuse, organic cotton wraps, recycled shipping, even upcycled ingredients.",
          "Products come first — people reorder because they want to. The business only works if the product earns it.",
          "The model already works overseas. The U.S. is just getting started — rare timing, not an untested idea.",
          "You don't have to reinvent yourself. It grows through education and honest shares — not pressure.",
          "You're not building alone. Resources get shared, wins get celebrated, and the learning curve gets shorter together.",
          "Integrity isn't optional here — no fake urgency, no pretending every product is magic, no pretending the work is effortless."
        ],
        trap: "Listing every differentiator like a brochure. Two true points you care about beat ten you recited."
      },
      {
        id: "warm-comment",
        cat: "Warm",
        q: "Someone commented \"obsessed 😍\" or \"need this\"",
        mechanism: "A public comment is an emotional impulse, not a decision. If you answer it with a link, you convert a warm human feeling into a cold transaction. Meeting the feeling with curiosity keeps you in the trusted category.",
        note: "Reply warmly in public so others see a real human. Then, only if it's genuine, move to DMs — and the first DM's only job is to earn a second one.",
        playLabel: "The play",
        lines: [
          { who: "Them", text: "obsessed 😍" },
          { who: "You", text: "right?? okay I have to know — skincare person or secretly here for the supplements 👀 (it's not even launched in the US yet so I'm just gathering my people early)" }
        ],
        trap: "Dropping a link in the first reply. It reads as \"you were a lead the whole time,\" and it retroactively makes your content feel like bait."
      },
      {
        id: "warm-quiz-results",
        cat: "Warm",
        q: "Someone took The Fresh Match and came back with results",
        mechanism: "They sent you a result. That’s a conversation with a topic already attached — not a reason to pitch. Ask what landed. Then tell the truth about timing: these aren’t in the U.S. yet, and you’ll ping them when they are. Pre-launch, that’s the next step you can actually keep.",
        note: "One question beats three. Don’t dump a routine. The gift right now is “I’ll tell you when it’s actually here.”",
        crossLink: {
          goto: "quiz",
          label: "Not sure what I’m talking about? Open The Fresh Match guide →"
        },
        playLabel: "Opener bank",
        openers: [
          "okay which one did it give you — did that feel like you or were you like… not quite",
          "send the result if you want. curious what it picked vs what you already knew",
          "ha that’s a good match. nothing’s even available here yet so I can’t send you anything to try — I’ll tell you the second they launch if you want in",
          "did it surprise you or was it pretty on the nose? either way these don’t ship to the US yet. I’ll ping you when they do",
          "I’m still waiting to get my hands on them too 😅 they can’t legally ship here until later this year. want me to keep you posted when they actually land?"
        ],
        trap: "Turning their screenshot into a product pitch. They can’t buy it yet. Curiosity, then a heads-up when it launches — that’s the whole play."
      },
      {
        id: "warm-expires",
        cat: "Warm",
        q: "\"Wait, it expires? Isn't that a bad thing?\"",
        mechanism: "This is a reframe opportunity disguised as an objection. They're using an old reference point — \"long shelf life = quality.\" You don't argue it; you replace the reference point. Once \"fresh food expires, so does fresh skincare\" clicks, the supposed flaw becomes the differentiator.",
        note: "Don't get defensive about the short shelf life. Flip the frame: the expiration date is evidence there's nothing synthetic engineered to keep it stable on a shelf for three years.",
        playLabel: "The play",
        lines: [
          { who: "Them", text: "wait it expires? isn't that bad" },
          { who: "You", text: "I had the exact same reaction 😂 but that's the whole point — it expires because nothing artificial is holding it together on a shelf. made fresh in small batches, like actual food. the date is the proof, not the problem" }
        ],
        trap: "Over-claiming \"zero preservatives.\" It's no artificial / Annex-V preservatives — plant-based preservation still exists. Precision is literally the brand."
      },
      {
        id: "warm-safety",
        cat: "Warm",
        q: "\"Is this safe for pregnancy / sensitive skin / my kids?\"",
        mechanism: "Reassurance and information do opposite things to trust. \"Totally safe!\" makes you sound like you want the sale; \"let me check the actual ingredient list\" makes you sound like you want them safe.",
        note: "Ringana publishes full INCI lists — use them, don't wing it. Skin perfection carries 3% bakuchiol; that's exactly the kind of ingredient a pregnant person should run past their own provider.",
        playLabel: "The play",
        lines: [
          { who: "Them", text: "is it pregnancy safe?" },
          { who: "You", text: "great question and I don't want to eyeball it. one I use has bakuchiol in it, which is worth running by your OB — let me send you the full ingredient list for anything you're eyeing so you and your doctor have the real thing, not my guess 💚" }
        ],
        trap: "\"Totally safe!\" about anything medical. That's a health claim, an FTC/FDA exposure, and the fastest way to turn a trust moment into a liability. Facts and the ingredient list only."
      },
      {
        id: "cold-reach",
        cat: "Cold-ish",
        q: "You want to reach out to someone who hasn't engaged yet",
        mechanism: "This is social warming. A name the brain has seen before gets processed as safer. A cold DM to a true stranger fails not because the message is bad but because there's no prior recognition to cushion it.",
        note: "Before you ever message, engage for real over a week or two — specific comments on their actual content. When you do reach out, the opener is about them. If you couldn't send it with nothing to sell, don't send it.",
        playLabel: "The play",
        lines: [
          { who: "You", text: "okay your ingredient-label rants are my entire personality lately 😂 that post about \"fragrance\" hiding on labels — YES. had to say hi, following along." },
          { who: "Them", text: "haha thank you!! finally someone gets it" }
        ],
        trap: "The same opener sent to twenty people. If it could go to anyone, it reads as sent to everyone — and one screenshot of your copy-paste ends your reputation in that circle."
      },
      {
        id: "cold-fresh-curiosity",
        cat: "Cold-ish",
        q: "Curiosity openers — fresh-made / \"how have I never heard of this\"",
        mechanism: "You're not pitching yet — you're opening a curiosity door. A soft question at the end invites a reply (\"no / kind of / tell me more\") instead of a sale. Shared wonder beats a product dump.",
        note: "Pick one. Rewrite one personal detail so it only fits them. Soft close — you're inviting a peek, not a purchase.",
        playLabel: "Opener bank",
        openers: [
          "Okay I’ve spent the last couple weeks diving into products that are fresh like our food and I’m over here wondering how I’ve never heard of it before because it makes total sense 🥹 Are you familiar with it?!",
          "Okay I’ve spent the last couple weeks diving into products that are made fresh like our food and I’m genuinely a little annoyed I didn’t know this existed sooner 🥹 Have you ever heard of skincare that’s actually made fresh in small batches every week?",
          "Random but I’ve fallen down a rabbit hole with skincare that’s made fresh a couple times a week and sealed so it never even touches air until you pump it out — makes SO much more sense than stuff that sits on a shelf for three years 😅 I’m curious if you come across it yet?!",
          "Okay tell me if you already know about this — I found a product line that’s made fresh about twice a week with no synthetic preservatives, and the packaging is airless so it doesn’t oxidize sitting on your counter. Now I can’t unsee how weird it is that normal stuff can sit for years 🥹 Have you heard of it?",
          "I honestly have to tell someone about this before I explode 😅 I’ve been using this fresh-made skincare line for a couple weeks and I keep thinking how have I been in this space for years and never heard of it?? Are you familiar with Ringana at all?",
          "Quick Q — have you ever heard of fresh-made skincare? Like actually made in small batches every week, sealed airless so it never oxidizes? I’ve been using it a couple weeks and I’m kind of amazed 🥹"
        ],
        trap: "Leading with a catalog, a link, or \"it’s going to be huge.\" Curiosity first. Permission second. Pitch never in opener one."
      },
      {
        id: "cold-trusted-share",
        cat: "Cold-ish",
        q: "Trusted-share openers — picky friends, safe swaps, \"thought of you\"",
        mechanism: "People who already trust your recommendations don't need a cold education dump — they need to feel chosen. Name the trust, name why them, then ask if they want a peek. Belonging beats brochure.",
        note: "Use these with people who've taken your product recs before, or who live in the clean/label-reading world with you. Still change one detail every time.",
        playLabel: "Opener bank",
        openers: [
          "Hey friend! I’m so thankful you’ve trusted me with product recommendations over the years. You know I’m always looking for clean, sustainable, trustworthy brands to share… well I stumbled upon a company that’s coming to the US and I am fired up about it! It’s checked alllll my boxes and I can’t wait to start sharing more about it. I know you’re a conscious consumer so I wanted to share it with you first. Want to take a peek??",
          "You know how stringent I am with ingredients 😅 well something new has cleared my bar and I’m a little obsessed because it’s honestly unlike anything else I’ve seen — made fresh in small batches, no synthetic preservatives, actual studies behind it. Have you ever tried freshly made products?",
          "Okay you’re one of the people I thought of immediately with this 🥹 I’ve been using skincare that’s made fresh — like small-batch, made-to-order fresh — and it just makes so much sense. Is this on your radar at all or am I late to the party?",
          "I know you’re picky like me with ingredients and products so I have to share something new I found!! I think you’re going to be so impressed 🤩",
          "Helloooo fellow label reading friend 🥰 I know how much ingredients matter to you — have you heard of this EU company that is coming to the US?? I’m blown away with what I’ve seen so far!",
          "Hey friend! I know you’ve been making a lot of safe swaps this year. I found a clean company with allll the things from skincare and body to nutrition and wellness. I gotta share it with you, you’re going to love this!"
        ],
        trap: "Sending the \"thought of you\" opener to twelve people the same afternoon. If they compare notes, the magic dies — and so does the trust that made this work."
      },
      {
        id: "obj-price",
        cat: "Objection",
        q: "\"It's kind of expensive though…\"",
        mechanism: "Price is the safest doubt to voice, so it's usually a stand-in for \"I'm not sure it's worth it.\" Validate → isolate → reframe: agree it's an investment, find out if price is really the blocker, then change the reference point from \"vs. drugstore\" to \"vs. what made-fresh actually costs.\"",
        note: "Never discount-talk or get defensive. Made-to-order small batches with actives at full potency cost more than mass-produced product engineered to survive years in a warehouse. And \"now might not be the time\" is completely acceptable.",
        playLabel: "The play — isolate, then reframe",
        lines: [
          { who: "Them", text: "it's kind of expensive though" },
          { who: "You", text: "it's not cheap and I won't pretend it is. can I ask — is it the price itself, or not being sure it's worth it yet? totally different answers 💚" },
          { who: "Them", text: "I guess whether it's worth it" },
          { who: "You", text: "fair. so it's made fresh to order in tiny batches — you're paying for actives at full strength instead of a formula built to sit on a shelf for three years. that's the cost. if now's not the time though, genuinely no rush" }
        ],
        trap: "\"But think what you spend on coffee!\" Everyone's heard it, it's condescending, and it argues the number instead of the value."
      },
      {
        id: "obj-mlm",
        cat: "Objection",
        q: "\"Wait… is this one of those MLM / pyramid things?\"",
        mechanism: "This is a trust test, and your composure is the actual answer. They're watching your reaction more than listening to your words — a flinch or defensive speech confirms their fear; calm honesty disconfirms it faster than any explanation.",
        note: "Name the skepticism as fair. Be plainly transparent that it's a hybrid affiliate model, and lead with the truth that most people just buy the products and never sell. Under-claim the income side hard.",
        playLabel: "The play",
        lines: [
          { who: "Them", text: "wait is this an MLM 😬" },
          { who: "You", text: "totally fair to ask, I'd ask too. yeah it's a hybrid affiliate model — but honestly most people just buy the products and never sell a thing, that's completely normal. I share it because I actually use it every day. zero pressure either way, promise" }
        ],
        trap: "Any income claim, or painting it as easy money — even to win this moment. It's a trust-killer and a compliance landmine."
      },
      {
        id: "warm-start",
        cat: "Warm",
        q: "\"Okay I'm in — what should I even start with?\"",
        mechanism: "Choice overload kills momentum. Someone ready to buy who gets handed a catalog goes cold. Narrow to one product tied to their stated concern and your real experience.",
        note: "Anchor to one thing they'll actually feel. Be honest about the edges of your own experience — that honesty is why your recommendation carries weight.",
        playLabel: "The play — narrow, don't list",
        lines: [
          { who: "Them", text: "okay I'm in, where do I even start" },
          { who: "You", text: "honestly? the hydro serum. it's the one that made me go \"oh.\" my skin was still soft hours later, not that fake-dewy thing gone by lunch. but tell me what your skin actually does day to day and I'll point you better — I'd rather get you the right one than the most expensive one" }
        ],
        trap: "Raving about supplements (or anything) you haven't lived with. \"Haven't tried those myself yet, so I won't oversell them\" beats a hollow rave every time."
      },
      {
        id: "warm-not-tried",
        cat: "Warm",
        q: "\"Have you tried them?\" / \"What do you think of the results?\" — and you haven't used them yet",
        mechanism: "Pre-launch in a new market, a lot of us are still waiting on legal shipping. Pretending you've used something you haven't is the fastest way to lose the trust that made them ask. Honesty + secondhand excitement + a question back keeps you credible and keeps the conversation going.",
        note: "Name the shipping reality plainly — they can't legally ship here until later this year. Point to friends' real reviews if you've heard them, then flip it: what are they most curious to try? Don't invent results or borrow someone else's story as your own.",
        playLabel: "The play — honest wait, then curiosity",
        lines: [
          { who: "Them", text: "have you tried them? how do they actually perform?" },
          { who: "You", text: "I'm still waiting to get my hands on them! it's tricky when a company enters a new market — they can't legally ship here until later this year 😅\n\nbut a few friends have tried some things and oh my gosh, the reviews are incredible. honestly makes me even more excited. what are you most looking forward to trying?" }
        ],
        trap: "Faking personal results, or turning friends' reviews into clinical claims. Secondhand excitement is fine — \"it cleared my acne\" when it didn't happen to you is not."
      },
      {
        id: "biz-curious",
        cat: "Business",
        q: "Someone seems curious about becoming a partner too",
        mechanism: "Diagnosis before prescription. You cannot pitch the opportunity until you know what they're solving for — creative outlet, income, community, and early-timing are four different conversations.",
        note: "The founding-era U.S. timing is genuinely uncommon and worth naming honestly, but lead with the work, not the upside. Clear eyes come from you telling the truth about effort.",
        playLabel: "The play — question, then a real next step",
        lines: [
          { who: "Them", text: "how do I do what you're doing?" },
          { who: "You", text: "I'd genuinely love to talk about it — but before I info-dump, what's pulling you toward it? creative thing, extra income, the early-timing? changes everything I'd tell you. the US is brand new so it's a real ground-floor moment, and it's also actual work. wanna hop on a quick call this week and I'll be straight with you about both?" }
        ],
        trap: "The comp plan plus \"you'd be SO good at this!!\" in one breath. Curiosity isn't commitment, and over-eagerness reads as recruiting."
      },
      {
        id: "fade-quiet",
        cat: "Fade",
        q: "The conversation was going well… then they went quiet",
        mechanism: "Silence usually means soft-no or just life. \"Just checking in!!\" fails because it's a withdrawal, not a deposit — it asks for attention and gives nothing back. A follow-up that delivers something is a deposit.",
        note: "One low-pressure, genuinely useful follow-up — then stop. Pre-launch you have the best release valve: \"I'll just tell you when it's actually here.\"",
        playLabel: "The play — deposit, then release",
        lines: [
          { who: "You", text: "no pressure at all — you'd mentioned the sensitive-skin thing so here's that ingredient list I promised 💚 I'll just ping you when it actually launches in the US so it's off your plate till then. and totally fine if the timing's just not it" }
        ],
        trap: "The third and fourth \"checking in.\" One useful follow-up, then their silence gets to mean no. Chasing costs you the referral you might've gotten later."
      },
      {
        id: "invite-info-zoom",
        cat: "Invite",
        q: "How to invite someone to an Info Zoom",
        mechanism: "You're not pitching — you're telling people a story. The ask is simple: Friday, 30 minutes, what it is. Then an easy exit so they can say no without weirdness.",
        note: "Message anatomy: your own line → the ask (day, length, what it is) → the exit. Who to invite isn't \"who'd say yes\" — it's who'd be annoyed to find out later. And don't discount making a post about it — Post vault has a ready invite-post kit.",
        playLabel: "Example invitation messages",
        openers: [
          "hey! I’ve been quiet about something I’m starting and Friday I’m finally sharing it. it’s a 30 minute call about the company I’m partnering with — austrian, been around since ’96, just opening in the US. no pressure to do anything after, I just want you to hear about it. want the link?",
          "okay you’re literally the first person I thought of. you know how I’ve been obsessed with the whole fresh thing — friday I’m hosting a call about the company behind it. austrian, been doing this since ’96, just now coming to the US. 30 min. want the link?",
          "so. the thing I’ve been vague about for two months. friday I’m finally telling people what it is 😅 it’s a call about the brand I partnered with. I’d love you there but zero weirdness if it’s not your thing.",
          "hey — this might be nothing but you said a while back you were looking for something that was yours. friday I’m hosting a call about a company I’ve partnered with that’s opening in the US for the first time. no pressure at all, just thought of you. want me to send details?",
          "hi! random reach out but a good one. I’ve partnered with a skincare + supplement company out of austria and friday I’m hosting a 30 min call about it. you came to mind. totally fine to say no, I won’t be weird about it.",
          "hey! I see you around my stories and I’ve been meaning to say hi properly. I’m hosting a call friday about the brand I’ve been talking about — what it is, where it comes from, why I went all in. want the link?"
        ],
        trap: "Mass copy-paste, a vague mystery post with no ask, anything about money, or following up four times. One honest invite beats a campaign."
      }
    ],
    arc: [
      {
        n: "1",
        title: "Recognition",
        goal: "Become a familiar name",
        body: "Before anything else, they should know who you are — real comments, honest content over weeks, your actual product notes. Move on when: they engage back unprompted."
      },
      {
        n: "2",
        title: "Real conversation",
        goal: "Diagnose, don't pitch",
        body: "An actual exchange, driven by their curiosity, where you ask more than you tell. Move on when: they've named what they actually care about."
      },
      {
        n: "3",
        title: "Honest fit",
        goal: "Match — or honestly don't",
        body: "Only now connect what they told you to a specific product you've used, or the partner side — including \"honestly, this part isn't for you.\" Move on when: they ask a how-do-I-start question themselves."
      },
      {
        n: "4",
        title: "Their decision",
        goal: "Remove friction, apply zero pressure",
        body: "Answer the real question, point them to first access, and let them choose. A yes here is durable because they arrived at it themselves."
      }
    ],
    redlines: [
      {
        title: "No health claims",
        body: "Never say a Ringana product treats, cures, heals, or prevents anything — skincare or supplements. Share your own experience and published ingredient facts, never a medical promise."
      },
      {
        title: "No income promises",
        body: "Don't imply guaranteed or easy money, and don't dangle founding-partner timing as a payday. Talk about the work honestly."
      },
      {
        title: "Facts from Ringana only",
        body: "Every product detail, stat, or ingredient claim comes from Ringana's own materials. Unsure? \"Let me check.\" And it's \"no artificial preservatives,\" never a flat \"no preservatives.\""
      },
      {
        title: "No pressure, ever",
        body: "No fake urgency, no guilt, no chasing. Pre-launch there is genuinely nothing to rush. A no you respect today is a door open at launch."
      }
    ],
    closing: "Talk to people like you're telling a friend a secret — because if it's true, that's exactly what you're doing."
  },

  /* ── FAQs (Learn) — grouped, straight answers ── */
  faqGroups: [
    {
      id: "dates",
      title: "Dates & launch",
      blurb: "When doors open — partner side and customer side.",
      groveOnly: true,
      items: [
        {
          id: "launch_snapshot",
          q: "What's the U.S. launch snapshot?",
          a: "Current guidance for founding partners — it can still shift.\n\nPre-registration starts October 1. $0 to reserve your spot, no obligation. Business Booster fee expected to be waived in that October window. An optional Founder Pack at pre-registration is what unlocks double bonuses.\n\nFounder Packs: about $220 (~110 points), estimated around October 24. The only window we expect products at 30% off retail. Those points count in the first commission period — October and November together, paid in December. December is its own month.\n\nStay active with a personal order or a customer order once every 12 months.\n\nPartners purchase at retail and earn commission back on the Target they've hit — currently spoken of as 19% / 29% / 39%. Optional personal shop about $10/month (first 3 months free with Business Booster). Optional personalized customer discount code about $99.\n\nYou're not limited to the U.S. As markets open you can build there too; Canada is on the roadmap for 2027."
        },
        {
          id: "why_start_now",
          q: "Why start now?",
          a: "Momentum isn't created on launch day. It's created before.\n\nMany companies wait until people join — then everything hits at once: products, ingredients, systems, tech, relationships. We're doing the opposite.\n\nBy launch, the hope is you'll already understand what makes the products unique, why freshness matters, which products fit different goals, how The Fresh Grove operates, and who your leadership is. So day one feels like opening a door to a home you've already helped build — not drinking from a fire hose."
        },
        {
          id: "prereg",
          q: "What's the date for pre-registration?",
          a: "October 1, 2026. Pre-registration is $0 — it reserves your partner spot. No obligation. The Business Booster fee is expected to be waived if you pre-register in that October window."
        },
        {
          id: "client_launch",
          q: "What's the date for client launch?",
          a: "November 1, 2026 — that's when the U.S. shop is set to open for customers (product launch)."
        },
        {
          id: "first_period",
          q: "How does October count toward commissions?",
          a: "Partner pre-launch is October 1. You can pick an optional Founder Pack when you pre-register — that's what unlocks double bonuses.\n\nThe first commission period is October and November together. That combined statement pays out in December. December is its own month after that.\n\nCustomers still order November 1. October volume isn't sitting on the sidelines — it counts in that first Oct+Nov period, with November.\n\nEveryone in that first period is treated as a New Partner. It's a long first statement on purpose. There's a lot of room to qualify."
        },
        {
          id: "miami",
          q: "What's the Miami Fresh Experience?",
          a: "October 24, 2026. It's a founding gathering around launch — not the shop opening. Pre-reg is still October 1. Customers order November 1. Miami is its own thing."
        },
        {
          id: "dates_shift",
          q: "Could these dates still change?",
          a: "They could. If they do, we'll put it here."
        },
        {
          id: "miss_prereg",
          q: "What if I miss the October pre-registration window?",
          a: "You can still join. October is the $0 pre-reg window, and that's when the Business Booster fee is expected to be waived. After that, joining is still a thing — the waived-fee piece is the October part."
        },
        {
          id: "buy_before_launch",
          q: "Can customers order before November 1?",
          a: "Not in the U.S. shop. November 1 is when customers can order. Until then it's learn and get curious — nothing to rush-buy."
        }
      ]
    },
    {
      id: "joining",
      title: "Joining & packs",
      blurb: "What it costs to start, and what the packs actually are.",
      items: [
        {
          id: "enroll",
          groveOnly: true,
          q: "How do I enroll as a partner?",
          a: "On the Ringana site, with the link from your direct mentor. Customer account first, then upgrade to partner — that’s what keeps you on the right person and team.\n\nWe’ll make this simple: step-by-step for where to go, what to tap, and how to land on the right line. Launch day we’ll be on Zoom for most of the day — tech support, training, and a room that’s actually on.\n\nDon’t freelance a random signup link. Use the one from your person."
        },
        {
          id: "booster_vs_founder",
          groveOnly: true,
          q: "What's the difference between a Business Booster and a Founder Pack?",
          a: "Two different things.\n\nBusiness Booster is the partner onboarding fee — the “join as a partner” piece. If you pre-register in October, that fee is expected to be waived. It can also unlock things like the first three months of an optional personal shop for free, and it’s what puts you on the Start Bonus track.\n\nA Founder Pack is a product bundle for the USA launch, not the join fee. Buying one in October is what doubles Start Bonus for the whole four months."
        },
        {
          id: "founder_packs",
          groveOnly: true,
          q: "What are Founder Packs?",
          a: "Special starter packs for the USA launch. Details land in September. Pre-registered partners get first access — you can pick one or more than one. Estimated arrival around October 24.\n\nCurrent understanding: about $220 and about 110 product points. 110 Direct Turnover points is also the monthly bar for Target 1 / commission-qualified, which is why that number matters. This is the only window we expect to see products at 30% off retail.\n\nSelect the pack when you register. How and when payment happens is still with their tax advisors — not locked yet. They may let you add one after registration. That’s not confirmed. If you want Double Start Bonus, pick it at enrollment so you’re not waiting on a maybe."
        },
        {
          id: "cost_to_start",
          groveOnly: true,
          q: "How much does it cost to get started?",
          a: "Pre-registration on October 1 is $0. That's just your partner spot.\n\nA Founder Pack is optional — about $220. An optional personal shop is about $10/month (first three months free with Business Booster). An optional personalized customer discount code is about $99.\n\nYou don't have to buy everything on day one."
        },
        {
          id: "must_buy_pack",
          groveOnly: true,
          q: "Do I have to buy a Founder Pack?",
          a: "No. Pre-reg is $0. The pack is optional.\n\nStart Bonus comes with the Business Booster — everyone who enrolls in October is on that track. A Founder Pack is what doubles Start Bonus for the whole four months. If you want the double, select it when you register."
        },
        {
          id: "stay_active",
          q: "Do I have to order every month?",
          a: "No monthly autoship. Stay a partner with a personal order or a customer order once every 12 months. That's it."
        },
        {
          id: "need_shop",
          q: "Do I need my own shop or discount code?",
          a: "No. Customers can find you in the searchable database at checkout without a fancy URL. The personal shop (~$10/month) and personalized discount code (~$99) are extras if you want them."
        },
        {
          id: "customer_discount",
          q: "Do customers get a discount if they find me with partner search?",
          a: "No. Partner search just finds you. The discount is something you offer.\n\nYou can give a first-order discount with the 20-euro-equivalent voucher from the Starter Set Business Booster, or with a promo code. There are also 10-euro-equivalent vouchers you can buy to give on any order — those will be on ringana.com for American partners.\n\nSeasonal product discounts (10% or 20%) show up too. Those work for customers and partners."
        },
        {
          id: "after_prereg",
          groveOnly: true,
          q: "What happens after I pre-register?",
          a: "Your partner spot is reserved. That's what October 1 is for.\n\nThen you keep learning, talk to people, and decide later about a Founder Pack or anything optional. Pre-reg isn't a product order and it isn't a promise to build a team."
        }
      ]
    },
    {
      id: "products",
      title: "Products & ingredients",
      blurb: "Certs, freshness, and what's actually in the bottle.",
      items: [
        {
          id: "cosmos_usda",
          q: "What's the difference between COSMOS and USDA certified organic?",
          a: "Different badges, built for different things.\n\nUSDA Organic is the U.S. grocery seal — food and farms. A cosmetic only gets it if it meets those farm rules, which most skincare never will, even when the plants are clean. It wasn’t written for bottles of cream.\n\nCOSMOS is the European cosmetics standard. It looks at the whole formula: organic share, natural origin, how it's processed, what can't go in.\n\nAnd COSMOS isn’t one badge. Three different things get mixed up:\n\n• COSMOS Organic — the whole product is certified organic. That’s the seal on some FRESH formulas.\n• COSMOS Natural — the whole product is certified natural. Different bar, still a real seal.\n• Organic / natural ingredients — a formula can use plants from organic farming (the * on the INCI, or a % line) without the product itself carrying a COSMOS seal. ADDS boosters are a common example.\n\nOpen the product in Learn. Certified items show COSMOS Organic or COSMOS Natural near the top — tap the chip to read what that seal means. If a formula uses organic ingredients without that badge, you’ll see that on the product. Tap it to learn more.\n\nIf someone asks “is it USDA Organic?”\n\nThe USDA Organic seal is really meant for food and farms — it wasn’t created for personal care products. Ringana certifies their organic ingredients and products through COSMOS, the European cosmetics standard."
        },
        {
          id: "vegan_testing",
          q: "Are the products vegan? Tested on animals?",
          a: "The fresh range is vegan. They don't test on animals. Open the product in Learn if you want it for that specific item."
        },
        {
          id: "upcycled",
          q: "What are the upcycled ingredients?",
          a: "Leftovers given a second life — fruit seeds, apple peel, sea buckthorn, and an eye-contour plankton extract. The plant already existed; they put it to work instead of throwing it away.\n\nOpen the product if someone wants the example on the pack — those pages have a short note. Why Ringana → Sustainability has the named list."
        },
        {
          id: "short_dates",
          q: "Why do the products expire like food?",
          a: "On purpose. It expires because they didn't load it with long-shelf synthetic preservatives so it could sit in a warehouse for years. Made to order, used while it's fresh — the date is the proof, not the problem."
        },
        {
          id: "made_where",
          q: "Where are the products made?",
          a: "Austria. The Fresh Factory is in St. Johann in der Haide. They're building U.S. production too, in Virginia — freshness is the point of making it close to the people who ordered it."
        },
        {
          id: "pregnancy_sensitive",
          q: "Is this safe for pregnancy, sensitive skin, or kids?",
          a: "Look up that product in Learn first, then pass along what actually applies — ingredients, how it's used, what's on the page. Don't guess.\n\nIf you have specific questions, I'd encourage you to ask your provider since I can't give medical advice."
        },
        {
          id: "expensive",
          q: "Why does it cost more than drugstore / \"regular\" skincare?",
          a: "It's not cheap, and we don't pretend it is.\n\nYou're paying for small-batch, made-to-order, actives at full strength — not a formula built to survive three years on a shelf. Different product, different price.\n\nIf now isn't the time, that's a complete answer."
        },
        {
          id: "start_with",
          q: "What should someone start with?",
          a: "One thing they'll actually feel — not a catalog.\n\nAsk what their skin does day to day, then point to one product. Hydro serum is a common first love around here, but match the person, not the bestseller.\n\nIf you haven't used that one yet, say so."
        },
        {
          id: "tried_yet",
          groveOnly: true,
          q: "Have you actually used them? Can we get products now?",
          a: "Customers order November 1. Until the U.S. shop is open, a lot of us are still waiting on shipping — and that's fine to say out loud.\n\nIf you've used something (Europe, a gathering, a sample), talk about what you felt. If you haven't: friends' excitement is okay. Inventing results is not."
        },
        {
          id: "points_chart",
          q: "When will the USA product points chart be available?",
          a: "September 2026. Points will be almost the same as Europe and the other markets in the Americas — you can look there in the meantime."
        },
        {
          id: "points_checkout",
          q: "Can I see product points on the website?",
          a: "Yes — at checkout, when you're logged in as a partner. Customers don't see points."
        }
      ]
    },
    {
      id: "business",
      title: "The business",
      blurb: "Model, money, and whether you have to build a team.",
      items: [
        {
          id: "mlm",
          q: "Is this an MLM / pyramid scheme?",
          a: "It's a hybrid affiliate model — products through people, not store shelves. Fair question.\n\nMost people just buy the products and never sell a thing. That's completely normal.\n\nPyramid schemes pay you to recruit. This is built around real products and customer sales — Ringana pays on product, and you can out-earn the person who introduced you. Call it whatever you want. The thing that matters is whether people actually want the products again."
        },
        {
          id: "build_team",
          q: "Do I have to build a team?",
          a: "Nope. Use the products, share them with friends, or build a business if you want to. There's no one right way.\n\nYou can build a customer business. You can build a team. Or both."
        },
        {
          id: "recruiting",
          q: "Is this just about recruiting people?",
          a: "No. You can go all the way to Target 10 on personal sales if that’s your lane. Customer turnover still matters for builders — leadership Targets want real customer volume alongside team.\n\nThe goal isn’t adding names. It’s real customers and real leadership."
        },
        {
          id: "out_earn",
          q: "What makes the business model different?",
          a: "Everyone starts even. Your income isn't capped by who introduced you — you can outgrow and out-earn your sponsor. That's what mentorship should look like."
        },
        {
          id: "income",
          q: "How much can I make?",
          a: "Nobody honest will quote you a monthly check. It reflects real customers and a real team — not a screenshot.\n\nPartners buy at retail and earn commission back on the Target they've actually hit."
        },
        {
          id: "international",
          q: "Can I only build in the U.S.?",
          a: "You're not stuck in the U.S. Ringana's already in Europe, and as markets open you can build there too. Canada is on the roadmap for 2027."
        }
      ]
    },
    {
      id: "plan",
      title: "Pay & the plan",
      blurb: "How you qualify, how you earn, and what you don't have to do.",
      items: [
        {
          id: "partner_benefits",
          q: "What are the benefits of being a partner?",
          groveOnly: true,
          a: "You can earn by recommending products and/or building an organization. The plan has several pieces:\n\n• Commission on your own purchases and your customers’\n• Team commissions as you build\n• Generation commissions as you advance\n• Start Bonuses for qualifying new partners — strongest early\n• Growth Bonuses at higher Targets\n• Beyond Target 10 bonuses for qualifying leaders\n\nYou also get Ringana’s partner tools and education — plus what we’re building inside Fresh Grove."
        },
        {
          id: "start_bonus",
          q: "What is the Start Bonus?",
          a: "A four-month boost for building momentum early. In your first four statement months, the bar climbs: Target level plus, later, personally enrolled active partners.\n\nMonth 1 → Target 1\nMonth 2 → Target 2\nMonth 3 → Target 3 + 1 personally enrolled active partner\nMonth 4 → Target 4 + 2 personally enrolled active partners\n\nHit the bar for that month and Ringana adds a Start Bonus on top of regular commission. You get the highest level you cleared that month — two Targets in one month doesn't mean two bonuses. Hit that same Target again in a later month and it pays again. Four months at Target 4 is $2,200 × 4. The published Start Bonus ends there.\n\nFor the USA launch, the first commission period is October and November together, paid in December. December is its own month.\n\nA Founder Pack isn't required for the track. Buying one at October 1 pre-registration is what doubles Start Bonus for all four months.\n\nFrom Target 5, it isn't Start Bonus anymore — it's a separate high-performer agreement, by invite. Ask your leader if you're heading there.\n\nTiming nuance: a brand-new partner usually counts the month after you enroll them, not the month you do. The compensation plan walkthrough has the full picture."
        },
        {
          id: "paid_on_purchases",
          q: "Do I earn commission on my own orders — including a Founder Pack?",
          a: "Yes. Anything that generates product points is commissionable — your orders and your customers' orders. A Founder Pack has points, so it pays.\n\nYour team's personal purchases are Team Volume. Those pay on the generation percentage for where that person sits.\n\nThe exception is things bought as samples for events — cheaper, and they don't carry point volume, so they don't pay commission."
        },
        {
          id: "tg3_tg4",
          q: "How do the two tracks work for Target 3 and Target 4?",
          a: "Target 3 can go either way:\n• DT of at least 330 and TT-1 of at least 1,600\n• or DT of at least 825 on its own\n\nTarget 4 is one path: CT of at least 330 and TT-1 of at least 3,200. TT-1 is required there.\n\nThe system gives you whichever condition is better for you. TT-1 is only the qualification check. Once you qualify, commission is calculated from your total DT and TT — a little team volume doesn't cancel your DT. It just sits in the total."
        },
        {
          id: "points_rollover",
          q: "If I have fewer than 110 points in a month, do they roll over?",
          a: "No. Every statement month starts at zero. Points don't carry."
        },
        {
          id: "how_high",
          q: "How high does the compensation plan go?",
          a: "Ten Target Levels — and Target 10 isn’t the ceiling. There’s a Beyond Target 10 Bonus for qualifying Target 10 leaders who keep growing large organizations."
        },
        {
          id: "inventory",
          q: "Do I have to carry inventory?",
          a: "No. Customers order on the website. You don’t stock a garage. These are freshly made on purpose — they aren’t built for long warehouse shelf lives."
        },
        {
          id: "commission_bar",
          q: "Do I have to personally buy or sell a huge amount every month?",
          a: "No. To be commission-qualified in a statement month, you need 110 Direct Turnover product points. That’s your customer points plus your personal points.\n\nStaying a partner is a different bar: one personal or customer order every 12 months."
        },
        {
          id: "personal_dt",
          q: "How much can I earn on my own customer business?",
          a: "Direct Turnover commission starts at:\n\nTarget 1 → 19% on personally purchased/sold points once you hit 110+\nTarget 2 → 29% on all personally purchased/sold points\nTargets 3–10 → 39% on all personally purchased/sold points\n\nYes — there’s a real path through your own customers."
        }
      ]
    },
    {
      id: "company",
      title: "The company",
      blurb: "Who Ringana is, and why this hub exists.",
      items: [
        {
          id: "what_is",
          q: "What even is Ringana?",
          a: "An Austrian wellness company — almost 30 years, 37 markets. Fresh skincare, supplements, and nutrition, with a huge focus on ingredient quality, making as much as they can in-house, and not cutting corners."
        },
        {
          id: "markets",
          q: "Which markets is Ringana already in?",
          a: "Thirty-seven markets before the U.S. — countries across Europe, plus Hong Kong and Latin America. The U.S. is next. Canada is on the roadmap for 2027.\n\nEurope\n🇦🇹 Austria\n🇧🇪 Belgium\n🇧🇬 Bulgaria\n🇭🇷 Croatia\n🇨🇾 Cyprus\n🇨🇿 Czech Republic\n🇩🇰 Denmark\n🇪🇪 Estonia\n🇫🇮 Finland\n🇫🇷 France\n🇩🇪 Germany\n🇬🇷 Greece\n🇭🇺 Hungary\n🇮🇪 Ireland\n🇮🇹 Italy\n🇱🇻 Latvia\n🇱🇮 Liechtenstein\n🇱🇹 Lithuania\n🇱🇺 Luxembourg\n🇲🇹 Malta\n🇲🇨 Monaco\n🇳🇱 Netherlands\n🇵🇱 Poland\n🇵🇹 Portugal\n🇷🇴 Romania\n🇸🇰 Slovakia\n🇸🇮 Slovenia\n🇪🇸 Spain\n🇸🇪 Sweden\n🇨🇭 Switzerland\n🇬🇧 United Kingdom\n🇹🇷 Turkey\n\nHong Kong\n🇭🇰 Hong Kong\n\nLatin America\n🇲🇽 Mexico\n🇨🇴 Colombia\n🇵🇪 Peru\n🇦🇷 Argentina"
        },
        {
          id: "why_unheard",
          q: "Why haven't I heard of it?",
          a: "Because it hasn't been here. They've been in Europe for decades and are just opening in the U.S. We're watching that happen in real time."
        },
        {
          id: "what_different",
          q: "What makes Ringana different?",
          a: "It's the combination. Fresh production. Thoughtful formulas. Sustainability. Transparency. Almost 30 years. None of those are unique by themselves. All of them together is."
        },
        {
          id: "why_adding",
          q: "Why are you adding this?",
          a: "One company doesn't have to do everything. A lot of us have been sharing products we believe in for years. This is another line that cleared the bar — more ways to serve people who already trust you. Same mission, bigger toolbox."
        },
        {
          id: "official",
          groveOnly: true,
          q: "Is First Seeds an official Ringana app?",
          a: "No. First Seeds is a Fresh Grove team resource — not a Ringana corporate app. It's for people already walking with this team, not a public ad."
        }
      ]
    },
    {
      id: "leaders",
      title: "Leader FAQs",
      blurb: "How to talk about the plan with your team. Not for sharing outside this circle.",
      leaderOnly: true,
      items: [
        {
          id: "strongest_cap",
          q: "Is the strongest-leg limit a cap on the points I get paid on?",
          a: "Yes — but it's a cap on commission points, after the generation percentages run. Not a cap on sales volume.\n\nIt applies from Target 1 through Target 7. From Target 8 (leader status) there is no cap.\n\nCustomer Turnover is never under it. Your own DT isn't under it. Other teams aren't under it.\n\nIt exists so a business with only one strong team still gets a commission that makes sense — not a giant check sitting on a single line. The way around it is width, not just depth."
        },
        {
          id: "cap_tg8",
          q: "Does the 7,000 cap keep going at Targets 8–10?",
          a: "No. Target 8 and up is leader status, and the strongest-leg cap does not apply there. 7,000 is the Target 7 ceiling. It doesn't carry."
        },
        {
          id: "tt_generational",
          q: "Are we paid on what's left after each leader up the line takes their share?",
          a: "No — that's differential, and this plan isn't. Team turnover is generational.\n\nYou get a set percentage based on which generation that person is from you. The person above you gets their percentage based on which generation that same person is from them. Nobody is paid “the remainder” after you.\n\nA first-line partner is your first generation (at Target 1 that's 8% of their team turnover). To the mentor above you, that same partner is a later generation — and they're paid that generation's rate, not what's left of yours."
        },
        {
          id: "high_performer",
          q: "Will Start Bonus still be honored at Targets 5–10 in the USA?",
          a: "Not as Start Bonus. The published Start Bonus ends at Target 4. Anyone heading for Target 5 or above may be offered a private high-performer agreement — by invite, a separate legal contract.\n\nMaximum eight months in total: four Start Bonus months plus up to four extra high-performer months."
        }
      ]
    }
  ]
};

/* Helpers for rotating calendar drafts */
window.FS.ContentPick = {
  hash: function (str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i) | 0;
    return Math.abs(h);
  },
  from: function (arr, key) {
    if (!arr || !arr.length) return null;
    return arr[this.hash(String(key)) % arr.length];
  },
  draftForType: function (type, dateKey, rootsData) {
    var C = window.FS.CONTENT;
    var why = (rootsData && rootsData.why || "").trim();
    var moment = (rootsData && rootsData.moment || "").trim();

    if (type === "reactive") {
      return "No post required today. Reply to comments, check messages, or live your life. Consistency includes rest.";
    }
    if (type === "product_curious") {
      var spark = this.from(C.productSparks, dateKey + "-spark");
      return spark ? spark.body : "I'm so curious if you've ever used a product like this…";
    }
    if (type === "soft_door") {
      var door = this.from(C.curiosity, dateKey + "-door");
      return door ? door.body : "";
    }
    if (type === "open_loop") {
      if (moment || why) {
        var base = moment || why;
        return (base.length > 180 ? base.slice(0, 180) + "…" : base) + " — more on this soon.";
      }
      var loop = this.from(C.openLoops, dateKey + "-loop");
      if (!loop) return "";
      return typeof loop === "string" ? loop : (loop.body || "");
    }
    if (type === "curtain") {
      var fact = this.from(C.funFacts, dateKey + "-fact");
      var prod = this.from(C.productStory.posts, dateKey + "-prod");
      /* Alternate fact vs product story by day hash */
      if (this.hash(dateKey) % 2 === 0 && fact) {
        return "A company fact I’m sitting with…\n\n" + fact.body;
      }
      return prod ? prod.body : "";
    }
    if (type === "honest_note") {
      var note = this.from(C.productStory.posts, dateKey + "-note");
      return note ? note.body : "Honest note: I'm still early — sharing what I notice as I go, not a highlight reel.";
    }
    if (type === "values_flag") {
      if (why) {
        return "Something I care about: " + (why.length > 160 ? why.slice(0, 160) + "…" : why);
      }
      var pillar = this.from(C.pillars, dateKey + "-pillar");
      return pillar ? (pillar.icon + " " + pillar.title + "\n\n" + pillar.body) : "";
    }
    return "Write something true and specific today.";
  },
  alternativesForType: function (type) {
    var C = window.FS.CONTENT;
    if (type === "product_curious") {
      return (C.productSparks || []).map(function (x) {
        return { id: x.id, title: x.title, body: x.body };
      });
    }
    if (type === "soft_door") return C.curiosity.map(function (x) { return { id: x.id, title: x.title, body: x.body }; });
    if (type === "open_loop") {
      return (C.openLoops || []).map(function (b, i) {
        if (typeof b === "string") return { id: "loop_" + i, title: "Curiosity " + (i + 1), body: b };
        return { id: "loop_" + i, title: b.title || ("Curiosity " + (i + 1)), body: b.body || "" };
      });
    }
    if (type === "curtain" || type === "honest_note") {
      var list = C.productStory.posts.map(function (p) { return { id: p.id, title: p.title, body: p.body }; });
      C.funFacts.forEach(function (f) {
        list.push({ id: "fact_" + f.id, title: "Company fact: " + f.title, body: "A company fact I’m sitting with…\n\n" + f.body });
      });
      return list;
    }
    if (type === "values_flag") {
      return C.pillars.map(function (p) {
        return { id: p.id, title: p.title, body: p.icon + " " + p.title + "\n\n" + p.body };
      });
    }
    return [];
  }
};
