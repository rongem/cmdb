import { Guid } from 'backend-access';

export class ConnectionRule {
    RuleId: Guid;
    ItemUpperType: Guid;
    ConnType: Guid;
    ItemLowerType: Guid;
    MaxConnectionsToUpper: number;
    MaxConnectionsToLower: number;
    ValidationExpression: string;
}
