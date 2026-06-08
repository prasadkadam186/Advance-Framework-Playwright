---
description: Generate a Playwright Page Object class (DOM locators + action methods) for a given page URL and functionality steps
argument-hint: "<page-url> | <step1>, <step2>, <step3>, ..."
---

You are generating a Playwright Page Object class for this project.

**Input received:** $ARGUMENTS

Parse the input as:
- Everything **before** the `|` separator → the **page URL**
- Everything **after** the `|` separator → comma-separated **functionality steps** (what a user can do on this page)

If no `|` is found, treat the entire argument as the page URL and infer functionality steps from the fetched page content.

---

## Step 1 — Fetch and analyse the page

Use WebFetch to load the page URL. Identify every interactive element on the page:

| Element type | What to capture |
|---|---|
| Input fields | type, placeholder, name, id, aria-label |
| Buttons / submit | text, id, type, aria-label |
| Links (`<a>`) | visible text, href pattern |
| Dropdowns (`<select>`) | id, name, option values/labels |
| Checkboxes / radios | id, name, label text |
| Error / success messages | id, class, container structure |
| Navigation elements | labels, roles |

---

## Step 2 — Map each element to the best Playwright locator

Use this priority order (top = most preferred):

1. `page.getByRole('button', { name: 'Submit' })` — semantic ARIA roles
2. `page.getByPlaceholder('Email address')` — input placeholders
3. `page.getByLabel('Username')` — associated `<label>` text
4. `page.getByText('Add to cart', { exact: true })` — unique visible text
5. `page.locator('[data-testid="..."]')` — explicit test attributes
6. `page.locator('#elementId')` — unique HTML `id`
7. `page.locator('.css-class')` — CSS class (last resort only)

---

## Step 3 — Generate the TypeScript Page Object

Follow the **exact conventions** already used in this project (`src/page/LoginPage.ts` is the reference):

```typescript
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class <PageName>Page extends BasePage {
    static readonly url = '<page-url>';

    // ── Locators ─────────────────────────────────────────────────────────
    private readonly <elementName>: Locator;
    // (one private readonly Locator per interactive element found on page)

    constructor(page: Page) {
        super(page, '<PageName>Page');
        this.<elementName> = page.<chosenLocatorStrategy>;
        // (initialise every locator here)
    }

    // ── Navigation ───────────────────────────────────────────────────────
    async goto<PageName>(): Promise<void> {
        await this.navigate(<PageName>Page.url);
    }

    // ── Action methods (one per functionality step) ───────────────────────
    // Always use this.el.<method>() — never call locator methods directly
    async <actionName>(<params>): Promise<void> {
        await this.el.clear(this.<inputLocator>);
        await this.el.fill(this.<inputLocator>, value);
        await this.el.click(this.<buttonLocator>);
    }
}
```

### Naming rules

| Thing | Convention | Example |
|---|---|---|
| Class name | `<PageName>Page` PascalCase | `InventoryPage`, `CartPage` |
| File path | `src/page/<PageName>Page.ts` | `src/page/CartPage.ts` |
| Locator fields | camelCase, descriptive suffix | `addToCartButton`, `usernameInput`, `errorMessage` |
| Navigation method | `goto<PageName>()` | `gotoInventory()` |
| Action methods | verb + noun | `addItemToCart()`, `proceedToCheckout()` |

### Strict coding rules

- All locators → `private readonly` fields declared at the **top of the class**
- Constructor → always calls `super(page, '<PageName>Page')`
- Interactions → always use `this.el` (`UiElementLocator`), **never** `locator.click()` directly
- Fill pattern → always `this.el.clear()` before `this.el.fill()`
- Return types → `Promise<void>` for actions · `Promise<string>` for text getters · `Promise<boolean>` for state checks
- **Logger** → always use `this.log` (inherited from `BasePage`) in every method:
  - `this.log.info(...)` — first line of every **action** method (navigation, click, fill, remove)
  - `this.log.debug(...)` — inside every **getter** method, logging the value being returned

```typescript
// Action → info before the interaction
async addToCart(productName: string): Promise<void> {
    this.log.info(`Adding '${productName}' to cart`);
    await this.el.click(...);
}

// Getter → debug after reading the value
async getPageHeading(): Promise<string> {
    const heading = await this.el.getText(this.pageHeading);
    this.log.debug(`Page heading: '${heading}'`);
    return heading;
}
```

### Available `this.el` methods

| Method | Use for |
|---|---|
| `this.el.click(loc)` | Click button or link |
| `this.el.doubleClick(loc)` | Double-click element |
| `this.el.fill(loc, text)` | Set input value |
| `this.el.clear(loc)` | Clear input field |
| `this.el.type(loc, text)` | Simulate key-by-key typing |
| `this.el.press(loc, key)` | Press a key (e.g. `'Enter'`) |
| `this.el.hover(loc)` | Hover over element |
| `this.el.check(loc)` | Tick checkbox / radio |
| `this.el.uncheck(loc)` | Untick checkbox |
| `this.el.selectOption(loc, value)` | Choose `<select>` option |
| `this.el.uploadFiles(loc, paths)` | Upload file(s) |
| `this.el.getText(loc)` | Read inner text |
| `this.el.getInputValue(loc)` | Read input value |
| `this.el.getAttribute(loc, name)` | Read HTML attribute |
| `this.el.getAllTexts(loc)` | Read all matched texts |
| `this.el.count(loc)` | Count matching elements |
| `this.el.isVisible(loc)` | Visibility check |
| `this.el.isEnabled(loc)` | Enabled-state check |
| `this.el.isChecked(loc)` | Checked-state check |
| `this.el.waitFor(loc, 'visible')` | Explicit wait |
| `this.el.scrollIntoView(loc)` | Scroll element into view |
| `this.el.nth(loc, n)` | Pick nth matching element |

---

## Step 4 — Write and verify

1. Write the generated class to `src/page/<PageName>Page.ts`
2. Run `npm run typecheck` — fix all TypeScript errors before reporting done
3. Report: file path created, locators defined, action methods generated

---

## Example

**Command:**
```
/dom-generator https://app.thetestingacademy.com/playwright/ttacart/inventory.html | view product list, add item to cart, open item details
```

**Expected output structure:**
```typescript
export class InventoryPage extends BasePage {
    static readonly url = 'https://...inventory.html';

    private readonly addToCartButtons: Locator;
    private readonly productNames: Locator;
    private readonly productPrices: Locator;
    private readonly cartIcon: Locator;

    constructor(page: Page) {
        super(page, 'InventoryPage');
        this.addToCartButtons = page.getByRole('button', { name: /add to cart/i });
        this.productNames     = page.locator('.inventory_item_name');
        this.productPrices    = page.locator('.inventory_item_price');
        this.cartIcon         = page.locator('.shopping_cart_link');
    }

    async gotoInventory(): Promise<void> { ... }
    async addItemToCartByName(name: string): Promise<void> { ... }
    async openItemDetails(name: string): Promise<void> { ... }
    async getCartItemCount(): Promise<string> { ... }
}
```
