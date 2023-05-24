export class ClipboardHelper {
    static getTableContent(data: DataTransfer): string[][] {
        // first, try html
        let result = data.getData('text/html');
        if (result.length > 0 && !result.includes('<script>')) {
            const dom = new DOMParser().parseFromString(result, 'text/html');
            const table = dom.querySelector('table');
            // only, if a table element exists
            if (table) {
                // get rows
                const rows = table.querySelectorAll('tr');
                if (rows.length > 0) {
                    const lines: string[][] = [];
                    // translate rows to lines
                    rows.forEach((r, i) => {
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
                        lines.push(cols);
                    });
                    if (lines.length > 0) {
                        // check, if all rows have the same number of columns
                        // if not, try fallback
                        const lengthes = [...new Set(lines.map(l => l.length))];
                        if (lengthes.length === 1 && lengthes[0] > 0) {
                            return lines;
                        }
                    }
                }
            }
        }
        // fallback solution, if html delivers no valid data
        result = data.getData('text/plain');
        if (result.length > 0) {
            const lines = result.split('\n').map(r => r.split('\t'));
            if (lines.length > 0) {
                // check, if all rows have the same number of columns
                // if not, fail
                const lengthes = [...new Set(lines.map(l => l.length))];
                if (lengthes.length === 1 && lengthes[0] > 0) {
                    return lines;
                }
            }
        }
        throw new Error('No valid table could be retrieved from clipboard.');
    }
}
