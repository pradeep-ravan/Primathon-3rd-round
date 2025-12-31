import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Configuration | EMOR",
  description: "Configure domain settings, permissions, and limits",
};

export default function DomainConfigureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
