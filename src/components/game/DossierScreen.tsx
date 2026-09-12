"use client";

import { useMemo, useState } from "react";
import { DetectiveSilhouette } from "@/components/game/DetectiveSilhouette";
import { defaultName, useGame } from "@/components/game/GameProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Gender, SpecialtyPerk } from "@/lib/types";

export function DossierScreen() {
  const { profile, saveProfile, setScreen } = useGame();
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [name, setName] = useState(profile?.name ?? defaultName(profile?.gender ?? "male"));
  const [perk, setPerk] = useState<SpecialtyPerk>(
    profile?.specialtyPerk ?? "deductive_reasoning",
  );

  const preset = defaultName(gender);
  const isCustom = useMemo(() => name.trim() !== preset, [name, preset]);

  function chooseGender(next: Gender) {
    setGender(next);
    const nextPreset = defaultName(next);
    if (!isCustom) setName(nextPreset);
  }

  function begin() {
    const trimmed = name.trim().slice(0, 24);
    const finalName = trimmed.length ? trimmed : preset;
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
    <section className="flex flex-1 flex-col items-center px-4 py-6 sm:py-10">
      <div className="dossier-card w-full max-w-lg px-5 py-7 sm:px-8">
        <p className="text-center font-heading text-[0.65rem] tracking-[0.32em] text-brass">
          BUREAU OF INVESTIGATION
        </p>
        <h2 className="mt-2 text-center font-heading text-2xl text-[#F8E3C2] sm:text-3xl">
          Official Dossier
        </h2>
        <p className="mt-2 text-center text-sm text-[#F8E3C2]/70">
          Establish your investigator before Chapter 01.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => chooseGender("male")}
            className={`silhouette-card ${gender === "male" ? "is-active" : ""}`}
          >
            <div className="mx-auto h-36 w-28">
              <DetectiveSilhouette gender="male" />
            </div>
            <p className="font-heading text-sm text-[#F8E3C2]">Male Detective</p>
            <p className="mt-1 text-[0.7rem] text-[#F8E3C2]/60">Default: Arthur Pendelton</p>
          </button>
          <button
            type="button"
            onClick={() => chooseGender("female")}
            className={`silhouette-card ${gender === "female" ? "is-active" : ""}`}
          >
            <div className="mx-auto h-36 w-28">
              <DetectiveSilhouette gender="female" />
            </div>
            <p className="font-heading text-sm text-[#F8E3C2]">Female Detective</p>
            <p className="mt-1 text-[0.7rem] text-[#F8E3C2]/60">Default: Evelyn Vance</p>
          </button>
        </div>

        <label className="mt-6 block text-[0.7rem] tracking-[0.18em] text-brass">
          INVESTIGATOR NAME
        </label>
        <Input
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 h-11 border-[#78350F] bg-[#1D070F] text-[#F8E3C2]"
        />
        <p className="mt-1 text-right text-[0.7rem] text-[#A89080]">{name.trim().length}/24</p>

        <p className="mt-4 text-[0.7rem] tracking-[0.18em] text-brass">SPECIALTY PERK</p>
        <div className="mt-2 space-y-2">
          <PerkChoice
            checked={perk === "deductive_reasoning"}
            title="Deductive Reasoning"
            detail="+1 free hint each chapter"
            onSelect={() => setPerk("deductive_reasoning")}
          />
          <PerkChoice
            checked={perk === "sharp_instincts"}
            title="Sharp Instincts"
            detail="+1 error strike shield (5 strikes)"
            onSelect={() => setPerk("sharp_instincts")}
          />
        </div>

        <Button className="cta-primary mt-7 h-12 w-full text-base" onClick={begin}>
          Open Case File & Begin
        </Button>
        <Button className="cta-ghost mt-2 h-10 w-full" onClick={() => setScreen("title")}>
          Return
        </Button>
      </div>
    </section>
  );
}

function PerkChoice({
  checked,
  title,
  detail,
  onSelect,
}: {
  checked: boolean;
  title: string;
  detail: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left ${
        checked
          ? "border-[#F59E0B] bg-[#3B101E] shadow-[0_0_0_1px_rgba(245,158,11,0.35)]"
          : "border-[#662039] bg-[#2D0D19]"
      }`}
    >
      <span
        className={`mt-0.5 flex size-4 items-center justify-center rounded-full border ${
          checked ? "border-[#FFE885] bg-[#F59E0B]" : "border-[#832B4C]"
        }`}
      >
        {checked ? <span className="size-1.5 rounded-full bg-[#1E080F]" /> : null}
      </span>
      <span>
        <span className="block font-heading text-sm text-[#F8E3C2]">{title}</span>
        <span className="mt-0.5 block text-xs text-[#F8E3C2]/65">{detail}</span>
      </span>
    </button>
  );
}
