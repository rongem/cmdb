import { Guid } from '../../guid';

export class ConnectionRule {
    RuleId: Guid;
    ItemUpperType: Guid;
    ConnType: Guid;
    ItemLowerType: Guid;
    MaxConnectionsToUpper: number;
    MaxConnectionsToLower: number;
    ValidationExpression: string;
}
