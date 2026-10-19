import * as React from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  badge?: string;
  headline: string;
  subheadline?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  media?: React.ReactNode;
  variant?: 'center' | 'split' | 'gradient' | 'minimal';
  className?: string;
}

function Hero({
  badge,
  headline,
  subheadline,
  primaryAction,
  secondaryAction,
  media,
  variant = 'center',
  className,
}: HeroProps) {
  if (variant === 'split' && media) {
    return (
      <section className={cn('relative overflow-hidden py-20 lg:py-32', className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              {badge && (
                <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1 text-sm text-[var(--color-muted-foreground)]">
                  {badge}
                </span>
              )}
              <h1 className="text-4xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
                {headline}
              </h1>
              {subheadline && (
                <p className="max-w-xl text-lg text-[var(--color-muted-foreground)] leading-relaxed">
                  {subheadline}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {primaryAction && (
                  <a
                    href={primaryAction.href}
                    className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-8 text-sm font-semibold text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90"
                  >
                    {primaryAction.label}
                  </a>
                )}
                {secondaryAction && (
                  <a
                    href={secondaryAction.href}
                    className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-8 text-sm font-semibold transition-colors hover:bg-[var(--color-accent)]"
                  >
                    {secondaryAction.label}
                  </a>
                )}
              </div>
            </div>
            <div className="relative">{media}</div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'gradient') {
    return (
      <section className={cn('relative overflow-hidden py-24 lg:py-40', className)}>
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-[var(--color-secondary)] opacity-10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center">
          {badge && (
            <span className="mb-6 inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-sm text-[var(--color-primary)]">
              {badge}
            </span>
          )}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-foreground)] bg-clip-text text-transparent">
              {headline}
            </span>
          </h1>
          {subheadline && (
            <p className="mx-auto mt-6 max-w-2xl text-xl text-[var(--color-muted-foreground)] leading-relaxed">
              {subheadline}
            </p>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {primaryAction && (
              <a
                href={primaryAction.href}
                className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-10 text-base font-semibold text-[var(--color-primary-foreground)] shadow-lg transition-opacity hover:opacity-90"
              >
                {primaryAction.label}
              </a>
            )}
            {secondaryAction && (
              <a
                href={secondaryAction.href}
                className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] px-10 text-base font-semibold transition-colors hover:bg-[var(--color-accent)]"
              >
                {secondaryAction.label}
              </a>
            )}
          </div>
        </div>
        {media && <div className="mx-auto mt-16 max-w-5xl px-4">{media}</div>}
      </section>
    );
  }

  // Default: center
  return (
    <section className={cn('py-24 lg:py-32', className)}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        {badge && (
          <span className="mb-6 inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1 text-sm text-[var(--color-muted-foreground)]">
            {badge}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="mx-auto mt-6 max-w-2xl text-xl text-[var(--color-muted-foreground)] leading-relaxed">
            {subheadline}
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {primaryAction && (
            <a
              href={primaryAction.href}
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-8 text-sm font-semibold text-[var(--color-primary-foreground)] shadow transition-opacity hover:opacity-90"
            >
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-8 text-sm font-semibold transition-colors hover:bg-[var(--color-accent)]"
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
        {media && <div className="mt-16">{media}</div>}
      </div>
    </section>
  );
}

export { Hero, type HeroProps };
