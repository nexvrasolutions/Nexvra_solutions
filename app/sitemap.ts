import { MetadataRoute } from 'next'
import { courses } from '@/data/courses'
import { projects } from '@/data/projects'

const BASE = 'https://www.nexvrasolutions.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const pages = ['', '/about-us', '/solutions', '/courses', '/projects', '/contact', '/privacy-policy', '/terms-and-conditions']
  return [
    ...pages.map((path) => ({ url: `${BASE}${path}`, lastModified })),
    ...Object.keys(courses).map((slug) => ({ url: `${BASE}/course-detail/${slug}`, lastModified })),
    ...Object.keys(projects).map((slug) => ({ url: `${BASE}/project-detail/${slug}`, lastModified })),
  ]
}
