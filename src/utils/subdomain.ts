import { getAllLocations } from './content';
import { getStateUrl, isValidStateCode, STATE_CODES } from './state-codes';

export { getStateUrl, isValidStateCode, STATE_CODES };

const DOMAIN = 'bennettconstructionandroofing.com';

/** Canonical URL for a location (subdomain format) */
export function getLocationUrl(locationId: string, path = ''): string {
  const base = `https://${locationId}.${DOMAIN}`;
  return path ? `${base}/${path.replace(/^\//, '')}` : base;
}

export function generateSubdomain(locationName: string): string {
  return locationName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function getLocationBySubdomain(subdomain: string) {
  const allLocations = getAllLocations();
  return allLocations.find(loc =>
    loc.id === subdomain.toLowerCase() ||
    generateSubdomain(loc.name) === subdomain.toLowerCase()
  );
}

export async function getAllSubdomains() {
  const allLocations = getAllLocations();
  return allLocations.map(loc => ({
    id: loc.id,
    name: loc.name,
    subdomain: generateSubdomain(loc.name),
    state: loc.state
  }));
}

export function isValidSubdomain(subdomain: string): boolean {
  return getLocationBySubdomain(subdomain) !== undefined;
}
