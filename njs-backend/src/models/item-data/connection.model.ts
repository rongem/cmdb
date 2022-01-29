import { IConnection } from '../mongoose/connection.model';
import { IConnectionRule } from '../mongoose/connection-rule.model';

export class Connection {
    id!: string;
    typeId!: string;
    upperItemId!: string;
    lowerItemId!: string;
    ruleId!: string;
    description!: string;

    constructor(connection?: IConnection) {
        if (connection) {
            this.id = connection.id!;
            this.upperItemId = connection.upperItem.toString();
            this.lowerItemId = connection.lowerItem.toString();
            if (connection.populated('connectionRule')) {
                this.ruleId = (connection.connectionRule as IConnectionRule).id;
                this.typeId = (connection.connectionRule as IConnectionRule).connectionType.toString();
            } else {
                this.ruleId = connection.connectionRule.toString();
            }
            this.description = connection.description;
        }
    }
}
