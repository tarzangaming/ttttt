import type { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';
import { getPageSEOFromFile } from '@/lib/seo-server';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('about');
  if (!seo) {
    return {
      title: 'About Us | Bennett Construction & Roofing',
      description: 'Learn about Bennett Construction & Roofing - 25+ years of trusted roofing and construction services across the USA.',
      alternates: { canonical: 'https://bennettconstructionandroofing.com/about' },
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

export default function AboutPage() {
  return <AboutPageContent />;
}