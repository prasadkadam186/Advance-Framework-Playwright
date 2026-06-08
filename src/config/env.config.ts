/**
 * env.config.ts
 *
 * Centralised environment configuration for the TTACart test suite.
 * All values are read from environment variables, which are injected at
 * runtime from the project-root `.env` file via `dotenv` (configured in
 * `playwright.config.ts`).
 *
 * Usage:
 *   import { ENV } from '@config/env.config';
 *   await loginPage.login(ENV.username, ENV.password);
 *
 * Setup:
 *   Copy `.env.example` → `.env` and fill in your credentials.
 *   The `.env` file is git-ignored and must never be committed.
 */

// Purpose : Throw a descriptive error at startup if a required variable is absent,
//           rather than failing silently mid-test with an undefined value.
function required(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env variable: ${key}. Add it to your .env file.`);
    return value;
}

export const ENV = {
    username: required('TTA_USERNAME'),
    password: required('TTA_PASSWORD'),
    // Override BASE_URL in .env to run the suite against a different environment (staging, prod, etc.)
    baseUrl: process.env.BASE_URL ?? 'https://app.thetestingacademy.com/playwright/ttacart/',
};
