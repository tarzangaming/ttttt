import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import NearbyAreasSection from '@/components/NearbyAreasSection';
import { getLocationById, getLocationZipCodes, getNearbyLocations } from '@/utils/content';
import { buildDynamicHeroHeader, buildLocationPageHeroSubtext } from '@/lib/heroSubtext';
import locationsData from '@/data/locations.json';
import servicesData from '@/data/services.json';
import imagesData from '@/data/images.json';

// Type definitions
interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

function getAllServicesFlat(): ServiceItem[] {
  const data = servicesData as any;
  if (data.servicesByCategory) {
    return Object.values(data.servicesByCategory).flat() as ServiceItem[];
  }
  if (data.services) return data.services;
  return [];
}

interface LocationPageProps {
  params: Promise<{ location: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    return {
      title: 'Construction Services | Dolimiti Steel Roofing',
      description: 'Professional construction and roofing services.'
    };
  }

  return {
    title: `Construction & Roofing Services in ${location.name} | Dolimiti Steel Roofing`,
    description: `Expert roofing, siding, and remodeling services in ${location.name}, ${location.state}. Residential and commercial solutions by Dolimiti Steel Roofing.`,
    alternates: {
      canonical: `https://${location.id}.dolimitisteelroofing.com/services`
    }
  };
}

export default async function ServicesPage({ params }: LocationPageProps) {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    notFound();
  }

  // Safe location object
  const safeLocation = {
    ...location,
    phone: location.phone || '(866) 289-1750',
    zipCodes: location.zipCodes || []
  };

  const zipCodes = getLocationZipCodes(safeLocation);
  const nearbyLocations = getNearbyLocations(safeLocation.id, safeLocation.state);
  const dynamicHeroHeader = buildDynamicHeroHeader({
    serviceLabel: 'Roofing Services',
    city: safeLocation.name,
    state: safeLocation.state,
    zipCodes,
    seed: 'services',
  });
  const dynamicSubtextLines = buildLocationPageHeroSubtext({
    city: safeLocation.name,
    state: safeLocation.state,
    pageType: 'services',
    zipCodes: safeLocation.zipCodes,
  });

  const allServices = getAllServicesFlat();

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imagesData.images.hero.services.url}
            alt="Dolimiti Steel Roofing Services"
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.4)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/80 to-[#0f1f33]/60" />
        <div className="relative max-w-5xl mx-auto text-center text-white z-10">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <span className="bg-[#d97706] text-white text-xs font-bold px-3 py-1.5 rounded-full">Licensed & Insured</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Top Rated in {safeLocation.name}</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Free Estimates</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {dynamicHeroHeader}
          </h1>
          <div className="text-xl opacity-90 max-w-3xl mx-auto mb-8 space-y-2">
            <p>{dynamicSubtextLines.line1}</p>
            <p>{dynamicSubtextLines.line2}</p>
            <p>{dynamicSubtextLines.line3}</p>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
              className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call {safeLocation.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mt-2 mb-4">
              Premium Construction Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From minor repairs to major renovations, we deliver excellence on every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service) => {
              const serviceImage = imagesData.images.services[service.slug as keyof typeof imagesData.images.services];

              return (
                <Link key={service.slug} href={`/${service.slug}`} className="block group h-full">
                  <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group">
                    {/* Background Image */}
                    {serviceImage?.url ? (
                      <Image
                        src={serviceImage.url}
                        alt={serviceImage.alt || service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33]" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/95 via-[#1e3a5f]/70 to-transparent group-hover:via-[#1e3a5f]/60 transition-all duration-500" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-3 mb-3 pl-1">
                          <span className="text-3xl filter drop-shadow-md">{service.icon}</span>
                          <h3 className="text-2xl font-bold text-white leading-tight">
                            {service.title}
                          </h3>
                        </div>

                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mb-4">
                          <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                            {service.description}
                          </p>
                        </div>

                        <div className="flex items-center text-[#d97706] font-bold tracking-wide text-sm uppercase group-hover:text-white transition-colors duration-300">
                          <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-[#d97706] transition-all duration-300">
                            Learn More →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <NearbyAreasSection
        nearbyLocations={nearbyLocations}
        currentLocationName={safeLocation.name}
        state={safeLocation.state}
      />

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={
              ((imagesData as any).images?.cta?.banner?.url as string | undefined) ||
              ((imagesData as any).images?.defaults?.placeholder?.url as string | undefined) ||
              ''
            }
            alt="Contact Dolimiti Steel Roofing"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.3)' }}
          />
        </div>
        <div className="absolute inset-0 bg-[#1e3a5f]/70" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project in {safeLocation.name}?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Contact us today for a free estimate on your next roofing or construction project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
              className="inline-flex items-center justify-center bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 rounded-lg text-lg transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call {safeLocation.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-[#1e3a5f] font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </section>

      <Footer location={{ name: location.name, state: location.state }} />
      <FloatingCTA />
    </div>
  );
}
