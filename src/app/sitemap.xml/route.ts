import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import servicesData from '@/data/services.json'
import { getDomain, getAllStates, getAllLocations } from '@/utils/content'

// Cache sitemap for 24 hours to reduce requests
export const revalidate = 86400; // 24 hours

export async function GET() {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const currentDate = new Date().toISOString()
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  // Main domain: homepage + key internal pages + state subdomains
  if (!host || host.startsWith('www.') || host.split('.').length <= 2) {
    const domain = getDomain()
    const base = `https://${domain}`

    const mainEntry = `  <url>
    <loc>${base}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`

    // Important internal pages on the main domain
    const mainInternalPages = [
      `  <url>
    <loc>${base}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
      `  <url>
    <loc>${base}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
      `  <url>
    <loc>${base}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
      `  <url>
    <loc>${base}/locations</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
      `  <url>
    <loc>${base}/states</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
      `  <url>
    <loc>${base}/cost-guides</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
      `  <url>
    <loc>${base}/financing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ]

    // Main-domain service detail pages
    const allServices = (servicesData as { services: { slug: string }[] }).services
    const mainServicePages = allServices
      .map(
        (service) => `  <url>
    <loc>${base}/services/${service.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
      )
      .join('\n')

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
${mainInternalPages.join('\n')}
${stateEntries.join('\n')}
${mainServicePages}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200', // Cache for 24h
      },
    })
  }

  // State subdomain: state homepage + important internal pages + cities in state
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

    // State-level internal pages (about, contact, services)
    const stateMainPages = [
      `  <url>
    <loc>${stateBase}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
      `  <url>
    <loc>${stateBase}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
      `  <url>
    <loc>${stateBase}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    ]

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

    // State-level service detail pages (e.g. /roof-repair on the state subdomain)
    const allServices = (servicesData as { services: { slug: string }[] }).services
    const stateServicePages = allServices
      .map(
        (service) => `  <url>
    <loc>${stateBase}/${service.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
      )
      .join('\n')

    const stateSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${stateEntry}
${stateMainPages.join('\n')}
${cityEntries.join('\n')}
${stateServicePages}
</urlset>`

    return new NextResponse(stateSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200', // Cache for 24h
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

  // Cost-calculator pages - only top 10 most important services to reduce sitemap size
  const topServices = [
    'roof-installation',
    'roof-repair',
    'roof-replacement',
    'roof-leak-repair',
    'storm-damage-roof-repair',
    'emergency-roof-repair',
    'gutter-installation',
    'gutter-repair',
    'siding-installation',
    'commercial-roofing'
  ];
  const costCalculatorPages = serviceSlugs
    .filter(service => topServices.includes(service))
    .map((service) =>
      `  <url>
    <loc>${baseUrl}/${service}/cost-calculator</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    ).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages}
${servicePages}
${costCalculatorPages}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
