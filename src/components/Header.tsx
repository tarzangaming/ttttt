"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import imagesData from '@/data/images.json';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubDomain, setIsSubDomain] = useState(false);

  const logoImage = imagesData.images.defaults?.logo;

  useEffect(() => {
    // Check if we're on a sub-domain (not main domain - non-www canonical)
    const hostname = window.location.hostname;
    const isSub = hostname !== 'dolomitisteelroofing.com' &&
      hostname.includes('.dolomitisteelroofing.com');
    setIsSubDomain(isSub);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {logoImage?.url ? (
                <div className="relative h-12 w-40 md:h-14 md:w-48">
                  <Image
                    src={logoImage.url}
                    alt={logoImage.alt || 'Dolomiti Steel Roofing'}
                    fill
                    className="object-contain"
                    priority
                    sizes="200px"
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="bg-[#1e3a5f] text-white p-2 rounded-lg mr-2">
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[#1e3a5f] font-bold text-lg leading-tight">Dolomiti</div>
                    <div className="text-[#d97706] text-xs font-semibold">Construction & Roofing</div>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Menu - Desktop Only */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-[#1e3a5f] px-4 py-2 text-base font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg relative group">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            {!isSubDomain && (
              <Link href="/locations" className="text-gray-700 hover:text-[#1e3a5f] px-4 py-2 text-base font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg relative group">
                <span className="relative z-10">Locations</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
            <Link href="/services" className="text-gray-700 hover:text-[#1e3a5f] px-4 py-2 text-base font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg relative group">
              <span className="relative z-10">Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#1e3a5f] px-4 py-2 text-base font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg relative group">
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#1e3a5f] px-4 py-2 text-base font-semibold transition-all duration-300 hover:bg-gray-50 rounded-lg relative group">
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* CTA Buttons - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2d5a8a] transition flex items-center"
            >
              Get a Quote
            </Link>
            <a href="tel:8662891750" className="bg-[#d97706] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b45309] transition flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>(866) 289-1750</span>
            </a>
          </div>

          {/* Mobile Menu Button - Mobile Only */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-[#1e3a5f] p-2 rounded-lg transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Mobile Only */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {!isSubDomain && (
                <Link
                  href="/locations"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Locations
                </Link>
              )}
              <Link
                href="/services"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  href="/contact"
                  className="block px-3 py-3 text-base font-semibold bg-[#1e3a5f] text-white rounded-md hover:bg-[#2d5a8a] transition-colors duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get a Quote
                </Link>
                <a
                  href="tel:8662891750"
                  className="block px-3 py-2 text-base font-medium bg-[#d97706] text-white rounded-md hover:bg-[#b45309] transition-colors duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (866) 289-1750
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}