import { ProtractorBrowser, protractor, by, ExpectedConditions, browser, until, element, ElementArrayFinder } from "protractor";
import {async} from "q";
import {ActionSupport} from "../core_function/actionSupport/actionSupport"

export class LoginLogout{
    //Variables and Contructor
    userNameXPath: string
    passWordXPath: string
    userNameError_MesXPath: string
    passWordError_MesXPath: string 
    loginBtnXPath: string
    fullNameXPath: string
    dropDownProfileXPath: string
    logoutBtnXPath: string
    loginTitleXPath: string
    projectKPIXPath: string
    othersRoleKPIXPath: string
    selectRoleDropdowXPath: string
    rolesXPath: string

    constructor(browser: ProtractorBrowser){
        this.userNameXPath = "//input[@ng-model='username']"
        this.passWordXPath = "//input[@ng-model='password']"
        //this.userNameError_Mes = "//span[contains(text(),'Username is required')]"
        //this.passWordError_Mes = "//span[contains(text(),'Password is required')]"
        this.userNameError_MesXPath = "//span[@ng-show='loginForm.username.$error.required']"
        this.passWordError_MesXPath = "//span[@ng-show='loginForm.password.$error.required']"
        this.loginBtnXPath = "//input[@ng-click='login(loginForm)']"
        this.fullNameXPath = "//div[@class='fullname ng-binding']"
        this.dropDownProfileXPath = "//span[@ng-click='clickToShowSelectRole()']"
        this.logoutBtnXPath = "//a[@ng-click='logOut()']"
        this.loginTitleXPath = "//legend[text()='Login']"
        this.projectKPIXPath = "//div[@class='col-item col-kpi p-2']"
        this.othersRoleKPIXPath = "//div[@class='col-item col-kpi p-2 ng-binding']"
        this.selectRoleDropdowXPath = "//div[@ng-click='selectRole()']"
        this.rolesXPath = "//span[@class='ng-binding']"
    }

    async LoginUser(username: string, password: string){
        let actionSupport = new ActionSupport(browser)
        console.log("input Username: " + username)
        await browser.element(by.xpath(this.userNameXPath)).sendKeys(username)
        console.log("input Password: " + password)
        await browser.element(by.xpath(this.passWordXPath)).sendKeys(password)
        await actionSupport.clickOnElement(this.loginBtnXPath)
    }

    async VerifyProfileName(fullname: string){
        let actionSupport = new ActionSupport(browser)
        await actionSupport.clickOnElement(this.dropDownProfileXPath)
        let fn = actionSupport.getElementText(this.fullNameXPath)
        await expect(fn).toContain(fullname)
        console.log("Full name is: " + fullname)
    }

    async LoginWithoutUsername(errormessage: string){
        console.log("Username error message: " + errormessage)
        await expect(browser.element(by.xpath(this.userNameError_MesXPath)).getText()).toContain(errormessage)
    }

    async LoginWithoutPassword(errormessage: string){
        console.log("Passowrd error message: " + errormessage)
        await expect(browser.element(by.xpath(this.passWordError_MesXPath)).getText()).toContain(errormessage)
    }
    
    async LoginWithUnexistedUser(alerttext: string){
        let actionSupport = new ActionSupport(browser)
        let alertText = await actionSupport.getAlertObject()
        await expect(alertText.getText()).toContain(alerttext)
        console.log("Un-exsit user inputted. Get the error message: " + alerttext)
    }

    async VerifyKPITabelName(role: string){
        let actionSupport = new ActionSupport(browser)
        let KPITableName: string = ""
        //let name = "//div[contains(text(),'Project's KPI')]"
        if(role = "Project's KPI"){
            KPITableName = await actionSupport.getElementText(this.projectKPIXPath)
        }else{
            KPITableName = await actionSupport.getElementText(this.othersRoleKPIXPath)
        }
        
        await expect(KPITableName).toContain(role.trim())
        console.log("KPI table name is: " + KPITableName)
    }

    async SelectRole(nameofrole: string){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.selectRoleDropdowXPath)
        let roles = browser.element.all(by.xpath(this.rolesXPath))
        let roleNames = await roles.getText()
        let exist = false
        for(let i=0; i<roleNames.length;i++){
            if(roleNames[i] == nameofrole){
                exist = true
                break
            }
        }

        if(exist){
            
            let roleName = "//li[contains(text(), '"+ nameofrole +"')]"
            await actionSupport.clickOnElement(roleName)
            await browser.sleep(3000)
        }else
            console.log("The role does not exist.")
    }

    async Logout(){
        let actionSupport = new ActionSupport(browser)
        await actionSupport.clickOnElement(this.logoutBtnXPath)
        await browser.sleep(2000)
        await expect(element(by.xpath(this.loginTitleXPath)).getText()).toContain("Login")
        console.log("User logout successfully")
    }
}