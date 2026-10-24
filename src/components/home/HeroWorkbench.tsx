'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  SlidersHorizontal, 
  Download, 
  RefreshCw, 
  FileSearch, 
  Layers, 
  ArrowRight, 
  Check, 
  Eye, 
  Cpu,
  Lock,
  Flame,
  SunMedium
} from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { toast } from 'sonner';

// Curated interactive demo presets with SVG vector illustrations
const DEMO_PRESETS = [
  {
    id: 'mountain',
    name: 'Mountain Vista',
    category: 'Landscape 4K',
    origSize: 4194304, // 4.0 MB
    origFormat: 'PNG',
    aspect: '16/9',
    bgColor: '#0F172A',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E1B4B" />
            <stop offset="45%" stop-color="#4338CA" />
            <stop offset="75%" stop-color="#F43F8E" />
            <stop offset="100%" stop-color="#FF9D32" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD080" />
            <stop offset="100%" stop-color="#FF5470" />
          </linearGradient>
          <linearGradient id="peakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="30%" stop-color="#A5B4FC" />
            <stop offset="100%" stop-color="#1E1B4B" />
          </linearGradient>
          <linearGradient id="frontMountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#312E81" />
            <stop offset="100%" stop-color="#0B0D18" />
          </linearGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#skyGrad)" />
        <circle cx="600" cy="360" r="140" fill="url(#sunGrad)" opacity="0.9" />
        <polygon points="120,675 380,240 640,675" fill="#4338CA" opacity="0.7" />
        <polygon points="520,675 780,210 1080,675" fill="#3730A3" opacity="0.6" />
        <polygon points="300,675 600,160 900,675" fill="url(#peakGrad)" />
        <polygon points="560,220 600,160 640,220 620,250 600,230 580,250" fill="#FFFFFF" />
        <polygon points="-80,675 240,380 560,675" fill="url(#frontMountain)" />
        <polygon points="700,675 980,360 1280,675" fill="url(#frontMountain)" />
        <polygon points="380,675 680,420 1020,675" fill="#0B0D18" opacity="0.9" />
        <g fill="#060814" opacity="0.8">
          <polygon points="180,675 190,580 200,675" />
          <polygon points="210,675 225,560 240,675" />
          <polygon points="250,675 260,590 270,675" />
          <polygon points="920,675 935,570 950,675" />
          <polygon points="960,675 970,595 980,675" />
        </g>
      </svg>
    `,
    metadata: {
      camera: 'Sony Alpha A7R V',
      lens: 'FE 24-70mm F2.8 GM II',
      iso: '100',
      shutter: '1/640s at f/5.6',
      gps: '45.8326° N, 6.8652° E (Mont Blanc)',
    },
  },
  {
    id: 'portrait',
    name: 'Studio Portrait',
    category: 'Alpha & Skin Tone',
    origSize: 3774873, // 3.6 MB
    origFormat: 'PNG',
    aspect: '4/5',
    bgColor: '#171A2B',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
        <defs>
          <linearGradient id="portGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181B" />
            <stop offset="50%" stop-color="#27272A" />
            <stop offset="100%" stop-color="#09090B" />
          </linearGradient>
          <radialGradient id="rimLight" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#7047FF" stop-opacity="0.4" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCD34D" />
            <stop offset="100%" stop-color="#F97316" />
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#portGrad)" />
        <rect width="800" height="1000" fill="url(#rimLight)" />
        <circle cx="400" cy="380" r="160" fill="url(#faceGrad)" opacity="0.9" />
        <circle cx="400" cy="380" r="168" stroke="#7047FF" stroke-width="4" fill="none" opacity="0.8" />
        <rect x="310" y="340" width="180" height="50" rx="25" fill="#0B0D18" stroke="#16D9F5" stroke-width="5" />
        <path d="M 160 880 C 180 620, 260 550, 400 550 C 540 550, 620 620, 640 880 Z" fill="#2563EB" opacity="0.85" />
        <path d="M 220 880 C 240 680, 300 610, 400 610 C 500 610, 560 680, 580 880 Z" fill="#1E293B" />
      </svg>
    `,
    metadata: {
      camera: 'Canon EOS R5',
      lens: 'RF 85mm F1.2 L USM',
      iso: '200',
      shutter: '1/200s at f/1.4',
      gps: '40.7128° N, 74.0060° W (New York)',
    },
  },
  {
    id: 'document',
    name: 'Confidential ID / Doc',
    category: 'Privacy & EXIF',
    origSize: 2831155, // 2.7 MB
    origFormat: 'JPG',
    aspect: '4/3',
    bgColor: '#1E293B',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" width="100%" height="100%">
        <defs>
          <linearGradient id="docBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F8FAFC" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
        </defs>
        <rect width="1000" height="750" fill="#0F172A" />
        <rect x="120" y="70" width="760" height="610" rx="24" fill="url(#docBg)" stroke="#94A3B8" stroke-width="2" />
        <rect x="160" y="110" width="300" height="30" rx="8" fill="#1E293B" />
        <rect x="160" y="155" width="180" height="16" rx="4" fill="#64748B" />
        <rect x="160" y="210" width="180" height="220" rx="14" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2" />
        <circle cx="250" cy="290" r="45" fill="#94A3B8" />
        <path d="M 190 410 C 200 350, 300 350, 310 410 Z" fill="#94A3B8" />
        <rect x="380" y="220" width="450" height="20" rx="6" fill="#1E293B" />
        <rect x="380" y="260" width="380" height="20" rx="6" fill="#1E293B" />
        <rect x="380" y="300" width="420" height="20" rx="6" fill="#1E293B" />
        <rect x="380" y="360" width="320" height="16" rx="4" fill="#64748B" />
        <rect x="380" y="390" width="280" height="16" rx="4" fill="#64748B" />
        <circle cx="740" cy="530" r="65" fill="#EF4444" opacity="0.8" stroke="#DC2626" stroke-width="3" stroke-dasharray="6,4" />
        <text x="740" y="535" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">VERIFIED CONFIDENTIAL</text>
      </svg>
    `,
    metadata: {
      camera: 'Apple iPhone 16 Pro Max',
      lens: '24mm f/1.78',
      iso: '50',
      shutter: '1/120s',
      gps: '37.7749° N, 122.4194° W (San Francisco)',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'Vibrant HDR',
    origSize: 5242880, // 5.0 MB
    origFormat: 'PNG',
    aspect: '16/9',
    bgColor: '#090D16',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
        <defs>
          <linearGradient id="cyberSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#050510" />
            <stop offset="70%" stop-color="#1E1035" />
            <stop offset="100%" stop-color="#4C0519" />
          </linearGradient>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#16D9F5" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#F43F8E" stop-opacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#cyberSky)" />
        <g stroke="url(#gridGrad)" stroke-width="1.5">
          <line x1="600" y1="400" x2="0" y2="675" />
          <line x1="600" y1="400" x2="200" y2="675" />
          <line x1="600" y1="400" x2="400" y2="675" />
          <line x1="600" y1="400" x2="600" y2="675" />
          <line x1="600" y1="400" x2="800" y2="675" />
          <line x1="600" y1="400" x2="1000" y2="675" />
          <line x1="600" y1="400" x2="1200" y2="675" />
          <line x1="300" y1="450" x2="900" y2="450" />
          <line x1="200" y1="500" x2="1000" y2="500" />
          <line x1="100" y1="570" x2="1100" y2="570" />
        </g>
        <rect x="180" y="240" width="90" height="260" fill="#0F172A" stroke="#16D9F5" stroke-width="2" />
        <rect x="290" y="160" width="130" height="340" fill="#1E1B4B" stroke="#F43F8E" stroke-width="2" />
        <rect x="440" y="200" width="110" height="300" fill="#0B0D18" stroke="#7047FF" stroke-width="2" />
        <rect x="580" y="130" width="140" height="370" fill="#18181B" stroke="#16D9F5" stroke-width="2" />
        <rect x="740" y="220" width="100" height="280" fill="#1E1B4B" stroke="#FF9D32" stroke-width="2" />
        <rect x="860" y="180" width="120" height="320" fill="#0F172A" stroke="#F43F8E" stroke-width="2" />
      </svg>
    `,
    metadata: {
      camera: 'Leica Q3',
      lens: 'Summilux 28mm f/1.7 ASPH',
      iso: '1600',
      shutter: '1/60s at f/2.0',
      gps: '35.6762° N, 139.6503° E (Tokyo Shinjuku)',
    },
  },
];

