import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllLocations } from '@/utils/content';
import { getStateUrl } from '@/utils/subdomain';
import imagesData from '@/data/images.json';
import siteConfig from '@/data/site.config.json';
import contentData from '@/data/content.json';

export default function StatesPage() {
  // Get all locations using the helper
  const allLocations = getAllLocations();

  // Group locations by state
  const stateGroups = allLocations.reduce((acc: Record<string, Array<{ id: string; name: string; state: string }>>, location) => {
    const state = location.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(location);
    return acc;
  }, {});

  // Convert to array and sort by number of cities
  const statesArray = Object.entries(stateGroups)
    .map(([state, locations]) => ({
      state,
      cityCount: locations.length,
      fullName: getStateFullName(state)
    }))
    .sort((a, b) => b.cityCount - a.cityCount);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imagesData.images.hero.locations.url}
            alt={imagesData.images.hero.locations.alt}
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.35)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a2c17]/70 to-[#2d1a0e]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {contentData.mainWebsite.states.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {contentData.mainWebsite.states.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="bg-[#c4841d] hover:bg-[#8b5e14] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Call {siteConfig.phone}
            </a>
            <a
              href="#states"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#4a2c17] transition-colors"
            >
              View All States
            </a>
          </div>
        </div>
      </section>

      {/* States Grid Section */}
      <section id="states" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              States We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional roofing and construction services available in {statesArray.length} states across the United States.
              Click on any state to view all cities we serve in that area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {statesArray.map((stateInfo) => (
              <Link
                key={stateInfo.state}
                href={getStateUrl(stateInfo.state)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 text-center group"
              >
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#c4841d] transition-colors mb-2">
                  {stateInfo.fullName}
                </h3>
                <p className="text-3xl font-bold text-[#4a2c17] mb-2">
                  {stateInfo.cityCount}
                </p>
                <p className="text-sm text-gray-600">
                  {stateInfo.cityCount === 1 ? 'City' : 'Cities'} Available
                </p>
                <div className="mt-4 text-[#c4841d] font-medium group-hover:text-[#8b5e14] transition-colors">
                  View Cities →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={(imagesData as any).images?.cta?.secondary?.url || (imagesData as any).images?.cta?.banner?.url || ''}
            alt="CTA Background"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.25)' }}
          />
        </div>
        <div className="absolute inset-0 bg-[#4a2c17]/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {contentData.mainWebsite.states.cta.title.replace(/{PHONE}/g, siteConfig.phone)}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {contentData.mainWebsite.states.cta.subtitle}
          </p>
          <div className="flex justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="bg-[#c4841d] hover:bg-[#8b5e14] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {contentData.mainWebsite.states.cta.buttonText.replace(/{PHONE}/g, siteConfig.phone)}
            </a>
          </div>
        </div>
      </section>

      <Footer />
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