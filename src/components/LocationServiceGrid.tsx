import Link from 'next/link';
import locationServicesData from '@/data/location-services.json';
import imagesData from '@/data/images.json';

interface LocationServiceGridProps {
    locationId: string;
    locationName: string;
    stateName: string;
    phone?: string;
    companyName?: string;
}

const LocationServiceGrid: React.FC<LocationServiceGridProps> = ({
    locationId,
    locationName,
    stateName,
    phone = '(866) 289-1750',
    companyName = 'Bennett Construction & Roofing'
}) => {
    const replacePlaceholders = (text: string) => {
        return text
            .replaceAll('{{CITY}}', locationName)
            .replaceAll('{{STATE}}', stateName)
            .replaceAll('{{PHONE}}', phone)
            .replaceAll('{{COMPANY_NAME}}', companyName);
    };

    return (
        <section className="py-20 px-4 bg-gray-50" id="service-grid">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
                        Roofing & Construction Services in {locationName}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Professional roofing solutions tailored for {locationName}, {stateName} property owners.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {locationServicesData.services.map((service: any) => (
                        <div
                            key={service.slug}
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2 relative"
                        >
                            <Link
                                href={locationId === 'national' ? `/services/${service.slug}` : `/locations/${locationId}/${service.slug}`}
                                className="absolute inset-0 z-10"
                                aria-label={`View ${service.title} services in ${locationName}`}
                            />
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300" role="img" aria-label={service.title}>
                                    {service.icon}
                                </span>
                                <h3 className="text-2xl font-bold text-[#1e3a5f] group-hover:text-[#d97706] transition-colors leading-tight">
                                    {service.title}
                                </h3>
                            </div>

                            <div className="flex-grow">
                                <h4 className="text-lg font-semibold text-[#1e3a5f] mb-4">
                                    {replacePlaceholders(service.subtitle)}
                                </h4>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    {replacePlaceholders(service.description)}
                                </p>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div
                                    className="block w-full text-center bg-[#d97706] text-white font-bold py-4 rounded-xl hover:bg-[#b45309] transition-all shadow-md group-hover:shadow-lg relative z-20 pointer-events-none"
                                >
                                    {service.cta}
                                </div>
                                <div className="flex items-center justify-center gap-2 text-[#1e3a5f] font-semibold relative z-20">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-[#d97706] transition-colors">
                                        {phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationServiceGrid;
