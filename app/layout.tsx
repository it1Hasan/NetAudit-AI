import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Network-Sentinel AI — Network Config Security Auditor",
  description:
    "Paste a Cisco IOS or MikroTik RouterOS config and get an instant AI-powered security audit with severity scoring and CLI remediation commands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
