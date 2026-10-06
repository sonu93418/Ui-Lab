import path from 'path';
import type { UIGenConfig } from '@uigen/config';
import { fs } from '@uigen/utils';
import { resolveSection } from '@uigen/registry';
import { SECTION_TEMPLATES } from './templates/sections/index.js';
import { formatCode } from './formatter.js';

export interface GenerateResult {
  success: boolean;
  files: { path: string; created: boolean; skipped: boolean }[];
  errors: string[];
}

/**
 * Generate a section into the target project.
 */
export async function generateSection(
  slug: string,
  options: { cwd: string; config: UIGenConfig; overwrite?: boolean }
): Promise<GenerateResult> {
  const { cwd, config, overwrite = false } = options;
  const entry = resolveSection(slug);

  if (!entry) {
    return {
      success: false,
      files: [],
      errors: [`Section "${slug}" not found in registry.`],
    };
  }

  const template = SECTION_TEMPLATES[slug];
  if (!template) {
    return {
      success: false,
      files: [],
      errors: [`Section template for "${slug}" not found.`],
    };
  }

  const result: GenerateResult = { success: true, files: [], errors: [] };
  const sectionCode = typeof template === 'function' ? template(config) : template;
  const formatted = await formatCode(sectionCode, 'typescript');
  const outputPath = path.join(cwd, config.paths.sections, `${slug}.tsx`);
  const exists = await fs.exists(outputPath);

  if (exists && !overwrite) {
    result.files.push({ path: outputPath, created: false, skipped: true });
    return result;
  }

  await fs.writeFile(outputPath, formatted);
  result.files.push({ path: outputPath, created: true, skipped: false });
  return result;
}
