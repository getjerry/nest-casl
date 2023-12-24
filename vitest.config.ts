import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    root: './',
    watch: false,
    globals: true,
    alias: { 'nest-casl': new URL('./src/index.ts', import.meta.url).pathname },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
