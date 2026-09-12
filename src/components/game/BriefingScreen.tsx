"use client";

import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { injectName } from "@/lib/chapters";

export function BriefingScreen() {
  const { chapter, profile, setScreen } = useGame();
  if (!chapter || !profile) return null;

  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-8">
      <article className="dossier-card px-5 py-7 sm:px-8">
        <p className="text-center text-[0.65rem] tracking-[0.28em] text-brass">
          {chapter.caseCode} · BRIEFING
        </p>
        <h2 className="mt-2 text-center font-heading text-3xl text-[#F8E3C2]">
          {chapter.title}
        </h2>
        <p className="mt-2 text-center text-sm text-[#D97706]">{chapter.setting}</p>
        <div className="mt-5 space-y-3 text-sm leading-relaxed text-[#F8E3C2]/80">
          <p>{chapter.summary}</p>
          <p>
            Det. {profile.name} takes the case. Five phases remain: Scene, Documents,
            Timeline, Interrogation, and the final Accusation.
          </p>
          <p className="text-[#F8E3C2]/65">
            {injectName(chapter.levels[0].briefing, profile.name)}
          </p>
        </div>
        <Button className="cta-primary mt-7 h-12 w-full text-base" onClick={() => setScreen("board")}>
          Pin Evidence to the Board
        </Button>
      </article>
    </section>
  );
}
