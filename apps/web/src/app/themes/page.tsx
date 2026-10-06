'use client';

import React, { useState } from 'react';
import { Palette, Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface ThemeDefinition {
  name: string;
  slug: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    muted: string;
    accent: string;
    border: string;
  };
  radius: string;
}

const THEMES: ThemeDefinition[] = [
  {
    name: 'Zinc',
    slug: 'zinc',
    description: 'Crisp industrial neutral shades with true black backgrounds and refined high-contrast borders.',
    colors: {
      background: '#09090b',
      foreground: '#fafafa',
      primary: '#18181b',
      muted: '#27272a',
      accent: '#27272a',
      border: '#27272a',
    },
    radius: '0.5rem',
  },
  {
    name: 'Violet',
    slug: 'violet',
    description: 'Modern developer electric purple tones with deep galactic indigo hues.',
    colors: {
      background: '#0a0a0f',
      foreground: '#f3f4f6',
      primary: '#7c3aed',
      muted: '#1e1b4b',
      accent: '#6366f1',
      border: '#2e1065',
    },
    radius: '0.625rem',
  },
  {
    name: 'Emerald',
    slug: 'emerald',
    description: 'Organic lush green tones crafted for financial dashboards, climate tech, and analytics.',
    colors: {
      background: '#022c22',
      foreground: '#ecfdf5',
      primary: '#059669',
      muted: '#064e3b',
      accent: '#10b981',
      border: '#065f46',
    },
    radius: '0.5rem',
  },
  {
    name: 'Cyberpunk',
    slug: 'cyberpunk',
    description: 'High-voltage neon cyan and magenta designed for gaming platforms and futuristic interfaces.',
    colors: {
      background: '#0d0d14',
      foreground: '#ffffff',
      primary: '#00f0ff',
      muted: '#1b1b2f',
      accent: '#ff007f',
      border: '#2a2a4a',
    },
    radius: '0.25rem',
  },
  {
    name: 'Amber',
    slug: 'amber',
    description: 'Warm, radiant golden accents designed for luxury and editorial web applications.',
    colors: {
      background: '#1c1917',
      foreground: '#fef3c7',
      primary: '#d97706',
      muted: '#292524',
      accent: '#f59e0b',
      border: '#44403c',
    },
    radius: '0.5rem',
  },
  {
    name: 'Rose',
    slug: 'rose',
    description: 'Vibrant crimson and blush tones for consumer applications and lifestyle products.',
    colors: {
      background: '#1a050d',
      foreground: '#ffe4e6',
      primary: '#e11d48',
      muted: '#3b0717',
      accent: '#f43f5e',
      border: '#4c0519',
    },
    radius: '0.75rem',
  },
];

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeDefinition>(THEMES[1]); // Default Violet
  const [copied, setCopied] = useState<string | null>(null);

  const getCssString = (t: ThemeDefinition) => {
    return `:root {
  --background: ${t.colors.background};
  --foreground: ${t.colors.foreground};
  --primary: ${t.colors.primary};
  --muted: ${t.colors.muted};
  --accent: ${t.colors.accent};
  --border: ${t.colors.border};
  --radius: ${t.radius};
}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Design Token Themes</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          Switch themes effortlessly. Injected as CSS custom properties with full Tailwind CSS support.
        </p>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map((theme) => {
          const isSelected = selectedTheme.slug === theme.slug;
          return (
            <div
              key={theme.slug}
              onClick={() => setSelectedTheme(theme)}
              className={`glass-panel p-6 rounded-2xl cursor-pointer border transition-all ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
                  : 'border-border/70 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white text-base">{theme.name}</span>
                {isSelected && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Active Preview
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-5">{theme.description}</p>

              {/* Swatches */}
              <div className="flex items-center gap-2">
                {Object.entries(theme.colors).map(([key, hex]) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded-full border border-white/10 shadow-inner"
                    style={{ backgroundColor: hex }}
                    title={`${key}: ${hex}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview Panel for selected theme */}
      <div className="glass-panel p-8 rounded-3xl border border-border/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <span className="text-xs font-mono uppercase text-indigo-400">Live Preview</span>
            <h2 className="text-2xl font-bold text-white mt-1">{selectedTheme.name} Theme</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCopy(`npx uigen theme apply ${selectedTheme.slug}`, 'cmd')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-border text-xs text-white font-mono hover:bg-zinc-800 transition-all"
            >
              {copied === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-indigo-400" />}
              npx uigen theme apply {selectedTheme.slug}
            </button>
            <button
              onClick={() => handleCopy(getCssString(selectedTheme), 'css')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium shadow-md transition-all"
            >
              {copied === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy CSS Tokens
            </button>
          </div>
        </div>

        {/* Dynamic theme preview box */}
        <div
          className="p-8 rounded-2xl border transition-all space-y-6"
          style={{
            backgroundColor: selectedTheme.colors.background,
            borderColor: selectedTheme.colors.border,
            color: selectedTheme.colors.foreground,
            borderRadius: selectedTheme.radius,
          }}
        >
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Theme Sandbox</h3>
            <p className="text-sm opacity-80">This container dynamically adapts to the selected design tokens.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              className="px-4 py-2 font-semibold text-xs transition-all shadow-md active:scale-95"
              style={{
                backgroundColor: selectedTheme.colors.primary,
                color: selectedTheme.slug === 'zinc' ? '#ffffff' : '#ffffff',
                borderRadius: selectedTheme.radius,
              }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 font-semibold text-xs border transition-all"
              style={{
                borderColor: selectedTheme.colors.border,
                backgroundColor: selectedTheme.colors.muted,
                borderRadius: selectedTheme.radius,
              }}
            >
              Secondary Button
            </button>
            <span
              className="px-3 py-1 text-xs font-medium border"
              style={{
                borderColor: selectedTheme.colors.accent,
                borderRadius: selectedTheme.radius,
              }}
            >
              Accent Tag
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
