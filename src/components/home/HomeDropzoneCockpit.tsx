'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  UploadCloud, 
  RefreshCw, 
  Minimize2, 
  Maximize2, 
  Eraser, 
  Crop, 
  Palette, 
  ShieldCheck, 
  SunMedium, 
  Layers, 
  ArrowRight, 
  Check, 
  FileCheck, 
  X,
  FileWarning,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Droplets
} from 'lucide-react';
import { useDropzone, Accept } from 'react-dropzone';
import { setSessionFiles, getSessionFiles, restoreSessionFiles } from '@/lib/file-session';
import { SAMPLE_PRESETS, samplePresetToPngFile, SamplePreset } from '@/lib/sample-images';
import { formatBytes } from '@/lib/utils';
import { toast } from 'sonner';

const DEFAULT_ACCEPT: Accept = {
  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.bmp', '.tiff', '.heic'],
};

export function HomeDropzoneCockpit() {
  const router = useRouter();
  const [activeFiles, setActiveFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState<string | null>(null);
  const [isPasting, setIsPasting] = useState(false);

  // Sync initial state if files already exist in session or IndexedDB
  useEffect(() => {
    const existing = getSessionFiles();
    if (existing.length > 0 && activeFiles.length === 0) {
      handleFiles(existing, false);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0) {
          handleFiles(restored, false);
        }
      });
    }
  }, []);

  const handleFiles = useCallback((files: File[], showToast = true) => {
    if (files.length === 0) return;
    setActiveFiles(files);
    setSessionFiles(files);

    const first = files[0];
    const url = URL.createObjectURL(first);
    setPreviewUrl(url);

    // Measure natural dimensions
    const img = new window.Image();
    img.onload = () => {
      setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;

    if (showToast) {
      toast.success(
        files.length === 1
          ? `Loaded "${first.name}" (${formatBytes(first.size)}) into session!`
          : `Loaded ${files.length} images into session!`
      );
    }
  }, []);

  // Dropzone setup
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFiles(acceptedFiles);
      }
    },
    [handleFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: DEFAULT_ACCEPT,
    multiple: true,
    maxSize: 100 * 1024 * 1024,
  });

  // Global Ctrl+V paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = Array.from(e.clipboardData.items);
      const imageFiles: File[] = [];

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        setIsPasting(true);
        handleFiles(imageFiles);
        setTimeout(() => setIsPasting(false), 1200);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  // Load sample preset as real PNG file
  const handleSelectSample = async (preset: SamplePreset) => {
    try {
      setIsLoadingSample(preset.id);
      const file = await samplePresetToPngFile(preset);
      handleFiles([file]);
      toast.success(`Loaded sample: ${preset.label}`);
    } catch (err) {
      toast.error('Failed to load sample image.');
    } finally {
      setIsLoadingSample(null);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setActiveFiles([]);
    setPreviewUrl(null);
    setImageMeta(null);
    setSessionFiles([]);
    toast.info('Session image cleared.');
  };

  const navigateToTool = (href: string) => {
    // Ensure files are in session before routing
    if (activeFiles.length > 0) {
      setSessionFiles(activeFiles);
    }
    router.push(href);
  };

  const primaryTools = [
    {
      title: 'Convert Format',
      badge: 'AVIF, WebP, JPG, PNG',
      icon: RefreshCw,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      href: '/tools/convert',
    },
    {
      title: 'Smart Compress',
      badge: 'Up to 90% Smaller',
      icon: Minimize2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      href: '/tools/compress',
    },
    {
      title: 'AI Remove BG',
      badge: 'Local Neural Model',
      icon: Eraser,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      href: '/tools/remove-bg',
    },
    {
      title: 'Lanczos3 Resize',
      badge: 'Pixel-Sharp Sinc',
      icon: Maximize2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      href: '/tools/resize',
    },
    {
      title: 'Crop & Social',
      badge: '1:1, 4:5, 16:9, Free',
      icon: Crop,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      href: '/tools/crop',
    },
    {
      title: 'Color Palette',
      badge: 'HEX & Tailwind CSS',
      icon: Palette,
      color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
      href: '/tools/color-palette',
    },
    {
      title: 'EXIF & Privacy',
      badge: 'Scrub GPS & Camera',
      icon: ShieldCheck,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      href: '/tools/metadata',
    },
    {
      title: 'Watermark Stamp',
      badge: 'Copyright Overlay',
      icon: Droplets,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      href: '/tools/watermark',
    },
  ];

  return (
    <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto">
      {/* If No Image is Loaded: Sleek Modern Shadcn Dropzone + Instant Sample Presets */}
      {activeFiles.length === 0 ? (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`relative group cursor-pointer rounded-xl border border-dashed p-8 sm:p-12 transition-all duration-200 text-center select-none overflow-hidden ${
              isDragActive && !isDragReject
                ? 'border-[var(--brand)] bg-[var(--brand)]/10 shadow-lg shadow-[var(--brand)]/15 scale-[1.01]'
                : isDragReject
                ? 'border-rose-500 bg-rose-500/10'
                : isPasting
                ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                : 'border-[var(--border)] hover:border-[var(--brand)]/50 bg-[var(--bg-secondary)]/90 hover:bg-[var(--bg-secondary)] shadow-sm'
            }`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Modern Icon with Aura */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isDragActive
                    ? 'bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/30 scale-110'
                    : 'bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--brand)] group-hover:scale-105 group-hover:border-[var(--brand)]/40 group-hover:text-[var(--accent)]'
                }`}
              >
                {isDragReject ? (
                  <FileWarning className="w-7 h-7 text-rose-500 animate-bounce" />
                ) : isPasting ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-pulse" />
                ) : isDragActive ? (
                  <Sparkles className="w-7 h-7 text-white animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7 transition-transform duration-200 group-hover:-translate-y-0.5" />
                )}
              </div>

              {/* Text */}
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  {isDragReject
                    ? 'Unsupported format or file exceeds 100MB'
                    : isDragActive
                    ? 'Drop your images here now'
                    : isPasting
                    ? 'Image pasted from clipboard!'
                    : 'Drop images here, or browse from device'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  Files process in local RAM memory • Zero bytes leave your browser
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)] font-mono text-[11px]">
                  AVIF, WEBP, PNG, JPG, SVG, BMP, TIFF
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[11px]">
                  Ctrl + V to Paste
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] font-medium text-[11px]">
                  Batch Multi-Upload Supported
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Preset Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mr-1">
              Or Try A Sample:
            </span>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectSample(preset)}
                disabled={isLoadingSample !== null}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--brand)]/40 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{preset.label}</span>
                {isLoadingSample === preset.id && (
                  <span className="w-3 h-3 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Active Workspace Cockpit: File is Loaded! Image Stays Loaded Across All Pages! */
        <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-5 sm:p-6 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Preview Column: 5 Cols */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                {/* Active Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      In-Memory Session Active
                    </span>
                  </div>

                  <button
                    onClick={handleClear}
                    className="p-1.5 rounded-md hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-colors flex items-center gap-1 text-xs"
                    title="Clear current image"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>

                {/* Thumbnail Display */}
                <div className="relative rounded-lg bg-[#070914] border border-[var(--border)] h-56 sm:h-64 flex items-center justify-center p-3 overflow-hidden group">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt={activeFiles[0].name}
                      className="max-h-full max-w-full object-contain rounded-md transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  )}

                  {/* File Info Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono flex items-center justify-between">
                    <span className="truncate max-w-[180px] font-semibold" title={activeFiles[0].name}>
                      {activeFiles[0].name}
                    </span>
                    <span className="text-emerald-400 shrink-0 font-bold">
                      {formatBytes(activeFiles[0].size)}
                    </span>
                  </div>
                </div>

                {/* Resolution & Format Specs */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]">
                    <span className="text-[var(--text-muted)] block text-[10px]">RESOLUTION:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {imageMeta ? `${imageMeta.width} × ${imageMeta.height} px` : 'Measuring...'}
                    </span>
                  </div>
                  <div className="p-2 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]">
                    <span className="text-[var(--text-muted)] block text-[10px]">QUEUED FILES:</span>
                    <span className="font-semibold text-[var(--brand)]">
                      {activeFiles.length} File{activeFiles.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Replace Button */}
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose Another Image</span>
                </button>
              </div>
            </div>

            {/* Right Action Matrix: 7 Cols */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      Select Image Operation
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Your photo is loaded into memory and ready for instant processing.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] font-bold">
                    0ms Cloud Lag
                  </span>
                </div>

                {/* Grid of Direct Tool Launchers */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {primaryTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        onClick={() => {
                          if (activeFiles.length > 0) setSessionFiles(activeFiles);
                        }}
                        className="p-3.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--brand)]/50 text-left transition-all group flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-md border flex items-center justify-center ${tool.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors">
                              {tool.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] block pl-9">
                            {tool.badge}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all mt-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bulk Batch Shortcut Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Need to batch convert {activeFiles.length} item{activeFiles.length > 1 ? 's' : ''}?
                </span>
                <Link
                  href="/tools/bulk"
                  onClick={() => {
                    if (activeFiles.length > 0) setSessionFiles(activeFiles);
                  }}
                  className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Launch Bulk Studio ↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
