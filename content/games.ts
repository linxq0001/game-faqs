export type GameStatus = "published" | "watchlist" | "draft";
export type GuideStatus = "published" | "draft" | "needs-update";
export type VerificationStatus =
  | "researched"
  | "played"
  | "community-confirmed"
  | "needs-update";
export type GuideType =
  | "beginner"
  | "tips"
  | "settings"
  | "system-requirements"
  | "crafting"
  | "resources"
  | "boss"
  | "puzzle"
  | "ending"
  | "achievements"
  | "map"
  | "faq";

export type GuideSection = {
  heading: string;
  headingLevel?: 2 | 3;
  body: string;
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle?: string;
  type: GuideType;
  status: GuideStatus;
  contentPath?: string;
  artwork?: GameArtwork;
  summary: string;
  directAnswer: string;
  updatedAt: string;
  gameVersion: string;
  verificationStatus: VerificationStatus;
  readTime: string;
  sourceUrls: string[];
  sections: GuideSection[];
};

export type GameArtwork = {
  src: string;
  alt: string;
  caption: string;
  sourceUrl: string;
};

export type Game = {
  title: string;
  slug: string;
  status: GameStatus;
  steamUrl: string;
  appid: string;
  releaseDate: string;
  tags: string[];
  summary: string;
  coverageStatus: string;
  updatedAt: string;
  artwork?: GameArtwork;
  isFixture?: boolean;
  guides: Guide[];
};

