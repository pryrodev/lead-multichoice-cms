import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Briefcase, CheckCircle2, Circle, ExternalLink, FileSearch, Gavel, Handshake, Package, Search, Ship, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useActivities, useAddActivity, useSettings, useEngagements, useKpis, useShipments, useStages, useTenders } from "@/lib/api/hooks";
import type { ActivityKind, Shipment, StageKey, Tender, TenderStatus } from "@/lib/api/types";
import { daysUntil, fmtDate, rwf, usd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function KpiRibbon() {
  const k = useKpis();
  const items = [
    { label: "Active tenders", value: String(k.activeTenders), sub: "Monitoring, preparing or submitted", icon: Gavel },
    { label: "Pipeline value", value: usd(k.pipelineUsd), sub: rwf(k.pipelineUsd * k.usdToRwf) + ` @ ${k.usdToRwf}`, icon: Wallet },
    { label: "Pending clearances", value: String(k.pendingClearances), sub: "Shipments awaiting customs", icon: Ship },
    { label: "Needs attention", value: String(k.attentionItems), sub: "Flagged for management", icon: AlertTriangle, alert: true },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label} className={cn(i.alert && "border-warning/50 bg-warning/5")}>
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
  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <CardTitle className="font-display">Procurement & tender tracking</CardTitle>
        <div className="flex gap-2">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead><TableHead>Tender</TableHead><TableHead>Procuring entity</TableHead>
              <TableHead>Deadline</TableHead><TableHead className="text-right">Value</TableHead><TableHead>Status</TableHead><TableHead>Portal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => {
              const d = daysUntil(t.deadline);
              const open = ["monitoring", "preparing"].includes(t.status);
              return (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => setSelected(t)}>
                  <TableCell className="font-mono text-xs">{t.ref}</TableCell>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell className="text-muted-foreground">{t.entity}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{fmtDate(t.deadline)} {open && <DueBadge days={d} />}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{usd(t.valueUsd)}</TableCell>
                  <TableCell><Badge variant="outline" className={cn("capitalize", statusStyle[t.status])}>{t.status}</Badge></TableCell>
                  <TableCell>
                    <a href={t.portalUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      {t.portal} <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No tenders match these filters.</TableCell></TableRow>}
          </TableBody>
        </Table>
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
      <CardHeader><CardTitle className="font-display">Regional corridor logistics</CardTitle></CardHeader>
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
