import { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import path from 'path';
import { loadConfig } from '@uigen/config';
import { resolveEntry } from '@uigen/registry';
import { logger, fs } from '@uigen/utils';

export function removeCommand(): Command {
  return new Command('remove')
    .alias('rm')
    .description('Remove a generated component or section from your project')
    .argument('<slug>', 'Component slug to remove')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--yes', 'Skip confirmation prompt')
    .action(async (slug: string, opts) => {
      const cwd = opts.cwd as string;
      const skipConfirm = opts.yes as boolean;

      const config = await loadConfig(cwd);
      if (!config) {
        logger.error('No UIGen config found. Run `uigen init` first.');
        process.exit(1);
      }

      const entry = resolveEntry(slug);
      if (!entry) {
        logger.error(`"${slug}" not found in registry.`);
        process.exit(1);
      }

      const basePath = entry.type === 'section' ? config.paths.sections : config.paths.components;
      const filePath = path.join(cwd, basePath, `${slug}.tsx`);
      const exists = await fs.exists(filePath);

      if (!exists) {
        logger.warn(`${chalk.bold(slug)} is not in your project — nothing to remove.`);
        return;
      }

      if (!skipConfirm) {
        const ok = await confirm({
          message: `Remove ${chalk.bold(slug)} from ${filePath.replace(cwd, '')}?`,
          default: false,
        });
        if (!ok) {
          logger.dim('Cancelled.');
          return;
        }
      }

      await fs.remove(filePath);
      logger.success(`Removed ${chalk.bold(slug)}`);
    });
}
