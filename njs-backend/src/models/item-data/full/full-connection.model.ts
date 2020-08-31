import { IConnectionPopulated } from '../../mongoose/connection.model';

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
            this.id = connection.id;
            this.typeId = connection.connectionRule.connectionType;
            // this.type = connection.connectionType;
            this.ruleId = connection.connectionRule._id.toString();
            // this.targetId = connection.targetId;
            // this.targetType = connection.targetType;
            // this.targetTypeId = connection.targetTypeId;
            // this.targetName = connection.targetName;
            // this.targetColor = connection.targetColor;
            this.description = connection.description;
        }
    }
}
