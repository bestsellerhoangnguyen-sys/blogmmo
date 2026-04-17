import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'https://www.sspaitools.com';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
