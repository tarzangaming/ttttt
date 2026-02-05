import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LOCATIONS, getServiceCostConfig, getCityFromSlug } from '@/lib/cost-data';
import { getCostPageSEOFromFile } from '@/lib/seo-server';
import servicesData from '@/data/services.json';
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

export async function generateStaticParams() {
    const paths = [];
    for (const location of LOCATIONS) {
        for (const service of servicesData.services) {
            paths.push({
                cityState: location.slug,
                service: service.slug
            });
        }
    }
    // Limit to important ones for static build to save time if needed, but for now exhaustive is fine
    return paths.slice(0, 50); // Optimization for dev build speed
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { cityState, service: serviceSlug } = await params;
    const location = getCityFromSlug(cityState);
    const service = servicesData.services.find(s => s.slug === serviceSlug);

    if (!location || !service) return {};

    const seo = getCostPageSEOFromFile(
        location.city,
        location.state,
        cityState,
        service.title,
        serviceSlug
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
    const service = servicesData.services.find(s => s.slug === serviceSlug);

    if (!location || !service) {
        notFound();
    }

    const costConfig = getServiceCostConfig(serviceSlug);
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

            {/* Breakdown Section */}
            <section className="py-20 px-4 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4 text-center">Typical Price Ranges in {location.city}</h2>
                <p className="text-center text-gray-500 mb-12">Based on typical home sizes and material choices</p>

                {/* Static Tiers based on data config */}
                <PriceTierCards
                    serviceName={service.title}
                    low={costConfig.baseCostPerSq.low * 20} // Assuming 20sq default
                    high={costConfig.baseCostPerSq.high * 20}
                />

                <ImpactFactors />
            </section>

            {/* Trust Section */}
            <section className="bg-[#1e3a5f] text-white py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Why Trust Our Estimates?</h2>
                        <p className="text-lg opacity-90 leading-relaxed mb-8">
                            At Bennett Construction, we value transparency. While many contractors hide their pricing, we believe you should know what to expect before you even make a call.
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
                        <a href="tel:8662891750" className="block w-full bg-[#d97706] hover:bg-[#b45309] text-white text-center font-bold py-4 rounded-xl shadow-lg transition">
                            Call (866) 289-1750
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
                        {LOCATIONS.map(l => (
                            <Link
                                key={l.slug}
                                href={`/${l.slug}/${serviceSlug}/cost`}
                                className="hover:text-[#d97706] hover:underline transition"
                            >
                                {l.city} {service.title} Cost
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer location={{ name: location.city, state: location.state }} />
            <FloatingCTA phone="(866) 289-1750" locationName={location.city} />
        </div>
    );
}
