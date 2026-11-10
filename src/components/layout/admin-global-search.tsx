"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useAdminSearch } from "@/lib/api/hooks";

const pageLinks = [
  { title: "Dashboard", description: "Overview and activity", href: "/admin" },
  { title: "Opportunities", description: "Buyer needs and supplier leads", href: "/admin/opportunities" },
  { title: "Client requests", description: "Requests and tracking updates", href: "/admin/client-requests" },
  { title: "Engagements", description: "Active client work", href: "/admin/engagements" },
  { title: "Tender tracking", description: "Notices, deadlines and outcomes", href: "/admin/tenders" },
  { title: "Logistics", description: "Shipments and customs clearance", href: "/admin/logistics" },
  { title: "CMS dashboard", description: "Manage website content", href: "/admin/content" },
  { title: "Homepage editor", description: "Edit the homepage", href: "/admin/content/home" },
  { title: "Website copy", description: "Edit translated website text", href: "/admin/content/copy" },
  { title: "Website images", description: "Manage page imagery", href: "/admin/content/visuals" },
  { title: "Procurement resources", description: "Manage public procurement links", href: "/admin/content/resources" },
  { title: "Media library", description: "Uploaded website assets", href: "/admin/content/media" },
  { title: "Settings", description: "Company and account settings", href: "/admin/settings" },
];

export function AdminGlobalSearch({ staffMode = false }: { staffMode?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  const searchablePages = useMemo(
    () => (staffMode ? pageLinks.filter((page) => page.href === "/admin/client-requests") : pageLinks),
    [staffMode],
  );
  const matchingPages = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? searchablePages.filter((page) => `${page.title} ${page.description}`.toLowerCase().includes(term)) : searchablePages.slice(0, 5);
  }, [query, searchablePages]);
  const search = useAdminSearch(debouncedQuery, open && debouncedQuery.length >= 2);
  const matchingRecords = query.trim().length >= 2 && query.trim() === debouncedQuery ? search.data ?? [] : [];
  const waitingForRecords = query.trim().length >= 2 && (query.trim() !== debouncedQuery || search.isFetching);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden h-10 min-w-0 w-[min(30vw,420px)] justify-start gap-2 rounded-xl border-0 bg-muted/80 px-3 font-normal text-muted-foreground shadow-none hover:bg-muted lg:flex"
        aria-label="Search admin pages and records"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search pages and records...</span>
        <kbd className="pointer-events-none hidden rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground xl:inline">Ctrl K</kbd>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 shrink-0 lg:hidden"
        aria-label="Search admin pages and records"
      >
        <Search className="size-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search admin pages and records</DialogTitle>
        <DialogDescription className="sr-only">Search admin sections and matching business records.</DialogDescription>
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search pages, clients, references..." />
        <CommandList className="max-h-[min(60vh,420px)]">
          {waitingForRecords && <p className="px-4 py-3 text-sm text-muted-foreground">Searching records…</p>}
          {query.trim().length >= 2 && search.isError && <p className="px-4 py-3 text-sm text-destructive">Could not search records. Try again.</p>}
          {!waitingForRecords && !search.isError && matchingPages.length === 0 && matchingRecords.length === 0 && <CommandEmpty>No matching pages or records.</CommandEmpty>}
          {matchingPages.length > 0 && (
            <CommandGroup heading="Pages">
              {matchingPages.map((page) => (
                <CommandItem key={page.href} value={`${page.title} ${page.description}`} onSelect={() => navigate(page.href)}>
                  <Search className="text-muted-foreground" />
                  <span className="min-w-0 flex-1"><span className="block truncate">{page.title}</span><span className="block truncate text-xs text-muted-foreground">{page.description}</span></span>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {matchingRecords.length > 0 && (
            <CommandGroup heading="Records">
              {matchingRecords.map((record) => (
                <CommandItem key={record.id} value={`${record.kind} ${record.title} ${record.description}`} onSelect={() => navigate(record.href)}>
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{record.kind}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate">{record.title}</span><span className="block truncate text-xs text-muted-foreground">{record.description}</span></span>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
