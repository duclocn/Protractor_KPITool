import {ProtractorBrowser, browser, by, ExpectedConditions, protractor, element} from "protractor"
import { LoginLogout } from "../PageObjects/LoginLogoutPage";


//suite
describe("Login page ", function (){
    let loginLogoutPage: LoginLogout
    // testcase
    beforeEach(async function(){
        loginLogoutPage = new LoginLogout(browser)

        await browser.manage().window().maximize()
        await browser.get("http://10.1.0.62/kpiauto/#/")
    })

    it("PM Submit the report - curent week", async function(){
        //variables
        var roleDropdown = "//div[@class='select-option']"

        //Steps
        await loginLogoutPage.LoginUser("tvquan","1234")
        await loginLogoutPage.VerifyProfileName("TRẦN VŨ QUÂN")
        //await browser.element(by.xpath(rol))

        //expected
        
    })

    
})