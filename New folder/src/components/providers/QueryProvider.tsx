"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Increased staleTime to reduce unnecessary refetches
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false, // Disable refetch on window focus
            refetchOnMount: false, // Disable refetch on mount if data exists
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors
              if (
                (error as { status?: number })?.status >= 400 &&
                (error as { status?: number })?.status < 500
              ) {
                return false;
              }
              // Retry up to 2 times for other errors (reduced from 3)
              return failureCount < 2;
            },
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              // Don't retry mutations on 4xx errors
              if (
                (error as { status?: number })?.status >= 400 &&
                (error as { status?: number })?.status < 500
              ) {
                return false;
              }
              // Retry up to 2 times for other errors
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
