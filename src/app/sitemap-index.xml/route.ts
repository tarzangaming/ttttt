import { NextResponse } from 'next/server'

export async function GET() {
  const currentDate = new Date().toISOString()

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap>
<loc>https://www.bennettconstructionandroofing.com/sitemap-main.xml</loc>
<lastmod>${currentDate}</lastmod>
</sitemap>
<sitemap>
<loc>https://www.bennettconstructionandroofing.com/sitemap-subdomains.xml</loc>
<lastmod>${currentDate}</lastmod>
</sitemap>
</sitemapindex>`

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
