"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, CircleHelp, ExternalLink, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import { useOpportunities } from "@/lib/api/hooks";
import type { Opportunity, OpportunityStatus, OpportunityType } from "@/lib/api/types";
import { fmtDate, usd } from "@/lib/format";

const typeLabels: Record<OpportunityType, string> = {
  public_tender: "Public tender",
  institutional_procurement: "Institutional procurement",
  direct_buyer_requirement: "Direct buyer requirement",
  supplier_led: "Supplier-led opportunity",
  other: "Other opportunity",
};

const statusLabels: Record<OpportunityStatus, string> = {
  new: "New",
  under_assessment: "Under assessment",
  qualified: "Qualified",
  pursuing: "Pursuing",
  monitoring: "Monitoring",
  awaiting_information: "Awaiting information",
  preparing_submission: "Preparing submission",
  submitted: "Submitted",
  under_evaluation: "Under evaluation",
  awarded: "Awarded",
  not_awarded: "Not awarded",
  withdrawn: "Withdrawn",
  closed: "Closed",
};

const columns: DataTableColumn<Opportunity>[] = [
  {
    id: "opportunity",
    header: "Opportunity",
    cell: (row) => (
      <div className="min-w-52">
        <p className="font-medium text-foreground">{row.title}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {row.ref} {row.externalRef && <span>· {row.externalRef}</span>}
        </p>
      </div>
    ),
  },
  {
    id: "buyer",
    header: "Buyer / source",
    cell: (row) => (
      <div className="min-w-36">
        <p>{row.buyer || "Buyer not identified"}</p>
        <p className="mt-1 text-xs text-muted-foreground">{row.source || "Source not recorded"}</p>
      </div>
    ),
  },
  {
    id: "type",
    header: "Type",
    cell: (row) => <span className="text-sm">{typeLabels[row.type]}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <Badge variant="outline" className="whitespace-nowrap bg-secondary/50">
        {statusLabels[row.status]}
      </Badge>
    ),
  },
  {
    id: "owner",
    header: "Owner / next action",
    cell: (row) => (
      <div className="min-w-44">
        <p>{row.owner}</p>
        <p className="mt-1 max-w-56 truncate text-xs text-muted-foreground">
          {row.nextAction || "No next action set"}
        </p>
      </div>
    ),
  },
  {
    id: "deadline",
    header: "Deadline",
    className: "whitespace-nowrap",
    cell: (row) =>
      row.deadline ? fmtDate(row.deadline) : <span className="text-muted-foreground">Not set</span>,
  },
  {
    id: "value",
    header: "Est. value",
    className: "whitespace-nowrap text-right",
    cell: (row) =>
      row.estimatedValue == null ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        usd(row.estimatedValue)
      ),
  },
];

export function OpportunityRegister() {
  const opportunities = useOpportunities();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return opportunities;
    return opportunities.filter((o) =>
      [o.ref, o.title, o.buyer, o.source, o.owner, o.externalRef].some((v) =>
        v.toLowerCase().includes(term),
      ),
    );
  }, [opportunities, search]);
  const open = opportunities.filter(
    (o) => !["closed", "withdrawn", "not_awarded"].includes(o.status),
  ).length;
  const dueSoon = opportunities.filter(
    (o) => o.deadline && !["closed", "withdrawn", "not_awarded", "awarded"].includes(o.status),
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-[30px]">
            Opportunity register
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture and assess tenders, procurement needs, and other business leads.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/admin/opportunities/new">
            <Plus /> New opportunity
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="rounded-2xl shadow-none">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Open opportunities
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">{open}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Not closed, withdrawn, or not awarded
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-none">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              With a deadline
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">{dueSoon}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Confirm dates against the official source
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-none">
          <CardContent className="flex h-full items-center gap-3 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
              <CircleHelp className="h-4 w-4" />
            </span>
            <p className="text-sm text-muted-foreground">
              A submitted bid is not an award. Record the outcome when it is confirmed.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 md:px-5">
            <div>
              <h2 className="font-display text-lg font-semibold">All opportunities</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {filtered.length} records · newest first
              </p>
            </div>
            <label className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, buyer, ref…"
                className="pl-9"
                aria-label="Search opportunities"
              />
            </label>
          </div>
          <ReusableTable
            rows={filtered}
            columns={columns}
            getRowId={(row) => row.id}
            initialPageSize={5}
            emptyMessage="No opportunities match. Try another search or add an opportunity."
          />
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowDownUp className="h-3.5 w-3.5" /> Status and deadline are tracked separately. Overdue
        status should be calculated from the deadline and completion state.
      </p>
      <Link
        href="/admin/tenders"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        View tender worklist <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
