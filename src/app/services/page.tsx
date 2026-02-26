import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { getPageSEOFromFile } from '@/lib/seo-server';
import servicesData from '@/data/services.json';
import imagesData from '@/data/images.json';
import contentData from '@/data/content.json';
import siteConfig from '@/data/site.config.json';

type ServiceImageKey = keyof typeof imagesData.images.services;

const pageContent = contentData.mainWebsite.services;
const homeFaq = contentData.mainWebsite.homepage.faqSection;
const phone = siteConfig.phone;
const phoneClean = siteConfig.phoneClean;
const companyName = siteConfig.companyName;

function r(s: string) {
  return s.replace(/{COMPANY}/g, companyName).replace(/{PHONE}/g, phone);
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('services');
  if (!seo) {
    return {
      title: `Our Services | ${companyName}`,
      description: `Explore roofing, exterior, and construction services from ${companyName}.`,
      alternates: { canonical: `https://${siteConfig.domain}/services` },
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      url: seo.canonical ?? `https://${siteConfig.domain}/services`,
    },
  };
}

const iconMap: Record<string, string> = {
  'shield-check': '🛡️',
  'clock': '⚙️',
  'calculator': '💰',
  'star': '🏆',
};

const categoryOrder = ['roofing', 'roofing-type', 'commercial', 'exterior', 'construction'];

export default function ServicesPage() {
  const servicesByCategory = (servicesData as any).servicesByCategory || {};
  const serviceCategories = (servicesData as any).serviceCategories || {};
  const allServices: any[] = Object.values(servicesByCategory).flat();
  const categories = pageContent.categories as Record<string, { label: string; title: string }>;

  const getServiceImage = (slug: string) => {
    return imagesData.images?.services?.[slug as ServiceImageKey] || null;
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* ─── Hero ─── */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imagesData.images.hero.services.url}
            alt={imagesData.images.hero.services.alt}
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.3)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a2c17]/85 to-[#2d1a0e]/65" />
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <span className="inline-block bg-[#c4841d] text-white font-bold px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-wider">
            {(pageContent as any).hero?.badge || 'Full-Service Contractor'}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {pageContent.hero.title}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
            {r(pageContent.hero.subtitle)}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${phoneClean}`}
              className="bg-[#c4841d] hover:bg-[#8b5e14] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-xl inline-flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
              {r(pageContent.cta.primaryButton)}
            </a>
            <Link
              href="#all-services"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition backdrop-blur-sm inline-flex items-center justify-center"
            >
              Browse All {allServices.length} Services
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="py-10 bg-[#4a2c17] text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#c4841d]">{allServices.length}+</div>
            <div className="text-sm opacity-80 mt-1">Specialized Services</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#c4841d]">{Object.keys(servicesByCategory).length}</div>
            <div className="text-sm opacity-80 mt-1">Service Categories</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#c4841d]">5,000+</div>
            <div className="text-sm opacity-80 mt-1">Projects Completed</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#c4841d]">100%</div>
            <div className="text-sm opacity-80 mt-1">Satisfaction Guaranteed</div>
          </div>
        </div>
      </section>

      {/* ─── All Service Categories ─── */}
      <div id="all-services">
        {categoryOrder.map((catKey, idx) => {
          const services = servicesByCategory[catKey];
          if (!services || services.length === 0) return null;

          const catContent = categories[catKey];
          const catData = serviceCategories[catKey];
          const label = catContent?.label || catData?.name || catKey;
          const title = catContent?.title || `${catData?.name || catKey} Services`;
          const description = catData?.description || '';
          const bg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';

          return (
            <section key={catKey} className={`py-20 px-4 ${bg}`}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                  <span className="text-[#c4841d] font-semibold text-sm uppercase tracking-wider">{label}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#4a2c17] mt-2 mb-3">{title}</h2>
                  {description && <p className="text-gray-600 text-lg max-w-2xl mx-auto">{description}</p>}
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${services.length <= 3 ? 'lg:grid-cols-3 max-w-5xl mx-auto' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-8`}>
                  {services.map((service: any) => {
                    const serviceImage = getServiceImage(service.slug);
                    return (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col"
                      >
                        <div className="h-48 relative overflow-hidden">
                          {serviceImage?.url ? (
                            <Image
                              src={serviceImage.url}
                              alt={serviceImage.alt || service.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-[#4a2c17] to-[#6b3d22] flex items-center justify-center">
                              <span className="text-6xl group-hover:scale-110 transition-transform">{service.icon}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                            <span className="text-2xl drop-shadow-lg">{service.icon}</span>
                            <h3 className="font-bold text-lg text-white drop-shadow-lg leading-tight">{service.title}</h3>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <p className="text-gray-600 mb-5 line-clamp-3 flex-grow leading-relaxed text-sm">{service.description}</p>
                          <span className="inline-flex items-center text-[#c4841d] font-bold text-sm uppercase tracking-wide">
                            Learn More
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ─── Our Process ─── */}
      <section className="py-20 px-4 bg-[#4a2c17] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#c4841d] font-semibold text-sm uppercase tracking-wider">
              {(pageContent as any).processSection?.label || 'How We Work'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              {(pageContent as any).processSection?.title || 'Our Proven Process'}
            </h2>
            <p className="text-lg opacity-80 mt-3 max-w-2xl mx-auto">
              {(pageContent as any).processSection?.subtitle || 'From the first call to the final walkthrough, we make every project seamless.'}
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-white/20" />
            {siteConfig.process.map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-16 h-16 bg-[#c4841d] rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-5 border-4 border-[#4a2c17] shadow-lg relative z-10">
                  {step.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust / Why Choose Us ─── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a2c17]">
              {r((pageContent as any).trustSection?.title || `Why Choose ${companyName}`)}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteConfig.trustBadges.map((badge, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md text-center hover:shadow-xl transition border border-gray-100">
                <div className="w-16 h-16 bg-[#4a2c17]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">{iconMap[badge.icon] || '✅'}</span>
                </div>
                <h3 className="font-bold text-lg text-[#4a2c17] mb-3">{badge.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      {homeFaq?.items && homeFaq.items.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a2c17]">
                {(pageContent as any).faqSection?.title || homeFaq.title}
              </h2>
              <p className="text-gray-600 text-lg mt-3">
                {(pageContent as any).faqSection?.subtitle || homeFaq.subtitle}
              </p>
            </div>
            <div className="space-y-5">
              {homeFaq.items.map((faq, i) => (
                <details key={i} className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition">
                    <h3 className="text-lg font-bold text-[#4a2c17] pr-4">{faq.question}</h3>
                    <svg className="w-5 h-5 text-[#c4841d] shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={
              ((imagesData as any).images?.cta?.banner?.url as string | undefined) ||
              ((imagesData as any).images?.defaults?.placeholder?.url as string | undefined) ||
              ''
            }
            alt="Contact us"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.25)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#c4841d]/90 to-[#8b5e14]/80" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            {pageContent.cta.title}
          </h2>
          <p className="text-xl opacity-95 mb-10 leading-relaxed">
            {pageContent.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${phoneClean}`}
              className="inline-flex items-center justify-center bg-white text-[#c4841d] font-bold px-10 py-5 rounded-xl text-xl hover:bg-gray-50 transition shadow-xl gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {r(pageContent.cta.primaryButton)}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 font-bold px-10 py-5 rounded-xl text-xl transition backdrop-blur-sm"
            >
              {pageContent.cta.secondaryButton}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
