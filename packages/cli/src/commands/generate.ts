import { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import path from 'path';
import { loadConfig, CreateConfigSchema, DEFAULT_CONFIG, type CreateConfig } from '@uigen/config';
import { createGenerationPlan, generateComponent, generateSection, generateTheme, generatePage, formatCode, type PageType } from '@uigen/generator';
import { logger, createSpinner, fs } from '@uigen/utils';

export interface ParsedQuery {
  interface: 'landing-page' | 'dashboard' | 'auth' | 'portfolio';
  theme: string;
  colorMode: 'system' | 'light' | 'dark';
  variant: 'standard' | 'premium';
  sections: string[];
}

export function parseQueryToConfig(query: string): ParsedQuery {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');

  // 1. Interface
  let iface: ParsedQuery['interface'] = 'landing-page';
  if (normalized.includes('dashboard') || normalized.includes('analytics') || normalized.includes('admin')) {
    iface = 'dashboard';
  } else if (normalized.includes('auth') || normalized.includes('login') || normalized.includes('signup') || normalized.includes('register')) {
    iface = 'auth';
  } else if (normalized.includes('portfolio') || normalized.includes('showcase')) {
    iface = 'portfolio';
  } else if (normalized.includes('landing')) {
    iface = 'landing-page';
  }

  // 2. Theme
  let theme = 'modern';
  if (normalized.includes('minimal')) theme = 'minimal';
  else if (normalized.includes('dark')) theme = 'dark';
  else if (normalized.includes('glass')) theme = 'glass';
  else if (normalized.includes('corporate') || normalized.includes('enterprise')) theme = 'corporate';
  else if (normalized.includes('modern')) theme = 'modern';

  // 3. Color Mode
  let colorMode: ParsedQuery['colorMode'] = 'system';
  if (normalized.includes('dark mode') || (normalized.includes('dark') && theme !== 'dark')) {
    colorMode = 'dark';
  } else if (normalized.includes('light mode') || normalized.includes('light')) {
    colorMode = 'light';
  }

  // 4. Design Variant
  let variant: ParsedQuery['variant'] = 'premium';
  if (normalized.includes('standard') || normalized.includes('simple') || normalized.includes('basic')) {
    variant = 'standard';
  } else if (normalized.includes('premium') || normalized.includes('polished') || normalized.includes('refined')) {
    variant = 'premium';
  }

  // 5. Sections
  const detectedSections = new Set<string>();
  const sectionKeywords: Record<string, string[]> = {
    navbar: ['navbar', 'navigation', 'nav', 'header'],
    hero: ['hero', 'banner', 'headline'],
    features: ['feature', 'features', 'highlights', 'services'],
    pricing: ['pricing', 'price', 'plan', 'plans', 'subscription'],
    testimonials: ['testimonial', 'testimonials', 'reviews', 'social proof'],
    faq: ['faq', 'questions', 'answers'],
    cta: ['cta', 'call to action', 'action'],
    newsletter: ['newsletter', 'subscribe', 'email signup'],
    footer: ['footer', 'bottom'],
  };

  for (const [sectionKey, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      detectedSections.add(sectionKey);
    }
  }

  // If no sections explicitly mentioned in a landing page query, supply default core sections
  let sections = Array.from(detectedSections);
  if (iface === 'landing-page' && sections.length === 0) {
    sections = ['navbar', 'hero', 'features', 'pricing', 'footer'];
  } else if (iface === 'landing-page') {
    // Ensure navbar and footer are included if hero or pricing is mentioned
    if (!detectedSections.has('navbar')) sections.unshift('navbar');
    if (!detectedSections.has('footer')) sections.push('footer');
  } else {
    if (sections.length === 0) sections = ['main'];
  }

  return {
    interface: iface,
    theme,
    colorMode,
    variant,
    sections,
  };
}

export function generateCommand(): Command {
  return new Command('generate')
    .description('Deterministic natural-language UI query generation (no AI required)')
    .argument('<query>', 'Natural text query, e.g. "premium modern landing page with pricing"')
    .option('--out-dir <path>', 'Output directory', 'src/components')
    .option('--dry-run', 'Preview planned files and dependencies without writing', false)
    .option('-y, --yes', 'Approve proposed configuration automatically', false)
    .option('--force', 'Overwrite existing files', false)
    .option('--cwd <path>', 'Working directory', process.cwd())
    .action(async (query: string, opts) => {
      const cwd = opts.cwd as string;
      const isDryRun = Boolean(opts.dryRun);
      const isAutoYes = Boolean(opts.yes);
      const isForce = Boolean(opts.force);
      const outputDir = opts.outDir ?? 'src/components';

      logger.heading('UIGen Query Generator');
      logger.dim(`Query: "${chalk.cyan(query)}"\n`);

      const parsed = parseQueryToConfig(query);
      const projectConfig = await loadConfig(cwd);

      const validation = CreateConfigSchema.safeParse({
        interface: parsed.interface,
        framework: 'next',
        theme: parsed.theme,
        colorMode: parsed.colorMode,
        variant: parsed.variant,
        sections: parsed.sections,
        outputDir,
        dryRun: isDryRun,
        yes: isAutoYes,
        force: isForce,
      });

      if (!validation.success) {
        logger.error('Could not translate query to a supported configuration:');
        validation.error.errors.forEach((e) => logger.error(`  - ${e.message}`));
        process.exit(1);
      }

      const validConfig: CreateConfig = validation.data;

      // Plan generation
      const plan = await createGenerationPlan(validConfig, { cwd, projectConfig });

      logger.heading('Proposed Configuration');
      logger.dim(`Interface:   ${chalk.cyan(validConfig.interface)}`);
      logger.dim(`Theme:       ${chalk.cyan(validConfig.theme)} (${validConfig.variant})`);
      logger.dim(`Color Mode:  ${chalk.cyan(validConfig.colorMode)}`);
      logger.dim(`Sections:    ${chalk.cyan(validConfig.sections.join(', '))}`);
      logger.blank();

      console.log(chalk.bold('Planned Files:'));
      for (const file of plan.files) {
        const icon =
          file.action === 'create'
            ? chalk.green('+ CREATE')
            : file.action === 'overwrite'
            ? chalk.yellow('! OVERWRITE')
            : chalk.dim('- SKIP (exists)');
        console.log(`  ${icon.padEnd(20)} ${file.relativePath}`);
      }

      if (plan.dependencies.length > 0) {
        logger.blank();
        console.log(chalk.bold('Dependencies:'));
        console.log(`  ${chalk.cyan(plan.dependencies.join(', '))}`);
      }

      logger.blank();

      if (isDryRun) {
        logger.success('Dry-run completed successfully. No files written.');
        return;
      }

      if (!isAutoYes) {
        const approved = await confirm({
          message: 'Generate UI from this proposed configuration?',
          default: true,
        });

        if (!approved) {
          logger.dim('Generation cancelled.');
          return;
        }
      }

      logger.blank();
      logger.heading('Generating Source Code...');

      // Apply theme
      const activeConfig = projectConfig ?? DEFAULT_CONFIG;
      const themeSpinner = createSpinner(`Applying ${validConfig.theme} theme...`).start();
      try {
        await generateTheme(validConfig.theme, { cwd, config: activeConfig });
        themeSpinner.succeed(`Theme ${chalk.bold(validConfig.theme)} configured`);
      } catch {
        themeSpinner.warn('Theme styles skipped or already configured');
      }

      // Generate components
      for (const file of plan.files.filter((f) => f.templateId.startsWith('component-'))) {
        const slug = file.templateId.replace('component-', '');
        const spinner = createSpinner(`  Writing component: ${slug}`).start();
        try {
          const res = await generateComponent(slug, {
            cwd,
            config: activeConfig,
            overwrite: validConfig.force,
          });
          if (res.success) {
            spinner.succeed(`  Component: ${chalk.green(slug)} → ${file.relativePath}`);
          } else {
            spinner.warn(`  Component: ${chalk.dim(slug)} (skipped)`);
          }
        } catch (err) {
          spinner.fail(`  Component ${slug} failed: ${err}`);
        }
      }

      // Generate sections
      for (const file of plan.files.filter((f) => f.templateId.startsWith('section-'))) {
        const slug = file.templateId.replace('section-', '');
        const spinner = createSpinner(`  Writing section: ${slug}`).start();
        try {
          const res = await generateSection(slug, {
            cwd,
            config: activeConfig,
            overwrite: validConfig.force,
          });
          if (res.success) {
            spinner.succeed(`  Section: ${chalk.green(slug)} → ${file.relativePath}`);
          } else {
            spinner.warn(`  Section: ${chalk.dim(slug)} (skipped)`);
          }
        } catch (err) {
          spinner.fail(`  Section ${slug} failed: ${err}`);
        }
      }

      // Generate Barrel
      const sectionsDir = activeConfig.paths.sections ?? path.join(validConfig.outputDir, 'sections');
      const barrelFile = path.join(cwd, sectionsDir, 'index.ts');
      const barrelContent = validConfig.sections
        .map(
          (s) =>
            `export { ${s.charAt(0).toUpperCase() + s.slice(1)} } from './${s}.js';`
        )
        .join('\n');
      await fs.writeFile(barrelFile, await formatCode(barrelContent));
      console.log(`  ${chalk.green('+ Barrel Export')} → ${path.join(sectionsDir, 'index.ts')}`);

      // Generate page
      const pageType: PageType =
        validConfig.interface === 'landing-page' || validConfig.interface === 'landing'
          ? 'landing'
          : validConfig.interface === 'dashboard'
          ? 'dashboard'
          : validConfig.interface === 'auth'
          ? 'auth-login'
          : 'landing';

      const pageSpinner = createSpinner(`  Writing page template...`).start();
      try {
        const pageRes = await generatePage(pageType, {
          cwd,
          config: activeConfig,
          overwrite: validConfig.force,
        });
        if (pageRes.success) {
          pageSpinner.succeed(`  Page entry point: ${chalk.green(pageRes.file?.replace(cwd, ''))}`);
        } else {
          pageSpinner.warn(`  Page: ${chalk.dim(pageRes.error ?? 'skipped')}`);
        }
      } catch {
        pageSpinner.warn('  Page generation skipped');
      }

      logger.blank();
      logger.success(chalk.bold('✔ Generation completed successfully!'));
      logger.blank();
      logger.dim('Next steps:');
      logger.log(`  1. Review generated files in ${chalk.cyan(validConfig.outputDir)}`);
      logger.log(`  2. Run your dev server: ${chalk.cyan('npm run dev')}`);
      logger.blank();
    });
}
