import { IRestFullConnection } from '../../../rest-api/item-data/full/rest-full-connection.model';

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

    constructor(connection?: IRestFullConnection) {
        if (connection) {
            this.id = connection.id;
            this.typeId = connection.typeId;
            this.type = connection.type;
            this.ruleId = connection.ruleId;
            this.targetId = connection.targetId;
            this.targetType = connection.targetType;
            this.targetTypeId = connection.targetTypeId;
            this.targetName = connection.targetName;
            this.targetColor = connection.targetColor;
            this.description = connection.description;
        }
    }

    static copyConnection(c: FullConnection): FullConnection {
        return {
            id: c.id,
            typeId: c.typeId,
            type: c.type,
            ruleId: c.ruleId,
            targetId: c.targetId,
            targetType: c.targetType,
            targetTypeId: c.targetTypeId,
            targetName: c.targetName,
            targetColor: c.targetColor,
            description: c.description,
        };
    }
}
