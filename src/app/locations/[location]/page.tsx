import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLocationById, getLocationZipCodes, getNearbyLocations } from '@/utils/content';
import { buildDynamicHeroHeader, buildLocationPageHeroSubtext } from '@/lib/heroSubtext';
import locationsData from '@/data/locations.json';
import siteConfig from '@/data/site.config.json';
import imagesData from '@/data/images.json';
import servicesData from '@/data/services.json';
import contentData from '@/data/content.json';
import FloatingCTA from '@/components/FloatingCTA';
import LocationServiceGrid from '@/components/LocationServiceGrid';
import LocationTestimonials from '@/components/LocationTestimonials';
import LocationFAQ from '@/components/LocationFAQ';
import NearbyAreasSection from '@/components/NearbyAreasSection';
import type { Metadata } from 'next';

function replaceLocationPlaceholders(text: string, city: string, state: string, phone: string): string {
  return text
    .replace(/\{CITY\}/g, city)
    .replace(/\{STATE\}/g, state)
    .replace(/\{PHONE\}/g, phone);
}

interface LocationPageProps {
  params: Promise<{
    location: string;
  }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    return {
      title: 'Roofing & Construction | Dolimiti Steel Roofing',
      description: 'Professional roofing contractor. Licensed, experienced, and affordable.'
    };
  }

  const { getLocationSEOFromFile } = await import('@/lib/seo-server');
  const zipCodes = getLocationZipCodes(location);
  const seo = getLocationSEOFromFile(location.name, location.state, location.id, zipCodes);

  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, type: 'website' },
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    notFound();
  }

  // Safe Fallback Data
  const safeLocation = {
    ...location,
    areas: location.areas || [],
    services: location.services || [],
    phone: location.phone || siteConfig.phone,
    zipCodes: location.zipCodes || []
  };

  const zipCodes = getLocationZipCodes(safeLocation);
  const nearbyLocations = getNearbyLocations(safeLocation.id, safeLocation.state);
  const dynamicHeroHeader = buildDynamicHeroHeader({
    serviceLabel: 'Roofing Contractor',
    city: safeLocation.name,
    state: safeLocation.state,
    zipCodes,
    seed: 'location',
  });
  const dynamicSubtextLines = buildLocationPageHeroSubtext({
    city: safeLocation.name,
    state: safeLocation.state,
    pageType: 'location',
    zipCodes: safeLocation.zipCodes,
  });

  const city = safeLocation.name;
  const state = safeLocation.state;
  const phone = safeLocation.phone;
  const phoneClean = phone.replace(/\D/g, '');

  const loc = contentData.locationPages;
  const r = (text: string) => replaceLocationPlaceholders(text, city, state, phone);

  const heroBadges = loc.hero?.badges ?? [
    { icon: '✓', text: 'Licensed & Insured' },
    { icon: '⭐', text: 'Top Rated Service' },
    { icon: '🏆', text: 'Metal Roofing Specialists' }
  ];

  const whyChooseUs = loc.whyChooseUs ?? {} as any;
  const processData = (loc as any).process ?? { title: 'Our {CITY} Roofing Process', subtitle: 'Simple, transparent, and stress-free.', steps: [] };
  const ctaData = loc.cta ?? {} as any;
  const locServices = (loc as any).servicesSection ?? { title: 'Complete Roofing Services in {CITY}', serviceCount: 6 };
  const allServices = (Object.values((servicesData as any).servicesByCategory || {}).flat() as any[]);

  return (
    <div className="bg-white font-sans text-gray-900">
      <Header />

      {/* HERO SECTION */}
      <section className="relative py-24 px-4 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={imagesData.images.hero.locations.url}
            alt={`Roofing Contractor in ${city}, ${state}`}
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.35)' }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-white max-w-4xl pb-16">
            <div className="flex flex-wrap gap-3 mb-6">
              {heroBadges.map((badge: any, i: number) => (
                <span key={i} className={`${i === 0 ? 'bg-[#d97706]' : 'bg-white/20 backdrop-blur-sm'} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                  {r(badge.text)}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {dynamicHeroHeader.split(' in ')[0]} <span className="text-[#d97706]">in {dynamicHeroHeader.split(' in ')[1]}</span>
            </h1>
            <div className="text-xl opacity-90 mb-8 leading-relaxed font-light text-gray-100 space-y-2">
              <p>{dynamicSubtextLines.line1}</p>
              <p>{dynamicSubtextLines.line2}</p>
              <p>{dynamicSubtextLines.line3}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${phoneClean}`}
                className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                {phone}
              </a>
              <a
                href="#services"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition backdrop-blur-sm flex items-center justify-center"
              >
                Our Services
              </a>
            </div>

            {loc.hero?.benefits && (
              <div className="mt-8 flex gap-6 text-sm font-medium opacity-90">
                {loc.hero.benefits.slice(0, 3).map((b: any, i: number) => (
                  <span key={i} className="flex items-center gap-2">✓ {r(b.title)}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INTRO: WHY CHOOSE US */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-8 text-center">
              {r(whyChooseUs.titleTemplate || `Why {CITY} Homeowners Choose Dolimiti Steel Roofing`)}
            </h2>

            {whyChooseUs.introTemplate && (
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {r(whyChooseUs.introTemplate)}
              </p>
            )}

            {(whyChooseUs.paragraphs || []).map((paragraph: string, i: number) => (
              <p key={i} className="text-lg text-gray-700 leading-relaxed mb-6">
                {r(paragraph)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Service Grid */}
      <LocationServiceGrid
        locationId={safeLocation.id}
        locationName={city}
        stateName={state}
        phone={phone}
      />

      {/* FULL SERVICES LIST */}
      <section id="services" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-12">
          {r(locServices.title)}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {allServices.slice(0, locServices.serviceCount || 6).map((service: any) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100 p-6 flex items-start gap-4"
            >
              <span className="text-3xl bg-gray-50 p-3 rounded-lg group-hover:bg-orange-50 transition">{service.icon}</span>
              <div>
                <h3 className="font-bold text-[#1e3a5f] group-hover:text-[#d97706] transition">{service.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1e3a5f]">{r(processData.title)}</h2>
            <p className="text-gray-600 mt-4">{r(processData.subtitle)}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
            {(processData.steps || []).map((step: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center relative">
                <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-gray-50">
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg text-[#1e3a5f] mb-2">{r(step.title)}</h3>
                <p className="text-gray-600 text-sm">{r(step.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LocationTestimonials
        locationName={city}
        stateName={state}
        phone={phone}
      />

      <LocationFAQ
        locationName={city}
        stateName={state}
        phone={phone}
      />

      <NearbyAreasSection
        nearbyLocations={nearbyLocations}
        currentLocationName={city}
        state={state}
      />

      {/* CTA */}
      <section className="bg-[#d97706] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {r(ctaData.titleTemplate || `Get Your Free {CITY} Roofing Quote`)}
          </h2>
          <p className="text-xl opacity-90 mb-10">
            {r(ctaData.subtitleTemplate || `Speak directly with a project manager in {CITY}, not a call center.`)}
          </p>
          <a
            href={`tel:${phoneClean}`}
            className="inline-flex items-center bg-white text-[#d97706] font-bold px-10 py-5 rounded-full text-xl hover:bg-gray-100 transition shadow-xl"
          >
            {r(ctaData.primaryButton || `Call {PHONE}`)}
          </a>
        </div>
      </section>

      <Footer location={{ name: city, state }} />
      <FloatingCTA phone={phoneClean} locationName={city} />
    </div>
  );
}