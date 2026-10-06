'use client';

import React, { useState } from 'react';
import {
  Search,
  Box,
  Layers,
  Copy,
  Check,
  Code2,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface ComponentItem {
  name: string;
  slug: string;
  type: 'primitive' | 'component' | 'section';
  category: string;
  description: string;
  dependencies: string[];
  variants: string[];
  downloadCount: number;
}

const ALL_COMPONENTS: ComponentItem[] = [
  // Primitives
  {
    name: 'Button',
    slug: 'button',
    type: 'primitive',
    category: 'ui',
    description: 'Versatile button with variants (default, outline, ghost, destructive, link) and loading spinners.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    variants: ['default', 'outline', 'ghost', 'destructive'],
    downloadCount: 342,
  },
  {
    name: 'Input',
    slug: 'input',
    type: 'primitive',
    category: 'ui',
    description: 'Accessible input field with floating label, left/right icon slots, and error helper text.',
    dependencies: ['clsx', 'tailwind-merge'],
    variants: ['default', 'filled', 'underline'],
    downloadCount: 289,
  },
  {
    name: 'Badge',
    slug: 'badge',
    type: 'primitive',
    category: 'ui',
    description: 'Status badge and chips supporting solid, outline, success, and destructive variants.',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    variants: ['default', 'outline', 'secondary', 'destructive', 'success'],
    downloadCount: 195,
  },
  {
    name: 'Avatar',
    slug: 'avatar',
    type: 'primitive',
    category: 'ui',
    description: 'User avatar component with image fallback initials and status presence dot.',
    dependencies: ['clsx', 'tailwind-merge'],
    variants: ['default', 'square', 'ring'],
    downloadCount: 140,
  },
  {
    name: 'Skeleton',
    slug: 'skeleton',
    type: 'primitive',
    category: 'ui',
    description: 'Pulsing placeholder loader for text, cards, and list elements while fetching async data.',
    dependencies: ['clsx', 'tailwind-merge'],
    variants: ['default', 'card', 'list'],
    downloadCount: 168,
  },
  {
    name: 'Select',
    slug: 'select',
    type: 'primitive',
    category: 'ui',
    description: 'Accessible select dropdown with customizable option items and placeholder.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default', 'ghost'],
    downloadCount: 215,
  },

  // Components
  {
    name: 'Card',
    slug: 'card',
    type: 'component',
    category: 'layout',
    description: 'Flexible card container with CardHeader, CardTitle, CardContent, and CardFooter.',
    dependencies: ['clsx', 'tailwind-merge'],
    variants: ['default', 'bordered', 'ghost', 'elevated'],
    downloadCount: 412,
  },
  {
    name: 'Modal',
    slug: 'modal',
    type: 'component',
    category: 'overlay',
    description: 'Animated modal dialog with overlay backdrop, focus trap, and keyboard Escape handling.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default', 'glass', 'fullscreen'],
    downloadCount: 310,
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    type: 'component',
    category: 'navigation',
    description: 'Tab navigation system with animated indicators, pill shapes, and keyboard controls.',
    dependencies: ['clsx', 'tailwind-merge'],
    variants: ['default', 'pills', 'underline', 'boxed'],
    downloadCount: 220,
  },
  {
    name: 'Toast',
    slug: 'toast',
    type: 'component',
    category: 'feedback',
    description: 'Toast notification queue with provider, auto-dismiss timers, and action buttons.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default', 'success', 'error', 'warning'],
    downloadCount: 260,
  },
  {
    name: 'Dropdown',
    slug: 'dropdown',
    type: 'component',
    category: 'navigation',
    description: 'Dropdown menu with dividers, icons, shortcut keys, and chevron indicators.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default', 'compact', 'wide'],
    downloadCount: 180,
  },
  {
    name: 'Sidebar',
    slug: 'sidebar',
    type: 'component',
    category: 'layout',
    description: 'Collapsible application sidebar with brand badge, route links, and collapse toggle.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default', 'compact', 'floating'],
    downloadCount: 295,
  },
  {
    name: 'StatsCard',
    slug: 'stats-card',
    type: 'component',
    category: 'data',
    description: 'Metric statistic card with KPI figure, percentage delta badge, and icon highlight.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default', 'compact', 'gradient'],
    downloadCount: 330,
  },

  // Sections
  {
    name: 'Navbar',
    slug: 'navbar',
    type: 'section',
    category: 'sections',
    description: 'Complete responsive navigation bar with mobile drawer toggle and auth CTA buttons.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default'],
    downloadCount: 520,
  },
  {
    name: 'Hero',
    slug: 'hero',
    type: 'section',
    category: 'sections',
    description: 'High-converting hero section with announcement pill, gradient headings, and visual demo frame.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default'],
    downloadCount: 680,
  },
  {
    name: 'Features',
    slug: 'features',
    type: 'section',
    category: 'sections',
    description: 'Six-item feature matrix showcasing benefits with hover gradients and iconography.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default'],
    downloadCount: 440,
  },
  {
    name: 'Pricing',
    slug: 'pricing',
    type: 'section',
    category: 'sections',
    description: 'Three-tier pricing table with Monthly/Annual discount billing switch and feature checks.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default'],
    downloadCount: 512,
  },
  {
    name: 'Testimonials',
    slug: 'testimonials',
    type: 'section',
    category: 'sections',
    description: 'Customer review quotes grid with star ratings, avatar photos, and company titles.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default'],
    downloadCount: 310,
  },
  {
    name: 'Footer',
    slug: 'footer',
    type: 'section',
    category: 'sections',
    description: 'Four-column site footer with newsletter subscription, legal links, and social media icons.',
    dependencies: ['clsx', 'tailwind-merge', 'lucide-react'],
    variants: ['default'],
    downloadCount: 380,
  },
];

export default function ComponentsPage() {
  const [filterType, setFilterType] = useState<'all' | 'primitive' | 'component' | 'section'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filtered = ALL_COMPONENTS.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`npx uigen add ${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Component Registry</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          Explore all UI primitives, composite components, and full landing sections. Injected straight into your repository via the UIGen CLI.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search components, sections, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-border/80 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-border/80">
          {(['all', 'primitive', 'component', 'section'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Items' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.slug}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-border/70 hover:border-indigo-500/50 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {item.name}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                    item.type === 'primitive'
                      ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                      : item.type === 'component'
                      ? 'border-violet-500/30 bg-violet-500/10 text-violet-400'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Dependencies badge */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.dependencies.slice(0, 2).map((dep) => (
                  <span
                    key={dep}
                    className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded"
                  >
                    {dep}
                  </span>
                ))}
                {item.dependencies.length > 2 && (
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    +{item.dependencies.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Copy Action */}
            <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[170px]">
                $ npx uigen add {item.slug}
              </span>
              <button
                onClick={() => handleCopy(item.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition-all active:scale-95"
              >
                {copiedSlug === item.slug ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground text-sm">No components found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            className="text-xs text-indigo-400 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
