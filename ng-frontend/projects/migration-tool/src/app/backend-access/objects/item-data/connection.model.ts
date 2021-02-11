import { RestConnection } from '../../old-rest-api/item-data/connection.model';
import { Guid } from '../../guid';

export class Connection {
    id: string;
    typeId: string;
    upperItemId: string;
    lowerItemId: string;
    ruleId: string;
    description: string;

    constructor(connection?: RestConnection) {
        if (connection) {
            this.id = Guid.parse(connection.ConnId).toString();
            this.typeId = Guid.parse(connection.ConnType).toString();
            this.upperItemId = Guid.parse(connection.ConnUpperItem).toString();
            this.lowerItemId = Guid.parse(connection.ConnLowerItem).toString();
            this.ruleId = Guid.parse(connection.RuleId).toString();
            this.description = connection.Description;
        }
    }
}
