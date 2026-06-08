import {test} from '@playwright/test'
import { LoginPage } from '../page/LoginPage'

test.describe('@P0 Login feature testing', ()=>{
    let loginpage : LoginPage
    
    test.beforeEach(async ({page})=>{
        loginpage = new LoginPage(page)
        await loginpage.goTologinUrl();
    })
    test('Login to the Application', async ()=>{
        await loginpage.login('standard_user','tta_secret')
    })
})