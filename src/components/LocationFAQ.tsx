import React, { useMemo } from 'react';
import locationExtras from '@/data/location-extras.json';
import siteConfig from '@/data/site.config.json';

interface FAQItem {
  question: string;
  answer: string;
}

interface LocationFAQProps {
  locationName: string;
  stateName: string;
  phone?: string;
  companyName?: string;
}

const LocationFAQ: React.FC<LocationFAQProps> = ({
  locationName,
  stateName,
  phone = siteConfig.phone,
  companyName = siteConfig.companyName
}) => {
  const replacePlaceholders = (text: string) => {
    return text
      .replaceAll('{{CITY}}', locationName)
      .replaceAll('{{STATE}}', stateName)
      .replaceAll('{{PHONE}}', phone)
      .replaceAll('{{COMPANY_NAME}}', companyName);
  };

  // Pseudo-random selection based on locationName seed
  const selectedFAQs = useMemo(() => {
    const seed = locationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...locationExtras.faqs].sort((a, b) => {
      const hashA = (a.question.length * seed) % 100;
      const hashB = (b.question.length * seed) % 100;
      return hashA - hashB;
    });
    // Select between 10 and 14 questions
    const count = 10 + (seed % 5);
    return shuffled.slice(0, count);
  }, [locationName]);

  return (
    <section className="py-20 px-4 bg-white" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#4a2c17] mb-6">
            Roofing FAQs in {locationName}, {stateName}
          </h2>
          <p className="text-xl text-gray-600">
            Common questions about roof repair, replacement, pricing, and materials in {locationName}.
            If you still have questions, call <span className="font-bold text-[#c4841d]">{phone}</span>—we’ll help.
          </p>
        </div>

        <div className="space-y-4">
          {selectedFAQs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-[#c4841d] hover:shadow-md"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none list-inside">
                <h3 className="text-lg md:text-xl font-bold text-[#4a2c17] pr-8 group-open:text-[#c4841d] transition-colors">
                  {replacePlaceholders(faq.question)}
                </h3>
                <span className="relative flex-shrink-0 ml-4">
                  <svg
                    className="w-6 h-6 text-[#c4841d] transform transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-700 leading-relaxed text-lg">
                <p>{replacePlaceholders(faq.answer)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationFAQ;