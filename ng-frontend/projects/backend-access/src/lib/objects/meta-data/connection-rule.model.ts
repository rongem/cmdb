import { IRestConnectionRule } from '../../rest-api/meta-data/connection-rule.model';

export class ConnectionRule {
    id: string;
    upperItemTypeId: string;
    connectionTypeId: string;
    lowerItemTypeId: string;
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;

    constructor(rule?: IRestConnectionRule) {
        if (rule) {
            this.connectionTypeId = rule.connectionTypeId;
            this.id = rule.id;
            this.lowerItemTypeId = rule.lowerItemTypeId;
            this.maxConnectionsToLower = rule.maxConnectionsToLower;
            this.maxConnectionsToUpper = rule.maxConnectionsToUpper;
            this.upperItemTypeId = rule.upperItemTypeId;
            this.validationExpression = rule.validationExpression;
        }
    }
}
