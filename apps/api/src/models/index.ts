import mongoose, { Schema, type Document } from 'mongoose';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'suspended';
  emailVerified: boolean;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    emailVerified: { type: Boolean, default: false },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);

// ─── Component ────────────────────────────────────────────────────────────────

export interface IComponent extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  type: 'primitive' | 'component' | 'section';
  frameworks: string[];
  tags: string[];
  currentVersion: string;
  dependencies: { name: string; version?: string }[];
  variants: { slug: string; name: string }[];
  previewUrl?: string;
  documentationUrl?: string;
  downloadCount: number;
  status: 'draft' | 'published' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}

const ComponentSchema = new Schema<IComponent>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['primitive', 'component', 'section'], required: true },
    frameworks: [{ type: String }],
    tags: [{ type: String }],
    currentVersion: { type: String, default: '1.0.0' },
    dependencies: [{ name: String, version: String }],
    variants: [{ slug: String, name: String }],
    previewUrl: { type: String },
    documentationUrl: { type: String },
    downloadCount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published', 'deprecated'], default: 'draft' },
  },
  { timestamps: true }
);

ComponentSchema.index({ status: 1 });
ComponentSchema.index({ category: 1 });
ComponentSchema.index({ tags: 1 });
ComponentSchema.index({ downloadCount: -1 });

export const Component = mongoose.model<IComponent>('Component', ComponentSchema);

// ─── Component Version ────────────────────────────────────────────────────────

export interface IComponentVersion extends Document {
  componentId: mongoose.Types.ObjectId;
  version: string;
  files: { path: string; content: string }[];
  dependencies: { name: string; version?: string }[];
  changelog?: string;
  checksum?: string;
  status: 'draft' | 'published' | 'deprecated';
  createdAt: Date;
}

const ComponentVersionSchema = new Schema<IComponentVersion>(
  {
    componentId: { type: Schema.Types.ObjectId, ref: 'Component', required: true },
    version: { type: String, required: true },
    files: [{ path: String, content: String }],
    dependencies: [{ name: String, version: String }],
    changelog: { type: String },
    checksum: { type: String },
    status: { type: String, enum: ['draft', 'published', 'deprecated'], default: 'draft' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ComponentVersionSchema.index({ componentId: 1, version: 1 }, { unique: true });

export const ComponentVersion = mongoose.model<IComponentVersion>('ComponentVersion', ComponentVersionSchema);

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface ITheme extends Document {
  name: string;
  slug: string;
  description: string;
  tokens: {
    colors: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
    radius?: Record<string, string>;
    shadows?: Record<string, string>;
  };
  supportsDarkMode: boolean;
  previewUrl?: string;
  currentVersion: string;
  status: 'draft' | 'published' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema = new Schema<ITheme>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tokens: {
      colors: { type: Map, of: String },
      typography: { type: Map, of: String },
      spacing: { type: Map, of: String },
      radius: { type: Map, of: String },
      shadows: { type: Map, of: String },
    },
    supportsDarkMode: { type: Boolean, default: true },
    previewUrl: { type: String },
    currentVersion: { type: String, default: '1.0.0' },
    status: { type: String, enum: ['draft', 'published', 'deprecated'], default: 'draft' },
  },
  { timestamps: true }
);

ThemeSchema.index({ status: 1 });

export const Theme = mongoose.model<ITheme>('Theme', ThemeSchema);

// ─── Download Analytics ───────────────────────────────────────────────────────

export interface IDownload extends Document {
  resourceType: 'component' | 'section' | 'theme' | 'template';
  resourceId: mongoose.Types.ObjectId;
  resourceSlug: string;
  version: string;
  framework: string;
  cliVersion: string;
  packageManager: string;
  createdAt: Date;
}

const DownloadSchema = new Schema<IDownload>(
  {
    resourceType: { type: String, enum: ['component', 'section', 'theme', 'template'], required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    resourceSlug: { type: String, required: true },
    version: { type: String, required: true },
    framework: { type: String },
    cliVersion: { type: String },
    packageManager: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

DownloadSchema.index({ resourceSlug: 1, createdAt: -1 });
DownloadSchema.index({ createdAt: -1 });

export const Download = mongoose.model<IDownload>('Download', DownloadSchema);

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  ip?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
    ip: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
