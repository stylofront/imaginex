# PixelForge — Client-Side Image Transformation Suite

> **A premium, fully client-side image processing platform built with Next.js 15 + Tailwind CSS v4**
> All processing happens in the browser — zero uploads, zero servers, 100% privacy.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Libraries](#2-tech-stack--libraries)
3. [Design System](#3-design-system)
4. [Site Architecture & Routing](#4-site-architecture--routing)
5. [Feature Breakdown by Tool](#5-feature-breakdown-by-tool)
6. [Shared Components](#6-shared-components)
7. [SEO Strategy](#7-seo-strategy)
8. [Development Phases](#8-development-phases)
9. [File/Folder Structure](#9-filefolder-structure)

---

## 1. Project Overview

### What Is This?
**PixelForge** is a free, client-side image toolkit website. Users can convert, compress, resize, crop, remove backgrounds, apply filters, add watermarks, compare images, extract metadata, and pick colors — all without uploading a single file to any server.

### Core Value Proposition
- 🔒 **100% Privacy** — Files never leave the user's device
- ⚡ **Instant Processing** — WebAssembly + Web Workers for speed
- 💰 **Free Forever** — No server costs = no paywalls
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- 🌐 **Offline-Ready** — Service Worker caching for repeat visits

---

## 2. Tech Stack & Libraries

### Framework & Styling
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15 (App Router) | Framework with SSG, routing, metadata API |
| **Tailwind CSS** | v4 | CSS-first config with `@theme` directive |
| **TypeScript** | 5.x | Type safety across the codebase |

### Client-Side Image Processing Libraries

| Library | npm Package | Purpose | Why Chosen |
|---|---|---|---|
| **jSquash** | `@jsquash/jpeg`, `@jsquash/png`, `@jsquash/webp`, `@jsquash/avif`, `@jsquash/oxipng`, `@jsquash/resize` | Format conversion & encoding/decoding via WASM (from Google Squoosh) | Best-in-class WASM codecs, modular packages, great quality |
| **browser-image-compression** | `browser-image-compression` | Image compression with quality/size targets | Web Worker support, progress callback, widely used |
| **@imgly/background-removal** | `@imgly/background-removal` | AI-powered background removal in-browser via ONNX + WASM | Only viable client-side BG removal, no server needed |
| **react-easy-crop** | `react-easy-crop` | Interactive crop/rotate/zoom UI | Touch-friendly, lightweight, composable with Canvas |
| **Pica** | `pica` | High-quality image resizing | Lanczos3 filter, Web Worker/WASM support, prevents pixelation |
| **react-compare-slider** | `react-compare-slider` | Before/After image comparison slider | Touch support, responsive, SSR-safe with dynamic import |
| **exifr** | `exifr` | EXIF/GPS/IPTC/XMP metadata reader | Zero-dep, async, supports HEIC/AVIF/WebP, fast partial reads |
| **react-dropzone** | `react-dropzone` | Drag & drop file upload zone | Industry standard, accessible, handles validation |
| **Canvas API** | Native | Filters, watermarks, color picking, pixel manipulation | Built into every browser, zero bundle cost |
| **EyeDropper API** | Native | Screen color sampling | Chrome/Edge native, zero bundle cost |
| **colorthief** | `colorthief` | Dominant color palette extraction from images | Lightweight, well-tested median-cut algorithm |

### Fonts & Icons
| Resource | Package/Source | Purpose |
|---|---|---|
| **Inter** | `next/font/google` | Primary UI typeface — clean, modern, variable weight |
| **JetBrains Mono** | `next/font/google` | Monospace for metadata, code, and technical data |
| **Lucide React** | `lucide-react` | Consistent, modern SVG icon set |

### Utilities
| Library | Purpose |
|---|---|
| `file-saver` | Trigger browser downloads for processed files |
| `jszip` | Bundle multiple processed images into a ZIP for batch download |
| `clsx` + `tailwind-merge` | Conditional class merging utility |
| `framer-motion` | Smooth page transitions and micro-animations |
| `sonner` | Toast notifications for processing status |

---

## 3. Design System

### Tailwind v4 CSS-First Configuration (`globals.css`)

```css
@import "tailwindcss";

/* ══════════════════════════════════════
   CSS CUSTOM PROPERTIES (Light Mode)
   ══════════════════════════════════════ */
:root {
  /* Background layers */
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-tertiary: #1a1a24;
  --bg-elevated: #22222e;
  --bg-surface: #2a2a38;

  /* Text */
  --text-primary: #f0f0f5;
  --text-secondary: #a0a0b8;
  --text-muted: #6b6b82;
  --text-inverse: #0a0a0f;

  /* Brand - Electric Violet + Cyan accent */
  --brand-primary: #7c3aed;
  --brand-primary-hover: #6d28d9;
  --brand-secondary: #06b6d4;
  --brand-gradient: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);

  /* Semantic */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Borders & Rings */
  --border-default: #2a2a3a;
  --border-hover: #3a3a4e;
  --ring-focus: rgba(124, 58, 237, 0.5);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 24px rgba(124, 58, 237, 0.15);

  /* Radii */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Spacing scale (subset) */
  --space-section: 6rem;
  --space-card: 1.5rem;

  /* Transitions */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
}

/* ══════════════════════════════════════
   TAILWIND v4 @theme MAPPING
   ══════════════════════════════════════ */
@theme {
  /* Fonts */
  --font-sans: var(--font-inter), "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace;

  /* Colors mapped from CSS vars */
  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-bg-elevated: var(--bg-elevated);
  --color-bg-surface: var(--bg-surface);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);

  --color-brand: var(--brand-primary);
  --color-brand-hover: var(--brand-primary-hover);
  --color-accent: var(--brand-secondary);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --color-info: var(--info);

  --color-border: var(--border-default);
  --color-border-hover: var(--border-hover);

  /* Shadows */
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-glow: var(--shadow-glow);

  /* Radii */
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
}
```

### Design Principles
1. **Dark-first** — Rich dark backgrounds with glowing accents
2. **Glassmorphism** — Semi-transparent panels with backdrop blur
3. **Gradient accents** — Violet→Cyan brand gradient on CTAs & highlights
4. **Micro-animations** — Framer Motion for entrances, hovers, state changes
5. **Consistent spacing** — 8px grid system
6. **Accessibility** — WCAG 2.1 AA contrast ratios, focus rings, keyboard nav

---

## 4. Site Architecture & Routing

### Route Map

```
app/
├── layout.tsx                          → Root layout (fonts, metadata base, nav, footer)
├── page.tsx                            → HOMEPAGE (hero, tool grid, features, testimonials)
├── globals.css                         → Tailwind v4 + @theme + global styles
│
├── tools/
│   ├── layout.tsx                      → Shared tool page layout (breadcrumb, sidebar)
│   │
│   ├── image-converter/
│   │   └── page.tsx                    → Universal format converter
│   │
│   ├── image-compressor/
│   │   └── page.tsx                    → Compress images (quality/size target)
│   │
│   ├── background-remover/
│   │   └── page.tsx                    → AI background removal
│   │
│   ├── image-resizer/
│   │   └── page.tsx                    → Resize by dimensions, percentage, or presets
│   │
│   ├── image-cropper/
│   │   └── page.tsx                    → Crop, rotate, flip editor
│   │
│   ├── image-filters/
│   │   └── page.tsx                    → Apply filters (grayscale, sepia, blur, etc.)
│   │
│   ├── watermark-maker/
│   │   └── page.tsx                    → Add text/image watermark overlay
│   │
│   ├── image-compare/
│   │   └── page.tsx                    → Side-by-side before/after slider
│   │
│   ├── metadata-viewer/
│   │   └── page.tsx                    → EXIF/GPS/IPTC metadata inspector
│   │
│   ├── color-picker/
│   │   └── page.tsx                    → EyeDropper + palette extraction
│   │
│   └── batch-processor/
│       └── page.tsx                    → Bulk convert/compress/resize multiple files
│
├── [conversion]/
│   └── page.tsx                        → PROGRAMMATIC SEO pages (e.g., /png-to-jpg)
│
├── about/
│   └── page.tsx                        → About page with privacy commitment
│
├── blog/
│   ├── page.tsx                        → Blog listing
│   └── [slug]/page.tsx                 → Individual blog posts
│
├── privacy/
│   └── page.tsx                        → Privacy policy
│
├── sitemap.ts                          → Programmatic XML sitemap
└── robots.ts                           → Crawler instructions
```

### Programmatic SEO Conversion Pages (`/[conversion]`)

These pages are statically generated at build time for every format combination:

| Slug | Title |
|---|---|
| `/png-to-jpg` | Convert PNG to JPG Free Online |
| `/png-to-webp` | Convert PNG to WebP Free Online |
| `/jpg-to-png` | Convert JPG to PNG Free Online |
| `/jpg-to-webp` | Convert JPG to WebP Free Online |
| `/webp-to-png` | Convert WebP to PNG Free Online |
| `/webp-to-jpg` | Convert WebP to JPG Free Online |
| `/png-to-avif` | Convert PNG to AVIF Free Online |
| `/jpg-to-avif` | Convert JPG to AVIF Free Online |
| `/avif-to-png` | Convert AVIF to PNG Free Online |
| `/avif-to-jpg` | Convert AVIF to JPG Free Online |
| `/heic-to-jpg` | Convert HEIC to JPG Free Online |
| `/heic-to-png` | Convert HEIC to PNG Free Online |
| `/svg-to-png` | Convert SVG to PNG Free Online |
| `/bmp-to-png` | Convert BMP to PNG Free Online |
| `/gif-to-png` | Convert GIF to PNG Free Online |
| `/compress-png` | Compress PNG Images Online |
| `/compress-jpg` | Compress JPG Images Online |
| `/compress-webp` | Compress WebP Images Online |
| `/resize-image` | Resize Images Online Free |
| `/remove-background` | Remove Image Background Free |

Each page includes:
- The actual tool (pre-configured for that conversion)
- SEO-optimized H1, meta title, meta description
- FAQ section with structured data
- "How It Works" steps
- Internal links to related tools
- JSON-LD WebApplication schema

---

## 5. Feature Breakdown by Tool

### 5.1 — Image Converter
**Library:** `@jsquash/*` (JPEG, PNG, WebP, AVIF, OxiPNG)
**Flow:**
1. User drops image(s) via dropzone
2. Select target format from dropdown (PNG, JPG, WebP, AVIF)
3. Adjust quality slider (for lossy formats)
4. Click "Convert" → process in Web Worker via jSquash
5. Preview result + download button
6. For multiple files: batch convert + ZIP download

**Technical Notes:**
- Decode input via format-specific `decode()`, get `ImageData`
- Encode to target via format-specific `encode(imageData, options)`
- Run in Web Worker to prevent UI freeze
- Show progress bar during WASM module loading

### 5.2 — Image Compressor
**Library:** `browser-image-compression`
**Flow:**
1. Drop image(s)
2. Choose mode: "Target Size" (e.g., under 500KB) or "Quality" (slider 0-100)
3. Optional: limit max dimensions
4. Process → show original vs compressed size comparison
5. Download compressed file(s)

**Options Exposed:**
- `maxSizeMB` — target file size
- `maxWidthOrHeight` — dimension limit
- `initialQuality` — starting quality (0-1)
- `fileType` — optional output format override
- `useWebWorker: true` — always on

### 5.3 — Background Remover
**Library:** `@imgly/background-removal`
**Flow:**
1. Drop single image
2. Show loading progress (model download ~40-100MB first time)
3. Process via ONNX/WASM
4. Show before/after using `react-compare-slider`
5. Download transparent PNG

**Config Options:**
- Model size: `small` (fast) / `medium` (balanced) / `large` (best quality)
- Output format: PNG (transparent) or custom background color
- `preload()` on page mount for faster subsequent uses
- Progress callback for download/processing status

### 5.4 — Image Resizer
**Library:** `pica` (high-quality) + Canvas API
**Flow:**
1. Drop image
2. Show current dimensions
3. Resize modes:
   - **Custom dimensions** — enter width/height (with lock aspect ratio toggle)
   - **Percentage** — scale by 25%, 50%, 75%, 150%, 200%
   - **Presets** — Social media sizes (Instagram 1080×1080, Twitter 1200×675, Facebook 1200×630, etc.)
4. Preview resized result
5. Download

### 5.5 — Image Cropper
**Library:** `react-easy-crop` + Canvas helper
**Flow:**
1. Drop image
2. Interactive crop area with:
   - Drag to position
   - Pinch/scroll to zoom
   - Rotation slider (0-360°)
   - Flip horizontal/vertical buttons
   - Aspect ratio presets (Free, 1:1, 4:3, 16:9, 3:2, 2:3)
3. Click "Crop" → canvas processing
4. Preview + download

### 5.6 — Image Filters
**Library:** Canvas API (`ctx.filter` + pixel manipulation)
**Flow:**
1. Drop image
2. Filter panel with sliders:
   - Brightness (0-200%)
   - Contrast (0-200%)
   - Saturation (0-200%)
   - Blur (0-20px)
   - Hue Rotate (0-360°)
   - Grayscale (0-100%)
   - Sepia (0-100%)
   - Invert (0-100%)
3. One-click presets: "Vintage", "Noir", "Vivid", "Cool", "Warm", "Fade"
4. Real-time preview via CSS filters (GPU-accelerated)
5. Final export via Canvas (`toBlob`)

### 5.7 — Watermark Maker
**Library:** Canvas API + optional `watermark-js-plus`
**Flow:**
1. Drop image
2. Choose watermark type:
   - **Text** — enter text, font, size, color, opacity, position
   - **Image** — upload logo/watermark image, set size, opacity, position
3. Position selector: 9-point grid (top-left, top-center, top-right, etc.)
4. Tiling option: single placement or repeating diagonal grid
5. Live preview on canvas
6. Download

### 5.8 — Image Compare
**Library:** `react-compare-slider`
**Flow:**
1. Drop TWO images (or one original + processed result from another tool)
2. Side-by-side comparison with draggable slider
3. Toggle orientation: horizontal / vertical
4. Toggle "Hover mode" vs "Drag mode"
5. Show file size / dimensions info for both images

### 5.9 — Metadata Viewer
**Library:** `exifr`
**Flow:**
1. Drop image
2. Parse all metadata segments:
   - **EXIF** — camera make, model, exposure, ISO, aperture, focal length
   - **GPS** — latitude, longitude (with map preview link)
   - **IPTC** — copyright, caption, keywords
   - **XMP** — extended metadata
   - **ICC** — color profile information
3. Display in organized, collapsible sections
4. "Copy All" button for metadata JSON
5. Optional: "Strip Metadata" tool — re-encode without EXIF (privacy feature)

### 5.10 — Color Picker
**Library:** EyeDropper API + Canvas + `colorthief`
**Flow:**
1. Drop image OR use screen eyedropper
2. **Image mode:**
   - Render on canvas, click to sample pixel color
   - Show HEX, RGB, HSL values
   - Auto-extract dominant palette (5-8 colors) via `colorthief`
   - Copy color codes with one click
3. **Screen mode:**
   - Use native EyeDropper API (Chromium)
   - Fallback message for unsupported browsers
4. Palette display with copy-to-clipboard on each swatch

### 5.11 — Batch Processor
**Library:** Combines all above tools
**Flow:**
1. Drop multiple images (up to 50)
2. Select operation: Convert / Compress / Resize
3. Configure settings for chosen operation
4. Process all files with progress indicator
5. Download individually or as ZIP via `jszip`

---

## 6. Shared Components

### 6.1 — FileDropzone (Core Component)
The heart of every tool page. A reusable, polished drag-and-drop upload zone.

**Features:**
- Drag & drop with visual feedback (glow border on drag-over)
- Click to browse files
- Single or multiple file mode (configurable via prop)
- File type validation with error messages
- File size limit with clear feedback
- Image preview thumbnails with file name/size
- Remove individual files
- "Clear All" button
- Animated entrance with Framer Motion
- Accessibility: keyboard navigation, ARIA labels

**Props Interface:**
```typescript
interface FileDropzoneProps {
  accept?: Record<string, string[]>;  // MIME type → extensions map
  maxFiles?: number;                   // 1 for single, N for batch
  maxSizeMB?: number;                  // Per-file size limit
  onFilesChange: (files: File[]) => void;
  label?: string;
  description?: string;
  className?: string;
}
```

### 6.2 — ProcessingStatus
Progress indicator shown during heavy operations.

**States:**
- Idle → Processing (spinner + progress %) → Complete (✓) → Error (✗)
- Cancel button during processing
- Time elapsed counter

### 6.3 — ImagePreview
Display uploaded/processed images with info overlay.

**Features:**
- Responsive image display with zoom
- File info badge (name, dimensions, size, format)
- Fullscreen lightbox on click
- Download button overlay

### 6.4 — DownloadButton
Consistent download CTA across all tools.

**Features:**
- Triggers `file-saver` download
- Shows file size in button
- Disabled state during processing
- "Download All as ZIP" variant for batch

### 6.5 — ToolPageLayout
Shared wrapper for all tool pages.

**Contains:**
- Breadcrumb navigation
- Tool title + description
- The tool interface area
- SEO content section below tool (FAQ, How It Works, Related Tools)
- JSON-LD structured data injection

### 6.6 — Navbar
Global navigation bar.

**Features:**
- Logo + site name
- Tool dropdown mega-menu
- Mobile hamburger menu with slide-in panel
- Glassmorphism with backdrop blur
- Active page indicator

### 6.7 — Footer
Global footer.

**Contains:**
- Tool category links
- About, Privacy, Blog links
- "Made with ❤️" badge
- Privacy commitment statement

---

## 7. SEO Strategy

### 7.1 — On-Page SEO
- **Unique `<title>` and `<meta description>`** per page via Next.js `metadata` / `generateMetadata`
- **Single `<h1>`** per page with target keyword
- **Semantic HTML5** — `<main>`, `<section>`, `<article>`, `<nav>`, `<aside>`
- **Alt text** on all images
- **Canonical URLs** via `alternates.canonical`
- **OpenGraph + Twitter Card** metadata for social sharing

### 7.2 — Technical SEO
- **`sitemap.ts`** — Auto-generates XML sitemap with all tool pages + conversion pages + blog posts
- **`robots.ts`** — Allows all crawlers, points to sitemap
- **SSG (Static Site Generation)** — All pages pre-rendered at build time for instant load
- **Core Web Vitals** — LCP < 2.5s, CLS < 0.1, INP < 200ms
- **`metadataBase`** in root layout for proper URL resolution

### 7.3 — Structured Data (JSON-LD)
- `WebApplication` schema on every tool page
- `FAQPage` schema on conversion pages with Q&A content
- `BreadcrumbList` schema for navigation
- `Organization` schema on homepage
- `BlogPosting` schema on blog articles

### 7.4 — Content Strategy
Each tool page includes below the tool:
1. **"How It Works"** — 3-step visual guide
2. **"Why Use This Tool?"** — Benefits list
3. **"Frequently Asked Questions"** — 5+ FAQs with schema markup
4. **"Related Tools"** — Internal links to complementary tools
5. **"Format Guide"** — Educational content (e.g., "JPEG vs PNG: When to Use Which")

### 7.5 — Internal Linking
- Homepage → All tool pages
- Each tool page → Related tools (sidebar + bottom section)
- Conversion pages → Parent converter tool + other format conversions
- Blog posts → Relevant tools

---

## 8. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Set up Tailwind CSS v4 with `@theme` configuration
- [ ] Configure fonts (Inter, JetBrains Mono)
- [ ] Build design system (`globals.css` with all CSS variables)
- [ ] Create root layout with metadata base
- [ ] Build Navbar component (desktop + mobile)
- [ ] Build Footer component
- [ ] Build homepage (hero section, tool grid, features, CTA)
- [ ] Set up Framer Motion for page transitions

### Phase 2: Core Components (Week 2)
- [ ] Build `FileDropzone` component (single + multi mode)
- [ ] Build `ProcessingStatus` component
- [ ] Build `ImagePreview` component
- [ ] Build `DownloadButton` component
- [ ] Build `ToolPageLayout` wrapper
- [ ] Create Web Worker utility setup for image processing
- [ ] Set up `file-saver` and `jszip` utilities

### Phase 3: Primary Tools (Week 3-4)
- [ ] Image Converter (jSquash integration)
- [ ] Image Compressor (browser-image-compression)
- [ ] Image Resizer (Pica)
- [ ] Image Cropper (react-easy-crop)
- [ ] Background Remover (@imgly/background-removal)

### Phase 4: Secondary Tools (Week 5)
- [ ] Image Filters (Canvas API)
- [ ] Watermark Maker (Canvas API)
- [ ] Image Compare (react-compare-slider)
- [ ] Metadata Viewer (exifr)
- [ ] Color Picker (EyeDropper + Canvas + colorthief)

### Phase 5: Batch & Polish (Week 6)
- [ ] Batch Processor (multi-file operations)
- [ ] Programmatic SEO pages (`/[conversion]`)
- [ ] Blog infrastructure
- [ ] About & Privacy pages
- [ ] Sitemap & robots.ts
- [ ] JSON-LD structured data on all pages
- [ ] Performance optimization (lazy loading, code splitting)

### Phase 6: QA & Launch (Week 7)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Lighthouse performance audit (target 95+ all categories)
- [ ] SEO validation (meta tags, structured data, sitemap)
- [ ] Final polish and deploy

---

## 9. File/Folder Structure

```
imagetransformation/
├── docs/
│   ├── PROJECT_PLAN.md                     ← This file
│   ├── LIBRARY_REFERENCE.md                ← Detailed API reference for each library
│   └── SEO_PAGES.md                        ← Full list of conversion page slugs & content
│
├── .agents/
│   └── skills/
│       └── pixelforge-dev/
│           └── SKILL.md                    ← Agenting skill for continued development
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                        ← OpenGraph preview image
│   └── icons/                              ← PWA icons (optional)
│
├── src/
│   ├── app/
│   │   ├── globals.css                     ← Tailwind v4 + @theme + global styles
│   │   ├── layout.tsx                      ← Root layout
│   │   ├── page.tsx                        ← Homepage
│   │   ├── sitemap.ts                      ← XML sitemap generator
│   │   ├── robots.ts                       ← Crawler rules
│   │   │
│   │   ├── tools/
│   │   │   ├── layout.tsx
│   │   │   ├── image-converter/page.tsx
│   │   │   ├── image-compressor/page.tsx
│   │   │   ├── background-remover/page.tsx
│   │   │   ├── image-resizer/page.tsx
│   │   │   ├── image-cropper/page.tsx
│   │   │   ├── image-filters/page.tsx
│   │   │   ├── watermark-maker/page.tsx
│   │   │   ├── image-compare/page.tsx
│   │   │   ├── metadata-viewer/page.tsx
│   │   │   ├── color-picker/page.tsx
│   │   │   └── batch-processor/page.tsx
│   │   │
│   │   ├── [conversion]/
│   │   │   └── page.tsx                    ← Programmatic SEO pages
│   │   │
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                             ← Primitive UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── shared/                         ← Shared feature components
│   │   │   ├── FileDropzone.tsx
│   │   │   ├── ProcessingStatus.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   ├── DownloadButton.tsx
│   │   │   ├── ToolPageLayout.tsx
│   │   │   ├── BeforeAfterSlider.tsx
│   │   │   └── SEOContent.tsx
│   │   │
│   │   ├── layout/                         ← Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Breadcrumb.tsx
│   │   │
│   │   └── tools/                          ← Tool-specific components
│   │       ├── converter/
│   │       │   ├── ConvertPanel.tsx
│   │       │   └── FormatSelector.tsx
│   │       ├── compressor/
│   │       │   ├── CompressPanel.tsx
│   │       │   └── QualitySlider.tsx
│   │       ├── cropper/
│   │       │   ├── CropEditor.tsx
│   │       │   └── AspectRatioSelector.tsx
│   │       ├── filters/
│   │       │   ├── FilterPanel.tsx
│   │       │   └── FilterPresets.tsx
│   │       ├── watermark/
│   │       │   ├── WatermarkEditor.tsx
│   │       │   └── PositionGrid.tsx
│   │       ├── metadata/
│   │       │   └── MetadataTable.tsx
│   │       └── colorpicker/
│   │           ├── CanvasPicker.tsx
│   │           └── PaletteDisplay.tsx
│   │
│   ├── lib/                                ← Core utilities & processing logic
│   │   ├── image-processing/
│   │   │   ├── converter.ts                ← jSquash encode/decode logic
│   │   │   ├── compressor.ts               ← browser-image-compression wrapper
│   │   │   ├── resizer.ts                  ← Pica resize logic
│   │   │   ├── bg-remover.ts               ← @imgly wrapper with preload
│   │   │   ├── filters.ts                  ← Canvas filter application
│   │   │   ├── watermark.ts                ← Canvas watermark logic
│   │   │   ├── metadata.ts                 ← exifr parsing wrapper
│   │   │   ├── color-extractor.ts          ← colorthief + EyeDropper
│   │   │   └── canvas-utils.ts             ← Shared canvas helpers (crop, export)
│   │   │
│   │   ├── workers/
│   │   │   ├── convert.worker.ts           ← Web Worker for format conversion
│   │   │   └── compress.worker.ts          ← Web Worker for compression
│   │   │
│   │   ├── utils/
│   │   │   ├── file-helpers.ts             ← File size formatting, type detection
│   │   │   ├── download.ts                 ← file-saver + jszip utilities
│   │   │   └── cn.ts                       ← clsx + tailwind-merge
│   │   │
│   │   ├── constants/
│   │   │   ├── formats.ts                  ← Supported format definitions
│   │   │   ├── social-presets.ts           ← Social media dimension presets
│   │   │   ├── filter-presets.ts           ← Named filter combinations
│   │   │   └── seo-conversions.ts          ← Conversion page slugs + metadata
│   │   │
│   │   └── hooks/
│   │       ├── useImageProcessor.ts        ← Generic processing hook with state
│   │       ├── useFileDropzone.ts           ← Custom dropzone logic hook
│   │       └── useDownload.ts              ← Download trigger hook
│   │
│   └── types/
│       ├── image.ts                        ← Image file types, processing options
│       └── tools.ts                        ← Tool page types, conversion types
│
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key Decisions & Rationale

| Decision | Rationale |
|---|---|
| **jSquash over Squoosh CLI** | jSquash is modular (install only codecs you need), actively maintained, and designed for browser WASM usage |
| **Pica over native canvas resize** | Native canvas uses bilinear interpolation which produces visible artifacts. Pica uses Lanczos3 for photo-quality results |
| **`@imgly/background-removal` over API** | Only production-grade client-side BG removal solution. Uses ONNX Runtime Web for GPU-accelerated ML inference |
| **exifr over exif-js** | exif-js is abandoned, buggy in modern browsers. exifr is fast, async, supports modern formats (HEIC, AVIF) |
| **Dark-first design** | Image tools look more professional on dark backgrounds; images "pop" against dark UI |
| **Programmatic SEO pages** | Captures long-tail search traffic (e.g., "convert png to webp free online") — each page is a dedicated landing page |
| **Web Workers for heavy ops** | Prevents UI thread blocking during WASM encoding/compression |

---

> **This document is the single source of truth for PixelForge development.**
> All AI agents continuing work on this project should read this document first.
