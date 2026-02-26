import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLocationById, getLocationZipCodes, getNearbyLocations } from '@/utils/content';
import { buildDynamicHeroHeader, buildLocationPageHeroSubtext } from '@/lib/heroSubtext';
import locationsData from '@/data/locations.json';
import imagesData from '@/data/images.json';
import servicesData from '@/data/services.json';
import FloatingCTA from '@/components/FloatingCTA';
import LocationServiceGrid from '@/components/LocationServiceGrid';
import LocationTestimonials from '@/components/LocationTestimonials';
import LocationFAQ from '@/components/LocationFAQ';
import NearbyAreasSection from '@/components/NearbyAreasSection';
import type { Metadata } from 'next';

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
      title: 'Roofing & Construction | Dolomiti Steel Roofing',
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
    phone: location.phone || '(866) 289-1750',
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
  const phoneClean = safeLocation.phone.replace(/\D/g, '');

  return (
    <div className="bg-white font-sans text-gray-900">
      <Header />

      {/* 1. HERO SECTION (H1: Roofing Contractor in [City], AZ) */}
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
              <span className="bg-[#d97706] text-white text-xs font-bold px-3 py-1.5 rounded-full">Licensed & Insured</span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Top Rated in {city}</span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Free Estimates</span>
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
                {safeLocation.phone}
              </a>
              <a
                href="#services"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition backdrop-blur-sm flex items-center justify-center"
              >
                Our Services
              </a>
            </div>

            <div className="mt-8 flex gap-6 text-sm font-medium opacity-90">
              <span className="flex items-center gap-2">✓ Licensed ROC</span>
              <span className="flex items-center gap-2">✓ Fully Insured</span>
              <span className="flex items-center gap-2">✓ A+ Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO: LOCAL AUTHORITY + CHALLENGES */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-8 text-center">
              Why {city} Homeowners Choose Dolomiti Steel Roofing
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Welcome to <span className="font-bold text-[#1e3a5f]">Dolomiti Steel Roofing</span>,
              your trusted local roofing and construction experts delivering durable, high-quality roofing
              solutions across <span className="font-semibold">{city}</span>. We believe
              a roof is more than just a structure—it&apos;s your home&apos;s first line of defense against weather,
              time, and wear. That&apos;s why we focus on building strong, long-lasting roofs designed to protect
              what matters most.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Homeowners and property managers across {city} trust us for our craftsmanship,
              professionalism, and attention to detail. We offer a full range of roofing
              services, including roof installation, roof replacement, roof repairs,
              inspections, and ongoing maintenance.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We offer a full range of roofing services, including roof installation, roof replacement,
              roof repairs, inspections, and ongoing maintenance. Whether it&apos;s a residential or commercial project,
              our experienced roofing professionals deliver on time, every time—without cutting corners.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At <span className="font-bold text-[#1e3a5f]">Dolomiti Steel Roofing</span>, we combine
              premium materials, proven techniques, and local expertise to provide roofing systems that are
              durable, energy-efficient, and visually appealing. From storm protection to long-term performance,
              your peace of mind is always our priority.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Choose <span className="font-bold text-[#1e3a5f]">Dolomiti Steel Roofing</span> for
              reliable roofing services in {city}—where quality craftsmanship
              meets dependable service.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Service Grid */}
      <LocationServiceGrid
        locationId={safeLocation.id}
        locationName={city}
        stateName={state}
        phone={safeLocation.phone}
      />


      {/* 5. FULL SERVICES LIST */}
      <section id="services" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-12">
          Complete Roofing Services in {city}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {(servicesData as any).services.slice(0, 6).map((service: any) => (
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

      {/* 6. OUR PROCESS */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1e3a5f]">Our {city} Roofing Process</h2>
            <p className="text-gray-600 mt-4">Simple, transparent, and stress-free.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
            {[
              { title: 'Inspection', desc: 'Detailed roof analysis' },
              { title: 'Quote', desc: 'Upfront pricing, no fees' },
              { title: 'Installation', desc: 'Fast, clean execution' },
              { title: 'Warranty', desc: 'Long-term protection' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center relative">
                <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-gray-50">
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg text-[#1e3a5f] mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LocationTestimonials
        locationName={city}
        stateName={state}
        phone={safeLocation.phone}
      />

      <LocationFAQ
        locationName={city}
        stateName={state}
        phone={safeLocation.phone}
      />

      <NearbyAreasSection
        nearbyLocations={nearbyLocations}
        currentLocationName={city}
        state={state}
      />

      {/* 8. CTA */}
      <section className="bg-[#d97706] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Get Your Free {city} Roofing Quote</h2>
          <p className="text-xl opacity-90 mb-10">
            Speak directly with a project manager in {city}, not a call center.
          </p>
          <a
            href={`tel:${phoneClean}`}
            className="inline-flex items-center bg-white text-[#d97706] font-bold px-10 py-5 rounded-full text-xl hover:bg-gray-100 transition shadow-xl"
          >
            Call {safeLocation.phone}
          </a>
        </div>
      </section>

      <Footer location={{ name: city, state }} />
      <FloatingCTA phone={phoneClean} locationName={city} />
    </div>
  );
}