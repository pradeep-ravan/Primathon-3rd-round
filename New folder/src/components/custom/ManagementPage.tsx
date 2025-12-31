'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CustomTable from '@/components/custom/table/CustomTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DeleteDialog } from '@/components/ui/DeleteDialog';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Globe,
  Shield,
  Edit,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';

// Generic types for the management page
export interface ManagementPageConfig<T = unknown> {
  // Page metadata
  title: string;
  description: string;
  icon: React.ReactNode;
  itemName: string; // e.g., "Domain", "User", "Project"
  itemNamePlural: string; // e.g., "Domains", "Users", "Projects"

  // Data management
  useData: () => {
    data: T[] | undefined;
    isLoading: boolean;
    isFetching?: boolean;
    error: Error | null;
    refetch: () => void;
  };
  useDelete: () => {
    mutateAsync: (id: string | { id: string; domainId?: string; transferTo?: string }) => Promise<unknown>;
    isPending: boolean;
  };

  // Table configuration
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, item: T) => React.ReactNode;
  }>;

  // Search and filters
  searchConfig?: {
    placeholder: string;
    searchKey: keyof T;
  };
  filters?: Array<{
    key: string;
    label: string;
    type: 'select' | 'multiselect';
    options: Array<{ value: string; label: string }>;
    getValue: (item: T) => string;
  }>;
  // Optional default filters to initialize selection (e.g., { domain_id: 'domain-1' })
  defaultFilters?: Record<string, string>;

  // Selection
  enableSelection?: boolean;

  // Sorting
  sortConfig?: {
    defaultSortBy: string;
    defaultSortOrder: 'asc' | 'desc';
  };

  // Pagination
  paginationConfig?: {
    pageSize: number;
    getPageData: (data: unknown) => {
      page: number;
      limit: number;
      total_count: number;
    };
  };

  // Form configuration
  formConfig?: {
    component: React.ComponentType<{
      item?: T;
      onClose: () => void;
      onSuccess: () => void;
    }>;
  };

  // Actions
  actions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
    canImport?: boolean;
    customActions?: Array<{
      label: string;
      icon: React.ReactNode;
      onClick: (item: T) => void;
      variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    }>;
  };

  // Delete dialog configuration
  deleteConfig?: {
    getDeleteInfo: (item: T) => {
      title: string;
      description: string;
      warningMessage?: string;
      additionalInfo?: Array<{ label: string; value: string | number }>;
      features?: Array<{ label: string; value: boolean; color: string }>;
      domainId?: string; // Optional domain ID for domain-specific deletes
    };
  };

  // Empty state
  emptyState?: {
    icon: React.ReactNode;
    message: string;
    action?: React.ReactNode;
  };

  // Loading state
  loadingState?: {
    icon: React.ReactNode;
    message: string;
  };

  // Custom header content
  headerContent?: React.ReactNode;

  // Custom filters content
  filtersContent?: React.ReactNode;
  // Callback for filter changes (optional)
  onFilterChange?: (filterKey: string, value: string) => void;
}

interface ManagementPageProps<T = unknown> {
  config: ManagementPageConfig<T>;
}

