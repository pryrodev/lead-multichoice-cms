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
    <div className="min-h-svh bg-muted/30">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/portal" aria-label="LEAD MULTICHOICE client portal" className="shrink-0">
            <Image src="/lead_multi-choice_logo.png" alt="LEAD MULTICHOICE" width={512} height={191} priority className="h-9 w-auto" />
          </Link>
          <nav aria-label="Client portal" className="flex items-center gap-1 sm:gap-2">
            <Button asChild variant={pathname === "/portal" ? "secondary" : "ghost"} size="sm">
              <Link href="/portal">My requests</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/portal/requests/new"><Plus data-icon="inline-start" />New request</Link>
            </Button>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{data?.user?.name ?? "Client account"}</p>
              <p className="text-xs capitalize text-muted-foreground">{data?.user?.role ?? ""}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Sign out" disabled={signOut.isPending} onClick={handleSignOut}>
              <LogOut />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:py-6">{children}</main>
    </div>
  );
}
