const PHASES = [
  { n: 1, label: "Scene" },
  { n: 2, label: "Docs" },
  { n: 3, label: "Time" },
  { n: 4, label: "Grill" },
  { n: 5, label: "Charge" },
] as const;

export function PhaseRail({ current }: { current: number }) {
  return (
    <ol className="phase-rail" aria-label="Investigation phases">
      {PHASES.map((phase, index) => {
        const state =
          phase.n < current ? "done" : phase.n === current ? "now" : "todo";
        return (
          <li key={phase.n} className={`phase-step is-${state}`}>
            <span className="phase-num">{String(phase.n).padStart(2, "0")}</span>
            <span className="phase-label">{phase.label}</span>
            {index < PHASES.length - 1 ? <span className="phase-join" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
