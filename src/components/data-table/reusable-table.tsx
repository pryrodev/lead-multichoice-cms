"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
}: ReusableTableProps<Row>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const filteredRows = useMemo(() => {
    const term = initialSearch.trim().toLocaleLowerCase();
    return term && getSearchText
      ? rows.filter((row) => getSearchText(row).toLocaleLowerCase().includes(term))
      : rows;
  }, [getSearchText, initialSearch, rows]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const startIndex = currentPage * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const firstRow = filteredRows.length === 0 ? 0 : startIndex + 1;
  const lastRow = Math.min(startIndex + pageSize, filteredRows.length);

  useEffect(() => setPageIndex(0), [rows.length, pageSize, initialSearch]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/45 hover:bg-muted/45">
              {columns.map((column) => <TableHead key={column.id} className={cn("h-11 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground", column.className)}>{column.header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={getRowId(row)} onClick={() => onRowClick?.(row)} className={cn(onRowClick && "cursor-pointer")}>
                {columns.map((column) => <TableCell key={column.id} className={column.className}>{column.cell(row)}</TableCell>)}
              </TableRow>
            ))}
            {pageRows.length === 0 && <TableRow><TableCell colSpan={columns.length} className="h-28 text-center text-sm text-muted-foreground">{emptyMessage}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {filteredRows.length > 0 && (
        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <label className="flex items-center gap-2">Rows per page
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="h-8 rounded-md border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <span>Showing {firstRow}–{lastRow} of {filteredRows.length}</span>
          </div>
          {pageCount > 1 && (
            <nav aria-label="Table pagination" className="flex items-center gap-1 self-end sm:self-auto">
              <Button variant="outline" size="icon" className="h-8 w-8" aria-label="First page" disabled={currentPage === 0} onClick={() => setPageIndex(0)}><ChevronsLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPageIndex(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="min-w-20 px-2 text-center text-xs text-muted-foreground">Page {currentPage + 1} of {pageCount}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPageIndex(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Last page" disabled={currentPage >= pageCount - 1} onClick={() => setPageIndex(pageCount - 1)}><ChevronsRight className="h-4 w-4" /></Button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
