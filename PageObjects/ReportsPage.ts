import { ProtractorBrowser, protractor, by, ExpectedConditions, browser, until } from "protractor";
import {async} from "q";
import { ActionSupport } from '../core_function/actionSupport/actionSupport';
import { LoginLogout } from "./LoginLogoutPage";

export class Reports{
    //Variables and Contructor
    dropDownProfile: string
    selectRoleDropdow: string
    //selectRole: string
    projectKPI: string
    othersRoleKPI: string
    startDate: string
    endDate: string

    constructor(browser: ProtractorBrowser){
        this.dropDownProfile = "//span[@ng-click='clickToShowSelectRole()']"
        this.selectRoleDropdow = "//div[@ng-click='selectRole()']"
        //this.selectRole = "//li[@ng-repeat='unitRole in currentUser.unitRoles']"
        this.projectKPI = "//div[@class='col-item col-kpi p-2']"
        this.othersRoleKPI = "//div[@class='col-item col-kpi p-2 ng-binding']"
        this.startDate = "//input[@ng-model='dateWeekNumber.startDate']"
        this.endDate = "//input[@ng-model='dateWeekNumber.endDate']"
    }

    

    async VerifyKPITabelName(role: string){
        let actionSupport = new ActionSupport(browser)
        let KPITableName: string = ""
        //let name = "//div[contains(text(),'Project's KPI')]"
        if(role = "Project's KPI"){
            KPITableName = await actionSupport.getElementText(this.projectKPI)
        }else{
            KPITableName = await actionSupport.getElementText(this.othersRoleKPI)
        }
        
        await expect(KPITableName).toContain(role.trim())
        console.log("KPI table name is: " + KPITableName)
    }

    async SelectRole(nameofrole: string){
        let actionSupport = new ActionSupport(browser)
        let roleName = "//li[contains(text(), '"+ nameofrole +"')]"
        await actionSupport.clickOnElement(this.selectRoleDropdow)
        await actionSupport.clickOnElement(roleName)
        await browser.sleep(3000)
    }
    
    async SelectProject(projectname: string){
        let actionSupport = new ActionSupport(browser)
        let projectName = "//span[contains(text(),'"+ projectname +"')]"
        
        await actionSupport.clickOnElement(projectName)
        await browser.sleep(3000)

    }

}