// Sample images for instant 1-click playground demonstrations without uploading personal files

export interface SamplePreset {
  id: string;
  name: string;
  label: string;
  category: string;
  width: number;
  height: number;
  svgContent: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'mountain',
    name: 'mountain-vista-4k',
    label: '🏔️ Mountain 4K',
    category: 'Landscape',
    width: 1200,
    height: 675,
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E1B4B" />
            <stop offset="45%" stop-color="#4338CA" />
            <stop offset="75%" stop-color="#F43F8E" />
            <stop offset="100%" stop-color="#FF9D32" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD080" />
            <stop offset="100%" stop-color="#FF5470" />
          </linearGradient>
          <linearGradient id="peakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="30%" stop-color="#A5B4FC" />
            <stop offset="100%" stop-color="#1E1B4B" />
          </linearGradient>
          <linearGradient id="frontMountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#312E81" />
            <stop offset="100%" stop-color="#0B0D18" />
          </linearGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#skyGrad)" />
        <circle cx="600" cy="360" r="140" fill="url(#sunGrad)" opacity="0.9" />
        <polygon points="120,675 380,240 640,675" fill="#4338CA" opacity="0.7" />
        <polygon points="520,675 780,210 1080,675" fill="#3730A3" opacity="0.6" />
        <polygon points="300,675 600,160 900,675" fill="url(#peakGrad)" />
        <polygon points="560,220 600,160 640,220 620,250 600,230 580,250" fill="#FFFFFF" />
        <polygon points="-80,675 240,380 560,675" fill="url(#frontMountain)" />
        <polygon points="700,675 980,360 1280,675" fill="url(#frontMountain)" />
        <polygon points="380,675 680,420 1020,675" fill="#0B0D18" opacity="0.9" />
        <g fill="#060814" opacity="0.8">
          <polygon points="180,675 190,580 200,675" />
          <polygon points="210,675 225,560 240,675" />
          <polygon points="250,675 260,590 270,675" />
          <polygon points="920,675 935,570 950,675" />
          <polygon points="960,675 970,595 980,675" />
        </g>
      </svg>
    `,
  },
  {
    id: 'portrait',
    name: 'studio-portrait',
    label: '👤 Studio Portrait',
    category: 'Portrait',
    width: 800,
    height: 1000,
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="portGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181B" />
            <stop offset="50%" stop-color="#27272A" />
            <stop offset="100%" stop-color="#09090B" />
          </linearGradient>
          <radialGradient id="rimLight" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#7047FF" stop-opacity="0.4" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCD34D" />
            <stop offset="100%" stop-color="#F97316" />
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#portGrad)" />
        <rect width="800" height="1000" fill="url(#rimLight)" />
        <circle cx="400" cy="380" r="160" fill="url(#faceGrad)" opacity="0.9" />
        <circle cx="400" cy="380" r="168" stroke="#7047FF" stroke-width="4" fill="none" opacity="0.8" />
        <rect x="310" y="340" width="180" height="50" rx="25" fill="#0B0D18" stroke="#16D9F5" stroke-width="5" />
        <path d="M 160 880 C 180 620, 260 550, 400 550 C 540 550, 620 620, 640 880 Z" fill="#2563EB" opacity="0.85" />
        <path d="M 220 880 C 240 680, 300 610, 400 610 C 500 610, 560 680, 580 880 Z" fill="#1E293B" />
      </svg>
    `,
  },
  {
    id: 'document',
    name: 'confidential-id-card',
    label: '🪪 Confidential ID',
    category: 'Privacy',
    width: 1000,
    height: 750,
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" width="1000" height="750">
        <defs>
          <linearGradient id="docBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F8FAFC" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
        </defs>
        <rect width="1000" height="750" fill="#0F172A" />
        <rect x="120" y="70" width="760" height="610" rx="16" fill="url(#docBg)" stroke="#94A3B8" stroke-width="2" />
        <rect x="160" y="110" width="300" height="30" rx="6" fill="#1E293B" />
        <rect x="160" y="155" width="180" height="16" rx="4" fill="#64748B" />
        <rect x="160" y="210" width="180" height="220" rx="10" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2" />
        <circle cx="250" cy="290" r="45" fill="#94A3B8" />
        <path d="M 190 410 C 200 350, 300 350, 310 410 Z" fill="#94A3B8" />
        <rect x="380" y="220" width="450" height="20" rx="4" fill="#1E293B" />
        <rect x="380" y="260" width="380" height="20" rx="4" fill="#1E293B" />
        <rect x="380" y="300" width="420" height="20" rx="4" fill="#1E293B" />
        <rect x="380" y="360" width="320" height="16" rx="4" fill="#64748B" />
        <rect x="380" y="390" width="280" height="16" rx="4" fill="#64748B" />
        <circle cx="740" cy="530" r="65" fill="#EF4444" opacity="0.8" stroke="#DC2626" stroke-width="3" stroke-dasharray="6,4" />
        <text x="740" y="535" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">CONFIDENTIAL</text>
      </svg>
    `,
  },
  {
    id: 'cyberpunk',
    name: 'cyberpunk-neon-city',
    label: '🌃 Cyberpunk Neon',
    category: 'Vibrant',
    width: 1200,
    height: 675,
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
        <defs>
          <linearGradient id="cyberSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#050510" />
            <stop offset="70%" stop-color="#1E1035" />
            <stop offset="100%" stop-color="#4C0519" />
          </linearGradient>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#16D9F5" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#F43F8E" stop-opacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="675" fill="url(#cyberSky)" />
        <g stroke="url(#gridGrad)" stroke-width="1.5">
          <line x1="600" y1="400" x2="0" y2="675" />
          <line x1="600" y1="400" x2="200" y2="675" />
          <line x1="600" y1="400" x2="400" y2="675" />
          <line x1="600" y1="400" x2="600" y2="675" />
          <line x1="600" y1="400" x2="800" y2="675" />
          <line x1="600" y1="400" x2="1000" y2="675" />
          <line x1="600" y1="400" x2="1200" y2="675" />
          <line x1="300" y1="450" x2="900" y2="450" />
          <line x1="200" y1="500" x2="1000" y2="500" />
          <line x1="100" y1="570" x2="1100" y2="570" />
        </g>
        <rect x="180" y="240" width="90" height="260" fill="#0F172A" stroke="#16D9F5" stroke-width="2" />
        <rect x="290" y="160" width="130" height="340" fill="#1E1B4B" stroke="#F43F8E" stroke-width="2" />
        <rect x="440" y="200" width="110" height="300" fill="#0B0D18" stroke="#7047FF" stroke-width="2" />
        <rect x="580" y="130" width="140" height="370" fill="#18181B" stroke="#16D9F5" stroke-width="2" />
        <rect x="740" y="220" width="100" height="280" fill="#1E1B4B" stroke="#FF9D32" stroke-width="2" />
        <rect x="860" y="180" width="120" height="320" fill="#0F172A" stroke="#F43F8E" stroke-width="2" />
      </svg>
    `,
  },
];

/**
 * Converts an SVG preset string into a real browser PNG File object using Canvas rasterization
 */
export async function samplePresetToPngFile(preset: SamplePreset): Promise<File> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      const blob = new Blob([preset.svgContent], { type: 'image/svg+xml' });
      resolve(new File([blob], `${preset.name}.svg`, { type: 'image/svg+xml' }));
      return;
    }

    const img = new window.Image();
    const svgBlob = new Blob([preset.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, preset.width, preset.height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(new File([blob], `${preset.name}.png`, { type: 'image/png' }));
            } else {
              resolve(new File([svgBlob], `${preset.name}.svg`, { type: 'image/svg+xml' }));
            }
          }, 'image/png');
        } else {
          URL.revokeObjectURL(url);
          resolve(new File([svgBlob], `${preset.name}.svg`, { type: 'image/svg+xml' }));
        }
      } catch {
        URL.revokeObjectURL(url);
        resolve(new File([svgBlob], `${preset.name}.svg`, { type: 'image/svg+xml' }));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(new File([svgBlob], `${preset.name}.svg`, { type: 'image/svg+xml' }));
    };

    img.src = url;
  });
}
