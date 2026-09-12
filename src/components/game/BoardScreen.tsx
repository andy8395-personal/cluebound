"use client";

import { useMemo } from "react";
import { DetectiveSilhouette } from "@/components/game/DetectiveSilhouette";
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
import { injectName } from "@/lib/chapters";
import { detectiveName } from "@/lib/names";
import type { CategoryKind } from "@/lib/types";

const KIND_CLASS: Record<CategoryKind, string> = {
  suspects: "banner-suspects",
  weapons: "banner-weapons",
  motives: "banner-motives",
  locations: "banner-locations",
  documents: "banner-documents",
};

export function BoardScreen() {
  const {
    profile,
    chapter,
    level,
    run,
    selected,
    shaking,
    feedback,
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

  const maxStrikes = profile.specialtyPerk === "sharp_instincts" ? 5 : 4;
  const spent = maxStrikes - run.strikesRemaining;

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col px-3 py-4 sm:px-4">
      <header className="dossier-card px-3 py-3 sm:px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-12 w-10 sm:block">
              <DetectiveSilhouette gender={profile.gender} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.7rem] text-[#F8E3C2]/80">
                INVESTIGATOR: {detectiveName(profile.name)}
              </p>
              <p className="truncate font-heading text-sm text-[#F8E3C2] sm:text-base">
                {chapter.caseCode}: {chapter.title}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] tracking-wider text-[#F8E3C2]/55">ERRORS</p>
            <div className="mt-1 flex justify-end gap-1">
              {Array.from({ length: maxStrikes }).map((_, index) => (
                <span
                  key={index}
                  className={`lens ${index < spent ? "is-spent" : ""}`}
                  aria-label={index < spent ? "spent strike" : "remaining strike"}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-[#F8E3C2]/70">
          <span>
            LEVEL {level.phase}/5 · {level.title}
          </span>
          <span>EVIDENCE {solved.length}/4</span>
        </div>
      </header>

      <p className="mt-3 px-1 text-sm leading-relaxed text-[#F8E3C2]/75">
        {injectName(level.briefing, profile.name)}
      </p>

      {feedback ? (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-center text-sm ${
            feedback.kind === "solve" || feedback.kind === "hint"
              ? "bg-[#78350F] text-[#FEF3C7]"
              : "bg-[#DA3633] text-white"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className={`mt-3 space-y-2 ${shaking ? "board-shake" : ""}`}>
        {solved.map((category) => (
          <div key={category.id} className={`category-banner ${KIND_CLASS[category.kind]}`}>
            <p className="font-heading text-[0.7rem] tracking-[0.16em]">{category.title}</p>
            <p className="mt-1 text-sm">{category.tiles.join("  ·  ")}</p>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tiles.map((tile, index) => {
            const isSelected = selected.includes(tile.id);
            const displayIndex = String(index + 1 + solved.length * 4).padStart(2, "0");
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => toggleTile(tile.id)}
                className={`clue-tile ${isSelected ? "is-selected" : ""}`}
              >
                <span className="clue-index">{displayIndex}</span>
                {isSelected ? <span className="pick-badge">✓ PICK</span> : null}
                <span className="clue-label">{tile.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button className="cta-utility h-11" onClick={shuffleBoard}>
          Shuffle
        </Button>
        <Button
          className="cta-utility h-11"
          disabled={run.hintsRemaining <= 0}
          onClick={useHint}
        >
          Hint
          <span className="hint-pill">{run.hintsRemaining}</span>
        </Button>
        <Button className="cta-ghost h-11" onClick={deselectAll} disabled={selected.length === 0}>
          Deselect All
        </Button>
        <Button
          className="cta-primary h-11 col-span-2 sm:col-span-1"
          disabled={selected.length !== 4}
          onClick={analyze}
        >
          Analyze {selected.length}/4
        </Button>
      </div>
      <Button className="cta-ghost mt-2 h-9" onClick={() => setScreen("campaign")}>
        Return to Case Files
      </Button>

      <Dialog open={breakthroughOpen} onOpenChange={(open) => !open && closeBreakthrough()}>
        <DialogContent
          className="border-[#92400E] bg-[#290C16] text-[#F8E3C2] sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="font-heading text-[#FFE885]">Narrative Breakthrough</DialogTitle>
            <DialogDescription className="text-[#F8E3C2]/75">
              Level {level.phase} evidence is locked.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed">{breakthroughText}</p>
          <DialogFooter>
            <Button className="cta-primary h-11 w-full" onClick={closeBreakthrough}>
              {level.phase === 4 ? "Proceed to Accusation" : "Advance Investigation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
