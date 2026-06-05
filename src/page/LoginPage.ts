import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage{
    static readonly url = 'https://app.thetestingacademy.com/playwright/ttacart/';
    private readonly usernameInputField : Locator;
    private readonly passwordInputField : Locator;
    private readonly loginButtonField : Locator;
    private readonly errorBox : Locator;
    constructor(page : Page){
        super(page, 'LoginPage');
        this.usernameInputField = page.getByPlaceholder('Username');
        this.passwordInputField = page.getByPlaceholder('Password');
        this.loginButtonField = page.locator('#login-button');
        this.errorBox = page.locator('#login-error');
    }

    async goTologinUrl() : Promise<void>{
        await this.navigate(LoginPage.url)
    }

    async login(username : string, password : string) : Promise<void>{
        await this.el.clear(this.usernameInputField)
        await this.el.fill(this.usernameInputField, username);
         await this.el.clear(this.passwordInputField)
        await this.el.fill(this.passwordInputField, password);
        await this.el.click(this.loginButtonField)
    }

   
}