import {ProtractorBrowser, browser, by, ExpectedConditions, protractor, element} from "protractor"
import { LoginLogout } from "../PageObjects/LoginLogoutPage";
import { Reports } from "../PageObjects/ReportsPage";


//suite
describe("Login page ", function (){
    let loginLogoutPage: LoginLogout
    let reportsPage: Reports

    // testcase
    beforeEach(async function(){
        loginLogoutPage = new LoginLogout(browser)

        await browser.manage().window().maximize()
        await browser.get("http://10.1.0.62/kpiauto/#/")
        await loginLogoutPage.LoginUser("ttthuyan","1234")
        await loginLogoutPage.VerifyProfileName("TRẦN THỊ THÚY AN")
    })

    it("Submit the report - curent week", async function(){
        //variables

        //Steps
        await reportsPage.SelectRole("Project Head")
        await reportsPage.VerifyKPITabelName("Project's KPI")

        //expected
        
    })

    
})