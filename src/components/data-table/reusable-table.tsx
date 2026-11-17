"use client";

import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<Row> {
  id: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  className?: string;
}

interface ReusableTableProps<Row> {
  rows: Row[];
  columns: DataTableColumn<Row>[];
  getRowId: (row: Row) => string;
  emptyMessage?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: Row) => void;
  initialSearch?: string;
  getSearchText?: (row: Row) => string;
  resetKey?: string;
  toolbar?: ReactNode;
  className?: string;
}

export function ReusableTable<Row>({
  rows,
  columns,
  getRowId,
  emptyMessage = "No records found.",
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20],
  onRowClick,
  initialSearch = "",
  getSearchText,
  resetKey,
  toolbar,
  className,
}: ReusableTableProps<Row>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const filteredRows = useMemo(() => {
    const term = initialSearch.trim().toLocaleLowerCase();
    if (!term || !getSearchText) return rows;
    return rows.filter((row) => getSearchText(row).toLocaleLowerCase().includes(term));
  }, [getSearchText, initialSearch, rows]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const startIndex = currentPage * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const firstRow = filteredRows.length === 0 ? 0 : startIndex + 1;
  const lastRow = Math.min(startIndex + pageSize, filteredRows.length);

  useEffect(() => setPageIndex(0), [initialSearch, pageSize, resetKey, rows.length]);

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: Row) {
    if (event.target !== event.currentTarget || !onRowClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {toolbar && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/15 px-4 py-3">
          {toolbar}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 [&_th]:h-11 [&_th]:whitespace-nowrap [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.id} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td]:py-3">
            {pageRows.length > 0 ? (
              pageRows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (event) => handleRowKeyDown(event, row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={cn(
                    "border-border/70 odd:bg-muted/15 hover:bg-muted/40",
                    onRowClick &&
                      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                  )}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[76px] rounded-md shadow-none" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span aria-live="polite">
            Showing {firstRow}–{lastRow} of {filteredRows.length}
          </span>
        </div>

        <nav
          aria-label="Table pagination"
          className="flex items-center gap-1 self-end sm:self-auto"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="First page"
            disabled={currentPage === 0}
            onClick={() => setPageIndex(0)}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Previous page"
            disabled={currentPage === 0}
            onClick={() => setPageIndex(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-20 px-2 text-center text-xs text-muted-foreground">
            Page {currentPage + 1} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Next page"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPageIndex(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Last page"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPageIndex(pageCount - 1)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
