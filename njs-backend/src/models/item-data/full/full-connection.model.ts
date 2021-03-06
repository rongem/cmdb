import { IConnectionPopulated } from '../../mongoose/connection.model';
import { connectionRuleField } from '../../../util/fields.constants';

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

    constructor(connection?: IConnectionPopulated) {
        if (connection) {
            this.id = connection.id!;
            if (connection.populated(connectionRuleField)) {
                this.typeId = connection.connectionRule.connectionType.toString();
                this.ruleId = connection.connectionRule.id!;
            }
            this.description = connection.description;
        }
    }
}
