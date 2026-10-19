'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingPlan {
  name: string;
  price: { monthly: number | string; annual?: number | string };
  description: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  badge?: string;
}

interface PricingProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  plans: PricingPlan[];
  className?: string;
}

function Pricing({ eyebrow, headline, subheadline, plans, className }: PricingProps) {
  const [annual, setAnnual] = React.useState(false);

  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>
          {subheadline && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">{subheadline}</p>
          )}
          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={`text-sm ${!annual ? 'font-semibold' : 'text-[var(--color-muted-foreground)]'}`}
            >
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${annual ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'}`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span
              className={`text-sm ${annual ? 'font-semibold' : 'text-[var(--color-muted-foreground)]'}`}
            >
              Annual{' '}
              <span className="text-[var(--color-success,#10b981)] text-xs font-semibold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-[var(--radius-xl)] border p-8 transition-shadow hover:shadow-lg',
                plan.highlighted
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-xl'
                  : 'border-[var(--color-border)] bg-[var(--color-card)]'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-secondary)] px-3 py-0.5 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p
                  className={`mt-1 text-sm ${plan.highlighted ? 'opacity-80' : 'text-[var(--color-muted-foreground)]'}`}
                >
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">
                    {typeof plan.price.monthly === 'number'
                      ? `$${annual && plan.price.annual ? plan.price.annual : plan.price.monthly}`
                      : plan.price.monthly}
                  </span>
                  {typeof plan.price.monthly === 'number' && (
                    <span
                      className={`text-sm ${plan.highlighted ? 'opacity-70' : 'text-[var(--color-muted-foreground)]'}`}
                    >
                      /mo
                    </span>
                  )}
                </div>
              </div>
              <ul className="mb-8 flex flex-col gap-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? 'opacity-90' : 'text-[var(--color-primary)]'}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.cta.href}
                className={cn(
                  'flex h-11 items-center justify-center rounded-[var(--radius-md)] px-6 text-sm font-semibold transition-all',
                  plan.highlighted
                    ? 'bg-white text-[var(--color-primary)] hover:bg-white/90'
                    : 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90'
                )}
              >
                {plan.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Pricing, type PricingPlan };
