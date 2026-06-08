import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ENV } from "@config/env.config";

export class Checkout1Page extends BasePage {
    static readonly path = 'checkout-step-one.html';
    static get url(): string { return ENV.baseUrl + Checkout1Page.path; }

    // ── Header ────────────────────────────────────────────────────────────
    private readonly pageHeading: Locator;

    // ── Form inputs ───────────────────────────────────────────────────────
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly errorMessage: Locator;

    // ── Form buttons ──────────────────────────────────────────────────────
    private readonly continueButton: Locator;
    private readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page, 'Checkout1Page');

        this.pageHeading = page.locator('.title');

        this.firstNameInput  = page.getByPlaceholder('First Name');
        this.lastNameInput   = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.errorMessage    = page.locator('[data-test="error"]');

        this.continueButton = page.locator('[data-test="continue"]');
        this.cancelButton   = page.locator('[data-test="cancel"]');
    }

    async gotoCheckout1(): Promise<void> {
        this.log.info('Navigating to Checkout Step 1 page');
        await this.navigate(Checkout1Page.url);
    }

    // ── Page heading ──────────────────────────────────────────────────────

    async getPageHeading(): Promise<string> {
        const heading = await this.el.getText(this.pageHeading);
        this.log.debug(`Page heading: '${heading}'`);
        return heading;
    }

    // ── Fill form fields ──────────────────────────────────────────────────

    async fillFirstName(firstName: string): Promise<void> {
        this.log.info(`Filling First Name: '${firstName}'`);
        await this.el.clear(this.firstNameInput);
        await this.el.fill(this.firstNameInput, firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        this.log.info(`Filling Last Name: '${lastName}'`);
        await this.el.clear(this.lastNameInput);
        await this.el.fill(this.lastNameInput, lastName);
    }

    async fillPostalCode(postalCode: string): Promise<void> {
        this.log.info(`Filling Postal/Pin Code: '${postalCode}'`);
        await this.el.clear(this.postalCodeInput);
        await this.el.fill(this.postalCodeInput, postalCode);
    }

    async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        this.log.info(`Filling checkout info — '${firstName} ${lastName}', postal: '${postalCode}'`);
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(postalCode);
    }

    // ── Buttons ───────────────────────────────────────────────────────────

    async clickContinue(): Promise<void> {
        this.log.info('Clicking Continue → proceeding to Checkout Step 2');
        await this.el.click(this.continueButton);
    }

    async clickCancel(): Promise<void> {
        this.log.info('Clicking Cancel → back to Cart');
        await this.el.click(this.cancelButton);
    }

    // ── Error message ─────────────────────────────────────────────────────

    async getErrorMessage(): Promise<string> {
        const msg = await this.el.getText(this.errorMessage);
        this.log.debug(`Validation error: '${msg}'`);
        return msg;
    }

    async isErrorVisible(): Promise<boolean> {
        const visible = await this.el.isVisible(this.errorMessage);
        this.log.debug(`Error message visible: ${visible}`);
        return visible;
    }
}
