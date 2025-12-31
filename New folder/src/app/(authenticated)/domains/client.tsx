'use client';

import { ManagementPage } from '@/components/custom/ManagementPage';
import { Domain } from '@/types/domain';
import { Settings, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { domainsConfig } from './domainsConfig';

export default function Client() {
  const router = useRouter();

  const handleConfigureDomain = (domain: Domain) => {
    router.push(`/domain/${domain.id}`);
  };

  // Override the custom action to handle domain configuration and update users column
  const configWithCustomAction = {
    ...domainsConfig,
    columns: domainsConfig.columns.map((col) => {
      // Update the users column to use Next.js router
      if (col.key === 'users') {
        return {
          ...col,
          render: (_: any, item: Domain) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to users page with domain filter using Next.js router
                const encodedId = encodeURIComponent(item.id);
                router.push(`/users?domain=${encodedId}`);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
              title={`View users for ${item.name}`}
            >
              <Users className="h-4 w-4 text-primary hover:text-primary/80" />
            </button>
          ),
        };
      }
      return col;
    }),
    actions: {
      ...domainsConfig.actions,
      customActions: [
        {
          label: 'Configure',
          icon: domainsConfig.actions?.customActions?.[0]?.icon || (
            <Settings className="h-4 w-4" />
          ),
          onClick: handleConfigureDomain,
          variant: 'default' as const,
        },
      ],
    },
  };

  return (
    <>
      <ManagementPage config={configWithCustomAction} />
    </>
  );
}
