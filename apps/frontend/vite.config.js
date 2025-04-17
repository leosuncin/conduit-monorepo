import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import dbg from 'unplugin-dbg/vite';
import { defineConfig } from 'vite';

const proxyPathRegex = /^\/api/;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
    tailwindcss(),
    dbg({ enabled: true }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(proxyPathRegex, ''),
      },
    },
  },
});
