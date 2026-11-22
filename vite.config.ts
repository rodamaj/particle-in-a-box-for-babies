import {defineConfig} from 'vite';
export default defineConfig({
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
