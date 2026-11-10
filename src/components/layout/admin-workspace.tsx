"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminWorkspace({ children, staffMode = false }: { children: ReactNode; staffMode?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (staffMode && pathname !== "/admin/client-requests") router.replace("/admin/client-requests");
  }, [pathname, router, staffMode]);
  if (staffMode && pathname !== "/admin/client-requests") return null;
  return (
    <QueryProvider>
      <SidebarProvider>
        <div className="flex h-svh w-full overflow-hidden bg-background">
          <Suspense fallback={<div className="hidden h-full w-64 animate-pulse bg-sidebar md:block" />}>
            <AppSidebar staffMode={staffMode} />
          </Suspense>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-sidebar">
            <Suspense fallback={<div className="h-14 w-full animate-pulse" />}>
              <AppHeader staffMode={staffMode} />
            </Suspense>
            <main className="app-main-scroll m-4 min-h-0 min-w-0 flex-1 overflow-y-auto rounded-2xl bg-background">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </QueryProvider>
  );
}
