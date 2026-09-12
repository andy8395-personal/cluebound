"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { chapters, FEMALE_PRESET, getChapter, getLevel, MALE_PRESET } from "@/lib/chapters";
import { clearSave, emptySave, loadSave, persistSave } from "@/lib/save";
import { shuffle } from "@/lib/shuffle";
import type {
  ActiveRun,
  Chapter,
  Gender,
  PlayerProfile,
  PuzzleLevel,
  SaveState,
  Screen,
  SpecialtyPerk,
} from "@/lib/types";

const MAX_SELECT = 4;

function maxStrikes(perk: SpecialtyPerk) {
  return perk === "sharp_instincts" ? 5 : 4;
}

function startingHints(perk: SpecialtyPerk) {
  return perk === "deductive_reasoning" ? 2 : 1;
}

function flattenTiles(level: PuzzleLevel) {
  return level.categories.flatMap((category) =>
    category.tiles.map((label) => ({
      id: `${category.id}:${label}`,
      label,
      categoryId: category.id,
    })),
  );
}

type Feedback = {
  kind: "off" | "miss" | "solve" | "hint" | "accuse-miss";
  message: string;
} | null;

type GameContextValue = {
  ready: boolean;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  save: SaveState;
  profile: PlayerProfile | null;
  chapter: Chapter | null;
  focusedChapterId: string | null;
  level: PuzzleLevel | null;
  run: ActiveRun | null;
  selected: string[];
  shaking: boolean;
  feedback: Feedback;
  breakthroughOpen: boolean;
  breakthroughText: string;
  celebrate: boolean;
  saveProfile: (profile: PlayerProfile) => void;
  openStory: (chapterId: string) => void;
  playLevel: (chapterId: string, phase: 1 | 2 | 3 | 4 | 5) => void;
  continueRun: () => void;
  toggleTile: (tileId: string) => void;
  deselectAll: () => void;
  shuffleBoard: () => void;
  analyze: () => void;
  useHint: () => void;
  closeBreakthrough: () => void;
  submitAccusation: (pick: {
    culprit: string;
    weapon: string;
    location: string;
    motive: string;
  }) => boolean;
  retryLevel: () => void;
  resetInvestigator: () => void;
  isChapterUnlocked: (chapterId: string) => boolean;
  levelCleared: (chapterId: string) => number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [save, setSave] = useState<SaveState>(emptySave());
  const [screen, setScreen] = useState<Screen>("home");
  const [focusedChapterId, setFocusedChapterId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [breakthroughOpen, setBreakthroughOpen] = useState(false);
  const [breakthroughText, setBreakthroughText] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const pendingAdvanceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const loaded = loadSave();
      setSave(loaded);
      if (loaded.playerProfile) setScreen("stories");
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    persistSave(save);
  }, [ready, save]);

  const profile = save.playerProfile;
  const run = save.activeRun;
  const chapter = run
    ? getChapter(run.chapterId)
    : focusedChapterId
      ? getChapter(focusedChapterId)
      : null;
  const level =
    chapter && run && run.levelPhase <= 4
      ? getLevel(chapter, run.levelPhase as 1 | 2 | 3 | 4)
      : null;

  const levelCleared = useCallback(
    (chapterId: string) => save.chapterProgress.levelCleared[chapterId] ?? 0,
    [save.chapterProgress.levelCleared],
  );

  const isChapterUnlocked = useCallback(
    (chapterId: string) => {
      const index = chapters.findIndex((item) => item.id === chapterId);
      if (index <= 0) return true;
      return save.chapterProgress.completedChapterIds.includes(chapters[index - 1].id);
    },
    [save.chapterProgress.completedChapterIds],
  );

  const updateRun = useCallback((patch: Partial<ActiveRun>) => {
    setSave((prev) => {
      if (!prev.activeRun) return prev;
      return { ...prev, activeRun: { ...prev.activeRun, ...patch } };
    });
  }, []);

  const saveProfile = useCallback((next: PlayerProfile) => {
    setSave((prev) => ({ ...prev, playerProfile: next }));
    setScreen("stories");
  }, []);

  const buildRun = useCallback(
    (chapterId: string, phase: 1 | 2 | 3 | 4 | 5, perk: SpecialtyPerk): ActiveRun => {
      if (phase === 5) {
        return {
          chapterId,
          levelPhase: 5,
          strikesRemaining: maxStrikes(perk),
          hintsRemaining: startingHints(perk),
          solvedCategoryIds: [],
          tileOrder: [],
        };
      }
      const found = getChapter(chapterId);
      const puzzle = found ? getLevel(found, phase) : null;
      const tiles = puzzle ? flattenTiles(puzzle).map((tile) => tile.id) : [];
      return {
        chapterId,
        levelPhase: phase,
        strikesRemaining: maxStrikes(perk),
        hintsRemaining: startingHints(perk),
        solvedCategoryIds: [],
        tileOrder: shuffle(tiles),
      };
    },
    [],
  );

  const openStory = useCallback((chapterId: string) => {
    setFocusedChapterId(chapterId);
    setScreen("map");
  }, []);

  const playLevel = useCallback(
    (chapterId: string, phase: 1 | 2 | 3 | 4 | 5) => {
      if (!profile) return;
      if (phase > levelCleared(chapterId) + 1) return;
      setFocusedChapterId(chapterId);
      setSave((prev) => ({
        ...prev,
        activeRun: buildRun(chapterId, phase, profile.specialtyPerk),
      }));
      setSelected([]);
      setFeedback(null);
      setCelebrate(false);
      setScreen(phase === 5 ? "solve" : "brief");
    },
    [buildRun, levelCleared, profile],
  );

  const continueRun = useCallback(() => {
    if (!save.activeRun) return;
    setFocusedChapterId(save.activeRun.chapterId);
    setSelected([]);
    setFeedback(null);
    setScreen(save.activeRun.levelPhase === 5 ? "solve" : "play");
  }, [save.activeRun]);

  const markLevelCleared = useCallback((chapterId: string, phase: number) => {
    setSave((prev) => {
      const current = prev.chapterProgress.levelCleared[chapterId] ?? 0;
      const nextCleared = Math.max(current, phase);
      const completed = new Set(prev.chapterProgress.completedChapterIds);
      if (nextCleared >= 5) completed.add(chapterId);
      const solvedCount = completed.size;
      return {
        ...prev,
        playerProfile: prev.playerProfile
          ? {
              ...prev.playerProfile,
              casesSolved: solvedCount,
              currentChapter: Math.min(3, solvedCount + 1),
            }
          : prev.playerProfile,
        chapterProgress: {
          completedChapterIds: [...completed],
          levelCleared: {
            ...prev.chapterProgress.levelCleared,
            [chapterId]: nextCleared,
          },
        },
        activeRun: null,
      };
    });
  }, []);

  const toggleTile = useCallback((tileId: string) => {
    setFeedback(null);
    setSelected((prev) => {
      if (prev.includes(tileId)) return prev.filter((id) => id !== tileId);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, tileId];
    });
  }, []);

  const deselectAll = useCallback(() => {
    setSelected([]);
    setFeedback(null);
  }, []);

  const shuffleBoard = useCallback(() => {
    if (!run || !level) return;
    const unsolved = run.tileOrder.filter((id) => {
      const categoryId = id.split(":")[0];
      return !run.solvedCategoryIds.includes(categoryId);
    });
    const shuffled = shuffle(unsolved);
    const nextOrder = [...run.tileOrder];
    let cursor = 0;
    for (let i = 0; i < nextOrder.length; i += 1) {
      const categoryId = nextOrder[i].split(":")[0];
      if (!run.solvedCategoryIds.includes(categoryId)) {
        nextOrder[i] = shuffled[cursor];
        cursor += 1;
      }
    }
    updateRun({ tileOrder: nextOrder });
  }, [level, run, updateRun]);

  const failGuess = useCallback(
    (message: string, kind: "off" | "miss") => {
      if (!run) return;
      setShaking(true);
      window.setTimeout(() => setShaking(false), 480);
      const next = run.strikesRemaining - 1;
      setFeedback({ kind, message });
      if (next <= 0) {
        updateRun({ strikesRemaining: 0 });
        window.setTimeout(() => setScreen("fail"), 650);
        return;
      }
      updateRun({ strikesRemaining: next });
    },
    [run, updateRun],
  );

  const analyze = useCallback(() => {
    if (!run || !level || !chapter || !profile) return;
    if (selected.length !== 4) return;

    const groups = new Map<string, string[]>();
    for (const id of selected) {
      const categoryId = id.split(":")[0];
      groups.set(categoryId, [...(groups.get(categoryId) ?? []), id]);
    }

    const perfect = [...groups.entries()].find(([, ids]) => ids.length === 4);
    if (perfect) {
      const [categoryId] = perfect;
      if (run.solvedCategoryIds.includes(categoryId)) return;
      const solved = [...run.solvedCategoryIds, categoryId];
      const category = level.categories.find((item) => item.id === categoryId);
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 700);
      setFeedback({
        kind: "solve",
        message: category ? `Nice! ${category.title}` : "Group locked!",
      });
      setSelected([]);
      if (solved.length >= 4) {
        setBreakthroughText(level.breakthrough.replaceAll("{name}", profile.name));
        pendingAdvanceRef.current = true;
        setBreakthroughOpen(true);
        updateRun({ solvedCategoryIds: solved });
        return;
      }
      updateRun({ solvedCategoryIds: solved });
      return;
    }

    const three = [...groups.values()].some((ids) => ids.length === 3);
    failGuess(three ? "So close! 1 tile off" : "Not a match — try again", three ? "off" : "miss");
  }, [chapter, failGuess, level, profile, run, selected, updateRun]);

  const closeBreakthrough = useCallback(() => {
    setBreakthroughOpen(false);
    if (!pendingAdvanceRef.current || !run) return;
    pendingAdvanceRef.current = false;
    markLevelCleared(run.chapterId, run.levelPhase);
    setFocusedChapterId(run.chapterId);
    setScreen("map");
  }, [markLevelCleared, run]);

  const useHint = useCallback(() => {
    if (!run || !level || run.hintsRemaining <= 0) return;
    const remaining = level.categories.filter(
      (category) => !run.solvedCategoryIds.includes(category.id),
    );
    if (remaining.length === 0) return;
    const target = remaining[0];
    const tileIds = flattenTiles(level)
      .filter((tile) => tile.categoryId === target.id)
      .map((tile) => tile.id);
    setSelected(tileIds.slice(0, 2));
    updateRun({ hintsRemaining: run.hintsRemaining - 1 });
    setFeedback({
      kind: "hint",
      message: `Hint: 2 tiles from “${target.title}” are lit. Find the pair!`,
    });
  }, [level, run, updateRun]);

  const submitAccusation = useCallback(
    (pick: { culprit: string; weapon: string; location: string; motive: string }) => {
      if (!chapter || !run) return false;
      const { solution } = chapter;
      const correct =
        pick.culprit === solution.culprit &&
        pick.weapon === solution.weapon &&
        pick.location === solution.location &&
        pick.motive === solution.motive;
      if (correct) {
        markLevelCleared(chapter.id, 5);
        setScreen("clear");
        return true;
      }
      const next = run.strikesRemaining - 1;
      setFeedback({
        kind: "accuse-miss",
        message: "Not quite — the case still has holes.",
      });
      if (next <= 0) {
        updateRun({ strikesRemaining: 0 });
        setScreen("fail");
        return false;
      }
      updateRun({ strikesRemaining: next });
      return false;
    },
    [chapter, markLevelCleared, run, updateRun],
  );

  const retryLevel = useCallback(() => {
    if (!run || !profile) return;
    playLevel(run.chapterId, run.levelPhase);
  }, [playLevel, profile, run]);

  const resetInvestigator = useCallback(() => {
    clearSave();
    setSave(emptySave());
    setSelected([]);
    setFeedback(null);
    setFocusedChapterId(null);
    setScreen("setup");
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      ready,
      screen,
      setScreen,
      save,
      profile,
      chapter,
      focusedChapterId,
      level,
      run,
      selected,
      shaking,
      feedback,
      breakthroughOpen,
      breakthroughText,
      celebrate,
      saveProfile,
      openStory,
      playLevel,
      continueRun,
      toggleTile,
      deselectAll,
      shuffleBoard,
      analyze,
      useHint,
      closeBreakthrough,
      submitAccusation,
      retryLevel,
      resetInvestigator,
      isChapterUnlocked,
      levelCleared,
    }),
    [
      analyze,
      breakthroughOpen,
      breakthroughText,
      celebrate,
      chapter,
      closeBreakthrough,
      continueRun,
      deselectAll,
      feedback,
      focusedChapterId,
      isChapterUnlocked,
      level,
      levelCleared,
      openStory,
      playLevel,
      profile,
      ready,
      resetInvestigator,
      retryLevel,
      run,
      save,
      saveProfile,
      screen,
      selected,
      shaking,
      shuffleBoard,
      submitAccusation,
      toggleTile,
      useHint,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function defaultName(gender: Gender) {
  return gender === "male" ? MALE_PRESET : FEMALE_PRESET;
}
