'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'watermark')!;

type Position = 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'tile';

export default function WatermarkToolPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('photo.png');
  const [watermarkText, setWatermarkText] = useState<string>('© Imaginex Studio');
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(50);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [position, setPosition] = useState<Position>('bottom-right');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const file = files[0];
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    toast.success('Image loaded for watermarking');
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

      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = 'middle';

      if (position === 'tile') {
        ctx.rotate((-25 * Math.PI) / 180);
        const stepX = fontSize * 10;
        const stepY = fontSize * 4;

        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
            ctx.fillText(watermarkText, x, y);
          }
        }
      } else {
        const padding = 40;
        const textMetrics = ctx.measureText(watermarkText);
        let x = padding;
        let y = padding + fontSize / 2;

        if (position === 'center') {
          x = (canvas.width - textMetrics.width) / 2;
          y = canvas.height / 2;
        } else if (position === 'bottom-right') {
          x = canvas.width - textMetrics.width - padding;
          y = canvas.height - padding;
        } else if (position === 'bottom-left') {
          x = padding;
          y = canvas.height - padding;
        } else if (position === 'top-right') {
          x = canvas.width - textMetrics.width - padding;
          y = padding + fontSize / 2;
        }

        ctx.fillText(watermarkText, x, y);
      }

      ctx.restore();
    };
  }, [imageSrc, watermarkText, fontSize, opacity, textColor, position]);

  const downloadWatermarked = () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const base = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        saveAs(blob, `${base}_watermarked.png`);
        toast.success('Watermarked image downloaded!');
      }
      setIsProcessing(false);
    }, 'image/png');
  };

  const resetAll = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionPrimary={
        imageSrc
          ? {
              label: 'Download Watermarked Image',
              onClick: downloadWatermarked,
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
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] font-medium"
              placeholder="e.g. © 2026 Your Name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-2 font-mono">
              Positioning
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bottom-right', label: 'Bottom Right' },
                { id: 'bottom-left', label: 'Bottom Left' },
                { id: 'center', label: 'Center' },
                { id: 'top-right', label: 'Top Right' },
                { id: 'top-left', label: 'Top Left' },
                { id: 'tile', label: 'Repeated Tile' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPosition(p.id as Position)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors text-left ${
                    position === p.id
                      ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Font Size
              </label>
              <span className="text-xs font-mono font-bold text-[var(--brand)]">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="120"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-[var(--brand)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                Opacity
              </label>
              <span className="text-xs font-mono font-bold text-[var(--accent)]">
                {opacity}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              className="w-full accent-[var(--accent)] bg-[var(--bg-tertiary)] h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      }
      features={[
        {
          title: 'Anti-Theft Tiled Patterns',
          description: 'Repeats diagonal translucent watermarks across the complete frame to deter unauthorized usage on portfolio drafts.',
        },
        {
          title: 'Direct Pixel Blending',
          description: 'Renders vectors directly onto canvas pixels with sub-pixel text rendering for clean typography.',
        },
      ]}
      faqItems={[
        {
          question: 'Can the watermark be removed by others?',
          answer: 'The watermark is permanently blended directly into the pixel raster of the image when saved, making it impossible to strip via metadata.',
        },
      ]}
    >
      {!imageSrc ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          title="Drop image to add watermark"
          subtitle="Protect copyright with text stamps or repeated tile patterns"
          badge="In-Memory Canvas Watermarking"
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
              className="max-h-[420px] max-w-full object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
