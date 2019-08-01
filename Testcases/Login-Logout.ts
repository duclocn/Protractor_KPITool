import {ProtractorBrowser, browser, by, ExpectedConditions, protractor} from "protractor"
import { LoginLogout } from "../PageObjects/LoginLogoutPage";
import { async } from "q";


//suite
describe("Login page ", function (){
    let loginLogoutPage: LoginLogout
    // testcase
    beforeEach(async function(){
        loginLogoutPage = new LoginLogout(browser)

        await browser.manage().window().maximize()
        await browser.get("http://10.1.0.62/kpiauto/#/")
    })

    it("Login to KPI Dashboard without Username and Password", async function(){
        //variables
        await loginLogoutPage.LoginUser("","")

        //expected
        await loginLogoutPage.LoginWithoutUsername("Username is required")
        await loginLogoutPage.LoginWithoutPassword("Password is required")
    })

    it("Login to KPI Dashboard without Username", async function(){
        await loginLogoutPage.LoginUser("", "1")

        //Expected
        await loginLogoutPage.LoginWithoutUsername("Username is required")
    })

    it("Login to KPI Dashboard without Password", async function(){
        //variables
        await loginLogoutPage.LoginUser("tpphuoc", "")

        //Expected
        await loginLogoutPage.LoginWithoutPassword("Password is required")
    })

    it("Login to KPI Dashboard without un-existed user", async function(){
        //Steps:
        await loginLogoutPage.LoginUser("abc", "abc")

        //Verify result
        await loginLogoutPage.LoginWithUnexistedUser("Invalid User")
    })       

    it("Login to KPI Dashboard successfully", async function(){
        //automate each step
        await loginLogoutPage.LoginUser("tpphuoc", "1234")
       
        //verify result
        await loginLogoutPage.VerifyProfileName("TRẦN PHÚ PHƯỚC")
    })

    fit("Logout user", async function(){
        await loginLogoutPage.LoginUser("tpphuoc", "1234")
        await loginLogoutPage.VerifyProfileName("TRẦN PHÚ PHƯỚC")
        await loginLogoutPage.Logout()
    })
})