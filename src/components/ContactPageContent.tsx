"use client";

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import imagesData from '@/data/images.json';
import contentData from '@/data/content.json';

export default function ContactPageContent() {
  const contact = contentData.mainWebsite.contact;

  const heroTitle = contact?.hero?.title || 'Contact Us';
  const heroSubtitle = contact?.hero?.subtitle || 'Get a free estimate for your roofing or construction project. We serve communities across the USA.';

  const hq = contact?.info?.headquarters || { title: 'Main Office', address: 'Nationwide Service Provider\nUnited States' };
  const phoneInfo = contact?.info?.phone || { title: 'Phone', subtitle: 'Customer Support Line', number: '(866) 289-1750' };
  const hours = contact?.info?.hours || { title: 'Hours', weekdays: 'Mon-Fri: 7am - 6pm', weekends: 'Sat: By Appointment | Sun: Closed' };

  const phoneClean = phoneInfo.number.replace(/\D/g, '');

  return (
    <div className="bg-white font-sans text-gray-900">
      <Header />

      {/* HERO */}
      <section className="relative py-24 px-4 flex items-center justify-center overflow-hidden min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src={imagesData.images.hero.contact.url}
            alt={heroTitle}
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.3)' }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#4a2c17]/80 to-transparent z-0" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">{heroTitle}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-1 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-[#4a2c17] mb-8">Get In Touch</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shrink-0">🏢</div>
                <div>
                  <h3 className="font-bold text-lg text-[#4a2c17]">{hq.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{hq.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shrink-0">📞</div>
                <div>
                  <h3 className="font-bold text-lg text-[#4a2c17]">{phoneInfo.title}</h3>
                  <p className="text-gray-600 mb-1">{phoneInfo.subtitle}</p>
                  <a href={`tel:${phoneClean}`} className="text-xl font-bold text-[#c4841d] hover:underline">{phoneInfo.number}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl shrink-0">🕒</div>
                <div>
                  <h3 className="font-bold text-lg text-[#4a2c17]">{hours.title}</h3>
                  <p className="text-gray-600">{hours.weekdays}</p>
                  <p className="text-gray-600">{hours.weekends}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-[#4a2c17] mb-2">Prefer to Talk to a Real Person?</h4>
              <p className="text-gray-600 text-sm">
                Call us at{' '}
                <a href={`tel:${phoneClean}`} className="font-bold text-[#c4841d] hover:underline">
                  {phoneInfo.number}
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
