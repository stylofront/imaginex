'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, ArrowLeft, RefreshCw, Download } from 'lucide-react';
import { ToolInfo } from '@/types';

interface ToolLayoutProps {
  tool: ToolInfo;
  children: React.ReactNode;
  controls?: React.ReactNode;
  actionPrimary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };
  actionSecondary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
  };
  faqItems?: Array<{ question: string; answer: string }>;
  features?: Array<{ title: string; description: string }>;
}

export function ToolLayout({
  tool,
  children,
  controls,
  actionPrimary,
  actionSecondary,
  faqItems,
  features,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen pt-6 sm:pt-8 pb-20">
      {/* Tool Header Section */}
      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </Link>
          <span className="text-[var(--text-muted)] text-xs">/</span>
          <span className="text-xs uppercase font-mono tracking-wider text-[var(--brand)] font-semibold">
            {tool.category}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 pb-6 border-b border-[var(--border)]">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {tool.title}
              </h1>
              {tool.badge && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-[var(--text-secondary)] leading-relaxed">
              {tool.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] text-xs font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero Server Uploads • 100% In-Memory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tool Interactive Grid */}
      <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Stage (Preview, Canvas, Dropzone) */}
          <div className={controls ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 space-y-6'}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 sm:p-7 backdrop-blur-xl shadow-sm">
              {children}
            </div>

            {/* Quick Actions Bar */}
            {(actionPrimary || actionSecondary) && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xs">
                <div className="flex items-center gap-2">
                  {actionSecondary && (
                    <button
                      onClick={actionSecondary.onClick}
                      disabled={actionSecondary.disabled}
                      className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-surface)] transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
                    >
                      {actionSecondary.icon || <RefreshCw className="w-4 h-4" />}
                      <span>{actionSecondary.label}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {actionPrimary && (
                    <button
                      onClick={actionPrimary.onClick}
                      disabled={actionPrimary.disabled || actionPrimary.loading}
                      className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
                    >
                      {actionPrimary.icon || <Download className="w-4 h-4" />}
                      <span>
                        {actionPrimary.loading ? 'Processing...' : actionPrimary.label}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings & Options Sidebar */}
          {controls && (
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 sm:p-6 backdrop-blur-xl shadow-sm sticky top-28">
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--brand)]" />
                  <span>Options & Settings</span>
                </h3>
                {controls}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO & Educational Content Section */}
      {(features || faqItems) && (
        <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 pt-12 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {features && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Key Capabilities
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {features.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-1 shadow-xs"
                    >
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {faqItems && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {faqItems.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-1.5 shadow-xs"
                    >
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
