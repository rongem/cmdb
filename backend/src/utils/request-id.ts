import crypto from 'node:crypto';

export function createRequestId(): string {
  return crypto.randomUUID();
}
