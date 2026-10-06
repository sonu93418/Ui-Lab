import { Router } from 'express';
import { z } from 'zod';
import { Theme } from '../models/index.js';

export const themesRouter = Router();

// GET /themes — list themes with pagination & filters
themesRouter.get('/', async (req, res, next) => {
  try {
    const query = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
      status: z.enum(['draft', 'published', 'deprecated']).optional().default('published'),
      q: z.string().optional(),
    }).parse(req.query);

    const filter: Record<string, unknown> = { status: query.status };
    if (query.q) {
      filter.$or = [
        { name: { $regex: query.q, $options: 'i' } },
        { slug: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
      ];
    }

    const total = await Theme.countDocuments(filter);
    const themes = await Theme.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean();

    res.json({
      success: true,
      data: { themes },
      meta: { total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /themes/:slug — get theme details
themesRouter.get('/:slug', async (req, res, next) => {
  try {
    const theme = await Theme.findOne({ slug: req.params.slug }).lean();
    if (!theme) {
      res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Theme not found' } });
      return;
    }
    res.json({ success: true, data: { theme } });
  } catch (err) {
    next(err);
  }
});

// GET /themes/:slug/css — get CSS variables string
themesRouter.get('/:slug/css', async (req, res, next) => {
  try {
    const theme = await Theme.findOne({ slug: req.params.slug }).lean();
    if (!theme) {
      res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'Theme not found' } });
      return;
    }

    const tokens = theme.tokens || {};
    const colorLines = tokens.colors
      ? Object.entries(tokens.colors).map(([k, v]) => `  --${k}: ${v};`).join('\n')
      : '';
    const radiusLines = tokens.radius
      ? Object.entries(tokens.radius).map(([k, v]) => `  --radius-${k}: ${v};`).join('\n')
      : '';

    const css = `:root {\n${colorLines}\n${radiusLines}\n}`;

    res.setHeader('Content-Type', 'text/css');
    res.send(css);
  } catch (err) {
    next(err);
  }
});
