import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShieldCheck, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

interface ConvertPageData {
  title: string;
  sourceFormat: string;
  targetFormat: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  whyConvert: string[];
  specs: Array<{ feature: string; source: string; target: string }>;
  faqs: Array<{ q: string; a: string }>;
}

const CONVERT_SLUGS: Record<string, ConvertPageData> = {
  'png-to-webp': {
    title: 'PNG to WEBP',
    sourceFormat: 'PNG',
    targetFormat: 'WEBP',
    metaTitle: 'Free PNG to WEBP Converter — 100% Client-Side & Lossless | Imaginex',
    metaDescription: 'Convert PNG to WEBP in your browser with zero uploads. Cut image size up to 80% with full transparency support and faster PageSpeed scores.',
    heading: 'Convert PNG to WEBP Instantly in Your Browser',
    subheading: 'Reduce image file size by up to 80% while retaining transparent alpha channels and crisp clarity.',
    whyConvert: [
      '80% smaller file sizes compared to standard PNG-24',
      'Boosts Core Web Vitals (LCP) and Google PageSpeed scores',
      'Supported by 97%+ of all active desktop and mobile web browsers',
      '100% in-browser processing — your private assets are never sent to foreign servers',
    ],
    specs: [
      { feature: 'Alpha Transparency', source: 'Yes (32-bit RGBA)', target: 'Yes (Lossless & Lossy Alpha)' },
      { feature: 'Average Compression Savings', source: 'Baseline (Large)', target: '65% - 85% Smaller' },
      { feature: 'Browser Support', source: 'Universal (100%)', target: '97.5% Modern Browsers' },
      { feature: 'Animation Support', source: 'APNG (Rare)', target: 'Yes (Animated WebP)' },
    ],
    faqs: [
      {
        q: 'Does converting PNG to WEBP lose image quality?',
        a: 'When converting with quality set to 85-90%, the visual differences are completely imperceptible to the human eye while slashing the file size by 70% or more.',
      },
      {
        q: 'Are my PNG images uploaded to your cloud servers?',
        a: 'No. Imaginex processes every byte directly inside your browser memory using HTML5 Canvas & Web Workers.',
      },
      {
        q: 'Does WEBP support transparent backgrounds like PNG?',
        a: 'Yes! WEBP fully supports 8-bit alpha channel transparency just like PNG-24.',
      },
    ],
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG',
    sourceFormat: 'HEIC',
    targetFormat: 'JPEG',
    metaTitle: 'Free HEIC to JPG Converter — Convert iPhone Photos Locally | Imaginex',
    metaDescription: 'Convert Apple iPhone HEIC and HEIF photos to universal JPG format directly in your browser. 100% private, zero uploads.',
    heading: 'Convert iPhone HEIC Photos to JPG Locally',
    subheading: 'Open, convert, and view Apple HEIC and HEIF photos on Windows, Android, and web without software downloads.',
    whyConvert: [
      'Universal compatibility across Windows, Mac, Linux, and Android',
      'Ready for social media, email attachments, and web uploads',
      'Zero quality degradation when converted to high-quality JPEG',
      'Completely private: Apple photos never leave your device',
    ],
    specs: [
      { feature: 'Compatibility', source: 'Apple iOS / macOS Only', target: 'Universal (Every Device)' },
      { feature: 'Color Depth', source: '10-bit / 16-bit', target: '8-bit RGB' },
      { feature: 'Web Usage', source: 'Unsupported by web browsers', target: 'Native 100% Support' },
    ],
    faqs: [
      {
        q: 'Why can’t I open HEIC photos on Windows?',
        a: 'Windows requires a paid codec from the Microsoft Store to decode Apple’s HEIC format. Imaginex decodes and converts it to universal JPG for free in your browser.',
      },
      {
        q: 'Will my camera metadata (date, lens) be preserved?',
        a: 'Yes, our engine preserves EXIF timestamps and camera details during JPEG re-encoding.',
      },
    ],
  },
  'webp-to-jpg': {
    title: 'WEBP to JPG',
    sourceFormat: 'WEBP',
    targetFormat: 'JPEG',
    metaTitle: 'Free WEBP to JPG Converter — Convert to Universal Photo Format | Imaginex',
    metaDescription: 'Easily convert WEBP images back to standard JPG format for legacy apps and print. 100% client-side.',
    heading: 'Convert WEBP to JPG in One Click',
    subheading: 'Transform modern WEBP photos into standard, universally recognized JPEG format for legacy software and print.',
    whyConvert: [
      'Compatible with older software, photo editing apps, and office suites',
      'Standard format for commercial photo printing services',
      'Instant conversion in your browser without uploading to any server',
    ],
    specs: [
      { feature: 'File Size', source: 'Ultra compact', target: 'Slightly larger (standard)' },
      { feature: 'Print Suitability', source: 'Limited support', target: 'Industry standard (CMYK/RGB)' },
    ],
    faqs: [
      {
        q: 'What happens to transparency when converting to JPG?',
        a: 'Because JPG does not support transparent alpha channels, transparent areas are automatically replaced with a clean white backdrop.',
      },
    ],
  },
  'png-to-avif': {
    title: 'PNG to AVIF',
    sourceFormat: 'PNG',
    targetFormat: 'AVIF',
    metaTitle: 'Convert PNG to AVIF Online Free (Up to 90% Smaller) | Imaginex',
    metaDescription: 'Convert PNG images to next-gen AVIF format with full transparency preservation and dramatic byte reduction. 100% private in-browser execution.',
    heading: 'Convert PNG to Next-Gen AVIF Format',
    subheading: 'Slash image file size by up to 90% compared to PNG while retaining crisp edges and alpha transparency.',
    whyConvert: [
      'Up to 90% reduction compared to original PNG-24 assets',
      'Significantly faster Largest Contentful Paint (LCP) in Lighthouse audits',
      'Supported in all modern browsers (Chrome, Safari, Firefox, Edge)',
      '100% client-side WebAssembly computation — zero cloud uploads',
    ],
    specs: [
      { feature: 'Compression Efficiency', source: 'Standard Deflate (Heavy)', target: 'AV1 Predictive Coding (Ultra Compact)' },
      { feature: 'Alpha Transparency', source: 'Yes', target: 'Yes' },
      { feature: 'Color Depth', source: '8-bit RGBA', target: 'Up to 10-bit / 12-bit HDR' },
    ],
    faqs: [
      {
        q: 'Why is AVIF smaller than PNG?',
        a: 'AVIF is derived from the modern AV1 video codec, featuring advanced spatial predictive encoding that compresses smooth gradients and fine textures far more effectively than 1990s Deflate algorithms.',
      },
    ],
  },
  'jpg-to-webp': {
    title: 'JPG to WEBP',
    sourceFormat: 'JPEG',
    targetFormat: 'WEBP',
    metaTitle: 'Free JPG to WEBP Converter — Boost Google Core Web Vitals | Imaginex',
    metaDescription: 'Convert JPG to WEBP online in your browser. Cut photo weight by 35% without visible quality loss for faster loading websites.',
    heading: 'Convert JPG to WEBP in Browser Memory',
    subheading: 'Lighten your web pages with modern Google WebP compression without compromising color fidelity or detail.',
    whyConvert: [
      '30% to 50% smaller file size than standard JPEG at identical visual quality',
      'Over 97% browser compatibility across desktop and mobile devices',
      'Recommended by Google PageSpeed Insights and Lighthouse',
      'Zero server uploads — your images never leave your machine',
    ],
    specs: [
      { feature: 'Encoding Algorithm', source: 'Discrete Cosine Transform (DCT)', target: 'VP8 Predictive Block Coding' },
      { feature: 'Bandwidth Savings', source: 'Baseline', target: '30% - 40% Smaller' },
    ],
    faqs: [
      {
        q: 'Will Google rank my site higher if I use WebP?',
        a: 'Yes. Google factors page speed and Core Web Vitals into mobile search rankings. WebP reduces bandwidth, leading to faster First Contentful Paint and Largest Contentful Paint.',
      },
    ],
  },
  'webp-to-png': {
    title: 'WEBP to PNG',
    sourceFormat: 'WEBP',
    targetFormat: 'PNG',
    metaTitle: 'Free WEBP to PNG Converter — Lossless Transparency | Imaginex',
    metaDescription: 'Convert WEBP files to universal lossless PNG format. Compatible with Photoshop, Premiere, Figma, and legacy image viewers.',
    heading: 'Convert WEBP to Lossless PNG Instantly',
    subheading: 'Turn web-optimized WEBP images into uncompressed PNG files with full transparency for design tools and editors.',
    whyConvert: [
      'Universal compatibility with Figma, Photoshop, Illustrator, and legacy software',
      'Preserves 100% of alpha transparency and layer integrity',
      'Free, unlimited conversions with instant client-side rendering',
    ],
    specs: [
      { feature: 'Container Format', source: 'RIFF / WebP', target: 'PNG (Portable Network Graphics)' },
      { feature: 'Compatibility', source: 'Web browsers primarily', target: '100% universal (All desktop & mobile apps)' },
    ],
    faqs: [
      {
        q: 'Can I edit the converted PNG in older Photoshop versions?',
        a: 'Yes. PNG is universally recognized across all graphic design applications and operating systems without needing third-party plugins.',
      },
    ],
  },
  'svg-to-png': {
    title: 'SVG to PNG',
    sourceFormat: 'SVG',
    targetFormat: 'PNG',
    metaTitle: 'Free SVG to PNG Converter — High-Res Vector Rasterizer | Imaginex',
    metaDescription: 'Convert vector SVG graphics into crisp PNG raster images at full resolution. 100% private in-browser canvas rendering.',
    heading: 'Rasterize SVG Vector to Crisp PNG',
    subheading: 'Convert scalable vector SVG logos, icons, and illustrations into high-resolution transparent PNG files.',
    whyConvert: [
      'Render vector paths to standard pixel formats for social media and document embedding',
      'Preserves crystal-clear vector acuity and sharp anti-aliased borders',
      'Keeps transparent backgrounds intact',
    ],
    specs: [
      { feature: 'Type', source: 'Scalable Vector XML', target: 'Raster Bitmap PNG' },
      { feature: 'Transparency', source: 'Yes', target: 'Yes' },
    ],
    faqs: [
      {
        q: 'Can I upload SVG files created in Illustrator or Figma?',
        a: 'Yes, Imaginex renders all standard SVG vectors onto an HTML5 canvas and exports a high-density PNG.',
      },
    ],
  },
  'tiff-to-jpg': {
    title: 'TIFF to JPG',
    sourceFormat: 'TIFF',
    targetFormat: 'JPEG',
    metaTitle: 'Free TIFF to JPG Converter — Convert Heavy Scans Online | Imaginex',
    metaDescription: 'Convert massive TIFF scanner and photography files into lightweight, universal JPG format directly in your browser. 0 bytes uploaded.',
    heading: 'Convert Heavy TIFF Scans to JPG',
    subheading: 'Shrink multi-megabyte TIFF documents, print scans, and RAW photo exports into lightweight, shareable JPEGs.',
    whyConvert: [
      'Reduces huge 50MB+ TIFF scanner files down to lightweight 1MB JPEGs',
      'Universal compatibility for email attachments and web previews',
      '100% secure for confidential legal, medical, and financial documents',
    ],
    specs: [
      { feature: 'Average File Size', source: '20MB - 100MB (Uncompressed)', target: '500KB - 3MB (Compressed)' },
      { feature: 'Web Usability', source: 'Cannot be viewed in browsers', target: 'Native universal support' },
    ],
    faqs: [
      {
        q: 'Is it safe to convert confidential scanned tax or medical TIFF documents?',
        a: 'Yes. Imaginex runs entirely in your local browser sandbox without transmitting data to any cloud server.',
      },
    ],
  },
  'jpg-to-png': {
    title: 'JPG to PNG',
    sourceFormat: 'JPEG',
    targetFormat: 'PNG',
    metaTitle: 'Free JPG to PNG Converter — Lossless 24-bit Output | Imaginex',
    metaDescription: 'Convert JPG to PNG format to prevent repeated compression generation loss. 100% private browser processing.',
    heading: 'Convert JPG to PNG Losslessly',
    subheading: 'Convert compressed JPEG photos into lossless PNG format for further editing, transparency compositing, or graphics work.',
    whyConvert: [
      'Lossless container prevents further generational compression artifacts',
      'Prepares images for graphic design tools, transparent masking, and layers',
      'Free, unlimited conversions without server queues',
    ],
    specs: [
      { feature: 'Compression Type', source: 'Lossy (DCT)', target: 'Lossless (Deflate)' },
      { feature: 'Editing Artifacts', source: 'Degrades upon re-saving', target: 'Zero degradation' },
    ],
    faqs: [
      {
        q: 'Does converting JPG to PNG make the image sharper?',
        a: 'Converting to PNG cannot recover lost details from the original JPEG compression, but it prevents any further degradation when saving future edits.',
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = CONVERT_SLUGS[slug];
  if (!data) return { title: 'Convert Image — Imaginex' };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      images: ['/seo-image.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
      images: ['/seo-image.webp'],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CONVERT_SLUGS).map((slug) => ({ slug }));
}

export default async function ConvertSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = CONVERT_SLUGS[slug];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-6 sm:pt-8 pb-20">
      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/"
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Home
          </Link>
          <span className="text-[var(--text-muted)] text-xs">/</span>
          <Link
            href="/tools/convert"
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Converter
          </Link>
          <span className="text-[var(--text-muted)] text-xs">/</span>
          <span className="text-xs uppercase font-mono tracking-wider text-[var(--brand)] font-bold">
            {pageData.title}
          </span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side • Zero Data Uploads</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {pageData.heading}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {pageData.subheading}
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] backdrop-blur-xl shadow-lg text-center space-y-6">
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm font-mono font-bold text-[var(--text-primary)]">
            <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
              {pageData.sourceFormat}
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--brand)]" />
            <span className="px-3 py-1.5 rounded-lg bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)]">
              {pageData.targetFormat}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Drop your {pageData.sourceFormat} files below to start instant conversion directly in your browser.
          </p>

          <Link
            href="/tools/convert"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 shadow-md shadow-[var(--brand)]/20 transition-all hover:scale-[1.02]"
          >
            <span>Open {pageData.title} Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--brand)]" />
            <span>Why Convert {pageData.title}?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {pageData.whyConvert.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
            {pageData.sourceFormat} vs {pageData.targetFormat} Technical Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-primary)] font-mono uppercase">
                  <th className="pb-3">Feature</th>
                  <th className="pb-3">{pageData.sourceFormat}</th>
                  <th className="pb-3 text-[var(--brand)]">{pageData.targetFormat}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text-secondary)]">
                {pageData.specs.map((spec, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-[var(--text-primary)]">{spec.feature}</td>
                    <td className="py-3 font-mono">{spec.source}</td>
                    <td className="py-3 font-mono text-[var(--brand)] font-semibold">{spec.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-4 pt-2">
            {pageData.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-1.5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{faq.q}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
