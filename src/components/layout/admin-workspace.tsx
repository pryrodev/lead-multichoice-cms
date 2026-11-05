"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { QueryProvider } from "@/components/providers/query-provider";

export function AdminWorkspace({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <div className="flex h-svh w-full overflow-hidden">
          <Suspense fallback={<div className="hidden h-full w-64 animate-pulse bg-sidebar md:block" />}>
            <AppSidebar />
          </Suspense>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-sidebar">
            <Suspense fallback={<div className="h-14 w-full animate-pulse" />}>
              <AppHeader />
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
