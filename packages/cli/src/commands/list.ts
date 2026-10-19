import { Command } from 'commander';
import chalk from 'chalk';
import { COMPONENTS_REGISTRY, SECTIONS_REGISTRY, THEMES_REGISTRY } from '@uigen/registry';
import { logger } from '@uigen/utils';

export function listCommand(): Command {
  return new Command('list')
    .alias('ls')
    .description('List available components, sections, or themes')
    .option('--type <type>', 'Filter by type: components, sections, themes, all', 'all')
    .option('--json', 'Output as JSON')
    .action((opts) => {
      const type = opts.type as string;
      const asJson = opts.json as boolean;

      if (type === 'components' || type === 'all') {
        if (!asJson) {
          logger.heading('Components');
          logger.blank();
          const grouped = COMPONENTS_REGISTRY.reduce<Record<string, typeof COMPONENTS_REGISTRY>>((acc, c) => {
            (acc[c.category] ??= []).push(c);
            return acc;
          }, {});
          for (const [cat, entries] of Object.entries(grouped)) {
            if (!entries) continue;
            console.log(`  ${chalk.bold.dim(cat.toUpperCase())}`);
            for (const e of entries) {
              const deps = e.dependencies.length > 0 ? chalk.dim(` deps: ${e.dependencies.join(', ')}`) : '';
              console.log(`    ${chalk.cyan(e.slug.padEnd(20))} ${e.description.slice(0, 50)}${deps}`);
            }
            logger.blank();
          }
        } else {
          console.log(JSON.stringify(COMPONENTS_REGISTRY, null, 2));
          return;
        }
      }

      if (type === 'sections' || type === 'all') {
        if (!asJson) {
          logger.heading('Sections');
          logger.blank();
          for (const e of SECTIONS_REGISTRY) {
            const variants = e.variants.length > 0 ? chalk.dim(` [${e.variants.slice(0, 3).join(', ')}]`) : '';
            console.log(`  ${chalk.cyan(e.slug.padEnd(20))} ${e.description.slice(0, 50)}${variants}`);
          }
          logger.blank();
        }
      }

      if (type === 'themes' || type === 'all') {
        if (!asJson) {
          logger.heading('Themes');
          logger.blank();
          for (const t of THEMES_REGISTRY) {
            const darkMode = t.supportsDarkMode ? chalk.dim(' (dark mode)') : '';
            console.log(`  ${chalk.cyan(t.slug.padEnd(20))} ${t.description}${darkMode}`);
          }
          logger.blank();
          logger.dim('Apply a theme: npx uigen theme apply <slug>');
          logger.blank();
        }
      }

      if (!asJson) {
        logger.dim(`Total: ${COMPONENTS_REGISTRY.length} components · ${SECTIONS_REGISTRY.length} sections · ${THEMES_REGISTRY.length} themes`);
        logger.blank();
        logger.dim('Add a component: npx uigen add <slug>');
        logger.blank();
      }
    });
}
