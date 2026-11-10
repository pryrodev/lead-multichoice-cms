import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalUnavailable() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] items-center justify-center overflow-hidden bg-brand-primary px-4 py-16 text-center text-brand-white">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Image src="/site/hero-port.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-brand-primary/75" aria-hidden="true" />
      <div className="w-full max-w-5xl">
        <p className="eyebrow mb-4 text-brass-light">Client portal</p>
        <h1 className="font-display text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-tight lg:whitespace-nowrap">Portal access is not available yet.</h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-brand-white/85">
          You can continue exploring the LEAD MULTI-CHOICE ® website. Client accounts and request tracking will open when portal access is enabled.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" className="border-brand-white/60 bg-brand-white text-brand-primary hover:bg-brand-white/90 hover:text-brand-primary">
            <Link href="/"><ArrowLeft data-icon="inline-start" />Back to website</Link>
          </Button>
          <Button asChild variant="ghost" className="text-brand-white hover:bg-brand-white/10 hover:text-brand-white">
            <Link href="/contact"><Mail data-icon="inline-start" />Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
