import { ProtractorBrowser, protractor, by, ExpectedConditions, browser, until, Key } from "protractor";
import {async} from "q";
import { ActionSupport } from '../core_function/actionSupport/actionSupport';
import { LoginLogout } from "./LoginLogoutPage";

export class Reports{
    //Variables and Contructor
    dropDownProfile: string
    startWeekXPath: string
    endWeekXPath: string
    previousButtonXPath: string
    nextButtonXPath: string
    lastFor4WeeksXPath: string
    projectXPath: string
    arrowDownProjectXPath: string
    submitCurBtn_PM_XPath: string
    submitPreBtn_PM_XPath: string
    submitCurBtn_OtherRoles_XPath: string
    submitPreBtn_OtherRoles_XPath: string
    applyBtnXPath: string
    
    constructor(browser: ProtractorBrowser){
        this.dropDownProfile = "//span[@ng-click='clickToShowSelectRole()']"
        this.startWeekXPath = "//input[@ng-model='dateWeekNumber.startDate']"
        this.endWeekXPath = "//input[@ng-model='dateWeekNumber.endDate']"
        this.previousButtonXPath = "//span[@ng-click='descreaseWeek()']"
        this.nextButtonXPath = "//span[@ng-click='increaseWeek()']"
        this.lastFor4WeeksXPath = "//button[@ng-click='applyLastFourWeek()']"
        this.projectXPath = "//span[@class='nav-link ng-binding']"
        this.arrowDownProjectXPath = "//li[@class='nav-item tab-project-item uib-tab  active']//span"
        this.submitCurBtn_PM_XPath = "//div[@class='col-item col-kpi p-2']//following-sibling::div[4]//button[text()='Submit']"
        this.submitPreBtn_PM_XPath = "//div[@class='col-item col-kpi p-2']//following-sibling::div[3]//button[text()='Submit']"
        this.submitCurBtn_OtherRoles_XPath = "//div[@class='col-item col-kpi p-2 ng-binding']//following-sibling::div[4]//button[text()='Submit']"
        this.submitPreBtn_OtherRoles_XPath = "//div[@class='col-item col-kpi p-2 ng-binding']//following-sibling::div[3]//button[text()='Submit']"
        this.startWeekXPath = "//input[@ng-model='dateWeekNumber.startDate']"
        this.endWeekXPath = "//input[@ng-model='dateWeekNumber.endDate']"
        this.applyBtnXPath = "//button[@ng-click='applyReport()']"
    }

    async SelectProject(projectname: string){
        let actionSupport = new ActionSupport(browser)

        let projects = browser.element.all(by.xpath(this.projectXPath))
        let listOfProjectsName = await projects.getText()
        let exist = false;
        for(let i=0; i<listOfProjectsName.length; i++){
            if(listOfProjectsName[i] == projectname){
               exist = true;
               break;
            }       
        }

        if(exist)
        {
            console.log("The project is: " + projectname)
            let projectName = "//span[contains(text(),'"+ projectname +"')]"
            await actionSupport.clickOnElement(projectName)
            return
        }
        else
            console.log("The project is not exist.")
    }

    async VerifySelectProjectSuccess(projectname: string){
        let actionSupport = new ActionSupport(browser)
        let currentProject = actionSupport.getElementText(this.arrowDownProjectXPath)
        await expect(currentProject).toEqual(projectname)
        console.log("Current project is: " + projectname)
        await browser.sleep(2000)
    }

    async ClickPreviousWeek(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.previousButtonXPath)
        await browser.sleep(1000)
    }

    async ClickNextWeek(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.nextButtonXPath)
        await browser.sleep(1000)
    }

    async ClickLast4Weeks(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.lastFor4WeeksXPath)
        await browser.sleep(1000)
    }

    async ClickApplyWeek(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.applyBtnXPath)
        await browser.sleep(1000)
    }

    async selectStartDate(week: number, year: number){
        await browser.element(by.xpath(this.startWeekXPath)).click()
        await browser.element(by.xpath(this.startWeekXPath)).sendKeys(year)
        await browser.element(by.xpath(this.startWeekXPath)).sendKeys(Key.ARROW_LEFT)
        await browser.sleep(1000)
        await browser.element(by.xpath(this.startWeekXPath)).sendKeys(week)
        await browser.sleep(1000)
        console.log("Current start week is: Week " + week + ", " + year)
    }

    async selectEndDate(week: number, year: number){
        await browser.element(by.xpath(this.endWeekXPath)).click()
        await browser.element(by.xpath(this.endWeekXPath)).sendKeys(year)
        await browser.element(by.xpath(this.endWeekXPath)).sendKeys(Key.ARROW_LEFT)
        await browser.sleep(1000)
        await browser.element(by.xpath(this.endWeekXPath)).sendKeys(week)
        await browser.sleep(1000)
        await browser.element(by.xpath(this.endWeekXPath)).click()
        console.log("Current end week is: Week " + week + ", " + year)
    }

    async getCurrentWeek(curDate:Date) {
        curDate = new Date(Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()));
        curDate.setUTCDate(curDate.getUTCDate() + 4 - (curDate.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(curDate.getUTCFullYear(), 0, 1));
        var curweek = Math.ceil((((curDate.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
        return curweek
    }

    async ClickStatusBtn(KPIname: string) {
        let cur = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[4]//button[@ng-click='changeChooseKPIStatus(weekReport, kpi, $event)']"))
        let prev = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[3]//button[@ng-click='changeChooseKPIStatus(weekReport, kpi, $event)']"))
        
        let statusKPI = {
            curVal: cur,
            prevVal: prev
        }
        return statusKPI;
    }

    async ClickCommentBtn(KPIname: string) {
        let cur = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[4]//button[@ng-click='addNewIssue(weekReport,kpi)']"))
        let prev = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[3]//button[@ng-click='addNewIssue(weekReport,kpi)']"))
        let commentKPI = {
            curval: cur,
            prevval: prev
        }
        return commentKPI;
    }
   
}