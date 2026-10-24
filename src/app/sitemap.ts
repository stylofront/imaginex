import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imaginex.styloshare.com';
  const now = new Date();

  // Core Tools
  const tools = [
    '/tools/convert',
    '/tools/compress',
    '/tools/resize',
    '/tools/remove-bg',
    '/tools/crop',
    '/tools/color-palette',
    '/tools/metadata',
    '/tools/watermark',
    '/tools/filters',
    '/tools/compare',
    '/tools/bulk',
  ];

  // Competitor Comparison & Alternatives Pages
  const alternatives = [
    '/alternatives/tinypng-alternative',
    '/alternatives/cloudconvert-alternative',
    '/alternatives/remove-bg-alternative',
    '/alternatives/iloveimg-alternative',
    '/alternatives/squoosh-alternative',
  ];

  // Programmatic Image Conversion Pages
  const convertPages = [
    '/convert/png-to-webp',
    '/convert/heic-to-jpg',
    '/convert/webp-to-jpg',
    '/convert/png-to-avif',
    '/convert/jpg-to-webp',
    '/convert/webp-to-png',
    '/convert/svg-to-png',
    '/convert/tiff-to-jpg',
    '/convert/jpg-to-png',
  ];

  // Programmatic Image Compression Pages
  const compressPages = [
    '/compress/compress-for-web',
    '/compress/reduce-image-size',
    '/compress/compress-jpeg-under-100kb',
    '/compress/compress-png-without-losing-quality',
    '/compress/compress-image-for-email',
  ];

  // Blog Articles
  const blogSlugs = Object.keys(BLOG_POSTS);

  const sitemapEntries: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Blog Index
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Tools
    ...tools.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    // Alternatives
    ...alternatives.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Convert Programmatic
    ...convertPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Compress Programmatic
    ...compressPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Blog Articles
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(BLOG_POSTS[slug].date || now),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return sitemapEntries;
}
