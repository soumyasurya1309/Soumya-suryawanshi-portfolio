import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // manualChunks as function — required for Vite 8 / Rolldown
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('gsap'))  return 'gsap';
          if (id.includes('lenis')) return 'lenis';
          if (id.includes('@fontsource')) return 'fonts';
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
