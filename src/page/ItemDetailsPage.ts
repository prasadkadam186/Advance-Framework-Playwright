import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "@config/env.config";

export class ItemDetailsPage extends BasePage {
    static readonly path = 'inventory-item';
    static get url(): string { return ENV.baseUrl + ItemDetailsPage.path; }

    // ── Navigation ────────────────────────────────────────────────────────
    private readonly backToProductsButton: Locator;
    private readonly cartIcon: Locator;
    private readonly cartBadge: Locator;

    // ── Item details ──────────────────────────────────────────────────────
    private readonly itemName: Locator;
    private readonly itemDescription: Locator;
    private readonly itemPrice: Locator;
    private readonly itemImage: Locator;

    // ── Cart actions ──────────────────────────────────────────────────────
    private readonly addToCartButton: Locator;
    private readonly removeButton: Locator;

    constructor(page: Page) {
        super(page, 'ItemDetailsPage');

        this.backToProductsButton = page.locator('[data-test="back-to-products"]');
        this.cartIcon             = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge            = page.locator('[data-test="shopping-cart-badge"]');

        this.itemName        = page.locator('[data-test="inventory-item-name"]');
        this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
        this.itemPrice       = page.locator('[data-test="inventory-item-price"]');
        this.itemImage       = page.locator('.inventory_details_img');

        this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
        this.removeButton    = page.getByRole('button', { name: /remove/i });
    }

    async gotoItemDetails(itemId: string): Promise<void> {
        this.log.info(`Navigating to item details page for id='${itemId}'`);
        await this.navigate(`${ItemDetailsPage.url}?id=${itemId}`);
    }

    // ── View item details ─────────────────────────────────────────────────

    async getItemName(): Promise<string> {
        const name = await this.el.getText(this.itemName);
        this.log.debug(`Item name: '${name}'`);
        return name;
    }

    async getItemDescription(): Promise<string> {
        const desc = await this.el.getText(this.itemDescription);
        this.log.debug(`Item description: '${desc}'`);
        return desc;
    }

    async getItemPrice(): Promise<string> {
        const price = await this.el.getText(this.itemPrice);
        this.log.debug(`Item price: '${price}'`);
        return price;
    }

    async getItemImageAlt(): Promise<string | null> {
        const alt = await this.el.getAttribute(this.itemImage, 'alt');
        this.log.debug(`Item image alt: '${alt}'`);
        return alt;
    }

    async isItemImageVisible(): Promise<boolean> {
        const visible = await this.el.isVisible(this.itemImage);
        this.log.debug(`Item image visible: ${visible}`);
        return visible;
    }

    // ── Add to cart ───────────────────────────────────────────────────────

    async addToCart(): Promise<void> {
        this.log.info('Clicking Add to cart on item details page');
        await this.el.click(this.addToCartButton);
    }

    async isAddToCartVisible(): Promise<boolean> {
        const visible = await this.el.isVisible(this.addToCartButton);
        this.log.debug(`Add to cart button visible: ${visible}`);
        return visible;
    }

    // ── Remove from cart ──────────────────────────────────────────────────

    async removeFromCart(): Promise<void> {
        this.log.info('Clicking Remove on item details page');
        await this.el.click(this.removeButton);
    }

    async isRemoveButtonVisible(): Promise<boolean> {
        const visible = await this.el.isVisible(this.removeButton);
        this.log.debug(`Remove button visible: ${visible}`);
        return visible;
    }

    // ── Cart icon ─────────────────────────────────────────────────────────

    async getCartCount(): Promise<string> {
        const count = await this.el.getText(this.cartBadge);
        this.log.debug(`Cart badge count: ${count}`);
        return count;
    }

    async goToCart(): Promise<void> {
        this.log.info('Clicking cart icon from item details page');
        await this.el.click(this.cartIcon);
    }

    // ── Back button ───────────────────────────────────────────────────────

    async goBackToProducts(): Promise<void> {
        this.log.info('Clicking Back to products');
        await this.el.click(this.backToProductsButton);
    }
}
