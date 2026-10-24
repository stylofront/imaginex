import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Sparkles, Calendar, Clock, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Technical Image Guides & Web Performance Blog | Imaginex',
  description: 'Deep technical tutorials, benchmarks, and guides on client-side image transformation, WebAssembly, AVIF vs WebP, and privacy architecture by Styloshare Team.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Technical Image Guides & Web Performance Blog | Imaginex',
    description: 'Deep technical tutorials and benchmarks on WebAssembly, AVIF vs WebP, and privacy architecture.',
    url: 'https://imaginex.styloshare.com/blog',
    images: ['/seo-image.webp'],
  },
};

export default function BlogIndexPage() {
  const posts = Object.values(BLOG_POSTS);

  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-24">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Engineering Insights & Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
            Image Optimization & Privacy Engineering
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            In-depth benchmarks, tutorials, and technical explainers on modern web image formats, Core Web Vitals, and zero-cloud WebAssembly architecture.
          </p>
        </div>

        {/* Featured Post (First post) */}
        {posts[0] && (
          <div className="mb-12">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group block p-7 sm:p-10 rounded-xl bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--brand)]/50 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)] mb-4">
                <span className="px-2.5 py-0.5 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] font-bold uppercase tracking-wider">
                  Featured Guide
                </span>
                <span className="text-[var(--text-secondary)]">{posts[0].category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {posts[0].readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors mb-3 leading-tight">
                {posts[0].title}
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-6">
                {posts[0].excerpt}
              </p>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--brand)] group-hover:text-[var(--accent)] transition-colors">
                <span>Read Full Technical Guide</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--brand)]/50 transition-all duration-200 hover:shadow-lg shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-3">
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--brand)] font-semibold text-[10px] uppercase">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors mb-2.5 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--brand)] group-hover:text-[var(--accent)] transition-colors">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Author Footer */}
        <div className="mt-16 text-center text-xs text-[var(--text-muted)]">
          <p>
            Published with high standards by the{' '}
            <a
              href="https://www.styloshare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand)] hover:underline font-semibold"
            >
              Styloshare Engineering Team
            </a>
            . 100% In-Browser. Zero Server Uploads.
          </p>
        </div>
      </div>
    </div>
  );
}
