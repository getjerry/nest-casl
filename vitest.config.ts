import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './',
    watch: false,
    globals: true,
    alias: { 'nest-casl': './src/index.ts' },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
