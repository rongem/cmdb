import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({providedIn: 'root'})
export class ExportService {
    constructor() { }
    public exportAsExcelFile(json: any[], fileName: string = 'export.xlsx'): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        // eslint-disable-next-line @typescript-eslint/naming-convention, quote-props
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, fileName);
    }

    public exportAsCsvFile(data: any[], fileName: string = 'export.csv') {
        const replacer = (key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        // make sure all keys are included
        data.forEach(el => Object.keys(el).forEach(key => {
            if (!header.includes(key)) {
                header.push(key);
            }
        }));
        const csv = data.map((row: { [x: string]: any }) =>
            header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');

        const blob = new Blob([csvArray], {type: 'text/csv' });
        this.saveFile(blob, fileName);
    }

    exportToClipboard(table: HTMLTableElement) {
        navigator.clipboard.writeText(table.outerHTML);
    }

    private saveFile(blob: Blob, fileName: string) {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
