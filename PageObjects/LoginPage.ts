import { ProtractorBrowser, protractor, by, ExpectedConditions, browser, until } from "protractor";
import {async} from "q";
import {ActionSupport} from "../core_function/actionSupport/actionSupport"

export class Login{
    //Variables and Contructor
    userName: string
    passWord: string
    userNameError_Mes: string
    passWordError_Mes: string 
    loginBtn: string
    fullName: string
    dropDownProfile: string

    constructor(browser: ProtractorBrowser){
        this.userName = "//input[@ng-model='username']"
        this.passWord = "//input[@ng-model='password']"
        //this.userNameError_Mes = "//span[contains(text(),'Username is required')]"
        //this.passWordError_Mes = "//span[contains(text(),'Password is required')]"
        this.userNameError_Mes = "//span[@ng-show='loginForm.username.$error.required']"
        this.passWordError_Mes = "//span[@ng-show='loginForm.password.$error.required']"
        this.loginBtn = "//input[@ng-click='login(loginForm)']"
        this.fullName = "//div[@class='fullname ng-binding']"
        this.dropDownProfile = "//span[@ng-click='clickToShowSelectRole()']"
    }

    async LoginUser(username: string, password: string){
        let actionSupport = new ActionSupport(browser)
        console.log("input Username: " + username)
        await browser.element(by.xpath(this.userName)).sendKeys(username)
        console.log("input Password: " + password)
        await browser.element(by.xpath(this.passWord)).sendKeys(password)
        await actionSupport.clickOnElement(this.loginBtn)
    }

    async VerifyProfileName(fullname: string){
        let actionSupport = new ActionSupport(browser)
        await actionSupport.clickOnElement(this.dropDownProfile)
        let fn = actionSupport.getElementText(this.fullName)
        await expect(fn).toContain(fullname)
    }

    async loginWithoutUsername(errormessage: string){
        await expect(browser.element(by.xpath(this.userNameError_Mes)).getText()).toContain(errormessage)
    }

    async loginWithoutPassword(errormessage: string){
        await expect(browser.element(by.xpath(this.passWordError_Mes)).getText()).toContain(errormessage)
    }
    
    async loginWithUnexistedUser(alerttext: string){
        let actionSupport = new ActionSupport(browser)
        let alertText = await actionSupport.getAlertObject()
        await expect(alertText.getText()).toContain(alerttext)
    }
}