import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllLocations } from '@/utils/content';
import { getLocationUrl, getStateUrl } from '@/utils/subdomain';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import siteConfig from '@/data/site.config.json';
import contentData from '@/data/content.json';

interface StatePageProps {
  params: Promise<{ state: string }>;
}

// Construction services to display
const constructionServices = [
  {
    slug: 'roof-repair',
    title: 'Roof Repair',
    description: 'Expert repair for leaks, storm damage, missing shingles, and more.',
    icon: '🔧'
  },
  {
    slug: 'roof-replacement',
    title: 'Roof Replacement',
    description: 'Complete tear-off and new roof installation with premium materials and warranty.',
    icon: '🏠'
  },
  {
    slug: 'storm-damage-roof-repair',
    title: 'Storm Damage Repair',
    description: 'Emergency response for hail, wind, and storm damage. Insurance claim help available.',
    icon: '⛈️'
  },
  {
    slug: 'gutter-installation',
    title: 'Gutter Installation',
    description: 'Seamless gutters custom-fit to your home with multiple color options.',
    icon: '🌧️'
  },
  {
    slug: 'siding-installation',
    title: 'Siding Installation',
    description: 'Vinyl, fiber cement, and wood siding to transform your home\'s exterior.',
    icon: '🏡'
  },
  {
    slug: 'general-construction',
    title: 'General Construction',
    description: 'Additions, garages, decks, and structural work by licensed professionals.',
    icon: '🏗️'
  },
];

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const allLocations = getAllLocations();

  const stateLocations = allLocations.filter(
    (loc) => loc.state.toLowerCase() === state.toLowerCase()
  );

  if (stateLocations.length === 0) return {};

  const stateName = stateLocations[0].state;
  const stateFullName = getStateFullName(stateName);

  return {
    keywords: [
      `roofer ${stateFullName}`,
      `roofing services ${stateFullName}`,
      `roof repair ${stateFullName}`,
      `roof replacement ${stateFullName}`,
      `storm damage repair ${stateFullName}`,
      `gutter installation ${stateFullName}`,
      `siding installation ${stateFullName}`,
      `construction contractor ${stateFullName}`,
      `residential roofing ${stateFullName}`,
      `commercial roofing ${stateFullName}`,
      `roofing company ${stateFullName}`,
      `home remodeling ${stateFullName}`
    ],
    openGraph: {
      title: `Roofing & Construction in ${stateFullName} | ${siteConfig.companyName}`,
      description: `Expert roofing and construction services in ${stateFullName}. Licensed, experienced, and affordable!`,
      url: getStateUrl(state),
      siteName: siteConfig.companyName,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Roofing & Construction in ${stateFullName} | ${siteConfig.companyName}`,
      description: `Expert roofing and construction services in ${stateFullName}. Licensed, experienced, and affordable!`,
    },
    alternates: {
      canonical: getStateUrl(state),
    },
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { state } = await params;
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-[#4a2c17] to-[#2d1a0e]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <span className="bg-[#c4841d] text-white px-4 py-2 rounded-full text-sm font-semibold">
              Licensed & Insured • 25+ Years
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {contentData.statePages.hero.titleTemplate.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-5xl mx-auto leading-relaxed mb-8">
            {contentData.statePages.hero.subtitleTemplate.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="inline-flex items-center bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" />
              </svg>
              <span>{siteConfig.phone}</span>
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
              solutions across <span className="font-semibold">{stateFullName}</span>. We believe
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

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services in {stateFullName}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{siteConfig.companyName} provides expert services for your home or business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {constructionServices.map((service) => (
              <Link key={service.slug} href={`/states/${state}/${service.slug}`} className="block">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-[#4a2c17] to-[#6b3d22] flex items-center justify-center">
                    <span className="text-6xl">{service.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#4a2c17] mb-3">» {service.title} in {stateFullName}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Call {siteConfig.companyName} at {siteConfig.phone}. {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Cities We Serve in {stateFullName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stateLocations.map((location) => (
              <Link
                key={location.id}
                href={getLocationUrl(location.id)}
                className="block p-4 bg-white rounded-lg hover:bg-[#4a2c17]/10 transition text-center shadow-sm"
              >
                <h4 className="font-semibold text-gray-800">{location.name}</h4>
                <p className="text-sm text-gray-600">{location.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#c4841d] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{contentData.statePages.cta.title.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}</h2>
          <p className="text-xl mb-8">{contentData.statePages.cta.subtitle.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="inline-flex items-center justify-center bg-[#4a2c17] hover:bg-[#6b3d22] text-white font-bold px-8 py-4 rounded-lg text-lg transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {contentData.statePages.cta.buttonText.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
            </a>
            <Link
              href="/contact"
              className="bg-white text-[#4a2c17] font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              Request Free Estimate
            </Link>
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