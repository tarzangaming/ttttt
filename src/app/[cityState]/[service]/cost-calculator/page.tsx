import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { getServiceCostConfig, getCityFromSlug } from '@/lib/cost-data';
import { getCostCalculatorPageSEOFromFile } from '@/lib/seo-server';
import { getDomain, getAllLocations } from '@/utils/content';
import servicesData from '@/data/services.json';
import siteConfig from '@/data/site.config.json';
import CostCalculator from '@/components/cost/CostCalculator';
import PriceTierCards from '@/components/cost/PriceTierCards';
import ImpactFactors from '@/components/cost/ImpactFactors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';

interface PageProps {
    params: Promise<{
        cityState: string;
        service: string;
    }>;
}

type ServiceItem = {
    slug: string;
    title: string;
};

function getAllServices(): ServiceItem[] {
    const byCategory = (servicesData as any).servicesByCategory || {};
    return Object.values(byCategory).flat() as ServiceItem[];
}

export const dynamicParams = true;

export async function generateStaticParams() {
    const locations = getAllLocations();
    const paths: { cityState: string; service: string }[] = [];
    const allServices = getAllServices();
    for (const loc of locations) {
        for (const svc of allServices) {
            paths.push({ cityState: loc.id, service: svc.slug });
        }
    }
    return paths.slice(0, 200);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { cityState, service: serviceSlug } = await params;
    const location = getCityFromSlug(cityState);
    const service = getAllServices().find(s => s.slug === serviceSlug);

    if (!location || !service) return {};

    const host = (await headers()).get('host') || '';
    const seo = getCostCalculatorPageSEOFromFile(
        location.city,
        location.state,
        cityState,
        service.title,
        serviceSlug,
        { host }
    );

    return {
        title: seo.title,
        description: seo.description,
        alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
        openGraph: { title: seo.title, description: seo.description },
    };
}

