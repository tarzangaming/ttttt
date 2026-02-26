import type { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';
import { getPageSEOFromFile } from '@/lib/seo-server';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('about');

  if (!seo) {
    return {
      title: 'About Dolomiti Steel Roofing',
      description:
        'Learn more about Dolomiti Steel Roofing, our experience, values, and commitment to quality roofing and construction services.',
      alternates: {
        canonical: 'https://dolomitisteelroofing.com/about',
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
      url: seo.canonical ?? 'https://dolomitisteelroofing.com/about',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function AboutPage() {
  return <AboutPageContent />;
}