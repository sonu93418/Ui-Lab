import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { authRouter } from './routes/auth.js';
import { componentsRouter } from './routes/components.js';
import { themesRouter } from './routes/themes.js';
import { registryRouter } from './routes/registry.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';

const app = express();
const PORT = process.env.PORT ?? 4000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/uigen';

// ─── Security & Parsing Middleware ───────────────────────────────────────────

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Rate Limiting ───────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many auth attempts' } },
});

app.use('/api/', limiter);
app.use('/api/v1/auth', authLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/components', componentsRouter);
app.use('/api/v1/themes', themesRouter);
app.use('/api/v1/registry', registryRouter);
app.use('/api/v1/admin', adminRouter);

// ─── Health ──────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', version: '0.1.0', timestamp: new Date() } });
});

// ─── Error Handling ──────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      tlsAllowInvalidCertificates: true,
    });
    console.log('✔ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`✔ UIGen API running at http://localhost:${PORT}`);
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'name' in err && err.name === 'MongooseServerSelectionError') {
      console.error('\n❌ MongoDB Atlas Connection Error: IP NOT WHITELISTED');
      console.error('----------------------------------------------------');
      console.error('MongoDB Atlas has blocked this IP address from connecting.');
      console.error('To fix this in 30 seconds:');
      console.error('1. Go to https://cloud.mongodb.com');
      console.error('2. Click "Network Access" in the left sidebar (under Security)');
      console.error('3. Click "+ ADD IP ADDRESS"');
      console.error('4. Choose "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) or add your current IP.');
      console.error('5. Click "Confirm" and restart the server.\n');
    } else {
      console.error('Failed to start server:', err);
    }
    process.exit(1);
  }
}

start();

export { app };
