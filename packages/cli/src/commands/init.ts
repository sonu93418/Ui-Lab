import { Command } from 'commander';
import { select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { detectProject } from '@uigen/generator';
import { THEMES_REGISTRY } from '@uigen/registry';
import { saveConfig, DEFAULT_CONFIG } from '@uigen/config';
import { logger, createSpinner, printBanner } from '@uigen/utils';
import { generateTheme } from '@uigen/generator';

export function initCommand(): Command {
  return new Command('init')
    .description('Initialize UIGen in the current project')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--yes', 'Skip prompts and use defaults')
    .action(async (opts) => {
      printBanner();
      const cwd = opts.cwd as string;

      logger.heading('Initializing UIGen');
      logger.blank();

      // 1. Detect project
      const spinner = createSpinner('Detecting project configuration...').start();
      const project = await detectProject(cwd);
      spinner.stop();

      if (project.framework === 'unknown') {
        logger.warn('Could not detect a supported framework (Next.js or React).');
        logger.dim('Make sure you are running this in a Next.js or React project.');
      } else {
        logger.success(`Framework detected: ${chalk.bold(project.framework === 'next' ? 'Next.js' : 'React + Vite')}`);
      }

      if (project.hasTypeScript) {
        logger.success('TypeScript detected');
      } else {
        logger.warn('TypeScript not detected — generated code will be TypeScript, please install it.');
      }

      if (project.hasTailwind) {
        logger.success('Tailwind CSS detected');
      } else {
        logger.warn('Tailwind CSS not detected — install Tailwind CSS to use generated components.');
      }

      logger.blank();

      // 2. Theme selection
      let theme = 'modern';
      if (!opts.yes) {
        theme = await select({
          message: 'Select a theme',
          choices: THEMES_REGISTRY.map((t) => ({
            value: t.slug,
            name: `${t.name} — ${t.description}`,
          })),
        });
      }

      // 3. Dark mode
      let darkMode: 'light' | 'dark' | 'system' = 'system';
      if (!opts.yes) {
        darkMode = await select({
          message: 'Dark mode',
          choices: [
            { value: 'system', name: 'System (auto)' },
            { value: 'light', name: 'Light only' },
            { value: 'dark', name: 'Dark only' },
          ],
        }) as 'light' | 'dark' | 'system';
      }

      // 4. Animations
      let animations = true;
      if (!opts.yes) {
        animations = await confirm({ message: 'Enable animations?', default: true });
      }

      // 5. Save config
      const config = {
        ...DEFAULT_CONFIG,
        framework: (project.framework === 'unknown' ? 'next' : project.framework) as 'next' | 'react' | 'vite',
        hasTypeScript: project.hasTypeScript,
        theme,
        darkMode,
        animations,
        packageManager: project.packageManager,
        cliVersion: '0.1.0',
      };

      const saveSpinner = createSpinner('Creating configuration...').start();
      await saveConfig(cwd, config);
      saveSpinner.succeed('Configuration created');

      // 6. Generate theme CSS
      const themeSpinner = createSpinner('Generating theme tokens...').start();
      try {
        await generateTheme(theme, { cwd, config });
        themeSpinner.succeed('Theme tokens generated');
      } catch {
        themeSpinner.warn('Could not generate theme file — run `uigen theme apply` later');
      }

      logger.blank();
      logger.success(chalk.bold('UIGen initialized successfully!'));
      logger.blank();
      logger.dim('Next steps:');
      logger.log(`  ${chalk.cyan('npx uigen add button')}     Add a component`);
      logger.log(`  ${chalk.cyan('npx uigen create')}          Create a complete interface`);
      logger.log(`  ${chalk.cyan('npx uigen list')}            Browse available components`);
      logger.blank();
    });
}
