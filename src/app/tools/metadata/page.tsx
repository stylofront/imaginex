'use client';

import React, { useState } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { formatBytes } from '@/lib/utils';
import { FileSearch, ShieldCheck, MapPin, Camera, Calendar, Sliders, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import exifr from 'exifr';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'metadata')!;

interface ExifData {
  make?: string;
  model?: string;
  lensModel?: string;
  fNumber?: number;
  exposureTime?: number;
  iso?: number;
  focalLength?: number;
  createDate?: string;
  latitude?: number;
  longitude?: number;
  software?: string;
  allRaw?: Record<string, any>;
}

export default function MetadataToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setIsLoading(true);

    try {
      const data = await exifr.parse(selected, {
        tiff: true,
        xmp: true,
        icc: true,
        iptc: true,
        jfif: true,
        gps: true,
      });

      if (!data) {
        setExif({ allRaw: {} });
        toast.info('No EXIF metadata was found in this file.');
      } else {
        setExif({
          make: data.Make,
          model: data.Model,
          lensModel: data.LensModel || data.LensInfo,
          fNumber: data.FNumber,
          exposureTime: data.ExposureTime,
          iso: data.ISO,
          focalLength: data.FocalLength,
          createDate: data.CreateDate || data.DateTimeOriginal ? new Date(data.CreateDate || data.DateTimeOriginal).toLocaleString() : undefined,
          latitude: data.latitude,
          longitude: data.longitude,
          software: data.Software,
          allRaw: data,
        });
        toast.success('EXIF metadata parsed successfully!');
      }
    } catch {
      toast.error('Could not extract metadata.');
      setExif(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-populate from global session or IndexedDB
  React.useEffect(() => {
    const session = getSessionFiles();
    if (session.length > 0 && !file) {
      handleFileSelected(session);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0 && !file) {
          handleFileSelected(restored);
        }
      });
    }
  }, []);

  const scrubMetadata = async () => {
    if (!file || !previewUrl) return;
    setIsScrubbing(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context failed');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((cleanBlob) => {
        if (!cleanBlob) throw new Error('Scrubbing failed');
        const originalBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        saveAs(cleanBlob, `${originalBase}_sanitized_clean.jpg`);
        toast.success('Sanitized image downloaded! All GPS and camera data stripped.');
        setIsScrubbing(false);
      }, 'image/jpeg', 0.95);
    } catch {
      toast.error('Failed to sanitize image.');
      setIsScrubbing(false);
    }
  };

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setExif(null);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        file
          ? {
              label: 'Scrub & Download Clean Image',
              onClick: scrubMetadata,
              loading: isScrubbing,
              icon: <ShieldCheck className="w-4 h-4" />,
            }
          : undefined
      }
      actionSecondary={
        file
          ? {
              label: 'Reset',
              onClick: clearSelection,
              icon: <Trash2 className="w-4 h-4" />,
            }
          : undefined
      }
      controls={
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Privacy Stripper Available</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
              Photos taken on smartphones contain precise GPS coordinates and device serial numbers. Click &quot;Scrub&quot; to download a 100% sanitized copy.
            </p>
          </div>

          {exif?.latitude && exif?.longitude && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>GPS Location Detected!</span>
              </div>
              <p className="text-[11px] leading-relaxed font-mono">
                {exif.latitude.toFixed(5)}, {exif.longitude.toFixed(5)}
              </p>
              <a
                href={`https://www.google.com/maps?q=${exif.latitude},${exif.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs text-[var(--brand)] underline pt-1 font-semibold"
              >
                View on Google Maps ↗
              </a>
            </div>
          )}
        </div>
      }
      features={[
        {
          title: 'Deep EXIF, XMP & IPTC Parsing',
          description: 'Reads camera sensors, shutter speeds, aperture, ISO, lens profiles, and GPS coordinates using exifr.',
        },
        {
          title: 'Zero Server Leaks',
          description: 'Your photo is decoded entirely inside browser memory. Your private locations never touch an external server.',
        },
        {
          title: '1-Click Metadata Scrubbing',
          description: 'Generate clean, privacy-hardened versions suitable for posting to social media or public forums without location traces.',
        },
      ]}
      faqItems={[
        {
          question: 'What information is stored inside image metadata?',
          answer: 'Smartphones and DSLR cameras attach metadata tags including GPS coordinates, camera model, date/time, and lens settings.',
        },
        {
          question: 'Does scrubbing alter the image quality?',
          answer: 'The image pixels are preserved at full resolution while the hidden EXIF header bytes are completely removed.',
        },
      ]}
    >
      {!file ? (
        <FileDropzone
          onFilesSelected={handleFileSelected}
          multiple={false}
          title="Drop image to inspect EXIF & GPS"
          subtitle="Discover camera settings, location data, or strip it clean"
          badge="exifr Fast Parser"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{file.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                {formatBytes(file.size)} • {file.type || 'image/jpeg'}
              </p>
            </div>
            <button
              onClick={clearSelection}
              className="text-xs text-rose-500 hover:underline"
            >
              Choose different image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border)] p-2 flex items-center justify-center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="max-h-[360px] object-contain rounded-lg"
                />
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Extracted Tag Values
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span>Camera / Device</span>
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] font-mono">
                    {exif?.make || exif?.model ? `${exif?.make || ''} ${exif?.model || ''}` : 'Not available'}
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Aperture & Shutter</span>
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] font-mono">
                    {exif?.fNumber ? `f/${exif.fNumber}` : ''}{' '}
                    {exif?.exposureTime ? `1/${Math.round(1 / exif.exposureTime)}s` : ''}
                    {!exif?.fNumber && !exif?.exposureTime ? 'Not available' : ''}
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                    <span>ISO Sensitivity</span>
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] font-mono">
                    {exif?.iso ? `ISO ${exif.iso}` : 'Not available'}
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span>Capture Timestamp</span>
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] font-mono text-[11px]">
                    {exif?.createDate || 'Not available'}
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>GPS Coordinates</span>
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] font-mono">
                    {exif?.latitude && exif?.longitude
                      ? `${exif.latitude.toFixed(4)}, ${exif.longitude.toFixed(4)}`
                      : 'None (Clean)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
