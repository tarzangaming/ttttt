/**
 * Server-side SEO utilities - reads seo.json from disk for dynamic updates.
 * Use in generateMetadata() so admin changes take effect without rebuild.
 */

import fs from 'fs';
import path from 'path';

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

export interface SEOTemplate {
  title: string;
  description: string;
  canonical?: string;
}

let cachedSeo: Record<string, unknown> | null = null;
let cacheTime = 0;
const CACHE_MS = 5000; // 5 second cache to avoid excessive disk reads

function readSeoFile(): Record<string, unknown> {
  const now = Date.now();
  if (cachedSeo && now - cacheTime < CACHE_MS) {
    return cachedSeo;
  }
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'seo.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedSeo = JSON.parse(raw) as Record<string, unknown>;
    cacheTime = now;
    return cachedSeo!;
  } catch {
    return { pages: {}, templates: {}, defaults: {} };
  }
}

function readSiteConfigFile(): Record<string, unknown> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'site.config.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function replaceHomePlaceholders(text: string, config: Record<string, unknown>): string {
  const companyName = String(config.companyName || '');
  const serviceMain = String(config.serviceMain || 'Roofing');
  return text
    .replace(/\{\{COMPANY_NAME\}\}/g, companyName)
    .replace(/\{\{SERVICE_MAIN\}\}/g, serviceMain);
}

export function getPageSEOFromFile(page: string): PageSEO | null {
  const seo = readSeoFile();
  const pages = seo.pages as Record<string, PageSEO> | undefined;
  const pageSeo = pages?.[page] || null;
  if (!pageSeo) return null;
  if (page === 'home') {
    const config = readSiteConfigFile();
    return {
      ...pageSeo,
      title: replaceHomePlaceholders(pageSeo.title, config),
      description: replaceHomePlaceholders(pageSeo.description, config),
    };
  }
  return pageSeo;
}

export function getSEODefaultsFromFile() {
  const seo = readSeoFile();
  return (seo.defaults || {}) as Record<string, string>;
}

export function getServiceTemplateFromFile() {
  const seo = readSeoFile();
  const templates = seo.templates as Record<string, SEOTemplate> | undefined;
  return templates?.service || null;
}

export function getLocationTemplateFromFile() {
  const seo = readSeoFile();
  const templates = seo.templates as Record<string, SEOTemplate> | undefined;
  return templates?.location || null;
}

export function getLocationServiceTemplateFromFile() {
  const seo = readSeoFile();
  const templates = seo.templates as Record<string, SEOTemplate> | undefined;
  return templates?.locationService || null;
}

