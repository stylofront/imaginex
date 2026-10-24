'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown, 
  Layers,
  Zap,
  RefreshCw,
  Minimize2,
  Maximize2,
  Crop,
  SlidersHorizontal,
  Palette,
  FileSearch,
  SunMedium,
  Eraser,
  ArrowRight,
  Sparkles,
  Lock,
  BookOpen,
  Scale
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { PwaInstallBanner } from '@/components/common/PwaInstallBanner';

const TOOL_GROUPS = [
  {
    category: 'Convert & Optimize',
    tag: 'Speed & Sizing',
    items: [
      {
        id: 'convert',
        title: 'Image Converter',
        desc: 'Convert WEBP, PNG, JPG, AVIF & GIF',
        href: '/tools/convert',
        icon: RefreshCw,
        badge: 'Fast',
        color: 'text-sky-500 bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white',
      },
      {
        id: 'compress',
        title: 'Image Compressor',
        desc: 'Shrink file size up to 90% losslessly',
        href: '/tools/compress',
        icon: Minimize2,
        badge: 'Smart',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white',
      },
      {
        id: 'resize',
        title: 'Image Resizer',
        desc: 'Lanczos3 ultra-clean pixel scaling',
        href: '/tools/resize',
        icon: Maximize2,
        badge: 'Lanczos3',
        color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white',
      },
      {
        id: 'bulk',
        title: 'Bulk Batch Studio',
        desc: 'Convert & resize queues into ZIP',
        href: '/tools/bulk',
        icon: Layers,
        badge: 'ZIP',
        color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white',
      },
    ],
  },
  {
    category: 'AI & Creative Studio',
    tag: 'Editing & Styles',
    items: [
      {
        id: 'remove-bg',
        title: 'AI Background Remover',
        desc: 'Neural cutout 100% inside browser',
        href: '/tools/remove-bg',
        icon: Eraser,
        badge: 'AI',
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white',
      },
      {
        id: 'crop',
        title: 'Image Cropper',
        desc: 'Preset ratios, rotation & flip grid',
        href: '/tools/crop',
        icon: Crop,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white',
      },
      {
        id: 'filters',
        title: 'Filters & Shaders',
        desc: 'Cinematic grading & canvas tones',
        href: '/tools/filters',
        icon: SunMedium,
        color: 'text-orange-500 bg-orange-500/10 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white',
      },
      {
        id: 'watermark',
        title: 'Watermark Protection',
        desc: 'Custom text & transparent logos',
        href: '/tools/watermark',
        icon: ShieldCheck,
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white',
      },
    ],
  },
  {
    category: 'Analysis & Inspect',
    tag: 'Quality & Privacy',
    items: [
      {
        id: 'compare',
        title: 'Image Diff & Compare',
        desc: 'Side-by-side interactive split slider',
        href: '/tools/compare',
        icon: SlidersHorizontal,
        badge: 'Slider',
        color: 'text-[var(--brand)] bg-[var(--brand)]/10 border-[var(--brand)]/20 group-hover:bg-[var(--brand)] group-hover:text-white',
      },
      {
        id: 'color-palette',
        title: 'Color Palette Extractor',
        desc: 'Extract dominant HEX & Tailwind code',
        href: '/tools/color-palette',
        icon: Palette,
        color: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20 group-hover:bg-fuchsia-500 group-hover:text-white',
      },
      {
        id: 'metadata',
        title: 'EXIF Privacy Inspector',
        desc: 'Camera specs & 1-click GPS scrub',
        href: '/tools/metadata',
        icon: FileSearch,
        badge: 'Privacy',
        color: 'text-teal-500 bg-teal-500/10 border-teal-500/20 group-hover:bg-teal-500 group-hover:text-white',
      },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-colors bg-[var(--bg-primary)]">
      <PwaInstallBanner />
      <div className="w-full bg-[var(--bg-primary)] border-b border-[var(--border)] shadow-xs transition-colors">
        <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-sm">
                <Image
                  src="/logo.webp"
                  alt="Imaginex Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-lg"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[var(--text-primary)] flex items-center">
                  Imagine<span className="bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--accent-pink)] bg-clip-text text-transparent">x</span>
                </span>
              </div>
            </Link>
            <a
              href="https://www.styloshare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block text-[9px] sm:text-[10px] tracking-widest uppercase font-mono text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors underline decoration-dotted underline-offset-2 self-end mb-1"
              title="Visit Styloshare Team"
            >
              by Styloshare ↗
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Tools Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsToolsDropdownOpen(true)}
              onMouseLeave={() => setIsToolsDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isToolsDropdownOpen || pathname.startsWith('/tools')
                    ? 'text-[var(--text-primary)] bg-[var(--bg-tertiary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              >
                <span>Tools Studio</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180 text-[var(--brand)]' : ''}`} />
              </button>

              {/* Mega Dropdown Panel with Hover Bridge */}
              {isToolsDropdownOpen && (
                <div className="absolute top-full left-[-40px] xl:left-[-100px] pt-2 w-[860px] xl:w-[920px] max-w-[calc(100vw-2rem)] z-50">
                  <div className="p-5 sm:p-6 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/20 transition-colors animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* 3 Balanced Columns */}
                    <div className="grid grid-cols-3 gap-5">
                      {TOOL_GROUPS.map((group, groupIndex) => (
                        <div key={group.category} className="space-y-2.5">
                          {/* Column Header */}
                          <div className="pb-2 border-b border-[var(--border)] flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                              {group.category}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {group.tag}
                            </span>
                          </div>

                          {/* Column Tool Items */}
                          <div className="space-y-1">
                            {group.items.map((item) => {
                              const IconComponent = item.icon;
                              return (
                                <Link
                                  key={item.id}
                                  href={item.href}
                                  onClick={() => setIsToolsDropdownOpen(false)}
                                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all duration-150 border border-transparent hover:border-[var(--border)]"
                                >
                                  {/* Tool Icon */}
                                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-105 shadow-xs ${item.color}`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>

                                  {/* Tool Info */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <span className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors truncate">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] shrink-0">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 leading-tight">
                                      {item.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}

                            {/* 3rd column spotlight card to match 4 items height perfectly */}
                            {groupIndex === 2 && (
                              <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--brand)]/10 via-[var(--accent)]/5 to-[var(--accent-pink)]/10 border border-[var(--brand)]/20 mt-1 relative overflow-hidden group/card">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)]">
                                      <Lock className="w-2.5 h-2.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-[var(--text-primary)]">
                                      100% In-Memory
                                    </span>
                                  </div>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--success)]/15 text-[var(--success)] font-mono font-semibold">
                                    Zero Cloud
                                  </span>
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] leading-tight mb-2">
                                  Your photos never leave your device. Safe for sensitive documents.
                                </p>
                                <Link
                                  href="/tools/bulk"
                                  onClick={() => setIsToolsDropdownOpen(false)}
                                  className="text-[11px] font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
                                >
                                  Bulk Batch Pipeline
                                  <ArrowRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Status & Quick Action Bar */}
                    <div className="mt-4 pt-3.5 border-t border-[var(--border)] flex items-center justify-between text-xs px-2">
                      <div className="flex items-center gap-2 text-[var(--text-muted)] text-[11px]">
                        <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                        <span>All 11 tools run entirely client-side via WebAssembly & Web Workers</span>
                      </div>
                      <Link 
                        href="/tools/bulk" 
                        onClick={() => setIsToolsDropdownOpen(false)}
                        className="text-[var(--brand)] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        Open Bulk Studio →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/alternatives/tinypng-alternative"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith('/alternatives')
                  ? 'text-[var(--text-primary)] bg-[var(--bg-tertiary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              Alternatives
            </Link>

            <Link
              href="/blog"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith('/blog')
                  ? 'text-[var(--text-primary)] bg-[var(--bg-tertiary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              Blog & Guides
            </Link>
          </nav>

          {/* Right items: Privacy Pill, Theme Toggle, CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Private</span>
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            <Link
              href="/tools/convert"
              className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 shadow-md shadow-[var(--brand)]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Launch Studio
            </Link>

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto shadow-2xl transition-colors">
          {TOOL_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                <span>{group.category}</span>
                <span className="text-[10px] text-[var(--brand)]">{group.tag}</span>
              </div>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${item.color}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--brand)]/10 text-[var(--brand)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Mobile: Alternatives & Guides */}
          <div className="space-y-1 pt-2 border-t border-[var(--border)]">
            <div className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Research & Guides</span>
              <span className="text-[10px] text-[var(--accent)] font-semibold">SEO</span>
            </div>
            <Link
              href="/alternatives/tinypng-alternative"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              <div className="w-7 h-7 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">TinyPNG Alternative</span>
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              <div className="w-7 h-7 rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Guides, Tutorials & Benchmarks</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[var(--border)] space-y-3">
            <Link
              href="/tools/convert"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] shadow-md"
            >
              Launch Studio
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span>Crafted by</span>
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
      )}
    </header>
  );
}

