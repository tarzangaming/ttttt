import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPageSEOFromFile } from '@/lib/seo-server';
import servicesData from '@/data/services.json';
import imagesData from '@/data/images.json';

// Type for service image
type ServiceImageKey = keyof typeof imagesData.images.services;

export async function generateMetadata(): Promise<Metadata> {
  const seo = getPageSEOFromFile('services');

  if (!seo) {
    return {
      title: 'Our Services | Dolomiti Steel Roofing',
      description:
        'Explore roofing, exterior, and construction services from Dolomiti Steel Roofing.',
      alternates: {
        canonical: 'https://dolomitisteelroofing.com/services',
      },
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
      url: seo.canonical ?? 'https://dolomitisteelroofing.com/services',
    },
  };
}

export default function ServicesPage() {
  const servicesByCategory = (servicesData as any).servicesByCategory || {};
  const allServices: any[] = Object.values(servicesByCategory).flat();

  // Group services by category
  const roofingServices = allServices.filter(s => s.category === 'roofing');
  const exteriorServices = allServices.filter(s => s.category === 'exterior');
  const constructionServices = allServices.filter(s => s.category === 'construction');

  // Helper function to get service image
  const getServiceImage = (slug: string) => {
    const serviceImages = imagesData.images?.services;
    return serviceImages?.[slug as ServiceImageKey] || null;
  };

  // Service Card Component
  const ServiceCard = ({ service, size = 'normal' }: { service: any; size?: 'normal' | 'small' }) => {
    const serviceImage = getServiceImage(service.slug);
    const heightClass = size === 'small' ? 'h-36' : 'h-44';

    return (
      <Link
        href={`/services/${service.slug}`}
        className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className={`${heightClass} relative overflow-hidden`}>
          {serviceImage?.url ? (
            <Image
              src={serviceImage.url}
              alt={serviceImage.alt || service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-center">
              <span className="text-5xl">{service.icon}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-bold text-xl text-white drop-shadow-lg">
              {service.title}
            </h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
          <span className="inline-flex items-center text-[#d97706] font-semibold">
            Learn More
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imagesData.images.hero.services.url}
            alt={imagesData.images.hero.services.alt}
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.4)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/80 to-[#0f1f33]/60" />
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            From roof repairs to complete home renovations, Dolomiti Steel Roofing delivers quality craftsmanship on every project.
          </p>
        </div>
      </section>

      {/* Roofing Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Professional Roofing</span>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mt-2">
              Roofing Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roofingServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Exterior Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Home Exterior</span>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mt-2">
              Exterior Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exteriorServices.map((service) => (
              <ServiceCard key={service.slug} service={service} size="small" />
            ))}
          </div>
        </div>
      </section>

      {/* Construction Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#d97706] font-semibold text-sm uppercase tracking-wider">Build & Renovate</span>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mt-2">
              Construction & Remodeling
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {constructionServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={
              ((imagesData as any).images?.cta?.banner?.url as string | undefined) ||
              ((imagesData as any).images?.defaults?.placeholder?.url as string | undefined) ||
              ''
            }
            alt={
              ((imagesData as any).images?.cta?.banner?.alt as string | undefined) ||
              'CTA Background'
            }
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.3)' }}
          />
        </div>
        <div className="absolute inset-0 bg-[#1e3a5f]/70" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Contact us today for a free estimate on your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:8662891750"
              className="inline-flex items-center justify-center bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 rounded-lg text-lg transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call (866) 289-1750
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-[#1e3a5f] font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}