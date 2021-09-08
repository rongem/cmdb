import { IConnectionRule } from '../../mongoose/connection-rule.model';
import { IConnection } from '../../mongoose/connection.model';

export class FullConnection {
    id!: string;
    typeId!: string;
    type?: string;
    ruleId!: string;
    targetId!: string;
    targetType?: string;
    targetTypeId?: string;
    targetName?: string;
    targetColor?: string;
    description!: string;

    constructor(connection?: IConnection) {
        if (connection) {
            this.id = connection.id!;
            if (connection.populated('connectionRule')) {
                this.typeId = (connection.connectionRule as IConnectionRule).connectionType.toString();
                this.ruleId = (connection.connectionRule as IConnectionRule).id!;
            }
            this.description = connection.description;
        }
    }
}
