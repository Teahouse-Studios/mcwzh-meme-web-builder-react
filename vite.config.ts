import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    sourcemap: true, // Source map generation must be turned on
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  optimizeDeps: {
    exclude: ['brotli-wasm', 'brotli-wasm/pkg.bundler/brotli_wasm_bg.wasm'],
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    legacy(),
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: '梗体中文 · 在线构建',
        short_name: '梗体中文',
        description:
          '自定义你的梗体中文！我们将我的世界中的字符串替换成了一些知名/不知名的梗。',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'pwa-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      org: 'teahouse-studios',
      project: 'mcwzh-meme-web-builder-reacy',
      authToken: process.env.SENTRY_AUTH_TOKEN ?? '',
    }),
    visualizer(),
  ],
})
