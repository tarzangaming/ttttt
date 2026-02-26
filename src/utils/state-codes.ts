/**
 * State/subdomain helpers with zero dependencies.
 * Safe for Edge runtime (middleware) - no imports from content.
 */

const DOMAIN = 'dolimitisteelroofing.com';

/** US state codes for state subdomains */
export const STATE_CODES = [
  'ca', 'ny', 'tx', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi', 'nj', 'va', 'wa',
  'az', 'ma', 'tn', 'in', 'mo', 'md', 'co', 'mn', 'wi', 'sc', 'al', 'la', 'ky',
  'or', 'ok', 'ct', 'ut', 'ia', 'nv', 'ar', 'ms', 'ks', 'ne', 'id', 'nh', 'me',
  'nm', 'ri', 'hi', 'mt', 'de', 'sd', 'nd', 'ak', 'vt', 'wy', 'wv',
] as const;

export function isValidStateCode(code: string): boolean {
  return STATE_CODES.includes(code.toLowerCase() as (typeof STATE_CODES)[number]);
}

export function getStateUrl(stateCode: string, path = ''): string {
  const state = stateCode.toLowerCase();
  const base = `https://${state}.${DOMAIN}`;
  return path ? `${base}/${path.replace(/^\//, '')}` : base;
}
