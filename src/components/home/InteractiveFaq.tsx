'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ShieldCheck, Cpu, WifiOff, ExternalLink } from 'lucide-react';

const FAQS = [
  {
    q: 'How can I independently verify that my photos never touch a cloud server?',
    a: 'You can test this yourself in 5 seconds! Open Imaginex, load any image, and then completely disconnect your Wi-Fi or turn on Airplane Mode. You will find that image conversion, compression, resizing, and ZIP packaging still work instantaneously. Alternatively, open Chrome DevTools (F12) → Network Tab and observe that exactly 0 network requests are dispatched during image processing.',
  },
  {
    q: 'What is the file size limit and how many images can I batch process?',
    a: 'Unlike traditional cloud converters that restrict you to 5MB or 3 files per day to sell $15/month subscriptions, Imaginex has zero arbitrary limits. Because every computation executes directly on your device CPU/GPU through WebAssembly and Web Workers, you can process 100MB photos or 50+ images in parallel without paying a cent.',
  },
  {
    q: 'Why does Lanczos3 resampling look so much sharper than standard image resizing?',
    a: 'Standard browsers and basic websites resize images using Bilinear or Nearest Neighbor interpolation, which produces blurry edges and ringing artifacts. Imaginex uses the Lanczos3 algorithm—a 3-lobed mathematical sinc filter that calculates 36 neighboring pixels for every destination point, preserving razor-sharp typography and high-frequency textures.',
  },
  {
    q: 'What happens to my images after I close the browser tab?',
    a: 'Nothing is stored. Imaginex never writes your photos to disk, local storage, or indexedDB unless explicitly requested. Image buffers exist purely in volatile JavaScript memory (V8 ArrayBuffer) during the transformation cycle and are automatically purged by the browser garbage collector as soon as processing completes.',
  },
  {
    q: 'Who engineered Imaginex?',
    a: 'Imaginex is designed and engineered with pride by the Styloshare Team. Visit https://www.styloshare.com to explore our creative ecosystem and modern web development initiatives.',
    hasLink: true,
  },
];

export function InteractiveFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-3 border border-[var(--brand)]/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Transparency & FAQ</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Everything you need to know about our client-side architecture and privacy guarantees.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[var(--bg-secondary)] border-[var(--brand)]/40 shadow-md'
                  : 'bg-[var(--bg-secondary)]/60 border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--text-primary)]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--brand)] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] animate-in fade-in duration-200">
                  <p>{faq.a}</p>
                  {faq.hasLink && (
                    <div className="mt-3">
                      <a
                        href="https://www.styloshare.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-[var(--brand)] hover:underline"
                      >
                        Visit Styloshare Team ↗
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
