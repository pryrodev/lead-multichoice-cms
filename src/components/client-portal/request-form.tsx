"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClientRequest, usePortalUser } from "@/features/client-portal/hooks";
import type { NewClientRequest } from "@/features/client-portal/types";

export function ClientRequestForm() {
  const router = useRouter();
  const { data: account } = usePortalUser();
  const create = useCreateClientRequest();
  const [values, setValues] = useState<NewClientRequest>({
    requestType: account?.user?.role === "supplier" ? "supplier_offer" : "buyer_request",
    title: "",
    category: "",
    targetMarket: "Rwanda",
    details: "",
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await create.mutateAsync(values);
      toast.success("Request submitted", { description: `Your Tracking ID is ${result.reference}.` });
      router.replace("/portal");
    } catch (error) {
      toast.error("Could not submit your request", { description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <Button asChild variant="ghost" className="-ml-3 w-fit"><Link href="/portal"><ArrowLeft data-icon="inline-start" />Back to my requests</Link></Button>
      <div><p className="text-sm font-medium text-primary">New request</p><h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Tell us what you need</h1><p className="mt-2 text-muted-foreground">Share enough detail for our team to understand the supply opportunity and contact you with the right next step.</p></div>
      <Card>
        <CardHeader><CardTitle>Request details</CardTitle><CardDescription>After you submit, you can follow its review and engagement updates in your portal.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="requestType">Type of support</Label><Select value={values.requestType} onValueChange={(value: NewClientRequest["requestType"]) => setValues((current) => ({ ...current, requestType: value }))}><SelectTrigger id="requestType"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="buyer_request">Buyer requirement</SelectItem><SelectItem value="supplier_offer">Supplier offer</SelectItem><SelectItem value="buying">Buying / purchasing</SelectItem><SelectItem value="selling">Selling / market representation</SelectItem><SelectItem value="sourcing">Supplier search / sourcing</SelectItem><SelectItem value="bidding">Tender / bidding support</SelectItem><SelectItem value="shipping">Shipping / logistics</SelectItem><SelectItem value="market_access">Market access</SelectItem><SelectItem value="partnership">Business partnership</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              <div className="flex flex-col gap-2"><Label htmlFor="category">Product or service category</Label><Input id="category" required maxLength={160} placeholder="e.g. Medical equipment" value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value })} /></div>
            </div>
            <div className="flex flex-col gap-2"><Label htmlFor="title">Request title</Label><Input id="title" required minLength={5} maxLength={220} placeholder="A short description of the opportunity" value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="targetMarket">Target market</Label><Input id="targetMarket" required maxLength={160} placeholder="Rwanda or another market" value={values.targetMarket} onChange={(event) => setValues({ ...values, targetMarket: event.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="details">What should we know?</Label><Textarea id="details" required minLength={20} maxLength={8000} rows={6} placeholder="Describe the products, quantities, specifications, timing, manufacturer details, or support you are looking for." value={values.details} onChange={(event) => setValues({ ...values, details: event.target.value })} /><p className="text-xs text-muted-foreground">Include any known specifications, quantity, budget, procurement timeline, supplier credentials, or supporting context.</p></div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="max-w-lg text-xs text-muted-foreground">Submitting this request does not mean a tender has been awarded or a supplier selected.</p><Button type="submit" disabled={create.isPending}>{create.isPending ? "Submitting…" : "Submit request"}<Send data-icon="inline-end" /></Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
