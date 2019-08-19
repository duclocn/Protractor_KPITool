import { Workbook } from "exceljs";

export class dataBuilder {

    static async readExcel(filePath:string, sheet:string, testcaseID:string): Promise<Array<Map<string, string>>>{
        // create object for workbook
        let wb = new Workbook();
        let dataArr: Array<Map<string,string>> = [];

        //read file excel
        await wb.xlsx.readFile(filePath);
        //open worksheet
        let worksheet = await wb.getWorksheet(sheet);

        //get row number
        let rowCount = await worksheet.rowCount;
        //console.log("Row number " + rowCount)

        //get column number
        let columnCount = await worksheet.getRow(1).cellCount;
        //console.log("Column number " + columnCount);
        //get header columns
        let columnHeaders = await worksheet.getRow(1);
        let r:number;
        for(r=2; r<=rowCount;r++){
            let testcaseIDValue = String(worksheet.getRow(r).getCell(1).value)
            if(testcaseIDValue == testcaseID){
                let map = new Map<string, string>();
                for(let c=1;c<=columnCount;c++){
                    //console.log("row: " + (r-1)+ ", column: " + c)
                    let headerValue = String(columnHeaders.getCell(c).value);
                    let cellValue = String(worksheet.getRow(r).getCell(c).value);
                    //console.log("Header: " + headerValue);
                    if(cellValue == "null")
                        cellValue= "";
                    
                    //console.log("Cell Value:" + cellValue);
                    map.set(headerValue,cellValue);
                }
                //console.log("Added row " + (r-1) + " to dataArray")                
                dataArr.push(map);
            }
        }
        return dataArr;
    }
//readExcel(".\\way2automation.xlsx", "Login", "TC1");
}