"use client";

import { FileText, CreditCard, Building, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "./shared";

const PaymentInfo = () => {
  const orderInfo = {
    orderId: "GLB20251009-180129-241-A",
    companyName: "IceWarp India2",
    billingAddress: "Thamova 18, Praha 16000, Czech Republic",
  };

  const paymentGradientTheme = {
    background: "bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5",
    border: "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
    iconBg: "bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20",
    iconColor: "border-primary/30",
  };

  return (
    <AnimatedCard
      title="PAYMENT INFORMATION"
      icon={<Shield className="w-6 h-6 text-primary" />}
      gradientTheme={paymentGradientTheme}
    >
      <div className="space-y-5">
        {/* Last Invoices - Compact */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

          <div className="relative flex items-center space-x-3 p-4 gradient-accent bg-card/60 dark:bg-card/40 hover:bg-card/70 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200 backdrop-blur-sm">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10 flex-shrink-0">
              <FileText className="w-4 h-4 text-primary drop-shadow-sm" />
            </div>
            <div>
              <span className="text-foreground text-sm font-semibold">
                No invoices available
              </span>
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                  No invoices yet
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Information - Compact */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground tracking-wide flex items-center space-x-2.5">
            <Building className="w-4 h-4 text-primary" />
            <span>Order Information</span>
          </h4>
          {[
            {
              label: "ORDER ID",
              value: orderInfo.orderId,
            },
            {
              label: "COMPANY",
              value: orderInfo.companyName,
            },
            {
              label: "ADDRESS",
              value: orderInfo.billingAddress,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 gradient-accent bg-card/60 dark:bg-card/40 hover:bg-card/70 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200 space-y-1 sm:space-y-0"
            >
              <span className="text-foreground text-xs font-semibold">
                {item.label}:
              </span>
              <span className="text-foreground font-semibold text-xs text-left sm:text-right break-words">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Card Details - Compact */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground tracking-wide flex items-center space-x-2.5">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Card Details</span>
          </h4>
          <Button
            variant="outline"
            size="sm"
            className="group/btn relative overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary/50 px-4 py-2.5 rounded-lg transition-all duration-200 w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center space-x-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">CHANGE CARD</span>
              <Zap className="w-3.5 h-3.5 opacity-60" />
            </div>
          </Button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PaymentInfo;
