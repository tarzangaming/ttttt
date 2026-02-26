import React, { useMemo } from 'react';
import locationExtras from '@/data/location-extras.json';

interface Testimonial {
  type: string;
  quote: string;
  name: string;
  rating: number;
}

interface LocationTestimonialsProps {
  locationName: string;
  stateName: string;
  companyName?: string;
  phone?: string;
}

const LocationTestimonials: React.FC<LocationTestimonialsProps> = ({
  locationName,
  stateName,
  companyName = 'Dolomiti Steel Roofing',
  phone = '(866) 289-1750'
}) => {
  const replacePlaceholders = (text: string) => {
    return text
      .replaceAll('{{CITY}}', locationName)
      .replaceAll('{{STATE}}', stateName)
      .replaceAll('{{COMPANY_NAME}}', companyName)
      .replaceAll('{{PHONE}}', phone);
  };

  // Pseudo-random selection based on locationName seed
  const selectedTestimonials = useMemo(() => {
    const seed = locationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...locationExtras.testimonials].sort((a, b) => {
      const hashA = (a.name.length + seed) % 10;
      const hashB = (b.name.length + seed) % 10;
      return hashA - hashB;
    });
    return shuffled.slice(0, 6); // Pick 6 for a good grid/slider
  }, [locationName]);

  return (
    <section className="py-20 px-4 bg-gray-50 overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
            What {locationName} Homeowners Say About {companyName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real feedback from local customers in {locationName}, {stateName}—roof repairs, replacements,
            storm restoration, and construction projects completed with quality craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 italic text-lg leading-relaxed mb-6 flex-grow">
                &quot;{replacePlaceholders(t.quote)}&quot;
              </p>

              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#1e3a5f]">{t.name}</h4>
                  <p className="text-sm text-gray-500">{locationName}, {stateName}</p>
                </div>
                <span className="bg-[#1e3a5f]/5 text-[#1e3a5f] text-xs font-bold px-3 py-1 rounded-full">
                  {t.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#1e3a5f] rounded-3xl p-10 text-center text-white shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to start your roofing project in {locationName}, {stateName}?
          </h3>
          <p className="text-xl opacity-90 mb-8">
            Call {phone} or request a free quote today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-xl"
            >
              Call {phone}
            </a>
            <a
              href="/contact"
              className="bg-white text-[#1e3a5f] hover:bg-gray-100 font-bold px-10 py-4 rounded-xl text-lg transition shadow-xl"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationTestimonials;