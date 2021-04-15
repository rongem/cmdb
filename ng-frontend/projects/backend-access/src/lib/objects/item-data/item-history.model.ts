import { IRestItemHistory } from '../../rest-api/item-data/rest-item-history.model';
import { ConnectionHistory } from './connection-history.model';

class ItemEntry {
    id: string;
    typeId: string;
    type: string;
    lastChange: Date;
    oldVersions: {
        name: string;
        type: string;
        attributes: {
            id: string;
            typeId: string;
            type: string;
            value: string;
        }[];
        links: {
            id: string;
            uri: string;
            description: string;
        }[];
        responsibleUsers: string[];
        changedAt: Date;
    }[];

    constructor(itemHistory: IRestItemHistory) {
        this.id = itemHistory.item.id;
        this.typeId = itemHistory.item.typeId;
        this.type = itemHistory.item.type;
        this.lastChange = itemHistory.item.lastChange;
        this.oldVersions = itemHistory.item.oldVersions?.map(v => ({
            name: v.name,
            type: v.type,
            attributes: v.attributes?.map(a => ({
                id: a.id,
                type: a.type,
                typeId: a.typeId,
                value: a.value,
            })) ?? [],
            links: v.links?.map(l => ({
                id: l.id,
                uri: l.uri,
                description: l.description,
            })) ?? [],
            responsibleUsers: v.responsibleUsers ?? [],
            changedAt: v.changedAt,
        })) ?? [];
    }
}

export class ItemHistory {
    item: ItemEntry;
    connectionsToLower: ConnectionHistory[];
    connectionsToUpper: ConnectionHistory[];

    constructor(itemHistory?: IRestItemHistory) {
        if (itemHistory) {
            this.item = new ItemEntry(itemHistory);
            this.connectionsToLower = itemHistory.connectionsToLower?.map(c => new ConnectionHistory(c)) ?? [];
            this.connectionsToUpper = itemHistory.connectionsToUpper?.map(c => new ConnectionHistory(c)) ?? [];

        }
    }
}
