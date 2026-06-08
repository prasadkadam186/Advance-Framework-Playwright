import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "@config/env.config";

export class Checkout2Page extends BasePage {
    static readonly path = 'checkout-step-two.html';
    static get url(): string { return ENV.baseUrl + Checkout2Page.path; }

    // ── Header ────────────────────────────────────────────────────────────
    private readonly pageHeading: Locator;

    // ── Order items ───────────────────────────────────────────────────────
    private readonly cartItems: Locator;
    private readonly itemQuantities: Locator;
    private readonly itemNames: Locator;
    private readonly itemPrices: Locator;

    // ── Order summary ─────────────────────────────────────────────────────
    private readonly subtotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly totalLabel: Locator;

    // ── Payment & shipping info ───────────────────────────────────────────
    private readonly paymentInfoValue: Locator;
    private readonly shippingInfoValue: Locator;

    // ── Footer buttons ────────────────────────────────────────────────────
    private readonly finishButton: Locator;
    private readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page, 'Checkout2Page');

        this.pageHeading = page.locator('.title');

        this.cartItems      = page.locator('[data-test="cart-item"]');
        this.itemQuantities = page.locator('[data-test="item-quantity"]');
        this.itemNames      = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices     = page.locator('[data-test="inventory-item-price"]');

        this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
        this.taxLabel      = page.locator('[data-test="tax-label"]');
        this.totalLabel    = page.locator('[data-test="total-label"]');

        this.paymentInfoValue  = page.locator('[data-test="payment-info-value"]');
        this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');

        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
    }

    async gotoCheckout2(): Promise<void> {
        this.log.info('Navigating to Checkout Step 2 page');
        await this.navigate(Checkout2Page.url);
    }

    // ── Page heading ──────────────────────────────────────────────────────

    async getPageHeading(): Promise<string> {
        const heading = await this.el.getText(this.pageHeading);
        this.log.debug(`Page heading: '${heading}'`);
        return heading;
    }

    // ── Order items ───────────────────────────────────────────────────────

    async getOrderItemCount(): Promise<number> {
        const count = await this.el.count(this.cartItems);
        this.log.debug(`Order item count: ${count}`);
        return count;
    }

    async getAllItemNames(): Promise<string[]> {
        const names = await this.el.getAllTexts(this.itemNames);
        this.log.debug(`Order item names: [${names.join(', ')}]`);
        return names;
    }

    async getAllItemPrices(): Promise<string[]> {
        const prices = await this.el.getAllTexts(this.itemPrices);
        this.log.debug(`Order item prices: [${prices.join(', ')}]`);
        return prices;
    }

    async getItemQuantity(itemName: string): Promise<string> {
        this.log.debug(`Getting quantity for '${itemName}'`);
        const item = this.page
            .locator('[data-test="cart-item"]')
            .filter({ has: this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }) });
        const qty = await this.el.getText(item.locator('[data-test="item-quantity"]'));
        this.log.debug(`Quantity of '${itemName}': ${qty}`);
        return qty;
    }

    // ── Order summary ─────────────────────────────────────────────────────

    async getSubtotal(): Promise<string> {
        const subtotal = await this.el.getText(this.subtotalLabel);
        this.log.debug(`Subtotal: '${subtotal}'`);
        return subtotal;
    }

    async getTax(): Promise<string> {
        const tax = await this.el.getText(this.taxLabel);
        this.log.debug(`Tax: '${tax}'`);
        return tax;
    }

    async getTotal(): Promise<string> {
        const total = await this.el.getText(this.totalLabel);
        this.log.debug(`Total: '${total}'`);
        return total;
    }

    // ── Payment & shipping ────────────────────────────────────────────────

    async getPaymentInfo(): Promise<string> {
        const info = await this.el.getText(this.paymentInfoValue);
        this.log.debug(`Payment info: '${info}'`);
        return info;
    }

    async getShippingInfo(): Promise<string> {
        const info = await this.el.getText(this.shippingInfoValue);
        this.log.debug(`Shipping info: '${info}'`);
        return info;
    }

    // ── Footer buttons ────────────────────────────────────────────────────

    async clickFinish(): Promise<void> {
        this.log.info('Clicking Finish → completing checkout');
        await this.el.click(this.finishButton);
    }

    async clickCancel(): Promise<void> {
        this.log.info('Clicking Cancel → back to Inventory');
        await this.el.click(this.cancelButton);
    }
}
