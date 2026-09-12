import type { SaveState } from "@/lib/types";

const KEY = "cluebound-save-v1";

export const emptySave = (): SaveState => ({
  playerProfile: null,
  chapterProgress: { completedChapterIds: [] },
  activeRun: null,
});

export function loadSave(): SaveState {
  if (typeof window === "undefined") return emptySave();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as SaveState;
    if (!parsed || typeof parsed !== "object") return emptySave();
    return {
      playerProfile: parsed.playerProfile ?? null,
      chapterProgress: parsed.chapterProgress ?? { completedChapterIds: [] },
      activeRun: parsed.activeRun ?? null,
    };
  } catch {
    return emptySave();
  }
}

export function persistSave(state: SaveState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearSave() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