export default async function CostPage({ params }: PageProps) {
    const { cityState, service: serviceSlug } = await params;
    const location = getCityFromSlug(cityState);
    const service = getAllServices().find(s => s.slug === serviceSlug);

    if (!location || !service) {
        notFound();
    }

    const host = (await headers()).get('host') || '';
    const domain = getDomain();
    const subdomain = host.includes('.') ? host.split('.')[0]?.toLowerCase() : '';
    const isThisCitySubdomain = subdomain && subdomain === cityState.toLowerCase();

    const costConfig = getServiceCostConfig(serviceSlug) ?? {
        baseCostPerSq: { low: 450, high: 850 }
    };
    const baseCost = costConfig.baseCostPerSq ?? { low: 450, high: 850 };
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="bg-white py-16 px-4 border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block bg-blue-50 text-[#1e3a5f] font-bold px-4 py-1.5 rounded-full text-sm mb-6">
                        Updated for {currentYear}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a5f] mb-6 leading-tight">
                        {service.title} Cost in <span className="text-[#d97706]">{location.city}, {location.state}</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Planning a project in {location.city}? Use our free calculator to see low, average, and high price ranges based on local {currentYear} market rates.
                    </p>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="py-12 px-4 bg-gray-50 relative">
                <div className="max-w-6xl mx-auto -mt-8 relative z-10">
                    <CostCalculator
                        serviceSlug={serviceSlug}
                        city={location.city}
                        config={costConfig}
                    />
                </div>
            </section>

            {/* Breakdown Section with Rich SEO Content */}
            <section className="py-20 px-4 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4 text-center">Typical Price Ranges in {location.city}</h2>
                <p className="text-center text-gray-500 mb-12">Based on typical home sizes and material choices</p>

                <PriceTierCards
                    serviceName={service.title}
                    low={baseCost.low * 20}
                    high={baseCost.high * 20}
                />

                <div className="my-16">
                    <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">4 Major Factors affecting {service.title} Costs in {location.city}</h3>
                    <div className="grid md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-[#d97706] mb-2">1. Roof Slope & Complexity</h4>
                            <p>The steeper the roof, the higher the labor cost due to safety requirements. A simple walkable roof in {location.city} is significantly cheaper to service than a multi-story home with complex hips and valleys.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-[#d97706] mb-2">2. Material Selection</h4>
                            <p>Materials make up 40-50% of the total quote. While asphalt shingles are budget-friendly, tile and metal roofs common in Arizona cost 2-3x more upfront but offer decades of extra durability against the sun.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-[#d97706] mb-2">3. Accessibility</h4>
                            <p>If your home in {location.city} is difficult to access (e.g., tight clearances, narrow streets), materials may need to be hand-carried or craned, adding time and equipment fees to the project.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-[#d97706] mb-2">4. Tears-off & Disposal</h4>
                            <p>If you have multiple layers of old roofing (common in older Arizona homes), city codes require complete removal ("tear-off") before new installation. Disposal fees in {location.state} vary by weight.</p>
                        </div>
                    </div>
                </div>

                <ImpactFactors />

                <div className="mt-16 bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                    <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Arizona Climate Note: Why Quality Matters</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        In {location.city}, your roof faces extreme UV radiation, monsoon storms, and rapid thermal expansion (hot days, cool nights).
                        A "cheap" quote often cuts corners on <strong>underlayment</strong>—the most critical waterproofing layer.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        At <strong>Dolimiti Steel Roofing</strong>, we use only synthetic underlayment and high-grade sealants rated for desert conditions, ensuring your {service.title.toLowerCase()} investment lasts 25+ years, not just 5.
                    </p>
                </div>
            </section>

            {/* Trust Section */}
            <section className="bg-[#1e3a5f] text-white py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Why Trust Our Estimates?</h2>
                        <p className="text-lg opacity-90 leading-relaxed mb-8">
                            At Dolimiti Steel Roofing, we value transparency. While many contractors hide their pricing, we believe you should know what to expect before you even make a call.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-center">
                                <span className="text-[#d97706] text-xl">✓</span> Licensed & Bonded in {location.state}
                            </li>
                            <li className="flex gap-3 items-center">
                                <span className="text-[#d97706] text-xl">✓</span> No hidden "trip charges"
                            </li>
                            <li className="flex gap-3 items-center">
                                <span className="text-[#d97706] text-xl">✓</span> 20+ Years Local Experience
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
                        <h3 className="text-xl font-bold mb-4">Ready for an Exact Numbers?</h3>
                        <p className="mb-6 opacity-80">
                            Online calculators are great for planning, but every roof is unique. Get a penny-perfect quote that is good for 30 days.
                        </p>
                        <a href={`tel:${siteConfig.phoneClean}`} className="block w-full bg-[#d97706] hover:bg-[#b45309] text-white text-center font-bold py-4 rounded-xl shadow-lg transition">
                            Call {siteConfig.phone}
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-[#1e3a5f] mb-12 text-center">Common Questions regarding {service.title} cost</h2>
                <div className="space-y-4">
                    <details className="group bg-white rounded-xl border border-gray-200 shadow-sm">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-bold text-[#1e3a5f] text-lg">
                            Is financing available for {service.title}?
                            <span className="text-[#d97706] group-open:rotate-180 transition">+</span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            Yes, we offer multiple financing options including low-interest monthly payment plans to help make your project affordable.
                        </div>
                    </details>
                    <details className="group bg-white rounded-xl border border-gray-200 shadow-sm">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-bold text-[#1e3a5f] text-lg">
                            Does insurance cover {service.title}?
                            <span className="text-[#d97706] group-open:rotate-180 transition">+</span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            If the damage is caused by a covered peril (like storm, wind, or hail), insurance typically covers the cost minus your deductible. We can assist with the claim process.
                        </div>
                    </details>
                    <details className="group bg-white rounded-xl border border-gray-200 shadow-sm">
                        <summary className="flex justify-between items-center cursor-pointer p-6 font-bold text-[#1e3a5f] text-lg">
                            Do I need a permit in {location.city}?
                            <span className="text-[#d97706] group-open:rotate-180 transition">+</span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            Most structural roofing work in {location.city} does require a permit. We handle all city permitting and inspections as part of our full service.
                        </div>
                    </details>
                </div>
            </section>

            {/* Nearby Cities Links */}
            <section className="py-12 px-4 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-6">Serving All of {location.state}</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                        {getAllLocations()
                            .filter(l => l.state === location.state)
                            .slice(0, 24)
                            .map(l => {
                                const href = (isThisCitySubdomain && l.id === cityState)
                                    ? `/${serviceSlug}/cost-calculator`
                                    : `https://${l.id}.${domain}/${serviceSlug}/cost-calculator`;
                                return (
                                    <Link
                                        key={l.id}
                                        href={href}
                                        className="hover:text-[#d97706] hover:underline transition"
                                    >
                                        {l.name} {service.title} Cost
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            </section>

            <Footer location={{ name: location.city, state: location.state }} />
            <FloatingCTA phone={siteConfig.phone} locationName={location.city} />
        </div>
    );
}
