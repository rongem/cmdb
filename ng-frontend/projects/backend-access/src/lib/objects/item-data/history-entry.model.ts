import { RestHistoryEntry } from '../../old-rest-api/item-data/history-entry.model';

export class HistoryEntry {
    dateTime: Date;
    scope: string;
    subject: string;
    text: string;
    userToken: string;

    constructor(entry?: RestHistoryEntry) {
        if (entry) {
            this.dateTime = new Date(+entry.DateTime / 10000);
            this.scope = entry.Scope;
            this.subject = entry.Subject;
            this.text = entry.Text;
            this.userToken = entry.Responsible;
        }
    }
}
