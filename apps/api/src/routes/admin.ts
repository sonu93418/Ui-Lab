import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth.js';
import { Component, ComponentVersion, Theme, User, Download, AuditLog } from '../models/index.js';

export const adminRouter = Router();

// Protect all admin endpoints with authentication & admin role
adminRouter.use(authenticate);
adminRouter.use(requireRole('admin', 'superadmin'));

// GET /admin/stats — overview analytics
adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [totalComponents, totalThemes, totalUsers, totalDownloads, topComponents, frameworkBreakdown, recentDownloads] =
      await Promise.all([
        Component.countDocuments(),
        Theme.countDocuments(),
        User.countDocuments(),
        Download.countDocuments(),
        Component.find().sort({ downloadCount: -1 }).limit(5).select('name slug downloadCount category type').lean(),
        Download.aggregate([
          { $group: { _id: '$framework', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Download.find().sort({ createdAt: -1 }).limit(10).lean(),
      ]);

    res.json({
      success: true,
      data: {
        totalComponents,
        totalThemes,
        totalUsers,
        totalDownloads,
        topComponents,
        frameworkBreakdown,
        recentDownloads,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /admin/components — create a component
adminRouter.post('/components', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1),
      category: z.string().min(1),
      type: z.enum(['primitive', 'component', 'section']),
      frameworks: z.array(z.string()).default(['react', 'nextjs']),
      tags: z.array(z.string()).default([]),
      currentVersion: z.string().default('1.0.0'),
      dependencies: z.array(z.object({ name: z.string(), version: z.string().optional() })).default([]),
      variants: z.array(z.object({ slug: z.string(), name: z.string() })).default([]),
      status: z.enum(['draft', 'published', 'deprecated']).default('published'),
      initialFiles: z.array(z.object({ path: z.string(), content: z.string() })).optional(),
    });

    const parsed = schema.parse(req.body);

    const existing = await Component.findOne({ slug: parsed.slug });
    if (existing) {
      res.status(409).json({ success: false, error: { code: 'DUPLICATE_SLUG', message: 'Slug already exists' } });
      return;
    }

    const component = await Component.create({
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      category: parsed.category,
      type: parsed.type,
      frameworks: parsed.frameworks,
      tags: parsed.tags,
      currentVersion: parsed.currentVersion,
      dependencies: parsed.dependencies,
      variants: parsed.variants,
      status: parsed.status,
    });

    if (parsed.initialFiles && parsed.initialFiles.length > 0) {
      await ComponentVersion.create({
        componentId: component._id,
        version: parsed.currentVersion,
        files: parsed.initialFiles,
        dependencies: parsed.dependencies,
        status: 'published',
      });
    }

    if (req.user) {
      await AuditLog.create({
        userId: req.user.sub,
        action: 'CREATE_COMPONENT',
        resource: 'Component',
        resourceId: component._id,
        metadata: { slug: parsed.slug },
      });
    }

    res.status(201).json({ success: true, data: { component } });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/components/:slug — update component metadata
adminRouter.put('/components/:slug', async (req: AuthRequest, res, next) => {
  try {
    const updateSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      type: z.enum(['primitive', 'component', 'section']).optional(),
      tags: z.array(z.string()).optional(),
      status: z.enum(['draft', 'published', 'deprecated']).optional(),
      dependencies: z.array(z.object({ name: z.string(), version: z.string().optional() })).optional(),
    });

    const parsed = updateSchema.parse(req.body);
    const component = await Component.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: parsed },
      { new: true }
    );

    if (!component) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Component not found' } });
      return;
    }

    if (req.user) {
      await AuditLog.create({
        userId: req.user.sub,
        action: 'UPDATE_COMPONENT',
        resource: 'Component',
        resourceId: component._id,
        metadata: { slug: req.params.slug, updates: parsed },
      });
    }

    res.json({ success: true, data: { component } });
  } catch (err) {
    next(err);
  }
});

// POST /admin/components/:slug/versions — publish a new version
adminRouter.post('/components/:slug/versions', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      version: z.string().min(1),
      files: z.array(z.object({ path: z.string(), content: z.string() })).min(1),
      dependencies: z.array(z.object({ name: z.string(), version: z.string().optional() })).default([]),
      changelog: z.string().optional(),
    });

    const parsed = schema.parse(req.body);
    const component = await Component.findOne({ slug: req.params.slug });
    if (!component) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Component not found' } });
      return;
    }

    const versionDoc = await ComponentVersion.create({
      componentId: component._id,
      version: parsed.version,
      files: parsed.files,
      dependencies: parsed.dependencies,
      changelog: parsed.changelog,
      status: 'published',
    });

    component.currentVersion = parsed.version;
    await component.save();

    if (req.user) {
      await AuditLog.create({
        userId: req.user.sub,
        action: 'PUBLISH_VERSION',
        resource: 'ComponentVersion',
        resourceId: versionDoc._id,
        metadata: { slug: req.params.slug, version: parsed.version },
      });
    }

    res.status(201).json({ success: true, data: { version: versionDoc } });
  } catch (err) {
    next(err);
  }
});

// POST /admin/themes — create theme
adminRouter.post('/themes', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1),
      tokens: z.record(z.any()),
      supportsDarkMode: z.boolean().default(true),
      status: z.enum(['draft', 'published', 'deprecated']).default('published'),
    });

    const parsed = schema.parse(req.body);
    const theme = await Theme.create(parsed);

    if (req.user) {
      await AuditLog.create({
        userId: req.user.sub,
        action: 'CREATE_THEME',
        resource: 'Theme',
        resourceId: theme._id,
        metadata: { slug: parsed.slug },
      });
    }

    res.status(201).json({ success: true, data: { theme } });
  } catch (err) {
    next(err);
  }
});

// GET /admin/audit-logs — list audit trail
adminRouter.get('/audit-logs', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: { logs },
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /admin/users — list registered users
adminRouter.get('/users', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-passwordHash -refreshTokens')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: { users },
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});
