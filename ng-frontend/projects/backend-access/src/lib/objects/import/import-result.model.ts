import { RestImportResult } from '../../rest-api/rest-import-result.model';
import { ImportSheet } from './import-sheet.model';

export class ImportResult {
    fileName: string;
    fileType: string;
    sheets: ImportSheet[];

    constructor(result?: RestImportResult) {
        if (result) {
            this.fileName = result.fileName;
            this.fileType = result.fileType;
            this.sheets = result.sheets.map(s => new ImportSheet(s));
        }
    }
}
