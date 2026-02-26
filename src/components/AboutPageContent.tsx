"use client";

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import imagesData from '@/data/images.json';
import contentData from '@/data/content.json';

export default function AboutPageContent() {
  const teamImage = imagesData.images.about.team.url;
  const about = contentData.mainWebsite.about;

  const heroTitle = about?.hero?.title || 'Building Trust Nationwide';
  const heroSubtitle = about?.hero?.subtitle || 'Dolimiti Steel Roofing is a premier contractor serving homeowners and businesses across the United States.';
  const heroBadge = about?.hero?.badge || 'Steel Roofing Experts';

  const storyTitle = about?.story?.title || 'Our Story';
  const storyParagraphs = about?.story?.paragraphs || [];
  const storyStats = about?.story?.stats || [];

  const values = about?.values || [];

  return (
    <div className="bg-white font-sans text-gray-900">
      <Header />

      {/* HERO */}
      <section className="relative py-24 px-4 bg-[#4a2c17] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imagesData.images.hero.about.url}
            alt="Dolimiti Steel Roofing Team"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#c4841d] px-4 py-1.5 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">
            {heroBadge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{heroTitle}</h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-light">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl skew-y-1">
            <Image
              src={teamImage}
              alt="The Dolimiti Team"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a2c17] mb-6">{storyTitle}</h2>
            {storyParagraphs.map((p: string, i: number) => (
              <p key={i} className="text-lg text-gray-600 mb-6 leading-relaxed">{p}</p>
            ))}

            {storyStats.length > 0 && (
              <div className="grid grid-cols-2 gap-8">
                {storyStats.map((stat: any, i: number) => (
                  <div key={i}>
                    <div className="text-4xl font-bold text-[#c4841d] mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#4a2c17] mb-16">The Dolimiti Standard</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value: any, i: number) => (
              <div key={i} className={`bg-white p-8 rounded-xl shadow-sm border-t-4 ${i % 2 === 0 ? 'border-[#c4841d]' : 'border-[#4a2c17]'}`}>
                <div className={`w-16 h-16 ${i % 2 === 0 ? 'bg-orange-50' : 'bg-amber-50'} rounded-full flex items-center justify-center text-3xl mx-auto mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#4a2c17] mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
