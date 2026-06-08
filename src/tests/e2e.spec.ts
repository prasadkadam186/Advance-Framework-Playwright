import { test, expect } from '@fixture/test-base';
import { ENV } from '@config/env.config';
import { DataGenerator } from '@utils/DataGenerator';

const PRODUCT = 'TTA Bike Light';

test.describe('@P0 End 2 End Testing Checkout feature', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goTologinUrl();
        await loginPage.login(ENV.username, ENV.password);
    });

    test('Login → Add to cart → Checkout 1 → Checkout 2 → Complete', async ({
        page,
        inventryPage,
        cardPage,
        checkout1,
        checkout2,
        checkoutComplete
    }) => {
        // ── Step 1: Inventory — add item to cart ──────────────────────────
        await expect(page).toHaveURL(/inventory/);
        await inventryPage.addToCart(PRODUCT);

        // ── Step 2: Cart — verify item and proceed to checkout ────────────
        await cardPage.gotoCart();
        const cartItems = await cardPage.getAllItemNames();
        expect(cartItems).toContain(PRODUCT);
        await cardPage.proceedToCheckout();

        // ── Step 3: Checkout Step 1 — fill random user info and continue ──
        await expect(page).toHaveURL(/checkout-step-one/);
        await checkout1.fillInformation(
            DataGenerator.firstName(),
            DataGenerator.lastName(),
            DataGenerator.zipCode(),
        );
        await checkout1.clickContinue();

        // ── Step 4: Checkout Step 2 — verify order and finish ─────────────
        await expect(page).toHaveURL(/checkout-step-two/);
        const orderItems = await checkout2.getAllItemNames();
        expect(orderItems).toContain(PRODUCT);
        await checkout2.clickFinish();

        // ── Step 5: Assert checkout complete ──────────────────────────────
        await expect(page).toHaveURL(/checkout-complete/);
        await checkoutComplete.gotoHomePage();
        await expect(page).toHaveURL(/inventory/)
    });

});