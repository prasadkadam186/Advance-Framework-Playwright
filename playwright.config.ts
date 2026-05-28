import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

function resolveBaseUrl(): string {
  if (process.env.BASEURL) return process.env.BASEURL;

  const env = (process.env.TTA_ENV || 'qa').toLowerCase();

  switch (env) {
    case 'dev':
    case 'local':
      return process.env.DEV_BASE_URL || 'http://localhost:3000';

    case 'stg':
    case 'stage':
    case 'staging':
      return process.env.STG_BASE_URL || 'https://stage.thetestingacademy.com';

    case 'prod':
    case 'production':
      return process.env.PROD_BASE_URL || 'https://app.thetestingacademy.com';

    case 'qa':
    default:
      return process.env.QA_BASE_URL || 'https://app.thetestingacademy.com';
  }
}

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  outputDir: 'test-results',

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report.json' }],
    ['allure-playwright'],
    ['./src/utils/CustomReporter.ts'],
  ],

  use: {
    baseURL: resolveBaseUrl(),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
