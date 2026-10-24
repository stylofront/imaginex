'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, Sparkles, X, ShieldCheck, Check } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Clear legacy permanent dismissal from localStorage so user can see it
    try {
      localStorage.removeItem('imaginex_pwa_banner_dismissed');
    } catch (_) {}

    // Check if already installed (standalone mode)
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed in this specific browsing session
    const sessionClosed = typeof window !== 'undefined' ? sessionStorage.getItem('imaginex_pwa_banner_session_closed') : null;
    if (!sessionClosed) {
      setIsVisible(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register service worker for offline capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {})
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          toast.success('Thank you for installing Imaginex Studio App!');
          setIsVisible(false);
          setDeferredPrompt(null);
        }
      } catch {
        toast.error('Installation could not be completed.');
      }
    } else {
      // Helpful guide for iOS or desktop browsers where prompt isn't directly dispatchable
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast.info("To install on iOS: Tap 'Share' ⎋ at bottom of Safari, then choose 'Add to Home Screen' ⊕");
      } else {
        toast.info("To install in Chrome/Edge: Click the install icon ⊕ on the right side of your browser address bar.");
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('imaginex_pwa_banner_session_closed', '1');
    } catch (_) {}
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="w-full bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-violet-500/10 dark:from-[#101323] dark:via-[#161B32] dark:to-[#101323] border-b border-violet-500/20 text-xs py-2 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto flex items-center justify-between gap-3">
        {/* Left: App Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-violet-500/30 hidden sm:block">
            <Image src="/logo.webp" alt="Imaginex App" width={20} height={20} className="object-contain" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
              <span>Imaginex Offline App</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--brand)]/15 text-[var(--brand)] shrink-0 hidden sm:inline-block">
              100% Free
            </span>
            <span className="text-[var(--text-muted)] hidden md:inline">•</span>
            <span className="text-[var(--text-secondary)] hidden md:inline truncate text-xs">
              Install to desktop or mobile for instant 0ms offline processing
            </span>
          </div>
        </div>

        {/* Right: Download CTA & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download & Save App</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
