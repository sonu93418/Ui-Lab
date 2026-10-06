'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronRight, BookOpen, Layers, Settings, ShieldCheck, Zap } from 'lucide-react';

export default function DocsPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const cliCommands = [
    {
      name: 'uigen init',
      description: 'Initializes UIGen in an existing project. Auto-detects Next.js/React, TypeScript, Tailwind CSS, and prompts for design theme and path aliases.',
      flags: ['-t, --theme <theme>', '-y, --yes'],
      example: 'npx uigen init',
    },
    {
      name: 'uigen add <components...>',
      description: 'Downloads and writes one or more component or section source files into your project. Automatically installs missing dependencies.',
      flags: ['-o, --overwrite', '-a, --all', '-p, --path <dir>'],
      example: 'npx uigen add button modal navbar hero',
    },
    {
      name: 'uigen create',
      description: 'Interactive interface generator. Choose full page templates (landing, dashboard, auth) and select which sections to assemble.',
      flags: ['-t, --template <name>', '-p, --path <dir>'],
      example: 'npx uigen create',
    },
    {
      name: 'uigen theme apply <name>',
      description: 'Applies a design token theme to your project CSS variables. Updates tailwind theme tokens seamlessly.',
      flags: ['--list'],
      example: 'npx uigen theme apply violet',
    },
    {
      name: 'uigen list',
      description: 'Displays a table of all available primitives, composite components, sections, and themes.',
      flags: ['--category <cat>', '--type <type>'],
      example: 'npx uigen list',
    },
    {
      name: 'uigen doctor',
      description: 'Runs 8 diagnostic health checks verifying Node environment, package manager, Tailwind config, TypeScript setup, and registry health.',
      flags: ['--verbose'],
      example: 'npx uigen doctor',
    },
    {
      name: 'uigen search <query>',
      description: 'Searches the component and section registry by name, slug, tag, or category.',
      flags: [],
      example: 'npx uigen search form',
    },
    {
      name: 'uigen remove <slug>',
      description: 'Safely removes a generated component file with an interactive confirmation prompt.',
      flags: ['-f, --force'],
      example: 'npx uigen remove button',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">CLI Documentation & Reference</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          Comprehensive guide to using the UIGen command line interface for code generation, themes, and template assembly.
        </p>
      </div>

      {/* Quick Setup Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border/80 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          Quick Start in 3 Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-border/60 space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">01</span>
            <h3 className="font-semibold text-white text-sm">Initialize Project</h3>
            <p className="text-xs text-muted-foreground">Creates `uigen.json` and configures Tailwind CSS theme variables.</p>
            <div className="p-2 rounded bg-zinc-900 font-mono text-xs text-zinc-300">
              $ npx uigen init
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-border/60 space-y-3">
            <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">02</span>
            <h3 className="font-semibold text-white text-sm">Add Components</h3>
            <p className="text-xs text-muted-foreground">Injects TypeScript source code directly into your `@/components/ui` directory.</p>
            <div className="p-2 rounded bg-zinc-900 font-mono text-xs text-zinc-300">
              $ npx uigen add button modal
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-border/60 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">03</span>
            <h3 className="font-semibold text-white text-sm">Build Full Pages</h3>
            <p className="text-xs text-muted-foreground">Generate complete landing pages, auth screens, or dashboard shells.</p>
            <div className="p-2 rounded bg-zinc-900 font-mono text-xs text-zinc-300">
              $ npx uigen create
            </div>
          </div>
        </div>
      </div>

      {/* CLI Reference List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Command Reference
        </h2>

        <div className="space-y-4">
          {cliCommands.map((cmd) => (
            <div
              key={cmd.name}
              className="glass-panel p-6 rounded-2xl border border-border/70 space-y-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-border text-sm font-mono font-semibold text-white">
                    {cmd.name}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(cmd.example)}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-all"
                >
                  {copiedCmd === cmd.example ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy: {cmd.example}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {cmd.description}
              </p>

              {cmd.flags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-zinc-500 font-mono">Flags:</span>
                  {cmd.flags.map((flag) => (
                    <span
                      key={flag}
                      className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
