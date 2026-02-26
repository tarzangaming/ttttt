// Content utilities for fetching data from JSON files
import siteConfig from '@/data/site.config.json';
import servicesData from '@/data/services.json';
import imagesData from '@/data/images.json';
import seoData from '@/data/seo.json';
import schemaData from '@/data/schema.json';
import locationsData from '@/data/locations.json';
import serviceContentData from '@/data/service-content.json';
import contentData from '@/data/content.json';

// Types
export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  features?: string[];
  faqs?: { question: string; answer: string }[];
  relatedServices?: string[];
}

export interface ImageData {
  key: string;
  alt: string;
  url: string;
  placeholder: string;
}

// Site Config
export function getSiteConfig() {
  return siteConfig;
}

export function getPhone() {
  return siteConfig.phone;
}

export function getPhoneClean() {
  return siteConfig.phoneClean;
}

export function getCompanyName() {
  return siteConfig.companyName;
}

export function getDomain() {
  return siteConfig.domain;
}

export function getColors() {
  return siteConfig.colors;
}

export function getTrustBadges() {
  return siteConfig.trustBadges;
}

export function getProcess() {
  return siteConfig.process;
}

export function getCompanyInfo() {
  return siteConfig;
}

// Main website content (homepage, about, contact) - editable via admin
export function getMainContent() {
  const data = contentData as { mainWebsite?: Record<string, unknown> };
  return data.mainWebsite ?? { homepage: {}, about: {}, contact: {} };
}

// Location page content templates (with {CITY}, {STATE}, {PHONE} placeholders)
export function getLocationContent() {
  const data = contentData as { locationPages?: Record<string, unknown> };
  return data.locationPages ?? { hero: {}, whyChooseUs: {}, features: [], cta: {} };
}

// Locations - matches original locations.json flat array structure
export interface Location {
  id: string;
  name: string;
  state: string;
  fullName: string;
  description: string;
  phone: string;
  heroTitle: string;
  heroSubtitle: string;
  services: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  areas: string[];
  zipCodes: string[];
  image: string;
  meta: {
    title: string;
    description: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  testimonials: Array<{
    name: string;
    text: string;
    location: string;
  }>;
}

export function getAllLocations(): Location[] {
  // Original format: flat array at locationsData.locations
  const data = locationsData as { locations: Location[] };
  return data.locations || [];
}

const STATE_MAP: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new-hampshire': 'NH', 'new-jersey': 'NJ',
  'new-mexico': 'NM', 'new-york': 'NY', 'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
  'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};

const REVERSE_STATE_MAP = Object.entries(STATE_MAP).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {} as Record<string, string>);

