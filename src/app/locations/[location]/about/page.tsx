import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import NearbyAreasSection from '@/components/NearbyAreasSection';
import locationsData from '@/data/locations.json';
import { getLocationById, getLocationZipCodes, getNearbyLocations } from '@/utils/content';
import { buildDynamicHeroHeader, buildLocationPageHeroSubtext } from '@/lib/heroSubtext';

interface LocationPageProps {
  params: Promise<{ location: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location: locationId } = await params;
  const location = getLocationById(locationId);

  if (!location) {
    return {
      title: 'About Us | Bennett Construction & Roofing',
      description: 'Learn about our expert team. We provide reliable, affordable construction and roofing services.'
    };
  }

  return {
    title: `About Bennett Construction & Roofing in ${location.name} | Trusted Local Experts`,
    description: `Learn about our expert team in ${location.name}. We provide reliable, affordable roofing and construction services. Licensed & Insured.`,
    keywords: [
      `about roofer ${location.name}`,
      `roofing company ${location.name}`,
      `local roofer ${location.name}`,
    ],
    openGraph: {
      title: `About Bennett Construction & Roofing in ${location.name}`,
      description: `Learn about our expert team in ${location.name}. Trusted roofing and construction services.`,
      type: 'website',
      locale: 'en_US',
      siteName: 'Bennett Construction & Roofing'
    },
    twitter: {
      card: 'summary_large_image',
      title: `About Bennett Construction & Roofing in ${location.name}`,
      description: `Learn about our expert team in ${location.name}. Trusted roofing and construction services.`
    },
    alternates: {
      canonical: `https://bennettconstructionandroofing.com/locations/${location.id}/about`
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
    seed: 'about',
  });
  const dynamicSubtextLines = buildLocationPageHeroSubtext({
    city: safeLocation.name,
    state: safeLocation.state,
    pageType: 'about',
    zipCodes: safeLocation.zipCodes,
  });

  const teamMembers = [
    {
      name: 'John Bennett',
      role: 'Founder & Lead Contractor',
      experience: '25+ years',
      specialties: ['Roofing Systems', 'Structural Design', 'Project Management']
    },
    {
      name: 'Michael Rodriguez',
      role: 'Senior Project Manager',
      experience: '18+ years',
      specialties: ['Commercial Roofing', 'Safety Compliance', 'Team Leadership']
    },
    {
      name: 'Sarah Thomas',
      role: 'Customer Success Manager',
      experience: '12+ years',
      specialties: ['Client Relations', 'Project Coordination', 'Warranty Services']
    }
  ];

  const values = [
    {
      title: 'Quality Craftsmanship',
      description: 'We take pride in delivering high-quality work that stands the test of time.',
      icon: '🔨'
    },
    {
      title: 'Customer Satisfaction',
      description: 'Your satisfaction is our top priority. We go above and beyond to exceed your expectations.',
      icon: '😊'
    },
    {
      title: 'Reliability',
      description: 'Count on us to be there when you need us most, with prompt and dependable service.',
      icon: '⏰'
    },
    {
      title: 'Integrity',
      description: 'We provide honest, upfront pricing with no hidden fees or surprise charges.',
      icon: '🤝'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-32 px-4 overflow-hidden bg-gradient-to-r from-[#1e3a5f] to-[#0f1f33]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8a] to-[#0f1f33] opacity-90" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl text-white">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-[#d97706] text-white text-xs font-bold px-3 py-1.5 rounded-full">Licensed & Insured</span>
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
                  className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg inline-flex items-center gap-3 transform hover:-translate-y-1"
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
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#1e3a5f]">25+</div>
                <div className="text-sm md:text-base text-gray-600">Years of Experience</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#1e3a5f]">50+</div>
                <div className="text-sm md:text-base text-gray-600">Expert Contractors</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#1e3a5f]">10k+</div>
                <div className="text-sm md:text-base text-gray-600">Happy Customers</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#1e3a5f]">100%</div>
                <div className="text-sm md:text-base text-gray-600">Satisfaction Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the journey that made us the most trusted name in roofing and construction in {safeLocation.name}
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-[#1e3a5f] mb-6">Excellence in {safeLocation.name}, {safeLocation.state}</h3>
                  <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                    <p>
                      Bennett Construction & Roofing began with a simple mission: to provide honest, reliable roofing and construction services in {safeLocation.name} and surrounding areas. What started as a small operation has grown into one of the most trusted names in the industry throughout {safeLocation.state}.
                    </p>
                    <p>
                      Over the years, we&apos;ve witnessed the evolution of construction technology and materials. Through it all, we&apos;ve maintained our commitment to quality, integrity, and customer satisfaction while expanding our reach to serve communities throughout the region.
                    </p>
                    <p>
                      Today, we serve residential and commercial customers in {safeLocation.name} with a team of licensed professionals, quality materials, and unwavering dedication to excellence in every project we undertake.
                    </p>
                  </div>
                </div>
                <div className="relative h-full min-h-[400px]">
                  {/* Placeholder for About Image - could use a generic construction image if no specific one available */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-2xl flex items-center justify-center text-white">
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
              Our Track Record in {location.name}
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that speak to our commitment and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-700 mb-2">50+</div>
              <div className="text-gray-600">Years in Business</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-700 mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-700 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Service</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-700 mb-2">100%</div>
              <div className="text-gray-600">Satisfaction Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600">
              Licensed professionals dedicated to serving {location.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍🔧</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-700 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.experience} Experience</p>
                <div className="space-y-1">
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
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
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              What drives us to provide exceptional service in {location.name}
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
              Ready to Experience the Bennett Construction Difference?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers in {location.name} who trust us with their roofing needs
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              From emergency repairs to new installations, we&apos;re here to help
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Contact us today for reliable, professional services in {location.name}, {location.state}. We&apos;re available 24/7 for emergency calls and scheduled appointments.
            </p>
            <a
              href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
              className="bg-[#d97706] text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-[#b45309] transition inline-block"
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
