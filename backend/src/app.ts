import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { env } from './config/env';
import { requestContextMiddleware } from './middleware/request-context';
import { authMiddleware } from './middleware/auth';
import configurationItemsRoute from './routes/configuration-items.route';
import itemAttributesRoute from './routes/item-attributes.route';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(requestContextMiddleware);

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', authMode: env.AUTH_MODE });
  });

  app.use(authMiddleware);
  app.use('/api/v1', itemAttributesRoute);
  app.use('/api/v1/configuration-items', configurationItemsRoute);

  app.get('/api/v1/me', (req: Request, res: Response) => {
    res.json({ user: (req as Request & { user?: unknown }).user ?? null });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
