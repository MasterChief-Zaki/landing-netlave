import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/seo";
import { ibmPlexMono, spaceGrotesk } from "@/styles/fonts";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.scss";

export const metadata = pageMetadata(
  "NetLave — The idea and founders behind TSE forestry",
  "/",
);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <StructuredData />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
