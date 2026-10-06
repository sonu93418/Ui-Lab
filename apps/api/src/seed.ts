import 'dotenv/config';
import mongoose from 'mongoose';
import argon2 from 'argon2';
import { User, Component, ComponentVersion, Theme, AuditLog } from './models/index.js';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/uigen';

const SEED_COMPONENTS = [
  {
    name: 'Button',
    slug: 'button',
    description: 'A versatile button component with multiple variants, loading states, and sizes.',
    category: 'ui',
    type: 'primitive' as const,
    frameworks: ['next', 'react'],
    tags: ['button', 'primitive', 'ui', 'action'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'class-variance-authority', version: '^0.7.0' },
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }, { slug: 'outline', name: 'Outline' }, { slug: 'ghost', name: 'Ghost' }],
    status: 'published' as const,
    downloadCount: 342,
  },
  {
    name: 'Input',
    slug: 'input',
    description: 'A styled text input with icon support, error indicators, and helper text.',
    category: 'ui',
    type: 'primitive' as const,
    frameworks: ['next', 'react'],
    tags: ['input', 'form', 'primitive'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }, { slug: 'filled', name: 'Filled' }],
    status: 'published' as const,
    downloadCount: 289,
  },
  {
    name: 'Badge',
    slug: 'badge',
    description: 'A small badge for status indicators, counts, tags, and category chips.',
    category: 'ui',
    type: 'primitive' as const,
    frameworks: ['next', 'react'],
    tags: ['badge', 'status', 'tag'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'class-variance-authority', version: '^0.7.0' },
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }, { slug: 'success', name: 'Success' }],
    status: 'published' as const,
    downloadCount: 195,
  },
  {
    name: 'Card',
    slug: 'card',
    description: 'Flexible card container with header, body, description, and footer sections.',
    category: 'ui',
    type: 'component' as const,
    frameworks: ['next', 'react'],
    tags: ['card', 'container', 'layout'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }, { slug: 'bordered', name: 'Bordered' }],
    status: 'published' as const,
    downloadCount: 412,
  },
  {
    name: 'Modal',
    slug: 'modal',
    description: 'Accessible modal dialog with overlay backdrop, focus trap, and animations.',
    category: 'ui',
    type: 'component' as const,
    frameworks: ['next', 'react'],
    tags: ['modal', 'dialog', 'overlay'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
      { name: 'lucide-react', version: '^0.300.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }, { slug: 'glass', name: 'Glassmorphism' }],
    status: 'published' as const,
    downloadCount: 310,
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    description: 'Tabbed navigation with animated active pills and keyboard controls.',
    category: 'ui',
    type: 'component' as const,
    frameworks: ['next', 'react'],
    tags: ['tabs', 'navigation', 'interactive'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }, { slug: 'pills', name: 'Pills' }],
    status: 'published' as const,
    downloadCount: 220,
  },
  {
    name: 'Toast',
    slug: 'toast',
    description: 'Toast notification system with queueing, auto-dismiss, and animations.',
    category: 'ui',
    type: 'component' as const,
    frameworks: ['next', 'react'],
    tags: ['toast', 'notification', 'alert'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
      { name: 'lucide-react', version: '^0.300.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }],
    status: 'published' as const,
    downloadCount: 260,
  },
  {
    name: 'Navbar',
    slug: 'navbar',
    description: 'Full responsive navigation header with mobile drawer, brand logo, and actions.',
    category: 'section',
    type: 'section' as const,
    frameworks: ['next', 'react'],
    tags: ['navbar', 'header', 'navigation', 'section'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
      { name: 'lucide-react', version: '^0.300.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }],
    status: 'published' as const,
    downloadCount: 520,
  },
  {
    name: 'Hero',
    slug: 'hero',
    description: 'High-impact landing hero section with animated badges, dual CTAs, and preview showcase.',
    category: 'section',
    type: 'section' as const,
    frameworks: ['next', 'react'],
    tags: ['hero', 'landing', 'section'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
      { name: 'lucide-react', version: '^0.300.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }],
    status: 'published' as const,
    downloadCount: 680,
  },
  {
    name: 'Features',
    slug: 'features',
    description: 'Grid showcase for product features with modern gradient hover accents.',
    category: 'section',
    type: 'section' as const,
    frameworks: ['next', 'react'],
    tags: ['features', 'grid', 'section'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
      { name: 'lucide-react', version: '^0.300.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }],
    status: 'published' as const,
    downloadCount: 440,
  },
  {
    name: 'Pricing',
    slug: 'pricing',
    description: 'Tiered pricing matrix with monthly/yearly toggle and highlighted popular plan.',
    category: 'section',
    type: 'section' as const,
    frameworks: ['next', 'react'],
    tags: ['pricing', 'subscription', 'section'],
    currentVersion: '1.0.0',
    dependencies: [
      { name: 'clsx', version: '^2.1.0' },
      { name: 'tailwind-merge', version: '^2.2.0' },
      { name: 'lucide-react', version: '^0.300.0' },
    ],
    variants: [{ slug: 'default', name: 'Default' }],
    status: 'published' as const,
    downloadCount: 512,
  },
];

const SEED_THEMES = [
  {
    name: 'Zinc',
    slug: 'zinc',
    description: 'Clean, neutral industrial gray with deep blacks and sharp borders.',
    tokens: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        primary: '#18181b',
        'primary-foreground': '#fafafa',
        muted: '#27272a',
        'muted-foreground': '#a1a1aa',
        accent: '#27272a',
        border: '#27272a',
      },
      radius: { md: '0.5rem', lg: '0.75rem' },
    },
    supportsDarkMode: true,
    currentVersion: '1.0.0',
    status: 'published' as const,
  },
  {
    name: 'Violet',
    slug: 'violet',
    description: 'Modern developer-aesthetic purple with deep dark space gradients.',
    tokens: {
      colors: {
        background: '#0a0a0f',
        foreground: '#f3f4f6',
        primary: '#7c3aed',
        'primary-foreground': '#ffffff',
        muted: '#1e1b4b',
        'muted-foreground': '#a5b4fc',
        accent: '#6366f1',
        border: '#2e1065',
      },
      radius: { md: '0.625rem', lg: '0.875rem' },
    },
    supportsDarkMode: true,
    currentVersion: '1.0.0',
    status: 'published' as const,
  },
  {
    name: 'Emerald',
    slug: 'emerald',
    description: 'Lush organic green tones ideal for fintech, growth, and sustainability apps.',
    tokens: {
      colors: {
        background: '#022c22',
        foreground: '#ecfdf5',
        primary: '#059669',
        'primary-foreground': '#ffffff',
        muted: '#064e3b',
        'muted-foreground': '#6ee7b7',
        accent: '#10b981',
        border: '#065f46',
      },
      radius: { md: '0.5rem', lg: '0.75rem' },
    },
    supportsDarkMode: true,
    currentVersion: '1.0.0',
    status: 'published' as const,
  },
  {
    name: 'Cyberpunk',
    slug: 'cyberpunk',
    description: 'High-contrast neon cyan and magenta designed for futuristic dashboards.',
    tokens: {
      colors: {
        background: '#0d0d14',
        foreground: '#ffffff',
        primary: '#00f0ff',
        'primary-foreground': '#000000',
        muted: '#1b1b2f',
        'muted-foreground': '#ff007f',
        accent: '#ff007f',
        border: '#2a2a4a',
      },
      radius: { md: '0.25rem', lg: '0.375rem' },
    },
    supportsDarkMode: true,
    currentVersion: '1.0.0',
    status: 'published' as const,
  },
];

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, {
    tlsAllowInvalidCertificates: true,
  });
  console.log('MongoDB connected successfully.');

  // 1. Seed Admin User
  const existingAdmin = await User.findOne({ email: 'admin@uigen.dev' });
  let adminId = existingAdmin?._id;

  if (!existingAdmin) {
    const passwordHash = await argon2.hash('Admin@123456');
    const admin = await User.create({
      name: 'UIGen Admin',
      email: 'admin@uigen.dev',
      passwordHash,
      role: 'superadmin',
      status: 'active',
      emailVerified: true,
    });
    adminId = admin._id;
    console.log('✔ Superadmin user seeded (admin@uigen.dev / Admin@123456)');
  } else {
    console.log('✔ Superadmin user already exists');
  }

  // 2. Seed Components
  for (const item of SEED_COMPONENTS) {
    const existing = await Component.findOne({ slug: item.slug });
    if (!existing) {
      const comp = await Component.create(item);
      // create initial version document
      await ComponentVersion.create({
        componentId: comp._id,
        version: item.currentVersion,
        dependencies: item.dependencies,
        files: [
          {
            path: `components/ui/${item.slug}.tsx`,
            content: `// Source for ${item.name}\nexport default function ${item.name}() { return <div>${item.name}</div>; }`,
          },
        ],
        status: 'published',
      });
      console.log(`✔ Seeded component: ${item.slug}`);
    } else {
      console.log(`- Component already exists: ${item.slug}`);
    }
  }

  // 3. Seed Themes
  for (const theme of SEED_THEMES) {
    const existing = await Theme.findOne({ slug: theme.slug });
    if (!existing) {
      await Theme.create(theme);
      console.log(`✔ Seeded theme: ${theme.slug}`);
    } else {
      console.log(`- Theme already exists: ${theme.slug}`);
    }
  }

  // 4. Audit Log
  if (adminId) {
    await AuditLog.create({
      userId: adminId,
      action: 'SYSTEM_SEED',
      resource: 'Database',
      metadata: { timestamp: new Date() },
    });
  }

  console.log('\n🎉 Database seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  if (err && typeof err === 'object' && 'name' in err && err.name === 'MongooseServerSelectionError') {
    console.error('\n❌ MongoDB Atlas Connection Error: IP NOT WHITELISTED');
    console.error('----------------------------------------------------');
    console.error('MongoDB Atlas has blocked this IP address from connecting.');
    console.error('To fix this in 30 seconds:');
    console.error('1. Go to https://cloud.mongodb.com');
    console.error('2. Click "Network Access" in the left sidebar (under Security)');
    console.error('3. Click "+ ADD IP ADDRESS"');
    console.error('4. Choose "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) or add your current IP.');
    console.error('5. Click "Confirm" and re-run: pnpm seed\n');
  } else {
    console.error('Seeding failed:', err);
  }
  process.exit(1);
});
