"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState, type ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { PortalFrame } from "@/components/client-portal/portal-frame";

function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/portal/login") return <>{children}</>;
  if (pathname.startsWith("/portal")) return <PortalFrame>{children}</PortalFrame>;
  if (!pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <SidebarProvider>
      <div className="flex h-svh w-full overflow-hidden">
        <Suspense
          fallback={<div className="hidden h-full w-64 animate-pulse bg-sidebar md:block" />}
        >
          <AppSidebar />
        </Suspense>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-sidebar">
          <Suspense fallback={<div className="h-14 w-full animate-pulse" />}>
            <AppHeader />
          </Suspense>
          <Suspense
            fallback={
              <main className="min-h-0 flex-1 animate-pulse bg-background" aria-label="Loading dashboard" />
            }
          >
            <div className="app-main-scroll m-4 min-h-0 min-w-0 flex-1 overflow-y-auto rounded-2xl bg-background">{children}</div>
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<main className="min-h-svh bg-background" aria-label="Loading application" />}>
        <AppFrame>{children}</AppFrame>
      </Suspense>
      <Toaster richColors />
    </QueryClientProvider>
  );
}
