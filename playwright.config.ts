import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm build && pnpm start --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: false,
    timeout: 180_000,
  },
  use: { baseURL: 'http://localhost:3100' },
})
