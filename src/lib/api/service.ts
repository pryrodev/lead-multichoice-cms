// Data service layer. Currently backed by in-memory sample data;
// swap these functions for real backend calls without touching components.
import * as db from "./mock-data";
import type { Activity, ActivityKind, Engagement, Kpis, Shipment, Stage, Tender } from "./types";

const delay = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));

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
      usdToRwf: db.USD_TO_RWF,
      pendingClearances: db.shipments.filter((s) => s.clearance !== "cleared").length,
      attentionItems: db.engagements.filter((e) => e.needsAttention).length,
    }),
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
