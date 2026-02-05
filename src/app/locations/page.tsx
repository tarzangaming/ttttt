import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLocationBySubdomain, getLocationUrl } from '@/utils/subdomain';
import LocationPageContent from '@/components/LocationPageContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { getAllLocations, getAllStates } from '@/utils/content';
import { getPageSEOFromFile } from '@/lib/seo-server';
import locationsData from '@/data/locations.json';
import imagesData from '@/data/images.json';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('locations');
  if (!seo) {
    return {
      title: 'Nationwide Roofing Contractor | Serving All 50 States | USA',
      description: "Bennett Construction & Roofing is America's premier licensed contractor.",
      alternates: { canonical: 'https://bennettconstructionandroofing.com/locations' },
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

export const dynamic = 'force-dynamic';

type LocationType = { id: string; name: string; state: string; areas?: string[] };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const city = params?.city?.toLowerCase();

  // Subdomain Logic: If accessed via city.domain.com
  if (city) {
    const location = getLocationBySubdomain(city);
    if (!location) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">City not found</h1>
            <p className="text-gray-600">The requested city &ldquo;{city}&rdquo; is not available.</p>
            <Link href="/locations" className="text-[#d97706] font-bold hover:underline mt-4 inline-block">View All Locations</Link>
          </div>
        </div>
      );
    }
    return <LocationPageContent location={location as any} />;
  }

  // STANDARD VIEW: NATIONWIDE USA HUB
  const allLocations = getAllLocations();

  // Featured locations from across the USA (mix of states)
  const featuredLocations = allLocations.slice(0, 12);
  const otherLocations = allLocations.slice(12);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imagesData.images.hero.locations.url}
            alt="USA Nationwide Roofing and Construction Services"
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.3)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/80 to-[#0f1f33]/60" />

        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <span className="inline-block bg-[#d97706] text-white font-bold px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-wider">
            Nationwide Service
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            America&apos;s Premier <span className="text-[#d97706]">Roofing Contractor</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
            From coast to coast, we protect American homes and businesses with quality craftsmanship. Serving all 50 states with trusted local teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18662891750"
              className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-5 rounded-xl text-lg transition shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" /></svg>
              (866) 289-1750
            </a>
            <Link
              href="#locations"
              className="bg-white text-[#1e3a5f] hover:bg-gray-100 font-bold px-8 py-5 rounded-xl text-lg transition shadow-xl block"
            >
              Find Your City
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED LOCATIONS GRID */}
      <section id="locations" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">Areas We Serve</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our crews are stationed throughout the country to ensure fast response times for emergency repairs, inspections, and installations.
          </p>
        </div>

        {/* STATES SERVED GRID */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-8 border-b pb-4">States We Serve</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {getAllStates().map((state) => (
              <Link
                key={state.slug}
                href={`/locations/${state.slug}`}
                className="px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 flex items-center justify-between group transition-all"
              >
                <span className="font-medium text-gray-700 group-hover:text-[#d97706] transition-colors text-sm truncate">{state.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {featuredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLocations.map((location) => (
              <Link
                key={location.id}
                href={getLocationUrl(location.id)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1 block h-full"
              >
                <div className="h-3 bg-[#d97706] group-hover:h-4 transition-all" />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-[#1e3a5f]">{location.name}</h3>
                    <span className="text-[#d97706] text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Professional roofing services for {location.name} and surrounding neighborhoods like {location.areas?.slice(0, 3).join(', ')}.
                  </p>
                  <span className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide group-hover:text-[#d97706] transition-colors">
                    View Local Services
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-xl shadow border border-gray-200">
            <p className="text-xl text-gray-600">
              Don&apos;t see your city listed? We serve communities nationwide.
              <br />
              <a href="tel:8662891750" className="text-[#d97706] font-bold hover:underline">Call us to confirm coverage in your area.</a>
            </p>
          </div>
        )}

        {/* Fallback for other locations if JSON has non-AZ */}
        {otherLocations.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-8 text-center">Other Locations Served</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherLocations.map(loc => (
                <Link
                  key={loc.id}
                  href={getLocationUrl(loc.id)}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow text-center text-gray-700 font-medium hover:text-[#d97706]"
                >
                  {loc.name}, {loc.state}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. NATIONWIDE VALUE PROP */}
      <section className="bg-[#1e3a5f] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Why America Chooses Bennett</h2>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                From desert heat to snow country, coastal humidity to Midwest storms—we know every climate. We don&apos;t just build roofs; we engineer defense systems for American homes nationwide.
              </p>
              <ul className="space-y-4 text-lg">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d97706] flex items-center justify-center font-bold">✓</div>
                  Licensed in All 50 States
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d97706] flex items-center justify-center font-bold">✓</div>
                  Climate-Specific Materials
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d97706] flex items-center justify-center font-bold">✓</div>
                  24/7 Storm Emergency Response
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-1 bg-gray-800">
              <Image
                src={imagesData.images.gallery.projects[0]?.url || imagesData.images.services['roof-replacement'].url}
                alt="USA Nationwide Roofing Project"
                fill
                className="object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-20 px-4 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6">Ready to Protect Your Property?</h2>
          <p className="text-gray-600 text-xl mb-10">
            Schedule a free inspection with your local Bennett Construction team. We are in your neighborhood.
          </p>
          <a
            href="tel:8662891750"
            className="inline-flex items-center bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-10 py-5 rounded-full text-xl transition shadow-xl"
          >
            Get My Free Estimate
          </a>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}