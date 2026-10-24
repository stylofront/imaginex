# Library Reference — PixelForge

> Detailed API reference, installation commands, and usage patterns for every client-side library used in the project.

---

## Table of Contents

1. [jSquash (Format Conversion)](#1-jsquash-format-conversion)
2. [browser-image-compression](#2-browser-image-compression)
3. [@imgly/background-removal](#3-imglybackground-removal)
4. [Pica (High-Quality Resize)](#4-pica-high-quality-resize)
5. [react-easy-crop](#5-react-easy-crop)
6. [react-compare-slider](#6-react-compare-slider)
7. [exifr (Metadata Reader)](#7-exifr-metadata-reader)
8. [react-dropzone](#8-react-dropzone)
9. [colorthief](#9-colorthief)
10. [Canvas API Patterns](#10-canvas-api-patterns)
11. [Utility Libraries](#11-utility-libraries)

---

## 1. jSquash (Format Conversion)

### Install
```bash
npm install @jsquash/jpeg @jsquash/png @jsquash/webp @jsquash/avif @jsquash/oxipng @jsquash/resize
```

### Core Pattern: Decode → Process → Encode
```typescript
import { decode as decodeJpeg } from '@jsquash/jpeg';
import { decode as decodePng } from '@jsquash/png';
import { decode as decodeWebp } from '@jsquash/webp';
import { encode as encodeJpeg } from '@jsquash/jpeg';
import { encode as encodePng } from '@jsquash/png';
import { encode as encodeWebp } from '@jsquash/webp';
import { encode as encodeAvif } from '@jsquash/avif';
import { optimise as optimisePng } from '@jsquash/oxipng';

// Step 1: Read file as ArrayBuffer
const buffer = await file.arrayBuffer();

// Step 2: Decode to ImageData (universal intermediate format)
const imageData = await decodeJpeg(buffer); // or decodePng, decodeWebp

// Step 3: Encode to target format
const outputBuffer = await encodeWebp(imageData, { quality: 80 });

// Step 4: Create downloadable blob
const blob = new Blob([outputBuffer], { type: 'image/webp' });
const url = URL.createObjectURL(blob);
```

### Decoder Selection by MIME Type
```typescript
type DecoderFn = (buffer: ArrayBuffer) => Promise<ImageData>;

const decoders: Record<string, DecoderFn> = {
  'image/jpeg': decodeJpeg,
  'image/png': decodePng,
  'image/webp': decodeWebp,
  // AVIF decode also available via @jsquash/avif
};

function getDecoder(mimeType: string): DecoderFn {
  const decoder = decoders[mimeType];
  if (!decoder) throw new Error(`Unsupported input format: ${mimeType}`);
  return decoder;
}
```

### Encoder Options
```typescript
// JPEG (MozJPEG)
await encodeJpeg(imageData, { quality: 75 }); // 0-100

// WebP (libwebp)
await encodeWebp(imageData, { quality: 75 }); // 0-100

// AVIF (libavif)
await encodeAvif(imageData, { 
  quality: 50,      // 0-100 (lower = smaller file)
  speed: 6,         // 0-10 (higher = faster but slightly larger)
});

// PNG (lossless, no quality param)
await encodePng(imageData);

// OxiPNG (lossless PNG optimization)
await optimisePng(pngBuffer, { level: 3 }); // 1-6
```

### Web Worker Usage (Recommended)
```typescript
// convert.worker.ts
import { decode as decodeJpeg } from '@jsquash/jpeg';
import { encode as encodeWebp } from '@jsquash/webp';

self.onmessage = async (e: MessageEvent) => {
  const { buffer, targetFormat, quality } = e.data;
  try {
    const imageData = await decodeJpeg(buffer);
    const result = await encodeWebp(imageData, { quality });
    self.postMessage({ success: true, data: result });
  } catch (error) {
    self.postMessage({ success: false, error: (error as Error).message });
  }
};
```

### ⚠️ Important Notes
- WASM files must be properly handled by your bundler (Next.js + Webpack handles this)
- For AVIF: multi-threaded encoding needs `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers
- First use downloads WASM binaries; subsequent uses are cached

---

## 2. browser-image-compression

### Install
```bash
npm install browser-image-compression
```

### Basic Usage
```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,               // Target max file size in MB
  maxWidthOrHeight: 1920,      // Scale down if larger
  useWebWorker: true,          // Always use Web Worker
  initialQuality: 0.8,         // Starting quality (0-1)
  alwaysKeepResolution: false,  // If true, only reduce quality, don't resize
  fileType: 'image/webp',      // Optional: convert format during compression
  onProgress: (percent: number) => {
    console.log(`Progress: ${percent}%`);
  },
};

const compressedFile = await imageCompression(imageFile, options);
// compressedFile is a File/Blob object
```

### Size Comparison
```typescript
const originalSize = imageFile.size;
const compressedSize = compressedFile.size;
const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
console.log(`Reduced by ${savings}%`);
```

---

## 3. @imgly/background-removal

### Install
```bash
npm install @imgly/background-removal onnxruntime-web
```

### Basic Usage
```typescript
import removeBackground from '@imgly/background-removal';
import { preload } from '@imgly/background-removal';

// Preload on page mount (recommended)
useEffect(() => { preload(); }, []);

// Remove background
const config = {
  model: 'medium',            // 'small' | 'medium' | 'large'
  output: {
    format: 'image/png',      // Must be PNG for transparency
    quality: 0.8,
  },
  progress: (key: string, current: number, total: number) => {
    const percent = Math.round((current / total) * 100);
    setProgress(percent);
  },
};

const blob = await removeBackground(imageFile, config);
const url = URL.createObjectURL(blob);
```

### ⚠️ Critical Notes
- **First run downloads 40-100MB model** — show clear loading UI
- Use `preload()` eagerly to cache models
- Wrap in dynamic import with `ssr: false` for Next.js
- Heavy computation — always show progress to user

---

## 4. Pica (High-Quality Resize)

### Install
```bash
npm install pica
```

### Usage
```typescript
import Pica from 'pica';

const pica = new Pica();

// Create source canvas from image
const srcCanvas = document.createElement('canvas');
const srcCtx = srcCanvas.getContext('2d')!;
srcCanvas.width = img.naturalWidth;
srcCanvas.height = img.naturalHeight;
srcCtx.drawImage(img, 0, 0);

// Create destination canvas with target dimensions
const destCanvas = document.createElement('canvas');
destCanvas.width = targetWidth;
destCanvas.height = targetHeight;

// Resize with Lanczos3 filter
const result = await pica.resize(srcCanvas, destCanvas, {
  quality: 3,              // 0-3 (3 = best quality, Lanczos3)
  alpha: true,             // Preserve alpha channel
  unsharpAmount: 80,       // Post-resize sharpening (0-500)
  unsharpRadius: 0.6,      // Sharpening radius
  unsharpThreshold: 2,     // Sharpening threshold
});

// Export to blob
const blob = await pica.toBlob(result, 'image/png', 0.9);
```

---

## 5. react-easy-crop

### Install
```bash
npm install react-easy-crop
```

### Component Usage
```tsx
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [rotation, setRotation] = useState(0);
const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

<div style={{ position: 'relative', width: '100%', height: 400 }}>
  <Cropper
    image={imageSrc}
    crop={crop}
    zoom={zoom}
    rotation={rotation}
    aspect={4 / 3}              // Set to undefined for free-form
    onCropChange={setCrop}
    onZoomChange={setZoom}
    onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
  />
</div>
```

### Canvas Export Helper
```typescript
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const rotRad = (rotation * Math.PI) / 180;
  const bBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const bBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}
```

---

## 6. react-compare-slider

### Install
```bash
npm install react-compare-slider
```

### Usage (Must use dynamic import in Next.js)
```tsx
// components/BeforeAfterSlider.tsx
'use client';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export function BeforeAfterSlider({ 
  beforeSrc, afterSrc, beforeAlt, afterAlt 
}: Props) {
  return (
    <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={beforeSrc} alt={beforeAlt} />}
      itemTwo={<ReactCompareSliderImage src={afterSrc} alt={afterAlt} />}
      position={50}
      style={{ borderRadius: '12px', overflow: 'hidden' }}
    />
  );
}
```

### Dynamic import for Next.js SSR safety:
```tsx
import dynamic from 'next/dynamic';
const BeforeAfterSlider = dynamic(
  () => import('@/components/shared/BeforeAfterSlider'),
  { ssr: false }
);
```

---

## 7. exifr (Metadata Reader)

### Install
```bash
npm install exifr
```

### Usage
```typescript
import exifr from 'exifr';

// Full metadata parse
const metadata = await exifr.parse(file);

// Specific extractions
const gps = await exifr.gps(file);          // { latitude, longitude }
const orientation = await exifr.orientation(file);  // 1-8
const thumbnail = await exifr.thumbnail(file);      // ArrayBuffer of embedded thumbnail

// Selective parsing (performance optimization)
const selected = await exifr.parse(file, {
  pick: ['Make', 'Model', 'DateTimeOriginal', 'ISO', 'FocalLength'],
});

// Supported formats: JPEG, TIFF, PNG, HEIC, AVIF, WebP
```

---

## 8. react-dropzone

### Install
```bash
npm install react-dropzone
```

### Hook-based Usage
```tsx
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
  onDrop: (accepted, rejected) => { /* handle files */ },
  accept: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/avif': ['.avif'],
  },
  maxSize: 50 * 1024 * 1024,  // 50MB
  multiple: true,              // or false for single file tools
});
```

---

## 9. colorthief

### Install
```bash
npm install colorthief
```

### Usage
```typescript
import ColorThief from 'colorthief';

const colorThief = new ColorThief();
const img = document.querySelector('img');

// Get dominant color [R, G, B]
const dominant = colorThief.getColor(img);

// Get palette (array of [R, G, B])
const palette = colorThief.getPalette(img, 8); // 8 colors

// Note: image must be loaded and same-origin (or crossOrigin="anonymous")
```

---

## 10. Canvas API Patterns

### Applying CSS-style filters and exporting
```typescript
function applyFilters(
  image: HTMLImageElement,
  filters: { brightness: number; contrast: number; saturate: number; blur: number; grayscale: number; sepia: number; hueRotate: number; }
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.filter = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturate}%)
    blur(${filters.blur}px)
    grayscale(${filters.grayscale}%)
    sepia(${filters.sepia}%)
    hue-rotate(${filters.hueRotate}deg)
  `;

  ctx.drawImage(image, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}
```

### Text Watermark
```typescript
function addTextWatermark(
  image: HTMLImageElement,
  text: string,
  options: { fontSize: number; color: string; opacity: number; position: string; rotation?: number; }
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);

  ctx.globalAlpha = options.opacity;
  ctx.font = `bold ${options.fontSize}px Arial, sans-serif`;
  ctx.fillStyle = options.color;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;

  // Position logic based on options.position (center, bottom-right, etc.)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  ctx.globalAlpha = 1;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}
```

---

## 11. Utility Libraries

### file-saver
```bash
npm install file-saver @types/file-saver
```
```typescript
import { saveAs } from 'file-saver';
saveAs(blob, 'processed-image.png');
```

### jszip
```bash
npm install jszip
```
```typescript
import JSZip from 'jszip';

const zip = new JSZip();
processedFiles.forEach((file, i) => {
  zip.file(`image-${i + 1}.${ext}`, file);
});
const content = await zip.generateAsync({ type: 'blob' });
saveAs(content, 'pixelforge-batch.zip');
```

### clsx + tailwind-merge
```bash
npm install clsx tailwind-merge
```
```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### framer-motion
```bash
npm install framer-motion
```

### sonner (toast notifications)
```bash
npm install sonner
```
```tsx
import { toast } from 'sonner';
toast.success('Image converted successfully!');
toast.error('Failed to process image');
```

### lucide-react
```bash
npm install lucide-react
```
```tsx
import { Upload, Download, Image, Palette, Crop, Wand2 } from 'lucide-react';
```
