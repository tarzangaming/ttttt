'use client';

import Image from 'next/image';
import imagesData from '@/data/images.json';

export default function FloatingCTA({ phone = '8662891750', locationName = '' }: { phone?: string, locationName?: string }) {
  // Format phone for display
  const displayPhone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  const telLink = `tel:${phone.replace(/\D/g, '')}`;

  return (
    <>
      {/* Desktop Floating CTA - Full Banner (always visible) */}
      <div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4 z-50 hidden md:block transition-all duration-500 ease-in-out translate-y-0 opacity-100"
      >
        <div className="bg-[#d97706] rounded-t-xl shadow-2xl py-4 px-6 flex flex-col sm:flex-row items-center gap-4 text-white border-t border-white/20">
          {/* Left Column - Icon Only */}
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="relative -mt-12 md:-mt-16">
              {/* Roofer/contractor image */}
              <div className="w-24 h-32 md:w-28 md:h-36 bg-[#1e3a5f] rounded-lg shadow-lg border-4 border-white overflow-hidden relative">
                <Image
                  src={imagesData.images.hero.servicePortrait.url}
                  alt="Professional Roofer"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-left ml-4 flex-1">
            <h3 className="font-bold text-lg md:text-xl text-white leading-tight mb-2 tracking-wide drop-shadow-sm">
              Expert Roofing & Construction {locationName ? `in ${locationName}` : ''}
            </h3>
            <p className="text-sm md:text-base text-white/90 font-semibold leading-relaxed">
              Licensed • Insured • Free Estimates • 25+ Years Experience
            </p>
          </div>

          {/* Right Column - Phone CTA Button */}
          <div className="flex justify-center sm:justify-center ml-8">
            <a
              href={telLink}
              className="group flex items-center gap-3 bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ring-2 ring-white/10"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="font-bold tracking-wide">{displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Call Button Only (always visible) */}
      <div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full px-4 z-50 md:hidden transition-all duration-500 ease-in-out translate-y-0 opacity-100"
      >
        <div className="flex justify-center">
          <a
            href={telLink}
            className="group flex items-center gap-3 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-base px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-white/20"
          >
            <svg className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="font-bold tracking-wide">{displayPhone}</span>
          </a>
        </div>
      </div>
    </>
  );
}