"use client";

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import imagesData from '@/data/images.json';

export default function ContactPageContent() {
  return (
    <div className="bg-white font-sans text-gray-900">
      <Header />

      {/* 1. HERO */}
      <section className="relative py-24 px-4 flex items-center justify-center overflow-hidden min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src={imagesData.images.hero.contact.url}
            alt="Contact Bennett Construction"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.3)' }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent z-0" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Contact Us</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
            Get a free estimate for your roofing or construction project. We serve communities across the USA.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-1 gap-16">
          {/* INFO */}
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-8">Get In Touch</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shrink-0">🏢</div>
                <div>
                  <h3 className="font-bold text-lg text-[#1e3a5f]">Corporate Headquarters</h3>
                  <p className="text-gray-600">
                    2450 E Camelback Rd<br />
                    Phoenix, AZ 85016
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shrink-0">📞</div>
                <div>
                  <h3 className="font-bold text-lg text-[#1e3a5f]">Phone</h3>
                  <p className="text-gray-600 mb-1">National Service Line</p>
                  <a href="tel:8662891750" className="text-xl font-bold text-[#d97706] hover:underline">(866) 289-1750</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shrink-0">🕒</div>
                <div>
                  <h3 className="font-bold text-lg text-[#1e3a5f]">Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 7am - 6pm (All Timezones)</p>
                  <p className="text-gray-600">Sat-Sun: By Appointment</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#1e3a5f] mb-2">Prefer to Talk to a Real Person?</h4>
              <p className="text-gray-600 text-sm">
                Call our national service line at{' '}
                <a href="tel:8662891750" className="font-bold text-[#d97706] hover:underline">
                  (866) 289-1750
                </a>{' '}
                to be connected with your local project manager.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
