import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllLocations } from '@/utils/content';
import { getStateUrl } from '@/utils/subdomain';
import { resolveStateParam } from '@/utils/state-codes';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import servicesData from '@/data/services.json';
import siteConfig from '@/data/site.config.json';
import contentData from '@/data/content.json';

interface StateServicesPageProps {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: StateServicesPageProps): Promise<Metadata> {
  const { state } = await params;
  const resolvedCode = resolveStateParam(state);
  if (!resolvedCode) return {};
  const allLocations = getAllLocations();

  const stateLocations = allLocations.filter(
    (loc) => loc.state.toUpperCase() === resolvedCode
  );

  if (stateLocations.length === 0) return {};

  const stateName = stateLocations[0].state;
  const stateFullName = getStateFullName(stateName);

  const { getStateServicesSEOFromFile } = await import('@/lib/seo-server');
  const seo = getStateServicesSEOFromFile(stateFullName, stateName);

  return {
    title: seo.title,
    description: seo.description,
    keywords: [
      `roofing services ${stateFullName}`,
      `roof repair ${stateFullName}`,
      `roof replacement ${stateFullName}`,
      `storm damage repair ${stateFullName}`,
      `gutter installation ${stateFullName}`,
      `siding installation ${stateFullName}`,
      `roofing contractor ${stateFullName}`,
      `residential roofer ${stateFullName}`,
      `commercial roofer ${stateFullName}`,
      `roofing company ${stateFullName}`,
      `construction repair ${stateFullName}`
    ],
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: getStateUrl(state, 'services'),
      siteName: siteConfig.companyName,
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: seo.canonical || getStateUrl(state, 'services'),
    },
  };
}

export default async function StateServicesPage({ params }: StateServicesPageProps) {
  const { state } = await params;
  const resolvedCode = resolveStateParam(state);
  if (!resolvedCode) notFound();
  const allLocations = getAllLocations();

  const stateLocations = allLocations.filter(
    (loc) => loc.state.toUpperCase() === resolvedCode
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
      <section className="relative py-24 bg-gradient-to-r from-[#4a2c17] to-[#2d1a0e] text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {contentData.statePages.servicesPage.titleTemplate.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed mb-8">
            {contentData.statePages.servicesPage.subtitleTemplate.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="inline-flex items-center bg-[#c4841d] text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#8b5e14] transition-all"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" />
              </svg>
              <span>{siteConfig.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a2c17] mb-4">Complete Solutions for {stateFullName}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{siteConfig.companyName} provides specialized services tailored to your local climate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Object.values((servicesData as any).servicesByCategory || {}).flat() as any[]).map((service: any) => (
              <Link key={service.slug} href={`/states/${state}/${service.slug}`} className="group block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform group-hover:-translate-y-2 h-full flex flex-col">
                  <div className="h-48 bg-[#4a2c17]/5 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-[#4a2c17] mb-4 group-hover:text-[#c4841d] transition-colors">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                      {service.description || `Professional ${service.title.toLowerCase()} services provided with quality and care.`} We serve {stateLocations.length} cities across {stateFullName} with professional {service.title.toLowerCase()} services.
                    </p>
                    <div className="text-[#c4841d] font-bold flex items-center gap-2">
                      Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* State CTA */}
      <section className="bg-[#c4841d] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{contentData.statePages.cta.title.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}</h2>
          <p className="text-xl opacity-90 mb-10">
            {contentData.statePages.cta.subtitle.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={`tel:${siteConfig.phoneClean}`}
              className="bg-[#4a2c17] text-white font-bold px-10 py-5 rounded-xl text-xl hover:bg-[#6b3d22] transition shadow-2xl"
            >
              {contentData.statePages.cta.buttonText.replace(/{STATE_NAME}/g, stateFullName).replace(/{COMPANY}/g, siteConfig.companyName).replace(/{PHONE}/g, siteConfig.phone)}
            </a>
            <Link
              href="/contact"
              className="bg-white text-[#c4841d] font-bold px-10 py-5 rounded-xl text-xl hover:bg-gray-100 transition shadow-xl"
            >
              Contact Us Online
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
    'CA': 'California', 'NY': 'New York', 'TX': 'Texas', 'FL': 'Florida',
    'IL': 'Illinois', 'PA': 'Pennsylvania', 'OH': 'Ohio', 'GA': 'Georgia',
    'NC': 'North Carolina', 'MI': 'Michigan', 'NJ': 'New Jersey', 'VA': 'Virginia',
    'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts', 'TN': 'Tennessee',
    'IN': 'Indiana', 'MO': 'Missouri', 'MD': 'Maryland', 'CO': 'Colorado',
    'MN': 'Minnesota', 'WI': 'Wisconsin', 'SC': 'South Carolina', 'AL': 'Alabama',
    'LA': 'Louisiana', 'KY': 'Kentucky', 'OR': 'Oregon', 'OK': 'Oklahoma',
    'CT': 'Connecticut', 'UT': 'Utah', 'IA': 'Iowa', 'NV': 'Nevada',
    'AR': 'Arkansas', 'MS': 'Mississippi', 'KS': 'Kansas', 'NE': 'Nebraska',
    'ID': 'Idaho', 'NH': 'New Hampshire', 'ME': 'Maine', 'NM': 'New Mexico',
    'RI': 'Rhode Island', 'HI': 'Hawaii', 'MT': 'Montana', 'DE': 'Delaware',
    'SD': 'South Dakota', 'ND': 'North Dakota', 'AK': 'Alaska', 'VT': 'Vermont',
    'WY': 'Wyoming', 'WV': 'West Virginia'
  };
  return stateNames[stateCode] || stateCode;
}
