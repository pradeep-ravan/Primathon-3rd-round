import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '@/services/groupsApi';
import { GroupData, GroupQueryParams } from '@/types/groups';

// Query keys
export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (params: GroupQueryParams = {}) =>
    [...groupKeys.lists(), params] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
  members: (id: string) => [...groupKeys.detail(id), 'members'] as const,
};

// Hook to fetch groups with pagination and filtering
export function useGroups(params: GroupQueryParams = {}) {
  return useQuery({
    queryKey: groupKeys.list(params),
    queryFn: () => groupsApi.getGroups(params),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
}

// Hook to fetch a single group by ID
export function useGroup(id: string) {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupsApi.getGroup(id),
    enabled: !!id, // Only run query if id is provided
  });
}

// Hook to fetch group members
export function useGroupMembers(id: string) {
  return useQuery({
    queryKey: groupKeys.members(id),
    queryFn: () => groupsApi.getGroupMembers(id),
    enabled: !!id,
  });
}

// Hook to create a new group
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<GroupData, 'id' | 'created'>) =>
      groupsApi.createGroup(data),
    onSuccess: (newGroup) => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      // Add the new group to the cache
      queryClient.setQueryData(groupKeys.detail(newGroup.id), newGroup);
    },
    onError: (error) => {
      console.error('Failed to create group:', error);
    },
  });
}

// Hook to update a group
export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GroupData> }) =>
      groupsApi.updateGroup(id, data),
    onSuccess: (updatedGroup) => {
      // Update the specific group in cache
      queryClient.setQueryData(groupKeys.detail(updatedGroup.id), updatedGroup);
      // Invalidate groups list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
    },
  });
}

// Hook to delete a group
export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupsApi.deleteGroup(id),
    onSuccess: (_, deletedId) => {
      // Remove the group from cache
      queryClient.removeQueries({ queryKey: groupKeys.detail(deletedId) });
      // Invalidate groups list to refetch without the deleted group
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete group:', error);
    },
  });
}

// Hook to import groups
export function useImportGroups() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => groupsApi.bulkImportGroups(file),
    onSuccess: () => {
      // Invalidate groups list to refetch with imported data
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to import groups:', error);
    },
  });
}

// Hook to manage group status
export function useGroupStatus() {
  const queryClient = useQueryClient();

  const activate = useMutation({
    mutationFn: (id: string) => groupsApi.updateGroup(id, { status: 'active' }),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData(groupKeys.detail(updatedGroup.id), updatedGroup);
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });

  const deactivate = useMutation({
    mutationFn: (id: string) =>
      groupsApi.updateGroup(id, { status: 'inactive' }),
    onSuccess: (updatedGroup) => {
      queryClient.setQueryData(groupKeys.detail(updatedGroup.id), updatedGroup);
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });

  return { activate, deactivate };
}

// Hook to refresh groups data
export function useRefreshGroups() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
  };
}
