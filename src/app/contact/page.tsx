import type { Metadata } from 'next';
import ContactPageContent from '@/components/ContactPageContent';
import { getPageSEOFromFile } from '@/lib/seo-server';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('contact');
  if (!seo) {
    return {
      title: 'Contact Us | Bennett Construction & Roofing',
      description: 'Contact Bennett Construction & Roofing for a free roofing and construction estimate. Call (866) 289-1750.',
      alternates: { canonical: 'https://bennettconstructionandroofing.com/contact' },
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: { title: seo.title, description: seo.description, type: 'website' },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  };
}

export default function ContactPage() {
  return <ContactPageContent />;
}