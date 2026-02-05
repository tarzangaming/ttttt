import { getAllLocations } from './content';

const DOMAIN = 'bennettconstructionandroofing.com';

/** US state codes for state subdomains (az, tx, ny, etc.) */
export const STATE_CODES = ['ca', 'ny', 'tx', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi', 'nj', 'va', 'wa', 'az', 'ma', 'tn', 'in', 'mo', 'md', 'co', 'mn', 'wi', 'sc', 'al', 'la', 'ky', 'or', 'ok', 'ct', 'ut', 'ia', 'nv', 'ar', 'ms', 'ks', 'ne', 'id', 'nh', 'me', 'nm', 'ri', 'hi', 'mt', 'de', 'sd', 'nd', 'ak', 'vt', 'wy', 'wv'] as const;

export function isValidStateCode(code: string): boolean {
  return STATE_CODES.includes(code.toLowerCase() as typeof STATE_CODES[number]);
}

/** Canonical URL for a state (subdomain format) */
export function getStateUrl(stateCode: string, path = ''): string {
  const state = stateCode.toLowerCase();
  const base = `https://${state}.${DOMAIN}`;
  return path ? `${base}/${path.replace(/^\//, '')}` : base;
}

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
