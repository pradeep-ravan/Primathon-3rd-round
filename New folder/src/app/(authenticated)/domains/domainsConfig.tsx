import { ManagementPageConfig } from '@/components/custom/ManagementPage';
import { DomainForm } from '@/components/domains/DomainForm';
import { useDeleteDomain, useDomains } from '@/hooks/useDomains';
import { Domain } from '@/types/domain';
import { CheckCircle, Globe, Settings, XCircle, Users } from 'lucide-react';

export const domainsConfig: ManagementPageConfig<Domain> = {
  // Page metadata
  title: 'Domain Management',
  description: 'Manage your domains, DNS settings, and configurations',
  icon: <Globe className="h-8 w-8" />,
  itemName: 'Domain',
  itemNamePlural: 'Domains',

  // Data management
  useData: () => {
    const { data, isLoading, isFetching, error, refetch } = useDomains({
      page: 0,
      limit: 10,
      search_query: '',
      sort: 'name:asc',
    });
    return {
      data: data?.items,
      isLoading,
      isFetching,
      error,
      refetch,
    };
  },
  useDelete: useDeleteDomain,

  // Table configuration
  columns: [
    {
      key: 'name',
      label: 'Domain Name',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: 'domain_type',
      label: 'Type',
      sortable: true,
      render: (value: string) => {
        // Map domain_type values to display labels
        const typeLabels: Record<string, string> = {
          STANDARD: 'Standard',
          ETRN_ATRN: 'ETRN/ATRN queue',
          ALIAS: 'Domain alias',
          BACKUP: 'Backup Domain',
          DISTRIBUTED: 'Distributed Domain',
        };
        const label = typeLabels[value] || value;
        
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'DISTRIBUTED'
                ? 'bg-chart-4/20 text-chart-4'
                : value === 'ETRN_ATRN'
                ? 'bg-chart-1/20 text-chart-1'
                : value === 'ALIAS'
                ? 'bg-chart-2/20 text-chart-2'
                : value === 'BACKUP'
                ? 'bg-chart-3/20 text-chart-3'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value: string) => (
        <span className="text-foreground">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'account_count',
      label: 'Accounts',
      sortable: true,
      render: (value: number) => (
        <span className="text-foreground font-medium">
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'users',
      label: 'Users',
      render: (_, item: Domain) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to users page with domain filter
            const encodedId = encodeURIComponent(item.id);
            if (typeof window !== 'undefined') {
              window.location.href = `/users?domain=${encodedId}`;
            }
          }}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
          title={`View users for ${item.name}`}
        >
          <Users className="h-4 w-4 text-primary hover:text-primary/80" />
        </button>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (_, item: Domain) => (
        <div className="flex gap-1">
          {item?.has_certificate && (
            <span className="px-2 py-1 bg-chart-1/20 text-chart-1 text-xs rounded">
              SSL
            </span>
          )}
          {item?.dkim_setup && (
            <span className="px-2 py-1 bg-chart-2/20 text-chart-2 text-xs rounded">
              DKIM
            </span>
          )}
          {item?.saas_plan_restricted && (
            <span className="px-2 py-1 bg-chart-4/20 text-chart-4 text-xs rounded">
              SaaS
            </span>
          )}
        </div>
      ),
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   render: (_, item: Domain) => (
    //     <div className="flex items-center gap-2">
    //       <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
    //       <span className="text-chart-2 text-sm font-medium">Active</span>
    //     </div>
    //   ),
    // },
  ],

  // Search and filters
  searchConfig: {
    placeholder: 'Search domains...',
    searchKey: 'name',
  },
  filters: [
    {
      key: 'domain_type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'STANDARD', label: 'Standard' },
        { value: 'ETRN_ATRN', label: 'ETRN/ATRN queue' },
        { value: 'ALIAS', label: 'Domain alias' },
        { value: 'BACKUP', label: 'Backup Domain' },
        { value: 'DISTRIBUTED', label: 'Distributed Domain' },
      ],
      getValue: (item: Domain) => item?.domain_type,
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   type: 'select',
    //   options: [
    //     { value: 'ACTIVE', label: 'Active' },
    //     { value: 'INACTIVE', label: 'Inactive' },
    //     { value: 'SUSPENDED', label: 'Suspended' },
    //   ],
    //   getValue: (item: Domain) => item?.status,
    // },
    // {
    //   key: 'has_certificate',
    //   label: 'SSL Certificate',
    //   type: 'select',
    //   options: [
    //     { value: 'true', label: 'With SSL' },
    //     { value: 'false', label: 'Without SSL' },
    //   ],
    //   getValue: (item: Domain) => item?.has_certificate?.toString(),
    // },
    {
      key: 'dkim_setup',
      label: 'DKIM Setup',
      type: 'select',
      options: [
        { value: 'true', label: 'Configured' },
        { value: 'false', label: 'Not Configured' },
      ],
      getValue: (item: Domain) => item?.dkim_setup?.toString(),
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
      page: data.page,
      limit: data.limit,
      total_count: data.total_count,
    }),
  },

  // Form configuration
  formConfig: {
    component: DomainForm,
  },

  // Actions
  actions: {
    canCreate: true,
    // canEdit: true,
    canDelete: true,
    canView: true,
    customActions: [
      {
        label: 'Configure',
        icon: <Settings className="h-4 w-4" />,
        onClick: (item: Domain) => {
          // This will be handled by the parent component
          // redirect to `/domains/configure/${item?.id}`;
          window.location.href = `/domains/configure/${item?.id}`;
        },
        variant: 'default',
      },
      {
        label: 'Activate',
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: (item: Domain) => {
          console.log('Activate domain:', item?.name);
          // Activate domain logic
        },
        variant: 'outline',
      },
      {
        label: 'Deactivate',
        icon: <XCircle className="h-4 w-4" />,
        onClick: (item: Domain) => {
          console.log('Deactivate domain:', item?.name);
          // Deactivate domain logic
        },
        variant: 'outline',
      },
    ],
  },

  // Delete dialog configuration
  deleteConfig: {
    getDeleteInfo: (item: Domain) => ({
      title: 'Delete Domain',
      description: `Are you sure you want to delete the domain "${item?.name}"?`,
      warningMessage:
        'This will permanently remove the domain and all its associated data, including:',
      additionalInfo: [
        { label: 'Domain Type', value: item?.domain_type },
        { label: 'Accounts', value: item?.account_count.toLocaleString() },
      ],
      features: [
        {
          label: 'SSL',
          value: item?.has_certificate,
          color: 'bg-chart-1/20 text-chart-1',
        },
        {
          label: 'DKIM',
          value: item?.dkim_setup,
          color: 'bg-chart-2/20 text-chart-2',
        },
      ],
    }),
  },

  // Empty state
  emptyState: {
    icon: <Globe className="h-12 w-12 text-muted-foreground" />,
    message: 'No domains found',
  },

  // Loading state
  loadingState: {
    icon: <Globe className="h-10 w-10 animate-spin text-primary" />,
    message: 'Loading domains...',
  },
};
