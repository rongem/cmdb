import { RestConnectionHistory } from '../../rest-api/item-data/rest-connection-history.model';

export class ConnectionHistory {
    id: string;
    ruleId: string;
    typeId: string;
    typeName: string;
    reverseName: string;
    upperItemId: string;
    lowerItemId: string;
    lastChange: string;
    descriptions: string[];

    constructor(connection?: RestConnectionHistory) {
        if (connection) {
            this.id = connection.id;
            this.ruleId = connection.ruleId;
            this.typeId = connection.typeId;
            this.typeName = connection.typeName;
            this.reverseName = connection.reverseName;
            this.upperItemId = connection.upperItemId;
            this.lowerItemId = connection.lowerItemId;
            this.lastChange = connection.lastChange;
            this.descriptions = connection.descriptions;
        }
    }
}

