'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDomain } from '@/hooks/useDomains';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

// Dynamically import heavy DomainConfiguration component to reduce initial bundle size
const DomainConfiguration = dynamic(
  () => import('@/components/domains/DomainConfiguration').then(mod => ({ default: mod.DomainConfiguration })),
  {
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/90 border-border backdrop-blur-sm shadow-2xl p-8 rounded-2xl">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Loading Domain Configuration
              </h2>
              <p className="text-muted-foreground">
                Loading configuration editor...
              </p>
            </div>
          </div>
        </Card>
      </div>
    ),
    ssr: false, // Disable SSR for this heavy component
  }
);

interface DomainPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DomainPage({
  params,
}: DomainPageProps) {
  const router = useRouter();
  // Unwrap params Promise for Next.js 15+
  const { id } = use(params);
  // Fetch domain using GET_BY_ID endpoint: /admin/domain/:id
  const { data: domain, isLoading, error, refetch } = useDomain(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/90 border-border backdrop-blur-sm shadow-2xl p-8 rounded-2xl">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Loading Domain Configuration
              </h2>
              <p className="text-muted-foreground">
                Fetching domain details...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/90 border-border backdrop-blur-sm shadow-2xl p-8 rounded-2xl max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Error Loading Domain
              </h2>
              <p className="text-muted-foreground">
                Failed to fetch domain details
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              {error instanceof Error
                ? error.message
                : 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => refetch()}
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Try Again
              </Button>
              <Button onClick={() => router.push('/domains')} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/90 border-border backdrop-blur-sm shadow-2xl p-8 rounded-2xl max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <AlertCircle className="h-8 w-8 text-chart-3" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Domain Not Found
              </h2>
              <p className="text-muted-foreground">
                The requested domain could not be found
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/domains')}
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <DomainConfiguration
        domain={domain}
        onClose={() => router.push('/domains')}
        onSave={(updatedDomain) => {
          router.push('/domains');
        }}
      />
    </>
  );
}

