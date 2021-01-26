import { RestFullConnection } from '../../../rest-api/item-data/full-connection.model';
import { OldRestFullConnection } from '../../../old-rest-api/item-data/full/full-connection.model';
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

    constructor(connection?: OldRestFullConnection | RestFullConnection) {
        if (connection) {
            if (Guid.isGuid(connection.id)) {
                connection = connection as OldRestFullConnection;
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
            } else {
                connection = connection as RestFullConnection;
                this.id = connection.id;
                this.typeId = connection.typeId;
                this.type = connection.connectionType;
                this.ruleId = connection.ruleId;
                this.targetId = connection.targetId;
                this.targetType = connection.targetType;
                this.targetTypeId = connection.targetTypeId;
                this.targetName = connection.targetName;
                this.targetColor = connection.targetColor;
                this.description = connection.description;
            }
        }
    }
}
