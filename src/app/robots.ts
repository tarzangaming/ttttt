import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
        ],
        crawlDelay: 1, // 1 second delay between requests to reduce load
      },
    ],
    sitemap: 'https://dolimitisteelroofing.com/sitemap-index.xml',
  }
}