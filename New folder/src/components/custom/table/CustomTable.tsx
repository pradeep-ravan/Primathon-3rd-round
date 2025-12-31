'use client';

import React, { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// Type definitions
interface Column<T = unknown> {
  key: string;
  title: string;
  icon?: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  cellClassName?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface EmptyState {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

interface LoadingState {
  icon?: React.ReactNode;
  message: string;
}

interface CustomTableProps<T = unknown> {
  data?: T[];
  columns?: Column<T>[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyState?: EmptyState;
  loadingState?: LoadingState;
  rowKey?: (item: T) => string;
  rowClassName?: string;
  onRowClick?: (item: T) => void;
  openPopup?: () => void;
  openPopup2?: () => void;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  selection?: {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    enabled?: boolean;
  };
}

/**
 * Reusable and configurable table component that works with various data sources
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data items to display
 * @param {Array} props.columns - Array of column definitions with title, key, and render function
 * @param {boolean} props.loading - Whether the table is loading data
 * @param {string} props.sortBy - Current sort column key
 * @param {string} props.sortOrder - Current sort order ('asc' or 'desc')
 * @param {function} props.onSort - Function to call when sorting changes (column) => void
 * @param {Object} props.emptyState - Configuration for empty state
 * @param {Object} props.loadingState - Configuration for loading state
 * @param {function} props.rowKey - Function to get a unique key for each row (item) => string
 * @param {string} props.rowClassName - CSS class name for rows
 * @param {function} props.onRowClick - Function called when a row is clicked (item) => void
 * @param {Object} props.pagination - Pagination configuration object with page, limit, total and pages properties
 * @param {function} props.onPageChange - Function called when page changes (page) => void
 * @param {function} props.onPageSizeChange - Function called when page size changes (pageSize) => void
 * @param {Array} props.pageSizeOptions - Array of available page sizes
 */
const CustomTable = <T = unknown,>({
  data = [],
  columns = [],
  loading = false,
  sortBy,
  sortOrder = 'asc',
  onSort,
  emptyState = {
    icon: null,
    message: 'No data found',
    action: null,
  },
  loadingState = {
    icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
    message: 'Loading data...',
  },
  rowKey = (item: T) => (item as { id?: string }).id || '',
  rowClassName = 'border-b border-border/50 hover:bg-gradient-to-r hover:from-accent/30 hover:to-accent/20 transition-all duration-200',
  onRowClick,
  pagination = { page: 1, limit: 10, total: 0, pages: 0 },
  onPageChange,
  selection,
}: CustomTableProps<T>) => {
  // Generate a safe ID for each row
  const getSafeRowId = (item: T, index: number): string => {
    try {
      return rowKey(item) || `row-${index}`;
    } catch {
      return `row-${index}`;
    }
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages && onPageChange) {
      onPageChange(newPage);
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const { page, pages } = pagination;
    const maxButtons = 5; // Maximum number of page buttons to show

    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    const endPage = Math.min(pages, startPage + maxButtons - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pageButtons = [];

    // First page button
    pageButtons.push(
      <Button
        key="first"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 border border-transparent rounded-lg transition-all duration-200"
        disabled={page === 1 || loading}
        onClick={() => handlePageChange(1)}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
    );

    // Previous page button
    pageButtons.push(
      <Button
        key="prev"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 border border-transparent rounded-lg transition-all duration-200"
        disabled={page === 1 || loading}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={page === i ? 'default' : 'ghost'}
          size="sm"
          className={`h-9 w-9 font-medium transition-all duration-200 ${
            page === i
              ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-accent/40 hover:to-accent/30 border border-transparent hover:border-primary/30 rounded-lg'
          }`}
          disabled={loading}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Next page button
    pageButtons.push(
      <Button
        key="next"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 border border-transparent rounded-lg transition-all duration-200"
        disabled={page === pages || pages === 0 || loading}
        onClick={() => handlePageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    // Last page button
    pageButtons.push(
      <Button
        key="last"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-primary/30 border border-transparent rounded-lg transition-all duration-200"
        disabled={page === pages || pages === 0 || loading}
        onClick={() => handlePageChange(pages)}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    );

    return pageButtons;
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl"></div>

        {/* Table container */}
        <div className="relative gradient-card bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/30 dark:to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-200">
                {selection?.enabled && (
                  <TableHead className="w-[50px] px-6 py-4">
                    <Checkbox
                      checked={
                        data.length > 0 &&
                        data.every((item) =>
                          selection.selectedIds.includes(rowKey(item))
                        )
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const allIds = data.map((item) => rowKey(item));
                          selection.onSelectionChange(allIds);
                        } else {
                          selection.onSelectionChange([]);
                        }
                      }}
                    />
                  </TableHead>
                )}
                {columns.map((column: Column<T>) => (
                  <TableHead
                    key={column.key}
                    className={`px-6 py-4 font-semibold text-sm ${
                      onSort
                        ? 'cursor-pointer group hover:text-primary transition-colors duration-200'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => onSort && onSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.icon && (
                        <span className="text-muted-foreground group-hover:text-primary transition-colors duration-200">
                          {column.icon}
                        </span>
                      )}
                      <span className="text-foreground">{column.title}</span>
                      {sortBy === column.key && onSort && (
                        <span className="ml-1.5 text-primary flex items-center">
                          {sortOrder === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selection?.enabled ? 1 : 0)}
                    className="p-8"
                  >
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="text-primary">{loadingState.icon}</div>
                      <p className="text-muted-foreground font-medium animate-pulse">
                        {loadingState.message}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selection?.enabled ? 1 : 0)}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="text-muted-foreground">
                        {emptyState.icon}
                      </div>
                      <p className="text-foreground font-medium text-base">
                        {emptyState.message}
                      </p>
                      {emptyState.action && (
                        <div className="mt-2">{emptyState.action}</div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow
                    key={getSafeRowId(item, index)}
                    className={`${rowClassName} ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {selection?.enabled && (
                      <TableCell className="w-[50px] px-6 py-4">
                        <Checkbox
                          checked={selection.selectedIds.includes(rowKey(item))}
                          onCheckedChange={(checked) => {
                            const id = rowKey(item);
                            if (checked) {
                              selection.onSelectionChange([
                                ...selection.selectedIds,
                                id,
                              ]);
                            } else {
                              selection.onSelectionChange(
                                selection.selectedIds.filter(
                                  (selectedId) => selectedId !== id
                                )
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {columns.map((column: Column<T>, columnIndex: number) => (
                      <TableCell
                        key={`${getSafeRowId(item, index)}-${
                          column.key || columnIndex
                        }`}
                        className={`text-foreground ${
                          column.cellClassName || 'px-6 py-4'
                        }`}
                      >
                        {column.render
                          ? (column.render(item) as ReactNode)
                          : String(
                              (item as Record<string, unknown>)[column.key] ||
                                ''
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Modern Pagination Component */}
          {!loading && data.length > 0 && pagination && (
            <div className="border-t border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/30 dark:to-muted/10 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">
                  Showing{' '}
                  <span className="font-semibold text-foreground">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-foreground">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-foreground">
                    {pagination.total}
                  </span>{' '}
                  results
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Modern Pagination buttons */}
                <div className="flex items-center gap-1.5">
                  {renderPaginationButtons()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomTable;
