import {ProtractorBrowser, browser, by, ExpectedConditions, protractor} from "protractor"
import { Login } from "../PageObjects/LoginPage";


//suite
describe("Login page ", function (){
    let loginPage: Login
    // testcase
    beforeEach(async function(){
        loginPage = new Login(browser)

        await browser.manage().window().maximize()
        await browser.get("http://10.1.0.62/kpiauto/#/")
    })

    it("Login to KPI Dashboard without Username and Password", async function(){
        //variables
        await loginPage.LoginUser("","")

        //expected
        await loginPage.loginWithoutUsername("Username is required")
        await loginPage.loginWithoutPassword("Password is required")
    })

    it("Login to KPI Dashboard without Username", async function(){
        await loginPage.LoginUser("", "1")

        //Expected
        await loginPage.loginWithoutUsername("Username is required")
    })

    it("Login to KPI Dashboard without Password", async function(){
        //variables
        await loginPage.LoginUser("tpphuoc", "")

        //Expected
        await loginPage.loginWithoutPassword("Password is required")
    })

    fit("Login to KPI Dashboard without un-existed user", async function(){
        //Steps:
        await loginPage.LoginUser("abc", "abc")

        //Verify result
        await loginPage.loginWithUnexistedUser("Invalid User")
    })       

    it("Login to KPI Dashboard successfully", async function(){
        //automate each step
        await loginPage.LoginUser("tpphuoc", "1234")
       
        //verify result
        await loginPage.VerifyProfileName("TRẦN PHÚ PHƯỚC")
    })
})