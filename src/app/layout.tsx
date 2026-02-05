import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { getPageSEOFromFile } from "@/lib/seo-server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function getDefaultMetadata(): Metadata {
  const seo = getPageSEOFromFile('home');
  return {
  title: seo?.title || "Expert Roofing & Construction Services | Bennett Construction & Roofing",
  description: seo?.description || "Bennett Construction & Roofing provides professional roofing, siding, gutters, and construction services. Licensed, insured, and trusted for 25+ years. Free estimates. Call (866) 289-1750.",
  keywords: [
    "roofing contractor",
    "construction company",
    "roof repair",
    "roof replacement",
    "storm damage repair",
    "siding installation",
    "gutter installation",
    "general contractor",
    "home remodeling",
    "exterior remodeling",
    "commercial roofing",
    "residential roofing",
    "licensed roofer",
    "insured contractor",
    "free roofing estimate"
  ],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: seo?.title || "Expert Roofing & Construction Services | Bennett Construction & Roofing",
    description: seo?.description || "Bennett Construction & Roofing provides professional roofing, siding, gutters, and construction services.",
    url: "https://bennettconstructionandroofing.com",
    siteName: "Bennett Construction & Roofing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo?.title || "Expert Roofing & Construction Services | Bennett Construction & Roofing",
    description: seo?.description || "Professional roofing, siding, gutters, and construction services.",
  },
  alternates: {
    canonical: seo?.canonical || "https://bennettconstructionandroofing.com",
  },
  };
}

export const metadata: Metadata = getDefaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization and LocalBusiness schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bennett Construction & Roofing",
    "url": "https://bennettconstructionandroofing.com",
    "logo": "https://bennettconstructionandroofing.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-866-289-1750",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "English"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "name": "Bennett Construction & Roofing",
    "image": "https://bennettconstructionandroofing.com/images/logo.png",
    "url": "https://bennettconstructionandroofing.com",
    "telephone": "+1-866-289-1750",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics - Replace with your GA ID */}
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
