import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import NearbyAreasSection from '@/components/NearbyAreasSection';
import locationsData from '@/data/locations.json';
import { getLocationById, getLocationZipCodes, getNearbyLocations } from '@/utils/content';
import { buildDynamicHeroHeader, buildLocationPageHeroSubtext } from '@/lib/heroSubtext';
import siteConfig from '@/data/site.config.json';
import contentData from '@/data/content.json';

interface LocationPageProps {
  params: Promise<{ location: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    return {
      title: `About Us | ${siteConfig.companyName}`,
      description: 'Learn about our expert team. We provide reliable, affordable construction and roofing services.'
    };
  }

  return {
    title: `About ${siteConfig.companyName} in ${location.name} | Trusted Local Experts`,
    description: `Learn about our expert team in ${location.name}. We provide reliable, affordable roofing and construction services. Licensed & Insured.`,
    keywords: [
      `about roofer ${location.name}`,
      `roofing company ${location.name}`,
      `local roofer ${location.name}`,
    ],
    openGraph: {
      title: `About ${siteConfig.companyName} in ${location.name}`,
      description: `Learn about our expert team in ${location.name}. Trusted roofing and construction services.`,
      type: 'website',
      locale: 'en_US',
      siteName: siteConfig.companyName
    },
    twitter: {
      card: 'summary_large_image',
      title: `About ${siteConfig.companyName} in ${location.name}`,
      description: `Learn about our expert team in ${location.name}. Trusted roofing and construction services.`
    },
    alternates: {
      canonical: `https://${location.id}.${siteConfig.domain}/about`
    }
  };
}

export default async function AboutPage({ params }: LocationPageProps) {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    notFound();
  }

  // Safe location object
  const safeLocation = {
    ...location,
    phone: location.phone || siteConfig.phone,
    zipCodes: location.zipCodes || []
  };

  function rp(s: string) { return s.replace(/{CITY}/g, safeLocation.name).replace(/{STATE}/g, safeLocation.state).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone); }

  const zipCodes = getLocationZipCodes(safeLocation);
  const nearbyLocations = getNearbyLocations(safeLocation.id, safeLocation.state);
  const dynamicHeroHeader = buildDynamicHeroHeader({
    serviceLabel: 'Roofing Contractor',
    city: safeLocation.name,
    state: safeLocation.state,
    zipCodes,
    seed: 'about',
  });
  const dynamicSubtextLines = buildLocationPageHeroSubtext({
    city: safeLocation.name,
    state: safeLocation.state,
    pageType: 'about',
    zipCodes: safeLocation.zipCodes,
  });

  const aboutData = contentData.locationPages.about;
  const teamMembers = aboutData.team.members;
  const values = aboutData.values.items;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-32 px-4 overflow-hidden bg-gradient-to-r from-[#4a2c17] to-[#2d1a0e]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a2c17] via-[#6b3d22] to-[#2d1a0e] opacity-90" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl text-white">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-[#c4841d] text-white text-xs font-bold px-3 py-1.5 rounded-full">Licensed & Insured</span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Top Rated in {safeLocation.name}</span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Free Estimates</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {dynamicHeroHeader}
              </h1>
              <div className="text-xl md:text-2xl opacity-95 leading-relaxed mb-8 space-y-2">
                <p>{dynamicSubtextLines.line1}</p>
                <p>{dynamicSubtextLines.line2}</p>
                <p>{dynamicSubtextLines.line3}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
                  className="bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg inline-flex items-center gap-3 transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call {safeLocation.phone}
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

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutData.stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-[#4a2c17]">{stat.value}</div>
                  <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{aboutData.sectionTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {rp(aboutData.sectionSubtitle)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-[#4a2c17] mb-6">{rp(aboutData.storyTitle)}</h3>
                  <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                    {aboutData.storyParagraphs.map((paragraph, index) => (
                      <p key={index}>{rp(paragraph)}</p>
                    ))}
                  </div>
                </div>
                <div className="relative h-full min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a2c17] to-[#6b3d22] rounded-2xl flex items-center justify-center text-white">
                    <div className="text-center p-8">
                      <span className="text-6xl mb-4 block">🏗️</span>
                      <h4 className="text-2xl font-bold">Building Dreams in {safeLocation.name}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {rp(aboutData.trackRecord.title)}
            </h2>
            <p className="text-xl text-gray-600">
              {rp(aboutData.trackRecord.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {aboutData.trackRecord.items.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-amber-900 mb-2">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {aboutData.team.title}
            </h2>
            <p className="text-xl text-gray-600">
              {rp(aboutData.team.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍🔧</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-amber-900 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.experience} Experience</p>
                <div className="space-y-1">
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className="inline-block bg-amber-100 text-amber-950 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {aboutData.values.title}
            </h2>
            <p className="text-xl text-gray-600">
              {rp(aboutData.values.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <NearbyAreasSection
        nearbyLocations={nearbyLocations}
        currentLocationName={location.name}
        state={location.state}
      />

      {/* Service Areas */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {rp(aboutData.cta.title)}
            </h2>
            <p className="text-xl text-gray-600">
              {rp(aboutData.cta.subtitle)}
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {rp(aboutData.cta.bodyTitle)}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {rp(aboutData.cta.bodyText)}
            </p>
            <a
              href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
              className="bg-[#c4841d] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#8b5e14] transition inline-block"
            >
              Call {safeLocation.phone}
            </a>
          </div>
        </div>
      </section>

      <Footer location={{ name: location.name, state: location.state }} />
      <FloatingCTA />
    </div>
  );
}
