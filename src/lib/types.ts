export type Gender = "male" | "female";
export type SpecialtyPerk = "deductive_reasoning" | "sharp_instincts";

export type CategoryKind =
  | "suspects"
  | "weapons"
  | "motives"
  | "locations"
  | "documents";

export type PlayerProfile = {
  gender: Gender;
  name: string;
  isCustomName: boolean;
  specialtyPerk: SpecialtyPerk;
  casesSolved: number;
  currentChapter: number;
};

export type ChapterProgress = {
  completedChapterIds: string[];
  levelCleared: Record<string, number>;
};

export type ActiveRun = {
  chapterId: string;
  levelPhase: 1 | 2 | 3 | 4 | 5;
  strikesRemaining: number;
  hintsRemaining: number;
  solvedCategoryIds: string[];
  tileOrder: string[];
};

export type SaveState = {
  playerProfile: PlayerProfile | null;
  chapterProgress: ChapterProgress;
  activeRun: ActiveRun | null;
};

export type PuzzleCategory = {
  id: string;
  title: string;
  kind: CategoryKind;
  tiles: string[];
};

export type PuzzleLevel = {
  phase: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  briefing: string;
  breakthrough: string;
  categories: PuzzleCategory[];
};

export type Accusation = {
  culprit: string;
  weapon: string;
  location: string;
  motive: string;
};

export type Chapter = {
  id: string;
  number: number;
  caseCode: string;
  title: string;
  setting: string;
  victim: string;
  summary: string;
  blurb: string;
  emoji: string;
  accent: string;
  solution: Accusation;
  accusationOptions: {
    culprits: string[];
    weapons: string[];
    locations: string[];
    motives: string[];
  };
  levels: PuzzleLevel[];
  closing: string;
};

export type Screen =
  | "home"
  | "setup"
  | "stories"
  | "map"
  | "brief"
  | "play"
  | "solve"
  | "clear"
  | "fail";

export type LevelNode = {
  phase: 1 | 2 | 3 | 4 | 5;
  title: string;
  emoji: string;
  kind: "puzzle" | "finale";
};
