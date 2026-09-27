import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cape Counter Tops | Granite, Quartz & Sintered Stone",
    template: "%s | Cape Counter Tops",
  },
  description: "Cape Counter Tops supplies and installs granite, quartz and sintered stone surfaces for residential and commercial spaces in Cape Town and surrounding areas.",
  keywords: ["granite countertops", "quartz surfaces", "sintered stone", "stone fabrication", "Cape Town", "Cape Counter Tops"],
  openGraph: {
    title: "Cape Counter Tops",
    description: "Granite, quartz and sintered stone surfaces for kitchens, bathrooms and commercial spaces in Cape Town and surrounding areas.",
    type: "website",
    siteName: "Cape Counter Tops",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-navy text-ivory">{children}</body>
    </html>
  );
}
