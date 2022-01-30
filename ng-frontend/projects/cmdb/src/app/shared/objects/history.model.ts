import { HistoryEntry } from './history-entry.model';

export class History {
    private allowedFilters$: string[];
    constructor(private ownEntries: HistoryEntry[], public filter: '' | 'I' | 'A' | 'C') {
        this.allowedFilters$ = [...new Set(ownEntries.map(e => e.type))];
    }

    get entries() {
        return this.ownEntries.filter(entry => !this.filter ||  entry.type === this.filter);
    }

    get allowedFilters() {
        return [...this.allowedFilters$];
    }
}
