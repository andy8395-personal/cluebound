import { chapters, FEMALE_PRESET, getLevel } from "@/lib/chapters";
import { shuffle } from "@/lib/shuffle";
import type { ActiveRun, PlayerProfile, SaveState, Screen } from "@/lib/types";

export type TourId =
  | "title"
  | "dossier"
  | "campaign"
  | "briefing"
  | "board"
  | "accusation"
  | "victory";

const CHAPTER_ID = "case_01_silent_inheritance";

export function demoProfile(): PlayerProfile {
  return {
    gender: "female",
    name: FEMALE_PRESET,
    isCustomName: false,
    specialtyPerk: "deductive_reasoning",
    casesSolved: 0,
    currentChapter: 1,
  };
}

function flattenIds(phase: 1 | 2 | 3 | 4) {
  const chapter = chapters[0];
  const level = getLevel(chapter, phase);
  if (!level) return [];
  return level.categories.flatMap((category) =>
    category.tiles.map((label) => `${category.id}:${label}`),
  );
}

function runFor(phase: 1 | 2 | 3 | 4 | 5, solved: string[] = []): ActiveRun {
  if (phase === 5) {
    return {
      chapterId: CHAPTER_ID,
      levelPhase: 5,
      strikesRemaining: 4,
      hintsRemaining: 2,
      solvedCategoryIds: [],
      tileOrder: [],
    };
  }
  return {
    chapterId: CHAPTER_ID,
    levelPhase: phase,
    strikesRemaining: 4,
    hintsRemaining: 2,
    solvedCategoryIds: solved,
    tileOrder: shuffle(flattenIds(phase)),
  };
}

export function buildTour(tour: TourId): {
  save: SaveState;
  screen: Screen;
  selected: string[];
} {
  const profile = demoProfile();
  if (tour === "title") {
    return { save: { playerProfile: null, chapterProgress: { completedChapterIds: [] }, activeRun: null }, screen: "title", selected: [] };
  }
  if (tour === "dossier") {
    return { save: { playerProfile: null, chapterProgress: { completedChapterIds: [] }, activeRun: null }, screen: "dossier", selected: [] };
  }
  if (tour === "campaign") {
    return {
      save: { playerProfile: profile, chapterProgress: { completedChapterIds: [] }, activeRun: null },
      screen: "campaign",
      selected: [],
    };
  }
  if (tour === "briefing") {
    return {
      save: { playerProfile: profile, chapterProgress: { completedChapterIds: [] }, activeRun: runFor(1) },
      screen: "briefing",
      selected: [],
    };
  }
  if (tour === "board") {
    return {
      save: { playerProfile: profile, chapterProgress: { completedChapterIds: [] }, activeRun: runFor(1) },
      screen: "board",
      selected: [
        "c1l1-suspects:Butler",
        "c1l1-suspects:Nephew",
        "c1l1-suspects:Maid",
        "c1l1-suspects:Doctor",
      ],
    };
  }
  if (tour === "accusation") {
    return {
      save: { playerProfile: profile, chapterProgress: { completedChapterIds: [] }, activeRun: runFor(5) },
      screen: "accusation",
      selected: [],
    };
  }
  return {
    save: {
      playerProfile: { ...profile, casesSolved: 1, currentChapter: 2 },
      chapterProgress: { completedChapterIds: [CHAPTER_ID] },
      activeRun: null,
    },
    screen: "victory",
    selected: [],
  };
}

export function readTourParam(): TourId | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("tour");
  if (
    value === "title" ||
    value === "dossier" ||
    value === "campaign" ||
    value === "briefing" ||
    value === "board" ||
    value === "accusation" ||
    value === "victory"
  ) {
    return value;
  }
  return null;
}
