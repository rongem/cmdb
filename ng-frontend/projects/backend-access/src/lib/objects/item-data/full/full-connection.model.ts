import { RestFullConnection } from '../../../old-rest-api/item-data/full/full-connection.model';
import { Guid } from '../../../guid';

export class FullConnection {
    id: string;
    typeId: string;
    type?: string;
    ruleId: string;
    targetId: string;
    targetType?: string;
    targetTypeId?: string;
    targetName?: string;
    targetColor?: string;
    description: string;

    constructor(connection?: RestFullConnection) {
        if (connection) {
            this.id = Guid.parse(connection.id).toString();
            this.typeId = Guid.parse(connection.typeId).toString();
            this.type = connection.connectionType;
            this.ruleId = Guid.parse(connection.ruleId).toString();
            this.targetId = Guid.parse(connection.targetId).toString();
            this.targetType = connection.targetType;
            this.targetTypeId = Guid.parse(connection.targetTypeId).toString();
            this.targetName = connection.targetName;
            this.targetColor = connection.targetColor;
            this.description = connection.description;
        }
    }
}
