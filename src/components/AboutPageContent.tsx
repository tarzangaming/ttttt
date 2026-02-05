"use client";

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import imagesData from '@/data/images.json';

export default function AboutPageContent() {
  const teamImage = imagesData.images.about.team.url;

  return (
    <div className="bg-white font-sans text-gray-900">
      <Header />

      {/* 1. HERO */}
      <section className="relative py-24 px-4 bg-[#1e3a5f] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imagesData.images.hero.about.url}
            alt="Bennett Construction Team"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#d97706] px-4 py-1.5 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">
            Since 2000
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Building Trust Nationwide</h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-light">
            Bennett Construction & Roofing is a premier contractor serving homeowners and businesses across the United States.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl skew-y-1">
            <Image
              src={teamImage}
              alt="The Bennett Family"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              What started as a small family operation in Arizona has grown into a trusted national brand. Bennett Construction & Roofing was founded on a simple principle: treat every home like it&apos;s our own.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Over the last two decades, we have expanded our reach, bringing our signature quality and customer service to communities across the country. Whether it&apos;s a storm restoration project in the Midwest or a new tile roof in the Southwest, our standards remain the same.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold text-[#d97706] mb-1">10k+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#d97706] mb-1">50+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Cities Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-16">The Bennett Standard</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#d97706]">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🤝</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Integrity</h3>
              <p className="text-gray-600">We believe in transparent pricing and clear communication. No hidden fees, ever.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#1e3a5f]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🛡️</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Quality</h3>
              <p className="text-gray-600">We partner with top manufacturers to ensure every material we install is backed by industry-leading warranties.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#d97706]">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Safety</h3>
              <p className="text-gray-600">Our crews are rigorously trained in OSHA safety standards to protect your property and our team.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
