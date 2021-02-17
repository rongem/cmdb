export interface RestImportSheet {
    name: string;
    lines: string[][];
}

export interface RestImportResult {
    fileName: string;
    fileType: string;
    sheets: RestImportSheet[];
}
