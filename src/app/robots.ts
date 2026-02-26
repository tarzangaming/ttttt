import { MetadataRoute } from 'next'
import siteConfig from '@/data/site.config.json'

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
        crawlDelay: 1,
      },
    ],
    sitemap: `${siteConfig.canonicalBase}/sitemap-index.xml`,
  }
}