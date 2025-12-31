import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import domainApi from "@/services/domainApi";
import {
  Domain,
  DomainsResponse,
  CreateDomainRequest,
  UpdateDomainRequest,
  DomainQueryParams,
  DomainConfigurationRequest,
  DomainStatistics,
  DomainValidation,
  SSLCertificate,
  DKIMConfig,
  DKIMSetupCheck,
  DKIMGetResponse,
  DomainAccountsStatsResponse,
  DomainLimits,
  UserLimits,
} from "@/types/domain";

// Query keys
export const domainKeys = {
  all: ["domains"] as const,
  lists: () => [...domainKeys.all, "list"] as const,
  list: (params: DomainQueryParams) => [...domainKeys.lists(), params] as const,
  details: () => [...domainKeys.all, "detail"] as const,
  detail: (id: string) => [...domainKeys.details(), id] as const,
  statistics: () => [...domainKeys.all, "statistics"] as const,
  statsAccounts: (id: string) => [...domainKeys.detail(id), "stats", "accounts"] as const,
  limits: (id: string) => [...domainKeys.detail(id), "limits"] as const,
  features: (id: string) => [...domainKeys.detail(id), "features"] as const,
  ssl: (id: string) => [...domainKeys.detail(id), "ssl"] as const,
  dkim: (id: string) => [...domainKeys.detail(id), "dkim"] as const,
  health: (id: string) => [...domainKeys.detail(id), "health"] as const,
};

// Hook to fetch domains with pagination and filtering
export function useDomains(params: DomainQueryParams = {}) {
  return useQuery({
    queryKey: domainKeys.list(params),
    queryFn: () => domainApi.getDomains(params),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
}

// Hook to fetch a single domain by ID
export function useDomain(id: string) {
  return useQuery({
    queryKey: domainKeys.detail(id),
    queryFn: () => domainApi.getDomain(id),
    enabled: !!id, // Only run query if id is provided
    refetchOnMount: true, // Always refetch when component mounts to get fresh data
    staleTime: 0, // Consider data stale immediately to ensure fresh fetches
  });
}

// Hook to fetch domain statistics
export function useDomainStatistics() {
  return useQuery({
    queryKey: domainKeys.statistics(),
    queryFn: () => domainApi.getDomainStatistics(),
  });
}

// Hook to fetch domain dashboard stats/accounts
export function useDomainAccountsStats(id: string) {
  return useQuery<DomainAccountsStatsResponse>({
    queryKey: domainKeys.statsAccounts(id),
    queryFn: () => domainApi.getDomainAccountsStats(id),
    enabled: !!id,
    refetchOnMount: true,
  });
}

// Hook to fetch domain limits
export function useDomainLimits(id: string, enabled: boolean = true) {
  return useQuery<any>({
    queryKey: domainKeys.limits(id),
    queryFn: () => domainApi.getDomainLimits(id),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
}

// Hook to fetch domain features
export function useDomainFeatures(id: string, enabled: boolean = true) {
  return useQuery<any>({
    queryKey: domainKeys.features(id),
    queryFn: () => domainApi.getDomainFeatures(id),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
}

// Hook to fetch domain SSL certificate
export function useDomainSSLCertificate(id: string) {
  return useQuery({
    queryKey: domainKeys.ssl(id),
    queryFn: () => domainApi.getSSLCertificate(id),
    enabled: !!id,
  });
}

// Hook to check if DKIM is setup
export function useCheckDKIMSetup(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...domainKeys.dkim(id), 'setup-check'],
    queryFn: () => domainApi.checkDKIMSetup(id),
    enabled: !!id && enabled,
  });
}

// Hook to fetch domain DKIM data
export function useGetDKIM(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...domainKeys.dkim(id), 'get'],
    queryFn: () => domainApi.getDKIM(id),
    enabled: !!id && enabled,
  });
}

// Hook to fetch domain DKIM configuration
export function useDomainDKIMConfig(id: string) {
  return useQuery({
    queryKey: domainKeys.dkim(id),
    queryFn: () => domainApi.getDKIMConfig(id),
    enabled: !!id,
  });
}

// Hook to fetch domain health status
export function useDomainHealth(id: string) {
  return useQuery({
    queryKey: domainKeys.health(id),
    queryFn: () => domainApi.getDomainHealth(id),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Hook to create a new domain
export function useCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDomainRequest) => domainApi.createDomain(data),
    onSuccess: (newDomain) => {
      // Invalidate and refetch domains list
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
      // Add the new domain to the cache only if domain and id exist
      if (newDomain && newDomain.id) {
        queryClient.setQueryData(domainKeys.detail(newDomain.id), newDomain);
      }
    },
    onError: (error) => {
      console.error("Failed to create domain:", error);
    },
  });
}

