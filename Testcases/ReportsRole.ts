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
        console.log("User name " + browser.params.user)
        await loginLogoutPage.LoginUser(browser.params.user, browser.params.pass)
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
        await reportsPage.ClickStatusBtn("Schedule").prevVal.click()
        await reportsPage.SelectRedStatus()
        await reportsPage.ClickCommentBtn("Schedule").prevVal.click()
        await reportsPage.AddNewIssueWithoutResolved("Issue title", "Issue Description", "Issue Action")
        await reportsPage.ActionAddIssueCommentModal("issue", "Add & Close")
        
        await reportsPage.ClickProjectHighlightComment("Improvements /Initiatives", "Improvements /Initiatives text")
        await reportsPage.ClickProjectHighlightComment("Project Highlight", "Project Highlight text")
        await reportsPage.ClickProjectHighlightComment("Other Activities", "Other Activities text")

        //expected
        
    })
})