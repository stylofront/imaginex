'use client';

import React, { useState, useRef } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { ProcessedFile } from '@/types';
import { formatBytes, calculateSavings } from '@/lib/utils';
import { Download, RefreshCw, Trash2, AlertCircle, FileArchive, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'convert')!;

type SupportedFormat = 'image/webp' | 'image/png' | 'image/jpeg' | 'image/avif';

interface FormatOption {
  label: string;
  mime: SupportedFormat;
  ext: string;
  supportsQuality: boolean;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { label: 'WEBP (High Efficiency)', mime: 'image/webp', ext: 'webp', supportsQuality: true },
  { label: 'PNG (Lossless Transparency)', mime: 'image/png', ext: 'png', supportsQuality: false },
  { label: 'JPEG (Universal)', mime: 'image/jpeg', ext: 'jpg', supportsQuality: true },
  { label: 'AVIF (Next-Gen Ultra Compression)', mime: 'image/avif', ext: 'avif', supportsQuality: true },
];

export default function ConvertToolPage() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>('image/webp');
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const initializedRef = useRef<boolean>(false);

  const selectedFormatOption = FORMAT_OPTIONS.find((f) => f.mime === targetFormat) || FORMAT_OPTIONS[0];

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setSessionFiles(newFiles);

    setFiles((prev) => {
      // Deduplicate: avoid adding images that are already in the list with same name & size
      const existingKeys = new Set(prev.map((item) => `${item.file.name}_${item.file.size}`));
      const uniqueNewFiles = newFiles.filter(
        (f) => !existingKeys.has(`${f.name}_${f.size}`)
      );

      if (uniqueNewFiles.length === 0) return prev;

      const processedItems: ProcessedFile[] = uniqueNewFiles.map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        previewUrl: URL.createObjectURL(f),
        originalSize: f.size,
        status: 'idle',
      }));

      toast.success(`Loaded ${uniqueNewFiles.length} image(s) to convert`);
      return [...prev, ...processedItems];
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

  const convertFile = (item: ProcessedFile): Promise<ProcessedFile> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            ...item,
            status: 'error',
            errorMessage: 'Canvas 2D context unavailable',
          });
          return;
        }

        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        const qualityParam = selectedFormatOption.supportsQuality ? quality / 100 : undefined;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                ...item,
                status: 'error',
                errorMessage: `Format ${selectedFormatOption.label} not supported by your browser canvas engine.`,
              });
              return;
            }

            const processedUrl = URL.createObjectURL(blob);
            resolve({
              ...item,
              status: 'done',
              processedBlob: blob,
              processedUrl,
              processedSize: blob.size,
              processedWidth: canvas.width,
              processedHeight: canvas.height,
            });
          },
          targetFormat,
          qualityParam
        );
      };

      img.onerror = () => {
        resolve({
          ...item,
          status: 'error',
          errorMessage: 'Failed to decode image data',
        });
      };

      img.src = item.previewUrl;
    });
  };

  const processAllFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const updatedFiles: ProcessedFile[] = [];

      for (const item of files) {
        setFiles((current) =>
          current.map((f) => (f.id === item.id ? { ...f, status: 'processing' } : f))
        );

        const result = await convertFile(item);
        updatedFiles.push(result);

        setFiles((current) =>
          current.map((f) => (f.id === item.id ? result : f))
        );
      }

      toast.success(`Converted ${updatedFiles.length} file(s) successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Error occurred while converting images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (item: ProcessedFile) => {
    if (!item.processedBlob) return;
    const originalBaseName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
    const filename = `${originalBaseName}.${selectedFormatOption.ext}`;
    saveAs(item.processedBlob, filename);
  };

  const downloadAllAsZip = async () => {
    const doneFiles = files.filter((f) => f.status === 'done' && f.processedBlob);
    if (doneFiles.length === 0) {
      toast.error('No converted files ready to download.');
      return;
    }

    toast.info('Bundling images into ZIP...');
    const zip = new JSZip();

    doneFiles.forEach((item, index) => {
      const originalBaseName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || `image_${index + 1}`;
      const filename = `${originalBaseName}.${selectedFormatOption.ext}`;
      zip.file(filename, item.processedBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `imaginex_converted_${selectedFormatOption.ext}.zip`);
    toast.success('ZIP download started!');
  };

  const completedCount = files.filter((f) => f.status === 'done').length;

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        files.length > 0
          ? {
              label: completedCount > 0 ? 'Convert Again' : 'Convert All Images',
              onClick: processAllFiles,
              loading: isProcessing,
              disabled: files.length === 0 || isProcessing,
              icon: <RefreshCw className="w-4 h-4" />,
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
          {/* Target Format Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-mono">
              Target Output Format
            </label>
            <div className="space-y-2">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.mime}
                  onClick={() => setTargetFormat(opt.mime)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    targetFormat === opt.mime
                      ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] shadow-sm'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="font-semibold">{opt.label}</span>
                  <span className="font-mono text-[10px] uppercase text-[var(--brand)] font-bold">
                    .{opt.ext}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider */}
          {selectedFormatOption.supportsQuality && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                  Quality Compression
                </label>
                <span className="text-xs font-mono font-bold text-[var(--brand)]">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                <span>Smaller size (10%)</span>
                <span>Balanced (85%)</span>
                <span>Crisp (100%)</span>
              </div>
            </div>
          )}

          {/* Batch ZIP CTA */}
          {completedCount > 1 && (
            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={downloadAllAsZip}
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
          title: 'Direct Browser Encoding',
          description: 'Leverages HTML5 canvas.toBlob() hardware acceleration with zero server latency or data leakage.',
        },
        {
          title: 'Transparent PNG Preserved',
          description: 'Transparency alpha channels are preserved when targeting WEBP, PNG, and AVIF.',
        },
        {
          title: 'One-Click ZIP Packaging',
          description: 'Convert dozens of files and package them into an organized ZIP archive with matching file extensions.',
        },
      ]}
      faqItems={[
        {
          question: 'Are my files uploaded anywhere?',
          answer: 'No. Imaginex operates 100% in-browser. Your photos never leave your machine.',
        },
        {
          question: 'What is the best format for modern websites?',
          answer: 'WEBP offers great compression with universal browser support. AVIF provides even higher compression ratios for modern browsers.',
        },
        {
          question: 'Does this tool support batch conversions?',
          answer: 'Yes! Drop as many files as you like, convert them all in one click, and download them individually or as a single ZIP archive.',
        },
      ]}
    >
      {/* Workspace Area */}
      {files.length === 0 ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          title="Drop images to convert"
          subtitle="Supports WEBP, PNG, JPG, AVIF, BMP, GIF, and HEIC"
          badge="In-Memory Canvas Conversion"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Files in Queue ({files.length})
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

          {/* Files List */}
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
                  {/* Thumbnail & File name */}
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

                  {/* Actions / Status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'processing' && (
                      <span className="text-xs font-mono text-[var(--brand)] flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Converting...</span>
                      </span>
                    )}

                    {item.status === 'error' && (
                      <span className="text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Error</span>
                      </span>
                    )}

                    {item.status === 'done' && (
                      <button
                        onClick={() => downloadSingle(item)}
                        className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[var(--success)]/10 hover:bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/20 text-xs font-medium transition-colors flex items-center gap-1.5"
                        title="Download converted file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface)] transition-colors"
                      title="Remove file"
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
