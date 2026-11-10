"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePortalLogout, usePortalUser } from "@/features/client-portal/hooks";

export function PortalFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = usePortalUser();
  const signOut = usePortalLogout();

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => router.replace("/portal/login"),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="min-h-svh bg-warm">
      <header className="sticky top-0 z-20 border-b border-brand-primary/10 bg-brand-white/95 backdrop-blur">
        <div aria-hidden="true" className="h-1 bg-brand-primary"><div className="h-full w-1/5 bg-brand-gold" /></div>
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link href="/portal" aria-label="LEAD MULTI-CHOICE ® client portal" className="shrink-0">
              <Image src="/lead_multi-choice_logo.png" alt="LEAD MULTI-CHOICE ®" width={512} height={191} priority className="h-8 w-auto sm:h-9" />
            </Link>
            <span className="hidden h-8 border-l border-border sm:block" aria-hidden="true" />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground md:block">Client trade desk</span>
          </div>
          <nav aria-label="Client portal" className="flex items-center gap-1 sm:gap-2">
            <Link href="/portal" aria-current={pathname === "/portal" ? "page" : undefined} className={`rounded-md px-2.5 py-2 text-xs font-semibold transition-colors sm:px-3 sm:text-sm ${pathname === "/portal" ? "bg-surface text-brand-primary" : "text-charcoal/75 hover:bg-surface hover:text-brand-primary"}`}>
              My requests
            </Link>
            <Button asChild size="sm" className="h-9 px-2.5 sm:px-3">
              <Link href="/portal/requests/new"><Plus data-icon="inline-start" />New request</Link>
            </Button>
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span aria-hidden="true" className="hidden size-8 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-charcoal sm:flex">{data?.user?.name?.trim().charAt(0).toUpperCase() ?? "C"}</span>
            <div className="hidden text-right sm:block">
              <p className="max-w-36 truncate text-xs font-semibold">{data?.user?.name ?? "Client account"}</p>
              <p className="text-[11px] capitalize text-muted-foreground">{data?.user?.organization || data?.user?.role || "Client"}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" className="size-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" disabled={signOut.isPending} onClick={handleSignOut}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7">{children}</main>
    </div>
  );
}
