import {test} from '@playwright/test'
import { LoginPage } from '../page/LoginPage'

test.describe('Login Test', ()=>{
    let loginpage : LoginPage
    
    test.beforeEach(async ({page})=>{
        loginpage = new LoginPage(page)
        await loginpage.goTologinUrl();
    })
    test('Login to the Application', async ({page})=>{
        await loginpage.login('standard_user','tta_secret')
    })
})