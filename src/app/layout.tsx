import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F9FC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D18' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const BASE_URL = 'https://imaginex.styloshare.com';

export const metadata: Metadata = {
  title: 'Imaginex — 100% Client-Side Image Transformation Studio',
  description:
    'High-performance browser-based image suite built by Styloshare Team. Convert WEBP/PNG/JPG/AVIF, smart compress, Lanczos3 resize, AI background removal, EXIF inspector, and bulk processing. Zero server uploads.',
  keywords: [
    'Imaginex',
    'image studio',
    'client side image converter',
    'image compressor',
    'tinypng alternative',
    'cloudconvert alternative',
    'remove bg free alternative',
    'ai remove background',
    'lanczos3 resize',
    'exif viewer',
    'styloshare',
    'private photo tools',
  ],
  authors: [{ name: 'Styloshare Team', url: 'https://www.styloshare.com' }],
  creator: 'Styloshare Team',
  publisher: 'Imaginex by Styloshare',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Imaginex',
  },
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Imaginex Studio',
    title: 'Imaginex — 100% Client-Side Image Transformation Studio',
    description:
      'Transform, compress, and edit photos with 100% device privacy. Zero server uploads. Built by Styloshare Team.',
    images: [
      {
        url: '/seo-image.webp',
        width: 1200,
        height: 630,
        alt: 'Imaginex — 100% Client-Side Image Transformation Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imaginex — 100% Client-Side Image Studio',
    description:
      'Zero server uploads. Built by Styloshare Team. Transform, compress, and edit photos with complete device privacy.',
    images: ['/seo-image.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Imaginex Studio',
    url: BASE_URL,
    description: '100% client-side, zero-cloud image transformation, compression, format conversion, and editing platform.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (Web Browser, PWA)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Styloshare Team',
      url: 'https://www.styloshare.com',
    },
    featureList: [
      'Next-Gen Format Conversion (AVIF, WebP, PNG, JPG)',
      'Smart Client-Side Image Compression with Target KB sizing',
      'Local Neural AI Background Removal',
      'Lanczos3 Sinc Resampling',
      'Freeform & Social Aspect Ratio Cropping',
      'Color Palette & HEX Harvester',
      'EXIF & GPS Telemetry Stripper',
      'Multi-threaded Web Worker Batch Studio',
      'PWA Offline Capability',
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flicker script for client-side theme persistence */}
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('imaginex_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        {/* Google Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--brand)] selection:text-white font-sans transition-colors duration-250">
        <Navbar />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
