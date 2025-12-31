"use client";

import { Users, DollarSign, Clock, Sparkles } from "lucide-react";
import { AnimatedCard, DataItem } from "./shared";

const BillingDetails = () => {
  const billingPeriod = "9. - 31. January 2026";
  const services = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "IceWarp",
      value: "$0.00",
      status: "inactive",
      color: "text-accent-secondary",
      bgColor: "gradient-logo-soft",
      borderColor: "border-accent-secondary",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "IceWarp Desktop",
      value: "$0.00",
      status: "inactive",
      color: "text-theme-tertiary",
      bgColor: "bg-theme-tertiary",
      borderColor: "border-theme-primary",
    },
  ];

  const gradientTheme = {
    background: "bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5",
    border: "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
    iconBg: "bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20",
    iconColor: "border-primary/30",
  };

  return (
    <AnimatedCard
      title="NEXT BILLING"
      icon={<DollarSign className="w-6 h-6 text-primary" />}
      gradientTheme={gradientTheme}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground tracking-wide">
              BILLING PERIOD
            </h3>
          </div>
          <div className="relative overflow-hidden gradient-accent bg-card/60 dark:bg-card/40 border border-primary/30 px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-foreground font-semibold">
                {billingPeriod}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-primary opacity-60" />
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {services.map((service, index) => (
            <DataItem
              key={index}
              icon={service.icon}
              label={service.label}
              value={service.value}
              status={service.status}
              color={service.color}
              bgColor={service.bgColor}
              borderColor={service.borderColor}
              index={index}
            />
          ))}
        </div>

        {/* Total price section - Compact */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

          <div className="relative border-t border-border/50 pt-4">
            <div className="flex items-center justify-between py-4 px-4 gradient-accent bg-card/60 dark:bg-card/40 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-200 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20 flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-primary drop-shadow-sm" />
                </div>
                <div>
                  <span className="text-foreground font-bold text-base sm:text-lg tracking-wide">
                    Total price:
                  </span>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
                    <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                      Final Amount
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary group-hover:text-primary transition-colors duration-200">
                $0.00
              </span>
            </div>

            {/* Enhanced glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-30 transition-opacity duration-200 blur-sm"></div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default BillingDetails;
