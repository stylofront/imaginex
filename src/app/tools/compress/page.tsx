'use client';

import React, { useState, useRef } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { ProcessedFile } from '@/types';
import { formatBytes, calculateSavings } from '@/lib/utils';
import { Download, Minimize2, Trash2, AlertCircle, FileArchive, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import imageCompression from 'browser-image-compression';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'compress')!;

export default function CompressToolPage() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [maxSizeMB, setMaxSizeMB] = useState<number>(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number>(1920);
  const [useWebWorker, setUseWebWorker] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const initializedRef = useRef<boolean>(false);

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

      toast.success(`Loaded ${uniqueNewFiles.length} image(s) for compression`);
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
  };

  const compressSingleFile = async (item: ProcessedFile): Promise<ProcessedFile> => {
    const options = {
      maxSizeMB: Math.max(0.05, maxSizeMB),
      maxWidthOrHeight: maxWidthOrHeight > 0 ? maxWidthOrHeight : undefined,
      useWebWorker,
      fileType: item.file.type,
    };

    try {
      const compressedFile = await imageCompression(item.file, options);
      const processedUrl = URL.createObjectURL(compressedFile);

      return {
        ...item,
        status: 'done',
        processedBlob: compressedFile,
        processedUrl,
        processedSize: compressedFile.size,
      };
    } catch (error: any) {
      return {
        ...item,
        status: 'error',
        errorMessage: error.message || 'Compression failed',
      };
    }
  };

  const processAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      for (const item of files) {
        setFiles((current) =>
          current.map((f) => (f.id === item.id ? { ...f, status: 'processing' } : f))
        );

        const result = await compressSingleFile(item);

        setFiles((current) =>
          current.map((f) => (f.id === item.id ? result : f))
        );
      }

      toast.success('Compression completed for all queued images!');
    } catch {
      toast.error('Error during compression process.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (item: ProcessedFile) => {
    if (!item.processedBlob) return;
    saveAs(item.processedBlob, `compressed_${item.file.name}`);
  };

  const downloadAllZip = async () => {
    const ready = files.filter((f) => f.status === 'done' && f.processedBlob);
    if (ready.length === 0) {
      toast.error('No compressed files to download.');
      return;
    }

    const zip = new JSZip();
    ready.forEach((item) => {
      zip.file(`compressed_${item.file.name}`, item.processedBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'imaginex_compressed_images.zip');
    toast.success('ZIP download started!');
  };

  const completedCount = files.filter((f) => f.status === 'done').length;

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        files.length > 0
          ? {
              label: completedCount > 0 ? 'Re-Compress All' : 'Compress All Images',
              onClick: processAll,
              loading: isProcessing,
              disabled: files.length === 0 || isProcessing,
              icon: <Minimize2 className="w-4 h-4" />,
            }
          : undefined
      }
      actionSecondary={
        files.length > 0
          ? {
              label: 'Clear All',
              onClick: clearAllFiles,
              icon: <Trash2 className="w-4 h-4" />,
            }
          : undefined
      }
      controls={
        <div className="space-y-6">
          {/* Max Size Target Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Target Max File Size
              </label>
              <span className="text-xs font-mono font-bold text-[var(--brand)]">
                {maxSizeMB >= 1 ? `${maxSizeMB} MB` : `${Math.round(maxSizeMB * 1024)} KB`}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
              className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-mono">
              <span>100 KB</span>
              <span>1 MB</span>
              <span>5 MB</span>
            </div>
          </div>

          {/* Max Dimension */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Max Dimension (px)
              </label>
              <span className="text-xs font-mono font-bold text-[var(--accent)]">
                {maxWidthOrHeight} px
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="3840"
              step="160"
              value={maxWidthOrHeight}
              onChange={(e) => setMaxWidthOrHeight(parseInt(e.target.value))}
              className="w-full accent-[var(--accent)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-mono">
              <span>HD (1080)</span>
              <span>FHD (1920)</span>
              <span>4K (3840)</span>
            </div>
          </div>

          {/* Web Worker Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <div>
              <span className="text-xs font-semibold text-[var(--text-primary)] block">
                Multi-Threaded Worker
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                Runs compression off the main UI thread
              </span>
            </div>
            <input
              type="checkbox"
              checked={useWebWorker}
              onChange={(e) => setUseWebWorker(e.target.checked)}
              className="w-4 h-4 accent-[var(--brand)] rounded cursor-pointer"
            />
          </div>

          {/* Batch ZIP CTA */}
          {completedCount > 1 && (
            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={downloadAllZip}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[var(--success)] to-[var(--accent-cyan)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-[var(--success)]/20"
              >
                <FileArchive className="w-4 h-4" />
                <span>Download All as ZIP ({completedCount} files)</span>
              </button>
            </div>
          )}
        </div>
      }
      features={[
        {
          title: 'Smart Lossy & Lossless Algorithms',
          description: 'Automatically analyzes color distribution and edge frequency to discard imperceptible data while preserving sharp outlines.',
        },
        {
          title: 'True Web Worker Concurrency',
          description: 'Calculations occur in background threads, so your browser stays responsive even when crunching 50+ images simultaneously.',
        },
        {
          title: 'Precise Target Constraint',
          description: 'Specify an upper byte ceiling (e.g. 200KB or 1MB) and the engine dynamically iterates until the payload falls under the threshold.',
        },
      ]}
      faqItems={[
        {
          question: 'How much file size reduction can I expect?',
          answer: 'Typically between 60% and 85% for standard photos, often with zero noticeable degradation to the naked eye.',
        },
        {
          question: 'Are my images uploaded to any server for compression?',
          answer: 'Never. Imaginex compresses everything in your browser via local JavaScript and Web Workers.',
        },
      ]}
    >
      {files.length === 0 ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          title="Drop images to compress"
          subtitle="Target custom KB/MB sizes and dimensions"
          badge="Up to 90% size reduction"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Queued for Compression ({files.length})
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
                  className="p-3 sm:p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-between gap-3 sm:gap-4 hover:border-[var(--brand)]/40 transition-colors shadow-xs"
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
                        <Minimize2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Compressing...</span>
                      </span>
                    )}

                    {item.status === 'error' && (
                      <span className="text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Failed</span>
                      </span>
                    )}

                    {item.status === 'done' && (
                      <button
                        onClick={() => downloadSingle(item)}
                        className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[var(--success)]/10 hover:bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/20 text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
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
