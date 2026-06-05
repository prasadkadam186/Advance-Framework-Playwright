import { Locator, Page } from "@playwright/test";
import { getLogger, Logger } from "@utils/Logger";

export type flex = string | Locator;
export const DEFAULT_TIMEOUT_IN_MS = 15_000;

export class UiElementLocator {
    private readonly page: Page;
    private readonly log : Logger;

    constructor(page: Page) {
        this.page = page;
        this.log= getLogger("UiElementLocator")
    }

    // Purpose : To check the type of locator wheater its playwright inbuild or simple one
    private toLocator(target: flex): Locator {
        return typeof target === "string" ? this.page.locator(target) : target;
    }

    // Purpose : Readable description of a target for log lines
    private describe(target: flex): string {
        return typeof target === "string" ? target : "<Locator>";
    }

    /* ------------------------------------------------------------------ */
    /* Mouse actions                                                      */
    /* ------------------------------------------------------------------ */

    // Purpose : Single left click on the element
    async click(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Click on '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.click({ timeout });
    }

    // Purpose : Double left click on the element
    async doubleClick(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Double click on '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.dblclick({ timeout });
    }

    // Purpose : Right click (context menu) on the element
    async rightClick(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Right click on '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.click({ button: "right", timeout });
    }

    // Purpose : Click while holding a modifier key (e.g. Control, Shift)
    async clickWithModifier(
        target: flex,
        modifiers: Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">,
        timeout: number = DEFAULT_TIMEOUT_IN_MS,
    ): Promise<void> {
        this.log.info(`Click on '${this.describe(target)}' with modifiers [${modifiers.join(", ")}]`);
        const loc = this.toLocator(target);
        await loc.click({ modifiers, timeout });
    }

    // Purpose : Hover the mouse over the element
    async hover(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Hover over '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.hover({ timeout });
    }

