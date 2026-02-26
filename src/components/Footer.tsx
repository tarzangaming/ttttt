"use client";
import Link from 'next/link';
import Image from 'next/image';
import imagesData from '@/data/images.json';

interface FooterProps {
  location?: {
    name: string;
    state: string;
  };
}

export default function Footer({ location }: FooterProps) {
  const ctaImage = (imagesData as any).images?.cta?.banner;

  return (
    <>
      {/* 24/7 CTA Banner */}
      <section className="py-4 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#0f1f33] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Need a Roofer or Contractor?<br />We&apos;re Here to Help!
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="bg-[#d97706] rounded-lg p-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm opacity-90 mb-1">CALL FOR FREE ESTIMATE</div>
                  <div className="text-2xl md:text-3xl font-bold">(866) 289-1750</div>
                </div>
              </div>
            </div>

            {/* Right Side - CTA Image */}
            <div className="flex-1 flex justify-center lg:justify-end items-end">
              <div className="w-48 h-32 sm:w-64 sm:h-40 lg:w-80 lg:h-48 relative rounded-lg overflow-hidden">
                {ctaImage?.url ? (
                  <Image
                    src={ctaImage.url}
                    alt={ctaImage.alt || 'Call to action image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 256px, 320px"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2d5a8a]/30 flex items-center justify-center">
                    <span className="text-white/50 text-sm">No image set</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Service Area Map
          </h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <iframe
              title="Google Map"
              height="350"
              width="100%"
              src={location
                ? `https://maps.google.com/maps?q=${encodeURIComponent(location.name + ', ' + location.state)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                : "https://maps.google.com/maps?q=United+States&t=&z=4&ie=UTF8&iwloc=&output=embed"
              }
              loading="lazy"
              className="w-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* Big CTA Banner */}
      <section className="bg-[#d97706] text-white py-16 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready for Your Free Roofing Estimate?</h2>
          <div className="mb-8">
            <a
              href="tel:8662891750"
              className="bg-white text-[#1e3a5f] font-bold px-12 py-6 rounded-xl text-3xl hover:bg-gray-50 transition shadow-lg inline-block"
            >
              (866) 289-1750
            </a>
          </div>
          <p className="text-lg opacity-90">Licensed • Insured • 25+ Years Experience</p>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="bg-[#1e3a5f] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Dolomiti Steel Roofing</h3>
              <p className="text-gray-300 mb-4">Quality roofing and construction services you can trust. Serving homeowners and businesses for over 25 years.</p>
              <div className="flex space-x-4">
                <a href="tel:8662891750" className="text-[#d97706] hover:text-[#f59e0b] transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-4">Roofing Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/services/roof-repair" className="hover:text-[#d97706] transition">Roof Repair</Link></li>
                <li><Link href="/services/roof-replacement" className="hover:text-[#d97706] transition">Roof Replacement</Link></li>
                <li><Link href="/services/storm-damage-roof-repair" className="hover:text-[#d97706] transition">Storm Damage</Link></li>
                <li><Link href="/services/commercial-roofing" className="hover:text-[#d97706] transition">Commercial Roofing</Link></li>
              </ul>
            </div>

            {/* More Services */}
            <div>
              <h3 className="text-xl font-bold mb-4">More Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/services/gutter-installation" className="hover:text-[#d97706] transition">Gutter Installation</Link></li>
                <li><Link href="/services/siding-installation" className="hover:text-[#d97706] transition">Siding Installation</Link></li>
                <li><Link href="/services/general-construction" className="hover:text-[#d97706] transition">General Construction</Link></li>
                <li><Link href="/services/home-remodeling" className="hover:text-[#d97706] transition">Home Remodeling</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-[#d97706] transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#d97706] transition">Contact</Link></li>
                <li><Link href="/services" className="hover:text-[#d97706] transition">All Services</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Dolomiti Steel Roofing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
