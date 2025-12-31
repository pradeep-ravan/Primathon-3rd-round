"use client";

import { Globe, Server, Info, Mail, Database, Sparkles } from "lucide-react";
import { AnimatedCard, DataItem } from "./shared";

const DatacenterInfo = () => {
  const datacenterInfo = [
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Cluster",
      value: "India, Mumbai (IceWarp India)",
      status: "active",
      color: "text-chart-2",
      bgColor: "from-chart-2/20 to-primary/20",
      borderColor: "border-chart-2/30",
    },
    {
      icon: <Server className="w-6 h-6" />,
      label: "Hypervisor",
      value: "Cloud Server",
      status: "active",
      color: "text-chart-1",
      bgColor: "from-chart-1/20 to-chart-1/15",
      borderColor: "border-chart-1/30",
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
      title="DATACENTER, STORAGE & SUPPORT"
      icon={<Database className="w-6 h-6 text-primary" />}
      gradientTheme={gradientTheme}
    >
      <div className="space-y-5">
        {/* Datacenter Info */}
        <div className="space-y-3.5">
          {datacenterInfo.map((info, index) => (
            <DataItem
              key={index}
              icon={info.icon}
              label={info.label}
              value={info.value}
              status={info.status}
              color={info.color}
              bgColor={info.bgColor}
              borderColor={info.borderColor}
              index={index}
            />
          ))}
        </div>

        {/* Enhanced Business Support - Compact */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground tracking-wide flex items-center space-x-2.5">
            <Info className="w-4 h-4 text-primary" />
            <span>Business Support</span>
          </h4>
          <p className="text-foreground text-xs leading-relaxed mb-3">
            Contact our support within 24/7 hours per day
          </p>
          <a
            href="mailto:sales@icewarp.com"
            className="group/link inline-flex items-center space-x-3 text-primary hover:text-primary transition-colors gradient-accent bg-card/60 dark:bg-card/40 hover:bg-card/70 px-4 py-3.5 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-200 backdrop-blur-sm w-full"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30 flex-shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm break-words">
                sales@icewarp.com
              </span>
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0"></div>
                <span className="text-xs text-primary uppercase tracking-wider font-semibold break-words">
                  24/7 Support
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 opacity-60 flex-shrink-0" />
          </a>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default DatacenterInfo;
