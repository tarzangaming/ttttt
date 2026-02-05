import { NextResponse } from 'next/server'
import { getAllLocations } from '@/utils/content'

const DOMAIN = 'bennettconstructionandroofing.com'

export async function GET() {
  const currentDate = new Date().toISOString()

  // Get all locations using the helper
  const allLocations = getAllLocations()

  // Generate individual city sitemap entries
  const citySitemaps = allLocations.map((location) =>
    `<sitemap>
    <loc>https://${location.id}.${DOMAIN}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
  ).join('\n')

  // Generate state subdomain sitemap entries
  const uniqueStates = [...new Set(allLocations.map(loc => loc.state.toLowerCase()))];
  const stateSitemaps = uniqueStates.map((state) =>
    `<sitemap>
    <loc>https://${state}.${DOMAIN}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
  ).join('\n')

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${citySitemaps}
${stateSitemaps}
</sitemapindex>`

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

