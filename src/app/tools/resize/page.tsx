'use client';

import React, { useState, useRef } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { ProcessedFile } from '@/types';
import { formatBytes, getImageDimensions } from '@/lib/utils';
import { Download, Maximize2, Lock, Unlock, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pica from 'pica';
import { saveAs } from 'file-saver';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'resize')!;

interface Preset {
  name: string;
  width: number;
  height: number;
  category: string;
}

const PRESETS: Preset[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, category: 'Social' },
  { name: 'Instagram Story / Reel', width: 1080, height: 1920, category: 'Social' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'Video' },
  { name: 'Full HD (1080p)', width: 1920, height: 1080, category: 'Display' },
  { name: 'Twitter / X Banner', width: 1500, height: 500, category: 'Social' },
  { name: '4K Ultra HD', width: 3840, height: 2160, category: 'Display' },
];

export default function ResizeToolPage() {
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(1200);
  const [targetHeight, setTargetHeight] = useState<number>(800);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number>(1.5);
  const [filterQuality, setFilterQuality] = useState<'lanczos3' | 'lanczos2'>('lanczos3');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const initializedRef = useRef<boolean>(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const file = files[0];

    try {
      const dims = await getImageDimensions(file);
      const ratio = dims.width / dims.height;

      setOriginalAspectRatio(ratio);
      setTargetWidth(dims.width);
      setTargetHeight(dims.height);

      setSelectedFile({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        originalSize: file.size,
        originalWidth: dims.width,
        originalHeight: dims.height,
        status: 'idle',
      });

      toast.success(`Image loaded (${dims.width} × ${dims.height}px)`);
    } catch {
      toast.error('Could not determine image dimensions.');
    }
  };

  // Auto-populate from global session or IndexedDB
  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const session = getSessionFiles();
    if (session.length > 0 && !selectedFile) {
      handleFilesSelected(session);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0 && !selectedFile) {
          handleFilesSelected(restored);
        }
      });
    }
  }, []);

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (aspectRatioLocked && originalAspectRatio > 0) {
      setTargetHeight(Math.round(val / originalAspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (aspectRatioLocked && originalAspectRatio > 0) {
      setTargetWidth(Math.round(val * originalAspectRatio));
    }
  };

  const applyPreset = (preset: Preset) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setAspectRatioLocked(false);
    toast.info(`Applied preset: ${preset.name} (${preset.width}×${preset.height})`);
  };

  const processResize = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const picaInstance = pica();
      const img = new Image();
      img.src = selectedFile.previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const fromCanvas = document.createElement('canvas');
      fromCanvas.width = img.naturalWidth;
      fromCanvas.height = img.naturalHeight;
      const fromCtx = fromCanvas.getContext('2d')!;
      fromCtx.drawImage(img, 0, 0);

      const toCanvas = document.createElement('canvas');
      toCanvas.width = targetWidth;
      toCanvas.height = targetHeight;

      await picaInstance.resize(fromCanvas, toCanvas, {
        filter: filterQuality,
        unsharpAmount: 40,
        unsharpRadius: 0.5,
        unsharpThreshold: 0,
      });

      const blob = await picaInstance.toBlob(toCanvas, selectedFile.file.type || 'image/png', 0.92);
      const processedUrl = URL.createObjectURL(blob);

      setSelectedFile((prev) =>
        prev
          ? {
              ...prev,
              status: 'done',
              processedBlob: blob,
              processedUrl,
              processedSize: blob.size,
              processedWidth: targetWidth,
              processedHeight: targetHeight,
            }
          : null
      );

      toast.success(`Resized to ${targetWidth} × ${targetHeight}px using Lanczos3!`);
    } catch (err: any) {
      toast.error(err.message || 'Resizing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!selectedFile?.processedBlob) return;
    const originalBaseName = selectedFile.file.name.substring(0, selectedFile.file.name.lastIndexOf('.')) || selectedFile.file.name;
    saveAs(selectedFile.processedBlob, `${originalBaseName}_${targetWidth}x${targetHeight}.png`);
  };

  const clearSelection = () => {
    if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
    if (selectedFile?.processedUrl) URL.revokeObjectURL(selectedFile.processedUrl);
    setSelectedFile(null);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        selectedFile
          ? {
              label: selectedFile.status === 'done' ? 'Download Resized Image' : 'Resize Image Now',
              onClick: selectedFile.status === 'done' ? downloadResult : processResize,
              loading: isProcessing,
              icon: selectedFile.status === 'done' ? <Download className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />,
            }
          : undefined
      }
      actionSecondary={
        selectedFile
          ? {
              label: 'Reset',
              onClick: clearSelection,
              icon: <Trash2 className="w-4 h-4" />,
            }
          : undefined
      }
      controls={
        <div className="space-y-6">
          {/* Dimension Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Custom Dimensions
              </label>
              <button
                onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                  aspectRatioLocked
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--brand)]'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
                title="Lock aspect ratio"
              >
                {aspectRatioLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{aspectRatioLocked ? 'Locked' : 'Unlocked'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Width (px)</label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-secondary)] block mb-1">Height (px)</label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] border border-[var(--border)] text-left transition-colors"
                >
                  <span className="text-xs font-semibold text-[var(--text-primary)] block truncate">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-[var(--brand)] font-mono font-medium">
                    {p.width} × {p.height}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interpolation Filter */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Resampling Algorithm
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setFilterQuality('lanczos3')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                  filterQuality === 'lanczos3'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                <span className="font-semibold block">Lanczos 3 (Sharpest)</span>
                <span className="text-[10px] text-[var(--text-muted)]">Highest quality windowed sinc interpolation</span>
              </button>
              <button
                onClick={() => setFilterQuality('lanczos2')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                  filterQuality === 'lanczos2'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                <span className="font-semibold block">Lanczos 2 (Fast)</span>
                <span className="text-[10px] text-[var(--text-muted)]">Balanced speed and clarity</span>
              </button>
            </div>
          </div>
        </div>
      }
      features={[
        {
          title: 'Lanczos3 Interpolation Algorithm',
          description: 'Standard browsers use bilinear interpolation which blurs downscaled details. Lanczos3 computes mathematical sinc curves for razor-sharp results.',
        },
        {
          title: 'Unsharp Mask Post-Processing',
          description: 'Subtle unsharp mask automatically enhances micro-contrast to prevent sharpness loss during severe downsampling.',
        },
      ]}
      faqItems={[
        {
          question: 'Why is Lanczos3 better than standard browser canvas resizing?',
          answer: 'Standard canvas drawing uses simple bilinear smoothing that loses high-frequency details. Lanczos3 samples a 6x6 pixel grid using a sinc convolution filter to preserve edge crispness.',
        },
      ]}
    >
      {!selectedFile ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          title="Drop image to resize"
          subtitle="Lanczos3 sinc interpolation for pixel-perfect clarity"
          badge="Lanczos3 Filter"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {selectedFile.file.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                Original: {selectedFile.originalWidth} × {selectedFile.originalHeight}px ({formatBytes(selectedFile.originalSize)})
                {selectedFile.processedWidth && (
                  <span className="text-[var(--brand)] font-bold ml-2">
                    → Target: {selectedFile.processedWidth} × {selectedFile.processedHeight}px ({formatBytes(selectedFile.processedSize || 0)})
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={clearSelection}
              className="text-xs text-rose-500 hover:underline"
            >
              Choose different image
            </button>
          </div>

          <div className="relative rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] p-4 flex items-center justify-center min-h-[360px] overflow-hidden shadow-inner">
            <img
              src={selectedFile.processedUrl || selectedFile.previewUrl}
              alt="Preview"
              className="max-h-[450px] max-w-full object-contain rounded-lg shadow-xl"
            />

            {isProcessing && (
              <div className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[var(--brand)] animate-spin" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Executing Lanczos3 Sinc Convolution...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
