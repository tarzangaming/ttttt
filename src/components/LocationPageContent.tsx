"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import LocationServiceGrid from '@/components/LocationServiceGrid';
import LocationTestimonials from '@/components/LocationTestimonials';
import LocationFAQ from '@/components/LocationFAQ';
import imagesData from '@/data/images.json';

// ... interfaces

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Location {
  id: string;
  name: string;
  state: string;
  fullName?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  phone: string;
  services?: Service[];
  areas?: string[];
  testimonials?: Testimonial[];
  faqs?: FAQ[];
}

interface LocationPageContentProps {
  location: Location;
}

// Construction services to display
const constructionServices = [
  {
    slug: 'roof-repair',
    title: 'Roof Repair',
    description: 'Expert repair for leaks, storm damage, and shingle issues.',
    icon: '🔧'
  },
  {
    slug: 'roof-replacement',
    title: 'Roof Replacement',
    description: 'Complete tear-off and new roof installation with warranty.',
    icon: '🏠'
  },
  {
    slug: 'storm-damage-roof-repair',
    title: 'Storm Damage',
    description: 'Emergency response for hail, wind, and storm damage.',
    icon: '⛈️'
  },
  {
    slug: 'gutter-installation',
    title: 'Gutter Installation',
    description: 'Seamless gutters custom-fit to your home.',
    icon: '🌧️'
  },
  {
    slug: 'siding-installation',
    title: 'Siding Installation',
    description: 'Vinyl, fiber cement, and wood siding options.',
    icon: '🏡'
  },
  {
    slug: 'general-construction',
    title: 'General Construction',
    description: 'Additions, garages, decks, and structural work.',
    icon: '🏗️'
  },
];

