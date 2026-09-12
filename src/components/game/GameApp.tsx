"use client";

import { AccusationScreen } from "@/components/game/AccusationScreen";
import { BoardScreen } from "@/components/game/BoardScreen";
import { BriefingScreen } from "@/components/game/BriefingScreen";
import { CampaignScreen } from "@/components/game/CampaignScreen";
import { DossierScreen } from "@/components/game/DossierScreen";
import { GameOverScreen, VictoryScreen } from "@/components/game/EndScreens";
import { GameProvider, useGame } from "@/components/game/GameProvider";
import { TitleScreen } from "@/components/game/TitleScreen";

function ScreenSwitch() {
  const { ready, screen } = useGame();
  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm tracking-[0.2em] text-[#F8E3C2]/70">
        OPENING DOSSIER…
      </div>
    );
  }

  switch (screen) {
    case "dossier":
      return <DossierScreen />;
    case "campaign":
      return <CampaignScreen />;
    case "briefing":
      return <BriefingScreen />;
    case "board":
      return <BoardScreen />;
    case "accusation":
      return <AccusationScreen />;
    case "victory":
      return <VictoryScreen />;
    case "gameover":
      return <GameOverScreen />;
    default:
      return <TitleScreen />;
  }
}

export function GameApp() {
  return (
    <GameProvider>
      <div className="app-shell flex min-h-dvh flex-1 flex-col">
        <ScreenSwitch />
      </div>
    </GameProvider>
  );
}
