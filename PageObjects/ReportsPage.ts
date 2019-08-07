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
    redStatusXPath: string
    yellowStatusXPath: string
    greenStatusXPath: string
    iframe_OtherActivitiesXPath: string
    iframe_ProjectHighlightXPath: string
    iframe_ImprovementsXPath: string
    titleXPath: string
    descriptionXPath: string
    actionXPath: string
    checkResolvedXPath: string
    AddMewModelXPath: string
    
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
        this.redStatusXPath = "//div[@class='color-item ng-scope bg-red']"
        this.yellowStatusXPath = "//div[@class='color-item ng-scope bg-yellow']"
        this.greenStatusXPath = "//div[@class='color-item ng-scope bg-green']"
        this.iframe_OtherActivitiesXPath = "//div[text()='Other Activities']//following-sibling::div[1]//iframe"
        this.iframe_ProjectHighlightXPath = "//div[text()='Project Highlight']//following-sibling::div[1]//iframe"
        this.iframe_ImprovementsXPath = "//div[text()='Improvements /Initiatives']//following-sibling::div[1]//iframe"
        this.titleXPath = "//input[@ng-click='clickChangeTitle()']"
        this.descriptionXPath = "//textarea[@ng-click='clickChangeDescription()']"
        this.actionXPath = "//textarea[@ng-model='action']"
        this.checkResolvedXPath = "//input[@ng-model='resolve']"
        this.AddMewModelXPath = "//div[contains(text(),'Add New Issue / Comment')]"
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

    getCurrentWeek(curDate:Date) {
        curDate = new Date(Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()));
        curDate.setUTCDate(curDate.getUTCDate() + 4 - (curDate.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(curDate.getUTCFullYear(), 0, 1));
        var curweek = Math.ceil((((curDate.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
        return curweek
    }

    ClickStatusBtn(KPIname: string) {
        let cur = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[4]//button[@ng-click='changeChooseKPIStatus(weekReport, kpi, $event)']"))
        let prev = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[3]//button[@ng-click='changeChooseKPIStatus(weekReport, kpi, $event)']"))
        
        let statusKPI = {
            curVal: cur,
            prevVal: prev
        }
        return statusKPI;
    }

    ClickCommentBtn(KPIname: string) {
        let cur = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[4]//button[@ng-click='addNewIssue(weekReport,kpi)']"))
        let prev = browser.element(by.xpath("//div[@class='row-item row-kpi d-flex justify-content-start align-items-center ng-scope']//div[text()='" + KPIname + "']//following-sibling::div[3]//button[@ng-click='addNewIssue(weekReport,kpi)']"))
        let commentKPI = {
            curVal: cur,
            prevVal: prev
        }
        return commentKPI;
    }

    async SelectRedStatus(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.redStatusXPath)
        await browser.sleep(1000)
    }

    async SelectYellowStatus(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.yellowStatusXPath)
        await browser.sleep(1000)
    }

    async SelectGreenStatus(){
        let actionSupport = new ActionSupport(browser)

        await actionSupport.clickOnElement(this.greenStatusXPath)
        await browser.sleep(1000)
    }

    async ClickProjectHighlightComment(prohighlight: string, content: string) {
        let actionSupport = new ActionSupport(browser)
        let projectHighlight = "//div[text()='" + prohighlight + "']//following-sibling::div[1]//iframe"

        await actionSupport.clickOnElement(projectHighlight)
        await browser.switchTo().frame(browser.element(by.xpath(projectHighlight)).getWebElement())
        await browser.waitForAngularEnabled(false)
        await browser.element(by.tagName('body')).sendKeys(content)
        await browser.switchTo().defaultContent()
        await browser.sleep(1000)
    }

    async IssueCommentOption(option: string){
        let actionSupport = new ActionSupport(browser)
        let opt = "//label[@for='type-"+ option +"']"

        actionSupport.clickOnElement(opt)
        await browser.sleep(1000)
    }

    async AddNewComment(){
        let actionSupport = new ActionSupport(browser)

        await this.IssueCommentOption("comment")
        await actionSupport.sendKeysOnElement(this.titleXPath,"Comment Title")
        await browser.sleep(1000)
        await actionSupport.sendKeysOnElement(this.descriptionXPath,"Comment Description")
        await browser.sleep(1000)
    }

    async AddNewIssueWithoutResolved(title: string, description: string, action: string){
        let actionSupport = new ActionSupport(browser)

        await this.IssueCommentOption("issue")
        await actionSupport.sendKeysOnElement(this.titleXPath, title)
        await browser.sleep(1000)
        await actionSupport.sendKeysOnElement(this.descriptionXPath, description)
        await browser.sleep(1000)
        await actionSupport.sendKeysOnElement(this.actionXPath, action)
        await browser.sleep(1000)
    }

    async ActionAddIssueCommentModal(type: string, action: string){
        let actionSupport = new ActionSupport(browser)
        let act = "//button[contains(text(), '"+ action +"')]"
        let addSuccess_msg = "//span[contains(text(),'Added the " + type + " successfully')]"
        let message = await browser.element(by.xpath(addSuccess_msg))

        await actionSupport.clickOnElement(act)
        await expect(browser.wait(ExpectedConditions.invisibilityOf(message), 10000, message.locator())).toBe(true)
        await expect(browser.element(by.xpath(this.AddMewModelXPath)).isPresent()).toBe(false)
        await browser.sleep(1000)
    }
}