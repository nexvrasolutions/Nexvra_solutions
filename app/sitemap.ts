import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.nexvrasolutions.com',
      lastModified: new Date(),
    },
  ]
}