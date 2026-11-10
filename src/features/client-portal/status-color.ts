export type TrackingStatusTone = "complete" | "cancelled" | "paused";

const solidTones = [
  "bg-brand-primary text-brand-white",
  "bg-brand-gold text-charcoal",
  "bg-brand-white text-brand-primary ring-1 ring-brand-primary/30",
] as const;

export function getTrackingStatusTone(label: string, tone?: TrackingStatusTone) {
  if (tone === "complete") return "bg-brand-primary text-brand-white";
  if (tone === "cancelled") return "bg-brand-gold text-charcoal";
  if (tone === "paused") return "bg-brand-white text-brand-primary ring-1 ring-brand-primary/30";

  const hash = Array.from(label).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7);
  return solidTones[hash % solidTones.length];
}
