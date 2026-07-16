import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

import { siteSettingService } from "@/services/site-setting";
import { portfolioService } from "@/services/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await siteSettingService.getSetting();
  const profile = await portfolioService.getProfile();

  const title = settings?.seoTitle || profile?.fullName || "Personal Portfolio";
  const description = settings?.seoDescription || profile?.shortBio || "Portfolio personal developer untuk menampilkan project, skill, pengalaman, dan kontak.";

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    openGraph: {
      title,
      description,
      images: settings?.openGraphImage ? [settings.openGraphImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings?.openGraphImage ? [settings.openGraphImage] : [],
      creator: settings?.twitterHandle || undefined,
    },
    icons: {
      icon: settings?.faviconUrl || "/favicon.ico",
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
