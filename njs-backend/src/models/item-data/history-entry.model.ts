
export class HistoryEntry {
    dateTime!: Date;
    scope!: string;
    subject!: string;
    text!: string;
    userToken!: string;

    constructor(entry?: any) {
        if (entry) {
            this.dateTime = new Date(+entry.DateTime / 10000);
            this.scope = entry.Scope;
            this.subject = entry.Subject;
            this.text = entry.Text;
            this.userToken = entry.Responsible;
        }
    }
}
