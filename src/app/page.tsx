import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { getMainContent } from '@/utils/content';
import { getPageSEOFromFile } from '@/lib/seo-server';
import servicesData from '@/data/services.json';
import locationsData from '@/data/locations.json';
import imagesData from '@/data/images.json';

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('home');
  if (!seo) {
    return {
      title: 'Premier Roofing & Construction Services | Nationwide Coverage',
      description: 'Dolimiti Steel Roofing provides expert residential and commercial roofing services across the USA. Licensed, bonded, and insured. Call for a free estimate.',
      alternates: { canonical: 'https://dolimitisteelroofing.com' },
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: { title: seo.title, description: seo.description, type: 'website' },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  };
}

export default function HomePage() {
  const content = getMainContent();
  const homepage = (content as any).homepage || {};
  const hero = homepage.hero || {};
  const features = homepage.features || [];
  const whyChooseUs = homepage.whyChooseUs || [];
  const coverage = homepage.coverage || {};
  const servicesSection = homepage.servicesSection || {};
  const whyChooseUsSectionTitle = homepage.whyChooseUsSectionTitle ?? 'The Dolimiti Advantage';
  const faqSection = homepage.faqSection || {};
  const ctaSection = homepage.ctaSection || {};
  const heroImage = imagesData.images?.hero?.home?.url ?? (imagesData as any).images?.defaults?.placeholder?.url ?? '';
  const recentProjects = (imagesData as any).images?.gallery?.projects?.slice(0, 6) ?? [];

  const servicesByCategory = (servicesData as any).servicesByCategory || {};
  const allServices: any[] = Object.values(servicesByCategory).flat();

  return (
    <div className="bg-white font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RoofingContractor",
            "name": "Dolimiti Steel Roofing",
            "url": "https://dolimitisteelroofing.com",
            "logo": "https://dolimitisteelroofing.com/logo.png",
            "description": "Licensed nationwide roofing contractor specializing in residential and commercial roofing.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "telephone": "(866) 289-1750",
            "priceRange": "$$",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            }
          })
        }}
      />

      <Header />

      {/* 1. HERO SECTION - NATIONAL */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="National Steel Roofing Services by Dolimiti Steel Roofing"
              fill
              priority
              className="object-cover object-top"
              style={{ filter: 'brightness(0.4)' }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#1e3a5f]" />
          )}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="md:max-w-3xl">
            <span className="inline-block bg-[#d97706] text-white font-bold px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-wider">
              {hero.badge || 'Serving Communities Nationwide'}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              {(() => {
                const t = hero.title || 'Quality Roofing You Can Trust';
                const match = t.match(/^(.+?)(\s+You Can Trust)$/);
                return match ? <><>{match[1]}</> <br /><span className="text-[#d97706]">{match[2].trim()}</span></> : t;
              })()}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed font-light">
              {hero.subtitle || 'From residential repairs to large-scale commercial projects, we deliver superior craftsmanship and materials across the country.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="tel:8662891750"
                className="group relative px-8 py-4 bg-[#d97706] text-white text-lg font-bold rounded-xl shadow-xl hover:bg-[#b45309] transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  Call (866) 289-1750
                </div>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <span className="text-[#d97706] text-xl">✓</span> Licensed & Insured
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#d97706] text-xl">✓</span> 25+ Years Experience
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#d97706] text-xl">✓</span> Nationwide Network
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">{servicesSection.title ?? 'Comprehensive Roofing Solutions'}</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            {servicesSection.subtitle ?? 'We provide specialized roofing systems tailored to your residential and commercial needs.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {allServices.slice(0, 9).map((service: any) => {
              const serviceImage =
                ((imagesData as any).images?.services?.[service.slug as string] as any) || null;
              return (
                <div key={service.slug} className="group relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <Link href={`/services/${service.slug}`} className="absolute inset-0 z-20" aria-label={`View ${service.title}`} />

                  {/* Background Image */}
                  {serviceImage?.url ? (
                    <Image
                      src={serviceImage.url}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f] via-[#1e3a5f]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl filter drop-shadow-lg">{service.icon}</span>
                        <h3 className="text-2xl font-bold shadow-black/10">{service.title}</h3>
                      </div>
                      <p className="text-gray-200 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 absolute bottom-0 transform translate-y-full group-hover:translate-y-0 relative">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center text-[#d97706] font-bold uppercase tracking-wider text-sm mt-2 group-hover:text-white transition-colors">
                        Learn More <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-[#1e3a5f] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0f1f33] transition shadow-lg text-lg"
            >
              {servicesSection.ctaText ?? 'View All Services'}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. NATIONAL COVERAGE */}
      <section className="py-20 bg-[#1e3a5f] text-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#d97706] font-bold uppercase tracking-wider text-sm">Where We Work</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6">{coverage.title || 'Serving Great Communities Across the USA'}</h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              {coverage.subtitle || 'Dolimiti Steel Roofing has established a reputation for reliability in multiple states. Our local teams understand the specific building codes and climate challenges of your region.'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Group locations by state for display */}
              {Array.from(new Set((locationsData as any).locations.map((l: any) => l.state))).slice(0, 2).map((stateCode: any) => {
                const stateLocations = (locationsData as any).locations.filter((l: any) => l.state === stateCode);
                // Map state code to full name if possible, else use code
                const stateName = stateLocations[0]?.fullName.split(', ')[1] || stateCode;

                return (
                  <div key={stateCode}>
                    <h4 className="font-bold text-lg mb-2 text-[#d97706]">{stateCode} Region</h4>
                    <ul className="space-y-1 text-sm opacity-80">
                      {stateLocations.slice(0, 4).map((loc: any) => (
                        <li key={loc.id}>{loc.name}</li>
                      ))}
                      {stateLocations.length > 4 && <li>+ {stateLocations.length - 4} more</li>}
                    </ul>
                  </div>
                );
              })}

              {/* Fallback for "Other Regions" if we have more than 2 states or just to show nationwide capability */}
              {(locationsData as any).locations.length > 0 && (
                <div>
                  <h4 className="font-bold text-lg mb-2 text-[#d97706]">Nationwide</h4>
                  <ul className="space-y-1 text-sm opacity-80">
                    <li>Commercial Projects</li>
                    <li>Select Residential</li>
                    <li>Travel Crews Available</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-8">
              <Link href="/locations" className="inline-block bg-white text-[#1e3a5f] font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                {coverage.ctaText ?? 'Find Your Local Office'}
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-x-3 border-4 border-[#d97706]">
            {(imagesData.images?.hero as any)?.locations?.url ? (
              <Image
                src={(imagesData.images?.hero as any).locations.url}
                alt="National Service Map"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#1e3a5f]" />
            )}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f]">{whyChooseUsSectionTitle}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {(whyChooseUs.length > 0 ? whyChooseUs : [
              { icon: "🛡️", title: "Licensed & Insured", desc: "Full coverage for your peace of mind." },
              { icon: "💰", title: "Fair Pricing", desc: "Transparent quotes with no hidden fees." },
              { icon: "👷", title: "Expert Crews", desc: "Highly trained, safety-certified installers." },
              { icon: "🤝", title: "5-Year Warranty", desc: "We stand behind our workmanship." }
            ]).map((item: any, i: number) => (
              <div key={i} className="text-center p-6 border border-gray-100 rounded-xl hover:shadow-lg transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-[#1e3a5f] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description || item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOMEPAGE FAQ SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-6">{faqSection.title ?? 'Frequently Asked Questions'}</h2>
            <p className="text-xl text-gray-600">{faqSection.subtitle ?? 'Common questions about our roofing and construction services.'}</p>
          </div>

          <div className="space-y-6">
            {((faqSection.items && faqSection.items.length > 0) ? faqSection.items : [
              { question: 'Do you service my area?', answer: 'We are a nationwide roofing contractor with local teams in major metropolitan areas across the US. From Texas to New York, Florida to Arizona, we likely have crews near you. Check our Locations page or call us to confirm.' },
              { question: 'Are you licensed and insured?', answer: 'Yes, absolutely. Dolimiti Steel Roofing carries all necessary state licenses and strictly maintains liability and workers\' compensation insurance to protect our clients and our crews.' },
              { question: 'Do you offer financing?', answer: 'Yes! We partner with top lending institutions to offer flexible financing options for roof replacements and major repairs, subject to credit approval.' },
              { question: 'What types of roofs do you install?', answer: 'We work with all major roofing systems including Asphalt Shingles, Metal (Standing Seam), Tile (Clay/Concrete), Flat Roofs (TPO/EPDM/Foam), and more.' },
              { question: 'Do you handle insurance claims?', answer: 'Yes. Our team is experienced in storm damage restoration and can assist you through the insurance claim process, ensuring all damage is documented and covered.' }
            ]).map((faq: { question?: string; answer?: string; q?: string; a?: string }, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{faq.question ?? faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer ?? faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA LANDSCAPE */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          {((imagesData as any).images?.cta?.banner?.url as string | undefined) ? (
            <Image
              src={((imagesData as any).images?.cta?.banner?.url as string) || ''}
              alt="Contact Us"
              fill
              className="object-cover"
              style={{ filter: 'brightness(0.25)' }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#1e3a5f]" />
          )}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">{ctaSection.title ?? 'Ready to Start Your Project?'}</h2>
          <p className="text-xl md:text-2xl opacity-90 mb-10">
            {ctaSection.subtitle ?? 'Contact us today for a free inspection and detailed estimate.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="tel:8662891750"
              className="bg-[#d97706] text-white font-bold px-10 py-5 rounded-xl text-xl hover:bg-[#b45309] transition shadow-2xl flex items-center justify-center gap-3"
            >
              {ctaSection.primaryButtonText ?? 'Call (866) 289-1750'}
            </a>
            <Link
              href="/contact"
              className="bg-white text-[#1e3a5f] font-bold px-10 py-5 rounded-xl text-xl hover:bg-gray-100 transition shadow-xl"
            >
              {ctaSection.secondaryButtonText ?? 'Request Online'}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
