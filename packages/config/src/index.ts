import { z } from 'zod';
import path from 'path';
import { fs } from '@uigen/utils';

// ─── Schema ──────────────────────────────────────────────────────────────────

export const UIGenConfigSchema = z.object({
  /** Target framework */
  framework: z.enum(['next', 'react', 'vite']).default('next'),

  /** Language */
  language: z.enum(['typescript', 'javascript']).default('typescript'),

  /** CSS framework */
  styling: z.enum(['tailwind', 'css']).default('tailwind'),

  /** Active design theme */
  theme: z.string().default('modern'),

  /** Dark mode strategy */
  darkMode: z.enum(['light', 'dark', 'system']).default('system'),

  /** Icon library */
  icons: z.enum(['lucide', 'heroicons', 'none']).default('lucide'),

  /** Enable animations */
  animations: z.boolean().default(true),

  /** Package manager preference */
  packageManager: z.enum(['npm', 'pnpm', 'yarn', 'bun']).default('npm'),

  /** Output paths */
  paths: z
    .object({
      components: z.string().default('src/components/ui'),
      sections: z.string().default('src/components/sections'),
      layouts: z.string().default('src/components/layouts'),
      pages: z.string().default('src/app'),
      styles: z.string().default('src/styles'),
    })
    .default({}),

  /** Registry API endpoint */
  registry: z.string().url().optional(),

  /** CLI version that initialized */
  cliVersion: z.string().optional(),
});

export type UIGenConfig = z.infer<typeof UIGenConfigSchema>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: UIGenConfig = UIGenConfigSchema.parse({});

// ─── Config file name ────────────────────────────────────────────────────────

export const CONFIG_FILENAME = 'uigen.config.json';

// ─── Load ────────────────────────────────────────────────────────────────────

export async function loadConfig(cwd: string = process.cwd()): Promise<UIGenConfig | null> {
  const configPath = path.join(cwd, CONFIG_FILENAME);
  const exists = await fs.exists(configPath);
  if (!exists) return null;

  try {
    const raw = await fs.readJson<unknown>(configPath);
    return UIGenConfigSchema.parse(raw);
  } catch {
    return null;
  }
}

// ─── Save ────────────────────────────────────────────────────────────────────

export async function saveConfig(cwd: string, config: UIGenConfig): Promise<void> {
  const configPath = path.join(cwd, CONFIG_FILENAME);
  await fs.writeJson(configPath, config);
}

// ─── Validate ────────────────────────────────────────────────────────────────

export function validateConfig(raw: unknown): { success: true; data: UIGenConfig } | { success: false; errors: string[] } {
  const result = UIGenConfigSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
  };
}

// ─── Section 9: Create Contracts & Schemas ──────────────────────────────────

export const InterfaceTypeSchema = z.enum([
  'landing-page',
  'dashboard',
  'portfolio',
  'auth',
  'landing',
]);

export const FrameworkSchema = z.enum(['next', 'react', 'vite']);

export const ThemeSchema = z.enum([
  'modern',
  'minimal',
  'dark',
  'glass',
  'corporate',
]);

export const ColorModeSchema = z.enum(['system', 'light', 'dark']);

export const DesignVariantSchema = z.enum(['standard', 'premium']);

export const LandingPageSectionSchema = z.enum([
  'navbar',
  'hero',
  'features',
  'pricing',
  'footer',
  'testimonials',
  'faq',
  'cta',
  'newsletter',
]);

export const CreateConfigSchema = z
  .object({
    interface: InterfaceTypeSchema,
    framework: FrameworkSchema.default('next'),
    theme: z.string().default('modern'),
    colorMode: ColorModeSchema.default('system'),
    variant: DesignVariantSchema.default('premium'),
    sections: z.array(z.string()).min(1),
    outputDir: z.string().min(1).default('src/components'),
    dryRun: z.boolean().default(false),
    yes: z.boolean().default(false),
    force: z.boolean().default(false),
  })
  .superRefine((config, ctx) => {
    if (new Set(config.sections).size !== config.sections.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['sections'],
        message: 'Duplicate section IDs are not allowed.',
      });
    }

    const canonicalInterface = config.interface === 'landing' ? 'landing-page' : config.interface;
    if (
      canonicalInterface === 'landing-page' &&
      config.sections.some(
        (s) =>
          ![
            'navbar',
            'hero',
            'features',
            'pricing',
            'footer',
            'testimonials',
            'faq',
            'cta',
            'newsletter',
          ].includes(s)
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['sections'],
        message: 'Unsupported landing page section.',
      });
    }
  });

export type CreateConfig = z.infer<typeof CreateConfigSchema>;

export interface RawCreateOptions {
  interface?: string;
  framework?: string;
  theme?: string;
  colorMode?: string;
  variant?: string;
  sections?: string;
  outDir?: string;
  dryRun?: boolean;
  yes?: boolean;
  force?: boolean;
  overwrite?: boolean;
}

export interface PlannedFile {
  relativePath: string;
  content?: string;
  templateId: string;
  templateVersion: string;
  action: 'create' | 'skip' | 'overwrite';
  exists: boolean;
}

export interface GenerationPlan {
  config: CreateConfig;
  files: PlannedFile[];
  dependencies: string[];
  warnings: string[];
}