export default function LocationPageContent({ location }: LocationPageContentProps) {
  if (!location) return null;

  const heroImage = imagesData.images.hero.locations.url;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={`Roofing and Construction Services in ${location.name}`}
            fill
            priority
            className="object-cover"
            style={{ filter: 'brightness(0.25)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 to-[#0f1f33]/60" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left text-white">
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <span className="bg-[#d97706] text-white px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Licensed & Insured
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  ⭐ 4.9/5 Rating
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🏆 25+ Years
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Expert Roofing & Construction in{' '}
                <span className="text-[#d97706]">{location.name}</span>, {location.state}
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl mb-4 opacity-90 leading-relaxed">
                Your trusted local contractor for roof repair, replacement, storm damage, siding, gutters, and more.
                Serving {location.name} homeowners with quality workmanship and honest pricing.
              </p>

              {/* Additional Description */}
              <p className="text-base sm:text-lg mb-6 opacity-80 leading-relaxed">
                At Dolimiti Steel Roofing, we&apos;ve been protecting homes and businesses in {location.name}, {location.state} for over 25 years.
                Whether you need emergency storm damage repair, a complete roof replacement, new siding installation, or seamless gutter systems,
                our certified technicians deliver exceptional results with premium materials and industry-leading warranties.
                We understand the unique climate challenges in {location.state} and use specialized techniques to ensure your roof
                withstands extreme weather conditions year-round.
              </p>

              {/* Service Highlights */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/10">
                <p className="text-sm sm:text-base opacity-90 text-center">
                  <span className="font-bold text-[#d97706]">Comprehensive Services:</span> Roof Repair • Roof Replacement • Storm Damage • Tile Roofing •
                  Metal Roofing • Shingle Roofing • Flat Roofs • Siding • Gutters • General Construction
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#d97706]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <span className="font-bold text-sm lg:text-base block">Free Estimates</span>
                    <span className="text-xs lg:text-sm opacity-70">No obligation quotes</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#d97706]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <span className="font-bold text-sm lg:text-base block">24/7 Emergency</span>
                    <span className="text-xs lg:text-sm opacity-70">Same-day response</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#d97706]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <span className="font-bold text-sm lg:text-base block">0% Financing</span>
                    <span className="text-xs lg:text-sm opacity-70">Flexible payment plans</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#d97706]/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <span className="font-bold text-sm lg:text-base block">Lifetime Warranty</span>
                    <span className="text-xs lg:text-sm opacity-70">Materials & labor covered</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={`tel:${location.phone.replace(/\D/g, '')}`}
                  className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call {location.phone}
                </a>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg transition inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Get Free Quote
                </Link>
              </div>
            </div>

            {/* Right Column - Feature Card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-white text-2xl font-bold mb-6 text-center">Why Choose Dolimiti?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-[#d97706] rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Local Experts</h4>
                      <p className="text-sm opacity-80">We know {location.name}&apos;s unique roofing challenges and building codes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-[#d97706] rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Fast Response</h4>
                      <p className="text-sm opacity-80">Emergency repairs and quick turnaround on all projects.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-[#d97706] rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Honest Pricing</h4>
                      <p className="text-sm opacity-80">No hidden fees. Detailed quotes before any work begins.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-[#d97706] rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Guaranteed Work</h4>
                      <p className="text-sm opacity-80">Full warranty on materials and workmanship.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#d97706] mb-2">25+</div>
              <div className="text-gray-600 text-sm">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d97706] mb-2">1000+</div>
              <div className="text-gray-600 text-sm">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d97706] mb-2">Free</div>
              <div className="text-gray-600 text-sm">Estimates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d97706] mb-2">100%</div>
              <div className="text-gray-600 text-sm">Satisfaction Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1e3a5f]">
            Why {location.name} Homeowners Choose Dolimiti Steel Roofing
          </h2>

          <p className="text-lg text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Owning a home in {location.name} comes with unique challenges. The intense weather conditions,
            seasonal storms, and environmental factors can destroy a standard roof in half its expected lifespan.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-10">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Welcome to <span className="font-bold text-[#1e3a5f]">Dolimiti Steel Roofing</span>,
              your trusted local roofing and construction experts delivering durable, high-quality roofing
              solutions across <span className="font-semibold">{location.name}</span>. We believe
              a roof is more than just a structure—it&apos;s your home&apos;s first line of defense against weather,
              time, and wear. That&apos;s why we focus on building strong, long-lasting roofs designed to protect
              what matters most.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At <span className="font-bold text-[#1e3a5f]">Dolimiti Steel Roofing</span>, we combine
              premium materials, proven techniques, and local expertise to provide roofing systems that are
              durable, energy-efficient, and visually appealing. From storm protection to long-term performance,
              your peace of mind is always our priority.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Choose <span className="font-bold text-[#1e3a5f]">Dolimiti Steel Roofing</span> for
              reliable roofing services in {location.name}—where quality craftsmanship
              meets dependable service.
            </p>
          </div>

          {/* Dynamic Service Grid */}
          <LocationServiceGrid
            locationId={location.id}
            locationName={location.name}
            stateName={location.state}
            phone={location.phone}
          />
        </div>
      </section>
      {location.areas && location.areas.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              We Serve These Areas in {location.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {location.areas.slice(0, 24).map((area: string, index: number) => (
                <div key={`area-${location.id}-${index}`} className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="text-gray-800 font-medium text-sm">{area}</span>
                </div>
              ))}
            </div>
            {location.areas.length > 24 && (
              <div className="text-center mt-8">
                <p className="text-gray-600">And many more areas in {location.name}...</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Dolimiti Steel Roofing in {location.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#d97706]/10 text-[#d97706] rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-gray-600">Fully licensed, bonded, and insured for your protection.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#d97706]/10 text-[#d97706] rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">25+ Years Experience</h3>
              <p className="text-gray-600">Trusted by thousands of homeowners since 2000.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#d97706]/10 text-[#d97706] rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Estimates</h3>
              <p className="text-gray-600">No-obligation quotes with transparent pricing.</p>
            </div>
          </div>
        </div>
      </section>

      <LocationTestimonials
        locationName={location.name}
        stateName={location.state}
        phone={location.phone}
      />

      <LocationFAQ
        locationName={location.name}
        stateName={location.state}
        phone={location.phone}
      />

      {/* CTA Section */}
      <section className="bg-[#d97706] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Call us now for a free estimate on your roofing or construction project in {location.fullName || `${location.name}, ${location.state}`}.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${location.phone.replace(/\D/g, '')}`}
              className="bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white font-bold px-8 py-4 rounded-lg text-lg transition inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call {location.phone}
            </a>
            <Link
              href="/contact"
              className="bg-white text-[#1e3a5f] font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </section>

      <Footer location={{ name: location.name, state: location.state }} />
    </div>
  );
}