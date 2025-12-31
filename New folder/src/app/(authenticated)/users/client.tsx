"use client";

import React, { useMemo, useState, createContext, useContext, useEffect } from "react";
import { ManagementPage } from "@/components/custom/ManagementPage";
import { createUsersConfig } from "./usersConfig";
import { useDomains } from "@/hooks/useDomains";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeleteUser } from "@/hooks/useUsers";
import { MoveUserModal } from "@/components/users/MoveUserModal";
import { User } from "@/types/user";
import toast from "react-hot-toast";

// Context to share domain filter state
const DomainFilterContext = createContext<{
  domainId: string | undefined;
  setDomainId: (id: string | undefined) => void;
}>({
  domainId: undefined,
  setDomainId: () => {},
});

export default function Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize domain from URL query parameter immediately
  const domainParamFromUrl = searchParams.get('domain');
  const initialDomainId = domainParamFromUrl 
    ? decodeURIComponent(domainParamFromUrl) 
    : undefined;
  
  // State to track active domain filter
  const [activeDomainId, setActiveDomainId] = useState<string | undefined>(
    initialDomainId
  );

  // Fetch all domains for the filter dropdown
  const { data: domainsData } = useDomains({
    page: 0,
    limit: 250, // Maximum allowed by API
    search_query: "",
    sort: "name:asc",
  });

  // Get first domain as default
  const firstDomainId = domainsData?.items?.[0]?.id;

  // Clean up the query parameter from URL after domain is set
  useEffect(() => {
    if (domainParamFromUrl) {
      // Small delay to ensure state propagation
      const timer = setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('domain');
        const newUrl = newSearchParams.toString() 
          ? `${window.location.pathname}?${newSearchParams.toString()}`
          : window.location.pathname;
        router.replace(newUrl);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [domainParamFromUrl, searchParams, router]);

  // Set default domain to first domain if no domain is selected
  useEffect(() => {
    if (!activeDomainId && firstDomainId) {
      setActiveDomainId(firstDomainId);
    }
  }, [firstDomainId, activeDomainId]);

  // Move modal state
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [userToMove, setUserToMove] = useState<User | null>(null);
  const deleteMutation = useDeleteUser();

  // Handle move user
  const handleMoveUser = async (targetDomainName: string) => {
    if (!userToMove || !activeDomainId) return;

    // Use account_id (id from API) as accountId for the DELETE API
    const accountId = userToMove.account_id || userToMove.id;

    try {
      await deleteMutation.mutateAsync({
        id: userToMove.id,
        accountId: accountId,
        domainId: activeDomainId || firstDomainId || "",
        transferTo: targetDomainName, // Pass plain domain name (e.g., "testpk"), will be encoded in API
      });

      toast.success("User moved successfully", {
        duration: 4000,
        style: {
          background: "#10b981",
          color: "#fff",
        },
      });

      setMoveModalOpen(false);
      setUserToMove(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : "Failed to move user";

      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
      throw error;
    }
  };

  // Create config with dynamic domain options and domain filter context
  const usersConfig = useMemo(() => {
    // Use first domain as default if no domain is selected
    const defaultDomainId = activeDomainId || firstDomainId;
    
    const config = createUsersConfig(domainsData?.items || [], {
      domainId: defaultDomainId,
      setDomainId: (id: string | undefined) => {
        // Ensure domain is always set (don't allow undefined)
        const domainToSet = id || firstDomainId;
        setActiveDomainId(domainToSet);
      },
    });
    
    // Override the custom actions
    if (config.actions?.customActions) {
      config.actions.customActions = config.actions.customActions.map((action) => {
        if (action.label === 'Edit') {
          return {
            ...action,
            onClick: (item: User) => {
              // Route to profile page with user ID, domain, and accountId (id from API)
              const encodedId = encodeURIComponent(item.id);
              // Extract domain from email
              const emailDomain = item.display_email?.split('@')[1] || '';
              // Build query params
              const params = new URLSearchParams();
              if (item.account_id) {
                params.set('accountId', item.account_id);
              }
              if (emailDomain) {
                params.set('domain', emailDomain);
              }
              // Navigate to profile page
              router.push(`/profile/${encodedId}?${params.toString()}`);
            },
          };
        }
        if (action.label === 'Move') {
          return {
            ...action,
            onClick: (item: User) => {
              setUserToMove(item);
              setMoveModalOpen(true);
            },
          };
        }
        return action;
      });
    }
    
    return config;
  }, [domainsData?.items, activeDomainId, router, firstDomainId]);

  // Custom delete handler that includes domain_id and accountId (id from API)
  const customDeleteHandler = useMemo(() => {
    return {
      mutateAsync: async (idOrObject: string | { id: string; accountId?: string; domainId?: string; transferTo?: string }) => {
        // Handle both string (legacy) and object (new format) signatures
        if (typeof idOrObject === 'string') {
          const domainId = activeDomainId || firstDomainId;
          if (!domainId) {
            throw new Error("Domain ID is required");
          }
          return deleteMutation.mutateAsync({
            id: idOrObject,
            domainId: domainId,
          });
        } else {
          const domainId = idOrObject.domainId || activeDomainId || firstDomainId;
          if (!domainId) {
            throw new Error("Domain ID is required");
          }
          return deleteMutation.mutateAsync({
            id: idOrObject.id,
            accountId: idOrObject.accountId,
            domainId: domainId,
            transferTo: idOrObject.transferTo,
          });
        }
      },
      isPending: deleteMutation.isPending,
    };
  }, [deleteMutation, activeDomainId, firstDomainId]);

  // Override useDelete in config
  const finalConfig = useMemo(() => {
    return {
      ...usersConfig,
      useDelete: () => customDeleteHandler,
    };
  }, [usersConfig, customDeleteHandler]);

  return (
    <DomainFilterContext.Provider
      value={{ domainId: activeDomainId, setDomainId: setActiveDomainId }}
    >
      <ManagementPage config={finalConfig} />
      {userToMove && (
        <MoveUserModal
          isOpen={moveModalOpen}
          onClose={() => {
            setMoveModalOpen(false);
            setUserToMove(null);
          }}
          onConfirm={handleMoveUser}
          user={userToMove}
          currentDomainId={activeDomainId || firstDomainId || ""}
          isLoading={deleteMutation.isPending}
        />
      )}
    </DomainFilterContext.Provider>
  );
}

// Export hook to use domain filter context
export const useDomainFilter = () => useContext(DomainFilterContext);