type TargetFormat = 'AVIF' | 'WEBP' | 'PNG' | 'JPG';
type ShaderFilter = 'original' | 'vibrant' | 'noir' | 'warm' | 'cyberpunk';

export function HeroWorkbench() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mountain');
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<TargetFormat>('AVIF');
  const [activeFilter, setActiveFilter] = useState<ShaderFilter>('original');
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage
  const [isScrubbed, setIsScrubbed] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'privacy' | 'full'>('split');
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);
  const [userFileName, setUserFileName] = useState<string>('');
  const [userFileSize, setUserFileSize] = useState<number>(0);
  const isDraggingSplit = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePreset = DEMO_PRESETS.find((p) => p.id === selectedPresetId) || DEMO_PRESETS[0];

  const currentOrigSize = userUploadedImage ? userFileSize : activePreset.origSize;
  const currentOrigFormat = userUploadedImage ? 'Uploaded' : activePreset.origFormat;

  // Real-time calculated compressed byte estimate based on quality & format compression curves
  const estimatedSize = useMemo(() => {
    let multiplier = 0.5;
    if (format === 'AVIF') multiplier = 0.08 + (quality / 100) * 0.12; // 88% - 92% compression
    else if (format === 'WEBP') multiplier = 0.12 + (quality / 100) * 0.18; // 75% - 88% compression
    else if (format === 'JPG') multiplier = 0.18 + (quality / 100) * 0.32; // 50% - 82% compression
    else if (format === 'PNG') multiplier = 0.70 + (quality / 100) * 0.25; // Lossless / high-fidelity
    return Math.max(12 * 1024, Math.round(currentOrigSize * multiplier));
  }, [currentOrigSize, quality, format]);

  const savingsPercent = Math.max(1, Math.round((1 - estimatedSize / currentOrigSize) * 100));

  // CSS Filter string based on active shader
  const filterStyle = useMemo(() => {
    switch (activeFilter) {
      case 'vibrant':
        return 'saturate(1.4) contrast(1.15)';
      case 'noir':
        return 'grayscale(1) contrast(1.3) brightness(0.95)';
      case 'warm':
        return 'sepia(0.3) saturate(1.25) hue-rotate(-10deg)';
      case 'cyberpunk':
        return 'contrast(1.25) saturate(1.6) hue-rotate(15deg)';
      default:
        return 'none';
    }
  }, [activeFilter]);

  // Handle Dragging Split Slider
  const handleMouseDown = () => {
    isDraggingSplit.current = true;
  };

  const handleTouchStart = () => {
    isDraggingSplit.current = true;
  };

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDraggingSplit.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = ((clientX - rect.left) / rect.width) * 100;
      setSplitPosition(Math.max(5, Math.min(95, pos)));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const onStop = () => {
      isDraggingSplit.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onStop);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onStop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onStop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onStop);
    };
  }, []);

  // Handle Custom File Drop in the Workbench
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setUserUploadedImage(url);
      setUserFileName(file.name);
      setUserFileSize(file.size);
      toast.success(`Loaded "${file.name}" into the live interactive workbench!`);
    }
  };

  const handleDownload = () => {
    const svgBlob = new Blob([activePreset.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imaginex-transformed-${selectedPresetId}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${format} output (${formatBytes(estimatedSize)}) generated locally!`);
  };

  return (
    <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto rounded-xl bg-[var(--bg-elevated)]/90 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/20 overflow-hidden relative transition-all duration-300">
      {/* Top Cockpit Header */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/90 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Engine Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
          </span>
          <span className="font-semibold text-[var(--text-primary)]">In-Memory Engine</span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[var(--success)] font-medium">0 Bytes Egress</span>
        </div>

        {/* Center: Presets Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] overflow-x-auto max-w-full">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                setUserUploadedImage(null);
                setIsScrubbed(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedPresetId === preset.id && !userUploadedImage
                  ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {preset.name}
            </button>
          ))}
          {userUploadedImage && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--brand)] text-white truncate max-w-[140px]">
              📁 {userFileName}
            </span>
          )}
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs">
          <button
            onClick={() => setActiveViewMode('split')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeViewMode === 'split'
                ? 'bg-[var(--bg-secondary)] text-[var(--brand)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Peeker</span>
          </button>
          <button
            onClick={() => setActiveViewMode('privacy')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeViewMode === 'privacy'
                ? 'bg-[var(--bg-secondary)] text-[var(--brand)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXIF Audit</span>
          </button>
          <button
            onClick={() => setActiveViewMode('full')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeViewMode === 'full'
                ? 'bg-[var(--bg-secondary)] text-[var(--brand)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Render</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Stage */}
      <div 
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] bg-[#070913] overflow-hidden select-none cursor-ew-resize group"
      >
        {/* Render Layer (Original vs Transformed) */}
        {userUploadedImage ? (
          <div className="w-full h-full relative flex items-center justify-center p-4">
            <img 
              src={userUploadedImage} 
              alt="User Uploaded" 
              className="max-w-full max-h-full object-contain rounded-xl"
              style={{ filter: activeViewMode !== 'privacy' ? filterStyle : 'none' }}
            />
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* Base Transformed Output Layer */}
            <div 
              className="w-full h-full flex items-center justify-center transition-all duration-150"
              style={{ filter: activeFilter !== 'original' ? filterStyle : 'none' }}
              dangerouslySetInnerHTML={{ __html: activePreset.svgContent }}
            />

            {/* Split Overlay Layer (Original Preview clipped on the left) */}
            {activeViewMode === 'split' && (
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${splitPosition}%` }}
              >
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', filter: 'none' }}
                  dangerouslySetInnerHTML={{ __html: activePreset.svgContent }}
                />
              </div>
            )}

            {/* Draggable Divider Handle */}
            {activeViewMode === 'split' && (
              <div 
                className="absolute top-0 bottom-0 z-30 cursor-ew-resize flex items-center justify-center"
                style={{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-[var(--brand-light)] to-transparent shadow-[0_0_12px_var(--brand)]" />
                <div className="absolute w-8 h-8 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--brand)] shadow-lg flex items-center justify-center text-[var(--brand)] hover:scale-110 active:scale-95 transition-transform">
                  <SlidersHorizontal className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Badges Floating on Canvas */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>ORIGINAL: {formatBytes(currentOrigSize)} ({currentOrigFormat})</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-none items-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OUTPUT: {formatBytes(estimatedSize)} ({format})</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
              -{savingsPercent}%
            </span>
          </div>
        </div>

        {/* Privacy Audit Mode Overlay */}
        {activeViewMode === 'privacy' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-25 p-6 flex flex-col justify-center items-center text-center animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-[var(--bg-secondary)]/95 border border-[var(--border)] rounded-xl p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--brand)]" />
                  <span className="font-bold text-sm text-[var(--text-primary)]">EXIF Telemetry Inspector</span>
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  isScrubbed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {isScrubbed ? 'Sanitized' : 'Vulnerable'}
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
                  <span className="text-[var(--text-muted)]">Camera Model:</span>
                  <span className={`font-semibold ${isScrubbed ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                    {isScrubbed ? '🔒 [REDACTED]' : activePreset.metadata.camera}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
                  <span className="text-[var(--text-muted)]">Lens Setup:</span>
                  <span className={`font-semibold ${isScrubbed ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                    {isScrubbed ? '🔒 [REDACTED]' : activePreset.metadata.lens}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
                  <span className="text-[var(--text-muted)]">GPS Geo-Tag:</span>
                  <span className={`font-semibold ${isScrubbed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isScrubbed ? '🔒 [STRIPPED 0.00°]' : activePreset.metadata.gps}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    setIsScrubbed(!isScrubbed);
                    toast.success(isScrubbed ? 'Reset metadata sample.' : 'Scrubbed all EXIF and GPS tags with 1 click!');
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isScrubbed 
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isScrubbed ? 'Restore Metadata' : 'Scrub All Tags Now (1-Click)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drag & Drop Prompt Overlay when hovered */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 text-[11px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Drag split bar or drop your own image file here
        </div>
      </div>

      {/* Interactive Control Cockpit Dock */}
      <div className="p-4 sm:p-6 bg-[var(--bg-secondary)] border-t border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Control 1: Compression Quality Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[var(--text-primary)] flex items-center gap-1.5 font-semibold">
                <Flame className="w-3.5 h-3.5 text-[var(--brand)]" />
                Compression Quality
              </span>
              <span className="font-mono text-[var(--brand)] font-bold">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[var(--bg-tertiary)] accent-[var(--brand)] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span>Ultra Small (10%)</span>
              <span>Balanced (75%)</span>
              <span>Max Fidelity (100%)</span>
            </div>
          </div>

          {/* Control 2: Format & Shaders Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
              <span>Target Next-Gen Format</span>
              <span className="text-[10px] font-mono text-[var(--success)]">WASM Ready</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['AVIF', 'WEBP', 'PNG', 'JPG'] as TargetFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    format === fmt
                      ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white shadow-xs'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Quick Shader Filter Pills */}
            <div className="flex items-center gap-1 pt-1 overflow-x-auto">
              <span className="text-[10px] text-[var(--text-muted)] font-medium mr-1 shrink-0">Shader:</span>
              {(['original', 'vibrant', 'noir', 'warm', 'cyberpunk'] as ShaderFilter[]).map((flt) => (
                <button
                  key={flt}
                  onClick={() => setActiveFilter(flt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider capitalize transition-all shrink-0 ${
                    activeFilter === flt
                      ? 'bg-[var(--brand)]/20 text-[var(--brand)] font-bold border border-[var(--brand)]/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          {/* Control 3: Instant Local Download & Full Studio Jump */}
          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Instant Output Size:</span>
              <span className="font-mono font-bold text-[var(--success)]">{formatBytes(estimatedSize)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[var(--brand)]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save {format}</span>
              </button>

              <Link
                href="/tools/convert"
                className="py-2.5 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:border-[var(--brand)]/40"
              >
                <span>Full Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="text-center text-[10px] text-[var(--text-muted)] font-mono flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-[var(--success)]" />
              <span>Processed locally in browser memory. 0 bytes uploaded.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
