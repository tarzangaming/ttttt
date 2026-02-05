'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocationUrl } from '@/utils/subdomain';

interface Location {
  id: string;
  name: string;
  state: string;
  fullName: string;
}

interface ServiceAreasProps {
  currentLocation: {
    name: string;
    state: string;
    areas: string[];
    zipCodes?: string[];
    phone: string;
  };
}

export default function ServiceAreas({ currentLocation }: ServiceAreasProps) {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [visibleCities, setVisibleCities] = useState(24);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        setAllLocations(data.locations || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const loadMoreCities = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCities(prev => prev + 24);
      setIsLoading(false);
    }, 500);
  };

  // Shuffle the cities to randomize their positions
  const shuffleArray = (array: Location[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const displayedCities = shuffleArray(allLocations).slice(0, visibleCities);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Areas We Serve
        </h2>
        
        {/* Cities We Serve */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
            Cities We Serve Near {currentLocation.name}, {currentLocation.state}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {displayedCities.map((location) => (
              <div key={location.id} className="group">
                <Link
                  href={getLocationUrl(location.id)}
                  className="block bg-gray-50 border border-gray-200 rounded-md px-2 py-2 text-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer group-hover:shadow-sm"
                >
                  <div className="text-gray-800 font-medium text-xs leading-tight">
                    {location.name}
                  </div>
                  <div className="text-blue-600 text-xs font-medium mt-1">
                    {location.state}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {visibleCities < allLocations.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreCities}
                disabled={isLoading}
                className="inline-flex items-center bg-[#1c7bc8] hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    View More Cities
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Service Area Map Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Service Area Map
          </h3>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg font-medium">Comprehensive Coverage</p>
              <p className="text-sm mt-2">We provide professional plumbing services throughout {currentLocation.state} and surrounding areas.</p>
            </div>
            <div className="flex justify-center">
              <a
                href={`tel:${currentLocation.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center bg-[#1c7bc8] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call {currentLocation.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 