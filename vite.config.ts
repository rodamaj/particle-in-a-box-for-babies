import {defineConfig} from 'vite';
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          equations: ['katex'],
          charts: ['recharts'],
        },
      },
    },
  },
});
