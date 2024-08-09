import { randomBytes } from 'node:crypto';

export function generateToken() {
  const len = 32;
  return randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);
}
