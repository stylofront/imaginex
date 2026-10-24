'use client';

import React, { useState } from 'react';
import { TOOLS } from '@/lib/tools-config';
import { ToolLayout } from '@/components/common/ToolLayout';
import { FileDropzone } from '@/components/common/FileDropzone';
import { Copy, Check, Code2, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
// @ts-ignore
import ColorThief from 'colorthief/dist/color-thief.mjs';
import { getSessionFiles, setSessionFiles, restoreSessionFiles } from '@/lib/file-session';

const toolInfo = TOOLS.find((t) => t.id === 'color-palette')!;

interface ColorItem {
  rgb: [number, number, number];
  hex: string;
  hsl: string;
  isDark: boolean;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function isColorDark(r: number, g: number, b: number): boolean {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export default function ColorPaletteToolPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dominantColor, setDominantColor] = useState<ColorItem | null>(null);
  const [palette, setPalette] = useState<ColorItem[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [paletteCount, setPaletteCount] = useState<number>(8);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setSessionFiles(files);
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const colorThief = new (ColorThief as any)();
        const dominant: [number, number, number] = colorThief.getColor(img);
        const rawPalette: [number, number, number][] = colorThief.getPalette(img, paletteCount);

        const dominantItem: ColorItem = {
          rgb: dominant,
          hex: rgbToHex(dominant[0], dominant[1], dominant[2]),
          hsl: rgbToHsl(dominant[0], dominant[1], dominant[2]),
          isDark: isColorDark(dominant[0], dominant[1], dominant[2]),
        };

        const paletteItems: ColorItem[] = rawPalette.map((c) => ({
          rgb: c,
          hex: rgbToHex(c[0], c[1], c[2]),
          hsl: rgbToHsl(c[0], c[1], c[2]),
          isDark: isColorDark(c[0], c[1], c[2]),
        }));

        setDominantColor(dominantItem);
        setPalette(paletteItems);
        toast.success(`Extracted dominant color and ${paletteItems.length} palette shades!`);
      } catch {
        toast.error('Failed to extract color palette.');
      }
    };
    img.src = url;
  };

  // Auto-populate from global session or IndexedDB
  React.useEffect(() => {
    const session = getSessionFiles();
    if (session.length > 0 && !previewUrl) {
      handleFilesSelected(session);
    } else {
      restoreSessionFiles().then((restored) => {
        if (restored && restored.length > 0 && !previewUrl) {
          handleFilesSelected(restored);
        }
      });
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    toast.success(`Copied ${label} (${text}) to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const copyCssVars = () => {
    if (palette.length === 0) return;
    const css = palette.map((c, i) => `  --palette-${i + 1}: ${c.hex};`).join('\n');
    const output = `:root {\n${css}\n}`;
    copyToClipboard(output, 'CSS Variables');
  };

  const copyTailwindConfig = () => {
    if (palette.length === 0) return;
    const colors = palette.map((c, i) => `      shade${i + 1}: '${c.hex}',`).join('\n');
    const output = `colors: {\n  palette: {\n${colors}\n  }\n}`;
    copyToClipboard(output, 'Tailwind Colors Config');
  };

  const copyJson = () => {
    if (palette.length === 0) return;
    const json = JSON.stringify(
      {
        dominant: dominantColor?.hex,
        palette: palette.map((p) => ({ hex: p.hex, rgb: `rgb(${p.rgb.join(', ')})`, hsl: p.hsl })),
      },
      null,
      2
    );
    copyToClipboard(json, 'JSON Palette');
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setDominantColor(null);
    setPalette([]);
  };

  return (
    <ToolLayout
      tool={toolInfo}
      actionSecondary={
        previewUrl
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
              Palette Swatches Count
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[6, 8, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => setPaletteCount(num)}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-colors ${
                    paletteCount === num
                      ? 'bg-[var(--brand)]/15 border-[var(--brand)] text-[var(--text-primary)] font-semibold'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {num} Colors
                </button>
              ))}
            </div>
          </div>

          {palette.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block font-mono">
                Code Generators
              </label>

              <button
                onClick={copyCssVars}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center justify-between"
              >
                <span>Export CSS Variables</span>
                <Code2 className="w-4 h-4 text-[var(--brand)]" />
              </button>

              <button
                onClick={copyTailwindConfig}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center justify-between"
              >
                <span>Export Tailwind Config</span>
                <Code2 className="w-4 h-4 text-[var(--accent)]" />
              </button>

              <button
                onClick={copyJson}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center justify-between"
              >
                <span>Export JSON Object</span>
                <Copy className="w-4 h-4 text-[var(--success)]" />
              </button>
            </div>
          )}
        </div>
      }
      features={[
        {
          title: 'Color Thief Quantization',
          description: 'Leverages modified Median Cut color quantization to group similar pixel clusters and extract the truest representative hues.',
        },
        {
          title: 'HEX, RGB, & HSL Formats',
          description: 'Every swatch provides one-click copy in multiple CSS and design-tool friendly color notations.',
        },
      ]}
      faqItems={[
        {
          question: 'How are dominant colors calculated?',
          answer: 'The image pixel array is sampled into a 3D color cube and clustered using the Median Cut algorithm to find the highest-frequency color centroids.',
        },
      ]}
    >
      {!previewUrl ? (
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          multiple={false}
          title="Drop image to extract color palette"
          subtitle="Generate harmonious palettes, HEX codes, and CSS variables"
          badge="Instant Color Thief Analysis"
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] shadow-xs">
            <img
              src={previewUrl}
              alt="Source"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-[var(--border)] shadow-md shrink-0"
            />

            {dominantColor && (
              <div className="space-y-2 text-left w-full">
                <span className="text-[11px] uppercase tracking-wider font-mono text-[var(--text-secondary)] block">
                  Dominant Key Color
                </span>
                <div className="flex items-center gap-4">
                  <div
                    style={{ backgroundColor: dominantColor.hex }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-black/10 dark:border-white/20 shadow-md shrink-0 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => copyToClipboard(dominantColor.hex, dominantColor.hex)}
                    title="Click to copy HEX"
                  />
                  <div>
                    <h4
                      onClick={() => copyToClipboard(dominantColor.hex, dominantColor.hex)}
                      className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)] cursor-pointer hover:text-[var(--brand)] flex items-center gap-2"
                    >
                      <span>{dominantColor.hex}</span>
                      <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                      rgb({dominantColor.rgb.join(', ')}) • {dominantColor.hsl}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Swatches Grid */}
          {palette.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--brand)]" />
                <span>Extracted Harmony Palette ({palette.length} Colors)</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {palette.map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyToClipboard(color.hex, `Swatch #${idx + 1}`)}
                    className="group cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--brand)]/50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 shadow-xs"
                  >
                    <div
                      style={{ backgroundColor: color.hex }}
                      className="h-20 sm:h-24 w-full relative flex items-center justify-center"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white">
                        {copiedHex === color.hex ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors">
                          {color.hex}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          #{idx + 1}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] block truncate">
                        rgb({color.rgb.join(', ')})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
