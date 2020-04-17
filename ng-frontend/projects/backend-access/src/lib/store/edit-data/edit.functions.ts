import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { CONFIGURATIONITEM, IMPORTDATATABLE, CONVERTFILETOTABLE } from '../constants';
import { getUrl, getHeader } from '../../functions';
import { TransferTable } from '../../objects/item-data/transfer-table.model';
import { RestLineMessage } from '../../rest-api/line-message.model';
import { LineMessage } from '../../objects/item-data/line-message.model';

export function importDataTable(http: HttpClient, itemTypeId: string, table: TransferTable) {
    return http.put<RestLineMessage[]>(getUrl(IMPORTDATATABLE), {
        table: {
            columns: table.columns.map(c => ({
                number: c.number,
                name: c.name,
                caption: c.caption,
            })),
            rows: table.rows,
        },
        itemTypeId
      }, { headers: getHeader() }).pipe(
        take(1),
        map(messages => messages.map(m => new LineMessage(m))),
    );
}

export function uploadAndConvertFileToTable(http: HttpClient, file: File) {
    const formData: FormData = new FormData();
    formData.append('contentStream', file, file.name);
    return http.post<string[][]>(getUrl(CONVERTFILETOTABLE), formData).pipe(take(1));
}
