import React from "react";
import { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Domain Management | EMOR",
  description:
    "Manage your domains, DNS settings, and domain configurations with our comprehensive domain management system.",
  keywords: [
    "domain management",
    "DNS",
    "domain settings",
    "domain configuration",
  ],
  openGraph: {
    title: "Domain Management | EMOR",
    description: "Manage your domains, DNS settings, and domain configurations",
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
