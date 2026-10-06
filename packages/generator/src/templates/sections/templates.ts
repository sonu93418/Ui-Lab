// Navbar section template
export const navbarTemplate = `'use client';

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

function Navbar({
  logo,
  links = [],
  actions,
  variant = 'default',
  className,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const containerClass = cn(
    'sticky top-0 z-50 w-full transition-all duration-300',
    variant === 'default' && 'border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60',
    variant === 'transparent' && cn('bg-transparent', scrolled && 'border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur'),
    variant === 'glass' && 'border-b border-white/10 bg-white/10 backdrop-blur-md',
    variant === 'minimal' && 'bg-transparent',
    variant === 'centered' && 'border-b border-[var(--color-border)] bg-[var(--color-background)]',
    className
  );

  return (
    <header className={containerClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn('flex h-16 items-center', variant === 'centered' ? 'justify-center gap-8' : 'justify-between')}>
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
          <div className="hidden md:flex items-center gap-3">
            {actions}
          </div>

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
`;

// Hero section template
export const heroTemplate = `import * as React from 'react';
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
              <a href={primaryAction.href} className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-10 text-base font-semibold text-[var(--color-primary-foreground)] shadow-lg transition-opacity hover:opacity-90">
                {primaryAction.label}
              </a>
            )}
            {secondaryAction && (
              <a href={secondaryAction.href} className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] px-10 text-base font-semibold transition-colors hover:bg-[var(--color-accent)]">
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
            <a href={primaryAction.href} className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-8 text-sm font-semibold text-[var(--color-primary-foreground)] shadow transition-opacity hover:opacity-90">
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a href={secondaryAction.href} className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-8 text-sm font-semibold transition-colors hover:bg-[var(--color-accent)]">
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
`;

// Features section template
export const featuresTemplate = `import * as React from 'react';
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
  const colClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];

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
        <div className={\`grid gap-8 \${colClass}\`}>
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
              <h3 className="text-base font-semibold text-[var(--color-foreground)]">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Features, type Feature };
`;

// Pricing section template
export const pricingTemplate = `'use client';

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
            <span className={\`text-sm \${!annual ? 'font-semibold' : 'text-[var(--color-muted-foreground)]'}\`}>Monthly</span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((v) => !v)}
              className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${annual ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'}\`}
            >
              <span className={\`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform \${annual ? 'translate-x-6' : 'translate-x-1'}\`} />
            </button>
            <span className={\`text-sm \${annual ? 'font-semibold' : 'text-[var(--color-muted-foreground)]'}\`}>
              Annual <span className="text-[var(--color-success,#10b981)] text-xs font-semibold">Save 20%</span>
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
                <p className={\`mt-1 text-sm \${plan.highlighted ? 'opacity-80' : 'text-[var(--color-muted-foreground)]'}\`}>
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">
                    {typeof plan.price.monthly === 'number'
                      ? \`$\${annual && plan.price.annual ? plan.price.annual : plan.price.monthly}\`
                      : plan.price.monthly}
                  </span>
                  {typeof plan.price.monthly === 'number' && (
                    <span className={\`text-sm \${plan.highlighted ? 'opacity-70' : 'text-[var(--color-muted-foreground)]'}\`}>/mo</span>
                  )}
                </div>
              </div>
              <ul className="mb-8 flex flex-col gap-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={\`mt-0.5 h-4 w-4 shrink-0 \${plan.highlighted ? 'opacity-90' : 'text-[var(--color-primary)]'}\`} />
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
`;

