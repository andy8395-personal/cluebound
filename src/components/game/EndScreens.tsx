"use client";

import { DetectiveSilhouette } from "@/components/game/DetectiveSilhouette";
import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { chapters } from "@/lib/chapters";
import { detectiveName } from "@/lib/names";

export function VictoryScreen() {
  const { profile, save, setScreen, startChapter } = useGame();
  const lastId = save.chapterProgress.completedChapterIds.at(-1);
  const chapter = chapters.find((item) => item.id === lastId) ?? chapters[0];
  if (!profile) return null;

  const next = chapters.find((item) => item.number === chapter.number + 1);
  const campaignComplete = save.chapterProgress.completedChapterIds.length >= chapters.length;

  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-8">
      <article className="dossier-card overflow-hidden px-5 py-7 text-center sm:px-8">
        <div className="mx-auto h-28 w-24">
          <DetectiveSilhouette gender={profile.gender} />
        </div>
        <p className="mt-2 text-[0.65rem] tracking-[0.28em] text-brass">CASE CLOSED</p>
        <h2 className="font-heading text-3xl text-[#FFE885]">{chapter.title}</h2>
        <p className="mt-3 font-heading text-lg text-[#F8E3C2]">
          {detectiveName(profile.name)} delivers the charge.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#F8E3C2]/80">{chapter.closing}</p>
        <p className="mt-4 text-sm text-[#FDE68A]">
          {chapter.solution.culprit} · {chapter.solution.weapon} · {chapter.solution.location} ·{" "}
          {chapter.solution.motive}
        </p>
        {campaignComplete ? (
          <p className="mt-4 text-sm text-[#F8E3C2]/70">
            Three files. Three killers. The bureau will remember this run.
          </p>
        ) : null}
        <div className="mt-7 flex flex-col gap-2">
          {next ? (
            <Button className="cta-primary h-12" onClick={() => startChapter(next.id)}>
              Open {next.caseCode}
            </Button>
          ) : null}
          <Button className="cta-utility h-11" onClick={() => setScreen("campaign")}>
            Return to Case Files
          </Button>
        </div>
      </article>
    </section>
  );
}

export function GameOverScreen() {
  const { profile, chapter, retryChapter, setScreen } = useGame();
  if (!profile) return null;

  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-8">
      <article className="dossier-card px-5 py-7 text-center sm:px-8">
        <p className="text-[0.65rem] tracking-[0.28em] text-[#DA3633]">FILE COMPROMISED</p>
        <h2 className="mt-2 font-heading text-3xl text-[#F8E3C2]">The trail went cold</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#F8E3C2]/75">
          {detectiveName(profile.name)} spent the last strike
          {chapter ? ` on ${chapter.title}` : ""}. The killer still walks the rooms you
          mapped. Request a fresh board from the bureau.
        </p>
        <Button className="cta-primary mt-7 h-12 w-full" onClick={retryChapter}>
          Restart Chapter
        </Button>
        <Button className="cta-ghost mt-2 h-10 w-full" onClick={() => setScreen("campaign")}>
          Return to Case Files
        </Button>
      </article>
    </section>
  );
}
