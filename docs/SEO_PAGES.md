# SEO Pages Reference — PixelForge

> Complete list of all programmatic SEO conversion pages with slugs, titles, meta descriptions, H1 tags, and FAQ content stubs.

---

## Conversion Page Slug Format

All conversion pages live under the dynamic route `app/[conversion]/page.tsx`.

The slug format follows: `{source}-to-{target}` for conversion pages, and `{action}-{format}` for single-format tool pages.

---

## Format Conversion Pages

| # | Slug | Meta Title | Meta Description | H1 |
|---|---|---|---|---|
| 1 | `png-to-jpg` | Convert PNG to JPG Free Online — PixelForge | Convert PNG images to JPG format instantly in your browser. No upload needed, 100% private. Adjust quality and download. | Convert PNG to JPG |
| 2 | `png-to-webp` | Convert PNG to WebP Free Online — PixelForge | Convert PNG to WebP for smaller file sizes with no quality loss. Browser-based, fast, and private. | Convert PNG to WebP |
| 3 | `png-to-avif` | Convert PNG to AVIF Free Online — PixelForge | Convert PNG images to the ultra-efficient AVIF format. Up to 50% smaller files. Client-side processing. | Convert PNG to AVIF |
| 4 | `jpg-to-png` | Convert JPG to PNG Free Online — PixelForge | Convert JPEG images to lossless PNG format. Preserve quality with transparent background support. | Convert JPG to PNG |
| 5 | `jpg-to-webp` | Convert JPG to WebP Free Online — PixelForge | Convert JPEG to WebP for better web performance. Smaller files, same quality. No server upload. | Convert JPG to WebP |
| 6 | `jpg-to-avif` | Convert JPG to AVIF Free Online — PixelForge | Convert JPEG images to next-gen AVIF format. Superior compression with excellent quality. | Convert JPG to AVIF |
| 7 | `webp-to-png` | Convert WebP to PNG Free Online — PixelForge | Convert WebP images to PNG format for universal compatibility. Lossless conversion in your browser. | Convert WebP to PNG |
| 8 | `webp-to-jpg` | Convert WebP to JPG Free Online — PixelForge | Convert WebP to JPEG for wider software compatibility. Fast, free, and private. | Convert WebP to JPG |
| 9 | `avif-to-png` | Convert AVIF to PNG Free Online — PixelForge | Convert AVIF images to widely-supported PNG format. No quality loss, instant processing. | Convert AVIF to PNG |
| 10 | `avif-to-jpg` | Convert AVIF to JPG Free Online — PixelForge | Convert AVIF to JPEG format for maximum compatibility. Browser-based conversion. | Convert AVIF to JPG |
| 11 | `heic-to-jpg` | Convert HEIC to JPG Free Online — PixelForge | Convert iPhone HEIC photos to JPG format. No upload needed — works entirely in your browser. | Convert HEIC to JPG |
| 12 | `heic-to-png` | Convert HEIC to PNG Free Online — PixelForge | Convert Apple HEIC images to lossless PNG. Private, fast, client-side conversion. | Convert HEIC to PNG |
| 13 | `svg-to-png` | Convert SVG to PNG Free Online — PixelForge | Rasterize SVG vector graphics to PNG at any resolution. Custom dimensions supported. | Convert SVG to PNG |
| 14 | `bmp-to-png` | Convert BMP to PNG Free Online — PixelForge | Convert BMP bitmap images to compressed PNG format. Reduce file size dramatically. | Convert BMP to PNG |
| 15 | `gif-to-png` | Convert GIF to PNG Free Online — PixelForge | Extract frames from GIF and convert to PNG. First frame extraction by default. | Convert GIF to PNG |
| 16 | `webp-to-avif` | Convert WebP to AVIF Free Online — PixelForge | Convert WebP images to the more efficient AVIF format. Better compression ratios. | Convert WebP to AVIF |
| 17 | `avif-to-webp` | Convert AVIF to WebP Free Online — PixelForge | Convert AVIF images to WebP for broader browser support. Fast and private. | Convert AVIF to WebP |
| 18 | `png-to-ico` | Convert PNG to ICO Free Online — PixelForge | Create ICO favicon files from PNG images. Perfect for website favicons. | Convert PNG to ICO |
| 19 | `jpg-to-pdf` | Convert JPG to PDF Free Online — PixelForge | Convert JPEG images to PDF documents. Single or multiple images per PDF. | Convert JPG to PDF |
| 20 | `png-to-pdf` | Convert PNG to PDF Free Online — PixelForge | Convert PNG images to PDF documents. Maintain quality, create shareable documents. | Convert PNG to PDF |

## Tool-Specific SEO Pages

