import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Clock, Calendar, ArrowLeft, ArrowRight, Sparkles, User, Tag, ExternalLink } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: 'Article Not Found — Imaginex' };

  return {
    title: `${post.title} | Imaginex Blog`,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://imaginex.styloshare.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['https://www.styloshare.com'],
      images: ['/seo-image.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: ['/seo-image.webp'],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Styloshare Team',
      url: 'https://www.styloshare.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Imaginex Studio',
      url: 'https://imaginex.styloshare.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://imaginex.styloshare.com/logo.webp',
      },
    },
  };

  return (
    <article className="min-h-screen pt-8 sm:pt-12 pb-24">
      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4 mb-10 pb-8 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
            <span className="px-2.5 py-0.5 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.18]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-[var(--text-muted)]">
            <span>Authored by</span>
            <a
              href="https://www.styloshare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--brand)] hover:underline flex items-center gap-0.5"
            >
              <span>Styloshare Engineering</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Interactive In-Article Tool Banner */}
        <div className="mb-10 p-5 rounded-xl bg-gradient-to-r from-[var(--brand)]/12 via-[var(--bg-secondary)] to-[var(--accent)]/12 border border-[var(--brand)]/25 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--brand)] font-bold">
              Related 100% Client-Side Tool
            </span>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              {post.recommendedTool.title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Process unlimited photos directly in your browser. 0 bytes uploaded.
            </p>
          </div>

          <Link
            href={post.recommendedTool.href}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-sm shadow-[var(--brand)]/20"
          >
            <span>{post.recommendedTool.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          {post.content.split('\n\n').map((block, idx) => {
            const trimmed = block.trim();
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight pt-6 pb-1 border-b border-[var(--border)]">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-base sm:text-lg font-bold text-[var(--text-primary)] pt-3">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('* ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().startsWith('* '));
              return (
                <ul key={idx} className="space-y-2 pl-4 list-disc marker:text-[var(--brand)]">
                  {items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item.replace('* ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
                  ))}
                </ul>
              );
            }
            if (trimmed.startsWith('|')) {
              // Markdown table render
              const lines = trimmed.split('\n').filter(Boolean);
              if (lines.length > 2) {
                const headers = lines[0].split('|').map((h) => h.trim()).filter(Boolean);
                const rows = lines.slice(2).map((row) => row.split('|').map((c) => c.trim()).filter(Boolean));
                return (
                  <div key={idx} className="overflow-x-auto my-6 rounded-lg border border-[var(--border)]">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)] font-mono text-[11px] uppercase text-[var(--text-muted)]">
                        <tr>
                          {headers.map((h, hi) => (
                            <th key={hi} className="p-3 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-tertiary)]/30">
                        {rows.map((r, ri) => (
                          <tr key={ri} className="hover:bg-[var(--bg-secondary)]/50">
                            {r.map((c, ci) => (
                              <td key={ci} className="p-3" dangerouslySetInnerHTML={{ __html: c.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
            }
            if (trimmed.startsWith('```')) {
              const code = trimmed.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
              return (
                <pre key={idx} className="p-4 rounded-lg bg-[#070914] border border-[var(--border)] font-mono text-xs overflow-x-auto text-[var(--text-primary)]">
                  <code>{code}</code>
                </pre>
              );
            }
            return (
              <p
                key={idx}
                dangerouslySetInnerHTML={{
                  __html: trimmed
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--brand)] hover:underline font-semibold">$1</a>'),
                }}
              />
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Topics:</span>
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-[var(--brand)]/15 via-[var(--bg-secondary)] to-[var(--accent)]/15 border border-[var(--border)] text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Experience 100% In-Memory Image Transformation
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Zero cloud uploads. Zero subscriptions. Every calculation executes in your browser memory via WebAssembly.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-[var(--brand)]/20 transition-all hover:scale-[1.02]"
            >
              Open Studio Cockpit
            </Link>
            <Link
              href={post.recommendedTool.href}
              className="px-6 py-2.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] font-semibold text-xs sm:text-sm transition-all"
            >
              {post.recommendedTool.title}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
