import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { DisplayServiceModule } from '../display-service.module';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({providedIn: DisplayServiceModule})
export class ExcelService {
    constructor() { }
    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'export.xlsx');
    }

    public exportAsCsvFile(data: any) {
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
    
        var a = document.createElement('a');
        var blob = new Blob([csvArray], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
    
        a.href = url;
        a.download = "myFile.csv";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
