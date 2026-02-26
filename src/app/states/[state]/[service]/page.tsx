import Link from 'next/link';
import { getAllLocations, getLocationZipCodes } from '@/utils/content';
import { getLocationUrl, getStateUrl } from '@/utils/subdomain';
import { buildDynamicHeroHeader, buildDynamicHeroSubtextLines } from '@/lib/heroSubtext';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import servicesData from '@/data/services.json';
import siteConfig from '@/data/site.config.json';
import contentData from '@/data/content.json';

interface StateServicePageProps {
  params: Promise<{ state: string; service: string }>;
}

export async function generateMetadata({ params }: StateServicePageProps): Promise<Metadata> {
  const { state, service } = await params;
  const allLocations = getAllLocations();

  const stateLocations = allLocations.filter(
    (loc) => loc.state.toLowerCase() === state.toLowerCase()
  );

  if (stateLocations.length === 0) {
    return {
      title: 'State Not Found',
      description: 'The requested state was not found.',
    };
  }

  const stateName = stateLocations[0].state;
  const stateFullName = getStateFullName(stateName);
  const serviceName = getServiceName(service);

  return {
    title: `${serviceName} in ${stateFullName} | ${siteConfig.companyName}`,
    description: `Professional ${serviceName.toLowerCase()} services in ${stateFullName}. Expert roofing contractors for ${serviceName.toLowerCase()} with 25+ years of experience. Call ${siteConfig.phone}!`,
    keywords: [
      `${serviceName.toLowerCase()} ${stateFullName}`,
      `roofer ${stateFullName}`,
      `${serviceName.toLowerCase()} services ${stateFullName}`,
      `professional ${serviceName.toLowerCase()} ${stateFullName}`,
      `emergency ${serviceName.toLowerCase()} ${stateFullName}`,
      `roofing contractor ${stateFullName}`,
      `roofing company ${stateFullName}`,
      `roof repair ${stateFullName}`,
      `roof installation ${stateFullName}`
    ],
    openGraph: {
      title: `${serviceName} in ${stateFullName} | ${siteConfig.companyName}`,
      description: `Professional ${serviceName.toLowerCase()} services in ${stateFullName}. Expert roofing contractors for ${serviceName.toLowerCase()} with 25+ years of experience.`,
      url: getStateUrl(state, service),
      siteName: siteConfig.companyName,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${serviceName} in ${stateFullName} | ${siteConfig.companyName}`,
      description: `Professional ${serviceName.toLowerCase()} services in ${stateFullName}. Expert roofing contractors for ${serviceName.toLowerCase()} with 25+ years of experience.`,
    },
    alternates: {
      canonical: getStateUrl(state, service),
    },
  };
}

export default async function StateServicePage({ params }: StateServicePageProps) {
  const { state, service } = await params;
  const allLocations = getAllLocations();

  // Get all locations for this state
  const stateLocations = allLocations.filter(
    (loc) => loc.state.toLowerCase() === state.toLowerCase()
  );

  if (stateLocations.length === 0) {
    notFound();
  }

  // Get state name from first location
  const stateName = stateLocations[0].state;
  const stateFullName = getStateFullName(stateName);
  const serviceName = getServiceName(service);
  const zipCodes = getLocationZipCodes({ state: stateName, zipCodes: stateLocations[0]?.zipCodes || [] } as any);

  const dynamicHeroHeader = buildDynamicHeroHeader({
    serviceLabel: serviceName,
    city: stateFullName,
    state: stateName,
    zipCodes,
    seed: service,
  });
  const dynamicSubtextLines = buildDynamicHeroSubtextLines({
    serviceKey: service,
    serviceLabel: serviceName,
    city: stateFullName,
    state: stateName,
    phone: siteConfig.phone,
    zipCodes,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4a2c17] to-[#2d1a0e] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <span className="bg-[#c4841d] text-white text-xs font-bold px-3 py-1.5 rounded-full">Licensed & Insured</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Top Rated in {stateFullName}</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Free Estimates</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {dynamicHeroHeader}
          </h1>
          <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto space-y-2">
            <p>{dynamicSubtextLines.line1}</p>
            <p>{dynamicSubtextLines.line2}</p>
            <p>{dynamicSubtextLines.line3}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="bg-[#c4841d] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8b5e14] transition-colors"
            >
              Call {siteConfig.phone}
            </a>
            <a
              href="#cities"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#4a2c17] transition-colors"
            >
              View Cities
            </a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Welcome to <span className="font-bold text-[#4a2c17]">{siteConfig.companyName}</span>,
              your trusted local roofing and construction experts delivering durable, high-quality roofing
              solutions across <span className="font-semibold">{stateFullName}</span> for <span className="font-semibold">{serviceName.toLowerCase()}</span>. We believe
              a roof is more than just a structure—it&apos;s your home&apos;s first line of defense against weather,
              time, and wear. That&apos;s why we focus on building strong, long-lasting roofs designed to protect
              what matters most.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Homeowners and property managers across {stateFullName} trust us for our craftsmanship,
              professionalism, and attention to detail. One satisfied customer shared:
            </p>

            {/* Testimonial Quote */}
            <div className="bg-[#4a2c17]/5 border-l-4 border-[#c4841d] rounded-r-xl p-6 my-8">
              <p className="text-lg italic text-gray-700 mb-4">
                &quot;{siteConfig.companyName} completely upgraded our roof. The quality, workmanship,
                and reliability exceeded our expectations—it&apos;s built to last.&quot;
              </p>
              <p className="text-sm font-semibold text-[#4a2c17]">
                — Satisfied Homeowner
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We offer a full range of roofing services, including roof installation, roof replacement,
              roof repairs, inspections, and ongoing maintenance. Whether it&apos;s a residential or commercial project,
              our experienced roofing professionals deliver on time, every time—without cutting corners.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At <span className="font-bold text-[#4a2c17]">{siteConfig.companyName}</span>, we combine
              premium materials, proven techniques, and local expertise to provide roofing systems that are
              durable, energy-efficient, and visually appealing. From storm protection to long-term performance,
              your peace of mind is always our priority.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Choose <span className="font-bold text-[#4a2c17]">{siteConfig.companyName}</span> for
              reliable roofing services in {stateFullName}—where quality craftsmanship
              meets dependable service.
            </p>

            <div className="text-center">
              <a
                href={`tel:${siteConfig.phoneClean}`}
                className="inline-flex items-center bg-[#4a2c17] hover:bg-[#2e4a6f] text-white font-bold px-8 py-3 rounded-lg text-lg transition"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" />
                </svg>
                <span>Call {siteConfig.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {serviceName} Services in {stateFullName} Cities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional {serviceName.toLowerCase()} services available in {stateLocations.length} cities across {stateFullName}.
              Click on any city to learn more about our services in that area.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {stateLocations.slice(0, 20).map((location) => (
              <Link
                key={location.id}
                href={getLocationUrl(location.id, service)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {location.name}, {location.state}
                </p>
              </Link>
            ))}
          </div>

          {stateLocations.length > 20 && (
            <div className="text-center mt-8">
              <Link
                href={getStateUrl(state)}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All {stateLocations.length} Cities
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#c4841d] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need {serviceName} Services in {stateFullName}?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our licensed and experienced roofing professionals are available for emergency repairs
            and scheduled appointments throughout {stateFullName}.
          </p>
          <div className="flex justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="bg-[#4a2c17] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#6b3d22] transition-colors"
            >
              {contentData.statePages.cta.buttonText.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
            </a>
          </div>
        </div>
      </section>

      <Footer location={{ name: stateFullName, state: stateName }} />
    </div>
  );
}

function getStateFullName(stateCode: string): string {
  const stateNames: { [key: string]: string } = {
    'CA': 'California',
    'NY': 'New York',
    'TX': 'Texas',
    'FL': 'Florida',
    'IL': 'Illinois',
    'PA': 'Pennsylvania',
    'OH': 'Ohio',
    'GA': 'Georgia',
    'NC': 'North Carolina',
    'MI': 'Michigan',
    'NJ': 'New Jersey',
    'VA': 'Virginia',
    'WA': 'Washington',
    'AZ': 'Arizona',
    'MA': 'Massachusetts',
    'TN': 'Tennessee',
    'IN': 'Indiana',
    'MO': 'Missouri',
    'MD': 'Maryland',
    'CO': 'Colorado',
    'MN': 'Minnesota',
    'WI': 'Wisconsin',
    'SC': 'South Carolina',
    'AL': 'Alabama',
    'LA': 'Louisiana',
    'KY': 'Kentucky',
    'OR': 'Oregon',
    'OK': 'Oklahoma',
    'CT': 'Connecticut',
    'UT': 'Utah',
    'IA': 'Iowa',
    'NV': 'Nevada',
    'AR': 'Arkansas',
    'MS': 'Mississippi',
    'KS': 'Kansas',
    'NE': 'Nebraska',
    'ID': 'Idaho',
    'NH': 'New Hampshire',
    'ME': 'Maine',
    'NM': 'New Mexico',
    'RI': 'Rhode Island',
    'HI': 'Hawaii',
    'MT': 'Montana',
    'DE': 'Delaware',
    'SD': 'South Dakota',
    'ND': 'North Dakota',
    'AK': 'Alaska',
    'VT': 'Vermont',
    'WY': 'Wyoming',
    'WV': 'West Virginia'
  };

  return stateNames[stateCode] || stateCode;
}

function getServiceName(serviceSlug: string): string {
  const allServices = Object.values((servicesData as any).servicesByCategory || {}).flat() as any[];
  const service = allServices.find((s: any) => s.slug === serviceSlug);
  return service ? service.title : serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
}
