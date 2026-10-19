import * as React from 'react';
import { cn } from '@/lib/utils';

interface FooterLink {
  label: string;
  href: string;
}
interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  sections?: FooterSection[];
  socials?: { label: string; href: string; icon: React.ReactNode }[];
  copyright?: string;
  className?: string;
}

function Footer({
  logo,
  description,
  sections = [],
  socials = [],
  copyright,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn('border-t border-[var(--color-border)] bg-[var(--color-card)]', className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            {logo ?? (
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                UIGen
              </span>
            )}
            {description && (
              <p className="mt-3 max-w-xs text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                {description}
              </p>
            )}
            {socials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    aria-label={s.label}
                    className="text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-muted-foreground)]">
          {copyright ?? `© ${new Date().getFullYear()} UIGen. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}

export { Footer, type FooterSection, type FooterLink };
