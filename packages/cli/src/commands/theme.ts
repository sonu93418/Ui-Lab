import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '@uigen/config';
import { THEMES_REGISTRY } from '@uigen/registry';
import { generateTheme } from '@uigen/generator';
import { logger, createSpinner } from '@uigen/utils';

export function themeCommand(): Command {
  const cmd = new Command('theme').description('Manage UIGen themes');

  // theme list
  cmd
    .command('list')
    .description('List available themes')
    .action(() => {
      logger.heading('Available Themes');
      logger.blank();
      for (const t of THEMES_REGISTRY) {
        const colors = Object.entries(t.tokens.colors)
          .slice(0, 3)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' · ');
        console.log(`  ${chalk.bold.cyan(t.slug.padEnd(15))} ${chalk.white(t.name)}`);
        console.log(`  ${' '.repeat(15)} ${chalk.dim(t.description)}`);
        console.log(`  ${' '.repeat(15)} ${chalk.dim(colors)}`);
        logger.blank();
      }
    });

  // theme apply
  cmd
    .command('apply [slug]')
    .description('Apply a theme to the current project')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .action(async (slug: string | undefined, opts) => {
      const cwd = opts.cwd as string;
      const config = await loadConfig(cwd);
      if (!config) {
        logger.error('No UIGen config found. Run `uigen init` first.');
        process.exit(1);
      }

      let themeSlug = slug;
      if (!themeSlug) {
        themeSlug = await select({
          message: 'Select a theme',
          choices: THEMES_REGISTRY.map((t) => ({
            value: t.slug,
            name: `${t.name.padEnd(15)} ${chalk.dim(t.description)}`,
          })),
          default: config.theme,
        });
      }

      const theme = THEMES_REGISTRY.find((t) => t.slug === themeSlug);
      if (!theme) {
        logger.error(`Theme "${themeSlug}" not found. Run \`uigen theme list\` to see available themes.`);
        process.exit(1);
      }

      const spinner = createSpinner(`Applying theme: ${theme.name}...`).start();
      const updatedConfig = { ...config, theme: themeSlug };

      try {
        await generateTheme(themeSlug, { cwd, config: updatedConfig });
        await saveConfig(cwd, updatedConfig);
        spinner.succeed(`Theme ${chalk.bold(theme.name)} applied`);
        logger.blank();
        logger.dim(`Theme tokens written to ${config.paths.styles}/theme.css`);
        logger.blank();
      } catch (err) {
        spinner.fail('Failed to apply theme');
        logger.error(String(err));
        process.exit(1);
      }
    });

  return cmd;
}
