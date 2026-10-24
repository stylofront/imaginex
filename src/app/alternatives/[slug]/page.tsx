import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Layers, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface AlternativeData {
  competitor: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  competitorWeaknesses: string[];
  imaginexStrengths: string[];
  tableRows: Array<{
    feature: string;
    imaginex: string;
    competitor: string;
    winner: 'imaginex' | 'tie';
  }>;
  verdict: string;
  faqs: Array<{ q: string; a: string }>;
  recommendedToolHref: string;
  recommendedToolName: string;
}

const ALTERNATIVES: Record<string, AlternativeData> = {
  'tinypng-alternative': {
    competitor: 'TinyPNG',
    tagline: 'Best Free TinyPNG Alternative (100% In-Browser & Unlimited)',
    metaTitle: 'Best Free TinyPNG Alternative — Zero Uploads, Unlimited Size | Imaginex',
    metaDescription: 'Looking for a TinyPNG alternative with no 5MB limit and zero cloud uploads? Imaginex compresses images locally in browser memory with multi-threaded Web Workers.',
    heroHeadline: 'The Zero-Cloud, Unlimited TinyPNG Alternative',
    heroSubheadline: 'TinyPNG uploads your photos to foreign servers and caps file sizes at 5MB. Imaginex crushes bytes directly in your local browser RAM with zero limits, zero fees, and total NDA compliance.',
    competitorWeaknesses: [
      '5MB maximum file limit on free accounts',
      'Capped at 20 images per batch (charges $39/year for more)',
      'Uploads private client and personal photos to third-party cloud servers',
      'Lacks modern AVIF next-gen encoding in standard tier',
      'Requires constant internet access; cannot work offline',
    ],
    imaginexStrengths: [
      '100% in-browser WebAssembly processing — zero bytes uploaded',
      'No file size restrictions (compress 50MB+ RAW/PNG photos locally)',
      'Unlimited batch processing with multi-threaded Web Workers',
      'Full AVIF & WebP support for up to 90% bandwidth savings',
      'Installable as an offline desktop/mobile PWA',
    ],
    tableRows: [
      { feature: 'Cloud Upload Required', imaginex: 'No (100% in-browser)', competitor: 'Yes (Sent to remote servers)', winner: 'imaginex' },
      { feature: 'Max File Size Limit', imaginex: 'Unlimited (Hardware-based)', competitor: '5 MB max (Free tier)', winner: 'imaginex' },
      { feature: 'Batch Processing Cap', imaginex: 'Unlimited images', competitor: '20 images per batch', winner: 'imaginex' },
      { feature: 'Pricing / Subscription', imaginex: '100% Free Forever', competitor: '$39/year Pro plan', winner: 'imaginex' },
      { feature: 'Next-Gen Formats', imaginex: 'AVIF, WebP, PNG, JPG', competitor: 'WebP, PNG, JPG only', winner: 'imaginex' },
      { feature: 'Offline PWA Capability', imaginex: 'Yes (Works without internet)', competitor: 'No (Web server required)', winner: 'imaginex' },
      { feature: 'Privacy & NDA Safety', imaginex: '100% Cryptographic RAM safety', competitor: 'Data retained temporarily in cloud', winner: 'imaginex' },
    ],
    verdict: 'If you work with confidential documents, high-res photos over 5MB, or need unlimited batch compression without paid subscriptions, Imaginex is the definitive modern alternative to TinyPNG.',
    faqs: [
      {
        q: 'Why should I switch from TinyPNG to Imaginex?',
        a: 'TinyPNG enforces artificial 5MB limits and uploads your private photos to third-party servers. Imaginex performs multi-threaded compression directly inside your device browser memory, giving you faster processing with zero data egress.',
      },
      {
        q: 'How does Imaginex achieve identical or better compression without servers?',
        a: 'Imaginex compiles battle-tested C/Rust compression engines to WebAssembly and executes them across your CPU worker threads using browser HTML5 canvas and SIMD acceleration.',
      },
      {
        q: 'Can I compress confidential client work under NDA?',
        a: 'Yes. Because zero network packets are sent to external servers, Imaginex meets strict corporate privacy, HIPAA, and NDA compliance standards.',
      },
    ],
    recommendedToolHref: '/tools/compress',
    recommendedToolName: 'Launch Smart Compressor',
  },
  'cloudconvert-alternative': {
    competitor: 'CloudConvert',
    tagline: 'Best Client-Side CloudConvert Alternative (0ms Queue Time)',
    metaTitle: 'Free CloudConvert Alternative — Instant In-Browser Conversion | Imaginex',
    metaDescription: 'Convert images without daily 25-minute conversion caps or slow server queues. Imaginex transforms AVIF, WebP, PNG, JPG, and HEIC instantly in local memory.',
    heroHeadline: 'Convert Image Files Without Server Queues or Limits',
    heroSubheadline: 'CloudConvert limits free users to 25 conversion minutes per day and leaves you waiting in remote queues. Imaginex converts photos instantaneously on your device CPU.',
    competitorWeaknesses: [
      'Strict 25 conversion minutes per day limit on free tier',
      'Queue wait times during peak traffic periods',
      'Uploads confidential assets to remote disk storage for 24 hours',
      'Requires credit card or prepaid packages for heavy use',
      'Slow upload and download roundtrips on large files',
    ],
    imaginexStrengths: [
      'Zero queue latency — conversions start the microsecond you drop a file',
      'Unlimited conversions with zero daily minute meters',
      'Photos are never saved on any remote disk or database',
      'No account creation, email verification, or credit card needed',
      'One-click ZIP bundling for bulk image folders',
    ],
    tableRows: [
      { feature: 'Daily Conversion Limit', imaginex: 'Unlimited forever', competitor: '25 conversion minutes/day', winner: 'imaginex' },
      { feature: 'Queue Wait Times', imaginex: '0 ms (Instant local execution)', competitor: 'Seconds to minutes in queue', winner: 'imaginex' },
      { feature: 'Server Storage Retention', imaginex: '0 bytes retained (RAM only)', competitor: 'Stored on remote disk for 24h', winner: 'imaginex' },
      { feature: 'Account Sign-Up', imaginex: 'None required', competitor: 'Required for high volumes', winner: 'imaginex' },
      { feature: 'Large File Transfer Lag', imaginex: '0ms (No network bandwidth used)', competitor: 'Slow upload + download delay', winner: 'imaginex' },
      { feature: 'Cost', imaginex: '100% Free', competitor: 'Subscriptions from $9/mo', winner: 'imaginex' },
    ],
    verdict: 'Imaginex eliminates CloudConvert’s biggest frustrations: server queue delays, daily conversion minute caps, and privacy concerns from remote file storage.',
    faqs: [
      {
        q: 'Is Imaginex as fast as CloudConvert?',
        a: 'Imaginex is significantly faster for image operations because it bypasses upload and download network bottlenecks entirely, computing conversions in local device memory.',
      },
      {
        q: 'What formats can Imaginex convert?',
        a: 'Imaginex natively handles modern formats including AVIF, WebP, PNG, JPEG, SVG, BMP, and Apple iPhone HEIC files.',
      },
    ],
    recommendedToolHref: '/tools/convert',
    recommendedToolName: 'Launch Format Converter',
  },
  'remove-bg-alternative': {
    competitor: 'Remove.bg',
    tagline: 'Best Free Remove.bg Alternative (High-Res Without Credits)',
    metaTitle: 'Free Remove.bg Alternative — High Resolution With No Watermark | Imaginex',
    metaDescription: 'Tired of Remove.bg charging credits for full-resolution cutouts? Imaginex provides high-resolution background removal directly in your browser with zero paywalls.',
    heroHeadline: 'Remove Backgrounds Without Paywalls or Low-Res Previews',
    heroSubheadline: 'Remove.bg limits free downloads to tiny 0.25-megapixel previews and charges up to $1.99 per full-resolution cutout. Imaginex gives you full-resolution exports 100% free.',
    competitorWeaknesses: [
      'Free tier restricted to low-resolution preview images (approx 625 × 400px)',
      'Aggressive credit system charging $0.20 to $1.99 per high-res image',
      'Uploads private portraits, family photos, and products to their cloud',
      'Requires monthly subscriptions or credit packs for professional work',
      'Blocks bulk background removal behind enterprise paywalls',
    ],
    imaginexStrengths: [
      '100% full-resolution exports — keep your original 4K and 24MP acuity',
      'Completely free with zero credit meters or subscription paywalls',
      'Runs computer vision models locally in browser memory',
      'Instant interactive split preview before exporting',
      'Zero account creation or sign-in hurdles',
    ],
    tableRows: [
      { feature: 'Full Resolution Export', imaginex: 'Free (Full 4K / Original)', competitor: 'Paid Credits ($0.20–$1.99/img)', winner: 'imaginex' },
      { feature: 'Free Preview Quality', imaginex: 'Full resolution', competitor: 'Downgraded 0.25 MP', winner: 'imaginex' },
      { feature: 'Cloud Privacy', imaginex: '100% Local device execution', competitor: 'Processed on remote GPU cluster', winner: 'imaginex' },
      { feature: 'Credit Meter / Paywall', imaginex: 'None (Unlimited)', competitor: 'Yes (Strict credit limits)', winner: 'imaginex' },
      { feature: 'Account Required', imaginex: 'No', competitor: 'Yes for subscriptions', winner: 'imaginex' },
    ],
    verdict: 'Skip Remove.bg’s expensive credit traps. Imaginex delivers full-resolution background segmentation directly on your device without spending a penny.',
    faqs: [
      {
        q: 'Does Imaginex charge for high-resolution background cutouts?',
        a: 'No. Unlike Remove.bg, Imaginex exports your exact original resolution without downsampling or charging credits.',
      },
      {
        q: 'Are my private portrait and product photos safe?',
        a: 'Yes. All background segmentation algorithms execute in your local browser sandbox. No images are sent to any server.',
      },
    ],
    recommendedToolHref: '/tools/remove-bg',
    recommendedToolName: 'Launch Background Eraser',
  },
  'iloveimg-alternative': {
    competitor: 'iLoveIMG',
    tagline: 'Best Clean, Ad-Free iLoveIMG Alternative',
    metaTitle: 'Free iLoveIMG Alternative — Ad-Free, Private & In-Memory | Imaginex',
    metaDescription: 'Looking for a cleaner, faster alternative to iLoveIMG without ads, cloud queues, or file upload limits? Try Imaginex client-side studio.',
    heroHeadline: 'Ad-Free Image Editing with 100% Device Privacy',
    heroSubheadline: 'iLoveIMG is cluttered with distracting banner ads and requires server-side file uploads. Imaginex delivers an elegant, ad-free studio powered entirely by your local browser.',
    competitorWeaknesses: [
      'Cluttered with heavy third-party banner advertisements and tracking cookies',
      'Requires uploading files to external server clusters',
      'Batch size and file bandwidth limits on free tier',
      'No native offline PWA installation',
    ],
    imaginexStrengths: [
      'Clean, distraction-free modern dark UI with zero advertisements',
      '100% in-browser processing with zero cloud data transmission',
      'Batch processing powered by multi-core Web Worker threads',
      'Installable offline PWA application for desktop and mobile',
    ],
    tableRows: [
      { feature: 'Advertisements', imaginex: 'Zero (100% Ad-Free)', competitor: 'Heavy banner ads & trackers', winner: 'imaginex' },
      { feature: 'Cloud File Uploads', imaginex: 'Zero uploads (Local RAM)', competitor: 'Uploaded to cloud servers', winner: 'imaginex' },
      { feature: 'Batch Web Worker Engine', imaginex: 'Yes (Multi-threaded)', competitor: 'Server-side batch queues', winner: 'imaginex' },
      { feature: 'Modern Next-Gen AVIF', imaginex: 'Native support', competitor: 'Limited support', winner: 'imaginex' },
      { feature: 'PWA Offline Installation', imaginex: 'Yes', competitor: 'No', winner: 'imaginex' },
    ],
    verdict: 'Imaginex delivers the complete image editing toolset of iLoveIMG with a modern aesthetic, zero advertisements, and complete in-memory privacy.',
    faqs: [
      {
        q: 'Why choose Imaginex over iLoveIMG?',
        a: 'Imaginex has no ads, no trackers, and doesn’t send your files to external servers. It runs directly on your machine.',
      },
    ],
    recommendedToolHref: '/tools/convert',
    recommendedToolName: 'Explore Studio Suite',
  },
  'squoosh-alternative': {
    competitor: 'Squoosh',
    tagline: 'Best Squoosh Alternative with Batch Processing & Modern Formats',
    metaTitle: 'Best Squoosh Alternative with Batch Processing | Imaginex',
    metaDescription: 'Love Google Squoosh but need batch processing, EXIF scrubbing, and background removal? Imaginex expands on Squoosh with multi-file workflows.',
    heroHeadline: 'The Multi-File, Feature-Packed Squoosh Alternative',
    heroSubheadline: 'Google Squoosh proved client-side compression is fast, but it only allows one image at a time and development has slowed. Imaginex brings full batch processing, EXIF scrubbing, and AI background removal.',
    competitorWeaknesses: [
      'Strictly single-image workflow — cannot batch process folders',
      'No built-in background removal or AI segmentation',
      'No EXIF/GPS privacy stripper or metadata inspector',
      'No watermarking or social cropping tools',
      'Development by Google Chrome Labs has largely ceased',
    ],
    imaginexStrengths: [
      'Full batch processing with multi-threaded Web Workers & ZIP export',
      '11 specialized tools: AI BG eraser, Lanczos3 resizer, EXIF scrub, watermark',
      'Interactive visual diff slider & color palette generator',
      'Actively maintained by Styloshare Team with regular codec updates',
      'Installable as an offline desktop/mobile PWA',
    ],
    tableRows: [
      { feature: 'Batch Processing', imaginex: 'Yes (Multi-file queue & ZIP)', competitor: 'No (Single image only)', winner: 'imaginex' },
      { feature: 'AI Background Removal', imaginex: 'Yes (Local neural net)', competitor: 'No', winner: 'imaginex' },
      { feature: 'EXIF GPS Stripper', imaginex: 'Yes (1-click redact)', competitor: 'No', winner: 'imaginex' },
      { feature: 'Watermark & Branding', imaginex: 'Yes (Custom text/tile)', competitor: 'No', winner: 'imaginex' },
      { feature: 'Client-Side In-Memory', imaginex: 'Yes (WASM)', competitor: 'Yes (WASM)', winner: 'tie' },
    ],
    verdict: 'Imaginex takes everything great about Google Squoosh and expands it into a comprehensive, multi-file image studio with batch processing and AI tools.',
    faqs: [
      {
        q: 'Can Imaginex batch process multiple files unlike Squoosh?',
        a: 'Yes! Imaginex includes a dedicated Bulk Studio that queues dozens of images across Web Worker threads and downloads a bundled ZIP package.',
      },
    ],
    recommendedToolHref: '/tools/bulk',
    recommendedToolName: 'Launch Bulk Studio',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = ALTERNATIVES[slug];
  if (!data) return { title: 'Alternative Tools — Imaginex' };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `/alternatives/${slug}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://imaginex.styloshare.com/alternatives/${slug}`,
      images: ['/seo-image.webp'],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(ALTERNATIVES).map((slug) => ({ slug }));
}

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = ALTERNATIVES[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-24">
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono mb-6 text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
          <span>/</span>
          <span>Alternatives</span>
          <span>/</span>
          <span className="text-[var(--brand)] font-bold">{data.competitor} Alternative</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{data.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
            {data.heroHeadline}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
            {data.heroSubheadline}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={data.recommendedToolHref}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-[var(--brand)]/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>{data.recommendedToolName}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools/bulk"
              className="px-6 py-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] font-semibold text-xs sm:text-sm transition-all"
            >
              Try Bulk Batch Studio
            </Link>
          </div>
        </div>

        {/* Head-to-Head Comparison Matrix Table */}
        <div className="mb-14 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Head-to-Head Comparison: Imaginex vs {data.competitor}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Detailed breakdown of privacy guarantees, limits, formats, and architecture.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] font-mono uppercase text-[11px] text-[var(--text-muted)]">
                  <th className="pb-3 pr-4">Feature / Capability</th>
                  <th className="pb-3 px-4 text-[var(--brand)] font-bold">Imaginex Studio</th>
                  <th className="pb-3 pl-4 text-rose-400">{data.competitor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.tableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="py-3.5 pr-4 font-medium text-[var(--text-primary)]">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.imaginex}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pl-4 text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        {row.winner === 'imaginex' ? (
                          <X className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>{row.competitor}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strengths & Weaknesses 2-Column Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Competitor Weaknesses */}
          <div className="p-6 sm:p-7 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-4">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
              <X className="w-5 h-5 text-rose-400" />
              <span>Where {data.competitor} Falls Short</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              {data.competitorWeaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Imaginex Strengths */}
          <div className="p-6 sm:p-7 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Why Imaginex Is The Superior Choice</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              {data.imaginexStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editorial Verdict Box */}
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--brand)] font-bold">
            The Final Verdict
          </span>
          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-medium">
            {data.verdict}
          </p>
          <div className="pt-2">
            <a
              href="https://www.styloshare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
            >
              <span>Engineered with ❤️ by Styloshare Team</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-14">
          <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--brand)]" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-1.5">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
