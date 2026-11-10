"use client";

import { useState } from "react";
import { AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import { useEngagements, useStages } from "@/lib/api/hooks";
import type { Engagement } from "@/lib/api/types";
import { daysUntil, fmtDate, usd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function EngagementWorkspace({ initialSearch = "" }: { initialSearch?: string }) {
  const engagements = useEngagements();
  const stages = useStages();
  const [selected, setSelected] = useState<Engagement | null>(null);

  const columns: DataTableColumn<Engagement>[] = [
    {
      id: "engagement",
      header: "Engagement",
      className: "min-w-56",
      cell: (item) => <div className="min-w-0"><p className="truncate font-medium text-foreground">{item.title}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{item.ref}</p></div>,
    },
    {
      id: "parties",
      header: "Parties",
      className: "min-w-44",
      cell: (item) => <div className="min-w-0"><p className="truncate text-sm">{item.buyer}</p><p className="mt-1 truncate text-xs text-muted-foreground">{item.supplier}</p></div>,
    },
    {
      id: "stage",
      header: "Current stage",
      className: "min-w-40",
      cell: (item) => <div className="flex items-center gap-2 text-sm"><span className="size-2 shrink-0 rounded-full bg-brand-primary" /><span>{stages.find((stage) => stage.key === item.stage)?.label ?? item.stage}</span></div>,
    },
    {
      id: "owner",
      header: "Owner",
      className: "min-w-36 text-sm",
      cell: (item) => item.owner,
    },
    {
      id: "next-action",
      header: "Next action",
      className: "min-w-52 max-w-72",
      cell: (item) => <span className="line-clamp-2 text-sm text-muted-foreground">{item.nextAction || "No action recorded"}</span>,
    },
    {
      id: "value",
      header: "Value",
      className: "min-w-28 whitespace-nowrap text-sm tabular-nums",
      cell: (item) => item.valueUsd > 0 ? usd(item.valueUsd) : <span className="text-muted-foreground">—</span>,
    },
    {
      id: "actions",
      header: "",
      className: "w-14 text-right",
      cell: (item) => <Button type="button" variant="ghost" size="icon" aria-label={`View ${item.title}`} onClick={() => setSelected(item)}><Eye className="size-4" /></Button>,
    },
  ];

  return (
    <div className="space-y-5">
      <Card className="rounded-md shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3">
          <div><CardTitle className="font-display">Engagement register</CardTitle><CardDescription className="mt-1">Parties, ownership, and next actions for each engagement.</CardDescription></div>
          <Badge variant="outline">{engagements.length} total</Badge>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ReusableTable rows={engagements} columns={columns} getRowId={(item) => item.id} initialSearch={initialSearch} getSearchText={(item) => [item.ref, item.title, item.buyer, item.supplier, item.owner, item.nextAction].join(" ")} emptyMessage="No engagements match this search." />
        </CardContent>
      </Card>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {selected && <>
            <SheetHeader><p className="font-mono text-xs text-muted-foreground">{selected.ref}</p><SheetTitle>{selected.title}</SheetTitle><SheetDescription>Parties, next action, and milestone progress.</SheetDescription></SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailBlock label="Purchasing entity" value={selected.buyer} />
                <DetailBlock label="Supplier" value={selected.supplier} />
                <DetailBlock label="Current stage" value={stages.find((stage) => stage.key === selected.stage)?.label ?? selected.stage} />
                <DetailBlock label="Responsible owner" value={selected.owner} />
                <DetailBlock label="Estimated value" value={selected.valueUsd > 0 ? usd(selected.valueUsd) : "Not set"} />
              </div>
              {selected.needsAttention && <div className="flex items-center gap-2 rounded-md border border-brand-gold/50 bg-brand-gold/10 p-3 text-sm"><AlertTriangle className="size-4 text-brand-gold" />This engagement needs attention.</div>}
              <section><h3 className="text-sm font-semibold">Next action</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.nextAction || "No next action recorded."}</p></section>
              <section><h3 className="text-sm font-semibold">Milestones</h3><ol className="mt-3 space-y-2">{selected.milestones.map((milestone) => { const days = daysUntil(milestone.due); return <li key={milestone.title} className="flex items-start justify-between gap-4 rounded-md border p-3"><span className="flex min-w-0 items-start gap-2.5">{milestone.done ? <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-primary" /> : <span className="mt-1 size-2 shrink-0 rounded-full border border-muted-foreground" />}<span className="text-sm">{milestone.title}</span></span><span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">{fmtDate(milestone.due)}{!milestone.done && <MilestoneDue days={days} />}</span></li>; })}</ol></section>
            </div>
          </>}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-md border bg-muted/20 p-3"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>;
}

function MilestoneDue({ days }: { days: number }) {
  const label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : days === 1 ? "Tomorrow" : `In ${days}d`;
  return <span className={cn("whitespace-nowrap rounded px-1.5 py-0.5 font-medium", days < 0 ? "bg-destructive/10 text-destructive" : days <= 7 ? "bg-brand-gold/20 text-charcoal" : "bg-muted text-muted-foreground")}>{label}</span>;
}
