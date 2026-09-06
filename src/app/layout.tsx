import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StoneCraft Surfaces | Granite, Quartz & Sintered Stone",
    template: "%s | StoneCraft Surfaces",
  },
  description: "Premium granite, quartz and sintered stone fabrication and installation for kitchens, bathrooms and commercial spaces.",
  keywords: ["granite countertops", "quartz surfaces", "sintered stone", "stone fabrication", "Cape Town"],
  openGraph: {
    title: "StoneCraft Surfaces | Timeless stone, precisely made",
    description: "Premium stone surfaces for residential and commercial spaces.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full">{children}</body></html>;
}
