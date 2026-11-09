"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface DataTableColumn<TRow> {
  id: string;
  header: ReactNode;
  cell: (row: TRow) => ReactNode;
  className?: string;
}

interface DataTableProps<TRow> {
  data: TRow[];
  columns: DataTableColumn<TRow>[];
  getRowId: (row: TRow) => string;
  getSearchText: (row: TRow) => string;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  resetKey?: string;
}

export function DataTable<TRow>({
  data,
  columns,
  getRowId,
  getSearchText,
  searchPlaceholder = "Search...",
  toolbar,
  emptyMessage = "No records found.",
  pageSizeOptions = [10, 25, 50],
  resetKey,
}: DataTableProps<TRow>) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [pageIndex, setPageIndex] = useState(0);

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    if (!normalizedSearch) return data;
    return data.filter((row) => getSearchText(row).toLocaleLowerCase().includes(normalizedSearch));
  }, [data, getSearchText, search]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const startIndex = currentPage * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const rangeStart = filteredRows.length ? startIndex + 1 : 0;
  const rangeEnd = Math.min(startIndex + pageSize, filteredRows.length);

  // Reset pagination when external filters change.
  useEffect(() => {
    setPageIndex(0);
  }, [resetKey]);

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-primary/15 bg-card shadow-sm shadow-brand-primary/5">
      <div className="relative border-b border-brand-primary/10 bg-[linear-gradient(115deg,color-mix(in_oklab,var(--brand-primary)_7%,var(--brand-white)),var(--brand-white)_54%,color-mix(in_oklab,var(--brand-gold)_8%,var(--brand-white)))] p-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--brand-primary)_24%,transparent)_1px,transparent_0)] [background-size:18px_18px] opacity-25" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-primary/75" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPageIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="border-brand-primary/15 bg-brand-white/90 pl-9 shadow-sm shadow-brand-primary/5 placeholder:text-muted-foreground/80 focus-visible:border-brand-primary/40"
              aria-label={searchPlaceholder}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            <Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPageIndex(0); }}>
              <SelectTrigger className="w-[138px] border-brand-primary/15 bg-brand-white/90 shadow-sm shadow-brand-primary/5" aria-label="Rows per page"><SelectValue /></SelectTrigger>
              <SelectContent>{pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-brand-primary/15 bg-brand-primary/[0.045] text-brand-primary/85 [&_th]:h-11 [&_th]:text-[0.7rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.08em]">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => <TableHead key={column.id} className={column.className}>{column.header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-brand-primary/10 [&_tr:nth-child(even)]:bg-brand-primary/[0.022] [&_tr:hover]:bg-brand-primary/[0.065] [&_td]:py-3">
            {pageRows.length ? pageRows.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => <TableCell key={column.id} className={column.className}>{column.cell(row)}</TableCell>)}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-muted-foreground">{emptyMessage}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-brand-primary/10 bg-brand-primary/[0.025] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">Showing <span className="font-medium text-foreground">{rangeStart}–{rangeEnd}</span> of <span className="font-medium text-foreground">{filteredRows.length}</span> records</p>
        <nav aria-label="Table pagination" className="flex items-center gap-2 self-end sm:self-auto">
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setPageIndex(currentPage - 1)} disabled={currentPage === 0}>
            <ChevronLeft className="size-4" /> Previous
          </Button>
          <span className="min-w-20 text-center text-sm text-muted-foreground">Page {currentPage + 1} of {pageCount}</span>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setPageIndex(currentPage + 1)} disabled={currentPage >= pageCount - 1}>
            Next <ChevronRight className="size-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
