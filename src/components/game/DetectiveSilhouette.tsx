export function DetectiveSilhouette({
  gender,
}: {
  gender: "male" | "female";
}) {
  if (gender === "female") {
    return (
      <svg viewBox="0 0 160 200" className="h-full w-full" aria-hidden>
        <ellipse cx="80" cy="188" rx="46" ry="8" fill="#1A050C" opacity="0.55" />
        <path
          d="M80 28c18 0 32 16 32 36 0 8-2 14-6 20 18 10 30 30 32 54 1 16-4 32-16 42-6 5-14 8-22 9v11h-40v-11c-8-1-16-4-22-9-12-10-17-26-16-42 2-24 14-44 32-54-4-6-6-12-6-20 0-20 14-36 32-36z"
          fill="#12040A"
        />
        <path
          d="M48 64c8-22 18-34 32-36 16 2 28 16 34 36-10-8-22-12-34-12s-22 4-32 12z"
          fill="#2A0B16"
        />
        <path
          d="M44 118c10 18 22 28 36 30 14-2 26-12 36-30-8 22-22 36-36 36s-28-14-36-36z"
          fill="#C5A059"
          opacity="0.35"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 200" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="188" rx="48" ry="8" fill="#1A050C" opacity="0.55" />
      <path
        d="M80 22c16 0 28 12 30 28 10 4 18 12 18 24 0 8-4 14-10 18 20 12 34 34 36 58 1 16-6 32-18 42-8 6-18 10-26 11v11H70v-11c-8-1-18-5-26-11-12-10-19-26-18-42 2-24 16-46 36-58-6-4-10-10-10-18 0-12 8-20 18-24 2-16 14-28 30-28z"
        fill="#12040A"
      />
      <path
        d="M52 72c6-20 16-32 28-34 14 2 24 14 30 34-10-10-20-14-30-14s-18 4-28 14z"
        fill="#2A0B16"
      />
      <rect x="58" y="96" width="44" height="6" rx="2" fill="#C5A059" opacity="0.55" />
    </svg>
  );
}