// Hook to update a domain
export function useUpdateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDomainRequest }) =>
      domainApi.updateDomain(id, data),
    onSuccess: (updatedDomain) => {
      // Transform the updated domain to match Domain interface
      // API returns alias_list but Domain interface expects aliases
      const transformedDomain: Domain = {
        ...updatedDomain,
        domain_type: (updatedDomain as any).domain?.type || updatedDomain.domain_type || 'STANDARD',
        aliases: (updatedDomain as any).alias_list || updatedDomain.aliases || [],
      };
      
      // Update the specific domain in cache
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        transformedDomain
      );
      
      // Update the domain in all list caches
      queryClient.setQueriesData<DomainsResponse>(
        { queryKey: domainKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          // Find and update the domain in the items array
          const updatedItems = oldData.items.map((item) =>
            item.id === updatedDomain.id
              ? { ...item, ...transformedDomain }
              : item
          );
          
          return {
            ...oldData,
            items: updatedItems,
          };
        }
      );
      
      // Remove the domain detail cache entry entirely to force fresh fetch
      queryClient.removeQueries({ queryKey: domainKeys.detail(updatedDomain.id) });
      
      // Invalidate domains list to ensure consistency (will refetch in background)
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update domain:", error);
    },
  });
}

// Hook to patch a domain (partial update)
export function usePatchDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateDomainRequest> }) =>
      domainApi.patchDomain(id, data),
    onSuccess: (updatedDomain) => {
      // Transform the updated domain to match Domain interface
      // API returns alias_list but Domain interface expects aliases
      const transformedDomain: Domain = {
        ...updatedDomain,
        domain_type: (updatedDomain as any).domain?.type || updatedDomain.domain_type || 'STANDARD',
        aliases: (updatedDomain as any).alias_list || updatedDomain.aliases || [],
      };
      
      // Update the specific domain in cache
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        transformedDomain
      );
      
      // Update the domain in all list caches
      queryClient.setQueriesData<DomainsResponse>(
        { queryKey: domainKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          // Find and update the domain in the items array
          const updatedItems = oldData.items.map((item) =>
            item.id === updatedDomain.id
              ? { ...item, ...transformedDomain }
              : item
          );
          
          return {
            ...oldData,
            items: updatedItems,
          };
        }
      );
      
      // Remove the domain detail cache entry entirely to force fresh fetch
      queryClient.removeQueries({ queryKey: domainKeys.detail(updatedDomain.id) });
      
      // Invalidate domains list to ensure consistency (will refetch in background)
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to patch domain:", error);
    },
  });
}

// Hook to delete a domain
export function useDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => domainApi.deleteDomain(id),
    onSuccess: (_, deletedId) => {
      // Remove the domain from cache
      queryClient.removeQueries({ queryKey: domainKeys.detail(deletedId) });
      // Invalidate domains list to refetch without the deleted domain
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete domain:", error);
    },
  });
}

// Hook to update domain configuration
export function useUpdateDomainConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      config,
    }: {
      id: string;
      config: DomainConfigurationRequest;
    }) => domainApi.updateDomainConfiguration(id, config),
    onSuccess: (updatedDomain) => {
      // Transform the updated domain to match Domain interface
      // API returns alias_list but Domain interface expects aliases
      const transformedDomain: Domain = {
        ...updatedDomain,
        domain_type: (updatedDomain as any).domain?.type || updatedDomain.domain_type || 'STANDARD',
        aliases: (updatedDomain as any).alias_list || updatedDomain.aliases || [],
      };
      
      // Update the specific domain in cache
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        transformedDomain
      );
      
      // Update the domain in all list caches
      queryClient.setQueriesData<DomainsResponse>(
        { queryKey: domainKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          // Find and update the domain in the items array
          const updatedItems = oldData.items.map((item) =>
            item.id === updatedDomain.id
              ? { ...item, ...transformedDomain }
              : item
          );
          
          return {
            ...oldData,
            items: updatedItems,
          };
        }
      );
      
      // Remove the domain detail cache entry entirely to force fresh fetch
      queryClient.removeQueries({ queryKey: domainKeys.detail(updatedDomain.id) });
      
      // Invalidate domains list to ensure consistency (will refetch in background)
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update domain configuration:", error);
    },
  });
}

// Hook to update domain limits
export function useUpdateDomainLimits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, limits }: { id: string; limits: any }) =>
      domainApi.updateDomainLimits(id, limits),
    onSuccess: (response, variables) => {
      // Invalidate limits query to refetch updated data
      queryClient.invalidateQueries({ queryKey: domainKeys.limits(variables.id) });
      
      // Also update domain detail cache if response contains domain data
      if (response && typeof response === 'object' && 'id' in response) {
        queryClient.setQueryData(
          domainKeys.detail(variables.id),
          response
        );
      }
    },
    onError: (error) => {
      console.error("Failed to update domain limits:", error);
    },
  });
}

