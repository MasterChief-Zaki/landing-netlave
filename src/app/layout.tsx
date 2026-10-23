import type { Metadata } from "next";
import { ibmPlexMono, spaceGrotesk } from "@/styles/fonts";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.scss";

export const metadata: Metadata = {
  title: "NetLave — Digital Twin for TSE Forestry",
  description:
    "A simulation-driven prototype of self-powered, treated-wastewater forest irrigation in Egypt, built on synthetic site assumptions, not field measurements.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
