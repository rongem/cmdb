import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { DisplayServiceModule } from '../display-service.module';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({providedIn: DisplayServiceModule})
export class ExcelService {
    constructor() { }
    public exportAsExcelFile(json: any[], fileName: string = 'export.xlsx'): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, fileName);
    }

    public exportAsCsvFile(data: any, fileName: string = 'export.csv') {
        const replacer = (key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        const csv = data.map((row: { [x: string]: any; }) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');

        const a = document.createElement('a');
        const blob = new Blob([csvArray], {type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
