import React from 'react';
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Mail,
  ArrowLeftRight,
} from 'lucide-react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { User } from '@/types/user';
import { UserForm } from '@/components/users/UserForm';
import { ManagementPageConfig } from '@/components/custom/ManagementPage';
import { StatusBadge } from '@/components/groups/StatusBadge';
import { Domain } from '@/types/domain';

// Helper function to extract domain from email
const extractDomainFromEmail = (email: string): string => {
  if (!email) return '';
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
};

// Function to create users config with dynamic domain options
export const createUsersConfig = (
  domains: Domain[] = [],
  domainFilterState?: {
    domainId: string | undefined;
    setDomainId: (id: string | undefined) => void;
  }
): ManagementPageConfig<User> => {
  // Handler for domain filter changes
  const handleDomainFilterChange = (filterKey: string, value: string) => {
    if (filterKey === 'domain_id') {
      // Always set a domain (never allow 'all')
      if (value && value !== 'all') {
        domainFilterState?.setDomainId(value);
      } else if (domains.length > 0) {
        // If 'all' is somehow selected, default to first domain
        domainFilterState?.setDomainId(domains[0].id);
      }
    }
  };
  // Transform domains into filter options
  // Note: ManagementPage automatically adds "All {filter.label}" option, so we don't need to add it here
  const domainOptions = domains.map((domain) => ({
    value: domain?.id,
    label: domain?.name,
  }));

  return {
    // Page metadata
    title: 'User Management',
    description: 'Manage users, their roles, and permissions',
    icon: <Users className="h-8 w-8" />,
    itemName: 'User',
    itemNamePlural: 'Users',

    // Enable selection
    enableSelection: true,

    // Data management
    useData: () => {
      // Get current domain_id from filter state, default to first domain if not set
      const domainId = domainFilterState?.domainId || domains[0]?.id;

      // Build query params - domain_id is always required
      const queryParams: any = {
        page: 0, // API uses 0-based pagination
        limit: 10,
        search_query: '',
        sort: 'username:asc',
      };

      // Always include domain_id (required)
      if (domainId) {
        queryParams.domain_id = domainId;
      }

      const { data, isLoading, error, refetch } = useUsers(queryParams);
      return {
        data: data?.items,
        isLoading,
        error,
        refetch,
      };
    },
    useDelete: useDeleteUser,

    // Table configuration
    columns: [
      {
        key: 'alias',
        label: 'User Name',
        sortable: true,
        render: (value: string, item: User) => {
          // Use classify_as (full name) if available, otherwise use alias
          const displayName = item.v_card?.classify_as || value || item.display_email?.split('@')[0] || 'Unknown';
          const firstName = item.v_card?.first_name || '';
          const lastName = item.v_card?.surname || '';
          const initials = (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '') || displayName?.charAt(0)?.toUpperCase() || '?';
          
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
              <div>
                <div className="font-medium">{displayName}</div>
                {item.v_card?.classify_as && item.v_card.classify_as !== displayName && (
                  <div className="text-sm text-muted-foreground">
                    {item.v_card.classify_as}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: 'display_email',
        label: 'Email',
        sortable: true,
        render: (value: string) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-foreground">{value}</span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (value: string, item: User) => (
          <StatusBadge status={(item.status || 'NONE') as any} />
        ),
      },
      {
        key: 'type',
        label: 'Type',
        sortable: true,
        render: (value: string, item: User) => {
          // Use account_type if available, otherwise use type
          const displayType = value || item.type || 'ACCOUNT';
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                displayType === 'ADMIN'
                  ? 'bg-purple-500/20 text-purple-400'
                  : displayType === 'MODERATOR'
                  ? 'bg-blue-500/20 text-blue-400'
                  : displayType === 'ACCOUNT'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {displayType}
            </span>
          );
        },
      },
    ],

    // Search and filters
    searchConfig: {
      placeholder: 'Search users...',
      searchKey: 'alias',
    },
    filters: [
      {
        key: 'domain_id',
        label: 'Domain',
        type: 'select',
        options: domainOptions,
        getValue: (item: User) => {
          // Extract domain from email and find matching domain ID
          const emailDomain = extractDomainFromEmail(item?.display_email || '');
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
        type: 'select',
        options: [
          { value: 'ACTIVE', label: 'Active' },
          { value: 'INACTIVE', label: 'Inactive' },
          { value: 'SUSPENDED', label: 'Suspended' },
          { value: 'PENDING', label: 'Pending' },
        ],
        getValue: (item: User) => item?.status,
      },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'ACCOUNT', label: 'Account' },
          { value: 'ADMIN', label: 'Admin' },
          { value: 'MODERATOR', label: 'Moderator' },
          { value: 'USER', label: 'User' },
        ],
        getValue: (item: User) => item?.type,
      },
    ],

    // Sorting
    sortConfig: {
      defaultSortBy: 'alias',
      defaultSortOrder: 'asc',
    },

    // Pagination
    paginationConfig: {
      pageSize: 10,
      getPageData: (data: any) => ({
        page: data.page,
        limit: data.limit,
        total_count: data.total_count,
      }),
    },

    // Form configuration
    formConfig: {
      component: UserForm,
    },

    // Actions
    actions: {
      canCreate: true,
      canEdit: false, // Disable default edit (we'll use custom action to route to profile)
      canDelete: true,
      canView: true,
      canImport: true,
      customActions: [
        {
          label: 'Edit',
          icon: <Edit className="h-4 w-4" />,
          onClick: (item: User) => {
            // Route to profile page with user ID, domainId, and accountId (id from API)
            // Encode the ID to handle special characters like @ in email addresses
            const encodedId = encodeURIComponent(item.id);
            // Extract domain from email
            const emailDomain = item.display_email?.split('@')[1] || '';
            // Find domain ID from domains list (we'll need to pass this from parent)
            // For now, we'll pass domain name and account_id as query params
            const params = new URLSearchParams();
            if (item.account_id) {
              params.set('accountId', item.account_id);
            }
            if (emailDomain) {
              params.set('domain', emailDomain);
            }
            // Use Next.js router for client-side navigation
            if (typeof window !== 'undefined') {
              window.location.href = `/profile/${encodedId}?${params.toString()}`;
            }
          },
          variant: 'outline' as const,
        },
        {
          label: 'Move',
          icon: <ArrowLeftRight className="h-4 w-4" />,
          onClick: (item: User) => {
            // TODO: Implement move functionality
            console.log('Move user:', item);
          },
          variant: 'outline' as const,
        },
      ],
    },

    // Delete dialog configuration
    deleteConfig: {
      getDeleteInfo: (item: User) => {
        // Get current domain ID from filter state
        const currentDomainId = domainFilterState?.domainId || domains[0]?.id;
        return {
          title: 'Delete User',
          description: `Are you sure you want to delete the user "${item?.alias}"?`,
          warningMessage:
            'This will permanently remove the user and all their associated data, including:',
          additionalInfo: [
            { label: 'Full Name', value: item?.v_card?.classify_as },
            { label: 'Email', value: item?.display_email },
            { label: 'Type', value: item?.type },
            { label: 'Department', value: item?.v_card?.department || 'N/A' },
          ],
          features: [
            {
              label: '2FA Enabled',
              value: item?.two_factor_enabled,
              color: 'bg-blue-500/20 text-blue-400',
            },
            {
              label: 'Team Chat Support',
              value: item?.teamchat_support,
              color: 'bg-green-500/20 text-green-400',
            },
          ],
          domainId: currentDomainId, // Include domain ID for domain-specific delete
          accountId: item.account_id, // Include account_id (id from API) for delete operation
        };
      },
    },

    // Empty state
    emptyState: {
      icon: <Users className="h-12 w-12 text-muted-foreground" />,
      message: 'No users found',
    },

    // Loading state
    loadingState: {
      icon: <Users className="h-10 w-10 animate-spin text-cyan-500" />,
      message: 'Loading users...',
    },
    // Default filters: Use domain from filter state if available, otherwise use first domain
    // Always use a specific domain (no "all" option)
    defaultFilters:
      domainFilterState?.domainId
        ? { domain_id: domainFilterState.domainId }
        : domains.length > 0
        ? { domain_id: domains[0].id }
        : {},
    // Handle domain filter changes
    onFilterChange: handleDomainFilterChange,
  };
};

// Default config export (for backward compatibility, will be overridden in client)
export const usersConfig = createUsersConfig([]);
