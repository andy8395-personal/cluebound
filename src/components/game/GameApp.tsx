"use client";

import { HomeScreen, SetupScreen } from "@/components/game/HomeSetup";
import { BriefScreen, PlayScreen } from "@/components/game/PlayScreens";
import { ClearScreen, FailScreen, SolveScreen } from "@/components/game/SolveScreens";
import { MapScreen, StoriesScreen } from "@/components/game/StoriesMap";
import { GameProvider, useGame } from "@/components/game/GameProvider";

function ScreenSwitch() {
  const { ready, screen } = useGame();
  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm font-semibold tracking-wide text-white/80">
        Loading desk…
      </div>
    );
  }

  switch (screen) {
    case "setup":
      return <SetupScreen />;
    case "stories":
      return <StoriesScreen />;
    case "map":
      return <MapScreen />;
    case "brief":
      return <BriefScreen />;
    case "play":
      return <PlayScreen />;
    case "solve":
      return <SolveScreen />;
    case "clear":
      return <ClearScreen />;
    case "fail":
      return <FailScreen />;
    default:
      return <HomeScreen />;
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
