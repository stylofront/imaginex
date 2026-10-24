'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code, 
  Share2, 
  Camera, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Zap, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const WORKFLOWS = [
  {
    id: 'developers',
    title: 'Web Developers & SEO Teams',
    icon: Code,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    tag: 'Core Web Vitals',
    description: 'Crush bandwidth costs and achieve 100 Lighthouse scores by migrating legacy PNG/JPG assets to modern AVIF and WebP.',
    presets: [
      { name: 'Convert to Next-Gen AVIF (80% Quality)', tool: '/tools/convert' },
      { name: 'Compress Image under 100KB for Web', tool: '/compress/compress-for-web' },
      { name: 'Batch Pipeline with organized ZIP export', tool: '/tools/bulk' },
      { name: 'Extract CSS & Tailwind Palette variables', tool: '/tools/color-palette' },
    ],
    ctaText: 'Launch Developer Flow',
    ctaLink: '/tools/convert',
  },
  {
    id: 'creators',
    title: 'Content Creators & Social Marketers',
    icon: Share2,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    tag: 'Social Sizing',
    description: 'Ensure your graphics look immaculate across Instagram, YouTube, Twitter/X, and TikTok without awkward edge pixelation.',
    presets: [
      { name: 'Instagram Portrait Crop (1080 × 1350, 4:5)', tool: '/tools/crop' },
      { name: 'YouTube Video Thumbnail (1280 × 720, 16:9)', tool: '/tools/resize' },
      { name: 'Remove Background for YouTube Thumbnails', tool: '/tools/remove-bg' },
      { name: 'Apply Watermark Stamp for Brand Copyright', tool: '/tools/watermark' },
    ],
    ctaText: 'Launch Creator Flow',
    ctaLink: '/tools/resize',
  },
  {
    id: 'photographers',
    title: 'Photographers & Visual Artists',
    icon: Camera,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    tag: 'High Fidelity',
    description: 'Maintain pristine tonal range and edge acuity using 3-lobed Lanczos sinc interpolation and visual diff inspections.',
    presets: [
      { name: 'Lanczos3 Upscale with 0 Blurry Artifacts', tool: '/tools/resize' },
      { name: 'Interactive Visual Diff & Artifact Inspector', tool: '/tools/compare' },
      { name: 'Cinematic Color Grading & Canvas Shaders', tool: '/tools/filters' },
      { name: 'Export Lossless High-Resolution PNG', tool: '/tools/convert' },
    ],
    ctaText: 'Launch Artist Flow',
    ctaLink: '/tools/compare',
  },
  {
    id: 'privacy',
    title: 'Confidential IDs, Passports & Legal',
    icon: ShieldAlert,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    tag: 'Zero Cloud Storage',
    description: 'Process sensitive government IDs, tax invoices, medical records, and NDA client files with 100% cryptographic assurance that no bytes leave your device.',
    presets: [
      { name: '1-Click GPS Coordinate & EXIF Stripper', tool: '/tools/metadata' },
      { name: 'High-Res Cropping of Identity Cards', tool: '/tools/crop' },
      { name: 'Stamp "CONFIDENTIAL" Watermark Overlay', tool: '/tools/watermark' },
      { name: 'In-Memory Only Execution (RAM Purged on Tab Close)', tool: '/tools/convert' },
    ],
    ctaText: 'Launch Privacy Flow',
    ctaLink: '/tools/metadata',
  },
];

export function WorkflowPresets() {
  const [activeTab, setActiveTab] = useState<string>('developers');

  const activeWorkflow = WORKFLOWS.find((w) => w.id === activeTab) || WORKFLOWS[0];
  const IconComponent = activeWorkflow.icon;

  return (
    <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-3 border border-[var(--brand)]/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Tailored Playbooks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
          Curated for Your Specific Workflow.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Pre-tuned transformation pipelines designed for developers, creators, artists, and privacy-conscious professionals.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {WORKFLOWS.map((wf) => {
          const TabIcon = wf.icon;
          return (
            <button
              key={wf.id}
              onClick={() => setActiveTab(wf.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === wf.id
                  ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)]'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{wf.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Workflow Card */}
      <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-6 sm:p-8 shadow-lg relative overflow-hidden animate-in fade-in duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Description: 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${activeWorkflow.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] font-bold">
                  {activeWorkflow.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {activeWorkflow.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {activeWorkflow.description}
            </p>

            <div className="pt-2">
              <Link
                href={activeWorkflow.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[var(--brand)]/20 transition-all hover:scale-105"
              >
                <span>{activeWorkflow.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Presets List: 5 cols */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Included In-Browser Operations:
            </div>
            {activeWorkflow.presets.map((preset, idx) => (
              <Link
                key={idx}
                href={preset.tool}
                className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--brand)]/40 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors">
                    {preset.name}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
