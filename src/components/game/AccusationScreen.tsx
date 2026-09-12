"use client";

import { useState } from "react";
import { useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { detectiveName } from "@/lib/names";

export function AccusationScreen() {
  const { chapter, profile, run, submitAccusation, feedback, setScreen } = useGame();
  const [culprit, setCulprit] = useState<string | null>(null);
  const [weapon, setWeapon] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [motive, setMotive] = useState<string | null>(null);

  if (!chapter || !profile || !run) return null;

  const ready = Boolean(culprit && weapon && location && motive);

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-5">
      <article className="dossier-card px-4 py-5 sm:px-6">
        <p className="text-[0.65rem] tracking-[0.24em] text-brass">LEVEL 5 · THE ACCUSATION</p>
        <h2 className="mt-1 font-heading text-2xl text-[#F8E3C2]">Name the crime</h2>
        <p className="mt-2 text-sm text-[#F8E3C2]/75">
          {detectiveName(profile.name)} must link culprit, weapon, location, and motive. A false
          charge costs a strike.
        </p>
        <p className="mt-2 text-xs text-[#A89080]">
          Strikes remaining: {run.strikesRemaining}
        </p>

        {feedback?.kind === "accuse-miss" ? (
          <div className="mt-3 rounded-lg bg-[#DA3633] px-3 py-2 text-sm text-white">
            {feedback.message}
          </div>
        ) : null}

        <Field
          label="Culprit"
          options={chapter.accusationOptions.culprits}
          value={culprit}
          onChange={setCulprit}
        />
        <Field
          label="Weapon"
          options={chapter.accusationOptions.weapons}
          value={weapon}
          onChange={setWeapon}
        />
        <Field
          label="Location"
          options={chapter.accusationOptions.locations}
          value={location}
          onChange={setLocation}
        />
        <Field
          label="Motive"
          options={chapter.accusationOptions.motives}
          value={motive}
          onChange={setMotive}
        />

        <Button
          className="cta-primary mt-6 h-12 w-full text-base"
          disabled={!ready}
          onClick={() => {
            if (!culprit || !weapon || !location || !motive) return;
            submitAccusation({ culprit, weapon, location, motive });
          }}
        >
          Deliver Accusation
        </Button>
        <Button className="cta-ghost mt-2 h-10 w-full" onClick={() => setScreen("campaign")}>
          Return to Case Files
        </Button>
      </article>
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
      <p className="text-[0.7rem] tracking-[0.16em] text-brass">{label.toUpperCase()}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-2 py-2.5 text-left text-sm ${
              value === option ? "clue-tile is-selected !min-h-0 py-2" : "option-chip"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
