import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { getPageSEOFromFile } from "@/lib/seo-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://bennettconstructionandroofing.com";

const homeSeo = getPageSEOFromFile("home");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    homeSeo?.title ||
    "Expert Roofing & Construction Services | Bennett Construction & Roofing",
  description:
    homeSeo?.description ||
    "Bennett Construction & Roofing provides professional roofing, siding, gutters, and construction services.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title:
      homeSeo?.title ||
      "Expert Roofing & Construction Services | Bennett Construction & Roofing",
    description:
      homeSeo?.description ||
      "Bennett Construction & Roofing provides professional roofing, siding, gutters, and construction services.",
    url: SITE_URL,
    siteName: "Bennett Construction & Roofing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      homeSeo?.title ||
      "Expert Roofing & Construction Services | Bennett Construction & Roofing",
    description:
      homeSeo?.description ||
      "Professional roofing, siding, gutters, and construction services.",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bennett Construction & Roofing",
    url: SITE_URL,
    logo: "https://bennettconstructionandroofing.com/images/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-866-289-1750",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: "Bennett Construction & Roofing",
    image: "https://bennettconstructionandroofing.com/images/logo.png",
    url: SITE_URL,
    telephone: "+1-866-289-1750",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Organization & LocalBusiness JSON-LD */}
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        {/* Google Analytics (replace G-XXXXXXXXXX with real ID) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
