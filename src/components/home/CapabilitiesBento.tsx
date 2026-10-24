'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Maximize2, 
  Eraser, 
  Palette, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Sliders, 
  Eye, 
  FileText,
  Lock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export function CapabilitiesBento() {
  // Bento 1: Lanczos3 vs Bilinear toggle state
  const [resamplingMode, setResamplingMode] = useState<'lanczos3' | 'bilinear'>('lanczos3');

  // Bento 2: Background wipe percentage
  const [bgWipePos, setBgWipePos] = useState<number>(45);

  // Bento 3: Copied color swatch
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Bento 5: Metadata toggle
  const [isRedacted, setIsRedacted] = useState<boolean>(true);

  const brandSwatches = [
    { hex: '#7047FF', name: 'Imaginex Violet', tag: 'Brand' },
    { hex: '#4D8DFF', name: 'Electric Sky', tag: 'Accent' },
    { hex: '#F43F8E', name: 'Cyber Pink', tag: 'Highlight' },
    { hex: '#FF9D32', name: 'Solar Amber', tag: 'Warm' },
    { hex: '#16D9F5', name: 'Neon Cyan', tag: 'Glow' },
    { hex: '#22C58B', name: 'Emerald Safe', tag: 'Success' },
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-3 border border-[var(--accent)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Engineered for Pixel Perfection.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md">
          Explore interactive demonstrations of the in-browser algorithms powering Imaginex. Zero cloud latency.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Card 1: Lanczos3 Resampling Microscope (Span 2 cols on lg) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[var(--brand)]/50 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                <Maximize2 className="w-4 h-4" />
              </div>
              {/* Algorithm Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs">
                <button
                  onClick={() => setResamplingMode('bilinear')}
                  className={`px-2.5 py-1 rounded-md font-mono font-medium transition-all ${
                    resamplingMode === 'bilinear'
                      ? 'bg-rose-500/10 text-rose-400 font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Standard Bilinear
                </button>
                <button
                  onClick={() => setResamplingMode('lanczos3')}
                  className={`px-2.5 py-1 rounded-md font-mono font-medium transition-all ${
                    resamplingMode === 'lanczos3'
                      ? 'bg-[var(--brand)] text-white font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Lanczos3 Sinc
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Lanczos3 Sinc Interpolation
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Standard browser scaling produces blurry edges and ringing artifacts. Imaginex calculates a 3-lobed sinc mathematical filter to keep downscaled typography and high-frequency textures pin-sharp.
            </p>

            {/* Interactive Resampling Canvas Preview */}
            <div className="h-44 sm:h-52 rounded-lg bg-[#090D18] border border-[var(--border)] p-4 flex items-center justify-center relative overflow-hidden select-none">
              <div 
                className={`transition-all duration-300 flex flex-col items-center justify-center text-center ${
                  resamplingMode === 'bilinear' ? 'blur-[1.2px] opacity-75' : 'blur-0 opacity-100 scale-100'
                }`}
              >
                <div className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-[var(--brand-light)] via-[var(--accent)] to-[var(--accent-pink)] bg-clip-text text-transparent">
                  PIN SHARP 4K
                </div>
                <div className="text-xs sm:text-sm font-mono text-[var(--text-primary)] mt-1 tracking-widest uppercase">
                  {resamplingMode === 'lanczos3' ? 'Lanczos-3 Kernel Filtering • 0 Blur' : 'Bilinear Interpolation • Blurry Edges'}
                </div>
                <div className="flex gap-2 mt-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    resamplingMode === 'lanczos3' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {resamplingMode === 'lanczos3' ? 'Edge Contrast: 99.4%' : 'Edge Contrast: 72.1% (Lossy)'}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[var(--text-muted)]">
                Algorithm: {resamplingMode.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)]">Pica WebAssembly Kernel</span>
            <Link 
              href="/tools/resize"
              className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
            >
              Try Image Resizer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: AI Neural Background Eraser (Span 2 cols on lg) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-[var(--accent-pink)]/50 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] flex items-center justify-center">
                <Eraser className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] font-semibold border border-[var(--accent-pink)]/20">
                Local Neural AI
              </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              In-Browser Neural Background Eraser
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Peel backgrounds away with sub-pixel hair strand precision using neural vision models running directly in your browser. No API keys, zero cloud costs.
            </p>

            {/* Interactive Curtain Wipe */}
            <div 
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setBgWipePos(Math.max(5, Math.min(95, pos)));
              }}
              className="h-44 sm:h-52 rounded-lg border border-[var(--border)] relative overflow-hidden cursor-ew-resize select-none"
            >
              {/* Layer 1: Background removed with checkerboard pattern */}
              <div className="absolute inset-0 bg-[#0B0D18] flex items-center justify-center">
                <div 
                  className="w-full h-full opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(#BEBEFF 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />
                <div className="absolute text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--brand)] to-[var(--accent-pink)] mx-auto mb-2 flex items-center justify-center shadow-lg shadow-[var(--brand)]/30">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Subject Cutout (Alpha 0.0)
                  </span>
                </div>
              </div>

              {/* Layer 2: Original Background (clipped by wipe position) */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-950 flex items-center justify-center overflow-hidden"
                style={{ width: `${bgWipePos}%` }}
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600 via-rose-800 to-indigo-900" />
                <div className="absolute text-center" style={{ width: '400px' }}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--brand)] to-[var(--accent-pink)] mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white/80">
                    Original Background
                  </span>
                </div>
              </div>

              {/* Draggable Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]"
                style={{ left: `${bgWipePos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center shadow-md">
                  ↔
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)]">Hover or drag to reveal cutout</span>
            <Link 
              href="/tools/remove-bg"
              className="text-xs font-semibold text-[var(--accent-pink)] hover:underline flex items-center gap-1"
            >
              Launch BG Eraser <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Click-to-Copy Palette Vault */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md flex flex-col justify-between group hover:border-[var(--brand)]/50 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Click any swatch to copy
              </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Color Palette & HEX Engine
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Extract dominant harmonies, HEX codes, and Tailwind configuration directly from image pixels using ColorThief.
            </p>

            {/* Clickable Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {brandSwatches.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => handleCopyColor(swatch.hex)}
                  className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] text-left group/swatch transition-all hover:scale-[1.02]"
                >
                  <div 
                    className="w-full h-8 rounded-md mb-2 shadow-inner transition-transform group-hover/swatch:scale-105"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      {swatch.hex}
                    </span>
                    {copiedHex === swatch.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 group-hover/swatch:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">{swatch.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)]">HEX • RGB • HSL • Tailwind</span>
            <Link 
              href="/tools/color-palette"
              className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
            >
              Extract from Photos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Multi-Threaded Batch Machine */}
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md flex flex-col justify-between group hover:border-[var(--brand)]/50 transition-all duration-300">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-4 h-4" />
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Multi-Threaded Batch Pipeline
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Queue 50+ images simultaneously. Process conversions across Web Worker threads and download a bundled ZIP.
            </p>

            {/* Queue Counter Simulation */}
            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Active Workers:</span>
                <span className="text-emerald-400 font-bold">4 Threads</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Batch Queue:</span>
                <span className="text-[var(--text-primary)] font-bold">48 / 48 Done</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] h-full w-full animate-pulse" />
              </div>
              <div className="text-[10px] text-emerald-400 text-center font-bold">
                ZIP Package Ready (1.2s)
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <Link 
              href="/tools/bulk"
              className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1 w-full justify-between"
            >
              <span>Launch Bulk Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 5: EXIF Privacy Stripper Vault */}
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              EXIF & GPS Privacy Stripper
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Photos taken on modern smartphones leak your exact home GPS coordinates. Scrub camera tags with 1 click.
            </p>

            {/* Interactive Toggle */}
            <div className="p-3.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">GPS Coordinates:</span>
                <span className={isRedacted ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {isRedacted ? '🔒 [STRIPPED]' : '37.7749° N, 122.4194° W'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Device Serial:</span>
                <span className={isRedacted ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {isRedacted ? '🔒 [REDACTED]' : 'SN: DNPX498K10'}
                </span>
              </div>
              <button
                onClick={() => setIsRedacted(!isRedacted)}
                className="w-full mt-2 py-1.5 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[10px] text-[var(--text-primary)] font-semibold transition-all border border-[var(--border)]"
              >
                {isRedacted ? 'Show Raw Metadata' : 'Scrub Clean (Redact)'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <Link 
              href="/tools/metadata"
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 w-full justify-between"
            >
              <span>Inspect Metadata</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
