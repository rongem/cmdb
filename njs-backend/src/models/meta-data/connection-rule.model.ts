import { IConnectionRule } from "../mongoose/connection-rule.model";

export class ConnectionRule {
    id!: string;
    upperItemTypeId!: string;
    connectionTypeId!: string;
    lowerItemTypeId!: string;
    maxConnectionsToUpper!: number;
    maxConnectionsToLower!: number;
    validationExpression!: string;

    constructor(entity?: IConnectionRule) {
        if (entity) {
            this.id = entity._id;
            this.upperItemTypeId = entity.upperItemType.toString();
            this.lowerItemTypeId = entity.lowerItemType.toString();
            this.connectionTypeId = entity.connectionType.toString();
            this.maxConnectionsToLower = entity.maxConnectionsToLower;
            this.maxConnectionsToUpper = entity.maxConnectionsToUpper;
            this.validationExpression = entity.validationExpression;
        }
    }
}
