import { execa } from 'execa';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Install npm dependencies using the project's package manager.
 */
export async function installDependencies(
  deps: string[],
  cwd: string,
  packageManager: PackageManager = 'npm'
): Promise<void> {
  if (deps.length === 0) return;

  const cmds: Record<PackageManager, string[]> = {
    npm: ['npm', 'install', ...deps],
    pnpm: ['pnpm', 'add', ...deps],
    yarn: ['yarn', 'add', ...deps],
    bun: ['bun', 'add', ...deps],
  };

  const [cmd, ...args] = cmds[packageManager];
  await execa(cmd, args, { cwd, stdio: 'inherit' });
}

/**
 * Check if a dependency is already installed.
 */
export async function isDependencyInstalled(dep: string, cwd: string): Promise<boolean> {
  try {
    const { fs } = await import('@uigen/utils');
    const pkg = await fs.readJson<{
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    }>(`${cwd}/package.json`);
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    return dep in all;
  } catch {
    return false;
  }
}

/**
 * Filter out already-installed dependencies.
 */
export async function getMissingDependencies(deps: string[], cwd: string): Promise<string[]> {
  const checks = await Promise.all(
    deps.map(async (dep) => ({ dep, installed: await isDependencyInstalled(dep, cwd) }))
  );
  return checks.filter((c) => !c.installed).map((c) => c.dep);
}
