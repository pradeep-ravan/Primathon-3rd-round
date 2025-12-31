'use client';

import React, { useMemo, useState, createContext, useContext, useEffect } from "react";
import { ManagementPage } from '@/components/custom/ManagementPage';
import { createGroupsConfig } from './groupsConfig';
import { useDomains } from "@/hooks/useDomains";
import { useRouter, useSearchParams } from "next/navigation";

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

  // Create config with dynamic domain options and domain filter context
  const groupsConfig = useMemo(() => {
    return createGroupsConfig(domainsData?.items || [], {
      domainId: activeDomainId,
      setDomainId: (id: string | undefined) => {
        setActiveDomainId(id);
      },
    });
  }, [domainsData?.items, activeDomainId]);

  return (
    <DomainFilterContext.Provider
      value={{ domainId: activeDomainId, setDomainId: setActiveDomainId }}
    >
      <ManagementPage config={groupsConfig} />
    </DomainFilterContext.Provider>
  );
}

// Export hook to use domain filter context
export const useDomainFilter = () => useContext(DomainFilterContext);
