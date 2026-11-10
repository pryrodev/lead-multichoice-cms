"use client";

import { useState, type FormEvent } from "react";
import { ListChecks, Plus } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getTrackingStatusTone } from "@/features/client-portal/status-color";
import { useCreateTrackingStatus, useTrackingStatuses, useUpdateTrackingStatus } from "@/features/client-portal/tracking-statuses-hooks";
import type { ClientRequestType } from "@/features/client-portal/types";
import { ReusableTable, type DataTableColumn } from "@/components/data-table/reusable-table";
import type { TrackingStatus } from "@/features/client-portal/types";

const requestTypes: Array<[ClientRequestType, string]> = [
  ["buying", "Buying / purchasing"],
  ["selling", "Selling / supplier offer"],
  ["sourcing", "Supplier search / sourcing"],
  ["bidding", "Tender / bidding support"],
  ["shipping", "Shipping / logistics"],
  ["market_access", "Market access / representation"],
  ["partnership", "Business partnership"],
  ["other", "Other client request"],
  ["buyer_request", "Buyer request"],
  ["supplier_offer", "Supplier offer"],
];

export function TrackingStatusManager({ canManage }: { canManage: boolean }) {
  const query = useTrackingStatuses();
  const create = useCreateTrackingStatus();
  const update = useUpdateTrackingStatus();
  const [requestType, setRequestType] = useState<ClientRequestType>("buying");
  const [isTerminal, setIsTerminal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const statuses = query.data?.filter((status) => status.requestType === requestType) ?? [];
  const statusColumns: DataTableColumn<TrackingStatus>[] = [
    { id: "step", header: "Step", className: "w-16 text-xs tabular-nums text-muted-foreground", cell: (status) => <span className={`inline-flex size-7 items-center justify-center rounded-full text-[11px] font-semibold ${getTrackingStatusTone(status.name)}`}>{String(status.sortOrder).padStart(2, "0")}</span> },
    { id: "status", header: "Progress step", className: "min-w-52", cell: (status) => <div><p className={`font-medium ${!status.isActive ? "text-muted-foreground line-through" : ""}`}>{status.name}</p>{status.description && <p className="mt-1 text-xs text-muted-foreground">{status.description}</p>}</div> },
    { id: "final", header: "Completion", cell: (status) => status.isTerminal ? <Badge className="bg-brand-primary text-brand-white hover:bg-brand-primary">Final step</Badge> : <span className="text-sm text-muted-foreground">In progress</span> },
    { id: "active", header: "Visible", className: "w-20", cell: (status) => <Switch checked={status.isActive} disabled={update.isPending} onCheckedChange={(checked) => void toggleStatus(status.id, checked)} aria-label={`${status.isActive ? "Deactivate" : "Activate"} ${status.name}`} /> },
  ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      await create.mutateAsync({
        requestType,
        name: String(values.get("statusName") ?? "").trim(),
        description: String(values.get("statusDescription") ?? "").trim(),
        isTerminal,
      });
      form.reset();
      setIsTerminal(false);
      setAdding(false);
      toast.success("Tracking status created");
    } catch (error) {
      toast.error("Could not create tracking status", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  async function toggleStatus(id: string, isActive: boolean) {
    try {
      await update.mutateAsync({ id, isActive });
      toast.success(isActive ? "Status activated" : "Status deactivated");
    } catch (error) {
      toast.error("Could not update status", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  if (!canManage) return null;

  return (
    <>
    <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setAdding(false); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListChecks className="size-4" />
          Manage progress steps
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Client progress steps</DialogTitle>
          <DialogDescription>Staff select a step when posting a client update.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="status-request-type">Request type</Label>
            <Select value={requestType} onValueChange={(value: ClientRequestType) => setRequestType(value)}>
              <SelectTrigger id="status-request-type"><SelectValue /></SelectTrigger>
              <SelectContent>{requestTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <section aria-label="Statuses for selected request type" className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Progress steps</h3>
              <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => setAdding(true)}>
                <Plus className="size-4" /> Add a step
              </Button>
            </div>
            {query.isPending ? <p role="status" className="text-sm text-muted-foreground">Loading statuses...</p> : query.isError ? (
              <Alert variant="destructive"><AlertTitle>Could not load statuses</AlertTitle><AlertDescription>{query.error.message}</AlertDescription></Alert>
            ) : statuses.length ? (
              <ReusableTable rows={statuses} columns={statusColumns} getRowId={(status) => status.id} initialPageSize={10} emptyMessage="No progress steps for this request type." />
            ) : (
              <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">No statuses for this request type yet.</p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={adding} onOpenChange={setAdding}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Add progress step</DialogTitle>
          <DialogDescription>{requestTypes.find(([value]) => value === requestType)?.[1]}</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void submit(event)} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="tracking-status-name">Step name</Label>
            <Input id="tracking-status-name" name="statusName" required minLength={2} maxLength={100} placeholder="e.g. Supplier verification" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tracking-status-description">Client update <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Textarea id="tracking-status-description" name="statusDescription" maxLength={500} rows={3} placeholder="What should the client know?" />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="space-y-0.5">
              <Label htmlFor="tracking-status-terminal">Final step</Label>
              <p className="text-xs text-muted-foreground">Completes the request.</p>
            </div>
            <Switch id="tracking-status-terminal" checked={isTerminal} onCheckedChange={setIsTerminal} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? "Adding…" : "Add step"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
