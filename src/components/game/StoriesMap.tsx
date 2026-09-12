"use client";

import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { LEVEL_NODES, chapters } from "@/lib/chapters";
import { detectiveName } from "@/lib/names";

export function StoriesScreen() {
  const {
    profile,
    save,
    openStory,
    continueRun,
    isChapterUnlocked,
    levelCleared,
    setScreen,
    resetInvestigator,
  } = useGame();
  if (!profile) return null;

  return (
    <section className="fun-screen fun-screen-scroll">
      <header className="fun-topbar">
        <div>
          <p className="fun-kicker">DETECTIVE</p>
          <h2 className="fun-heading text-left">{detectiveName(profile.name)}</h2>
        </div>
        <button type="button" className="fun-chip" onClick={() => setScreen("home")}>
          Home
        </button>
      </header>

      {save.activeRun ? (
        <Button className="fun-btn fun-btn-primary mb-4 w-full" onClick={continueRun}>
          Resume Level {save.activeRun.levelPhase}
        </Button>
      ) : null}

      <div className="space-y-4">
        {chapters.map((chapter) => {
          const unlocked = isChapterUnlocked(chapter.id);
          const cleared = levelCleared(chapter.id);
          const done = save.chapterProgress.completedChapterIds.includes(chapter.id);
          return (
            <article
              key={chapter.id}
              className="story-card"
              style={{ ["--story-accent" as string]: chapter.accent }}
            >
              <div className="flex items-start gap-3">
                <div className="story-emoji">{chapter.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="fun-kicker">
                    {chapter.caseCode}
                    {done ? " · CLEARED" : unlocked ? " · OPEN" : " · LOCKED"}
                  </p>
                  <h3 className="font-display text-xl text-[#14333A]">{chapter.title}</h3>
                  <p className="mt-1 text-sm text-[#3D5A63]">{chapter.blurb}</p>
                  <div className="mt-3 flex gap-1">
                    {LEVEL_NODES.map((node) => (
                      <span
                        key={node.phase}
                        className={`star-dot ${cleared >= node.phase ? "is-lit" : ""}`}
                        title={node.title}
                      >
                        {cleared >= node.phase ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="fun-btn fun-btn-primary mt-4 w-full"
                disabled={!unlocked}
                onClick={() => openStory(chapter.id)}
              >
                {!unlocked ? "Clear previous story" : done ? "Replay Story Map" : "Open Story Map"}
              </Button>
            </article>
          );
        })}
      </div>

      <Button className="fun-btn fun-btn-ghost mt-6 w-full" onClick={resetInvestigator}>
        New Detective
      </Button>
    </section>
  );
}

export function MapScreen() {
  const { chapter, levelCleared, playLevel, setScreen, profile } = useGame();
  if (!chapter || !profile) return null;
  const cleared = levelCleared(chapter.id);

  return (
    <section className="fun-screen fun-screen-scroll">
      <button type="button" className="fun-chip mb-3" onClick={() => setScreen("stories")}>
        ← Stories
      </button>
      <div
        className="story-card mb-5"
        style={{ ["--story-accent" as string]: chapter.accent }}
      >
        <div className="flex items-center gap-3">
          <div className="story-emoji">{chapter.emoji}</div>
          <div>
            <p className="fun-kicker">{chapter.caseCode}</p>
            <h2 className="font-display text-2xl text-[#14333A]">{chapter.title}</h2>
            <p className="text-sm text-[#3D5A63]">{chapter.setting}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#2A454D]">{chapter.summary}</p>
      </div>

      <div className="level-path">
        {LEVEL_NODES.map((node, index) => {
          const unlocked = node.phase <= cleared + 1;
          const done = cleared >= node.phase;
          const current = node.phase === cleared + 1;
          return (
            <div key={node.phase} className="level-row">
              {index > 0 ? <div className={`level-connector ${done || current ? "is-on" : ""}`} /> : null}
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => playLevel(chapter.id, node.phase)}
                className={`level-node ${done ? "is-done" : ""} ${current ? "is-current" : ""} ${!unlocked ? "is-locked" : ""}`}
              >
                <span className="level-emoji">{done ? "✅" : node.emoji}</span>
                <span className="level-meta">
                  <span className="level-num">Level {node.phase}</span>
                  <span className="level-name">{node.title}</span>
                </span>
                <span className="level-cta">
                  {!unlocked ? "🔒" : done ? "Replay" : "Play"}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
