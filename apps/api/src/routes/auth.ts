import { Router } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { User } from '../models/index.js';
import { signTokenPair, verifyRefreshToken } from '../lib/jwt.js';
import { authenticate, type AuthRequest } from '../middleware/auth.js';

export const authRouter = Router();

// POST /auth/register
authRouter.post('/register', async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8).max(128),
    });

    const { name, email, password } = schema.parse(req.body);
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, error: { code: 'DUPLICATE_RESOURCE', message: 'Email already registered' } });
      return;
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await User.create({ name, email, passwordHash });
    const tokens = signTokenPair({ userId: user.id, role: user.role });

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
authRouter.post('/login', async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const { email, password } = schema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Account suspended' } });
      return;
    }

    const tokens = signTokenPair({ userId: user.id, role: user.role });
    user.refreshTokens.push(tokens.refreshToken);
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
    await user.save();

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh
authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' } });
      return;
    }

    // Rotate token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const tokens = signTokenPair({ userId: user.id, role: user.role });
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout
authRouter.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { refreshToken } = z.object({ refreshToken: z.string().optional() }).parse(req.body);
    if (req.user && refreshToken) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    }
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me
authRouter.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.userId).select('-passwordHash -refreshTokens');
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' } });
      return;
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
});
