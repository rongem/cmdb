import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (env.AUTH_MODE === 'none') {
    (req as Request & { user?: unknown }).user = {
      id: 'local-user',
      userName: 'local-dev',
      roles: ['admin'],
      authMode: 'none',
      tenantId: 'default',
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      sub?: string;
      userName?: string;
      roles?: string[];
      tenantId?: string;
    };

    (req as Request & { user?: unknown }).user = {
      id: payload.sub ?? 'unknown-user',
      userName: payload.userName ?? 'unknown-user',
      roles: payload.roles ?? ['reader'],
      authMode: 'jwt',
      tenantId: payload.tenantId ?? 'default',
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
