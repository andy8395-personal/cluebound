"use client";

import { useMemo } from "react";
import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LEVEL_NODES, injectName } from "@/lib/chapters";
import type { CategoryKind } from "@/lib/types";

const BANNER: Record<CategoryKind, string> = {
  suspects: "banner-yellow",
  weapons: "banner-red",
  motives: "banner-purple",
  locations: "banner-green",
  documents: "banner-orange",
};

export function BriefScreen() {
  const { chapter, level, run, profile, setScreen } = useGame();
  if (!chapter || !level || !run || !profile) return null;
  const node = LEVEL_NODES.find((item) => item.phase === run.levelPhase);

  return (
    <section className="fun-screen">
      <div className="fun-card text-center">
        <div className="text-5xl">{node?.emoji ?? "🔍"}</div>
        <p className="fun-kicker mt-3">
          {chapter.caseCode} · LEVEL {run.levelPhase}/5
        </p>
        <h2 className="fun-heading">{level.title}</h2>
        <p className="mt-1 text-sm text-[#5B7A84]">{level.subtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-[#2A454D]">
          {injectName(level.briefing, profile.name)}
        </p>
        <Button className="fun-btn fun-btn-primary mt-6 w-full" onClick={() => setScreen("play")}>
          Start Matching!
        </Button>
        <Button className="fun-btn fun-btn-ghost mt-2 w-full" onClick={() => setScreen("map")}>
          Back to Map
        </Button>
      </div>
    </section>
  );
}

export function PlayScreen() {
  const {
    profile,
    chapter,
    level,
    run,
    selected,
    shaking,
    feedback,
    celebrate,
    toggleTile,
    deselectAll,
    shuffleBoard,
    analyze,
    useHint,
    breakthroughOpen,
    breakthroughText,
    closeBreakthrough,
    setScreen,
  } = useGame();

  const tiles = useMemo(() => {
    if (!level || !run) return [];
    const lookup = new Map(
      level.categories.flatMap((category) =>
        category.tiles.map((label) => [
          `${category.id}:${label}`,
          { id: `${category.id}:${label}`, label, categoryId: category.id },
        ]),
      ),
    );
    return run.tileOrder
      .map((id) => lookup.get(id))
      .filter((tile): tile is NonNullable<typeof tile> => Boolean(tile))
      .filter((tile) => !run.solvedCategoryIds.includes(tile.categoryId));
  }, [level, run]);

  const solved = useMemo(() => {
    if (!level || !run) return [];
    return run.solvedCategoryIds
      .map((id) => level.categories.find((category) => category.id === id))
      .filter((category): category is NonNullable<typeof category> => Boolean(category));
  }, [level, run]);

  if (!profile || !chapter || !level || !run) return null;

  return (
    <section className={`fun-screen fun-screen-scroll ${celebrate ? "is-celebrate" : ""}`}>
      <header className="play-hud">
        <div>
          <p className="fun-kicker">
            LVL {run.levelPhase}/5 · {level.title}
          </p>
          <h2 className="font-display text-lg text-white">{chapter.title}</h2>
        </div>
        <div className="play-lives" aria-label="Lives">
          {Array.from({ length: profile.specialtyPerk === "sharp_instincts" ? 5 : 4 }).map(
            (_, index) => {
              const spent =
                (profile.specialtyPerk === "sharp_instincts" ? 5 : 4) - run.strikesRemaining;
              return (
                <span key={index} className={index < spent ? "life is-spent" : "life"}>
                  ❤️
                </span>
              );
            },
          )}
        </div>
      </header>

      <p className="mb-3 text-center text-sm text-white/85">
        Tap 4 connected clues, then Submit
      </p>

      {feedback ? (
        <div
          className={`mb-3 rounded-2xl px-3 py-2 text-center text-sm font-semibold ${
            feedback.kind === "solve" || feedback.kind === "hint"
              ? "bg-[#FDE68A] text-[#78350F]"
              : "bg-[#FECACA] text-[#7F1D1D]"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className={`space-y-2 ${shaking ? "board-shake" : ""}`}>
        {solved.map((category) => (
          <div key={category.id} className={`solved-banner ${BANNER[category.kind]}`}>
            <p className="text-xs font-bold tracking-wide uppercase">{category.title}</p>
            <p className="mt-1 text-sm font-semibold">{category.tiles.join(" · ")}</p>
          </div>
        ))}

        <div className="tile-grid">
          {tiles.map((tile) => {
            const isSelected = selected.includes(tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => toggleTile(tile.id)}
                className={`fun-tile ${isSelected ? "is-selected" : ""}`}
              >
                {tile.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button className="fun-btn fun-btn-secondary" onClick={shuffleBoard}>
          Shuffle
        </Button>
        <Button
          className="fun-btn fun-btn-secondary"
          disabled={run.hintsRemaining <= 0}
          onClick={useHint}
        >
          Hint {run.hintsRemaining}
        </Button>
        <Button
          className="fun-btn fun-btn-secondary"
          disabled={selected.length === 0}
          onClick={deselectAll}
        >
          Clear
        </Button>
      </div>
      <Button
        className="fun-btn fun-btn-primary mt-3 w-full"
        disabled={selected.length !== 4}
        onClick={analyze}
      >
        Submit {selected.length}/4
      </Button>
      <Button className="fun-btn fun-btn-ghost mt-2 w-full" onClick={() => setScreen("map")}>
        Map
      </Button>

      <Dialog open={breakthroughOpen} onOpenChange={(open) => !open && closeBreakthrough()}>
        <DialogContent className="fun-dialog" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#0F766E]">
              Level Cleared! 🎉
            </DialogTitle>
            <DialogDescription className="text-[#3D5A63]">
              {chapter.caseCode} · Level {run.levelPhase}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-[#243B42]">{breakthroughText}</p>
          <DialogFooter>
            <Button className="fun-btn fun-btn-primary w-full" onClick={closeBreakthrough}>
              Back to Map
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
