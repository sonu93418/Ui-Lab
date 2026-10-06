import path from 'path';
import type { UIGenConfig } from '@uigen/config';
import { fs } from '@uigen/utils';
import { resolveEntry } from '@uigen/registry';
import { COMPONENT_TEMPLATES } from './templates/components/index.js';
import { formatCode } from './formatter.js';

export interface GenerateResult {
  success: boolean;
  files: { path: string; created: boolean; skipped: boolean }[];
  errors: string[];
}

export interface GenerateOptions {
  cwd: string;
  config: UIGenConfig;
  overwrite?: boolean;
}

/**
 * Generate a component into the target project.
 */
export async function generateComponent(
  slug: string,
  options: GenerateOptions
): Promise<GenerateResult> {
  const { cwd, config, overwrite = false } = options;
  const entry = resolveEntry(slug);

  if (!entry) {
    return {
      success: false,
      files: [],
      errors: [`Component "${slug}" not found in registry.`],
    };
  }

  const template = COMPONENT_TEMPLATES[slug];
  if (!template) {
    return {
      success: false,
      files: [],
      errors: [`Template for "${slug}" not found.`],
    };
  }

  const result: GenerateResult = { success: true, files: [], errors: [] };
  const componentCode = typeof template === 'function' ? template(config) : template;
  const formatted = await formatCode(componentCode, 'typescript');

  const outputPath = path.join(cwd, config.paths.components, `${slug}.tsx`);
  const exists = await fs.exists(outputPath);

  if (exists && !overwrite) {
    result.files.push({ path: outputPath, created: false, skipped: true });
    return result;
  }

  await fs.writeFile(outputPath, formatted);
  result.files.push({ path: outputPath, created: true, skipped: false });
  return result;
}
