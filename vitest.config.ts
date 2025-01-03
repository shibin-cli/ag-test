import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        reporter: ['text', 'json', 'html', 'clover'],
        exclude: configDefaults.coverage.exclude?.concat('src/main.ts'),
        reportsDirectory: './coverage',
        all: true,
        include: ['src/**/*.{ts,vue,tsx}'],
      },
    },
  }),
)
