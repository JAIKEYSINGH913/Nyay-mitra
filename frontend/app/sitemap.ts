import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nyay-mitra.tech';

  // Core application routes
  const routes = [
    '',
    '/nyay-vani',
    '/nyay-bridge',
    '/nyay-graph',
    '/nyay-audit',
    '/research-hub',
    '/about',
    '/help',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
