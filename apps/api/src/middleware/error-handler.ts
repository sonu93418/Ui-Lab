import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err);

  if (err instanceof Error && err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_REQUEST', message: 'Validation failed', details: (err as unknown as { errors: unknown[] }).errors },
    });
    return;
  }

  if (err instanceof Error && err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_RESOURCE', message: 'Resource already exists' },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : String(err),
    },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { code: 'RESOURCE_NOT_FOUND', message: 'The requested endpoint does not exist' },
  });
}
