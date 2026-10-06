import { Command } from 'commander';
import { select, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import { loadConfig } from '@uigen/config';
import { THEMES_REGISTRY } from '@uigen/registry';
import { generatePage, generateSection, generateComponent, generateTheme } from '@uigen/generator';
import { logger, createSpinner } from '@uigen/utils';

const PAGE_TYPES = [
  { value: 'landing', name: 'Landing Page', description: 'Full SaaS/startup landing page with hero, features, pricing, FAQ' },
  { value: 'dashboard', name: 'Dashboard', description: 'Analytics dashboard with sidebar, stats, and data table' },
  { value: 'auth-login', name: 'Login Page', description: 'Authentication login form' },
  { value: 'auth-register', name: 'Register Page', description: 'Account registration form' },
  { value: '404', name: '404 Page', description: 'Not found error page' },
] as const;

const LANDING_SECTIONS = ['navbar', 'hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'newsletter', 'footer'];
const DASHBOARD_COMPONENTS = ['sidebar', 'stats-card', 'table', 'button', 'badge', 'avatar', 'spinner'];
const AUTH_COMPONENTS = ['button', 'input', 'card'];

export function createCommand(): Command {
  return new Command('create')
    .description('Interactively create a complete interface')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--overwrite', 'Overwrite existing files')
    .action(async (opts) => {
      const cwd = opts.cwd as string;
      const overwrite = opts.overwrite as boolean ?? false;

      const config = await loadConfig(cwd);
      if (!config) {
        logger.error('No UIGen config found. Run `uigen init` first.');
        process.exit(1);
      }

      logger.heading('Create a complete interface');
      logger.blank();

      // Step 1: What to create
      const pageType = await select({
        message: 'What do you want to create?',
        choices: PAGE_TYPES.map((p) => ({
          value: p.value,
          name: `${p.name.padEnd(20)} ${chalk.dim(p.description)}`,
          short: p.name,
        })),
      });

      // Step 2: Theme
      const theme = await select({
        message: 'Select theme',
        choices: THEMES_REGISTRY.map((t) => ({
          value: t.slug,
          name: `${t.name.padEnd(15)} ${chalk.dim(t.description)}`,
          short: t.name,
        })),
        default: config.theme,
      });

      // Step 3: For landing page, select sections
      let selectedSections: string[] = [];
      if (pageType === 'landing') {
        selectedSections = await checkbox({
          message: 'Select sections to include',
          choices: LANDING_SECTIONS.map((s) => ({
            value: s,
            name: s.charAt(0).toUpperCase() + s.slice(1),
            checked: true,
          })),
        });
      }

      logger.blank();

      // Apply theme
      const themeSpinner = createSpinner(`Applying theme: ${theme}...`).start();
      const updatedConfig = { ...config, theme };
      try {
        await generateTheme(theme, { cwd, config: updatedConfig });
        themeSpinner.succeed(`Theme ${chalk.bold(theme)} applied`);
      } catch {
        themeSpinner.warn('Theme generation failed — continuing');
      }

      // Generate required components
      const components = pageType === 'landing'
        ? ['button', 'card']
        : pageType === 'dashboard'
        ? DASHBOARD_COMPONENTS
        : AUTH_COMPONENTS;

      logger.blank();
      logger.log(chalk.dim('Generating components...'));

      for (const slug of components) {
        const spinner = createSpinner(`  ${slug}`).start();
        try {
          const result = await generateComponent(slug, { cwd, config: updatedConfig, overwrite });
          if (result.success) {
            spinner.succeed(`  ${slug}`);
          } else {
            spinner.warn(`  ${slug} — skipped (already exists)`);
          }
        } catch {
          spinner.warn(`  ${slug} — skipped`);
        }
      }

      // Generate sections (for landing or dashboard)
      const sections = pageType === 'landing'
        ? selectedSections
        : pageType === 'dashboard'
        ? []
        : [];

      if (sections.length > 0) {
        logger.log(chalk.dim('\nGenerating sections...'));
        for (const slug of sections) {
          const spinner = createSpinner(`  ${slug}`).start();
          try {
            const result = await generateSection(slug, { cwd, config: updatedConfig, overwrite });
            if (result.success) {
              spinner.succeed(`  ${slug}`);
            } else {
              spinner.warn(`  ${slug} — skipped`);
            }
          } catch {
            spinner.warn(`  ${slug} — skipped`);
          }
        }
      }

      // Generate the page
      logger.log(chalk.dim('\nGenerating page...'));
      const pageSpinner = createSpinner(`  ${pageType} page`).start();
      try {
        const result = await generatePage(pageType as Parameters<typeof generatePage>[0], {
          cwd,
          config: updatedConfig,
          overwrite,
        });
        if (result.success) {
          pageSpinner.succeed(`  Page generated → ${result.file?.replace(cwd, '')}`);
        } else {
          pageSpinner.warn(`  Page skipped: ${result.error}`);
        }
      } catch {
        pageSpinner.fail('  Page generation failed');
      }

      logger.blank();
      logger.success(chalk.bold('Interface created successfully!'));
      logger.blank();
      logger.dim('Run your dev server to see it:');
      logger.log(`  ${chalk.cyan('npm run dev')}`);
      logger.blank();
    });
}
