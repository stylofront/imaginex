'use client';

import React, { useState } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { formatBytes, calculateSavings } from '@/lib/utils';
import { Trash2, ArrowLeftRight, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'compare')!;

interface CompareImage {
  file: File;
  previewUrl: string;
  size: number;
  width?: number;
  height?: number;
}

export default function CompareToolPage() {
  const [leftImage, setLeftImage] = useState<CompareImage | null>(null);
  const [rightImage, setRightImage] = useState<CompareImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const handleLeftImage = (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const f = files[0];
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      setLeftImage({
        file: f,
        previewUrl: url,
        size: f.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      toast.success('Loaded original (left) image');
    };
    img.src = url;
  };

  // Auto-populate from global session or IndexedDB
  React.useEffect(() => {
    const session = getSessionFiles();
    if (session.length > 0 && !leftImage) {
      handleLeftImage(session);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0 && !leftImage) {
          handleLeftImage(restored);
        }
      });
    }
  }, []);

  const handleRightImage = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      setRightImage({
        file: f,
        previewUrl: url,
        size: f.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      toast.success('Loaded modified (right) image');
    };
    img.src = url;
  };

  const swapImages = () => {
    const temp = leftImage;
    setLeftImage(rightImage);
    setRightImage(temp);
    toast.info('Swapped comparison positions');
  };

  const resetAll = () => {
    if (leftImage?.previewUrl) URL.revokeObjectURL(leftImage.previewUrl);
    if (rightImage?.previewUrl) URL.revokeObjectURL(rightImage.previewUrl);
    setLeftImage(null);
    setRightImage(null);
    setZoomLevel(100);
  };

  const savings = leftImage && rightImage
    ? calculateSavings(leftImage.size, rightImage.size)
    : 0;

  return (
    <ToolLayout
      tool={toolInfo}
      actionSecondary={
        leftImage || rightImage
          ? {
              label: 'Reset Comparison',
              onClick: resetAll,
              icon: <Trash2 className="w-4 h-4" />,
            }
          : undefined
      }
      controls={
        <div className="space-y-6">
          {/* Display Mode */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Comparison Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setViewMode('slider')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  viewMode === 'slider'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Split Slider
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Side-by-Side
              </button>
            </div>
          </div>

          {/* Swap Button */}
          {leftImage && rightImage && (
            <button
              onClick={swapImages}
              className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4 text-[var(--brand)]" />
              <span>Swap Left & Right</span>
            </button>
          )}

          {/* Zoom Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Zoom (Pixel Peep)
              </label>
              <span className="text-xs font-mono font-bold text-[var(--brand)]">
                {zoomLevel}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="50"
                max="300"
                step="25"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
              />
              <button
                onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics comparison */}
          {leftImage && rightImage && (
            <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-3 shadow-xs">
              <span className="text-xs font-semibold text-[var(--text-primary)] block uppercase tracking-wider font-mono">
                Analysis Results
              </span>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-secondary)]">Original Size:</span>
                <span className="font-mono text-[var(--text-primary)] font-semibold">{formatBytes(leftImage.size)}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-secondary)]">Modified Size:</span>
                <span className="font-mono text-[var(--brand)] font-bold">{formatBytes(rightImage.size)}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Storage Saved:</span>
                  <span className="font-mono font-bold text-[var(--success)]">
                    -{savings}% ({formatBytes(leftImage.size - rightImage.size)})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      }
      features={[
        {
          title: 'Interactive Real-Time Curtain',
          description: 'Drag the split curtain horizontally to immediately isolate compression artifacts, edge bleeding, or color shifts.',
        },
        {
          title: 'Synchronized Zoom & Pan',
          description: 'Inspect micro-textures at up to 300% zoom to verify font sharpness and artifact boundaries.',
        },
      ]}
      faqItems={[
        {
          question: 'What types of comparisons can I run?',
          answer: 'Compare original vs compressed images, PNG vs WebP/AVIF conversions, or pre-AI vs post-AI background removal results.',
        },
      ]}
    >
      <div className="space-y-6">
        {(!leftImage || !rightImage) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!leftImage ? (
              <FileDropzone
                onFilesSelected={handleLeftImage}
                multiple={false}
                title="Drop Original (Before)"
                subtitle="Primary or uncompressed photo"
                className="py-10"
              />
            ) : (
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={leftImage.previewUrl}
                    alt="Original"
                    className="w-12 h-12 object-cover rounded-lg border border-[var(--border)]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] block">Left: {leftImage.file.name}</span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono">{formatBytes(leftImage.size)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setLeftImage(null)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Change
                </button>
              </div>
            )}

            {!rightImage ? (
              <FileDropzone
                onFilesSelected={handleRightImage}
                multiple={false}
                title="Drop Modified (After)"
                subtitle="Compressed or converted photo"
                className="py-10"
              />
            ) : (
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rightImage.previewUrl}
                    alt="Modified"
                    className="w-12 h-12 object-cover rounded-lg border border-[var(--border)]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] block">Right: {rightImage.file.name}</span>
                    <span className="text-[11px] text-[var(--brand)] font-mono">{formatBytes(rightImage.size)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setRightImage(null)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        )}

        {leftImage && rightImage && (
          <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] p-4 overflow-hidden flex items-center justify-center min-h-[450px]">
            {viewMode === 'slider' ? (
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 max-w-full"
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[var(--border)]">
                  <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={leftImage.previewUrl} alt="Original" />}
                    itemTwo={<ReactCompareSliderImage src={rightImage.previewUrl} alt="Modified" />}
                    className="max-h-[500px] w-auto object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full"
              >
                <div className="space-y-2 text-center">
                  <span className="text-xs font-mono text-[var(--text-secondary)]">Original</span>
                  <img
                    src={leftImage.previewUrl}
                    alt="Left"
                    className="max-h-[400px] w-auto mx-auto object-contain rounded-xl border border-[var(--border)] shadow-lg"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <span className="text-xs font-mono text-[var(--brand)]">Modified</span>
                  <img
                    src={rightImage.previewUrl}
                    alt="Right"
                    className="max-h-[400px] w-auto mx-auto object-contain rounded-xl border border-[var(--border)] shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
