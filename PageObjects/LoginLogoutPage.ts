import { ProtractorBrowser, protractor, by, ExpectedConditions, browser, until, element, ElementArrayFinder } from "protractor";
import {async} from "q";
import {ActionSupport} from "../core_function/actionSupport/actionSupport"

export class LoginLogout{
    //Variables and Contructor
    userName: string
    passWord: string
    userNameError_Mes: string
    passWordError_Mes: string 
    loginBtn: string
    fullName: string
    dropDownProfile: string
    logoutBtn: string
    loginTitle: string
    selectRole: string

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
        this.logoutBtn = "//a[@ng-click='logOut()']"
        this.loginTitle = "//legend[text()='Login']"
        this.selectRole = "//div[@ng-click='selectRole()']"
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

    async LoginWithoutUsername(errormessage: string){
        console.log("Username error message: " + errormessage)
        await expect(browser.element(by.xpath(this.userNameError_Mes)).getText()).toContain(errormessage)
    }

    async LoginWithoutPassword(errormessage: string){
        console.log("Passowrd error message: " + errormessage)
        await expect(browser.element(by.xpath(this.passWordError_Mes)).getText()).toContain(errormessage)
    }
    
    async LoginWithUnexistedUser(alerttext: string){
        let actionSupport = new ActionSupport(browser)
        let alertText = await actionSupport.getAlertObject()
        await expect(alertText.getText()).toContain(alerttext)
        console.log("Un-exsit user inputted. Get the error message: " + alerttext)
    }

    async Logout(){
        let actionSupport = new ActionSupport(browser)
        await actionSupport.clickOnElement(this.logoutBtn)
        await browser.sleep(2000)
        await expect(element(by.xpath(this.loginTitle)).getText()).toContain("Login")
        console.log("User logout successfully")
    }
    
    async SelectRole(){
        let actionSupport = new ActionSupport(browser)
        //await actionSupport.clickOnElement(this.dropDownProfile)
        await actionSupport.clickOnElement(this.selectRole)

        // let tets = document.getElementsByClassName("options");
        // console.log(tets);
        // numbers.forEach(element => {
        //     console.log(element.getText());
        // });
        // for(var i in numbers){
        //     console.log(numbers[i].getText());
        // }

        var history = element(by.className('options'));
        console.log(history);
        //console.log(history.last().getText());

    }
}