export const games: Game[] = [
  {
    title: "Battlestar Galactica: Scattered Hopes",
    slug: "battlestar-galactica-scattered-hopes",
    status: "published",
    steamUrl:
      "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
    appid: "2535950",
    releaseDate: "2026-05-11",
    tags: [
      "Strategy",
      "RTS",
      "Roguelite",
      "Replay Value",
      "Story Rich",
      "Tactical",
      "Resource Management",
      "Real-Time with Pause"
    ],
    summary:
      "A fleet-management roguelite strategy game about keeping the remnants of humanity alive while dispatching expeditions, handling crises, investigating Cylon infiltrators, and fighting real-time battles with tactical pause.",
    coverageStatus: "Build Now",
    updatedAt: "2026-05-11",
    artwork: {
      src: "/art/bsg/official-game-hub.jpg",
      alt: "Official Battlestar Galactica: Scattered Hopes header artwork.",
      caption:
        "Official Battlestar Galactica: Scattered Hopes header artwork from the Steam store page.",
      sourceUrl:
        "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
    },
    guides: [
      {
        slug: "resources-guide",
        title:
          "Battlestar Galactica: Scattered Hopes Resources Guide: Fuel, Supplies, Salvage, Ammo, And Emergency Materials",
        shortTitle: "Resources Guide",
        type: "resources",
        status: "published",
        contentPath:
          "faqs/Battlestar Galactica: Scattered Hopes/en/01-resources-guide.md",
        artwork: {
          src: "/art/bsg/official-resources.png",
          alt: "Official Battlestar Galactica: Scattered Hopes page background artwork for the resources guide.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes page background artwork.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "A beginner resource guide covering Tylium, supplies, salvage, ammo, and emergency materials.",
        directAnswer:
          "Treat Tylium as your first survival resource, supplies as your morale buffer, salvage as your fleet durability budget, ammo as combat uptime, and special materials as emergency tools.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        ],
        sections: [
          {
            heading: "Placeholder",
            body: "Published content is hydrated from the matching Markdown guide."
          }
        ]
      },
      {
        slug: "beginner-guide",
        title: "Battlestar Galactica: Scattered Hopes Opening Route: What To Do In Your First 3 Maps",
        shortTitle: "Opening Route",
        type: "beginner",
        status: "published",
        contentPath:
          "faqs/Battlestar Galactica: Scattered Hopes/en/05-opening-route.md",
        artwork: {
          src: "/art/bsg/official-opening-route.jpg",
          alt: "Official Battlestar Galactica: Scattered Hopes header artwork for the opening route guide.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes header artwork from the Steam store page.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "An opening route for your first three maps, covering Callisto, early management turns, and the safest first-battle plan.",
        directAnswer:
          "For your first run, choose Callisto on Easy, spend the first management phase securing Tylium, repairing your main Gunstar, refilling squadron ammo, and checking morale, then treat the first battle as a survival check where you pause early, intercept Raiders, and jump the moment FTL is ready.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "6 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Choose Callisto And Start On Easy",
            body: "Your first goal is to learn the run loop, not test a high-risk fleet. Callisto is the safer beginner ship because it gives you a more forgiving balance of armor, squadron capacity, and combat handling, while Easy gives you enough space to understand how resources, morale, crises, and battles connect.",
            bullets: [
              "Callisto gives you more room to survive positioning mistakes.",
              "Use Easy to build habits around fleet status and tactical pause.",
              "Expect early losses and treat them as part of the roguelite progression."
            ]
          },
          {
            heading: "Play The First Management Phase In A Fixed Order",
            body: "Do not try to touch every event in the opening turns. A safe first management phase is Tylium first, main Gunstar repairs second, squadron ammo third, and morale or fleet status checks fourth. That order gets you into the first battle with fuel, armor, and combat readiness under control.",
            bullets: [
              "Turn 1: send an expedition to a green Tylium point.",
              "Turn 2: repair your main Gunstar before spending salvage elsewhere.",
              "Turn 3: refill squadron ammo and confirm your key squadrons are ready.",
              "Turn 4: check morale and fix only the most urgent fleet problem."
            ]
          },
          {
            heading: "Treat The First Battle As A Survival Check",
            body: "The first battle is not about wiping every Cylon ship. Pause immediately, send squadrons forward to intercept Raiders, keep your Gunstar centered, and focus high-threat targets instead of chasing every low-health enemy. Once FTL is ready, leave.",
            bullets: [
              "Pause at the start of combat before the formation gets messy.",
              "Use squadrons to protect civilian ships from Raiders.",
              "Focus dangerous ships with the Gunstar and ignore risky chase paths.",
              "Jump the moment FTL reaches 100 percent."
            ]
          },
          {
            heading: "Use Maps Two And Three To Repeat The Safe Loop",
            body: "After the first fight, keep the next two maps boring on purpose. Prioritize Tylium, supplies, Gunstar repairs, and squadron upkeep before lower-value events, then use the extra stability to push toward your first permanent upgrade. Early armor, fuel efficiency, and supply capacity upgrades matter more than flashy damage spikes."
          }
        ]
      },
      {
        slug: "fleet-management-guide",
        title: "Battlestar Galactica: Scattered Hopes Fleet Management Guide",
        shortTitle: "Fleet Management Guide",
        type: "resources",
        status: "published",
        contentPath:
          "faqs/Battlestar Galactica: Scattered Hopes/en/02-fleet-management-guide.md",
        artwork: {
          src: "/art/bsg/official-fleet-management.png",
          alt: "Official Battlestar Galactica: Scattered Hopes page background artwork for fleet management.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes page background artwork.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "How to allocate supplies, personnel, repairs, ship upgrades, and crew training during a run.",
        directAnswer:
          "Good fleet management means spending only after checking the fleet status board: cover healthcare and maintenance risks, keep faction politics from turning into a crisis, then allocate supplies and personnel to expeditions, ship upgrades, and crew training that solve the next two turns.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "6 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Start With The Status Indicators",
            body: "Faction politics, healthcare, and maintenance are not flavor text. They are warning lights that tell you where the fleet is most likely to fail if the next crisis applies pressure there."
          },
          {
            heading: "Allocate Supplies With A Reserve",
            body: "Expeditions and upgrades are tempting, but the run punishes empty reserves. Keep enough supplies available to answer crisis penalties, emergency repairs, and personnel needs before committing to a long expedition.",
            bullets: [
              "Spend supplies when they prevent a larger status collapse.",
              "Delay nonessential upgrades if maintenance is already unstable.",
              "Use expeditions to fix a shortage, not to collect rewards blindly."
            ]
          },
          {
            heading: "Train Crew Around Your Fleet Plan",
            body: "Crew training should reinforce the fleet you are actually using. If you rely on frontline squadrons, prioritize consistency and survival; if your plan leans on Gunstar weapons, support the timing and accuracy of those strikes."
          },
          {
            heading: "Upgrade Ships For The Next Threat",
            body: "The best ship upgrade is the one that answers the next Cylon pressure point. Build survivability before high-risk damage, then layer in stronger attacks once your fleet can survive bad crisis rolls."
          }
        ]
      },
      {
        slug: "beginner-mistakes",
        title: "Battlestar Galactica: Scattered Hopes Beginner Mistakes To Avoid",
        shortTitle: "Beginner Mistakes To Avoid",
        type: "faq",
        status: "published",
        contentPath:
          "faqs/Battlestar Galactica: Scattered Hopes/en/04-beginner-mistakes.md",
        artwork: {
          src: "/art/bsg/official-beginner-mistakes.jpg",
          alt: "Official Battlestar Galactica: Scattered Hopes header artwork for beginner mistakes.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes header artwork from the Steam store page.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "A checklist of the most common beginner mistakes that cause early runs to collapse.",
        directAnswer:
          "The biggest beginner mistakes are spending fuel too freely, wasting turns on low-value events, letting morale fall too far, overrepairing side ships, and staying too long in combat.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        ],
        sections: [
          {
            heading: "Placeholder",
            body: "Published content is hydrated from the matching Markdown guide."
          }
        ]
      },
      {
        slug: "crisis-system-guide",
        title: "Battlestar Galactica: Scattered Hopes Crisis System Guide",
        type: "tips",
        status: "draft",
        artwork: {
          src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2535950/257272938/d6ff79de7866ac6487268c4e4a2dad87ac35e698/movie_600x337.jpg",
          alt: "Battlestar Galactica: Scattered Hopes official Steam trailer still showing fleet conflict.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes Steam trailer artwork.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "How to prepare for crisis penalties, status damage, and Cylon infiltrator investigations.",
        directAnswer:
          "Treat every crisis as both an immediate penalty and a clue about your weak systems. Reduce negative effects by keeping status indicators healthy, holding supplies for emergency responses, and investigating possible Cylon infiltrators before suspicion turns into run-ending damage.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Crisis Effects Stack With Neglect",
            body: "A single crisis is manageable when the fleet is healthy. The same crisis becomes dangerous if faction politics, healthcare, or maintenance were already strained before the event appeared."
          },
          {
            heading: "Keep An Emergency Budget",
            body: "Limited turns encourage aggressive play, but crisis events punish a fleet with no spare supplies or personnel. Reserve enough resources to answer at least one bad event without cancelling your entire plan."
          },
          {
            heading: "Investigate Infiltrators Early",
            body: "Cylon infiltrator investigations should start before the fleet is already collapsing. If you wait until several status indicators are damaged, even a correct investigation may arrive too late to stabilize the run."
          },
          {
            heading: "Use Crises To Set Priorities",
            body: "After a crisis hits, update your next turn plan immediately. Repair the damaged system, choose expeditions that replace the lost resource, and avoid upgrades that do not help with the new problem."
          }
        ]
      },
      {
        slug: "best-squadrons",
        title: "Battlestar Galactica: Scattered Hopes Best Squadrons",
        type: "tips",
        status: "draft",
        summary:
          "How to choose frontline squadrons, unlock new units, and build a reliable combat roster.",
        directAnswer:
          "The best squadrons are the ones that match your fleet plan: use durable frontline squadrons to hold enemy attention, add specialized units from trial unlocks when they cover a weakness, and avoid filling every slot with fragile damage if your Gunstar timing still needs protection.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Frontline Squadrons Come First",
            body: "Frontline squadrons create the space your fleet needs to survive real-time engagements. Pick units that can stay active long enough for tactical pause orders and Gunstar strikes to matter."
          },
          {
            heading: "Use Trials To Expand Roles",
            body: "Trials unlock squadron units, Gunstar weapons, and modifiers. Prioritize squadron unlocks that add a missing role rather than doubling down on something your roster already handles."
          },
          {
            heading: "Balance Damage And Control",
            body: "A pure damage lineup can win easy fights quickly and still fail in harder encounters. Mix damage, staying power, and control so the fleet can recover from bad positioning or crisis-driven disadvantages."
          },
          {
            heading: "Adjust For Higher Difficulties",
            body: "Higher difficulty levels reward consistency. On tougher runs, value squadrons that reduce mistakes, protect key ships, or buy time for tactical pause decisions over units that only perform when everything goes perfectly."
          }
        ]
      },
      {
        slug: "best-upgrades",
        title: "Battlestar Galactica: Scattered Hopes Best Upgrades",
        type: "resources",
        status: "draft",
        artwork: {
          src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2535950/257309469/c1b2859def3761ca0bf832fa8132fd9d4df2a022/movie_600x337.jpg",
          alt: "Battlestar Galactica: Scattered Hopes official Steam trailer still showing tactical fleet action.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes Steam trailer artwork.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "Upgrade priorities for ships, crew training, Gunstar weapons, modifiers, and meta progression.",
        directAnswer:
          "The best early upgrades improve reliability: ship durability, crew training that supports your main combat plan, Gunstar weapons that answer dangerous targets, and meta upgrades that make future runs less resource-starved.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Prioritize Run Stability",
            body: "Because the campaign is a roguelite built around limited turns, upgrades that prevent disaster usually beat upgrades that only help when you are already ahead."
          },
          {
            heading: "Pick Gunstar Weapons For Problems",
            body: "Gunstar strikes are most valuable when they remove the threat your squadrons cannot safely handle. Choose weapons that complement your frontline rather than copying its job."
          },
          {
            heading: "Train Crew To Reduce Waste",
            body: "Crew training should make your most repeated actions cleaner: safer expeditions, better combat execution, steadier repairs, or stronger resource conversion depending on where your runs usually break."
          },
          {
            heading: "Use Meta Upgrades To Unlock Difficulty",
            body: "Meta upgrades and modifiers are the bridge to higher difficulty levels. Spend them on foundations first, then experiment with sharper builds once your baseline clear rate improves."
          }
        ]
      },
      {
        slug: "combat-guide",
        title: "Battlestar Galactica: Scattered Hopes Combat Guide",
        shortTitle: "Combat Guide",
        type: "tips",
        status: "published",
        contentPath:
          "faqs/Battlestar Galactica: Scattered Hopes/en/03-combat-guide.md",
        artwork: {
          src: "/art/bsg/official-combat-guide.png",
          alt: "Official Battlestar Galactica: Scattered Hopes artwork adapted for the combat guide.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes artwork adapted from the Steam store page.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "Real-time combat fundamentals for tactical pause, frontline squadrons, and Gunstar strikes.",
        directAnswer:
          "Win combat by pausing often, keeping frontline squadrons between enemies and vulnerable ships, and firing Gunstar strikes when targets are committed. Do not wait until the fleet is already damaged to pause and reset orders.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Pause Before The Fight Gets Messy",
            body: "Tactical pause is strongest before a mistake becomes damage. Pause to assign targets, check squadron spacing, and time Gunstar strikes around enemy movement."
          },
          {
            heading: "Protect The Frontline",
            body: "Frontline squadrons should absorb pressure without being thrown away. Pull back damaged units, rotate fresh squadrons forward, and avoid chasing enemies so far that your fleet loses formation."
          },
          {
            heading: "Fire Gunstar Strikes With Intent",
            body: "A Gunstar strike should either delete a dangerous target, interrupt a push, or create a safe window for squadrons to reposition. Random firing wastes one of your strongest tactical tools."
          },
          {
            heading: "Scale Your Habits For Harder Modes",
            body: "Higher difficulty levels leave less room for sloppy timing. Build the habit of pausing, checking threats, and issuing clean orders on normal runs so the same rhythm works when enemies hit harder."
          }
        ]
      },
      {
        slug: "meta-upgrades-guide",
        title: "Battlestar Galactica: Scattered Hopes Meta Upgrades Guide",
        shortTitle: "Meta Upgrades Guide",
        type: "resources",
        status: "published",
        contentPath:
          "faqs/Battlestar Galactica: Scattered Hopes/en/06-meta-upgrades-guide.md",
        artwork: {
          src: "/art/bsg/official-meta-upgrades.png",
          alt: "Official Battlestar Galactica: Scattered Hopes artwork adapted for the meta upgrades guide.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes artwork adapted from the Steam store page.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "A progression guide to the best early permanent upgrades and the mindset behind them.",
        directAnswer:
          "Prioritize permanent upgrades that improve survival and route stability before damage spikes, especially fuel efficiency, Gunstar armor, and supply capacity.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "5 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        ],
        sections: [
          {
            heading: "Placeholder",
            body: "Published content is hydrated from the matching Markdown guide."
          }
        ]
      },
      {
        slug: "starting-fleets-guide",
        title: "Battlestar Galactica: Scattered Hopes Starting Fleets Guide",
        type: "faq",
        status: "draft",
        artwork: {
          src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2535950/4a43a83c8bf5aeee2084591c79559a664f93dc6c/page_bg_raw.jpg?t=1777991759",
          alt: "Battlestar Galactica: Scattered Hopes official Steam background artwork for fleet selection.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes Steam page background artwork.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "How to evaluate starting fleets, up to four options, and choose a fleet for your first clears.",
        directAnswer:
          "Choose your starting fleet by comfort, not novelty: among the available starting fleets, pick the one with the clearest squadron plan, the safest resource curve, and enough flexibility to survive both crisis events and combat mistakes.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "4 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "What Starting Fleets Change",
            body: "Scattered Hopes supports starting fleet choices up to four options, and each one can change how quickly you stabilize resources, fight early battles, and recover from crisis penalties."
          },
          {
            heading: "Best First-Clear Criteria",
            body: "For first clears, avoid the fleet that looks exciting but requires perfect crisis luck. A strong beginner fleet has a simple combat plan, manageable supply pressure, and enough durability to survive learning mistakes."
          },
          {
            heading: "When To Switch Fleets",
            body: "Switch starting fleets when you have unlocked more squadron units, Gunstar weapons, modifiers, or meta upgrades. A fleet that felt weak early can become stronger once your unlock pool supports its plan."
          }
        ]
      },
      {
        slug: "system-requirements",
        title: "Battlestar Galactica: Scattered Hopes System Requirements For PC",
        type: "system-requirements",
        status: "draft",
        artwork: {
          src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2535950/d29dc74a212e14249b34ebbcdf028bbec5ce7ff0/header.jpg?t=1777991759",
          alt: "Battlestar Galactica: Scattered Hopes official Steam header artwork for system requirements.",
          caption:
            "Official Battlestar Galactica: Scattered Hopes header artwork from the Steam store page.",
          sourceUrl:
            "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/"
        },
        summary:
          "The official PC system requirement status from Steam, including the TBD OS note.",
        directAnswer:
          "The official Steam page currently lists Battlestar Galactica: Scattered Hopes system requirements with OS marked TBD and notes that a 64-bit processor and operating system are required.",
        updatedAt: "2026-05-11",
        gameVersion: "Launch",
        verificationStatus: "researched",
        readTime: "3 min read",
        sourceUrls: [
          "https://store.steampowered.com/app/2535950/Battlestar_Galactica_Scattered_Hopes/",
          "https://steamdb.info/app/2535950/"
        ],
        sections: [
          {
            heading: "Official Requirement Status",
            body: "Steam currently marks the operating system requirement as TBD, so there is not enough official information to publish a full CPU, GPU, RAM, or storage checklist."
          },
          {
            heading: "64-Bit Requirement",
            body: "The listed baseline is that the game requires a 64-bit processor and operating system. Players on older 32-bit Windows installs should not expect support."
          },
          {
            heading: "What To Check Before Buying",
            body: "Because the OS line is still TBD, check the Steam page again before purchase or installation if you are using older hardware, unusual Windows versions, or a handheld PC setup."
          }
        ]
      }
    ]
  },
  {
    title: "Fixture Island",
    slug: "fixture-island",
    status: "published",
    steamUrl: "https://example.com/fixture",
    appid: "fixture",
    releaseDate: "2026-01-01",
    tags: ["Fixture"],
    summary: "A fake game used only to prove fixture content cannot leak into public pages.",
    coverageStatus: "Fixture",
    updatedAt: "2026-05-10",
    isFixture: true,
    guides: [
      {
        slug: "fixture-guide",
        title: "Fixture Island Test Guide",
        type: "faq",
        status: "published",
        summary: "Fixture guide that should never appear publicly.",
        directAnswer: "Fixture content is hidden from public indexes.",
        updatedAt: "2026-05-10",
        gameVersion: "Fixture",
        verificationStatus: "needs-update",
        readTime: "1 min read",
        sourceUrls: ["https://example.com/fixture"],
        sections: [
          {
            heading: "Fixture",
            body: "This exists only to test fixture filtering."
          }
        ]
      }
    ]
  },
  {
    title: "Draft Depths",
    slug: "draft-depths",
    status: "draft",
    steamUrl: "https://example.com/draft",
    appid: "draft",
    releaseDate: "2026-04-01",
    tags: ["Draft"],
    summary: "A draft game used to prove unpublished games stay private.",
    coverageStatus: "Draft",
    updatedAt: "2026-05-10",
    guides: [
      {
        slug: "draft-guide",
        title: "Draft Depths Test Guide",
        type: "faq",
        status: "published",
        summary: "Published guide under a draft game that should still stay private.",
        directAnswer: "Guides inherit public visibility from their game.",
        updatedAt: "2026-05-10",
        gameVersion: "Draft",
        verificationStatus: "needs-update",
        readTime: "1 min read",
        sourceUrls: ["https://example.com/draft"],
        sections: [
          {
            heading: "Draft",
            body: "This exists only to test draft game filtering."
          }
        ]
      }
    ]
  }
];
