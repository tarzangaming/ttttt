import type { Metadata } from 'next';
import ContactPageContent from '@/components/ContactPageContent';
import { getPageSEOFromFile } from '@/lib/seo-server';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('contact');

  if (!seo) {
    return {
      title: 'Contact Bennett Construction & Roofing',
      description:
        'Get in touch with Bennett Construction & Roofing for roofing, siding, gutters, and construction services. Request a free estimate today.',
      alternates: {
        canonical: 'https://bennettconstructionandroofing.com/contact',
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
      url: seo.canonical ?? 'https://bennettconstructionandroofing.com/contact',
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