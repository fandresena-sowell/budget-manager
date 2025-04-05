import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    // Use type assertion to bypass plugin compatibility issues
    vue({
      template: { transformAssetUrls }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quasar() as any
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/**',
        'src-capacitor/**',
        'dist/**',
        '**/*.d.ts',
        'tests/**',
        '**/*.{test,spec}.{js,ts,jsx,tsx}',
        '.quasar/**',
        'public/**',
        'src/boot/*.ts',
        'src-pwa/**'
      ]
    },
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'src-capacitor',
      '.quasar'
    ]
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url)),
      'app': fileURLToPath(new URL('./', import.meta.url)),
      'boot': fileURLToPath(new URL('./src/boot', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url)),
      'layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      'pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      'stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      'utils': fileURLToPath(new URL('./src/utils', import.meta.url))
    }
  }
})
