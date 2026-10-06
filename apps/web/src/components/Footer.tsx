import React from 'react';
import Link from 'next/link';
import { Terminal, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">UIGen</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CLI-first UI generation platform. Choose your components, own the source code, and ship lightning-fast interfaces.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">CLI & Primitives</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/components" className="hover:text-white transition-colors">Primitives & Components</Link></li>
              <li><Link href="/components?type=section" className="hover:text-white transition-colors">Pre-built Sections</Link></li>
              <li><Link href="/themes" className="hover:text-white transition-colors">Design Token Themes</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Interactive Command CLI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><a href="http://localhost:4000/api/health" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">REST API Health</a></li>
              <li><a href="http://localhost:4000/api/v1/registry/index" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Registry Manifest</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Architecture</h4>
            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>CLI Engine:</span>
                <span className="text-indigo-400 font-mono">packages/cli</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Backend API:</span>
                <span className="text-emerald-400 font-mono">apps/api :4000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Web Frontend:</span>
                <span className="text-violet-400 font-mono">apps/web :3000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} UIGen Platform. Open source developer tool.</p>
          <p className="flex items-center gap-1 mt-4 sm:mt-0">
            Crafted for developers with modern Next.js, Express & TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