export function getLocationSEOFromFile(
  cityName: string,
  state: string,
  locationId: string,
  zipCodes?: string[]
): PageSEO {
  const template = getLocationTemplateFromFile();
  if (!template) {
    return {
      title: `Roofing in ${cityName}, ${state} | Bennett Construction`,
      description: `Professional roofing services in ${cityName}, ${state}. Licensed, insured. Call (866) 289-1750.`,
      canonical: `https://${locationId}.bennettconstructionandroofing.com`,
    };
  }
  const zipDisplay = zipCodes?.length
    ? zipCodes.length > 10
      ? zipCodes.slice(0, 10).join(', ') + ' & more'
      : zipCodes.join(', ')
    : '';
  let description = template.description
    .replace('{cityName}', cityName)
    .replace('{state}', state)
    .replace('{zipCodes}', zipDisplay);
  if (!zipDisplay) {
    description = description.replace(/\s*Serving zip codes \.\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }
  return {
    title: template.title.replace('{cityName}', cityName).replace('{state}', state),
    description,
    canonical: template.canonical?.replace('{locationId}', locationId) || undefined,
  };
}

export function getLocationServiceSEOFromFile(
  cityName: string,
  state: string,
  serviceTitle: string,
  serviceSlug: string,
  locationId: string,
  zipCodes?: string[]
): PageSEO {
  const template = getLocationServiceTemplateFromFile();
  if (!template) {
    return {
      title: `${serviceTitle} in ${cityName}, ${state} | Bennett Construction`,
      description: `Professional ${serviceTitle} in ${cityName}, ${state}. Licensed, insured. Call (866) 289-1750.`,
      canonical: `https://${locationId}.bennettconstructionandroofing.com/${serviceSlug}`,
    };
  }
  const zipDisplay = zipCodes?.length
    ? zipCodes.length > 10
      ? zipCodes.slice(0, 10).join(', ') + ' & more'
      : zipCodes.join(', ')
    : '';
  let description = template.description
    .replace('{cityName}', cityName)
    .replace('{state}', state)
    .replace('{serviceTitle}', serviceTitle)
    .replace('{zipCodes}', zipDisplay);
  if (!zipDisplay) {
    description = description.replace(/\s*Serving zip codes \.\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }
  return {
    title: template.title
      .replace('{cityName}', cityName)
      .replace('{state}', state)
      .replace('{serviceTitle}', serviceTitle),
    description,
    canonical: template.canonical
      ?.replace('{locationId}', locationId)
      ?.replace('{slug}', serviceSlug) || undefined,
  };
}

export function getServiceSEOFromFile(serviceTitle: string, serviceSlug: string): PageSEO {
  const template = getServiceTemplateFromFile();
  if (!template) {
    return {
      title: `${serviceTitle} | Bennett Construction & Roofing`,
      description: `Professional ${serviceTitle} services. Licensed, insured. Call (866) 289-1750.`,
      canonical: `https://bennettconstructionandroofing.com/services/${serviceSlug}`,
    };
  }
  return {
    title: template.title.replace('{serviceTitle}', serviceTitle),
    description: template.description.replace('{serviceTitle}', serviceTitle),
    canonical: template.canonical?.replace('{slug}', serviceSlug) || undefined,
  };
}

export function getCostPageSEOFromFile(
  cityName: string,
  state: string,
  cityState: string,
  serviceTitle: string,
  serviceSlug: string
): PageSEO {
  const seo = readSeoFile();
  const templates = seo.templates as Record<string, SEOTemplate> | undefined;
  const template = templates?.costPage || null;
  const year = new Date().getFullYear();
  if (!template) {
    return {
      title: `${serviceTitle} Cost in ${cityName}, ${state} (${year} Guide)`,
      description: `How much does ${serviceTitle.toLowerCase()} cost in ${cityName}? Calculate estimated prices for your home size. Local ${year} rates for roofing services.`,
      canonical: `https://bennettconstructionandroofing.com/${cityState}/${serviceSlug}/cost`,
    };
  }
  return {
    title: template.title
      .replace('{serviceTitle}', serviceTitle)
      .replace('{cityName}', cityName)
      .replace('{state}', state)
      .replace('{year}', String(year)),
    description: template.description
      .replace('{serviceTitle}', serviceTitle)
      .replace('{cityName}', cityName)
      .replace('{year}', String(year)),
    canonical: template.canonical
      ?.replace('{cityState}', cityState)
      ?.replace('{serviceSlug}', serviceSlug) || undefined,
  };
}

export function getCostCalculatorPageSEOFromFile(
  cityName: string,
  state: string,
  cityState: string,
  serviceTitle: string,
  serviceSlug: string
): PageSEO {
  const seo = readSeoFile();
  const templates = seo.templates as Record<string, SEOTemplate> | undefined;
  const template = templates?.costCalculatorPage || null;
  const year = new Date().getFullYear();
  if (!template) {
    return {
      title: `${serviceTitle} Cost Calculator in ${cityName}, ${state} (${year})`,
      description: `Free ${serviceTitle.toLowerCase()} cost calculator for ${cityName}. Get low, average, and high estimates. ${year} local roofing rates.`,
      canonical: `https://bennettconstructionandroofing.com/${cityState}/${serviceSlug}/cost-calculator`,
    };
  }
  return {
    title: template.title
      .replace('{serviceTitle}', serviceTitle)
      .replace('{cityName}', cityName)
      .replace('{state}', state)
      .replace('{year}', String(year)),
    description: template.description
      .replace('{serviceTitle}', serviceTitle)
      .replace('{cityName}', cityName)
      .replace('{year}', String(year)),
    canonical: template.canonical
      ?.replace('{cityState}', cityState)
      ?.replace('{serviceSlug}', serviceSlug) || undefined,
  };
}

export function getCostGuideSEOFromFile(
  slug: string,
  title: string,
  description: string
): PageSEO {
  const seo = readSeoFile();
  const templates = seo.templates as Record<string, SEOTemplate> | undefined;
  const template = templates?.costGuide || null;
  if (!template) {
    return {
      title,
      description,
      canonical: `https://bennettconstructionandroofing.com/cost-guides/${slug}`,
    };
  }
  return {
    title: template.title.replace('{title}', title),
    description: template.description.replace('{description}', description),
    canonical: template.canonical?.replace('{slug}', slug) || undefined,
  };
}