export function getAllStates(): { name: string; slug: string; code: string }[] {
  return Object.entries(STATE_MAP).map(([slug, code]) => {
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { name, slug, code };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

// Representative zipcodes for states when location data has no zipCodes (used for state-level pages)
const STATE_REPRESENTATIVE_ZIPS: Record<string, string> = {
  AL: '35203', AK: '99501', AZ: '85001', AR: '72201', CA: '90001', CO: '80201', CT: '06101',
  DE: '19901', FL: '33101', GA: '30301', HI: '96801', ID: '83701', IL: '60601', IN: '46201',
  IA: '50301', KS: '67201', KY: '40201', LA: '70101', ME: '04101', MD: '21201', MA: '02101',
  MI: '48201', MN: '55401', MS: '39201', MO: '63101', MT: '59101', NE: '68101', NV: '89101',
  NH: '03101', NJ: '07101', NM: '87101', NY: '10001', NC: '28201', ND: '58101', OH: '43201',
  OK: '73101', OR: '97201', PA: '19101', RI: '02901', SC: '29201', SD: '57101', TN: '37201',
  TX: '77001', UT: '84101', VT: '05401', VA: '23219', WA: '98101', WV: '25301', WI: '53201', WY: '82001'
};

function generateVirtualStateLocation(slug: string, stateCode: string): Location {
  const stateName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const allLocations = getAllLocations();
  const firstWithZip = allLocations.find(loc => loc.state === stateCode && loc.zipCodes?.length > 0);
  const fallbackZip = STATE_REPRESENTATIVE_ZIPS[stateCode];
  const representativeZip = firstWithZip?.zipCodes?.[0]
    ? [firstWithZip.zipCodes[0]]
    : fallbackZip ? [fallbackZip] : [];

  return {
    id: slug,
    name: stateName,
    state: stateCode,
    fullName: `${stateName}, ${stateCode}`,
    description: `Professional Roofing & Construction services across ${stateName}. Licensed, bonded, and insured statewide.`,
    phone: getPhone(),
    heroTitle: `Premier Roofing Contractor in ${stateName}`,
    heroSubtitle: `Expert residential and commercial roofing services serving the entire state of ${stateName}.`,
    services: [], // Will use dynamic grid
    areas: ['Statewide Service'],
    zipCodes: representativeZip,
    image: getHeroImage('locations').url,
    meta: {
      title: `Top Rated Roofing Company in ${stateName} | Dolomiti Steel Roofing`,
      description: `Licensed roofing contractor serving ${stateName}. Residential & Commercial. Free Estimates. Call ${getPhone()}.`
    },
    faqs: [
      {
        question: `Do you service all of ${stateName}?`,
        answer: `Yes, we have crews positioned to serve most major metro areas and rural communities throughout ${stateName}.`
      },
      {
        question: "Are you licensed for state-wide projects?",
        answer: "Absolutely. We hold all necessary state licenses and insurance required for residential and commercial projects."
      }
    ],
    testimonials: []
  };
}

/** Invalid placeholder zip codes to never display */
const INVALID_ZIP_CODES = ['00000', '0'];

export function getLocationZipCodes(location: Location): string[] {
  const raw = location.zipCodes?.length
    ? location.zipCodes.filter(z => !INVALID_ZIP_CODES.includes(String(z).trim()))
    : [];
  if (raw.length > 0) return raw;
  const fallback = STATE_REPRESENTATIVE_ZIPS[location.state];
  return fallback ? [fallback] : [];
}

export function getLocationById(id: string): Location | undefined {
  const locations = getAllLocations();
  const directMatch = locations.find(loc => loc.id === id);
  if (directMatch) return directMatch;

  // Check for State Slug match
  const stateCode = STATE_MAP[id.toLowerCase()];
  if (stateCode) {
    return generateVirtualStateLocation(id, stateCode);
  }

  return undefined;
}

export function getLocationBySlug(slug: string): Location | undefined {
  const locations = getAllLocations();
  // Original format uses 'id' as the slug
  return locations.find(loc => loc.id === slug);
}

/** Get nearby locations in the same state for internal linking (excludes current location).
 * Uses alphabetical position to show different "nearby" areas per page instead of the same list everywhere. */
export function getNearbyLocations(currentLocationId: string, state: string, limit = 24): Location[] {
  const locations = getAllLocations();
  const allInState = locations
    .filter(loc => loc.state === state)
    .sort((a, b) => a.name.localeCompare(b.name));

  const currentIndex = allInState.findIndex(loc => loc.id === currentLocationId);
  if (currentIndex < 0) {
    return allInState.filter(loc => loc.id !== currentLocationId).slice(0, limit);
  }

  const before = allInState.slice(0, currentIndex);
  const after = allInState.slice(currentIndex + 1);
  const half = Math.floor(limit / 2);

  const fromBefore = before.slice(-half);
  const fromAfter = after.slice(0, limit - fromBefore.length);
  return [...fromBefore, ...fromAfter];
}

// Services
function flattenServices(): Service[] {
  const data = servicesData as any;
  if (data.servicesByCategory) {
    return Object.values(data.servicesByCategory).flat() as Service[];
  }
  if (data.services) return data.services;
  return [];
}

export function getAllServices(): Service[] {
  return flattenServices();
}

export function getServiceBySlug(slug: string): Service | undefined {
  return flattenServices().find((s: Service) => s.slug === slug);
}

export function getServicesByCategory(category: string): Service[] {
  return flattenServices().filter((s: Service) => s.category === category);
}

export function getServiceCategories() {
  return servicesData.serviceCategories;
}

export function getServiceSlugs(): string[] {
  return flattenServices().map((s: Service) => s.slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);
  if (!service || !service.relatedServices) return [];
  return service.relatedServices
    .map((relatedSlug: string) => getServiceBySlug(relatedSlug))
    .filter((s): s is Service => s !== undefined);
}

// Images
export function getImage(category: string, key: string): ImageData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = imagesData.images as any;
  const categoryImages = images[category];
  if (categoryImages && categoryImages[key]) {
    return categoryImages[key];
  }
  // Return default placeholder
  return images.defaults.placeholder;
}

export function getServiceImage(slug: string): ImageData {
  return getImage('services', slug);
}

export function getHeroImage(page: string): ImageData {
  return getImage('hero', page);
}

export function getImageUrl(category: string, key: string): string {
  const image = getImage(category, key);
  // Use url if available, otherwise use placeholder
  return image.url || image.placeholder;
}

// SEO
export function getPageSEO(page: string) {
  const pages = seoData.pages as Record<string, {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
  }>;
  return pages[page] || null;
}

export function getSEODefaults() {
  return seoData.defaults;
}

export function getServiceSEO(service: Service) {
  const template = seoData.templates.service;
  return {
    title: template.title.replace('{serviceTitle}', service.title),
    description: template.description.replace('{serviceTitle}', service.title),
    canonical: template.canonical.replace('{slug}', service.slug),
  };
}

export function getLocationSEO(cityName: string, state: string, locationIdOrSubdomain: string) {
  const templates = seoData.templates as Record<string, { title: string; description: string; canonical?: string }>;
  const template = templates?.location || { title: '', description: '', canonical: '' };
  const canonical = (template.canonical || '')
    .replace('{subdomain}', locationIdOrSubdomain)
    .replace('{locationId}', locationIdOrSubdomain);
  return {
    title: template.title
      .replace('{cityName}', cityName)
      .replace('{state}', state),
    description: template.description
      .replace('{cityName}', cityName)
      .replace('{state}', state),
    canonical,
  };
}

export function getLocationServiceSEO(
  cityName: string,
  state: string,
  serviceTitle: string,
  serviceSlug: string,
  locationIdOrSubdomain: string
) {
  const templates = seoData.templates as Record<string, { title: string; description: string; canonical?: string }>;
  const template = templates?.locationService || { title: '', description: '', canonical: '' };
  const canonical = (template.canonical || '')
    .replace('{subdomain}', locationIdOrSubdomain)
    .replace('{locationId}', locationIdOrSubdomain)
    .replace('{slug}', serviceSlug);
  return {
    title: template.title
      .replace('{cityName}', cityName)
      .replace('{state}', state)
      .replace('{serviceTitle}', serviceTitle),
    description: template.description
      .replace('{cityName}', cityName)
      .replace('{state}', state)
      .replace('{serviceTitle}', serviceTitle),
    canonical,
  };
}

// Schema
export function getOrganizationSchema() {
  return schemaData.organization;
}

export function getLocalBusinessSchema() {
  return schemaData.localBusiness;
}

export function getWebsiteSchema() {
  return schemaData.website;
}

export function generateServiceSchema(service: Service) {
  const template = schemaData.templates.service;
  return {
    ...template,
    serviceType: service.title,
    description: service.description,
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateLocalBusinessCitySchema(
  cityName: string,
  state: string,
  subdomain: string
) {
  const template = schemaData.templates.localBusinessCity;
  return {
    ...template,
    name: `Dolomiti Steel Roofing - ${cityName}`,
    url: `https://${subdomain}.dolomitisteelroofing.com`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: state,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
  };
}

// Placeholder Replacement Utility
export function replacePlaceholders(
  text: string | undefined,
  replacements: Record<string, string>
): string {
  if (!text) return '';
  let result = text;
  Object.entries(replacements).forEach(([key, value]) => {
    // Escape special characters in the key if necessary, though {{KEY}} is simple
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
}

// Extended Service Content
export function getExtendedServiceContent(slug: string) {
  const data = serviceContentData as any;
  // Fallback to roof-installation if new-roof-installation is used or vice-versa
  let normalizedSlug = slug;
  if (slug === 'new-roof-installation') normalizedSlug = 'new-roof-installation';
  // Keep it simple for now, direct match
  return data.templates[normalizedSlug] || null;
}
