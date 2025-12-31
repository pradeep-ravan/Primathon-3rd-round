'use client';

import {
  BillingDetails,
  DatacenterInfo,
  PaymentInfo,
  SubscriptionHeader,
  SubscriptionOverview,
} from '@/components/subscription';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SubscriptionPage() {
  const { isAuthenticated, logoutLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Show logout loading screen
  if (logoutLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-foreground mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Logging out...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header with key metrics - Compact */}
        <SubscriptionHeader />

        {/* Main content grid - Responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Column 1 - Payment Info */}
          <div className="md:col-span-1 xl:col-span-1">
            <PaymentInfo />
          </div>
          {/* Column 2 - Datacenter Info */}
          <div className="md:col-span-1 xl:col-span-1">
            <DatacenterInfo />
          </div>
          {/* Column 3 - Subscription Overview */}
          <div className="md:col-span-1 xl:col-span-1">
            <SubscriptionOverview />
          </div>
          {/* Column 4 - Billing Details */}
          <div className="md:col-span-1 xl:col-span-1">
            <BillingDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
