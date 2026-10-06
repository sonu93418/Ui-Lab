import { z } from 'zod';

// ─── Registry Entry Schema ───────────────────────────────────────────────────

export const RegistryEntrySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  type: z.enum(['primitive', 'component', 'section', 'layout', 'page', 'template', 'theme']),
  category: z.string(),
  frameworks: z.array(z.string()).default(['next', 'react']),
  language: z.array(z.string()).default(['typescript']),
  styling: z.string().default('tailwind'),
  version: z.string().default('1.0.0'),
  variants: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string().optional(),
      template: z.string().optional(),
    })
  ),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'deprecated']).default('published'),
  previewUrl: z.string().optional(),
  documentationUrl: z.string().optional(),
});

export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;

// ─── Theme Entry Schema ──────────────────────────────────────────────────────

export const ThemeEntrySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  tokens: z.object({
    colors: z.record(z.string()),
    typography: z.record(z.string()).optional(),
    spacing: z.record(z.string()).optional(),
    radius: z.record(z.string()).optional(),
    shadows: z.record(z.string()).optional(),
  }),
  supportsDarkMode: z.boolean().default(true),
  status: z.enum(['draft', 'published', 'deprecated']).default('published'),
});

export type ThemeEntry = z.infer<typeof ThemeEntrySchema>;

// ─── Registry ────────────────────────────────────────────────────────────────

export { COMPONENTS_REGISTRY } from './data/components.js';
export { SECTIONS_REGISTRY } from './data/sections.js';
export { THEMES_REGISTRY } from './data/themes.js';

export {
  resolveComponent,
  resolveSection,
  resolveTheme,
  resolveEntry,
  searchRegistry,
  listRegistry,
} from './resolver.js';
