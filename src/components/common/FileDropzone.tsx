'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud, Sparkles, FileWarning, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

const DEFAULT_ACCEPT: Accept = {
  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.bmp', '.tiff', '.heic'],
};

export function FileDropzone({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  multiple = true,
  maxFiles = 50,
  maxSizeMB = 50,
  className,
  title = 'Drop your images here',
  subtitle = 'or browse files from your computer',
  badge = '100% In-Browser • Zero Cloud Uploads',
}: FileDropzoneProps) {
  const [isPasting, setIsPasting] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected]
  );

  // Clipboard paste support (Ctrl+V anywhere on page when dropzone is mounted)
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
        onFilesSelected(imageFiles);
        setTimeout(() => setIsPasting(false), 1200);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative group cursor-pointer rounded-xl border-2 border-dashed p-6 sm:p-10 transition-all duration-200 text-center select-none overflow-hidden',
        isDragActive && !isDragReject && 'border-[var(--brand)] bg-[var(--brand)]/8 shadow-md shadow-[var(--brand)]/10',
        isDragReject && 'border-rose-500 bg-rose-500/8',
        !isDragActive && 'border-[var(--border)] hover:border-[var(--brand)]/60 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]/70 shadow-xs hover:shadow-sm',
        isPasting && 'ring-2 ring-[var(--success)] bg-[var(--success)]/10',
        className
      )}
    >
      <input {...getInputProps()} />

      <div className="relative flex flex-col items-center justify-center space-y-3.5">
        {/* Animated Icon Container */}
        <div
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-200',
            isDragActive
              ? 'bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/25 scale-105'
              : 'bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--brand)] group-hover:scale-105 group-hover:border-[var(--brand)]/40 group-hover:text-[var(--accent)]'
          )}
        >
          {isDragReject ? (
            <FileWarning className="w-6 h-6 text-rose-500 animate-bounce" />
          ) : isPasting ? (
            <CheckCircle2 className="w-6 h-6 text-[var(--success)] animate-pulse" />
          ) : isDragActive ? (
            <Sparkles className="w-6 h-6 text-white" />
          ) : (
            <UploadCloud className="w-6 h-6 transition-transform duration-200 group-hover:-translate-y-0.5" />
          )}
        </div>

        {/* Text descriptions */}
        <div className="space-y-1 max-w-md px-2">
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
            {isDragReject
              ? 'Unsupported file format or too large'
              : isDragActive
              ? 'Release to load your images'
              : isPasting
              ? 'Pasted image from clipboard!'
              : title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {subtitle}
          </p>
        </div>

        {/* Badges & Format pills */}
        <div className="pt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)] font-mono text-[11px]">
            WEBP, PNG, JPG, AVIF, HEIC, GIF, BMP
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] font-medium text-[11px]">
            Ctrl + V to Paste
          </span>
          {badge && (
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-md bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] font-medium text-[11px]">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
