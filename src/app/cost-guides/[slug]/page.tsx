
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import guides from '@/data/cost-guides.json';
import { getCompanyInfo } from '@/utils/content';
import { getCostGuideSEOFromFile } from '@/lib/seo-server';

interface PageProps {
    params: Promise<{ slug: string }>;
}

const companyInfo = getCompanyInfo();

export async function generateStaticParams() {
    return guides.map((guide) => ({
        slug: guide.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = guides.find((g) => g.slug === slug);

    if (!guide) return {};

        title: seo.title,
        description: seo.description,
        title: seo.title,
        description: seo.description,
        title: seo.title,
        description: seo.description,
    const seo = getCostGuideSEOFromFile(slug, guide.title, guide.description);

    return {
        alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
        openGraph: { title: seo.title, description: seo.description },
    };
}

export default async function CostGuidePage(props: PageProps) {
    const params = await props.params;
    const guide = guides.find((g) => g.slug === params.slug);

    if (!guide) {
        notFound();
    }

    return (
        <main className="bg-white">
            {/* Hero Header */}
            <section className="bg-slate-900 text-white py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link href="/cost-guides" className="inline-flex items-center text-blue-300 hover:text-blue-200 mb-8 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Cost Guides
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        {guide.title}
                    </h1>
                    <p className="text-xl text-slate-300">
                        {guide.description}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">

                    {/* Quick Summary Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-12">
                        <h3 className="text-xl font-bold text-blue-900 mb-4">Arizona Cost Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <span className="block text-sm text-slate-500 uppercase tracking-wide">Lowest</span>
                                <span className="block text-2xl font-bold text-slate-900">${guide.minCost.toLocaleString()}</span>
                            </div>
                            <div className="bg-blue-600 p-4 rounded-xl shadow-md transform scale-105">
                                <span className="block text-sm text-blue-100 uppercase tracking-wide">Average</span>
                                <span className="block text-3xl font-extrabold text-white">${guide.averageCost.toLocaleString()}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <span className="block text-sm text-slate-500 uppercase tracking-wide">Highest</span>
                                <span className="block text-2xl font-bold text-slate-900">${guide.maxCost.toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-sm text-center text-blue-700 mt-6">
                            *Estimates based on typical residential projects in Arizona. Actual costs vary.
                        </p>
                    </div>

                    {/* Factors List */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">What Influences the Cost?</h2>
                        <ul className="grid sm:grid-cols-2 gap-4">
                            {guide.factors.map((factor, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="font-medium text-slate-700">{factor}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Content Sections */}
                    <div className="prose prose-lg text-slate-600 max-w-none mb-12">
                        {guide.sections.map((section, idx) => (
                            <div key={idx} className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>
                                <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                        ))}
                    </div>

                    {/* Materials Table */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Material Price Breakdown</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b-2 border-slate-200 bg-slate-50 font-bold text-slate-900">Material Type</th>
                                        <th className="p-4 border-b-2 border-slate-200 bg-slate-50 font-bold text-slate-900">Price Range</th>
                                        <th className="p-4 border-b-2 border-slate-200 bg-slate-50 font-bold text-slate-900">Lifespan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guide.materials.map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            <td className="p-4 font-medium text-slate-800">{item.name}</td>
                                            <td className="p-4 text-slate-600">{item.priceRange}</td>
                                            <td className="p-4 text-slate-600">{item.lifespan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center">
                        <h3 className="text-2xl font-bold mb-4">Get an Exact Quote for Your Roof</h3>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                            Stop guessing. Our estimates are free, detailed, and come with no obligation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={`tel:${companyInfo.phoneClean}`} className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 py-3 rounded-xl font-bold transition">
                                Call {companyInfo.phone}
                            </a>
                            <Link href="/contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-bold transition">
                                Request Online
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-8">
                        {/* Contact Card */}
                        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">Have Questions?</h4>
                            <p className="text-slate-600 mb-6 text-sm">
                                Speak with a project manager about your specific needs.
                            </p>
                            <a
                                href={`tel:${companyInfo.phoneClean}`}
                                className="flex items-center justify-center w-full py-3 bg-[#d97706] text-white font-bold rounded-lg hover:bg-[#b45309] transition mb-3"
                            >
                                Call {companyInfo.phone}
                            </a>
                            <Link
                                href="/contact"
                                className="flex items-center justify-center w-full py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition"
                            >
                                Book Inspection
                            </Link>
                        </div>

                        {/* Other Guides */}
                        <div className="bg-slate-50 rounded-2xl p-6">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">Other Cost Guides</h4>
                            <ul className="space-y-3">
                                {guides.filter(g => g.slug !== guide.slug).map(g => (
                                    <li key={g.slug}>
                                        <Link href={`/cost-guides/${g.slug}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 group-hover:scale-125 transition"></span>
                                            {g.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
