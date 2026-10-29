export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: n >= 1e6 ? "compact" : "standard", maximumFractionDigits: n >= 1e6 ? 2 : 0 }).format(n);
export const rwf = (n: number) =>
  "RWF " + new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
export const TODAY = new Date();
export const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - TODAY.getTime()) / 86400000);
