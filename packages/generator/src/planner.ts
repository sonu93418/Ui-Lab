import path from 'path';
import type { CreateConfig, GenerationPlan, PlannedFile, UIGenConfig } from '@uigen/config';
import { fs } from '@uigen/utils';
import { resolveComponent, resolveSection } from '@uigen/registry';

export async function createGenerationPlan(
  config: CreateConfig,
  options: { cwd: string; projectConfig?: UIGenConfig | null }
): Promise<GenerationPlan> {
  const { cwd, projectConfig } = options;
  const canonicalInterface = config.interface === 'landing' ? 'landing-page' : config.interface;

  const files: PlannedFile[] = [];
  const dependencies = new Set<string>();
  const warnings: string[] = [];

  // Base output directories
  const sectionsDir = projectConfig?.paths.sections ?? path.join(config.outputDir, 'sections');
  const componentsDir = projectConfig?.paths.components ?? path.join(config.outputDir, 'ui');

  // Determine required components based on interface and sections
  const requiredComponents = new Set<string>();
  if (canonicalInterface === 'landing-page') {
    requiredComponents.add('button');
    if (config.sections.includes('pricing') || config.sections.includes('features')) {
      requiredComponents.add('card');
    }
    if (config.sections.includes('navbar')) {
      requiredComponents.add('avatar');
    }
  } else if (canonicalInterface === 'dashboard') {
    ['sidebar', 'stats-card', 'table', 'button', 'badge', 'avatar', 'spinner'].forEach((c) =>
      requiredComponents.add(c)
    );
  } else if (canonicalInterface === 'auth') {
    ['button', 'input', 'card'].forEach((c) => requiredComponents.add(c));
  } else {
    requiredComponents.add('button');
  }

  // 1. Plan component files
  for (const compSlug of requiredComponents) {
    const entry = resolveComponent(compSlug);
    if (entry) {
      entry.dependencies.forEach((d) => dependencies.add(d));
    }
    const relativePath = path.join(componentsDir, `${compSlug}.tsx`);
    const fullPath = path.join(cwd, relativePath);
    const exists = await fs.exists(fullPath);

    let action: 'create' | 'skip' | 'overwrite' = 'create';
    if (exists) {
      action = config.force ? 'overwrite' : 'skip';
      if (!config.force) {
        warnings.push(`File already exists: ${relativePath} (will skip)`);
      }
    }

    files.push({
      relativePath,
      templateId: `component-${compSlug}`,
      templateVersion: '1.0.0',
      action,
      exists,
    });
  }

  // 2. Plan section files
  for (const sectionSlug of config.sections) {
    const entry = resolveSection(sectionSlug);
    if (entry) {
      entry.dependencies.forEach((d) => dependencies.add(d));
    } else {
      warnings.push(`Section template not found for: ${sectionSlug}`);
    }

    const relativePath = path.join(sectionsDir, `${sectionSlug}.tsx`);
    const fullPath = path.join(cwd, relativePath);
    const exists = await fs.exists(fullPath);

    let action: 'create' | 'skip' | 'overwrite' = 'create';
    if (exists) {
      action = config.force ? 'overwrite' : 'skip';
      if (!config.force) {
        warnings.push(`File already exists: ${relativePath} (will skip)`);
      }
    }

    files.push({
      relativePath,
      templateId: `section-${sectionSlug}`,
      templateVersion: '1.0.0',
      action,
      exists,
    });
  }

  // 3. Plan Barrel Export / index.ts for sections
  const barrelRelPath = path.join(sectionsDir, 'index.ts');
  const barrelFullPath = path.join(cwd, barrelRelPath);
  const barrelExists = await fs.exists(barrelFullPath);
  files.push({
    relativePath: barrelRelPath,
    templateId: 'sections-barrel',
    templateVersion: '1.0.0',
    action: barrelExists && !config.force ? 'skip' : barrelExists ? 'overwrite' : 'create',
    exists: barrelExists,
  });

  return {
    config,
    files,
    dependencies: Array.from(dependencies),
    warnings,
  };
}
