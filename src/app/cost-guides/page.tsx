import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import guides from '@/data/cost-guides.json';
import { getCompanyInfo } from '@/utils/content';
import { getPageSEOFromFile } from '@/lib/seo-server';

const companyInfo = getCompanyInfo();

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('costGuides');
  if (!seo) {
    return {
      title: 'Roofing Cost Guides | Bennett Construction & Roofing',
      description:
        'Transparent, up-to-date roofing cost guides to help you budget for your project.',
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: { title: seo.title, description: seo.description, type: 'website' },
  };
}

export default function CostGuidesIndexPage() {
    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Fallback pattern or image could go here */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-200 text-sm font-semibold mb-6">
                        Arizona Pricing Resources
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Roofing Cost Guides
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        Transparent, up-to-date information on what you should expect to pay for roofing services in Arizona. Plan your project with confidence.
                    </p>
                </div>
            </section>

            {/* Guides Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => (
                            <Link
                                href={`/cost-guides/${guide.slug}`}
                                key={guide.slug}
                                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="h-48 bg-slate-100 relative overflow-hidden">
                                    {/* Placeholder for guide image - ideally would come from images.json or guide data */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 3.659c0 3.074-1.8 6-6 6a1 1 0 01-1-1v-4.659A5 5 0 016.9 6h1.2m7.8 0A5 5 0 0122 11v6a1 1 0 01-1 1h-2M15 11h2a1 1 0 001-1V6.28a2 2 0 00-2-1.28Zm-5 2h2a1 1 0 001-1V7a1 1 0 00-1-1h-2a1 1 0 00-1 1v4a1 1 0 001 1Z" /></svg>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {guide.title}
                                    </h2>
                                    <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                                        {guide.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500">
                                            Avg: ${guide.averageCost.toLocaleString()}
                                        </span>
                                        <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            Read Guide
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-slate-50 py-20 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Need a Precise Quote?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Online guides are helpful for budgeting, but every roof is unique. Get an exact price for your property.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`tel:${companyInfo.phoneClean}`}
                            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
                        >
                            Call {companyInfo.phone}
                        </a>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition"
                        >
                            Request Online
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
