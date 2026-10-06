#!/usr/bin/env node

import { program } from 'commander';
import { printBanner } from '@uigen/utils';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { createCommand } from './commands/create.js';
import { listCommand } from './commands/list.js';
import { themeCommand } from './commands/theme.js';
import { doctorCommand } from './commands/doctor.js';
import { removeCommand } from './commands/remove.js';
import { searchCommand } from './commands/search.js';

const pkg = { version: '0.1.0' };

program
  .name('uigen')
  .description('UIGen — CLI-first UI generation platform')
  .version(pkg.version, '-v, --version', 'Output the current version');

// ─── Commands ────────────────────────────────────────────────────────────────

program.addCommand(initCommand());
program.addCommand(addCommand());
program.addCommand(createCommand());
program.addCommand(listCommand());
program.addCommand(themeCommand());
program.addCommand(doctorCommand());
program.addCommand(removeCommand());
program.addCommand(searchCommand());

// Show banner when no command provided
program.action(() => {
  printBanner();
  program.help();
});

program.parseAsync(process.argv).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
