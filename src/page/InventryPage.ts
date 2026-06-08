import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "@config/env.config";

export class InventryPage extends BasePage {
    static readonly path = 'inventory.html';
    static get url(): string { return ENV.baseUrl + InventryPage.path; }

    // ── Header ────────────────────────────────────────────────────────────
    private readonly appTitle: Locator;
    private readonly pageHeading: Locator;

    // ── Product list ──────────────────────────────────────────────────────
    private readonly inventoryItems: Locator;
    private readonly productNames: Locator;
    private readonly productPrices: Locator;
    private readonly sortDropdown: Locator;

    constructor(page: Page) {
        super(page, 'InventryPage');

        this.appTitle       = page.locator('.app_logo');
        this.pageHeading    = page.locator('.title');
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.productNames   = page.locator('.inventory_item_name');
        this.productPrices  = page.locator('.inventory_item_price');
        this.sortDropdown   = page.locator('[data-test="product_sort_container"]');
    }

    async gotoInventory(): Promise<void> {
        this.log.info('Navigating to Inventory page');
        await this.navigate(InventryPage.url);
    }

    // ── Title / heading ───────────────────────────────────────────────────

    async getAppTitle(): Promise<string> {
        const title = await this.el.getText(this.appTitle);
        this.log.debug(`App title: '${title}'`);
        return title;
    }

    async getPageHeading(): Promise<string> {
        const heading = await this.el.getText(this.pageHeading);
        this.log.debug(`Page heading: '${heading}'`);
        return heading;
    }

    // ── View product list ─────────────────────────────────────────────────

    async getProductCount(): Promise<number> {
        const count = await this.el.count(this.inventoryItems);
        this.log.debug(`Product count: ${count}`);
        return count;
    }

    async getAllProductNames(): Promise<string[]> {
        const names = await this.el.getAllTexts(this.productNames);
        this.log.debug(`Product names: [${names.join(', ')}]`);
        return names;
    }

    async getAllProductPrices(): Promise<string[]> {
        const prices = await this.el.getAllTexts(this.productPrices);
        this.log.debug(`Product prices: [${prices.join(', ')}]`);
        return prices;
    }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        this.log.info(`Sorting products by '${option}'`);
        await this.el.selectOption(this.sortDropdown, option);
    }

    // ── Add to cart ───────────────────────────────────────────────────────

    async addToCart(productName: string): Promise<void> {
        this.log.info(`Adding '${productName}' to cart`);
        const item = this.page.locator('article').filter({ hasText: productName });
        await this.el.click(item.getByRole('button', { name: 'Add to cart' }));
    }

    // ── Remove from cart ──────────────────────────────────────────────────

    async removeFromCart(productName: string): Promise<void> {
        this.log.info(`Removing '${productName}' from cart`);
        const item = this.page.locator('article').filter({ hasText: productName });
        await this.el.click(item.getByRole('button', { name: /remove/i }));
    }

    // ── Open item details ─────────────────────────────────────────────────

    async openItemDetails(productName: string): Promise<void> {
        this.log.info(`Opening details for '${productName}'`);
        await this.el.click(this.page.getByRole('link', { name: productName }));
    }
}
