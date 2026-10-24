---
name: pixelforge-dev
description: Development skill for the PixelForge client-side image transformation platform. Provides architecture, library usage patterns, component guidelines, and development workflow for building tool pages with Next.js 15 + Tailwind v4.
---

# PixelForge Development Skill

## Project Overview
PixelForge is a fully **client-side** image processing platform built with **Next.js 15 (App Router)** + **Tailwind CSS v4** + **TypeScript**. All image processing runs in the browser using WebAssembly, Canvas API, and Web Workers. No server-side processing.

## Before You Start
1. **Read the project plan**: `docs/PROJECT_PLAN.md` — full architecture, design system, and routing
2. **Read the library reference**: `docs/LIBRARY_REFERENCE.md` — API docs for every library
3. **Read the SEO pages reference**: `docs/SEO_PAGES.md` — slug list, meta content, FAQ templates

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 with `@theme` directive in `globals.css`
- **Fonts**: Inter (sans) + JetBrains Mono (mono) via `next/font/google`
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`
- **Toasts**: `sonner`
- **Class Merging**: `clsx` + `tailwind-merge` → `cn()` helper

## Core Libraries (All Client-Side)
| Library | Purpose | Package |
|---|---|---|
| jSquash | Format conversion (WASM) | `@jsquash/jpeg`, `@jsquash/png`, `@jsquash/webp`, `@jsquash/avif`, `@jsquash/oxipng` |
| browser-image-compression | Image compression | `browser-image-compression` |
| @imgly/background-removal | AI background removal | `@imgly/background-removal` |
| Pica | High-quality resize | `pica` |
| react-easy-crop | Crop/rotate/zoom UI | `react-easy-crop` |
| react-compare-slider | Before/after slider | `react-compare-slider` |
| exifr | EXIF metadata reader | `exifr` |
| react-dropzone | File drag & drop | `react-dropzone` |
| colorthief | Dominant color extraction | `colorthief` |
| file-saver | Trigger downloads | `file-saver` |
| jszip | Batch ZIP downloads | `jszip` |

## Design System Rules

### Colors (CSS Variables → Tailwind Utilities)
- Background: `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary`, `bg-bg-elevated`, `bg-bg-surface`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
- Brand: `bg-brand` (violet #7c3aed), `bg-accent` (cyan #06b6d4)
- Semantic: `text-success`, `text-warning`, `text-error`, `text-info`
- Borders: `border-border`, `border-border-hover`

### Typography
- Headlines: `font-sans` (Inter), `font-bold`, `tracking-tight`
- Body: `font-sans`, `font-normal`
- Code/Data: `font-mono` (JetBrains Mono)

### Components Style
- **Cards**: `bg-bg-elevated rounded-xl border border-border p-6 shadow-md`
- **Glass panels**: `bg-bg-secondary/60 backdrop-blur-xl border border-border/50 rounded-xl`
- **Buttons (primary)**: `bg-brand text-white rounded-lg px-6 py-3 font-medium hover:bg-brand-hover transition`
- **Buttons (secondary)**: `bg-bg-surface text-text-primary rounded-lg px-6 py-3 border border-border hover:border-border-hover transition`

### Animations
- Use `framer-motion` for page entrances, component mounts, and interactive feedback
- Prefer `motion.div` with `initial`, `animate`, `exit` props
- Keep durations between 200-500ms
- Use `ease-out` or spring physics

## Folder Structure
```
src/
├── app/                    → Pages (App Router)
│   ├── globals.css         → Tailwind v4 @theme config
│   ├── layout.tsx          → Root layout
│   ├── page.tsx            → Homepage
│   ├── tools/              → Tool pages
│   ├── [conversion]/       → SEO pages
│   ├── blog/               → Blog
│   └── sitemap.ts          → XML sitemap
├── components/
│   ├── ui/                 → Primitive components (Button, Slider, etc.)
│   ├── shared/             → FileDropzone, ImagePreview, etc.
│   ├── layout/             → Navbar, Footer, Breadcrumb
│   └── tools/              → Tool-specific components
├── lib/
│   ├── image-processing/   → Processing logic per tool
│   ├── workers/            → Web Workers
│   ├── utils/              → cn(), file helpers, download
│   ├── constants/          → Formats, presets, SEO data
│   └── hooks/              → Custom hooks
└── types/                  → TypeScript type definitions
```

## How to Build a New Tool Page

### Step 1: Create the page
```
src/app/tools/{tool-name}/page.tsx
```
- Export `metadata` with unique title, description, canonical URL
- Mark as `'use client'` if the page uses hooks directly, or compose client components

### Step 2: Build the tool component
```
src/components/tools/{tool-name}/ToolPanel.tsx
```
- Mark as `'use client'`
- Import `FileDropzone` from `@/components/shared/FileDropzone`
- Import processing logic from `@/lib/image-processing/{tool}.ts`
- Use `ProcessingStatus` for loading states
- Use `ImagePreview` for results
- Use `DownloadButton` for export

### Step 3: Add processing logic
```
src/lib/image-processing/{tool}.ts
```
- Pure functions, no React
- Accept `File` or `Blob` inputs
- Return `Blob` or `string` (ObjectURL) outputs
- Use Web Workers for heavy operations (jSquash, compression)

### Step 4: Add SEO content
- Add FAQ section below the tool
- Add "How It Works" 3-step section
- Add "Related Tools" links
- Inject JSON-LD `WebApplication` schema

## Critical Rules

1. **All `'use client'`** — Every component that touches browser APIs (canvas, workers, file input) MUST have `'use client'` directive
2. **Dynamic imports for SSR-unsafe libs** — `react-compare-slider`, `react-easy-crop`, `@imgly/background-removal` must use `dynamic(() => import(...), { ssr: false })`
3. **Web Workers for heavy ops** — jSquash encoding, compression, and BG removal should run in Web Workers
4. **Memory cleanup** — Always `URL.revokeObjectURL()` when done with preview URLs
5. **Progressive enhancement** — Show meaningful UI before WASM loads; handle unsupported browsers gracefully
6. **No server calls** — Everything runs client-side. No API routes for processing.
7. **Tailwind v4 @theme only** — No `tailwind.config.js`. All theme configuration in `globals.css` via `@theme` and CSS variables.

## Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Common Patterns

### Image Processing Hook
```typescript
function useImageProcessor<T>(processFn: (file: File, opts: T) => Promise<Blob>) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const process = async (file: File, options: T) => {
    setStatus('processing');
    try {
      const blob = await processFn(file, options);
      const url = URL.createObjectURL(blob);
      setResult(url);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return { status, result, progress, process };
}
```

### File Size Formatting
```typescript
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
```

## Phase Checklist
- Phase 1: Foundation (Layout, Design System, Homepage)
- Phase 2: Core Components (Dropzone, Preview, Download, Processing Status)
- Phase 3: Primary Tools (Converter, Compressor, Resizer, Cropper, BG Remover)
- Phase 4: Secondary Tools (Filters, Watermark, Compare, Metadata, Color Picker)
- Phase 5: SEO & Polish (Conversion pages, Blog, Sitemap, JSON-LD)
- Phase 6: QA & Launch

## Debugging Tips
- If WASM fails to load: check that `.wasm` files are served correctly (Next.js handles this via Webpack)
- If canvas exports are blank: ensure image is fully loaded before drawing (`img.onload`)
- If `@imgly/background-removal` is slow on first run: model is downloading (~40-100MB), show progress UI
- If AVIF encoding fails: check browser supports `SharedArrayBuffer` (needs COOP/COEP headers)
