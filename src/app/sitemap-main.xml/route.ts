import { NextResponse } from 'next/server';
import { getAllLocations } from '@/utils/content';
import servicesData from '@/data/services.json';
import costGuidesData from '@/data/cost-guides.json';

const DOMAIN = 'https://dolimitisteelroofing.com';

// Cache sitemap for 24 hours to reduce requests
export const revalidate = 86400; // 24 hours

type SitemapService = { slug: string };

function getAllServicesForSitemap(): SitemapService[] {
  const byCategory = (servicesData as any).servicesByCategory || {};
  return Object.values(byCategory).flat() as SitemapService[];
}

export async function GET() {
  const currentDate = new Date().toISOString();

  // Get all services and cost guides
  const services = getAllServicesForSitemap();
  const costGuides = costGuidesData as { slug: string }[];

  // Main domain pages
  const mainPages = [
    `  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/locations</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/states</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/cost-guides</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    `  <url>
    <loc>${DOMAIN}/financing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  ].join('\n');

  // Cost guide pages
  const costGuidePages = costGuides.map(guide =>
    `  <url>
    <loc>${DOMAIN}/cost-guides/${guide.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join('\n');

  // Main domain service pages
  const mainServicePages = services.map(service =>
    `  <url>
    <loc>${DOMAIN}/services/${service.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('\n');

  // Get all locations using helper (handles nested states/cities structure)
  const allLocations = getAllLocations();

  // Location pages (subdomain format)
  const locationPages = allLocations.map(loc =>
    `  <url>
    <loc>https://${loc.id}.dolimitisteelroofing.com</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join('\n');

  // Get unique states for the new /areas/ structure
  const uniqueStates = [...new Set(allLocations.map((loc) => loc.state))];

  // State pages (subdomain format)
  const statePages = uniqueStates.map(state =>
    `  <url>
    <loc>https://${state.toLowerCase()}.dolimitisteelroofing.com</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages}
${mainServicePages}
${costGuidePages}
${locationPages}
${statePages}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200', // Cache for 24h
    },
  });
}

