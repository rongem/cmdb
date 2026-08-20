import type { NextFunction, Request, Response } from 'express';
import { createRequestId } from '../utils/request-id.js';

export function requestContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.headers['x-request-id'] = String(req.headers['x-request-id'] ?? createRequestId());
  (req as Request & { requestId?: string }).requestId = String(req.headers['x-request-id']);
  next();
}
