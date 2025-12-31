import { ManagementPageConfig } from '@/components/custom/ManagementPage';
import GroupForm from '@/components/groups/GroupForm';
import { StatusBadge } from '@/components/groups/StatusBadge';
import { useDeleteGroup, useGroups } from '@/hooks/useGroups';
import { GroupData } from '@/types/groups';
import { Domain } from '@/types/domain';
import { Calendar, Mail, Users } from 'lucide-react';

// Helper function to extract domain from email
const extractDomainFromEmail = (email: string): string => {
  if (!email) return '';
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
};

// Function to create groups config with dynamic domain options
export const createGroupsConfig = (
  domains: Domain[] = [],
  domainFilterState?: {
    domainId: string | undefined;
    setDomainId: (id: string | undefined) => void;
  }
): ManagementPageConfig<GroupData> => {
  // Handler for domain filter changes
  const handleDomainFilterChange = (filterKey: string, value: string) => {
    if (filterKey === 'domain_id') {
      domainFilterState?.setDomainId(value === 'all' ? undefined : value);
    }
  };

  // Transform domains into filter options
  const domainOptions = domains.map((domain) => ({
    value: domain?.id,
    label: domain?.name,
  }));

  return {
    // Page metadata
    title: 'Groups Management',
    description: "Manage your organization's groups and permissions",
    icon: <Users className="h-8 w-8" />,
    itemName: 'Group',
    itemNamePlural: 'Groups',

    // Enable selection
    enableSelection: true,

    // Data management
    useData: () => {
      // Get current domain_id from filter state
      const domainId = domainFilterState?.domainId;

      // Build query params - only include domain_id if it's explicitly defined (not undefined or null)
      // When domainId is undefined, we want to show ALL groups (no domain filter)
      const queryParams: any = {
        page: 0, // API uses 0-based pagination
        limit: 10,
        search_query: '',
        sort: 'name:asc',
      };

      // Only add domain_id if it's explicitly defined (not undefined, null, or empty string)
      // This ensures when "All Domains" is selected, we don't pass domain_id to the API
      if (domainId !== undefined && domainId !== null && domainId !== '') {
        queryParams.domain_id = domainId;
      }

      const { data, isLoading, error, refetch } = useGroups(queryParams);
      return {
        data: data?.items,
        isLoading,
        error,
        refetch,
      };
    },
    useDelete: useDeleteGroup,

    // Table configuration
    columns: [
      {
        key: 'name',
        label: 'Group Name',
        sortable: true,
        render: (value: string, group: GroupData) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-chart-1" />
            <span className="font-medium">{group.name}</span>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        render: (value: string, group: GroupData) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-foreground">{group.email}</span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (value: string, group: GroupData) => (
          <StatusBadge status={group.status} />
        ),
      },
      {
        key: 'memberCount',
        label: 'Members',
        sortable: true,
        render: (value: number, group: GroupData) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-chart-2" />
            <span className="text-foreground">{group.memberCount}</span>
          </div>
        ),
      },
      {
        key: 'created',
        label: 'Created',
        sortable: true,
        render: (value: string, group: GroupData) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {new Date(group.created).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        ),
      },
    ],

    // Search and filters
    searchConfig: {
      placeholder: 'Search groups by name or email...',
      searchKey: 'name' as keyof GroupData,
    },

    filters: [
      {
        key: 'domain_id',
        label: 'Domain',
        type: 'select',
        options: domainOptions,
        getValue: (item: GroupData) => {
          // Extract domain from email and find matching domain ID
          const emailDomain = extractDomainFromEmail(item?.email || '');
          if (!emailDomain || !domains.length) return '';

          // Find domain by name (matching the email domain)
          const matchedDomain = domains.find(
            (domain) => domain.name === emailDomain
          );
          return matchedDomain?.id || '';
        },
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        getValue: (group: GroupData) => group.status,
      },
    ],

    // Sorting
    sortConfig: {
      defaultSortBy: 'name',
      defaultSortOrder: 'asc',
    },

    // Pagination
    paginationConfig: {
      pageSize: 10,
      getPageData: (data: any) => ({
        page: data?.page ?? 0,
        limit: data?.limit ?? 10,
        total_count: data?.total_count ?? 0,
      }),
    },

    // Form configuration
    formConfig: {
      component: GroupForm,
    },

    // Actions
    actions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canImport: true,
      // customActions: [
      //   {
      //     label: "Activate",
      //     icon: <CheckCircle className="h-4 w-4" />,
      //     onClick: (group: GroupData) => {
      //       console.log("Activate group:", group.name);
      //       // Activate group logic
      //     },
      //     variant: "outline",
      //   },
      //   {
      //     label: "Deactivate",
      //     icon: <XCircle className="h-4 w-4" />,
      //     onClick: (group: GroupData) => {
      //       console.log("Deactivate group:", group.name);
      //       // Deactivate group logic
      //     },
      //     variant: "outline",
      //   },
      // ],
    },

    // Delete dialog configuration
    deleteConfig: {
      getDeleteInfo: (group: GroupData) => ({
        title: 'Delete Group',
        description: `Are you sure you want to delete the group "${group.name}"?`,
        warningMessage:
          'This will permanently remove the group and all its associated data, including:',
        additionalInfo: [
          { label: 'Group Name', value: group.name || 'N/A' },
          { label: 'Email', value: group.email || 'N/A' },
          { label: 'Members', value: (group.memberCount || 0).toString() },
        ],
        features: [
          {
            label: 'Meeting Support',
            value: group.permissions?.meetingsupport === '1',
            color: 'bg-chart-2/20 text-chart-2',
          },
          {
            label: 'Desktop Support',
            value: group.permissions?.desktopsupport === '1',
            color: 'bg-chart-1/20 text-chart-1',
          },
          {
            label: 'ActiveSync Support',
            value: group.permissions?.activesyncsupport === '1',
            color: 'bg-chart-3/20 text-chart-3',
          },
          {
            label: 'Recording Support',
            value: group.permissions?.recordingsupport === '1',
            color: 'bg-primary/20 text-primary',
          },
        ],
      }),
    },

    // Empty state
    emptyState: {
      icon: <Users className="h-12 w-12 text-muted-foreground" />,
      message: 'No groups found. Create your first group to get started.',
      action: (
        <div className="text-sm text-muted-foreground">
          Groups help organize users and manage permissions efficiently.
        </div>
      ),
    },

    // Loading state
    loadingState: {
      icon: <Users className="h-10 w-10 animate-pulse text-primary" />,
      message: 'Loading groups...',
    },
    // Default filters: Use domain from filter state if available, otherwise "all" (show all groups by default)
    defaultFilters:
      domainFilterState?.domainId !== undefined
        ? { domain_id: domainFilterState.domainId }
        : { domain_id: 'all' }, // Show "All Domain" when domainId is undefined (default behavior)
    // Handle domain filter changes
    onFilterChange: handleDomainFilterChange,
  };
};

// Default config export (for backward compatibility, will be overridden in client)
export const groupsConfig = createGroupsConfig([]);
