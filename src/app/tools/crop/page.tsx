'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { FlipHorizontal, FlipVertical, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'crop')!;

interface AspectRatioOption {
  label: string;
  value: number | undefined;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: 'Freeform', value: undefined },
  { label: '1:1 Square', value: 1 / 1 },
  { label: '16:9 Landscape', value: 16 / 9 },
  { label: '9:16 Vertical / Reel', value: 9 / 16 },
  { label: '4:3 Standard', value: 4 / 3 },
  { label: '3:2 Photo', value: 3 / 2 },
];

export default function CropToolPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image.png');
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const file = files[0];
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    toast.success('Image loaded for cropping');
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

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<Blob> => {
    if (!imageSrc || !croppedAreaPixels) throw new Error('No crop area defined');

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unavailable');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Cropping canvas toBlob failed'));
      }, 'image/png');
    });
  };

  const downloadCropped = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const blob = await createCroppedImage();
      const base = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      saveAs(blob, `${base}_cropped.png`);
      toast.success('Cropped image saved successfully!');
    } catch {
      toast.error('Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(undefined);
    setFlipH(false);
    setFlipV(false);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        imageSrc
          ? {
              label: 'Download Cropped Image',
              onClick: downloadCropped,
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
          {/* Aspect Ratios */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setAspect(item.value)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors text-left truncate ${
                    aspect === item.value
                      ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Zoom Scale
              </label>
              <span className="text-xs font-mono font-bold text-[var(--brand)]">
                {zoom.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Rotation Angle
              </label>
              <span className="text-xs font-mono font-bold text-[var(--accent)]">
                {rotation}°
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full accent-[var(--accent)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-mono">
              <span>-180°</span>
              <button
                onClick={() => setRotation(0)}
                className="text-[var(--brand)] hover:underline font-semibold"
              >
                Reset (0°)
              </button>
              <span>+180°</span>
            </div>
          </div>

          {/* Flip Controls */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Orientations
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  flipH
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip Horiz</span>
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  flipV
                    ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" />
                <span>Flip Vert</span>
              </button>
            </div>
          </div>
        </div>
      }
      features={[
        {
          title: 'High-DPI Lossless Extraction',
          description: 'Calculates the exact sub-pixel coordinate box from the original source bitmap, avoiding blurred resampling.',
        },
        {
          title: 'Arbitrary Rotation & Tilt Correction',
          description: 'Fix slanted horizons or level photos with fine -180° to +180° rotational precision.',
        },
      ]}
      faqItems={[
        {
          question: 'Does cropping reduce the resolution of the image?',
          answer: 'The uncropped areas outside the selection box are discarded, but the cropped region preserves 100% of its native source pixel resolution.',
        },
      ]}
    >
      {!imageSrc ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          title="Drop image to crop"
          subtitle="Interactive aspect ratios, zoom, rotation, and flips"
          badge="Interactive Canvas Cropper"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-mono">
              Target Crop: {croppedAreaPixels?.width || 0} × {croppedAreaPixels?.height || 0}px
            </span>
            <button
              onClick={resetAll}
              className="text-xs text-rose-500 hover:underline"
            >
              Choose different image
            </button>
          </div>

          <div className="relative h-[480px] w-full rounded-xl overflow-hidden bg-black/85 border border-[var(--border)] shadow-inner">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: 'h-full w-full',
              }}
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
