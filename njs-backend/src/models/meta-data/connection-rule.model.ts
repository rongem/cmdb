import { RestConnectionRule } from '../../rest-api/meta-data/connection-rule.model';
import { Guid } from '../../guid';

export class ConnectionRule {
    id!: string;
    upperItemTypeId!: string;
    connectionTypeId!: string;
    lowerItemTypeId!: string;
    maxConnectionsToUpper!: number;
    maxConnectionsToLower!: number;
    validationExpression!: string;

    constructor(rule?: RestConnectionRule) {
        if (rule) {
            this.id = Guid.parse(rule.RuleId).toString();
            this.upperItemTypeId = Guid.parse(rule.ItemUpperType).toString();
            this.connectionTypeId = Guid.parse(rule.ConnType).toString();
            this.lowerItemTypeId = Guid.parse(rule.ItemLowerType).toString();
            this.maxConnectionsToLower = rule.MaxConnectionsToLower;
            this.maxConnectionsToUpper = rule.MaxConnectionsToUpper;
            this.validationExpression = rule.ValidationExpression;
        }
    }
}
