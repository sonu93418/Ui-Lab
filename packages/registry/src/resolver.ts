import type { RegistryEntry, ThemeEntry } from './index.js';
import { COMPONENTS_REGISTRY } from './data/components.js';
import { SECTIONS_REGISTRY } from './data/sections.js';
import { THEMES_REGISTRY } from './data/themes.js';

const ALL_ENTRIES = [...COMPONENTS_REGISTRY, ...SECTIONS_REGISTRY];

// ─── Resolve Component ───────────────────────────────────────────────────────

export function resolveComponent(slug: string): RegistryEntry | null {
  return COMPONENTS_REGISTRY.find((c) => c.slug === slug) ?? null;
}

// ─── Resolve Section ─────────────────────────────────────────────────────────

export function resolveSection(slug: string): RegistryEntry | null {
  return SECTIONS_REGISTRY.find((s) => s.slug === slug) ?? null;
}

// ─── Resolve Theme ───────────────────────────────────────────────────────────

export function resolveTheme(slug: string): ThemeEntry | null {
  return THEMES_REGISTRY.find((t) => t.slug === slug) ?? null;
}

// ─── Resolve Any ─────────────────────────────────────────────────────────────

export function resolveEntry(slug: string): RegistryEntry | null {
  return ALL_ENTRIES.find((e) => e.slug === slug) ?? null;
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function searchRegistry(query: string): RegistryEntry[] {
  const q = query.toLowerCase();
  return ALL_ENTRIES.filter(
    (e) =>
      e.slug.includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.tags.some((t) => t.includes(q)) ||
      e.category.includes(q)
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

export function listRegistry(
  type?: 'component' | 'section' | 'primitive' | 'all'
): RegistryEntry[] {
  if (!type || type === 'all') return ALL_ENTRIES;
  if (type === 'component') return COMPONENTS_REGISTRY.filter((c) => c.type === 'component');
  if (type === 'primitive') return COMPONENTS_REGISTRY.filter((c) => c.type === 'primitive');
  if (type === 'section') return SECTIONS_REGISTRY;
  return ALL_ENTRIES;
}