export function ManagementPage<T = unknown>({
  config,
}: ManagementPageProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    title,
    description,
    icon,
    itemName,
    itemNamePlural,
    useData,
    useDelete,
    columns,
    searchConfig,
    filters = [],
    defaultFilters,
    sortConfig,
    paginationConfig,
    formConfig,
    actions = {},
    deleteConfig,
    emptyState,
    loadingState,
    headerContent,
    filtersContent,
    onFilterChange,
  } = config;

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    defaultFilters || {}
  );
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if filters have been initialized
  const filtersInitialized = React.useRef(false);
  // Store previous defaultFilters to detect actual changes
  const prevDefaultFiltersRef = React.useRef<
    Record<string, string> | undefined
  >(defaultFilters);

  // Update activeFilters when defaultFilters change (e.g., when domain is set from URL)
  // Only update if the filter value hasn't been explicitly set by user
  React.useEffect(() => {
    // Check if defaultFilters actually changed by comparing keys and values
    const hasChanged =
      !prevDefaultFiltersRef.current !== !defaultFilters ||
      (defaultFilters &&
        prevDefaultFiltersRef.current &&
        (Object.keys(defaultFilters).length !==
          Object.keys(prevDefaultFiltersRef.current).length ||
          Object.keys(defaultFilters).some(
            (key) => defaultFilters[key] !== prevDefaultFiltersRef.current![key]
          )));

    if (!hasChanged) {
      return;
    }

    prevDefaultFiltersRef.current = defaultFilters;

    if (
      defaultFilters &&
      Object.keys(defaultFilters).length > 0 &&
      !filtersInitialized.current
    ) {
      // On initial mount, always use defaultFilters (this sets the filter UI to "all" by default)
      setActiveFilters(defaultFilters);
      filtersInitialized.current = true;
      // Don't call onFilterChange on initial mount - the filter state is already set correctly
    } else if (
      defaultFilters &&
      Object.keys(defaultFilters).length > 0 &&
      filtersInitialized.current
    ) {
      // After initial mount, only update filters that haven't been set yet or match the default
      setActiveFilters((prev) => {
        const updated = { ...prev };
        Object.keys(defaultFilters).forEach((key) => {
          // Only update if the current value is empty, matches what we're setting, or if default is "all"
          if (
            !prev[key] ||
            prev[key] === defaultFilters[key] ||
            defaultFilters[key] === 'all'
          ) {
            updated[key] = defaultFilters[key];
          }
        });
        return updated;
      });
    }
  }, [defaultFilters]);

  const [sortBy, setSortBy] = useState(sortConfig?.defaultSortBy || 'name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    sortConfig?.defaultSortOrder || 'asc'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Data hooks
  const { data, isLoading, isFetching, error, refetch } = useData();
  const deleteMutation = useDelete();

  // Show loading state when initially loading or when fetching (refreshing)
  const showLoading = isLoading || isFetching;

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${selectedIds.length} items?`)
    )
      return;

    try {
      await Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id))
      );
      toast.success(`${selectedIds.length} items deleted successfully`);
      setSelectedIds([]);
      refetch();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete some items');
    }
  };

  const handleExport = () => {
    const selectedData = data?.filter((item) =>
      selectedIds.includes((item as any).id)
    );
    if (!selectedData || selectedData.length === 0) return;

    const headers = columns.map((col) => col.label).join(',');
    const rows = selectedData
      .map((item) => {
        return columns
          .map((col) => {
            const val = (item as any)[col.key];
            return `"${val}"`;
          })
          .join(',');
      })
      .join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${itemNamePlural}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 300);
  }, []);

  // Filter and search data with debouncing
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    // Apply search with debouncing
    if (debouncedSearchTerm && searchConfig) {
      filtered = filtered.filter((item) =>
        String(item[searchConfig.searchKey])
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      const filterValue = activeFilters[filter.key];
      // For domain_id, always apply filter (no 'all' option)
      // For other filters, skip if 'all' is selected
      if (filterValue && (filter.key === 'domain_id' || filterValue !== 'all')) {
        filtered = filtered.filter((item) => {
          const itemValue = filter.getValue(item);
          return String(itemValue) === filterValue;
        });
      }
    });

    return filtered;
  }, [data, debouncedSearchTerm, activeFilters, searchConfig, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!filteredData.length) return [];

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy as keyof T];
      const bValue = b[sortBy as keyof T];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortOrder]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!paginationConfig) return sortedData;

    const startIndex = (currentPage - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, paginationConfig]);

  // Event handlers
  const handleRefresh = () => {
    refetch();
  };

  const handleAddItem = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEditItem = (item: T) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = (item: T) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const itemId = (itemToDelete as { id: string; account_id?: string }).id;
      const accountId = (itemToDelete as { account_id?: string }).account_id;
      // Get domainId from deleteConfig if available
      const deleteInfo = deleteConfig?.getDeleteInfo(itemToDelete);
      const domainId = deleteInfo?.domainId;
      // Also get accountId from deleteConfig if available (fallback)
      const accountIdFromConfig = (deleteInfo as any)?.accountId;

      // Pass domainId and accountId (id from API) if available
      if (domainId) {
        await deleteMutation.mutateAsync({ 
          id: itemId, 
          accountId: accountId || accountIdFromConfig,
          domainId 
        });
      } else {
        await deleteMutation.mutateAsync({ 
          id: itemId,
          accountId: accountId || accountIdFromConfig,
        });
      }

      // Show success toast immediately
      toast.success(`${itemName} deleted successfully`, {
        duration: 4000,
      });

      // Close dialog
      setShowDeleteDialog(false);
      setItemToDelete(null);

      // Refetch data to update the table
      refetch();
    } catch (error) {
      console.error('Delete error:', error);

      // Show error toast
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
          ? (error as any).message
          : `Failed to delete ${itemName}`;

      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterKey]: value }));
    // Call custom callback if provided (this updates the domain filter state)
    onFilterChange?.(filterKey, value);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <Card className="gradient-card bg-card/90 backdrop-blur-sm p-5 sm:p-6 text-center max-w-md w-full shadow-lg border border-border">
          <div className="text-destructive mb-3">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 break-words bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Error Loading {itemNamePlural}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm break-words">
            {error.message || 'An error occurred'}
          </p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-3 sm:space-y-4">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-lg">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/8 to-secondary/10 rounded-lg"></div>

          {/* Main header card */}
          <div className="relative gradient-card bg-card/90 backdrop-blur-xl border border-border/50 rounded-lg px-4 py-3.5 sm:px-5 sm:py-4 lg:px-6 lg:py-4.5 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  {/* Icon with gradient background */}
                  <div className="relative flex-shrink-0">
                    <div className="p-2.5 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-lg border border-primary/20 shadow-sm">
                      <div className="text-primary text-base sm:text-lg flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
                        {icon}
                      </div>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg blur-md -z-10 opacity-50"></div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words leading-tight">
                      {title}
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm break-words mt-1 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row items-center gap-2 w-full sm:w-auto flex-shrink-0">
                {selectedIds.length > 0 && (
                  <>
                    <Button
                      onClick={handleExport}
                      variant="outline"
                      size="sm"
                      className="transition-all duration-200 flex-1 sm:flex-initial hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-sm h-9"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline text-sm">
                        Export ({selectedIds.length})
                      </span>
                    </Button>
                    {/* {actions.canDelete && (
                      <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        size="sm"
                        className="transition-all duration-200 flex-1 sm:flex-initial shadow-sm hover:shadow-md h-9"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline text-sm">
                          Delete ({selectedIds.length})
                        </span>
                      </Button>
                    )} */}
                  </>
                )}
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={showLoading}
                  className="transition-all duration-200 flex-1 sm:flex-initial hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-sm h-9"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      showLoading ? 'animate-spin' : ''
                    } sm:mr-2`}
                  />
                  <span className="hidden sm:inline text-sm">Refresh</span>
                </Button>
                {actions.canImport && (
                  <Button
                    onClick={() => router.push(`${pathname}/import`)}
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 flex-1 sm:flex-initial hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-sm h-9"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline text-sm">Import</span>
                  </Button>
                )}
                {actions.canCreate && (
                  <Button
                    onClick={handleAddItem}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 flex-1 sm:flex-initial font-semibold h-9"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline text-sm">
                      Add {String(itemName)}
                    </span>
                    <span className="sm:hidden text-sm">Add</span>
                  </Button>
                )}
              </div>
            </div>
            {headerContent && (
              <div className="mt-3 pt-3 border-t border-border/50">
                {headerContent}
              </div>
            )}
          </div>
        </div>

        {/* Modern Filters Section */}
        {(searchConfig || filters.length > 0 || filtersContent) && (
          <div className="relative overflow-hidden rounded-lg">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 rounded-lg"></div>

            {/* Filters card */}
            <div className="relative gradient-accent bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm">
              <div className="flex flex-col gap-2.5">
                {/* Search and filters in a responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5">
                  {searchConfig && (
                    <div className="relative flex-1 group sm:col-span-2 lg:col-span-1">
                      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10" />
                      <Input
                        placeholder={searchConfig.placeholder}
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-8 h-9 gradient-card bg-card/60 dark:bg-card/40 border-border/50 text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-md transition-all duration-200 hover:border-primary/30 text-sm"
                      />
                    </div>
                  )}
                  {filters.map((filter) => {
                    // Hide "All" option for domain_id filter
                    const showAllOption = filter.key !== 'domain_id';
                    const currentValue = activeFilters[filter.key] || (showAllOption ? 'all' : filter.options[0]?.value || '');
                    
                    return (
                      <div key={filter.key} className="relative group">
                        <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10 pointer-events-none" />
                        <select
                          value={currentValue}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                          className="pl-8 pr-7 h-9 gradient-card bg-card/60 dark:bg-card/80 border border-border/50 text-foreground rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/20 appearance-none w-full text-sm transition-all duration-200 hover:border-primary/30 cursor-pointer"
                        >
                          {showAllOption && (
                            <option value="all">All {filter.label}</option>
                          )}
                          {filter.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg
                            className="w-3.5 h-3.5 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filtersContent && (
                  <div className="mt-1 pt-2 border-t border-border/30">
                    {filtersContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <CustomTable
          selection={{
            selectedIds,
            onSelectionChange: handleSelectionChange,
            enabled: config.enableSelection,
          }}
          data={paginatedData}
          columns={[
            ...columns.map((col) => ({
              key: col.key,
              title: col.label,
              sortable: col.sortable,
              render: col.render
                ? (item: T) => col.render!(item[col.key as keyof T], item)
                : undefined,
            })),
            // Add actions column if any actions are enabled
            ...(actions.canEdit || actions.canDelete || actions.customActions
              ? [
                  {
                    key: 'actions',
                    title: 'Actions',
                    render: (item: T) => (
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {actions.canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                            className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {actions.canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50 flex-shrink-0 transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {actions.customActions?.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || 'outline'}
                            size="sm"
                            onClick={() => action.onClick(item)}
                            className="h-8 w-8 p-0 flex-shrink-0 hover:bg-accent hover:text-accent-foreground hover:border-primary/50 transition-all duration-200"
                            title={action.label}
                          >
                            <div className="h-3.5 w-3.5">{action.icon}</div>
                          </Button>
                        ))}
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
          loading={showLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          pagination={
            paginationConfig
              ? {
                  page: currentPage,
                  limit: paginationConfig.pageSize,
                  total: sortedData.length,
                  pages: Math.ceil(
                    sortedData.length / paginationConfig.pageSize
                  ),
                }
              : undefined
          }
          onPageChange={handlePageChange}
          emptyState={
            emptyState || {
              icon: (
                <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              ),
              message: `No ${String(itemNamePlural).toLowerCase()} found`,
              action: actions.canCreate ? (
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">
                    Add Your First {String(itemName)}
                  </span>
                  <span className="sm:hidden">Add {String(itemName)}</span>
                </Button>
              ) : undefined,
            }
          }
          loadingState={
            loadingState || {
              icon: (
                <RefreshCw className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-primary" />
              ),
              message: `Loading ${String(itemNamePlural).toLowerCase()}...`,
            }
          }
        />

        {/* Form Modal */}
        {showForm && formConfig && (
          <formConfig.component
            item={editingItem}
            onClose={handleCloseForm}
            onSuccess={() => {
              // Refetch data to update the table
              refetch();
              // Close the modal
              setShowForm(false);
              setEditingItem(undefined);
            }}
          />
        )}

        {/* Delete Dialog */}
        {showDeleteDialog && itemToDelete && deleteConfig && (
          <DeleteDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
              setItemToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            isLoading={deleteMutation.isPending}
            itemName={String(itemName)}
            {...deleteConfig.getDeleteInfo(itemToDelete)}
          />
        )}

        {/* Toast Notifications - Theme aware */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--color-card))',
              color: 'hsl(var(--color-card-foreground))',
              border: '1px solid hsl(var(--color-border))',
              borderRadius: '0.75rem',
              boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              style: {
                background: 'hsl(var(--color-chart-2))',
                color: '#fff',
                border: 'none',
              },
            },
            error: {
              style: {
                background: 'hsl(var(--color-destructive))',
                color: 'hsl(var(--color-destructive-foreground))',
                border: 'none',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
