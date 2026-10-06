import { Command } from 'commander';
import chalk from 'chalk';
import { searchRegistry } from '@uigen/registry';
import { logger } from '@uigen/utils';

export function searchCommand(): Command {
  return new Command('search')
    .description('Search for components, sections and themes')
    .argument('<query>', 'Search query')
    .action((query: string) => {
      const results = searchRegistry(query);
      logger.heading(`Search results for "${query}"`);
      logger.blank();

      if (results.length === 0) {
        logger.warn('No results found.');
        logger.dim(`Try: uigen list`);
        return;
      }

      for (const e of results) {
        const typeColor = e.type === 'section' ? chalk.magenta : chalk.cyan;
        console.log(
          `  ${typeColor(e.slug.padEnd(20))} ${chalk.dim(e.type.padEnd(12))} ${e.description.slice(0, 55)}`
        );
      }

      logger.blank();
      logger.dim(`Found ${results.length} result(s). Add with: uigen add <slug>`);
      logger.blank();
    });
}
