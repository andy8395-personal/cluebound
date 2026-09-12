export function detectiveName(name: string) {
  const trimmed = name.trim();
  if (/^(det\.?|detective)\s/i.test(trimmed)) return trimmed;
  return `Det. ${trimmed}`;
}
