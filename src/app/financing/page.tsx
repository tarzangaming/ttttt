import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { getPageSEOFromFile } from '@/lib/seo-server';
import imagesData from '@/data/images.json';
import siteConfig from '@/data/site.config.json';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('financing');
  if (!seo) {
    return {
      title: 'Roof Financing Options | Dolimiti Steel Roofing',
      description:
        'Explore roof financing options with flexible payment plans to fit your budget.',
      alternates: {
        canonical: `${siteConfig.canonicalBase}/financing`,
      },
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

export default function FinancingPage() {
    return (
        <div className="bg-white font-sans text-gray-900">
            <Header />

            {/* 1. HERO */}
            <section className="relative py-24 px-4 bg-[#4a2c17] text-white flex items-center justify-center min-h-[60vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={imagesData.images.gallery.projects[0]?.url || ''}
                        alt="New Roof Financing"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-7xl font-extrabold mb-6">
                        Get Your New Roof Today
                        <span className="block text-[#c4841d] mt-2">Pay Over Time</span>
                    </h1>
                    <p className="text-xl opacity-90 mb-10 font-light">
                        Don&apos;t let budget stop you from protecting your home. Flexible payment plans starting at <strong className="text-white border-b-2 border-[#c4841d]">$149/mo</strong>.
                    </p>
                    <a
                        href="#options"
                        className="bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold px-10 py-5 rounded-xl text-lg transition shadow-xl inline-block"
                    >
                        View Payment Options
                    </a>
                </div>
            </section>

            {/* 2. WHY FINANCE */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#4a2c17] mb-4">Why Finance Your Project?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Keeping your cash reserves intact while protecting your biggest investment just makes sense.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-8 rounded-xl text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mx-auto mb-6">🚀</div>
                        <h3 className="font-bold text-lg text-[#4a2c17] mb-3">Fast Approval</h3>
                        <p className="text-gray-600">Paperless application takes less than 5 minutes. Get a decision instantly.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mx-auto mb-6">💰</div>
                        <h3 className="font-bold text-lg text-[#4a2c17] mb-3">Keep Your Cash</h3>
                        <p className="text-gray-600">Save your liquid savings for emergencies. Low monthly payments fit your budget.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mx-auto mb-6">🔓</div>
                        <h3 className="font-bold text-lg text-[#4a2c17] mb-3">No Prepayment Penalties</h3>
                        <p className="text-gray-600">Pay off your loan early at any time with zero fees. Be in control.</p>
                    </div>
                </div>
            </section>

            {/* 3. FINANCING OPTIONS */}
            <section id="options" className="py-20 bg-[#4a2c17] px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center text-white mb-16">
                        <h2 className="text-3xl font-bold mb-4">Popular Payment Plans</h2>
                        <p className="opacity-80">Subject to credit approval.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Plan 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-2xl relative overflow-hidden transform hover:-translate-y-2 transition duration-300">
                            <div className="absolute top-0 right-0 bg-[#c4841d] text-white text-xs font-bold px-3 py-1 uppercase rounded-bl-lg">Most Popular</div>
                            <h3 className="text-2xl font-bold text-[#4a2c17] mb-2">Same-As-Cash</h3>
                            <div className="text-5xl font-extrabold text-[#c4841d] mb-4">0% <span className="text-lg text-gray-400 font-normal">APR</span></div>
                            <p className="text-gray-600 font-medium mb-8">For 12 Months</p>
                            <ul className="space-y-3 mb-8 text-gray-500">
                                <li className="flex items-center gap-2">✓ No interest if paid in full</li>
                                <li className="flex items-center gap-2">✓ Low minimum payments</li>
                                <li className="flex items-center gap-2">✓ Ideal for short-term flexibility</li>
                            </ul>
                            <a href={`tel:${siteConfig.phoneClean}`} className="block w-full bg-[#4a2c17] text-white font-bold text-center py-4 rounded-xl hover:bg-[#6b3d22] transition">Call to Apply</a>
                        </div>

                        {/* Plan 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:-translate-y-2 transition duration-300">
                            <h3 className="text-2xl font-bold text-[#4a2c17] mb-2">Low Monthly Payment</h3>
                            <div className="text-5xl font-extrabold text-[#c4841d] mb-4">5.99% <span className="text-lg text-gray-400 font-normal">Fixed APR</span></div>
                            <p className="text-gray-600 font-medium mb-8">Up to 120 Months</p>
                            <ul className="space-y-3 mb-8 text-gray-500">
                                <li className="flex items-center gap-2">✓ Lowest monthly impact</li>
                                <li className="flex items-center gap-2">✓ Fixed rate never increases</li>
                                <li className="flex items-center gap-2">✓ Large projects made affordable</li>
                            </ul>
                            <a href={`tel:${siteConfig.phoneClean}`} className="block w-full bg-[#4a2c17] text-white font-bold text-center py-4 rounded-xl hover:bg-[#6b3d22] transition">Call to Apply</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FAQ */}
            <section className="py-20 px-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-[#4a2c17] mb-8 text-center">Financing FAQs</h2>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-[#4a2c17] mb-2">Does applying affect my credit score?</h4>
                        <p className="text-gray-600">Most of our lending partners offer a "soft pull" pre-qualification that does not impact your credit score.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#4a2c17] mb-2">What if I have bad credit?</h4>
                        <p className="text-gray-600">We work with multiple lending platforms that cater to a wide range of credit profiles. We can often find a solution even for less-than-perfect credit.</p>
                    </div>
                </div>
            </section>

            <Footer />
            <FloatingCTA />
        </div>
    );
}
