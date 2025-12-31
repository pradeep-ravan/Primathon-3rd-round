export interface GroupData {
  id: string;
  email: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  created: string;
  memberCount: number;
  permissions?: UserPermissions;
}

// API Response types
export interface GroupsResponse {
  page: number;
  limit: number;
  total_count: number;
  items: GroupData[];
}

export interface GroupQueryParams {
  page?: number;
  limit?: number;
  search_query?: string;
  sort?: string;
  status?: string;
  domain_id?: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  status: 'active' | 'inactive';
  created: string;
  lastLogin: string | null;
  permissions?: UserPermissions;
}

export interface UserPermissions {
  meetingsupport?: string;
  desktopsupport?: string;
  activesyncsupport?: string;
  recordingsupport?: string;
  [key: string]: string | undefined;
}

export interface ApiResponse {
  json?: {
    iq?: {
      query?: {
        result?: {
          item?: any | any[];
          overallcount?: string;
        };
      };
    };
  };
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export interface LoadingStateProps {
  icon: React.ReactNode;
  message: string;
}


export interface StatusBadgeProps {
  status: 'active' | 'inactive';
}

export interface TypeBadgeProps {
  type: string;
}

export interface PermissionsBadgeProps {
  permissions?: UserPermissions;
}
