/* ═══════════════════════════════════════════════════════════
   FIRST SEEDS — CONFIG
   Leader-editable. Voice: Ringana-coded — fresh, clear, calm.
   Clarity over hype. Education over scripts.
   ═══════════════════════════════════════════════════════════ */

window.FS = window.FS || {};

/* Quiet breadcrumb for sync/SW/auth failures — console + last 30 in localStorage.
   Does not show a toast; progress sync still uses the existing banner. */
/* Unique cabinet doors stay put until the customer cabinet opens Nov 1. */
window.FS.uniqueClientDoorsOn = function () {
  return Date.now() >= Date.parse("2026-11-01T08:00:00-07:00");
};

window.FS.shelfSalesOn = function () {
  return Date.now() >= Date.parse("2026-11-01T08:00:00-07:00");
};

window.FS.reportError = function (context, err) {
  var msg = "";
  try { msg = err && err.message ? String(err.message) : String(err || ""); } catch (e0) {}
  try { console.warn("[First Seeds]", context || "error", err); } catch (e1) {}
  try {
    var raw = localStorage.getItem("fsErrLog");
    var list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    list.unshift({ at: Date.now(), context: String(context || ""), message: msg.slice(0, 240) });
    localStorage.setItem("fsErrLog", JSON.stringify(list.slice(0, 30)));
  } catch (e2) {}
};

