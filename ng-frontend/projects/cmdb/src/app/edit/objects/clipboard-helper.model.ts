export class ClipboardHelper {
    static getTableContent(data: DataTransfer): string[][] {
        // first, try html
        let result = data.getData('text/html');
        ClipboardHelper.sanitize(result);
        if (result.length > 0) {
            const dom = new DOMParser().parseFromString(result, 'text/html');
            const table = dom.querySelector('table');
            // only, if a table element exists
            if (table) {
                // get rows
                const tableRows = table.querySelectorAll('tr');
                if (tableRows.length > 0) {
                    const rows: string[][] = [];
                    // translate table rows to simple rows
                    tableRows.forEach((r, i) => {
                        const cells = r.querySelectorAll('td');
                        const cols: string[] = [];
                        cells.forEach(c => {
                            // rowspans or colspans alter the structure of other rows or columns
                            // it is too cumbersome to capture this, and so this is forbidden
                            if (c.hasAttribute('rowspan') || c.hasAttribute('colspan')) {
                                throw new Error('The rowspan and colspan attributes are not allowed inside tables for import');
                            }
                            // MultiLines will be stored as multilines, but HTML code like formatting will be lost
                            const text = c.textContent ?? '';
                            cols.push(text);
                        });
                        rows.push(cols);
                    });
                    if (rows.length > 0) {
                        // check, if all rows have the same number of columns
                        // if not, try fallback
                        const lengthes = [...new Set(rows.map(l => l.length))];
                        if (lengthes.length === 1 && lengthes[0] > 0) {
                            return rows;
                        }
                    }
                }
            }
        }
        // fallback solution, if html delivers no valid data
        result = data.getData('text/plain');
        if (result.length > 0) {
            const rows = result.split('\n').map(r => r.split('\t'));
            if (rows.length > 0) {
                // check, if all rows have the same number of columns
                // if not, fail
                const lengthes = [...new Set(rows.map(l => l.length))];
                if (lengthes.length === 1 && lengthes[0] > 0) {
                    return rows;
                }
            }
        }
        throw new Error('No valid table could be retrieved from clipboard.');
    }

    private static sanitize(result: string) {
        const regexTag = /\<(applet|audio|embed|object|script|video)/gmi
        const regexAttr = /\<[^>]+\s(on|action|background="http|cite|code|data|formaction|href="http|icon|longdesk|manifest|profile|src|usemap)/gmi;
        if (regexTag.test(result)) {
            throw new Error('Script content is forbidden due to prevention of XSS. Problematic tags found.');
        }
        if (regexAttr.test(result)) {
            throw new Error('Script content is forbidden due to prevention of XSS. problematic attributes found.');
        }
    }
}
