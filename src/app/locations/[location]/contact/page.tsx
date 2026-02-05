import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
      title: 'Contact Us | Bennett Construction & Roofing',
      description: 'Need roofing help? Contact our team today for fast, affordable services.'
    };
  }

  return {
    title: `Contact Roofers in ${location.name} | Bennett Construction & Roofing`,
    description: `Need roofing or construction help in ${location.name}? Contact our team today for free estimates and 24/7 emergency service. Call ${location.phone || '(866) 289-1750'}.`,
    keywords: [
      `contact roofer ${location.name}`,
      `roofer near me ${location.name}`,
      `emergency roofer ${location.name}`,
      `roofing service ${location.name}`,
      `local roofer ${location.name}`,
      `roofing contractor ${location.name}`,
    ],
    openGraph: {
      title: `Contact Roofers in ${location.name} | Bennett Construction & Roofing`,
      description: `Need roofing help in ${location.name}? Contact our team today for fast, affordable services.`,
      type: 'website',
      locale: 'en_US',
      siteName: 'Bennett Construction & Roofing'
    },
    alternates: {
      canonical: `https://bennettconstructionandroofing.com/locations/${location.id}/contact`
    }
  };
}

export default async function ContactPage({ params }: LocationPageProps) {
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
    seed: 'contact',
  });
  const dynamicSubtextLines = buildLocationPageHeroSubtext({
    city: safeLocation.name,
    state: safeLocation.state,
    pageType: 'contact',
    zipCodes: safeLocation.zipCodes,
  });

  const contactMethods = [
    {
      title: 'Call Us Now',
      description: 'Speak directly with our experts',
      contact: safeLocation.phone,
      action: `tel:${safeLocation.phone.replace(/\D/g, '')}`,
      icon: '📞',
      highlight: true
    },
    {
      title: 'Emergency Service',
      description: '24/7 emergency roofing available',
      contact: 'Available 24/7',
      action: `tel:${safeLocation.phone.replace(/\D/g, '')}`,
      icon: '🚨',
      highlight: true
    },
    {
      title: 'Service Area',
      description: 'Serving the greater area',
      contact: `${safeLocation.name}, ${safeLocation.state}`,
      action: '#',
      icon: '📍',
      highlight: false
    }
  ];

  const services = [
    'Roof Repair & Replacement',
    'Storm Damage Restoration',
    'Gutter Installation',
    'Siding Installation',
    'Emergency Roofing',
    'Leak Detection',
    'Commercial Roofing',
    'General Construction'
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

      {/* Contact Methods Section */}
      <section id="contact" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Get in Touch with Our {safeLocation.name} Team
            </h2>
            <p className="text-xl text-gray-600">
              Multiple ways to reach us for all your roofing and construction needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className={`text-center p-8 rounded-xl transition-all duration-300 ${method.highlight ? 'bg-blue-50/50 border-2 border-blue-100 hover:border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                {method.action !== '#' ? (
                  <a
                    href={method.action}
                    className={`font-bold text-lg ${method.highlight ? 'text-[#d97706] hover:text-[#b45309]' : 'text-gray-700 hover:text-gray-900'} transition`}
                  >
                    {method.contact}
                  </a>
                ) : (
                  <span className={`font-bold text-lg ${method.highlight ? 'text-[#d97706]' : 'text-gray-700'}`}>
                    {method.contact}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              Services We Offer in {safeLocation.name}
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive solutions for residential and commercial properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition text-center sm:text-left">
                <span className="text-[#d97706] font-bold block mb-1">✓</span>
                <span className="text-gray-800 font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NearbyAreasSection
        nearbyLocations={nearbyLocations}
        currentLocationName={safeLocation.name}
        state={safeLocation.state}
      />

      {/* Regular CTA Section */}
      <section className="py-16 px-4 bg-[#1e3a5f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Schedule Your Estimate?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our {safeLocation.name} team today for reliable, professional service. We're here to help.
          </p>
          <a
            href={`tel:${safeLocation.phone.replace(/\D/g, '')}`}
            className="bg-[#d97706] text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#b45309] transition inline-block shadow-lg"
          >
            Call {safeLocation.phone}
          </a>
        </div>
      </section>

      <Footer location={{ name: safeLocation.name, state: safeLocation.state }} />
    </div>
  );
}
