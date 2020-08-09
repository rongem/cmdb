import { IConnection } from '../mongoose/connection.model';

export class Connection {
    id!: string;
    typeId!: string;
    upperItemId!: string;
    lowerItemId!: string;
    ruleId!: string;
    description!: string;

    constructor(connection?: IConnection) {
        if (connection) {
            this.id = connection._id.toString();
            this.upperItemId = connection.upperItem.toString();
            this.lowerItemId = connection.lowerItem.toString();
            if (connection.populated('connectionRule')) {
                this.ruleId = connection.connectionRule._id.toString();
                this.typeId = connection.connectionRule.connectionType.toString();
            } else {
                this.ruleId = connection.connectionRule.toString();
            }
            this.description = connection.description;
        }
    }
}
