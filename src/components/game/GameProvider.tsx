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
  level: PuzzleLevel | null;
  run: ActiveRun | null;
  selected: string[];
  shaking: boolean;
  feedback: Feedback;
  breakthroughOpen: boolean;
  breakthroughText: string;
  saveProfile: (profile: PlayerProfile) => void;
  startChapter: (chapterId: string) => void;
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
  retryChapter: () => void;
  resetInvestigator: () => void;
  isChapterUnlocked: (chapterId: string) => boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [save, setSave] = useState<SaveState>(emptySave());
  const [screen, setScreen] = useState<Screen>("title");
  const [selected, setSelected] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [breakthroughOpen, setBreakthroughOpen] = useState(false);
  const [breakthroughText, setBreakthroughText] = useState("");
  const pendingAdvanceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const loaded = loadSave();
      setSave(loaded);
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
  const chapter = run ? getChapter(run.chapterId) : null;
  const level =
    chapter && run && run.levelPhase <= 4
      ? getLevel(chapter, run.levelPhase as 1 | 2 | 3 | 4)
      : null;

  const updateRun = useCallback((patch: Partial<ActiveRun>) => {
    setSave((prev) => {
      if (!prev.activeRun) return prev;
      return { ...prev, activeRun: { ...prev.activeRun, ...patch } };
    });
  }, []);

  const saveProfile = useCallback((next: PlayerProfile) => {
    setSave((prev) => ({ ...prev, playerProfile: next }));
    setScreen("campaign");
  }, []);

  const buildRun = useCallback((chapterId: string, perk: SpecialtyPerk): ActiveRun => {
    const found = getChapter(chapterId);
    const first = found?.levels[0];
    const tiles = first ? flattenTiles(first).map((tile) => tile.id) : [];
    return {
      chapterId,
      levelPhase: 1,
      strikesRemaining: maxStrikes(perk),
      hintsRemaining: startingHints(perk),
      solvedCategoryIds: [],
      tileOrder: shuffle(tiles),
    };
  }, []);

  const startChapter = useCallback(
    (chapterId: string) => {
      if (!profile) return;
      const nextRun = buildRun(chapterId, profile.specialtyPerk);
      setSave((prev) => ({ ...prev, activeRun: nextRun }));
      setSelected([]);
      setFeedback(null);
      setScreen("briefing");
    },
    [buildRun, profile],
  );

  const continueRun = useCallback(() => {
    if (!save.activeRun) return;
    setSelected([]);
    setFeedback(null);
    setScreen(save.activeRun.levelPhase === 5 ? "accusation" : "board");
  }, [save.activeRun]);

  const isChapterUnlocked = useCallback(
    (chapterId: string) => {
      const index = chapters.findIndex((item) => item.id === chapterId);
      if (index <= 0) return true;
      const previous = chapters[index - 1];
      return save.chapterProgress.completedChapterIds.includes(previous.id);
    },
    [save.chapterProgress.completedChapterIds],
  );

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
      if (!run || !profile) return;
      setShaking(true);
      window.setTimeout(() => setShaking(false), 520);
      const nextStrikes = run.strikesRemaining - 1;
      setFeedback({ kind, message });
      if (nextStrikes <= 0) {
        updateRun({ strikesRemaining: 0 });
        window.setTimeout(() => setScreen("gameover"), 700);
        return;
      }
      updateRun({ strikesRemaining: nextStrikes });
    },
    [profile, run, updateRun],
  );

  const advanceAfterSolve = useCallback(
    (chapterData: Chapter, currentPhase: 1 | 2 | 3 | 4, perk: SpecialtyPerk) => {
      const nextPhase = (currentPhase + 1) as 2 | 3 | 4 | 5;
      if (nextPhase === 5) {
        setSave((prev) => ({
          ...prev,
          activeRun: prev.activeRun
            ? {
                ...prev.activeRun,
                levelPhase: 5,
                solvedCategoryIds: [],
                tileOrder: [],
              }
            : prev.activeRun,
        }));
        setSelected([]);
        setScreen("accusation");
        return;
      }
      const nextLevel = getLevel(chapterData, nextPhase);
      const tiles = nextLevel ? flattenTiles(nextLevel).map((tile) => tile.id) : [];
      setSave((prev) => ({
        ...prev,
        activeRun: prev.activeRun
          ? {
              ...prev.activeRun,
              levelPhase: nextPhase,
              solvedCategoryIds: [],
              tileOrder: shuffle(tiles),
              hintsRemaining: Math.max(
                prev.activeRun.hintsRemaining,
                nextPhase === 1 ? startingHints(perk) : prev.activeRun.hintsRemaining,
              ),
            }
          : prev.activeRun,
      }));
      setSelected([]);
      setScreen("board");
    },
    [],
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
      setFeedback({
        kind: "solve",
        message: category ? `Solved: ${category.title}` : "Category locked.",
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
    failGuess(three ? "1 tile off!" : "The grouping does not hold.", three ? "off" : "miss");
  }, [chapter, failGuess, level, profile, run, selected, updateRun]);

  const closeBreakthrough = useCallback(() => {
    setBreakthroughOpen(false);
    if (!pendingAdvanceRef.current || !run || !chapter || !profile || !level) return;
    pendingAdvanceRef.current = false;
    advanceAfterSolve(chapter, level.phase, profile.specialtyPerk);
  }, [advanceAfterSolve, chapter, level, profile, run]);

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
      message: `Hint: two tiles from “${target.title}” are marked. Find the other pair.`,
    });
  }, [level, run, updateRun]);

  const submitAccusation = useCallback(
    (pick: { culprit: string; weapon: string; location: string; motive: string }) => {
      if (!chapter || !run || !profile) return false;
      const { solution } = chapter;
      const correct =
        pick.culprit === solution.culprit &&
        pick.weapon === solution.weapon &&
        pick.location === solution.location &&
        pick.motive === solution.motive;
      if (correct) {
        setSave((prev) => {
          const completed = new Set(prev.chapterProgress.completedChapterIds);
          completed.add(chapter.id);
          const solvedCount = completed.size;
          return {
            playerProfile: prev.playerProfile
              ? {
                  ...prev.playerProfile,
                  casesSolved: solvedCount,
                  currentChapter: Math.min(3, chapter.number + 1),
                }
              : prev.playerProfile,
            chapterProgress: { completedChapterIds: [...completed] },
            activeRun: null,
          };
        });
        setScreen("victory");
        return true;
      }
      const nextStrikes = run.strikesRemaining - 1;
      setFeedback({
        kind: "accuse-miss",
        message: "The accusation does not survive cross-examination.",
      });
      if (nextStrikes <= 0) {
        updateRun({ strikesRemaining: 0 });
        setScreen("gameover");
        return false;
      }
      updateRun({ strikesRemaining: nextStrikes });
      return false;
    },
    [chapter, profile, run, updateRun],
  );

  const retryChapter = useCallback(() => {
    if (!run || !profile) return;
    startChapter(run.chapterId);
  }, [profile, run, startChapter]);

  const resetInvestigator = useCallback(() => {
    clearSave();
    setSave(emptySave());
    setSelected([]);
    setFeedback(null);
    setScreen("dossier");
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      ready,
      screen,
      setScreen,
      save,
      profile,
      chapter,
      level,
      run,
      selected,
      shaking,
      feedback,
      breakthroughOpen,
      breakthroughText,
      saveProfile,
      startChapter,
      continueRun,
      toggleTile,
      deselectAll,
      shuffleBoard,
      analyze,
      useHint,
      closeBreakthrough,
      submitAccusation,
      retryChapter,
      resetInvestigator,
      isChapterUnlocked,
    }),
    [
      analyze,
      breakthroughOpen,
      breakthroughText,
      chapter,
      closeBreakthrough,
      continueRun,
      deselectAll,
      feedback,
      isChapterUnlocked,
      level,
      profile,
      ready,
      resetInvestigator,
      retryChapter,
      run,
      save,
      saveProfile,
      screen,
      selected,
      shaking,
      shuffleBoard,
      startChapter,
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
