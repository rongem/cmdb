import { Guid } from 'guid-typescript';

export class ConnectionRule {
    RuleId: Guid;
    ItemUpperType: Guid;
    ConnType: Guid;
    ItemLowerType: Guid;
    MaxConnectionsToUpper: number;
    MaxConnectionsToLower: number;
}
