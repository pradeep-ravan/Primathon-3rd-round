// Note: API functions imported but not used in mock implementation
import { apiGet } from './apiRequest';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import { GroupData, GroupsResponse, GroupQueryParams } from '@/types/groups';

/**
 * Groups API Service
 * Handles all group-related API operations
 */

// Static data for demonstration
const staticGroups: GroupData[] = [
  {
    id: 'group-1',
    email: 'developers@company.com',
    name: 'Development Team',
    type: 'group',
    status: 'active',
    created: '2024-01-15T10:30:00Z',
    memberCount: 8,
    permissions: {
      meetingsupport: '1',
      desktopsupport: '1',
      activesyncsupport: '0',
      recordingsupport: '1',
    },
  },
  {
    id: 'group-2',
    email: 'marketing@company.com',
    name: 'Marketing Team',
    type: 'group',
    status: 'active',
    created: '2024-02-20T14:15:00Z',
    memberCount: 5,
    permissions: {
      meetingsupport: '1',
      desktopsupport: '0',
      activesyncsupport: '1',
      recordingsupport: '0',
    },
  },
];

export const groupsApi = {
  // Get groups by domain ID
  getGroupsByDomainId: async (
    domainId: string,
    params: Omit<GroupQueryParams, 'domain_id'> = {}
  ): Promise<GroupsResponse> => {
    try {
      const response = await apiGet<GroupsResponse>(
        API_ENDPOINTS.GROUPS.GET_BY_DOMAIN_ID(domainId),
        {
          page: params.page || 0,
          limit: params.limit || 10,
          search_query: params.search_query || '',
          sort: params.sort || 'name:asc',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch groups by domain ID:', error);
      throw error;
    }
  },

  // Get all groups with pagination and filtering
  getGroups: async (params: GroupQueryParams = {}): Promise<GroupsResponse> => {
    try {
      // If domain_id is provided, use the domain-specific endpoint
      if (params.domain_id) {
        return groupsApi.getGroupsByDomainId(params.domain_id, {
          page: params.page,
          limit: params.limit,
          search_query: params.search_query,
          sort: params.sort,
          status: params.status,
        });
      }

      // Otherwise use mock data (or regular endpoint when implemented)
      await new Promise((resolve) => setTimeout(resolve, 100));

      let filteredGroups = [...staticGroups];

      // Apply search filter
      if (params.search_query) {
        const query = params.search_query.toLowerCase();
        filteredGroups = filteredGroups.filter(
          (group) =>
            group.name.toLowerCase().includes(query) ||
            group.email.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (params.status) {
        filteredGroups = filteredGroups.filter(
          (group) => group.status === params.status
        );
      }

      // Apply sorting
      if (params.sort) {
        const [field, direction] = params.sort.split(':');
        filteredGroups.sort((a, b) => {
          const aValue = (a as any)[field];
          const bValue = (b as any)[field];

          if (aValue < bValue) return direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const page = params.page || 0;
      const limit = params.limit || 10;
      const startIndex = page * limit;
      const endIndex = startIndex + limit;

      const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

      return {
        page,
        limit,
        total_count: filteredGroups.length,
        items: paginatedGroups,
      };
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      throw error;
    }
  },

  // Get a single group by ID
  getGroup: async (id: string): Promise<GroupData | null> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return staticGroups.find((group) => group.id === id) || null;
    } catch (error) {
      console.error('Failed to fetch group:', error);
      throw error;
    }
  },

  // Create a new group
  createGroup: async (
    groupData: Omit<GroupData, 'id' | 'created'>
  ): Promise<GroupData> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const newGroup: GroupData = {
        ...groupData,
        id: `group-${Date.now()}`,
        created: new Date().toISOString(),
      };
      staticGroups.push(newGroup);
      return newGroup;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  },

  // Update a group
  updateGroup: async (
    id: string,
    updates: Partial<GroupData>
  ): Promise<GroupData | null> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const groupIndex = staticGroups.findIndex((group) => group.id === id);
      if (groupIndex === -1) return null;

      staticGroups[groupIndex] = { ...staticGroups[groupIndex], ...updates };
      return staticGroups[groupIndex];
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    }
  },

  // Delete a group
  deleteGroup: async (id: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const groupIndex = staticGroups.findIndex((group) => group.id === id);
      if (groupIndex === -1) return false;

      staticGroups.splice(groupIndex, 1);
      return true;
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    }
  },

  // Get group members
  getGroupMembers: async (
    _groupId: string
  ): Promise<Array<{ id: string; name: string; email: string }>> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      // Return mock members data
      return [
        { id: '1', name: 'John Doe', email: 'john@company.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@company.com' },
      ];
    } catch (error) {
      console.error('Failed to fetch group members:', error);
      throw error;
    }
  },

  // Bulk import groups
  bulkImportGroups: async (
    file: File
  ): Promise<{
    imported: number;
    failed: number;
    errors: Array<{
      row: number;
      message: string;
      data: Record<string, string>;
    }>;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const text = await file.text();
      // Split by newline and filter out empty lines
      const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== '');

      // Check if we have data (header + at least one row)
      if (lines.length <= 1) {
        return {
          imported: 0,
          failed: 0,
          errors: [
            {
              row: 0,
              message: 'File is empty or contains only header',
              data: {},
            },
          ],
        };
      }

      const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const dataLines = lines.slice(1);

      let importedCount = 0;
      let failedCount = 0;
      const errors: Array<{
        row: number;
        message: string;
        data: Record<string, string>;
      }> = [];

      // Process each line
      dataLines.forEach((line, index) => {
        try {
          const values = line.split(',').map((v) => v.trim());
          const rowData: Record<string, string> = {};

          // Map values to header
          header.forEach((col, i) => {
            if (i < values.length) {
              rowData[col] = values[i];
            }
          });

          // Basic validation - check if we have enough columns
          if (values.length < 2) {
            // Assuming name and email are required
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Not enough columns',
              data: rowData,
            });
            return;
          }

          // Extract data
          const name = rowData['name'] || values[0];
          const email = rowData['email'] || values[1];
          // const description = rowData['description'] || values[2] || '';
          // const domain = rowData['domain'] || values[3] || '';

          // Validation
          if (!name) {
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Group name is required',
              data: rowData,
            });
            return;
          }

          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Invalid email format',
              data: rowData,
            });
            return;
          }

          // Create new group
          const newGroup: GroupData = {
            id: `group-${Date.now()}-${index}`,
            name,
            email,
            type: 'group',
            status: 'active',
            created: new Date().toISOString(),
            memberCount: 0,
            permissions: {
              meetingsupport: '0',
              desktopsupport: '0',
              activesyncsupport: '0',
              recordingsupport: '0',
            },
          };

          // Add to static groups (mock)
          staticGroups.push(newGroup);
          importedCount++;
        } catch (err) {
          failedCount++;
          errors.push({
            row: index + 2,
            message: 'Processing error',
            data: { line },
          });
        }
      });

      return {
        imported: importedCount,
        failed: failedCount,
        errors,
      };
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  },
};

export default groupsApi;
