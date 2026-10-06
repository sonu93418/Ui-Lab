import path from 'path';
import type { UIGenConfig } from '@uigen/config';
import { fs } from '@uigen/utils';
import { formatCode } from './formatter.js';

export type PageType = 'landing' | 'dashboard' | 'auth-login' | 'auth-register' | '404';

const PAGE_TEMPLATES: Record<PageType, (config: UIGenConfig) => string> = {
  landing: (config) => `'use client';

import { Navbar } from '@/${config.paths.sections.replace('src/', '')}/navbar';
import { Hero } from '@/${config.paths.sections.replace('src/', '')}/hero';
import { Features } from '@/${config.paths.sections.replace('src/', '')}/features';
import { Pricing } from '@/${config.paths.sections.replace('src/', '')}/pricing';
import { Testimonials } from '@/${config.paths.sections.replace('src/', '')}/testimonials';
import { FAQ } from '@/${config.paths.sections.replace('src/', '')}/faq';
import { CTA } from '@/${config.paths.sections.replace('src/', '')}/cta';
import { Footer } from '@/${config.paths.sections.replace('src/', '')}/footer';
import { Button } from '@/${config.paths.components.replace('src/', '')}/button';
import { Zap, Shield, Paintbrush, Terminal, Code2, Layers } from 'lucide-react';

const FEATURES = [
  { icon: <Terminal className="h-5 w-5" />, title: 'CLI First', description: 'Generate production-ready UI directly from your terminal in seconds.' },
  { icon: <Code2 className="h-5 w-5" />, title: 'Own Your Code', description: 'Generated source code lives in your project. No runtime dependencies.' },
  { icon: <Paintbrush className="h-5 w-5" />, title: '5 Premium Themes', description: 'Modern, Minimal, Dark, Glass, and Corporate — all token-based.' },
  { icon: <Layers className="h-5 w-5" />, title: 'Composable', description: 'Mix components, sections, layouts, and pages freely.' },
  { icon: <Zap className="h-5 w-5" />, title: 'Instant Generation', description: 'Complex pages generated in under 10 seconds with all dependencies.' },
  { icon: <Shield className="h-5 w-5" />, title: 'Accessible', description: 'Every component meets WCAG accessibility standards out of the box.' },
];

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0 },
    description: 'Perfect for personal projects.',
    features: ['CLI access', '15 core components', '3 themes', 'Community support'],
    cta: { label: 'Get started free', href: '/docs' },
  },
  {
    name: 'Pro',
    price: { monthly: 19, annual: 15 },
    description: 'For professional developers.',
    features: ['Everything in Free', 'All 5+ themes', 'Premium sections', '50+ components', 'Priority support'],
    cta: { label: 'Start Pro trial', href: '/signup' },
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: { monthly: 49, annual: 39 },
    description: 'For development teams.',
    features: ['Everything in Pro', 'Private registry', 'Team sharing', 'Custom themes', 'Dedicated support'],
    cta: { label: 'Contact sales', href: '/contact' },
  },
];

const TESTIMONIALS = [
  { quote: 'UIGen cut our frontend development time by 60%. The generated code is clean and maintainable.', author: 'Sarah Chen', role: 'Lead Frontend Engineer', company: 'Vercel', rating: 5 },
  { quote: 'The CLI-first workflow is exactly what I needed. No more copy-pasting boilerplate.', author: 'Marcus Johnson', role: 'Full Stack Developer', company: 'Linear', rating: 5 },
  { quote: 'Five themes that actually look professional. Our landing page went from ugly to stunning in 20 minutes.', author: 'Priya Patel', role: 'Startup Founder', company: 'Startup', rating: 5 },
];

const FAQ_ITEMS = [
  { question: 'Do I need an internet connection to use UIGen?', answer: 'No. After the initial install, UIGen caches components locally and works completely offline.' },
  { question: 'Can I modify the generated code?', answer: 'Absolutely. The generated code is fully yours. Modify, extend, delete, or refactor it however you like.' },
  { question: 'Which frameworks are supported?', answer: 'Currently Next.js and React + Vite. Vue, Nuxt, and React Native are on the roadmap.' },
  { question: 'Does UIGen require Tailwind CSS?', answer: 'Yes, in the current version. Support for plain CSS and CSS Modules is planned.' },
];

export default function LandingPage() {
  return (
    <>
      <Navbar
        links={[
          { label: 'Docs', href: '/docs' },
          { label: 'Components', href: '/components' },
          { label: 'Themes', href: '/themes' },
          { label: 'Pricing', href: '#pricing' },
        ]}
        actions={
          <>
            <Button variant="ghost" size="sm" asChild><a href="/login">Sign in</a></Button>
            <Button size="sm" asChild><a href="/signup">Get started</a></Button>
          </>
        }
      />
      <main>
        <Hero
          variant="gradient"
          badge="Now in Public Beta →"
          headline="Professional UI, generated from your terminal"
          subheadline="Choose a component, run a command, own the source code. UIGen gives you production-ready React components that live in your project — not in a black box."
          primaryAction={{ label: 'Get started free', href: '/docs/installation' }}
          secondaryAction={{ label: 'Browse components →', href: '/components' }}
        />
        <Features
          eyebrow="Why UIGen"
          headline="Everything you need, nothing you don't"
          subheadline="Built for developers who value speed, ownership, and design quality."
          features={FEATURES}
          columns={3}
        />
        <section id="pricing">
          <Pricing
            eyebrow="Pricing"
            headline="Simple, transparent pricing"
            subheadline="Start free. Scale as you grow."
            plans={PLANS}
          />
        </section>
        <Testimonials
          eyebrow="Loved by developers"
          headline="What developers are saying"
          testimonials={TESTIMONIALS}
        />
        <FAQ
          eyebrow="FAQ"
          headline="Common questions"
          items={FAQ_ITEMS}
        />
        <CTA
          variant="gradient"
          eyebrow="Ready to ship faster?"
          headline="Start generating professional UI today"
          subheadline="One command. Production-ready code. Zero lock-in."
          primaryAction={{ label: 'Install UIGen →', href: '/docs/installation' }}
          secondaryAction={{ label: 'View on GitHub', href: 'https://github.com' }}
        />
      </main>
      <Footer
        description="UIGen is a CLI-first UI generation platform for frontend developers. Choose. Generate. Own. Ship."
        sections={[
          { title: 'Product', links: [{ label: 'Components', href: '/components' }, { label: 'Themes', href: '/themes' }, { label: 'Templates', href: '/templates' }, { label: 'Changelog', href: '/changelog' }] },
          { title: 'Docs', links: [{ label: 'Getting started', href: '/docs' }, { label: 'CLI reference', href: '/docs/cli' }, { label: 'API', href: '/docs/api' }] },
          { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Blog', href: '/blog' }, { label: 'Privacy', href: '/privacy' }] },
        ]}
      />
    </>
  );
}
`,

  dashboard: () => `'use client';

import { useState } from 'react';
import { BarChart3, Users, ShoppingCart, TrendingUp, Settings, Bell, Search, LayoutDashboard, Package, FileText, LogOut } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { StatsCard } from '@/components/ui/stats-card';
import { DataTable } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '#', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'analytics', label: 'Analytics', href: '#', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'users', label: 'Users', href: '#', icon: <Users className="h-4 w-4" />, badge: '12' },
  { id: 'products', label: 'Products', href: '#', icon: <Package className="h-4 w-4" /> },
  { id: 'orders', label: 'Orders', href: '#', icon: <ShoppingCart className="h-4 w-4" /> },
  { id: 'reports', label: 'Reports', href: '#', icon: <FileText className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', href: '#', icon: <Settings className="h-4 w-4" /> },
];

const STATS = [
  { title: 'Total Revenue', value: '$48,295', change: 12.5, icon: <TrendingUp className="h-5 w-5" /> },
  { title: 'Active Users', value: '2,841', change: 8.2, icon: <Users className="h-5 w-5" /> },
  { title: 'New Orders', value: '184', change: -3.1, icon: <ShoppingCart className="h-5 w-5" /> },
  { title: 'Conversion', value: '3.6%', change: 1.8, icon: <BarChart3 className="h-5 w-5" /> },
];

const RECENT_ORDERS = [
  { id: '#ORD-001', customer: 'Alice Johnson', product: 'Pro Plan', amount: '$19.00', status: 'Paid', date: 'Oct 5, 2026' },
  { id: '#ORD-002', customer: 'Bob Smith', product: 'Team Plan', amount: '$49.00', status: 'Pending', date: 'Oct 4, 2026' },
  { id: '#ORD-003', customer: 'Carol White', product: 'Pro Plan', amount: '$19.00', status: 'Paid', date: 'Oct 3, 2026' },
  { id: '#ORD-004', customer: 'David Lee', product: 'Free', amount: '$0.00', status: 'Active', date: 'Oct 3, 2026' },
  { id: '#ORD-005', customer: 'Eva Brown', product: 'Pro Plan', amount: '$19.00', status: 'Paid', date: 'Oct 2, 2026' },
];

const STATUS_COLORS: Record<string, 'default' | 'success' | 'secondary' | 'outline'> = {
  Paid: 'success',
  Pending: 'default',
  Active: 'secondary',
};

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      <Sidebar
        items={NAV_ITEMS}
        activeId={activeNav}
        logo={
          <span className="text-lg font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            UIGen
          </span>
        }
        footer={
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)]">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-6">
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
            <input placeholder="Search..." className="h-9 w-64 rounded-md border border-[var(--color-input)] bg-transparent pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar fallback="Admin User" size="sm" />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">Welcome back! Here's what's happening.</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <StatsCard key={s.title} {...s} variant="gradient" />
            ))}
          </div>

          {/* Recent orders */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Orders</h2>
              <Button variant="outline" size="sm">View all</Button>
            </div>
            <DataTable
              data={RECENT_ORDERS}
              columns={[
                { key: 'id', header: 'Order ID', sortable: true },
                { key: 'customer', header: 'Customer', sortable: true },
                { key: 'product', header: 'Product' },
                { key: 'amount', header: 'Amount', sortable: true },
                { key: 'status', header: 'Status', render: (v) => <Badge variant={STATUS_COLORS[String(v)] ?? 'outline'}>{String(v)}</Badge> },
                { key: 'date', header: 'Date' },
              ]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
`,

  'auth-login': () => `import { useState } from 'react';
import { Eye, EyeOff, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Connect your auth logic here
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Sign in to your UIGen account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                rightIcon={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-[var(--color-primary)] hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'auth-register': () => `import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Start generating UI in seconds</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" label="Full name" placeholder="Jane Doe" autoComplete="name" required />
            <Input type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />
            <Input type="password" label="Password" placeholder="Min 8 characters" autoComplete="new-password" required hint="At least 8 characters" />
            <Button type="submit" className="w-full" loading={loading}>Create account</Button>
          </form>
          <div className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[var(--color-primary)] hover:underline">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  '404': () => `import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-8 text-center">
      <div className="mb-6 text-8xl font-black text-[var(--color-muted)]">404</div>
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]">
        <Terminal className="h-7 w-7 text-[var(--color-primary)]" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-[var(--color-muted-foreground)]">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild><a href="/">Go home</a></Button>
        <Button variant="outline" asChild><a href="/docs">View docs</a></Button>
      </div>
    </div>
  );
}
`,
};

/**
 * Generate a complete page into the target project.
 */
export async function generatePage(
  pageType: PageType,
  options: { cwd: string; config: UIGenConfig; overwrite?: boolean }
): Promise<{ success: boolean; file?: string; error?: string }> {
  const { cwd, config, overwrite = false } = options;

  const template = PAGE_TEMPLATES[pageType];
  if (!template) {
    return { success: false, error: `Page type "${pageType}" not found.` };
  }

  const filename = pageType === 'landing' ? 'page.tsx' : `${pageType}.tsx`;
  const outputPath = path.join(cwd, config.paths.pages, filename);
  const exists = await fs.exists(outputPath);

  if (exists && !overwrite) {
    return { success: false, error: `File already exists: ${outputPath}` };
  }

  const code = template(config);
  const formatted = await formatCode(code, 'typescript');
  await fs.writeFile(outputPath, formatted);
  return { success: true, file: outputPath };
}
