import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import servicesData from '@/data/services.json'
import { getDomain, getAllStates, getAllLocations } from '@/utils/content'

export async function GET() {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const currentDate = new Date().toISOString()
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  // Main domain: serve competitor-style urlset (homepage + state subdomains)
  if (!host || host.startsWith('www.') || host.split('.').length <= 2) {
    const domain = getDomain()
    const base = `https://${domain}`

    const mainEntry = `  <url>
    <loc>${base}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`

    const states = getAllStates()
    const stateEntries = states.flatMap((state) => {
      const stateSub = state.code.toLowerCase()
      const stateBase = `https://${stateSub}.${domain}`
      return [
        `  <url>
    <loc>${stateBase}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
        `  <url>
    <loc>${stateBase}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
      ]
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainEntry}
${stateEntries.join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }

  // State subdomain: competitor-style urlset (state homepage + cities in state)
  const domain = getDomain()
  const subdomain = host.split('.')[0]?.toLowerCase() || ''
  const stateCodes = new Set(getAllStates().map((s) => s.code.toLowerCase()))
  if (stateCodes.has(subdomain)) {
    const stateBase = `https://${subdomain}.${domain}`

    const stateEntry = `  <url>
    <loc>${stateBase}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`

    const allLocations = getAllLocations()
    const citiesInState = allLocations.filter(
      (loc) => loc.state.toLowerCase() === subdomain
    )
    const cityEntries = citiesInState.flatMap((loc) => {
      const cityBase = `https://${loc.id}.${domain}`
      return [
        `  <url>
    <loc>${cityBase}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
        `  <url>
    <loc>${cityBase}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
      ]
    })

    const stateSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${stateEntry}
${cityEntries.join('\n')}
</urlset>`

    return new NextResponse(stateSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }

  // City subdomain: this subdomain's pages (home, about, contact, services, service slugs)
  const services = (servicesData as { services: { slug: string }[] }).services
  const serviceSlugs = services.map((s) => s.slug)

  const mainPages = [
    `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  ].join('\n')
  
  // Service pages for this subdomain
  const servicePages = serviceSlugs.map(service => 
    `  <url>
    <loc>${baseUrl}/${service}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join('\n')
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages}
${servicePages}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
