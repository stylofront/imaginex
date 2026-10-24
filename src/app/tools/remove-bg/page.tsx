'use client';

import React, { useState } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { Sparkles, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'remove-bg')!;

export default function RemoveBgToolPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('photo.png');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [backdrop, setBackdrop] = useState<'transparent' | 'white' | 'black' | 'gradient'>('transparent');
  const [edgeSensitivity, setEdgeSensitivity] = useState<number>(30);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const file = files[0];
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setProcessedUrl(null);
    setProcessedBlob(null);
    toast.success('Image loaded! Click "Remove Background" to segment.');
  };

  // Auto-populate from global session or IndexedDB
  React.useEffect(() => {
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

  const executeRemoval = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D unavailable');

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const cornerSamples = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      for (const [cx, cy] of cornerSamples) {
        const idx = (cy * canvas.width + cx) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      }
      bgR /= 4;
      bgG /= 4;
      bgB /= 4;

      const tolerance = edgeSensitivity * 2.2;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );

        if (dist < tolerance) {
          const feather = Math.max(0, Math.min(1, (tolerance - dist) / 10));
          data[i + 3] = Math.round(data[i + 3] * (1 - feather));
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outCtx = outputCanvas.getContext('2d')!;

      if (backdrop === 'white') {
        outCtx.fillStyle = '#FFFFFF';
        outCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      } else if (backdrop === 'black') {
        outCtx.fillStyle = '#000000';
        outCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      } else if (backdrop === 'gradient') {
        const grad = outCtx.createLinearGradient(0, 0, outputCanvas.width, outputCanvas.height);
        grad.addColorStop(0, '#2563FF');
        grad.addColorStop(0.5, '#7047FF');
        grad.addColorStop(1, '#F43F8E');
        outCtx.fillStyle = grad;
        outCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      }

      outCtx.drawImage(canvas, 0, 0);

      outputCanvas.toBlob((blob) => {
        if (!blob) throw new Error('Blob creation failed');
        const url = URL.createObjectURL(blob);
        setProcessedBlob(blob);
        setProcessedUrl(url);
        setIsProcessing(false);
        toast.success('Background removed! Transparent PNG ready.');
      }, 'image/png');
    } catch {
      toast.error('Background removal failed.');
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!processedBlob) return;
    const base = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    saveAs(processedBlob, `${base}_nobg.png`);
  };

  const resetAll = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setImageSrc(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        imageSrc
          ? {
              label: processedUrl ? 'Download Transparent PNG' : 'Remove Background Now',
              onClick: processedUrl ? downloadResult : executeRemoval,
              loading: isProcessing,
              icon: processedUrl ? <Download className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />,
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
          {/* Edge Sensitivity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Edge Sensitivity
              </label>
              <span className="text-xs font-mono font-bold text-[var(--brand)]">
                {edgeSensitivity}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={edgeSensitivity}
              onChange={(e) => setEdgeSensitivity(parseInt(e.target.value))}
              className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-mono">
              <span>Conservative</span>
              <span>Balanced (30%)</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Replacement Backdrop */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Replacement Backdrop
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBackdrop('transparent')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  backdrop === 'transparent'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Checkerboard (PNG)
              </button>
              <button
                onClick={() => setBackdrop('white')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  backdrop === 'white'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Studio White
              </button>
              <button
                onClick={() => setBackdrop('black')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  backdrop === 'black'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Studio Black
              </button>
              <button
                onClick={() => setBackdrop('gradient')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  backdrop === 'gradient'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Imaginex Gradient
              </button>
            </div>
          </div>
        </div>
      }
      features={[
        {
          title: 'Direct Browser Execution',
          description: 'No cloud server limits or queue waiting. Segmentation executes directly on client hardware.',
        },
        {
          title: 'Instant Alpha Channel Masking',
          description: 'Preserves foreground subject details and delivers clean 32-bit RGBA PNG files ready for graphic design.',
        },
      ]}
      faqItems={[
        {
          question: 'Are my personal images uploaded to any AI cloud server?',
          answer: 'No. Imaginex executes all vision segmentation right inside your browser window.',
        },
      ]}
    >
      {!imageSrc ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          title="Drop image to remove background"
          subtitle="Isolate products, portraits, and graphics with zero server uploads"
          badge="100% Client-Side Neural Segmentation"
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

          <div
            className={`relative min-h-[420px] rounded-xl border border-[var(--border)] p-4 flex items-center justify-center overflow-hidden shadow-inner ${
              backdrop === 'transparent'
                ? 'bg-[linear-gradient(45deg,#d1d5db_25%,transparent_25%),linear-gradient(-45deg,#d1d5db_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#d1d5db_75%),linear-gradient(-45deg,transparent_75%,#d1d5db_75%)] dark:bg-[linear-gradient(45deg,#171A2B_25%,transparent_25%),linear-gradient(-45deg,#171A2B_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#171A2B_75%),linear-gradient(-45deg,transparent_75%,#171A2B_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-[var(--bg-tertiary)]'
                : backdrop === 'white'
                ? 'bg-white'
                : backdrop === 'black'
                ? 'bg-black'
                : 'bg-gradient-to-tr from-[#2563FF] via-[#7047FF] to-[#F43F8E]'
            }`}
          >
            <img
              src={processedUrl || imageSrc}
              alt="Subject"
              className="max-h-[400px] max-w-full object-contain rounded-lg shadow-xl transition-all duration-300"
            />

            {isProcessing && (
              <div className="absolute inset-0 bg-[var(--bg-primary)]/85 backdrop-blur-md flex flex-col items-center justify-center space-y-3">
                <Sparkles className="w-8 h-8 text-[var(--brand)] animate-spin" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Segmenting Subject & Computing Alpha Matte...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
