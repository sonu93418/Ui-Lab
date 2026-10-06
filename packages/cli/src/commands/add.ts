import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { loadConfig } from '@uigen/config';
import { resolveEntry } from '@uigen/registry';
import { generateComponent, generateSection, getMissingDependencies, installDependencies } from '@uigen/generator';
import { logger, createSpinner, parseVersion } from '@uigen/utils';

export function addCommand(): Command {
  return new Command('add')
    .description('Add a component or section to your project')
    .argument('[components...]', 'Component slugs to add (e.g. button navbar)')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--overwrite', 'Overwrite existing files')
    .option('--no-install', 'Skip dependency installation')
    .action(async (components: string[], opts) => {
      const cwd = opts.cwd as string;
      const overwrite = opts.overwrite as boolean ?? false;
      const install = opts.install as boolean ?? true;

      // Load config
      const config = await loadConfig(cwd);
      if (!config) {
        logger.error('No UIGen configuration found. Run `uigen init` first.');
        process.exit(1);
      }

      // Interactive selection if no components specified
      let slugs = components;
      if (slugs.length === 0) {
        const { COMPONENTS_REGISTRY, SECTIONS_REGISTRY } = await import('@uigen/registry');
        const all = [...COMPONENTS_REGISTRY, ...SECTIONS_REGISTRY].filter((e) => e.status === 'published');
        const slug = await select({
          message: 'Select a component or section to add',
          choices: all.map((e) => ({
            value: e.slug,
            name: `${e.name.padEnd(20)} ${chalk.dim(e.description)}`,
            short: e.slug,
          })),
        });
        slugs = [slug];
      }

      for (const rawSlug of slugs) {
        // Support versioned slugs: button@1.0.0
        const { name: slug } = parseVersion(rawSlug);

        logger.heading(`Adding ${chalk.bold(slug)}`);

        // Resolve entry
        const entry = resolveEntry(slug);
        if (!entry) {
          logger.error(`"${slug}" not found in registry. Run \`uigen search ${slug}\` to find similar components.`);
          continue;
        }

        // Check & install dependencies
        if (install && entry.dependencies.length > 0) {
          const missing = await getMissingDependencies(entry.dependencies, cwd);
          if (missing.length > 0) {
            logger.warn(`Missing dependencies: ${chalk.yellow(missing.join(', '))}`);
            const { confirm } = await import('@inquirer/prompts');
            const shouldInstall = await confirm({
              message: `Install missing dependencies with ${config.packageManager}?`,
              default: true,
            });
            if (shouldInstall) {
              const depSpinner = createSpinner(`Installing ${missing.join(', ')}...`).start();
              try {
                await installDependencies(missing, cwd, config.packageManager);
                depSpinner.succeed(`Installed ${missing.join(', ')}`);
              } catch {
                depSpinner.fail('Dependency installation failed. Install manually:');
                logger.log(chalk.dim(`  ${config.packageManager} add ${missing.join(' ')}`));
              }
            }
          }
        }

        // Generate
        const spinner = createSpinner(`Generating ${slug}...`).start();

        const generateFn = entry.type === 'section'
          ? generateSection
          : generateComponent;

        const result = await generateFn(slug, { cwd, config, overwrite });

        if (!result.success) {
          spinner.fail(`Failed to generate ${slug}: ${result.errors.join(', ')}`);
          continue;
        }

        for (const file of result.files) {
          if (file.skipped) {
            spinner.warn(
              `${chalk.yellow(file.path.replace(cwd, ''))} already exists — skipped`
            );
          } else {
            spinner.succeed(`Generated ${chalk.green(file.path.replace(cwd, ''))}`);
          }
        }

        logger.blank();
        logger.dim('Usage:');
        const importPath = entry.type === 'section'
          ? `@/${config.paths.sections.replace('src/', '')}/${slug}`
          : `@/${config.paths.components.replace('src/', '')}/${slug}`;
        const componentName = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join('');
        logger.log(chalk.dim(`  import { ${componentName} } from '${importPath}';`));
        logger.blank();
      }
    });
}
