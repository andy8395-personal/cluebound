import type { Chapter } from "@/lib/types";

export const MALE_PRESET = "Arthur Pendelton";
export const FEMALE_PRESET = "Evelyn Vance";

export const chapters: Chapter[] = [
  {
    id: "case_01_silent_inheritance",
    number: 1,
    caseCode: "CASE 01",
    title: "The Silent Inheritance",
    setting: "Blackwood Manor Estate",
    victim: "Lord Sterling Blackwood",
    summary:
      "Lord Blackwood is found dead in his private study before he can read a revised will. The house is locked. Four people had keys. The tea is still warm.",
    solution: {
      culprit: "Nephew",
      weapon: "Arsenic",
      location: "Library",
      motive: "Greed",
    },
    accusationOptions: {
      culprits: ["Butler", "Nephew", "Maid", "Doctor"],
      weapons: ["Arsenic", "Letter Opener", "Pistol", "Silk Cord"],
      locations: ["Library", "Wine Cellar", "Conservatory", "Observatory"],
      motives: ["Greed", "Blackmail", "Revenge", "Inheritance"],
    },
    levels: [
      {
        phase: 1,
        title: "Crime Scene",
        subtitle: "Establish the first four columns of the case.",
        briefing:
          "The study is staged like a still life. Sixteen fragments of the night sit on the board. Group what belongs together: the people, the tools, the hungers, and the rooms.",
        breakthrough:
          "The manor splits into four clean lanes. Someone with a claim on the estate moved through the Library after dinner — and the tea service was not innocent.",
        categories: [
          {
            id: "c1l1-suspects",
            title: "Household Suspects",
            kind: "suspects",
            tiles: ["Butler", "Nephew", "Maid", "Doctor"],
          },
          {
            id: "c1l1-weapons",
            title: "Possible Weapons",
            kind: "weapons",
            tiles: ["Arsenic", "Letter Opener", "Pistol", "Silk Cord"],
          },
          {
            id: "c1l1-motives",
            title: "Suspect Motives",
            kind: "motives",
            tiles: ["Greed", "Blackmail", "Revenge", "Inheritance"],
          },
          {
            id: "c1l1-locations",
            title: "Manor Locations",
            kind: "locations",
            tiles: ["Library", "Wine Cellar", "Conservatory", "Observatory"],
          },
        ],
      },
      {
        phase: 2,
        title: "Documents & Forensics",
        subtitle: "Sort the paper trail from the body.",
        briefing:
          "Autopsy notes, estate ledgers, forged stationery, and the debris of the study. Four stacks. One of them proves the will never left the desk alive.",
        breakthrough:
          "The stomach holds tea and a metal salt. The codicil is unsigned. The nephew’s allowance is already spent. Someone needed the old will to stand for one more night.",
        categories: [
          {
            id: "c1l2-autopsy",
            title: "Autopsy Findings",
            kind: "documents",
            tiles: ["Tea Residue", "Dilated Pupils", "No Wound", "Slow Collapse"],
          },
          {
            id: "c1l2-estate",
            title: "Estate Papers",
            kind: "documents",
            tiles: ["Codicil Draft", "Disinherit Clause", "Stamp Duty", "Notary Delay"],
          },
          {
            id: "c1l2-forged",
            title: "Forged Letters",
            kind: "documents",
            tiles: ["Counterfeit Seal", "Tracing Paper", "Blotted Signature", "No Watermark"],
          },
          {
            id: "c1l2-study",
            title: "Study Artifacts",
            kind: "locations",
            tiles: ["Cold Teacup", "Open Safe", "Torn Envelope", "Spilled Sugar"],
          },
        ],
      },
      {
        phase: 3,
        title: "Timeline & Alibis",
        subtitle: "Break the clocks. Keep the truth.",
        briefing:
          "Everyone claims a room. The clocks disagree. Sort false alibis, real sightings, chime marks, and check-ins until the evening refuses to lie.",
        breakthrough:
          "The club alibi dies at 9:15. A second cup was poured in the Library while the butler was still downstairs. The nephew was on the stairs, not in town.",
        categories: [
          {
            id: "c1l3-alibis",
            title: "False Alibi Claims",
            kind: "suspects",
            tiles: ["Nephew at Club", "Maid in Pantry", "Doctor House Call", "Butler Polishing"],
          },
          {
            id: "c1l3-sightings",
            title: "Actual Sightings",
            kind: "locations",
            tiles: ["Nephew on Stairs", "Kitchen Kettle", "Study Lamp On", "Library Window"],
          },
          {
            id: "c1l3-clocks",
            title: "Clock Marks",
            kind: "documents",
            tiles: ["8:12 Chime", "9:00 Last Post", "10:30 Carriage", "11:05 Scream"],
          },
          {
            id: "c1l3-checkins",
            title: "Location Check-ins",
            kind: "locations",
            tiles: ["Wine Cellar Key", "Conservatory Soil", "Observatory Log", "Guestbook Ink"],
          },
        ],
      },
      {
        phase: 4,
        title: "Interrogation",
        subtitle: "Match the slips in their stories.",
        briefing:
          "{name}, the suspects are talking. Group the greed tells, the cracked alibis, the motive leaks, and the contradictions. Someone will name the hunger that killed Lord Blackwood.",
        breakthrough:
          "It is greed, not passion. The nephew needed the inheritance before the revised will was read. The Library tea was the delivery. You have enough to accuse.",
        categories: [
          {
            id: "c1l4-greed",
            title: "Greed Tells",
            kind: "motives",
            tiles: ["Spent Allowance", "Creditor Notes", "Pawned Watch", "Rushed Signature"],
          },
          {
            id: "c1l4-cracks",
            title: "Alibi Cracks",
            kind: "suspects",
            tiles: ["Wrong Train Time", "Muddy Dress Shoes", "Club Never Saw Him", "Borrowed Overcoat"],
          },
          {
            id: "c1l4-slips",
            title: "Motive Slips",
            kind: "motives",
            tiles: ["Uncle Promised Me", "Before the Reading", "Old Will Stands", "One More Night"],
          },
          {
            id: "c1l4-contradict",
            title: "Contradictions",
            kind: "documents",
            tiles: ["Served Usual Blend", "Heart Was Failing", "Only Dusted Shelves", "Keys Never Left"],
          },
        ],
      },
    ],
    closing:
      "Julian Blackwood, the nephew, laced the Library tea with arsenic so the old will — and his fortune — would survive one more night. Greed wrote the ending before the solicitor could.",
  },
  {
    id: "case_02_midnight_opera",
    number: 2,
    caseCode: "CASE 02",
    title: "Midnight at the Grand Opera",
    setting: "Royal Metropolitan Opera House",
    victim: "Prima Donna Victoria Vance",
    summary:
      "The star soprano collapses mid-solo. The house lights catch a falling goblet. Four careers were waiting in the wings.",
    solution: {
      culprit: "Understudy",
      weapon: "Poisoned Water",
      location: "Dressing Room",
      motive: "Professional Envy",
    },
    accusationOptions: {
      culprits: ["Understudy", "Conductor", "Stagehand", "Patron"],
      weapons: ["Poisoned Water", "Cut Chandelier", "Staged Drop", "Sabotaged Harness"],
      locations: ["Dressing Room", "Catwalk", "Orchestra Pit", "Main Stage"],
      motives: ["Professional Envy", "Romantic Rejection", "Debt", "Blackmail"],
    },
    levels: [
      {
        phase: 1,
        title: "Crime Scene",
        subtitle: "The aria never finished. The board must.",
        briefing:
          "Sixteen pieces of opening night. Sort the company, the deadly tricks, the private hungers, and the rooms backstage.",
        breakthrough:
          "The fall happened on the Main Stage, but the murder was prepared where the voice is tuned: a dressing room, a goblet, a rival waiting to go on.",
        categories: [
          {
            id: "c2l1-suspects",
            title: "Company Suspects",
            kind: "suspects",
            tiles: ["Understudy", "Conductor", "Stagehand", "Patron"],
          },
          {
            id: "c2l1-weapons",
            title: "Stage Weapons",
            kind: "weapons",
            tiles: ["Poisoned Water", "Cut Chandelier", "Staged Drop", "Sabotaged Harness"],
          },
          {
            id: "c2l1-motives",
            title: "Private Motives",
            kind: "motives",
            tiles: ["Professional Envy", "Romantic Rejection", "Debt", "Blackmail"],
          },
          {
            id: "c2l1-locations",
            title: "House Locations",
            kind: "locations",
            tiles: ["Dressing Room", "Catwalk", "Orchestra Pit", "Main Stage"],
          },
        ],
      },
      {
        phase: 2,
        title: "Documents & Forensics",
        subtitle: "Programs, contracts, and a goblet.",
        briefing:
          "Wardrobe notes, poison chemistry, money, and the wreckage of Act II. Stack them until the understudy’s name keeps rising.",
        breakthrough:
          "The goblet was dosed in the dressing room, not at the prompt desk. The understudy’s contract activates if the prima cannot sing.",
        categories: [
          {
            id: "c2l2-voice",
            title: "Vocal Forensics",
            kind: "documents",
            tiles: ["Bitter Goblet", "Throat Burn", "Clear Aria Then Fall", "No Stage Wound"],
          },
          {
            id: "c2l2-paper",
            title: "House Papers",
            kind: "documents",
            tiles: ["Understudy Clause", "Cancelled Tour", "Patron IOU", "Blackmail Note"],
          },
          {
            id: "c2l2-rigging",
            title: "Rigging Evidence",
            kind: "weapons",
            tiles: ["Uncut Cable", "Intact Harness", "Chandelier Pin In", "Counterweight Set"],
          },
          {
            id: "c2l2-room",
            title: "Dressing Debris",
            kind: "locations",
            tiles: ["Spare Score", "Hidden Vial", "Lip Rouge Smear", "Warm Carafe"],
          },
        ],
      },
      {
        phase: 3,
        title: "Timeline & Alibis",
        subtitle: "Cue-to-cue the night.",
        briefing:
          "Call times, false cues, real sightings, and the minute the goblet left the tray. Someone was in the dressing room while the overture played.",
        breakthrough:
          "The understudy was not in the wings for the overture. She was alone with Victoria’s carafe. The conductor’s pit alibi holds. Hers does not.",
        categories: [
          {
            id: "c2l3-alibis",
            title: "Claimed Cues",
            kind: "suspects",
            tiles: ["Wings All Night", "Pit From Downbeat", "Catwalk Checks", "Box Seat Loyal"],
          },
          {
            id: "c2l3-seen",
            title: "True Sightings",
            kind: "locations",
            tiles: ["Star’s Door Ajar", "Carafe On Tray", "Understudy Missing", "Prompt Corner Empty"],
          },
          {
            id: "c2l3-times",
            title: "Call Times",
            kind: "documents",
            tiles: ["7:10 Places", "8:00 Overture", "8:41 Solo", "8:43 Collapse"],
          },
          {
            id: "c2l3-stage",
            title: "Stage Check-ins",
            kind: "locations",
            tiles: ["Pit Roster", "Catwalk Log", "Stage Left Mark", "Box Three Ticket"],
          },
        ],
      },
      {
        phase: 4,
        title: "Interrogation",
        subtitle: "Make them sing the truth.",
        briefing:
          "{name} has them in the green room. Group envy, money, love, and the lies they tell about the goblet.",
        breakthrough:
          "Professional envy. The understudy wanted the role more than the woman singing it. The water was the quietest weapon in the house. Accuse.",
        categories: [
          {
            id: "c2l4-envy",
            title: "Envy Tells",
            kind: "motives",
            tiles: ["I Know Every Note", "She Hoards Arias", "Tonight Was Mine", "They Came For Her"],
          },
          {
            id: "c2l4-money",
            title: "Debt & Paper",
            kind: "motives",
            tiles: ["Pit Wages Late", "Patron’s Markers", "Costume Loans", "House Cut Rumors"],
          },
          {
            id: "c2l4-love",
            title: "Rejected Hearts",
            kind: "motives",
            tiles: ["Conductor’s Letter", "Returned Ring", "Stage-Door Roses", "Closed Dressing"],
          },
          {
            id: "c2l4-lies",
            title: "Goblet Lies",
            kind: "suspects",
            tiles: ["I Never Touch Props", "She Poured Herself", "Water Was Fine", "I Was In The Wings"],
          },
        ],
      },
    ],
    closing:
      "The understudy dosed Victoria Vance’s dressing-room goblet so the understudy clause would fire mid-aria. Envy took the high note. The house went dark.",
  },
  {
    id: "case_03_masquerade",
    number: 3,
    caseCode: "CASE 03",
    title: "The Masquerade Murders",
    setting: "Venetian Palace Gala",
    victim: "Count Alessandro",
    summary:
      "A high-society gala ends when the host is found behind a harlequin mask. The orchestra still plays. The courtyard is wet with canal mist and something else.",
    solution: {
      culprit: "Card Shark",
      weapon: "Stiletto Dagger",
      location: "Balcony",
      motive: "Forged Debts",
    },
    accusationOptions: {
      culprits: ["Ambassador", "Heiress", "Card Shark", "Bodyguard"],
      weapons: ["Stiletto Dagger", "Cyanide Ring", "Garrote", "Glass Shard"],
      locations: ["Ballroom", "Balcony", "Card Room", "Courtyard"],
      motives: ["Forged Debts", "Political Secrets", "Betrayal", "Theft"],
    },
    levels: [
      {
        phase: 1,
        title: "Crime Scene",
        subtitle: "Unmask the board first.",
        briefing:
          "Four guests. Four ways to die. Four hungers. Four rooms of a palace that never tells on its own.",
        breakthrough:
          "The mask hid a precise wound, not a crush of dancers. Look to a balcony, a thin blade, and a gambler whose paper was about to be tested.",
        categories: [
          {
            id: "c3l1-suspects",
            title: "Masked Suspects",
            kind: "suspects",
            tiles: ["Ambassador", "Heiress", "Card Shark", "Bodyguard"],
          },
          {
            id: "c3l1-weapons",
            title: "Gala Weapons",
            kind: "weapons",
            tiles: ["Stiletto Dagger", "Cyanide Ring", "Garrote", "Glass Shard"],
          },
          {
            id: "c3l1-motives",
            title: "Hidden Motives",
            kind: "motives",
            tiles: ["Forged Debts", "Political Secrets", "Betrayal", "Theft"],
          },
          {
            id: "c3l1-locations",
            title: "Palace Rooms",
            kind: "locations",
            tiles: ["Ballroom", "Balcony", "Card Room", "Courtyard"],
          },
        ],
      },
      {
        phase: 2,
        title: "Documents & Forensics",
        subtitle: "Ink, blood, and a false ledger.",
        briefing:
          "The count’s papers are a second crime scene. Group the wound, the forgeries, the politics, and the jewelry that did not move.",
        breakthrough:
          "No poison. No broken glass in the wound. A stiletto, a balcony rail with a smear, and promissory notes in a hand that is not the count’s.",
        categories: [
          {
            id: "c3l2-wound",
            title: "Wound Forensics",
            kind: "weapons",
            tiles: ["Narrow Entry", "No Cyanide", "Silk Uncut", "Glass Unused"],
          },
          {
            id: "c3l2-paper",
            title: "Forged Ledger",
            kind: "documents",
            tiles: ["False Markers", "Copied Hand", "Inflated Debt", "Dummy Witness"],
          },
          {
            id: "c3l2-politics",
            title: "Secret Dispatches",
            kind: "documents",
            tiles: ["Cipher Ribbon", "Embassy Seal", "Burned Draft", "Canal Courier"],
          },
          {
            id: "c3l2-theft",
            title: "Untouched Prizes",
            kind: "motives",
            tiles: ["Ruby Still Set", "Safe Locked", "Tiara Logged", "Purse Full"],
          },
        ],
      },
      {
        phase: 3,
        title: "Timeline & Alibis",
        subtitle: "The orchestra keeps time. The guests do not.",
        briefing:
          "Minuets, claimed dances, real sightings, and balcony checks. Someone left the card room with a blade and came back without a mask.",
        breakthrough:
          "The card shark’s waltz partner never existed. At midnight he was on the balcony. The bodyguard held the courtyard. The ambassador never left the floor.",
        categories: [
          {
            id: "c3l3-claims",
            title: "Dance Floor Claims",
            kind: "suspects",
            tiles: ["Always With Count", "Waltz Partner Named", "Posted At Doors", "Never Left Floor"],
          },
          {
            id: "c3l3-seen",
            title: "True Sightings",
            kind: "locations",
            tiles: ["Balcony Door Open", "Mask On Rail", "Card Room Empty", "Shark Missing"],
          },
          {
            id: "c3l3-music",
            title: "Orchestra Marks",
            kind: "documents",
            tiles: ["Minuet 10:40", "Midnight Fanfare", "Waltz Cut Short", "Gavotte Resume"],
          },
          {
            id: "c3l3-rooms",
            title: "Room Check-ins",
            kind: "locations",
            tiles: ["Courtyard Post", "Ballroom Card", "Card-Table Chips", "Balcony Smear"],
          },
        ],
      },
      {
        phase: 4,
        title: "Interrogation",
        subtitle: "Take the masks off the words.",
        briefing:
          "{name} has four stories and one ledger that cannot survive daylight. Group forged-debt tells, political cover, lovers’ betrayal, and the blade denials.",
        breakthrough:
          "Forged debts. The card shark’s paper empire would collapse when the count compared hands in the morning. The balcony was private. The stiletto was enough. Accuse.",
        categories: [
          {
            id: "c3l4-debt",
            title: "Debt Tells",
            kind: "motives",
            tiles: ["Markers Are Real", "He Signed Them", "Pay At Dawn", "House Always Wins"],
          },
          {
            id: "c3l4-politics",
            title: "Embassy Cover",
            kind: "motives",
            tiles: ["Treaty In The Safe", "Names In Cipher", "Recall Order", "Neutral Mask"],
          },
          {
            id: "c3l4-betrayal",
            title: "Betrayal Talk",
            kind: "motives",
            tiles: ["He Promised Venice", "A Second Engagement", "Letters Returned", "Heiress Alone"],
          },
          {
            id: "c3l4-blade",
            title: "Blade Denials",
            kind: "weapons",
            tiles: ["I Carry No Steel", "Ring Never Opened", "Gloves Stay Clean", "Glass From A Toast"],
          },
        ],
      },
    ],
    closing:
      "The card shark lured Count Alessandro to the balcony and used a stiletto before forged markers could be examined at dawn. Paper killed him as surely as the blade.",
  },
];

export function getChapter(id: string) {
  return chapters.find((chapter) => chapter.id === id) ?? null;
}

export function getLevel(chapter: Chapter, phase: 1 | 2 | 3 | 4) {
  return chapter.levels.find((level) => level.phase === phase) ?? null;
}

export function injectName(text: string, name: string) {
  return text.replaceAll("{name}", name);
}
