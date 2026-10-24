'use client';

import React, { useState, useRef } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { ProcessedFile } from '@/types';
import { formatBytes, calculateSavings } from '@/lib/utils';
import { Layers, FileArchive, Trash2, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'bulk')!;

type TargetFormat = 'image/webp' | 'image/png' | 'image/jpeg' | 'image/avif';

export default function BulkToolPage() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('image/webp');
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const initializedRef = useRef<boolean>(false);

  const formatExtensions: Record<TargetFormat, string> = {
    'image/webp': 'webp',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/avif': 'avif',
  };

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setSessionFiles(newFiles);

    setFiles((prev) => {
      const existingKeys = new Set(prev.map((item) => `${item.file.name}_${item.file.size}`));
      const uniqueNewFiles = newFiles.filter(
        (f) => !existingKeys.has(`${f.name}_${f.size}`)
      );

      if (uniqueNewFiles.length === 0) return prev;

      const items: ProcessedFile[] = uniqueNewFiles.map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        previewUrl: URL.createObjectURL(f),
        originalSize: f.size,
        status: 'idle',
      }));

      toast.success(`Enqueued ${uniqueNewFiles.length} images for bulk pipeline`);
      return [...prev, ...items];
    });
  };

  // Auto-populate from global session or IndexedDB (runs once on mount)
  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const session = getSessionFiles();
    if (session.length > 0) {
      handleFilesSelected(session);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0) {
          handleFilesSelected(restored);
        }
      });
    }
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.processedUrl) URL.revokeObjectURL(target.processedUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAllFiles = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.processedUrl) URL.revokeObjectURL(f.processedUrl);
    });
    setFiles([]);
    setProgress(0);
  };

  const processSingle = async (item: ProcessedFile): Promise<ProcessedFile> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (maxWidth > 0 && width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({ ...item, status: 'error', errorMessage: 'Canvas failed' });
          return;
        }

        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...item, status: 'error', errorMessage: 'Encoding failed' });
              return;
            }

            const url = URL.createObjectURL(blob);
            resolve({
              ...item,
              status: 'done',
              processedBlob: blob,
              processedUrl: url,
              processedSize: blob.size,
              processedWidth: width,
              processedHeight: height,
            });
          },
          targetFormat,
          quality / 100
        );
      };

      img.onerror = () => {
        resolve({ ...item, status: 'error', errorMessage: 'Decoding failed' });
      };

      img.src = item.previewUrl;
    });
  };

  const runBulkPipeline = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);

    const updated: ProcessedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const currentItem = files[i];
      setFiles((curr) => curr.map((f) => (f.id === currentItem.id ? { ...f, status: 'processing' } : f)));

      const res = await processSingle(currentItem);
      updated.push(res);

      setFiles((curr) => curr.map((f) => (f.id === currentItem.id ? res : f)));
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setIsProcessing(false);
    toast.success(`Completed bulk processing of ${files.length} images!`);
  };

  const downloadAllZip = async () => {
    const ready = files.filter((f) => f.status === 'done' && f.processedBlob);
    if (ready.length === 0) {
      toast.error('No processed files ready.');
      return;
    }

    toast.info('Archiving into ZIP...');
    const zip = new JSZip();
    const ext = formatExtensions[targetFormat];

    ready.forEach((item, idx) => {
      const base = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || `img_${idx + 1}`;
      zip.file(`${base}.${ext}`, item.processedBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `imaginex_batch_${ext}.zip`);
    toast.success('ZIP download started!');
  };

  const completedCount = files.filter((f) => f.status === 'done').length;

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        files.length > 0
          ? {
              label: completedCount > 0 ? 'Download ZIP Package' : 'Run Bulk Studio Pipeline',
              onClick: completedCount > 0 ? downloadAllZip : runBulkPipeline,
              loading: isProcessing,
              icon: completedCount > 0 ? <FileArchive className="w-4 h-4" /> : <Layers className="w-4 h-4" />,
            }
          : undefined
      }
      actionSecondary={
        files.length > 0
          ? {
              label: 'Clear Queue',
              onClick: clearAllFiles,
              icon: <Trash2 className="w-4 h-4" />,
            }
          : undefined
      }
      controls={
        <div className="space-y-6">
          {/* Target Format */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Target Output Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'image/webp', label: 'WEBP' },
                { id: 'image/png', label: 'PNG' },
                { id: 'image/jpeg', label: 'JPG' },
                { id: 'image/avif', label: 'AVIF' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setTargetFormat(fmt.id as TargetFormat)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium font-mono transition-colors text-center ${
                    targetFormat === fmt.id
                      ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-bold'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Quality Tuning
              </label>
              <span className="text-xs font-mono font-bold text-[var(--brand)]">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Max Width */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Max Width Limit
              </label>
              <span className="text-xs font-mono font-bold text-[var(--accent)]">
                {maxWidth}px
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="3840"
              step="160"
              value={maxWidth}
              onChange={(e) => setMaxWidth(parseInt(e.target.value))}
              className="w-full accent-[var(--accent)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2 pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Queue Progress</span>
                <span className="text-[var(--text-primary)] font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-[var(--bg-tertiary)] h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--accent-pink)] h-full transition-all duration-300"
                />
              </div>
            </div>
          )}
        </div>
      }
      features={[
        {
          title: 'Simultaneous Batch Pipelines',
          description: 'Combines multi-format conversion, resolution constraints, and lossy/lossless compression into a single automated queue.',
        },
        {
          title: 'Instant Multi-File ZIP Bundling',
          description: 'Zips all finished files directly in browser memory without sending a single byte to external cloud servers.',
        },
      ]}
      faqItems={[
        {
          question: 'Is there a limit on how many images I can process?',
          answer: 'Because processing executes in local RAM, you can easily convert 50+ images at once depending on your computer memory.',
        },
      ]}
    >
      {files.length === 0 ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={true}
          title="Drop multiple images for bulk processing"
          subtitle="Convert, resize, compress, and download as one ZIP"
          badge="High-Capacity In-Memory Queue"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Queued Files ({files.length})
            </span>
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files) handleFilesSelected(Array.from(target.files));
                };
                input.click();
              }}
              className="text-xs text-[var(--brand)] hover:underline font-semibold"
            >
              + Add More Images
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {files.map((item) => {
              const savings = item.processedSize
                ? calculateSavings(item.originalSize, item.processedSize)
                : 0;

              return (
                <div
                  key={item.id}
                  className="p-3 sm:p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-between gap-3 sm:gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.processedUrl || item.previewUrl}
                      alt={item.file.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-lg border border-[var(--border)] shrink-0 bg-black/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[160px] sm:max-w-xs">
                        {item.file.name}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
                        <span>{formatBytes(item.originalSize)}</span>
                        {item.processedSize && (
                          <>
                            <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                            <span className="text-[var(--brand)] font-semibold">
                              {formatBytes(item.processedSize)}
                            </span>
                            {savings > 0 && (
                              <span className="text-[var(--success)] font-semibold">
                                (-{savings}%)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'processing' && (
                      <span className="text-xs font-mono text-[var(--brand)] flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Working...</span>
                      </span>
                    )}

                    {item.status === 'done' && (
                      <span className="text-xs text-[var(--success)] flex items-center gap-1 font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                    )}

                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
