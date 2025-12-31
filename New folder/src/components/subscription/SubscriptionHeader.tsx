"use client";

import {
  Calendar,
  Users,
  DollarSign,
  HardDrive,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MetricItem } from "./shared";

const SubscriptionHeader = () => {
  const metrics = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Next billing",
      value: "2026/02/01",
      color: "text-chart-2",
      bgColor: "from-chart-2/20 to-primary/20",
      borderColor: "border-chart-2/30",
      trend: "+2 days",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Active users",
      value: "5",
      color: "text-chart-1",
      bgColor: "from-chart-1/20 to-chart-1/15",
      borderColor: "border-chart-1/30",
      trend: "+1 this week",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Total monthly costs",
      value: "$0.00",
      color: "text-chart-3",
      bgColor: "from-chart-3/20 to-chart-3/15",
      borderColor: "border-chart-3/30",
      trend: "No change",
      trendIcon: <Zap className="w-3 h-3" />,
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      label: "Total storage used",
      value: "9.8 MB / 998.8 GB",
      color: "text-primary",
      bgColor: "from-primary/20 to-primary/15",
      borderColor: "border-primary/30",
      trend: "+0.2 MB",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl"></div>

      <div className="relative gradient-card bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {metrics.map((metric, index) => (
              <MetricItem
                key={index}
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                trend={metric.trend}
                trendIcon={metric.trendIcon}
                color={metric.color}
                bgColor={metric.bgColor}
                borderColor={metric.borderColor}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
