import {
  Globe,
  User,
  Users,
  CreditCard,
  ClipboardList,
  Palette,
  ShieldCheck,
  Server,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";
import { SpamQueuesIcon } from "@/components/icons/SpamQueuesIcon";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  id: string;
  keywords?: string[];
}

export interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    id: "core-management",
    title: "Core Management",
    items: [
      { title: "Domains", icon: Globe, href: "/domains", id: "domains", keywords: ["dns", "zone"] },
      { title: "Users", icon: User, href: "/users", id: "users", keywords: ["accounts", "mailbox"] },
      { title: "Groups", icon: Users, href: "/groups", id: "groups", keywords: ["teams", "distribution"] },
    ],
  },
  {
    id: "security-compliance",
    title: "Security",
    items: [
      {
        title: "Subscription",
        icon: CreditCard,
        href: "/subscription",
        id: "subscription",
        keywords: ["billing", "plan", "payment"],
      },
      {
        title: "Content Rules",
        icon: ClipboardList,
        href: "/content-rules",
        id: "content-rules",
        keywords: ["filter", "policy", "compliance"],
      },
      {
        title: "Spam Queues",
        icon: SpamQueuesIcon,
        href: "/spam-queues",
        id: "spam-queues",
        keywords: ["junk", "quarantine"],
      },
    ],
  },
  {
    id: "administration",
    title: "Admin",
    items: [
      {
        title: "White Labeling",
        icon: Palette,
        href: "/whitelabeling",
        id: "whitelabeling",
        keywords: ["branding", "logo", "theme"],
      },
      {
        title: "Features",
        icon: ShieldCheck,
        href: "/features",
        id: "features",
        keywords: ["modules", "enable"],
      },
      {
        title: "Server Settings",
        icon: Server,
        href: "/server-settings",
        id: "server-settings",
        keywords: ["config", "system"],
      },
    ],
  },
];

export const flatMenuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, id: "dashboard", keywords: ["home", "main", "analytics"] },
  ...menuGroups.flatMap((group) => group.items),
];
