'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  actions?: React.ReactNode;
  variant?: 'default' | 'transparent' | 'glass' | 'centered' | 'minimal';
  className?: string;
}

function Navbar({ logo, links = [], actions, variant = 'default', className }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const containerClass = cn(
    'sticky top-0 z-50 w-full transition-all duration-300',
    variant === 'default' &&
      'border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60',
    variant === 'transparent' &&
      cn(
        'bg-transparent',
        scrolled &&
          'border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur'
      ),
    variant === 'glass' && 'border-b border-white/10 bg-white/10 backdrop-blur-md',
    variant === 'minimal' && 'bg-transparent',
    variant === 'centered' && 'border-b border-[var(--color-border)] bg-[var(--color-background)]',
    className
  );

  return (
    <header className={containerClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex h-16 items-center',
            variant === 'centered' ? 'justify-center gap-8' : 'justify-between'
          )}
        >
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            {logo ?? (
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                UIGen
              </span>
            )}
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">{actions}</div>

          {/* Mobile toggle */}
          <button
            className="flex md:hidden items-center justify-center rounded-[var(--radius-md)] p-2 text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {actions && <div className="mt-4 flex flex-col gap-2">{actions}</div>}
        </div>
      )}
    </header>
  );
}

export { Navbar, type NavLink };
