'use client';

import { useState } from 'react';

interface NeighborhoodsAccordionProps {
  neighborhoods: string[];
  cityName: string;
  stateName: string;
}

export default function NeighborhoodsAccordion({ neighborhoods, cityName, stateName }: NeighborhoodsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Neighborhoods in {cityName}
      </h3>
      
      {/* Accordion Container */}
      <div 
        className="overflow-hidden text-sm transition-all duration-300"
        style={{
          '--radix-accordion-content-height': isOpen ? 'auto' : '0px',
          '--radix-accordion-content-width': '100%',
          '--radix-collapsible-content-height': isOpen ? '430px' : '0px',
          '--radix-collapsible-content-width': '100%'
        } as React.CSSProperties}
      >
        <div className="pb-4 pt-0">
          <div className="mx-10 mt-4 flex h-fit w-auto flex-wrap justify-center gap-4">
            {neighborhoods.map((neighborhood, index) => (
              <div key={index} className="">
                <a 
                  target="_blank" 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(neighborhood + ' , ' + cityName + '-' + stateName.toLowerCase() + ',')}`}
                  rel="noopener noreferrer"
                >
                  <p className="border bg-[#4a2c17] px-2 py-1 text-white duration-100 ease-in-out hover:text-gray-200 rounded-sm">
                    {neighborhood}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toggle Button */}
      <div className="text-center mt-4">
        <button
          onClick={toggleAccordion}
          className="bg-[#4a2c17] text-white px-6 py-2 rounded-lg hover:bg-[#6b3d22] transition-colors duration-200"
        >
          {isOpen ? 'Hide Neighborhoods' : 'Show Neighborhoods'}
        </button>
      </div>
    </div>
  );
} 