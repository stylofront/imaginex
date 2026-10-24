'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  SlidersHorizontal,
  RefreshCw,
  Minimize2,
  Maximize2,
  Crop,
  Palette,
  FileSearch,
  Layers,
  SunMedium,
  Eraser,
  ExternalLink,
  Droplets
} from 'lucide-react';
import { HomeDropzoneCockpit } from '@/components/home/HomeDropzoneCockpit';
import { CapabilitiesBento } from '@/components/home/CapabilitiesBento';
import { WorkflowPresets } from '@/components/home/WorkflowPresets';
import { InteractiveFaq } from '@/components/home/InteractiveFaq';
import { TOOLS } from '@/lib/tools-config';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter((tool) => tool.category === activeCategory);

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-sky-400" />;
      case 'Minimize2': return <Minimize2 className="w-5 h-5 text-emerald-400" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5 text-purple-400" />;
      case 'Sparkles': return <Eraser className="w-5 h-5 text-rose-400" />;
      case 'Crop': return <Crop className="w-5 h-5 text-amber-400" />;
      case 'SlidersHorizontal': return <SlidersHorizontal className="w-5 h-5 text-[var(--brand)]" />;
      case 'Palette': return <Palette className="w-5 h-5 text-fuchsia-400" />;
      case 'FileSearch': return <FileSearch className="w-5 h-5 text-teal-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'SunMedium': return <SunMedium className="w-5 h-5 text-orange-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
      default: return <Sparkles className="w-5 h-5 text-[var(--brand)]" />;
    }
  };

  return (
    <div className="relative overflow-hidden pt-8 sm:pt-12 pb-24">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-[var(--brand)]/12 via-[var(--accent)]/8 to-[var(--accent-pink)]/8 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[var(--brand)]/6 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-2/3 right-0 w-80 h-80 bg-[var(--accent)]/6 blur-[100px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-20 sm:mb-24">
        {/* Eyebrow Badge linking to Styloshare */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-6 backdrop-blur-md shadow-xs hover:border-[var(--brand)]/40 transition-colors">
          <div className="relative w-4 h-4 overflow-hidden rounded-md shrink-0">
            <Image src="/logo.webp" alt="Imaginex Logo" width={16} height={16} className="object-contain" />
          </div>
          <span className="text-[var(--text-primary)] font-semibold">Imaginex Studio</span>
          <span className="text-[var(--text-muted)]">•</span>
          <a
            href="https://www.styloshare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand)] font-semibold hover:underline flex items-center gap-1"
          >
            Built by Styloshare Team ↗
          </a>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.14] mb-5">
          Transform, Compress & Edit Photos{' '}
          <span className="bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--accent-pink)] bg-clip-text text-transparent">
            With Zero Server Uploads.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Every pixel is computed locally inside your browser memory using WebAssembly & multi-threaded Web Workers. 100% private, free of bandwidth throttling, and safe for sensitive documents.
        </p>

        {/* Value Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[var(--text-secondary)] mb-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium text-[var(--text-primary)]">100% In-Memory (Zero Cloud Egress)</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--brand)] shrink-0" />
            <span className="font-medium text-[var(--text-primary)]">0ms Queue Latency</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span className="font-medium text-[var(--text-primary)]">Lanczos3 Sinc & SIMD Accelerated</span>
          </div>
        </div>

        {/* Studio Cockpit Dropzone (Front and Center) */}
        <HomeDropzoneCockpit />
      </section>

      {/* Section 2: Interactive Engine Capabilities (Bento) */}
      <CapabilitiesBento />

      {/* Section 3: Full Studio Suite (All 11 Tools) */}
      <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-20 sm:mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-3 border border-[var(--brand)]/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Suite Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              All 11 Transformation Utilities
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xs">
            {['all', 'convert', 'optimize', 'edit', 'analyze'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--brand)]/50 transition-all duration-200 hover:shadow-lg shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] group-hover:scale-105 flex items-center justify-center transition-transform shadow-xs border border-[var(--border)]">
                    {getToolIcon(tool.iconName)}
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] font-bold uppercase tracking-wider border border-[var(--brand)]/20">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors mb-2">
                  {tool.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Highlights List */}
                <ul className="space-y-1.5 mb-6">
                  {tool.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--brand)] group-hover:text-[var(--accent)] transition-colors">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4: Creator Workflow Playbooks */}
      <WorkflowPresets />

      {/* Section 5: Interactive Transparency & FAQ */}
      <InteractiveFaq />

      {/* Section 6: Final CTA */}
      <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-xl bg-gradient-to-r from-[var(--brand)]/12 via-[var(--bg-secondary)] to-[var(--accent)]/12 border border-[var(--border)] backdrop-blur-xl text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Imaginex — Engineered by Styloshare Team</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Ready to experience truly private, zero-cloud image editing?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
              No account creation. No tracking. No limits. All processing runs directly on your local device CPU & GPU.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tools/convert"
                className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 shadow-md shadow-[var(--brand)]/20 transition-all hover:scale-[1.02]"
              >
                Launch Format Converter
              </Link>
              <Link
                href="/tools/bulk"
                className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] transition-all"
              >
                Open Bulk Batch Studio
              </Link>
              <a
                href="https://www.styloshare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5"
              >
                <span>Visit Styloshare</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
