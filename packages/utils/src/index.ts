import chalk from 'chalk';
import ora, { type Ora } from 'ora';

// ─── Logger ──────────────────────────────────────────────────────────────────

export const logger = {
  info: (msg: string) => console.log(chalk.cyan('  ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('  ✔'), msg),
  warn: (msg: string) => console.log(chalk.yellow('  ⚠'), msg),
  error: (msg: string) => console.log(chalk.red('  ✖'), msg),
  blank: () => console.log(),
  heading: (msg: string) => console.log(chalk.bold.white(`\n  ${msg}`)),
  dim: (msg: string) => console.log(chalk.dim(`  ${msg}`)),
  log: (msg: string) => console.log(`  ${msg}`),
};

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function createSpinner(text: string): Ora {
  return ora({ text, color: 'cyan' });
}

// ─── Banner ──────────────────────────────────────────────────────────────────

export function printBanner() {
  console.log();
  console.log(
    chalk.bold.hex('#6366f1')('  ██╗   ██╗██╗ ██████╗ ███████╗███╗   ██╗')
  );
  console.log(
    chalk.bold.hex('#8b5cf6')('  ██║   ██║██║██╔════╝ ██╔════╝████╗  ██║')
  );
  console.log(
    chalk.bold.hex('#a78bfa')('  ██║   ██║██║██║  ███╗█████╗  ██╔██╗ ██║')
  );
  console.log(
    chalk.bold.hex('#c4b5fd')('  ██║   ██║██║██║   ██║██╔══╝  ██║╚██╗██║')
  );
  console.log(
    chalk.bold.hex('#ddd6fe')('  ╚██████╔╝██║╚██████╔╝███████╗██║ ╚████║')
  );
  console.log(
    chalk.bold.hex('#ede9fe')('   ╚═════╝ ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝')
  );
  console.log();
  console.log(chalk.dim('  Choose. Generate. Own. Ship.'));
  console.log();
}

// ─── String Utils ────────────────────────────────────────────────────────────

export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// ─── Version Utils ───────────────────────────────────────────────────────────

export function parseVersion(versionString: string): {
  name: string;
  version: string | undefined;
} {
  const atIndex = versionString.lastIndexOf('@');
  if (atIndex > 0) {
    return {
      name: versionString.slice(0, atIndex),
      version: versionString.slice(atIndex + 1),
    };
  }
  return { name: versionString, version: undefined };
}

export function compareVersions(a: string, b: string): number {
  const [aMajor = 0, aMinor = 0, aPatch = 0] = a.split('.').map(Number);
  const [bMajor = 0, bMinor = 0, bPatch = 0] = b.split('.').map(Number);
  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

// ─── File Utils ──────────────────────────────────────────────────────────────

export { fs } from './fs.js';
