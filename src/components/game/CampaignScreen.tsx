"use client";

import { DetectiveSilhouette } from "@/components/game/DetectiveSilhouette";
import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { chapters } from "@/lib/chapters";
import { detectiveName } from "@/lib/names";

export function CampaignScreen() {
  const {
    profile,
    save,
    startChapter,
    continueRun,
    isChapterUnlocked,
    setScreen,
    resetInvestigator,
  } = useGame();

  if (!profile) return null;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
      <header className="dossier-card flex items-center gap-4 px-4 py-4">
        <div className="h-16 w-14 shrink-0">
          <DetectiveSilhouette gender={profile.gender} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] tracking-[0.22em] text-brass">LEAD INVESTIGATOR</p>
          <h2 className="truncate font-heading text-xl text-[#F8E3C2]">
            {detectiveName(profile.name)}
          </h2>
          <p className="text-xs text-[#F8E3C2]/65">
            Cases closed: {profile.casesSolved} · Perk:{" "}
            {profile.specialtyPerk === "deductive_reasoning"
              ? "Deductive Reasoning"
              : "Sharp Instincts"}
          </p>
        </div>
      </header>

      {save.activeRun ? (
        <Button className="cta-primary mt-4 h-11" onClick={continueRun}>
          Resume unfinished chapter
        </Button>
      ) : null}

      <div className="mt-5 space-y-4">
        {chapters.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter.id);
          const complete = save.chapterProgress.completedChapterIds.includes(chapter.id);
          return (
            <article key={chapter.id} className="dossier-card px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] text-brass">
                    {chapter.caseCode}
                    {complete ? " · CLOSED" : unlocked ? " · OPEN" : " · SEALED"}
                  </p>
                  <h3 className="font-heading text-xl text-[#F8E3C2]">{chapter.title}</h3>
                  <p className="mt-1 text-xs text-[#F8E3C2]/60">{chapter.setting}</p>
                </div>
                <span className="rounded-full border border-[#EAB308]/70 bg-[#3B1222] px-2 py-1 text-[0.65rem] tracking-wider text-[#FFE885]">
                  LVL 1–5
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#F8E3C2]/75">{chapter.summary}</p>
              <p className="mt-2 text-xs text-[#A89080]">Victim: {chapter.victim}</p>
              <Button
                className="cta-primary mt-4 h-11 w-full sm:w-auto"
                disabled={!unlocked}
                onClick={() => startChapter(chapter.id)}
              >
                {complete ? "Reopen Case" : unlocked ? "Begin Investigation" : "Prior Case Required"}
              </Button>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button className="cta-utility h-10 flex-1" onClick={() => setScreen("title")}>
          Main Desk
        </Button>
        <Button className="cta-ghost h-10 flex-1" onClick={resetInvestigator}>
          New Investigator
        </Button>
      </div>
    </section>
  );
}
