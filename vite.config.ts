import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// Vite config — React SPA + installable PWA. Alias `@` → src for clean imports.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'CS Learning Hub',
        short_name: 'CS Hub',
        description: 'A computer science course you can read like a book — from bits to distributed systems.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f6f6f3',
        theme_color: '#f6f6f3',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the whole app (shell + every topic chunk + highlighter + mermaid)
        // so any topic can be read offline after the first visit.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Content only uses flowchart / sequence / state / class diagrams — skip
        // precaching mermaid's other diagram types (still lazy-loadable online).
        globIgnores: [
          '**/{abnf,architecture,block,c4,cynefin,ebnf,er,gantt,gitGraph,info,ishikawa,journey,peg,pie,quadrant,railroad,requirement,sankey,swimlanes,venn,wardley,xychart}Diagram-*.js',
          '**/{cynefin,swimlanes,cose-bilkent,cytoscape.esm,katex}-*.js',
          '**/{kanban,mindmap,timeline}-definition-*.js',
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep vendor code out of the entry chunk so app updates stay small.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm', 'remark-breaks'],
        },
      },
    },
  },
});
