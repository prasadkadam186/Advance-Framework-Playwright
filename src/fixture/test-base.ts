/**
 * test-base.ts
 *
 * Extends Playwright's base `test` object with typed Page Object fixtures
 * for the TTACart application.  Every fixture receives the shared `page`
 * instance, so a single browser session is reused across all page objects
 * within one test — login state, cookies, and local-storage are shared.
 *
 * Usage:
 *   import { test, expect } from '@fixture/test-base';
 *
 *   test('my test', async ({ inventryPage, cardPage }) => { ... });
 */

import { LoginPage } from "../page/LoginPage";
import { InventryPage } from "../page/InventryPage";
import { CardPage } from "../page/CardPage";
import { ItemDetailsPage } from "../page/ItemDetailsPage";
import { Checkout1Page } from "../page/Checkout1Page";
import { Checkout2Page } from "../page/Checkout2Page";
import { CheckoutComplete } from "../page/CheckoutCompletePage";
import { test as base } from '@playwright/test';

// Purpose : Typed map of all page-object fixtures available in tests.
export type TestFixture = {
    loginPage       : LoginPage;
    inventryPage    : InventryPage;
    itemDetails     : ItemDetailsPage;
    cardPage        : CardPage;
    checkout1       : Checkout1Page;
    checkout2       : Checkout2Page;
    checkoutComplete: CheckoutComplete;
};

export const test = base.extend<TestFixture>({
    loginPage       : async ({ page }, use) => { await use(new LoginPage(page)); },
    inventryPage    : async ({ page }, use) => { await use(new InventryPage(page)); },
    itemDetails     : async ({ page }, use) => { await use(new ItemDetailsPage(page)); },
    cardPage        : async ({ page }, use) => { await use(new CardPage(page)); },
    checkout1       : async ({ page }, use) => { await use(new Checkout1Page(page)); },
    checkout2       : async ({ page }, use) => { await use(new Checkout2Page(page)); },
    checkoutComplete: async ({ page }, use) => { await use(new CheckoutComplete(page)); },
});

export { expect } from '@playwright/test';