    // Purpose : Drag the source element and drop it onto the target element
    async dragAndDrop(source: flex, target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Drag '${this.describe(source)}' onto '${this.describe(target)}'`);
        const sourceLoc = this.toLocator(source);
        const targetLoc = this.toLocator(target);
        await sourceLoc.dragTo(targetLoc, { timeout });
    }

    /* ------------------------------------------------------------------ */
    /* Keyboard & input                                                   */
    /* ------------------------------------------------------------------ */

    // Purpose : Clear and set the value of an input/textarea field
    async fill(target: flex, value: string, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Fill '${this.describe(target)}' with '${value}'`);
        const loc = this.toLocator(target);
        await loc.fill(value, { timeout });
    }

    // Purpose : Type text character by character (simulates real key presses)
    async type(target: flex, value: string, delay = 0, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Type '${value}' into '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.pressSequentially(value, { delay, timeout });
    }

    // Purpose : Clear the value of an input/textarea field
    async clear(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Clear '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.clear({ timeout });
    }

    // Purpose : Press a single key or key combination (e.g. "Enter", "Control+A")
    async press(target: flex, key: string, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Press '${key}' on '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.press(key, { timeout });
    }

    // Purpose : Set focus on the element
    async focus(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Focus '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.focus({ timeout });
    }

    // Purpose : Remove focus from the element
    async blur(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Blur '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.blur({ timeout });
    }

    /* ------------------------------------------------------------------ */
    /* Checkboxes, radios & dropdowns                                     */
    /* ------------------------------------------------------------------ */

    // Purpose : Tick a checkbox/radio button
    async check(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Check '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.check({ timeout });
    }

    // Purpose : Untick a checkbox
    async uncheck(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Uncheck '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.uncheck({ timeout });
    }

    // Purpose : Select option(s) in a <select> dropdown by value, label or index
    async selectOption(
        target: flex,
        values: string | string[] | { value?: string; label?: string; index?: number },
        timeout: number = DEFAULT_TIMEOUT_IN_MS,
    ): Promise<string[]> {
        this.log.info(`Select option ${JSON.stringify(values)} in '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        return loc.selectOption(values, { timeout });
    }

    // Purpose : Upload file(s) to an <input type="file"> element
    async uploadFiles(target: flex, files: string | string[], timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.info(`Upload ${JSON.stringify(files)} to '${this.describe(target)}'`);
        const loc = this.toLocator(target);
        await loc.setInputFiles(files, { timeout });
    }

    /* ------------------------------------------------------------------ */
    /* Text & attribute readers                                           */
    /* ------------------------------------------------------------------ */

    // Purpose : Get the visible inner text of the element
    async getText(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<string> {
        const loc = this.toLocator(target);
        const text = (await loc.innerText({ timeout })).trim();
        this.log.debug(`Read text '${text}' from '${this.describe(target)}'`);
        return text;
    }

    // Purpose : Get the full textContent of the element (including hidden text)
    async getTextContent(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<string> {
        const loc = this.toLocator(target);
        const text = (await loc.textContent({ timeout })) ?? "";
        this.log.debug(`Read textContent '${text}' from '${this.describe(target)}'`);
        return text;
    }

    // Purpose : Get the current value of an input/textarea/select field
    async getInputValue(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<string> {
        const loc = this.toLocator(target);
        const value = await loc.inputValue({ timeout });
        this.log.debug(`Read input value '${value}' from '${this.describe(target)}'`);
        return value;
    }

    // Purpose : Get the value of a given attribute (returns null if absent)
    async getAttribute(target: flex, name: string, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<string | null> {
        const loc = this.toLocator(target);
        const value = await loc.getAttribute(name, { timeout });
        this.log.debug(`Read attribute '${name}'='${value}' from '${this.describe(target)}'`);
        return value;
    }

    // Purpose : Get the inner texts of all matching elements
    async getAllTexts(target: flex): Promise<string[]> {
        const loc = this.toLocator(target);
        const texts = await loc.allInnerTexts();
        this.log.debug(`Read ${texts.length} texts from '${this.describe(target)}'`);
        return texts;
    }

    // Purpose : Count how many elements match the locator
    async count(target: flex): Promise<number> {
        const loc = this.toLocator(target);
        const total = await loc.count();
        this.log.debug(`Counted ${total} element(s) for '${this.describe(target)}'`);
        return total;
    }

    /* ------------------------------------------------------------------ */
    /* State checks                                                       */
    /* ------------------------------------------------------------------ */

    // Purpose : Whether the element is visible
    async isVisible(target: flex): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isVisible();
        this.log.debug(`isVisible('${this.describe(target)}') => ${result}`);
        return result;
    }

    // Purpose : Whether the element is hidden / not present
    async isHidden(target: flex): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isHidden();
        this.log.debug(`isHidden('${this.describe(target)}') => ${result}`);
        return result;
    }

    // Purpose : Whether the element is enabled
    async isEnabled(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isEnabled({ timeout });
        this.log.debug(`isEnabled('${this.describe(target)}') => ${result}`);
        return result;
    }

    // Purpose : Whether the element is disabled
    async isDisabled(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isDisabled({ timeout });
        this.log.debug(`isDisabled('${this.describe(target)}') => ${result}`);
        return result;
    }

    // Purpose : Whether a checkbox/radio is checked
    async isChecked(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isChecked({ timeout });
        this.log.debug(`isChecked('${this.describe(target)}') => ${result}`);
        return result;
    }

    // Purpose : Whether the element is editable
    async isEditable(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isEditable({ timeout });
        this.log.debug(`isEditable('${this.describe(target)}') => ${result}`);
        return result;
    }

    /* ------------------------------------------------------------------ */
    /* Waits & scrolling                                                  */
    /* ------------------------------------------------------------------ */

    // Purpose : Wait until the element reaches the given state
    async waitFor(
        target: flex,
        state: "attached" | "detached" | "visible" | "hidden" = "visible",
        timeout: number = DEFAULT_TIMEOUT_IN_MS,
    ): Promise<void> {
        this.log.debug(`Wait for '${this.describe(target)}' to be '${state}'`);
        const loc = this.toLocator(target);
        await loc.waitFor({ state, timeout });
    }

    // Purpose : Scroll the element into the viewport if needed
    async scrollIntoView(target: flex, timeout: number = DEFAULT_TIMEOUT_IN_MS): Promise<void> {
        this.log.debug(`Scroll '${this.describe(target)}' into view`);
        const loc = this.toLocator(target);
        await loc.scrollIntoViewIfNeeded({ timeout });
    }

    /* ------------------------------------------------------------------ */
    /* Locator helpers                                                    */
    /* ------------------------------------------------------------------ */

    // Purpose : Return the nth matching element (0-based)
    nth(target: flex, index: number): Locator {
        return this.toLocator(target).nth(index);
    }

    // Purpose : Return the first matching element
    first(target: flex): Locator {
        return this.toLocator(target).first();
    }

    // Purpose : Return the last matching element
    last(target: flex): Locator {
        return this.toLocator(target).last();
    }
}
