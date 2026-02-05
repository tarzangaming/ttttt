"use client";

import Header from '@/components/Header';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/components/Footer';

export default function TanklessWaterHeaterPageContent() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative h-[80vh] overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90">
          <img 
            src="https://ik.imagekit.io/nang9yead/Worker%20Adjusting%20Water%20Filtration%20System%20Valves?updatedAt=1756066968225" 
            alt="Tankless water heater installation"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Licensed & Insured
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Expert Tankless Water Heater Installation Services in the US
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl opacity-95 max-w-5xl mx-auto leading-relaxed mb-8">
              Professional installation of energy-efficient tankless water heaters. Endless hot water, lower utility bills, and space-saving design!
            </p>
          </div>
        </div>
        <FloatingCTA phone="8662891750" locationName="Your Area" />
      </section>

      {/* SEO Intro Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Find the Best Tankless Water Heater Installation Services
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Looking for reliable tankless water heater installation? Our team of licensed and certified plumbers provides exceptional service at competitive prices. Whether you need new installation, replacement, or maintenance, we're your trusted plumbing experts. Serving residential and commercial properties with 24/7 availability and guaranteed satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:8662891750"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg text-lg transition-colors duration-300"
            >
              Call (866) 289-1750 Now
            </a>
          </div>
        </div>
      </section>

      {/* Search Block */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Are you searching for expert tankless water heater installation?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Look no further! GD Professional Plumbing is your trusted plumbing expert. We provide comprehensive tankless water heater solutions for both residential and commercial properties, with 24/7 emergency service availability.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-blue-700 mb-3">Residential Installation</h3>
                  <p className="text-gray-600 text-sm">
                    Professional tankless water heater installation for homes with proper sizing and energy efficiency.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-blue-700 mb-3">Commercial Installation</h3>
                  <p className="text-gray-600 text-sm">
                    Large-scale tankless water heater systems for businesses with minimal downtime and maximum efficiency.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://ik.imagekit.io/nang9yead/Smiling%20Plumber%20Holding%20Wrench%20in%20Kitchen.png?updatedAt=1756066963942" 
                alt="Professional plumber working"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Emergency Service</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">15 Min</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Why Choose Tankless Water Heaters?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the advantages of tankless water heaters and why they're becoming the preferred choice for modern homes and businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-4">♾️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Endless Hot Water</h3>
              <p className="text-gray-600">
                Never run out of hot water again. Tankless water heaters provide continuous hot water on demand.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Energy Savings</h3>
              <p className="text-gray-600">
                Save up to 30% on energy bills compared to traditional tank water heaters.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Space Saving</h3>
              <p className="text-gray-600">
                Compact design saves valuable space in your home or business.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                Reduce your carbon footprint with energy-efficient tankless technology.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Heating</h3>
              <p className="text-gray-600">
                Get hot water instantly without waiting for a tank to heat up.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Longer Lifespan</h3>
              <p className="text-gray-600">
                Tankless water heaters typically last 20+ years with proper maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Comprehensive Tankless Water Heater Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From installation to maintenance, we provide complete tankless water heater solutions for all your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">New Installation</h3>
              <p className="text-gray-600 mb-4">
                Professional installation of new tankless water heater systems with proper sizing and configuration.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Proper sizing for your needs</li>
                <li>• Professional installation</li>
                <li>• Code compliance</li>
                <li>• Warranty coverage</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Replacement</h3>
              <p className="text-gray-600 mb-4">
                Upgrade your existing water heater to an energy-efficient tankless system.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• System evaluation</li>
                <li>• Seamless replacement</li>
                <li>• Minimal disruption</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Repair & Maintenance</h3>
              <p className="text-gray-600 mb-4">
                Expert repair and maintenance services to keep your tankless water heater running efficiently.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Diagnostic services</li>
                <li>• Component replacement</li>
                <li>• Preventive maintenance</li>
                <li>• Performance tuning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Upgrade to Tankless?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Contact us today for a free consultation and estimate. Our experts will help you choose the perfect tankless water heater for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:8662891750"
              className="inline-flex items-center bg-white text-blue-600 font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (866) 289-1750
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
