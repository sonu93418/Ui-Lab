import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { loadConfig, saveConfig, CONFIG_FILENAME } from '@uigen/config';
import { logger } from '@uigen/utils';

export function configCommand(): Command {
  const cmd = new Command('config')
    .description('Inspect or edit UIGen project configuration')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .action(async (opts) => {
      const cwd = (opts.cwd as string) ?? (cmd.opts().cwd as string) ?? process.cwd();
      const config = await loadConfig(cwd);

      if (!config) {
        logger.error(`No ${CONFIG_FILENAME} found. Run \`uigen init\` first.`);
        process.exit(1);
      }

      logger.heading('UIGen Configuration');
      logger.dim(`File: ${path.join(cwd, CONFIG_FILENAME)}\n`);
      console.log(JSON.stringify(config, null, 2));
      logger.blank();
    });

  cmd
    .command('get <key>')
    .description('Get a configuration value by key')
    .option('--cwd <path>', 'Working directory')
    .action(async (key: string, opts) => {
      const cwd = (opts.cwd as string) ?? (cmd.opts().cwd as string) ?? process.cwd();
      const config = await loadConfig(cwd);
      if (!config) {
        logger.error(`No ${CONFIG_FILENAME} found at ${cwd}.`);
        process.exit(1);
      }

      const val = (config as unknown as Record<string, unknown>)[key];
      if (val === undefined) {
        logger.warn(`Key "${key}" is not defined in ${CONFIG_FILENAME}.`);
      } else {
        console.log(typeof val === 'object' ? JSON.stringify(val, null, 2) : val);
      }
    });

  cmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .option('--cwd <path>', 'Working directory')
    .action(async (key: string, value: string, opts) => {
      const cwd = (opts.cwd as string) ?? (cmd.opts().cwd as string) ?? process.cwd();
      const config = await loadConfig(cwd);
      if (!config) {
        logger.error(`No ${CONFIG_FILENAME} found at ${cwd}.`);
        process.exit(1);
      }

      let parsedVal: unknown = value;
      if (value === 'true') parsedVal = true;
      else if (value === 'false') parsedVal = false;
      else if (!isNaN(Number(value)) && value.trim() !== '') parsedVal = Number(value);

      (config as unknown as Record<string, unknown>)[key] = parsedVal;
      await saveConfig(cwd, config);
      logger.success(`Updated ${chalk.cyan(key)} = ${chalk.green(value)} in ${CONFIG_FILENAME}`);
    });

  return cmd;
}
