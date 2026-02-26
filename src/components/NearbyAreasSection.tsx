import Link from 'next/link';
import type { Location } from '@/utils/content';
import { getLocationUrl } from '@/utils/subdomain';

interface NearbyAreasSectionProps {
  nearbyLocations: Location[];
  currentLocationName: string;
  state: string;
  /** Optional custom heading. Default: "Nearby Areas We Serve" */
  title?: string;
}

export default function NearbyAreasSection({
  nearbyLocations,
  currentLocationName,
  state,
  title = 'Nearby Areas We Serve'
}: NearbyAreasSectionProps) {
  if (nearbyLocations.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {nearbyLocations.map((loc) => (
            <Link
              key={loc.id}
              href={getLocationUrl(loc.id)}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition py-4 px-4 text-center font-medium text-gray-800 hover:text-[#c4841d] border border-gray-100"
            >
              {loc.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
