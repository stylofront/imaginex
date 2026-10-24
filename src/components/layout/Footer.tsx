'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Cpu, Zap, Heart, Sparkles } from 'lucide-react';
import { TOOLS } from '@/lib/tools-config';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] relative overflow-hidden transition-colors">
      {/* Background glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[var(--brand)]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.webp"
                    alt="Imaginex"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-[var(--text-primary)]">
                  Imagine<span className="bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--accent-pink)] bg-clip-text text-transparent">x</span>
                </span>
              </Link>
              <a 
                href="https://www.styloshare.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors underline decoration-dotted underline-offset-2"
              >
                by Styloshare Team ↗
              </a>
            </div>

            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              The high-performance, completely client-side suite for transforming, compressing, converting, and editing images. Zero server uploads. 100% device privacy.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs text-[var(--success)] font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Files never leave your browser sandbox</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--accent)] font-medium">
                <Cpu className="w-4 h-4 shrink-0" />
                <span>Powered by WebAssembly & Web Workers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--brand)] font-medium">
                <Zap className="w-4 h-4 shrink-0" />
                <span>Zero bandwidth limits or queue time</span>
              </div>
            </div>
          </div>

          {/* Column: Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
              Core Studio
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/convert" className="hover:text-[var(--brand)] transition-colors">
                  Format Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="hover:text-[var(--brand)] transition-colors">
                  Smart Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/remove-bg" className="hover:text-[var(--brand)] transition-colors">
                  AI Background Eraser
                </Link>
              </li>
              <li>
                <Link href="/tools/resize" className="hover:text-[var(--brand)] transition-colors">
                  Lanczos3 Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/bulk" className="hover:text-[var(--brand)] transition-colors">
                  Bulk ZIP Studio
                </Link>
              </li>
              <li>
                <Link href="/tools/compare" className="hover:text-[var(--brand)] transition-colors">
                  Visual Diff Slider
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Competitor Comparisons */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono flex items-center gap-1.5">
              <span>Alternatives</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold">VS</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/alternatives/tinypng-alternative" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between">
                  <span>TinyPNG Alternative</span>
                </Link>
              </li>
              <li>
                <Link href="/alternatives/cloudconvert-alternative" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between">
                  <span>CloudConvert Alt</span>
                </Link>
              </li>
              <li>
                <Link href="/alternatives/remove-bg-alternative" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between">
                  <span>Remove.bg Alt (Free)</span>
                </Link>
              </li>
              <li>
                <Link href="/alternatives/iloveimg-alternative" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between">
                  <span>iLoveIMG Alternative</span>
                </Link>
              </li>
              <li>
                <Link href="/alternatives/squoosh-alternative" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between">
                  <span>Squoosh Alternative</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Blog & SEO Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
              Guides & Research
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-[var(--brand)] transition-colors font-medium text-[var(--brand)]">
                  All Guides & Benchmarks →
                </Link>
              </li>
              <li>
                <Link href="/blog/avif-vs-webp-vs-jpeg-comparison-guide" className="hover:text-[var(--brand)] transition-colors">
                  AVIF vs WebP vs JPEG
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-convert-heic-to-jpg-windows-without-software" className="hover:text-[var(--brand)] transition-colors">
                  HEIC to JPG on Windows
                </Link>
              </li>
              <li>
                <Link href="/blog/why-client-side-image-processing-is-the-future" className="hover:text-[var(--brand)] transition-colors">
                  Client-Side Architecture
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-strip-gps-exif-metadata-from-photos" className="hover:text-[var(--brand)] transition-colors">
                  Scrub EXIF & GPS Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Formats & Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
              Popular Presets
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/convert/png-to-webp" className="hover:text-[var(--brand)] transition-colors">
                  PNG to WEBP
                </Link>
              </li>
              <li>
                <Link href="/convert/heic-to-jpg" className="hover:text-[var(--brand)] transition-colors">
                  HEIC to JPG
                </Link>
              </li>
              <li>
                <Link href="/convert/png-to-avif" className="hover:text-[var(--brand)] transition-colors">
                  PNG to AVIF
                </Link>
              </li>
              <li>
                <Link href="/compress/compress-for-web" className="hover:text-[var(--brand)] transition-colors">
                  Compress for Web
                </Link>
              </li>
              <li>
                <Link href="/compress/reduce-image-size" className="hover:text-[var(--brand)] transition-colors">
                  Reduce to 100KB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Styloshare Team credit */}
        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>© 2026 Imaginex. All processing executed locally on your device.</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a 
              href="https://www.styloshare.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--brand)] transition-colors underline decoration-dotted underline-offset-2"
            >
              Styloshare Team ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
