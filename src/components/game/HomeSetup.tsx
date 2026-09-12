"use client";

import { defaultName, useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Gender, SpecialtyPerk } from "@/lib/types";
import { useMemo, useState } from "react";

export function HomeScreen() {
  const { profile, setScreen, save, continueRun } = useGame();
  return (
    <section className="fun-screen">
      <div className="fun-hero">
        <div className="fun-badge">WORD CONNECTIONS</div>
        <div className="fun-mascot" aria-hidden>
          🔎
        </div>
        <h1 className="fun-title">
          Cluebound
        </h1>
        <p className="fun-tagline">Murder Connections</p>
        <p className="fun-copy">
          Match 4 related clues. Crack each chapter&apos;s 5 levels. Accuse the killer!
        </p>
        <div className="fun-actions">
          {save.activeRun ? (
            <Button className="fun-btn fun-btn-primary" onClick={continueRun}>
              Continue Level {save.activeRun.levelPhase}
            </Button>
          ) : null}
          <Button
            className="fun-btn fun-btn-primary"
            onClick={() => setScreen(profile ? "stories" : "setup")}
          >
            {profile ? "Play Stories" : "Play Now"}
          </Button>
          {profile ? (
            <Button className="fun-btn fun-btn-ghost" onClick={() => setScreen("setup")}>
              Edit Detective
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function SetupScreen() {
  const { profile, saveProfile, setScreen } = useGame();
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "female");
  const [name, setName] = useState(profile?.name ?? defaultName(profile?.gender ?? "female"));
  const [perk, setPerk] = useState<SpecialtyPerk>(
    profile?.specialtyPerk ?? "deductive_reasoning",
  );
  const preset = defaultName(gender);
  const isCustom = useMemo(() => name.trim() !== preset, [name, preset]);

  function chooseGender(next: Gender) {
    setGender(next);
    if (!isCustom) setName(defaultName(next));
  }

  function begin() {
    const trimmed = name.trim().slice(0, 24);
    const finalName = trimmed || preset;
    saveProfile({
      gender,
      name: finalName,
      isCustomName: finalName !== preset,
      specialtyPerk: perk,
      casesSolved: profile?.casesSolved ?? 0,
      currentChapter: profile?.currentChapter ?? 1,
    });
  }

  return (
    <section className="fun-screen">
      <div className="fun-card">
        <p className="fun-kicker">CREATE DETECTIVE</p>
        <h2 className="fun-heading">Who&apos;s on the case?</h2>
        <div className="fun-gender-row">
          <button
            type="button"
            className={`fun-gender ${gender === "male" ? "is-on" : ""}`}
            onClick={() => chooseGender("male")}
          >
            <span className="text-3xl">🕵️‍♂️</span>
            <span>Arthur</span>
          </button>
          <button
            type="button"
            className={`fun-gender ${gender === "female" ? "is-on" : ""}`}
            onClick={() => chooseGender("female")}
          >
            <span className="text-3xl">🕵️‍♀️</span>
            <span>Evelyn</span>
          </button>
        </div>
        <label className="fun-label">Your name</label>
        <Input
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          className="fun-input"
        />
        <div className="fun-perk-row">
          <button
            type="button"
            className={`fun-perk ${perk === "deductive_reasoning" ? "is-on" : ""}`}
            onClick={() => setPerk("deductive_reasoning")}
          >
            <strong>🧠 Deductive</strong>
            <span>+1 hint / chapter</span>
          </button>
          <button
            type="button"
            className={`fun-perk ${perk === "sharp_instincts" ? "is-on" : ""}`}
            onClick={() => setPerk("sharp_instincts")}
          >
            <strong>❤️ Sharp Instincts</strong>
            <span>+1 life</span>
          </button>
        </div>
        <Button className="fun-btn fun-btn-primary mt-5 w-full" onClick={begin}>
          Let&apos;s Investigate!
        </Button>
        <Button className="fun-btn fun-btn-ghost mt-2 w-full" onClick={() => setScreen("home")}>
          Back
        </Button>
      </div>
    </section>
  );
}