| # | Slug | Meta Title | Meta Description | H1 |
|---|---|---|---|---|
| 21 | `compress-png` | Compress PNG Images Online Free — PixelForge | Reduce PNG file size with lossless OxiPNG compression. No quality loss, smaller files. | Compress PNG Images |
| 22 | `compress-jpg` | Compress JPG Images Online Free — PixelForge | Compress JPEG images by up to 80% with MozJPEG. Adjust quality, instant results. | Compress JPG Images |
| 23 | `compress-webp` | Compress WebP Images Online Free — PixelForge | Optimize WebP images for even smaller file sizes. Fine-tune quality settings. | Compress WebP Images |
| 24 | `compress-avif` | Compress AVIF Images Online Free — PixelForge | Further compress AVIF images with precision quality control. | Compress AVIF Images |
| 25 | `resize-image` | Resize Images Online Free — PixelForge | Resize any image to custom dimensions. Maintain aspect ratio, choose from presets. | Resize Images Online |
| 26 | `crop-image` | Crop Images Online Free — PixelForge | Crop, rotate, and flip images with precision. Aspect ratio presets included. | Crop Images Online |
| 27 | `remove-background` | Remove Image Background Free Online — PixelForge | Remove backgrounds from photos using AI. No upload needed — runs in your browser. | Remove Image Background |
| 28 | `add-watermark` | Add Watermark to Images Free Online — PixelForge | Add text or image watermarks to your photos. Customize position, opacity, and style. | Add Watermark to Images |
| 29 | `image-metadata` | View Image EXIF Data Online Free — PixelForge | Read EXIF, GPS, IPTC metadata from any image file. Supports JPEG, PNG, HEIC, WebP. | View Image Metadata |
| 30 | `color-palette` | Extract Color Palette from Image — PixelForge | Extract dominant colors and build palettes from any image. Copy HEX, RGB, HSL codes. | Extract Color Palette |

---

## FAQ Content Templates

### For Conversion Pages (e.g., PNG to JPG)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is it safe to convert {SOURCE} to {TARGET} online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! PixelForge processes all images directly in your browser using WebAssembly technology. Your files never leave your device — no data is uploaded to any server."
      }
    },
    {
      "@type": "Question",
      "name": "Will converting {SOURCE} to {TARGET} reduce quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Converting from {SOURCE} to {TARGET} {QUALITY_NOTE}. You can adjust the quality slider to find the perfect balance between file size and image quality."
      }
    },
    {
      "@type": "Question",
      "name": "What is the maximum file size I can convert?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Since all processing happens on your device, the limit depends on your device's memory. Most modern devices can handle images up to 100MB without issues."
      }
    },
    {
      "@type": "Question",
      "name": "Can I convert multiple {SOURCE} files to {TARGET} at once?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can drop multiple files into the converter and process them all at once. Download them individually or as a ZIP archive."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to install any software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No installation needed. PixelForge works entirely in your web browser. Just open the page, drop your images, and convert instantly."
      }
    }
  ]
}
```

### Quality Notes by Conversion Type

| Conversion | Quality Note |
|---|---|
| PNG → JPG | involves switching from lossless to lossy compression, which may result in minor quality reduction. However, JPG files are significantly smaller |
| PNG → WebP | can maintain excellent quality at much smaller file sizes. WebP supports both lossy and lossless modes |
| JPG → PNG | converts from lossy to lossless, so no additional quality is lost. The file size will increase |
| Any → AVIF | AVIF provides the best compression-to-quality ratio of any modern format |
| HEIC → JPG/PNG | is a straightforward conversion from Apple's format. Quality is preserved |

---

## "How It Works" Section Template

Every tool page should include this below the tool:

```
### How It Works

1. **Upload Your Image**
   Drop your file into the upload area or click to browse. We support JPEG, PNG, WebP, AVIF, and more.

2. **Configure Settings**
   Choose your target format, adjust quality, or customize options for your specific needs.

3. **Download Instantly**
   Your processed image is ready in seconds. Download it directly — no email, no signup required.

💡 **Privacy First:** Your images are processed entirely on your device. Nothing is ever uploaded to our servers.
```

---

## "Related Tools" Link Map

Each tool page should link to these related tools in the sidebar/bottom:

| Current Page | Related Tools |
|---|---|
| Image Converter | Compressor, Resizer, Batch Processor |
| Image Compressor | Converter, Resizer, Batch Processor |
| Background Remover | Image Cropper, Image Filters, Watermark Maker |
| Image Resizer | Converter, Compressor, Cropper, Batch Processor |
| Image Cropper | Resizer, Filters, Background Remover |
| Image Filters | Cropper, Watermark Maker, Image Compare |
| Watermark Maker | Filters, Cropper, Background Remover |
| Image Compare | Converter, Compressor, Filters |
| Metadata Viewer | Color Picker, Converter |
| Color Picker | Metadata Viewer, Filters |
| Batch Processor | Converter, Compressor, Resizer |

---

## `generateStaticParams` Implementation

```typescript
// app/[conversion]/page.tsx

const CONVERSIONS = [
  // Format conversions
  'png-to-jpg', 'png-to-webp', 'png-to-avif', 'png-to-ico',
  'jpg-to-png', 'jpg-to-webp', 'jpg-to-avif', 'jpg-to-pdf',
  'webp-to-png', 'webp-to-jpg', 'webp-to-avif',
  'avif-to-png', 'avif-to-jpg', 'avif-to-webp',
  'heic-to-jpg', 'heic-to-png',
  'svg-to-png', 'bmp-to-png', 'gif-to-png',
  'png-to-pdf',
  // Compression pages
  'compress-png', 'compress-jpg', 'compress-webp', 'compress-avif',
  // Tool pages
  'resize-image', 'crop-image', 'remove-background',
  'add-watermark', 'image-metadata', 'color-palette',
];

export function generateStaticParams() {
  return CONVERSIONS.map((slug) => ({ conversion: slug }));
}
```

---

## Sitemap Priority Mapping

| Route Pattern | Priority | Change Frequency |
|---|---|---|
| `/` (Homepage) | 1.0 | weekly |
| `/tools/*` | 0.9 | monthly |
| `/[conversion]` (SEO pages) | 0.8 | monthly |
| `/blog` | 0.7 | weekly |
| `/blog/[slug]` | 0.6 | monthly |
| `/about` | 0.3 | yearly |
| `/privacy` | 0.2 | yearly |
