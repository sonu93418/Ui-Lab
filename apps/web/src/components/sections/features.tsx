import * as React from 'react';
import { cn } from '@/lib/utils';

interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  features: Feature[];
  variant?: 'grid' | 'list' | 'alternating';
  columns?: 2 | 3 | 4;
  className?: string;
}

function Features({
  eyebrow,
  headline,
  subheadline,
  features,
  variant = 'grid',
  columns = 3,
  className,
}: FeaturesProps) {
  const colClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">{subheadline}</p>
          )}
        </div>

        {/* Features grid */}
        <div className={`grid gap-8 ${colClass}`}>
          {features.map((feature, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-shadow hover:shadow-md"
            >
              {feature.icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-primary)]">
                  {feature.icon}
                </div>
              )}
              <h3 className="text-base font-semibold text-[var(--color-foreground)]">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Features, type Feature };
