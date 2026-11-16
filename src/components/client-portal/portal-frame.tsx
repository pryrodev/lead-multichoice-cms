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
    <div className="min-h-svh bg-white">
      <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
        <div aria-hidden="true" className="h-0.5 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-gold" />
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-6 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-5">
            <Link
              href="/portal"
              aria-label="Lead Multi-Choice ® client portal"
              className="shrink-0"
            >
              <Image
                src="/lead_multi-choice_logo.png"
                alt="Lead Multi-Choice ®"
                width={512}
                height={191}
                priority
                className="h-7 w-auto sm:h-9"
              />
            </Link>
            <span className="hidden h-8 border-l border-border sm:block" aria-hidden="true" />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:block">
              Client trade desk
            </span>
          </div>
          <nav aria-label="Client portal" className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/portal"
              aria-current={pathname === "/portal" ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                pathname === "/portal"
                  ? "bg-surface font-semibold text-brand-primary"
                  : "text-steel hover:bg-surface/60 hover:text-brand-primary"
              }`}
            >
              <span className="sm:hidden">Requests</span>
              <span className="hidden sm:inline">My requests</span>
            </Link>
            <Button asChild size="sm" className="h-8 bg-brand-primary px-3 text-brand-white shadow-xs hover:bg-brand-primary/90 sm:h-9">
              <Link href="/portal/requests/new" aria-label="Create a new request" title="Create a new request">
                <Plus data-icon="inline-start" />
                <span className="hidden sm:inline">New request</span>
              </Link>
            </Button>
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full border border-brand-primary/25 bg-surface text-xs font-bold text-brand-primary sm:size-8"
            >
              {data?.user?.name?.trim().charAt(0).toUpperCase() ?? "C"}
            </span>
            <div className="hidden text-right sm:block">
              <p className="max-w-36 truncate text-xs font-semibold text-charcoal">
                {data?.user?.name ?? "Client account"}
              </p>
              <p className="text-[11px] capitalize text-steel">
                {data?.user?.organization || data?.user?.role || "Client"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              title="Sign out"
              className="size-9 text-steel hover:bg-destructive/10 hover:text-destructive"
              disabled={signOut.isPending}
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7">{children}</main>
    </div>
  );
}
