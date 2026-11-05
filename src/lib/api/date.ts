export const dateOnly = (value: Date | null | undefined): string | null =>
  value ? value.toISOString().slice(0, 10) : null;
