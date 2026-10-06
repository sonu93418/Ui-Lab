import path from 'path';
import { fs } from '@uigen/utils';

export interface ProjectInfo {
  framework: 'next' | 'react' | 'vite' | 'unknown';
  hasTypeScript: boolean;
  hasTailwind: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  srcDir: boolean;
  version?: string;
}

/**
 * Detect project framework, TypeScript, Tailwind, and package manager.
 */
export async function detectProject(cwd: string): Promise<ProjectInfo> {
  const pkgPath = path.join(cwd, 'package.json');
  const hasPkg = await fs.exists(pkgPath);

  if (!hasPkg) {
    return {
      framework: 'unknown',
      hasTypeScript: false,
      hasTailwind: false,
      packageManager: 'npm',
      srcDir: false,
    };
  }

  const pkg = await fs.readJson<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }>(pkgPath);

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Framework detection
  let framework: ProjectInfo['framework'] = 'unknown';
  if (deps['next']) framework = 'next';
  else if (deps['vite']) framework = 'vite';
  else if (deps['react']) framework = 'react';

  // TypeScript
  const hasTypeScript =
    !!(deps['typescript']) ||
    (await fs.exists(path.join(cwd, 'tsconfig.json')));

  // Tailwind
  const hasTailwind =
    !!(deps['tailwindcss']) ||
    (await fs.exists(path.join(cwd, 'tailwind.config.ts'))) ||
    (await fs.exists(path.join(cwd, 'tailwind.config.js')));

  // src dir
  const srcDir = await fs.exists(path.join(cwd, 'src'));

  // Package manager
  let packageManager: ProjectInfo['packageManager'] = 'npm';
  if (await fs.exists(path.join(cwd, 'pnpm-lock.yaml'))) packageManager = 'pnpm';
  else if (await fs.exists(path.join(cwd, 'yarn.lock'))) packageManager = 'yarn';
  else if (await fs.exists(path.join(cwd, 'bun.lockb'))) packageManager = 'bun';

  return { framework, hasTypeScript, hasTailwind, packageManager, srcDir, version: deps['next'] };
}
