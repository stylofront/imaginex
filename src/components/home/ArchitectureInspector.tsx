'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Cpu, 
  WifiOff, 
  Zap, 
  Server, 
  Laptop, 
  Lock,
  ArrowRight,
  Database,
  CloudOff
} from 'lucide-react';

export function ArchitectureInspector() {
  const [activeTab, setActiveTab] = useState<'imaginex' | 'cloud'>('imaginex');
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(true);

  const runMockAudit = () => {
    setAuditRunning(true);
    setAuditComplete(false);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditComplete(true);
    }, 1200);
  };

  return (
    <section className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-4 border border-[var(--brand)]/20">
          <Terminal className="w-3.5 h-3.5" />
          <span>Architectural Integrity</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
          How Local In-Memory Processing{' '}
          <span className="bg-gradient-to-r from-[var(--brand)] to-[var(--accent-pink)] bg-clip-text text-transparent">
            Beats Cloud Uploads.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Most online image tools quietly upload your sensitive photos, IDs, and designs to third-party cloud servers. Imaginex executes entirely within your browser&apos;s sandboxed V8 runtime.
        </p>
      </div>

      {/* Main Comparative Container */}
      <div className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-sm overflow-hidden">
        {/* Architecture Mode Selector */}
        <div className="p-3 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-center">
          <div className="inline-flex p-1 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('imaginex')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'imaginex'
                  ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Imaginex In-Memory Architecture (Zero Cloud)</span>
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'cloud'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Traditional Cloud Converters (Legacy)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Diagram Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Diagram Visualization: 7 cols */}
          <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border)] relative flex flex-col justify-between">
            {activeTab === 'imaginex' ? (
              // Imaginex Engine Architecture
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs text-emerald-500 font-bold uppercase tracking-wider">
                      Zero-Egress Sandboxed Pipeline
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Offline Capable
                  </span>
                </div>

                {/* Visual Step Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                  {/* Step 1 */}
                  <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-emerald-500/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mb-1">Local RAM</div>
                    <div className="text-[10px] text-[var(--text-muted)]">File loaded directly into browser ArrayBuffer</div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--brand)]/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center mx-auto mb-2.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mb-1">WebAssembly</div>
                    <div className="text-[10px] text-[var(--text-muted)]">C++/Rust compiled SIMD transformation</div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--accent)]/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto mb-2.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mb-1">Web Workers</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Non-blocking parallel threads (0ms UI lag)</div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-emerald-500/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)] mb-1">RAM Wiped</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Clean blob emitted, memory auto-garbage collected</div>
                  </div>
                </div>

                {/* Architecture Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-[var(--text-primary)] block">Zero Network Packets</strong>
                      <span className="text-[var(--text-secondary)]">Turn on airplane mode or disconnect Wi-Fi. Imaginex will still work 100%.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-[var(--text-primary)] block">Unlimited File Sizes & Batches</strong>
                      <span className="text-[var(--text-secondary)]">No artificial limits, cloud server fees, or wait queues.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Legacy Cloud Converter Architecture
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-mono text-xs text-rose-500 font-bold uppercase tracking-wider">
                      Third-Party Cloud Pipeline (Vulnerable)
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    High Privacy Risk
                  </span>
                </div>

                {/* Visual Step Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                  {/* Step 1 */}
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2.5">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-rose-300 mb-1">1. Full Upload</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Raw 20MB image sent across public web</div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2.5">
                      <Database className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-rose-300 mb-1">2. Stored on Disk</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Temporary files written to remote hosting servers</div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2.5">
                      <Server className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-rose-300 mb-1">3. Server Queue</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Wait 15-45 seconds for CPU slot allocation</div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/30 text-center relative group">
                    <div className="w-9 h-9 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-rose-300 mb-1">4. Paywalls & Ads</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Blocked after 2 files unless you buy $15/mo plan</div>
                  </div>
                </div>

                {/* Cloud Risks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-rose-300 block">Data Snooping & IP Logs</strong>
                      <span className="text-[var(--text-secondary)]">Sensitive passport scans, medical records, or company prototypes stored on foreign disks.</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-rose-300 block">Bandwidth Throttling</strong>
                      <span className="text-[var(--text-secondary)]">Uploading large batches takes minutes and burns mobile data plans.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Simulated Chrome Network Tab Auditor: 5 cols */}
          <div className="lg:col-span-5 p-6 bg-[var(--bg-secondary)] flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[var(--text-primary)] font-bold text-xs">Network Egress Auditor</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  DEVTOOLS VERIFIED
                </span>
              </div>

              {/* Console log outputs */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[#080B14] border border-[var(--border)] text-[11px] leading-relaxed overflow-x-auto text-[var(--text-secondary)]">
                <div className="text-emerald-400 font-semibold">[KERNEL] Imaginex In-Browser Engine v2.4 initialized</div>
                <div className="text-blue-400">[HARDWARE] SIMD WebAssembly acceleration: DETECTED</div>
                <div className="text-[var(--text-muted)]">[THREADS] Multi-Core Workers: 8 logical threads spawned</div>
                <div className="text-purple-400">[MEMORY] V8 ArrayBuffer heap allocation: 0.00 MB leaked</div>
                <div className="text-emerald-300 flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[NETWORK EGRESS] 0 HTTP requests sent (Zero Cloud Traffic)</span>
                </div>
                {auditRunning && (
                  <div className="text-amber-400 animate-pulse">
                    ⚡ Auditing network stack packets...
                  </div>
                )}
                {auditComplete && (
                  <div className="text-emerald-400 font-bold">
                    ✅ AUDIT PASSED: 100% Client-Side Privacy Guarantee
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Third-Party Tracking:</span>
                <span className="text-emerald-400 font-bold">NONE (0 Scripts)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Image Retention Time:</span>
                <span className="text-emerald-400 font-bold">0 Seconds (In-RAM Only)</span>
              </div>

              <button
                onClick={runMockAudit}
                disabled={auditRunning}
                className="w-full py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--brand)]/20 border border-[var(--border)] hover:border-[var(--brand)]/50 text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>{auditRunning ? 'Running Packet Verification...' : 'Run Network Stack Verification'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
