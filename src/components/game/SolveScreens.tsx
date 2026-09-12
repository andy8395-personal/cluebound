"use client";

import { useState } from "react";
import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { detectiveName } from "@/lib/names";

export function SolveScreen() {
  const { chapter, profile, run, submitAccusation, feedback, setScreen } = useGame();
  const [culprit, setCulprit] = useState<string | null>(null);
  const [weapon, setWeapon] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [motive, setMotive] = useState<string | null>(null);

  if (!chapter || !profile || !run) return null;
  const ready = Boolean(culprit && weapon && location && motive);

  return (
    <section className="fun-screen fun-screen-scroll">
      <div className="fun-card">
        <div className="text-center text-4xl">⚖️</div>
        <p className="fun-kicker mt-2 text-center">LEVEL 5 · THE CHARGE</p>
        <h2 className="fun-heading text-center">Solve the Case</h2>
        <p className="mt-2 text-center text-sm text-[#3D5A63]">
          {detectiveName(profile.name)}, pick culprit · weapon · place · motive.
        </p>
        <p className="mt-1 text-center text-xs text-[#6B8A94]">
          Lives left: {run.strikesRemaining}
        </p>

        {feedback?.kind === "accuse-miss" ? (
          <div className="mt-3 rounded-2xl bg-[#FECACA] px-3 py-2 text-center text-sm font-semibold text-[#7F1D1D]">
            {feedback.message}
          </div>
        ) : null}

        <Field label="Culprit" options={chapter.accusationOptions.culprits} value={culprit} onChange={setCulprit} />
        <Field label="Weapon" options={chapter.accusationOptions.weapons} value={weapon} onChange={setWeapon} />
        <Field label="Location" options={chapter.accusationOptions.locations} value={location} onChange={setLocation} />
        <Field label="Motive" options={chapter.accusationOptions.motives} value={motive} onChange={setMotive} />

        <div className="charge-line">
          {culprit ?? "—"} used {weapon ?? "—"} in the {location ?? "—"} out of {motive ?? "—"}.
        </div>

        <Button
          className="fun-btn fun-btn-primary mt-5 w-full"
          disabled={!ready}
          onClick={() => {
            if (!culprit || !weapon || !location || !motive) return;
            submitAccusation({ culprit, weapon, location, motive });
          }}
        >
          Deliver Charge!
        </Button>
        <Button className="fun-btn fun-btn-ghost mt-2 w-full" onClick={() => setScreen("map")}>
          Map
        </Button>
      </div>
    </section>
  );
}

function Field({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="fun-label">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`fun-choice ${value === option ? "is-on" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ClearScreen() {
  const { profile, chapter, setScreen, openStory } = useGame();
  if (!profile || !chapter) return null;

  return (
    <section className="fun-screen">
      <div className="fun-card text-center">
        <div className="text-5xl">🏆</div>
        <p className="fun-kicker mt-3">CASE CLOSED</p>
        <h2 className="fun-heading">{chapter.title}</h2>
        <p className="mt-2 font-display text-lg text-[#0F766E]">
          {detectiveName(profile.name)} nailed it!
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#2A454D]">{chapter.closing}</p>
        <p className="mt-3 text-sm font-semibold text-[#B45309]">
          {chapter.solution.culprit} · {chapter.solution.weapon} · {chapter.solution.location} ·{" "}
          {chapter.solution.motive}
        </p>
        <Button className="fun-btn fun-btn-primary mt-6 w-full" onClick={() => setScreen("stories")}>
          More Stories
        </Button>
        <Button className="fun-btn fun-btn-ghost mt-2 w-full" onClick={() => openStory(chapter.id)}>
          Replay Map
        </Button>
      </div>
    </section>
  );
}

export function FailScreen() {
  const { profile, chapter, run, retryLevel, setScreen } = useGame();
  if (!profile) return null;

  return (
    <section className="fun-screen">
      <div className="fun-card text-center">
        <div className="text-5xl">😵</div>
        <p className="fun-kicker mt-3">OUT OF LIVES</p>
        <h2 className="fun-heading">Trail went cold</h2>
        <p className="mt-3 text-sm text-[#3D5A63]">
          {detectiveName(profile.name)} ran out of lives
          {chapter ? ` on ${chapter.title}` : ""}
          {run ? ` · Level ${run.levelPhase}` : ""}. Hop back in and try a fresh board!
        </p>
        <Button className="fun-btn fun-btn-primary mt-6 w-full" onClick={retryLevel}>
          Retry Level
        </Button>
        <Button className="fun-btn fun-btn-ghost mt-2 w-full" onClick={() => setScreen("map")}>
          Story Map
        </Button>
      </div>
    </section>
  );
}