// Hook to update domain features
export function useUpdateDomainFeatures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, features }: { id: string; features: any }) =>
      domainApi.updateDomainFeatures(id, features),
    onSuccess: (response, variables) => {
      // Invalidate features query to refetch updated data
      queryClient.invalidateQueries({ queryKey: domainKeys.features(variables.id) });
      
      // Also update domain detail cache if response contains domain data
      if (response && typeof response === 'object' && 'id' in response) {
        queryClient.setQueryData(
          domainKeys.detail(variables.id),
          response
        );
      }
    },
    onError: (error) => {
      console.error("Failed to update domain features:", error);
    },
  });
}

// Hook to manage domain aliases
export function useDomainAliases() {
  const queryClient = useQueryClient();

  const addAlias = useMutation({
    mutationFn: ({ id, alias }: { id: string; alias: string }) =>
      domainApi.addDomainAlias(id, alias),
    onSuccess: (updatedDomain) => {
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        updatedDomain
      );
    },
  });

  const removeAlias = useMutation({
    mutationFn: ({ id, alias }: { id: string; alias: string }) =>
      domainApi.removeDomainAlias(id, alias),
    onSuccess: (updatedDomain) => {
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        updatedDomain
      );
    },
  });

  return { addAlias, removeAlias };
}

// Hook to manage SSL certificates
export function useDomainSSLMutations() {
  const queryClient = useQueryClient();

  const generateCertificate = useMutation({
    mutationFn: ({
      id,
      type,
    }: {
      id: string;
      type?: "SELF_SIGNED" | "LETS_ENCRYPT";
    }) => domainApi.generateSSLCertificate(id, type),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.ssl(id) });
    },
  });

  const uploadCertificate = useMutation({
    mutationFn: ({
      id,
      certificate,
      privateKey,
    }: {
      id: string;
      certificate: string;
      privateKey: string;
    }) => domainApi.uploadSSLCertificate(id, certificate, privateKey),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.ssl(id) });
    },
  });

  return { generateCertificate, uploadCertificate };
}

// Hook to manage DKIM configuration
export function useDomainDKIMMutations() {
  const queryClient = useQueryClient();

  const generateKeys = useMutation({
    mutationFn: ({ id, selector }: { id: string; selector?: string }) =>
      domainApi.generateDKIMKeys(id, selector),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.dkim(id) });
      // Invalidate domain detail to refresh DKIM setup status
      queryClient.invalidateQueries({ queryKey: domainKeys.detail(id) });
    },
  });

  const updateConfig = useMutation({
    mutationFn: ({ id, config }: { id: string; config: Partial<DKIMConfig> }) =>
      domainApi.updateDKIMConfig(id, config),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.dkim(id) });
      // Invalidate domain detail to refresh DKIM setup status
      queryClient.invalidateQueries({ queryKey: domainKeys.detail(id) });
    },
  });

  const updateActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      domainApi.updateDKIMActive(id, active),
    onSuccess: (_, { id }) => {
      // Invalidate both DKIM queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: domainKeys.dkim(id) });
      // Invalidate domain detail to refresh DKIM setup status
      queryClient.invalidateQueries({ queryKey: domainKeys.detail(id) });
    },
  });

  const resetDKIM = useMutation({
    mutationFn: (id: string) => domainApi.resetDKIM(id),
    onSuccess: (_, id) => {
      // Invalidate all DKIM-related queries
      queryClient.invalidateQueries({ queryKey: domainKeys.dkim(id) });
      // Invalidate domain detail to refresh DKIM setup status
      queryClient.invalidateQueries({ queryKey: domainKeys.detail(id) });
    },
  });

  return { generateKeys, updateConfig, updateActive, resetDKIM };
}

// Hook to validate domain
export function useValidateDomain() {
  return useMutation({
    mutationFn: (domainName: string) => domainApi.validateDomain(domainName),
  });
}

// Hook to manage domain status
export function useDomainStatus() {
  const queryClient = useQueryClient();

  const activate = useMutation({
    mutationFn: (id: string) => domainApi.activateDomain(id),
    onSuccess: (updatedDomain) => {
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        updatedDomain
      );
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => domainApi.deactivateDomain(id),
    onSuccess: (updatedDomain) => {
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        updatedDomain
      );
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
  });

  const suspend = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      domainApi.suspendDomain(id, reason),
    onSuccess: (updatedDomain) => {
      queryClient.setQueryData(
        domainKeys.detail(updatedDomain.id),
        updatedDomain
      );
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
    },
  });

  return { activate, deactivate, suspend };
}

// Hook to refresh domains data
export function useRefreshDomains() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
  };
}
