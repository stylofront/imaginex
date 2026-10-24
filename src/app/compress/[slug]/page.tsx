import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Minimize2, ShieldCheck, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

interface CompressPageData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  targetUseCases: string[];
  tips: Array<{ title: string; desc: string }>;
  faqs: Array<{ q: string; a: string }>;
}

const COMPRESS_SLUGS: Record<string, CompressPageData> = {
  'compress-for-web': {
    title: 'Compress Images for Web',
    metaTitle: 'Free Image Compressor for Web — Boost Core Web Vitals | Imaginex',
    metaDescription: 'Optimize and compress web photos for lightning-fast site load times. 100% client-side with zero quality sacrifice.',
    heading: 'Compress Images for Faster Website Speeds',
    subheading: 'Reduce image payloads by 70-90% to improve Largest Contentful Paint (LCP) and pass Google Core Web Vitals.',
    targetUseCases: [
      'Hero images and full-width background banners',
      'E-commerce product catalogs and thumbnail grids',
      'Blog featured articles and social share cards',
      'Portfolio photography and case study exhibits',
    ],
    tips: [
      { title: 'Target 100-200 KB for Hero Images', desc: 'Large banner images should rarely exceed 250 KB on desktop screens.' },
      { title: 'Use WebP or Modern AVIF', desc: 'Modern formats cut file size by half compared to standard JPEG at equal visual quality.' },
      { title: 'Cap Dimensions to Maximum Display Size', desc: 'Downscale 4K smartphone photos to 1920px or 1200px before web publishing.' },
    ],
    faqs: [
      {
        q: 'Why does image compression matter for SEO?',
        a: 'Google ranking algorithms heavily weight PageSpeed and Largest Contentful Paint (LCP). Images account for over 60% of average page weight.',
      },
      {
        q: 'How does client-side compression compare to online servers?',
        a: 'Because computations occur in local browser memory via WebAssembly, your photos compress instantly with zero upload delays and 100% data confidentiality.',
      },
    ],
  },
  'reduce-image-size': {
    title: 'Reduce Image Size to 100KB',
    metaTitle: 'Reduce Image File Size to 100KB or 200KB Online Free | Imaginex',
    metaDescription: 'Quickly shrink photos to under 100KB, 50KB, or 200KB for passport portals, job forms, and government applications.',
    heading: 'Reduce Photo File Size to Under 100KB',
    subheading: 'Easily meet strict upload limits for visa portals, exam registrations, resumes, and document uploads.',
    targetUseCases: [
      'Government exam and civil service upload portals',
      'Passport and visa photo specifications',
      'Job applications and PDF document attachments',
      'Online classifieds and profile picture requirements',
    ],
    tips: [
      { title: 'Iterative Sizing Algorithm', desc: 'Imaginex dynamically adjusts quality parameters until the exact byte ceiling is achieved.' },
      { title: 'Dimension Constraints', desc: 'If quality reduction alone is insufficient, slightly scaling the dimensions ensures compliance without artifacts.' },
    ],
    faqs: [
      {
        q: 'Will my image look blurry if reduced to 100KB?',
        a: 'For typical portrait or form dimensions (e.g. 600x600px), 100KB is more than enough data to maintain crisp, clear facial features and text.',
      },
    ],
  },
  'compress-jpeg-under-100kb': {
    title: 'Compress JPEG Under 100KB',
    metaTitle: 'Compress JPEG Under 100KB Online Free (Exact Size) | Imaginex',
    metaDescription: 'Compress JPEG pictures to under 100KB with pinpoint accuracy. Perfect for exam forms, job portals, and visa photo requirements.',
    heading: 'Compress JPEG Photos to Under 100KB',
    subheading: 'Hit exact kilobyte limits instantly without guessing compression sliders or compromising legibility.',
    targetUseCases: [
      'Online job applications and resume attachments',
      'Civil service and university entrance exam photo uploads',
      'Passport, visa, and green card verification portals',
      'Real estate MLS listings and tenant verification',
    ],
    tips: [
      { title: 'Set Target to 95 KB', desc: 'Setting the target slightly below 100KB guarantees your upload passes automated portal filters.' },
      { title: 'Preserve Face Sharpness', desc: 'Our smart algorithm prioritizes high-frequency facial features while compressing smooth backdrops.' },
    ],
    faqs: [
      {
        q: 'How do I compress a JPEG to exactly 100KB?',
        a: 'In Imaginex Smart Compressor, set the Max File Size slider to 0.1 MB (100KB). The client-side worker will iteratively tune DCT quantization tables until the file is below 100KB.',
      },
    ],
  },
  'compress-png-without-losing-quality': {
    title: 'Compress PNG Without Losing Quality',
    metaTitle: 'Compress PNG Without Losing Quality (Lossless & Alpha) | Imaginex',
    metaDescription: 'Reduce PNG file size by up to 70% while keeping transparent alpha backgrounds and 100% lossless visual acuity intact.',
    heading: 'Lossless PNG Compression with Alpha Transparency',
    subheading: 'Crush bloated PNG-24 assets down to lightweight web graphics without fuzzy edges, banding, or color shift.',
    targetUseCases: [
      'Transparent logos, icons, and vector graphics',
      'Figma and Adobe XD UI/UX mockups',
      'App screenshots and software product marketing assets',
      'eCommerce transparent product cutouts',
    ],
    tips: [
      { title: 'Indexed Color Quantization', desc: 'Reducing redundant 32-bit color tables down to 256 optimized palette bins cuts file weight by 65% with zero perceptible difference.' },
      { title: 'Preserve Clean Transparent Edges', desc: 'Alpha channel gradients are maintained without dark halos or fringe pixels.' },
    ],
    faqs: [
      {
        q: 'Can I compress a transparent PNG without a black background?',
        a: 'Yes. Imaginex preserves 8-bit alpha transparency channels during both lossy and lossless PNG optimization.',
      },
    ],
  },
  'compress-image-for-email': {
    title: 'Compress Images for Email',
    metaTitle: 'Compress Images for Email (Under 1MB Fast Delivery) | Imaginex',
    metaDescription: 'Shrink photo attachments and newsletter graphics to prevent bounced emails and slow inbox loading times.',
    heading: 'Compress Photos for Fast Email Delivery',
    subheading: 'Prevent bounced messages and inbox quota warnings by resizing and compressing attachments to under 1MB.',
    targetUseCases: [
      'Outlook, Gmail, and Apple Mail photo attachments',
      'HTML email newsletter banners and CTA graphics',
      'Client proofing sheets and invoice receipt scans',
      'Mobile email recipients on cellular data',
    ],
    tips: [
      { title: 'Stay Under 1MB Total Message Size', desc: 'Email clients process attachments under 1MB instantaneously without server bounce throttling.' },
      { title: 'Downscale Width to 1200px', desc: 'Standard desktop email clients display graphics at a maximum width of 600px to 800px.' },
    ],
    faqs: [
      {
        q: 'What is the ideal image size for Gmail and Outlook?',
        a: 'For inline graphics, keep individual files under 200KB. For photo attachments, keeping them under 1MB ensures immediate delivery without triggering spam filters.',
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = COMPRESS_SLUGS[slug];
  if (!data) return { title: 'Compress Images — Imaginex' };

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
  return Object.keys(COMPRESS_SLUGS).map((slug) => ({ slug }));
}

export default async function CompressSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = COMPRESS_SLUGS[slug];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-6 sm:pt-8 pb-20">
      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Home</Link>
          <span className="text-[var(--text-muted)] text-xs">/</span>
          <Link href="/tools/compress" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Compressor</Link>
          <span className="text-[var(--text-muted)] text-xs">/</span>
          <span className="text-xs uppercase font-mono tracking-wider text-[var(--brand)] font-bold">{pageData.title}</span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Server Uploads • Device Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {pageData.heading}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {pageData.subheading}
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] backdrop-blur-xl shadow-lg text-center space-y-6">
          <div className="w-12 h-12 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mx-auto shadow-xs">
            <Minimize2 className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-[var(--text-primary)]">Smart Browser Compression Engine</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Drag your image into our studio to achieve exact KB targets or downscale dimensions with zero server uploads.
          </p>

          <Link
            href="/tools/compress"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 shadow-md shadow-[var(--brand)]/20 transition-all hover:scale-[1.02]"
          >
            <span>Launch Smart Compressor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Common Use Cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {pageData.targetUseCases.map((u, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <span>{u}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Optimization Best Practices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {pageData.tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-1.5">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{tip.title}</h4>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--brand)]" />
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
