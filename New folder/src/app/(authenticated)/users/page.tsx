import React from "react";
import { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "User Management | EMOR",
  description:
    "Manage users, their roles, permissions, and account settings with our comprehensive user management system.",
  keywords: [
    "user management",
    "user accounts",
    "user roles",
    "user permissions",
    "user settings",
  ],
  openGraph: {
    title: "User Management | EMOR",
    description: "Manage users, their roles, permissions, and account settings",
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

