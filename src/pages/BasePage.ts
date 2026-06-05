import { Page } from "@playwright/test";
import { getLogger } from "@utils/Logger";
import { UiElementLocator } from "@utils/UiElementLocator";

/**
 * BasePage
 *
 * Parent of every Page Object. Holds the Playwright `page`, a shared
 * `UiElementLocator` (exposed as `ui`) for element interactions, and a
 * scoped logger. Child pages should call `super(page)` and then use
 * `this.ui` for actions and `this.log` for page-specific logging.
 *
 * Example:
 *   export class LoginPage extends BasePage {
 *       private readonly emailInput = "#email";
 *       async login(email: string): Promise<void> {
 *           this.log.info(`Logging in as ${email}`);
 *           await this.ui.fill(this.emailInput, email);
 *       }
 *   }
 */
export abstract class BasePage {
    protected readonly page: Page;
    protected readonly ui: UiElementLocator;
    protected readonly log = getLogger(this.constructor.name);

    constructor(page: Page) {
        this.page = page;
        this.ui = new UiElementLocator(page);
    }

    // Purpose : Navigate to a URL and wait for the DOM to be ready
    async goto(url: string): Promise<void> {
        this.log.info(`Navigating to ${url}`);
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
    }

    // Purpose : Return the current page title
    async getTitle(): Promise<string> {
        const title = await this.page.title();
        this.log.debug(`Page title: '${title}'`);
        return title;
    }

    // Purpose : Return the current page URL
    getCurrentUrl(): string {
        const url = this.page.url();
        this.log.debug(`Current URL: ${url}`);
        return url;
    }

    // Purpose : Reload the current page
    async reload(): Promise<void> {
        this.log.info("Reloading page");
        await this.page.reload({ waitUntil: "domcontentloaded" });
    }

    // Purpose : Wait until the page has no network activity (everything loaded)
    async waitForPageLoad(): Promise<void> {
        this.log.debug("Waiting for network idle");
        await this.page.waitForLoadState("networkidle");
    }
}
