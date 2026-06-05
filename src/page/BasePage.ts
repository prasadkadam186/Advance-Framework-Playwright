import { Page } from "@playwright/test";
import { UiElementLocator } from "@utils/UiElementLocator";
import { getLogger, Logger } from "@utils/Logger";

export class BasePage{
    protected readonly page : Page;
    protected readonly el : UiElementLocator;
    protected readonly log : Logger
    protected constructor(page : Page, scope : string){
        this.page = page;
        this.el = new UiElementLocator(page)
        this.log = getLogger(scope);
    }

     async navigate(path : string) : Promise<void>{
        await this.page.goto(path, {waitUntil : 'domcontentloaded'})
    }
}