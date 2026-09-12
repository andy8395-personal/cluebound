import type { SaveState } from "@/lib/types";

const KEY = "cluebound-save-v2";

export const emptySave = (): SaveState => ({
  playerProfile: null,
  chapterProgress: { completedChapterIds: [], levelCleared: {} },
  activeRun: null,
});

export function loadSave(): SaveState {
  if (typeof window === "undefined") return emptySave();
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem("cluebound-save-v1");
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as Partial<SaveState> & {
      chapterProgress?: {
        completedChapterIds?: string[];
        levelCleared?: Record<string, number>;
      };
    };
    return {
      playerProfile: parsed.playerProfile ?? null,
      chapterProgress: {
        completedChapterIds: parsed.chapterProgress?.completedChapterIds ?? [],
        levelCleared: parsed.chapterProgress?.levelCleared ?? {},
      },
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
  localStorage.removeItem("cluebound-save-v1");
}
