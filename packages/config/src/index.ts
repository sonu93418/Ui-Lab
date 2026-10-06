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
