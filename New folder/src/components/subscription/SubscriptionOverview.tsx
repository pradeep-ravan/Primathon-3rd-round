"use client";

import { Users, ExternalLink, Crown, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCard, DataItem } from "./shared";

const SubscriptionOverview = () => {
  const activeUsers = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "IceWarp",
      value: "5",
      status: "active",
      color: "text-chart-2",
      bgColor: "from-chart-2/20 to-primary/20",
      borderColor: "border-chart-2/30",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "IceWarp Desktop",
      value: "0",
      status: "inactive",
      color: "text-muted-foreground",
      bgColor: "from-muted-foreground/20 to-muted-foreground/15",
      borderColor: "border-border/30",
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
      title="SUBSCRIPTION"
      icon={<Crown className="w-6 h-6 text-primary" />}
      gradientTheme={gradientTheme}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground tracking-wide">
              ACTIVE USERS
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="group relative overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary/50 px-3 py-2 rounded-xl transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center space-x-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Plan details</span>
              <Sparkles className="w-3.5 h-3.5 opacity-60" />
            </div>
          </Button>
        </div>

        <div className="space-y-3.5">
          {activeUsers.map((user, index) => (
            <DataItem
              key={index}
              icon={user.icon}
              label={user.label}
              value={user.value}
              status={user.status}
              color={user.color}
              bgColor={user.bgColor}
              borderColor={user.borderColor}
              index={index}
            />
          ))}

          {/* Total users - Compact */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

            <div className="relative flex items-center justify-between py-4 px-4 gradient-accent bg-card/60 dark:bg-card/40 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-200 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20 flex-shrink-0">
                  <Users className="w-5 h-5 text-primary drop-shadow-sm" />
                </div>
                <div>
                  <span className="text-foreground font-bold text-base sm:text-lg tracking-wide">
                    Total
                  </span>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></div>
                    <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                      All Services
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary group-hover:text-primary transition-colors duration-200">
                5
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

export default SubscriptionOverview;
