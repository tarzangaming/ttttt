import type { Metadata } from 'next';
import ContactPageContent from '@/components/ContactPageContent';
import { getPageSEOFromFile } from '@/lib/seo-server';
import siteConfig from '@/data/site.config.json';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('contact');

  if (!seo) {
    return {
      title: `Contact ${siteConfig.companyName}`,
      description:
        `Get in touch with ${siteConfig.companyName} for roofing, siding, gutters, and construction services. Request a free estimate today.`,
      alternates: {
        canonical: `${siteConfig.canonicalBase}/contact`,
      },
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      url: seo.canonical ?? `${siteConfig.canonicalBase}/contact`,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function ContactPage() {
  return <ContactPageContent />;
}