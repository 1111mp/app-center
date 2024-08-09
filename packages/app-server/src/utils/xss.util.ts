import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * DOMPurify sanitizes HTML and prevents XSS attacks.
 * @param domString string
 * @returns string
 */
export function sanitize(domString: string) {
  return purify.sanitize(domString);
}
