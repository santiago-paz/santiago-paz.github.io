import { defineConfig } from '@playwright/test'

// `next.config.ts` sets `output: "export"`, so there is no Next server to run:
// `next start` refuses the config outright. The suite serves the exported `out/`
// directory as plain files, which is what GitHub Pages does in production.
//
// Bind and browse over `127.0.0.1` rather than `localhost`. Node resolves
// `localhost` to `::1` first on macOS, and a server bound to `127.0.0.1` alone
// never answers there.
const HOST = '127.0.0.1'
const PORT = 3100
const BASE_URL = `http://${HOST}:${PORT}`

export default defineConfig({
  testDir: './e2e',
  webServer: {
    // `trailingSlash: true` means the export writes `about/index.html`, which a
    // plain directory-serving file server resolves without any rewrite rules.
    // The `2>/dev/null` covers only the server, not the build: `http.server`
    // logs a line per request to stderr, which Playwright pipes through and
    // which buries the test results. Build errors still print.
    command: `pnpm build && python3 -m http.server ${PORT} --bind ${HOST} --directory out 2>/dev/null`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  use: { baseURL: BASE_URL },
})
