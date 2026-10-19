import { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import path from 'path';
import { loadConfig, saveConfig, DEFAULT_CONFIG, CONFIG_FILENAME } from '@uigen/config';
import { installDependencies, getMissingDependencies } from '@uigen/generator';
import { logger, createSpinner, fs } from '@uigen/utils';

export function fixCommand(): Command {
  return new Command('fix')
    .description('Apply explicitly supported project repairs after showing proposed changes')
    .option('-y, --yes', 'Apply all recommended fixes automatically', false)
    .option('--cwd <path>', 'Working directory', process.cwd())
    .action(async (opts) => {
      const cwd = opts.cwd as string;
      const isAutoYes = Boolean(opts.yes);

      logger.heading('UIGen Fix & Repair');
      logger.dim('Diagnosing project setup and preparing repairs...\n');

      const proposedFixes: Array<{ title: string; execute: () => Promise<void> }> = [];

      // 1. Check uigen.config.json
      const config = await loadConfig(cwd);
      if (!config) {
        proposedFixes.push({
          title: `Create default ${CONFIG_FILENAME}`,
          execute: async () => {
            await saveConfig(cwd, DEFAULT_CONFIG);
            logger.success(`Created ${CONFIG_FILENAME}`);
          },
        });
      }

      // 2. Check missing required packages
      const requiredDeps = ['clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react'];
      const missing = await getMissingDependencies(requiredDeps, cwd);
      if (missing.length > 0) {
        proposedFixes.push({
          title: `Install missing UI dependencies: ${chalk.cyan(missing.join(', '))}`,
          execute: async () => {
            const spinner = createSpinner('Installing dependencies...').start();
            try {
              await installDependencies(missing, cwd, config?.packageManager ?? 'npm');
              spinner.succeed(`Installed: ${missing.join(', ')}`);
            } catch (err) {
              spinner.fail(`Failed to install dependencies: ${err}`);
            }
          },
        });
      }

      // 3. Check paths exist
      const activeConfig = config ?? DEFAULT_CONFIG;
      for (const [key, relPath] of Object.entries(activeConfig.paths)) {
        const full = path.join(cwd, relPath);
        const exists = await fs.exists(full);
        if (!exists) {
          proposedFixes.push({
            title: `Create missing directory for ${key}: ${chalk.cyan(relPath)}`,
            execute: async () => {
              await fs.ensureDir(full);
              logger.success(`Created directory: ${relPath}`);
            },
          });
        }
      }

      if (proposedFixes.length === 0) {
        logger.success('No issues detected! Your project is in optimal health.');
        return;
      }

      console.log(chalk.bold('Proposed Repairs:'));
      proposedFixes.forEach((fix, idx) => {
        console.log(`  ${idx + 1}. ${fix.title}`);
      });
      logger.blank();

      if (!isAutoYes) {
        const shouldProceed = await confirm({
          message: 'Apply these repairs now?',
          default: true,
        });

        if (!shouldProceed) {
          logger.dim('Repair cancelled.');
          return;
        }
      }

      logger.blank();
      for (const fix of proposedFixes) {
        await fix.execute();
      }

      logger.blank();
      logger.success(chalk.bold('All repairs completed successfully!'));
      logger.blank();
    });
}
