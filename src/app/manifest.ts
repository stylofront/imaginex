import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Imaginex — 100% Client-Side Image Transformation Studio',
    short_name: 'Imaginex',
    description: 'Transform, compress, resize, edit and convert photos locally in browser memory. 100% private, zero server uploads.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0B0D18',
    theme_color: '#7047FF',
    categories: ['utilities', 'photo', 'productivity'],
    icons: [
      {
        src: '/logo.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  };
}
