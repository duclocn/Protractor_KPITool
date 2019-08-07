import {ProtractorBrowser, browser, by, ExpectedConditions, protractor, element} from "protractor"
import { LoginLogout } from "../PageObjects/LoginLogoutPage";
import { Reports } from "../PageObjects/ReportsPage";


//suite
describe("Report page ", function (){
    let loginLogoutPage: LoginLogout
    let reportsPage: Reports

    // testcase
    beforeEach(async function(){
        loginLogoutPage = new LoginLogout(browser)
        reportsPage = new Reports(browser)
        await browser.manage().window().maximize()
        await browser.get("http://10.1.0.62/kpiauto/#/")
        // await loginLogoutPage.LoginUser("ttthuyan","1234")
        // await loginLogoutPage.VerifyProfileName("TRẦN THỊ THÚY AN")
        await loginLogoutPage.LoginUser("ttthuyan","1234")
        await loginLogoutPage.VerifyProfileName("TRẦN THỊ THÚY AN")
        await loginLogoutPage.SelectRole("Project Head")
        await loginLogoutPage.VerifyKPITabelName("Project's KPI")
    })

    fit("Submit the report - current week", async function(){
        //variables

        //Steps
        await reportsPage.SelectProject("AISIN Mobile")
        await reportsPage.VerifySelectProjectSuccess("AISIN Mobile")
        await browser.sleep(2000)
        //await reportsPage.selectStartDate(28,2019)
        //await reportsPage.selectEndDate(28,2019)
        //await browser.sleep(3000)
        await reportsPage.ClickStatusBtn("prev")
        
        //expected
        
    })

    
})