"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import servicesData from '@/data/services.json';
import imagesData from '@/data/images.json';
import siteConfig from '@/data/site.config.json';

function getAllServicesFlat() {
  const data = servicesData as any;
  if (data.servicesByCategory) {
    return Object.values(data.servicesByCategory).flat() as any[];
  }
  if (data.services) return data.services as any[];
  return [] as any[];
}

export default function ServicesPageContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentServices, setCurrentServices] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentResponse, setCurrentResponse] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Animate counters
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepValue = 25 / steps;
      const stepTime = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setCurrentServices(Math.floor(stepValue * currentStep));
        setCurrentExperience(Math.floor(stepValue * currentStep));
        setCurrentResponse(Math.floor(stepValue * currentStep));

        if (currentStep >= steps) {
          clearInterval(timer);
          setCurrentServices(25);
          setCurrentExperience(20);
          setCurrentResponse(60);
        }
      }, stepTime);
    };

    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []);

  const getServiceImage = (slug: string) => {
    // Safe access to image data
    const services = (imagesData as any).images?.services || {};
    const image = services[slug];
    return image?.url || null;
  };

  const heroImage = (imagesData as any).images?.hero?.services?.url || '';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImage && (
            <img
              src={heroImage}
              alt="Construction Services"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a2c17]/90 to-[#4a2c17]/70"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-6xl mx-auto">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-6">
                <span className="bg-[#c4841d] text-white px-6 py-3 rounded-full text-sm font-semibold animate-pulse">
                  Licensed & Insured
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Expert Construction & Roofing Services
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
                Comprehensive solutions for residential and commercial properties nationwide.
              </p>
              <div className="flex justify-center">
                <a
                  href={`tel:+1${siteConfig.phoneClean}`}
                  className="group relative bg-white text-[#4a2c17] font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3"
                >
                  <div className="relative">
                    <svg className="w-6 h-6 animate-bounce text-[#4a2c17]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" />
                    </svg>
                  </div>
                  <span className="font-bold tracking-wide">{siteConfig.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50 text-[#4a2c17]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#c4841d]">{currentServices}+</div>
                <div className="text-lg font-medium">Specialized Services</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#c4841d]">{currentExperience}+</div>
                <div className="text-lg font-medium">Years Experience</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#c4841d]">{currentResponse}</div>
                <div className="text-lg font-medium">Minute Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#4a2c17] mb-4">Our Complete Construction & Roofing Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From emergency repairs to large-scale installations, we provide comprehensive solutions for all your property needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getAllServicesFlat().map((service) => {
              const imageUrl = getServiceImage(service.slug);

              return (
                <Link key={service.slug} href={`/services/${service.slug}`} className="group">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full flex flex-col border border-gray-100">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-4xl">{service.icon}</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#4a2c17] shadow-sm">
                        {service.category}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{service.icon}</span>
                        <h3 className="text-xl font-bold text-[#4a2c17]">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                      <div className="mt-auto flex items-center text-[#c4841d] font-bold">
                        Learn More
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#4a2c17] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Project?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Contact us today for a free estimate. We're available 24/7 for emergency calls and scheduled appointments.
          </p>
          <div className="flex justify-center">
            <a
              href={`tel:+1${siteConfig.phoneClean}`}
              className="inline-flex items-center bg-[#c4841d] text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-[#8b5e14] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

