/**
 * CheckoutCompletePage.ts
 *
 * Page Object for the TTACart Checkout Complete (order confirmation) page.
 * Reached after clicking "Finish" on Checkout Step 2.
 * Provides assertions for the success message and a way to navigate back home.
 */

import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "@config/env.config";

export class CheckoutComplete extends BasePage {

    static readonly path = 'checkout-complete';
    static get url(): string { return ENV.baseUrl + CheckoutComplete.path; }

    // ── Locators ──────────────────────────────────────────────────────────
    private readonly appTitle: Locator;
    private readonly successMsg: Locator;
    private readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page, 'CheckoutComplete');
        this.appTitle      = page.getByTestId('title');
        this.successMsg    = page.getByTestId('checkout-complete-container');
        this.backHomeButton = page.getByText('Back Home');
    }

    // ── Navigation ────────────────────────────────────────────────────────

    async gotoCheckOutFinish(): Promise<void> {
        this.log.info('Navigating to Checkout Complete page');
        await this.navigate(CheckoutComplete.url);
    }

    async gotoHomePage(): Promise<void> {
        this.log.info('Clicking Back Home → returning to Inventory');
        await this.el.click(this.backHomeButton);
    }

    // ── Assertions ────────────────────────────────────────────────────────

    async getAppTitle(): Promise<string> {
        const title = await this.el.getText(this.appTitle);
        this.log.debug(`App title: '${title}'`);
        return title;
    }

    async getSuccessMessage(): Promise<string> {
        const msg = await this.el.getText(this.successMsg);
        this.log.debug(`Success message: '${msg}'`);
        return msg;
    }
}