import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  target: 'esnext',
  format: ['cjs', 'esm'],
  dts: true,
  bundle: true,
});
