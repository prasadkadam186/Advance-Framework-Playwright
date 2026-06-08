/**
 * auth.fixture.ts  (optional auto-login extension)
 *
 * Extends `test-base` with an `{ auto: true }` fixture that performs login
 * before every test automatically, so specs don't need a `beforeEach` block.
 *
 * Activate by importing `test` from this file instead of `test-base`:
 *   import { test, expect } from '@fixture/auth.fixture';
 *
 * Currently unused — login is handled explicitly in `beforeEach` inside
 * each spec file, which gives clearer per-suite control.
 */

// import { test as base } from './test-base';
// import { ENV } from '@config/env.config';

// export const test = base.extend<{ loggedIn: void }>({
//     loggedIn: [async ({ loginPage }, use) => {
//         await loginPage.goTologinUrl();
//         await loginPage.login(ENV.username, ENV.password);
//         await use();
//     }, { auto: true }],
// });

// export { expect } from '@playwright/test';
