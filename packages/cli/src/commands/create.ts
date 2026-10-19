import { Command } from 'commander';
import { select, checkbox, confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import path from 'path';
import { loadConfig, CreateConfigSchema, DEFAULT_CONFIG, type CreateConfig } from '@uigen/config';
import { THEMES_REGISTRY } from '@uigen/registry';
import {
  generatePage,
  generateSection,
  generateComponent,
  generateTheme,
  createGenerationPlan,
  detectProject,
  formatCode,
  type PageType,
} from '@uigen/generator';
import { logger, createSpinner, fs } from '@uigen/utils';

const INTERFACE_CHOICES = [
  { value: 'landing-page', name: 'Landing page', description: 'Full SaaS/startup landing page with hero, features, pricing, and FAQ' },
  { value: 'dashboard', name: 'Dashboard', description: 'Analytics dashboard with sidebar, stats metrics, and data tables' },
  { value: 'auth', name: 'Authentication', description: 'Complete login, signup, and account verification flow' },
  { value: 'portfolio', name: 'Portfolio', description: 'Developer or agency portfolio showcase' },
] as const;

const LANDING_SECTION_CHOICES = [
  { value: 'navbar', name: 'Navbar', checked: true },
  { value: 'hero', name: 'Hero', checked: true },
  { value: 'features', name: 'Features', checked: true },
  { value: 'pricing', name: 'Pricing', checked: true },
  { value: 'footer', name: 'Footer', checked: true },
  { value: 'testimonials', name: 'Testimonials', checked: false },
  { value: 'faq', name: 'FAQ', checked: false },
  { value: 'cta', name: 'Call to Action (CTA)', checked: false },
  { value: 'newsletter', name: 'Newsletter', checked: false },
];

export function createCommand(): Command {
  return new Command('create')
    .description('Create a complete, coherent interface with interactive wizard or flags')
    .option('--interface <type>', 'Interface type: landing-page, dashboard, auth, portfolio', 'landing-page')
    .option('--framework <framework>', 'Target framework: next, react, vite', 'next')
    .option('--theme <theme>', 'Theme name: modern, minimal, dark, glass, corporate', 'modern')
    .option('--color-mode <mode>', 'Color mode: system, light, dark', 'system')
    .option('--variant <variant>', 'Design variant: standard, premium', 'premium')
    .option('--sections <sections>', 'Comma-separated list of sections (e.g. navbar,hero,features,pricing,footer)')
    .option('--out-dir <path>', 'Output directory', 'src/components')
    .option('--dry-run', 'Preview planned files and dependencies without writing', false)
    .option('-y, --yes', 'Approve generation plan automatically', false)
    .option('--force', 'Overwrite existing files', false)
    .option('--cwd <path>', 'Working directory', process.cwd())
    .action(async (opts) => {
      const cwd = opts.cwd as string;
      const isDryRun = Boolean(opts.dryRun);
      const isAutoYes = Boolean(opts.yes);
      const isForce = Boolean(opts.force);

      // Step 1: Detect project
      const detected = await detectProject(cwd);
      const projectConfig = await loadConfig(cwd);

      // Parse flags / inputs
      let selectedInterface = opts.interface;
      if (selectedInterface === 'landing') selectedInterface = 'landing-page';

      let selectedFramework = opts.framework ?? (detected.framework !== 'unknown' ? detected.framework : 'next');
      let selectedTheme = opts.theme ?? projectConfig?.theme ?? 'modern';
      let selectedColorMode = opts.colorMode ?? projectConfig?.darkMode ?? 'system';
      let selectedVariant = opts.variant ?? 'premium';
      let selectedSections: string[] = opts.sections
        ? opts.sections.split(/[,\s]+/).map((s: string) => s.trim().toLowerCase()).filter(Boolean)
        : [];
      let outputDir = opts.outDir ?? 'src/components';

      const isNonInteractive = Boolean(opts.sections || isAutoYes);

      if (!isNonInteractive) {
        logger.heading('UIGen · Create interface');
        logger.dim('Choose options, preview files, approve, and generate.\n');

        // Step 2: Interface
        selectedInterface = await select({
          message: 'Choose an interface type',
          choices: INTERFACE_CHOICES.map((i) => ({
            value: i.value,
            name: `${i.name.padEnd(16)} ${chalk.dim(i.description)}`,
            short: i.name,
          })),
          default: selectedInterface,
        });

        // Step 3: Framework
        selectedFramework = await select({
          message: 'Choose target framework',
          choices: [
            { value: 'next', name: 'Next.js (App Router / Pages Router)' },
            { value: 'react', name: 'React + Vite' },
          ],
          default: selectedFramework === 'react' ? 'react' : 'next',
        });

        // Step 4: Theme
        selectedTheme = await select({
          message: 'Choose a design theme',
          choices: THEMES_REGISTRY.map((t) => ({
            value: t.slug,
            name: `${t.name.padEnd(14)} ${chalk.dim(t.description)}`,
            short: t.name,
          })),
          default: selectedTheme,
        });

        // Step 5: Color Mode
        selectedColorMode = await select({
          message: 'Choose color mode strategy',
          choices: [
            { value: 'system', name: 'System (auto dark / light with theme tokens)' },
            { value: 'dark', name: 'Dark mode' },
            { value: 'light', name: 'Light mode' },
          ],
          default: selectedColorMode,
        });

        // Step 6: Design Variant
        selectedVariant = await select({
          message: 'Choose a design variant',
          choices: [
            { value: 'premium', name: 'Premium   — Refined spacing, stronger typography, polished cards' },
            { value: 'standard', name: 'Standard  — Clean layout, subtle surfaces, minimal decoration' },
          ],
          default: selectedVariant,
        });

        // Step 7: Sections
        if (selectedInterface === 'landing-page') {
          selectedSections = await checkbox({
            message: 'Select landing page sections to include',
            choices: LANDING_SECTION_CHOICES,
          });
        } else {
          selectedSections = ['main'];
        }

        // Step 8: Confirm output directory
        outputDir = await input({
          message: 'Output directory',
          default: outputDir,
        });
      } else {
        if (selectedSections.length === 0) {
          selectedSections = ['navbar', 'hero', 'features', 'pricing', 'footer'];
        }
      }

      // Validate configuration using Section 9 Zod Schema
      const validationResult = CreateConfigSchema.safeParse({
        interface: selectedInterface,
        framework: selectedFramework,
        theme: selectedTheme,
        colorMode: selectedColorMode,
        variant: selectedVariant,
        sections: selectedSections,
        outputDir,
        dryRun: isDryRun,
        yes: isAutoYes,
        force: isForce,
      });

      if (!validationResult.success) {
        logger.error('Invalid configuration:');
        validationResult.error.errors.forEach((err) => {
          logger.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
      }

      const validConfig: CreateConfig = validationResult.data;

      // Step 9: Compute generation plan manifest
      const plan = await createGenerationPlan(validConfig, { cwd, projectConfig });

      logger.blank();
      logger.heading('Generation Plan');
      logger.dim(`Interface:   ${chalk.cyan(validConfig.interface)}`);
      logger.dim(`Theme:       ${chalk.cyan(validConfig.theme)} (${validConfig.variant} variant)`);
      logger.dim(`Color Mode:  ${chalk.cyan(validConfig.colorMode)}`);
      logger.dim(`Output Dir:  ${chalk.cyan(validConfig.outputDir)}`);
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
        console.log(chalk.bold('Required Dependencies:'));
        console.log(`  ${chalk.cyan(plan.dependencies.join(', '))}`);
      }

      if (plan.warnings.length > 0) {
        logger.blank();
        plan.warnings.forEach((w) => logger.warn(`  ${w}`));
      }

      logger.blank();

      // Step 10: Approval
      if (isDryRun) {
        logger.success('Dry-run completed successfully. No files written.');
        return;
      }

      if (!isAutoYes) {
        const approved = await confirm({
          message: 'Proceed with generating these files?',
          default: true,
        });

        if (!approved) {
          logger.dim('Generation cancelled by user.');
          return;
        }
      }

      // Step 11: Generate, Validate & Report
      logger.blank();
      logger.heading('Generating Source Code...');

      // 1. Generate Theme tokens if needed
      const activeConfig = projectConfig ?? DEFAULT_CONFIG;
      const themeSpinner = createSpinner(`Applying ${validConfig.theme} theme...`).start();
      try {
        await generateTheme(validConfig.theme, { cwd, config: activeConfig });
        themeSpinner.succeed(`Theme ${chalk.bold(validConfig.theme)} configured`);
      } catch {
        themeSpinner.warn('Theme styles skipped or already configured');
      }

      // 2. Generate required components
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

      // 3. Generate sections
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

      // 4. Generate Section Barrel index.ts
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

      // 5. Generate page if requested
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
