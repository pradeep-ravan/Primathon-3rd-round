import React from "react";
import { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Groups Management | EMOR",
  description:
    "Manage your organization's groups, permissions, and member access with our comprehensive group management system.",
  keywords: [
    "group management",
    "user groups",
    "permissions",
    "member access",
    "organization",
  ],
  openGraph: {
    title: "Groups Management | EMOR",
    description:
      "Manage your organization's groups, permissions, and member access with our comprehensive group management system.",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <Client />
    </div>
  );
};

export default page;