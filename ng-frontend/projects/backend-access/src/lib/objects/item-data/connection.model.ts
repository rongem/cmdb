import { IRestConnection } from '../../rest-api/item-data/rest-connection.model';

export class Connection {
    id?: string;
    typeId: string;
    upperItemId: string;
    lowerItemId: string;
    ruleId: string;
    description: string;

    constructor(connection?: IRestConnection) {
        if (connection) {
            this.id = connection.id;
            this.typeId = connection.typeId;
            this.upperItemId = connection.upperItemId;
            this.lowerItemId = connection.lowerItemId;
            this.ruleId = connection.ruleId;
            this.description = connection.description;
        }
    }
}
