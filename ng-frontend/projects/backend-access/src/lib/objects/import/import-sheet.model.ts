import { RestImportSheet } from '../../rest-api/rest-import-result.model';

export class ImportSheet {
    name: string;
    lines: string[][];

    constructor(sheet: RestImportSheet) {
        this.name = sheet.name;
        this.lines = sheet.lines.map(l => l.slice());
    }
}
