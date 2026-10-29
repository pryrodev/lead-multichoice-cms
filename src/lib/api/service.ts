// Data service layer. Currently backed by in-memory sample data;
// swap these functions for real backend calls without touching components.
import * as db from "./mock-data";
import type { Profile, Settings, Activity, ActivityKind, Engagement, Kpis, Shipment, Stage, Tender } from "./types";

const delay = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));

let profileStore: Profile = { name: "Aline Uwase", email: "aline@leadmultichoice.rw", role: "Operations Manager", phone: "+250 788 000 000" };
let settingsStore: Settings = { usdToRwf: db.USD_TO_RWF, deadlineWarningDays: 7, emailAlerts: true, blockerAlerts: true, weeklyDigest: false };

let activityStore = [...db.activities];

export const api = {
  getStages: (): Promise<Stage[]> => delay(db.stages),
  getEngagements: (): Promise<Engagement[]> => delay(db.engagements),
  getTenders: (): Promise<Tender[]> => delay(db.tenders),
  getShipments: (): Promise<Shipment[]> => delay(db.shipments),
  getActivities: (): Promise<Activity[]> =>
    delay([...activityStore].sort((a, b) => b.at.localeCompare(a.at))),
  getKpis: (): Promise<Kpis> =>
    delay({
      activeTenders: db.tenders.filter((t) => ["monitoring", "preparing", "submitted"].includes(t.status)).length,
      pipelineUsd: db.engagements.reduce((s, e) => s + e.valueUsd, 0),
      usdToRwf: settingsStore.usdToRwf,
      pendingClearances: db.shipments.filter((s) => s.clearance !== "cleared").length,
      attentionItems: db.engagements.filter((e) => e.needsAttention).length,
    }),
  getProfile: (): Promise<Profile> => delay(profileStore, 100),
  updateProfile: async (p: Profile): Promise<Profile> => { profileStore = { ...p }; return delay(profileStore); },
  getSettings: (): Promise<Settings> => delay(settingsStore, 100),
  updateSettings: async (s: Settings): Promise<Settings> => { settingsStore = { ...s }; return delay(settingsStore); },
  addActivity: async (input: { kind: ActivityKind; ref: string; message: string }): Promise<Activity> => {
    const entry: Activity = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      author: "You",
      ...input,
    };
    activityStore = [entry, ...activityStore];
    return delay(entry, 200);
  },
};
