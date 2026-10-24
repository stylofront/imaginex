'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'filters')!;

interface FilterPreset {
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
  hue: number;
  blur: number;
}

const PRESETS: FilterPreset[] = [
  { name: 'Normal (Clean)', brightness: 100, contrast: 100, saturation: 100, sepia: 0, grayscale: 0, hue: 0, blur: 0 },
  { name: 'Cinematic Warm', brightness: 105, contrast: 120, saturation: 110, sepia: 25, grayscale: 0, hue: -5, blur: 0 },
  { name: 'Dramatic B&W', brightness: 100, contrast: 140, saturation: 0, sepia: 0, grayscale: 100, hue: 0, blur: 0 },
  { name: 'Imaginex Vivid', brightness: 110, contrast: 130, saturation: 155, sepia: 0, grayscale: 0, hue: 35, blur: 0 },
  { name: 'Vintage 70s', brightness: 95, contrast: 90, saturation: 80, sepia: 50, grayscale: 0, hue: 10, blur: 0 },
  { name: 'Cool Minimal', brightness: 105, contrast: 110, saturation: 90, sepia: 0, grayscale: 0, hue: 190, blur: 0 },
];

export default function FiltersToolPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('photo.png');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [sepia, setSepia] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [hue, setHue] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const file = files[0];
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    toast.success('Image loaded for color grading');
  };

  // Auto-populate from global session or IndexedDB
  useEffect(() => {
    const session = getSessionFiles();
    if (session.length > 0 && !imageSrc) {
      handleFilesSelected(session);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0 && !imageSrc) {
          handleFilesSelected(restored);
        }
      });
    }
  }, []);

  const applyPreset = (p: FilterPreset) => {
    setBrightness(p.brightness);
    setContrast(p.contrast);
    setSaturation(p.saturation);
    setSepia(p.sepia);
    setGrayscale(p.grayscale);
    setHue(p.hue);
    setBlur(p.blur);
    toast.info(`Preset applied: ${p.name}`);
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hue}deg) blur(${blur}px)`;
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
    };
  }, [imageSrc, brightness, contrast, saturation, sepia, grayscale, hue, blur]);

  const downloadFiltered = () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const base = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        saveAs(blob, `${base}_adjusted.png`);
        toast.success('Adjusted image downloaded!');
      }
      setIsProcessing(false);
    }, 'image/png');
  };

  const resetAll = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    applyPreset(PRESETS[0]);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        imageSrc
          ? {
              label: 'Download Adjusted Image',
              onClick: downloadFiltered,
              loading: isProcessing,
              icon: <Download className="w-4 h-4" />,
            }
          : undefined
      }
      actionSecondary={
        imageSrc
          ? {
              label: 'Reset',
              onClick: resetAll,
              icon: <Trash2 className="w-4 h-4" />,
            }
          : undefined
      }
      controls={
        <div className="space-y-6">
          {/* Presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Artistic Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] border border-[var(--border)] text-left text-xs font-medium text-[var(--text-primary)] transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Brightness</span>
                <span className="text-[var(--brand)] font-bold">{brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Contrast</span>
                <span className="text-[var(--accent)] font-bold">{contrast}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full accent-[var(--accent)] bg-[var(--bg-tertiary)] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Saturation</span>
                <span className="text-[var(--success)] font-bold">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full accent-[var(--success)] bg-[var(--bg-tertiary)] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Sepia</span>
                <span className="text-[var(--warning)] font-bold">{sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(parseInt(e.target.value))}
                className="w-full accent-[var(--warning)] bg-[var(--bg-tertiary)] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Grayscale</span>
                <span className="text-[var(--text-primary)] font-bold">{grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={grayscale}
                onChange={(e) => setGrayscale(parseInt(e.target.value))}
                className="w-full accent-[var(--text-muted)] bg-[var(--bg-tertiary)] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Hue Rotation</span>
                <span className="text-[var(--accent-cyan)] font-bold">{hue}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full accent-[var(--accent-cyan)] bg-[var(--bg-tertiary)] h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      }
      features={[
        {
          title: 'Direct Hardware Shader Acceleration',
          description: 'Leverages GPU canvas shading pipelines for real-time, zero-latency 60FPS filter manipulation.',
        },
        {
          title: 'Lossless Export',
          description: 'Bakes color adjustments into a full-resolution 32-bit PNG with uncompressed pixel fidelity.',
        },
      ]}
      faqItems={[
        {
          question: 'Are adjustments destructive?',
          answer: 'All sliders are completely non-destructive until you click download. You can reset or swap presets at any time.',
        },
      ]}
    >
      {!imageSrc ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          title="Drop image to adjust colors & filters"
          subtitle="Real-time brightness, contrast, saturation, and cinematic presets"
          badge="Hardware-Accelerated Canvas Filters"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-primary)] font-mono">{fileName}</span>
            <button
              onClick={resetAll}
              className="text-xs text-rose-500 hover:underline"
            >
              Choose different image
            </button>
          </div>

          <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] p-4 flex items-center justify-center min-h-[420px] overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              className="max-h-[450px] max-w-full object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
