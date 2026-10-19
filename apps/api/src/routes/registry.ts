import { Router } from 'express';
import { z } from 'zod';
import { Component, Theme, Download } from '../models/index.js';

export const registryRouter = Router();

// GET /registry/index — full catalog manifest for CLI sync / cache
registryRouter.get('/index', async (_req, res, next) => {
  try {
    const [components, themes] = await Promise.all([
      Component.find({ status: 'published' })
        .select('name slug description category type frameworks tags currentVersion dependencies variants downloadCount')
        .lean(),
      Theme.find({ status: 'published' })
        .select('name slug description supportsDarkMode currentVersion tokens')
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        version: '1.0.0',
        updatedAt: new Date(),
        components,
        themes,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /registry/search — fast search across components, sections, themes
registryRouter.get('/search', async (req, res, next) => {
  try {
    const { q, type, category } = req.query;
    const filter: Record<string, unknown> = { status: 'published' };

    if (type && typeof type === 'string') {
      filter.type = type;
    }
    if (category && typeof category === 'string') {
      filter.category = category;
    }
    if (q && typeof q === 'string' && q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { slug: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(q.trim(), 'i')] } },
      ];
    }

    const components = await Component.find(filter)
      .limit(30)
      .sort({ downloadCount: -1 })
      .lean();

    res.json({
      success: true,
      data: { components },
    });
  } catch (err) {
    next(err);
  }
});

// POST /registry/track-download — track CLI download events & increment counter
registryRouter.post('/track-download', async (req, res, next) => {
  try {
    const schema = z.object({
      resourceType: z.enum(['component', 'section', 'theme', 'template']),
      resourceSlug: z.string(),
      version: z.string().default('1.0.0'),
      framework: z.string().optional().default('nextjs'),
      cliVersion: z.string().optional().default('0.1.0'),
      packageManager: z.string().optional().default('pnpm'),
    });

    const parsed = schema.parse(req.body);

    // Look up component if it is a component/section
    let resourceId = null;
    if (parsed.resourceType === 'component' || parsed.resourceType === 'section') {
      const comp = await Component.findOneAndUpdate(
        { slug: parsed.resourceSlug },
        { $inc: { downloadCount: 1 } },
        { new: true }
      );
      if (comp) resourceId = comp._id;
    } else if (parsed.resourceType === 'theme') {
      const theme = await Theme.findOne({ slug: parsed.resourceSlug });
      if (theme) resourceId = theme._id;
    }

    // Record download analytics
    await Download.create({
      resourceType: parsed.resourceType,
      resourceId: resourceId || undefined,
      resourceSlug: parsed.resourceSlug,
      version: parsed.version,
      framework: parsed.framework,
      cliVersion: parsed.cliVersion,
      packageManager: parsed.packageManager,
    });

    res.json({ success: true, message: 'Download tracked' });
  } catch (err) {
    next(err);
  }
});
