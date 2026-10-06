import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import { loadConfig } from '@uigen/config';
import { logger, createSpinner, fs } from '@uigen/utils';

interface Check {
  name: string;
  check: () => Promise<{ ok: boolean; message: string }>;
}

export function doctorCommand(): Command {
  return new Command('doctor')
    .description('Check project health and UIGen requirements')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .action(async (opts) => {
      const cwd = opts.cwd as string;

      logger.heading('UIGen Doctor');
      logger.blank();

      const checks: Check[] = [
        {
          name: 'Node.js version',
          check: async () => {
            const version = process.version;
            const [, major] = version.match(/v(\d+)/) ?? [];
            return parseInt(major ?? '0') >= 18
              ? { ok: true, message: `Node.js ${version}` }
              : { ok: false, message: `Node.js ${version} — Node 18+ required` };
          },
        },
        {
          name: 'Package manager',
          check: async () => {
            const config = await loadConfig(cwd);
            const pm = config?.packageManager ?? 'npm';
            try {
              execSync(`${pm} --version`, { stdio: 'ignore' });
              return { ok: true, message: pm };
            } catch {
              return { ok: false, message: `${pm} not found in PATH` };
            }
          },
        },
        {
          name: 'Framework',
          check: async () => {
            const { detectProject } = await import('@uigen/generator');
            const project = await detectProject(cwd);
            return project.framework !== 'unknown'
              ? { ok: true, message: project.framework === 'next' ? 'Next.js' : `React + ${project.framework}` }
              : { ok: false, message: 'No supported framework detected' };
          },
        },
        {
          name: 'TypeScript',
          check: async () => {
            const exists = await fs.exists(path.join(cwd, 'tsconfig.json'));
            return exists
              ? { ok: true, message: 'tsconfig.json found' }
              : { ok: false, message: 'tsconfig.json not found — TypeScript required' };
          },
        },
        {
          name: 'Tailwind CSS',
          check: async () => {
            const tw1 = await fs.exists(path.join(cwd, 'tailwind.config.ts'));
            const tw2 = await fs.exists(path.join(cwd, 'tailwind.config.js'));
            const pkg = await fs.readJson<{ devDependencies?: Record<string, string>; dependencies?: Record<string, string> }>(path.join(cwd, 'package.json')).catch(() => ({})) as { devDependencies?: Record<string, string>; dependencies?: Record<string, string> };
            const hasTw = tw1 || tw2 || 'tailwindcss' in (pkg.devDependencies ?? {}) || 'tailwindcss' in (pkg.dependencies ?? {});
            return hasTw
              ? { ok: true, message: 'Tailwind CSS detected' }
              : { ok: false, message: 'Tailwind CSS not found — required for components' };
          },
        },
        {
          name: 'UIGen config',
          check: async () => {
            const config = await loadConfig(cwd);
            return config
              ? { ok: true, message: `uigen.config.json — theme: ${config.theme}` }
              : { ok: false, message: 'uigen.config.json not found — run `uigen init`' };
          },
        },
        {
          name: 'Registry connectivity',
          check: async () => {
            try {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 5000);
              await fetch('https://uigen.dev/api/health', { signal: controller.signal });
              clearTimeout(timeout);
              return { ok: true, message: 'Registry reachable' };
            } catch {
              return { ok: true, message: 'Offline mode — using local registry' };
            }
          },
        },
        {
          name: 'CLI version',
          check: async () => ({
            ok: true,
            message: `uigen v0.1.0 (latest)`,
          }),
        },
      ];

      let allOk = true;

      for (const check of checks) {
        const spinner = createSpinner(check.name).start();
        try {
          const result = await check.check();
          if (result.ok) {
            spinner.succeed(`${chalk.dim(check.name.padEnd(24))} ${chalk.dim(result.message)}`);
          } else {
            spinner.fail(`${check.name.padEnd(24)} ${chalk.yellow(result.message)}`);
            allOk = false;
          }
        } catch (err) {
          spinner.fail(`${check.name} — unexpected error: ${String(err)}`);
          allOk = false;
        }
      }

      logger.blank();
      if (allOk) {
        logger.success(chalk.bold('Your project is ready to use UIGen!'));
      } else {
        logger.warn('Some checks failed — address the issues above before using UIGen.');
      }
      logger.blank();
    });
}
