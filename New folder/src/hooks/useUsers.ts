import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi, { AccountDetailsResponse } from '@/services/userApi';
import {
  User,
  UsersResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
  UserStatistics,
  UserValidation,
  UserPermissions,
  UserPreferences,
} from '@/types/user';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  statistics: () => [...userKeys.all, 'statistics'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
};

// Hook to fetch users with pagination and filtering
export function useUsers(params: UserQueryParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getUsers(params),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
}

// Hook to fetch a single user by ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id, // Only run query if id is provided
  });
}

// Hook to fetch account details by domain ID and account ID
export function useAccountDetails(domainId: string | undefined, accountId: string | undefined) {
  return useQuery({
    queryKey: ['accountDetails', domainId, accountId],
    queryFn: () => {
      if (!domainId || !accountId) throw new Error('Domain ID and Account ID are required');
      return userApi.getAccountDetails(domainId, accountId);
    },
    enabled: !!domainId && !!accountId, // Only run query if both IDs are provided
  });
}

// Hook to update account details (partial update)
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      domainId,
      accountId,
      data,
    }: {
      domainId: string;
      accountId: string;
      data: Partial<{
        name?: string;
        surname?: string;
        description?: string;
        comment?: string;
        alias_list?: string[];
        account_state?: string;
        admin_type?: string;
        card?: Partial<AccountDetailsResponse['card']>;
        email_settings?: Partial<AccountDetailsResponse['email_settings']>;
        quota?: Partial<AccountDetailsResponse['quota']>;
        limits?: Partial<AccountDetailsResponse['limits']>;
      }>;
    }) => userApi.patchAccount(domainId, accountId, data),
    onSuccess: (updatedAccount, variables) => {
      // Invalidate account details to refetch with updated data
      queryClient.invalidateQueries({ 
        queryKey: ['accountDetails', variables.domainId, variables.accountId] 
      });
      // Also invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update account:', error);
    },
  });
}

// Hook to fetch user statistics
export function useUserStatistics() {
  return useQuery({
    queryKey: userKeys.statistics(),
    queryFn: () => userApi.getUserStatistics(),
  });
}

// Hook to search users
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => userApi.searchUsers(query),
    enabled: !!query && query.length > 2, // Only search if query is longer than 2 characters
  });
}

// Hook to create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => {
      // If domain_id is provided, use the domain-specific endpoint
      // The createUser function will handle this automatically
      return userApi.createUser(data);
    },
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Add the new user to the cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

// Hook to update a user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}

// Hook to delete a user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      accountId,
      domainId,
      transferTo,
    }: {
      id: string;
      accountId?: string; // id from API (base64 encoded), used as accountId in DELETE endpoint
      domainId?: string;
      transferTo?: string;
    }) => {
      // Use accountId (id from API) if provided, otherwise fall back to id
      const finalAccountId = accountId || id;
      return userApi.deleteUser(id, domainId, transferTo, finalAccountId);
    },
    onSuccess: (_, variables) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(variables.id) });
      // Invalidate users list to refetch without the deleted/moved user
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
}

// Hook to import users
export function useImportUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.bulkImportUsers(file),
    onSuccess: () => {
      // Invalidate users list to refetch with new users
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to import users:', error);
    },
  });
}

// Hook to validate user data
export function useValidateUser() {
  return useMutation({
    mutationFn: (userData: Partial<CreateUserRequest>) =>
      userApi.validateUser(userData),
  });
}

// Hook to manage user status
export function useUserStatus() {
  const queryClient = useQueryClient();

  const activate = useMutation({
    mutationFn: (id: string) => userApi.activateUser(id),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => userApi.deactivateUser(id),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const suspend = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      userApi.suspendUser(id, reason),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  return { activate, deactivate, suspend };
}

// Hook to manage user permissions
export function useUserPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      permissions,
    }: {
      id: string;
      permissions: Partial<UserPermissions>;
    }) => userApi.updateUserPermissions(id, permissions),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update user permissions:', error);
    },
  });
}

// Hook to manage user preferences
export function useUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      preferences,
    }: {
      id: string;
      preferences: Partial<UserPreferences>;
    }) => userApi.updateUserPreferences(id, preferences),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
    },
  });
}

// Hook to toggle 2FA
export function useToggleTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      userApi.toggleTwoFactor(id, enabled),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to toggle 2FA:', error);
    },
  });
}

// Hook to reset user password
export function useResetPassword() {
  return useMutation({
    mutationFn: (id: string) => userApi.resetPassword(id),
    onError: (error) => {
      console.error('Failed to reset password:', error);
    },
  });
}

// Hook for bulk operations
export function useBulkUserOperations() {
  const queryClient = useQueryClient();

  const bulkActivate = useMutation({
    mutationFn: (ids: string[]) => userApi.bulkActivateUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const bulkDeactivate = useMutation({
    mutationFn: (ids: string[]) => userApi.bulkDeactivateUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const bulkDelete = useMutation({
    mutationFn: (ids: string[]) => userApi.bulkDeleteUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  return { bulkActivate, bulkDeactivate, bulkDelete };
}

// Hook to refresh users data
export function useRefreshUsers() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  };
}
