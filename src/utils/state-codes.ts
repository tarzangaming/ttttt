/**
 * State/subdomain helpers with zero dependencies.
 * Safe for Edge runtime (middleware) - no imports from content.
 */

import siteConfig from '@/data/site.config.json';

const DOMAIN = siteConfig.domain;

/** US state codes for state subdomains */
export const STATE_CODES = [
  'ca', 'ny', 'tx', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi', 'nj', 'va', 'wa',
  'az', 'ma', 'tn', 'in', 'mo', 'md', 'co', 'mn', 'wi', 'sc', 'al', 'la', 'ky',
  'or', 'ok', 'ct', 'ut', 'ia', 'nv', 'ar', 'ms', 'ks', 'ne', 'id', 'nh', 'me',
  'nm', 'ri', 'hi', 'mt', 'de', 'sd', 'nd', 'ak', 'vt', 'wy', 'wv',
] as const;

export const CODE_TO_SLUG: Record<string, string> = {
  'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas', 'ca': 'california',
  'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware', 'fl': 'florida', 'ga': 'georgia',
  'hi': 'hawaii', 'id': 'idaho', 'il': 'illinois', 'in': 'indiana', 'ia': 'iowa',
  'ks': 'kansas', 'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
  'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi', 'mo': 'missouri',
  'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada', 'nh': 'new-hampshire', 'nj': 'new-jersey',
  'nm': 'new-mexico', 'ny': 'new-york', 'nc': 'north-carolina', 'nd': 'north-dakota', 'oh': 'ohio',
  'ok': 'oklahoma', 'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode-island', 'sc': 'south-carolina',
  'sd': 'south-dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah', 'vt': 'vermont',
  'va': 'virginia', 'wa': 'washington', 'wv': 'west-virginia', 'wi': 'wisconsin', 'wy': 'wyoming'
};

export const SLUG_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(CODE_TO_SLUG).map(([code, slug]) => [slug, code])
);

export function isValidStateCode(code: string): boolean {
  return STATE_CODES.includes(code.toLowerCase() as (typeof STATE_CODES)[number]);
}

/** Resolve any state URL param (slug like "iowa" OR code like "ia") to 2-letter uppercase code */
export function resolveStateParam(param: string): string | null {
  const lower = param.toLowerCase();
  if (SLUG_TO_CODE[lower]) return SLUG_TO_CODE[lower].toUpperCase();
  if (CODE_TO_SLUG[lower]) return lower.toUpperCase();
  return null;
}

/** Get the full-name slug for a state code (e.g. "IA" → "iowa") */
export function stateCodeToSlug(code: string): string {
  return CODE_TO_SLUG[code.toLowerCase()] || code.toLowerCase();
}

export function getStateUrl(stateCode: string, path = ''): string {
  const code = stateCode.toLowerCase();
  const isLocal = typeof window !== 'undefined'
    ? window.location.hostname === 'localhost'
    : process.env.NODE_ENV === 'development';

  if (isLocal) {
    const slug = CODE_TO_SLUG[code] || code;
    const base = `/states/${slug}`;
    return path ? `${base}/${path.replace(/^\//, '')}` : base;
  }

  const base = `https://${code}.${DOMAIN}`;
  return path ? `${base}/${path.replace(/^\//, '')}` : base;
}
