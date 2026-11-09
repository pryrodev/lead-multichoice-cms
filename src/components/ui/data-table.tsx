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
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/20 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPageIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="bg-background pl-9"
              aria-label={searchPlaceholder}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            <Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPageIndex(0); }}>
              <SelectTrigger className="w-[138px] bg-background" aria-label="Rows per page"><SelectValue /></SelectTrigger>
              <SelectContent>{pageSizeOptions.map((size) => <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 [&_th]:h-11 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-muted-foreground">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => <TableHead key={column.id} className={column.className}>{column.header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td]:py-3">
            {pageRows.length ? pageRows.map((row) => (
              <TableRow key={getRowId(row)} className="border-border/70 hover:bg-muted/30">
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

      <div className="flex flex-col gap-3 border-t bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
