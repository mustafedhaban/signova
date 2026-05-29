import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Vite 8 defaults to Lightning CSS; Tailwind v4 expects the PostCSS pipeline.
  css: {
    transformer: 'postcss',
  },
  build: {
    cssMinify: 'esbuild',
  },
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
