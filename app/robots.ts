import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // admin.nexvrasolutions.com (QR_ADMIN_ONLY build) has nothing for search engines.
  if (process.env.QR_ADMIN_ONLY === '1') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin tools, APIs and personal verification records are not for search engines.
      disallow: ['/admin', '/api/', '/verify/', '/students/'],
    },
    sitemap: 'https://www.nexvrasolutions.com/sitemap.xml',
  }
}
