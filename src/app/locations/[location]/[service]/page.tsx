import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import servicesData from '@/data/services.json';
import imagesData from '@/data/images.json';
import FloatingCTA from '@/components/FloatingCTA';
import { getLocationById, getLocationZipCodes, getNearbyLocations, getExtendedServiceContent, replacePlaceholders } from '@/utils/content';
import { buildDynamicHeroHeader, buildDynamicHeroSubtextLines, buildHeroSubtext, buildIntroContent } from '@/lib/heroSubtext';
import type { Metadata } from 'next';
import LocationServiceGrid from '@/components/LocationServiceGrid';
import LocationTestimonials from '@/components/LocationTestimonials';
import LocationFAQ from '@/components/LocationFAQ';
import NearbyAreasSection from '@/components/NearbyAreasSection';

interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  heroTitle?: string;
  heroSubtitle?: string;
  features?: string[];
  faqs?: Array<{ question: string; answer: string; }>;
  relatedServices?: string[];
  [key: string]: unknown;
}

interface ServicePageProps {
  params: Promise<{
    location: string;
    service: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { location: locationId, service: serviceSlug } = await params;

  const location = getLocationById(locationId);
  const serviceInfo = (servicesData as unknown as { services: ServiceItem[] }).services.find((s) => s.slug === serviceSlug);

  if (!location || !serviceInfo) {
    return {
      title: 'Service Not Found | Bennett Construction & Roofing',
      description: 'The requested service page could not be found.'
    };
  }

  const { getLocationServiceSEOFromFile } = await import('@/lib/seo-server');
  const zipCodes = getLocationZipCodes({ ...location, zipCodes: location.zipCodes || [] });
  const seo = getLocationServiceSEOFromFile(
    location.name,
    location.state,
    serviceInfo.title,
    serviceSlug,
    location.id,
    zipCodes
  );

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { location: locationId, service: serviceSlug } = await params;

  const location = getLocationById(locationId);
  const serviceInfo = (servicesData as unknown as { services: ServiceItem[] }).services.find((s) => s.slug === serviceSlug);

  if (!location || !serviceInfo) {
    notFound();
  }

  // Safe location object
  const safeLocation = {
    ...location,
    phone: location.phone || '(866) 289-1750',
    zipCodes: location.zipCodes || []
  };

  const replacements = {
    CITY: safeLocation.name,
    STATE: safeLocation.state,
    PHONE: safeLocation.phone,
    COMPANY_NAME: 'Bennett Construction & Roofing'
  };

  const extendedContent = getExtendedServiceContent(serviceSlug);

  // Helper to find image for service or fallback
  const getServiceImage = () => {
    const serviceImages = (imagesData.images.services as any);
    if (serviceImages[serviceSlug]) return serviceImages[serviceSlug];

    if (serviceInfo.category === 'exterior') return serviceImages['siding-installation'];
    if (serviceInfo.category === 'construction') return serviceImages['general-construction'];

    return serviceImages['roof-repair'];
  };
  const serviceHeroImage = getServiceImage();

  const heroSubtext = buildHeroSubtext({
    serviceKey: serviceSlug,
    serviceLabel: serviceInfo.title,
    city: safeLocation.name,
    state: safeLocation.state,
    phone: safeLocation.phone,
  });
  const zipCodes = getLocationZipCodes(safeLocation);
  const nearbyLocations = getNearbyLocations(safeLocation.id, safeLocation.state);
  const dynamicHeroHeader = buildDynamicHeroHeader({
    serviceLabel: serviceInfo.title,
    city: safeLocation.name,
    state: safeLocation.state,
    zipCodes,
    seed: serviceSlug,
  });
  const dynamicSubtextLines = buildDynamicHeroSubtextLines({
    serviceKey: serviceSlug,
    serviceLabel: serviceInfo.title,
    city: safeLocation.name,
    state: safeLocation.state,
    phone: safeLocation.phone,
    zipCodes: safeLocation.zipCodes,
  });
  const introContent = buildIntroContent({
    serviceKey: serviceSlug,
    serviceLabel: serviceInfo.title,
    city: safeLocation.name,
    state: safeLocation.state,
    phone: safeLocation.phone,
  });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative py-20 md:py-28 lg:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={serviceHeroImage.url}
            alt={serviceInfo.heroTitle || serviceInfo.title}
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.25)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 to-[#0f1f33]/70" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-4xl text-white">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-[#d97706] text-white text-xs font-bold px-3 py-1.5 rounded-full">Licensed & Insured</span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Top Rated in {safeLocation.name}</span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Free Estimates</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {dynamicHeroHeader}
              </h1>

              <div className="text-xl md:text-2xl opacity-95 mb-6 leading-relaxed space-y-2">
                <p>{dynamicSubtextLines.line1}</p>
                <p>{dynamicSubtextLines.line2}</p>
                <p>{dynamicSubtextLines.line3}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 rounded-lg text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {safeLocation.phone}
                </a>
                <a
                  href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-[#1e3a5f] font-bold px-8 py-4 rounded-lg text-lg transition shadow-lg"
                >
                  Get Free Estimate
                </a>
              </div>
              <div className="flex gap-6 text-sm font-medium opacity-90">
                <span className="flex items-center gap-2">✓ Licensed ROC</span>
                <span className="flex items-center gap-2">✓ Fully Insured</span>
                <span className="flex items-center gap-2">✓ A+ Rating</span>
              </div>
            </div>
          </div>
      </section>



      {/* Intro Section - Anti-Thin */}
      <section className="py-16 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-gray-700 mb-16 text-center">
            <h1 className="text-3xl font-bold text-[#1e3a5f] mb-6">{introContent.headline}</h1>
            {introContent.paragraphs.map((para, i) => (
              <p key={i} className={i === 0 ? "lead text-xl mb-6" : "text-lg mb-6"}>
                {para}
              </p>
            ))}
          </div>

          {/* SECTION 2: WHAT OUR SERVICE INCLUDES */}
          {extendedContent && (
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-8 text-center">
                {replacePlaceholders(extendedContent.includes.title, replacements)}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {extendedContent.includes.items.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[#d97706] text-xl mr-4 mt-1 font-bold">✓</span>
                    <span className="font-medium text-gray-800">{replacePlaceholders(item, replacements)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: MATERIAL OPTIONS */}
          {extendedContent && extendedContent.materials && (
            <div className="mb-20 bg-[#1e3a5f]/5 p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">
                {replacePlaceholders(extendedContent.materials.title, replacements)}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {extendedContent.materials.items.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{replacePlaceholders(item.name, replacements)}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {replacePlaceholders(item.description, replacements)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Service Grid (Section for SEO connectivity) */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-12">Complete Exterior Solutions in {safeLocation.name}</h2>
            <LocationServiceGrid
              locationId={safeLocation.id}
              locationName={safeLocation.name}
              stateName={safeLocation.state}
              phone={safeLocation.phone}
            />
          </div>

          {/* SECTION 4: WHY CHOOSE US FOR [SERVICE] */}
          {extendedContent && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">
                {replacePlaceholders(extendedContent.whyChooseUs.title, replacements)}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {extendedContent.whyChooseUs.items.map((item: string, idx: number) => (
                  <div key={idx} className="relative group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-50/50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 -z-0 group-hover:bg-orange-50 transition-colors duration-500" />

                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg shadow-blue-900/30 group-hover:bg-[#d97706] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {idx + 1}
                      </div>
                      <p className="text-xl text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                        {replacePlaceholders(item, replacements)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: SERVICE PROCESS */}
          {extendedContent && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-12 text-center">
                {replacePlaceholders(extendedContent.process.title, replacements)}
              </h2>
              <div className="space-y-8 max-w-3xl mx-auto">
                {extendedContent.process.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-6 relative">
                    {idx < extendedContent.process.items.length - 1 && (
                      <div className="absolute left-[23px] top-[50px] bottom-[-30px] w-0.5 bg-gray-200" />
                    )}
                    <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold shrink-0 z-10">
                      {idx + 1}
                    </div>
                    <div className="pb-8">
                      <h4 className="text-xl font-bold text-[#1e3a5f] mb-2">{replacePlaceholders(item.step, replacements)}</h4>
                      <p className="text-gray-600">{replacePlaceholders(item.description, replacements)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: SIGNS YOU NEED SERVICE */}
          {extendedContent && (
            <div className="mb-20 bg-orange-50 border border-orange-200 p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6 text-center">
                {replacePlaceholders(extendedContent.signs.title, replacements)}
              </h2>
              <p className="text-center text-lg text-gray-700 mb-8">
                {replacePlaceholders(extendedContent.signs.intro, replacements)}
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {extendedContent.signs.items.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-red-500 font-bold">⚠️</span>
                    <span className="text-gray-700 font-medium">{replacePlaceholders(item, replacements)}</span>
                  </div>
                ))}
              </div>
              <p className="text-center font-bold text-[#1e3a5f] text-xl">
                {replacePlaceholders(extendedContent.signs.outro, replacements)}
              </p>
            </div>
          )}

          {/* Testimonials & FAQs (Localized) */}
          <LocationTestimonials
            locationName={safeLocation.name}
            stateName={safeLocation.state}
            phone={safeLocation.phone}
          />

          {/* SECTION 9: MINI FAQ (Service-Specific) */}
          {extendedContent && extendedContent.faqs && extendedContent.faqs.items && extendedContent.faqs.items.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">
                {replacePlaceholders(extendedContent.faqs.title, replacements)}
              </h2>
              <div className="space-y-6 max-w-3xl mx-auto">
                {extendedContent.faqs.items.map((faq: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-[#1e3a5f] mb-3">{replacePlaceholders(faq.question, replacements)}</h3>
                    <p className="text-gray-600 leading-relaxed">{replacePlaceholders(faq.answer, replacements)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard Dynamic FAQ for the city */}
          <div className="mt-20">
            <LocationFAQ
              locationName={safeLocation.name}
              stateName={safeLocation.state}
              phone={safeLocation.phone}
            />
          </div>
        </div>
      </section >

      {/* SECTION 7: SERVICE AREA & Related Services */}
      {
        serviceInfo.relatedServices && serviceInfo.relatedServices.length > 0 && (
          <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">
                  More Services in {safeLocation.name}
                </h2>
                <p className="text-gray-600">Expert exterior care for every part of your home.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {serviceInfo.relatedServices.map((slug: string) => {
                  const relatedService = (servicesData as unknown as { services: ServiceItem[] }).services.find(s => s.slug === slug);
                  if (!relatedService) return null;

                  const serviceImage = imagesData.images.services[slug as keyof typeof imagesData.images.services];

                  return (
                    <Link key={slug} href={`/${slug}`} className="block group h-full">
                      <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                        {serviceImage?.url ? (
                          <Image
                            src={serviceImage.url}
                            alt={serviceImage.alt || relatedService.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/90 via-[#1e3a5f]/40 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{relatedService.icon}</span>
                            <h3 className="text-xl font-bold text-white">{relatedService.title}</h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )
      }

      <NearbyAreasSection
        nearbyLocations={nearbyLocations}
        currentLocationName={safeLocation.name}
        state={safeLocation.state}
      />

      {/* SECTION 8: CTA (Bottom Conversion) */}
      <section className="bg-[#d97706] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {extendedContent
              ? replacePlaceholders(extendedContent.hero.title.replace('Professional', 'Get a'), replacements)
              : `Need ${serviceInfo.title} in ${safeLocation.name}?`}
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Protect your home or business with a professionally installed {serviceInfo.title.toLowerCase()}. Expert service since 2000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
              className="bg-white text-[#d97706] font-bold px-10 py-5 rounded-xl text-2xl hover:bg-gray-50 transition shadow-xl flex items-center gap-4 transform hover:scale-105 duration-300"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call {safeLocation.phone}
            </a>
            <Link
              href="/contact"
              className="text-white border-2 border-white/40 hover:border-white font-bold px-10 py-5 rounded-xl text-xl transition"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">Planning a Budget?</h3>
          <p className="text-gray-600 mb-8">Get a detailed cost estimate for {serviceInfo.title} in {safeLocation.name} with our interactive calculator.</p>
          <Link
            href={`/${safeLocation.id}/${serviceSlug}/cost-calculator`}
            className="inline-flex items-center font-bold text-[#d97706] hover:text-[#b45309] text-lg hover:underline transition"
          >
            Calculate {serviceInfo.title} Cost in {safeLocation.name} →
          </Link>
        </div>
      </section>

      <Footer location={{ name: safeLocation.name, state: safeLocation.state }} />
      <FloatingCTA phone={safeLocation.phone.replace(/\D/g, '')} locationName={safeLocation.name} />
    </div >
  );
}
