"use client";

import { PhaseRail } from "@/components/game/PhaseRail";
import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";

export function TitleScreen() {
  const { profile, save, setScreen, continueRun } = useGame();
  const hasProfile = Boolean(profile);
  const hasRun = Boolean(save.activeRun);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="dossier-card w-full max-w-lg px-6 py-10 text-center sm:px-10">
        <div className="wax-seal" aria-hidden>
          C
        </div>
        <p className="font-heading text-[0.7rem] tracking-[0.35em] text-brass">
          BUREAU OF INVESTIGATION
        </p>
        <div className="mx-auto my-5 h-px w-24 bg-linear-to-r from-transparent via-[#F59E0B] to-transparent" />
        <h1 className="font-heading text-4xl leading-tight text-[#F8E3C2] sm:text-5xl">
          Cluebound
        </h1>
        <p className="mt-2 font-heading text-lg text-[#D97706]">Murder Connections</p>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[#F8E3C2]/75">
          Unravel the evidence. Unmask the killer. Sixteen clues. Four hidden
          groups. One accusation that has to hold.
        </p>
        <div className="mt-5">
          <PhaseRail current={1} />
        </div>
        <div className="mt-8 flex flex-col gap-3">
          {hasRun ? (
            <Button className="cta-primary h-12 w-full text-base" onClick={continueRun}>
              Resume Active Case
            </Button>
          ) : null}
          <Button
            className={hasRun ? "cta-utility h-12 w-full text-base" : "cta-primary h-12 w-full text-base"}
            onClick={() => setScreen(hasProfile ? "campaign" : "dossier")}
          >
            {hasProfile ? "Open Case Files" : "Create Investigator"}
          </Button>
          {hasProfile ? (
            <Button
              className="cta-ghost h-11 w-full"
              onClick={() => setScreen("dossier")}
            >
              Amend Dossier
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
