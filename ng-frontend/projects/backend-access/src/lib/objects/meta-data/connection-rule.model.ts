import { OldRestConnectionRule } from '../../old-rest-api/meta-data/connection-rule.model';
import { RestConnectionRule } from '../../rest-api/meta-data/connection-rule.model';
import { Guid } from '../../guid';

export class ConnectionRule {
    id: string;
    upperItemTypeId: string;
    connectionTypeId: string;
    lowerItemTypeId: string;
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;

    constructor(rule?: RestConnectionRule | OldRestConnectionRule) {
        if (rule) {
            if (rule instanceof RestConnectionRule) {
                this.id = rule.id;
                this.lowerItemTypeId = rule.lowerItemTypeId;
                this.maxConnectionsToLower = rule.maxConnectionsToLower;
                this.maxConnectionsToUpper = rule.maxConnectionsToUpper;
                this.upperItemTypeId = rule.upperItemTypeId;
                this.validationExpression = rule.validationExpression;
            } else {
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
}
