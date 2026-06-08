import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "@config/env.config";

export class CardPage extends BasePage {
    static readonly path = 'cart.html';
    static get url(): string { return ENV.baseUrl + CardPage.path; }

    // ── Header ────────────────────────────────────────────────────────────
    private readonly pageHeading: Locator;
    private readonly cartIcon: Locator;
    private readonly cartBadge: Locator;

    // ── Cart list columns ─────────────────────────────────────────────────
    private readonly qtyColumnHeader: Locator;
    private readonly descColumnHeader: Locator;

    // ── Cart items ────────────────────────────────────────────────────────
    private readonly cartItems: Locator;
    private readonly itemQuantities: Locator;
    private readonly itemNames: Locator;
    private readonly itemPrices: Locator;

    // ── Footer buttons ────────────────────────────────────────────────────
    private readonly continueShoppingButton: Locator;
    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page, 'CardPage');

        this.pageHeading = page.locator('.title');
        this.cartIcon    = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge   = page.locator('[data-test="shopping-cart-badge"]');

        this.qtyColumnHeader  = page.locator('[data-test="cart-quantity-label"]');
        this.descColumnHeader = page.locator('[data-test="cart-desc-label"]');

        this.cartItems      = page.locator('[data-test="cart-item"]');
        this.itemQuantities = page.locator('[data-test="item-quantity"]');
        this.itemNames      = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices     = page.locator('[data-test="inventory-item-price"]');

        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton         = page.locator('[data-test="checkout"]');
    }

    async gotoCart(): Promise<void> {
        this.log.info('Navigating to Cart page');
        await this.navigate(CardPage.url);
    }

    // ── Cart column headers ───────────────────────────────────────────────

    async getQtyColumnLabel(): Promise<string> {
        const label = await this.el.getText(this.qtyColumnHeader);
        this.log.debug(`QTY column label: '${label}'`);
        return label;
    }

    async getDescColumnLabel(): Promise<string> {
        const label = await this.el.getText(this.descColumnHeader);
        this.log.debug(`Description column label: '${label}'`);
        return label;
    }

    async getPageHeading(): Promise<string> {
        const heading = await this.el.getText(this.pageHeading);
        this.log.debug(`Page heading: '${heading}'`);
        return heading;
    }

    // ── View cart items ───────────────────────────────────────────────────

    async getCartItemCount(): Promise<number> {
        const count = await this.el.count(this.cartItems);
        this.log.debug(`Cart item count: ${count}`);
        return count;
    }

    async getAllItemNames(): Promise<string[]> {
        const names = await this.el.getAllTexts(this.itemNames);
        this.log.debug(`Cart item names: [${names.join(', ')}]`);
        return names;
    }

    async getAllItemPrices(): Promise<string[]> {
        const prices = await this.el.getAllTexts(this.itemPrices);
        this.log.debug(`Cart item prices: [${prices.join(', ')}]`);
        return prices;
    }

    async getItemQuantity(itemName: string): Promise<string> {
        this.log.debug(`Getting quantity of '${itemName}'`);
        const item = this.page
            .locator('[data-test="cart-item"]')
            .filter({ has: this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }) });
        const qty = await this.el.getText(item.locator('[data-test="item-quantity"]'));
        this.log.debug(`Quantity of '${itemName}': ${qty}`);
        return qty;
    }

    async getCartBadgeCount(): Promise<string> {
        const count = await this.el.getText(this.cartBadge);
        this.log.debug(`Cart badge count: ${count}`);
        return count;
    }

    async isCartBadgeVisible(): Promise<boolean> {
        const visible = await this.el.isVisible(this.cartBadge);
        this.log.debug(`Cart badge visible: ${visible}`);
        return visible;
    }

    // ── Remove item ───────────────────────────────────────────────────────

    async removeItem(itemName: string): Promise<void> {
        this.log.info(`Removing '${itemName}' from cart`);
        const item = this.page
            .locator('[data-test="cart-item"]')
            .filter({ has: this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }) });
        await this.el.click(item.getByRole('button', { name: 'Remove' }));
    }

    // ── Footer navigation ─────────────────────────────────────────────────

    async continueShopping(): Promise<void> {
        this.log.info('Clicking Continue Shopping → back to inventory');
        await this.el.click(this.continueShoppingButton);
    }

    async proceedToCheckout(): Promise<void> {
        this.log.info('Clicking Checkout → proceeding to checkout step 1');
        await this.el.click(this.checkoutButton);
    }
}
