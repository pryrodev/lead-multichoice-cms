"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, Briefcase, CalendarDays, CheckCircle2, Circle, Clock3, ExternalLink, FileSearch, Gavel, Handshake, Package, Search, Ship, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useActivities, useAddActivity, useSettings, useEngagements, useKpis, useShipments, useStages, useTenders } from "@/lib/api/hooks";
import type { ActivityKind, Shipment, StageKey, Tender, TenderStatus } from "@/lib/api/types";
import { daysUntil, fmtDate, rwf, usd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AddShipmentDialog, AddTenderDialog } from "@/components/dashboard/record-dialogs";

export function KpiRibbon() {
  const k = useKpis();
  const items = [
    { label: "Active tenders", value: String(k.activeTenders), sub: "Monitoring, preparing or submitted", icon: Gavel },
    { label: "Pipeline value", value: usd(k.pipelineUsd), sub: rwf(k.pipelineUsd * k.usdToRwf) + ` · ${k.usdToRwf} RWF/USD`, icon: Wallet },
    { label: "Pending clearances", value: String(k.pendingClearances), sub: "Shipments awaiting customs", icon: Ship },
    { label: "Needs attention", value: String(k.attentionItems), sub: "Flagged for management", icon: AlertTriangle, alert: true },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label} className={cn("relative overflow-hidden rounded-2xl shadow-none", i.alert && "border-warning/50 bg-warning/5")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {i.label}
              <i.icon className={cn("h-4 w-4", i.alert && "text-warning")} />
            </div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-tight">{i.value}</div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{i.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const stageIcons: Record<StageKey, typeof Briefcase> = {
  connect: FileSearch, introductions: Handshake, bidding: Gavel, procurement: Truck, delivery: Package,
};

const pipelineChartConfig = {
  value: { label: "Estimated value", color: "var(--brand-primary)" },
} satisfies ChartConfig;

const compactUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function Pipeline() {
  const stages = useStages();
  const engagements = useEngagements();
  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Trade facilitation pipeline</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-5">
        {stages.map((s, idx) => {
          const items = engagements.filter((e) => e.stage === s.key);
          const total = items.reduce((a, e) => a + e.valueUsd, 0);
          const Icon = stageIcons[s.key];
          return (
            <div key={s.key} className="relative rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-xs">{idx + 1}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 text-sm font-semibold leading-tight">{s.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-display text-2xl font-semibold">{items.length}</span>
                <span className="font-mono text-xs text-muted-foreground">{usd(total)}</span>
              </div>
              <div className="mt-2 space-y-1">
                {items.map((e) => (
                  <div key={e.id} className="truncate rounded bg-card px-2 py-1 text-xs border" title={e.title}>
                    {e.needsAttention && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-warning align-middle" />}
                    {e.title}
                  </div>
                ))}
              </div>
              {idx < 4 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 text-muted-foreground md:block" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function Engagements() {
  const engagements = useEngagements();
  const stages = useStages();
  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Active engagements</CardTitle></CardHeader>
      <CardContent>
        <Tabs defaultValue={engagements[0]?.id ?? ""}>
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            {engagements.map((e) => (
              <TabsTrigger key={e.id} value={e.id} className="rounded-b-none border border-b-0 font-mono text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                {e.ref.replace("LMC-ENG-", "")}
                {e.needsAttention && <AlertTriangle className="ml-1 h-3 w-3 text-warning" />}
              </TabsTrigger>
            ))}
          </TabsList>
          {engagements.map((e) => (
            <TabsContent key={e.id} value={e.id} className="mt-0 rounded-b-lg rounded-tr-lg border bg-accent/30 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{e.ref}</div>
                  <h3 className="font-display text-lg font-semibold">{e.title}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{e.buyer} ⇄ {e.supplier}</div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{stages.find((s) => s.key === e.stage)?.label}</Badge>
                  <div className="mt-1 font-mono text-sm">{usd(e.valueUsd)}</div>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div><div className="text-xs uppercase tracking-wide text-muted-foreground">Responsible owner</div><div className="mt-1 font-medium">{e.owner}</div></div>
                <div className="md:col-span-2"><div className="text-xs uppercase tracking-wide text-muted-foreground">Next action</div><div className="mt-1 font-medium">{e.nextAction}</div></div>
              </div>
              <div className="mt-4 space-y-2">
                {e.milestones.map((m) => {
                  const d = daysUntil(m.due);
                  return (
                    <div key={m.title} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
                      <span className="flex items-center gap-2">
                        {m.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                        {m.title}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-xs">
                        {fmtDate(m.due)}
                        {!m.done && <DueBadge days={d} />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function DueBadge({ days }: { days: number }) {
  const { deadlineWarningDays } = useSettings();
  if (days < 0) return <Badge variant="destructive">{-days}d overdue</Badge>;
  if (days <= deadlineWarningDays) return <Badge className="bg-warning text-warning-foreground hover:bg-warning">{days}d left</Badge>;
  return <Badge variant="outline">{days}d</Badge>;
}

const statusStyle: Record<TenderStatus, string> = {
  monitoring: "bg-muted text-muted-foreground",
  preparing: "bg-warning/20 text-foreground border-warning/40",
  submitted: "bg-primary/15 text-primary",
  awarded: "bg-success text-success-foreground",
  lost: "bg-destructive/15 text-destructive",
  cancelled: "bg-muted text-muted-foreground line-through",
};

export function TenderTable() {
  const tenders = useTenders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | TenderStatus>("all");
  const [selected, setSelected] = useState<Tender | null>(null);
  const rate = useSettings().usdToRwf;
  const rows = useMemo(
    () => tenders.filter((t) => (status === "all" || t.status === status) &&
      `${t.ref} ${t.title} ${t.entity} ${t.owner}`.toLowerCase().includes(q.toLowerCase())),
    [tenders, q, status],
  );
  const columns: DataTableColumn<Tender>[] = [
    { id: "reference", header: "Reference", className: "font-mono text-xs", cell: (tender) => tender.ref },
    { id: "tender", header: "Tender", className: "min-w-56 font-medium", cell: (tender) => tender.title },
    { id: "entity", header: "Procuring entity", className: "min-w-40 text-muted-foreground", cell: (tender) => tender.entity },
    { id: "deadline", header: "Deadline", className: "whitespace-nowrap font-mono text-xs", cell: (tender) => {
      const active = ["monitoring", "preparing", "submitted"].includes(tender.status);
      return <>{fmtDate(tender.deadline)} {active && <DueBadge days={daysUntil(tender.deadline)} />}</>;
    } },
    { id: "value", header: "Value", className: "text-right font-mono text-xs", cell: (tender) => usd(tender.valueUsd) },
    { id: "status", header: "Status", cell: (tender) => <Badge variant="outline" className={cn("capitalize", statusStyle[tender.status])}>{tender.status}</Badge> },
    { id: "portal", header: "Portal", className: "min-w-36", cell: (tender) => <a href={tender.portalUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">{tender.portal}<ExternalLink className="h-3 w-3" /></a> },
  ];
  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <CardTitle className="font-display">Procurement & tender tracking</CardTitle>
        <div className="flex flex-wrap gap-2">
          <AddTenderDialog />
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tenders…" className="w-56 pl-8" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="w-36"><SelectValue>{status === "all" ? "All statuses" : <span className="capitalize">{status}</span>}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.keys(statusStyle).map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ReusableTable rows={rows} columns={columns} getRowId={(tender) => tender.id} onRowClick={setSelected} emptyMessage="No tenders match these filters." />
      </CardContent>
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetDescription className="font-mono">{selected.ref}</SheetDescription>
                <SheetTitle className="font-display">{selected.title}</SheetTitle>
              </SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                {[["Procuring entity", selected.entity], ["Category", selected.category], ["Owner", selected.owner],
                  ["Deadline", fmtDate(selected.deadline)], ["Estimated value", `${usd(selected.valueUsd)} · ${rwf(selected.valueUsd * rate)}`], ["Notes", selected.notes]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt><dd className="mt-1">{v}</dd></div>
                ))}
                <Badge variant="outline" className={cn("capitalize", statusStyle[selected.status])}>{selected.status}</Badge>
              </dl>
              <Button asChild className="mt-6 w-full">
                <a href={selected.portalUrl} target="_blank" rel="noreferrer">Open on {selected.portal} <ExternalLink className="ml-1 h-4 w-4" /></a>
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}

const clearanceStyle: Record<Shipment["clearance"], string> = {
  pending: "bg-muted text-muted-foreground", in_review: "bg-warning/20 text-foreground",
  cleared: "bg-success text-success-foreground", held: "bg-destructive text-destructive-foreground",
};

export function Logistics() {
  const shipments = useShipments();
  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3"><CardTitle className="font-display">Regional corridor logistics</CardTitle><AddShipmentDialog /></CardHeader>
      <CardContent className="space-y-5">
        {shipments.map((s) => (
          <div key={s.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-mono text-xs text-muted-foreground">{s.ref} · {s.corridor}</div>
                <div className="font-medium">{s.cargo}</div>
              </div>
              <Badge variant="outline" className={cn("capitalize", clearanceStyle[s.clearance])}>{s.clearance.replace("_", " ")}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{s.origin}</span><span>ETA {fmtDate(s.eta)}</span><span>{s.destination}</span>
            </div>
            <Progress value={s.progress} className="mt-1 h-2" />
            <ol className="mt-3 space-y-1.5">
              {s.milestones.map((m) => (
                <li key={m.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    {m.done ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                    {m.label}
                  </span>
                  <span className="font-mono text-muted-foreground">{m.date ? fmtDate(m.date) : "—"}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const kindStyle: Record<ActivityKind, { label: string; cls: string }> = {
  blocker: { label: "Blocker", cls: "bg-destructive text-destructive-foreground" },
  update: { label: "Update", cls: "bg-primary/15 text-primary" },
  next_action: { label: "Next action", cls: "bg-warning/25 text-foreground" },
  decision: { label: "Decision", cls: "bg-success text-success-foreground" },
};

export function ActivityFeed() {
  const activities = useActivities();
  const add = useAddActivity();
  const [kind, setKind] = useState<ActivityKind>("update");
  const [ref, setRef] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!ref.trim() || !message.trim()) { toast.error("Reference and message are required"); return; }
    add.mutate({ kind, ref: ref.trim(), message: message.trim() }, {
      onSuccess: () => { toast.success("Activity logged"); setMessage(""); },
      onError: () => toast.error("Could not log activity"),
    });
  };

  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Activity log & audit feed</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
          <div className="flex gap-2">
            <Select value={kind} onValueChange={(v) => setKind(v as ActivityKind)}>
              <SelectTrigger className="w-36"><SelectValue>{kindStyle[kind].label}</SelectValue></SelectTrigger>
              <SelectContent>
                {Object.entries(kindStyle).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Reference e.g. LMC-ENG-2026-014" className="font-mono text-xs" />
          </div>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What happened, what's blocked, or what's next?" rows={2} />
          <Button size="sm" onClick={submit} disabled={add.isPending}>Log entry</Button>
        </div>
        <ol className="mt-4 space-y-4 border-l pl-4">
          {activities.map((a) => (
            <li key={a.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge className={cn("hover:opacity-100", kindStyle[a.kind].cls)}>{kindStyle[a.kind].label}</Badge>
                <span className="font-mono text-muted-foreground">{a.ref}</span>
              </div>
              <p className="mt-1 text-sm">{a.message}</p>
              <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                {new Date(a.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Kigali" })} · {a.author}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function OperationsDashboard() {
  const kpis = useKpis();
  const stages = useStages();
  const engagements = useEngagements();
  const tenders = useTenders();
  const shipments = useShipments();
  const activities = useActivities();
  const activeShipments = shipments.filter((shipment) => shipment.progress < 100);
  const flaggedEngagements = engagements.filter((engagement) => engagement.needsAttention);
  const stageCounts = stages.map((stage) => {
    const stageEngagements = engagements.filter((engagement) => engagement.stage === stage.key);
    return {
      ...stage,
      count: stageEngagements.length,
      value: stageEngagements.reduce((total, engagement) => total + engagement.valueUsd, 0),
    };
  });
  const deadlines = [
    ...engagements.flatMap((engagement) =>
      engagement.milestones
        .filter((milestone) => !milestone.done)
        .map((milestone) => ({
          id: `${engagement.id}-${milestone.title}`,
          ref: engagement.ref,
          title: milestone.title,
          date: milestone.due,
          owner: engagement.owner,
          href: "/admin/engagements" as const,
        })),
    ),
    ...tenders
      .filter((tender) => ["monitoring", "preparing", "submitted"].includes(tender.status))
      .map((tender) => ({
        id: tender.id,
        ref: tender.ref,
        title: tender.title,
        date: tender.deadline,
        owner: tender.owner,
        href: "/admin/tenders" as const,
      })),
  ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Open opportunities" value={String(kpis.activeTenders)} note="Monitoring through submission" icon={Gavel} />
        <MetricCard label="Pipeline value" value={usd(kpis.pipelineUsd)} note={rwf(kpis.pipelineUsd * kpis.usdToRwf)} icon={Wallet} />
        <MetricCard label="Shipments in progress" value={String(activeShipments.length)} note={`${kpis.pendingClearances} awaiting clearance`} icon={Truck} />
        <MetricCard label="Needs attention" value={String(flaggedEngagements.length)} note="Engagements with a flagged next step" icon={AlertTriangle} alert />
      </div>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-3">
          <div><CardTitle className="font-display text-lg">Trade facilitation pipeline</CardTitle><p className="mt-1 text-sm text-muted-foreground">Bars show estimated value. Engagement counts appear beside each stage.</p></div>
          <Button asChild variant="ghost" size="sm" className="shrink-0"><Link href="/admin/engagements">All engagements <ArrowUpRight className="ml-1 h-4 w-4" /></Link></Button>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pipelineChartConfig} className="aspect-auto h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={stageCounts.map((stage) => ({
                ...stage,
                axisLabel: `${stage.label} · ${stage.count} ${stage.count === 1 ? "engagement" : "engagements"}`,
              }))}
              layout="vertical"
              margin={{ left: 0, right: 40, top: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" dataKey="value" tickFormatter={compactUsd} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis type="category" dataKey="axisLabel" width={220} tickLine={false} axisLine={false} tickMargin={8} reversed />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => String(label)}
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span>{item.payload.count} {item.payload.count === 1 ? "engagement" : "engagements"}</span>
                        <span className="font-mono font-medium">{usd(Number(value))}</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="value" name="Estimated value" fill="var(--color-value)" radius={[0, 7, 7, 0]} barSize={22} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid items-stretch gap-5 xl:grid-cols-3">
        <AttentionPanel engagements={flaggedEngagements} />
        <DeadlinePanel deadlines={deadlines} />
        <ActivitySummary activities={activities} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, note, icon: Icon, alert = false }: { label: string; value: string; note: string; icon: typeof Wallet; alert?: boolean }) {
  return (
    <Card className={cn("rounded-2xl shadow-none", alert && "border-warning/50")}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-muted-foreground">{label}</span><span className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary", alert && "bg-warning/20 text-foreground")}><Icon className="h-[18px] w-[18px]" /></span></div>
        <div className="mt-3 font-display text-[28px] font-semibold leading-none tracking-tight">{value}</div>
        <div className="mt-2 truncate text-xs text-muted-foreground">{note}</div>
      </CardContent>
    </Card>
  );
}

function AttentionPanel({ engagements }: { engagements: ReturnType<typeof useEngagements> }) {
  return (
    <Card className="flex h-full flex-col rounded-2xl shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3"><div><CardTitle className="font-display text-lg">Needs attention</CardTitle><p className="mt-1 text-sm text-muted-foreground">Follow-ups flagged by the team</p></div><Badge variant="secondary">{engagements.length}</Badge></CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-1">
        {engagements.slice(0, 4).map((engagement) => {
          const next = engagement.milestones.find((milestone) => !milestone.done);
          return <Link key={engagement.id} href="/admin/engagements" className="flex flex-1 items-center rounded-xl p-3 transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{engagement.title}</div><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{engagement.nextAction}</p><div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground"><span>{engagement.owner}</span>{next && <><span>·</span><span>Due {fmtDate(next.due)}</span></>}</div></div></div></Link>;
        })}
        {engagements.length === 0 && <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground"><CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-success" />Nothing needs attention right now.</div>}
        <Button asChild variant="ghost" size="sm" className="mt-auto w-full"><Link href="/admin/engagements">{engagements.length > 4 ? "See all flagged work" : "View engagements"} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </CardContent>
    </Card>
  );
}

type DashboardDeadline = { id: string; ref: string; title: string; date: string; owner: string; href: "/admin/engagements" | "/admin/tenders" };

function DeadlinePanel({ deadlines }: { deadlines: DashboardDeadline[] }) {
  return (
    <Card className="flex h-full flex-col rounded-2xl shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3"><div><CardTitle className="font-display text-lg">Upcoming deadlines</CardTitle><p className="mt-1 text-sm text-muted-foreground">Open milestones and tender dates</p></div><CalendarDays className="h-4 w-4 text-muted-foreground" /></CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-1">
        {deadlines.map((item) => {
          const days = daysUntil(item.date);
          const dateLabel = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : days === 1 ? "Tomorrow" : `In ${days} days`;
          return <Link href={item.href} key={item.id} className="flex flex-1 items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", days < 0 ? "bg-destructive/10 text-destructive" : days <= 7 ? "bg-warning/20 text-foreground" : "bg-primary/10 text-primary")}><Clock3 className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{item.title}</span><span className="mt-1 block truncate font-mono text-[10px] text-muted-foreground">{item.ref} · {item.owner}</span></span><span className={cn("shrink-0 pt-1 text-[11px] font-medium", days < 0 ? "text-destructive" : days <= 7 ? "text-foreground" : "text-muted-foreground")}>{dateLabel}</span></Link>;
        })}
        {deadlines.length === 0 && <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">No open deadlines.</div>}
      </CardContent>
    </Card>
  );
}

function ActivitySummary({ activities }: { activities: ReturnType<typeof useActivities> }) {
  return (
    <Card className="flex h-full flex-col rounded-2xl shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3"><div><CardTitle className="font-display text-lg">Recent activity</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest updates across operations</p></div><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ol className="flex-1 space-y-4">
          {activities.slice(0, 4).map((entry) => (
            <li key={entry.id} className="relative flex gap-3">
              <span className={cn("mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", kindStyle[entry.kind].cls)}>{entry.kind === "blocker" ? <AlertTriangle className="h-3.5 w-3.5" /> : entry.kind === "decision" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}</span>
              <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm leading-relaxed">{entry.message}</p><div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground"><span>{entry.author}</span><span>·</span><span className="font-mono">{entry.ref}</span></div><time className="mt-0.5 block text-[11px] text-muted-foreground" dateTime={entry.at}>{new Date(entry.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" })}</time></div>
            </li>
          ))}
          {activities.length === 0 && <li className="py-5 text-center text-sm text-muted-foreground">Activity will appear here as work is updated.</li>}
        </ol>
        <Button asChild variant="ghost" size="sm" className="mt-auto w-full"><Link href="/admin/activity">View activity log <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </CardContent>
    </Card>
  );
}