window.FS.CONFIG = {

  teamName: "THE FRESH GROVE",
  teamDisplayName: "The Fresh Grove",

  tagline: "Fresh products. Clear facts. Laying solid roots before launch.",

  preRegDate:  { month: 10, day: 1, label: "Pre-Reg Opens" },
  launchDate:  { month: 11, day: 1, label: "Products Launch" },
  miamiDate:   { month: 10, day: 24, label: "Miami Fresh Experience" },
  seasonYear: 2026,

  signoff: "— with you in The Fresh Grove 🌱",

  groveSiteUrl: "https://thefreshgrove.team/",
  evergreenSiteUrl: "https://app.evergreenco.team/",
  /* Pretty Grove door hops onto /hub/ on thefreshgrove.team.
     Evergreen lives on app.evergreenco.team. No cross-host hops. */
  groveJoinUrl: "https://thefreshgrove.team/join.html",
  groveLeadUrl: "https://thefreshgrove.team/lead.html",
  groveQuizUrl: "https://quiz.thefreshgrove.team/",
  groveCatalogUrl: "https://thefreshgrove.team/thefreshcatalog",

  /* Personal landing pages that dual-write into the Leads inbox.
     Keyed by lead_slug. Only these people see the share-link toggle. */
  customLeadPages: {
    taylor: "https://tayrourke.github.io/tay-goes-fresh/",
    brittany: "https://go-evergreen.github.io/ringana-with-brittany/",
    kassidy: "https://go-evergreen.github.io/ringana-with-kassidy/",
    "kelly-amorose": "https://go-evergreen.github.io/ringana-with-kelly/",
    kim: "https://go-evergreen.github.io/ringana-with-kim/",
    meghan: "https://go-evergreen.github.io/ringana-with-the-smallwoods/",
    tania: "https://go-evergreen.github.io/ringana-with-tania/",
    "kim-huck": "https://go-evergreen.github.io/ringana-with-kimberly/"
  },

  modes: {
    starter: {
      label: "Soft start",
      badge: "Soft start",
      tag: "Essentials",
      desc: "Five calm steps: your story, products that feel like you, a simple page to share, who you'd tell first, and a clear finish. Calendar and Grove (your live team) unlock on All in. Your join link is in Settings either way."
    },
    full: {
      label: "All in",
      badge: "All in",
      tag: "Everything",
      desc: "Everything in Soft start, plus Calendar (Grove Gatherings, Info Zooms, posts, vault, photos), Post Studio, Grow Your Grove, and an optional dream-tree sketch on Map Your Grove — all the way to launch."
    }
  },

  /* Plain-language names used across the hub */
  terms: [
    {
      term: "Growth",
      def: "The percentage on Sprout. It shows how many checklist steps you've finished — real prep done, not how loud you've been online."
    },
    {
      term: "Runway",
      def: "Your step-by-step prep path on Sprout. Soft start is the shorter path; All in unlocks Calendar, Post Studio, Grow Your Grove, and an optional dream-tree sketch on Map Your Grove."
    },
    {
      term: "Pick Your First Few",
      def: "A Soft start step after Roots: favorite a few products you’re looking forward to, and open Talking fresh — so your story has real product knowledge behind it."
    },
    {
      term: "Roots",
      def: "The three story questions that start everything — why you're here, a moment that mattered, and what made you say yes."
    },
    {
      term: "Grow Your Grove",
      def: "The All in home for live partners in First Seeds — Copy my link to join, who’s moving, How I Grow, and who needs a check-in. Bottom nav shortens it to Grove, or it lives as the tree next to Messages."
    },
    {
      term: "Grove",
      def: "Two close meanings: on Sprout, Map Your Grove is your people list (customers first, optional dream tree if you're building). Grow Your Grove is your live Fresh Grove partners — from the Grove tab, or the tree next to Messages."
    },
    {
      term: "Customers",
      def: "On Map Your Grove, people who'd care about the products even if business talk isn't their thing."
    },
    {
      term: "Clients",
      def: "Your desk for people who are interested or already shopping with you — connection and messages. Different from Leads (inbox for people who filled out your page) and from Grove (partners)."
    },
    {
      term: "Leads",
      def: "Your page people open. They leave a name and how to reach them, and whether they care about products, business, or both. Entries land only in your inbox — different from your team join link."
    },
    {
      term: "Learn the products",
      def: "A searchable product library inside Learn — skincare, body, hair, baby, and supplements."
    },
    {
      term: "Post vault",
      def: "Suggested feed posts with hooks, slides, and captions. Each card has Type (Carousel/Reel/Story…) and Promoting (product, values, business…)."
    },
    {
      term: "Calendar",
      def: "Team moments (Grove Gatherings, Info Zooms, milestones) plus your posts, This week, Post vault, and photos. Plan here."
    },
    {
      term: "Talking fresh",
      def: "A conversation guide inside Learn — what to say when someone comments, objects, goes quiet, or asks about partnering."
    },
    {
      term: "Learn",
      def: "Why Ringana, U.S. launch facts, the product library, and Talking fresh for when someone asks. Clarity over hype."
    },
    {
      term: "Messages",
      def: "The 💬 next to Settings — it opens What’s new. Cheers, notes, grove messages, and polls land here, plus announcements for the whole grove. Available on Soft start too."
    },
    {
      term: "Grove Leader",
      def: "Someone named to help tend The Fresh Grove — they can rearrange the tree, send a grove-wide message, and open Grove Leaders in Learn. Different from “your leader,” which is the person who invited you."
    },
    {
      term: "Founding circle",
      def: "People committed to joining The Fresh Grove at the official Ringana USA launch — and anyone who's already expressed interest in partnering with you on this mission."
    },
    {
      term: "First Seeds",
      def: "This hub. A Fresh Grove team prep resource — not an official Ringana corporate product. Details can still shift as launch firms up."
    }
  ],

  onboarding: {
    welcomeEyebrow: "The Fresh Grove · founding season",
    welcomeTitle: "We get to build this together.",
    welcomeBody: "We're so excited you're here — truly. First Seeds is where The Fresh Grove prepares for Ringana USA as a community, not a crowd of strangers doing checklists alone.\n\nYou'll get clear facts, space for your real story, and a place to gather people who might walk this mission with you. Calm prep. Shared energy. Launch that feels like arriving with people you trust.",
    welcomeCta: "Let's plant something →",

    circleEyebrow: "Before we dig in",
    circleTitle: "This hub is for our circle.",
    circleBody: "First Seeds isn't only for you — it's also for the people who want to partner with you in sharing this mission.\n\nPlease don't share or post the link as a public link. And please don't share it with anyone who hasn't already expressed interest in the business. We're building something intentional, and that energy matters.",
    circleNote: "First Seeds is a Fresh Grove team resource — not something published by Ringana corporate. Launch details here can still shift as the company firms things up.",
    circleCta: "I'm in — let's grow →",

    nameEyebrow: "Nice to meet you",
    nameTitle: "What should we call you?",
    nameHint: "First + last name — so your leader can tell partners apart when a few share a first name.",
    namePlaceholder: "Your first name",
    lastNamePlaceholder: "Your last name",
    nameCta: "That's me →",
    hypeLine: "Pre-registration opens October 1. Prep season is right now — and you're already in it.",

    authEyebrow: "Your account",
    authTitle: "Create an account to continue",
    authBody: "First Seeds needs an account so your progress syncs, your leader can support you, and nothing disappears if you switch phones. New here? Create an account. Already started? Sign in with the same email — a second account will not show your old leads.",
    authCta: "Sign in →",
    authCreate: "Create account →",
    authHint: "An account is required — there’s no guest path from here.",

    installEyebrow: "One important step",
    installTitle: "Add First Seeds to your Home Screen",
    installLead: "You're in the browser right now. Add the Home Screen icon from this window, then close this page and open First Seeds from that new icon. That's where you'll type your name — and how your invite stays attached.",
    installCta: "Continue →",
    installOpenCta: "I'll open it from Home Screen →",
    installSkip: "I'll add it on my phone later",
    installConfirm: "The First Seeds icon is on my Home Screen",
    installLeave: "Nice. Close this page now, then open First Seeds from your new Home Screen icon. That's where you'll type your name.",
    installSwitchNote: "Close this page and open First Seeds from your new Home Screen icon. That's where you'll type your name.",

    modeEyebrow: "Your path",
    modeTitle: "How much do you want on your plate?",
    modeLead: "No wrong answer. Start light or go all in — you can switch anytime in Settings.",

    notifyEyebrow: "Stay in the loop",
    notifyTitle: "Want a ping when something happens?",
    notifyBody: "We’ll ping you for grove joins, cheers, notes, How I Grow, leads, grove messages, Grove Gatherings, and what’s on your calendar today. You can pick which ones in Settings.",
    notifyNote: "You can turn any of these on or off later in Settings — including Level 1 joins vs anyone in your tree."
  },

  tour: [
    {
      title: "Sprout is your home base",
      body: "Here you’ll see a little plant with a Growth %. Your answers to the three Roots questions grow the roots underground — then every checklist step you finish sprouts the plant above. No pressure to finish everything today.",
      panel: "welcome",
      target: ".home-plant-zone",
      placement: "below"
    },
    {
      title: "Checklists are your map",
      body: "Each section has a short list of real prep steps. Clear a box, watch the plant catch up. Visiting a page doesn't count — finishing a step does.",
      panel: "welcome",
      target: ".home-runway",
      placement: "above"
    },
    {
      title: "When someone asks, open Learn",
      body: "Why Ringana, launch dates, the product library, and Talking fresh (how to handle the real moments) live under Learn. Clear facts first — so you never have to guess or dig.",
      panel: "welcome",
      target: '#bottomNav [data-tab="know"]',
      placement: "above"
    },
    {
      title: "Messages lives up top",
      body: "The 💬 next to Settings opens What’s new. Cheers, notes, grove messages, and polls land here — plus announcements for the whole grove. If someone who sits under you fills out How I Grow, their support map lands here too. It’s there on Soft start too.",
      panel: "welcome",
      target: "#groveBoardNavBtn",
      placement: "below"
    },
    {
      title: "Clients connects to The Fresh Shelf",
      body: "Clients is your side. The Fresh Shelf is our exclusive client app. When products launch it’ll be for our clients, but right now it’s a spot for people interested in the products.",
      panel: "welcome",
      target: '#bottomNav [data-tab="customers"]',
      placement: "above",
      shelfCustomersOnly: true
    },
    {
      title: "Calendar is for gatherings and posts",
      body: "Grove Gatherings, Info Zooms, replays, and a vault of post ideas live here. Come back when you want a gathering, a replay, or something to share.",
      panel: "welcome",
      target: '#bottomNav [data-tab="content"]',
      placement: "above",
      fullOnly: true
    },
    {
      title: "This is where you grow your own grove",
      body: "Grove is your live team home. Copy my link to join is the flower up top — when they sign in with it, they’re on your tree. You’ll see who’s moving, How I Grow, and you can cheer them on.",
      panel: "welcome",
      target: '#bottomNav [data-tab="team"]',
      placement: "above",
      revealGroveTab: true,
      fullOnly: true
    },
    {
      title: "Start on Sprout",
      body: "Sprout is where you’ll build a solid foundation for your business — and it’s the best place to begin. It walks you through the app in a specific order so nothing important gets skipped.\n\nFeel free to explore before you finish every Sprout step, though. A few spots you might peek at: the product guide in Learn, the Leads tab, and Messages (💬) up top. Your join link is already in Settings → Sharing. Calendar and Grove (your live team) unlock on All in anytime in Settings.",
      panel: "welcome",
      target: '#bottomNav [data-tab="home"]',
      placement: "above",
      starterOnly: true
    },
    {
      title: "Start on Sprout",
      body: "Sprout is where you’ll build a solid foundation for your business — and it’s the best place to begin. It walks you through the app in a specific order so nothing important gets skipped.\n\nFeel free to explore before you finish every Sprout step, though. Calendar, Learn, Leads, and Messages (💬) up top are one tap away when you want them.",
      panel: "welcome",
      target: '#bottomNav [data-tab="home"]',
      placement: "above",
      fullOnly: true
    }
  ],

  /* Hook bank mirrors CONTENT.openLoops — kept here so leaders can edit without touching content.js */
  hookBank: null,

  /* Warm DM options — partners pick one and rewrite until it sounds like them */
  dmStarters: [
    {
      label: "Curious + excited",
      text: "Hey! Random but I've been meaning to reach out — I've been diving deep into something new the last few months and you came to mind as someone who'd actually get it! A fresh-made skincare + supplement line out of Austria is launching in the US and it's looking like it's going to be huge. Their ingredient standards are insane. Can I tell you a little about it?"
    },
    {
      label: "Personal + early",
      text: "Okay you're one of maybe ten people I'm reaching out to personally about this because it's still soooo new… there's an Austrian brand, made-fresh skincare and supplements, coming to the US for the first time. I wanted you to hear it from me and not a random message from a stranger haha. Can I share a little bit about the company?! I can't believe after 30 years they're still family owned and operated with nooo investors!"
    },
    {
      label: "Thoughtful researcher",
      text: "Hey! So you know I don't jump on things lightly but I've been quietly researching a line called Ringana for a few months — fresh-made, no synthetic preservatives, with actual clinical data behind it. It's launching in the US soon and I'm building a little founding community around it. Thought of you. Want the rundown?"
    },
    {
      label: "Short + direct",
      text: "Hi! I'll keep this short — I'm putting together a small group of people to walk into a US product launch with me (fresh-made Austrian skincare, body care, and supplements that have been around 30 years in Europe). Any interest?"
    }
  ],

  coldOutreach: {
    tag: "COLD MESSAGE TRAINING · DON'T SPAM",
    body: "<strong>Warm first. Always.</strong> Your first five should be people who'd be a little hurt if you <em>didn't</em> tell them — not strangers, not everyone in your phone, not that one mutual who hasn't texted you in three years.<br><br><strong>Never copy-paste the same DM to a list.</strong> Change at least one personal detail every time (why them, how you know them, what made you think of them). Identical blasts get ignored — and they make you look like a bot.<br><br><strong>Cold = slower + shorter.</strong> If you barely know them: one soft line, ask permission, stop. No \"it's going to be huge,\" no product dump, no follow-up the next day. One ask. If they don't reply, leave it.<br><br><strong>Quality over volume.</strong> Ten thoughtful texts beat fifty spray-and-pray messages. Your grove is not a funnel."
  },

  pageOptions: {
    generic: {
      title: "First Seeds lead page (in-app)",
      desc: "Built into this app — claim a short link to share with interested people. Their info lands in your inbox. No extra tools needed."
    },
    custom: {
      title: "A custom-built landing page",
      desc: "Connect with your Fresh Grove leader for more info."
    }
  },

  rhythms: [
    { label: "Monday — share one true piece of my why (no product pitch)", day: 1, icon: "📖", short: "Story" },
    { label: "Wednesday — one honest note on something I'm learning or trying", day: 3, icon: "🧴", short: "Product" },
    { label: "Friday — something real about this prep season", day: 5, icon: "✨", short: "Moment" },
    { label: "Sunday — soft check-in (\"want me to share what I've been learning?\")", day: 0, icon: "💌", short: "Invite" },
    { label: "I'll check in with The Fresh Grove once a week", day: -1, icon: "🌳", short: "" },
    { label: "I'll message one person from my grove list each week", day: -1, icon: "💬", short: "" }
  ],

  nudges: [
    {
      id: "silent_week",
      when: "Quiet for a week+",
      match: function (ctx) { return ctx.daysSinceActive >= 7 && ctx.sectionsDone < ctx.sectionTotal; },
      body: "Thinking of you, {name}. Life gets busy — First Seeds will be right where you left it. One tiny answer is enough. Here if you want company on a module."
    },
    {
      id: "no_roots_stalled",
      when: "Joined, still on Roots after several days",
      match: function (ctx) {
        return !ctx.done.roots && (ctx.daysSinceJoined >= 5 || ctx.daysSinceActive >= 5);
      },
      body: "Hey {name} — no rush at all. When you have 10 quiet minutes, the three Roots questions are just your story in your words. That's the whole first step 🌱 I'm here if you want company."
    },
    {
      id: "stuck_grove",
      when: "Finished Ground, quiet on Grove",
      match: function (ctx) {
        return ctx.done.ground && !ctx.done.grove && ctx.daysSinceActive >= 5;
      },
      body: "Hey {name} — your page draft's in. Next is Map Your Grove whenever you're ready: list people who'd love the products, then tap a few first chats. Sketch a dream tree if you're building. No pressure."
    }
  ],

  /* Supportive check-ins for people who are new or still moving — not "nudge" tone */
  supports: [
    {
      id: "welcome",
      when: "Just getting started",
      match: function (ctx) {
        return ctx.daysSinceJoined <= 2 || (ctx.sectionsDone === 0 && ctx.daysSinceActive <= 1);
      },
      body: "Hey {name} — so glad you're here. No rush at all. Explore First Seeds at your pace — I'm around if you want a hand 🌱"
    },
    {
      id: "active_today",
      when: "Active today",
      match: function (ctx) { return ctx.daysSinceActive === 0; },
      body: "Hey {name} — saw you in First Seeds today. That quiet showing-up counts. Here if you want company on anything 🌳"
    },
    {
      id: "roots_soft",
      when: "Settling into Roots",
      match: function (ctx) { return !ctx.done.roots; },
      body: "Hey {name} — loving that you're in. The Roots questions are just getting your story down in your words — whenever you're ready 💚"
    },
    {
      id: "making_progress",
      when: "Making progress",
      match: function (ctx) { return ctx.sectionsDone >= 1 && ctx.sectionsDone < ctx.sectionTotal; },
      body: "Hey {name} — you're moving through this beautifully. Keep going at your pace — proud of you for showing up."
    },
    {
      id: "blooming",
      when: "Almost there — cheer",
      match: function (ctx) { return ctx.sectionsDone >= Math.max(3, ctx.sectionTotal - 1); },
      body: "Look at you, {name}. You've done the quiet prep most people skip. Proud of you — keep learning at your pace 🌳"
    }
  ],

  cheerTemplates: [
    "I see you showing up — that matters more than perfect posts.",
    "Root by root. You're doing the real work.",
    "Proud of you. Clarity over hype — keep going at your pace.",
    "Your prep is showing. Soft and steady still counts as progress.",
    "Someone out there is going to feel safer because you learned this carefully.",
    "No rush to be loud — keep planting what feels true.",
    "I'm cheering for the quiet work you're doing behind the scenes."
  ],

  /* Coachmarks the first time someone appears on Team */
  teamTourVersion: 14,
  teamTour: [
    {
      title: "Your unique team link",
      body: "Share this anytime from Copy my link to join up top. When someone signs in with your link, they’re linked to you in First Seeds — that’s how your live team tree starts.",
      panel: "leader",
      target: '[data-team-tour="invite"]',
      placement: "below"
    },
    {
      title: "Your support, too",
      body: "This little band is for you — who invited you, and How I Grow if you haven’t shared your support map yet. Your partners get the same reminder on Grove.",
      panel: "leader",
      target: '[data-team-tour="support-band"]',
      placement: "below",
      optional: true
    },
    {
      title: "Your growing team",
      body: "This is your live tree. Tap a name for their card. A + means they have people under them. Sort by Most legs or Newest.",
      panel: "leader",
      target: '[data-team-tour="tree"]',
      fallbackTarget: '[data-team-tour="board"]',
      placement: "above",
      fullSpot: true
    },
    {
      title: "Your leader overview",
      body: "When someone joins your Grove or shares How I Grow, a number appears on the Grove tab. Open Grove to see their names — and where new partners sit on your tree. Tap a How I Grow row to read it.",
      panel: "leader",
      target: '[data-team-tour="overview"]',
      placement: "below",
      optional: true
    },
    {
      title: "Dream Tree",
      body: "This is your sketch of who you’d love beside you — same practice map as Sprout. Keep adding names. If someone already joined, tap Mark people who already joined so they show as said yes.",
      panel: "leader",
      target: '[data-team-tour="dream"]',
      placement: "above"
    },
    {
      title: "Mentoring — by how they’re moving",
      body: "Needs a nudge · In motion · Ready. Tap a name to expand — you’ll see their progress and a How they grow snapshot. Tap “See how they grow” for the full answers, then send a cheer or leave a note.",
      panel: "leader",
      target: "#leaderLists .how-grow-snapshot",
      fallbackTarget: "#leaderLists .leader-col",
      placement: "auto"
    },
    {
      title: "Send a cheer",
      body: "Cheer is a warm preset line you send inside First Seeds. Preview it here, tap Choose another to cycle lines, then Send — they see it in Messages, plus a banner at the top of Sprout.",
      panel: "leader",
      target: "#cheerSheet .cheer-sheet-card",
      openCheerSheet: true,
      placement: "auto"
    },
    {
      title: "Leave a note",
      body: "Leave note is your own message (often prefilled from how they’re moving). Edit it, then Send so it lands in their Messages — or Copy and paste it wherever you usually chat. Nothing sits on their card until you open this.",
      panel: "leader",
      target: "#noteSheet .cheer-sheet-card",
      openNoteSheet: true,
      placement: "auto"
    }
  ],

  /* First lead in the inbox — one-time walkthrough of the card. */
  leadsTourVersion: 6,
  leadsTour: [
    {
      title: "They’re in your inbox",
      body: "Someone left their name and how to reach them. Say hi. Don’t send a pitch.",
      panel: "leads",
      target: '[data-leads-tour="card"]',
      placement: "below"
    },
    {
      title: "Add someone yourself",
      body: "Already talking 1:1, or they came in from a page you built? Tap Add a lead. Name is enough — phone, email, or Instagram if you have it.",
      panel: "leads",
      target: '[data-leads-tour="manual"]',
      placement: "below"
    },
    {
      title: "Names you’re still reaching",
      body: "This list is for people you want to talk to who haven’t given you their info yet. When they do, send your page — or add them to Inbox yourself.",
      panel: "leads",
      target: '[data-leads-tour="ideal"]',
      placement: "below",
      optional: true
    },
    {
      title: "Send a message",
      body: "A starter text lives here. Rewrite it until it sounds like you, then send it.",
      panel: "leads",
      target: '[data-leads-tour="send"]',
      openLeadSend: true,
      placement: "below",
      optional: true
    },
    {
      title: "Text, Email, or Copy",
      body: "Text and Email open with the message already filled in. Copy is for WhatsApp, IG, or wherever you already chat.",
      panel: "leads",
      target: '[data-leads-tour="reach"]',
      openLeadSend: true,
      placement: "above",
      clearanceBottom: 150,
      optional: true
    },
    {
      title: "Want a different line?",
      body: "Tap Another if this one doesn’t sound like you.",
      panel: "leads",
      target: '[data-leads-tour="shuffle"]',
      openLeadSend: true,
      placement: "above",
      clearanceBottom: 150,
      optional: true
    },
    {
      title: "Leave yourself a note",
      body: "What they asked, what you sent, anything you don’t want to forget.",
      panel: "leads",
      target: '[data-leads-tour="notes"]',
      openLeadNotes: true,
      placement: "above",
      clearanceBottom: 160
    },
    {
      title: "Filters",
      body: "Tap here when you want a smaller list. Hot is the fire on a card. Quiz is people who took The Fresh Match. FB group is who’s in that group. Until launch is the stay-in-touch lane. Joined the grove is when they plugged into First Seeds.",
      panel: "leads",
      target: "#leadsFilterFold",
      openLeadsFilters: true,
      placement: "below",
      clearanceBottom: 120
    },
    {
      title: "Update their card",
      body: "Tap the status to jump — New, Reached out, Talking, Invited to FB group, Keeping updated until launch, Joined the grove, or Archived. Quiz is separate: mark Took Fresh Match when they did. The faint fire next to their name? Tap it for a hot lead.",
      panel: "leads",
      target: '[data-leads-tour="actions"]',
      placement: "below",
      clearanceBottom: 160
    }
  ],

  /* First open of Clients — Taylor-only until the team gift ships. */
  clientsTourVersion: 12,
  clientsTour: [
    {
      title: "This tab connects to The Fresh Shelf",
      body: "Clients is your side. The Fresh Shelf is our exclusive client app. When products launch it’ll be for our clients, but right now it’s a spot for people interested in the products.",
      panel: "customers",
      target: '[data-clients-tour="head"]',
      fallbackTarget: "#panel-customers .team-head",
      placement: "below"
    },
    {
      title: "Your shelf link",
      body: "Copy this and send it to anyone interested in the products. They open The Fresh Shelf and can learn about the products, add products to their wishlist, and communicate directly with you.",
      panel: "customers",
      target: ["#customersCopyLink", '[data-clients-tour="invite"]'],
      fallbackTarget: '[data-clients-tour="head"]',
      placement: "below"
    },
    {
      title: "Today is your gentle check-in",
      body: "This tab keeps you updated — someone new on The Fresh Shelf, someone who wrote you, or a note that’s ready to send.",
      panel: "customers",
      target: '#cabinetDeskSeg [data-cabinet-room="today"]',
      fallbackTarget: '[data-clients-tour="week"]',
      clientsRoom: "today",
      placement: "below"
    },
    {
      title: "A couple of notes, already written for you",
      body: "You can turn automated messages on or off. Welcome and Learn are warm little messages so you don’t have to start from scratch. They wait on Today until you send or skip — they land for them in The Fresh Shelf, and you can make them sound like you right here.",
      panel: "customers",
      target: '[data-clients-tour="auto"]',
      fallbackTarget: ".cabinet-auto-card",
      clientsRoom: "auto",
      placement: "below"
    },
    {
      title: "Your people, in one place",
      body: "Everyone who opened The Fresh Shelf with you lives here. Tap a name to learn more about them, products on their wishlist, and their quiz results.",
      panel: "customers",
      target: '#cabinetDeskSeg [data-cabinet-room="people"]',
      fallbackTarget: "#cabinetDeskSeg",
      clientsRoom: "people",
      placement: "below"
    },
    {
      title: "When they write, it lands here",
      body: "A question, a thank-you, a little burst of excitement — you’ll see it here. Write one person back, or send the same note to everyone. And when products launch, we’ll be able to send our links directly to every potential client who downloaded The Fresh Shelf.",
      panel: "customers",
      target: '#cabinetDeskSeg [data-cabinet-room="mail"]',
      fallbackTarget: "#cabinetDeskSeg",
      clientsRoom: "mail",
      placement: "below"
    }
  ],

  groveLeaders: {
    eyebrow: "Private · Grove Leaders",
    title: "Grove Leaders",
    ctaLabel: "Exclusively for Grove Leaders",
    sub: "Notes, docs, and links exclusively for Grove Leaders.",
    subWarn: "Things here are not to be shared outside of our leaders.",
    sections: [],
    links: [],
    cards: [
      {
        goto: "leaders-comp",
        eyebrow: "How we get paid",
        title: "Compensation plan",
        sub: "The full plan and a walkthrough of how it works.",
        cta: "Open →"
      },
      {
        eyebrow: "Community",
        title: "E-Co WhatsApp community",
        sub: "The leaders' group chat.",
        cta: "Open chat →",
        linkKey: "whatsapp"
      }
    ],
    feedback: {
      eyebrow: "This hub",
      title: "Notice a glitch?",
      blurb: "If something looks off, or you have an idea that would make the app better, send it in.",
      cta: "Send in feedback →",
      email: "taylor@swapsmadesimple.com",
      subject: "First Seeds · Grove Leaders feedback"
    }
  },

  groveLeadersComp: {
    title: "Compensation plan",
    sub: "The full plan and a walkthrough of how it works.",
    cards: [
      {
        eyebrow: "The document",
        title: "Full plan",
        sub: "Open the complete compensation plan.",
        cta: "Open PDF →",
        linkKey: "comp_pdf"
      },
      {
        eyebrow: "The walkthrough",
        title: "Understanding the compensation plan",
        sub: "Sit with how it works. The PDF is right next door.",
        cta: "Open →",
        goto: "leaders-understand"
      }
    ]
  },

  /* Fallback “In the app” points if the live bulletin table isn’t loaded yet.
     Live posts (and per-person dismiss) live in Supabase app_bulletins. */
  appUpdates: {
    items: [
      {
        id: "a1111111-0000-4000-8000-000000000001",
        text: "You have a new business-info link to share when someone is curious about joining the Grove. They fill out the form and their info lands in your Leads tab.",
        go: "leads",
        focus: "leadsGroveShareCard",
        cta: "More details →"
      },
      {
        id: "a1111111-0000-4000-8000-000000000002",
        text: "The grove also has a team Instagram now: @the.fresh.grove. (content coming soon!) People who find us there land on that same business-info page, but with a drop down to select who sent them."
      },
      {
        id: "a1111111-0000-4000-8000-000000000003",
        text: "Ringana’s sustainability reports now live in Learn.",
        go: "know",
        cta: "Open Learn →"
      },
      {
        id: "a1111111-0000-4000-8000-000000000004",
        text: "Keep notifications on (Settings → Notifications). That’s how grove notes, cheers, and joins actually reach you."
      },
      {
        id: "a1111111-0000-4000-8000-000000000009",
        text: "Calendar now has a shared library — Posts from the team. Steal the structure, rewrite it in your voice, and add yours when something worked.",
        go: "grove-shelf",
        cta: "Browse posts →"
      },
      {
        id: "a1111111-0000-4000-8000-000000000010",
        text: "Add a photo in Settings. It shows up on the tree, and on posts you submit to the team library."
      },
      {
        id: "a1111111-0000-4000-8000-000000000011",
        text: "Under Calendar you can tap Your story, Favorite products, and Favorite facts — right there when you’re making a post.",
        go: "tend",
        cta: "Open Calendar →"
      }
    ]
  },

  freshCatalog: {
    eyebrow: "From Ringana",
    title: "The Fresh Catalog",
    blurb: "The current fresh book — skincare, body, baby, supplements, the whole range in one flip-through.",
    cta: "Open catalog →",
    url: "assets/company/fresh-catalog.pdf?v=3"
  },

  companyReports: [
    {
      eyebrow: "From Ringana",
      title: "FRESH IMPACT 2025",
      sub: "The sustainability report — climate, packaging, water, and people, in their numbers.",
      blurb: "The sustainability report — climate, packaging, water, and people, in their numbers.",
      cta: "Open report →",
      url: "assets/company/ringana-fresh-impact-2025.pdf"
    },
    {
      eyebrow: "From Ringana",
      title: "Transparency report 2023",
      sub: "How they measure sustainability — the official transparency report.",
      blurb: "How they measure sustainability — the official transparency report.",
      cta: "Open report →",
      url: "assets/company/ringana-transparency-report-2023.pdf"
    }
  ],

  storeKey: "firstSeeds_v6",
  legacyStoreKey: "firstSeeds_v5"
};
