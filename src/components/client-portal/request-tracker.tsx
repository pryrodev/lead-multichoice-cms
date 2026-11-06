"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Hash } from "lucide-react";
import { useSiteVisuals } from "@/components/site/SiteVisualsProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RequestTracker() {
  const [reference, setReference] = useState("");
  const router = useRouter();
  const visuals = useSiteVisuals();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const orderId = reference.trim().toUpperCase();
    if (orderId) router.push(`/track/${encodeURIComponent(orderId)}`);
  }

  return (
    <section className="photo-parallax relative isolate flex min-h-[calc(100svh-6rem)] items-center overflow-hidden bg-brand-primary py-16 md:py-20">
      <div className="photo-parallax-window" aria-hidden="true">
        <Image src={visuals["tracking.hero"]} alt="" fill priority sizes="100vw" className="photo-parallax-image" />
      </div>
      <div className="absolute inset-0 -z-10 bg-brand-primary/70" aria-hidden="true" />

      <div className="container-site relative z-10 mx-auto w-full max-w-5xl text-center text-brand-white">
        <p className="eyebrow mb-4 text-brass-light">Order tracking</p>
        <h1 className="mx-auto font-display text-4xl font-semibold leading-tight md:text-6xl lg:whitespace-nowrap">
          Your request, moving forward.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-white/85 md:text-lg">
          Check the latest progress shared by the LEAD MULTICHOICE team.
        </p>

        <Card className="mx-auto mt-9 max-w-4xl rounded-xl border-brand-white/30 bg-brand-white p-2 text-foreground shadow-none sm:p-3">
          <CardContent className="p-2 sm:p-3">
            <form onSubmit={submit} className="grid gap-3 text-left sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="grid gap-2">
                <Label htmlFor="tracking-reference">Tracking ID</Label>
                <div className="relative">
                  <Hash aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="tracking-reference" value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} placeholder="LMC-REQ-XXXXXXXXXXXXXXXXXXXXXXXX" autoCapitalize="characters" autoComplete="off" required maxLength={32} className="h-12 pl-10" />
                </div>
              </div>
              <Button type="submit" className="h-12 min-w-40">
                Track progress <ArrowRight data-icon="inline-end" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-sm text-brand-white/75">Enter the Tracking ID shared by LEAD MULTICHOICE. No account or email is needed.</p>
      </div>
    </section>
  );
}