// Testimonials section template
export const testimonialsTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsProps {
  eyebrow?: string;
  headline: string;
  testimonials: Testimonial[];
  variant?: 'grid' | 'featured';
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={\`Rating: \${rating} out of 5\`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={\`h-4 w-4 \${i < rating ? 'text-[var(--color-warning,#f59e0b)]' : 'text-[var(--color-muted)]'}\`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Testimonials({ eyebrow, headline, testimonials, variant = 'grid', className }: TestimonialsProps) {
  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">{eyebrow}</p>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              {t.rating && <StarRating rating={t.rating} />}
              <blockquote className="flex-1 text-sm leading-relaxed text-[var(--color-foreground)]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.author} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-muted)] text-xs font-semibold">
                    {t.author.split(' ').map(w => w[0]).join('').toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {t.role}{t.company ? \` · \${t.company}\` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Testimonials, type Testimonial };
`;

// FAQ section template
export const faqTemplate = `'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  items: FAQItem[];
  className?: string;
}

function FAQAccordionItem({ item, defaultOpen = false }: { item: FAQItem; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-[var(--color-foreground)]">{item.question}</span>
        <ChevronDown className={\`h-5 w-5 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200 \${open ? 'rotate-180' : ''}\`} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-96 pb-5' : 'max-h-0')}>
        <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">{item.answer}</p>
      </div>
    </div>
  );
}

function FAQ({ eyebrow, headline, subheadline, items, className }: FAQProps) {
  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">{eyebrow}</p>
          )}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>
          {subheadline && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">{subheadline}</p>
          )}
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] px-6">
          {items.map((item, i) => (
            <FAQAccordionItem key={i} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { FAQ, type FAQItem };
`;

// Footer section template
export const footerTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

interface FooterLink { label: string; href: string; }
interface FooterSection { title: string; links: FooterLink[]; }

interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  sections?: FooterSection[];
  socials?: { label: string; href: string; icon: React.ReactNode }[];
  copyright?: string;
  className?: string;
}

function Footer({ logo, description, sections = [], socials = [], copyright, className }: FooterProps) {
  return (
    <footer className={cn('border-t border-[var(--color-border)] bg-[var(--color-card)]', className)}>
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
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
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
          {copyright ?? \`© \${new Date().getFullYear()} UIGen. All rights reserved.\`}
        </div>
      </div>
    </footer>
  );
}

export { Footer, type FooterSection, type FooterLink };
`;

// CTA section template
export const ctaTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

interface CTAProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  variant?: 'default' | 'gradient' | 'card' | 'centered';
  className?: string;
}

function CTA({ eyebrow, headline, subheadline, primaryAction, secondaryAction, variant = 'centered', className }: CTAProps) {
  if (variant === 'gradient') {
    return (
      <section className={cn('relative overflow-hidden py-20', className)}>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
        <div className="mx-auto max-w-3xl px-4 text-center text-white">
          {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-80">{eyebrow}</p>}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>
          {subheadline && <p className="mx-auto mt-4 max-w-xl text-lg opacity-85">{subheadline}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={primaryAction.href} className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-white px-8 text-sm font-semibold text-[var(--color-primary)] hover:bg-white/90 transition-colors">
              {primaryAction.label}
            </a>
            {secondaryAction && (
              <a href={secondaryAction.href} className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-8 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                {secondaryAction.label}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-accent)] p-12 text-center">
          {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">{eyebrow}</p>}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>
          {subheadline && <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-muted-foreground)]">{subheadline}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={primaryAction.href} className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-8 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90 transition-opacity">
              {primaryAction.label}
            </a>
            {secondaryAction && (
              <a href={secondaryAction.href} className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-8 text-sm font-semibold hover:bg-[var(--color-card)] transition-colors">
                {secondaryAction.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTA, type CTAProps };
`;

// Stats section template
export const statsTemplate = `import * as React from 'react';
import { cn } from '@/lib/utils';

interface Stat { label: string; value: string; description?: string; }

interface StatsProps {
  eyebrow?: string;
  headline?: string;
  stats: Stat[];
  variant?: 'grid' | 'inline' | 'bordered';
  className?: string;
}

function Stats({ eyebrow, headline, stats, variant = 'grid', className }: StatsProps) {
  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || headline) && (
          <div className="mb-12 text-center">
            {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">{eyebrow}</p>}
            {headline && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>}
          </div>
        )}
        <div className={cn(
          'grid gap-8',
          variant === 'bordered' && 'divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden',
          stats.length <= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'
        )}>
          {stats.map((stat, i) => (
            <div key={i} className={cn('text-center', variant === 'bordered' && 'p-8')}>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-foreground)]">{stat.label}</p>
              {stat.description && <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{stat.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Stats, type Stat };
`;

// Newsletter section template
export const newsletterTemplate = `'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface NewsletterProps {
  headline: string;
  subheadline?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubscribe?: (email: string) => Promise<void> | void;
  variant?: 'default' | 'card' | 'inline';
  className?: string;
}

function Newsletter({ headline, subheadline, placeholder = 'Enter your email', buttonLabel = 'Subscribe', onSubscribe, variant = 'default', className }: NewsletterProps) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubscribe?.(email);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        aria-label="Email address"
        className="h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--color-input)] bg-transparent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] placeholder:text-[var(--color-muted-foreground)]"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 text-sm font-semibold text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Subscribing...' : buttonLabel}
      </button>
    </form>
  );

  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{headline}</h2>
        {subheadline && <p className="mt-3 text-[var(--color-muted-foreground)]">{subheadline}</p>}
        {submitted ? (
          <p className="mt-6 text-[var(--color-success,#10b981)] font-medium">You're subscribed! 🎉</p>
        ) : (
          <div className="mt-6">
            {Form}
            {error && <p className="mt-2 text-sm text-[var(--color-destructive)]">{error}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export { Newsletter };
`;
