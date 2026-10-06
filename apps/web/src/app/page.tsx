'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Code2,
  Cpu,
  Layers,
  Palette,
  CheckCircle2,
  Zap,
  Sliders,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'init' | 'add' | 'create'>('add');
  const [activeTheme, setActiveTheme] = useState('zinc');
  const [btnVariant, setBtnVariant] = useState<'default' | 'outline' | 'ghost'>('default');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const commands = {
    init: 'npx uigen init',
    add: 'npx uigen add button modal navbar',
    create: 'npx uigen create',
  };

  return (
    <div className="space-y-24 pb-20">
      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 shadow-sm shadow-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>v0.1.0 Released — CLI-First UI Generation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Choose. Generate.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            Own the Source.
          </span>{' '}
          Ship Fast.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
          The developer-first UI platform that generates production-grade, accessible React components and full sections directly into your codebase. No lock-in. No bloated npm dependencies.
        </p>

        {/* CLI Quick Action Banner */}
        <div className="max-w-xl mx-auto">
          <div className="glass-panel p-2 rounded-2xl flex items-center justify-between border border-border/80 shadow-2xl">
            <div className="flex items-center gap-3 px-3 py-1 font-mono text-sm text-indigo-300">
              <span className="text-muted-foreground">$</span>
              <span>npx uigen init</span>
            </div>
            <button
              onClick={() => copyToClipboard('npx uigen init')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              {copiedCmd === 'npx uigen init' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Command
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
          >
            Browse 25+ Components & Sections
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/80 bg-zinc-900/60 hover:bg-zinc-800 text-white font-semibold text-sm transition-all"
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            CLI Guide
          </Link>
        </div>

        {/* ─── Interactive Terminal Emulator ──────────────────────────────── */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/80 bg-zinc-950/90 shadow-2xl overflow-hidden text-left">
            {/* Terminal Topbar */}
            <div className="px-4 py-3 bg-zinc-900/80 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-muted-foreground">bash ~ /my-app</span>
              </div>
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-border/60 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('init')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'init' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  init
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'add' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  add
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeTab === 'create' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  create
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <span>❯</span>
                  <span className="text-zinc-200">{commands[activeTab]}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(commands[activeTab])}
                  className="text-xs text-muted-foreground hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>

              {activeTab === 'init' && (
                <div className="space-y-1.5 text-xs text-zinc-300">
                  <p className="text-emerald-400">✔ Detected Next.js App Router (TypeScript + Tailwind CSS)</p>
                  <p className="text-indigo-300">? Which color theme would you like to use? › Violet</p>
                  <p className="text-indigo-300">? Enable dark mode support? › Yes</p>
                  <p className="text-indigo-300">? Configure UI component alias? › @/components/ui</p>
                  <p className="text-zinc-400 pt-2">Created uigen.json</p>
                  <p className="text-zinc-400">Injected CSS custom properties into app/globals.css</p>
                  <p className="text-emerald-400 font-semibold pt-1">✨ Initialization complete! Ready to add components.</p>
                </div>
              )}

              {activeTab === 'add' && (
                <div className="space-y-1.5 text-xs text-zinc-300">
                  <p className="text-zinc-400">Installing required packages: class-variance-authority, clsx, tailwind-merge...</p>
                  <p className="text-emerald-400">✔ Added component: components/ui/button.tsx</p>
                  <p className="text-emerald-400">✔ Added component: components/ui/modal.tsx</p>
                  <p className="text-emerald-400">✔ Added section: components/sections/navbar.tsx</p>
                  <p className="text-indigo-300 pt-2">All files generated with TypeScript types and Tailwind tokens.</p>
                  <p className="text-zinc-400">You can now import directly into your page!</p>
                </div>
              )}

              {activeTab === 'create' && (
                <div className="space-y-1.5 text-xs text-zinc-300">
                  <p className="text-indigo-300">? Select page template to generate: › Landing Page</p>
                  <p className="text-indigo-300">? Select sections to include: › [Navbar, Hero, Features, Pricing, Footer]</p>
                  <p className="text-emerald-400">✔ Generated full page at app/landing/page.tsx</p>
                  <p className="text-emerald-400">✔ Generated 5 composing sections</p>
                  <p className="text-emerald-400 font-semibold pt-1">🚀 Run `pnpm dev` to preview your generated page.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Key Value Pillars ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Why Developers Choose UIGen</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Built for modern engineering teams who value code ownership, design flexibility, and zero bundle bloat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-indigo-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">100% Code Ownership</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Components are written directly into your project files. You can modify every line of JSX, change props, and customize styles freely without waiting for third-party upstream PRs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-violet-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Zero Runtime Overhead</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No complex styling runtime wrappers. All generated components leverage native Tailwind CSS utilities and lightweight primitives for blazingly fast bundle sizes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Decoupled Architecture</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clean separation of concerns with a dedicated CLI package, independent REST backend API, unified design token registry, and customizable theme engine.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Live Component & Theme Playground ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-border/80 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <span className="text-xs uppercase font-mono text-indigo-400 font-semibold">Interactive Sandbox</span>
              <h2 className="text-2xl font-bold text-white mt-1">Live Component & Theme Preview</h2>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-xl border border-border/60">
              <Palette className="w-4 h-4 text-muted-foreground ml-2" />
              <button
                onClick={() => setActiveTheme('zinc')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  activeTheme === 'zinc' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Zinc
              </button>
              <button
                onClick={() => setActiveTheme('violet')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  activeTheme === 'violet' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Violet
              </button>
              <button
                onClick={() => setActiveTheme('emerald')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  activeTheme === 'emerald' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Emerald
              </button>
            </div>
          </div>

          {/* Interactive Playground Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Button Playground */}
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Button Primitive</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  slug: button
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Multi-variant accessible button with loading and size options.</p>

              {/* Variant toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setBtnVariant('default')}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    btnVariant === 'default' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setBtnVariant('outline')}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    btnVariant === 'outline' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  Outline
                </button>
                <button
                  onClick={() => setBtnVariant('ghost')}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    btnVariant === 'ghost' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  Ghost
                </button>
              </div>

              {/* Preview Box */}
              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-center min-h-[100px]">
                {btnVariant === 'default' && (
                  <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95">
                    Primary Action
                  </button>
                )}
                {btnVariant === 'outline' && (
                  <button className="px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-medium text-xs hover:bg-white/5 transition-all">
                    Outline Action
                  </button>
                )}
                {btnVariant === 'ghost' && (
                  <button className="px-4 py-2 rounded-lg text-zinc-300 hover:text-white font-medium text-xs hover:bg-white/10 transition-all">
                    Ghost Action
                  </button>
                )}
              </div>
            </div>

            {/* 2. Badge & Status Card */}
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Badge & Status</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  slug: badge
                </span>
              </div>
              <p className="text-xs text-muted-foreground">High visibility status chips with semantic states.</p>

              <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-wrap gap-2.5 items-center justify-center min-h-[100px]">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Active
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Deprecated
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Draft
                </span>
              </div>
            </div>

            {/* 3. Metric Card Preview */}
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Stats Metric Card</span>
                <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  slug: stats-card
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Dashboard metric display with trend indicators.</p>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Monthly Active CLI Users</span>
                  <span className="text-emerald-400 font-medium">+24.5%</span>
                </div>
                <div className="text-2xl font-bold text-white">48,290</div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ready to Build CTA ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="glass-panel p-10 md:p-14 rounded-3xl border border-indigo-500/30 relative overflow-hidden">
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your Frontend Workflow?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Initialize UIGen in your existing Next.js or React project in less than 30 seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
              >
                Read CLI Documentation
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/components"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/80 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm transition-all"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
