import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cape Counter Tops | Granite, Quartz & Sintered Stone",
    template: "%s | Cape Counter Tops",
  },
  description: "Cape Counter Tops supplies, fabricates and installs premium granite, quartz and sintered stone countertops and surfaces for residential and commercial spaces.",
  keywords: ["granite countertops", "quartz surfaces", "sintered stone", "stone fabrication", "Cape Town"],
  openGraph: {
    title: "Cape Counter Tops | Timeless stone, precisely made",
    description: "Cape Counter Tops supplies, fabricates and installs premium granite, quartz and sintered stone countertops and surfaces.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full">{children}</body></html>;
}
