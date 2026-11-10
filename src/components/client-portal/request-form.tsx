"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Send } from "lucide-react";
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
    <div className="mx-auto max-w-6xl space-y-5">
      <Button asChild variant="ghost" className="-ml-3 w-fit"><Link href="/portal"><ArrowLeft data-icon="inline-start" />My requests</Link></Button>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <div>
            <p className="eyebrow">New request</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">What can we help move forward?</h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">Share the opportunity. Our team will review it and keep the next steps visible in your trade desk.</p>
          </div>

          <Card className="rounded-xl border-brand-primary/15 shadow-none">
            <CardHeader className="border-b bg-surface/40">
              <CardTitle className="font-display text-lg">Request brief</CardTitle>
              <CardDescription>Required fields help us start the review.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="requestType">Type of support</Label>
                    <Select value={values.requestType} onValueChange={(value: NewClientRequest["requestType"]) => setValues((current) => ({ ...current, requestType: value }))}>
                      <SelectTrigger id="requestType"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer_request">Buyer requirement</SelectItem><SelectItem value="supplier_offer">Supplier offer</SelectItem>
                        <SelectItem value="buying">Buying / purchasing</SelectItem><SelectItem value="selling">Selling / representation</SelectItem>
                        <SelectItem value="sourcing">Supplier search</SelectItem><SelectItem value="bidding">Tender support</SelectItem>
                        <SelectItem value="shipping">Shipping / logistics</SelectItem><SelectItem value="market_access">Market access</SelectItem>
                        <SelectItem value="partnership">Business partnership</SelectItem><SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2"><Label htmlFor="category">Product or service</Label><Input id="category" required maxLength={160} placeholder="e.g. Medical equipment" value={values.category} onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))} /></div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2"><Label htmlFor="title">Request title</Label><Input id="title" required minLength={5} maxLength={220} placeholder="A short description of the opportunity" value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} /></div>
                  <div className="flex flex-col gap-2"><Label htmlFor="targetMarket">Target market</Label><Input id="targetMarket" required maxLength={160} placeholder="Rwanda or another market" value={values.targetMarket} onChange={(event) => setValues((current) => ({ ...current, targetMarket: event.target.value }))} /></div>
                </div>
                <div className="flex flex-col gap-2"><Label htmlFor="details">Request details</Label><Textarea id="details" required minLength={20} maxLength={8000} rows={5} placeholder="Products, quantities, specifications, timing, supplier details, or support needed." value={values.details} onChange={(event) => setValues((current) => ({ ...current, details: event.target.value }))} /></div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">A request starts a review; it does not confirm an award or supplier selection.</p>
                  <Button type="submit" disabled={create.isPending}>{create.isPending ? "Sending…" : "Send request"}<Send data-icon="inline-end" /></Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="rounded-xl bg-brand-primary p-5 text-brand-white lg:sticky lg:top-24">
          <p className="eyebrow text-brand-gold">What happens next</p>
          <ol className="mt-5 space-y-5">
            {["We review the details", "A team member coordinates with you", "Follow progress with your Tracking ID"].map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-charcoal">{index < 2 ? <Check className="size-3.5" /> : "3"}</span>
                <span className="pt-0.5 text-sm leading-relaxed text-brand-white/90">{item}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 border-t border-brand-white/20 pt-4"><p className="text-xs leading-relaxed text-brand-white/75">Your request and its updates stay together in your trade desk.</p></div>
        </aside>
      </div>
    </div>
  );
}
