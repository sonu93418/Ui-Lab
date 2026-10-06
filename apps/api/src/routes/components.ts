import { Router } from 'express';
import { z } from 'zod';
import { Component, ComponentVersion } from '../models/index.js';

export const componentsRouter = Router();

// GET /components — list with pagination + filters
componentsRouter.get('/', async (req, res, next) => {
  try {
    const query = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      category: z.string().optional(),
      type: z.enum(['primitive', 'component', 'section']).optional(),
      status: z.enum(['draft', 'published', 'deprecated']).optional().default('published'),
      q: z.string().optional(),
    }).parse(req.query);

    const filter: Record<string, unknown> = { status: query.status };
    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;
    if (query.q) filter.$text = { $search: query.q };

    const total = await Component.countDocuments(filter);
    const components = await Component.find(filter)
      .sort({ downloadCount: -1, createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean();

    res.json({
      success: true,
      data: { components },
      meta: { total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /components/:slug
componentsRouter.get('/:slug', async (req, res, next) => {
  try {
    const component = await Component.findOne({ slug: req.params.slug }).lean();
    if (!component) {
      res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Component not found' } });
      return;
    }
    res.json({ success: true, data: { component } });
  } catch (err) {
    next(err);
  }
});

// GET /components/:slug/versions
componentsRouter.get('/:slug/versions', async (req, res, next) => {
  try {
    const component = await Component.findOne({ slug: req.params.slug });
    if (!component) {
      res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Component not found' } });
      return;
    }
    const versions = await ComponentVersion.find({ componentId: component.id, status: 'published' })
      .select('-files')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: { versions } });
  } catch (err) {
    next(err);
  }
});

// GET /components/:slug/:version — get specific version with files
componentsRouter.get('/:slug/:version', async (req, res, next) => {
  try {
    const component = await Component.findOne({ slug: req.params.slug });
    if (!component) {
      res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Component not found' } });
      return;
    }
    const version = await ComponentVersion.findOne({
      componentId: component.id,
      version: req.params.version,
      status: 'published',
    }).lean();

    if (!version) {
      res.status(404).json({ success: false, error: { code: 'VERSION_NOT_FOUND', message: 'Version not found' } });
      return;
    }
    res.json({ success: true, data: { component, version } });
  } catch (err) {
    next(err);
  }
});
