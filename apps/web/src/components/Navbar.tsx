'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Box, Palette, BookOpen, ShieldCheck, Github, Menu, X, ChevronRight } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              UIGen
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">CLI v0.1</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-muted-foreground">
          <Link
            href="/components"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
          >
            <Box className="w-4 h-4 text-indigo-400" />
            Components
          </Link>
          <Link
            href="/themes"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
          >
            <Palette className="w-4 h-4 text-violet-400" />
            Themes
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Docs & CLI
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Admin API
          </Link>
        </nav>

        {/* CTA & Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
          >
            Get Started
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/components"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-white/5"
          >
            Components
          </Link>
          <Link
            href="/themes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-white/5"
          >
            Themes
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-white/5"
          >
            Docs & CLI
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-white/5"
          >
            Admin API
          </Link>
        </div>
      )}
    </header>
  );
}
