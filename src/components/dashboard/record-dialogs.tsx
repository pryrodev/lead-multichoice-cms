"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateShipment, useCreateTender } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Shipment, TenderStatus } from "@/lib/api/types";

export function AddTenderDialog() {
  const [open, setOpen] = useState(false);
  const create = useCreateTender();
  const [status, setStatus] = useState<TenderStatus>("monitoring");
  const submit = (form: FormData) => {
    const valueUsd = Number(form.get("valueUsd") || 0);
    create.mutate({ title: String(form.get("title") || ""), entity: String(form.get("entity") || ""), category: String(form.get("category") || ""), portal: String(form.get("portal") || ""), portalUrl: String(form.get("portalUrl") || ""), deadline: String(form.get("deadline") || ""), valueUsd, status, owner: String(form.get("owner") || ""), notes: String(form.get("notes") || "") }, {
      onSuccess: () => { toast.success("Tender saved"); setOpen(false); },
      onError: () => toast.error("Could not save the tender"),
    });
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add tender</Button></DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl"><DialogHeader><DialogTitle>Add tender</DialogTitle><DialogDescription>Record a procurement opportunity and its tracking details.</DialogDescription></DialogHeader><form action={submit} className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2"><Field name="title" label="Tender title" required /><Field name="entity" label="Procuring entity" required /><Field name="category" label="Category" /><Field name="portal" label="Portal" /><Field name="portalUrl" label="Portal URL" type="url" /><Field name="deadline" label="Deadline" type="date" /><Field name="valueUsd" label="Estimated value (USD)" type="number" /><Field name="owner" label="Owner" /></div>
    <div className="space-y-1.5"><Label>Status</Label><Select value={status} onValueChange={(v) => setStatus(v as TenderStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["monitoring", "preparing", "submitted", "awarded", "lost", "cancelled"].map((v) => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}</SelectContent></Select></div>
    <div className="space-y-1.5"><Label htmlFor="tender-notes">Notes</Label><Textarea id="tender-notes" name="notes" rows={3} /></div>
    <DialogFooter><Button type="submit" disabled={create.isPending}>{create.isPending ? "Saving…" : "Save tender"}</Button></DialogFooter>
  </form></DialogContent></Dialog>;
}

export function AddShipmentDialog() {
  const [open, setOpen] = useState(false);
  const create = useCreateShipment();
  const [clearance, setClearance] = useState<Shipment["clearance"]>("pending");
  const submit = (form: FormData) => {
    const progress = Number(form.get("progress") || 0);
    create.mutate({ cargo: String(form.get("cargo") || ""), corridor: String(form.get("corridor") || ""), origin: String(form.get("origin") || ""), destination: String(form.get("destination") || ""), progress, eta: String(form.get("eta") || ""), clearance, milestones: [] }, {
      onSuccess: () => { toast.success("Shipment saved"); setOpen(false); },
      onError: () => toast.error("Could not save the shipment"),
    });
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add shipment</Button></DialogTrigger><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Add shipment</DialogTitle><DialogDescription>Record a shipment and its current route and clearance status.</DialogDescription></DialogHeader><form action={submit} className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2"><Field name="cargo" label="Cargo" required /><Field name="corridor" label="Corridor" /><Field name="origin" label="Origin" required /><Field name="destination" label="Destination" required /><Field name="progress" label="Progress (%)" type="number" min="0" max="100" /><Field name="eta" label="Estimated arrival" type="date" /></div>
    <div className="space-y-1.5"><Label>Clearance</Label><Select value={clearance} onValueChange={(v) => setClearance(v as Shipment["clearance"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{([["pending", "Pending"], ["in_review", "In review"], ["cleared", "Cleared"], ["held", "Held"]] as const).map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}</SelectContent></Select></div>
    <DialogFooter><Button type="submit" disabled={create.isPending}>{create.isPending ? "Saving…" : "Save shipment"}</Button></DialogFooter>
  </form></DialogContent></Dialog>;
}

function Field({ name, label, type = "text", required, min, max }: { name: string; label: string; type?: string; required?: boolean; min?: string; max?: string }) {
  const id = `record-${name}`;
  return <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label><Input id={id} name={name} type={type} required={required} min={min} max={max} step={type === "number" ? "any" : undefined} /></div>;
}
