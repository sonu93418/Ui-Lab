#!/usr/bin/env node

import { program } from 'commander';
import { printBanner } from '@uigen/utils';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { createCommand } from './commands/create.js';
import { generateCommand } from './commands/generate.js';
import { listCommand } from './commands/list.js';
import { themeCommand } from './commands/theme.js';
import { doctorCommand } from './commands/doctor.js';
import { removeCommand } from './commands/remove.js';
import { searchCommand } from './commands/search.js';
import { configCommand } from './commands/config.js';
import { fixCommand } from './commands/fix.js';

const pkg = { version: '0.1.0' };

program
  .name('uigen')
  .description('UIGen — CLI-first UI generation platform')
  .version(pkg.version, '-v, --version', 'Output the current version');

// ─── Commands ────────────────────────────────────────────────────────────────

program.addCommand(initCommand());
program.addCommand(createCommand());
program.addCommand(generateCommand());
program.addCommand(addCommand());
program.addCommand(removeCommand());
program.addCommand(listCommand());
program.addCommand(searchCommand());
program.addCommand(themeCommand());
program.addCommand(configCommand());
program.addCommand(doctorCommand());
program.addCommand(fixCommand());

// Show banner when no command provided
program.action(() => {
  printBanner();
  program.help();
});

program.parseAsync(process.argv).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
